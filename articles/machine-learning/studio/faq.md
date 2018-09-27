---
title: Azure Machine Learning frequently asked questions (FAQs) | Microsoft Docs
description: 'Azure Machine Learning introduction: FAQ covering billing, capabilities, and limitations of a cloud service for streamlined predictive modeling.'
keywords: machine learning introduction,predictive modeling,what is machine learning
services: machine-learning
documentationcenter: ''
author: heatherbshapiro
ms.author: hshapiro

ms.assetid: a4a32a06-dbed-4727-a857-c10da774ce66
ms.service: machine-learning
ms.component: studio
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/02/2017

---
# Azure Machine Learning frequently asked questions: Billing, capabilities, limitations, and support
Here are some frequently asked questions (FAQs) and corresponding answers about Azure Machine Learning, a cloud service for developing predictive models and operationalizing solutions through web services. These FAQs provide questions about how to use the service, which includes the billing model, capabilities, limitations, and support.

**Have a question you can't find here?**

Azure Machine Learning has a forum on MSDN where members of the data science community can ask questions about Azure Machine Learning. The Azure Machine Learning team monitors the forum. Go to the [Azure Machine Learning Forum](http://social.msdn.microsoft.com/Forums/windowsazure/home?forum=MachineLearning) to search for answers or to post a new question of your own.

## General questions
**What is Azure Machine Learning?**

Azure Machine Learning is a fully managed service that you can use to create, test, operate, and manage predictive analytic solutions in the cloud. With only a browser, you can sign in, upload data, and immediately start machine-learning experiments. Drag-and-drop predictive modeling, a large pallet of modules, and a library of starting templates make common machine-learning tasks simple and quick. For more information, see the [Azure Machine Learning service overview](https://azure.microsoft.com/services/machine-learning/). For an introduction to machine learning that explains key terminology and concepts, see [Introduction to Azure Machine Learning](what-is-machine-learning.md).

[!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]

**What is Machine Learning Studio?**

Machine Learning Studio is a workbench environment that you access by using a web browser. Machine Learning Studio hosts a pallet of modules in a visual composition interface that helps you build an end-to-end, data-science workflow in the form of an experiment.

For more information about Machine Learning Studio, see [What is Machine Learning Studio?](what-is-ml-studio.md)

**What is the Machine Learning API service?**

The Machine Learning API service enables you to deploy predictive models, like those that are built into Machine Learning Studio, as scalable, fault-tolerant, web services. The web services that the Machine Learning API service creates are REST APIs that provide an interface for communication between external applications and your predictive analytics models.

For more information, see [How to consume an Azure Machine Learning Web service](consume-web-services.md).

**Where are my Classic web services listed? Where are my New (Azure Resource Manager-based) web services listed?**

Web services created using the Classic deployment model and web services created using the New Azure Resource Manager deployment model are listed in the [Microsoft Azure Machine Learning Web Services](https://services.azureml.net/) portal.

Classic web services are also listed in [Machine Learning Studio](http://studio.azureml.net) on the **Web services** tab.

## Azure Machine Learning questions
**What are Azure Machine Learning web services?**

Machine Learning web services provide an interface between an application and a Machine Learning workflow scoring model. An external application can use Azure Machine Learning to communicate with a Machine Learning workflow scoring model in real time. A call to a Machine Learning web service returns prediction results to an external application. To make a call to a web service, you pass an API key that was created when you deployed the web service. A Machine Learning web service is based on REST, a popular architecture choice for web programming projects.

Azure Machine Learning has two types of web services:

* Request-Response Service (RRS): A low latency, highly scalable service that provides an interface to the stateless models created and deployed by using Machine Learning Studio.
* Batch Execution Service (BES): An asynchronous service that scores a batch for data records.

There are several ways to consume the REST API and access the web service. For example, you can write an application in C#, R, or Python by using the sample code that's generated for you when you deployed the web service.

The sample code is available on:
- The Consume page for the web service in the Azure Machine Learning Web Services portal
- The API Help Page in the web service dashboard in Machine Learning Studio

You can also use the sample Microsoft Excel workbook that's created for you and is available in the web service dashboard in Machine Learning Studio.

**What are the main updates to Azure Machine Learning?**

For the latest updates, see [What's new in Azure Machine Learning](../../active-directory/fundamentals/whats-new.md).

## Machine Learning Studio questions
### Import and export data for Machine Learning
**What data sources does Machine Learning support?**

You can download data to a Machine Learning Studio experiment in three ways:

- Upload a local file as a dataset
- Use a module to import data from cloud data services
- Import a dataset saved from another experiment

To learn more about supported file formats, see [Import training data into Machine Learning Studio](import-data.md).

#### <a id="ModuleLimit"></a>How large can the data set be for my modules?
Modules in Machine Learning Studio support datasets of up to 10 GB of dense numerical data for common use cases. If a module takes more than one input, the 10 GB value is the total of all input sizes. You can also sample larger datasets by using queries from Hive or Azure SQL Database, or you can use Learning by Counts preprocessing before ingestion.  

The following types of data can expand to larger datasets during feature normalization and are limited to less than 10 GB:

* Sparse
* Categorical
* Strings
* Binary data

The following modules are limited to datasets less than 10 GB:

* Recommender modules
* Synthetic Minority Oversampling Technique (SMOTE) module
* Scripting modules: R, Python, SQL
* Modules where the output data size can be larger than input data size, such as Join or Feature Hashing
* Cross-validation, Tune Model Hyperparameters, Ordinal Regression, and One-vs-All Multiclass, when the number of iterations is very large

#### <a id="UploadLimit"></a>What are the limits for data upload?
For datasets that are larger than a couple GBs, upload data to Azure Storage or Azure SQL Database, or use Azure HDInsight rather than directly uploading from a local file.

**Can I read data from Amazon S3?**

If you have a small amount of data and want to expose it via an HTTP URL, then you can use the [Import Data][import-data] module. For larger amounts of data, transfer it to Azure Storage first, and then use the [Import Data][import-data] module to bring it into your experiment.
<!--

<SEE CLOUD DS PROCESS>
-->

**Is there a built-in image input capability?**

You can learn about image input capability in the [Import Images][image-reader] reference.

### Modules
**The algorithm, data source, data format, or data transformation operation that I am looking for isn't in Azure Machine Learning Studio. What are my options?**

You can go to the [user feedback forum](http://go.microsoft.com/fwlink/?LinkId=404231) to see feature requests that we are tracking. Add your vote to a request if a capability that you're looking for has already been requested. If the capability that you're looking for doesn't exist, create a new request. You can view the status of your request in this forum, too. We track this list closely and update the status of feature availability frequently. In addition, you can use the built-in support for R and Python to create custom transformations when needed.

**Can I bring my existing code into Machine Learning Studio?**

Yes, you can bring your existing R or Python code into Machine Learning Studio, run it in the same experiment with Azure Machine Learning learners, and deploy the solution as a web service via Azure Machine Learning. For more information, see [Extend your experiment with R](extend-your-experiment-with-r.md) and [Execute Python machine learning scripts in Azure Machine Learning Studio](execute-python-scripts.md).

**Is it possible to use something like [PMML](http://en.wikipedia.org/wiki/Predictive_Model_Markup_Language) to define a model?**

No, Predictive Model Markup Language (PMML) is not supported. You can use custom R and Python code to define a module.

**How many modules can I execute in parallel in my experiment?**  

You can execute up to four modules in parallel in an experiment.

### Data processing
**Is there an ability to visualize data (beyond R visualizations) interactively within the experiment?**

Click the output of a module to visualize the data and get statistics.

**When previewing results or data in a browser, the number of rows and columns is limited. Why?**

Because large amounts of data might be sent to a browser, data size is limited to prevent slowing down Machine Learning Studio. To visualize all the data/results, it's better to download the data and use Excel or another tool.

### Algorithms
**What existing algorithms are supported in Machine Learning Studio?**

Machine Learning Studio provides state-of-the-art algorithms, such as Scalable Boosted Decision trees, Bayesian Recommendation systems, Deep Neural Networks, and Decision Jungles developed at Microsoft Research. Scalable open-source machine learning packages, like Vowpal Wabbit, are also included. Machine Learning Studio supports machine learning algorithms for multiclass and binary classification, regression, and clustering. See the complete list of [Machine Learning Modules][machine-learning-modules].

**Do you automatically suggest the right Machine Learning algorithm to use for my data?**

No, but Machine Learning Studio has various ways to compare the results of each algorithm to determine the right one for your problem.

**Do you have any guidelines on picking one algorithm over another for the provided algorithms?**

See [How to choose an algorithm](algorithm-choice.md).

**Are the provided algorithms written in R or Python?**

No, these algorithms are mostly written in compiled languages to provide better performance.

**Are any details of the algorithms provided?**

The documentation provides some information about the algorithms and parameters for tuning are described to optimize the algorithm for your use.  

**Is there any support for online learning?**

No, currently only programmatic retraining is supported.

**Can I visualize the layers of a Neural Net Model by using the built-in module?**

No.

**Can I create my own modules in C# or some other language?**

Currently, you can only use R to create new custom modules.

### R module
**What R packages are available in Machine Learning Studio?**

Machine Learning Studio supports more than 400 CRAN R packages today, and here is the [current list](http://az754797.vo.msecnd.net/docs/RPackages.xlsx) of all included packages. Also, see [Extend your experiment with R](extend-your-experiment-with-r.md) to learn how to retrieve this list yourself. If the package that you want is not in this list, provide the name of the package at the [user feedback forum](http://go.microsoft.com/fwlink/?LinkId=404231).

**Is it possible to build a custom R module?**

Yes, see [Author custom R modules in Azure Machine Learning](custom-r-modules.md) for more information.

**Is there a REPL environment for R?**

No, there is no Read-Eval-Print-Loop (REPL) environment for R in the studio.

### Python module
**Is it possible to build a custom Python module?**

Not currently, but you can use one or more [Execute Python Script][python] modules to get the same result.

**Is there a REPL environment for Python?**

You can use the Jupyter Notebooks in Machine Learning Studio. For more information, see [Introducing Jupyter Notebooks in Azure Machine Learning Studio](http://blogs.technet.com/b/machinelearning/archive/2015/07/24/introducing-jupyter-notebooks-in-azure-ml-studio.aspx).

## Web service
### Retrain
**How do I retrain Azure Machine Learning models programmatically?**

Use the retraining APIs. For more information, see [Retrain Machine Learning models programmatically](retrain-models-programmatically.md). Sample code is also available in the [Microsoft Azure Machine Learning Retraining Demo](https://azuremlretrain.codeplex.com/).

### Create
**Can I deploy the model locally or in an application that doesn't have an Internet connection?**

No.

**Is there a baseline latency that is expected for all web services?**

See the [Azure subscription limits](../../azure-subscription-service-limits.md).

### Use
**When would I want to run my predictive model as a Batch Execution service versus a Request Response service?**

The Request Response service (RRS) is a low-latency, high-scale web service that is used to provide an interface to stateless models that are created and deployed from the experimentation environment. The Batch Execution service (BES) is a service that asynchronously scores a batch of data records. The input for BES is like data input that RRS uses. The main difference is that BES reads a block of records from a variety of sources, such as Azure Blob storage, Azure Table storage, Azure SQL Database, HDInsight (hive query), and HTTP sources. For more information, see [How to consume an Azure Machine Learning Web service](consume-web-services.md).

**How do I update the model for the deployed web service?**

To update a predictive model for an already deployed service, modify and rerun the experiment that you used to author and save the trained model. After you have a new version of the trained model available, Machine Learning Studio asks you if you want to update your web service. For details about how to update a deployed web service, see [Deploy a Machine Learning web service](publish-a-machine-learning-web-service.md).

You can also use the Retraining APIs.
For more information, see [Retrain Machine Learning models programmatically](retrain-models-programmatically.md). Sample code is also available in the [Microsoft Azure Machine Learning Retraining Demo](https://azuremlretrain.codeplex.com/).

**How do I monitor my web service deployed in production?**

After you deploy a predictive model, you can monitor it from the Azure Machine Learning Web Services portal. Each deployed service has its own dashboard where you can see monitoring information for that service. For more information about how to manage your deployed web services, see [Manage a Web service using the Azure Machine Learning Web Services portal](manage-new-webservice.md) and [Manage an Azure Machine Learning workspace](manage-workspace.md).

**Is there a place where I can see the output of my RRS/BES?**

For RRS, the web service response is typically where you see the result. You can also write it to Azure Blob storage. For BES, the output is written to a blob by default. You can also write the output to a database or table by using the [Export Data][export-data] module.

**Can I create web services only from models that were created in Machine Learning Studio?**

No, you can also create web services directly by using Jupyter Notebooks and RStudio.

**Where can I find information about error codes?**

See [Machine Learning Module Error Codes](https://msdn.microsoft.com/library/azure/dn905910.aspx) for a list of error codes and descriptions.

## Scalability
**What is the scalability of the web service?**

Currently, the default endpoint is provisioned with 20 concurrent RRS requests per endpoint. You can scale this to 200 concurrent requests per endpoint, and you can scale each web service to 10,000 endpoints per web service as described in [Scaling a Web Service](scaling-webservice.md). For BES, each endpoint can process 40 requests at a time, and additional requests beyond 40 requests are queued. These queued requests run automatically as the queue drains.

**Are R jobs spread across nodes?**

No.  

**How much data can I use for training?**

Modules in Machine Learning Studio support datasets of up to 10 GB of dense numerical data for common use cases. If a module takes more than one input, the total size for all inputs is 10 GB. You can also sample larger datasets via Hive queries, via Azure SQL Database queries, or by preprocessing with [Learning with Counts][counts] modules before ingestion.  

The following types of data can expand to larger datasets during feature normalization and are limited to less than 10 GB:

* Sparse
* Categorical
* Strings
* Binary data

The following modules are limited to datasets less than 10 GB:

* Recommender modules
* Synthetic Minority Oversampling Technique (SMOTE) module
* Scripting modules: R, Python, SQL
* Modules where the output data size can be larger than input data size, such as Join or Feature Hashing
* Cross-Validate, Tune Model Hyperparameters, Ordinal Regression, and One-vs-All Multiclass, when number of iterations is very large

For datasets that are larger than a few GBs, upload data to Azure Storage or Azure SQL Database, or use HDInsight rather than directly uploading from a local file.

**Are there any vector size limitations?**

Rows and columns are each limited to the .NET limitation of Max Int: 2,147,483,647.

**Can I adjust the size of the virtual machine that runs the web service?**

No.  

## Security and availability
**Who can access the http endpoint for the web service by default? How do I restrict access to the endpoint?**

After a web service is deployed, a default endpoint is created for that service. The default endpoint can be called by using its API key. You can add more endpoints with their own keys from the Web Services portal or programmatically by using the Web Service Management APIs. Access keys are needed to make calls to the web service. For more information, see [How to consume an Azure Machine Learning Web service](consume-web-services.md).

**What happens if my Azure storage account can't be found?**

Machine Learning Studio relies on a user-supplied Azure storage account to save intermediary data when it executes the workflow. This storage account is provided to Machine Learning Studio when a workspace is created. After the workspace is created, if the storage account is deleted and can no longer be found, the workspace will stop functioning, and all experiments in that workspace will fail.

If you accidentally deleted the storage account, recreate the storage account with the same name in the same region as the deleted storage account. After that, resync the access key.

**What happens if my storage account access key is out of sync?**

Machine Learning Studio relies on a user-supplied Azure storage account to store intermediary data when it executes the workflow. This storage account is provided to Machine Learning Studio when a workspace is created, and the access keys are associated with that workspace. If the access keys are changed after the workspace is created, the workspace can no longer access the storage account. It will stop functioning and all experiments in that workspace will fail.

If you changed storage account access keys, resync the access keys in the workspace by using the Azure portal.  

## Support and training
**Where can I get training for Azure Machine Learning?**

The [Azure Machine Learning Documentation Center](https://azure.microsoft.com/services/machine-learning/) hosts video tutorials and how-to guides. These step-by-step guides introduce the services and explain the data science life cycle of importing data, cleaning data, building predictive models, and deploying them in production by using Azure Machine Learning.

We add new material to the Machine Learning Center on an ongoing basis. You can submit requests for additional learning material on Machine Learning Center at the [user feedback forum](https://windowsazure.uservoice.com/forums/257792-machine-learning).

You can also find training at [Microsoft Virtual Academy](http://www.microsoftvirtualacademy.com/training-courses/getting-started-with-microsoft-azure-machine-learning).

**How do I get support for Azure Machine Learning?**

To get technical support for Azure Machine Learning, go to [Azure Support](https://azure.microsoft.com/support/options/), and select **Machine Learning**.

Azure Machine Learning also has a community forum on MSDN where you can ask questions about Azure Machine Learning. The Azure Machine Learning team monitors the forum. Go to [Azure Forum](http://social.msdn.microsoft.com/Forums/windowsazure/home?forum=MachineLearning).

## Billing questions
**How does Machine Learning billing work?**

Azure Machine Learning has two components: Machine Learning Studio and Machine Learning web services.

While you are evaluating Machine Learning Studio, you can use the Free billing tier. The Free tier also lets you deploy a Classic web service that has limited capacity.

If you decide that Azure Machine Learning meets your needs, you can sign up for the Standard tier. To sign up, you must have a Microsoft Azure subscription.

In the Standard tier, you are billed monthly for each workspace that you define in Machine Learning Studio. When you run an experiment in the studio, you are billed for compute resources when you are running an experiment. When you deploy a Classic web service, transactions and compute hours are billed on the Pay As You Go basis.

New (Resource Manager-based) web services introduce billing plans that allow for more predictability in costs. Tiered pricing offers discounted rates to customers who need a large amount of capacity.

When you create a plan, you commit to a fixed cost that comes with an included quantity of API compute hours and API transactions. If you need more included quantities, you can add instances to your plan. If you need a lot more included quantities, you can choose a higher tier plan that provides considerably more included quantities and a better discounted rate.

After the included quantities in existing instances are used up, additional usage is charged at the overage rate that's associated with the billing plan tier.

> [!NOTE]
Included quantities are reallocated every 30 days, and unused included quantities do not roll over to the next period.

For additional billing and pricing information, see [Machine Learning Pricing](https://azure.microsoft.com/pricing/details/machine-learning/).

**Does Machine Learning have a free trial?**

 Azure Machine Learning has a free subscription option that's explained in [Machine Learning Pricing](https://azure.microsoft.com/pricing/details/machine-learning/). Machine Learning Studio has an eight-hour quick evaluation trial that's available when you sign in to [Machine Learning Studio](https://studio.azureml.net/?selectAccess=true&o=2).

 In addition, when you sign up for an Azure free trial, you can try any Azure services for a month. To learn more about the Azure free trial, visit [Azure free trial FAQ](https://azure.microsoft.com/pricing/free-trial-faq/).

**What is a transaction?**

A transaction represents an API call that Azure Machine Learning responds to. Transactions from Request-Response Service (RRS) and Batch Execution Service (BES) calls are aggregated and charged against your billing plan.

**Can I use the included transaction quantities in a plan for both RRS and BES transactions?**

Yes, your transactions from your RRS and BES are aggregated and charged against your billing plan.

**What is an API compute hour?**

An API compute hour is the billing unit for the time that API calls take to run by using Machine Learning compute resources. All your calls are aggregated for billing purposes.

**How long does a typical production API call take?**

Production API call times can vary significantly, generally ranging from hundreds of milliseconds to a few seconds. Some API calls might require minutes depending on the complexity of the data processing and machine-learning model. The best way to estimate production API call times is to benchmark a model on the Machine Learning service.

**What is a Studio compute hour?**

A Studio compute hour is the billing unit for the aggregate time that your experiments use compute resources in studio.

**In New (Azure Resource Manager-based) web services, what is the Dev/Test tier meant for?**

Resource Manager-based web services provide multiple tiers that you can use to provision your billing plan. The Dev/Test pricing tier provides limited, included quantities that allow you to test your experiment as a web service without incurring costs. You have the opportunity to see how it works.

**Are there separate storage charges?**

The Machine Learning Free tier does not require or allow separate storage. The Machine Learning Standard tier requires users to have an Azure storage account. Azure Storage is [billed separately](https://azure.microsoft.com/pricing/details/storage/).

**Does Machine Learning support high availability?**

Yes. For details, see [Machine Learning Pricing](https://azure.microsoft.com/pricing/details/machine-learning/) for a description of the service level agreement (SLA).

**What specific kind of compute resources will my production API calls be run on?**

The Machine Learning service is a multitenant service. Actual compute resources that are used on the back end vary and are optimized for performance and predictability.

### Management of New (Resource Manager-based) web services
**What happens if I delete my plan?**

The plan is removed from your subscription, and you are billed for prorated usage.

> [!NOTE]
You cannot delete a plan that a web service is using. To delete the plan, you must either assign a new plan to the web service or delete the web service.

**What is a plan instance?**

A plan instance is a unit of included quantities that you can add to your billing plan. When you select a billing tier for your billing plan, it comes with one instance. If you need more included quantities, you can add instances of the selected billing tier to your plan.

**How many plan instances can I add?**

You can have one instance of the Dev/Test pricing tier in a subscription.

For Standard S1, Standard S2, and Standard S3 tiers, you can add as many as necessary.

> [!NOTE]
Depending on your anticipated usage, it might be more cost effective to upgrade to a tier that has more included quantities rather than add instances to the current tier.

**What happens when I change plan tiers (upgrade / downgrade)?**

The old plan is deleted and the current usage is billed on a prorated basis. A new plan with the full included quantities of the upgraded/downgraded tier is created for the rest of the period.

> [!NOTE]
Included quantities are allocated per period, and unused quantities do not roll over.

**What happens when I increase the instances in a plan?**

Quantities are included on a prorated basis and may take 24 hours to be effective.

**What happens when I delete an instance of a plan?**

The instance is removed from your subscription, and you are billed for prorated usage.

### Sign up for New (Resource Manager-based) web services plans
**How do I sign up for a plan?**

You have two ways to create billing plans.

When you first deploy a Resource Manager-based web service, you can choose an existing plan or create a new plan.

Plans that you create in this manner are in your default region, and your web service will be deployed to that region.

If you want to deploy services to regions other than your default region, you may want to define your billing plans before you deploy your service.

In that case, you can sign in to the Azure Machine Learning Web Services portal, and go to the Plans page. From there, you can add plans, delete plans, and modify existing plans.

**Which plan should I choose to start off with?**

We recommend you that you start with the Standard S1 tier and monitor your service for usage. If you find that you are using your included quantities rapidly, you can add instances or move to a higher tier and get better discounted rates. You can adjust your billing plan as needed throughout your billing cycle.

**Which regions are the new plans available in?**

The new billing plans are available in the three production regions in which we support the new web services:

* South Central US
* West Europe
* South East Asia

**I have web services in multiple regions. Do I need a plan for every region?**

Yes. Plan pricing varies by region. When you deploy a web service to another region, you need to assign it a plan that is specific to that region. For more information, see [Products available by region]( https://azure.microsoft.com/regions/services/).

### New web services: Overages
**How do I check if I exceeded my web service usage?**

You can view the usage on all your plans on the Plans page in the Azure Machine Learning Web Services portal. Sign in to the portal, and then click the **Plans** menu option.

In the **Transactions** and **Compute** columns of the table, you can see the included quantities of the plan and the percentage used.

**What happens when I use up the include quantities in the Dev/Test pricing tier?**

Services that have a Dev/Test pricing tier assigned to them are stopped until the next period or until you move them to a paid tier.

**For Classic web services and overages of New (Resource Manager-based) web services, how are prices calculated for Request Response (RRS) and Batch (BES) workloads?**

For an RRS workload, you are charged for every API transaction call that you make and for the compute time that's associated with those requests. Your RRS production API transaction costs are calculated as the total number of API calls that you make multiplied by the price per 1,000 transactions (prorated by individual transaction). Your RRS API production API compute hour costs are calculated as the amount of time required for each API call to run, multiplied by the total number of API transactions, multiplied by the price per production API compute hour.

For example, for Standard S1 overage, 1,000,000 API transactions that take 0.72 seconds each to run would result in (1,000,000 * $0.50/1K API transactions) in $500 in production API transaction costs and (1,000,000 * 0.72 sec * $2/hr) $400 in production API compute hours, for a total of $900.

For a BES workload, you are charged in the same manner. However, the API transaction costs represent the number of batch jobs that you submit, and the compute costs represent the compute time that's associated with those batch jobs. Your BES production API transaction costs are calculated as the total number of jobs submitted multiplied by the price per 1,000 transactions (prorated by individual transaction). Your BES API production API compute hour costs are calculated as the amount of time required for each row in your job to run multiplied by the total number of rows in your job multiplied by the total number of jobs multiplied by the price per production API compute hour. When you use the Machine Learning calculator, the transaction meter represents the number of jobs that you plan to submit, and the time-per-transaction field represents the combined time that's needed for all rows in each job to run.

For example, assume Standard S1 overage, and you submit 100 jobs per day that each consist of 500 rows that take 0.72 seconds each. Your monthly overage costs would be (100 jobs per day = 3,100 jobs/mo * $0.50/1K API transactions) $1.55 in production API transaction costs and (500 rows * 0.72 sec * 3,100 Jobs * $2/hr) $620 in production API compute hours, for a total of $621.55.

### Azure Machine Learning Classic web services
**Is Pay As You Go still available?**

Yes, Classic web services are still available in Azure Machine Learning.  

### Azure Machine Learning Free and Standard tier
**What is included in the Azure Machine Learning Free tier?**

The Azure Machine Learning Free tier is intended to provide an in-depth introduction to the Azure Machine Learning Studio. All you need is a Microsoft account to sign up. The Free tier includes free access to one Azure Machine Learning Studio workspace per [Microsoft account](https://account.microsoft.com/account). In this tier, you can use up to 10 GB of storage and operationalize models as staging APIs. Free tier workloads are not covered by an SLA and are intended for development and personal use only. 

Free tier workspaces have the following limitations:

* Workloads can't access data by connecting to an on-premises server that runs SQL Server.
* You cannot deploy New Resource Manager base web services.


**What is included in the Azure Machine Learning Standard tier and plans?**

The Azure Machine Learning Standard tier is a paid production version of Azure Machine Learning Studio. The Azure Machine Learning Studio monthly fee is billed on a per workspace per month basis and prorated for partial months. Azure Machine Learning Studio experiment hours are billed per compute hour for active experimentation. Billing is prorated for partial hours.  

The Azure Machine Learning API service is billed depending on whether it's a Classic web service or a New (Resource Manager-based) web service.

The following charges are aggregated per workspace for your subscription.

* Machine Learning Workspace Subscription: The Machine Learning workspace subscription is a monthly fee that provides access to a Machine Learning Studio workspace. The subscription is required to run experiments in the studio and to utilize the production APIs.
* Studio Experiment hours: This meter aggregates all compute charges that are accrued by running experiments in Machine Learning Studio and running production API calls in the staging environment.
* Access data by connecting to an on-premises server that runs SQL Server in your models for your training and scoring.
* For Classic web services:
  * Production API Compute Hours: This meter includes compute charges that are accrued by web services running in production.
  * Production API Transactions (in 1000s): This meter includes charges that are accrued per call to your production web service.

Apart from the preceding charges, in the case of Resource Manager-based web service, charges are aggregated to the selected plan:

* Standard S1/S2/S3 API Plan (Units): This meter represents the type of instance that's selected for Resource Manager-based web services.
* Standard S1/S2/S3 Overage API Compute Hours: This meter includes compute charges that are accrued by Resource Manager-based web services that run in production after the included quantities in existing instances are used up. The additional usage is charged at the overate rate that's associated with S1/S2/S3 plan tier.
* Standard S1/S2/S3 Overage API Transactions (in 1,000s): This meter includes charges that are accrued per call to your production Resource Manager-based web service after the included quantities in existing instances are used up. The additional usage is charged at the overate rate associated with S1/S2/S3 plan tier.
* Included Quantity API Compute Hours: With Resource Manager-based web services, this meter represents the included quantity of API compute hours.
* Included Quantity API Transactions (in 1,000s): With Resource Manager-based web services, this meter represents the included quantity of API transactions.

**How do I sign up for Azure Machine Learning Free tier?**

All you need is a Microsoft account. Go to [Azure Machine Learning home](https://azure.microsoft.com/services/machine-learning/), and then click **Start Now**. Sign in with your Microsoft account and a workspace in Free tier is created for you. You can start to explore and create Machine Learning experiments right away.

**How do I sign up for Azure Machine Learning Standard tier?**

You must first have access to an Azure subscription to create a Standard Machine Learning workspace. You can sign up for a 30-day free trial Azure subscription and later upgrade to a paid Azure subscription, or you can purchase a paid Azure subscription outright. You can then create a Machine Learning workspace from the Microsoft Azure portal after you gain access to the subscription. View the [step-by-step instructions](https://azure.microsoft.com/trial/get-started-machine-learning-b/).

Alternatively, you can be invited by a Standard Machine Learning workspace owner to access the owner's workspace.

**Can I specify my own Azure Blob storage account to use with the Free tier?**

No, the Standard tier is equivalent to the version of the Machine Learning service that was available before the tiers were introduced.

**Can I deploy my machine learning models as APIs in the Free tier?**

Yes, you can operationalize machine learning models to staging API services as part of the Free tier. To put the staging API service into production and get a production endpoint for the operationalized service, you must use the Standard tier.

**What is the difference between Azure free trial and Azure Machine Learning Free tier?**

The [Microsoft Azure free trial](https://azure.microsoft.com/free/) offers credits that you can apply to any Azure service for one month. The Azure Machine Learning Free tier offers continuous access specifically to Azure Machine Learning for non-production workloads.

**How do I move an experiment from the Free tier to the Standard tier?**

To copy your experiments from the Free tier to the Standard tier:

1. Sign in to Azure Machine Learning Studio, and make sure that you can see both the Free workspace and the Standard workspace in the workspace selector in the top navigation bar.
2. Switch to Free workspace if you are in the Standard workspace.
3. In the experiment list view, select an experiment that you'd like to copy, and then click the **Copy** command button.
4. Select the Standard workspace from the dialog box that opens, and then click the **Copy** button.
   All the associated datasets, trained model, etc. are copied together with the experiment into the Standard workspace.
5. You need to rerun the experiment and republish your web service in the Standard workspace.

### Studio workspace
**Will I see different bills for different workspaces?**

Workspace charges are broken out separately for each applicable meter on a single bill.

**What specific kind of compute resources will my experiments be run on?**

The Machine Learning service is a multitenant service. Actual compute resources that are used on the back end vary and are optimized for performance and predictability.

### Guest Access
**What is Guest Access to Azure Machine Learning Studio?**

Guest Access is a restricted trial experience. You can create and run experiments in Azure Machine Learning Studio at no cost and without authentication. Guest sessions are non-persistent (cannot be saved) and limited to eight hours. Other limitations include lack of support for R and Python, lack of staging APIs, and restricted dataset size and storage capacity. By comparison, users who choose to sign in with a Microsoft account have full access to the Free tier of Machine Learning Studio that's described previously, which includes a persistent workspace and more comprehensive capabilities. To choose your free Machine Learning experience, click **Get started** on [https://studio.azureml.net](https://studio.azureml.net), and then select **Guess Access** or sign in with a Microsoft account.

<!-- Module References -->
[image-reader]: https://msdn.microsoft.com/library/azure/893f8c57-1d36-456d-a47b-d29ae67f5d84/
[join]: https://msdn.microsoft.com/library/azure/124865f7-e901-4656-adac-f4cb08248099/
[machine-learning-modules]: https://msdn.microsoft.com/library/azure/6d9e2516-1343-4859-a3dc-9673ccec9edc/
[partition-and-sample]: https://msdn.microsoft.com/library/azure/a8726e34-1b3e-4515-b59a-3e4a475654b8/
[import-data]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/
[export-data]: https://msdn.microsoft.com/library/azure/7A391181-B6A7-4AD4-B82D-E419C0D6522C
[split]: https://msdn.microsoft.com/library/azure/70530644-c97a-4ab6-85f7-88bf30a8be5f/
[python]: https://msdn.microsoft.com/library/azure/CDB56F95-7F4C-404D-BDE7-5BB972E6F232
[counts]: https://msdn.microsoft.com/library/azure/dn913056.aspx
