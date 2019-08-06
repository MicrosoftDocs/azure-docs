---
title: Oracle solutions on Microsoft Azure | Microsoft Docs
description: Learn about options to deploy Oracle applications and solutions on Microsoft Azure, including running entirely on Azure infrastructure or using cross-cloud connectivity with Oracle Cloud Infrastructure (OCI).
services: virtual-machines-linux
documentationcenter: ''
author: romitgirdhar
manager: gwallace
tags: azure-resource-management

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/04/2019
ms.author: rogirdh
---

# Overview of Oracle applications and solutions on Azure

This article introduces capabilities to run Oracle solutions using Azure infrastructure. See also detailed introductions to available [Oracle VM images](oracle-vm-solutions.md) in the Azure Marketplace, and the preview capability to [interconnect Azure with Oracle Cloud Infrastructure (OCI)](oracle-oci-overview.md).

## Oracle databases on Azure infrastructure

Run Oracle databases on Azure infrastructure using Linux images available in the Azure Marketplace:

* Oracle Database 12.1, 12.2, and 18.3 Enterprise Edition 

* Oracle Database 12.1, 12.2, and 18.3 Standard Edition 

You can also choose to base a solution on a custom image you create from scratch in Azure or upload a custom image from your on-premises environment.

Optionally configure with multiple attached disks and improve database performance by installing Oracle Automated Storage Management (ASM).

## Applications on Oracle Linux and WebLogic Server

Run enterprise applications in Azure on supported Oracle operating systems. The following images are available in the Azure Marketplace:

* Oracle WebLogic Server 12.1.2

* Oracle Linux (UEK) 6.8, 6.9, 6.10, 7.3, 7.4, 7.5, and 7.6

## High availability and disaster recovery options

* Configure Oracle Data Guard, Active Data Guard, or GoldenGate on Azure infrastructure in conjunction with [Availability Zones](../../../availability-zones/az-overview.md) for high availability.

* Use [Azure Site Recovery](../../../site-recovery/site-recovery-overview.md) to orchestrate and manage disaster recovery for your Oracle Linux VMs in Azure and your on-premises or physical servers. 

* Enable Oracle Real Application Clusters (RAC) in Azure using [FlashGrid SkyCluster](https://www.flashgrid.io/oracle-rac-in-azure/).

## Integration of Azure with OCI (preview)

Run Oracle applications in Azure infrastructure, connected to backend databases in Oracle Cloud Infrastructure (OCI). This solution uses the following capabilities: 

* **Cross-cloud networking** - Use the direct interconnect available between Azure ExpressRoute and Oracle FastConnect to establish high-bandwidth, private, and low-latency connections between the application and the database layer.
* **Integrated identity** - Set up federated identity between Azure AD and Oracle IDCS to create a single identity source for the solutions. Enable single sign-on to manage resources across OCI and Azure.

### Deploy Oracle applications on Azure

Use Terraform templates to set up Azure infrastructure and install Oracle applications validated and supported to run in the cross-cloud configuration:

* E-Business Suite
* JD Edwards EnterpriseOne
* PeopleSoft
* Oracle Retail applications
* Oracle Hyperion Financial Management

Also deploy custom applications in Azure that connect with OCI and other Azure services.

### Set up Oracle databases in OCI

Use Oracle Database Cloud Services (Autonomous Database, RAC, Exadata, DBaaS, Single Node) in conjunction with Oracle applications running in Azure. Learn more about [OCI database options](https://docs.cloud.oracle.com/iaas/Content/Database/Concepts/databaseoverview.htm). 
 

## Licensing

Deployment of Oracle applications in Azure is based on a "bring your own license" model. It's assumed you are properly licensed to use Oracle software and that you have a current support agreement in place with Oracle. Oracle has guaranteed license mobility from on-premises to Azure. See the Oracle-Azure [FAQ](https://www.oracle.com/cloud/technologies/oracle-azure-faq.html).

## Next steps

* Learn more about deploying [Oracle VM images](oracle-vm-solutions.md) in Azure infrastructure.

* Learn more about how to [interconnect Azure with OCI](oracle-oci-overview.md).