---
title: Setup networking infrastructure in Azure 
description: tba
ms.topic: how-to
ms.subservice: baremetal-nutanix
ms.date: 03/31/2021
---

# 

1. Configure a DNS server. 	You can use any of the following DNS servers: 
* On-prem DNS server 
> [!NOTE]
> You need to create a Cluster VNet and set up VPN or ExpressRoute connectivity to the on-prem DNS server. 
* Public DNS server, such as 1.1.1.1 or 8.8.8.8 
* Azure DNS server deployed from Microsoft Marketplace 
* Nutanix provisioned DNS server with the IP address 20.106.145.8 
> [!NOTE]
> The Nutanix-provided DNS server should only be used for the Private Preview. 
> [!NOTE]
> Ensure that Azure Directory Service resolves the specified FQDN: gateway-externalapi.console.nutanix.com. 
See Setting up the networking infrastructure in Azure
1. Create the required VNets. 

## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the PUblic Preview](about-the-public-preview.md)
