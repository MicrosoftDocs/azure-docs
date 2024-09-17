---
title: Entitlement concepts in Azure Data Manager for Energy 
description: This article describes various concepts of the entitlement service in Azure Data Manager for Energy.
author: shikhagarg1
ms.author: shikhagarg
ms.service: energy-data-services
ms.topic: conceptual
ms.date: 02/10/2023
ms.custom: template-concept
---

# Entitlement service

Access management is a critical function for any service or resource. The entitlement service lets you control who can use your Azure Data Manager for Energy instance, what they can see or change, and which services or data they can use.

## OSDU groups structure and naming

The entitlement service of Azure Data Manager for Energy allows you to create groups and manage memberships of the groups. An entitlement group defines permissions on services or data sources for a specific data partition in your Azure Data Manager for Energy instance. Users added to a specific group obtain the associated permissions. All group identifiers (emails) are of the form `{groupType}.{serviceName|resourceName}.{permission}@{partition}.{domain}`.

Different groups and associated user entitlements must be set for every *new data partition*, even in the same Azure Data Manager for Energy instance.

## Types of OSDU groups
The entitlement service enables three use cases for authorization:

### Data groups
- Data groups are used to enable authorization for data.
- The data groups start with the word "data," such as `data.welldb.viewers` and `data.welldb.owners`.
- Individual users are added to the data groups, which are added in the ACL of individual data records to enable `viewer` and `owner` access of the data after the data is loaded in the system.
- To `upload` the data, you need to have entitlements of various OSDU services, which are used during the ingestion process. The combination of OSDU services depends on the method of ingestion. For example, for manifest ingestion, see [Manifest-based ingestion concepts](concepts-manifest-ingestion.md) to understand the OSDU services that APIs used. The user *doesn't need to be part of the ACL* to upload the data.

### Service groups
- Service groups are used to enable authorization for services.
- The service groups start with the word "service," such as `service.storage.user` and `service.storage.admin`.
- The service groups are *predefined* when OSDU services are provisioned in each data partition of the Azure Data Manager for Energy instance.
- These groups enable `viewer`, `editor`, and `admin` access to call the OSDU APIs corresponding to the OSDU services.

### User groups
- User groups are used for hierarchical grouping of user and service groups.
- The service groups start with the word "users," such as `users.datalake.viewers` and `users.datalake.editors`.


**Nested hierarchy** 
- If user_1 is part of a data_group_1 and data_group_1 is added as a member to the user_group_1, OSDU code checks for the nested membership and authorize user_1 to access the entitlements for user_group_1. This is explained in [OSDU Entitlement Check API](https://community.opengroup.org/osdu/platform/system/storage/-/blob/master/storage-core/src/main/java/org/opengroup/osdu/storage/service/EntitlementsAndCacheServiceImpl.java?ref_type=heads#L105) and [OSDU Retrieve Group API](https://community.opengroup.org/osdu/platform/security-and-compliance/entitlements/-/blob/master/provider/entitlements-v2-azure/src/main/java/org/opengroup/osdu/entitlements/v2/azure/spi/gremlin/retrievegroup/RetrieveGroupRepoGremlin.java#:~:text=public%20ParentTreeDto%20loadAllParents(EntityNode%20memberNode)%20%7B).

- You can add individual users to a `user group`. The `user group` is then added to a `data group`. The data group is added to the ACL of the data record. It enables abstraction for the data groups because individual users don't need to be added one by one to the data group. Instead, you can add users to the `user group`. Then you can use the `user group` repeatedly for multiple `data groups`. The nested structure helps provide scalability to manage memberships in OSDU.

## Default groups
- Some OSDU groups are created by default when a data partition is provisioned. 
- Data groups of `data.default.viewers` and `data.default.owners` are created by default.
- Service groups to view, edit, and admin each service such as `service.entitlement.admin` and `service.legal.editor` are created by default.
- User groups of `users`, `users.datalake.viewers`, `users.datalake.editors`, `users.datalake.admins`, `users.datalake.ops`, and `users.data.root` are created by default.
- The chart of default members and groups in [Bootstrapped OSDU entitlement groups](https://community.opengroup.org/osdu/platform/deployment-and-operations/infra-azure-provisioning/-/blob/master/docs/osdu-entitlement-roles.md) shows the column header groups as the member of row headers. For example, `users` group is member of `data.default.viewers` and `data.default.owners` by default. `users.datalake.admins` and `users.datalake.ops` are member of `service.entitlement.admin` group.
- Service principal or the `client-id` or the `app-id` is the default owner of all the groups. 
  
### Peculiarity of `users@` group
- There's one exception of this group naming rule for the "users" group. It gets created when a new data partition is provisioned and its name follows the pattern of `users@{partition}.{domain}`.
- It has the list of all the users with any type of access in a specific data partition. Before you add a new user to any entitlement groups, you also need to add the new user to the `users@{partition}.{domain}` group.

### Peculiarity of `users.data.root@` group
- users.data.root entitlement group is the default member of all data groups when groups are created. If you try to remove users.data.root from any data group, you get error since this membership is enforced by OSDU.
- users.data.root becomes automatically the default and permanent owner of all the data records when the records get created in the system as explained in [OSDU validate owner access API](https://community.opengroup.org/osdu/platform/system/storage/-/blob/master/storage-core/src/main/java/org/opengroup/osdu/storage/service/DataAuthorizationService.java?ref_type=heads#L66) and [OSDU users data root check API](https://community.opengroup.org/osdu/platform/system/storage/-/blob/master/storage-core/src/main/java/org/opengroup/osdu/storage/service/EntitlementsAndCacheServiceImpl.java#L98). As a result, along with checking the OSDU membership of the user, the system also checks if the user is “DataManager”, i.e., part of data.root group, to assess the access of the data record.
- The default membership in users.data.root is only the `app-id` that is used to set up the instance. You can add other users explicitly to this group to give them default access of data records. 

As an example in the scenario, 
- A data_record_1 has 2 ACLs: ACL_1 and ACL_2.
- User_1 is a member of ACL_1 and users.data.root.
  
Now if you remove user_1 from  ACL_1, user_1 remains to have access of the data_record_1 via users.data.root group.

And if ACL_1 and ACL_2 are removed from data_record_1, users.data.root continue to have owner access of the data. This preserves the data record from becoming orphan ever.

### Unknown OID
You will see one unknown OID in all the OSDU groups added by default, this OID refers to an internal Azure Data Manager for Energy GUID that is used for internal system to system communication. This GUID gets created uniquely for each instance and is enforced by the system to not be deleted or removed by you.

## Users

For each OSDU group, you can add a user as either an OWNER or a MEMBER:

- If you're an OWNER of an OSDU group, you can add or remove the members of that group or delete the group.
- If you're a MEMBER of an OSDU group, you can view, edit, or delete the service or data depending on the scope of the OSDU group. For example, if you're a MEMBER of the `service.legal.editor` OSDU group, you can call the APIs to change the legal service.

> [!NOTE]
> Don't delete the OWNER of a group unless there's another OWNER to manage the users.



## Entitlement APIs

For a full list of Entitlement API endpoints, see [OSDU entitlement service](https://community.opengroup.org/osdu/platform/security-and-compliance/entitlements/-/tree/release/0.15/docs). A few illustrations of how to use Entitlement APIs are available in [Manage users](how-to-manage-users.md).

> [!NOTE]
> The OSDU documentation refers to v1 endpoints, but the scripts noted in this documentation refer to v2 endpoints, which work and have been successfully validated.

OSDU&reg; is a trademark of The Open Group.

## Next steps

For the next step, see:

- [Manage users](how-to-manage-users.md)
- [Manage legal tags](how-to-manage-legal-tags.md)
- [Manage ACLs](how-to-manage-acls.md)

You can also ingest data into your Azure Data Manager for Energy instance:

- [Tutorial on CSV parser ingestion](tutorial-csv-ingestion.md)
- [Tutorial on manifest ingestion](tutorial-manifest-ingestion.md)
