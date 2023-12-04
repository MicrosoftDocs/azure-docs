---
title: Use Microsoft Entra pod-managed identities in Azure Kubernetes Service (Preview)
description: Learn how to use Microsoft Entra pod-managed identities in Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 08/15/2023
---

# Use Microsoft Entra pod-managed identities in Azure Kubernetes Service (Preview)

Microsoft Entra pod-managed identities use Kubernetes primitives to associate [managed identities for Azure resources][az-managed-identities] and identities in Microsoft Entra ID with pods. Administrators create identities and bindings as Kubernetes primitives that allow pods to access Azure resources that rely on Microsoft Entra ID as an identity provider.

> [!IMPORTANT]
> We recommend you review [Microsoft Entra Workload ID][workload-identity-overview].
> This authentication method replaces pod-managed identity (preview), which integrates with the
> Kubernetes native capabilities to federate with any external identity providers on behalf of the
> application.
>
> The open source Microsoft Entra pod-managed identity (preview) in Azure Kubernetes Service has been deprecated as of 10/24/2022, and the project will be archived in Sept. 2023. For more information, see the [deprecation notice](https://github.com/Azure/aad-pod-identity#-announcement). The AKS Managed add-on begins deprecation in Sept. 2024.
>
> To disable the AKS Managed add-on, use the following command: `az feature unregister --namespace "Microsoft.ContainerService" --name "EnablePodIdentityPreview"`.

## Before you begin

You must have the Azure CLI version 2.20.0 or later installed.

## Limitations

* A maximum of 200 pod-managed identities are allowed for a cluster.
* A maximum of 200 pod-managed identity exceptions are allowed for a cluster.
* Pod-managed identities are available on Linux node pools only.
* This feature is only supported for Virtual Machine Scale Sets backed clusters.

## Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

## Register the 'EnablePodIdentityPreview' feature flag

Register the `EnablePodIdentityPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "EnablePodIdentityPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "EnablePodIdentityPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Operation mode options

Microsoft Entra pod-managed identity supports two modes of operation:

* **Standard Mode**: In this mode, the following two components are deployed to the AKS cluster: 
  * [Managed Identity Controller (MIC)](https://azure.github.io/aad-pod-identity/docs/concepts/mic/): An MIC is a Kubernetes controller that watches for changes to pods, [AzureIdentity](https://azure.github.io/aad-pod-identity/docs/concepts/azureidentity/) and [AzureIdentityBinding](https://azure.github.io/aad-pod-identity/docs/concepts/azureidentitybinding/) through the Kubernetes API Server. When it detects a relevant change, the MIC adds or deletes [AzureAssignedIdentity](https://azure.github.io/aad-pod-identity/docs/concepts/azureassignedidentity/) as needed. Specifically, when a pod is scheduled, the MIC assigns the managed identity on Azure to the underlying Virtual Machine Scale Set used by the node pool during the creation phase. When all pods using the identity are deleted, it removes the identity from the Virtual Machine Scale Set of the node pool, unless the same managed identity is used by other pods. The MIC takes similar actions when AzureIdentity or AzureIdentityBinding are created or deleted.
  * [Node Managed Identity (NMI)](https://azure.github.io/aad-pod-identity/docs/concepts/nmi/): NMI is a pod that runs as a DaemonSet on each node in the AKS cluster. NMI intercepts security token requests to the [Azure Instance Metadata Service](../virtual-machines/linux/instance-metadata-service.md?tabs=linux) on each node, redirect them to itself and validates if the pod has access to the identity it's requesting a token for and fetch the token from the Microsoft Entra tenant on behalf of the application.
* **Managed Mode**: This mode offers only NMI. When installed via the AKS cluster add-on, Azure manages creation of Kubernetes primitives (AzureIdentity and AzureIdentityBinding) and identity assignment in response to CLI commands by the user. Otherwise, if installed via Helm chart, the identity needs to be manually assigned and managed by the user. For more information, see [Pod identity in managed mode](https://azure.github.io/aad-pod-identity/docs/configure/pod_identity_in_managed_mode/).

When you install the Microsoft Entra pod-managed identity via Helm chart or YAML manifest as shown in the [Installation Guide](https://azure.github.io/aad-pod-identity/docs/getting-started/installation/), you can choose between the `standard` and `managed` mode. If you instead decide to install the Microsoft Entra pod-managed identity using the AKS cluster add-on as shown in this article, the setup will use the `managed` mode.

## Create an AKS cluster with Azure Container Networking Interface (CNI)

> [!NOTE]
> This is the default recommended configuration

Create an AKS cluster with Azure CNI and pod-managed identity enabled. The following commands use [az group create][az-group-create] to create a resource group named *myResourceGroup* and the [az aks create][az-aks-create] command to create an AKS cluster named *myAKSCluster* in the *myResourceGroup* resource group.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
az aks create -g myResourceGroup -n myAKSCluster --enable-pod-identity --network-plugin azure
```

Use [az aks get-credentials][az-aks-get-credentials] to sign in to your AKS cluster. This command also downloads and configures the `kubectl` client certificate on your development computer.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

> [!NOTE]
> When you enable pod-managed identity on your AKS cluster, an AzurePodIdentityException named *aks-addon-exception* is added to the *kube-system* namespace. An AzurePodIdentityException allows pods with certain labels to access the Azure Instance Metadata Service (IMDS) endpoint without being intercepted by the NMI server. The *aks-addon-exception* allows AKS first-party addons, such as Microsoft Entra pod-managed identity, to operate without having to manually configure an AzurePodIdentityException. Optionally, you can add, remove, and update an AzurePodIdentityException using `az aks pod-identity exception add`, `az aks pod-identity exception delete`, `az aks pod-identity exception update`, or `kubectl`.

## Update an existing AKS cluster with Azure CNI

Update an existing AKS cluster with Azure CNI to include pod-managed identity.

```azurecli-interactive
az aks update -g $MY_RESOURCE_GROUP -n $MY_CLUSTER --enable-pod-identity
```

<a name='using-kubenet-network-plugin-with-azure-active-directory-pod-managed-identities'></a>

## Using Kubenet network plugin with Microsoft Entra pod-managed identities

> [!IMPORTANT]
> Running Microsoft Entra pod-managed identity in a cluster with Kubenet is not a recommended configuration due to security concerns. Default Kubenet configuration fails to prevent ARP spoofing, which could be utilized by a pod to act as another pod and gain access to an identity it's not intended to have. Please follow the mitigation steps and configure policies before enabling Microsoft Entra pod-managed identity in a cluster with Kubenet.

### Mitigation

To mitigate the vulnerability at the cluster level, you can use the Azure built-in policy "Kubernetes cluster containers should only use allowed capabilities" to limit the CAP_NET_RAW attack.  

Add NET_RAW to "Required drop capabilities"

![image](https://user-images.githubusercontent.com/50749048/118558790-206b8880-b735-11eb-9e48-236b81116812.png)

If you are not using Azure Policy, you can use OpenPolicyAgent admission controller together with Gatekeeper validating webhook. Provided you have Gatekeeper already installed in your cluster, add the ConstraintTemplate of type K8sPSPCapabilities:

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper-library/master/library/pod-security-policy/capabilities/template.yaml
```

Add a template to limit the spawning of Pods with the NET_RAW capability:

```yml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sPSPCapabilities
metadata:
  name: prevent-net-raw
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
    excludedNamespaces:
      - "kube-system"
  parameters:
    requiredDropCapabilities: ["NET_RAW"]
```

## Create an AKS cluster with Kubenet network plugin

Create an AKS cluster with Kubenet network plugin and pod-managed identity enabled.

```azurecli-interactive
az aks create -g $MY_RESOURCE_GROUP -n $MY_CLUSTER --enable-pod-identity --enable-pod-identity-with-kubenet
```

## Update an existing AKS cluster with Kubenet network plugin

Update an existing AKS cluster with Kubenet network plugin to include pod-managed identity.

```azurecli-interactive
az aks update -g $MY_RESOURCE_GROUP -n $MY_CLUSTER --enable-pod-identity --enable-pod-identity-with-kubenet
```

## Create an identity

> [!IMPORTANT]
> You must have the relevant permissions (for example, Owner) on your subscription to create the identity.

Create an identity which will be used by the demo pod with [az identity create][az-identity-create] and set the *IDENTITY_CLIENT_ID* and *IDENTITY_RESOURCE_ID* variables.

```azurecli-interactive
az group create --name myIdentityResourceGroup --location eastus
export IDENTITY_RESOURCE_GROUP="myIdentityResourceGroup"
export IDENTITY_NAME="application-identity"
az identity create --resource-group ${IDENTITY_RESOURCE_GROUP} --name ${IDENTITY_NAME}
export IDENTITY_CLIENT_ID="$(az identity show -g ${IDENTITY_RESOURCE_GROUP} -n ${IDENTITY_NAME} --query clientId -otsv)"
export IDENTITY_RESOURCE_ID="$(az identity show -g ${IDENTITY_RESOURCE_GROUP} -n ${IDENTITY_NAME} --query id -otsv)"
```

## Assign permissions for the managed identity

The managed identity that will be assigned to the pod needs to be granted permissions that align with the actions it will be taking.

To run the demo, the *IDENTITY_CLIENT_ID* managed identity must have Virtual Machine Contributor permissions in the resource group that contains the Virtual Machine Scale Set of your AKS cluster.

```azurecli-interactive
# Obtain the name of the resource group containing the Virtual Machine Scale set of your AKS cluster, commonly called the node resource group
NODE_GROUP=$(az aks show -g myResourceGroup -n myAKSCluster --query nodeResourceGroup -o tsv)

# Obtain the id of the node resource group 
NODES_RESOURCE_ID=$(az group show -n $NODE_GROUP -o tsv --query "id")

# Create a role assignment granting your managed identity permissions on the node resource group
az role assignment create --role "Virtual Machine Contributor" --assignee "$IDENTITY_CLIENT_ID" --scope $NODES_RESOURCE_ID
```

## Create a pod identity

Create a pod-managed identity for the cluster using `az aks pod-identity add`.

```azurecli-interactive
export POD_IDENTITY_NAME="my-pod-identity"
export POD_IDENTITY_NAMESPACE="my-app"
az aks pod-identity add --resource-group myResourceGroup --cluster-name myAKSCluster --namespace ${POD_IDENTITY_NAMESPACE}  --name ${POD_IDENTITY_NAME} --identity-resource-id ${IDENTITY_RESOURCE_ID}
```

> [!NOTE]
> The "POD_IDENTITY_NAME" has to be a valid [DNS subdomain name] as defined in [RFC 1123].

> [!NOTE]
> When you assign the pod-managed identity by using `pod-identity add`, the Azure CLI attempts to grant the Managed Identity Operator role over the pod-managed identity (*IDENTITY_RESOURCE_ID*) to the cluster identity.

Azure will create an AzureIdentity resource in your cluster representing the identity in Azure, and an AzureIdentityBinding resource which connects the AzureIdentity to a selector. You can view these resources with

```azurecli-interactive
kubectl get azureidentity -n $POD_IDENTITY_NAMESPACE
kubectl get azureidentitybinding -n $POD_IDENTITY_NAMESPACE
```

## Run a sample application

For a pod to use Microsoft Entra pod-managed identity, the pod needs an *aadpodidbinding* label with a value that matches a selector from a *AzureIdentityBinding*. By default, the selector will match the name of the pod-managed identity, but it can also be set using the `--binding-selector` option when calling `az aks pod-identity add`.

To run a sample application using Microsoft Entra pod-managed identity, create a `demo.yaml` file with the following contents. Replace *POD_IDENTITY_NAME*, *IDENTITY_CLIENT_ID*, and *IDENTITY_RESOURCE_GROUP* with the values from the previous steps. Replace *SUBSCRIPTION_ID* with your subscription ID.

> [!NOTE]
> In the previous steps, you created the *POD_IDENTITY_NAME*, *IDENTITY_CLIENT_ID*, and *IDENTITY_RESOURCE_GROUP* variables. You can use a command such as `echo` to display the value you set for variables, for example `echo $POD_IDENTITY_NAME`.

```yml
apiVersion: v1
kind: Pod
metadata:
  name: demo
  labels:
    aadpodidbinding: $POD_IDENTITY_NAME
spec:
  containers:
  - name: demo
    image: mcr.microsoft.com/oss/azure/aad-pod-identity/demo:v1.6.3
    args:
      - --subscriptionid=$SUBSCRIPTION_ID
      - --clientid=$IDENTITY_CLIENT_ID
      - --resourcegroup=$IDENTITY_RESOURCE_GROUP
    env:
      - name: MY_POD_NAME
        valueFrom:
          fieldRef:
            fieldPath: metadata.name
      - name: MY_POD_NAMESPACE
        valueFrom:
          fieldRef:
            fieldPath: metadata.namespace
      - name: MY_POD_IP
        valueFrom:
          fieldRef:
            fieldPath: status.podIP
  nodeSelector:
    kubernetes.io/os: linux
```

Notice the pod definition has an *aadpodidbinding* label with a value that matches the name of the pod-managed identity you ran `az aks pod-identity add` in the previous step.

Deploy `demo.yaml` to the same namespace as your pod-managed identity using `kubectl apply`:

```bash
kubectl apply -f demo.yaml --namespace $POD_IDENTITY_NAMESPACE
```

Verify the sample application successfully runs using `kubectl logs`.

```bash
kubectl logs demo --follow --namespace $POD_IDENTITY_NAMESPACE
```

Verify that the logs show a token is successfully acquired and the *GET* operation is successful.

```output
...
successfully doARMOperations vm count 0
successfully acquired a token using the MSI, msiEndpoint(http://169.254.169.254/metadata/identity/oauth2/token)
successfully acquired a token, userAssignedID MSI, msiEndpoint(http://169.254.169.254/metadata/identity/oauth2/token) clientID(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
successfully made GET on instance metadata
...
```

## Run an application with multiple identities

To enable an application to use multiple identities, set the `--binding-selector` to the same selector when creating pod identities.

```azurecli-interactive
az aks pod-identity add --resource-group myResourceGroup --cluster-name myAKSCluster --namespace ${POD_IDENTITY_NAMESPACE}  --name ${POD_IDENTITY_NAME_1} --identity-resource-id ${IDENTITY_RESOURCE_ID_1} --binding-selector myMultiIdentitySelector
az aks pod-identity add --resource-group myResourceGroup --cluster-name myAKSCluster --namespace ${POD_IDENTITY_NAMESPACE}  --name ${POD_IDENTITY_NAME_2} --identity-resource-id ${IDENTITY_RESOURCE_ID_2} --binding-selector myMultiIdentitySelector
```

Then set the `aadpodidbinding` field in your pod YAML to the binding selector you specified.

```yml
apiVersion: v1
kind: Pod
metadata:
  name: demo
  labels:
    aadpodidbinding: myMultiIdentitySelector
...
```

## Disable pod-managed identity on an existing cluster

To disable pod-managed identity on an existing cluster, remove the pod-managed identities from the cluster. Then disable the feature on the cluster.

```azurecli
az aks pod-identity delete --name ${POD_IDENTITY_NAME} --namespace ${POD_IDENTITY_NAMESPACE} --resource-group myResourceGroup --cluster-name myAKSCluster
```

```azurecli
az aks update --resource-group myResourceGroup --name myAKSCluster --disable-pod-identity
```

## Clean up

To remove a Microsoft Entra pod-managed identity from your cluster, remove the sample application and the pod-managed identity from the cluster. Then remove the identity and the role assignment of cluster identity.

```bash
kubectl delete pod demo --namespace $POD_IDENTITY_NAMESPACE
```

```azurecli
az aks pod-identity delete --name ${POD_IDENTITY_NAME} --namespace ${POD_IDENTITY_NAMESPACE} --resource-group myResourceGroup --cluster-name myAKSCluster
```

```azurecli
az identity delete -g ${IDENTITY_RESOURCE_GROUP} -n ${IDENTITY_NAME}
```

```azurecli
az role assignment delete --role "Managed Identity Operator" --assignee "$IDENTITY_CLIENT_ID" --scope "$IDENTITY_RESOURCE_ID"
```

## Next steps

For more information on managed identities, see [Managed identities for Azure resources][az-managed-identities].

<!-- LINKS - internal -->
[workload-identity-overview]: workload-identity-overview.md
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-group-create]: /cli/azure/group#az_group_create
[az-identity-create]: /cli/azure/identity#az_identity_create
[az-managed-identities]: ../active-directory/managed-identities-azure-resources/overview.md
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show

<!-- LINKS - external -->
[RFC 1123]: https://tools.ietf.org/html/rfc1123
[DNS subdomain name]: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
