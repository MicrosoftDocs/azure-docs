<properties
   pageTitle="Publishing Portal Marketing Content Guide"
   description="Detailed instructions on what marketing content is required to publish an Azure Marketplace offering"
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="AzureStore"
   ms.devlang="en-us"
   ms.topic="article"
   ms.tgt_pltfrm="Azure"
   ms.workload="na"
   ms.date="09/21/2015"
   ms.author="hascipio"/>

# Step 4. Getting to Staging - Offer Marketing Content Guide


## Review the Publisher Portal offer marketing data

You need to feel certain marketing details about your offering in the Azure Marketplace such as description of your product, company logos, price plans, details of plans etc. This information is used as marketing content in our Azure Portal. Please find some of the marketing data mappings [here][link-acct-creation].

## Azure Portal mappings
Below is the detailed view of how the publisher portal offer marketing details are used up on portal

* **Offer Name & Description mapping**
	![drawing][img-map-desc]

* **Product & Details mapping**
	![drawing][img-map-details]

## Publisher Portal mappings

* **Links**
    ![drawing][img-map-link]
* **Logos**
    ![drawing][img-map-logo]
* **Offer Title & Description**
    ![drawing][img-map-title]

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
|Bronze Plus|Free Trial period: $0/month + $0/meter01 |Basic functionality and a quota of 10,000 of feature X.  Once feature X quota is used, the customer can pay per use via meter01.|Can migrate to Silver Plus and Gold Plans|
|Bronze Plus| Paid period (aka Free Trial expired): $10/month + $0.05/meter01|Basic functionality and a quota of 10,000 of feature X.  Once feature X quota is used, the customer can pay per use via meter01.|Can migrate to Silver Plus and Gold Plans|
|Silver|$0.15/meter01|The customer can pay-per-use via meter01, which is for feature X|Can migrate to Bronze and Gold Plans|
|Silver Plus|$20/month + $0.15/meter01 + $0.01/meter02|Basic functionality and a quota of 10,000 of feature X and 100 of feature Y.  Once feature X quota is used, the customer can pay per use via meter01.  Once feature Y quota is used, the customer can pay per use via meter02|Can migrate to Bronze Plus and Gold Plans|
|Gold|$1000/month|Quota of 10,000 of feature X, 1,000 of feature Y, and unlimited of feature Z|Can migrate to all plans except free|


## Next Steps
- [Developer Service Onboarding Guide - Pricing Model Sample (Non-Technical)][link-devsvc-guide-pricing]
- [Developer Service Onboarding Guide - Building a Resource Provider (Technical)][link-devsvc-guide-create-rp]

[img-map-desc]:media/dev-services-pre-requisites-marketing-content-guide-acom.JPG
[img-map-details]:media/dev-services-pre-requisites-marketing-content-guide-portal-offer-map.JPG
[img-map-link]:media/dev-services-pre-requisites-marketing-content-guide-links.jpg
[img-map-logo]:media/dev-services-pre-requisites-marketing-content-guide-logos.jpg
[img-map-title]:media/dev-services-pre-requisites-marketing-content-guide-publisher-offer.png

[link-acct-creation]:marketplace-publishing-accounts-creation-registration.md
[link-devsvc-guide]:marketplace-publishing-dev-services-pre-requisites.md
[link-devsvc-guide-pricing]:marketplace-publishing-dev-services-pricing-model-sample.md
[link-devsvc-guide-create-rp]:marketplace-publishing-dev-services-create-resourceprovider.md
