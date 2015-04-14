<properties 
   pageTitle="Azure Storage Blob Connector" 
   description="Get started with Azure Storage Blob Connector" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="rajeshramabathiran" 
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
- Launch Azure portal
- Open Azure marketplace using +New (at the bottom of the page) -> Web+Mobile --> Azure Marketplace

![Launch Azure Marketplace][1]
- Click on API Apps
- Search for _Blob_, and select Azure Storage Blob Connector

![Select Azure Storage Blob Connector][2]
- Click on Create
- In the Azure Storage Blob connector blade that opens up, provide the following data.

![Create Azure Storage Blob Connector][3]

- **Location** - choose the geographic location where you would like the connector to be deployed
- **Subscription** - choose a subscription you want this connector to be created in
- **Resource group** - select or create a resource group where the connector should reside
- **Web hosting plan** - select or create a web hosting plan
- **Pricing tier** - choose a pricing tier for the connector
- **Name** - give a name for your FTP Connector
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

Azure Storage Blob Connector can be used as both trigger and action. 

###Trigger
In the empty flow designer, click on Azure Storage Blob connector from the right gallery pane.

![Choose Blob Available Trigger][6]

Azure Storage Blob Connector has one trigger - _BlobAvailable_. This trigger polls for blobs present in given Container. Directory-level Polling and filtering of Blobs is also supported. It deletes blobs from the Container once they are picked up

Click on _BlobAvailable_ trigger.

![Basic inputs Blob Available Trigger][7]

The inputs help you configure a particular folder path to be polled on a scheduled frequency. The basic inputs are
- Frequency - Specifies the frequency of the FTP poll
- Interval - Specifies the interval for the scheduled frequency
- Folder Path - Specifies a virtual folder path to poll. Use '.' for the root container folder
- File Type - Specifies a file mask to match against Blob file names.  Only Blobs with file names matching this file mask will be included in the poll. By default, all blobs will be included.

Clicking on ... shows the advanced inputs. 

![Advanced inputs Blob Available Trigger][8]

The advanced inputs are

- File mask - Specifies a file mask to match against Blob file names.  Only Blobs with file names matching this file mask will be included in the poll. By default, all blobs will be included.
- Exclude file mask - Specifies a file mask to match against Blob file names.  Blobs matching this file mask will be excluded. By default, no blob is excluded.

Provide the inputs and click on the tick mark to complete input configuration.

![Configured Blob Available Trigger][9]

Note that the configured _Blob Available_ trigger shows both input parameters configured, as well as the output parameters. 

Once the logic app is created, the _Blob Available_ trigger 


- Polls the folder path for new files
- Instantiates the logic flow whenever for every new file
- Deletes the file from the folder path after the logic flow has been instantiated

####Using the output of Blob Available trigger in subsequent actions
The output of _Blob Available_ trigger can be used as the input of some other actions in the flow. 

You can click on + in the input dialog of action and select the output of FTP from the drop down box directly.

You can also write an expression directly in the input box of action. The flow expression to refer to the output of trigger is given below

	@triggers().outputs.body.Content

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

####Using the outputs of previous actions as input to FTP action
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
