---
title: VMware disaster recovery-configuration server requirements in Azure Site Recovery 
description: This article describes support and requirements when deploying the configuration server for VMware disaster recovery to Azure with Azure Site Recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
services: site-recovery
ms.topic: article
ms.date: 09/09/2019
ms.author: raynew
---

# Configuration server requirements for VMware disaster recovery to Azure

You deploy an on-premises configuration server when you use [Azure Site Recovery](site-recovery-overview.md) for disaster recovery of VMware VMs and physical servers to Azure.

- The configuration server coordinates communications between on-premises VMware and Azure. It also manages data replication.
- [Learn more](vmware-azure-architecture.md) about the configuration server components and processes.

## Configuration server deployment

For disaster recovery of VMware VMs to Azure, you deploy the configuration server as a VMware VM.

- Site Recovery provides an OVA template that you download from the Azure portal, and import into vCenter Server to set up the configuration server VM.
- When you deploy the configuration server using the OVA template, the VM automatically complies with the requirements listed in this article.
- We strongly recommend that you set up the configuration server using the OVA template. However, if you're setting up disaster recovery for VMware VMs and can't use the OVA template, you can deploy the configuration server using [these instructions provided](physical-azure-set-up-source.md).
- If you're deploying the configuration server for disaster recovery of on-premises physical machines to Azure, follow the instructions in [this article](physical-azure-set-up-source.md). 

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-and-scaleout-process-server-requirements.md)]

## Next steps
Set up disaster recovery of [VMware VMs](vmware-azure-tutorial.md) to Azure.
