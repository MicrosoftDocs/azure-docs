---
title: Sign-in activity report error codes in the Azure Active Directory portal | Microsoft Docs
description: Reference of sign-in activity report error codes. 
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
ms.date: 07/12/2017
ms.author: markvi
ms.reviewer: dhanyahk

---
# Sign-in activity report error codes in the Azure Active Directory portal

With the information provided by the user sign-ins report, you find answers to questions such as:

- Who has signed-in using Azure Active Directory?
- Which apps were signed into?
- Which sign-ins were failures and if so why?

This topic lists the error codes and the related descriptions. 

## How can I display failed sign-ins? 

Your first entry point to all sign-in activities data is **[Sign-ins](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/SignIns)** in the **Activity** section of **Azure Active**.


![Sign-in activity](./media/active-directory-reporting-activity-sign-ins-errors/61.png "Sign-in activity")


In your sign-ins report, you can display all failed sign-ins by selecting **Failure** as **Sign-in status**.


![Sign-in activity](./media/active-directory-reporting-activity-sign-ins-errors/06.png "Sign-in activity")

Clicking an item in the displayed list, opens the **Activity Details: Sign-ins** blade. 
This view provides you with all the details that Azure Active Directory tracks about sign-ins, including the **sign-in error code** and a **failure reason**.

![Sign-in activity](./media/active-directory-reporting-activity-sign-ins-errors/05.png "Sign-in activity")


As an alternative to using the Azure portal to access the sign-ins data, you can also use the [reporting API](active-directory-reporting-api-getting-started-azure-portal.md).


The following section provides you with a complete overview of all possible errors and the related descriptions. 

## Error codes

| Error| Description |
| --- | --- |
| 50001| The service principal named X was not found in the tenant named Y. This can happen if the application has not been installed by the administrator of the tenant. Or Resource principal was not found in the directory or is invalid|
| 50008| SAML assertion are missing or misconfigured in the token.|
| 50011| The reply address is missing, misconfigured or does not match reply addresses configured for the application.|
| 50053| Account is locked because user tried to sign in too many times with an incorrect user ID or password.|
| 50054| Old password is used for authentication.|
| 50055| Invalid password, entered expired password.|
| 50057| User account is disabled.|
| 50058| No information about user's identity is found among provided credentials or User was not found in tenant or A silent sign-in request was sent but no user is signed in or Service was unable to authenticate the user.|
| 50074| Strong Authentication (second factor) is required|
| 50079| User needs to enroll for second factor authentication|
| 50126| Invalid username or password or Invalid on-premise username or password.|
| 50131| Used in various conditional access errors. E.g Bad Windows device state, request blocked due to suspicious activity, access policy and security policy decisions.|
| 50133| Session is invalid due to expiration or recent password change.|
| 50144| User's Active Directory password has expired.|
| 65001| Application X doesn't have permission to access application Y or the permission has been revoked. Or The user or administrator has not consented to use the application with ID X. Send an interactive authorization request for this user and resource. Or The user or administrator has not consented to use the application with ID X. Send an authorization request to your tenant admin to act on behalf of the App : Y for Resource : Z.|
| 65005| The application required resource access list does not contain applications discoverable by the resource or The client application has requested access to resource which was not specified in its required resource access list or Graph service returned bad request or resource not found.|
| 70001| The application named X was not found in the tenant named Y. This can happen if the application has not been installed by the administrator of the tenant or consented to by any user in the tenant. You might have sent your authentication request to the wrong tenant.|
| 80001| No Authentication Agent available.|
| 80002| Authentication Agent's password validation request timed out.|
| 80003| Invalid response received by Authentication Agent.|
| 80004| Incorrect User Principal Name (UPN) used in sign-in request.|
| 80005| Authentication Agent: Error occurred.|
| 80007| Authentication Agent unable to connect to Active Directory.|
| 80010| Authentication Agent unable to decrypt password.|
| 81001| User's Kerberos ticket is too large.|
| 81002| Unable to validate user's Kerberos ticket.|
| 81003| Unable to validate user's Kerberos ticket.|
| 81004| Kerberos authentication attempt failed.|
| 81008| Unable to validate user's Kerberos ticket.|
| 81009| Unable to validate user's Kerberos ticket.|
| 81010| Seamless SSO failed because the user's Kerberos ticket has expired or is invalid.|
| 81011| Unable to find user object based on information in the user's Kerberos ticket.|
| 81012| The user trying to sign in to Azure AD is different from the user signed into the device.|
| 81013| Unable to find user object based on information in the user's Kerberos ticket.|
| 90014| Used in various cases when an expected field is not present in the credential.|
| 90093| Graph returned with forbidden error code for the request.|



## Next steps

For more details, see the [Sign-in activity reports in the Azure Active Directory portal](active-directory-reporting-activity-sign-ins.md).

