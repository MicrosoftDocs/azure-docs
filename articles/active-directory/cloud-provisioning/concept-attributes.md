---
title: 'Understanding the Azure AD schema and custom expressions'
description: This topic describes the Azure AD schema, the attributes that the provisioning agent flows and custom expressions.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/02/2019
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---


# Understanding the Azure AD schema
An object in Azure AD, like any directory, is a programmatic high-level data construct that represents such things as users, groups, and contacts.  When you create a new user or contact in Azure AD, you are creating a new instance of that object.  These instances can be differentiated based on their properties.

Properties, in Azure AD are the elements responsible for storing information about an instance of an object in Azure AD.  

The Azure AD schema defines the rules for which properties may be used in an entry, the kinds of values that those properties may have, and how users may interact with those values. 

Azure AD has two types of properties.  The properties are:
- **Built in properties** – Properties that are pre-defined by the Azure AD schema.  These properties provide different uses and may or may not be accessible.
- **Directory extensions** – Properties that are provided so that you can customize Azure AD for your own use.  For example, if you have extended your on-premises Active Directory with a certain attribute and want to flow that attribute, you can use one of the custom properties that are provided. 

## Attributes and expressions
When an object, such as a user is provisioned to Azure AD, a new instance of the user object is created.  This creation includes the properties of that object, which are also known as attributes.  Initially, the newly created object will have its attributes set to values that are determined by the synchronization rules.  These attributes are then kept up to date via the cloud provisioning agent.

![](media/concept-attributes/attribute1.png)

For example, if a user is part of the Marketing department, their Azure AD department attribute will initially be created when they are provisioned and then the value would be set to Marketing.  But then, six months later, they change to Sales.  Their on-premises AD department attribute is changed to Sales.  This change will then synchronize to Azure AD and be reflected on their Azure AD user object.

Attribute synchronization may be either direct, where the value in Azure AD is directly set to the value of the on-premises attribute.  Or, there may be a programmatic expression that handles this synchronization.  A programmatic expression would be needed in cases where some logic or a determination needed to be made in order to populate the value.

For example, if I had my mail attribute ("john.smith@contoso.com") and I needed to strip out the "@contoso.com" portion and flow just the value "john.smith" I would use something like this:

`Replace([mail], "@contoso.com", , ,"", ,)`  

**Sample input / output:** <br>

* **INPUT** (mail): "john.smith@contoso.com"
* **OUTPUT**:  "john.smith"

For additional information, on writing custom expressions, and the syntax see [Writing Expressions for Attribute Mappings in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/functions-for-customizing-application-data).

The following list are common attributes and how they are synchronized to Azure AD.


|On-premises Active Directory|Mapping Type|Azure AD|
|-----|-----|-----|
|cn|Direct|commonName
|countryCode|Direct|countryCode|
|displayName|Direct|displayName|
|givenName|Expression|givenName|
|objectGUID|Direct|sourceAnchorBinary|	
|userprincipalName|Direct|userPrincipalName|
|ProxyAdress|Direct|ProxyAddress|

## Viewing the schema
In order to view the schema and verify it, do the following steps:

1.  Navigate to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
2.  Sign in with your global administrator account
3.  On the left, click **modify permissions** and ensure that **Directory.ReadWrite.All** is Consented.
4.  Run the following query: https://graph.microsoft.com/beta/serviceprincipals/.  This query will return a list of service principals.
5.  Locate "appDisplayName": "Active Directory to Azure Active Directory Provisioning" and note the "id:" value.
    ```
    "value": [
            {
                "id": "00d41b14-7958-45ad-9d75-d52fa29e02a1",
                "deletedDateTime": null,
                "accountEnabled": true,
                "appDisplayName": "Active Directory to Azure Active Directory Provisioning",
                "appId": "1a4721b3-e57f-4451-ae87-ef078703ec94",
                "applicationTemplateId": null,
                "appOwnerOrganizationId": "47df5bb7-e6bc-4256-afb0-dd8c8e3c1ce8",
                "appRoleAssignmentRequired": false,
                "displayName": "Active Directory to Azure Active Directory Provisioning",
                "errorUrl": null,
                "homepage": "https://account.activedirectory.windowsazure.com:444/applications/default.aspx?metadata=AD2AADProvisioning|ISV9.1|primary|z",
                "loginUrl": null,
                "logoutUrl": null,
                "notificationEmailAddresses": [],
                "preferredSingleSignOnMode": null,
                "preferredTokenSigningKeyEndDateTime": null,
                "preferredTokenSigningKeyThumbprint": null,
                "publisherName": "Active Directory Application Registry",
                "replyUrls": [],
                "samlMetadataUrl": null,
                "samlSingleSignOnSettings": null,
                "servicePrincipalNames": [
                    "http://adapplicationregistry.onmicrosoft.com/adprovisioningtoaad/primary",
                    "1a4721b3-e57f-4451-ae87-ef078703ec94"
                ],
                "signInAudience": "AzureADMultipleOrgs",
                "tags": [
                    "WindowsAzureActiveDirectoryIntegratedApp"
                ],
                "addIns": [],
                "api": {
                    "resourceSpecificApplicationPermissions": []
                },
                "appRoles": [
                    {
                        "allowedMemberTypes": [
                            "User"
                        ],
                        "description": "msiam_access",
                        "displayName": "msiam_access",
                        "id": "a0326856-1f51-4311-8ae7-a034d168eedf",
                        "isEnabled": true,
                        "origin": "Application",
                        "value": null
                    }
                ],
                "info": {
                    "termsOfServiceUrl": null,
                    "supportUrl": null,
                    "privacyStatementUrl": null,
                    "marketingUrl": null,
                    "logoUrl": null
                },
                "keyCredentials": [],
                "publishedPermissionScopes": [
                    {
                        "adminConsentDescription": "Allow the application to access Active Directory to Azure Active Directory Provisioning on behalf of the signed-in user.",
                        "adminConsentDisplayName": "Access Active Directory to Azure Active Directory Provisioning",
                        "id": "d40ed463-646c-4efe-bb3e-3fa7d0006688",
                        "isEnabled": true,
                        "type": "User",
                        "userConsentDescription": "Allow the application to access Active Directory to Azure Active Directory Provisioning on your behalf.",
                        "userConsentDisplayName": "Access Active Directory to Azure Active Directory Provisioning",
                        "value": "user_impersonation"
                    }
                ],
                "passwordCredentials": []
            },
    ```
6. Replace the {Service Principal id} with your value and run the following query: `https://graph.microsoft.com/beta/serviceprincipals/{Service Principal id}/synchronization/jobs/`
7. Locate the "id": "AD2AADProvisioning.fd1c9b9e8077402c8bc03a7186c8f976" section and note the "id:".
    ```
    {
                "id": "AD2AADProvisioning.fd1c9b9e8077402c8bc03a7186c8f976",
                "templateId": "AD2AADProvisioning",
                "schedule": {
                    "expiration": null,
                    "interval": "PT2M",
                    "state": "Active"
                },
                "status": {
                    "countSuccessiveCompleteFailures": 0,
                    "escrowsPruned": false,
                    "code": "Active",
                    "lastSuccessfulExecutionWithExports": null,
                    "quarantine": null,
                    "steadyStateFirstAchievedTime": "2019-11-08T15:48:05.7360238Z",
                    "steadyStateLastAchievedTime": "2019-11-20T16:17:24.7957721Z",
                    "troubleshootingUrl": "",
                    "lastExecution": {
                        "activityIdentifier": "2dea06a7-2960-420d-931e-f6c807ebda24",
                        "countEntitled": 0,
                        "countEntitledForProvisioning": 0,
                        "countEscrowed": 15,
                        "countEscrowedRaw": 15,
                        "countExported": 0,
                        "countExports": 0,
                        "countImported": 0,
                        "countImportedDeltas": 0,
                        "countImportedReferenceDeltas": 0,
                        "state": "Succeeded",
                        "error": null,
                        "timeBegan": "2019-11-20T16:15:21.116098Z",
                        "timeEnded": "2019-11-20T16:17:24.7488681Z"
                    },
                    "lastSuccessfulExecution": {
                        "activityIdentifier": null,
                        "countEntitled": 0,
                        "countEntitledForProvisioning": 0,
                        "countEscrowed": 0,
                        "countEscrowedRaw": 0,
                        "countExported": 5,
                        "countExports": 0,
                        "countImported": 0,
                        "countImportedDeltas": 0,
                        "countImportedReferenceDeltas": 0,
                        "state": "Succeeded",
                        "error": null,
                        "timeBegan": "0001-01-01T00:00:00Z",
                        "timeEnded": "2019-11-20T14:09:46.8855027Z"
                    },
                    "progress": [],
                    "synchronizedEntryCountByType": [
                        {
                            "key": "group to Group",
                            "value": 33
                        },
                        {
                            "key": "user to User",
                            "value": 3
                        }
                    ]
                },
                "synchronizationJobSettings": [
                    {
                        "name": "Domain",
                        "value": "{\"DomainFQDN\":\"contoso.com\",\"DomainNetBios\":\"CONTOSO\",\"ForestFQDN\":\"contoso.com\",\"ForestNetBios\":\"CONTOSO\"}"
                    },
                    {
                        "name": "DomainFQDN",
                        "value": "contoso.com"
                    },
                    {
                        "name": "DomainNetBios",
                        "value": "CONTOSO"
                    },
                    {
                        "name": "ForestFQDN",
                        "value": "contoso.com"
                    },
                    {
                        "name": "ForestNetBios",
                        "value": "CONTOSO"
                    },
                    {
                        "name": "QuarantineTooManyDeletesThreshold",
                        "value": "500"
                    }
                ]
            }
    ```
8. Now run the following query: `https://graph.microsoft.com/beta/serviceprincipals/{Service Principal Id}/synchronization/jobs/{AD2AAD Provisioning id}/schema`
 
    Example:  https://graph.microsoft.com/beta/serviceprincipals/653c0018-51f4-4736-a3a3-94da5dcb6862/synchronization/jobs/AD2AADProvisioning.e9287a7367e444c88dc67a531c36d8ec/schema

 Replace the {Service Principal Id} and {AD2ADD Provisioning Id} with your values.

9. This query will return the schema.
  ![](media/concept-attributes/schema1.png)
 
## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud provisioning?](what-is-cloud-provisioning.md)
