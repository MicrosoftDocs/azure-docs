<properties 
	pageTitle="Machine Learning API service operations | Azure" 
	description="Creating and managing Azure Machine Learning web services" 
	services="machine-learning" 
	documentationCenter="" 
	authors="Garyericson" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/06/2014" 
	ms.author="garye"/>


# Azure Machine Learning API service operations 
The typical Azure Machine Learning project involves the following high-level steps:  

1.	Get, analyze, and prepare data
2.	Create Machine Learning experiments by leveraging various Machine Learning algorithms
3.	Train, test, and generate a trained model
4.	Create an operational workflow by using the trained model and deploying the workflow into production
5.	Monitor the performance of the model and subsequent updates  

>The term “experiment” is used to describe an interactive workflow, which can include data input and manipulation, trainers, and scorers in the form of a directed acyclic graph (DAG). When the workflow is published as an Azure web service, it is no longer interactive. This means that to change the model, it has to be updated then republished to update the web service and its behavior.  

Steps 1-3 are typically done by a data scientist through multiple iterations. Upon completion, a Machine Learning model is handed off to the engineering and operations teams to integrate into the production systems so the Machine Learning model can be used in production.  

The traditional process of integrating and deploying the Machine Learning model into a production system can take weeks or even months, depending on the code that is used to build the models (such as R, Python, C#, or Java), the platform integration and infrastructure considerations, and deployment planning.  

Machine Learning simplifies and streamlines this process by making the model creation and evaluation an easy and intuitive experience. Machine Learning then provides a simple process to deploy the experiment as a web service in Azure, thus significantly reducing the total time from model experimentation to running the model in production as a web service.  

This document describes the concepts and steps for setting up a Machine Learning web service from a Machine Learning experiment.  

# Overview of Azure Machine Learning process  #
Machine Learning enables creating web services from Machine Learning experiments, which are defined in the Machine Learning Studio. A Machine Learning web service can be used to make predictions based on actual input data in real-time or in batch mode.  
 
The following diagram shows the steps at a high level in two parts: first, building a model, and second, publishing it as a web service. This document focuses on the right side of the Figure 1 diagram (Publishing a scoring web service), and it explains the concepts involved in that process. 

![][1]  

Figure 1: Provision, build, and publish a scoring web service  

# Azure Machine Learning web services #
A web service, in the context of Machine Learning, is a software interface that provides communication between external applications and a Machine Learning workflow. It provides a way to communicate with a scoring model in real time to receive prediction results and incorporate the results into external client applications. Azure Machine Learning leverages Microsoft Azure to deploy, host, and manage the Azure Machine Learning web services. Two types of services can be created by using Azure Machine Learning.  

## Request-Response service (RRS) ##
The Request-Response service (RRS) is a low-latency, high-scale web service that is used to provide an interface to the stateless models created and published from the experimentation environment.   

- REST APIs: RRS is a web service that you can access by using REST APIs. 
-	Service interface: The RRS web service interface is defined as part of a setup that uses input/output ports in the Azure Machine Learning Studio experiment.
-	Development stages: As part of the Azure Machine Learning workflow, the RRS gets generated in the Staging environment first, and it can be tested there. When it is considered to be complete and ready for production, it is deployed to the production environment. 
-	Deployed in Azure: The result of deploying RRS is an Azure web service end-point.
-	Interface parameters: A request to the RRS is the data that is needed to be scored by using the defined experiment in the Studio. The response is the result of the model's prediction. 
-	Response values: RRS accepts a single row of input parameters and it generates a single row as output. The output row can contain multiple columns.   

## Batch Execution service (BES) ##
The Batch Execution service (BES) is a service for asynchronous scoring of a batch of data records. The input for BES is similar to data input used in RRS. The main difference is that BES reads a batch of records from a variety of sources such as blobs, tables in Azure, SQL Database, HD Insight (hive query), and HTTP sources. The results of scoring are output to a file in a blob in Azure  Storage, and data from the storage end-point is returned in the response.  

BES also provides interfaces for getting the status of the running scoring process and canceling the request. BES is capable of running model packages against very large amounts of data.  

-	REST APIs: BES is a web service that you can access by using REST APIs.
-	Service interface: Similar to RRS, the BES interface is defined as part of a model setup that uses input/output ports in the Azure Machine Learning Studio experiment.
-	Development stages: As part of the workflow, BES gets generated in the Staging environment first, and it can be tested there. When it is complete and ready for production, it is deployed to the production environment. 
-	Deployed in Azure: The result of deploying BES is an Azure web service end-point.
-	Interface parameters: The request to a BES is the URL of a file in a blob in Azure Storage or an SAS input of the records to be scored. The response is written to the blob and the URL of the response storage end point is returned.  

# Publishing Machine Learning web service #
Machine Learning Studio provides a browser-based application to easily create and run machine learning experiments in a graphical user interface by using various data sources, data manipulation, validation modules, and Machine Learning algorithms. An experiment in the Machine Learning Studio is constructed as a directed acyclic graph (DAG) of data-processing modules.  

After the experiment is set up and successfully run to be trained on the data, it can be saved as a trained model and used for scoring. The trained model is used in a scoring experiment or a workflow and published as an Azure web service.  

## Training experiment ##
An experiment can include various modules for loading and manipulating data, applying Machine Learning algorithms, and evaluating results. A trained model uses the training dataset and a learning algorithm to predict a response.  

When the model has successfully completed its run, it can be saved as a reusable component for scoring test datasets and queries.

![][2]  

Figure 2: Saving a trained model in the experiment

The saved trained model is available in the Trained Models section of the application.

![][3]  

Figure 3: List of Trained Models 

## Scoring experiment ##
A scoring experiment generates predictions by using the trained model and sample data.  

Figure 1 shows usage of a score model in the experiment. In the Studio, it is part of the Machine Learning modules.

![][4]  

Figure 4: Score Model location

### Request-Response service vs. Batch Execution service ###
When building scoring experiments that will be published as web services, either service can be selected depending on the scoring scenario. If the scoring request will involve scoring a single record (such as a request to determine if customer A is going to switch carriers - a customer churn prediction), this can be scored in real time, and it would be created as an RRS web service. The service will return the result of the prediction model in real time. In the case of the previous churn prediction example, it could be a yes or no answer.  

For scoring operations where many records need to be scored in one request (for example, where a batch of records that contain the customer data is sent to the service to be scored), then BES is the appropriate service. The request in this case will be an asynchronous request. All the records are processed and saved in a blob in Azure Storage before a response is returned after all processing is completed.  
  
### Using the trained model ###
To set up the scoring experiment, the trained model, **Adult Income Predictor** (shown in Figure 3), will be added to the experiment. Other modules used to train the trained model can now be removed. The final workflow will now look like Figure 5. 

### Input and output ports ###
After setting up the experiment with the trained model (see the **Training experiment** section earlier in this article for details) and scoring the updated experiment, the input and output ports have to be set. These ports specify the entry and exit points for the data in the prediction model and the result of the prediction. They also act as the interface definitions for the published web service. As shown in Figure 5, the input port of the score model can be set by right-clicking on the entry point.

![][5]  

Figure 5: Setting scoring input port 

The output port of the score model can be set similarly:

![][6]  

Figure 6: Setting the output port  

## Publishing the service ##
After setting the ports and running the experiment, the model can be published as a web service. The first step is publishing the service into the staging environment. It is tested there to ensure it returns the expected results before marking it ready for production deployment.  

### Publishing into staging ###
As shown in Figure 7, clicking the **Publish Web Service** icon will deploy the web service into the staging environment. 

![][7]  

Figure 7: Publish Web Service icon  

After publishing the model as a web service to the staging environment, it can be tested by using input parameters and marked for deployment into production. Figure 8 shows the Dashboard with the link for testing. 

![][8]  

Figure 8: Web service Dashboard

By clicking the **Test** link and providing the parameters for scoring, the web service can be tested in the staging environment. The test request is scored by using the model, and based on the data provided, the result of the scoring is returned. 

### Publishing into production ###
Publishing a web service into production makes it available to other applications to use it for prediction and scoring. After the deployment to staging is complete and tested successfully, the web service is marked for deployment to the production environment. 

![][9]  

Figure 9: Marking the web service as **Ready for Production**

This action does not actually perform the deployment. As shown in Figure 10, it creates a notification to the user with appropriate deployment permissions to deploy the service to production.

![][10]  

Figure 10: Deployment notification

## Calling the web service ##
#### RRS ####
RRS is a REST end point, and it can be called from client applications by using various programming languages. The API Help page provides a link to the sample code for calling the new web service. It provides code samples in C#, R, and Python.

![][11]  

Figure 11: Sample code for calling RRS  

## Non-scoring experiments ##
In addition to building scoring web services, experiments can be created to perform other tasks, such as data extraction and transformation. In this case, the web service would not perform machine learning operations. It uses data manipulation capabilities in Machine Learning Studio to read from various data sources, convert data types, or filter and apply data and math manipulations.   

### Publishing a non-scoring web service ###
The steps for publishing a non-scoring web service are similar to that of the scoring service described earlier in this article. The main difference is that the output port is not defined for the score model.

# Updating a published service #
A published web service may need to be updated for a variety of reasons, such as updating the training data, changes in the data schema used for training and scoring, needing to improve the algorithm, or other changes to the original Machine Learning model. These changes will impact the trained model and the scoring results, and they require publishing an updated web service.

![][12]  

Figure 12: Editing the model and publishing the updated scoring web service  

## Updating the trained model ##
Changes to the training experiment require retraining the Trained model. To do this, the published model needs to be edited. The following example shows the scoring workflow shown in Figure 5 after the existing trained model is removed.

![][13]  

Figure 13: Trained model removed from the workflow  

The next step is to add the needed modules to split the data into train and test segments, apply the learning algorithm, train the model, score the training data, and evaluate the results. Note that these steps could vary depending on the other changes that are needed in the experiment, such as applying a different learning algorithm. (Figure 14)  

When the new modules are added, they need to be configured as necessary before the experiment can be re-run. As an example, the red circle in the following graphic indicates that the label column has not been set for **Trained Model**.

![][14]  

Figure 14: Modules added to retrain the model  

Clicking the Trained Model and setting the **Label** column name will resolve the issue. 

![][15]  

Figure 15: Selecting the **income** column as the label  

## Saving the updated trained model ##
After all of the new modules are properly configured, the experiment should be saved and rerun successfully. The trained model can then be saved (as shown in Figure 2). The difference is that in this case, the check box has to be selected to update the existing trained model. 

![][16]  

Figure 16: Update the existing trained model

## Publishing the updated service ##
After the trained model is updated, the steps described in the **Publishing Machine Learning web service** section will be repeated:  

-	Use the (now updated) trained model in the scoring experiment
-	Set the input and output ports
-	Publish to staging
-	Publish into production  

When the experiment has been updated and the new trained model is created and scored, clicking **Publish Web Service** will publish the service. The newly created service will overwrite the existing one.


<!--Image references-->
[1]: ./media/machine-learning-overview-of-azure-ml-process/oamlp1.png
[2]: ./media/machine-learning-overview-of-azure-ml-process/oamlp2.png
[3]: ./media/machine-learning-overview-of-azure-ml-process/oamlp3.png
[4]: ./media/machine-learning-overview-of-azure-ml-process/oamlp4.png
[5]: ./media/machine-learning-overview-of-azure-ml-process/oamlp5.png
[6]: ./media/machine-learning-overview-of-azure-ml-process/oamlp6.png
[7]: ./media/machine-learning-overview-of-azure-ml-process/oamlp7.png
[8]: ./media/machine-learning-overview-of-azure-ml-process/oamlp8.png
[9]: ./media/machine-learning-overview-of-azure-ml-process/oamlp9.png
[10]: ./media/machine-learning-overview-of-azure-ml-process/oamlp10.png
[11]: ./media/machine-learning-overview-of-azure-ml-process/oamlp11.png
[12]: ./media/machine-learning-overview-of-azure-ml-process/oamlp12.png
[13]: ./media/machine-learning-overview-of-azure-ml-process/oamlp13.png
[14]: ./media/machine-learning-overview-of-azure-ml-process/oamlp14.png
[15]: ./media/machine-learning-overview-of-azure-ml-process/oamlp15.png
[16]: ./media/machine-learning-overview-of-azure-ml-process/oamlp16.png

<!--Link references-->
