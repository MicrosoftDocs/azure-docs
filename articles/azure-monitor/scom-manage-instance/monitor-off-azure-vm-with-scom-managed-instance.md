---
ms.assetid: 
title: Monitor Off-Azure Virtual machines with Azure Monitor SCOM Managed Instance
description: This article describes how it monitor Azure and Off-Azure virtual machines with SCOM Managed Instance.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 07/17/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Monitor Off-Azure Virtual machines with Azure Monitor SCOM Managed Instance

Azure Monitor SCOM Managed Instance provides a cloud-based alternative for Operations Manager users providing monitoring continuity for cloud and on-premises environments across the cloud adoption journey.

## SCOM Managed Instance Agent

In Azure Monitor SCOM Managed Instance, an agent is a service that is installed on a computer that looks for configuration data and proactively collects information for analysis and reporting, measures the health state of monitored objects like an SQL database or logical disk, and executes tasks on demand by an operator or in response to a condition. It allows SCOM Managed Instance to monitor Windows operating systems and the components installed on them, such as a website or an Active Directory domain controller.

## Support for Azure and Off-Azure workloads

One of the most important monitoring scenarios is that of on-premises (off-Azure) workloads that unlock SCOM Managed Instance as a true **Hybrid monitoring solution**.

The following are the supported monitoring scenarios:

|Type of endpoint|Trust|Experience|
|---|---|---|
|Line of sight on-premises agent|Trusted|OpsConsole|
|Line of sight on-premises agent|Untrusted|Managed Gateway and OpsConsole|
|No Line of sight on-premises agent|Trusted/Untrusted|Managed Gateway and OpsConsole|

SCOM Managed Instance users will be able to:

- Set up and manage Gateways on Arc-enabled servers from SCOM Managed Instance portal.
- Set high availability at Gateway plane for agent failover as described in [Designing for High Availability and Disaster Recovery](/system-center/scom/plan-hadr-design).


## Supported scenarios

The following are the supported monitoring scenarios:

- On-premises virtual machines with no Line of sight connectivity (must use managed Gateway) to Azure
- On-premises virtual machines that have Line of sight connectivity to Azure

## Prerequisites

Following are the prerequisites required on desired monitoring endpoints:

1. Confirm the Line of sight between SCOM Managed Instance and desired monitoring endpoints by running the following command. Obtain LB DNS (Load balancer DNS) information by navigating to SCOM Managed Instance > **Overview** > **Properties** > **Load balancer** > **DNS Name**.

    ```    
    Test-NetConnection -ComputerName <Load balancer DNS> -Port 5723
    ```
2. Ensure to install [.NET Framework 4.7.2](https://support.microsoft.com/topic/microsoft-net-framework-4-7-2-offline-installer-for-windows-05a72734-2127-a15d-50cf-daf56d5faec2) or higher on desired monitoring endpoints.
3. Ensure TLS 1.2 or higher is enabled.

To Troubleshooting connectivity problems, see [Troubleshoot issues with Azure Monitor SCOM Managed Instance](troubleshoot-scom-managed-instance.md).

## Install SCOM Managed Instance Gateway

Managed Gateway can be installed on Arc-enabled servers enabling it to relay monitoring data from air-gapped and network isolated servers to SCOM Managed Instance.

To install SCOM Managed Instance gateway, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/). Search and select **SCOM Managed Instance**.
2. On the **Overview** page, under **Manage**, select **SCOM managed instances**.
3. On the **SCOM managed instances** page, select the desired SCOM managed instance.
4. On the desired SCOM managed instance **Overview** page, under **Manage**, select **Managed Gateway**.
5. On the **Managed Gateways** page, select **New Managed Gateway**.

   :::image type="content" source="media/monitor-off-azure-vm-with-scom-managed-instance/new-managed-gateway-inline.png" alt-text="Screenshot that shows new managed gateway." lightbox="media/monitor-off-azure-vm-with-scom-managed-instance/new-managed-gateway-expanded.png":::

   **Add a Managed Gateway** page opens listing all the Azure arc virtual machines.

    >[!NOTE]
    >SCOM Managed Instance Managed Gateway can be configured on Arc-enabled machines only.

   :::image type="content" source="media/monitor-off-azure-vm-with-scom-managed-instance/add-managed-gateway-inline.png" alt-text="Screenshot that shows add a managed gateway option." lightbox="media/monitor-off-azure-vm-with-scom-managed-instance/add-managed-gateway-expanded.png":::

6. Select the desired virtual machine and then select **Add**.

   :::image type="content" source="media/monitor-off-azure-vm-with-scom-managed-instance/add-inline.png" alt-text="Screenshot that shows Add managed gateway." lightbox="media/monitor-off-azure-vm-with-scom-managed-instance/add-expanded.png":::

7. On the **Add Monitored Resources** window, review the selections and select **Add**.

   :::image type="content" source="media/monitor-off-azure-vm-with-scom-managed-instance/install-gateway-inline.png" alt-text="Screenshot that shows Install managed gateway page." lightbox="media/monitor-off-azure-vm-with-scom-managed-instance/install-gateway-expanded.png":::

### Delete a Gateway

To delete a Gateway, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/). Search and select **SCOM Managed Instance**.
2. On the **Overview** page, under **Manage**, select **SCOM managed instances**.
3. On the **SCOM managed instances** page, select the desired SCOM managed instance.
4. On the desired SCOM managed instance **Overview** page, under **Manage**, select **Managed Gateways**.
5. On the **Managed Gateways** page, select Ellipsis button **(…)**, which is next to your desired gateway, and select **Delete**.

   :::image type="content" source="media/monitor-off-azure-vm-with-scom-managed-instance/delete-gateway-inline.png" alt-text="Screenshot that shows delete gateway option." lightbox="media/monitor-off-azure-vm-with-scom-managed-instance/delete-gateway-expanded.png":::

6. On the **Delete SCOM MI Gateway** page, check **Are you sure that you want to delete Managed Gateway?** and then select **Delete**.

   :::image type="content" source="media/monitor-off-azure-vm-with-scom-managed-instance/delete-managed-gateway-inline.png" alt-text="Screenshot that shows delete managed gateway option." lightbox="media/monitor-off-azure-vm-with-scom-managed-instance/delete-managed-gateway-expanded.png":::

## Managed Gateway configuration

### Configure monitoring of servers via SCOM Managed Instance Gateway

To configure monitoring of air-gapped and network isolated servers through Managed Gateway, follow the steps mentioned in [Install an agent on a computer running Windows by using the Discovery Wizard](/system-center/scom/manage-deploy-windows-agent-console#install-an-agent-on-a-computer-running-windows-by-using-the-discovery-wizard) section. Download and install agent from [here](https://go.microsoft.com/fwlink/?linkid=2251996).

>[!NOTE]
>Operations Manager Console is required for this action. For more information, see [Connect the Azure Monitor SCOM Managed Instance to Ops console](connect-managed-instance-ops-console.md).

## Install agent for Windows virtual machine

To install agent for Windows virtual machine, [download](https://go.microsoft.com/fwlink/?linkid=2251996) and follow these steps.

Before you use either method to manually deploy the agent, ensure the following conditions are met:

- The account that is used to run MSI must have administrative privileges on the computer on which you're installing agent.

- Each agent that is installed with the Setup Wizard or from the command line must be approved by a management group. For more information, see [Process Manual Agent Installations](/system-center/scom/manage-process-manual-agent-install).

- SCOM Managed Instance must be configured to accept agents installed with MSI, or they'll be automatically rejected and therefore not display in the Operations console. For more information, see [Process Manual Agent Installations](/system-center/scom/manage-process-manual-agent-install). If the managed instance is configured to accept manually installed agents after the agents have been manually installed, the agents will display in the console after approximately one hour.

Follow these steps to deploy the SCOM Managed Instance agent with the Agent Setup Wizard:

1. Use local administrator privileges to sign in to the computer where you want to install the agent.

2. On the Operations Manager installation media, double-click **Setup.exe**.

3. In **Optional Installations**, select **Local agent**.

4. On the **Welcome** page, select **Next**.

5. On the **Important Notice** page, review the Microsoft software license terms and select **I Agree**.

6. On the **Destination Folder** page, leave the installation folder set to the default, or select **Change** and type a path, and select **Next**.

7. On the **Agent Setup Options** page, you can choose whether you want to **connect the agent to Operations Manager**.

8. On the **Management Group Configuration** page, do the following:

    a. Enter the name of the SCOM Managed Instance name in the **Management Group Name** field and the Load Balancer DNS name in the **Management Server** field.

     > [!NOTE]
     > To use a gateway server, enter the gateway server name in the **Management Server** text box.

    b. Enter a value for **Management Server Port**, or leave the default of 5723.

    c. Enter **Next**.

9. On the **Agent Action Account** page, leave it set to the default of **Local System**, or select **Domain or Local Computer Account**; enter the **User Account**, **Password**, and **Domain or local computer**; and select **Next**.

10. On the **Ready to Install** page, review the settings and select **Install** to display the **Installing Microsoft Monitoring Agent** page.

11. When the **Completing the Microsoft Monitoring Agent Setup Wizard** page appears, select **Finish**.

## Configure monitoring of on-premises servers

To configure monitoring of on-premises servers that have direct connectivity (VPN/ER) with Azure, follow the steps mentioned in [Install an agent on a computer running Windows by using the Discovery Wizard](/system-center/scom/manage-deploy-windows-agent-console#install-an-agent-on-a-computer-running-windows-by-using-the-discovery-wizard) section.

>[!NOTE]
>Operations Manager Console is required for this action. For more information, see [Connect the Azure Monitor SCOM Managed Instance to Ops console](connect-managed-instance-ops-console.md).
