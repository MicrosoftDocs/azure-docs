---
title: Learn about Azure Service Fabric application security
description: An overview of how to securely run microservices applications on Service Fabric. Learn how to run services and startup script under different security accounts, authenticate and authorize users, manage application secrets, secure service communications, use an API gateway, and secure application data at rest. 
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Service Fabric application and service security
A microservices architecture can bring [many benefits](service-fabric-overview-microservices.md). Managing the security of microservices, however, is a challenge and different than managing traditional monolithic applications security. 

With a monolith, the application is typically running on one or more servers within a network and it's easier to identify the exposed ports and APIs and IP address. There is often one perimeter or boundary and one database to protect. If that system is compromised because of a security breach or attack, it is likely that everything within the system will be available to the attacker. With microservices, the system is more complex.  Services are decentralized and distributed across many hosts and migrate from host to host.  With proper security, you limit the privileges an attacker can get and the amount of data available in a single attack by breaching one service.  Communication is not internal, but happens over a network, and there are many exposed ports and interactions between services. Knowing what these service interactions are and when they happen is crucial to your application security.

This article is not a guide to microservices security, there are many such resources available online, but describes how different aspects of security can be accomplished in Service Fabric.

## Authentication and authorization
It is often necessary for resources and APIs exposed by a service to be limited to certain trusted users or clients. Authentication is the process of reliably ascertaining a user’s identity.  Authorization is the process that makes APIs or services available to some authenticated users but not others.

### Authentication
The first step to making API-level trust decisions is authentication. Authentication is the process of reliably ascertaining a user’s identity.  In microservice scenarios, authentication is typically handled centrally. If you are using an API Gateway, you can [offload authentication](/azure/architecture/patterns/gateway-offloading) to the gateway. If you use this approach, make sure that the individual services cannot be reached directly (without the API Gateway) unless additional security is in place to authenticate messages whether they come from the gateway or not.

If services can be accessed directly, an authentication service like Azure Active Directory or a dedicated authentication microservice acting as a security token service (STS) can be used to authenticate users. Trust decisions are shared between services with security tokens or cookies. 

For ASP.NET Core, the primary mechanism for [authenticating users](/dotnet/standard/microservices-architecture/secure-net-microservices-web-applications/) is the ASP.NET Core Identity membership system. ASP.NET Core Identity stores user information (including sign-in information, roles, and claims) in a data store configured by the developer. ASP.NET Core Identity supports two-factor authentication.  External authentication providers are also supported, so users can sign in using existing authentication processes from providers like Microsoft, Google, Facebook, or Twitter.

### Authorization
After authentication, services need to authorize user access or determine what a user is able to do. This process allows a service to make APIs available to some authenticated users, but not to all. Authorization is orthogonal and independent from authentication, which is the process of ascertaining who a user is. Authentication may create one or more identities for the current user.

[ASP.NET Core authorization](/dotnet/standard/microservices-architecture/secure-net-microservices-web-applications/authorization-net-microservices-web-applications) can be done based on users’ roles or based on custom policy, which might include inspecting claims or other heuristics.

## Restrict and secure access using an API gateway
Cloud applications typically need a front-end gateway to provide a single point of ingress for users, devices, or other applications. An [API gateway](/azure/architecture/microservices/gateway) sits between clients and services and is the entry point to all the services that your application is providing. It acts as a reverse proxy, routing requests from clients to services. It may also perform various cross-cutting tasks such as authentication and authorization, TLS termination, and rate limiting. If you don't deploy a gateway, clients must send requests directly to front-end services.

In Service Fabric, a gateway can be any stateless service such as an [ASP.NET Core application](service-fabric-reliable-services-communication-aspnetcore.md), or another service designed for traffic ingress, such as [Traefik](https://docs.traefik.io/), [Event Hubs](../event-hubs/index.yml), [IoT Hub](../iot-hub/index.yml), or [Azure API Management](../api-management/index.yml).

API Management integrates directly with Service Fabric, allowing you to publish APIs with a rich set of routing rules to your back-end Service Fabric services.  You can secure access to backend services, prevent DOS attacks by using throttling, or verify API keys, JWT tokens, certificates, and other credentials. To learn more, read [Service Fabric with Azure API Management overview](service-fabric-api-management-overview.md).

## Manage application secrets
Secrets can be any sensitive information, such as storage connection strings, passwords, or other values that should not be handled in plain text. This article uses Azure Key Vault to manage keys and secrets. However, *using* secrets in an application is cloud platform-agnostic to allow applications to be deployed to a cluster hosted anywhere.

The recommended way to manage service configuration settings is through [service configuration packages][config-package]. Configuration packages are versioned and updatable through managed rolling upgrades with health-validation and auto rollback. This is preferred to global configuration as it reduces the chances of a global service outage. Encrypted secrets are no exception. Service Fabric has built-in features for encrypting and decrypting values in a configuration package Settings.xml file using certificate encryption.

The following diagram illustrates the basic flow for secret management in a Service Fabric application:

![secret management overview][overview]

There are four main steps in this flow:

1. Obtain a data encipherment certificate.
2. Install the certificate in your cluster.
3. Encrypt secret values when deploying an application with the certificate and inject them into a service's Settings.xml configuration file.
4. Read encrypted values out of Settings.xml by decrypting with the same encipherment certificate. 

[Azure Key Vault][key-vault-get-started] is used here as a safe storage location for certificates and as a way to get certificates installed on Service Fabric clusters in Azure. If you are not deploying to Azure, you do not need to use Key Vault to manage secrets in Service Fabric applications.

For an example, see [Manage application secrets](service-fabric-application-secret-management.md).

## Secure the hosting environment
By using Azure Service Fabric, you can secure applications that are running in the cluster under different user accounts. Service Fabric also helps secure the resources that are used by applications at the time of deployment under the user accounts--for example, files, directories, and certificates. This makes running applications, even in a shared hosted environment, more secure from one another.

The application manifest declares the security principals (users and groups) required run the service(s) and secure resources.  These security principals are referenced in policies, for example the run-as, endpoint binding, package sharing, or security access policies.  Policies are then applied to service resources in the **ServiceManifestImport** section of the application manifest.

When declaring principals, you can also define and create user groups so that one or more users can be added to each group to be managed together. This is useful when there are multiple users for different service entry points and they need to have certain common privileges that are available at the group level.

By default, Service Fabric applications run under the account that the Fabric.exe process runs under. Service Fabric also provides the capability to run applications under a local user account or local system account, which is specified within the application manifest. For more information, see [Run a service as a local user account or local system account](service-fabric-application-runas-security.md).  You can also [Run a service startup script as a local user or system account](service-fabric-run-script-at-service-startup.md).

When you're running Service Fabric on a Windows standalone cluster, you can run a service under [Active Directory domain accounts](service-fabric-run-service-as-ad-user-or-group.md) or [group managed service accounts](service-fabric-run-service-as-gmsa.md).

## Secure containers
Service Fabric provides a mechanism for services inside a container to access a certificate that is installed on the nodes in a Windows or Linux cluster (version 5.7 or higher). This PFX certificate can be used for authenticating the application or service or secure communication with other services. For more information, see [Import a certificate into a container](service-fabric-securing-containers.md).

In addition, Service Fabric also supports gMSA (group Managed Service Accounts) for Windows containers. For more information, see [Set up gMSA for Windows containers](service-fabric-setup-gmsa-for-windows-containers.md).

## Secure service communication
In Service Fabric, a service runs somewhere in a Service Fabric cluster, typically distributed across multiple VMs. Service Fabric provides several options for securing your service communications.

You can enable HTTPS endpoints in your [ASP.NET Core or Java](service-fabric-service-manifest-resources.md#example-specifying-an-https-endpoint-for-your-service) web services.

You can establish secure connection between the reverse proxy and services, thus enabling an end to end secure channel. Connecting to secure services is supported only when reverse proxy is configured to listen on HTTPS. For information on configuring the reverse proxy, read [Reverse proxy in Azure Service Fabric](service-fabric-reverseproxy.md).  [Connect to a secure service](service-fabric-reverseproxy-configure-secure-communication.md) describes how to establish secure connection between the reverse proxy and services.

The Reliable Services application framework provides a few prebuilt communication stacks and tools that you can use to improve security. Learn how to improve security when you're using service remoting (in [C#](service-fabric-reliable-services-secure-communication.md) or [Java](service-fabric-reliable-services-secure-communication-java.md)) or using [WCF](service-fabric-reliable-services-secure-communication-wcf.md).


### Include endpoint certificate in Service Fabric applications

To configure your application endpoint certificate, include the certificate by adding a **EndpointCertificate** element along with the **User** element for the principal account to the application manifest. By default the principal account is NetworkService. This will provide management of the application certificate private key ACL for the provided principal.

```xml
<ApplicationManifest … >
  ...
  <Principals>
    <Users>
      <User Name="Service1" AccountType="NetworkService" />
    </Users>
  </Principals>
  <Certificates>
    <EndpointCertificate Name="MyCert" X509FindType="FindByThumbprint" X509FindValue="[YourCertThumbprint]"/>
  </Certificates>
</ApplicationManifest>
```

## Encrypt application data at rest
Each [node type](service-fabric-cluster-nodetypes.md) in a Service Fabric cluster running in Azure is backed by a [virtual machine scale set](../virtual-machine-scale-sets/overview.md). Using an Azure Resource Manager template, you can attach data disks to the scale set(s) that make up the Service Fabric cluster.  If your services save data to an attached data disk, you can [encrypt those data disks](../virtual-machine-scale-sets/disk-encryption-powershell.md) to protect your application data.

<!--TO DO: Enable BitLocker on Windows standalone clusters?
TO DO: Encrypt disks on Linux clusters?-->


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
* [Run a setup script at service startup](service-fabric-run-script-at-service-startup.md)
* [Specify resources in a service manifest](service-fabric-service-manifest-resources.md)
* [Deploy an application](service-fabric-deploy-remove-applications.md)
* [Learn about cluster security](service-fabric-cluster-security.md)

<!-- Links -->
[key-vault-get-started]:../key-vault/general/overview.md
[config-package]: service-fabric-application-and-service-manifests.md
[service-fabric-cluster-creation-via-arm]: service-fabric-cluster-creation-via-arm.md

<!-- Images -->
[overview]:./media/service-fabric-application-and-service-security/overview.png
