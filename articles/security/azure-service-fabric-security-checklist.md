# Azure service fabric security checklist
This article provides an easy to use checklist that will help you secure your Azure Service Fabric environment.

## Introduction
Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices. Service Fabric also addresses the significant challenges in developing and managing cloud applications. Developers and administrators can avoid complex infrastructure problems and focus on implementing mission-critical, demanding workloads that are scalable, reliable, and manageable.

## Checklist
Use the following checklist to help you make sure that you haven’t overlooked any important issues in management and configuration of a secure Azure Service Fabric solution.


|Checklist Category| Description |
| ------------ | -------- |
|Role based access control (RBAC) | <ul><li>Access control allows the cluster administrator to limit access to certain cluster operations for different groups of users, making the cluster more secure.</li><li>Administrators have full access to management capabilities (including read/write capabilities). </li><li>	Users, by default, have only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.</li></ul>|
|X.509 certificates and Service Fabric | <ul><li>Certificates used in clusters running production workloads should be created by using a correctly configured Windows Server certificate service or obtained from an approved Certificate Authority (CA).</li><li>Never use any temporary or test certificates in production that are created with tools such as MakeCert.exe. </li><li>You can use a self-signed certificate but, should only do so for test clusters and not in production.</li></ul>|
|Cluster Security | <ul><li>The cluster security scenarios include Node-to-node security, Client-to-node security, Role-based access control (RBAC).</li></ul>|
|Cluster authentication | <ul><li>Authenticates node-to-node communication for cluster federation. </li></ul>|
|Server authentication | <ul><li>Authenticates the cluster management endpoints to a management client.</li></ul>|
|Cluster Certificate | <ul><li>This certificate is required to secure the communication between the nodes on a cluster.</li><li>	Set the thumbprint of the primary certificate in the Thumbprint section and that of the secondary in the ThumbprintSecondary variables.</li></ul>|
|ServerCertificate| <ul><li>This certificate is presented to the client when it tries to connect to this cluster. You can use two different server certificates, a primary and a secondary for upgrade.</li></ul>|
|ClientCertificateThumbprints| <ul><li>This is a set of certificates that you want to install on the authenticated clients. </li></ul>|
|ClientCertificateCommonNames| <ul><li>•	Set the common name of the first client certificate for the CertificateCommonName. The CertificateIssuerThumbprint is the thumbprint for the issuer of this certificate. </li></ul>|
|ReverseProxyCertificate| <ul><li>•	This is an optional certificate that can be specified if you want to secure your Reverse Proxy. </li></ul>|
|Key Vault| <ul><li>•	Used to manage certificates for Service Fabric clusters in Azure.  </li></ul>|
