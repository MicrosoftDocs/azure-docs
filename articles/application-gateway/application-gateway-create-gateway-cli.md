---
title: Create an Azure Application Gateway - Azure CLI 2.0 | Microsoft Docs
description: Learn how to create an Application Gateway by using the Azure CLI 2.0 in Resource Manager
services: application-gateway
documentationcenter: na
author: georgewallace
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: c2f6516e-3805-49ac-826e-776b909a9104
ms.service: application-gateway
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/03/2017
ms.author: gwallace

---
# Create an application gateway by using the Azure CLI 2.0

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-gateway-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-gateway-arm.md)
> * [Azure Classic PowerShell](application-gateway-create-gateway.md)
> * [Azure Resource Manager template](application-gateway-create-gateway-arm-template.md)
> * [Azure CLI 1.0](application-gateway-create-gateway-cli.md)
> * [Azure CLI 2.0](application-gateway-create-gateway-cli.md)

Azure Application Gateway is a layer-7 load balancer. It provides failover, performance-routing HTTP requests between different servers, whether they are on the cloud or on-premises. Application gateway has the following application delivery features: HTTP load balancing, cookie-based session affinity, and Secure Sockets Layer (SSL) offload, custom health probes, and support for multi-site.

## CLI versions to complete the task

You can complete the task using one of the following CLI versions:

* [Azure CLI 1.0](application-gateway-create-gateway-cli-nodejs.md) - our CLI for the classic and resource management deployment models.
* [Azure CLI 2.0](application-gateway-create-gateway-cli.md) - our next generation CLI for the resource management deployment model

## Prerequisite: Install the Azure CLI 2.0

To perform the steps in this article, you need to [install the Azure Command-Line Interface for Mac, Linux, and Windows (Azure CLI)](https://docs.microsoft.com/en-us/cli/azure/install-az-cli2).

> [!NOTE]
> If you don't have an Azure account, you need one. Go sign up for a [free trial here](../active-directory/sign-up-organization.md).

## Scenario

In this scenario, you learn how to create an application gateway using the Azure portal.

This scenario will:

* Create a medium application gateway with two instances.
* Create a virtual network named AdatumAppGatewayVNET with a reserved CIDR block of 10.0.0.0/16.
* Create a subnet called Appgatewaysubnet that uses 10.0.0.0/28 as its CIDR block.
* Configure a certificate for SSL offload.

![Scenario example][scenario]

> [!NOTE]
> Additional configuration of the application gateway, including custom health probes, backend pool addresses, and additional rules are configured after the application gateway is configured and not during initial deployment.

## Before you begin

Azure Application Gateway requires its own subnet. When creating a virtual network, ensure that you leave enough address space to have multiple subnets. Once you deploy an application gateway to a subnet,
only additional application gateways are able to be added to the subnet.

## Log in to Azure

Open the **Microsoft Azure Command Prompt**, and log in. 

```azurecli
az login -u "username"
```

> [!NOTE]
> You can also use `az login` without the switch for device login that will require entering a code at aka.ms/devicelogin.

Once you type the preceding example, a code is provided. Navigate to https://aka.ms/devicelogin in a browser to continue the login process.

![cmd showing device login][1]

In the browser, enter the code you received. You are redirected to a sign-in page.

![browser to enter code][2]

Once the code has been entered you are signed in, close the browser to continue on with the scenario.

![successfully signed in][3]

## Create the resource group

Before creating the application gateway, a resource group is created to contain the application gateway. The following shows the command.

```azurecli
az resource group create --name myresourcegroup --location "West US"
```

## Create a virtual network and subnet

Once the resource group is created, a virtual network is created for the Application Gateway.  In the following example, the address space was as 10.0.0.0/16 is defined for the virtual network and 10.0.0.0/28 is used for the subnet as seen in the preceding scenario notes.

```azurecli
az network vnet create \
--name AdatumAppGatewayVNET \
--address-prefix 10.0.0.0/16 \
--subnet-name Appgatewaysubnet \
--subnet-prefix 10.0.0.0/28 \
--resource-group AdatumAppGateway \
--location eastus
```

## Create the application gateway

Once the virtual network and subnet are created, the pre-requisites for the application gateway are complete. Additionally a previously exported .pfx certificate and the password for the certificate are required for the following step:
The IP addresses used for the backend are the IP addresses for your backend server. These values can be either private IPs in the virtual network, public ips, or fully qualified domain names for your backend servers.

```azurecli
az network application-gateway create \
--name AdatumAppGateway \
--location eastus \
--resource-group AdatumAppGatewayRG \
--vnet-name AdatumAppGatewayVNET \
---vnet-address-prefix 10.0.0.0/16 \
--subnet Appgatewaysubnet \
---subnet-address-prefix 10.0.0.0/28 \
--servers 10.0.0.4 10.0.0.5 \
--cert-file /mnt/c/Users/username/Desktop/application-gateway/fabrikam.pfx \
--cert-password P@ssw0rd \
--capacity 2 \
--sku Standard_Small \
--http-settings-cookie-based-affinity Enabled \
--http-settings-protocol Http \
--public-ip-address AdatumAppGatewayPIP \
--frontend-port 443 \
--routing-rule-type Basic \
--http-settings-port 80

```

> [!NOTE]
> For a list of parameters that can be provided during creation run the following command: **az network application-gateway create --help**.

This example creates a basic application gateway with default settings for the listener, backend pool, backend http settings, and rules. It also configures SSL offload. You can modify these settings to suit your deployment once the provisioning is successful.
If you already have your web application defined with the backend pool in the preceding steps, once created, load balancing begins.

## Delete all resources

To delete all resources created in this article, complete the following steps:

```azurecli
az group delete --name AdatumAppGatewayRG
```
 
## Next steps

Learn how to create custom health probes by visiting [Create a custom health probe](application-gateway-create-probe-portal.md)

Learn how to configure SSL Offloading and take the costly SSL decryption off your web servers by visiting [Configure SSL Offload](application-gateway-ssl-arm.md)

<!--Image references-->

[scenario]: ./media/application-gateway-create-gateway-cli/scenario.png
[1]: ./media/application-gateway-create-gateway-cli/figure1.png
[2]: ./media/application-gateway-create-gateway-cli/figure2.png
[3]: ./media/application-gateway-create-gateway-cli/figure3.png
