---
title: Install Istio on Azure Kubernetes Service (AKS)
description: Use Istio to provide a service mesh in an Azure Kubernetes Service (AKS) cluster
services: container-service
author: paulbouwer

ms.service: container-service
ms.topic: article
ms.date: 08/10/2018
ms.author: pabouwer
---

# Install Istio on Azure Kubernetes Service (AKS)

[Istio][istio-github] is an open-source service mesh that provides a key set of functionality across the microservices within your Kubernetes cluster. These include traffic management, service identity & security, policy enforcement, and observability. For a deeper conceptual understanding of Istio, see the official [What is Istio?][istio-docs-concepts] documentation.

This article demonstrates how to install Istio. The Istio `istioctl` client binary is installed onto your client machine and the Istio components are installed into a Kubernetes cluster on AKS. These instructions will reference Istio version **1.0.0**. You can find additional Istio versions at [GitHub - Istio Releases][istio-github-releases].

You'll need to complete the following tasks to complete the installation of Istio on Azure Kubernetes Service (AKS):

> [!div class="checklist"]
> * Download Istio
> * Install the Istio client binary
> * Install the Istio Kubernetes components
> * Validate the installation

## Before you begin

The steps detailed in this article assume you've created an AKS cluster (Kubernetes 1.10 and above, with RBAC enabled) and have established a `kubectl` connection with the cluster. If you need these items see, the [AKS quickstart][aks-quickstart].

This article separates the Istio installation guidance into several discrete steps. It describes each of these steps so that you can not only install Istio easily, but also learn how Istio works with Kubernetes. The end-result, however, will be identical in structure to the official Istio installation [guidance][istio-install-k8s-quickstart].

## Download Istio

Download and extract the **Istio 1.0.0** release. Use the instructions below that are appropriate for your client machine operating system.

```bash
# Linux or Windows Subsystem for Linux
curl -sL "https://github.com/istio/istio/releases/download/1.0.0/istio-1.0.0-linux.tar.gz" | tar xz

# MacOS
curl -sL "https://github.com/istio/istio/releases/download/1.0.0/istio-1.0.0-osx.tar.gz" | tar xz
```

```powershell
# Windows
$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -URI "https://github.com/istio/istio/releases/download/1.0.0/istio-1.0.0-win.zip" -OutFile "istio-1.0.0.zip"
Expand-Archive -Path "istio-1.0.0.zip" -DestinationPath .
```

## Install the Istio client binary

The Istio `istioctl` client binary runs on your client machine and allows you to manage Istio routing rules and policies.

> [!NOTE]
> If you are using the Azure Cloud Shell, the Istio `istioctl` client binary is already installed and you can skip this section.

> [!IMPORTANT]
> Ensure that you run all of the following steps from the top-level folder of the Istio 1.0.0 release you downloaded and extracted earlier.

### Linux

Use the following commands to install the Istio `istioctl` client binary in a **bash**-based shell on Linux or [Windows Subsystem for Linux][install-wsl]. These commands will copy the `istioctl` client binary to the standard user program location that is available via your `PATH`.

```bash
cd istio-1.0.0
chmod +x ./bin/istioctl
sudo mv ./bin/istioctl /usr/local/bin/istioctl
```

If you'd like command-line completion for the Istio `istioctl` client binary, then set it up as follows:

```bash
# generate the bash completion file and source it in your current shell
istioctl collateral --bash -o ~/completions
source ~/completions/istioctl.bash

# source the bash completion file in your .bashrc so that the command-line completions 
# are permanently available in your shell
echo "source ~/completions/istioctl.bash" >> ~/.bashrc
```

### MacOS

To install the Istio `istioctl` client binary in a **bash**-based shell on MacOS, use the following commands. These commands will copy the `istioctl` client binary to the standard user program location that is available via your `PATH`.

```bash
cd istio-1.0.0
chmod +x ./bin/istioctl
sudo mv ./bin/istioctl /usr/local/bin/istioctl
```

If you'd like command-line completion for the Istio `istioctl` client binary, then set it up as follows:

```bash
# generate the bash completion file and source it in your current shell
istioctl collateral --bash -o ~/completions
source ~/completions/istioctl.bash

# source the bash completion file in your .bashrc so that the command-line completions 
# are permanently available in your shell
echo "source ~/completions/istioctl.bash" >> ~/.bashrc
```

### Windows

To install the Istio `istioctl` client binary in a **Powershell**-based shell on Windows, use the following commands. These commands will copy the `istioctl` client binary to a new user program location and make it available via your `PATH`.

```powershell
cd istio-1.0.0
New-Item -ItemType Directory -Force -Path "C:/Program Files/Istio"
mv ./bin/istioctl.exe "C:/Program Files/Istio/"
$PATH = [environment]::GetEnvironmentVariable("PATH", "User")
[environment]::SetEnvironmentVariable("PATH", $PATH + "; C:/Program Files/Istio/", "User")
```

You've successfully installed the Istio `istioctl` client binary onto your client machine.

## Install the Istio Kubernetes components

Now it's time to install the Istio components into your Kubernetes cluster on AKS.

> TODO 
> 
> Where are these yaml files stored? Do we reference them directly or have a git clone command to pull them down?

> [!NOTE]
>
> The yaml files we'll be deploying in this section were built using the `helm template` rendering option described in the official Istio [Installation with Helm][istio-install-helm] documentation. We customised the rendered yaml by using the [Helm installation options][istio-install-helm-options] to include the grafana, prometheus and tracing (jaeger) addons.

Istio relies heavily on Kubernetes [Custom Resource Definitions (CRDs)][kubernetes-crd] and defines a number of Istio CRDs. Since some of the Istio resources have a dependency on these Istio CRDs, we'll deploy them first, by running the following command:

```azurecli-interactive
kubectl apply -f aks-istio-crds.yaml
```

The following example output shows the Custom Resource Definitions (CRDs) created for Istio:

```console
customresourcedefinition.apiextensions.k8s.io "virtualservices.networking.istio.io" created
customresourcedefinition.apiextensions.k8s.io "destinationrules.networking.istio.io" created
customresourcedefinition.apiextensions.k8s.io "serviceentries.networking.istio.io" created
customresourcedefinition.apiextensions.k8s.io "gateways.networking.istio.io" created
customresourcedefinition.apiextensions.k8s.io "envoyfilters.networking.istio.io" created
customresourcedefinition.apiextensions.k8s.io "httpapispecbindings.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "httpapispecs.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "quotaspecbindings.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "quotaspecs.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "rules.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "attributemanifests.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "bypasses.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "circonuses.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "deniers.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "fluentds.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "kubernetesenvs.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "listcheckers.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "memquotas.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "noops.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "opas.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "prometheuses.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "rbacs.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "redisquotas.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "servicecontrols.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "signalfxs.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "solarwindses.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "stackdrivers.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "statsds.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "stdios.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "apikeys.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "authorizations.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "checknothings.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "kuberneteses.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "listentries.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "logentries.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "edges.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "metrics.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "quotas.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "reportnothings.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "servicecontrolreports.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "tracespans.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "rbacconfigs.rbac.istio.io" created
customresourcedefinition.apiextensions.k8s.io "serviceroles.rbac.istio.io" created
customresourcedefinition.apiextensions.k8s.io "servicerolebindings.rbac.istio.io" created
customresourcedefinition.apiextensions.k8s.io "adapters.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "instances.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "templates.config.istio.io" created
customresourcedefinition.apiextensions.k8s.io "handlers.config.istio.io" created
```

Now that the Istio CRDs have been created, let's deploy the Istio components. We'll be installing the Istio resources into the `istio-system` namespace, which will be correctly created and configured via the applied yaml. Run the following command:

```azurecli-interactive
kubectl apply -f aks-istio.yaml -n istio-system
```

The following example output shows the various resources created for Istio:

```console
namespace "istio-system" created
configmap "istio-grafana-custom-resources" created
configmap "istio-statsd-prom-bridge" created
configmap "prometheus" created
configmap "istio-security-custom-resources" created
configmap "istio" created
configmap "istio-sidecar-injector" created
serviceaccount "istio-egressgateway-service-account" created
serviceaccount "istio-ingressgateway-service-account" created
serviceaccount "istio-grafana-post-install-account" created
clusterrole.rbac.authorization.k8s.io "istio-grafana-post-install-istio-system" created
clusterrolebinding.rbac.authorization.k8s.io "istio-grafana-post-install-role-binding-istio-system" created
job.batch "istio-grafana-post-install" created
serviceaccount "istio-mixer-service-account" created
serviceaccount "istio-pilot-service-account" created
serviceaccount "prometheus" created
serviceaccount "istio-cleanup-secrets-service-account" created
clusterrole.rbac.authorization.k8s.io "istio-cleanup-secrets-istio-system" created
clusterrolebinding.rbac.authorization.k8s.io "istio-cleanup-secrets-istio-system" created
job.batch "istio-cleanup-secrets" created
serviceaccount "istio-security-post-install-account" created
clusterrole.rbac.authorization.k8s.io "istio-security-post-install-istio-system" created
clusterrolebinding.rbac.authorization.k8s.io "istio-security-post-install-role-binding-istio-system" created
job.batch "istio-security-post-install" created
serviceaccount "istio-citadel-service-account" created
serviceaccount "istio-sidecar-injector-service-account" created
clusterrole.rbac.authorization.k8s.io "istio-egressgateway-istio-system" created
clusterrole.rbac.authorization.k8s.io "istio-ingressgateway-istio-system" created
clusterrole.rbac.authorization.k8s.io "istio-mixer-istio-system" created
clusterrole.rbac.authorization.k8s.io "istio-pilot-istio-system" created
clusterrole.rbac.authorization.k8s.io "prometheus-istio-system" created
clusterrole.rbac.authorization.k8s.io "istio-citadel-istio-system" created
clusterrole.rbac.authorization.k8s.io "istio-sidecar-injector-istio-system" created
clusterrolebinding.rbac.authorization.k8s.io "istio-egressgateway-istio-system" created
clusterrolebinding.rbac.authorization.k8s.io "istio-ingressgateway-istio-system" created
clusterrolebinding.rbac.authorization.k8s.io "istio-mixer-admin-role-binding-istio-system" created
clusterrolebinding.rbac.authorization.k8s.io "istio-pilot-istio-system" created
clusterrolebinding.rbac.authorization.k8s.io "prometheus-istio-system" created
clusterrolebinding.rbac.authorization.k8s.io "istio-citadel-istio-system" created
clusterrolebinding.rbac.authorization.k8s.io "istio-sidecar-injector-admin-role-binding-istio-system" created
service "istio-egressgateway" created
service "istio-ingressgateway" created
service "grafana" created
service "istio-policy" created
service "istio-telemetry" created
service "istio-statsd-prom-bridge" created
deployment.extensions "istio-statsd-prom-bridge" created
service "istio-pilot" created
service "prometheus" created
service "istio-citadel" created
service "istio-sidecar-injector" created
deployment.extensions "istio-egressgateway" created
deployment.extensions "istio-ingressgateway" created
deployment.extensions "grafana" created
deployment.extensions "istio-policy" created
deployment.extensions "istio-telemetry" created
deployment.extensions "istio-pilot" created
deployment.extensions "prometheus" created
deployment.extensions "istio-citadel" created
deployment.extensions "istio-sidecar-injector" created
deployment.extensions "istio-tracing" created
gateway.networking.istio.io "istio-autogenerated-k8s-ingress" created
horizontalpodautoscaler.autoscaling "istio-egressgateway" created
horizontalpodautoscaler.autoscaling "istio-ingressgateway" created
horizontalpodautoscaler.autoscaling "istio-policy" created
horizontalpodautoscaler.autoscaling "istio-telemetry" created
horizontalpodautoscaler.autoscaling "istio-pilot" created
service "jaeger-query" created
service "jaeger-collector" created
service "jaeger-agent" created
service "zipkin" created
service "tracing" created
mutatingwebhookconfiguration.admissionregistration.k8s.io "istio-sidecar-injector" created
attributemanifest.config.istio.io "istioproxy" created
attributemanifest.config.istio.io "kubernetes" created
stdio.config.istio.io "handler" created
logentry.config.istio.io "accesslog" created
logentry.config.istio.io "tcpaccesslog" created
rule.config.istio.io "stdio" created
rule.config.istio.io "stdiotcp" created
metric.config.istio.io "requestcount" created
metric.config.istio.io "requestduration" created
metric.config.istio.io "requestsize" created
metric.config.istio.io "responsesize" created
metric.config.istio.io "tcpbytesent" created
metric.config.istio.io "tcpbytereceived" created
prometheus.config.istio.io "handler" created
rule.config.istio.io "promhttp" created
rule.config.istio.io "promtcp" created
kubernetesenv.config.istio.io "handler" created
rule.config.istio.io "kubeattrgenrulerule" created
rule.config.istio.io "tcpkubeattrgenrulerule" created
kubernetes.config.istio.io "attributes" created
destinationrule.networking.istio.io "istio-policy" created
destinationrule.networking.istio.io "istio-telemetry" created
```

## Validate the installation

We've just deployed a large number of objects. You can expect the deployment to complete in between 2 to 3 minutes, depending on the cluster environment. To be confident that we have a successful deployment of Istio, let's validate the installation.

First we'll confirm that the services we expect, have been created. USe the following command and make sure that you are querying the `istio-system` namespace, since that is where the Istio and add-on components have been installed.

```azurecli-interactive
kubectl get svc -n istio-system -o wide
```

The following example output shows the services that should now be running:

- the `istio-*` services
- the `jaeger-*`, `tracing`, and `zipkin` add-on tracing services
- the `prometheus` add-on metrics service
- the `grafana` add-on analytics and monitoring dashboard service

If the `istio-ingressgateway` shows an external ip of `<pending>`, wait until an IP address has been assigned by Azure networking.

```console
NAME                       TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                                                                                                     AGE       SELECTOR
grafana                    ClusterIP      10.0.34.115    <none>           3000/TCP                                                                                                    1d        app=grafana
istio-citadel              ClusterIP      10.0.181.178   <none>           8060/TCP,9093/TCP                                                                                           1d        istio=citadel
istio-egressgateway        ClusterIP      10.0.227.253   <none>           80/TCP,443/TCP                                                                                              1d        app=istio-egressgateway,istio=egressgateway
istio-ingressgateway       LoadBalancer   10.0.28.76     52.187.250.253   80:31380/TCP,443:31390/TCP,31400:31400/TCP,15011:30779/TCP,8060:30966/TCP,15030:31752/TCP,15031:30289/TCP   1d        app=istio-ingressgateway,istio=ingressgateway
istio-pilot                ClusterIP      10.0.154.217   <none>           15010/TCP,15011/TCP,8080/TCP,9093/TCP                                                                       1d        istio=pilot
istio-policy               ClusterIP      10.0.24.65     <none>           9091/TCP,15004/TCP,9093/TCP                                                                                 1d        istio-mixer-type=policy,istio=mixer
istio-sidecar-injector     ClusterIP      10.0.148.138   <none>           443/TCP                                                                                                     1d        istio=sidecar-injector
istio-statsd-prom-bridge   ClusterIP      10.0.180.251   <none>           9102/TCP,9125/UDP                                                                                           1d        istio=statsd-prom-bridge
istio-telemetry            ClusterIP      10.0.60.234    <none>           9091/TCP,15004/TCP,9093/TCP,42422/TCP                                                                       1d        istio-mixer-type=telemetry,istio=mixer
jaeger-agent               ClusterIP      None           <none>           5775/UDP,6831/UDP,6832/UDP                                                                                  1d        app=jaeger
jaeger-collector           ClusterIP      10.0.17.102    <none>           14267/TCP,14268/TCP                                                                                         1d        app=jaeger
jaeger-query               ClusterIP      10.0.236.253   <none>           16686/TCP                                                                                                   1d        app=jaeger
prometheus                 ClusterIP      10.0.56.164    <none>           9090/TCP                                                                                                    1d        app=prometheus
tracing                    ClusterIP      10.0.187.129   <none>           80/TCP                                                                                                      1d        app=jaeger
zipkin                     ClusterIP      10.0.64.37     <none>           9411/TCP                                                                                                    1d        app=jaeger
```

Next, we'll confirm the pods that have been created. Run the following command and remember to make sure that you are querying the `istio-system` namespace, since that is where the Istio components have been installed.

```azurecli-interactive
kubectl get pods -n istio-system -o wide
```

All of the pods should have a status of `Running`. The `istio-cleanup-secrets-*`, `istio-grafana-post-install-*`, and `istio-security-post-install-*` pods are installation jobs that should have a status of `Completed`. If the pods don't have these statuses, wait until they do. Then your Istio installation will be complete.

The following example output shows the pods that are running and jobs that are completed:

- the `istio-*` pods
- the `prometheus-*` add-on metrics pod
- the `grafana-*` add-on analytics and monitoring dashboard pod

```console
NAME                                        READY     STATUS      RESTARTS   AGE       IP            NODE
grafana-5fb774bcc9-6mbgp                    1/1       Running     0          2m        10.244.2.66   aks-nodepool1-97557610-0
istio-citadel-5b956fdf54-sd4wj              1/1       Running     0          2m        10.244.1.87   aks-nodepool1-97557610-2
istio-cleanup-secrets-qjkq5                 0/1       Completed   0          2m        10.244.2.63   aks-nodepool1-97557610-0
istio-egressgateway-5b687dc55-mfx5q         1/1       Running     0          2m        10.244.2.65   aks-nodepool1-97557610-0
istio-grafana-post-install-gsxnh            0/1       Completed   2          2m        10.244.1.80   aks-nodepool1-97557610-2
istio-ingressgateway-67dc8cc78d-bpg6r       1/1       Running     0          2m        10.244.1.82   aks-nodepool1-97557610-2
istio-pilot-5d55c49754-t49bz                2/2       Running     0          2m        10.244.2.68   aks-nodepool1-97557610-0
istio-policy-654c96859d-fc9sr               2/2       Running     0          2m        10.244.2.67   aks-nodepool1-97557610-0
istio-security-post-install-44qrs           0/1       Completed   2          2m        10.244.1.81   aks-nodepool1-97557610-2
istio-sidecar-injector-6d59d46ff4-96h2h     1/1       Running     0          2m        10.244.1.89   aks-nodepool1-97557610-2
istio-statsd-prom-bridge-7f44bb5ddb-29tb5   1/1       Running     0          2m        10.244.2.64   aks-nodepool1-97557610-0
istio-telemetry-d6b996595-2ctdv             2/2       Running     0          2m        10.244.1.85   aks-nodepool1-97557610-2
istio-tracing-ff94688bb-prm8v               1/1       Running     0          2m        10.244.1.86   aks-nodepool1-97557610-2
prometheus-84bd4b9796-qlsxd                 1/1       Running     0          2m        10.244.1.84   aks-nodepool1-97557610-2
```

Congratulations! You have successfully installed Istio on Azure Kubernetes Service (AKS).

## Accessing the add-ons

We installed a number of add-ons with Istio in our setup above that provide additional functionality. The user interfaces for the add-ons installed in our setup, are not exposed publicly via an external ip address. To access the add-on user interfaces, we'll use the `kubectl port-forward` command. This command will create a secure connection between a local port on your client machine and the relevant pod in your AKS cluster.

### Grafana

Forward the local port `3000` on your client machine to port `3000` on the pod that is running Grafana in your AKS cluster. The port forward will allow you to access the analytics and monitoring dashboards for Istio provided by [Grafana][grafana].

```console
kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=grafana -o jsonpath='{.items[0].metadata.name}') 3000:3000
```

The following example output shows the port-forward being configured for Grafana.

```console
Forwarding from 127.0.0.1:3000 -> 3000
Forwarding from [::1]:3000 -> 3000
```

You can now reach Grafana at the following url on your client machine: http://localhost:3000.

### Prometheus

Forward the local port `9090` on your client machine to port `9090` on the pod that is running Prometheus in your AKS cluster. The port forward will allow you to access the expression browser for the metrics provided by [Prometheus][prometheus].

```console
kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=prometheus -o jsonpath='{.items[0].metadata.name}') 9090:9090
```

The following example output shows the port-forward being configured for Prometheus.

```console
Forwarding from 127.0.0.1:9090 -> 9090
Forwarding from [::1]:9090 -> 9090
```

You can now reach Prometheus expression browser at the following url on your client machine: http://localhost:9090.

### Jaeger

Forward the local port `16686` on your client machine to port `16686` on the pod that is running Jaeger in your AKS cluster. The port forward will allow you to access the tracing user interface provided by [Jaeger][jaeger].

```console
kubectl port-forward -n istio-system $(kubectl get pod -n istio-system -l app=jaeger -o jsonpath='{.items[0].metadata.name}') 16686:16686
```

The following example output shows the port-forward being configured for Jaeger.

```console
Forwarding from 127.0.0.1:16686 -> 16686
Forwarding from [::1]:16686 -> 16686
```

You can now reach Jaeger tracing user interface at the following url on your client machine: http://localhost:16686.

## Next steps

If you'd like to explore further installation options for Istio, see the following official Istio installation guidance:

- [Istio - Kubernetes installation quickstart][istio-install-k8s-quickstart]
- [Istio - Helm installation][istio-install-helm] and [Istio - Helm installation options][istio-install-helm-options]

If you'd like to explore how you can use Istio to provide intelligent routing between multiple versions of your application and to roll out a canary release, see the following documentation.

> [!div class="nextstepaction"]
> [AKS Istio intelligent routing scenario][istio-scenario-routing]

You can also follow additional scenarios using the Bookinfo Application example on the Istio site.

> [!div class="nextstepaction"]
> [Istio Bookinfo Application example][istio-bookinfo-example]

<!-- LINKS - external -->
[istio]: https://istio.io
[istio-docs-concepts]: https://istio.io/docs/concepts/what-is-istio/
[istio-github]: https://github.com/istio/istio
[istio-github-releases]: https://github.com/istio/istio/releases
[istio-install-download]: https://istio.io/docs/setup/kubernetes/download-release/
[istio-install-k8s-quickstart]: https://istio.io/docs/setup/kubernetes/quick-start/
[istio-install-helm]: https://istio.io/docs/setup/kubernetes/helm-install/
[istio-install-helm-options]: https://istio.io/docs/reference/config/installation-options/
[istio-bookinfo-example]: https://istio.io/docs/examples/bookinfo/
[install-wsl]: https://docs.microsoft.com/en-us/windows/wsl/install-win10
[kubernetes-crd]: https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/
[grafana]: https://grafana.com/
[prometheus]: https://prometheus.io/
[jaeger]: https://www.jaegertracing.io/


<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md
[istio-scenario-routing]: ./istio-scenario-routing.md
