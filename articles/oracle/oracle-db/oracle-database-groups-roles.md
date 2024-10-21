---
title: Groups and roles for Oracle Database@Azure
description: Learn about groups and roles for Oracle Database@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: conceptual
ms.service: oracle-on-azure
ms.date: 12/12/2023
ms.custom: engagement-fy23
---

# Groups and roles for Oracle Database@Azure

This article lists groups and roles you use to manage access to Oracle Database@Azure. Using these groups and roles ensures that assigned users have the appropriate permissions to operate the service.

## Groups and roles in Azure

Use the following groups in your Azure account:

|Group name|Azure role assigned|description|
|----------|-------------------|-----------|
|odbaa-exa-infra-administrators| odbaa-exa-infra-administrator |This group is for administrators who need to manage all Oracle Exadata Database@Azure resources in Azure. |
|odbaa-vm-cluster-administrators |odbaa-vm-cluster-administrator |User in this group can administer virtual machine (VM) cluster resources in Azure. |
|odbaa-db-family-administrators |*Not applicable* | This group is replicated in Oracle Cloud Infrastructure (OCI) during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |
|odbaa-db-family-readers |*Not applicable* |This group is replicated in OCI during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |
|odbaa-exa-cdb-administrators |*Not applicable* |This group is replicated in OCI during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |
|odbaa-exa-pdb-administrators |*Not applicable* |This group is replicated in OCI during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |

## Groups in Oracle Cloud Infrastructure

Use the following groups in your OCI tenancy:

|Group name|Description|
|----------|-----------|
|odbaa-db-family-administrators | Users of this group are administrators who manage database family actions. |
|odbaa-db-family-readers |Users of this group are administrators who read database family actions. |
|odbaa-exa-cdb-administrators |Users of this group are administrators who manage Oracle Container Database (CDB) actions. |
|odbaa-exa-pdb-administrators | Users of this group are administrators who manage Oracle Pluggable Database (PDB) actions.|

## Required IAM policies

The following IAM policies are required for each user and for each group in Oracle Database@Azure:

- `Allow any-user to use tag-namespaces in tenancy where request.principal.type = ‘multicloudlink’`
- `Allow any-user to manage tag-defaults in tenancy where request.principal.type = ‘multicloudlink’`

For information on working with policies, see [Getting started with policies](https://docs.oracle.com/iaas/Content/Identity/policiesgs/get-started-with-policies.htm).

## Related content

- [Overview - Oracle Database@Azure](database-overview.md)
- [Onboard with Oracle Database@Azure](onboard-oracle-database.md)
- [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
- [Oracle Database@Azure support information](oracle-database-support.md)
