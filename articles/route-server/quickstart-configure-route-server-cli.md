---
title: 'Quickstart: Create and configure Route Server using Azure CLI'
description: In this quickstart, you learn how to create and configure a Route Server using Azure CLI.
services: route-server
author: duongau
ms.service: route-server
ms.topic: quickstart
ms.date: 08/20/2021
ms.author: duau
---

# Quickstart: Create and configure Route Server using Azure CLI 

This article helps you configure Azure Route Server to peer with a Network Virtual Appliance (NVA) in your virtual network using Azure PowerShell. Route Server will learn routes from your NVA and program them on the virtual machines in the virtual network. Azure Route Server will also advertise the virtual network routes to the NVA. For more information, see [Azure Route Server](overview.md).

:::image type="content" source="media/quickstart-configure-route-server-portal/environment-diagram.png" alt-text="Diagram of Route Server deployment environment using the Azure CLI." border="false":::

> [!IMPORTANT]
> Azure Route Server (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

##  Prerequisites 

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
* Make sure you have the latest Azure CLI, or you can use Azure Cloud Shell in the portal. 
* Review the [service limits for Azure Route Server](route-server-faq.md#limitations). 

##  Configure virtual network and subnet 

###  Sign in to your Azure account and select your subscription. 

To begin your configuration, sign in to your Azure account. If you use the Cloud Shell "Try It", you're signed in automatically. Use the following examples to help you connect:

```azurecli-interactive
az login
```

Check the subscriptions for the account.

```azurecli-interactive
az account list
```

Select the subscription for which you want to create an ExpressRoute circuit.

```azurecli-interactive
az account set --subscription "<subscription ID>"
```

### Create a resource group and virtual network 

Before you can create an Azure Route Server, you need designate a virtual network to host the deployment. Use the follow command to create a resource group and virtual network. If you already have a virtual network, you can skip to the next section.

```azurecli-interactive
az group create -n "RouteServerRG" -l "westus" 
az network vnet create -n "myVirtualNetwork" -g "RouteServerRG" --address-prefix "10.0.0.0/16" 
``` 

### Add a subnet 

Azure Route Server requires a dedicated subnet named *RouteServerSubnet. The subnet size has to be at least /27 or short prefix (such as /26 or /25) or you'll receive an error message when deploying the Route Server.

1. Run the follow command to add the *RouteServerSubnet* to your virtual network.

    ```azurecli-interactive 
    az network vnet subnet create -name "RouteServerSubnet" -g "RouteServerRG" --vnet-name "myVirtualNetwork" --address-prefix "10.0.0.0/24"  
    ``` 

1. 1. Make note of the RouteServerSubnet ID. To see the resource ID of all subnets in the virtual network, use this command:

    ```azurecli-interactive 
    $subnet_id = $(az network vnet subnet show -n "RouteServerSubnet" -g "RouteServerRG" --vnet-name "myVirtualNetwork" --query id -o tsv) 
    ``` 

The RouteServerSubnet ID looks like the following one: 

`/subscriptions/<subscriptionID>/resourceGroups/RouteServerRG/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork/subnets/RouteServerSubnet`

## Create the Route Server 

To ensure high availability Azure Route Server requires a public IP to access the underlying infrastructure.

1. Create the public IP address by using this command:

    ```azurecli-interactive
    $pip = az network public-ip create -n "RouteServerIP" -g "RouteServerRG" -version IPv4 -sku Standard
    ```

2. Create the Route Server with the following command. Make sure to replace the HostedSubnet variable with the Subnet ID noted in the earlier steps.

    ```azurecli-interactive
    az network routeserver create -n "myRouteServer" -g "RouteServerRG" --hosted-subnet $subnet_id  --public-ip-address $pip
    ``` 

## Create peering with an NVA 

Use the following command to establish peering from the Route Server to the NVA: 

```azurecli-interactive 

az network routeserver peering create --routeserver "myRouteServer" -g "RouteServerRG" --peer-ip "nva_ip" --peer-asn "nva_asn" -n "NVA1_name" 

``` 

The “nva_ip” is the virtual network IP assigned to the NVA. The “nva_asn” is the Autonomous System Number (ASN) configured in the NVA. The ASN can be any 16-bit number other than the ones in the range of 65515-65520. This range of ASNs are reserved by Microsoft.

To set up peering with different NVA or another instance of the same NVA for redundancy, use this command:

```azurecli-interactive 

az network routeserver peering create --routeserver "myRouteServer" -g "RouteServerRG" --peer-ip "nva_ip" --peer-asn "nva_asn" -n "NVA2_name" 
``` 

## Complete the configuration on the NVA 

To complete the configuration on the NVA and enable the BGP sessions, you need the IP and the ASN of Azure Route Server. You can get this information using this command: 

```azurecli-interactive 
az network routeserver show -g "RouteServerRG" -n "myRouteServer" 
``` 

The output will look like the following:

``` 
RouteServerAsn  : 65515 

RouteServerIps  : {10.5.10.4, 10.5.10.5}  "virtualRouterAsn": 65515, 

  "virtualRouterIps": [ 

    "10.0.0.4", 

    "10.0.0.5" 

  ], 

``` 

## Configure route exchange 

If you have an ExpressRoute and an Azure VPN gateway in the same virtual network and you want them to exchange routes, you can enable route exchange on the Azure Route Server.

> [!IMPORTANT]
> For greenfield deployments make sure to create the Azure VPN gateway before creating Azure Route Server; otherwise the deployment of Azure VPN Gateway will fail.
> 

1. To enable route exchange between Azure Route Server and the gateway(s), use this command:

```azurecli-interactive 
az network routeserver update -g "RouteServerRG" -n "myRouteServer" --allow-b2b-traffic true 

``` 

2. To disable route exchange between Azure Route Server and the gateway(s), use this command:

```azurecli-interactive
az network routeserver update -g "RouteServerRG" -n "myRouteServer" --allow-b2b-traffic false 
``` 

## Troubleshooting 

You can view the routes advertised and received by Azure Route Server with this command:

```azurecli-interactive 
az network routeserver peering list-advertised-routes -g RouteServerRG --vrouter-name myRouteServer -n NVA1_name 
az network routeserver peering list-learned-routes -g RouteServerRG --vrouter-name myRouteServer -n NVA1_name 
``` 

## Clean up resources

If you no longer need the Azure Route Server, use the first command to remove the BGP peering and then the second command to remove the Route Server. 

1. Remove the BGP peering between Azure Route Server and an NVA with this command:

```azurecli-interactive
az network routeserver peering delete --routeserver "myRouteServer" -g "RouteServerRG" -n "NVA2_name" 
``` 

2. Remove the Azure Route Server with this command: 

```azurecli-interactive 
az network routeserver delete -n "myRouteServer" -g "RouteServerRG" 
``` 

## Next steps

After you've created the Azure Route Server, continue on to learn more about how Azure Route Server interacts with ExpressRoute and VPN Gateways: 

> [!div class="nextstepaction"]
> [Azure ExpressRoute and Azure VPN support](expressroute-vpn-support.md)
 
