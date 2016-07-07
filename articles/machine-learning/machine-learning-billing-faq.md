<properties
	pageTitle="Microsoft Machine Learning FAQ | Microsoft Azure"
	description="Frequently asked questions about Microsoft Azure Machine Learning"
	services="machine-learning"
	documentationCenter=""
	authors="vDonGlover"
	manager=""
	editor=""/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/06/2016"
	ms.author="v-donglo"/>

# Microsoft Machine Learning FAQ

## July 15th Announcement

**Q** - What are we announcing today?

**A**: Based on customer feedback, Azure Machine Learning introduces a new type of web services with tiered plans on July 15th, 2016: this will let customers determine their consumption levels and drive more predictability in their activities. 
These new web services, which apply to deployment of APIs into a production environment with more flexibility, come with pre-defined included quantities of API transactions and Production Compute hours per month. 

Q - Can you explain more about Azure ML Web Services?
**A**: With the Azure Machine Learning web service, an external application communicates with a Machine Learning workflow scoring model in real time. A Machine Learning web service call returns prediction results to an external application. To make a Machine Learning web service call, you pass an API key which is created when you deploy a prediction. The Machine Learning web service is based on REST, a popular architecture choice for web programming projects.

Azure Machine Learning has two types of services:

* Request-Response Service (RRS) - A low latency, highly scalable service that provides an interface to the stateless models created and deployed from the Machine Learning Studio.
* Batch Execution Service (BES) - An asynchronous service that scores a batch for data records.
There are several ways to consume the REST API and access the web service. For example, you can write an application in C#, R, or Python using the sample code generated for you when you deployed the web service (available on the API Help Page in the web service dashboard in Machine Learning Studio). Or you can use the sample Microsoft Excel workbook created for you (also available in the web service dashboard in Studio).

**Q** - What is different with the new Azure ML Web Services?

**A**: With the introduction of the New Web Services and Management Portal, user have access to more capabilities and management flexibility: 

* **Write once, deploy everywhere**: Users can create a web service and deploy it to multiple subscriptions, regions, and resource groups. This also gives the ability to automate the Web Services creation process using APIs or through the new Web Services Management Portal UI.
* **Improved functionality with the new Web Services Management Portal**: Users can easily access additional usage statistics (How many times the job is run, runtimes, transactions,..) and simplify the testing of Azure ML RRS functions using sample data.
* **More flexibility in pricing plans**: with pre-defined included quantities of API transactions and Production Compute hours per month, the new ML Web Services allow for more predictability in costs while offering graduated rates. 

**Q** - What is the new web services pricing? 

**A**: The New Machine Learning Web Services introduce Billing Plans that allow for more predictability in costs. Tiered pricing is for customers that need much capacity while offering graduated rates.

The new Azure ML web services are subject to the following plans: 

| |Dev/Test*  |Standard S1   |Standard S2   |Standard S3   |
|---|---|---|---|---|
|Tier Price per month   | Free   | $100  | $1,000  |$10,000|
| **Features**  |   |   |   ||
|Included Transactions (per month)|	1,000 |	100,000	|2,000,000|	50,000,000|
|Included Compute Hours (per month)	|2	|25|	500	|12,500|
|Overage Rates|	N/A	|$0.50 per 1,000 transactions<br/> $2 per API Compute Hour|	$0.25 per 1,000 transactions<br/>        $1.50 per API Compute Hour	|$0.10 per 1,000 transactions<br/>  $1 per API Compute Hour|

Users can still use the classic version of Web Services at the following pricing: 

* $2/Production API Compute Hour (Hourly unit) 
* $0.50/1,000 Production API Transactions (Transactions unit).

Hourly charges only apply to active use of the service. Where multiple meters are present they are applied concurrently.

How you are billed for usage:

* When users create a plan, it comes with a fixed cost that comes with an included quantity of API compute hours and API transactions. 
* After the included quantities in existing instance(s) are used up, additional usage is charged at the overage rate associated with the billing plan tier.

Note: Included quantities are reallocated every 30 days and unused included quantities do not roll over to the next period.

**Q** - What is this announcement changing in the current Azure Machine Learning offer? 

**A**: The pricing associated with Azure Machine Learning Studio - Machine Learning Seat fees and Studio Usage Compute Hours - does not change. 
However, customers will now have a choice in how they consume Azure ML Web Services: 

* Keeping using their current Machine Learning APIs in Pay as You Go through Classic Web Services, or 
* Taking advantage of the New Web Services capabilities that come with a tiered pricing plan.
 

**Q** - What is this announcement changing in the current Azure Machine Learning offer? 

**A**: The pricing associated with Azure Machine Learning Studio - Machine Learning Seat fees and Studio Usage Compute Hours - does not change. 
However, customers will now have a choice in how they consume Azure ML Web Services: 

* Keeping using their current Machine Learning APIs in Pay as You Go through Classic Web Services, or 
* Taking advantage of the New Web Services capabilities that come with a tiered pricing plan. 


**Q** - What is happening for existing Enterprise Agreement (EA) customers and Online Services Agreement customers (Direct)?

**A**: Customers will now have a choice in how they consume Azure ML Web Services: 

* Keeping using their current Machine Learning APIs in Pay as You Go through Classic Web Services, or 
* Taking advantage of the New Web Services capabilities that come with a tiered pricing plan.

## General Questions 

**Q** - What is Azure Machine Learning?

**A**: Azure Machine Learning is a fully managed service that you can use to create, test, operate, and manage predictive analytic solutions in the cloud. With only a browser, you can sign-in, upload data, and immediately start machine learning experiments. Drag-and-drop predictive modeling, a large pallet of modules, and a library of starting templates makes common machine learning tasks simple and quick. For more information, see the [Azure Machine Learning service overview](https://azure.microsoft.com/services/machine-learning/). For a machine learning introduction covering key terminology and concepts, see [Introduction to Azure Machine Learning](machine-learning-what-is-machine-learning.md).

**Q** -  What is Machine Learning Studio?

**A**: Machine Learning Studio is a workbench environment you access through a web browser. Machine Learning Studio hosts a pallet of modules with a visual composition interface that enables you to build an end-to-end, data-science workflow in the form of an experiment.
For more information about the Machine Learning Studio, see [What is Machine Learning Studio](What is Machine Learning Studio).

**Q** -  What is the Machine Learning API service?

**A**: The Machine Learning API service enables you to deploy predictive models built in Machine Learning Studio as scalable, fault-tolerant, web services. The web services created by the Machine Learning API service are REST APIs that provide an interface for communication between external applications and your predictive analytics models.
See [Connect to a Machine Learning web service](machine-learning-connect-to-azure-machine-learning-web-service.md) for more information. 

**Q** - What is a transaction?

**A**: A transaction represents an API call that that Azure Machine Learning responds to. Transactions from Request-Response Service (RRS) and Batch Execution Service (BES) calls are aggregated and charged against your billing plan.

**Q** - How does Machine Learning billing work? 

**A**: There are two components to the Azure Machine Learning service. The Machine Learning Studio and Machine Learning Web Services.

While you are evaluating Machine Learning Studio, you can use the free billing tier.  The free tier also allows you to deploy a classic web service with limited capacity.

Once you have decided that Azure Machine Learning meets your needs, you can sign up for the standard tier. To sign up, you must have a Microsoft Azure Subscription.

In the standard tier you’re billed a monthly per seat fee for usage of Machine Learning Studio. When you run an experiment in the studio, you are billed for compute resources when you are running an experiment. When you deploy a Classic Web Service, transactions and compute hours are billed on a Pay As You Go (PAYG) basis. 

The New Machine Learning Web Services introduce Billing Plans that allow for more predictability in costs. Tiered pricing is for customers that need a lot of capacity while offering discounted rates.

When you create a plan you commit to a fixed cost that comes with an included quantity of API compute hours and API transactions. If you need more included quantities, you can add additional instances to your plan. If you need a lot more included quantities, you can choose a higher tier plan that provides considerably more included quantities and a better discounted rate.

After the included quantities in existing instance(s) are used up, additional usage is charged at the overage rate associated with the billing plan tier.

Note: Included quantities is reallocated every 30 days and unused included quantities do not roll over to the next period.

**Q** - Can I use the included transaction quantities in a plan for both RRS and BES transactions?

**A**: Yes, your transactions from your RRS and BES are aggregated and charged against your billing plan.


**Q** - What is an API compute hour?

**A**: An API compute hour is the billing unit for the time API Calls take to run using the ML compute resources. All your calls are aggregated for billing purposes. 

**Q** - How long does a typical production API call take? 

**A**: Production API call times can vary significantly, generally ranging from hundreds of milliseconds to a few seconds, but may require minutes depending on the complexity of the data processing and machine learning model. The best way to estimate production API call times is to benchmark a model on the Machine Learning service.

**Q** - What is a Studio Compute hour?

**A**: A Studio Compute hour is the billing unit for the aggregate time your experiments use compute resources in studio. 

**Q** - In the New Web Services, what is the dev/test tier meant for?

**A**: The Azure ML new Web Services provide multiple tiers that you can use to provision your billing plan. The dev/test tier is a tier that provides limited included quantities which allows you to test your experiment as new web service without incurring costs. You have the opportunity to "Kick the Tires" to see how it works.

**Q** - Are there separate storage charges? 

**A**: The Machine Learning Free tier does not require or allow separate storage. The Machine Learning Standard tier requires users to have an Azure storage account. Azure storage is [billed separately](https://azure.microsoft.com/pricing/details/storage/).

**Q** - How does Machine Learning support high-availability work? 

**A**: Production API call times can vary significantly, generally ranging from hundreds of milliseconds to a few seconds, but may require minutes depending on the complexity of the data processing and machine learning model. The best way to estimate production API call times is to benchmark a model on the Machine Learning service.


**Q** - What specific kind of compute resources will my production API calls be run on?
**A**: The Machine Learning service is a multitenant service, and actual compute resources used on the backend will vary and are optimized for performance and predictability.

## Management of New Web Services 

**Q** - What happens if I delete my plan?

**A**: The plan is removed from your subscription and you are billed for a prorated usage.

Note: You cannot delete a plan that is in use by a web service. To delete the plan, you must either assign a new plan to the web service or delete the web service.

**Q** - What is a plan instance?

**A**: A plan instance is a unit of included quantities that you can add to your billing plan. When you select a billing tier for you billing plan, it comes with one instance. If you need more included quantities, you can add instances of the selected billing tier to your plan. 

**Q** - How many plan instances can I add?

**A**: You can have one instance of the dev/test tier in a subscription.

For tiers S1, S2, and S3 you can add as many as necessary. 

Note: Depending on your anticipated usage, it may be more cost effective to upgrade to a higher included quantities tier rather than add instances to the current tier.

**Q** - What happens when I change plan tiers (Upgrade / downgrade)?

**A**: The old plan is deleted and the current usage is billed on a prorated basis. A new plan with the full included quantities of the upgraded/downgraded tier is created for the rest of the period. 
Note: Included quantities are allocated per period and unused quantities do not roll over.

**Q** - What happens when I increase the instances in a plan?

**A**: Included quantities are included on a prorated basis and may take 24 hours to be effective. 

**Q** - What happens when I delete an instance of a plan?

**A**: The instance is removed from your subscription and you are billed for a prorated usage. 


## Signing up for New Web Services plans

**Q** - How do I sign up for a plan?

**A**: You have two ways to create billing plans.

When you first deploy a new web service, you can choose an existing plan or create a new plan. 

Plans created in this manner are in your default region and your web service will be deployed to that region. 

You may want define your billing plans before you deploy your service; for instance, if you want deploy services to regions other than your default region.

In that case you can log into the Azure Machine Learning Web Services portal and navigate to the plans page. From there you can Add and Delete plans, as well as modify existing plans.

**Q** - Which plan should I choose to start off with?

**A**: We recommend you that you start with the standard S1 tier and monitor your service for usage. If you find you are using your included quantities rapidly, you can add instances or move to a higher tier and get better discounted rates. You can adjust your billing plan as needed throughout your billing cycle. 

**Q** - Which regions are the new plans available in?

**A**: The new billing plans are available in the three production regions in which we support the new web services:

* South Central US
* West Europe
* South East Asia

**Q** - I have web services in multiple regions. Do I need a plan for every region?

**A**: Yes. Plan pricing varies by region. When you deploy a web service to another region you will need to assign it a plan specific to that region.

## New Web Services - Overages

**Q** - How do I check if my web service usage is in overage?

**A**: You can view the usage on all your plans on the Plans page in the Azure Machine Learning Web Services portal. Log in to the portal and click on the Plans menu option. 

In the Transactions and Compute columns of the table, you can see the included quantities of the plan and the percentage used. 

**Q** - What happens when I use up the include quantities in the dev/test tier?

**A**: Services that have a dev/test tier assigned them are stopped until the next period or you move them to one of the paid tiers.

## Azure ML Classic Web Services - Pay As You Go Plan

**Q** - Is the Pay As You Go still available?

**A**: Pay As You Go (PAYG) is still available for Classic Web Services. 

## Studio Free and Standard Tier

**Q** - What is included in the Azure Machine Learning Free tier? 

**A**: The Azure Machine Learning Free tier is intended to provide an in-depth introduction to the Azure Machine Learning Studio. All you need is a Microsoft account to sign up. The Free tier includes free access to one Azure Machine Learning Studio workspace per [Microsoft account](https://www.microsoft.com/account/default.aspx). It includes the ability to use up to 10GB of storage and the ability to operationalize models as staging APIs. Free tier workloads are not covered by an SLA and are intended for development and personal use only. Free tier workloads can’t access data by connecting to an on-premises SQL server. The table above outlines many differences between the Free and Standard Tiers, however other differences may exist and Free tier features are subject to change at any time.

**Q** - What is included in the Azure Machine Learning Standard tier? 

**A**: The Azure Machine Learning Standard tier is a paid production version of Azure Machine Learning. The Azure ML service monthly fee is billed on a per seat per month basis and prorated for partial months. Azure ML Studio experiment hours are billed per compute hour for active experimentation. Billing is prorated for partial hours. The Azure ML API service is billed depending the classic web services or new web services per 1,000 production API calls and by production API compute hour when a production API call is being actively executed. Billing is prorated for production API call quantities less than 1,000 and partial compute hours. Charges are aggregated per workspace for your subscription. Within each workspace you will see charges for these items:

* ML Seat Subscription - The ML Seat Subscription is a monthly fee which provides access to an ML Studio workspace and is required to run experiments both in the studio and utilizing the production APIs.
* Studio Experiment Hours - this meter aggregates all compute charges accrued by running experiments in ML Studio and running production API calls in the staging environment.
* Access data by connecting to an on-premises SQL server in your models for your training and scoring.
* If Classic Web Services: 
	* Production API Compute Hours - this meter includes compute charges accrued by Web services running in production.
	* Production API Transactions (in 1000s) - this meter includes charges accrued per call to your production web service.
* If New Web Services: 
	* Standard S1/S2/S3 API Plan (Units) - this meters represents the type of instance selected for new Web Services
	* Standard S1/S2/S3 Overage API Compute Hours - this meters includes compute charges accrued by the New Web Services running in production after the included quantities in existing instance(s) are used up. The additional usage is charged at the overate rate associated with S1/S2/S3 plan tier.
	* Standard S1/S2/S3 Overage API Transactions (in 1,000s) - this meters includes charges accrued per call to your production New Web Service after the included quantities in existing instance(s) are used up. The additional usage is charged at the overate rate associated with S1/S2/S3 plan tier.
	* Included Quantity API Compute Hours - with the New Web Services, this meters represented the included quantity of API Compute Hours 
	* Included Quantity API Transactions (in 1,000s)- with the New Web Services, this meters represented the included quantity of API Transactions 

**Q** - How do I sign up for Azure ML Free tier?

**A**: All you need is a Microsoft account. Go to [Azure Machine Learning home](https://azure.microsoft.com/services/machine-learning/), and click on Start Now button. Log in with your Microsoft account and a workspace in Free tier is created for you. You can start to explore and create Machine Learning experiments right away.

**Q** - How do I sign up for Azure ML Standard tier? 

**A**: You must first have access to an Azure subscription in order to create a Standard ML workspace. You can sign up for a 30-day free trial Azure subscription and later upgrade to a paid Azure subscription, or purchase a paid Azure subscription outright. You can then create a Machine Learning workspace from the Microsoft Azure classic portal after gaining access to the subscription. Please view the [step-by-step instructions](https://azure.microsoft.com/trial/get-started-machine-learning-b/).

Alternatively, you can be invited by a Standard ML workspace owner to access the owner’s workspace.

**Q** - Can I specify my own Azure blob storage account to use with the Free tier? 

No, the Standard tier is equivalent to the version of the Machine Learning service that was available before the tiers were introduced.

**Q** - Can I deploy my machine learning models as APIs in the Free tier? 

**A**: Yes, you can operationalize machine learning models to staging API services as part of the free tier. In order to put the staging API service into production and get a production end point for the operationalized service you must use the Standard tier. 

**Q** - What is the difference between Azure Free trial and Azure Machine Learning Free tier? 

**A**: The [Microsoft Azure free trial](https://azure.microsoft.com/free/) offers credits that can be applied to any Azure service for one month while the Azure Machine Learning Free tier offers continuous access specifically to the Azure Machine Learning service for non-production workloads.

**Q** - How do I move an experiment from the Free tier to the Standard tier?

**A**: To copy your experiments from the Free tier to the Standard tier, follow the steps described below.

1.	Log into Azure Machine Learning Studio and make sure you can see both the Free workspace and the Standard workspace in the workspace selector in the top navigation bar.
2.	Switch to Free workspace if you are in the Standard workspace.
3.	In the experiment list view, select an experiment you’d like to copy, and click on the Copy command button.
4.	Select the Standard workspace from the pop-up dialog box and click on the Copy button.
5.	Please note that all the associated datasets, trained model, etc. will be copied together with the experiment into the Standard workspace.
6.	You will need to re-run the experiment and republish your web service in the Standard workspace.

## Studio Workspace

**Q** - What is a Machine Learning Seat Subscription and when do I need one? 

**A**: A Machine Learning Seat represents a workspace. It is recommended that any user running experiments in ML Studio or a production API service be covered by a Machine Learning Seat Subscription.

**Q** - Will I see different bills for different workspaces?

**A**: Workspace charges will be broken out separately for each applicable meter on a single bill.

**Q** - What specific kind of compute resources will my experiments be run on? 

**A**: The Machine Learning service is a multitenant service, and actual compute resources used on the backend will vary and are optimized for performance and predictability.

## Guest access

What is Guest Access to Azure Machine Learning Studio?

**A**: Guest Access is a restricted trial experience that allows you to create and run experiments in the Azure Machine Learning Studio at no cost and without authentication. Guest sessions are non-persistent (cannot be saved) and limited to 8 hours. Other limitations include lack of R and Python support, lack of staging APIs and restricted dataset size and storage capacity. By comparison, users who choose to sign in with a Microsoft account will have full access to the Free-tier of Machine Learning Studio described above which includes a persistent workspace and more comprehensive capabilities. Choose your free Machine Learning experience by Clicking on the "Get started" button on [https://studio.azureml.net](https://studio.azureml.net), and selecting either Guess Access or Sign-In with Microsoft account.
