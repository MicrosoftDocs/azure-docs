---
title: Troubleshoot publisher verification 
description: Describes how to troubleshoot publisher verification for Microsoft identity platform by calling Microsoft Graph APIs.
services: active-directory
author: rwike77
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 04/30/2020
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: jesakowi
---

# Troubleshoot publisher verification
When an application is [marked as publisher verified](mark-app-as-publisher-verified.md), it means that the publisher has verified their identity using their Microsoft Partner Network (MPN) account and has associated this MPN account with their application registration. Do the following if you are receiving errors or seeing unexpected behavior while marking an app as publisher verified: 

1. See if your issue is covered in the [frequently asked questions](publisher-verification-overview.md#frequently-asked-questions).  

1. Ensure that you have met all of the [requirements](publisher-verification-overview.md#requirements) and are following the Step-by-Step Instructions.  

If you are still unsure why the error is occurring, you can try making a request by [making Microsoft Graph API calls](#making-microsoft-graph-api-calls) to gather additional and rule out any issues in the UI. Or, if you have access, you can use [Internal Logs](#internal-logs) to troubleshoot further. 

If you are still receiving an error from Microsoft Graph, gather as much of the following information as possible related to the failing call and reach out to Microsoft: 

- Timestamp 
- CorrelationId 
- ObjectID or UserPrincipalName of signed in user 
- AppId of calling application 
- REST request being made 
- Error code and message being returned 

## Making Microsoft Graph API calls 

If you are having an issue but unable to understand why based on what you are seeing in the UI, it may be helpful to perform further troubleshooting by using Microsoft Graph calls to perform the same operations you can perform in the App Registration portal. During the preview phase, these APIs will only be available on the /beta endpoint of Microsoft Graph.  

The easiest way to make these requests is using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). You may also consider other options like using [Postman](https://www.postman.com/), or using PowerShell to [invoke a web request](/powershell/module/microsoft.powershell.utility/invoke-webrequest?view=powershell-7). PowerShell cmdlets will be available soon.  

You can use Microsoft Graph to both set and unset your app’s Verified Publisher and check the result after performing one of these operations. The result can be seen on both the [application](/graph/api/resources/application?view=graph-rest-beta) object corresponding to your app registration and any [service principals](/graph/api/resources/serviceprincipal?view=graph-rest-beta) that have been instantiated from that app. For more information on the relationship between those objects, see: [Application and service principal objects in Azure Active Directory](app-objects-and-service-principals.md).  

Here are examples of some useful requests:  

### Set Verified Publisher 

Request

```
POST /applications/0cd04384-0d91-4e52-9eb3-6b3971b7ebec/setVerifiedPublisher 

{ 

    "verifiedPublisherId": "5335224" 

} 
```
 
Response 
```
204 No Content 
```
Note: verifiedPublisherID is your MPN ID. 

### Unset Verified Publisher 

Request:  
```
POST /applications/0cd04384-0d91-4e52-9eb3-6b3971b7ebec/unsetVerifiedPublisher 
```
 

Response 
```
204 No Content 
```
### Get Verified Publisher info from Application 
 
```
GET https://graph.microsoft.com/beta/applications/0cd04384-0d91-4e52-9eb3-6b3971b7ebec 

HTTP/1.1 200 OK 

{ 
    "id": "0cd04384-0d91-4e52-9eb3-6b3971b7ebec", 

    ... 

    "verifiedPublisher" : { 
        "displayName": "myexamplePublisher", 
        "verifiedPublisherId": "5335224", 
        "addedDateTime": "2019-12-10T00:00:00" 
    } 
} 
```

### Get Verified Publisher info from Service Principal 
```
GET https://graph.microsoft.com/beta/servicePrincipals/010422a7-4d77-4f40-9335-b81ef5c22dd4 

HTTP/1.1 200 OK 

{ 
    "id": "010422a7-4d77-4f40-9335-b81ef5c22dd4", 

    ... 

    "verifiedPublisher" : { 
        "displayName": "myexamplePublisher", 
        "verifiedPublisherId": "5335224", 
        "addedDateTime": "2019-12-10T00:00:00" 
    } 
} 
```
 
## HTTP Error Reference 

The following is a list of the potential error codes you may receive when troubleshooting using Microsoft Graph, along with the HTTP status code and error message for each. 

### MPNAccountNotFoundOrNoAccess	 

HTTP 400	 

The MPN ID you provided (<MPNID>) does not exist, or you do not have access to it. Provide a valid MPN ID and try again. 

### MPNGlobalAccountNotFound	 

HTTP 400	 

The MPN ID you provided (<MPNID>) is not valid. Provide a valid MPN ID and try again. 

### MPNAccountInvalid	 

HTTP 400	 

The MPN ID you provided (<MPNID>) is not valid. Provide a valid MPN ID and try again. 

### MPNAccountNotVetted	 

HTTP 400	 

The MPN ID (<MPNID>) you provided has not completed the vetting process. Complete this process in Partner Center and try again. 

### NoPublisherIdOnAssociatedMPNAccount	 

HTTP 400	 

The MPN ID you provided (<MPNID>) is not valid. Provide a valid MPN ID and try again. 

### MPNIdDoesNotMatchAssociatedMPNAccount	 

HTTP 400	 

The MPN ID you provided (<MPNID>) is not valid. Provide a valid MPN ID and try again. 

### ApplicationNotFound	 

HTTP 404	 

The target application (<AppId>) cannot be found. Provide a valid application ID and try again. 

### B2CTenantNotAllowed	 

HTTP 400	 

This capability is not supported in an Azure AD B2C tenant. 

### EmailVerifiedTenantNotAllowed	 

HTTP 400	 

This capability is not supported in an email verified tenant. 

### NoPublisherDomainOnApplication	 

HTTP 400	 

The target application (<AppId>) does must have a Publisher Domain set. Set a Publisher Domain and try again. 

### PublisherDomainIsNotDNSVerified	 

HTTP 400	 

The target application's Publisher Domain (<publisherDomain>) is not a verified domain in this tenant. Verify a tenant domain using DNS verification and try again. 
### PublisherDomainMismatch	 

HTTP 400	 

The target application's Publisher Domain (<publisherDomain>) does not match the domain used to perform email verification in Partner Center (<pcDomain>). Ensure these domains match and try again. 

### NotAuthorizedToVerifyPublisher	 

HTTP 403	 

You are not authorized to set the verified publisher property on application (<AppId>) 

### MPNIdWasNotProvided	 

HTTP 400	 

The MPN ID was not provided in the request body or the request content type was not "application/json". 

### MSANotSupported	 

HTTP 400	 

This feature is not supported for Microsoft consumer accounts. Only applications registered in Azure AD by an Azure AD user are supported. 

## Internal logs 

### AAD Graph Logs  

These should be a rarity as these properties should only be modified by the App Publisher Service. If any of these errors are reported by customers, the likely answer is that the customer should not be attempting to modify the Verified Publisher properties as they are system properties. 

- "Properties cannot be modified as VerifiedPublisherIsRevoked." - Error that will be received if an attempt is made to modify the Verified Publisher properties when the publisher verification status was marked as Fraudulent, internally by Microsoft. 

- “verifiedPublisher  properties cannot be set during Application creation.” - Error that will be received if an attempt is made to set the VerifiedPublisher properties during application create. 

- “This operation requires the presence of both a user and an application.” - Error that will be received if an attempt is made to update the VerifiedPublisher properties using an App-Only authentication flow (as both a user and application must be present to modify these properties). 

- “No other properties may be modified when VerifiedPublisher properties are being modified.” - Error that will be received if an attempt is made to update VerifiedPublisher properties while also attempting to modify any other Application property.  

- “Authorization_RequestDenied” - Error that will be received if an attempt is made to update VerifiedPublisher properties by an application or user that does not have the elevated permissions required to do so. 
## Next steps
Learn about [publisher verification](publisher-verification-overview.md)