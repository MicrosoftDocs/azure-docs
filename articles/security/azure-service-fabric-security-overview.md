---

title: Azure service fabric security overview| Microsoft Docs
description: This article provides an overview of Azure Service Fabric security.
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
[Azure Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-overview) is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices. Service Fabric addresses the significant challenges of developing and managing cloud applications. Developers and administrators can avoid complex infrastructure problems and focus on implementing mission-critical, demanding workloads that are scalable, reliable, and manageable.

This Azure Service Fabric Security overview article focuses on the following areas:

-	Securing your cluster
-	Understanding monitoring and diagnostics
-	Creating more secure environments by using certificates
-	Using Role-Based Access Control (RBAC)
-	Securing clusters by using Windows security
-	Configuring application security in Service Fabric
-	Securing communication for services in Azure Service Fabric 

## Secure your cluster
Azure Service Fabric orchestrates services across a cluster of machines. Clusters must be secured to prevent unauthorized users from connecting to them, especially when they are running production workloads. Although it's possible to create an unsecured cluster, this might allow anonymous users to connect to it (if it exposes management endpoints to the public internet).

This section provides an overview of the security scenarios for clusters that are running either standalone or on Azure. It also describes the various technologies that are used to implement those scenarios. The cluster security scenarios are:

-	Node-to-node security
-	Client-to-node security

### Node-to-node security
Node-to-node security secures communication between the VMs or machines in a cluster. With node-to-node security, only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster.

Clusters that are running on Azure or standalone clusters that are running on Windows can use either [certificate security](https://msdn.microsoft.com/library/ff649801.aspx) or [Windows security](https://msdn.microsoft.com/library/ff649396.aspx) for Windows Server machines.

**Understand node-to-node certificate security**

Service Fabric uses X.509 server certificates that you specify when you create a cluster. For a quick overview of what these certificates are and how you can acquire or create them, see [Working with certificates](https://docs.microsoft.com/dotnet/framework/wcf/feature-details/working-with-certificates).

You configure certificate security when you create the cluster, either through the Azure portal, Azure Resource Manager templates, or a standalone JSON template. You can specify a primary certificate and an optional secondary certificate that is used for certificate rollovers. The primary and secondary certificates you specify should be different than the admin client and read-only client certificates that you specify for [client-to-node security](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-security).

### Client-to-node security
You configure client-to-node security by using client identities. To establish trust between a client and a cluster, you must configure the cluster to know which client identities it can trust. This can be done in two different ways:

-	Specify the domain group users that can connect. 
-	Specify the domain node users that can connect.

Service Fabric supports two different access control types for clients that are connected to a Service Fabric cluster:

-	Administrator
-	User

By using access control, cluster administrators can limit access to certain types of cluster operations. This makes the cluster more secure.

 Administrators have full access to management capabilities (including read/write capabilities). Users, by default, have only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.

**Understand client-to-node certificate security**

You configure client-to-node certificate security when you create a cluster either through the Azure portal, Resource Manager templates, or a standalone JSON template. You need to specify an admin client certificate and/or a user client certificate. 

The admin client and user client certificates that you specify should be different than the primary and secondary certificates that you specify for node-to-node security.

Clients that connect to the cluster by using the admin certificate have full access to management capabilities. Clients that connect to the cluster by using the read-only user client certificate have only read access to management capabilities. In other words, these certificates are used for RBAC.

To learn how to configure certificate security in a cluster, see [Set up a cluster by using an Azure Resource Manager template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm).

**Understand client-to-node Azure Active Directory security on Azure**

Clusters that are running on Azure can also secure access to the management endpoints by using Azure Active Directory (Azure AD). For information about how to create the necessary Azure Active Directory artifacts, how to populate them during cluster creation, and how to connect to those clusters, see [Set up a cluster by using an Azure Resource Manager template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm).

Azure AD enables organizations (known as tenants) to manage user access to applications. There are applications with a web-based sign-in UI, and applications with a native client experience.

A Service Fabric cluster offers several entry points to its management functionality, including the web-based Service Fabric Explorer and Visual Studio. As a result, you create two Azure AD applications to control access to the cluster: one web application, and one native application.

For Azure clusters, we recommend that you use Azure AD security to authenticate clients and certificates for node-to-node security.

For standalone Windows Server clusters with Windows Server 2012 R2 and Active Directory, we recommend that you use Windows security with group managed accounts.  Otherwise, use Windows security with Windows accounts.

## Understand monitoring and diagnostics in Azure Service Fabric
[Monitoring and diagnostics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-overview) are critical to developing, testing, and deploying applications and services in any environment. Service Fabric solutions work best when you implement monitoring and diagnostics to ensure that applications and services work as expected in a local development environment or in production.

From a security perspective, the main goals of monitoring and diagnostics are:

-	Detect and diagnose hardware and infrastructure issues that might be caused by a security event.
-	Detect software and app issues that could be an indicator of compromise (IoC).
-	Understand resource consumption to help prevent inadvertent denial of service.

The overall workflow of monitoring and diagnostics consists of three steps:

-	**Event generation:** Event generation includes events (logs, traces, custom events) at both the infrastructure (cluster) and application/service level. Read more about [infrastructure-level events](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-generation-infra) and [application-level events](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-generation-app) to understand what is provided and how to add further instrumentation.

-	**Event aggregation:** Generated events need to be collected and aggregated before they can be displayed. We typically recommend using [Azure Diagnostics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-aggregation-wad) (similar to agent-based log collection) or [EventFlow](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-aggregation-eventflow) (in-process log collection).

-	**Analysis:** Events need to be visualized and accessible in some format, to allow for analysis and display. There are several platforms for the analysis and visualization of monitoring and diagnostics data. The two that we recommend are [Operations Management Suite](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-analysis-oms) and [Azure Application Insights](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-analysis-appinsights) due to their good integration with Service Fabric.

You can also use [Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview) to monitor many of the Azure resources on which a Service Fabric cluster is built.

A watchdog is a separate service that can watch health, load across services, and report health for anything in the health model hierarchy. Using a watchdog can help prevent errors that would not be detected based on the view of a single service. 

Watchdogs are also a good place to host code that performs remedial actions without user interaction (for example, cleaning up log files in storage at certain time intervals). You can find a sample watchdog service implementation at [Azure Service Fabric watchdog sample](https://azure.microsoft.com/resources/samples/service-fabric-watchdog-service/).

## Understand how to secure communication by using certificates
Certificates help you secure the communication between the various nodes of your standalone Windows cluster. By using X.509 certificates, you can also authenticate clients that are connecting to this cluster. This ensures that only authorized users can access the cluster. We recommend that you enable a certificate on the cluster when you create it.

### X.509 certificates and Service Fabric
X.509 digital certificates are commonly used to authenticate clients and servers. They are also used to encrypt and digitally sign messages.

The following table lists the certificates that you need on your cluster setup:

|Certificate information setting |Description|
|-------------------------------|-----------|
|ClusterCertificate|	This certificate is required to secure the communication between the nodes on a cluster. You can use two different certificates: a primary certificate, and a secondary for upgrade.|
|ServerCertificate|	This certificate is presented to the client when it tries to connect to this cluster. You can use two different server certificates: a primary certificate, and a secondary for upgrade.|
|ClientCertificateThumbprints|	This is a set of certificates to install on the authenticated clients.|
|ClientCertificateCommonNames|	This is the common name of the first client certificate for CertificateCommonName. CertificateIssuerThumbprint is the thumbprint for the issuer of this certificate.|
|ReverseProxyCertificate|	This is an optional certificate that can be specified to secure your [reverse proxy](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy).|

For more information about securing certificates, see [Secure a standalone cluster on Windows using X.509 certificates](https://docs.microsoft.com/azure/service-fabric/service-fabric-windows-cluster-x509-security).

## Understand Role-Based Access Control
Access control allows the cluster administrator to limit access to certain cluster operations for different groups of users, thus making the cluster more secure. Two different access control types are supported for clients that are connecting to a cluster: 

- Administrator role
- User role

Administrators have full access to management capabilities (including read/write capabilities). Users, by default, have only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.

You specify the administrator and user client roles at the time of cluster creation by providing separate identities (including certificates) for each. For more information about the default access control settings and how to change the default settings, see [Role-Based Access Control for Service Fabric clients](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security-roles).

## Secure standalone cluster by using Windows security
To prevent unauthorized access to a Service Fabric cluster, you must secure the cluster. Security is especially important when the cluster runs production workloads. It describes how to configure node-to-node and client-to-node security by using Windows security in the ClusterConfig.JSON file.

**Configure Windows security by using gMSA**

When Service Fabric needs to run under gMSA, you configure node-to-node security by setting [ClustergMSAIdentity](https://docs.microsoft.com/azure/service-fabric/service-fabric-windows-cluster-windows-security). To build trust relationships between nodes, they must be made aware of each other.

You configure client-to-node security by using ClientIdentities. To establish trust between a client and the cluster, you must configure the cluster to recognize which client identities it can trust.

**Configure Windows security by using a machine group**

If you want to use a machine group within an Active Directory domain, you configure node-to-node security by setting ClusterIdentity. For more information, see [Create a machine group in Active Directory](https://msdn.microsoft.com/library/aa545347).

You configure client-to-node security by using ClientIdentities. To establish trust between a client and the cluster, you must configure the cluster to recognize the client identities that the cluster can trust. You can establish trust in two different ways:

-	Specify the domain group users that can connect.
-	Specify the domain node users that can connect.

## Configure application security in Service Fabric
### Manage secrets in Service Fabric applications
This method helps manage secrets in a Service Fabric application. Secrets can be any sensitive information, such as storage connection strings, passwords, or other values that should not be handled in plain text.

This approach uses [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis) to manage keys and secrets. However, using secrets in an application is cloud platform-agnostic. This means that applications can be deployed to a cluster that's hosted anywhere. There are four main steps in this flow:

-	Obtain a data encipherment certificate.
-	Install the certificate on your cluster.
-	Encrypt secret values when deploying an application with the certificate and inject them into a service's Settings.xml configuration file.
-	Read encrypted values out of Settings.xml by decrypting them with the same encipherment certificate.

>[!NOTE]
>Learn more about [managing secrets in Service Fabric applications](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-secret-management).

### Configure security policies for your application
By using Azure Service Fabric security, you can help secure applications that are running in the cluster under different user accounts. Service Fabric Security also helps secure the resources that are used by applications at the time of deployment under the user accounts--for example, files, directories, and certificates. This makes running applications, even in a shared hosted environment, more secure.

The steps include:

-	Configuring the policy for a service setup entry point.
-	Starting PowerShell commands from a setup entry point.
-	Using console redirection for local debugging.
-	Configuring a policy for service code packages.
-	Assigning a security access policy for HTTP and HTTPS endpoints.

## Secure communication for services in Azure Service Fabric security
Security is one of the most important aspects of communication. The Reliable Services application framework provides a few prebuilt communication stacks and tools that can be used to improve security.

-	[Help secure a service when you're using service remoting](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-secure-communication)
-	[Help secure a service when you're using a WCF-based communication stack](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-secure-communication#help-secure-a-service-when-youre-using-a-wcf-based-communication-stack)

## Next steps
- For conceptual information about cluster security, see [Create a Service Fabric cluster by using Azure Resource Manager](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm) and [Azure portal](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-portal).
- To learn more about cluster security in Service Fabric, see [Service Fabric cluster security](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security).
