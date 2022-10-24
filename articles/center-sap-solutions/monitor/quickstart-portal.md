---
title: Deploy Azure Monitor for SAP solutions with the Azure portal (preview)
description: Learn how to use a browser method for deploying Azure Monitor for SAP solutions.
author: sameeksha91
ms.author: sakhare
ms.topic: quickstart
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.date: 10/19/2022
# Customer intent: As a developer, I want to deploy Azure Monitor for SAP solutions in the Azure portal so that I can configure providers.
---

# Quickstart: deploy Azure Monitor for SAP solutions in Azure portal (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

Get started with Azure Monitor for SAP solutions by using the [Azure portal](https://azure.microsoft.com/features/azure-portal) to deploy Azure Monitor for SAP solutions resources and configure providers.

This content applies to both versions of the service, Azure Monitor for SAP solutions and Azure Monitor for SAP solutions (classic).

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Create Azure Monitor for SAP solutions monitoring resource

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In Azure **Search**, select **Azure Monitor for SAP solutions**.

    ![Diagram that shows Azure Monitor for SAP solutions Quick Start.](./media/azure-monitor-sap/azure-monitor-quickstart-1-new.png)



1. On the **Basics** tab, provide the required values. If applicable, you can use an existing Log Analytics workspace.
 

    ![Diagram that shows Azure Monitor for SAP solutions Quick Start 2.](./media/azure-monitor-sap/azure-monitor-quickstart-2-new.png)


## Create Azure Monitor for SAP solutions (classic) monitoring resource

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In Azure **Marketplace** or **Search**, select **Azure Monitor for SAP solutions (classic)**.

  ![Diagram shows Azure Monitor for SAP solutions classic quick start page.](./media/azure-monitor-sap/azure-monitor-quickstart-classic.png)


1. On the **Basics** tab, provide the required values. If applicable, you can use an existing Log Analytics workspace.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-2.png" alt-text="Screenshot that shows configuration options on the Basics tab." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-2.png":::

   When you're selecting a virtual network, ensure that the systems you want to monitor are reachable from within that virtual network. 

   > [!IMPORTANT]
   > Selecting **Share** for **Share data with Microsoft support** enables our support teams to help you with troubleshooting. This feature is available only for Azure Monitor for SAP solutions (classic)



## Next steps

Learn more about Azure Monitor for SAP solutions.

> [!div class="nextstepaction"]
> [Configure Azure Monitor for SAP solutions Providers](provider-netweaver.md)
