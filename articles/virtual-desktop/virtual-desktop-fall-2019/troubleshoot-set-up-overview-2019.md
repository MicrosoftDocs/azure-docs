---
title: Azure Virtual Desktop (classic) troubleshooting overview - Azure
description: An overview for troubleshooting issues while setting up a Azure Virtual Desktop (classic) tenant environment.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 03/30/2020
ms.author: helohr
manager: femila
---
#  Azure Virtual Desktop (classic) troubleshooting overview, feedback, and support

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../troubleshoot-set-up-overview.md).

This article provides an overview of the issues you may encounter when setting up a Azure Virtual Desktop tenant environment and provides ways to resolve the issues.

## Provide feedback

Visit the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop) to discuss the Azure Virtual Desktop service with the product team and active community members.

## Escalation tracks

Use the following table to identify and resolve issues you may encounter when setting up a tenant environment using Remote Desktop client. Once your tenant's set up, you can use our new [Diagnostics service](diagnostics-role-service-2019.md) to identify issues for common scenarios.

>[!NOTE]
> We have a Tech Community forum which you can visit to discuss your issues with the product team and active community members. Visit the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop) to start a discussion.

| **Issue**                                                            | **Suggested Solution**  |
|----------------------------------------------------------------------|-------------------------------------------------|
| Creating a Azure Virtual Desktop tenant                                                    | If there's an Azure outage, [open an Azure support request](https://azure.microsoft.com/support/create-ticket/); otherwise [open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Azure Virtual Desktop** for the service, select **Deployment** for the problem type, then select **Issues creating a Azure Virtual Desktop tenant** for the problem subtype.|
| Accessing Marketplace templates in Azure portal       | If there's an Azure outage, [open an Azure support request](https://azure.microsoft.com/support/create-ticket/). <br> <br> Azure Marketplace Azure Virtual Desktop templates are freely available.|
| Accessing Azure Resource Manager templates from GitHub                                  | See the [Creating Azure Virtual Desktop session host VMs](troubleshoot-set-up-issues-2019.md#creating-azure-virtual-desktop-session-host-vms) section of [Tenant and host pool creation](troubleshoot-set-up-issues-2019.md). If the problem is still unresolved, contact the [GitHub support team](https://github.com/contact). <br> <br> If the error occurs after accessing the template in GitHub, contact [Azure Support](https://azure.microsoft.com/support/create-ticket/).|
| Session host pool Azure Virtual Network (VNET) and Express Route settings               | [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), then select the appropriate service (under the Networking category). |
| Session host pool Virtual Machine (VM) creation when Azure Resource Manager templates provided with Azure Virtual Desktop aren't being used | [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), then select **Virtual Machine running Windows** for the service. <br> <br> For issues with the Azure Resource Manager templates that are provided with Azure Virtual Desktop, see Creating Azure Virtual Desktop tenant section of [Tenant and host pool creation](troubleshoot-set-up-issues-2019.md). |
| Managing Azure Virtual Desktop session host environment from the Azure portal    | [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/). <br> <br> For management issues when using Remote Desktop Services/Azure Virtual Desktop PowerShell, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell-2019.md) or [open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Azure Virtual Desktop** for the service, select **Configuration and management** for the problem type, then select **Issues configuring tenant using PowerShell** for the problem subtype. |
| Managing Azure Virtual Desktop configuration tied to host pools and application groups (app groups)      | See [Azure Virtual Desktop PowerShell](troubleshoot-powershell-2019.md), or [open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Azure Virtual Desktop** for the service, then select the appropriate problem type.|
| Deploying and manage FSLogix Profile Containers | See [Troubleshooting guide for FSLogix products](/fslogix/fslogix-trouble-shooting-ht/) and if that doesn't resolve the issue, [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Azure Virtual Desktop** for the service, select **FSLogix** for the problem type, then select the appropriate problem subtype. |
| Remote desktop clients malfunction on start                                                 | See [Troubleshoot the Remote Desktop client](../troubleshoot-client-windows.md) and if that doesn't resolve the issue,  [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Azure Virtual Desktop** for the service, then select **Remote Desktop clients** for the problem type.  <br> <br> If it's a network issue, your users need to contact their network administrator. |
| Connected but no feed                                                                 | Troubleshoot using the [User connects but nothing is displayed (no feed)](troubleshoot-service-connection-2019.md#user-connects-but-nothing-is-displayed-no-feed) section of [Azure Virtual Desktop service connections](troubleshoot-service-connection-2019.md). <br> <br> If your users have been assigned to an application group,  [open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Azure Virtual Desktop** for the service, then select **Remote Desktop Clients** for the problem type. |
| Feed discovery problems due to the network                                            | Your users need to contact their network administrator. |
| Connecting clients                                                                    | See [Azure Virtual Desktop service connections](troubleshoot-service-connection-2019.md) and if that doesn't solve your issue, see [Session host virtual machine configuration](troubleshoot-vm-configuration-2019.md). |
| Responsiveness of applications or desktop                                      | If issues are tied to a specific application or product, contact the team responsible for that product. |
| Licensing messages or errors                                                          | If issues are tied to a specific application or product, contact the team responsible for that product. |
| Issues when using Azure Virtual Desktop tools on GitHub (Azure Resource Manager templates, diagnostics tool, management tool) | See [Azure Resource Manager Templates for Remote Desktop Services](https://github.com/Azure/RDS-Templates/blob/master/README.md) to report issues. |

## Next steps

- To troubleshoot issues while creating a tenant and host pool in a Azure Virtual Desktop environment, see [Tenant and host pool creation](troubleshoot-set-up-issues-2019.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration-2019.md).
- To troubleshoot issues with Azure Virtual Desktop client connections, see [Azure Virtual Desktop service connections](troubleshoot-service-connection-2019.md).
- To troubleshoot issues with Remote Desktop clients, see [Troubleshoot the Remote Desktop client](../troubleshoot-client-windows.md)
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell-2019.md).
- To learn more about the service, see [Azure Virtual Desktop environment](environment-setup-2019.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
- To learn about auditing actions, see [Audit operations with Resource Manager](../../azure-monitor/essentials/activity-log.md).
- To learn about actions to determine errors during deployment, see [View deployment operations](../../azure-resource-manager/templates/deployment-history.md).
