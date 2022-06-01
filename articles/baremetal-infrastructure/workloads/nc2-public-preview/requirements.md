---
title: Requirements
description: What you need to run NC2 on Azure
ms.topic: how-to
ms.subservice: baremetal-oracle
ms.date: 03/31/2021
---

# Requirements

This article assumes prior knowledge of the Nutanix stack and Azure services to operate significant deployments on Azure. 
The following sections identify the requirements to use Nutanix Clusters on Azure:

## Azure account requirements

* An Azure account with a new subscription  
* An Azure Active Directory

## My Nutanix account requirements

For more information, see (insert nutanix url)

## Networking requirements

* Connectivity between your on-premises datacenter and Azure. Both ExpressRoute and VPN are supported. 
* After a cluster is created, you will need Virtual IP addresses for both the onpremises cluster and the cluster running in Azure.
* Outbound internet access on your Azure portal.
* Azure Directory Service resolves the FQDN:  
gateway-external-api.console.nutanix.com.

For more information, see Deployment. 

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)