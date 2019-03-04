---

title: Azure Service Fabric security overview| Microsoft Docs
description: This article provides an overview of Azure Service Fabric security.
services: security
documentationcenter: na
author: unifycloud
manager: barbkess
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
[Azure Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-overview) is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices. Service Fabric addresses the challenges of developing and managing cloud applications. Developers and administrators can avoid complex infrastructure problems and focus on implementing mission-critical, demanding workloads that are scalable and reliable.

This article is an overview of security considerations for a Service Fabric deployment.

## Secure your cluster
Azure Service Fabric orchestrates services across a cluster of machines. Clusters must be secured to prevent unauthorized users from connecting to them, especially when they're running production workloads. Although it's possible to create an unsecured cluster, this might allow anonymous users to connect to the cluster (if it exposes management endpoints to the public internet).

For clusters that are running either standalone or on Azure, two scenarios to consider are node-to-node security and client-to-node security. You can use various technologies to implement those scenarios.

### Node-to-node security
Node-to-node security applies to communication between the VMs or machines in a cluster. With node-to-node security, only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster.

Clusters that are running on Azure or standalone clusters that are running on Windows can use either [certificate security](https://msdn.microsoft.com/library/ff649801.aspx) or [Windows security](https://msdn.microsoft.com/library/ff649396.aspx) for Windows Server machines.

#### Node-to-node certificate security

Service Fabric uses X.509 server certificates that you specify when you create a cluster. For a quick overview of what these certificates are and how you can acquire or create them, see [Working with certificates](https://docs.microsoft.com/dotnet/framework/wcf/feature-details/working-with-certificates).

You configure certificate security when you create the cluster through the Azure portal, Azure Resource Manager templates, or a standalone JSON template. You can specify a primary certificate and an optional secondary certificate that's used for certificate rollovers. The primary and secondary certificates that you specify should be different from the admin client and read-only client certificates that you specify for [client-to-node security](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security).

### Client-to-node security
You configure client-to-node security by using client identities. To establish trust between a client and a cluster, you must configure the cluster to know which client identities it can trust.

Service Fabric supports two access control types for clients that are connected to a Service Fabric cluster:

-	**Administrator**: Full access to management capabilities, including read/write capabilities.
-	**User**: Only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.

By using access control, cluster administrators can limit access to certain types of cluster operations. This makes the cluster more secure.

#### Client-to-node certificate security

You configure client-to-node certificate security when you create a cluster through the Azure portal, Resource Manager templates, or a standalone JSON template. You need to specify an admin client certificate and/or a user client certificate. Make sure that these certificates are different from the primary and secondary certificates that you specify for node-to-node security.

Clients that connect to the cluster by using the admin certificate have full access to management capabilities. Clients that connect to the cluster by using the read-only user client certificate have only read access to management capabilities. In other words, these certificates are used for role-based access control (RBAC).

To learn how to configure certificate security in a cluster, see [Set up a cluster by using an Azure Resource Manager template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm).

#### Client-to-node Azure Active Directory security

Clusters that are running on Azure can also secure access to the management endpoints by using Azure Active Directory (Azure AD). For information about how to create the necessary Azure Active Directory artifacts, how to populate them during cluster creation, and how to connect to those clusters, see [Set up a cluster by using an Azure Resource Manager template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm).

Azure AD enables organizations (known as tenants) to manage user access to applications. There are applications with a web-based sign-in UI, and applications with a native client experience.

A Service Fabric cluster offers several entry points to its management functionality, including the web-based Service Fabric Explorer and Visual Studio. As a result, you create two Azure AD applications to control access to the cluster: one web application and one native application.

For Azure clusters, we recommend that you use Azure AD security to authenticate clients and certificates for node-to-node security.

For standalone Windows Server clusters with Windows Server 2012 R2 and Active Directory, we recommend that you use Windows security with group Managed Service Accounts (gMSAs). Otherwise, use Windows security with Windows accounts.

## Understand monitoring and diagnostics in Service Fabric
[Monitoring and diagnostics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-overview) are critical to developing, testing, and deploying applications and services in any environment. Service Fabric solutions work best when you implement monitoring and diagnostics to ensure that applications and services work as expected in a local development environment or in production.

From a security perspective, the main goals of monitoring and diagnostics are:

-	Detect and diagnose hardware and infrastructure problems that might be caused by a security event.
-	Detect software and app issues that might be an indicator of compromise (IoC).
-	Understand resource consumption to help prevent inadvertent denial of service.

The workflow of monitoring and diagnostics consists of three steps:

1.	**Event generation**: Event generation includes events (logs, traces, custom events) at both the infrastructure (cluster) level and the application/service level. Read more about [infrastructure-level events](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-generation-infra) and [application-level events](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-generation-app) to understand what's provided and how to add further instrumentation.

2.	**Event aggregation**: Generated events need to be collected and aggregated before they can be displayed. We typically recommend using [Azure Diagnostics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-aggregation-wad) (similar to agent-based log collection) or [EventFlow](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-aggregation-eventflow) (in-process log collection).

3.	**Analysis**: Events need to be visualized and accessible in some format, to allow for analysis and display. There are several platforms for the analysis and visualization of monitoring and diagnostics data. We recommend [Azure Monitor logs](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-analysis-oms) and [Azure Application Insights](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-event-analysis-appinsights) because they integrate well with Service Fabric.

You can also use [Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview) to monitor many of the Azure resources on which a Service Fabric cluster is built.

A watchdog is a separate service that can watch health and load across services, and report health for anything in the health model hierarchy. Using a watchdog can help prevent errors that would not be detected based on the view of a single service. 

Watchdogs are also a good place to host code that performs remedial actions without user interaction. An example is cleaning up log files in storage at certain time intervals. You can find a sample watchdog service implementation at [Azure Service Fabric watchdog sample](https://azure.microsoft.com/resources/samples/service-fabric-watchdog-service/).

## Secure communication by using certificates
Certificates help you secure the communication between the various nodes of your standalone Windows cluster. By using X.509 certificates, you can also authenticate clients that are connecting to this cluster. This ensures that only authorized users can access the cluster. We recommend that you enable a certificate on the cluster when you create it.

X.509 digital certificates are commonly used to authenticate clients and servers. They're also used to encrypt and digitally sign messages.

The following table lists the certificates that you need on your cluster setup:

|Certificate information setting |Description|
|-------------------------------|-----------|
|ClusterCertificate|	This certificate is required to secure the communication between the nodes on a cluster. You can use two cluster certificates: a primary certificate, and a secondary for upgrade.|
|ServerCertificate|	This certificate is presented to the client when it tries to connect to this cluster. You can use two server certificates: a primary certificate, and a secondary for upgrade.|
|ClientCertificateThumbprints|	This is a set of certificates to install on the authenticated clients.|
|ClientCertificateCommonNames|	This is the common name of the first client certificate for CertificateCommonName. CertificateIssuerThumbprint is the thumbprint for the issuer of this certificate.|
|ReverseProxyCertificate|	This is an optional certificate that you can specify to secure your [reverse proxy](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy).|

For more information about securing certificates, see [Secure a standalone cluster on Windows by using X.509 certificates](https://docs.microsoft.com/azure/service-fabric/service-fabric-windows-cluster-x509-security).

## Understand role-based access control
You specify the administrator and user client roles at the time of cluster creation by providing separate identities (including certificates) for each. For more information about the default access control settings and how to change the default settings, see [Role-based access control for Service Fabric clients](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security-roles).

## Secure standalone clusters by using Windows security
To prevent unauthorized access to a Service Fabric cluster, you must secure the cluster. Security is especially important when the cluster runs production workloads. You configure node-to-node and client-to-node security by using Windows security in the ClusterConfig.JSON file.

When Service Fabric needs to run under a gMSA, you configure node-to-node security by setting [ClustergMSAIdentity](https://docs.microsoft.com/azure/service-fabric/service-fabric-windows-cluster-windows-security). To build trust relationships between nodes, you must make them aware of each other.

If you want to use a machine group within an Active Directory domain, you configure node-to-node security by setting ClusterIdentity. For more information, see [Create a machine group in Active Directory](https://msdn.microsoft.com/library/aa545347).

You configure client-to-node security by using ClientIdentities. You must configure the cluster to recognize which client identities it can trust. You can establish trust in two ways:

-	Specify the domain group users that can connect.
-	Specify the domain node users that can connect.

## Configure application security in Service Fabric
### Manage secrets in Service Fabric applications
Secrets can be any sensitive information, such as storage connection strings, passwords, or other values that should not be handled in plain text.

You can use [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis) to manage keys and secrets. However, the use of secrets in an application doesn't rely on a specific cloud platform. You can deploy applications to a cluster that's hosted anywhere. There are four main steps in this flow:

1.	Get a data encipherment certificate.
2.	Install the certificate on your cluster.
3.	Encrypt secret values when deploying an application with the certificate and inject them into a service's Settings.xml configuration file.
4.	Read encrypted values out of Settings.xml by decrypting them with the same encipherment certificate.

For more information, see [Manage secrets in Service Fabric applications](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-secret-management).

### Configure security policies for an application
By using Azure Service Fabric security, you can help secure applications that are running in the cluster under different user accounts. Service Fabric security also helps secure the resources that applications use at the time of deployment under the user accounts--for example, files, directories, and certificates. This makes running applications, even in a shared hosted environment, more secure.

Tasks for configuring security policies include:

-	Configuring the policy for a service setup entry point
-	Starting PowerShell commands from a setup entry point
-	Using console redirection for local debugging
-	Configuring a policy for service code packages
-	Assigning a security access policy for HTTP and HTTPS endpoints

## Secure communication for services
Security is one of the most important aspects of communication. The Reliable Services application framework provides a few prebuilt communication stacks and tools that you can use to improve security. For more information, see [Secure service remoting communications for a service](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-secure-communication).

## Next steps
- For conceptual information about cluster security, see [Create a Service Fabric cluster by using Azure Resource Manager](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm) and [Create a Service Fabric cluster by using the Azure portal](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-portal).
- To learn more about cluster security in Service Fabric, see [Service Fabric cluster security scenarios](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security).
