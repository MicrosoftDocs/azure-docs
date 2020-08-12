---
title: Uninstall Azure Arc data controller
description: Uninstall Azure Arc data controller
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Uninstall Azure Arc data controller

## Kickstarter scenario

If you ran the Ubuntu VM setup-controller.sh script, you can uninstall it by running the cleanup-controller.sh script.

### Step 01:  Download the script

``` bash
curl --output cleanup-controller.sh https://raw.githubusercontent.com/microsoft/sql-server-samples/master/samples/features/azure-arc/deployment/kubeadm/ubuntu-single-node-vm/cleanup-controller.sh
```

### Step 02: Make the script executable

``` bash
chmod +x cleanup-controller.sh
```

### Step 03: Run the script

``` bash
./cleanup-controller.sh
```

## Deployed data controller on kubernetes cluster scenario

If you deployed the Azure Arc data controller on your existing Kubernetes cluster, you can uninstall it and its associated namespaces by running the following commands:

### Step 01: Delete the Azure Arc data controller components

```console
azdata postgres uninstall
azdata arc dc delete -ns <namespaceSpecifiedDuringCreation> -n <nameofDataController>
# for example azdata arc dc delete -ns arc -n arc
```

### Step 02: Optionally, delete the Azure Arc data controller namespace

```console
kubectl delete ns <nameSpecifiedDuringCreation>
# for example kubectl delete ns arc
```

### Remove SCCs (Red Hat OpenShift only)

```console
oc adm policy remove-scc-from-user privileged -z default -n arc
oc adm policy remove-scc-from-user anyuid     -z default -n arc
```
