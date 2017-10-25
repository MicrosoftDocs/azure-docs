---
title: Kubernetes on Azure tutorial  - Monitor Kubernetes | Microsoft Docs
description: AKS tutorial - Monitor Kubernetes with Microsoft Operations Management Suite (OMS)
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: aks, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: aurecli
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/24/2017
ms.author: nepeters
ms.custom: mvc
---

# Monitor Azure Container Service (AKS)

Monitoring your Kubernetes cluster and containers is critical, especially when you manage a production cluster at scale with multiple apps. 

You can take advantage of several Kubernetes monitoring solutions, either from Microsoft or other providers. In this tutorial, you monitor your Kubernetes cluster using the [Containers solution for Log Analytics](../log-analytics/log-analytics-containers.md), Microsoft's cloud-based IT management solution.

This tutorial, part seven of eight, covers the following tasks:

> [!div class="checklist"]
> * Configuring the container monitoring solution
> * Configuring the monitoring agents
> * Access monitoring information in the Azure portal

## Before you begin

In previous tutorials, an application was packaged into container images, these images uploaded to Azure Container Registry, and a Kubernetes cluster created. 

If you have not done these steps, and would like to follow along, return to [Tutorial 1 – Create container images](./tutorial-kubernetes-prepare-app.md).

## Configure containers solution

In the Azure portal, click *New* and search for `Container Monitoring Solution`. Once located, click on *Create*.

![Add solution](./media/container-service-tutorial-kubernetes-monitor/add-solution.png)

Create a new OMS workspace, or select an existing one. The OMS Workspace form guide you through the process. When creating the workspace, select *Pin to dashboard* for easy retrieval.

![OMS Workspace](./media/container-service-tutorial-kubernetes-monitor/oms-workspace.png)

When done, select *Ok* and *Create* to create the container monitoring solution.

Once the workspace has been created, it will be presented to you in the Azure portal.

## Get Workspace settings

The Log analytics Workspace ID and key are needed for configuring the solution agent on the Kubernetes nodes. 

To retrieve these values, Select *OMS Workspace* from the container solutions left hand menu. Select *Advanced settings* and take note of the *Workspace ID* and the *Primary Key*.

## Configure monitoring agents

The following Kuberentes manifest file can be used to configure the container monitoring solution on your Kubernetes cluster. It creates a Kubernetes [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/), which runs a single identical pod on each cluster node. The DaemonSet resource is ideal for deploying a monitoring agent. 

Save the following text to a file named `oms-daemonset.yaml`, and replace the placeholder values for *myWorkspaceID* and *myWorkspaceKey* with your Log Analytics Workspace ID and Key. 

See the [Container Monitoring Log Analytics documentation](../log-analytics/log-analytics-containers.md) for additional installation options.

```YAML
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
 name: omsagent
spec:
 template:
  metadata:
   labels:
    app: omsagent
    agentVersion: 1.4.0-12
    dockerProviderVersion: 10.0.0-25
  spec:
   containers:
     - name: omsagent 
       image: "microsoft/oms"
       imagePullPolicy: Always
       env:
       - name: WSID
         value: <WSID>
       - name: KEY 
         value: <KEY>
       securityContext:
         privileged: true
       ports:
       - containerPort: 25225
         protocol: TCP 
       - containerPort: 25224
         protocol: UDP
       volumeMounts:
        - mountPath: /var/run/docker.sock
          name: docker-sock
        - mountPath: /var/opt/microsoft/omsagent/state/containerhostname
          name: container-hostname
        - mountPath: /var/log 
          name: host-log
       livenessProbe:
        exec:
         command:
         - /bin/bash
         - -c
         - ps -ef | grep omsagent | grep -v "grep"
        initialDelaySeconds: 60
        periodSeconds: 60
   nodeSelector:
    beta.kubernetes.io/os: linux    
   # Tolerate a NoSchedule taint on master that ACS Engine sets.
   tolerations:
    - key: "node-role.kubernetes.io/master"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"     
   volumes:
    - name: docker-sock 
      hostPath:
       path: /var/run/docker.sock
    - name: container-hostname
      hostPath:
       path: /etc/hostname
    - name: host-log
      hostPath:
       path: /var/log 
```

Create the DaemonSet with the following command:

```azurecli-interactive
kubectl create -f oms-daemonset.yaml
```

To see that the DaemonSet is created, run:

```azurecli-interactive
kubectl get daemonset
```

Output is similar to the following:

```
NAME       DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE-SELECTOR                 AGE
omsagent   3         3         3         3            3           beta.kubernetes.io/os=linux   8m
```

After the agents are running, it takes several minutes for OMS to ingest and process the data.

## Access monitoring data

In the Azure portal, select the Log Analytics workspace that has been pinned to the dashboard and click on the *Container Monitoring Solution* tile. Here you can find information about the AKS cluster and containers running on the cluster.

![Dashboard](./media/container-service-tutorial-kubernetes-monitor/oms-containers-dashboard.png)

See the [Azure Log Analytics documentation](../log-analytics/index.yml) for detailed guidance on querying and analyzing monitoring data.

## Next steps

In this tutorial, you monitored your Kubernetes cluster with OMS. Tasks covered included:

> [!div class="checklist"]
> * Configuring the container monitoring solution
> * Configuring the monitoring agents
> * Access monitoring information in the Azure portal

Advance to the next tutorial to learn about upgrading Kubernetes to a new version.

> [!div class="nextstepaction"]
> [Upgrade Kubernetes](./tutorial-kubernetes-upgrade-cluster.md)