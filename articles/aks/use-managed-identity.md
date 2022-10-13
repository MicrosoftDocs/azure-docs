---
title: Use a managed identity in Azure Kubernetes Service
description: Learn how to use a system-assigned or user-assigned managed identity in Azure Kubernetes Service (AKS)
ms.topic: article
ms.date: 09/27/2022
---

# Use a managed identity in Azure Kubernetes Service

An Azure Kubernetes Service (AKS) cluster requires an identity to access Azure resources like load balancers and managed disks. This identity can be either a managed identity or a service principal. By default, when you create an AKS cluster a system-assigned managed identity is automatically created. The identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. For more information about managed identities in Azure AD, see [Managed identities for Azure resources][managed-identity-resources-overview].

To use a [service principal](kubernetes-service-principal.md), you have to create one, as AKS does not create one automatically. Clusters using a service principal eventually expire and the service principal must be renewed to keep the cluster working. Managing service principals adds complexity, thus it's easier to use managed identities instead. The same permission requirements apply for both service principals and managed identities.

Managed identities are essentially a wrapper around service principals, and make their management simpler. Managed identities use certificate-based authentication, and each managed identities credential has an expiration of 90 days and it's rolled after 45 days. AKS uses both system-assigned and user-assigned managed identity types, and these identities are immutable.

## Prerequisites

Azure CLI version 2.23.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Limitations

* Tenants move or migrate a managed identity-enabled cluster isn't supported.
* If the cluster has Azure AD pod-managed identity (`aad-pod-identity`) enabled, Node-Managed Identity (NMI) pods modify the nodes'
  iptables to intercept calls to the Azure Instance Metadata (IMDS) endpoint. This configuration means any
  request made to the Metadata endpoint is intercepted by NMI even if the pod doesn't use
  `aad-pod-identity`. AzurePodIdentityException CRD can be configured to inform `aad-pod-identity`
  that any requests to the Metadata endpoint originating from a pod that matches labels defined in
  CRD should be proxied without any processing in NMI. The system pods with
  `kubernetes.azure.com/managedby: aks` label in _kube-system_ namespace should be excluded in
  `aad-pod-identity` by configuring the AzurePodIdentityException CRD. For more information, see
  [Disable aad-pod-identity for a specific pod or application](https://azure.github.io/aad-pod-identity/docs/configure/application_exception).
  To configure an exception, install the
  [mic-exception YAML](https://github.com/Azure/aad-pod-identity/blob/master/deploy/infra/mic-exception.yaml).

> [!NOTE]
> If you are considering implementing [Azure AD pod-managed identity][aad-pod-identity] on your AKS cluster,
> we recommend you first review the [workload identity overview][workload-identity-overview] article to understand our
> recommendations and options to set up your cluster to use an Azure AD workload identity (preview).
> This authentication method replaces pod-managed identity (preview), which integrates with the Kubernetes native capabilities
> to federate with any external identity providers.

## Summary of managed identities

AKS uses several managed identities for built-in services and add-ons.

| Identity                       | Name    | Use case | Default permissions | Bring your own identity
|----------------------------|-----------|----------|
| Control plane | AKS Cluster Name | Used by AKS control plane components to manage cluster resources including ingress load balancers and AKS managed public IPs, Cluster Autoscaler, Azure Disk & File CSI drivers | Contributor role for Node resource group | Supported
| Kubelet | AKS Cluster Name-agentpool | Authentication with Azure Container Registry (ACR) | NA (for kubernetes v1.15+) | Supported
| Add-on | AzureNPM | No identity required | NA | No
| Add-on | AzureCNI network monitoring | No identity required | NA | No
| Add-on | azure-policy (gatekeeper) | No identity required | NA | No
| Add-on | azure-policy | No identity required | NA | No
| Add-on | Calico | No identity required | NA | No
| Add-on | Dashboard | No identity required | NA | No
| Add-on | HTTPApplicationRouting | Manages required network resources | Reader role for node resource group, contributor role for DNS zone | No
| Add-on | Ingress application gateway | Manages required network resources| Contributor role for node resource group | No
| Add-on | omsagent | Used to send AKS metrics to Azure Monitor | Monitoring Metrics Publisher role | No
| Add-on | Virtual-Node (ACIConnector) | Manages required network resources for Azure Container Instances (ACI) | Contributor role for node resource group | No
| OSS project | aad-pod-identity | Enables applications to access cloud resources securely with Microsoft Azure Active Directory (Azure AD) | NA | Steps to grant permission at https://github.com/Azure/aad-pod-identity#role-assignment.

## Create an AKS cluster using a managed identity

> [!NOTE]
> AKS will create a system-assigned kubelet identity in the Node resource group if you do not [specify your own kubelet managed identity][Use a pre-created kubelet managed identity].

You can create an AKS cluster using a system-assigned managed identity by running the following CLI command.

First, create an Azure resource group:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location westus2
```

Then, create an AKS cluster:

```azurecli-interactive
az aks create -g myResourceGroup -n myManagedCluster --enable-managed-identity
```

Once the cluster is created, you can then deploy your application workloads to the new cluster and interact with it just as you've done with service-principal-based AKS clusters.

Finally, get credentials to access the cluster:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
```

## Update an AKS cluster to use a managed identity

To update an AKS cluster currently using a service principal to work with a system-assigned managed identity, run the following CLI command.

```azurecli-interactive
az aks update -g <RGName> -n <AKSName> --enable-managed-identity
```

> [!NOTE]
> An update will only work if there is an actual VHD update to consume. If you are running the latest VHD, you'll need to wait until the next VHD is available in order to perform the update.
>

> [!NOTE]
> After updating, your cluster's control plane and addon pods, they use the managed identity, but kubelet will continue using a service principal until you upgrade your agentpool. Perform an `az aks nodepool upgrade --node-image-only` on your nodes to complete the update to a managed identity.
>
> If your cluster was using `--attach-acr` to pull from image from Azure Container Registry, after updating your cluster to a managed identity, you need to rerun `az aks update --attach-acr <ACR Resource ID>` to let the newly created kubelet used for managed identity get the permission to pull from ACR. Otherwise, you won't be able to pull from ACR after the upgrade.
>
> The Azure CLI will ensure your addon's permission is correctly set after migrating, if you're not using the Azure CLI to perform the migrating operation, you'll need to handle the addon identity's permission by yourself. Here is one example using an [Azure Resource Manager](../role-based-access-control/role-assignments-template.md) template.

> [!WARNING]
> A nodepool upgrade will cause downtime for your AKS cluster as the nodes in the nodepools will be cordoned/drained and then reimaged.

## Add role assignment for control plane identity

When creating and using your own VNet, attached Azure disk, static IP address, route table or user-assigned kubelet identity where the resources are outside of the worker node resource group, the Azure CLI adds the role assignment automatically. If you are using an ARM template or other method, you need to use the Principal ID of the cluster managed identity to perform a role assignment.

> [!NOTE]
> If you are not using the Azure CLI but using your own VNet, attached Azure disk, static IP address, route table or user-assigned kubelet identity that are outside of the worker node resource group, it's recommended to use [user-assigned control plane identity][Bring your own control plane managed identity]. For system-assigned control plane identity, we cannot get the identity ID before creating cluster, which delays role assignment from taking effect.

### Get the Principal ID of control plane identity

You can find existing identity's Principal ID by running the following command:

```azurecli-interactive
az identity show --ids <identity-resource-id>
```

The output should resemble the following:

```output
{
  "clientId": "<client-id>",
  "id": "/subscriptions/<subscriptionid>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity",
  "location": "eastus",
  "name": "myIdentity",
  "principalId": "<principal-id>",
  "resourceGroup": "myResourceGroup",
  "tags": {},
  "tenantId": "<tenant-id>",
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

### Add role assignment

For Vnet, attached Azure disk, static IP address, route table which are outside the default worker node resource group, you need to assign the `Contributor` role on custom resource group.

```azurecli-interactive
az role assignment create --assignee <control-plane-identity-principal-id> --role "Contributor" --scope "<custom-resource-group-resource-id>"
```

Example:

```azurecli-interactive
az role assignment create --assignee 22222222-2222-2222-2222-222222222222 --role "Contributor" --scope "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/custom-resource-group"
```

For user-assigned kubelet identity which is outside the default worker node resource group, you need to assign the `Managed Identity Operator`on kubelet identity.

```azurecli-interactive
az role assignment create --assignee <control-plane-identity-principal-id> --role "Managed Identity Operator" --scope "<kubelet-identity-resource-id>"
```

Example:

```azurecli-interactive
az role assignment create --assignee 22222222-2222-2222-2222-222222222222 --role "Managed Identity Operator" --scope "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myKubeletIdentity"
```

> [!NOTE]
> Permission granted to your cluster's managed identity used by Azure may take up 60 minutes to populate.

## Bring your own control plane managed identity

A custom control plane managed identity enables access to be granted to the existing identity prior to cluster creation. This feature enables scenarios such as using a custom VNET or outboundType of UDR with a pre-created managed identity.

> [!NOTE]
> USDOD Central, USDOD East, USGov Iowa regions in Azure US Government cloud aren't currently supported.
>
> AKS will create a system-assigned kubelet identity in the Node resource group if you do not [specify your own kubelet managed identity][Use a pre-created kubelet managed identity].

If you don't have a managed identity, you should create one by running the [az identity][az-identity-create] command.

```azurecli-interactive
az identity create --name myIdentity --resource-group myResourceGroup
```

The output should resemble the following:

```output
{                                  
  "clientId": "<client-id>",
  "clientSecretUrl": "<clientSecretUrl>",
  "id": "/subscriptions/<subscriptionid>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity", 
  "location": "westus2",
  "name": "myIdentity",
  "principalId": "<principal-id>",
  "resourceGroup": "myResourceGroup",                       
  "tags": {},
  "tenantId": "<tenant-id>",
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

Run the following command to create a cluster with your existing identity:

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myManagedCluster \
    --network-plugin azure \
    --vnet-subnet-id <subnet-id> \
    --docker-bridge-address 172.17.0.1/16 \
    --dns-service-ip 10.2.0.10 \
    --service-cidr 10.2.0.0/24 \
    --enable-managed-identity \
    --assign-identity <identity-resource-id>
```

A successful cluster creation using your own managed identity should resemble the following **userAssignedIdentities** profile information:

```output
 "identity": {
   "principalId": null,
   "tenantId": null,
   "type": "UserAssigned",
   "userAssignedIdentities": {
     "/subscriptions/<subscriptionid>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity": {
       "clientId": "<client-id>",
       "principalId": "<principal-id>"
     }
   }
 },
```

## Use a pre-created kubelet managed identity

A Kubelet identity enables access granted to the existing identity prior to cluster creation. This feature enables scenarios such as connection to ACR with a pre-created managed identity.

### Prerequisites

Azure CLI version 2.26.0 or later installed. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

### Limitations

* Only works with a user-assigned managed cluster.
* China East and China North regions in Azure China 21Vianet aren't currently supported.

### Create user-assigned managed identities

If you don't have a control plane managed identity, you can create by running the following [az identity create][az-identity-create] command:

```azurecli-interactive
az identity create --name myIdentity --resource-group myResourceGroup
```

The output should resemble the following:

```output
{                                  
  "clientId": "<client-id>",
  "clientSecretUrl": "<clientSecretUrl>",
  "id": "/subscriptions/<subscriptionid>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity", 
  "location": "westus2",
  "name": "myIdentity",
  "principalId": "<principal-id>",
  "resourceGroup": "myResourceGroup",                       
  "tags": {},
  "tenantId": "<tenant-id>",
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

If you don't have a kubelet managed identity, you can create one by running the following [az identity create][az-identity-create] command:

```azurecli-interactive
az identity create --name myKubeletIdentity --resource-group myResourceGroup
```

The output should resemble the following:

```output
{
  "clientId": "<client-id>",
  "clientSecretUrl": "<clientSecretUrl>",
  "id": "/subscriptions/<subscriptionid>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myKubeletIdentity", 
  "location": "westus2",
  "name": "myKubeletIdentity",
  "principalId": "<principal-id>",
  "resourceGroup": "myResourceGroup",                       
  "tags": {},
  "tenantId": "<tenant-id>",
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

### Create a cluster using user-assigned kubelet identity

Now you can use the following command to create your AKS cluster with your existing identities. Provide the control plane identity resource ID via `assign-identity` and the kubelet managed identity via `assign-kubelet-identity`:

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myManagedCluster \
    --network-plugin azure \
    --vnet-subnet-id <subnet-id> \
    --docker-bridge-address 172.17.0.1/16 \
    --dns-service-ip 10.2.0.10 \
    --service-cidr 10.2.0.0/24 \
    --enable-managed-identity \
    --assign-identity <identity-resource-id> \
    --assign-kubelet-identity <kubelet-identity-resource-id>
```

A successful AKS cluster creation using your own kubelet managed identity should resemble the following output:

```output
  "identity": {
    "principalId": null,
    "tenantId": null,
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/<subscriptionid>/resourcegroups/resourcegroups/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity": {
        "clientId": "<client-id>",
        "principalId": "<principal-id>"
      }
    }
  },
  "identityProfile": {
    "kubeletidentity": {
      "clientId": "<client-id>",
      "objectId": "<object-id>",
      "resourceId": "/subscriptions/<subscriptionid>/resourcegroups/resourcegroups/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myKubeletIdentity"
    }
  },
```

### Update an existing cluster using kubelet identity

Update kubelet identity on an existing AKS cluster with your existing identities.

> [!WARNING]
> Updating kubelet managed identity upgrades Nodepool, which causes downtime for your AKS cluster as the nodes in the nodepools will be cordoned/drained and then reimaged.

> [!NOTE]
> If your cluster was using `--attach-acr` to pull from image from Azure Container Registry, after updating your cluster kubelet identity, you need to rerun `az aks update --attach-acr <ACR Resource ID>` to let the newly created kubelet used for managed identity get the permission to pull from ACR. Otherwise, you won't be able to pull from ACR after the upgrade.

#### Make sure the CLI version is 2.37.0 or later

```azurecli-interactive
# Check the version of Azure CLI modules 
az version

# Upgrade the version to make sure it is 2.37.0 or later
az upgrade
```

#### Get the current control plane identity for your AKS cluster

Confirm your AKS cluster is using user-assigned control plane identity with the following CLI command:

```azurecli-interactive
az aks show -g <RGName> -n <ClusterName> --query "servicePrincipalProfile"
```

If the cluster is using a managed identity, the output shows `clientId` with a value of **msi**. A cluster using a service principal shows an object ID. For example:

```output
{
  "clientId": "msi"
}
```

After verifying the cluster is using a managed identity, you can find the control plane identity's resource ID by running the following command:

```azurecli-interactive
az aks show -g <RGName> -n <ClusterName> --query "identity"
```

For user-assigned control plane identity, the output should look like:

```output
{
  "principalId": null,
  "tenantId": null,
  "type": "UserAssigned",
  "userAssignedIdentities": <identity-resource-id>
      "clientId": "<client-id>",
      "principalId": "<principal-id>"
},
```

#### Updating your cluster with kubelet identity 

If you don't have a kubelet managed identity, you can create one by running the following [az identity create][az-identity-create] command:

```azurecli-interactive
az identity create --name myKubeletIdentity --resource-group myResourceGroup
```

The output should resemble the following:

```output
{
  "clientId": "<client-id>",
  "clientSecretUrl": "<clientSecretUrl>",
  "id": "/subscriptions/<subscriptionid>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myKubeletIdentity", 
  "location": "westus2",
  "name": "myKubeletIdentity",
  "principalId": "<principal-id>",
  "resourceGroup": "myResourceGroup",                       
  "tags": {},
  "tenantId": "<tenant-id>",
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

Now you can use the following command to update your cluster with your existing identities. Provide the control plane identity resource ID via `assign-identity` and the kubelet managed identity via `assign-kubelet-identity`:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myManagedCluster \
    --enable-managed-identity \
    --assign-identity <identity-resource-id> \
    --assign-kubelet-identity <kubelet-identity-resource-id>
```

A successful cluster update using your own kubelet managed identity contains the following output:

```output
  "identity": {
    "principalId": null,
    "tenantId": null,
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/<subscriptionid>/resourcegroups/resourcegroups/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity": {
        "clientId": "<client-id>",
        "principalId": "<principal-id>"
      }
    }
  },
  "identityProfile": {
    "kubeletidentity": {
      "clientId": "<client-id>",
      "objectId": "<object-id>",
      "resourceId": "/subscriptions/<subscriptionid>/resourcegroups/resourcegroups/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myKubeletIdentity"
    }
  },
```

## Next steps

Use [Azure Resource Manager templates ][aks-arm-template] to create a managed identity-enabled cluster.

<!-- LINKS - external -->
[aks-arm-template]: /azure/templates/microsoft.containerservice/managedclusters

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-identity-create]: /cli/azure/identity#az_identity_create
[az-identity-list]: /cli/azure/identity#az_identity_list
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[managed-identity-resources-overview]: ../active-directory/managed-identities-azure-resources/overview.md
[Bring your own control plane managed identity]: use-managed-identity.md#bring-your-own-control-plane-managed-identity
[Use a pre-created kubelet managed identity]: use-managed-identity.md#use-a-pre-created-kubelet-managed-identity
[workload-identity-overview]: workload-identity-overview.md
[aad-pod-identity]: use-azure-ad-pod-identity.md