---
title: "Tutorial: Create a form processing app with AI Builder - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Dynamically train and score Form Recognizer model in batch mode at scale.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: tutorial
ms.date: 11/23/2020
ms.author: pafarley
---

# Tutorial: Create a form-processing app with AI Builder

Business Problem 

Most organizations are now aware of how valuable the data they have in different format (pdf, images, videos…) in their closets are. They are looking for best practices and most cost-effective ways and tools to digitize those assets.  By extracting the data from those forms and combining it with existing operational systems and data warehouses, they can build powerful AI and ML models to get insights from it to deliver value to their customers and business users. 

With the Form Recognizer Cognitive Service, we help organizations to harness their data, automate processes (invoice payments, tax processing …), save money and time and get better accuracy. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a form processing AI model
> * Train your model
> * Publish your model to use in Azure Power Apps or Power Automate

## Prerequisites

* A set of at least five forms of the same type to use for training/testing data. See [Build a training data set](./build-training-data-set.md) for tips and options for putting together your training data set. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2128080).
* A Power Apps or Power Automate license - see the [Licensing Guide](https://go.microsoft.com/fwlink/?linkid=2085130). The license must include [Common Data Service](https://powerplatform.microsoft.com/common-data-service/).
* An AI Builder [add-on or trial](https://go.microsoft.com/fwlink/?LinkId=2113956&clcid=0x409).

## asdf
In this section, we'll describe how to dynamically ingest millions of forms, of different types using Azure Services. 

Your backlog of forms might be in your on-premise environment or in a (s)FTP server. We assume that you were able to upload them into an Azure Data Lake Store Gen 2, using Azure Data Factory, Storage Explorer or AzCopy. Therefore, the solution we'll describe here will focus on the data ingestion from the data lake to the (No)SQL database. 

Our product team published a great tutorial on how to Train a Form Recognizer model and extract form data by using the REST API with Python. The solution described here demonstrates the approach for one model and one type of forms. Often, our customers have different type of forms coming from their many clients and customers. The value-add of the post is show you how to automatically train a model with new and different type of forms using a meta-data driven approach. If you do not have an existing model, the program will create one for you and give you the model id. 

The REST AP requires some parameters as input. For security reasons, some of these parameters will be store in Azure Key Vault and others, less sensitive, like the blob folder name, will be in a parametrization table in an Azure SQL DB.  

For each form type, Data engineers or data scientists will populate the param table. Will use Azure data factory to iterate over the list of forms type and pass the relevant parameters to an Azure Databricks notebook to (re)train the model. 

## asdf

Azure services required to implement this solution
To implement this solution, you will need to create the below services:

 

Form Recognizer resource: 
Form Recognizer resource to setup and configure the form recognizer cognitive service, get the API key and endpoint URI.

Azure SQL single database:
We will create a meta-data table in Azure SQL Database. This table will contain the non-sensitive data required by the Form Recognizer Rest API. The idea is, whenever there is a new type of form, we just insert a new record in this table and trigger the training and scoring pipeline.
The required attributes of this table are:

 

form_description: This field is not required as part of the training of the model the inference. It just to provide a description of the type of forms we are training the model for (example client A forms, Hotel B forms,...)
training_container_name: This is the storage account container name where we store the training dataset. It can be the same as scoring_container_name
training_blob_root_folder: The folder in the storage account where we'll store the files for the training of the model.
scoring_container_name: This is the storage account container name where we store the files we want to extract the key value pairs from.  It can be the same as the training_container_name
scoring_input_blob_folder: The folder in the storage account where we'll store the files to extract key-value pair from.
model_id: The identify of model we want to retrain. For the first run, the value must be set to -1 to create a new custom model to train. The training notebook will return the newly created model id to the data factory and, using a stored procedure activity, we'll update the meta data table with in the Azure SQL database.
Whenever you had a new form type, you need to reset the model id to -1 and retrain the model.

 

file_type: The supported types are application/pdf, image/jpeg, image/png, image/tif.
form_batch_group_id : Over time, you might have multiple forms type you train against different models. The form_batch_group_id will allow you to specify all the form types that have been training using a specific model.
Azure Key Vault:
For security reasons, we don't want to store certain sensitive information in the parametrization table in the Azure SQL database. We store those parameters in Azure Key Vault secrets.

Below are the parameters we store in the key vault:

CognitiveServiceEndpoint: The endpoint of the form recognizer cognitive service. This value will be stored in Azure Key Vault for security reasons.
CognitiveServiceSubscriptionKey: The access key of the cognitive service. This value will be stored in Azure Key Vault for security reasons. The below screenshot shows how to get the key and endpoint of the cognitive service
StorageAccountName: The storage account where the training dataset and forms we want to extract the key value pairs from are stored. The two storage accounts can be different. The training dataset must be in the same container for all form types. They can be in different folders.
StorageAccountSasKey : the shared access signature of the storage account
The below screen shows the key vault after you create all the secrets



Azure Data Factory: 
To orchestrate the training and scoring of the model. Using a look up activity, we'll retrieve the parameters in the Azure SQL Database and orchestrate the training and scoring of the model using Databricks notebooks. All the sensitive parameters stored in Key vault will be retrieve in the notebooks.

Azure Data Lake Gen 2: 
To store the training dataset and the forms we want to extract the key-values pairs from. The training and the scoring datasets can be in different containers but, as mentioned above, the training dataset must be in the same container for all form types.

Azure Databricks:
To implement the python script to train and score the model. Note that we could have used Azure functions.

Azure Key Vault:
To store the sensitive parameters required by the Form Recognizer Rest API.
### Troubleshooting tips

If you're getting bad results or low confidence scores for certain fields, try the following tips:

- Retrain using forms with different values in each field.
- Retrain using a larger set of training documents. The more documents you tag, the more AI Builder will learn how to better recognize the fields.
- You can optimize PDF files by selecting only certain pages to train with. Use the **Print** > **Print to PDF** option to select certain pages within your document.

## Publish your model

asdf

## Next steps

asdf

* [Use the form-processor component in Power Apps](/ai-builder/form-processor-component-in-powerapps)
* [Use a form-processing model in Power Automate](/ai-builder/form-processing-model-in-flow)