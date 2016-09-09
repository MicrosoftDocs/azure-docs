<properties
	pageTitle="How to use Blob Storage from Xamarin (Preview) | Microsoft Azure"
	description="The Azure Storage Client Library for Xamarin preview enables developers to create iOS, Android, and Windows Store apps with their native user interfaces. This tutorial shows how to use Xamarin to create an Android application that uses Azure Blob storage."
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
	ms.date="07/26/2016"
	ms.author="micurd"/>

# How to use Blob Storage from Xamarin (Preview)

[AZURE.INCLUDE [storage-selector-blob-include](../../includes/storage-selector-blob-include.md)]
<br/>
[AZURE.INCLUDE [storage-try-azure-tools-blobs](../../includes/storage-try-azure-tools-blobs.md)]

## Overview

Xamarin enables developers to use a shared C# codebase to create iOS, Android, and Windows Store apps with their native user interfaces. The Azure Storage Client Library for Xamarin is a preview library; note that it may change in the future.

This tutorial shows you how to use Azure Blob storage with a Xamarin Android application. To learn more about Azure Storage before diving into the code, see [Next steps](#next-steps) at the end of this document.

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

## Generate a Shared Access Signature

When developing with the Azure Storage Client Library for Xamarin, you cannot authenticate access to an Azure Storage account using your account access keys. This is to prevent your account credentials from being distributed to users that may download your app. Instead, we encourage the use of shared access signatures (SAS), which won’t expose your account credentials.

In this guide, we'll use Azure PowerShell to generate a SAS token. Then we'll create a Xamarin app that uses the generated SAS.

First, you’ll need to install Azure PowerShell. Check out [How to install and configure Azure PowerShell](../powershell-install-configure.md#Install) for instructions.

Next, open Azure PowerShell and run the following commands. Remember to replace `ACCOUNT_NAME` and `ACCOUNT_KEY== ` with your storage account credentials. Replace `CONTAINER_NAME` with a name of your choosing.

    PS C:\> $context = New-AzureStorageContext -StorageAccountName "ACCOUNT_NAME" -StorageAccountKey "ACCOUNT_KEY=="
	PS C:\> New-AzureStorageContainer CONTAINER_NAME -Permission Off -Context $context
	PS C:\> $now = Get-Date
	PS C:\> New-AzureStorageContainerSASToken -Name CONTAINER_NAME -Permission rwdl -ExpiryTime $now.AddDays(1.0) -Context $context -FullUri

The shared access signature URI for the new container should be similar to the following:

	https://storageaccount.blob.core.windows.net/sascontainer?sv=2012-02-12&se=2013-04-13T00%3A12%3A08Z&sr=c&sp=wl&sig=t%2BbzU9%2B7ry4okULN9S0wst%2F8MCUhTjrHyV9rDNLSe8g%3Dsss

The shared access signature that you created on the container will be valid for the next day. The signature grants full permissions (*e.g.*, read, write, delete, and list) to blobs within the container.

For more information about shared access signatures, see [Shared Access Signatures: Create and use a SAS with Blob storage](storage-dotnet-shared-access-signature-part-2.md).

## Create a new Xamarin Application

For this tutorial, we'll be creating our Xamarin application in Visual Studio. Follow these steps to create the application:

1. Run the [Visual Studio 2015 installer](https://www.visualstudio.com/), selecting a **Custom** install and checking checking the box under **Cross-Platform Mobile Development > C#/.NET (Xamarin)**. If you already have Visual Studio installed, download and install [Xamarin](http://xamarin.com/platform) directly. For complete instructions for Visual Studio and Xamarin, see [Setup and Install](https://msdn.microsoft.com/library/mt613162.aspx) on MSDN.
3. Open Visual Studio, and select **File > New > Project > Android > Blank App(Android)**.
4. Right-click your project in the Solution Explorer pane and select **Manage NuGet Packages**. Then search for **Azure Storage** and install **Azure Storage 4.4.0-preview**.

You should now have an application that allows you to click a button and increment a counter.

## Use the shared access signature to perform container operations

Next, add code to perform a series of container operations using the SAS URI that you generated.

First add the following **using** statements:

	using System.IO;
	using System.Text;
	using System.Threading.Tasks;
	using Microsoft.WindowsAzure.Storage.Blob;


Next, add a line for your SAS token. Replace the `"SAS_URI"` string with the SAS URI that you generated in Azure PowerShell. Then add a line for a call to the `UseContainerSAS` method that we’ll create below. Note that the **async** keyword has been added before the delegate.


	public class MainActivity : Activity
	{
    	int count = 1;
    	string sas = "SAS_URI";
    	protected override void OnCreate(Bundle bundle)
    	{
        	base.OnCreate(bundle);

        	// Set our view from the "main" layout resource
        	SetContentView(Resource.Layout.Main);

        	// Get our button from the layout resource, and attach an event to it
        	Button button = FindViewById<Button>(Resource.Id.MyButton);

        	button.Click += async delegate	{
             	button.Text = string.Format("{0} clicks!", count++);
             	await UseContainerSAS(sas);
         	};
     }

Add a new method, `UseContainerSAS`, under the `OnCreate` method.

	static async Task UseContainerSAS(string sas)
	{
    	//Try performing container operations with the SAS provided.

    	//Return a reference to the container using the SAS URI.
    	CloudBlobContainer container = new CloudBlobContainer(new Uri(sas));
    	string date = DateTime.Now.ToString();
    	try
    	{
        	//Write operation: write a new blob to the container.
        	CloudBlockBlob blob = container.GetBlockBlobReference("sasblob_" + date + ".txt");

        	string blobContent = "This blob was created with a shared access signature granting write permissions to the container. ";
        	MemoryStream msWrite = new
        	MemoryStream(Encoding.UTF8.GetBytes(blobContent));
        	msWrite.Position = 0;
        	using (msWrite)
         	{
             	await blob.UploadFromStreamAsync(msWrite);
         	}
         	Console.WriteLine("Write operation succeeded for SAS " + sas);
         	Console.WriteLine();
     	}
     	catch (Exception e)
     	{
        	Console.WriteLine("Write operation failed for SAS " + sas);
        	Console.WriteLine("Additional error information: " + e.Message);
        	Console.WriteLine();
     	}
     	try
     	{
        	//Read operation: Get a reference to one of the blobs in the container and read it.
        	CloudBlockBlob blob = container.GetBlockBlobReference("sasblob_” + date + “.txt");
        	string data = await blob.DownloadTextAsync();

        	Console.WriteLine("Read operation succeeded for SAS " + sas);
        	Console.WriteLine("Blob contents: " + data);
     	}
     	catch (Exception e)
     	{
        	Console.WriteLine("Additional error information: " + e.Message);
       		Console.WriteLine("Read operation failed for SAS " + sas);
        	Console.WriteLine();
     	}
     	Console.WriteLine();
     	try
     	{
        	//Delete operation: Delete a blob in the container.
         	CloudBlockBlob blob = container.GetBlockBlobReference("sasblob_” + date + “.txt");
         	await blob.DeleteAsync();

         	Console.WriteLine("Delete operation succeeded for SAS " + sas);
         	Console.WriteLine();
     	}
     	catch (Exception e)
     	{
        	Console.WriteLine("Delete operation failed for SAS " + sas);
        	Console.WriteLine("Additional error information: " + e.Message);
        	Console.WriteLine();
     	}
	}

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
