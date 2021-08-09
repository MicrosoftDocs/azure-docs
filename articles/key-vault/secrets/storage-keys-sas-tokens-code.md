---
title: Fetch shared access signature tokens in code | Azure Key Vault
description: The managed storage account feature provides a seamless integration between Azure Key Vault and an Azure storage account. This sample uses the Azure SDK for .NET to manage SAS tokens.
ms.topic: tutorial
ms.service: key-vault
ms.subservice: secrets
author: msmbaldwin
ms.author: mbaldwin
ms.date: 09/10/2019
ms.custom: devx-track-csharp

# Customer intent: As a developer I want storage credentials and SAS tokens to be managed securely by Azure Key Vault.
---
# Create SAS definition and fetch shared access signature tokens in code

You can manage your storage account with shared access signature (SAS) tokens stored in your key vault. For more information, see [Grant limited access to Azure Storage resources using SAS](../../storage/common/storage-sas-overview.md).

> [!NOTE]
> We recommend using [Azure role-based access control (Azure RBAC)](../../storage/common/storage-auth-aad.md) to secure your storage account for superior security and ease of use over Shared Key authorization.

This article provides samples of .NET code that creates a SAS definition and fetches SAS tokens. See our [ShareLink](/samples/azure/azure-sdk-for-net/share-link/) sample for full details including the generated client for Key Vault-managed storage accounts. For information on how to create and store SAS tokens, see [Manage storage account keys with Key Vault and the Azure CLI](overview-storage-keys.md) or [Manage storage account keys with Key Vault and Azure PowerShell](overview-storage-keys-powershell.md).

## Code samples

In the following example we'll create a SAS template:

:::code language="csharp" source="~/azure-sdk-for-net/sdk/keyvault/samples/sharelink/Program.cs" range="91-97":::

Using this template, we can create a SAS definition using the 

:::code language="csharp" source="~/azure-sdk-for-net/sdk/keyvault/samples/sharelink/Program.cs" range="137-156":::

Once the SAS definition is created, you can retrieve SAS tokens like secrets using a `SecretClient`. You need to preface the secret name with the storage account name followed by a dash:

:::code language="csharp" source="~/azure-sdk-for-net/sdk/keyvault/samples/sharelink/Program.cs" range="52-58":::

If your shared access signature token is about to expire, you can fetch the same secret again to generate a new one.

For guide on how to use retrieved from Key Vault SAS token to access Azure Storage services, see [Use an account SAS to access Blob service](../../storage/common/storage-account-sas-create-dotnet.md#use-an-account-sas-from-a-client)

> [!NOTE]
> Your app needs to be prepared to refresh the SAS if it gets a 403 from Storage so that you can handle the case where a key was compromised and you need to rotate them faster than the normal rotation period. 

## Next steps
- Learn how to [Grant limited access to Azure Storage resources using SAS](../../storage/common/storage-sas-overview.md).
- Learn how to [Manage storage account keys with Key Vault and the Azure CLI](overview-storage-keys.md) or [Azure PowerShell](overview-storage-keys-powershell.md).
- See [Managed storage account key samples](https://github.com/Azure-Samples?utf8=%E2%9C%93&q=key+vault+storage&type=&language=)