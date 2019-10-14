---
title: Install Hashicorp Consul in Azure Kubernetes Service (AKS)
description: Learn how to install and use Consul to create a service mesh in an Azure Kubernetes Service (AKS) cluster
services: container-service
author: dstrebel

ms.service: container-service
ms.topic: article
ms.date: 06/19/2019
ms.author: dastrebe
---

# Install and use Consul Connect in Azure Kubernetes Service (AKS)

[Consul][consul-github] is an open-source service mesh that provides a key set of functionality across the microservices in a Kubernetes cluster. These features include service discovery, health checking, service segmentation, and observability. For more information about Consul, see the official [What is Consul?][consul-docs-concepts] documentation.

This article shows you how to install Consul. The Consul components are installed into a Kubernetes cluster on AKS.

> [!NOTE]
> These instructions reference Consul version `1.5`.
>
> The Consul `1.5.x` releases have been tested by the Hashicorp team against Kubernetes versions `1.12`, `1.14`, `1.14`. You can find additional Consul versions at [GitHub - Consul Releases][consul-github-releases] and information about each of the releases at [Consul- Release Notes][consul-release-notes].

In this article, you learn how to:

> [!div class="checklist"]
> * Install the Consul components on AKS
> * Validate the Consul installation
> * Uninstall Consul from AKS

## Before you begin

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.11` and above, with RBAC enabled) and have established a `kubectl` connection with the cluster. If you need help with any of these items, then see the [AKS quickstart][aks-quickstart].

You'll need [Helm][helm] to follow these instructions and install Consul. It's recommended that you have version `2.12.2` or later correctly installed and configured in your cluster. If you need help with installing Helm, then see the [AKS Helm installation guidance][helm-install]. All Consul pods must also be scheduled to run on Linux nodes.

This article separates the Consul installation guidance into several discrete steps. The end result is the same in structure as the official Consul installation [guidance][consul-install-k8].

### Install the Consul components on AKS

We will first clone the official HashiCorp Consul on Kubernetes GitHub repo.

```bash
git clone https://github.com/hashicorp/consul-helm.git
cd consul-helm
```

We will then need to create a custom Helm values file for the Consul install. Create the following custom values file before installing Consul.

```bash
vim consul-values.yaml
```

Then copy and paste the following values in the consul-values.yaml file.

```yaml
# Sets datacenter name and version Consul to use
global:
  datacenter: dc1
  image: "consul:1.5.2"

# Enables proxies to be injected into pods
connectInject:
  enabled: true

# Enables UI on ClusterIP
ui:
  service:
    type: "ClusterIP"

# Enables GRCP that is required for connectInject
client:
  enabled: true
  grpc: true

# Sets replicase to 3 for HA
server:
  replicas: 3
  bootstrapExpect: 1
  disruptionBudget:
    enabled: true
    maxUnavailable: 1

# Syncs Kubernetes service discovery with Consul
syncCatalog:
  enabled: true
```

Now that we have the custom values file we can install Consul into our AKS cluster

Bash

```bash
helm install -f consul-values.yaml --name consul --namespace consul .
```
The `Consul` Helm chart deploys a number of objects. You can see the list from the output of your `helm install` command above. The deployment of the Consul components can take 4 to 5 minutes to complete, depending on your cluster environment.

> [!NOTE]
> All Consul pods must be scheduled to run on Linux nodes. If you have Windows Server node pools in addition to Linux node pools on your cluster, verify that all Consul pods have been scheduled to run on Linux nodes.

At this point, you've deployed Consul to your AKS cluster. To ensure that we have a successful deployment of Consul, let's move on to the next section to validate the Consul installation.

## Validate the Consul installation

First confirm that the expected services have been created. Use the [kubectl get svc][kubectl-get] command to view the running services. Query the `consul` namespace, where the Consul components were installed by the `consul` Helm chart:

```console
kubectl get svc --namespace consul
```

The following example output shows the services that should now be running:

```console
NAME                                 TYPE           CLUSTER-IP     EXTERNAL-IP             PORT(S)                                                                   AGE
consul                               ExternalName   <none>         consul.service.consul   <none>                                                                    38m
consul-consul-connect-injector-svc   ClusterIP      10.0.89.113    <none>                  443/TCP                                                                   40m
consul-consul-dns                    ClusterIP      10.0.166.82    <none>                  53/TCP,53/UDP                                                             40m
consul-consul-server                 ClusterIP      None           <none>                  8500/TCP,8301/TCP,8301/UDP,8302/TCP,8302/UDP,8300/TCP,8600/TCP,8600/UDP   40m
consul-consul-ui                     ClusterIP      10.0.117.164   <none>                  80/TCP                                                                    40m
```

Next, confirm that the required pods have been created. Use the [kubectl get pods][kubectl-get] command, and again query the `consul` namespace:

```console
kubectl get pods --namespace consul
```

The following example output shows the pods that are running:

```console
NAME                                                              READY   STATUS    RESTARTS   AGE
consul-consul-7cc9v                                               1/1     Running   0          37m
consul-consul-7klg7                                               1/1     Running   0          37m
consul-consul-connect-injector-webhook-deployment-57f88df8hgmfs   1/1     Running   0          37m
consul-consul-lq8qb                                               1/1     Running   0          37m
consul-consul-server-0                                            1/1     Running   0          37m
consul-consul-server-1                                            1/1     Running   0          36m
consul-consul-server-2                                            1/1     Running   0          36m
consul-consul-sync-catalog-7cf7d5bfff-jjbjv                       1/1     Running   2          37m
```

 All of the pods should show a status of `Running`. If your pods don't have these statuses, wait a minute or two until they do. If any pods report an issue, use the [kubectl describe pod][kubectl-describe] command to review their output and status.

## Accessing the Consul UI

The Consul UI was installed in our setup above that provides UI based configuration for Consul. The UI for Consul is not exposed publicly via an external ip address. To access the add-on user interfaces, use the [kubectl port-forward][kubectl-port-forward] command. This command creates a secure connection between your client machine and the relevant pod in your AKS cluster.

```bash
kubectl port-forward -n consul svc/consul-consul-ui 8080:80
```
You can now open a browser and point it to `http://localhost:8080/ui` to open the Consul UI. You should see the following when you open the UI:

![Consul UI](./media/consul/consul-ui.png)

## Uninstall Consul from AKS

> [!WARNING]
> Deleting Consul from a running system may result in traffic related issues between your services. Ensure that you have made provisions for your system to still operate correctly without Consul before proceeding.

### Remove Consul components and namespace

To remove Consul from your AKS cluster, use the following commands. The `helm delete` commands will remove the `consul` chart,and the `kubectl delete ns` command will remove the `consul` namespace.

```bash
helm delete --purge consul
kubectl delete ns consul
```

## Next steps

To explore more installation and configuration options for Consul, see the following official Consul articles:

- [Consul - Helm installation guide][consul-install-k8]
- [Consul - Helm installation options][consul-install-helm-options]

You can also follow additional scenarios using the [Consul Example Application][consul-app-example].

<!-- LINKS - external -->
[Hashicorp]: https://hashicorp.com
[cosul-github]: https://github.com/hashicorp/consul
[helm]: https://helm.sh

[consul-docs-concepts]: https://www.consul.io/docs/platform/k8s/index.html
[consul-github]: https://github.com/hashicorp/consul
[consul-github-releases]: https://github.com/hashicorp/consul/releases
[consul-release-notes]: https://github.com/hashicorp/consul/blob/master/CHANGELOG.md
[consul-install-download]: https://www.consul.io/downloads.html
[consul-install-k8]: https://www.consul.io/docs/platform/k8s/run.html
[consul-install-helm-options]: https://www.consul.io/docs/platform/k8s/helm.html#configuration-values-
[consul-app-example]: https://github.com/hashicorp/demo-consul-101/tree/master/k8s
[install-wsl]: https://docs.microsoft.com/windows/wsl/install-win10

[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-port-forward]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward

<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md
[consul-scenario-mtls]: ./consul-mtls.md
[helm-install]: ./kubernetes-helm.md
