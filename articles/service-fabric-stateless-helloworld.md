#Getting Started with Microsoft Azure Service Fabric Stateless Services (VS 2015 CTP 6)

>**NOTE**: This set of training content is based on pre-release services, libraries and tools. Details are subject to change, and operation steps may differ from the final released products. Before you start, please make sure you are using the latest version of this package. 
>
>Please also note that steps annotated with ![](media/service-fabric-stateless-helloworld/change.png) are more likely to change. And steps annotated with ![](media/service-fabric-stateless-helloworld/workaround.png) are temporary workarounds.

>The official name of the service is **Microsoft Azure Service Fabric**, or **Service Fabric** in short. However, the tools and libraries haven't been refreshed to use this new name yet. In the following text and screen shots you'll see reference to *Windows Fabric*, which is the internal code name.

The tutorial walks you through the steps of creating a "Hello World" stateless Service Fabric service. The tutorial assumes that you use Visual Studio 2015 CTP 6 or above. Please see [Getting Started with Microsoft Azure Service Fabric Stateful Services (VS 2015 CTP 6)](../HelloWorldAppStateful-VS2015) if you want to create a stateful service.

You'll learn:

- How to set up the development environment for Microsoft Azure Service Fabric.
- How to implement a simple stateless service.
- How to test your service locally using a development cluster.
- How to deploy your service to Azure.

Tutorial segments

- [Set up the development environment](#setup)
- [Implement the service](#implement)
- [Test the service locally](#testlocally) 
- [Deploy the service to Azure](#deploy)

##<a name="setup"></a>Set up the development environment

###Prerequisites
- [Visual Studio 2015 CTP 6](https://www.visualstudio.com/en-us/news/vs2015-vs.aspx)
- [Azure PowerShell](http://azure.microsoft.com/en-us/documentation/articles/install-configure-powershell/)
- If you want to deploy the service to Azure, an active Azure subscription. If you don't have one, you can get a free trial at [azure.microsoft.com](http://azure.microsoft.com/en-gb/pricing/free-trial/).

###Install SDK and tools

1. Install [Windows Fabric 3.2](../../resources/WindowsFabric.3.2.181.9490.msi).
2. Install [Windows Fabric 3.2 SDK](../../resources/WindowsFabricSDK.3.2.181.9490.msi).
3. Install [Windows Fabric Tool for Visual Studio 2015 Preview](../../resources/Fabric.VS140.en-us.msi).
4. ![](media/service-fabric-stateless-helloworld/workaround.png) Extract [FabActSdk.zip](../../resources/FabActSdk.zip) under the **Resources** folder to your *%SystemDrive%* (i.e. C:\ if C: is your System Drive). After extraction, you should have a *FabActSDK* folder under your system drive root folder. This folder is referred to as the *FabActSdk* folder hereafter in this tutorial.
6. ![](media/service-fabric-stateless-helloworld/workaround.png) Disable strong name verification. 
	1. Launch **VS2015 x64 Cross Tools Command Prompt** as an **Administrator**.
	2. Navigate to the *FabActSdk***\bin** folder.
	3. Disable strong name verification for the following three assemblies by running the following commands:
	
			sn -Vr FabActUtil.exe
			sn -Vr System.Fabric.Services.dll
			sn -Vr WindowsFabricServiceModel.dll

##<a name="implement"></a>Implement the service

A stateless service doesn't rely on persistent states. Each request can be handled independently without needing to consult or maintain a context across multiple requests. For example, a unit converter converts measurements to different units given a scalar value and two units. The inputs are sufficient for the service to carry out the required operation independently. The request is not affected by any historical requests, nor other instances of the service.

1. Launch Visual Studio 2015 CTP 6 as **Administrator**, and create a new **Windows Fabric Stateless Service** Project named **HelloWorldApp**.

	![](media/service-fabric-stateless-helloworld/NewProject.png)
	
	You will see 2 projects in the created solution. The first project is the application project (_HelloWorldApp_), which contains the application manifest and a number of PowerShell scripts that help you to deploy your application. The second is the service project (_StatelessService1_), which contains the actual service implementation.

	>**NOTE**: The solution should build out-of-box. If the solution fails to build, please check if you've extracted *FabActSdk.zip* to your *%SystemDrive%* root folder (see step 4 in previous section).

5. Open **Service.cs** in the **StatelessService1** project, import the following namespaces:

		using System.Diagnostics;

6. Replace the code in **RunAsync()** method:

       	protected override async Task RunAsync(CancellationToken cancellationToken)
		{
			Trace.WriteLine("Starting Hello World service.");

			while (!cancellationToken.IsCancellationRequested)
			{
				cancellationToken.ThrowIfCancellationRequested();
				Trace.WriteLine("Hello World! at " + DateTime.Now.ToLongTimeString());
				await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
			}
		}


##<a name="testlocally"></a>Test locally

1. ![](media/service-fabric-stateless-helloworld/change.png) If you haven't done so, you need to launch a local cluster first. Launch **Windows PowerShell** as **administrator** and execute the **DevClusterSetup.ps1** script under the **_FabActSdk_\ClusterSetup\Local** folder (see step 4 of installation).

	>**NOTE**: Your local cluster might be already running, in which case the script will fail with many errors. If you want to clean up the local cluster, run the **CleanCluster.ps1** script under the same folder.

2. You can now build and deploy your service. Press **F5**, and your service will be started. Once the service is running, you can see its output on the **Output** window of Visual Studio.

	![](media/service-fabric-stateless-helloworld/Output.png)

	>**NOTE**: You see repeated outputs in each second because by default when a service is deployed it has three instances running for load-balancing and high-availability. The number of instances is controlled by the **Instance** attribute in **ApplicationManifest.xml**, which you can find under the _HelloWorldApp_ project.

3. Stop the program.

	>**NOTE**: To debug locally, set break points at the lines of interest. 

##<a name="deploy"></a>Deploy the service to Azure
You can deploy your Service Fabric services to a Service Fabric cluster on Azure or on-premises servers. Please see [Deploy to Azure](../DeployToAzure) tutorial for detailed instructions on how to provision a Service Fabric cluster on Azure.

1. In Visual studio, open the **Parameters.json** file under HelloWorldApp's **Scripts** folder.
2. Add a parameter **clusterConnectionString** to your Service Fabric cluster address. For example, if your Service Fabric cluster is located at _mycluster.cloudapp.net_, then the modified JSON file should look like the following:

		{
	    	"clusterConnectionString": "mycluster.cloudapp.net:19000"
		}

	![](media/service-fabric-stateless-helloworld/workaround.png) There seems to be a bug with the Deploy menu at the moment: It registers the application package with _Register-WindowsFabricApplicationType_ call, but it doesn't invoke _New-WindowsFabricApplication_. You will execute some steps before and after deploying to workaround this issue.

3. ![](media/service-fabric-stateless-helloworld/workaround.png) In **Visual Studio**, open the file **Publish-FabricApplication.ps1** located in the **Scripts** folder of the application project **HelloWorldApp**. Locate the line that calls *Connect-WindowsFabricCluster* and add as a parameter the address of your Service Fabric cluster. For example, if your Service Fabric Cluster is located at *mycluster.cloudapp.net*, the modified line should look like this:

		[void](Connect-WindowsFabricCluster mycluster.cloudapp.net:19000)

4. ![](media/service-fabric-stateless-helloworld/workaround.png) Similarly, edit the file **New-FabricApplication.ps1** located in the **Scripts** folder of the application project **HelloWorldApp** and add the address of your Service Fabric cluster to the line that calls *Connect-WindowsFabricCluster*. 

		[void](Connect-WindowsFabricCluster mycluster.cloudapp.net:19000)

5. Right click on the **HelloWorldApp** project and select **Deploy**.

	![](media/service-fabric-stateless-helloworld/deploy.png)


6. ![](media/service-fabric-stateless-helloworld/workaround.png) Open **Windows Powershell** running as **Administrator** and change to the **Scripts** folder of your **HelloWorldApp** project.
	
	> NOTE: If you haven't configured Windows PowerShell with your Azure subscription, you can run
	
	>`Add-AzureAccount`
	
	> to sign on to your Azure subscription. Then, select the correct subscription to use by running
	
	>`Select-AzureSubscription -SubscriptionName <your subscription name>`

7.  ![](media/service-fabric-stateless-helloworld/workaround.png) In Powershell, execute the following command:

		.\New-FabricApplication.ps1 -ParameterFile Parameters.json -ApplicationPackagePath ..\

	The output should look like this:

	![](media/service-fabric-stateless-helloworld/NewFabricApplication-output.png)

8. To verify that everything went well, in **Powershell** run the following commands:

		Connect-WindowsFabricCluster mycluster.cloudapp.net:19000
		Get-WindowsFabricApplication -ApplicationName "fabric:/HelloWorldApp"
	
	The output should look like this:

	![](media/service-fabric-stateless-helloworld/GetWindowsFabricApplicationOutput.png)


9. ![](media/service-fabric-stateless-helloworld/workaround.png) Then execute:

		Get-WindowsFabricApplicationHealth -ApplicationName "fabric:/HelloWorldApp"

	The output should look like this:

	![](media/service-fabric-stateless-helloworld/GetWindowsFabricApplicationHealthOutput.png)

##Conclusion
In this tutorial, you created a stateless service, tested it locally, and then deployed it to Microsoft Azure.