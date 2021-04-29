---
title: SSH into Azure Kubernetes Service (AKS) cluster nodes
description: Learn how to create an SSH connection with Azure Kubernetes Service (AKS) cluster nodes for troubleshooting and maintenance tasks.
services: container-service
ms.topic: article
ms.date: 07/31/2019


#Customer intent: As a cluster operator, I want to learn how to use SSH to connect to virtual machines in an AKS cluster to perform maintenance or troubleshoot a problem.
---

# Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting

Throughout the lifecycle of your Azure Kubernetes Service (AKS) cluster, you may need to access an AKS node. This access could be for maintenance, log collection, or other troubleshooting operations. You can access AKS nodes using SSH, including Windows Server nodes. You can also [connect to Windows Server nodes using remote desktop protocol (RDP) connections][aks-windows-rdp]. For security purposes, the AKS nodes aren't exposed to the internet. To SSH to the AKS nodes, you use the private IP address.

This article shows you how to create an SSH connection with an AKS node using their private IP addresses.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

By default, SSH keys are obtained, or generated, then added to nodes when you create an AKS cluster. This article shows you how to specify different SSH keys than the SSH keys used when you created your AKS cluster. The article also shows you how to determine the private IP address of your node and connect to it using SSH. If you don't need to specify a different SSH key, then you may skip the step for adding the SSH public key to the node.

This article also assumes you have an SSH key. You can create an SSH key using [macOS or Linux][ssh-nix] or [Windows][ssh-windows]. If you use PuTTY Gen to create the key pair, save the key pair in an OpenSSH format rather than the default PuTTy private key format (.ppk file).

You also need the Azure CLI version 2.0.64 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Configure virtual machine scale set-based AKS clusters for SSH access

To configure your virtual machine scale set-based for SSH access, find the name of your cluster's virtual machine scale set and add your SSH public key to that scale set.

Use the [az aks show][az-aks-show] command to get the resource group name of your AKS cluster, then the [az vmss list][az-vmss-list] command to get the name of your scale set.

```azurecli-interactive
CLUSTER_RESOURCE_GROUP=$(az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv)
SCALE_SET_NAME=$(az vmss list --resource-group $CLUSTER_RESOURCE_GROUP --query '[0].name' -o tsv)
```

The above example assigns the name of the cluster resource group for the *myAKSCluster* in *myResourceGroup* to *CLUSTER_RESOURCE_GROUP*. The example then uses *CLUSTER_RESOURCE_GROUP* to list the scale set name and assign it to *SCALE_SET_NAME*.

> [!IMPORTANT]
> At this time, you should only update your SSH keys for your virtual machine scale set-based AKS clusters using the Azure CLI.
> 
> For Linux nodes, SSH keys can currently only be added using the Azure CLI. If you want to connect to a Windows Server node using SSH, use the SSH keys provided when you created the AKS cluster and skip the next set of commands for adding your SSH public key. You will still need the IP address of the node you wish to troubleshoot, which is shown in the final command of this section. Alternatively, you can [connect to Windows Server nodes using remote desktop protocol (RDP) connections][aks-windows-rdp] instead of using SSH.

To add your SSH keys to the nodes in a virtual machine scale set, use the [az vmss extension set][az-vmss-extension-set] and [az vmss update-instances][az-vmss-update-instances] commands.

```azurecli-interactive
az vmss extension set  \
    --resource-group $CLUSTER_RESOURCE_GROUP \
    --vmss-name $SCALE_SET_NAME \
    --name VMAccessForLinux \
    --publisher Microsoft.OSTCExtensions \
    --version 1.4 \
    --protected-settings "{\"username\":\"azureuser\", \"ssh_key\":\"$(cat ~/.ssh/id_rsa.pub)\"}"

az vmss update-instances --instance-ids '*' \
    --resource-group $CLUSTER_RESOURCE_GROUP \
    --name $SCALE_SET_NAME
```

The above example uses the *CLUSTER_RESOURCE_GROUP* and *SCALE_SET_NAME* variables from the previous commands. The above example also uses *~/.ssh/id_rsa.pub* as the location for your SSH public key.

> [!NOTE]
> By default, the username for the AKS nodes is *azureuser*.

After you add your SSH public key to the scale set, you can SSH into a node virtual machine in that scale set using its IP address. View the private IP addresses of the AKS cluster nodes using the [kubectl get command][kubectl-get].

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

Record the internal IP address of the node you wish to troubleshoot.

To access your node using SSH, follow the steps in [Create the SSH connection](#create-the-ssh-connection).

## Configure virtual machine availability set-based AKS clusters for SSH access

To configure your virtual machine availability set-based AKS cluster for SSH access, find the name of your cluster's Linux node, and add your SSH public key to that node.

Use the [az aks show][az-aks-show] command to get the resource group name of your AKS cluster, then the [az vm list][az-vm-list] command to list the virtual machine name of your cluster's Linux node.

```azurecli-interactive
CLUSTER_RESOURCE_GROUP=$(az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv)
az vm list --resource-group $CLUSTER_RESOURCE_GROUP -o table
```

The above example assigns the name of the cluster resource group for the *myAKSCluster* in *myResourceGroup* to *CLUSTER_RESOURCE_GROUP*. The example then uses *CLUSTER_RESOURCE_GROUP* to list the virtual machine name. The example output shows the name of the virtual machine:

```
Name                      ResourceGroup                                  Location
------------------------  ---------------------------------------------  ----------
aks-nodepool1-79590246-0  MC_myResourceGroupAKS_myAKSClusterRBAC_eastus  eastus
```

To add your SSH keys to the node, use the [az vm user update][az-vm-user-update] command.

```azurecli-interactive
az vm user update \
    --resource-group $CLUSTER_RESOURCE_GROUP \
    --name aks-nodepool1-79590246-0 \
    --username azureuser \
    --ssh-key-value ~/.ssh/id_rsa.pub
```

The above example uses the *CLUSTER_RESOURCE_GROUP* variable and the node virtual machine name from previous commands. The above example also uses *~/.ssh/id_rsa.pub* as the location for your SSH public key. You could also use the contents of your SSH public key instead of specifying a path.

> [!NOTE]
> By default, the username for the AKS nodes is *azureuser*.

After you add your SSH public key to the node virtual machine, you can SSH into that virtual machine using its IP address. View the private IP address of an AKS cluster node using the [az vm list-ip-addresses][az-vm-list-ip-addresses] command.

```azurecli-interactive
az vm list-ip-addresses --resource-group $CLUSTER_RESOURCE_GROUP -o table
```

The above example uses the *CLUSTER_RESOURCE_GROUP* variable set in the previous commands. The following example output shows the private IP addresses of the AKS nodes:

```
VirtualMachine            PrivateIPAddresses
------------------------  --------------------
aks-nodepool1-79590246-0  10.240.0.4
```

## Create the SSH connection

To create an SSH connection to an AKS node, you run a helper pod in your AKS cluster. This helper pod provides you with SSH access into the cluster and then additional SSH node access. To create and use this helper pod, complete the following steps:

1. Run a `debian` container image and attach a terminal session to it. This container can be used to create an SSH session with any node in the AKS cluster:

    ```console
    kubectl run -it --rm aks-ssh --image=mcr.microsoft.com/aks/fundamental/base-ubuntu:v0.0.11
    ```

    > [!TIP]
    > If you use Windows Server nodes, add a node selector to the command to schedule the Debian container on a Linux node:
    >
    > ```console
    > kubectl run -it --rm aks-ssh --image=mcr.microsoft.com/aks/fundamental/base-ubuntu:v0.0.11 --overrides='{"apiVersion":"v1","spec":{"nodeSelector":{"beta.kubernetes.io/os":"linux"}}}'
    > ```

1. Once the terminal session is connected to the container, install an SSH client using `apt-get`:

    ```console
    apt-get update && apt-get install openssh-client -y
    ```

1. Open a new terminal window, not connected to your container, copy your private SSH key into the helper pod. This private key is used to create the SSH into the AKS node. 

   If needed, change *~/.ssh/id_rsa* to location of your private SSH key:

    ```console
    kubectl cp ~/.ssh/id_rsa $(kubectl get pod -l run=aks-ssh -o jsonpath='{.items[0].metadata.name}'):/id_rsa
    ```

1. Return to the terminal session to your container, update the permissions on the copied `id_rsa` private SSH key so that it is user read-only:

    ```console
    chmod 0400 id_rsa
    ```

1. Create an SSH connection to your AKS node. Again, the default username for AKS nodes is *azureuser*. Accept the prompt to continue with the connection as the SSH key is first trusted. You are then provided with the bash prompt of your AKS node:

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
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-vm-list]: /cli/azure/vm#az_vm_list
[az-vm-user-update]: /cli/azure/vm/user#az_vm_user_update
[az-vm-list-ip-addresses]: /cli/azure/vm#az_vm_list_ip_addresses
[view-kubelet-logs]: kubelet-logs.md
[view-master-logs]: ./view-control-plane-logs.md
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-windows-rdp]: rdp.md
[ssh-nix]: ../virtual-machines/linux/mac-create-ssh-keys.md
[ssh-windows]: ../virtual-machines/linux/ssh-from-windows.md
[az-vmss-list]: /cli/azure/vmss#az_vmss_list
[az-vmss-extension-set]: /cli/azure/vmss/extension#az_vmss_extension_set
[az-vmss-update-instances]: /cli/azure/vmss#az_vmss_update_instances