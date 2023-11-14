---
title: Security in HDInsight on AKS
description: An introduction to security with managed identity from Microsoft Entra ID in HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 08/29/2023
---

# Overview of enterprise security in Azure HDInsight on AKS

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Azure HDInsight on AKS offers is secure by default, and there are several methods to address your enterprise security needs. Most of these solutions are activated by default. 

This article covers overall security architecture, and security solutions by dividing them into four traditional security pillars: perimeter security, authentication, authorization, and encryption.

## Security architecture

Enterprise readiness for any software requires stringent security checks to prevent and address threats that may arise. HDInsight on AKS provides a multi-layered security model to protect you on multiple layers. The security architecture uses modern authorization methods using MSI. All the storage access is through MSI, and the database access is through username/password. The password is stored in Azure [Key Vault](../key-vault/general/basic-concepts.md), defined by the customer. This makes the setup robust and secure by default.

The below diagram illustrates a high-level technical architecture of security in HDInsight on AKS. 

:::image type="content" source="./media/concept-security/security-concept.png" alt-text="Screenshot showing the security flow of authenticating a cluster." border="true" lightbox="./media/concept-security/security-concept.png":::

## Enterprise security pillars

One way of looking at enterprise security is to divide security solutions into four main groups based on the type of control. These groups are also called security pillars and are of the following types: perimeter security, authentication, authorization, and encryption.

### Perimeter security

Perimeter security in HDInsight on AKS is achieved through [virtual networks.](../hdinsight/hdinsight-plan-virtual-network-deployment.md) An enterprise admin can create a cluster inside a virtual network (VNET) and use [network security groups (NSG)](./secure-traffic-by-nsg.md) to restrict access to the virtual network. 

### Authentication

HDInsight on AKS provides Microsoft Entra ID-based authentication for cluster login and uses managed identities (MSI) to secure cluster access to files in Azure Data Lake Storage Gen2. Managed identity is a feature of Microsoft Entra ID that provides Azure services with a set of automatically managed credentials. With this setup, enterprise employees can sign into the cluster nodes by using their domain credentials. 
A managed identity from Microsoft Entra ID allows your app to easily access other Microsoft Entra protected resources such as Azure Key Vault, Storage, SQL Server, and Database. The identity managed by the Azure platform and doesn't require you to provision or rotate any secrets.
This solution is a key for securing access to your HDInsight on AKS cluster and other dependent resources. Managed identities make your app more secure by eliminating secrets from your app, such as credentials in the connection strings.

You create a user-assigned managed identity, which is a standalone Azure resource, as part of the cluster creation process, which manages the access to your dependent resources.

### Authorization

A best practice most enterprises follow is making sure that not every employee has full access to all enterprise resources. Likewise, the admin can define role-based access control policies for the cluster resources. 

The resource owners can configure role-based access control (RBAC). Configuring RBAC policies allows you to associate permissions with a role in the organization. This layer of abstraction makes it easier to ensure people have only the permissions needed to perform their work responsibilities. 
Authorization managed by ARM roles for cluster management (control plane) and cluster data access (data plane) managed by [cluster access management](./hdinsight-on-aks-manage-authorization-profile.md).
#### Cluster management roles (Control Plane / ARM Roles)

|Action	|HDInsight on AKS Cluster Pool Admin	| HDInsight on AKS Cluster Admin|
|-|-|-|
|Create / Delete cluster pool	|✅	| |
|Assign permission and roles on the cluster pool	|✅| | 
|Create/delete cluster	|✅| ✅ |
| **Manage Cluster**| | ✅ | 
| Configuration Management | |✅| 
| Script actions | |✅| 
| Library Management | |✅| 
| Monitoring | |✅| 
| Scaling actions	| |✅|

The above roles are from the ARM operations perspective. For more information, see [Grant a user access to Azure resources using the Azure portal - Azure RBAC](../role-based-access-control/quickstart-assign-role-user-portal.md).

#### Cluster access (Data Plane)

You can allow users, service principals, managed identity to access the cluster through portal or using ARM. 

This access enables you to

* View clusters and manage jobs.
* Perform all the monitoring and management operations.
* Perform auto scale operations and update the node count.
  
The access won't be provided for
* Cluster deletion

:::image type="content" source="./media/concept-security/cluster-access.png" alt-text="Screenshot showing the cluster data access." border="true" lightbox="./media/concept-security/cluster-access.png":::

> [!Important]
> Any newly added user will require additional role of  “Azure Kubernetes Service RBAC Reader” for viewing the [service health](./service-health.md).

## Auditing

Auditing cluster resource access is necessary to track unauthorized or unintentional access of the resources. It's as important as protecting the cluster resources from unauthorized access.

The resource group admin can view and report all access to the HDInsight on AKS cluster resources and data using activity log. The admin can view and report changes to the access control policies.

## Encryption

Protecting data is important for meeting organizational security and compliance requirements. Along with restricting access to data from unauthorized employees, you should encrypt it. The storage and the disks (OS disk and persistent data disk) used by the cluster nodes and containers are encrypted. Data in Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is enabled for all storage accounts, which makes data secure by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption. Encryption of data in transit is handled with TLS 1.2. 

## Compliance

Azure compliance offerings are based on various types of assurances, including formal certifications. Also, attestations, validations, and authorizations. Assessments produced by independent third-party auditing firms.
Contractual amendments, self-assessments, and customer guidance documents produced by Microsoft. For HDInsight on AKS compliance information, see the Microsoft [Trust Center](https://www.microsoft.com/trust-center?rtc=1) and the [Overview of Microsoft Azure compliance](/samples/browse/).

## Shared responsibility model

The following image summarizes the major system security areas and the security solutions that are available to you. It also highlights which security areas are your responsibilities as a customer and areas that are  responsibility of HDInsight on AKS as the service provider.

:::image type="content" source="./media/concept-security/shared-responsibility-model.png" alt-text="Screenshot showing the shared responsibility model.":::

The following table provides links to resources for each type of security solution.

|Security area	|Solutions available	|Responsible party|
|-|-|-|
|Data Access Security	|[Configure access control lists ACLs](../storage/blobs/data-lake-storage-access-control.md) for Azure Data Lake Storage Gen2	|Customer|
|	|Enable the [Secure transfer required](../storage/common/storage-require-secure-transfer.md) property on storage|Customer|
| |Configure [Azure Storage firewalls](../storage/common/storage-network-security.md) and virtual networks|Customer|
|Operating system security|Create clusters with most recent HDInsight on AKS versions|Customer|
|Network security| Configure a [virtual network](../hdinsight/hdinsight-plan-virtual-network-deployment.md)||
| | Configure [Traffic using Firewall rules](./secure-traffic-by-firewall.md)|Customer|
| | Configure [Outbound traffic required](./required-outbound-traffic.md) |Customer|
