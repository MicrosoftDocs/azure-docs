---
title: Install Linkerd in Azure Kubernetes Service (AKS)
description: Learn how to install and use Linkerd to create a service mesh in an Azure Kubernetes Service (AKS) cluster
author: paulbouwer
ms.topic: article
ms.date: 10/09/2019
ms.author: pabouwer
zone_pivot_groups: client-operating-system
---

# Install Linkerd in Azure Kubernetes Service (AKS)

[Linkerd][linkerd-github] is an open-source service mesh and [CNCF incubating project][linkerd-cncf]. Linkerd is an ultralight service mesh that provides features that include traffic management, service identity and security, reliability, and observability. For more information about Linkerd, see the official [Linkerd FAQ][linkerd-faq] and [Linkerd Architecture][linkerd-architecture] documentation.

This article shows you how to install Linkerd. The Linkerd `linkerd` client binary is installed onto your client machine and the Linkerd components are installed into a Kubernetes cluster on AKS.

> [!NOTE]
> These instructions reference Linkerd version `stable-2.6.0`.
>
> The Linkerd `stable-2.6.x` can be run against Kubernetes versions `1.13+`. You can find additional stable and edge Linkerd versions at [GitHub - Linkerd Releases][linkerd-github-releases].

In this article, you learn how to:

> [!div class="checklist"]
> * Download and install the Linkerd linkerd client binary
> * Install Linkerd on AKS
> * Validate the Linkerd installation
> * Access the Dashboard
> * Uninstall Linkerd from AKS

## Before you begin

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.13` and above, with RBAC enabled) and have established a `kubectl` connection with the cluster. If you need help with any of these items, then see the [AKS quickstart][aks-quickstart].

All Linkerd pods must be scheduled to run on Linux nodes - this setup is the default in the installation method detailed below and requires no additional configuration.

This article separates the Linkerd installation guidance into several discrete steps. The result is the same in structure as the official Linkerd getting started [guidance][linkerd-getting-started].

::: zone pivot="client-operating-system-linux"

[!INCLUDE [Linux - download and install client binary](includes/servicemesh/linkerd/install-client-binary-linux.md)]

::: zone-end

::: zone pivot="client-operating-system-macos"

[!INCLUDE [MacOS - download and install client binary](includes/servicemesh/linkerd/install-client-binary-macos.md)]

::: zone-end

::: zone pivot="client-operating-system-windows"

[!INCLUDE [Windows - download and install client binary](includes/servicemesh/linkerd/install-client-binary-windows.md)]

::: zone-end

## Install Linkerd on AKS

Before we install Linkerd, we'll run pre-installation checks to determine if the control plane can be installed on our AKS cluster:

```console
linkerd check --pre
```

You should see something like the following to indicate that your AKS cluster is a valid installation target for Linkerd:

```console
kubernetes-api
--------------
√ can initialize the client
√ can query the Kubernetes API

kubernetes-version
------------------
√ is running the minimum Kubernetes API version
√ is running the minimum kubectl version

pre-kubernetes-setup
--------------------
√ control plane namespace does not already exist
√ can create Namespaces
√ can create ClusterRoles
√ can create ClusterRoleBindings
√ can create CustomResourceDefinitions
√ can create PodSecurityPolicies
√ can create ServiceAccounts
√ can create Services
√ can create Deployments
√ can create CronJobs
√ can create ConfigMaps
√ no clock skew detected

pre-kubernetes-capability
-------------------------
√ has NET_ADMIN capability
√ has NET_RAW capability

pre-linkerd-global-resources
----------------------------
√ no ClusterRoles exist
√ no ClusterRoleBindings exist
√ no CustomResourceDefinitions exist
√ no MutatingWebhookConfigurations exist
√ no ValidatingWebhookConfigurations exist
√ no PodSecurityPolicies exist

linkerd-version
---------------
√ can determine the latest version
√ cli is up-to-date

Status check results are √
```

Now it's time to install the Linkerd components. Use the `linkerd` and `kubectl` binaries to install the Linkerd components into your AKS cluster. A `linkerd` namespace will be automatically created, and the components will be installed into this namespace.

```console
linkerd install | kubectl apply -f -
```

Linkerd deploys a number of objects. You'll see the list from the output of your `linkerd install` command above. The deployment of the Linkerd components should take around 1 minute to complete, depending on your cluster environment.

At this point, you've deployed Linkerd to your AKS cluster. To ensure we have a successful deployment of Linkerd, let's move on to the next section to [Validate the Linkerd installation](#validate-the-linkerd-installation).

## Validate the Linkerd installation

Confirm that the resources have been successfully created. Use the [kubectl get svc][kubectl-get] and [kubectl get pod][kubectl-get] commands to query the `linkerd` namespace, where the Linkerd components were installed by the `linkerd install` command:

```console
kubectl get svc --namespace linkerd --output wide
kubectl get pod --namespace linkerd --output wide
```

The following example output shows the services and pods (scheduled on Linux nodes) that should now be running:

```console
NAME                     TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE  SELECTOR
linkerd-controller-api   ClusterIP   10.0.110.67    <none>        8085/TCP            66s  linkerd.io/control-plane-component=controller
linkerd-destination      ClusterIP   10.0.224.29    <none>        8086/TCP            66s  linkerd.io/control-plane-component=controller
linkerd-dst              ClusterIP   10.0.225.148   <none>        8086/TCP            66s  linkerd.io/control-plane-component=destination
linkerd-grafana          ClusterIP   10.0.61.124    <none>        3000/TCP            65s  linkerd.io/control-plane-component=grafana
linkerd-identity         ClusterIP   10.0.6.104     <none>        8080/TCP            67s  linkerd.io/control-plane-component=identity
linkerd-prometheus       ClusterIP   10.0.27.168    <none>        9090/TCP            65s  linkerd.io/control-plane-component=prometheus
linkerd-proxy-injector   ClusterIP   10.0.100.133   <none>        443/TCP             64s  linkerd.io/control-plane-component=proxy-injector
linkerd-sp-validator     ClusterIP   10.0.221.5     <none>        443/TCP             64s  linkerd.io/control-plane-component=sp-validator
linkerd-tap              ClusterIP   10.0.18.14     <none>        8088/TCP,443/TCP    64s  linkerd.io/control-plane-component=tap
linkerd-web              ClusterIP   10.0.37.108    <none>        8084/TCP,9994/TCP   66s  linkerd.io/control-plane-component=web

NAME                                      READY   STATUS    RESTARTS   AGE   IP            NODE                            NOMINATED NODE   READINESS GATES
linkerd-controller-66ddc9f94f-cm9kt       3/3     Running   0          66s   10.240.0.50   aks-linux-16165125-vmss000001   <none>           <none>
linkerd-destination-c94bc454-qpkng        2/2     Running   0          66s   10.240.0.78   aks-linux-16165125-vmss000002   <none>           <none>
linkerd-grafana-6868fdcb66-4cmq2          2/2     Running   0          65s   10.240.0.69   aks-linux-16165125-vmss000002   <none>           <none>
linkerd-identity-74d8df4b85-tqq8f         2/2     Running   0          66s   10.240.0.48   aks-linux-16165125-vmss000001   <none>           <none>
linkerd-prometheus-699587cf8-k8ghg        2/2     Running   0          65s   10.240.0.41   aks-linux-16165125-vmss000001   <none>           <none>
linkerd-proxy-injector-6556447f64-n29wr   2/2     Running   0          64s   10.240.0.32   aks-linux-16165125-vmss000000   <none>           <none>
linkerd-sp-validator-56745cd567-v4x7h     2/2     Running   0          64s   10.240.0.6    aks-linux-16165125-vmss000000   <none>           <none>
linkerd-tap-5cd9fc566-ct988               2/2     Running   0          64s   10.240.0.15   aks-linux-16165125-vmss000000   <none>           <none>
linkerd-web-774c79b6d5-dhhwf              2/2     Running   0          65s   10.240.0.70   aks-linux-16165125-vmss000002   <none>           <none>
```

Linkerd provides a command via the `linkerd` client binary to validate that the Linkerd control plane was successfully installed and configured.

```console
linkerd check
```

You should see something like the following to indicate that your installation was successful:

```console
kubernetes-api
--------------
√ can initialize the client
√ can query the Kubernetes API

kubernetes-version
------------------
√ is running the minimum Kubernetes API version
√ is running the minimum kubectl version

linkerd-config
--------------
√ control plane Namespace exists
√ control plane ClusterRoles exist
√ control plane ClusterRoleBindings exist
√ control plane ServiceAccounts exist
√ control plane CustomResourceDefinitions exist
√ control plane MutatingWebhookConfigurations exist
√ control plane ValidatingWebhookConfigurations exist
√ control plane PodSecurityPolicies exist

linkerd-existence
-----------------
√ 'linkerd-config' config map exists
√ heartbeat ServiceAccount exist
√ control plane replica sets are ready
√ no unschedulable pods
√ controller pod is running
√ can initialize the client
√ can query the control plane API

linkerd-api
-----------
√ control plane pods are ready
√ control plane self-check
√ [kubernetes] control plane can talk to Kubernetes
√ [prometheus] control plane can talk to Prometheus
√ no invalid service profiles

linkerd-version
---------------
√ can determine the latest version
√ cli is up-to-date

control-plane-version
---------------------
√ control plane is up-to-date
√ control plane and cli versions match

Status check results are √
```

## Access the dashboard

Linkerd comes with a dashboard that provides insight into the service mesh and workloads. To access the dashboard, use the `linkerd dashboard` command. This command leverages [kubectl port-forward][kubectl-port-forward] to create a secure connection between your client machine and the relevant pods in your AKS cluster. It will then automatically open the dashboard in your default browser.

```console
linkerd dashboard
```

The command will also create a port-forward and return a link for the Grafana dashboards.

```console
Linkerd dashboard available at:
http://127.0.0.1:50750
Grafana dashboard available at:
http://127.0.0.1:50750/grafana
Opening Linkerd dashboard in the default browser
```

## Uninstall Linkerd from AKS

> [!WARNING]
> Deleting Linkerd from a running system may result in traffic related issues between your services. Ensure that you have made provisions for your system to still operate correctly without Linkerd before proceeding.

First you'll need to remove the data plane proxies. Remove any Automatic Proxy Injection [annotations][linkerd-automatic-proxy-injection] from workload namespaces and roll out your workload deployments. Your workloads  should no longer have any associated data plane components.

Finally, remove the control plane as follows:

```console
linkerd install --ignore-cluster | kubectl delete -f -
```

## Next steps

To explore more installation and configuration options for Linkerd, see the following official Linkerd guidance:

- [Linkerd - Helm installation][linkerd-install-with-helm]
- [Linkerd - Multi-stage installation to cater for role privileges][linkerd-multi-stage-installation]

You can also follow additional scenarios using:

- [Linkerd emojivoto demo][linkerd-demo-emojivoto]
- [Linkerd books demo][linkerd-demo-books]

<!-- LINKS - external -->

[linkerd]: https://linkerd.io/
[linkerd-cncf]: https://landscape.cncf.io/selected=linkerd
[linkerd-faq]: https://linkerd.io/2/faq/
[linkerd-architecture]: https://linkerd.io/2/reference/architecture/
[linkerd-getting-started]: https://linkerd.io/2/getting-started/
[linkerd-overview]: https://linkerd.io/2/overview/
[linkerd-github]: https://github.com/linkerd/linkerd2
[linkerd-github-releases]: https://github.com/linkerd/linkerd2/releases/

[linkerd-install-with-helm]: https://linkerd.io/2/tasks/install-helm/
[linkerd-multi-stage-installation]: https://linkerd.io/2/tasks/install/#multi-stage-install
[linkerd-automatic-proxy-injection]: https://linkerd.io/2/features/proxy-injection/

[linkerd-demo-emojivoto]: https://linkerd.io/2/getting-started/#step-5-install-the-demo-app
[linkerd-demo-books]: https://linkerd.io/2/tasks/books/

[helm]: https://helm.sh

[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-port-forward]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward

<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md
