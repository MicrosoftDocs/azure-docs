---
title: Overview of common issues while setting up Windows Virtual Desktop - Azure
description: An overview for resolving common issues while setting up a Windows Virtual Desktop tenant environment.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: troubleshoot
ms.date: 04/08/2019
ms.author: v-chjenk
---
# Overview of common issues when setting up Windows Virtual Desktop

This article provides an overview of common issues when setting up a Windows Virtual Desktop tenant environment and provides ways to resolve the issues.

## Provide feedback

We currently aren't taking support cases while Windows Virtual Desktop is in preview. Visit the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop) to discuss the Windows Virtual Desktop service with the product team and active community members.

## Escalation tracks

Use the following table to identify and resolve issues you may encounter when setting up a tenant environment using Remote Desktop client.

>[!NOTE]
>We currently aren't taking support cases while Windows Virtual Desktop is in preview. Whenever we refer to Windows Virtual Desktop support, go to our Tech Community forum for now. Visit the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop) to discuss issues with the product team and active community members. If you need to resolve a support issue, include the activity ID and approximate time frame for when the issue occurred.

| **Issue**                                                            | **Suggested Solution**  |
|----------------------------------------------------------------------|-------------------------------------------------|
| Creating a Tenant                                                    | If there's an Azure outage, contact [Azure Support](https://azure.microsoft.com/support/options/); otherwise contact **Remote Desktop Services/Windows Virtual Desktop support**.|
| Accessing Marketplace templates in Azure portal       | If there's an Azure outage, contact [Azure Support](https://azure.microsoft.com/support/options/). <br> <br> Azure Marketplace Windows Virtual Desktop templates are freely available.|
| Accessing Azure Resource Manager templates from GitHub                                  | See the "Creating Windows Virtual Desktop session host VMs" section of [Troubleshoot issues during initial setup of a Windows Virtual Desktop environment](troubleshoot-set-up-issues.md). If the problem is still unresolved, contact the [GitHub support team](https://github.com/contact). <br> <br> If the error occurs after accessing the template in GitHub, contact [Azure Support](https://azure.microsoft.com/support/options/).|
| Session host pool Azure Virtual Network (VNET) and Express Route settings               | Contact **Azure Support (Networking)**. |
| Session host pool Virtual Machine (VM) creation when Azure Resource Manager templates provided with Windows Virtual Desktop aren't being used | Contact **Azure Support (Compute)**. <br> <br> For issues with the Azure Resource Manager templates that are provided with Windows Virtual Desktop, see Creating Windows Virtual Desktop tenant section of [Troubleshoot issues during initial setup of a Windows Virtual Desktop environment](troubleshoot-set-up-issues.md). |
| Managing Windows Virtual Desktop session host environment from the Azure management portal    | Contact **Azure Support**. <br> <br> For management issues when using Remote Desktop Services/Windows Virtual Desktop PowerShell, see [Troubleshoot issues when using PowerShell with Windows Virtual Desktop](troubleshoot-powershell.md) or contact the **Remote Desktop Services/Windows Virtual Desktop support team**. |
| Managing Windows Virtual Desktop configuration tied to host pools and application groups (appgroups)      | See [Troubleshoot issues when using PowerShell with Windows Virtual Desktop](troubleshoot-powershell.md), or contact the **Remote Desktop Services/Windows Virtual Desktop support team**. <br> <br> If issues are tied to the sample graphical user interface (GUI), reach out to the Yammer community.|
| Remote desktop clients malfunction on start                                                 | See [Troubleshoot Windows Virtual Desktop client connection issues](troubleshoot-client-connection.md) and if that doesn't resolve the issue, contact **Remote Desktop Services/Windows Virtual Desktop support team**.  <br> <br> If it's a network issue, your users need to contact their network administrator. |
| Connected but no feed                                                                 | Troubleshoot using the "User connects but nothing is displayed (no feed)" section of [Troubleshoot Windows Virtual Desktop client connection issues](troubleshoot-client-connection.md). <br> <br> If your users have been assigned to an appgroup, escalate to the **Remote Desktop Services/Windows Virtual Desktop support team**. |
| Feed discovery problems due to the network                                            | Your users need to contact their network administrator. |
| Connecting clients                                                                    | See [Troubleshoot Windows Virtual Desktop client connection issues](troubleshoot-client-connection.md) and if that doesn't solve your issue, see [Troubleshoot Windows Virtual Desktop session host VM configuration](troubleshoot-vm-configuration.md). |
| Responsiveness of remote applications or desktop                                      | If issues are tied to a specific application or product, contact the team responsible for that product. |
| Licensing messages or errors                                                          | If issues are tied to a specific application or product, contact the team responsible for that product. |

## Next Steps

- To troubleshoot issues during initial setup of a Windows Virtual Desktop environment, see [Troubleshoot issues during initial setup of Windows Virtual Desktop](troubleshoot-set-up-issues.md).
- To troubleshoot issues with Windows Virtual Desktop VM configuration, see [Troubleshoot Windows Virtual Desktop session host VM configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues with Windows Virtual Desktop client connections, see [Troubleshoot Windows Virtual Desktop client connection issues](troubleshoot-client-connection.md).
- To troubleshoot issues when using PowerShell with Windows Virtual Desktop, see [Troubleshoot Windows Virtual Desktop issues when using PowerShell](troubleshoot-powershell.md).
- To learn more about the Preview service, see [Windows Desktop Preview environment](https://review.docs.microsoft.com/azure/virtual-desktop/environment-setup?branch=pr-en-us-71423).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-tutorial-troubleshoot).
- To learn about auditing actions, see [Audit operations with Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-audit).
- To learn about actions to determine the errors during deployment, see [View deployment operations](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-deployment-operations).