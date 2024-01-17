---
title: Name resolution in App Service
description: Overview of how name resolution (DNS) works for your app in Azure App Service.
author: madsd
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 04/03/2023
ms.author: madsd
---

# Name resolution (DNS) in App Service

Your app uses DNS when making calls to dependent resources. Resources could be Azure services such as Key Vault, Storage or Azure SQL, but it could also be web APIs that your app depends on. When you want to make a call to for example *myservice.com*, you're using DNS to resolve the name to an IP. This article describes how App Service is handling name resolution and how it determines what DNS servers to use. The article also describes settings you can use to configure DNS resolution.

## How name resolution works in App Service

If you aren't integrating your app with a virtual network and custom DNS servers aren't configured, your app uses [Azure DNS](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution). If you integrate your app with a virtual network, your app uses the DNS configuration of the virtual network. The default for virtual network is also to use Azure DNS. Through the virtual network, it's also possible to link to [Azure DNS private zones](../dns/private-dns-overview.md) and use that for private endpoint resolution or private domain name resolution. 

If you configured your virtual network with a list of custom DNS servers, name resolution uses these servers. If your virtual network is using custom DNS servers and you're using private endpoints, you should read [this article](../private-link/private-endpoint-dns.md) carefully. You also need to consider that your custom DNS servers are able to resolve any public DNS records used by your app. Your DNS configuration needs to either forward requests to a public DNS server, include a public DNS server like Azure DNS in the list of custom DNS servers or specify an alternative server at the app level.

When your app needs to resolve a domain name using DNS, the app sends a name resolution request to all configured DNS servers. If the first server in the list returns a response within the timeout limit, you get the result returned immediately. If not, the app waits for the other servers to respond within the timeout period and evaluates the DNS server responses in the order you configured the servers. If none of the servers respond within the timeout and you configured retry, you repeat the process.

## Configuring DNS servers

The individual app allows you to override the DNS configuration by specifying the `dnsServers` property in the `dnsConfiguration` site property object. You can specify up to five custom DNS servers. You can configure custom DNS servers using the Azure CLI:

```azurecli-interactive
az resource update --resource-group <group-name> --name <app-name> --resource-type "Microsoft.Web/sites" --set properties.dnsConfiguration.dnsServers="['168.63.129.16','xxx.xxx.xxx.xxx']"
```

## DNS app settings

App Service has existing app settings to configure DNS servers and name resolution behavior. Site properties override the app settings if both exist. Site properties have the advantage of being auditable with Azure Policy and validated at the time of configuration. We recommend you to use site properties. 

You can still use the existing `WEBSITE_DNS_SERVER` app setting, and you can add custom DNS servers with either setting. If you want to add multiple DNS servers using the app setting, you must separate the servers by commas with no blank spaces added.

Using the app setting `WEBSITE_DNS_ALT_SERVER`, you appends the specific DNS server to the list of DNS servers configured. The alternative DNS server is appended to both explicitly configured DNS servers and DNS servers inherited from the virtual network.

App settings also exist for configuring name resolution behavior and are named `WEBSITE_DNS_MAX_CACHE_TIMEOUT`, `WEBSITE_DNS_TIMEOUT` and `WEBSITE_DNS_ATTEMPTS`.

## Configure name resolution behavior

If you require fine-grained control over name resolution, App Service allows you to modify the default behavior. You can modify retry attempts, retry timeout and cache timeout. Changing behavior like disabling or lowering cache duration can influence performance.

|Property name|Windows default value|Linux default value|Allowed values|Description|
|-|-|-|-|
|dnsRetryAttemptCount|1|5|1-5|Defines the number of attempts to resolve where one means no retries.|
|dnsMaxCacheTimeout|30|0|0-60|DNS results are cached according to the individual records TTL, but no longer than the defined max cache timeout. Setting cache to zero means caching is disabled.|
|dnsRetryAttemptTimeout|3|1|1-30|Timeout before retrying or failing. Timeout also defines the time to wait for secondary server results if the primary doesn't respond.|

>[!NOTE]
> * Changing name resolution behavior is not supported on Windows Container apps.
> * To configure `dnsMaxCacheTimeout`, you need to ensure that caching is enabled by adding the app setting `WEBSITE_ENABLE_DNS_CACHE`="true". If you enable caching, but do not configure `dnsMaxCacheTimeout`, the timeout will be set to 30.

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

- [Configure virtual network integration](./configure-vnet-integration-enable.md)
- [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md)
- [General networking overview](./networking-features.md)
