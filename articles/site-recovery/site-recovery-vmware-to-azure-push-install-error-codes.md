---
title: Azure Site Recovery troubleshooting from VMware to Azure | Microsoft Docs
description: Troubleshoot errors when replicating Azure virtual machines
services: site-recovery
documentationcenter: ''
author: asgang
manager: srinathv
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/28/2017
ms.author: asgang

---
# Troubleshoot Mobility Service push installation issues

This article describes common problems you might face when you try to install the Azure Site Recovery Mobility Service on the source server to enable protection.

## Error 78007 - The requested operation could not be completed
This error can be thrown by the service for multiple reasons. Choose the corresponding provider error to troubleshoot further.

* [Error 95103](#error-95103---protection-could-not-be-enabled-ep0854) 
* [Error 95105](#error-95105---protection-could-not-be-enabled-ep0856) 
* [Error 95107](#error-95107---protection-could-not-be-enabled-ep0858) 
* [Error 95108](#error-95108---protection-could-not-be-enabled-ep0859) 
* [Error 95117](#error-95117---protection-could-not-be-enabled-ep0865) 
* [Error 95213](#error-95213---protection-could-not-be-enabled-ep0874) 
* [Error 95224](#error-95224---protection-could-not-be-enabled-ep0883) 
* [Error 95265](#error-95265---protection-could-not-be-enabled-ep0902) 


## Error 95105 - Protection could not be enabled (EP0856)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95105 </br>**Message:** Push installation of the Mobility Service to the source machine failed with error code **EP0856**. <br> Either **File and Printer Sharing** isn't allowed on the source machine or there are network connectivity problems between the process server and the source machine.| **File and Printer Sharing** isn't enabled. | Allow **File and Printer Sharing** on the source machine in Windows Firewall. On the source machine, under **Windows Firewall** > **Allow an app or feature through Firewall**, select **File and Printer Sharing for all profiles**. </br> In addition, check the following prerequisites to successfully finish the push installation.<br> Read more about [troubleshooting WMI isssues](#troubleshoot-wmi-issues)


## Error 95107 - Protection could not be enabled (EP0858)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95107 </br>**Message:** Push installation of the Mobility Service to the source machine failed with error code **EP0858**. <br> Either the credentials provided to install the Mobility Service are incorrect or the user account has insufficient privileges. | User credentials provided to install the Mobility Service on the source machine are incorrect. | Ensure the user credentials provided for the source machine on the configuration server are correct. <br> To add/edit user credentials, go to the configuration server, and select **Cspsconfigtool** > **Manage account**. </br> In addition, check the following [prerequisites](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-by-push-installation-from-azure-site-recovery) to successfully finish the push installation.


## Error 95117 - Protection could not be enabled (EP0865)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95117 </br>**Message:** Push installation of the Mobility Service to the source machine failed with error code **EP0865**. <br> Either the source machine isn't running or there are network connectivity problems between the process server and the source machine. | Network connectivity problems between the process server and the source server. | Check connectivity between the process server and the source server. </br> In addition, check the following [prerequisites](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-by-push-installation-from-azure-site-recovery) to successfully finish the push installation.|

## Error 95103 - Protection could not be enabled (EP0854)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95103 </br>**Message:** Push installation of the Mobility Service to the source machine failed with error code **EP0854**. <br> Either Windows Management Instrumentation (WMI) isn't allowed on the source machine or there are network connectivity problems between the process server and the source machine.| WMI is blocked in Windows Firewall. | Allow WMI in Windows Firewall. Under **Windows Firewall** > **Allow an app or feature through Firewall**, select **WMI for all profiles**. </br> In addition, check the following [prerequisites](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-by-push-installation-from-azure-site-recovery) to successfully finish the push installation.|

## Error 95213 - Protection could not be enabled (EP0874)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95213 </br>**Message:** Installation of the mobility service failed on the source machine %SourceIP; failed with error code **EP0874**. <br> | Operating System version on the source machine is not supported. <br>| Ensure that the source machine OS version is supported. Read the [support matrix](https://aka.ms/asr-os-support). </br> In addition, check the following [prerequisites](https://aka.ms/pushinstallerror) to successfully finish the push installation.| 


## Error 95108 - Protection could not be enabled (EP0859)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95108 </br>**Message:** Push installation of the mobility service to the source machine failed with error code **EP0859**. <br>| Either that the credentials provided to install mobility service is incorrect or the user account has insufficient privileges <br>| Ensure that the credentials provided are the **root** account's credentials. To [add/edit user credentials](site-recovery-vmware-to-azure-manage-configuration-server.md#modify-user-accounts-and-passwords), go to the Configuration server and click on "Cspsconfigtool" shortcut icon on desktop. Click on "Manage account" to add/edit credentials.|

## Error 95265 - Protection could not be enabled (EP0902)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95265 </br>**Message:** Push installation of the mobility service to the source machine succeeded but source machine requires a restart for some system changes to take effect. <br>| An older version of the mobility service was already installed on the server.| Replication of the virtual machine continues seamlessly.<br> Reboot the server during your next maintenance window to get benefits of the new enhancements in mobility service.|


## Error 95224 - Protection could not be enabled (EP0883)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95224 </br>**Message:** Push installation of the mobility service to the source machine %SourceIP; failed with error code EP0883. A system restart from a previous installation / update is pending.| The system was not restarted uninstalling a older/incompatible version of mobility service.| Ensure that no version of mobility service exists on the server. <br> Reboot the server and rerun the enable protection job|

## Resource to troubleshoot push installation problems

#### Troubleshoot File and Print Sharing issues
*  [Enable or disable File sharing with Group Policy](https://technet.microsoft.com/en-us/library/cc754359(v=ws.10).aspx)
* [How to enable File and Print sharing through Windows Firewall](https://technet.microsoft.com/en-us/library/ff633412(v=ws.10).aspx)

#### Troubleshoot WMI issues
* [Basic WMI Testing](https://blogs.technet.microsoft.com/askperf/2007/06/22/basic-wmi-testing/)
* [WMI Troubleshooting](https://msdn.microsoft.com/en-us/library/aa394603(v=vs.85).aspx)
* [Troubleshooting problems with WMI scripts and WMI Services](https://technet.microsoft.com/en-us/library/ff406382.aspx#H22)

## Next steps
- [Enable replication for VMware virtual machines](vmware-walkthrough-enable-replication.md)
