---
title: Azure App Configuration FAQ
description: Frequently asked questions about Azure App Configuration
services: azure-app-configuration
author: lisaguthrie

ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/19/2020
ms.author: lcozzens
---

# Azure App Configuration FAQ

This article answers frequently asked questions about Azure App Configuration.

## How is App Configuration different from Azure Key Vault?

App Configuration helps developers manage application settings and control feature availability. It aims to simplify many of the tasks of working with complex configuration data.

App Configuration supports:

- Hierarchical namespaces
- Labeling
- Extensive queries
- Batch retrieval
- Specialized management operations
- A feature-management user interface

App Configuration complements Key Vault, and the two should be used side by side in most application deployments.

## Should I store secrets in App Configuration?

Although App Configuration provides hardened security, Key Vault is still the best place for storing application secrets. Key Vault provides hardware-level encryption, granular access policies, and management operations such as certificate rotation.

You can create App Configuration values that reference secrets stored in Key Vault. For more information, see [Use Key Vault references in an ASP.NET Core app](./use-key-vault-references-dotnet-core.md).

## Does App Configuration encrypt my data?

Yes. App Configuration encrypts all key values it holds, and it encrypts network communication. Key names and labels are used as indexes for retrieving configuration data and aren't encrypted.

## How is App Configuration different from Azure App Service settings?

Azure App Service allows you to define app settings for each App Service instance. These settings are passed as environment variables to the application code. You can associate a setting with a specific deployment slot, if you want. For more information, see [Configure app settings](/azure/app-service/configure-common#configure-app-settings).

In contrast, Azure App Configuration allows you to define settings that can be shared among multiple apps. This includes apps running in App Service, as well as other platforms. Your application code accesses these settings through the configuration providers for .NET and Java, through the Azure SDK, or directly via REST APIs.

You can also import and export settings between App Service and App Configuration. This capability allows you to quickly set up a new App Configuration store based on existing App Service settings. You can also share configuration with an existing app that relies on App Service settings.

## Are there any size limitations on keys and values stored in App Configuration?

There's a limit of 10 KB for a single key-value item.

## How should I store configurations for multiple environments (test, staging, production, and so on)?

You control who can access App Configuration at a per-store level. Use a separate store for each environment that requires different permissions. This approach provides the best security isolation.

If you do not need security isolation between environments, you can use labels to differentiate between configuration values. [Use labels to enable different configurations for different environments](./howto-labels-aspnet-core.md) provides a complete example.

## What are the recommended ways to use App Configuration?

See [best practices](./howto-best-practices.md).

## How much does App Configuration cost?

There are two pricing tiers:

- Free tier
- Standard tier.

If you created a store prior to the introduction of the Standard tier, it automatically moved to the Free tier upon general availability. You can choose to upgrade to the Standard tier or remain on the Free tier.

You can't downgrade a store from the Standard tier to the Free tier. You can create a new store in the Free tier and then import configuration data into that store.

## Which App Configuration tier should I use?

Both App Configuration tiers offer core functionality, including config settings, feature flags, Key Vault references, basic management operations, metrics, and logs.

The following are considerations for choosing a tier.

- **Resources per subscription**: A resource consists of a single configuration store. Each subscription is limited to one configuration store in the free tier. Subscriptions can have an unlimited number of configuration stores in the standard tier.
- **Storage per resource**: In the free tier, each configuration store is limited to 10 MB of storage. In the standard tier, each configuration store can use up to 1 GB of storage.
- **Key history**: App Configuration stores a history of all changes made to keys. In the free tier, this history is stored for seven days. In the standard tier, this history is stored for 30 days.
- **Requests per day**: Free tier stores are limited to 1,000 requests per day. Once a store reaches 1,000 requests, it will return HTTP status code 429 for all requests until midnight UTC.

    For standard tier stores, the first 200,000 requests each day are included in the daily charge. Additional requests are billed as overage.

- **Service level agreement**: The standard tier has an SLA of 99.9% availability. The free tier doesn't have an SLA.
- **Security features**: Both tiers include basic security functionality, including encryption with Microsoft-managed keys, authentication via HMAC or Azure Active Directory, RBAC support, and managed identity. The Standard tier offers more advanced security functionality, including Private Link support and encryption with customer-managed keys.
- **Cost**: Standard tier stores have a daily usage charge. There's also an overage charge for requests past the daily allocation. There's no cost to use a free tier store.

## Can I upgrade a store from the Free tier to the Standard tier? Can I downgrade a store from the Standard tier to the Free tier?

You can upgrade from the Free tier to the Standard tier at any time.

You can't downgrade a store from the Standard tier to the Free tier. You can create a new store in the Free tier and then [import configuration data into that store](howto-import-export-data.md).

## Are there any limits on the number of requests made to App Configuration?

Configuration stores in the Free tier are limited to 1,000 requests per day. Configuration stores in the Standard tier may experience temporary throttling when the request rate exceeds 20,000 requests per hour.

When a store reaches its limit, it will return HTTP status code 429 for all requests made until the time period expires. The `retry-after-ms` header in the response gives a suggested wait time (in milliseconds) before retrying the request.

If your application regularly experiences HTTP status code 429 responses, consider redesigning it to reduce the number of requests made. For more information, see [Reduce requests made to App Configuration](./howto-best-practices.md#reduce-requests-made-to-app-configuration)

## My application receives HTTP status code 429 responses. Why?

You'll receive an HTTP status code 429 response under these circumstances:

* Exceeding the daily request limit for a store in the Free tier.
* Temporary throttling due to a high request rate for a store in the Standard tier.
* Excessive bandwidth usage.
* Attempting to create or modify a key when the storage quote is exceeded.

Check the body of the 429 response for the specific reason why the request failed.

## How can I receive announcements on new releases and other information related to App Configuration?

Subscribe to our [GitHub announcements repo](https://github.com/Azure/AppConfiguration-Announcements).

## How can I report an issue or give a suggestion?

You can reach us directly on [GitHub](https://github.com/Azure/AppConfiguration/issues).

## Next steps

* [About Azure App Configuration](./overview.md)
