---
title: Troubleshoot publisher verification
description: Describes how to troubleshoot publisher verification for the Microsoft identity platform by calling Microsoft Graph APIs.
services: active-directory
author: rwike77
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: troubleshooting
ms.workload: identity
ms.date: 03/16/2023
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: xurobert
---

# Troubleshoot publisher verification
If you're unable to complete the process or are experiencing unexpected behavior with [publisher verification](publisher-verification-overview.md), you should start by doing the following if you're receiving errors or seeing unexpected behavior: 

1. Review the [requirements](publisher-verification-overview.md#requirements) and ensure they've all been met.

2. Review the instructions to [mark an app as publisher verified](mark-app-as-publisher-verified.md) and ensure all steps have been performed successfully.

3. Review the list of [common issues](#common-issues).

4. Reproduce the request using [Graph Explorer](#making-microsoft-graph-api-calls) to gather more info and rule out any issues in the UI.

## Common Issues
Below are some common issues that may occur during the process. 

- **I don’t know my Microsoft Partner Network ID (MPN ID) or I don’t know who the primary contact for the account is.** 
    1. Navigate to the [MPN enrollment page](https://partner.microsoft.com/dashboard/account/v3/enrollment/joinnow/basicpartnernetwork/new).
    2. Sign in with a user account in the org's primary Azure AD tenant. 
    3. If an MPN account already exists, this is recognized and you are added to the account. 
    4. Navigate to the [partner profile page](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) where the MPN ID and primary account contact will be listed.

- **I don’t know who my Azure AD Global Administrator (also known as company admin or tenant admin) is, how do I find them? What about the Application Administrator or Cloud Application Administrator?**
    1. Sign in to the [Azure portal](https://portal.azure.com) using a user account in your organization's primary tenant.
    1. Browse to **Azure Active Directory** > [Roles and administrators](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RolesAndAdministrators).
    3. Select the desired admin role.
    4. The list of users assigned that role will be displayed.

- **I don't know who the admin(s) for my MPN account are**
    Go to the [MPN User Management page](https://partner.microsoft.com/pcv/users) and filter the user list to see what users are in various admin roles.

- **I am getting an error saying that my MPN ID is invalid or that I do not have access to it.**
    Follow the [remediation guidance](#mpnaccountnotfoundornoaccess).

- **When I sign in to the Azure portal, I do not see any apps registered. Why?** 
    Your app registrations may have been created using a different user account in this tenant, a personal/consumer account, or in a different tenant. Ensure you're signed in with the correct account in the tenant where your app registrations were created.

- **I'm getting an error related to multi-factor authentication. What should I do?** 
    Ensure [multi-factor authentication](../fundamentals/concept-fundamentals-mfa-get-started.md) is enabled and **required** for the user you're signing in with and for this scenario. For example, MFA could be:
    - Always required for the user you're signing in with.
    - [Required for Azure management](../conditional-access/howto-conditional-access-policy-azure-management.md).
    - [Required for the type of administrator](../conditional-access/howto-conditional-access-policy-admin-mfa.md) you're signing in with.

## Making Microsoft Graph API calls 

If you're having an issue but unable to understand why based on what you are seeing in the UI, it may be helpful to perform further troubleshooting by using Microsoft Graph calls to perform the same operations you can perform in the App Registration portal.

The easiest way to make these requests is to use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). You may also consider other options like using [Postman](https://www.postman.com/), or using PowerShell to [invoke a web request](/powershell/module/microsoft.powershell.utility/invoke-webrequest).  

You can use Microsoft Graph to both set and unset your app’s verified publisher and check the result after performing one of these operations. The result can be seen on both the [application](/graph/api/resources/application) object corresponding to your app registration and any [service principals](/graph/api/resources/serviceprincipal) that have been instantiated from that app. For more information on the relationship between those objects, see: [Application and service principal objects in Azure Active Directory](app-objects-and-service-principals.md).  

Here are examples of some useful requests:  

### Set Verified Publisher 

Request

```
POST /applications/0cd04273-0d11-4e62-9eb3-5c3971a7cbec/setVerifiedPublisher 

{ 

    "verifiedPublisherId": "12345678" 

} 
```
 
Response 
```
204 No Content 
```
> [!NOTE]
> *verifiedPublisherID* is your MPN ID. 

### Unset Verified Publisher 

Request:  
```
POST /applications/0cd04273-0d11-4e62-9eb3-5c3971a7cbec/unsetVerifiedPublisher 
```
 
Response 
```
204 No Content 
```
### Get Verified Publisher info from Application 
 
```
GET https://graph.microsoft.com/v1.0/applications/0cd04273-0d11-4e62-9eb3-5c3971a7cbec 

HTTP/1.1 200 OK 

{ 
    "id": "0cd04273-0d11-4e62-9eb3-5c3971a7cbec", 

    ... 

    "verifiedPublisher" : { 
        "displayName": "myexamplePublisher", 
        "verifiedPublisherId": "12345678", 
        "addedDateTime": "2019-12-10T00:00:00" 
    } 
} 
```

### Get Verified Publisher info from Service Principal 
```
GET https://graph.microsoft.com/v1.0/servicePrincipals/010422a7-4d77-4f40-9335-b81ef5c23dd4 

HTTP/1.1 200 OK 

{ 
    "id": "010422a7-4d77-4f40-9335-b81ef5c22dd4", 

    ... 

    "verifiedPublisher" : { 
        "displayName": "myexamplePublisher", 
        "verifiedPublisherId": "12345678", 
        "addedDateTime": "2019-12-10T00:00:00" 
    } 
} 
```

## Error Reference 

The following is a list of the potential error codes you may receive, either when troubleshooting with Microsoft Graph or going through the process in the app registration portal.

### MPNAccountNotFoundOrNoAccess

The MPN ID you provided (`MPNID`) doesn't exist, or you don't have access to it. Provide a valid MPN ID and try again.
    
Most commonly caused by the signed-in user not being a member of the proper role for the MPN account in Partner Center- see [requirements](publisher-verification-overview.md#requirements) for a list of eligible roles and see [common issues](#common-issues) for more information. Can also be caused by the tenant the app is registered in not being added to the MPN account, or an invalid MPN ID.

**Remediation Steps**
1. Go to your [partner profile](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) and verify that: 

    - The MPN ID is correct. 
    - There are no errors or “pending actions” shown, and the verification status under Legal business profile and Partner info both say “authorized” or “success”.
2. Go to the [MPN tenant management page](https://partner.microsoft.com/dashboard/account/v3/tenantmanagement) and confirm that the tenant the app is registered in and that you're signing with a user account from is on the list of associated tenants. To add another tenant, follow the [multi-tenant-account instructions](/partner-center/multi-tenant-account). All Global Admins of any tenant you add will be granted Global Administrator privileges on your Partner Center account.
3. Go to the [MPN User Management page](https://partner.microsoft.com/pcv/users) and confirm the user you're signing in as is either a Global Administrator, MPN Admin, or Accounts Admin. To add a user to a role in Partner Center, follow the instructions for [creating user accounts and setting permissions](/partner-center/create-user-accounts-and-set-permissions).

### MPNGlobalAccountNotFound

The MPN ID you provided (`MPNID`) isn't valid. Provide a valid MPN ID and try again.
    
Most commonly caused when an MPN ID is provided which corresponds to a Partner Location Account (PLA). Only Partner Global Accounts are supported. See [Partner Center account structure](/partner-center/account-structure) for more details.

**Remediation Steps**
1. Navigate to your [partner profile](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) > Identifiers blade > Microsoft Cloud Partners Program Tab
2. Use the Partner ID with type PartnerGlobal

### MPNAccountInvalid

The MPN ID you provided (`MPNID`) isn't valid. Provide a valid MPN ID and try again.
    
Most commonly caused by the wrong MPN ID being provided.

**Remediation Steps**
1. Navigate to your [partner profile](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) > Identifiers blade > Microsoft Cloud Partners Program Tab
2. Use the Partner ID with type PartnerGlobal

### MPNAccountNotVetted

The MPN ID (`MPNID`) you provided hasn't completed the vetting process. Complete this process in Partner Center and try again. 
    
Most commonly caused by when the MPN account hasn't completed the [verification](/partner-center/verification-responses) process.

**Remediation Steps**
1. Navigate to your [partner profile](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) and verify that there are no errors or **pending actions** shown, and that the verification status under Legal business profile and Partner info both say **authorized** or **success**.
2. If not, view pending action items in Partner Center and troubleshoot with [here](/partner-center/verification-responses)

### NoPublisherIdOnAssociatedMPNAccount

The MPN ID you provided (`MPNID`) isn't valid. Provide a valid MPN ID and try again. 
   
Most commonly caused by the wrong MPN ID being provided.

**Remediation Steps**
1. Navigate to your [partner profile](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) > Identifiers blade > Microsoft Cloud Partners Program Tab
2. Use the Partner ID with type PartnerGlobal

### MPNIdDoesNotMatchAssociatedMPNAccount

The MPN ID you provided (`MPNID`) isn't valid. Provide a valid MPN ID and try again.
    
Most commonly caused by the wrong MPN ID being provided.

**Remediation Steps**
1. Navigate to your [partner profile](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) > Identifiers blade > Microsoft Cloud Partners Program Tab
2. Use the Partner ID with type PartnerGlobal

### ApplicationNotFound

The target application (`AppId`) can’t be found. Provide a valid application ID and try again.
    
Most commonly caused when verification is being performed via Graph API, and the ID of the application provided is incorrect. 

**Remediation Steps**
1. The Object ID of the application must be provided, not the AppId/ClientId. See **id** on the list of application properties [here](/graph/api/resources/application)
2. Log in to [Azure Active Directory](https://aad.portal.azure.com/) with a user account in your organization's primary tenant > Azure Active Directory > App Registrations blade
3. Find your app's registration to view the Object ID


### ApplicationObjectisInvalid 

The target application's object ID is invalid. Please provide a valid ID and try again. 

Most commonly caused when the verification is being performed via Graph API, and the ID of the application provided does not exist. 

**Remediation Steps**
1. The Object ID of the application must be provided, not the AppId/ClientId. See **id** on the list of application properties [here](/graph/api/resources/application)
2. Log in to [Azure Active Directory](https://aad.portal.azure.com/) with a user account in your organization's primary tenant > Azure Active Directory > App Registrations blade
3. Find your app's registration to view the Object ID

 
### B2CTenantNotAllowed

This capability isn't supported in an Azure AD B2C tenant.

### EmailVerifiedTenantNotAllowed

This capability isn't supported in an email verified tenant.

### NoPublisherDomainOnApplication

The target application (`AppId`) must have a Publisher Domain set. Set a Publisher Domain and try again.

Occurs when a [Publisher Domain](howto-configure-publisher-domain.md) isn't configured on the app.

**Remediation Steps**
1. Follow the directions [here](./howto-configure-publisher-domain.md#set-a-publisher-domain-in-the-azure-portal) to set a Publisher Domain

### PublisherDomainMismatch

The target application's Publisher Domain (`publisherDomain`) either doesn't match the domain used to perform email verification in Partner Center (`pcDomain`) or has not been verified. Ensure these domains match and have been verified then try again. 
    
Occurs when neither the app's [Publisher Domain](howto-configure-publisher-domain.md) nor one of the [custom domains](../fundamentals/add-custom-domain.md) added to the Azure AD tenant match the domain used to perform email verification in Partner Center or has not been verified.

See [requirements](publisher-verification-overview.md) for a list of allowed domain or sub-domain matches. 

**Remediation Steps**
1. Navigate to your [partner profile](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile), and view the email listed as Primary Contact
2. The domain used to perform email verification in Partner Center is the portion after the “@” in the Primary Contact’s email
3. Log in to [Azure Active Directory](https://aad.portal.azure.com/) > Azure Active Directory > App Registrations blade > (`Your App`) > Branding and Properties
4. Select **Update Publisher Domain** and follow the instructions to **Verify a New Domain**.
5. Add the domain used to perform email verification in Partner Center as a New Domain


### NotAuthorizedToVerifyPublisher

You aren't authorized to set the verified publisher property on application (<`AppId`).
  
Most commonly caused by the signed-in user not being a member of the proper role for the MPN account in Azure AD- see [requirements](publisher-verification-overview.md#requirements) for a list of eligible roles and see [common issues](#common-issues) for more information.

**Remediation Steps**
1. Sign in to the [Azure AD Portal](https://aad.portal.azure.com) using a user account in your organization's primary tenant.
2. Navigate to [Role Management](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RolesAndAdministrators).
3. Select the desired admin role and click “Add Assignment” if you have sufficient permissions.
4. If you do not have sufficient permissions, contact an admin role for assistance


### MPNIdWasNotProvided

The MPN ID wasn't provided in the request body or the request content type wasn't "application/json".

Most commonly caused when the verification is being performed via Graph API, and the MPN ID wasn’t provided in the request. 

**Remediation Steps**
1. Navigate to your [partner profile](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) > Identifiers blade > Microsoft Cloud Partners Program Tab
2. Use the Partner ID with type PartnerGlobal in the request

### MSANotSupported 

This feature isn't supported for Microsoft consumer accounts. Only applications registered in Azure AD by an Azure AD user are supported.

Occurs when a consumer account is used for app registration (Hotmail, Messenger, OneDrive, MSN, Xbox Live, or Microsoft 365).

### InteractionRequired

Occurs when multi-factor authentication (MFA) hasn't been enabled and performed before attempting to add a verified publisher to the app. See [common issues](#common-issues) for more information. Note: MFA must be performed in the same session when attempting to add a verified publisher. If MFA is enabled but not required to be performed in the session, the request will fail. 

The error message displayed will be: "Due to a configuration change made by your administrator, or because you moved to a new location, you must use multi-factor authentication to proceed."

**Remediation Steps**
1. Ensure [multi-factor authentication](../fundamentals/concept-fundamentals-mfa-get-started.md) is enabled and **required** for the user you're signing in with and for this scenario
2. Retry Publisher Verification

### UserUnableToAddPublisher

When a request to add a verified publisher is made, many signals are used to make a security risk assessment. If the user risk state is determined to be ‘AtRisk’, an error, “You're unable to add a verified publisher to this application. Contact your administrator for assistance” will be returned. Please investigate the user risk and take the appropriate steps to remediate the risk (guidance below): 

**Remediation Steps**
> [Investigate risk](../identity-protection/howto-identity-protection-investigate-risk.md#risky-users)
> 
> [Remediate risk/unblock users](../identity-protection/howto-identity-protection-remediate-unblock.md)
> 
> [Self-remediation guidance](../identity-protection/howto-identity-protection-remediate-unblock.md)
> 
> Self-serve password reset (SSPR): If the organization allows SSPR, use aka.ms/sspr to reset the password for remediation. Please choose a strong password; Choosing a weak password may not reset the risk state.  
> 
> [!NOTE] 
> Please give some time after remediation for the risk state to update, and then try again.

### UnableToAddPublisher

When a request to add a verified publisher is made, many signals are used to make a security risk assessment. If the request is determined to be risky an error will be returned. For security reasons, Microsoft doesn't disclose the specific criteria used to determine whether a request is risky or not. If you received this error and believe the "risky" assessment is incorrect, try waiting and resubmitting the verification request. Some customers have reported success after multiple attempts.


## Next steps

If you've reviewed all of the previous information and are still receiving an error from Microsoft Graph, gather as much of the following information as possible related to the failing request and [contact Microsoft support](developer-support-help-options.md#create-an-azure-support-request).

- Timestamp 
- CorrelationId 
- ObjectID or UserPrincipalName of signed in user 
- ObjectId of target application
- AppId of target application
- TenantId where app is registered
- MPN ID
- REST request being made 
- Error code and message being returned