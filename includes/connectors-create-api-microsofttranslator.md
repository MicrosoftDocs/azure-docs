---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 07/21/2020
---

## Prerequisites

* A [Microsoft Translator](https://www.microsoft.com/translator) account  

Before you can use your Microsoft Translator account with Logic Apps, you must authorize Logic Apps to connect to your Microsoft Translator account in the Azure portal.

Follow these steps to authorize Logic Apps to connect to your Microsoft Translator account:  

1. Sign in to the Azure portal. 
1. Under **Azure services**, select **Logic Apps**. Then, select the name of your logic app from the list.
1. On your logic app's menu, select **Logic app designer** under **Development Tools**.
1. In the Logic Apps Designer, select **Show Microsoft managed APIs** in the drop-down list, then enter *MicrosoftTranslator* in the search box. Select the trigger or action to use:
   ![Screenshot of Logic Apps Designer, showing Microsoft Translator API actions and triggers in steps editor.](./media/connectors-create-api-microsofttranslator/microsofttranslator-1.png)  
2. If you haven't created any connections to Microsoft Translator before, follow the prompt to provide your Microsoft Translator credentials. These credentials are used to authorize your Logic app to access your Microsoft Translator account's data:  
   ![Screenshot of Logic Apps Designer, showing sign-in prompt for Microsoft Translator API.](./media/connectors-create-api-microsofttranslator/microsofttranslator-2.png)  
3. The connection is now listed in the step. Select save, then continue creating your logic app.  
   ![Screenshot of Logic Apps Designer, showing Microsoft Translator text to speech action with API connection listed.](./media/connectors-create-api-microsofttranslator/microsofttranslator-3.png)  
