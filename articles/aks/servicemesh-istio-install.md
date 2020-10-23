---
title: Install Istio in Azure Kubernetes Service (AKS)
description: Learn how to install and use Istio to create a service mesh in an Azure Kubernetes Service (AKS) cluster
author: paulbouwer
ms.topic: article
ms.date: 10/02/2020
ms.author: pabouwer
zone_pivot_groups: client-operating-system
---

# Install and use Istio in Azure Kubernetes Service (AKS)

[Istio][istio-github] is an open-source service mesh that provides a key set of functionality across the microservices in a Kubernetes cluster. These features include traffic management, service identity and security, policy enforcement, and observability. For more information about Istio, see the official [What is Istio?][istio-docs-concepts] documentation.

This article shows you how to install Istio. The Istio `istioctl` client binary is installed onto your client machine and the Istio components are installed into a Kubernetes cluster on AKS.

> [!NOTE]
> The following instructions reference Istio version `1.7.3`.
>
> The Istio `1.7.x` releases have been tested by the Istio team against Kubernetes version `1.16+`. You can find additional Istio versions at [GitHub - Istio Releases][istio-github-releases], information about each of the releases at [Istio News][istio-release-notes] and supported Kubernetes versions at [Istio General FAQ][istio-faq].

In this article, you learn how to:

> [!div class="checklist"]
> * Download and install the Istio istioctl client binary
> * Install Istio on AKS
> * Validate the Istio installation
> * Access the add-ons
> * Uninstall Istio from AKS

## Before you begin

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.16` and above, with RBAC enabled) and have established a `kubectl` connection with the cluster. If you need help with any of these items, then see the [AKS quickstart][aks-quickstart].

Make sure that you have read the [Istio Performance and Scalability](https://istio.io/docs/concepts/performance-and-scalability/) documentation to understand the additional resource requirements for running Istio in your AKS cluster. The core and memory requirements will vary based on your specific workload. Choose an appropriate number of nodes and VM size to cater for your setup.

This article separates the Istio installation guidance into several discrete steps. The end result is the same in structure as the official Istio installation [guidance][istio-install-istioctl].

::: zone pivot="client-operating-system-linux"

[!INCLUDE [Linux - download and install client binary](includes/servicemesh/istio/install-client-binary-linux.md)]

::: zone-end

::: zone pivot="client-operating-system-macos"

[!INCLUDE [macOS - download and install client binary](includes/servicemesh/istio/install-client-binary-macos.md)]

::: zone-end

::: zone pivot="client-operating-system-windows"

[!INCLUDE [Windows - download and install client binary](includes/servicemesh/istio/install-client-binary-windows.md)]

::: zone-end

## Install the Istio Operator on AKS

Istio provides an [Operator][istio-install-operator] to manage installation and updates to the Istio components within your AKS cluster. We'll install the Istio Operator using the `istioctl` client binary.

```bash
istioctl operator init
```

You should see something like the following output to confirm that the Istio Operator has been installed.

```console
Using operator Deployment image: docker.io/istio/operator:1.7.3
✔ Istio operator installed
✔ Installation complete
```

The Istio Operator is installed into the `istio-operator` namespace. Query the namespace.

```bash
kubectl get all -n istio-operator
```

You should see the following components deployed.

```console
NAME                                  READY   STATUS    RESTARTS   AGE
pod/istio-operator-6d7958b7bf-wxgdc   1/1     Running   0          2m43s

NAME                     TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
service/istio-operator   ClusterIP   10.0.8.57    <none>        8383/TCP   2m43s

NAME                             READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/istio-operator   1/1     1            1           2m43s

NAME                                        DESIRED   CURRENT   READY   AGE
replicaset.apps/istio-operator-6d7958b7bf   1         1         1       2m43s
```

You can learn more about the Operator pattern and how it can help automate complex tasks via [kubernetes.io][kubernetes-operator].


### Install Istio components

Now that we've successfully installed the Istio Operator in our AKS cluster, it's time to install the Istio components. 

We will leverage the `default` [Istio Configuration Profile][istio-configuration-profiles] to build the [Istio Operator Spec][istio-control-plane].

You can run the following `istioctl` command to view the configuration for the `default` Istio Configuration Profile.

```bash
istioctl profile dump default
```

> [!NOTE]
> Istio currently must be scheduled to run on Linux nodes. If you have Windows Server nodes in your cluster, you must ensure that the Istio pods are only scheduled to run on Linux nodes. We'll use [node selectors][kubernetes-node-selectors] to make sure pods are scheduled to the correct nodes.

> [!CAUTION]
> The [Istio CNI][istio-feature-cni] Istio features are currently in [Alpha][istio-feature-stages], so thought should be given before enabling these. 

Create a file called `istio.aks.yaml` with the following content. This file will hold the [Istio Operator Spec][istio-control-plane] for configuring Istio.

```yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
  name: istio-control-plane
spec:
  # Use the default profile as the base
  # More details at: https://istio.io/docs/setup/additional-setup/config-profiles/
  profile: default
  # Enable the addons that we will want to use
  addonComponents:
    grafana:
      enabled: true
    prometheus:
      enabled: true
    tracing:
      enabled: true
    kiali:
      enabled: true
  values:
    global:
      # Ensure that the Istio pods are only scheduled to run on Linux nodes
      defaultNodeSelector:
        beta.kubernetes.io/os: linux
    kiali:
      dashboard:
        auth:
          strategy: anonymous 
```

Create the `istio-system` namespace and deploy the Istio Operator Spec to that namespace. The Istio Operator will be watching for the Istio Operator Spec and will use it to install and configure Istio in your AKS cluster.

```bash
kubectl create ns istio-system

kubectl apply -f istio.aks.yaml 
```

At this point, you've deployed Istio to your AKS cluster. To ensure that we have a successful deployment of Istio, let's move on to the next section to [Validate the Istio installation](#validate-the-istio-installation).

## Validate the Istio installation

Query the `istio-system` namespace, where the Istio and add-on components were installed by the Istio Operator:

```bash
kubectl get all -n istio-system
```

You should see the following components:

- `istio*` - the Istio components
- `jaeger-*`, `tracing`, and `zipkin` - tracing addon
- `prometheus` - metrics addon
- `grafana` - analytics and monitoring dashboard addon
- `kiali` - service mesh dashboard addon

```console
NAME                                        READY   STATUS    RESTARTS   AGE
pod/grafana-7cf9794c74-mpfbp                1/1     Running   0          5m53s
pod/istio-ingressgateway-86b5dbdcb9-ndrp5   1/1     Running   0          5m57s
pod/istio-tracing-c98f4b8fc-zqklg           1/1     Running   0          82s
pod/istiod-6965c56995-4ph9h                 1/1     Running   0          6m15s
pod/kiali-7b44985d68-p87zh                  1/1     Running   0          81s
pod/prometheus-6868989549-5ghzz             1/1     Running   0          81s

NAME                                TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)                                                      AGE
service/grafana                     ClusterIP      10.0.226.39    <none>         3000/TCP                                                     5m54s
service/istio-ingressgateway        LoadBalancer   10.0.143.56    20.53.72.254   15021:32166/TCP,80:31684/TCP,443:31302/TCP,15443:30863/TCP   5m57s
service/istiod                      ClusterIP      10.0.211.228   <none>         15010/TCP,15012/TCP,443/TCP,15014/TCP,853/TCP                6m16s
service/jaeger-agent                ClusterIP      None           <none>         5775/UDP,6831/UDP,6832/UDP                                   82s
service/jaeger-collector            ClusterIP      10.0.7.62      <none>         14267/TCP,14268/TCP,14250/TCP                                82s
service/jaeger-collector-headless   ClusterIP      None           <none>         14250/TCP                                                    82s
service/jaeger-query                ClusterIP      10.0.52.172    <none>         16686/TCP                                                    82s
service/kiali                       ClusterIP      10.0.71.179    <none>         20001/TCP                                                    82s
service/prometheus                  ClusterIP      10.0.171.151   <none>         9090/TCP                                                     82s
service/tracing                     ClusterIP      10.0.195.137   <none>         80/TCP                                                       82s
service/zipkin                      ClusterIP      10.0.136.111   <none>         9411/TCP                                                     82s

NAME                                   READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/grafana                1/1     1            1           5m54s
deployment.apps/istio-ingressgateway   1/1     1            1           5m58s
deployment.apps/istio-tracing          1/1     1            1           83s
deployment.apps/istiod                 1/1     1            1           6m16s
deployment.apps/kiali                  1/1     1            1           83s
deployment.apps/prometheus             1/1     1            1           82s

NAME                                              DESIRED   CURRENT   READY   AGE
replicaset.apps/grafana-7cf9794c74                1         1         1       5m54s
replicaset.apps/istio-ingressgateway-86b5dbdcb9   1         1         1       5m58s
replicaset.apps/istio-tracing-c98f4b8fc           1         1         1       83s
replicaset.apps/istiod-6965c56995                 1         1         1       6m16s
replicaset.apps/kiali-7b44985d68                  1         1         1       82s
replicaset.apps/prometheus-6868989549             1         1         1       82s

NAME                                                       REFERENCE                         TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
horizontalpodautoscaler.autoscaling/istio-ingressgateway   Deployment/istio-ingressgateway   7%/80%    1         5         1          5m57s
horizontalpodautoscaler.autoscaling/istiod                 Deployment/istiod                 1%/80%    1         5         1          6m16s
```

You can also gain additional insight into the installation by watching the logs for the Istio Operator.

```bash
kubectl logs -n istio-operator -l name=istio-operator -f
```

If the `istio-ingressgateway` shows an external ip of `<pending>`, wait a few minutes until an IP address has been assigned by Azure networking.

All of the pods should show a status of `Running`. If your pods don't have these statuses, wait a minute or two until they do. If any pods report an issue, use the [kubectl describe pod][kubectl-describe] command to review their output and status.

## Accessing the add-ons

A number of add-ons were installed by the Istio Operator that provide additional functionality. The web applications for the add-ons are **not** exposed publicly via an external ip address. 

To access the add-on user interfaces, use the `istioctl dashboard` command. This command uses [kubectl port-forward][kubectl-port-forward] and a random port to create a secure connection between your client machine and the relevant pod in your AKS cluster. It will then automatically open the add-on web application in your default browser.

### Grafana

The analytics and monitoring dashboards for Istio are provided by [Grafana][grafana]. Remember to use the credentials you created via the Grafana secret earlier when prompted. Open the Grafana dashboard securely as follows:

```console
istioctl dashboard grafana
```

### Prometheus

Metrics for Istio are provided by [Prometheus][prometheus]. Open the Prometheus dashboard securely as follows:

```console
istioctl dashboard prometheus
```

### Jaeger

Tracing within Istio is provided by [Jaeger][jaeger]. Open the Jaeger dashboard securely as follows:

```console
istioctl dashboard jaeger
```

### Kiali

A service mesh observability dashboard is provided by [Kiali][kiali]. Remember to use the credentials you created via the Kiali secret earlier when prompted. Open the Kiali dashboard securely as follows:

```console
istioctl dashboard kiali
```

### Envoy

A simple interface to the [Envoy][envoy] proxies is available. It provides configuration information and metrics for an Envoy proxy running in a specified pod. Open the Envoy interface securely as follows:

```console
istioctl dashboard envoy <pod-name>.<namespace>
```

## Uninstall Istio from AKS

> [!WARNING]
> Deleting Istio from a running system may result in traffic related issues between your services. Ensure that you have made provisions for your system to still operate correctly without Istio before proceeding.

### Remove Istio

To remove Istio from your AKS cluster, delete the `IstioOperator` resource named `istio-control-plane` that we added earlier. The Istio Operator will recognize that the Istio Operator Spec has been removed, and then delete all the associated Istio components.

```bash
kubectl delete istiooperator istio-control-plane -n istio-system
```

You can run the following to check when all the Istio components have been deleted.

```bash
kubectl get all -n istio-system
```

### Remove Istio Operator

Once Istio has been successfully uninstalled, you can also remove the Istio Operator.

```bash
istioctl operator remove
```

And then finally, remove the `istio-` namespaces.

```bash
kubectl delete ns istio-system
kubectl delete ns istio-operator
```

## Next steps

To explore more installation and configuration options for Istio, see the following official Istio guidance:

- [Istio - installation guides][istio-installation-guides]

You can also follow additional scenarios using:

- [Istio Bookinfo Application example][istio-bookinfo-example]

<!-- LINKS - external -->
[istio]: https://istio.io
[helm]: https://helm.sh

[istio-faq]: https://istio.io/faq/general/
[istio-docs-concepts]: https://istio.io/docs/concepts/what-is-istio/
[istio-github]: https://github.com/istio/istio
[istio-github-releases]: https://github.com/istio/istio/releases
[istio-release-notes]: https://istio.io/news/
[istio-installation-guides]: https://istio.io/docs/setup/install/
[istio-install-download]: https://istio.io/docs/setup/kubernetes/download-release/
[istio-install-istioctl]: https://istio.io/docs/setup/install/istioctl/
[istio-install-operator]: https://istio.io/latest/docs/setup/install/operator/
[istio-configuration-profiles]: https://istio.io/docs/setup/additional-setup/config-profiles/
[istio-control-plane]: https://istio.io/docs/reference/config/istio.operator.v1alpha1/
[istio-bookinfo-example]: https://istio.io/docs/examples/bookinfo/

[istio-feature-stages]: https://istio.io/about/feature-stages/
[istio-feature-sds]: https://istio.io/docs/tasks/traffic-management/ingress/secure-ingress-sds/
[istio-feature-cni]: https://istio.io/docs/setup/additional-setup/cni/

[kubernetes-operator]: https://kubernetes.io/docs/concepts/extend-kubernetes/operator/
[kubernetes-feature-sa-projected-volume]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection
[kubernetes-crd]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions
[kubernetes-secrets]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-node-selectors]: ./concepts-clusters-workloads.md#node-selectors
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-port-forward]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward

[grafana]: https://grafana.com/
[prometheus]: https://prometheus.io/
[jaeger]: https://www.jaegertracing.io/
[kiali]: https://www.kiali.io/
[envoy]: https://www.envoyproxy.io/

<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md
