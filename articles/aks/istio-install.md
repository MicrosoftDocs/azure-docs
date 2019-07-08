---
title: Install Istio in Azure Kubernetes Service (AKS)
description: Learn how to install and use Istio to create a service mesh in an Azure Kubernetes Service (AKS) cluster
services: container-service
author: paulbouwer

ms.service: container-service
ms.topic: article
ms.date: 04/19/2019
ms.author: pabouwer
---

# Install and use Istio in Azure Kubernetes Service (AKS)

[Istio][istio-github] is an open-source service mesh that provides a key set of functionality across the microservices in a Kubernetes cluster. These features include traffic management, service identity and security, policy enforcement, and observability. For more information about Istio, see the official [What is Istio?][istio-docs-concepts] documentation.

This article shows you how to install Istio. The Istio `istioctl` client binary is installed onto your client machine and the Istio components are installed into a Kubernetes cluster on AKS.

> [!NOTE]
> These instructions reference Istio version `1.1.3`.
>
> The Istio `1.1.x` releases have been tested by the Istio team against Kubernetes versions `1.11`, `1.12`, `1.13`. You can find additional Istio versions at [GitHub - Istio Releases][istio-github-releases] and information about each of the releases at [Istio - Release Notes][istio-release-notes].

In this article, you learn how to:

> [!div class="checklist"]
> * Download Istio
> * Install the Istio istioctl client binary
> * Install the Istio CRDs on AKS
> * Install the Istio components on AKS
> * Validate the Istio installation
> * Accessing the add-ons
> * Uninstall Istio from AKS

## Before you begin

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.11` and above, with RBAC enabled) and have established a `kubectl` connection with the cluster. If you need help with any of these items, then see the [AKS quickstart][aks-quickstart].

You'll need [Helm][helm] to follow these instructions and install Istio. It's recommended that you have version `2.12.2` or later correctly installed and configured in your cluster. If you need help with installing Helm, then see the [AKS Helm installation guidance][helm-install]. All Istio pods must also be scheduled to run on Linux nodes.

This article separates the Istio installation guidance into several discrete steps. The end result is the same in structure as the official Istio installation [guidance][istio-install-helm].

## Download Istio

First, download and extract the latest Istio release. The steps are a little different for a bash shell on MacOS, Linux, or Windows Subsystem for Linux, and for a PowerShell shell. Choose one of the following install steps that matches your preferred environment:

* [Bash on MacOS, Linux, or Windows Subsystem for Linux](#bash)
* [PowerShell](#powershell)

### Bash

On MacOS, use `curl` to download the latest Istio release and then extract with `tar` as follows:

```bash
# Specify the Istio version that will be leveraged throughout these instructions
ISTIO_VERSION=1.1.3

# MacOS
curl -sL "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istio-$ISTIO_VERSION-osx.tar.gz" | tar xz
```

On Linux or Windows Subsystem for Linux, use `curl` to download the latest Istio release and then extract with `tar` as follows:

```bash
# Specify the Istio version that will be leveraged throughout these instructions
ISTIO_VERSION=1.1.3

curl -sL "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istio-$ISTIO_VERSION-linux.tar.gz" | tar xz
```

Now move onto the section to [Install the Istio istioctl client binary](#install-the-istio-istioctl-client-binary).

### PowerShell

In PowerShell, use `Invoke-WebRequest` to download the latest Istio release and then extract with `Expand-Archive` as follows:

```powershell
# Specify the Istio version that will be leveraged throughout these instructions
$ISTIO_VERSION="1.1.3"

# Windows
# Use TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = "tls12"
$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -URI "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istio-$ISTIO_VERSION-win.zip" -OutFile "istio-$ISTIO_VERSION.zip"
Expand-Archive -Path "istio-$ISTIO_VERSION.zip" -DestinationPath .
```

Now move onto the section to [Install the Istio istioctl client binary](#install-the-istio-istioctl-client-binary).

## Install the Istio istioctl client binary

> [!IMPORTANT]
> Ensure that you run the steps in this section, from the top-level folder of the Istio release that you downloaded and extracted.

The `istioctl` client binary runs on your client machine and allows you to interact with the Istio service mesh. The install steps are a little different between client operating systems. Choose one of the following install steps that matches your preferred environment:

* [MacOS](#macos)
* [Linux or Windows Subsystem for Linux](#linux-or-windows-subsystem-for-linux)
* [Windows](#windows)

### MacOS

To install the Istio `istioctl` client binary in a bash-based shell on MacOS, use the following commands. These commands copy the `istioctl` client binary to the standard user program location in your `PATH`.

```bash
cd istio-$ISTIO_VERSION
sudo cp ./bin/istioctl /usr/local/bin/istioctl
sudo chmod +x /usr/local/bin/istioctl
```

If you'd like command-line completion for the Istio `istioctl` client binary, then set it up as follows:

```bash
# Generate the bash completion file and source it in your current shell
mkdir -p ~/completions && istioctl collateral --bash -o ~/completions
source ~/completions/istioctl.bash

# Source the bash completion file in your .bashrc so that the command-line completions
# are permanently available in your shell
echo "source ~/completions/istioctl.bash" >> ~/.bashrc
```

Now move on to the next section to [Install the Istio CRDs on AKS](#install-the-istio-crds-on-aks).

### Linux or Windows Subsystem for Linux

Use the following commands to install the Istio `istioctl` client binary in a bash-based shell on Linux or [Windows Subsystem for Linux][install-wsl]. These commands copy the `istioctl` client binary to the standard user program location in your `PATH`.

```bash
cd istio-$ISTIO_VERSION
sudo cp ./bin/istioctl /usr/local/bin/istioctl
sudo chmod +x /usr/local/bin/istioctl
```

If you'd like command-line completion for the Istio `istioctl` client binary, then set it up as follows:

```bash
# Generate the bash completion file and source it in your current shell
mkdir -p ~/completions && istioctl collateral --bash -o ~/completions
source ~/completions/istioctl.bash

# Source the bash completion file in your .bashrc so that the command-line completions
# are permanently available in your shell
echo "source ~/completions/istioctl.bash" >> ~/.bashrc
```

Now move on to the next section to [Install the Istio CRDs on AKS](#install-the-istio-crds-on-aks).

### Windows

To install the Istio `istioctl` client binary in a **Powershell**-based shell on Windows, use the following commands. These commands copy the `istioctl` client binary to an Istio folder and then make it available both immediately (in current shell) and permanently (across shell restarts) via your `PATH`. You don't need elevated (Admin) privileges to run these commands and you don't need to restart your shell.

```powershell
# Copy istioctl.exe to C:\Istio
cd istio-$ISTIO_VERSION
New-Item -ItemType Directory -Force -Path "C:\Istio"
Copy-Item -Path .\bin\istioctl.exe -Destination "C:\Istio\"

# Add C:\Istio to PATH. 
# Make the new PATH permanently available for the current User, and also immediately available in the current shell.
$PATH = [environment]::GetEnvironmentVariable("PATH", "User") + "; C:\Istio\"
[environment]::SetEnvironmentVariable("PATH", $PATH, "User") 
[environment]::SetEnvironmentVariable("PATH", $PATH)
```

Now move on to the next section to [Install the Istio CRDs on AKS](#install-the-istio-crds-on-aks).

## Install the Istio CRDs on AKS

> [!IMPORTANT]
> Ensure that you run the steps in this section, from the top-level folder of the Istio release that you downloaded and extracted.

Istio uses [Custom Resource Definitions (CRDs)][kubernetes-crd] to manage its runtime configuration. We need to install the Istio CRDs first, since the Istio components have a dependency on them. Use Helm and the `istio-init` chart to install the Istio CRDs into the `istio-system` namespace in your AKS cluster:

```azurecli
helm install install/kubernetes/helm/istio-init --name istio-init --namespace istio-system
```

[Jobs][kubernetes-jobs] are deployed as part of the `istio-init` Helm Chart to install the CRDs. These jobs should take between 1 to 2 minutes to complete, depending on your cluster environment. You can verify that the jobs have successfully completed as follows:

```azurecli
kubectl get jobs -n istio-system
```

The following example output shows the successfully completed jobs.

```console
NAME                COMPLETIONS   DURATION   AGE
istio-init-crd-10   1/1           16s        18s
istio-init-crd-11   1/1           15s        18s
```

Now that we've confirmed the successful completion of the jobs, let's verify that we have the correct number of Istio CRDs installed. You can verify that all 53 Istio CRDs have been installed by running the appropriate command for your environment. The command should return the number `53`.

Bash

```bash
kubectl get crds | grep 'istio.io' | wc -l
```

Powershell

```powershell
(kubectl get crds | Select-String -Pattern 'istio.io').Count
```

If you've got to this point, then that means you have successfully installed the Istio CRDs. Now move on to the next section to [Install the Istio components on AKS](#install-the-istio-components-on-aks).

## Install the Istio components on AKS

> [!IMPORTANT]
> Ensure that you run the steps in this section, from the top-level folder of the Istio release that you downloaded and extracted.

We'll be installing [Grafana][grafana] and [Kiali][kiali] as part of our Istio installation. Grafana provides analytics and monitoring dashboards, and Kiali provides a service mesh observability dashboard. In our setup, each of these components requires credentials that must be provided as a [Secret][kubernetes-secrets].

Before we can install the Istio components, we must create the secrets for both Grafana and Kiali. Create these secrets by running the appropriate commands for your environment.

### Add Grafana Secret

Replace the `REPLACE_WITH_YOUR_SECURE_PASSWORD` token with your password and run the following commands:

#### MacOS, Linux

```bash
GRAFANA_USERNAME=$(echo -n "grafana" | base64)
GRAFANA_PASSPHRASE=$(echo -n "REPLACE_WITH_YOUR_SECURE_PASSWORD" | base64)

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: grafana
  namespace: istio-system
  labels:
    app: grafana
type: Opaque
data:
  username: $GRAFANA_USERNAME
  passphrase: $GRAFANA_PASSPHRASE
EOF
```

#### Windows

```powershell
$GRAFANA_USERNAME=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("grafana"))
$GRAFANA_PASSPHRASE=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("REPLACE_WITH_YOUR_SECURE_PASSWORD"))

"apiVersion: v1
kind: Secret
metadata:
  name: grafana
  namespace: istio-system
  labels:
    app: grafana
type: Opaque
data:
  username: $GRAFANA_USERNAME
  passphrase: $GRAFANA_PASSPHRASE" | kubectl apply -f -
```

### Add Kiali Secret

Replace the `REPLACE_WITH_YOUR_SECURE_PASSWORD` token with your password and run the following commands:

#### MacOS, Linux

```bash
KIALI_USERNAME=$(echo -n "kiali" | base64)
KIALI_PASSPHRASE=$(echo -n "REPLACE_WITH_YOUR_SECURE_PASSWORD" | base64)

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: kiali
  namespace: istio-system
  labels:
    app: kiali
type: Opaque
data:
  username: $KIALI_USERNAME
  passphrase: $KIALI_PASSPHRASE
EOF
```

#### Windows

```powershell
$KIALI_USERNAME=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("kiali"))
$KIALI_PASSPHRASE=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("REPLACE_WITH_YOUR_SECURE_PASSWORD"))

"apiVersion: v1
kind: Secret
metadata:
  name: kiali
  namespace: istio-system
  labels:
    app: kiali
type: Opaque
data:
  username: $KIALI_USERNAME
  passphrase: $KIALI_PASSPHRASE" | kubectl apply -f -
```

### Install Istio components

Now that we've successfully created the Grafana and Kiali secrets in our AKS cluster, it's time to install the Istio components. Use Helm and the `istio` chart to install the Istio components into the `istio-system` namespace in your AKS cluster. Use the appropriate commands for your environment.

> [!NOTE]
> We are using the following options as part of our installation:
> - `global.controlPlaneSecurityEnabled=true` - mutual TLS enabled for the control plane
> - `mixer.adapters.useAdapterCRDs=false` - remove watches on mixer adapter CRDs as they to be deprecated and this will improve performance
> - `grafana.enabled=true` - enable Grafana deployment for analytics and monitoring dashboards
> - `grafana.security.enabled=true` - enable authentication for Grafana
> - `tracing.enabled=true` - enable the Jaeger deployment for tracing
> - `kiali.enabled=true` - enable the Kiali deployment for a service mesh observability dashboard

Bash

```bash
helm install install/kubernetes/helm/istio --name istio --namespace istio-system \
  --set global.controlPlaneSecurityEnabled=true \
  --set mixer.adapters.useAdapterCRDs=false \
  --set grafana.enabled=true --set grafana.security.enabled=true \
  --set tracing.enabled=true \
  --set kiali.enabled=true
```

Powershell

```powershell
helm install install/kubernetes/helm/istio --name istio --namespace istio-system `
  --set global.controlPlaneSecurityEnabled=true `
  --set mixer.adapters.useAdapterCRDs=false `
  --set grafana.enabled=true --set grafana.security.enabled=true `
  --set tracing.enabled=true `
  --set kiali.enabled=true
```

The `istio` Helm chart deploys a large number of objects. You can see the list from the output of your `helm install` command above. The deployment of the Istio components can take 4 to 5 minutes to complete, depending on your cluster environment.

> [!NOTE]
> All Istio pods must be scheduled to run on Linux nodes. If you have Windows Server node pools in addition to Linux node pools on your cluster, verify that all Istio pods have been scheduled to run on Linux nodes.

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
NAME                     TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                                                                                                                                      AGE       SELECTOR
grafana                  ClusterIP      10.0.81.182    <none>          3000/TCP                                                                                                                                     119s      app=grafana
istio-citadel            ClusterIP      10.0.96.33     <none>          8060/TCP,15014/TCP                                                                                                                           119s      istio=citadel
istio-galley             ClusterIP      10.0.237.158   <none>          443/TCP,15014/TCP,9901/TCP                                                                                                                   119s      istio=galley
istio-ingressgateway     LoadBalancer   10.0.154.12    20.188.211.19   15020:30603/TCP,80:31380/TCP,443:31390/TCP,31400:31400/TCP,15029:31198/TCP,15030:30610/TCP,15031:30937/TCP,15032:31344/TCP,15443:31499/TCP   119s      app=istio-ingressgateway,istio=ingressgateway,release=istio
istio-pilot              ClusterIP      10.0.178.56    <none>          15010/TCP,15011/TCP,8080/TCP,15014/TCP                                                                                                       119s      istio=pilot
istio-policy             ClusterIP      10.0.116.118   <none>          9091/TCP,15004/TCP,15014/TCP                                                                                                                 119s      istio-mixer-type=policy,istio=mixer
istio-sidecar-injector   ClusterIP      10.0.31.160    <none>          443/TCP                                                                                                                                      119s      istio=sidecar-injector
istio-telemetry          ClusterIP      10.0.187.246   <none>          9091/TCP,15004/TCP,15014/TCP,42422/TCP                                                                                                       119s      istio-mixer-type=telemetry,istio=mixer
jaeger-agent             ClusterIP      None           <none>          5775/UDP,6831/UDP,6832/UDP                                                                                                                   119s      app=jaeger
jaeger-collector         ClusterIP      10.0.116.63    <none>          14267/TCP,14268/TCP                                                                                                                          119s      app=jaeger
jaeger-query             ClusterIP      10.0.22.108    <none>          16686/TCP                                                                                                                                    119s      app=jaeger
kiali                    ClusterIP      10.0.142.50    <none>          20001/TCP                                                                                                                                    119s      app=kiali
prometheus               ClusterIP      10.0.138.134   <none>          9090/TCP                                                                                                                                     119s      app=prometheus
tracing                  ClusterIP      10.0.165.210   <none>          80/TCP                                                                                                                                       118s      app=jaeger
zipkin                   ClusterIP      10.0.126.211   <none>          9411/TCP                                                                                                                                     118s      app=jaeger
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
NAME                                     READY     STATUS      RESTARTS   AGE
grafana-88779954d-nzpm7                  1/1       Running     0          6m26s
istio-citadel-7f699dc8c8-n7q8g           1/1       Running     0          6m26s
istio-galley-649bc8cd97-wfjzm            1/1       Running     0          6m26s
istio-ingressgateway-65dfbd566-42wkn     1/1       Running     0          6m26s
istio-init-crd-10-tmtw5                  0/1       Completed   0          20m38s
istio-init-crd-11-ql25l                  0/1       Completed   0          20m38s
istio-pilot-958dd8cc4-4ckf9              2/2       Running     0          6m26s
istio-policy-86b4b7cf9-zf7v7             2/2       Running     4          6m26s
istio-sidecar-injector-d48786c5c-pmrj9   1/1       Running     0          6m26s
istio-telemetry-7f6996fdcc-84w94         2/2       Running     3          6m26s
istio-tracing-79db5954f-h7hmz            1/1       Running     0          6m26s
kiali-5c4cdbb869-s28dv                   1/1       Running     0          6m26s
prometheus-67599bf55b-pgxd8              1/1       Running     0          6m26s
```

There should be two `istio-init-crd-*` pods with a `Completed` status. These pods were responsible for running the jobs that created the CRDs in an earlier step. All of the other pods should show a status of `Running`. If your pods don't have these statuses, wait a minute or two until they do. If any pods report an issue, use the [kubectl describe pod][kubectl-describe] command to review their output and status.

## Accessing the add-ons

A number of add-ons were installed Istio in our setup above that provide additional functionality. The user interfaces for the add-ons are not exposed publicly via an external ip address. To access the add-on user interfaces, use the [kubectl port-forward][kubectl-port-forward] command. This command creates a secure connection between your client machine and the relevant pod in your AKS cluster.

We added an additional layer of security for Grafana and Kiali by specifying credentials for them earlier in this article.

### Grafana

The analytics and monitoring dashboards for Istio are provided by [Grafana][grafana]. Forward the local port `3000` on your client machine to port `3000` on the pod that is running Grafana in your AKS cluster:

```console
kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=grafana -o jsonpath='{.items[0].metadata.name}') 3000:3000
```

The following example output shows the port-forward being configured for Grafana:

```console
Forwarding from 127.0.0.1:3000 -> 3000
Forwarding from [::1]:3000 -> 3000
```

You can now reach Grafana at the following URL on your client machine - [http://localhost:3000](http://localhost:3000). Remember to use the credentials you created via the Grafana secret earlier when prompted.

### Prometheus

Metrics for Istio are provided by [Prometheus][prometheus]. Forward the local port `9090` on your client machine to port `9090` on the pod that is running Prometheus in your AKS cluster:

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

Tracing within Istio is provided by [Jaeger][jaeger]. Forward the local port `16686` on your client machine to port `16686` on the pod that is running Jaeger in your AKS cluster:

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

A service mesh observability dashboard is provided by [Kiali][kiali]. Forward the local port `20001` on your client machine to port `20001` on the pod that is running Kiali in your AKS cluster:

```console
kubectl port-forward -n istio-system $(kubectl get pod -n istio-system -l app=kiali -o jsonpath='{.items[0].metadata.name}') 20001:20001
```

The following example output shows the port-forward being configured for Kiali:

```console
Forwarding from 127.0.0.1:20001 -> 20001
Forwarding from [::1]:20001 -> 20001
```

You can now reach the Kiali service mesh observability dashboard at the following URL on your client machine - [http://localhost:20001/kiali/console/](http://localhost:20001/kiali/console/). Remember to use the credentials you created via the Kiali secret earlier when prompted.

## Uninstall Istio from AKS

> [!WARNING]
> Deleting Istio from a running system may result in traffic related issues between your services. Ensure that you have made provisions for your system to still operate correctly without Istio before proceeding.

### Remove Istio components and namespace

To remove Istio from your AKS cluster, use the following commands. The `helm delete` commands will remove the `istio` and `istio-init` charts, and the `kubectl delete ns` command will remove the `istio-system` namespace.

```azurecli
helm delete --purge istio
helm delete --purge istio-init
kubectl delete ns istio-system
```

### Remove Istio CRDs

The above commands delete all the Istio components and namespace, but we are still left with the Istio CRDs. To delete the CRDs, you can use one the following approaches.

Approach #1 - This command assumes that you are running this step from the top-level folder of the downloaded and extracted release of Istio that you used to install Istio with.

```azure-cli
kubectl delete -f install/kubernetes/helm/istio-init/files
```

Approach #2 - Use one of these commands if you no longer have access to the downloaded and extracted release of Istio that you used to install Istio with. This command will take a little longer - expect it to take a few minutes to complete.

Bash
```bash
kubectl get crds -o name | grep 'istio.io' | xargs -n1 kubectl delete
```

Powershell
```powershell
kubectl get crds -o name | Select-String -Pattern 'istio.io' |% { kubectl delete $_ }
```

## Next steps

The following documentation describes how you can use Istio to provide intelligent routing to roll out a canary release:

> [!div class="nextstepaction"]
> [AKS Istio intelligent routing scenario][istio-scenario-routing]

To explore more installation and configuration options for Istio, see the following official Istio articles:

- [Istio - Helm installation guide][istio-install-helm]
- [Istio - Helm installation options][istio-install-helm-options]

You can also follow additional scenarios using the [Istio Bookinfo Application example][istio-bookinfo-example].

To learn how to monitor your AKS application using Application Insights and Istio, see the following Azure Monitor documentation:
- [Zero instrumentation application monitoring for Kubernetes hosted applications][app-insights]

<!-- LINKS - external -->
[istio]: https://istio.io
[helm]: https://helm.sh

[istio-docs-concepts]: https://istio.io/docs/concepts/what-is-istio/
[istio-github]: https://github.com/istio/istio
[istio-github-releases]: https://github.com/istio/istio/releases
[istio-release-notes]: https://istio.io/about/notes/
[istio-install-download]: https://istio.io/docs/setup/kubernetes/download-release/
[istio-install-helm]: https://istio.io/docs/setup/kubernetes/install/helm/
[istio-install-helm-options]: https://istio.io/docs/reference/config/installation-options/
[istio-bookinfo-example]: https://istio.io/docs/examples/bookinfo/
[install-wsl]: https://docs.microsoft.com/windows/wsl/install-win10

[kubernetes-crd]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions
[kubernetes-jobs]: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/
[kubernetes-secrets]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-port-forward]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward

[grafana]: https://grafana.com/
[prometheus]: https://prometheus.io/
[jaeger]: https://www.jaegertracing.io/
[kiali]: https://www.kiali.io/

[app-insights]: https://docs.microsoft.com/azure/azure-monitor/app/kubernetes

<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md
[istio-scenario-routing]: ./istio-scenario-routing.md
[helm-install]: ./kubernetes-helm.md
