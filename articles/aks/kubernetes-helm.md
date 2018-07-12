---
title: Deploy containers with Helm in Kubernetes on Azure
description: Use the Helm packaging tool to deploy containers on a Kubernetes cluster in AKS
services: container-service
author: neilpeterson
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 06/13/2018
ms.author: nepeters
ms.custom: mvc
---

# Use Helm with Azure Kubernetes Service (AKS)

[Helm][helm] is an open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. Similar to Linux package managers such as *APT* and *Yum*, Helm is used to manage Kubernetes charts, which are packages of preconfigured Kubernetes resources.

This document steps through configuring and using Helm in a Kubernetes cluster on AKS.

## Before you begin

The steps detailed in this document assume that you have created an AKS cluster and have established a kubectl connection with the cluster. If you need these items see, the [AKS quickstart][aks-quickstart].

## Install Helm CLI

The Helm CLI is a client that runs on your development system and allows you to start, stop, and manage applications with Helm.

If you're using Azure CloudShell, the Helm CLI is already installed. To install the Helm CLI on a Mac use `brew`. For additional installation options see, [Installing Helm][helm-install-options].

```console
brew install kubernetes-helm
```

Output:

```
==> Downloading https://homebrew.bintray.com/bottles/kubernetes-helm-2.6.2.sierra.bottle.1.tar.gz
######################################################################## 100.0%
==> Pouring kubernetes-helm-2.6.2.sierra.bottle.1.tar.gz
==> Caveats
Bash completion has been installed to:
  /usr/local/etc/bash_completion.d
==> Summary
🍺  /usr/local/Cellar/kubernetes-helm/2.6.2: 50 files, 132.4MB
```

## Create service account

Before configuring Helm in an RBAC enabled cluster, you need a service account and role binding for the Tiller service. For more information on securing Helm / Tiller in an RBAC enabled cluster, see [Tiller, Namespaces, and RBAC][tiller-rbac]. Note, if your cluster is not RBAC enabled, skip this step.

Create a file named `helm-rbac.yaml` and copy in the following YAML.

```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system
```

Create the service account and role binding with the `kubectl create` command.

```
kubectl create -f helm-rbac.yaml
```

When using an RBAC enabled cluster, you have options on the level of access Tiller has to the cluster. See [Helm: role-based access controls][helm-rbac] for more information on configuration options.

## Configure Helm

Now install tiller using the [helm init][helm-init] command. If your cluster is not RBAC enabled, remove the `--service-account` argument and value.

```
helm init --service-account tiller
```

## Find Helm charts

Helm charts are used to deploy applications into a Kubernetes cluster. To search for pre-created Helm charts, use the [helm search][helm-search] command.

```azurecli-interactive
helm search
```

The output looks similar to the following, however with many more charts.

```
NAME                         	VERSION	DESCRIPTION
stable/acs-engine-autoscaler 	2.0.0  	Scales worker nodes within agent pools
stable/artifactory           	6.1.0  	Universal Repository Manager supporting all maj...
stable/aws-cluster-autoscaler	0.3.1  	Scales worker nodes within autoscaling groups.
stable/buildkite             	0.2.0  	Agent for Buildkite
stable/centrifugo            	2.0.0  	Centrifugo is a real-time messaging server.
stable/chaoskube             	0.5.0  	Chaoskube periodically kills random pods in you...
stable/chronograf            	0.3.0  	Open-source web application written in Go and R...
stable/cluster-autoscaler    	0.2.0  	Scales worker nodes within autoscaling groups.
stable/cockroachdb           	0.5.0  	CockroachDB is a scalable, survivable, strongly...
stable/concourse             	0.7.0  	Concourse is a simple and scalable CI system.
stable/consul                	0.4.1  	Highly available and distributed service discov...
stable/coredns               	0.5.0  	CoreDNS is a DNS server that chains middleware ...
stable/coscale               	0.2.0  	CoScale Agent
stable/dask-distributed      	2.0.0  	Distributed computation in Python
stable/datadog               	0.8.0  	DataDog Agent
...
```

To update the list of charts, use the [helm repo update][helm-repo-update] command.

```azurecli-interactive
helm repo update
```

Output:

```
Hang tight while we grab the latest from your chart repositories...
...Skip local chart repository
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈ Happy Helming!⎈
```

## Run Helm charts

To deploy Wordpress using a Helm chart, use the [helm install][helm-install] command.

```azurecli-interactive
helm install stable/wordpress
```

The output looks similar to the following, but includes additional information such as instructions on how to use the Kubernetes deployment.

```
NAME:   bilging-ibex
LAST DEPLOYED: Tue Jun  5 14:31:49 2018
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Pod(related)
NAME                                     READY  STATUS   RESTARTS  AGE
bilging-ibex-mariadb-7557b5474-dmdxn     0/1    Pending  0         1s
bilging-ibex-wordpress-7494c545fb-tskhz  0/1    Pending  0         1s

==> v1/Secret
NAME                    TYPE    DATA  AGE
bilging-ibex-mariadb    Opaque  2     1s
bilging-ibex-wordpress  Opaque  2     1s

==> v1/ConfigMap
NAME                        DATA  AGE
bilging-ibex-mariadb        1     1s
bilging-ibex-mariadb-tests  1     1s

==> v1/PersistentVolumeClaim
NAME                    STATUS   VOLUME   CAPACITY  ACCESS MODES  STORAGECLASS  AGE
bilging-ibex-mariadb    Pending  default  1s
bilging-ibex-wordpress  Pending  default  1s

==> v1/Service
NAME                    TYPE          CLUSTER-IP    EXTERNAL-IP  PORT(S)                     AGE
bilging-ibex-mariadb    ClusterIP     10.0.76.164   <none>       3306/TCP                    1s
bilging-ibex-wordpress  LoadBalancer  10.0.215.250  <pending>    80:30934/TCP,443:31134/TCP  1s

==> v1beta1/Deployment
NAME                    DESIRED  CURRENT  UP-TO-DATE  AVAILABLE  AGE
bilging-ibex-mariadb    1        1        1           0          1s
bilging-ibex-wordpress  1        1        1           0          1s
...
```

## List Helm releases

To see a list of releases installed on your cluster, use the [helm list][helm-list] command.

```azurecli-interactive
helm list
```

Output:

```
NAME        	REVISION	UPDATED                 	STATUS  	CHART          	NAMESPACE
bilging-ibex	1       	Tue Jun  5 14:31:49 2018	DEPLOYED	wordpress-1.0.9	default
```

## Next steps

For more information about managing Kubernetes charts, see the Helm documentation.

> [!div class="nextstepaction"]
> [Helm documentation][helm-documentation]

<!-- LINKS - external -->
[helm]: https://github.com/kubernetes/helm/
[helm-documentation]: https://github.com/kubernetes/helm/blob/master/docs/index.md
[helm-init]: https://docs.helm.sh/helm/#helm-init
[helm-install]: https://docs.helm.sh/helm/#helm-install
[helm-install-options]: https://github.com/kubernetes/helm/blob/master/docs/install.md
[helm-list]: https://docs.helm.sh/helm/#helm-list
[helm-rbac]: https://docs.helm.sh/using_helm/#role-based-access-control
[helm-repo-update]: https://docs.helm.sh/helm/#helm-repo-update
[helm-search]: https://docs.helm.sh/helm/#helm-search
[tiller-rbac]: https://docs.helm.sh/using_helm/#tiller-namespaces-and-rbac

<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md