<properties
   pageTitle="Using the Box Connector in your logic app"
   description="How to use the Box Connector in your logic app"
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
   ms.date="08/09/2015"
   ms.author="andalmia"/>

# Box Connector

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. You may have scenarios where you may need to work with Box that allows you to share data securely with anyone – even if they’re outside your firewall.


## Triggers and Actions
The Box gallery app provides you Actions as mechanisms to interact with Box:

**Actions**: The actions lets you perform predefined actions on the Box account configured with the logic app. Following are the actions that can be performed on Box account using Box connector:

a. *List Files:* This operation will return the information of all files in a folder. Following is the list of parameters required for the action:  

Parameter Name | Description | Required
--- | --- | ---
Folder Path | Path of the folder to list. | Yes

> [AZURE.NOTE] It does not return any file content.

b. *Get File:* This operation retrieves a file including its content and properties. Following is the list of parameters required for the action:

Parameter Name | Description | Required
--- | --- | ---
File Path | Path of the Folder where the File resides. | Yes
File Type | Specifies if the file is Text or Binary. | No

> [AZURE.NOTE] This operation does not delete the file after reading it.


c. *Upload File*: As the name suggests, the action uploads the file to Box account. If file already exists, then it is not overwritten and error is thrown. Following is the list of parameters required for the action:

Parameter Name | Description | Required
--- | --- | ---
File Path | Path to the file. | Yes
File Content | File content to be uploaded. | Yes
Content Transfer Encoding | Encoding type of the content: Base64 or None. | 

d. *Delete File*: The action deletes the specified file from a folder. If the file/folder is not found, an exception is thrown. Following is the list of parameters required for the action:

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

Once your API app is created, you can now use the Box Connector as a action in your Logic App. To do this:

1. In your logic app, open **Triggers and Actions** to open the Logic Apps Designer and configure your flow. The Box Connector would appear in the “Recently Used” section in the gallery on the right hand side. Select that.

2. If Box connector is selected at the start of the logic app it acts like trigger else actions could be taken on Box account using the connector. Note that Box Connector doesnt have any triggers as of this writing.

3. The first step would be to authenticate and authorize logic apps to perform operations on your behalf. To start the authorization click Authorize on Box Connector:  
	![][2]

4. Clicking Authorize would open Box’s authentication dialog. Provide the login details of the Box account on which you want to perform the operations:  
	![][3]

5. Grant logic apps access to your account to perform operation on your behalf:  
	![][4]

6. List of actions is displayed and you can choose appropriate operation that you want to perform:  
	![][5]

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

Create the API Apps using REST APIs. See [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

<!--Image references-->
[1]: ./media/app-service-logic-connector-box/image_0.jpg
[2]: ./media/app-service-logic-connector-box/image_1.jpg
[3]: ./media/app-service-logic-connector-box/image_2.jpg
[4]: ./media/app-service-logic-connector-box/image_3.jpg
[5]: ./media/app-service-logic-connector-box/image_4.jpg
