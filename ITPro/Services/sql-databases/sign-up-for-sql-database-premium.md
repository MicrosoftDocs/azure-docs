<properties linkid="manage-services-sql-databases-premium" urlDisplayName="Premium SQL Database" pageTitle="Sign up for the Premium Offer for Windows Azure SQL Database" metaKeywords="" metaDescription="Describes how sign up for the Premium offer preview, request your Premium database quota, and then upgrade a database to Premium in Windows Azure SQL Database." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/sql-databases-left-nav.md" />

#Sign up for the Premium Offer for Windows Azure SQL Database
In this tutorial, you learn the steps required to participate in the preview of the Premium offering.

Windows Azure SQL Database has released a limited preview of a new Premium offer. By reserving a fixed amount of capacity for your SQL Database and its secondary replicas, the new Premium offer will deliver more predictable performance for cloud applications, relative to existing SQL Database Web and Business Editions. Microsoft will continue to add business-class functionality to Premium databases over time, to further support higher-end application requirements, enabling you to make a bet on a business-optimized cloud platform.

[The feature described in this topic is available only in preview. This topic is pre-release documentation and is subject to change in future releases.]

##Table of Contents##

* [Step 1: Sign-Up for the Premium offer preview](#SignUp)
* [Step 2: Request Premium database quota](#Quota)
* [Step 3: Upgrade a database to Premium](#Upgrade)

<h2><a id="SignUp"></a>Step 1: Sign-Up for the Premium offer preview</h2>
The first step to take advantage of the new Premium offer preview is to sign up your subscription for the Premium Offer for SQL Database preview.

1. Sign in to the [Windows Azure Preview Features Page](http://account.windowsazure.com/PreviewFeatures) using your Microsoft account.

	**Note** - Only Windows Azure account administrators can access the Account portal. If you are not the account administrator for your subscription, please have that person complete the sign-up process for your subscription. For more information about Windows Azure accounts and subscriptions, see [Purchase Options](http://account.windowsazure.com/PreviewFeatures).
 
	![Image1] []

2. Click the **try it now** button associated with the **Premium Offer for SQL Database** item in the preview features list.

	![Image2] []

3. Choose the subscription you wish to sign up for the preview.

	![Image3] []

	Only active, paid Windows Azure subscriptions are eligible for the preview. You may sign up multiple subscriptions for the preview, but each subscription can be signed up only once. 

	Signing a subscription up for the Premium offer preview is free, but once activated and Premium quota granted, upgrading a database to Premium is subject to the pricing outlined in the [SQL Database Pricing Page](http://www.windowsazure.com/en-us/pricing/details/sql-database/).

	The current status of the sign up request is reflected in the preview features list.

	![Image4] []

4. The SQL Database team will review requests and approve based on current capacity and demand. You may wait up to 2 days for your subscription to be activated, with longer wait times indicating high demand or fulfilled public preview capacity.

5. You will receive an email notification once your subscription is activated for the Premium offer preview. 


<h2><a id="Quota"></a>Step 2: Request Premium database quota</h2>
Once your subscription is activated for the Premium offer preview, you need to request Premium database quota for each server on which you wish to create a Premium database. The Premium database quota assigned to a server limits the number of databases that can be upgraded to Premium on that server. 

As Premium database capacity is limited, please only request quota for servers on which you plan to create a Premium database, and cancel any pending requests if they become unnecessary.  

1. Sign in to the [Windows Azure Management Portal](http://www.manage.windowsazure.com/) using your Microsoft account.

	**Note** – Account administrators, service administrators, and co-administrators of the subscription can request Premium database quota once the subscription is signed up for the preview.

2.	Navigate to the **Servers** list in the **SQL Databases** extension.
3.	Select the server for which you plan to request Premium database quota.
4.	Navigate to the Quick Start for the selected server by clicking the (![Image5] [] ) in the top navigation bar.
5.	Click **Request Premium Database Quota** in the **Premium Database** section.

	![Image6] []
6.	Confirm your request on the subsequent dialog. 

	The SQL Database team will review your request. You may wait up to 5 days before being granted Premium database quota. Longer wait times may indicate high demand or fulfilled preview capacity.

	A few additional notes about Premium database quota requests:

- Premium quota is not available to customers with free-trial subscriptions.
- Premium database quota is limited initially, and requests will be granted based on current demand and available capacity.
- Only one quota request can be submitted for each logical server in the subscription.
- Initially, quota is limited to one Premium database per logical server.
- Requesting Premium database quota is free, however, upgrading a Web or Business edition database to Premium will significantly increase the cost of the database. 
7.	You can see the status of your Premium database quota request on the server’s **Quick Start** page.

	![Image7] []
8.	You will receive an email notification when your Premium database quota request is granted and Premium database quota is available for use.
9.	Once granted, you can see a server’s remaining Premium database quota on the server’s **Quick Start** tab.

	![Image8] []

<h2><a id="Upgrade"></a>Step 3: Upgrade a database to Premium</h2>

Once you have been granted Premium database quota, you can upgrade a Web or Business edition database to Premium to take advantage of reserved capacity and more predictable performance. For more information, see [Managing a Premium Database](http://go.microsoft.com/fwlink/p/?LinkID=311927).

	![Image9] []

<h2><a id="NextSteps"></a>Next Steps</h2>
For additional information about Premium database, see:

* [Managing a Premium Database](http://go.microsoft.com/fwlink/p/?LinkID=311927)
* [Windows Azure SQL Database Premium Offer Guidance](http://go.microsoft.com/fwlink/p/?LinkId=313650)



[Image1]: ../media/AccountSignup-Figure1.png
[Image2]: ../media/AccountSignupButton-Figure2.png
[Image3]: ../media/Subscription-Figure3.PNG
[Image4]: ../media/Status-Figure4.png
[Image5]: ../media/QuickStart-Figure5.PNG
[Image6]: ../media/RequestQuota-Figure6.png
[Image7]: ../media/PendingApproval-Figure7.png
[Image8]: ../media/QuotaApproved-Figure8.png
[Image9]: ../media/PremiumDatabase-Figure9.png


sd