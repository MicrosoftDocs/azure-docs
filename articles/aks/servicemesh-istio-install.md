---
title: Install Istio in Azure Kubernetes Service (AKS)
description: Learn how to install and use Istio to create a service mesh in an Azure Kubernetes Service (AKS) cluster
author: paulbouwer
ms.topic: article
ms.date: 02/19/2020
ms.author: pabouwer
zone_pivot_groups: client-operating-system
---

# Install and use Istio in Azure Kubernetes Service (AKS)

[Istio][istio-github] is an open-source service mesh that provides a key set of functionality across the microservices in a Kubernetes cluster. These features include traffic management, service identity and security, policy enforcement, and observability. For more information about Istio, see the official [What is Istio?][istio-docs-concepts] documentation.

This article shows you how to install Istio. The Istio `istioctl` client binary is installed onto your client machine and the Istio components are installed into a Kubernetes cluster on AKS.

> [!NOTE]
> The following instructions reference Istio version `1.4.0`.
>
> The Istio `1.4.x` releases have been tested by the Istio team against Kubernetes versions `1.13`, `1.14`, `1.15`. You can find additional Istio versions at [GitHub - Istio Releases][istio-github-releases], information about each of the releases at [Istio News][istio-release-notes] and supported Kubernetes versions at [Istio General FAQ][istio-faq].

In this article, you learn how to:

> [!div class="checklist"]
> * Download and install the Istio istioctl client binary
> * Install Istio on AKS
> * Validate the Istio installation
> * Access the add-ons
> * Uninstall Istio from AKS

## Before you begin

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.13` and above, with RBAC enabled) and have established a `kubectl` connection with the cluster. If you need help with any of these items, then see the [AKS quickstart][aks-quickstart].

Make sure that you have read the [Istio Performance and Scalability](https://istio.io/docs/concepts/performance-and-scalability/) documentation to understand the additional resource requirements for running Istio in your AKS cluster. The core and memory requirements will vary based on your specific workload. Choose an appropriate number of nodes and VM size to cater for your setup.

This article separates the Istio installation guidance into several discrete steps. The end result is the same in structure as the official Istio installation [guidance][istio-install-istioctl].

::: zone pivot="client-operating-system-linux"

[!INCLUDE [Linux - download and install client binary](includes/servicemesh/istio/install-client-binary-linux.md)]

::: zone-end

::: zone pivot="client-operating-system-macos"

[!INCLUDE [MacOS - download and install client binary](includes/servicemesh/istio/install-client-binary-macos.md)]

::: zone-end

::: zone pivot="client-operating-system-windows"

[!INCLUDE [Windows - download and install client binary](includes/servicemesh/istio/install-client-binary-windows.md)]

::: zone-end

## Install the Istio components on AKS

We'll be installing [Grafana][grafana] and [Kiali][kiali] as part of our Istio installation. Grafana provides analytics and monitoring dashboards, and Kiali provides a service mesh observability dashboard. In our setup, each of these components requires credentials that must be provided as a [Secret][kubernetes-secrets].

Before we can install the Istio components, we must create the secrets for both Grafana and Kiali. These secrets need to be installed into the `istio-system` namespace that will be used by Istio, so we'll need to create the namespace too. We need to use the `--save-config` option when creating the namespace via `kubectl create` so that the Istio installer can run `kubectl apply` on this object in the future.

```console
kubectl create namespace istio-system --save-config
```

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

Now that we've successfully created the Grafana and Kiali secrets in our AKS cluster, it's time to install the Istio components. 

The [Helm][helm] installation approach for Istio will be deprecated in the future. The new installation approach for Istio leverages the `istioctl` client binary, the [Istio configuration profiles][istio-configuration-profiles], and the new [Istio control plane spec and api][istio-control-plane]. This new approach is what we'll be using to install Istio.

> [!NOTE]
> Istio currently must be scheduled to run on Linux nodes. If you have Windows Server nodes in your cluster, you must ensure that the Istio pods are only scheduled to run on Linux nodes. We'll use [node selectors][kubernetes-node-selectors] to make sure pods are scheduled to the correct nodes.

> [!CAUTION]
> The [SDS (secret discovery service)][istio-feature-sds] and [Istio CNI][istio-feature-cni] Istio features are currently in [Alpha][istio-feature-stages], so thought should be given before enabling these. 
>
> Note that the [Service Account Token Volume Projection][kubernetes-feature-sa-projected-volume] Kubernetes feature (a requirement for SDS) is now **enabled** for all Kubernetes 1.13 and higher versions on AKS.

Create a file called `istio.aks.yaml` with the following content. This file will hold the [Istio control plane spec][istio-control-plane] details for configuring Istio.

```yaml
apiVersion: install.istio.io/v1alpha2
kind: IstioControlPlane
spec:
  # Use the default profile as the base
  # More details at: https://istio.io/docs/setup/additional-setup/config-profiles/
  profile: default
  values:
    global:
      # Ensure that the Istio pods are only scheduled to run on Linux nodes
      defaultNodeSelector:
        beta.kubernetes.io/os: linux
      # Enable mutual TLS for the control plane
      controlPlaneSecurityEnabled: true
      mtls:
        # Require all service to service communication to have mtls
        enabled: false
    grafana:
      # Enable Grafana deployment for analytics and monitoring dashboards
      enabled: true
      security:
        # Enable authentication for Grafana
        enabled: true
    kiali:
      # Enable the Kiali deployment for a service mesh observability dashboard
      enabled: true
    tracing:
      # Enable the Jaeger deployment for tracing
      enabled: true
```

Install istio using the `istioctl apply` command and the above `istio.aks.yaml` Istio control plane spec file as follows:

```console
istioctl manifest apply -f istio.aks.yaml --logtostderr --set installPackagePath=./install/kubernetes/operator/charts
```

The installer will deploy a number of [CRDs][kubernetes-crd] and then manage dependencies to install all of the relevant objects defined for this configuration of Istio. You should see something like the following output snippet.

```console
Applying manifests for these components:
- Tracing
- EgressGateway
- NodeAgent
- Grafana
- Policy
- Citadel
- CertManager
- IngressGateway
- Injector
- Prometheus
- PrometheusOperator
- Kiali
- Telemetry
- Galley
- Cni
- Pilot
- Base
- CoreDNS
NodeAgent is waiting on a prerequisite...
Telemetry is waiting on a prerequisite...
Galley is waiting on a prerequisite...
Cni is waiting on a prerequisite...
Grafana is waiting on a prerequisite...
Policy is waiting on a prerequisite...
Citadel is waiting on a prerequisite...
EgressGateway is waiting on a prerequisite...
Tracing is waiting on a prerequisite...
Kiali is waiting on a prerequisite...
PrometheusOperator is waiting on a prerequisite...
IngressGateway is waiting on a prerequisite...
Prometheus is waiting on a prerequisite...
CertManager is waiting on a prerequisite...
Injector is waiting on a prerequisite...
Pilot is waiting on a prerequisite...
Applying manifest for component Base
Waiting for CRDs to be applied.
CRDs applied.
Finished applying manifest for component Base
Prerequisite for Tracing has completed, proceeding with install.
Prerequisite for Injector has completed, proceeding with install.
Prerequisite for Telemetry has completed, proceeding with install.
Prerequisite for Policy has completed, proceeding with install.
Prerequisite for PrometheusOperator has completed, proceeding with install.
Prerequisite for NodeAgent has completed, proceeding with install.
Prerequisite for IngressGateway has completed, proceeding with install.
Prerequisite for Kiali has completed, proceeding with install.
Prerequisite for EgressGateway has completed, proceeding with install.
Prerequisite for Galley has completed, proceeding with install.
Prerequisite for Grafana has completed, proceeding with install.
Prerequisite for Cni has completed, proceeding with install.
Prerequisite for Citadel has completed, proceeding with install.
Applying manifest for component Tracing
Prerequisite for Prometheus has completed, proceeding with install.
Prerequisite for Pilot has completed, proceeding with install.
Prerequisite for CertManager has completed, proceeding with install.
Applying manifest for component Kiali
Applying manifest for component Prometheus
Applying manifest for component IngressGateway
Applying manifest for component Policy
Applying manifest for component Telemetry
Applying manifest for component Citadel
Applying manifest for component Galley
Applying manifest for component Pilot
Applying manifest for component Injector
Applying manifest for component Grafana
Finished applying manifest for component Kiali
Finished applying manifest for component Tracing
Finished applying manifest for component Prometheus
Finished applying manifest for component Citadel
Finished applying manifest for component Policy
Finished applying manifest for component IngressGateway
Finished applying manifest for component Injector
Finished applying manifest for component Galley
Finished applying manifest for component Pilot
Finished applying manifest for component Grafana
Finished applying manifest for component Telemetry

Component IngressGateway installed successfully:
================================================

serviceaccount/istio-ingressgateway-service-account created
deployment.apps/istio-ingressgateway created
gateway.networking.istio.io/ingressgateway created
sidecar.networking.istio.io/default created
poddisruptionbudget.policy/ingressgateway created
horizontalpodautoscaler.autoscaling/istio-ingressgateway created
service/istio-ingressgateway created

...
```

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
NAME                     TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                                                                                                                      AGE   SELECTOR
grafana                  ClusterIP      10.0.116.147   <none>           3000/TCP                                                                                                                     92s   app=grafana
istio-citadel            ClusterIP      10.0.248.152   <none>           8060/TCP,15014/TCP                                                                                                           94s   app=citadel
istio-galley             ClusterIP      10.0.50.100    <none>           443/TCP,15014/TCP,9901/TCP,15019/TCP                                                                                         93s   istio=galley
istio-ingressgateway     LoadBalancer   10.0.36.213    20.188.221.111   15020:30369/TCP,80:31368/TCP,443:30045/TCP,15029:32011/TCP,15030:31212/TCP,15031:32411/TCP,15032:30009/TCP,15443:30010/TCP   93s   app=istio-ingressgateway
istio-pilot              ClusterIP      10.0.23.222    <none>           15010/TCP,15011/TCP,8080/TCP,15014/TCP                                                                                       93s   istio=pilot
istio-policy             ClusterIP      10.0.59.250    <none>           9091/TCP,15004/TCP,15014/TCP                                                                                                 93s   istio-mixer-type=policy,istio=mixer
istio-sidecar-injector   ClusterIP      10.0.123.219   <none>           443/TCP                                                                                                                      93s   istio=sidecar-injector
istio-telemetry          ClusterIP      10.0.216.9     <none>           9091/TCP,15004/TCP,15014/TCP,42422/TCP                                                                                       89s   istio-mixer-type=telemetry,istio=mixer
jaeger-agent             ClusterIP      None           <none>           5775/UDP,6831/UDP,6832/UDP                                                                                                   96s   app=jaeger
jaeger-collector         ClusterIP      10.0.221.24    <none>           14267/TCP,14268/TCP,14250/TCP                                                                                                95s   app=jaeger
jaeger-query             ClusterIP      10.0.46.154    <none>           16686/TCP                                                                                                                    95s   app=jaeger
kiali                    ClusterIP      10.0.174.97    <none>           20001/TCP                                                                                                                    94s   app=kiali
prometheus               ClusterIP      10.0.245.226   <none>           9090/TCP                                                                                                                     94s   app=prometheus
tracing                  ClusterIP      10.0.249.95    <none>           9411/TCP                                                                                                                     95s   app=jaeger
zipkin                   ClusterIP      10.0.154.89    <none>           9411/TCP                                                                                                                     94s   app=jaeger
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
NAME                                          READY   STATUS    RESTARTS   AGE
grafana-6bc97ff99-k9sk4                       1/1     Running   0          92s
istio-citadel-6b5c754454-tb8nf                1/1     Running   0          94s
istio-galley-7d6d78d7c5-zshsd                 2/2     Running   0          94s
istio-ingressgateway-85869c5cc7-x5d76         1/1     Running   0          95s
istio-pilot-787d6995b5-n5vrj                  2/2     Running   0          94s
istio-policy-6cf4fbc8dc-sdsg5                 2/2     Running   2          94s
istio-sidecar-injector-5d5b978668-wrz2s       1/1     Running   0          94s
istio-telemetry-5498db684-6kdnw               2/2     Running   1          94s
istio-tracing-78548677bc-74tx6                1/1     Running   0          96s
kiali-59b7fd7f68-92zrh                        1/1     Running   0          95s
prometheus-7c7cf9dbd6-rjxcv                   1/1     Running   0          94s
```

All of the pods should show a status of `Running`. If your pods don't have these statuses, wait a minute or two until they do. If any pods report an issue, use the [kubectl describe pod][kubectl-describe] command to review their output and status.

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

To remove Istio from your AKS cluster, use the `istioctl manifest generate` command with the `istio.aks.yaml` Istio control plane spec file. This will generate the deployed manifest, which we will pipe to `kubectl delete` in order to remove all the installed components and the `istio-system` namespace.

```console
istioctl manifest generate -f istio.aks.yaml -o istio-components-aks --logtostderr --set installPackagePath=./install/kubernetes/operator/charts 

kubectl delete -f istio-components-aks -R
```

### Remove Istio CRDs and Secrets

The above commands delete all the Istio components and namespace, but we are still left with generated Istio secrets. 

::: zone pivot="client-operating-system-linux"

[!INCLUDE [Bash - remove Istio secrets](includes/servicemesh/istio/uninstall-bash.md)]

::: zone-end

::: zone pivot="client-operating-system-macos"

[!INCLUDE [Bash - remove Istio secrets](includes/servicemesh/istio/uninstall-bash.md)]

::: zone-end

::: zone pivot="client-operating-system-windows"

[!INCLUDE [PowerShell - remove Istio secrets](includes/servicemesh/istio/uninstall-powershell.md)]

::: zone-end

## Next steps

The following documentation describes how you can use Istio to provide intelligent routing to roll out a canary release:

> [!div class="nextstepaction"]
> [AKS Istio intelligent routing scenario][istio-scenario-routing]

To explore more installation and configuration options for Istio, see the following official Istio guidance:

- [Istio - installation guides][istio-installation-guides]

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
[istio-installation-guides]: https://istio.io/docs/setup/install/
[istio-install-download]: https://istio.io/docs/setup/kubernetes/download-release/
[istio-install-istioctl]: https://istio.io/docs/setup/install/istioctl/
[istio-configuration-profiles]: https://istio.io/docs/setup/additional-setup/config-profiles/
[istio-control-plane]: https://istio.io/docs/reference/config/istio.operator.v1alpha1/
[istio-bookinfo-example]: https://istio.io/docs/examples/bookinfo/

[istio-feature-stages]: https://istio.io/about/feature-stages/
[istio-feature-sds]: https://istio.io/docs/tasks/traffic-management/ingress/secure-ingress-sds/
[istio-feature-cni]: https://istio.io/docs/setup/additional-setup/cni/

[install-wsl]: https://docs.microsoft.com/windows/wsl/install-win10

[kubernetes-feature-sa-projected-volume]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection
[kubernetes-crd]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions
[kubernetes-secrets]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-node-selectors]: https://docs.microsoft.com/azure/aks/concepts-clusters-workloads#node-selectors
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
