---
title: Managed identities with Azure Video Analyzer
description: This topic explains how to use managed identities with Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 06/01/2021

---

# Managed identity

A common challenge for developers is the management of secrets and credentials to secure communication between different services. On Azure, managed identities eliminate the need for developers having to manage credentials by providing an identity for the Azure resource in Azure Active Directory (Azure AD) and using it to obtain Azure AD tokens.

When you create an Azure Video Analyzer account, you have to associate an Azure storage account with it. If you use Video Analyzer to record the live video from a camera, that data is stored as blobs in a container in the storage account. You must use a managed identity to grant the Video Analyzer account the appropriate access to the storage account as follows.


## User assigned managed identity for Video Analyzer

1. Create a [user-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity)

1. Create an Azure storage account

   [!INCLUDE [the video analyzer account and storage account must be in the same subscription and region](./includes/note-account-storage-same-subscription.md)]

1. Add the [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) and [Reader](../../role-based-access-control/built-in-roles.md#reader) roles for the above storage account to the managed identity.

1. Create the Video Analyzer account, providing the user-assigned managed identity and the storage account as values to the relevant properties.

Video Analyzer can then access storage account on your behalf using the managed identity.

See [this](create-video-analyzer-account.md) article for an example of using the Azure portal to accomplish the above.


## Next steps

To learn more about what managed identities can do for you and your Azure applications, see [Azure AD Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md).
