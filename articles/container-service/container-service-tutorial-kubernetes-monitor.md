---
title: Azure Container Service tutorial - Monitor Kubernetes | Microsoft Docs
description: Azure Container Service tutorial - Monitor Kubernetes with OMS
services: container-service
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: aurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/15/2017
ms.author: danlep
---

# Azure Container Service tutorial - Monitor Kubernetes

If you have been following along, you created a Kubernetes cluster and deployed a sample container app. Monitoring your Kubernetes container hosting solution is critical, especially when operating a producting cluster at scale with multiple apps. You can take advantage of several Kubernetes monitoring solutions, either from Microsoft or other providers. In this tutorial, you monitor your Kubernetes solution by using Operations Management Suite, Microsoft's cloud-based IT management solution. 

Tasks completed in this tutorial include:

> [!div class="checklist"]
> * 
> * 
> * 


If you haven't already done so, you can sign up for a [free trial](https://www.microsoft.com/cloud-platform/operations-management-suite-trial) of Operations Management Suite. When you have access to the [OMS portal](https://mms.microsoft.com), go to **Settings** > **Connected Sources** > **Linux Servers**. There, you can find the *Workspace ID* and a primary or secondary *Workspace Key*. Take note of these values, which you need later.

## Set up a Log Analytics workspace

https://docs.microsoft.com/azure/log-analytics/log-analytics-get-started

## Add Containers Solution to OMS

In the [OMS portal](https://mms.microsoft.com), go to **Solutions Gallery** and add **Container Solution**. For more information about the OMS Container Solution, see [Containers solution in Log Analytics](..log-analytics/log-analytics-containers.md). This is currently a preview solution.


Or from [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.ContainersOMS?tab=Overview). See [Add Log Analytics solutions from the Solutions Gallery](../log-analytics/log-analytics-add-solutions.md).

## Configure OMS on Kubernetes

Here is a basic YAML file to configure OMS on the cluster (background and alternative configurations [here](https://github.com/Microsoft/OMS-docker/blob/master/Kubernetes/k8s-README.md)). It creates a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/), which runs a single identical pod on each cluster node. A DaemonSet is ideal for deploying a monitoring agent. Save the following text to a file named `oms-daemonset.yaml`, and replace the placeholder values for *myWorkspaceID* and *myWorkspaceKey* with your OMS Workspace ID and Key. In production you would encode these values as secrets.

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
    agentVersion: 1.3.4-127
    dockerProviderVersion: 10.0.0-24
  spec:
   containers:
     - name: omsagent 
       image: "microsoft/oms"
       imagePullPolicy: Always
       env:
       - name: WSID
         value: myWorkspaceID
       - name: KEY 
         value: myWorkspaceKey
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

```bash
kubectl create -f oms-daemonset.yaml
```


##


## Next steps

In this tutorial, you monitored your Kubernetes cluster with OMS. Tasks covered included:

> [!div class="checklist"]
> * 
> * 
> * 


Advance to the next tutorial to learn about ....

> [!div class="nextstepaction"]
> XXX

[TODO: Link to the next article]