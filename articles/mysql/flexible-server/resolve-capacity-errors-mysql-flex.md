---
title: Resolve capacity errors
description: The article describes how you can resolve capacity errors when deploying or scaling Azure Database for MySQL - Flexible Server.
author: karla-escobar
ms.author: karlaescobar
ms.reviewer: maghan
ms.date: 02/29/2024
ms.service: mysql
ms.subservice: flexible-server
ms.topic: troubleshooting
---

# Resolve capacity errors for Azure Database for MySQL - Flexible Server

The article describes how you can resolve capacity errors when deploying or scaling Azure Database for MySQL - Flexible Server.

## Exceeded quota

If you encounter any of the following errors when attempting to deploy your Azure MySQL - Flexible Server resource, [submit a request to increase your quota](how-to-request-quota-increase.md).

- `Operation could not be completed as it results in exceeding approved {0} Cores quota. Additional details - Current Limit: {1}, Current Usage: {2}, Additional Required: {3}, (Minimum) New Limit Required: {4}.Submit a request for Quota increase by specifying parameters listed in the 'Details' section for deployment to succeed.`

## Subscription access

Your subscription might not have access to create a server in the selected region if your subscription isn't registered with the MySQL resource provider (RP).

If you see any of the following errors, [Register your subscription with the MySQL RP](#register-with-mysql-rp) to resolve it.

- `Your subscription does not have access to create a server in the selected region.`

- `Provisioning is restricted in this region. Please choose a different region. For exceptions to this rule please open a support request with issue type of 'Service and subscription limits'`

- `Location 'region name' is not accepting creation of new Azure Database for MySQL - Flexible servers for the subscription 'subscription id' at this time`

## Enable region

Your subscription might not have access to create a server in the selected region. To resolve this issue, [file a support request to access a region](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

If you see the following errors, file a support ticket to enable the specific region:
- `Subscription 'Subscription name' is not allowed to provision in 'region name`
-  `Subscriptions are restricted from provisioning in this region. Please choose a different region. For exceptions to this rule please open a support request with the Issue type of 'Service and subscription limits.`

## Availability Zone

If you receive the following errors, select a different availability zone.

- `Availability zone '{ID}' is not available for subscription '{Sub ID}' in this region temporarily due to capacity constraints.`
- `Multi-Zone HA is not supported in this region. Please choose a different region. For exceptions to this rule please open a support request with the Issue type of 'Service and subscription limits'.`

## SKU Not Available

If you encounter the following error, select a different SKU type. Availability of SKU might differ across regions, either the specific SKU isn't supported in the region or temporarily unavailable.

`Specified SKU is not supported in this region. Please choose a different SKU.`

## Register with MySQL RP

To deploy Azure Database for MySQL - Flexible Server resources, register your subscription with the MySQL resource provider (RP).

You can register your subscription using the Azure portal, [the Azure CLI](/cli/azure/install-azure-cli), or [Azure PowerShell](/powershell/azure/install-azure-powershell).

#### [Azure portal](#tab/portal)

To register your subscription in the Azure portal, follow these steps:

1. In Azure portal, select **More services.**

1. Go to **Subscriptions** and select your subscription.

1. On the **Subscriptions** page, in the left hand pane under **Settings** select **Resource providers.**

1. Enter **MySQL** in the filter to bring up the MySQL related extensions.

1. Select **Register**, **Re-register**, or **Unregister** for the **Microsoft.DBforMySQL** provider, depending on your desired action.
   :::image type="content" source="media/resolve-capacity-errors-mysql-flex/resource-provider-screen.png" alt-text="Screenshot of register mysql resource provider screen." lightbox="media/resolve-capacity-errors-mysql-flex/resource-provider-screen.png":::

#### [Azure CLI](#tab/azure-cli-b)

To register your subscription using [the Azure CLI](/cli/azure/install-azure-cli), run this cmdlet:

```azurecli-interactive
# Register the MySQL resource provider to your subscription
az provider register --namespace Microsoft.DBforMySQL
```

#### [Azure PowerShell](#tab/powershell)

To register your subscription using [Azure PowerShell](/powershell/azure/install-az-ps), run this cmdlet:

```powershell-interactive
# Register the MySQL resource provider to your subscription
Register-AzResourceProvider -ProviderNamespace Microsoft.DBforMySQL
```

---

## Other provisioning issues

If you're still experiencing provisioning issues, open a **Region** access request under the support topic of Azure Database for MySQL - Flexible Server and specify the vCores you want to utilize.

## Azure Program regions

Azure Program offerings (Azure Pass, Imagine, Azure for Students, MPN, BizSpark, BizSpark Plus, Microsoft for Startups / Sponsorship Offers, Microsoft Developer Network(MSDN) / Visual Studio Subscriptions) have access to a limited set of regions.

If your subscription is part of above offerings and you require access to any of the listed regions, submit an access request. Alternatively, you might opt for an alternate region:

`Australia Central, Australia Central 2, Australia SouthEast, Brazil SouthEast, Canada East, China East, China North, China North 2, France South, Germany North, Japan West, Jio India Central, Jio India West, Korea South, Norway West, South Africa West, South India, Switzerland West, UAE Central, UK West, US DoD Central, US DoD East, US Gov Arizona, US Gov Texas, West Central US, West India.`

## Related content

- [Azure subscription and service limits, quotas, and constraints](/azure/azure-resource-manager/management/azure-subscription-service-limits)
