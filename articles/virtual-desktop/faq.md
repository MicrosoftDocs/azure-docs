---
title: Windows Virtual Desktop FAQ - Azure
description: Frequently asked questions and best practices for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 06/01/2020
ms.author: helohr
manager: lizross
---
# Windows Virtual Desktop FAQ

This article answers frequently asked questions and explains best practices for Windows Virtual Desktop.

## What are the minimum admin permissions I need to manage objects?

If you want to create host pools and other objects, you must be assigned the Contributor role on the subscription or resource group you're working with.

You need to be assigned the User Access Admin role on an app group to publish app groups to users or user groups.

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

When a user is assigned to an app group, the service performs a simple Azure role-based access control (RBAC) role assignment. As a result, the user’s Azure Active Directory (AD) and the app group’s Azure AD need to be in the same location. All service objects, such as host pools, app groups, and workspaces, also need to be in the same Azure AD as the user.

You can create virtual machines (VMs) in a different Azure AD as long as the Active Directory is synced with the user's Azure AD in the same virtual network (VNET).

## What are location restrictions?

All service resources have a location associated with them. A host pool’s location determines the geography where the service metadata for the host pool is stored. An appgroup cannot existing without a host pool. If you add apps in a remoteapp app group, a session host is needed to determine the start menu apps. This means that for an appgroup action, some kind of related data access is needed on the host pool. So the service imposes that the app group’s location needs to be the same as the host pool to ensure that data is not transferred between multiple geos.

Workspace has the same restriction. It is a collection of appgroups. Anytime a workspace is updated, the related appgroup will be updated. Similar to the above case, to ensure that all data is maintained with a geography, the service imposes the restriction that a workspace can only be associated with appgroups created in the same location.

## Can RDP traffic be routed through ExpressRoute?

The upcoming RDP Shortpath Private feature is designed to route all RDP traffic over the private addresses routable via expressroute. The goal of this feature is to improve performance of the remote connection by using managed networks instead of public Internet and therefor improve user experience.
But it is important to understand that small amounts of signaling and telemetry data will still flow over the public IPs.

So if the goal is to “keep RDP traffic on ExpressRoute”, then we have a solution coming soon
However, if the sole purpose of the request is to have a total separation from public IP space for security reasons, then we have a long path to go there

## How do you expand an object's properties in PowerShell?

When you execute a PS cmdlet just the name of the resource and location is displayed.
Get-AzWvdHostPool -Name 0224hp -ResourceGroupName 0224rg

Location Name   Type
-------- ----   ----
westus   0224hp Microsoft.DesktopVirtualization/hostpools

If you want to see all the properties of the resource, use either “format-list” or “fl”

Get-AzWvdHostPool -Name 0224hp -ResourceGroupName 0224rg |fl

ApplicationGroupReference                  : {/subscriptions/subId/resourcegroups/0224RG
                                             /providers/Microsoft.DesktopVirtualization/applicationgroups/Workapps, /su
                                             bscriptions/subId/resourcegroups/0224RG/pro
                                             viders/Microsoft.DesktopVirtualization/applicationgroups/0224HP-DAG, /subs
                                             criptions/subId/resourcegroups/0224RG/provi
                                             ders/Microsoft.DesktopVirtualization/applicationgroups/Accounting Apps, /s
                                             ubscriptions/subId/resourcegroups/0224RG/pr
                                             oviders/Microsoft.DesktopVirtualization/applicationgroups/0224Apps}
CustomRdpProperty                          : audiocapturemode:i:0;audiomode:i:0;drivestoredirect:s:;redirectclipboard:i
                                             :1;redirectcomports:i:0;redirectprinters:i:1;redirectsmartcards:i:1;screen
                                              mode id:i:2;
Description		: Created through the WVD extension
FriendlyName		:
HostPoolType		: Pooled
Id			: /subscriptions/subId/resourcegroups/0224rg/
                                             providers/Microsoft.DesktopVirtualization/hostpools/0224hp
LoadBalancerType	: BreadthFirst
Location		: westus
MaxSessionLimit	: 2
Name			: 0224hp
PersonalDesktopAssignmentType	:
RegistrationInfoExpirationTime	: 6/6/2020 7:00:00 AM
RegistrationInfoRegistrationTokenOperation : None
RegistrationInfoToken	: <token key>
Ring			:
SsoContext		:
Tag	: Microsoft.Azure.PowerShell.Cmdlets.DesktopVirtualization.Models.Api20191210Preview.TrackedResourceTags
Type			: Microsoft.DesktopVirtualization/hostpools
VMTemplate		: {"domain":"domain_name","galleryImageOffer":"Windows-10",
"galleryImagePublisher":"MicrosoftWindowsDesktop","galleryImageSKU":"19h2-
                                             evd","imageType":"Gallery","imageUri":null,"customImageId":null,"namePrefi
x":"0224win10ms","osDiskType":"StandardSSD_LRS","useManagedDisks":true,"vm
                                             Size":{"id":"Standard_D2s_v3","cores":2,"ram":8}}
ValidationEnvironment  :

If you want to see specific properties, call out the properties along with “format-list”:
Get-AzWvdHostPool -Name demohp -ResourceGroupName 0414rg |fl CustomRdpProperty

CustomRdpProperty : audiocapturemode:i:0;audiomode:i:0;drivestoredirect:s:;redirectclipboard:i:1;redirectcomports:i:0;redirectprinters:i:1;redirectsmartcards:i:1;screen modeid:i:2;

## Does Windows Virtual Desktop support guest users?

Scenario: Company A wants to manage external users from company B who:

-	Are licensed with ME3, WE3 or WIN VDA in their own company B tenant 
-	But are included in the active directory of the company A as external/guest users 

Can these users access Windows Virtual Desktop within company A? 

Answer: Company A would need to manage Company B’s user objects in BOTH Active Directory and Azure AD, as if they were local accounts to Company A. The service does not support Azure AD guest user accounts.

Licensing will also prevent this - “Not compliant to use your own license(s) (Company A) for the benefit of a 3rd party (Company B).”

## Why don't I see the client IP address in the WVDConnections table?

There is no reliable way in which we can collect the IP address for the web client. Hence we do not populate the client IP in the WVDConnections table.