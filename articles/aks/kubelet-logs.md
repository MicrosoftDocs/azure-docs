---
title: Get kubelet logs from Azure Kubernetes Service (AKS)
description: Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 03/08/2018
ms.author: nepeters
ms.custom: mvc
---

# Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes

Occasionally, you may need to get kubelet logs from an Azure Kubernetes Service (AKS) node for troubleshooting purposes. This document details one option for pulling these logs.

## Create an SSH connection

First, create an SSH connection with the node on which you need to pull kubelet logs. This operation is detailed in the [SSH into Azure Kubernetes Service (AKS) cluster nodes][aks-ssh] document.

## Get kubelet logs

Once you have connected to the node, run the following command to pull the kubelet logs.

```azurecli-interactive
docker logs $(docker ps -a | grep "hyperkube kubele" | awk -F ' ' '{print $1}')
```

Sample Output:

```console
2018-03-05 00:04:00.883195 I | proto: duplicate proto type registered: google.protobuf.Any
2018-03-05 00:04:00.883242 I | proto: duplicate proto type registered: google.protobuf.Duration
2018-03-05 00:04:00.883253 I | proto: duplicate proto type registered: google.protobuf.Timestamp
Flag --non-masquerade-cidr has been deprecated, will be removed in a future version
Flag --non-masquerade-cidr has been deprecated, will be removed in a future version
I0305 00:04:00.978560    8021 feature_gate.go:144] feature gates: map[Accelerators:true]
I0305 00:04:00.978996    8021 azure.go:174] azure: using client_id+client_secret to retrieve access token
I0305 00:04:00.979041    8021 server.go:439] Successfully initialized cloud provider: "azure" from the config file: "/etc/kubernetes/azure.json"
I0305 00:04:00.979058    8021 server.go:740] cloud provider determined current node name to be aks-nodepool1-42032720-0
```

<!-- LINKS - internal -->
[aks-ssh]: aks-ssh.md