---
title: 'Tutorial: Create a pipeline with Copy Activity using .NET API | Microsoft Docs'
description: In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using .NET API.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.assetid: 58fc4007-b46d-4c8e-a279-cb9e479b3e2b
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/11/2017
ms.author: spelluru

---
# Tutorial: Create a pipeline with Copy Activity using .NET API
> [!div class="op_single_selector"]
> * [Overview and prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Copy Wizard](data-factory-copy-data-wizard-tutorial.md)
> * [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md)
> * [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md)
> * [PowerShell](data-factory-copy-activity-tutorial-using-powershell.md)
> * [Azure Resource Manager template](data-factory-copy-activity-tutorial-using-azure-resource-manager-template.md)
> * [REST API](data-factory-copy-activity-tutorial-using-rest-api.md)
> * [.NET API](data-factory-copy-activity-tutorial-using-dotnet-api.md)

This tutorial shows you how to create and monitor an Azure data factory using the .NET API. The pipeline in the data factory uses a Copy Activity to copy data from Azure Blob Storage to Azure SQL Database.

The Copy Activity performs the data movement in Azure Data Factory. The activity is powered by a globally available service that can copy data between various data stores in a secure, reliable, and scalable way. See [Data Movement Activities](data-factory-data-movement-activities.md) article for details about the Copy Activity.

> [!NOTE]
> This article does not cover all the Data Factory .NET API. See [Data Factory .NET API Reference](https://msdn.microsoft.com/library/mt415893.aspx) for details about Data Factory .NET SDK.
> 
> The data pipeline in this tutorial copies data from a source data store to a destination data store. It does not transform input data to produce output data. For a tutorial on how to transform data using Azure Data Factory, see [Tutorial: Build a pipeline to transform data using Hadoop cluster](data-factory-build-your-first-pipeline.md).


## Prerequisites
* Go through [Tutorial Overview and Pre-requisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) to get an overview of the tutorial and complete the **prerequisite** steps.
* Visual Studio 2012 or 2013 or 2015
* Download and install [Azure .NET SDK](http://azure.microsoft.com/downloads/)
* Azure PowerShell. Follow instructions in [How to install and configure Azure PowerShell](/powershell/azure/overview) article to install Azure PowerShell on your computer. You use Azure PowerShell to create an Azure Active Directory application.

### Create an application in Azure Active Directory
Create an Azure Active Directory application, create a service principal for the application, and assign it to the **Data Factory Contributor** role.

1. Launch **PowerShell**.
2. Run the following command and enter the user name and password that you use to sign in to the Azure portal.

	```PowerShell
	Login-AzureRmAccount
	```
3. Run the following command to view all the subscriptions for this account.

	```PowerShell
	Get-AzureRmSubscription
	```
4. Run the following command to select the subscription that you want to work with. Replace **&lt;NameOfAzureSubscription**&gt; with the name of your Azure subscription.

	```PowerShell
	Get-AzureRmSubscription -SubscriptionName <NameOfAzureSubscription> | Set-AzureRmContext
	```

   > [!IMPORTANT]
   > Note down **SubscriptionId** and **TenantId** from the output of this command.

5. Create an Azure resource group named **ADFTutorialResourceGroup** by running the following command in the PowerShell.

	```PowerShell
	New-AzureRmResourceGroup -Name ADFTutorialResourceGroup  -Location "West US"
	```

    If the resource group already exists, you specify whether to update it (Y) or keep it as (N).

    If you use a different resource group, you need to use the name of your resource group in place of ADFTutorialResourceGroup in this tutorial.
6. Create an Azure Active Directory application.

	```PowerShell
	$azureAdApplication = New-AzureRmADApplication -DisplayName "ADFCopyTutotiralApp" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.adfcopytutorialapp.org/example" -Password "Pass@word1"
	```

    If you get the following error, specify a different URL and run the command again.
	
	```PowerShell
	Another object with the same value for property identifierUris already exists.
	```
7. Create the AD service principal.

	```PowerShell
    New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId
	```
8. Add service principal to the **Data Factory Contributor** role.

	```PowerShell
    New-AzureRmRoleAssignment -RoleDefinitionName "Data Factory Contributor" -ServicePrincipalName $azureAdApplication.ApplicationId.Guid
	```
9. Get the application ID.

	```PowerShell
	$azureAdApplication	
	```
    Note down the application ID (applicationID) from the output.

You should have following four values from these steps:

* Tenant ID
* Subscription ID
* Application ID
* Password (specified in the first command)

## Walkthrough
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
4. Add the following **appSetttings** section to the **App.config** file. These settings are used by the helper method: **GetAuthorizationHeader**.

    Replace values for **&lt;Application ID&gt;**, **&lt;Password&gt;**, **&lt;Subscription ID&gt;**, and **&lt;tenant ID&gt;** with your own values.

    ```xml
    <?xml version="1.0" encoding="utf-8" ?>
    <configuration>
        <appSettings>
            <add key="ActiveDirectoryEndpoint" value="https://login.windows.net/" />
            <add key="ResourceManagerEndpoint" value="https://management.azure.com/" />
            <add key="WindowsManagementUri" value="https://management.core.windows.net/" />

            <add key="ApplicationId" value="your application ID" />
            <add key="Password" value="Password you used while creating the AAD application" />
            <add key="SubscriptionId" value= "Subscription ID" />
            <add key="ActiveDirectoryTenantId" value="Tenant ID" />
        </appSettings>
    </configuration>
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
    string resourceGroupName = "ADFTutorialResourceGroup";
    string dataFactoryName = "APITutorialFactory";

    TokenCloudCredentials aadTokenCredentials = new TokenCloudCredentials(
            ConfigurationManager.AppSettings["SubscriptionId"],
            GetAuthorizationHeader().Result);

    Uri resourceManagerUri = new Uri(ConfigurationManager.AppSettings["ResourceManagerEndpoint"]);

    DataFactoryManagementClient client = new DataFactoryManagementClient(aadTokenCredentials, resourceManagerUri);
    ```

   > [!IMPORTANT]
   > Replace the value of **resourceGroupName** with the name of your Azure resource group.
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

9. Add the following code that creates an **Azure SQL linked service** to the **Main** method.

   > [!IMPORTANT]
   > Replace **servername**, **databasename**, **username**, and **password** with names of your Azure SQL server, database, user, and password.

    ```csharp
    // create a linked service for output data store: Azure SQL Database
    Console.WriteLine("Creating Azure SQL Database linked service");
    client.LinkedServices.CreateOrUpdate(resourceGroupName, dataFactoryName,
        new LinkedServiceCreateOrUpdateParameters()
        {
            LinkedService = new LinkedService()
            {
                Name = "AzureSqlLinkedService",
                Properties = new LinkedServiceProperties
                (
                    new AzureSqlDatabaseLinkedService("Data Source=tcp:<servername>.database.windows.net,1433;Initial Catalog=<databasename>;User ID=<username>;Password=<password>;Integrated Security=False;Encrypt=True;Connect Timeout=30")
                )
            }
        }
    );
    ```

10. Add the following code that creates **input and output datasets** to the **Main** method.

    ```csharp
    // create input and output datasets
    Console.WriteLine("Creating input and output datasets");
    string Dataset_Source = "DatasetBlobSource";
    string Dataset_Destination = "DatasetAzureSqlDestination";

    Console.WriteLine("Creating input dataset of type: Azure Blob");
    client.Datasets.CreateOrUpdate(resourceGroupName, dataFactoryName,

    new DatasetCreateOrUpdateParameters()
    {
        Dataset = new Dataset()
        {
            Name = Dataset_Source,
            Properties = new DatasetProperties()
            {
                Structure = new List<DataElement>()
                {
                    new DataElement() { Name = "FirstName", Type = "String" },
                    new DataElement() { Name = "LastName", Type = "String" }
                },
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

    Console.WriteLine("Creating output dataset of type: Azure SQL");
    client.Datasets.CreateOrUpdate(resourceGroupName, dataFactoryName,
        new DatasetCreateOrUpdateParameters()
        {
            Dataset = new Dataset()
            {
                Name = Dataset_Destination,
                Properties = new DatasetProperties()
                {
                    Structure = new List<DataElement>()
                    {
                        new DataElement() { Name = "FirstName", Type = "String" },
                        new DataElement() { Name = "LastName", Type = "String" }
                    },
                    LinkedServiceName = "AzureSqlLinkedService",
                    TypeProperties = new AzureSqlTableDataset()
                    {
                        TableName = "emp"
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

11. Add the following code that **creates and activates a pipeline** to the **Main** method. This pipeline has a **CopyActivity** that takes **BlobSource** as a source and **BlobSink** as a sink.

    ```csharp
    // create a pipeline
    Console.WriteLine("Creating a pipeline");
    DateTime PipelineActivePeriodStartTime = new DateTime(2016, 8, 9, 0, 0, 0, 0, DateTimeKind.Utc);
    DateTime PipelineActivePeriodEndTime = PipelineActivePeriodStartTime.AddMinutes(60);
    string PipelineName = "ADFTutorialPipeline";

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
                            Name = "BlobToAzureSql",
                            Inputs = new List<ActivityInput>()
                            {
                                new ActivityInput() {
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
                    }
                }
            }
        });
    ```

12. Add the following code to the **Main** method to get the status of a data slice of the output dataset. There is only slice expected in this sample.

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

13. Add the following code to get run details for a data slice to the **Main** method.

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
            }
        );

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

14. Add the following helper method used by the **Main** method to the **Program** class.

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

15. In the Solution Explorer, expand the project (DataFactoryAPITestApp), right-click **References**, and click **Add Reference**. Select check box for **System.Configuration** assembly. and click **OK**.
16. Build the console application. Click **Build** on the menu and click **Build Solution**.
17. Confirm that there is at least one file in the **adftutorial** container in your Azure blob storage. If not, create **Emp.txt** file in Notepad with the following content and upload it to the adftutorial container.

	```
	John, Doe
	Jane, Doe
	```
18. Run the sample by clicking **Debug** -> **Start Debugging** on the menu. When you see the **Getting run details of a data slice**, wait for a few minutes, and press **ENTER**.
19. Use the Azure portal to verify that the data factory **APITutorialFactory** is created with the following artifacts:
   * Linked service: **LinkedService_AzureStorage**
   * Dataset: **DatasetBlobSource** and **DatasetBlobDestination**.
   * Pipeline: **PipelineBlobSample**
20. Verify that the two employee records are created in the **emp** table in the specified Azure SQL database.

## Next Steps
| Topic | Description |
|:--- |:--- |
| [Pipelines](data-factory-create-pipelines.md) |This article helps you understand pipelines and activities in Azure Data Factory. |
| [Datasets](data-factory-create-datasets.md) |This article helps you understand datasets in Azure Data Factory. |
| [Scheduling and execution](data-factory-scheduling-and-execution.md) |This article explains the scheduling and execution aspects of Azure Data Factory application model. |
[Data Factory .NET API Reference](/dotnet/api/) | Provides details about Data Factory .NET SDK (look for Microsoft.Azure.Management.DataFactories.Models in the tree view).
