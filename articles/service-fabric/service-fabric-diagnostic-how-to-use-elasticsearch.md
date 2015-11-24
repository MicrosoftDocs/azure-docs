<properties
   pageTitle="Using ElasticSearch as a Service Fabric application trace store | Microsoft Azure"
   description="Describes how Service Fabric applications can use ElasticSearch and Kibana to store, index and search through application traces (logs)"
   services="service-fabric"
   documentationCenter=".net"
   authors="karolz-ms"
   manager="adegeo"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/02/2015"
   ms.author="karolz@microsoft.com"/>

# Using ElasticSearch as a Service Fabric application trace store
## Introduction
This article describes how [Service Fabric](http://azure.microsoft.com/documentation/services/service-fabric/) applications can use **ElasticSearch** and **Kibana** for application trace storage, indexing and search. [ElasticSearch](https://www.elastic.co/guide/index.html) is an open-source, distributed and scalable real-time search and analytics engine that is well suited for this task and can be installed on Windows or Linux virtual machines running in Microsoft Azure. ElasticSearch can very efficiently process *structured* traces produced using technologies such as **Event Tracing for Windows (ETW)**.

ETW is used by Service Fabric runtime to source diagnostic information (traces) and is the recommended method for Service Fabric applications to source their diagnostic information too. This allows for correlation between runtime-supplied and application-supplied traces and makes troubleshooting easier. Service Fabric project templates in Visual Studio include a logging API (based on the .NET **EventSource** class) that emits ETW traces by default. For a general overview of Service Fabric application tracing using ETW please see [this article](https://azure.microsoft.com/documentation/articles/service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally/).

For the traces to show up in ElasticSearch, they need to be captured at the Service Fabric cluster nodes in real time (while the application is running) and sent to ElasticSearch endpoint. There are two major options for trace capturing:

+ **In-process trace capturing**  
The application, or more precisely, service process is responsible for sending the diagnostic data out to the trace store (ElasticSearch).

+ **Out-of-process trace capturing**  
A separate agent is capturing traces from service process(es) and sending them to the trace store.

In the rest of the article we will describe how to set up ElasticSearch on Azure, discuss the pros and cons for both capture options, and explain how to configure a Fabric service to send data to ElasticSearch.


## Setting up Elasticsearch on Azure
The most straightforward way to set up ElasticSearch service on Azure is through [**Azure ARM templates**](https://azure.microsoft.com/documentation/articles/resource-group-overview/). A comprehensive [quickstart ARM template for ElasticSearch](https://github.com/Azure/azure-quickstart-templates/tree/master/elasticsearch) is available from Azure quickstart templates repository. This template uses separate storage accounts for scale units (groups of nodes) and can provision separate client and server nodes with different configurations, with various numbers of data disks attached.

In this article we will use another template called **ES-MultiNode** from the [Microsoft Patterns & Practices ELK branch](https://github.com/mspnp/semantic-logging/tree/elk/). This template is somewhat easier to use and creates an ElasticSearch cluster protected by HTTP basic authentication by default. Before proceeding please download the [Microsoft P&P "elk" repo](https://github.com/mspnp/semantic-logging/tree/elk/) from GitHub to your machine (either by cloning the repo or downloading a ZIP file). The ES-MultiNode template is located in the folder with the same name.
>[AZURE.NOTE] ES-MultiNode template and associated scripts currently support ElasticSearch 1.7 release. Support for ElasticSearch 2.0 will be added at a latter date.

### Preparing a machine to run ElasticSearch installation scripts
The easiest way to use ES-MultiNode template is through a provided PowerShell script called `CreateElasticSearchCluster`. To use this script you need to install Azure PowerShell modules and a tool called openssl. The latter is needed for creating an SSH key that can be used to administer your ElasticSearch cluster remotely.

Note: the `CreateElasticSearchCluster` script is designed to ease the use of the ES-MultiNode template from a Windows machine. It is possible to use the template on a non-Windows machine, but that scenario is beyond the scope of this article.

1. If you haven't installed it already, install [**Azure PowerSell modules**](http://go.microsoft.com/fwlink/p/?linkid=320376). When prompted, click Run, then Install.
>[AZURE.NOTE] Azure PowerShell is undergoing a big change with the Azure PowerShell 1.0 release. CreateElasticSearchCluster is currently designed to work with Azure PowerShell 0.9.8 and does not support Azure PowerShell 1.0 Preview. An Azure PowerShell 1.0-compatible script will be provided at a later date.

2. The **openssl** tool is included in the distribution of [**Git for Windows**](http://www.git-scm.com/downloads). If you have not done so already, please install [Git for Windows](http://www.git-scm.com/downloads) now (default installation options are OK).

3. Assuming that Git has been installed, but not included in the system path, open Microsoft Azure PowerShell window and run the following commands:

    ```powershell
    $ENV:PATH += ";<Git installation folder>\usr\bin"
    $ENV:OPENSSL_CONF = "<Git installation folder>\usr\ssl\openssl.cnf"
    ```

    Replace the `<Git installation folder>` with the Git location on your machine; the default is *"C:\Program Files\Git"*. Note the semicolon character at the beginning of the first path.

4. Ensure that you are logged on to Azure (via [*Add-AzureAccount*](https://msdn.microsoft.com/library/azure/dn790372.aspx) cmdlet) and that you have selected the subscription that should be used to create your ElasticSearch cluster ([*Select-AzureSubscription*](https://msdn.microsoft.com/library/azure/dn790367.aspx)).

5. If you haven't done so already, change the current directory to the ES-MultiNode folder.

### Running CreateElasticSearchCluster script
Before running the script, open the `azuredeploy-parameters.json` file and verify or provide values for script parameters. The following parameters are provided:

|Parameter Name           |Description|
|-----------------------  |--------------------------|
|dnsNameForLoadBalancerIP |This is the name that will be used to create the publicly visible DNS name for the ElasticSearch cluster (by appending the Azure region domain to the provided name). For example, if this parameter value is "myBigCluster" and the chosen Azure region is West US, the resulting DNS name for the cluster will be myBigCluster.westus.cloudapp.azure.com. <br /><br />This name will also serve as a root for names for many artifacts associated with the ElasticSearch cluster, such as data node names.|
|storageAccountPrefix    |The prefix for the storage account(s) that will be created for the ElasticSearch cluster. <br /><br /> The current version of the template uses one shared storage account, but that might change in future.|
|adminUsername           |The name of the administrator account for managing the ElasticSearch cluster (corresponding SSH keys will be generated automatically)|
|dataNodeCount           |The number of nodes in the ElasticSearch cluster. The current version of the script does not distinguish between data and query nodes; all nodes will play both roles.|
|dataDiskSize            |The size of data disks (in GB) that will be allocated for each data node. Each node will receive 4 data disks, exclusively dedicated to ElasticSearch service.|
|region                  |The name of Azure region where the ElasticSearch cluster should be located.|
|esClusterName           |The internal name of the ElasticSearch cluster. <br /><br />This value does need to be changed from the default unless you plan to run more than one ElasticSearch cluster on the same virtual network, which is currently not supported by the ES-MultiNode template.|
|esUserName esPassword  |Credentials for the user that will be configured to have access to ES cluster (subject to HTTP basic authentication).|

Now you are ready to run the script. Issue the following command:
```powershell
CreateElasticSearchCluster -ResourceGroupName <es-group-name>
```
Where `<es-group-name>` is the name of the Azure resource group that will contain all cluster resources.

>[AZURE.NOTE] If you get a NullReferenceException from Test-AzureResourceGroup cmdlet, you have forgotten to log on to Azure (`Add-AzureAccount`).

If you get an error from running the script and you determine that the error was caused by a wrong template parameter value, correct the parameter file and run the script again with a different resource group name. You can also reuse the same resource group name and have the script clean up the old one by adding `-RemoveExistingResourceGroup` parameter to the script invocation.

### Result of running the CreateElasticSearchCluster script
After running the `CreateElasticSearchCluster` script the following main artifacts will be created. For the sake of clarity we will assume that you have used 'myBigCluster' for the value of `dnsNameForLoadBalancerIP` parameter and that the region where you created the cluster is West US.

|Artifact|Name, Location and Remarks|
|----------------------------------|----------------------------------|
|SSH key for remote administration |myBigCluster.key file (in the directory from which the CreateElasticSearchCluster was run). <br /><br />This is the key that can be used to connect to the admin node and (through the admin node) to data nodes in the cluster.|
|Admin node                        |myBigCluster-admin.westus.cloudapp.azure.com <br /><br />This is a dedicated VM for remote ElasticSearch cluster administration, the only one that allows external SSH connections. It runs on the same virtual network as all the ElasticSearch cluster nodes but does not run ElasticSearch services.|
|Data nodes                        |myBigCluster1 … myBigCluster*N* <br /><br />Data nodes that are running ElasticSearch and Kibana services. You can connect via SSH to each node, but only via the admin node.|
|ElasticSearch cluster             |http://myBigCluster.westus.cloudapp.azure.com/es/ <br /><br />The above is the primary endpoint for the ElasticSearch cluster (note the /es suffix). It is protected by basic HTTP authentication (the credentials were specified esUserName/esPassword parameters of the ES-MultiNode template). The cluster has also the head plugin installed (http://myBigCluster.westus.cloudapp.azure.com/es/_plugin/head) for basic cluster administration.|
|Kibana service                    |http://myBigCluster.westus.cloudapp.azure.com <br /><br />Kibana service is set up to show data from the created ElasticSearch cluster; it is protected by the same authentication credentials that the cluster itself.|

## In-process versus out-of-process trace capturing
In the introduction we have mentioned two fundamental ways of collecting diagnostic data: in-process and out-of-process. Each has strengths and weaknesses.

Advantages of the **in-process trace capturing** include:

1. *Easy configuration and deployment*

    * The configuration of diagnostic data collection is just part of application configuration and it is easy to keep it always "in sync" with the rest of the application.

    * Per-application or per-service configuration is easily achievable.

    * The out-of-process trace capturing usually requires a separate deployment and configuration of the diagnostic agent, which is extra administrative task and a source of errors. Often the particular agent technology allows only one instance of the agent per virtual machine (node), which means configuration for the collection of the diagnostic configuration is shared between all applications and services running on that node.

2. *Flexibility*

    * The application can send the data wherever it needs to go, as long as there is a client library that supports the targeted data storage system. New sinks can be added as desired.

    * Complex capture, filtering and data aggregation rules can be implemented.

    * An out-of-process trace capturing is often limited by the data sinks that the agent supports. Some agents are extensible.

3. *Access to internal application data & context*

    * The diagnostic subsystem running inside the application/service process can easily augment the traces with contextual information.

    * In the out-of-process approach the data must be sent to an agent via some inter-process communication mechanism such as Event Tracing for Windows (ETW). This might impose additional limitations.

Advantages of the **out-of-process trace capturing** include:

1. *Ability to monitor application and collect crash dumps*

    * In-process trace capturing may be unsuccessful if the application is failing to start or crashes. An independent agent has much better chance of capturing crucial troubleshooting information.<br /><br />

2. *Maturity, robustness and proven performance*

    * An agent developed by platform vendor (such as Microsoft Azure Diagnostics agent) has been subject to rigorous testing and battle-hardening.

    * With the in-process trace capturing care must be taken to ensure that the activity of sending diagnostic data from an application process does not interfere with the application main tasks and does not introduce timing or performance problems. An independently running agent is less prone to these issues and is usually specifically designed to limit its impact on the system.

Of course it is possible to combine and benefit from both approaches; indeed it might be the best solution for many applications.

In this article we will use the **Microsoft.Diagnostic.Listeners library** and the in-process trace capturing to send data from a Service Fabric application to ElasticSearch cluster.

## Using the Listeners library to send diagnostic data to ElasticSearch
Microsoft.Diagnostic.Listeners library is part of Party Cluster sample Fabric application. To use it:

1. Download [the Party Cluster sample](https://github.com/Azure-Samples/service-fabric-dotnet-management-party-cluster) from GitHub.

2. Copy the Microsoft.Diagnostics.Listeners and Microsoft.Diagnostics.Listeners.Fabric projects (whole folders) from the Party Cluster sample directory to the solution folder of the application that is supposed to send the data to ElasticSearch.

3. Open the target solution, right-click the solution node in the Solution Explorer and choose "Add Existing Project". Add the Microsoft.Diagnostics.Listeners project to the solution. Repeat the same for Microsoft.Diagnostics.Listeners.Fabric project.

4. Add a project reference from your service project(s) to the two added projects (each service that is supposed to send data to ElasticSearch should reference Microsoft.Diagnostics.EventListeners and Microsoft.Diagnostics.EventListeners.Fabric).

    ![Project refererences to Microsoft.Diagnostics.EventListeners and Microsoft.Diagnostics.EventListeners.Fabric libraries][1]

### November 2015 preview of Service Fabric and Microsoft.Diagnostics.Tracing NuGet package
Applications built with the November 2015 preview of Service Fabric target **.NET Framework 4.5.1** because this is the highest version of .NET Framework supported by Azure at the time of preview release. Unfortunately this version of the framework lacks certain EventListener APIs that Microsoft.Diagnostics.Listeners library needs. Because EventSource (the component that forms the basis of logging APIs in Fabric applications) and EventListener are tightly coupled, every project that uses Microsoft.Diagnostics.Listeners library must use an alternative implementation of EventSource, one that is provided by **Microsoft.Diagnostics.Tracing NuGet package**, authored by Microsoft. This package is fully backward-compatible with EventSource included in the framework, so no code changes should be necessary other than referenced namespace changes.

To start using Microsoft.Diagnostics.Tracing implementation of the EventSource class follow these steps for each service project that needs to send data to ElasticSearch:

1. Right-click on the service project and choose "Manage NuGet Packages"

2. Switch to nuget.org package source (if not already selected) and search for "Microsoft.Diagnostics.Tracing"

3. Install `Microsoft.Diagnostics.Tracing.EventSource` package (and its dependencies)

4. Open ServiceEventSource.cs or ActorEventSource.cs file in your service project and replace `using System.Diagnostics.Tracing` directive on top of the file with `using Microsoft.Diagnostics.Tracing` directive.

These steps will not be necessary once **.NET Framework 4.6** is supported by Microsoft Azure.

### ElasticSearch listener instantiation and configuration
The final step necessary to send diagnostic data to ElasticSearch is to create an instance of `ElasticSearchListener` and configure it with ElasticSearch connection data. The listener will automatically capture all events raised via EventSource classes defined in the service project. It needs to be alive during the lifetime of the service, so the best place to create it is in the service initialization code. Here is how the initialization code for a stateless service could look after the necessary changes (additions pointed out in comments starting with `****`):

```csharp
using System;
using System.Diagnostics;
using System.Fabric;
using System.Threading;

// **** Add the following directives
using Microsoft.Diagnostics.EventListeners;
using Microsoft.Diagnostics.EventListeners.Fabric;

namespace Stateless1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                using (FabricRuntime fabricRuntime = FabricRuntime.Create())
                {

                    // **** Instantiate ElasticSearchListener
                    var configProvider = new FabricConfigurationProvider("ElasticSearchEventListener");
                    ElasticSearchListener esListener = null;
                    if (configProvider.HasConfiguration)
                    {
                        esListener = new ElasticSearchListener(configProvider);
                    }

                    // This is the name of the ServiceType that is registered with FabricRuntime.
                    // This name must match the name defined in the ServiceManifest. If you change
                    // this name, please change the name of the ServiceType in the ServiceManifest.
                    fabricRuntime.RegisterServiceType("Stateless1Type", typeof(Stateless1));

                    ServiceEventSource.Current.ServiceTypeRegistered(
						Process.GetCurrentProcess().Id,
						typeof(Stateless1).Name);

                    Thread.Sleep(Timeout.Infinite);

                    // **** Ensure that the ElasticSearchListner instance is not garbage-collected prematurely
                    GC.KeepAlive(esListener);

                }
            }
            catch (Exception e)
            {
                ServiceEventSource.Current.ServiceHostInitializationFailed(e);
                throw;
            }
        }
    }
}
```

ElasticSearch connection data should be put in a separate section in the service configuration file (PackageRoot\Config\Settings.xml). The name of the section must correspond to the value passed to the `FabricConfigurationProvider` constructor, for example:

```xml
<Section Name="ElasticSearchEventListener">
  <Parameter Name="serviceUri" Value="http://myBigCluster.westus.cloudapp.azure.com/es/" />
  <Parameter Name="userName" Value="(ES user name)" />
  <Parameter Name="password" Value="(ES user password)" />
  <Parameter Name="indexNamePrefix" Value="myapp" />
</Section>
```
The values of `serviceUri`, `userName` and `password` correspond to ElasticSearch cluster endpoint address, ElasticSearch user name and password, respectively. `indexNamePrefix` is the prefix for ElasticSearch indices; the Microsoft.Diagnostics.Listeners library creates a new index for its data on a daily basis.

### Verification
That is it! Now whenever the service is run, it will start sending traces to the ElasticSearch service specified in the configuration. You can verify this by opening Kibana UI associated with the target ElasticSearch instance (in our example the page address would be http://myBigCluster.westus.cloudapp.azure.com/) and checking that indices with the name prefix chosen for the `ElasticSearchListener` instance are indeed created and populated with data.

![Kibana showing PartyCluster application events][2]

## Next steps
- [Learn more about diagnosing and monitoring a Service Fabric service](service-fabric-diagnose-monitor-your-service-index.md)

<!--Image references-->
[1]: ./media/service-fabric-diagnostics-how-to-use-elasticsearch/listener-lib-references.png
[2]: ./media/service-fabric-diagnostics-how-to-use-elasticsearch/kibana.png
