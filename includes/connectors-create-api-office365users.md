---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 07/21/2020
---

## Prerequisites

* An [Office 365 Users](https://office365.com) account  

Before you can use your Office 365 Users account with Logic Apps, you must authorize Logic Apps to connect to your Office 365 Video account in the Azure portal.

Follow these steps to authorize Logic Apps to connect to your Office 365 Users account:  

1. Sign in to the Azure portal. 
1. Under **Azure services**, select **Logic Apps**. Then, select the name of your logic app from the list.
1. On your logic app's menu, select **Logic app designer** under **Development Tools**.
1. In the Logic Apps Designer, select **Show Microsoft managed APIs** in the drop-down list, then enter *Office 365 Users* in the search box. Select the trigger or action to use: 
   ![Screenshot of Logic Apps Designer, showing Office 365 Users triggers and actions in steps editor.](./media/connectors-create-api-office365users/office365users-1.png)  
2. If you haven't created any connections to Office 365 Users before, follow the prompt to provide your Office 365 Users credentials. These credentials are used to authorize your Logic app to access your Office 365 Users account's data:  
   ![Screenshot of Logic Apps Designer, showing sign-in prompt for Office 365 Users API.](./media/connectors-create-api-office365users/office365users-2.png)  
3. Provide your Office 365 Users username and password to authorize your logic app:  
   ![Screenshot of Office 365 Users sign-in page, showing API sign-in prompt.](./media/connectors-create-api-office365users/office365users-3.png)  
4. The connection is now listed in the step. Select save, then continue creating your logic app.   
   ![Screenshot of Logic Apps Designer, showing Office 365 Users step with API connection listed.](./media/connectors-create-api-office365users/office365users-4.png)  
