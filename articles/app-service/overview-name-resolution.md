---
title: Integrate your app with an Azure virtual network
description: Integrate your app in Azure App Service with Azure virtual networks.
author: madsd
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: madsd
---

# Name resolution (DNS) in App Service

Your app uses DNS when making calls to dependent resources. Resources could be Azure services such as Key Vault, Storage or Azure SQL, but it could also be web apis that your app depend on. When you want to make a call to for example *myservice.com*, DNS is used to resolve the name to an IP. This article describes how App Service is handling name resolution and how it determines what DNS servers to use. The article also describes settings you can use to configure DNS resolution.

## How name resolution works in App Service

If your app is not integrated with a virtual network and you have not configured custom DNS, your app will use [Azure DNS](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution). If your app is integrated with a virtual network, your app will use the DNS configuration of the virtual network. The default for virtual network is also to use Azure DNS, but through the virtual network it is also possible to link to [Azure DNS private zones](../dns/private-dns-overview.md) and use that for private endpoint resolution or private domain name resolutions. From your virtual network, you would also inherit any custom DNS servers configured.