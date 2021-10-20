---
title: Security overview
description: Security information about Azure resource bridge (preview).
ms.topic: conceptual
ms.date: 10/20/2021
---

# Azure Arc resource bridge (preview) security overview

This article describes the security configuration and considerations you should evaluate before deploying Azure Arc resource bridge (preview) in your enterprise.

## Identity and access control

Azure Arc resource bridge (preview) has a managed identity as part of a resource group inside an Azure subscription. That identity represents the resource bridge running in your on-premises environment. Access to this resource is controlled by standard [Azure role-based access control](../../role-based-access-control/overview.md). From the [**Access Control (IAM)**](../../role-based-access-control/role-assignments-portal.md) page in the Azure portal, you can verify who has access to your Azure Arc resource bridge (preview).

Users and applications granted [contributor](../../role-based-access-control/built-in-roles.md#contributor) or administrator role access to the resource can make changes to the resource, including deploying or deleting cluster extensions.

## Using a managed identity

By default, the Azure Active Directory system assigned identity used by Azure Arc can only be used to update the status of the Azure Arc resource bridge (preview) in Azure. Azure Arc resource bridge currently supports only system assigned identities. `clusteridentityoperator` initiates the first outbound communication. This first communication fetches the Managed Service Identity (MSI) certificate used by Azure Arc resource bridge (preview) agents for communication with Azure.

## Data encryption at rest

The Azure Arc resource bridge stores the resource information in the Cosmos DB, and as described in the [Encryption at rest in Azure Cosmos DB](../../cosmos-db/database-encryption-at-rest.md) article, all the data is encrypted at rest.

## Next steps