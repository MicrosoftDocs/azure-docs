---
title: Monitoring Kubernetes in Azure Container Service using Operations Management Suite (OMS) | Microsoft Docs
description: Monitoring Kubernetes in Azure Container Service using Operations Management Suite (OMS)
services: container-service
documentationcenter: ''
author: bburns
manager: timlt
editor: ''
tags: acs, azure-container-service, kubernetes
keywords: ''

ms.assetid: what-goes-here?
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/09/2016
ms.author: bburns

---

# Monitor an Azure Container Service cluster with Microsoft Operations Management Suite (OMS)

## Prerequisites
This walkthrough assumes that you have [created a Kubernetes cluster using Azure Container Service](container-service-kubernetes-walkthrough.md).

It also assumes that you have the `az` Azure cli and `kubectl` tools installed.

You can test if you have the `az` tool installed by running:

```console
$ az --version
```

If you don't have the `az` tool installed, there are instructions [here](https://github.com/azure/azure-cli#installation).

You can test if you have the `kubectl` tool installed by running:

```console
$ kubectl version
```

If you don't have `kubectl` installed, you can run:

```console
$ az acs kubernetes install-cli
```

## Monitoring Containers with Operations Management Suite (OMS)

Microsoft Operations Management (OMS) is Microsoft's cloud-based IT
management solution that helps you manage and protect your on-premises
and cloud infrastructure. Container Solution is a solution in OMS Log
Analytics, which helps you view the container inventory, performance,
and logs in a single location. You can audit, troubleshoot containers by
viewing the logs in centralized location, and find noisy consuming
excess container on a host.

![](media/container-service-monitoring-oms/image1.png)

For more information about Container Solution, please refer to the
[Container Solution Log
Analytics](../log-analytics/log-analytics-containers.md).

## Installing OMS on Kubernetes

### Obtain your workspace ID and key
For the OMS agent to talk to the service it needs to be configured with a workspace id and
a workspace key. To get the workspace id and key you need to create an OMS account at <https://mms.microsoft.com>.
Please follow the steps to create an account. Once you are done creating
the account, you need to obtain your id and key by clicking 
**Settings**, then **Connected Sources**, and then **Linux Servers**, as shown below.

 ![](media/container-service-monitoring-oms/image5.png)

### Install the OMS agent using a DaemonSet
DaemonSets are used by Kubernetes to run a single instance of a container on each host in the cluster.
They're perfect for running monitoring agents.

Here is the DaemonSet YAML file, save it to a file named `oms-daemonset.yaml` and 
replace the place-holder values for `WSID` and `KEY` below with your workspace id and key in the file.

```yaml
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  name: omsagent
spec:
  template:
    metadata:
      labels:
        app: omsagent
    spec:
      containers:
      - env:
        - name: WSID
          value: <your workspace ID>
        - name: KEY
          value: <your key>
        image: microsoft/oms
        name: omsagent
        ports:
        - containerPort: 25225
          protocol: TCP
        securityContext:
          privileged: true
        volumeMounts:
        - mountPath: /var/run/docker.sock
          name: docker-sock
      volumes:
      - name: docker-sock
        hostPath:
          path: /var/run/docker.sock
```

Once you have added your workspace ID and key to the DaemonSet configuration, you can install the OMS agent
on your cluster with the `kubectl` command line tool:

```console
$ kubectl create -f oms-daemonset.yaml
```

### Conclusion
That's it! After a few minutes, you should be able to see data flowing to your OMS dashboard.