---
title: Azure Service Fabric reliable services application manifest examples | Microsoft Docs
description: Learn how to configure application and service manifest settings for a reliable services Service Fabric application.
services: service-fabric
documentationcenter: na
author: peterpogorski
manager: chackdan
editor: 
ms.assetid: 
ms.service: service-fabric
ms.devlang: xml
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 06/11/2018
ms.author: pepogors
---

# Reliable services application and service manifest examples
The following are examples of the application and service manifests for a Service Fabric application with an ASP.NET Core web front-end and a stateful back-end. The purpose of these examples is to show what settings are available and how to use them. These application and service manifests are based on the [Service Fabric .NET Quickstart](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/) manifests.

The following features are shown:

|Manifest|Features|
|---|---|
|[Application manifest](#application-manifest)| [resource governance](service-fabric-resource-governance.md), [run a service as a local admin account](service-fabric-application-runas-security.md), [apply a default policy to all service code packages](service-fabric-application-runas-security.md#apply-a-default-policy-to-all-service-code-packages), [create user and group principals](service-fabric-application-runas-security.md), share a data package between service instances, [override service endpoints](service-fabric-service-manifest-resources.md#overriding-endpoints-in-servicemanifestxml)| 
|FrontEndService service manifest| [Run a script at service startup](service-fabric-run-script-at-service-startup.md), [define an HTTPS endpoint](service-fabric-tutorial-dotnet-app-enable-https-endpoint.md#define-an-https-endpoint-in-the-service-manifest) | 
|BackEndService service manifest| [Declare a config package](service-fabric-application-and-service-manifests.md), [declare a data package](service-fabric-application-and-service-manifests.md), [configure an endpoint](service-fabric-service-manifest-resources.md)| 

See [Application manifest elements](#application-manifest-elements), [VotingWeb service manifest elements](#votingweb-service-manifest-elements), and [VotingData service manifest elements](#votingdata-service-manifest-elements) for more information on specific XML elements.

## Application manifest

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="VotingType" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Parameters>
    <Parameter Name="VotingData_MinReplicaSetSize" DefaultValue="3" />
    <Parameter Name="VotingData_PartitionCount" DefaultValue="1" />
    <Parameter Name="VotingData_TargetReplicaSetSize" DefaultValue="3" />
    <Parameter Name="VotingWeb_InstanceCount" DefaultValue="-1" />
    <Parameter Name="CpuCores" DefaultValue="2" />
    <Parameter Name="Memory" DefaultValue="4084" />
    <Parameter Name="BlockIOWeight" DefaultValue="200" />
    <Parameter Name="MaximumIOBandwidth" DefaultValue="1024" />
    <Parameter Name="MemoryReservationInMB" DefaultValue="1024" />
    <Parameter Name="MemorySwapInMB" DefaultValue="4084"/>
    <Parameter Name="Port" DefaultValue="8081" />
    <Parameter Name="Protocol" DefaultValue="tcp" />
    <Parameter Name="Type" DefaultValue="internal" />
  </Parameters>
  <!-- Import the ServiceManifest from the ServicePackage. The ServiceManifestName and ServiceManifestVersion 
       should match the Name and Version attributes of the ServiceManifest element defined in the 
       ServiceManifest.xml file. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="VotingDataPkg" ServiceManifestVersion="1.0.0" />
    <!-- Override endpoints declared in the service manifest. -->
    <ResourceOverrides>
      <Endpoints>
        <Endpoint Name="DataEndpoint" Port="[Port]" Protocol="[Protocol]" Type="[Type]" />
      </Endpoints>
    </ResourceOverrides>

    <!-- Policies to be applied to the imported service manifest. -->
    <Policies>
      
      <!-- Set resource governance at the service package level. -->
      <ServicePackageResourceGovernancePolicy CpuCores="[CpuCores]" MemoryInMB="[Memory]"/>

      <!-- Set resource governance at the code package level. -->
      <ResourceGovernancePolicy CodePackageRef="Code" CpuPercent="10" MemoryInMB="[Memory]" BlockIOWeight="[BlockIOWeight]" 
                                MaximumIOBandwidth="[MaximumIOBandwidth]" MaximumIOps="[MaximumIOps]" MemoryReservationInMB="[MemoryReservationInMB]" 
                                MemorySwapInMB="[MemorySwapInMB]"/>

      <!-- Share the data package across multiple instances of the VotingData service-->
      <PackageSharingPolicy PackageRef="VotingDataPkg.Data"/>

      <!-- Give read rights on the "DataEndpoint" endpoint to the Customer2 account.-->
      <SecurityAccessPolicy GrantRights="Read" PrincipalRef="Customer2" ResourceRef="DataEndpoint" ResourceType="Endpoint"/>         
    </Policies>
  </ServiceManifestImport>
  
  <!-- Import the ServiceManifest from the ServicePackage. The ServiceManifestName and ServiceManifestVersion 
       should match the Name and Version attributes of the ServiceManifest element defined in the 
       ServiceManifest.xml file. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="VotingWebPkg" ServiceManifestVersion="1.0.0" />
    
    <!-- Policies to be applied to the imported service manifest. -->
    <Policies>
      <!-- Run the setup entry point (defined in the imported service manifest) as the SetupAdminUser account 
      (declared in the following Principals section). -->
      <RunAsPolicy CodePackageRef="Code" UserRef="SetupAdminUser" EntryPointType="Setup" />
      
    </Policies>

  </ServiceManifestImport>
  <DefaultServices>
    <!-- The section below creates instances of service types, when an instance of this 
         application type is created. You can also create one or more instances of service type using the 
         ServiceFabric PowerShell module.
         
         The attribute ServiceTypeName below must match the name defined in the imported ServiceManifest.xml file. -->
    <Service Name="VotingData">
      <StatefulService ServiceTypeName="VotingDataType" TargetReplicaSetSize="[VotingData_TargetReplicaSetSize]" MinReplicaSetSize="[VotingData_MinReplicaSetSize]">
        <UniformInt64Partition PartitionCount="[VotingData_PartitionCount]" LowKey="0" HighKey="25" />
      </StatefulService>
    </Service>
    <Service Name="VotingWeb" ServicePackageActivationMode="ExclusiveProcess">
      <StatelessService ServiceTypeName="VotingWebType" InstanceCount="[VotingWeb_InstanceCount]">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </DefaultServices>
  <!-- Define users and groups required to run the services and access resources.  Principals are used in the Policies section(s). -->
  <Principals>
    <!-- Declare a set of groups as security principals, which can be referenced in policies. Groups are useful if there are multiple users 
    for different service entry points and they need to have certain common privileges that are available at the group level. -->
    <Groups>
      <!-- Create a group that has administrator privileges. -->
      <Group Name="LocalAdminGroup">
        <Membership>
          <SystemGroup Name="Administrators" />
        </Membership>
      </Group>
    </Groups>
    <Users>
      <!-- Declare a user and add the user to the Administrators system group. The SetupAdminUser account is used to run the 
      setup entry point of the VotingWebPkg code package (described in the preceding Policies section).-->
      <User Name="SetupAdminUser">
        <MemberOf>
          <SystemGroup Name="Administrators" />
        </MemberOf>
      </User>
      <!-- Create a user. Local user accounts are created on the machines where the application is deployed. By default, these accounts 
      do not have the same names as those specified here. Instead, they are dynamically generated and have random passwords. -->
      <User Name="Customer1" >
        <MemberOf>
          <!-- Add the user to the local administrators group.-->
          <Group NameRef="LocalAdminGroup" />
        </MemberOf>
      </User>
      <!-- Create a user as a local user with the specified account name and password. Local user accounts are created on the machines 
      where the application is deployed. -->
      <User Name="Customer2" AccountType="LocalUser" AccountName="Customer1" Password="MyPassword">
        <MemberOf>
          <!-- Add the user to the local administrators group.-->
          <Group NameRef="LocalAdminGroup" />
        </MemberOf>
      </User>
      <!-- Create a user as NetworkService. -->
      <User Name="MyDefaultAccount" AccountType="NetworkService" />      
    </Users>
  </Principals>
  <!-- Policies applied at the application level. -->
  <Policies>
    <!-- Specify a default user account for all code packages that don’t have a specific RunAsPolicy defined in 
    the ServiceManifestImport section(s). -->
    <DefaultRunAsPolicy UserRef="MyDefaultAccount" />
    
  </Policies>
</ApplicationManifest>

```

## VotingWeb service manifest

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="VotingWebPkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <!-- This is the name of your ServiceType. 
         This name must match the string used in RegisterServiceType call in Program.cs. -->
    <StatelessServiceType ServiceTypeName="VotingWebType" />
  </ServiceTypes>

  <!-- Code package is your service executable. -->
  <CodePackage Name="Code" Version="1.0.0">
    <!-- A privileged entry point that by default runs with the same credentials as Service Fabric (typically the NetworkService account) before 
    any other entry point. Use the setup entry point to set system environment variables, give the account running the service (NETWORK SERVICE, by default) 
    access to a certificate's private key, or perform other setup tasks. In the application manifest, you can change the security permissions to run the startup script 
    under a local system account or an administrator account.  -->
    <SetupEntryPoint>
      <ExeHost>
        <!-- The setup script to run. -->
        <Program>Setup.bat</Program>
        <!-- Pass arguments to the script when it runs.-->
        <Arguments>MyValue</Arguments>
        <!-- The working directory for the process in the code package on the node where the application is deployed. CodePackage sets the working directory to be 
        the root of the code package regardless of where the EXE is defined in the code package directory. This is where the processes can write the data. Writing data 
        in the code package or code base is not recommended as those folders could be shared between different application instances and may get deleted.-->
        <WorkingFolder>CodePackage</WorkingFolder>
        <!-- Warning! Do not use console redirection in a production application, only use it for local development and debugging. Redirects console output from the startup
        script to an output file in the application folder called "log" on the cluster node where the application is deployed and run. Also set the number of output files
        to retain and the maximum file size (in KB). -->
        <ConsoleRedirection FileRetentionCount="10" FileMaxSizeInKb="20480"/>
      </ExeHost>
    </SetupEntryPoint>
    <EntryPoint>
      <ExeHost>
        <Program>VotingWeb.exe</Program>
        <!-- The working directory for the process in the code package on the node where the application is deployed. CodePackage sets the working directory to be 
        the root of the code package regardless of where the EXE is defined in the code package directory. This is where the processes can write the data. Writing data 
        in the code package or code base is not recommended as those folders could be shared between different application instances and may get deleted.-->
        <WorkingFolder>CodePackage</WorkingFolder>
      </ExeHost>
    </EntryPoint>
  </CodePackage>

  <!-- Config package is the contents of the Config directory under PackageRoot that contains an 
       independently-updateable and versioned set of custom configuration settings for your service. -->
  <ConfigPackage Name="Config" Version="1.0.0" />

  <Resources>
    <Endpoints>
      <!-- Configure a HTTPS endpoint on port 443. This endpoint is used by the communication listener to obtain the port on which to 
           listen. Please note that if your service is partitioned, this port is shared with 
           replicas of different partitions that are placed in your code. -->
      <Endpoint Protocol="https" Name="EndpointHttps" Type="Input" Port="443" />
    </Endpoints>
  </Resources>
</ServiceManifest>

```

## VotingData service manifest

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="VotingDataPkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <!-- This is the name of your ServiceType. 
         This name must match the string used in RegisterServiceType call in Program.cs. -->
    <StatefulServiceType ServiceTypeName="VotingDataType"  HasPersistedState="true" />
  </ServiceTypes>

  <!-- Code package is your service executable. -->
  <CodePackage Name="Code" Version="1.0.0">
    <EntryPoint>
      <ExeHost>
        <Program>VotingData.exe</Program>
        <!-- The working directory for the process in the code package on the node where the application is deployed. CodePackage sets the working directory to be 
        the root of the code package regardless of where the EXE is defined in the code package directory. This is where the processes can write the data. Writing data 
        in the code package or code base is not recommended as those folders could be shared between different application instances and may get deleted.-->
        <WorkingFolder>CodePackage</WorkingFolder>
      </ExeHost>
    </EntryPoint>
  </CodePackage>

  <!-- Declares a folder, named by the Name attribute, under PackageRoot that contains a Settings.xml file. This file contains sections of user-defined, 
  key-value pair settings that the process can read back at run time. During an upgrade, if only the ConfigPackage version has changed, 
  then the running process is not restarted. Instead, a callback notifies the process that configuration settings have changed so they can be reloaded dynamically. -->
  <ConfigPackage Name="Config" Version="1.0.0" />
  
  <!-- Declares a folder, named by the Name attribute, under PackageRoot which contains static data files to be consumed by the process at run time. -->
  <DataPackage Name="Data" Version="1.0.0"/>

  <Resources>
    <Endpoints>
      <!-- Define an internal (used for intra-application communication) TCP endpoint. Since no port is specified, one is created and assigned dynamically
           to the service.-->
      <Endpoint Name="DataEndpoint" Protocol="tcp" Type="Internal" />
    </Endpoints>
  </Resources>

</ServiceManifest>

```

## Application manifest elements
### ApplicationManifest Element
Declaratively describes the application type and version. One or more service manifests of the constituent services are referenced to compose an application type. Configuration settings of the constituent services can be overridden using parameterized application settings. Default services, service templates, principals, policies, diagnostics set-up, and certificates can also declared at the application level. For more information, see [ApplicationManifest Element](service-fabric-service-model-schema-elements.md#ApplicationManifestElementApplicationManifestTypeComplexType)

### Parameters Element
Declares the parameters that are used in this application manifest. The value of these parameters can be supplied when the application is instantiated and can be used to override application or service configuration settings. For more information, see [Parameters Element](service-fabric-service-model-schema-elements.md#ParametersElementanonymouscomplexTypeComplexTypeDefinedInApplicationManifestTypecomplexType)

### Parameter Element
An application parameter to be used in this manifest. The parameter value can be changed during application instantiation, or, if no value is supplied the default value is used. For more information, see [Parameter Element](service-fabric-service-model-schema-elements.md#ParameterElementanonymouscomplexTypeComplexTypeDefinedInParameterselement)

### ServiceManifestImport Element
Imports a service manifest created by the service developer. A service manifest must be imported for each constituent service in the application. Configuration overrides and policies can be declared for the service manifest. For more information, see [ServiceManifestImport Element](service-fabric-service-model-schema-elements.md#ServiceManifestImportElementanonymouscomplexTypeComplexTypeDefinedInApplicationManifestTypecomplexType)

### ServiceManifestRef Element
Imports the service manifest by reference. Currently the service manifest file (ServiceManifest.xml) must be present in the build package. For more information, see [ServiceManifestRef Element](service-fabric-service-model-schema-elements.md#ServiceManifestRefElementServiceManifestRefTypeComplexTypeDefinedInServiceManifestImportelement)

### ResourceOverrides Element
Specifies resource overrides for endpoints declared in service manifest resources. For more information, see [ResourceOverrides Element](service-fabric-service-model-schema-elements.md#ResourceOverridesElementResourceOverridesTypeComplexTypeDefinedInServiceManifestImportelement)

### Endpoints Element
The endpoint(s) to override. For more information, see [Endpoints Element](service-fabric-service-model-schema-elements.md#EndpointsElementanonymouscomplexTypeComplexTypeDefinedInResourceOverridesTypecomplexType)

### Endpoint Element
The endpoint, declared in the service manifest, to override. For more information, see [Endpoint Element](service-fabric-service-model-schema-elements.md#EndpointElementEndpointOverrideTypeComplexTypeDefinedInEndpointselement)

### Policies Element
Describes policies (end-point binding, package sharing, run-as, and security access) to be applied on the imported service manifest. For more information, see [Policies Element](service-fabric-service-model-schema-elements.md#PoliciesElementServiceManifestImportPoliciesTypeComplexTypeDefinedInServiceManifestImportelement)

### ServicePackageResourceGovernancePolicy Element
Defines the resource governance policy that is applied at the level of the entire service package. For more information, see [ServicePackageResourceGovernancePolicy Element](service-fabric-service-model-schema-elements.md#ServicePackageResourceGovernancePolicyElementServicePackageResourceGovernancePolicyTypeComplexTypeDefinedInServiceManifestImportPoliciesTypecomplexTypeDefinedInServicePackageTypecomplexType)

### ResourceGovernancePolicy Element
Specifies resource limits for a codepackage. For more information, see [ResourceGovernancePolicy Element](service-fabric-service-model-schema-elements.md#ResourceGovernancePolicyElementResourceGovernancePolicyTypeComplexTypeDefinedInServiceManifestImportPoliciesTypecomplexTypeDefinedInDigestedCodePackageelementDefinedInDigestedEndpointelement)

### PackageSharingPolicy Element
Indicates if a code, config or data package should be shared across service instances of the same service type. For more information, see [PackageSharingPolicy Element](service-fabric-service-model-schema-elements.md#PackageSharingPolicyElementPackageSharingPolicyTypeComplexTypeDefinedInServiceManifestImportPoliciesTypecomplexType)

### SecurityAccessPolicy Element
Grants access permissions to a principal on a resource (such as an endpoint) defined in a service manifest. Typically, it is very useful to control and restrict access of services to different resources in order to minimize security risks. This is especially important when the application is built from a collection of services from a marketplace which are developed by different developers. For more information, see [SecurityAccessPolicy Element](service-fabric-service-model-schema-elements.md#SecurityAccessPolicyElementSecurityAccessPolicyTypeComplexTypeDefinedInServiceManifestImportPoliciesTypecomplexTypeDefinedInSecurityAccessPolicieselementDefinedInDigestedEndpointelement)

### RunAsPolicy Element
Specifies the local user or local system account that a service code package will run as. Domain accounts are supported on Windows Server deployments where Azure Active Directory is available. By default, applications run under the account that the Fabric.exe process runs under. Applications can also run as other accounts, which must be declared in the Principals section. If you apply a RunAs policy to a service, and the service manifest declares endpoint resources with the HTTP protocol, you must also specify a SecurityAccessPolicy to ensure that ports allocated to these endpoints are correctly access-control listed for the RunAs user account that the service runs under. For an HTTPS endpoint, you also have to define a EndpointBindingPolicy to indicate the name of the certificate to return to the client. For more information, see [RunAsPolicy Element](service-fabric-service-model-schema-elements.md#RunAsPolicyElementRunAsPolicyTypeComplexTypeDefinedInServiceManifestImportPoliciesTypecomplexTypeDefinedInDigestedCodePackageelement)

### DefaultServices Element
Declares service instances that are automatically created whenever an application is instantiated against this application type. For more information, see [DefaultServices Element](service-fabric-service-model-schema-elements.md#DefaultServicesElementDefaultServicesTypeComplexTypeDefinedInApplicationManifestTypecomplexTypeDefinedInApplicationInstanceTypecomplexType)

### Service Element
Declares a service to be created automatically when the application is instantiated. For more information, see [Service Element](service-fabric-service-model-schema-elements.md#ServiceElementanonymouscomplexTypeComplexTypeDefinedInDefaultServicesTypecomplexType)

### StatefulService Element
Defines a stateful service. For more information, see [StatefulService Element](service-fabric-service-model-schema-elements.md#StatefulServiceElementStatefulServiceTypeComplexTypeDefinedInServiceTemplatesTypecomplexTypeDefinedInServiceelement)

### StatelessService Element
Defines a stateless service. For more information, see [StatelessService Element](service-fabric-service-model-schema-elements.md#StatelessServiceElementStatelessServiceTypeComplexTypeDefinedInServiceTemplatesTypecomplexTypeDefinedInServiceelement)

### Principals Element
Describes the security principals (users, groups) required for this application to run services and secure resources. Principals are referenced in the policies sections. For more information, see [Principals Element](service-fabric-service-model-schema-elements.md#PrincipalsElementSecurityPrincipalsTypeComplexTypeDefinedInApplicationManifestTypecomplexTypeDefinedInEnvironmentTypecomplexType)

### Groups Element
Declares a set of groups as security principals, which can be referenced in policies. Groups are useful if there are multiple users for different service entry points and they need to have certain common privileges that are available at the group level. For more information, see [Groups Element](service-fabric-service-model-schema-elements.md#GroupsElementanonymouscomplexTypeComplexTypeDefinedInSecurityPrincipalsTypecomplexType)

### Group Element
Declares a group as a security principal, which can be referenced in policies. For more information, see [Group Element](service-fabric-service-model-schema-elements.md#GroupElementanonymouscomplexTypeComplexTypeDefinedInGroupselement)

### Membership Element
 For more information, see [Membership Element](service-fabric-service-model-schema-elements.md#MembershipElementanonymouscomplexTypeComplexTypeDefinedInGroupelement)

### SystemGroup Element
 For more information, see [SystemGroup Element](service-fabric-service-model-schema-elements.md#SystemGroupElementanonymouscomplexTypeComplexTypeDefinedInMembershipelement)

### Users Element
Declares a set of users as security principals, which can be referenced in policies. For more information, see [Users Element](service-fabric-service-model-schema-elements.md#UsersElementanonymouscomplexTypeComplexTypeDefinedInSecurityPrincipalsTypecomplexType)

### User Element
Declares a user as a security principal, which can be referenced in policies. For more information, see [User Element](service-fabric-service-model-schema-elements.md#UserElementanonymouscomplexTypeComplexTypeDefinedInUserselement)

### MemberOf Element
Users can be added to any existing membership group, so it can inherit all the properties and security settings of that membership group. The membership group can be used to secure external resources that need to be accessed by different services or the same service (on a different machine). For more information, see [MemberOf Element](service-fabric-service-model-schema-elements.md#MemberOfElementanonymouscomplexTypeComplexTypeDefinedInUserelement)

### SystemGroup Element
The system group to add the user to.  The system group must be defined in the Groups section. For more information, see [SystemGroup Element](service-fabric-service-model-schema-elements.md#SystemGroupElementanonymouscomplexTypeComplexTypeDefinedInMemberOfelement)

### Group Element
The group to add the user to.  The group must be defined in the Groups section. For more information, see [Group Element](service-fabric-service-model-schema-elements.md#GroupElementanonymouscomplexTypeComplexTypeDefinedInMemberOfelement)

### Policies Element
Describes the policies (log collection, default run-as, health, and security access) to be applied at the application level. For more information, see [Policies Element](service-fabric-service-model-schema-elements.md#PoliciesElementApplicationPoliciesTypeComplexTypeDefinedInApplicationManifestTypecomplexTypeDefinedInEnvironmentTypecomplexType)

### DefaultRunAsPolicy Element
Specify a default user account for all service code packages that don't have a specific RunAsPolicy defined in the ServiceManifestImport section. For more information, see [DefaultRunAsPolicy Element](service-fabric-service-model-schema-elements.md#DefaultRunAsPolicyElementanonymouscomplexTypeComplexTypeDefinedInApplicationPoliciesTypecomplexType)




## VotingWeb service manifest elements
### ServiceManifest Element
Declaratively describes the service type and version. It lists the independently upgradeable code, configuration, and data packages that together compose a service package to support one or more service types. Resources, diagnostics settings, and service metadata, such as service type, health properties, and load-balancing metrics, are also specified. For more information, see [ServiceManifest Element](service-fabric-service-model-schema-elements.md#ServiceManifestElementServiceManifestTypeComplexType)

### ServiceTypes Element
Defines what service types are supported by a CodePackage in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. Service types are declared at the manifest level and not the code package level. For more information, see [ServiceTypes Element](service-fabric-service-model-schema-elements.md#ServiceTypesElementServiceAndServiceGroupTypesTypeComplexTypeDefinedInServiceManifestTypecomplexType)

### StatelessServiceType Element
Describes a stateless service type. For more information, see [StatelessServiceType Element](service-fabric-service-model-schema-elements.md#StatelessServiceTypeElementStatelessServiceTypeTypeComplexTypeDefinedInServiceAndServiceGroupTypesTypecomplexTypeDefinedInServiceTypesTypecomplexType)

### CodePackage Element
Describes a code package that supports a defined service type. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. The resulting processes are expected to register the supported service types at run time. When there are multiple code packages, they are all activated whenever the system looks for any one of the declared service types. For more information, see [CodePackage Element](service-fabric-service-model-schema-elements.md#CodePackageElementCodePackageTypeComplexTypeDefinedInServiceManifestTypecomplexTypeDefinedInDigestedCodePackageelement)

### SetupEntryPoint Element
A privileged entry point that by default runs with the same credentials as Service Fabric (typically the NETWORKSERVICE account) before any other entry point. The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time. For more information, see [SetupEntryPoint Element](service-fabric-service-model-schema-elements.md#SetupEntryPointElementanonymouscomplexTypeComplexTypeDefinedInCodePackageTypecomplexType)

### ExeHost Element
 For more information, see [ExeHost Element](service-fabric-service-model-schema-elements.md#ExeHostElementExeHostEntryPointTypeComplexTypeDefinedInSetupEntryPointelement)

### Program Element
The executable name.  For example, "MySetup.bat" or "MyServiceHost.exe". For more information, see [Program Element](service-fabric-service-model-schema-elements.md#ProgramElementxs:stringComplexTypeDefinedInExeHostEntryPointTypecomplexType)

### Arguments Element
 For more information, see [Arguments Element](service-fabric-service-model-schema-elements.md#ArgumentsElementxs:stringComplexTypeDefinedInExeHostEntryPointTypecomplexType)

### WorkingFolder Element
The working directory for the process in the code package on the cluster node where the application is deployed. You can specify three values: Work (the default), CodePackage, or CodeBase. CodeBase specifies that the working directory is set to the directory in which the EXE is defined in the code package. CodePackage sets the working directory to be the root of the code package regardless of where the EXE is defined in the code package directory. Work sets the work directory to a unique folder created on the node.  This folder is the same for the entire application instance. By default, the working directory of all processes in the application is set to the application work folder. This is where the processes can write the data. Writing data in the code package or code base is not recommended as those folders could be shared between different application instances and may get deleted. For more information, see [WorkingFolder Element](service-fabric-service-model-schema-elements.md#WorkingFolderElementanonymouscomplexTypeComplexTypeDefinedInExeHostEntryPointTypecomplexType)

### ConsoleRedirection Element

> [!WARNING]
> Do not use console redirection in a production application, only use it for local development and debugging. Redirects console output from the startup script to an output file in the application folder called "log" on the cluster node where the application is deployed and run. For more information, see [ConsoleRedirection Element](service-fabric-service-model-schema-elements.md#ConsoleRedirectionElementanonymouscomplexTypeComplexTypeDefinedInExeHostEntryPointTypecomplexType)

### EntryPoint Element
The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time. The executable specified by EntryPoint is run after SetupEntryPoint exits successfully. The resulting process is monitored and restarted (beginning again with SetupEntryPoint) if it ever terminates or crashes. For more information, see [EntryPoint Element](service-fabric-service-model-schema-elements.md#EntryPointElementEntryPointDescriptionTypeComplexTypeDefinedInCodePackageTypecomplexType)

### ExeHost Element
 For more information, see [ExeHost Element](service-fabric-service-model-schema-elements.md#ExeHostElementanonymouscomplexTypeComplexTypeDefinedInEntryPointDescriptionTypecomplexType)

### ConfigPackage Element
Declares a folder, named by the Name attribute, under PackageRoot that contains a Settings.xml file. This file contains sections of user-defined, key-value pair settings that the process can read back at run time. During an upgrade, if only the ConfigPackage version has changed, then the running process is not restarted. Instead, a callback notifies the process that configuration settings have changed so they can be reloaded dynamically. For more information, see [ConfigPackage Element](service-fabric-service-model-schema-elements.md#ConfigPackageElementConfigPackageTypeComplexTypeDefinedInServiceManifestTypecomplexTypeDefinedInDigestedConfigPackageelement)

### Resources Element
Describes the resources used by this service, which can be declared without modifying compiled code and changed when the service is deployed. Access to these resources is controlled through the Principals and Policies sections of the application manifest. For more information, see [Resources Element](service-fabric-service-model-schema-elements.md#ResourcesElementResourcesTypeComplexTypeDefinedInServiceManifestTypecomplexType)

### Endpoints Element
Defines endpoints for the service. For more information, see [Endpoints Element](service-fabric-service-model-schema-elements.md#EndpointsElementanonymouscomplexTypeComplexTypeDefinedInResourcesTypecomplexType)

### Endpoint Element
The endpoint, declared in the service manifest, to override. For more information, see [Endpoint Element](service-fabric-service-model-schema-elements.md#EndpointElementEndpointOverrideTypeComplexTypeDefinedInEndpointselement)



## VotingData service manifest elements
### ServiceManifest Element
Declaratively describes the service type and version. It lists the independently upgradeable code, configuration, and data packages that together compose a service package to support one or more service types. Resources, diagnostics settings, and service metadata, such as service type, health properties, and load-balancing metrics, are also specified. For more information, see [ServiceManifest Element](service-fabric-service-model-schema-elements.md#ServiceManifestElementServiceManifestTypeComplexType)

### ServiceTypes Element
Defines what service types are supported by a CodePackage in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. Service types are declared at the manifest level and not the code package level. For more information, see [ServiceTypes Element](service-fabric-service-model-schema-elements.md#ServiceTypesElementServiceAndServiceGroupTypesTypeComplexTypeDefinedInServiceManifestTypecomplexType)

### StatefulServiceType Element
Describes a stateful service type. For more information, see [StatefulServiceType Element](service-fabric-service-model-schema-elements.md#StatefulServiceTypeElementStatefulServiceTypeTypeComplexTypeDefinedInServiceAndServiceGroupTypesTypecomplexTypeDefinedInServiceTypesTypecomplexType)

### CodePackage Element
Describes a code package that supports a defined service type. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. The resulting processes are expected to register the supported service types at run time. When there are multiple code packages, they are all activated whenever the system looks for any one of the declared service types. For more information, see [CodePackage Element](service-fabric-service-model-schema-elements.md#CodePackageElementCodePackageTypeComplexTypeDefinedInServiceManifestTypecomplexTypeDefinedInDigestedCodePackageelement)

### EntryPoint Element
The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time. The executable specified by EntryPoint is run after SetupEntryPoint exits successfully. The resulting process is monitored and restarted (beginning again with SetupEntryPoint) if it ever terminates or crashes. For more information, see [EntryPoint Element](service-fabric-service-model-schema-elements.md#EntryPointElementEntryPointDescriptionTypeComplexTypeDefinedInCodePackageTypecomplexType)

### ExeHost Element
 For more information, see [ExeHost Element](service-fabric-service-model-schema-elements.md#ExeHostElementanonymouscomplexTypeComplexTypeDefinedInEntryPointDescriptionTypecomplexType)

### Program Element
The executable name.  For example, "MySetup.bat" or "MyServiceHost.exe". For more information, see [Program Element](service-fabric-service-model-schema-elements.md#ProgramElementxs:stringComplexTypeDefinedInExeHostEntryPointTypecomplexType)

### WorkingFolder Element
The working directory for the process in the code package on the cluster node where the application is deployed. You can specify three values: Work (the default), CodePackage, or CodeBase. CodeBase specifies that the working directory is set to the directory in which the EXE is defined in the code package. CodePackage sets the working directory to be the root of the code package regardless of where the EXE is defined in the code package directory. Work sets the work directory to a unique folder created on the node.  This folder is the same for the entire application instance. By default, the working directory of all processes in the application is set to the application work folder. This is where the processes can write the data. Writing data in the code package or code base is not recommended as those folders could be shared between different application instances and may get deleted. For more information, see [WorkingFolder Element](service-fabric-service-model-schema-elements.md#WorkingFolderElementanonymouscomplexTypeComplexTypeDefinedInExeHostEntryPointTypecomplexType)

### ConfigPackage Element
Declares a folder, named by the Name attribute, under PackageRoot that contains a Settings.xml file. This file contains sections of user-defined, key-value pair settings that the process can read back at run time. During an upgrade, if only the ConfigPackage version has changed, then the running process is not restarted. Instead, a callback notifies the process that configuration settings have changed so they can be reloaded dynamically. For more information, see [ConfigPackage Element](service-fabric-service-model-schema-elements.md#ConfigPackageElementConfigPackageTypeComplexTypeDefinedInServiceManifestTypecomplexTypeDefinedInDigestedConfigPackageelement)

### DataPackage Element
Declares a folder, named by the Name attribute, under PackageRoot which contains static data files to be consumed by the process at run time. Service Fabric will recycle all EXEs and DLLHOSTs specified in the host and support packages when any of the data packages listed in the service manifest are upgraded. For more information, see [DataPackage Element](service-fabric-service-model-schema-elements.md#DataPackageElementDataPackageTypeComplexTypeDefinedInServiceManifestTypecomplexTypeDefinedInDigestedDataPackageelement)

### Resources Element
Describes the resources used by this service, which can be declared without modifying compiled code and changed when the service is deployed. Access to these resources is controlled through the Principals and Policies sections of the application manifest. For more information, see [Resources Element](service-fabric-service-model-schema-elements.md#ResourcesElementResourcesTypeComplexTypeDefinedInServiceManifestTypecomplexType)

### Endpoints Element
Defines endpoints for the service. For more information, see [Endpoints Element](service-fabric-service-model-schema-elements.md#EndpointsElementanonymouscomplexTypeComplexTypeDefinedInResourcesTypecomplexType)

### Endpoint Element
The endpoint, declared in the service manifest, to override. For more information, see [Endpoint Element](service-fabric-service-model-schema-elements.md#EndpointElementEndpointOverrideTypeComplexTypeDefinedInEndpointselement)

