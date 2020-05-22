<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品管理</el-breadcrumb-item>
      <el-breadcrumb-item>药品采购</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入采购人" v-model="queryInfo.query" clearable @clear="buyMedicine">
            <el-button slot="append" icon="el-icon-search" @click="buyMedicine"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true; getUnit();getCompany()">药品采购</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table border stripe :data="medicineBuyList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="code" label="药品编号"></el-table-column>
        <el-table-column prop="name" label="药品名称"></el-table-column>
        <el-table-column prop="number" label="数量"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="manufacturers" label="生产厂商"></el-table-column>
        <el-table-column prop="order_unit" label="订货单位"></el-table-column>
        <el-table-column prop="supply_unit" label="供货单位"></el-table-column>
        <el-table-column prop="user" label="采购人"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column label="是否处理">
          <template v-slot="scope">
            <el-button
              size="mini"
              v-if="scope.row.handle == '未处理'"
              type="primary"
              @click="handleClick(scope)"
            >未处理</el-button>
            <el-button size="mini" v-else type="primary" disabled>已处理</el-button>
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
    <el-dialog title="药品采购" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="药品名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="药品编号" prop="code">
          <el-input v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model.number="addForm.number"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select width="100%" v-model="addForm.unit" placeholder="请选择">
            <el-option
              v-for="item in medicineOption"
              :key="item.id"
              :label="item.unit"
              :value="item.unit"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产厂商" prop="manufacturers">
          <el-select width="100%" v-model="addForm.manufacturers" placeholder="请选择">
            <el-option
              v-for="item in manufacturersList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订货单位" prop="order_unit">
          <el-input v-model="addForm.order_unit"></el-input>
        </el-form-item>
        <el-form-item label="供货单位" prop="supply_unit">
          <el-select v-model="addForm.supply_unit" placeholder="请选择">
            <el-option
              v-for="item in manufacturersList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购人" prop="user">
          <el-input v-model.number="addForm.user"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model.number="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
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
    // 手机号校验
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[123567890]|17[678]|18[0-9]|14[57]|199)[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前页显示多少数据
        pagesize: 2
      },
      medicineBuyList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        name: "",
        number: "",
        unit: "",
        manufacturers: "",
        order_unit: "",
        supply_unit: "",
        user: "",
        mobile: "",
        date: "",
        code: "",
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
        manufacturers: [
          {
            required: true,
            message: "请输入生产厂商",
            trigger: "blur"
          }
        ],
        order_unit: [
          {
            required: true,
            message: "请输入订货单位",
            trigger: "blur"
          }
        ],
        supply_unit: [
          {
            required: true,
            message: "请输入供货单位",
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
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            validator: checkMobile,
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
      manufacturersList: []
    };
  },
  methods: {
    async buyMedicine() {
      const { data: res } = await this.$http.get("medicine/buy", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取采购列表失败！");
      this.total = res.data.total;
      this.medicineBuyList = res.data.buyList;
    },
    // 获取单位列表
    async getUnit() {
      const { data: res } = await this.$http.get("roles/unit");
      if (res.meta.status !== 200)
        return this.$message.error("获取单位列表失败！");
      this.medicineOption = res.data.data;
    },
    // 获取供货商列表
    async getCompany() {
      const { data: res } = await this.$http.get("roles/company");
      if (res.meta.status !== 200)
        return this.$message.error("获取供货商列表失败！");
      this.manufacturersList = res.data.data;
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.buyMedicine();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.buyMedicine();
    },
    saveMedicineInfo() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return null;
        const { data: res } = await this.$http.put(
          "medicine/buy",
          this.addForm
        );
        if (res.meta.status !== 200)
          return this.$message.error("添加采购列表失败！请检查后重试");
        this.addDialogVisible = false;
        this.buyMedicine();
        this.$message.success("添加入库信息成功！");
      });
    },
    async handleClick(scope) {
      console.log(scope)
      let handle = {
        id: scope.row.id,
        handle: "已处理"
      };
      const { data: res } = await this.$http.post("medicine/buy", handle);
      if (res.meta.status !== 200)
        return this.$message.error("处理失败！请检查后重试");
      this.addDialogVisible = false;
      this.buyMedicine();
      this.$message.success("处理采购成功！");
    }
  },
  created() {
    this.buyMedicine();
  }
};
</script>
<style scoped>
</style>