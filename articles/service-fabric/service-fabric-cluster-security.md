<properties
   pageTitle="Secure a Service Fabric cluster | Microsoft Azure"
   description="How to secure a Service Fabric cluster. What are the options?"
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
   ms.date="05/27/2016"
   ms.author="chackdan"/>

# Service Fabric Cluster security scenarios

An Service Fabric cluster is a resource that you own. To prevent unauthorized access to the resource, you must secure it, especially when it has production workloads running on it. Service Fabric provides cluster security for the following scenarios:

- **Node-to-node security:** This secures communication between the VMs and computers in the cluster. This ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster.

	![Diagram of node-to-node communication][Node-to-Node]

- **Client-to-node security:** This secures communication between a Service Fabric client and individual nodes in the cluster. This type of security authenticates and secures client communications, which ensures that only authorized users can access the cluster and the applications deployed on the cluster. Clients are uniquely identified through either their Windows Security credentials or their certificate security credentials.

	![Diagram of client-to-node communication][Client-to-Node]

	For either node-to-node or client-to-node security, you can use either [Certificate Security](https://msdn.microsoft.com/library/ff649801.aspx) or [Windows Security](https://msdn.microsoft.com/library/ff649396.aspx). The choices for node-to-node or client-to-node security are independent from each other, and can be the same or different.

	Azure Service Fabric uses X.509 server certificates that you specify as a part of the node-type configurations when you create a cluster. A quick overview of what these certificates are and how you can acquire or create them is provided at the end of this article.

- **Role Based Access Control (RBAC):** This restricts admin operations on the cluster to a particular set of certificates.


## X.509 certificates and Service Fabric

X.509 digital certificates are commonly used to authenticate clients and servers and to encrypt and digitally sign messages. For more details on these certificates, go to [Working with certificates](http://msdn.microsoft.com/library/ms731899.aspx) in the MSDN library.

>[AZURE.NOTE]
- Certificates used in clusters that are running production workloads should be either created by using a correctly configured Windows Server certificate service or obtained from an approved [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority).
- Never use in production any temporary or test certificates that are created with tools such as MakeCert.exe.
- For clusters that you use for test purposes only, you can choose to use a self-signed certificate.

### Server X.509 certificates

Server certificates have the primary task of authenticating a server (node) to clients, or authenticating a server (node) to a server (node). One of the initial checks when a client or node authenticates a node is to check the value of the common name in the Subject field. Either this common name or one of the certificates' subject alternative names must be present in the list of allowed common names.

The following article describe how to generate certificates with subject alternative names (SAN):
[How to add a subject alternative name to a secure LDAP certificate](http://support.microsoft.com/kb/931351).

>[AZURE.NOTE] The Subject field can contain several values, each prefixed with an initialization to indicate the value type. Most commonly, the initialization is "CN" for common name; for example, "CN = www.contoso.com". It is also possible for the Subject field to be blank. If the optional Subject Alternative Name field is populated, it must contain both the common name of the certificate and one entry per subject alternative name. These are entered as DNS Name values.

The value of the Intended Purposes field of the certificate should include an appropriate value, such as "Server Authentication" or "Client Authentication".

### Client X.509 certificates

Client certificates are not typically issued by a third-party certificate authority. Instead, the Personal store of the current user location typically contains client certificates placed there by a root authority, with an intended purpose of "Client Authentication". The client can use such a certificate when mutual authentication is required.

>[AZURE.NOTE] All management operations on a Service Fabric cluster require server certificates. Client certificates cannot be used for management.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->


## Next steps

- [Service Fabric Cluster upgrade process and expectations from you](service-fabric-cluster-upgrade.md)
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric Health model introduction](service-fabric-health-introduction.md)
- [Application Security and RunAs](service-fabric-application-runas-security.md)

<!--Image references-->
[Node-to-Node]: ./media/service-fabric-cluster-security/node-to-node.png
[Client-to-Node]: ./media/service-fabric-cluster-security/client-to-node.png
