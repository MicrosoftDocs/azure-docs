---
title: Scale and protect a web app by using Azure Front Door and WAF 
description: This tutorial will show you how to use Azure Web Application Firewall with the Azure Front Door service.
services: frontdoor
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/14/2020
ms.author: duau
---

# Tutorial: Quickly scale and protect a web application by using Azure Front Door and Azure Web Application Firewall (WAF)

Many web applications have experienced a rapid increase of traffic in recent weeks because of COVID-19. These web applications are also experiencing a surge in malicious traffic, including denial-of-service attacks. There's an effective way to both scale out for traffic surges and protect yourself from attacks: set up Azure Front Door with Azure WAF as an acceleration, caching, and security layer in front of your web app. This article provides guidance on how to quickly get Azure Front Door with Azure WAF set up for any web app that runs inside or outside of Azure. 

We'll be using Azure CLI to set up the WAF in this tutorial. These steps are also fully supported in the Azure portal, Azure PowerShell, Azure Resource Manager, and the Azure REST APIs. 

In this tutorial, you'll learn how to:
> [!div class="checklist"]
> - Create a Front Door.
> - Create an Azure WAF policy.
> - Configure rule sets for a WAF policy.
> - Associate a WAF policy with Front Door.
> - Configure a custom domain.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- The instructions in this tutorial use Azure CLI. [View this guide](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli?view=azure-cli-latest) to get started with Azure CLI.

  > [!TIP] 
  > An easy and quick way to get started on Azure CLI is with [Bash in Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/quickstart).

- Ensure that the `front-door` extension is added to your Azure CLI:

   ```azurecli-interactive 
   az extension add --name front-door
   ```

> [!NOTE] 
> For more details about the commands used in this tutorial, see [Azure CLI reference for Front Door](https://docs.microsoft.com/cli/azure/ext/front-door/?view=azure-cli-latest).

## Create an Azure Front Door resource

```azurecli-interactive 
az network front-door create --backend-address <>  --accepted-protocols <> --name <> --resource-group <>
```

`--backend-address`: The fully qualified domain name (FQDN) of the application you want to protect. For example, `myapplication.contoso.com`.

`--accepted-protocols`: Specifies the protocols you want Azure Front Door to support for your web application. For example, `--accepted-protocols Http Https`.

`--name`: The name of your Azure Front Door resource.

`--resource-group`: The resource group you want to place this Azure Front Door resource in. To learn more about resource groups, see [Manage resource groups in Azure](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal).

In the response you get when you run this command, look for the key `hostName`. You'll need this value in a later step. The `hostName` is the DNS name of the Azure Front Door resource you created.

## Create an Azure WAF profile to use with Azure Front Door resources

```azurecli-interactive 
az network front-door waf-policy create --name <>  --resource-group <>  --disabled false --mode Prevention
```

`--name`: The name of the new Azure WAF policy.

`--resource-group`: The resource group you want to place this WAF resource in. 

The preceding CLI code will create a WAF policy that's enabled and that's in prevention mode. 

> [!NOTE] 
> You might want to create the WAF policy in detection mode and observe how it detects and logs malicious requests (without blocking them) before you decide to use protection mode.

In the response you get when you run this command, look for the key `ID`. You'll need this value in a later step. 

The `ID` field should be in this format:

/subscriptions/**subscription id**/resourcegroups/**resource group name**/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/**WAF policy name**

## Add managed rule sets to the WAF policy

You can add managed rule sets to a WAF policy. A managed rule set is a set of rules built and managed by Microsoft that helps protect you against a class of threats. In this example, we're adding two rule sets:
- The default rule set, which helps to protect you against common web threats. 
- The bot protection rule set, which helps to protect you against malicious bots.

Add the default rule set:

   ```azurecli-interactive 
   az network front-door waf-policy managed-rules add --policy-name <> --resource-group <> --type DefaultRuleSet --version 1.0
   ```

Add the bot protection rule set:

   ```azurecli-interactive 
   az network front-door waf-policy managed-rules add --policy-name <> --resource-group <> --type Microsoft_BotManagerRuleSet --version 1.0
   ```

`--policy-name`: The name you specified for your Azure WAF resource.

`--resource-group`: The resource group you placed the WAF resource in.

## Associate the WAF policy with the Azure Front Door resource

In this step, we'll associate the WAF policy we've created with the Azure Front Door resource that's in front of your web application:

```azurecli-interactive 
az network front-door update --name <> --resource-group <> --set frontendEndpoints[0].webApplicationFirewallPolicyLink='{"id":"<>"}'
```

`--name`: The name you specified for your Azure Front Door resource.

`--resource-group`: The resource group you placed the Azure Front Door resource in.

`--set`: This is where you update the `WebApplicationFirewallPolicyLink` attribute for the `frontendEndpoint` associated with your Azure Front Door resource with the new WAF policy. You should have the ID of the WAF policy from the response you got when you created the WAF profile earlier in this tutorial.

 > [!NOTE] 
> The preceding example is applicable when you're not using a custom domain. If you are

If you are not using any custom domains to access your web applications, you can skip step #5. In that case, you will be providing to your end users the hostname you obtained in step #1 to navigate to your web application

## Configure custom domain for your web application

Initially the custom domain name of your web application (the one that customers use to refer to your application, for example, www.contoso.com) was pointing towards the place where you had it running before Azure Front Door was introduced. After this change of architecture adding AFD+WAF to front the application, the DNS entry corresponding to that custom domain should now point to this Azure Front Door resource. This can be done by remapping this entry in your DNS server to the Azure Front Door hostname you had noted in step #1.

Specific steps to update your DNS records will depend on your DNS service provider, but if you are using Azure DNS to host your DNS name, you can refer to the documentation for [steps do update a DNS record](https://docs.microsoft.com/azure/dns/dns-operations-recordsets-cli) and point to the Azure Front Door hostName. 

One key thing to note here is that, if you need your users to navigate to your website using the zone apex, for example, contoso.com, you have to use Azure DNS and it's [ALIAS record type](https://docs.microsoft.com/azure/dns/dns-alias) to host your DNS name. 

In addition, you also need to update your Azure Front Door configuration to [add this custom domain](https://docs.microsoft.com/azure/frontdoor/front-door-custom-domain) to it so that Azure Front Door understands this mapping.

Finally, if you are using a custom domain to reach your web application and want to enable the HTTPS protocol, you need to have the [certificates for your custom domain setup in Azure Front Door](https://docs.microsoft.com/azure/frontdoor/front-door-custom-domain-https). 

## Lock down your web application

One optional best practice to follow is to ensure that only Azure Front Door edges can communicate with your web application. This action will ensure that no one can bypass the Azure Front Door protections and access your applications directly. You can accomplish this lock down by visiting the [FAQ section of Azure Front Door](https://docs.microsoft.com/azure/frontdoor/front-door-faq) and referring to the question regarding locking down backends for access only by Azure Front Door.

## Clean up resources

When you no longer need the resources in this tutorial, use the [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete) command to remove the resource group, Front Door, and WAF policy.

```azurecli-interactive
  az group delete \
    --name <>
```
--name The resource group name for all resources deployed in this tutorial.

## Next Steps

To learn how to troubleshoot your Front Door, continue to the How-to guides.

> [!div class="nextstepaction"]
> [Troubleshooting common routing issues](front-door-troubleshoot-routing.md)
