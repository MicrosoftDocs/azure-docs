---
title: 'Set up the source environment (VMware to Azure) | Microsoft Docs'
description: This article describes how to set up your on-premises environment to start replicating VMware virtual machines to Azure.
services: site-recovery
author: AnoopVasudavan
manager: gauravd
ms.service: site-recovery
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 02/22/2018
ms.author: anoopkv
---

# Set up the source environment (VMware to Azure)
> [!div class="op_single_selector"]
> * [VMware to Azure](./site-recovery-set-up-vmware-to-azure.md)
> * [Physical to Azure](./site-recovery-set-up-physical-to-azure.md)

This article describes how to set up your source, on-premises environment, to replicate virtual machines running on VMware to Azure. It includes steps for selecting your replication scenario, setting up an on-premises machine as the Site Recovery configuration server, and automatically discovering on-premises VMs. 

## Prerequisites

The article assumes that you have already:
- [Set up resources](tutorial-prepare-azure.md) in the [Azure portal](http://portal.azure.com).
- [Set up on-premises VMware](tutorial-prepare-on-premises-vmware.md), including a dedicated account for automatic discovery.



## Choose your protection goals

1. In the Azure portal, go to the **Recovery Services** vault blade and select your vault.
2. On the resource menu of the vault, go to **Getting Started** > **Site Recovery** > **Step 1: Prepare Infrastructure** > **Protection goal**.

    ![Choose goals](./media/site-recovery-set-up-vmware-to-azure/choose-goals.png)
3. In **Protection goal**, select **To Azure**, and choose **Yes, with VMware vSphere Hypervisor**. Then click **OK**.

    ![Choose goals](./media/site-recovery-set-up-vmware-to-azure/choose-goals2.png)

## Set up the configuration server

You set up the configuration server as an on-premises VMware VM, use an Open Virtualization Format (OVF) template. [Learn more](concepts-vmware-to-azure-architecture.md) about the components that will be installed on the VMware VM. 

1. Learn about the [prerequisites](how-to-deploy-configuration-server.md#prerequisites) for configuration server deployment. [Check capacity numbers](how-to-deploy-configuration-server.md#capacity-planning) for deployment.
2. [Download](how-to-deploy-configuration-server.md#download-the-template) and [import](how-to-deploy-configuration-server.md#import-the-template-in-vmware) the OVF template (how-to-deploy-configuration-server.md) to set up an on-premises VMware VM that runs the configuration server.
3. Turn on the VMware VM, and [register it](how-to-deploy-configuration-server.md#register-the-configuration-server) in the Recovery Services vault.


## Add the VMware account for automatic discovery

[!INCLUDE [site-recovery-add-vcenter-account](../../includes/site-recovery-add-vcenter-account.md)]

## Connect to the VMware server

To allow Azure Site Recovery to discover virtual machines running in your on-premises environment, you need to connect your VMware vCenter Server or vSphere ESXi hosts with Site Recovery.

Select **+vCenter** to start connecting a VMware vCenter server or a VMware vSphere ESXi host.

[!INCLUDE [site-recovery-add-vcenter](../../includes/site-recovery-add-vcenter.md)]


## Common issues
[!INCLUDE [site-recovery-vmware-to-azure-install-register-issues](../../includes/site-recovery-vmware-to-azure-install-register-issues.md)]


## Next steps
[Set up your target environment](./site-recovery-prepare-target-vmware-to-azure.md) in Azure.
