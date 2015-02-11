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
	ms.date="08/06/2014" 
	ms.author="pamehta"/>

#Azure Machine Learning Frequently Asked Questions (FAQ)
 
##General questions

**What is Azure Machine Learning?**
 
Azure Machine Learning is a fully managed service that you can use to create, test, operate, and manage predictive analytic solutions in the cloud. With only a browser, you can sign-in, upload data, and immediately start machine learning experiments. Visual composition, a large pallet of modules, and a library of starting templates makes common machine learning tasks simple and quick.  For more information, see the [Azure Machine Learning service overview](http://azure.microsoft.com/en-us/services/machine-learning/).




[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]
 
**What is Machine Learning Studio?**

Machine Learning Studio is a workbench environment you access through a web browser. Machine Learning Studio hosts a pallet of modules with a visual composition interface that enables you to build an end-to-end, data-science workflow in the form of an experiment. 

For more information about the Machine Learning Studio, see [What is Machine Learning Studio](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-what-is-ml-studio/)

**What is the Machine Learning API service?**

The Machine Learning API service enables you to deploy predictive models built in Machine Learning Studio as scalable, fault-tolerant, web services. The web services created by the Machine Learning API service are REST APIs that provide an interface for communication between external applications and your predictive analytics models. 

See [Get started using the Machine Learning API service](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-get-started-api/) for more information.

**Is it possible to use something like [PMML](http://en.wikipedia.org/wiki/Predictive_Model_Markup_Language)  to define a model?**

No, that is not supported, however custom R and Python code can be used to define a module.


##Billing questions

**How does Machine Learning billing work?**

For billing and pricing information, see [Machine Learning Pricing](http://azure.microsoft.com/en-us/pricing/details/machine-learning/).

**Does Machine Learning have a free trial?**

 When you sign up for an Azure free trial, you can try any Azure services for a month. To learn more about Azure free trial, visit [Azure Free Trial FAQ](http://azure.microsoft.com/en-us/pricing/free-trial-faq/).

## Machine Learning Studio questions

###Creating an experiment	
**Is there version control or Git integration for experiment graphs?**

No, however each time an experiment is run that version of the graph is kept and cannot be modified by other users.

###Importing/Exporting Data for AzureML
**What data sources does Machine Learning support?**

Data can be loaded into Machine Learning Studio in one of two ways: by uploading local files as a dataset or by using a reader module to import data. Local files can be uploaded by adding new datasets in Machine Learning Studio. See [Import training data into Machine Learning Studio](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-import-data/) to learn more about supported file formats. 


**How large can my data set be?**

Machine Learning Studio supports  training datasets up to 10 GB. There is no limit on the dataset size for web services.  You can also sample larger datasets via Hive or Azure SQL Database queries before ingestion. If you are working with data larger than 10 GB, you can create multiple datasets and use the **Partition and Sample**, **Split**, or **Join** modules to combine these datasets in Machine Learning Studio to create training sets for building predictive models. Visit the module Help in Machine Learning Studio to learn more about these modules.

For datasets larger than a couple GB, upload data to Azure storage or Azure SQL Database or use HDInsight, rather than directly uploading from local file.

**Can I read data from Amazon S3?**

If you have a small amount of data and want to expose it via an http URL, then you can use the reader module. For any larger amounts of data to transfer it to Azure Storage first and then use the Reader module to bring it into your experiment. <SEE CLOUD DS PROCESS> 

**Is there a built-in image input capability?** 

Please, see documentation here on dealing with images. <ADD LINK>

###Modules 

**The algorithm, data source, data format, or data transformation operation I am looking for isn't in Azure ML Studio, what are my options?**

You can visit the [user feedback forum](http://go.microsoft.com/fwlink/?LinkId=404231) to see features requests that we are tracking. Add your vote to this request if a capability you are looking for has already been requested. If the capability you are looking for does not exist, create a new request. You can view the status of your request in this forum too. We track this list closely and update the status of feature availability frequently. In addition with the built-in support for R and Python, custom transformations can be created as needed. 


**Can I bring my existing code into ML Studio?** 

Yes, you can bring your existing R code in ML Studio and run it in the same experiment with Azure Machine Learning-provided learners and publish this as a web service via Azure Machine Learning. See [Extend your experiment with R ](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-extend-your-experiment-with-r/). 

###Data Processing 
**Is there an ability to visualize data (beyond R visualizations) interactively within the experiment?**

By clicking on the output of a module you can visualize the data and get  statistics. 

**When previewing results or data in the browser, the number of rows and columns is limited, why?**

Since the data is being transmitted to the browser and may be large, the data size is limited to prevent slowing down the ML studio. It is better to download the data/result and use Excel or another tool to visualize the entire data.

###Algorithms
**What existing algorithms are supported in Machine Learning Studio?**

Machine Learning Studio provides state of the art algorithms, such as Scalable Boosted Decision trees, Bayesian Recommendation systems, Deep Neural Networks, and Decision Jungles developed at Microsoft Research. Scalable open-source machine learning packages like Vowpal Wabbit are also included. Machine Learning Studio supports machine learning algorithms for multiclass and binary classification, regression, and clustering. The complete list of machine learning algorithms is available in Machine Learning Studio Help.

**Do you automatically suggest the right Machine Learning algorithm to use for my data?** 

No, however there are a number of ways in Machine Learning Studio to compare the results of each algorithm to determine the right one for your problem. 

**Do you have any guidelines on picking one algorithm over another for the provided algorithms?** 
See [How to choose an algorithm ](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-how-to-choose-algorithm/). 

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

###R Module 
**What R packages are available in Machine Learning Studio?** 

Machine Learning Studio supports 400+ R packages today, and this list is constantly growing. See See [Extend your experiment with R ](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-extend-your-experiment-with-r/) to learn how to get a list of supported R packages. If the package you want is not in this list, provide the name of package at [user feedback forum](http://go.microsoft.com/fwlink/?LinkId=404231). 

**Is it possible to build a custom R module?** 

Yes, See [Create custom modules with R ](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-create-custom-modules-with-r/)

**Is there a REPL environment for R?** 

No, there is no REPL environment for R in the studio. 

###Python Module 

**Is it possible to build a custom Python module?** 

Not currently, but with the standard Python module or a set of them the same result can be achieved. 

**Is there a REPL environment for Python?** 

No, there is no REPL environment for Python in the studio. 

## Web Service
###Creation
**Is the web service created from the Machine Learning Studio throttled? How can I create additional endpoints or mark the web service as a production web service?**

**Can I deploy the model locally or in an application without an internet connection?**
No.

**How can I improve the latency of the web service?**
Remove all modules that are not explicitly required in the transformation expected of the web service. Replace all train modules with a saved trained model. Avoid R/Py and use our modules as much as possible. If your network latency is high, try to do more in the web service graph and make fewer calls. If it is very low, try to do some computations client-side and make more frequent requests

**Is there a baseline latency that is expected for all web services?** 

See the [Azure subscription limits](http://azure.microsoft.com/en-us/documentation/articles/azure-subscription-service-limits/)

###Use
**When would I want to run my predictive model as a Batch Execution service versus a Request Response service?**

The Request Response service (RRS) is a low-latency, high-scale web service that is used to provide an interface to stateless models that are created and published from the experimentation environment. The Batch Execution service (BES) is a service for asynchronously scoring a batch of data records. The input for BES is similar to data input used in RRS. The main difference is that BES reads a block of records from a variety of sources, such as the Blob service and Table service in Azure, Azure SQL Database, HDInsight (hive query), and HTTP sources. The results of scoring are output to a file in the Azure Blob service and the storage end-point is returned in the response.

The Batch Execution service is useful in a scenario where a large number of data points need to be scored in a batch, or if much of your data is already in a file format in Azure storage or a Hadoop cluster. The web service can transform data it reads before it sends it to the model. You can point your end-of-week transaction data to a Batch Execution service, which will transform and provide the results.

The Request Response service is useful in a scenario where predictive analytics are needed in near real time to power a live dashboard or guide user action or content that is served via a mobile or web application.

**How do I update the model for the deployed web service?** 

Updating a predictive model for an already deployed service is as simple as modifying and re-running the experiment used to author and save the trained model. Once you have new version of the trained model available, ML Studio will ask you if you want to update your staging web service. After the update is applied to the staging web service, the same update will become available for you to apply to the production web service as well. See Updating the Web Service for details on how to update a deployed web service. <<IS THERE A TOPIC FOR THIS>>

**How do I update the training data ("retraining" the model) for the deployed web service?** 

<<Raymond has created documentation on this that we should point towards or an article.>> 

**How do I monitor my Web service deployed in production?** 

Once a predictive model has been put into production, you can monitor it from the Azure portal. Each deployed service has its own dashboard, where you can see monitoring information for that service. 

**Is there a place where I can see the output of my RRS/BES?** 

Yes, you can provide a blob storage location and the output of the RRS/BES will be placed there. 

**How does Azure ML integrate with Azure Data Factory or Azure Streaming Analytics?** 

##Azure Marketplace 

See the [FAQ for publishing and using apps in the Machine Learning Marketplace](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-marketplace-faq/)

##Scalability 

**What is the scalability of the web service?* 

Currently, the maximum is 20 concurrent requests per end point, though it can scale to 80 end points. This translates to 4,800 concurrent request if we use every resource (300 workers).  

**Does R run in any sort of parallelized mode (multi-core)?** 

<NEED TO REVISIT IT> 

**Are R jobs spread across nodes?** 

No.  

**How does Machine Learning handle sparse representation of data?** 

We have it in the product, but silently data is densified. <NEED TO Put this in the correct way or remove it> 

**How much data can I train on?** 

10 GB from end-to-end is the limitation on the data size.  

**Are there any vector size limitations?** 

Rows and columns are each limited to the .NET limitation of  Max Int: 2,147,483,647. 

**Can the VM size that this is being run on be adjusted?** 

No.  

##Security and Availability 

**Who has access to the http end point for the web service deployed in production by default? How do I restrict access to the end point?** 


Once a predictive model has been put into production, the Azure Portal lists the URL for the deployed web services. Staging Service URLs are accessible from ML Studio Environment under the web services section, and Production service URLs are accessible from Azure Portal, under the Machine Learning section. Access keys are provided for both Staging and Production web services from the web service Dashboard in the ML Studio and Azure portal environment respectively. Access keys are needed to make calls to the web service in production and staging.  


##Support and Training 

**Where can I get training for Azure ML?** 

[Azure Machine Learning Documentation Center](http://azure.microsoft.com/en-us/documentation/services/machine-learning/) hosts video tutorials as well as how-to guides. These step-by-step guides provide an introduction to the services and walk through the data science life cycle of importing data, cleaning data, building predictive models and deploying them in production with Azure ML. 

We will be adding new material to Machine Learning Center on an ongoing basis. You can submit request for additional learning material on Machine Learning Center at [user feedback forum](https://windowsazure.uservoice.com/forums/257792-machine-learning). 

You can also find training at [Microsoft Virtual Academy](http://www.microsoftvirtualacademy.com/training-courses/getting-started-with-microsoft-azure-machine-learning)

**How do I get support for Azure Machine Learning?** 

 To get technical support for Azure Machine Learning,  go to [Azure Support](http://azure.microsoft.com/en-us/support/options/) select **Machine Learning**.

Azure Machine Learning also has a community forum on MSDN, where you can ask Azure ML related questions. The forum is monitored by the Azure ML team. Visit [Azure Forum](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=MachineLearning). 


Tips and Tricks 


What happens if my Storage Account cannot be found? 


ML Studio rely on a user supplied Azure Storage Account to save intermediary data when executing the workflow. This Storage Account is provided to ML Studio at the time a workspace is created. After the workspace is created, if the Storage Account is deleted and can no longer be found, that workspace will stop function and all experiments in that workspace will fail. 


 


If you accidentally deleted the Storage Account, the only way to recover from it is to recreate that Storage Account with the exact same name in the exact same Region as the deleted one. After that, please re-sync the Access Key. 


 


What happens if my Storage Account Access Key is out of sync? 


ML Studio rely on a user supplied Azure Storage Account to save intermediary data when executing the workflow. This Storage Account is provided to ML Studio at the time a workspace is created and the Access Keys are associated with that workspace. After the workspace is created, if the Access keys are changed, that workspace can no longer access the Storage Account, and it will stop function and all experiments in that workspace will fail. 


 


If you've changed Storage Account Access Keys, please ensure to resync the Access Keys in the workspace setting in the Azure portal.  


 


Why is my workspace authorization token unavailable in generated data access code? 


When you generate data access code from a dataset, you might see the text "Unavailable" in place of the authorization token in the generated code. This is because you are not the owner of the workspace in which this dataset lives. In order to get the authorization token to fill in, please contact the owner of the workspace and ask him/her to generate the data access code which contains the token in clear text. And please take extra precaution with this token because it provides full access to this workspace. Treat it like a secret password. 

**How do I get support for Azure Machine Learning?**

Machine Learning is supported as a part of the Azure support offerings.  To get technical support for Machine Learning, select **Machine Learning** as the service, and you will be provided with a category of topics to file your support ticket. To learn more, visit [Azure support options](http://azure.microsoft.com/en-us/support/options/).

Azure Machine Learning also has a community forum on MSDN, where you can ask Machine Learning related questions. The forum is monitored by the Azure Machine Learning team. To ask a question, visit the [Machine Learning Support](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=MachineLearning) site.
