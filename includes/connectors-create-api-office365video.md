---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 07/21/2020
---

## Prerequisites

* An [Office 365 Video](https://support.office.com/article/Meet-Office-365-Video-ca1cc1a9-a615-46e1-b6a3-40dbd99939a6) account  

Before you can use your Office 365 Video account with Logic Apps, you must authorize Logic Apps to connect to your Office 365 Video account in the Azure portal.

Follow these steps to authorize Logic Apps to connect to your Office 365 Video account:  

1. Sign in to the Azure portal. 
1. Under **Azure services**, select **Logic Apps**. Then, select the name of your logic app from the list.
1. On your logic app's menu, select **Logic app designer** under **Development Tools**.
1. In the Logic Apps Designer, select **Show Microsoft managed APIs** in the drop-down list, then enter *Office 365 Video* in the search box. Select the trigger or action to use:
   ![Screenshot of Logic Apps Designer, showing steps editor with Office 365 Video triggers and actions.](./media/connectors-create-api-office365video/office365video-1.png)  
1. If you haven't created any connections to Office 365 Video before, follow the prompt to provide your Office 365 Video credentials. These credentials are used to authorize your logic app to access your Office 365 Video account's data:  
   ![Screenshot of Logic Apps Designer, showing sign-in prompt for Office 365 Video API.](./media/connectors-create-api-office365video/office365video-2.png)  
1. Provide your credentials to connect to Office 365 Video:  
   ![Screenshot of Office 365 Video API sign-in screen, showing sign-in prompt.](./media/connectors-create-api-office365video/office365video-3.png)  
1. The connection is now listed in the step. Select save, then continue creating your logic app. 
   ![Screenshot of Logic Apps Designer, showing Office 365 Video step with API connection listed.](./media/connectors-create-api-office365video/office365video-4.png)  
