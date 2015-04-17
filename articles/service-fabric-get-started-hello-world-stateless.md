<properties 
   pageTitle="getting-started-with-stateless-services" 
   description="The tutorial walks through the steps of creating a Microsoft Azure Service Fabric application of a Hello World stateless service"
   services="service-fabric" 
   documentationCenter=".net" 
   authors="zbrad" 
   manager="mike.andrews" 
   editor="vturecek"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="multiple" 
   ms.date="04/13/2015"
   ms.author="brad.merrill"/>

# Getting Started with Stateless Services

In this tutorial, you’ll implement a simple "Hello World" service that prints out current date and time periodically. The service is an example of a background worker that runs constantly. This pattern is very similar to how a Cloud Service Worker Role is implemented.

1. Launch Visual Studio 2015 CTP 6 as **Administrator**, and create a new **Windows Fabric Stateless Service** Project named **HelloWorldStateless**.
![][8]
    
  You will see 2 projects in the created solution. The first project is the application project (_HelloWorldStatelessApplication_), which contains the application manifest and a number of PowerShell scripts that help you to deploy your application. The second is the service project (_HelloWorldStateless_), which contains the actual service implementation.

1. Open **Service.cs** in the **HelloWorldStateless** project

1. Replace the code in **RunAsync** method:
```c#
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            ServiceEventSource.Current.Message("Starting Hello World service.");

            while (!cancellationToken.IsCancellationRequested)
            {
                cancellationToken.ThrowIfCancellationRequested();
                ServiceEventSource.Current.Message("Hello World! at " + DateTime.Now.ToLongTimeString());
                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }
```

## Test locally

1. ![][6] If you haven't done so, you need to launch a local cluster first. Launch **Windows PowerShell** as **administrator** and execute the **DevClusterSetup.ps1** script under the **Microsoft SDKs\ServiceFabric\ClusterSetup** folder.

  >**NOTE**: Your local cluster might be already running, in which case the script will fail with many errors. If you want to clean up the local cluster, run the **CleanCluster.ps1** script under the same folder.

1. You can now build and deploy your service. Press **F5**, and your service will be started. Once the service is running, you can see its output on the **Output** window of Visual Studio.

    ![][4]

  >**NOTE**: You see repeated outputs in each second because by default when a service is deployed it has three instances running for load-balancing and high-availability. The number of instances is controlled by the **Instance** attribute in **ApplicationManifest.xml**, which you can find under the _HelloWorldStatelessApplication_ project.

1. Stop the program.

  >**NOTE**: To debug locally, set break points at the lines of interest. 

## Conclusion

In this tutorial, you created a "Hello World" stateless service and tested it locally.

<!--image references-->

[1]: ./media/service-fabric-get-started-hello-world-stateless/app-get-output.png
[2]: ./media/service-fabric-get-started-hello-world-stateless/app-health-output.png
[3]: ./media/service-fabric-get-started-hello-world-stateless/app-new-output.png
[4]: ./media/service-fabric-get-started-hello-world-stateless/app-trace.png
[5]: ./media/service-fabric-get-started-hello-world-stateless/breakpoint.png
[6]: ./media/service-fabric-get-started-hello-world-stateless/change.png
[7]: ./media/service-fabric-get-started-hello-world-stateless/deploy.png
[8]: ./media/service-fabric-get-started-hello-world-stateless/project-new.png
[9]: ./media/service-fabric-get-started-hello-world-stateless/warn.png
