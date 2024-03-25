---
title: Connect to Azure Kubernetes Service (AKS) cluster nodes
description: Learn how to connect to Azure Kubernetes Service (AKS) cluster nodes for troubleshooting and maintenance tasks.
ms.topic: troubleshooting
ms.date: 01/08/2024
ms.reviewer: mattmcinnes
ms.custom:
#Customer intent: As a cluster operator, I want to learn how to connect to virtual machines in an AKS cluster to perform maintenance or troubleshoot a problem.
---

# Connect to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting

Throughout the lifecycle of your Azure Kubernetes Service (AKS) cluster, you eventually need to directly access an AKS node. This access could be for maintenance, log collection, or troubleshooting operations.

You access a node through authentication, which methods vary depending on your Node OS and method of connection. You securely authenticate against AKS Linux and Windows nodes through two options discussed in this article. One requires that you have Kubernetes API access, and the other is through the AKS ARM API, which provides direct private IP information. For security reasons, AKS nodes aren't exposed to the internet. Instead, to connect directly to any AKS nodes, you need to use either `kubectl debug` or the host's private IP address.

## Access nodes using the Kubernetes API

This method requires usage of `kubectl debug` command.

### Before you begin

This guide shows you how to create a connection to an AKS node and update the SSH key of your AKS cluster. To follow along the steps, you need to use Azure CLI that supports version 2.0.64 or later. Run `az --version` to check the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

Complete these steps if you don't have an SSH key. Create an SSH key depending on your Node OS Image, for [macOS and Linux][ssh-nix], or [Windows][ssh-windows]. Make sure you save the key pair in the OpenSSH format, avoid unsupported formats such as `.ppk`. Next, refer to [Manage SSH configuration][manage-ssh-node-access] to add the key to your cluster.

### Linux and macOS

Linux and macOS users can SSH to access their node using `kubectl debug` or their private IP Address. Windows users should skip to the Windows Server Proxy section for a workaround to SSH via proxy.

#### SSH using kubectl debug

To create an interactive shell connection, use the `kubectl debug` command to run a privileged container on your node.

1. To list your nodes, use the `kubectl get nodes` command:

    ```bash
    kubectl get nodes -o wide
    ```

    Sample output:

    ```output
    NAME                                STATUS   ROLES   AGE    VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE
    aks-nodepool1-37663765-vmss000000   Ready    agent   166m   v1.25.6   10.224.0.33   <none>        Ubuntu 22.04.2 LTS
    aks-nodepool1-37663765-vmss000001   Ready    agent   166m   v1.25.6   10.224.0.4    <none>        Ubuntu 22.04.2 LTS
    aksnpwin000000                      Ready    agent   160m   v1.25.6   10.224.0.62   <none>        Windows Server 2022 Datacenter
    ```

2. Use the `kubectl debug` command to start a privileged container on your node and connect to it.

    ```bash
    kubectl debug node/aks-nodepool1-37663765-vmss000000 -it --image=mcr.microsoft.com/cbl-mariner/busybox:2.0
    ```

    Sample output:

    ```output
    Creating debugging pod node-debugger-aks-nodepool1-37663765-vmss000000-bkmmx with container debugger on node aks-nodepool1-37663765-vmss000000.
    If you don't see a command prompt, try pressing enter.
    root@aks-nodepool1-37663765-vmss000000:/#
    ```

    You now have access to the node through a privileged container as a debugging pod.

    > [!NOTE]
    > You can interact with the node session by running `chroot /host` from the privileged container.

#### Exit kubectl debug mode

When you're done with your node, enter the `exit` command to end the interactive shell session. After the interactive container session closes, delete the debugging pod used with `kubectl delete pod`.

```bash
kubectl delete pod node-debugger-aks-nodepool1-37663765-vmss000000-bkmmx
```

### Windows Server proxy connection for SSH

Follow these steps as a workaround to connect with SSH on a Windows Server node.

#### Create a proxy server

At this time, you can't connect to a Windows Server node directly by using `kubectl debug`. Instead, you need to first connect to another node in the cluster with `kubectl`, then connect to the Windows Server node from that node using SSH.

To connect to another node in the cluster, use the `kubectl debug` command. For more information, follow the above steps in the kubectl section. Create an SSH connection to the Windows Server node from another node using the SSH keys provided when you created the AKS cluster and the internal IP address of the Windows Server node.

> [!IMPORTANT]
>
> The following steps for creating the SSH connection to the Windows Server node from another node can only be used if you created your AKS cluster using the Azure CLI with the `--generate-ssh-keys` parameter. If you want to use your own SSH keys instead, you can use the `az aks update` to manage SSH keys on an existing AKS cluster. For more information, see [manage SSH node access][manage-ssh-node-access].

> [!Note]
>
> If your Linux proxy node is down or unresponsive, use the [Azure Bastion][azure-bastion] method to connect instead.

1. Use the `kubectl debug` command to start a privileged container on your proxy (Linux) node and connect to it.

    ```bash
    kubectl debug node/aks-nodepool1-37663765-vmss000000 -it --image=mcr.microsoft.com/cbl-mariner/busybox:2.0
    ```

    Sample output:

    ```output
    Creating debugging pod node-debugger-aks-nodepool1-37663765-vmss000000-bkmmx with container debugger on node aks-nodepool1-37663765-vmss000000.
    If you don't see a command prompt, try pressing enter.
    root@aks-nodepool1-37663765-vmss000000:/#
    ```

2. Open a new terminal window and use the `kubectl get pods` command to get the name of the pod started by `kubectl debug`.

    ```bash
    kubectl get pods
    ```

    Sample output:

    ```output
    NAME                                                    READY   STATUS    RESTARTS   AGE
    node-debugger-aks-nodepool1-37663765-vmss000000-bkmmx   1/1     Running   0          21s
    ```

    In the sample output, *node-debugger-aks-nodepool1-37663765-vmss000000-bkmmx* is the name of the pod started by `kubectl debug`.

3. Use the `kubectl port-forward` command to open a connection to the deployed pod:

    ```bash
    kubectl port-forward node-debugger-aks-nodepool1-37663765-vmss000000-bkmmx 2022:22
    ```

    Sample output:

    ```output
    Forwarding from 127.0.0.1:2022 -> 22
    Forwarding from [::1]:2022 -> 22
    ```

    The previous example begins forwarding network traffic from port `2022` on your development computer to port `22` on the deployed pod. When using `kubectl port-forward` to open a connection and forward network traffic, the connection remains open until you stop the `kubectl port-forward` command.

3. Open a new terminal and run the command `kubectl get nodes` to show the internal IP address of the Windows Server node:

    ```bash
    kubectl get no -o custom-columns=NAME:metadata.name,'INTERNAL_IP:status.addresses[?(@.type == \"InternalIP\")].address'
    ```

    Sample output:

    ```output
    NAME                                INTERNAL_IP
    aks-nodepool1-19409214-vmss000003   10.224.0.8
    ```

    In the previous example, *10.224.0.62* is the internal IP address of the Windows Server node.

4. Create an SSH connection to the Windows Server node using the internal IP address, and connect to port `22` through port `2022` on your development computer. The default username for AKS nodes is *azureuser*. Accept the prompt to continue with the connection. You're then provided with the bash prompt of your Windows Server node:

    ```bash
    ssh -o 'ProxyCommand ssh -p 2022 -W %h:%p azureuser@127.0.0.1' azureuser@10.224.0.62
    ```

    Sample output:

    ```output
    The authenticity of host '10.224.0.62 (10.224.0.62)' can't be established.
    ECDSA key fingerprint is SHA256:1234567890abcdefghijklmnopqrstuvwxyzABCDEFG.
    Are you sure you want to continue connecting (yes/no)? yes
    ```

    > [!NOTE]
    > If you prefer to use password authentication, include the parameter `-o PreferredAuthentications=password`. For example:
    >
    > ```console
    >  ssh -o 'ProxyCommand ssh -p 2022 -W %h:%p azureuser@127.0.0.1' -o PreferredAuthentications=password azureuser@10.224.0.62
    > ```

## Use Host Process Container to access Windows node

1. Create `hostprocess.yaml` with the following content and replacing `AKSWINDOWSNODENAME` with the AKS Windows node name.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      labels:
        pod: hpc
      name: hpc
    spec:
      securityContext:
        windowsOptions:
          hostProcess: true
          runAsUserName: "NT AUTHORITY\\SYSTEM"
      hostNetwork: true
      containers:
        - name: hpc
          image: mcr.microsoft.com/windows/servercore:ltsc2022 # Use servercore:1809 for WS2019
          command:
            - powershell.exe
            - -Command
            - "Start-Sleep 2147483"
          imagePullPolicy: IfNotPresent
      nodeSelector:
        kubernetes.io/os: windows
        kubernetes.io/hostname: AKSWINDOWSNODENAME
      tolerations:
        - effect: NoSchedule
          key: node.kubernetes.io/unschedulable
          operator: Exists
        - effect: NoSchedule
          key: node.kubernetes.io/network-unavailable
          operator: Exists
        - effect: NoExecute
          key: node.kubernetes.io/unreachable
          operator: Exists
    ```

2. Run `kubectl apply -f hostprocess.yaml` to deploy the Windows host process container (HPC) in the specified Windows node.

3. Use `kubectl exec -it [HPC-POD-NAME] -- powershell`.

4. You can run any PowerShell commands inside the HPC container to access the Windows node.

> [!Note]
>
> You need to switch the root folder to `C:\` inside the HPC container to access the files in the Windows node.

## SSH using Azure Bastion for Windows

If your Linux proxy node isn't reachable, using Azure Bastion as a proxy is an alternative. This method requires that you set up an Azure Bastion host for the virtual network in which the cluster resides. See [Connect with Azure Bastion][azure-bastion] for more details.

## SSH using private IPs from the AKS API (preview)

If you don't have access to the Kubernetes API, you can get access to properties such as ```Node IP``` and ```Node Name``` through the [AKS agent pool API (preview)][agent-pool-rest-api], (available on preview versions `07-02-2023` or above) to connect to AKS nodes.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Create an interactive shell connection to a node using the IP address

For convenience, AKS nodes are exposed on the cluster's virtual network through private IP addresses. However, you need to be in the cluster's virtual network to SSH into the node. If you don't already have an environment configured, you can use [Azure Bastion][azure-bastion-linux] to establish a proxy from which you can SSH to cluster nodes. Make sure the Azure Bastion is deployed in the same virtual network as the cluster.

1. Obtain private IPs using the `az aks machine list` command, targeting all the VMs in a specific node pool with the `--nodepool-name` flag.

    ```bash
    az aks machine list --resource-group myResourceGroup  --cluster-name myAKSCluster --nodepool-name nodepool1 -o table
    ```

    The following example output shows the internal IP addresses of all the nodes in the node pool:

    ```output
    Name                               Ip           Family
    ---------------------------------  -----------  -----------
    aks-nodepool1-33555069-vmss000000  10.224.0.5   IPv4
    aks-nodepool1-33555069-vmss000001  10.224.0.6   IPv4
    aks-nodepool1-33555069-vmss000002  10.224.0.4   IPv4
    ```
    To target a specific node inside the node pool, use the `--machine-name` flag:

    ```bash
    az aks machine show --cluster-name myAKScluster --nodepool-name nodepool1 -g myResourceGroup --machine-name aks-nodepool1-33555069-vmss000000 -o table
    ```
    The following example output shows the internal IP address of all the specified node:

    ```output
    Name                               Ip         Family
    ---------------------------------  -----------  -----------
    aks-nodepool1-33555069-vmss000000  10.224.0.5   IPv4
    ```

2. SSH to the node using the private IP address you obtained in the previous step. This step is applicable for Linux machines only. For Windows machines, see [Connect with Azure Bastion][azure-bastion].

    ```bash
    ssh -i /path/to/private_key.pem azureuser@10.224.0.33
    ```

## Next steps

If you need more troubleshooting data, you can [view the kubelet logs][view-kubelet-logs] or [view the Kubernetes control plane logs][view-control-plane-logs].

To learn about managing your SSH keys, see [Manage SSH configuration][manage-ssh-node-access].

<!-- INTERNAL LINKS -->
[view-kubelet-logs]: kubelet-logs.md
[view-control-plane-logs]: monitor-aks-reference.md#resource-logs
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-windows-rdp]: rdp.md
[azure-bastion]: ../bastion/bastion-overview.md
[azure-bastion]: rdp.md#connect-with-azure-bastion
[ssh-nix]: ../virtual-machines/linux/mac-create-ssh-keys.md
[ssh-windows]: ../virtual-machines/linux/ssh-from-windows.md
[agent-pool-rest-api]: /rest/api/aks/agent-pools/get#agentpool
[manage-ssh-node-access]: manage-ssh-node-access.md
[azure-bastion-linux]:../bastion/bastion-connect-vm-ssh-linux.md
