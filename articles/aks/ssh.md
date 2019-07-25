---
title: SSH into Azure Kubernetes Service (AKS) cluster nodes
description: Learn how to create an SSH connection with Azure Kubernetes Service (AKS) cluster nodes for troubleshooting and maintenance tasks.
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 05/24/2019
ms.author: mlearned

#Customer intent: As a cluster operator, I want to learn how to use SSH to connect to VMs in an AKS cluster to perform maintenance or troubleshoot a problem.
---

# Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting

Throughout the lifecycle of your Azure Kubernetes Service (AKS) cluster, you may need to access an AKS node. This access could be for maintenance, log collection, or other troubleshooting operations. You can access AKS nodes using SSH, including Windows Server nodes (currently in preview in AKS). You can also [connect to Windows Server nodes using remote desktop protocol (RDP) connections][aks-windows-rdp]. For security purposes, the AKS nodes are not exposed to the internet.

This article shows you how to create an SSH connection with an AKS node using their private IP addresses.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

You also need the Azure CLI version 2.0.64 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Add your public SSH key

By default, SSH keys are obtained, or generated, then added to nodes when you create an AKS cluster. If you need to specify different SSH keys than those used when you created your AKS cluster, add your public SSH key to the Linux AKS nodes. If needed, you can create an SSH key using [macOS or Linux][ssh-nix] or [Windows][ssh-windows]. If you use PuTTY Gen to create the key pair, save the key pair in an OpenSSH format rather than the default PuTTy private key format (.ppk file).

> [!NOTE]
> SSH keys can currently only be added to Linux nodes using the Azure CLI. If you use Windows Server nodes, use the SSH keys provided when you created the AKS cluster and skip to the step on [how to get the AKS node address](#get-the-aks-node-address). Or, [connect to Windows Server nodes using remote desktop protocol (RDP) connections][aks-windows-rdp].

The steps to get the private IP address of the AKS nodes is different based on the type of AKS cluster you run:

* For most AKS clusters, follow the steps to [get the IP address for regular AKS clusters](#add-ssh-keys-to-regular-aks-clusters).
* If you use any preview features in AKS that use virtual machine scale sets, such as multiple node pools or Windows Server container support, [follow the steps for virtual machine scale set-based AKS clusters](#add-ssh-keys-to-virtual-machine-scale-set-based-aks-clusters).

### Add SSH keys to regular AKS clusters

To add your SSH key to a Linux AKS node, complete the following steps:

1. Get the resource group name for your AKS cluster resources using [az aks show][az-aks-show]. The cluster name is assigned to the variable named *CLUSTER_RESOURCE_GROUP*. Replace *myResourceGroup* with the name of your Resource Group where you AKS Cluster is located:

    ```azurecli-interactive
    CLUSTER_RESOURCE_GROUP=$(az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv)
    ```

1. List the VMs in the AKS cluster resource group using the [az vm list][az-vm-list] command. These VMs are your AKS nodes:

    ```azurecli-interactive
    az vm list --resource-group $CLUSTER_RESOURCE_GROUP -o table
    ```

    The following example output shows the AKS nodes:

    ```
    Name                      ResourceGroup                                  Location
    ------------------------  ---------------------------------------------  ----------
    aks-nodepool1-79590246-0  MC_myResourceGroupAKS_myAKSClusterRBAC_eastus  eastus
    ```

1. To add your SSH keys to the node, use the [az vm user update][az-vm-user-update] command. Provide the resource group name and then one of the AKS nodes obtained in the previous step. By default, the username for the AKS nodes is *azureuser*. Provide the location of your own SSH public key location, such as *~/.ssh/id_rsa.pub*, or paste the contents of your SSH public key:

    ```azurecli-interactive
    az vm user update \
      --resource-group $CLUSTER_RESOURCE_GROUP \
      --name aks-nodepool1-79590246-0 \
      --username azureuser \
      --ssh-key-value ~/.ssh/id_rsa.pub
    ```

### Add SSH keys to virtual machine scale set-based AKS clusters

To add your SSH key to a Linux AKS node that's part of a virtual machine scale set, complete the following steps:

1. Get the resource group name for your AKS cluster resources using [az aks show][az-aks-show]. The cluster name is assigned to the variable named *CLUSTER_RESOURCE_GROUP*. Replace *myResourceGroup* with the name of your Resource Group where you AKS Cluster is located:

    ```azurecli-interactive
    CLUSTER_RESOURCE_GROUP=$(az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv)
    ```

1. Next, get the virtual machine scale set for your AKS cluster using the [az vmss list][az-vmss-list] command. The virtual machine scale set name is assigned to the variable named *SCALE_SET_NAME*:

    ```azurecli-interactive
    SCALE_SET_NAME=$(az vmss list --resource-group $CLUSTER_RESOURCE_GROUP --query [0].name -o tsv)
    ```

1. To add your SSH keys to the nodes in a virtual machine scale set, use the [az vmss extension set][az-vmss-extension-set] command. The cluster resource group and virtual machine scale set name are provided from the previous commands. By default, the username for the AKS nodes is *azureuser*. If needed, update the location of your own SSH public key location, such as *~/.ssh/id_rsa.pub*:

    ```azurecli-interactive
    az vmss extension set  \
        --resource-group $CLUSTER_RESOURCE_GROUP \
        --vmss-name $SCALE_SET_NAME \
        --name VMAccessForLinux \
        --publisher Microsoft.OSTCExtensions \
        --version 1.4 \
        --protected-settings "{\"username\":\"azureuser\", \"ssh_key\":\"$(cat ~/.ssh/id_rsa.pub)\"}"
    ```

1. Apply the SSH key to the nodes using the [az vmss update-instances][az-vmss-update-instances] command:

    ```azurecli-interactive
    az vmss update-instances --instance-ids '*' \
        --resource-group $CLUSTER_RESOURCE_GROUP \
        --name $SCALE_SET_NAME
    ```

## Get the AKS node address

The AKS nodes are not publicly exposed to the internet. To SSH to the AKS nodes, you use the private IP address. In the next step, you create a helper pod in your AKS cluster that lets you SSH to this private IP address of the node. The steps to get the private IP address of the AKS nodes is different based on the type of AKS cluster you run:

* For most AKS clusters, follow the steps to [get the IP address for regular AKS clusters](#ssh-to-regular-aks-clusters).
* If you use any preview features in AKS that use virtual machine scale sets, such as multiple node pools or Windows Server container support, [follow the steps for virtual machine scale set-based AKS clusters](#ssh-to-virtual-machine-scale-set-based-aks-clusters).

### SSH to regular AKS clusters

View the private IP address of an AKS cluster node using the [az vm list-ip-addresses][az-vm-list-ip-addresses] command. Provide your own AKS cluster resource group name obtained in a previous [az-aks-show][az-aks-show] step:

```azurecli-interactive
az vm list-ip-addresses --resource-group $CLUSTER_RESOURCE_GROUP -o table
```

The following example output shows the private IP addresses of the AKS nodes:

```
VirtualMachine            PrivateIPAddresses
------------------------  --------------------
aks-nodepool1-79590246-0  10.240.0.4
```

### SSH to virtual machine scale set-based AKS clusters

List the internal IP address of the nodes using the [kubectl get command][kubectl-get]:

```console
kubectl get nodes -o wide
```

The follow example output shows the internal IP addresses of all the nodes in the cluster, including a Windows Server node.

```console
$ kubectl get nodes -o wide

NAME                                STATUS   ROLES   AGE   VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION      CONTAINER-RUNTIME
aks-nodepool1-42485177-vmss000000   Ready    agent   18h   v1.12.7   10.240.0.4    <none>        Ubuntu 16.04.6 LTS          4.15.0-1040-azure   docker://3.0.4
aksnpwin000000                      Ready    agent   13h   v1.12.7   10.240.0.67   <none>        Windows Server Datacenter   10.0.17763.437
```

Record the internal IP address of the node you wish to troubleshoot. You will use this address in a later step.

## Create the SSH connection

To create an SSH connection to an AKS node, you run a helper pod in your AKS cluster. This helper pod provides you with SSH access into the cluster and then additional SSH node access. To create and use this helper pod, complete the following steps:

1. Run a `debian` container image and attach a terminal session to it. This container can be used to create an SSH session with any node in the AKS cluster:

    ```console
    kubectl run -it --rm aks-ssh --image=debian
    ```

    > [!TIP]
    > If you use Windows Server nodes (currently in preview in AKS), add a node selector to the command to schedule the Debian container on a Linux node as follows:
    >
    > `kubectl run -it --rm aks-ssh --image=debian --overrides='{"apiVersion":"apps/v1","spec":{"template":{"spec":{"nodeSelector":{"beta.kubernetes.io/os":"linux"}}}}}'`

1. The base Debian image doesn't include SSH components. Once the terminal session is connected to the container, install an SSH client using `apt-get` as follows:

    ```console
    apt-get update && apt-get install openssh-client -y
    ```

1. In a new terminal window, not connected to your container, list the pods on your AKS cluster using the [kubectl get pods][kubectl-get] command. The pod created in the previous step starts with the name *aks-ssh*, as shown in the following example:

    ```
    $ kubectl get pods
    
    NAME                       READY     STATUS    RESTARTS   AGE
    aks-ssh-554b746bcf-kbwvf   1/1       Running   0          1m
    ```

1. In the first step of this article, you added your public SSH key the AKS node. Now, copy your private SSH key into the pod. This private key is used to create the SSH into the AKS nodes.

    Provide your own *aks-ssh* pod name obtained in the previous step. If needed, change *~/.ssh/id_rsa* to location of your private SSH key:

    ```console
    kubectl cp ~/.ssh/id_rsa aks-ssh-554b746bcf-kbwvf:/id_rsa
    ```

1. Back in the terminal session to your container, update the permissions on the copied `id_rsa` private SSH key so that it is user read-only:

    ```console
    chmod 0600 id_rsa
    ```

1. Now create an SSH connection to your AKS node. Again, the default username for AKS nodes is *azureuser*. Accept the prompt to continue with the connection as the SSH key is first trusted. You are then provided with the bash prompt of your AKS node:

    ```console
    $ ssh -i id_rsa azureuser@10.240.0.4
    
    ECDSA key fingerprint is SHA256:A6rnRkfpG21TaZ8XmQCCgdi9G/MYIMc+gFAuY9RUY70.
    Are you sure you want to continue connecting (yes/no)? yes
    Warning: Permanently added '10.240.0.4' (ECDSA) to the list of known hosts.
    
    Welcome to Ubuntu 16.04.5 LTS (GNU/Linux 4.15.0-1018-azure x86_64)
    
     * Documentation:  https://help.ubuntu.com
     * Management:     https://landscape.canonical.com
     * Support:        https://ubuntu.com/advantage
    
      Get cloud support with Ubuntu Advantage Cloud Guest:
        https://www.ubuntu.com/business/services/cloud
    
    [...]
    
    azureuser@aks-nodepool1-79590246-0:~$
    ```

## Remove SSH access

When done, `exit` the SSH session and then `exit` the interactive container session. When this container session closes, the pod used for SSH access from the AKS cluster is deleted.

## Next steps

If you need additional troubleshooting data, you can [view the kubelet logs][view-kubelet-logs] or [view the Kubernetes master node logs][view-master-logs].

<!-- EXTERNAL LINKS -->
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- INTERNAL LINKS -->
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-vm-list]: /cli/azure/vm#az-vm-list
[az-vm-user-update]: /cli/azure/vm/user#az-vm-user-update
[az-vm-list-ip-addresses]: /cli/azure/vm#az-vm-list-ip-addresses
[view-kubelet-logs]: kubelet-logs.md
[view-master-logs]: view-master-logs.md
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-windows-rdp]: rdp.md
[ssh-nix]: ../virtual-machines/linux/mac-create-ssh-keys.md
[ssh-windows]: ../virtual-machines/linux/ssh-from-windows.md
[az-vmss-list]: /cli/azure/vmss#az-vmss-list
[az-vmss-extension-set]: /cli/azure/vmss/extension#az-vmss-extension-set
[az-vmss-update-instances]: /cli/azure/vmss#az-vmss-update-instances
