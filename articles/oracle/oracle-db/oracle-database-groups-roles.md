---
title: Groups and roles for Oracle Database@Azure
description: title: Groups and roles for Oracle Database@Azure
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: oracle
ms.topic: article
ms.date: 12/06/2023
---

This article lists the groups and roles used to manage access to Oracle Database@Azure. Using these groups and roles ensures that assigned users have the appropriate permissions to operate the service.

## Groups and roles in Azure

Use the following groups in your Azure account.

|Group name|Azure role assigned|description|
|----------|-------------------|-----------|
|odbaa-exa-infra-administrators|odbaa-exa-infra-administrator |This group is for administrators who need to manage all Oracle Exadata Database Service resources in Azure |
|odbaa-vm-cluster-administrators |odbaa-vm-cluster-administrator |User in this group can administer VM cluster resources in Azure |
|odbaa-db-family-administrators |*not applicable* |This group is replicated in OCI during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |
|odbaa-db-family-readers |*not applicable* |This group is replicated in OCI during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |
|odbaa-exa-cdb-administrators |*not applicable* |This group is replicated in OCI during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |
|odbaa-exa-pdb-administrators |*not applicable* |This group is replicated in OCI during the optional identity federation process. OCI policies are defined for this group in the Oracle Cloud environment. |

## Groups in Oracle Cloud Infrastructure 

Use the following groups in your Oracle Cloud Infrastructure (OCI) tenancy.

|Group name|Description|
|----------|-----------|
|odbaa-db-family-administrators |Group to manage DB family actions |
|odbaa-db-family-readers |Group to read DB family actions |
|odbaa-exa-cdb-administrators |Group to manage Oracle Container Database (CDB) actions |
|odbaa-exa-pdb-administrators |Group to manage Oracle Pluggable Database (PDB) actions|

## Next steps
- [Overview - Oracle Database@Azure](database-overview.md)
- [Onboard with Oracle Database@Azure](onboard-oracle-database.md)
- [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
- [Oracle Database@Azure support information](oracle-database-support.md)
