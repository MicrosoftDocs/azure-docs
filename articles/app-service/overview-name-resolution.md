---
title: Name resolution in App Service
description: Overview of how name resolution (DNS) works for your app in Azure App Service.
author: madsd
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: madsd
---

# Name resolution (DNS) in App Service

Your app uses DNS when making calls to dependent resources. Resources could be Azure services such as Key Vault, Storage or Azure SQL, but it could also be web apis that your app depends on. When you want to make a call to for example *myservice.com*, DNS is used to resolve the name to an IP. This article describes how App Service is handling name resolution and how it determines what DNS servers to use. The article also describes settings you can use to configure DNS resolution.

## How name resolution works in App Service

If your app isn't integrated with a virtual network and you haven't configured custom DNS, your app will use [Azure DNS](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution). If your app is integrated with a virtual network, your app uses the DNS configuration of the virtual network. The default for virtual network is also to use Azure DNS, but through the virtual network it's also possible to link to [Azure DNS private zones](../dns/private-dns-overview.md) and use that for private endpoint resolution or private domain name resolution. 

If your virtual network is configured with a list of custom DNS servers, name resolution will use these servers. If your virtual network is using custom DNS servers and you're using private endpoints, you should read [this article](../private-link/private-endpoint-dns.md) carefully. You'll also need to consider that your custom DNS servers will have to resolve any public DNS records need for your app either by forwarding requests to a public DNS server including Azure DNS in the list of custom DNS servers.

The individual app allows you to override the DNS configuration by specifying the `dnsServers` property in the `dnsConfiguration` site property object. You can specify up to five custom DNS servers. Custom DNS servers can be configured using the Azure CLI.

```azurecli-interactive
az resource update --resource-group <group-name> --name <app-name> --resource-type "Microsoft.Web/sites" --set properties.dnsConfiguration.dnsServers="['168.63.169.16','1.1.1.1']"
```

The existing `WEBSITE_DNS_SERVER` app setting can still be used, and you can add custom DNS servers with either setting. If you want to add multiple DNS servers using the app setting, the servers must be separated by commas with no blank spaces added.

When your app needs to resolve a domain name using DNS, a name resolution request is sent to all configured DNS servers. DNS server responses will be evaluated in the order the servers are configured, however if a higher order server doesn't respond within the configured timeout, it will fall back to the next server in the list.

**Note:** When using custom DNS servers from your virtual network and if your virtual network had more than two custom DNS servers configured, Windows code apps used to sort the servers, and only use the first two servers. This behavior has changed for new apps, but hasn't changed for existing apps to maintain backwards compatibility.

If you would like to adopt the new behavior of using up to five servers in the order they're specified in the virtual network for Windows code apps, you can run this CLI command:

```azurecli-interactive
az rest --method POST --uri <app-resource-id>/disableVirtualNetworkDnsSorting?api-version=2022-03-01
```

To verify if your app is using legacy sort ordering, you can run this command that will return true if it's still using legacy sort order.

```azurecli-interactive
az resource show --resource-group <group-name> --name <app-name> --resource-type "Microsoft.Web/sites" --query "properties.dnsConfiguration.dnsLegacySortOrder"
```

## Configure name resolution behavior

If you require fine-grained control over name resolution, App Service allows you to modify the default behavior. We allow you to modify retry attempts, retry timeout and cache timeout. Default timeout for retry attempts is 3 seconds, and you can configure it from 1-30 seconds. Default retry count is 1, but you can configure up to five retry attempts. DNS Cache timeout can be configured from 0-60 seconds. Default is 30 seconds and 0 means caching is disabled. Disabling or lowering cache duration may impact performance.

>[!NOTE]
> Windows Container apps currently does not support changing the name resolution behavior.

Configure the name resolution behavior by using these CLI commands:

```azurecli-interactive
az resource update --resource-group <group-name> --name <app-name> --set properties.dnsConfiguration.dnsMaxCacheTimeout=[0-60] --resource-type "Microsoft.Web/sites"
az resource update --resource-group <group-name> --name <app-name> --set properties.dnsConfiguration.dnsRetryAttemptCount=[1-5] --resource-type "Microsoft.Web/sites"
az resource update --resource-group <group-name> --name <app-name> --set properties.dnsConfiguration.dnsRetryAttemptTimeout=[1-30] --resource-type "Microsoft.Web/sites"
```

Validate the settings by using this CLI command:

```azurecli-interactive
az resource show --resource-group <group-name> --name <app-name> --query properties.dnsConfiguration --resource-type "Microsoft.Web/sites"
```



## Next steps

- [Configure virtual network integration](./configure-vnet-integration-enable.md.md)
- [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md)
- [General networking overview](./networking-features.md)