---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 07/21/2020
---

## Prerequisites

* A [OneDrive for Business](https://OneDrive.com) account 

Before you can use your OneDrive for Business account with Logic Apps, you must authorize Logic Apps to connect to your OneDrive for Business account in the Azure portal.

Follow these steps to authorize Logic Apps to connect to your OneDrive for Business account:  

1. Sign in to the Azure portal. 

1. Under **Azure services**, select **Logic Apps**. Then, select the name of your logic app from the list.

1. On your logic app's menu, select **Logic app designer** under **Development Tools**.

1. In the Logic Apps Designer, select **Show Microsoft managed APIs** in the drop-down list, then enter *OneDrive for Business* in the search box. Select the trigger or action to use:  

   ![Screenshot of Logic Apps Designer, showing recurrence trigger with OneDrive for Business API actions.](./media/connectors-create-api-onedriveforbusiness/onedriveforbusiness-1.png)

2. If you haven't created any connections to OneDrive for Business before, follow the prompt to provide your OneDrive for Business credentials. These credentials are used to authorize your logic app to access your OneDrive for Business account's data:  

   ![Screenshot of Logic Apps Designer, showing sign-in prompt for OneDrive for Business.](./media/connectors-create-api-onedriveforbusiness/onedriveforbusiness-2.png)

3. Provide your OneDrive for Business username and password to authorize your logic app:  

   ![Screenshot of OneDrive for Business sign-in page, showing sign-in prompt.](./media/connectors-create-api-onedriveforbusiness/onedriveforbusiness-3.png)   

4. The connection is now listed in the step. Select save, then continue creating your logic app. 

   ![Screenshot of Logic Apps Designer, showing trigger with OneDrive for Business connection listed.](./media/connectors-create-api-onedriveforbusiness/onedriveforbusiness-4.png)   
