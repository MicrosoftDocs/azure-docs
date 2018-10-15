---
title: Troubleshoot Mobility Service push installation failures during Enable Replication(VMware to Azure) | Microsoft Docs
description: Troubleshoot mobility service/push installation errors when you replicate Azure virtual machines.
services: site-recovery
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.author: ramamill
ms.date: 09/19/2018


---
# Troubleshoot Mobility Service push installation issues

Installation of Mobility service is a key step during Enable Replication. The success of this step depends solely on meeting prerequisites and working with supported configurations. The most common failures you face during Mobility service installation are due to

* Credential/Privilege errors
* Connectivity errors
* Unsupported Operating systems

When you enable replication, Azure Site Recovery tries to push install mobility service agent on your virtual machine. As part of this, Configuration server tries to connect with the virtual machine and copy the Agent. To enable successful installation, follow the step by step troubleshooting guidance given below.

## Credentials check (ErrorID: 95107 & 95108)

* Verify if the user account chosen during enable replication is **valid, accurate**.
* Azure Site Recovery requires **administrator privilege** to perform push installation.
  * For Windows, verify if the user account has administrative access, either local or domain, on the source machine.
  * If you are not using a domain account, you need to disable Remote User Access control on the local computer.
    * To disable Remote User Access control, under HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System registry key, add a new DWORD: LocalAccountTokenFilterPolicy. Set the value to 1. To execute this step, run the following command from command prompt:

         `REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1`
  * For Linux, you must choose the root account for successful installation of mobility agent.

If you wish to modify the credentials of chosen user account, follow the instructions given [here](vmware-azure-manage-configuration-server.md#modify-credentials-for-mobility-service-installation).

## **Connectivity check (ErrorID: 95117 & 97118)**

* Ensure you are able to ping your Source machine from the Configuration server. If you have chosen scale-out process server during enable replication, ensure you are able to ping your Source machine from process server.
  * From Source Server machine command line, use Telnet to ping the configuration server/ scale-out process server with https port (default 9443) as shown below to see if there are any network connectivity issues or firewall port blocking issues.

     `telnet <CS/ scale-out PS IP address> <port>`

  * If you are unable to connect, allow inbound port 9443 on the configuration server/ scale-out process server.
  * Check the status of service **InMage Scout VX Agent – Sentinel/Outpost**. Start the service, if it is not running.

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
* It may be a Connectivity/network/domain related issue. It could also be due to DNS name resolving issue or TCP port exhaustion issue. Please check if there are any such known issues in your domain.

## File and Printer sharing services check (ErrorID: 95105 & 95106)

After connectivity check, verify if File and printer sharing service is enabled on your virtual machine.

For **windows 2008 R2 and prior versions**,

* To enable file and print sharing through Windows Firewall,
  * Open control panel -> System and Security -> Windows Firewall -> on left pane, click Advanced settings -> click Inbound Rules in console tree.
  * Locate rules File and Printer Sharing (NB-Session-In) and File and Printer Sharing (SMB-In). For each rule, right-click the rule, and then click **Enable Rule**.
* To enable file sharing with Group Policy,
  * Go to Start, type gpmc.msc and search.
  * In the navigation pane, open the following folders: Local Computer Policy, User Configuration, Administrative Templates, Windows Components, and Network Sharing.
  * In the details pane, double-click **Prevent users from sharing files within their profile**. To disable the Group Policy setting, and enable the user's ability to share files, click Disabled. Click OK to save your changes. To learn more, click [here](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754359(v=ws.10)).

For **later versions**, follow the instructions provided [here](vmware-azure-install-mobility-service.md#install-mobility-service-by-push-installation-from-azure-site-recovery) to enable file and printer sharing

## Windows Management Instrumentation (WMI) configuration check

After file and printer services check, enable WMI service through firewall.

* In the Control Panel, click Security and then click Windows Firewall.
* Click Change Settings and then click the Exceptions tab.
* In the Exceptions window, select the check box for Windows Management Instrumentation (WMI) to enable WMI traffic through the firewall. 

You can also enable WMI traffic through the firewall at the command prompt. Use the following command
    `netsh advfirewall firewall set rule group="windows management instrumentation (wmi)" new enable=yes`
Other WMI troubleshooting articles could be found at the following articles.

* [Basic WMI testing](https://blogs.technet.microsoft.com/askperf/2007/06/22/basic-wmi-testing/)
* [WMI troubleshooting](https://msdn.microsoft.com/library/aa394603(v=vs.85).aspx)
* [Troubleshooting problems with WMI scripts and WMI services](https://technet.microsoft.com/library/ff406382.aspx#H22)

## Unsupported Operating Systems

Another most common reason for failure could be due to unsupported operating system. Ensure you are on the supported Operating System/Kernel version for successful installation of Mobility service.

To learn about which operating systems are supported by Azure Site Recovery, refer to our [support matrix document](vmware-physical-azure-support-matrix.md#replicated-machines).

## Next steps

[Learn how](vmware-azure-tutorial.md) to set up disaster recovery for VMware VMs.