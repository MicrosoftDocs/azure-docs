---
title: 'User Privacy and Microsoft Entra seamless single sign-on'
description: This article deals with Microsoft Entra seamless SSO and GDPR compliance.
services: active-directory
keywords: what is Azure AD Connect, GDPR, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: amycolannino
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---
# User Privacy and Microsoft Entra seamless single sign-on

[!INCLUDE [Privacy](../../../../includes/gdpr-intro-sentence.md)]

## Overview


Microsoft Entra seamless SSO creates the following log type, which can contain Personal Data: 

- Microsoft Entra Connect trace log files.

Improve user privacy for Seamless SSO in two ways:

1. Upon request, extract data for a person and remove data from that person from the installations.
2. Ensure no data is retained beyond 48 hours.

We strongly recommend the second option as it is easier to implement and maintain. See following instructions for each log type:

<a name='delete-azure-ad-connect-trace-log-files'></a>

### Delete Microsoft Entra Connect trace log files

Check the contents of **%ProgramData%\AADConnect** folder and delete the trace log contents (**trace-\*.log** files) of this folder within 48 hours of installing or upgrading Microsoft Entra Connect or modifying Seamless SSO configuration, as this action may create data covered by GDPR.

>[!IMPORTANT]
>Don’t delete the **PersistedState.xml** file in this folder, as this file is used to maintain the state of the previous installation of Microsoft Entra Connect and is used when an upgrade installation is done. This file will never contain any data about a person and should never be deleted.

You can either review and delete these trace log files using Windows Explorer or you can use the following PowerShell script to perform the necessary actions:

```powershell
$Files = ((Get-Item -Path "$env:programdata\aadconnect\trace-*.log").VersionInfo).FileName 
 
Foreach ($file in $Files) { 
    {Remove-Item -Path $File -Force} 
}
```

Save the script in a file with the ".PS1" extension. Run this script as needed.

To learn more about related Microsoft Entra Connect GDPR requirements, see [this article](reference-connect-user-privacy.md).

### Note about Domain controller logs

If audit logging is enabled, this product may generate security logs for your Domain Controllers. To learn more about configuring audit policies, read this [article](/previous-versions/tn-archive/dd277403(v=technet.10)).

## Next steps

* [Review the Microsoft Privacy policy on Trust Center](https://www.microsoft.com/trust-center)
  - [**Troubleshoot**](tshoot-connect-sso.md) - Learn how to resolve common issues with the feature.
  - [**UserVoice**](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789) - For filing new feature requests.
