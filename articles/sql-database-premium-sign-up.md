<properties linkid="manage-services-sql-databases-premium" urlDisplayName="Premium SQL Database" pageTitle="Sign up for Windows Azure Premium for SQL Database" metaKeywords="" description="Describes how to sign up for the Premium for SQL Database preview, request your Premium database quota, and then upgrade a database to Premium in Windows Azure SQL Database." metaCanonical="" services="cloud-services" documentationCenter="" title="Sign up for the preview of Premium for Windows Azure SQL Database" authors=""  solutions="" writer="karaman" manager="" editor="tysonn"  />





#Sign up for the preview of Premium for Windows Azure SQL Database
In this tutorial, you learn the steps required to participate in the preview of Premium for SQL Database.

Windows Azure SQL Database has released a limited preview of a new service - Premium for SQL Database. Premium databases provide reserved resources for more predictable performance for cloud applications.

[The feature described in this topic is available only in preview. This topic is pre-release documentation and is subject to change in future releases.]

##Table of Contents##

* [Step 1: Sign-Up for the preview of Premium for SQL Database](#SignUp)
* [Step 2: Request Premium database quota](#Quota)
* [Step 3: Create a Premium database ](#Upgrade)

<h2><a id="SignUp"></a>Step 1: Sign-Up for the Preview of Premium for SQL Database</h2>
The first step to take advantage of this feature is to sign up your subscription for the Premium for SQL Database preview.

1. Sign in to the [Windows Azure Preview Features Page](http://account.windowsazure.com/PreviewFeatures) using your Microsoft account.

	**Note** - Only Windows Azure account administrators can access the Account portal. If you are not the account administrator for your subscription, please have that person complete the sign-up process for your subscription. For more information about Windows Azure accounts and subscriptions, see [Purchase Options](http://account.windowsazure.com/PreviewFeatures).
 
	![Image1] [Image1]

2. Find the **Premium for SQL Database** item in the preview features list and click the **try it now** button associated with the item.

	![Image2] [Image2]

3. Choose the subscription you wish to sign up for the preview.

	![Image3] [Image3]

	Only active, paid Windows Azure subscriptions are eligible for the preview. You may sign up multiple subscriptions, but each subscription can be signed up only once. 

	Signing a subscription up for the preview will not incur additional charges, but once activated and Premium quota granted, creating or upgrading to a Premium database is subject to the pricing outlined in the [SQL Database Pricing Page](http://www.windowsazure.com/en-us/pricing/details/sql-database/).

	The current status of the sign up request is reflected in the preview features list.

	![Image4] [Image4]

4. Requests will be approved based on current capacity and demand. You may wait up to 2 days for your subscription to be activated, with longer wait times indicating high demand or fulfilled public preview capacity.

5. You will receive an email notification once your subscription is activated for the preview. 


<h2><a id="Quota"></a>Step 2: Request Premium database quota</h2>
Once your subscription is activated for the preview, you need to request Premium database quota for each server on which you plan to create a Premium database. As capacity is limited, please only request quota for servers on which you plan to create a Premium database, and cancel any unneeded pending requests.


1.	Sign in to the [Windows Azure Management Portal](https://manage.windowsazure.com) using your Microsoft account.

	**Note** ??? Account administrators, service administrators, and co-administrators of the subscription can request quota once the subscription is signed up for the preview.

2.	Navigate to the **Servers** list in the **SQL Databases** extension.
3.	Select the server for which you plan to request Premium database quota.
4.	Navigate to the **Quick Start** for the selected server by clicking the lightning bolt icon in the top navigation bar.
5.	Click **Request Premium Database Quota** in the **Premium Database** section.

	![Image6] [Image6]
	


	Once your request is submitted, you may wait up to 5 days before being granted quota. Longer wait times may indicate high demand or fulfilled preview capacity.
	
	A few additional notes about Premium database quota requests:
	
	- Quota is not available to customers with free-trial subscriptions.
	- Quota is limited initially, and requests will be granted based on current demand and available capacity.
	- Microsoft may reclaim unused quota after 15 days.
	- Only one quota request can be submitted for each logical server in the subscription.
	- Initially, quota is limited to one database per logical server.
	- Requesting database quota is free, however, creating a Premium edition database or upgrading an existing Web or Business edition database to Premium will increase the cost of the database.
6.	You can see the status of your quota request on the server???s **Quick Start** page.

	![Image7] [Image7]
	
7.	You will receive an email notification when your Premium database quota request is granted and quota is available for use.
8.	Once granted, you can see a server???s remaining Premium database quota on the server???s **Quick Start** or **Dashboard** tab.

	![Image8] [Image8]

<h2><a id="Upgrade"></a>Step 3: Create a Premium database</h2>


Once you have been granted quota, you can create a new Premium edition database or upgrade an existing Web or Business  database to Premium to take advantage of reserved capacity and more predictable performance. 

![Image9] [Image9]



![Image10] [Image10]


For more information, see [Managing a Premium Database](http://go.microsoft.com/fwlink/p/?LinkID=311927).

	
	
**Note:** You can only change the Premium status or the reservation size of your database once in a 24 hour period.
<h2><a id="NextSteps"></a>Next Steps</h2>
For additional information about Premium databases, see:

* [Managing a Premium Database](http://go.microsoft.com/fwlink/p/?LinkID=311927)
* [Premium for SQL Database Guidance](http://go.microsoft.com/fwlink/p/?LinkId=313650)

















