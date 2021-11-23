---
title: Create WebAssembly System Interface(WASI) node pools in Azure Kubernetes Service (AKS) to run your WebAssembly(WASM) workload (preview)
description: Learn how to create a WebAssembly System Interface(WASI) node pool in Azure Kubernetes Service (AKS) to run your WebAssembly(WASM) workload on Kubernetes.
services: container-service
ms.topic: article
ms.date: 10/12/2021
---

# Create WebAssembly System Interface (WASI) node pools in Azure Kubernetes Service (AKS) to run your WebAssembly (WASM) workload (preview)

[WebAssembly (WASM)][wasm] is a binary format that is optimized for fast download and maximum execution speed in a WASM runtime. A WASM runtime is designed to run on a target architecture and execute WebAssemblies in a sandbox, isolated from the host computer, at near-native performance. By default, WebAssemblies can't access resources on the host outside of the sandbox unless it is explicitly allowed, and they can't communicate over sockets to access things environment variables or HTTP traffic. The [WebAssembly System Interface (WASI)][wasi] standard defines an API for WASM runtimes to provide access to WebAssemblies to the environment and resources outside the host using a capabilities model. [Krustlet][krustlet] is an open-source project that allows WASM modules to be run on Kubernetes. Krustlet creates a kubelet that runs on nodes with a WASM/WASI runtime. AKS allows you to create node pools that run WASM assemblies using nodes with WASM/WASI runtimes and Krustlets.

## Before you begin

WASM/WASI node pools are currently in preview.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

This article uses [Helm 3][helm] to install the *nginx* chart on a supported version of Kubernetes. Make sure that you are using the latest release of Helm and have access to the *bitnami* Helm repository. The steps outlined in this article may not be compatible with previous versions of the Helm chart or Kubernetes.

You must also have the following resource installed:

* The latest version of the Azure CLI.
* The `aks-preview` extension version 0.5.34 or later

### Register the `WasmNodePoolPreview` preview feature

To use the feature, you must also enable the `WasmNodePoolPreview` feature flag on your subscription.

Register the `WasmNodePoolPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "WasmNodePoolPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/WasmNodePoolPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

### Install the `aks-preview` Azure CLI

You also need the *aks-preview* Azure CLI extension version 0.5.34 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Limitations

* You can't run WebAssemblies and containers in the same node pool.
* Only the WebAssembly(WASI) runtime is available, using the Wasmtime provider.
* The WASM/WASI node pools can't be used for system node pool.
* The *os-type* for WASM/WASI node pools must be Linux.
* Krustlet doesn't work with Azure CNI at this time. For more information, see the [CNI Support for Kruslet GitHub issue][krustlet-cni-support].
* Krustlet doesn't provide networking configuration for WebAssemblies. The WebAssembly manifest must provide the networking configuration, such as IP address.

## Add a WASM/WASI node pool to an existing AKS Cluster

To add a WASM/WASI node pool, use the [az aks nodepool add][az-aks-nodepool-add] command. The following example creates a WASI node pool named *mywasipool* with one node.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mywasipool \
    --node-count 1 \
    --workload-runtime wasmwasi 
```

> [!NOTE]
> The default value for the *workload-runtime* parameter is *ocicontainer*. To create a node pool that runs container workloads, omit the *workload-runtime* parameter or set the value to *ocicontainer*.

Verify the *workloadRuntime* value using `az aks nodepool show`. For example:

```azurecli-interactive
az aks nodepool show -g myResourceGroup --cluster-name myAKSCluster -n mywasipool
```

The following example output shows the *mywasipool* has the *workloadRuntime* type of *WasmWasi*.

```output
{
  ...
  "name": "mywasipool",
  ..
  "workloadRuntime": "WasmWasi"
}
```

For a WASM/WASI node pool, verify the taint is set to `kubernetes.io/arch=wasm32-wagi:NoSchedule` and `kubernetes.io/arch=wasm32-wagi:NoExecute`, which will prevent container pods from being scheduled on this node pool. Also, you should see nodeLabels to be `kubernetes.io/arch: wasm32-wasi`, which prevents WASM pods from being scheduled on regular container(OCI) node pools.

> [!NOTE]
> The taints for a WASI node pool are not visible using `az aks nodepool list`. Use `kubectl` to verify the taints are set on the nodes in the WASI node pool.

Configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials][az-aks-get-credentials] command. The following command:  

```azurecli
az aks get-credentials -n myakscluster -g myresourcegroup
```

Use `kubectl get nodes` to display the nodes in your cluster.

```output
$ kubectl get nodes -o wide
NAME                                 STATUS   ROLES   AGE   VERSION         INTERNAL-IP   EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
aks-mywasipool-12456878-vmss000000   Ready    agent    9m   1.0.0-alpha.1   WASINODE_IP   <none>        <unknown>            <unknown>          mvp
aks-nodepool1-12456878-vmss000000    Ready    agent   13m   v1.20.9         NODE1_IP      <none>        Ubuntu 18.04.6 LTS   5.4.0-1059-azure   containerd://1.4.9+azure
```

Save the value of *WASINODE_IP* as it is used in later step.

Use `kubectl describe node` to show the labels and taints on a node in the WASI node pool. The following example shows the details of *aks-mywasipool-12456878-vmss000000*.

```output
$ kubectl describe node aks-mywasipool-12456878-vmss000000

Name:               aks-mywasipool-12456878-vmss000000
Roles:              agent
Labels:             agentpool=mywasipool
...
                    kubernetes.io/arch=wasm32-wagi
...
Taints:             kubernetes.io/arch=wasm32-wagi:NoExecute
                    kubernetes.io/arch=wasm32-wagi:NoSchedule
```


## Running WASM/WASI Workload

To run a workload on a WASM/WASI node pool, add a node selector and tolerations to your deployment. For example:

```yml
...
spec:
  nodeSelector:
    kubernetes.io/arch: "wasm32-wagi"
  tolerations:
    - key: "node.kubernetes.io/network-unavailable"
      operator: "Exists"
      effect: "NoSchedule"
    - key: "kubernetes.io/arch"
      operator: "Equal"
      value: "wasm32-wagi"
      effect: "NoExecute"
    - key: "kubernetes.io/arch"
      operator: "Equal"
      value: "wasm32-wagi"
      effect: "NoSchedule"
...
```

To run a sample deployment, create a `wasi-example.yaml` file using the following YAML definition:

```yml
apiVersion: v1
kind: Pod
metadata:
  name: krustlet-wagi-demo
  labels:
    app: krustlet-wagi-demo
  annotations:
    alpha.wagi.krustlet.dev/default-host: "0.0.0.0:3001"
    alpha.wagi.krustlet.dev/modules: |
      {
        "krustlet-wagi-demo-http-example": {"route": "/http-example", "allowed_hosts": ["https://api.brigade.sh"]},
        "krustlet-wagi-demo-hello": {"route": "/hello/..."},
        "krustlet-wagi-demo-error": {"route": "/error"},
        "krustlet-wagi-demo-log": {"route": "/log"},
        "krustlet-wagi-demo-index": {"route": "/"}
      }
spec:
  hostNetwork: true
  nodeSelector:
    kubernetes.io/arch: wasm32-wagi
  containers:
    - image: webassembly.azurecr.io/krustlet-wagi-demo-http-example:v1.0.0
      imagePullPolicy: Always
      name: krustlet-wagi-demo-http-example
    - image: webassembly.azurecr.io/krustlet-wagi-demo-hello:v1.0.0
      imagePullPolicy: Always
      name: krustlet-wagi-demo-hello
    - image: webassembly.azurecr.io/krustlet-wagi-demo-index:v1.0.0
      imagePullPolicy: Always
      name: krustlet-wagi-demo-index
    - image: webassembly.azurecr.io/krustlet-wagi-demo-error:v1.0.0
      imagePullPolicy: Always
      name: krustlet-wagi-demo-error
    - image: webassembly.azurecr.io/krustlet-wagi-demo-log:v1.0.0
      imagePullPolicy: Always
      name: krustlet-wagi-demo-log
  tolerations:
    - key: "node.kubernetes.io/network-unavailable"
      operator: "Exists"
      effect: "NoSchedule"
    - key: "kubernetes.io/arch"
      operator: "Equal"
      value: "wasm32-wagi"
      effect: "NoExecute"
    - key: "kubernetes.io/arch"
      operator: "Equal"
      value: "wasm32-wagi"
      effect: "NoSchedule"
```

Use `kubectl` to run your example deployment:

```azurecli-interactive
kubectl apply -f wasi-example.yaml
```

> [!NOTE]
> The pod for the example deployment may stay in the *Registered* status. This behavior is expected, and you and proceed to the next step.

Create `values.yaml` using the example yaml below, replacing *WASINODE_IP* with the value from the earlier step.

```yml
serverBlock: |-
  server {
    listen 0.0.0.0:8080;
    location / {
            proxy_pass http://WASINODE_IP:3001;
    }
  }
```

Using [Helm][helm], add the *bitnami* repository and install the *nginx* chart with the `values.yaml` file you created in the previous step. Installing NGINX with the above `values.yaml` creates a reverse proxy to the example deployment, allowing you to access it using an external IP address.

>[!NOTE]
> The following example pulls a public container image from Docker Hub. We recommend that you set up a pull secret to authenticate using a Docker Hub account instead of making an anonymous pull request. To improve reliability when working with public content, import and manage the image in a private Azure container registry. [Learn more about working with public images.][dockerhub-callout]

```console
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install hello-wasi bitnami/nginx -f values.yaml
```

Use `kubectl get service` to display the external IP address of the *hello-wasi-ngnix* service.

```output
$ kubectl get service
NAME               TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)        AGE
hello-wasi-nginx   LoadBalancer   10.0.58.239   EXTERNAL_IP      80:32379/TCP   112s
kubernetes         ClusterIP      10.0.0.1      <none>           443/TCP        145m
```

Verify the example deployment is running by the `curl` command against the `/hello` path of *EXTERNAL_IP*.

```azurecli-interactive
curl EXTERNAL_IP/hello
```

The follow example output confirms the example deployment is running.

```output
$ curl EXTERNAL_IP/hello
hello world
```

> [!NOTE] 
> To publish the service on your own domain, see [Azure DNS][azure-dns-zone] and the [external-dns][external-dns] project.

## Clean up

To remove NGINX, use `helm delete`.

```console
helm delete hello-wasi
```

To remove the example deployment, use `kubectl delete`.

```azurecli-interactive
kubectl delete -f wasi-example.yaml
```

To remove the WASM/WASI node pool, use `az aks nodepool delete`.

```azurecli-interactive
az aks nodepool delete --name mywasipool -g myresourcegroup --cluster-name myakscluster
```


<!-- EXTERNAL LINKS -->
[helm]: https://helm.sh/
[krustlet]: https://krustlet.dev/
[krustlet-cni-support]: https://github.com/krustlet/krustlet/issues/533
[wasm]: https://webassembly.org/
[wasi]: https://wasi.dev/
[azure-dns-zone]: https://azure.microsoft.com/services/dns/
[external-dns]: https://github.com/kubernetes-sigs/external-dns

<!-- INTERNAL LINKS -->

[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-nodepool-list]: /cli/azure/aks/nodepool#az_aks_nodepool_list
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az_aks_nodepool_update
[az-aks-nodepool-upgrade]: /cli/azure/aks/nodepool#az_aks_nodepool_upgrade
[az-aks-nodepool-scale]: /cli/azure/aks/nodepool#az_aks_nodepool_scale
[az-aks-nodepool-delete]: /cli/azure/aks/nodepool#az_aks_nodepool_delete
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[dockerhub-callout]: ../container-registry/buffer-gate-public-content.md
[install-azure-cli]: /cli/azure/install-azure-cli
[use-multiple-node-pools]: use-multiple-node-pools.md
[use-system-pool]: use-system-pools.md
