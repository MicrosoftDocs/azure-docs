---
author: ecfan
ms.service: logic-apps
ms.topic: include
ms.date: 11/03/2016
ms.author: estfan
---
### Prerequisites
* A [MailChimp](https://www.MailChimp.com/) account 

Before you can use your MailChimp account in a Logic app, you must authorize the Logic app to connect to your MailChimp account. Fortunately, you can do this easily from within your Logic app on the Azure Portal. 

Here are the steps to authorize your Logic app to connect to your MailChimp account:

1. To create a connection to MailChimp, in the Logic app designer, select **Show Microsoft managed APIs** in the drop down list then enter *MailChimp* in the search box. Select the trigger or action you'll like to use:  
   ![MailChimp step 1](./media/connectors-create-api-mailchimp/mailchimp-1.png)
2. If you haven't created any connections to MailChimp before, you'll get prompted to provide your MailChimp credentials. These credentials will be used to authorize your Logic app to connect to, and access your MailChimp account's data:  
   ![MailChimp step 2](./media/connectors-create-api-mailchimp/mailchimp-2.png)
3. Provide your MailChimp user name and password to authorize your Logic app:  
   ![MailChimp step 3](./media/connectors-create-api-mailchimp/mailchimp-3.png)   
4. Notice the connection has been created and you are now free to proceed with the other steps in your Logic app:  
   ![MailChimp step 4](./media/connectors-create-api-mailchimp/mailchimp-4.png)

