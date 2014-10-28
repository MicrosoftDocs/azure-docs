<properties title="Microsoft Azure Machine Learning Frequently Asked Questions (FAQ)" pageTitle="Azure Machine Learning FAQ | Azure" description="Frequently asked questions about Microsoft Azure Machine Learning" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="pamehta" manager="paulettm" editor="cgronlun" videoId="" scriptId="" />

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/06/2014" ms.author="pamehta" />

#Microsoft Azure Machine Learning Frequently Asked Questions (FAQ)
 
###GENERAL

**1. What is Microsoft Azure Machine Learning?**
 
Microsoft Azure Machine Learning is fully managed service to create, test, operationalize and manage predictive analytics solutions in the cloud. With just a browser, you can now sign up to Azure Machine Learning, upload data and immediately start machine learning experiments. Visual composition, large pallet of modules and a library of starting templates makes common machine learning tasks simple and quick. Turning a model into web service is easy - with a few clicks, a Predictive model build in ML Studio can be turned into a public REST API that encapsulates custom data transformation logic and sophisticated machine learning models.
 
**2. What is Azure Machine Learning Studio?**

Azure ML Studio is a workbench environment accessible via a web browser. ML Studio hosts a pallet of modules with a visual composition interface that enables you to build an end-to-end data science workflow in the form of an experiment. There are modules for data ingestion, transformation, feature selection to build, score and evaluate a predictive models. Some of the most advanced algorithms that power machine learning in Bing and Xbox are built into ML Studio.  Scalable open source machine learning packages like Vowpal Wabbit are also included. ML Studio supports R. You can bring your existing R codes and incorporate it in your experiments. ML Studio enables you to combine these algorithms with your R code to build predictive models. ML Studio makes it easy to collaborate by enabling you to invite your team to your workspaces, where they can view and modify your experiments.

**3. What is Azure ML API service?**

ML API service enables you to deploy a predictive models built in ML Studio as scalable, fault tolerant Web service. The web services created by the ML API service are REST APIs that provide an interface for communication between external applications and your predictive analytics model. The web service provides a way to communicate with a predictive model in real time to receive prediction results and incorporate the results into any external client application. ML API service leverages Microsoft Azure for deployment, hosting and management of the Azure ML REST APIs. Two types of services are created using the Azure ML API service. Batch Execution service for asynchronous, batch access and Request Response service for low-latency synchronous response.

A predictive model can be put into staging inside your workspace.  ML API service also generates help pages for web services. The web service help pages provide code samples to invoke the web service in C#, R and Python. You can test your web service by making interactive calls to the service. The staged web service can then be put into production in just a few clicks. Once in production, you can monitor a deployed services as well as track usage and errors in the Azure portal.  Updating the web services is as simple as updating the model in the ML Studio and pushing the changes to the staging service.

**4. How do I access Microsoft Azure Machine Learning?**

To get started with Azure Machine Learning visit the [get started page](http://go.microsoft.com/fwlink/?LinkId=404226). Visit [Azure Machine Learning Center](http://azure.microsoft.com/en-us/documentation/services/machine-learning/) to get updates on the service, read the latest on the ML team blog, participate in our Machine Learning community via forums, access product help, view the model gallery and provide feedback on the service to help us shape the product roadmap.

###BILLING

**5. How does Machine Learning billing work?**

The Azure ML Studio service is billed by compute hour for active experimentation and billing is prorated for partial hours. The Azure ML API service is billed per 1,000 prediction API calls and by compute hour when a prediction is being actively executed. Billing is prorated for prediction quantities less than 1,000 and partial compute hours.
 
Charges are aggregated per workspace for your subscription. Within each workspace you will see charges for the three items

+	Studio Experiment Hours - this meter aggregates all compute charges accrued by running experiments in ML Studio and running predictions in the staging environment. 
+	API Service Prediction Hours - this meter includes compute charges accrued by Web services running in production. 
+	API Service Predictions (in 1000s) - this meter includes charges accrued per call to your production web service.

Visit the Pricing page for pricing details, <http://azure.microsoft.com/en-us/pricing/details/machine-learning/>.

**6. Does Azure Machine Learning have a Free Trial?**

Azure ML is a part of the Azure free trial.  When you sign up for azure free trial, you can try any Azure services for a month. To learn more about Azure free trial visit <http://azure.microsoft.com/en-us/pricing/free-trial-faq/>.

### MACHINE LEARNING STUDIO

**7. What data sources does Azure ML support?**

Data can be loaded into ML Studio in one of two ways, by uploading local files as dataset or by using reader module to import data. Local files can be uploaded as datasets, by adding new datasets in ML Studio. See the help topic **Getting Data** in ML Studio to learn more about supported file formats. 

The **Reader** module can read data from Azure Table, Azure Blob, SQL Database (Azure) or HDInsight.  You can also pull data from a data source via http. See the help topic for the **Reader** module in ML Studio for details.

**8. How large can my data set be?**

ML Studio supports training datasets of up to 10GB.  There is no limit on the dataset size for Web Services.  Sampling larger datasets via Hive or SQL queries before ingestion is also supported. If you are working with data larger than 10GB, you can create multiple datasets and use the 'Partition and Sample', 'Split' or 'Join' modules to recombine these datasets in ML Studio to create training sets for building predictive models. Visit module help in ML Studio to learn more about these modules.

For datasets larger than a couple GB, the recommended approach is to upload data to Azure storage or SQL Database (Azure) or use HDInsight, rather than directly uploading from local file.

**9. What existing ML algorithms are supported in ML Studio?**

ML Studio provides state of the art ML algorithms such as Scalable Boosted Decision trees, Bayesian Recommendation systems, Deep Neural Networks and Decision Jungles developed at Microsoft Research. Scalable open source machine learning packages like Vowpal Wabbit are also included. ML Studio supports machine learning algorithms for multi-class and binary Classification, Regression and Clustering. The complete list of machine learning algorithms is available in ML Studio help.

**10. The Machine learning algorithm, data source, data format, data transformation operation I am looking for isn't in Azure ML Studio, what are my options?**

You can visit the [user feedback forum](http://go.microsoft.com/fwlink/?LinkId=404231) to see features requests that we are tracking. Add your vote to this request if a capability you are looking for has already been requested. If the capability you are looking for does not exist, create a new request. You can view the status of your request in this forum too. We track this list closely and update the status of feature availability frequently.

**11. Can I bring my existing code into ML Studio?**

ML Studio supports R today, you can bring in your existing R codes in ML Studio and run it in the same experiment with Azure ML provided learners and publish this as a web service via Azure ML. Azure ML is the fastest way to turn analytic assets in R into enterprise grade production web services. See the ML Studio help topic **Extensibility with R** to learn how to bring your R codes and visualization into ML Studio.
 
**12. What R packages are available in ML Studio?**

ML Studio supports 350+ R packages today, and this list is constantly growing. See the ML Studio help topic **Extensibility with R** to learn how to get a list of supported R packages. If the package you want is not in this list, provide the name of package at [user feedback forum](http://go.microsoft.com/fwlink/?LinkId=404231).

### ML API SERVICE

**13. When would I want to run my predictive model as a Batch Execution Service vs request/response web service?**

The Request-Response Service (RRS) is a low-latency, high scale Web Service used to provide an interface to stateless models created and published from the Experimentation environment. The Batch Execution Service (BES) is a service for asynchronous scoring a batch of data records. The input for BES is similar to data input used in RRS .The main difference is that BES reads a block of records from a variety of sources such as blobs, tables in Azure, SQL Database(Azure), HDInsight (Hive Query), and HTTP sources. The results of scoring are output to a file in Azure blob storage and the storage end-point is returned in the response.

Batch Execution Service is useful in a scenario where a large number of data points need to be scored, in a batch fashion, or much of your data is already in file format in an Azure storage or a Hadoop cluster. The web service can transform data it reads before it sends it to the model, so you can just point your end of week transaction data to a Batch service which will transform and provide the results.

Request Response Service is useful in a scenario where predictive analytics are needed in near-real time to power a live dashboard or guide user action or content served via a mobile or web application.

**14. How do I update the model for the deployed service production?**

Updating a predictive model for an already deployed service is as simple as modifying and re-running the experiment used to author and save the trained model. Once you have new version of the trained model available, ML Studio will ask you if you want to update your staging web service. After the update is applied to the staging web service, the same update will become available for you apply to the production web service as well. See the ML Studio help topic **Updating the Web Service** for details on how to update a deployed web service.
 
###SECURITY AND AVAILABILITY

**15. Who has access to the http end point for the web service deployed in production by default? How do I restrict access to the end point?**

Once a predictive model has been put into production, the Azure Portal lists the URL for the deployed web services. Staging Service URLs are accessible from ML Studio Environment under the web services section, and Production service URLs are accessible from Azure Portal, under the Machine Learning section. Access keys are provided for both Staging and Production web services from the web service Dashboard in the ML Studio and Azure portal environment respectively. Access keys are needed to make calls to the web service in production and staging. 


**16. How do I monitor my Web service deployed in production?**

Once a predictive model has been put into production, you can monitor from the Azure portal. Each deployed service has its own dashboard, where you will can see monitoring information for that service.

### SUPPORT AND TRAINING

**17. Where can I get training for Azure ML?**

[Azure Machine Learning Center](http://azure.microsoft.com/en-us/documentation/services/machine-learning/) hosts video tutorials as well as how-to guides.  Theses step-by-step how-to guides provide an introduction to the services and walk through the data science life cycle of importing data, cleaning data, building predictive models and deploying them in production with Azure ML.

The video tutorials provide a visual tour of ML Studio and ML API service. The videos tutorials demonstrate the breadth of the service, most commonly used data ingress, cleaning and processing modules; building a predictive model and deploying the predictive models. The video tutorials will also cover tasks like workspace provisioning and deploying the staged models to production.

We will be adding new material to Machine Learning Center on an ongoing basis. You can submit request for additional learning material on Machine Learning Center at [user feedback forum](https://windowsazure.uservoice.com/forums/257792-machine-learning).

**18. How do I get support for Azure ML?**

Azure ML is supported as a part of the Azure support offering.  To get technical support on Azure ML, select 'Machine Learning' as service and you will be provided a category of topics to file your support ticket. To learn more about Azure Support offering visit <http://azure.microsoft.com/en-us/support/options/>

Azure Machine Learning also has a community forum on MSDN, where you can ask Azure ML related questions. The forum is monitored by the Azure ML team. Visit [Azure Forum](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=MachineLearning).
