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
	ms.date="10/14/2014" 
	ms.author="jaymathe"/> 

# FAQ for setting up and using the Machine Learning Recommendations API
Version 1.0

Table of Contents

* What is RECOMMENDATIONS?	
* What can I do with RECOMMENDATIONS?	
* Are there any limitations during the launch period?	
* Purchase and Billing	
	* How much does RECOMMENDATIONS cost during the launch period?	
	* Are there any costs associated with having RECOMMENDATIONS track and / or store user activity for me?	
	* Does RECOMMENDATIONS have a free trial?	
	* When will the launch period end?	
	* How much will it cost when it becomes generally available (GA)?	
	* When will I be billed for RECOMMENDATIONS?	
	* How do I upgrade to a higher tier services?	
	* When will my subscription to RECOMMENDATIONS end?	
	* How do I cancel my RECOMMENDATIONS subscription?	
* Getting started with RECOMMENDATIONS	
	* Is RECOMMENDATIONS for me?	
	* What are the prerequisites for setting up RECOMMENDATIONS?	
	* How do I set up RECOMMENDATIONS for the first time?	
	* Where can I find API documentation?	
	* What options do I have to upload catalog and usage data to RECOMMENDATIONS?	
* Maintenance and support	
	* How large can my data set be?	
	* Where can I get technical support for RECOMMENDATIONS?	
	* Where can I find the terms of use?	
* Legal	


## What is RECOMMENDATIONS?
For organizations and businesses that rely on recommendations to cross-sell and up-sell to their customers, Microsoft Azure Machine Learning’s RECOMMENDATIONS is a self-service recommendations engine over Azure. It is an implementation of Collaborating Filtering using Matrix Factorization as its core algorithm. It’s accessible to application developers as an API via a RESTful HTTP interface. RECOMMENDATIONS is currently in public preview, on the way to becoming a generally available service.

## What can I do with RECOMMENDATIONS?
RECOMMENDATIONS takes as input an item or a set of items and returns a list of relevant recommendations. For example: a customer of an online retailer clicks on a product. The online retailer sends that product as an input to RECOMMENDATIONS, gets a list of products in return and decides which of these products will be shown to the customer. You may want to use RECOMMENDATIONS to optimize your online store or even to inform your inside sales department or call center.


## Are there any limitations during the launch period?

* Maximum number of models per subscription: 10
* Maximum number of items that a catalog can hold: 100,000
* aximum size of data can be sent in POST (e.g. Import catalog data, import usage data) is 200MB
* The number of transactions per second for a recommendation model build that is not active is ~2TPS, only recommendation model build that is active can hold up to 20TPS

## Purchase and Billing 
More information about understanding subscriptions can be found here.

###How much does RECOMMENDATIONS cost during the launch period?
RECOMMENDATIONS is a subscription based service. Charging is done based on volume of transactions per month. During the launch period the service is free and is restricted to 100,000 transactions per month.

###Are there any costs associated with having RECOMMENDATIONS track and / or store user activity for me?
Not at the moment.

###Does RECOMMENDATIONS have a free trial?
During the launch period the service is free and is restricted to 100,000 transactions per month.

###When will the launch period end?
The launch period and its pricing are expected to last for several months. We will notify our subscribed users about upcoming changes in status and pricing.

###How much will it cost when it becomes generally available (GA)?
Pricing for RECOMMENDATIONS when it becomes generally available is yet to be determined. In case of price changes, subscribers will be notified.

###When will I be billed for RECOMMENDATIONS?
A paid subscription is any subscription for which there is a monthly fee. When you purchase a Paid Subscription, you are immediately charged for the first month's use. You are charged the amount shown next to the offer on the subscription page (plus applicable taxes). This monthly charge is made each month on the same calendar date as your original purchase until you cancel the subscription. For more information about understanding subscriptions click here.

###How do I upgrade to a higher tier services?
During the launch period the service is restricted to 100,000 transactions per month and is not upgradable to a higher tier.

When RECOMMENDATIONS becomes generally available - if you discover that your subscription does not provide you with enough transactions, you can upgrade to a subscription with a higher transaction limit.

When you upgrade a subscription:

* Transactions remaining on your old subscription are not added to your new subscription. 
* You pay full price for the new subscription, even though you have unused transactions on your old subscription.

Process to Upgrade a Subscription

* Sign in to the Marketplace.
* Click the My Data tab.
* Click Use behind the subscription you want to upgrade. 
* In the right-hand pane all the available subscriptions are listed with your subscription grayed out. Click the radio button for the subscription you want to upgrade to.
* If you want to upgrade, click OK on the dialog box. If you do not want to upgrade, click Cancel.

IMPORTANT: Carefully read the dialog box before you upgrade as there are billing and use implications.

For more information about understanding subscriptions click [here](http://msdn.microsoft.com/en-us/library/gg312164.aspx).

###When will my subscription to RECOMMENDATIONS end?
Your subscription will end when you cancel it. If you would like to cancel your subscriptions, see instructions below.

###How do I cancel my RECOMMENDATIONS subscription?
To cancel your subscription, follow the steps below. If your current subscription is a paid subscription, your subscription continues in effect until the end of the current billing period. If you need the cancellation to be effective immediately contact us [here](https://support.microsoft.com/oas/default.aspx?gprid=17024&st=1&wfxredirect=1&sd=gn).

No refund is given if you cancel before the end of a billing period or for unused transactions in a billing period.

* Sign in to the Marketplace.
* Click the My Data tab.
* Find the subscription you want to cancel.
* Click Cancel to the right of the dataset name and status. You can use this subscription until the end of the current billing period or your transaction limit is reached – whichever occurs first.

If you would like to cancel your subscription immediately so you can purchase a new subscription go [here](https://support.microsoft.com/oas/default.aspx?gprid=17024&st=1&wfxredirect=1&sd=gn) to file a ticket with our customer support.


## Getting started with RECOMMENDATIONS

###Is RECOMMENDATIONS for me? 
Microsoft Azure Machine Learning’s RECOMMENDATIONS is for organizations and businesses that rely on recommendations to cross-sell and up-sell to their customers. If you have a customer facing website, a sales force, an inside sales force or a call center and if you offer a catalog of more than few dozens of products or services – your bottom line may benefit from consuming RECOMMENDATIONS. Experimenting with RECOMMENDATIONS is designed to be fairly simple. The current API based version does required basic programming skills. In case you need assistance contact the vendor who developed your website. If you have an internal IT department or an in-house developer – they should be able to get RECOMMENDATIONS to work for you. 

###What are the prerequisites for setting up RECOMMENDATIONS?
RECOMMENDATIONS requires that you have a log of user choices as it relates to your catalog. In case you don’t have such a log and you do have a customer facing website, RECOMMENDATIONS may collect user activity for you. RECOMMENDATIONS also requires a catalog of your products or services. In case you don’t have the catalog, RECOMMENDATIONS can use the actual customer usage data and distill a catalog. An “implied” catalog will not include items that were not “reported” as part of user transactions.

###How do I set up RECOMMENDATIONS for the first time?
After subscribing to RECOMMENDATIONS, you should use the API documentation in  [here](https://onedrive.live.com/view.aspx?cid=8536718B52F71725&resid=8536718B52F71725!118&app=Word&authkey=!AOLb7aR6D0cVqMQ) to set up the service.

###Where can I find API documentation? 
The API documentation is [here](https://onedrive.live.com/view.aspx?cid=8536718B52F71725&resid=8536718B52F71725!118&app=Word&authkey=!AOLb7aR6D0cVqMQ).

###What options do I have to upload catalog and usage data to RECOMMENDATIONS?
You have two options for uploading your catalog and usage data: either you export these data from your CRM system or other logs and upload it to RECOMMENDATIONS, or you may add tags to your website that will track user activities. If the latter, the data will be stored on Azure.

##Maintenance and support

###How large can my data set be?
Each data set can contain up to 100,000 catalog items and up to 2048 MB of usage data.
In addition, a subscription can contain up to 10 data sets (models).

###Where can I get technical support for RECOMMENDATIONS?
Technical support is available [here](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=MachineLearning).

###Where can I find the terms of use?

Terms of use are available [here](https://datamarket.azure.com/dataset/amla/recommendations#terms).

#Legal
This document is provided “as-is”. Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. 
Some examples depicted herein are provided for illustration only and are fictitious. No real association or connection is intended or should be inferred. 
This document does not provide you with any legal rights to any intellectual property in any Microsoft product. You may copy and use this document for your internal, reference purposes. 
© 2014 Microsoft. All rights reserved. 


