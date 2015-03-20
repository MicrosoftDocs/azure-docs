<properties 
	pageTitle="Use Azure Stream Analytics Management .NET SDK | Azure" 
	description="Learn how to use Stream Analytics Management .NET SDK" 
	services="stream-analytics" 
	documentationCenter="" 
	authors="mumian" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="03/05/2015" 
	ms.author="jgao"/>


# Use Azure Stream Analytics Management .NET SDK

[This is prerelease documentation and is subject to change in future releases.] 

Azure Stream Analytics is a fully managed service providing low latency, highly available, scalable complex event processing over streaming data in the cloud. In the preview release,  Stream Analytics enables customers to setup streaming jobs to analyze data streams, and allows customers to drive near real-time analytics.  

This article demonstrates how to use the Azure Stream Analytics Management .NET SDK.


## Prerequisites
Before you begin this article, you must have the following:

- Visual Studio 2012 or 2013.
- Download and install [Azure .NET SDK](http://azure.microsoft.com/downloads/). 
- Create an Azure Resource Group in your subscription. The following is a sample PowerShell script. For PowerShell information, see [Install and configure Azure PowerShell](install-configure-powershell.md);  

		# Configure the PowerShell session to access the Azure resource manager.
		Switch-AzureMode AzureResourceManager

		# Log into your Azure account.
		Add-AzureAccount

		# Select the Azure subscription you want to use to create the resource group.
		Select-AzureSubscription -SubscriptionName <subscription name>

		# Create an Azure source group	
		New-AzureResourceGroup -Name <YOUR RESORUCE GROUP NAME> -Location <LOCATION>

4.	This article assumes you have already set up an input source and output target to use. See [Get Started Using Azure Stream Analytics](stream-analytics-get-started.md) to set up a sample input and/or output to be used by this article.


## Setup a project

1. Create a Visual Studio C# .Net console application.
2. In the Package Manager Console, run the following commands to install the NuGet packages. The first one is the Azure Stream Analytics Management .NET SDK. The second one is the Azure Active Directory client that will be used for authentication.

		Install-Package Microsoft.Azure.Management.StreamAnalytics -Pre
		Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory

4. Add the following appSetttings section to the App.config file.

		<appSettings>
		  <!--CSM Prod related values-->
		  <add key="ActiveDirectoryEndpoint" value="https://login.windows.net/" />
		  <add key="ResourceManagerEndpoint" value="https://management.azure.com/" />
		  <add key="WindowsManagementUri" value="https://management.core.windows.net/" />
		  <add key="AsaClientId" value="1950a258-227b-4e31-a9cf-717495945fc2" />
		  <add key="RedirectUri" value="urn:ietf:wg:oauth:2.0:oob" />
		  <add key="SubscriptionId" value="<YOUR AZURE SUBSCRIPTION>" />
		  <add key="ActiveDirectoryTenantId" value="<YOU TENANT ID>" />
		</appSettings>


	Replace values for *SubscriptionId* and *ActiveDirectoryTenantId* with your Azure subscription and tenant IDs. You can get these values by running the following PowerShell cmdlet:

		Get-AzureAccount

5. Add the following using statements to the source file (Program.cs) in the project.

		using System;
		using System.Configuration;
		using System.Threading;
		using Microsoft.Azure;
		using Microsoft.Azure.Management.StreamAnalytics;
		using Microsoft.Azure.Management.StreamAnalytics.Models;
		using Microsoft.IdentityModel.Clients.ActiveDirectory;

6.	Add an authentication helper method.

		public static string GetAuthorizationHeader()
		{
		    AuthenticationResult result = null;
		    var thread = new Thread(() =>
		    {
		        try
		        {
		            var context = new AuthenticationContext(
						ConfigurationManager.AppSettings["ActiveDirectoryEndpoint"] +
						ConfigurationManager.AppSettings["ActiveDirectoryTenantId"]);
		
		            result = context.AcquireToken(
		                resource: ConfigurationManager.AppSettings["WindowsManagementUri"],
		                clientId: ConfigurationManager.AppSettings["AsaClientId"],
		                redirectUri: new Uri(ConfigurationManager.AppSettings["RedirectUri"]),
		                promptBehavior: PromptBehavior.Always);
		        }
		        catch (Exception threadEx)
		        {
		            Console.WriteLine(threadEx.Message);
		        }
		    });
		
		    thread.SetApartmentState(ApartmentState.STA);
		    thread.Name = "AcquireTokenThread";
		    thread.Start();
		    thread.Join();
		
		    if (result != null)
		    {
		        return result.AccessToken;
		    }
		
		    throw new InvalidOperationException("Failed to acquire token");
		}  


## Create a Stream Analytics management client

A *StreamAnalyticsManagementClient* object allows you to manage the job, and the job components such as inputs, outputs, and transformation. 

Add the following code to the beginning of the Main method. 

	string resourceGroupName = "<YOUR AZURE RESOURCE GROUP NAME>";
	string streamAnalyticsJobName = "<YOUR STREAM ANALYTICS JOB NAME>";
	string streamAnalyticsInputName = "<YOUR JOB INPUT NAME>";
	string streamAnalyticsOutputName = "<YOUR JOB OUTPUT NAME>";
	string streamAnalyticsTransformationName = "<YOUR JOB TRANSFORMATION NAME>";
	
	// Get authentication token
	TokenCloudCredentials aadTokenCredentials =
	    new TokenCloudCredentials(
	        ConfigurationManager.AppSettings["SubscriptionId"],
	        GetAuthorizationHeader());
	
	// Create Stream Analytics management client
	StreamAnalyticsManagementClient client = new StreamAnalyticsManagementClient(aadTokenCredentials);

The resourceGroupName variable's value should be the same as the name of the resource group you created or picked in the prerequisite steps.

The remaining sections of this article assume that this code is at the beginning of the Main method.

## Create a Stream Analytics Job

The following code creates a Stream Analytics job under the resource group that you have defined. You will add inputs, output, and transformation to the job later.

	// Create a Stream Analytics job
	JobCreateOrUpdateParameters jobCreateParameters = new JobCreateOrUpdateParameters()
	{
	    Job = new Job()
	    {
	        Name = streamAnalyticsJobName,
	        Location = "<LOCATION>",
	        Properties = new JobProperties()
	        {
	            EventsOutOfOrderPolicy = EventsOutOfOrderPolicy.Adjust,
	            Sku = new Sku()
	            {
	                Name = "Standard"
	            }
	        }
	    }
	};
	
	JobCreateOrUpdateResponse jobCreateResponse = client.StreamingJobs.CreateOrUpdate(resourceGroupName, jobCreateParameters);


## Create a Stream Analytics Input Source

The following code creates a Stream Analytics input source with the Blob input source type and CSV serialization. To create an Event Hub input source, use *EventHubStreamInputDataSource* instead of *BlobStreamInputDataSource*. Similarly, you can customize the serialization type of the input source.

	// Create a Stream Analytics input source
	InputCreateOrUpdateParameters jobInputCreateParameters = new InputCreateOrUpdateParameters()
	{
	    Input = new Input()
	    {
	        Name = streamAnalyticsInputName,
	        Properties = new StreamInputProperties()
	        {
	            Serialization = new CsvSerialization
	            {
	                Properties = new CsvSerializationProperties
	                {
	                    Encoding = "UTF8",
	                    FieldDelimiter = ","
	                }
	            },
	            DataSource = new BlobStreamInputDataSource
	            {
	                Properties = new BlobStreamInputDataSourceProperties
	                {
	                    StorageAccounts = new StorageAccount[]
	                    {
	                        new StorageAccount()
	                        {
	                            AccountName = "<YOUR STORAGE ACCOUNT NAME>",
	                            AccountKey = "<YOUR STORAGE ACCOUNT KEY>"
	                        }
	                    },
	                    Container = "samples",
	                    PathPattern = ""
	                }
	            }
	        }
	    }
	};
	
	InputCreateOrUpdateResponse inputCreateResponse = 
		client.Inputs.CreateOrUpdate(resourceGroupName, streamAnalyticsJobName, jobInputCreateParameters);

Input sources are tied to a specific job. To use the same input source for different jobs, you must call the method again specifying a different job name.


## Test a Stream Analytics Input Source

The *TestConnection* method tests whether the Stream Analytics job is able to connect to the input source as well as other aspects specific to the input source type. For example, in the blob input source you created in an earlier step, the method will check that the Storage account name and key pair can be used to connect to the storage account as well as check that the container specified exists.

	// Test input source connection
	DataSourceTestConnectionResponse inputTestResponse = 
		client.Inputs.TestConnection(resourceGroupName, streamAnalyticsJobName, streamAnalyticsInputName);

## Create a Stream Analytics output target

Creating an output target is very similar to creating a Stream Analytics input source. Like input sources, output targets are tied to a specific job. To use the same output target for different jobs, you must call the method again specifying a different job name.

The following code creates a SQL output target. You can customize the output target's data type and/or serialization type.

	// Create a Stream Analytics output target
	OutputCreateOrUpdateParameters jobOutputCreateParameters = new OutputCreateOrUpdateParameters()
	{
	    Output = new Output()
	    {
	        Name = streamAnalyticsOutputName,
	        Properties = new OutputProperties()
	        {
	            DataSource = new SqlAzureOutputDataSource()
	            {
	                Properties = new SqlAzureOutputDataSourceProperties()
	                {
	                    Server = "<YOUR DATABASE SERVER NAME>",
	                    Database = "<YOUR DATABASE NAME>",
	                    User = "<YOUR DATABASE LOGIN>",
	                    Password = "<YOUR DATABASE LOGIN PASSWORD>",
	                    Table = "<YOUR DATABASE TABLE NAME>"
	                }
	            }
	        }
	    }
	};
	
	OutputCreateOrUpdateResponse outputCreateResponse = 
		client.Outputs.CreateOrUpdate(resourceGroupName, streamAnalyticsJobName, jobOutputCreateParameters);

## Test a Stream Analytics output target

Stream Analytics output target also has the TestConnection method for testing connections.

	// Test output target connection
	DataSourceTestConnectionResponse outputTestResponse = 
		client.Outputs.TestConnection(resourceGroupName, streamAnalyticsJobName, streamAnalyticsOutputName);

## Create a Stream Analytics Transformation

The following code creates a Stream Analytics transformation with the query “select * from Input” and specifies to allocate one streaming unit for the Stream Analytics job. For more information on adjusting streaming unit, see [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md).

	// Create a Stream Analytics transformation
	TransformationCreateOrUpdateParameters transformationCreateParameters = new TransformationCreateOrUpdateParameters()
	{
	    Transformation = new Transformation()
	    {
	        Name = streamAnalyticsTransformationName,
	        Properties = new TransformationProperties()
	        {
	            StreamingUnits = 1,
	            Query = "select * from Input"
	        }
	    }
	};
	
	var transformationCreateResp = 
		client.Transformations.CreateOrUpdate(resourceGroupName, streamAnalyticsJobName, transformationCreateParameters);

Like inputs and outputs, transformations are also tied to the specific Stream Analytics job it was created under.

## Start a Stream Analytics Job
After creating a Stream Analytics job and its input(s), output(s), and transformation, you can start the job by calling the Start method. 

The following sample code starts a Stream Analytics job with a custom output start time set to December 12, 2012 12:12:12 UTC.

	// Start a Stream Analytics job
	JobStartParameters jobStartParameters = new JobStartParameters
	{
	    OutputStartMode = OutputStartMode.CustomTime,
	    OutputStartTime = new DateTime(2012, 12, 12, 0, 0, 0, DateTimeKind.Utc)
	};
	
	LongRunningOperationResponse jobStartResponse = client.StreamingJobs.Start(resourceGroupName, streamAnalyticsJobName, jobStartParameters);



## Stop a Stream Analytics Job
You can stop a running Stream Analytics job by calling the Stop method.

	// Stop a Stream Analytics job
	LongRunningOperationResponse jobStopResponse = client.StreamingJobs.Stop(resourceGroupName, streamAnalyticsJobName);

## Delete a Stream Analytics Job
The delete method will delete the job as well as the underlying sub-resources, including input(s), output(s), and  transformation of the job.

	// Delete a Stream Analytics job
	LongRunningOperationResponse jobDeleteResponse = client.StreamingJobs.Delete(resourceGroupName, streamAnalyticsJobName);


## Next steps

- [Introduction to Azure Stream Analytics][stream.analytics.introduction]
- [Get started using Azure Stream Analytics][stream.analytics.get.started]
- [Scale Azure Stream Analytics jobs][stream.analytics.scale.jobs]
- [Azure Stream Analytics limitations and known issues][stream.analytics.limitations]
- [Azure Stream Analytics query language reference][stream.analytics.query.language.reference]
- [Azure Stream Analytics management REST API reference][stream.analytics.rest.api.reference] 



<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png


<!--Link references-->
[azure.blob.storage]: http://azure.microsoft.com/documentation/services/storage/
[azure.blob.storage.use]: http://azure.microsoft.com/documentation/articles/storage-dotnet-how-to-use-blobs/

[azure.event.hubs]: http://azure.microsoft.com/services/event-hubs/
[azure.event.hubs.developer.guide]: http://msdn.microsoft.com/library/azure/dn789972.aspx

[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.forum]: http://go.microsoft.com/fwlink/?LinkId=512151

[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-get-started.md
[stream.analytics.developer.guide]: stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.limitations]: stream-analytics-limitations.md
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301
