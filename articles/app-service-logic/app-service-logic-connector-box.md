<properties
   pageTitle="Using the Box Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the Box Connector or API app and use it in a logic app in Azure App Service"
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
   ms.date="08/23/2015"
   ms.author="andalmia"/>

# Get started with the Box Connector and add it to your Logic App 
Connect to your Box to get, upload, delete. and more to your files. Connectors are used in Logic Apps as a part of a "workflow". 

You may have scenarios where you may need to work with Box that allows you to share data securely with anyone – even if they’re outside your firewall. Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow.


## Triggers and Actions
The Box gallery app provides you Actions as mechanisms to interact with Box:

**Actions**: The actions lets you perform predefined actions on the Box account configured with the logic app. Following are the actions that can be performed on Box account using Box connector:

a. *List Files:* This operation returns the information of all files in a folder. List of parameters required for the action:  

Parameter Name | Description | Required
--- | --- | ---
Folder Path | Path of the folder to list. | Yes

> [AZURE.NOTE] It does not return any file content.

b. *Get File:* This operation retrieves a file including its content and properties. List of parameters required for the action:

Parameter Name | Description | Required
--- | --- | ---
File Path | Path of the Folder where the File resides. | Yes
File Type | Specifies if the file is Text or Binary. | No

> [AZURE.NOTE] This operation does not delete the file after reading it.


c. *Upload File*: As the name suggests, the action uploads the file to Box account. If file already exists, then it is not overwritten and error is thrown. List of parameters required for the action:

Parameter Name | Description | Required
--- | --- | ---
File Path | Path to the file. | Yes
File Content | File content to be uploaded. | Yes
Content Transfer Encoding | Encoding type of the content: Base64 or None. | 

d. *Delete File*: The action deletes the specified file from a folder. If the file/folder is not found, an exception is thrown. List of parameters required for the action:

Parameter Name | Description | Required
--- | --- | ---
File Path | Complete File Path including Folders. | Yes


## Create the Box Connector for your Logic App

A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:  

1. In the Azure startboard, select **Marketplace**.
2. Search for “Box Connector”, select it, and select **Create**.
3. Enter the Name, App Service Plan, and other properties:  
	![][1]
4. Select **Create**.


## Using the Box Connector in your Logic App

Once your API app is created, you can now use the Box Connector as an action in your Logic App. To do this:

1. In your logic app, open **Triggers and Actions** to open the Logic Apps Designer and configure your flow. The Box Connector is listed in the gallery. Select it to automatically add it to your the logic apps designer.

	> [AZURE.NOTE] If the Box connector is selected at the start of the logic app, it acts like trigger. Otherwise, actions can be taken on Box account using the connector. The Box Connector doesn't have any triggers as of this writing.

2. Authenticate and authorize logic apps to perform operations on your behalf. Select **Authorize** on Box Connector:  
	![][2]

3. Enter the sign in details of the Box account on which you want to perform the operations:  
	![][3]

4. Grant logic apps access to your account to perform operation on your behalf:  
	![][4]

5. List of actions is displayed and you can choose appropriate operation that you want to perform:  
	![][5]

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

<!--Image references-->
[1]: ./media/app-service-logic-connector-box/image_0.jpg
[2]: ./media/app-service-logic-connector-box/image_1.jpg
[3]: ./media/app-service-logic-connector-box/image_2.jpg
[4]: ./media/app-service-logic-connector-box/image_3.jpg
[5]: ./media/app-service-logic-connector-box/image_4.jpg
