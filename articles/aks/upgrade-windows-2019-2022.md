---
title: Upgrade Kubernetes workloads from Windows Server 2019 to 2022
description: Learn how to upgrade the OS version for Windows workloads on AKS
ms.topic: article
ms.custom: devx-track-linux
ms.date: 8/18/2022
ms.author: viniap
---

# Upgrade Kubernetes workloads from Windows Server 2019 to 2022

Upgrading the OS version of a running Windows workload on Azure Kubernetes Service (AKS) requires you to deploy a new node pool as Windows versions must match on each node pool. This article describes the steps to upgrade the OS version for Windows workloads and other important aspects.

> [!NOTE]
> Windows Server 2019 is being retired after Kubernetes version 1.32 reaches end of life (EOL) and won't be supported in future releases. For more information about this retirement, see the [AKS release notes][aks-release-notes].

## Limitations

Windows Server 2019 and Windows Server 2022 can't co-exist on the same node pool on AKS. A new node pool must be created to host the new OS version. It's important that you match the permissions and access of the previous node pool to the new one.

## Before you begin

- Update the FROM statement on your dockerfile to the new OS version. 
- Check your application and verify that the container app works on the new OS version.
- Deploy the verified container app on AKS to a development or testing environment.
- Take note of the new image name or tag. This will be used below to replace the 2019 version of the image on the YAML file to be deployed to AKS.

> [!NOTE]
> Check out [Dockerfile on Windows](/virtualization/windowscontainers/manage-docker/manage-windows-dockerfile) and [Optimize Windows Dockerfiles](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile) to learn more about how to build a dockerfile for Windows workloads.

## Add a Windows Server 2022 node pool to the existing cluster

Windows Server 2019 and 2022 can't co-exist on the same node pool on AKS. To upgrade your application, you need a separate node pool for Windows Server 2022.
For more information on how to add a new Windows Server 2022 node pool to an existing AKS cluster, see [Add a Windows Server 2022 node pool](./learn/quick-windows-container-deploy-cli.md).

## Update your YAML file

Node Selector is the most common and recommended option for placement of Windows pods on Windows nodes. To use Node Selector, make the following annotation to your YAML files:

```yaml
      nodeSelector:
        "kubernetes.io/os": windows
```

The above annotation finds *any* Windows node available and places the pod on that node (following all other scheduling rules). When upgrading from Windows Server 2019 to Windows Server 2022, you need to enforce not only the placement on a Windows node, but also on a node that is running the latest OS version. To accomplish this, one option is to use a different annotation:

```yaml
      nodeSelector:
        "kubernetes.azure.com/os-sku": Windows2022
```

Once you update the nodeSelector on the YAML file, you should also update the container image to be used. You can get this information from the previous step on which you created a new version of the containerized application by changing the FROM statement on your dockerfile.

> [!NOTE]
> You should leverage the same YAML file you used to deploy the application in the first place - this ensures no other configuration is changed, only the nodeSelector and the image to be used.

## Apply the new YAML file to the existing workload

If you have an application deployed already, follow the recommended steps to deploy a new node pool with Windows Server 2022 nodes. Once deployed, your environment will show Windows Server 2019 and 2022 nodes, with the workloads running on the 2019 nodes:

```bash
kubectl get nodes -o wide
```
This command shows all nodes on your AKS cluster with extra details on the output:

```output
NAME                                STATUS   ROLES   AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION     CONTAINER-RUNTIME
aks-agentpool-18877473-vmss000000   Ready    agent   5h40m   v1.23.8   10.240.0.4     <none>        Ubuntu 18.04.6 LTS               5.4.0-1085-azure   containerd://1.5.11+azure-2
akspoolws000000                     Ready    agent   3h15m   v1.23.8   10.240.0.208   <none>        Windows Server 2022 Datacenter   10.0.20348.825     containerd://1.6.6+azure
akspoolws000001                     Ready    agent   3h17m   v1.23.8   10.240.0.239   <none>        Windows Server 2022 Datacenter   10.0.20348.825     containerd://1.6.6+azure
akspoolws000002                     Ready    agent   3h17m   v1.23.8   10.240.1.14    <none>        Windows Server 2022 Datacenter   10.0.20348.825     containerd://1.6.6+azure
akswspool000000                     Ready    agent   5h37m   v1.23.8   10.240.0.115   <none>        Windows Server 2019 Datacenter   10.0.17763.3165    containerd://1.6.6+azure
akswspool000001                     Ready    agent   5h37m   v1.23.8   10.240.0.146   <none>        Windows Server 2019 Datacenter   10.0.17763.3165    containerd://1.6.6+azure
akswspool000002                     Ready    agent   5h37m   v1.23.8   10.240.0.177   <none>        Windows Server 2019 Datacenter   10.0.17763.3165    containerd://1.6.6+azure
```

With the Windows Server 2022 node pool deployed and the YAML file configured, you can now deploy the new version of the YAML:

```bash
kubectl apply -f <filename>
```

This command should return a "configured" status for the deployment:

```output
deployment.apps/sample configured
service/sample unchanged
```
At this point, AKS starts the process of terminating the existing pods and deploying new pods to the Windows Server 2022 nodes. You can check the status of your deployment by running:

```bash
kubectl get pods -o wide
```
This command returns the status of the pods on the default namespace. You might need to change the command above to list the pods on specific namespaces. 

```output
NAME                      READY   STATUS    RESTARTS   AGE     IP             NODE              NOMINATED NODE   READINESS GATES
sample-7794bfcc4c-k62cq   1/1     Running   0          2m49s   10.240.0.238   akspoolws000000   <none>           <none>
sample-7794bfcc4c-rswq9   1/1     Running   0          2m49s   10.240.1.10    akspoolws000001   <none>           <none>
sample-7794bfcc4c-sh78c   1/1     Running   0          2m49s   10.240.0.228   akspoolws000000   <none>           <none>
```

## Active Directory, gMSA and Managed Identity implications

If you're using Group Managed Service Accounts (gMSA), update the Managed Identity configuration for the new node pool. gMSA uses a secret (user account and password) so the node on which the Windows pod is running can authenticate the container against Active Directory. To access that secret on Azure Key Vault, the node uses a Managed Identity that allows the node to access the resource. Since Managed Identities are configured per node pool, and the pod now resides on a new node pool, you need to update that configuration. Check out [Enable Group Managed Service Accounts (GMSA) for your Windows Server nodes on your Azure Kubernetes Service (AKS) cluster](./use-group-managed-service-accounts.md) for more information.

The same principle applies to Managed Identities used for any other pod/node pool when accessing other Azure resources. Any access provided via Managed Identity needs to be updated to reflect the new node pool. To view update and sign-in activities, see [How to view Managed Identity activity](../active-directory/managed-identities-azure-resources/how-to-view-managed-identity-activity.md).
