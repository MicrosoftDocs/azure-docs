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
* After a cluster is created, you'll need Virtual IP addresses for both the on-premises cluster and the cluster running in Azure.
* Outbound internet access on your Azure portal.
* Azure Directory Service resolves the FQDN:  
gateway-external-api.console.nutanix.com.

## Other requirements

* Minimum of three (or more) Azure Nutanix Ready nodes per cluster 
* Only the Nutanix AHV hypervisor on Nutanix clusters running in Azure
* Prism Central instance deployed on NC2 on Azure to manage the Nutanix clusters in Azure


For more information, see Deployment. 

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)