---
title: Azure Purview Self-service access concepts
description: Understand what self-service access and data discovery are in Azure Purview, and explore how users can take advantage of it.
author: bjspeaks
ms.author: blessonj
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: conceptual
ms.date: 03/10/2022
---

# Azure Purview Self-service data discovery and access (Preview)

This article helps you understand Azure Purview Self-service data access policy.

> [!IMPORTANT]
> Azure Purview Self-service data access policy is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Important limitations

The self-service data access policy is only supported when the prerequisites mentioned in [data use governance](./tutorial-data-owner-policies-storage.md) are satisfied.

## Overview

Azure Purview Self-service data access workflow allows data consumer to request access to data when browsing or searching for data. Once the data access request is approved, a policy gets auto-generated to grant access to the requestor provided the data source is enabled for data use governance. Currently, self-service data access policy is supported for storage accounts, containers, folders, and files.

A **workflow admin** will need to map a self-service data access workflow to a collection. Collection is logical grouping of data sources that are registered within Azure Purview. **Only data source(s) that are registered** for data use governance will have self-service policies auto-generated.

## Terminology

* **Data consumer** is anyone who uses the data. Example, a data analyst accessing marketing data for customer segmentation. Data consumer and data requestor will be used interchangeably within this document.

* **Collection** is logical grouping of data sources that are registered within Azure Purview.

* **Self-service data access workflow** is the workflow that is initiated when a data consumer requests access to data.

* **Approver** is either security group or AAD users that can approve self-service access requests.

## How to use Azure Purview self-service data access policy

Azure Purview allows organizations to catalog metadata about all registered data assets. It allows data consumers to search for or browse to the required data asset.  

With self-service data access workflow, data consumers can not only find data assets but also request access to the data assets. When the data consumer requests access to a data asset, the associated self-service data access workflow is triggered.

A default self-service data access workflow template is provided with every Azure Purview account.The default template can be amended to add more approvers and/or set the approver's email address. For more details refer [Create and enable self-service data access workflow](./how-to-workflow-self-service-data-access-hybrid.md).

Whenever a data consumer requests access to a dataset, the notification is sent to the workflow approver(s). The approver(s) can view the request and approve it either from Azure purview portal or from within the email notification. When the request is approved, a policy is auto-generated and applied against the respective data source. Self-service data access policy gets auto-generated only if the data source is registered for **data use governance**. The pre-requisites mentioned within the [data use governance](./tutorial-data-owner-policies-storage.md) have to be satisfied.  

## Next steps

If you would like to preview these features in your environment, follow the link below.
-  [Enable data use governance](./tutorial-data-owner-policies-storage.md)
-  [create self-service data access workflow](./how-to-workflow-self-service-data-access-hybrid.md)
-  [working with policies at file level](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-file-level-permission/ba-p/3102166)
-  [working with policies at folder level](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-folder-level-permission/ba-p/3109583)
