---
title: Create data pipelines by using Azure .NET SDK | Microsoft Docs
description: Learn how to programmatically create, monitor, and manage Azure data factories by using Data Factory SDK.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.assetid: b0a357be-3040-4789-831e-0d0a32a0bda5
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/11/2017
ms.author: spelluru

---
# Create, monitor, and manage Azure data factories using Azure Data Factory .NET SDK
## Overview
You can create, monitor, and manage Azure data factories programmatically using Data Factory .NET SDK. This article contains a walkthrough that you can follow to create a sample .NET console application that creates and monitors a data factory. See [Data Factory Class Library Reference](https://msdn.microsoft.com/library/mt415893.aspx) for details about Data Factory .NET SDK.

## Prerequisites
* Visual Studio 2012 or 2013 or 2015
* Download and install [Azure .NET SDK](http://azure.microsoft.com/downloads/).
* Add a native client application to Azure Active Directory. See [Integrating applications with Azure Active Directory](../active-directory/active-directory-integrating-applications.md) for steps to add the application. Note down the **CLIENT ID** and **REDIRECT URI** on the **CONFIGURE** page. See [Copy Activity tutorial using .NET API](data-factory-copy-activity-tutorial-using-dotnet-api.md) article for detailed steps. 
* Get your Azure **subscription ID** and **tenant ID**. See [Get Azure subscription and tenant IDs](#get-azure-subscription-and-tenant-ids) for instructions.
* Download and install NuGet packages for Azure Data Factory. Instructions are in the walkthrough.

## Walkthrough
1. Using Visual Studio 2012 or 2013, create a C# .NET console application.
   1. Launch **Visual Studio 2012/2013/2015**.
   2. Click **File**, point to **New**, and click **Project**.
   3. Expand **Templates**, and select **Visual C#**. In this walkthrough, you use C#, but you can use any .NET language.
   4. Select **Console Application** from the list of project types on the right.
   5. Enter **DataFactoryAPITestApp** for the **Name**.
   6. Select **C:\ADFGetStarted** for the **Location**.
   7. Click **OK** to create the project.
2. Click **Tools**, point to **NuGet Package Manager**, and click **Package Manager Console**.
3. In the **Package Manager Console**, execute the following commands one-by-one.

	```
	Install-Package Microsoft.Azure.Management.DataFactories
	Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -Version 2.19.208020213
	```
4. Add the following **appSetttings** section to the **App.config** file. These configuration values are used by the **GetAuthorizationHeader** method.

   > [!IMPORTANT]
   > Replace values for **AdfClientId**, **RedirectUri**, **SubscriptionId**, and **ActiveDirectoryTenantId** with your own values.

	```XML
	<appSettings>
	    <add key="ActiveDirectoryEndpoint" value="https://login.windows.net/" />
	    <add key="ResourceManagerEndpoint" value="https://management.azure.com/" />
	    <add key="WindowsManagementUri" value="https://management.core.windows.net/" />
	
	    <!-- Replace the following values with your own -->
	    <add key="AdfClientId" value="Your AAD application ID" />
	    <add key="RedirectUri" value="Your AAD application's redirect URI" />
	    <add key="SubscriptionId" value="your subscription ID" />
	    <add key="ActiveDirectoryTenantId" value="your tenant ID" />
	</appSettings>
	```
5. Add the following **using** statements to the source file (Program.cs) in the project.

	```csharp
    using System.Configuration;
    using System.Collections.ObjectModel;
    using System.Threading;
    using System.Threading.Tasks;

    using Microsoft.Azure;
    using Microsoft.Azure.Management.DataFactories;
    using Microsoft.Azure.Management.DataFactories.Models;
    using Microsoft.Azure.Management.DataFactories.Common.Models;

    using Microsoft.IdentityModel.Clients.ActiveDirectory;

	```
6. Add the following code that creates an instance of **DataPipelineManagementClient** class to the **Main** method. You use this object to create a data factory, a linked service, input and output datasets, and a pipeline. You also use this object to monitor slices of a dataset at runtime.

	```csharp
	// create data factory management client
	string resourceGroupName = "resourcegroupname";
	string dataFactoryName = "APITutorialFactorySP";
	
	TokenCloudCredentials aadTokenCredentials = new TokenCloudCredentials(
            ConfigurationManager.AppSettings["SubscriptionId"],
	    GetAuthorizationHeader().Result);
	
	Uri resourceManagerUri = new Uri(ConfigurationManager.AppSettings["ResourceManagerEndpoint"]);
	
	DataFactoryManagementClient client = new DataFactoryManagementClient(aadTokenCredentials, resourceManagerUri);
	```

   > [!NOTE]
   > Replace the **resourcegroupname** with the name of your Azure resource group. You can create a resource group using the [New-AzureResourceGroup](/powershell/module/azure/new-azureresourcegroup?view=azuresmps-3.7.0) cmdlet.
7. Add the following code that creates a **data factory** to the **Main** method.

	```csharp
	// create a data factory
	Console.WriteLine("Creating a data factory");
	client.DataFactories.CreateOrUpdate(resourceGroupName,
	    new DataFactoryCreateOrUpdateParameters()
	    {
	        DataFactory = new DataFactory()
	        {
	            Name = dataFactoryName,
	            Location = "westus",
	            Properties = new DataFactoryProperties()
	        }
	    }
	);
	```
8. Add the following code that creates a **linked service** to the **Main** method.

   > [!NOTE]
   > Use **account name** and **account key** of your Azure storage account for the **ConnectionString**.

	```csharp
	// create a linked service
	Console.WriteLine("Creating a linked service");
	client.LinkedServices.CreateOrUpdate(resourceGroupName, dataFactoryName,
	    new LinkedServiceCreateOrUpdateParameters()
	    {
	        LinkedService = new LinkedService()
	        {
	            Name = "LinkedService-AzureStorage",
	            Properties = new LinkedServiceProperties
	            (
	                new AzureStorageLinkedService("DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>")
	            )
	        }
	    }
	);
	```
9. Add the following code that creates **input and output datasets** to the **Main** method.

    The **FolderPath** for the input blob is set to **adftutorial/** where **adftutorial** is the name of the container in your blob storage. If this container does not exist in your Azure blob storage, create a container with this name: **adftutorial** and upload a text file to the container.

    The FolderPath for the output blob is set to: **adftutorial/apifactoryoutput/{Slice}** where **Slice** is dynamically calculated based on the value of **SliceStart** (start date-time of each slice.)

	```csharp
	// create input and output datasets
	Console.WriteLine("Creating input and output datasets");
	string Dataset_Source = "DatasetBlobSource";
	string Dataset_Destination = "DatasetBlobDestination";
	
	client.Datasets.CreateOrUpdate(resourceGroupName, dataFactoryName,
	new DatasetCreateOrUpdateParameters()
	{
	    Dataset = new Dataset()
	    {
	        Name = Dataset_Source,
	        Properties = new DatasetProperties()
	        {
	            LinkedServiceName = "LinkedService-AzureStorage",
	            TypeProperties = new AzureBlobDataset()
	            {
	                FolderPath = "adftutorial/",
	                FileName = "emp.txt"
	            },
	            External = true,
	            Availability = new Availability()
	            {
	                Frequency = SchedulePeriod.Hour,
	                Interval = 1,
	            },
	
	            Policy = new Policy()
	            {
	                Validation = new ValidationPolicy()
	                {
	                    MinimumRows = 1
	                }
	            }
	        }
	    }
	});
	
	client.Datasets.CreateOrUpdate(resourceGroupName, dataFactoryName,
	new DatasetCreateOrUpdateParameters()
	{
	    Dataset = new Dataset()
	    {
	        Name = Dataset_Destination,
	        Properties = new DatasetProperties()
	        {
	
	            LinkedServiceName = "LinkedService-AzureStorage",
	            TypeProperties = new AzureBlobDataset()
	            {
	                FolderPath = "adftutorial/apifactoryoutput/{Slice}",
	                PartitionedBy = new Collection<Partition>()
	                {
	                    new Partition()
	                    {
	                        Name = "Slice",
	                        Value = new DateTimePartitionValue()
	                        {
	                            Date = "SliceStart",
	                            Format = "yyyyMMdd-HH"
	                        }
	                    }
	                }
	            },
	
	            Availability = new Availability()
	            {
	                Frequency = SchedulePeriod.Hour,
	                Interval = 1,
	            },
	        }
	    }
	});
	```
10. Add the following code that **creates and activates a pipeline** to the **Main** method. This pipeline has a **CopyActivity** that takes **BlobSource** as a source and **BlobSink** as a sink.

    The Copy Activity performs the data movement in Azure Data Factory. The activity is powered by a globally available service that can copy data between various data stores in a secure, reliable, and scalable way. See [Data Movement Activities](data-factory-data-movement-activities.md) article for details about the Copy Activity.

	```csharp
	// create a pipeline
	Console.WriteLine("Creating a pipeline");
	DateTime PipelineActivePeriodStartTime = new DateTime(2014, 8, 9, 0, 0, 0, 0, DateTimeKind.Utc);
	DateTime PipelineActivePeriodEndTime = PipelineActivePeriodStartTime.AddMinutes(60);
	string PipelineName = "PipelineBlobSample";
	
	client.Pipelines.CreateOrUpdate(resourceGroupName, dataFactoryName,
	new PipelineCreateOrUpdateParameters()
	{
	    Pipeline = new Pipeline()
	    {
	        Name = PipelineName,
	        Properties = new PipelineProperties()
	        {
	            Description = "Demo Pipeline for data transfer between blobs",
	
	            // Initial value for pipeline's active period. With this, you won't need to set slice status
	            Start = PipelineActivePeriodStartTime,
	            End = PipelineActivePeriodEndTime,
	
	            Activities = new List<Activity>()
	            {
	                new Activity()
	                {
	                    Name = "BlobToBlob",
	                    Inputs = new List<ActivityInput>()
	                    {
	                        new ActivityInput()
				{
	                            Name = Dataset_Source
	                        }
	                    },
	                    Outputs = new List<ActivityOutput>()
	                    {
	                        new ActivityOutput()
	                        {
	                            Name = Dataset_Destination
	                        }
	                    },
	                    TypeProperties = new CopyActivity()
	                    {
	                        Source = new BlobSource(),
	                        Sink = new BlobSink()
	                        {
	                            WriteBatchSize = 10000,
	                            WriteBatchTimeout = TimeSpan.FromMinutes(10)
	                        }
	                    }
	                }
	
	            },
	        }
	    }
	});
	```
11. Add the following helper method used by the **Main** method to the **Program** class. This method pops a dialog box that that lets you provide **user name** and **password** that you use to log in to Azure portal.

	```csharp
    public static async Task<string> GetAuthorizationHeader()
    {
        var context = new AuthenticationContext(ConfigurationManager.AppSettings["ActiveDirectoryEndpoint"] + ConfigurationManager.AppSettings["ActiveDirectoryTenantId"]);
        AuthenticationResult result = await context.AcquireTokenAsync(
            resource: ConfigurationManager.AppSettings["WindowsManagementUri"],
            clientId: ConfigurationManager.AppSettings["AdfClientId"],
            redirectUri: new Uri(ConfigurationManager.AppSettings["RedirectUri"]),
            promptBehavior: PromptBehavior.Always);

        if (result != null)
            return result.AccessToken;

        throw new InvalidOperationException("Failed to acquire token");
    }
	```
12. Add the following code to the **Main** method to get the status of a data slice of the output dataset. There is only one slice expected in this sample.

	```csharp
	// Pulling status within a timeout threshold
	DateTime start = DateTime.Now;
	bool done = false;
	
	while (DateTime.Now - start < TimeSpan.FromMinutes(5) && !done)
	{
	    Console.WriteLine("Pulling the slice status");
	    // wait before the next status check
	    Thread.Sleep(1000 * 12);
	
	    var datalistResponse = client.DataSlices.List(resourceGroupName, dataFactoryName, Dataset_Destination,
	        new DataSliceListParameters()
	        {
	            DataSliceRangeStartTime = PipelineActivePeriodStartTime.ConvertToISO8601DateTimeString(),
	            DataSliceRangeEndTime = PipelineActivePeriodEndTime.ConvertToISO8601DateTimeString()
	        });
	
	    foreach (DataSlice slice in datalistResponse.DataSlices)
	    {
	        if (slice.State == DataSliceState.Failed || slice.State == DataSliceState.Ready)
	        {
	            Console.WriteLine("Slice execution is done with status: {0}", slice.State);
	            done = true;
	            break;
	        }
	        else
	        {
	            Console.WriteLine("Slice status is: {0}", slice.State);
	        }
	    }
	}
	```
13. **(optional)** Add the following code to get run details for a data slice to the **Main** method.

	```csharp
	Console.WriteLine("Getting run details of a data slice");
	
	// give it a few minutes for the output slice to be ready
	Console.WriteLine("\nGive it a few minutes for the output slice to be ready and press any key.");
	Console.ReadKey();
	
	var datasliceRunListResponse = client.DataSliceRuns.List(
	    resourceGroupName,
	    dataFactoryName,
	    Dataset_Destination,
	    new DataSliceRunListParameters()
	    {
	        DataSliceStartTime = PipelineActivePeriodStartTime.ConvertToISO8601DateTimeString()
	    });
	
	foreach (DataSliceRun run in datasliceRunListResponse.DataSliceRuns)
	{
	    Console.WriteLine("Status: \t\t{0}", run.Status);
	    Console.WriteLine("DataSliceStart: \t{0}", run.DataSliceStart);
	    Console.WriteLine("DataSliceEnd: \t\t{0}", run.DataSliceEnd);
	    Console.WriteLine("ActivityId: \t\t{0}", run.ActivityName);
	    Console.WriteLine("ProcessingStartTime: \t{0}", run.ProcessingStartTime);
	    Console.WriteLine("ProcessingEndTime: \t{0}", run.ProcessingEndTime);
	    Console.WriteLine("ErrorMessage: \t{0}", run.ErrorMessage);
	}
	
	Console.WriteLine("\nPress any key to exit.");
	Console.ReadKey();
	```
14. In the Solution Explorer, expand the project: **DataFactoryAPITestApp**, right-click **References**, and click **Add Reference**. Select check box for `System.Configuration` assembly and click **OK**.
15. Build the console application. Click **Build** on the menu and click **Build Solution**.
16. Confirm that there is at least one file in the adftutorial container in your Azure blob storage. If not, create Emp.txt file in Notepad with the following content and upload it to the adftutorial container.

	```
    John, Doe
    Jane, Doe
	```
17. Run the sample by clicking **Debug** -> **Start Debugging** on the menu. When you see the **Getting run details of a data slice**, wait for a few minutes, and press **ENTER**.
18. Use the Azure portal to verify that the data factory **APITutorialFactory** is created with the following artifacts:
    * Linked service: **LinkedService_AzureStorage**
    * Dataset: **DatasetBlobSource** and **DatasetBlobDestination**.
    * Pipeline: **PipelineBlobSample**
19. Verify that an output file is created in the **apifactoryoutput** folder in the **adftutorial** container.

## Log in without popup dialog box
The sample code in the walkthrough launches a dialog box for you to enter Azure credentials. If you need to sign in programmatically without using a dialog-box, see [Authenticating a service principal with Azure Resource Manager](../azure-resource-manager/resource-group-authenticate-service-principal.md).

> [!IMPORTANT]
> Add a Web application to Azure Active Directory and note down the client ID and client secret of the application.
>
>

### Example
Create GetAuthorizationHeaderNoPopup method.

```csharp
public static async Task<string> GetAuthorizationHeaderNoPopup()
{
    var authority = new Uri(new Uri("https://login.windows.net"), ConfigurationManager.AppSettings["ActiveDirectoryTenantId"]);
    var context = new AuthenticationContext(authority.AbsoluteUri);
    var credential = new ClientCredential(
        ConfigurationManager.AppSettings["AdfClientId"],
	ConfigurationManager.AppSettings["AdfClientSecret"]);
    
    AuthenticationResult result = await context.AcquireTokenAsync(
        ConfigurationManager.AppSettings["WindowsManagementUri"],
	credential);

    if (result != null)
        return result.AccessToken;

    throw new InvalidOperationException("Failed to acquire token");
}
```

Replace **GetAuthorizationHeader** call with a call to **GetAuthorizationHeaderNoPopup** in the **Main** function:

```csharp
TokenCloudCredentials aadTokenCredentials =
    new TokenCloudCredentials(
    ConfigurationManager.AppSettings["SubscriptionId"],
    GetAuthorizationHeaderNoPopup().Result);
```

Here is how you can create the Active Directory application, service principal, and then assign it to the Data Factory Contributor role:

1. Create the AD application.

	```PowerShell
	$azureAdApplication = New-AzureRmADApplication -DisplayName "MyADAppForADF" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.myadappforadf.org/example" -Password "Pass@word1"
	```
2. Create the AD service principal.

	```PowerShell
    New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId
	```
3. Add service principal to the Data Factory Contributor role.

	```PowerShell
    New-AzureRmRoleAssignment -RoleDefinitionName "Data Factory Contributor" -ServicePrincipalName $azureAdApplication.ApplicationId.Guid
	```
4. Get the application ID.

	```PowerShell
	$azureAdApplication
	```

Note down the application ID and the password (client secret) and use it in the walkthrough.

## Get a list of failed data slices 

```csharp
// Parse the resource path
var ResourceGroupName = "ADFTutorialResourceGroup";
var DataFactoryName = "DataFactoryAPITestApp";

var parameters = new ActivityWindowsByDataFactoryListParameters(ResourceGroupName, DataFactoryName);
parameters.WindowState = "Failed";
var response = dataFactoryManagementClient.ActivityWindows.List(parameters);
do
{
	foreach (var activityWindow in response.ActivityWindowListResponseValue.ActivityWindows)
	{
		var row = string.Join(
			"\t",
			activityWindow.WindowStart.ToString(),
			activityWindow.WindowEnd.ToString(),
			activityWindow.RunStart.ToString(),
			activityWindow.RunEnd.ToString(),
			activityWindow.DataFactoryName,
			activityWindow.PipelineName,
			activityWindow.ActivityName,
			string.Join(",", activityWindow.OutputDatasets));
		Console.WriteLine(row);
	}

	if (response.NextLink != null)
	{
		response = dataFactoryManagementClient.ActivityWindows.ListNext(response.NextLink, parameters);
	}
	else
	{
		response = null;
	}
}
while (response != null);
```


## Get Azure subscription and tenant IDs
If you do not have latest version of PowerShell installed on your machine, follow instructions in [How to install and configure Azure PowerShell](/powershell/azure/overview) article to install it.

1. Start Azure PowerShell and run the following command
2. Run the following command and enter the user name and password that you use to sign in to the Azure portal.

	```PowerShell
	Login-AzureRmAccount
	```

    If you have only one Azure subscription associated with this account, you do not need to perform the next two steps.
3. Run the following command to view all the subscriptions for this account.

	```PowerShell
	Get-AzureRmSubscription
	```
4. Run the following command to select the subscription that you want to work with. Replace **NameOfAzureSubscription** with the name of your Azure subscription.

	```PowerShell
    Get-AzureRmSubscription -SubscriptionName NameOfAzureSubscription | Set-AzureRmContext
	```PowerShell

Note down the **SubscriptionId** and **TenantId** values.
