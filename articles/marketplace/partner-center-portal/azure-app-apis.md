---
title: Onboarding API for Azure apps in the Commercial Marketplace 
description: API prerequisites for Azure apps in commercial marketplace on Microsoft Partner Center. 
author: qianw211 
manager: evansma
ms.author: v-qiwe
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 12/10/2019
---

# API for onboarding Azure apps in Partner Center

There is an API for partners to use when submitting their offers in Partner Center.

## API prerequisites

There are a few programmatic assets that you need in order to use the Partner Center API for Azure Products: 

- a service principal.
- an Azure Active Directory (Azure AD) access token.

### Create a service principal in your Azure Active Directory tenant

First, you need to create a service principal in your Azure AD tenant. This tenant will be assigned its own set of permissions in Partner Center. Your code will call APIs using this tenant instead of using your personal credentials. For a full explanation of creating a service principal, see [Use portal to create an Azure Active Directory application and service principal that can access resources](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).

### Add the service principal to your account

<mark> Now that you've created the service principal in your tenant, you can add it to your Partner Center Account. </mark>

<mark> <We’ll need to better iron out this section with what specifically is needed for API access but these three pages should contain everything that is needed.> 

<mark>https://docs.microsoft.com/en-us/windows/uwp/publish/associate-azure-ad-with-partner-center#associate-your-partner-center-account-with-your-organizations-existing-azure-ad-tenant

<mark>https://docs.microsoft.com/en-us/windows/uwp/publish/add-users-groups-and-azure-ad-applications#add-azure-ad-applications-to-your-partner-center-account

<mark>https://docs.microsoft.com/en-us/graph/security-authorization </mark>

### Get an Azure AD access token

The Partner Center APIs use the following assets and protocols during authentication:

- A JSON Web Token (JWT) bearer token to request access to resources
- Azure Active Directory (Azure AD) as the identity authority

There are two principle approaches to programmatically acquiring a JWT token:

- Use the Microsoft Authentication Library for .NET (MSAL.NET). This higher-level approach is recommended for .NET developers.
- Make an HTTP POST request to the Azure AD oauth token endpoint, which takes the form:

```HTTP
HTTPCopy
POST https://login.microsoftonline.com/<tenant-id>/oauth2/token
    client_id: <application-id>
    client_secret:<application-secret>
    grant_type: client_credentials
    resource: https://api.partner.microsoft.com
```

Now, you can pass this token as part of the authorization header for API requests.

```HTTP
HTTPCopy
GET https://api.partner.microsoft.com/v1.0/ingestion/products
    Accept: application/json
    Authorization: Bearer <access-token>
```

## Next steps

<mark> See [API reference](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-api-overview) in the Cloud Partner Portal for more information. </mark>
