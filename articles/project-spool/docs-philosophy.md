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

*The purpose of this doc is to collaboratively brainstorm and articulate the **purpose of docs** and how we can use docs to **unify our thinking**.*

~

# Spool Docs Philosophy

- We (Microsoft) have communications infrastructure that works really well at scale. COVID-19 has proven that.
- Our comms infrastructure is an asset that we can leverage to the benefit of both customers *and* our bottom line.
- Spool is the product that we're building to expose our comms infrastructure to the broader market. Two teams are working together to make this happen: IC3 and Azure.
- The **infrastructure** and **customer experience** are owned primarily by IC3, while the **offering through Azure** is owned by Azure. A positive customer experience (marketing, acquisition, conversion, consumption, retention) depends on effective collaboration between these two teams.
- **Docs are a forcing function** for clarity between stakeholders as we approach public preview and GA.
- **Docs can serve as the North Star** - the source of truth - for all stakeholders as ambiguity is minimized.
- One of our primary acquisition channels will be our docs. It's where developers decide that we can solve their problems, and it's likely that they'll find our docs when they search for our product.
- The **most obvious problems that we solve** for our customers are:
  - Adding calling to their apps
  - Adding chat to their apps
  - Adding SMS to their apps
  - Consolidating the billing of Azure customers who depend on Twilio for things that Spool offers (phone number provisioning, PSTN, SMS)
- The types of customers **who we can help most** are:
  - Those who currently manage their own WebRTC and/or telephony infrastructure.
  - Existing Azure customers who use Twilio and other competitors for things that we can do for them (phone number provisioning, sms, calling).
   - Some use-cases have been listed in the [About Spool page](https://review.docs.microsoft.com/en-us/azure/project-spool/overview?branch=pr-en-us-104477).
- As a developer, I decide to pay (or advocate for) a service when it's painless. I look for simplicity that **doesn't make me think**. If the docs don't make me think, then I trust that the product won't make me think.
- **We can use docs to unify our thinking in service of our customer's need for simplicity.** To facilitate that, a docs skeleton has been created. We can all add meat to the skeleton.
- Our docs can be used to identify and reconcile ambiguity. Points of ambiguity will be documented at the top of each page under development.
- The core priorities of docs are **simplicity** and **progress**.
- To make progress, **all primitive owners can contribute docs and samples**. Mick's role is not to create all docs - it's to integrate and edit content while providing docs-ops support.
- To maintain progress and accountability, **we need to track docs ownership and status**. This is being tracked [here](https://microsoft.sharepoint-df.com/:x:/t/IC3SDK/EasbZy5MyMBLq2S0NyTNBVABhKiR6r8bq8Ld8clQQkgOeA?e=jxpgWn).
- The most mature components of our product are Calling (voice + video) and SMS. These are the first scenarios we'll complete depth-first. Then we'll expand breadth of our docs.


## Also

- Since we're all new to the ever-evolving tools and processes supporting docs, **we need to move quickly** in order to surface gotchas and risks from both product and docs sooner than later.
- We also have to prove out the **auto-generation of reference docs**. The prerequisite to testing these pipelines is prepared SDKs (non-REST) and Swagger Specs (REST). This process is outlined here: [Link](https://review.docs.microsoft.com/en-us/azure/project-spool/automatingreferencedocs?branch=pr-en-us-104477)
- References we can use as we develop our docs:
  - Twilio: [Link](https://www.twilio.com/docs/glossary/what-is-voip)
  - MSFT Cognitive Services: [Link](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/quickstarts/text-analytics-sdk?pivots=programming-language-javascript&tabs=version-3#sentiment-analysis)
  - Nexmo: [Link](https://developer.nexmo.com/documentation)
  - Firebase: [Link](https://firebase.google.com/docs?gclid=Cj0KCQjw6sHzBRCbARIsAF8FMpVEA7WidBpgSSFMLqD1J7X1E9h9vqhrjwyZb2qtOzGpNl_mQQz4KcAaAuqgEALw_wcB)
  - Stripe: [Link](https://stripe.com/docs?utm_campaign=paid_brand-US%20|%20Search%20|%20Category%20|%20Stripe_sitelinkNov1-1803852691&utm_medium=cpc&utm_source=google&ad_content=344587125070&utm_term=stripe%20docs&utm_matchtype=e&utm_adposition=&utm_device=c&gclid=Cj0KCQjw6sHzBRCbARIsAF8FMpVSUUXEM4Bihhj0E37fKdMJMq9IYzs5-E2dU4fJQGG_arU6UekNcXYaAtW-EALw_wcB)


