---
title: Learn about Azure microservices security policies | Microsoft Docs
description: An overview of how to run a Service Fabric application under system and local security accounts, including the SetupEntry point where an application needs to perform some privileged action before it starts
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
ms.date: 06/30/2017
ms.author: mfussell

---
# Configure security policies for your application
By using Azure Service Fabric, you can secure applications that are running in the cluster under different user accounts. Service Fabric also helps secure the resources that are used by applications at the time of deployment under the user accounts--for example, files, directories, and certificates. This makes running applications, even in a shared hosted environment, more secure from one another.

By default, Service Fabric applications run under the account that the Fabric.exe process runs under. Service Fabric also provides the capability to run applications under a local user account or local system account, which is specified within the application manifest. Supported local system account types are **LocalUser**, **NetworkService**, **LocalService**, and **LocalSystem**.

 When you're running Service Fabric on Windows Server in your datacenter by using the standalone installer, you can use Active Directory domain accounts, including group managed service accounts.

You can define and create user groups so that one or more users can be added to each group to be managed together. This is useful when there are multiple users for different service entry points and they need to have certain common privileges that are available at the group level.




## Assign a security access policy for HTTP and HTTPS endpoints
If you apply a RunAs policy to a service and the service manifest declares endpoint resources with the HTTP protocol, you must specify a **SecurityAccessPolicy** to ensure that ports allocated to these endpoints are correctly access-control listed for the RunAs user account that the service runs under. Otherwise, **http.sys** does not have access to the service, and you get failures with calls from the client. The following example applies the Customer1 account to an endpoint called **EndpointName**, which gives it full access rights.

```xml
<Policies>
   <RunAsPolicy CodePackageRef="Code" UserRef="Customer1" />
   <!--SecurityAccessPolicy is needed if RunAsPolicy is defined and the Endpoint is http -->
   <SecurityAccessPolicy ResourceRef="EndpointName" PrincipalRef="Customer1" />
</Policies>
```

For the HTTPS endpoint, you also have to indicate the name of the certificate to return to the client. You can do this by using **EndpointBindingPolicy**, with the certificate defined in a certificates section in the application manifest.

```xml
<Policies>
   <RunAsPolicy CodePackageRef="Code" UserRef="Customer1" />
  <!--SecurityAccessPolicy is needed if RunAsPolicy is defined and the Endpoint is http -->
   <SecurityAccessPolicy ResourceRef="EndpointName" PrincipalRef="Customer1" />
  <!--EndpointBindingPolicy is needed if the EndpointName is secured with https -->
  <EndpointBindingPolicy EndpointRef="EndpointName" CertificateRef="Cert1" />
</Policies
```

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
* [Understand the application model](service-fabric-application-model.md)
* [Specify resources in a service manifest](service-fabric-service-manifest-resources.md)
* [Deploy an application](service-fabric-deploy-remove-applications.md)

[image1]: ./media/service-fabric-application-runas-security/copy-to-output.png
