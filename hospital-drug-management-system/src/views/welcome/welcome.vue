<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 药品列表 -->
      <div v-if="medicineList.length !== 0">
        <h1>药品数量不足请尽快采购！！！</h1>
        <el-table border stripe :data="medicineList">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="code" label="药品编号"></el-table-column>
          <el-table-column prop="name" label="药品名称"></el-table-column>
          <el-table-column prop="number" label="药品数量"></el-table-column>
          <el-table-column prop="unit" label="单位"></el-table-column>
          <el-table-column prop="d_price" label="单价（元）"></el-table-column>
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
      </div>
      <h1 v-else>药品数量充足！！！</h1>
    </el-card>
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
      medicineList: [],
      total: 0
    };
  },
  methods: {
    async getMedicineList() {
      this.medicineList = [];
      const { data: res } = await this.$http.post("medicine", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取药品列表失败！");
      res.data.users.forEach(item => {
        if (item.number < 20) {
          this.medicineList.push(item);
        }
      });
      // this.medicineList = res.data.users;
      this.total = this.medicineList.length;
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
    }
  },
  created() {
    this.getMedicineList();
  }
};
</script>
<style scoped>
</style>
