<properties
   pageTitle="Deploy an existing executable to Azure Service Fabric | Microsoft Azure"
   description="Walkthrough on how to package an existing application as a guest executable, so it can be deployed on an Azure Service Fabric cluster"
   services="service-fabric"
   documentationCenter=".net"
   authors="bmscholl"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="na"
   ms.date="06/20/2016"
   ms.author="bscholl;mikhegn"/>

# Deploy a guest executable to Service Fabric

You can run any type of application, such as Node.js, Java, or native applications in Azure Service Fabric. Service Fabric terminology refers to those types of applications as guest executables.
Guest executables are treated by Service Fabric like stateless services. As a result, they will be placed on nodes in a cluster, based on availability and other metrics. This article describes how to package and deploy a guest executable to a Service Fabric cluster, using Visual Studio or a command line utility.

## Benefits of running a guest executable in Service Fabric

There are several advantages that come with running a guest executable in a Service Fabric cluster:

- High availability. Applications that are run in Service Fabric are highly available out of the box. Service Fabric makes sure that one instance of an application is always up and running.
- Health monitoring. Out of the box, Service Fabric health monitoring detects if an application is up and running and provides diagnostics information in case of failure.   
- Application lifecycle management. Besides providing upgrades with no downtime, Service Fabric also allows you to roll back to the previous version if there is an issue during an upgrade.    
- Density. You can run multiple applications in a cluster, which eliminates the need for each application to run on its own hardware.

In this article, we cover the basic steps to package a guest executable and deploy it to Service Fabric.  

## Quick overview of application and service manifest files

As part of deploying a guest executable, it is useful to understand the Service Fabric packaging and deployment model. The Service Fabric packaging deployment model relies mainly on two XML files: the application and service manifests. The schema definition for the ApplicationManifest.xml and ServiceManifest.xml files is installed with the Service Fabric SDK and tools to *C:\Program Files\Microsoft SDKs\Service Fabric\schemas\ServiceFabricServiceModel.xsd*.

* **Application manifest**

  The application manifest is used to describe the application. It lists the services that compose it as well as other parameters that are used to define how the service(s) should be deployed (such as the number of instances).

  In the Service Fabric world, an application is the "upgradable unit." An application can be upgraded as a single unit where potential failures (and potential rollbacks) are managed by the platform. The platform guarantees that the upgrade process is either completely successful, or, if it fails, the platform does not leave the application in an unknown/unstable state.

* **Service manifest**

  The service manifest describes the components of a service. It includes data, such as the name and type of service (which is information that Service Fabric uses to manage the service), and its code, configuration, and data components. The service manifest also includes some additional parameters that can be used to configure the service once it is deployed.

  We are not going into the details of all the different parameters that are available in the service manifest. We will go through the subset that is required to make a guest executable run on Service Fabric.

## Application package file structure
In order to deploy an application to Service Fabric, the application needs to follow a predefined directory structure. Below is an example of that structure.

```
|-- ApplicationPackage
    |-- code
        |-- existingapp.exe
    |-- config
        |-- Settings.xml
    |-- data
    |-- ServiceManifest.xml
|-- ApplicationManifest.xml
```

The root contains the ApplicationManifest.xml file that defines the application. A subdirectory for each service included in the application is used to contain all the artifacts that the service requires--the ServiceManifest.xml and typically, the following three directories:

- *Code*. This directory contains the service code.
- *Config*. This directory contains a Settings.xml file (and other files if necessary) that the service can access at run time to retrieve specific configuration settings.
- *Data*. This is an additional directory to store additional local data that the service may need. Note: Data should be used to store only ephemeral data. Service Fabric does not copy/replicate changes to the data directory if the service needs to be relocated--for instance, during failover.

Note: You don't have to create the `config` and `data` directories if you don't need them.

## Process of packaging an existing app

When packaging a guest executable, you can choose either to use a Visual Studio project template or create the application package manually. Using Visual Studio, the application package structure and manifest files are created by the new project wizard for you. See below for a step-by-step guide on how to package a guest executable using Visual Studio.

The process of manually packaging a guest executable is based on the following steps:

1. Create the package directory structure.
2. Add the application's code and configuration files.
3. Edit the service manifest file.
4. Edit the application manifest file.

>[AZURE.NOTE] We do provide a packaging tool that allows you to create the ApplicationPackage automatically. The tool is currently in preview. You can download it from [here](http://aka.ms/servicefabricpacktool).

### Create the package directory structure
You can start by creating the directory structure, as described earlier.

### Add the application's code and configuration files
After you have created the directory structure, you can add the application's code and configuration files under the code and config directories. You can also create additional directories or subdirectories under the code or config directories.

Service Fabric does an xcopy of the content of the application root directory, so there is no predefined structure to use other than creating two top directories, code and settings. (You can pick different names if you want. More details are in the next section.)

>[AZURE.NOTE] Make sure that you include all the files/dependencies that the application needs. Service Fabric will copy the content of the application package on all nodes in the cluster where the application's services are going to be deployed. The package should contain all the code that the application needs in order to run. We do not recommend assuming that the dependencies are already installed.

### Edit the service manifest file
The next step is to edit the service manifest file to include the following information:

- The name of the service type. This is an ID that Service Fabric uses to identify a service.
- The command to use to launch the application (ExeHost).
- Any script that needs to be run to set up/configure the application (SetupEntrypoint).

Below is an example of a `ServiceManifest.xml` file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Name="NodeApp" Version="1.0.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <ServiceTypes>
      <StatelessServiceType ServiceTypeName="NodeApp" UseImplicitHost="true"/>
   </ServiceTypes>
   <CodePackage Name="code" Version="1.0.0.0">
      <SetupEntryPoint>
         <ExeHost>
             <Program>scripts\launchConfig.cmd</Program>
         </ExeHost>
      </SetupEntryPoint>
      <EntryPoint>
         <ExeHost>
            <Program>node.exe</Program>
            <Arguments>bin/www</Arguments>
            <WorkingFolder>CodePackage</WorkingFolder>
         </ExeHost>
      </EntryPoint>
   </CodePackage>
   <Resources>
      <Endpoints>
         <Endpoint Name="NodeAppTypeEndpoint" Protocol="http" Port="3000" Type="Input" />
      </Endpoints>
   </Resources>
</ServiceManifest>
```

Let's go over the different parts of the file that you need to update:

### ServiceTypes

```xml
<ServiceTypes>
  <StatelessServiceType ServiceTypeName="NodeApp" UseImplicitHost="true" />
</ServiceTypes>
```

- You can pick any name that you want for `ServiceTypeName`. The value is used in the `ApplicationManifest.xml` file to identify the service.
- You need to specify `UseImplicitHost="true"`. This attribute tells Service Fabric that the service is based on a self-contained app, so all Service Fabric needs to do is to launch it as a process and monitor its health.

### CodePackage
The CodePackage element specifies the location (and version) of the service's code.

```xml
<CodePackage Name="Code" Version="1.0.0.0">
```

The `Name` element is used to specify the name of the directory in the application package that contains the service's code. `CodePackage` also has the `version` attribute. This can be used to specify the version of the code--and can also potentially be used to upgrade the service's code by using Service Fabric's application lifecycle management infrastructure.
### SetupEntrypoint

```xml
<SetupEntryPoint>
   <ExeHost>
       <Program>scripts\launchConfig.cmd</Program>
   </ExeHost>
</SetupEntryPoint>
```
The SetupEntrypoint element is used to specify any executable or batch file that should be executed before the service's code is launched. It is an optional element, so it does not need to be included if there is no initialization/setup required. The SetupEntryPoint is executed every time the service is restarted.

There is only one SetupEntrypoint, so setup/config scripts need to be bundled in a single batch file if the application's setup/config requires multiple scripts. SetupEntrypoint can execute any type of file--executable files, batch files, and PowerShell cmdlets.
In the example above, the SetupEntrypoint is based on a batch file LaunchConfig.cmd that is located in the `scripts` subdirectory of the code directory (assuming the WorkingFolder element is set to code).

### Entrypoint

```xml
<EntryPoint>
  <ExeHost>
    <Program>node.exe</Program>
    <Arguments>bin/www</Arguments>
    <WorkingFolder>CodeBase</WorkingFolder>
  </ExeHost>
</EntryPoint>
```

The `Entrypoint` element in the service manifest file is used to specify how to launch the service. The `ExeHost` element specifies the executable (and arguments) that should be used to launch the service.

- `Program` specifies the name of the executable that should be executed in order to start the service.
- `Arguments` specifies the arguments that should be passed to the executable. It can be a list of parameters with arguments.
- `WorkingFolder` specifies the working directory for the process that is going to be started. You can specify two values:
	- `CodeBase` specifies that the working directory is going to be set to the code directory in the application package (`Code` directory in the structure shown below).
	- `CodePackage` specifies that the working directory is going to be set to the root of the application package	(`MyServicePkg`).
- `WorkingFolder` is useful to set the correct working directory so that relative paths can be used by either the application or initialization scripts.

### Endpoints

```xml
<Endpoints>
   <Endpoint Name="NodeAppTypeEndpoint" Protocol="http" Port="3000" Type="Input" />
</Endpoints>

```
The `Endpoint` element specifies the endpoints that the application can listen on. In this example, the Node.js application listens on port 3000.

## Edit the application manifest file

Once you have configured the `Servicemanifest.xml` file, you need to make some changes to the `ApplicationManifest.xml` file to ensure that the correct service type and name are used.

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="NodeAppType" ApplicationTypeVersion="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <ServiceManifestImport>
      <ServiceManifestRef ServiceManifestName="NodeApp" ServiceManifestVersion="1.0.0.0" />
   </ServiceManifestImport>
</ApplicationManifest>
```

### ServiceManifestImport

In the `ServiceManifestImport` element, you can specify one or more services that you want to include in the app. Services are referenced with `ServiceManifestName`, which specifies the name of the directory where the `ServiceManifest.xml` file is located.

```xml
<ServiceManifestImport>
  <ServiceManifestRef ServiceManifestName="NodeApp" ServiceManifestVersion="1.0.0.0" />
</ServiceManifestImport>
```

### Set up logging
For guest executables, it is very useful to be able to see console logs to find out if the application and configuration scripts show any errors.
Console redirection can be configured in the `ServiceManifest.xml` file using the `ConsoleRedirection` element.

```xml
<EntryPoint>
  <ExeHost>
    <Program>node.exe</Program>
    <Arguments>bin/www</Arguments>
    <WorkingFolder>CodeBase</WorkingFolder>
    <ConsoleRedirection FileRetentionCount="5" FileMaxSizeInKb="2048"/>
  </ExeHost>
</EntryPoint>
```

* `ConsoleRedirection` can be used to redirect console output (both stdout and stderr) to a working directory so they can be used to verify that there are no errors during the setup or execution of the application in the Service Fabric cluster.

	* `FileRetentionCount` determines how many files are saved in the working directory. A value of 5, for instance, means that the log files for the previous five executions are stored in the working directory.
	* `FileMaxSizeInKb` specifies the max size of the log files.

Log files are saved in one of the service's working directories. In order to determine where the files are located, you need to use Service Fabric Explorer to determine which node that the service is running on and which working directory is being used. This process is covered later in this article.

### Deployment
The last step is to deploy your application. The PowerShell script below shows how to deploy your application to the local development cluster and start a new Service Fabric service.

```PowerShell

Connect-ServiceFabricCluster localhost:19000

Write-Host 'Copying application package...'
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath 'C:\Dev\MultipleApplications' -ImageStoreConnectionString 'file:C:\SfDevCluster\Data\ImageStoreShare' -ApplicationPackagePathInImageStore 'nodeapp'

Write-Host 'Registering application type...'
Register-ServiceFabricApplicationType -ApplicationPathInImageStore 'nodeapp'

New-ServiceFabricApplication -ApplicationName 'fabric:/nodeapp' -ApplicationTypeName 'NodeAppType' -ApplicationTypeVersion 1.0

New-ServiceFabricService -ApplicationName 'fabric:/nodeapp' -ServiceName 'fabric:/nodeapp/nodeappservice' -ServiceTypeName 'NodeApp' -Stateless -PartitionSchemeSingleton -InstanceCount 1

```
A Service Fabric service can be deployed in various "configurations." For instance, it can be deployed as single or multiple instances, or it can be deployed in such a way that there is one instance of the service on each node of the Service Fabric cluster.

The `InstanceCount` parameter of the `New-ServiceFabricService` cmdlet is used to specify how many instances of the service should be launched in the Service Fabric cluster. You can set the `InstanceCount` value, depending on the type of application that you are deploying. The two most common scenarios are:

* `InstanceCount = "1"`. In this case, only one instance of the service will be deployed in the cluster. Service Fabric's scheduler determines which node the service is going to be deployed on.

* `InstanceCount ="-1"`. In this case, one instance of the service will be deployed on every node in the Service Fabric cluster. The end result will be having one (and only one) instance of the service for each node in the cluster.

This is a useful configuration for front-end applications (for example, a REST endpoint) because client applications just need to "connect" to any of the nodes in the cluster in order to use the endpoint. This configuration can also be used when, for instance, all nodes of the Service Fabric cluster are connected to a load balancer so client traffic can be distributed across the service that is running on all nodes in the cluster.

### Check your running application

In Service Fabric Explorer, identify the node where the service is running. In this example, it runs on Node1:

![Node where service is running](./media/service-fabric-deploy-existing-app/nodeappinsfx.png)

If you navigate to the node and browse to the application, you will see the essential node information, including its location on disk.

![Location on disk](./media/service-fabric-deploy-existing-app/locationondisk2.png)

If you browse to the directory by using Server Explorer, you can find the working directory and the service's log folder as shown below.

![Location of log](./media/service-fabric-deploy-existing-app/loglocation.png)

## Using Visual Studio to package an existing application

Visual Studio provides a Service Fabric service template to help you deploy a guest executable to a Service Fabric cluster.
You need to go through the following, to complete the publishing:

>[AZURE.NOTE] This feature requires [SDK version 2.1.150](https://blogs.msdn.microsoft.com/azureservicefabric/2016/06/13/release-of-service-fabric-sdk-2-1-150-and-runtime-5-1-150/)

1. Choose File -> New Project and create a new Service Fabric Application.
2. Choose Guest Executable as the Service Template.
3. Click Browse to select the folder with your executable and fill in the rest of the parameters to create the new service.
  - *Code Package Behavior* can be set to copy all the content of your folder to the Visual Studio Project, which is useful if the executable will not change. If you expect the executable to change and want the ability to pick up new builds dynamically, you can choose to link to the folder instead.
  - *Program* choose the executable that should be executed in order to start the service.
  - *Arguments* specify the arguments that should be passed to the executable. It can be a list of parameters with arguments.
  - *WorkingFolder* choose the working directory for the process that is going to be started. You can specify two values:
  	- *CodeBase* specifies that the working directory is going to be set to the code directory in the application package (`Code` directory in the structure shown below).
    - *CodePackage* specifies that the working directory is going to be set to the root of the application package	(`MyServicePkg`).
4. Give your service a name and click OK.
5. If your service needs an endpoint for communication, you can now add the Protocol, Port and Type to the ServiceManifest.xml file (e.g.): ```<Endpoint Name="NodeAppTypeEndpoint" Protocol="http" Port="3000" Type="Input" />```.
6. You can now try the package and publish action against your local cluster by debugging the solution in Visual Studio. When ready you can publish the application to a remote cluster or check-in the solution to source control.

>[AZURE.NOTE] You can use linked folders when creating the application project in Visual Studio. This will link to the source location from within the project, making it possible for you to update the guest executable in its source destination, having those updates become part of the application package on build.

## Next steps
In this article, you have learned how to package a guest executable and deploy it to Service Fabric. As a next step, you can check out additional content for this topic.

- [Sample for packaging and deploying a guest executable on GitHub](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started/tree/master/GuestExe/SimpleApplication), including a link to the prerelease of the packaging tool
- [Deploy multiple guest executables](service-fabric-deploy-multiple-apps.md)
- [Create your first Service Fabric application using Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md)
