---
 title: include file
 description: include file
 services: digital-twins
 ms.author: alinast
 author: alinamstanciu
 manager: bertvanhoof
 ms.service: digital-twins
 ms.topic: include
 ms.date: 01/15/2020
 ms.custom: include file
---

The `objectIdType` (or **object identifier type**) refers to the type of identity that's given to a role. Apart from the `DeviceId` and `UserDefinedFunctionId` types, object identifier types correspond to properties of Azure Active Directory objects.

The following table contains the supported object identifier types in Azure Digital Twins:

| Type | Description |
| --- | --- |
| UserId | Assigns a role to a user. |
| DeviceId | Assigns a role to a device. |
| DomainName | Assigns a role to a domain name. Each user with the specified domain name has the access rights of the corresponding role. |
| TenantId | Assigns a role to a tenant. Each user who belongs to the specified Azure AD tenant ID has the access rights of the corresponding role. |
| ServicePrincipalId | Assigns a role to a service principal object ID. |
| UserDefinedFunctionId | Assigns a role to a user-defined function (UDF). |