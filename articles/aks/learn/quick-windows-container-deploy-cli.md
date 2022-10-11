---
title: Create a Windows Server container on an AKS cluster by using Azure CLI
description: Learn how to quickly create a Kubernetes cluster, deploy an application in a Windows Server container in Azure Kubernetes Service (AKS) using the Azure CLI.
services: container-service
ms.topic: article
ms.custom: event-tier1-build-2022
ms.date: 04/29/2022
#Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy a Windows Server container so that I can see how to run applications running on a Windows Server container using the managed Kubernetes service in Azure.
---

# Create a Windows Server container on an Azure Kubernetes Service (AKS) cluster using the Azure CLI

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this article, you deploy an AKS cluster that runs Windows Server 2019 containers using the Azure CLI. You also deploy an ASP.NET sample application in a Windows Server container to the cluster.

:::image type="content" source="media/quick-windows-container-deploy-cli/asp-net-sample-app.png" alt-text="Screenshot of browsing to ASP.NET sample application.":::

This article assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)](../concepts-clusters-workloads.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.64 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- The identity you're using to create your cluster has the appropriate minimum permissions. For more details on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../concepts-identity.md).

- If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the
[az account](/cli/azure/account) command.

### Limitations

The following limitations apply when you create and manage AKS clusters that support multiple node pools:

* You can't delete the first node pool.

The following additional limitations apply to Windows Server node pools:

* The AKS cluster can have a maximum of 10 node pools.
* The AKS cluster can have a maximum of 100 nodes in each node pool.
* The Windows Server node pool name has a limit of 6 characters.

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're asked to specify a location. This location is where resource group metadata is stored, it is also where your resources run in Azure if you don't specify another region during resource creation. Create a resource group using the [az group create][az-group-create] command.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

> [!NOTE]
> This article uses Bash syntax for the commands in this tutorial.
> If you're using Azure Cloud Shell, ensure that the dropdown in the upper-left of the Cloud Shell window is set to **Bash**.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

The following example output shows the resource group created successfully:

```json
{
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
  "location": "eastus",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": null
}
```

## Create an AKS cluster

To run an AKS cluster that supports node pools for Windows Server containers, your cluster needs to use a network policy that uses [Azure CNI][azure-cni-about] (advanced) network plugin. For more detailed information to help plan out the required subnet ranges and network considerations, see [configure Azure CNI networking][use-advanced-networking]. Use the [az aks create][az-aks-create] command to create an AKS cluster named *myAKSCluster*. This command will create the necessary network resources if they don't exist.

* The cluster is configured with two nodes.
* The `--windows-admin-password` and `--windows-admin-username` parameters set the administrator credentials for any Windows Server nodes on the cluster and must meet [Windows Server password requirements][windows-server-password]. If you don't specify the `--windows-admin-password` parameter, you will be prompted to provide a value.
* The node pool uses `VirtualMachineScaleSets`.

> [!NOTE]
> To ensure your cluster to operate reliably, you should run at least 2 (two) nodes in the default node pool.

Create a username to use as administrator credentials for the Windows Server nodes on your cluster. The following commands prompt you for a username and set it to *WINDOWS_USERNAME* for use in a later command (remember that the commands in this article are entered into a BASH shell).

```azurecli-interactive
echo "Please enter the username to use as administrator credentials for Windows Server nodes on your cluster: " && read WINDOWS_USERNAME
```

Create your cluster ensuring you specify `--windows-admin-username` parameter. The following example command creates a cluster using the value from *WINDOWS_USERNAME* you set in the previous command. Alternatively you can provide a different username directly in the parameter instead of using *WINDOWS_USERNAME*. The following command will also prompt you to create a password for the administrator credentials for the Windows Server nodes on your cluster. Alternatively, you can use the `--windows-admin-password` parameter and specify your own value there.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 2 \
    --enable-addons monitoring \
    --generate-ssh-keys \
    --windows-admin-username $WINDOWS_USERNAME \
    --vm-set-type VirtualMachineScaleSets \
    --network-plugin azure
```

> [!NOTE]
> If you get a password validation error, verify the password you set meets the [Windows Server password requirements][windows-server-password]. If your password meets the requirements, try creating your resource group in another region. Then try creating the cluster with the new resource group.
>
> If you do not specify an administrator username and password when setting `--vm-set-type VirtualMachineScaleSets` and `--network-plugin azure`, the username is set to *azureuser* and the password is set to a random value.
>
> The administrator username can't be changed, but you can change the administrator password your AKS cluster uses for Windows Server nodes using `az aks update`. For more details, see [Windows Server node pools FAQ][win-faq-change-admin-creds].

After a few minutes, the command completes and returns JSON-formatted information about the cluster. Occasionally the cluster can take longer than a few minutes to provision. Allow up to 10 minutes in these cases.

## Add a Windows Server 2019 node pool

By default, an AKS cluster is created with a node pool that can run Linux containers. Use `az aks nodepool add` command to add an additional node pool that can run Windows Server containers alongside the Linux node pool.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --os-type Windows \
    --name npwin \
    --node-count 1
```

The above command creates a new node pool named *npwin* and adds it to the *myAKSCluster*. The above command also uses the default subnet in the default vnet created when running `az aks create`.

## Add a Windows Server 2022 node pool

When creating a Windows node pool, the default operating system will be Windows Server 2019. To use Windows Server 2022 nodes, you will need to specify an OS SKU type of `Windows2022`.

> [!NOTE]
> Windows Server 2022 requires Kubernetes version "1.23.0" or higher.

Use `az aks nodepool add` command to add a Windows Server 2022 node pool:

```azurecli
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --os-type Windows \
    --os-sku Windows2022 \ 
    --name npwin \
    --node-count 1
```

## Optional: Using `containerd` with Windows Server node pools

Beginning in Kubernetes version 1.20 and greater, you can specify `containerd` as the container runtime for Windows Server 2019 node pools.  From Kubernetes 1.23, containerd will be the default container runtime for Windows.

> [!IMPORTANT]
> When using `containerd` with Windows Server 2019 node pools:
> - Both the control plane and Windows Server 2019 node pools must use Kubernetes version 1.20 or greater.
> - When creating or updating a node pool to run Windows Server containers, the default value for `--node-vm-size` is *Standard_D2s_v3* which was minimum recommended size for Windows Server 2019 node pools prior to Kubernetes 1.20. The minimum recommended size for Windows Server 2019 node pools using `containerd` is *Standard_D4s_v3*. When setting the `--node-vm-size` parameter, please check the list of [restricted VM sizes][restricted-vm-sizes].
> - It is highly recommended that you use [taints or labels][aks-taints] with your Windows Server 2019 node pools running `containerd` and tolerations or node selectors with your deployments to guarantee your workloads are scheduled correctly.

### Add a Windows Server node pool with `containerd`

Use the `az aks nodepool add` command to add a node pool that can run Windows Server containers with the `containerd` runtime.

> [!NOTE]
> If you do not specify the *WindowsContainerRuntime=containerd* custom header, the node pool will still use `containerd` as the container runtime by default.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --os-type Windows \
    --name npwcd \
    --node-vm-size Standard_D4s_v3 \
    --kubernetes-version 1.20.5 \
    --aks-custom-headers WindowsContainerRuntime=containerd \
    --node-count 1
```

The above command creates a new Windows Server node pool using `containerd` as the runtime named *npwcd* and adds it to the *myAKSCluster*. The above command also uses the default subnet in the default vnet created when running `az aks create`.

### Upgrade an existing Windows Server node pool to `containerd`

Use the `az aks nodepool upgrade` command to upgrade a specific node pool from Docker to `containerd`.

```azurecli-interactive
az aks nodepool upgrade \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name npwd \
    --kubernetes-version 1.20.7 \
    --aks-custom-headers WindowsContainerRuntime=containerd
```

The above command upgrades a node pool named *npwd* to the `containerd` runtime.

To upgrade all existing node pools in a cluster to use the `containerd` runtime for all Windows Server node pools:

```azurecli-interactive
az aks upgrade \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --kubernetes-version 1.20.7 \
    --aks-custom-headers WindowsContainerRuntime=containerd
```

The above command upgrades all Windows Server node pools in the *myAKSCluster* to use the `containerd` runtime.

> [!NOTE]
> When running the upgrade command, the `--kubernetes-version` specified must be a higher version than the node pool's current version. 

## Connect to the cluster

To manage a Kubernetes cluster, you use [kubectl][kubectl], the Kubernetes command-line client. If you use Azure Cloud Shell, `kubectl` is already installed. To install `kubectl` locally, use the [az aks install-cli][az-aks-install-cli] command:

```azurecli
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

To verify the connection to your cluster, use the [kubectl get][kubectl-get] command to return a list of the cluster nodes.

```console
kubectl get nodes -o wide
```

The following example output shows all nodes in the cluster. Make sure that the status of all nodes is *Ready*:

```output
NAME                                STATUS   ROLES   AGE    VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION     CONTAINER-RUNTIME
aks-nodepool1-12345678-vmss000000   Ready    agent   34m    v1.20.7   10.240.0.4    <none>        Ubuntu 18.04.5 LTS               5.4.0-1046-azure   containerd://1.4.4+azure
aks-nodepool1-12345678-vmss000001   Ready    agent   34m    v1.20.7   10.240.0.35   <none>        Ubuntu 18.04.5 LTS               5.4.0-1046-azure   containerd://1.4.4+azure
aksnpwcd123456                      Ready    agent   9m6s   v1.20.7   10.240.0.97   <none>        Windows Server 2019 Datacenter   10.0.17763.1879    containerd://1.4.4+unknown
aksnpwin987654                      Ready    agent   25m    v1.20.7   10.240.0.66   <none>        Windows Server 2019 Datacenter   10.0.17763.1879    docker://19.3.14
```

> [!NOTE]
> The container runtime for each node pool is shown under *CONTAINER-RUNTIME*. Notice *aksnpwin987654* begins with `docker://` which means it is using Docker for the container runtime. Notice *aksnpwcd123456* begins with `containerd://` which means it is using `containerd` for the container runtime.

## Deploy the application

A Kubernetes manifest file defines a desired state for the cluster, such as what container images to run. In this article, a manifest is used to create all objects needed to run the ASP.NET sample application in a Windows Server container. This manifest includes a [Kubernetes deployment][kubernetes-deployment] for the ASP.NET sample application and an external [Kubernetes service][kubernetes-service] to access the application from the internet.

The ASP.NET sample application is provided as part of the [.NET Framework Samples][dotnet-samples] and runs in a Windows Server container. AKS requires Windows Server containers to be based on images of *Windows Server 2019* or greater. The Kubernetes manifest file must also define a [node selector][node-selector] to tell your AKS cluster to run your ASP.NET sample application's pod on a node that can run Windows Server containers.

Create a file named `sample.yaml` and copy in the following YAML definition. If you use the Azure Cloud Shell, this file can be created using `code`, `vi`, or `nano` as if working on a virtual or physical system:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample
  labels:
    app: sample
spec:
  replicas: 1
  template:
    metadata:
      name: sample
      labels:
        app: sample
    spec:
      nodeSelector:
        "kubernetes.io/os": windows
      containers:
      - name: sample
        image: mcr.microsoft.com/dotnet/framework/samples:aspnetapp
        resources:
          limits:
            cpu: 1
            memory: 800M
        ports:
          - containerPort: 80
  selector:
    matchLabels:
      app: sample
---
apiVersion: v1
kind: Service
metadata:
  name: sample
spec:
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
  selector:
    app: sample
```

Deploy the application using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```console
kubectl apply -f sample.yaml
```

The following example output shows the Deployment and Service created successfully:

```output
deployment.apps/sample created
service/sample created
```

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete. Occasionally the service can take longer than a few minutes to provision. Allow up to 10 minutes in these cases.

To monitor progress, use the [kubectl get service][kubectl-get] command with the `--watch` argument.

```console
kubectl get service sample --watch
```

Initially the *EXTERNAL-IP* for the *sample* service is shown as *pending*.

```output
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
sample             LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

When the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

```output
sample  LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
```

To see the sample app in action, open a web browser to the external IP address of your service.

:::image type="content" source="media/quick-windows-container-deploy-cli/asp-net-sample-app.png" alt-text="Screenshot of browsing to ASP.NET sample application.":::

> [!Note]
> If you receive a connection timeout when trying to load the page then you should verify the sample app is ready with the following command [kubectl get pods --watch]. Sometimes the Windows container will not be started by the time your external IP address is available.

## Delete cluster

To avoid Azure charges, if you don't plan on going through the tutorials that follow, use the [az group delete][az-group-delete] command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

> [!NOTE]
> The AKS cluster was created with system-assigned managed identity (default identity option used in this quickstart), the identity is managed by the platform and does not require removal.

## Next steps

In this article, you deployed a Kubernetes cluster and deployed an ASP.NET sample application in a Windows Server container to it.

To learn more about AKS, and walk through a complete code to deployment example, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[node-selector]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[dotnet-samples]: https://hub.docker.com/_/microsoft-dotnet-framework-samples/
[azure-cni]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md

<!-- LINKS - internal -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[aks-monitor]: ../../azure-monitor/containers/container-insights-onboard.md
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[aks-taints]:  ../use-multiple-node-pools.md#specify-a-taint-label-or-tag-for-a-node-pool
[az-aks-browse]: /cli/azure/aks#az_aks_browse
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[az-provider-register]: /cli/azure/provider#az_provider_register
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-cni-about]: ../concepts-network.md#azure-cni-advanced-networking
[sp-delete]: ../kubernetes-service-principal.md#additional-considerations
[azure-portal]: https://portal.azure.com
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[kubernetes-service]: ../concepts-network.md#services
[restricted-vm-sizes]: ../quotas-skus-regions.md#restricted-vm-sizes
[use-advanced-networking]: ../configure-azure-cni.md
[aks-support-policies]: ../support-policies.md
[aks-faq]: faq.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[windows-server-password]: /windows/security/threat-protection/security-policy-settings/password-must-meet-complexity-requirements#reference
[win-faq-change-admin-creds]: ../windows-faq.md#how-do-i-change-the-administrator-password-for-windows-server-nodes-on-my-cluster
