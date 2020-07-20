---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 11/03/2016
---

## Prerequisites

* An Azure account; you can create a [free account](https://azure.microsoft.com/free)
* A [OneDrive](https://www.microsoft.com/store/apps/onedrive/9wzdncrfj1p3) account 

Before you can use your OneDrive account in a logic app, authorize the logic app to connect to your OneDrive account.  You can do this easily within your logic app on the Azure portal. 

Authorize your logic app to connect to your OneDrive account using the following steps:

1. Create a logic app. In the Logic Apps designer, select **Show Microsoft managed APIs** in the drop down list, and then enter "onedrive" in the search box. Select one of the triggers or actions:  
   ![A dialog box titled "Show Microsoft managed APIs" has a search box that contains "onedrive". Below that is a list of four triggers. First on the list is "OneDrive - When a file is created", which is selected.](./media/connectors-create-api-onedrive/onedrive-1.png)
2. If you haven't previously created any connections to OneDrive, you are prompted to sign in using your OneDrive credentials:  
   ![A dialog box titled "OneDrive - When a file is created" has a button labeled "Sign in".](./media/connectors-create-api-onedrive/onedrive-2.png)
3. Select **Sign in**, and enter your user name and password. Select **Sign in**:  
   ![A dialog box titled "Sign in" instructs you to "Use your Microsoft account". It has two text boxes labeled "Email or phone" and "Password" It also has a check box labeled "Keep me signed in", and a button labeled "Sign in".](./media/connectors-create-api-onedrive/onedrive-3.png)   
   
    These credentials are used to authorize your logic app to connect to, and access the data in your OneDrive account. 
4. Select **Yes** to authorize the logic app to use your OneDrive account:  
   ![A dialog box titled "Let this app access your info?" asks for permission to do the following four things: 1) "Sign in automatically", 2) "Access your email addresses", 3) "Access your info anytime", and 4) "Access OneDrive files." There is a "Yes" button to give permission, and a "No" button to deny it. There is a link to change these application permissions.](./media/connectors-create-api-onedrive/onedrive-4.png)   
5. Notice the connection has been created. Now, proceed with the other steps in your logic app:  
   ![A dialog box titled "When a file is created" has a text box titled "FOLDER" with an associated browse button.](./media/connectors-create-api-onedrive/onedrive-5.png)

