---
title: Install Istio in Azure Kubernetes Service (AKS)
description: Learn how to install and use Istio to create a service mesh in an Azure Kubernetes Service (AKS) cluster
author: paulbouwer

ms.service: container-service
ms.topic: article
ms.date: 10/09/2019
ms.author: pabouwer
zone_pivot_groups: client-operating-system
---

# Install and use Istio in Azure Kubernetes Service (AKS)

[Istio][istio-github] is an open-source service mesh that provides a key set of functionality across the microservices in a Kubernetes cluster. These features include traffic management, service identity and security, policy enforcement, and observability. For more information about Istio, see the official [What is Istio?][istio-docs-concepts] documentation.

This article shows you how to install Istio. The Istio `istioctl` client binary is installed onto your client machine and the Istio components are installed into a Kubernetes cluster on AKS.

> [!NOTE]
> These instructions reference Istio version `1.3.2`, and use at least Helm version `2.14.2`.
>
> The Istio `1.3.x` releases have been tested by the Istio team against Kubernetes versions `1.13`, `1.14`, `1.15`. You can find additional Istio versions at [GitHub - Istio Releases][istio-github-releases], information about each of the releases at [Istio News][istio-release-notes] and supported Kubernetes versions at [Istio General FAQ][istio-faq].

In this article, you learn how to:

> [!div class="checklist"]
> * Download and install the Istio istioctl client binary
> * Install Istio on AKS
> * Validate the Istio installation
> * Access the add-ons
> * Uninstall Istio from AKS

## Before you begin

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.13` and above, with RBAC enabled) and have established a `kubectl` connection with the cluster. If you need help with any of these items, then see the [AKS quickstart][aks-quickstart].

You'll need [Helm][helm] to follow these instructions and install Istio. It's recommended that you have the latest stable version correctly installed and configured in your cluster. If you need help with installing Helm, then see the [AKS Helm installation guidance][helm-install]. All Istio pods must also be scheduled to run on Linux nodes.

Ensure that you have read the [Istio Performance and Scalability](https://istio.io/docs/concepts/performance-and-scalability/) documentation to understand the additional resource requirements for running Istio in your AKS cluster. The core and memory requirements will vary based on your specific workload. Choose an appropriate number of nodes and VM size to cater for your setup.

This article separates the Istio installation guidance into several discrete steps. The end result is the same in structure as the official Istio installation [guidance][istio-install-helm].

::: zone pivot="client-operating-system-linux"

[!INCLUDE [Linux - download and install client binary](includes/servicemesh/istio/install-client-binary-linux.md)]

::: zone-end

::: zone pivot="client-operating-system-macos"

[!INCLUDE [MacOS - download and install client binary](includes/servicemesh/istio/install-client-binary-macos.md)]

::: zone-end

::: zone pivot="client-operating-system-windows"

[!INCLUDE [Windows - download and install client binary](includes/servicemesh/istio/install-client-binary-windows.md)]

::: zone-end

## Add the Istio Helm chart repository

Add the Istio Helm chart repository for the Istio release. Ensure that you run the `helm repo update` to update your local information for the chart repository.

```azurecli
helm repo add istio.io https://storage.googleapis.com/istio-release/releases/$ISTIO_VERSION/charts/
helm repo update
```

## Install the Istio CRDs on AKS

Istio uses [Custom Resource Definitions (CRDs)][kubernetes-crd] to manage its runtime configuration. We need to install the Istio CRDs first, since the Istio components have a dependency on them. Use Helm and the `istio-init` chart to install the Istio CRDs into the `istio-system` namespace in your AKS cluster:

```azurecli
helm install istio.io/istio-init --name istio-init --namespace istio-system
```

[Jobs][kubernetes-jobs] are deployed as part of the `istio-init` Helm Chart to install the CRDs. These jobs should take less than 20s to complete, depending on your cluster environment. You can verify that the jobs have successfully completed as follows:

```azurecli
kubectl get jobs -n istio-system
```

The following example output shows the successfully completed jobs.

```console
NAME                      COMPLETIONS   DURATION   AGE
istio-init-crd-10-1.3.2   1/1           14s        14s
istio-init-crd-11-1.3.2   1/1           12s        14s
istio-init-crd-12-1.3.2   1/1           14s        14s
```

Now that we've confirmed the successful completion of the jobs, let's verify that we have the correct number of Istio CRDs installed. You can verify that all 23 Istio CRDs have been installed by running the following command. The command should return the number `23`.

::: zone pivot="client-operating-system-linux"

[!INCLUDE [Bash - check CRD count](includes/servicemesh/istio/install-check-crd-count-bash.md)]

::: zone-end

::: zone pivot="client-operating-system-macos"

[!INCLUDE [Bash - check CRD count](includes/servicemesh/istio/install-check-crd-count-bash.md)]

::: zone-end

::: zone pivot="client-operating-system-windows"

[!INCLUDE [PowerShell - check CRD count](includes/servicemesh/istio/install-check-crd-count-powershell.md)]

::: zone-end

If you've got to this point, then that means you have successfully installed the Istio CRDs. Now move on to the next section to [Install the Istio components on AKS](#install-the-istio-components-on-aks).

## Install the Istio components on AKS

We'll be installing [Grafana][grafana] and [Kiali][kiali] as part of our Istio installation. Grafana provides analytics and monitoring dashboards, and Kiali provides a service mesh observability dashboard. In our setup, each of these components requires credentials that must be provided as a [Secret][kubernetes-secrets].

Before we can install the Istio components, we must create the secrets for both Grafana and Kiali. 

::: zone pivot="client-operating-system-linux"

[!INCLUDE [Bash - create secrets for Grafana and Kiali](includes/servicemesh/istio/install-create-secrets-bash.md)]

::: zone-end

::: zone pivot="client-operating-system-macos"

[!INCLUDE [Bash check for CRDs](includes/servicemesh/istio/install-create-secrets-bash.md)]

::: zone-end

::: zone pivot="client-operating-system-windows"

[!INCLUDE [PowerShell check for CRDs](includes/servicemesh/istio/install-create-secrets-powershell.md)]

::: zone-end

### Install Istio components

Now that we've successfully created the Grafana and Kiali secrets in our AKS cluster, it's time to install the Istio components. Use Helm and the `istio` chart to install the Istio components into the `istio-system` namespace in your AKS cluster. 

> [!NOTE]
> **Installation options**
> 
> We are using the following options as part of our installation:
> - `global.controlPlaneSecurityEnabled=true` - mutual TLS enabled for the control plane
> - `global.mtls.enabled=true` - require all service to service communication to have mtls
> - `grafana.enabled=true` - enable Grafana deployment for analytics and monitoring dashboards
> - `grafana.security.enabled=true` - enable authentication for Grafana
> - `tracing.enabled=true` - enable the Jaeger deployment for tracing
> - `kiali.enabled=true` - enable the Kiali deployment for a service mesh observability dashboard
>
> **Node selectors**
>
> Istio currently must be scheduled to run on Linux nodes. If you have Windows Server nodes in your cluster, you must ensure that the Istio pods are only scheduled to run on Linux nodes. We'll use [node selectors][kubernetes-node-selectors] to make sure pods are scheduled to the correct nodes.

> [!CAUTION]
> The [SDS (secret discovery service)][istio-feature-sds] and [Istio CNI][istio-feature-cni] Istio features are currently in [Alpha][istio-feature-stages], so thought should be given before enabling these. In addition, the [Service Account Token Volume Projection][kubernetes-feature-sa-projected-volume] Kubernetes feature (a requirement for SDS) is not enabled in current AKS versions.

::: zone pivot="client-operating-system-linux"

[!INCLUDE [Bash - install Istio components](includes/servicemesh/istio/install-components-bash.md)]

::: zone-end

::: zone pivot="client-operating-system-macos"

[!INCLUDE [Bash - install Istio components](includes/servicemesh/istio/install-components-bash.md)]

::: zone-end

::: zone pivot="client-operating-system-windows"

[!INCLUDE [PowerShell - install Istio components](includes/servicemesh/istio/install-components-powershell.md)]

::: zone-end

The `istio` Helm chart deploys a large number of objects. You can see the list from the output of your `helm install` command above. The deployment of the Istio components should take under 2 minutes to complete, depending on your cluster environment.

At this point, you've deployed Istio to your AKS cluster. To ensure that we have a successful deployment of Istio, let's move on to the next section to [Validate the Istio installation](#validate-the-istio-installation).

## Validate the Istio installation

First confirm that the expected services have been created. Use the [kubectl get svc][kubectl-get] command to view the running services. Query the `istio-system` namespace, where the Istio and add-on components were installed by the `istio` Helm chart:

```console
kubectl get svc --namespace istio-system --output wide
```

The following example output shows the services that should now be running:

- `istio-*` services
- `jaeger-*`, `tracing`, and `zipkin` add-on tracing services
- `prometheus` add-on metrics service
- `grafana` add-on analytics and monitoring dashboard service
- `kiali` add-on service mesh dashboard service

If the `istio-ingressgateway` shows an external ip of `<pending>`, wait a few minutes until an IP address has been assigned by Azure networking.

```console
NAME                     TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                                                                                                                                      AGE   SELECTOR
grafana                  ClusterIP      10.0.164.244   <none>           3000/TCP                                                                                                                                     53s   app=grafana
istio-citadel            ClusterIP      10.0.49.16     <none>           8060/TCP,15014/TCP                                                                                                                           53s   istio=citadel
istio-galley             ClusterIP      10.0.175.173   <none>           443/TCP,15014/TCP,9901/TCP                                                                                                                   53s   istio=galley
istio-ingressgateway     LoadBalancer   10.0.226.151   20.188.221.111   15020:31128/TCP,80:31380/TCP,443:31390/TCP,31400:31400/TCP,15029:30817/TCP,15030:30436/TCP,15031:32485/TCP,15032:30980/TCP,15443:30124/TCP   53s   app=istio-ingressgateway,istio=ingressgateway,release=istio
istio-pilot              ClusterIP      10.0.102.158   <none>           15010/TCP,15011/TCP,8080/TCP,15014/TCP                                                                                                       53s   istio=pilot
istio-policy             ClusterIP      10.0.234.53    <none>           9091/TCP,15004/TCP,15014/TCP                                                                                                                 53s   istio-mixer-type=policy,istio=mixer
istio-sidecar-injector   ClusterIP      10.0.216.8     <none>           443/TCP,15014/TCP                                                                                                                            53s   istio=sidecar-injector
istio-telemetry          ClusterIP      10.0.154.215   <none>           9091/TCP,15004/TCP,15014/TCP,42422/TCP                                                                                                       53s   istio-mixer-type=telemetry,istio=mixer
jaeger-agent             ClusterIP      None           <none>           5775/UDP,6831/UDP,6832/UDP                                                                                                                   52s   app=jaeger
jaeger-collector         ClusterIP      10.0.26.109    <none>           14267/TCP,14268/TCP                                                                                                                          52s   app=jaeger
jaeger-query             ClusterIP      10.0.70.55     <none>           16686/TCP                                                                                                                                    52s   app=jaeger
kiali                    ClusterIP      10.0.36.206    <none>           20001/TCP                                                                                                                                    53s   app=kiali
prometheus               ClusterIP      10.0.236.99    <none>           9090/TCP                                                                                                                                     53s   app=prometheus
tracing                  ClusterIP      10.0.83.152    <none>           80/TCP                                                                                                                                       52s   app=jaeger
zipkin                   ClusterIP      10.0.25.86     <none>           9411/TCP                                                                                                                                     52s   app=jaeger
```

Next, confirm that the required pods have been created. Use the [kubectl get pods][kubectl-get] command, and again query the `istio-system` namespace:

```console
kubectl get pods --namespace istio-system
```

The following example output shows the pods that are running:

- the `istio-*` pods
- the `prometheus-*` add-on metrics pod
- the `grafana-*` add-on analytics and monitoring dashboard pod
- the `kiali` add-on service mesh dashboard pod

```console
NAME                                     READY   STATUS      RESTARTS   AGE
grafana-7c48555456-msl7b                 1/1     Running     0          88s
istio-citadel-566fc66db7-m8wgl           1/1     Running     0          87s
istio-galley-5746db8d56-pl5gg            1/1     Running     0          88s
istio-ingressgateway-6c94f7c9bf-f5lt5    1/1     Running     0          88s
istio-init-crd-10-1.3.2-xw9g2            0/1     Completed   0          92m
istio-init-crd-11-1.3.2-54rz8            0/1     Completed   0          92m
istio-init-crd-12-1.3.2-789qj            0/1     Completed   0          92m
istio-pilot-6748968b6d-rvdfx             2/2     Running     0          87s
istio-policy-7576bbbcf7-2stft            2/2     Running     0          87s
istio-sidecar-injector-76d79d494-7jk9n   1/1     Running     0          87s
istio-telemetry-74b7bf676d-tfrcl         2/2     Running     0          88s
istio-tracing-655d9588bc-d2htg           1/1     Running     0          86s
kiali-65d55bcfb8-tqrfk                   1/1     Running     0          88s
prometheus-846f9849bd-br8kp              1/1     Running     0          87s
```

There should be three `istio-init-crd-*` pods with a `Completed` status. These pods were responsible for running the jobs that created the CRDs in an earlier step. All of the other pods should show a status of `Running`. If your pods don't have these statuses, wait a minute or two until they do. If any pods report an issue, use the [kubectl describe pod][kubectl-describe] command to review their output and status.

## Accessing the add-ons

A number of add-ons were installed by Istio in our setup above that provide additional functionality. The web applications for the add-ons are **not** exposed publicly via an external ip address. 

To access the add-on user interfaces, use the `istioctl dashboard` command. This command leverages [kubectl port-forward][kubectl-port-forward] and a random port to create a secure connection between your client machine and the relevant pod in your AKS cluster. It will then automatically open the add-on web application in your default browser.

We added an additional layer of security for Grafana and Kiali by specifying credentials for them earlier in this article.

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

### Remove Istio components and namespace

To remove Istio from your AKS cluster, use the following commands. The `helm delete` commands will remove the `istio` and `istio-init` charts, and the `kubectl delete namespace` command will remove the `istio-system` namespace.

```azurecli
helm delete --purge istio
helm delete --purge istio-init
kubectl delete namespace istio-system
```

### Remove Istio CRDs and Secrets

The above commands delete all the Istio components and namespace, but we are still left with the Istio CRDs and secrets. 

::: zone pivot="client-operating-system-linux"

[!INCLUDE [Bash - remove Istio CRDs and secrets](includes/servicemesh/istio/uninstall-bash.md)]

::: zone-end

::: zone pivot="client-operating-system-macos"

[!INCLUDE [Bash - remove Istio CRDs and secrets](includes/servicemesh/istio/uninstall-bash.md)]

::: zone-end

::: zone pivot="client-operating-system-windows"

[!INCLUDE [PowerShell - remove Istio CRDs and secrets](includes/servicemesh/istio/uninstall-powershell.md)]

::: zone-end

## Next steps

The following documentation describes how you can use Istio to provide intelligent routing to roll out a canary release:

> [!div class="nextstepaction"]
> [AKS Istio intelligent routing scenario][istio-scenario-routing]

To explore more installation and configuration options for Istio, see the following official Istio articles:

- [Istio - Helm installation guide][istio-install-helm]
- [Istio - Helm installation options][istio-install-helm-options]

You can also follow additional scenarios using:

- [Istio Bookinfo Application example][istio-bookinfo-example]

To learn how to monitor your AKS application using Application Insights and Istio, see the following Azure Monitor documentation:

- [Zero instrumentation application monitoring for Kubernetes hosted applications][app-insights]

<!-- LINKS - external -->
[istio]: https://istio.io
[helm]: https://helm.sh

[istio-faq]: https://istio.io/faq/general/
[istio-docs-concepts]: https://istio.io/docs/concepts/what-is-istio/
[istio-github]: https://github.com/istio/istio
[istio-github-releases]: https://github.com/istio/istio/releases
[istio-release-notes]: https://istio.io/news/
[istio-install-download]: https://istio.io/docs/setup/kubernetes/download-release/
[istio-install-helm]: https://istio.io/docs/setup/install/helm/
[istio-install-helm-options]: https://istio.io/docs/reference/config/installation-options/
[istio-bookinfo-example]: https://istio.io/docs/examples/bookinfo/

[istio-feature-stages]: https://istio.io/about/feature-stages/
[istio-feature-sds]: https://istio.io/docs/tasks/security/auth-sds/
[istio-feature-cni]: https://istio.io/docs/setup/additional-setup/cni/

[install-wsl]: https://docs.microsoft.com/windows/wsl/install-win10

[kubernetes-feature-sa-projected-volume]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection
[kubernetes-crd]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions
[kubernetes-jobs]: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/
[kubernetes-secrets]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-node-selectors]: https://docs.microsoft.com/en-us/azure/aks/concepts-clusters-workloads#node-selectors
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-port-forward]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward

[grafana]: https://grafana.com/
[prometheus]: https://prometheus.io/
[jaeger]: https://www.jaegertracing.io/
[kiali]: https://www.kiali.io/
[envoy]: https://www.envoyproxy.io/

[app-insights]: https://docs.microsoft.com/azure/azure-monitor/app/kubernetes

<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md
[istio-scenario-routing]: ./servicemesh-istio-scenario-routing.md
[helm-install]: ./kubernetes-helm.md
