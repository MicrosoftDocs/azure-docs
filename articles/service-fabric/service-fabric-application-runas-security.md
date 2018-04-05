---
title: Run an Azure Service Fabric service under system and local security accounts | Microsoft Docs
description: Learn how to run a Service Fabric application under system and local security accounts.  Create security principals and apply the Run-As policy to securely run your services.
services: service-fabric
documentationcenter: .net
author: msfussell
manager: timlt
editor: ''

ms.assetid: 4242a1eb-a237-459b-afbf-1e06cfa72732
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 03/21/2018
ms.author: mfussell

---
# Run a service as a local user account or local system account
By using Azure Service Fabric, you can secure applications that are running in the cluster under different user accounts. By default, Service Fabric applications run under the account that the Fabric.exe process runs under. Service Fabric also provides the capability to run applications under a local user account or local system account, which is done by specifying a RunAs policy within the application manifest. Supported local system account types are **LocalUser**, **NetworkService**, **LocalService**, and **LocalSystem**.  If you're running Service Fabric on a Windows standalone cluster, you can run a service under [Active Directory domain accounts](service-fabric-run-service-as-ad-user-or-group.md) or [group managed service accounts](service-fabric-run-service-as-gmsa.md).

You can also define and create user groups so that one or more users can be added to each group to be managed together. This is useful when there are multiple users for different service entry points and they need to have certain common privileges that are available at the group level.

> [!NOTE] 
> If you apply a RunAs policy to a service and the service manifest declares endpoint resources with the HTTP protocol, you must specify a **SecurityAccessPolicy**.  For more information, see [Assign a security access policy for HTTP and HTTPS endpoints](service-fabric-assign-policy-to-endpoint.md). 
>

## Create local user groups
You can define and create user groups that allow one or more users to be added to a group. This is useful if there are multiple users for different service entry points and they need to have certain common privileges that are available at the group level. The following example shows a local group called **LocalAdminGroup** that has administrator privileges. Two users, Customer1 and Customer2, are made members of this local group in this application manifest example:

```xml
<Principals>
 <Groups>
   <Group Name="LocalAdminGroup">
     <Membership>
       <SystemGroup Name="Administrators"/>
     </Membership>
   </Group>
 </Groups>
  <Users>
     <User Name="Customer1">
        <MemberOf>
           <Group NameRef="LocalAdminGroup" />
        </MemberOf>
     </User>
    <User Name="Customer2">
      <MemberOf>
        <Group NameRef="LocalAdminGroup" />
      </MemberOf>
    </User>
  </Users>
</Principals>
```

## Create local users
You can create a local user that can be used to help secure a service within the application. When a **LocalUser** account type is specified in the principals section of the application manifest, Service Fabric creates local user accounts on machines where the application is deployed. By default, these accounts do not have the same names as those specified in the application manifest (for example, Customer3 in the following application manifest example). Instead, they are dynamically generated and have random passwords.

```xml
<Principals>
  <Users>
     <User Name="Customer3" AccountType="LocalUser" />
  </Users>
</Principals>
```

If an application requires that the user account and password be same on all machines (for example, to enable NTLM authentication), the cluster manifest must set **NTLMAuthenticationEnabled** to true. The cluster manifest must also specify an **NTLMAuthenticationPasswordSecret** that is used to generate the same password across all machines.

```xml
<Section Name="Hosting">
      <Parameter Name="EndpointProviderEnabled" Value="true"/>
      <Parameter Name="NTLMAuthenticationEnabled" Value="true"/>
      <Parameter Name="NTLMAuthenticationPassworkSecret" Value="******" IsEncrypted="true"/>
 </Section>
```

## Assign policies to the service code packages
The **RunAsPolicy** section for a **ServiceManifestImport** specifies the account from the principals section that should be used to run a code package. It also associates code packages from the service manifest with user accounts in the principals section. You can specify this for the setup or main entry points, or you can specify `All` to apply it to both. The following example shows different policies being applied:

```xml
<Policies>
<RunAsPolicy CodePackageRef="Code" UserRef="LocalAdmin" EntryPointType="Setup"/>
<RunAsPolicy CodePackageRef="Code" UserRef="Customer3" EntryPointType="Main"/>
</Policies>
```

If **EntryPointType** is not specified, the default is set to `EntryPointType=”Main”`. Specifying **SetupEntryPoint** is especially useful when you want to run certain high-privilege setup operations under a system account. For more information, see [Run a service startup script as a local user or system account](service-fabric-run-script-at-service-startup.md). The actual service code can run under a lower-privilege account.

## Apply a default policy to all service code packages
You use the **DefaultRunAsPolicy** section to specify a default user account for all code packages that don’t have a specific **RunAsPolicy** defined. If most of the code packages that are specified in the service manifest used by an application need to run under the same user, the application can just define a default RunAs policy with that user account. The following example specifies that if a code package does not have a **RunAsPolicy** specified, the code package should run under the **MyDefaultAccount** specified in the principals section.

```xml
<Policies>
  <DefaultRunAsPolicy UserRef="MyDefaultAccount"/>
</Policies>
```

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
* [Understand the application model](service-fabric-application-model.md)
* [Specify resources in a service manifest](service-fabric-service-manifest-resources.md)
* [Deploy an application](service-fabric-deploy-remove-applications.md)

[image1]: ./media/service-fabric-application-runas-security/copy-to-output.png
