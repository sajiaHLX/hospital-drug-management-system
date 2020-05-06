<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品管理</el-breadcrumb-item>
      <el-breadcrumb-item>药品入库</el-breadcrumb-item>
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
          <el-button type="primary" @click="addDialogVisible = true; getUnit()">药品入库</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table border stripe :data="medicineInList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="code" label="药品编号"></el-table-column>
        <el-table-column prop="name" label="药品名称"></el-table-column>
        <el-table-column prop="number" label="入库数量"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="d_price" label="药品单价"></el-table-column>
        <el-table-column prop="j_price" label="药品进价"></el-table-column>
        <el-table-column prop="pay_price" label="实付金额"></el-table-column>
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
    <el-dialog title="药品入库" :visible.sync="addDialogVisible" width="50%">
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
        <el-form-item label="单位" prop="unit">
          <el-input v-if="!isShowSelect" :disabled="true" v-model="addForm.unit"></el-input>
          <el-select width="100%" v-else v-model="addForm.unit" placeholder="请选择">
            <el-option
              v-for="item in medicineOption"
              :key="item.id"
              :label="item.unit"
              :value="item.unit"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单价" prop="d_price">
          <el-input v-model.number="addForm.d_price"></el-input>
        </el-form-item>
        <el-form-item label="进价" prop="j_price">
          <el-input v-model.number="addForm.j_price"></el-input>
        </el-form-item>
        <el-form-item label="总金额" prop="pay_price">
          <el-input v-model.number="addForm.pay_price"></el-input>
        </el-form-item>
        <el-form-item label="经手人" prop="user">
          <el-input v-model="addForm.user"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="data">
          <el-date-picker v-model="addForm.date" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClose">取 消</el-button>
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
        d_price: "",
        j_price: "",
        pay_price: "",
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
        ],
        j_price: [
          {
            required: true,
            message: "请输入进价",
            trigger: "blur"
          },
          {
            type: "number",
            message: "进价必须为数字",
            trigger: "blur"
          }
        ],
        pay_price: [
          {
            required: true,
            message: "请输入总金额",
            trigger: "blur"
          },
          {
            type: "number",
            message: "总金额必须为数字",
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
      medicineOption: [],
      isShowSelect: true,
    };
  },
  methods: {
    async getMedicineIn() {
      const { data: res } = await this.$http.post("medicine/in", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取入库列表失败！");
      this.medicineInList = res.data.users;
      this.total = res.data.total;
    },
    async getUnit() {
      const { data: res } = await this.$http.get("roles/unit");
      if (res.meta.status !== 200)
        return this.$message.error("获取单位列表失败！");
      this.medicineOption = res.data.data;
    },
    // get username by id
    async getMedicineById(code) {
      let data = {
        code: code
      };
      const { data: res } = await this.$http.get("medicine", {
        params: data
      });
      this.addForm.code = code;
      if (res.meta.status !== 200)
        return this.$message.error("获取药品数据失败！");
      if (res.data.users.length === 1) {
        this.addForm.name = res.data.users[0].name;
        this.addForm.unit = res.data.users[0].unit;
        this.addForm.d_price = Number(res.data.users[0].d_price);
        this.addForm.j_price = Number(res.data.users[0].j_price);
        this.isShowSelect = false;
      } else {
        this.addForm.name = "";
        this.addForm.unit = "";
        this.addForm.d_price = "";
        this.addForm.j_price = "";
        this.isShowSelect = true;
      }
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
        const { data: res } = await this.$http.put("medicine/in", this.addForm);
        if (res.meta.status !== 200) {
          this.addForm = {
            code: "",
            name: "",
            number: "",
            unit: "",
            d_price: "",
            j_price: "",
            pay_price: "",
            user: "",
            date: ""
          };
          return this.$message.error("更新用户失败！请检查药品编号是否重复");
        }
        this.addDialogVisible = false;
        this.getMedicineIn();
        this.addForm = {
          code: "",
          name: "",
          number: "",
          unit: "",
          d_price: "",
          j_price: "",
          pay_price: "",
          user: "",
          date: ""
        };
        this.$message.success("添加入库信息成功！");
      });
    },
    addDialogClose() {
      this.addDialogVisible = false;
      this.addForm = {
        code: "",
        name: "",
        number: "",
        unit: "",
        d_price: "",
        j_price: "",
        pay_price: "",
        user: "",
        date: ""
      };
    }
  },
  created() {
    this.getMedicineIn();
  },
  watch: {
    code(newValue) {
      this.getMedicineById(newValue);
    }
  }
};
</script>
<style scoped>
</style>