---
title: "Azure Operator Nexus: Enable node down cleaner"
description: Learn how to enable node down cleaner.
author: neilverse
ms.author: soumyamaitra
ms.service: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 12/12/2023
ms.custom: troubleshooting
---

# Enable node down cleaner

Azure Operator Nexus introduces a new feature called node down cleaner, which is disabled by default.
It helps in moving NFS server pods from a failed node to a new node when a Bare Metal Host is powers off through AZ CLI.
The following procedure enables node down cleaner and is applicable for both green field and brown field environments.

## Prerequisites

- This article assumes that you've installed the Azure command line interface & the `networkcloud` command line interface extension. For more information, see [How to Install CLI Extensions](./howto-install-cli-extensions.md).
- Logged in to Azure CLI with the correct subscription
- The target bare metal machine power state is on and has readyState set to True
- User must have the appropriate permission assigned to execute the `networkcloud baremetalmachine run-command`

## Steps to enable node down cleaner on cluster

The procedure needs to be run against management nodes. To determine which nodes are management nodes, you can run the following Azure CLI `baremetalmachine run-read-command`.

```azurecli
az networkcloud baremetalmachine run-read-command --name <any-ready-baremetal-machine> \
  --commands "[{command:'kubectl get',arguments:[nodes,-l,platform.afo-nc.microsoft.com/role=control-plane]}]" \
  --limit-time-seconds 60 \
  --resource-group <cluster-managed-resource-group> \
  --subscription <subscription>
```

Run the following command to enable node down cleaner

```azurecli
az networkcloud baremetalmachine run-command --bare-metal-machine-name <management-node-baremetal-machine> \
--subscription <subscription> \
--resource-group <cluster-managed-resource-group> \
--limit-time-seconds 60 \
--script "IyEvYmluL2Jhc2gKCmt1YmVjdGwgZ2V0IGRlcGxveW1lbnQgLW4gbmMtc3lzdGVtIG5vZGUtZG93
bi1jbGVhbmVyCgprdWJlY3RsIHNjYWxlIGRlcGxveW1lbnQgLW4gbmMtc3lzdGVtIG5vZGUtZG93
bi1jbGVhbmVyIC0tcmVwbGljYXM9MQoKa3ViZWN0bCBnZXQgZGVwbG95bWVudCAtbiBuYy1zeXN0
ZW0gbm9kZS1kb3duLWNsZWFuZXIKCmt1YmVjdGwgZ2V0IHBvZHMgLW4gbmMtc3lzdGVtIC1sIGFw
cC5rdWJlcm5ldGVzLmlvL25hbWU9bm9kZS1kb3duLWNsZWFuZXIKCg=="
```

The script executes the following kubectl commands:

```console
kubectl get deployment -n nc-system node-down-cleaner

kubectl scale deployment -n nc-system node-down-cleaner --replicas=1

kubectl get deployment -n nc-system node-down-cleaner

sleep 5s

kubectl get pods -n nc-system -l app.kubernetes.io/name=node-down-cleaner
```

On execution of the baremetalmachine run-command, node down cleaner will scale to one replica and its pod should be in running state. The output would look like:

```output
====Action Command Output====
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
node-down-cleaner   0/0     0            0           4d9h
deployment.apps/node-down-cleaner scaled
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
node-down-cleaner   0/1     1            0           4d9h
NAME                                 READY   STATUS    RESTARTS   AGE
node-down-cleaner-xxxxxxxxxxxxxx   1/1     Running   0          5s
```
