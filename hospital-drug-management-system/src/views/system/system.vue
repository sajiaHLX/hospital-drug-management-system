<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="changeUnit">药品单位管理</el-button>
      <el-button type="primary" @click="changeCompany">药品供货商管理</el-button>
    </el-card>

    <el-dialog @close="unitAddClose" title="管理药品单位" :visible.sync="unitDialogVisible" width="40%">
      <span>
        <el-input placeholder="请输入要添加的单位" v-model="unit">
          <el-button @click="addUnit" slot="append" icon="el-icon-plus">添加</el-button>
        </el-input>
        <el-table border stripe :data="unitList">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="unit" label="单位"></el-table-column>
          <el-table-column label="操作" width="180px">
            <template v-slot="scope">
              <div v-if="role === 'user'">你没有权限进行操作！</div>
              <div v-else>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除单位"
                  :enterable="false"
                  placement="top"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removeUnitById(scope.row.id)"
                  ></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="()=>{unitDialogVisible = false; unit='';}">取 消</el-button>
        <el-button type="primary" @click="unitDialogVisible = false;unit='';">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="管理药品供货商" :visible.sync="companyDialogVisible" width="50%">
      <span>
        <p>
          <el-input placeholder="请输入要添加的供货商" v-model="company">
            <el-button @click="addCompany" slot="append" icon="el-icon-plus">添加</el-button>
          </el-input>
          <el-table border stripe :data="companyList">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="name" label="供货商"></el-table-column>
            <el-table-column label="操作" width="180px">
              <template v-slot="scope">
                <div v-if="role === 'user'">你没有权限进行操作！</div>
                <div v-else>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除供货商"
                    :enterable="false"
                    placement="top"
                  >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="removeCompanyById(scope.row.id)"
                    ></el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </p>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="companyDialogVisible = false; company = '';">取 消</el-button>
        <el-button type="primary" @click="companyDialogVisible = false; company = '';">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      unitDialogVisible: false,
      companyDialogVisible: false,
      addForm: {
        code: "",
        name: "",
        number: "",
        unit: "",
        d_price: ""
      }, // 药品入库表单的验证规则对象
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
      selectunitId: "",
      unitList: [],
      companyList: [],
      role: window.sessionStorage.getItem("super_user"),
      unit: "",
      company: ""
    };
  },
  methods: {
    // 获取单位列表
    async getUnitList() {
      const { data: res } = await this.$http.get("roles/unit");
      this.unitList = res.data.data;
    },
    // 获取供货商列表
    async getCompanyList() {
      const { data: res } = await this.$http.get("roles/company");
      this.companyList = res.data.data;
    },
    // 修改药品单位
    changeUnit() {
      this.unitDialogVisible = true;
      this.getUnitList();
    },
    // 添加单位
    async addUnit() {
      let unit = this.unit.trim();
      if (unit === "") {
        this.$message("请输入内容");
      } else {
        const { data: res } = await this.$http.get(`roles/unit?unit=${unit}`);
        if (res.meta.status === 500) {
          this.$message.error("请检查单位是否重复！");
        } else {
          this.$message.success("添加成功！");
          this.unit = "";
          this.getUnitList();
        }
      }
    },
    // 关闭窗口
    unitAddClose() {
      this.unit = "";
      this.company = "";
    },
    // 删除单位
    async removeUnitById(id) {
      const { data: res } = await this.$http.delete(`roles/unit?id=${id}`);
      if (res.meta.status === 500) {
        this.$message.error("请检查单位是否重复！");
      } else {
        this.$message.success("删除成功！");
        this.getUnitList();
      }
    },
    // 打开窗口并获取供货公司
    changeCompany() {
      this.companyDialogVisible = true;
      this.getCompanyList();
    },
    // 删除供货公司
    async removeCompanyById(id) {
      const { data: res } = await this.$http.delete(`roles/company?id=${id}`);
      if (res.meta.status === 500) {
        this.$message.error("请检查单位是否重复！");
      } else {
        this.$message.success("删除成功！");
        this.getCompanyList();
      }
    },
    // 添加单位
    async addCompany() {
      let company = this.company.trim();
      if (company === "") {
        this.$message("请输入内容");
      } else {
        const { data: res } = await this.$http.get(
          `roles/company?company=${company}`
        );
        if (res.meta.status === 500) {
          this.$message.error("请检查供货商是否重复！");
        } else {
          this.$message.success("添加成功！");
          this.unit = "";
          this.getCompanyList();
        }
      }
    }
  }
};
</script>
<style scoped>
</style>