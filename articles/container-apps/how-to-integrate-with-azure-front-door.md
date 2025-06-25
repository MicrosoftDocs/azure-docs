---
title: Access an Azure container app using an Azure Front Door
description: Learn how to access an Azure container app using an Azure Front Door.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - devx-track-azurepowershell
  - devx-track-azurecli
  - ignite-2024
  - build-2025
ms.topic:  how-to
ms.date: 05/02/2025
ms.author: cshoe
zone_pivot_groups: azure-cli-or-portal
---

# Create a private link to an Azure Container App with Azure Front Door

In this article, you learn how to connect directly from Azure Front Door to your Azure Container Apps using a private link instead of the public internet. In this tutorial, you create an Azure Container Apps workload profiles environment, an Azure Front Door, and connect them securely through a private link. You then verify the connectivity between your container app and the Azure Front Door.

::: zone pivot="azure-portal"

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).

- This feature is only supported for workload profile environments.

- Make sure the `Microsoft.Cdn` resource provider is registered for your subscription.
    1. Begin by signing in to the [Azure portal](https://portal.azure.com).
    1. Browse to your subscription page and select **Settings** > **Resource providers**. 
    1. Select **Microsoft.Cdn** from the provider list.
    1. Select **Register**.

## Create a container app

Create a resource group to organize the services related to your container app deployment.

1. Search for **Container Apps** in the top search bar.
1. Select **Container Apps** in the search results.
1. Select the **Create** button.

1. In the *Create Container App* page, in the *Basics* tab, do the following actions.

    | Setting | Action |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select the **Create new resource group** link and enter **my-container-apps**. |
    | Container app name |  Enter **my-container-app**. |
    | Deployment source | Select **Container image**. |
    | Region | Select **Central US**. |

1. In the *Create Container Apps Environment* field, select the **Create new environment** link.

1. In the *Create Container Apps Environment* page, in the *Basics* tab, enter the following values:

    | Setting | Value |
    |--|--|
    | Environment name | Enter **my-environment**. |
    | Zone redundancy | Select **Disabled** |

1. Select the **Networking** tab.

1. Set *Public Network Access* to **Disable: Block all incoming traffic from the public internet.**

1. Leave **Use your own virtual network** set to **No**.

1. Leave **Enable private endpoints** set to **No**.

1. Select **Create**.

1. In the *Create Container App* page, select the **Container** tab.

1. Select **Use quickstart image**.

<!-- Deploy the container app -->
[!INCLUDE [container-apps-create-portal-deploy.md](../../includes/container-apps-create-portal-deploy.md)]

3. When you browse to the container app endpoint, you see the following message:

    ```
    The public network access on this managed environment is disabled. To connect to this managed environment, please use the Private Endpoint from inside your virtual network. To learn more https://aka.ms/PrivateEndpointTroubleshooting.
    ```

    Instead, you use an Azure Front Door endpoint to access your container app.

## Create an Azure Front Door profile and endpoint

1. Search for **Front Door** in the top search bar.
1. Select **Front Door and CDN profiles** in the search results.
1. Select **Azure Front Door** and **Quick Create**.
1. Select the **Continue to create a Front Door** button.

1. In the *Create a Front Door profile* page, in the *Basics* tab, do the following actions.

    | Setting | Actions |
    |--|--|
    | Resource group | Select **my-container-apps**. |
    | Name | Enter **my-afd-profile**. |
    | Tier | Select **Premium**. Private link isn't supported for origins for Azure Front Door on the Standard tier. |
    | Endpoint name | Enter **my-afd-endpoint**. |
    | Origin type | Select **Container Apps**. |
    | Origin host name | Enter the hostname of your container app. Your hostname looks like the following example: `my-container-app.orangeplant-77e5875b.centralus.azurecontainerapps.io`. |
    | Enable private link service | Enable this setting. |
    | Region | Select **(US) Central US**. |
    | Target sub resource | Select **managedEnvironments**. |
    | Request message | Enter **AFD Private Link Request**. |

1. Select **Review + create**.

1. Select **Create**.

1. After the deployment completes, select **Go to resource**.

1. In the *Front Door and CDN profile* overview page, find your *Endpoint hostname*. It looks like the following example. Make a note of this hostname.

    ```
    my-afd-endpoint.<HASH>.b01.azurefd.net
    ```

## Approve the private endpoint connection request

1. Browse to the overview page for the environment named *my-environment* you created previously.

1. Expand **Settings** > **Networking**.

1. You see a link for the private endpoint connection requests. For example, `1 private endpoint`. Select this link.

1. In the *Private endpoint connections* page, approve each private endpoint connection request with the description `AFD Private Link Request`.

    > [!NOTE]
    > Azure Front Door has a known issue where it might create multiple private endpoint connection requests.

## Access your container app from Azure Front Door

Browse to the Azure Front Door endpoint hostname you recorded previously. You see the output for the quickstart container app image. Global deployment could take a few minutes to deploy, so if you don't see the expected output, wait a few minutes and then refresh.

## Clean up resources

If you're not going to continue to use this application, you can delete the container app and all the associated services by removing the resource group.

1. Select the **my-container-apps** resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name **my-container-apps** in the *Are you sure you want to delete "my-container-apps"* confirmation dialog.
1. Select **Delete**.

    The process to delete the resource group could take a few minutes to complete.

::: zone-end

::: zone pivot="azure-cli"

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).

- To ensure you're running the latest version of the [Azure CLI](/cli/azure/install-azure-cli), run the following command.

    ```azurecli
    az upgrade
    ```

- The latest version of the Azure Container Apps extension for the Azure CLI. To ensure you're running the latest version, run the following command.

    ```azurecli
    az extension add --name containerapp --upgrade --allow-preview true
    ```

    > [!NOTE]
    > Starting in May 2024, Azure CLI extensions no longer enable preview features by default. To access Container Apps [preview features](./whats-new.md), install the Container Apps extension with `--allow-preview true`.

- This feature is only supported for workload profile environments.

- This feature is only available in [supported regions](/azure/frontdoor/private-link#region-availability).

For more information about prerequisites and setup, see [Quickstart: Deploy your first container app with containerapp up](get-started.md?tabs=bash).

## Set environment variables

Set the following environment variables.

```azurecli
RESOURCE_GROUP="my-container-apps"
LOCATION="centralus"
ENVIRONMENT_NAME="my-environment"
CONTAINERAPP_NAME="my-container-app"
AFD_PROFILE="my-afd-profile"
AFD_ENDPOINT="my-afd-endpoint"
AFD_ORIGIN_GROUP="my-afd-origin-group"
AFD_ORIGIN="my-afd-origin"
AFD_ROUTE="my-afd-route"
```

## Create an Azure resource group

Create a resource group to organize the services related to your container app deployment.

```azurecli
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION
```

## Create an environment

1. Create the Container Apps environment.

    ```azurecli
    az containerapp env create \
        --name $ENVIRONMENT_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION
    ```

1. Retrieve the environment ID. You use this ID to configure the environment.

    ```azurecli
    ENVIRONMENT_ID=$(az containerapp env show \
        --resource-group $RESOURCE_GROUP \
        --name $ENVIRONMENT_NAME \
        --query "id" \
        --output tsv)
    ```

1. Disable public network access for the environment.

    ```azurecli
    az containerapp env update \
        --id $ENVIRONMENT_ID \
        --public-network-access Disabled
    ```

## Deploy a container app

1. Run the following command to deploy a container app in your environment.

    ```azurecli
    az containerapp up \
        --name $CONTAINERAPP_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --environment $ENVIRONMENT_NAME \
        --image mcr.microsoft.com/k8se/quickstart:latest \
        --target-port 80 \
        --ingress external \
        --query properties.configuration.ingress.fqdn
    ```

1. Retrieve your container app endpoint.

    ```azurecli
    ACA_ENDPOINT=$(az containerapp show \
        --name $CONTAINERAPP_NAME \
        --resource-group $RESOURCE_GROUP \
        --query properties.configuration.ingress.fqdn \
        --output tsv)
    ```

1. When you browse to the container app endpoint, you receive `ERR_CONNECTION_CLOSED` because the container app environment has public access disabled. Instead, you use an AFD endpoint to access your container app.

## Create an Azure Front Door profile

1. Make sure the `Microsoft.Cdn` resource provider is registered for your subscription.

    ```azurecli
    az provider register --namespace Microsoft.Cdn
    ```

1. Create an AFD profile. Private link isn't supported for origins in an AFD profile with SKU `Standard_AzureFrontDoor`.

```azurecli
az afd profile create \
    --profile-name $AFD_PROFILE \
    --resource-group $RESOURCE_GROUP \
    --sku Premium_AzureFrontDoor
```

## Create an Azure Front Door endpoint

Add an endpoint to your AFD profile.

```azurecli
az afd endpoint create \
    --resource-group $RESOURCE_GROUP \
    --endpoint-name $AFD_ENDPOINT \
    --profile-name $AFD_PROFILE \
    --enabled-state Enabled
```

## Create an Azure Front Door origin group

Create an AFD origin group.

```azurecli
az afd origin-group create \
    --resource-group $RESOURCE_GROUP \
    --origin-group-name $AFD_ORIGIN_GROUP \
    --profile-name $AFD_PROFILE \
    --probe-request-type GET \
    --probe-protocol Http \
    --probe-interval-in-seconds 60 \
    --probe-path / \
    --sample-size 4 \
    --successful-samples-required 3 \
    --additional-latency-in-milliseconds 50
```

## Create an Azure Front Door origin

Add an AFD origin to your origin group.

```azurecli
az afd origin create \
    --resource-group $RESOURCE_GROUP \
    --origin-group-name $AFD_ORIGIN_GROUP \
    --origin-name $AFD_ORIGIN \
    --profile-name $AFD_PROFILE \
    --host-name $ACA_ENDPOINT \
    --origin-host-header $ACA_ENDPOINT \
    --priority 1 \
    --weight 500 \
    --enable-private-link true \
    --private-link-location $LOCATION \
    --private-link-request-message "AFD Private Link Request" \
    --private-link-resource $ENVIRONMENT_ID \
    --private-link-sub-resource-type managedEnvironments
```

## List private endpoint connections

1. Run the following command to list the private endpoint connections for your environment.

    ```azurecli
    az network private-endpoint-connection list \
        --name $ENVIRONMENT_NAME \
        --resource-group $RESOURCE_GROUP \
        --type Microsoft.App/managedEnvironments
    ```

1. Record the private endpoint connection resource ID from the response. The private endpoint connection has a `properties.privateLinkServiceConnectionState.description` value of `AFD Private Link Request`. The private endpoint connection resource ID looks like the following.

    ```
    /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.App/managedEnvironments/my-environment/privateEndpointConnections/<PRIVATE_ENDPOINT_CONNECTION_ID>
    ```

    Don't confuse this ID with the private endpoint ID, which looks like the following.

    ```
    /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/eafd-Prod-centralus/providers/Microsoft.Network/privateEndpoints/<PRIVATE_ENDPOINT_ID>
    ```

## Approve the private endpoint connection

To approve the connection, run the following command. Replace the \<PLACEHOLDER\> with the private endpoint connection resource ID you recorded in the previous section.

```azurecli
az network private-endpoint-connection approve --id <PRIVATE_ENDPOINT_CONNECTION_RESOURCE_ID>
```

## Add a route

Run the following command to map the endpoint you created earlier to the origin group. Private endpoints on Azure Container Apps only support inbound HTTP traffic. TCP traffic isn't supported.

```azurecli
az afd route create \
    --resource-group $RESOURCE_GROUP \
    --profile-name $AFD_PROFILE \
    --endpoint-name $AFD_ENDPOINT \
    --forwarding-protocol MatchRequest \
    --route-name $AFD_ROUTE \
    --https-redirect Enabled \
    --origin-group $AFD_ORIGIN_GROUP \
    --supported-protocols Http Https \
    --link-to-default-domain Enabled
```

## Access your container app from Azure Front Door

1. Retrieve the hostname of your AFD endpoint.

    ```azurecli
    az afd endpoint show \
        --resource-group $RESOURCE_GROUP \
        --profile-name $AFD_PROFILE \
        --endpoint-name $AFD_ENDPOINT \
        --query hostName \
        --output tsv
    ```

    Your hostname looks like the following example.

    ```
    my-afd-endpoint.<HASH>.b01.azurefd.net
    ```

1. Browse to the hostname. You see the output for the quickstart container app image.

    If you don't see the expected output at first, wait a few minutes and then refresh.

## Clean up resources

If you're not going to continue to use this application, you can remove the **my-container-apps** resource group. This action deletes the Azure Container Apps instance and all associated services. It also deletes the resource group that the Container Apps service automatically created and which contains the custom network components.

> [!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this guide exist in the specified resource group, they'll also be deleted.

```azurecli
az group delete --name $RESOURCE_GROUP
```

::: zone-end

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Related content

- [Azure Private Link](/azure/private-link/private-link-overview)
- [Azure Front Door](/azure/frontdoor/)
