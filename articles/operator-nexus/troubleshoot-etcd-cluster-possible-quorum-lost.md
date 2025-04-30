---
title: Troubleshoot Azure Operator Nexus Cluster lost etcd quorum
description: Steps to follow when `etcd` quorum is lost for an extended period of time and the KCP didn't successfully return to a stable state.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 04/29/2024
ms.author: omarrivera
author: omarrivera
---

# Troubleshoot Azure Operator Nexus Cluster lost etcd quorum

This guide attempts to provide steps to follow when an `etcd` quorum is lost for an extended period of time and the Kubernetes Control Plane (KCP) didn't successfully return to stable state.

> [!IMPORTANT]
> At this time, there's no supported approach that can be executed through customer tools.
> Feature enhancements are ongoing for a future release to help address this scenario without contacting support.
> Open a support ticket via [contact support].

[!include[prereqAzCLI](./includes/baremetal-machines/prerequisites-azure-cli-bare-metal-machine-actions.md)]

> [!NOTE]
> The commands can be executed from the Azure portal or with the Azure CLI.

**TODO**: Add any possible steps that can be taken to help with this scenario. Perhaps there's a list of things to check. The steps above are just a starting point and should be expanded upon.

## Ensure that all control plane nodes are online

[Troubleshoot control plane quorum loss when multiple nodes are offline](./troubleshoot-control-plane-quorum.md) provides steps to follow when multiple control plane nodes are offline or unavailable.

## Check the status of the etcd pods

It's possible that the etcd pods aren't running or are in a crash loop.
Record the `etcd` pod names; other commands require `<etcd-pod-name>` to be populated with the name of one of the etcd pods.
If you have access to the control plane nodes, you can check the status of the etcd pods by running the following command:

```azurecli
az networkcloud baremetalmachine run-read-command \
  --resource-group "$CLUSTER_MRG" \
  --name "$BMM_NAME" \
  --subscription "$SUBSCRIPTION" \
  --limit-time-seconds 60 \
  --commands "[{command:'kubectl get',arguments:[pods,-n,kube-system,-l,component=etcd,-o,wide]}]"

====Action Command Output====
+ kubectl get pods -n kube-system -l component=etcd -o wide
NAME                  READY   STATUS    RESTARTS   AGE    IP           NODE             NOMINATED NODE   READINESS GATES
etcd-<bmmMachineNe>   1/1     Running   0          4d6h   10.1.6.101   rack1control01   <none>           <none>
```

## Check network connectivity between control plane nodes

If the etcd pods are running, but the KCP is still not stable, it's possible that there are network connectivity issues between the control plane nodes.

Replace `<other-control-plane-node-ip>` with the IP address of one of the other control plane nodes.
If the ping command fails, it indicates that there are network connectivity issues between the control plane nodes.

```azurecli
az networkcloud baremetalmachine run-read-command \
  --resource-group "$CLUSTER_MRG" \
  --name "$BMM_NAME" \
  --subscription "$SUBSCRIPTION" \
  --limit-time-seconds 60 \
  --commands "[{command:'ping',arguments:[<other-control-plane-node-ip>]}]"
```

## Check for storage issues

If the etcd pods are running and there are no network connectivity issues, it's possible that there are storage issues with the etcd pods.


Replace `<etcd-pod-name>` with the name of one of the etcd pods.
This command provides detailed information about the etcd pod, including any storage issues that might be present.
You can check the storage issues by running the following command:

```azurecli
```


## Check for resource issues or saturation

If the etcd pods are running and there are no network connectivity or storage issues, it's possible that there are resource issues or saturation on the control plane nodes.
If the CPU or memory usage is high, it might indicate that the control plane nodes are overscheduled and unable to process requests.

```azurecli
```


[!include[stillHavingIssues](./includes/contact-support.md)]
