---
title: List of Ports and URLs to whitelist for Azure RemoteApp Deployed in customer virtual network | Microsoft Docs
description: Learn which ports and URLs you'll need to configure for communication through Azure RemoteApp.
services: remoteapp
documentationcenter: ''
author: mghosh1616
manager: mbaldwin

ms.assetid: 5a001ff7-14c9-47fa-9b39-78fd5a5f0250
ms.service: remoteapp
ms.workload: compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2017
ms.author: mbaldwin

---
# List of Ports and URLs to permit access for Azure RemoteApp Deployed in customer Virtual Network
> [!IMPORTANT]
> Azure RemoteApp is being discontinued on August 31, 2017. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.
> 
> 

If you are deploying an Azure RemoteApp cloud or hybrid collection in a virtual network (VNET), review the following port information. For more information on virtual networks, read [Virtual Network Overview](../virtual-network/virtual-networks-overview.md). If you have created a network security group (NSG) restricting traffic to the virtual network resources in your collection, make sure the following ports are accessible and allowed through the security policies on the virtual network. For more information on network security groups, read [What is a Network Security Group? (NSG)](../virtual-network/virtual-networks-nsg.md).

## Azure RemoteApp subnet needs access to these endpoints and URLs:
* *.servicebus.windows.net
* *.servicebus.net
* https://*.remoteapp.windowsazure.com  
* https://www.remoteapp.windowsazure.com 
* https://*remoteapp.windowsazure.com  
* https://*.core.windows.net  
* Outbound: TCP: TCP: 443, 9351, 9352, 10101-10175 
* Optional – UDP: 10201-10275  

## Azure RemoteApp clients need access to these endpoints and URLs:
By clients I mean the desktops, devices etc. that people use to connect to the apps deployed in the Azure RemoteApp collection.

* https://telemetry.remoteapp.windowsazure.com  
* https://*.remoteapp.windowsazure.com (the optional UDP ports are for this address) 
* https://login.windows.net  
* https://login.microsoftonline.com  
* https://www.remoteapp.windowsazure.com 
* https://*.core.windows.net  
* Outbound: TCP: 443  
* Optional - UDP: 3391 

