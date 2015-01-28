<properties pageTitle="Machine Learning API service operations | Azure" description="Creating and managing Azure Machine Learning web services" services="machine-learning" documentationCenter="" authors="Garyericson" manager="paulettm" editor="cgronlun"/>

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/06/2014" ms.author="garye"/>


# Azure Machine Learning API service operations 
The typical Azure Machine Learning project involves the following high-level steps:  

1.	Get, analyze, and prepare data
2.	Create Machine Learning experiments by leveraging various Machine Learning algorithms
3.	Train, test, and generate a trained model
4.	Create an operational workflow by using the trained model and deploying the workflow into production
5.	Monitor the performance of the model and subsequent updates  

>The term “experiment” is used to describe an interactive workflow, which can include data input and manipulation, trainers, and scorers in form of a directed acyclic graph (DAG). When the workflow is published as an Azure Website, it is no longer interactive. This means that to change the model, it has to be updated then republished to update the website and its behavior.  

Steps 1-3 are typically done by a data scientist through multiple iterations. Upon completion, a Machine Learning model is handed off to the engineering and operations teams to integrate into the production systems so the Machine Learning model can be used in production.  

The traditional process of integrating and deploying the Machine Learning model into a production system can take weeks or even months, depending on the code that is used to build the models (such as R, Python, C#, or Java), the platform integration and infrastructure considerations, and deployment planning.  

Machine Learning simplifies and streamlines this process by making the model creation and evaluation an easy and intuitive experience. Machine Learning then provides a simple process to deploy the experiment as a Web Service in Azure, thus significantly reducing the total time from model experimentation to running the model in production as a Web Service.  

This document describes the concepts and steps for setting up a Machine Learning Web Service from a Machine Learning experiment.  

# Overview of Azure Machine Learning process  #
Machine Learning enables creation of Web Services from Machine Learning experiments, which are defined in the Machine Learning Studio. A Machine Learning Web Service can be used to make predictions based on actual input data in real-time or in batch mode.  
 
The following diagram shows the steps at a high level in two parts: first building a model, and second publishing it as a Web Service. This document focuses on the right side of the Figure 1 diagram – Publishing a scoring Web Service - and explains the concepts involved in that process. 

![][1]  

Figure 1: Provision, build, and publish a scoring Web Service  

# Azure ML Web Services #
A Web Service, in the context of Machine Learning (ML), is a software interface that provides communication between external applications and a Machine Learning workflow. It provides a way to communicate with a scoring model in real time to receive prediction results and incorporate the results into external client applications. Azure ML leverages Microsoft Azure for deployment, hosting and management of the Azure ML Web Services. Two types of services can be created using Azure ML.  

## Request-Response Service (RRS) ##
The Request-Response Service (RRS) is a low-latency, high scale Web Service used to provide an interface to the stateless models created and published from the Experimentation environment.   

- REST API: RRS is a RESTFul Web Service. 
-	Service Interface: The RRS Web Service interface is defined as part of experiment setup using input/output ports in the Azure ML Studio experiment.
-	Development stages: As part of the Azure ML workflow, the RRS service gets generated in the Staging environment first – and can be tested there. Once it is considered to be complete and ready for production, it is deployed to the production environment. 
-	Deployed in Azure: The result of deploying RRS is an Azure Web Service end-point.
-	Interface parameters: The request to an RRS service is the data needed to be scored using the defined experiment in the Studio. The response is the result of the model's prediction. 
-	Response Values: RRS accepts a single row of input parameters and generates a single row as output. The output row can contain multiple columns.   

## Batch Execution Service (BES) ##
The Batch Execution Service (BES) is a service for asynchronous scoring of a batch of data records. The input for BES is similar to data input used in RRS with the main difference being that BES reads a batch of records from a variety of sources such as blobs, tables in Azure, SQL Azure, HD Insight (Hive Query), and HTTP sources.  The results of scoring are output to a file in Azure blob storage and data from the storage end-point is returned in the response.  

BES also provides interfaces for getting the status of the running scoring process and canceling the request. BES is capable of running model packages against very large amounts of data.  

-	REST API: BES is a RESTFul Web Service.
-	Service Interface: Similar to RRS, the BES Web Service interface is defined as part of model setup using input/output ports in the Azure ML Studio experiment.
-	Development stages: As part of the workflow to create BES, it gets generated in the Staging environment first – and can be tested there. Once it is complete and ready for production, it is deployed to the production environment. 
-	Deployed in Azure: The result of deploying BES is an Azure Web Service end-point.
-	Interface parameters: The request to a BES service is the URL of a file in Azure blob or a SAS input of the records to be scored. The response is written to Azure blob and the URL of the response storage end point is returned.  

# Publishing an Azure ML Web Service #
Azure ML Studio provides a browser-based application to easily create and run machine learning experiments in a graphical user interface using various data sources, data manipulation and validation modules, and ML algorithms. An experiment in the ML Studio is constructed as a Directed Acyclic Graph (DAG) of data processing modules.  

Once the experiment is set up and successfully run to be trained on the data, it can be saved as a Trained Model and used for Scoring. The trained model then is used in a Scoring Experiment or a Workflow and published as an Azure Web Service.  

## Training Experiment ##
An experiment can include various modules for loading and manipulating data, applying Machine Learning algorithms, and evaluating results. A Train Model uses the training dataset and a learning algorithm to predict a response.  

Once the model has successfully completed its run, a Train Model can be saved as a reusable component for scoring test datasets and queries.

![][2]  

Figure 2: Sample showing saving a Trained Model in the experiment

The saved trained model will then be available in the Trained Models section of the application.

![][3]  

Figure 3: Trained Models section showing the list of models

## Scoring Experiment ##
A Scoring Experiment generates predictions using the trained model and sample data.  

Figure 1 above shows usage of a Score Model in the experiment. In the Studio, it is part of the Machine Learning modules.

![][4]  

Figure 4: Score Model 

### Request-Response Service vs. Batch Execution Service ###
When building scoring experiments which will be published as Web Services, either one of the two can be selected depending on the scoring scenario. If the scoring request will involve scoring a single record such as a request to determine if customer A is going to switch carriers (customer churn prediction), this can be scored in real time and would be created as an RRS Web Service. The service will return the result of the prediction model in real time – in the case of the above churn prediction example, it could be a yes or no answer.  

For scoring operations where many records need to be scored in one request, e.g. where a batch of records containing the customer data is sent to the service to be scored, then BES is the appropriate service. The request in this case will be an asynchronous request where all the records are processed and saved in an Azure blob before a response is returned after all processing is completed.  
  
### Using the Trained Model ###
To set up the Scoring experiment, the Trained Model (“Adult Income Predictor” in Figure 3) will be added to the experiment. Other modules used to train the Trained Model can now be removed. The final workflow will now look like Figure 5 below. 

### Input and Output Ports ###
After setting up the experiment with the Trained Model (see above section for details) and scoring the updated experiment, the Input and Output ports have to be set which specify the entry and exit points for the data into the prediction model and result of the prediction, and will act as the interface definitions for the published Web Service. The Input Port of the Score Model can be set as below by right-clicking on the entry point.

![][5]  

Figure 5: Setting Scoring Input Port 

Similarly, the Output port of the Score Model can be set as below.

![][6]  

Figure 6: Setting the Output Port  

## Publishing the Service ##
After setting the ports and running the experiment, the model can be published as a Web Service. The first step is publishing the service into the Staging environment and testing it there to ensure it returns the expected results before marking it ready for Production deployment.  

### Publishing into Staging ###
Clicking on the Publish Web Service icon will deploy the Web Service into the Staging environment. 

![][7]  

Figure 7: Publish Web Service button  

After publishing the model as a Web Service to the Staging environment, it can be tested using input parameters and marked for deployment into production. The Dashboard shows the link for testing. 

![][8]  

Figure 8: Web Service Dashboard

By clicking on the Test link and providing the parameters for scoring, the Web Service can be tested in the Staging environment. The test request is scored using the model and based on the data provided, and the result of scoring is returned. 

### Publishing into Production ###
Publishing a Web Service into production will make it available to other applications to use it for prediction and scoring. After the deployment to staging is complete and tested successfully, the Web Service is marked for deployment to the Production environment. 

![][9]  

Figure 9: Marking the Web Service as Ready for Production deployment

This does not actually perform the deployment, rather it creates a notification to the user with appropriate deployment permissions to deploy the service to Production.

![][10]  

Figure 10: Deployment notification and option to deploy to Production

## Calling the Web Service ##
#### RRS ####
The RRS Web Service is a REST end point and can be called from client applications using various programming languages. The API help page provides a link to the sample code for calling the new Web Service providing samples in C#, R and Python.

![][11]  

Figure 11: Sample code for calling RRS  

## Non-scoring Experiments ##
In addition to building Scoring Web Services, experiments can be created to perform other tasks such as data extraction and transformation. In this case, the Web service would not perform machine learning operations. It uses Azure ML Studio's data manipulation capabilities to read from various data sources, convert data types, or filter and apply data and math manipulations.   

### Publishing a Non-scoring Web Service ###
The steps for publishing a non-scoring Web Service are similar to that of the Scoring service described above. The main difference is that the Output Port is not defined on Score Model.

# Updating a Published Service #
A published Web Service may need to be updated for variety of reasons such as updating the training data, changes in the data schema used for training and scoring, needing to improve the algorithm, or other changes to the original ML Model These changes will impact the Trained Model and the scoring results, and will require publishing an updated Web Service.

![][12]  

Figure 12: Editing the model and publishing the updated Scoring Web Service  

## Updating the Trained Model ##
Changes to the Training experiment require re-training of the Trained Model. To do that, the published model needs to be edited. The below example shows the Scoring workflow shown in Figure 5 above after the existing Trained Model is removed.

![][13]  

Figure 13: Trained Model removed from the workflow  

The next step would be to add the needed modules to split the data into train and test segments, apply the learning algorithm, train the model, score the training data, and evaluate the results. Note that these could vary depending on the other changes needed to the experiment such as needing to apply a different learning algorithm for example. (Figure 14)  

Once the new modules are added, they need to be configured as necessary before the experiment can be re-run. As an example, the red circle in the example below indicates that the label column has not been set for Train Model.

![][14]  

Figure 14: Modules added to re-train the model.  

Clicking on the Train Model and setting the Label column name will resolve the issue. 

![][15]  

Figure 15: Selecting the income column as the label  

## Saving the Updated Trained Model ##
After all of the new modules are properly configured, the experiment should be saved and rerun successfully. The Train Model can then be saved (as shown in Figure 2 above). The difference is that in this case the checkbox has to be checked to update the existing Trained Model. 

![][16]  

Figure 16: Update the existing Trained Model

## Publishing the Updated Service ##
Once the Trained Model is updated, the steps described in the above section on Publishing an **Azure ML Web Service** will be repeated:  

-	Use the (now updated) Trained Model in the Scoring experiment
-	Set the Input/Output ports
-	Publish to Staging
-	Publish into Production  

Once the Experiment has been updated and the new Trained Model created and scored, clicking on Publish Web Service will publish the service. The newly created service will overwrite the existing one.


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
