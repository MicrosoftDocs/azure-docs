---
title: Deploy open-source SpinKube to Azure Kubernetes Service (AKS) to run serverless WebAssembly (Wasm) workloads
description: Learn how to deploy the open-source stack SpinKube to Azure Kubernetes Service (AKS) to run serverless WebAssembly (Wasm) workload on Kubernetes.
ms.topic: article
ms.date: 05/27/2024
author: ThorstenHans
ms.author: ThorstenHans
---

# Deploy open-source SpinKube to Azure Kubernetes Service (AKS) to run serverless WebAssembly (Wasm) workloads

[WebAssembly (Wasm)][wasm] is a binary format that is optimized for fast download and near-native execution speed. It runs in a sandbox, isolated from the host computer, provided by a Wasm runtime. By default, WebAssembly modules can't access resources on the host outside of the sandbox unless they are explicitly allowed, including sockets and environment variables. The [WebAssembly System Interface (WASI)][wasi] standard defines a set of interfaces for Wasm runtimes to provide access to WebAssembly modules to the environment and resources outside the host using a capability-based security model.

[SpinKube][spinkube] is a open-source project that runs serverless Wasm workloads (Spin Apps) built with open-source [Spin][spin] in Kubernetes. In contrast to earlier Wasm runtimes for Kubernetes, Spin Apps are executed natively on the underlying Kubernetes nodes and do not rely on containers. SpinKube consists of two top-level components: 

* `spin-operator`: A Kubernetes operator allowing the deployment and management of Spin Apps by using custom resources
* `kube` plugin for `spin`: A `spin` CLI plugin allowing users to scaffold Kubernetes deployment manifests for Spin Apps.


## Before you begin

You must have the following tools installed on your machine to follow this tutorial: 

* Azure CLI (`az`) (version `2.64.0` or newer) 
* [`kubectl`][kubectl] (version `1.31.0` or newer)
* [`helm`][helm] (version `3.15.4` or newer)
* [`spin`][spin-cli] (version `2.7.0` or newer)
* [Node.js](node-js) (version `21.6.2`)

## Limitations

* The Kubernetes node *os-type* must be Linux.
* You can't use the Azure portal to deploy SpinKube to an AKS cluster.

## Deploy SpinKube to an existing AKS Cluster

Configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials][az-aks-get-credentials] command. The following command:

```azurecli-interactive
az aks get-credentials -n <your cluster name> -g <your resource group name>
```

### Deploy `cert-manager`

To deploy SpinKube on an AKS cluster, you must have its dependencies installed. SpinKube depends on [cert-manager][cert-manager].

If you haven't deployed `cert-manager` to your AKS cluster yet, you can install it by deploying its Custom Resource Definitions (CRDs), followed by the `cert-manager` Helm chart provided through the `jetstack` repository:

```azurecli-interactive
# Deploy cert-manager CRDs
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.3/cert-manager.crds.yaml

# Add and update Jetstack repository
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install the cert-manager Helm chart
helm install \
  cert-manager jetstack/cert-manager --version v1.14.3 \
  --namespace cert-manager --create-namespace \
  --wait
```

### Deploy `runtime-class-manager` (aka KWasm)

The `runtime-class-manager` (aka [KWasm][kwasm]) is responsible for deploying and managing `containerd-shims` on the desired Kubernetes nodes. Deploy it by installing its Helm chart:

```azurecli-interactive
# Add Helm repository if not already done
helm repo add kwasm http://kwasm.sh/kwasm-operator/
# Install KWasm operator
helm install \
  kwasm-operator kwasm/kwasm-operator \
  --namespace kwasm \
  --create-namespace \
  --version 0.2.3 \
  --set kwasmOperator.installerImage=ghcr.io/spinkube/containerd-shim-spin/node-installer:v0.15.1
```

#### Provision containerd-shim-spin to Kubernetes nodes

Once `runtime-class-manager` is installed on your AKS cluster, you must annotate the Kubernetes nodes that should be able to run Spin Apps with `kwasm.sh/kwasm-node=true`. You can use `kubectl annotate node` to annotate either a subset of the nodes available in your AKS cluster or - as shown in the following snippet - all nodes of your AKS cluster:

```azurecli-interactive
# Provision containerd-shim-spin to all nodes
kubectl annotate node --all kwasm.sh/kwasm-node=true
```

After annotating the Kubernetes node(s), `runtime-class-manager` will use a Kubernetes *Job* to modify the desired node(s). After successful deployment of `containerd-shim-spin`, the node(s) will be labeled with a `kwasm.sh/kwasm-provisioned` label. You can check if the desired node(s) have the `kwasm.sh/kwasm-provisioned` label assigned using the `kubectl get nodes --show-labels` command:

```azurecli-interactive
# Verify kwasm.sh/kwasm-provisioned is set on desired node(s)
kubectl get nodes --show-labels
```

### Deploy the `spin-operator`

The `spin-operator` consists of two Custom Resource Definitions (CRDs), the RuntimeClass for `spin`, and a `SpinAppExecutor`, which must be deployed to your AKS cluster. 

Start by deploying the CRDs and the RuntimeClass for `spin`:

```azurecli-interactive
kubectl apply -f https://github.com/spinkube/spin-operator/releases/download/v0.2.0/spin-operator.crds.yaml
kubectl apply -f https://github.com/spinkube/spin-operator/releases/download/v0.2.0/spin-operator.runtime-class.yaml
```

The `spin-operator` itself is deployed using a Helm chart:

```azurecli-interactive
helm install spin-operator --version 0.2.0 \
  --namespace spin-operator --create-namespace \
  --wait oci://ghcr.io/spinkube/charts/spin-operator
```

Finally, create a `SpinAppExecutor` in the default namespace:

```azurecli-interactive
kubectl apply -f https://github.com/spinkube/spin-operator/releases/download/v0.2.0/spin-operator.shim-executor.yaml
```

## Run a Spin App on AKS

In this section you will verify the SpinKube installation, by creating a simple Spin App using the `spin` CLI and JavaScript. Start by creating a new Spin App using the `http-js` template:

```azurecli-interactive
# Create a new Spin App
spin new -t http-js --accept-defaults hello-spinkube

# Move into the application folder
cd hello-spinkube

# Install Wasm Tooling
npm install
```

The `spin` CLI create a basic *Hello, World* application, package and push the Spin App without further modifications to a OCI compliant container registry:

```azurecli-interactive
# Compile the app to Wasm
spin build

# Package and Distribute the Spin App
spin registry push ttl.sh/hello-spinkube:0.0.1
```

> Both `spin` CLI and SpinKube integrate seamlessly with private container registries such as Azure Container Registry (ACR). To authenticate the `spin` CLI use `spin registry login` and supply corresponding credentials. SpinKube can pull OCI artifacts from ACR using underlying Azure identities with `AcrPull` permissions for the desired ACR instance(s).

By using the `spin kube scaffold` command, you can create necessary Kubernetes deployment manifests. You can deploy those to Kubernetes using your preferred tooling:

```azurecli-interactive
# Create Kubernetes Deployment Manifests
spin kube scaffold --from ttl.sh/hello-spinkube:0.0.1 > spinapp.yaml

# Deploy the Spin App to AKS
kubectl apply -f spinapp.yaml
```

### Explore the Spin App in AKS

Having an Spin App deployed to the AKS cluster, you can explore different objects being created. 

You can retrieve the list of Spin Apps using `kubectl get spinapps`

```azurecli-interactive
# Get all Spin Apps in the default namespace
kubectl get spinapps
```

```OUTPUT
NAME             READY   DESIRED   EXECUTOR
hello-spinkube   2       2         containerd-shim-spin
```

Upon deployment, the `spin-operator` creates underlying Kubernetes primitives such as a *Service*, a *Deployment* and corresponding *Pods*:

```azurecli-interactive
# Retrieve Kubernetes primitives created by the spin-operator
kubectl get service
```

```OUTPUT
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
hello-spinkube   ClusterIP   10.43.35.78   <none>        80/TCP    24s
```

```azurecli-interactive
kubectl get deployment
```

```OUTPUT
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
hello-spinkube   2/2     2            2           38s
```

```azurecli-interactive
kubectl get pod
```

```OUTPUT
NAME                              READY   STATUS    RESTARTS   AGE
hello-spinkube-5b8579448d-zmc6x   1/1     Running   0          51s
hello-spinkube-5b8579448d-bhkp9   1/1     Running   0          51s
```

To invoke the Spin App, you configure port-forwarding to the service provisioned by the `spin-operator` and use `curl` for sending HTTP requests:

```azurecli-interactive
# Establish port forwarding
kubectl port-forward svc/hello-spinkube 8080:80
```

```OUTPUT
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
```

From within a new terminal instance, use `curl` to send an HTTP request to `localhost:8080`:

```azurecli-interactive
# Invoke the Spin App
curl -iX GET localhost:8080
```

```OUTPUT
HTTP/1.1 200 OK
content-type: text/plain
content-length: 17
date: Tue, 28 May 2024 08:55:50 GMT

Hello from JS-SDK
```

## Clean up

To remove the Spin App from the AKS cluster use `kubectl delete spinapp` as shown here:

```azurecli-interactive
# Remove the hello-spinkube Spin App
kubectl delete spinapp hello-spinkube
```

To uninstall SpinKube from the AKS cluster, use the following commands:

```azurecli-interactive
# Remove the spin-operator
helm delete spin-operator --namespace spin-operator

# Remove the SpinAppExecutor
kubectl delete -f https://github.com/spinkube/spin-operator/releases/download/v0.2.0/spin-operator.shim-executor.yaml

# Remove the RuntimeClass for Spin
kubectl delete -f https://github.com/spinkube/spin-operator/releases/download/v0.2.0/spin-operator.runtime-class.yaml

# Remove the SpinKube CRDs
kubectl delete -f https://github.com/spinkube/spin-operator/releases/download/v0.2.0/spin-operator.crds.yaml

# Remove runtime-class-manager (aka KWasm)
helm delete kwasm-operator --namespace kwasm

# Remove cert-manager Helm Release
helm delete cert-manager --namespace cert-manager

# Remove cert-manager CRDs
kubectl delete -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.3/cert-manager.crds.yaml
```

<!-- EXTERNAL LINKS -->
[wasm]: https://webassembly.org/
[wasi]: https://wasi.dev/
[spinkube]: https://spinkube.dev/
[spin]: https://spin.fermyon.dev/
[kubectl]: https://kubernetes.io/docs/tasks/tools/
[helm]: https://helm.sh
[spin-cli]: https://developer.fermyon.com/spin/v2/install
[node-js]: https://nodejs.org/en
[kwasm]: https://kwasm.sh
[cert-manager]: https://cert-manager.io/
[containerd-shim]: https://github.com/containerd/containerd/blob/main/core/runtime/v2/README.md#runtime-shim
[run-wasi]: https://github.com/deislabs/runwasi
[wasmtime]: https://wasmtime.dev/

<!-- INTERNAL LINKS -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials