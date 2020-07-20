---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 07/20/2020
---

## Prerequisites

* A [Office 365 Video](https://support.office.com/article/Meet-Office-365-Video-ca1cc1a9-a615-46e1-b6a3-40dbd99939a6) account  

Before you can use your Office 365 Video account in a Logic app, you must authorize the Logic app to connect to your Office 365 Video account.Fortunately, you can do this easily from within your Logic app on the Azure Portal.  

Here are the steps to authorize your Logic app to connect to your Office 365 Video account:  

1. To create a connection to Office 365 Video, in the Logic app designer, select **Show Microsoft managed APIs** in the drop down list then enter *Office 365 Video* in the search box. Select the trigger or action you'll like to use:  
   ![Screenshot of Logic Apps Designer, showing steps editor with Office 365 Video triggers and actions.](./media/connectors-create-api-office365video/office365video-1.png)  
2. If you haven't created any connections to Office 365 Video before, you'll get prompted to provide your Office 365 Video credentials. These credentials will be used to authorize your Logic app to connect to, and access your Office 365 Video account's data:  
   ![Screenshot of Logic Apps Designer, showing login prompt for Office 365 Video API.](./media/connectors-create-api-office365video/office365video-2.png)  
3. Provide your credentials to connect to Office 365 Video:  
   ![Screenshot of Office 365 Video API login screen, showing sign in prompt.](./media/connectors-create-api-office365video/office365video-3.png)  
4. Notice the connection has been created and you are now free to proceed with the other steps in your Logic app:  
   ![Screenshot of Logic Apps Designer, showing Office 365 Video step with API connection listed.](./media/connectors-create-api-office365video/office365video-4.png)  

