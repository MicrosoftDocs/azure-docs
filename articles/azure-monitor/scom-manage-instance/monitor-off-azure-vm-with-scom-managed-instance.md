---
ms.assetid: 
title: Monitor Azure and Off-Azure Virtual machines with Azure Monitor SCOM Managed Instance
description: This article describes how it monitor Azure and Off-Azure virtual machines with SCOM Managed Instance.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.custom: linux-related-content
ms.topic: how-to
---

# Monitor Azure and Off-Azure Virtual machines with Azure Monitor SCOM Managed Instance

Azure Monitor SCOM Managed Instance provides a cloud-based alternative for Operations Manager users providing monitoring continuity for cloud and on-premises environments across the cloud adoption journey.

## SCOM Managed Instance Agent

In Azure Monitor SCOM Managed Instance, an agent is a service that is installed on a computer that looks for configuration data and proactively collects information for analysis and reporting, measures the health state of monitored objects like an SQL database or logical disk, and executes tasks on demand by an operator or in response to a condition. It allows SCOM Managed Instance to monitor Windows operating systems and the components installed on them, such as a website or an Active Directory domain controller.

## Supported scenarios

The following are the supported monitoring scenarios:

- Azure and Arc-enabled VMs
- On-premises agents that have Line of sight connectivity to Azure
- On-premises agents with no Line of sight connectivity (must use managed Gateway) to Azure

## Prerequisites

Following are the prerequisites required on desired monitoring endpoints:

1. Ensure to Allowlist the following Azure URL on the desired monitoring endpoints:
      `*.workloadnexus.azure.com`
2. Confirm the Line of sight between SCOM Managed Instance and desired monitoring endpoints by running the following command. Obtain LB DNS (Load balancer DNS) information by navigating to SCOM Managed Instance > **Overview** > **Properties** > **Load balancer** > **DNS Name**.

    ```    
    Test-NetConnection -ComputerName <Load balancer DNS> -Port 5723
    ```
3. Ensure to install [.NET Framework 4.7.2](https://support.microsoft.com/topic/microsoft-net-framework-4-7-2-offline-installer-for-windows-05a72734-2127-a15d-50cf-daf56d5faec2) or higher on desired monitoring endpoints.
4. Ensure TLS 1.2 or higher is enabled.

To Troubleshooting connectivity problems, see [Troubleshoot issues with Azure Monitor SCOM Managed Instance](/system-center/scom/troubleshoot-scom-managed-instance?view=sc-om-2022&preserve-view=true).

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

## Install Managed Gateway

To install Managed Gateway, [download the Gateway software](https://go.microsoft.com/fwlink/?linkid=2251997) and follow [these steps](/system-center/scom/deploy-install-gateway-server?view=sc-om-2022&tabs=InstallGatewayServer&preserve-view=true).
 
## Monitor Linux machine

With SCOM Managed Instance, you can monitor Linux workloads that are on-premises and behind a gateway server. At this stage, we don't support monitoring Linux VMs hosted in Azure. For more information, see [How to monitor on-premises Linux VMs](/system-center/scom/manage-deploy-crossplat-agent-console).
