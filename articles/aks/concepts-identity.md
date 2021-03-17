---
title: Concepts - Access and identity in Azure Kubernetes Services (AKS)
description: Learn about access and identity in Azure Kubernetes Service (AKS), including Azure Active Directory integration, Kubernetes role-based access control (Kubernetes RBAC), and roles and bindings.
services: container-service
ms.topic: conceptual
ms.date: 07/07/2020
author: palma21
ms.author: jpalma

---

# Access and identity options for Azure Kubernetes Service (AKS)

There are different ways to authenticate, control access/authorize and secure Kubernetes clusters. Using Kubernetes role-based access control (Kubernetes RBAC), you can grant users, groups, and service accounts access to only the resources they need. With Azure Kubernetes Service (AKS), you can further enhance the security and permissions structure by using Azure Active Directory and Azure RBAC. These approaches help you secure your cluster access and provide only the minimum required permissions to developers and operators.

This article introduces the core concepts that help you authenticate and assign permissions in AKS.

## AKS service permissions

When creating a cluster, AKS creates or modifies resources it needs to create and run the cluster, such as VMs and NICs, on behalf of the user creating the cluster. This identity is distinct from the cluster's identity permission, which is created during cluster creation.

### Identity creating and operating the cluster permissions

The following permissions are needed by the identity creating and operating the cluster.

| Permission | Reason |
|---|---|
| Microsoft.Compute/diskEncryptionSets/read | Required to read disk encryption set ID. |
| Microsoft.Compute/proximityPlacementGroups/write | Required for updating proximity placement groups. |
| Microsoft.Network/applicationGateways/read <br/> Microsoft.Network/applicationGateways/write <br/> Microsoft.Network/virtualNetworks/subnets/join/action | Required to configure application gateways and join the subnet. |
| Microsoft.Network/virtualNetworks/subnets/join/action | Required to configure the Network Security Group for the subnet when using a custom VNET.|
| Microsoft.Network/publicIPAddresses/join/action <br/> Microsoft.Network/publicIPPrefixes/join/action | Required to configure the outbound public IPs on the Standard Load Balancer. |
| Microsoft.OperationalInsights/workspaces/sharedkeys/read <br/> Microsoft.OperationalInsights/workspaces/read <br/> Microsoft.OperationsManagement/solutions/write <br/> Microsoft.OperationsManagement/solutions/read <br/> Microsoft.ManagedIdentity/userAssignedIdentities/assign/action | Required to create and update Log Analytics workspaces and Azure monitoring for containers. |

### AKS cluster identity permissions

The following permissions are used by the AKS cluster identity, which is created and associated with the AKS cluster when the cluster is created. Each permission is used for the reasons below:

| Permission | Reason |
|---|---|
| Microsoft.ContainerService/managedClusters/*  <br/> | Required for creating users and operating the cluster
| Microsoft.Network/loadBalancers/delete <br/> Microsoft.Network/loadBalancers/read <br/> Microsoft.Network/loadBalancers/write | Required to configure the load balancer for a LoadBalancer service. |
| Microsoft.Network/publicIPAddresses/delete <br/> Microsoft.Network/publicIPAddresses/read <br/> Microsoft.Network/publicIPAddresses/write | Required to find and configure public IPs for a LoadBalancer service. |
| Microsoft.Network/publicIPAddresses/join/action | Required for configuring public IPs for a LoadBalancer service. |
| Microsoft.Network/networkSecurityGroups/read <br/> Microsoft.Network/networkSecurityGroups/write | Required to create or delete security rules for a LoadBalancer service. |
| Microsoft.Compute/disks/delete <br/> Microsoft.Compute/disks/read <br/> Microsoft.Compute/disks/write <br/> Microsoft.Compute/locations/DiskOperations/read | Required to configure AzureDisks. |
| Microsoft.Storage/storageAccounts/delete <br/> Microsoft.Storage/storageAccounts/listKeys/action <br/> Microsoft.Storage/storageAccounts/read <br/> Microsoft.Storage/storageAccounts/write <br/> Microsoft.Storage/operations/read | Required to configure storage accounts for AzureFile or AzureDisk. |
| Microsoft.Network/routeTables/read <br/> Microsoft.Network/routeTables/routes/delete <br/> Microsoft.Network/routeTables/routes/read <br/> Microsoft.Network/routeTables/routes/write <br/> Microsoft.Network/routeTables/write | Required to configure route tables and routes for nodes. |
| Microsoft.Compute/virtualMachines/read | Required to find information for virtual machines in a VMAS, such as zones, fault domain, size, and data disks. |
| Microsoft.Compute/virtualMachines/write | Required to attach AzureDisks to a virtual machine in a VMAS. |
| Microsoft.Compute/virtualMachineScaleSets/read <br/> Microsoft.Compute/virtualMachineScaleSets/virtualMachines/read <br/> Microsoft.Compute/virtualMachineScaleSets/virtualmachines/instanceView/read | Required to find information for virtual machines in a virtual machine scale set, such as zones, fault domain, size, and data disks. |
| Microsoft.Network/networkInterfaces/write | Required to add a virtual machine in a VMAS to a load balancer backend address pool. |
| Microsoft.Compute/virtualMachineScaleSets/write | Required to add a virtual machine scale set to a load balancer backend address pools and scale out nodes in a virtual machine scale set. |
| Microsoft.Compute/virtualMachineScaleSets/virtualmachines/write | Required to attach AzureDisks and add a virtual machine from a virtual machine scale set to the load balancer. |
| Microsoft.Network/networkInterfaces/read | Required to search internal IPs and load balancer backend address pools for virtual machines in a VMAS. |
| Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/read | Required to search internal IPs and load balancer backend address pools for a virtual machine in a virtual machine scale set. |
| Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ ipconfigurations/publicipaddresses/read | Required to find public IPs for a virtual machine in a virtual machine scale set. |
| Microsoft.Network/virtualNetworks/read <br/> Microsoft.Network/virtualNetworks/subnets/read | Required to verify if a subnet exists for the internal load balancer in another resource group. |
| Microsoft.Compute/snapshots/delete <br/> Microsoft.Compute/snapshots/read <br/> Microsoft.Compute/snapshots/write | Required to configure snapshots for AzureDisk. |
| Microsoft.Compute/locations/vmSizes/read <br/> Microsoft.Compute/locations/operations/read | Required to find virtual machine sizes for finding AzureDisk volume limits. |

### Additional cluster identity permissions

The following additional permissions are needed by the cluster identity when creating a cluster with specific attributes. These permissions are not automatically assigned so you must add these permissions to the cluster identity after its created.

| Permission | Reason |
|---|---|
| Microsoft.Network/networkSecurityGroups/write <br/> Microsoft.Network/networkSecurityGroups/read | Required if using a network security group in another resource group. Required to configure security rules for a LoadBalancer service. |
| Microsoft.Network/virtualNetworks/subnets/read <br/> Microsoft.Network/virtualNetworks/subnets/join/action | Required if using a subnet in another resource group such as a custom VNET. |
| Microsoft.Network/routeTables/routes/read <br/> Microsoft.Network/routeTables/routes/write | Required if using a subnet associated with a route table in another resource group such as a custom VNET with a custom route table. Required to verify if a subnet already exists for the subnet in the other resource group. |
| Microsoft.Network/virtualNetworks/subnets/read | Required if using an internal load balancer in another resource group. Required to verify if a subnet already exists for the internal load balancer in the resource group. |

## Kubernetes role-based access control (Kubernetes RBAC)

To provide granular filtering of the actions that users can do, Kubernetes uses Kubernetes role-based access control (Kubernetes RBAC). This control mechanism lets you assign users, or groups of users, permission to do things like create or modify resources, or view logs from running application workloads. These permissions can be scoped to a single namespace, or granted across the entire AKS cluster. With Kubernetes RBAC, you create *roles* to define permissions, and then assign those roles to users with *role bindings*.

For more information, see [Using Kubernetes RBAC authorization][kubernetes-rbac].

### Roles and ClusterRoles

Before you assign permissions to users with Kubernetes RBAC, you first define those permissions as a *Role*. Kubernetes roles *grant* permissions. There's no concept of a *deny* permission.

Roles are used to grant permissions within a namespace. If you need to grant permissions across the entire cluster, or to cluster resources outside a given namespace, you can instead use *ClusterRoles*.

A ClusterRole works in the same way to grant permissions to resources, but can be applied to resources across the entire cluster, not a specific namespace.

### RoleBindings and ClusterRoleBindings

Once roles are defined to grant permissions to resources, you assign those Kubernetes RBAC permissions with a *RoleBinding*. If your AKS cluster [integrates with Azure Active Directory (Azure AD)](#azure-active-directory-integration), bindings are how those Azure AD users are granted permissions to perform actions within the cluster, see how in [Control access to cluster resources using Kubernetes role-based access control and Azure Active Directory identities](azure-ad-rbac.md).

Role bindings are used to assign roles for a given namespace. This approach lets you logically segregate a single AKS cluster, with users only able to access the application resources in their assigned namespace. If you need to bind roles across the entire cluster, or to cluster resources outside a given namespace, you can instead use *ClusterRoleBindings*.

A ClusterRoleBinding works in the same way to bind roles to users, but can be applied to resources across the entire cluster, not a specific namespace. This approach lets you grant administrators or support engineers access to all resources in the AKS cluster.


> [!NOTE]
> Any cluster actions taken by Microsoft/AKS are made with user consent under a built-in Kubernetes role `aks-service` and built-in role binding `aks-service-rolebinding`. This role enables AKS to troubleshoot and diagnose cluster issues, but can't modify permissions nor create roles or role bindings, or other high privilege actions. Role access is only enabled under active support tickets with just-in-time (JIT) access. Read more about [AKS support policies](support-policies.md).


### Kubernetes service accounts

One of the primary user types in Kubernetes is a *service account*. A service account exists in, and is managed by, the Kubernetes API. The credentials for service accounts are stored as Kubernetes secrets, which allows them to be used by authorized pods to communicate with the API Server. Most API requests provide an authentication token for a service account or a normal user account.

Normal user accounts allow more traditional access for human administrators or developers, not just services, and processes. Kubernetes itself doesn't provide an identity management solution where regular user accounts and passwords are stored. Instead, external identity solutions can be integrated into Kubernetes. For AKS clusters, this integrated identity solution is Azure Active Directory.

For more information on the identity options in Kubernetes, see [Kubernetes authentication][kubernetes-authentication].

## Azure Active Directory integration

The security of AKS clusters can be enhanced with the integration of Azure Active Directory (AD). Built on decades of enterprise identity management, Azure AD is a multi-tenant, cloud-based directory, and identity management service that combines core directory services, application access management, and identity protection. With Azure AD, you can integrate on-premises identities into AKS clusters to provide a single source for account management and security.

![Azure Active Directory integration with AKS clusters](media/concepts-identity/aad-integration.png)

With Azure AD-integrated AKS clusters, you can grant users or groups access to Kubernetes resources within a namespace or across the cluster. To obtain a `kubectl` configuration context, a user can run the [az aks get-credentials][az-aks-get-credentials] command. When a user then interacts with the AKS cluster with `kubectl`, they're prompted to sign in with their Azure AD credentials. This approach provides a single source for user account management and password credentials. The user can only access the resources as defined by the cluster administrator.

Azure AD authentication is provided to AKS clusters with OpenID Connect. OpenID Connect is an identity layer built on top of the OAuth 2.0 protocol. For more information on OpenID Connect, see the [Open ID connect documentation][openid-connect]. From inside of the Kubernetes cluster, [Webhook Token Authentication][webhook-token-docs] is used to verify authentication tokens. Webhook token authentication is configured and managed as part of the AKS cluster.

### Webhook and API server

![Webhook and API server authentication flow](media/concepts-identity/auth-flow.png)

As shown in the graphic above, the API server calls the AKS webhook server and performs the following steps:

1. The Azure AD client application is used by kubectl to sign in users with [OAuth 2.0 device authorization grant flow](../active-directory/develop/v2-oauth2-device-code.md).
2. Azure AD provides an access_token, id_token, and a refresh_token.
3. The user makes a request to kubectl with an access_token from kubeconfig.
4. Kubectl sends the access_token to API Server.
5. The API Server is configured with the Auth WebHook Server to perform validation.
6. The authentication webhook server confirms the JSON Web Token signature is valid by checking the Azure AD public signing key.
7. The server application uses user-provided credentials to query group memberships of the logged-in user from the MS Graph API.
8. A response is sent to the API Server with user information such as the user principal name (UPN) claim of the access token, and the group membership of the user based on the object ID.
9. The API performs an authorization decision based on the Kubernetes Role/RoleBinding.
10. Once authorized, the API server returns a response to kubectl.
11. Kubectl provides feedback to the user.
 
**Learn how to integrate AKS with AAD [here](managed-aad.md).**

## Azure role-based access control (Azure RBAC)

Azure RBAC is an authorization system built on [Azure Resource Manager](../azure-resource-manager/management/overview.md) that provides fine-grained access management of Azure resources.

 Azure RBAC is designed to work on resources within your Azure subscription while Kubernetes RBAC is designed to work on Kubernetes resources within your AKS cluster. 

With Azure RBAC, you create a *role definition* that outlines the permissions to be applied. A user or group is then assigned this role definition via a *role assignment* for a particular *scope*, which could be an individual resource, a resource group, or across the subscription.

For more information, see [What is Azure role-based access control (Azure RBAC)?][azure-rbac]

There are two levels of access needed to fully operate an AKS cluster: 
1. [Access the AKS resource in your Azure subscription](#azure-rbac-to-authorize-access-to-the-aks-resource). This process allows you to control things scaling or upgrading your cluster using the AKS APIs as well as pull your kubeconfig.
2. Access to the Kubernetes API. This access is controlled either by [Kubernetes RBAC](#kubernetes-role-based-access-control-kubernetes-rbac) (traditionally) or by [integrating Azure RBAC with AKS for Kubernetes authorization](#azure-rbac-for-kubernetes-authorization-preview)

### Azure RBAC to authorize access to the AKS resource

With Azure RBAC, you can provide your users (or identities) with granular access to AKS resources across one or more subscriptions. For example, you could have the [Azure Kubernetes Service Contributor role](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-contributor-role) that allows you to do actions like scale and upgrade your cluster. While another user could have the [Azure Kubernetes Service Cluster Admin role](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-admin-role) that only gives permission to pull the Admin kubeconfig.

Alternatively you could give your user the general [Contributor](../role-based-access-control/built-in-roles.md#contributor) role, which would encompass the above permissions and every action possible on the AKS resource with the exception of managing permissions itself.

See more how to use Azure RBAC to secure the access to the kubeconfig file that gives access to the Kubernetes API [here](control-kubeconfig-access.md).

### Azure RBAC for Kubernetes Authorization (Preview)

With the Azure RBAC integration, AKS will use a Kubernetes Authorization webhook server to enable you to manage permissions and assignments of Azure AD-integrated K8s cluster resources using Azure role definition and role assignments.

![Azure RBAC for Kubernetes authorization flow](media/concepts-identity/azure-rbac-k8s-authz-flow.png)

As shown on the above diagram, when using the Azure RBAC integration all requests to the Kubernetes API will follow the same authentication flow as explained on the [Azure Active Directory integration section](#azure-active-directory-integration). 

But after that, instead of solely relying on Kubernetes RBAC for Authorization, the request is actually going to be authorized by Azure, as long as the identity that made the request exists in AAD. If the identity doesn't exist in AAD, for example a Kubernetes service account, then the Azure RBAC won't kick in, and it will be the normal Kubernetes RBAC.

In this scenario you could give users one of the four built-in roles, or create custom roles as you would do with Kubernetes roles but in this case using the Azure RBAC mechanisms and APIs. 

This feature will allow you to, for example, not only give users permissions to the AKS resource across subscriptions but set up and give them the role and permissions that they will have inside each of those clusters that controls the access to the Kubernetes API. For example, you can grant the `Azure Kubernetes Service RBAC Viewer` role on the subscription scope and its recipient will be able to list and get all Kubernetes objects from all clusters, but not modify them.

> [!IMPORTANT]
> Please note that you need to enable Azure RBAC for Kubernetes authorization before using this feature. For more details and step by step guidance, [see here](manage-azure-rbac.md).

#### Built-in roles

AKS provides the following four built-in roles. They are similar to the [Kubernetes built-in roles](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles) but with a few differences like supporting CRDs. For the full list of actions allowed by each built-in role, see [here](../role-based-access-control/built-in-roles.md).

| Role                                | Description  |
|-------------------------------------|--------------|
| Azure  Kubernetes Service RBAC Viewer  | Allows read-only access to see most objects in a namespace. It doesn't allow viewing roles or role bindings. This role doesn't allow viewing `Secrets`, since reading the contents of Secrets enables access to `ServiceAccount` credentials in the namespace, which would allow API access as any `ServiceAccount` in the namespace (a form of privilege escalation)  |
| Azure Kubernetes Service RBAC  Writer | Allows read/write access to most objects in a namespace. This role doesn't allow viewing or modifying roles or role bindings. However, this role allows accessing `Secrets` and running Pods as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace. |
| Azure Kubernetes Service RBAC Admin  | Allows admin access, intended to be granted within a namespace. Allows read/write access to most resources in a namespace (or cluster scope), including the ability to create roles and role bindings within the namespace. This role doesn't allow write access to resource quota or to the namespace itself. |
| Azure Kubernetes Service RBAC Cluster Admin  | Allows super-user access to perform any action on any resource. It gives full control over every resource in the cluster and in all namespaces. |


## Summary

This table summarizes the ways users can authenticate to Kubernetes when Azure AD integration is enabled.  In all cases, the user's sequence of commands is:
1. Run `az login` to authenticate to Azure.
1. Run `az aks get-credentials` to download credentials for the cluster into `.kube/config`.
1. Run `kubectl` commands (the first of which may trigger browser-based authentication to authenticate to the cluster, as described in the following table).

The Role Grant referred to in the second column is the Azure RBAC role grant shown on the **Access Control** tab in the Azure portal. The Cluster Admin Azure AD Group is shown on the **Configuration** tab in the portal (or with parameter name `--aad-admin-group-object-ids` in the Azure CLI).

| Description        | Role grant required| Cluster admin Azure AD group(s) | When to use |
| -------------------|------------|----------------------------|-------------|
| Legacy admin login using client certificate| **Azure Kubernetes Admin Role**. This role allows `az aks get-credentials` to be used with the `--admin` flag, which downloads a [legacy (non-Azure AD) cluster admin certificate](control-kubeconfig-access.md) into the user's `.kube/config`. This is the only purpose of "Azure Kubernetes Admin Role".|n/a|If you're permanently blocked by not having access to a valid Azure AD group with access to your cluster.| 
| Azure AD with manual (Cluster)RoleBindings| **Azure Kubernetes User Role**. The "User" role allows `az aks get-credentials` to be used without the `--admin` flag. (This is the only purpose of "Azure Kubernetes User Role".) The result, on an Azure AD-enabled cluster, is the download of [an empty entry](control-kubeconfig-access.md) into `.kube/config`, which triggers browser-based authentication when it's first used by `kubectl`.| User is not in any of these groups. Because the user is not in any Cluster Admin groups, their rights will be controlled entirely by any RoleBindings or ClusterRoleBindings that have been set up by cluster admins. The (Cluster)RoleBindings [nominate Azure AD users or Azure AD groups](azure-ad-rbac.md) as their `subjects`. If no such bindings have been set up, the user will not be able to excute any `kubectl` commands.|If you want fine-grained access control, and you're not using Azure RBAC for Kubernetes Authorization. Note that the user who sets up the bindings must log in by one of the other methods listed in this table.|
| Azure AD by member of admin group| Same as above|User is a member of one of the groups listed here. AKS automatically generates a ClusterRoleBinding that binds all of the listed groups to the `cluster-admin` Kubernetes role. So users in these groups can run all `kubectl` commands as `cluster-admin`.|If you want to conveniently grant users full admin rights, and are _not_ using Azure RBAC for Kubernetes authorization.|
| Azure AD with Azure RBAC for Kubernetes Authorization|Two roles: First, **Azure Kubernetes User Role** (as above). Second, one of the "Azure Kubernetes Service **RBAC**..." roles listed above, or your own custom alternative.|The admin roles field on the Configuration tab is irrelevant when Azure RBAC for Kubernetes Authorization is enabled.|You are using Azure RBAC for Kubernetes authorization. This approach gives you fine-grained control, without the need to set up RoleBindings or ClusterRoleBindings.|

## Next steps

- To get started with Azure AD and Kubernetes RBAC, see [Integrate Azure Active Directory with AKS][aks-aad].
- For associated best practices, see [Best practices for authentication and authorization in AKS][operator-best-practices-identity].
- To get started with Azure RBAC for Kubernetes Authorization, see [Use Azure RBAC to authorize access within the Azure Kubernetes Service (AKS) Cluster](manage-azure-rbac.md).
- To get started securing your kubeconfig file, see [Limit access to cluster configuration file](control-kubeconfig-access.md)

For more information on core Kubernetes and AKS concepts, see the following articles:

- [Kubernetes / AKS clusters and workloads][aks-concepts-clusters-workloads]
- [Kubernetes / AKS security][aks-concepts-security]
- [Kubernetes / AKS virtual networks][aks-concepts-network]
- [Kubernetes / AKS storage][aks-concepts-storage]
- [Kubernetes / AKS scale][aks-concepts-scale]

<!-- LINKS - External -->
[kubernetes-authentication]: https://kubernetes.io/docs/reference/access-authn-authz/authentication
[webhook-token-docs]: https://kubernetes.io/docs/reference/access-authn-authz/authentication/#webhook-token-authentication
[kubernetes-rbac]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/

<!-- LINKS - Internal -->
[openid-connect]: ../active-directory/develop/v2-protocols-oidc.md
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[azure-rbac]: ../role-based-access-control/overview.md
[aks-aad]: managed-aad.md
[aks-concepts-clusters-workloads]: concepts-clusters-workloads.md
[aks-concepts-security]: concepts-security.md
[aks-concepts-scale]: concepts-scale.md
[aks-concepts-storage]: concepts-storage.md
[aks-concepts-network]: concepts-network.md
[operator-best-practices-identity]: operator-best-practices-identity.md
[upgrade-per-cluster]: ../azure-monitor/containers/container-insights-update-metrics.md#upgrade-per-cluster-using-azure-cli
