# SEO 执行状态

更新时间：2026-11-04

## 当前基线

- 规则版本：SEO 硬规则 v2.3.1
- 规则文件：`SEO_HARD_RULES_v2.3.1.md`
- 自动门禁：`seo_gate.py`
- 词库来源：GSC（降级口径）；Ahrefs/Semrush 尚未接入
- 会员帖数量规则：待原帖校验，不作为硬放行条件
- GSC 属性：已完成 DNS 所有权验证（Google Search Console）
- GSC Sitemap：`https://geminichat.net/sitemap.xml` 已提交，状态 Success，发现 9 个页面
- GSC 索引/性能数据：Google 正在处理，暂未产生可用报告
- 首页 URL 检查：`URL is not on Google`，状态为 `Discovered – currently not indexed`；已触发请求编入索引流程，等待 Google 处理
- 首页 HTTP 检查：自动跳转至 HTTPS
- 首页渲染检查：源码/可访问页面均包含 H1 和正文
- 首页 SEO：已补全站点级 canonical、Open Graph 元数据和 WebApplication JSON-LD
- `/gemini-chat`：已 301 重定向至首页，并从 Sitemap 移除，避免重复意图
- GA4：已接入 Measurement ID `G-GTQF58TQNL`，代码已部署
- GEO 基础项：已放行 OAI-SearchBot、ChatGPT-User、GPTBot、ClaudeBot、PerplexityBot；已发布 `/llms.txt`；已加入 Organization、WebSite、WebApplication 结构化数据；已记录首次来源和 AI 来源用户属性

## 使用原则

- 先运行门禁，再决定是否进入下一阶段。
- `WARN` 需要人工判断；`BLOCK` 不得继续批量生产或改动。
- GSC 预期内提示不进入修复队列。
- 有曝光页面不重复请求收录。

## 数据接入状态

| 数据 | 状态 |
|---|---|
| 页面清单 | 待填入 `seo-data.json` |
| GSC 收录/曝光 | 属性已接入，数据处理中 |
| Ahrefs/Semrush 词库 | 未接入 |
| 会员帖原文 | 待校验 |
