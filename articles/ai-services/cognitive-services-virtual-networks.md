---
title: Configure Virtual Networks for Azure AI services
titleSuffix: Azure AI services
description: Configure layered network security for your Azure AI services resources.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-services
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: how-to
ms.date: 10/27/2023
ms.author: aahi
---

# Configure Azure AI services virtual networks

Azure AI services provide a layered security model. This model enables you to secure your Azure AI services accounts to a specific subset of networks​. When network rules are configured, only applications that request data over the specified set of networks can access the account. You can limit access to your resources with *request filtering*, which allows requests that originate only from specified IP addresses, IP ranges, or from a list of subnets in [Azure Virtual Networks](../virtual-network/virtual-networks-overview.md).

An application that accesses an Azure AI services resource when network rules are in effect requires authorization. Authorization is supported with [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md) credentials or with a valid API key.

> [!IMPORTANT]
> Turning on firewall rules for your Azure AI services account blocks incoming requests for data by default. To allow requests through, one of the following conditions needs to be met:
>
> - The request originates from a service that operates within an Azure Virtual Network on the allowed subnet list of the target Azure AI services account. The endpoint request that originated from the virtual network needs to be set as the [custom subdomain](cognitive-services-custom-subdomains.md) of your Azure AI services account.
> - The request originates from an allowed list of IP addresses.
>
> Requests that are blocked include those from other Azure services, from the Azure portal, and from logging and metrics services.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Scenarios

To secure your Azure AI services resource, you should first configure a rule to deny access to traffic from all networks, including internet traffic, by default. Then, configure rules that grant access to traffic from specific virtual networks. This configuration enables you to build a secure network boundary for your applications. You can also configure rules to grant access to traffic from select public internet IP address ranges and enable connections from specific internet or on-premises clients.

Network rules are enforced on all network protocols to Azure AI services, including REST and WebSocket. To access data by using tools such as the Azure test consoles, explicit network rules must be configured. You can apply network rules to existing Azure AI services resources, or when you create new Azure AI services resources. After network rules are applied, they're enforced for all requests.

## Supported regions and service offerings

Virtual networks are supported in [regions where Azure AI services are available](https://azure.microsoft.com/global-infrastructure/services/). Azure AI services support service tags for network rules configuration. The services listed here are included in the `CognitiveServicesManagement` service tag.

> [!div class="checklist"]
> - Anomaly Detector
> - Azure OpenAI
> - Content Moderator
> - Custom Vision
> - Face
> - Language Understanding (LUIS)
> - Personalizer
> - Speech service
> - Language
> - QnA Maker
> - Translator

> [!NOTE]
> If you use Azure OpenAI, LUIS, Speech Services, or Language services, the `CognitiveServicesManagement` tag only enables you to use the service by using the SDK or REST API. To access and use Azure OpenAI Studio, LUIS portal, Speech Studio, or Language Studio from a virtual network, you need to use the following tags:
>
> - `AzureActiveDirectory`
> - `AzureFrontDoor.Frontend`
> - `AzureResourceManager`
> - `CognitiveServicesManagement`
> - `CognitiveServicesFrontEnd`

## Change the default network access rule

By default, Azure AI services resources accept connections from clients on any network. To limit access to selected networks, you must first change the default action.

> [!WARNING]
> Making changes to network rules can impact your applications' ability to connect to Azure AI services. Setting the default network rule to *deny* blocks all access to the data unless specific network rules that *grant* access are also applied.
>
> Before you change the default rule to deny access, be sure to grant access to any allowed networks by using network rules. If you allow listing for the IP addresses for your on-premises network, be sure to add all possible outgoing public IP addresses from your on-premises network.

### Manage default network access rules

You can manage default network access rules for Azure AI services resources through the Azure portal, PowerShell, or the Azure CLI.

# [Azure portal](#tab/portal)

1. Go to the Azure AI services resource you want to secure.

1. Select **Resource Management** to expand it, then select **Networking**.

   :::image type="content" source="media/vnet/virtual-network-blade.png" alt-text="Screenshot shows the Networking page with Selected Networks and Private Endpoints selected." lightbox="media/vnet/virtual-network-blade.png":::

1. To deny access by default, under **Firewalls and virtual networks**, select **Selected Networks and Private Endpoints**.

   With this setting alone, unaccompanied by configured virtual networks or address ranges, all access is effectively denied. When all access is denied, requests that attempt to consume the Azure AI services resource aren't permitted. The Azure portal, Azure PowerShell, or the Azure CLI can still be used to configure the Azure AI services resource.

1. To allow traffic from all networks, select **All networks**.

   :::image type="content" source="media/vnet/virtual-network-deny.png" alt-text="Screenshot shows the Networking page with All networks selected." lightbox="media/vnet/virtual-network-deny.png":::

1. Select **Save** to apply your changes.

# [PowerShell](#tab/powershell)

1. Install the [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps), or select **Open Cloudshell**.

1. Display the status of the default rule for the Azure AI services resource.

   ```azurepowershell-interactive
   $parameters = @{
     "ResourceGroupName" = "myresourcegroup"
     "Name" = "myaccount"
   }
   (Get-AzCognitiveServicesAccountNetworkRuleSet @parameters).DefaultAction
   ```

   You can get values for your resource group `myresourcegroup` and the name of your Azure services resource `myaccount` from the Azure portal.

1. Set the default rule to deny network access.

    ```azurepowershell-interactive
    $parameters = @{
        "ResourceGroupName" = "myresourcegroup"
        "Name" = "myaccount"
        "DefaultAction" = "Deny"
    }
    Update-AzCognitiveServicesAccountNetworkRuleSet @parameters
    ```

1. Set the default rule to allow network access.

    ```azurepowershell-interactive
    $parameters = @{
        "ResourceGroupName" = "myresourcegroup"
        "Name" = "myaccount"
        "DefaultAction" = "Allow"
    }
    Update-AzCognitiveServicesAccountNetworkRuleSet @parameters
    ```

# [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli), or select **Open Cloudshell**.

1. Display the status of the default rule for the Azure AI services resource.

    ```azurecli-interactive
    az cognitiveservices account show \
        --resource-group "myresourcegroup" --name "myaccount" \
        --query properties.networkAcls.defaultAction
    ```

1. Get the resource ID for use in the later steps.

   ```azurecli-interactive
   resourceId=$(az cognitiveservices account show
       --resource-group "myresourcegroup" \
       --name "myaccount" --query id --output tsv)
   ```

1. Set the default rule to deny network access by default.

    ```azurecli-interactive
    az resource update \
        --ids $resourceId \
        --set properties.networkAcls="{'defaultAction':'Deny'}"
    ```

1. Set the default rule to allow network access by default.

    ```azurecli-interactive
    az resource update \
        --ids $resourceId \
        --set properties.networkAcls="{'defaultAction':'Allow'}"
    ```

***

## Grant access from a virtual network

You can configure Azure AI services resources to allow access from specific subnets only. The allowed subnets might belong to a virtual network in the same subscription or in a different subscription. The other subscription can belong to a different Microsoft Entra tenant.

Enable a *service endpoint* for Azure AI services within the virtual network. The service endpoint routes traffic from the virtual network through an optimal path to the Azure AI service. For more information, see [Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

The identities of the subnet and the virtual network are also transmitted with each request. Administrators can then configure network rules for the Azure AI services resource to allow requests from specific subnets in a virtual network. Clients granted access by these network rules must continue to meet the authorization requirements of the Azure AI services resource to access the data.

Each Azure AI services resource supports up to 100 virtual network rules, which can be combined with IP network rules. For more information, see [Grant access from an internet IP range](#grant-access-from-an-internet-ip-range) later in this article.

### Set required permissions

To apply a virtual network rule to an Azure AI services resource, you need the appropriate permissions for the subnets to add. The required permission is the default *Contributor* role or the *Cognitive Services Contributor* role. Required permissions can also be added to custom role definitions.

The Azure AI services resource and the virtual networks that are granted access might be in different subscriptions, including subscriptions that are part of a different Microsoft Entra tenant.

> [!NOTE]
> Configuration of rules that grant access to subnets in virtual networks that are a part of a different Microsoft Entra tenant are currently supported only through PowerShell, the Azure CLI, and the REST APIs. You can view these rules in the Azure portal, but you can't configure them.

### Configure virtual network rules

You can manage virtual network rules for Azure AI services resources through the Azure portal, PowerShell, or the Azure CLI.

# [Azure portal](#tab/portal)

To grant access to a virtual network with an existing network rule:

1. Go to the Azure AI services resource you want to secure.

1. Select **Resource Management** to expand it, then select **Networking**.

1. Confirm that you selected **Selected Networks and Private Endpoints**.

1. Under **Allow access from**, select **Add existing virtual network**.

   :::image type="content" source="media/vnet/virtual-network-add-existing.png" alt-text="Screenshot shows the Networking page with Selected Networks and Private Endpoints selected and Add existing virtual network highlighted." lightbox="media/vnet/virtual-network-add-existing.png":::

1. Select the **Virtual networks** and **Subnets** options, and then select **Enable**.

   :::image type="content" source="media/vnet/virtual-network-add-existing-details.png" alt-text="Screenshot shows the Add networks dialog box where you can enter a virtual network and subnet.":::

   > [!NOTE]
   > If a service endpoint for Azure AI services wasn't previously configured for the selected virtual network and subnets, you can configure it as part of this operation.
   >
   > Currently, only virtual networks that belong to the same Microsoft Entra tenant are available for selection during rule creation. To grant access to a subnet in a virtual network that belongs to another tenant, use PowerShell, the Azure CLI, or the REST APIs.

1. Select **Save** to apply your changes.

To create a new virtual network and grant it access:

1. On the same page as the previous procedure, select **Add new virtual network**.

   :::image type="content" source="media/vnet/virtual-network-add-new.png" alt-text="Screenshot shows the Networking page with Selected Networks and Private Endpoints selected and Add new virtual network highlighted." lightbox="media/vnet/virtual-network-add-new.png":::

1. Provide the information necessary to create the new virtual network, and then select **Create**.

   :::image type="content" source="media/vnet/virtual-network-create.png" alt-text="Screenshot shows the Create virtual network dialog box.":::

1. Select **Save** to apply your changes.

To remove a virtual network or subnet rule:

1. On the same page as the previous procedures, select **...(More options)** to open the context menu for the virtual network or subnet, and select **Remove**.

   :::image type="content" source="media/vnet/virtual-network-remove.png" alt-text="Screenshot shows the option to remove a virtual network." lightbox="media/vnet/virtual-network-remove.png":::

1. Select **Save** to apply your changes.

# [PowerShell](#tab/powershell)

1. Install the [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps), or select **Open Cloudshell**.

1. List the configured virtual network rules.

    ```azurepowershell-interactive
    $parameters = @{
       "ResourceGroupName" = "myresourcegroup"
       "Name" = "myaccount"
    }
    (Get-AzCognitiveServicesAccountNetworkRuleSet @parameters).VirtualNetworkRules
    ```

1. Enable a service endpoint for Azure AI services on an existing virtual network and subnet.

    ```azurepowershell-interactive
    Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" `
        -Name "myvnet" | Set-AzVirtualNetworkSubnetConfig -Name "mysubnet" `
        -AddressPrefix "CIDR" `
        -ServiceEndpoint "Microsoft.CognitiveServices" | Set-AzVirtualNetwork
    ```

1. Add a network rule for a virtual network and subnet.

    ```azurepowershell-interactive
    $subParameters = @{
        "ResourceGroupName" = "myresourcegroup"
        "Name" = "myvnet"
    }
    $subnet = Get-AzVirtualNetwork @subParameters | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"

    $parameters = @{
        -ResourceGroupName "myresourcegroup"
        -Name "myaccount"
        -VirtualNetworkResourceId $subnet.Id
    }
    Add-AzCognitiveServicesAccountNetworkRule @parameters
    ```

    > [!TIP]
    > To add a network rule for a subnet in a virtual network that belongs to another Microsoft Entra tenant, use a fully-qualified `VirtualNetworkResourceId` parameter in the form `/subscriptions/subscription-ID/resourceGroups/resourceGroup-Name/providers/Microsoft.Network/virtualNetworks/vNet-name/subnets/subnet-name`.

1. Remove a network rule for a virtual network and subnet.

    ```azurepowershell-interactive
    $subParameters = @{
        "ResourceGroupName" = "myresourcegroup"
        "Name" = "myvnet"
    }
    $subnet = Get-AzVirtualNetwork @subParameters | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"

    $parameters = @{
        "ResourceGroupName" = "myresourcegroup"
        "Name" = "myaccount"
        "VirtualNetworkResourceId" = $subnet.Id
    }
    Remove-AzCognitiveServicesAccountNetworkRule @parameters
    ```

# [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli), or select **Open Cloudshell**.

1. List the configured virtual network rules.

    ```azurecli-interactive
    az cognitiveservices account network-rule list \
        --resource-group "myresourcegroup" --name "myaccount" \
        --query virtualNetworkRules
    ```

1. Enable a service endpoint for Azure AI services on an existing virtual network and subnet.

    ```azurecli-interactive
    az network vnet subnet update --resource-group "myresourcegroup" --name "mysubnet" \
    --vnet-name "myvnet" --service-endpoints "Microsoft.CognitiveServices"
    ```

1. Add a network rule for a virtual network and subnet.

    ```azurecli-interactive
    subnetid=$(az network vnet subnet show \
        --resource-group "myresourcegroup" --name "mysubnet" --vnet-name "myvnet" \
        --query id --output tsv)

    # Use the captured subnet identifier as an argument to the network rule addition
    az cognitiveservices account network-rule add \
        --resource-group "myresourcegroup" --name "myaccount" \
        --subnet $subnetid
    ```

    > [!TIP]
    > To add a rule for a subnet in a virtual network that belongs to another Microsoft Entra tenant, use a fully-qualified subnet ID in the form `/subscriptions/subscription-ID/resourceGroups/resourceGroup-Name/providers/Microsoft.Network/virtualNetworks/vNet-name/subnets/subnet-name`.
    > 
    > You can use the `--subscription` parameter to retrieve the subnet ID for a virtual network that belongs to another Microsoft Entra tenant.

1. Remove a network rule for a virtual network and subnet.

    ```azurecli-interactive
    $subnetid=(az network vnet subnet show \
        --resource-group "myresourcegroup" --name "mysubnet" --vnet-name "myvnet" \
        --query id --output tsv)

    # Use the captured subnet identifier as an argument to the network rule removal
    az cognitiveservices account network-rule remove \
        --resource-group "myresourcegroup" --name "myaccount" \
        --subnet $subnetid
    ```

***

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to *deny*, or network rules have no effect.

## Grant access from an internet IP range

You can configure Azure AI services resources to allow access from specific public internet IP address ranges. This configuration grants access to specific services and on-premises networks, which effectively block general internet traffic.

You can specify the allowed internet address ranges by using [CIDR format (RFC 4632)](https://tools.ietf.org/html/rfc4632) in the form `192.168.0.0/16` or as individual IP addresses like `192.168.0.1`.

   > [!Tip]
   > Small address ranges that use `/31` or `/32` prefix sizes aren't supported. Configure these ranges by using individual IP address rules.

IP network rules are only allowed for *public internet* IP addresses. IP address ranges reserved for private networks aren't allowed in IP rules. Private networks include addresses that start with `10.*`, `172.16.*` - `172.31.*`, and `192.168.*`. For more information, see [Private Address Space (RFC 1918)](https://tools.ietf.org/html/rfc1918#section-3).

Currently, only IPv4 addresses are supported. Each Azure AI services resource supports up to 100 IP network rules, which can be combined with [virtual network rules](#grant-access-from-a-virtual-network).

### Configure access from on-premises networks

To grant access from your on-premises networks to your Azure AI services resource with an IP network rule, identify the internet-facing IP addresses used by your network. Contact your network administrator for help.

If you use Azure ExpressRoute on-premises for public peering or Microsoft peering, you need to identify the NAT IP addresses. For more information, see [What is Azure ExpressRoute](../expressroute/expressroute-introduction.md).

For public peering, each ExpressRoute circuit by default uses two NAT IP addresses. Each is applied to Azure service traffic when the traffic enters the Microsoft Azure network backbone. For Microsoft peering, the NAT IP addresses that are used are either customer provided or supplied by the service provider. To allow access to your service resources, you must allow these public IP addresses in the resource IP firewall setting.

To find your public peering ExpressRoute circuit IP addresses, [open a support ticket with ExpressRoute](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) use the Azure portal. For more information, see [NAT requirements for Azure public peering](../expressroute/expressroute-nat.md#nat-requirements-for-azure-public-peering).

### Managing IP network rules

You can manage IP network rules for Azure AI services resources through the Azure portal, PowerShell, or the Azure CLI.

# [Azure portal](#tab/portal)

1. Go to the Azure AI services resource you want to secure.

1. Select **Resource Management** to expand it, then select **Networking**.

1. Confirm that you selected **Selected Networks and Private Endpoints**.

1. Under **Firewalls and virtual networks**, locate the **Address range** option. To grant access to an internet IP range, enter the IP address or address range (in [CIDR format](https://tools.ietf.org/html/rfc4632)). Only valid public IP (nonreserved) addresses are accepted.

   :::image type="content" source="media/vnet/virtual-network-add-ip-range.png" alt-text="Screenshot shows the Networking page with Selected Networks and Private Endpoints selected and the Address range highlighted." lightbox="media/vnet/virtual-network-add-ip-range.png":::

   To remove an IP network rule, select the trash can <span class="docon docon-delete x-hidden-focus"></span> icon next to the address range.

1. Select **Save** to apply your changes.

# [PowerShell](#tab/powershell)

1. Install the [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps), or select **Open Cloudshell**.

1. List the configured IP network rules.

   ```azurepowershell-interactive
   $parameters = @{
    "ResourceGroupName" = "myresourcegroup"
    "Name" = "myaccount"
    }
    (Get-AzCognitiveServicesAccountNetworkRuleSet @parameters).IPRules
    ```

1. Add a network rule for an individual IP address.

    ```azurepowershell-interactive
    $parameters = @{
        "ResourceGroupName" = "myresourcegroup"
        "Name" = "myaccount"
        "IPAddressOrRange" = "ipaddress"
    }
    Add-AzCognitiveServicesAccountNetworkRule @parameters
    ```

1. Add a network rule for an IP address range.

    ```azurepowershell-interactive
    $parameters = @{
        "ResourceGroupName" = "myresourcegroup"
        "Name" = "myaccount"
        "IPAddressOrRange" = "CIDR"
    }
    Add-AzCognitiveServicesAccountNetworkRule @parameters
    ```

1. Remove a network rule for an individual IP address.

    ```azurepowershell-interactive
    $parameters = @{
        "ResourceGroupName" = "myresourcegroup"
        "Name" = "myaccount"
        "IPAddressOrRange" = "ipaddress"
    }
    Remove-AzCognitiveServicesAccountNetworkRule @parameters
    ```

1. Remove a network rule for an IP address range.

    ```azurepowershell-interactive
    $parameters = @{
        "ResourceGroupName" = "myresourcegroup"
        "Name" = "myaccount"
        "IPAddressOrRange" = "CIDR"
    }
    Remove-AzCognitiveServicesAccountNetworkRule @parameters
    ```

# [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli), or select **Open Cloudshell**.

1. List the configured IP network rules.

    ```azurecli-interactive
    az cognitiveservices account network-rule list \
        --resource-group "myresourcegroup" --name "myaccount" --query ipRules
    ```

1. Add a network rule for an individual IP address.

    ```azurecli-interactive
    az cognitiveservices account network-rule add \
        --resource-group "myresourcegroup" --name "myaccount" \
        --ip-address "ipaddress"
    ```

1. Add a network rule for an IP address range.

    ```azurecli-interactive
    az cognitiveservices account network-rule add \
        --resource-group "myresourcegroup" --name "myaccount" \
        --ip-address "CIDR"
    ```

1. Remove a network rule for an individual IP address.

    ```azurecli-interactive
    az cognitiveservices account network-rule remove \
        --resource-group "myresourcegroup" --name "myaccount" \
        --ip-address "ipaddress"
    ```

1. Remove a network rule for an IP address range.

    ```azurecli-interactive
    az cognitiveservices account network-rule remove \
        --resource-group "myresourcegroup" --name "myaccount" \
        --ip-address "CIDR"
    ```

***

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to *deny*, or network rules have no effect.

## Use private endpoints

You can use [private endpoints](../private-link/private-endpoint-overview.md) for your Azure AI services resources to allow clients on a virtual network to securely access data over  [Azure Private Link](../private-link/private-link-overview.md). The private endpoint uses an IP address from the virtual network address space for your Azure AI services resource. Network traffic between the clients on the virtual network and the resource traverses the virtual network and a private link on the Microsoft Azure backbone network, which eliminates exposure from the public internet.

Private endpoints for Azure AI services resources let you:

- Secure your Azure AI services resource by configuring the firewall to block all connections on the public endpoint for the Azure AI service.
- Increase security for the virtual network, by enabling you to block exfiltration of data from the virtual network.
- Securely connect to Azure AI services resources from on-premises networks that connect to the virtual network by using [Azure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoutes](../expressroute/expressroute-locations.md) with private-peering.

### Understand private endpoints

A private endpoint is a special network interface for an Azure resource in your [virtual network](../virtual-network/virtual-networks-overview.md). Creating a private endpoint for your Azure AI services resource provides secure connectivity between clients in your virtual network and your resource. The private endpoint is assigned an IP address from the IP address range of your virtual network. The connection between the private endpoint and the Azure AI service uses a secure private link.

Applications in the virtual network can connect to the service over the private endpoint seamlessly. Connections use the same connection strings and authorization mechanisms that they would use otherwise. The exception is Speech Services, which require a separate endpoint. For more information, see [Private endpoints with the Speech Services](#use-private-endpoints-with-the-speech-service) in this article. Private endpoints can be used with all protocols supported by the Azure AI services resource, including REST.

Private endpoints can be created in subnets that use service endpoints. Clients in a subnet can connect to one Azure AI services resource using private endpoint, while using service endpoints to access others. For more information, see [Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

When you create a private endpoint for an Azure AI services resource in your virtual network, Azure sends a consent request for approval to the Azure AI services resource owner. If the user who requests the creation of the private endpoint is also an owner of the resource, this consent request is automatically approved.

Azure AI services resource owners can manage consent requests and the private endpoints through the **Private endpoint connection** tab for the Azure AI services resource in the [Azure portal](https://portal.azure.com).

### Specify private endpoints

When you create a private endpoint, specify the Azure AI services resource that it connects to. For more information on creating a private endpoint, see:

- [Create a private endpoint by using the Azure portal](../private-link/create-private-endpoint-portal.md)
- [Create a private endpoint by using Azure PowerShell](../private-link/create-private-endpoint-powershell.md)
- [Create a private endpoint by using the Azure CLI](../private-link/create-private-endpoint-cli.md)

### Connect to private endpoints

> [!NOTE]
> Azure OpenAI Service uses a different private DNS zone and public DNS zone forwarder than other Azure AI services. For the correct zone and forwarder names, see [Azure services DNS zone configuration](../private-link/private-endpoint-dns.md#azure-services-dns-zone-configuration).

Clients on a virtual network that use the private endpoint use the same connection string for the Azure AI services resource as clients connecting to the public endpoint. The exception is the Speech service, which requires a separate endpoint. For more information, see [Use private endpoints with the Speech service](#use-private-endpoints-with-the-speech-service) in this article. DNS resolution automatically routes the connections from the virtual network to the Azure AI services resource over a private link.

By default, Azure creates a [private DNS zone](../dns/private-dns-overview.md) attached to the virtual network with the necessary updates for the private endpoints. If you use your own DNS server, you might need to make more changes to your DNS configuration. For updates that might be required for private endpoints, see [Apply DNS changes for private endpoints](#apply-dns-changes-for-private-endpoints) in this article.

### Use private endpoints with the Speech service

See [Use Speech service through a private endpoint](Speech-Service/speech-services-private-link.md).

### Apply DNS changes for private endpoints

When you create a private endpoint, the DNS `CNAME` resource record for the Azure AI services resource is updated to an alias in a subdomain with the prefix `privatelink`. By default, Azure also creates a private DNS zone that corresponds to the `privatelink` subdomain, with the DNS A resource records for the private endpoints. For more information, see [What is Azure Private DNS](../dns/private-dns-overview.md).

When you resolve the endpoint URL from outside the virtual network with the private endpoint, it resolves to the public endpoint of the Azure AI services resource. When it's resolved from the virtual network hosting the private endpoint, the endpoint URL resolves to the private endpoint's IP address.

This approach enables access to the Azure AI services resource using the same connection string for clients in the virtual network that hosts the private endpoints and clients outside the virtual network.

If you use a custom DNS server on your network, clients must be able to resolve the fully qualified domain name (FQDN) for the Azure AI services resource endpoint to the private endpoint IP address. Configure your DNS server to delegate your private link subdomain to the private DNS zone for the virtual network.

> [!TIP]
> When you use a custom or on-premises DNS server, you should configure your DNS server to resolve the Azure AI services resource name in the `privatelink` subdomain to the private endpoint IP address. Delegate the `privatelink` subdomain to the private DNS zone of the virtual network. Alternatively, configure the DNS zone on your DNS server and add the DNS A records.

For more information on configuring your own DNS server to support private endpoints, see the following resources:

- [Name resolution that uses your own DNS server](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server)
- [DNS configuration](../private-link/private-endpoint-overview.md#dns-configuration)

## Grant access to trusted Azure services for Azure OpenAI

You can grant a subset of trusted Azure services access to Azure OpenAI, while maintaining network rules for other apps. These trusted services will then use managed identity to authenticate your Azure OpenAI service. The following table lists the services that can access Azure OpenAI if the managed identity of those services have the appropriate role assignment.


|Service  |Resource provider name  |
|---------|---------|
|Azure AI Services     | `Microsoft.CognitiveServices`   |
|Azure Machine Learning     |`Microsoft.MachineLearningServices`         |
|Azure AI Search     | `Microsoft.Search`         |


You can grant networking access to trusted Azure services by creating a network rule exception using the REST API:
```bash

accessToken=$(az account get-access-token --resource https://management.azure.com --query "accessToken" --output tsv)
rid="/subscriptions/<your subscription id>/resourceGroups/<your resource group>/providers/Microsoft.CognitiveServices/accounts/<your Azure AI resource name>"

curl -i -X PATCH https://management.azure.com$rid?api-version=2023-10-01-preview \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $accessToken" \
-d \
'
{
    "properties":
    {
        "networkAcls": {
            "bypass": "AzureServices"
        }
    }
}
'
```

To revoke the exception, set `networkAcls.bypass` to `None`. 

### Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).

## Next steps

- Explore the various [Azure AI services](./what-are-ai-services.md)
- Learn more about [Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md)
