<properties 
   pageTitle="Troubleshoot a deployed StorSimple device | Microsoft Azure"
   description="Describes how to diagnose and fix errors that occur on a StorSimple device that is currently deployed and operational."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="carolz"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="08/31/2015"
   ms.author="v-sharos" />

# Troubleshoot an operational StorSimple device

## Overview

This article provides helpful troubleshooting guidance for resolving configuration issues that you might encounter after your StorSimple device is deployed and operational. It describes common issues, possible causes, and recommended steps to help you resolve problems that you might experience when you run Microsoft Azure StorSimple. This information applies to both the StorSimple on-premises physical device and the StorSimple virtual device.

At the end of this article you can find a list of error codes that you might encounter during Microsoft Azure StorSimple operation, as well as steps you can take to resolve the errors. 

## Setup wizard process for operational devices

You use the setup wizard ([Invoke-HcsSetupWizard][1]) to check the device configuration and take corrective action if necessary.

When you run the setup wizard on a previously configured and operational device, the process flow is different. You can change only the following entries:

- IP address, subnet mask, and gateway
- Primary DNS server
- Primary NTP server
- Optional web proxy configuration

The setup wizard does not perform the operations related to password collection and device registration.

## Errors that occur during subsequent runs of the setup wizard

The following table describes the errors that you might encounter when you run the setup wizard on an operational device, possible causes for the errors, and recommended actions to resolve them. 

| No. | Error message or condition | Possible causes | Recommended action |
|:--- |:-------------------------- |:--------------- |:------------------ |
|  1  | Error 350032: This device has already been deactivated. | You will see this error if you run the setup wizard on a device that is deactivated. | [Contact Microsoft Support](storsimple-contact-microsoft-support.md) for next steps. A deactivated device cannot be put in service. A factory reset may be required before the device can be activated again. |
|  2  | Invoke-HcsSetupWizard : ERROR_INVALID_FUNCTION(Exception from HRESULT: 0x80070001) | The DNS server update is failing. DNS settings are global settings and are applied across all the enabled network interfaces. | Enable the interface and apply the DNS settings again. This may disrupt the network for other enabled interfaces because these settings are global. |
|  3  | The device appears to be online in the StorSimple Manager service portal, but when you try to complete the minimum setup and save the configuration, the operation fails. | During initial setup, the web proxy was not configured, even though there was an actual proxy server in place. | Use the [Test-HcsmConnection cmdlet][2] to locate the error. [Contact Microsoft Support](storsimple-contact-microsoft-support.md) if you are unable to correct the problem. |
|  4  | Invoke-HcsSetupWizard: Value does not fall within the expected range. | An incorrect subnet mask produces this error. Possible causes are: <ul><li> The subnet mask is missing or empty.</li><li>The Ipv6 prefix format is incorrect.</li><li>The interface is cloud-enabled, but the gateway is missing or incorrect.</li></ul>Note that DATA 0 is automatically cloud-enabled if configured through the setup wizard. | To determine the problem, use subnet 0.0.0.0 or 256.256.256.256, and then look at the output. Enter correct values for the subnet mask, gateway, and Ipv6 prefix, as needed. |
 
## Error codes

Errors are listed in numeric order.

|Error Number|Error text or description|Recommended user action|
|:---|:---|:---|
|10502|An error was encountered while accessing your storage account.|Wait for a few minutes and then try again. If the error persists, please Contact Microsoft Support for next steps.|
|40017|Unable to resolve a disk in a backup set.|If the error persists, please Contact Microsoft Support for next steps.|
|40018|Unable to resolve any of the disks in  backup set.|If the error persists, please Contact Microsoft Support for next steps.|
|390061|The system is busy or unavailable.|Wait for a few minutes and then try again. If the error persists, please Contact Microsoft Support for next steps.|
|390143|An error has occurred with error code 390143. (Unknown error.)|If the error persists, please contact Microsoft Support for next steps.|

## Next steps

If you are unable to resolve the problem, [contact Microsoft Support](storsimple-contact-microsoft-support.md) for assistance. 


[1]: https://technet.microsoft.com/en-us/%5Clibrary/Dn688135(v=WPS.630).aspx
[2]: https://technet.microsoft.com/en-us/%5Clibrary/Dn715782(v=WPS.630).aspx
