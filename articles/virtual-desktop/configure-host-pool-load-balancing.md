---
title: Configure the Windows Virtual Desktop load-balancing method - Azure
description: How to configure the load-balancing method for a Windows Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 02/20/2019
ms.author: helohr
---
# Configure the Windows Virtual Desktop load-balancing method

Configuring the load balancing method for a host pool allows you to adjust the Windows Virtual Desktop environment to better suit your needs.

>[!NOTE]
> This does not apply to a persistent desktop host pool because users always have a 1:1 mapping to a session host within the host pool.

## Configure breadth-first load balancing

Breadth-first load balancing is the default configuration for new non-persistent host pools. Breadth-first load-balancing distributes new user sessions across all available session hosts in the host pool. When configuring breadth-first load balancing, you may set a maximum session limit per session host in the host pool.

First, [download and import the Windows Virtual Desktop PowerShell module](https://rdmipreview.blob.core.windows.net/preview/Windows%20Virtual%20Destkop%20-%20PowerShell%20Reference.pdf?st=2019-02-18T19%3A03%3A00Z&se=2019-03-31T19%3A03%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=n4Wb3v%2Bc0xbzWmlljPJqVuXZMCoqQ1C%2F6uA7DfAsOQY%3D) to use in your PowerShell session if you haven't already.

To configure a host pool to perform breadth-first load balancing without adjusting the maximum session limit, run the following PowerShell cmdlet:

```powershell
Set-RdsHostPool <tenantname> <hostpoolname> -BreadthFirstLoadBalancer
```

To configure a host pool to perform breadth-first load balancing and to use a new maximum session limit, run the following PowerShell cmdlet:

```powershell
Set-RdsHostPool <tenantname> <hostpoolname> -BreadthFirstLoadBalancer -MaxSessionLimit ###
```

## Configure depth-first load balancing

Depth-first load balancing distributes new user sessions to an available session host with the highest number of connections but has not reached its maximum session limit threshold. When configuring depth-first load balancing, you **must** set a maximum session limit per session host in the host pool.

To configure a host pool to perform depth-first load balancing, run the following PowerShell cmdlet:

```powershell
Set-RdsHostPool <tenantname> <hostpoolname> -DepthFirstLoadBalancer -MaxSessionLimit ###
```
