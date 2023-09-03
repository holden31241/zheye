import { h, render } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

// 函数式创建Message组件
const createMessage = (message: string, type: MessageType, timeout?: number) => {
  // 使用h函数创建vnode
  const messageVnode = h(Message, {
    message,
    type
  })
  // 创建挂载节点
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  // 使用render函数将vnode挂载到dom节点上
  render(messageVnode, mountNode)
  const destory = () => {
    render(null, mountNode)
    document.body.removeChild(mountNode)
  }
  // 时间到后，取消挂载，删除挂载节点
  if (timeout) {
    setTimeout(() => {
      destory()
    }, timeout)
  }
}

export default createMessage
