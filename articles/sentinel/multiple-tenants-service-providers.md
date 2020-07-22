---
title: Work with multiple tenants to Azure Sentinel for MSSP service providers| Microsoft Docs
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
ms.date: 09/23/2019
ms.author: yelevin

---
# Work with multiple tenants in Azure Sentinel 

If you're a managed security service provider (MSSP) and you're using [Azure Lighthouse](../lighthouse/overview.md) to manage your customers' security operations centers (SOC), you will be able to manage your customers' Azure Sentinel resources without connecting directly to the customer's tenant, from your own Azure tenant. 

## Prerequisites
- [Onboard Azure Lighthouse](../lighthouse/how-to/onboard-customer.md)
- For this to work properly, your tenant must be registered to the Azure Sentinel Resource Provider on at least one subscription. If you have a registered Azure Sentinel in your tenant, you are ready to get started. If not, select **Subscriptions** from the Azure portal, followed by **Resource providers**.  Then, from the **SOC - Resource providers** screen, search for and select `Microsoft.OperationalInsights` and `Microsoft.SecurityInsights`, and select **Register**.
   ![Check resource providers](media/multiple-tenants-service-providers/check-resource-provider.png)
## How to access Azure Sentinel from other tenants
1. Under **Directory + subscription**, select the delegated directories, and the subscriptions where your customer's Azure Sentinel workspaces are located.

   ![Generate security incidents](media/multiple-tenants-service-providers/directory-subscription.png)

1. Open Azure Sentinel. You will see all the workspaces in the selected subscriptions, and you'll be able to work with them seamlessly, like any workspace in your own tenant.

> [!NOTE]
> You will not be able to deploy connectors in Azure Sentinel from within a managed workspace. To deploy a connector, you must directly sign into the tenant on which you want to deploy a connector and authenticate there with the required permissions.





## Next steps
In this document, you learned how to manage multiple Azure Sentinel tenants seamlessly. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).

