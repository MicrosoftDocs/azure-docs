---
title: Use client-side encryption with Always Encrypted for Azure Cosmos DB
description: Learn how to use client-side encryption with Always Encrypted for Azure Cosmos DB
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 04/04/2022
ms.author: sidandrews
author: seesharprun
---

# Use client-side encryption with Always Encrypted for Azure Cosmos DB
[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

> [!IMPORTANT]
> A breaking change has been introduced with the 1.0 release of our encryption packages. If you created data encryption keys and encryption-enabled containers with prior versions, you will need to re-create your databases and containers after migrating your client code to 1.0 packages.

Always Encrypted is a feature designed to protect sensitive data, such as credit card numbers or national/regional identification numbers (for example, U.S. social security numbers), stored in Azure Cosmos DB. Always Encrypted allows clients to encrypt sensitive data inside client applications and never reveal the encryption keys to the database.

Always Encrypted brings client-side encryption capabilities to Azure Cosmos DB. Encrypting your data client-side can be required in the following scenarios:

- **Protecting sensitive data that has specific confidentiality characteristics**: Always Encrypted allows clients to encrypt sensitive data inside their applications and never reveal the plain text data or encryption keys to the Azure Cosmos DB service.
- **Implementing per-property access control**: Because the encryption is controlled with keys that you own and manage from Azure Key Vault, you can apply access policies to control which sensitive properties each client has access to.

## Concepts

Always Encrypted for Azure Cosmos DB introduces some new concepts that are involved in the configuration of your client-side encryption.

### Encryption keys

#### Data encryption keys

When using Always Encrypted, data is encrypted with data encryption keys (DEK) that should be created ahead. These DEKs are stored in the Azure Cosmos DB service and are defined at the database level, so a DEK can be shared across multiple containers. The creation of the DEKs is done client-side by using the Azure Cosmos DB SDK.

You can:

- Create one DEK per property to encrypt, or
- Use the same DEK to encrypt multiple properties.

#### Customer-managed keys

Before DEKs get stored in Azure Cosmos DB, they are wrapped by a customer-managed key (CMK). By controlling the wrapping and unwrapping of DEKs, CMKs effectively control the access to the data that's encrypted with their corresponding DEKs. CMK storage is designed as an extensible, with a default implementation that expects them to be stored in Azure Key Vault.

:::image type="content" source="./media/how-to-always-encrypted/encryption-keys.png" alt-text="Encryption keys" border="true":::

### Encryption policy

Similar to an [indexing policy](index-policy.md), an encryption policy is a container-level specification describing how JSON properties should be encrypted. This policy must be provided when the container is created and it is immutable. In the current release, you can't update the encryption policy.

For each property that you want to encrypt, the encryption policy defines:

- The path of the property in the form of `/property`. Only top-level paths are currently supported, nested paths such as `/path/to/property` are not supported.
- The ID of the [DEK](#data-encryption-keys) to use when encrypting and decrypting the property.
- An encryption type. It can be either randomized or deterministic.
- The encryption algorithm to use when encrypting the property. The specified algorithm can override the algorithm defined when creating the key if they are compatible.

#### Randomized vs. deterministic encryption

The Azure Cosmos DB service never sees the plain text of properties encrypted with Always Encrypted. However, it still supports some querying capabilities over the encrypted data, depending on the encryption type used for a property. Always Encrypted supports the following two types of encryptions:

- **Deterministic encryption:** It always generates the same encrypted value for any given plain text value and encryption configuration. Using deterministic encryption allows queries to perform equality filters on encrypted properties. However, it may allow attackers to guess information about encrypted values by examining patterns in the encrypted property. This is especially true if there's a small set of possible encrypted values, such as True/False, or North/South/East/West region.

- **Randomized encryption:** It uses a method that encrypts data in a less predictable manner. Randomized encryption is more secure, but prevents queries from filtering on encrypted properties.

See [Generating the initialization vector (IV)](/sql/relational-databases/security/encryption/always-encrypted-cryptography#step-1-generating-the-initialization-vector-iv) to learn more about deterministic and randomized encryption in Always Encrypted.

## Setup Azure Key Vault

The first step to get started with Always Encrypted is to create your CMKs in Azure Key Vault:

1. Create a new Azure Key Vault instance or browse to an existing one.
1. Create a new key in the **Keys** section.
1. Once the key is created, browse to its current version, and copy its full key identifier:<br>`https://<my-key-vault>.vault.azure.net/keys/<key>/<version>`. If you omit the key version at the end of the key identifier, the latest version of the key is used.

Next, you need to configure how the Azure Cosmos DB SDK will access your Azure Key Vault instance. This authentication is done through a Microsoft Entra identity. Most likely, you'll use the identity of a Microsoft Entra application or a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) as the proxy between your client code and your Azure Key Vault instance, although any kind of identity could be used. Use the following steps to use your Microsoft Entra identity as the proxy:

1. From your Azure Key Vault instance, browse to the **Access policies** section, and add a new policy:

   1. In **Key permissions**, select **Get**, **List**, **Unwrap Key**, **Wrap Key**, **Verify** and **Sign**.
   1. In **Select principal**, search for your Microsoft Entra identity.

### Protect your CMK from accidental deletion

To make sure you don't lose access to your encrypted data after accidental deletion of your CMK, it is recommended to set two properties on your Azure Key Vault instance: **Soft Delete** and **Purge Protection**.

If you create a new Azure Key Vault instance, enable these properties during creation:

:::image type="content" source="./media/how-to-always-encrypted/key-vault-properties.png" alt-text="Screenshot of the soft delete and purge protection properties for a new Azure Key Vault instance.":::

If you're using an existing Azure Key Vault instance, you can verify that these properties are enabled by looking at the **Properties** section on the Azure portal. If any of these properties isn't enabled, see the "Enabling soft-delete" and "Enabling Purge Protection" sections in one of the following articles:

- [How to use soft-delete with PowerShell](../key-vault/general/key-vault-recovery.md)
- [How to use soft-delete with Azure CLI](../key-vault/general/key-vault-recovery.md)

## Initialize the SDK

> [!NOTE]
> Always Encrypted for Azure Cosmos DB is currently supported:
> - In **.NET** with the [Microsoft.Azure.Cosmos.Encryption package](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Encryption).
> -	In **Java** with the [azure.cosmos.encryption package](https://mvnrepository.com/artifact/com.azure/azure-cosmos-encryption).

# [.NET](#tab/dotnet)

To use Always Encrypted, an instance of a `KeyResolver` must be attached to your Azure Cosmos DB SDK instance. This class, defined in the `Azure.Security.KeyVault.Keys.Cryptography` namespace, is used to interact with the key store hosting your CMKs.

The following snippets use the `DefaultAzureCredential` class to retrieve the Microsoft Entra identity to use when accessing your Azure Key Vault instance. You can find examples of creating different kinds of `TokenCredential` classes [here](/dotnet/api/overview/azure/identity-readme#credential-classes).

> [!NOTE]
> You will need the additional [Azure.Identity package](https://www.nuget.org/packages/Azure.Identity/) to access the `TokenCredential` classes.

```csharp
var tokenCredential = new DefaultAzureCredential();
var keyResolver = new KeyResolver(tokenCredential);
var client = new CosmosClient("<connection-string>")
    .WithEncryption(keyResolver, KeyEncryptionKeyResolverName.AzureKeyVault);
```

# [Java](#tab/java)

To use Always Encrypted, an instance of a `KeyEncryptionKeyClientBuilder` must be attached to your Azure Cosmos DB SDK instance. This class, defined in the `com.azure.security.keyvault.keys.cryptography` namespace, is used to interact with the key store hosting your CMKs.

The following snippets use the `DefaultAzureCredential` class to retrieve the Microsoft Entra identity to use when accessing your Azure Key Vault instance. You can find examples of creating different kinds of `TokenCredential` classes [here](/java/api/overview/azure/identity-readme#credential-classes).

```java
TokenCredential tokenCredential = new DefaultAzureCredentialBuilder()
    .build();
KeyEncryptionKeyClientBuilder keyEncryptionKeyClientBuilder =
    new KeyEncryptionKeyClientBuilder().credential(tokenCredentials);
CosmosAsyncClient client = new CosmosClientBuilder()
    .endpoint("<endpoint>")
    .key("<primary-key>")
    .buildAsyncClient();
CosmosEncryptionAsyncClient cosmosEncryptionAsyncClient =
    new CosmosEncryptionClientBuilder().cosmosAsyncClient(client).keyEncryptionKeyResolver(keyEncryptionKeyClientBuilder)
        .keyEncryptionKeyResolverName(CosmosEncryptionClientBuilder.KEY_RESOLVER_NAME_AZURE_KEY_VAULT).buildAsyncClient();
```
---

## Create a data encryption key

Before data can be encrypted in a container, a [data encryption key](#data-encryption-keys) must be created in the parent database.

# [.NET](#tab/dotnet)

Creating a new data encryption key is done by calling the `CreateClientEncryptionKeyAsync` method and passing:

- A string identifier that will uniquely identify the key in the database.
- The encryption algorithm intended to be used with the key. Only one algorithm is currently supported.
- The key identifier of the [CMK](#customer-managed-keys) stored in Azure Key Vault. This parameter is passed in a generic `EncryptionKeyWrapMetadata` object where:
  - The `type` defines the type of key resolver (for example, Azure Key Vault).
  - The `name` can be any friendly name you want.
  - The `value` must be the key identifier.
  - The `algorithm` defines which algorithm shall be used to wrap the key encryption key with the customer-managed key.

```csharp
var database = client.GetDatabase("my-database");
await database.CreateClientEncryptionKeyAsync(
    "my-key",
    DataEncryptionAlgorithm.AeadAes256CbcHmacSha256,
    new EncryptionKeyWrapMetadata(
        KeyEncryptionKeyResolverName.AzureKeyVault,
        "akvKey",
        "https://<my-key-vault>.vault.azure.net/keys/<key>/<version>",
        EncryptionAlgorithm.RsaOaep.ToString()));
```

# [Java](#tab/java)

Creating a new data encryption key is done by calling the `createClientEncryptionKey` method and passing:

- A string identifier that will uniquely identify the key in the database.
- The encryption algorithm intended to be used with the key. Only one algorithm is currently supported.
- The key identifier of the [CMK](#customer-managed-keys) stored in Azure Key Vault. This parameter is passed in a generic `EncryptionKeyWrapMetadata` object where:
  - The `type` defines the type of key resolver (for example, Azure Key Vault).
  - The `name` can be any friendly name you want.
  - The `value` must be the key identifier.
  - The `algorithm` defines which algorithm shall be used to wrap the key encryption key with the customer-managed key.

```java
CosmosEncryptionAsyncDatabase database =
    cosmosEncryptionAsyncClient.getCosmosEncryptionAsyncDatabase("my-database");
EncryptionKeyWrapMetadata metadata = new EncryptionKeyWrapMetadata(
    cosmosEncryptionAsyncClient.getKeyEncryptionKeyResolverName(), 
    "akvKey", 
    "https://<my-key-vault>.vault.azure.net/keys/<key>/<version>",
    EncryptionAlgorithm.RSA_OAEP.toString());
database.createClientEncryptionKey(
    "my-key",
    CosmosEncryptionAlgorithm.AEAD_AES_256_CBC_HMAC_SHA256.getName(),
    metadata);
```
---

## Create a container with encryption policy

Specify the container-level encryption policy when creating the container.

# [.NET](#tab/dotnet)

```csharp
var path1 = new ClientEncryptionIncludedPath
{
    Path = "/property1",
    ClientEncryptionKeyId = "my-key",
    EncryptionType = EncryptionType.Deterministic.ToString(),
    EncryptionAlgorithm = DataEncryptionAlgorithm.AeadAes256CbcHmacSha256
};
var path2 = new ClientEncryptionIncludedPath
{
    Path = "/property2",
    ClientEncryptionKeyId = "my-key",
    EncryptionType = EncryptionType.Randomized.ToString(),
    EncryptionAlgorithm = DataEncryptionAlgorithm.AeadAes256CbcHmacSha256
};
await database.DefineContainer("my-container", "/partition-key")
    .WithClientEncryptionPolicy()
    .WithIncludedPath(path1)
    .WithIncludedPath(path2)
    .Attach()
    .CreateAsync();
```

# [Java](#tab/java)

```java
ClientEncryptionIncludedPath path1 = new ClientEncryptionIncludedPath();
path1.setClientEncryptionKeyId("my-key"):
path1.setPath("/property1");
path1.setEncryptionType(CosmosEncryptionType.DETERMINISTIC.getName());
path1.setEncryptionAlgorithm(CosmosEncryptionAlgorithm.AEAES_256_CBC_HMAC_SHA_256.getName());

ClientEncryptionIncludedPath path2 = new ClientEncryptionIncludedPath();
path2.setClientEncryptionKeyId("my-key"):
path2.setPath("/property2");
path2.setEncryptionType(CosmosEncryptionType.RANDOMIZED.getName());
path2.setEncryptionAlgorithm(CosmosEncryptionAlgorithm.AEAES_256_CBC_HMAC_SHA_256.getName());

List<ClientEncryptionIncludedPath> paths = new ArrayList<>();
paths.add(path1);
paths.add(path2);

CosmosContainerProperties containerProperties =
    new CosmosContainerProperties("my-container", "/id");
containerProperties.setClientEncryptionPolicy(new ClientEncryptionPolicy(paths));
database.createEncryptionContainerAsync(containerProperties);
```
---

## Read and write encrypted data

### How data gets encrypted

Whenever a document is written to Azure Cosmos DB, the SDK looks up the encryption policy to figure out which properties need to be encrypted, and how. The result of the encryption is a base 64 string.

**Encryption of complex types**:

- When the property to encrypt is a JSON array, every entry of the array is encrypted.

- When the property to encrypt is a JSON object, only the leaf values of the object get encrypted. The intermediate sub-property names remain in plain text form.

### Read encrypted items

No explicit action is required to decrypt encrypted properties when issuing point-reads (fetching a single item by its ID and partition key), queries, or reading the change feed. This is because:

- The SDK looks up the encryption policy to figure out which properties need to be decrypted.
- The result of the encryption embeds the original JSON type of the value.

Note that the resolution of encrypted properties and their subsequent decryption are based only on the results returned from your requests. For example, if `property1` is encrypted but is projected into `property2` (`SELECT property1 AS property2 FROM c`), it won't get identified as an encrypted property when received by the SDK.

### Filter queries on encrypted properties

When writing queries that filter on encrypted properties, a specific method must be used to pass the value of the query parameter. This method takes the following arguments:

- The name of the query parameter.
- The value to use in the query.
- The path of the encrypted property (as defined in the encryption policy).

> [!IMPORTANT]
> Encrypted properties can only be used in equality filters (`WHERE c.property = @Value`). Any other usage will return unpredictable and wrong query results. This constraint will be better enforced in next versions of the SDK.

# [.NET](#tab/dotnet)

```csharp
var queryDefinition = container.CreateQueryDefinition(
    "SELECT * FROM c where c.property1 = @Property1");
await queryDefinition.AddParameterAsync(
    "@Property1",
    1234,
    "/property1");
```

# [Java](#tab/java)

```java
SqlQuerySpecWithEncryption sqlQuerySpecWithEncryption = new SqlQuerySpecWithEncryption(
    new SqlQuerySpec("SELECT * FROM c where c.property1 = @Property1"));
sqlQuerySpecWithEncryption.addEncryptionParameter(
    "/property1", new SqlParameter("@Property1", 1234))
```
---

### Reading documents when only a subset of properties can be decrypted

In situations where the client does not have access to all the CMK used to encrypt properties, only a subset of properties can be decrypted when data is read back. For example, if `property1` was encrypted with key1 and `property2` was encrypted with key2, a client application that only has access to key1 can still read data, but not `property2`. In such a case, you must read your data through SQL queries and project away the properties that the client can't decrypt: `SELECT c.property1, c.property3 FROM c`.

## CMK rotation

You may want to "rotate" your CMK (that is, use a new CMK instead of the current one) if you suspect that the current CMK has been compromised. It is also a common security practice to rotate the CMK regularly. To perform this rotation, you only have to provide the key identifier of the new CMK that should be used to wrap a specific DEK. Note that this operation doesn't affect the encryption of your data, but the protection of the DEK. Access to the previous CMK should not be revoked until the rotation is completed.

# [.NET](#tab/dotnet)

```csharp
await database.RewrapClientEncryptionKeyAsync(
    "my-key",
    new EncryptionKeyWrapMetadata(
        KeyEncryptionKeyResolverName.AzureKeyVault,
        "akvKey",
        "https://<my-key-vault>.vault.azure.net/keys/<new-key>/<version>",
        EncryptionAlgorithm.RsaOaep.ToString()));
```

# [Java](#tab/java)

```java
EncryptionKeyWrapMetadata metadata = new EncryptionKeyWrapMetadata(
    cosmosEncryptionAsyncClient.getKeyEncryptionKeyResolverName(), 
    "akvKey", 
    "https://<my-key-vault>.vault.azure.net/keys/<new-key>/<version>",
    EncryptionAlgorithm.RSA_OAEP.toString());
database.rewrapClientEncryptionKey(
    "my-key",
    metadata);
```
---

## DEK rotation

Performing a rotation of a data encryption key isn't offered as a turnkey capability. This is because updating a DEK requires a scan of all containers where this key is used and a re-encryption of all properties encrypted with this key. This operation can only happen client-side as the Azure Cosmos DB service does not store or ever accesses the plain text value of the DEK.

In practice, a DEK rotation can be done by performing a data migration from the impacted containers to new ones. The new containers can be created the exact same way as the original ones. To help you with such a data migration, you can find [a standalone migration tool on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/ReEncryption).

## Adding additional encrypted properties

Adding additional encrypted properties to an existing encryption policy isn't supported for the same reasons explained in the section just above. This operation requires a full scan of the container to ensure that all instances of the properties are properly encrypted, and this is an operation that can only happen client-side. Just like a DEK rotation, adding additional encrypted properties can be done by performing a data migration to a new container with an appropriate encryption policy.

If you have flexibility in the way new encrypted properties can be added from a schema standpoint, you can also leverage the schema-agnostic nature of Azure Cosmos DB. If you use a property defined in your encryption policy as a "property bag", you can add more properties below with no constraint. For example, let's imagine that `property1` is defined in your encryption policy and you initially write `property1.property2` in your documents. If, at a later stage, you need to add `property3` as an encrypted property, you can start writing `property1.property3` in your documents and the new property will automatically be encrypted as well. This approach doesn't require any data migration.

## Next steps

- Get an overview of [secure access to data in Azure Cosmos DB](secure-access-to-data.md).
- Learn more about [customer-managed keys for encryption-at-rest](how-to-setup-cmk.md)
