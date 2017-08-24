---

title: Azure service fabric security overview| Microsoft Docs
description: This article provides an overview of the Azure service fabric security.
services: security
documentationcenter: na
author: unifycloud
manager: swadhwa
editor: tomsh

ms.assetid: 
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/04/2017
ms.author: tomsh

---
# Azure Service Fabric security overview
[Azure Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-overview) is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable micro-services. Service Fabric addresses the significant challenges in developing and managing cloud applications. Developers and administrators can avoid complex infrastructure problems and focus on implementing mission-critical, demanding workloads that are scalable, reliable, and manageable.

This Azure Service Fabric Security Overview article focuses on the following areas:

-	Securing your cluster
-	Monitoring and diagnostics
-	Secure using Certificates
-	Role-based access control (RBAC)
-	Secure cluster using Windows security
-	Configure application security in Service Fabric
-	Secure communication for services in Azure Service Fabric Security

## Securing your cluster
Azure Service Fabric is an orchestrator of services across a cluster of machines, Clusters must be secured to prevent unauthorized users from connecting to your cluster, especially when it has production workloads running on it. Although it is possible to create an unsecured cluster, doing so allows anonymous users to connect to it, if it exposes management endpoints to the public Internet.

This section provides an overview of the security scenarios for clusters running on Azure or standalone and the various technologies used to implement those scenarios. The cluster security scenarios are:

-	Node-to-node security
-	Client-to-node security

### Node-to-node security
Secures communication between the VMs or machines in the cluster. This ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster.

Clusters running on Azure or standalone clusters running on Windows can use either [Certificate Security](https://msdn.microsoft.com/library/ff649801.aspx) or [Windows Security](https://msdn.microsoft.com/library/ff649396.aspx) for Windows Server machines.

**Node-to-node certificate security**

Service Fabric uses X.509 server certificates that you specify as a part of the node-type configurations when you create a cluster. A quick overview of what these certificates are and [how you can acquire or create them is provided in this article](https://docs.microsoft.com/dotnet/framework/wcf/feature-details/working-with-certificates).

Certificate security is configured while creating the cluster either through the Azure portal, Azure Resource Manager templates, or a standalone JSON template. You can specify a primary certificate and an optional secondary certificate that is used for certificate rollovers. The primary and secondary certificates you specify should be different than the admin client and read-only client certificates you specify for  [Client-to-node security](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-security).

### Client-to-node security
Client to node security is configured using Client Identities. To establish trust between a client and the cluster, you must configure the cluster to know which client identities that it can trust. This can be done in two different ways:

-	Specify the domain group users that can connect or
-	Specify the domain node users that can connect.

Service Fabric supports two different access control types for clients that are connected to a Service Fabric cluster:

-	Administrator
-	User

Access control provides the ability for the cluster administrator to limit access to certain types of cluster operations for different groups of users, making the cluster more secure. Administrators have full access to management capabilities (including read/write capabilities). Users, by default, have only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.

**Client-to-node certificate security**

Client-to-node certificate security is configured while creating the cluster either through the Azure portal, Resource Manager Templates or a standalone JSON template by specifying an admin client certificate and/or a user client certificate. The admin client and user client certificates you specify should be different than the primary and secondary certificates you specify for Node-to-node security.

Clients connecting to the cluster using the admin certificate have full access to management capabilities. Clients connecting to the cluster using the read-only user client certificate have only read access to management capabilities. In other word these certificates are used for the role bases access control (RBAC).

For Azure read [Set up a cluster by using an Azure Resource Manager template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm) to learn how to configure certificate security in a cluster.

**Client-to-node Azure Active Directory (AAD) security on Azure**

Clusters running on Azure can also secure access to the management endpoints using Azure Active Directory (AAD). See [Set up a cluster by using an Azure Resource Manager template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm) for information on how to create the necessary AAD artifacts, how to populate them during cluster creation, and how to connect to those clusters afterwards.

AAD enables organizations (known as tenants) to manage user access to applications, which are divided into applications with a web-based login UI and applications with a native client experience.

A Service Fabric cluster offers several entry points to its management functionality, including the web-based Service Fabric Explorer and Visual Studio. As a result, you create two AAD applications to control access to the cluster, one web application and one native application.
For Azure clusters, it is recommended that you use AAD security to authenticate clients and certificates for node-to-node security.

For standalone Windows Server clusters, it is recommended that you use Windows security with group managed accounts (GMA) if you have Windows Server 2012 R2 and Active Directory. Otherwise still use Windows security with Windows accounts.

## Monitoring and diagnostics for Azure Service Fabric
[Monitoring and diagnostics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-overview) are critical to developing, testing, and deploying applications and services in any environment. Service Fabric solutions work best when you plan and implement monitoring and diagnostics that help ensure applications and services are working as expected in a local development environment or in production.

From a security perspective, the main goals of monitoring and diagnostics are to:

-	Detect and diagnose hardware and infrastructure issues that might be due to a security event.
-	Detect software and app issues which could provide indicator of compromise (IoC).
-	Understand resource consumption to help prevent inadvertent denial of service.

The overall workflow of monitoring and diagnostics consists of three steps:

-	**Event generation:** this includes events (logs, traces, custom events) at both the infrastructure (cluster) and application / service level. Read more about [infrastructure level events](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-generation-infra) and [application level events](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-generation-app) to understand what is provided and how to add further instrumentation.
-	**Event aggregation:** generated events need to be collected and aggregated before they can be displayed. We typically recommend using [Azure Diagnostics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-aggregation-wad) (more similar to agent-based log collection) or [EventFlow](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-aggregation-eventflow) (in-process log collection).
-	**Analysis:** events need to be visualized and accessible in some format, to allow for analysis and display as needed. There are several great platforms that exist in the market when it comes to the analysis and visualization of monitoring and diagnostics data. The two that we recommend are [OMS](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-analysis-oms) and [Application Insights](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-analysis-appinsights) due to their better integration with Service Fabric.

You can also use [Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview) to monitor many of the Azure resources on which a Service Fabric cluster is built.

A watchdog is a separate service that can watch health and load across services, and report health for anything in the health model hierarchy. This can help prevent errors that would not be detected based on the view of a single service. Watchdogs are also a good place to host code that performs remedial actions without user interaction (for example, cleaning up log files in storage at certain time intervals). You can find a sample watchdog service implementation [here](https://azure.microsoft.com/resources/samples/service-fabric-watchdog-service/).

## Secure using Certificates
Using certificates, it tells how to secure the communication between the various nodes of your standalone Windows cluster, as well as how to authenticate clients connecting to this cluster, using X.509 certificates. This ensures that only authorized users can access the cluster, the deployed applications and perform management tasks. Certificate security should be enabled on the cluster when the cluster is created.

### X.509 certificates and Service Fabric
X.509 digital certificates are commonly used to authenticate clients and servers and to encrypt and digitally sign messages.

The following table lists the certificates that you will need on your cluster setup:

|Certificate Information Setting |Description|
|-------------------------------|-----------|
|ClusterCertificate|	This certificate is required to secure the communication between the nodes on a cluster. You can use two different certificates, a primary and a secondary for upgrade.|
|ServerCertificate|	This certificate is presented to the client when it tries to connect to this cluster. You can use two different server certificates, a primary and a secondary for upgrade.|
|ClientCertificateThumbprints|	This is a set of certificates that you want to install on the authenticated clients.|
|ClientCertificateCommonNames|	Set the common name of the first client certificate for the CertificateCommonName. The CertificateIssuerThumbprint is the thumbprint for the issuer of this certificate.|
|ReverseProxyCertificate|	This is an optional certificate that can be specified if you want to secure your [Reverse Proxy](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy).|

For more information on securing certificates, [click here](https://docs.microsoft.com/azure/service-fabric/service-fabric-windows-cluster-x509-security).

## Role-based access control (RBAC)
Access control allows the cluster administrator to limit access to certain cluster operations for different groups of users, making the cluster more secure. Two different access control types are supported for clients connecting to a cluster: Administrator role and User role.

Administrators have full access to management capabilities (including read/write capabilities). Users, by default, have only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.

You specify the administrator and user client roles at the time of cluster creation by providing separate identities (certificates, AAD etc.) for each. For more information on the default access control settings and how to change the default settings, see [Role based access control for Service Fabric clients](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security-roles).

## Secure standalone cluster using Windows security
To prevent unauthorized access to a Service Fabric cluster, you must secure the cluster. Security is especially important when the cluster runs production workloads. It describes how to configure node-to-node and client-to-node security by using Windows security in the ClusterConfig.JSON file.

**Configure Windows security using gMSA**

Node to node security is configured by setting [ClustergMSAIdentity](https://docs.microsoft.com/azure/service-fabric/service-fabric-windows-cluster-windows-security) when service fabric needs to run under gMSA. In order to build trust relationships between nodes, they must be made aware of each other.

Client to node security is configured using ClientIdentities. In order to establish trust between a client and the cluster, you must configure the cluster to know which client identities that it can trust.

**Configure Windows security using a machine group**

Node to node security is configured by setting using ClusterIdentity if you want to use a machine group within an Active Directory Domain. For more information, see [Create a Machine Group in Active Directory](https://msdn.microsoft.com/library/aa545347).

Client-to-node security is configured by using ClientIdentities. To establish trust between a client and the cluster, you must configure the cluster to know the client identities that the cluster can trust. You can establish trust in two different ways:

-	Specify the domain group users that can connect.
-	Specify the domain node users that can connect.

## Configure application security in Service Fabric
### Managing secrets in Service Fabric applications
This method helps in managing secrets in a Service Fabric application. Secrets can be any sensitive information, such as storage connection strings, passwords, or other values that should not be handled in plain text.

This approach uses [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis) to manage keys and secrets. However, using secrets in an application is cloud platform-agnostic to allow applications to be deployed to a cluster hosted anywhere. There are four main steps in this flow:

-	Obtain a data encipherment certificate.
-	Install the certificate in your cluster.
-	Encrypt secret values when deploying an application with the certificate and inject them into a service's Settings.xml configuration file.
-	Read encrypted values out of Settings.xml by decrypting with the same encipherment certificate.

>[!Note]
>Learn more about [Managing secrets in Service Fabric applications](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-secret-management).

### Configure security policies for your application
By using Azure Service Fabric Security, you can help secure applications that are running in the cluster under different user accounts. Service Fabric Security also helps secure the resources that are used by applications at the time of deployment under the user accounts--for example, files, directories, and certificates. This makes running applications, even in a shared hosted environment, more secure from one another.
The steps include:

-	Configure the policy for a service setup entry point.
-	Start PowerShell commands from a setup entry point.
-	Use console redirection for local debugging.
-	Configure a policy for service code packages.
-	Assign a security access policy for HTTP and HTTPS endpoints.

## Secure communication for services in Azure Service Fabric security
Security is one of the most important aspects of communication. The Reliable Services application framework provides a few prebuilt communication stacks and tools that can be used to improve security.

-	[Help secure a service when you're using service remoting](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-secure-communication).
-	[Help secure a service when you're using a WCF-based communication stack](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-secure-communication#help-secure-a-service-when-youre-using-a-wcf-based-communication-stack).

## Next steps
- For conceptual information about cluster security, see [create a cluster in Azure using a Resource Manager template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm) and [Azure portal](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-portal).
- Learn more about, see [Service Fabric cluster security](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security).
