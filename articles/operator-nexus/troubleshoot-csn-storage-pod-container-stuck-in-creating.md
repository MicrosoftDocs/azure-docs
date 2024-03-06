---
title: Troubleshoot CSN storage pod container stuck in creating
description: Learn what to do when you get CSN storage pod container remains in creating state.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 12/21/2023
ms.author: soumyamaitra
author: neilverse
---

# CSN storage pod container stuck in `ContainerCreating`

This document details user experience of a rare issue that may render CSN storage pods in `ContainerCreating` state. It also provides a workaround to resolve the issue.

## Cause

A runtime-upgrade replaces the operating system of the Baremetal nodes, which recreates the IQN (iSCSI Qualified Name)
and can cause iscsi login failure in rare occasions.
The iscsi failure occurs on particular nodes where portals login isn't successful. This guide provides a solution for this particular issue.

The guide briefly lays down the process to delete Volumeattachment and restart the pod to resolve the issue.


## Process

Check to see why the pod remains in `ContainerCreating` state:

```Warning  FailedMapVolume  52s (x19 over 23m)  kubelet  MapVolume.SetUpDevice failed for volume "pvc-b38dcc54-5e57-435a-88a0-f91eac594e18" : rpc error: code = Internal desc = required at least 2 portals but found 0 portals```

Here we focus only on `baremetal_machine` where the issue has occurred.

Execute the following run command to solve the issue of pod stuck in containerCreating
```azurecli
az networkcloud baremetalmachine run-command --bare-metal-machine-name <control-plane-baremetal-machine> \
--subscription <subscription> \
--resource-group <cluster-managed-resource-group> \
--limit-time-seconds 60 \
--script "cG9kcz0kKGt1YmVjdGwgZ2V0IHBvZHMgLW4gbmMtc3lzdGVtIHxncmVwIC1pIGNvbnRhaW5lcmNyZWF0aW5nIHwgYXdrICd7cHJpbnQgJDF9JykKCmZvciBwb2RuYW1lIGluICRwb2RzOyBkbwogICAga3ViZWN0bCBkZXNjcmliZSBwbyAkcG9kbmFtZSAtbiBuYy1zeXN0ZW0KCiAgICBwdmNuYW1lPSQoa3ViZWN0bCBnZXQgcG8gJHBvZG5hbWUgLW4gbmMtc3lzdGVtIC1vIGpzb24gfCBqcSAtciAnLnNwZWMudm9sdW1lc1swXS5wZXJzaXN0ZW50Vm9sdW1lQ2xhaW0uY2xhaW1OYW1lJykKCiAgICBwdm5hbWU9JChrdWJlY3RsIGdldCBwdmMgJHB2Y25hbWUgLW4gbmMtc3lzdGVtIC1vIGpzb24gfCBqcSAtciAnLnNwZWMudm9sdW1lTmFtZScpCgogICAgbm9kZW5hbWU9JChrdWJlY3RsIGdldCBwbyAkcG9kbmFtZSAtbiBuYy1zeXN0ZW0gLW9qc29uIHwganEgLXIgJy5zcGVjLm5vZGVOYW1lJykKCiAgICB2b2xhdHRhY2hOYW1lPSQoa3ViZWN0bCBnZXQgdm9sdW1lYXR0YWNobWVudCB8IGdyZXAgLWkgJHB2bmFtZSB8IGF3ayAne3ByaW50ICQxfScpCgogICAga3ViZWN0bCBkZWxldGUgdm9sdW1lYXR0YWNobWVudCAkdm9sYXR0YWNoTmFtZQoKICAgIGt1YmVjdGwgY29yZG9uICRub2RlbmFtZSAtbiBuYy1zeXN0ZW07a3ViZWN0bCBkZWxldGUgcG8gLW4gbmMtc3lzdGVtICRwb2RuYW1lCmRvbmU="
```

The run command executes the following script.

``` console
pods=$(kubectl get pods -n nc-system |grep -i containercreating | awk '{print $1}')

for podname in $pods; do
    kubectl describe po $podname -n nc-system

    pvcname=$(kubectl get po $podname -n nc-system -o json | jq -r '.spec.volumes[0].persistentVolumeClaim.claimName')

    pvname=$(kubectl get pvc $pvcname -n nc-system -o json | jq -r '.spec.volumeName')

    nodename=$(kubectl get po $podname -n nc-system -ojson | jq -r '.spec.nodeName')

    volattachName=$(kubectl get volumeattachment | grep -i $pvname | awk '{print $1}')

    kubectl delete volumeattachment $volattachName

    kubectl cordon $nodename -n nc-system;kubectl delete po -n nc-system $podname
done
```
The command retrieves the pvc from the pod and then deletes the `volumeattachment` object. It then deletes the pod. The pod  later gets recreated on another node along with a successful volume attachment object.