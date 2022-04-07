---
title: Host Process Containers
description: Learn how to use Host Process & Privilieged Containers for Windows workloads on AKS
services: container-service
ms.topic: article
ms.date: 4/6/2022
ms.author: juda

---

# Host Process Containers

Host Process / Privileged containers extend the Windows container model to enable a wider range of Kubernetes cluster management scenarios. 

Host Process containers run directly on the host and maintain behavior and access similar to that of a regular process. 

With Host Process containers, users can package and distribute management operations and functionalities that require host access while retaining versioning and deployment methods provided by containers. 

> [!Note]
> Host Process containers require Kubernetes 1.23+ and Containerd as the container runtime

## Why use Host Process containers

Whilst on Linux systems it is possible to use a priviledged DaemonSet to carry out changes or monitor the host, this has not been possible on Windows Kubernetes environments.  Host Process containers are the Windows equivilant of host elavation.


## Limitations
* Host Process containers require containerd 1.6 or higher container runtime.
* Host Process pods can only contain Host Process containers. This is a current limitation of the Windows OS; non-privileged Windows containers cannot share a vNIC with the host IP namespace.
* Host Process containers run as a process on the host and do not have any degree of isolation other than resource constraints imposed on the Host Process user account. 
* Neither filesystem or Hyper-V isolation are supported for Host Process containers.
* Volume mounts are supported and are mounted under the container volume. See Volume Mounts
* A limited set of host user accounts are available for Host Process containers by default. See Choosing a User Account.
* Resource limits (disk, memory, cpu count) are supported in the same fashion as processes on the host.
* Both Named pipe mounts and Unix domain sockets are not supported and should instead be accessed via their path on the host (e.g. \\.\pipe\*)


## Run a Host Process workload

To use Host Process features you will need to specify the securityContext spec to enable privileged, hostProcess and hostNetwork.  The following workload runs a Powershell script to check the access the Pod has to the host.

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
            privileged: true
            windowsOptions:
              hostProcess: true
              runAsUserName: "NT AUTHORITY\\SYSTEM"
          command:
            - pwsh.exe
            - -command
            - |
              $AdminRights = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]"Administrator")
              Write-Host "Process has admin rights: $AdminRights"
              while ($true) { Start-Sleep -Seconds 2147483 }
      hostNetwork: true
      terminationGracePeriodSeconds: 0

```

## Next steps

- For more information on Host Process containers and Microsoft's contribution to Kubernetes upstream, read the [blog post][blog-post].


<!-- LINKS - External -->
[blog-post]: https://kubernetes.io/blog/2021/08/16/windows-hostprocess-containers/
