---
title: Deploy Azure Monitor for SAP Solutions with the Azure portal
description: Learn how to use a browser method for deploying Azure Monitor for SAP Solutions.
author: sameeksha91
ms.author: sakhare
ms.topic: how-to
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.date: 07/08/2021
---

# Deploy Azure Monitor for SAP Solutions by using the Azure portal

In this article, we'll walk through deploying Azure Monitor for SAP solutions (AMS) from the [Azure portal](https://azure.microsoft.com/features/azure-portal). Using the portal's browser-based interface, we'll deploy AMS and configure providers.

This content applies to both versions of the service, AMS and AMS (classic).
## Sign in to the portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create a monitoring resource

###### For Azure Monitor for SAP solutions

1. In Azure **Search box**, select **Azure Monitor for SAP solutions** 

![Azure Monitor for SAP solutions Quick Start](./media/azure-monitor-sap/azure-monitor-quickstart-1-new.png)

2. On the **Basics** tab, provide the required values. If applicable, you can use an existing Log Analytics workspace.
 
![Azure Monitor for SAP solutions Quick Start 2](./media/azure-monitor-sap/azure-monitor-quickstart-2-new.png)

###### For Azure Monitor for SAP solutions (Classic)

1. In Azure **Marketplace** or **Search**, select **Azure Monitor for SAP Solutions (Classic)**.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-1.png" alt-text="Screenshot that shows selecting the Azure Monitor for SAP solutions offer from Azure Marketplace." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-1.png":::

2. On the **Basics** tab, provide the required values. If applicable, you can use an existing Log Analytics workspace.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-2.png" alt-text="Screenshot that shows configuration options on the Basics tab." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-2.png":::

   When you're selecting a virtual network, ensure that the systems you want to monitor are reachable from within that virtual network. 

   > [!IMPORTANT]
   > Selecting **Share** for **Share data with Microsoft support** enables our support teams to help you with troubleshooting. This feature is available only for Azure Monitor for SAP solutions (Classic)



## Next steps

Learn more about Azure Monitor for SAP Solutions.

> [!div class="nextstepaction"]
> [Monitor SAP on Azure](monitor-sap-on-azure.md)
