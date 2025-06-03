---
title: What is the Azure Cloud Service (extended support) model and package
description: Describes the cloud service (extended support) model (.csdef, .cscfg) and package (.cspkg) in Azure
ms.topic: concept-article
ms.service: azure-cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 07/24/2024
# Customer intent: As a cloud developer or architect, I want to understand Azure's cloud service model and packaging requirements, so that I can configure, package, and deploy a cloud service in a scalable and manageable way.
---

# What is the Azure Cloud Service model and how do I package it?

> [!IMPORTANT]
> As of March 31, 2025, cloud Services (extended support) is deprecated and will be fully retired on March 31, 2027. [Learn more](https://aka.ms/csesretirement) about this deprecation and [how to migrate](https://aka.ms/cses-retirement-march-2025).

A cloud service is created from three components, the service definition *(.csdef)*, the service config *(.cscfg)*, and a service package *(.cspkg)*. Both the **ServiceDefinition.csdef** and **ServiceConfig.cscfg** files are XML-based and describe the structure of the cloud service and its configuration. We collectively call these files the model. The **ServicePackage.cspkg** is a zip file that is generated from the **ServiceDefinition.csdef** and among other things, contains all the required binary-based dependencies. Azure creates a cloud service from both the **ServicePackage.cspkg** and the **ServiceConfig.cscfg**.

Once the cloud service is running in Azure, you can reconfigure it through the **ServiceConfig.cscfg** file, but you can't alter the definition.

## What would you like to know more about?
* I want to know more about the [ServiceDefinition.csdef](#csdef) and [ServiceConfig.cscfg](#cscfg) files.
* I already know about that, give me [some examples](#next-steps) on what I can configure.
* I want to create the [ServicePackage.cspkg](#cspkg).

<a name="csdef"></a>

## ServiceDefinition.csdef
The **ServiceDefinition.csdef** file specifies the settings that are used by Azure to configure a cloud service. The [Azure Service Definition Schema (.csdef File)](schema-csdef-file.md) provides the allowable format for a service definition file. The following example shows the settings that can be defined for the Web and Worker roles:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceDefinition name="MyServiceName" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition">
  <WebRole name="WebRole1" vmsize="Standard_D1_v2">
    <Sites>
      <Site name="Web">
        <Bindings>
          <Binding name="HttpIn" endpointName="HttpIn" />
        </Bindings>
      </Site>
    </Sites>
    <Endpoints>
      <InputEndpoint name="HttpIn" protocol="http" port="80" />
      <InternalEndpoint name="InternalHttpIn" protocol="http" />
    </Endpoints>
    <Certificates>
      <Certificate name="Certificate1" storeLocation="LocalMachine" storeName="My" />
    </Certificates>
    <Imports>
      <Import moduleName="Connect" />
      <Import moduleName="Diagnostics" />
      <Import moduleName="RemoteAccess" />
      <Import moduleName="RemoteForwarder" />
    </Imports>
    <LocalResources>
      <LocalStorage name="localStoreOne" sizeInMB="10" />
      <LocalStorage name="localStoreTwo" sizeInMB="10" cleanOnRoleRecycle="false" />
    </LocalResources>
    <Startup>
      <Task commandLine="Startup.cmd" executionContext="limited" taskType="simple" />
    </Startup>
  </WebRole>

  <WorkerRole name="WorkerRole1">
    <ConfigurationSettings>
      <Setting name="DiagnosticsConnectionString" />
    </ConfigurationSettings>
    <Imports>
      <Import moduleName="RemoteAccess" />
      <Import moduleName="RemoteForwarder" />
    </Imports>
    <Endpoints>
      <InputEndpoint name="Endpoint1" protocol="tcp" port="10000" />
      <InternalEndpoint name="Endpoint2" protocol="tcp" />
    </Endpoints>
  </WorkerRole>
</ServiceDefinition>
```

You can refer to the [Service Definition Schema](schema-csdef-file.md)) for a better understanding of the XML schema used here, however, here's a quick explanation of some of the elements:

**Sites**  
Contains the definitions for websites or web applications that are hosted in IIS7.

**InputEndpoints**  
Contains the definitions for endpoints that are used to contact the cloud service.

**InternalEndpoints**  
Contains the definitions for endpoints that are used by role instances to communicate with each other.

**ConfigurationSettings**  
Contains the setting definitions for features of a specific role.

**Certificates**  
Contains the definitions for certificates that are needed for a role. The previous code example shows a certificate that is used for the configuration of Azure Connect.

**LocalResources**  
Contains the definitions for local storage resources. A local storage resource is a reserved directory on the file system of the virtual machine in which an instance of a role is running.

**Imports**  
Contains the definitions for imported modules. The previous code example shows the modules for Remote Desktop Connection and Azure Connect.

**Startup**  
Contains tasks that are run when the role starts. The tasks are defined in a .cmd or executable file.

<a name="cscfg"></a>

## ServiceConfiguration.cscfg
The configuration of the settings for your cloud service is determined by the values in the **ServiceConfiguration.cscfg** file. You specify the number of instances that you want to deploy for each role in this file. The values for the configuration settings that you defined in the service definition file are added to the service configuration file. The thumbprints for any management certificates that are associated with the cloud service are also added to the file. The [Azure Service Configuration Schema (.cscfg File)](schema-cscfg-file.md) provides the allowable format for a service configuration file.

The service configuration file isn't packaged with the application. It uploads to Azure as a separate file and is used to configure the cloud service. You can upload a new service configuration file without redeploying your cloud service. The configuration values for the cloud service can be changed while the cloud service is running. The following example shows the configuration settings that can be defined for the Web and Worker roles:

```xml
<?xml version="1.0"?>
<ServiceConfiguration serviceName="MyServiceName" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration">
  <Role name="WebRole1">
    <Instances count="2" />
    <ConfigurationSettings>
      <Setting name="SettingName" value="SettingValue" />
    </ConfigurationSettings>

    <Certificates>
      <Certificate name="CertificateName" thumbprint="CertThumbprint" thumbprintAlgorithm="sha1" />
      <Certificate name="Microsoft.WindowsAzure.Plugins.RemoteAccess.PasswordEncryption"
         thumbprint="CertThumbprint" thumbprintAlgorithm="sha1" />
    </Certificates>
  </Role>
</ServiceConfiguration>
```

You can refer to the [Service Configuration Schema](schema-cscfg-file.md) for better understanding the XML schema used here, however, here's a quick explanation of the elements:

**Instances**  
Configures the number of running instances for the role. To prevent your cloud service from potentially becoming unavailable during upgrades, we recommend you deploy more than one instance of your web-facing roles. By deploying more than one instance, you adhere to the guidelines in the [Azure Compute Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/), which guarantees 99.95% external connectivity for Internet-facing roles when two or more role instances are deployed for a service.

**ConfigurationSettings**  
Configures the settings for the running instances for a role. The name of the `<Setting>` elements must match the setting definitions in the service definition file.

**Certificates**  
Configures the certificates that are used by the service. The previous code example shows how to define the certificate for the RemoteAccess module. The value of the *thumbprint* attribute must be set to the thumbprint of the certificate to use.

<p/>

> [!NOTE]
> The thumbprint for the certificate can be added to the configuration file by using a text editor. Or, the value can be added on the **Certificates** tab of the **Properties** page of the role in Visual Studio.
> 
> 

## Defining ports for role instances
Azure allows only one entry point to a web role. Meaning that all traffic occurs through one IP address. You can configure your websites to share a port by configuring the host header to direct the request to the correct location. You can also configure your applications to listen to well-known ports on the IP address.

The following sample shows the configuration for a web role with a website and web application. The website is configured as the default entry location on port 80, and the web applications are configured to receive requests from an alternate host header called `mail.mysite.cloudapp.net`.

```xml
<WebRole>
  <ConfigurationSettings>
    <Setting name="DiagnosticsConnectionString" />
  </ConfigurationSettings>
  <Endpoints>
    <InputEndpoint name="HttpIn" protocol="http" port="80" />
    <InputEndpoint name="Https" protocol="https" port="443" certificate="SSL"/>
    <InputEndpoint name="NetTcp" protocol="tcp" port="808" certificate="SSL"/>
  </Endpoints>
  <LocalResources>
    <LocalStorage name="Sites" cleanOnRoleRecycle="true" sizeInMB="100" />
  </LocalResources>
  <Site name="Mysite" packageDir="Sites\Mysite">
    <Bindings>
      <Binding name="http" endpointName="HttpIn" />
      <Binding name="https" endpointName="Https" />
      <Binding name="tcp" endpointName="NetTcp" />
    </Bindings>
  </Site>
  <Site name="MailSite" packageDir="MailSite">
    <Bindings>
      <Binding name="mail" endpointName="HttpIn" hostHeader="mail.mysite.cloudapp.net" />
    </Bindings>
    <VirtualDirectory name="artifacts" />
    <VirtualApplication name="storageproxy">
      <VirtualDirectory name="packages" packageDir="Sites\storageProxy\packages"/>
    </VirtualApplication>
  </Site>
</WebRole>
```


## Changing the configuration of a role
You can update the configuration of your cloud service while it's running in Azure, without taking the service offline. To change configuration information, you can either upload a new configuration file, or edit the configuration file in place and apply it to your running service. The following changes can be made to the configuration of a service:

* **Changing the values of configuration settings**  
  When a configuration setting changes, a role instance can choose to apply the change while the instance is online, or to recycle the instance gracefully and apply the change while the instance is offline.
* **Changing the service topology of role instances**  
  Topology changes don't affect running instances, except where an instance is being removed. All remaining instances generally don't need to be recycled; however, you can choose to recycle role instances in response to a topology change.
* **Changing the certificate thumbprint**  
  You can only update a certificate when a role instance is offline. If a certificate is added, deleted, or changed while a role instance is online, Azure gracefully takes the instance offline to update the certificate. Azure brings it back online after the change completes.

### Handling configuration changes with Service Runtime Events
The Azure Runtime Library includes the Microsoft.WindowsAzure.ServiceRuntime namespace, which provides classes for interacting with the Azure environment from a role. The RoleEnvironment class defines the following events that are raised before and after a configuration change:

* **Changing event**  
  This occurs before the configuration change is applied to a specified instance of a role giving you a chance to take down the role instances if necessary.
* **Changed event**  
  Occurs after the configuration change is applied to a specified instance of a role.

> [!NOTE]
> Because certificate changes always take the instances of a role offline, they do not raise the RoleEnvironment.Changing or RoleEnvironment.Changed events.
> 

<a name="cspkg"></a>

## ServicePackage.cspkg
> [!NOTE]
> The maximum package size that can be deployed is 600MB

To deploy an application as a cloud service in Azure, you must first package the application in the appropriate format. You can use the **CSPack** command-line tool (installed with the [Azure SDK](https://azure.microsoft.com/downloads/)) to create the package file as an alternative to Visual Studio.

**CSPack** uses the contents of the service definition file and service configuration file to define the contents of the package. **CSPack** generates an application package file (.cspkg) that you can upload to Azure by using the [Azure portal](../cloud-services/cloud-services-how-to-create-deploy-portal.md#create-and-deploy). By default, the package is named `[ServiceDefinitionFileName].cspkg`, but you can specify a different name by using the `/out` option of **CSPack**.

**CSPack** is located at  
`C:\Program Files\Microsoft SDKs\Azure\.NET SDK\[sdk-version]\bin\`

> [!NOTE]
> CSPack.exe (on windows) is available by running the **Microsoft Azure Command Prompt** shortcut that is installed with the SDK.  
> 
> Run the CSPack.exe program by itself to see documentation about all the possible switches and commands.
> 
> 

<p />

> [!TIP]
> Run your cloud service locally in the **Microsoft Azure Compute Emulator**, use the **/copyonly** option. This option copies the binary files for the application to a directory layout from which they can be run in the compute emulator.
> 
> 

### Example command to package a cloud service
The following example creates an application package that contains the information for a web role. The command specifies the service definition file to use, the directory where binary files can be found, and the name of the package file.

```cmd
cspack [DirectoryName]\[ServiceDefinition]
       /role:[RoleName];[RoleBinariesDirectory]
       /sites:[RoleName];[VirtualPath];[PhysicalPath]
       /out:[OutputFileName]
```

If the application contains both a web role and a worker role, the following command is used:

```cmd
cspack [DirectoryName]\[ServiceDefinition]
       /out:[OutputFileName]
       /role:[RoleName];[RoleBinariesDirectory]
       /sites:[RoleName];[VirtualPath];[PhysicalPath]
       /role:[RoleName];[RoleBinariesDirectory];[RoleAssemblyName]
```

Where the variables are defined as follows:

| Variable | Value |
| --- | --- |
| \[DirectoryName\] |The subdirectory under the root project directory that contains the .csdef file of the Azure project. |
| \[ServiceDefinition\] |The name of the service definition file. By default, this file is named ServiceDefinition.csdef. |
| \[OutputFileName\] |The name for the generated package file. Typically, this variable is set to the name of the application. If no file name is specified, the application package is created as \[ApplicationName\].cspkg. |
| \[RoleName\] |The name of the role as defined in the service definition file. |
| \[RoleBinariesDirectory] |The location of the binary files for the role. |
| \[VirtualPath\] |The physical directories for each virtual path defined in the Sites section of the service definition. |
| \[PhysicalPath\] |The physical directories of the contents for each virtual path defined in the site node of the service definition. |
| \[RoleAssemblyName\] |The name of the binary file for the role. |

## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).

