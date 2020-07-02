---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 11/03/2016
---

## Prerequisites

* An Azure account; you can create a [free account](https://azure.microsoft.com/free)
* A [Microsoft 365](https://www.microsoft.com/microsoft-365) account  

Before using your work or school account in a logic app, authorize the logic app to connect to your work or school account. You can do this easily within your logic app on the Azure portal.  

Authorize your logic app to connect to your work or school account using the following steps:

1. Create a logic app. In the Logic Apps designer, select **Show Microsoft managed APIs** in the drop down list, and then enter "office 365" in the search box. Select one of the triggers or actions:  
    ![Office 365 connection creation step](./media/connectors-create-api-office365-outlook/office365-sendemail.png)  
2. If you haven't previously created any connections to Office 365, you are prompted to sign in using your work or school credentials:  
    ![Office 365 connection creation step](./media/connectors-create-api-office365-outlook/office365-signin.png)  
3. Select **Sign in**, and enter your user name and password. Select **Sign in**:  
    ![Office 365 connection creation step](./media/connectors-create-api-office365-outlook/office365-usernamepassword.png)
   
    These credentials are used to authorize your logic app to connect to, and access your work or school account. 
4. Notice the connection has been created. Now, proceed with the other steps in your logic app:   
    ![Office 365 connection creation step](./media/connectors-create-api-office365-outlook/office365-sendemailproperties.png)  

