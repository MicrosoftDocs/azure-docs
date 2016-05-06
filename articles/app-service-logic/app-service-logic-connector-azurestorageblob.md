<properties 
   pageTitle="Using the Azure Storage Blob Connector in Logic Apps | Microsoft Azure App Service" 
   description="How to create and configure the Azure Storage Blob Connector or API app and use it in a logic app in Azure App Service" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="anuragdalmia" 
   manager="erikre" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/16/2016"
   ms.author="rajram"/>
   
# Get started with the Azure Storage Blob Connector and add it to your Logic App 

>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version. For the 2015-08-01-preview schema version, click [Azure Storage Blob API](../connectors/connectors-create-api-azureblobstorage.md).

Connect to your Azure Storage Blob to upload, download, and delete blobs from the blob container. Connectors are used in Logic Apps as a part of a "workflow". 

## Triggers and Actions
*Triggers* are events that happen. For example, when an order is updated or when a new customer is added. An *Action* is the result of the trigger. For example, when an order is updated, send an alert to the salesperson. Or, when a new customer is added, send a welcome email to the new customer. 

The Storage Blob Connector can be used as an action in a logic app and supports data in JSON and XML formats. Currently, there are no triggers for the Storage Blob Connector. 

The Storage Blob Connector has the following Triggers and Actions available: 

Triggers | Actions
--- | ---
None | <ul><li>Get Blob: Get a specific Blob from the container</li><li>Upload Blob: Upload a new Blob or update an existing Blob</li><li>Delete Blob: Delete a specific Blob from a Container</li><li>List Blobs: List all blobs in a directory</li><li>Snapshot Blob: Create a read-only snapshot of a Specific Blob</li><li>Copy Blob: Create a new Blob by copying from another Blob.  The source Blob may be in the same account or in another account.</li></ul>


## Create the Azure Storage Blob Connector

A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Search for “Blob”:  
	![Select Azure Storage Blob Connector][2]

3. Select it, and select **Create**.
4. Enter the Name, App Service Plan, and other properties.
5. Enter the following package settings:

	Name | Required |  Description
--- | --- | ---
Container/SAS URI | Yes | Enter the URI of the Blob Container. The URI may also include the SAS token. For example, enter http://*storageaccountname*.blob.core.windows.net/containername or http://*storageaccountname*.blob.core.windows.net/containername?sr=c&si=mypolicy&sig=signatureblah
Access Key | No | Enter a valid primary or secondary storage account access key. If you are using the SAS token for authentication, leave this field empty.

	![Create Azure Storage Blob Connector][3]

6. Click **Create**.

## Use Azure Storage Blob Connector in Logic App
Once the Azure Storage Blob connector has been created, it can now be added to your workflow.

1. Create a new Logic App: New -> Web+Mobile -> LogicApp. Enter the properties for your Logic App:  
	![Create Logic App][4]

2. Click **Triggers and actions**. The workfow designer opens:  
	![Logic App empty flow designer][5]

3. Select your Azure Storage Blob Connector from the right pane. The connector lists the actions available:  
	![List of Azure Storage Blob Actions][10]

4. In this scenario, let's use the **Upload Blob** action:  
	![Inputs of Upload Blob action][11]

5. Enter the input values and select the check mark to complete the configuration:

	Input | Description
--- | ---
Blob Path | Determines the path of the Blob to be uploaded. The path is interpreted relative to the configured Container path.
Blob Write Content | Enter the Content and the properties of the Blob to be uploaded.
Content Transfer Encoding | Enter none or Base64.
Overwrite | When set to true, the existing Blob is overwritten. When set to false, it returns an error if a Blob already exists at the same path.

Note that the configured Azure Storage Blob Upload Blob action shows both input parameters as well as output parameters.

#### Using the outputs of previous actions as input to Azure Storage Blob actions
In the previous screen shot, the **Content** value can be an expression:

	@triggers().outputs.body.Content

You can set it to any value that you want. The expression takes the output of the logic app trigger and uses it as the content of the file to be uploaded. For example, you want to use the output of a transform. In that scenario, the expression would be:

	@actions('transformservice').outputs.body.OutputXML

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

<!-- Image reference -->
[2]: ./media/app-service-logic-connector-azurestorageblob/SelectAzureStorageBlobConnector.PNG
[3]: ./media/app-service-logic-connector-azurestorageblob/CreateAzureStorageBlobConnector.PNG
[4]: ./media/app-service-logic-connector-azurestorageblob/CreateLogicApp.PNG
[5]: ./media/app-service-logic-connector-azurestorageblob/LogicAppEmptyFlowDesigner.PNG
[6]: ./media/app-service-logic-connector-azurestorageblob/ChooseBlobAvailableTrigger.PNG
[7]: ./media/app-service-logic-connector-azurestorageblob/BasicInputsBlobAvailableTrigger.PNG
[8]: ./media/app-service-logic-connector-azurestorageblob/AdvancedInputsBlobAvailableTrigger.PNG
[9]: ./media/app-service-logic-connector-azurestorageblob/ConfiguredBlobAvailableTrigger.PNG
[10]: ./media/app-service-logic-connector-azurestorageblob/ListOfAzureStorageBlobActions.PNG
[11]: ./media/app-service-logic-connector-azurestorageblob/BasicInputsUploadBlob.PNG
 
