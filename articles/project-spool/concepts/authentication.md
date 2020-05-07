---
title: Authentication and Authorization
description: Learn about the various ways an app or service can authenticate to ACS, and the levels of control that you have to gate access to various features.
author: mikben
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/18/2020
ms.topic: conceptual
ms.service: azure-project-spool

---
# Authorizing access to ACS

## Authorization Options
Every client interaction with Azure Communication services must have be authenticated and authorized, so that the service ensures that the client has the permissions required to access the data. Various options for authorizing service clients are below:


|---|Device type|Access Keys| SAS Keys| Azure Active Directory (AAD) | User Access Tokens |
|---|---|---|---|---|---|
|||*HMAC using access keys from Azure portal*|*Scoped, time-bound self signed tokens derived from access keys*|*User and trusted services from linked AAD*| *Scoped, time-bound user tokens created by trusted service*
|ARM|Trusted Service|Supported|Supported|Supported|-|
|DataPlane Configuration (Phone Numbers, Rooms)| Trusted Service |Supported|Supported|Supported|-|
|Chat| Trusted Service |Supported|Supported|Supported|-|
|SMS| Trusted Service |Supported|Supported|Supported|-|
|Calling| Low-trust Devices |-|-|-|Supported|

The following sections will explore authorization concepts around a common dataplane management sceanrio: creating a phone number.

## SAS token scopes

## Creating SAS tokens
## Creating HMACs




### Create a TokenCredential for an AAD service principal to access the ACS control plane
Trusted services can access ACS on behalf of a service principal or managed identity. For more information see the authorization topic. While AAD human users can be authorized for management tasks in ACS, it is not encouraged especially for potentially insecure end-user devices in a product setting.  Management tasks should be driven by service or managed identity principals, and end-user communication activity driven by communication identity tokens allocated by your own trusted services.  

### Use this TokenCredential to create an ACS Communication Client with the Management capability
Now that the trusted service has a TokenCredential, it will create a Communication Client with management capabilities. ACS SDKs use a dependency injection pattern where capabilities are injected into the client class at instantiation.
This step assumes that the TokenCredential represents an AAD entity that is authorized for the Management capability. capabilities are permitted to specific AAD entities, otherwise an exception will be thrown. 
```
CommunicationClient serviceClient = new CommunicationClient(
                new Capabilities().AddManagement(),
                new Uri("https://contoso.westus.acs.azure.net"),
          serviceToken); 
```
Through the Azure portal you can retrieve access keys which bypass AAD authentication for management tasks.  AAD is a more secure option and usage of access keys is not recommended in production settings.
```
CommunicationClient serviceClient = new CommunicationClient(
                new Capabilities().AddManagement(),
                new Uri("https://contoso.westus.acs.azure.net"),
          “<access key string from portal>”);
```
