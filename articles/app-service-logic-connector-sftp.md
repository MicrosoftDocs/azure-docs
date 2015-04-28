<properties 
	pageTitle="SFTP Connector"
	description="Get started with SFTP Connector"
	authors="anuragdalmia" 
	manager="dwrede" 
	editor="" 
	services="app-service\logic" 
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/31/2015"
	ms.author="adgoda"/>

# Using the SFTP connector in your logic app #

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. 

The SFTP Connector enables you to move data from/to an SFTP server. It lets you download files from or upload files or list files from/to an SFTP server.

## Creating an SFTP connector for your Logic App ##
To use the SFTP connector, you need to first create an instance of the SFTP connector API app. This can be done as follows:

1.	Open the Azure Marketplace using the + NEW option at the bottom left of the Azure Portal.
2.	Browse to “Web and Mobile > API Apps” and search for “SFTP connector”.
3.	Configure the SFTP connector as follows:
 
	![][1] 
	- **Location** - choose the geographic location where you would like the connector to be deployed
	- **Subscription** - choose a subscription you want this connector to be created in
	- **Resource group** - select or create a resource group where the connector should reside
	- **Web hosting plan** - select or create a web hosting plan
	- **Pricing tier** - choose a pricing tier for the connector
	- **Name** - give a name for your SFTP Connector
	- **Package settings** 
		- **Server Address** - Specify the SFTP Server name or IP address
		- **Accept Any SSH Server HostKey** - Determines if any SSH public host key fingerprint from the Server should be accepted. If set to false, the host key will be matched against the key specified in the “SSH Server Host Key Finger Print” property
		- **SSH Server HostKey** - Specify the fingerprint of the public host key for the SSH server.
		- **Root Folder** - Specify a root folder path
		- **Encrypt Cipher** - Specify the encryption cipher.
		- **Server Port** - Specify the SFTP Server port number
4. Click on Create. A new SFTP Connector will be created.

5. Browse to the just created API App via Browse -> API Apps -> <Name of the API App just created> and you can see that the "Security" component is not configured. 

	![][2]
6. Click on "Security" component to configure Security (User Name, Password, Private Key, PPK File password) for SFTP connector. 
Select "Password" or "Privatekey" or "MutliFactor" authorization tab under Security and provide the required properties.

	![][3]
	![][4]
	![][5]
6. Once the security configuration is saved, you can create a logic App in the same resource group to use the SFTP connector. 

## Using the SFTP Connector in your Logic App ##
Once your API app is created, you can now use the SFTP connector as a trigger/action for your Logic App. To do this, you need to:

1.	Create a new Logic App and choose the same resource group which has the SFTP connector.
 	
	![][6]
2.	Open “Triggers and Actions” to open the Logic Apps Designer and configure your flow. 
 	
	![][7]
3.	The SFTP connector would appear in the “API Apps in this resource group” section in the gallery on the right hand side.
 
	![][8]
4.	You can drop the SFTP Connector API app into the editor by clicking on the “SFTP Connector”
 
	
6.	You can now use SFTP connector in the flow. You can use the File retrieved from the SFTP trigger ("TriggerOnFileAvailable") in other actions in the flow. 

	**Note:** The SFTP trigger "TriggerOnFileAvailable" will delete the retrieved file after processing the file.

8.	Configure the input properties for SFTP trigger as Follows:

	- **Folder Path** - Specify the path of the Folder from which Files needs to be retieved.
	- **The type of the file: text or binary** - Select the type of the file.
	- **File Mask** - Specify the file mask to be applied for retrieving files. '*' retrieves all the files in the specified folder.
	- **Exclude File Mask** - Specify the file mask to be applied for excluding files. If the "File Mask" property is also set, the Exclude File Mask will be applied first.

 
	![][9] 
	![][10]

7.	In the similar way you can use the SFTP actions in the flow. You can use the "upload File" action to upload a file to SFTP server. Configure the input properties for "Upload File" action as follows:

	- **Content** - Specifies the content of the file to be uploaded
	- **Content Transfer Encoding** - Specify none or base64
	- **File Path** - Specify the file path of the file to be uploaded
	- **Overwrite** - Specify "true" to overwrite the file if it already exists
	- **Append If Exists **- Specify "true" or "false". When set to "true", the data is appended to the file if it exists. When set to "false", the file is overwritten if it exists
	- **Temporary Folder** - If provided, the adapter will upload the file to the 'Temporary Folder Path' and once the upload is done the file will be moved to 'Folder Path'. The 'Temporary Folder Path' should be on the same physical disk as the 'Folder Path' to make sure that the move operation is atomic. Temporary folder can be used only when 'Append If Exist' property is disabled.

	![][11]
	![][12]





<!-- Image reference -->
[1]: ./media/app-service-logic-connector-sftp/img1.PNG
[2]: ./media/app-service-logic-connector-sftp/img2.PNG
[3]: ./media/app-service-logic-connector-sftp/img3.PNG
[4]: ./media/app-service-logic-connector-sftp/img4.PNG
[5]: ./media/app-service-logic-connector-sftp/img5.PNG
[6]: ./media/app-service-logic-connector-sftp/img6.PNG
[7]: ./media/app-service-logic-connector-sftp/img7.png
[8]: ./media/app-service-logic-connector-sftp/img8.png
[9]: ./media/app-service-logic-connector-sftp/img9.PNG
[10]: ./media/app-service-logic-connector-sftp/img10.PNG
[11]: ./media/app-service-logic-connector-sftp/img11.PNG
[12]: ./media/app-service-logic-connector-sftp/img12.PNG
