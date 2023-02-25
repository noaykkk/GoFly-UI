<template>
  <div class="login_container">
    <div class="login_box">
      <!--头部-->
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="">
      </div>
      <!--登录表单区域-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="userName">
          <el-input placeholder="请输入用户名" v-model="loginForm.userName" prefix-icon="iconfont icon-user">
          </el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"
                    type="password"></el-input>
        </el-form-item>
        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" @keyup.enter="login">登录</el-button>
          <el-button type="success" @click="registerClick">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
        title="注册"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose">
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules">
        <!--邮箱-->
        <el-form-item prop="email">
          <el-input placeholder="请输入邮箱" v-model="registerForm.email" prefix-icon="iconfont icon-user">
          </el-input>
        </el-form-item>
        <!--用户名-->
        <el-form-item prop="userName">
          <el-input placeholder="请输入用户名" v-model="registerForm.userName" prefix-icon="iconfont icon-user">
          </el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="registerForm.password" prefix-icon="iconfont icon-3702mima"
                    type="password"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="againPassword">
          <el-input placeholder="请再次输入密码" v-model="registerForm.againPassword" prefix-icon="iconfont icon-3702mima"
                    type="password"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item prop="code">
              <el-input placeholder="请输入验证码" v-model="registerForm.code">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!--            <el-button @click="registerCodeSubmit">获取验证码</el-button>-->
            <el-button type="primary" v-show="timeTrue == true" @click="registerCodeSubmit">获取验证码</el-button>
            <el-button type="primary" v-show="timeTrue == false">{{ time }}秒后重新获取</el-button>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="registerSubmit">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {registerCode, login, register} from '@/api/open'
import router from "@/router";
import {Message} from "element-ui";

export default {
  data() {
    return {
      timeTrue: true,
      time: 0,
      // 这是登录表单的数据绑定对象
      loginForm: {
        userName: '',
        password: ''
      },
      registerForm: {
        userName: "",
        email: "",
        password: "",
        againPassword: "",
        code: ""
      },
      // 这是表单规则的对象
      loginFormRules: {
        // 验证用户名是否合法
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],

      },
      //祖册邮箱验证
      registerFormRules: {
        //邮箱验证
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: function (rule, value, callback) {
              if (
                  /^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/i.test(
                      value
                  ) == false
              ) {
                callback(new Error("邮箱格式错误"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        // 验证用户名是否合法
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        againPassword: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              let _this = this
              if (_this.registerForm.password !== value) {
                callback(new Error("两次密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ],
      },
      //模态框控制
      dialogVisible: false
    }
  },
  methods: {
    //获取验证码
    registerCodeSubmit() {
      if (!this.registerForm.email) {
        Message.error("请输入邮箱")
        return
      }
      this.timeTrue = false;
      registerCode({email: this.registerForm.email}).then(res => {
        if (res.status === 200) {
          this.time = 60;
          let setTimeoutS = setInterval(() => {
            this.time--;
            if (this.time <= 0) {
              clearInterval(setTimeoutS);
              this.timeTrue = true;
            }
          }, 1000);
        } else {
          Message.error(res.statusText)
          this.timeTrue = true;
        }
      })
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.registerFormRef.resetFields()
    },
    //重置token
    restToken() {
      if (localStorage.getItem("token")) {
        router.replace({
          path: "/index"
        })
      }
    },
    // 点击注册
    registerClick() {
      this.dialogVisible = !this.dialogVisible
    },
    registerSubmit() {
      let _this = this
      // 表单预验证
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return
        register(this.registerForm).then(res => {
          if (res.status === 200) {
            Message.success(res.statusText)
            _this.handleClose()
          }else{
            Message.error(res.statusText)
          }
        })


      })
    },
    login() {
      // let loginForm = this.loginForm
      // 表单预验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return // 如果表单校验不通过，就直接返回
        login(this.loginForm).then(res => {
          console.log(res)
          if (res.status === 200) {
            //将数据保存
            localStorage.setItem("token",res.data.token)
            localStorage.setItem("token",res.data.refresh_token)
            localStorage.setItem("identity",res.data.identity)
            this.$router.push('/index')
          }else{
            Message.error(res.statusText)
          }
        })
      })
    }
  },
  created() {
    this.restToken()
  }
}
</script>

<style lang="less" scoped>
.login_container {
  //background-image: url("../../assets/bg.jpeg");
  background-size: 100%;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  //div居中
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
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

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
