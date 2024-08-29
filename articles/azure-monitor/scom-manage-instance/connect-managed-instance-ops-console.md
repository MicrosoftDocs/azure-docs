---
ms.assetid: 
title: Connect the Azure Monitor SCOM Managed Instance to Operations console
description: This article describes how to connect the Azure Monitor SCOM Managed Instance to Operations console.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Connect the Azure Monitor SCOM Managed Instance to Operations console

Azure Monitor SCOM Managed Instance is compatible with [System Center Operations Manager 2022](https://www.microsoft.com/download/details.aspx?id=104038).

After you create the SCOM Managed Instance in Azure, connect the instance to Operations console to configure the workloads and monitor.

## Connect SCOM Managed Instance to Operations console

Follow the below steps to connect a SCOM Managed Instance to Operations console:

1. **Identify server to install Ops Console**: Identify a server where you want to install the Operations console. 
     >[!Note]
     >Don't perform this on a SCOM Managed Instance VM; do it on a separate VM. The VM needs to be a Windows Server. This server can be on-premises or on Azure.
     >- If the VM/machine is on-premises, set the NSG rules and firewall rules on the SCOM Managed Instance VNet and on the on-premises network where the VM/machine is located to ensure specified essential port (5724) is reachable.
     >- If the VM/machine is in Azure, set the NSG rules and firewall rules on the SCOM Managed Instance VNet and on the Virtual network (VNET) where the VM/machine is located to ensure specified essential port (5724) is reachable.
1. **Install the Ops Console**: From the [executable file](https://go.microsoft.com/fwlink/?linkid=2212475), install the Operations console and follow the installation wizard to successfully install the Operations console.
1. **Connect SCOM Managed Instance to Ops Console**: Sign in to the Operations console and select **Connect To Server**. Add the DNS name displayed at SCOM Managed Instance > **Overview** > **Properties** > **Load Balancer**.

## Next step

[Migrate from Operations Manager on-premises to Azure Monitor SCOM Managed Instance](migrate-to-operations-manager-managed-instance.md)


