
<properties
    pageTitle="List of Ports and URLs to whitelist for Azure RemoteApp Deployed in customer virtual network 
 | Microsoft Azure"
    description="Learn which ports and URLs you'll need to configure for communication through Azure RemoteApp."
    services="remoteapp"
	documentationCenter=""
    authors="mghosh1616"
    manager="mbaldwin" />

<tags
    ms.service="remoteapp"
    ms.workload="compute"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="08/15/2016"
    ms.author="elizapo" />



# List of Ports and URLs to permit access for Azure RemoteApp Deployed in customer Virtual Network 

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

The following applies to Azure RemoteApp a cloud or hybrid collection if you are deploying it in a virtual network (VNET). For more information on virtual networks, please read [Virtual Network Overview](../virtual-network/virtual-networks-overview.md). If you have created a network security group (NSG) restricting traffic to your virtual network resources which you have chosen for Azure RemoteApp, please make sure the following are accessible and allowed through the security policies on the virtual network. For more information on network security groups, please read [What is a Network Security Group? (NSG)](../virtual-network/virtual-networks-nsg.md).

##  Azure RemoteApp subnet needs access to these endpoints and URLs: 
*	*.servicebus.windows.net
*	 *.servicebus.net
*	 https://*.remoteapp.windwsazure.com  
*	 https://www.remoteapp.windowsazure.com 
*	 https://*remoteapp.windowsazure.com  
*	 https://*.core.windows.net  
*	 Outbound: TCP: 443, TCP: 10101-10175 
*	 Optional – UDP: 10201-10275  
 
## Azure RemoteApp clients need access to these endpoints and URLs: 

By clients I mean the desktops, devices etc. that people use to connect to the apps deployed in the Azure RemoteApp collection.

-  https://telemetry.remoteapp.windowsazure.com  
-  https://*.remoteapp.windowsazure.com (the optional UDP ports are for this address) 
-  https://login.windows.net  
-  https://login.microsoftonline.com  
-  https://www.remoteapp.windowsazure.com 
-  https://*.core.windows.net  
-  Outbound: TCP: 443  
-  Optional - UDP: 3391 