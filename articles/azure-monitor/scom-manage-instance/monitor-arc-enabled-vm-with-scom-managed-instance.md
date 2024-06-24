---
ms.assetid: 
title: Monitor Azure and Off-Azure Virtual machines with Azure Monitor SCOM Managed Instance (preview)
description: Azure Monitor SCOM Managed Instance provides a cloud-based alternative for Operations Manager users providing monitoring continuity for cloud and on-premises environments across the cloud adoption journey.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Monitor Azure and Off-Azure Virtual machines with Azure Monitor SCOM Managed Instance (preview)

>[!NOTE]
>This feature is currently in preview.

Azure Monitor SCOM Managed Instance provides a cloud-based alternative for Operations Manager users providing monitoring continuity for cloud and on-premises environments across the cloud adoption journey.

## SCOM Managed Instance Agent

In Azure Monitor SCOM Managed Instance, an agent is a service that is installed on a computer that looks for configuration data and proactively collects information for analysis and reporting, measures the health state of monitored objects like an SQL database or logical disk, and executes tasks on demand by an operator or in response to a condition. It allows SCOM Managed Instance to monitor Windows operating systems and the components installed on them, such as a website or an Active Directory domain controller.

## Support for Azure and Off-Azure workloads

One of the most important monitoring scenarios is that of on-premises (off-Azure) workloads that unlock SCOM Managed Instance as a true **Hybrid monitoring solution**.

The following are the supported monitoring scenarios:

|Type of endpoint|Trust|Experience|
|---|---|---|
|Azure VM |Any type|Azure portal|
|Arc VM |Any type|Azure portal|
|Line of sight on-premises agent|Trusted|OpsConsole|
|Line of sight on-premises agent|Untrusted|Managed Gateway and OpsConsole|
|No Line of sight on-premises agent|Trusted/Untrusted|Managed Gateway and OpsConsole|

SCOM Managed Instance users will be able to:
- Monitor VMs and applications which are in untrusted domain/workgroup.
- Onboard endpoints (including Agent installation and setup) seamlessly from SCOM Managed Instance portal.
- Set up and manage Gateways seamlessly from SCOM Managed Instance portal on Arc-enabled servers for off-Azure monitoring.
- Set high availability at Gateway plane for agent failover as described in [Designing for High Availability and Disaster Recovery](/system-center/scom/plan-hadr-design).

## Linux monitoring with SCOM Managed Instance

With SCOM Managed Instance, you can monitor Linux workloads that are on-premises and behind a gateway server. At this stage, we don't support monitoring Linux VMs hosted in Azure. For more information, see [How to monitor on-premises Linux VMs](/system-center/scom/manage-deploy-crossplat-agent-console).

For more information, see [Azure Monitor SCOM Managed Instance frequently asked questions](scom-managed-instance-faq.yml).

## Use Arc channel for Agent configuration and monitoring data

Azure Arc can unlock connectivity and monitor on-premises workloads. Azure based manageability of monitoring agents for SCOM Managed Instance helps you to reduce operations cost and simplify agent configuration. The following are the key capabilities of SCOM Managed Instance monitoring over Arc channel:

- Discover and Install SCOM Managed Instance agent as a VM extension for Arc connected servers.
- Monitor Arc connected servers and hosted applications by reusing existing System Center Operations Manager management packs.
- Azure based SCOM Managed Instance agent management (such as patch, push management pack rules and monitors) via Arc connectivity.
- SCOM Managed Instance agents to relay monitoring data back to SCOM Managed Instance via Arc connectivity.

## Prerequisites

Following are the prerequisites required on desired monitoring endpoints that are Virtual machines:

1. Ensure to Allowlist the following Azure URL on the desired monitoring endpoints:
      `*.workloadnexus.azure.com`
2. Confirm the Line of sight between SCOM Managed Instance and desired monitoring endpoints by running the following command. Obtain LB DNS information by navigating to SCOM Managed Instance **Overview** > **DNS Name**.

    ```    
    Test-NetConnection -ComputerName <LB DNS> -Port 5723
    ```
3. Ensure to install [.NET Framework 4.7.2](https://support.microsoft.com/topic/microsoft-net-framework-4-7-2-offline-installer-for-windows-05a72734-2127-a15d-50cf-daf56d5faec2) or higher on desired monitoring endpoints.
4. Ensure TLS 1.2 or higher is enabled.

To Troubleshooting connectivity problems, see [Troubleshoot issues with Azure Monitor SCOM Managed Instance](/system-center/scom/troubleshoot-scom-managed-instance?view=sc-om-2022#scenario-agent-connectivity-failing&preserve-view=true).

## Install an agent to monitor Azure and Arc-enabled servers

>[!NOTE]
>Agent doesn't support multi-homing to multiple SCOM Managed Instances.

To install SCOM Managed Instance agent, follow these steps:

1. On the desired SCOM Managed Instance **Overview** page, under Manage, select **Monitored Resources**.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/manage-monitored-resources-inline.png" alt-text="Screenshot that shows the Monitored Resource option." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/manage-monitored-resources-expanded.png":::

2. On the **Monitored Resources** page, select **New Monitored Resource**.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/monitored-resources-inline.png" alt-text="Screenshot that shows the Monitored Resource page." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/monitored-resources-expanded.png":::

   **Add a Monitored Resource** page opens listing all the unmonitored virtual machines.
   
   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/add-monitored-resource-inline.png" alt-text="Screenshot that shows add a monitored resource page." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/add-monitored-resource-expanded.png":::

3. Select the desired resource and then select **Add**.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/add-resource-inline.png" alt-text="Screenshot that shows the Add a resource option." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/add-resource-expanded.png":::

4. On the **Install SCOM MI Agent** window, review the selections and select **Install**.
   
   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/install-inline.png" alt-text="Screenshot that shows Install option." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/install-expanded.png":::

## Manage agent configuration installed on Azure and Arc-enabled servers

### Upgrade an agent

To upgrade the agent version, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/). Search and select **SCOM Managed Instance**.
2. On the **Overview** page, under **Manage**, select **SCOM managed instances**.
3. On the **SCOM managed instances** page, select the desired SCOM managed instance.
4. On the desired SCOM Managed Instance **Overview** page, under **Manage**, select **Monitored Resources**.
5. On the **Monitored Resources** page, select Ellipsis button **(…)**, which is next to your desired monitored resource, and select **Configure**.
   
   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/resource-inline.png" alt-text="Screenshot that shows monitored resources." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/resource-expanded.png":::

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/configure-agent-inline.png" alt-text="Screenshot that shows agent configuration option." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/configure-agent-expanded.png":::

6. On the **Configure Monitored Resource** page, enable **Auto upgrade** and then select **Configure**.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/configure-monitored-resource-inline.png" alt-text="Screenshot that shows configuration option." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/configure-monitored-resource-expanded.png":::

### Delete an agent

To delete the agent version, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/). Search and select **SCOM Managed Instance**.
2. On the **Overview** page, under **Manage**, select **SCOM managed instances**.
3. On the **SCOM managed instances** page, select the desired SCOM Managed Instance.
4. On the desired SCOM Managed Instance **Overview** page, under **Manage**, select **Monitored Resources**.
5. On the **Monitored Resources** page, select Ellipsis button **(…)**, which is next to your desired monitored resource, and select **Delete**.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/delete-agent-inline.png" alt-text="Screenshot that shows delete agent option." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/delete-agent-expanded.png":::

6. On the **Delete SCOM MI Agent** page, check **Are you sure that you want to delete Monitored Resource?** and then select **Delete**.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/delete-monitored-resource-inline.png" alt-text="Screenshot that shows delete option." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/delete-monitored-resource-expanded.png":::

## Install SCOM Managed Instance Gateway

To install SCOM Managed Instance gateway, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/). Search and select **SCOM Managed Instance**.
2. On the **Overview** page, under **Manage**, select **SCOM managed instances**.
3. On the **SCOM managed instances** page, select the desired SCOM managed instance.
4. On the desired SCOM managed instance **Overview** page, under **Manage**, select **Managed Gateway**.
 
   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/managed-gateway-inline.png" alt-text="Screenshot that shows managed gateway." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/managed-gateway-expanded.png":::

5. On the **Managed Gateways** page, select **New Managed Gateway**.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/new-managed-gateway-inline.png" alt-text="Screenshot that shows new managed gateway." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/new-managed-gateway-expanded.png":::

   **Add a Managed Gateway** page opens listing all the Azure arc virtual machines.

    >[!NOTE]
    >SCOM Managed Instance Managed Gateway can be configured on Arc-enabled machines only.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/add-managed-gateway-inline.png" alt-text="Screenshot that shows add a managed gateway option." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/add-managed-gateway-expanded.png":::

6. Select the desired virtual machine and then select **Add**.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/add-inline.png" alt-text="Screenshot that shows Add managed gateway." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/add-expanded.png":::

7. On the **Install SCOM MI Gateway** window, review the selections and select **Install**.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/install-gateway-inline.png" alt-text="Screenshot that shows Install managed gateway page." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/install-gateway-expanded.png":::

## Manage Gateway configuration

### Configure monitoring of servers via SCOM Managed Instance Gateway

To configure monitoring of servers via SCOM Managed Instance Gateway, follow the steps mentioned in [Install an agent on a computer running Windows by using the Discovery Wizard](/system-center/scom/manage-deploy-windows-agent-console#install-an-agent-on-a-computer-running-windows-by-using-the-discovery-wizard) section.

>[!NOTE]
>Operations Manager Console is required for this action. For more information, see [Connect the Azure Monitor SCOM Managed Instance to Ops console](/system-center/scom/connect-managed-instance-ops-console?view=sc-om-2022&preserve-view=true)

### Delete a Gateway

To delete a Gateway, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/). Search and select **SCOM Managed Instance**.
2. On the **Overview** page, under **Manage**, select **SCOM managed instances**.
3. On the **SCOM managed instances** page, select the desired SCOM managed instance.
4. On the desired SCOM managed instance **Overview** page, under **Manage**, select **Managed Gateways**.
5. On the **Managed Gateways** page, select Ellipsis button **(…)**, which is next to your desired gateway, and select **Delete**.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/delete-gateway-inline.png" alt-text="Screenshot that shows delete gateway option." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/delete-gateway-expanded.png":::

6. On the **Delete SCOM MI Gateway** page, check **Are you sure that you want to delete Managed Gateway?** and then select **Delete**.

   :::image type="content" source="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/delete-managed-gateway-inline.png" alt-text="Screenshot that shows delete managed gateway option." lightbox="media/monitor-on-premises-arc-enabled-vm-with-scom-managed-instance/delete-managed-gateway-expanded.png":::


## Configure monitoring of on-premises servers

To configure monitoring of on-premises servers that have direct connectivity (VPN/ER) with Azure, follow the steps mentioned in [Install an agent on a computer running Windows by using the Discovery Wizard](/system-center/scom/manage-deploy-windows-agent-console#install-an-agent-on-a-computer-running-windows-by-using-the-discovery-wizard) section.

>[!NOTE]
>Operations Manager Console is required for this action. For more information, see [Connect the Azure Monitor SCOM Managed Instance to Ops console](/system-center/scom/connect-managed-instance-ops-console?view=sc-om-2022&preserve-view=true)