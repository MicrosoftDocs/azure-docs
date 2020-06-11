---
title: Windows Virtual Desktop troubleshooting overview - Azure
description: An overview for troubleshooting issues while setting up a Windows Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 06/05/2020
ms.author: helohr
manager: lizross
---
# Troubleshooting overview, feedback, and support

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/troubleshoot-set-up-overview-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an overview of the issues you may encounter when setting up a Windows Virtual Desktop environment and provides ways to resolve the issues.

## Report issues during public preview

To report issues or suggest features during public preview for the Spring 2020 release, visit the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop). You can use the Tech Community to discuss best practices or suggest and vote for new features. When you report an issue related to the public preview release, make sure to label the problem type as **Spring 2020 Update (Preview)**.

When you make a post asking for help or propose a new feature, make sure you describe your topic in as much detail as possible. Detailed information can help other users answer your question or understand the feature you're proposing a vote for.

## Escalation tracks

Before doing anything else, make sure to check the [Azure status page](https://status.azure.com/status) and [Azure Service Health](https://azure.microsoft.com/features/service-health/) to make sure your Azure service is running properly.

Use the following table to identify and resolve issues you may encounter when setting up an environment using Remote Desktop client. Once your environment's set up, you can use our new [Diagnostics service](diagnostics-role-service.md) to identify issues for common scenarios.

| **Issue**                                                            | **Suggested Solution**  |
|----------------------------------------------------------------------|-------------------------------------------------|
| Session host pool Azure Virtual Network (VNET) and Express Route settings               | [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), then select the appropriate service (under the Networking category). |
| Session host pool Virtual Machine (VM) creation when Azure Resource Manager templates provided with Windows Virtual Desktop aren't being used | [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), then select **Virtual Machine running Windows** for the service. <br> <br> For issues with the Azure Resource Manager templates that are provided with Windows Virtual Desktop, see Azure Resource Manager template errors section of [Host pool creation](troubleshoot-set-up-issues.md). |
| Managing Windows Virtual Desktop session host environment from the Azure portal    | [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/). <br> <br> For management issues when using Remote Desktop Services/Windows Virtual Desktop PowerShell, see [Windows Virtual Desktop PowerShell](troubleshoot-powershell.md) or [open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Windows Virtual Desktop** for the service, select **Configuration and management** for the problem type, then select **Issues configuring environment using PowerShell** for the problem subtype. |
| Managing Windows Virtual Desktop configuration tied to host pools and application groups (app groups)      | See [Windows Virtual Desktop PowerShell](troubleshoot-powershell.md), or [open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Windows Virtual Desktop** for the service, then select the appropriate problem type.|
| Deploying and manage FSLogix Profile Containers | See [Troubleshooting guide for FSLogix products](/fslogix/fslogix-trouble-shooting-ht/) and if that doesn't resolve the issue, [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Windows Virtual Desktop** for the service, select **FSLogix** for the problem type, then select the appropriate problem subtype. |
| Remote desktop clients malfunction on start                                                 | See [Troubleshoot the Remote Desktop client](troubleshoot-client.md) and if that doesn't resolve the issue,  [Open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Windows Virtual Desktop** for the service, then select **Remote Desktop clients** for the problem type.  <br> <br> If it's a network issue, your users need to contact their network administrator. |
| Connected but no feed                                                                 | Troubleshoot using the [User connects but nothing is displayed (no feed)](troubleshoot-service-connection.md#user-connects-but-nothing-is-displayed-no-feed) section of [Windows Virtual Desktop service connections](troubleshoot-service-connection.md). <br> <br> If your users have been assigned to an app group,  [open an Azure support request](https://azure.microsoft.com/support/create-ticket/), select **Windows Virtual Desktop** for the service, then select **Remote Desktop Clients** for the problem type. |
| Feed discovery problems due to the network                                            | Your users need to contact their network administrator. |
| Connecting clients                                                                    | See [Windows Virtual Desktop service connections](troubleshoot-service-connection.md) and if that doesn't solve your issue, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md). |
| Responsiveness of remote applications or desktop                                      | If issues are tied to a specific application or product, contact the team responsible for that product. |
| Licensing messages or errors                                                          | If issues are tied to a specific application or product, contact the team responsible for that product. |
| Issues with third-party authentication methods | Verify that your third-party provider supports Windows Virtual Desktop scenarios and approach them regarding any known issues. |
| Issues using Log Analytics for Windows Virtual Desktop | For issues with the diagnostics schema, [open an Azure support request](https://azure.microsoft.com/support/create-ticket/).<br><br>For queries, visualization, or other issues in Log Analytics, select the appropriate problem type under Log Analytics. |
| Issues using M365 apps | Contact the M365 admin center with one of the [M365 admin center help options](/microsoft-365/admin/contact-support-for-business-products/). |

## Next steps

- To troubleshoot issues while creating a host pool in a Windows Virtual Desktop environment, see [host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Windows Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues with Windows Virtual Desktop client connections, see [Windows Virtual Desktop service connections](troubleshoot-service-connection.md).
- To troubleshoot issues with Remote Desktop clients, see [Troubleshoot the Remote Desktop client](troubleshoot-client.md)
- To troubleshoot issues when using PowerShell with Windows Virtual Desktop, see [Windows Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To learn more about the service, see [Windows Virtual Desktop environment](environment-setup.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
- To learn about auditing actions, see [Audit operations with Resource Manager](../azure-resource-manager/management/view-activity-logs.md).
- To learn about actions to determine errors during deployment, see [View deployment operations](../azure-resource-manager/templates/deployment-history.md).
