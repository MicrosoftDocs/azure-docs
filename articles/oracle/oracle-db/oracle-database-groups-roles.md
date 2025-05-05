---
title: Groups and roles in Oracle Database@Azure
description: Learn about groups and roles in Oracle Database@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 12/12/2023
ms.custom: engagement-fy23
---

# Groups and roles in Oracle Database@Azure

This article lists groups and roles you use to manage access to Oracle Database@Azure. Using these groups and roles ensures that assigned users have the appropriate permissions to operate the service.

## Groups and roles in Azure

For more information about groups and roles in Azure, see [Set Up Role Based Access Control for Oracle Database@Azure](https://docs.oracle.com/en-us/iaas/Content/database-at-azure/oaaonboard-task-7.htm).

## Groups in Oracle Cloud Infrastructure

Use the following groups in your OCI tenancy:

|Group name|Description|
|----------|-----------|
|odbaa-db-family-administrators | Users in this group are administrators who manage database family actions. |
|odbaa-db-family-readers |Users in this group are administrators who read database family actions. |
|odbaa-exa-cdb-administrators |Users in this group are administrators who manage Oracle Container Database (CDB) actions. |
|odbaa-exa-pdb-administrators | Users in this group are administrators who manage Oracle Pluggable Database (PDB) actions.|

## Required Identity and Access Management policies

The following Oracle Cloud Infrastructure Identity and Access Management (IAM) policies are required for each user and each group in Oracle Database@Azure:

- `Allow any-user to use tag-namespaces in tenancy where request.principal.type = ‘multicloudlink’`
- `Allow any-user to manage tag-defaults in tenancy where request.principal.type = ‘multicloudlink’`

For information about working with policies, see [Get started with policies](https://docs.oracle.com/iaas/Content/Identity/policiesgs/get-started-with-policies.htm) in Oracle databases.

## Related content

- [Overview of Oracle Database@Azure](database-overview.md)
- [Onboard Oracle Database@Azure](onboard-oracle-database.md)
- [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
- [Support for Oracle Database@Azure](oracle-database-support.md)
