<properties
   pageTitle="Prepare and test your offer for deployment to the Azure Marketplace | Microsoft Azure"
   description="Detailed instructions on providing marketing content, configuring pricing plans, and testing your offer before deploying to the Azure Marketplace."
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="Azure"
   ms.workload="na"
   ms.date="01/07/2016"
   ms.author="hascipio"/>

# Complete the offer creation with marketing content
In this step of the publishing process, you will need to provide certain marketing content and details about your offer and/or SKUs in the Azure Marketplace. For example, you will provide a description of your product, company logos, price plans, details of plans, and other information necessary to push your offer and/or SKU to staging. This information is used as marketing content in the Azure portal. You will begin this process in the [publishing portal][link-pubportal].

## Step 1: Provide Marketplace marketing content
**English is the default and only supported language.** Please ensure that all information provided in the fields is in English. All information can be edited at any time until you push to staging.

  1. Go to the publishing portal, [https://publish.windowsazure.com](https://publish.windowsazure.com).
  2. On the left menu, click the **Marketing** tab.
  3. In the main panel, click the **English (US)** button.

### Details
1. Enter the offer summary, long summary, and description for your offer.
2.	Upload images of the required specifications (mentioned in the publishing portal) in PNG format, one for each size.

  ![drawing](media/marketplace-publishing-push-to-staging/pubportal-02.png)

  *Offer title, description, and logos*

### Links
On the **Links** tab on the left bar, enter any links with information that may help customers. Enter a name and URL for each link.

![drawing](media/marketplace-publishing-push-to-staging/pubportal-02.png)

### Sample images (optional)
> [AZURE.NOTE] Including a sample image is an optional step. You could complete the other marketing content to fulfill requirements for the push to staging.

On the **Sample Images** tab on the left menu, upload a new image by clicking **Upload a new image**. If you have an existing image and you would like to replace it, click **Replace image**.

![drawing](media/marketplace-publishing-push-to-staging/pubportal-03.png)

### Plans
![drawing](media/marketplace-publishing-push-to-staging/pubportal-02.png)

### Legal
On the **Legal** tab, provide a link to your policies/terms of use. Enter or paste the terms in the large **Terms of Use** box.

> [AZURE.IMPORTANT] All fields must have entries, including the images, for you to be able to push to staging.


## Step 2: Set your prices
### Pricing models
|Pricing model |Description |
|---------------|------------------------------------------|
|Base| Flat monthly rate paid at time of purchase; e.g., $10/month.|
|Consumption (a.k.a. usage, meter) | Pay per use, which is defined by the publisher of the offer. Overage cannot be defined per seat, per user, etc., as there is no concept of a fraction of a user or capability to do proration. Usage is reported by the partner on an hourly basis. Customer pays at the of monthly billing cycle, as opposed to up front like monthly plans. |
|Free trial | Customer may use for free, for a limited time, and then pay normal rates thereafter. |
|Free tier | Plan is always free. |
| Migration (a.k.a. conversion or upgrade/downgrade) of plan | Concept of a user moving from their current plan to another acceptable plan; defined by partner. |

**Pricing models available by offer type**

> [AZURE.IMPORTANT] Availability of certain pricing models vary by offer type. See the table below.

| | Base only | Consumption only | Base + consumption |
|---|---|---|---|
| Virtual machine image | No | Yes | No|
| Developer service | Yes | Yes | Yes |
| Data service | Yes | No | No |

### 2.1. Set your VM prices
> [AZURE.NOTE] BYOL is supported only for virtual machines.

1.	Under the **Pricing** tab, you will see all of the supported markets. Select the appropriate one to bring up the pricing fields.
2.	The provided link in the publishing portal will show pricing information to help you in determining the prices of your SKU(s).
3.	If your SKU is BYOL, select the check box for externally licensed (BYOL) SKU availability.
4.	If your SKU is hourly, enter the pricing for your software. SKUs without pricing will not be available for purchase or use.

  > [AZURE.NOTE] If you have both BYOL and hourly SKUs, then make sure both the requisites are covered: BYOL check box and price values for hourly.

5.	A pricing wizard will open. Proceed through this to complete your pricing, including pricing for other countries, if you choose to allow purchases from outside your specified market.
6.	Some countries are ISV Remit countries. To sell in an ISV Remit country, you must be able to charge and collect tax on your SKUs, and you should calculate and pay tax to the government of the country. Microsoft is not in a position to provide legal or tax guidance.  See the section “Sell-to countries of the offer” in the introduction of this document for more information on sell-to countries.

### 2.2. Set your Developer service prices
Plans can be any combination of base + consumption, where base is the monthly price and overage is the pay-per-use price. (See below for more details.)

**Example:**  Contoso developer service offering

| Plan | Price | Includes | Migration path |
|-------|------|-------|-------|
|Free|$0/month|Basic functionality.|Can migrate to any other plan|
|Bronze|$10/month|Basic functionality and a quota of 1,000 of feature X.|Can migrate to Bronze Plus, Silver, and Gold plans|
|Bronze Plus|Free trial period: $0/month + $0/meter01 |Basic functionality and a quota of 10,000 of feature X.  Once feature X quota is used, the customer can pay per use via meter01.|Can migrate to Silver Plus and Gold plans|
|Bronze Plus| Paid period (a.k.a. free trial expired): $10/month + $0.05/meter01|Basic functionality and a quota of 10,000 of feature X.  Once feature X quota is used, the customer can pay per use via meter01.|Can migrate to Silver Plus and Gold plans|
|Silver|$0.15/meter01|The customer can pay per use via meter01, which is for feature X.|Can migrate to Bronze and Gold plans|
|Silver Plus|$20/month + $0.15/meter01 + $0.01/meter02|Basic functionality and a quota of 10,000 of feature X and 100 of feature Y.  Once the feature X quota is used, the customer can pay per use via meter01.  Once the feature Y quota is used, the customer can pay per use via meter02.|Can migrate to Bronze Plus and Gold plans|
|Gold|$1,000/month|Quota of 10,000 of feature X, 1,000 of feature Y, and unlimited of feature Z.|Can migrate to all plans except free|

## Step 3: Provide support information
Some of this information will have been completed during the certification step. You may add or edit information by using the steps below. The contact details are used for internal communications between the partner and Microsoft only. The support URL will be available to the end customers.

1.	Go to the **Support** heading on the left side of the publishing portal.
2.	Enter information under **Engineering Contact**.
3.	Enter information under **Customer Support**. If you provide only email support, enter a dummy phone number, and your provided email will be used instead.
4.	Enter the support URL.

## Step 4: Choose Azure Marketplace categories
The **Categories** tab provides an array of selections. Your offer may fall under these, and you may select up to five categories.

## How your marketing will appear
Below is a detailed view of how the offer marketing information is used on the [Azure Marketplace website](https://azure.microsoft.com/marketplace/) and in the [Azure preview portal](https://ms.portal.azure.com).

### Azure Marketplace website
![drawing](media/marketplace-publishing-push-to-staging/acom-catalog-01.png)

![drawing](media/marketplace-publishing-push-to-staging/acom-catalog-02.png)

*Listing of offers on the Azure Marketplace website*

![drawing](media/marketplace-publishing-push-to-staging/acom-listing-details-01.png)

*Offer description details on the Azure Marketplace website*

![drawing](media/marketplace-publishing-push-to-staging/acom-listing-details-02.png)

*Offer description pricing details on the Azure Marketplace website*

### Azure preview portal
![drawing](media/marketplace-publishing-push-to-staging/portal-catalog-01.png)

*Listing of offers in the Azure preview portal*

![drawing](media/marketplace-publishing-push-to-staging/portal-listing-details-01.png)

*Offer description details in the Azure preview portal*

## Next steps
Now that your Marketplace content is loaded, let's move forward with testing your offer in staging. However, you must select the appropriate offer type from the list below, as steps vary by offer type.

||Virtual machine image |Developer service | Data service | Solution template |
|----|----|----|----|----|
| **Step 3. Push your offer to staging** | [Test your VM offer in staging](marketplace-publishing-vm-image-test-in-staging.md) | Test your developer service offer in staging | [Test your data service offer in staging](marketplace-publishing-data-service-test-in-staging.md) | [Test your solution template in staging](marketplace-publishing-solution-template-test-in-staging.md) |

## See also
- [Getting started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

[img-map-acom]:media/marketplace-publishing-push-to-staging/pubportal-mapping-acom.jpg
[img-map-portal]:media/marketplace-publishing-push-to-staging/pubportal-mapping-azure-portal.jpg
[img-map-link]:media/marketplace-publishing-push-to-staging/marketing-content-guide-links.jpg
[img-map-logo]:media/marketplace-publishing-push-to-staging/marketing-content-guide-logos.jpg
[img-map-title]:media/marketplace-publishing-push-to-staging/marketing-content-guide-publisher-offer.png

[link-pubportal]:https://publish.windowsazure.com
[link-push-to-production]:marketplace-publishing-push-to-production.md
