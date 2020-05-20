<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="~assets/logo.png" alt />
      </div>
      <!-- 登录表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            type="password"
            prefix-icon="iconfont icon-icon_password"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="captcha">
          <el-input
            placeholder="请输入答案"
            type="number"
            prefix-icon="iconfont icon-icon_password"
            v-model="loginForm.captcha"
          >
            <template slot="prepend">{{captcha}}</template>
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录数据绑定
      loginForm: {
        username: "",
        password: "",
        captcha: ""
      },
      captcha: "",
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
          { min: 5, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入账号密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        captcha: [{ required: true, message: "请输入答案", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 获取验证码
    async getCaptcha() {
      const { data: res } = await this.$http.get("/captcha");
      if (res.meta.status !== 200) {
        this.$message.error("获取验证码失败！");
        return;
      }
      this.captcha = res.data.captcha;
    },
    // 点击重置按钮
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    async login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post("/login", this.loginForm);
          if (res.meta.status !== 200) {
            this.getCaptcha();
            this.loginForm.captcha = "";
            return this.$message.error(res.meta.msg);
          }
          if (res.data.data.mg_state !== "1")
            return this.$message.error("当前用户不可用！请联系超级管理员！");
          if (res.data.data.role_name === "user") {
            this.$store.commit('setRole','user');
          } else {
            this.$store.commit('setRole','super_user');
          }
          this.$message.success("登录成功！");
          this.$store.commit('setIsLogin','true');
          console.log(this.$store.state.isLogin)
          this.$store.commit('setUser',res.data.data.username);
          console.log(this.$store.state.user)
          this.$router.push("/home");
        }
      });
    }
  },
  created () {
    this.getCaptcha();
  }
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 350px;
  background-color: #fff;
  border-radius: 10px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 100px;
    width: 100px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 5px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
