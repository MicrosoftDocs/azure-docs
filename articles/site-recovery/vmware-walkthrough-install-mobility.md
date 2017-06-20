---
title: Install the Mobility service for VMware to Azure replication | Microsoft Docs
description: This article describes how to install the Mobility service agent for VMware to Azure replication with the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 3189fbcd-6b5b-4ffb-b5a9-e2080c37f9d9
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/13/2017
ms.author: raynew
---

# Step 10: Install the Mobility service


This article describes how to configure source and target settings when replicating on-premises VMware virtual machines to Azure, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

The Mobility service captures data writes on a machine, and forwards them to the process server. It should be installed on each machine that you want to replicate to Azure.

You can install the Mobility service manual, using a push installation from the Site Recovery process server when replication is enabled, or use a tool System Center Configuration Manager. If you use push installation, the service is installed on the VM when replication is enabled.

Post comments and questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Install manually

1. Check the [prerequisites](site-recovery-vmware-to-azure-install-mob-svc.md#prerequisites) for manual installation.
2. Follow [these instructions](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-manually-by-using-the-gui) for manual installation using the portal.
3. If you prefer to install from the command line, follow [these instructions](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-manually-at-a-command-prompt).

## Install from the process server

If you want to push the Mobility service installation from the process server when you enable replication for a VM, you need an account that can be used by the process server to access the VM. The account is only used for the push installation.

1. You should have [created an account](vmware-walkthrough-prepare-vmware.md) that can be used for push installation. You then specify the account you want to use when you configure source settings during Site Recovery deployment.
2. Then follow [these instructions](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-by-push-installation-from-azure-site-recovery) if you want to push the Mobility service on VMs running Windows or Linux.


## Next steps

- Learn more about [installing the Mobility service using Configuration Manager]((site-recovery-install-mobility-service-using-sccm.md), or using [Azure Automation DSC](site-recovery-automate-mobility-service-install.md)
- Go to [Step 11: Enable replication](vmware-walkthrough-enable-replication.md)
