---
ms.assetid: 
title: About Azure Monitor SCOM Managed Instance
description: This article describes about Azure Monitor SCOM Managed Instance.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: overview
---

# About Azure Monitor SCOM Managed Instance

This article provides you with a quick service overview of Azure Monitor SCOM Managed Instance.

With the integration of SCOM Managed Instance, System Center Operations Manager functionality is now available on Azure.

SCOM Managed Instance is a cloud-based alternative for System Center Operations Manager customers. SCOM Managed Instance provides you with continuous monitoring of your workloads with minimal infrastructure management through migrations or after you enable Azure connectivity for your on-premises environments.

To know about the SCOM Managed Instance Architecture, see [Azure Monitor SCOM Managed Instance](overview.md#architecture).

## Key benefits

The key benefits of SCOM Managed Instance are:

- **Preserves investments in SCOM**: Allows you to preserve your existing System Center Operations Manager investments. SCOM Managed Instance is compatible with all the existing System Center Operations Manager management packs and provides a means to migrate management pack configurations from the on-premises setup.  

- **Simplifies System Center Operations Manager infrastructure management**: All the cloud connected System Center Operations Manager components are managed by Microsoft; removes the responsibility of hardware/software updates and security patches.  

- **Continues monitoring through migration**: Won't cause disruptions in monitoring while you migrate infrastructure or workloads from on-premises to the cloud. As you migrate from one UR to the next, you can migrate from your existing System Center Operations Manager setup.

- **Monitors workloads everywhere**:  SCOM Managed Instance is hosted in Azure with the capability of monitoring workloads running wherever they are (in Azure or on-premises) without the need for modification.

## Features

SCOM Managed Instance functionality allows you to:

- Configure an E2E System Center Operations Manager setup (SCOM Managed Instance) on Azure.
- Manage (view, delete) your SCOM Managed Instance in Azure.
- Connect to your SCOM Managed Instance using the System Center Operations Manager Ops console.
- Monitor workloads (wherever they're located) using the Ops, and while using your existing management packs.
- Incur zero database maintenance (Ops database and Data warehouse database) because of the offloading of database management to SQL Managed Instance (SQL MI).
- Scale your instance immediately without the need to add/delete physical servers.
- View your SCOM Managed Instance reports in Power BI.
- Patch your instance in one click with the latest bug fixes and features.

>[!NOTE]
>Azure Monitor SCOM Managed Instance doesn't support **Move Resource** functionality.

## Comparison of System Center Operations Manager on-premises with SCOM Managed Instance

SCOM Managed Instance has all the capabilities of System Center Operations Manager on-premises in a cloud-native way.  

The following table highlights the key differences between System Center Operations Manager on-premises and SCOM Managed Instance:  

|Scenario|Feature|Operations Manager on-premises|SCOM Managed Instance|
|---|---|---|---|
|Manageability of monitoring infrastructure|Patching|Update RollUps (URs) released every 6-7 months. Customer must spend days to update all the System Center Operations Manager components.|Auto operating system patches; System Center Operations Manager patches every 15-20 days. Patching done at the click of a button.|
|Manageability of monitoring infrastructure|Agent management|Manually managed by the customer.|Azure managed through VM extensions.|
|Manageability of monitoring infrastructure|Availability, Reliability, and Fault-Tolerance|Customer responsibility. No HA or BCDR promised by the product.|Instance-level availability and tolerance.|
|Manageability of monitoring infrastructure|Optimization and Scaling|Customer responsibility and heavy infrastructure.|Manually initiated from the portal at the click of a button.|
|Workload monitoring|Reuse of System Center Operations Manager management packs|All agent-based management packs are supported.|All agent-based management packs are supported.|
|Workload monitoring|Monitoring non-domain workloads|Supported via gateway servers.|Via gateway servers for off-Azure endpoints and via managed identify for Azure endpoints.|
|Workload monitoring|Monitoring Arc and multicloud workloads|Arc is not supported. Availability of Azure management pack.|Azure-based, Arc connected, and on-premises workloads.|
|Log collection and analysis|Query and analysis of observability data|Querying is possible.|Maintained in SQL managed instance. <br/> <br/> A first-class ability to channel data into the log analytics workspace to maintain a central data plane.
|Alerting|Real-time alerts for infra and apps|Alerting through System Center Operations Manager Ops console.|Integrated alerting with Azure Monitor.|
|Dashboarding|Basic reports about monitoring setup|SSRS-based reporting.|Built-in templates on Azure workbooks and dashboards for Azure Managed Grafana.|
|Dashboarding|App-specific reports|Customers must manually integrate with SquaredUp.|Partner published library of dashboards for Azure Managed Grafana.|

## Architecture

:::image type="SCOM Managed Instance architecture" source="media/operations-manager-managed-instance-overview/architecture.png" alt-text="Screenshot showing architecture.":::

A SCOM Managed Instance consists of two parts:
   - A Microsoft-managed part
   - A customer-managed part

### A Microsoft-managed part

A Microsoft-managed part consists of Management Servers and the [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview?view=azuresql&preserve-view=true) hosting an Operations database and Data Warehouse database. The Azure-hosted components can be managed directly from the Azure portal. At the backend, the components interact continuously with ARM and the RP to carry out Azure-based operations.


The databases hosted in the SQL MI allow formation and to view reports in Power BI. The Management Servers can be scaled up/down based on your requirements. When you create a new instance, you get one management server. The number changes depending on how you decide to scale your instance. You can update your management servers at the click of a button.

### A customer-managed part

A customer-managed part consists of Ops that are used to monitor and administer the instance. The agents to be monitored are under the customer domain, and if they are in another domain, a gateway server is needed to carry out the authentication. The customer-managed part hosts a DNS with a static IP that is provided to the Management Servers hosted in Azure.

**Detailed Architecture of SCOM Managed Instance**

:::image type="Detailed architecture" source="media/operations-manager-managed-instance-overview/detailed-scom-managed-instance-architecture-inline.png" alt-text="Screenshot of SCOM Managed Instance detailed architecture."lightbox="media/operations-manager-managed-instance-overview/detailed-scom-managed-instance-architecture-expanded.png":::

SCOM Managed Instance deploys and manages Operations Manager in customer subscription. It establishes connectivity to the on-premises monitored agents through VPN/Express Route.

In customer subscription, SCOM Managed Instance, creates a Virtual Machine Scale Set in a managed resource group and deploys Operations Manager on the Virtual Machine Scale Sets, which is front-loaded with Load Balancer for resiliency and elasticity. Operations Manager Management server connects to customer provided SQL MI for Database operations. Both SQL managed instance and Virtual Machine Scale Sets are created in different VNets and are joined to establish line of sight.

Operations Manager Management server and monitored agents are connected through ER/VPN. Agents establish session with Operations Manager Management server using the Kerberos authentication, where Operations Manager Virtual Machine Scale Sets VMs are joined to the AD domain of the monitored agents. 

## Next steps

  To create SCOM Managed Instance, follow these steps:

   - [Step 1. Register the SCOM Managed Instance resource provider](register-scom-managed-instance-resource-provider.md).
   - [Step 2. Create separate subnet in a VNet](create-separate-subnet-in-vnet.md).
   - [Step 3. Create a SQL Managed Instance](create-sql-managed-instance.md).
   - [Step 4. Create a Key vault](create-key-vault.md).
   - [Step 5. Create a user assigned identity](create-user-assigned-identity.md).
   - [Step 6. Create a computer group and gMSA account](create-group-managed-service-account.md).
   - [Step 7. Store domain credentials in Key vault](store-domain-credentials-key-vault.md).
   - [Step 8. Create a static IP](create-static-ip.md).
   - [Step 9. Configure the network firewall](configure-network-firewall.md).
   - [Step 10. Verify Azure and internal GPO policies](verify-azure-internal-group-policy-object-policies.md).
   - [Step 11. SCOM Managed Instance self-verification of steps](self-verification-steps.md).
   - [Step 12. Create a SCOM Managed Instance](create-operations-manager-managed-instance.md).

[Migrate from Operations Manager on-premises to Azure Monitor SCOM Managed Instance](migrate-to-operations-manager-managed-instance.md).