---
title: Azure Cloud Services (classic) Def. WorkerRole Schema | Microsoft Docs
description: The Azure worker role is used for generalized development and may perform background processing for a web role. Learn about the Azure worker role schema.
ms.topic: article
ms.service: cloud-services
ms.subservice: deployment-files
ms.date: 02/21/2023
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: compute-evergreen
---

# Azure Cloud Services (classic) Definition WorkerRole Schema

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

The Azure worker role is a role that is useful for generalized development, and may perform background processing for a web role.

The default extension for the service definition file is .csdef.

## Basic service definition schema for a worker role.
The basic format of the service definition file containing a worker role is as follows.

```xml
<ServiceDefinition …>
  <WorkerRole name="<worker-role-name>" vmsize="<worker-role-size>" enableNativeCodeExecution="[true|false]">
    <Certificates>
      <Certificate name="<certificate-name>" storeLocation="[CurrentUser|LocalMachine]" storeName="[My|Root|CA|Trust|Disallow|TrustedPeople|TrustedPublisher|AuthRoot|AddressBook|<custom-store>" />
    </Certificates>
    <ConfigurationSettings>
      <Setting name="<setting-name>" />
    </ConfigurationSettings>
    <Endpoints>
      <InputEndpoint name="<input-endpoint-name>" protocol="[http|https|tcp|udp]" localPort="<local-port-number>" port="<port-number>" certificate="<certificate-name>" loadBalancerProbe="<load-balancer-probe-name>" />
      <InternalEndpoint name="<internal-endpoint-name" protocol="[http|tcp|udp|any]" port="<port-number>">
         <FixedPort port="<port-number>"/>
         <FixedPortRange min="<minimum-port-number>" max="<maximum-port-number>"/>
      </InternalEndpoint>
     <InstanceInputEndpoint name="<instance-input-endpoint-name>" localPort="<port-number>" protocol="[udp|tcp]">
         <AllocatePublicPortFrom>
            <FixedPortRange min="<minimum-port-number>" max="<maximum-port-number>"/>
         </AllocatePublicPortFrom>
      </InstanceInputEndpoint>
    </Endpoints>
    <Imports>
      <Import moduleName="[RemoteAccess|RemoteForwarder|Diagnostics]"/>
    </Imports>
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
         <ProgramEntryPoint commandLine="<application>" setReadyOnProcessStart="[true|false]"/>
      </EntryPoint>
    </Runtime>
    <Startup priority="<for-internal-use-only>">
      <Task commandLine="" executionContext="[limited|elevated]" taskType="[simple|foreground|background]">
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
  </WorkerRole>
</ServiceDefinition>
```

## Schema Elements
The service definition file includes these elements, described in detail in subsequent sections in this topic:

[WorkerRole](#WorkerRole)

[ConfigurationSettings](#ConfigurationSettings)

[Setting](#Setting)

[LocalResources](#LocalResources)

[LocalStorage](#LocalStorage)

[Endpoints](#Endpoints)

[InputEndpoint](#InputEndpoint)

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

[EntryPoint](#EntryPoint)

[NetFxEntryPoint](#NetFxEntryPoint)

[ProgramEntryPoint](#ProgramEntryPoint)

[Variable](#Variable)

[RoleInstanceValue](#RoleInstanceValue)

[Startup](#Startup)

[Task](#Task)

[Contents](#Contents)

[Content](#Content)

[SourceDirectory](#SourceDirectory)

##  <a name="WorkerRole"></a> WorkerRole
The `WorkerRole` element describes a role that is useful for generalized development, and may perform background processing for a web role. A service may contain zero or more worker roles.

The following table describes the attributes of the `WorkerRole` element.

| Attribute | Type | Description |
| --------- | ---- | ----------- |
|name|string|Required. The name for the worker role. The role's name must be unique.|
|enableNativeCodeExecution|boolean|Optional. The default value is `true`; native code execution and full trust are enabled by default. Set this attribute to `false` to disable native code execution for the worker role, and use Azure partial trust instead.|
|vmsize|string|Optional. Set this value to change the size of the virtual machine that is allotted to this role. The default value is `Small`. For a list of possible virtual machine sizes and their attributes, see [Virtual Machine sizes for Cloud Services](cloud-services-sizes-specs.md).|

##  <a name="ConfigurationSettings"></a> ConfigurationSettings
The `ConfigurationSettings` element describes the collection of configuration settings for a worker role. This element is the parent of the `Setting` element.

##  <a name="Setting"></a> Setting
The `Setting` element describes a name and value pair that specifies a configuration setting for an instance of a role.

The following table describes the attributes of the `Setting` element.

| Attribute | Type | Description |
| --------- | ---- | ----------- |
|name|string|Required. A unique name for the configuration setting.|

The configuration settings for a role are name and value pairs that are declared in the service definition file and set in the service configuration file.

##  <a name="LocalResources"></a> LocalResources
The `LocalResources` element describes the collection of local storage resources for a worker role. This element is the parent of the `LocalStorage` element.

##  <a name="LocalStorage"></a> LocalStorage
The `LocalStorage` element identifies a local storage resource that provides file system space for the service at runtime. A role may define zero or more local storage resources.

> [!NOTE]
>  The `LocalStorage` element can appear as a child of the `WorkerRole` element to support compatibility with earlier versions of the Azure SDK.

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
The `InputEndpoint` element describes an external endpoint to a worker role.

You can define multiple endpoints that are a combination of HTTP, HTTPS, UDP, and TCP endpoints. You can specify any port number you choose for an input endpoint, but the port numbers specified for each role in the service must be unique. For example, if you specify that a role uses port 80 for HTTP and port 443 for HTTPS, you might then specify that a second role uses port 8080 for HTTP and port 8043 for HTTPS.

The following table describes the attributes of the `InputEndpoint` element.

| Attribute | Type | Description |
| --------- | ---- | ----------- |
|name|string|Required. A unique name for the external endpoint.|
|protocol|string|Required. The transport protocol for the external endpoint. For a worker role, possible values are `HTTP`, `HTTPS`, `UDP`, or `TCP`.|
|port|int|Required. The port for the external endpoint. You can specify any port number you choose, but the port numbers specified for each role in the service must be unique.<br /><br /> Possible values range between 1 and 65535, inclusive (Azure SDK version 1.7 or higher).|
|certificate|string|Required for an HTTPS endpoint. The name of a certificate defined by a `Certificate` element.|
|localPort|int|Optional. Specifies a port used for internal connections on the endpoint. The `localPort` attribute maps the external port on the endpoint to an internal port on a role. This is useful in scenarios where a role must communicate to an internal component on a port that different from the one that is exposed externally.<br /><br /> If not specified, the value of `localPort` is the same as the `port` attribute. Set the value of `localPort` to “*” to automatically assign an unallocated port that is discoverable using the runtime API.<br /><br /> Possible values range between 1 and 65535, inclusive (Azure SDK version 1.7 or higher).<br /><br /> The `localPort` attribute is only available using the Azure SDK version 1.3 or higher.|
|ignoreRoleInstanceStatus|boolean|Optional. When the value of this attribute is set to `true`, the status of a service is ignored and the endpoint will not be removed by the load balancer. Setting this value to `true` useful for debugging busy instances of a service. The default value is `false`. **Note:** An endpoint can still receive traffic even when the role is not in a Ready state.|
|loadBalancerProbe|string|Optional. The name of the load balancer probe associated with the input endpoint. For more information, see [LoadBalancerProbe Schema](schema-csdef-loadbalancerprobe.md).|

##  <a name="InternalEndpoint"></a> InternalEndpoint
The `InternalEndpoint` element describes an internal endpoint to a worker role. An internal endpoint is available only to other role instances running within the service; it is not available to clients outside the service. A worker role may have up to five HTTP, UDP, or TCP internal endpoints.

The following table describes the attributes of the `InternalEndpoint` element.

| Attribute | Type | Description |
| --------- | ---- | ----------- |
|name|string|Required. A unique name for the internal endpoint.|
|protocol|string|Required. The transport protocol for the internal endpoint. Possible values are `HTTP`, `TCP`, `UDP`, or `ANY`.<br /><br /> A value of `ANY` specifies that any protocol, any port is allowed.|
|port|int|Optional. The port used for internal load balanced connections on the endpoint. A Load balanced endpoint uses two ports. The port used for the public IP address, and the port used on the private IP address. Typically these are these are set to the same, but you can choose to use different ports.<br /><br /> Possible values range between 1 and 65535, inclusive (Azure SDK version 1.7 or higher).<br /><br /> The `Port` attribute is only available using the Azure SDK version 1.3 or higher.|

##  <a name="InstanceInputEndpoint"></a> InstanceInputEndpoint
The `InstanceInputEndpoint` element describes an instance input endpoint to a worker role. An instance input endpoint is associated with a specific role instance by using port forwarding in the load balancer. Each instance input endpoint is mapped to a specific port from a range of possible ports. This element is the parent of the `AllocatePublicPortFrom` element.

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
The `Certificates` element describes the collection of certificates for a worker role. This element is the parent of the `Certificate` element. A role may have any number of associated certificates. For more information on using the certificates element, see [Modify the Service Definition file with a certificate](cloud-services-configure-ssl-certificate-portal.md#step-2-modify-the-service-definition-and-configuration-files).

##  <a name="Certificate"></a> Certificate
The `Certificate` element describes a certificate that is associated with a worker role.

The following table describes the attributes of the `Certificate` element.

| Attribute | Type | Description |
| --------- | ---- | ----------- |
|name|string|Required. A name for this certificate, which is used to refer to it when it is associated with an HTTPS `InputEndpoint` element.|
|storeLocation|string|Required. The location of the certificate store where this certificate may be found on the local machine. Possible values are `CurrentUser` and `LocalMachine`.|
|storeName|string|Required. The name of the certificate store where this certificate resides on the local machine. Possible values include the built-in store names `My`, `Root`, `CA`, `Trust`, `Disallowed`, `TrustedPeople`, `TrustedPublisher`, `AuthRoot`, `AddressBook`, or any custom store name. If a custom store name is specified, the store is automatically created.|
|permissionLevel|string|Optional. Specifies the access permissions given to the role processes. If you want only elevated processes to be able to access the private key, then specify `elevated` permission. `limitedOrElevated` permission allows all role processes to access the private key. Possible values are `limitedOrElevated` or `elevated`. The default value is `limitedOrElevated`.|

##  <a name="Imports"></a> Imports
The `Imports` element describes a collection of import modules for a worker role that add components to the guest operating system. This element is the parent of the `Import` element. This element is optional and a role can have only one runtime block.

The `Imports` element is only available using the Azure SDK version 1.3 or higher.

##  <a name="Import"></a> Import
The `Import` element specifies a module to add to the guest operating system.

The `Import` element is only available using the Azure SDK version 1.3 or higher.

The following table describes the attributes of the `Import` element.

| Attribute | Type | Description |
| --------- | ---- | ----------- |
|moduleName|string|Required. The name of the module to import. Valid import modules are:<br /><br /> -   RemoteAccess<br />-   RemoteForwarder<br />-   Diagnostics<br /><br /> The RemoteAccess and RemoteForwarder modules allow you to configure your role instance for remote desktop connections. For more information see [Enable Remote Desktop Connection](cloud-services-role-enable-remote-desktop-new-portal.md).<br /><br /> The Diagnostics module allows you to collect diagnostic data for a role instance|

##  <a name="Runtime"></a> Runtime
The `Runtime` element describes a collection of environment variable settings for a worker role that control the runtime environment of the Azure host process. This element is the parent of the `Environment` element. This element is optional and a role can have only one runtime block.

The `Runtime` element is only available using the Azure SDK version 1.3 or higher.

The following table describes the attributes of the `Runtime` element:

| Attribute | Type | Description |
| --------- | ---- | ----------- |
|executionContext|string|Optional. Specifies the context in which the Role Process is launched. The default context is `limited`.<br /><br /> -   `limited` – The process is launched without Administrator privileges.<br />-   `elevated` – The process is launched with Administrator privileges.|

##  <a name="Environment"></a> Environment
The `Environment` element describes a collection of environment variable settings for a worker role. This element is the parent of the `Variable` element. A role may have any number of environment variables set.

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
|assemblyName|string|Required. The path and file name of the assembly containing the entry point. The path is relative to the folder **\\%ROLEROOT%\Approot** (do not specify **\\%ROLEROOT%\Approot** in `commandLine`, it is assumed). **%ROLEROOT%** is an environment variable maintained by Azure and it represents the root folder location for your role. The **\\%ROLEROOT%\Approot** folder represents the application folder for your role.|
|targetFrameworkVersion|string|Required. The version of the .NET framework on which the assembly was built. For example, `targetFrameworkVersion="v4.0"`.|

##  <a name="ProgramEntryPoint"></a> ProgramEntryPoint
The `ProgramEntryPoint` element specifies the program to run for a role. The `ProgramEntryPoint` element allows you to specify a program entry point that is not based on a .NET assembly.

> [!NOTE]
>  The `ProgramEntryPoint` element is only available using the Azure SDK version 1.5 or higher.

The following table describes the attributes of the `ProgramEntryPoint` element.

| Attribute | Type | Description |
| --------- | ---- | ----------- |
|commandLine|string|Required. The path, file name, and any command line arguments of the program to execute. The path is relative to the folder **%ROLEROOT%\Approot** (do not specify **%ROLEROOT%\Approot** in commandLine, it is assumed). **%ROLEROOT%** is an environment variable maintained by Azure and it represents the root folder location for your role. The **%ROLEROOT%\Approot** folder represents the application folder for your role.<br /><br /> If the program ends, the role is recycled, so generally set the program to continue to run, instead of being a program that just starts up and runs a finite task.|
|setReadyOnProcessStart|boolean|Required. Specifies whether the role instance waits for the command line program to signal it is started. This value must be set to `true` at this time. Setting the value to `false` is reserved for future use.|

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
The `Contents` element describes the collection of content for a worker role. This element is the parent of the `Content` element.

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



