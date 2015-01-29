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
 
###General questions

**1. What is Azure Machine Learning?**
 
Azure Machine Learning is a fully managed service that you can use to create, test, operate, and manage predictive analytic solutions in the cloud. With only a browser, you can sign-in to Machine Learning, upload data, and immediately start machine learning experiments. The service provides visual composition, a large pallet of modules, and a library of starting templates to make common machine learning tasks simple and quick. 

Turning a model into a web service is easy. With a few clicks, a predictive model build in Machine Learning Studio can be turned into a public REST API that encapsulates custom data, transformation logic, and sophisticated machine learning models.
 
**2. What is Machine Learning Studio?**

Machine Learning Studio is a workbench environment that is accessible via a web browser. Machine Learning Studio hosts a pallet of modules with a visual composition interface that enables you to build an end-to-end, data-science workflow in the form of an experiment. There are modules for data ingestion, transformation, and feature selection that you can use to build, score, and evaluate predictive models. Some of the most advanced algorithms that power machine learning in Bing and Xbox are built-in to Machine Learning Studio. Scalable open source machine learning packages, such as Vowpal Wabbit are also included. 

Machine Learning Studio supports the R language. You can bring your existing R codes and incorporate them in your experiments. Machine Learning Studio enables you to combine algorithms with your R code to build predictive models. 

Machine Learning Studio makes it easy to collaborate by enabling you to invite your team to your workspaces, where they can view and modify your experiments.

**3. What is the Machine Learning API service?**

The Machine Learning API service enables you to deploy predictive models that are built-in to Machine Learning Studio as scalable, fault-tolerant, web services. The web services created by the Machine Learning API service are REST APIs that provide an interface for communication between external applications and your predictive analytics models. 

A predictive model can be staged inside your workspace. The web services provide a way to communicate with a predictive model in real time to receive prediction results and incorporate the results into any external client application. 

The Machine Learning API service leverages Azure to deploy, host, and manage the Machine Learning REST APIs. Two types of services are created by using the Machine Learning API service: the Batch Execution service for asynchronous, batch access, and the Request Response service for low-latency, synchronous responses.

The Machine Learning API service also generates Help pages for web services. The web services Help pages provide code samples to invoke the web service in C#, R, and Python. You can test your web service by making interactive calls to the service. Then with a few clicks, the staged web service can be put into production. You can monitor the deployed services and track usage and error messages in the Azure management portal. Updating the web services is as simple as updating the model in Machine Learning Studio and pushing the changes to the staging service.

**4. How do I access Azure Machine Learning?**

To get started with Azure Machine Learning, visit [Get started with Azure Machine Learning](http://go.microsoft.com/fwlink/?LinkId=404226). 

Visit the [Machine Learning Documentation Center](http://azure.microsoft.com/en-us/documentation/services/machine-learning/) to get updates on the service, read the latest Machine Learning team blog, participate in our Machine Learning community via forums, access product Help, view the model gallery, and provide feedback about the service to help us shape the product roadmap.

###Billing questions

**5. How does Machine Learning billing work?**

The Machine Learning Studio service is billed by compute hour for active experimentation, and billing is prorated for partial hours. The Machine Learning API service is billed per 1,000 prediction API calls and by compute hour when a prediction is actively executed. Billing is prorated for prediction quantities less than 1,000 and for partial compute hours.
 
Charges are aggregated per workspace for your subscription. Within each workspace, you will see charges for the following three items:

+	Studio Experiment Hours: This meter aggregates all compute charges accrued by running experiments in Machine Learning Studio and running predictions in the staging environment. 
+	API Service Prediction Hours: This meter includes compute charges accrued by web services running in production. 
+	API Service Predictions (in 1000s): This meter includes charges accrued per call to your production web service.

For pricing details, see [Machine Learning Pricing](http://azure.microsoft.com/en-us/pricing/details/machine-learning/).

**6. Does Machine Learning have a free trial?**

Machine Learning is a part of the Azure free trial. When you sign up for an Azure free trial, you can try any Azure services for a month. To learn more about Azure free trial, visit [Azure Free Trial FAQ](http://azure.microsoft.com/en-us/pricing/free-trial-faq/).

### Machine Learning Studio questions

**7. What data sources does Machine Learning support?**

Data can be loaded into Machine Learning Studio in one of two ways: by uploading local files as a dataset or by using a reader module to import data. Local files can be uploaded by adding new datasets in Machine Learning Studio. See the Help topic **Getting Data** in Machine Learning Studio to learn more about supported file formats. 

The **Reader** module can read data from the Azure Table service, Azure Blob service, Azure SQL Database, or HDInsight. You can also pull data from an HTTP data source. See the Help topic for the **Reader** module in Machine Learning Studio for details.

**8. How large can my data set be?**

Machine Learning Studio supports training datasets of up to 10 GB. There is no limit on the dataset size for web services.  Sampling larger datasets via Hive or Azure SQL Database queries before ingestion is also supported. If you are working with data larger than 10 GB, you can create multiple datasets and use the **Partition and Sample**, **Split**, or **Join** modules to combine these datasets in Machine Learning Studio to create training sets for building predictive models. Visit the module Help in Machine Learning Studio to learn more about these modules.

For datasets larger than a couple GB, the recommended approach is to upload data to Azure storage or Azure SQL Database or use HDInsight, rather than directly uploading from local file.

**9. What existing algorithms are supported in Machine Learning Studio?**

Machine Learning Studio provides state of the art algorithms, such as Scalable Boosted Decision trees, Bayesian Recommendation systems, Deep Neural Networks, and Decision Jungles developed at Microsoft Research. Scalable open-source machine learning packages like Vowpal Wabbit are also included. Machine Learning Studio supports machine learning algorithms for multiclass and binary classification, regression, and clustering. The complete list of machine learning algorithms is available in Machine Learning Studio Help.

**10. If the machine learning algorithm, data source, data format, or data transformation operation I am looking for isn't in Machine Learning Studio, what are my options?**

You can visit the [Machine Learning Feedback](http://go.microsoft.com/fwlink/?LinkId=404231) site to see features requests that we are tracking. Add your vote if a capability you are looking for has already been requested. If the capability you are looking for does not exist, create a new request. You can view the status of your request in this forum too. We track this list closely and update the status of feature availability frequently.

**11. Can I bring my existing code into Machine Learning Studio?**

Machine Learning Studio supports R, and you can bring in your existing R codes in Machine Learning Studio. You can run your R code in the same experiment with APIs that are provided by Machine Learning and publish this as a web service via Azure Machine Learning. Machine Learning is the fastest way to turn analytic assets in R into enterprise-grade production web services. See the Machine Learning Studio Help topic, **Extensibility with R**, to learn how to bring your R codes and visualization into Machine Learning Studio.
 
**12. What R packages are available in Machine Learning Studio?**

Machine Learning Studio currently supports over 350 R packages, and this list is constantly growing. See the Machine Learning Studio Help topic, **Extensibility with R**, to learn how to get a list of supported R packages. If the package you want is not in this list, provide the name of package on the [Machine Learning Feedback](http://go.microsoft.com/fwlink/?LinkId=404231) site.

### Machine Learning API service questions

**13. When would I want to run my predictive model as a Batch Execution service versus a Request Response service?**

The Request Response service (RRS) is a low-latency, high-scale web service that is used to provide an interface to stateless models that are created and published from the experimentation environment. The Batch Execution service (BES) is a service for asynchronously scoring a batch of data records. The input for BES is similar to data input used in RRS. The main difference is that BES reads a block of records from a variety of sources, such as the Blob service and Table service in Azure, Azure SQL Database, HDInsight (hive query), and HTTP sources. The results of scoring are output to a file in the Azure Blob service and the storage end-point is returned in the response.

The Batch Execution service is useful in a scenario where a large number of data points need to be scored in a batch, or if much of your data is already in a file format in Azure storage or a Hadoop cluster. The web service can transform data it reads before it sends it to the model. You can point your end-of-week transaction data to a Batch Execution service, which will transform and provide the results.

The Request Response service is useful in a scenario where predictive analytics are needed in near real time to power a live dashboard or guide user action or content that is served via a mobile or web application.

**14. How do I update the model for a deployed service that is in production?**

Updating a predictive model for an already deployed service is as simple as modifying and saving the trained model. After you have a new version of the trained model available, Machine Learning Studio will ask you if you want to update your staging web service. After the update is applied to the staging web service, it is available for you apply to the production web service. See the Machine Learning Studio Help topic **Updating the Web Service** for details about how to update a deployed web service.
 
###Security and availability questions

**15. By default, who has access to the HTTP end point for a deployed web service? How do I restrict access to the end point?**

When a predictive model is put into production, the Azure management portal lists the URL for the deployed web services. Staging service URLs are accessible from Machine Learning Studio under the **Web services** section. Production service URLs are accessible from the management portal under the **Machine Learning** section. Access keys are provided for the staging and production web services from the web service dashboard in the Machine Learning Studio and management portal respectively. Access keys are needed to make calls to the web services in production and staging. 

**16. How do I monitor my deployed web service?**

After a predictive model is put into production, you can monitor it from the Azure management portal. Each deployed service has its own dashboard, where you can see monitoring information for that service.

### Support and training questions

**17. Where can I get training for Azure Machine Learning?**

The [Machine Learning Documentation Center](http://azure.microsoft.com/en-us/documentation/services/machine-learning/) hosts video tutorials in addition to how-to guides. These step-by-step how-to guides provide an introduction to the services, and they walk through the data-science life cycle of importing data, cleaning data, building predictive models, and deploying them into production with Machine Learning.

The video tutorials provide a visual tour of the Machine Learning Studio and the Machine Learning API service. The video tutorials demonstrate services that are most commonly used to ingress data, clean and process modules, build a predictive model, and deploy the predictive models. The video tutorials also cover tasks such as provisioning workspaces and deploying the staged models into production.

We are adding new material to the Machine Learning Documentation Center on an ongoing basis. You can submit requests for additional learning material on the [Machine Learning Feedback](https://windowsazure.uservoice.com/forums/257792-machine-learning) site.

**18. How do I get support for Azure Machine Learning?**

Machine Learning is supported as a part of the Azure support offerings.  To get technical support for Machine Learning, select **Machine Learning** as the service, and you will be provided with a category of topics to file your support ticket. To learn more, visit [Azure support options](http://azure.microsoft.com/en-us/support/options/).

Azure Machine Learning also has a community forum on MSDN, where you can ask Machine Learning related questions. The forum is monitored by the Azure Machine Learning team. To ask a question, visit the [Machine Learning Support](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=MachineLearning) site.
