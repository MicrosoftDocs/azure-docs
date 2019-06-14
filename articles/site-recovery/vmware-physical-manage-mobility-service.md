---
title: Manage Mobility agent on servers for disaster recovery of VMware VMs and physical servers with Azure Site Recovery | Microsoft Docs
description: Manage Mobility Service agent for disaster recovery of VMware VMs and physical servers to Azure using the  Azure Site Recovery service.
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 03/25/2019
ms.author: ramamill
---

# Manage mobility agent on protected machines

You set up mobility agent on your server when you use Azure Site Recovery for disaster recovery of VMware VMs and physical servers to Azure. Mobility agent coordinates communications between your protected machine, configuration server/scale-out process server and manages data replication. This article summarizes common tasks for managing mobility agent after it's deployed.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Update mobility service from Azure portal

1. Before you start ensure that the configuration server, scale-out process servers, and any master target servers that are a part of your deployment are updated before you update the Mobility Service on protected machines.
2. In the portal open the vault > **Replicated items**.
3. If the configuration server is the latest version, you see a notification that reads "New Site recovery replication agent update is available. Click to install."

     ![Replicated items window](./media/vmware-azure-install-mobility-service/replicated-item-notif.png)

4. Click the notification, and in **Agent update**, select the machines on which you want to upgrade the Mobility service. Then click **OK**.

     ![Replicated items VM list](./media/vmware-azure-install-mobility-service/update-okpng.png)

5. The Update Mobility Service job starts for each of the selected machines.

## Update Mobility service through powershell script on Windows server

Use following script to upgrade mobility service on a server through power shell cmdlet

```azurepowershell
Update-AzRecoveryServicesAsrMobilityService -ReplicationProtectedItem $rpi -Account $fabric.fabricSpecificDetails.RunAsAccounts[0]
```

## Update account used for push installation of Mobility service

When you deployed Site Recovery, to enable push installation of the Mobility service, you specified an account that the Site Recovery process server uses to access the machines and install the service when replication is enabled for the machine. If you want to update the credentials for this account, follow [these instructions](vmware-azure-manage-configuration-server.md#modify-credentials-for-mobility-service-installation).

## Uninstall Mobility service

### On a Windows machine

Uninstall from the UI or from a command prompt.

- **From the UI**: In the Control Panel of the machine, select **Programs**. Select **Microsoft Azure Site Recovery Mobility Service/Master Target server** > **Uninstall**.
- **From a command prompt**: Open a command prompt window as an administrator on the machine. Run the following command: 
    ```
    MsiExec.exe /qn /x {275197FC-14FD-4560-A5EB-38217F80CBD1} /L+*V "C:\ProgramData\ASRSetupLogs\UnifiedAgentMSIUninstall.log"
    ```

### On a Linux machine
1. On the Linux machine, sign in as a **root** user.
2. In a terminal, go to /user/local/ASR.
3. Run the following command:
    ```
    uninstall.sh -Y

## Install Site Recovery VSS provider on source machine

Azure Site Recovery VSS provider is required on the source machine to generate application consistency points. If the installation of the provider didn't succeed through push installation, follow the below given guidelines to install it manually.

1. Open admin cmd window.
2. Navigate to the mobility service installation location. (Eg - C:\Program Files (x86)\Microsoft Azure Site Recovery\agent)
3. Run the script InMageVSSProvider_Uninstall.cmd . This will uninstall the service if it already exists.
4. Run the script InMageVSSProvider_Install.cmd to install the VSS provider manually.

## Next steps

- [Set up disaster recovery for VMware VMs](vmware-azure-tutorial.md)
- [Set up disaster recovery for physical servers](physical-azure-disaster-recovery.md)
