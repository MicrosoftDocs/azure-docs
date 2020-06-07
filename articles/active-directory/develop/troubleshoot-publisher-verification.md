---
title: Troubleshoot publisher verification - Microsoft identity platform | Azure
description: Describes how to troubleshoot publisher verification (preview) for Microsoft identity platform by calling Microsoft Graph APIs.
services: active-directory
author: rwike77
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/08/2020
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: jesakowi
---

# Troubleshoot publisher verification (preview)
If you are unable to complete the process or are experiencing unexpected behavior with [publisher verification (preview)](publisher-verification-overview.md), you should start by doing the following if you are receiving errors or seeing unexpected behavior: 

1. Review the [requirements](publisher-verification-overview.md#requirements) and ensure they have all been met.

1. Review the instructions to [mark an app as publisher verified](mark-app-as-publisher-verified.md) and ensure all steps have been performed successfully.

1. Review the list of [common issues](#common-issues).

1. Reproduce the request using [Graph Explorer](#making-microsoft-graph-api-calls) to gather additional info and rule out any issues in the UI.

## Common Issues
Below are some common issues that may occur during the process. 

- **I don’t know my Microsoft Partner Network ID (MPN ID) or I don’t who the primary contact for the account is** 
    1. Navigate to the [MPN enrollment page](https://partner.microsoft.com/dashboard/account/v3/enrollment/joinnow/basicpartnernetwork/new)
    1. Sign in with a user account in the org's primary Azure AD tenant 
    1. If an MPN account already exists, this will be recognized and you will be added to the account 
    1. Navigate to the [partner profile page](https://partner.microsoft.com/en-us/pcv/accountsettings/connectedpartnerprofile) where the MPN ID and primary account contact will be listed

- **I don’t know who my Azure AD Global Admin (also known as Company Admin or Tenant Admin) is, how do I find them? What about the App Administrator, or a different admin role?**
    1. Sign in to the [Azure AD Portal](https://aad.portal.azure.com) using a user account in your organization's primary tenant
    1. Navigate to [Role Management](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RolesAndAdministrators)
    1. Click “Global Administrator”, or the desired admin role
    1. The list of users assigned that role will be displayed

- **I don't know who the admin(s) for my MPN account are**
    Go to the [MPN User Management page](https://partner.microsoft.com/en-us/pcv/users) and filter the user list to see what users are in various admin roles.

- **I am getting an error saying that my MPN ID is invalid or that I do not have access to it.**
    1. Go to your [partner profile](https://partner.microsoft.com/en-us/pcv/accountsettings/connectedpartnerprofile) and verify that: 
        - The MPN ID is correct. 
        - There are no errors or “pending actions” shown, and the verification status under Legal business profile and Partner info both say “authorized” or “success”.
    1. Go to the [MPN tenant management page](https://partner.microsoft.com/en-us/dashboard/account/v3/tenantmanagement) and confirm that the tenant the app is registered in and that you are signing with a user account from is on the list of associated tenants.
    1. Go to the [MPN User Management page](https://partner.microsoft.com/en-us/pcv/users) and confirm the user you are signing in as is either a Global Admin, MPN Admin, or Accounts Admin.

- **When I sign into the Azure AD portal, I do not see any apps registered. Why?** 
    Your app registrations may have been created using a different user account, or in a different tenant. Ensure you are signed in with the correct account in the tenant where your app registrations were created.

- **How do I know who the owner of an app registration in Azure AD is?** 
    When signed into a tenant where the app is registered, navigate to the App Registrations blade, click an app, and then click Owners.

## Making Microsoft Graph API calls 

If you are having an issue but unable to understand why based on what you are seeing in the UI, it may be helpful to perform further troubleshooting by using Microsoft Graph calls to perform the same operations you can perform in the App Registration portal. During the preview phase, these APIs will only be available on the /beta endpoint of Microsoft Graph.  

The easiest way to make these requests is using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). You may also consider other options like using [Postman](https://www.postman.com/), or using PowerShell to [invoke a web request](/powershell/module/microsoft.powershell.utility/invoke-webrequest?view=powershell-7).  

You can use Microsoft Graph to both set and unset your app’s verified publisher and check the result after performing one of these operations. The result can be seen on both the [application](/graph/api/resources/application?view=graph-rest-beta) object corresponding to your app registration and any [service principals](/graph/api/resources/serviceprincipal?view=graph-rest-beta) that have been instantiated from that app. For more information on the relationship between those objects, see: [Application and service principal objects in Azure Active Directory](app-objects-and-service-principals.md).  

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
GET https://graph.microsoft.com/beta/applications/0cd04273-0d11-4e62-9eb3-5c3971a7cbec 

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
GET https://graph.microsoft.com/beta/servicePrincipals/010422a7-4d77-4f40-9335-b81ef5c23dd4 

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

The MPN ID you provided (<MPNID>) does not exist, or you do not have access to it. Provide a valid MPN ID and try again. 

### MPNGlobalAccountNotFound	 

The MPN ID you provided (<MPNID>) is not valid. Provide a valid MPN ID and try again. 

### MPNAccountInvalid	 

The MPN ID you provided (<MPNID>) is not valid. Provide a valid MPN ID and try again. 

### MPNAccountNotVetted	 

The MPN ID (<MPNID>) you provided has not completed the vetting process. Complete this process in Partner Center and try again. 

### NoPublisherIdOnAssociatedMPNAccount	 

The MPN ID you provided (<MPNID>) is not valid. Provide a valid MPN ID and try again. 

### MPNIdDoesNotMatchAssociatedMPNAccount	 

The MPN ID you provided (<MPNID>) is not valid. Provide a valid MPN ID and try again. 

### ApplicationNotFound	 

The target application (<AppId>) cannot be found. Provide a valid application ID and try again. 

### B2CTenantNotAllowed	 

This capability is not supported in an Azure AD B2C tenant. 

### EmailVerifiedTenantNotAllowed	 

This capability is not supported in an email verified tenant. 

### NoPublisherDomainOnApplication	 

The target application (<AppId>) does must have a Publisher Domain set. Set a Publisher Domain and try again. 

### PublisherDomainIsNotDNSVerified	 

The target application's Publisher Domain (<publisherDomain>) is not a verified domain in this tenant. Verify a tenant domain using DNS verification and try again. 

### PublisherDomainMismatch	 

The target application's Publisher Domain (<publisherDomain>) does not match the domain used to perform email verification in Partner Center (<pcDomain>). Ensure these domains match and try again. 

### NotAuthorizedToVerifyPublisher	 

You are not authorized to set the verified publisher property on application (<AppId>) 

### MPNIdWasNotProvided	 

The MPN ID was not provided in the request body or the request content type was not "application/json". 

### MSANotSupported	 

This feature is not supported for Microsoft consumer accounts. Only applications registered in Azure AD by an Azure AD user are supported. 

## Next steps

If you have reviewed all of the previous information and are still receiving an error from Microsoft Graph, gather as much of the following information as possible related to the failing request and [contact Microsoft support](developer-support-help-options.md#open-a-support-request).

- Timestamp 
- CorrelationId 
- ObjectID or UserPrincipalName of signed in user 
- ObjectId of target application
- AppId of target application
- TenantId where app is registered
- MPN ID
- REST request being made 
- Error code and message being returned 
