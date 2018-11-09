---
title: Troubleshooting - QnAMaker 
titlesuffix: Azure Cognitive Services 
description: QnAMaker comprises of components hosted in the user's Azure account. Debugging may require users to manipulate their QnAMaker Azure resources or provide QnAMaker support team with additional information about their setup.
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/12/2018
ms.author: tulasim
---

# QnAMaker Troubleshooting
QnAMaker comprises of components hosted in the user's Azure account. Debugging may require users to manipulate their QnAMaker Azure resources or provide QnAMaker support team with additional information about their setup.

## How to get latest QnAMaker runtime updates
QnAMaker runtime is part of the Azure App Service deployed when you [create a QnAMaker service](./set-up-qnamaker-service-azure.md) in Azure portal. Updates are made periodically to the runtime. To apply the latest updates to apply to your QnAMaker setup, you must restart the App Service.
1. Go to your QnAMaker service (resource group) in the [Azure portal](https://portal.azure.com)

    ![QnAMaker Azure resource group](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-resourcegroup.png)

2. Click on the App Service and open the Overview section

     ![QnAMaker App Service](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-appservice.png)

3. Restart the App service. It should complete within a couple of seconds. Note that your downstream applications/bots build on this QnAMaker service will be unavailable to end-users during this restart period.

    ![QnAMaker appservice restart](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-appservice-restart.png)

## How to get the QnAMaker service hostname
QnAMaker service hostname is useful for debugging purposes when you contact QnAMaker Support or UserVoice. The hostname is a URL of this form: https://*{hostname}*.azurewebsites.net.
	
1. Go to your QnAMaker service (resource group) in the [Azure portal](https://portal.azure.com)

    ![QnAMaker Azure resource group](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-resourcegroup.png)

2. Click on the App Service

     ![QnAMaker App Service](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-appservice.png)

3. The hostname URL is available in the Overview section

    ![QnAMaker hostname](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-gethostname.png)
    

## Next steps

> [!div class="nextstepaction"]
> [Use QnAMaker API](./upgrade-qnamaker-service.md)
