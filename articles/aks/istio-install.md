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
> These instructions reference Istio version `1.1.2`. The Istio `1.1` release has been tested with Kubernetes versions `1.11`, `1.12`, `1.13`. <br/>
You can find additional Istio versions at [GitHub - Istio Releases][istio-github-releases] and information about each of the releases at [Istio - Release Notes][istio-release-notes]. 

In this article, you learn how to:

> [!div class="checklist"]
> * Download Istio
> * Install the Istio istioctl client binary
> * Install the Istio CRDs on AKS
> * Install the Istio components on AKS
> * Validate the Istio installation

## Before you begin

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.11` and above, with RBAC enabled) and have established a `kubectl` connection with the cluster. If you need help with any of these items, then see the [AKS quickstart][aks-quickstart].

You'll need [Helm][helm] in order to follow these instructions and install Istio. It is strongly recommended that you have version `2.12.2` or later correctly installed and configured in your cluster. If you need help with installing Helm, then see the [AKS Helm installation guidance][helm-install].

This article separates the Istio installation guidance into several discrete steps. Each of these steps is described so that you learn how to install Istio, and learn how Istio works with Kubernetes. The end result is the same in structure as the official Istio installation [guidance][istio-install-helm].

## Download Istio

First, download and extract the latest Istio release. The steps are a little different for a bash shell on MacOS, Linux, or Windows Subsystem for Linux, and for a PowerShell shell. Choose one of the following install steps that matches your preferred environment:

* [Bash on MacOS, Linux, or Windows Subsystem for Linux](#bash)
* [PowerShell](#powershell)

### Bash

On MacOS, use `curl` to download the latest Istio release and then extract with `tar` as follows:

```bash
# Specify the Istio version that will be leveraged throughout these instructions
ISTIO_VERSION=1.1.2

# MacOS
curl -sL "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istio-$ISTIO_VERSION-osx.tar.gz" | tar xz
```

On Linux or Windows Subsystem for Linux, use `curl` to download the latest Istio release and then extract with `tar` as follows:

```bash
# Specify the Istio version that will be leveraged throughout these instructions
ISTIO_VERSION=1.1.2

curl -sL "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istio-$ISTIO_VERSION-linux.tar.gz" | tar xz
```

Now move onto the section to [Install the Istio client binary](#install-the-istio-client-binary).

### PowerShell

In PowerShell, use `Invoke-WebRequest` to download the latest Istio release and then extract with `Expand-Archive` as follows:

```powershell
# Specify the Istio version that will be leveraged throughout these instructions
$ISTIO_VERSION="1.1.2"

# Windows
$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -URI "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istio-$ISTIO_VERSION-win.zip" -OutFile "istio-$ISTIO_VERSION.zip"
Expand-Archive -Path "istio-$ISTIO_VERSION.zip" -DestinationPath .
```

Now move onto the section to [Install the Istio client binary](#install-the-istio-client-binary).

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

To install the Istio `istioctl` client binary in a **Powershell**-based shell on Windows, use the following commands. These commands copy the `istioctl` client binary to an Istio folder and make it permanently available via your `PATH`. You do not need elevated (Admin) privileges to run these commands.

```powershell
cd istio-$ISTIO_VERSION
New-Item -ItemType Directory -Force -Path "C:\Istio"
Copy-Item -Path .\bin\istioctl.exe -Destination "C:\Istio\"
$PATH = [environment]::GetEnvironmentVariable("PATH", "User")
[environment]::SetEnvironmentVariable("PATH", $PATH + "; C:\Istio\", "User")
```

Now move on to the next section to [Install the Istio CRDs on AKS](#install-the-istio-crds-on-aks).

## Install the Istio CRDs on AKS

> [!IMPORTANT]
> Ensure that you run the steps in this section, from the top-level folder of the Istio release that you downloaded and extracted.

Istio leverages [Custom Resource Definitions (CRDs)][kubernetes-crd] to manage its runtime configuration. We need to install the Istio CRDs first, since the Istio components have a dependency on them. Use Helm and the `istio-init` chart to install the Istio CRDs into the `istio-system` namespace in your AKS cluster:

```azurecli
helm install install/kubernetes/helm/istio-init --name istio-init --namespace istio-system
```

[Jobs][kubernetes-jobs] are deployed as part of the `istio-init` Helm Chart to install the CRDs. These jobs should take between 1 to 2 minutes to complete, depending on your cluster environment. You can verify that the jobs have successfully completed as follows:

```azurecli
kubectl get jobs -n istio-system
```

The following example output shows the successfully completed jobs.

```console
NAME                          COMPLETIONS   DURATION   AGE
job.batch/istio-init-crd-10   1/1           16s        38s
job.batch/istio-init-crd-11   1/1           15s        38s
```

Now that we have confirmed the successful completion of the jobs, let's verify that we have the correct number of Istio CRDs installed. You can verify that all 53 Istio CRDs have been installed by running the appropriate command for your environment. The command should return the number `53`.

#### Bash

```bash
kubectl get crds | grep 'istio.io' | wc -l
```

#### Powershell

```powershell
(kubectl get crds | Select-String -Pattern 'istio.io').Count
```

If you have got to this point, then that means you have successfully installed the Istio CRDs. Now move on to the next section to [Install the Istio components on AKS](#install-the-istio-components-on-aks).

## Install the Istio components on AKS

> [!IMPORTANT]
> Ensure that you run the steps in this section, from the top-level folder of the Istio release that you downloaded and extracted.

As part of our Istio installation, we will be installing [Grafana][grafana] for analytics and monitoring dashboards and [Kiali][kiali] for a service mesh observability dashboard. In our setup, each of these components require credentials that must be provided as a [Secret][kubernetes-secrets].

Before we can install the Istio components, we must create the secrets for both Grafana and Kiali. Do this by running the appropriate command for your environment.

### Add Grafana Secret

#### MacOS, Linux

Replace the `REPLACE_WITH_YOUR_SECURE_PASSWORD` token with your password and run the following commands:

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

Replace the `REPLACE_WITH_YOUR_SECURE_PASSWORD` token with your password and run the following commands:

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

#### MacOS, Linux

Replace the `REPLACE_WITH_YOUR_SECURE_PASSWORD` token with your password and run the following commands:

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

Replace the `REPLACE_WITH_YOUR_SECURE_PASSWORD` token with your password and run the following commands:

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

Now that we have successfully created the Grafana and Kiali secrets in our AKS cluster, it is time to install the Istio components. Use Helm and the `istio` chart to install the Istio components into the `istio-system` namespace in your AKS cluster:

> [!NOTE]
> We are using the following options as part of our installation:<br/>
> `global.controlPlaneSecurityEnabled=true` - mutual TLS enabled for the control plane<br/>
> `mixer.adapters.useAdapterCRDs=false` - remove watches on mixer adapter CRDs to improve performance<br/>
> `grafana.enabled=true` - enable Grafana deployment for analytics and monitoring dashboards<br/>
> `grafana.security.enabled=true` - enable authentication for Grafana<br/>
> `tracing.enabled=true` - enable the Jaeger deployment for tracing<br/>
> `kiali.enabled=true` - enable the Kiali deployment for a service mesh observability dashboard

```azurecli
helm install install/kubernetes/helm/istio --name istio --namespace istio-system \
  --set global.controlPlaneSecurityEnabled=true \
  --set mixer.adapters.useAdapterCRDs=false \
  --set grafana.enabled=true --set grafana.security.enabled=true \
  --set tracing.enabled=true \
  --set kiali.enabled=true
```

The `istio` Helm chart deploys a large number of objects. You can see the list from the output of your `helm install` command above. The deployment of the Istio components can take 4 to 5 minutes to complete, depending on your cluster environment.

At this point you have deployed Istio to your AKS cluster. To ensure that we have a successful deployment of Istio, let's move on to the next section to [Validate the Istio installation](#validate-the-istio-installation).

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
grafana                  ClusterIP      10.0.75.187    <none>          3000/TCP                                                                                                                                     2m21s     app=grafana
istio-citadel            ClusterIP      10.0.141.240   <none>          8060/TCP,15014/TCP                                                                                                                           2m20s     istio=citadel
istio-galley             ClusterIP      10.0.160.127   <none>          443/TCP,15014/TCP,9901/TCP                                                                                                                   2m21s     istio=galley
istio-ingressgateway     LoadBalancer   10.0.137.252   20.188.241.39   80:31380/TCP,443:31390/TCP,31400:31400/TCP,15029:30713/TCP,15030:32193/TCP,15031:32089/TCP,15032:30405/TCP,15443:32096/TCP,15020:32594/TCP   2m21s     app=istio-ingressgateway,istio=ingressgateway,release=istio
istio-pilot              ClusterIP      10.0.94.159    <none>          15010/TCP,15011/TCP,8080/TCP,15014/TCP                                                                                                       2m20s     istio=pilot
istio-policy             ClusterIP      10.0.117.198   <none>          9091/TCP,15004/TCP,15014/TCP                                                                                                                 2m20s     istio-mixer-type=policy,istio=mixer
istio-sidecar-injector   ClusterIP      10.0.30.130    <none>          443/TCP                                                                                                                                      2m20s     istio=sidecar-injector
istio-telemetry          ClusterIP      10.0.226.3     <none>          9091/TCP,15004/TCP,15014/TCP,42422/TCP                                                                                                       2m20s     istio-mixer-type=telemetry,istio=mixer
jaeger-agent             ClusterIP      None           <none>          5775/UDP,6831/UDP,6832/UDP                                                                                                                   2m20s     app=jaeger
jaeger-collector         ClusterIP      10.0.134.126   <none>          14267/TCP,14268/TCP                                                                                                                          2m20s     app=jaeger
jaeger-query             ClusterIP      10.0.137.115   <none>          16686/TCP                                                                                                                                    2m20s     app=jaeger
kiali                    ClusterIP      10.0.160.169   <none>          20001/TCP                                                                                                                                    2m20s     app=kiali
prometheus               ClusterIP      10.0.116.5     <none>          9090/TCP                                                                                                                                     2m20s     app=prometheus
tracing                  ClusterIP      10.0.69.238    <none>          80/TCP                                                                                                                                       2m19s     app=jaeger
zipkin                   ClusterIP      10.0.255.122   <none>          9411/TCP                                                                                                                                     2m20s     app=jaeger
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
NAME                                      READY     STATUS      RESTARTS   AGE
grafana-7d46b7dc59-xsj22                  1/1       Running     0          6m26s
istio-citadel-5bbc997554-68lmr            1/1       Running     0          6m25s
istio-galley-5ff6d64c5f-kpbp2             1/1       Running     0          6m26s
istio-ingressgateway-5c6bcff97c-w57mm     1/1       Running     0          6m26s
istio-init-crd-10-84z8l                   0/1       Completed   0          20m38s
istio-init-crd-11-5mpnm                   0/1       Completed   0          20m38s
istio-pilot-57984c5679-7tkpv              2/2       Running     0          6m26s
istio-policy-7b695cf748-t59pq             2/2       Running     2          6m26s
istio-sidecar-injector-549585c8d9-4zlxt   1/1       Running     0          6m25s
istio-telemetry-7647988cc8-mgv62          2/2       Running     6          6m26s
istio-tracing-5fbc94c494-25759            1/1       Running     0          6m25s
kiali-56d95cf466-wd7tp                    1/1       Running     0          6m26s
prometheus-8647cf4bc7-tpgb7               1/1       Running     0          6m26s
```

There should be two `istio-init-crd-*` pods with a `Completed` status. These pods were responsible for running the jobs that created the CRDs in an earlier step. All of the other pods should show a status of `Running`. If your pods don't have these statuses, wait a minute or two until they do. If any pods report an issue, use the [kubectl describe pod][kubectl-describe] command to review their output and status.

## Accessing the add-ons

A number of add-ons were installed Istio in our setup above that provide additional functionality. The user interfaces for the add-ons are not exposed publicly via an external ip address. To access the add-on user interfaces, use the [kubectl port-forward][kubectl-port-forward] command. This command creates a secure connection between a local port on your client machine and the relevant pod in your AKS cluster.

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

You can now reach the Kiali service mesh observability dashboard at the following URL on your client machine - [http://localhost:20001/kiali/console/](http://localhost:20001/kiali/console/. Remember to use the credentials you created via the Kiali secret earlier when prompted.

## Next steps

To see how you can use Istio to provide intelligent routing between multiple versions of your application and to roll out a canary release, see the following documentation:

> [!div class="nextstepaction"]
> [AKS Istio intelligent routing scenario][istio-scenario-routing]

To explore more installation and configuration options for Istio, see the following official Istio articles:

- [Istio - Helm installation guide][istio-install-helm]
- [Istio - Helm installation options][istio-install-helm-options]

You can also follow additional scenarios using the [Istio Bookinfo Application example][istio-bookinfo-example].

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

<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md
[istio-scenario-routing]: ./istio-scenario-routing.md
[helm-install]: ./kubernetes-helm.md