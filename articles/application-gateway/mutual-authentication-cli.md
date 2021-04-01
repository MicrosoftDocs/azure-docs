---
title: Configure mutual authentication on Azure Application Gateway through Azure CLI
description: Learn how to configure an Application Gateway to have mutual authentication through Azure CLI 
services: application-gateway
author: mscatyao
ms.service: application-gateway
ms.topic: how-to
ms.date: 03/31/2021
ms.author: caya
---

# Configure mutual authentication with Application Gateway through Azure CLI (Preview)

This article describes how to use the Azure CLI to configure mutual authentication on your Application Gateway. Mutual authentication means Application Gateway authenticates the client sending the request using the client certificate you upload onto the Application Gateway. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

If you prefer, you can complete this tutorial using [Azure PowerShell](./mutual-authentication-powershell.md).

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Before you begin

To configure mutual authentication with an Application Gateway, you need a client certificate to upload to the gateway. The client certificate will be used to validate the certificate the client will present to Application Gateway. For testing purposes, you can use a self-signed certificate. However, this is not advised for production workloads, because they're harder to manage and aren't completely secure. 

To learn more, especially about what kind of client certificates you can upload, see [Overview of mutual authentication with Application Gateway](./mutual-authentication-overview.md#certificates-supported-for-mutual-authentication).

## Create a resource group

First create a new resource group in your subscription. 

```azurecli
$resourceGroup = az group create --name $rgname --location $location --tags @{ testtag = "APPGw tag"}
```

## Create a virtual network

Deploy a virtual network for your Application Gateway to be deployed in.

```azurecli
$gwSubnet = az network vnet subnet create --name $gwSubnetName --address-prefixes 10.0.0.0/24
$vnet = az network vnet create --name $vnetName --resource-group $rgname --location $location --address-prefixes 10.0.0.0/16 --subnet $gwSubnet
$vnet = az network vnet show --name $vnetName --resource-group $rgname
$gwSubnet = az network vnet subnet show --name $gwSubnetName --vnet-name $vnetName
```

## Create a public IP

Create a public IP to use with your Application Gateway. 

```azurecli
$publicip = az network public-ip create --resource-group $rgname --name $publicIpName --location $location --allocation-method Static --sku Standard
```

## Create the Application Gateway IP configuration

Create the Application Gateway IP configuration. 

```azurecli
$gipconfig = UPDATE: az network application-gateway frontend-ip create --name $gipconfigname --gateway-name $appgwName --resource-group $rgname --subnet $gwSubnet
```

## Configure frontend SSL 

Configure the frontend portion of your Application Gateway.

```azurepowershell
$password = ConvertTo-SecureString "P@ssw0rd" -AsPlainText -Force
$sslCertPath = $basedir + "/ScenarioTests/Data/ApplicationGatewaySslCert1.pfx"
$sslCert = az network application-gateway ssl-cert create --name $sslCertName --gateway-name $appgwName --resource-group $rgname --cert-file $sslCertPath --cert-password $password
$fipconfig = az network application-gateway frontend-ip create --name $fipconfigName --public-ip-address $publicip --gateway-name $appgwName --resource-group $rgname
$port = az network application-gateway frontend-port create --name $frontendPortName --gateway-name $appgwName --port 443 --resource-group $rgname
```

## Configure client authentication 

Configure client authentication on your Application Gateway. Make sure the trusted client CA certificate chain you upload, if you upload a chain, is complete and contains all intermediate certificates (if any).  

```azurepowershell
$clientCertFilePath = $basedir + "/ScenarioTests/Data/TrustedClientCertificate.cer"
$trustedClient01 = az network application-gateway cient-cert add --name $trustedClientCert01Name --data $clientCertFilePath --gateway-name $appgwName --resource-group $rgname
$sslPolicy = az network application-gateway ssl-policy set --policy-type Predefined --name "AppGwSslPolicy20170401" --resource-group $rgname --gateway-name $appgwName
$clientAuthConfig = UDPATE: New-AzApplicationGatewayClientAuthConfiguration -VerifyClientCertIssuerDN
$sslProfile01 = az network application-gateway ssl-profile add --name $sslProfile01Name --gateway-name $appgwName --resource-group $rgname --policy-name $sslPolicy --client-auth-config $clientAuthConfig --trusted-client-cert $trustedClient01
$listener = az network application-gateway http-listener create --name $listenerName --gateway-name $appgwName --resource-group $rgname --ssl-cert $sslCert --frontend-ip $fipconfig --frontend-port $port --ssl-profile $sslProfile01
```

## Configure the backend trusted root certificate 

Set up the backend trusted root certificate on your Application Gateway for end-to-end SSL encryption. 

```azurepowershell
$certFilePath = $basedir + "/ScenarioTests/Data/ApplicationGatewayAuthCert.cer"
$trustedRoot = New-AzApplicationGatewayTrustedRootCertificate -Name $trustedRootCertName -CertificateFile $certFilePath
$pool = New-AzApplicationGatewayBackendAddressPool -Name $poolName -BackendIPAddresses www.microsoft.com, www.bing.com
$poolSetting = New-AzApplicationGatewayBackendHttpSettings -Name $poolSettingName -Port 443 -Protocol Https -CookieBasedAffinity Enabled -PickHostNameFromBackendAddress -TrustedRootCertificate $trustedRoot
```

## Configure the rule

Set up a rule on your Application Gateway.

```azurepowershell
$rule = New-AzApplicationGatewayRequestRoutingRule -Name $ruleName -RuleType basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool
$sku = New-AzApplicationGatewaySku -Name Standard_v2 -Tier Standard_v2
$autoscaleConfig = New-AzApplicationGatewayAutoscaleConfiguration -MinCapacity 3
$sslPolicyGlobal = New-AzApplicationGatewaySslPolicy -PolicyType Predefined -PolicyName "AppGwSslPolicy20170401"
```

## Create the Application Gateway

Using everything we created above, deploy your Application Gateway.

```azurepowershell
$appgw = New-AzApplicationGateway -Name $appgwName -ResourceGroupName $rgname -Zone 1,2 -Location $location -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig -GatewayIpConfigurations $gipconfig -FrontendPorts $port -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku -SslPolicy $sslPolicyGlobal -TrustedRootCertificate $trustedRoot -AutoscaleConfiguration $autoscaleConfig -TrustedClientCertificates $trustedClient01 -SslProfiles $sslProfile01 -SslCertificates $sslCert
```

## Clean up resources

When no longer needed, remove the resource group, application gateway, and all related resources using [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup).

```azurepowershell
Remove-AzResourceGroup -Name $rgname
```

## Next steps

> [!div class="nextstepaction"]
> [Manage web traffic with an application gateway using the Azure CLI](./tutorial-manage-web-traffic-cli.md)