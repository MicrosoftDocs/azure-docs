---
title: Troubleshoot Mobility Service push installation failures when enabling replication for disaster recovery | Microsoft Docs
description: Troubleshoot Mobility Services installation errors when enabling replication for disaster recovery
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.author: ramamill
ms.date: 02/27/2019
---
# Troubleshoot Mobility Service push installation issues

Installation of Mobility service is a key step during Enable Replication. The success of this step depends solely on meeting prerequisites and working with supported configurations. The most common failures you face during Mobility service installation are due to:

* [Credential/Privilege errors](#credentials-check-errorid-95107--95108)
* [Login failures](#login-failures-errorid-95519-95520-95521-95522)
* [Connectivity errors](#connectivity-failure-errorid-95117--97118)
* [File and printer sharing errors](#file-and-printer-sharing-services-check-errorid-95105--95106)
* [WMI failures](#windows-management-instrumentation-wmi-configuration-check-error-code-95103)
* [Unsupported Operating systems](#unsupported-operating-systems)
* [Unsupported Boot configurations](#unsupported-boot-disk-configurations-errorid-95309-95310-95311)
* [VSS installation failures](#vss-installation-failures)
* [Device name in GRUB configuration instead of device UUID](#enable-protection-failed-as-device-name-mentioned-in-the-grub-configuration-instead-of-uuid-errorid-95320)
* [LVM volume](#lvm-support-from-920-version)
* [Reboot warnings](#install-mobility-service-completed-with-warning-to-reboot-errorid-95265--95266)

When you enable replication, Azure Site Recovery tries to push install mobility service agent on your virtual machine. As part of this, Configuration server tries to connect with the virtual machine and copy the Agent. To enable successful installation, follow the step by step troubleshooting guidance given below.

## Credentials check (ErrorID: 95107 & 95108)

* Verify if the user account chosen during enable replication is **valid, accurate**.
* Azure Site Recovery requires **ROOT** account or user account with **administrator privileges** to perform push installation. Else, push installation will be blocked on the source machine.
  * For Windows (**error 95107**), verify if the user account has administrative access, either local or domain, on the source machine.
  * If you are not using a domain account, you need to disable Remote User Access control on the local computer.
    * To disable Remote User Access control, under HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System registry key, add a new DWORD: LocalAccountTokenFilterPolicy. Set the value to 1. To execute this step, run the following command from command prompt:

         `REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1`
  * For Linux (**error 95108**), you must choose the root account for successful installation of mobility agent. Additionally, SFTP services should be running. To enable SFTP subsystem and password authentication in the sshd_config file:
    1. Sign in as root.
    2. Go to /etc/ssh/sshd_config file, find the line that begins with PasswordAuthentication.
    3. Uncomment the line, and change the value to yes.
    4. Find the line that begins with Subsystem, and uncomment the line.
    5. Restart the sshd service.

If you wish to modify the credentials of chosen user account, follow the instructions given [here](vmware-azure-manage-configuration-server.md#modify-credentials-for-mobility-service-installation).

## Insufficient privileges failure (ErrorID: 95517)

When the user chosen to install mobility agent does not have administrator privileges, Configuration server/scale-out process server will not be allowed to copy the mobility agent software on to source machine. So, this error is a result of access denied failure. Ensure that the user account has administrator privileges.

If you wish to modify the credentials of chosen user account, follow the instructions given [here](vmware-azure-manage-configuration-server.md#modify-credentials-for-mobility-service-installation).

## Insufficient privileges failure (ErrorID: 95518)

When domain trust relationship establishment between the primary domain and workstation fails while trying to sign in to the source machine, mobility agent installation fails with error ID 95518. So, ensure that the user account used to install mobility agent has administrative privileges to sign in through primary domain of the source machine.

If you wish to modify the credentials of chosen user account, follow the instructions given [here](vmware-azure-manage-configuration-server.md#modify-credentials-for-mobility-service-installation).

## Login Failures (ErrorID: 95519, 95520, 95521, 95522)

### Credentials of the user account have been disabled (ErrorID: 95519)

The user account chosen during Enable Replication has been disabled. To enable the user account, refer to the article [here](https://aka.ms/enable_login_user) or run the following command by replacing text *username* with the actual user name.
`net user 'username' /active:yes`

### Credentials locked out due to multiple failed login attempts (ErrorID: 95520)

Multiple failed retry efforts to access a machine will lock the user account. The failure can be due to:

* Credentials provided during Configuration setup are incorrect OR
* The user account chosen during Enable Replication is wrong

So, modify the credentials chosen by following the instructions given [here](vmware-azure-manage-configuration-server.md#modify-credentials-for-mobility-service-installation) and retry the operation after sometime.

### Logon servers are not available on the source machine (ErrorID: 95521)

This error occurs when the logon servers are not available on source machine. Unavailability of logon servers will lead to failure of login request and thus mobility agent cannot be installed. For successful Login, ensure that Logon servers are available on the source machine and start the Logon service. For detailed instructions, see the KB [139410](https://support.microsoft.com/en-in/help/139410/err-msg-there-are-currently-no-logon-servers-available) Err Msg: There are Currently No Logon Servers Available.

### Logon service isn't running on the source machine (ErrorID: 95522)

The login service isn't running on your source machine and caused failure of login request. So, mobility agent cannot be installed. To resolve, ensure that Logon service is running on the source machine for successful Login. To start the logon service, run the command "net start Logon" from command prompt or start "NetLogon" service from task manager.

## **Connectivity failure (ErrorID: 95117 & 97118)**

Configuration server/ scale-out process server tries to connect to the source VM to install Mobility agent. This error occurs when source machine is not reachable due to network connectivity issues. To resolve,

* Ensure you are able to ping your Source machine from the Configuration server. If you have chosen scale-out process server during enable replication, ensure you are able to ping your Source machine from process server.
  * From Source Server machine command line, use Telnet to ping the configuration server/ scale-out process server with https port (135) as shown below to see if there are any network connectivity issues or firewall port blocking issues.

     `telnet <CS/ scale-out PS IP address> <135>`
* Additionally, for **Linux VM**,
  * Check if latest openssh, openssh-server, and openssl packages are installed.
  * Check and ensure that Secure Shell (SSH) is enabled and is running on port 22.
  * SFTP services should be running. To enable SFTP subsystem and password authentication in the sshd_config file,
    * Sign in as root.
    * Go to /etc/ssh/sshd_config file, find the line that begins with PasswordAuthentication.
    * Uncomment the line, and change the value to yes
    * Find the line that begins with Subsystem, and uncomment the line
    * Restart the sshd service.
* A connection attempt could have failed if there is no proper response after a period of time, or established connection failed because connected host has failed to respond.
* It may be a Connectivity/network/domain related issue. It could also be due to DNS name resolving issue or TCP port exhaustion issue. Check if there are any such known issues in your domain.

## Connectivity failure (ErrorID: 95523)

This error occurs when the network in which the source machine resides is not found or might have been deleted or is no longer available. The only way to resolve the error is by ensuring that the network exists.

## File and Printer sharing services check (ErrorID: 95105 & 95106)

After connectivity check, verify if File and printer sharing service is enabled on your virtual machine. These settings are required to copy Mobility agent on to the source machine.

For **windows 2008 R2 and prior versions**,

* To enable file and print sharing through Windows Firewall,
  * Open control panel -> System and Security -> Windows Firewall -> on left pane, click Advanced settings -> click Inbound Rules in console tree.
  * Locate rules File and Printer Sharing (NB-Session-In) and File and Printer Sharing (SMB-In). For each rule, right-click the rule, and then click **Enable Rule**.
* To enable file sharing with Group Policy,
  * Go to Start, type gpmc.msc and search.
  * In the navigation pane, open the following folders: Local Computer Policy, User Configuration, Administrative Templates, Windows Components, and Network Sharing.
  * In the details pane, double-click **Prevent users from sharing files within their profile**. To disable the Group Policy setting, and enable the user's ability to share files, click Disabled. Click OK to save your changes. To learn more, see [Enable or disable File Sharing with Group Policy](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754359(v=ws.10)).

For **later versions**, follow the instructions provided in [Install the Mobility service for disaster recovery of VMware VMs and physical servers](vmware-azure-install-mobility-service.md) to enable file and printer sharing.

## Windows Management Instrumentation (WMI) configuration check (Error code: 95103)

After file and printer services check, enable WMI service for private, public, and domain profiles through firewall. These settings are required to complete remote execution on the source machine. To enable,

* Go to Control Panel, click Security, and then click Windows Firewall.
* Click Change Settings and then click the Exceptions tab.
* In the Exceptions window, select the check box for Windows Management Instrumentation (WMI) to enable WMI traffic through the firewall. 

You can also enable WMI traffic through the firewall at the command prompt. Use the following command
    `netsh advfirewall firewall set rule group="windows management instrumentation (wmi)" new enable=yes`
Other WMI troubleshooting articles could be found at the following articles.

* [Basic WMI testing](https://blogs.technet.microsoft.com/askperf/2007/06/22/basic-wmi-testing/)
* [WMI troubleshooting](https://msdn.microsoft.com/library/aa394603(v=vs.85).aspx)
* [Troubleshooting problems with WMI scripts and WMI services](https://technet.microsoft.com/library/ff406382.aspx#H22)

## Unsupported Operating Systems

Another most common reason for failure could be due to unsupported operating system. Ensure you are on the supported Operating System/Kernel version for successful installation of Mobility service. Avoid the usage of private patch.
To view the list of operating systems and kernel versions supported by Azure Site Recovery, refer to our [support matrix document](vmware-physical-azure-support-matrix.md#replicated-machines).

## Unsupported boot disk configurations (ErrorID: 95309, 95310, 95311)

### Boot and system partitions / volumes are not the same disk (ErrorID: 95309)

Before 9.20 version, boot and system partitions/ volumes on different disks was an unsupported configuration. 
From [9.20 version](https://support.microsoft.com/en-in/help/4478871/update-rollup-31-for-azure-site-recovery), this configuration is supported. Use latest version for this support.

### The boot disk is not available (ErrorID: 95310)

A virtual machine without a boot disk cannot be protected. This is to ensure smooth recovery of virtual machine during failover operation. Absence of boot disk results in failure to boot the machine after failover. Ensure that the virtual machine contains boot disk and retry the operation. Also, note that multiple boot disks on the same machine is not supported.

### Multiple Boot disks present on the source machine (ErrorID: 95311)

A virtual machine with multiple boot disks is not a [supported configuration](vmware-physical-azure-support-matrix.md#linux-file-systemsguest-storage).

## System partition on multiple disks (ErrorID: 95313)

Before 9.20 version, root partition or volume laid on multiple disks was an unsupported configuration. 
From [9.20 version](https://support.microsoft.com/en-in/help/4478871/update-rollup-31-for-azure-site-recovery), this configuration is supported. Use latest version for this support.

## Enable protection failed as device name mentioned in the GRUB configuration instead of UUID (ErrorID: 95320)

**Possible Cause:** </br>
The GRUB configuration files ("/boot/grub/menu.lst", "/boot/grub/grub.cfg", "/boot/grub2/grub.cfg" or "/etc/default/grub") may contain the value for the parameters **root** and **resume** as the actual device names instead of UUID. Site Recovery mandates UUID approach as devices name may change across reboot of the VM as VM may not come-up with the same name on failover resulting in issues. For example: </br>


- The following line is from the GRUB file **/boot/grub2/grub.cfg**. <br>
  *linux   /boot/vmlinuz-3.12.49-11-default **root=/dev/sda2**  ${extra_cmdline} **resume=/dev/sda1** splash=silent quiet showopts*


- The following line is from the GRUB file **/boot/grub/menu.lst**
  *kernel /boot/vmlinuz-3.0.101-63-default **root=/dev/sda2** **resume=/dev/sda1** splash=silent crashkernel=256M-:128M showopts vga=0x314*

If you observe the bold string above, GRUB has actual device names for the parameters "root" and "resume" instead of UUID.
 
**How to Fix:**<br>
The device names should be replaced with the corresponding UUID.<br>


1. Find the UUID of the device by executing the command "blkid \<device name>". For example:<br>
   ```
   blkid /dev/sda1
   /dev/sda1: UUID="6f614b44-433b-431b-9ca1-4dd2f6f74f6b" TYPE="swap"
   blkid /dev/sda2 
   /dev/sda2: UUID="62927e85-f7ba-40bc-9993-cc1feeb191e4" TYPE="ext3" 
   ```

2. Now replace the device name with its UUID in the format like "root=UUID=\<UUID>". For example, if we replace the device names with UUID for root and resume parameter mentioned above in the files "/boot/grub2/grub.cfg", "/boot/grub2/grub.cfg" or "/etc/default/grub: then the lines in the files look like. <br>
   *kernel /boot/vmlinuz-3.0.101-63-default **root=UUID=62927e85-f7ba-40bc-9993-cc1feeb191e4** **resume=UUID=6f614b44-433b-431b-9ca1-4dd2f6f74f6b** splash=silent crashkernel=256M-:128M showopts vga=0x314*
3. Restart the protection again

## Install Mobility Service completed with warning to reboot (ErrorID: 95265 & 95266)

Site Recovery mobility service has many components, one of which is called filter driver. Filter driver gets loaded into system memory only at a time of system reboot. It means that the filter driver fixes can only be realized when a new filter driver is loaded; which can happen only at the time of system reboot.

**Please note** that this is a warning and existing replication will work even after the new agent update. You can choose to reboot anytime you want to get the benefits of new filter driver but if you don't reboot the old filter driver keeps on working. So, after an update without reboot, apart from filter driver, **benefits of other enhancements and fixes in mobility service gets realized**. So, though recommended, it is not mandatory to reboot after every upgrade. For information on when a reboot is mandatory, set the [Reboot of source machine after mobility agent upgrade
](https://aka.ms/v2a_asr_reboot) section in Service updates in Azure Site Recovery.

> [!TIP]
>For best practices on scheduling upgrades during your maintenance window, see the [Support for latest OS/kernel versions](https://aka.ms/v2a_asr_upgrade_practice) in Service updates in Azure Site Recovery.

## LVM support from 9.20 version

Before 9.20 version, LVM was supported for data disks only. /boot should be on a disk partition and not be an LVM volume.

From [9.20 version](https://support.microsoft.com/en-in/help/4478871/update-rollup-31-for-azure-site-recovery), [OS disk on LVM](vmware-physical-azure-support-matrix.md#linux-file-systemsguest-storage) is supported. Use latest version for this support.

## Insufficient space (ErrorID: 95524)

When Mobility agent is copied on to the source machine, at least 100 MB free space is required. So, ensure that your source machine has required free space and retry the operation.

## VSS Installation failures

VSS installation is a part of Mobility agent installation. This service is used in the process of generating application consistent recovery points. Failures during VSS installation can occur due to multiple reasons. To identify the exact errors, refer to **c:\ProgramData\ASRSetupLogs\ASRUnifiedAgentInstaller.log**. Few common errors and the resolution steps are highlighted in the following section.

### VSS error -2147023170 [0x800706BE] - exit code 511

This issue is mostly seen when anti-virus software is blocking the operations of Azure Site Recovery services. To resolve this issue:

1. Exclude all folders mentioned [here](vmware-azure-set-up-source.md#azure-site-recovery-folder-exclusions-from-antivirus-program).
2. Follow the guidelines published by your anti-virus provider to unblock the registration of DLL in Windows.

### VSS error 7 [0x7] - exit code 511

This is a runtime error and is caused due to insufficient memory to install VSS. Ensure to increase the disk space for successful completion of this operation.

### VSS error -2147023824 [0x80070430] - exit code 517

This error occurs when Azure Site Recovery VSS Provider service is [marked for deletion](https://msdn.microsoft.com/library/ms838153.aspx). Try to install VSS manually on the source machine by running the following command line

`C:\Program Files (x86)\Microsoft Azure Site Recovery\agent>"C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\InMageVSSProvider_Install.cmd"`

### VSS error -2147023841 [0x8007041F] - exit code 512

This error occurs when Azure Site Recovery VSS Provider service database is [locked](https://msdn.microsoft.com/library/ms833798.aspx).Try to install VSS manually on the source machine by running the following command line

`C:\Program Files (x86)\Microsoft Azure Site Recovery\agent>"C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\InMageVSSProvider_Install.cmd"`

### VSS exit code 806

This error occurs when the user account used for installation does not have permissions to execute the CSScript command. Provide necessary permissions to the user account to execute the script and retry the operation.

### Other VSS errors

Try to install VSS provider service manually on the source machine by running the following command line

`C:\Program Files (x86)\Microsoft Azure Site Recovery\agent>"C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\InMageVSSProvider_Install.cmd"`



## VSS error - 0x8004E00F

This error is typically encountered during the installation of the mobility agent due to issues in DCOM and DCOM is in a critical state.

Use the following procedure to determine the cause of the error.

**Examine the installation logs**

1. Open the installation log located at c:\ProgramData\ASRSetupLogs\ASRUnifiedAgentInstaller.log.
2. The presence of the following error indicates this issue:

    Unregistering the existing application...
    Create the catalogue object
    Get the collection of Applications 

    ERROR:

    - Error code: -2147164145 [0x8004E00F]
    - Exit code: 802

To resolve the issue:

Contact the [Microsoft Windows platform team](https://aka.ms/Windows_Support) to obtain assistance with resolving the DCOM issue.

When the DCOM issue is resolved, reinstall the Azure Site Recovery VSS Provider manually using the following command:
 
**C:\Program Files (x86)\Microsoft Azure Site Recovery\agent>"C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\InMageVSSProvider_Install.cmd**
  
If application consistency is not critical for your Disaster Recovery requirements, you can bypass the VSS Provider installation. 

To bypass the Azure Site Recovery VSS Provider installation and manually install Azure Site Recovery VSS Provider post installation:

1. Install the mobility service. 
   > [!Note]
   > 
   > The Installation will fail at 'Post install configuration' step. 
2. To bypass the VSS installation:
   1. Open the Azure Site Recovery Mobility Service installation directory located at:
   
      C:\Program Files (x86)\Microsoft Azure Site Recovery\agent
   2. Modify the Azure Site Recovery VSS Provider installation scripts **nMageVSSProvider_Install** and **InMageVSSProvider_Uninstall.cmd** to always succeed by adding the following lines:
    
      ```     
      rem @echo off
      setlocal
      exit /B 0
      ```

3. Rerun the Mobility Agent installation manually. 
4. When the Installation succeeds and moves to the next step, **Configure**, remove the lines you added.
5. To install the VSS provider, open a command prompt as Administrator and run the following command:
   
    **C:\Program Files (x86)\Microsoft Azure Site Recovery\agent> .\InMageVSSProvider_Install.cmd**

9. Verify that the ASR VSS Provider is installed as a service in Windows Services and open the Component Service MMC to verify that ASR VSS Provider is listed.
10.	If the VSS Provider install continues to fail, work with CX to resolve the permissions errors in CAPI2.

## VSS Provider installation fails due to the cluster service being enabled on non-cluster machine

This issue causes the Azure Site Recovery Mobility Agent installation to fail during the ASAzure Site RecoveryR VSS Provider installation step due to an issue with COM+ that prevents the installation of the VSS provider.
 
### To identify the issue

In the log located on configuration server at C:\ProgramData\ASRSetupLogs\UploadedLogs\<date-time>UA_InstallLogFile.log, you will find the following exception:

COM+ was unable to talk to the Microsoft Distributed Transaction Coordinator (Exception from HRESULT: 0x8004E00F)

To resolve the issue:

1.	Verify that this machine is a non-cluster machine and that the cluster components are not being used.
3.	If the components are not being used, remove the cluster components from the machine.

## Drivers are missing on the Source Server

If the Mobility Agent installation fails, examine the logs under C:\ProgramData\ASRSetupLogs to determine if some of the required drivers are missing in some control sets.
 
To resolve the issue:
  
1. Using a registry editor such as regedit.msc, open the registry.
2. Open the HKEY_LOCAL_MACHINE\SYSTEM node.
3. In the SYSTEM node, locate the control Sets.
4. Open each control set and verify that following Windows drivers are present:

   - Atapi
   - Vmbus
   - Storflt
   - Storvsc
   - intelide
 
Reinstall any missing drivers.

## Next steps

[Learn how](vmware-azure-tutorial.md) to set up disaster recovery for VMware VMs.
