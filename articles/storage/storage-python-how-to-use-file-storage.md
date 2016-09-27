<properties
	pageTitle="How to use Azure File storage from Python | Microsoft Azure"
	description="Learn how to use the Azure File storage from Python to upload, list, download, and delete files."
	services="storage"
	documentationCenter="python"
	authors="emgerner-msft"
	manager="wpickett"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="python"
	ms.topic="article"
	ms.date="07/26/2016"
	ms.author="emgerner"/>

# How to use Azure File storage from Python

[AZURE.INCLUDE [storage-selector-file-include](../../includes/storage-selector-file-include.md)]
<br/>
[AZURE.INCLUDE [storage-try-azure-tools-files](../../includes/storage-try-azure-tools-files.md)]

## Overview

This article will show you how to perform common scenarios using File storage. The samples are written in Python and use the [Microsoft Azure Storage SDK for Python]. The scenarios covered include uploading, listing, downloading, and deleting files.

[AZURE.INCLUDE [storage-file-concepts-include](../../includes/storage-file-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

## Create a share

The **FileService** object lets you work with shares, directories and files. The following code creates a **FileService** object. Add the following near the top of any Python file in which you wish to programmatically access Azure Storage.

	from azure.storage.file import FileService

The following code creates a **FileService** object using the storage account name and account key.  Replace 'myaccount' and 'mykey' with your account name and key.

	file_service = **FileService** (account_name='myaccount', account_key='mykey')

In the following code example, you can use a **FileService** object to create the share if it doesn't exist.

	file_service.create_share('myshare')

## Upload a file into a share

An Azure File Storage Share contains at the very least, a root directory where files can reside. In this section, you'll learn how to upload a file from local storage onto the root directory of a share.

To create a file and upload data, use the **create\_file\_from\_path**, **create\_file\_from\_stream**, **create\_file\_from\_bytes** or **create\_file\_from\_text** methods. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

**create\_file\_from\_path** uploads the contents of a file from the specified path, and **create\_file\_from\_stream** uploads the contents from an already opened file/stream. **create\_file\_from\_bytes** uploads an array of bytes, and **create\_file\_from\_text** uploads the specified text value using the specified encoding (defaults to UTF-8).

The following example uploads the contents of the **sunset.png** file into the **myfile** file.

	from azure.storage.file import ContentSettings
	file_service.create_file_from_path(
        'myshare',
        None, # We want to create this blob in the root directory, so we specify None for the directory_name
        'myfile',
        'sunset.png',
        content_settings=ContentSettings(content_type='image/png'))

## How to: Create a Directory

You can also organize storage by putting files inside sub-directories instead of having all of them in the root directory. The Azure file storage service allows you to create as many directories as your account will allow. The code below will create a sub-directory named **sampledir** under the root directory.

	file_service.create_directory('myshare', 'sampledir')

## How to: List files and directories in a share

To list the files and directories in a share, use the **list\_directories\_and\_files** method. This method returns a generator. The following code outputs the **name** of each file and directory in a share to the console.

	generator = file_service.list_directories_and_files('myshare')
	for file_or_dir in generator:
		print(file_or_dir.name)

## Download files

To download data from a file, use **get\_file\_to\_path**, **get\_file\_to\_stream**, **get\_file\_to\_bytes**, or **get\_file\_to\_text**. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

The following example demonstrates using **get\_file\_to\_path** to download the contents of the **myfile** file and store it to the **out-sunset.png** file.

	file_service.get_file_to_path('myshare', None, 'myfile', 'out-sunset.png')

## Delete a file

Finally, to delete a file, call **delete_file**.

	file_service.delete_file('myshare', None, 'myfile')

## Next steps

Now that you've learned the basics of File storage, follow these links
to learn more.

- [Python Developer Center](/develop/python/)
- [Azure Storage Services REST API](http://msdn.microsoft.com/library/azure/dd179355)
- [Azure Storage Team Blog]
- [Microsoft Azure Storage SDK for Python]

[Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
[Microsoft Azure Storage SDK for Python]: https://github.com/Azure/azure-storage-python
