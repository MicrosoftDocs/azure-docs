---
ms.assetid: 
title: Monitor Azure and Off-Azure Virtual machines with Azure Monitor SCOM Managed Instance extensions.
description: Azure Monitor SCOM Managed Instance provides a cloud-based alternative for Operations Manager users providing monitoring continuity for cloud and on-premises environments across the cloud adoption journey.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 07/05/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Monitor Azure and Off-Azure Virtual machines with Azure Monitor SCOM Managed Instance extensions

Azure Monitor SCOM Managed Instance provides a cloud-based alternative for Operations Manager users providing monitoring continuity for cloud and on-premises environments across the cloud adoption journey.

## SCOM Managed Instance Agent

In Azure Monitor SCOM Managed Instance, an agent is a service that is installed on a computer that looks for configuration data and proactively collects information for analysis and reporting, measures the health state of monitored objects like an SQL database or logical disk, and executes tasks on demand by an operator or in response to a condition. It allows SCOM Managed Instance to monitor Windows operating systems and the components installed on them, such as a website or an Active Directory domain controller.

In Azure Monitor SCOM Managed Instance, monitoring agent is installed and managed by Azure Virtual Machine Extensions, named **SCOMMI-Agent-Windows**. For more information on VM extensions, see [Azure Virtual Machine extensions and features](/azure/virtual-machines/extensions/overview).

## Supported Windows versions for monitoring

Following are the supported Windows versions that can be monitored using SCOM Managed Instance:

- Windows 2022
- Windows 2019
- Windows 2016
- Windows 2012 R2
- Windows 2012

For more information, see [Operations Manager System requirements](/system-center/scom/system-requirements).

## Use Arc channel for Agent configuration and monitoring data

Azure Arc can unlock connectivity and monitor on-premises workloads. Azure based manageability of monitoring agents for SCOM Managed Instance helps you to reduce operations cost and simplify agent configuration. The following are the key capabilities of SCOM Managed Instance monitoring over Arc channel:

- Discover and Install SCOM Managed Instance agent as a VM extension for Arc connected servers.
- Monitor Arc connected servers and hosted applications by reusing existing System Center Operations Manager management packs.
- Monitor Arc connected servers and applications, which are in untrusted domain/workgroup.  
- Azure based SCOM Managed Instance agent management (such as patch, push management pack rules and monitors) via Arc connectivity.

## Prerequisites

Following are the prerequisites required to monitor Virtual machines:

1. Line of sight to Nexus endpoint.
   For example, `Test-NetConnection -ComputerName westus.workloadnexus.azure.com -Port 443`
2. Line of sight to SCOMMI LB
   For example, `Test-NetConnection -ComputerName <LBDNS> -Port 5723`
3. Ensure to install [.NET Framework 4.7.2](https://support.microsoft.com/topic/microsoft-net-framework-4-7-2-offline-installer-for-windows-05a72734-2127-a15d-50cf-daf56d5faec2) or higher on desired monitoring endpoints.

To Troubleshooting connectivity problems, see [Troubleshoot issues with Azure Monitor SCOM Managed Instance](/system-center/scom/troubleshoot-scom-managed-instance?view=sc-om-2022#scenario-agent-connectivity-failing&preserve-view=true).

## Install an agent to monitor Azure and Arc-enabled servers

>[!NOTE]
>Agent doesn't support multihoming to multiple SCOM Managed Instances.

To install SCOM Managed Instance agent, follow these steps:

1. On the desired SCOM Managed Instance **Overview** page, under Manage, select **Monitored Resources**.

2. On the **Monitored Resources** page, select **New Monitored Resource**.

   :::image type="content" source="media/monitor-azure-off-azure-vm-with-scom-managed-instance/monitored-resources-inline.png" alt-text="Screenshot that shows the Monitored Resource page." lightbox="media/monitor-azure-off-azure-vm-with-scom-managed-instance/monitored-resources-expanded.png":::

   **Add a Monitored Resource** page opens listing all the unmonitored virtual machines.
   
   :::image type="content" source="media/monitor-azure-off-azure-vm-with-scom-managed-instance/add-monitored-resource-inline.png" alt-text="Screenshot that shows add a monitored resource page." lightbox="media/monitor-azure-off-azure-vm-with-scom-managed-instance/add-monitored-resource-expanded.png":::

3. Select the desired resource and then select **Add**.

   :::image type="content" source="media/monitor-azure-off-azure-vm-with-scom-managed-instance/add-resource-inline.png" alt-text="Screenshot that shows the Add a resource option." lightbox="media/monitor-azure-off-azure-vm-with-scom-managed-instance/add-resource-expanded.png":::

4. On the **Add Monitored Resources** window, enable **Auto upgrade**, review the selections and select **Add**.
   
   :::image type="content" source="media/monitor-azure-off-azure-vm-with-scom-managed-instance/install-inline.png" alt-text="Screenshot that shows Install option." lightbox="media/monitor-azure-off-azure-vm-with-scom-managed-instance/install-expanded.png":::

## Manage agent configuration installed on Azure and Arc-enabled servers

### Upgrade an agent

>[!NOTE]
>Upgrading an agent is a one time effort for existing monitored resources. Further updates will be applied automatically to these resources. For new resources, you can choose this option when you add them to the SCOM Managed Instance.

To upgrade the agent version, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/). Search and select **SCOM Managed Instance**.
2. On the **Overview** page, under **Manage**, select **SCOM managed instances**.
3. On the **SCOM managed instances** page, select the desired SCOM managed instance.
4. On the desired SCOM Managed Instance **Overview** page, under **Manage**, select **Monitored Resources**.
5. On the **Monitored Resources** page, select Ellipsis button **(…)**, which is next to your desired monitored resource, and select **Configure**.
   
   :::image type="content" source="media/monitor-azure-off-azure-vm-with-scom-managed-instance/resource-inline.png" alt-text="Screenshot that shows monitored resources." lightbox="media/monitor-azure-off-azure-vm-with-scom-managed-instance/resource-expanded.png":::

   :::image type="content" source="media/monitor-azure-off-azure-vm-with-scom-managed-instance/configure-agent-inline.png" alt-text="Screenshot that shows agent configuration option." lightbox="media/monitor-azure-off-azure-vm-with-scom-managed-instance/configure-agent-expanded.png":::

6. On the **Configure Monitored Resource** page, enable **Auto upgrade** and then select **Configure**.

   :::image type="content" source="media/monitor-azure-off-azure-vm-with-scom-managed-instance/configure-monitored-resource-inline.png" alt-text="Screenshot that shows configuration option." lightbox="media/monitor-azure-off-azure-vm-with-scom-managed-instance/configure-monitored-resource-expanded.png":::

### Remove an agent

To remove the agent version, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/). Search and select **SCOM Managed Instance**.
2. On the **Overview** page, under **Manage**, select **SCOM managed instances**.
3. On the **SCOM managed instances** page, select the desired SCOM Managed Instance.
4. On the desired SCOM Managed Instance **Overview** page, under **Manage**, select **Monitored Resources**.
5. On the **Monitored Resources** page, select Ellipsis button **(…)**, which is next to your desired monitored resource, and select **Remove**.

   :::image type="content" source="media/monitor-azure-off-azure-vm-with-scom-managed-instance/delete-agent-inline.png" alt-text="Screenshot that shows delete agent option." lightbox="media/monitor-azure-off-azure-vm-with-scom-managed-instance/delete-agent-expanded.png":::

6. On the **Remove Monitored Resources** page, enter *remove* under **Enter "remove" to confirm "removal"** and then select **Remove**.

   :::image type="content" source="media/monitor-azure-off-azure-vm-with-scom-managed-instance/delete-monitored-resource-inline.png" alt-text="Screenshot that shows delete option." lightbox="media/monitor-azure-off-azure-vm-with-scom-managed-instance/delete-monitored-resource-expanded.png":::

## Multihome On-premises virtual machines

Multihoming allows you to monitor on-premises virtual machines by retaining the existing connection with Operations Manager (On-premises) and establishing a new connection with SCOM Managed Instance. When a virtual machine that is monitored by Operations Manager (on-premises) is multihomed with SCOM Managed Instance, the Azure extensions replace existing monitoring agent (*Monagent.msi*) with the latest version of SCOM Managed Instance agent. During this operation, the connection to Operations Manager (on-premises) is retained automatically to ensure continuity in monitoring process.

>[!Note]
>- To multihome your on-premises your virtual machines, they must be Arc-enabled.
>- Multihome with Operations Manager is supported only using Kerberos authentication.
>- Multihome is limited only to two connections, one with SCOM Managed Instance and another with Operations Manager. A virtual machine cannot be multihomed to multiple Operations Manager Management Groups or multiple SCOM Managed Instances.

### Multihome supported scenarios

Multihome is supported with the following Operations Manager versions using the SCOM Managed Instance extension-based agent:

| -|Operations Manager 2012|Operations Manager 2016|Operations Manager 2019|Operations Manager 2022|
|---|---|---|---|---|
|Supported |✅|✅|✅|✅|

>[!NOTE]
>Agents (Monagent) that are installed by Operations Manager (on-premises) aren't supported to multihome with SCOM Managed Instance.
