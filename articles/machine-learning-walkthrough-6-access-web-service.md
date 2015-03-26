<properties 
	pageTitle="Step 6: Access the Machine Learning web service | Azure" 
	description="Solution walkthrough step 6: Access an active Azure Machine Learning web service" 
	services="machine-learning" 
	documentationCenter="" 
	authors="garyericson" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/18/2015" 
	ms.author="garye"/>


This is the last step of the walkthrough, [Developing a Predictive Solution with Azure ML][develop]:

[develop]: machine-learning-walkthrough-develop-predictive-solution.md


1.	[Create an ML workspace][create-workspace]
2.	[Upload existing data][upload-data]
3.	[Create a new experiment][create-new]
4.	[Train and evaluate the models][train-models]
5.	[Publish the web service][publish]
6.	**Access the web service**

[create-workspace]: machine-learning-walkthrough-1-create-ml-workspace.md
[upload-data]: machine-learning-walkthrough-2-upload-data.md
[create-new]: machine-learning-walkthrough-3-create-new-experiment.md
[train-models]: machine-learning-walkthrough-4-train-and-evaluate-models.md
[publish]: machine-learning-walkthrough-5-publish-web-service.md
[access-ws]: machine-learning-walkthrough-6-access-web-service.md

----------

# Step 6: Access the Azure Machine Learning web service

For a web service to be useful, users need to be able to send data to it and receive results. The web service is an Azure web service that can receive and return data in one of two ways:  

-	**Request/Response** - The user sends a single set of credit data to the service by using an HTTP protocol, and the service responds with a single set of results.
-	**Batch Execution** - The user sends to the service the URL of an Azure blob that contains one or more rows of credit data. The service stores the results in another blob and returns the URL of that container.  

On the **DASHBOARD** tab for the web service, there are two links to information that will help a developer write code to access this service. Click the **API help page** link on the **REQUEST/RESPONSE** row, and a page opens that contains sample code to use the service's request/response protocol. Similarly, the link on the **BATCH EXECUTION** row provides example code for making a batch request to the service.  

The API help page includes samples for R, C#, and Python programming languages. 

<!-- Add link to Derrick's articles on web services -->