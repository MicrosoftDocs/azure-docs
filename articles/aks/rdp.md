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

## Deploy a virtual machine to the same subnet as your cluster

The Windows Server nodes of your AKS cluster don't have externally accessible IP addresses. To make an RDP connection, you can deploy a virtual machine with a publicly accessible IP address to the same subnet as your Windows Server nodes.

The following example creates a virtual machine named *myVM* in the *myResourceGroup* resource group.

First, get the subnet used by your Windows Server node pool. To get the subnet id, you need the name of the subnet. To get the name of the subnet, you need the name of the vnet. Get the vnet name by querying your cluster for its list of networks. To query the cluster, you need its name. You can get all of these by running the following in the Azure Cloud Shell:

```azurecli-interactive
CLUSTER_RG=$(az aks show -g myResourceGroup -n myAKSCluster --query nodeResourceGroup -o tsv)
VNET_NAME=$(az network vnet list -g $CLUSTER_RG --query [0].name -o tsv)
SUBNET_NAME=$(az network vnet subnet list -g $CLUSTER_RG --vnet-name $VNET_NAME --query [0].name -o tsv)
SUBNET_ID=$(az network vnet subnet show -g $CLUSTER_RG --vnet-name $VNET_NAME --name $SUBNET_NAME --query id -o tsv)
```

Now that you have the SUBNET_ID, run the following command in the same Azure Cloud Shell window to create the VM:

```azurecli-interactive
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image win2019datacenter \
    --admin-username azureuser \
    --admin-password myP@ssw0rd12 \
    --subnet $SUBNET_ID \
    --query publicIpAddress -o tsv
```

The following example output shows the VM has been successfully created and displays the public IP address of the virtual machine.

```console
13.62.204.18
```

Record the public IP address of the virtual machine. You will use this address in a later step.

## Allow access to the virtual machine

AKS node pool subnets are protected with NSGs (Network Security Groups) by default. To get access to the virtual machine, you'll have to enabled access in the NSG.

> [!NOTE]
> The NSGs are controlled by the AKS service. Any change you make to the NSG will be overwritten at any time by the control plane.
>

First, get the resource group and nsg name of the nsg to add the rule to:

```azurecli-interactive
CLUSTER_RG=$(az aks show -g myResourceGroup -n myAKSCluster --query nodeResourceGroup -o tsv)
NSG_NAME=$(az network nsg list -g $CLUSTER_RG --query [].name -o tsv)
```

Then, create the NSG rule:

```azurecli-interactive
az network nsg rule create --name tempRDPAccess --resource-group $CLUSTER_RG --nsg-name $NSG_NAME --priority 100 --destination-port-range 3389 --protocol Tcp --description "Temporary RDP access to Windows nodes"
```

## Get the node address

To manage a Kubernetes cluster, you use [kubectl][kubectl], the Kubernetes command-line client. If you use Azure Cloud Shell, `kubectl` is already installed. To install `kubectl` locally, use the [az aks install-cli][az-aks-install-cli] command:
    
```azurecli-interactive
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

List the internal IP address of the Windows Server nodes using the [kubectl get][kubectl-get] command:

```console
kubectl get nodes -o wide
```

The follow example output shows the internal IP addresses of all the nodes in the cluster, including the Windows Server nodes.

```console
$ kubectl get nodes -o wide
NAME                                STATUS   ROLES   AGE   VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION      CONTAINER-RUNTIME
aks-nodepool1-42485177-vmss000000   Ready    agent   18h   v1.12.7   10.240.0.4    <none>        Ubuntu 16.04.6 LTS          4.15.0-1040-azure   docker://3.0.4
aksnpwin000000                      Ready    agent   13h   v1.12.7   10.240.0.67   <none>        Windows Server Datacenter   10.0.17763.437
```

Record the internal IP address of the Windows Server node you wish to troubleshoot. You will use this address in a later step.

## Connect to the virtual machine and node

Connect to the public IP address of the virtual machine you created earlier using an RDP client such as [Microsoft Remote Desktop][rdp-mac].

![Image of connecting to the virtual machine using an RDP client](media/rdp/vm-rdp.png)

After you've connected to your virtual machine, connect to the *internal IP address* of the Windows Server node you want to troubleshoot using an RDP client from within your virtual machine.

![Image of connecting to the Windows Server node using an RDP client](media/rdp/node-rdp.png)

You are now connected to your Windows Server node.

![Image of cmd window in the Windows Server node](media/rdp/node-session.png)

You can now run any troubleshooting commands in the *cmd* window. Since Windows Server nodes use Windows Server Core, there's not a full GUI or other GUI tools when you connect to a Windows Server node over RDP.

## Remove RDP access

When done, exit the RDP connection to the Windows Server node then exit the RDP session to the virtual machine. After you exit both RDP sessions, delete the virtual machine with the [az vm delete][az-vm-delete] command:

```azurecli-interactive
az vm delete --resource-group myResourceGroup --name myVM
```

And the NSG rule:

```azurecli-interactive
CLUSTER_RG=$(az aks show -g myResourceGroup -n myAKSCluster --query nodeResourceGroup -o tsv)
NSG_NAME=$(az network nsg list -g $CLUSTER_RG --query [].name -o tsv)
```

```azurecli-interactive
az network nsg rule delete --resource-group $CLUSTER_RG --nsg-name $NSG_NAME --name tempRDPAccess
```

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