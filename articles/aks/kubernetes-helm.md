---
title: Deploy containers with Helm in Kubernetes on Azure | Microsoft Docs
description: Use the Helm packaging tool to deploy containers on a Kubernetes cluster in AKS
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: aks, azure-container-service
keywords: ''

ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/24/2017
ms.author: nepeters
ms.custom: mvc

---
# Use Helm with Azure Container Service (AKS)

[Helm](https://github.com/kubernetes/helm/) is an open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. Similar to Linux package managers such as *APT* and *Yum*, Helm is used to manage Kubernetes charts, which are packages of preconfigured Kubernetes resources.

This document steps through configuring and using Helm in a Kubernetes cluster on AKS.

## Before you begin

The steps detailed in this document assume that you have created an AKS cluster and have established a kubectl connection with the cluster. If you need these items see, the [AKS quickstart](./kubernetes-walkthrough.md).

## Install Helm CLI

The Helm CLI is a client that runs on your development system and allows you to start, stop, and manage applications with Helm charts.

If you're using Azure CloudShell, the Helm CLI is already installed. To install the Helm CLI on a Mac use `brew`. For additional installation options see, [Installing Helm](https://github.com/kubernetes/helm/blob/master/docs/install.md).

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

## Configure Helm

The [helm init](https://docs.helm.sh/helm/#helm-init) command is used to install Helm components in a Kubernetes cluster and make client-side configurations. Helm is pre-installed in AKS clusters, so only the client-side configuration is needed. Run the following command to configure the Helm client.

```azurecli-interactive
helm init --client-only
```

Output:

```
$HELM_HOME has been configured at /Users/neilpeterson/.helm.
Not installing Tiller due to 'client-only' flag having been set
Happy Helming!
```

## Find Helm charts

Helm charts are used to deploy applications into a Kubernetes cluster. To search for pre-created Helm charts, use the [helm search](https://docs.helm.sh/helm/#helm-search) command.

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

To update the list of charts, use the [helm repo update](https://docs.helm.sh/helm/#helm-repo-update) command.

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

To deploy an NGINX ingress controller, use the [helm install](https://docs.helm.sh/helm/#helm-install) command.

```azurecli-interactive
helm install stable/nginx-ingress
```

The output looks similar to the following, but includes additional information such as instructions on how to use the Kubernetes deployment.

```
NAME:   tufted-ocelot
LAST DEPLOYED: Thu Oct  5 00:48:04 2017
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/ConfigMap
NAME                                    DATA  AGE
tufted-ocelot-nginx-ingress-controller  1     5s

==> v1/Service
NAME                                         CLUSTER-IP   EXTERNAL-IP  PORT(S)                     AGE
tufted-ocelot-nginx-ingress-controller       10.0.140.10  <pending>    80:30486/TCP,443:31358/TCP  5s
tufted-ocelot-nginx-ingress-default-backend  10.0.34.132  <none>       80/TCP                      5s

==> v1beta1/Deployment
NAME                                         DESIRED  CURRENT  UP-TO-DATE  AVAILABLE  AGE
tufted-ocelot-nginx-ingress-controller       1        1        1           0          5s
tufted-ocelot-nginx-ingress-default-backend  1        1        1           1          5s
...
```

For more information on using an NGINX ingress controller with Kubernetes, see [NGINX Ingress Controller](https://github.com/kubernetes/ingress/tree/master/controllers/nginx).

## List Helm charts

To see a list of charts installed on your cluster, use the [helm list](https://docs.helm.sh/helm/#helm-list) command.

```azurecli-interactive
helm list
```

Output:

```
NAME         	REVISION	UPDATED                 	STATUS  	CHART              	NAMESPACE
bilging-ant  	1       	Thu Oct  5 00:11:11 2017	DEPLOYED	nginx-ingress-0.8.7	default
```

## Next steps

For more information about managing Kubernetes charts, see the Helm documentation.

> [!div class="nextstepaction"]
> [Helm documentation](https://github.com/kubernetes/helm/blob/master/docs/index.md)