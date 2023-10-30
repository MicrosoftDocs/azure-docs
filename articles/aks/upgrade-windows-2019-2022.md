---
title: Upgrade Azure Kubernetes Service (AKS) workloads from Windows Server 2019 to 2022
description: Learn how to upgrade the OS version for Windows workloads on Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: devx-track-linux
ms.date: 09/12/2023
---

# Upgrade Azure Kubernetes Service (AKS) workloads from Windows Server 2019 to 2022

When upgrading the OS version of a running Windows workload on Azure Kubernetes Service (AKS), you need to deploy a new node pool to ensure the Windows versions match on each node pool. This article describes the steps to upgrade the OS version for Windows workloads on AKS.

> [!NOTE]
> Windows Server 2019 is being retired after Kubernetes version 1.32 reaches end of life (EOL) and won't be supported in future releases. For more information about this retirement, see the [AKS release notes][aks-release-notes].

## Limitations

Windows Server 2019 and Windows Server 2022 can't coexist on the same node pool on AKS. You need to create a new node pool to host the new OS version. It's important that you match the permissions and access of the previous node pool to the new one.

## Before you begin

- Update the `FROM` statement in your Dockerfile to the new OS version.
- Check your application and verify the container app works on the new OS version.
- Deploy the verified container app on AKS to a development or testing environment.
- Take note of the new image name or tag for use in this article.

> [!NOTE]
> To learn how to build a Dockerfile for Windows workloads, see [Dockerfile on Windows](/virtualization/windowscontainers/manage-docker/manage-windows-dockerfile) and [Optimize Windows Dockerfiles](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile).

## Add a Windows Server 2022 node pool to an existing cluster

- [Add a Windows Server 2022 node pool](./learn/quick-windows-container-deploy-cli.md) to an existing cluster.

## Update the YAML file

Node Selector is the most common and recommended option for placement of Windows pods on Windows nodes.

1. Add Node Selector to your YAML file by adding the following annotation:

    ```yaml
          nodeSelector:
            "kubernetes.io/os": windows
    ```

    The annotation finds any available Windows node and places the pod on that node (following all other scheduling rules). When upgrading from Windows Server 2019 to Windows Server 2022, you need to enforce the placement on a Windows node and a node running the latest OS version. To accomplish this, one option is to use a different annotation:

    ```yaml
          nodeSelector:
            "kubernetes.azure.com/os-sku": Windows2022
    ```

2. Once you update the `nodeSelector` in the YAML file, you also need to update the container image you want to use. You can get this information from the previous step in which you created a new version of the containerized application by changing the `FROM` statement on your Dockerfile.

> [!NOTE]
> You should use the same YAML file you used to initially deploy the application. This ensures that no other configuration changes besides the `nodeSelector` and container image.

## Apply the updated YAML file to the existing workload

1. View the nodes on your cluster using the `kubectl get nodes` command.

    ```bash
    kubectl get nodes -o wide
    ```

    The following example output shows all nodes on the cluster, including the new node pool you created and the existing node pools:

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

2. Apply the updated YAML file to the existing workload using the `kubectl apply` command and specify the name of the YAML file.

    ```bash
    kubectl apply -f <filename>
    ```

    The following example output shows a *configured* status for the deployment:

    ```output
    deployment.apps/sample configured
    service/sample unchanged
    ```

    At this point, AKS starts the process of terminating the existing pods and deploying new pods to the Windows Server 2022 nodes.

3. Check the status of the deployment using the `kubectl get pods` command.

    ```bash
    kubectl get pods -o wide
    ```

    The following example output shows the pods in the `defualt` namespace:

    ```output
    NAME                      READY   STATUS    RESTARTS   AGE     IP             NODE              NOMINATED NODE   READINESS GATES
    sample-7794bfcc4c-k62cq   1/1     Running   0          2m49s   10.240.0.238   akspoolws000000   <none>           <none>
    sample-7794bfcc4c-rswq9   1/1     Running   0          2m49s   10.240.1.10    akspoolws000001   <none>           <none>
    sample-7794bfcc4c-sh78c   1/1     Running   0          2m49s   10.240.0.228   akspoolws000000   <none>           <none>
    ```

## Security and authentication considerations

If you're using Group Managed Service Accounts (gMSA), you need to update the Managed Identity configuration for the new node pool. gMSA uses a secret (user account and password) so the node that runs the Windows pod can authenticate the container against Microsoft Entra ID. To access that secret on Azure Key Vault, the node uses a Managed Identity that allows the node to access the resource. Since Managed Identities are configured per node pool, and the pod now resides on a new node pool, you need to update that configuration. For more information, see [Enable Group Managed Service Accounts (GMSA) for your Windows Server nodes on your Azure Kubernetes Service (AKS) cluster](./use-group-managed-service-accounts.md).

The same principle applies to Managed Identities for any other pod or node pool when accessing other Azure resources. You need to update any access that Managed Identity provides to reflect the new node pool. To view update and sign-in activities, see [How to view Managed Identity activity](../active-directory/managed-identities-azure-resources/how-to-view-managed-identity-activity.md).

## Next steps

In this article, you learned how to upgrade the OS version for Windows workloads on AKS. To learn more about Windows workloads on AKS, see [Deploy a Windows container application on Azure Kubernetes Service (AKS)](./learn/quick-windows-container-deploy-cli.md).

<!-- LINKS - External -->
[aks-release-notes]: https://github.com/Azure/AKS/releases
