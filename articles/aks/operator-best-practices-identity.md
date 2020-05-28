---
title: Best practices for managing identity
titleSuffix: Azure Kubernetes Service
description: Learn the cluster operator best practices for how to manage authentication and authorization for clusters in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: conceptual
ms.date: 04/24/2019

---

# Best practices for authentication and authorization in Azure Kubernetes Service (AKS)

As you deploy and maintain clusters in Azure Kubernetes Service (AKS), you need to implement ways to manage access to resources and services. Without these controls, accounts may have access to resources and services they don't need. It can also be hard to track which set of credentials were used to make changes.

This best practices article focuses on how a cluster operator can manage access and identity for AKS clusters. In this article, you learn how to:

> [!div class="checklist"]
>
> * Authenticate AKS cluster users with Azure Active Directory
> * Control access to resources with role-based access controls (RBAC)
> * Use a managed identity to authenticate themselves with other services

## Use Azure Active Directory

**Best practice guidance** - Deploy AKS clusters with Azure AD integration. Using Azure AD centralizes the identity management component. Any change in user account or group status is automatically updated in access to the AKS cluster. Use Roles or ClusterRoles and Bindings, as discussed in the next section, to scope users or groups to least amount of permissions needed.

The developers and application owners of your Kubernetes cluster need access to different resources. Kubernetes doesn't provide an identity management solution to control which users can interact with what resources. Instead, you typically integrate your cluster with an existing identity solution. Azure Active Directory (AD) provides an enterprise-ready identity management solution, and can integrate with AKS clusters.

With Azure AD-integrated clusters in AKS, you create *Roles* or *ClusterRoles* that define access permissions to resources. You then *bind* the roles to users or groups from Azure AD. These Kubernetes role-based access controls (RBAC) are discussed in the next section. The integration of Azure AD and how you control access to resources can be seen in the following diagram:

![Cluster-level authentication for Azure Active Directory integration with AKS](media/operator-best-practices-identity/cluster-level-authentication-flow.png)

1. Developer authenticates with Azure AD.
1. The Azure AD token issuance endpoint issues the access token.
1. The developer performs an action using the Azure AD token, such as `kubectl create pod`
1. Kubernetes validates the token with Azure Active Directory and fetches the developer's group memberships.
1. Kubernetes role-based access control (RBAC) and cluster policies are applied.
1. Developer's request is successful or not based on previous validation of Azure AD group membership and Kubernetes RBAC and policies.

To create an AKS cluster that uses Azure AD, see [Integrate Azure Active Directory with AKS][aks-aad].

## Use role-based access controls (RBAC)

**Best practice guidance** - Use Kubernetes RBAC to define the permissions that users or groups have to resources in the cluster. Create roles and bindings that assign the least amount of permissions required. Integrate with Azure AD so any change in user status or group membership is automatically updated and access to cluster resources is current.

In Kubernetes, you can provide granular control of access to resources in the cluster. Permissions can be defined at the cluster level, or to specific namespaces. You can define what resources can be managed, and with what permissions. These roles are then applied to users or groups with a binding. For more information about *Roles*, *ClusterRoles*, and *Bindings*, see [Access and identity options for Azure Kubernetes Service (AKS)][aks-concepts-identity].

As an example, you can create a Role that grants full access to resources in the namespace named *finance-app*, as shown in the following example YAML manifest:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: finance-app-full-access-role
  namespace: finance-app
rules:
- apiGroups: [""]
  resources: ["*"]
  verbs: ["*"]
```

A RoleBinding is then created that binds the Azure AD user *developer1\@contoso.com* to the RoleBinding, as shown in the following YAML manifest:

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: finance-app-full-access-role-binding
  namespace: finance-app
subjects:
- kind: User
  name: developer1@contoso.com
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: finance-app-full-access-role
  apiGroup: rbac.authorization.k8s.io
```

When *developer1\@contoso.com* is authenticated against the AKS cluster, they have full permissions to resources in the *finance-app* namespace. In this way, you logically separate and control access to resources. Kubernetes RBAC should be used in conjunction with Azure AD-integration, as discussed in the previous section.

To see how to use Azure AD groups to control access to Kubernetes resources using RBAC, see [Control access to cluster resources using role-based access controls and Azure Active Directory identities in AKS][azure-ad-rbac].

## Use pod identities

**Best practice guidance** - Don't use fixed credentials within pods or container images, as they are at risk of exposure or abuse. Instead, use pod identities to automatically request access using a central Azure AD identity solution. Pod identities is intended for use with Linux pods and container images only.

When pods need access to other Azure services, such as Cosmos DB, Key Vault, or Blob Storage, the pod needs access credentials. These access credentials could be defined with the container image or injected as a Kubernetes secret, but need to be manually created and assigned. Often, the credentials are reused across pods, and aren't regularly rotated.

Managed identities for Azure resources (currently implemented as an associated AKS open source project) let you automatically request access to services through Azure AD. You don't manually define credentials for pods, instead they request an access token in real time, and can use it to access only their assigned services. In AKS, two components are deployed by the cluster operator to allow pods to use managed identities:

* **The Node Management Identity (NMI) server** is a pod that runs as a DaemonSet on each node in the AKS cluster. The NMI server listens for pod requests to Azure services.
* **The Managed Identity Controller (MIC)** is a central pod with permissions to query the Kubernetes API server and checks for an Azure identity mapping that corresponds to a pod.

When pods request access to an Azure service, network rules redirect the traffic to the Node Management Identity (NMI) server. The NMI server identifies pods that request access to Azure services based on their remote address, and queries the Managed Identity Controller (MIC). The MIC checks for Azure identity mappings in the AKS cluster, and the NMI server then requests an access token from Azure Active Directory (AD) based on the pod's identity mapping. Azure AD provides access to the NMI server, which is returned to the pod. This access token can be used by the pod to then request access to services in Azure.

In the following example, a developer creates a pod that uses a managed identity to request access to Azure SQL Database:

![Pod identities allow a pod to automatically request access to other services](media/operator-best-practices-identity/pod-identities.png)

1. Cluster operator first creates a service account that can be used to map identities when pods request access to services.
1. The NMI server and MIC are deployed to relay any pod requests for access tokens to Azure AD.
1. A developer deploys a pod with a managed identity that requests an access token through the NMI server.
1. The token is returned to the pod and used to access Azure SQL Database

> [!NOTE]
> Managed pod identities is an open source project, and is not supported by Azure technical support.

To use pod identities, see [Azure Active Directory identities for Kubernetes applications][aad-pod-identity].

## Next steps

This best practices article focused on authentication and authorization for your cluster and resources. To implement some of these best practices, see the following articles:

* [Integrate Azure Active Directory with AKS][aks-aad]
* [Use managed identities for Azure resources with AKS][aad-pod-identity]

For more information about cluster operations in AKS, see the following best practices:

* [Multi-tenancy and cluster isolation][aks-best-practices-cluster-isolation]
* [Basic Kubernetes scheduler features][aks-best-practices-scheduler]
* [Advanced Kubernetes scheduler features][aks-best-practices-advanced-scheduler]

<!-- EXTERNAL LINKS -->
[aad-pod-identity]: https://github.com/Azure/aad-pod-identity

<!-- INTERNAL LINKS -->
[aks-concepts-identity]: concepts-identity.md
[aks-aad]: azure-ad-integration-cli.md
[managed-identities:]: ../active-directory/managed-identities-azure-resources/overview.md
[aks-best-practices-scheduler]: operator-best-practices-scheduler.md
[aks-best-practices-advanced-scheduler]: operator-best-practices-advanced-scheduler.md
[aks-best-practices-cluster-isolation]: operator-best-practices-cluster-isolation.md
[azure-ad-rbac]: azure-ad-rbac.md
