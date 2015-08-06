<properties 
	pageTitle="Get started with Azure Storage in five minutes | Microsoft Azure" 
	description="Quickly ramp up on Microsoft Azure Blobs, Table, and Queues using Azure QuickStarts, Visual Studio, and the Azure Storage emulator. Run your first Azure Storage application in five minutes." 
	services="storage" 
	documentationCenter=".net" 
	authors="tamram" 
	manager="adinah" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="05/28/2015" 
	ms.author="tamram;selcint"/>

# Get started with Azure Storage in five minutes 

It's easy to get started developing against Azure Storage. This tutorial shows you how to get an Azure Storage application up and running quickly. 
We'll demonstrate two scenarios for easily ramping up on Azure Storage:

- [Run your first Azure Storage application locally against the Azure Storage Emulator](#run-your-first-azure-storage-application-locally-against-the-azure-storage-emulator)
- [Run your first Azure Storage application against Azure Storage in the cloud](#run-your-first-azure-storage-application-against-azure-storage-in-the-cloud)

If you want to learn more about Azure Storage before diving into the code, see [Next Steps](#next-steps).

## Prerequisites

Make sure you have the following prerequisites before you start:

1. To compile and build the application, you'll need a version of [Visual Studio](https://www.visualstudio.com/) installed on your computer. 
2. Install the latest version [Azure SDK for .NET](http://azure.microsoft.com/downloads/). The SDK includes the Azure QuickStart sample projects, the Azure storage emulator, and the [Azure Storage Client Library for .NET](https://msdn.microsoft.com/library/azure/wa_storage_30_reference_home.aspx).
3. Make sure that you have [.NET Framework 4.5](http://www.microsoft.com/download/details.aspx?id=30653) installed on your computer, as it is required by the Azure QuickStart sample projects that we'll be using in this tutorial. If you are not sure which version of .NET Framework is installed in your computer, see [How to: Determine Which .NET Framework Versions Are Installed](https://msdn.microsoft.com/vstudio/hh925568.aspx). Or, press the **Start** button or the Windows key, type **Control Panel**. Then, click **Programs** > **Programs and Features**, and determine whether the .NET Framework 4.5 is listed among the installed programs.

The latest version of the Azure Storage Client Library binaries is available on [NuGet](https://www.nuget.org/packages/WindowsAzure.Storage/).


## Run your first Azure Storage application locally against the Azure Storage Emulator

When developing an application that uses Azure Storage, you can run against the [Azure Storage Emulator](storage-use-emulator.md). The storage emulator provides a local environment that emulates the Azure Blob, Queue, and Table services for development purposes. You can use the storage emulator to test your storage application locally, without creating an Azure subscription or storage account, and without incurring any cost.

To try it, let’s create a simple Azure Storage application using one of the Azure QuickStarts sample projects in Visual Studio. This tutorial focuses on the **Azure Blob Storage**, **Azure Table Storage**, and **Azure Queue Storage** sample projects:

1. Start Visual Studio.
2. From the **File** menu, click **New Project**.
3. In the **New Project** dialog box, click **Installed** > **Templates** > **Visual C#** > **Cloud** > **Quick Starts** > **Data Services**.
	- 3.a.  Choose one of the following templates: Azure Blob Storage, Azure Table Storage, or Azure Storage Queues. 
	- 3.b. Make sure that **.NET Framework 4.5** is selected as the target framework.	
	- 3.c. Specify a name for your project and create the new Visual Studio solution, as shown:
	
	![Azure QuickStarts][Image1]

You may want to review the source code before running the application. To review the code, select **Solution Explorer** on the **View** menu in Visual Studio. Then, double click the Program.cs file. 

Next, run the sample application in the Azure Storage Emulator:

1.	Press the **Start** button or the Windows key, search for *Azure Storage emulator*, and start the application.
2.	In Visual Studio, click **Build Solution** on the **Build** menu. 
3.	On the **Debug** menu, Press **F11** to run the solution step by step, or press **F5** to run the solution from start to finish.

## Run your first Azure Storage application against Azure Storage in the cloud

To run against Azure Storage in the cloud, you'll need an Azure subscription and a storage account, if you don't have one already: 

- To get an Azure subscription, see [Free Trial](http://azure.microsoft.com/pricing/free-trial/), [Purchase Options](http://azure.microsoft.com/pricing/purchase-options/), and [Member Offers](http://azure.microsoft.com/pricing/member-offers/) (for members of MSDN, Microsoft Partner Network, and BizSpark, and other Microsoft programs).
- To create a storage account in Azure, see [How to create, manage, or delete a storage account](storage-create-storage-account.md).

Once you have an account, you can create a simple Azure Storage application using one of the Azure QuickStarts sample projects in Visual Studio. This tutorial focuses on **Azure Blob Storage**, **Azure Table Storage**, and **Azure Queue Storage** sample projects:

1. Start Visual Studio.
2. From the **File** menu, click **New Project**.
3. In the **New Project** dialog box, click **Installed** > **Templates** > **Visual C#** > **Cloud** > **Quick Starts** > **Data Services**.
	- 3.a. Choose one of the following templates: Azure Blob Storage, Azure Table Storage, or Azure Storage Queues.
	- 3.b. Make sure that **.NET Framework 4.5** is selected as the target framework.
	- 3.c. Specify a name for your project and create the new Visual Studio solution. 

You may want to review the source code before running the application. To review the code, select **Solution Explorer** on the **View** menu in Visual Studio. Then, double click the Program.cs file. 

Next, run the sample application:

1.	In Visual Studio, select **Solution Explorer** on the **View** menu. Double click the App.config file and comment out the connection string for the Azure SDK Storage Emulator:

	`<!--<add key="StorageConnectionString" value = "UseDevelopmentStorage=true;"/>-->`

2.	Uncomment the connection string for the Azure Storage Service and provide the storage account name and access key in the App.config file:
	`<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[AccountKey]"`

	To find the storage account name and access key, see [What is a Storage Account](storage-whatis-account.md).

3.	After you provide the storage account name and access key in the App.config file, on the **File** menu, click **Save All** to save all the project files.
4.	On the **Build** menu, click **Build Solution**.
5.	On the **Debug** menu, Press **F11** to run the solution step by step or press **F5** to run the solution.


## Next Steps

See these resources to learn more about Azure Storage:

* [Introduction to Microsoft Azure Storage](storage-introduction.md)
* [How to use Blob Storage from .NET](storage-dotnet-how-to-use-blobs.md)
* [How to use Table Storage from .NET](storage-dotnet-how-to-use-tables.md)
* [How to use Queue Storage from .NET](storage-dotnet-how-to-use-queues.md)
* [Azure Storage Documentation](http://azure.microsoft.com/documentation/services/storage/)
* [Azure Storage Client Library](https://msdn.microsoft.com/library/azure/wa_storage_30_reference_home.aspx)
* [Azure Storage REST API](https://msdn.microsoft.com/library/azure/dd179355.aspx)

[Image1]: ./media/storage-getting-started-guide/QuickStart.png
 
