---
title: Work with multiple tenants to Azure Sentinel for MSSP service providers | Microsoft Docs
description:  How to work with multiple tenants to Azure Sentinel for MSSP service providers.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/29/2020
ms.author: yelevin

---
# Manage multiple tenants in Azure Sentinel as an MSSP

If you're a managed security service provider (MSSP) and you're using [Azure Lighthouse](../lighthouse/overview.md) to offer security operations center (SOC) services to your customers, you can manage your customers' Azure Sentinel resources directly from your own Azure tenant, without having to connect to the customer's tenant. 

## Prerequisites

- [Onboard Azure Lighthouse](../lighthouse/how-to/onboard-customer.md)

- For this to work properly, your tenant (the MSSP tenant) must have the Azure Sentinel resource providers registered on at least one subscription. In addition, each of your customers' tenants must have the resource providers registered. If you and your customers have registered Azure Sentinel in your tenant, you are ready to get started. To verify registration, take the following steps:

    1. Select **Subscriptions** from the Azure portal, and then select a relevant subscription from the menu.

    1. From the navigation menu on the subscription screen, under **Settings**, select **Resource providers**.

    1. From the ***subscription name* | Resource providers** screen, search for and select *Microsoft.OperationalInsights* and *Microsoft.SecurityInsights*, and check the **Status** column. If the provider's status is *NotRegistered*, select **Register**.
    
        :::image type="content" source="media/multiple-tenants-service-providers/check-resource-provider.png" alt-text="Check resource providers":::

## How to access Azure Sentinel from other tenants

1. Under **Directory + subscription**, select the delegated directories, and the subscriptions where your customer's Azure Sentinel workspaces are located.

    :::image type="content" source="media/multiple-tenants-service-providers/directory-subscription.png" alt-text="Choose tenants and subscriptions":::

1. Open Azure Sentinel. You will see all the workspaces in the selected subscriptions, and you'll be able to work with them seamlessly, like any workspace in your own tenant.

> [!NOTE]
> You will not be able to deploy connectors in Azure Sentinel from within a managed workspace. To deploy a connector, you must directly sign into the tenant on which you want to deploy a connector, and authenticate there with the required permissions.

## Next steps

In this document, you learned how to manage multiple Azure Sentinel tenants seamlessly. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).

