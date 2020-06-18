---
title: Oracle solutions on Microsoft Azure | Microsoft Docs
description: Learn about options to deploy Oracle Applications and solutions on Microsoft Azure, including running entirely on Azure infrastructure or using cross-cloud connectivity with Oracle Cloud Infrastructure (OCI).
services: virtual-machines-linux
documentationcenter: ''
author: BorisB2015
tags: azure-resource-management

ms.assetid: 
ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/05/2020
ms.author: borisb
---

# Overview of Oracle Applications and solutions on Azure

This article introduces capabilities to run Oracle solutions using Azure infrastructure. See also detailed introductions to available [WebLogic Server Azure Applications](oracle-weblogic.md), [Oracle VM images](oracle-vm-solutions.md) in the Azure Marketplace and the capability to [interconnect Azure with Oracle Cloud Infrastructure (OCI)](oracle-oci-overview.md).

## Oracle databases on Azure infrastructure

Run Oracle databases on Azure infrastructure using Oracle Database on Oracle Linux images available in the Azure Marketplace:

* Oracle Database 12.1, 12.2, and 18.3 Enterprise Edition 

* Oracle Database 12.1, 12.2, and 18.3 Standard Edition

* Oracle Database 19.3

You can also choose to setup Oracle Database on a non-Oracle Linux image available in Azure, base a solution on a custom image you create from scratch in Azure or upload a custom image from your on-premises environment.

Optionally configure with multiple attached disks and improve database performance by installing Oracle Automated Storage Management (ASM).

## WebLogic Server with Azure Service Integrations

Choose from a variety of WebLogic Server Azure Applications to accelerate your cloud journey.  Several pre-configured Azure service integrations are available, including database, Azure App Gateway, and Azure Active Directory.

## Applications on Oracle Linux and WebLogic Server

Run enterprise applications in Azure on supported Oracle Linux images. The following virtual machine images are available in the Azure Marketplace:

* Oracle WebLogic Server 12.1.2

* Oracle Linux with the Unbreakable Enterprise Kernel (UEK) 6.8, 6.9, 6.10, 7.3 through 7.7, 8.0, 8.1. 

## High availability and disaster recovery options

* Configure [Oracle Data Guard](https://docs.oracle.com/cd/B19306_01/server.102/b14239/concepts.htm#g1049956), [Active Data Guard with FSFO](https://docs.oracle.com/en/database/oracle/oracle-database/12.2/dgbkr/index.html), [Sharding](https://docs.oracle.com/en/database/oracle/oracle-database/12.2/admin/sharding-overview.html) or [Golden Gate](https://www.oracle.com/middleware/technologies/goldengate.html) on Azure infrastructure in conjunction with [Availability Zones](../../../availability-zones/az-overview.md) for high availability in-region. You may also setup these configurations across multiple Azure regions for added availability and disaster recovery.

* Use [Azure Site Recovery](../../../site-recovery/site-recovery-overview.md) to orchestrate and manage disaster recovery for your Oracle Linux VMs in Azure and your physical servers. 

* Enable Oracle Real Application Clusters (RAC) in Azure using [Azure VMWare Solution](https://docs.microsoft.com/azure/vmware-cloudsimple/oracle-real-application-clusters/) or [FlashGrid SkyCluster](https://www.flashgrid.io/oracle-rac-in-azure/).

## Backup Oracle Workloads

* Back-up your Oracle VMs using [Azure Backup](https://docs.microsoft.com/azure/backup/backup-overview)

* Back-up your Oracle Database using Oracle RMAN and optionally use [Azure Blob Fuse](https://docs.microsoft.com/azure/storage/blobs/storage-how-to-mount-container-linux) to mount a [highly redundant Azure Blob Storage account](https://docs.microsoft.com/azure/storage/common/storage-redundancy) and write your RMAN backups to it for added resiliency.

## Integration of Azure with OCI

Run Oracle Applications in Azure infrastructure, connected to backend databases in Oracle Cloud Infrastructure (OCI). This solution uses the following capabilities: 

* **Cross-cloud networking** - Use the direct interconnect available between Azure ExpressRoute and Oracle FastConnect to establish high-bandwidth, private, and low-latency connections between the application and the database layer.
* **Integrated identity** - Set up federated identity between Azure AD and Oracle IDCS to create a single identity source for the solutions. Enable single sign-on to manage resources across OCI and Azure.

### Deploy Oracle Applications on Azure

Use Terraform templates to set up Azure infrastructure and install Oracle Applications. 

Oracle has certified these applications to run in Azure when connecting to an Oracle database via the Azure / Oracle Cloud interconnect solution:

* E-Business Suite
* JD Edwards EnterpriseOne
* PeopleSoft
* Oracle Retail applications
* Oracle Hyperion Financial Management

Also deploy custom applications in Azure that connect with OCI and other Azure services.

### Set up Oracle databases in OCI

Use Oracle Database Cloud Services (Autonomous Database, RAC, Exadata, DBaaS, Single Node) in conjunction with Oracle software running in Azure. Learn more about [OCI database options](https://docs.cloud.oracle.com/iaas/Content/Database/Concepts/databaseoverview.htm). 
 

## Licensing

Deployment of Oracle Applications in Azure is based on a "bring your own license" model. It's assumed you are properly licensed to use Oracle software and that you have a current support agreement in place with Oracle. Oracle has guaranteed license mobility from on-premises to Azure. See the Oracle-Azure [FAQ](https://www.oracle.com/cloud/technologies/oracle-azure-faq.html).

## Next steps

* Learn more about [WebLogic Server Azure Applications](oracle-weblogic.md) and the Azure service integrations they support.

* Learn more about deploying [Oracle VM images](oracle-vm-solutions.md) in Azure infrastructure.

* Learn more about how to [interconnect Azure with OCI](oracle-oci-overview.md).

* Check out the [Oracle on Azure overview session](https://myignite.techcommunity.microsoft.com/sessions/82915) from Ignite 2019. 
