---
title: Microsoft Purview Self-service access concepts
description: Understand what self-service access and data discovery are in Microsoft Purview, and explore how users can take advantage of it.
author: bjspeaks
ms.author: blessonj
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: conceptual
ms.date: 03/10/2022
---

# Microsoft Purview Self-service data discovery and access (Preview)

This article helps you understand Microsoft Purview Self-service data access policy.

> [!IMPORTANT]
> Microsoft Purview Self-service data access policy is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Important limitations

The self-service data access policy is only supported when the prerequisites mentioned in [Data Use Management](./how-to-enable-data-use-management.md#prerequisites) are satisfied.

## Overview

Microsoft Purview Self-service data access workflow allows data consumer to request access to data when browsing or searching for data. Once the data access request is approved, a policy gets auto-generated to grant access to the requestor provided the data source is enabled for Data Use Management. Currently, self-service data access policy is supported for storage accounts, containers, folders, and files.

A **workflow admin** will need to map a self-service data access workflow to a collection. Collection is logical grouping of data sources that are registered within Microsoft Purview. **Only data source(s) that are registered** for Data Use Management will have self-service policies auto-generated.

## Terminology

* **Data consumer** is anyone who uses the data. Example, a data analyst accessing marketing data for customer segmentation. Data consumer and data requestor will be used interchangeably within this document.

* **Collection** is logical grouping of data sources that are registered within Microsoft Purview.

* **Self-service data access workflow** is the workflow that is initiated when a data consumer requests access to data.

* **Approver** is either security group or Azure Active Directory (Azure AD) users or Azure AD Groups that can approve self-service access requests.

## How to use Microsoft Purview self-service data access policy

Microsoft Purview allows organizations to catalog metadata about all registered data assets. It allows data consumers to search for or browse to the required data asset.  

With self-service data access workflow, data consumers can not only find data assets but also request access to the data assets. When the data consumer requests access to a data asset, the associated self-service data access workflow is triggered.

A default self-service data access workflow template is provided with every Microsoft Purview account. The default template can be amended to add more approvers and/or set the approver's email address. For more details refer [Create and enable self-service data access workflow](./how-to-workflow-self-service-data-access-hybrid.md).

Whenever a data consumer requests access to a dataset, the notification is sent to the workflow approver(s). The approver(s) can view the request and approve it either from Microsoft Purview portal or from within the email notification. When the request is approved, a policy is auto-generated and applied against the respective data source. Self-service data access policy gets auto-generated only if the data source is registered for **Data Use Management**. The pre-requisites mentioned within the [Data Use Management](./how-to-enable-data-use-management.md#prerequisites) have to be satisfied.

Data consumer can access the requested dataset using tools such as PowerBI or Azure Synapse Analytics workspace.

>[!NOTE]
> Users will not be able to browse to the asset using the Azure Portal or Storage explorer if the only permission granted is read/modify access at the file or folder level of the storage account.

> [!CAUTION]
> Folder level permission is required to access data in ADLS Gen 2 using PowerBI.
> Additionally, resource sets are not supported by self-service policies. Hence, folder level permission needs to be granted to access resource set files such as CSV or parquet. 

## Next steps

If you would like to preview these features in your environment, follow the link below.
-  [Enable Data Use Management](./how-to-enable-data-use-management.md#prerequisites)
-  [create self-service data access workflow](./how-to-workflow-self-service-data-access-hybrid.md)
-  [working with policies at file level](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-file-level-permission/ba-p/3102166)
-  [working with policies at folder level](https://techcommunity.microsoft.com/t5/azure-purview-blog/data-policy-features-accessing-data-when-folder-level-permission/ba-p/3109583)
-  [self-service policies for Azure SQL Database tables and views](./how-to-policies-self-service-azure-sql-db.md)
