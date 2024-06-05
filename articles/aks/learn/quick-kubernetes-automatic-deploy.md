---
title: 'Quickstart: Deploy an Azure Kubernetes Service (AKS) Automatic cluster (preview)'
description: Learn how to quickly deploy a Kubernetes cluster and deploy an application in Azure Kubernetes Service (AKS) Automatic (preview).
ms.topic: quickstart
ms.custom: build-2024
ms.date: 05/21/2024
author: sabbour
ms.author: asabbour
zone_pivot_groups: bicep-azure-cli-portal

---

# Quickstart: Deploy an Azure Kubernetes Service (AKS) Automatic cluster (preview)

**Applies to:** :heavy_check_mark: AKS Automatic (preview)

[Azure Kubernetes Service (AKS) Automatic (preview)][what-is-aks-automatic] provides the easiest managed Kubernetes experience for developers, DevOps engineers, and platform engineers. Ideal for modern and AI applications, AKS Automatic automates AKS cluster setup and operations and embeds best practice configurations. Users of any skill level can benefit from the security, performance, and dependability of AKS Automatic for their applications. 

In this quickstart, you learn to:

- Deploy an AKS Automatic cluster.
- Run a sample multi-container application with a group of microservices and web front ends simulating a retail scenario.


## Before you begin

This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.57.0 or later of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed there.
- This article requires the `aks-preview` Azure CLI extension version **3.0.0b13** or later.
- If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the [az account set](/cli/azure/account#az-account-set) command.
- Register the `AutomaticSKUPreview` feature in your Azure subscription.
- The identity creating the cluster should also have the [following permissions on the subscription][Azure-Policy-RBAC-permissions]:

    - `Microsoft.Authorization/policyAssignments/write`
    - `Microsoft.Authorization/policyAssignments/read`
> [!IMPORTANT]
> Make sure your subscription has quota for 24 vCPUs of the [Standard_DS4_v2](/azure/virtual-machines/dv2-dsv2-series) virtual machine for the region you're deploying the cluster to. You can [view quotas for specific VM-families and submit quota increase requests](/azure/quotas/per-vm-quota-requests) through the Azure portal.
.png
:::zone target="docs" pivot="bicep"
- To deploy a Bicep file, you need to write access on the resources you create and access to all operations on the `Microsoft.Resources/deployments` resource type. For example, to create a virtual machine, you need `Microsoft.Compute/virtualMachines/write` and `Microsoft.Resources/deployments/*` permissions. For a list of roles and permissions, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).
:::zone-end

### Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](../includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

### Register the feature flags

To use AKS Automatic in preview, you must register feature flags for other required features. Register the following flags using the [az feature register][az-feature-register] command.

```azurecli-interactive
az feature register --namespace Microsoft.ContainerService --name EnableAPIServerVnetIntegrationPreview
az feature register --namespace Microsoft.ContainerService --name NRGLockdownPreview
az feature register --namespace Microsoft.ContainerService --name SafeguardsPreview
az feature register --namespace Microsoft.ContainerService --name NodeAutoProvisioningPreview
az feature register --namespace Microsoft.ContainerService --name DisableSSHPreview
az feature register --namespace Microsoft.ContainerService --name AutomaticSKUPreview
```

Verify the registration status by using the [az feature show][az-feature-show] command. It takes a few minutes for the status to show *Registered*:

```azurecli-interactive
az feature show --namespace Microsoft.ContainerService --name AutomaticSKUPreview
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

:::zone target="docs" pivot="azure-cli"

## Create a resource group

An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

Create a resource group using the [az group create][az-group-create] command.

```azurecli
az group create --name myResourceGroup --location eastus
```

The following sample output resembles successful creation of the resource group:

```output
{
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
  "location": "eastus",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Create an AKS Automatic cluster

To create an AKS Automatic cluster, use the [az aks create][az-aks-create] command. The following example creates a cluster named *myAKSAutomaticCluster* with Managed Prometheus and Container Insights integration enabled.

```azurecli
az aks create \
  --resource-group myResourceGroup \
  --name myAKSAutomaticCluster \
  --sku automatic
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Connect to the cluster

To manage a Kubernetes cluster, use the Kubernetes command-line client, [kubectl][kubectl]. `kubectl` is already installed if you use Azure Cloud Shell. To install `kubectl` locally, run the [az aks install-cli][az-aks-install-cli] command. AKS Automatic clusters are configured with [Microsoft Entra ID for Kubernetes role-based access control (RBAC)][aks-entra-rbac]. When you create a cluster using the Azure CLI, your user is [assigned built-in roles][aks-entra-rbac-builtin-roles] for `Azure Kubernetes Service RBAC Cluster Admin`.

Configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli
az aks get-credentials --resource-group myResourceGroup --name myAKSAutomaticCluster
```

Verify the connection to your cluster using the [kubectl get][kubectl-get] command. This command returns a list of the cluster nodes.

```bash
kubectl get nodes
```

The following sample output will show how you're asked to log in.

```output
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code AAAAAAAAA to authenticate.
```

After you log in, the following sample output shows the managed node pools created in the previous steps. Make sure the node status is *Ready*.

```output
NAME                                STATUS   ROLES   AGE     VERSION
aks-default-f8vj2                   Ready    agent   2m26s   v1.28.5
aks-nodepool1-13213685-vmss000000   Ready    agent   2m26s   v1.28.5
aks-nodepool1-13213685-vmss000001   Ready    agent   2m26s   v1.28.5
aks-nodepool1-13213685-vmss000002   Ready    agent   2m26s   v1.28.5
```

:::zone-end

:::zone target="docs" pivot="azure-portal"

## Create Automatic Kubernetes Cluster

1. To create an AKS Automatic cluster, search for **Kubernetes Services**, and select **Automatic Kubernetes cluster** from the drop-down options.

    :::image type="content" source="./media/quick-automatic-kubernetes-portal/browse-dropdown-options.png" alt-text="The screenshot of the entry point for creating an AKS Automatic cluster in the Azure portal.":::

2. On the **Basics** tab, fill in all the mandatory fields required to get started: 
Subscription, Resource Group, Cluster name, and Region

    :::image type="content" source="./media/quick-automatic-kubernetes-portal/create-basics.png" alt-text="The screenshot of the Create - Basics Tab for an AKS Automatic cluster in the Azure portal.":::

    If the prerequisites aren't met and the subscription requires registration of the preview flags, there will be an error shown under the Subscription field: 

    :::image type="content" source="./media/quick-automatic-kubernetes-portal/register.png" alt-text="The screenshot of the error shown when a  subscription doesn't have preview flags registered while creating an AKS Automatic cluster in the Azure portal.":::


3. On the **Monitoring** tab, choose your monitoring configurations from Azure Monitor, Managed Prometheus, Managed Grafana, and/or configure alerts. Add tags (optional), and proceed to create the cluster. 

    :::image type="content" source="./media/quick-automatic-kubernetes-portal/create-monitoring.png" alt-text="The screenshot of the Monitoring Tab while creating an AKS Automatic cluster in the Azure portal.":::

3. Get started with configuring your first application from GitHub and set up an automated deployment pipeline. 

    :::image type="content" source="./media/quick-automatic-kubernetes-portal/automatic-overview.png" alt-text="The screenshot of the Get Started Tab on Overview Blade after creating an AKS Automatic cluster in the Azure portal.":::


## Connect to the cluster

To manage a Kubernetes cluster, use the Kubernetes command-line client, [kubectl][kubectl]. `kubectl` is already installed if you use Azure Cloud Shell. To install `kubectl` locally, run the [az aks install-cli][az-aks-install-cli] command. AKS Automatic clusters are configured with [Microsoft Entra ID for Kubernetes role-based access control (RBAC)][aks-entra-rbac]. When you create a cluster using the Azure portal, your user is [assigned built-in roles][aks-entra-rbac-builtin-roles] for `Azure Kubernetes Service RBAC Cluster Admin`. 

Configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli
az aks get-credentials --resource-group myResourceGroup --name myAKSAutomaticCluster
```

Verify the connection to your cluster using the [kubectl get][kubectl-get] command. This command returns a list of the cluster nodes.

```bash
kubectl get nodes
```

The following sample output will show how you're asked to log in.

```output
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code AAAAAAAAA to authenticate.
```

After you log in, the following sample output shows the managed node pools created in the previous steps. Make sure the node status is *Ready*.

```output
NAME                                STATUS   ROLES   AGE     VERSION
aks-default-f8vj2                   Ready    agent   2m26s   v1.28.5
aks-nodepool1-13213685-vmss000000   Ready    agent   2m26s   v1.28.5
aks-nodepool1-13213685-vmss000001   Ready    agent   2m26s   v1.28.5
aks-nodepool1-13213685-vmss000002   Ready    agent   2m26s   v1.28.5
```
:::zone-end

:::zone target="docs" pivot="bicep"

## Create a resource group

An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

Create a resource group using the [az group create][az-group-create] command.

```azurecli
az group create --name myResourceGroup --location eastus
```

The following sample output resembles successful creation of the resource group:

```output
{
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
  "location": "eastus",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Review the Bicep file

This Bicep file defines an AKS Automatic cluster. While in preview, you need to specify the *system nodepool* agent pool profile.

```bicep
@description('The name of the managed cluster resource.')
param clusterName string = 'myAKSAutomaticCluster'

@description('The location of the managed cluster resource.')
param location string = resourceGroup().location

resource aks 'Microsoft.ContainerService/managedClusters@2024-03-02-preview' = {
  name: clusterName
  location: location  
  sku: {
		name: 'Automatic'
  		tier: 'Standard'
  }
  properties: {
    agentPoolProfiles: [
      {
        name: 'systempool'
        count: 3
        vmSize: 'Standard_DS4_v2'
        osType: 'Linux'
        mode: 'System'
      }
    ]
  }
  identity: {
    type: 'SystemAssigned'
  }
}
```

For more information about the resource defined in the Bicep file, see the [**Microsoft.ContainerService/managedClusters**](/azure/templates/microsoft.containerservice/managedclusters?tabs=bicep&pivots=deployment-language-bicep) reference.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.

    > [!IMPORTANT]
    > The Bicep file sets the `clusterName` param to the string *myAKSAutomaticCluster*. If you want to use a different cluster name, make sure to update the string to your preferred cluster name before saving the file to your computer.

1. Deploy the Bicep file using the Azure CLI.

      ```azurecli
    az deployment group create --resource-group myResourceGroup --template-file main.bicep
    ```

    It takes a few minutes to create the AKS cluster. Wait for the cluster to be successfully deployed before you move on to the next step.

## Connect to the cluster

To manage a Kubernetes cluster, use the Kubernetes command-line client, [kubectl][kubectl]. `kubectl` is already installed if you use Azure Cloud Shell. To install `kubectl` locally, run the [az aks install-cli][az-aks-install-cli] command. AKS Automatic clusters are configured with [Microsoft Entra ID for Kubernetes role-based access control (RBAC)][aks-entra-rbac]. When you create a cluster using Bicep, you need to [assign one of the built-in roles][aks-entra-rbac-builtin-roles] such as `Azure Kubernetes Service RBAC Reader`, `Azure Kubernetes Service RBAC Writer`, `Azure Kubernetes Service RBAC Admin`, or `Azure Kubernetes Service RBAC Cluster Admin` to your users, scoped to the cluster or a specific namespace. Also make sure your users have the `Azure Kubernetes Service Cluster User` built-in role to be able to do run `az aks get-credentials`, and then get the kubeconfig of your AKS cluster using the `az aks get-credentials` command.

Configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials][az-aks-get-credentials] command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli
az aks get-credentials --resource-group myResourceGroup --name
```

Verify the connection to your cluster using the [kubectl get][kubectl-get] command. This command returns a list of the cluster nodes.

```bash
kubectl get nodes
```

The following sample output will show how you're asked to log in.

```output
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code AAAAAAAAA to authenticate.
```

After you log in, the following sample output shows the managed node pools created in the previous steps. Make sure the node status is *Ready*.

```output
NAME                                STATUS   ROLES   AGE     VERSION
aks-default-f8vj2                   Ready    agent   2m26s   v1.28.5
aks-nodepool1-13213685-vmss000000   Ready    agent   2m26s   v1.28.5
aks-nodepool1-13213685-vmss000001   Ready    agent   2m26s   v1.28.5
aks-nodepool1-13213685-vmss000002   Ready    agent   2m26s   v1.28.5
```

:::zone-end


## Deploy the application

To deploy the application, you use a manifest file to create all the objects required to run the [AKS Store application](https://github.com/Azure-Samples/aks-store-demo). A [Kubernetes manifest file][kubernetes-deployment] defines a cluster's desired state, such as which container images to run. The manifest includes the following Kubernetes deployments and services:

:::image type="content" source="media/quick-kubernetes-deploy-portal/aks-store-architecture.png" alt-text="Screenshot of Azure Store sample architecture." lightbox="media/quick-kubernetes-deploy-portal/aks-store-architecture.png":::

- **Store front**: Web application for customers to view products and place orders.
- **Product service**: Shows product information.
- **Order service**: Places orders.
- **Rabbit MQ**: Message queue for an order queue.

> [!NOTE]
> We don't recommend running stateful containers, such as Rabbit MQ, without persistent storage for production. These are used here for simplicity, but we recommend using managed services, such as Azure Cosmos DB or Azure Service Bus.

1. Create a namespace `aks-store-demo` to deploy the Kubernetes resources into.

    ```bash
    kubectl create ns aks-store-demo
    ```

1. Deploy the application using the [kubectl apply][kubectl-apply] command into the `aks-store-demo` namespace. The YAML file defining the deployment is on [GitHub](https://github.com/Azure-Samples/aks-store-demo).

    ```bash
    kubectl apply -n aks-store-demo -f https://raw.githubusercontent.com/Azure-Samples/aks-store-demo/main/aks-store-ingress-quickstart.yaml
    ```

    The following sample output shows the deployments and services:

    ```output
    statefulset.apps/rabbitmq created
    configmap/rabbitmq-enabled-plugins created
    service/rabbitmq created
    deployment.apps/order-service created
    service/order-service created
    deployment.apps/product-service created
    service/product-service created
    deployment.apps/store-front created
    service/store-front created
    ingress/store-front created
    ```

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

1. Check the status of the deployed pods using the [kubectl get pods][kubectl-get] command. Make sure all pods are `Running` before proceeding. If this is the first workload you deploy, it may take a few minutes for [node auto provisioning][node-auto-provisioning] to create a node pool to run the pods.

    ```bash
    kubectl get pods -n aks-store-demo
    ```

1. Check for a public IP address for the store-front application. Monitor progress using the [kubectl get service][kubectl-get] command with the `--watch` argument.

    ```bash
    kubectl get ingress store-front -n aks-store-demo --watch
    ```

    The **ADDRESS** output for the `store-front` service initially shows empty:

    ```output
    NAME          CLASS                                HOSTS   ADDRESS        PORTS   AGE
    store-front   webapprouting.kubernetes.azure.com   *                      80      12m
    ```

1. Once the **ADDRESS** changes from blank to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process.

    The following sample output shows a valid public IP address assigned to the service:

    ```output
    NAME          CLASS                                HOSTS   ADDRESS        PORTS   AGE
    store-front   webapprouting.kubernetes.azure.com   *       4.255.22.196   80      12m
    ```

1. Open a web browser to the external IP address of your ingress to see the Azure Store app in action.

    :::image type="content" source="media/quick-kubernetes-deploy-cli/aks-store-application.png" alt-text="Screenshot of AKS Store sample application." lightbox="media/quick-kubernetes-deploy-cli/aks-store-application.png":::

## Delete the cluster

If you don't plan on going through the [AKS tutorial][aks-tutorial], clean up unnecessary resources to avoid Azure charges. Run the [az group delete][az-group-delete] command to remove the resource group, container service, and all related resources.

  ```azurecli
  az group delete --name myResourceGroup --yes --no-wait
  ```
  > [!NOTE]
  > The AKS cluster was created with a system-assigned managed identity, which is the default identity option used in this quickstart. The platform manages this identity, so you don't need to manually remove it.

## Next steps

In this quickstart, you deployed a Kubernetes cluster using [AKS Automatic][what-is-aks-automatic] and then deployed a simple multi-container application to it. This sample application is for demo purposes only and doesn't represent all the best practices for Kubernetes applications. For guidance on creating full solutions with AKS for production, see [AKS solution guidance][aks-solution-guidance].

To learn more about AKS Automatic, continue to the introduction.

> [!div class="nextstepaction"]
> [Introduction to Azure Kubernetes Service (AKS) Automatic (preview)][what-is-aks-automatic]


<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[azure-resource-group]: ../../azure-resource-manager/management/overview.md
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[node-auto-provisioning]: ../node-autoprovision.md
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here?toc=/azure/aks/toc.json&bc=/azure/aks/breadcrumb/toc.json
[baseline-reference-architecture]: /azure/architecture/reference-architectures/containers/aks/baseline-aks?toc=/azure/aks/toc.json&bc=/azure/aks/breadcrumb/toc.json
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az_feature_show
[az-provider-register]: /cli/azure/provider#az_provider_register
[what-is-aks-automatic]: ../intro-aks-automatic.md
[Azure-Policy-RBAC-permissions]: /azure/governance/policy/overview#azure-rbac-permissions-in-azure-policy
[aks-entra-rbac]: /azure/aks/manage-azure-rbac
[aks-entra-rbac-builtin-roles]: /azure/aks/manage-azure-rbac#create-role-assignments-for-users-to-access-the-cluster
