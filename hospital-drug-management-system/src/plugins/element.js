import Vue from 'vue'
import {
  Option,
  Button,
  Select,
  Form,
  FormItem,
  Input,
  Message,
  MessageBox,
  Container,
  Aside,
  Menu,
  Main,
  Header,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Switch,
  Tooltip,
  DatePicker
} from 'element-ui'


Vue.use(DatePicker)
Vue.use(Option)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Dialog)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Card)
Vue.use(Row)
Vue.use(Table)
Vue.use(Col)
Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Main)
Vue.use(Header)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm