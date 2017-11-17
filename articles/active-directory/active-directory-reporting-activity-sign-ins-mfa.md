---
title: Reference for multi-factor authentication reporting in the Azure portal | Microsoft Docs
description: Reference information for multi-factor authentication reporting in the Azure portal 
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 4b18127b-d1d0-4bdc-8f9c-6a4c991c5f75
ms.service: active-directory
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/24/2017
ms.author: markvi
ms.reviewer: dhanyahk

---
# Reference for multi-factor authentication reporting in the Azure portal

With [Azure Active Directory (Azure AD) reporting](active-directory-reporting-azure-portal.md) in the [Azure portal](https://portal.azure.com), you can get the information you need to determine how your environment is doing.

The [sign-in activity reports](active-directory-reporting-activity-sign-ins.md) provide you with information about the usage of managed applications and user sign-in activities, which includes information about the multi-factor authentication (MFA) usage. 

The MFA data gives you insights into how MFA is working in your organization. It enables you to to answer questions like: 

- Was the sign-in challenged with MFA? 

- How did the user complete MFA? 

- Why was the user unable to complete MFA?  

By aggregating the all sign-in data, you can have a better understanding of the MFA experience within your organization. The data helps you to answer questions like: 

- How many users are challenged for MFA?  

- How many users are unable to complete the MFA challenge? 

- What are the common MFA issues end users are running into? 


This data is available through the Azure portal and the [reporting API](active-directory-reporting-api-getting-started-azure-portal.md). 


## Data structure


The sign-in activity reports for MFA give you access to the following information:

**MFA required:** Whether MFA is required for the sign-in or not. MFA can be required due to per-user MFA, conditional access or other reasons. Possible values are `Yes` or `No`.

**MFA authentication method:** The authentication method the user used to complete MFA. Possible values are: 

- Text message 

- Mobile app notification 

- Phone call (Authentication phone) 

- Mobile app verification code 

- Phone call (Office phone) 

- Phone call (Alternate authentication phone) 

**MFA authentication detail:** Scrubbed version of the phone number, for example: +X XXXXXXXX64. 

**MFA Result:** More information on whether MFA was satisfied or denied:

- If MFA was satisfied, this column provides more information about how MFA was satisfied. 

- If MFA was denied, this column would provide the reason for denial. Possible values are `Satisfied` or `Denied`. 

The following section lists possible string values for the MFA result field.

## Status strings

This section lists the possible values for MFA result status string.

### Satisfied status strings


- Azure Multi-Factor Authentication

    - completed in the cloud 

    - has expired due to the policies configured on tenant 

    - registration prompted 

    - satisfied by claim in the token 

    - satisfied by claim in the token 

    - satisfied by claim in the token 

    - satisfied by claim in the token 

    - satisfied by claim provided by external provider 

    - satisfied by strong authentication 

    - skipped as flow exercised was Windows broker logon flow 

    - skipped as flow exercised was Windows broker logon flow 

    - skipped due to app password 

    - skipped due to location 

    - skipped due to registered device 
    
    - skipped due to remembered device 

    - successfully completed 

- Redirected to external provider for multi-factor authentication 

 
### Denied status strings

Azure Multi-Factor Authentication denied; 

- authentication in-progress 

- duplicate authentication attempt 

- entered incorrect code too many times 

- invalid authentication 

- invalid mobile app verification code 

- misconfiguration 

- phone call went to voicemail 

- phone number has an invalid format 

- service error 

- unable to reach the user’s phone 

- unable to send the mobile app notification to the device 

- unable to send the mobile app notification 

- user declined the authentication 

- user did not respond to mobile app notification 

- user does not have any verification methods registered 

- user entered incorrect code 

- user entered incorrect PIN 

- user hung up the phone call without succeeding the authentication 

- user is blocked 

- user never entered the verification code 

- user not found 
 
- verification code already used once 



## Next steps

For more information, see [Azure Active Directory reporting](active-directory-reporting-azure-portal.md).




























