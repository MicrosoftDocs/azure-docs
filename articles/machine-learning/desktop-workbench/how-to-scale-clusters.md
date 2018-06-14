---
title: How to scale an Azure Container Service cluster for Machine Learning | Microsoft Docs
description: Scaling an ACS cluster - autoscale and static scaling; scaling the number of nodes in the cluster
services: machine-learning
author: aashishb
ms.author: aashishb
manager: mwinkle
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 10/04/2017

ROBOTS: NOINDEX
---

# Scaling the cluster to manage web service throughput

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]


## Why scale the cluster?

Scaling the Azure Container Service (ACS) cluster is an effective way to optimize the service throughput while keeping the cluster size to a minimum to reduce cost. 

To better understand autoscaling, consider the following example of a cluster running three web services:

![Example: Three services on a cluster](media/how-to-scale-clusters/three-services.png)

The services have various peak demands: Service 1 (blue line) requires 40 pods at peak demand, Service 2 (orange line) requires 38 at peak, and Service 3 (gray line) requires 50 at peak. If you reserve the needed peak capacity for each service individually, this cluster would need at least 40 + 38 + 50 = 128 total pods.

But consider the actual pod usage at any point in time, represented by the black dashed line in the graph. In this case, the *highest number of pods used at any one time* is 64, which occurs at 20:00 when Service 3 is at peak. At this time, Service 3 uses 50 pods, but Service 2 uses just 9 pods, and Service 1 uses only 5. Remember, this is *peak usage* for this cluster. This means that at no time does the cluster use more than 64 pods -- half the calculated requirement of 128 pods for the three services scaled independently for peak usage.

By reassigning pods in the cluster -- that is, by rescaling -- to meet the current demand of each service rather than simply require sufficient resources for the peak demand of all services, you can decrease your cluster size. In this simple example, autoscaling decreases the required number of pods from 128 to 64, cutting the required cluster size in half.

Scaling the number of pods is a relatively fast operation, requiring less than a minute, so the service's responsiveness is not seriously impacted.

> [!NOTE]
> Scaling a cluster will not help with request latency issues. For operationalization purposes, scaling up should increase the number of successes and decrease Service Unavailable errors. 

## How to scale web services on your ACS cluster

The cluster setup option of the model management CLI by default configures two agents and one pod in your environment. It also installs the Kubernetes CLI.

You can scale the web services you have deployed to ACS by adjusting:

* The number of agent nodes in the cluster
* The number of Kubernetes pod replicas running on agent nodes

### Scaling the number of nodes in the cluster

The following command sets the count of agent nodes in the cluster:

```
az acs scale -g <resource group> -n <cluster name> --new-agent-count <new scale>
```

This will take a few minutes to complete. For more information on scaling the number of nodes in the cluster, see [Scale agent nodes in a Container Service cluster](https://docs.microsoft.com/azure/container-service/container-service-scale).

### Scaling the number of Kubernetes pod replicas in a cluster
 
You can scale the number of pod replicas assigned to the cluster using the Azure Machine Learning CLI or the [Kubernetes dashboard] (https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/).

For more information on Kubernetes replica pods, see the [Kubernetes Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/) documentation.

#### Scaling a cluster with the Azure Machine Learning CLI

There are two ways to scale a cluster using the CLI:

- Autoscale
- Static scale

Autoscale is active by default when the service is created, and in most situations is the preferred scaling method.

##### Autoscale

The following command enables auto-scale, and sets the minimum and maximum number of replicas for the service.

```
az ml service update realtime -i <service id> --autoscale-enabled true --autoscale-min-replicas <positive number> --autoscale-max-replicas <positive number>
```

For example, setting `autoscale-min-replicas` to 5 will create five replicas. To arrive at an optimum number for the web service, set the number to values such as 10 and monitor the number of 503 error messages. Then adjust the number accordingly.


| Parameter name | Type | Description |
|--------------------|--------------------|--------------------|
| `autoscale-enabled` | boolean | Specifies whether Autoscale is enabled. Default: true |
| `autoscale-min-replicas` | integer | Specifies the minimum number of pods. Must be 0 or greater. Default: 1 |
| `autoscale-max-replicas` | integer | Specifies the maximum number of pods. Must be 1 or greater. If autoscale-max-replicas is smaller than autoscale-min-replicas, autoscale-max-replicas will be ignored. Default: 10 |
| `autoscale-refresh-period-seconds` | integer | Specifies the duration in seconds between autoscale refreshes. Default: 1 |
| `autoscale-target-utilization` | integer | Specifies the percent utilization that autoscale targets, between 1 and 100. Default: 70 |

Autoscale works to ensure the following two conditions:

1. The target utilization is met
2. Scaling never exceeds the minimum and maximum settings

Services in a cluster compete for cluster resources. An autoscaled service will increase its cluster resource usage as its requests per second (RPS) increases, and will slowly release resources as the RPS decreases. Cluster resources will be acquired on demand as long as such resources exist for the service to acquire.

For more information on using the autoscale parameters, see the [Model Management Command Line Interface Reference](model-management-cli-reference.md) documentation.

##### Static scale

In general, static scaling should be avoided, since it does not allow the cluster size reduction of autoscaling. Even so, in some situations static scaling might be advised. For example, when a cluster is dedicated to a single service, autoscaling provides no benefit; all cluster resources should be assigned to that service.

In order to statically scale a cluster, autoscaling must be turned off. Disable autoscale with the following command:

```
az ml service update realtime -i <service id> --autoscale-enabled false
```

After turning off autoscale, the following command directly scales the number of replicas for a service.

```
az ml service update realtime -i <service id> -z <replica count>
```
 
For more information on scaling the number of nodes in the cluster, see Scale agent nodes in a Container Service cluster.

#### Scaling number of replicas using the Kubernetes dashboard

At the command line, enter:

```
kubectl proxy
```

On Windows, the Kubernetes install location is not automatically added to the path. First navigate to the install folder:

```
c:\users\<user name>\bin
```

Once you run the command, you should see the following informational message:

```
Starting to serve on 127.0.0.1:8001
```

If the port is already in use, you see a message similar to the following example:

```
F0612 21:49:22.459111   59621 proxy.go:137] listen tcp 127.0.0.1:8001: bind: address already in use
```

You can specify an alternate port number using the *--port* parameter.

```
kubectl proxy --port=8010
Starting to serve on 127.0.0.1:8010
```

Once you have started the dashboard server, open a browser and enter the following URL:

```
127.0.0.1:<port number>/ui
```

From the dashboard main screen, click **Deployments** on the left navigation bar. If the navigation pane does not display, select this icon ![Menu consisting of three short horizontal lines](media/how-to-scale-clusters/icon-hamburger.png) on the upper left.

Locate the deployment to modify and click this icon ![Menu icon consisting of three vertical dots](media/how-to-scale-clusters/icon-kebab.png) on the right and then click **View/Edit YAML**.

On the Edit deployment screen, locate the *spec* node, modify the *replicas* value, and click **Update**.
