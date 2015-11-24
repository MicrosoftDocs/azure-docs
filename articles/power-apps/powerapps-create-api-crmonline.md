<properties
	pageTitle="Create a new Dynamics CRM Online Connection Provider API"
	description=""
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="LinhTran"
	manager="gautamt"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/24/2015"
   ms.author="litran"/>

# Create a new Dynamics CRM Online Connection Provider API from Azure Marketplace

1. In the [Azure portal](https://portal.azure.com/), sign-in with your work account. For example, sign-in with *yourUserName*@*YourCompany*.com. When you do this, you are automatically signed in to your company subscription.
 
2. Select **Browse** in the task bar:  
![][1]

3. In the list, you can scroll to find PowerApps or type in *powerapps*:  
![][2]  

4. In **PowerApps**, select **Manage APIs**:  
![Browse to registered apis][3]

5. In **Manage APIs**, select **Add** to add the new API:  
![Add API][4]

6. Enter a descriptive **name** for your API.  
	
7. In **Source**, select **Available APIs** to select the pre-built APIs, and select **Dynamics CRM Online**:

8. Select **Settings - Configure required settings**: 

9. Enter **App Key** and **App Secret** for Dynamics CRM Online Connection Provider
	- If you don't have a Google Drive Key, go [here]() to obtain one.

4. Click **OK** on **Configure API** blade
5. Click **OK** on **Create API** blade

[1]: ./media/powerapps-create-api-dropbox/browseall.png
[2]: ./media/powerapps-create-api-dropbox/allresources.png
[3]: ./media/powerapps-create-api-dropbox/browse-to-registered-apis.PNG
[4]: ./media/powerapps-create-api-dropbox/add-api.PNG