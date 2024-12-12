---
title: Groups and roles in Oracle Database@Azure
description: Learn about groups and roles in Oracle Database@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: conceptual
ms.service: oracle-on-azure
ms.date: 12/12/2023
ms.custom: engagement-fy23
---

# Groups and roles in Oracle Database@Azure

This article lists groups and roles you use to manage access to Oracle Database@Azure. Using these groups and roles ensures that assigned users have the appropriate permissions to operate the service.

## Groups and roles in Azure

Use the following groups in your Azure account:

|Group name|Azure role assigned|description|
|----------|-------------------|-----------|
|odbaa-exa-infra-administrators| odbaa-exa-infra-administrator |This group is for administrators who need to manage all Oracle Exadata Database@Azure resources in Azure. |
|odbaa-vm-cluster-administrators |odbaa-vm-cluster-administrator |Users in this group can administer virtual machine (VM) cluster resources in Azure. |
|odbaa-db-family-administrators |*Not applicable* | This group is replicated in Oracle Cloud Infrastructure (OCI) during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |
|odbaa-db-family-readers |*Not applicable* |This group is replicated in OCI during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |
|odbaa-exa-cdb-administrators |*Not applicable* |This group is replicated in OCI during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |
|odbaa-exa-pdb-administrators |*Not applicable* |This group is replicated in OCI during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |

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
