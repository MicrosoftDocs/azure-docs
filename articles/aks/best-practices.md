---
title: Best practices for Azure Kubernetes Service (AKS)
description: Collection of the cluster operator and developer best practices to build and manage applications in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 12/07/2018

---

# Cluster operator and developer best practices to build and manage applications on Azure Kubernetes Service (AKS)

To build and run applications successfully in Azure Kubernetes Service (AKS), there are some key considerations to understand and implement. These areas include multi-tenancy and scheduler features, cluster and pod security, or business continuity and disaster recovery. The following best practices are grouped to help cluster operators and developers understand the considerations for each of these areas, and implement the appropriate features.

These best practices and conceptual articles have been written in conjunction with the AKS product group, engineering teams, and field teams including global black belts (GBBs).

## Cluster operator best practices

As a cluster operator, work together with application owners and developers to understand their needs. You can then use the following best practices to configure your AKS clusters as needed.

**Multi-tenancy**

* [Best practices for cluster isolation](operator-best-practices-cluster-isolation.md)
    * Includes multi-tenancy core components and logical isolation with namespaces.
* [Best practices for basic scheduler features](operator-best-practices-scheduler.md)
    * Includes using resource quotas and pod disruption budgets.
* [Best practices for advanced scheduler features](operator-best-practices-advanced-scheduler.md)
    * Includes using taints and tolerations, node selectors and affinity, and inter-pod affinity and anti-affinity.
* [Best practices for authentication and authorization](operator-best-practices-identity.md)
    * Includes integration with Azure Active Directory, using role-based access controls (RBAC), and pod identities.

**Security**

* [Best practices for cluster security and upgrades](operator-best-practices-cluster-security.md)
    * Includes securing access to the API server, limiting container access, and managing upgrades and node reboots.
* [Best practices for container image management and security](operator-best-practices-container-image-management.md)
    * Includes securing the image and runtimes and automated builds on base image updates.
* [Best practices for pod security](developer-best-practices-pod-security.md)
    * Includes securing access to resources, limiting credential exposure, and using pod identities and digital key vaults.

**Network and storage**

* [Best practices for network connectivity](operator-best-practices-network.md)
    * Includes different network models, using ingress and web application firewalls (WAF), and securing node SSH access.
* [Best practices for storage and backups](operator-best-practices-storage.md)
    * Includes choosing the appropriate storage type and node size, dynamically provisioning volumes, and data backups.

**Running enterprise-ready workloads**

* [Best practices for business continuity and disaster recovery](operator-best-practices-multi-region.md)
    * Includes using region pairs, multiple clusters with Azure Traffic Manager, and geo-replication of container images.

## Developer best practices

As a developer or application owner, you can simplify your development experience and define require application performance needs.

* [Best practices for application developers to manage resources](developer-best-practices-resource-management.md)
    * Includes defining pod resource requests and limits, configuring development tools, and checking for application issues.
* [Best practices for pod security](developer-best-practices-pod-security.md)
    * Includes securing access to resources, limiting credential exposure, and using pod identities and digital key vaults.

## Kubernetes / AKS concepts

To help understand some of the features and components of these best practices, you can also see the following conceptual articles for clusters in Azure Kubernetes Service (AKS):

* [Kubernetes core concepts](concepts-clusters-workloads.md)
* [Access and identity](concepts-identity.md)
* [Security concepts](concepts-security.md)
* [Network concepts](concepts-network.md)
* [Storage options](concepts-storage.md)
* [Scaling options](concepts-scale.md)

## Next steps

If you need to get started with AKS, follow one of the quickstarts to deploy an Azure Kubernetes Service (AKS) cluster using the [Azure CLI](kubernetes-walkthrough.md) or [Azure portal](kubernetes-walkthrough-portal.md).
