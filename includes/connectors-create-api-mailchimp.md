---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 07/21/2020
---

## Prerequisites

* A [MailChimp](https://www.MailChimp.com/) account 

Before you can use your MailChimp account with Logic Apps, you must authorize Logic Apps to connect to your MailChimp account in the Azure portal.

Follow these steps to authorize Logic Apps to connect to your MailChimp account:  

1. Sign in to the Azure portal. 
1. Under **Azure services**, select **Logic Apps**. Then, select the name of your logic app from the list.
1. On your logic app's menu, select **Logic app designer** under **Development Tools**.
1. In the Logic Apps Designer, select **Show Microsoft managed APIs** in the drop-down list, then enter *MailChimp* in the search box. Select the trigger or action to use:  
   ![Screenshot of Logic Apps Designer, showing list of MailChimp API actions.](./media/connectors-create-api-mailchimp/mailchimp-1.png)
2. If you haven't created any connections to MailChimp before, follow the prompt to provide your MailChimp credentials. These credentials are used to authorize your logic app to access your MailChimp account's data:  
   ![Screenshot of Logic Apps Designer, showing MailChimp API authorization sign-in prompt.](./media/connectors-create-api-mailchimp/mailchimp-2.png)
3. Provide your MailChimp username and password to authorize your logic app:  
   ![Screenshot of MailChimp sign-in page, showing authorization for Microsoft connection.](./media/connectors-create-api-mailchimp/mailchimp-3.png)   
4. The connection is now listed in the step. Select save, then continue creating your logic app.  
   ![Screenshot of Logic Apps Designer, showing MailChimp action with connection listed.](./media/connectors-create-api-mailchimp/mailchimp-4.png)
