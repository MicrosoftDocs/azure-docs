<properties
   pageTitle="Developer Service Publishing Guide - Pricing Model Sample"
   description="Showcase of pricing model options available in the Azure Marketplace."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="AzureStore"
   ms.devlang="en-us"
   ms.topic="Deploy a Developer Service offer"
   ms.tgt_pltfrm="Azure"
   ms.workload=""
   ms.date="09/13/2015"
   ms.author="hascipio"/>

# Developer Service Onboarding Guide - Pricing Models

## Previous Steps
- [Developer Service Onboarding Guide - Pre-requisites][link-devsvc-guide]
- [Developer Service Onboarding Guide - Marketing Content (Non-Technical)][link-devsvc-guide-mktg]

## Pricing Models
Plans can be any combination of BASE + Overage, where BASE is monthly price and Overage is pay-per-use price (see below for more details)

|Pricing Model |Description |
|---------------|------------------------------------------|
|Monthly Only| Flat monthly rate paid at time of purchase e.g. $10/month|
|Overage (aka Usage, Meter) Based | Pay per use, which is defined by the publisher of the offer. Overage cannot be defined per seat, per user, etc as there is no concept of a fraction of a user or capability to do proration. Usage is reported by the Partner on an hourly basis. Customer pays at the of monthly billing cycle as opposed to upfront like monthly plans. |
|Free Trial | Customer may use for free for a limited time and then pay normal rates thereafter |
|Free Tier | Plan is always free |
| Migration (aka conversion or upgrade/downgrade) of Plan | Concept of a user moving from their current plan to another acceptable plan; defined by partner |

**Example:**  Contoso Developer Service Offering

| Plan | Price | Includes | Migration Path |
|-------|------|-------|-------|
|Free|$0/month|Basic functionality|Can migrate to any other plan|
|Bronze|$10/month|Basic functionality and a quota of 1,000 of feature X|Can migrate to Bronze Plus, Silver, and Gold Plans|
|Bronze Plus|* Free Trial period: $0/month + $0/meter01 * Paid period (aka Free Trial expired): $10/month + $0.05/meter01|Basic functionality and a quota of 10,000 of feature X.  Once feature X quota is used, the customer can pay per use via meter01.|Can migrate to Silver Plus and Gold Plans|
|Silver Plan|$0.15/meter01|The customer can pay-per-use via meter01, which is for feature X|Can migrate to Bronze and Gold Plans|
|Silver Plus|$20/month + $0.15/meter01 + $0.01/meter02|Basic functionality and a quota of 10,000 of feature X and 100 of feature Y.  Once feature X quota is used, the customer can pay per use via meter01.  Once feature Y quota is used, the customer can pay per use via meter02|Can migrate to Bronze Plus and Gold Plans|
|Gold|$1000/month|Quota of 10,000 of feature X, 1,000 of feature Y, and unlimited of feature Z|Can migrate to all plans except free|

## Next Steps
- [Developer Service Onboarding Guide - Building a Resource Provider][link-devsvc-guide-create-rp]

[link-devsvc-guide]:marketing-publishing-dev-services-pre-requisites.md
[link-devsvc-guide-mktg]:marketing-publishing-dev-services-marketing-content.md
[link-devsvc-guide-create-rp]:marketing-publishing-dev-services-create-resourceprovider.md
