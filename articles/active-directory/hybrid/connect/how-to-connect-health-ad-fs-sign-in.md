---
title: AD FS sign-ins in Azure AD with Connect Health
description: This document describes how to integrate AD FS sign-ins with the Azure AD Connect Health sign-ins report.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
ms.service: active-directory
ms.subservice: hybrid
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.author: billmath
ms.collection: M365-identity-device-management
---

# AD FS sign-ins in Azure AD with Connect Health - preview

AD FS sign-ins can now be integrated into the Azure Active Directory sign-ins report by using Connect Health. The [Azure AD sign-ins Report](../../reports-monitoring/concept-all-sign-ins.md) report includes information about when users, applications, and managed resources sign in to Azure AD and access resources. 

The Connect Health for AD FS agent correlates multiple Event IDs from AD FS, dependent on the server version, to provide information about the request and error details if the request fails. This information is correlated to the Azure AD sign-in report schema and displayed in the Azure AD sign-in report UX. Alongside the report, a new Log Analytics stream is available with the AD FS data and a new Azure Monitor Workbook template. The template can be used and modified for an in-depth analysis for scenarios such as AD FS account lockouts, bad password attempts, and spikes of unexpected sign-in attempts.

## Prerequisites
* Azure AD Connect Health for AD FS installed and upgraded to latest version (3.1.95.0 or later).
* Global administrator or reports reader role to view the Azure AD sign-ins

## What data is displayed in the report?
The data available mirrors the same data available for Azure AD sign-ins. Five tabs with information will be available based on the type of sign-in, either Azure AD or AD FS. Connect Health correlates events from AD FS, dependent on the server version, and matches them to the AD FS schema. 



#### User sign-ins 
Each tab in the sign-ins blade shows the default values below:
* Sign-in date
* Request ID
* User name or user ID
* Status of the sign-in
* IP Address of the device used for the sign-in
* Sign-In Identifier

#### Authentication Method Information
The following values may be displayed in the authentication tab. The authentication method is taken from the AD FS audit logs.

|Authentication Method|Description|
|-----|-----|
|Forms|Username/password authentication|
|Windows|Windows-integrated Authentication|
|Certificate|Authentication with SmartCard / VirtualSmart certificates|
|WindowsHelloForBusiness|This field is for auth with Windows Hello for Business. (Microsoft Passport Authentication)|
|Device | Displayed if Device Authentication is selected as “Primary” Authentication from intranet/extranet and Device Authentication is performed.  There is no separate user authentication in this scenario.| 
|Federated|AD FS did not do the authentication but sent it to a third party identity provider|
|SSO |If a single-sign-on token was used, this field will display. If the SSO has an MFA, it will show as Multifactor|
|Multifactor|If a single sign-on token has an MFA and that was used for authentication, this field will display as Multifactor|
|Azure MFA|Azure MFA is selected as the Additional Authentication Provider in AD FS and was used for authentication|
|ADFSExternalAuthenticationProvider|This field is if a third-party authentication provider was registered and used for authentication|


#### AD FS Additional Details
The following details are available for AD FS sign-ins:
* Server Name
* IP Chain
* Protocol

### Enabling Log Analytics and Azure Monitor
Log Analytics can be enabled for the AD FS sign-ins and can be used with any other Log Analytics integrated components, such as Sentinel.

> [!NOTE] 
> AD FS sign-ins may increase Log Analytics cost significantly, depending on the amount of sign-ins to AD FS in  your organization. To enable and disable Log Analytics, select the checkbox for the stream.

To enable Log Analytics for the feature, navigate to the Log Analytics blade and select "ADFSSignIns" stream. This selection will allow AD FS sign-ins to flow into Log Analytics.

To access the updated Azure Monitor Workbook template, navigate to "Azure Monitor Templates", and select the "sign-ins" Workbook.
For more information about Workbooks, visit [Azure Monitor Workbooks](https://aka.ms/adfssigninspreview).




### Frequently Asked Questions
***What are the types of sign-ins that I may see?***
The sign-in report supports sign-ins through O-Auth, WS-Fed, SAML, and WS-Trust protocols. 

***How are different types of sign-ins shown in the sign-in report?***
If a Seamless SSO sign-in is performed, there will be one row for the sign-in with one correlation ID.
If a single factor authentication is performed, two rows will be populated with the same correlation ID, but with two different authentication methods (i.e. Forms, SSO).
In cases of Multi Factor Authentication, there will be three rows with a shared correlation ID and three corresponding Authentication Methods (i.e. Forms, AzureMFA, Multifactor). In this particular example, the multifactor in this case shows that the SSO has an MFA.

***What are the errors that I can see in the report?***
For a full list of AD FS related errors that are populated in the sign-in report and descriptions, visit [AD FS Help Error Code Reference](https://adfshelp.microsoft.com/References/ConnectHealthErrorCodeReference)

***I am seeing “00000000-0000-0000-0000-000000000000” in the “User” section of a sign-in. What does that 
mean?***
If the sign-in failed and the attempted UPN does not match an existing UPN, the “User”, “Username”, and “User ID” 
fields will be “00000000-0000-0000-0000-000000000000” and the “Sign-in Identifier” will be populated with 
the attempted value the user entered. In these cases, the user attempting to sign-in does not exist.

***How can I correlate my on-premises events to the Azure AD sign-ins report?***
The Azure AD Connect Health agent for AD FS correlates event IDs from AD FS dependent on server version. The events will be available on the Security Log of the AD FS servers. 

***Why do I see NotSet or NotApplicable in the Application ID/Name for some AD FS sign-ins?***
The AD FS sign-in report will display OAuth Ids in the Application ID field for OAuth sign-ins. In the WS-Fed, WS-Trust sign-in scenarios, the application ID will be NotSet or NotApplicable and the Resource IDs and Relying Party identifiers will be present in the Resource ID field.

***Why do I see Resource ID and Resource Name fields as "Not Set"?***
The ResourceId/Name fields will be "NotSet" in some error cases, such as "Username and Password incorrect" and in WSTrust based failed sign-ins.

***Are there any more known issues with the report in preview?***
The report has a known issue where the "Authentication Requirement" field in the "Basic Info" tab will be populated as a single factor authentication value for AD FS sign-ins regardless of the sign-in. Additionally, the Authentication Details tab will display "Primary or Secondary" under the Requirement field, with a fix in progress to differentiate Primary or Secondary authentication types.


## Related links
* [Azure AD Connect Health](./whatis-azure-ad-connect.md)
* [Azure AD Connect Health Agent Installation](how-to-connect-health-agent-install.md)
* [Risky IP report](how-to-connect-health-adfs-risky-ip.md)
