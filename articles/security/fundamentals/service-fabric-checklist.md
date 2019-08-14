---

title: Azure service fabric security checklist| Microsoft Docs
description: This article provides a set of checklist for Azure fabric security security.
services: security
documentationcenter: na
author: unifycloud
manager: barbkess
editor: tomsh

ms.assetid:
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/16/2019
ms.author: tomsh

---
# Azure Service Fabric security checklist
This article provides an easy-to-use checklist that will help you secure your Azure Service Fabric environment.

## Introduction
Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices. Service Fabric also addresses the significant challenges in developing and managing cloud applications. Developers and administrators can avoid complex infrastructure problems and focus on implementing mission-critical, demanding workloads that are scalable, reliable, and manageable.

## Checklist
Use the following checklist to help you make sure that you haven’t overlooked any important issues in management and configuration of a secure Azure Service Fabric solution.


|Checklist Category| Description |
| ------------ | -------- |
|[Role based access control (RBAC)](../../service-fabric/service-fabric-cluster-security-roles.md) | <ul><li>Access control allows the cluster administrator to limit access to certain cluster operations for different groups of users, making the cluster more secure.</li><li>Administrators have full access to management capabilities (including read/write capabilities). </li><li>	Users, by default, have only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.</li></ul>|
|[X.509 certificates and Service Fabric](../../service-fabric/service-fabric-cluster-security.md) | <ul><li>[Certificates](https://docs.microsoft.com/dotnet/framework/wcf/feature-details/working-with-certificates) used in clusters running production workloads should be created by using a correctly configured Windows Server certificate service or obtained from an approved [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority).</li><li>Never use any [temporary or test certificates](https://docs.microsoft.com/dotnet/framework/wcf/feature-details/how-to-create-temporary-certificates-for-use-during-development) in production that are created with tools such as [MakeCert.exe](https://msdn.microsoft.com/library/windows/desktop/aa386968.aspx). </li><li>You can use a [self-signed certificate](../../service-fabric/service-fabric-windows-cluster-x509-security.md) but, should only do so for test clusters and not in production.</li></ul>|
|[Cluster Security](../../service-fabric/service-fabric-cluster-security.md) | <ul><li>The cluster security scenarios include Node-to-node security, Client-to-node security, [Role-based access control (RBAC)](../../service-fabric/service-fabric-cluster-security-roles.md).</li></ul>|
|[Cluster authentication](../../service-fabric/service-fabric-cluster-creation-via-arm.md) | <ul><li>Authenticates [node-to-node communication](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/service-fabric/service-fabric-cluster-security.md) for cluster federation. </li></ul>|
|[Server authentication](../../service-fabric/service-fabric-cluster-creation-via-arm.md) | <ul><li>Authenticates the [cluster management endpoints](../../service-fabric/service-fabric-cluster-creation-via-portal.md) to a management client.</li></ul>|
|[Application security](../../service-fabric/service-fabric-cluster-creation-via-arm.md)| <ul><li>Encryption and decryption of application configuration values.</li><li>	Encryption of data across nodes during replication.</li></ul>|
|[Cluster Certificate](../../service-fabric/service-fabric-windows-cluster-x509-security.md) | <ul><li>This certificate is required to secure the communication between the nodes on a cluster.</li><li>	Set the thumbprint of the primary certificate in the Thumbprint section and that of the secondary in the ThumbprintSecondary variables.</li></ul>|
|[ServerCertificate](../../service-fabric/service-fabric-windows-cluster-x509-security.md)| <ul><li>This certificate is presented to the client when it tries to connect to this cluster. You can use two different server certificates, a primary and a secondary for upgrade.</li></ul>|
|ClientCertificateThumbprints| <ul><li>This is a set of certificates that you want to install on the authenticated clients. </li></ul>|
|ClientCertificateCommonNames| <ul><li>Set the common name of the first client certificate for the CertificateCommonName. The CertificateIssuerThumbprint is the thumbprint for the issuer of this certificate. </li></ul>|
|ReverseProxyCertificate| <ul><li>This is an optional certificate that can be specified if you want to secure your [Reverse Proxy](../../service-fabric/service-fabric-reverseproxy.md). </li></ul>|
|Key Vault| <ul><li>Used to manage certificates for Service Fabric clusters in Azure.  </li></ul>|


## Next steps

- [Service Fabric security best practices](service-fabric-best-practices.md)
- [Service Fabric Cluster upgrade process and expectations from you](../../service-fabric/service-fabric-cluster-upgrade.md)
- [Managing your Service Fabric applications in Visual Studio](../../service-fabric/service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric Health model introduction](../../service-fabric/service-fabric-health-introduction.md).
