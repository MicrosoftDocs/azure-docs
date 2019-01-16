---
title: Install Istio in Azure Kubernetes Service (AKS)
description: Learn how to install and ise Istio to create a service mesh in an Azure Kubernetes Service (AKS) cluster
services: container-service
author: paulbouwer

ms.service: container-service
ms.topic: article
ms.date: 12/3/2018
ms.author: pabouwer
---

# Install and use Istio in Azure Kubernetes Service (AKS)

[Istio][istio-github] is an open-source service mesh that provides a key set of functionality across the microservices in a Kubernetes cluster. These features include traffic management, service identity and security, policy enforcement, and observability. For more information about Istio, see the official [What is Istio?][istio-docs-concepts] documentation.

This article shows you how to install Istio. The Istio `istioctl` client binary is installed onto your client machine, then the Istio components are installed into a Kubernetes cluster on AKS. These instructions reference Istio version *1.0.4*. You can find additional Istio versions at [GitHub - Istio Releases][istio-github-releases].

In this article, you learn how to:

> [!div class="checklist"]
> * Download Istio
> * Install the Istio client binary
> * Install the Istio Kubernetes components
> * Validate the installation

## Before you begin

The steps detailed in this article assume you've created an AKS cluster (Kubernetes 1.10 and above, with RBAC enabled) and have established a `kubectl` connection with the cluster. If you need help with any of these items, then see the [AKS quickstart][aks-quickstart].

To install Istio, you need [Helm][helm] version *2.10.0* or later correctly installed and configured in your cluster. If you need help with installing Helm, see the [AKS Helm installation guidance][helm-install]. If you don't have at least version *2.10.0* of Helm installed, upgrade, or see the [Istio - Installation with Helm guide][istio-install-helm] for other installation options.

This article separates the Istio installation guidance into several discrete steps. Each of these steps is described so you learn how to install Istio, and learn how Istio works with Kubernetes. The end result is the same in structure as the official Istio installation [guidance][istio-install-k8s-quickstart].

## Download Istio

First, download and extract the latest Istio release. The steps a little different for a bash shell on MacOS, Linux, or Windows Subsystem for Linux, and a PowerShell shell. Choose one of the following install steps for your preferred environment:

* [Bash on MacOS, Linux, or Windows Subsystem for Linux](#bash)
* [PowerShell](#powershell)

### Bash

On MacOS, use `curl` to download the latest Istio release and then extract with `tar` as follows:

```bash
# Specify the Istio version that will be leveraged throughout these instructions
ISTIO_VERSION=1.0.4

# MacOS
curl -sL "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istio-$ISTIO_VERSION-osx.tar.gz" | tar xz
```

On Linux or Windows Subsystem for Linux, use `curl` to download the latest Istio release and then extract with `tar` as follows:

```bash
# Specify the Istio version that will be leveraged throughout these instructions
ISTIO_VERSION=1.0.4

curl -sL "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istio-$ISTIO_VERSION-linux.tar.gz" | tar xz
```

### PowerShell

In PowerShell, use [Invoke-WebRequest][Invoke-WebRequest] to download the latest Istio release and then extract with [Expand-Archive][Expand-Archive] as follows:

```powershell
# Specify the Istio version that will be leveraged throughout these instructions
$ISTIO_VERSION="1.0.4"

# Windows
$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -URI "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istio-$ISTIO_VERSION-win.zip" -OutFile "istio-$ISTIO_VERSION.zip"
Expand-Archive -Path "istio-$ISTIO_VERSION.zip" -DestinationPath .
```

## Install the Istio client binary

The `istioctl` client binary runs on your client machine and allows you to manage Istio routing rules and policies. Again, the install steps are a little different between client operating systems. Choose one of the following install steps for your preferred environment.

> [!IMPORTANT]
> Run all of the remaining steps from the top-level folder of the Istio release that you downloaded and extracted in the previous section.

### MacOS

To install the Istio `istioctl` client binary in a bash-based shell on MacOS, use the following commands. These commands copy the `istioctl` client binary to the standard user program location in your `PATH`.

```bash
cd istio-$ISTIO_VERSION
chmod +x ./bin/istioctl
sudo mv ./bin/istioctl /usr/local/bin/istioctl
```

If you'd like command-line completion for the Istio `istioctl` client binary, then set it up as follows:

```bash
# Generate the bash completion file and source it in your current shell
istioctl collateral --bash -o ~/completions
source ~/completions/istioctl.bash

# Source the bash completion file in your .bashrc so that the command-line completions
# are permanently available in your shell
echo "source ~/completions/istioctl.bash" >> ~/.bashrc
```

Now move onto the section to [Install the Istio Kubernetes components](#install-the-istio-kubernetes-components).

### Linux or Windows Subsystem for Linux

Use the following commands to install the Istio `istioctl` client binary in a bash-based shell on Linux or [Windows Subsystem for Linux][install-wsl]. These commands copy the `istioctl` client binary to the standard user program location in your `PATH`.

```bash
cd istio-$ISTIO_VERSION
chmod +x ./bin/istioctl
sudo mv ./bin/istioctl /usr/local/bin/istioctl
```

If you'd like command-line completion for the Istio `istioctl` client binary, then set it up as follows:

```bash
# Generate the bash completion file and source it in your current shell
istioctl collateral --bash -o ~/completions
source ~/completions/istioctl.bash

# Source the bash completion file in your .bashrc so that the command-line completions
# are permanently available in your shell
echo "source ~/completions/istioctl.bash" >> ~/.bashrc
```

Now move onto the section to [Install the Istio Kubernetes components](#install-the-istio-kubernetes-components).

### Windows

To install the Istio `istioctl` client binary in a Powershell-based shell on Windows, use the following commands. These commands copy the `istioctl` client binary to a new user program location and make it available via your `PATH`.

```powershell
cd istio-$ISTIO_VERSION
New-Item -ItemType Directory -Force -Path "C:/Program Files/Istio"
mv ./bin/istioctl.exe "C:/Program Files/Istio/"
$PATH = [environment]::GetEnvironmentVariable("PATH", "User")
[environment]::SetEnvironmentVariable("PATH", $PATH + "; C:/Program Files/Istio/", "User")
```

## Install the Istio Kubernetes components

To install the Istio components into your AKS cluster, use Helm. Install the Istio resources into the `istio-system` namespace, and enable additional options for security and monitoring as follows:

```azurecli
helm install install/kubernetes/helm/istio --name istio --namespace istio-system \
  --set global.controlPlaneSecurityEnabled=true \
  --set grafana.enabled=true \
  --set tracing.enabled=true \
  --set kiali.enabled=true
```

The Helm chart deploys a large number of objects. The deployment can take 2 to 3 minutes to complete, depending on the cluster environment.

## Validate the installation

To make sure that you have a successful deployment of Istio, let's validate the installation.

First confirm that the expected services have been created. Use the [kubectl get svc][kubectl-get] command to view the running services. Query the *istio-system* namespace, where the Istio and add-on components were installed by the Helm chart:

```console
kubectl get svc --namespace istio-system --output wide
```

The following example output shows the services that should now be running:

- *istio-** services
- *jaeger-**, *tracing*, and *zipkin* add-on tracing services
- *prometheus* add-on metrics service
- *grafana* add-on analytics and monitoring dashboard service
- *kiali* add-on service mesh dashboard service

If the `istio-ingressgateway` shows an external ip of `<pending>`, wait a few minutes until an IP address has been assigned by Azure networking.

```console
NAME                     TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                                                                                                                   AGE       SELECTOR
grafana                  ClusterIP      10.0.26.60     <none>           3000/TCP                                                                                                                  3m        app=grafana
istio-citadel            ClusterIP      10.0.88.87     <none>           8060/TCP,9093/TCP                                                                                                         3m        istio=citadel
istio-egressgateway      ClusterIP      10.0.115.115   <none>           80/TCP,443/TCP                                                                                                            3m        app=istio-egressgateway,istio=egressgateway
istio-galley             ClusterIP      10.0.104.183   <none>           443/TCP,9093/TCP                                                                                                          3m        istio=galley
istio-ingressgateway     LoadBalancer   10.0.12.216    52.187.250.239   80:31380/TCP,443:31390/TCP,31400:31400/TCP,15011:30469/TCP,8060:31999/TCP,853:31235/TCP,15030:32000/TCP,15031:30293/TCP   3m        app=istio-ingressgateway,istio=ingressgateway
istio-pilot              ClusterIP      10.0.38.134    <none>           15010/TCP,15011/TCP,8080/TCP,9093/TCP                                                                                     3m        istio=pilot
istio-policy             ClusterIP      10.0.253.81    <none>           9091/TCP,15004/TCP,9093/TCP                                                                                               3m        istio-mixer-type=policy,istio=mixer
istio-sidecar-injector   ClusterIP      10.0.181.186   <none>           443/TCP                                                                                                                   3m        istio=sidecar-injector
istio-telemetry          ClusterIP      10.0.177.113   <none>           9091/TCP,15004/TCP,9093/TCP,42422/TCP                                                                                     3m        istio-mixer-type=telemetry,istio=mixer
jaeger-agent             ClusterIP      None           <none>           5775/UDP,6831/UDP,6832/UDP                                                                                                3m        app=jaeger
jaeger-collector         ClusterIP      10.0.112.81    <none>           14267/TCP,14268/TCP                                                                                                       3m        app=jaeger
jaeger-query             ClusterIP      10.0.179.193   <none>           16686/TCP                                                                                                                 3m        app=jaeger
kiali                    ClusterIP      10.0.211.63    <none>           20001/TCP                                                                                                                 3m        app=kiali
prometheus               ClusterIP      10.0.70.113    <none>           9090/TCP                                                                                                                  3m        app=prometheus
tracing                  ClusterIP      10.0.139.121   <none>           80/TCP                                                                                                                    3m        app=jaeger
zipkin                   ClusterIP      10.0.60.155    <none>           9411/TCP                                                                                                                  3m        app=jaeger
```

Next, confirm that the required pods have been created. Use the [kubectl get pods][kubectl-get] command, and again query the *istio-system* namespace:

```console
kubectl get pods --namespace istio-system
```

The following example output shows the pods that are running:

- the *istio-** pods
- the *prometheus-** add-on metrics pod
- the *grafana-** add-on analytics and monitoring dashboard pod
- the *kiali* add-on service mesh dashboard pod

```console
NAME                                     READY     STATUS      RESTARTS   AGE
grafana-59b787b9b-cr6d7                  1/1       Running     0          6m
istio-citadel-78df8c67d9-9lfpf           1/1       Running     0          6m
istio-egressgateway-6b96cd7f5-k848h      1/1       Running     0          6m
istio-galley-58f566cb66-8mhbv            1/1       Running     0          6m
istio-ingressgateway-6cbbf596f6-6jz8g    1/1       Running     0          6m
istio-pilot-8449d555fc-sl6kp             2/2       Running     0          6m
istio-policy-6b99d88bc5-55s52            2/2       Running     0          6m
istio-sidecar-injector-b88dfb954-8m86s   1/1       Running     0          6m
istio-telemetry-675cb4cb9d-8s7wd         2/2       Running     0          6m
istio-tracing-7596597bd7-sbnt9           1/1       Running     0          6m
kiali-5fbd6ffb-4qcxw                     1/1       Running     0          6m
prometheus-76db5fddd5-2tkxs              1/1       Running     0          6m
```

All of the pods show the status of `Running`. If your pods don't have these statuses, wait a minute or two until they do. If any pods report an issue, use the [kubectl describe pod][kubectl-describe] command to review their output and status.

## Accessing the add-ons

A number of add-ons were installed Istio in our setup above that provide additional functionality. The user interfaces for the add-ons are not exposed publicly via an external ip address. To access the add-on user interfaces, use the [kubectl port-forward][kubectl-port-forward] command. This command creates a secure connection between a local port on your client machine and the relevant pod in your AKS cluster.

### Grafana

The analytics and monitoring dashboards for Istio is provided by [Grafana][grafana]. Forward the local port *3000* on your client machine to port *3000* on the pod that is running Grafana in your AKS cluster:

```console
kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=grafana -o jsonpath='{.items[0].metadata.name}') 3000:3000
```

The following example output shows the port-forward being configured for Grafana:

```console
Forwarding from 127.0.0.1:3000 -> 3000
Forwarding from [::1]:3000 -> 3000
```

You can now reach Grafana at the following URL on your client machine - [http://localhost:3000](http://localhost:3000).

### Prometheus

The expression browser for the metrics is provided by [Prometheus][prometheus]. Forward the local port *9090* on your client machine to port *9090* on the pod that is running Prometheus in your AKS cluster:

```console
kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=prometheus -o jsonpath='{.items[0].metadata.name}') 9090:9090
```

The following example output shows the port-forward being configured for Prometheus:

```console
Forwarding from 127.0.0.1:9090 -> 9090
Forwarding from [::1]:9090 -> 9090
```

You can now reach the Prometheus expression browser at the following URL on your client machine - [http://localhost:9090](http://localhost:9090).

### Jaeger

Tracing user interface is provided by [Jaeger][jaeger]. Forward the local port *16686* on your client machine to port *16686* on the pod that is running Jaeger in your AKS cluster:

```console
kubectl port-forward -n istio-system $(kubectl get pod -n istio-system -l app=jaeger -o jsonpath='{.items[0].metadata.name}') 16686:16686
```

The following example output shows the port-forward being configured for Jaeger:

```console
Forwarding from 127.0.0.1:16686 -> 16686
Forwarding from [::1]:16686 -> 16686
```

You can now reach the Jaeger tracing user interface at the following URL on your client machine - [http://localhost:16686](http://localhost:16686).

### Kiali

A service mesh observability dashboard is provided by [Kiali][kiali]. Forward the local port *20001* on your client machine to port *20001* on the pod that is running Kiali in your AKS cluster:

```console
kubectl port-forward -n istio-system $(kubectl get pod -n istio-system -l app=kiali -o jsonpath='{.items[0].metadata.name}') 20001:20001
```

The following example output shows the port-forward being configured for Kiali:

```console
Forwarding from 127.0.0.1:20001 -> 20001
Forwarding from [::1]:20001 -> 20001
```

You can now reach the Kiali service mesh observability dashboard at the following URL on your client machine - [http://localhost:20001](http://localhost:20001).

The default username and password for the Kiali dashboard is *username:admin/password:admin*. These credentials can be configured via the *kiali.dashboard.username* and *kiali.dashboard.passphrase* Helm values.

## Next steps

To see how you can use Istio to provide intelligent routing between multiple versions of your application and to roll out a canary release, see the following documentation:

> [!div class="nextstepaction"]
> [AKS Istio intelligent routing scenario][istio-scenario-routing]

To explore more installation and configuration options for Istio, see the following official Istio articles:

- [Istio - Kubernetes installation quickstart][istio-install-k8s-quickstart]
- [Istio - Helm installation guide][istio-install-helm]
- [Istio - Helm installation options][istio-install-helm-options]

You can also follow additional scenarios using the [Istio Bookinfo Application example][istio-bookinfo-example].

<!-- LINKS - external -->
[istio]: https://istio.io
[helm]: https://helm.sh
[istio-docs-concepts]: https://istio.io/docs/concepts/what-is-istio/
[istio-github]: https://github.com/istio/istio
[istio-github-releases]: https://github.com/istio/istio/releases
[istio-install-download]: https://istio.io/docs/setup/kubernetes/download-release/
[istio-install-k8s-quickstart]: https://istio.io/docs/setup/kubernetes/quick-start/
[istio-install-helm]: https://istio.io/docs/setup/kubernetes/helm-install/
[istio-install-helm-options]: https://istio.io/docs/reference/config/installation-options/
[istio-bookinfo-example]: https://istio.io/docs/examples/bookinfo/
[install-wsl]: https://docs.microsoft.com/windows/wsl/install-win10
[kubernetes-crd]: https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/
[grafana]: https://grafana.com/
[prometheus]: https://prometheus.io/
[jaeger]: https://www.jaegertracing.io/
[kiali]: https://www.kiali.io/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-port-forward]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward

<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md
[istio-scenario-routing]: ./istio-scenario-routing.md
[helm-install]: ./kubernetes-helm.md
[Invoke-WebRequest]: /powershell/module/microsoft.powershell.utility/invoke-webrequest
[Expand-Archive]: /powershell/module/Microsoft.PowerShell.Archive/Expand-Archive
