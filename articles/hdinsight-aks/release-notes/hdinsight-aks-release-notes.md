---
title: Release notes for Azure HDInsight on AKS  
description: Latest release notes for Azure HDInsight on AKS. Get development tips and details for Trino, Flink, Spark, and more.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 03/20/2024
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

## Release Information

### Release date: March 20, 2024

**This release applies to the following**

- Cluster Pool Version: 1.1
- Cluster Version: 1.1.1
- AKS version: 1.27


### New Features

**Apache Flink Application Mode Cluster**

 Application mode clusters are designed to support dedicated resources for large and long-running jobs. When you have resource-intensive or extensive data processing tasks, you can use the [Application Mode Cluster](https://flink.apache.org/2020/07/14/application-deployment-in-flink-current-state-and-the-new-application-mode/#application-mode). This mode allows you to allocate dedicated resources for specific Apache Flink applications, ensuring that they have the necessary computing power and memory to handle large workloads effectively.  

**Private Clusters for HDInsight on AKS**

With private clusters, and outbound cluster settings you can now control ingress and egress traffic from HDInsight on AKS cluster pools and clusters.

- Use Azure Firewall or Network Security Groups (NSGs) to control the egress traffic, when you opt to use outbound cluster pool with load balancer.
- Use Outbound cluster pool with User defined routing to control egress traffic at the subnet level.
- Use Private AKS cluster feature - To ensure AKS control plane, or API server has internal IP addresses. The network traffic between AKS Control plane / API server and HDInsight on AKS node pools (clusters) remains on the private network only.
- Avoid creating public IPs for the cluster. Use private ingress feature on your clusters.

**In place Upgrade**

Upgrade your clusters and cluster pools with the latest software updates. This means that you can enjoy the latest cluster package hotfixes, security updates, and AKS patches, without recreating clusters.  


### Known issues

- **Workload identity limitation:**
  - There's a known [limitation](/azure/aks/workload-identity-overview#limitations) when transitioning to workload identity. This limitation is due to the permission-sensitive nature of FIC operations. Users can't perform deletion of a cluster by deleting the resource group. Cluster deletion requests must be triggered by the application/user/principal with FIC/delete permissions. In case, the FIC deletion fails, the high-level cluster deletion also fails.
  - **User Assigned Managed Identities (UAMI)** support – There's a limit of 20 FICs per UAMI. You can only create 20 Federated Credentials on an identity. In HDInsight on AKS cluster, FIC (Federated Identity Credential) and SA have one-to-one mapping and only 20 SAs can be created against an MSI. If you want to create more clusters, then you are required to provide different MSIs to overcome the limitation.

 
### Operating System version

- Mariner OS 2.0

**Workload versions**

|Workload|Version|
| -------- | -------- |
|Trino | 426 |
|Flink | 1.17.0 |
|Apache Spark | 3.3.1 |

**Supported Java and Scala versions**

|Workload |Java|Scala|
| ----------- | -------- | -------- |
|Trino |Open JDK 17.0.7  |- |
|Flink  |Open JDK 11.0.21 |2.12.7 |
|Spark  |Open JDK 1.8.0_345  |2.12.15 |

The preview is available in the following [regions](../overview.md#region-availability-public-preview).

If you have any more questions, contact [Azure Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) or refer to the [Support options](../hdinsight-aks-support-help.md) page. If you have product specific feedback, write us on [aka.ms/askhdinsight](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR6HHTBN7UDpEhLm8BJmDhGJURDhLWEhBVE5QN0FQRUpHWDg4ODlZSDA4RCQlQCN0PWcu).

### Next steps

- [Azure HDInsight on AKS: Frequently asked questions](../faq.md)
- [Create cluster pool and cluster](../quickstart-create-cluster.md)
