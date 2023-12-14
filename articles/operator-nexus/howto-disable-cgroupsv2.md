---
title: "Azure Operator Nexus: Disable cgroupsv2 on a Nexus Kubernetes Node"
description: How-to guide for disabling support for cgroupsv2 on a Nexus Kubernetes Node
author: jaypipes
ms.author: jaypipes
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 09/18/2023
ms.custom: template-how-to
---

# Disable `cgroupsv2` on Nexus Kubernetes Node

[Control groups][cgroups], or "`cgroups`" allow the Linux operating system to
allocate resources--CPU shares, memory, I/O, etc.--to a hierarchy of operating
system processes. These resources can be isolated from other processes and in
this way enable containerization of workloads.

An enhanced version 2 of control groups ("[cgroupsv2][cgroups2]") was included
in Linux kernel 4.5. The primary difference between the original `cgroups` v1
and the newer `cgroups` v2 is that only a single hierarchy of `cgroups` is
allowed in the `cgroups` v2. In addition to this single-hierarchy difference,
`cgroups` v2 makes some backwards-incompatible changes to the pseudo-filesystem
that `cgroups` v1 used, for example removing the `tasks` pseudofile and the
`clone_children` functionality.

Some applications may rely on older `cgroups` v1 behavior, however, and this
documentation explains how to disable `cgroups` v2 on newer Linux operating
system images used for Operator Nexus Kubernetes worker nodes.

[cgroups]: https://en.wikipedia.org/wiki/Cgroups
[cgroups2]: https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html

## Nexus Kubernetes 1.27 and beyond

While Kubernetes 1.25 [added support][k8s-cgroupsv2] for `cgroups` v2 within
the kubelet, in order for `cgroups` v2 to be used it must be enabled in the
Linux kernel.

Operator Nexus Kubernetes worker nodes run special versions of Microsoft Azure
Linux (previously called CBL Mariner OS) that correspond to the Kubernetes
version enabled by that image. The Linux OS image for worker nodes *enables*
`cgroups` v2 by default in Nexus Kubernetes version 1.27.

`cgroups` v2 *isn't enabled* in versions of Nexus Kubernetes *before* 1.27.
Therefore you don't need to perform the steps in this guide to disable
`cgroups` v2.

[k8s-cgroupsv2]: https://kubernetes.io/blog/2022/08/31/cgroupv2-ga-1-25/

## Prerequisites

Before proceeding with this how-to guide, it's recommended that you:

   * Refer to the Nexus Kubernetes cluster [QuickStart guide][qs] for a
     comprehensive overview and steps involved.
   * Ensure that you meet the outlined prerequisites to ensure smooth
     implementation of the guide.

[qs]: ./quickstarts-kubernetes-cluster-deployment-bicep.md

## Apply cgroupv2-disabling `Daemonset`

> [!WARNING]
> If you perform this step on a Kubernetes cluster that already has workloads
> running on it, any workloads that are running on Kubernetes cluster nodes
> will be terminated because the `Daemonset` reboots the host machine.
> Therefore it is highly recommmended that you apply this `Daemonset` on a new
> Nexus Kubernetes cluster before workloads are scheduled on it.

Copy the following `Daemonset` definition to a file on a computer where you can
execute `kubectl` commands against the Nexus Kubernetes cluster on which you
wish to disable `cgroups` v2.

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: revert-cgroups
  namespace: kube-system
spec:
  selector:
    matchLabels:
      name: revert-cgroups
  template:
    metadata:
      labels:
        name: revert-cgroups
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: cgroup-version
                    operator: NotIn
                    values:
                      - v1
      tolerations:
        - operator: Exists
          effect: NoSchedule
      containers:
        - name: revert-cgroups
          image: mcr.microsoft.com/cbl-mariner/base/core:1.0
          command:
            - nsenter
            - --target
            - "1"
            - --mount
            - --uts
            - --ipc
            - --net
            - --pid
            - --
            - bash
            - -exc
            - |
              CGROUP_VERSION=`stat -fc %T /sys/fs/cgroup/`
              if [ "$CGROUP_VERSION" == "cgroup2fs" ]; then
                echo "Using v2, reverting..."
                sed -i 's/systemd.unified_cgroup_hierarchy=1 cgroup_no_v1=all/systemd.unified_cgroup_hierarchy=0/' /boot/grub2/grub.cfg
                reboot
              fi

              sleep infinity
          securityContext:
            privileged: true
      hostNetwork: true
      hostPID: true
      hostIPC: true
      terminationGracePeriodSeconds: 0
```

And apply the `Daemonset`:

```bash
kubectl apply -f /path/to/daemonset.yaml
```

The above `Daemonset` applies to all Kubernetes worker nodes in the cluster
except ones where a `cgroup-version=v1` label has been applied. For those
worker nodes with `cgroups` v2 enabled, the `Daemonset` modifies the boot
configuration of the Linux kernel and reboots the machine.

You can monitor the rollout of the `Daemonset` and its effects by executing the
following script:

```bash
#!/bin/bash

set -x

# Set the DaemonSet name and label key-value pair
DAEMONSET_NAME="revert-cgroups"
NAMESPACE="kube-system"
LABEL_KEY="cgroup-version"
LABEL_VALUE="v1"
LOG_PATTERN="sleep infinity"

# Function to check if all pods are completed
check_pods_completed() {
        local pods_completed=0

        # Get the list of DaemonSet pods
        pod_list=$(kubectl get pods -n "${NAMESPACE}" -l name="${DAEMONSET_NAME}" -o jsonpath='{range.items[*]}{.metadata.name}{"\n"}{end}')

        # Loop through each pod
        for pod in $pod_list; do

                # Get the logs from the pod
                logs=$(kubectl logs -n "${NAMESPACE}" "${pod}")

                # Check if the logs end with the specified pattern
                if [[ $logs == *"${LOG_PATTERN}"* ]]; then
                        ((pods_completed++))
                fi

        done

        # Return the number of completed pods
        echo $pods_completed
}

# Loop until all pods are completed
while true; do
        pods_completed=$(check_pods_completed)

        # Get the total number of pods
        total_pods=$(kubectl get pods -n "${NAMESPACE}" -l name=${DAEMONSET_NAME} --no-headers | wc -l)

        if [ "$pods_completed" -eq "$total_pods" ]; then
                echo "All pods are completed."
                break
        else
                echo "Waiting for pods to complete ($pods_completed/$total_pods)..."
                sleep 10
        fi
done

# Once all pods are completed, add the label to the nodes
node_list=$(kubectl get pods -n "${NAMESPACE}" -l name=${DAEMONSET_NAME} -o jsonpath='{range.items[*]}{.spec.nodeName}{"\n"}{end}' | sort -u)

for node in $node_list; do
        kubectl label nodes "${node}" ${LABEL_KEY}=${LABEL_VALUE}
        echo "Added label '${LABEL_KEY}:${LABEL_VALUE}' to node '${node}'."
done

echo "Script completed."
```

The above script labels the nodes that have had `cgroups` v2 disabled. This
labeling removes the `Daemonset` from nodes that have already been rebooted
with the `cgroups` v1 kernel settings.
