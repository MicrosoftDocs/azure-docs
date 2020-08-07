---
title: Best practices for Azure Service Fabric security
description: This article provides a set of best practices for Azure Service Fabric security.
author: unifycloud
ms.author: tomsh
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 01/16/2019
---
# Azure Service Fabric security best practices
Deploying an application on Azure is fast, easy, and cost-effective. Before you deploy your cloud application into production, review our list of essential and recommended best practices for implementing secure clusters in your application.

Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices. Service Fabric also addresses the significant challenges in developing and managing cloud applications. Developers and administrators can avoid complex infrastructure problems and focus on implementing mission-critical, demanding workloads that are scalable, reliable, and manageable.

For each best practice, we explain:

-	What the best practice is.
-	Why you should implement the best practice.
-	What might happen if you don't implement the best practice.
-	How you can learn to implement the best practice.

We recommend the following Azure Service Fabric security best practices:

-	Use Azure Resource Manager templates and the Service Fabric PowerShell module to create secure clusters.
-	Use X.509 certificates.
-	Configure security policies.
-	Implement the Reliable Actors security configuration.
-	Configure TLS for Azure Service Fabric.
-	Use network isolation and security with Azure Service Fabric.
-	Configure Azure Key Vault for security.
-	Assign users to roles.


## Best practices for securing your clusters

Always use a secure cluster:
-	Implement cluster security by using certificates.
-	Provide client access (admin and read-only) by using Azure Active Directory (Azure AD).

Use automated deployments:
-	Use scripts to generate, deploy, and roll over the secrets.
-	Store the secrets in Azure Key Vault and use Azure AD for all other client access.
-	Require authentication for human access to the secrets.

Additionally, consider the following configuration options:
-	Create perimeter networks (also known as demilitarized zones, DMZs, and screened subnets) by using Azure Network Security Groups (NSGs).
-   Access cluster virtual machines (VMs) or manage your cluster by using jump servers with Remote Desktop Connection.

Your clusters must be secured to prevent unauthorized users from connecting, especially when a cluster is running in production. Although it's possible to create an unsecured cluster, anonymous users can connect to your cluster if the cluster exposes management endpoints to the public internet.

There are three [scenarios](../../service-fabric/service-fabric-cluster-security.md) for implementing cluster security by using various technologies:

-	Node-to-node security: This scenario secures communication between the VMs and the computers in the cluster. This form of security ensures that only those computers that are authorized to join the cluster can host applications and services in the cluster.
In this scenario, the clusters that run on Azure, or standalone clusters that run on Windows, can use either [certificate security](../../service-fabric/service-fabric-windows-cluster-x509-security.md) or [Windows security](../../service-fabric/service-fabric-windows-cluster-windows-security.md) for Windows Server machines.
-	Client-to-node security: This scenario secures communication between a Service Fabric client and the individual nodes in the cluster.
-	Role-Based Access Control (RBAC): This scenario uses separate identities (certificates, Azure AD, and so on) for each administrator and user client role that accesses the cluster. You specify the role identities when you create the cluster.

>[!NOTE]
>**Security recommendation for Azure clusters:** Use Azure AD security to authenticate clients and certificates for node-to-node security.

To configure a standalone Windows cluster, see [Configure settings for a standalone Windows cluster](../../service-fabric/service-fabric-cluster-manifest.md).

Use Azure Resource Manager templates and the Service Fabric PowerShell module to create a secure cluster.
For step-by-step instructions to create a secure Service Fabric cluster by using Azure Resource Manager templates, see [Creating a Service Fabric cluster](../../service-fabric/service-fabric-cluster-creation-via-arm.md).

Use the Azure Resource Manager template:
-	Customize your cluster by using the template to configure managed storage for VM virtual hard disks (VHDs).
-   Drive changes to your resource group by using the template for easy configuration management and auditing.

Treat your cluster configuration as code:
-	Be thorough when checking your deployment configurations.
-	Avoid using implicit commands to directly modify your resources.

Many aspects of the [Service Fabric application lifecycle](../../service-fabric/service-fabric-application-lifecycle.md) can be automated. The [Service Fabric PowerShell module](../../service-fabric/service-fabric-deploy-remove-applications.md#upload-the-application-package) automates common tasks for deploying, upgrading, removing, and testing Azure Service Fabric applications. Managed APIs and HTTP APIs for application management are also available.

## Use X.509 certificates
Always secure your clusters by using X.509 certificates or Windows security. Security is only configured at cluster creation time. It's not possible to turn on security after the cluster is created.

To specify a [cluster certificate](../../service-fabric/service-fabric-windows-cluster-x509-security.md), set the value of the **ClusterCredentialType** property to X509. To specify a server certificate for outside connections, set the **ServerCredentialType** property to X509.

In addition, follow these practices:
-	Create the certificates for production clusters by using a correctly configured Windows Server certificate service. You can also obtain the certificates from an approved certificate authority (CA).
-	Never use a temporary or test certificate for production clusters if the certificate was created by using MakeCert.exe or a similar tool.
-	Use a self-signed certificate for test clusters, but not for production clusters.

If the cluster is unsecure, anyone can connect to the cluster anonymously and perform management operations. For this reason, always secure production clusters by using X.509 certificates or Windows security.

To learn more about using X.509 certificates, see [Add or remove certificates for a Service Fabric cluster](../../service-fabric/service-fabric-cluster-security-update-certs-azure.md).

## Configure security policies
Service Fabric also secures the resources that are used by applications. Resources like files, directories, and certificates are stored under the user accounts when the application is deployed. This feature makes running applications more secure from one another, even in a shared hosted environment.

-	Use an Active Directory domain group or user:
Run the service under the credentials for an Active Directory user or group account. Be sure to use Active Directory on-premises within your domain and not Azure Active Directory. Access other resources in the domain that have been granted permissions by using a domain user or group. For example, resources such as file shares.

-	Assign a security access policy for HTTP and HTTPS endpoints:
Specify the **SecurityAccessPolicy** property to apply a **RunAs** policy to a service when the service manifest declares endpoint resources with HTTP. Ports allocated to the HTTP endpoints are correctly access-controlled lists for the RunAs user account that the service runs under. When the policy isn't set, http.sys doesn't have access to the service and you can get failures with calls from the client.

To learn how to use security policies in a Service Fabric cluster, see [Configure security policies for your application](../../service-fabric/service-fabric-application-runas-security.md).

## Implement the Reliable Actors security configuration
Service Fabric Reliable Actors is an implementation of the actor design pattern. As with any software design pattern, the decision to use a specific pattern is based on whether a software problem fits the pattern.

In general, use the actor design pattern to help model solutions for the following software problems or security scenarios:
-	Your problem space involves a large number (thousands or more) of small, independent, and isolated units of state and logic.
-	You're working with single-threaded objects that don't require significant interaction from external components, including querying state across a set of actors.
-	Your actor instances don't block callers with unpredictable delays by issuing I/O operations.

In Service Fabric, actors are implemented in the Reliable Actors application framework. This framework is based on the actor pattern and built on top of [Service Fabric Reliable Services](../../service-fabric/service-fabric-reliable-services-introduction.md). Each reliable actor service that you write is a partitioned stateful reliable service.

Every actor is defined as an instance of an actor type, identical to the way a .NET object is an instance of a .NET type. For example, an **actor type** that implements the functionality of a calculator can have many actors of that type that are distributed on various nodes across a cluster. Each of the distributed actors is uniquely characterized by an actor identifier.

[Replicator security configurations](../../service-fabric/service-fabric-reliable-actors-kvsactorstateprovider-configuration.md) are used to secure the communication channel that is used during replication. This configuration prevents services from seeing each other's replication traffic and ensures that highly available data is secure. By default, an empty security configuration section prevents replication security.
Replicator configurations configure the replicator that is responsible for making the Actor State Provider state highly reliable.

## Configure TLS for Azure Service Fabric
The server authentication process [authenticates](../../service-fabric/service-fabric-cluster-creation-via-arm.md) the cluster management endpoints to a management client. The management client then recognizes that it's talking to the real cluster. This certificate also provides a [TLS](../../service-fabric/service-fabric-cluster-creation-via-arm.md) for the HTTPS management API and for Service Fabric Explorer over HTTPS.
You must obtain a custom domain name for your cluster. When you request a certificate from a certificate authority, the certificate's subject name must match the custom domain name that you use for your cluster.

To configure TLS for an application, you first need to obtain an SSL/TLS certificate that has been signed by a CA. The CA is a trusted third party that issues certificates for TLS security purposes. If you don't already have an SSL/TLS certificate, you need to obtain one from a company that sells SSL/TLS certificates.

The certificate must meet the following requirements for SSL/TLS certificates in Azure:
-	The certificate must contain a private key.

-	The certificate must be created for key exchange and be exportable to a personal information exchange (.pfx) file.

-	The certificate's subject name must match the domain name that is used to access your cloud service.

    - Acquire a custom domain name to use for accessing your cloud service.
    - Request a certificate from a CA with a subject name that matches your service's custom domain name. For example, if your custom domain name is __contoso__**.com**, the certificate from your CA should have the subject name **.contoso.com** or __www__**.contoso.com**.

    >[!NOTE]
    >You cannot obtain an SSL/TLS certificate from a CA for the __cloudapp__**.net** domain.

-	The certificate must use a minimum of 2,048-bit encryption.

The HTTP protocol is unsecure and subject to eavesdropping attacks. Data that is transmitted over HTTP is sent as plain text from the web browser to the web server or between other endpoints. Attackers can intercept and view sensitive data that is sent via HTTP, such as credit card details and account logins. When data is sent or posted through a browser via HTTPS, SSL ensures that sensitive information is encrypted and secure from interception.

To learn more about using SSL/TLS certificates, see [Configuring TLS for an application in Azure](../../cloud-services/cloud-services-configure-ssl-certificate-portal.md).

## Use network isolation and security with Azure Service Fabric
Set up a 3 nodetype secure cluster by using the [Azure Resource Manager template](../../azure-resource-manager/templates/template-syntax.md) as a sample. Control the inbound and outbound network traffic by using the template and Network Security Groups.

The template has an NSG for each of the virtual machine scale sets and is used to control the traffic in and out of the set. The rules are configured by default to allow all traffic necessary for the system services and the application ports specified in the template. Review these rules and make any changes to fit your needs, including adding new rules for your applications.

For more information, see [Common networking scenarios for Azure Service Fabric](../../service-fabric/service-fabric-patterns-networking.md).

## Set up Azure Key Vault for security
Service Fabric uses certificates to provide authentication and encryption for securing a cluster and its applications.

Service Fabric uses X.509 certificates to secure a cluster and to provide application security features. You use Azure Key Vault to [manage certificates](../../service-fabric/service-fabric-cluster-security-update-certs-azure.md) for Service Fabric clusters in Azure. The Azure resource provider that creates the clusters pulls the certificates from a key vault. The provider then installs the certificates on the VMs when the cluster is deployed on Azure.

A certificate relationship exists between [Azure Key Vault](../../key-vault/general/secure-your-key-vault.md), the Service Fabric cluster, and the resource provider that uses the certificates. When the cluster is created, information about the certificate relationship is stored in a key vault.

There are two basic steps to set up a key vault:
1. Create a resource group specifically for your key vault.

    We recommend that you put the key vault in its own resource group. This action helps to prevent the loss of your keys and secrets if other resource groups are removed, such as storage, compute, or the group that contains your cluster. The resource group that contains your key vault must be in the same region as the cluster that is using it.

2. Create a key vault in the new resource group.

    The key vault must be enabled for deployment. The compute resource provider can then get the certificates from the vault and install them on the VM instances.

To learn more about how to set up a key vault, see [What is Azure Key Vault?](../../key-vault/general/overview.md).

## Assign users to roles
After you've created the applications to represent your cluster, assign your users to the roles that are supported by Service Fabric: read-only and admin. You can assign these roles by using the Azure portal.

>[!NOTE]
> For more information about using roles in Service Fabric, see [Role-Based Access Control for Service Fabric clients](../../service-fabric/service-fabric-cluster-security-roles.md).

Azure Service Fabric supports two access control types for clients that are connected to a [Service Fabric cluster](../../service-fabric/service-fabric-cluster-creation-via-arm.md): administrator and user. The cluster administrator can use access control to limit access to certain cluster operations for different groups of users. Access control makes the cluster more secure.

## Next steps

- [Service Fabric security checklist](service-fabric-checklist.md)
- Set up your Service Fabric [development environment](../../service-fabric/service-fabric-get-started.md).
- Learn about [Service Fabric support options](../../service-fabric/service-fabric-support.md).
