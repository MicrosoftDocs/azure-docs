<properties
   pageTitle="Deploy an existing application in Azure Service Fabric"
   description="Walkthrough on how to package an existing application so it can be deployed on an Azure Service Fabric cluster"
   services="service-fabric"
   documentationCenter=".net"
   authors="clca"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/06/2015"
   ms.author="claudioc"/>

# Deploy an existing application in Azure Service Fabric

Azure Service Fabric can be used to deploy existing applications. Applications that currently runs on, for instance, an Azure Web or Worker role, can be 'packaged' so that they can be deployed on an Service Fabric cluster. 
Existing applications running on a Service Fabric cluster can benefit from features such as health monitoring and ALM (Application Lifecycle Management) so it is an important scenario that is fully supported.
This tutorial explains the process and basic concepts that are involved with taking an existing application and package it.
This article that is an overview of the process, we will follow up with specific examples on how to take an existing applications (for instance a node.js or Java) app and package it so it can be hosted on a Service Fabric cluster.

## Quick overview of Application and Service manifest files

Before we can start and learn how to package an existing application, we need to go through an brief introduction of the Service Fabric's deployment model.
Service Fabric deployment model relies mainly on two files:


* Application Manifest. The application manifest is used to describe the application and lists the services that compose it plus other parameters,  such as the number of instances, that are used to define how the service(s) should be deployed.In the Service Fabric world,  an application is the 'upgradable unit'. An application can be upgraded as a single unit where potential failures (and potential rollbacks) are managed by the platform to guarantee that the upgrade process either completely success or, if it fails, it does not leave the application is an unknown/unstable state.

This is an example of an application manifest:

	

	<?xml version="1.0" encoding="utf-8"?>
	<ApplicationManifest ApplicationTypeName="actor2Application" ApplicationTypeVersion="1.0.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	  <ServiceManifestImport>
		<ServiceManifestRef ServiceManifestName="actor2Pkg" ServiceManifestVersion="1.0.0.0" />
		<ConfigOverrides />
	  </ServiceManifestImport>
	  <DefaultServices>
		<Service Name="actor2">
		  <StatelessService ServiceTypeName="actor2Type">
			<SingletonPartition />
		  </StatelessService>
		</Service>
	  </DefaultServices>
	</ApplicationManifest>

* Service Manifest. Service Manifest describes the components of a service. It includes data such as name and type of the service (information that Service Fabric uses to manage the service), its code, configuration and data components plus some additional parameters that can be used to configure the service once it is deployed. We are not going into the details of all the different parameters available in the service manifest, we will go through the subset that is required to make an existing application to run on Service Fabric

This is an example of a service manifest

	<?xml version="1.0" encoding="utf-8"?>
	<ServiceManifest Name="actor2Pkg"
	                 Version="1.0.0.0"
	                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
	                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
	                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	  <ServiceTypes>
	    <StatelessServiceType ServiceTypeName="actor2Type" />
	  </ServiceTypes>
	
	  <CodePackage Name="Code" Version="1.0.0.0">
	    <EntryPoint>
	      <ExeHost>
	        <Program>actor2.exe</Program>
	      </ExeHost>
	    </EntryPoint>
	  </CodePackage>
	
	  <ConfigPackage Name="Config" Version="1.0.0.0" />
	
	  <Resources>
	    <Endpoints>
	      <Endpoint Name="ServiceEndpoint" />
	    </Endpoints>
	  </Resources>
	</ServiceManifest>
	
## Application Package file structure
In order to deploy an application using, for instance, the powershell cmdlets, the application needs to follow a predefined directory structure.

\applicationmanifest.xml
\MyServicePkg
			\servicemanifest.xml
			\code
			\config
			\data

The root contains the applicationmanifest.xml file that defines the application. A subdirectory for each service included in the application is used to contain all the artifacts that the service requires: The servicemanifest.xml and, typically 3 directories:

* code: contains the service code
* config: contains a settings.xml file (and other files if necessary) that the service can access at runtime to retrieve specific configuration settings.
* Data: an additional directory to store additional local data that service may need. Note: Data should be used to store only ephymeral data, Service Fabric does not copy/replicate changes to the data directory if the service needs to be relocated, for instance, during failover. 

Note: You can use any arbitrary directory name for Code, Config and Data. You should need to make sure to use the same value in the ApplicationManifest file. 

## the process of packaging an existing app
The process of packaging an existing application is based on the following steps:

* Create the package directory structure
* Add application's code and configuration files
* update the service manifest file
* update the application manifest


### Create the package directory structure
You can start by creating the directory structure as described above. I created a directory and copied the application and service manifest from an existing project that I previously had created in Visual Studio. 

![][1] ![][2]


### Add the application's code and configuration files
After you have created the directory structure, you can add the application's code and configuration files under the Code and Config directory. You can also create additional directories or sub directories under the Code or Config directories. Service Fabric does an xcopy of the content of the application root directory so there is no predefined structure to use other than creating two top directories Code and Settings (but you can pick different names if you want, more details in the next section). 

!Azure Note: Make sure that you include all the files/dependencies that the application needs. Service Fabric will copy the content of the application package on all nodes in the cluster where the application's services are going to be deployed. The package should contain all the code that the application needs in order to run. It is not recommended to assume that the dependencies are already installed. 

### Edit the Service Manifest file
The next step is to edit the Service Manifest file to include the following information:
* The name of the service type. This is an 'Id' that Service Fabric uses in order to identify a service
* The command to use to launch the application (ExeHost)
* Any script that needs to be run in order to setup/configure the application (SetupEntrypoint

This is an example of a `servicemanifest.xnml` file that 'packages' a node.js application:

	<?xml version="1.0" encoding="utf-8"?>
	<ServiceManifest Name="VisualObjectsNodejsWebServicePkg"
	                 Version="1.0.0.0"
	                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
	                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
	                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	  <ServiceTypes>
	    <StatelessServiceType ServiceTypeName="VisualObjectsNodejsWebServiceType" UseImplicitHost="true" />
	  </ServiceTypes>
	  <CodePackage Name="Code" Version="1.0.0.0">
	    <EntryPoint>
	      <ExeHost>
	        <Program>node.exe</Program>
	        <Arguments>server.js</Arguments>
	        <WorkingFolder>CodeBase</WorkingFolder>
	      </ExeHost>
	    </EntryPoint>
	  </CodePackage>
	  <ConfigPackage Name="Config" Version="1.0.0.0"/>
	  <Resources>
	    <Endpoints>
	      <Endpoint Name="ServiceEndpoint" />
	    </Endpoints>
	  </Resources>
	</ServiceManifest>


Let's go over the different part of the file that you need to update:

### ServiceTypes:

```
<ServiceTypes>
<StatelessServiceType ServiceTypeName="VisualObjectsNodejsWebServiceType" UseImplicitHost="true" />
</ServiceTypes>
```

* You can pick any name that you want for `ServiceTypeName`, the value is used in the `applicationmanifest.xml` to identify the service.
* You need to specify `UserImplicitHost = "true"`. This attribute tells Service Fabric that the service is based on a self-contained app so that it needs to do is just to launch it as a process and monitor its health.


### CodePackage 
The CodePackage specifies the location (and version) of the service's code. 


	<CodePackage Name="Code" Version="1.0.0.0">


The `Name` element is used to specify the name of the directory in the Application Package that contains the service's code. `CodePackage` also has the `version` attribute that can be used to specify the version of the code and, potentially, be used to upgrade the service's code by leveraging Service Fabric's Application LifeCycle Management infrastructure.


### Entrypoint


	<EntryPoint>
	  <ExeHost>
	    <Program>node.exe</Program>
	    <Arguments>server.js</Arguments>
	    <WorkingFolder>CodeBase</WorkingFolder>
	  </ExeHost>
	</EntryPoint>


The `Entrypoint` element in the service manifest file is used to specify how to launch the service. The `ExeHost` element specifies the executable (and arguments) that should be used to launch the service. 

* `Program`:specifies the name of the executable that should be executed in order to start the service. 
* `Arguments`: it specifies the arguments that should be passed to the executable. it can be a list of parameters with arguments.
* `WorkingFolder`: it specifies the working directory for the process that is going to be started. You can specify two values:
	* `CodeBase`: the working directory is going to be set to the Code directory in the application package (`Code` directory in the structure shown below)
	* `CodePackage`: the working directory will be set to the root of the application package	(`MyServicePkg`)
`WorkingDirectory` element is useful to set the correct working directory so relative paths can be used by either the application or initialization scripts.
There is also another value that you can specify for the `WorkingFolder` element (`Work`) but it is not very useful for the scenario of bringing an existing application.


```

\applicationmanifest.xml
\MyServicePkg

			\servicemanifest.xml
			\code
				 \bin
				  \ ...
			\config
			\data
			\...

```


#### The setup entry point

	<SetupEntryPoint>
	    <ExeHost>
	        <Program>scripts\myAppsetup.cmd</Program>
	    </ExeHost>
	</SetupEntryPoint>


The `SetupEntrypoint` is used to specify any executable or batch file that should be executed before the service's code is launched. It is an optional element so it does not need to be included if there is no intialization/setup that is required. The Entrypoint is executed every time the service is restarted. There is only one SetupEntrypoint so setup/config scripts needs to be boundled on a single batch file if the application's setup/config requires multiple scripts. Like the `Entrypoint` element, `SetupEntrypoint` can execute any type of file: executable, batch fiules, powershell cmdlet.
In the example above, the `SetupEntrypoint` is based on a batch file myAppsetup.cmd that is located in the scripts subdirectory of the Code directory (assuming the `WorkingDirectory` element is set to `Code`).

## Application Manifest file

Once you have configured the `servicemanifest.xml` file you need to make some changes to the `applicationmanifest.xml` file to ensure the correct Service type and name are used.

	<ServiceManifestImport>
		<ServiceManifestRef ServiceManifestName="MyServicePkg" ServiceManifestVersion="1.0.0.0" />
	</ServiceManifestImport>
	<DefaultServices>
	<Service Name="actor2">
	  <StatelessService ServiceTypeName="MyServiceType" InstanceCount = "1">
	  </StatelessService>
	</Service>
	</DefaultServices>

### ServiceManifestImport

In the `ServiceManifestImport` you can specify one or more services that you want to include in the app. Services are referenced with `ServiceManifestName` that specifies the name of the directory where the `servicemanifest.xml` file is located.

	<ServiceManifestImport>
		<ServiceManifestRef ServiceManifestName="MyServicePkg" ServiceManifestVersion="1.0.0.0" />
	</ServiceManifestImport>

### DefaultServices

The `DefaultServices` element in the application manifest file is used to define some service properties.

	<DefaultServices>
	<Service Name="actor2">
	  <StatelessService ServiceTypeName="MyServiceType" InstanceCount="1">
	  </StatelessService>
	</Service>


* `ServiceTypeName` is used as an 'Id' for the service. in the context of porting an existing application, `ServiceTypeName` just need to be a unique identifies for your service.
* `StatelessService`: Service Fabric supports two types of services: Stateless and Stateful. In the case of porting an existing application the service is a stateless service so `StatelessService` should always be used.

A Service Fabric service can be deployed in various 'configurations', for instance it can be deployed as a single or multiple instances or it can be deployed in such a way that there is one instance of the service on each node of the Service Fabric cluster.
In the `applicationmanifest.xml` file you can specify how you want the application to be deployed

* `InstanceCount`: is used to specify how many instances of the service should be launched in the Service Fabric cluster. You can set the `InstanceCount` value depending on the type of application that you are deploying. The two most common scenarios are:
	* `InstanCount = "1"`: in this case only one instance of the service will be deployed on the cluster. Service Fabric's scheduler determines on which node the service is going to be deployed. A single instance count also makes sense for applications that require a different configuration if they run on multiple instances. In that case it is easier to define multiple services in the same application manifest file and use `InstanceCount = "1"`. So the end result will be to have multiple instances of the same service but each with a specific configuration. A value of `InstanceCount` greater than one makes sense only if the goal is to have multiple instance of the exact same configuration.
	* `InstanceCount ="-1"`: in this case one instance of the service will be deployed on every node in the Service Fabric cluster. The end result will be having one (and only one) instance of the service for each node in the cluster. This is a useful configuration for front-end applications (ex. a REST endpoint) because client applications just need to 'connect' to any of the node in the cluster in order to use the endpoint. This configuration can also be used when, for instance, all nodes of the Service Fabric cluster are connected to a load balancer so client traffic can be distributed across the service running on all nodes in the cluster.


### Testing
For existing application is very useful to be able to see console logs to find out if the application and configuration scripts don't show any error.
Console redirection can be configured in the `servicemanifest.xml` file using the `ConsoleRedirection` element

	<EntryPoint>
	  <ExeHost>
	    <Program>node.exe</Program>
	    <Arguments>server.js</Arguments>
	    <WorkingFolder></WorkingFolder>
	    <ConsoleRedirection FileRetentionCount="5" FileMaxSizeInKb="2048"/>
	  </ExeHost>
	</EntryPoint>


* `ConsoleRedirection` can be used to redirect console output (both stdout and stderr) to a working directory so they can be used to verify that there are no errors during the setup or execution of the application in the Service Fabric cluster.
	* `FileRetentionCount` determines how many files are saved in the working directory. A value of, for instance, 5 means that the log files for the previous 5 executions are stored in the working directory.
	* `FileMaxSizeInKb` specifies the max size of the log files. 

Log files are saved on one of the service's working directories, in order to determine where the files are located, you need to use the Service Fabric Explorer to determine in which node the service is running and which is the working directory that is currently used.

In the Service Fabric explorer, identify the node where the service is running

![][3]

After you know the node where the service is currently running, you can find out which is the working directory used

![][4]

When you select the name of the service, on the right panel you can see there the service code and settings are stored

![][5]

If you click on the link in the 'Disk Location' field you can access the directory where the services is running on.

![][6]

The log directory contains all log files.

Note: This example shows the case of a single instance of the service running in the cluster. If there are multiple instances you may need to check the log file on all the nodes where the service is running.

 
## What's next
We are working on a tools that can be used to package an existing application simply by pointing it at the root of the directory structure of the app. The tool takes care of generate the manifest files and configure the basic settings that are required to 'transform' the application in a Service Fabric service.


<!--Image references-->
[1]: ./media/service-fabric-deploy-an-existing-app/directory-structure-1.PNG
[2]: ./media/service-fabric-deploy-an-existing-app/directory-structure-2.PNG
[3]: ./media/service-fabric-deploy-an-existing-app/service-node-1.PNG
[4]: ./media/service-fabric-deploy-an-existing-app/service-node-2.PNG
[5]: ./media/service-fabric-deploy-an-existing-app/service-node-3.PNG
[6]: ./media/service-fabric-deploy-an-existing-app/service-node-4.PNG

	


