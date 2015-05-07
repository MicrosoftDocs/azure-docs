<properties 
	pageTitle="Azure Machine Learning FAQ | Azure" 
	description="Frequently asked questions about Microsoft Azure Machine Learning" 
	services="machine-learning" 
	documentationCenter="" 
	authors="pablissima" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/07/2015" 
	ms.author="paulettm"/>

#Azure Machine Learning Frequently Asked Questions (FAQ)
 
##General questions

**What is Azure Machine Learning?**
 
Azure Machine Learning is a fully managed service that you can use to create, test, operate, and manage predictive analytic solutions in the cloud. With only a browser, you can sign-in, upload data, and immediately start machine learning experiments. Visual composition, a large pallet of modules, and a library of starting templates makes common machine learning tasks simple and quick.  For more information, see the [Azure Machine Learning service overview](/services/machine-learning/).


[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]
 
**What is Machine Learning Studio?**

Machine Learning Studio is a workbench environment you access through a web browser. Machine Learning Studio hosts a pallet of modules with a visual composition interface that enables you to build an end-to-end, data-science workflow in the form of an experiment. 

For more information about the Machine Learning Studio, see [What is Machine Learning Studio](machine-learning-what-is-ml-studio.md)

**What is the Machine Learning API service?**

The Machine Learning API service enables you to deploy predictive models built in Machine Learning Studio as scalable, fault-tolerant, web services. The web services created by the Machine Learning API service are REST APIs that provide an interface for communication between external applications and your predictive analytics models. 

See [Connect to a Machine Learning web service](machine-learning-connect-to-azure-machine-learning-web-service.md) for more information.

**Is it possible to use something like [PMML](http://en.wikipedia.org/wiki/Predictive_Model_Markup_Language)  to define a model?**

No, that is not supported, however custom R and Python code can be used to define a module.


##Billing questions

**How does Machine Learning billing work?**

For billing and pricing information, see [Machine Learning Pricing](http://azure.microsoft.com/pricing/details/machine-learning/).

**Does Machine Learning have a free trial?**

 When you sign up for an Azure free trial, you can try any Azure services for a month. To learn more about Azure free trial, visit [Azure Free Trial FAQ](/pricing/free-trial-faq/).

## Machine Learning Studio questions

###Creating an experiment	
**Is there version control or Git integration for experiment graphs?**

No, however each time an experiment is run that version of the graph is kept and cannot be modified by other users.

###Importing and exporting data for Machine Learning
**What data sources does Machine Learning support?**

Data can be loaded into Machine Learning Studio in one of two ways: by uploading local files as a dataset or by using a reader module to import data. Local files can be uploaded by adding new datasets in Machine Learning Studio. See [Import training data into Machine Learning Studio](machine-learning-import-data.md) to learn more about supported file formats. 


####<a id="ModuleLimit"></a>How large can the data set be for my modules?

Modules in Machine Learning Studio support datasets of up to 10 GB of dense numerical data for common use cases. If a module takes more than one input, the 10 GB is the total of all input sizes. You can also sample larger datasets via Hive or Azure SQL Database queries, or by Learning by Counts pre-processing, before ingestion.  

The following types of data can expand into larger datasets during feature normalization, and are limited to less than 10 GB:

- Sparse
- Categorical
- Strings
- Binary data

The following modules are limited to datasets less than 10GB:

- Recommender modules
- SMOTE module
- Scripting modules: R, Python, SQL
- Modules where the output data size can be larger than input data size, such as Join or Feature Hashing.
- Cross-validation, Sweep Parameters, Ordinal Regression and One-vs-All Multiclass, when number of iterations is very large.

For datasets larger than a few GB, you should upload data to Azure storage or Azure SQL Database or use HDInsight, rather than directly uploading from local file.


####<a id="UploadLimit"></a>What are the limits for data upload?
For datasets larger than a couple GB, upload data to Azure storage or Azure SQL Database or use HDInsight, rather than directly uploading from local file.

**Can I read data from Amazon S3?**

If you have a small amount of data and want to expose it via an http URL, then you can use the [Reader][reader] module. For any larger amounts of data to transfer it to Azure Storage first and then use the [Reader][reader] module to bring it into your experiment. 
<!--
<SEE CLOUD DS PROCESS>
--> 

**Is there a built-in image input capability?** 

You can learn about image input capability in the [Image Reader][image-reader] reference.

###Modules 

**The algorithm, data source, data format, or data transformation operation I am looking for isn't in Azure ML Studio, what are my options?**

You can visit the [user feedback forum](http://go.microsoft.com/fwlink/?LinkId=404231) to see features requests that we are tracking. Add your vote to this request if a capability you are looking for has already been requested. If the capability you are looking for does not exist, create a new request. You can view the status of your request in this forum too. We track this list closely and update the status of feature availability frequently. In addition with the built-in support for R and Python, custom transformations can be created as needed. 


**Can I bring my existing code into ML Studio?** 

Yes, you can bring your existing R code in ML Studio and run it in the same experiment with Azure Machine Learning-provided learners and publish this as a web service via Azure Machine Learning. See [Extend your experiment with R ](machine-learning-extend-your-experiment-with-r.md). 

###Data processing 
**Is there an ability to visualize data (beyond R visualizations) interactively within the experiment?**

By clicking on the output of a module you can visualize the data and get  statistics. 

**When previewing results or data in the browser, the number of rows and columns is limited, why?**

Since the data is being transmitted to the browser and may be large, the data size is limited to prevent slowing down the ML studio. It is better to download the data/result and use Excel or another tool to visualize the entire data.

###Algorithms
**What existing algorithms are supported in Machine Learning Studio?**

Machine Learning Studio provides state of the art algorithms, such as Scalable Boosted Decision trees, Bayesian Recommendation systems, Deep Neural Networks, and Decision Jungles developed at Microsoft Research. Scalable open-source machine learning packages like Vowpal Wabbit are also included. Machine Learning Studio supports machine learning algorithms for multiclass and binary classification, regression, and clustering. See the complete list of [Machine Learning Modules][machine-learning-modules].

**Do you automatically suggest the right Machine Learning algorithm to use for my data?** 

No, however there are a number of ways in Machine Learning Studio to compare the results of each algorithm to determine the right one for your problem. 

**Do you have any guidelines on picking one algorithm over another for the provided algorithms?** 
See [How to choose an algorithm ](machine-learning-algorithm-choice.md). 

**Are the provided algorithms written in R or Python?** 

No, these algorithms are mostly written in compiled languages to provide higher performance. 

**Are any details of the algorithms provided?** 

The documentation provides some information about the algorithms, and the parameters provided for tuning are described to optimize the algorithm for your use.  

**Is there any support for online learning?** 

No, currently only programmatic retraining is supported. 

**Can I visualize the layers of a Neural Net Model using the built-in Module?** 

No. 

**Can I create my own modules in C# or some other language?** 

Currently new custom modules can only be created in R. 

###R module 
**What R packages are available in Machine Learning Studio?** 

Machine Learning Studio supports 400+ R packages today, and this list is constantly growing. See [Extend your experiment with R ](machine-learning-extend-your-experiment-with-r.md) to learn how to get a list of supported R packages. If the package you want is not in this list, provide the name of package at [user feedback forum](http://go.microsoft.com/fwlink/?LinkId=404231). 

**Is it possible to build a custom R module?** 

Yes, see [Author custom R modules in Azure Machine Learning](machine-learning-custom-r-modules.md) for more information.

**Is there a REPL environment for R?** 

No, there is no REPL environment for R in the studio. 

###Python module 

**Is it possible to build a custom Python module?** 

Not currently, but with the standard Python module or a set of them the same result can be achieved. 

**Is there a REPL environment for Python?** 

No, there is no REPL environment for Python in the studio. 

## Web service
###Retrainining Models Programmatically

**How do I Retrain AzureML Models programmaticlly?**
Use the Retraining APIs. Sample code is available [here](https://azuremlretrain.codeplex.com/).

###Create

**Can I deploy the model locally or in an application without an internet connection?**
No.


**Is there a baseline latency that is expected for all web services?** 

See the [Azure subscription limits](azure-subscription-service-limits.md)

###Use
**When would I want to run my predictive model as a Batch Execution service versus a Request Response service?**

The Request Response service (RRS) is a low-latency, high-scale web service that is used to provide an interface to stateless models that are created and published from the experimentation environment. The Batch Execution service (BES) is a service for asynchronously scoring a batch of data records. The input for BES is similar to data input used in RRS. The main difference is that BES reads a block of records from a variety of sources, such as the Blob service and Table service in Azure, Azure SQL Database, HDInsight (hive query), and HTTP sources. For more information, see [How to consume Machine Learning web services](machine-learning-consume-web-services.md). 

**How do I update the model for the deployed web service?** 

Updating a predictive model for an already deployed service is as simple as modifying and re-running the experiment used to author and save the trained model. Once you have new version of the trained model available, ML Studio will ask you if you want to update your staging web service. After the update is applied to the staging web service, the same update will become available for you to apply to the production web service as well. See [Publish a Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md) for details on how to update a deployed web service. 


**How do I monitor my Web service deployed in production?** 

Once a predictive model has been put into production, you can monitor it from the Azure portal. Each deployed service has its own dashboard, where you can see monitoring information for that service. 

**Is there a place where I can see the output of my RRS/BES?** 

Yes, you must provide a blob storage location and the output of the RRS/BES will be placed there. 



##Scalability 

**What is the scalability of the web service?** 

Currently, the maximum is 20 concurrent requests per end point, though it can scale to 80 end points. This translates to 4,800 concurrent request if we use every resource (300 workers).  


**Are R jobs spread across nodes?** 

No.  


**How much data can I train on?** 

Modules in Machine Learning Studio support datasets of up to 10 GB of dense numerical data for common use cases. If a module takes more than one input, the 10 GB is the total of all input sizes. You can also sample larger datasets via Hive or Azure SQL Database queries, or by Learning by Counts pre-processing, before ingestion.  

The following types of data can expand into larger datasets during feature normalization, and are limited to less than 10 GB:

- Sparse
- Categorical
- Strings
- Binary data

The following modules are limited to datasets less than 10GB:

- Recommender modules
- SMOTE module
- Scripting modules: R, Python, SQL
- Modules where the output data size can be larger than input data size, such as Join or Feature Hashing.
- Cross-validation, Sweep Parameters, Ordinal Regression and One-vs-All Multiclass, when number of iterations is very large.

For datasets larger than a few GB, you should upload data to Azure storage or Azure SQL Database or use HDInsight, rather than directly uploading from local file.


**Are there any vector size limitations?** 

Rows and columns are each limited to the .NET limitation of  Max Int: 2,147,483,647. 

**Can the VM size that this is being run on be adjusted?** 

No.  

##Security and availability 

**Who has access to the http end point for the web service deployed in production by default? How do I restrict access to the end point?** 

Once a predictive model has been put into production, the Azure Portal lists the URL for the deployed web services. Staging service URLs are accessible from the Machine Learning Studio Environment in the web services section; Production service URLs are accessible from Azure Portal, in the Machine Learning section. Access keys are provided for both Staging and Production web services from the web service dashboard in the Machine Learning Studio and Azure portal environments, respectively. Access keys are needed to make calls to the web service in production and staging. For more information, see [Connect to a Machine Learning web service](machine-learning-connect-to-azure-machine-learning-web-service.md).

**What happens if my Storage Account cannot be found?** 

Machine Learning Studio relies on a user supplied Azure Storage Account to save intermediary data when executing the workflow. This Storage Account is provided to Machine Learning Studio at the time a workspace is created. After the workspace is created, if the Storage Account is deleted and can no longer be found, that workspace will stop functioning and all experiments in that workspace will fail.
 
If you accidentally deleted the Storage Account, the only way to recover from it is to recreate that Storage Account with the exact same name in the exact same Region as the deleted one. After that, please re-sync the Access Key.
 

**What happens if my Storage Account Access Key is out of sync?** 
Machine Learning Studio relies on a user supplied Azure Storage Account to save intermediary data when executing the workflow. This Storage Account is provided to Machine Learning Studio at the time a workspace is created and the Access Keys are associated with that workspace. After the workspace is created, if the Access keys are changed, that workspace can no longer access the Storage Account, and it will stop functioning and all experiments in that workspace will fail.

If you have changed Storage Account Access Keys, please ensure to resync the Access Keys in the workspace setting in the Azure portal  


##Azure Marketplace 

See the [FAQ for publishing and using apps in the Machine Learning Marketplace](machine-learning-marketplace-faq.md)

##Support and training 

**Where can I get training for Azure ML?** 

[Azure Machine Learning Documentation Center](/services/machine-learning/) hosts video tutorials as well as how-to guides. These step-by-step guides provide an introduction to the services and walk through the data science life cycle of importing data, cleaning data, building predictive models and deploying them in production with Azure ML. 

We will be adding new material to Machine Learning Center on an ongoing basis. You can submit requests for additional learning material on Machine Learning Center at [user feedback forum](https://windowsazure.uservoice.com/forums/257792-machine-learning). 

You can also find training at [Microsoft Virtual Academy](http://www.microsoftvirtualacademy.com/training-courses/getting-started-with-microsoft-azure-machine-learning)

**How do I get support for Azure Machine Learning?** 

To get technical support for Azure Machine Learning,  go to [Azure Support](/support/options/) select **Machine Learning**.

Azure Machine Learning also has a community forum on MSDN, where you can ask Azure ML related questions. The forum is monitored by the Azure ML team. Visit [Azure Forum](http://social.msdn.microsoft.com/Forums/windowsazure/home?forum=MachineLearning). 


<!-- Module References -->
[image-reader]: https://msdn.microsoft.com/library/azure/893f8c57-1d36-456d-a47b-d29ae67f5d84/
[join]: https://msdn.microsoft.com/library/azure/124865f7-e901-4656-adac-f4cb08248099/
[machine-learning-modules]: https://msdn.microsoft.com/library/azure/6d9e2516-1343-4859-a3dc-9673ccec9edc/
[partition-and-sample]: https://msdn.microsoft.com/library/azure/a8726e34-1b3e-4515-b59a-3e4a475654b8/
[reader]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/
[split]: https://msdn.microsoft.com/library/azure/70530644-c97a-4ab6-85f7-88bf30a8be5f/
