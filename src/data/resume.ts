export interface Experience {
  id: number;
  company: string;
  role: string;
  date: string;
  cmd: string;
  desc: string;
  details: string[];
}

export const experiences: Experience[] = [
  {
    id: 1,
    company: "优课达（杭州）网络有限公司",
    role: "后端开发实习生",
    date: "2025.07 - 2025.08",
    cmd: "./show_experience --id=1",
    desc: "参与AI智能体产品后端迭代，负责ASR/TTS集成及WebSocket通信模块。",
    details: [
      "深度参与AI智能体产品的后端迭代，重点负责ASR、TTS服务集成及模型多轮上下文管理，提升服务可用性。",
      "主导后端核心通信模块开发，负责前端与RustPBX的信令转发及P2P连接撮合，全链路通信延迟控制在500ms以内。",
      "引入WebSocket三协程模型，通过inputChan和outputChan作为数据缓冲区，实现IO与业务处理完全解耦。",
      "遵循TDD开发准则，编写30+例单元测试，覆盖WebSocket、路由、数据库CRUD等核心路径，实现75%代码覆盖率。",
      "参与实现FunctionCalling、RAG、智能体多轮对话记忆、联网搜索等智能体应用关键功能。"
    ]
  },
  {
    id: 2,
    company: "南京南方电讯有限公司",
    role: "后端开发实习生",
    date: "2025.12 - 2026.01",
    cmd: "./show_experience --id=2",
    desc: "负责会议微服务核心接口开发与性能调优，解决高并发延迟问题。",
    details: [
      "负责会议微服务核心高频接口开发与性能调优，攻克高并发场景响应延迟问题。",
      "会议/会议室列表接口性能重构：针对N+1查询问题，设计批量抓取机制将数据库交互次数从O(N)降为O(1)。",
      "通过Java 8 Stream构建内存索引实现Hash Join，替代O(N×M)嵌套循环，使接口平均响应时间降低70%+",
      "会议室列表接口索引优化：创新采用前缀匹配索引，利用部门id构建唯一部门路径实现前缀匹配替换IN SQL查询，优化后在TPS50场景下RT<100ms。"
    ]
  },
  {
    id: 3,
    company: "高性能一体化本地生活服务平台",
    role: "后端开发 (项目)",
    date: "2024.07 - 2024.10",
    cmd: "./show_project --id=1",
    desc: "基于SpringCloud微服务架构，实现高并发秒杀与多层缓存体系。",
    details: [
      "多层缓存架构设计与实现：搭建 Caffeine + Redis + 空值缓存 + 布隆过滤器 多层缓存体系，降低数据库压力超60%。",
      "针对缓存穿透、击穿问题，引入双重锁检测机制与布隆过滤器。",
      "分布式数据一致性闭环构建：设计Redis库存扣减、Kafka消息投递、数据库落库的全链路方案。",
      "通过Redis Lua脚本保证扣减原子性，配合本地消息表与补偿任务，秒杀场景数据准确率提升至99%以上。"
    ]
  }
];

export const skills = [
  "Java", "Spring Cloud", "MySQL", "Redis", "Kafka", "Docker", "Linux", "Git", "MyBatis-Plus"
];

export const socialLinks = [
  { name: "GitHub", url: "#", icon: "github" },
  { name: "Bilibili", url: "#", icon: "bilibili" },
  { name: "Email", url: "mailto:337931636@qq.com", icon: "mail" }
];
