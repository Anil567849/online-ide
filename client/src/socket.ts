import { io } from 'socket.io-client'

const socket = io('http://localhost:9001')

export default socket