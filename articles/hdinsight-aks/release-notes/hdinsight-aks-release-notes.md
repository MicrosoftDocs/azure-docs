---
title: Release notes for Azure HDInsight on AKS  
description: Latest release notes for Azure HDInsight on AKS. Get development tips and details for Trino, Flink, Spark, and more.
ms.service: azure-hdinsight-on-aks
ms.topic: conceptual
ms.date: 08/05/2024
---

# Azure HDInsight on AKS release notes

This article provides information about the **most recent** Azure HDInsight on AKS release updates. For information on earlier releases, see [Azure HDInsight on AKS archived release notes](./hdinsight-aks-release-notes-archive.md). If you would like to subscribe on release notes, watch releases on this [GitHub repository](https://github.com/Azure/HDInsight-on-aks/releases).

## Summary

HDInsight on AKS is a modern, reliable, secure, and fully managed Platform as a Service (PaaS) that runs on Azure Kubernetes Service (AKS). HDInsight on AKS allows you to deploy popular Open-Source Analytics workloads like Apache Spark™, Apache Flink®️, and Trino without the overhead of managing and monitoring containers.

You can build end-to-end, petabyte-scale Big Data applications span streaming through Apache Flink, data engineering and machine learning using Apache Spark, and Trino's powerful query engine.

All these capabilities combined with HDInsight on AKS’s strong developer focus enable enterprises and digital natives with deep technical expertise to build and operate applications that are right fit for their needs. HDInsight on AKS allows developers to access all the rich configurations provided by open-source software and the extensibility to seamlessly include other ecosystem offerings. This offering empowers developers to test and tune their applications to extract the best performance at optimal cost.


> [!NOTE]
> To understand about HDInsight on AKS versioning and support, refer to the **[versioning schema](../versions.md)**.

You can refer to [What's new](../whats-new.md) page for all the details of the features currently in public preview for this release.

> [!IMPORTANT]
> HDInsight on AKS uses safe deployment practices, which involve gradual region deployment. It might take up to 10 business days for a new release or a new version to be available in all regions.

## Release Information

### Release date: Aug 05, 2024

**This release applies to the following**

- Cluster Pool Version: 1.2
- Cluster Version: 1.2.1
- AKS version: 1.27

### New Features

**MSI based SQL authentication**
Users can now authenticate external Azure SQL DB Metastore with MSI instead of User ID password authentication. This feature helps to further secure the cluster connection with Metastore.

**Configurable VM SKUs for Head node, SSH node** 
This functionality allows users to choose specific SKUs for head nodes, worker nodes, and SSH nodes, offering the flexibility to select according to the use case and the potential to lower total cost of ownership (TCO).

**Multiple MSI in cluster**
Users can configure multiple MSI for cluster admins operations and for job related resource access. This feature allows users to demarcate and control the access to the cluster and data lying in the storage account.
For example, one MSI for access to data in storage account and dedicated MSI for cluster operations.

### Updated

**Script action**
Script Action now can be added with Sudo user permission. Users can now install multiple dependencies including custom jars to customize the clusters as required. 

**Library Management**
Maven repository shortcut feature added to the Library Management in this release. User can now install Maven dependencies directly from the open-source repositories.

**Spark 3.4**
Spark 3.4 update brings a range of new features includes 
* API enhancements
* Structured streaming improvements
* Improved usability and developer experience

> [!IMPORTANT]
> To take benefit of all these **latest features**, you are required to create a new cluster pool with 1.2 and cluster version 1.2.1

### Known issues

- **Workload identity limitation:**
  - There's a known [limitation](/azure/aks/workload-identity-overview#limitations) when transitioning to workload identity. This limitation is due to the permission-sensitive nature of FIC operations. Users can't perform deletion of a cluster by deleting the resource group. Cluster deletion requests must be triggered by the application/user/principal with FIC/delete permissions. In case, the FIC deletion fails, the high-level cluster deletion also fails.
  - **User Assigned Managed Identities (UAMI)** support – There's a limit of 20 FICs per UAMI. You can only create 20 Federated Credentials on an identity. In HDInsight on AKS cluster, FIC (Federated Identity Credential) and SA have one-to-one mapping and only 20 SAs can be created against an MSI. If you want to create more clusters, then you are required to provide different MSIs to overcome the limitation.
  - Creation of federated identity credentials is currently not supported on user-assigned managed identities created in [these regions](/entra/workload-id/workload-identity-federation-considerations#unsupported-regions-user-assigned-managed-identities) 

 
### Operating System version

- Mariner OS 2.0

**Workload versions**

|Workload|Version|
| -------- | -------- |
|Trino | 440 |
|Flink | 1.17.0 |
|Apache Spark | 3.4 |

**Supported Java and Scala versions**

|Workload |Java|Scala|
| ----------- | -------- | -------- |
|Trino |Open JDK 21.0.2  |- |
|Flink  |Open JDK 11.0.21 |2.12.7 |
|Spark  |Open JDK 1.8.0_345  |2.12.15 |

The preview is available in the following [regions](../overview.md#region-availability-public-preview).

If you have any more questions, contact [Azure Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) or refer to the [Support options](../hdinsight-aks-support-help.md) page. If you have product specific feedback, write us on [aka.ms/askhdinsight](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR6HHTBN7UDpEhLm8BJmDhGJURDhLWEhBVE5QN0FQRUpHWDg4ODlZSDA4RCQlQCN0PWcu).

### Next steps

- [Azure HDInsight on AKS: Frequently asked questions](../faq.md)
- [Create cluster pool and cluster](../quickstart-create-cluster.md)
