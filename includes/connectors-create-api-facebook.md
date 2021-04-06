---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 07/21/2020
---

## Prerequisites

* A [Facebook](https://www.facebook.com/) account 

Before you can use your Facebook account with Logic Apps, you must authorize Logic Apps to connect to your Facebook account in the Azure portal.

Follow these steps to authorize Logic Apps to connect to your Facebook account:  

1. Sign in to the Azure portal. 
1. Under **Azure services**, select **Logic Apps**. Then, select the name of your logic app from the list.
1. On your logic app's menu, select **Logic app designer** under **Development Tools**.
1. In the Logic Apps Designer, select **Show Microsoft managed APIs** in the drop-down list, then enter *Facebook* in the search box. Select the trigger or action to use:  
   ![Screenshot of Logic Apps Designer, showing selection of Facebook API actions.](./media/connectors-create-api-facebook/facebook-1.png)
2. If you haven't created any connections to Facebook before, follow the prompt to provide your Facebook credentials. These credentials are used to authorize your logic app to access your Facebook account's data:  
   ![Screenshot of Logic Apps Designer, showing Facebook sign-in prompt to authorize the API.](./media/connectors-create-api-facebook/facebook-2.png)
3. Provide your Facebook username and password to authorize your logic app:  
   ![Screenshot of Facebook's website, showing sign-in screen.](./media/connectors-create-api-facebook/facebook-3.png)   
4. The connection is now listed in the step. Select save, then continue creating your logic app.  
   ![Screenshot of Logic Apps Designer action editor, showing connection to Facebook API.](./media/connectors-create-api-facebook/facebook-4.png)   
