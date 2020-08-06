---
title: "Azure Cloud Services Def. WebRole Schema | Microsoft Docs"
description: Azure web role is customized for web application programming supporting ASP.NET, PHP, WCF, and FastCGI. Learn about service definition elements of a web role.
ms.custom: ""
ms.date: "04/14/2015"
services: cloud-services
ms.reviewer: ""
ms.service: "cloud-services"
ms.suite: ""
ms.tgt_pltfrm: ""
ms.topic: "reference"
ms.assetid: 85368e4e-a0db-4c02-8dbc-8e2928fa6091
caps.latest.revision: 60
author: tgore03
ms.author: tagore

---

# Azure Cloud Services Definition WebRole Schema
The Azure web role is a role that is customized for web application programming as supported by IIS 7, such as ASP.NET, PHP, Windows Communication Foundation, and FastCGI.

The default extension for the service definition file is .csdef.

## Basic service definition schema for a web role  
The basic format of a service definition file containing a web role is as follows.

```xml
<ServiceDefinition …>  
  <WebRole name="<web-role-name>" vmsize="<web-role-size>" enableNativeCodeExecution="[true|false]">  
    <Certificates>  
      <Certificate name="<certificate-name>" storeLocation="<certificate-store>" storeName="<store-name>" />  
    </Certificates>      
    <ConfigurationSettings>  
      <Setting name="<setting-name>" />  
    </ConfigurationSettings>  
    <Imports>  
      <Import moduleName="<import-module>"/>  
    </Imports>  
    <Endpoints>  
      <InputEndpoint certificate="<certificate-name>" ignoreRoleInstanceStatus="[true|false]" name="<input-endpoint-name>" protocol="[http|https|tcp|udp]" localPort="<port-number>" port="<port-number>" loadBalancerProbe="<load-balancer-probe-name>" />  
      <InternalEndpoint name="<internal-endpoint-name>" protocol="[http|tcp|udp|any]" port="<port-number>">  
         <FixedPort port="<port-number>"/>  
         <FixedPortRange min="<minimum-port-number>" max="<maximum-port-number>"/>  
      </InternalEndpoint>  
     <InstanceInputEndpoint name="<instance-input-endpoint-name>" localPort="<port-number>" protocol="[udp|tcp]">  
         <AllocatePublicPortFrom>  
            <FixedPortRange min="<minimum-port-number>" max="<maximum-port-number>"/>  
         </AllocatePublicPortFrom>  
      </InstanceInputEndpoint>  
    </Endpoints>  
    <LocalResources>  
      <LocalStorage name="<local-store-name>" cleanOnRoleRecycle="[true|false]" sizeInMB="<size-in-megabytes>" />  
    </LocalResources>  
    <LocalStorage name="<local-store-name>" cleanOnRoleRecycle="[true|false]" sizeInMB="<size-in-megabytes>" />  
    <Runtime executionContext="[limited|elevated]">  
      <Environment>  
         <Variable name="<variable-name>" value="<variable-value>">  
            <RoleInstanceValue xpath="<xpath-to-role-environment-settings>"/>  
          </Variable>            
      </Environment>  
      <EntryPoint>  
         <NetFxEntryPoint assemblyName="<name-of-assembly-containing-entrypoint>" targetFrameworkVersion="<.net-framework-version>"/>  
      </EntryPoint>  
    </Runtime>  
    <Sites>  
      <Site name="<web-site-name>">  
        <VirtualApplication name="<application-name>" physicalDirectory="<directory-path>"/>  
        <VirtualDirectory name="<directory-path>" physicalDirectory="<directory-path>"/>  
        <Bindings>  
          <Binding name="<binding-name>" endpointName="<endpoint-name-bound-to>" hostHeader="<url-of-the-site>"/>  
        </Bindings>  
      </Site>  
    </Sites>  
    <Startup priority="<for-internal-use-only>">  
      <Task commandLine="<command-to=execute>" executionContext="[limited|elevated]" taskType="[simple|foreground|background]">  
        <Environment>  
         <Variable name="<variable-name>" value="<variable-value>">  
            <RoleInstanceValue xpath="<xpath-to-role-environment-settings>"/>  
          </Variable>            
        </Environment>  
      </Task>  
    </Startup>  
    <Contents>  
      <Content destination="<destination-folder-name>" >  
        <SourceDirectory path="<local-source-directory>" />  
      </Content>  
    </Contents>  
  </WebRole>  
</ServiceDefinition>  
```  

## Schema elements  
The service definition file includes these elements, described in detail in subsequent sections in this topic:  

[WebRole](#WebRole)

[ConfigurationSettings](#ConfigurationSettings)

[Setting](#Setting)

[LocalResources](#LocalResources)

[LocalStorage](#LocalStorage)

[Endpoints](#Endpoints)

[InternalEndpoint](#InternalEndpoint)

[InstanceInputEndpoint](#InstanceInputEndpoint)

[AllocatePublicPortFrom](#AllocatePublicPortFrom)

[FixedPort](#FixedPort)

[FixedPortRange](#FixedPortRange)

[Certificates](#Certificates)

[Certificate](#Certificate)

[Imports](#Imports)

[Import](#Import)

[Runtime](#Runtime)

[Environment](#Environment)

[Variable](#Variable)

[RoleInstanceValue](#RoleInstanceValue)

[NetFxEntryPoint](#NetFxEntryPoint)

[Sites](#Sites)

[Site](#Site)

[VirtualApplication](#VirtualApplication)

[VirtualApplication](#VirtualApplication)

[Bindings](#Bindings)

[Binding](#Binding)

[Startup](#Startup)

[Task](#Task)

[Contents](#Contents)

[Content](#Content)

[SourceDirectory](#SourceDirectory)

##  <a name="WebRole"></a> WebRole  
The `WebRole` element describes a role that is customized for web application programming, as supported by IIS 7 and ASP.NET. A service may contain zero or more web roles.

The following table describes the attributes of the `WebRole` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. The name for the web role. The role's name must be unique.|  
|enableNativeCodeExecution|boolean|Optional. The default value is `true`; native code execution and full trust are enabled by default. Set this attribute to `false` to disable native code execution for the web role, and use Azure partial trust instead.|  
|vmsize|string|Optional. Set this value to change the size of the virtual machine that is allotted to the role. The default value is `Small`. For more information, see [Virtual Machine sizes for Cloud Services](cloud-services-sizes-specs.md).|  

##  <a name="ConfigurationSettings"></a> ConfigurationSettings  
The `ConfigurationSettings` element describes the collection of configuration settings for a web role. This element is the parent of the `Setting` element.

##  <a name="Setting"></a> Setting  
The `Setting` element describes a name and value pair that specifies a configuration setting for an instance of a role.

The following table describes the attributes of the `Setting` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. A unique name for the configuration setting.|  

The configuration settings for a role are name and value pairs that are declared in the service definition file and set in the service configuration file.

##  <a name="LocalResources"></a> LocalResources  
The `LocalResources` element describes the collection of local storage resources for a web role. This element is the parent of the `LocalStorage` element.

##  <a name="LocalStorage"></a> LocalStorage  
The `LocalStorage` element identifies a local storage resource that provides file system space for the service at runtime. A role may define zero or more local storage resources.

> [!NOTE]
>  The `LocalStorage` element can appear as a child of the `WebRole` element to support compatibility with earlier versions of the Azure SDK.

The following table describes the attributes of the `LocalStorage` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. A unique name for the local store.|  
|cleanOnRoleRecycle|boolean|Optional. Indicates whether the local store should be cleaned when the role is restarted. Default value is `true`.|  
|sizeInMb|int|Optional. The desired amount of storage space to allocate for the local store, in MB. If not specified, the default storage space allocated is 100 MB. The minimum amount of storage space that may be allocated is 1 MB.<br /><br /> The maximum size of the local resources is dependent on the virtual machine size. For more information, see [Virtual Machine sizes for Cloud Services](cloud-services-sizes-specs.md).|  
  
The name of the directory allocated to the local storage resource corresponds to the value provided for the name attribute.

##  <a name="Endpoints"></a> Endpoints  
The `Endpoints` element describes the collection of input (external), internal, and instance input endpoints for a role. This element is the parent of the `InputEndpoint`, `InternalEndpoint`, and `InstanceInputEndpoint` elements.

Input and Internal endpoints are allocated separately. A service can have a total of 25 input, internal, and instance input endpoints which can be allocated across the 25 roles allowed in a service. For example, if have 5 roles you can allocate 5 input endpoints per role or you can allocate 25 input endpoints to a single role or you can allocate 1 input endpoint each to 25 roles.

> [!NOTE]
>  Each role deployed requires one instance per role. The default provisioning for a subscription is limited to 20 cores and thus is limited to 20 instances of a role. If your application requires more instances than is provided by the default provisioning see [Billing, Subscription Management and Quota Support](https://azure.microsoft.com/support/options/) for more information on increasing your quota.

##  <a name="InputEndpoint"></a> InputEndpoint  
The `InputEndpoint` element describes an external endpoint to a web role.

You can define multiple endpoints that are a combination of HTTP, HTTPS, UDP, and TCP endpoints. You can specify any port number you choose for an input endpoint, but the port numbers specified for each role in the service must be unique. For example, if you specify that a web role uses port 80 for HTTP and port 443 for HTTPS, you might then specify that a second web role uses port 8080 for HTTP and port 8043 for HTTPS.

The following table describes the attributes of the `InputEndpoint` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. A unique name for the external endpoint.|  
|protocol|string|Required. The transport protocol for the external endpoint. For a web role, possible values are `HTTP`, `HTTPS`, `UDP`, or `TCP`.|  
|port|int|Required. The port for the external endpoint. You can specify any port number you choose, but the port numbers specified for each role in the service must be unique.<br /><br /> Possible values range between 1 and 65535, inclusive (Azure SDK version 1.7 or higher).|  
|certificate|string|Required for an HTTPS endpoint. The name of a certificate defined by a `Certificate` element.|  
|localPort|int|Optional. Specifies a port used for internal connections on the endpoint. The `localPort` attribute maps the external port on the endpoint to an internal port on a role. This is useful in scenarios where a role must communicate to an internal component on a port that different from the one that is exposed externally.<br /><br /> If not specified, the value of `localPort` is the same as the `port` attribute. Set the value of `localPort` to “*” to automatically assign an unallocated port that is discoverable using the runtime API.<br /><br /> Possible values range between 1 and 65535, inclusive (Azure SDK version 1.7 or higher).<br /><br /> The `localPort` attribute is only available using the Azure SDK version 1.3 or higher.|  
|ignoreRoleInstanceStatus|boolean|Optional. When the value of this attribute is set to `true`, the status of a service is ignored and the endpoint will not be removed by the load balancer. Setting this value to `true` useful for debugging busy instances of a service. The default value is `false`. **Note:**  An endpoint can still receive traffic even when the role is not in a Ready state.|  
|loadBalancerProbe|string|Optional. The name of the load balancer probe associated with the input endpoint. For more information, see [LoadBalancerProbe Schema](schema-csdef-loadbalancerprobe.md).|  

##  <a name="InternalEndpoint"></a> InternalEndpoint  
The `InternalEndpoint` element describes an internal endpoint to a web role. An internal endpoint is available only to other role instances running within the service; it is not available to clients outside the service. Web roles that do not include the `Sites` element can only have a single HTTP, UDP, or TCP internal endpoint.

The following table describes the attributes of the `InternalEndpoint` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. A unique name for the internal endpoint.|  
|protocol|string|Required. The transport protocol for the internal endpoint. Possible values are `HTTP`, `TCP`, `UDP`, or `ANY`.<br /><br /> A value of `ANY` specifies that any protocol, any port is allowed.|  
|port|int|Optional. The port used for internal load balanced connections on the endpoint. A Load balanced endpoint uses two ports. The port used for the public IP address, and the port used on the private IP address. Typically these are these are set to the same, but you can choose to use different ports.<br /><br /> Possible values range between 1 and 65535, inclusive (Azure SDK version 1.7 or higher).<br /><br /> The `Port` attribute is only available using the Azure SDK version 1.3 or higher.|  

##  <a name="InstanceInputEndpoint"></a> InstanceInputEndpoint  
The `InstanceInputEndpoint` element describes an instance input endpoint to a web role. An instance input endpoint is associated with a specific role instance by using port forwarding in the load balancer. Each instance input endpoint is mapped to a specific port from a range of possible ports. This element is the parent of the `AllocatePublicPortFrom` element.

The `InstanceInputEndpoint` element is only available using the Azure SDK version 1.7 or higher.

The following table describes the attributes of the `InstanceInputEndpoint` element.
  
| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. A unique name for the endpoint.|  
|localPort|int|Required. Specifies the internal port that all role instances will listen to in order to receive incoming traffic forwarded from the load balancer. Possible values range between 1 and 65535, inclusive.|  
|protocol|string|Required. The transport protocol for the internal endpoint. Possible values are `udp` or `tcp`. Use `tcp` for http/https based traffic.|  
  
##  <a name="AllocatePublicPortFrom"></a> AllocatePublicPortFrom  
The `AllocatePublicPortFrom` element describes the public port range that can be used by external customers to access each instance input endpoint. The public (VIP) port number is allocated from this range and assigned to each individual role instance endpoint during tenant deployment and update. This element is the parent of the `FixedPortRange` element.

The `AllocatePublicPortFrom` element is only available using the Azure SDK version 1.7 or higher.

##  <a name="FixedPort"></a> FixedPort  
The `FixedPort` element specifies the port for the internal endpoint, which enables load balanced connections on the endpoint.

The `FixedPort` element is only available using the Azure SDK version 1.3 or higher.

The following table describes the attributes of the `FixedPort` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|port|int|Required. The port for the internal endpoint. This has the same effect as setting the `FixedPortRange` min and max to the same port.<br /><br /> Possible values range between 1 and 65535, inclusive (Azure SDK version 1.7 or higher).|  

##  <a name="FixedPortRange"></a> FixedPortRange  
The `FixedPortRange` element specifies the range of ports that are assigned to the internal endpoint or instance input endpoint, and sets the port used for load balanced connections on the endpoint.

> [!NOTE]
>  The `FixedPortRange` element works differently depending on the element in which it resides. When the `FixedPortRange` element is in the `InternalEndpoint` element, it opens all ports on the load balancer within the range of the min and max attributes for all virtual machines on which the role runs. When the `FixedPortRange` element is in the `InstanceInputEndpoint` element, it opens only one port within the range of the min and max attributes on each virtual machine running the role.

The `FixedPortRange` element is only available using the Azure SDK version 1.3 or higher.

The following table describes the attributes of the `FixedPortRange` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|min|int|Required. The minimum port in the range. Possible values range between 1 and 65535, inclusive (Azure SDK version 1.7 or higher).|  
|max|string|Required. The maximum port in the range. Possible values range between 1 and 65535, inclusive (Azure SDK version 1.7 or higher).|  

##  <a name="Certificates"></a> Certificates  
The `Certificates` element describes the collection of certificates for a web role. This element is the parent of the `Certificate` element. A role may have any number of associated certificates. For more information on using the certificates element, see [Modify the Service Definition file with a certificate](cloud-services-configure-ssl-certificate-portal.md#step-2-modify-the-service-definition-and-configuration-files).

##  <a name="Certificate"></a> Certificate  
The `Certificate` element describes a certificate that is associated with a web role.

The following table describes the attributes of the `Certificate` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. A name for this certificate, which is used to refer to it when it is associated with an HTTPS `InputEndpoint` element.|  
|storeLocation|string|Required. The location of the certificate store where this certificate may be found on the local machine. Possible values are `CurrentUser` and `LocalMachine`.|  
|storeName|string|Required. The name of the certificate store where this certificate resides on the local machine. Possible values include the built-in store names `My`, `Root`, `CA`, `Trust`, `Disallowed`, `TrustedPeople`, `TrustedPublisher`, `AuthRoot`, `AddressBook`, or any custom store name. If a custom store name is specified, the store is automatically created.|  
|permissionLevel|string|Optional. Specifies the access permissions given to the role processes. If you want only elevated processes to be able to access the private key, then specify `elevated` permission. `limitedOrElevated` permission allows all role processes to access the private key. Possible values are `limitedOrElevated` or `elevated`. The default value is `limitedOrElevated`.|  

##  <a name="Imports"></a> Imports  
The `Imports` element describes a collection of import modules for a web role that add components to the guest operating system. This element is the parent of the `Import` element. This element is optional and a role can have only one imports block. 

The `Imports` element is only available using the Azure SDK version 1.3 or higher.

##  <a name="Import"></a> Import  
The `Import` element specifies a module to add to the guest operating system.

The `Import` element is only available using the Azure SDK version 1.3 or higher.

The following table describes the attributes of the `Import` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|moduleName|string|Required. The name of the module to import. Valid import modules are:<br /><br /> -   RemoteAccess<br />-   RemoteForwarder<br />-   Diagnostics<br /><br /> The RemoteAccess and RemoteForwarder modules allow you to configure your role instance for remote desktop connections. For more information see [Enable Remote Desktop Connection](cloud-services-role-enable-remote-desktop-new-portal.md).<br /><br /> The Diagnostics module allows you to collect diagnostic data for a role instance.|  

##  <a name="Runtime"></a> Runtime  
The `Runtime` element describes a collection of environment variable settings for a web role that control the runtime environment of the Azure host process. This element is the parent of the `Environment` element. This element is optional and a role can have only one runtime block.

The `Runtime` element is only available using the Azure SDK version 1.3 or higher.

The following table describes the attributes of the `Runtime` element:  

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|executionContext|string|Optional. Specifies the context in which the Role Process is launched. The default context is `limited`.<br /><br /> -   `limited` – The process is launched without Administrator privileges.<br />-   `elevated` – The process is launched with Administrator privileges.|  

##  <a name="Environment"></a> Environment  
The `Environment` element describes a collection of environment variable settings for a web role. This element is the parent of the `Variable` element. A role may have any number of environment variables set.

##  <a name="Variable"></a> Variable  
The `Variable` element specifies an environment variable to set in the guest operating.

The `Variable` element is only available using the Azure SDK version 1.3 or higher.

The following table describes the attributes of the `Variable` element:  

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. The name of the environment variable to set.|  
|value|string|Optional. The value to set for the environment variable. You must include either a value attribute or a `RoleInstanceValue` element.|  

##  <a name="RoleInstanceValue"></a> RoleInstanceValue  
The `RoleInstanceValue` element specifies the xPath from which to retrieve the value of the variable.

The following table describes the attributes of the `RoleInstanceValue` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|xpath|string|Optional. Location path of deployment settings for the instance. For more information, see [Configuration variables with XPath](cloud-services-role-config-xpath.md).<br /><br /> You must include either a value attribute or a `RoleInstanceValue` element.|  

##  <a name="EntryPoint"></a> EntryPoint  
The `EntryPoint` element specifies the entry point for a role. This element is the parent of the `NetFxEntryPoint` elements. These elements allow you to specify an application other than the default WaWorkerHost.exe to act as the role entry point.

The `EntryPoint` element is only available using the Azure SDK version 1.5 or higher.

##  <a name="NetFxEntryPoint"></a> NetFxEntryPoint  
The `NetFxEntryPoint` element specifies the program to run for a role.

> [!NOTE]
>  The `NetFxEntryPoint` element is only available using the Azure SDK version 1.5 or higher.

The following table describes the attributes of the `NetFxEntryPoint` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|assemblyName|string|Required. The path and file name of the assembly containing the entry point. The path is relative to the folder **\\%ROLEROOT%\Approot** (do not specify **\\%ROLEROOT%\Approot** in `commandLine`, it is assumed). **%ROLEROOT%** is an environment variable maintained by Azure and it represents the root folder location for your role. The **\\%ROLEROOT%\Approot** folder represents the application folder for your role.<br /><br /> For HWC roles the path is always relative to the **\\%ROLEROOT%\Approot\bin** folder.<br /><br /> For full IIS and IIS Express web roles, if the assembly cannot be found relative to **\\%ROLEROOT%\Approot** folder, the **\\%ROLEROOT%\Approot\bin** is searched.<br /><br /> This fall back behavior for full IIS is not a recommend best practice and maybe removed in future versions.|  
|targetFrameworkVersion|string|Required. The version of the .NET framework on which the assembly was built. For example, `targetFrameworkVersion="v4.0"`.|  

##  <a name="Sites"></a> Sites  
The `Sites` element describes a collection of websites and web applications that are hosted in a web role. This element is the parent of the `Site` element. If you do not specify a `Sites` element, your web role is hosted as legacy web role and you can only have one website hosted in your web role. This element is optional and a role can have only one sites block.

The `Sites` element is only available using the Azure SDK version 1.3 or higher.

##  <a name="Site"></a> Site  
The `Site` element specifies a website or web application that is part of the web role.

The `Site` element is only available using the Azure SDK version 1.3 or higher.

The following table describes the attributes of the `Site` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. Name of the website or application.|  
|physicalDirectory|string|The location of the content directory for the site root. The location can be specified as an absolute path or relative to the .csdef location.|  

##  <a name="VirtualApplication"></a> VirtualApplication  
The `VirtualApplication` element defines an application in Internet Information Services (IIS) 7 is a grouping of files that delivers content or provides services over protocols, such as HTTP. When you create an application in IIS 7, the application's path becomes part of the site's URL.

The `VirtualApplication` element is only available using the Azure SDK version 1.3 or higher.

The following table describes the attributes of the `VirtualApplication` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. Specifies a name to identify the virtual application.|  
|physicalDirectory|string|Required. Specifies the path on the development machine that contains the virtual application. In the compute emulator, IIS is configured to retrieve content from this location. When deploying to the Azure, the contents of the physical directory are packaged along with the rest of the service. When the service package is deployed to Azure, IIS is configured with the location of the unpacked contents.|  

##  <a name="VirtualDirectory"></a> VirtualDirectory  
The `VirtualDirectory` element specifies a directory name (also referred to as path) that you specify in IIS and map to a physical directory on a local or remote server.

The `VirtualDirectory` element is only available using the Azure SDK version 1.3 or higher.

The following table describes the attributes of the `VirtualDirectory` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. Specifies a name to identify the virtual directory.|  
|value|physicalDirectory|Required. Specifies the path on the development machine that contains the website or Virtual directory contents. In the compute emulator, IIS is configured to retrieve content from this location. When deploying to the Azure, the contents of the physical directory are packaged along with the rest of the service. When the service package is deployed to Azure, IIS is configured with the location of the unpacked contents.|  

##  <a name="Bindings"></a> Bindings  
The `Bindings` element describes a collection of bindings for a website. It is the parent element of the `Binding` element. The element is required for every `Site` element. For more information about configuring endpoints, see [Enable Communication for Role Instances](cloud-services-enable-communication-role-instances.md).

The `Bindings` element is only available using the Azure SDK version 1.3 or higher.

##  <a name="Binding"></a> Binding  
The `Binding` element specifies configuration information required for requests to communicate with a website or web application.

The `Binding` element is only available using the Azure SDK version 1.3 or higher.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|name|string|Required. Specifies a name to identify the binding.|  
|endpointName|string|Required. Specifies the endpoint name to bind to.|  
|hostHeader|string|Optional. Specifies a host name that allows you to host multiple sites, with different host names, on a single IP Address/Port number combination.|  

##  <a name="Startup"></a> Startup  
The `Startup` element describes a collection of tasks that run when the role is started. This element can be the parent of the `Variable` element. For more information about using the role startup tasks, see [How to configure startup tasks](cloud-services-startup-tasks.md). This element is optional and a role can have only one startup block.

The following table describes the attribute of the `Startup` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|priority|int|For internal use only.|  

##  <a name="Task"></a> Task  
The `Task` element specifies startup task that takes place when the role starts. Startup tasks can be used to perform tasks that prepare the role to run such install software components or run other applications. Tasks execute in the order in which they appear within the `Startup` element block.

The `Task` element is only available using the Azure SDK version 1.3 or higher.

The following table describes the attributes of the `Task` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|commandLine|string|Required. A script, such as a CMD file, containing the commands to run. Startup command and batch files must be saved in ANSI format. File formats that set a byte-order marker at the start of the file will not process properly.|  
|executionContext|string|Specifies the context in which the script is run.<br /><br /> -   `limited` [Default] – Run with the same privileges as the role hosting the process.<br />-   `elevated` – Run with administrator privileges.|  
|taskType|string|Specifies the execution behavior of the command.<br /><br /> -   `simple` [Default] – System waits for the task to exit before any other tasks are launched.<br />-   `background` – System does not wait for the task to exit.<br />-   `foreground` – Similar to background, except role is not restarted until all foreground tasks exit.|  

##  <a name="Contents"></a> Contents  
The `Contents` element describes the collection of content for a web role. This element is the parent of the `Content` element.

The `Contents` element is only available using the Azure SDK version 1.5 or higher.

##  <a name="Content"></a> Content  
The `Content` element defines the source location of content to be copied to the Azure virtual machine and the destination path to which it is copied.

The `Content` element is only available using the Azure SDK version 1.5 or higher.

The following table describes the attributes of the `Content` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|destination|string|Required. Location on the Azure virtual machine to which the content is placed. This location is relative to the folder **%ROLEROOT%\Approot**.|  

This element is the parent element of the `SourceDirectory` element.

##  <a name="SourceDirectory"></a> SourceDirectory  
The `SourceDirectory` element defines the local directory from which content is copied. Use this element to specify the local contents to copy to the Azure virtual machine.

The `SourceDirectory` element is only available using the Azure SDK version 1.5 or higher.

The following table describes the attributes of the `SourceDirectory` element.

| Attribute | Type | Description |  
| --------- | ---- | ----------- |  
|path|string|Required. Relative or absolute path of a local directory whose contents will be copied to the Azure virtual machine. Expansion of environment variables in the directory path is supported.|  
  
## See Also
[Cloud Service (classic) Definition Schema](schema-csdef-file.md)




