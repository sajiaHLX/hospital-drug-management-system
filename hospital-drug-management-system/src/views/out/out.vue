<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品管理</el-breadcrumb-item>
      <el-breadcrumb-item>药品出库</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入经手人" v-model="queryInfo.query" clearable @clear="getMedicineIn">
            <el-button slot="append" icon="el-icon-search" @click="getMedicineIn"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">药品出库</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table border stripe :data="medicineInList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="code" label="药品编号"></el-table-column>
        <el-table-column prop="name" label="药品名称"></el-table-column>
        <el-table-column prop="number" label="入库数量"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="pl_price" label="批发零售价"></el-table-column>
        <el-table-column prop="pd_price" label="批发单价"></el-table-column>
        <el-table-column prop="user" label="经手人"></el-table-column>
        <el-table-column prop="data" label="日期"></el-table-column>
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
    <el-dialog title="药品出库" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="药品编号" prop="code">
          <el-input v-model="code"></el-input>
        </el-form-item>
        <el-form-item label="药品名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model.number="addForm.number"></el-input>
        </el-form-item>
        <el-form-item :disabled="true" label="单位" prop="unit">
          <el-input v-model="addForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="批发零售价" prop="pj_price">
          <el-input v-model.number="addForm.pl_price"></el-input>
        </el-form-item>
        <el-form-item label="批发单价" prop="pd_price">
          <el-input v-model.number="addForm.pd_price"></el-input>
        </el-form-item>
        <el-form-item label="经手人" prop="user">
          <el-input v-model="addForm.user"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="data">
          <el-date-picker v-model="addForm.date" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
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
      medicineInList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        code: "",
        name: "",
        number: "",
        unit: "",
        pl_price: "",
        pd_price: "",
        user: "",
        date: ""
      },
      code: "",
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
        pd_price: [
          {
            required: true,
            message: "请输入批发单价",
            trigger: "blur"
          },
          {
            type: "number",
            message: "批发单价必须为数字",
            trigger: "blur"
          }
        ],
        pl_price: [
          {
            required: true,
            message: "请输入批发零售价",
            trigger: "blur"
          },
          {
            type: "number",
            message: "批发零售价必须为数字",
            trigger: "blur"
          }
        ],
        user: [
          {
            required: true,
            message: "请输入经手人",
            trigger: "blur"
          }
        ],
        date: [
          {
            required: true,
            message: "请选择日期",
            trigger: "blur"
          }
        ]
      },
      fun: ''
    };
  },
  methods: {
    debounce(fn, wait) {
      if (this.fun !== null) {
        clearTimeout(this.fun);
      }
      this.fun = setTimeout(fn, wait);
    },
    async getMedicineIn() {
      const { data: res } = await this.$http.post("medicine/out", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取出库列表失败！");
      this.medicineInList = res.data.users;
      this.total = res.data.total;
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getMedicineIn();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getMedicineIn();
    },
    saveMedicineInfo() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return null;
        const { data: res } = await this.$http.put(
          "medicine/out",
          this.addForm
        );
        if (res.meta.status !== 200) return this.$message.error(res.data.msg);
        this.addDialogVisible = false;
        this.getMedicineIn();
        this.addForm = {
          code: "",
          name: "",
          number: "",
          unit: "",
          pl_price: "",
          pd_price: "",
          user: "",
          date: ""
        };
        this.$message.success("添加出库信息成功！");
      });
    },
    // get username by id
    async getMedicineById() {
      let data = {
        code: this.code
      };
      const { data: res } = await this.$http.get("medicine", {
        params: data
      });
      this.addForm.code = this.code;
      if (res.meta.status !== 200)
        return this.$message.error("获取药品数据失败！");
      if (res.data.users.length === 1) {
        this.addForm.name = res.data.users[0].name;
        this.addForm.unit = res.data.users[0].unit;
      } else {
        this.$message.error("获取药品数据失败！");
        this.addForm.name = "";
        this.addForm.unit = "";
      }
    }
  },
  created() {
    this.getMedicineIn();
  },
  watch: {
    code() {
      this.debounce(this.getMedicineById, 500);
    }
  }
};
</script>
<style scoped>
</style>