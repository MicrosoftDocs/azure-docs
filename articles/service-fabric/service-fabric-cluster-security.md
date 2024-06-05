---
title: Secure an Azure Service Fabric cluster 
description: Learn about security scenarios for an Azure Service Fabric cluster, and the various technologies you can use to implement them.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Service Fabric cluster security scenarios

An Azure Service Fabric cluster is a resource that you own. It is your responsibility to secure your clusters to help prevent unauthorized users from connecting to them. A secure cluster is especially important when you are running production workloads on the cluster. It is possible to create an unsecured cluster, however if the cluster exposes management endpoints to the public internet, anonymous users can connect to it. Unsecured clusters are not supported for production workloads. 

This article is an overview of security scenarios for Azure clusters and standalone clusters, and the various technologies you can use to implement them:

* Node-to-node security
* Client-to-node security
* Service Fabric role-based access control

## Node-to-node security

Node-to-node security helps secure communication between the VMs or computers in a cluster. This security scenario ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster.

![Diagram of node-to-node communication][Node-to-Node]

Clusters running on Azure and standalone clusters running on Windows both can use either [certificate security](/previous-versions/msp-n-p/ff649801(v=pandp.10)) or [Windows security](/previous-versions/msp-n-p/ff649396(v=pandp.10)) for Windows Server computers.

### Node-to-node certificate security

Service Fabric uses X.509 server certificates that you specify as part of the node-type configuration when you create a cluster. You can set up certificate security either in the Azure portal, by using an Azure Resource Manager template, or by using a standalone JSON template. At the end of this article, you can see a brief overview of what these certificates are and how you can acquire or create them.

Service Fabric SDK's default behavior is to deploy and install the certificate with the furthest into the future expiring date. This primary certificate should be different from the admin client and read-only client certificates that you set for [client-to-node security](#client-to-node-security). The SDK's classic behavior allowed the defining of primary and secondary certificates to allow manually initiated rollovers; it is not recommended for use over the new functionality. 

To learn how to set up certificate security in a cluster for Azure, see [Set up a cluster by using an Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md).

To learn how to set up certificate security in a cluster for a standalone Windows Server cluster, see [Secure a standalone cluster on Windows by using X.509 certificates](service-fabric-windows-cluster-x509-security.md).

### Node-to-node Windows security

> [!NOTE]
> Windows authentication is based on Kerberos. NTLM is not supported as an authentication type.
>
> Whenever possible, use X.509 certificate authentication for Service Fabric clusters.

To learn how to set up Windows security for a standalone Windows Server cluster, see [Secure a standalone cluster on Windows by using Windows security](service-fabric-windows-cluster-windows-security.md).

## Client-to-node security

Client-to-node security authenticates clients and helps secure communication between a client and individual nodes in the cluster. This type of security helps ensure that only authorized users can access the cluster and the applications that are deployed on the cluster. Clients are uniquely identified through either their Windows security credentials or their certificate security credentials.

![Diagram of client-to-node communication][Client-to-Node]

Clusters running on Azure and standalone clusters running on Windows both can use either [certificate security](/previous-versions/msp-n-p/ff649801(v=pandp.10)) or [Windows security](/previous-versions/msp-n-p/ff649396(v=pandp.10)), though the recommendation is to use X.509 certificate authentication whenever possible.

### Client-to-node certificate security

Set up client-to-node certificate security when you create the cluster, either in the Azure portal, by using a Resource Manager template, or by using a standalone JSON template. To create the certificate, specify an admin client certificate or a user client certificate. As a best practice, the admin client and user client certificates you specify should be different from the primary and secondary certificates you specify for [node-to-node security](#node-to-node-security). Cluster certificates have the same rights as client admin certificates. However, they should be used only by cluster and not by administrative users as a security best practice.

Clients that connect to the cluster by using the admin certificate have full access to management capabilities. Clients that connect to the cluster by using the read-only user client certificate have only read access to management capabilities. These certificates are used for the Service Fabric RBAC that is described later in this article.

To learn how to set up certificate security in a cluster for Azure, see [Set up a cluster by using an Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md).

To learn how to set up certificate security in a cluster for a standalone Windows Server cluster, see [Secure a standalone cluster on Windows by using X.509 certificates](service-fabric-windows-cluster-x509-security.md).

<a name='client-to-node-azure-active-directory-security-on-azure'></a>

### Client-to-node Microsoft Entra security on Azure

Microsoft Entra ID enables organizations (known as tenants) to manage user access to applications. Applications are divided into those with a web-based sign-in UI and those with a native client experience. If you have not already created a tenant, start by reading [How to get a Microsoft Entra tenant][active-directory-howto-tenant].

For clusters running on Azure, you can also use Microsoft Entra ID to secure access to management endpoints. A Service Fabric cluster offers several entry points to its management functionality, including the web-based [Service Fabric Explorer][service-fabric-visualizing-your-cluster] and [Visual Studio][service-fabric-manage-application-in-visual-studio]. As a result, to control access to the cluster you create two Microsoft Entra applications: one web application and one native application. To learn how to create the required Microsoft Entra artifacts and how to populate them when you create the cluster, see [Set up Microsoft Entra ID to authenticate clients](service-fabric-cluster-creation-setup-aad.md).

## Security recommendations

For Service Fabric clusters deployed in a public network hosted on Azure, the recommendation for client-to-node mutual authentication is:

* Use Microsoft Entra ID for client identity
* A certificate for server identity and TLS encryption of http communication

For Service Fabric clusters deployed in a public network hosted on Azure, the recommendation for node-to-node security is to use a Cluster certificate to authenticate nodes.

For standalone Windows Server clusters, if you have Windows Server 2012 R2 and Windows Active Directory, we recommend that you use Windows security with group Managed Service Accounts. Otherwise, use Windows security with Windows accounts.

## Service Fabric role-based access control

You can use access control to limit access to certain cluster operations for different groups of users. This helps make the cluster more secure. Two access control types are supported for clients that connect to a cluster: Administrator role and User role.

Users who are assigned the Administrator role have full access to management capabilities, including read and write capabilities. Users who are assigned the User role, by default, have only read access to management capabilities (for example, query capabilities). They also can resolve applications and services.

Set the Administrator and User client roles when you create the cluster. Assign roles by providing separate identities (for example, by using certificates or Microsoft Entra ID) for each role type. For more information about default access control settings and how to change default settings, see [Service Fabric role-based access control for Service Fabric clients](service-fabric-cluster-security-roles.md).

## X.509 certificates and Service Fabric

X.509 digital certificates commonly are used to authenticate clients and servers. They also are used to encrypt and digitally sign messages. Service Fabric uses X.509 certificates to secure a cluster and provide application security features. For more information about X.509 digital certificates, see [Working with certificates](/dotnet/framework/wcf/feature-details/working-with-certificates). You use [Key Vault](../key-vault/general/overview.md) to manage certificates for Service Fabric clusters in Azure.

Some important things to consider:

* To create certificates for clusters that are running production workloads, use a correctly configured Windows Server certificate service, or one from an approved [certificate authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority).
* Never use any temporary or test certificates that you create by using tools like MakeCert.exe in a production environment.
* You can use a self-signed certificate, but only in a test cluster. Do not use a self-signed certificate in production.
* When generating the certificate thumbprint, be sure to generate an SHA1 thumbprint. SHA1 is what's used when configuring the Client and Cluster certificate thumbprints.

### Cluster and server certificate (required)

These certificates (one primary and optionally a secondary) are required to secure a cluster and prevent unauthorized access to it. These certificates provide cluster and server authentication.

Cluster authentication authenticates node-to-node communication for cluster federation. Only nodes that can prove their identity with this certificate can join the cluster. Server authentication authenticates the cluster management endpoints to a management client, so that the management client knows it is talking to the real cluster and not a 'man in the middle'. This certificate also provides a TLS for the HTTPS management API and for Service Fabric Explorer over HTTPS. When a client or node authenticates a node, one of the initial checks is the value of the common name in the **Subject** field. Either this common name or one of the certificates' Subject Alternative Names (SANs) must be present in the list of allowed common names.

The certificate must meet the following requirements:

* The certificate must contain a private key. These certificates typically have extensions .pfx or .pem  
* The certificate must be created for key exchange, which is exportable to a Personal Information Exchange (.pfx) file.
* The **certificate's subject name must match the domain that you use to access the Service Fabric cluster**. This matching is required to provide a TLS for the cluster's HTTPS management endpoint and Service Fabric Explorer. You cannot obtain a TLS/SSL certificate from a certificate authority (CA) for the *.cloudapp.azure.com domain. You must obtain a custom domain name for your cluster. When you request a certificate from a CA, the certificate's subject name must match the custom domain name that you use for your cluster.

Some other things to consider:

* The **Subject** field can have multiple values. Each value is prefixed with an initialization to indicate the value type. Usually, the initialization is **CN** (for *common name*); for example, **CN = www\.contoso.com**.
* The **Subject** field can be blank.
* If the optional **Subject Alternative Name** field is populated, it must have both the common name of the certificate and one entry per SAN. These are entered as **DNS Name** values. To learn how to generate certificates that have SANs, see [How to add a Subject Alternative Name to a secure LDAP certificate](https://support.microsoft.com/kb/931351).
* The value of the **Intended Purposes** field of the certificate should include an appropriate value, such as **Server Authentication** or **Client Authentication**.

### Application certificates (optional)

Any number of additional certificates can be installed on a cluster for application security purposes. Before creating your cluster, consider the application security scenarios that require a certificate to be installed on the nodes, such as:

* Encryption and decryption of application configuration values.
* Encryption of data across nodes during replication.

The concept of creating secure clusters is the same, whether they are Linux or Windows clusters.

### Client authentication certificates (optional)

Any number of additional certificates can be specified for admin or user client operations. The client can use these certificates when mutual authentication is required. Client certificates typically are not issued by a third-party CA. Instead, the Personal store of the current user location typically contains client certificates placed there by a root authority. The certificate should have an **Intended Purposes** value of **Client Authentication**.  

By default the cluster certificate has admin client privileges. These additional client certificates should not be installed into the cluster, but are specified as being allowed in the cluster configuration.  However, the client certificates need to be installed on the client machines to connect to the cluster and perform any operations.

> [!NOTE]
> All management operations on a Service Fabric cluster require server certificates. Client certificates cannot be used for management.

## Next steps

* [Create a cluster in Azure by using a Resource Manager template](service-fabric-cluster-creation-via-arm.md)
* [Create a cluster by using the Azure portal](service-fabric-cluster-creation-via-portal.md)

<!--Image references-->
[Node-to-Node]: ./media/service-fabric-cluster-security/node-to-node.png
[Client-to-Node]: ./media/service-fabric-cluster-security/client-to-node.png

[active-directory-howto-tenant]:../active-directory/develop/quickstart-create-new-tenant.md
[service-fabric-visualizing-your-cluster]: service-fabric-visualizing-your-cluster.md
[service-fabric-manage-application-in-visual-studio]: service-fabric-manage-application-in-visual-studio.md
