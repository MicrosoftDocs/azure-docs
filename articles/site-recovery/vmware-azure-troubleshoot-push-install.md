---
title: Azure Site Recovery troubleshooting from VMware to Azure | Microsoft Docs
description: Troubleshoot errors when you replicate Azure virtual machines.
services: site-recovery
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.author: ramamill
ms.date: 07/06/2018


---
# Troubleshoot Mobility Service push installation issues

This article describes how to troubleshoot common errors you might face when you try to install Azure Site Recovery Mobility Service on the source server to enable protection.

## Error 78007 - The requested operation could not be completed
This error can be thrown by the service for several reasons. Choose the corresponding provider error to troubleshoot further.

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
95105 </br>**Message:** Push installation of Mobility Service to the source machine failed with error code **EP0856**. <br> Either **File and Printer Sharing** isn't allowed on the source machine or there are network connectivity problems between the process server and the source machine.| **File and Printer Sharing** isn't enabled. | Allow **File and Printer Sharing** on the source machine in Windows Firewall. On the source machine, under **Windows Firewall** > **Allow an app or feature through Firewall**, select **File and Printer Sharing for all profiles**. </br> In addition, check the following prerequisites to successfully finish the push installation.<br> Read more about [troubleshooting WMI issues](#troubleshoot-wmi-issues).


## Error 95107 - Protection could not be enabled (EP0858)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95107 </br>**Message:** Push installation of Mobility Service to the source machine failed with error code **EP0858**. <br> Either the credentials provided to install Mobility Service are incorrect or the user account has insufficient privileges. | User credentials provided to install Mobility Service on the source machine are incorrect. | Ensure that the user credentials provided for the source machine on the configuration server are correct. <br> To add or edit user credentials, go to the configuration server, and select **Cspsconfigtool** > **Manage account**. </br> In addition, check the following [prerequisites](vmware-azure-install-mobility-service.md#install-mobility-service-by-push-installation-from-azure-site-recovery) to successfully finish the push installation.


## Error 95117 - Protection could not be enabled (EP0865)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95117 </br>**Message:** Push installation of Mobility Service to the source machine failed with error code **EP0865**. <br> Either the source machine isn't running or there are network connectivity problems between the process server and the source machine. | Network connectivity problems between the process server and the source server. | Check connectivity between the process server and the source server. </br> In addition, check the following [prerequisites](vmware-azure-install-mobility-service.md#install-mobility-service-by-push-installation-from-azure-site-recovery) to successfully finish the push installation.|

## Error 95103 - Protection could not be enabled (EP0854)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95103 </br>**Message:** Push installation of Mobility Service to the source machine failed with error code **EP0854**. <br> Either Windows Management Instrumentation (WMI) isn't allowed on the source machine or there are network connectivity problems between the process server and the source machine.| WMI is blocked in Windows Firewall. | Allow WMI in Windows Firewall. Under **Windows Firewall** > **Allow an app or feature through Firewall**, select **WMI for all profiles**. </br> In addition, check the following [prerequisites](vmware-azure-install-mobility-service.md#install-mobility-service-by-push-installation-from-azure-site-recovery) to successfully finish the push installation.|

## Error 95213 - Protection could not be enabled (EP0874)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95213 </br>**Message:** Installation of Mobility Service to the source machine %SourceIP; failed with error code **EP0874**. <br> | The operating system version on the source machine isn't supported. <br>| Ensure that the source machine OS version is supported. Read the [support matrix](https://aka.ms/asr-os-support). </br> In addition, check the following [prerequisites](https://aka.ms/pushinstallerror) to successfully finish the push installation.| 


## Error 95108 - Protection could not be enabled (EP0859)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95108 </br>**Message:** Push installation of Mobility Service to the source machine failed with error code **EP0859**. <br>| Either the credentials provided to install Mobility Service are incorrect or the user account has insufficient privileges. <br>| Ensure that the credentials provided are the **root** account's credentials. To add or edit user credentials, go to the configuration server and select the **Cspsconfigtool** shortcut icon on the desktop. Select **Manage account** to add or edit credentials.|

## Error 95265 - Protection could not be enabled (EP0902)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95265 </br>**Message:** Push installation of Mobility Service to the source machine succeeded but the source machine requires a restart for some system changes to take effect. <br>| An older version of Mobility Service was already installed on the server.| Replication of the virtual machine continues seamlessly.<br> Reboot the server during your next maintenance window to get benefits of the new enhancements in Mobility Service.|


## Error 95224 - Protection could not be enabled (EP0883)

**Error code** | **Possible causes** | **Error-specific recommendations**
--- | --- | ---
95224 </br>**Message:** Push installation of Mobility Service to the source machine %SourceIP; failed with error code **EP0883**. A system restart from a previous installation or update is pending.| The system wasn't restarted when uninstalling an older or incompatible version of Mobility Service.| Ensure that no version of Mobility Service exists on the server. <br> Reboot the server, and rerun the enable protection job.|

## Resource to troubleshoot push installation problems

#### Troubleshoot file and print sharing issues
* [Enable or disable file sharing with Group Policy](https://technet.microsoft.com/library/cc754359(v=ws.10).aspx)
* [Enable file and print sharing through Windows Firewall](https://technet.microsoft.com/library/ff633412(v=ws.10).aspx)

#### Troubleshoot WMI issues
* [Basic WMI testing](https://blogs.technet.microsoft.com/askperf/2007/06/22/basic-wmi-testing/)
* [WMI troubleshooting](https://msdn.microsoft.com/library/aa394603(v=vs.85).aspx)
* [Troubleshooting problems with WMI scripts and WMI services](https://technet.microsoft.com/library/ff406382.aspx#H22)

## Next steps

[Learn how](vmware-azure-tutorial.md) to set up disaster recovery for VMware VMs.