---
title: 'Azure AD Connect: Seamless Single Sign-On - GDPR compliance | Microsoft Docs'
description: This article deals with Azure Active Directory (Azure AD) Seamless SSO and GDPR compliance.
services: active-directory
keywords: what is Azure AD Connect, GDPR, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: mtillman
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/12/2018
ms.author: billmath
---

# Azure AD Seamless Single Sign-On: GDPR compliance

## Overview

In May 2018, a European privacy law, the [General Data Protection Regulation (GDPR)](http://ec.europa.eu/justice/data-protection/reform/index_en.htm), is due to take effect. The GDPR imposes new rules on companies, government agencies, non-profits, and other organizations that offer goods and services to people in the European Union (EU), or that collect and analyze data tied to EU residents. The GDPR applies no matter where you are located. 

Microsoft products and services are available today to help you meet the GDPR requirements. Read more about Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trustcenter).

Azure AD Seamless SSO creates the following log type, which can contain EUII:

- Azure AD Connect trace log files.

GDPR compliance for Seamless SSO can be reached in two ways:

1.	Upon request, extract data for a person and remove data from that person from the installations.
2.	Ensure no data is retained beyond 48 hours.

We strongly recommend the second option as it is easier to implement and maintain. See following instructions for each log type:

### Delete Azure AD Connect trace log files

Check the contents of **%ProgramData%\AADConnect** folder and delete the trace log contents (**trace-\*.log** files) of this folder within 48 hours of installing or upgrading Azure AD Connect or modifying Seamless SSO configuration, as this action may create data covered by GDPR.

>[!IMPORTANT]
>Don’t delete the **PersistedState.xml** file in this folder, as this file is used to maintain the state of the previous installation of Azure AD Connect and is used when an upgrade installation is done. This file will never contain any data about a person and should never be deleted.

You can either review and delete these trace log files using Windows Explorer or you can use the following PowerShell script to perform the necessary actions:

```
$Files = ((Get-Item -Path "$env:programdata\aadconnect\trace-*.log").VersionInfo).FileName 
 
Foreach ($file in $Files) { 
    {Remove-Item -Path $File -Force} 
}
```

Save the script in a file with the ".PS1" extension. Run this script as needed.

To learn more about related Azure AD Connect GDPR requirements, see [this article](active-directory-aadconnect-gdpr.md).

### Note about Domain controller logs

If audit logging is enabled, this product may generate security logs for your Domain Controllers. To learn more about configuring audit policies, read this [article](https://technet.microsoft.com/library/dd277403.aspx).

## Next steps

- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-sso.md) - Learn how to resolve common issues with the feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
