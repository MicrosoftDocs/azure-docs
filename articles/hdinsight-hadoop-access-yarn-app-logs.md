<properties 
	pageTitle="Access HDInsight YARN application logs programmatically | Microsoft Azure" 
	description="Access HDInsight Application Logs Programmatically." 
	services="hdinsight" 
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="bradsev"/>

# Access YARN application logs in HDInsight programmatically

This topic explains how to programmatically enumerate the YARN (Yet Another Resource Negotiator) applications that have finished on a Hadoop cluster in Azure HDInsight, and how to programmatically access the application logs without having to connect to your clusters by using Remote Desktop Protocol (RDP). Specifically, a new component and a new API have been added:

  1. The generic application history server on HDInsight clusters is enabled. It is a component within the YARN Timeline Server that handles the storage and retrieval of generic information about completed applications.
  2. APIs in the Azure HDInsight .NET SDK are available to programmatically enumerate applications that have run on your clusters and to download the relevant application-specific or container-specific logs (in plain text) to help with debugging any application problems that occur.


## Prerequisites

The Azure HDInsight SDK is required to use the code presented in this topic in a .NET Framework application. The most recently published build of the SDK is available at [NuGet](http://nuget.codeplex.com/wikipage?title=Getting%20Started). 

To install the HDInsight SDK from a Visual Studio application, go the **Tools** menu, click **Nuget Package Manager**, and then click **Package Manager Console**. Run the following command in the console to install the packages:

		Install-Package Microsoft.WindowsAzure.Management.HDInsight

This command adds .NET libraries for HDInsight and adds references to them to the current Visual Studio project.


## <a name="YARNTimelineServer"></a>YARN Timeline Server

The <a href="http://hadoop.apache.org/docs/r2.4.0/hadoop-yarn/hadoop-yarn-site/TimelineServer.html" target="_blank">YARN Timeline Server</a> provides generic information on completed applications as well as framework-specific application information through two different interfaces. Specifically:

* Storage and retrieval of generic application information on HDInsight clusters has been enabled with version 3.1.1.374 or higher. 
* The framework-specific application information component of the Timeline Server is not currently available on HDInsight clusters.


Generic information on applications includes the following sorts of data: 

* The application ID, a unique identifier of an application 
* The user who started the application 
* Information on attempts made to complete the application 
* The containers used by any given application attempt 

On your HDInsight clusters, this information will be stored by Azure Resource Manager to a history store in the default container of your default Azure Storage account. This generic data on completed applications can be retrieved through a REST API:

    GET on https://<cluster-dns-name>.azurehdinsight.net/ws/v1/applicationhistory/apps

We have added new APIs to the HDInsight .NET SDK to make it easy to retrieve this data programmatically. Note that the generic data can also be retrieved by running YARN command-line interface (CLI) commands directly on your cluster nodes (after connecting to the cluster by using RDP).

## <a name="YARNAppsAndLogs"></a>YARN applications and logs

YARN supports multiple programming models (MapReduce being one of them) by decoupling resource management from application scheduling/monitoring. This is done through a global *ResourceManager* (RM), per-worker-node *NodeManagers* (NMs), and per-application *ApplicationMasters* (AMs). The per-application AM negotiates resources (CPU, memory, disk, network) for running your application with the RM. The RM works with NMs to grant these resources, which are granted as *containers*. The AM is responsible for tracking the progress of the containers assigned to it by the RM. An application may require many containers depending on the nature of the application. 

Furthermore, each application may consist of multiple *application attempts* in order to finish in the presence of crashes or due to the loss of communication between an AM and an RM. Hence, containers are granted to a specific attempt of an application. In a sense, a container provides the context for basic unit of work performed by a YARN application, and all work that is done within the context of a container is performed on the single worker node on which the container was allocated. See [YARN Concepts][YARN-concepts] for further reference.

Application logs (and the associated container logs) are critical in debugging problematic Hadoop applications. YARN provides a nice framework for collecting, aggregating, and storing application logs with the [Log Aggregation][log-aggregation] feature. The Log Aggregation feature makes accessing application logs more deterministic, as it aggregates logs across all containers on a worker node and stores them as one aggregated log file per worker node on the default file system after an application finishes. Your application may use hundreds or thousands of containers, but logs for all containers run on a single worker node will always be aggregated to a single file, resulting in one log file per worker node used by your application. Log Aggregation is enabled by default on HDInsight clusters (version 3.0 and above), and aggregated logs can be found in the default container of your cluster at the following location:

	wasb:///app-logs/<user>/logs/<applicationId>

In that location, *user* is the name of the user who started the application, and *applicationId* is the unique identifier of an application as assigned by the YARN RM.

The aggregated logs are not directly readable, as they are written in a [TFile][T-file], [binary format][binary-format] indexed by container. YARN provides CLI tools to dump these logs as plain text for applications or containers of interest. You can view these logs as plain text by running one of the following YARN commands directly on the cluster nodes (after connecting to it through RDP):

	yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application>
	yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application> -containerId <containerId> -nodeAddress <worker-node-address> 

The next section talks about how you can access application-specific or container-specific logs programmatically, without having to use RDP to connect to your HDInsight clusters.

## <a name="enumerate-and-download"></a>Enumerating applications and downloading logs programmatically

To use the following code samples, you must satisfy the prerequisites outlined above by downloading the latest version of the HDInsight .NET SDK. See the instructions provided there.

The code below illustrates how to use the new APIs to enumerate applications and download the logs for completed applications.

> [AZURE.NOTE] The APIs below will work only against "Running" Hadoop clusters with version 3.1.1.374 or greater. Add the following directives:

	using Microsoft.Hadoop.Client;
	using Microsoft.WindowsAzure.Management.HDInsight;

These reference the newly defined APIs in the code below. The following code snippet creates an Application History client against a "Running" cluster in your subscription:

	string subscriptionId = "<your-subscription-id>";
	string clusterName = "<your-cluster-name>";
	string certName = "<your-subscription-management-cert-name>";
	
	// Create an HDInsight client
	X509Store store = new X509Store(StoreName.My, StoreLocation.LocalMachine);
	store.Open(OpenFlags.ReadOnly);
	X509Certificate2 cert = store.Certificates.Cast<X509Certificate2>()
	                            .Single(x => x.FriendlyName == certName);
	
	HDInsightCertificateCredential creds = 
				new HDInsightCertificateCredential(new Guid(subscriptionId), cert);
	
	IHDInsightClient client = HDInsightClient.Connect(creds);
	
	// Get the cluster on which your applications were run
	// The cluster needs to be in the "Running" state
	ClusterDetails cluster = client.GetCluster(clusterName);
	
	// Create an Application History client against your cluster
	IHDInsightApplicationHistoryClient appHistoryClient = 
				cluster.CreateHDInsightApplicationHistoryClient(TimeSpan.FromMinutes(5));


You can now use the Application History client to list completed applications, filter applications based on your criteria, and download relevant application logs. The following code snippet shows how this is done programmatically:

	// Local download folder location where the logs will be placed
	string downloadLocation = "E:\\YarnApplicationLogs";
	
	// List completed applications on your cluster that were submitted in the last 24 hours but failed
	// Search for applications based on application name
	string appNamePrefix = "your-app-name-prefix";
	DateTime endTime = DateTime.UtcNow;
	DateTime startTime = endTime.AddHours(-24);
	IEnumerable<ApplicationDetails> applications = appHistoryClient
	                .ListCompletedApplications(startTime, endTime)
	                .Where(app => 
	                    app.GetApplicationFinalStatusAsEnum() == ApplicationFinalStatus.Failed 
	                    && app.Name.StartsWith(appNamePrefix));
	
	// Download logs for failed or killed applications
	// This will generate one log file for each application
	foreach (ApplicationDetails application in applications)
	{
	    appHistoryClient.DownloadApplicationLogs(application, downloadLocation);
	}

The above code lists/finds applications of interest by using the Application History client, and then downloads logs for those applications to a local folder. 

Alternatively, the code snippet below downloads logs for an application whose application ID is known. The application ID is a globally unique identifier of an application, as assigned to it by the RM. It is constructed by using the start time of the RM, along with a monotonically increasing counter for applications submitted to it. The application ID is of the form "application\_&lt;RM-start-time&gt;\_&lt;Counter&gt;". Please note that the application ID and job ID are distinct. The job ID is a concept specific to the MapReduce framework, whereas the application ID is a framework-agnostic YARN concept. In YARN, a job ID identifies a specific MapReduce job, as handled by the AM of a MapReduce application submitted to the RM.

	// Download application logs for an application whose application ID is known
	string applicationId = "application_1416017767088_0028";
	ApplicationDetails someApplication = appHistoryClient.GetApplicationDetails(applicationId);
	appHistoryClient.DownloadApplicationLogs(someApplication, downloadLocation);

If needed, you can also download logs for each container (or any specific container) used by an application, as shown below.

	ApplicationDetails someApplication = appHistoryClient.GetApplicationDetails(applicationId);
	
	// Download logs separately for each container of application(s) of interest
	// This will generate one log file per container
	IEnumerable<ApplicationAttemptDetails> applicationAttempts =
				appHistoryClient.ListApplicationAttempts(someApplication);
	
	ApplicationAttemptDetails finalAttempt = applicationAttempts
	    		.Single(x => x.ApplicationAttemptId == someApplication.LatestApplicationAttemptId);
	
	IEnumerable<ApplicationContainerDetails> containers =
				appHistoryClient.ListApplicationContainers(finalAttempt);
	
	foreach (ApplicationContainerDetails container in containers)
	{
	    appHistoryClient.DownloadApplicationLogs(container, downloadLocation);
	}



[YARN-timeline-server]:http://hadoop.apache.org/docs/r2.4.0/hadoop-yarn/hadoop-yarn-site/TimelineServer.html
[log-aggregation]:http://hortonworks.com/blog/simplifying-user-logs-management-and-access-in-yarn/
[T-file]:https://issues.apache.org/jira/secure/attachment/12396286/TFile%20Specification%2020081217.pdf
[binary-format]:https://issues.apache.org/jira/browse/HADOOP-3315 
[YARN-concepts]:http://hortonworks.com/blog/apache-hadoop-yarn-concepts-and-applications/
