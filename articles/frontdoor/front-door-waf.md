---
title: 'Tutorial: Scale and protect a web app by using Azure Front Door and Azure Web Application Firewall (WAF)' 
description: This tutorial will show you how to use Azure Web Application Firewall with the Azure Front Door service.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: tutorial
ms.workload: infrastructure-services
ms.custom: devx-track-azurecli
ms.date: 10/01/2020
ms.author: duau
---

# Tutorial: Quickly scale and protect a web application by using Azure Front Door and Azure Web Application Firewall (WAF)

Many web applications have experienced a rapid increase of traffic in recent weeks because of COVID-19. These web applications are also experiencing a surge in malicious traffic, including denial-of-service attacks. There's an effective way to both scale out your application for traffic surges and protect yourself from attacks: configure Azure Front Door with Azure WAF as an acceleration, caching, and security layer in front of your web app. This article provides guidance on how to get Azure Front Door with Azure WAF configured for any web app that runs inside or outside of Azure. 

We'll be using the Azure CLI to configure the WAF in this tutorial. You can accomplish the same thing by using the Azure portal, Azure PowerShell, Azure Resource Manager, or the Azure REST APIs. 

In this tutorial, you'll learn how to:
> [!div class="checklist"]
> - Create a Front Door.
> - Create an Azure WAF policy.
> - Configure rule sets for a WAF policy.
> - Associate a WAF policy with Front Door.
> - Configure a custom domain.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- The instructions in this tutorial use the Azure CLI. [View this guide](/cli/azure/get-started-with-azure-cli) to get started with the Azure CLI.

  > [!TIP] 
  > An easy and quick way to get started on the Azure CLI is with [Bash in Azure Cloud Shell](../cloud-shell/quickstart.md).

- Ensure that the `front-door` extension is added to the Azure CLI:

   ```azurecli-interactive 
   az extension add --name front-door
   ```

> [!NOTE] 
> For more information about the commands used in this tutorial, see [Azure CLI reference for Front Door](/cli/azure/).

## Create an Azure Front Door resource

```azurecli-interactive 
az network front-door create --backend-address <>  --accepted-protocols <> --name <> --resource-group <>
```

`--backend-address`: The fully qualified domain name (FQDN) of the application you want to protect. For example, `myapplication.contoso.com`.

`--accepted-protocols`: Specifies the protocols you want Azure Front Door to support for your web application. For example, `--accepted-protocols Http Https`.

`--name`: The name of your Azure Front Door resource.

`--resource-group`: The resource group you want to place this Azure Front Door resource in. To learn more about resource groups, see [Manage resource groups in Azure](../azure-resource-manager/management/manage-resource-groups-portal.md).

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

In this step, we'll associate the WAF policy we created with the Azure Front Door resource that's in front of your web application:

```azurecli-interactive 
az network front-door update --name <> --resource-group <> --set frontendEndpoints[0].webApplicationFirewallPolicyLink='{"id":"<>"}'
```

`--name`: The name you specified for your Azure Front Door resource.

`--resource-group`: The resource group you placed the Azure Front Door resource in.

`--set`: Is where you update the `WebApplicationFirewallPolicyLink` attribute for the `frontendEndpoint` associated with your Azure Front Door resource with the new WAF policy. You should have the ID of the WAF policy from the response you got when you created the WAF profile earlier in this tutorial.

 > [!NOTE] 
> The preceding example is applicable when you're not using a custom domain. If you're not using any custom domains to access your web applications, you can skip the next section. In that case, you'll give your customers the `hostName` you obtained when you created the Azure Front Door resource. They'll use this `hostName` to go to your web application.

## Configure the custom domain for your web application

The custom domain name of your web application is the one that customers use to refer to your application. For example, www.contoso.com. Initially, this custom domain name was pointing to the location where it was running before you introduced Azure Front Door. After you add Azure Front Door and WAF to front the application, the DNS entry that corresponds to that custom domain should point to the Azure Front Door resource. You can make this change by remapping the entry in your DNS server to the Azure Front Door `hostName` you noted when you created the Azure Front Door resource.

Specific steps to update your DNS records will depend on your DNS service provider. If you use Azure DNS to host your DNS name, you can refer to the documentation for [steps to update a DNS record](../dns/dns-operations-recordsets-cli.md) and point to the Azure Front Door `hostName`. 

There's one important thing to note if you need your customers to get to your website using the zone apex (for example, contoso.com). In this case, you have to use Azure DNS and its [alias record type](../dns/dns-alias.md) to host your DNS name. 

You also need to update your Azure Front Door configuration to [add the custom domain](./front-door-custom-domain.md) to it so that it's aware of this mapping.

Finally, if you're using a custom domain to reach your web application and want to enable the HTTPS protocol. You need to [setup the certificates for your custom domain in Azure Front Door](./front-door-custom-domain-https.md). 

## Lock down your web application

We recommend you ensure only Azure Front Door edges can communicate with your web application. Doing so will ensure no one can bypass the Azure Front Door protection and access your application directly. To accomplish this lockdown, see [How do I lock down the access to my backend to only Azure Front Door?](./front-door-faq.yml#what-are-the-steps-to-restrict-the-access-to-my-backend-to-only-azure-front-door-).

## Clean up resources

When you no longer need the resources used in this tutorial, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, Front Door, and WAF policy:

```azurecli-interactive
  az group delete \
    --name <>
```
`--name`: The name of the resource group for all resources used in this tutorial.

## Next steps

To learn how to troubleshoot your Front Door, see the troubleshooting guides:

> [!div class="nextstepaction"]
> [Troubleshooting common routing issues](front-door-troubleshoot-routing.md)
