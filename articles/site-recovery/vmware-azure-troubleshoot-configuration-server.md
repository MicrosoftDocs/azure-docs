---
title: Troubleshoot issues with the configuration server during disaster recovery of VMware VMs and physical servers to Azure with Azure Site Recovery | Microsoft Docs
description: This article provides troubleshooting information for deploying the configuration server for disaster recovery of VMware VMs and physical servers to Azure with Azure Site Recovery.
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 11/11/2018
ms.author: ramamill

---
# Troubleshoot configuration server issues

This article helps you troubleshoot issues when deploying and managing the [Azure Site Recovery](site-recovery-overview.md) configuration server. The configuration server is used when setting up disaster recovery for on-premises VMware VMs and physical servers to Azure using Site Recovery. 

## Installation failures

| **Error message** | **Recommended action** |
|--------------------------|------------------------|
|ERROR   Failed to load Accounts. Error: System.IO.IOException: Unable to read data from the transport connection when installing and registering the CS server.| Ensure that TLS 1.0 is enabled on the computer. |

## Registration failures

Registration failures can be debugged using the l<br/ogs in the %ProgramData%\ASRLogs folder.

Registration failures can be debugged by reviewing the logs in the **%ProgramData%\ASRLogs** folder.

| **Error message** | **Recommended action** |
|--------------------------|------------------------|
|**09:20:06**:InnerException.Type: SrsRestApiClientLib.AcsException,InnerException.<br>Message: ACS50008: SAML token is invalid.<br>Trace ID: 1921ea5b-4723-4be7-8087-a75d3f9e1072<br>Correlation ID: 62fea7e6-2197-4be4-a2c0-71ceb7aa2d97><br>Timestamp: **2016-12-12 14:50:08Z<br>** | Ensure that the time on your system clock is not more than 15 minutes off the local time. Rerun the installer to complete the registration.|
|**09:35:27** :DRRegistrationException while trying to get all disaster recovery vault for the selected certificate: : Threw Exception.Type:Microsoft.DisasterRecovery.Registration.DRRegistrationException, Exception.Message: ACS50008: SAML token is invalid.<br>Trace ID: e5ad1af1-2d39-4970-8eef-096e325c9950<br>Correlation ID: abe9deb8-3e64-464d-8375-36db9816427a<br>Timestamp: **2016-05-19 01:35:39Z**<br> | Ensure that the time on your system clock is not more than 15 minutes off the local time. Rerun the installer to complete the registration.|
|06:28:45:Failed to create certificate<br>06:28:45:Setup cannot proceed. A certificate required to authenticate to Site Recovery cannot be created. Rerun Setup | Ensure you are running setup as a local administrator. |
