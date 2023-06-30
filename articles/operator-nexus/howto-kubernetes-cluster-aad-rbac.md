---
title: Role-based access control in Azure Operator Nexus Kubernetes clusters #Required; page title is displayed in search results. Include the brand.
description: Information about role-based access control in Azure Operator Nexus Kubernetes clusters #Required; article description that is displayed in search results. 
author: dramasamy #Required; your GitHub user alias, with correct capitalization.
ms.author: dramasamy #Required; microsoft alias of author; optional team alias.
ms.service: azure-operator-nexus #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 06/30/2023 #Required; mm/dd/yyyy format.
ms.custom: template-how-to-pattern #Required; leave this attribute/value as-is.
---

# Role-based access control in Azure Operator Nexus Kubernetes clusters

This article provides a comprehensive guide on how to manage access to Nexus Kubernetes clusters using Azure Active Directory (Azure AD). Specifically, we're focusing on role-based access control, which allows you to grant permissions to users based on their roles or responsibilities within your organization.

## Before you begin

1. To begin, create an Azure AD group for your cluster administrators and assign members to it. Azure AD allows access to be granted to the group as a whole, rather than managing permissions for each user individually.
2. Use the group ID you created as the value for 'adminGroupObjectIds' when creating the Nexus Kubernetes cluster to ensure that the members of the group get permissions to manage the cluster. Refer to the [QuickStart](./quickstarts-kubernetes-cluster-deployment-bicep.md) guide for instructions on how to create the Nexus Kubernetes cluster.

## Administrator access to the cluster

Nexus creates a Kubernetes cluster role binding with the default Kubernetes role ```cluster-admin``` and the Azure AD groups you specified as `adminGroupObjectIds`. The cluster administrators have full access to the cluster and can perform all operations on the cluster. The cluster administrators can also grant access to other users by assigning them to the appropriate Azure AD group.

## Role-based access control
As an administrator, you can provide role-based access control to the cluster by creating a role binding with Azure AD group object ID. For users who only need 'view' permissions, you can accomplish the task by adding them to an Azure AD group that's tied to the 'view' role.

1. Create an Azure AD group for users who need 'view' access. Take note of the group object ID generated upon creation.

2. Use the kubectl command to create a `clusterrolebinding` with the 'view' role and link it to the Azure AD group. Replace <read-only-group-id> with your Azure AD group object ID:

    ```bash
    kubectl create clusterrolebinding nexus-read-only-users --clusterrole view --group=<read-only-group-id>
    ```
This command creates a cluster role binding named 'nexus-read-only-users' that assigns the 'view' role to the members of the specified Azure AD group.

1. Verify that the role binding was created successfully.
    ```bash
    kubectl get clusterrolebinding nexus-read-only-users
    ```

2. Now the users in the Azure AD group have 'view' access to the cluster. They can view the cluster resources but can't make any changes to them.

## Next steps

You can further fine-tune access control by creating custom roles with specific permissions. The creation of these roles involves Kubernetes native RoleBinding or ClusterRoleBinding resources. You can check the official [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) for detailed guidance on creating more custom roles and role bindings as per your requirements.