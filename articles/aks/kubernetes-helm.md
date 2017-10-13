---
title: Deploy containers with Helm in Azure Kubernetes | Microsoft Docs
description: Use the Helm packaging tool to deploy containers on a Kubernetes cluster in Azure Container Service 
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: ''

ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/05/2017
ms.author: nepeters
ms.custom: mvc

---
# Use Helm to deploy application on a Kubernetes cluster 

[Helm](https://github.com/kubernetes/helm/) is an open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. Similar to Linux package managers such as Apt-get and Yum, Helm is used to manage Kubernetes charts, which are packages of preconfigured Kubernetes resources.

This document steps through configuring and using helm in a Kubernetes cluster on Azure.

## Prerequisites

To complete the steps in this document, you need a Kubernetes cluster in Azure, and `kubectl` installed on your development system. Also, ensure that `kubectl` has been configured to connect to the Kubernetes cluster using the [az acs kubernetes get-credential]() command. This command downloads a configuration file that allows `kubectl` to connect to a Kubernetes cluster. This file is also used to connect Helm to the cluster.

For more information on completing these tasks, see the [Kubernetes on Azure quickstart](./container-service-kubernetes-walkthrough.md).

## Install Helm CLI

The Helm CLI is a client that runs on your development system and allows you to start, stop, and manage applications with Helm charts. 

To install the Helm CLI on a Mac use `brew`. For additional installation options see, [Installing Helm](https://github.com/kubernetes/helm/blob/master/docs/install.md).
 
```bash
brew install kubernetes-helm
```

Output:

```bash
==> Downloading https://homebrew.bintray.com/bottles/kubernetes-helm-2.6.2.sierra.bottle.1.tar.gz
######################################################################## 100.0%
==> Pouring kubernetes-helm-2.6.2.sierra.bottle.1.tar.gz
==> Caveats
Bash completion has been installed to:
  /usr/local/etc/bash_completion.d
==> Summary
🍺  /usr/local/Cellar/kubernetes-helm/2.6.2: 50 files, 132.4MB
```

## Configure Helm Tiller

Tiller is a server-side component that runs on the Kubernetes cluster. Tiler manages the lifecycle of Kubernetes applications that have been run using Helm charts. 

Tiller is pre-installed on Kubernetes clusters in Azure, however the [helm init](https://docs.helm.sh/helm/#helm-init) command can be used to validate that Tiller is running the latest version. 

The [helm init](https://docs.helm.sh/helm/#helm-init) command is also used to connect the Helm CLI with the Kubernetes cluster using a Kubernetes configuration file.

```bash
helm init --upgrade
```

Output:

```bash
$HELM_HOME has been configured at /Users/neilpeterson/.helm.
Warning: Tiller is already installed in the cluster.
(Use --client-only to suppress this message, or --upgrade to upgrade Tiller to the current version.)
Happy Helming!
```

## Find Helm charts 

Helm charts are used to deploy applications into a Kubernetes cluster. To search for pre-created Helm charts, use the [helm search](https://docs.helm.sh/helm/#helm-search) command.

```bash 
helm search 
```

The output looks similar to, however with many more charts.

```bash
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
```

To update the list charts, use the [helm repo update](https://docs.helm.sh/helm/#helm-repo-update) command.

```bash 
helm repo update 
```

Output:

```bash
Hang tight while we grab the latest from your chart repositories...
...Skip local chart repository
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈ Happy Helming!⎈ 
```

## Deploy a Helm chart 
 
To deploy a Nginx ingress controller chart, use the [helm install](https://docs.helm.sh/helm/#helm-install) command.

```bash
helm install stable/nginx-ingress 
```

The output looks similar to the following however include much more information including instructions on how to use the Kubernetes deployment.

```bash
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
```

For more information on using an NGINX ingress controller with Kubernetes, see [NGINX Ingress Controller](https://github.com/kubernetes/ingress/tree/master/controllers/nginx).

## List installed Helm charts

To see a list of charts installed on your cluster, type:

```bash
helm list 
```

Output:

```bash
NAME         	REVISION	UPDATED                 	STATUS  	CHART              	NAMESPACE
bilging-ant  	1       	Thu Oct  5 00:11:11 2017	DEPLOYED	nginx-ingress-0.8.7	default 
```
  
## Next steps

For more information about managing Kubernetes charts, see the Helm documentation.

> [!div class="nextstepaction"]
> [Helm documentation](https://github.com/kubernetes/helm/blob/master/docs/index.md)