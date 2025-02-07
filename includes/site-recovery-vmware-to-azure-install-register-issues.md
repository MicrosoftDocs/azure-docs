---
author: ankitaduttaMSFT
ms.service: azure-site-recovery
ms.topic: include
ms.date: 10/26/2018
ms.author: ankitadutta
---

### Installation failures
| **Sample error message** | **Recommended action** |
|--------------------------|------------------------|
|ERROR   Failed to load Accounts. Error: System.IO.IOException: Unable to read data from the transport connection when installing and registering the CS server.| Ensure that TLS 1.0 is enabled on the computer. |

### Registration failures
Registration failures can be debugged by reviewing the logs in the **%ProgramData%\ASRLogs** folder.

| **Sample error message** | **Recommended action** |
|--------------------------|------------------------|
|**09:20:06**:InnerException.Type: SrsRestApiClientLib.AcsException,InnerException.<br>Message: ACS50008: SAML token is invalid.<br>Trace ID: 0000aaaa-11bb-cccc-dd22-eeeeee333333<br>Correlation ID: aaaa0000-bb11-2222-33cc-444444dddddd><br>Timestamp: **2016-12-12 14:50:08Z<br>** | Ensure that the time on your system clock is not more than 15 minutes off the local time. Rerun the installer to complete the registration.|
|**09:35:27** :DRRegistrationException while trying to get all disaster recovery vault for the selected certificate: : Threw Exception.Type:Microsoft.DisasterRecovery.Registration.DRRegistrationException, Exception.Message: ACS50008: SAML token is invalid.<br>Trace ID: 2222cccc-33dd-eeee-ff44-aaaaaa555555<br>Correlation ID: bbbb1111-cc22-3333-44dd-555555eeeeee<br>Timestamp: **2016-05-19 01:35:39Z**<br> | Ensure that the time on your system clock is not more than 15 minutes off the local time. Rerun the installer to complete the registration.|
|06:28:45:Failed to create certificate<br>06:28:45:Setup cannot proceed. A certificate required to authenticate to Site Recovery cannot be created. Rerun Setup | Ensure that you're running setup as a local administrator. |
