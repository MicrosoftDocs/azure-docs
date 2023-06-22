---
title: "Copy from Google Cloud Storage to Azure Storage with AzCopy"
description: Use AzCopy to copy data from Google Cloud Storage to Azure Storage. AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account.
services: storage
author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 04/02/2021
ms.author: normesta
ms.subservice: storage-common-concepts
---

# Copy data from Google Cloud Storage to Azure Storage by using AzCopy

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article helps you copy objects, directories, and buckets from Google Cloud Storage to Azure Blob Storage by using AzCopy.

## Choose how you'll provide authorization credentials

- To authorize with Azure Storage, use Azure Active Directory (AD) or a Shared Access Signature (SAS) token.

- To authorize with Google Cloud Storage, use a service account key.

### Authorize with Azure Storage

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article assume that you've provided authorization credentials by using Azure Active Directory (Azure AD).
>
> If you'd rather use a SAS token to authorize access to blob data, then you can append that token to the resource URL in each AzCopy command. For example: `'https://<storage-account-name>.blob.core.windows.net/<container-name><SAS-token>'`.

### Authorize with Google Cloud Storage

To authorize with Google Cloud Storage, you'll use a service account key. For information about how to create a service account key, see [Creating and managing service account keys](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

After you've obtained a service key, set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to absolute path to the service account key file:

| Operating system | Command  |
|--------|-----------|
| **Windows** | `set GOOGLE_APPLICATION_CREDENTIALS=<path-to-service-account-key>` |
| **Linux** | `export GOOGLE_APPLICATION_CREDENTIALS=<path-to-service-account-key>` |
| **macOS** | `export GOOGLE_APPLICATION_CREDENTIALS=<path-to-service-account-key>` |

## Copy objects, directories, and buckets

AzCopy uses the [Put Block From URL](/rest/api/storageservices/put-block-from-url) API, so data is copied directly between Google Cloud Storage and storage servers. These copy operations don't use the network bandwidth of your computer.

> [!TIP]
> The examples in this section enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

 These examples also work with accounts that have a hierarchical namespace. [Multi-protocol access on Data Lake Storage](../blobs/data-lake-storage-multi-protocol-access.md) enables you to use the same URL syntax (`blob.core.windows.net`) on those accounts.

### Copy an object

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

**Syntax**

`azcopy copy 'https://storage.cloud.google.com/<bucket-name>/<object-name>' 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<blob-name>'`

**Example**

```azcopy
azcopy copy 'https://storage.cloud.google.com/mybucket/myobject' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myblob'
```

### Copy a directory

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

**Syntax**

`azcopy copy 'https://storage.cloud.google.com/<bucket-name>/<directory-name>' 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<directory-name>' --recursive=true`

**Example**

```azcopy
azcopy copy 'https://storage.cloud.google.com/mybucket/mydirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer/mydirectory' --recursive=true
```

> [!NOTE]
> This example appends the `--recursive` flag to copy files in all sub-directories.

### Copy the contents of a directory

You can copy the contents of a directory without copying the containing directory itself by using the wildcard symbol (*).

**Syntax**

`azcopy copy 'https://storage.cloud.google.com/<bucket-name>/<directory-name>/*' 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<directory-name>' --recursive=true`

**Example**

```azcopy
azcopy copy 'https://storage.cloud.google.com/mybucket/mydirectory/*' 'https://mystorageaccount.blob.core.windows.net/mycontainer/mydirectory' --recursive=true
```

### Copy a Cloud Storage bucket

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

**Syntax**

`azcopy copy 'https://storage.cloud.google.com/<bucket-name>' 'https://<storage-account-name>.blob.core.windows.net' --recursive=true`

**Example**

```azcopy
azcopy copy 'https://storage.cloud.google.com/mybucket' 'https://mystorageaccount.blob.core.windows.net' --recursive=true
```

### Copy all buckets in a Google Cloud project

First, set the `GOOGLE_CLOUD_PROJECT` to project ID of Google Cloud project.

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

**Syntax**

`azcopy copy 'https://storage.cloud.google.com/' 'https://<storage-account-name>.blob.core.windows.net' --recursive=true`

**Example**

```azcopy
azcopy copy 'https://storage.cloud.google.com/' 'https://mystorageaccount.blob.core.windows.net' --recursive=true
```

### Copy a subset of buckets in a Google Cloud project

First, set the `GOOGLE_CLOUD_PROJECT` to project ID of Google Cloud project.

Copy a subset of buckets by using a wildcard symbol (*) in the bucket name. Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

**Syntax**

`azcopy copy 'https://storage.cloud.google.com/<bucket*name>' 'https://<storage-account-name>.blob.core.windows.net' --recursive=true`

**Example**

```azcopy
azcopy copy 'https://storage.cloud.google.com/my*bucket' 'https://mystorageaccount.blob.core.windows.net' --recursive=true
```

## Handle differences in bucket naming rules

Google Cloud Storage has a different set of naming conventions for bucket names as compared to Azure blob containers. You can read about them [here](https://cloud.google.com/storage/docs/naming-buckets). If you choose to copy a group of buckets to an Azure storage account, the copy operation might fail because of naming differences.

AzCopy handles three of the most common issues that can arise; buckets that contain periods, buckets that contain consecutive hyphens, and buckets that contain underscores. Google Cloud Storage bucket names can contain periods and consecutive hyphens, but a container in Azure can't. AzCopy replaces periods with hyphens and consecutive hyphens with a number that represents the number of consecutive hyphens (For example: a bucket named `my----bucket` becomes `my-4-bucket`. If the bucket name has an underscore (`_`), then AzCopy replaces the underscore with a hyphen. For example, a bucket named `my_bucket` becomes `my-bucket`.

## Handle differences in object naming rules

Google Cloud Storage has a different set of naming conventions for object names as compared to Azure blobs. You can read about them [here](https://cloud.google.com/storage/docs/naming-objects).

Azure Storage does not permit object names (or any segment in the virtual directory path) to end with trailing dots (For example `my-bucket...`). Trailing dots are trimmed off when the copy operation is performed.

## Handle differences in object metadata

Google Cloud Storage and Azure allow different sets of characters in the names of object keys. You can read about metadata in Google Cloud Storage [here](https://cloud.google.com/storage/docs/metadata). On the Azure side, blob object keys adhere to the naming rules for [C# identifiers](/dotnet/csharp/language-reference/).

As part of an AzCopy `copy` command, you can provide a value for optional the `s2s-handle-invalid-metadata` flag that specifies how you would like to handle files where the metadata of the file contains incompatible key names. The following table describes each flag value.

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
   You can use this key to try to recover the metadata in Azure side since metadata key is preserved as a value on the Blob storage service.

## Next steps

Find more examples in these articles:

- [Examples: Upload](storage-use-azcopy-blobs-upload.md)
- [Examples: Download](storage-use-azcopy-blobs-download.md)
- [Examples: Copy between accounts](storage-use-azcopy-blobs-copy.md)
- [Examples: Synchronize](storage-use-azcopy-blobs-synchronize.md)
- [Examples: Amazon S3 buckets](storage-use-azcopy-s3.md)
- [Examples: Azure Files](storage-use-azcopy-files.md)
- [Tutorial: Migrate on-premises data to cloud storage by using AzCopy](storage-use-azcopy-migrate-on-premises-data.md)

See these articles to configure settings, optimize performance, and troubleshoot issues:

- [AzCopy configuration settings](storage-ref-azcopy-configuration-settings.md)
- [Optimize the performance of AzCopy](storage-use-azcopy-optimize.md)
- [Find errors and resume jobs by using log and plan files in AzCopy](storage-use-azcopy-configure.md)
- [Troubleshoot problems with AzCopy v10](storage-use-azcopy-troubleshoot.md)
