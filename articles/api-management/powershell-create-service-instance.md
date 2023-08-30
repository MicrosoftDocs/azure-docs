---
title: Quickstart - Create API Management instance - PowerShell
description: Use this quickstart to create a new Azure API Management instance by using Azure PowerShell cmdlets.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: quickstart
ms.custom: mvc, devx-track-azurepowershell, mode-api, devdivchpfy22
ms.date: 09/21/2022
ms.author: danlep
---

# Quickstart: Create a new Azure API Management service instance by using PowerShell

In this quickstart, you create a new API Management instance by using Azure PowerShell cmdlets.

Azure API Management helps organizations publish APIs to external, partner, and internal developers to unlock the potential of their data and services. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection. API Management lets you create and manage modern API gateways for existing backend services hosted anywhere. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell

    [!INCLUDE [cloud-shell-try-it-no-header](../../includes/cloud-shell-try-it-no-header.md)]

    If you choose to install and use the PowerShell locally, this quickstart requires the Azure PowerShell module version 1.0 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.


## Create resource group

Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. 

The following command creates a resource group named *myResourceGroup* in the West US location:

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location WestUS
```

## Create an API Management instance

Now that you have a resource group, you can create an API Management service instance. Create one by using [New-AzApiManagement](/powershell/module/az.apimanagement/new-azapimanagement) and provide a service name and publisher details. The service name must be unique within Azure.

In the following example, *myapim* is used for the service name. Update the name to a unique value. Also, update the organization name of the API publisher and the admin email address to receive notifications.

By default, the command creates the instance in the Developer tier, an economical option to evaluate Azure API Management. This tier isn't for production use. For more information about the API Management tiers, see [Feature-based comparison of the Azure API Management tiers](api-management-features.md).

> [!NOTE]
> This is a long-running action. It can take between 30 and 40 minutes to create and activate an API Management service in this tier.

```azurepowershell-interactive
New-AzApiManagement -Name "myapim" -ResourceGroupName "myResourceGroup" `
  -Location "West US" -Organization "Contoso" -AdminEmail "admin@contoso.com" 
```

When the command returns, run [Get-AzApiManagement](/powershell/module/az.apimanagement/get-azapimanagement) to view the properties of the Azure API Management service. After activation, the setting up status is Succeeded and the service instance has several associated URLs. For example:

```azurepowershell-interactive
Get-AzApiManagement -Name "myapim" -ResourceGroupName "myResourceGroup" 
```

Example output:

```console
PublicIPAddresses                     : {203.0.113.1}
PrivateIPAddresses                    :
Id                                    : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.ApiManagement/service/myapim
Name                                  : myapim
Location                              : West US
Sku                                   : Developer
Capacity                              : 1
CreatedTimeUtc                        : 9/9/2022 9:07:43 PM
ProvisioningState                     : Succeeded
RuntimeUrl                            : https://myapim.azure-api.net
RuntimeRegionalUrl                    : https://myapi-westus-01.regional.azure-api.net
PortalUrl                             : https://myapim.portal.azure-api.net
DeveloperPortalUrl                    : https://myapim.developer.azure-api.net
ManagementApiUrl                      : https://myapim.management.azure-api.net
ScmUrl                                : https://myapim.scm.azure-api.net
PublisherEmail                        : admin@contoso.com
OrganizationName                      : Contoso
NotificationSenderEmail               : apimgmt-noreply@mail.windowsazure.com
VirtualNetwork                        :
VpnType                               : None
PortalCustomHostnameConfiguration     :
ProxyCustomHostnameConfiguration      : {myapim.azure-api.net}
ManagementCustomHostnameConfiguration :
ScmCustomHostnameConfiguration        :
DeveloperPortalHostnameConfiguration  :
SystemCertificates                    :
Tags                                  : {}
AdditionalRegions                     : {}
SslSetting                            : Microsoft.Azure.Commands.ApiManagement.Models.PsApiManagementSslSetting
Identity                              :
EnableClientCertificate               :
EnableClientCertificate               :
Zone                                  :
DisableGateway                        : False
MinimalControlPlaneApiVersion         :
PublicIpAddressId                     :
PlatformVersion                       : stv2
PublicNetworkAccess                   : Enabled
PrivateEndpointConnections            :
ResourceGroupName                     : myResourceGroup

```

After your API Management service instance is deployed, you're ready to use it. Start with the tutorial to [import and publish your first API](import-and-publish.md).

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Import and publish your first API](import-and-publish.md)
