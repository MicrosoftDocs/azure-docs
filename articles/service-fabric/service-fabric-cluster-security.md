<properties
   pageTitle="Secure a Service Fabric cluster | Microsoft Azure"
   description="Describes the security scenarios for a Service Fabric cluster and the different technologies used to implement those scenarios."
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/10/2016"
   ms.author="chackdan"/>

# Service Fabric cluster security scenarios

A Service Fabric cluster is a resource that you own. To prevent unauthorized access to the resource, you must secure it, especially when it has production workloads running on it. This article provides an overview of the security scenarios for clusters running on Azure or standalone and the various technologies used to implement those scenarios.  The cluster security scenarios are:

- Node-to-node security
- Client-to-node security
- Role based access control (RBAC)

## Node-to-node security
Secures communication between the VMs or machines in the cluster. This ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster.

![Diagram of node-to-node communication][Node-to-Node]

Clusters running on Azure or standalone clusters running on Windows can use either [Certificate Security](https://msdn.microsoft.com/library/ff649801.aspx) or [Windows Security](https://msdn.microsoft.com/library/ff649396.aspx) for Windows Server machines.
### Node-to-node certificate security
Service Fabric uses X.509 server certificates that you specify as a part of the node-type configurations when you create a cluster. A quick overview of what these certificates are and how you can acquire or create them is provided at the end of this article.

Certificate security is configured while creating the cluster either through the Azure portal, Azure Resource Manager templates, or a standalone JSON template. You can specify a primary certificate and an optional secondary certificate that is used for certificate rollovers. The primary and secondary certificates you specify should be different than the admin client and read-only client certificates you specify for [Client-to-node security](#client-to-node-security).

For Azure read [Secure a Service Fabric cluster on Azure using certificates](service-fabric-secure-azure-cluster-with-certs.md) or [Set up a cluster by using an Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md) to learn how to configure certificate security in a cluster.

For standalone Windows Server read [Secure a standalone cluster on Windows using X.509 certificates ](service-fabric-windows-cluster-x509-security.md)

### Node-to-node windows security
For standalone Windows Server read [Secure a standalone cluster on Windows using Windows security](service-fabric-windows-cluster-windows-security.md)

## Client-to-node security
Authenticates clients and secures communication between a client and individual nodes in the cluster. This type of security authenticates and secures client communications, which ensures that only authorized users can access the cluster and the applications deployed on the cluster. Clients are uniquely identified through either their Windows Security credentials or their certificate security credentials.

![Diagram of client-to-node communication][Client-to-Node]

Clusters running on Azure or standalone clusters running on Windows can use either [Certificate Security](https://msdn.microsoft.com/library/ff649801.aspx) or [Windows Security](https://msdn.microsoft.com/library/ff649396.aspx).

### Client-to-node certificate security
 Client-to-node certificate security is configured while creating the cluster either through the Azure portal, Resource Manager templates or a standalone JSON template by specifying an admin client certificate and/or a user client certificate.  The admin client and user client certificates you specify should be different than the primary and secondary certificates you specify for [Node-to-node security](#node-to-node-security).

Clients connecting to the cluster using the admin certificate have full access to management capabilities.  Clients connecting to the cluster using the read-only user client certificate have only read access to management capabilities. In other words these certificates are used for the role bases access control (RBAC) described later in this article.

To learn how to configure certificate security in an Azure cluster read [Secure a Service Fabric cluster on Azure using certificates](service-fabric-secure-azure-cluster-with-certs.md) or [Set up a cluster by using an Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md).

For standalone Windows Server read [Secure a standalone cluster on Windows using X.509 certificates ](service-fabric-windows-cluster-x509-security.md)

### Client-to-node Azure Active Directory (AAD) security on Azure
Clusters running on Azure can also secure access to the management endpoints using Azure Active Directory (AAD). See [Create a Service Fabric cluster using Azure Active Directory for client authentication](service-fabric-cluster-security-client-auth-with-aad.md) for information on how to create the necessary AAD artifacts, how to populate them during cluster creation, and how to connect to those clusters afterwards.

## Security Recommendations
For Azure clusters, it is recommended that you use AAD security to authenticate clients and certificates for node-to-node security.

For standalone Windows Server clusters it is recommended that you use Windows security with group managed accounts (GMA) if you have Windows Server 2012 R2 and Active Directory. Otherwise still use Windows security with Windows accounts.

## Role based access control (RBAC)
Access control allows the cluster administrator to limit access to certain cluster operations for different groups of users, making the cluster more secure. Two different access control types are supported for clients connecting to a cluster: Administrator role and User role.

Administrators have full access to management capabilities (including read/write capabilities). Users, by default, have only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.

You specify the administrator and user client roles at the time of cluster creation by providing separate identities (certificates, AAD etc.) for each. For more information on the default access control settings and how to change the default settings, see [Role based access control for Service Fabric clients](service-fabric-cluster-security-roles.md).


## X.509 certificates and Service Fabric
X.509 digital certificates are commonly used to authenticate clients and servers and to encrypt and digitally sign messages. For more details on these certificates, go to [Working with certificates](http://msdn.microsoft.com/library/ms731899.aspx).

Some important things to consider:

- Certificates used in clusters running production workloads should be created by using a correctly configured Windows Server certificate service or obtained from an approved [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority).
- Never use any temporary or test certificates in production that are created with tools such as MakeCert.exe.
- You can use a self-signed certificate, but should only do so for test clusters and not in production.

### Server X.509 certificates

Server certificates have the primary task of authenticating a server (node) to clients, or authenticating a server (node) to a server (node). One of the initial checks when a client or node authenticates a node is to check the value of the common name in the Subject field. Either this common name or one of the certificates' subject alternative names must be present in the list of allowed common names.

The following article describes how to generate certificates with subject alternative names (SAN):
[How to add a subject alternative name to a secure LDAP certificate](http://support.microsoft.com/kb/931351).

The Subject field can contain several values, each prefixed with an initialization to indicate the value type. Most commonly, the initialization is "CN" for common name; for example, "CN = www.contoso.com". It is also possible for the Subject field to be blank. If the optional Subject Alternative Name field is populated, it must contain both the common name of the certificate and one entry per subject alternative name. These are entered as DNS Name values.

The value of the Intended Purposes field of the certificate should include an appropriate value, such as "Server Authentication" or "Client Authentication".

### Client X.509 certificates

Client certificates are not typically issued by a third-party certificate authority. Instead, the Personal store of the current user location typically contains client certificates placed there by a root authority, with an intended purpose of "Client Authentication". The client can use such a certificate when mutual authentication is required.

>[AZURE.NOTE] All management operations on a Service Fabric cluster require server certificates. Client certificates cannot be used for management.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->


## Next steps

Learn to set up a secure cluster:

- [Securing an azure cluster with certs](service-fabric-secure-azure-cluster-with-certs.md)

After your cluster is setup, learn about cluster upgrades:

- [Service Fabric cluster upgrade process and expectations](service-fabric-cluster-upgrade.md)
- [Rolling over or adding new Certificates](service-fabric-cluster-security-update-certs-azure.md)

Learn more about application security:

- [Application security and RunAs](service-fabric-application-runas-security.md)

- [Secure service communications](service-fabric-reliable-services-secure-communication.md)

<!--Image references-->
[Node-to-Node]: ./media/service-fabric-cluster-security/node-to-node.png
[Client-to-Node]: ./media/service-fabric-cluster-security/client-to-node.png
