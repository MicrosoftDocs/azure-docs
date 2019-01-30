---
title: Machine Learning Studio frequently asked questions (FAQs)
titleSuffix: Azure Machine Learning Studio
description: 'Azure Machine Learning Studio: FAQ covering billing, capabilities, and limitations of a cloud service for streamlined predictive modeling.'
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: ericlicoding
ms.author: amlstudiodocs
ms.custom: seodec18
ms.date: 06/02/2017
---
# Azure Machine Learning Studio FAQ: capabilities and limitations
Here are some frequently asked questions (FAQs) and corresponding answers about Azure Machine Learning, a cloud service for developing predictive models and operationalizing solutions through web services. 

## General questions
**What is Machine Learning Studio?**

Machine Learning Studio is a drag-and-drop canvas environment that you access by using a web browser. Machine Learning Studio hosts a pallet of modules in a visual composition interface that helps you build an end-to-end, data-science workflow in the form of an experiment.

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

## Import and export data for Machine Learning
**What data sources does Machine Learning support?**

You can download data to a Machine Learning Studio experiment in three ways:

- Upload a local file as a dataset
- Use a module to import data from cloud data services
- Import a dataset saved from another experiment

To learn more about supported file formats, see [Import training data into Machine Learning Studio](import-data.md).

### <a id="ModuleLimit"></a>How large can the data set be for my modules?
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

### <a id="UploadLimit"></a>What are the limits for data upload?
For datasets that are larger than a couple GBs, upload data to Azure Storage or Azure SQL Database, or use Azure HDInsight rather than directly uploading from a local file.

**Can I read data from Amazon S3?**

If you have a small amount of data and want to expose it via an HTTP URL, then you can use the [Import Data][import-data] module. For larger amounts of data, transfer it to Azure Storage first, and then use the [Import Data][import-data] module to bring it into your experiment.
<!--

<SEE CLOUD DS PROCESS>
-->

**Is there a built-in image input capability?**

You can learn about image input capability in the [Import Images][image-reader] reference.

## Modules
**The algorithm, data source, data format, or data transformation operation that I am looking for isn't in Azure Machine Learning Studio. What are my options?**

You can go to the [user feedback forum](https://go.microsoft.com/fwlink/?LinkId=404231) to see feature requests that we are tracking. Add your vote to a request if a capability that you're looking for has already been requested. If the capability that you're looking for doesn't exist, create a new request. You can view the status of your request in this forum, too. We track this list closely and update the status of feature availability frequently. In addition, you can use the built-in support for R and Python to create custom transformations when needed.

**Can I bring my existing code into Machine Learning Studio?**

Yes, you can bring your existing R or Python code into Machine Learning Studio, run it in the same experiment with Azure Machine Learning learners, and deploy the solution as a web service via Azure Machine Learning. For more information, see [Extend your experiment with R](extend-your-experiment-with-r.md) and [Execute Python machine learning scripts in Azure Machine Learning Studio](execute-python-scripts.md).

**Is it possible to use something like [PMML](http://en.wikipedia.org/wiki/Predictive_Model_Markup_Language) to define a model?**

No, Predictive Model Markup Language (PMML) is not supported. You can use custom R and Python code to define a module.

**How many modules can I execute in parallel in my experiment?**  

You can execute up to four modules in parallel in an experiment.

## Data processing
**Is there an ability to visualize data (beyond R visualizations) interactively within the experiment?**

Click the output of a module to visualize the data and get statistics.

**When previewing results or data in a browser, the number of rows and columns is limited. Why?**

Because large amounts of data might be sent to a browser, data size is limited to prevent slowing down Machine Learning Studio. To visualize all the data/results, it's better to download the data and use Excel or another tool.

## Algorithms
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

## R module
**What R packages are available in Machine Learning Studio?**

Machine Learning Studio supports more than 400 CRAN R packages today, and here is the [current list](http://az754797.vo.msecnd.net/docs/RPackages.xlsx) of all included packages. Also, see [Extend your experiment with R](extend-your-experiment-with-r.md) to learn how to retrieve this list yourself. If the package that you want is not in this list, provide the name of the package at the [user feedback forum](https://go.microsoft.com/fwlink/?LinkId=404231).

**Is it possible to build a custom R module?**

Yes, see [Author custom R modules in Azure Machine Learning](custom-r-modules.md) for more information.

**Is there a REPL environment for R?**

No, there is no Read-Eval-Print-Loop (REPL) environment for R in the studio.

## Python module
**Is it possible to build a custom Python module?**

Not currently, but you can use one or more [Execute Python Script][python] modules to get the same result.

**Is there a REPL environment for Python?**

You can use the Jupyter Notebooks in Machine Learning Studio. For more information, see [Introducing Jupyter Notebooks in Azure Machine Learning Studio](http://blogs.technet.com/b/machinelearning/archive/2015/07/24/introducing-jupyter-notebooks-in-azure-ml-studio.aspx).

## Web service

**How do I retrain Azure Machine Learning models programmatically?**

Use the retraining APIs. For more information, see [Retrain Machine Learning models programmatically](retrain-models-programmatically.md). Sample code is also available in the [Microsoft Azure Machine Learning Retraining Demo](https://azuremlretrain.codeplex.com/).

**Can I deploy the model locally or in an application that doesn't have an Internet connection?**

No.

**Is there a baseline latency that is expected for all web services?**

See the [Azure subscription limits](../../azure-subscription-service-limits.md).

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


## Billing questions

For billing and pricing information, see [Machine Learning Pricing](https://azure.microsoft.com/pricing/details/machine-learning/).


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
