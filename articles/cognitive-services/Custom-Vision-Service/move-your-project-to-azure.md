---
title: Move a limited trial project to Azure
titlesuffix: Azure Cognitive Services
description: Learn how to move a Limited Trial project to Azure. 
services: cognitive-services
author: anrothMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: conceptual
ms.date: 02/19/2019
ms.author: anroth
---



# How to move your Limited Trial project to Azure on CustomVision.ai


As Custom Vision Service is now in Azure Preview, support for Limited Trial projects outside of Azure is ending. This document will teach you how to use CustomVision.ai website to move your Limited Trial project to be associated with an Azure resource. 

> [!NOTE]
> When you move your Custom Vision projects to an Azure resource, they the inherit underlying [permissions]( https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal) of that Azure resource. If other users in your organization are Owners of the Azure resource your project is in, they will be able to access your project in the CustomVision.ai portal. 


> [!NOTE]
> When you move your Custom Vision projects to an Azure resource, if you delete the Azure resource your project is in, your project will also be deleted. 


For a basic introduction to the concepts of Azure subscriptions and Azure resources, refer to the [Get started guide for Azure developers.](https://docs.microsoft.com/en-us/azure/guides/developer/azure-developer-guide#manage-your-subscriptions)


## Prerequisites

You will need a valid Azure subscription associated with the same Microsoft account or Azure Active Directory (AAD) account (“work or school”) account you use to log into CustomVision.ai. 

If you not have an Azure account, [create an account](https://azure.microsoft.com/free/) for free.


## Create a Custom Vision resources in the Azure Portal
To use Custom Vision Service with Azure, you will need to create Custom Vision Training and Prediction resources in the [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_azure_cognitiveservices_customvision#create/Microsoft.CognitiveServicesCustomVision). This will create both a Training and Prediction resource. 

> [!NOTE]
> To move your project using this CustomVision.ai website experience, you must create your resources in the US South Central region, because all Limited Trial projects are hosted in US South Central. 

Multiple projects can be associated to a single resource. More detail about [Pricing and Limits](https://docs.microsoft.com/en-us/azure/cognitive-services/custom-vision-service/limits-and-quotas) is available. To continue to use Custom Vision Service for free, you can select the F0 tier in the Azure Portal. 


## Move your Limited Trial project to an Azure resource

-	In your web browser, navigate to the [Custom Vision web page](https://customvision.ai) and select __Sign in__. Open the project you wish to migrate to an Azure account. 
-	Open the Settings page for your project by clicking on the gear icon on the top right hand corner of the screen. 

    ![Project settings is the gear icon at the top right of the project page.](./media/move-your-project-to-azure/settings-icon.png)


-	Click on __Move to Azure__.

![Move to Azure button is on the Project Settings page.](./media/move-your-project-to-azure/settings-icon.png)


-	From the dropdown on the __Move to Azure__ button, select the Azure resource you wish to move your project to. Click __Move__. 

-	If you do not see the Azure resource you created earlier for Custom Vision Service, it may be in another directory. To move your project to a resource in another directory, follow the instructions below. 

 ![Project Migration modal.](./media/move-your-project-to-azure/Project_Migration_Modal.jpg)


## Move your Limited Trial project to a resource in another directory 

> [!NOTE]
> In both the Azure Portal and CustomVision.ai, you can select your directory from the drop-down User menu at the top right corner of the screen.   


-	Identify which directory your Azure resource is in. You can find the directory listed under your user name at the top right of the Azure Portal menu bar. 

![Find your current directory.](./media/move-your-project-to-azure/identify_directory.png)

-	Find the Resource ID of your Custom Vision Training resource. You can find this in the Azure directory by opening your Custom Vision Training resource and selecting “Properties” under the “Resource Management” section. Your Resource ID will be there. 

![Find your ResourceID in the Azure Portal.](./media/move-your-project-to-azure/resource_ID_azure_portal.jpg)


Alternatively, you can find the Resource ID of your Custom Vision Resource directly in the Custom Vision website [Settings page]( https://www.customvision.ai/projects#/settings). You will need to switch to the same directory your Azure resource is in.

![Find your ResourceID in the CustomVision.ai site.](./media/move-your-project-to-azure/ resource_ID_CVS_portal.jpg)

-	Now that you have your resource ID, return to the Custom Vision project you are trying to move from a Limited Trial to an Azure resource. Reminder, you may need to switch back to your original directory to find it. Follow the instructions provided [above](https://docs.microsoft.com/en-us/azure/cognitive-services/custom-vision-service/move-your-project-to-azure#move-your Limited-Trial-project-to-a-resource-in-another-directory) to open your project settings page and select __Move to Azure__. 


-	In the Move to Azure window, check the box for “Move to a different Azure directory?”. Select the directory you want to move your project to and enter the Resource ID of the resource you are moving your project to. Click __Move__. 



-	Remember, your project is now in a different directory. To find your project, you will need to switch to the same directory on the Custom Vision web portal that your project is in. In both the Azure Portal and [customvision.ai](https://customvision.ai), you can select your directory from the drop-down account menu at the top right corner of the screen. 


