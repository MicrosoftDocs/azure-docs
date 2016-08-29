<properties
	pageTitle="How to use Blob Storage from Xamarin (Preview) | Microsoft Azure"
	description="The Azure Storage Client Library for Xamarin preview enables developers to create iOS, Android, and Windows Store apps with their native user interfaces. This tutorial shows how to use Xamarin to create an application that uses Azure Blob storage."
	services="storage"
	documentationCenter="xamarin"
	authors="micurd"
	manager=""
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/24/2016"
	ms.author="micurd"/>

# How to use Blob Storage from Xamarin (Preview)

[AZURE.INCLUDE [storage-selector-blob-include](../../includes/storage-selector-blob-include.md)]
<br/>
[AZURE.INCLUDE [storage-try-azure-tools-blobs](../../includes/storage-try-azure-tools-blobs.md)]

## Overview

Xamarin enables developers to use a shared C# codebase to create iOS, Android, and Windows Store apps with their native user interfaces. The Azure Storage Client Library for Xamarin is a preview library; note that it may change in the future.

This tutorial shows you how to use Azure Blob storage with a Xamarin application. If you'd like to learn more about Azure Storage, before diving into the code, see [Introduction to Microsoft Azure Storage](storage-introduction.md).

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

[AZURE.INCLUDE [storage-mobile-authentication-guidance](../../includes/storage-mobile-authentication-guidance.md)]

## Create a new Xamarin Application

For this getting started, we'll be creating our Xamarin application in Visual Studio. Follow these steps to create the application:

1. Download and install [Xamarin for Visual Studio](https://www.xamarin.com/download).
3. Open Visual Studio, and select **File > New > Project > Cross-Platform > Blank App(Native Shared)**.
4. Right-click your solution in the Solution Explorer pane and select **Manage NuGet Packages for Solution**. Search for **WindowsAzure.Storage** and install the latest stable version to all projects in your solution.

You should now have an application that allows you to click a button which increments a counter.

## Create container and upload blob

Next, you'll add some code to the shared class `MyClass.cs` that creates a container and uploads a blob into this container. `MyClass.cs` should look like the following:

	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Blob;
	using System;

	namespace XamarinApp
	{
		public class MyClass
		{
			public MyClass ()
			{
			}

		    public static void createContainerAndUpload()
		    {
		        // Retrieve storage account from connection string.
		        CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here");

		        // Create the blob client.
		        CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

		        // Retrieve reference to a previously created container.
		        CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

		        // Retrieve reference to a blob named "myblob".
		        CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");

		        // Create the "myblob" blob with the text "Hello, world!"
		        blockBlob.UploadTextAsync("Hello, world!");
		    }
		}
	}

You can then use this shared class in your iOS, Android, and Windows Phone application.

XamarinApp.Droid > MainActivity.cs




## Run the application

You can now run this application in an emulator or Android device.

Although this getting started focused on Android, you can use the `UseContainerSAS` method in your iOS or Windows Store applications as well. Xamarin also allows developers to create Windows Phone apps; however, our library does not yet support this.

## Next steps

In this tutorial, you learned how to use Azure Blob storage and SAS with a Xamarin application. As a further exercise, a similar pattern could be applied to generate a SAS token for an Azure table or queue.

Learn more about blobs, tables, and queues by checking out the following links:

- [Introduction to Microsoft Azure Storage](storage-introduction.md)
- [Get started with Azure Blob Storage using .NET](storage-dotnet-how-to-use-blobs.md)
- [Get started with Azure Table Storage using .NET](storage-dotnet-how-to-use-tables.md)
- [Get started with Azure Queue Storage using .NET](storage-dotnet-how-to-use-queues.md)
- [Get started with Azure File Storage on Windows](storage-dotnet-how-to-use-files.md)
- [Transfer data with the AzCopy command-line utility](storage-use-azcopy.md)
