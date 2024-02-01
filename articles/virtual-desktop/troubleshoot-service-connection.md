---
title: Troubleshoot service connection Azure Virtual Desktop - Azure
description: How to resolve issues while setting up service connections in an Azure Virtual Desktop tenant environment.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 10/15/2020
ms.author: helohr
manager: femila
---
# Azure Virtual Desktop service connections

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/troubleshoot-service-connection-2019.md).

Use this article to resolve issues with Azure Virtual Desktop client connections.

## Provide feedback

You can give us feedback and discuss the Azure Virtual Desktop Service with the product team and other active community members at the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/bd-p/AzureVirtualDesktopForum).

## User connects but nothing is displayed (no feed)

A user can start Remote Desktop clients and is able to authenticate, however the user doesn't see any icons in the web discovery feed.

1. Confirm that the user reporting the issues has been assigned to application groups by using this command line:

     ```powershell
     Get-AzRoleAssignment -SignInName <userupn>
     ```

2. Confirm that the user is signing in with the correct credentials.

3. If the web client is being used, confirm that there are no cached credentials issues.

4. If the user is part of a Microsoft Entra user group, make sure the user group is a security group instead of a distribution group. Azure Virtual Desktop doesn't support Microsoft Entra distribution groups.

## User loses existing feed and no remote resource is displayed (no feed)

This error usually appears after a user moved their subscription from one Microsoft Entra tenant to another. As a result, the service loses track of their user assignments, since those are still tied to the old Microsoft Entra tenant.

To resolve this, all you need to do is reassign the users to their application groups.

This could also happen if a CSP Provider created the subscription and then transferred to the customer. To resolve this re-register the Resource Provider.

1. Sign in to the Azure portal.
2. Go to **Subscription**, then select your subscription.
3. In the menu on the left side of the page, select **Resource provider**.
4. Find and select **Microsoft.DesktopVirtualization**, then select **Re-register**.

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating an Azure Virtual Desktop environment and host pool in an Azure Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues related to the Azure Virtual Desktop agent or session connectivity, see [Troubleshoot common Azure Virtual Desktop Agent issues](troubleshoot-agent.md).
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
