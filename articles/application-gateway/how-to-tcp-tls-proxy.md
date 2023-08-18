---
title: Direct SQL traffic with Azure Application Gateway (Preview)
titleSuffix: Azure Application Gateway
description: This article provides information on how to configure Application Gateway's layer 4 proxy service for non-HTTP workloads.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 08/21/2023
ms.author: greglin
---

# Direct SQL traffic with Azure Application Gateway (Preview)

To try out the layer 4 features of Azure Application Gateway, in this quick start article we use the Azure portal to create an Azure Application Gateway with SQL Server on Azure VMs as backend server. We also test the connectivity through an SQL client to make sure that the configuration works correctly. This simple setup guides you to create a listener with required port, a backend setting using layer 4 protocol, a routing rule, and add SQL VM to a backend pool. This article is divided into three parts.

> [!IMPORTANT]
> Application Gateway IPv6 frontend is currently in PREVIEW.<br>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Register to the preview

> [!NOTE]
> When you join the preview, all new Application Gateways provision with the ability to use layer 4 proxy features. If you wish to opt out from the new functionality and return to the current generally available functionality of Application Gateway, you can [unregister from the preview](#unregister-from-the-preview).

For more information about preview features, see [Set up preview features in Azure subscription](../azure-resource-manager/management/preview-features.md)

Use the following steps to enroll into the public preview for IPv6 Application Gateway using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the search box, enter _subscriptions_ and select **Subscriptions**.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/search.png" alt-text="Azure portal search.":::

3. Select the link for your subscription's name.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/subscriptions.png" alt-text="Select Azure subscription.":::

4. From the left menu, under **Settings** select **Preview features**.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/preview-features-menu.png" alt-text="Azure preview features menu.":::

5. You see a list of available preview features and your current registration status.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/preview-features-list.png" alt-text="Azure portal list of preview features.":::

6. From **Preview features** type into the filter box **AllowLayer4Proxy**, check the feature, and click **Register**.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/filter.png" alt-text="Azure portal filter preview features.":::

## Create a SQL server

First, create an SQL Server virtual machine (VM) using the Azure portal.

## Create an Application Gateway



## Connect to the SQL server



## Clean up resources



## Unregister from the preview



## Next steps

If you want to monitor the health of your backend pool, see [Backend health and diagnostic logs for Application Gateway](application-gateway-diagnostics.md).
