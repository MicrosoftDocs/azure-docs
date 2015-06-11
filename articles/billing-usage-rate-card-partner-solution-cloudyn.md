<properties
   pageTitle="Microsoft Azure Usage and RateCard APIs Enable Cloudyn to Provide ITFM for Customers"
   description="Provides a unique perspective from Microsoft Azure Billing partner Cloudyn, on their experiences integrating the Azure Billing APIs into their product.  This is especially useful for Azure and Cloudyn customers that are interesting in using/trying Cloudyn for Azure Services."
   services="billing"
   documentationCenter=""
   authors="BryanLa"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="billing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="billing"
   ms.date="06/11/2015"
   ms.author="mobandyo;bryanla"/>

# Microsoft Azure Usage and RateCard APIs Enable Cloudyn to Provide ITFM for Customers 

Cloudyn, a Microsoft development partner and a leading provider of cloud management capabilities, was chosen for a private preview of the new Microsoft Azure Resource Usage and RateCard APIs. The RateCard API provides complete pricing information of all Azure services, for non-EA customers. Integrated with the Usage API, together they provide a complete information basis for input into IT Financial Management (ITFM) tools such as those provided by Cloudyn.

For additional information on the suite of tools necessary to help in gaining an understanding of cloud spend, please refer to  Gartner article [Market Guide for IT Financial Management (ITFM) Tools](http://www.gartner.com/technology/reprints.do?id=1-212F7AL&ct=140909&st=sb).

## Introduction 

The so-called “multiplication” of data from the Usage API with data from the RateCard API (usage [units] price[$unit] = Detailed Usage and Cost) creates the most granular, accurate and reliable billing information available for Azure today.

<center>![test][1]</center>

Consuming these APIs provides much-needed information on customers’ usage and costs, enabling Cloudyn to analyze customer accounts in a simple, programmatic manner, and to perform various ITFM tasks for its customers. 

## Integrating Cloudyn with the RateCard and Usage APIs
The RateCard API requires input parameters, like region info, currency and locale.  However, the most important one is the OfferDurableID parameter, which specifies the type of Azure offering the customer is using (Pay-as-you-Go, legacy 6 and 12-month commitment plans, MSDN offers, MPN offers, promotional offers and others). Each customer’s OfferDurableID can be found in the Azure customer portal. 

Upon registration for [Cloudyn for Azure](https://www.cloudyn.com/microsoft-azure/) services, customers can add their OfferDurableID code, which then enables Cloudyn to pull their relevant pricing information via the RateCard API.  Information on the different types of offers can be found one the [Microsoft Azure Offer Details](http://azure.microsoft.com/en-gb/support/legal/offer-details/) page.

<center>![test][2]</center>

Cloudyn consumes both the Usage and RateCard APIs, in addition to the Azure Performance API as valuable inputs into the Cloudyn platform.  In turn, it creates additional layers of visualization, analytics, alerting, reporting, cost management and actionable recommendations, providing Azure customers a reliable enterprise cloud ITFM tool.

## Cloudyn ITFM use cases enabled by Usage and RateCard API integration 
Common Cloudyn ITFM use cases enabled by usage and RateCard APIs include:

+ **Cost Analysis** - Cloud costs can be broken down to any native identifying dimension (provider, service, account, region etc.). The azure Usage and RateCard APIs make this an easy task, by providing the most granular breakdown of usage and costs per account, which is then grouped and filtered by Cloudyn and presented to the user, in a graphic or tabular form.
<center>![test][3]</center>

+ **Cost Allocation 360** - enables finance and IT managers to uncover the actual cost breakdown, drivers and trends of their cloud deployment. Further, it allows managers to easily associate deployment expenses with business units, departments, regions, and more, providing unprecedented insights into cloud costs and facilitating enterprise chargebacks and showbacks. The Azure Usage and RateCard APIs serve as input to Cloudyn’s cost allocation engine, which complements the APIs by defining methods and business logic for allocating untagged or untaggable resources.
<center>![test][4]</center>

+ **Cost-Effective Sizing** - a tool in Cloudyn which provides right-sizing recommendations for underutilized virtual machines, thus reducing the customer’s expenses on oversized or over-provisioned machines. It does so by examining virtual machines’ CPU and RAM metrics (via Performance API), hours of run-time (via Usage API) and cost (via RateCard API). Cloudyn then provides right-sizing recommendations based on underutilized CPU or RAM resources (Performance), and calculates estimated savings by multiplying the price delta (RateCard) between the VMs by the actual time-utilization (Usage) of the underutilized machine.
<center>![test][5]</center>

+ **Cloud Porting Recommendations** - provides as a financial advisor on cloud porting. It examines a users’ current costs of cloud resources which are deployed on major cloud vendors, and compares it to the cost an equivalent deployment on Azure. It then provides granular, per-resource, financially-based porting recommendations to Azure. After assessing the equivalent deployment required on Azure (based on performance metrics and user preferences, Cloudyn uses the RateCard API to evaluate the cost of the equivalent deployment on Azure.

+ **Performance Reports** - Cloudyn has been a long time consumer of Azure’s performance API, using it for a variety of features from CPU and RAM utilization reports to optimization recommendations. Below is an instance utilization report, presenting instances’ breakdown by average CPU utilization as an example.
<center>![test][6]</center>

+ **Category manager** - a powerful feature in Cloudyn that brings order to unorganized cloud resources. It provides users the freedom to create their own unique categories (tags) for effective measuring and reporting that is in line with business practices. Further, users can easily regulate and categorize inconsistent tagging (i.e. typos and other discrepancies) and automatically detect untagged resources for accurate cost attribution.
<center>![test][7]</center>

## Video 
[TODO: encode and embed video here]

## Next Steps

+ See [Gain insights into your Microsoft Azure resource consumption](https://azure.microsoft.com/en-us/documentation/articles/billing-usage-rate-card-overview/) for an overview of the Billing Usage and RateCard APIs. 
+ Check out the [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/1ea5b323-54bb-423d-916f-190de96c6a3c) for more information on both APIs, which are part of the set of APIs provided by the Azure Resource Manager.
+ If you would like to dive right into the sample code, check out our [Microsoft Azure Billing API Code Samples on Github](https://github.com/Azure/BillingCodeSamples).
+ See the [Azure Resource Manager Overview](resource-group-overview.md) article to learn more about the Azure Resource Manager.

<!--Image references-->
[1]: ./media/azure-billing-usage-rate-card-partner-solution-cloudyn/Cloudyn-ITFM-Overview.png
[2]: ./media/azure-billing-usage-rate-card-partner-solution-cloudyn/Cloudyn-ITFM-Engine-Overview.png
[3]: ./media/azure-billing-usage-rate-card-partner-solution-cloudyn/Cloudyn-Cost-Analysis-Pie-Chart.png
[4]: ./media/azure-billing-usage-rate-card-partner-solution-cloudyn/Cloudyn-Cost-Allocation-360-Chart.png
[5]: ./media/azure-billing-usage-rate-card-partner-solution-cloudyn/Cloudyn-Cost-Effective-Sizing.png
[6]: ./media/azure-billing-usage-rate-card-partner-solution-cloudyn/Cloudyn-Performance-Reports.png
[7]: ./media/azure-billing-usage-rate-card-partner-solution-cloudyn/Cloudyn-Category-Manager.png