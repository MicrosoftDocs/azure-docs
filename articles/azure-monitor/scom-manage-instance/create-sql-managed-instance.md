---
ms.assetid: 
title: Create an Azure SQL managed instance
description: This article describes how to create a SQL managed instance in a dedicated subnet of a virtual network.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Create an Azure SQL managed instance

This article describes how to create a SQL managed instance in a dedicated subnet of a virtual network. Peer your Azure Monitor SCOM Managed Instance subnet and Azure SQL Managed Instance subnet.

>[!NOTE]
> To learn about the SCOM Managed Instance architecture, see [Azure Monitor SCOM Managed Instance](overview.md).

## Create and configure a SQL managed instance

Before you create a SCOM Managed Instance, create a SQL managed instance. For more information, see [Create a SQL managed instance](/azure/azure-sql/managed-instance/instance-create-quickstart?view=azuresql&preserve-view=true).

>[!NOTE]
>You can reuse your existing SQL managed instance if that matches the requirement. However, you need to configure it to work for SCOM Managed Instance.

We recommend the following settings for creating a SQL managed instance:

- **Resource Group**: Create a new resource group for SQL Managed Instance. A best practice is to create a new resource group for large Azure resources.
- **Managed Instance name**: Choose a unique name. This name is used while you create a SCOM Managed Instance to refer to this SQL managed instance.
- **Region**: Choose the region close to you. There's no strict requirement on region for the instance, but we recommend the closest region for latency purposes.
- **Compute+Storage**: General Purpose (Gen5) with eight cores is the default. However, customers with less than 2000 workloads or customers who are validating SCOM Managed Instance in their test environments can use a SQL MI instance with four vCores.
- **Authentication Method**: Select **SQL Authentication**. Enter the credentials that you want to use for accessing the SQL managed instance. These credentials don't refer to any that you've created so far.

   >[!Note]
   >Choosing SQL Authentication mode is temporary. Later in [Step 5](/system-center/scom/create-user-assigned-identity?view=sc-om-2022#set-the-microsoft-entra-admin-value-in-the-sql-managed-instance&preserve-view=true) it will be updated to use Microsoft Entra ID with MSI.

- **VNet**: This SQL managed instance needs to have direct connectivity (line of sight) to the SCOM Managed Instance that you create in the future. Choose a virtual network that you'll eventually use for your SCOM Managed Instance. If you choose a different virtual network, ensure that it has connectivity to the SCOM Managed Instance virtual network by peering both the SCOM Managed Instance virtual network and the SQL Managed Instance virtual network.

   The subnet that you provide to SQL Managed Instance has to be dedicated (delegated) to the SQL managed instance. The provided subnet can't be used to house any other resources.

   By design, a managed instance needs a minimum of 32 IP addresses in a subnet. As a result, you can use a minimum subnet mask of /27 when you define your subnet IP ranges. For more information, see [Determine required subnet size and range for Azure SQL Managed Instance](/azure/azure-sql/managed-instance/vnet-subnet-determine-size?view=azuresql&preserve-view=true).
- **Connection Type**: By default, the connection type is **Proxy**.
- **Public Endpoint**: This setting can be either **Enabled** or **Disabled**. To use Power BI reporting, you need to enable the public endpoint.

  If the SQL Managed Instance virtual network is different from the SCOM Managed Instance virtual network:

  - Create an inbound NSG rule on the SQL Managed Instance subnet to allow traffic from the SCOM Managed Instance subnet to port 3342 and 1433 on the SQL Managed Instance subnet. For more information, see [Configure a public endpoint in Azure SQL Managed Instance](/azure/azure-sql/managed-instance/public-endpoint-configure?view=azuresql&preserve-view=true).
  - Peer your SQL Managed Instance virtual network with the one in which SCOM Managed Instance is present.

For the rest of the settings on the other tabs, you can leave them as default or change them according to your requirements.

> [!NOTE]
> Creation of a new SQL managed instance can take up to six hours.

## Next steps

- [Create a key vault ](create-key-vault.md)