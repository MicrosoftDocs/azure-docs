---
title: Best practices for Azure Kubernetes Service (AKS)
description: Collection of the cluster operator and developer best practices to build and manage applications in Azure Kubernetes Service (AKS)
ms.topic: article
ms.date: 03/07/2023

---

# Cluster operator and developer best practices to build and manage applications on Azure Kubernetes Service (AKS)

Building and running applications successfully in Azure Kubernetes Service (AKS) requires understanding and implementation of some key concepts, including:

* Multi-tenancy and scheduler features.
* Cluster and pod security.
* Business continuity and disaster recovery.

The AKS product group, engineering teams, and field teams (including global black belts [GBBs]) contributed to, wrote, and grouped the following best practices and conceptual articles. Their purpose is to help cluster operators and developers better understand the concepts above and implement the appropriate features.

## Cluster operator best practices

If you're a cluster operator, work with application owners and developers to understand their needs. Then, you can use the following best practices to configure your AKS clusters to fit your needs.

### Multi-tenancy

* [Best practices for cluster isolation](operator-best-practices-cluster-isolation.md)
    * Includes multi-tenancy core components and logical isolation with namespaces.
* [Best practices for basic scheduler features](operator-best-practices-scheduler.md)
    * Includes using resource quotas and pod disruption budgets.
* [Best practices for advanced scheduler features](operator-best-practices-advanced-scheduler.md)
    * Includes using taints and tolerations, node selectors and affinity, and inter-pod affinity and anti-affinity.
* [Best practices for authentication and authorization](operator-best-practices-identity.md)
    * Includes integration with Azure Active Directory, using Kubernetes role-based access control (Kubernetes RBAC), using Azure RBAC, and pod identities.

### Security

* [Best practices for cluster security and upgrades](operator-best-practices-cluster-security.md)
    * Includes securing access to the API server, limiting container access, and managing upgrades and node reboots.
* [Best practices for container image management and security](operator-best-practices-container-image-management.md)
    * Includes securing the image and runtimes and automated builds on base image updates.
* [Best practices for pod security](developer-best-practices-pod-security.md)
    * Includes securing access to resources, limiting credential exposure, and using pod identities and digital key vaults.

### Network and storage

* [Best practices for network connectivity](operator-best-practices-network.md)
    * Includes different network models, using ingress and web application firewalls (WAF), and securing node SSH access.
* [Best practices for storage and backups](operator-best-practices-storage.md)
    * Includes choosing the appropriate storage type and node size, dynamically provisioning volumes, and data backups.

### Running enterprise-ready workloads

* [Best practices for business continuity and disaster recovery](operator-best-practices-multi-region.md)
    * Includes using region pairs, multiple clusters with Azure Traffic Manager, and geo-replication of container images.

## Developer best practices

If you're a developer or application owner, you can simplify your development experience and define required application performance features.

* [Best practices for application developers to manage resources](developer-best-practices-resource-management.md)
    * Includes defining pod resource requests and limits, configuring development tools, and checking for application issues.
* [Best practices for pod security](developer-best-practices-pod-security.md)
    * Includes securing access to resources, limiting credential exposure, and using pod identities and digital key vaults.

## Kubernetes and AKS concepts

The following conceptual articles cover some of the fundamental features and components for clusters in AKS:

* [Kubernetes core concepts](concepts-clusters-workloads.md)
* [Access and identity](concepts-identity.md)
* [Security concepts](concepts-security.md)
* [Network concepts](concepts-network.md)
* [Storage options](concepts-storage.md)
* [Scaling options](concepts-scale.md)

## Next steps

For guidance on a creating full solutions with AKS for production, see [AKS solution guidance][aks-solution-guidance].

<!-- LINKS - internal -->
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here?WT.mc_id=AKSDOCSPAGE