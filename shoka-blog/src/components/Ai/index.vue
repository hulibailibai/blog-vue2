<template>
	<div>
		<!-- 聊天窗口 -->
		<div class="chat-container" v-show="show">
			<div class="chat-header">
				<img width="32" height="32" src="./wenxin.png" />
				<div style="margin-left:12px; flex: 1">
					<div>AI助手</div>
					<div class="model-selector">
						<el-select 
							v-model="selectedModel" 
							@change="updateUrl" 
							size="mini" 
							popper-class="model-select-dropdown"
						>
							<el-option label="ErnieBot" value="ErnieBot"></el-option>
							<el-option label="ErnieBot-Turbo" value="ErnieBot-Turbo"></el-option>
							<el-option label="BloomZ-7B" value="BloomZ-7B"></el-option>
						</el-select>
					</div>
				</div>
				<svg-icon class="close" icon-class="close" size="1.2rem" @click="show = false"></svg-icon>
			</div>

			<div class="chat-content" id="ai-chat-content">
				<div 
					v-for="(message, index) in messages" 
					:key="index" 
					class="chat-item" 
					:class="message.isUser ? 'my-chat' : ''"
				>
					<!--<img class="user-avatar" :src="message.isUser ? './1.jpg' : './wenxin.png'" alt="">-->
					<div :class="message.isUser ? 'right-info' : 'left-info'">
						<div class="user-info">
							<span class="username">{{ message.isUser ? '我' : 'AI助手' }}</span>
							<span class="model-tag" v-if="!message.isUser">使用 {{ selectedModel }}</span>
						</div>
						<div class="user-content" :class="message.isUser ? 'my-content' : ''">
							<div v-html="parseMarkdown(message.text)"></div>
						</div>
					</div>
				</div>
			</div>

			<div class="chat-footer">
				<textarea
					v-model="newMessage"
					@keydown="handleKeyDown"
					placeholder="阿巴阿巴阿巴阿巴"
					class="chat-input"
					rows="1"
				></textarea>
				<el-button
					:loading="isSending"
					@click="sendMessage"
					type="primary"
					class="send-btn"
				>
					<svg-icon icon-class="plane" size="1.5rem"></svg-icon>
				</el-button>
			</div>
		</div>

		<!-- 悬浮按钮 -->
		<div class="chat-btn" @click="toggleChat">
			<span class="unread" v-if="unreadCount > 0">{{ unreadCount }}</span>
			<img src="./1.jpg"  class="circle-image" />
		</div>
	</div>
</template>

<script>
import { ref, nextTick, watch } from "vue";
import MarkdownIt from "markdown-it";

export default {
	name: "ChatComponent",
	setup() {
		const show = ref(false);
		const messages = ref([]);
		const newMessage = ref("");
		const selectedModel = ref("ErnieBot");
		const apiUrl = ref("https://ai.akiyamamio.fun:443/api/ernie/param/chats");
		const isSending = ref(false);
		const unreadCount = ref(0);

		let userId = Math.floor(Math.random() * 900000) + 100000;

		const parseMarkdown = (text) => {
			const md = new MarkdownIt();
			return md.render(text);
		};

		const updateUrl = () => {
			if (selectedModel.value === "ErnieBot") {
				apiUrl.value = "https://ai.akiyamamio.fun:443/api/ernie/param/chats";
			} else if (selectedModel.value === "ErnieBot-Turbo") {
				apiUrl.value = "https://ai.akiyamamio.fun:443/api/turbo/param/chats";
			} else if (selectedModel.value === "BloomZ-7B") {
				apiUrl.value = "https://ai.akiyamamio.fun:443/api/bloomz7b/param/chats";
			}
			
			// 切换模型时清除历史消息
			messages.value = [];
		};

		const sendMessage = async () => {
			if (!newMessage.value.trim()) return;

			isSending.value = true;

			const userMessage = {
				id: Date.now(),
				text: newMessage.value,
				isUser: true,
			};

			messages.value.push(userMessage);
			nextTick(scrollToBottom);

			try {
				const response = await fetch(apiUrl.value, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId,
						content: newMessage.value,
					}),
				});

				if (!response.ok) {
					throw new Error(`HTTP错误! 状态码: ${response.status}`);
				}

				const data = await response.json();
				if (data && data.result) {
					messages.value.push({
						id: Date.now(),
						text: data.result,
						isUser: false,
						model: selectedModel.value
					});
				} else {
					messages.value.push({
						id: Date.now(),
						text: "对不起，未能获取有效的响应。",
						isUser: false,
						model: selectedModel.value
					});
				}
			} catch (error) {
				console.error("发送消息失败:", error);
				messages.value.push({
					id: Date.now(),
					text: `发送失败: ${error.message}`,
					isUser: false,
					model: selectedModel.value
				});
			} finally {
				newMessage.value = "";
				isSending.value = false;
				nextTick(scrollToBottom);
			}
		};

		const scrollToBottom = () => {
			const container = document.getElementById("ai-chat-content");
			if (container) {
				container.scrollTop = container.scrollHeight;
			}
		};

		const handleKeyDown = (event) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				sendMessage();
			}
		};

		const toggleChat = () => {
			show.value = !show.value;
			if (show.value) {
				nextTick(scrollToBottom);
				unreadCount.value = 0;
			}
		};

		// 监听模型切换
		watch(selectedModel, (newModel) => {
			console.log(`切换模型到: ${newModel}`);
		});

		return {
			show,
			messages,
			newMessage,
			selectedModel,
			parseMarkdown,
			updateUrl,
			sendMessage,
			handleKeyDown,
			isSending,
			toggleChat,
			unreadCount,
		};
	},
};
</script>

<style scoped>
.chat-container {
	box-shadow: 0 5px 4px rgba(0, 0, 0, 0.16);
	font-size: 14px;
	background: var(--grey-1);
	animation: bounceInUp 1s;
	animation-fill-mode: both;
	z-index: 1200;
	display: flex;
	flex-direction: column;
	border-radius: 12px;
	overflow: hidden;
}

@media (min-width: 760px) {
	.chat-container {
		position: fixed;
		bottom: 100px;
		right: 20px;
		width: 400px;
		height: calc(100% - 110px);
		max-height: 590px;
		min-height: 250px;
	}

	.close {
		display: none;
	}
}

@media (max-width: 760px) {
	.chat-container {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		border-radius: 0;
	}

	.close {
		display: block;
		margin-left: auto;
	}
}

.chat-header {
	display: flex;
	align-items: center;
	padding: 16px 20px;
	background-color: var(--grey-0);
	flex-shrink: 0;
	border-bottom: 1px solid var(--grey-2);
}

.model-selector {
	margin-top: 4px;
}

.model-selector :deep(.el-select) {
	width: 140px;
}

.model-selector :deep(.el-input__inner) {
	background: var(--grey-1);
	border: none;
	height: 28px;
	border-radius: 14px;
	padding: 0 15px;
	font-size: 12px;
}

.unread {
	position: absolute;
	width: 18px;
	height: 18px;
	text-align: center;
	border-radius: 50%;
	line-height: 20px;
	font-size: 12px;
	background: var(--color-red);
	color: var(--grey-0);
	top: -5px;
	right: -5px;
}

.chat-content {
	flex: 1;
	padding: 16px;
	overflow-y: auto;
	overflow-x: hidden;
	background-color: var(--chat-bg);
}

.chat-item {
	display: flex;
	margin-bottom: 20px;
	animation: fadeIn 0.3s;
}

@keyframes fadeIn {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
}

.user-avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	flex-shrink: 0;
	object-fit: cover;
}

.left-info {
	margin-left: 12px;
	max-width: calc(100% - 60px);
}

.right-info {
	margin-right: 12px;
	max-width: calc(100% - 60px);
}

.user-info {
	display: flex;
	align-items: center;
	margin-bottom: 6px;
	gap: 8px;
}

.username {
	font-weight: 600;
	font-size: 13px;
	color: var(--color-blue);
}

.model-tag {
	font-size: 11px;
	padding: 2px 8px;
	background: var(--grey-2);
	border-radius: 10px;
	color: var(--text-color-light);
}

.user-content {
	position: relative;
	padding: 12px 16px;
	border-radius: 18px;
	background: var(--grey-0);
	width: fit-content;
	white-space: pre-line;
	word-wrap: break-word;
	word-break: break-all;
	line-height: 1.5;
	font-size: 14px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.my-content {
	background: var(--color-blue);
	color: var(--grey-0);
	border-radius: 18px 4px 18px 18px;
}

.my-chat {
	flex-direction: row-reverse;
}

.my-chat .user-info {
	justify-content: flex-end;
}

.my-chat .username {
	color: var(--color-red);
}

.circle-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
}

.chat-btn {
  position: fixed;
  bottom: 15px;
  left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  cursor: pointer;
  z-index: 100000;
}

.chat-btn:hover {
	transform: translateY(-5px);
}

.chat-footer {
	display: flex;
	align-items: center;
	padding: 12px 16px;
	background: var(--grey-2);
	gap: 10px;
	flex-shrink: 0;
	border-top: 1px solid var(--grey-3);
}

.chat-input {
	flex: 1;
	min-height: 40px;
	max-height: 120px;
	padding: 10px 16px;
	font-size: 14px;
	color: var(--text-color);
	background: var(--grey-1);
	border: none;
	border-radius: 20px;
	resize: none;
	outline: none;
	line-height: 1.5;
	transition: all 0.2s;
}

.chat-input:focus {
	background: var(--grey-0);
	box-shadow: 0 0 0 2px var(--color-blue-light);
}

.send-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	min-width: auto;
	border-radius: 50%;
	padding: 0;
	background: var(--color-blue);
	border: none;
	transition: all 0.2s;
}

.send-btn:hover {
	transform: scale(1.1);
	background: var(--color-blue-dark);
}
</style>

<style>
.model-select-dropdown .el-select-dropdown__item {
	padding: 6px 15px;
	font-size: 12px;
}

.model-select-dropdown .el-select-dropdown__item:hover {
	background: var(--grey-1);
}
</style>