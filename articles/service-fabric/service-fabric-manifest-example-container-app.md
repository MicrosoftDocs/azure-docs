---
title: Azure Service Fabric container application manifest examples | Microsoft Docs
description: Learn how to configure application and service manifest settings for a multi-container Service Fabric application.
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
ms.date: 06/08/2018
ms.author: pepogors
---

# Multi-container application and service manifest examples
The following are examples of the application and service manifests for a multi-container Service Fabric application. The purpose of these examples is to show what settings are available and how to use them. These application and service manifests are based on the [Windows Server 2016 Container Sample](https://github.com/Azure-Samples/service-fabric-containers/tree/master/Windows) manifests.

The following features are shown:

|Manifest|Features|
|---|---|
|[Application manifest](#application-manifest)| [override environment variables](service-fabric-get-started-containers.md#configure-and-set-environment-variables), [configure container port-to-host mapping](service-fabric-get-started-containers.md#configure-container-port-to-host-port-mapping-and-container-to-container-discovery), [configure container registry authentication](service-fabric-get-started-containers.md#configure-container-registry-authentication), [resource governance](service-fabric-resource-governance.md), [set isolation mode](service-fabric-get-started-containers.md#configure-isolation-mode), [specify OS build-specific container images](service-fabric-get-started-containers.md#specify-os-build-specific-container-images)| 
|[FrontEndService service manifest](#frontendservice-service-manifest)| [set environment variables](service-fabric-get-started-containers.md#configure-and-set-environment-variables), [configure an endpoint](service-fabric-get-started-containers.md#configure-communication), pass commands to the container, [import a certificate into a container](service-fabric-securing-containers.md)| 
|[BackEndService service manifest](#backendservice-service-manifest)|[set environment variables](service-fabric-get-started-containers.md#configure-and-set-environment-variables), [configure an endpoint](service-fabric-get-started-containers.md#configure-communication), [configure volume driver](service-fabric-containers-volume-logging-drivers.md)| 

See [Application manifest elements](#application-manifest-elements), [FrontEndService service manifest elements](#frontendservice-service-manifest-elements), and [BackEndService service manifest elements](#backendservice-service-manifest-elements) for more information on specific XML elements.

## Application manifest

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest ApplicationTypeName="Container.ApplicationType"
                     ApplicationTypeVersion="1.0.0"
                     xmlns="http://schemas.microsoft.com/2011/01/fabric"
                     xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                     xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
  <Parameters>
    <Parameter Name="BackEndService_InstanceCount" DefaultValue="-1" />
    <Parameter Name="FrontEndService_InstanceCount" DefaultValue="-1" />
    <Parameter Name="CpuCores" DefaultValue="2" />
    <Parameter Name="BlockIOWeight" DefaultValue="200" />
    <Parameter Name="MaximumIOBandwidth" DefaultValue="1024" />
    <Parameter Name="MemoryReservationInMB" DefaultValue="1024" />
    <Parameter Name="MemorySwapInMB" DefaultValue="4084"/>
    <Parameter Name="MaximumIOps" DefaultValue="20"/>
    <Parameter Name="MemoryFront" DefaultValue="4084" />
    <Parameter Name="MemoryBack" DefaultValue="2048" />
    <Parameter Name="CertThumbprint" DefaultValue=""/>
  </Parameters>
  <!-- Import the ServiceManifest from the ServicePackage. The ServiceManifestName and ServiceManifestVersion 
       should match the Name and Version attributes of the ServiceManifest element defined in the 
       ServiceManifest.xml file. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="BackEndServicePkg" ServiceManifestVersion="1.0.0" />    
    
    <!-- Policies to be applied to the imported service manifest. -->
    <Policies>
      <!-- Set resource governance at the service package level. -->
      <ServicePackageResourceGovernancePolicy CpuCores="[CpuCores]" MemoryInMB="[MemoryFront]"/>

      <!-- Set resource governance at the code package level. -->
      <ResourceGovernancePolicy CodePackageRef="Code" CpuPercent="10" MemoryInMB="[MemoryFront]" BlockIOWeight="[BlockIOWeight]" MaximumIOBandwidth="[MaximumIOBandwidth]" MaximumIOps="[MaximumIOps]" MemoryReservationInMB="[MemoryReservationInMB]" MemorySwapInMB="[MemorySwapInMB]"/>
      
      <!-- Policies for activating container hosts. -->
      <ContainerHostPolicies CodePackageRef="Code" Isolation="process">
        
        <!-- Credentials for the repository hosting the container image.-->
        <RepositoryCredentials AccountName="sfsamples" Password="ENCRYPTED-PASSWORD" PasswordEncrypted="true"/>
        
        <!-- This binds the port the container is listening on (8905 in this sample) to an endpoint resource named "BackEndServiceTypeEndpoint", which is defined in the service manifest.  -->
        <PortBinding ContainerPort="8905" EndpointRef="BackEndServiceTypeEndpoint"/>
        
        <!-- Configure the Azure Files volume plugin.  Bind the source folder on the host VM or a remote share to the destination folder within the running container. -->
        <Volume Source="azfiles" Destination="c:\VolumeTest\Data" Driver="sfazurefile">
          <!-- Driver options to be passed to driver. The Azure Files volume plugin supports the following driver options:
            shareName (the Azure Files file share that provides the volume for the container), storageAccountName (the Azure storage account
            that contains the Azure Files file share), storageAccountKey (Access key for the Azure storage account that contains the Azure Files file share).
            These three driver options are required. -->
          <DriverOption Name="shareName" Value="" />
          <DriverOption Name="storageAccountName" Value="MY-STORAGE-ACCOUNT-NAME" />
          <DriverOption Name="storageAccountKey" Value="MY-STORAGE-ACCOUNT-KEY" />
        </Volume>
        
        <!-- Windows Server containers may not be compatible across different versions of the OS.  You can specify multiple OS images per container and tag 
        them with the build versions of the OS. Get the build version of the OS by running "winver" at a Windows command prompt. -->
        <ImageOverrides>
          <!-- If the underlying OS is build version 16299 (Windows Server version 1709), Service Fabric picks the container image tagged with Os="16299". -->
          <Image Name="sfsamples.azurecr.io/sfsamples/servicefabricbackendservice_1709" Os="16299" />
          
          <!-- An untagged container image is assumed to work across all versions of the OS and overrides the image specified in the service manifest. -->
          <Image Name="sfsamples.azurecr.io/sfsamples/servicefabricbackendservice_default" />          
        </ImageOverrides>
      </ContainerHostPolicies>
    </Policies>
  </ServiceManifestImport>

  <!-- Policies to be applied to the imported service manifest. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="FrontEndServicePkg" ServiceManifestVersion="1.0.0" />
    
    <!-- This enables you to provide different values for environment variables when creating a FrontEndService
         Theses environment variables are declared in the FrontEndServiceType service manifest-->
    <EnvironmentOverrides CodePackageRef="Code">
      <EnvironmentVariable Name="BackendServiceName" Value="Container.Application/BackEndService"/>
      <EnvironmentVariable Name="HttpGatewayPort" Value="19080"/>
      <EnvironmentVariable Name="IsContainer" Value="true"/>
    </EnvironmentOverrides>
    
    <!-- This policy maps the  port of the container (80) to the endpoint declared in the service, 
         FrontEndServiceTypeEndpoint which is exposed as port 80 on the host-->    
    <Policies>

      <!-- Set resource governance at the service package level. -->
      <ServicePackageResourceGovernancePolicy CpuCores="[CpuCores]" MemoryInMB="[MemoryBack]"/>

      <!-- Policies for activating container hosts. -->
      <ContainerHostPolicies CodePackageRef="Code" Isolation="process">

        <!-- Credentials for the repository hosting the container image.-->
        <RepositoryCredentials AccountName="sfsamples" Password="ENCRYPTED-PASSWORD" PasswordEncrypted="true"/>

        <!-- Binds an endpoint resource (declared in the service manifest) to the exposed container port. -->
        <PortBinding ContainerPort="80" EndpointRef="FrontEndServiceTypeEndpoint"/>

        <!-- Import a certificate into the container.  The certificate must be installed in the LocalMachine store of all the cluster nodes.
          When the application starts, the runtime reads the certificate and generates a PFX file and password (on Windows) or a PEM file (on Linux).
          The PFX file and password are accessible in the container using the Certificates_ServicePackageName_CodePackageName_CertName_PFX and 
          Certificates_ServicePackageName_CodePackageName_CertName_Password environment variables. The PEM file is accessible in the container using the 
          Certificates_ServicePackageName_CodePackageName_CertName_PEM and Certificates_ServicePackageName_CodePackageName_CertName_PrivateKey environment variables.-->
        <CertificateRef Name="MyCert1" X509StoreName="My" X509FindValue="[CertThumbprint]" />

        <!-- If the certificate is already in PFX or PEM form, you can create a data package inside your application and reference that certificate here. -->
        <CertificateRef Name="MyCert2" DataPackageRef="Data" DataPackageVersion="1.0.0" RelativePath="MyCert2.PFX" Password="ENCRYPTED-PASSWORD" IsPasswordEncrypted="true"/>
      </ContainerHostPolicies>
    </Policies>
  </ServiceManifestImport>
  
  <DefaultServices>
    <!-- The section below creates instances of service types, when an instance of this 
         application type is created. You can also create one or more instances of service type using the 
         ServiceFabric PowerShell module.
         
         The attribute ServiceTypeName below must match the name defined in the imported ServiceManifest.xml file. -->
        
    <Service Name="FrontEndService" >
      <StatelessService ServiceTypeName="FrontEndServiceType" InstanceCount="[FrontEndService_InstanceCount]">
        <SingletonPartition />
      </StatelessService>
    </Service>
        <Service Name="BackEndService" ServicePackageActivationMode="ExclusiveProcess">
      <StatelessService ServiceTypeName="BackEndServiceType" InstanceCount="[BackEndService_InstanceCount]">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </DefaultServices>
</ApplicationManifest>
```

## FrontEndService service manifest

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="FrontEndServicePkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <!-- This is the name of your ServiceType.
         The UseImplicitHost attribute indicates this is a guest service. -->
    <StatelessServiceType ServiceTypeName="FrontEndServiceType" UseImplicitHost="true" />
  </ServiceTypes>

  <!-- Code package is your service executable. -->
  <CodePackage Name="Code" Version="1.0.0">
    <EntryPoint>
      <ContainerHost>
        <!--The repo and image on https://hub.docker.com or Azure Container Registry. -->
        <ImageName>sfsamples.azurecr.io/sfsamples/servicefabricfrontendservice:v1</ImageName>
      </ContainerHost>
    </EntryPoint>
    <!-- Pass environment variables to your container or exe.  These variables are overridden in the application manifest. -->
    <EnvironmentVariables>
      <EnvironmentVariable Name="BackendServiceName" Value=""/>
      <EnvironmentVariable Name="HttpGatewayPort" Value=""/>
      <EnvironmentVariable Name="IsContainer" Value=""/>
    </EnvironmentVariables>
  </CodePackage>

  <!-- Config package is the contents of the Config directory under PackageRoot that contains an 
       independently-updateable and versioned set of custom configuration settings for your service. -->
  <ConfigPackage Name="Config" Version="1.0.0" />
  
  <!-- Data package is the contents of the Data directory under PackageRoot that contains an 
       independently-updateable and versioned static data that's consumed by the process at runtime. -->
  <DataPackage Name="Data" Version="1.0.0"/>

  <Resources>
    <Endpoints>
      <!-- This endpoint is used by the communication listener to obtain the port on which to 
           listen. For a guest executable is used to register with the NamingService at its REST endpoint
           with http scheme and port 80 -->
      <Endpoint Name="FrontEndServiceTypeEndpoint" UriScheme="http" Port="80"/>
    </Endpoints>
  </Resources>
</ServiceManifest>
```

## BackEndService service manifest

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="BackEndServicePkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <!-- This is the name of your ServiceType.
         The UseImplicitHost attribute indicates this is a guest service. -->
    <StatelessServiceType ServiceTypeName="BackEndServiceType" UseImplicitHost="true" />
  </ServiceTypes>

  <!-- Code package is your service executable. -->
  <CodePackage Name="Code" Version="1.0.0">
    <EntryPoint>
      <ContainerHost>
        <!--The repo and image on https://hub.docker.com or Azure Container Registry. -->
        <ImageName>sfsamples.azurecr.io/sfsamples/servicefabricbackendservice:v1</ImageName>
        
        <!-- Pass comma delimited commands to your container. -->
        <Commands> dotnet, myproc.dll, 5 </Commands>
      </ContainerHost>
    </EntryPoint>
    <!-- Pass environment variables to your container. These variables are overridden in the application manifest. -->
    <EnvironmentVariables>
      <EnvironmentVariable Name="IsContainer" Value="true"/>
    </EnvironmentVariables>
  </CodePackage>

  <!-- Config package is the contents of the Config directory under PackageRoot that contains an 
       independently-updateable and versioned set of custom configuration settings for your service. -->
  <ConfigPackage Name="Config" Version="1.0.0" />

  <Resources>
    <Endpoints>
      <!-- This endpoint is used by the communication listener to obtain the host port on which to 
           listen. For a guest executable is used to register with the NamingService at its REST endpoint
           with http scheme. In this case since no port is specified, one is created and assigned dynamically
           to the service. This dynamically assigned host port is mapped to the container port (8905 in this sample),
            which was specified in the application manifest.-->
      <Endpoint Name="BackEndServiceTypeEndpoint" UriScheme="http" />
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

### Policies Element
Describes policies (end-point binding, package sharing, run-as, and security access) to be applied on the imported service manifest. For more information, see [Policies Element](service-fabric-service-model-schema-elements.md#PoliciesElementServiceManifestImportPoliciesTypeComplexTypeDefinedInServiceManifestImportelement)

### ServicePackageResourceGovernancePolicy Element
Defines the resource governance policy that is applied at the level of the entire service package. For more information, see [ServicePackageResourceGovernancePolicy Element](service-fabric-service-model-schema-elements.md#ServicePackageResourceGovernancePolicyElementServicePackageResourceGovernancePolicyTypeComplexTypeDefinedInServiceManifestImportPoliciesTypecomplexTypeDefinedInServicePackageTypecomplexType)

### ResourceGovernancePolicy Element
Specifies resource limits for a code package. For more information, see [ResourceGovernancePolicy Element](service-fabric-service-model-schema-elements.md#ResourceGovernancePolicyElementResourceGovernancePolicyTypeComplexTypeDefinedInServiceManifestImportPoliciesTypecomplexTypeDefinedInDigestedCodePackageelementDefinedInDigestedEndpointelement)

### ContainerHostPolicies Element
Specifies policies for activating container hosts. For more information, see [ContainerHostPolicies Element](service-fabric-service-model-schema-elements.md#ContainerHostPoliciesElementContainerHostPoliciesTypeComplexTypeDefinedInServiceManifestImportPoliciesTypecomplexTypeDefinedInDigestedCodePackageelement)

### RepositoryCredentials Element
Credentials for container image repository to pull images from. For more information, see [RepositoryCredentials Element](service-fabric-service-model-schema-elements.md#RepositoryCredentialsElementRepositoryCredentialsTypeComplexTypeDefinedInContainerHostPoliciesTypecomplexType)

### PortBinding Element
Specifies which endpoint resource to bind to the exposed container port. For more information, see [PortBinding Element](service-fabric-service-model-schema-elements.md#PortBindingElementPortBindingTypeComplexTypeDefinedInServicePackageContainerPolicyTypecomplexTypeDefinedInContainerHostPoliciesTypecomplexType)

### Volume Element
Specifies the volume to be bound to the container. For more information, see [Volume Element](service-fabric-service-model-schema-elements.md#VolumeElementContainerVolumeTypeComplexTypeDefinedInContainerHostPoliciesTypecomplexType)

### DriverOption Element
Driver options to be passed to driver. For more information, see [DriverOption Element](service-fabric-service-model-schema-elements.md#DriverOptionElementDriverOptionTypeComplexTypeDefinedInContainerLoggingDriverTypecomplexTypeDefinedInContainerVolumeTypecomplexType)

### ImageOverrides Element
Windows Server containers may not be compatible across different versions of the OS.  You can specify multiple OS images per container and tag
        them with the build versions of the OS. Get the build version of the OS by running "winver" at a Windows command prompt. If the underlying OS
        is build version 16299 (Windows Server version 1709), Service Fabric picks the container image tagged with Os="16299". An untagged container image
        is assumed to work across all versions of the OS and overrides the image specified in the service manifest. For more information, see [ImageOverrides Element](service-fabric-service-model-schema-elements.md#ImageOverridesElementImageOverridesTypeComplexTypeDefinedInContainerHostPoliciesTypecomplexType)

### Image Element
Container image corresponding to OS build version number to be launched. If the Os attribute is not specified, the container image
            is assumed to work across all versions of the OS and overrides the image specified in the service manifest. For more information, see [Image Element](service-fabric-service-model-schema-elements.md#ImageElementImageTypeComplexTypeDefinedInImageOverridesTypecomplexType)

### EnvironmentOverrides Element
 For more information, see [EnvironmentOverrides Element](service-fabric-service-model-schema-elements.md#EnvironmentOverridesElementEnvironmentOverridesTypeComplexTypeDefinedInServiceManifestImportelement)

### EnvironmentVariable Element
Environment variable. For more information, see [EnvironmentVariable Element](service-fabric-service-model-schema-elements.md#EnvironmentVariableElementEnvironmentVariableOverrideTypeComplexTypeDefinedInEnvironmentOverridesTypecomplexType)

### CertificateRef Element
Specifies information about an X509 certificate which is to be exposed to the container environment. The certificate must be installed in the LocalMachine store of all the cluster nodes.
          When the application starts, the runtime reads the certificate and generates a PFX file and password (on Windows) or a PEM file (on Linux).
          The PFX file and password are accessible in the container using the Certificates_ServicePackageName_CodePackageName_CertName_PFX and
          Certificates_ServicePackageName_CodePackageName_CertName_Password environment variables. The PEM file is accessible in the container using the
          Certificates_ServicePackageName_CodePackageName_CertName_PEM and Certificates_ServicePackageName_CodePackageName_CertName_PrivateKey environment variables. For more information, see [CertificateRef Element](service-fabric-service-model-schema-elements.md#CertificateRefElementContainerCertificateTypeComplexTypeDefinedInContainerHostPoliciesTypecomplexType)

### DefaultServices Element
Declares service instances that are automatically created whenever an application is instantiated against this application type. For more information, see [DefaultServices Element](service-fabric-service-model-schema-elements.md#DefaultServicesElementDefaultServicesTypeComplexTypeDefinedInApplicationManifestTypecomplexTypeDefinedInApplicationInstanceTypecomplexType)

### Service Element
Declares a service to be created automatically when the application is instantiated. For more information, see [Service Element](service-fabric-service-model-schema-elements.md#ServiceElementanonymouscomplexTypeComplexTypeDefinedInDefaultServicesTypecomplexType)

### StatelessService Element
Defines a stateless service. For more information, see [StatelessService Element](service-fabric-service-model-schema-elements.md#StatelessServiceElementStatelessServiceTypeComplexTypeDefinedInServiceTemplatesTypecomplexTypeDefinedInServiceelement)


## FrontEndService service manifest elements
### ServiceManifest Element
Declaratively describes the service type and version. It lists the independently upgradeable code, configuration, and data packages that together compose a service package to support one or more service types. Resources, diagnostics settings, and service metadata, such as service type, health properties, and load-balancing metrics, are also specified. For more information, see [ServiceManifest Element](service-fabric-service-model-schema-elements.md#ServiceManifestElementServiceManifestTypeComplexType)

### ServiceTypes Element
Defines what service types are supported by a CodePackage in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. Service types are declared at the manifest level and not the code package level. For more information, see [ServiceTypes Element](service-fabric-service-model-schema-elements.md#ServiceTypesElementServiceAndServiceGroupTypesTypeComplexTypeDefinedInServiceManifestTypecomplexType)

### StatelessServiceType Element
Describes a stateless service type. For more information, see [StatelessServiceType Element](service-fabric-service-model-schema-elements.md#StatelessServiceTypeElementStatelessServiceTypeTypeComplexTypeDefinedInServiceAndServiceGroupTypesTypecomplexTypeDefinedInServiceTypesTypecomplexType)

### CodePackage Element
Describes a code package that supports a defined service type. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. The resulting processes are expected to register the supported service types at run time. When there are multiple code packages, they are all activated whenever the system looks for any one of the declared service types. For more information, see [CodePackage Element](service-fabric-service-model-schema-elements.md#CodePackageElementCodePackageTypeComplexTypeDefinedInServiceManifestTypecomplexTypeDefinedInDigestedCodePackageelement)

### EntryPoint Element
The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time. The executable specified by EntryPoint is run after SetupEntryPoint exits successfully. The resulting process is monitored and restarted (beginning again with SetupEntryPoint) if it ever terminates or crashes. For more information, see [EntryPoint Element](service-fabric-service-model-schema-elements.md#EntryPointElementEntryPointDescriptionTypeComplexTypeDefinedInCodePackageTypecomplexType)

### ContainerHost Element
 For more information, see [ContainerHost Element](service-fabric-service-model-schema-elements.md#ContainerHostElementContainerHostEntryPointTypeComplexTypeDefinedInEntryPointDescriptionTypecomplexType)

### ImageName Element
The repo and image on https://hub.docker.com or Azure Container Registry. For more information, see [ImageName Element](service-fabric-service-model-schema-elements.md#ImageNameElementxs:stringComplexTypeDefinedInContainerHostEntryPointTypecomplexType)

### EnvironmentVariables Element
Pass environment variables to your container or exe.  For more information, see [EnvironmentVariables Element](service-fabric-service-model-schema-elements.md#EnvironmentVariablesElementEnvironmentVariablesTypeComplexTypeDefinedInCodePackageTypecomplexType)

### EnvironmentVariable Element
Environment variable. For more information, see [EnvironmentVariable Element](service-fabric-service-model-schema-elements.md#EnvironmentVariableElementEnvironmentVariableOverrideTypeComplexTypeDefinedInEnvironmentOverridesTypecomplexType)

### ConfigPackage Element
Declares a folder, named by the Name attribute, that contains a Settings.xml file. This file contains sections of user-defined, key-value pair settings that the process can read back at run time. During an upgrade, if only the ConfigPackage version has changed, then the running process is not restarted. Instead, a callback notifies the process that configuration settings have changed so they can be reloaded dynamically. For more information, see [ConfigPackage Element](service-fabric-service-model-schema-elements.md#ConfigPackageElementConfigPackageTypeComplexTypeDefinedInServiceManifestTypecomplexTypeDefinedInDigestedConfigPackageelement)

### DataPackage Element
Declares a folder, named by the Name attribute, which contains static data files. Service Fabric will recycle all EXEs and DLLHOSTs specified in the host and support packages when any of the data packages listed in the service manifest are upgraded. For more information, see [DataPackage Element](service-fabric-service-model-schema-elements.md#DataPackageElementDataPackageTypeComplexTypeDefinedInServiceManifestTypecomplexTypeDefinedInDigestedDataPackageelement)

### Resources Element
Describes the resources used by this service, which can be declared without modifying compiled code and changed when the service is deployed. Access to these resources is controlled through the Principals and Policies sections of the application manifest. For more information, see [Resources Element](service-fabric-service-model-schema-elements.md#ResourcesElementResourcesTypeComplexTypeDefinedInServiceManifestTypecomplexType)

### Endpoints Element
Defines endpoints for the service. For more information, see [Endpoints Element](service-fabric-service-model-schema-elements.md#EndpointsElementanonymouscomplexTypeComplexTypeDefinedInResourcesTypecomplexType)

### Endpoint Element
For more information, see [Endpoint Element](service-fabric-service-model-schema-elements.md#EndpointElementEndpointOverrideTypeComplexTypeDefinedInEndpointselement)


## BackEndService service manifest elements
### ServiceManifest Element
Declaratively describes the service type and version. It lists the independently upgradeable code, configuration, and data packages that together compose a service package to support one or more service types. Resources, diagnostics settings, and service metadata, such as service type, health properties, and load-balancing metrics, are also specified. For more information, see [ServiceManifest Element](service-fabric-service-model-schema-elements.md#ServiceManifestElementServiceManifestTypeComplexType)

### ServiceTypes Element
Defines what service types are supported by a CodePackage in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. Service types are declared at the manifest level and not the code package level. For more information, see [ServiceTypes Element](service-fabric-service-model-schema-elements.md#ServiceTypesElementServiceAndServiceGroupTypesTypeComplexTypeDefinedInServiceManifestTypecomplexType)

### StatelessServiceType Element
Describes a stateless service type. For more information, see [StatelessServiceType Element](service-fabric-service-model-schema-elements.md#StatelessServiceTypeElementStatelessServiceTypeTypeComplexTypeDefinedInServiceAndServiceGroupTypesTypecomplexTypeDefinedInServiceTypesTypecomplexType)

### CodePackage Element
Describes a code package that supports a defined service type. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. The resulting processes are expected to register the supported service types at run time. When there are multiple code packages, they are all activated whenever the system looks for any one of the declared service types. For more information, see [CodePackage Element](service-fabric-service-model-schema-elements.md#CodePackageElementCodePackageTypeComplexTypeDefinedInServiceManifestTypecomplexTypeDefinedInDigestedCodePackageelement)

### EntryPoint Element
The executable specified by EntryPoint is typically the long-running service host. The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time. The executable specified by EntryPoint is run after SetupEntryPoint exits successfully. The resulting process is monitored and restarted (beginning again with SetupEntryPoint) if it ever terminates or crashes. For more information, see [EntryPoint Element](service-fabric-service-model-schema-elements.md#EntryPointElementEntryPointDescriptionTypeComplexTypeDefinedInCodePackageTypecomplexType)

### ContainerHost Element
For more information, see [ContainerHost Element](service-fabric-service-model-schema-elements.md#ContainerHostElementContainerHostEntryPointTypeComplexTypeDefinedInEntryPointDescriptionTypecomplexType)

### ImageName Element
The repo and image on https://hub.docker.com or Azure Container Registry. For more information, see [ImageName Element](service-fabric-service-model-schema-elements.md#ImageNameElementxs:stringComplexTypeDefinedInContainerHostEntryPointTypecomplexType)

### Commands Element
Pass a comma delimited list of commands to the container. For more information, see [Commands Element](service-fabric-service-model-schema-elements.md#CommandsElementxs:stringComplexTypeDefinedInContainerHostEntryPointTypecomplexType)

### EnvironmentVariables Element
Pass environment variables to your container or exe.  For more information, see [EnvironmentVariables Element](service-fabric-service-model-schema-elements.md#EnvironmentVariablesElementEnvironmentVariablesTypeComplexTypeDefinedInCodePackageTypecomplexType)

### EnvironmentVariable Element
Environment variable. For more information, see [EnvironmentVariable Element](service-fabric-service-model-schema-elements.md#EnvironmentVariableElementEnvironmentVariableOverrideTypeComplexTypeDefinedInEnvironmentOverridesTypecomplexType)

### ConfigPackage Element
Declares a folder, named by the Name attribute, that contains a Settings.xml file. This file contains sections of user-defined, key-value pair settings that the process can read back at run time. During an upgrade, if only the ConfigPackage version has changed, then the running process is not restarted. Instead, a callback notifies the process that configuration settings have changed so they can be reloaded dynamically. For more information, see [ConfigPackage Element](service-fabric-service-model-schema-elements.md#ConfigPackageElementConfigPackageTypeComplexTypeDefinedInServiceManifestTypecomplexTypeDefinedInDigestedConfigPackageelement)

### Resources Element
Describes the resources used by this service, which can be declared without modifying compiled code and changed when the service is deployed. Access to these resources is controlled through the Principals and Policies sections of the application manifest. For more information, see [Resources Element](service-fabric-service-model-schema-elements.md#ResourcesElementResourcesTypeComplexTypeDefinedInServiceManifestTypecomplexType)

### Endpoints Element
Defines endpoints for the service. For more information, see [Endpoints Element](service-fabric-service-model-schema-elements.md#EndpointsElementanonymouscomplexTypeComplexTypeDefinedInResourcesTypecomplexType)

### Endpoint Element
 For more information, see [Endpoint Element](service-fabric-service-model-schema-elements.md#EndpointElementEndpointOverrideTypeComplexTypeDefinedInEndpointselement)

