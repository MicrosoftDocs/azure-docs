---
title: Security overview for Azure Data Share
description: Security overview for Azure Data Share
author: jifems
ms.author: jife
ms.service: data-share
ms.topic: conceptual
ms.date: 06/05/2020
---
# Security overview for Azure Data Share

This article provides a security overview of the Azure Data Share service.

## Security overview

Azure Data Share leverages the underlying security that Azure offers to protect data at rest and in transit. Data is encrypted at rest, where supported by the underlying data store. Data is also encrypted in transit. Metadata about a data share is also encrypted at rest and in transit. 

Access controls can be set on the Azure Data Share resource level to ensure it is accessed by those that are authorized. 

Azure Data Share leverages managed identity (previously known as MSI) to access data stores that are being used for data sharing. There is no exchange of credentials between a data provider and a data consumer. For more information on managed identity, refer to [Managed Identities for Azure Resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities). For more information on roles and permissions required to share data, refer to [Roles and requirements](concepts-roles-permissions.md).

## Next steps

To learn how to start sharing data, continue to the [share your data](share-your-data.md) tutorial.




