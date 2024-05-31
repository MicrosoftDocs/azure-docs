---
title: Resolve capacity errors
description: This article describes how to resolve possible capacity errors when attempting to deploy or scale Azure Database for PostgreSQL Flexible Server.
author: sachinpmsft
ms.author: kabharati
ms.reviewer: sachinpmsft, maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.custom:
  - references_regions
---

# Resolve capacity errors for Azure Database for PostgreSQL Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The article describes how you can resolve capacity errors when deploying or scaling Azure Database for PostgreSQL Flexible Server.


> [!IMPORTANT]
> For the list of regions that support Zone redundant high availability, please review the supported regions [here](./overview.md#azure-regions). 


## Exceeded quota 

If you encounter any of the following errors when attempting to deploy your Azure PostgreSQL Flexible Server resource, [submit a request to increase your quota](how-to-request-quota-increase.md).

- `Operation could not be completed as it results in exceeding approved {0} Cores quota. Additional details - Current Limit: {1}, Current Usage: {2}, Additional Required: {3}, (Minimum) New Limit Required: {4}.Submit a request for Quota increase by specifying parameters listed in the ‘Details’ section for deployment to succeed.`


## Subscription access

Your subscription may not have access to create a server in the selected region if your subscription isn't registered with the PostgreSQL resource provider (RP).  

If you see any of the following errors, [Register your subscription with the PostgreSQL RP](#register-with-postgresql-rp)] to resolve it.

- `Your subscription does not have access to create a server in the selected region.`

- `Provisioning is restricted in this region. Please choose a different region. For exceptions to this rule please open a support request with issue type of 'Service and subscription limits' `

- `Location 'region name' is not accepting creation of new Azure Database for PostgreSQL Flexible servers for the subscription 'subscription id' at this time`


## Enable region 

Your subscription may not have access to create a server in the selected region. To resolve this issue, file a  [request to access a region](how-to-request-quota-increase.md).

If you see the following errors, file a support ticket to enable the specific region: 
- `Subscription 'Subscription name' is not allowed to provision in 'region name`
-  `Subscriptions are restricted from provisioning in this region. Please choose a different region. For exceptions to this rule please open a support request with the Issue type of 'Service and subscription limits.`

## Availability Zone 

If you receive the following errors, select a different availability zone. 

- `Availability zone '{ID}' is not available for subscription '{Sub ID}' in this region temporarily due to capacity constraints.`
- `Multi-Zone HA is not supported in this region. Please choose a different region. For exceptions to this rule please open a support request with the Issue type of 'Service and subscription limits'.` 
`See https://review.learn.microsoft.com/en-us/azure/postgresql/flexible-server/how-to-request-quota-increase for more details.`

## SKU Not Available 

If you encounter the following error, select a different SKU type. Availability of SKU may differ across regions, either the specific SKU isn't supported in the region or temporarily unavailable.

`Specified SKU is not supported in this region. Please choose a different SKU.`

## Register with PostgreSQL RP

To deploy Azure Database for PostgreSQL Flexible resources, register your subscription with the PostgreSQL resource provider (RP). 

You can register your subscription using the Azure portal, [the Azure CLI](/cli/azure/install-azure-cli), or [Azure PowerShell](/powershell/azure/install-az-ps). 

# [Azure portal](#tab/portal)

To register your subscription in the Azure portal, follow these steps: 

 
1. In Azure portal, select **More services.**

1. Go to **Subscriptions** and select your subscription.

1. On the **Subscriptions** page, in the left hand pane under **Settings** select **Resource providers.**

1. Enter **PostgreSQL** in the filter to bring up the PostgreSQL-related extensions.

1. Select **Register**, **Re-register**, or **Unregister** for the **Microsoft.DBforPostgreSQL** provider, depending on your desired action.



   :::image type="content" source="./media/how-to-resolve-capacity-errors/register-postgresql-resource-provider.png" alt-text="Screenshot of Register PostgreSQL Resource Provider.":::

# [Azure CLI](#tab/bash)

To register your subscription using [the Azure CLI](/cli/azure/install-azure-cli), run this cmdlet:

```azurecli-interactive
# Register the PostgreSQL resource provider to your subscription 
az provider register --namespace Microsoft.DBforPostgreSQL 
```

# [Azure PowerShell](#tab/powershell)

To register your subscription using [Azure PowerShell](/powershell/azure/install-az-ps), run this cmdlet: 

```powershell-interactive
# Register the PostgreSQL resource provider to your subscription
Register-AzResourceProvider -ProviderNamespace Microsoft.DBforPostgreSQL

```

---

## Other provisioning issues

If you're still experiencing provisioning issues, open a **Region** access request under the support topic of Azure PostgreSQL Flexible Server and specify the vCores you want to utilize. 

## Azure Program regions 

Azure Program offerings (Azure Pass, Imagine, Azure for Students, MPN, BizSpark, BizSpark Plus, Microsoft for Startups / Sponsorship Offers, Microsoft Developer Network(MSDN) / Visual Studio Subscriptions) have access to a limited set of regions.

If your subscription is part of above offerings and you require access to any of the listed regions, submit an access request. Alternatively, you may opt for an alternate region: 

`Australia Central, Australia Central 2, Australia SouthEast, Brazil SouthEast, Canada East, China East, China North, China North 2, France South, Germany North, Japan West, Jio India Central, Jio India West, Korea South, Norway West, South Africa West, South India, Switzerland West, UAE Central, UK West, US DoD Central, US DoD East, US Gov Arizona, US Gov Texas, West Central US, West India.`


## Next steps

Once you submit your request, it undergoes review. You then receive a response based on the information provided in the form.

For more information about other Azure limits, see [Azure subscription and service limits, quotas, and constraints](/azure/azure-resource-manager/management/azure-subscription-service-limits).


