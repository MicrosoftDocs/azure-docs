---
title: Define Service Configuration in StartupServices.xml for a Service Fabric Application
description: Learn how to use StartupServices.xml to separate service level configuration from ApplicationManifest.xml.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Introducing StartupServices.xml in Service Fabric Application
This feature introduces StartupServices.xml file in a Service Fabric Application design. This file hosts DefaultServices section of ApplicationManifest.xml. With this implementation, DefaultServices and Service definition-related parameters are moved from existing ApplicationManifest.xml to this new file called StartupServices.xml. This file is used in each functionalities (Build/Rebuild/F5/Ctrl+F5/Publish) in Visual Studio.

Note - StartupServices.xml is only meant for Visual Studio deployments, this arrangement is to ensure that packages deployed with Visual Studio (with StartupServices.xml) do not have conflicts with ARM deployed services. StartupServices.xml is not packaged as part of application package. It is not supported in DevOps pipeline and customer should deploy individual services in Application either via ARM or through cmdlets with desired configuration.

## Existing Service Fabric Application Design
For each service fabric application, ApplicationManifest.xml is the source of all service-related information for the application. ApplicationManifest.xml consists of all Parameters, ServiceManifestImport, and DefaultServices. Configuration parameters are mentioned in Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters.

When a new service is added in an application, for this new service Parameters, ServiceManifestImport and DefaultServices sections are added inside ApplicationManifest.xml. Configuration parameters are added in Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters.

When user clicks on Build/Rebuild function in Visual Studio, modification of ServiceManifestImport, Parameters, and DefaultServices sections happens in ApplicationManifest.xml. Configuration parameters are also edited in Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters.

When user triggers F5/Ctrl+F5/Publish, application and services are deployed or published based on the information in ApplictionManifest.xml.  Configuration parameters are used from any of Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters.

![Existing Design for a Service Fabric Application][exisiting-design-diagram]

Sample ApplicationManifest.xml 

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest ApplicationTypeName="SampleAppType"
                     ApplicationTypeVersion="1.0.0"
                     xmlns="http://schemas.microsoft.com/2011/01/fabric"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Parameters>
    <Parameter Name="Web1_ASPNETCORE_ENVIRONMENT" DefaultValue="" />
    <Parameter Name="Web1_MinReplicaSetSize" DefaultValue="3" />
    <Parameter Name="Web1_PartitionCount" DefaultValue="1" />
    <Parameter Name="Web1_TargetReplicaSetSize" DefaultValue="3" />
  </Parameters>
  <!-- Import the ServiceManifest from the ServicePackage. The ServiceManifestName and ServiceManifestVersion 
       should match the Name and Version attributes of the ServiceManifest element defined in the 
       ServiceManifest.xml file. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="Web1Pkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <EnvironmentOverrides CodePackageRef="code">
      <EnvironmentVariable Name="ASPNETCORE_ENVIRONMENT" Value="[Web1_ASPNETCORE_ENVIRONMENT]" />
    </EnvironmentOverrides>
  </ServiceManifestImport>
  <DefaultServices>
    <!-- The section below creates instances of service types, when an instance of this 
         application type is created. You can also create one or more instances of service type using the 
         ServiceFabric PowerShell module.
         
         The attribute ServiceTypeName below must match the name defined in the imported ServiceManifest.xml file. -->
    <Service Name="Web1" ServicePackageActivationMode="ExclusiveProcess">
      <StatefulService ServiceTypeName="Web1Type" TargetReplicaSetSize="[Web1_TargetReplicaSetSize]" MinReplicaSetSize="[Web1_MinReplicaSetSize]">
        <UniformInt64Partition PartitionCount="[Web1_PartitionCount]" LowKey="-9223372036854775808" HighKey="9223372036854775807" />
      </StatefulService>
    </Service>
  </DefaultServices>
</ApplicationManifest>
```

## New Service Fabric Application Design with StartupServices.xml
In this design, there is a clear distinction between service level information (for example, Service definition and Service parameters) and application-level information (ServiceManifestImport and ApplicationParameters). StartupServices.xml contains all service-level information whereas ApplicationManifest.xml contains all application-level information. Another change introduced is addition of Cloud.xml/Local1Node.xml/Local5Node.xml under StartupServiceParameters, which has configuration for service parameters only. Existing Cloud.xml/Local1Node.xml/Local5Node.xml under ApplicationParameters contains only application-level parameters configuration.

When a new service is added in application, Application-level Parameters and ServiceManifestImport are added in ApplicationManifest.xml. Configuration for application parameters are added in Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters. Service information and Service Parameters are added in StartupServices.xml and configuration for service parameters are added in Cloud.xml/Local1Node.xml/Local5Node.xml under StartupServiceParameters.

During Build/Rebuild of project, modification of ServiceManifestImport, Application Parameters happens in ApplicationManifest.xml. Configuration of Application Parameters is also edited in Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters. Service-related information is edited in StartupServices.xml and Service Parameters are edited in Cloud.xml/Local1Node.xml/Local5Node.xml under StartupServiceParameters.

When F5/Ctrl+F5/Publish is triggered in Visual Studio, application is deployed/published based on information from ApplictionManifest.xml and application parameters from any of Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters. Each service is started individually with service information from StartupServices.xml and service-parameters configuration from any of Cloud.xml/Local1Node.xml/Local5Node.xml files under StartupServiceParameters.

![New Design for a Service Fabric Application with StartupServices.xml][new-design-diagram]

These service parameters and application parameters can be edited before publishing an application (Right click->Publish) as shown in picture.

![Publish option in New Design][publish-application]

Sample ApplicationManifest.xml in new design
```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest ApplicationTypeName="SampleAppType"
                     ApplicationTypeVersion="1.0.0"
                     xmlns="http://schemas.microsoft.com/2011/01/fabric"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Parameters>
    <Parameter Name="Web1_ASPNETCORE_ENVIRONMENT" DefaultValue="" />
  </Parameters>
  <!-- Import the ServiceManifest from the ServicePackage. The ServiceManifestName and ServiceManifestVersion 
       should match the Name and Version attributes of the ServiceManifest element defined in the 
       ServiceManifest.xml file. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="Web1Pkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <EnvironmentOverrides CodePackageRef="code">
      <EnvironmentVariable Name="ASPNETCORE_ENVIRONMENT" Value="[Web1_ASPNETCORE_ENVIRONMENT]" />
    </EnvironmentOverrides>
  </ServiceManifestImport>
</ApplicationManifest>
```

Sample StartupServices.xml file
```xml
<?xml version="1.0" encoding="utf-8"?>
<StartupServicesManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                         xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Parameters>
    <Parameter Name="Web1_InstanceCount" DefaultValue="-1" />
  </Parameters>
  <Services>
    <!-- The section below creates instances of service types, when an instance of this 
         application type is created. You can also create one or more instances of service type using the 
         ServiceFabric PowerShell module.

         The attribute ServiceTypeName below must match the name defined in the imported ServiceManifest.xml file. -->
    <Service Name="Web1" ServicePackageActivationMode="ExclusiveProcess">
      <StatelessService ServiceTypeName="Web1Type" InstanceCount="[Web1_InstanceCount]">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </Services>
</StartupServicesManifest>
```

The startupServices.xml feature is enabled for all new project in SF SDK version 5.0.516.9590 and above. Projects created with older version of SDK are are fully backward compatible with latest SDK. Migration of old projects into new design is not supported. If user wants to create an Service Fabric Application without StartupServices.xml in newer version of SDK, user should click on "Help me choose a project template" link as shown in picture below.

![Create New Application option in New Design][create-new-project]


## Next steps
- Learn about [Service Fabric Application Model](service-fabric-application-model.md).
- Learn about [Service Fabric Application and Service Manifests](service-fabric-application-and-service-manifests.md).

<!--Image references-->
[exisiting-design-diagram]: ./media/service-fabric-startupservices/existing-design.png
[new-design-diagram]: ./media/service-fabric-startupservices/new-design.png
[publish-application]: ./media/service-fabric-startupservices/publish-application.png
[create-new-project]: ./media/service-fabric-startupservices/create-new-project.png

