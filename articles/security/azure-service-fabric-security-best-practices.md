---

title: Azure Service Fabric security best practices| Microsoft Docs
description: This article provides a set of best practices for Azure Service Fabric security.
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
# Azure Service Fabric security best practices
Deploying an application on Azure is fast, easy, and cost-effective. Before deploying cloud application in production useful to have a best practice to assist in evaluating your application against a list of essential and recommended best practices.

Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices. Service Fabric also addresses the significant challenges in developing and managing cloud applications. Developers and administrators can avoid complex infrastructure problems and focus on implementing mission-critical, demanding workloads that are scalable, reliable, and manageable. 

For each best practice, we explain:

-	What the best practice is
-	Why you want to enable that best practice
-	What might be the result if you fail to enable the best practice
-	How you can learn to enable the best practice

We currently have the following Azure Service Fabric security best practices:

-	Use Azure Resource Manager(ARM) template and Service Fabric Azure PowerShell Module to create secure cluster
-	Use X.509 certificates
-	Configure security policies
-	Reliable Actors security configuration
-	Configure SSL for Azure Service Fabric
-	Network Isolation/Security with Azure Service Fabric
-	Set up a key vault for security
-	Assign users to roles


## Best practices for securing your cluster

**Big Picture**

Always use a secure cluster
-	Cluster security – use Certificates
-	Client access (Admin and Read only) – use AAD

Use automated deployments
-	Use scripts to generate, deploy and, roll over secrets
-	Keep the secrets in KV, use AD for all other client access
-	No human should have access to them without authentication.

Additionally, consider the following:
-	Create DMZs using Network Security Groups (NSGs)
-	Use Jump servers to RDP into cluster VMs or to manage your cluster

Clusters must be secured to prevent unauthorized users from connecting to your cluster, especially when it has production workloads running on it. Although it is possible to create an unsecured cluster, doing so allows anonymous users to connect to it, if it exposes management endpoints to the public Internet.

Technologies used to implement those scenarios. The [cluster security scenarios](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security) are:

-	Node-to-node security- This secures communication between the VMs and computers in the cluster. This ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster.
Clusters running on Azure or standalone clusters running on Windows can use either [Certificate Security](https://docs.microsoft.com/azure/service-fabric/service-fabric-windows-cluster-x509-security) or [Windows Security](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-windows-cluster-windows-security) for Windows Server machines.
-	Client-to-node security- This secures communication between a Service Fabric client and individual nodes in the cluster.
-	Role-based access control (RBAC) - You specify the administrator and user client roles at the time of cluster creation by providing separate identities (certificates, AAD etc.) for each.
-	Security Recommendations-For Azure clusters, it is recommended that you use AAD security to authenticate clients and certificates for node-to-node security.

To configure the standalone Windows cluster, see [configure settings for standalone windows cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-manifest).

Use Azure Resource Manager templates and Service Fabric Azure PowerShell Module to create secure cluster.
A step-by-step guide walks you through setting up a secure Azure Service Fabric cluster in Azure by using Azure Resource Manager is available [here](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm).

Use the Azure Resource Manager template to customize your cluster
-	Setup-managed storage for VM VHDs

Use the Azure Resource Manager template to drive changes to your Resource Group
-	Easy configuration management
-	Auditing

Treat your cluster configuration as Code
-	Be thorough in checking the configurations you choose to deploy
-	Avoid using implicit commands to tweak your resources directly

Many aspects of the [Service Fabric application lifecycle](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-lifecycle) can be automated. [Service Fabric Azure PowerShell Module](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications#upload-the-application-package) automates common tasks for deploying, upgrading, removing, and testing Azure Service Fabric applications. Managed and HTTP APIs for app management are also available.

## Use X.509 certificates
Clusters should always be secured using X.509 certificates or Windows security. Security is only configured at cluster creation time and it is not possible to enable security after the cluster is created.

If you are specifying a [cluster certificate](https://docs.microsoft.com/azure/service-fabric/service-fabric-windows-cluster-x509-security), set the value of ClusterCredentialType to X509. If you are specifying server certificate for outside connections, set the ServerCredentialType to X509.

-	Certificates used in clusters running production workloads should be created by using a correctly configured Windows Server certificate service or obtained from an approved Certificate Authority (CA).
-	Never use any temporary or test certificates in production that are created with tools such as MakeCert.exe.
-	You can use a self-signed certificate, but should only do so for test clusters and not in production.

If the cluster is unsecure. Anyone can connect anonymously and perform management operations, so production clusters should always be secured using X.509 certificates or Windows security.

To learn more how to enable certificates in service fabric cluster see, [add or remove certificates for a service fabric cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security-update-certs-azure).

## Configure security policies
Service Fabric also helps secure the resources that are used by applications at the time of deployment under the user accounts--for example, files, directories, and certificates. This makes running applications, even in a shared hosted environment, more secure from one another.

-	Use an Active Directory domain group or user:
You can run the service under the credentials for an Active Directory user or group account. This is Active Directory on-premises within your domain and is not with Azure Active Directory (Azure AD). By using a domain user or group, you can then access other resources in the domain (for example, file shares) that have been granted permissions.

-	Assign a security access policy for HTTP and HTTPS endpoints:
If you apply a RunAs policy to a service and the service manifest declares endpoint resources with the HTTP protocol, you must specify a SecurityAccessPolicy to ensure that ports allocated to these endpoints are correctly access-controlled listed for the RunAs user account that the service runs under. Otherwise, http.sys does not have access to the service, and you get failures with calls from the client.
To learn more enable security policies in service fabric see, [configure security policies for your application](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-runas-security).

## Reliable Actors security configuration
Service Fabric Reliable Actors is an implementation of the actor design pattern. As with any software design pattern, the decision whether to use a specific pattern is made based on whether or not a software design problem fits the pattern.

As general guidance, consider the actor pattern to model your problem or scenario if:
-	Your problem space involves a large number (thousands or more) of small, independent, and isolated units of state and logic.
-	You want to work with single-threaded objects that do not require significant interaction from external components, including querying state across a set of actors.
-	Your actor instances won't block callers with unpredictable delays by issuing I/O operations.

In Service Fabric, actors are implemented in the Reliable Actors framework: An actor-pattern-based application framework built on top of [Service Fabric Reliable Services](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-introduction). Each Reliable Actor service you write is actually a partitioned, stateful Reliable Service.
Every actor is defined as an instance of an actor type, identical to the way a .NET object is an instance of a .NET type. For example, there may be an actor type that implements the functionality of a calculator and there could be many actors of that type that are distributed on various nodes across a cluster. Each such actor is uniquely identified by an actor ID.

[Replicator security configurations](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-kvsactorstateprovider-configuration) are used to secure the communication channel that is used during replication. This means that services cannot see each other's replication traffic, ensuring that the data that is made highly available is also secure. By default, an empty security configuration section prevents replication security.
Replicator configurations configure the replicator that is responsible for making the Actor State Provider state highly reliable.

## Configure SSL for Azure Service Fabric

Server authentication: [Authenticates](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm) the cluster management endpoints to a management client, so that the management client knows it is talking to the real cluster. This certificate also provides an [SSL](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-creation-via-arm) for the HTTPS management API and for Service Fabric Explorer over HTTPS.
You must obtain a custom domain name for your cluster. When you request a certificate from a CA, the certificate's subject name must match the custom domain name that you use for your cluster.

To configure SSL for an application, you first need to get an SSL certificate that has been signed by a Certificate Authority (CA), a trusted third party who issues certificates for this purpose. If you do not already have one, you need to obtain one from a company that sells SSL certificates.

The certificate must meet the following requirements for SSL certificates in Azure:
-	The certificate must contain a private key.
-	The certificate must be created for key exchange, exportable to a Personal Information Exchange (.pfx) file.
-	The certificate's subject name must match the domain used to access the cloud service. You cannot obtain an SSL certificate from a certificate authority (CA) for the cloudapp.net domain. You must acquire a custom domain name to use when access your service. When you request a certificate from a CA, the certificate's subject name must match the custom domain name used to access your application. For example, if your custom domain name is contoso.com you would request a certificate from your CA for **.contoso.com** or **www.contoso.com.**
-	The certificate must use a minimum of 2048-bit encryption.

HTTP is insecure and is subject to eavesdropping attacks because the data being transferred from the web browser to the web server or between other endpoints, is transmitted in plaintext. This means attackers can intercept and view sensitive data, such as credit card details and account logins. When data is sent or posted through a browser using HTTPS, SSL ensures that such information is encrypted and secure from interception.

To learn more, see, [Configure SSL for azure application](https://docs.microsoft.com/azure/cloud-services/cloud-services-configure-ssl-certificate).

## Network Isolation/Security with Azure Service Fabric
Use [Azure Resource Manager (ARM) template](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates) as a sample for setting up a three nodetype secure cluster and to control the inbound and outbound network traffic using Network Security Groups.

The template has a Network Security Group for each of the virtual machine scale set(VMSS) to control the traffic in and out of the VMSS. As a default, the rules are set up to allow all the traffic needed by the system services and the application ports specified in the template. Review those rules and make changes to fit your needs, including add any new ones for your applications.

For more information, see [Azure Service Fabric – Common Networking Scenarios](https://docs.microsoft.com/azure/service-fabric/service-fabric-patterns-networking).

## Set up a key vault for security
Certificates are used in Service Fabric to provide authentication and encryption to secure various aspects of a cluster and its applications.

Service Fabric uses X.509 certificates to secure a cluster and provide application security features. You use Key Vault to [manage certificates](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security-update-certs-azure) for Service Fabric clusters in Azure. When a cluster is deployed in Azure, the Azure resource provider that's responsible for creating Service Fabric clusters pulls certificates from Key Vault and installs them on the cluster VMs.

The relationship between [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-secure-your-key-vault), a service fabric cluster, and the Azure resource provider that uses certificates stored in a key vault when it creates a cluster.

**Create a resource group**
The first step is to create a resource group specifically for your key vault. We recommend that you put the key vault into its own resource group. This action lets you remove the compute and storage resource groups, including the resource group that contains your Service Fabric cluster, without losing your keys and secrets. The resource group that contains your key vault must be in the same region as the cluster that is using it.

**Create a key vault in the new resource group**
The key vault must be enabled for deployment to allow the compute resource provider to get certificates from it and install it on virtual machine instances.
To learn more how to set up Azure key vault see, [Get started with Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-get-started).

## Assign users roles
After you have created the applications to represent your cluster, assign your users to the roles supported by Service Fabric: read-only and admin. You can assign the roles by using the Azure classic portal.

>[!Note]
> For more information about roles in Service Fabric, see [Role-based access control for Service Fabric clients](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security-roles).

Azure Service Fabric supports two different access control types for clients that are connected to a [Service Fabric cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm): administrator and user. Access control allows the cluster administrator to limit access to certain cluster operations for different groups of users, making the cluster more secure.

## Next steps
- Setting up your Service Fabric [development environment](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started).
- Learn about [Service Fabric support options](https://docs.microsoft.com/azure/service-fabric/service-fabric-support).

