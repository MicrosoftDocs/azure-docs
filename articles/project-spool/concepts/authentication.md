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


|---|Device type|Access Keys| SAS Tokens| Azure Active Directory (AAD) | User Access Tokens |
|---|---|---|---|---|---|
|||*HMAC using access keys from Azure portal*|*Scoped, time-bound self signed tokens derived from access keys*|*User and trusted services from linked AAD*| *Scoped, time-bound user tokens created by trusted service*
|ARM|Trusted Service|-|-|Supported|-|
|DataPlane Configuration (Phone Numbers, Rooms)| Trusted Service |Supported|Supported|Supported|-|
|Chat| Trusted Service |Supported|Supported|Supported|-|
|SMS| Trusted Service |Supported|Supported|Supported|-|
|Calling| Low-trust Devices |-|-|-|Supported|

The following sections will explore authorization concepts around a common dataplane management sceanrio: creating a phone number.

## SAS token scopes

The SAS token is encoded in JWT form using the resource's Access Key. The tokens are validated by the Resource Provider so the access key isn't leaked to the Auth library.

The SAS token may contain the following claims:

* `iss` (required) is the resource the token is specific to.
* `res:rgn` (required) is the region of the resource the token is specific to.
* `nbf` (optional) is the "not before time" before which the SAS token will not be accepted.
* `exp` (optional) is the expiration time after which the SAS token will not be accepted.
* `sas:ip` (optional) is an IP network range that the client must comply with, in the form `<ip-address-range>/<mask-bits>`, e.g. "192.168.1.0/28"
* `sas:areas` (required) is a JSON array of string containing the allowed areas. Values in this array must match the `AuthenticationRole` values, i.e. be one of the following: `"manageNumbers"`, `"manageRooms"`, `"manageTokens"`, `"calling"`, `"chat"`, or `"sms"`. Multiple values can be passed, e.g. `[ "manageRooms", "manageTokens" ]`

The `AuthenticationRoles` value enables us to work with SAS tokens that are scoped to specific areas of functionality. The possible values are:

* `ManageNumbers` — allows for creation/management of PSTN Telephone Numbers.
* `ManageRooms` — allows for creation/management of Rooms.
* `ManageTokens` — allows for creation/management of User Tokens.
* `Calling` — allows access to calling functionality.
* `Chat` — allows access to chat functionality.
* `SMS` — allows access to SMS functionality.

In order to use a SAS token to authenticate, it should be passed via an HTTP `Authorization` header using the custome `SpoolSAS` protocol. For example:

```
Authorization: SpoolSAS <SAS Token>
```

## Creating HMACs

`HMAC-SHA256` where the value is a sequence of fields used to perform HMAC validation. The value will be in the form:<br>`SignedHeaders=date;host;x-ms-content-sha256&Signature=<hmac-sha256-signature>`



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
