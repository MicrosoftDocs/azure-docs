---
title: Learn how to use the FTP connector in logic apps| Microsoft Docs
description: Create logic apps with Azure App service. Connect to FTP server to manage your files. You can perform various actions such as upload, update, get, and delete files in FTP server.
services: logic-apps
documentationcenter: .net,nodejs,java
author: msftman
manager: erikre
editor: ''
tags: connectors

ms.assetid: d83c55fe-eb59-4b7b-a5ec-afac5c772616
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 07/22/2016
ms.author: mandia; ladocs

---
# Get started with the FTP connector
Use the FTP connector to monitor, manage and create files on an  FTP server. 

To use [any connector](apis-list.md), you first need to create a logic app. You can get started by [creating a logic app now](../logic-apps/logic-apps-create-a-logic-app.md).

## Connect to FTP
Before your logic app can access any service, you first need to create a *connection* to the service. A [connection](connectors-overview.md) provides connectivity between a logic app and another service.  

### Create a connection to FTP
> [!INCLUDE [Steps to create a connection to FTP](../../includes/connectors-create-api-ftp.md)]
> 
> 

## Use a FTP trigger
A trigger is an event that can be used to start the workflow defined in a logic app. [Learn more about triggers](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts).  

> [!IMPORTANT]
> The FTP connector requires an FTP server that  is accessible from the Internet and is configured to operate with PASSIVE mode. Also, the FTP connector is **not compatible with implicit FTPS (FTP over SSL)**. The FTP connector only supports explicit FTPS (FTP over SSL).  
> 
> 

In this example, I will show you how to use the **FTP - When a file is added or modified** trigger to initiate a logic app workflow when a file is added to, or modified on, an FTP server. In an enterprise example, you could use this trigger to monitor an FTP folder for new files that represent orders from customers.  You could then use an FTP connector action such as **Get file content** to get the contents of the order for further processing and storage in your orders database.

1. Enter *ftp* in the search box on the logic apps designer then select the **FTP - When a file is added or modified**  trigger   
   ![FTP trigger image 1](./media/connectors-create-api-ftp/ftp-trigger-1.png)  
   The **When a file is added or modified** control opens up  
   ![FTP trigger image 2](./media/connectors-create-api-ftp/ftp-trigger-2.png)  
2. Select the **...** located on the right side of the control. This opens the folder picker control  
   ![FTP trigger image 3](./media/connectors-create-api-ftp/ftp-trigger-3.png)  
3. Select the **>** (right arrow) and browse to find the folder that you want to monitor for new or modified files. Select the folder and notice the folder is now displayed in the **Folder** control.  
   ![FTP trigger image 4](./media/connectors-create-api-ftp/ftp-trigger-4.png)   

At this point, your logic app has been configured with a trigger that will begin a run of the other triggers and actions in the workflow when a file is either modified or created in the specific FTP folder. 

> [!NOTE]
> For a logic app to be functional, it must contain at least one trigger and one action. Follow the steps in the next section to add an action.  
> 
> 

## Use a FTP action
An action is an operation carried out by the workflow defined in a logic app. [Learn more about actions](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts).  

Now that you have added a trigger, follow these steps to add an action that will get the contents of the new or modified file found by the trigger.    

1. Select **+ New step** to add the the action to get the contents of the file on the FTP server  
2. Select the **Add an action** link.  
   ![FTP action image 1](./media/connectors-create-api-ftp/ftp-action-1.png)  
3. Enter *FTP* to search for all actions related to FTP.
4. Select **FTP - Get file content**  as the action to take when a new or modified file is found in the FTP folder.      
   ![FTP action image 2](./media/connectors-create-api-ftp/ftp-action-2.png)  
   The **Get file content** control opens. **Note**: you will be prompted to authorize your logic app to access your FTP server account if you have not done so previously.  
   ![FTP action image 3](./media/connectors-create-api-ftp/ftp-action-3.png)   
5. Select the **File** control (the white space located below **FILE***). Here, you can use any of the various properties from the new or modified file found on the FTP server.  
6. Select the **File content** option.  
   ![FTP action image 4](./media/connectors-create-api-ftp/ftp-action-4.png)   
7. The control is updated, indicating that the **FTP - Get file content** action will get the *file content* of the new or modified file on the FTP server.      
   ![FTP action image 5](./media/connectors-create-api-ftp/ftp-action-5.png)     
8. Save your work then add a file to the FTP folder to test your workflow.    

At this point, the logic app has been configured with a trigger to monitor a folder on an FTP server and initiate the workflow when it finds either a new file or a modified file on the FTP server. 

The logic app also has been configured with an action to get the contents of the new or modified file.

You can now add another action such as the [SQL Server - insert row](connectors-create-api-sqlazure.md) action to insert the contents of the new or modified file into a SQL database table.  

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/ftpconnector/). 

## Next Steps
[Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md)

