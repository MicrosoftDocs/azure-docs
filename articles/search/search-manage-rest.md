---
title: REST APIs for search management
titleSuffix: Azure Cognitive Search
description: Create and configure an Azure Cognitive Search service with the REST Management API. You can scale a service up or down, manage admin and query api-keys, and query for system information.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 05/09/2022 

---

# Manage your Azure Cognitive Search service with REST

> [!div class="op_single_selector"]
> * [Portal](search-manage.md)
> * [PowerShell](search-manage-powershell.md)
> * [Azure CLI](search-manage-azure-cli.md)
> * [REST API](search-manage-rest.md)
> * [.NET SDK](/dotnet/api/microsoft.azure.management.search)
> * [Python](https://pypi.python.org/pypi/azure-mgmt-search/0.1.0)

In this article, learn how to create and configure an Azure Cognitive Search service using using the [Management REST APIs](rest/api/searchmanagement/). Although you can use the portal, script, or other SDKs for most management tasks, the Management REST API is guaranteed to provide [preview features](/rest/api/searchmanagement/management-api-versions#2021-04-01-preview).

> [!div class="checklist"]
> * [List search services in a subscription](#list-search-services)
> * [Return service information](#get-search-service-information)
> * [Create or delete a service](#create-or-delete-a-service)
> * [Create a service with a private endpoint](#create-a-service-with-a-private-endpoint)
> * [Regenerate admin API-keys](#regenerate-admin-keys)
> * [Create or delete query api-keys](#create-or-delete-query-keys)
> * [Scale up or down with replicas and partitions](#scale-replicas-and-partitions)
> * [Create a shared private link resource](#create-a-shared-private-link-resource)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-search/)

* Postman or another REST client that sends HTTP requests

* Azure Active Directory (Azure AD)

* [Elevated access to subscriptions and management groups](../role-based-access-control/elevate-access-global-admin.md). Elevated access allows requests to succeed and avoid this error: "The client does not have authorization to perform action 'Microsoft.Resources/subscriptions/resourcegroups/read'".

## Generate a security token

Management REST API calls are authenticated through Azure Active Directory, which means the client app needs a security principle in Azure AD and permissions to create and configure a resource. This section explains how to create a security principle to generate the token used for authenticating to Azure AD. You can do this in the browser.

The following steps are from Jon Gallant's blog post: [Azure REST APIs with Postman (2021)](https://blog.jongallant.com/2021/02/azure-rest-apis-postman-2021/). You can refer to the blog post or [watch the video](https://www.youtube.com/watch?v=6b1J03fDnOg) for more information.

1. Go to [https://shell.azure.com](https://shell.azure.com) to open an Azure CLI session in the browser. Sign in with the Microsoft account you used for your Azure subscription.

1. At the command line, enter the following command to create the security principle for your client (Postman):

   ```azurecli
   az ad sp create-for-rbac
   ````

   The response should look similar to the following example.

   ```azurecli
   {
   "appId": "<YOUR CLIENT ID>",
   "displayName": "azure-cli-2022-05-09-17-10-24",
   "password": "<YOUR CLIENT SECRET>",
   "tenant": "<YOUR TENANT ID>"
    }
    ```

1. Enter the following command to obtain your subscription ID:

   ```azurecli
   az account show --query id -o tsv
   ````

## Set up Postman

As with the previous section, the following steps are from [this blog post](https://blog.jongallant.com/2021/02/azure-rest-apis-postman-2021/).

1. Start a new Postman collection and edit its properties. In the Variables tab, create the following variables:

    | Variable | Description |
    |----------|-------------|
    | clientId | Provide the previously generated "appID" that you created in Azure AD. |
    | clientSecret | Provide the "password" that was created for your client. |
    | tenantId | Provide the "tenant" that was returned in the previous step. |
    | subscriptionId | Provide the subscription ID for your subscription. |
    | resource | Enter `https://management.azure.com/`. This is the Azure resource used for all control plane (service provisioning and management) operations. | 
    | bearerToken | (leave blank; the token is generated programmatically) |

1. In the Authorization tab, select **Bearer Token** as the type.

1. In the **Token** field, specify the variable placeholder `{{{{bearerToken}}}}`.

1. In the Pre-request Script tab, paste in the following script:

    ```javascript
    pm.test("Check for collectionVariables", function () {
        let vars = ['clientId', 'clientSecret', 'tenantId', 'subscriptionId'];
        vars.forEach(function (item, index, array) {
            console.log(item, index);
            pm.expect(pm.collectionVariables.get(item), item + " variable not set").to.not.be.undefined;
            pm.expect(pm.collectionVariables.get(item), item + " variable not set").to.not.be.empty; 
        });
    
        if (!pm.collectionVariables.get("bearerToken") || Date.now() > new Date(pm.collectionVariables.get("bearerTokenExpiresOn") * 1000)) {
            pm.sendRequest({
                url: 'https://login.microsoftonline.com/' + pm.collectionVariables.get("tenantId") + '/oauth2/token',
                method: 'POST',
                header: 'Content-Type: application/x-www-form-urlencoded',
                body: {
                    mode: 'urlencoded',
                    urlencoded: [
                        { key: "grant_type", value: "client_credentials", disabled: false },
                        { key: "client_id", value: pm.collectionVariables.get("clientId"), disabled: false },
                        { key: "client_secret", value: pm.collectionVariables.get("clientSecret"), disabled: false },
                        { key: "resource", value: pm.collectionVariables.get("resource") || "https://management.azure.com/", disabled: false }
                    ]
                }
            }, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    let resJson = res.json();
                    pm.collectionVariables.set("bearerTokenExpiresOn", resJson.expires_on);
                    pm.collectionVariables.set("bearerToken", resJson.access_token);
                }
            });
        }
    });
    ```

1. Save the collection.

<a name="list-search-services"></a>

## List services in a subscription

The following GET request lists the search services already created in your subscription. If a search service exists, you'll get its name, resource group, region, and resource ID.

The first command returns all search services.

```azurepowershell-interactive
Get-AzResource -ResourceType Microsoft.Search/searchServices | ft
```

From the list of services, return information about a specific resource.

```azurepowershell-interactive
Get-AzResource -ResourceName <service-name>
```

Results should look similar to the following output.

```
Name              : my-demo-searchapp
ResourceGroupName : demo-westus
ResourceType      : Microsoft.Search/searchServices
Location          : westus
ResourceId        : /subscriptions/<alphanumeric-subscription-ID>/resourceGroups/demo-westus/providers/Microsoft.Search/searchServices/my-demo-searchapp
```

## Import Az.Search

Commands from [**Az.Search**](/powershell/module/az.search) are not available until you load the module.

```azurepowershell-interactive
Install-Module -Name Az.Search
```



## Get search service information

After **Az.Search** is imported and you know the resource group containing your search service, run [Get-AzSearchService](/powershell/module/az.search/get-azsearchservice) to return the service definition, including name, region, tier, and replica and partition counts. For this command, provide the resource group that contains the search service.

```azurepowershell-interactive
Get-AzSearchService -ResourceGroupName <resource-group-name>
```

Results should look similar to the following output.

```
Name              : my-demo-searchapp
ResourceGroupName : demo-westus
ResourceType      : Microsoft.Search/searchServices
Location          : West US
Sku               : Standard
ReplicaCount      : 1
PartitionCount    : 1
HostingMode       : Default
ResourceId        : /subscriptions/<alphanumeric-subscription-ID>/resourceGroups/demo-westus/providers/Microsoft.Search/searchServices/my-demo-searchapp
```

## Create or delete a service

[**New-AzSearchService**](/powershell/module/az.search/new-azsearchservice) is used to [create a new search service](search-create-service-portal.md).

```azurepowershell-interactive
New-AzSearchService -ResourceGroupName <resource-group-name> -Name <search-service-name> -Sku "Standard" -Location "West US" -PartitionCount 3 -ReplicaCount 3 -HostingMode Default
``` 
Results should look similar to the following output.

```
ResourceGroupName : demo-westus
Name              : my-demo-searchapp
Id                : /subscriptions/<alphanumeric-subscription-ID>/demo-westus/providers/Microsoft.Search/searchServices/my-demo-searchapp
Location          : West US
Sku               : Standard
ReplicaCount      : 3
PartitionCount    : 3
HostingMode       : Default
Tags
```     

### Create a service with IP rules

Depending on your security requirements, you may want to create a search service with an [IP firewall configured](service-configure-firewall.md). To do so, first define the IP Rules and then pass them to the `IPRuleList` parameter as shown below.

```azurepowershell-interactive
$ipRules = @([pscustomobject]@{Value="55.5.63.73"},
		[pscustomobject]@{Value="52.228.215.197"},
		[pscustomobject]@{Value="101.37.221.205"})

 New-AzSearchService -ResourceGroupName <resource-group-name> `
                      -Name <search-service-name> `
                      -Sku Standard `
                      -Location "West US" `
                      -PartitionCount 3 -ReplicaCount 3 `
                      -HostingMode Default `
                      -IPRuleList $ipRules
```

### Create a service with a system assigned managed identity

In some cases, such as when [using managed identity to connect to a data source](search-howto-managed-identities-storage.md), you will need to turn on [system assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md). This is done by adding `-IdentityType SystemAssigned` to the command.

```azurepowershell-interactive
New-AzSearchService -ResourceGroupName <resource-group-name> `
                      -Name <search-service-name> `
                      -Sku Standard `
                      -Location "West US" `
                      -PartitionCount 3 -ReplicaCount 3 `
                      -HostingMode Default `
                      -IdentityType SystemAssigned
```

## Create a service with a private endpoint

[Private Endpoints](../private-link/private-endpoint-overview.md) for Azure Cognitive Search allow a client on a virtual network to securely access data in a search index over a [Private Link](../private-link/private-link-overview.md). The private endpoint uses an IP address from the [virtual network address space](../virtual-network/ip-services/private-ip-addresses.md) for your search service. Network traffic between the client and the search service traverses over the virtual network and a private link on the Microsoft backbone network, eliminating exposure from the public internet. For more details, see 
[Creating a private endpoint for Azure Cognitive Search](service-create-private-endpoint.md)

The following example shows how to create a search service with a private endpoint. 

First, deploy a search service with `PublicNetworkAccess` set to `Disabled`.

```azurepowershell-interactive
$searchService = New-AzSearchService `
    -ResourceGroupName <search-service-resource-group-name> `
    -Name <search-service-name> `
    -Sku Standard `
    -Location "West US" `
    -PartitionCount 1 -ReplicaCount 1 `
    -HostingMode Default `
    -PublicNetworkAccess Disabled
```

Next, create a virtual network, private network connection, and the private endpoint.

```azurepowershell-interactive
# Create the subnet
$subnetConfig = New-AzVirtualNetworkSubnetConfig `
    -Name <subnet-name> `
    -AddressPrefix 10.1.0.0/24 `
    -PrivateEndpointNetworkPolicies Disabled 

# Create the virtual network
$virtualNetwork = New-AzVirtualNetwork `
    -ResourceGroupName <vm-resource-group-name> `
    -Location "West US" `
    -Name <virtual-network-name> `
    -AddressPrefix 10.1.0.0/16 `
    -Subnet $subnetConfig

# Create the private network connection
$privateLinkConnection = New-AzPrivateLinkServiceConnection `
    -Name <private-link-name> `
    -PrivateLinkServiceId $searchService.Id `
    -GroupId searchService

# Create the private endpoint
$privateEndpoint = New-AzPrivateEndpoint `
    -Name <private-endpoint-name> `
    -ResourceGroupName <private-endpoint-resource-group-name> `
    -Location "West US" `
    -Subnet $virtualNetwork.subnets[0] `
    -PrivateLinkServiceConnection $privateLinkConnection
```

Finally, create a private DNS Zone. 

```azurepowershell-interactive
## Create private dns zone
$zone = New-AzPrivateDnsZone `
    -ResourceGroupName <private-dns-resource-group-name> `
    -Name "privatelink.search.windows.net"

## Create dns network link
$link = New-AzPrivateDnsVirtualNetworkLink `
    -ResourceGroupName <private-dns-link-resource-group-name> `
    -ZoneName "privatelink.search.windows.net" `
    -Name "myLink" `
    -VirtualNetworkId $virtualNetwork.Id

## Create DNS configuration 
$config = New-AzPrivateDnsZoneConfig `
    -Name "privatelink.search.windows.net" `
    -PrivateDnsZoneId $zone.ResourceId

## Create DNS zone group
New-AzPrivateDnsZoneGroup `
    -ResourceGroupName <private-dns-zone-resource-group-name> `
    -PrivateEndpointName <private-endpoint-name> `
    -Name 'myZoneGroup' `
    -PrivateDnsZoneConfig $config
```

For more details on creating private endpoints in PowerShell, see this [Private Link Quickstart](../private-link/create-private-endpoint-powershell.md)

### Manage private endpoint connections

In addition to creating a private endpoint connection, you can also `Get`, `Set`, and `Remove` the connection.

[Get-AzSearchPrivateEndpointConnection](/powershell/module/az.search/Get-AzSearchPrivateEndpointConnection) is used to retrieve a private endpoint connection and to see its status.

```azurepowershell-interactive
Get-AzSearchPrivateEndpointConnection -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name>
```

[Set-AzSearchPrivateEndpointConnection](/powershell/module/az.search/Set-AzSearchPrivateEndpointConnection) is used to update the connection. The following example sets a private endpoint connection to rejected:

```azurepowershell-interactive
Set-AzSearchPrivateEndpointConnection -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -Name <pe-connection-name> -Status Rejected  -Description "Rejected"
```

[Remove-AzSearchPrivateEndpointConnection](/powershell/module/az.search/Remove-AzSearchPrivateEndpointConnection) is used to delete the private endpoint connection.

```azurepowershell-interactive
 Remove-AzSearchPrivateEndpointConnection -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -Name <pe-connection-name>
```

## Regenerate admin keys

[**New-AzSearchAdminKey**](/powershell/module/az.search/new-azsearchadminkey) is used to roll over admin [API keys](search-security-api-keys.md). Two admin keys are created with each service for authenticated access. Keys are required on every request. Both admin keys are functionally equivalent, granting full write access to a search service with the ability to retrieve any information, or create and delete any object. Two keys exist so that you can use one while replacing the other. 

You can only regenerate one at a time, specified as either the `primary` or `secondary` key. For uninterrupted service, remember to update all client code to use a secondary key while rolling over the primary key. Avoid changing the keys while operations are in flight.

As you might expect, if you regenerate keys without updating client code, requests using the old key will fail. Regenerating all new keys does not permanently lock you out of your service, and you can still access the service through the portal. After you regenerate primary and secondary keys, you can update client code to use the new keys and operations will resume accordingly.

Values for the API keys are generated by the service. You cannot provide a custom key for Azure Cognitive Search to use. Similarly, there is no user-defined name for admin API-keys. References to the key are fixed strings, either `primary` or `secondary`. 

```azurepowershell-interactive
New-AzSearchAdminKey -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -KeyKind Primary
```

Results should look similar to the following output. Both keys are returned even though you only change one at a time.

```
Primary                    Secondary
-------                    ---------
<alphanumeric-guid>        <alphanumeric-guid>  
```

## Create or delete query keys

[**New-AzSearchQueryKey**](/powershell/module/az.search/new-azsearchquerykey) is used to create query [API keys](search-security-api-keys.md) for read-only access from client apps to an Azure Cognitive Search index. Query keys are used to authenticate to a specific index for the purpose of retrieving search results. Query keys do not grant read-only access to other items on the service, such as an index, data source, or indexer.

You cannot provide a key for Azure Cognitive Search to use. API keys are generated by the service.

```azurepowershell-interactive
New-AzSearchQueryKey -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -Name <query-key-name> 
```

## Scale replicas and partitions

[**Set-AzSearchService**](/powershell/module/az.search/set-azsearchservice) is used to [increase or decrease replicas and partitions](search-capacity-planning.md) to readjust billable resources within your service. Increasing replicas or partitions adds to your bill, which has both fixed and variable charges. If you have a temporary need for additional processing power, you can increase replicas and partitions to handle the workload. The monitoring area in the Overview portal page has tiles on query latency, queries per second, and throttling, indicating whether current capacity is adequate.

It can take a while to add or remove resourcing. Adjustments to capacity occur in the background, allowing existing workloads to continue. Additional capacity is used for incoming requests as soon as it's ready, with no additional configuration required. 

Removing capacity can be disruptive. Stopping all indexing and indexer jobs prior to reducing capacity is recommended to avoid dropped requests. If that isn't feasible, you might consider reducing capacity incrementally, one replica and partition at a time, until your new target levels are reached.

Once you submit the command, there is no way to terminate it midway through. You will have to wait until the command is finished before revising the counts.

```azurepowershell-interactive
Set-AzSearchService -ResourceGroupName <search-service-resource-group-name> -Name <search-service-name> -PartitionCount 6 -ReplicaCount 6
```

Results should look similar to the following output.

```
ResourceGroupName : demo-westus
Name              : my-demo-searchapp
Location          : West US
Sku               : Standard
ReplicaCount      : 6
PartitionCount    : 6
HostingMode       : Default
Id                : /subscriptions/65a1016d-0f67-45d2-b838-b8f373d6d52e/resourceGroups/demo-westus/providers/Microsoft.Search/searchServices/my-demo-searchapp
```

## Create a shared private link resource

Private endpoints of secured resources that are created through Azure Cognitive Search APIs are referred to as *shared private link resources*. This is because you're "sharing" access to a resource, such as a storage account, that has been integrated with the [Azure Private Link service](https://azure.microsoft.com/services/private-link/).

If you're using an indexer to index data in Azure Cognitive Search, and your data source is on a private network, you can create an outbound [private endpoint connection](../private-link/private-endpoint-overview.md) to reach the data.

A full list of the Azure Resources for which you can create outbound private endpoints from Azure Cognitive Search can be found [here](search-indexer-howto-access-private.md#group-ids) along with the related **Group ID** values.

[New-AzSearchSharedPrivateLinkResource](/powershell/module/az.search/New-AzSearchSharedPrivateLinkResource) is used to create the shared private link resource. Keep in mind that some configuration may be required for the data source before running this command.

```azurepowershell-interactive
New-AzSearchSharedPrivateLinkResource -ResourceGroupName <search-serviceresource-group-name> -ServiceName <search-service-name> -Name <spl-name> -PrivateLinkResourceId /subscriptions/<alphanumeric-subscription-ID>/resourceGroups/<storage-resource-group-name>/providers/Microsoft.Storage/storageAccounts/myBlobStorage -GroupId <group-id> -RequestMessage "Please approve" 
```

[Get-AzSearchSharedPrivateLinkResource](/powershell/module/az.search/Get-AzSearchSharedPrivateLinkResource)
allows you to retrieve the shared private link resources and view their status.

```azurepowershell-interactive
Get-AzSearchSharedPrivateLinkResource -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -Name <spl-name>
```

You'll need to approve the connection with the following command before it can be used.

```azurepowershell-interactive
Approve-AzPrivateEndpointConnection `
    -Name <spl-name> `
    -ServiceName <search-service-name> `
    -ResourceGroupName <search-service-resource-group-name> `
    -Description = "Approved"
```

[Remove-AzSearchSharedPrivateLinkResource](/powershell/module/az.search/Remove-AzSearchSharedPrivateLinkResource) is used to delete the shared private link resource.

```azurepowershell-interactive
$job = Remove-AzSearchSharedPrivateLinkResource -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -Name <spl-name> -Force -AsJob

$job | Get-Job
```

For full details on setting up shared private link resources, see the documentation on [making indexer connections through a private endpoint](search-indexer-howto-access-private.md).
 -->

## Next steps

Build an [index](search-what-is-an-index.md), then [query an index](search-query-overview.md) using the portal, REST APIs, or the .NET SDK.

* [Create an Azure Cognitive Search index in the Azure portal](search-get-started-portal.md)
* [Set up an indexer to load data from other services](search-indexer-overview.md)
* [Query an Azure Cognitive Search index using Search explorer in the Azure portal](search-explorer.md)
* [How to use Azure Cognitive Search in .NET](search-howto-dotnet-sdk.md)