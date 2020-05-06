<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品管理</el-breadcrumb-item>
      <el-breadcrumb-item>药品库存</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入药品名称"
            v-model="queryInfo.query"
            clearable
            @clear="getMedicineList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getMedicineList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 药品列表 -->
      <el-table border stripe :data="medicineList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="code" label="药品编号"></el-table-column>
        <el-table-column prop="name" label="药品名称"></el-table-column>
        <el-table-column prop="number" label="药品数量"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="d_price" label="单价（元）"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="danger" @click="store(scope)" size="mini">数据错误</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog @close="editDialogClose" title="药品库存修改" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体 -->
      <el-input placeholder="请输入内容" v-model="editForm.editValue" class="input-with-select">
        <el-select v-model="editForm.editItem" slot="prepend" placeholder="请选择" width="10%">
          <el-option label="药品名称" value="name"></el-option>
          <el-option label="药品数量" value="number"></el-option>
          <el-option label="单价" value="d_price"></el-option>
        </el-select>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMedicineInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前页显示多少数据
        pagesize: 2
      },
      addDialogVisible: false,
      medicineList: [],
      total: 0,
      addForm: {
        code: "",
        name: "",
        number: "",
        unit: "",
        d_price: ""
      },
      // 药品入库表单的验证规则对象
      addFormRules: {
        name: [
          {
            required: true,
            message: "请输入药品名称",
            trigger: "blur"
          }
        ],
        number: [
          {
            required: true,
            message: "请输入药品数量",
            trigger: "blur"
          },
          {
            type: "number",
            message: "数量必须为数字",
            trigger: "blur"
          }
        ],
        unit: [
          {
            required: true,
            message: "请输入单位",
            trigger: "blur"
          }
        ],
        d_price: [
          {
            required: true,
            message: "请输入单价",
            trigger: "blur"
          },
          {
            type: "number",
            message: "单价必须为数字",
            trigger: "blur"
          }
        ]
      },
      editForm: {
        code: "",
        editValue: "",
        editItem: "药品编号",
      },
    };
  },
  methods: {
    async getMedicineList() {
      const { data: res } = await this.$http.post("medicine", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取药品列表失败！");
      this.medicineList = res.data.users;
      this.total = res.data.total;
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getMedicineList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getMedicineList();
    },
    // 药品数据错误
    store(scope) {
      this.addForm.code = scope.row.code;
      this.addForm.name = scope.row.name;
      this.addForm.number = Number(scope.row.number);
      this.addForm.unit = scope.row.unit;
      this.addForm.d_price = Number(scope.row.d_price);
      this.editForm.code = scope.row.code;
      this.addDialogVisible = true;
    },
    editDialogClose() {
      this.addForm = {
        code: "",
        name: "",
        number: "",
        unit: "",
        d_price: ""
      };
    },
    // 存储药品修改后的信息
    async saveMedicineInfo() {
      const { data: res } = await this.$http.post("/medicine/medicineEdit", {
        params: this.editForm
      });
      if (res.meta.status !== 200)
        return this.$message.error("修改药品列表失败！");
      this.$message.success("修改成功!")
      this.getMedicineList();
      this.addDialogVisible = false
    }
  },
  created() {
    this.getMedicineList();
  }
};
</script>
<style scoped>
</style>