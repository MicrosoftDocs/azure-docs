---
title: Install the Mobility service for physical server to Azure replication | Microsoft Docs
description: This article describes how to install the Mobility service agent on physical servers replicating to Azure with the Azure Site Recovery service.
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
ms.date: 06/27/2017
ms.author: raynew
---

# Step 9: Install the Mobility service


This article describes how to install the Mobility service component when replicating on-premises Windows/Linux physical servers to Azure, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

The Mobility service captures data writes on a machine, and forwards them to the process server. It should be installed on each server that you want to replicate to Azure.

You can install the Mobility service manually, or using a push installation from the Site Recovery process server when replication is enabled, or using a tool such as System Center Configuration Manager. If you use push installation, the service is installed on the server when you enable replication.

Post comments and questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Install manually

1. Check the [prerequisites](site-recovery-vmware-to-azure-install-mob-svc.md#prerequisites) for manual installation.
2. Follow [these instructions](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-manually-by-using-the-gui) for manual installation using the portal.
3. If you prefer to install from the command line, follow [these instructions](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-manually-at-a-command-prompt).

## Install from the process server

If you want to push the Mobility service installation from the process server when you enable replication for a machine, you need an account that can be used by the process server to access the machine. The account is only used for the push installation.

1. If you haven't created an account, do so using these guidelines:

    - You can use a domain or local account
    - For Windows, if you're not using a domain account, you need to disable Remote User Access control on the local machine. To do this, in the register under **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**, add the DWORD entry **LocalAccountTokenFilterPolicy**, with a value of 1.
    - If you want to add the registry entry for Windows from a CLI, type:

        ```
        REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1.
        ```

    - For Linux, the account should be root on the source Linux server.

2. Then follow [these instructions](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-by-push-installation-from-azure-site-recovery) if you want to push the Mobility service on VMs running Windows or Linux.

## Other installation methods

- [Learn about](site-recovery-install-mobility-service-using-sccm.md) installing the Mobility service using Configuration Manager
- [Learn about](site-recovery-automate-mobility-service-install.md) installing with Azure Automation DSC.


## Next steps

Go to [Step 10: Enable replication](physical-walkthrough-enable-replication.md)
