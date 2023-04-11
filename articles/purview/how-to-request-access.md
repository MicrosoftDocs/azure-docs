---
title: How to request access to a data source in Microsoft Purview.
description: This article describes how a user can request access to a data source from within Microsoft Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/23/2023
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# How to request access for a data asset

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

If you discover a data asset in the catalog that you would like to access, you can request access directly through Microsoft Purview. The request will trigger a workflow that will request that the owners of the data resource grant you access to that data source.

This article outlines how to make an access request.

> [!NOTE]
> For this option to be available for a resource, a [self-service access workflow](how-to-workflow-self-service-data-access-hybrid.md) needs to be created and assigned to the collection where the resource is registered. Contact the collection administrator, data source administrator, or workflow administrator of your collection for more information.
> Or, for information on how to create a self-service access workflow, see our [self-service access workflow documentation](how-to-workflow-self-service-data-access-hybrid.md).

## Request access

[!INCLUDE [request access to datasets](includes/how-to-self-service-request-access.md)]

## Next steps

- [What are Microsoft Purview workflows](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
- [Self-service policies](concept-self-service-data-access-policy.md) 
