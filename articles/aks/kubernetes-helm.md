---
title: Install existing applications with Helm in AKS
description: Learn how to use the Helm packaging tool to deploy containers in an Azure Kubernetes Service (AKS) cluster
services: container-service
author: zr-msft
ms.topic: article
ms.date: 06/24/2020
ms.author: zarhoads

#Customer intent: As a cluster operator or developer, I want to learn how to deploy Helm into an AKS cluster and then install and manage applications using Helm charts.
---

# Install existing applications with Helm in Azure Kubernetes Service (AKS)

[Helm][helm] is an open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. Similar to Linux package managers such as *APT* and *Yum*, Helm is used to manage Kubernetes charts, which are packages of preconfigured Kubernetes resources.

This article shows you how to configure and use Helm in a Kubernetes cluster on AKS.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

You also need the Helm CLI installed, which is the client that runs on your development system. It allows you to start, stop, and manage applications with Helm. If you use the Azure Cloud Shell, the Helm CLI is already installed. For installation instructions on your local platform, see [Installing Helm][helm-install].

> [!IMPORTANT]
> Helm is intended to run on Linux nodes. If you have Windows Server nodes in your cluster, you must ensure that Helm pods are only scheduled to run on Linux nodes. You also need to ensure that any Helm charts you install are also scheduled to run on the correct nodes. The commands in this article use [node-selectors][k8s-node-selector] to make sure pods are scheduled to the correct nodes, but not all Helm charts may expose a node selector. You can also consider using other options on your cluster, such as [taints][taints].

## Verify your version of Helm

Use the `helm version` command to verify you have Helm 3 installed:

```console
helm version
```

The following example shows Helm version 3.0.0 installed:

```console
$ helm version

version.BuildInfo{Version:"v3.0.0", GitCommit:"e29ce2a54e96cd02ccfce88bee4f58bb6e2a28b6", GitTreeState:"clean", GoVersion:"go1.13.4"}
```

## Install an application with Helm v3

### Add the official Helm stable charts repository

Use the [helm repo][helm-repo-add] command to add the official Helm stable charts repository.

```console
helm repo add stable https://kubernetes-charts.storage.googleapis.com/
```

### Find Helm charts

Helm charts are used to deploy applications into a Kubernetes cluster. To search for pre-created Helm charts, use the [helm search][helm-search] command:

```console
helm search repo stable
```

The following condensed example output shows some of the Helm charts available for use:

```console
$ helm search repo stable

NAME                                 	CHART VERSION	APP VERSION                 	DESCRIPTION                                       
stable/acs-engine-autoscaler         	2.2.2        	2.1.1                       	DEPRECATED Scales worker nodes within agent pools 
stable/aerospike                     	0.3.1        	v4.5.0.5                    	A Helm chart for Aerospike in Kubernetes          
stable/airflow                       	4.10.0       	1.10.4                      	Airflow is a platform to programmatically autho...
stable/ambassador                    	4.4.7        	0.85.0                      	A Helm chart for Datawire Ambassador              
stable/anchore-engine                	1.3.7        	0.5.2                       	Anchore container analysis and policy evaluatio...
stable/apm-server                    	2.1.5        	7.0.0                       	The server receives data from the Elastic APM a...
stable/ark                           	4.2.2        	0.10.2                      	DEPRECATED A Helm chart for ark                   
stable/artifactory                   	7.3.1        	6.1.0                       	DEPRECATED Universal Repository Manager support...
stable/artifactory-ha                	0.4.1        	6.2.0                       	DEPRECATED Universal Repository Manager support...
stable/atlantis                      	3.8.4        	v0.8.2                      	A Helm chart for Atlantis https://www.runatlant...
stable/auditbeat                     	1.1.0        	6.7.0                       	A lightweight shipper to audit the activities o...
stable/aws-cluster-autoscaler        	0.3.3        	                            	Scales worker nodes within autoscaling groups.    
stable/aws-iam-authenticator         	0.1.1        	1.0                         	A Helm chart for aws-iam-authenticator            
stable/bitcoind                      	0.2.2        	0.17.1                      	Bitcoin is an innovative payment network and a ...
stable/bookstack                     	1.1.2        	0.27.4-1                    	BookStack is a simple, self-hosted, easy-to-use...
stable/buildkite                     	0.2.4        	3                           	DEPRECATED Agent for Buildkite                    
stable/burrow                        	1.5.2        	0.29.0                      	Burrow is a permissionable smart contract machine 
stable/centrifugo                    	3.1.0        	2.1.0                       	Centrifugo is a real-time messaging server.       
stable/cerebro                       	1.3.1        	0.8.5                       	A Helm chart for Cerebro - a web admin tool tha...
stable/cert-manager                  	v0.6.7       	v0.6.2                      	A Helm chart for cert-manager                     
stable/chaoskube                     	3.1.2        	0.14.0                      	Chaoskube periodically kills random pods in you...
stable/chartmuseum                   	2.4.0        	0.8.2                       	Host your own Helm Chart Repository               
stable/chronograf                    	1.1.0        	1.7.12                      	Open-source web application written in Go and R...
stable/clamav                        	1.0.4        	1.6                         	An Open-Source antivirus engine for detecting t...
stable/cloudserver                   	1.0.3        	8.1.5                       	An open-source Node.js implementation of the Am...
stable/cluster-autoscaler            	6.2.0        	1.14.6                      	Scales worker nodes within autoscaling groups.    
stable/cluster-overprovisioner       	0.2.6        	1.0                         	Installs the a deployment that overprovisions t...
stable/cockroachdb                   	2.1.16       	19.1.5                      	CockroachDB is a scalable, survivable, strongly...
stable/collabora-code                	1.0.5        	4.0.3.1                     	A Helm chart for Collabora Office - CODE-Edition  
stable/concourse                     	8.2.7        	5.6.0                       	Concourse is a simple and scalable CI system.     
stable/consul                        	3.9.2        	1.5.3                       	Highly available and distributed service discov...
stable/contour                       	0.1.0        	v0.15.0                     	Contour Ingress controller for Kubernetes         
stable/coredns                       	1.7.4        	1.6.4                       	CoreDNS is a DNS server that chains plugins and...
stable/cosbench                      	1.0.1        	0.0.6                       	A benchmark tool for cloud object storage services
stable/coscale                       	1.0.0        	3.16.0                      	CoScale Agent                                     
stable/couchbase-operator            	1.0.1        	1.2.1                       	A Helm chart to deploy the Couchbase Autonomous...
stable/couchdb                       	2.3.0        	2.3.1                       	DEPRECATED A database featuring seamless multi-...
stable/dask                          	3.1.0        	1.1.5                       	Distributed computation in Python with task sch...
stable/dask-distributed              	2.0.2        	                            	DEPRECATED: Distributed computation in Python     
stable/datadog                       	1.38.3       	6.14.0                      	DataDog Agent 
...
```

To update the list of charts, use the [helm repo update][helm-repo-update] command.

```console
helm repo update
```

The following example shows a successful repo update:

```console
$ helm repo update

Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈ Happy Helming!⎈
```

### Run Helm charts

To install charts with Helm, use the [helm install][helm-install-command] command and specify a release name and the name of the chart to install. To see installing a Helm chart in action, let's install a basic nginx deployment using a Helm chart.

```console
helm install my-nginx-ingress stable/nginx-ingress \
    --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux
```

The following condensed example output shows the deployment status of the Kubernetes resources created by the Helm chart:

```console
$ helm install my-nginx-ingress stable/nginx-ingress \
>     --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
>     --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux

NAME: my-nginx-ingress
LAST DEPLOYED: Fri Nov 22 10:08:06 2019
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
The nginx-ingress controller has been installed.
It may take a few minutes for the LoadBalancer IP to be available.
You can watch the status by running 'kubectl --namespace default get services -o wide -w my-nginx-ingress-controller'
...
```

Use the `kubectl get services` command to get the *EXTERNAL-IP* of your service.

```console
kubectl --namespace default get services -o wide -w my-nginx-ingress-controller
```

For example, the below command shows the *EXTERNAL-IP* for the *my-nginx-ingress-controller* service:

```console
$ kubectl --namespace default get services -o wide -w my-nginx-ingress-controller

NAME                          TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE   SELECTOR
my-nginx-ingress-controller   LoadBalancer   10.0.123.1     <EXTERNAL-IP>   80:31301/TCP,443:31623/TCP   96s   app=nginx-ingress,component=controller,release=my-nginx-ingress
```

### List releases

To see a list of releases installed on your cluster, use the `helm list` command.

```console
helm list
```

The following example shows the *my-nginx-ingress* release deployed in the previous step:

```console
$ helm list

NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART               	APP VERSION
my-nginx-ingress	default  	1       	2019-11-22 10:08:06.048477 -0600 CST	deployed	nginx-ingress-1.25.0	0.26.1 
```

### Clean up resources

When you deploy a Helm chart, a number of Kubernetes resources are created. These resources include pods, deployments, and services. To clean up these resources, use the [helm uninstall][helm-cleanup] command and specify your release name, as found in the previous `helm list` command.

```console
helm uninstall my-nginx-ingress
```

The following example shows the release named *my-nginx-ingress* has been uninstalled:

```console
$ helm uninstall my-nginx-ingress

release "my-nginx-ingress" uninstalled
```

## Next steps

For more information about managing Kubernetes application deployments with Helm, see the Helm documentation.

> [!div class="nextstepaction"]
> [Helm documentation][helm-documentation]

<!-- LINKS - external -->
[helm]: https://github.com/kubernetes/helm/
[helm-cleanup]: https://helm.sh/docs/intro/using_helm/#helm-uninstall-uninstalling-a-release
[helm-documentation]: https://helm.sh/docs/
[helm-install]: https://helm.sh/docs/intro/install/
[helm-install-command]: https://helm.sh/docs/intro/using_helm/#helm-install-installing-a-package
[helm-repo-add]: https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository
[helm-search]: https://helm.sh/docs/intro/using_helm/#helm-search-finding-charts
[helm-repo-update]: https://helm.sh/docs/intro/using_helm/#helm-repo-working-with-repositories
            
<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[taints]: operator-best-practices-advanced-scheduler.md
