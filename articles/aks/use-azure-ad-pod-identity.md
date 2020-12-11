---
title: Use Azure Active Directory pod-managed identities in Azure Kubernetes Service (Preview)
description: Learn how to use AAD pod-managed managed identities in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 12/01/2020

---

# Use Azure Active Directory pod-managed identities in Azure Kubernetes Service (Preview)

Azure Active Directory pod-managed identities uses Kubernetes primitives to associate [managed identities for Azure resources][az-managed-identities] and identities in Azure Active Directory (AAD) with pods. Administrators create identities and bindings as Kubernetes primitives that allow pods to access Azure resources that rely on AAD as an identity provider.

> [!NOTE]
> If you have an existing installation of AADPODIDENTITY, you must remove the existing installation. Enabling this feature means that the MIC component is not needed. 
[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

You must have the following resource installed:

* The Azure CLI, version 2.8.0 or later
* The `azure-preview` extension version 0.4.68 or later

### Limitations

* A maximum of 50 pod identities are allowed for a cluster.
* A maximum of 50 pod identity exceptions are allowed for a cluster.
* Pod-managed identities are available on Linux node pools only.

### Register the `EnablePodIdentityPreview`

Register the `EnablePodIdentityPreview` feature:

```azurecli
az feature register --name EnablePodIdentityPreview --namespace Microsoft.ContainerService
```

### Install the `aks-preview` Azure CLI

You also need the *aks-preview* Azure CLI extension version 0.4.64 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

## Create an AKS cluster with managed identities

Create an AKS cluster with a managed identity and pod-managed identity enabled. The following commands use [az group create][az-group-create] to create a resource group named *myResourceGroup* and the [az aks create][az-aks-create] command to create an AKS cluster named *myAKSCluster* in the *myResourceGroup* resource group.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
az aks create -g myResourceGroup -n myAKSCluster --enable-managed-identity --enable-pod-identity
```

Use [az aks get-credentials][az-aks-get-credentials] to sign in to your AKS cluster. This command also downloads and configures the `kubectl` client certificate on your development computer.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

## Create an identity

Create an identity using [az identity create][az-identity-create] and set the *IDENTITY_CLIENT_ID* and *IDENTITY_RESOURCE_ID* variables.

```azurecli-interactive
az group create --name myIdentityResourceGroup --location eastus
export IDENTITY_RESOURCE_GROUP="myIdentityResourceGroup"
export IDENTITY_NAME="application-identity"
az identity create --resource-group ${IDENTITY_RESOURCE_GROUP} --name ${IDENTITY_NAME}
export IDENTITY_CLIENT_ID="$(az identity show -g ${IDENTITY_RESOURCE_GROUP} -n ${IDENTITY_NAME} --query clientId -otsv)"
export IDENTITY_RESOURCE_ID="$(az identity show -g ${IDENTITY_RESOURCE_GROUP} -n ${IDENTITY_NAME} --query id -otsv)"
```

## Create a pod identity

Create a pod identity for the cluster using `az aks pod-identity add`.

> [!IMPORTANT]
> You must have the appropriate permissions, such as `Owner`, on your subscription to create the identity and role binding.

```azurecli-interactive
export POD_IDENTITY_NAME="my-pod-identity"
export POD_IDENTITY_NAMESPACE="my-app"
az aks pod-identity add --resource-group myResourceGroup --cluster-name myAKSCluster --namespace ${POD_IDENTITY_NAMESPACE}  --name ${POD_IDENTITY_NAME} --identity-resource-id ${IDENTITY_RESOURCE_ID}
```

> [!NOTE]
> When you enable pod-managed identity on your AKS cluster, an AzurePodIdentityException named *aks-addon-exception* is added to the *kube-system* namespace. An AzurePodIdentityException allows pods with certain labels to access the Azure Instance Metadata Service (IMDS) endpoint without being intercepted by the node-managed identity (NMI) server. The *aks-addon-exception* allows AKS first-party addons, such as AAD pod-managed identity, to operate without having to manually configure an AzurePodIdentityException. Optionally, you can add, remove, and update an AzurePodIdentityException using `az aks pod-identity exception add`, `az aks pod-identity exception delete`, `az aks pod-identity exception update`, or `kubectl`.

## Run a sample application

For a pod to use AAD pod-managed identity, the pod needs an *aadpodidbinding* label with a value that matches a selector from a *AzureIdentityBinding*. To run a sample application using AAD pod-managed identity, create a `demo.yaml` file with the following contents. Replace *POD_IDENTITY_NAME*, *IDENTITY_CLIENT_ID*, and *IDENTITY_RESOURCE_GROUP* with the values from the previous steps. Replace *SUBSCRIPTION_ID* with your subscription id.

> [!NOTE]
> In the previous steps, you created the *POD_IDENTITY_NAME*, *IDENTITY_CLIENT_ID*, and *IDENTITY_RESOURCE_GROUP* variables. You can use a command such as `echo` to display the value you set for variables, for example `echo $IDENTITY_NAME`.

```yml
apiVersion: v1
kind: Pod
metadata:
  name: demo
  labels:
    aadpodidbinding: POD_IDENTITY_NAME
spec:
  containers:
  - name: demo
    image: mcr.microsoft.com/oss/azure/aad-pod-identity/demo:v1.6.3
    args:
      - --subscriptionid=SUBSCRIPTION_ID
      - --clientid=IDENTITY_CLIENT_ID
      - --resourcegroup=IDENTITY_RESOURCE_GROUP
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

Notice the pod definition has an *aadpodidbinding* label with a value that matches the name of the pod identity you ran `az aks pod-identity add` in the previous step.

Deploy `demo.yaml` to the same namespace as your pod identity using `kubectl apply`:

```azurecli-interactive
kubectl apply -f demo.yaml --namespace $POD_IDENTITY_NAMESPACE
```

Verify the sample application successfully runs using `kubectl logs`.

```azurecli-interactive
kubectl logs demo --follow --namespace $POD_IDENTITY_NAMESPACE
```

Verify the logs show the a token is successfully acquired and the *GET* operation is successful.
 
```output
...
successfully doARMOperations vm count 0
successfully acquired a token using the MSI, msiEndpoint(http://169.254.169.254/metadata/identity/oauth2/token)
successfully acquired a token, userAssignedID MSI, msiEndpoint(http://169.254.169.254/metadata/identity/oauth2/token) clientID(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
successfully made GET on instance metadata
...
```

## Clean up

To remove AAD pod-managed identity from your cluster, remove the sample application and the pod identity from the cluster. Then remove the identity.

```azurecli-interactive
kubectl delete pod demo --namespace $POD_IDENTITY_NAMESPACE
az aks pod-identity delete --name ${POD_IDENTITY_NAME} --namespace ${POD_IDENTITY_NAMESPACE} --resource-group myResourceGroup --cluster-name myAKSCluster
az identity delete -g ${IDENTITY_RESOURCE_GROUP} -n ${IDENTITY_NAME}
```

## Next steps

For more information on managed identities, see [Managed identities for Azure resources][az-managed-identities].

<!-- LINKS - external -->
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[az-extension-add]: /cli/azure/extension?view=azure-cli-latest#az-extension-add&preserve-view=true
[az-extension-update]: /cli/azure/extension?view=azure-cli-latest#az-extension-update&preserve-view=true
[az-group-create]: /cli/azure/group#az-group-create
[az-identity-create]: /cli/azure/identity?view=azure-cli-latest#az_identity_create
[az-managed-identities]: ../active-directory/managed-identities-azure-resources/overview.md
[az-role-assignment-create]: /cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create
