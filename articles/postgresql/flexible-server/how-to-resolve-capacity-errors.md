---
title: Resolve capacity errors - Azure Database for PostgreSQL Flexible Server
description: This article describes how to resolve possible capacity errors when attempting to deploy or scale Azure Database for PostgreSQL Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.author: kabharati    
author: kabharati
ms.reviewer: sachinp
ms.topic: how-to
ms.date: 01/25/2024
ms.custom: references_regions
---

# Resolve capacity errors for Azure Database for PostgreSQL Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The article describes how you can resolve capacity errors when deploying or scaling Azure Database for PostgreSQL Flexible Server.


> [!IMPORTANT]
> For the list of regions that support Zone redundant high availability, please review the supported regions [here](./overview.md#azure-regions). 


## Exceeded quota 

If you encounter any of the following errors when attempting to deploy your Azure PostgreSQL Flexible Server resource, [request to increase your quota](how-to-request-quota-increase.md).

- `Operation could not be completed as it results in exceeding approved {0} Cores quota.` 
`Additional details - Current Limit: {1}, Current Usage: {2}, Additional Required: {3}, (Minimum) New Limit Required: {4}. Submit a request for Quota increase by specifying parameters listed in the ‘Details’ section for deployment to succeed.`


## Subscription access

Your subscription may not have access to create a server in the selected region if your subscription is not registered with the PostgreSQL resource provider (RP).  

If you see the following errors, please [register your subscription with the PostgreSQL RP](#register-with-postgresql-rp)]
- `Your subscription does not have access to create a server in the selected region.`
- `Provisioning is restricted in this region. Please choose a different region. For exceptions to this rule please open a support request with issue type of 'Service and subscription limits' `
- `Location 'region name' is not accepting creation of new Azure Database for PostgreSQL Flexible servers for the subscription 'subscription id' at this time`


## Enable region 

Your subscription may not have access to create a server in the selected region if that region has not been enabled for your subscription. To resolve this, file a  [request to access a region](how-to-request-quota-increase.md). for your subscription. 

If you see the following errors, file a support ticket to enable a specific region: 
- `Subscription 'Subscription name' is not allowed to provision in 'region name`
-  `Subscriptions are restricted from provisioning in this region. Please choose a different region. For exceptions to this rule please open a support request with Issue type of 'Service and subscription limits.`


## SKU Not Available 


## Register with PostgreSQL RP

To deploy Azure Database for PostgreSQL Flexible resources, register your subscription with the PostgreSQL resource provider (RP). 

You can register your subscription using the Azure portal, [the Azure CLI](/cli/azure/install-azure-cli), or [Azure PowerShell](/powershell/azure/install-az-ps). 

# [Azure portal](#tab/portal)

To register your subscription in the Azure portal, follow these steps: 

1. Open the Azure portal and go to **All Services**.
1. Go to **Subscriptions** and select your subscription.
1. On the **Subscriptions** page, in the left hand pane under **Settings** select **Resource providers** 
1. Enter **PostgreSQL** in the filter to bring up the PostgreSQL-related extensions.
1. Select **Register**, **Re-register**, or **Unregister** for the  **Microsoft.DBforPostgreSQL** provider, depending on your desired action.

   :::image type="content" source="./media/how-to-resolve-capacity-errors/register-postgresql-resource-provider.png" alt-text="Register PostgreSQL Resource Provider":::

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

## Additional provisioning issues

If you're still experiencing provisioning issues, please open a **Region** access request under the support topic of SQL Database and specify the DTU or vCores you want to consume on Azure SQL Database or Azure SQL Managed Instance. 

## Azure Program regions 

Azure Program offerings (Azure Pass, Imagine, Azure for Students, MPN, BizSpark, BizSpark Plus, Microsoft for Startups / Sponsorship Offers, Visual Studio Subscriptions / MSDN) have access to a limited set of regions. 

If your subscription is part of an Azure Program offering, and you would like to request access to any of the following regions, please consider using an alternate region instead: 

_Australia Central, Australia Central 2, Australia SouthEast, Brazil SouthEast, Canada East, China East, China North, China North 2, France South, Germany North, Japan West, JIO India Central, JIO India West, Korea South, Norway West, South Africa West, South India, Switzerland West, UAE Central , UK West, US DoD Central, US DoD East, US Gov Arizona, US Gov Texas, West Central US, West India._ 

After you submit your request, it will be reviewed. You will be contacted with an answer based on the information you provided in the form.

For more information about other Azure limits, see [Azure subscription and service limits, quotas, and constraints](/azure/azure-resource-manager/management/azure-subscription-service-limits).


## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)