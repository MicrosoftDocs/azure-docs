---
title: "Deploy and manage applications from Azure Marketplace on Azure Arc-enabled Kubernetes clusters"
ms.date: 01/26/2024
ms.custom: references-regions, devx-track-azurecli
ms.topic: how-to
description: "Learn how to discover Kubernetes applications in Azure Marketplace and deploy them to your Arc-enabled Kubernetes clusters."
---

# Deploy and manage applications from Azure Marketplace on Azure Arc-enabled Kubernetes clusters

[Azure Marketplace](/marketplace/azure-marketplace-overview) is an online store that contains thousands of IT software applications and services built by industry-leading technology companies. In Azure Marketplace, you can find, try, buy, and deploy the software and services that you need to build new solutions and manage your cloud infrastructure. The catalog includes solutions for different industries and technical areas, free trials, and consulting services from Microsoft partners.

Included among these solutions are Kubernetes application-based container offers. These offers contain applications that can run on Azure Arc-enabled Kubernetes clusters, represented as [cluster extensions](conceptual-extensions.md). Deploying an offer from Azure Marketplace creates a new instance of the extension on your Arc-enabled Kubernetes cluster.

This article shows you how to:

- Discover applications that support Azure Arc-enabled Kubernetes clusters.
- Purchase an application.
- Deploy the application on your cluster.
- Monitor usage and billing information.

You can use Azure CLI or the Azure portal to perform these tasks.

## Prerequisites

To deploy an application, you must have an existing Azure Arc-enabled Kubernetes connected cluster, with at least one node of operating system and architecture type `linux/amd64`. If you haven't connected a cluster yet, use our [quickstart](quickstart-connect-cluster.md). Be sure to [upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to the latest version before you get started.

- An existing Azure Arc-enabled Kubernetes connected cluster, with at least one node of operating system and architecture type `linux/amd64`. If deploying [Flux (GitOps)](extensions-release.md#flux-gitops), you can use an ARM64-based cluster without a `linux/amd64` node.
  - If you haven't connected a cluster yet, use our [quickstart](quickstart-connect-cluster.md).
  - [Upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to the latest version.
- If using Azure CLI to review, deploy, and manage Azure Marketplace applications:
  - The latest version of [Azure CLI](/cli/azure/install-azure-cli).
  - The latest version of the  `k8s-extension` Azure CLI extension. Install the extension by running `az extension add --name k8s-extension`. If the `k8s-extension` extension is already installed, make sure it's updated to the latest version by running `az extension update --name k8s-extension`.

> [!NOTE]
> This feature is currently supported only in the following regions:
>
>- East US, East US2, EastUS2 EUAP, West US, West US2, Central US, West Central US, South Central US, West Europe, North Europe, Canada Central, South East Asia, Australia East, Central India, Japan East, Korea Central, UK South, UK West, Germany West Central, France Central, East Asia, West US3, Norway East, South African North, North Central US, Australia South East, Switzerland North, Japan West, South India

## Discover Kubernetes applications that supports Azure Arc-enabled clusters

### [Azure portal](#tab/azure-portal)

To discover Kubernetes applications in the Azure Marketplace from within the Azure portal:

1. In the Azure portal, search for **Marketplace**. In the results, under **Services**, select **Marketplace**.
1. From **Marketplace**, you can search for an offer or publisher directly by name, or you can browse all offers. To find Kubernetes application offers, select **Containers** from the **Categories** section in the left menu.

   > [!IMPORTANT]
   > The **Containers** category includes both Kubernetes applications and standalone container images. Be sure to select only Kubernetes application offers when following these steps. Container images have a different deployment process, and generally can't be deployed on Arc-enabled Kubernetes clusters.

   :::image type="content" source="media/deploy-marketplace/marketplace-containers.png" alt-text="Screenshot of Azure Marketplace showing the Containers menu item." lightbox="media/deploy-marketplace/marketplace-containers.png":::

1. You'll see several Kubernetes application offers displayed on the page. To view all of the Kubernetes application offers, select **See more**.

   :::image type="content" source="media/deploy-marketplace/marketplace-see-more.png" alt-text="Screenshot showing the See more link for the Containers category in Azure Marketplace." lightbox="media/deploy-marketplace/marketplace-see-more.png":::

1. Alternately, you can search for a specific `publisherId` to view that publisher's Kubernetes applications in Azure Marketplace. For details on how to find publisher IDs, see the Azure CLI tab for this article.

   :::image type="content" source="media/deploy-marketplace/marketplace-search-by-publisher.png" alt-text="Screenshot showing the option to search by publisher in Azure Marketplace." lightbox="media/deploy-marketplace/marketplace-search-by-publisher.png":::

Once you find an application that you want to deploy, move on to the next section.

### [Azure CLI](#tab/azure-cli)

You can use Azure CLI to get a list of extensions, including Azure Marketplace applications, that can be deployed on Azure Arc-enabled connected clusters. To do so, run this command, providing the name of your connected cluster and the resource group where the cluster is located.

```azurecli-interactive
az k8s-extension extension-types list-by-cluster --cluster-type connectedClusters --cluster-name <clusterName> --resource-group <resourceGroupName>
```

The command will return a list of extension types that can be deployed on the connected clusters, similar to the example shown here.

```json
"id": "/subscriptions/{sub}/resourceGroups/{rg} /providers/Microsoft.Kubernetes/connectedClusters/{clustername} /providers/Microsoft.KubernetesConfiguration/extensiontypes/contoso",
"name": "contoso",
"type": "Microsoft.KubernetesConfiguration/extensionTypes",
"properties": {
    "extensionType": "contoso",
    "description": "Contoso extension",
    "isSystemExtension": false,
    "publisher": "contoso",
    "isManagedIdentityRequired": false,
    "supportedClusterTypes": [
        "managedclusters",
        "connectedclusters"
    ],
    "supportedScopes": {
        "defaultScope": "namespace",
        "clusterScopeSettings": {
            "allowMultipleInstances": false,
            "defaultReleaseNamespace": null
        }
    },
    "planInfo": {
        "offerId": "contosoOffer",
        "planId": "contosoPlan",
        "publisherId": "contoso"
    }
}
```

When you find an application that you want to deploy, note the following values from the response received: `planId`, `publisherId`, `offerID`, and `extensionType`. You'll need these values to accept the application's terms and deploy the application.

---

## Deploy a Kubernetes application

### [Azure portal](#tab/azure-portal)

Once you've identified an offer you want to deploy, follow these steps:

1. In the **Plans + Pricing** tab, review the options. If there are multiple plans available, find the one that meets your needs. Review the terms on the page to make sure they're acceptable, and then select **Create**.

   :::image type="content" source="media/deploy-marketplace/marketplace-plans-pricing.png" alt-text="Screenshot of the Plans + Pricing page for a Kubernetes offer in Azure Marketplace." lightbox="media/deploy-marketplace/marketplace-plans-pricing.png":::

1. Select the resource group and Arc-enabled cluster to which you want to deploy the application.

   :::image type="content" source="media/deploy-marketplace/marketplace-select-cluster.png" alt-text="Screenshot showing the option to select a resource group and cluster for the Marketplace offer.":::

1. Complete all pages of the deployment wizard to specify all configuration options that the application requires.

   :::image type="content" source="media/deploy-marketplace/marketplace-configuration.png" alt-text="Screenshot showing configuration options for an Azure Marketplace offer.":::

1. When you're finished, select **Review + Create**, then select **Create** to deploy the offer.

### [Azure CLI](#tab/azure-cli)

#### Accept terms and agreements

Before you can deploy a Kubernetes application, you need to accept its terms and agreements. Be sure to read these terms carefully so that you understand costs and any other requirements.

To view the details of the terms, run the following command, providing the values for `offerID`, `planID`, and `publisherID`:

```azurecli-interactive
az vm image terms show --offer <offerID> --plan <planId> --publisher <publisherId>
```

To accept the terms, run the following command, using the same values for `offerID`, `planID`, and `publisherID`.

```azurecli-interactive
az vm image terms accept --offer <offerID> --plan <planId> --publisher <publisherId>
```

> [!NOTE]
> Although this command is for VMs, it also works for containers, including Arc-enabled Kubernetes clusters. For more information, see the [az vm image terms](/cli/azure/vm/image/terms) reference.

#### Deploy the application

To deploy the application (extension) through Azure CLI, follow the steps outlined in [Deploy and manage Azure Arc-enabled Kubernetes cluster extensions](extensions.md). An example command might look like this:

```azurecli-interactive
az k8s-extension create --name <offerID> --extension-type <extensionType> --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters --plan-name <planId> --plan-product <offerID> --plan-publisher <publisherId>  
```

---

## Verify the deployment

Deploying an offer from Azure Marketplace creates a new extension instance on your Arc-enabled Kubernetes cluster. You can verify that the deployment was successful by confirming the extension is running successfully.

### [Azure portal](#tab/azure-portal)

Verify the deployment navigating to the cluster you recently installed the extension on, then navigate to **Extensions**, where you'll see the extension status.

:::image type="content" source="media/deploy-marketplace/extension-status.png" alt-text="Screenshot showing the status of deployed extensions in the Azure portal." lightbox="media/deploy-marketplace/extension-status.png":::

If the deployment was successful, the **Status** will be **Succeeded**. If the status is **Creating**, the deployment is still in progress. Wait a few minutes then check again.

If the deployment fails, see [Troubleshoot the failed deployment of a Kubernetes application offer](/troubleshoot/azure/azure-kubernetes/troubleshoot-failed-kubernetes-deployment-offer).

### [Azure CLI](#tab/azure-cli)

Verify the deployment by using the following command to list the extensions that are already running or being deployed on your cluster:

```azurecli-interactive
az k8s-extension list --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

If the deployment was successful, `provisioningState` is `Succeeded`. If `provisioningState` is `Creating`, the deployment is still in progress. Wait a few minutes then check again.

If the deployment fails, see [Troubleshoot the failed deployment of a Kubernetes application offer](/troubleshoot/azure/azure-kubernetes/troubleshoot-failed-kubernetes-deployment-offer).

To view the extension instance from the cluster, run the following command:

```azurecli-interactive
az k8s-extension show --name <extension-name> --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

---

## Monitor billing and usage information

You can monitor billing and usage information for a deployed extension in the Azure portal.

1. In the Azure portal, navigate to your cluster's resource group.

1. Select **Cost Management** > **Cost analysis**. Under **Product**, you can see a cost breakdown for the plan that you selected.

   :::image type="content" source="media/deploy-marketplace/extension-cost-analysis.png" alt-text="Screenshot of the Azure portal page for a resource group, with billing information broken down by offer plan." lightbox="media/deploy-marketplace/extension-cost-analysis.png":::

## Remove an application

You can delete a purchased plan for a Kubernetes offer by deleting the extension instance on the cluster.

### [Azure portal](#tab/azure-portal)

To delete the extension instance in the Azure portal, select **Extensions** within your cluster. Select the application you want to remove, then select **Uninstall**.

:::image type="content" source="media/deploy-marketplace/extension-delete.png" alt-text="Screenshot of the Extensions page for a cluster, showing the option to delete an extension." lightbox="media/deploy-marketplace/extension-delete.png":::

### [Azure CLI](#tab/azure-cli)

The following command deletes an extension from the cluster:

```azurecli-interactive
az k8s-extension delete --name <extension-name> --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

---

## Troubleshooting

For help with resolving issues, see [Troubleshoot the failed deployment of a Kubernetes application offer](/troubleshoot/azure/azure-kubernetes/troubleshoot-failed-kubernetes-deployment-offer).

## Next steps

- Learn about [extensions for Arc-enabled Kubernetes](conceptual-extensions.md).
- Use our quickstart to [connect a Kubernetes cluster to Azure Arc](quickstart-connect-cluster.md).
