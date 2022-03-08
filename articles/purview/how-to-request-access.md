---
title: How to request access to a data source in Azure Purview.
description: This article describes how a user can request access to a data source from within Azure Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/01/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# How to request access for a data asset

This article outlines how to request access for a data asset discovered in Azure Purview's data catalog.

1. To request access to a data asset, use Azure Purview's [search](how-to-search-catalog.md) or [browse](how-to-browse-catalog.md) functionality to find the data asset.
1. Click on the asset to go to asset details. 
1. Click on 'Request access' to start data request workflow.
1. Optionally, you can provide comments on why data access is requested in the below blade.
1. Click on 'Send' to trigger the self-service data access workflow.

> [!NOTE]
A request access to resource set will actually submit the data access request for the folder on the resource set.

## Next steps

- [What are Azure Purview workflows](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
