---
title: 'Connect Azure Front Door Premium to an App Service Origin with Private Link Using Azure PowerShell'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a WebApp privately using Azure PowerShell.
services: frontdoor
author: jainsabal
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 11/15/2024
ms.author: jainsabal
---

# Connect Azure Front Door Premium to an App Service (Web App) Origin with Private Link Using Azure PowerShell

This article guides you through how to configure Azure Front Door Premium tier to connect to your App Service (Web App) privately using the Azure Private Link service with Azure PowerShell.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell
- Azure FrontDoor Premium profile, endpoint, and origin group. For more information on how to create an Azure Front Door profile, see [Create a Front Door - PowerShell](../create-front-door-powershell.md).
- Azure App Service (WebApp) instance. For more information on how to create an Azure App Service, see [Create an App Service - PowerShell](../../app-service/quickstart-dotnetcore.md?tabs=net80&pivots=development-environment-ps).

> [!NOTE]
> Private endpoints requires your App Service plan to meet some requirements. For more information, see [Using Private Endpoints for Azure Web App](../../app-service/networking/private-endpoint.md).
> This feature is not supported with App Service Slots

## Enable Private Link to an App Service in Azure Front Door Premium

1. Run [Get-AzResource](/powershell/module/az.resources/get-azresource) to get the resource ID of the App Service to be used as the origin for Azure Front Door

    ```azurepowershell-interactive
    get-AzResource -Name testWebAppAFD 
                   -ResourceGroupName testRG
    
    ```

2. Run [New-AzFrontDoorCdnOrigin](/powershell/module/az.cdn/new-azfrontdoorcdnorigin) to add your App Service origin to your origin group.

    ```azurepowershell-interactive
    # Add App Service origin to the Azure Front Door profile with Private Link
    $origin1 = New-AzFrontDoorCdnOrigin `
        -OriginGroupName default-origin-group `
        -OriginName test-origin `
        -ProfileName testAFD `
        -ResourceGroupName testRG `
        -HostName testwebapp.canadacentral-01.azurewebsites.net `
        -OriginHostHeader testwebapp.canadacentral-01.azurewebsites.net `
        -HttpPort 80 `
        -HttpsPort 443 `
        -Priority 1 `
        -Weight 1000 `
        -PrivateLinkId /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Web/sites/testWebAppAFD `
        -SharedPrivateLinkResourceGroupId sites `
        -SharedPrivateLinkResourcePrivateLinkLocation "Central US" `
        -SharedPrivateLinkResourceRequestMessage "testWebAppAFDPL Private Link request" `
    
    ```

## Approve Azure Front Door Premium private endpoint connection from App Service

1. Run [Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection) to list the private endpoint connections for your App Service. Note down the 'Name' of the private endpoint connection available in your App Service, in the first line of your output.

    ```azurepowershell-interactive
    
    #PrivateLinkResourceId is the resource ID of the WebApp
    Get-AzPrivateEndpointConnection -PrivateLinkResourceId '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Web/sites/testWebAppAFD'
    
    ```

2. Run [Approve-AzPrivateEndpointConnection](/powershell/module/az.network/approve-azprivateendpointconnection) to approve the private endpoint connection.

    ```azurepowershell-interactive
    
    Approve-AzPrivateEndpointConnection -Name 00000000-0000-0000-0000-000000000000-00000000-0000-0000-0000-000000000000 -ResourceGroupName testRG -ServiceName testWebAppAFD -PrivateLinkResourceType Microsoft.Web/sites
        
    ```

3. Once approved, it takes a few minutes for the connection to fully establish. You can now access your App Service from Azure Front Door Premium. Direct access to the App Service from the public internet gets disabled after private endpoint gets enabled. Run [Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection) to verify the status of the private endpoint connection.

    ```azurepowershell-interactive
    
    Get-AzPrivateEndpointConnection -PrivateLinkResourceId '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Web/sites/testWebAppAFD'
    
    ```

## Next steps

Learn about [Private Link service with App service](../../app-service/networking/private-endpoint.md).