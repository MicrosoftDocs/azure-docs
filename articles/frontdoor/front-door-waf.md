---
title: 'Tutorial: Scale and protect a web app using Azure Front Door and Azure Web Application Firewall (WAF)'
description: Learn how to use Azure Web Application Firewall with Azure Front Door to scale and protect your web app.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: tutorial
ms.custom: devx-track-azurecli
ms.date: 11/18/2024
ms.author: duau
---

# Tutorial: Quickly scale and protect a web application using Azure Front Door and Azure Web Application Firewall (WAF)

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

Web applications often experience traffic surges and malicious attacks, such as denial-of-service attacks. Azure Front Door with Azure WAF can help scale your application and protect it from such threats. This tutorial guides you through configuring Azure Front Door with Azure WAF for any web app, whether it runs inside or outside of Azure.

We use the Azure CLI for this tutorial. You can also use the Azure portal, Azure PowerShell, Azure Resource Manager, or Azure REST APIs.

In this tutorial, you learn to:
> [!div class="checklist"]
> - Create a Front Door.
> - Create an Azure WAF policy.
> - Configure rule sets for a WAF policy.
> - Associate a WAF policy with Front Door.
> - Configure a custom domain.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Prerequisites

- This tutorial uses the Azure CLI. [Get started with the Azure CLI](/cli/azure/get-started-with-azure-cli).

   > [!TIP] 
   > An easy way to get started with the Azure CLI is using [Bash in Azure Cloud Shell](../cloud-shell/quickstart.md).

- Ensure the `front-door` extension is added to the Azure CLI:

    ```azurecli-interactive 
    az extension add --name front-door
    ```

> [!NOTE] 
> For more information about the commands used in this tutorial, see the [Azure CLI reference for Front Door](/cli/azure/).

## Create an Azure Front Door resource

```azurecli-interactive 
az network front-door create --backend-address <backend-address> --accepted-protocols <protocols> --name <name> --resource-group <resource-group>
```

- `--backend-address`: The fully qualified domain name (FQDN) of the application you want to protect, for example, `myapplication.contoso.com`.
- `--accepted-protocols`: Protocols supported by Azure Front Door, for example, `--accepted-protocols Http Https`.
- `--name`: The name of your Azure Front Door resource.
- `--resource-group`: The resource group for this Azure Front Door resource. Learn more about [managing resource groups](../azure-resource-manager/management/manage-resource-groups-portal.md).

Note the `hostName` value from the response, as you need it later. The `hostName` is the DNS name of the Azure Front Door resource.

## Create an Azure WAF profile for Azure Front Door

```azurecli-interactive 
az network front-door waf-policy create --name <name> --resource-group <resource-group> --disabled false --mode Prevention
```

- `--name`: The name of the new Azure WAF policy.
- `--resource-group`: The resource group for this WAF resource.

The previous command creates a WAF policy in prevention mode. 

> [!NOTE] 
> Consider creating the WAF policy in detection mode first to observe and log malicious requests without blocking them before switching to prevention mode.

Note the `ID` value from the response, as you need it later. The `ID` should be in this format:

`/subscriptions/<subscription-id>/resourcegroups/<resource-group>/providers/Microsoft.Network/frontdoorwebapplicationfirewallpolicies/<WAF-policy-name>`

## Add managed rule sets to the WAF policy

Add the default rule set:

```azurecli-interactive 
az network front-door waf-policy managed-rules add --policy-name <policy-name> --resource-group <resource-group> --type DefaultRuleSet --version 1.0
```

Add the bot protection rule set:

```azurecli-interactive 
az network front-door waf-policy managed-rules add --policy-name <policy-name> --resource-group <resource-group> --type Microsoft_BotManagerRuleSet --version 1.0
```

- `--policy-name`: The name of your Azure WAF resource.
- `--resource-group`: The resource group for the WAF resource.

## Associate the WAF policy with the Azure Front Door resource

```azurecli-interactive 
az network front-door update --name <name> --resource-group <resource-group> --set frontendEndpoints[0].webApplicationFirewallPolicyLink='{"id":"<ID>"}'
```

- `--name`: The name of your Azure Front Door resource.
- `--resource-group`: The resource group for the Azure Front Door resource.
- `--set`: Update the `WebApplicationFirewallPolicyLink` attribute for the `frontendEndpoint` with the new WAF policy ID.

> [!NOTE] 
> If you're not using a custom domain, you can skip the next section. Provide your customers with the `hostName` obtained when you created the Azure Front Door resource.

## Configure the custom domain for your web application

Update your DNS records to point the custom domain to the Azure Front Door `hostName`. Refer to your DNS service provider's documentation for specific steps. If you use Azure DNS, see [update a DNS record](../dns/dns-operations-recordsets-cli.md).

For zone apex domains (for example, contoso.com), use Azure DNS and its [alias record type](../dns/dns-alias.md).

Update your Azure Front Door configuration to [add the custom domain](./front-door-custom-domain.md).

To enable HTTPS for your custom domain, [set up certificates in Azure Front Door](./front-door-custom-domain-https.md).

## Lock down your web application

Ensure only Azure Front Door edges can communicate with your web application. See [How to lock down access to my backend to only Azure Front Door](./front-door-faq.yml#what-are-the-steps-to-restrict-the-access-to-my-backend-to-only-azure-front-door-).

## Clean up resources

When no longer needed, delete the resource group, Front Door, and WAF policy:

```azurecli-interactive
az group delete --name <resource-group>
```

- `--name`: The name of the resource group for all resources used in this tutorial.

## Next steps

To troubleshoot your Front Door, see:

> [!div class="nextstepaction"]
> [Troubleshooting common routing issues](front-door-troubleshoot-routing.md)
