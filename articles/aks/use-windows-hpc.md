---
title: Use Windows HostProcess containers
description: Learn how to use HostProcess & Privileged containers for Windows workloads on AKS
ms.topic: article
ms.date: 05/09/2023
ms.author: juda

---

# Use Windows HostProcess containers

HostProcess / Privileged containers extend the Windows container model to enable a wider range of Kubernetes cluster management scenarios. HostProcess containers run directly on the host and maintain behavior and access similar to that of a regular process. HostProcess containers allow users to package and distribute management operations and functionalities that require host access while retaining versioning and deployment methods provided by containers.

A privileged DaemonSet can carry out changes or monitor a Linux host on Kubernetes but not Windows hosts. HostProcess containers are the Windows equivalent of host elevation.

## Limitations

* HostProcess containers require Kubernetes 1.23 or greater.
* HostProcess containers require `containerd` 1.6 or higher container runtime.
* HostProcess pods can only contain HostProcess containers due to a limitation on the Windows operating system. Non-privileged Windows containers can't share a vNIC with the host IP namespace.
* HostProcess containers run as a process on the host. The only isolation those containers have from the host is the resource constraints imposed on the HostProcess user account.
* Filesystem isolation and Hyper-V isolation aren't supported for HostProcess containers.
* Volume mounts are supported and are mounted under the container volume. See Volume Mounts.
* A limited set of host user accounts are available for Host Process containers by default. See Choosing a User Account.
* Resource limits such as disk, memory, and cpu count, work the same way as fashion as processes on the host.
* Named pipe mounts and Unix domain sockets aren't directly supported, but can be accessed on their host path, for example `\\.\pipe\*`.

## Run a HostProcess workload

To use HostProcess features with your deployment, set *hostProcess: true* and *hostNetwork: true*:  

```yaml
    spec:
      ...
      containers:
          ...
          securityContext:
            windowsOptions:
              hostProcess: true
              ...
      hostNetwork: true
      ...
```

To run an example workload that uses HostProcess features on an existing AKS cluster with Windows nodes, create `hostprocess.yaml` with the following contents:

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: privileged-daemonset
  namespace: kube-system
  labels:
    app: privileged-daemonset
spec:
  selector:
    matchLabels:
      app: privileged-daemonset
  template:
    metadata:
      labels:
        app: privileged-daemonset
    spec:
      nodeSelector:
        kubernetes.io/os: windows
      containers:
        - name: powershell
          image: mcr.microsoft.com/powershell:lts-nanoserver-1809
          securityContext:
            windowsOptions:
              hostProcess: true
              runAsUserName: "NT AUTHORITY\\SYSTEM"
          command:
            - C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
            - -command
            - |
              $AdminRights = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]"Administrator")
              Write-Host "Process has admin rights: $AdminRights"
              while ($true) { Start-Sleep -Seconds 2147483 }
      hostNetwork: true
      terminationGracePeriodSeconds: 0
```

Use `kubectl` to run the example workload:

```azurecli-interactive
kubectl apply -f hostprocess.yaml
```

You should see the following output:

```output
$ kubectl apply -f hostprocess.yaml
daemonset.apps/privileged-daemonset created
```

Verify that your workload uses the features of HostProcess containers by viewing the pod's logs.

Use `kubectl` to find the name of the pod in the `kube-system` namespace.

```output
$ kubectl get pods --namespace kube-system

NAME                                  READY   STATUS    RESTARTS   AGE
...
privileged-daemonset-12345            1/1     Running   0          2m13s
```

Use `kubectl log` to view the logs of the pod and verify the pod has administrator rights:

```output
$ kubectl logs privileged-daemonset-12345 --namespace kube-system
InvalidOperation: Unable to find type [Security.Principal.WindowsPrincipal].
Process has admin rights:
```

## Next steps

For more information on HostProcess containers and Microsoft's contribution to Kubernetes upstream, see the [Alpha in v1.22: Windows HostProcess Containers][blog-post].

<!-- LINKS - External -->
[blog-post]: https://kubernetes.io/blog/2021/08/16/windows-hostprocess-containers/
