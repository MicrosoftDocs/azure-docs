---
title: Azure Virtual Desktop troubleshooting overview - Azure
description: An overview for troubleshooting issues while setting up an Azure Virtual Desktop environment.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 10/14/2021
ms.author: helohr
manager: femila
---
# Troubleshooting overview, feedback, and support for Azure Virtual Desktop

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/troubleshoot-set-up-overview-2019.md).

This article provides an overview of the issues you may encounter when setting up an Azure Virtual Desktop environment and provides ways to resolve the issues.

## Troubleshoot deployment and connection issues

[Azure Virtual Desktop Insights](insights.md) is a dashboard built on Azure Monitor workbooks that can quickly troubleshoot and identify issues in your Azure Virtual Desktop environment for you. If you prefer working with Kusto queries, we recommend using the built-in diagnostic feature, [Log Analytics](diagnostics-log-analytics.md), instead.

## Report issues

To report issues or suggest features for Azure Virtual Desktop with Azure Resource Manager integration, visit the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/bd-p/AzureVirtualDesktopForum). You can use the Tech Community to discuss best practices or suggest and vote for new features.

When you make a post asking for help or propose a new feature, make sure you describe your topic in as much detail as possible. Detailed information can help other users answer your question or understand the feature you're proposing a vote for.

## Escalation tracks

Before doing anything else, make sure to check the [Azure status page](https://azure.status.microsoft/status) and [Azure Service Health](https://azure.microsoft.com/features/service-health/) to make sure your Azure service is running properly.

Use the following table to identify and resolve issues you may encounter when setting up an environment using Remote Desktop client. Once your environment's set up, you can use our new [Diagnostics service]() to identify issues for common scenarios.

| **Issue**                                                            | **Suggested Solution**  |
|----------------------------------------------------------------------|-------------------------------------------------|
| Session host pool Azure Virtual Network (VNET) and Express Route settings               | [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), then select the appropriate service (under the Networking category). |
| Session host pool Virtual Machine (VM) creation when Azure Resource Manager templates provided with Azure Virtual Desktop aren't being used | [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), then select **Azure Virtual Desktop** for the service. <br> <br> For issues with the Azure Resource Manager templates that are provided with Azure Virtual Desktop, see Azure Resource Manager template errors section of [Host pool creation](troubleshoot-set-up-issues.md). |
| Managing Azure Virtual Desktop session host environment from the Azure portal    | [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/). <br> <br> For management issues when using Remote Desktop Services/Azure Virtual Desktop PowerShell, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md) or [open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Azure Virtual Desktop** for the service, select **Configuration and management** for the problem type, then select **Issues configuring environment using PowerShell** for the problem subtype. |
| Managing Azure Virtual Desktop configuration tied to host pools and application groups (app groups)      | See [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md), or [open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Azure Virtual Desktop** for the service, then select the appropriate problem type.|
| Deploying and manage FSLogix Profile Containers | See [Troubleshooting guide for FSLogix products](/fslogix/fslogix-trouble-shooting-ht/) and if that doesn't resolve the issue, [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Azure Virtual Desktop** for the service, select **FSLogix** for the problem type, then select the appropriate problem subtype. |
| Remote desktop clients malfunction on start                                                 | See [Troubleshoot the Remote Desktop client](troubleshoot-client-windows.md) and if that doesn't resolve the issue,  [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Azure Virtual Desktop** for the service, then select **Remote Desktop clients** for the problem type.  <br> <br> If it's a network issue, your users need to contact their network administrator. |
| Connected but no feed                                                                 | Troubleshoot using the [User connects but nothing is displayed (no feed)](troubleshoot-service-connection.md#user-connects-but-nothing-is-displayed-no-feed) section of [Azure Virtual Desktop service connections](troubleshoot-service-connection.md). <br> <br> If your users have been assigned to an application group,  [open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Azure Virtual Desktop** for the service, then select **Remote Desktop Clients** for the problem type. |
| Feed discovery problems due to the network                                            | Your users need to contact their network administrator. |
| Connecting clients                                                                    | See [Azure Virtual Desktop service connections](troubleshoot-service-connection.md) and if that doesn't solve your issue, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md). |
| Responsiveness of desktops or applications                                      | If issues are tied to a specific application or product, contact the team responsible for that product. |
| Licensing messages or errors                                                          | If issues are tied to a specific application or product, contact the team responsible for that product. |
| Issues with third-party authentication methods or tools | Verify that your third-party provider supports Azure Virtual Desktop scenarios and approach them regarding any known issues. |
| Issues using Log Analytics for Azure Virtual Desktop | For issues with the diagnostics schema, [open an Azure support request](https://azure.microsoft.com/support/create-ticket/).<br><br>For queries, visualization, or other issues in Log Analytics, select the appropriate problem type under Log Analytics. |
| Issues using Microsoft 365 apps | Contact the Microsoft 365 admin center with one of the [Microsoft 365 admin center help options](/microsoft-365/admin/contact-support-for-business-products/). |

## Next steps

- To troubleshoot issues while creating a host pool in an Azure Virtual Desktop environment, see [host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues related to the Azure Virtual Desktop agent or session connectivity, see [Troubleshoot common Azure Virtual Desktop Agent issues](troubleshoot-agent.md).
- To troubleshoot issues with Azure Virtual Desktop client connections, see [Azure Virtual Desktop service connections](troubleshoot-service-connection.md).
- To troubleshoot issues with Remote Desktop clients, see [Troubleshoot the Remote Desktop client](troubleshoot-client-windows.md)
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To learn more about the service, see [Azure Virtual Desktop environment](environment-setup.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
- To learn about auditing actions, see [Audit operations with Resource Manager](../azure-monitor/essentials/activity-log.md).
- To learn about actions to determine errors during deployment, see [View deployment operations](../azure-resource-manager/templates/deployment-history.md).