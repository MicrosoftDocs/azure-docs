---
title: Add and verify custom domain names - Azure Active Directory | Microsoft Docs
description: Management concepts and how-tos for managing a domain name in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: how-to
ms.date: 10/29/2020
ms.author: curtand
ms.reviewer: elkuzmen

ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Verifying a custom subdomain as managed domain

Follow
3

Edit


Jason Fritts
Jul 31
Customers often have a federated root domain such as mydomain.com  and then wish to verify a sub domain such as child.mydomain.com  as managed instead of federated like it's parent domain mydomain.com .

The Azure AD Portal \ Custom Domain's blade has a bug where it will give the following errors whenever the parent domain is federated and the admin tries to verify the sub-domain in the Custom Domains blade:

image.png

 {"code":"Request_BadRequest","message":{"lang":"en","value":"One or more properties contains invalid values."}
 [Microsoft.Online.Workflows.ValidationException: AddDomain. domain.LiveType must follow the root domain=domain.com;;]
If the administrator tries to add this domain from the Office 365 Admin Center, they will receive a similar error which points to a possible solution:

image.png

How to successfully verify custom sub-domain
As sub domains by default will inherit the authenticationType of the root domain, administrators must promote the child domain to a root domain instead of a child domain in AAD using Graph API so they can set the authenticationType to managed.

See below for example steps on how to perform:

First verify the new child domain as it's root domain's authentication type using PowerShell (can't use the portal due to above bug)

New-MsolDomain -Name "child.mydomain.com" -Authentication Federated
Next, use AAD Graph Explorer  to GET the domain and see the domain isn't root so it has to inherit it's root domain authenticationType:

Example: GET: https://graph.windows.net/{{tenant_id}}/domains?api-version=1.6


     {
         "authenticationType": "Federated",
         "availabilityStatus": null,
         "isAdminManaged": true,
         "isDefault": false,
         "isDefaultForCloudRedirections": false,
         "isInitial": false,
         "isRoot": false,          <---------------- Not a root domain, so inherits parent domain's authenticaiton type (Federated)
         "isVerified": true,
         "name": "child.mydomain.com",
         "supportedServices": [],
         "forceDeleteState": null,
         "state": null,
         "passwordValidityPeriodInDays": null,
         "passwordNotificationWindowInDays": null
     },
Use AAD Graph Explorer API  to make this a root domain

POST https://graph.windows.net/{{tenant_id} }/domains/child.mydomain.com/promote?api-version=1.6

 Example: POST https://graph.windows.net/ 2229f358-fc95-47e3-8661-a034d8abb2b5 /domains/child.domain.com/promote?api-version=1.6 
Now Set to a managed domain using Set-MsolDomainAuthentication

Set-MsolDomainAuthentication -DomainName child.mydomain.com -Authentication Managed
Verify via AAD Graph Explorer to GET https://graph.windows.net/{{tenant_id} }/domains?api-version=1.6 that auth type is now managed:

     {
         "authenticationType": "Managed",   <---------- Now this domain is successfully added as Managed and not inheriting Federated status
         "availabilityStatus": null,
         "isAdminManaged": true,
         "isDefault": false,
         "isDefaultForCloudRedirections": false,
         "isInitial": false,
         "isRoot": true,   <------------------------------ Also a root domain, so not inheriting from parent domain any longer
         "isVerified": true,
         "name": "child.mydomain.com",
         "supportedServices": [
             "Email",
             "OfficeCommunicationsOnline",
             "Intune"
         ],
         "forceDeleteState": null,
         "state": null,
         "passwordValidityPeriodInDays": null,
         "passwordNotificationWindowInDays": null
 }
> [!Note]
>This process can be used only if the child domain does not already have users referencing the domain. If they do have users referencing the domain, an ICM should be opened for TA review and transfer to AAD Distributed Directory Services / Customer Escalations -

## Next steps

39 visits in last 30 days
