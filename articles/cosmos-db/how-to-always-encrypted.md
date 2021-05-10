---
title: Use client-side encryption with Always Encrypted for Azure Cosmos DB
description: Learn how to use client-side encryption with Always Encrypted for Azure Cosmos DB
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: how-to
ms.date: 05/10/2021
ms.author: thweiss
---

# Use client-side encryption with Always Encrypted for Azure Cosmos DB (Preview)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

> [!IMPORTANT]
> Always Encrypted for Azure Cosmos DB is currently in preview. This preview version is provided without a Service Level Agreement and is not recommended for production workloads. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> To start using the preview of Always Encrypted for Azure Cosmos DB, you can:
> - Use the [Azure Cosmos DB local emulator](local-emulator.md), version 2.11.10.0 or higher.
> - Request the preview to be enabled on your Azure Cosmos DB account by filling [this form](https://ncv.microsoft.com/poTcF52I6N).

## Use-cases

Always Encrypted brings client-side encryption capabilities to Azure Cosmos DB. Encrypting your data client-side can be required in the following scenarios:

- **Protecting sensitive data that has specific confidentiality characteristics**: Always Encrypted allows clients to encrypt sensitive data inside their applications and never reveal the plain text data or encryption keys to the Azure Cosmos DB service.
- **Implementing per-property access control**: Because the encryption is controlled with keys that you own and manage from Azure Key Vault, you can leverage access policies to control which sensitive properties each client has access to.

## Concepts

Always Encrypted for Azure Cosmos DB introduces new concepts involved in the configuration of your client-side encryption.

### Encryption keys

#### Data encryption keys

When using Always Encrypted, data is encrypted with data encryption keys (DEK) that have to be created beforehand. This operation is done client-side, using the Azure Cosmos DB SDK. You can create one DEK per property to encrypt or use the same DEK to encrypt multiple properties. These DEKs are stored in the Azure Cosmos DB service and are defined at the database level, so a DEK can be shared across multiple containers.

#### Customer-managed keys

Before DEKs get stored in Azure Cosmos DB, they get wrapped by a customer-managed key (CMK). By controlling the wrapping and unwrapping of DEKs, CMKs effectively control the access to the data that's encrypted with their corresponding DEKs. CMK storage is designed as an extensible / plug-in model, with a default implementation that expects them to be stored in Azure Key Vault.

:::image type="content" source="./media/how-to-always-encrypted/encryption-keys.png" alt-text="Encryption keys" border="true":::

### Encryption policy

Similar to an [indexing policy](index-policy.md), an encryption policy is a container-level specification describing how JSON properties should be encrypted when written to the container. This policy needs to be provided when the container is created and is immutable. Updating the encryption policy is a capability that is not currently supported.

For each property to encrypt, the encryption policy defines:

-	The path of the property in the form of `/property`.<br>**Note**: Only top-level paths are currently supported, nested paths (`/path/to/property`) are not.
-	The ID of the [DEK](#data-encryption-keys) to use when encrypting and decrypting the property.
-	An encryption type: either randomized or deterministic.
-	The encryption algorithm to use when encrypting the property (which can override the algorithm defined when creating the key if these algorithms are compatible).

> [!NOTE]
> The following properties can't be encrypted:
> - `id`
> - the container's partition key

#### Randomized vs. deterministic encryption

The Azure Cosmos DB service never sees the plain text version of properties encrypted with Always Encrypted but still supports some querying capabilities over encrypted data, depending on the encryption type used for the property. Always Encrypted supports two types of encryption: randomized and deterministic.

- **Deterministic encryption** always generates the same encrypted value for any given plain text value. Using deterministic encryption allows queries to perform equality filters on encrypted properties. However, it may also allow unauthorized users to guess information about encrypted values by examining patterns in the encrypted property, especially if there's a small set of possible encrypted values, such as True/False, or North/South/East/West region.
- **Randomized encryption** uses a method that encrypts data in a less predictable manner. Randomized encryption is more secure, but prevents queries from filtering on encrypted properties.

## Azure Key Vault setup

The first step to get started with Always Encrypted is to create your CMKs in Azure Key Vault.

1. Create a new Azure Key Vault instance or browse to an existing one.
1. Create a new key in the **Keys** section.
1. Once the key is created, browse to its current version, and copy its full key identifier:<br>`https://<my-key-vault>.vault.azure.net/keys/<key>/<version>`.<br>**Note**: If you omit the key version at the end of the key identifier, the latest version of the key will be used.

Next, we need to configure how the Azure Cosmos DB SDK will access your Azure Key Vault instance. This authentication is done through an Azure Active Directory (AD) identity. Most likely, you'll want to use the identity of an Azure AD application or a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) as the proxy between your client code and your Azure Key Vault instance, although any kind of identity could be used.

To use an Azure AD application as the proxy:

1. Create a new application and add a client secret as described in [this quickstart](../active-directory/develop/quickstart-register-app.md).
1. Go back to your Azure Key Vault instance, browse to the **Access policies** section and add a new policy:
   1. In **Key permissions**, select **Get**, **Unwrap Key**, **Wrap Key** and **Sign**.
   1. In **Select principal**, search for the AAD application you've just created.

## Initialize the SDK

> [!NOTE]
> Always Encrypted for Azure Cosmos DB is currently supported:
> - In **.NET** with the [Microsoft.Azure.Cosmos.Encryption package version 1.0.0-previewV12](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Encryption/1.0.0-previewV12) or higher.
> -	In **Java** with the [azure.cosmos.encryption package version 1.0.0-beta.2](https://mvnrepository.com/artifact/com.azure/azure-cosmos-encryption/1.0.0-beta.2) or higher.

To use Always Encrypted, an instance of an `EncryptionKeyStoreProvider` must be attached to your Azure Cosmos DB SDK instance. This object is used to interact with the key store hosting your CMKs. The default key store provider for Azure Key Vault is named `AzureKeyVaultKeyStoreProvider`.

The snippets below show how to use the identity of an Azure AD application with a client secret. You can find examples of creating different kinds of `TokenCredential` classes:

- [In .NET](/dotnet/api/overview/azure/identity-readme#credential-classes)
- [In Java](/java/api/overview/azure/identity-readme#credential-classes)

### In .NET

> [!NOTE]
> In .NET, you will need the additional [Microsoft.Data.Encryption.AzureKeyVaultProvider package](https://www.nuget.org/packages/Microsoft.Data.Encryption.AzureKeyVaultProvider) to access the `AzureKeyVaultKeyStoreProvider` class.

```csharp
var tokenCredential = new ClientSecretCredential(
    "<aad-app-tenant-id>", "<aad-app-client-id>", "<aad-app-secret>");
var keyStoreProvider = new AzureKeyVaultKeyStoreProvider(tokenCredential);
var client = new CosmosClient("<connection-string>")
    .WithEncryption(keyStoreProvider);
```

### In Java

```java
TokenCredential tokenCredential = new ClientSecretCredentialBuilder()
    .authorityHost("https://login.microsoftonline.com")
    .tenantId("<aad-app-tenant-id>")
    .clientId("<aad-app-client-id>")
    .clientSecret("<aad-app-secret>")
    .build();
AzureKeyVaultKeyStoreProvider encryptionKeyStoreProvider =
    new AzureKeyVaultKeyStoreProvider(tokenCredential);
CosmosAsyncClient client = new CosmosClientBuilder()
    .endpoint("<endpoint>")
    .key("<primary-key>")
    .buildAsyncClient();
EncryptionAsyncCosmosClient encryptionClient =
    EncryptionAsyncCosmosClient.buildEncryptionAsyncClient(client, encryptionKeyStoreProvider);
```

## Create a DEK

Before data can be encrypted in a container, a [DEK](#data-encryption-keys) must be created in the parent database. This is done by calling the `CreateClientEncryptionKeyAsync` method and passing:

-	A string identifier that will uniquely identify the key in the database.
-	The encryption algorithm intended to be used with the key. Only one algorithm is currently supported.
-	The key identifier of the [CMK](#customer-managed-keys) stored in Azure Key Vault. This is passed in a generic `EncryptionKeyWrapMetadata` object where the `name` can be any friendly name you want, and the `value` must be the key identifier.

### In .NET

```csharp
var database = client.GetDatabase("my-database");
await database.CreateClientEncryptionKeyAsync(
    "my-key",
    DataEncryptionKeyAlgorithm.AEAD_AES_256_CBC_HMAC_SHA256,
    new EncryptionKeyWrapMetadata(
        "akvKey", "https://<my-key-vault>.vault.azure.net/keys/<key>/<version>"));
```

### In Java

```java
EncryptionCosmosAsyncDatabase database =
    client.getEncryptedCosmosAsyncDatabase("my-database");
database.createClientEncryptionKey(
    "my-key",
    CosmosEncryptionAlgorithm.AEAES_256_CBC_HMAC_SHA_256,
    new EncryptionKeyWrapMetadata(
        "akvKey", "https://<my-key-vault>.vault.azure.net/keys/<key>/<version>"));
```

## Create a new container with an encryption policy

The container-level encryption policy must be specified when the container is created.

### In .NET

```csharp
var path1 = new ClientEncryptionIncludedPath
{
    Path = "/property1",
    ClientEncryptionKeyId = "my-key",
    EncryptionType = EncryptionType.Deterministic.ToString(),
    EncryptionAlgorithm = DataEncryptionKeyAlgorithm.AEAD_AES_256_CBC_HMAC_SHA256.ToString()
};
var path2 = new ClientEncryptionIncludedPath
{
    Path = "/property2",
    ClientEncryptionKeyId = "my-key",
    EncryptionType = EncryptionType.Randomized.ToString(),
    EncryptionAlgorithm = DataEncryptionKeyAlgorithm.AEAD_AES_256_CBC_HMAC_SHA256.ToString()
};
await database.DefineContainer("my-container", "/partition-key")
    .WithClientEncryptionPolicy()
    .WithIncludedPath(path1)
    .WithIncludedPath(path2)
    .Attach()
    .CreateAsync();
```

### In Java

```java
ClientEncryptionIncludedPath path1 = new ClientEncryptionIncludedPath();
path1.clientEncryptionKeyId = "my-key":
path1.path = "/property1";
path1.encryptionType = CosmosEncryptionType.DETERMINISTIC;
path1.encryptionAlgorithm = CosmosEncryptionAlgorithm.AEAES_256_CBC_HMAC_SHA_256;

ClientEncryptionIncludedPath path2 = new ClientEncryptionIncludedPath();
path2.clientEncryptionKeyId = "my-key":
path2.path = "/property2";
path2.encryptionType = CosmosEncryptionType.RANDOMIZED;
path2.encryptionAlgorithm = CosmosEncryptionAlgorithm.AEAES_256_CBC_HMAC_SHA_256;

List<ClientEncryptionIncludedPath> paths = new ArrayList<>();
paths.add(path1);
paths.add(path2);

CosmosContainerProperties containerProperties =
    new CosmosContainerProperties("my-container", "/id");
containerProperties.setClientEncryptionPolicy(new ClientEncryptionPolicy(paths));
database.createEncryptionContainerAsync(containerProperties);
```

## Read and write encrypted data

### How data gets encrypted

Whenever a document is written to Azure Cosmos DB, the SDK looks up the encryption policy to figure out which properties need to be encrypted, and how. The result of the encryption is a base 64 string.

**Encryption of complex types**:

-	When the property to encrypt is a JSON array, every entry of the array gets encrypted individually.
-	When the property to encrypt is a JSON object, only the leaf values of the object get encrypted, with the intermediate sub-property names remaining in plain text form.

### Reading encrypted items

No explicit action is required to decrypt encrypted properties when issuing point-reads (fetching a single item by its id and partition key), queries or reading the change feed. This is because the SDK looks up the encryption policy to figure out which properties need to be decrypted, and also because the result of the encryption embeds the original JSON type of the value.

Note that the resolution of encrypted properties and their subsequent decryption are based only on the results returned from your requests. For example, if `property1` is encrypted but is projected into `property2` (`SELECT property1 AS property2 FROM c`), it won't get identified as an encrypted property when received by the SDK. 

### Filtering queries on encrypted properties

When writing queries that filter on encrypted properties, the `AddParameterAsync` method must be used to pass the value of the query parameter. This method takes the following arguments:

-	The name of the query parameter.
-	The value to use in the query.
-	The path of the encrypted property (as defined in the encryption policy).

> [!IMPORTANT]
> Encrypted properties can only be used in equality filters (`WHERE c.property = @Value`). Any other usage will return unpredictable and wrong query results. This constraint will be better enforced in next versions of the SDK.

#### In .NET

```csharp
var queryDefinition = container.CreateQueryDefinition(
    "SELECT * FROM c where c.property1 = @Property1");
await queryDefinition.AddParameterAsync(
    "@Property1",
    1234,
    "/property1");
```

#### In Java

```java
EncryptionSqlQuerySpec encryptionSqlQuerySpec = new EncryptionSqlQuerySpec(
    new SqlQuerySpec("SELECT * FROM c where c.property1 = @Property1"), container);
encryptionSqlQuerySpec.addEncryptionParameterAsync(
    new SqlParameter("@Property1", 1234), "/property1")
```

### Reading documents when only a subset of properties can be decrypted

In situations where the client does not have access to all the CMK used to encrypt properties, only a subset of properties can be decrypted when data is read back. For example, if `property1` was encrypted with key1 and `property2` was encrypted with key2, a client application that only has access to key1 can still read data, but not `property2`. In such a case, you must read your data through SQL queries and project away the properties that the client can't decrypt: `SELECT c.property1, c.property3 FROM c`.

## CMK rotation

You may want to "rotate" your CMK (that is, use a new CMK instead of the current one) if the current CMK is suspected to have been compromised. It is also a common security practice to rotate the CMK on a regular basis. To perform this rotation, you only have to provide the key identifier of the new CMK that should be used to wrap a specific DEK. Note that this operation doesn't affect the encryption of your data, but the protection of the DEK.

### In .NET

```csharp
await database.RewrapClientEncryptionKeyAsync(
    "my-key",
    new EncryptionKeyWrapMetadata(
        "akvKey",
        " https://<my-key-vault>.vault.azure.net/keys/<new-key>/<version>"));
```

### In Java

```java
database. rewrapClientEncryptionKey(
    "my-key",
    new EncryptionKeyWrapMetadata(
        "akvKey", " https://<my-key-vault>.vault.azure.net/keys/<new-key>/<version>"));
```

## Next steps

- Get an overview of [secure access to data in Cosmos DB](secure-access-to-data.md).
- Learn more about [customer-managed keys](how-to-setup-cmk.md).