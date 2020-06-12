---
title: Quickly scale and protect a web application using Azure Front Door and Azure Web Application Firewall (WAF) | Microsoft Docs
description: This article helps you understand how to use Web Application Firewall with your AAzure Front Door Service
services: frontdoor
documentationcenter: ''
author: tremansdoerfer
ms.service: frontdoor
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/06/2020
ms.author: rimansdo
---

# Quickly scale and protect a web application using Azure Front Door and Azure Web Application Firewall (WAF)

Many web applications have experienced rapid increase of traffic in recent weeks related to COVID-19. In addition, these web applications are also observing a surge in malicious traffic including denial of service attacks. An effective way to handle both these needs, scale out for traffic surges and protect from attacks, is to set up Azure Front Door with Azure WAF as an acceleration, caching and security layer in front of your web application. This article provides guidance on how to quickly get this Azure Front Door with Azure WAF setup for any web applications running in or outside of Azure. 

We will be using Azure CLI to set up the WAF in this tutorial, but all these steps are also fully supported in Azure portal, Azure PowerShell, Azure ARM, and Azure REST APIs. 

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

The instructions in this blog use the Azure Command Line Interface (CLI). View this guide to [get started with Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli?view=azure-cli-latest).

*Tip: an easy & quick way to get started on Azure CLI is with [Bash in Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/quickstart)*

Ensure that the front-door extension is added to your Azure CLI

```azurecli-interactive 
az extension add --name front-door
```

Note: For more details of the commands listed below, refer to the [Azure CLI reference for Front Door](https://docs.microsoft.com/cli/azure/ext/front-door/?view=azure-cli-latest).

## Step 1: Create an Azure Front Door (AFD) resource


```azurecli-interactive 
az network front-door create --backend-address <>  --accepted-protocols <> --name <> --resource-group <>
```

**--backend-address**: The backend address is the Fully Qualified Domain Name (FQDN) name of the application you want to protect. For example, myapplication.contoso.com

**--accepted-protocols**: The accepted protocols specifies what all protocols you want AFD to support for your web application. An example would be --accepted-protocols Http Https.

**--name**: Specify a name for your AFD resource

**--resource-group**: The resource group you want to place this AFD resource in.  To learn more about resource groups, visit manage resource groups in Azure

In the response you get from successfully executing this command, look for the key "hostName" and note down its value to be used in a later step. The hostName is the DNS name of the AFD resource you had created

## Step 2: Create an Azure WAF profile to use with Azure Front Door resources

```azurecli-interactive 
az network front-door waf-policy create --name <>  --resource-group <>  --disabled false --mode Prevention
```

--name Specify a name for your Azure WAF policy

--resource-group The resource group you want to place this WAF resource in. 

The CLI code above will create a WAF policy that is enabled and is in the Prevention mode. 

Note: you may also want to create the WAF in Detection mode and observe how it is detecting & logging malicious requests (and not blocking) before deciding to change to Protection mode.

In the response you get from successfully executing this command, look for the key "ID" and note down its value to be used in a later step. The ID field should be in the format

/subscriptions/**subscription id**/resourcegroups/**resource group name**/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/**WAF policy name**

## Step 3: Add managed rulesets to this WAF policy

In a WAF policy, you can add managed rulesets that are a set of rules built and managed by Microsoft and gives out of the box protection against entire classes of threats. In this example, we are adding two such rulesets (1) Default ruleset that protects against common web threats and (2) Bot protection ruleset, which protects against malicious bots

(1) Add the default ruleset

```azurecli-interactive 
az network front-door waf-policy managed-rules add --policy-name <> --resource-group <> --type DefaultRuleSet --version 1.0
```

(2) Add the bot manager ruleset

```azurecli-interactive 
az network front-door waf-policy managed-rules add --policy-name <> --resource-group <> --type Microsoft_BotManagerRuleSet --version 1.0
```

--policy-name The name you gave for your Azure WAF resource

--resource-group The resource group you had placed this WAF resource in.

## Step 4: Associate the WAF policy with the AFD resource

In this step, we will be associating the WAF policy we have built with the AFD resource that is in front of your web application.

```azurecli-interactive 
az network front-door update --name <> --resource-group <> --set frontendEndpoints[0].webApplicationFirewallPolicyLink='{"id":"<>"}'
```

--name The name you had specified for your AFD resource

--resource-group The resource group you had placed the Azure Front Door resource in.

--set This is where you update the attribute WebApplicationFirewallPolicyLink for the frontendEndpoint associated with your AFD resource with the newly built WAF policy. The ID of the WAF policy can be found from the response you got from step #2 above

Note: the above example is for the case where you are not using a custom domain, if you are

If you are not using any custom domains to access your web applications, you can skip step #5. In that case, you will be providing to your end users the hostname you obtained in step #1 to navigate to your web application

## Step 5: Configure custom domain for your web application

Initially the custom domain name of your web application (the one that customers use to refer to your application, for example, www.contoso.com) was pointing towards the place where you had it running before AFD was introduced. After this change of architecture adding AFD+WAF to front the application, the DNS entry corresponding to that custom domain should now point to this AFD resource. This can be done by remapping this entry in your DNS server to the AFD hostname you had noted in step #1.

Specific steps to update your DNS records will depend on your DNS service provider, but if you are using Azure DNS to host your DNS name, you can refer to the documentation for [steps do update a DNS record](https://docs.microsoft.com/azure/dns/dns-operations-recordsets-cli) and point to the AFD hostName. 

One key thing to note here is that, if you need your users to navigate to your website using the zone apex, for exmaple, contoso.com, you have to use Azure DNS and it's [ALIAS record type](https://docs.microsoft.com/azure/dns/dns-alias) to host your DNS name. 

In addition, you also need to update your AFD configuration to [add this custom domain](https://docs.microsoft.com/azure/frontdoor/front-door-custom-domain) to it so that AFD understands this mapping.

Finally, if you are using a custom domain to reach your web application and want to enable the HTTPS protocol, you need to have the [certificates for your custom domain setup in AFD](https://docs.microsoft.com/azure/frontdoor/front-door-custom-domain-https). 

## Step 6: Lock down your web application

One optional best practice to follow is to ensure that only AFD edges can communicate with your web application. This action will ensure that no one can bypass the AFD protections and access your applications directly. You can accomplish this lock down by visiting the [FAQ section of AFD](https://docs.microsoft.com/azure/frontdoor/front-door-faq) and referring to the question regarding locking down backends for access only by AFD.
