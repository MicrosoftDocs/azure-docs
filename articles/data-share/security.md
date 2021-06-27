---
title: Security overview for Azure Data Share
description: Security overview for Azure Data Share
author: jifems
ms.author: jife
ms.service: data-share
ms.topic: how-to
ms.date: 12/17/2020
---
# Security overview for Azure Data Share

This article provides a security overview of the Azure Data Share service.

## Security overview

Azure Data Share leverages the underlying security that Azure offers to protect data at rest and in transit. Data is encrypted at rest, where supported by the underlying data store. Data is also encrypted in transit using TLS 1.2. Metadata about a data share is also encrypted at rest and in transit. Azure Data Share does not store contents of the customer data being shared.

Azure Data Share leverages managed identity (previously known as MSI) to access data stores that are being used for data sharing. There is no exchange of credentials between a data provider and a data consumer. For more information on managed identity, refer to [Managed Identities for Azure Resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md). For more information on roles and permissions required to share data, refer to [Roles and requirements](concepts-roles-permissions.md).

## Access control

Access controls to Azure Data Share can be set on the Data Share resource level to ensure it is accessed by those that are authorized. Owner and Contributor of a Data Share resource can share data, receive shares, and make changes to existing shares. Reader of a Data Share resource can view shares, but cannot make changes. 

Once a share is created or received, users with proper permission to the Data Share resource can make changes. When a user who creates or receives a share leaves the organization, it does not terminate the share or stop flow of data. Other users with proper permission to the Data Share resource can continue to manage the share.

## Share data from or to data stores with firewall enabled
To share data from or to storage accounts with firewall turned on, you need to enable **Allow trusted Microsoft services** in your storage account. See [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md#trusted-microsoft-services) for details.


## Next steps

To learn how to start sharing data, continue to the [share your data](share-your-data.md) tutorial.
