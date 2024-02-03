---
title: "Azure Operator Nexus: Customize Kubernetes worker nodes with a DaemonSet"
description: How-to guide for customizing Kubernetes Worker Nodes with a DaemonSet.
author: joknight
ms.author: joknight
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/29/2024
ms.custom: template-how-to
---

# Customize worker nodes with a DaemonSet

To meet application requirements, you may need to modify operating system settings, enable a Linux kernel module or install a host-level application package. Use a `DaemonSet` with host privileges to customize worker nodes.

The example `DaemonSet` sets `registry.contoso.com` to bypass the Cloud Services Network proxy for image pulls, installs the SCTP kernel module and sets `fs.inotify.max_user_instances` to `4096`. Finally, the script applies a label to the Kubernetes Node to ensure the DaemonSet only runs once.


```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: customized
  namespace: kube-system
spec:
  selector:
    matchLabels:
      name: customized
  template:
    metadata:
      labels:
        name: customized
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: customized
                    operator: NotIn
                    values:
                      - "1"
      tolerations:
        - operator: Exists
          effect: NoSchedule
      containers:
        - name: customized
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
              sed -i '/registrycontoso.com/!s/NO_PROXY=/&registry.contoso.com,/' /etc/systemd/system/containerd.service.d/http-proxy.conf
              systemctl daemon-reload
              systemctl restart containerd
              modprobe sctp
              sed -i 's/^fs.inotify.max_user_instances.*/fs.inotify.max_user_instances     = 4096/' /etc/sysctl.d/90-system-max-limits.conf
              kubectl --kubeconfig=/etc/kubernetes/kubelet.conf label node ${HOSTNAME,,} customized=1
              sleep infinity
          resources:
            limits:
              memory: 200Mi
            requests:
              cpu: 100m
              memory: 16Mi
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
