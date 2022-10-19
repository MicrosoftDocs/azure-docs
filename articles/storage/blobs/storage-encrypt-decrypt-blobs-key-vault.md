---
title: Encrypt and decrypt blobs using Azure Key Vault
titleSuffix: Azure Storage
description: Learn how to encrypt and decrypt a blob using client-side encryption with Azure Key Vault.
author: pauljewellmsft
ms.service: storage
ms.topic: tutorial
ms.date: 09/16/2022
ms.author: pauljewell
ms.reviewer: ozgun
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Tutorial: Encrypt and decrypt blobs using Azure Key Vault

In this tutorial, you learn how to use client-side encryption to encrypt and decrypt blobs using keys stored in Azure Key Vault.

Azure Key Vault is a cloud solution for managing secrets, keys, and certificates. You can read more about Azure Key Vault on the [overview page](../../key-vault/general/overview.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a key in Azure Key Vault
> * Configure client-side encryption options through Key Vault
> * Create a blob service client object with client-side encryption enabled
> * Encrypt a blob during upload and decrypt on download

## Prerequisites

- Azure subscription - [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- Key vault - create one using [Azure Portal](/azure/key-vault/general/quick-create-portal), [Azure CLI](/azure/key-vault/general/quick-create-cli), or [PowerShell](/azure/key-vault/general/quick-create-powershell)
- [Visual Studio 2022](https://visualstudio.microsoft.com) installed

## Overview of client-side encryption

For an overview of client-side encryption for Azure Storage, see [Client-Side Encryption and Azure Key Vault for Microsoft Azure Storage](../common/storage-client-side-encryption.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

Here is a brief description of how client-side encryption works:

1. The Azure Storage client SDK generates a content encryption key (CEK), which is a one-time-use symmetric key.
2. Customer data is encrypted using this CEK.
3. The CEK is then wrapped (encrypted) using the key encryption key (KEK). The KEK is identified by a key identifier and can be an asymmetric key pair or a symmetric key and can be managed locally or stored in Azure Key Vault. The Storage client itself never has access to the KEK. It just invokes the key wrapping algorithm that is provided by Key Vault. Customers can choose to use custom providers for key wrapping/unwrapping if they want.
4. The encrypted data is then uploaded to the Azure Storage service.

## Assign a role to your Azure AD user

When developing locally, make sure that the user account that is accessing the key vault has the correct permissions. You'll need [Key Vault Crypto Officer role](/azure/role-based-access-control/built-in-roles#key-vault-crypto-officer) to create a key and perform actions on keys in a key vault. You can assign Azure RBAC roles to a user using the Azure portal, Azure CLI, or Azure PowerShell. You can learn more about the available scopes for role assignments on the [scope overview](../articles/role-based-access-control/scope-overview.md) page.

In this scenario, you'll assign permissions to your user account, scoped to the key vault, to follow the [Principle of Least Privilege](../articles/active-directory/develop/secure-least-privileged-access.md). This practice gives users only the minimum permissions needed and creates more secure production environments.

The following example will assign the **Key Vault Crypto Officer** role to your user account, which provides the access you'll need to complete this tutorial.

> [!IMPORTANT]
> In most cases it will take a minute or two for the role assignment to propagate in Azure, but in rare cases it may take up to eight minutes. If you receive authentication errors when you first run your code, wait a few moments and try again.

### [Azure portal](#tab/roles-azure-portal)

1. In the Azure portal, locate your key vault using the main search bar or left navigation.

2. On the storage account overview page, select **Access control (IAM)** from the left-hand menu.

3. On the **Access control (IAM)** page, select the **Role assignments** tab.

4. Select **+ Add** from the top menu and then **Add role assignment** from the resulting drop-down menu.

    :::image type="content" source="./media/storage-blob-encrypt-keyvault/assign-role-kv.png" lightbox="./media/storage-blob-encrypt-keyvault/assign-role-kv.png" alt-text="A screenshot showing how to assign a role in Azure portal.":::

5. Use the search box to filter the results to the desired role. For this example, search for *Key Vault Crypto Officer* and select the matching result and then choose **Next**.

6. Under **Assign access to**, select **User, group, or service principal**, and then choose **+ Select members**.

7. In the dialog, search for your Azure AD username (usually your *user@domain* email address) and then choose **Select** at the bottom of the dialog.

8. Select **Review + assign** to go to the final page, and then **Review + assign** again to complete the process.

### [Azure CLI](#tab/roles-azure-cli)

To assign a role at the resource level using the Azure CLI, you first must retrieve the resource id using the `az storage account show` command. You can filter the output properties using the `--query` parameter.

```azurecli
az keyvault show --resource-group '<your-resource-group-name>' --name '<your-unique-keyvault-name>' --query id
```

Copy the output `Id` from the preceding command. You can then assign roles using the [az role](/cli/azure/role) command of the Azure CLI.

```azurecli
az role assignment create --assignee "<user@domain>" \
    --role "Key Vault Crypto Officer" \
    --scope "<your-resource-id>"
```

### [PowerShell](#tab/roles-powershell)

To assign a role at the resource level using Azure PowerShell, you first must retrieve the resource ID using the `Get-AzResource` command.

```azurepowershell
Get-AzResource -ResourceGroupName "<yourResourceGroupname>" -Name "<yourKeyVaultName>"
```

Copy the `Id` value from the preceding command output. You can then assign roles using the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command in PowerShell.

```azurepowershell
New-AzRoleAssignment -SignInName <user@domain> `
    -RoleDefinitionName "Key Vault Crypto Officer" `
    -Scope <yourKeyVaultId>
```

---

## Set up your project

1. In a console window (such as PowerShell or Bash), use the `dotnet new` command to create a new console app with the name *BlobEncryptionKeyVault*. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

   ```dotnetcli
   dotnet new console -n BlobEncryptionKeyVault
   ```

1. Switch to the newly created *BlobEncryptionKeyVault* directory.

   ```console
   cd BlobEncryptionKeyVault
   ```

1. Open the project in your desired code editor. To open the project in:
    * Visual Studio, locate and double-click the `BlobEncryptionKeyVault.csproj` file.
    * Visual Studio Code, run the following command:

    ```bash
    code .
    ```
---

To interact with Azure services in this example, install the following client libraries using `dotnet add package`.

```dotnetcli
dotnet add package Azure.Identity
dotnet add package Azure.Security.KeyVault.Keys.Cryptography
dotnet add package Azure.Storage.Blobs
```

```powershell
Install-Package Azure.Identity
Install-Package Azure.Security.KeyVault.Keys.Cryptography
Install-Package Azure.Storage.Blobs
```

Add the following `using` directives and make sure to add a reference to System.Configuration to the project.

```csharp
using Azure.Identity
using Azure.Security.KeyVault.Keys.Cryptography
using Azure.Storage.Blobs
```

## Set environment variable

This application looks for an environment variable called `KEY_VAULT_NAME` to retrieve the name of your key vault. To set the environment variable, open a console window, and follow the instructions for your operating system. Replace `<your-key-vault-name>` with your actual key vault name.

**Windows:**

You can set environment variables for Windows from the command line. However, when using this approach the values are accessible to all applications running on that operating system and may cause conflicts if you are not careful. Environment variables can be set at either user or system level:

```cmd
setx KEY_VAULT_NAME "<your-key-vault-name>"
````
After you add the environment variable in Windows, you must start a new instance of the command window. If you are using Visual Studio on Windows, you may need to relaunch Visual Studio after creating the environment variable for the change to be detected.

**Linux:**

```bash
export KEY_VAULT_NAME=<your-key-vault-name>
```

## Add a key in Azure Key Vault

In this example, we create a key and add it to the key vault using the Azure Key Vault client library. You can also create and add a key to a key vault using [Azure CLI](/azure/key-vault/keys/quick-create-cli#add-a-key-to-key-vault), [Azure portal](/azure/key-vault/keys/quick-create-portal#add-a-key-to-key-vault), or [PowerShell](/azure/key-vault/keys/quick-create-powershell#add-a-key-to-key-vault).

In the sample below, we create a [KeyClient](/dotnet/api/azure.security.keyvault.keys.keyclient?view=azure-dotnet) object for the specified vault. The `KeyClient` object is then used to create a new RSA key in the vault.

```csharp
var keyName = "TestRSAKey";
var keyVaultName = Environment.GetEnvironmentVariable("KEY_VAULT_NAME");

// URI for the key vault resource
var keyVaultUri = $"https://{keyVaultName}.vault.azure.net";

TokenCredential tokenCredential = new DefaultAzureCredential();

// Create a KeyClient object
var keyClient = new KeyClient(new Uri(keyVaultUri), tokenCredential);

// Add a key to the key vault
var key = await keyClient.CreateKeyAsync(keyName, KeyType.Rsa);
```

## Create key and key resolver instances

Next, we'll use the key we just added to the vault to create the cryptography client and key resolver instances. [CryptographyClient](/dotnet/api/azure.security.keyvault.keys.cryptography.cryptographyclient?view=azure-dotnet-preview) implements [IKeyEncryptionKey](/dotnet/api/azure.core.cryptography.ikeyencryptionkey?view=azure-dotnet&viewFallbackFrom=azure-dotnet-preview) and is used to perform cryptographic operations with keys stored in Azure Key Vault. [KeyResolver](/dotnet/api/azure.security.keyvault.keys.cryptography.keyresolver?view=azure-dotnet)  implements [IKeyEncryptionResolver](/dotnet/api/azure.core.cryptography.ikeyencryptionkeyresolver?view=azure-dotnet) and 
```csharp
// Cryptography client and key resolver instances using Azure Key Vault client library
CryptographyClient cryptoClient = keyVaultClient.GetCryptographyClient(key.Value.Name, key.Value.Properties.Version);
KeyResolver keyResolver = new KeyResolver(tokenCredential);
```

If you have an existing key in the vault that you'd like to encrypt with, you can create the key and key resolver instances by passing in the URI:
```csharp
var keyVaultKeyUri = $"https://{keyVaultName}.vault.azure.net/keys/{keyName}";
CryptographyClient cryptoClient = new CryptographyClient(new Uri(keyVaultKeyUri), tokenCredential);
```

## Configure encryption options

```csharp
// Configure the encryption options to be used for upload and download
ClientSideEncryptionOptions encryptionOptions = new ClientSideEncryptionOptions(ClientSideEncryptionVersion.V2_0)
{
    KeyEncryptionKey = cryptoClient,
    KeyResolver = keyResolver,
    // String value that the client library will use when calling IKeyEncryptionKey.WrapKey()
    KeyWrapAlgorithm = "RSA-OAEP"
};
```

## Configure client object to use client-side encryption

```csharp
// Set the encryption options on the client options.
BlobClientOptions options = new SpecializedBlobClientOptions() { ClientSideEncryption = encryptionOptions };

// Create a blob client with client-side encryption enabled.
// Client-side encryption options are passed from service clients to container clients, 
// and from container clients to blob clients.
// Attempting to construct a BlockBlobClient, PageBlobClient, or AppendBlobClient from a BlobContainerClient
// with client-side encryption options present will throw, as this functionality is only supported with BlobClient.
BlobClient blob = new BlobServiceClient(blobUri, tokenCredential, options).GetBlobContainerClient("my-container").GetBlobClient("myBlob");
```

> [!NOTE]
> Key Vault Object Models
>
> It is important to understand that there are actually two Key Vault object models to be aware of: one is based on the REST API (KeyVault namespace) and the other is an extension for client-side encryption.
>
> The Key Vault Client interacts with the REST API and understands JSON Web Keys and secrets for the two kinds of things that are contained in Key Vault.
>
> The Key Vault Extensions are classes that seem specifically created for client-side encryption in Azure Storage. They contain an interface for keys (IKey) and classes based on the concept of a Key Resolver. There are two implementations of IKey that you need to know: RSAKey and SymmetricKey. Now they happen to coincide with the things that are contained in a Key Vault, but at this point they are independent classes (so the Key and Secret retrieved by the Key Vault Client do not implement IKey).
>
>

## Encrypt blob and upload

Add the following code to encrypt a blob and upload it to your Azure storage account.

```csharp
// Upload the encrypted contents to the blob
Stream blobContent = BinaryData.FromString("Ready for encryption, Captain.").ToStream();
await blob.UploadAsync(blobContent);

// Download and decrypt the encrypted contents from the blob
 MemoryStream outputStream = new MemoryStream();
blob.DownloadTo(outputStream);
```

## Decrypt blob and download

Decryption is really when using the Resolver classes make sense. The ID of the key used for encryption is associated with the blob in its metadata, so there is no reason for you to retrieve the key and remember the association between key and blob. You just have to make sure that the key remains in Key Vault.

The private key of an RSA Key remains in Key Vault, so for decryption to occur, the Encrypted Key from the blob metadata that contains the CEK is sent to Key Vault for decryption.

Add the following to decrypt the blob that you just uploaded.

# [.NET v12 SDK](#tab/dotnet)

We are currently working to create code snippets reflecting version 12.x of the Azure Storage client libraries. For more information, see [Announcing the Azure Storage v12 Client Libraries](https://techcommunity.microsoft.com/t5/azure-storage/announcing-the-azure-storage-v12-client-libraries/ba-p/1482394).

# [.NET v11 SDK](#tab/dotnet11)

```csharp
// In this case, we will not pass a key and only pass the resolver because
// this policy will only be used for downloading / decrypting.
BlobEncryptionPolicy policy = new BlobEncryptionPolicy(null, cloudResolver);
BlobRequestOptions options = new BlobRequestOptions() { EncryptionPolicy = policy };

using (var np = File.Open(@"C:\data\MyFileDecrypted.txt", FileMode.Create))
    blob.DownloadToStream(np, null, options, null);
```

---

> [!NOTE]
> There are a couple of other kinds of resolvers to make key management easier, including: AggregateKeyResolver and CachingKeyResolver.

## Use Key Vault secrets

The way to use a secret with client-side encryption is via the SymmetricKey class because a secret is essentially a symmetric key. But, as noted above, a secret in Key Vault does not map exactly to a SymmetricKey. There are a few things to understand:

- The key in a SymmetricKey has to be a fixed length: 128, 192, 256, 384, or 512 bits.
- The key in a SymmetricKey should be Base64 encoded.
- A Key Vault secret that will be used as a SymmetricKey needs to have a Content Type of "application/octet-stream" in Key Vault.

Here is an example in PowerShell of creating a secret in Key Vault that can be used as a SymmetricKey.
Please note that the hard coded value, $key, is for demonstration purpose only. In your own code you'll want to generate this key.

```powershell
// Here we are making a 128-bit key so we have 16 characters.
//     The characters are in the ASCII range of UTF8 so they are
//    each 1 byte. 16 x 8 = 128.
$key = "qwertyuiopasdfgh"
$b = [System.Text.Encoding]::UTF8.GetBytes($key)
$enc = [System.Convert]::ToBase64String($b)
$secretvalue = ConvertTo-SecureString $enc -AsPlainText -Force

// Substitute the VaultName and Name in this command.
$secret = Set-AzureKeyVaultSecret -VaultName 'ContosoKeyVault' -Name 'TestSecret2' -SecretValue $secretvalue -ContentType "application/octet-stream"
```

In your console application, you can use the same call as before to retrieve this secret as a SymmetricKey.

# [.NET v12 SDK](#tab/dotnet)

We are currently working to create code snippets reflecting version 12.x of the Azure Storage client libraries. For more information, see [Announcing the Azure Storage v12 Client Libraries](https://techcommunity.microsoft.com/t5/azure-storage/announcing-the-azure-storage-v12-client-libraries/ba-p/1482394).

# [.NET v11 SDK](#tab/dotnet11)

```csharp
SymmetricKey sec = (SymmetricKey) cloudResolver.ResolveKeyAsync(
    "https://contosokeyvault.vault.azure.net/secrets/TestSecret2/",
    CancellationToken.None).GetAwaiter().GetResult();
```

---

## Next steps

For more information about using Microsoft Azure Storage with C#, see [Microsoft Azure Storage Client Library for .NET](/previous-versions/azure/dn261237(v=azure.100)).

For more information about the Blob REST API, see [Blob Service REST API](/rest/api/storageservices/Blob-Service-REST-API).

For the latest information on Microsoft Azure Storage, go to the [Microsoft Azure Storage Team Blog](/archive/blogs/windowsazurestorage/).
