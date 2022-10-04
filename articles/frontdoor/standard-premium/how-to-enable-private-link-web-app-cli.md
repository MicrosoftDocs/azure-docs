---
title: 'Connect Azure Front Door Premium to an App Service origin with Private Link'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a webapp privately.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 06/09/2022
ms.author: duau
---

# Connect Azure Front Door Premium to an App Service origin with Private Link

This article will guide you through how to configure Azure Front Door Premium tier to connect to your App service privately using the Azure Private Link service.


[!INCLUDE [azure-cli-prepare-your-environment](../../../includes/azure-cli-prepare-your-environment.md)]

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Have a functioning Azure Front Door Premium profile, endpoint and origin group. Refer [Create a Front Door - CLI](../create-front-door-cli.md) to learn how to create these.
* Have a functioning Web App that is also private. Refer this [doc](../../private-link/create-private-link-service-cli.md) to learn how to do the same.

> [!Note]
> Private endpoints requires your App Service plan or function hosting plan to meet some requirements. For more information, see [Using Private Endpoints for Azure Web App](../../app-service/networking/private-endpoint.md).

## Enable Private Link to an App Service in Azure Front Door Premium
 
Run [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) to create a new Azure Front Door origin. The table below has information of what values to select in the respective fields while enabling private link with Azure Front Door. Select or enter the following settings to configure the App service you want Azure Front Door Premium to connect with privately.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this origin. |
    | Origin Type | Enter type of origin |
    | Host name | Select the host from the dropdown that you want as an origin. |
    | Origin host header | You can customize the host header of the origin or leave it as default. |
    | HTTP port | 80 (default) |
    | HTTPS port | 443 (default) |
    | Priority | Different origin can have different priorities to provide primary, secondary, and backup origins. |
    | Weight | 1000 (default). Assign weights to your different origin when you want to distribute traffic.|
    | Region | Select the region that is the same or closest to your origin. |
    | Target sub resource | The type of sub-resource for the resource selected above that your private endpoint will be able to access. |
    | Request message | Customize message or choose the default. |

```azurecli-interactive
az afd origin create --enabled-state Enabled \
                     --resource-group myRGFD \
                     --origin-group-name og1 \
                     --origin-name pvtwebapp \
                     --profile-name contosoAFD \
                     --host-name example.contoso.com \
                     --origin-host-header example.contoso.com \
                     --http-port 80 \
                     --https-port 443 \
                     --priority 1 \
                     --weight 500 \
                     --enable-private-link true \
                     --private-link-location EastUS \
                     --private-link-request-message 'Please approve this request' \
                     --private-link-resource /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRGFD/providers/Microsoft.Web/sites/webapp1/appServices\
                     --private-link-sub-resource-type sites 
```

## Approve Azure Front Door Premium private endpoint connection from App Service

1. Run [az network private-endpoint-connection list](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-list) to list the private endpoint connections for your web app. Note down the resource id of the private endpoint connection usually available in the first line of the output.

```azurecli-interactive
az network private-endpoint-connection list --name webapp1 --resource-group myRGFD --type Microsoft.Web/sites
```

2. Run [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) to approve the private endpoint connection

```azurecli-interactive
az network private-endpoint-connection approve --id /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRGFD/providers/Microsoft.Web/sites/webapp1/privateEndpointConnections/00000000-0000-0000-0000-000000000000

```
3. Once approved, it will take a few minutes for the connection to fully establish. You can now access your app service from Azure Front Door Premium. Direct access to the App Service from the public internet gets disabled after private endpoint gets enabled.



## Next steps

Learn about [Private Link service with App service](../../app-service/networking/private-endpoint.md).
