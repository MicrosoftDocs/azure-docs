---
title: Secure an Azure Service Fabric cluster | Microsoft Docs
description: Learn about security scenarios for an Azure Service Fabric cluster, and the various technologies you can use to implement them.
services: service-fabric
documentationcenter: .net
author: ChackDan
manager: timlt
editor: ''

ms.assetid: 26b58724-6a43-4f20-b965-2da3f086cf8a
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/28/2017
ms.author: chackdan

---
# Service Fabric cluster security scenarios
An Azure Service Fabric cluster is a resource that you own. You must secure your clusters to help prevent unauthorized users from connecting to them. A secure cluster is especially important when you are running production workloads on the cluster. Although it's possible to create an unsecured cluster, if the cluster exposes management endpoints to the public internet, anonymous users can connect to it. 

This article is an overview of security scenarios for Azure clusters and standalone clusters, and the various technologies you can use to implement them:

* Node-to-node security
* Client-to-node security
* Role-Based Access Control (RBAC)

## Node-to-node security
Node-to-node security helps secure communication between the VMs or computers in a cluster. This security scenario ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster.

![Diagram of node-to-node communication][Node-to-Node]

Clusters running on Azure and standalone clusters running on Windows both can use either [certificate security](https://msdn.microsoft.com/library/ff649801.aspx) or [Windows security](https://msdn.microsoft.com/library/ff649396.aspx) for Windows Server computers.

### Node-to-node certificate security
Service Fabric uses X.509 server certificates that you specify as part of the node-type configuration when you create a cluster. At the end of this article, you can see a brief overview of what these certificates are and how you can acquire or create them.

Set up certificate security when you create the cluster, either in the Azure portal, by using an Azure Resource Manager template, or by using a standalone JSON template. You can set a primary certificate and an optional secondary certificate, which is used for certificate rollovers. The primary and secondary certificates you set should be different from the admin client and read-only client certificates that you set for [client-to-node security](#client-to-node-security).

To learn how to set up certificate security in a cluster for Azure, see [Set up a cluster by using an Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md).

To learn how to set up certificate security in a cluster for a standalone Windows Server cluster, see [Secure a standalone cluster on Windows by using X.509 certificates](service-fabric-windows-cluster-x509-security.md).

### Node-to-node Windows security
To learn how to set up Windows security for a standalone Windows Server cluster, see [Secure a standalone cluster on Windows by using Windows security](service-fabric-windows-cluster-windows-security.md).

## Client-to-node security
Client-to-node security authenticates clients and helps secure communication between a client and individual nodes in the cluster. This type of security helps ensure that only authorized users can access the cluster and the applications that are deployed on the cluster. Clients are uniquely identified through either their Windows security credentials or their certificate security credentials.

![Diagram of client-to-node communication][Client-to-Node]

Clusters running on Azure and standalone clusters running on Windows both can use either [certificate security](https://msdn.microsoft.com/library/ff649801.aspx) or [Windows security](https://msdn.microsoft.com/library/ff649396.aspx).

### Client-to-node certificate security
Set up client-to-node certificate security when you create the cluster, either in the Azure portal, by using a Resource Manager template, or by using a standalone JSON template. To create the certificate, specify an admin client certificate or a user client certificate. As a best practice, the admin client and user client certificates you specify should be different from the primary and secondary certificates you specify for [node-to-node security](#node-to-node-security). By default, the cluster certificates for node-to-node security are added to the allowed client admin certificates list.

Clients that connect to the cluster by using the admin certificate have full access to management capabilities. Clients that connect to the cluster by using the read-only user client certificate have only read access to management capabilities. These certificates are used for the RBAC that we described later in this article.

To learn how to set up certificate security in a cluster for Azure, see [Set up a cluster by using an Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md).

To learn how to set up certificate security in a cluster for a standalone Windows Server cluster, see [Secure a standalone cluster on Windows by using X.509 certificates](service-fabric-windows-cluster-x509-security.md).

### Client-to-node Azure Active Directory security on Azure
For clusters running on Azure, you also can secure access to management endpoints by using Azure Active Directory (Azure AD). To learn how to create the required Azure AD artifacts, how to populate them when you create the cluster, and how to connect to the clusters afterward, see [Set up a cluster by using an Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md).

## Security recommendations
For Azure clusters, for node-to-node security, we recommend that you use Azure AD security to authenticate clients and certificates.

For standalone Windows Server clusters, if you have Windows Server 2012 R2 and Windows Active Directory, we recommend that you use Windows security with group Managed Service Accounts. Otherwise, use Windows security with Windows accounts.

## Role-Based Access Control (RBAC)
You can use access control to limit access to certain cluster operations for different groups of users. This helps make the cluster more secure. Two access control types are supported for clients that connect to a cluster: Administrator role and User role.

Users who are assigned the Administrator role have full access to management capabilities, including read and write capabilities. Users who are assigned the User role, by default, have only read access to management capabilities (for example, query capabilities). They also can resolve applications and services.

Set the Administrator and User client roles when you create the cluster. Assign roles by providing separate identities (for example, by using certificates or Azure AD) for each role type. For more information about default access control settings and how to change default settings, see [Role-Based Access Control for Service Fabric clients](service-fabric-cluster-security-roles.md).

## X.509 certificates and Service Fabric
X.509 digital certificates commonly are used to authenticate clients and servers. They also are used to encrypt and digitally sign messages. For more information about X.509 digital certificates, see [Working with certificates](http://msdn.microsoft.com/library/ms731899.aspx).

Some important things to consider:

* To create certificates for clusters that are running production workloads, use a correctly configured Windows Server certificate service, or one from an approved [certificate authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority).
* Never use any temporary or test certificates that you create by using tools like MakeCert.exe in a production environment.
* You can use a self-signed certificate, but only in a test cluster. Do not use a self-signed certificate in production.

### Server X.509 certificates
Server certificates have the primary task of authenticating a server (node) to clients, or authenticating a server (node) to a server (node). When a client or node authenticates a node, one of the initial checks is the value of the common name in the **Subject** field. Either this common name or one of the certificates' Subject Alternative Names (SANs) must be present in the list of allowed common names.

To learn how to generate certificates that have SANs, see [How to add a Subject Alternative Name to a secure LDAP certificate](http://support.microsoft.com/kb/931351).

The **Subject** field can have multiple values. Each value is prefixed with an initialization to indicate the value type. Usually, the initialization is **CN** (for *common name*); for example, **CN = www.contoso.com**. The **Subject** field can be blank. If the optional **Subject Alternative Name** field is populated, it must have both the common name of the certificate and one entry per SAN. These are entered as **DNS Name** values.

The value of the **Intended Purposes** field of the certificate should include an appropriate value, such as **Server Authentication** or **Client Authentication**.

### Client X.509 certificates
Client certificates typically are not issued by a third-party CA. Instead, the Personal store of the current user location typically contains client certificates placed there by a root authority, with an **Intended Purposes** value of **Client Authentication**. The client can use this certificate when mutual authentication is required.

> [!NOTE]
> All management operations on a Service Fabric cluster require server certificates. Client certificates cannot be used for management.

## Next steps
* [Create a cluster in Azure by using a Resource Manager template](service-fabric-cluster-creation-via-arm.md) 
* [Create a cluster by using the Azure portal](service-fabric-cluster-creation-via-portal.md)

<!--Image references-->
[Node-to-Node]: ./media/service-fabric-cluster-security/node-to-node.png
[Client-to-Node]: ./media/service-fabric-cluster-security/client-to-node.png
