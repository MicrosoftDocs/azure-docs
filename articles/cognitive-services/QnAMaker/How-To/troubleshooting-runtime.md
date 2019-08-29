---
title: Troubleshooting - QnAMaker 
titleSuffix: Azure Cognitive Services 
description: QnAMaker comprises of components hosted in the user's Azure account. Debugging may require users to manipulate their QnAMaker Azure resources or provide QnAMaker support team with additional information about their setup.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 08/20/2019
ms.author: diberry
ms.custom: seodec18
---

# Troubleshooting tips to support the QnA Maker service and runtime

QnAMaker comprises resources hosted in the user's Azure subscription. Debugging may require users to manipulate their Azure QnAMaker resources or provide the QnAMaker support team with additional information about their setup.

## How to get latest QnAMaker runtime updates

The QnAMaker runtime is part of the Azure App Service deployed when you [create a QnAMaker service](./set-up-qnamaker-service-azure.md) in Azure portal. Updates are made periodically to the runtime. QnA Maker App Service is on auto-update mode after the Apr 2019 site extension release (version 5+). This is already designed to take care of ZERO downtime during upgrades. 

You can check your current version at https://www.qnamaker.ai/UserSettings. If your version is older than version 5.x, you must restart the App Service to apply the latest updates.

1. Go to your QnAMaker service (resource group) in the [Azure portal](https://portal.azure.com)

    ![QnAMaker Azure resource group](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-resourcegroup.png)

1. Click on the App Service and open the Overview section

     ![QnAMaker App Service](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-appservice.png)

1. Restart the App service. It should complete within a couple of seconds. Note that any dependent applications or bots that use this QnAMaker service will be unavailable to end-users during this restart period.

    ![QnAMaker appservice restart](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-appservice-restart.png)

## How to get the QnAMaker service hostname
QnAMaker service hostname is useful for debugging purposes when you contact QnAMaker Support or UserVoice. The hostname is a URL in this form: https://*{hostname}*.azurewebsites.net.
	
1. Go to your QnAMaker service (resource group) in the [Azure portal](https://portal.azure.com)

    ![QnAMaker Azure resource group in Azure portal](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-resourcegroup.png)

1. Select the App Service associated with the QnA Maker resource. Typically, the names are the same.

     ![Select QnAMaker App Service](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-appservice.png)

1. The hostname URL is available in the Overview section

    ![QnAMaker hostname](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-gethostname.png)
    

## Next steps

> [!div class="nextstepaction"]
> [Improve knowledge base questions with Active Learning](./improve-knowledge-base.md)
