---
title: Use premium ingress in Azure Container Apps
description: Learn how to use premium ingress in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurecli, devx-track-bicep
ms.topic: tutorial
ms.date: 11/04/2025
ms.author: jefmarti
zone_pivot_groups: azure-cli-bicep
---

# Use premium ingress with Azure Container Apps

In this article, you learn how to use premium ingress with Azure Container Apps. With premium ingress, you can define how ingress is scaled and configured to better handle higher demand workloads. 

::: zone pivot="azure-cli"

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Install the [Azure CLI](/cli/azure/install-azure-cli).

## Create resource group

1. Sign in to Azure.

````azurecli
az login
````

2. Upgrade the Azure CLI to the latest version.

````azurecli
az upgrade
````

3. Register the required resource providers.

````azurecli
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights
````

4. Create a resource group using the following command:

````azurecli
az group create --name my-container-apps --location centralus
````

## Create the environment

To create the container apps environment, run the following command:

````azurecli
az containerapp env create \
  --name my-container-apps-env \
  --resource-group my-resource-group \
  --location centralus
````

## Configure workload profile

Add a workload profile to the environment (required for premium ingress).

````azurecli
az containerapp env workload-profile add \
  --resource-group my-resource-group \
  --name my-container-apps-env \
  --workload-profile-name Ingress-D4 \
  --workload-profile-type D4 \
````

Your workload profile must have at least two nodes to use premium ingress.

## Configure premium ingress

Add premium ingress settings to the environment using the following command:

````azurecli
az containerapp env premium-ingress add \
  --resource-group my-resource-group \
  --name my-container-apps-env \
  --workload-profile-name Ingress-D4 \
  --termination-grace-period 500 \
  --request-idle-timeout 4 \
  --header-count-limit 100
````

The following table describes the parameters you can set when configuring premium ingress settings for your Container Apps environment.

| Parameter | Description | Default | Minimum | Maximum |
|--|--|--|--|--|
| `termination-grace-period` | The time (in seconds) to allow active connections to close before terminating the ingress. | n/a | 0 | 60 |
| `request-idle-limit` | The time (in minutes) a request can remain idle before being disconnected. | 4 | 4 | 30 |
| `header-count-limit` | The maximum number of HTTP headers allowed per request. | 100 | 1 | n/a |


Once configured, you'll see an output of the settings you just applied.

````json
{
  "headerCountLimit": 100,
  "requestIdleTimeout": 4,
  "terminationGracePeriodSeconds": 500,
  "workloadProfileName": "Ingress-D4"
}
````

## Update and manage premium ingress

To update the premium ingress settings for the environment, run the following command:

````azurecli
az containerapp env premium-ingress update \
  --resource-group my-resource-group \
  --name my-container-apps-env \
  --workload-profile-name Ingress-D4 \
  --termination-grace-period 500 \
  --request-idle-timeout 4 \
  --header-count-limit 100
````

To show the premium ingress settings for the environment, run the following command:

````azurecli
az containerapp env premium-ingress show \
  --resource-group my-resource-group \
  --name my-container-apps-env
````

To remove the premium ingress settings for the environment, run the following command:

````azurecli
az containerapp env premium-ingress remove \
  --resource-group my-resource-group \
  --name my-container-apps-env
````

To remove the workload profile from the environment, run the following command:

````azurecli
az containerapp env workload-profile remove \
  --resource-group my-resource-group \
  --name my-container-apps-env \
  --workload-profile-name Ingress-D4
````

::: zone-end

::: zone pivot="bicep"

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Install [Bicep](/azure/azure-resource-manager/bicep/install)

## Deploy with Bicep

Create the following Bicep file and save as `ingress.bicep`.

````bicep
resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2025-07-01' = {
  name: 'my-container-app-env'
  location: 'centralus'
  tags: tags
  properties: {
    workloadProfiles: [
      {
        name: 'Ingress-D4'
        workloadProfileType: 'D4'
        minimumCount: 2
        maximumCount: 4
      }
    ]
    ingressConfiguration: {
      workloadProfileName: 'Ingress-D4'
      terminationGracePeriodSeconds: 600
      headerCountLimit: 101
      requestIdleTimeout: 5
    }
  }
}              
````

This step deploys a Container Apps environment with a premium ingress configuration including the following settings:

| Name | Description |
|--|--|
| `name` | The name of the workload profile used for premium ingress. |
| `workloadProfileType` | The type/size of the workload profile (for example, D4) for scaling and resource allocation. |
| `minimumCount` | The minimum number of instances for the workload profile. Minimum: 2. |
| `maximumCount` | The maximum number of instances for the workload profile. Maximum: 50. |
| `workloadProfileName`  | The workload profile name associated with the ingress configuration. |
| `terminationGracePeriodSeconds` | The time (in seconds) to allow active connections to close before terminating the ingress. Minimum: 0, Maximum: 60. |
| `headerCountLimit` | The maximum number of HTTP headers allowed per request. Default: 100, Minimum: 1. |
| `requestIdleTimeout` | The time (in minutes) a request can remain idle before being disconnected.  Default: 4, Minimum: 4, Maximum: 30. |

### Deploy to Azure

Navigate to the directory where you saved the *ingress.bicep* file, then run the following command to deploy the Bicep file:

```bash
# Login to Azure (if not already logged in)
azd auth login

# Provision and deploy the infrastructure
azd up
```

## Manage the deployment

Use the following command to view the status and logs of your container app.

```bash
# Check deployment status
azd show

# Clean up all resources
azd down

# View deployment logs
azd logs
```
::: zone-end

You can configure the ingress for your environment after you create it.

1. Go to your Container Apps environment in the Azure portal.

1. Under *Settings*, select **Networking**.

1. Select the **Ingress settings** tab.

1. Configure your ingress settings according to the following settings.

    | Setting | Value |
    |---|---|
    | Ingress Mode| Select **Premium**. |
    | Workload profile size | Select a size from **D4** to **D32**. |
    | Minimum node instances | Enter the minimum workload profile node instances. |
    | Maximum node instances | Enter the maximum workload profile node instances. |
    | Termination grace period |Enter the termination grace period in minutes. |
    | Idle request timeout| Enter the idle request time-out in minutes. |
    | Request header count | Enter the request header count. |

1. Select **Apply**.

## Monitoring and metrics
Ingress metrics are available via the Azure portal in the Container Apps environment instance. Under *Monitoring*, select **Metrics**. These metrics are available with Default or Premium Ingress enabled. Additional metrics are in progress.

- Ingress CPU Usage
- Ingress Memory Usage Bytes

Benchmarks show that the ingress can handle around 3000 requests per second per CPU core, but that capacity varies by application usage. Memory only tends to become a bottleneck if the application is receiving requests quicker than  the environment can handle and requests get queued at the ingress layer.

The resources allocated to the ingress in each mode are:

| Mode     | Instances                | CPU                | Memory         | CPU Scale Threshold | Memory Scale Threshold |
|----------|--------------------------|--------------------|---------------|--------------------|-----------------------|
| **Default**  | 2-10                     | 1 core             | 2 GB          | 75%                | 50%                   |
| **Premium**  | One per node (min 2)     | 90% of node cores  | 90% of node memory | 50% of node cores  | 50% of node memory    |

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

> [!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they'll also be deleted.

```azurecli
az group delete --name my-container-apps
```

## Related content

- [Azure CLI reference](/cli/azure/containerapp/env/http-route-config)
- [Bicep reference](/azure/templates/microsoft.app/2024-10-02-preview/managedenvironments/httprouteconfigs?pivots=deployment-language-bicep)
- [ARM template reference](/azure/templates/microsoft.app/2024-10-02-preview/managedenvironments/httprouteconfigs?pivots=deployment-language-arm-template)
