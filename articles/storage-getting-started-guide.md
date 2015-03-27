<properties 
	pageTitle="Get started with Azure Blobs, Tables, and Queues in 5 minutes" 
	description="Learn how to quickly ramp up on Microsoft Azure Blobs, Table, and Queues using Azure QuickStarts and Visual Studio." 
	services="storage" 
	documentationCenter=".net" 
	authors="Selcin" 
	manager="adinah" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="hero-article" 
	ms.date="02/18/2015" 
	ms.author="selcint"/>

# Get started with Azure Blobs, Tables, and Queues in 5 minutes 

This tutorial shows you how to quickly program against **Azure Storage Blobs**, **Tables**, and **Queues** by developing a simple Azure application in Visual Studio. 

The tutorial includes two main scenarios for a quick ramp up on Azure Storage:

- Run your first Azure Storage application on Azure Storage Emulator
- Run your first Azure Storage application on Azure Storage Service

If you want to learn about Azure Storage before diving into the code, see [Next Steps](#next-steps).

## Run your first Azure Storage application on the Azure Storage Emulator

This section demonstrates how to program against **Azure Storage Blobs**, **Tables**, and **Queues** by developing a sample application accessing [Azure Storage Emulator](https://msdn.microsoft.com/library/azure/hh403989.aspx). The Microsoft Azure storage emulator provides a local environment that emulates the Azure Blob, Queue, and Table services for development purposes. Using the storage emulator, you can test your application against the storage services locally, without incurring any cost.

To complete this section, make sure to perform the following prerequisite tasks first:

1. To compile and build the application, you need to have [Visual Studio](http://www.visualstudio.com/visual-studio-homepage-vs.aspx) installed on your computer. If you don't have Visual Studio installed, you can install Visual Studio Express for Web when you install the [Azure SDK 2.5 for Visual Studio 2013](http://go.microsoft.com/fwlink/?linkid=324322&clcid=0x409) or later. 
2. Make sure you have [Azure SDK 2.5 for Visual Studio 2013](http://go.microsoft.com/fwlink/?linkid=324322&clcid=0x409) or later installed on your computer as it includes the Azure QuickStart sample projects and [Azure Storage Client Library for .NET](https://msdn.microsoft.com/library/azure/wa_storage_30_reference_home.aspx).  
3. Check if you have [.NET Framework 4.5](http://www.microsoft.com/download/details.aspx?id=30653) installed on your computer as the Azure QuickStart sample projects need it. If you are not sure which version of .NET Framework is installed in your computer, see [How to: Determine Which .NET Framework Versions Are Installed](https://msdn.microsoft.com/vstudio/hh925568.aspx). Or, press the **Start** button or the Windows key, type **Control Panel**. Then, click **Programs** > **Programs and Features**. See if the .NET Framework 4.5 is listed among all the installed programs.

Now, let’s create a simple Azure Storage application using one of the Azure QuickStarts sample projects in Visual Studio. This tutorial focuses on **Azure Blob Storage**, **Azure Table Storage**, and **Azure Storage Queues** sample projects. For each sample project, the following instructions apply except that you choose a different template in Step 3.a:

1. Press the **Start** button or the Windows key, type Visual Studio 2013 or VS Express 2013 for Web. Click the program to start.
2. From the **File** menu, click **New Project**.
3. In the **New Project** dialog box, click **Installed** > **Templates** > **Visual C#** > **Cloud** > **Quick Starts** > **Data Services**.
	- 3.a.  Choose one of the following templates: Azure Blob Storage, Azure Table Storage, or Azure Storage Queues. 
	- 3.b. Make sure that **.NET Framework 4.5** is selected as the target framework.	
	- 3.c. Depending on the template you choose, name the application, such as **DataBlobStorage**, **DataTableStorage**, or **DataStorageQueue**. Click **OK**. This should create a new Visual Studio solution. See the following screenshot as an example:
	
	![Azure QuickStarts][Image1]

We encourage you to review the source code to learn how to program against Azure Storage before running the application. To review the code, select **Solution Explorer** on the **View** menu in Visual Studio. Then, double click the Program.cs file. 

Now, run the sample application by using the [Azure Storage Emulator](https://msdn.microsoft.com/library/azure/hh403989.aspx) that installs as part of the Azure SDK:

1.	Start the Azure Storage emulator: Press the **Start** button or the Windows key, search for it by typing Azure Storage emulator. Select it from the list of applications to start it.
2.	In Visual Studio, click **Build Solution** on the **Build** menu. 
3.	On the **Debug** menu, Press **F11** to run the solution step by step or press **F5** to run the solution.

## Run your first Azure Storage application on Azure Storage in the cloud
This section demonstrates how to program against **Azure Storage Blobs**, **Tables**, and **Queues** by developing a sample application accessing the [Azure Storage Service](http://azure.microsoft.com/documentation/services/storage/).

To complete this section, make sure to perform the following prerequisite tasks first:

1. To compile and build the application, you need to have [Visual Studio](http://www.visualstudio.com/visual-studio-homepage-vs.aspx) installed on your computer. If you don't have Visual Studio installed, you can install Visual Studio Express for Web when you install the [Azure SDK 2.5 for Visual Studio 2013](http://go.microsoft.com/fwlink/?linkid=324322&clcid=0x409) or later. 
2. Make sure you have [Azure SDK 2.5 for Visual Studio 2013](http://go.microsoft.com/fwlink/?linkid=324322&clcid=0x409) or later installed on your computer as it includes the Azure QuickStart sample projects and [Azure Storage Client Library for .NET](https://msdn.microsoft.com/library/azure/wa_storage_30_reference_home.aspx).  
3. Check if you have [.NET Framework 4.5](http://www.microsoft.com/download/details.aspx?id=30653) installed on your computer as the Azure QuickStart sample projects need it. If you are not sure which version of .NET Framework is installed in your computer, see [How to: Determine Which .NET Framework Versions Are Installed](https://msdn.microsoft.com/vstudio/hh925568.aspx). Or, press the **Start** button or the Windows key, type **Control Panel**. Then, click **Programs** > **Programs and Features**. See if the .NET Framework 4.5 is listed among all the installed programs.
4.	Get an Azure subscription (if you don’t have one yet) and also create a **Standard Storage** account:
	- To get an Azure subscription, see [Free Trial](http://azure.microsoft.com/pricing/free-trial/), [Purchase Options](http://azure.microsoft.com/pricing/purchase-options/), and [Member Offers](http://azure.microsoft.com/pricing/member-offers/) (for members of MSDN, Microsoft Partner Network, and BizSpark, and other Microsoft programs).
	- To create a **Standard Storage** account in Azure, see [How to create, manage, or delete a storage account](./storage-create-storage-account.md). **Note:** There are two types of storage accounts in Azure: Standard Storage account and Premium Storage account. A standard storage account provides access to Azure Blob, Table, and Queue storage. A premium storage account is currently available only for storing data on disks used by Azure Virtual Machines. For more information, see [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](./storage-premium-storage-preview-portal.md).

Now, let’s create a simple Azure Storage application using one of the Azure QuickStarts sample projects in Visual Studio. This tutorial focuses on **Azure Blob Storage**, **Azure Table Storage**, and **Azure Storage Queues** sample projects. For each sample project, the following instructions apply except that you choose a different template in Step 3.a:

1. Press the **Start** button or the Windows key, type Visual Studio 2013 or VS Express 2013 for Web. Click the program to start.
2. From the **File** menu, click **New Project**.
3. In the **New Project** dialog box, click **Installed** > **Templates** > **Visual C#** > **Cloud** > **Quick Starts** > **Data Services**.
	- 3.a. Choose one of the following templates: Azure Blob Storage, Azure Table Storage, or Azure Storage Queues. 
	- 3.b. Make sure that **.NET Framework 4.5** is selected as the target framework.
	- 3.c. Depending on the template you choose, name the application, such as **DataBlobStorage**, **DataTableStorage**, or **DataStorageQueue**. Click **OK**. This should create a new Visual Studio solution. 

We encourage you to review the source code to learn how to program against Azure Storage before running the application. To review the code, select **Solution Explorer** on the **View** menu in Visual Studio. Then, double click the Program.cs file. 

Now, run the sample application:

1.	In Visual Studio, select **Solution Explorer** on the **View** menu. Double click the App.config file and comment out the connection string for the Azure SDK Storage Emulator: 

	`<!--<add key="StorageConnectionString" value = "UseDevelopmentStorage=true;"/>-->`

2.	Uncomment the connection string for the Azure Storage Service and provide the storage account name and access key in the App.config file:
	`<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[AccountKey]"` 

	To find the storage account name and access key, see [What is a Storage Account](storage-whatis-account.md). 

3.	After you provide the storage account name and access key in the App.config file, on the **File** menu, click **Save All** to save all the project files. 
4.	On the **Build** menu, click **Build Solution**. 
5.	On the **Debug** menu, Press **F11** to run the solution step by step or press **F5** to run the solution.


## Next Steps
In this tutorial, you've learned how to program against Azure Blob Storage, Azure Table Storage, and Azure Storage Queues. 

If you want to learn more about them, follow these links:

* [Introduction to Microsoft Azure Storage](storage-introduction.md)
* [How to use Blob Storage from .NET](storage-dotnet-how-to-use-blobs.md)
* [How to use Table Storage from .NET](storage-dotnet-how-to-use-tables.md)
* [How to use Queue Storage from .NET](storage-dotnet-how-to-use-queues.md)
* [Azure Storage Documentation](http://azure.microsoft.com/documentation/services/storage/)
* [Azure Storage MSDN Reference](http://msdn.microsoft.com/library/azure/gg433040.aspx)
* [Azure Storage Client Library](https://msdn.microsoft.com/library/azure/wa_storage_30_reference_home.aspx)
* [Azure Storage REST API](https://msdn.microsoft.com/library/azure/dd179355.aspx)

[Image1]: ./media/storage-getting-started-guide/QuickStart.png

