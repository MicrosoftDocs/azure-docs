---
title: Manage a process server in Azure Site Recovery | Microsoft Docs
description: This article describes manage a process server set up for VMware VM and physical server replication in Azure Site Recovery.
author: Rajeswari-Mamilla
ms.service: site-recovery
ms.topic: conceptual
ms.date: 07/21/2018
ms.author: ramamill

---

# Manage process servers

By default the process server used when you're replicating VMware VMs or physical servers to Azure is installed on the on-premises configuration server machine. There are a couple of instances in which you need to set up a separate process server:

- For large deployments, you might need additional on-premises process servers to scale capacity.
- For failback, you need a temporary process server set up in Azure. You can delete this VM when failback is done. 

This article summarizes typical management tasks for these additional process servers.

## Upgrade a process server

Upgrade an process server running on premises, or in Azure (for failback purposes), as follows:

[!INCLUDE [site-recovery-vmware-upgrade -process-server](../../includes/site-recovery-vmware-upgrade-process-server-internal.md)]

> [!NOTE]
  Typically, when you use the Azure Gallery Image to create a process server in Azure for the purposes of failback, it's running the latest version available. The Site Recovery teams release fixes and enhancements on a regular basis, and we recommend you keep process servers up-to-date.



## Reregister a process server

If you need to reregister a process server running on-premises, or in Azure, with the configuration server, do the following:

[!INCLUDE [site-recovery-vmware-register-process-server](../../includes/site-recovery-vmware-register-process-server.md)]

After you've saved the settings, do the following:

1. On the process server, open an administrator command prompt.
2. Browse to folder **%PROGRAMDATA%\ASR\Agent**, and run the command:

    ```
    cdpcli.exe --registermt
    net stop obengine
    net start obengine
    ```

## Modify proxy settings for an on-premises process server

If the process server uses a proxy to connect to Site Recovery in Azure, use this procedure if you need to modify existing proxy settings.

1. Log onto the process server machine. 
2. Open an Admin PowerShell command window, and run the following command:
  ```powershell
  $pwd = ConvertTo-SecureString -String MyProxyUserPassword
  Set-OBMachineSetting -ProxyServer http://myproxyserver.domain.com -ProxyPort PortNumber –ProxyUserName domain\username -ProxyPassword $pwd
  net stop obengine
  net start obengine
  ```
2. Browse to folder **%PROGRAMDATA%\ASR\Agent**, and run the following command:
  ```
  cmd
  cdpcli.exe --registermt

  net stop obengine

  net start obengine

  exit
  ```


## Remove a process server

[!INCLUDE [site-recovery-vmware-unregister-process-server](../../includes/site-recovery-vmware-unregister-process-server.md)]


