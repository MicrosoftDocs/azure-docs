<properties
	pageTitle="Client-Side Encryption with Python for Microsoft Azure Storage | Microsoft Azure"
	description="The Azure Storage Client Library for Python supports client-side encryption for maximum security for your Azure Storage applications."
	services="storage"
	documentationCenter="python"
	authors="rickle-msft"
	manager="carmonm"
	editor=""/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="python"
	ms.topic="article"
	ms.date="08/08/2016"
	ms.author="t-rickle"/>


# Client-Side Encryption with Python for Microsoft Azure Storage

[AZURE.INCLUDE [storage-selector-client-side-encryption-include](../../includes/storage-selector-client-side-encryption-include.md)]

## Overview

The [Azure Storage Client Library for Python](https://pypi.python.org/pypi/azure-storage) supports encrypting data within client applications before uploading to Azure Storage, and decrypting data while downloading to the client.
## Encryption and decryption via the envelope technique
The processes of encryption and decryption follow the envelope technique.

### Encryption via the envelope technique
Encryption via the envelope technique works in the following way:

1.	The Azure storage client library generates a content encryption key (CEK), which is a one-time-use symmetric key.

2.	User data is encrypted using this CEK.

3.	The CEK is then wrapped (encrypted) using the key encryption key (KEK). The KEK is identified by a key identifier and can be an asymmetric key pair or a symmetric key, which is managed locally.
The storage client library itself never has access to KEK. The library invokes the key wrapping algorithm that is provided by the KEK. Users can choose to use custom providers for key wrapping/unwrapping if desired.

4.	The encrypted data is then uploaded to the Azure Storage service. The wrapped key along with some additional encryption metadata is either stored as metadata (on a blob) or interpolated with the encrypted data (queue messages and table entities).

### Decryption via the envelope technique
Decryption via the envelope technique works in the following way:

1.	The client library assumes that the user is managing the key encryption key (KEK) locally. The user does not need to know the specific key that was used for encryption. Instead, a key resolver, which resolves different key identifiers to keys, can be set up and used.

2.	The client library downloads the encrypted data along with any encryption material that is stored on the service.

3.	The wrapped content encryption key (CEK) is then unwrapped (decrypted) using the key encryption key (KEK). Here again, the client library does not have access to KEK. It simply invokes the custom provider’s unwrapping algorithm.

4.	The content encryption key (CEK) is then used to decrypt the encrypted user data.

## Encryption Mechanism  
The storage client library uses [AES](http://en.wikipedia.org/wiki/Advanced_Encryption_Standard) in order to encrypt user data. Specifically, [Cipher Block Chaining (CBC)](http://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher-block_chaining_.28CBC.29) mode with AES. Each service works somewhat differently, so we will discuss each of them here.

### Blobs
The client library currently supports encryption of whole blobs only. Specifically, encryption is supported when users use the **create*** methods. For downloads, both complete and range downloads are supported, and parallelization of both upload and download is available.

During encryption, the client library will generate a random Initialization Vector (IV) of 16 bytes, together with a random content encryption key (CEK) of 32 bytes, and perform envelope encryption of the blob data using this information. The wrapped CEK and some additional encryption metadata are then stored as blob metadata along with the encrypted blob on the service.

>[AZURE.WARNING] If you are editing or uploading your own metadata for the blob, you need to ensure that this metadata is preserved. If you upload new metadata without this metadata, the wrapped CEK, IV and other metadata will be lost and the blob content will never be retrievable again.

Downloading an encrypted blob involves retrieving the content of the entire blob using the **get*** convenience methods. The wrapped CEK is unwrapped and used together with the IV (stored as blob metadata in this case) to return the decrypted data to the users.

Downloading an arbitrary range (**get*** methods with range parameters passed in) in the encrypted blob involves adjusting the range provided by users in order to get a small amount of additional data that can be used to successfully decrypt the requested range.

Block blobs and page blobs only can be encrypted/decrypted using this scheme. There is currently no support for encrypting append blobs.

### Queues
Since queue messages can be of any format, the client library defines a custom format that includes the Initialization Vector (IV) and the encrypted content encryption key (CEK) in the message text.

During encryption, the client library generates a random IV of 16 bytes along with a random CEK of 32 bytes and performs envelope encryption of the queue message text using this information. The wrapped CEK and some additional encryption metadata are then added to the encrypted queue message. This modified message (shown below) is stored on the service.

	<MessageText>{"EncryptedMessageContents":"6kOu8Rq1C3+M1QO4alKLmWthWXSmHV3mEfxBAgP9QGTU++MKn2uPq3t2UjF1DO6w","EncryptionData":{…}}</MessageText>

During decryption, the wrapped key is extracted from the queue message and unwrapped. The IV is also extracted from the queue message and used along with the unwrapped key to decrypt the queue message data. Note that the encryption metadata is small (under 500 bytes), so while it does count toward the 64KB limit for a queue message, the impact should be manageable.

### Tables
The client library supports encryption of entity properties for insert and replace operations.

>[AZURE.NOTE] Merge is not currently supported. Since a subset of properties may have been encrypted previously using a different key, simply merging the new properties and updating the metadata will result in data loss. Merging either requires making extra service calls to read the pre-existing entity from the service, or using a new key per property, both of which are not suitable for performance reasons.

Table data encryption works as follows:

1.	Users specify the properties to be encrypted.

2.	The client library generates a random Initialization Vector (IV) of 16 bytes along with a random content encryption key (CEK) of 32 bytes for every entity, and performs envelope encryption on the individual properties to be encrypted by deriving a new IV per property. The encrypted property is stored as binary data.

3.	The wrapped CEK and some additional encryption metadata are then stored as two additional reserved properties. The first reserved property (\_ClientEncryptionMetadata1) is a string property that holds the information about IV, version, and wrapped key. The second reserved property (\_ClientEncryptionMetadata2) is a binary property that holds the information about the properties that are encrypted. The information in this second property (\_ClientEncryptionMetadata2) is itself encrypted.

4.	Due to these additional reserved properties required for encryption, users may now have only 250 custom properties instead of 252. The total size of the entity must be less than 1MB.

	Note that only string properties can be encrypted. If other types of properties are to be encrypted, they must be converted to strings. The encrypted strings are stored on the service as binary properties, and they are converted back to strings (raw strings, not EntityProperties with type EdmType.STRING) after decryption.

	For tables, in addition to the encryption policy, users must specify the properties to be encrypted. This can be done by either storing these properties in TableEntity objects with the type set to EdmType.STRING and encrypt set to true or setting the encryption_resolver_function on the tableservice object. An encryption resolver is a function that takes a partition key, row key, and property name and returns a boolean that indicates whether that property should be encrypted. During encryption, the client library will use this information to decide whether a property should be encrypted while writing to the wire. The delegate also provides for the possibility of logic around how properties are encrypted. (For example, if X, then encrypt property A; otherwise encrypt properties A and B.) Note that it is not necessary to provide this information while reading or querying entities.

### Batch Operations
One encryption policy applies to all rows in the batch. The client library will internally generate a new random IV and random CEK per row in the batch. Users can also choose to encrypt different properties for every operation in the batch by defining this behavior in the encryption resolver.
If a batch is created as a context manager through the tableservice batch() method, the tableservice's encryption policy will automatically be applied to the batch. If a batch is created explicitly by calling the constructor, the encryption policy must be passed as a parameter and left unmodified for the lifetime of the batch.
Note that entities are encrypted as they are inserted into the batch using the batch's encryption policy (entities are NOT encrypted at the time of committing the batch using the tableservice's encryption policy).

### Queries
To perform query operations, you must specify a key resolver that is able to resolve all the keys in the result set. If an entity contained in the query result cannot be resolved to a provider, the client library will throw an error. For any query that performs server side projections, the client library will add the special encryption metadata properties (\_ClientEncryptionMetadata1 and \_ClientEncryptionMetadata2) by default to the selected columns.

>[AZURE.IMPORTANT] Be aware of these important points when using client-side encryption:
>
>- When reading from or writing to an encrypted blob, use whole blob upload commands and range/whole blob download commands. Avoid writing to an encrypted blob using protocol operations such as Put Block, Put Block List, Write Pages, or Clear Pages; otherwise you may corrupt the encrypted blob and make it unreadable.
>
>- For tables, a similar constraint exists. Be careful to not update encrypted properties without updating the encryption metadata.
>
>- If you set metadata on the encrypted blob, you may overwrite the encryption-related metadata required for decryption, since setting metadata is not additive. This is also true for snapshots; avoid specifying metadata while creating a snapshot of an encrypted blob. If metadata must be set, be sure to call the **get_blob_metadata** method first to get the current encryption metadata, and avoid concurrent writes while metadata is being set.
>
>- Enable the **require_encryption** flag on the service object for users that should work only with encrypted data. See below for more info.

The storage client library expects the provided KEK and key resolver to implement the following interface. [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) support for Python KEK management is pending and will be integrated into this library when completed.


## Client API / Interface
After a storage service object (i.e. blockblobservice) has been created, the user may assign values to the fields that constitute an encryption policy: key_encryption_key, key_resolver_function, and require_encryption. Users can provide only a KEK, only a resolver, or both. key_encryption_key is the basic key type that is identified using a key identifier and that provides the logic for wrapping/unwrapping. key_resolver_function is used to resolve a key during the decryption process. It returns a valid KEK given a key identifier. This provides users the ability to choose between multiple keys that are managed in multiple locations.

The KEK must implement the following methods to successfully encrypt data:
- wrap_key(cek): Wraps the specified CEK (bytes) using an algorithm of the user's choice. Returns the wrapped key.
- get_key_wrap_algorithm(): Returns the algorithm used to wrap keys.
- get_kid(): Returns the string key id for this KEK.
The KEK must implement the following methods to successfully decrypt data:
- unwrap_key(cek, algorithm): Returns the unwrapped form of the specified CEK using the string-specified algorithm.
- get_kid(): Returns a string key id for this KEK.

The key resolver must at least implement a method that, given a key id, returns the corresponding KEK implementing the interface above. Only this method is to be assigned to the key_resolver_function property on the service object.

- For encryption, the key is used always and the absence of a key will result in an error.
- For decryption:
	- The key resolver is invoked if specified to get the key. If the resolver is specified but does not have a mapping for the key identifier, an error is thrown.
	- If resolver is not specified but a key is specified, the key is used if its identifier matches the required key identifier. If the identifier does not match, an error is thrown.

	  The encryption samples in azure.storage.samples <fix URL>demonstrate a more detailed end-to-end scenario for blobs, queues and tables.
		Sample implementations of the KEK and key resolver are provided in the sample files as KeyWrapper and KeyResolver respectively.

### RequireEncryption mode
Users can optionally enable a mode of operation where all uploads and downloads must be encrypted. In this mode, attempts to upload data without an encryption policy or download data that is not encrypted on the service will fail on the client. The **require_encryption** flag on the service object controls this behavior.

### Blob service encryption
Set the encryption policy fields on the blockblobservice object. Everything else will be handled by the client library internally.

	# Create the KEK used for encryption.
	# KeyWrapper is the provided sample implementation, but the user may use their own object as long as it implements the interface above.
	kek = KeyWrapper('local:key1') # Key identifier

	# Create the key resolver used for decryption.
	# KeyResolver is the provided sample implementation, but the user may use whatever implementation they choose so long as the function set on the service object behaves appropriately.
	key_resolver = KeyResolver()
	key_resolver.put_key(kek)

	# Set the KEK and key resolver on the service object.
	my_block_blob_service.key_encryption_key = kek
	my_block_blob_service.key_resolver_funcion = key_resolver.resolve_key

	# Upload the encrypted contents to the blob.
	my_block_blob_service.create_blob_from_stream(container_name, blob_name, stream)

	# Download and decrypt the encrypted contents from the blob.
	blob = my_block_blob_service.get_blob_to_bytes(container_name, blob_name)

### Queue service encryption
Set the encryption policy fields on the queueservice object. Everything else will be handled by the client library internally.

	# Create the KEK used for encryption.
	# KeyWrapper is the provided sample implementation, but the user may use their own object as long as it implements the interface above.
	kek = KeyWrapper('local:key1') # Key identifier

	# Create the key resolver used for decryption.
	# KeyResolver is the provided sample implementation, but the user may use whatever implementation they choose so long as the function set on the service object behaves appropriately.
	key_resolver = KeyResolver()
	key_resolver.put_key(kek)

	# Set the KEK and key resolver on the service object.
	my_queue_service.key_encryption_key = kek
	my_queue_service.key_resolver_funcion = key_resolver.resolve_key

	# Add message
	my_queue_service.put_message(queue_name, content)

	# Retrieve message
	retrieved_message_list = my_queue_service.get_messages(queue_name)

### Table service encryption
In addition to creating an encryption policy and setting it on request options, you must either specify an **encryption_resolver_function** on the **tableservice**, or set the encrypt attribute on the EntityProperty.

### Using the resolver

	# Create the KEK used for encryption.
	# KeyWrapper is the provided sample implementation, but the user may use their own object as long as it implements the interface above.
	kek = KeyWrapper('local:key1') # Key identifier

	# Create the key resolver used for decryption.
	# KeyResolver is the provided sample implementation, but the user may use whatever implementation they choose so long as the function set on the service object behaves appropriately.
	key_resolver = KeyResolver()
	key_resolver.put_key(kek)

	# Define the encryption resolver_function.
	def my_encryption_resolver(pk, rk, property_name):
			if property_name == 'foo':
					return True
			return False

	# Set the KEK and key resolver on the service object.
	my_table_service.key_encryption_key = kek
	my_table_service.key_resolver_funcion = key_resolver.resolve_key
	my_table_service.encryption_resolver_function = my_encryption_resolver

	# Insert Entity
	my_table_service.insert_entity(table_name, entity)

	# Retrieve Entity
	# Note: No need to specify an encryption resolver for retrieve, but it is harmless to leave the property set.
	my_table_service.get_entity(table_name, entity['PartitionKey'], entity['RowKey'])

### Using attributes
As mentioned above, a property may be marked for encryption by storing it in an EntityProperty object and setting the encrypt field.

	encrypted_property_1 = EntityProperty(EdmType.STRING, value, encrypt=True)

## Encryption and performance
Note that encrypting your storage data results in additional performance overhead. The content key and IV must be generated, the content itself must be encrypted, and additional metadata must be formatted and uploaded. This overhead will vary depending on the quantity of data being encrypted. We recommend that customers always test their applications for performance during development.

## Next steps

- Download the [Azure Storage Client Library for Java PyPi package](https://pypi.python.org/pypi/azure-storage)
- Download the [Azure Storage Client Library for Python Source Code from GitHub](https://github.com/Azure/azure-storage-python)
