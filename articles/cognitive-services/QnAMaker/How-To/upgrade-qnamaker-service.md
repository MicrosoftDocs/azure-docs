---
title: Upgrade your QnA Maker service - QnA Maker
titleSuffix: Azure Cognitive Services
description: You can choose to upgrade individual components of the QnA Maker stack after the initial creation.
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/12/2018
ms.author: tulasim
---

# Upgrade your QnA Maker service
You can choose to upgrade individual components of the QnA Maker stack after the initial creation. See the details of the dependent components and SKU selection [here](https://aka.ms/qnamaker-docs-capacity).

## Upgrade QnA Maker Management SKU
To upgrade the QnA Maker management SKU:
1. Go to your QnA Maker resource in the Azure portal, and select **Pricing tier**.

    ![QnA Maker resource](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-resource.png)

2. Choose the appropriate SKU and press **Select**.

    ![QnA Maker pricing](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-pricing-page.png)

## Upgrade App service
You can [scale up](https://docs.microsoft.com/azure/app-service/web-sites-scale) or scale down the App service.

1. Go to the App service resource in the Azure portal, and select **scale up** or **scale down** options as required.

    ![QnA Maker app service scale](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-appservice-scale.png)

## Upgrade Azure Search service
Currently it is not possible to perform an in place upgrade of the Azure search SKU. However, you can create a new Azure search resource with the desired SKU, restore the data to the new resource, and then link it to the QnA Maker stack.

1. Create a new Azure search resource in the Azure portal, and choose the desired SKU.

    ![QnA Maker Azure search resource](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-azuresearch-new.png)

2. Restore the indexes from your original Azure search resource to the new one. See the backup restore sample code [here](https://github.com/pchoudhari/QnAMakerBackupRestore).

3. Once the data is restored, go to your new Azure search resource, select **Keys**, and note down the **Name** and the **Admin key**.

    ![QnA Maker Azure search keys](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-azuresearch-keys.png)

4. To link the new Azure search resource to the QnA Maker stack, go to the QnA Maker App service.

    ![QnA Maker appservice](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-resource-list-appservice.png)

5. Select **Application settings** and replace the **AzureSearchName** and **AzureSearchAdminKey** fields from step 3.

    ![QnA Maker appservice setting](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-appservice-settings.png)

6. Restart the App service.

    ![QnA Maker appservice restart](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-appservice-restart.png)

## Next steps

> [!div class="nextstepaction"]
> [Use QnA Maker API](../Quickstarts/csharp.md)
