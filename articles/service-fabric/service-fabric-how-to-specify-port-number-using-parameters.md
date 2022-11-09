---
title: Specify port number of a service using parameters
description: Shows you how to use parameters to specify the port for an application in Service Fabric
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# How to specify the port number of a service using parameters in Service Fabric

This article shows you how to specify the port number of a service using parameters in Service Fabric using Visual Studio.

## Procedure for specifying the port number of a service using parameters

In this example, you set the port number for your asp.net core web API using a parameter.

1. Open Visual Studio and create a new Service Fabric application.
1. Choose the Stateless ASP.NET Core template.
1. Choose Web API.
1. Open the ServiceManifest.xml file.
1. Note the name of the endpoint specified for your service. Default is `ServiceEndpoint`.
1. Open the ApplicationManifest.xml file
1. In the `ServiceManifestImport` element, add a new `RessourceOverrides` element with a reference to the endpoint in your ServiceManifest.xml file.

    ```xml
      <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="Web1Pkg" ServiceManifestVersion="1.0.0" />
        <ResourceOverrides>
          <Endpoints>
            <Endpoint Name="ServiceEndpoint"/>
          </Endpoints>
        </ResourceOverrides>
        <ConfigOverrides />
      </ServiceManifestImport>
    ```

1. In the `Endpoint` element, you can now override any attribute using a parameter. In this example, you specify `Port` and set it to a parameter name using square brackets - for example, `[MyWebAPI_PortNumber]`

    ```xml
      <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="Web1Pkg" ServiceManifestVersion="1.0.0" />
        <ResourceOverrides>
          <Endpoints>
            <Endpoint Name="ServiceEndpoint" Port="[MyWebAPI_PortNumber]"/>
          </Endpoints>
        </ResourceOverrides>
        <ConfigOverrides />
      </ServiceManifestImport>
    ```

1. Still in the ApplicationManifest.xml file, you then specify the parameter in the `Parameters` element

    ```xml
      <Parameters>
        <Parameter Name="MyWebAPI_PortNumber" />
      </Parameters>
    ```

1. And define a `DefaultValue`

    ```xml
      <Parameters>
        <Parameter Name="MyWebAPI_PortNumber" DefaultValue="8080" />
      </Parameters>
    ```

1. Open the ApplicationParameters folder and the `Cloud.xml` file
1. To specify a different port to be used when publishing to a remote cluster, add the parameter with the port number to this file.

    ```xml
      <Parameters>
        <Parameter Name="MyWebAPI_PortNumber" Value="80" />
      </Parameters>
    ```

When publishing your application from Visual Studio using the Cloud.xml publish profile, your service is configured to use port 80. If you deploy the application without specifying the MyWebAPI_PortNumber parameter, the service uses port 8080.

## Next steps
To learn more about some of the core concepts that are discussed in this article, see the [Manage applications for multiple environments articles](service-fabric-manage-multiple-environment-app-configuration.md).

For information about other app management capabilities that are available in Visual Studio, see [Manage your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
