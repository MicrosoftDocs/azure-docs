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
   ms.date="03/18/2015"
   ms.author="rajram"/>
   
#Azure Storage Blob Connector

##Overview
Azure Storage Blob connector lets you upload, download and delete blobs from a blob container.

##Create a new Azure Storage Blob connector
To create a new Azure Storage connector, follow the steps mentioned below.
<ul>
<li>Launch Azure portal
<li>Open Azure marketplace using +New (at the bottom of the page) -> Web+Mobile --> Azure Marketplace
</ul>

![Launch Azure Marketplace][1]<br>
<ul>
<li>Click on API Apps
<li>Search for <i>Blob</i>, and select Azure Storage Blob Connector
</ul>

![Select Azure Storage Blob Connector][2]
<br>
<ul>
<li>Click on Create
<li>In the Azure Storage Blob connector blade that opens up, provide the following data.
</ul>

![Create Azure Storage Blob Connector][3]

- **Location** - choose the geographic location where you would like the connector to be deployed
- **Subscription** - choose a subscription you want this connector to be created in
- **Resource group** - select or create a resource group where the connector should reside
- **Web hosting plan** - select or create a web hosting plan
- **Pricing tier** - choose a pricing tier for the connector
- **Name** - give a name for your Blob Storage Connector
- **Package settings** 
	- **Container/SAS URI** - Specify the URI of the Blob Container. The URI may also include the SAS token. Example http://storageaccountname.blob.core.windows.net/containername or http://storageaccountname.blob.core.windows.net/containername?sr=c&si=mypolicy&sig=signatureblah
	- **Access Key** - Specify a valid primary/secondary storage account access key. Leave this field empty if you are using SAS token for authentication.
- Click on Create. A new Azure Storage Blob Connector will be created.

##Use Azure Storage Blob Connector in Logic App
Once the Azure Storage Blob connector has been created, it can be consumed from the flow.

Create a new flow through +New -> Web+Mobile -> LogicApp. Provide the metadata for the flow including resource group

![Create Logic App][4]

Click on *triggers and actions*. The flow designer opens up

![Logic App empty flow designer][5]

Azure Storage Blob Connector can be used as as an action. 

###Actions
Click on Azure Storage Blob Connector from the right pane. The connector lists down the actions supported.

![List of Azure Storage Blob Actions][10]

Azure Storage Blob Connector supports four actions. They are

- **Get Blob** - Get a specific Blob from the container
- **Upload Blob** - Upload a new Blob or update an existing Blob
- **Delete Blob** - Delete a specific Blob from a Container
- **List Blobs** - List all blobs in a directory
- **Snapshot Blob** - Create a read-only snapshot of a Specific Blob
- **Copy Blob** - Create a new Blob by copying from another Blob.  The source Blob may be in the same account or in another account.

Lets take one example - Upload Blob. Click on Upload Blob

![Inputs of Upload Blob action][11]


- **Blob Path** - Specifies the path of the Blob to be uploaded.  The path is interpreted relative to the configured Container path.
- **Blob Write Content** - Specify the Content and the properties of the Blob to be uploaded.
- **Content Transfer Encoding** - Specify none or Base64
- **Overwrite** - If set to true, existing Blob will be overwritten. Otherwise, it will return an error if a Blob already exists at the same path.

Provide the inputs and click on the tick mark to complete input configuration.


Note that the configured Azure Storage Blob Upload Blob action shows both input parameters as well as output parameters.

####Using the outputs of previous actions as input to Azure Storage Blob actions
Note that in the configured screenshot, Content is value is set to an expression.

	@triggers().outputs.body.Content


You can set it to any value that you want. This is just an example. The expression takes the output of the logic app trigger and uses it as the content of the file to be uploaded. Lets say you want to use the output of a previous action, say transform. In that case, the expression would be

	@actions('transformservice').outputs.body.OutputXML


<!-- Image reference -->
[1]: ./media/app-service-logic-connector-azurestorageblob/LaunchAzureMarketplace.PNG
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
