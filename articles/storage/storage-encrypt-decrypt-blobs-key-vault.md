<properties
   pageTitle="Tutorial: Encrypt and decrypt blobs in Microsoft Azure Storage using Azure Key Vault | Microsoft Azure"
   description="This tutorial walks you through how to encrypt and decrypt a blob using client-side encryption for Microsoft Azure Storage with Azure Key Vault."
   services="storage"
   documentationCenter=""
   authors="adhurwit"
   manager=""
   editor="tysonn"/>

<tags
   ms.service="storage"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required"
   ms.date="03/31/2016"
   ms.author="lakasa"/>

# Tutorial: Encrypt and decrypt blobs in Microsoft Azure Storage using Azure Key Vault

## Introduction

This tutorial covers how to make use of client-side storage encryption with Azure Key Vault. It walks you through how to encrypt and decrypt a blob in a console application using these technologies.

**Estimated time to complete:** 20 minutes

For overview information about Azure Key Vault, see [What is Azure Key Vault?](../key-vault/key-vault-whatis.md).

For overview information about client-side encryption for Azure Storage, see [Client-Side Encryption and Azure Key Vault for Microsoft Azure Storage](storage-client-side-encryption.md).


## Prerequisites

To complete this tutorial, you must have the following:

- An Azure Storage account
- Visual Studio 2013 or later
- Azure PowerShell


## Overview of client-side encryption

For an overview of client-side encryption for Azure Storage, see [Client-Side Encryption and Azure Key Vault for Microsoft Azure Storage](storage-client-side-encryption.md)

Here is a brief description of how client side encryption works:

1. The Azure Storage client SDK generates a content encryption key (CEK), which is a one-time-use symmetric key.
2. Customer data is encrypted using this CEK.
3. The CEK is then wrapped (encrypted) using the key encryption key (KEK). The KEK is identified by a key identifier and can be an asymmetric key pair or a symmetric key and can be managed locally or stored in Azure Key Vault. The Storage client itself never has access to the KEK. It just invokes the key wrapping algorithm that is provided by Key Vault. Customers can choose to use custom providers for key wrapping/unwrapping if they want.
4. The encrypted data is then uploaded to the Azure Storage service.


## Set up your Azure Key Vault
In order to proceed with this tutorial, you need to do the following steps, which are outlined in the tutorial  [Get started with Azure Key Vault](../key-vault/key-vault-get-started.md):

- Create a key vault.
- Add a key or secret to the key vault.
- Register an application with Azure Active Directory.
- Authorize the application to use the key or secret.

Make note of the ClientID and ClientSecret that were generated when registering an application with Azure Active Directory.

Create both keys in the key vault. We assume for the rest of the tutorial that you have used the following names: ContosoKeyVault and TestRSAKey1.


## Create a console application with packages and AppSettings

In Visual Studio, create a new console application.

Add necessary nuget packages in the Package Manager Console.

	Install-Package WindowsAzure.Storage

	// This is the latest stable release for ADAL.
	Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -Version 2.16.204221202

	Install-Package Microsoft.Azure.KeyVault
	Install-Package Microsoft.Azure.KeyVault.Extensions


Add AppSettings to the App.Config.

	<appSettings>
	    <add key="accountName" value="myaccount"/>
	    <add key="accountKey" value="theaccountkey"/>
	    <add key="clientId" value="theclientid"/>
	    <add key="clientSecret" value="theclientsecret"/>
    	<add key="container" value="stuff"/>
	</appSettings>

Add the following `using` statements and make sure to add a reference to System.Configuration to the project.

	using Microsoft.IdentityModel.Clients.ActiveDirectory;
	using System.Configuration;
	using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Blob;
	using Microsoft.Azure.KeyVault;
	using System.Threading;		
	using System.IO;


## Add a method to get a token to your console application

The following method is used by Key Vault classes that need to authenticate for access to your key vault.

	private async static Task<string> GetToken(string authority, string resource, string scope)
	{
	    var authContext = new AuthenticationContext(authority);
	    ClientCredential clientCred = new ClientCredential(
	        ConfigurationManager.AppSettings["clientId"],
	        ConfigurationManager.AppSettings["clientSecret"]);
		AuthenticationResult result = await authContext.AcquireTokenAsync(resource, clientCred);

	    if (result == null)
	        throw new InvalidOperationException("Failed to obtain the JWT token");

	    return result.AccessToken;
	}

## Access Storage and Key Vault in your program

In the Main function, add the following code.

	// This is standard code to interact with Blob storage.
	StorageCredentials creds = new StorageCredentials(
		ConfigurationManager.AppSettings["accountName"],
       	ConfigurationManager.AppSettings["accountKey"]);
	CloudStorageAccount account = new CloudStorageAccount(creds, useHttps: true);
	CloudBlobClient client = account.CreateCloudBlobClient();
	CloudBlobContainer contain = client.GetContainerReference(ConfigurationManager.AppSettings["container"]);
	contain.CreateIfNotExists();

	// The Resolver object is used to interact with Key Vault for Azure Storage.
	// This is where the GetToken method from above is used.
	KeyVaultKeyResolver cloudResolver = new KeyVaultKeyResolver(GetToken);


> [AZURE.NOTE] Key Vault Object Models
>
>It is important to understand that there are actually two Key Vault object models to be aware of: one is based on the REST API (KeyVault namespace) and the other is an extension for client-side encryption.

> The Key Vault Client interacts with the REST API and understands JSON Web Keys and secrets for the two kinds of things that are contained in Key Vault.

> The Key Vault Extensions are classes that seem specifically created for client-side encryption in Azure Storage. They contain an interface for keys (IKey) and classes based on the concept of a Key Resolver. There are two implementations of IKey that you need to know: RSAKey and SymmetricKey. Now they happen to coincide with the things that are contained in a Key Vault, but at this point they are independent classes (so the Key and Secret retrieved by the Key Vault Client do not implement IKey).


## Encrypt blob and upload
Add the following code to encrypt a blob and upload it to your Azure storage account. The **ResolveKeyAsync** method that is used returns an IKey.


	// Retrieve the key that you created previously.
	// The IKey that is returned here is an RsaKey.
	// Remember that we used the names contosokeyvault and testrsakey1.
    var rsa = cloudResolver.ResolveKeyAsync("https://contosokeyvault.vault.azure.net/keys/TestRSAKey1", CancellationToken.None).GetAwaiter().GetResult();


	// Now you simply use the RSA key to encrypt by setting it in the BlobEncryptionPolicy.
	BlobEncryptionPolicy policy = new BlobEncryptionPolicy(rsa, null);
	BlobRequestOptions options = new BlobRequestOptions() { EncryptionPolicy = policy };

	// Reference a block blob.
	CloudBlockBlob blob = contain.GetBlockBlobReference("MyFile.txt");

	// Upload using the UploadFromStream method.
	using (var stream = System.IO.File.OpenRead(@"C:\data\MyFile.txt"))
		blob.UploadFromStream(stream, stream.Length, null, options, null);


Following is a screenshot from the [Azure Classic Portal](https://manage.windowsazure.com) for a blob that has been encrypted by using client-side encryption with a key stored in Key Vault. The **KeyId** property is the URI for the key in Key Vault that acts as the KEK. The **EncryptedKey** property contains the encrypted version of the CEK.

![Screenshot showing Blob metadata that includes encryption metadata][1]

> [AZURE.NOTE] If you look at the BlobEncryptionPolicy constructor, you will see that it can accept a key and/or a resolver. Be aware that right now you cannot use a resolver for encryption because it does not currently support a default key.



## Decrypt blob and download
Decryption is really when using the Resolver classes make sense. The ID of the key used for encryption is associated with the blob in its metadata, so there is no reason for you to retrieve the key and remember the association between key and blob. You just have to make sure that the key remains in Key Vault.   

The private key of an RSA Key remains in Key Vault, so for decryption to occur, the Encrypted Key from the blob metadata that contains the CEK is sent to Key Vault for decryption.

Add the following to decrypt the blob that you just uploaded.

	// In this case, we will not pass a key and only pass the resolver because
	// this policy will only be used for downloading / decrypting.
	BlobEncryptionPolicy policy = new BlobEncryptionPolicy(null, cloudResolver);
	BlobRequestOptions options = new BlobRequestOptions() { EncryptionPolicy = policy };

    using (var np = File.Open(@"C:\data\MyFileDecrypted.txt", FileMode.Create))
	    blob.DownloadToStream(np, null, options, null);


> [AZURE.NOTE] There are a couple of other kinds of resolvers to make key management easier, including: AggregateKeyResolver and CachingKeyResolver.


## Use Key Vault secrets
The way to use a secret with client-side encryption is via the SymmetricKey class because a secret is essentially a symmetric key. But, as noted above, a secret in Key Vault does not map exactly to a SymmetricKey. There are a few things to understand:


- The key in a SymmetricKey has to be a fixed length: 128, 192, 256, 384, or 512 bits.
- The key in a SymmetricKey should be Base64 encoded.
- A Key Vault secret that will be used as a SymmetricKey needs to have a Content Type of "application/octet-stream" in Key Vault.

Here is an example in PowerShell of creating a secret in Key Vault that can be used as a SymmetricKey. 
NOTE: The hard coded value, $key, is for demonstration purpose only. In your own code you'll want to generate this key.

	// Here we are making a 128-bit key so we have 16 characters.
	// 	The characters are in the ASCII range of UTF8 so they are
	//	each 1 byte. 16 x 8 = 128.
	$key = "qwertyuiopasdfgh"
	$b = [System.Text.Encoding]::UTF8.GetBytes($key)
	$enc = [System.Convert]::ToBase64String($b)
	$secretvalue = ConvertTo-SecureString $enc -AsPlainText -Force

	// Substitute the VaultName and Name in this command.
	$secret = Set-AzureKeyVaultSecret -VaultName 'ContoseKeyVault' -Name 'TestSecret2' -SecretValue $secretvalue -ContentType "application/octet-stream"

In your console application, you can use the same call as before to retrieve this secret as a SymmetricKey.

	SymmetricKey sec = (SymmetricKey) cloudResolver.ResolveKeyAsync(
    	"https://contosokeyvault.vault.azure.net/secrets/TestSecret2/",
        CancellationToken.None).GetAwaiter().GetResult();

That's it. Enjoy!

## Next steps

For more information about using Microsoft Azure Storage with C#, see [Microsoft Azure Storage Client Library for .NET](https://msdn.microsoft.com/library/azure/dn261237.aspx).

For more information about the Blob REST API, see [Blob Service REST API](https://msdn.microsoft.com/library/azure/dd135733.aspx).

For the latest information on Microsoft Azure Storage, go to the [Microsoft Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/).


<!--Image references-->
[1]: ./media/storage-encrypt-decrypt-blobs-key-vault/blobmetadata.png
