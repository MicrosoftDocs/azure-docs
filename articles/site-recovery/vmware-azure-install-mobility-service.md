---
title: Prepare source machines to install the Mobility Service through push installation for disaster recovery of VMware VMs and physical servers to Azure | Microsoft Docs
description: Learn how to prepare your server to install Mobility agent through push installation for disaster recovery of VMware VMs and physical servers to Azure using the  Azure Site Recovery service.
author: Rajeswari-Mamilla
ms.service: site-recovery
ms.topic: conceptual
ms.date: 03/25/2019
ms.author: ramamill
---

# Prepare source machine for push installation of mobility agent

When you set up disaster recovery for VMware VMs and physical servers using [Azure Site Recovery](site-recovery-overview.md), you install the [Site Recovery Mobility service](vmware-physical-mobility-service-overview.md) on each on-premises VMware VM and physical server.  The Mobility service captures data writes on the machine, and forwards them to the Site Recovery process server.

## Install on Windows machine

On each Windows machine you want to protect, do the following:

1. Ensure that there's network connectivity between the machine and the process server. If you haven't set up a separate process server, then by default it's running on the configuration server.
1. Create an account that the process server can use to access the computer. The account should have administrator rights, either local or domain. Use this account only for the push installation and for agent updates.
2. If you don't use a domain account, disable Remote User Access control on the local computer as follows:
    - Under  HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System registry key, add a new DWORD: **LocalAccountTokenFilterPolicy**. Set the value to **1**.
    -  To do this at a command prompt, run the following command:  
   `REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d
3. In Windows Firewall on the machine you want to protect, select **Allow an app or feature through Firewall**. Enable **File and Printer Sharing** and **Windows Management Instrumentation (WMI)**. For computers that belong to a domain, you can configure the firewall settings by using a Group Policy object (GPO).

   ![Firewall settings](./media/vmware-azure-install-mobility-service/mobility1.png)

4. Add the account that you created in CSPSConfigtool. To do this, sign in to your configuration server.
5. Open **cspsconfigtool.exe**. It's available as a shortcut on the desktop and in the %ProgramData%\ASR\home\svsystems\bin folder.
6. On the **Manage Accounts** tab, select **Add Account**.
7. Add the account you created.
8. Enter the credentials you use when you enable replication for a computer.

## Install on Linux machine

On each Linux machine that you want to protect, do the following:

1. Ensure that there's network connectivity between the Linux machine and the process server.
2. Create an account that the process server can use to access the computer. The account should be a **root** user on the source Linux server. Use this account only for the push installation and for updates.
3. Check that the /etc/hosts file on the source Linux server has entries that map the local hostname to IP addresses associated with all network adapters.
4. Install the latest openssh, openssh-server, and openssl packages on the computer that you want to replicate.
5. Ensure that Secure Shell (SSH) is enabled and running on port 22.
4. Enable SFTP subsystem and password authentication in the sshd_config file. To do this, sign in as **root**.
5. In the **/etc/ssh/sshd_config** file, find the line that begins with **PasswordAuthentication**.
6. Uncomment the line, and change the value to **yes**.
7. Find the line that begins with **Subsystem**, and uncomment the line.

      ![Linux](./media/vmware-azure-install-mobility-service/mobility2.png)

8. Restart the **sshd** service.
9. Add the account that you created in CSPSConfigtool. To do this, sign in to your configuration server.
10. Open **cspsconfigtool.exe**. It's available as a shortcut on the desktop and in the %ProgramData%\home\svsystems\bin folder.
11. On the **Manage Accounts** tab, select **Add Account**.
12. Add the account you created.
13. Enter the credentials you use when you enable replication for a computer.

## Anti-virus on replicated machines

If machines you want to replicate have active anti-virus software running, make sure you exclude the Mobility service installation folder from anti-virus operations (*C:\ProgramData\ASR\agent*). This ensures that replication works as expected.

## Next steps

After the Mobility Service is installed, in the Azure portal, select **+ Replicate** to start protecting these VMs. Learn more about enabling replication for [VMware VMs](vmware-azure-enable-replication.md) and [physical servers](physical-azure-disaster-recovery.md#enable-replication).


