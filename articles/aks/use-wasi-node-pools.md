---
title: Create WebAssembly System Interface(WASI) node pools in Azure Kubernetes Service (AKS) to run your WebAssembly(WASM) workload (preview)
description: Learn how to create a WebAssembly System Interface(WASI) node pool in Azure Kubernetes Service (AKS) to run your WebAssembly(WASM) workload on Kubernetes.
services: container-service
ms.topic: article
ms.date: 10/19/2022
---

# Create WebAssembly System Interface (WASI) node pools in Azure Kubernetes Service (AKS) to run your WebAssembly (WASM) workload (preview)

[WebAssembly (WASM)][wasm] is a binary format that is optimized for fast download and maximum execution speed in a WASM runtime. A WASM runtime is designed to run on a target architecture and execute WebAssemblies in a sandbox, isolated from the host computer, at near-native performance. By default, WebAssemblies can't access resources on the host outside of the sandbox unless it is explicitly allowed, and they can't communicate over sockets to access things environment variables or HTTP traffic. The [WebAssembly System Interface (WASI)][wasi] standard defines an API for WASM runtimes to provide access to WebAssemblies to the environment and resources outside the host using a capabilities model.

> [!IMPORTANT]
> WASI nodepools now use [containerd shims][wasm-containerd-shims] to run WASM workloads. Previously, AKS used [Krustlet][krustlet] to allow WASM modules to be run on Kubernetes. If you are still using Krustlet-based WASI nodepools, you can migrate to containerd shims by creating a new WASI nodepool and migrating your workloads to the new nodepool.

## Before you begin

WASM/WASI node pools are currently in preview.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

You must also have the latest version of the Azure CLI and `aks-preview` extension installed.

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

* Currently, there are only containerd shims available for [spin][spin] and [slight][slight] applications, which use the [wasmtime][wasmtime] runtime. In addition to wasmtime runtime applications, you can also run containers on WASM/WASI node pools.  
* You can run containers and wasm modules on the same node, but you can't run containers and wasm modules on the same pod.
* The WASM/WASI node pools can't be used for system node pool.
* The *os-type* for WASM/WASI node pools must be Linux.
* You can't use the Azure portal to create WASM/WASI node pools.

## Add a WASM/WASI node pool to an existing AKS Cluster

To add a WASM/WASI node pool, use the [az aks nodepool add][az-aks-nodepool-add] command. The following example creates a WASI node pool named *mywasipool* with one node.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mywasipool \
    --node-count 1 \
    --workload-runtime WasmWasi 
```

> [!NOTE]
> The default value for the *workload-runtime* parameter is *ocicontainer*. To create a node pool that runs container workloads, omit the *workload-runtime* parameter or set the value to *ocicontainer*.

Verify the *workloadRuntime* value using `az aks nodepool show`. For example:

```azurecli-interactive
az aks nodepool show -g myResourceGroup --cluster-name myAKSCluster -n mywasipool --query workloadRuntime
```

The following example output shows the *mywasipool* has the *workloadRuntime* type of *WasmWasi*.

```output
$ az aks nodepool show -g myResourceGroup --cluster-name myAKSCluster -n mywasipool --query workloadRuntime
"WasmWasi"
```

Configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials][az-aks-get-credentials] command. The following command:  

```azurecli
az aks get-credentials -n myakscluster -g myresourcegroup
```

Use `kubectl get nodes` to display the nodes in your cluster.

```output
$ kubectl get nodes -o wide
NAME                                 STATUS   ROLES   AGE    VERSION    INTERNAL-IP   EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
aks-mywasipool-12456878-vmss000000   Ready    agent   123m   v1.23.12   <WASINODE_IP> <none>        Ubuntu 22.04.1 LTS   5.15.0-1020-azure   containerd://1.5.11+azure-2
aks-nodepool1-12456878-vmss000000    Ready    agent   133m   v1.23.12   <NODE_IP>     <none>        Ubuntu 22.04.1 LTS   5.15.0-1020-azure   containerd://1.5.11+azure-2
```

Use `kubectl describe node` to show the labels on a node in the WASI node pool. The following example shows the details of *aks-mywasipool-12456878-vmss000000*.

```output
$ kubectl describe node aks-mywasipool-12456878-vmss000000

Name:               aks-mywasipool-12456878-vmss000000
Roles:              agent
Labels:             agentpool=mywasipool
...
                    kubernetes.azure.com/wasmtime-slight-v1=true
                    kubernetes.azure.com/wasmtime-spin-v1=true
...
```

Add a `RuntimeClass` for running [spin][spin] and [slight][slight] applications. Create a file named *wasm-runtimeclass.yaml* with the following content:

```yml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: "wasmtime-slight-v1"
handler: "slight"
scheduling:
  nodeSelector:
    "kubernetes.azure.com/wasmtime-slight-v1": "true"
---
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: "wasmtime-spin-v1"
handler: "spin"
scheduling:
  nodeSelector:
    "kubernetes.azure.com/wasmtime-spin-v1": "true"
```

Use `kubectl` to create the `RuntimeClass` objects.

```azurecli-interactive
kubectl apply -f wasm-runtimeclass.yaml
```

## Running WASM/WASI Workload

Create a file named *slight.yaml* with the following content:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wasm-slight
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wasm-slight
  template:
    metadata:
      labels:
        app: wasm-slight
    spec:
      runtimeClassName: wasmtime-slight-v1
      containers:
        - name: testwasm
          image: ghcr.io/deislabs/containerd-wasm-shims/examples/slight-rust-hello:latest
          command: ["/"]
---
apiVersion: v1
kind: Service
metadata:
  name: wasm-slight
spec:
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  selector:
    app: wasm-slight
```

> [!NOTE]
> When developing applications, modules should be build against the `wasm32-wasi` target. For more details, see the [spin][spin] and [slight][slight] documentation.

Use `kubectl` to run your example deployment:

```azurecli-interactive
kubectl apply -f slight.yaml
```

Use `kubectl get svc` to get the external IP address of the service.

```output
$ kubectl get svc
NAME          TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)        AGE
kubernetes    ClusterIP      10.0.0.1       <none>         443/TCP        10m
wasm-slight   LoadBalancer   10.0.133.247   <EXTERNAL-IP>  80:30725/TCP   2m47s
```

Access the example application at `http://EXTERNAL-IP/hello`. The following example uses `curl`.

```output
$ curl http://EXTERNAL-IP/hello
hello
```

> [!NOTE]
> If your request times out, use `kubectl get pods` and `kubectl describe pod <POD_NAME>` to check the status of the pod. If the pod is not running, use `kubectl get rs` and `kubectl describe rs <REPLICA_SET_NAME>` to see if the replica set is having issues creating a new pod.

## Clean up

To remove the example deployment, use `kubectl delete`.

```azurecli-interactive
kubectl delete -f slight.yaml
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
[wasm-containerd-shims]: https://github.com/deislabs/containerd-wasm-shims
[spin]: https://spin.fermyon.dev/
[slight]: https://github.com/deislabs/spiderlightning#spiderlightning-or-slight
[wasmtime]: https://wasmtime.dev/
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
