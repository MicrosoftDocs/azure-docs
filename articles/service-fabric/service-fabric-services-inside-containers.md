---
title: How to containerize your Service Fabric micro-services  Preview
description: Azure Service Fabric Has added new functionality to containerize your Service Fabric micro-services. This support is currently in preview.
services: service-fabric
documentationcenter: .net
author: anmolah
manager: anmolah
editor: 'anmolah'

ms.assetid: 0b41efb3-4063-4600-89f5-b077ea81fa3a
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 8/04/2017
ms.author: anmola
---
# How to containerize your Service Fabric micro-services (Preview)

Service Fabric now has support for containerizing Service Fabric micro-services (Stateless, Actor and Reliable Collection based services). For more information please read [service fabric containers](service-fabric-containers-overview).

The main reasons to consider containerizing your Service Fabric service are similar to the benefits you would receive when containerizing your applications
-	Portability - The service has all the dependencies it needs, so will run anywhere
-	Customers can use teh existing build pipelines defined for their other containerized applications
-	Resource governance


> [!NOTE]
> This feature is in preview and is not supported. currenlty this feature only works for Windows

## Steps to containerize your Service Fabric Application

Please follow the steps below in order to successfully containerize and deploy a service fabric application to your cluster.

1. Open your Service Fabric application in *Visual Studio*

2. Add class at [TODO: Insert git hub link here] to your project. This is a helper to correctly load the Service Fabric runtime binaries inside your application when running inside a container

3. For each code package you would like to containerize initialize the loader at the program entry point. You could add the code snippet below to your program entry point file assuming it is in *Program.cs*

  ```csharp
        static Program()
        {
            SFBinaryLoader.Initialize();
        }
  ```

4. Build and [package](service-fabric-package-apps.md#Package-App) your project

5. For every code package you need to containerize, please run the powershell script at [TODO: Insert path to CreateDockerPackage.ps1]. The usage is as follows
  ```powershell
    $codePackagePath = 'Path to the code package to containerize'
    $dockerPackageOutputDirectoryPath = 'Output path for the generated docker folder'
    $applicationExeName = 'Name of the ode package executable'
    CreateDockerPackage.ps1 -CodePackageDirectoryPath $codePackagePath -DockerPackageOutputDirectoryPath $dockerPackageOutputDirectoryPath -ApplicationExeName $applicationExeName
 ```
  The script will create a folder with docker artifacts at $dockerPackageOutputDirectoryPath. Modify the generated Dockerfile to expose any ports, run setup scripts etc. based on your needs.

6. Next you need to [build](service-fabric-get-started-containers.md#Build-Containers) and [push](service-fabric-get-started-containers.md#Push-Containers) your docker container package to your repository

7. Please modify the ApplicationManifest.xml and ServiceManifest.xml to add your container image and repository information, registry authentication, and port-to-host mapping by following the guidelines described in this [article](service-fabric-get-started-containers.md).
Your code package executable will need to be replaced with the corresponding docker image as shown below.

  ```xml
<!-- Code package is your service executable. -->
<CodePackage Name="Code" Version="1.0.0">
  <EntryPoint>
    <!-- Follow this link for more information about deploying Windows containers to Service Fabric: https://aka.ms/sfguestcontainers -->
    <ContainerHost>
      <ImageName>myregistry.azurecr.io/samples/helloworldapp</ImageName>
    </ContainerHost>
  </EntryPoint>
  <!-- Pass environment variables to your container: -->    
</CodePackage>
  ```

8. To test this application you will need to deploy it to a cluster which is at least running at version [version here]. In addition you will need to edit and update the cluster settings to enable this preview feature. Please follow the steps in this [article](service-fabric-cluster-fabric-settings.md) to add the setting below.
```
      {
        "name": "Hosting",
        "parameters": [
          {
            "name": "FabricContainerAppsEnabled",
            "value": "true"
          }
        ]
      }
```
9. Next [deploy](service-fabric-deploy-remove-applications.md) the edited application package to this cluster.

You should now have a containerized "Enlightened" Service Fabric application running your cluster.
