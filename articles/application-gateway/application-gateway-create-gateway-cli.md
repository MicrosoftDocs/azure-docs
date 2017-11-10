---
title: Create an application gateway - Azure CLI 2.0 | Microsoft Docs
description: Learn how to create an application gateway by using the Azure CLI 2.0 in Resource Manager.
services: application-gateway
documentationcenter: na
author: davidmu1
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: c2f6516e-3805-49ac-826e-776b909a9104
ms.service: application-gateway
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/31/2017
ms.author: davidmu

---
# Create an application gateway by using the Azure CLI 2.0

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-gateway-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-gateway-arm.md)
> * [Azure classic PowerShell](application-gateway-create-gateway.md)
> * [Azure Resource Manager template](application-gateway-create-gateway-arm-template.md)
> * [Azure CLI 1.0](application-gateway-create-gateway-cli.md)
> * [Azure CLI 2.0](application-gateway-create-gateway-cli.md)

Azure Application Gateway is a dedicated virtual appliance that provides application delivery controller (ADC) as a service, offering various layer 7 load-balancing capabilities for your application.

## CLI versions

You can create an application gateway by using one of the following command-line interface (CLI) versions:

* [Azure CLI 1.0](application-gateway-create-gateway-cli-nodejs.md): Azure CLI for the classic and Azure Resource Manager deployment models
* [Azure CLI 2.0](application-gateway-create-gateway-cli.md): Next-generation CLI for the Resource Manager deployment model

## Prerequisite: Install the Azure CLI 2.0

To perform the steps in this article, you need to [install the Azure CLI for macOS, Linux, and Windows](https://docs.microsoft.com/en-us/cli/azure/install-az-cli2).

> [!NOTE]
> You need an Azure account to create an application gateway. If you don't have one, sign up for a [free trial](../active-directory/sign-up-organization.md).

## Scenario

In this scenario, you learn how to create an application gateway by using the Azure portal.

This scenario will:

* Create a medium application gateway with two instances.
* Create a virtual network named AdatumAppGatewayVNET with a reserved CIDR block of 10.0.0.0/16.
* Create a subnet called Appgatewaysubnet that uses 10.0.0.0/28 as its CIDR block.

> [!NOTE]
> Further configuration of the application gateway, including custom health probes, back-end pool addresses, and additional rules, happens after the application gateway is created and not during initial deployment.

## Before you begin

An application gateway requires its own subnet. When you're creating a virtual network, ensure that you leave enough address space for multiple subnets. After you deploy an application gateway to a subnet, you can add only additional application gateways to that subnet.

## Sign in to Azure

Open the **Microsoft Azure Command Prompt** and sign in:

```azurecli-interactive
az login -u "username"
```

> [!NOTE]
> You can also use `az login` without the switch for device login that requires entering a code at aka.ms/devicelogin.

After you enter the preceding command, you'll receive a code. Go to https://aka.ms/devicelogin in a browser to continue the sign-in process.

![Cmd showing device login][1]

In the browser, enter the code you received. This redirects you to a sign-in page.

![Browser to enter code][2]

Enter the code to sign in, and then close the browser to continue.

![Successfully signed in][3]

## Create the resource group

Before you create the application gateway, create a resource group to contain it. Use the following command:

```azurecli-interactive
az group create --name myresourcegroup --location "eastus"
```

## Create the application gateway

Use the back-end IP addresses for your back-end server IP addresses. These values can be either private IPs in the virtual network, public IPs, or fully qualified domain names for your back-end servers. The following example creates an application gateway with additional configurations for HTTP settings, ports, and rules:

```azurecli-interactive
az network application-gateway create \
--name "AdatumAppGateway" \
--location "eastus" \
--resource-group "myresourcegroup" \
--vnet-name "AdatumAppGatewayVNET" \
--vnet-address-prefix "10.0.0.0/16" \
--subnet "Appgatewaysubnet" \
--subnet-address-prefix "10.0.0.0/28" \
--servers 10.0.0.4 10.0.0.5 \
--capacity 2 \
--sku Standard_Small \
--http-settings-cookie-based-affinity Enabled \
--http-settings-protocol Http \
--frontend-port 80 \
--routing-rule-type Basic \
--http-settings-port 80 \
--public-ip-address "pip2" \
--public-ip-address-allocation "dynamic" \

```

The preceding example shows several properties that are not required during the creation of an application gateway. The following code example creates an application gateway with the required information:

```azurecli-interactive
az network application-gateway create \
--name "AdatumAppGateway" \
--location "eastus" \
--resource-group "myresourcegroup" \
--vnet-name "AdatumAppGatewayVNET" \
--vnet-address-prefix "10.0.0.0/16" \
--subnet "Appgatewaysubnet \
--subnet-address-prefix "10.0.0.0/28" \
--servers "10.0.0.5"  \
--public-ip-address pip
```
 
> [!NOTE]
> For a list of parameters to use during creation, run the following command: `az network application-gateway create --help`.

This example creates a basic application gateway with default settings for the listener, back-end pool, back-end HTTP settings, and rules. You can modify these settings to suit your deployment after the provisioning is successful.

If the web application was defined with the back-end pool in the preceding steps, load balancing begins now.

## Get the application gateway DNS name
After you create the gateway, you then configure the front end for communication. When you're using a public IP, the application gateway requires a dynamically assigned DNS name, which is not friendly. To ensure users can hit the application gateway, use a CNAME record to point to the public endpoint of the application gateway. For more information, see [Use Azure DNS to provide custom domain settings for an Azure service](../dns/dns-custom-domain.md).

To configure an alias, retrieve details of the application gateway and its associated IP/DNS name by using the PublicIPAddress element attached to the application gateway. Use the application gateway's DNS name to create a CNAME record, which points the two web applications to this DNS name. Don't use A records because the VIP might change on restart of the application gateway.


```azurecli-interactive
az network public-ip show --name "pip" --resource-group "AdatumAppGatewayRG"
```

```
{
  "dnsSettings": {
    "domainNameLabel": null,
    "fqdn": "8c786058-96d4-4f3e-bb41-660860ceae4c.cloudapp.net",
    "reverseFqdn": null
  },
  "etag": "W/\"3b0ac031-01f0-4860-b572-e3c25e0c57ad\"",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/AdatumAppGatewayRG/providers/Microsoft.Network/publicIPAddresses/pip2",
  "idleTimeoutInMinutes": 4,
  "ipAddress": "40.121.167.250",
  "ipConfiguration": {
    "etag": null,
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/AdatumAppGatewayRG/providers/Microsoft.Network/applicationGateways/AdatumAppGateway2/frontendIPConfigurations/appGatewayFrontendIP",
    "name": null,
    "privateIpAddress": null,
    "privateIpAllocationMethod": null,
    "provisioningState": null,
    "publicIpAddress": null,
    "resourceGroup": "AdatumAppGatewayRG",
    "subnet": null
  },
  "location": "eastus",
  "name": "pip2",
  "provisioningState": "Succeeded",
  "publicIpAddressVersion": "IPv4",
  "publicIpAllocationMethod": "Dynamic",
  "resourceGroup": "AdatumAppGatewayRG",
  "resourceGuid": "3c30d310-c543-4e9d-9c72-bbacd7fe9b05",
  "tags": {
    "cli[2] owner[administrator]": ""
  },
  "type": "Microsoft.Network/publicIPAddresses"
}
```

## Delete all resources

To delete all resources created in this article, run the following command:

```azurecli-interactive
az group delete --name AdatumAppGatewayRG
```
 
## Next steps

To learn how to create custom health probes, go to [Create a custom probe for Application Gateway by using the portal](application-gateway-create-probe-portal.md).

To learn how to configure SSL offloading and take the costly SSL decryption off your web servers, see [Configure an application gateway for SSL offload by using Azure Resource Manager](application-gateway-ssl-arm.md).

<!--Image references-->

[scenario]: ./media/application-gateway-create-gateway-cli/scenario.png
[1]: ./media/application-gateway-create-gateway-cli/figure1.png
[2]: ./media/application-gateway-create-gateway-cli/figure2.png
[3]: ./media/application-gateway-create-gateway-cli/figure3.png
