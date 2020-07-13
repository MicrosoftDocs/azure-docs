---
title: ACS Docs Philosophy
description: A place to brainstorm about the purpose of docs and how we can deliver maximum value to our customers.
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

> [!WARNING]
> This is a temporary page.  **This will not be published.*** 

~

### ACS Docs Philosophy

- **Docs are a forcing function** for clarity between stakeholders as we approach public preview and GA.
- **Docs can serve as the North Star** - the source of truth - for all stakeholders as ambiguity is minimized.
- **We can write docs first** as a way to empathize with our customers and then tailor our SDKs to the desired customer experience that this exercise yields.
- **One of our primary acquisition channels will be our docs**. It's where developers decide that we can solve their problems, and it's likely that they'll find our docs when they search for our product.
- As a developer, I decide to pay (or advocate for) a service when it's painless. I look for simplicity that **doesn't make me think**. If the docs don't make me think, then I trust that the product won't make me think.
- **We can use docs to unify our thinking in service of our customer's need for simplicity.** To facilitate that, a docs skeleton has been created. We can all add meat to the skeleton.
- The core priorities of docs are **simplicity** and **progress**.
- To make progress, **all primitive owners and engineers can and should contribute docs and samples**. Docs can be the thing that anchors everyone to an ever-improving, unified understanding of our desired customer experience.
- To maintain progress and accountability, **we need to track docs ownership and status**. This is being tracked [here](https://microsoft.sharepoint-df.com/:x:/t/IC3SDK/EasbZy5MyMBLq2S0NyTNBVABhKiR6r8bq8Ld8clQQkgOeA?e=jxpgWn).
- The most mature components of our product are Calling (voice + video) and SMS. These are the first scenarios we'll complete depth-first. Then we'll expand breadth of our docs.


### How Twilio Does Docs

- source: https://www.youtube.com/watch?v=hTMuAPaKMI4
- Key takeaways / principles:
  - The purpose of docs is to help developers get things done. **They don't need flowery prose for that** - they need simple code.
  - UX principles apply to docs as much as they apply to products. **"Don't make me think!"**
  - Whenever possible, the first step of any tutorial should be a **concise, minimal code snippet**.
  - Simply **reducing copy** can yield significant improvement to engagement and conversion.
- "We don't really think of ourselves as writing documentation. Everyone on our team is a developer, so we build documentation. If you build documentation like you build a product, you can really start to prioritize data and the developer experience..."
- They started using data to drive their decision-making when it comes to documentation design.
- At the time of the video, **800k users** consumed Twilio docs. Those docs have over **1000 pages**. The docs were maintained by **4 people**. They realized that this wasn't sustainable. So they invested a lot of time into designing a platform for documentation that was scalable and allowed them to collaborate with developers.
- The old mindset was "take everything you know about the technology and write a book about it. Explain the philosophy, everything that you can do with it, how it works, etc". But this mindset leads to a lot of worthless text. They found that the typical developer flow is to simply google their problem and then look for the page that clearly answers their question.
- Anecdote: This is pretty much exactly how I develop. I have a fixed number of hours to dedicate to dev every week, so every minute counts. I like staying in flow and impressing my users more than I like reading verbose narration or parsing complex samples. IMO the best docs are no docs, but if I need docs, I'd like for them to be minimal, copy-pastable solutions to clearly defined problems. This is also why I love Twilio and Stripe SDKs / docs and I loathe Google SDKs/docs. Twilio and Stripe keep me in flow while Google makes me think.
- They also found that **developers don't have time to read**. Reading long docs doesn't fit into the typical developer workflow. We need to reduce friction for developers and keep them in flow. Pages with lots of buttons and options and links and verbosity don't keep developers in flow - they create friction.
- As a developer consuming docs, you're probably looking for a solution to a problem - and **usually that solution comes in the form of code**.
- They learned that developers go straight to the code -  "how can we put **code first**?" Twilio then decided to get experimental. They understood that developers are usually trying to build real, scalable businesses. So they reduced the flowery prose and used code as the narrative structure. They stopped explaining why they built it, the architecture, the diagrams, etc. Twilio learned that **developers prefer code over text and diagrams across the board**.
- The best way to get under the skin of an application is to sit next to the person who wrote it so they could point at code and explain how it solves problems.
- The percentage of developers who completed a tutorial depended primarily on how the tutorial was built. Some of Twilio's tutorials outperformed others. They found that **there was a 30% boost to completion rate whenever the first step contained code, but less than 20 lines of code.** Instead of showing a controller and a service and error handling and try/catch logic, they started just... sharing the minimal amount of code necessary to directly and clearly solve the developer's problem. 
- Anecdote: One of the most frustrating things that I experience when consuming docs is fluff. When I want to learn how to parse an enum out of a string, I don't need a full page of context-setting code. I need a single line that shows me what I need to copy and paste to keep moving forward.
- They also found a **12% increase in completion rate if they just reduced the copy**. Fewer words = more completion.
- They also learned that developers **love how to send SMS messages when an error happens in their app**.
- When you think of documentation as a product, you can start thinking about the data that you need to inform your product design decisions.
- They used **Optimizely** for A/B testing. They used **mixpanel** to track events down the funnel. They were able to see which steps performed better than others and were then able to optimize accordingly. This is how they learned about the importance of reducing friction in the first step of their tutorials down to 20 lines of code, max. They used **usertesting** for interviews and collaboration with their users. This was super valuable to them - they selected rockstar developers and would do this every month if they could - it's gold data.
- It's easy to fall into the trap of writing a beautifully constructed narrative, but the truth is, most of the time, that effort is wasted because developers want code.
- Twilio started using **Wagtail** to build their docs because it gave them the ability to grant selective permissions to docs, and also because of a feature called **streamfields**. This allowed them to treat their docs not just as rich text, but as interactive, usable products that help devs **get shit done**.
- They started hosting all of their code samples on github and embedding them within the docs so that developers could click-to-source and submit issues, prs, etc. This also made it easy to continuously test their samples.

### Docs We Can Use For Inspiration
- References we can use as we develop our docs:
  - Twilio: [Link](https://www.twilio.com/docs/glossary/what-is-voip)
  - MSFT Cognitive Services: [Link](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/quickstarts/text-analytics-sdk?pivots=programming-language-javascript&tabs=version-3#sentiment-analysis)
  - Nexmo: [Link](https://developer.nexmo.com/documentation)
  - Firebase: [Link](https://firebase.google.com/docs?gclid=Cj0KCQjw6sHzBRCbARIsAF8FMpVEA7WidBpgSSFMLqD1J7X1E9h9vqhrjwyZb2qtOzGpNl_mQQz4KcAaAuqgEALw_wcB)
  - Stripe: [Link](https://stripe.com/docs?utm_campaign=paid_brand-US%20|%20Search%20|%20Category%20|%20Stripe_sitelinkNov1-1803852691&utm_medium=cpc&utm_source=google&ad_content=344587125070&utm_term=stripe%20docs&utm_matchtype=e&utm_adposition=&utm_device=c&gclid=Cj0KCQjw6sHzBRCbARIsAF8FMpVSUUXEM4Bihhj0E37fKdMJMq9IYzs5-E2dU4fJQGG_arU6UekNcXYaAtW-EALw_wcB)


