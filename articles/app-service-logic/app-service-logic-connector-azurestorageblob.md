<properties 
   pageTitle="Azure Storage Blob Connector" 
   description="Get started with Azure Storage Blob Connector" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="anuragdalmia" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="06/29/2015"
   ms.author="rajram"/>
   
# Azure Storage Blob Connector
Connect to your Azure Storage Blob to upload, download, and delete blobs from the blob container. Connectors can be used in Logic Apps as a part of a "workflow". 

## Triggers and Actions
*Triggers* are events that happen. For example, when an order is updated or when a new customer is added. An *Action* is the result of the trigger. For example, when an order is updated, send an alert to the salesperson. Or, when a new customer is added, send a welcome email to the new customer. 

The Storage Blob Connector can be used as an action in a logic app and supports data in JSON and XML formats. Currently, there are no triggers for the Storage Blob Connector. 

The Storage Blob Connector has the following Triggers and Actions available: 

Triggers | Actions
--- | ---
None | <ul><li>Get Blob</li><li>Upload Blob</li><li>Delete Blob</li><li>List Blobs</li><li>Snapshot Blob</li><li>Copy Blob</li></ul>

## Create the Azure Storage Blob Connector

A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Select **API Apps** and search for “Blob”:
<br/>
![Select Azure Storage Blob Connector][2]

3. Enter the Name, App Service Plan, and other properties.
4. Enter the following package settings:

	Name | Required |  Description
--- | --- | ---
Container/SAS URI | Yes | Enter the URI of the Blob Container. The URI may also include the SAS token. For example, enter http://*storageaccountname*.blob.core.windows.net/containername or http://*storageaccountname*.blob.core.windows.net/containername?sr=c&si=mypolicy&sig=signatureblah
Access Key | No | Enter a valid primary or secondary storage account access key. If you are using the SAS token for authentication, leave this field empty.

![Create Azure Storage Blob Connector][3]

5. Click **Create**.

## Use Azure Storage Blob Connector in Logic App
Once the Azure Storage Blob connector has been created, it can now be added to your workflow.

Create a new flow through +New -> Web+Mobile -> LogicApp. Provide the metadata for the flow including resource group

![Create Logic App][4]

Click on *triggers and actions*. The flow designer opens:

![Logic App empty flow designer][5]

Azure Storage Blob Connector can be used as as an action. 

### Actions
Click on Azure Storage Blob Connector from the right pane. The connector lists down the actions supported:

![List of Azure Storage Blob Actions][10]

Azure Storage Blob Connector supports the following actions:

- **Get Blob** - Get a specific Blob from the container
- **Upload Blob** - Upload a new Blob or update an existing Blob
- **Delete Blob** - Delete a specific Blob from a Container
- **List Blobs** - List all blobs in a directory
- **Snapshot Blob** - Create a read-only snapshot of a Specific Blob
- **Copy Blob** - Create a new Blob by copying from another Blob.  The source Blob may be in the same account or in another account.

Lets take one example - Upload Blob. Select **Upload Blob**:

![Inputs of Upload Blob action][11]

Enter the input values and select the check mark to complete the configuration:

Input | Description
--- | ---
Blob Path | Determines the path of the Blob to be uploaded. The path is interpreted relative to the configured Container path.
Blob Write Content | Enter the Content and the properties of the Blob to be uploaded.
Content Transfer Encoding | Enter none or Base64.
Overwrite | When set to true, the existing Blob is overwritten. When set to false, it returns an error if a Blob already exists at the same path.

Note that the configured Azure Storage Blob Upload Blob action shows both input parameters as well as output parameters.

#### Using the outputs of previous actions as input to Azure Storage Blob actions
Note that in the configured screenshot, Content is value is set to an expression.

	@triggers().outputs.body.Content


You can set it to any value that you want. This is just an example. The expression takes the output of the logic app trigger and uses it as the content of the file to be uploaded. Lets say you want to use the output of a previous action, say transform. In that case, the expression would be

	@actions('transformservice').outputs.body.OutputXML

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

Create the API Apps using REST APIs. See [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

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
 