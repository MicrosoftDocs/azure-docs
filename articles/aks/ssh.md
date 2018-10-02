---
title: SSH into Azure Kubernetes Service (AKS) cluster nodes
description: Learn how to create an SSH connection with Azure Kubernetes Service (AKS) cluster nodes for troubleshooting and maintenance tasks.
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 08/21/2018
ms.author: iainfou
---

# Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting

Throughout the lifecycle of your Azure Kubernetes Service (AKS) cluster, you may need to access an AKS node. This access could be for maintenance, log collection, or other troubleshooting operations. The AKS nodes are Linux VMs, so you can access them using SSH. For security purposes, the AKS nodes are not exposed to the internet.

This article shows you how to create an SSH connection with an AKS node using their private IP addresses.

## Add your public SSH key

By default, SSH keys are generated when you create an AKS cluster. If you did not specify your own SSH keys when you created your AKS cluster, add your public SSH keys to the AKS nodes. 

To add your SSH key to an AKS node, complete the following steps:

1. Get the resource group name for your AKS cluster resources using [az aks show][az-aks-show]. Provide your own core resource group and AKS cluster name:

    ```azurecli
    az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
    ```

1. List the VMs in the AKS cluster resource group using the [az vm list][az-vm-list] command. These VMs are your AKS nodes:

    ```azurecli
    az vm list --resource-group MC_myResourceGroup_myAKSCluster_eastus -o table
    ```

    The following example output shows the AKS nodes:

    ```
    Name                      ResourceGroup                                  Location
    ------------------------  ---------------------------------------------  ----------
    aks-nodepool1-79590246-0  MC_myResourceGroupAKS_myAKSClusterRBAC_eastus  eastus
    ```

1. To add your SSH keys to the node, use the [az vm user update][az-vm-user-update] command. Provide the resource group name and then one of the AKS nodes obtained in the previous step. By default, the username for the AKS nodes is *azureuser*. Provide the location of your own SSH public key location, such as *~/.ssh/id_rsa.pub*, or paste the contents of your SSH public key:

    ```azurecli
    az vm user update \
      --resource-group MC_myResourceGroup_myAKSCluster_eastus \
      --name aks-nodepool1-79590246-0 \
      --username azureuser \
      --ssh-key-value ~/.ssh/id_rsa.pub
    ```

## Get the AKS node address

The AKS nodes are not publicly exposed to the internet. To SSH to the AKS nodes, you use the private IP address.

View the private IP address of an AKS cluster node using the [az vm list-ip-addresses][az-vm-list-ip-addresses] command. Provide your own AKS cluster resource group name obtained in a previous [az-aks-show][az-aks-show] step:

```azurecli
az vm list-ip-addresses --resource-group MC_myAKSCluster_myAKSCluster_eastus -o table
```

The following example output shows the private IP addresses of the AKS nodes:

```
VirtualMachine            PrivateIPAddresses
------------------------  --------------------
aks-nodepool1-79590246-0  10.240.0.4
```

## Create the SSH connection

To create an SSH connection to an AKS node, you run a helper pod in your AKS cluster. This helper pod provides you with SSH access into the cluster and then additional SSH node access. To create and use this helper pod, complete the following steps:

1. Run a `debian` container image and attach a terminal session to it. This container can be used to create an SSH session with any node in the AKS cluster:

    ```console
    kubectl run -it --rm aks-ssh --image=debian
    ```

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
        http://www.ubuntu.com/business/services/cloud
    
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
