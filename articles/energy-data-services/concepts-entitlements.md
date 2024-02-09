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

## OSDU Groups Structure

The entitlements service of Azure Data Manager for Energy allows you to create groups and manage memberships of the groups. An entitlement group defines permissions on services/data sources for a given data partition in your Azure Data Manager for Energy instance. Users added to a given group obtain the associated permissions. 

Please note that different groups and associated user entitlements need to be set for every **new data partition** even in the same Azure Data Manager for Energy instance.

The entitlements service enables three use cases for authorization:

1. **Data groups** are used to enable authorization for data.
   1. Some examples are data.welldb.viewers and data.welldb.owners.
   2. Individual users are added to the data groups which are added in the ACL of individual data records to enable `viewer` and `owner` access of the data once the data has been loaded in the system.
   3. To `upload` the data, you need to have entitlements of various OSDU services which are used during ingestion process. The combination of OSDU services depends on the method of ingestion. E.g., for manifest ingestion, refer [this](concepts-manifest-ingestion.md) to understand the OSDU services APIs used. The user **need not be part of the ACL** to upload the data.

2. **Service groups** are used to enable authorization for services.
   1. Some examples are service.storage.user and service.storage.admin.
   2. The service groups are **predefined** when OSDU services are provisioned in each data partition of Azure Data Manager for Energy instance.
   3. These groups enable `viewer`, `editor`, and `admin` access to call the OSDU APIs corresponding to the OSDU services.

3. **User groups** are used for hierarchical grouping of user and service groups.
   1. Some examples are users.datalake.viewers and users.datalake.editors.
   2. Some user groups are created by default when a data partition is provisioned. Details of these groups and their hierarchy scope are in [Bootstrapped OSDU Entitlements Groups](https://community.opengroup.org/osdu/platform/deployment-and-operations/infra-azure-provisioning/-/blob/master/docs/osdu-entitlement-roles.md).
   3. The `users@{partition}.{domain}` has the list of all the users with any type of access in a given data partition. Before adding a new user to any entitlement groups, you need to add the new user to the `users@{partition}.{domain}` group as well.
  
Individual users can be added to a `user group`. The `user group` is then added to a `data group`. The data group is added to the ACL of the data record. It enables abstraction for the data groups since individual users need not be added one by one to the data group and instead can be added to the `user group`. This `user group` can then be used repeatedly for multiple `data groups`. The nested structure thus helps provide scalability to manage memberships in OSDU.

## Group naming

All group identifiers (emails) are of form `{groupType}.{serviceName|resourceName}.{permission}@{partition}.{domain}`. A group naming convention is adopted by OSDU such that the group's name starts with 
1. the word "data." for data groups;
2. the word "service." for service groups;
3. the word "users." for user groups. There's one exception of this group naming rule for "users" group. It gets created when a new data partition is provisioned and its name follows the pattern of `users@{partition}.{domain}`.

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
As the next step, you can do the following:
- [How to manager users](how-to-manage-users.md)
- [How to manage legal tags](how-to-manage-legal-tags.md)
- [How to manage ACLs](how-to-manage-acls.md)

You can also ingest data into your Azure Data Manager for Energy instance with
- [Tutorial on CSV parser ingestion](tutorial-csv-ingestion.md)
- [Tutorial on manifest ingestion](tutorial-manifest-ingestion.md)
