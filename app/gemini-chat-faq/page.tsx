export const metadata={title:"Gemini Chat FAQ",description:"Answers to common questions about using Gemini Chat online, privacy, limits, accuracy, and troubleshooting.",alternates:{canonical:"/gemini-chat-faq"}};
const faqs=[
  ["What is Gemini Chat?","It is an independent third-party online AI chat interface for questions, writing, learning, brainstorming, and coding discussions."],
  ["Is Gemini Chat free?","This site offers free access with daily usage limits. Availability, limits, models, and features may change."],
  ["Does it have daily limits?","Yes. Free access is limited to protect availability and prevent abuse. A request may also be temporarily limited when too many requests arrive close together."],
  ["Is it affiliated with Google?","No. GeminiChat is independent and is not affiliated with, endorsed by, or operated by Google. Gemini is a trademark of Google LLC."],
  ["Are conversations saved?","The first version does not provide cloud chat history. Avoid entering sensitive, confidential, financial, medical, or personal information."],
  ["Can I use it on mobile?","Yes. The interface is designed for modern mobile and desktop browsers."],
  ["What can I ask it to do?","You can ask for explanations, outlines, drafts, translations, study plans, brainstorming, code discussions, and follow-up questions. Review important answers independently."],
  ["How should I write a good prompt?","State the goal, provide relevant context, specify the audience and format, and include constraints such as length or tone. The step-by-step guide has more examples."],
  ["Why was my answer incomplete?","Try asking for a shorter output, split a large request into steps, or tell the chat exactly which part needs to be expanded."],
  ["What should I do if the service is unavailable?","Wait briefly and try again. Provider outages, rate limits, configuration changes, and daily free limits can temporarily prevent a response."],
  ["Is an AI response always accurate?","No. AI can make mistakes or present outdated information. Verify important claims with reliable sources and do not treat responses as professional advice."],
  ["Can I request personal or confidential work?","Do not submit secrets, passwords, private customer data, medical records, financial details, or confidential business material."],
];
const faqSchema={"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}}))};
export default function Page(){return <main className="container section"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}}/><p className="eyebrow">FAQ</p><h1>Gemini Chat FAQ</h1><p className="section-intro">Answers about using this independent AI chat tool, writing better prompts, privacy, daily limits, and common problems.</p><div className="faq">{faqs.map(([question,answer],index)=><details open={index===0} key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div><p style={{marginTop:24}}>For practical prompting steps, read <a href="/how-to-use-gemini-chat">How to Use Gemini Chat</a> or start a conversation from the <a href="/">online chat tool</a>.</p></main>}
