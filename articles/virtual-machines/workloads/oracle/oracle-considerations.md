---
title: Oracle solutions on Microsoft Azure | Microsoft Docs
description: Learn about options to deploy Oracle applications and solutions on Microsoft Azure.
services: virtual-machines-linux
documentationcenter: ''
author: romitgirdhar
manager: jeconnoc
tags: azure-resource-management

ms.assetid: 5d71886b-463a-43ae-b61f-35c6fc9bae25
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 05/23/2019
ms.author: rogirdh
ms.custom: seodec18
---

# Overview of Oracle applications and solutions on Azure

This article introduces capabilities to run Oracle solutions using Azure infrastructure. See more detailed introductions to available [Oracle VM images](oracle-vm-solutions.md) in Azure and the preview capability to [interconnect Azure with Oracle Cloud Infrastructure](oracle-oci-overview.md).

## Oracle databases on Azure infrastructure

Run Oracle databases on Azure infrastructure using Linux images available in the Azure Marketplace:

* Oracle Database 12.1, 12.2, and 18.3 Enterprise Edition 

* Oracle Database 12.1, 12.2, and 18.3 Standard Edition 

You can choose to bring other Oracle database images as well as custom images.

Optionally configure with multiple attached disks and improve database performance by installing Oracle Automated Storage Management (ASM).

## Applications on Oracle Linux and WebLogic Server

Run enterprise applications in Azure on supported Oracle operating systems. The following images are available in the Azure Marketplace:

* Oracle WebLogic Server 12.1.2

* Oracle Linux (UEK) 6.8, 6.9, 6.10, 7.3, 7.4, 7.5, and 7.6

## High availability and disaster recovery options

* Enable Oracle Real Application Clusters (RAC) in Azure using [FlashGrid SkyCluster](https://www.flashgrid.io/oracle-rac-in-azure/).

* Configure Oracle Data Guard, Active Data Guard, or Golden Gate on Azure infrastructure

## (Preview) Integration of Azure with Oracle Cloud Infrastructure

Run Oracle applications in Azure infrastructure, connected to backend databases in Oracle Cloud Infrastructure (OCI). This solution uses the following capabilities: 

* **Cross-cloud networking** - Using the direct interconnect available between Azure ExpressRoute and Oracle FastConnect, establish high-bandwidth, private, and low-latency connections between the application and the database layer.
* **Integrated identity** - Set up federated identity between Azure AD and Oracle IDCS to create a single identity source for the solutions. Enable single sign-on to manage resources across OCI and Azure.

### Deploy Oracle applications on Azure

Use TerraForm templates to set up Oracle applications certified to run on Azure:

* E-Business Suite
* JD Edwards
* PeopleSoft
* Oracle Retail Applications
* Hyperion

Also deploy custom applications in Azure that connect with OCI and other Azure services.

### Set up Oracle databases in OCI

Use Oracle Database Cloud Services (RAC, Exadata, Single Node) in conjunction with custom applications. Learn more about [OCI database options](https://docs.cloud.oracle.com/iaas/Content/Database/Concepts/databaseoverview.htm). 
 

## Licensing

Deployment of Oracle applications in Azure is based on a "bring your own license" model. It's assumed you are properly licensed to use Oracle software and that you have a current support agreement in place with Oracle. Oracle has guaranteed license mobility from on-premises to Azure. See the Oracle-Azure [FAQ](https://www.oracle.com/cloud/technologies/oracle-azure-faq.htm).

## Next steps

* Learn more about deploying [Oracle VM images](oracle-vm-solutions.md) in Azure infrastructure.

* Learn more about how to [interconnect Azure with OCI](oracle-oci-overview.md).