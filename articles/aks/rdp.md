---
title: RDP to AKS Windows Server nodes
titleSuffix: Azure Kubernetes Service
description: Learn how to create an RDP connection with Azure Kubernetes Service (AKS) cluster Windows Server nodes for troubleshooting and maintenance tasks.
services: container-service
ms.topic: article
ms.date: 06/04/2019


#Customer intent: As a cluster operator, I want to learn how to use RDP to connect to nodes in an AKS cluster to perform maintenance or troubleshoot a problem.
---

# Connect with RDP to Azure Kubernetes Service (AKS) cluster Windows Server nodes for maintenance or troubleshooting

Throughout the lifecycle of your Azure Kubernetes Service (AKS) cluster, you may need to access an AKS Windows Server node. This access could be for maintenance, log collection, or other troubleshooting operations. You can access the AKS Windows Server nodes using RDP. Alternatively, if you want to use SSH to access the AKS Windows Server nodes and you have access to the same keypair that was used during cluster creation, you can follow the steps in [SSH into Azure Kubernetes Service (AKS) cluster nodes][ssh-steps]. For security purposes, the AKS nodes are not exposed to the internet.

This article shows you how to create an RDP connection with an AKS node using their private IP addresses.

## Before you begin

This article assumes that you have an existing AKS cluster with a Windows Server node. If you need an AKS cluster, see the article on [creating an AKS cluster with a Windows container using the Azure CLI][aks-windows-cli]. You need the Windows administrator username and password for the Windows Server node you want to troubleshoot. If you don't know them, you can reset them by following [Reset Remote Desktop Services or its administrator password in a Windows VM
](/troubleshoot/azure/virtual-machines/reset-rdp). You also need an RDP client such as [Microsoft Remote Desktop][rdp-mac].

You also need the Azure CLI version 2.0.61 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Establish a jump server to your AKS cluster

The Windows Server nodes of your AKS cluster don't have externally accessible IP addresses. To make an RDP connection, you can deploy an SSH container on a Linux node to establish a jump server to enble RDP.

The following example creates a virtual machine named *myVM* in the *myResourceGroup* resource group.

First, follow the steps to [establish an SSH connection to a Linux Node][ssh-linux-kubectl-debug]. Once you have the pod running you are ready to set up the connection to the Windows nodes.

Open a new terminal window and use `kubectl get pods` to get the name of the Linux pod started by `kubectl debug`.
```output
$ kubectl get pods
NAME                                                    READY   STATUS    RESTARTS   AGE
node-debugger-aks-nodepool1-12345678-vmss000000-bkmmx   1/1     Running   0          21s
```

Using portforwarding you can open a connnection to the pod deployed above:

```
kubectl port-forward node-debugger-aks-nodepool1-12345678-vmss000000-bkmmx 2022:22
Forwarding from 127.0.0.1:2022 -> 22
Forwarding from [::1]:2022 -> 22
```

Open a third terminal window and use `kubectl get nodes` to show the internal IP address of the Windows Server node:

```output
$ kubectl get nodes -o wide
NAME                                STATUS   ROLES   AGE     VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION     CONTAINER-RUNTIME
aks-nodepool1-12345678-vmss000000   Ready    agent   13m     v1.19.9   10.240.0.4    <none>        Ubuntu 18.04.5 LTS               5.4.0-1046-azure   containerd://1.4.4+azure
aks-nodepool1-12345678-vmss000001   Ready    agent   13m     v1.19.9   10.240.0.35   <none>        Ubuntu 18.04.5 LTS               5.4.0-1046-azure   containerd://1.4.4+azure
aksnpwin000000                      Ready    agent   87s     v1.19.9   10.240.0.67   <none>        Windows Server 2019 Datacenter   10.0.17763.1935    docker://19.3.1
```

In the above example, *10.240.0.67* is the internal IP address of the Windows Server node.

Use ssh to forward the RDP port of the Windows machine to your local network (you may need to change the first local port 3389 if it is being used on your computer):

```
ssh -p 2022 -L 3389:10.240.0.67:3389 -A azureuser@127.0.0.1
```

## Connect to Windows node

Now that you have the RDP port forwarded, connect to the Windows Server node you want to troubleshoot using an RDP client from with your localaddress:

[should update this image to be to 127.0.0.1 from a mac connection to be consistent]
![Image of connecting to the Windows Server node using an RDP client](media/rdp/node-rdp.png)

You are now connected to your Windows Server node.

![Image of cmd window in the Windows Server node](media/rdp/node-session.png)

You can now run any troubleshooting commands in the *cmd* window. Since Windows Server nodes use Windows Server Core, there's not a full GUI or other GUI tools when you connect to a Windows Server node over RDP. You can open tools like notepad.exe by typing `start notepad.exe` into the cmd prompt.

## Remove RDP access

When done, exit the RDP connection to the Windows Server node then close the portforwarding terminal and exit the Linux ssh container.  The Linux pod will be deleted from the cluster when you exit.

## Next steps

If you need additional troubleshooting data, you can [view the Kubernetes master node logs][view-master-logs] or [Azure Monitor][azure-monitor-containers].

<!-- EXTERNAL LINKS -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[rdp-mac]: https://aka.ms/rdmac

<!-- INTERNAL LINKS -->
[aks-windows-cli]: windows-container-cli.md
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-vm-delete]: /cli/azure/vm#az_vm_delete
[azure-monitor-containers]: ../azure-monitor/containers/container-insights-overview.md
[install-azure-cli]: /cli/azure/install-azure-cli
[ssh-steps]: ssh.md
[view-master-logs]: view-master-logs.md
