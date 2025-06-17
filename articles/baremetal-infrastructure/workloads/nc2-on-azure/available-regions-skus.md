---
title: Available Regions and SKUs for Nutanix Cloud Clusters on Azure
author: MikeWeiner-Microsoft
ms.author: michwe
description: Learn about the available regions and SKUs for Nutanix Cloud Clusters on Azure.
ms.topic: reference
ms.subservice: baremetal-nutanix
ms.custom: references_regions
ms.date: 03/28/2025
ms.service: azure-baremetal-infrastructure
# Customer intent: As a cloud architect, I want to understand the available SKUs and regions for Nutanix Cloud Clusters on Azure, so that I can properly plan the deployment of my infrastructure to meet organizational needs.
---

# Nutanix Cloud Clusters (NC2) on Azure region and SKU availability
Nutanix Cloud Clusters on Azure are offered in three different Ready Node or SKU types and many Azure regions. 

## Supported SKUs and instances

The following table presents component options for each available SKU.

| Component |Ready Node for Nutanix AN36|Ready Node for Nutanix AN36P|Ready Node for Nutanix AN64|
| :------------------- | -------------------: |:---------------:| :---------------:| 
|Core|Intel 6140, 36 Core, 2.3 GHz|Intel 6240, 36 Core, 2.6 GHz| Intel 8462Y+, 64 Core, 2.8 GHz| 
|vCPUs|72|72|128|
|RAM|576 GB|768 GB|1 TB
|Storage|18.56 TB (8 x 1.92 TB SATA SSD, 2x1.6TB NVMe)|20.7 TB (2x750 GB Optane, 6x3.2-TB NVMe)| 38.4TB (5x7.68TB NVMe)|
|Network (available bandwidth between nodes)|25 Gbps|25 Gbps|25 Gbps|

Nutanix Clusters on Azure support:

* Minimum of three bare metal nodes per cluster.
* Maximum of 28 bare metal nodes per cluster.
* Only the Nutanix AHV hypervisor on Nutanix clusters running in Azure.
* Prism Central instance deployed on Nutanix Clusters on Azure to manage the Nutanix clusters in Azure.

## Supported regions

When planning your NC2 on Azure design, use the following table to understand what SKUs are available in each Azure region.

| Azure region | SKU   |
| :---         | :---: |
| Australia East | AN36P |
| Central India | AN36P |
| East US | AN36 |
| East US 2 | AN36P |
| Germany West Central | AN36P |
| Japan East | AN36P |
| North Central US | AN36P |
| Qatar Central | AN36P |
| Southeast Asia | AN36P |
| South India | AN36P |
| UAE North | AN36P |
| UK South | AN36P, AN64 |
| West Europe | AN36P |
| West US 2 | AN36 |

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Architecture](architecture.md)
