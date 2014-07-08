<properties linkid="dev-net-how-to-file-storage" urlDisplayName="File Service" pageTitle="How to use file storage from .NET | Microsoft Azure" metaKeywords="Get started Azure file Azure unstructured data   Azure unstructured storage   Azure file   Azure file storage   Azure file .NET   Azure file C#   Azure file C#" description="Learn how to use Microsoft Azure File storage to upload,  download, list, and delete file content. Samples are written in C#." metaCanonical="" disqusComments="1" umbracoNaviHide="1" services="storage" documentationCenter=".NET" title="How to use Microsoft Azure File storage in .NET" authors="tamram" manager="mbaldwin" editor="cgronlun" />

# How to use File Storage from .NET

This getting started guide demonstrates how to perform common scenarios using Azure File storage.

http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409

> [WACOM.NOTE] This guide targets the Azure .NET Storage Client Library 2.x and above. The recommended version is Storage Client Library 4.x, which is available via [NuGet](https://www.nuget.org/packages/WindowsAzure.Storage/) or as part of the [Azure SDK for .NET](/en-us/downloads/). See [How to: Programmatically access File storage][] below for more details on obtaining the Storage Client Library.


##Table of contents

-   [What is File Storage][]
-   [Concepts][]
-   [Create an Azure Storage account][]
-   [Setup a storage connection string][]
-   [How to: Programmatically access File storage][]
-   [How to: Create a container][]
-   [How to: Upload a blob into a container][]
-   [How to: List the blobs in a container][]
-   [How to: Download blobs][]
-   [How to: Delete blobs][]
-   [Next steps][]


about files...

##<a name="create-account"></a><span  class="short-header">Create an account</span>Create an Azure Storage account

[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]

##<a name="create-worker-role"></a><span  class="short-header">Create a worker role in an Azure cloud service</span>Create a worker role in an Azure cloud service

Azure File storage offers shared file storage for applications running in an Azure cloud service or an Azure virtual machine. In this tutorial, we'll create a worker role in an Azure cloud service, and mount a File storage share from within the worker role.

To create an Azure cloud service, you'll need the to download and install the [Azure SDK for .NET](/en-us/downloads/). Once you've got the SDK, follow these steps to create a cloud service that contains a worker role:

1. Open Visual Studio and choose **File**, then **New Project**.

2. In the New Project dialog, select **Installed -> Templates -> Visual C# -> Cloud**, and select the template for Windows Azure Cloud Service. Provide a name for the project and click **OK**.

3. In the New Windows Azure Cloud Service dialog, add a worker role to the project. If desired, rename the worker role, and click **OK** to create your cloud service project.

Next, we'll configure the project to include a connection string that points to your Azure storage account.

##<a name="setup-connection-string"></a><span  class="short-header">Setup a connection string</span>Setup a storage connection string

The Azure Storage Client Library for .NET supports using a storage connection string to configure endpoints and credentials for accessing storage services. We recommend that you maintain your storage connection string in a configuration file, rather than hard-coding it into your application. You have two options for saving your connection string:

- If your application runs in an Azure cloud service, save your connection string using the Azure service configuration system (`*.csdef` and `*.cscfg` files). Since we are building a cloud service to demonstrate File storage, this is the option we will demonstrate in this guide.
- If your application runs on Azure virtual machines, or if you are building .NET applications that will run outside of Azure, save your connection string using the .NET configuration system (e.g. `web.config` or `app.config` file).

Later on in this guide, we will show how to retrieve your connection string from your code.

To configure your connection string for your cloud service:

1. From Solution Explorer in Visual Studio, beneath your cloud service project, open the ServiceDefinition.csdef file. Add a configuration setting named `StorageConfigurationString`. Your ServiceDefinition.csdef file should look similar to the following example:

		<?xml version="1.0" encoding="utf-8"?>
		<ServiceDefinition name="MyCloudService" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" schemaVersion="2014-01.2.3">
		  <WorkerRole name="MyWorkerRole" vmsize="Small">
		    <Imports>
		      <Import moduleName="Diagnostics" />
		    </Imports>
		    <ConfigurationSettings>
		      <Setting name="StorageConfigurationString" />
		    </ConfigurationSettings>
		  </WorkerRole>
		</ServiceDefinition>
	
2. Open the ServiceConfiguration.Cloud.cscfg and ServiceConfiguration.Local.cscfg files, and add a configuration setting for `StorageConfigurationString`. Include your account name for the `AccountName` portion of the configuration setting, and your account key for `AccountKey` portion. Both files should appear similar to the following example:

	    <ServiceConfiguration serviceName="MyCloudService" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration" osFamily="4" osVersion="*" schemaVersion="2014-01.2.3">
			<Role name="MyWorkerRole">
	    		<Instances count="1" />
	    		<ConfigurationSettings>
	      			<Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true" />
	      			<Setting name="StorageConfigurationString" value="DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=jVRj5Dia3dtFjKEz8kWMPTAatkr2gZ2D/13dRzgVRpAmNsqrl6TMPVCdser2yRQKzUO/T72BcAcxdrj/1FAKbg==" />
	    		</ConfigurationSettings>
	      	</Role>
	    </ServiceConfiguration>

You can also configure your storage connection string through the Visual Studio user interface. In Solution Explorer, beneath your cloud service project, right-click on the name of your worker role, and choose **Properties**. On the **Settings** tab, add a connection string that points to your storage account.

## <a name="configure-access"> </a><span  class="short-header">Access programmatically</span>How to: Programmatically access File storage

###Obtaining the assembly

You can use NuGet to obtain the `Microsoft.WindowsAzure.Storage.dll` assembly. Right-click your project in **Solution Explorer** and choose **Manage NuGet Packages**.  Search online for "WindowsAzure.Storage" and click **Install** to install the Azure Storage package and dependencies.

`Microsoft.WindowsAzure.Storage.dll` is also included in the Azure SDK for .NET, which can be downloaded from the <a href="http://www.windowsazure.com/en-us/develop/net/#">.NET Developer Center</a>. The assembly is installed to the `%Program Files%\Microsoft SDKs\Windows Azure\.NET SDK\<sdk-version>\ref\` directory.

###Namespace declarations
Add the following namespace declarations to the top of any C\# file
in which you wish to programmatically access Azure Storage:

    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.File;

Make sure you reference the `Microsoft.WindowsAzure.Storage.dll` assembly.

###Retrieving your connection string
You can use the **CloudStorageAccount** type to represent 
your Storage Account information. If you are using an 
Azure project template and/or have a reference to 
Microsoft.WindowsAzure.CloudConfigurationManager, you 
can you use the **CloudConfigurationManager** type
to retrieve your storage connection string and storage account
information from the Azure service configuration:

    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

If you are creating an application with no reference to Microsoft.WindowsAzure.CloudConfigurationManager, and your connection string is located in the `web.config` or `app.config` as show above, then you can use **ConfigurationManager** to retrieve the connection string.  You will need to add a reference to System.Configuration.dll to your project, and add another namespace declaration for it:

	using System.Configuration;
	...
	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);

A **CloudFileClient** type allows you to retrieve objects that represent
containers and blobs stored within File storage. The
following code creates a **CloudFileClient** object using the storage
account object we retrieved above:

    CloudFileClient fileClient = storageAccount.CreateCloudFileClient();


