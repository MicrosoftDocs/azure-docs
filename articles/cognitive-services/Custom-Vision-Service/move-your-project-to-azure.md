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

# How to move your Limited Trial project to Azure

As Custom Vision Service completes its move to Azure, support for Limited Trial projects outside of Azure is ending. This document will show you how to use the Custom Vision APIs to copy your Limited Trial project to an Azure resource.

Support for viewing Limited Trial projects on the [Custom Vision website](https://customvision.ai) ended on March 25, 2019. This document now shows you how to use the Custom Vision APIs with a [migration python script](https://github.com/Azure-Samples/custom-vision-move-project) on GitHub) to duplicate your project to an Azure resource.

For more details, including key deadlines in the limited trial deprecation process, please refer to the [release notes](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/release-notes#february-25-2019) or to email communications sent to owners of limited trial projects.

The [migration script](https://github.com/Azure-Samples/custom-vision-move-project) allows you to recreate a project by downloading and then uploading all of the tags, regions, and images in your current iteration. It will leave you with a new project in your new subscription which you can then train.

## Prerequisites

- You will need a valid Azure subscription associated with the Microsoft account or Azure Active Directory (AAD) account you wish to use to log into the [Custom Vision website](https://customvision.ai). 
    - If you do not have an Azure account, [create an account](https://azure.microsoft.com/free/) for free.
    - For an introduction to the Azure concepts of subscriptions and resources, refer to the [Azure developer guide.](https://docs.microsoft.com/azure/guides/developer/azure-developer-guide#manage-your-subscriptions).
-  [Python](https://www.python.org/downloads/)
- [Pip](https://pip.pypa.io/en/stable/installing/)

## Create Custom Vision resources in the Azure portal

To use Custom Vision Service with Azure, you will need to create Custom Vision Training and Prediction resources in the [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_azure_cognitiveservices_customvision#create/Microsoft.CognitiveServicesCustomVision). 

Multiple projects can be associated to a single resource. More detail about [Pricing and Limits](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/limits-and-quotas) is available. To continue to use Custom Vision Service for free, you can select the F0 tier in the Azure portal. 

> [!NOTE]
> When you move your Custom Vision project to an Azure resource, it inherits the underlying [permissions]( https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal) of that Azure resource. If other users in your organization are owners of the Azure resource your project is in, they will be able to access your project on the [Custom Vision website](https://customvision.ai). Similarly, deleting your resources will delete your projects.  

## Find your limited trial project information

To move your project, you will need the _project ID_ and _training key_ for the project you are trying to migrate. If you do not have this information, visit [https://limitedtrial.customvision.ai/projects](https://limitedtrial.customvision.ai/projects) to obtain the ID and key for each of your projects. 

## Use the Python sample code to copy your project to Azure

Follow the [sample code instructions](https://github.com/Azure-Samples/custom-vision-move-project), using your limited trial key and project ID as the "source" materials, and the key from the new Azure resource you created as the "destination".

By default, all Limited Trial projects are hosted in South Central US Azure region.

## Next steps

Your project has now been moved to an Azure resource. You will need to update your Training and Prediction keys in any applications you have written.

To view your project on the [Custom Vision website](https://customvision.ai), sign in with the same account you used to sign into the Azure portal. If you do not see your project, please confirm that you are in the same directory in the [Custom Vision website](https://customvision.ai) as the directory where your resources are located in the Azure portal. In both the Azure portal and CustomVision.ai, you can select your directory from the drop-down User menu at the top-right corner of the screen.