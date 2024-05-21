---
title: Troubleshooting helm install failures during Azure Operator Service Manager (AOSM) containerized network function (CNF) deployment
description: Learn techniques for diagnosing helm install failures during Azure Operator Service Manager (AOSM) containerized network function (CNF) deployment.
author: pjw711
ms.author: peterwhiting
ms.service: azure-operator-service-manager
ms.topic: troubleshooting
ms.date: 03/19/2024
ms.custom: troubleshooting
---
# Techniques for troubleshooting helm install failures during Azure Operator Service Manager (AOSM) containerized network function (CNF) deployment

CNFs can be as simple as a single helm package with a small number of configuration parameters, or as complex as tens of helm packages with thousands of configuration parameters. This article describes a series of common troubleshooting steps for debugging helm install failures.

## Confirm the helm package installs correctly using direct helm commands

AOSM can't install a CNF which is built from incorrect helm charts or misconfigured `values.yaml` files. There are two fundamental prerequisites:

- Every helm chart included in the CNF must pass `helm template` when provided with the set of values used to deploy the chart
- `helm install` must succeed when run directly on the Azure Arc-connected Kubernetes cluster

Test that your helm charts meet these prerequisites. Make sure that you test with the same helm values you intend to use when deploying through AOSM.

- You can connect to your Azure Operator Nexus Kubernetes cluster using [cluster connect](/azure/operator-nexus/howto-kubernetes-cluster-connect#connected-mode-access) and use [helm install](https://helm.sh/docs/helm/helm_install/) to install your helm charts.

## Confirm that your network function (NF) ARM Template has `--atomic` set to false

By default, AOSM removes failed installations from the cluster to reduce resource usage. This prevents detailed debugging in failure scenarios. The NF ARM template supports overriding this behavior. Use this [How-To guide](how-to-use-helm-option-parameters.md) to configure AOSM to leave failed installations in place.

## Confirm that your network function (NF) Azure Resource Manager (ARM) Template uses artifact store injection

AOSM supports zero-touch onboarding of helm charts. This feature is configured in the NF ARM template and is automatically enabled if you onboarded the CNF using the Az CLI AOSM extension.

1. Download the NF ARM template from the Artifact Store.
1. Confirm that the `roleOverrideValues` property of the `Microsoft.HybridNetwork/networkFunctions` contains the following snippet. This snippet uses a fictional Contoso CNF built from three independent helm charts. These helm charts are modeled as three network function applications in the network function definition version (NFDV). Your ARM template should have one element in the `roleOverrideValues` array for each network function application in the NFDV.

```json
roleOverrideValues: ["{\"name\": \"Contoso-one\", \"deployParametersMappingRuleProfile\": {\"applicationEnablement\": \"Enabled\", \"helmMappingRuleProfile\": {\"options\": {\"installOptions\": {\"injectArtifactStoreDetails\":\"true\"}},{\"upgradeOptions\": {\"injectArtifactStoreDetails\":\"true\"}}}}},{\"name\": \"Contoso-two\", \"deployParametersMappingRuleProfile\": {\"applicationEnablement\": \"Enabled\", \"helmMappingRuleProfile\": {\"options\": {\"installOptions\": {\"injectArtifactStoreDetails\":\"true\"}},{\"upgradeOptions\": {\"injectArtifactStoreDetails\":\"true\"}}}}},{\"name\": \"Contoso-three\", \"deployParametersMappingRuleProfile\": {\"applicationEnablement\": \"Enabled\", \"helmMappingRuleProfile\": {\"options\": {\"installOptions\": {\"injectArtifactStoreDetails\":\"true\"}},{\"upgradeOptions\": {\"injectArtifactStoreDetails\":\"true\"}}}}}"]
```

If the ARM template doesn't contain the `\"injectArtifactStoreDetails\":\"true\"` setting for each network function application, edit the ARM template to include the setting for each network function application in your NFDV and upload the ARM template to the Artifact Store.

## Use the AOSM Azure portal to view the SNS deployment error

1. Access the Azure portal and open the Resource Group you deployed the Site Network Service (SNS) into
1. Select the **Deployments** page from the Resource Group menu
1. Open the deployment page for the deployment corresponding to your failed SNS deployment and select the **error details** button
    :::image type="content" source="media/sns-error-details.png" alt-text="Screenshot showing error details on a failed Site Network Service deployment." lightbox="media/sns-error-details.png":::

## Use the AOSM Azure portal to view the NF deployment error

1. Access the Azure portal and open the Resource Group you deployed the SNS into
1. Open the SNS overview and click on the link to the **Resources** property
    :::image type="content" source="media/sns-hosted-resource-group.png" alt-text="Screenshot showing the hosted resource group deployed by a Site Network Service." lightbox="media/sns-hosted-resource-group.png":::
1. Select the **Deployments** page from the Resource Group menu.
1. Select the **error details** button for the deployment corresponding to your failed NF deployment
    :::image type="content" source="media/network-function-error-details.png" alt-text="Screenshot showing error details on a failed Network Function deployment." lightbox="media/network-function-error-details.png":::

## Use the AOSM Azure portal to view the network function deployment parameters

1. Access the Azure portal and open the Resource Group you deployed the SNS into
1. Open the SNS overview and click on the link to the **Resources** property
    :::image type="content" source="media/sns-hosted-resource-group.png" alt-text="Screenshot showing the hosted resource group deployed by a Site Network Service." lightbox="media/sns-hosted-resource-group.png":::
1. Open the NF overview and click on the **Open view as JSON** button for the **Deployment values** property
    :::image type="content" source="media/network-function-deployment-values.png" alt-text="Screenshot showing the values passed to the network function deployment." lightbox="media/network-function-deployment-values.png":::

This view shows you the values that have been passed to the NF deployment operation. These values are included in the `helm install` command used to deploy the NF. Misconfigured, unexpected, missing, or incorrectly formatted values can cause the `helm install` command to fail.

## Use the AOSM Azure portal to view the network function component deployment parameters

1. Access the Azure portal and open the Resource Group you deployed the SNS into
1. Open the SNS overview and click on the link to the **Resources** property
    :::image type="content" source="media/sns-hosted-resource-group.png" alt-text="Screenshot showing the hosted resource group deployed by a Site Network Service." lightbox="media/sns-hosted-resource-group.png":::
1. Open the NF overview and navigate to the **Components** page from the resource menu.
1. Press **Open View as JSON** for the component of interest.
    :::image type="content" source="media/component-deployment-values.png" alt-text="Screenshot showing the values passed to the helm install command." lightbox="media/component-deployment-values.png":::

This view shows the values passed to the helm chart on the `helm install` command. Each value is passed to the `helm install` command using `--set`. Misconfigured, unexpected, missing, or incorrectly formatted values can cause the `helm install` command to fail.
