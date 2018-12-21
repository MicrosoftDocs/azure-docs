---
 title: include file
 description: include file
 services: digital-twins
 author: kingdomofends
 ms.service: digital-twins
 ms.topic: include
 ms.date: 12/20/2018
 ms.author: adgera
 ms.custom: include file
---

The `objectIdType` (or **object identifier type**) refers to the type of identity that's given a role. Apart from the `DeviceId` and `UserDefinedFunctionId` types, the types correspond to a property of an Azure Active Directory object.

The following list contains the supported object identifier types in Azure Digital Twins:
  
- The `UserId` type assigns a role to a user.
- The `DeviceId` type assigns a role to a device.
- The `DomainName` type assigns a role to a domain name. Each user with the specified domain name has the access rights of the corresponding role.
- The `TenantId` type assigns a role to a tenant. Each user who belongs to the specified Azure AD tenant ID has the access rights of the corresponding role.
- The `ServicePrincipalId` type assigns a role to a service principal object ID.
- The `UserDefinedFunctionId` type assigns a role to a user-defined function (UDF).