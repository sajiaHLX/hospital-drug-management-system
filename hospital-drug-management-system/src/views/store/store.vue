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
        <el-col :span="4">
          <el-button type="primary" @click="logDialogVisible = true; getLogList()">库存操作记录</el-button>
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

    <el-dialog
      @close="editDialogClose"
      title="药品库存修改"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <!-- 内容主体 -->
      <el-input placeholder="请输入内容" v-model="editForm.editValue" class="input-with-select">
        <el-select v-model="editForm.editItem" slot="prepend" placeholder="请选择" width="10%">
          <el-option label="药品名称" value="name"></el-option>
          <el-option label="药品数量" value="number"></el-option>
          <el-option label="单价" value="d_price"></el-option>
        </el-select>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMedicineInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      @close="logDialogClose"
      title="药品库存修改日志"
      :visible.sync="logDialogVisible"
      width="50%"
    >
      <span>
        <el-input placeholder="请输入操作员名称" v-model="logQueryInfo.query" clearable @clear="getLogList">
          <el-button slot="append" icon="el-icon-search" @click="getLogList"></el-button>
        </el-input>
        <!-- 内容主体 -->
        <el-table border stripe :data="logList">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="code" label="药品编号"></el-table-column>
          <el-table-column prop="name" label="药品名称"></el-table-column>
          <el-table-column prop="edititem" label="修改项"></el-table-column>
          <el-table-column prop="old" label="原始值"></el-table-column>
          <el-table-column prop="new" label="新值"></el-table-column>
          <el-table-column prop="user" label="操作员"></el-table-column>
          <el-table-column prop="date" label="操作时间"></el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
          @size-change="logSizeChange"
          @current-change="logCurrentChange"
          :current-page="logQueryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="logQueryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="logTotal"
        ></el-pagination>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="logDialogVisible = false">确 定</el-button>
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
      logQueryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前页显示多少数据
        pagesize: 2
      },
      editDialogVisible: false,
      logDialogVisible: false,
      medicineList: [],
      logList: [],
      total: 0,
      logTotal: 0,
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
        editItem: "",
        old: "",
        name: "",
        user: "",
        date: ""
      },
    };
  },
  methods: {
    // 获取药品列表
    async getMedicineList() {
      const { data: res } = await this.$http.post("medicine", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取药品列表失败！");
      this.medicineList = res.data.users;
      this.total = res.data.total;
    },
    // 获取操作记录列表
    async getLogList() {
      const { data: res } = await this.$http.post("medicine/log", {
        params: this.logQueryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取药品列表失败！");
      this.logList = res.data.users;
      this.logTotal = res.data.total;
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
    // 监听日志pagesize改变的事件
    logSizeChange(newSize) {
      this.logQueryInfo.pagesize = newSize;
      this.getLogList();
    },
    // 监听日志页码值改变的事件
    logCurrentChange(newPage) {
      this.logQueryInfo.pagenum = newPage;
      this.getLogList();
    },
    // 药品数据错误
    store(scope) {
      this.addForm.code = scope.row.code;
      this.addForm.name = scope.row.name;
      this.addForm.number = scope.row.number;
      this.addForm.unit = scope.row.unit;
      this.addForm.d_price = scope.row.d_price;

      this.editForm.code = scope.row.code;
      this.editForm.name = scope.row.name;
      this.editForm.user = window.sessionStorage.getItem('user');
      this.editForm.date = new Date();
      this.editDialogVisible = true;
    },
    // 弹窗关闭
    editDialogClose() {
      this.addForm = {
        code: "",
        name: "",
        number: "",
        unit: "",
        d_price: ""
      };
    },
    // 库存弹窗关闭
    logDialogClose() {
      this.logQueryInfo.query = "";
      this.logQueryInfo.pagenum = 1;
      this.logQueryInfo.pagesize = 2;
    },
    // 存储药品修改后的信息
    async saveMedicineInfo() {
      switch(this.editForm.editItem){
        case 'name':
          this.editForm.old = this.addForm.name
          break
        case 'number':
          this.editForm.old = this.addForm.number
          break
        case 'd_price':
          this.editForm.old = this.addForm.d_price
          break
      }
      const { data: res } = await this.$http.post("/medicine/medicineEdit", {
        params: this.editForm
      });
      if (res.meta.status !== 200) return this.$message.error("修改药品失败！");
      this.$message.success("修改成功!");
      this.getMedicineList();
      this.editDialogVisible = false;
      this.editForm.editValue = "";
      this.editForm.editItem = "";
    }
  },
  created() {
    this.getMedicineList();
  }
};
</script>
<style scoped>
</style>