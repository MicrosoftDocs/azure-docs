---
title: Oracle solutions on Microsoft Azure | Microsoft Docs
description: Learn about deploying Oracle Applications and solutions on Azure. Run entirely on Azure infrastructure or use cross-cloud connectivity with OCI.
documentationcenter: ''
author: dbakevlar
tags: azure-resource-management
ms.assetid: 
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/10/2023
ms.author: kegorman

---

# Overview of Oracle Applications and solutions on Azure

**Applies to:** :heavy_check_mark: Linux VMs

This article introduces capabilities to run Oracle solutions using Azure infrastructure. See also detailed introductions to available [WebLogic Server Azure Applications](oracle-weblogic.md), [Oracle VM images](oracle-vm-solutions.md) in the Azure Marketplace, and the capability to [interconnect Azure with Oracle Cloud Infrastructure (OCI)](oracle-oci-overview.md).

## Oracle databases on Azure infrastructure

Run Oracle databases on Azure infrastructure using Oracle Database on Oracle Linux images available in the Azure Marketplace:

- Oracle Database 12.2, and 18.3 Enterprise Edition
- Oracle Database 12.2, and 18.3 Standard Edition
- Oracle Database 19.3

You can also take the following approaches:

- Set up Oracle Database on a non-Oracle Linux image available in Azure.
- Base a solution on a custom image you create from scratch in Azure.
- Upload a custom image from your on-premises environment.

Optionally configure your solution with multiple attached disks. You can improve database performance by installing Oracle Automated Storage Management (ASM).

## WebLogic Server with Azure service integrations

Choose from various WebLogic Server Azure Applications to accelerate your cloud journey.  Several preconfigured Azure service integrations are available, including database, Azure App Gateway, and Azure Active Directory.

## Applications on Oracle Linux and WebLogic Server

Run enterprise applications in Azure on supported Oracle Linux images. The following virtual machine images are available in the Azure Marketplace:

- Oracle WebLogic Server 12.1.2
- Oracle Linux with the Unbreakable Enterprise Kernel (UEK) 6.8, 6.9, 6.10, 7.3 through 7.7, 8.0, 8.1.

## High availability and disaster recovery options

For high availability in region, configure any of the following technologies on Azure infrastructure:

- [Oracle Data Guard](https://docs.oracle.com/cd/B19306_01/server.102/b14239/concepts.htm#g1049956)
- [Active Data Guard with FSFO](https://docs.oracle.com/en/database/oracle/oracle-database/12.2/dgbkr/index.html)
- [Sharding](https://docs.oracle.com/en/database/oracle/oracle-database/12.2/admin/sharding-overview.html)
- [GoldenGate](https://www.oracle.com/middleware/technologies/goldengate.html)

You can also set up these configurations across multiple Azure regions for added availability and disaster recovery.

Use [Azure Site Recovery](../../../site-recovery/site-recovery-overview.md) to orchestrate and manage disaster recovery for your Oracle Linux VMs in Azure. You can also use Site Recovery for your physical servers with Oracle Data Guard or Oracle consistent backup measures that meet the Recovery Point Objective and Recovery Time Objective (RPO/RTO). Site Recovery has a [block change limit](../../../site-recovery/azure-to-azure-support-matrix.md) for the storage used by Oracle database.

## Backup Oracle workloads

- Back up your Oracle VMs using [Azure Backup](../../../backup/backup-overview.md).

- Back up your Oracle Database using Oracle RMAN. Optionally use [Azure Blob Fuse](../../../storage/blobs/storage-how-to-mount-container-linux.md) to mount a [highly redundant Azure Blob Storage account](../../../storage/common/storage-redundancy.md) and write your RMAN backups to it for added resiliency.

## Integrate of Azure with Oracle Cloud Infrastructure

You can run Oracle Applications in Azure infrastructure, connected to backend databases in Oracle Cloud Infrastructure (OCI). This solution uses the following capabilities:

- **Cross-cloud networking**. Use the direct interconnect available between Azure ExpressRoute and Oracle FastConnect to establish high-bandwidth, private, and low-latency connections between the application and the database layer.
- **Integrated identity**. Set up federated identity between Azure Active Directory (Azure AD) and Oracle Identity Cloud Service (IDCS) to create a single identity source for the solutions. Enable single sign-on to manage resources across OCI and Azure.

### Deploy Oracle Applications on Azure

Use Terraform templates to set up Azure infrastructure and install Oracle Applications. For more information, see [Terraform on Azure](/azure/developer/terraform/).

Oracle has certified the following applications to run in Azure when connecting to an Oracle database by using the Azure with Oracle Cloud interconnect solution:

- E-Business Suite
- JD Edwards EnterpriseOne
- PeopleSoft
- Oracle Retail applications
- Oracle Hyperion Financial Management

Also deploy custom applications in Azure that connect with OCI and other Azure services.

### Set up Oracle databases in OCI

Use Oracle Database Cloud Services with Oracle software running in Azure. These services include:

- Oracle Autonomous Database
- Oracle Real Application Clusters (RAC)
- Oracle Exadata
- Oracle database as a service (DBaaS)
- Oracle Single Node.

Learn more about [OCI database options](https://docs.cloud.oracle.com/iaas/Content/Database/Concepts/databaseoverview.htm).

## Licensing

Deployment of Oracle Applications in Azure is based on a bring-your-own-license model. This model assumes that you have licenses to use Oracle software and that you have a current support agreement in place with Oracle. Oracle has guaranteed license mobility from on-premises to Azure. See the Oracle-Azure [FAQ](https://www.oracle.com/cloud/technologies/oracle-azure-faq.html).

## Next steps

- Learn more about [WebLogic Server Azure Applications](oracle-weblogic.md) and the Azure service integrations they support.

- Learn more about deploying [Oracle VM images](oracle-vm-solutions.md) in Azure infrastructure.

- Learn more about how to [interconnect Azure with OCI](oracle-oci-overview.md).

- Check out the [Oracle on Azure overview session](https://www.pluralsight.com/courses/microsoft-ignite-session-57) from Ignite 2019.
