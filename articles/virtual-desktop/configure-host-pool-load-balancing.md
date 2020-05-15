---
title: Configure Windows Virtual Desktop load-balancing - Azure
description: How to configure the load-balancing method for a Windows Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/29/2019
ms.author: helohr
manager: lizross
---
# Configure the Windows Virtual Desktop load-balancing method

Configuring the load-balancing method for a host pool allows you to adjust the Windows Virtual Desktop environment to better suit your needs.

>[!NOTE]
> This does not apply to a persistent desktop host pool because users always have a 1:1 mapping to a session host within the host pool.

## Prerequisites

This article assumes you've followed the instructions in [Set up the Windows Virtual Desktop PowerShell module](powershell-module.md) to download and install the PowerShell module and sign in to your Azure account.

## Configure breadth-first load balancing

Breadth-first load balancing is the default configuration for new non-persistent host pools. Breadth-first load balancing distributes new user sessions across all available session hosts in the host pool. When configuring breadth-first load balancing, you may set a maximum session limit per session host in the host pool.

To configure a host pool to perform breadth-first load balancing without adjusting the maximum session limit, run the following PowerShell cmdlet:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -LoadBalancerType 'BreadthFirst' 
```

After that, to make sure you've set the breadth-first load balancing method, run the following cmdlet: 

```powershell
Get-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> | format-list Name, LoadBalancerType 

Name             : hostpoolname 
LoadBalancerType : BreadthFirst
```

To configure a host pool to perform breadth-first load balancing and to use a new maximum session limit, run the following PowerShell cmdlet:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -LoadBalancerType 'BreadthFirst' -MaxSessionLimit ###
```

## Configure depth-first load balancing

Depth-first load balancing distributes new user sessions to an available session host with the highest number of connections but has not reached its maximum session limit threshold. When configuring depth-first load balancing, you must set a maximum session limit per session host in the host pool.

To configure a host pool to perform depth-first load balancing, run the following PowerShell cmdlet:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -LoadBalancerType 'DepthFirst' -MaxSessionLimit ### 
```

To make sure the setting has updated, run this cmdlet:

```powershell
Get-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> | format-list Name, LoadBalancerType, MaxSessionLimit 

Name             : hostpoolname
LoadBalancerType : DepthFirst
MaxSessionLimit  : 6
```

## Configure load balancing with the Azure portal

You can also configure load balancing with the Azure portal.

To configure load balancing:

1. Sign into the Azure portal at https://portal.azure.com. 
2. Search for and select **Windows Virtual Desktop** under Services. 
3. In the Windows Virtual Desktop page, select **Host pools**.
4. Select the name of the host pool you want to edit.
5. Select **Properties**.
6. Enter the **Max session limit** into the field and select the **load balancing algorithm** you want for this host pool in the drop-down menu.
7. Select **Save**. This applies the new load balancing settings.