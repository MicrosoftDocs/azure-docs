---
title: Entitlement concepts in Microsoft Azure Data Manager for Energy 
description:  This article describes the various concepts regarding the entitlement service in Azure Data Manager for Energy.
author: shikhagarg1
ms.author: shikhagarg
ms.service: energy-data-services
ms.topic: conceptual
ms.date: 02/10/2023
ms.custom: template-concept
---

# Entitlement service

Access management is a critical function for any service or resource. The entitlement service lets you control who can use your Azure Data Manager for Energy, what they can see or change, and which services or data they can use.

## Groups

The entitlements service of Azure Data Manager for Energy allows you to create groups and manage memberships of the groups. An entitlement group defines permissions on services/data sources for a given data partition in your Azure Data Manager for Energy instance. Users added to a given group obtain the associated permissions. Please note that different groups and associated user entitlements need to be set for a new data partition even in the same Azure Data Manager for Energy instance.

The entitlements service enables three use cases for authorization:

- **Data groups** used for data authorization (for example, data.welldb.viewers, data.welldb.owners)
- **Service groups** used for service authorization (for example, service.storage.user, service.storage.admin)
- **User groups** used for hierarchical grouping of user and service identities (for example, users.datalake.viewers, users.datalake.editors)

Some user, data, and service groups are created by default when a data partition is provisioned with details in [Bootstrapped OSDU Entitlements Groups](https://community.opengroup.org/osdu/platform/deployment-and-operations/infra-azure-provisioning/-/blob/master/docs/osdu-entitlement-roles.md).

## Group naming

All group identifiers (emails) are of form {groupType}.{serviceName|resourceName}.{permission}@{partition}.{domain}.com. A group naming convention is adopted by OSDU such that the group's name starts with 
1. the word "data." for data groups;
2. the word "service." for service groups;
3. the word "users." for user groups. There's one exception for "users" group created when a new data partition is provisioned. For example, for data partition `opendes`, the group `users@opendes.dataservices.energy` is created. 

## Users

For each OSDU group, you can either add a user as an OWNER or a MEMBER. 
1. If you're an OWNER of an OSDU group, then you can add or remove the members of that group or delete the group.
2. If you're a MEMBER of an OSDU group, you can view, edit, or delete the service or data depending on the scope of the OSDU group. For example, if you're a MEMBER of service.legal.editor OSDU group, you can call the APIs to change the legal service.
> [!NOTE]
> Do not delete the OWNER of a group unless there is another OWNER to manage the users. 

## Entitlement APIs

A full list of entitlements API endpoints can be found in [OSDU entitlement service](https://community.opengroup.org/osdu/platform/security-and-compliance/entitlements/-/blob/release/0.15/docs/tutorial/Entitlements-Service.md#entitlement-service-api). A few illustrations of how to use Entitlement APIs are available in the [How to manage users](how-to-manage-users.md).
> [!NOTE]
> The OSDU documentation refers to V1 endpoints, but the scripts noted in this documentation refer to V2 endpoints, which work and have been successfully validated.

OSDU&trade; is a trademark of The Open Group.

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [How to manage users](how-to-manage-users.md)
