---
title: Create data pipelines by using Azure .NET SDK 
description: Learn how to programmatically create, monitor, and manage Azure data factories by using Data Factory SDK.
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.custom: devx-track-csharp, devx-track-azurepowershell, devx-track-dotnet
---

# Create, monitor, and manage Azure data factories using Azure Data Factory .NET SDK
> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [copy activity tutorial](../quickstart-create-data-factory-dot-net.md). 

## Overview
You can create, monitor, and manage Azure data factories programmatically using Data Factory .NET SDK. This article contains a walkthrough that you can follow to create a sample .NET console application that creates and monitors a data factory. 

> [!NOTE]
> This article does not cover all the Data Factory .NET API. See [Data Factory .NET API Reference](/dotnet/api/overview/azure/data-factory) for comprehensive documentation on .NET API for Data Factory. 

## Prerequisites

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

* Visual Studio 2012 or 2013 or 2015
* Download and install [Azure .NET SDK](https://azure.microsoft.com/downloads/).
* Azure PowerShell. Follow instructions in [How to install and configure Azure PowerShell](/powershell/azure/) article to install Azure PowerShell on your computer. You use Azure PowerShell to create an Azure Active Directory application.

### Create an application in Azure Active Directory
Create an Azure Active Directory application, create a service principal for the application, and assign it to the **Data Factory Contributor** role.

1. Launch **PowerShell**.
2. Run the following command and enter the user name and password that you use to sign in to the Azure portal.

    ```powershell
    Connect-AzAccount
    ```
3. Run the following command to view all the subscriptions for this account.

    ```powershell
    Get-AzSubscription
    ```
4. Run the following command to select the subscription that you want to work with. Replace **&lt;NameOfAzureSubscription**&gt; with the name of your Azure subscription.

    ```powershell
    Get-AzSubscription -SubscriptionName <NameOfAzureSubscription> | Set-AzContext
    ```

   > [!IMPORTANT]
   > Note down **SubscriptionId** and **TenantId** from the output of this command.

5. Create an Azure resource group named **ADFTutorialResourceGroup** by running the following command in the PowerShell.

    ```powershell
    New-AzResourceGroup -Name ADFTutorialResourceGroup  -Location "West US"
    ```

    If the resource group already exists, you specify whether to update it (Y) or keep it as (N).

    If you use a different resource group, you need to use the name of your resource group in place of ADFTutorialResourceGroup in this tutorial.
6. Create an Azure Active Directory application.

    ```powershell
    $azureAdApplication = New-AzADApplication -DisplayName "ADFDotNetWalkthroughApp" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.adfdotnetwalkthroughapp.org/example" -Password "Pass@word1"
    ```

    If you get the following error, specify a different URL and run the command again.
    
    ```powershell
    Another object with the same value for property identifierUris already exists.
    ```
7. Create the AD service principal.

    ```powershell
    New-AzADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId
    ```
8. Add service principal to the **Data Factory Contributor** role.

    ```powershell
    New-AzRoleAssignment -RoleDefinitionName "Data Factory Contributor" -ServicePrincipalName $azureAdApplication.ApplicationId.Guid
    ```
9. Get the application ID.

    ```powershell
    $azureAdApplication    
    ```
    Note down the application ID (applicationID) from the output.

You should have following four values from these steps:

* Tenant ID
* Subscription ID
* Application ID
* Password (specified in the first command)

## Walkthrough
In the walkthrough, you create a data factory with a pipeline that contains a copy activity. The copy activity copies data from a folder in your Azure blob storage to another folder in the same blob storage. 

The Copy Activity performs the data movement in Azure Data Factory. The activity is powered by a globally available service that can copy data between various data stores in a secure, reliable, and scalable way. See [Data Movement Activities](data-factory-data-movement-activities.md) article for details about the Copy Activity.

> [!IMPORTANT]
> The [Microsoft.IdentityModel.Clients.ActiveDirectory](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory) NuGet package and Azure AD Authentication Library (ADAL) have been deprecated. No new features have been added since June 30, 2020.   We strongly encourage you to upgrade, see the [migration guide](../../active-directory/develop/msal-migration.md) for more details.

1. Using Visual Studio 2012/2013/2015, create a C# .NET console application.
   1. Launch **Visual Studio** 2012/2013/2015.
   2. Click **File**, point to **New**, and click **Project**.
   3. Expand **Templates**, and select **Visual C#**. In this walkthrough, you use C#, but you can use any .NET language.
   4. Select **Console Application** from the list of project types on the right.
   5. Enter **DataFactoryAPITestApp** for the Name.
   6. Select **C:\ADFGetStarted** for the Location.
   7. Click **OK** to create the project.
2. Click **Tools**, point to **NuGet Package Manager**, and click **Package Manager Console**.
3. In the **Package Manager Console**, do the following steps:
   1. Run the following command to install Data Factory package: `Install-Package Microsoft.Azure.Management.DataFactories`
   2. Run the following command to install Azure Active Directory package (you use Active Directory API in the code): `Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -Version 2.19.208020213`
4. Replace the contents of **App.config** file in the project with the following content: 
    
    ```xml
    <?xml version="1.0" encoding="utf-8" ?>
    <configuration>
        <appSettings>
            <add key="ActiveDirectoryEndpoint" value="https://login.microsoftonline.com/" />
            <add key="ResourceManagerEndpoint" value="https://management.azure.com/" />
            <add key="WindowsManagementUri" value="https://management.core.windows.net/" />

            <add key="ApplicationId" value="your application ID" />
            <add key="Password" value="Password you used while creating the AAD application" />
            <add key="SubscriptionId" value= "Subscription ID" />
            <add key="ActiveDirectoryTenantId" value="Tenant ID" />
        </appSettings>
    </configuration>
    ```
5. In the App.Config file, update values for **&lt;Application ID&gt;**, **&lt;Password&gt;**, **&lt;Subscription ID&gt;**, and **&lt;tenant ID&gt;** with your own values.
6. Add the following **using** statements to the **Program.cs** file in the project.

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

    //IMPORTANT: specify the name of Azure resource group here
    string resourceGroupName = "ADFTutorialResourceGroup";

    //IMPORTANT: the name of the data factory must be globally unique.
    // Therefore, update this value. For example:APITutorialFactory05122017
    string dataFactoryName = "APITutorialFactory";

    TokenCloudCredentials aadTokenCredentials = new TokenCloudCredentials(
            ConfigurationManager.AppSettings["SubscriptionId"],
            GetAuthorizationHeader().Result);

    Uri resourceManagerUri = new Uri(ConfigurationManager.AppSettings["ResourceManagerEndpoint"]);

    DataFactoryManagementClient client = new DataFactoryManagementClient(aadTokenCredentials, resourceManagerUri);
    ```

   > [!IMPORTANT]
   > Replace the value of **resourceGroupName** with the name of your Azure resource group. You can create a resource group using the [New-AzureResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet.
   >
   > Update name of the data factory (dataFactoryName) to be unique. Name of the data factory must be globally unique. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.
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
8. Add the following code that creates an **Azure Storage linked service** to the **Main** method.

   > [!IMPORTANT]
   > Replace **storageaccountname** and **accountkey** with name and key of your Azure Storage account.

    ```csharp
    // create a linked service for input data store: Azure Storage
    Console.WriteLine("Creating Azure Storage linked service");
    client.LinkedServices.CreateOrUpdate(resourceGroupName, dataFactoryName,
        new LinkedServiceCreateOrUpdateParameters()
        {
            LinkedService = new LinkedService()
            {
                Name = "AzureStorageLinkedService",
                Properties = new LinkedServiceProperties
                (
                    new AzureStorageLinkedService("DefaultEndpointsProtocol=https;AccountName=<storageaccountname>;AccountKey=<accountkey>")
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
                LinkedServiceName = "AzureStorageLinkedService",
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
    
                LinkedServiceName = "AzureStorageLinkedService",
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
14. Add the following helper method used by the **Main** method to the **Program** class. This method pops a dialog box that lets you provide **user name** and **password** that you use to log in to Azure portal.

    ```csharp
    public static async Task<string> GetAuthorizationHeader()
    {
        AuthenticationContext context = new AuthenticationContext(ConfigurationManager.AppSettings["ActiveDirectoryEndpoint"] + ConfigurationManager.AppSettings["ActiveDirectoryTenantId"]);
        ClientCredential credential = new ClientCredential(
            ConfigurationManager.AppSettings["ApplicationId"],
            ConfigurationManager.AppSettings["Password"]);
        AuthenticationResult result = await context.AcquireTokenAsync(
            resource: ConfigurationManager.AppSettings["WindowsManagementUri"],
            clientCredential: credential);

        if (result != null)
            return result.AccessToken;

        throw new InvalidOperationException("Failed to acquire token");
    }
    ```

15. In the Solution Explorer, expand the project: **DataFactoryAPITestApp**, right-click **References**, and click **Add Reference**. Select check box for `System.Configuration` assembly and click **OK**.
15. Build the console application. Click **Build** on the menu and click **Build Solution**.
16. Confirm that there is at least one file in the adftutorial container in your Azure blob storage. If not, create Emp.txt file in Notepad with the following content and upload it to the adftutorial container.

    ```
    John, Doe
    Jane, Doe
    ```
17. Run the sample by clicking **Debug** -> **Start Debugging** on the menu. When you see the **Getting run details of a data slice**, wait for a few minutes, and press **ENTER**.
18. Use the Azure portal to verify that the data factory **APITutorialFactory** is created with the following artifacts:
    * Linked service: **AzureStorageLinkedService**
    * Dataset: **DatasetBlobSource** and **DatasetBlobDestination**.
    * Pipeline: **PipelineBlobSample**
19. Verify that an output file is created in the **apifactoryoutput** folder in the **adftutorial** container.

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

## Next steps
See the following example for creating a pipeline using .NET SDK that copies data from an Azure blob storage to Azure SQL Database: 

- [Create a pipeline to copy data from Blob Storage to SQL Database](data-factory-copy-activity-tutorial-using-dotnet-api.md)
