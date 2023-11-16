---
title: Microsoft Azure Data Manager for Energy entitlement concepts
description:  This article describes the various concepts regarding the entitlement services in Azure Data Manager for Energy
author: Shikha Garg
ms.author: shikhagarg1
ms.service: energy-data-services
ms.topic: conceptual
ms.date: 02/10/2023
ms.custom: template-concept
---

# Entitlement service

Access management is a critical function for any service or resource. Entitlement service helps you manage who has access to your Azure Data Manager for Energy instance, what they can do with it, and what services they have access to.

## Groups

The entitlements service of Azure Data Manager for Energy allows you to create groups, and an entitlement group defines permissions on services/data sources for your Azure Data Manager for Energy instance. Users added by you to that group obtain the associated permissions.

The main motivation for entitlements service is data authorization, but the functionality enables three use cases:

- **Data groups** used for data authorization (for example, data.welldb.viewers, data.welldb.owners)
- **Service groups** used for service authorization (for example, service.storage.user, service.storage.admin)
- **User groups** used for hierarchical grouping of user and service identities (for example, users.datalake.viewers, users.datalake.editors)

## Users

For each group, you can either add a user as an OWNER or a MEMBER. The only difference being if you're an OWNER of a group, then you can manage the members of that group. 
> [!NOTE]
> Do not delete the OWNER of a group unless there is another OWNER to manage the users. 

## Group naming

All group identifiers (emails) will be of form {groupType}.{serviceName|resourceName}.{permission}@{partition}.{domain}.com. A group naming convention has been adopted such that the group's name should start with the word "data." for data groups; "service." for service groups; and "users." for user groups. An exception is when a data partition is provisioned. When a data partition is created, so is a corresponding group-for example, for data partition `opendes`, the group `users@opendes.dataservices.energy` is created. 

## Permissions and roles

The OSDU&trade; Data Ecosystem user groups provide an abstraction from permission and user management and--without a user creating their own groups--the following user groups exist by default:

- **users.datalake.viewers**: viewer level authorization for OSDU Data Ecosystem services.
- **users.datalake.editors**: editor level authorization for OSDU Data Ecosystem services and authorization to create the data using OSDU&trade; Data Ecosystem storage service.
- **users.datalake.admins**: admin level authorization for OSDU Data Ecosystem services.

A full list of all API endpoints for entitlements can be found in [OSDU entitlement service](https://community.opengroup.org/osdu/platform/security-and-compliance/entitlements/-/blob/release/0.15/docs/tutorial/Entitlements-Service.md#entitlement-service-api). We have provided few illustrations below. Depending on the resources you have, you need to use the entitlements service in different ways than what is shown below. [Entitlement permissions](https://community.opengroup.org/osdu/platform/security-and-compliance/entitlements/-/blob/release/0.15/docs/tutorial/Entitlements-Service.md#permissions) on the endpoints and the corresponding minimum level of permissions required.

> [!NOTE]
> The OSDU documentation refers to V1 endpoints, but the scripts noted in this documentation refers to V2 endpoints, which work and have been successfully validated

OSDU&trade; is a trademark of The Open Group.

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [How to manage users](how-to-manage-users.md)
