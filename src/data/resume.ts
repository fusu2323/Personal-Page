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
      "针对AI智能体后端迭代需求，主攻ASR/TTS集成及上下文管理，提升服务可用性，获团队认可。",
      "承接后端通信模块核心开发任务，搭建SSE通道并联动音频链路，攻克全链路延迟难题，实现延迟≤500ms，支撑核心业务闭环高效运行。",
      "应对高并发数据一致性及耦合问题，引入三协程模型解耦IO与业务，加互斥锁防护，提升并发设计能力，强化系统稳定性与故障隔离能力。",
      "编写30+单元测试覆盖核心路径，达成75%覆盖率，提前修复信令空指针问题，保障代码质量。",
      "参与解决大模型幻觉与记忆过载痛点，通过AgenticRAG与FunctionCalling集成，提升产品智能化体验。"
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
      "针对会议微服务高并发接口响应问题进行性能调优，通过慢SQL排查和数据库查询优化，将平均响应延迟降低80%，提升系统稳定性与用户体验，获导师认可。",
      "协同导师重构会议及会议室列表核心接口，优化预约、查询等功能性能，接口响应时间缩短50%，获客户高度评价。",
      "创新设计部门ID前缀匹配索引策略，解决部门维度查询IN SQL低效问题，查询性能提升超10倍，获直属上级肯定。",
      "推进接口文档规范化建设，梳理更新所属接口文档至Apifox，保障文档精准完整，提升团队协作效率，获团队认可。"
    ]
  },
  {
    id: 3,
    company: "天公作美气象影像交流平台",
    role: "后端开发 (项目)",
    date: "2025.10 - 2026.01",
    cmd: "./show_project --id=1",
    desc: "基于SpringCloud微服务架构，实现高并发秒杀与多层缓存体系。",
    details: [
      "多层缓存架构设计与实现：搭建“OpenResty本地缓存->Redis分布式缓存->Caffeine进程缓存->DB”多层缓存体系，结合缓存金字塔设计理念，将热点数据分级存储。降低数据库压力超60%，减少热点击穿风险。",
      "针对缓存穿透、击穿问题，引入双重锁检测机制，避免缓存失效时大量请求穿透至数据库；通过布隆过滤器精准过滤不存在的key，空值缓存设置短期TTL减少重复查询。",
      "分布式数据一致性闭环构建：设计Redis库存扣减、订单创建、Kafka消息投递、数据库落库的全链路状态流转方案。",
      "通过Redis Lua脚本保证扣减原子性，基于Kafka实现消息可靠投递与异步处理，配合本地消息表与补偿任务，秒杀场景数据准确率提升至99%以上。"
    ]
  }
];

export const skills = [
  "Java", "Golang", "Spring Cloud", "Spring Boot", "MySQL", "Redis", "Kafka", "Docker", "K8s", "Linux", "Git", "MyBatis-Plus", "JUC", "JVM"
];

export const socialLinks = [
  { name: "GitHub", url: "https://github.com/fusu2323", icon: "github" },
  { name: "Bilibili", url: "https://space.bilibili.com/108185664?spm_id_from=333.337.0.0", icon: "bilibili" },
  { name: "Email", url: "mailto:17715383953@163.com", icon: "mail" }
];
