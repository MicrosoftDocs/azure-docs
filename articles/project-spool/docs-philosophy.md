---
title: Spool Docs Philosophy
description: A place to brainstorm about the purpose of docs and how we can deliver maximum value to our customers.
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

# Spool Docs Philosophy

- We (Microsoft) have invested lots of money into developing communications infrastructure that works really well at scale. COVID-19 has proven that.
- Our comms infrastructure is an asset that we can leverage to the benefit of both customers *and* our bottom line.
- Spool is the product that we're building to expose our comms infrastructure to the market. The way that we do that is a product of ideas held by both IC3 and Azure.
- The **infrastructure** and **customer experience** are owned primarily by IC3, while the **offering through Azure** is owned by Azure. A positive customer experience (marketing, acquisition, conversion, consumption, retention) depends on effective collaboration between these two teams.
- We need to deliver a crisp, cohesive customer experience that delivers "ah-ha" moments as clearly as possible across all acquisition channels.
- One of the primary acquisition channels will be our docs. It's where developers decide that we can solve their problems, and it's where they'll land when they search for our product.
- The **most obvious problems that we solve** for our customers are:
  - Adding calling to their apps
  - Adding chat to their apps
  - Adding SMS to their apps
  - Consolidating the billing of Azure customers who depend on Twilio for things that Spool offers (phone number provisioning, PSTN, SMS)
- The types of customers **who we can help most** are:
  - Those who currently manage their own WebRTC and/or telephony infrastructure.
  - Existing Azure customers who use Twilio and other competitors for things that we can do for them (phone number provisioning, sms, call).
   - Use-cases have been listed in the [About page](https://review.docs.microsoft.com/en-us/azure/project-spool/overview?branch=pr-en-us-104477).
- **Docs are a forcing function** for clarity between these two teams as we approach public preview and GA.
- **Docs can serve as the North Star** - the source of truth - for both teams as "ideological drift" is minimized.
- As a developer, I decide to pay (or advocate for) a service when it's painless. I look for simplicity that **doesn't make me think**. If the docs don't make me think, then I trust that the product won't make me think.
- **We can use docs to unify our thinking in service of our customer's needs.** To do that, we need to lay down some implementation-agnostic initial scaffolding that answers the most obvious developer questions: **How can this help me? How easy is it to use?**
- As we develop our docs, we need to identify and reconcile ideological drift-points between the teams. These drift-points will be documented at the top of each page under development.
- The core priorities of docs are **simplicity** and **progress**.
- To make progess, **all primitive owners need to contribute docs and samples**. Mick's role is not to create docs - it's editorial and docs-ops support.
- To maintain progress and accountability, **we need to track docs ownership and status**. This is being tracked [here](https://microsoft.sharepoint-df.com/:x:/t/IC3SDK/EasbZy5MyMBLq2S0NyTNBVABhKiR6r8bq8Ld8clQQkgOeA?e=jxpgWn).
- The most mature components of our product are Calling (voice + video) and SMS. These are the first scenarios we'll complete depth-first. Then we'll expand breadth of our docs.



## Notes

- We also have to prove out the **auto-generation of reference docs**. The prerequisite to testing these pipelines is prepared SDKs (non-REST) and Swagger Specs (REST). This process is outlined here: [Link](https://review.docs.microsoft.com/en-us/azure/project-spool/automatingreferencedocs?branch=pr-en-us-104477)
- References we can use as we develop our docs:
  - Twilio: [Link](https://www.twilio.com/docs/glossary/what-is-voip)
  - MSFT Cognitive Services: [Link](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/quickstarts/text-analytics-sdk?pivots=programming-language-javascript&tabs=version-3#sentiment-analysis)
  - Nexmo: [Link](https://developer.nexmo.com/documentation)
  - Firebase: [Link](https://firebase.google.com/docs?gclid=Cj0KCQjw6sHzBRCbARIsAF8FMpVEA7WidBpgSSFMLqD1J7X1E9h9vqhrjwyZb2qtOzGpNl_mQQz4KcAaAuqgEALw_wcB)
  - Stripe: [Link](https://stripe.com/docs?utm_campaign=paid_brand-US%20|%20Search%20|%20Category%20|%20Stripe_sitelinkNov1-1803852691&utm_medium=cpc&utm_source=google&ad_content=344587125070&utm_term=stripe%20docs&utm_matchtype=e&utm_adposition=&utm_device=c&gclid=Cj0KCQjw6sHzBRCbARIsAF8FMpVSUUXEM4Bihhj0E37fKdMJMq9IYzs5-E2dU4fJQGG_arU6UekNcXYaAtW-EALw_wcB)


