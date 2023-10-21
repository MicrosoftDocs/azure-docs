---
title: Azure Virtual Desktop PowerShell - Azure
description: How to troubleshoot issues with PowerShell when you set up a Azure Virtual Desktop environment.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 06/05/2020
ms.author: helohr 
ms.custom: devx-track-azurepowershell
manager: femila
---
# Azure Virtual Desktop PowerShell

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/troubleshoot-powershell-2019.md).

Use this article to resolve errors and issues when using PowerShell with Azure Virtual Desktop. For more information on Remote Desktop Services PowerShell, see [Azure Virtual Desktop PowerShell](/powershell/windows-virtual-desktop/overview).

## Provide feedback

Visit the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/bd-p/AzureVirtualDesktopForum) to discuss the Azure Virtual Desktop service with the product team and active community members.

## PowerShell commands used during Azure Virtual Desktop setup

This section lists PowerShell commands that are typically used while setting up Azure Virtual Desktop and provides ways to resolve issues that may occur while using them.

### Error: New-AzRoleAssignment: The provided information does not map to an AD object ID

```powershell
New-AzRoleAssignment -SignInName "admins@contoso.com" -RoleDefinitionName "Desktop Virtualization User" -ResourceName "0301HP-DAG" -ResourceGroupName 0301RG -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups'
```

**Cause:** The user specified by the *-SignInName* parameter can't be found in the Microsoft Entra tied to the Azure Virtual Desktop environment.

**Fix:** Make sure of the following things.

- The user should be synced to Microsoft Entra ID.
- The user shouldn't be tied to business-to-consumer (B2C) or business-to-business (B2B) commerce.
- The Azure Virtual Desktop environment should be tied to correct Microsoft Entra ID.

### Error: New-AzRoleAssignment: "The client with object id does not have authorization to perform action over scope (code: AuthorizationFailed)"

**Cause 1:** The account being used doesn't have Owner permissions on the subscription.

**Fix 1:** A user with Owner permissions needs to execute the role assignment. Alternatively, the user needs to be assigned to the User Access Administrator role to assign a user to an application group.

**Cause 2:** The account being used has Owner permissions but isn't part of the environment's Microsoft Entra ID or doesn't have permissions to query the Microsoft Entra ID where the user is located.

**Fix 2:** A user with Active Directory permissions needs to execute the role assignment.

### Error: New-AzWvdHostPool -- the location is not available for resource type

```powershell
New-AzWvdHostPool_CreateExpanded: The provided location 'southeastasia' is not available for resource type 'Microsoft.DesktopVirtualization/hostpools'. List of available regions for the resource type is 'eastus,eastus2,westus,westus2,northcentralus,southcentralus,westcentralus,centralus'.
```

Cause: Azure Virtual Desktop supports selecting the location of host pools, application groups, and workspaces to store service metadata in certain locations. Your options are restricted to where this feature is available. This error means that the feature isn't available in the location you chose.

Fix: In the error message, a list of supported regions will be published. Use one of the supported regions instead.

### Error: New-AzWvdApplicationGroup must be in same location as host pool

```powershell
New-AzWvdApplicationGroup_CreateExpanded: ActivityId: e5fe6c1d-5f2c-4db9-817d-e423b8b7d168 Error: ApplicationGroup must be in same location as associated HostPool
```

**Cause:** There's a location mismatch. All host pools, application groups, and workspaces have a location to store service metadata. Any objects you create that are associated with each other must be in the same location. For example, if a host pool is in `eastus`, then you also need to create the application groups in `eastus`. If you create a workspace to register these application groups to, that workspace needs to be in `eastus` as well.

**Fix:** Retrieve the location the host pool was created in, then assign the application group you're creating to that same location.

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while setting up your Azure Virtual Desktop environment and host pools, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues with Azure Virtual Desktop client connections, see [Azure Virtual Desktop service connections](troubleshoot-service-connection.md).
- To troubleshoot issues with Remote Desktop clients, see [Troubleshoot the Remote Desktop client](troubleshoot-client-windows.md)
- To learn more about the service, see [Azure Virtual Desktop environment](environment-setup.md).
- To learn about auditing actions, see [Audit operations with Resource Manager](../azure-monitor/essentials/activity-log.md).
- To learn about actions to determine the errors during deployment, see [View deployment operations](../azure-resource-manager/templates/deployment-history.md).
