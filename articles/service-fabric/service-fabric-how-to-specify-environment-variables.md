---
title: Specify environment variables for services
description: Shows you how to use environment variables for applications in Service Fabric
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# How to specify environment variables for services in Service Fabric

This article shows you how to specify environment variables for a service or container in Service Fabric.

## Procedure for specifying environment variables for services

In this example, you set an environment variable for a container. The article assumes you already have an application and service manifest.

1. Open the ServiceManifest.xml file.
2. In the `CodePackage` element, add a new `EnvironmentVariables` element and an `EnvironmentVariable` element for each environment variable.

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

3. To override the environment variables in the application manifest, use the `EnvironmentOverrides` element.

    ```xml
      <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="Guest1Pkg" ServiceManifestVersion="1.0.0" />
        <EnvironmentOverrides CodePackageRef="MyCode">
          <EnvironmentVariable Name="MyEnvVariable" Value="OverrideValue"/>
        </EnvironmentOverrides>
      </ServiceManifestImport>
    ```

## Specifying environment variables dynamically using Docker Compose

Service Fabric supports the ability to [Use Docker Compose for Deployment](service-fabric-docker-compose.md#supported-compose-directives). Compose files can source environment variables from the shell. This behavior can be used to substitute desired environment values dynamically:

```yml
environment:
  - "hostname:${hostname}"
```

## Next steps
To learn more about some of the core concepts that are discussed in this article, see the [Manage applications for multiple environments articles](service-fabric-manage-multiple-environment-app-configuration.md).

For information about other app management capabilities that are available in Visual Studio, see [Manage your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
