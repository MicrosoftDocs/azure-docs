---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 07/21/2020
---

## Prerequisites

* A [OneDrive](https://www.microsoft.com/store/apps/onedrive/9wzdncrfj1p3) account 

Before you can use your OneDrive account with Logic Apps, you must authorize Logic Apps to connect to your OneDrive account in the Azure portal.

Follow these steps to authorize Logic Apps to connect to your OneDrive account:  

1. Sign in to the Azure portal. 

1. Under **Azure services**, select **Logic Apps**. Then, select the name of your logic app from the list.

1. On your logic app's menu, select **Logic app designer** under **Development Tools**.

1. In the Logic Apps Designer, select **Show Microsoft managed APIs** in the drop-down list, then enter *OneDrive* in the search box. Select the trigger or action to use:

   ![Screenshot of Logic Apps Designer, showing list of OneDrive API actions to add.](./media/connectors-create-api-onedrive/onedrive-1.png)

2. If you haven't previously created any connections to OneDrive, follow the prompt to sign in using your OneDrive credentials:  

   ![Screenshot of Logic Apps Designer, showing sign-in prompt for OneDrive API.](./media/connectors-create-api-onedrive/onedrive-2.png)

3. Select **Sign in**, and enter your user name and password. Select **Sign in**: 

   ![Screenshot of Microsoft account sign-in page, for OneDrive API authorization.](./media/connectors-create-api-onedrive/onedrive-3.png)   

    These credentials are used to authorize your logic app to access the data in your OneDrive account. 

4. Select **Yes** to authorize the logic app to use your OneDrive account:  

   ![Screenshot of Microsoft account authorization for Logic Apps, showing allowed actions.](./media/connectors-create-api-onedrive/onedrive-4.png)   
   
5. The connection is now listed in the step. Select save, then continue creating your logic app. 

   ![Screenshot of Logic Apps Designer, showing action editor with OneDrive API connection.](./media/connectors-create-api-onedrive/onedrive-5.png)
