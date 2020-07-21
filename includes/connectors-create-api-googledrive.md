---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 07/20/2020
---

## Prerequisites

* A [Google Drive](https://www.google.com/drive/) account  

Before you can use your GoogleDrive account in a Logic app, you must authorize the Logic app to connect to your GoogleDrive account.Fortunately, you can do this easily from within your Logic app on the Azure Portal.  

Here are the steps to authorize your Logic app to connect to your GoogleDrive account:  

1. To create a connection to Google Drive, in the Logic Apps Designer, select **Show Microsoft managed APIs** in the drop down list then enter *GoogleDrive* in the search box. Select the trigger or action you'll like to use:  
   ![Screenshot of Logic Apps Designer, showing list Google Drive API actions in search menu.](./media/connectors-create-api-googledrive/googledrive-1.png)  
2. If you haven't created any connections to GoogleDrive before, you'll get prompted to provide your GoogleDrive credentials. These credentials will be used to authorize your Logic app to connect to, and access your GoogleDrive account's data:  
   ![Screenshot of Logic Apps Designer, showing sign-in prompt for Google Drive API.](./media/connectors-create-api-googledrive/googledrive-2.png)  
3. Provide your GoogleDrive email address:  
   ![GoogleDrive connection creation step](./media/connectors-create-api-googledrive/googledrive-3.png)  
4. Provide your GoogleDrive password to authorize your Logic app:  
   ![Screenshot of Google account sign-in page, showing account sign-in prompt.](./media/connectors-create-api-googledrive/googledrive-4.png)
5. Allow the connection to GoogleDrive  
   ![Screenshot of Google service authorization page, showing permissions approval for Logic Apps.](./media/connectors-create-api-googledrive/googledrive-5.png)  
6. Notice the connection has been created and you are now free to proceed with the other steps in your Logic app:  
   ![Screenshot of Google Drive action editor, showing connection to API listed.](./media/connectors-create-api-googledrive/googledrive-6.png)  
