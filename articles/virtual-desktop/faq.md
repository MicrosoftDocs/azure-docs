---
title: Windows Virtual Desktop FAQ - Azure
description: Frequently asked questions and best practices for Windows Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 08/11/2020
ms.author: helohr
manager: lizross
---
# Windows Virtual Desktop FAQ

This article answers frequently asked questions and explains best practices for Windows Virtual Desktop.

## What are the minimum admin permissions I need to manage objects?

If you want to create host pools and other objects, you must be assigned the Contributor role on the subscription or resource group you're working with.

You must be assigned the User Access Admin role on an app group to publish app groups to users or user groups.

To restrict an admin to only manage user sessions, such as sending messages to users, signing out users, and so on, you can create custom roles. For example:

```powershell
"actions": [
"Microsoft.Resources/deployments/operations/read",
"Microsoft.Resources/tags/read",
"Microsoft.Authorization/roleAssignments/read",
"Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/read",
"Microsoft.DesktopVirtualization/hostpools/sessionhosts/read",
"Microsoft.DesktopVirtualization/hostpools/sessionhosts/write",
"Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/write",
"Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/delete"
],
"notActions": [],
"dataActions": [],
"notDataActions": []
}
```

## Does Windows Virtual Desktop support split Azure Active Directory models?

When a user is assigned to an app group, the service does a simple Azure role assignment. As a result, the user’s Azure Active Directory (AD) and the app group’s Azure AD must be in the same location. All service objects, such as host pools, app groups, and workspaces, also must be in the same Azure AD as the user.

You can create virtual machines (VMs) in a different Azure AD as long as you sync the Active Directory with the user's Azure AD in the same virtual network (VNET).

## What are location restrictions?

All service resources have a location associated with them. A host pool’s location determines which geography the service metadata for the host pool is stored in. An app group can't exist without a host pool. If you add apps to a RemoteApp app group, you'll also need a session host to determine the start menu apps. For any app group action, you'll also need a related data access on the host pool. To make sure data isn't being transferred between multiple locations, the app group's location should be the same as the host pool's.

Workspaces also must be in the same location as their app groups. Whenever the workspace updates, the related app group updates along with it. Like with app groups, the service requires that all workspaces are associated with app groups created in the same location.

## How do you expand an object's properties in PowerShell?

When you run a PowerShell cmdlet, you only see the resource name and location.

For example:

```powershell
Get-AzWvdHostPool -Name 0224hp -ResourceGroupName 0224rg

Location Name   Type
-------- ----   ----
westus   0224hp Microsoft.DesktopVirtualization/hostpools
```

To see all of a resource's properties, add either `format-list` or `fl` to the end of the cmdlet.

For example:

```powershell
Get-AzWvdHostPool -Name 0224hp -ResourceGroupName 0224rg |fl
```

To see specific properties, add the specific property names after `format-list` or `fl`.

For example:

```powershell
Get-AzWvdHostPool -Name demohp -ResourceGroupName 0414rg |fl CustomRdpProperty

CustomRdpProperty : audiocapturemode:i:0;audiomode:i:0;drivestoredirect:s:;redirectclipboard:i:1;redirectcomports:i:0;redirectprinters:i:1;redirectsmartcards:i:1;screen modeid:i:2;
```

## Does Windows Virtual Desktop support guest users?

Windows Virtual Desktop doesn't support Azure AD guest user accounts. For example, let's say a group of guest users have Microsoft 365 E3 Per-user, Windows E3 Per-user, or WIN VDA licenses in their own company, but are guest users in a different company's Azure AD. The other company would manage the guest users' user objects in both Azure AD and Active Directory like local accounts.

You can't use your own licenses for the benefit of a third party. Also, Windows Virtual Desktop doesn't currently support Microsoft Account (MSA).

## Why don't I see the client IP address in the WVDConnections table?

We don't currently have a reliable way to collect the web client's IP addresses, so we don't include that value in the table.

## How does Windows Virtual Desktop handle backups?

There are multiple options in Azure for handling backup. You can use Azure backup, Site Recovery, and snapshots.

## Does Windows Virtual Desktop support third-party collaboration apps?

Windows Virtual Desktop is currently optimized for Teams. Microsoft currently doesn't support third-party collaboration apps like Zoom. Third-party organizations are responsible for giving compatibility guidelines to their customers. Windows Virtual Desktop also doesn't support Skype for Business.

## Can I change from pooled to personal host pools?

Once you create a host pool, you can't change its type. However, you can move any VMs you register to a host pool to a different type of host pool.

## What's the largest profile size FSLogix can handle?

Limitations or quotas in FSLogix depend on the storage fabric used to store user profile VHD(X) files.

The following table gives an example of how any resources an FSLogix profile needs to support each user. Requirements can vary widely depending on the user, applications, and activity on each profile.

| Resource | Requirement |
|---|---|
| Steady state IOPS | 10 |
| Sign in/sign out IOPS | 50 |

The example in this table is of a single user, but can be used to estimate requirements for the total number of users in your environment. For example, you'd need around 1,000 IOPS for 100 users, and around 5,000 IOPS during sign-in and sign-out.

## Is there a scale limit for host pools created in the Azure portal?

These factors can affect scale limit for host pools:

- The Azure template is limited to 800 objects. To learn more, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#template-limits). Each VM also creates about six objects, so that means you can create around 132 VMs each time you run the template.

- There are restrictions on how many cores you can create per region and per subscription. For example, if you have an Enterprise Agreement subscription, you can create 350 cores. You'll need to divide 350 by either the default number of cores per VM or your own core limit to determine how many VMs you can create each time you run the template. Learn more at [Virtual Machines limits - Azure Resource Manager](../azure-resource-manager/management/azure-subscription-service-limits.md#virtual-machines-limits---azure-resource-manager).

- The VM prefix name and the number of VMs is fewer than 15 characters. To learn more, see [Naming rules and restrictions for Azure resources](../azure-resource-manager/management/resource-name-rules.md#microsoftcompute).

## Can I manage Windows Virtual Desktop environments with Azure Lighthouse?

Azure Lighthouse doesn't fully support managing Windows Virtual Desktop environments. Since Lighthouse doesn't currently support cross-Azure AD tenant user management, Lighthouse customers still need to sign in to the Azure AD that customers use to manage users.

You also can't use CSP sandbox subscriptions with the Windows Virtual Desktop service. To learn more, see [Integration sandbox account](/partner-center/develop/set-up-api-access-in-partner-center#integration-sandbox-account).

Finally, if you enabled the resource provider from the CSP owner account, the CSP customer accounts won't be able to modify the resource provider.
