---
title: Pause and start your Power BI Embedded capacity in the Azure portal | Microsoft Docs
description: This article walks through how to pause and start a Power BI Embedded capacity in Microsoft Azure.
services: power-bi-embedded
documentationcenter: ''
author: guyinacube
manager: erikre
editor: ''
tags: ''

ms.service: power-bi-embedded
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: powerbi
ms.date: 09/28/2017
ms.author: asaxton
---
# Pause and start your Power BI Embedded capacity in the Azure portal

This article walks through how to pause and start a Power BI Embedded capacity in Microsoft Azure. This assumes you have created a Power BI Embedded capacity. If you have not, see [Create Power BI Embedded capacity in the Azure portal](create-capacity.md) to get started.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Pause your capacity

Pausing your capacity prevents you from being billed. Pausing your capacity is great if you do not need to use the capacity for a period of time. Use the following steps to pause your capacity.

> [!NOTE]
> Pausing a capacity may prevent content from being available within Power BI. Make sure to unassign workspaces from your capacity before pausing to prevent interruption.

1. Sign into the [Azure portal](https://portal.azure.com/).

2. Select **More services** > **Power BI Embedded** to see your capacities.

    ![More services within Azure portal](media/pause-start/azure-portal-more-services.png)

3. Select the capacity you want to pause.

    ![Power BI Embedded capacity list within Azure portal](media/pause-start/azure-portal-capacity-list.png)

4. Select **Pause** within the capacity details.

    ![Pause your capacity](media/pause-start/azure-portal-pause-capacity.png)

5. Select **Yes**, which confirms you want to pause the capacity.

    ![Confirm pause](media/pause-start/azure-portal-confirm-pause.png)

## Start your capacity

Resume usage by starting your capacity. Starting your capacity also resumes billing.

1. Sign into the [Azure portal](https://portal.azure.com/).

2. Select **More services** > **Power BI Embedded** to see your capacities.

    ![More services within Azure portal](media/pause-start/azure-portal-more-services.png)

3. Select the capacity you want to start.

    ![Power BI Embedded capacity list within Azure portal](media/pause-start/azure-portal-capacity-list.png)

4. Select **Start** within the capacity details.

    ![Start your capacity](media/pause-start/azure-portal-start-capacity.png)

5. Select **Yes**, which confirms you want to start the capacity.

    ![Confirm start](media/pause-start/azure-portal-confirm-start.png)

If any content is assigned to this capacity, it is available once started.

## Next steps

If you want to scale your capacity up or down, see [Scale your Power BI Embedded capacity](scale-capacity.md).

To begin embedding Power BI content within your application, see [How to embed your Power BI dashboards, reports and tiles](https://powerbi.microsoft.com/documentation/powerbi-developer-embedding-content/).

More questions? [Try asking the Power BI Community](http://community.powerbi.com/)