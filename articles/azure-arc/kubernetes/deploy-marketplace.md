---
title: "Deploy and manage applications from Azure Marketplace on Azure Arc-enabled Kubernetes clusters"
ms.date: 01/22/2024
ms.custom: references-regions
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

## Use Azure CLI to deploy Kubernetes applications from Azure Marketplace

### Discover Kubernetes applications that supports Azure Arc-enabled clusters

You can use Azure CLI to get a list of extensions, including Azure Marketplace applications, that can be deployed on Azure Arc-enabled connected clusters. To do so, run this command, providing the name of your connected cluster and the resource group where the cluster is located.

```azurecli-interactive
az k8s-extension extension-types list-by-cluster --cluster-type connectedClusters --cluster-name <clusterName> --resource-group <resourceGroupName>
```

The command will return a list of extension types that can be deployed on the connected clusters, similar to the example shown here. When you find the application you want to deploy, note the extension type name, and planInfo from the response to used in later steps.

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

For the application that you want to deploy, note the following values from the response received: `planId`, `publisherId`, `offerID`, and `extensionType`.

### Accept terms and agreements

Before you can deploy a Kubernetes application, you need to accept its terms and agreements. Be sure to read these terms carefully so that you understand costs and any other requirements.

To view the details of the terms, run the following command, providing the values for `offerID`, `planID`, and `publisherID`:

```azurecli-interactive
az vm image terms show --offer <offerID> --plan <planId> --publisher <publisherId>
```

To accept the terms, run the following command, using the same valuesfor `offerID`, `planID`, and `publisherID`.

```azurecli-interactive
az vm image terms accept --offer <offerID> --plan <planId> --publisher <publisherId>
```

> [!NOTE]
> Although this command is for VMs, it also works for containers, including Arc-enabled Kubernetes clusters. For more information, see the [az cm image terms](/cli/azure/vm/image/terms?view=azure-cli-latest) reference.

### Deploy the application

To deploy the application (extension) through Azure CLI, follow the steps outlined in Deploy and manage Azure Arc-enabled Kubernetes cluster extensions.
Sample command:

```azurecli-interactive
az k8s-extension create --name <offerID> --extension-type <extensionType> --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters --plan-name <planId> --plan-product <offerID> --plan-publisher <publisherId>  
```

## Discover and deploy a Kubernetes application in the Azure portal

1. In the Azure portal, search for Marketplace on the top search bar. In the results, under Services, select Marketplace.
1. You can search for an offer or publisher directly by name, or you can browse all offers. To find Kubernetes application offers, on the left side under Categories select Containers.
1. You'll see several Kubernetes application offers displayed on the page. To view all of the Kubernetes application offers, select See more.
1. Search for the applications using the ‘publisherId’ or the ‘extensionType’ that was identified earlier as part of discovering applications that support connected clusters.
1. The offer may contain one more plans. On the Plans + Pricing tab, select an option. Ensure that the terms are acceptable, and then select Create.
1. Follow each page in the wizard, all the way through Review + Create. Fill in information for your resource group, your cluster, and any configuration options that the application requires. You can decide to deploy on a new AKS cluster or use an existing cluster.
Select the Arc-enabled Kubernetes cluster:

## Verify the deployment

Deploying an offer from Azure Marketplace creates a new extension instance on your Arc-enabled Kubernetes cluster. You can verify that the deployment was successful by confirming the extnesion is running successfully.

### [Azure CLI](#tab/azurecli)

Verify the deployment by using the following command to list the extensions that are already running or being deployed on your cluster:

```azurecli-interactive
az k8s-extension list --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

### [Azure portal](#tab/portal)
Verify the deployment navigating to the cluster you recently installed the extension on, then navigate to **Extensions**, where you'll see the extension status:

---

## Manage the offer lifecycle

### [Azure CLI](#tab/azure-cli)

To view the extension instance from the cluster, run the following command:

```azurecli-interactive
az k8s-extension show --name <extension-name> --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

---

## Monitor billing and usage information

To monitor billing and usage information for the offer that you deployed:

1. In the Azure portal, go to the page for your cluster's resource group.

1. Select **Cost Management** > **Cost analysis**. Under **Product**, you can see a cost breakdown for the plan that you selected.

   :::image type="content" source="./media/deploy-marketplace/billing-inline.png" alt-text="Screenshot of the Azure portal page for a resource group, with billing information broken down by offer plan." lightbox="./media/deploy-marketplace/billing-full.png":::

## Remove an offer

You can delete a purchased plan for an Azure container offer by deleting the extension instance on the cluster.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az k8s-extension delete --name <extension-name> --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type connectedClusters
```

### [Azure portal](#tab/azure-portal)

Select an application, then select the uninstall button to remove the extension from your cluster:

:::image type="content" source="./media/deploy-marketplace/uninstall-inline.png" alt-text="The Azure portal page for the A K S cluster is shown. The deployed extension is listed with the 'uninstall' button highlighted." lightbox="./media/deploy-marketplace/uninstall.png":::

---

## Troubleshooting

For help resolving issues, see [Troubleshoot the failed deployment of a Kubernetes application offer](/troubleshoot/azure/azure-kubernetes/troubleshoot-failed-kubernetes-deployment-offer).

## Next steps

