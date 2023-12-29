---
title: Connect to Azure Kubernetes Service (AKS) cluster nodes
description: Learn how to connect to Azure Kubernetes Service (AKS) cluster nodes for troubleshooting and maintenance tasks.
ms.topic: article
ms.date: 12/20/2023
ms.reviewer: mattmcinnes
ms.custom: contperf-fy21q4, devx-track-linux
#Customer intent: As a cluster operator, I want to learn how to connect to virtual machines in an AKS cluster to perform maintenance or troubleshoot a problem.
---

# Connect to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting

Throughout the lifecycle of your Azure Kubernetes Service (AKS) cluster, you might need to access an AKS node. This access could be for maintenance, log collection, or troubleshooting operations. You can securely authenticate against AKS Linux and Windows nodes using SSH, and you can also [connect to Windows Server nodes using remote desktop protocol (RDP)][aks-windows-rdp]. For security reasons, the AKS nodes aren't exposed to the internet. To connect to the AKS nodes, you use `kubectl debug` or the private IP address.

This article shows you how to create a connection to an AKS node and update the SSH key on an existing AKS cluster.

## Before you begin

This article assumes you have an SSH key. If not, you can create an SSH key using [macOS or Linux][ssh-nix] or [Windows][ssh-windows],to know more refer [Manage SSH configuration][manage-ssh-node-access]. Make sure you save the key pair in an OpenSSH format, other formats like .ppk aren't supported.

You also need the Azure CLI version 2.0.64 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Create an interactive shell connection to a Linux node using kubectl

To create an interactive shell connection to a Linux node, use the `kubectl debug` command to run a privileged container on your node.

1. To list your nodes, use the `kubectl get nodes` command:

    ```bash
    kubectl get nodes -o wide
    ```
    
    The following example resembles output from the command:
    
    ```output
    NAME                                STATUS   ROLES   AGE    VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE    
    aks-nodepool1-37663765-vmss000000   Ready    agent   166m   v1.25.6   10.224.0.33   <none>        Ubuntu 22.04.2 LTS               
    aks-nodepool1-37663765-vmss000001   Ready    agent   166m   v1.25.6   10.224.0.4    <none>        Ubuntu 22.04.2 LTS              
    aksnpwin000000                      Ready    agent   160m   v1.25.6   10.224.0.62   <none>        Windows Server 2022 Datacenter  
    ```

2. Use the `kubectl debug` command to run a container image on the node to connect to it. The following command starts a privileged container on your node and connects to it.

    ```bash
    kubectl debug node/aks-nodepool1-37663765-vmss000000 -it --image=mcr.microsoft.com/dotnet/runtime-deps:6.0
    ```

    The following example resembles output from the command:

    ```output
    Creating debugging pod node-debugger-aks-nodepool1-37663765-vmss000000-bkmmx with container debugger on node aks-nodepool1-37663765-vmss000000.
    If you don't see a command prompt, try pressing enter.
    root@aks-nodepool1-37663765-vmss000000:/#
    ```
    
    This privileged container gives access to the node.
    
    > [!NOTE]
    > You can interact with the node session by running `chroot /host` from the privileged container.

### Remove Linux node access

When you are done with a debugging pod, enter the `exit` command to end the interactive shell session. After the interactive container session closes, delete the pod used for access with `kubectl delete pod`.

```bash
kubectl delete pod node-debugger-aks-nodepool1-37663765-vmss000000-bkmmx
```
## Create an interactive shell connection to a node using private IP

In the event that you do not have access to the Kubernetes API, you can get access to properties such as ```Node IP``` and ```Node Name``` through the AKS Agentpool Preview API(preview version 07-02-2023 or above) to troubleshoot node-specific issues in your AKS node pools. For convenience, we also expose the public IP if the node has a public IP assigned. However in order to SSH into the node , you need to be in the cluster's virtual network, refer more information [here][Vnet-Integration]. The below steps apply for both Linux and Windows machines. 

1. To get the private IP via CLI use az cli version 2.53 or above with aks-preview extension installed.

```bash
    az aks machine list --resource-group myResourceGroup  --cluster-name myAKSCluster -nodepool-name nodepool1
   
 ```

The following example resembles output from the command:
 ```output
   [
  {
    "id": "/subscriptions/1234/resourceGroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/agentPools/nodepool1/machines/aks-nodepool1-19409214-vmss000003",
    "name": "aks-nodepool1-19409214-vmss000003",
    "properties": {
      "network": {
        "ipAddresses": [
          {
            "family": "IPv4",
            "ip": "10.224.0.8"
          }
        ]
      },
      "resourceId": "/subscriptions/1234/resourceGroups/MC_myResourceGroup_myAKSCluster_eastus2/providers/Microsoft.Compute/virtualMachineScaleSets/aks-nodepool1-19409214-vmss/virtualMachines/3"
    },
    "resourceGroup": "myResourceGroup",
    "type": "Microsoft.ContainerService/managedClusters/agentPools/machines"
  }
]                  
```
To target a specific node inside the nodepool , use this command:

```bash
    az aks machine show --cluster-name myAKScluster --nodepool-name nodepool1 -g myResourceGroup --machine-name aks-nodepool1-19409214-vmss000003
   
 ```
 The following example resembles output from the command:
```output
   [
    {
  "id": "/subscriptions/1234/resourceGroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myAKSCluster/agentPools/nodepool1/machines/aks-nodepool1-19409214-vmss000003/aks-nodepool1-19409214-vmss000003",
  "name": "aks-nodepool1-19409214-vmss000003",
  "properties": {
    "network": {
      "ipAddresses": [
        {
          "family": "IPv4",
          "ip": "10.224.0.8"
        }
      ]
    },
    "resourceId": "/subscriptions/1234/resourceGroups/MC_myResourceGroup_myAKSCluster_eastus2/providers/Microsoft.Compute/virtualMachineScaleSets/aks-nodepool1-19409214-vmss/virtualMachines/3"
  },
  "resourceGroup": "myResourceGroup",
  "type": "Microsoft.ContainerService/managedClusters/agentPools/machines"
}
   ]
   ```

2. Use the private IP to SSH into the node. [Azure Bastion][azure-bastion] also provides you information for securely connecting to virtual machines via private IP address.

```bash
ssh azureuser@10.224.0.33
```

## Create the SSH connection to a Windows node

At this time, you can't connect to a Windows Server node directly by using `kubectl debug`. Instead, you need to first connect to another node in the cluster, then connect to the Windows Server node from that node using SSH. Alternatively, you can [connect to Windows Server nodes using remote desktop protocol (RDP) connections][aks-windows-rdp] instead of using SSH or use the steps defined above in this document , with 'machines' API. 

To connect to another node in the cluster, use the `kubectl debug` command. For more information, see [Create an interactive shell connection to a Linux node][ssh-linux-kubectl-debug].

To create the SSH connection to the Windows Server node from another node, use the SSH keys provided when you created the AKS cluster and the internal IP address of the Windows Server node.

> [!IMPORTANT]
>
> The following steps for creating the SSH connection to the Windows Server node from another node can only be used if you created your AKS cluster using the Azure CLI and the `--generate-ssh-keys` parameter. AKS Update command can also be used to manage, create SSH keys on an existing AKS cluster. For more information refer [Manage SSH configuration][manage-ssh-node-access]. 

1. Open a new terminal window and use the `kubectl get pods` command to get the name of the pod started by `kubectl debug`.

    ```bash
    kubectl get pods
    ```

    The following example resembles output from the command:

    ```output
    NAME                                                    READY   STATUS    RESTARTS   AGE
    node-debugger-aks-nodepool1-37663765-vmss000000-bkmmx   1/1     Running   0          21s
    ```

    In the previous example, *node-debugger-aks-nodepool1-37663765-vmss000000-bkmmx* is the name of the pod started by `kubectl debug`.

2. Use the `kubectl port-forward` command to open a connection to the deployed pod:

    ```bash
    kubectl port-forward node-debugger-aks-nodepool1-37663765-vmss000000-bkmmx 2022:22
    ```

    The following example resembles output from the command:

    ```output
    Forwarding from 127.0.0.1:2022 -> 22
    Forwarding from [::1]:2022 -> 22
    ```

    The previous example begins forwarding network traffic from port `2022` on your development computer to port `22` on the deployed pod. When using `kubectl port-forward` to open a connection and forward network traffic, the connection remains open until you stop the `kubectl port-forward` command.

3. Open a new terminal and run the command `kubectl get nodes` to show the internal IP address of the Windows Server node:

    ```bash
    kubectl get no -o custom-columns=NAME:metadata.name,'INTERNAL_IP:status.addresses[?(@.type == \"InternalIP\")].address'
    ```

    The following example resembles output from the command:

    ```output
    NAME                                INTERNAL_IP                       
    aks-nodepool1-19409214-vmss000003   10.224.0.8  
    ```

    In the previous example, *10.224.0.62* is the internal IP address of the Windows Server node.

4. Create an SSH connection to the Windows Server node using the internal IP address, and connect to port `22` through port `2022` on your development computer. The default username for AKS nodes is *azureuser*. Accept the prompt to continue with the connection. You're then provided with the bash prompt of your Windows Server node:

    ```bash
    ssh -o 'ProxyCommand ssh -p 2022 -W %h:%p azureuser@127.0.0.1' azureuser@10.224.0.62
    ```

    The following example resembles output from the command:

    ```output
    The authenticity of host '10.224.0.62 (10.224.0.62)' can't be established.
    ECDSA key fingerprint is SHA256:1234567890abcdefghijklmnopqrstuvwxyzABCDEFG.
    Are you sure you want to continue connecting (yes/no)? yes
    
    [...]
    
    Microsoft Windows [Version 10.0.17763.1935]
    (c) 2018 Microsoft Corporation. All rights reserved.
    
    azureuser@aksnpwin000000 C:\Users\azureuser>
    ```

    > [!NOTE]
    > If you prefer to use password authentication, include the parameter `-o PreferredAuthentications=password`. For example:
    >
    > ```console
    >  ssh -o 'ProxyCommand ssh -p 2022 -W %h:%p azureuser@127.0.0.1' -o PreferredAuthentications=password azureuser@10.224.0.62
    > ```

## Next steps

If you need more troubleshooting data, you can [view the kubelet logs][view-kubelet-logs] or [view the Kubernetes master node logs][view-master-logs].

See [Manage SSH configuration][manage-ssh-node-access] to learn about managing the SSH key on an AKS cluster or node pools.

<!-- INTERNAL LINKS -->
[view-kubelet-logs]: kubelet-logs.md
[view-master-logs]: monitor-aks-reference.md#resource-logs
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-windows-rdp]: rdp.md
[azure-bastion]: /bastion/bastion-overview 
[ssh-nix]: ../virtual-machines/linux/mac-create-ssh-keys.md
[ssh-windows]: ../virtual-machines/linux/ssh-from-windows.md
[agentpool-rest-api]: /rest/api/aks/agent-pools/get#agentpool
[manage-ssh-node-access]: manage-ssh-node-access.md
[Vnet-Integration]:api-server-vnet-integration.md#create-an-aks-cluster-with-api-server-vnet-integration-using-managed-vnet