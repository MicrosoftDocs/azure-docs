---
title: Azure Service Fabric application model
description: Introducing StartupServices.xml in Service Fabric Application Model.

ms.topic: conceptual
ms.date: 05/05/2021
---
# Summary
This feature provides support for StartupServices.xml as an alternative to Default Services specified in ApplicationManifest.xml for the Visual Studio debugging experience. With this implementation, DefaultServices and Service definition related parameters are moved from existing ApplicationManifest.xml to a new file called StartupServices.xml. Functionality for each function - from addition of a new service to deployment (Build/Rebuild/F5/Ctrl+F5/Publish experiences in Visual Studio) is provided to work this new feature end to end.

## Existing Service Fabric Application Design
As of now, for each service fabric application ApplicationManifest.xml is the source of all service-related information for the application. ApplicationManifest.xml consists of all Parameters, ServiceManifestImport and DefaultServices. Configuration parameters for Cloud/Local1Node/Local5Node are mentioned under ApplicationParameters.

When a new service is added in application, Parameters, ServiceManifestImport and DefaultServices are added for this new service inside ApplicationManifest.xml and configuration parameters are added in Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters.

During Build/Rebuild of project, modification (if a service has been removed) of ServiceManifestImport, Parameters and DefaultServices happens in ApplicationManifest.xml and Parameters are also edited in Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters.

When F5/Ctrl+F5/Publish is triggered in Visual Studio the information is consumed from ApplictionManifest.xml for each service and configuration parameters file (any of Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters) as shown in picture below.

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
New design introduces StartupServices.xml as an alternative to Default Services specified in ApplicationManifest.xml for the Visual Studio debugging experience. With this implementation, DefaultServices and Service definition related parameters are moved from existing ApplicationManifest.xml to a new file called StartupServices.xml. 

In this design, there is a clear distinction between service level information (e.g., Service definition and Service parameters) and application-level information (ServiceManifestImport and ApplicationParameters). StartupServices.xml contains all service-level information whereas ApplicationManifest.xml contains all application-level information. Another change introduced is addition of Cloud.xml/Local1Node.xml/Local5Node.xml under StartupServiceParameters which will have configuration for service parameters only and existing Cloud.xml/Local1Node.xml/Local5Node.xml under ApplicationParameters contains only application-level parameters configuration.

When a new service is added in application, Application-level Parameters and ServiceManifestImport are added in ApplicationManifest.xml and configuration for application parameters are added in Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters. Service information and Service Parameters are added in StartupServices.xml and configuration for service parameters are added in Cloud.xml/Local1Node.xml/Local5Node.xml under StartupServiceParameters.

During Build/Rebuild of project, modification of ServiceManifestImport (if a service has been removed), Application Parameters happens in ApplicationManifest.xml and Application Parameters are also edited in Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters. Service-related information is edited in StartupServices.xml and Service Parameters are edited in Cloud.xml/Local1Node.xml/Local5Node.xml under StartupServiceParameters.

When F5/Ctrl+F5/Publish is triggered in Visual Studio, the application information is consumed from ApplictionManifest.xml and configuration parameters file (any of Cloud.xml/Local1Node.xml/Local5Node.xml files under ApplicationParameters), with this information Application is registered and after this, each service is started individual with service information from StartupServices.xml and service-parameters configuration for any of Cloud.xml/Local1Node.xml/Local5Node.xml files under StartupServiceParameters.

![New Design for a Service Fabric Application with StartupServices.xml][new-design-diagram]

These service parameters and application parameters can be edited before publishing an application (right click Publish option) as shown in picture-

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

The startupServices.xml feature is enabled for all new project in SDK version 5.0.516.9590 and above. For actor services this is enabled in Microsoft.ServiceFabric.Actors nuget version 5.0.516 and above. However old projects opened in VS with newer SDK version are fully backward compatible and migration is not support as of now. If user want to create an SF Application without StartupServices.xml in newer version of SDK, he/she should click on Help me choose a project template link while create the application as shown in picture below.

![Create New Application option in New Design][create-new-project]



## Next steps
- Learn about [Serivice Fabric Application Model](service-fabric-application-model.md).
- Learn about [Serivice Fabric Application and Service Manifests]((service-fabric-application-and-service-manifests.md).

<!--Image references-->
[exisiting-design-diagram]: ./media/service-fabric-startupservices/existing-design.jpg
[new-design-diagram]: ./media/service-fabric-startupservices/new-design.jpg
[publish-application]: ./media/service-fabric-startupservices/publish-application.jpg
[create-new-project]: ./media/service-fabric-startupservices/create-new-project.jpg

