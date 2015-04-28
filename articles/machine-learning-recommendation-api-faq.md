<properties 
	pageTitle="FAQ for setting up and using the Machine Learning Recommendations API | Azure" 
	description="Microsoft RECOMMENDATIONS API built with Azure Machine Learning FAQ" 
	services="machine-learning" 
	documentationCenter="" 
	authors="jaymathe" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/19/2015" 
	ms.author="jaymathe"/> 

#Setting up and using Machine Learning Recommendations API FAQ


**What is RECOMMENDATIONS?**

For organizations and businesses that rely on recommendations to cross-sell and up-sell products and services to their customers, RECOMMENDATIONS in Azure Machine Learning provides a self-service recommendations engine. It is an implementation of collaborative filtering that uses matrix factorization as its core algorithm. Application developers can access RECOMMENDATIONS by using REST APIs. 

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

**What can I do with RECOMMENDATIONS?**

RECOMMENDATIONS takes as input an item or a set of items and returns a list of relevant recommendations. For example: A customer of an online retailer clicks a product. The online retailer sends that product as input to RECOMMENDATIONS, gets a list of products in return, and decides which of these products will be shown to the customer. You may want to use RECOMMENDATIONS to optimize your online store or even to inform your inside sales department or call center.

**Are there any usage limitations?**

Recommendations has the following usage limitations:
* Maximum number of models per subscription: 10
* Maximum number of items that a catalog can hold: 100,000
* The maximum number of usage points that are kept is ~5,000,000. The oldest will be deleted if new ones will be uploaded or reported.
* Maximum size of data that can be sent in email (for example, import catalog data, import usage data) is 200 MB
* Number of transactions per second (TPS) for a Recommendations model build that is not active is ~2 TPS. A Recommendations model build that is active can hold up to 20 TPS.

##Purchase and Billing 


**How much does Recommendations cost during the launch period?**

Recommendations is a subscription-based service. Charging is based on volume of transactions per month. You can check the [offer page] (https://datamarket.azure.com/dataset/amla/recommendations) in Microsoft Azure Marketplace for pricing information.

**Are there any costs associated with having Recommendations track and store user activity for me?**

Not at the moment.

**Does Recommendations have a free trial?**

There is a free trail which is restricted to 10,000 transactions per month.

**When will I be billed for Recommendations?**

A paid subscription is any subscription for which there is a monthly fee. When you purchase a paid subscription, you are immediately charged for the first month's use. You are charged the amount that is associated with the offer on the subscription page (plus applicable taxes). This monthly charge is made each month on the same calendar date as your original purchase until you cancel the subscription. 

**How do I upgrade to a higher tier service?**

You can buy or update your subscription from the [offer page] (https://datamarket.azure.com/dataset/amla/recommendations) page on Microsoft Azure Marketplace.

When you upgrade a subscription:

* Transactions that are remaining on your old subscription are not added to your new subscription. 
* You pay full price for the new subscription, even though you have unused transactions on your old subscription.

Process to upgrade a subscription:

* Nevigate to the [offer page] (https://datamarket.azure.com/dataset/amla/recommendations).
* Sign in to the Marketplace if you aren't already Signed in.
* In the right pane, all the available plans are listed. Click the radio button for the plan you want to upgrade to.
* If you want to upgrade, click **OK**. If you do not want to upgrade, click **Cancel**.

**Important** Carefully read the dialog box before you upgrade because there are billing and use implications.

**When will my subscription to Recommendations end?**

Your subscription will end when you cancel it. If you would like to cancel your subscriptions, see the following instructions.

**How do I cancel my Recommendations subscription?**

To cancel your subscription, use the following steps. If your current subscription is a paid subscription, your subscription continues in effect until the end of the current billing period. If you need the cancellation to be effective immediately, contact us at [Microsoft Support](https://support.microsoft.com/oas/default.aspx?gprid=17024&st=1&wfxredirect=1&sd=gn).

**Note** No refund is given if you cancel before the end of a billing period or for unused transactions in a billing period.

* Nevigate to the [offer page] (https://datamarket.azure.com/dataset/amla/recommendations).
* Sign in to the Marketplace if you aren't already Signed in.
* Click **Cancel** to the right of the dataset name and status. You can use this subscription until the end of the current billing period or your transaction limit is reached (whichever occurs first).

If you would like to cancel your subscription immediately so you can purchase a new subscription, file a ticket at [Microsoft Support](https://support.microsoft.com/oas/default.aspx?gprid=17024&st=1&wfxredirect=1&sd=gn).

##Getting started with Recommendations

**Is Recommendations for me?** 

Recommendations in Machine Learning is for organizations and businesses that rely on recommendations to cross-sell and up-sell products or services to their customers. If you have a customer-facing website, a sales force, an inside sales force, or a call center, and if you offer a catalog of more than a few dozen products or services, your bottom line may benefit from using Recommendations. 

Experimenting with Recommendations is designed to be fairly simple. The current API-based version requires basic programming skills. If you need assistance, contact the vendor who developed your website. If you have an internal IT department or an in-house developer, they should be able to get Recommendations to work for you. 

**What are the prerequisites for setting up Recommendations?**

Recommendations requires that you have a log of user choices as it relates to your catalog. If you don’t have such a log and you do have a customer facing website, Recommendations can collect user activity for you. 

Recommendations also requires a catalog of your products or services. If you don’t have the catalog, Recommendations can use the actual customer usage data and distill a catalog. An “implied” catalog will not include items that were not “reported” as part of user transactions.

**How do I set up Recommendations for the first time?**

After [subscribing] (https://datamarket.azure.com/dataset/amla/recommendations) to Recommendations, you should use the API documentation in the [Azure Machine Learning Recommendations – Quick Start Guide](machine-learning-recommendation-api-quick-start-guide.md) to set up the service.

**Where can I find API documentation?** 

The API documentation is [Azure Machine Learning Recommendations – Quick Start Guide](machine-learning-recommendation-api-quick-start-guide.md).

**What options do I have to upload catalog and usage data to Recommendations?**

You have two options for uploading your catalog and usage data: You can export the data from your CRM system or other logs and upload it to Recommendations, or you can add tags to your website that will track user activities. If you use the latter method, the data will be stored in Azure.

##Maintenance and support

**How large can my data set be?**

Each data set can contain up to 100,000 catalog items and up to 2048 MB of usage data.
In addition, a subscription can contain up to 10 data sets (models).

**Where can I get technical support for Recommendations?**

Technical support is available on the [Microsoft Azure Support](https://social.msdn.microsoft.com/forums/azure/home?forum=MachineLearning) site.

**Where can I find the terms of use?**

[Microsoft Azure Machine Learning Recommendations API Terms of Service](https://datamarket.azure.com/dataset/amla/recommendations#terms).



