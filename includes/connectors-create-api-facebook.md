---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 07/20/2020
---

## Prerequisites

* A [Facebook](https://www.facebook.com/) account 

Before you can use your Facebook account in a Logic app, you must authorize the Logic app to connect to your Facebook account. Fortunately, you can do this easily from within your Logic app on the Azure Portal. 

Here are the steps to authorize your Logic app to connect to your Facebook account:

1. To create a connection to Facebook, in the Logic app designer, select **Show Microsoft managed APIs** in the drop down list then enter *Facebook* in the search box. Select the trigger or action you'll like to use:  
   ![Screenshot of Logic Apps Designer, showing selection of Facebook API actions.](./media/connectors-create-api-facebook/facebook-1.png)
2. If you haven't created any connections to Facebook before, you'll get prompted to provide your Facebook credentials. These credentials will be used to authorize your Logic app to connect to, and access your Facebook account's data:  
   ![Screenshot of Logic Apps Designer, showing Facebook sign-in prompt to authorize the API.](./media/connectors-create-api-facebook/facebook-2.png)
3. Provide your Facebook user name and password to authorize your Logic app:  
   ![Screenshot of Facebook's website, showing sign-in screen.](./media/connectors-create-api-facebook/facebook-3.png)   
4. Notice the connection has been created and you are now free to proceed with the other steps in your Logic app:  
   ![Screenshot of Logic Apps Designer action editor, showing connection to Facebook API.](./media/connectors-create-api-facebook/facebook-4.png)   
