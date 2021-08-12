---
title: SSH into Azure Kubernetes Service (AKS) cluster nodes
description: Learn how to create an SSH connection with Azure Kubernetes Service (AKS) cluster nodes for troubleshooting and maintenance tasks.
services: container-service
ms.topic: article
ms.date: 05/17/2021

ms.custom: contperf-fy21q4

#Customer intent: As a cluster operator, I want to learn how to use SSH to connect to virtual machines in an AKS cluster to perform maintenance or troubleshoot a problem.
---

# Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting

Throughout the lifecycle of your Azure Kubernetes Service (AKS) cluster, you may need to access an AKS node. This access could be for maintenance, log collection, or other troubleshooting operations. You can access AKS nodes using SSH, including Windows Server nodes. You can also [connect to Windows Server nodes using remote desktop protocol (RDP) connections][aks-windows-rdp]. For security purposes, the AKS nodes aren't exposed to the internet. To SSH to the AKS nodes, you use `kubectl debug` or the private IP address.

This article shows you how to create an SSH connection with an AKS node.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

This article also assumes you have an SSH key. You can create an SSH key using [macOS or Linux][ssh-nix] or [Windows][ssh-windows]. If you use PuTTY Gen to create the key pair, save the key pair in an OpenSSH format rather than the default PuTTy private key format (.ppk file).

You also need the Azure CLI version 2.0.64 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Create the SSH connection to a Linux node

To create an SSH connection to an AKS node, use `kubectl debug` to run a privileged container on your node. To list your nodes, use `kubectl get nodes`:

```output
$ kubectl get nodes -o wide

NAME                                STATUS   ROLES   AGE     VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION     CONTAINER-RUNTIME
aks-nodepool1-12345678-vmss000000   Ready    agent   13m     v1.19.9   10.240.0.4    <none>        Ubuntu 18.04.5 LTS               5.4.0-1046-azure   containerd://1.4.4+azure
aks-nodepool1-12345678-vmss000001   Ready    agent   13m     v1.19.9   10.240.0.35   <none>        Ubuntu 18.04.5 LTS               5.4.0-1046-azure   containerd://1.4.4+azure
aksnpwin000000                      Ready    agent   87s     v1.19.9   10.240.0.67   <none>        Windows Server 2019 Datacenter   10.0.17763.1935    docker://19.3.1
```

Use `kubectl debug` to run a container image on the node to connect to it.

```azurecli-interactive
kubectl debug node/aks-nodepool1-12345678-vmss000000 -it --image=mcr.microsoft.com/aks/fundamental/base-ubuntu:v0.0.11
```

This command starts a privileged container on your node and connects to it over SSH.

```output
$ kubectl debug node/aks-nodepool1-12345678-vmss000000 -it --image=mcr.microsoft.com/aks/fundamental/base-ubuntu:v0.0.11
Creating debugging pod node-debugger-aks-nodepool1-12345678-vmss000000-bkmmx with container debugger on node aks-nodepool1-12345678-vmss000000.
If you don't see a command prompt, try pressing enter.
root@aks-nodepool1-12345678-vmss000000:/#
```

This privileged container gives access to the node.

## Create the SSH connection to a Windows node

At this time, you can't connect to a Windows Server node using SSH directly by using `kubectl debug`. Instead, you need to first connect to another node in the cluster, then connect to the Windows Server node from that node using SSH. Alternatively, you can [connect to Windows Server nodes using remote desktop protocol (RDP) connections][aks-windows-rdp] instead of using SSH.

To connect to another node in the cluster, use `kubectl debug`. For more information, see [Create the SSH connection to a Linux node][ssh-linux-kubectl-debug].

To create the SSH connection to the Windows Server node from another node, use the SSH keys provided when you created the AKS cluster and the internal IP address of the Windows Server node.

Open a new terminal window and use `kubectl get pods` to get the name of the pod started by `kubectl debug`.

```output
$ kubectl get pods

NAME                                                    READY   STATUS    RESTARTS   AGE
node-debugger-aks-nodepool1-12345678-vmss000000-bkmmx   1/1     Running   0          21s
```

In the above example, *node-debugger-aks-nodepool1-12345678-vmss000000-bkmmx* is the name of the pod started by `kubectl debug`.

Copy your private SSH key into the pod created by `kubectl debug`. This private key is used to create the SSH to the Windows Server AKS node. If needed, change `~/.ssh/id_rsa` to location of your private SSH key:

```azurecli-interactive
kubectl cp ~/.ssh/id_rsa node-debugger-aks-nodepool1-12345678-vmss000000-bkmmx:/id_rsa
```

Use `kubectl get nodes` to show the internal IP address of the Windows Server node:

```output
$ kubectl get nodes -o wide

NAME                                STATUS   ROLES   AGE     VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION     CONTAINER-RUNTIME
aks-nodepool1-12345678-vmss000000   Ready    agent   13m     v1.19.9   10.240.0.4    <none>        Ubuntu 18.04.5 LTS               5.4.0-1046-azure   containerd://1.4.4+azure
aks-nodepool1-12345678-vmss000001   Ready    agent   13m     v1.19.9   10.240.0.35   <none>        Ubuntu 18.04.5 LTS               5.4.0-1046-azure   containerd://1.4.4+azure
aksnpwin000000                      Ready    agent   87s     v1.19.9   10.240.0.67   <none>        Windows Server 2019 Datacenter   10.0.17763.1935    docker://19.3.1
```

In the above example, *10.240.0.67* is the internal IP address of the Windows Server node.

Return to the terminal started by `kubectl debug` and update the permission of the private SSH key you copied to the pod.

```azurecli-interactive
chmod 0400 id_rsa
```

Create an SSH connection to the Windows Server node using the internal IP address. The default username for AKS nodes is *azureuser*. Accept the prompt to continue with the connection. You are then provided with the bash prompt of your Windows Server node:

```output
$ ssh -i id_rsa azureuser@10.240.0.67

The authenticity of host '10.240.0.67 (10.240.0.67)' can't be established.
ECDSA key fingerprint is SHA256:1234567890abcdefghijklmnopqrstuvwxyzABCDEFG.
Are you sure you want to continue connecting (yes/no)? yes

[...]

Microsoft Windows [Version 10.0.17763.1935]
(c) 2018 Microsoft Corporation. All rights reserved.

azureuser@aksnpwin000000 C:\Users\azureuser>
```

## Remove SSH access

When done, `exit` the SSH session and then `exit` the interactive container session. When this container session closes, the pod used for SSH access from the AKS cluster is deleted.

## Next steps

If you need more troubleshooting data, you can [view the kubelet logs][view-kubelet-logs] or [view the Kubernetes master node logs][view-master-logs].


<!-- INTERNAL LINKS -->
[view-kubelet-logs]: kubelet-logs.md
[view-master-logs]: monitor-aks-reference.md#resource-logs
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-windows-rdp]: rdp.md
[ssh-nix]: ../virtual-machines/linux/mac-create-ssh-keys.md
[ssh-windows]: ../virtual-machines/linux/ssh-from-windows.md
[ssh-linux-kubectl-debug]: #create-the-ssh-connection-to-a-linux-node