---
title: "Copy data from Amazon S3 to Azure Storage by using AzCopy | Microsoft Docs"
description: Transfer data with AzCopy and Amazon S3 buckets
services: storage
author: normesta
ms.service: storage
ms.topic: how-to
ms.date: 01/13/2020
ms.author: normesta
ms.subservice: common
---

# Copy data from Amazon S3 to Azure Storage by using AzCopy

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article helps you copy objects, directories, and buckets from Amazon Web Services (AWS) S3 to Azure blob storage by using AzCopy.

## Choose how you'll provide authorization credentials

* To authorize with the Azure Storage, use Azure Active Directory (AD) or a Shared Access Signature (SAS) token.

* To authorize with AWS S3, use an AWS access key and a secret access key.

### Authorize with Azure Storage

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy, and choose how you'll provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article assume that you've authenticated your identity by using the `AzCopy login` command. AzCopy then uses your Azure AD account to authorize access to data in Blob storage.
>
> If you'd rather use a SAS token to authorize access to blob data, then you can append that token to the resource URL in each AzCopy command.
>
> For example: `https://mystorageaccount.blob.core.windows.net/mycontainer?<SAS-token>`.

### Authorize with AWS S3

Gather your AWS access key and secret access key, and then set the these environment variables:

| Operating system | Command  |
|--------|-----------|
| **Windows** | `set AWS_ACCESS_KEY_ID=<access-key>`<br>`set AWS_SECRET_ACCESS_KEY=<secret-access-key>` |
| **Linux** | `export AWS_ACCESS_KEY_ID=<access-key>`<br>`export AWS_SECRET_ACCESS_KEY=<secret-access-key>` |
| **MacOS** | `export AWS_ACCESS_KEY_ID=<access-key>`<br>`export AWS_SECRET_ACCESS_KEY=<secret-access-key>`|

## Copy objects, directories, and buckets

AzCopy uses the [Put Block From URL](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) API, so data is copied directly between AWS S3 and storage servers. These copy operations don't use the network bandwidth of your computer.

> [!IMPORTANT]
> This feature is currently in preview. If you decide to remove data from your S3 buckets after a copy operation, make sure to verify that the data was properly copied to your storage account before you remove the data.

> [!TIP]
> The examples in this section enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

 These examples also work with accounts that have a hierarchical namespace. [Multi-protocol access on Data Lake Storage](../blobs/data-lake-storage-multi-protocol-access.md) enables you to use the same URL syntax (`blob.core.windows.net`) on those accounts. 

### Copy an object

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://s3.amazonaws.com/<bucket-name>/<object-name>' 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<blob-name>'` |
| **Example** | `azcopy copy 'https://s3.amazonaws.com/mybucket/myobject' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myblob'` |
| **Example** (hierarchical namespace) | `azcopy copy 'https://s3.amazonaws.com/mybucket/myobject' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myblob'` |

> [!NOTE]
> Examples in this article use path-style URLs for AWS S3 buckets (For example: `http://s3.amazonaws.com/<bucket-name>`). 
>
> You can also use virtual hosted-style URLs as well (For example: `http://bucket.s3.amazonaws.com`). 
>
> To learn more about virtual hosting of buckets, see [Virtual Hosting of Buckets]](https://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html).

### Copy a directory

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://s3.amazonaws.com/<bucket-name>/<directory-name>' 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<directory-name>' --recursive=true` |
| **Example** | `azcopy copy 'https://s3.amazonaws.com/mybucket/mydirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer/mydirectory' --recursive=true` |
| **Example** (hierarchical namespace)| `azcopy copy 'https://s3.amazonaws.com/mybucket/mydirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer/mydirectory' --recursive=true` |

### Copy a bucket

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://s3.amazonaws.com/<bucket-name>' 'https://<storage-account-name>.blob.core.windows.net/<container-name>' --recursive=true` |
| **Example** | `azcopy copy 'https://s3.amazonaws.com/mybucket' 'https://mystorageaccount.blob.core.windows.net/mycontainer' --recursive=true` |
| **Example** (hierarchical namespace)| `azcopy copy 'https://s3.amazonaws.com/mybucket/mydirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer/mydirectory' --recursive=true` |

### Copy all buckets in all regions

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://s3.amazonaws.com/' 'https://<storage-account-name>.blob.core.windows.net' --recursive=true` |
| **Example** | `azcopy copy 'https://s3.amazonaws.com' 'https://mystorageaccount.blob.core.windows.net' --recursive=true` |
| **Example** (hierarchical namespace)| `azcopy copy 'https://s3.amazonaws.com/mybucket/mydirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer/mydirectory' --recursive=true` |

### Copy all buckets in a specific S3 region

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://s3-<region-name>.amazonaws.com/' 'https://<storage-account-name>.blob.core.windows.net' --recursive=true` |
| **Example** | `azcopy copy 'https://s3-rds.eu-north-1.amazonaws.com' 'https://mystorageaccount.blob.core.windows.net' --recursive=true` |
| **Example** (hierarchical namespace)| `azcopy copy 'https://s3.amazonaws.com/mybucket/mydirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer/mydirectory' --recursive=true` |

## Handle differences in object naming rules

AWS S3 has a different set of naming conventions for bucket names as compared to Azure blob containers. You can read about them [here](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules). If you choose to copy a group of buckets to an Azure storage account, the copy operation might fail because of naming differences.

AzCopy handles two of the most common issues that can arise; buckets that contain periods and buckets that contain consecutive hyphens. AWS S3 bucket names can contain periods and consecutive hyphens, but a container in Azure can't. AzCopy replaces periods with hyphens and consecutive hyphens with a number that represents the number of consecutive hyphens (For example: a bucket named `my----bucket` becomes `my-4-bucket`. 

Also, as AzCopy copies over files, it checks for naming collisions and attempts to resolve them. For example, if there are buckets with the name `bucket-name` and `bucket.name`, AzCopy resolves a bucket named `bucket.name` first to `bucket-name` and then to `bucket-name-2`.

## Handle differences in object metadata

AWS S3 and Azure allow different sets of characters in the names of object keys. You can read about the characters that AWS S3 uses [here](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#object-keys). On the Azure side, blob object keys adhere to the naming rules for [C# identifiers](https://docs.microsoft.com/dotnet/csharp/language-reference/).

As part of an AzCopy `copy` command, you can provide a value for optional the `s2s-invalid-metadata-handle` flag that specifies how you would like to handle files where the metadata of the file contains incompatible key names. The following table describes each flag value.

| Flag value | Description  |
|--------|-----------|
| **ExcludeIfInvalid** | (Default option) The metadata isn't included in the transferred object. AzCopy logs a warning. |
| **FailIfInvalid** | Objects aren't copied. AzCopy logs an error and includes that error in the failed count that appears in the transfer summary.  |
| **RenameIfInvalid**  | AzCopy resolves the invalid metadata key, and copies the object to Azure using the resolved metadata key value pair. To learn exactly what steps AzCopy takes to rename object keys, see the [How AzCopy renames object keys](#rename-logic) section below. If AzCopy is unable to rename the key, then the object won't be copied. |

<a id="rename-logic"></a>

### How AzCopy renames object keys

AzCopy performs these steps:

1. Replaces invalid characters with '_'.

2. Adds the string `rename_` to the beginning of a new valid key.

   This key will be used to save the original metadata **value**.

3. Adds the string `rename_key_` to the beginning of a new valid key.
   This key will be used to save original metadata invalid **key**.
   You can use this key to try and recover the metadata in Azure side since metadata key is preserved as a value on the Blob storage service.

## Next steps

Find more examples in any of these articles:

- [Get started with AzCopy](storage-use-azcopy-v10.md)

- [Transfer data with AzCopy and blob storage](storage-use-azcopy-blobs.md)

- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)