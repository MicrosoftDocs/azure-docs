---
title: How-to specify environment variables for services in Azure Service Fabric | Microsoft Docs
description: Shows you how to use environment variables for applications in Service Fabric
documentationcenter: .net
author: mikkelhegn
manager: markfuss
editor: ''

ms.service: service-fabric

ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA

ms.workload: NA
ms.date: 12/06/2017
ms.author: mikhegn

---
# How to specify environment variables for services in Service Fabric

This article shows you how to specify environment variables for a service or container in Service Fabric.

## Procedure for specifying environment variables for services

In this example, you set an environment variable for a container. The article assumes you already have an application and service manifest.

1. Open the ServiceManifest.xml file.
1. In the `CodePackage` element, add a new `EnvironmentVariables` element and an `EnvironmentVariable` element for each environment variable.

    ```xml
      <CodePackage Name="MyCode" Version="CodeVersion1">
      ...
        <EnvironmentVariables>
          <EnvironmentVariable Name="MyEnvVariable" Value="DefaultValue"/>
          <EnvironmentVariable Name="HttpGatewayPort" Value="19080"/>
        </EnvironmentVariables>
      </CodePackage>
    ```

    Environment variables can be overridden in the application manifest.

1. To override the environment variables in the application manifest, use the `EnvironmentOverrides` element.

    ```xml
      <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontEndServicePkg" ServiceManifestVersion="1.0.0" />
        <EnvironmentOverrides CodePackageRef="MyCode">
          <EnvironmentVariable Name="MyEnvVariable" Value="OverrideValue"/>
        </EnvironmentOverrides>
      </ServiceManifestImport>
    ```

## Next steps
To learn more about some of the core concepts that are discussed in this article, see the [Manage applications for multiple environments articles](service-fabric-manage-multiple-environment-app-configuration.md).

For information about other app management capabilities that are available in Visual Studio, see [Manage your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).