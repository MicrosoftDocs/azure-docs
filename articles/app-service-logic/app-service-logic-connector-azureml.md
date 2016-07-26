<properties
   pageTitle="Using the Azure Machine Learning connector in Logic apps | Microsoft Azure App Service"
   description="How to create and configure the Azure Machine Learning connector and use it in a Logic app in Azure App Service"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/31/2016"
   ms.author="jehollan"/>
   
# Overview
>[AZURE.NOTE] This version of the article applies to Logic apps 2014-12-01-preview schema version.

The Azure ML connector for Logic apps enables calling Azure ML APIs for batch scoring (Batch Execution Service) and retraining. These features in combination with Logic app Triggers enable scheduling batch jobs and setting up scheduled retraining of models.

 ![][1]
 
## Get started with the Azure Machine Learning connector and add it to your Logic app
To get started, create an experiment in Azure ML Studio, then set up and deploy a web service. You can then use the API URL and Key of the BES Post URL found on the Batch Exaction Help page. ([Machine Learning walkthrough](../machine-learning/machine-learning-walkthrough-5-publish-web-service.md))

To run a BES job using the connector, add the Azure ML connector to your Logic app. Then enter the required info (see below for more on that).
To set up Retraining, add a second Azure ML connector and provide the input parameters (see [setting a model up for retraining](../machine-learning/machine-learning-retrain-models-programmatically.md).

## Running an Azure ML Batch Execution Job
The Azure ML connector provides the following four options for running Batch Execution (BES) jobs:
1.	Batch Job With Input and Output: Experiment has web service input and output modules
2.	Batch Job No Input and Output: Experiment does not have web service input or output module (e.g. uses Reader and Writer modules)
3.	Batch Job With only Input: Experiment has a web service input module, but no web service output module (e.g. uses a Writer module)
4.	Batch Job With only Output: Experiment has no web service input module, but has a web service output module (e.g. uses a Reader module)
Note that BES is an asynchronous request and could take time to complete depending on the size of your data and the complexity of the model. When the job is completed, the connector will return the output result.

### Run Batch Execution: with Input and Output
If the Studio Experiment has web service input and output modules, you need to ([provide information on the Storage blob account and location](../machine-learning/machine-learning-consume-web-services.md)). In addition, you can include Global (web service) Parameters if set up in your experiment ([Machine Learning web service parameters](../machine-learning/machine-learning-web-service-parameters.md)).

![][2]

Click on ellipsis to show and hide the Global Parameter fields. This lets you provide one or more global (web service) parameters in a comma separated list of fields and values.

![][3]

Other variations on BES jobs, such as a job with no web service input or output, are also available through the connector.

## Setting up Retraining

Use the Set Up Retraining action to set up a one-time or scheduled retraining of your ML model. 
In combination with a Batch Execution job created from the connector, you can complete the steps for training and updating a web service’s model. In this workflow, you would use the connector twice. 
1.	The first connector is used to run the BES job to retrain your model and return the output. The output of this run will have the URL of the new model (.ilearner). It can also optionally - if you have set it up in your experiment – return the URL of the output of the Evaluate module which is a csv file.
In the next step, you can use the data in the Evaluate module output to make a decision on whether or not to replace the model in your web service (e.g. if Accuracy > 0.85).
1.	The second connector is used to set up Retraining. It uses parameters from the output of the first connector to optionally check for the update model condition and update the web service with the newly trained model.
  *	As an example, you can access the output of the BES Job with the URL to the newly trained model by entering `@{body('besconnector').Results.output2.FullURL}` in the Retrained Model URL field. This assumes that the web service output in your Training Experiment is called output2.
  *	For the Resource Name, use the full name of the saved Trained Model in the Predictive Experiment e.g. MyTrainedModel [trained model]
  *	For the Evaluation Result Key field, you can enter any of the parameters returned in the output of the Evaluate Module of the Training Experiment (if you have included it). You can see the list of available parameters by visualizing the results of the Evaluate module in the Training Experiment in Azure ML Studio. For a classification experiment, these would include Accuracy, Precision, Recall, F-Score, AUC, Average Log Loss, and Training Log Loss.

![][4]
 
### Scheduled Retraining
 
Using Logic app Triggers, you can set up the connector to run on a schedule. This can enable retraining a model on a regular basis as new data arrives. The BES job would retrain the model, and the Retraining action would update the model after the retraining is completed.
 
![][5]
 
## Connector output 
 
**BES**: After the Batch job completes successfully, the connector output will have the following information for each web service output.
 
 ![][6]
 
Note that this will not be available if you have not included a web service output (e.g. you are using a Writer Module to write to a DB from the Experiment in the Studio).

**Retraining**: After Retraining completes successfully, the output will have the following info.

![][7]

## Summary

Using the Azure ML connector for Logic apps, you can run batch scoring and retraining jobs to be executed on demand or on a recurring schedule. The combination of the two actions can automatically, score your data, and retrain, evaluate, and update your web service’s model without a need to write any code.

 <!--Image references-->
[1]: ./media/app-service-logic-connector-azureml/img1.png
[2]: ./media/app-service-logic-connector-azureml/img2.png
[3]: ./media/app-service-logic-connector-azureml/img3.png
[4]: ./media/app-service-logic-connector-azureml/img4.png
[5]: ./media/app-service-logic-connector-azureml/img5.png
[6]: ./media/app-service-logic-connector-azureml/img6.png
[7]: ./media/app-service-logic-connector-azureml/img7.png
