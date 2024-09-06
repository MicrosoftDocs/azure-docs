---
title: About Azure CDN from Microsoft (classic) to Azure Front Door migration (preview)
description: This article explains the migration process and changes expected when changing from Azure CDN from Microsoft (classic) to Azure Front Door Standard or Premium tier.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: conceptual
ms.date: 06/25/2024
ms.author: duau
---

# About Azure CDN from Microsoft (classic) to Azure Front Door migration (preview)

> [!IMPORTANT]
> Azure CDN from Microsoft to Azure Front Door migration is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Front Door Standard and Premium tier were released in March 2022 as the next generation content delivery network service. The newer tiers combine the capabilities of Azure Front Door (classic), Microsoft CDN (classic), and Web Application Firewall (WAF). With features such as Private Link integration, enhanced rules engine and advanced diagnostics you have the ability to secure and accelerate your web applications to bring a better experience to your customers.

We recommend migrating your classic profile to one of the newer tier to benefit from the new features and improvements. To ease the move to the new tiers, Azure Front Door provides a zero-downtime migration to move your workload from Azure Front Door (classic) to either Standard or Premium.

In this article you'll learn about the migration process, understand the breaking changes involved, and what to do before, during and after the migration.

## Migration process overview

Migrating to Standard or Premium tier for Azure Front Door happens in either three or five phases depending on if you're using your certificate. The time it takes to migrate depends on the complexity of your Azure CDN from Microsoft (classic) profile. You can expect the migration to take a few minutes for a simple Azure CDN profile and longer for a profile that has multiple domains, backend pools, routing rules and rule engine rules.

### Phases of migration

#### Validate compatibility

The migration tool checks to see if your Azure CDN from Microsoft (classic) profile is compatible for migration. If validation fails, you're provided with suggestions on how to resolve any issues before you can validate again.

* Azure Front Door Standard and Premium require all custom domains to use HTTPS. If you don't have your own certificate, you can use an Azure CDN from Microsoft managed certificate. The certificate is free of charge and gets managed for you.

* There's a one to one mapping for an Azure CDN from Microsoft (classic) and Azure Front Door Standard or Premium endpoint. A CDN from Microsoft (classic) endpoint in a *Stopped* state can't be migrated. You need to either start the endpoint or delete it before you can validate again.

* Web Application Firewall (WAF) for Azure CDN from Microsoft is only in preview. If you have a WAF policy associated with your Azure CDN from Microsoft (classic) profile, you need to remove the association before you can validate again. You can create a new WAF policy in Azure Front Door Standard or Premium after migration.

> [!NOTE]
> Managed certificate is currently **not supported** for Azure Front Door Standard or Premium tier in Azure Government Cloud. You'll need to use Bring Your Own Certificate (BYOC) for Azure Front Door Standard or Premium tier in Azure Government Cloud or wait until managed certificate is supported.

#### Prepare for migration

You can select Standard or Premium based on your business requirements. It's recommended to select Premium tier to take advantage of the advanced security features and capabilities. These include managed WAF rules, enhanced rules engine, bot protection, and private link integration.

> [!NOTE]
> * If your Azure CDN from Microsoft (classic) profile can qualify to migrate to Standard tier but the number of resources exceeds the Standard tier quota limit, it will be migrated to Premium tier instead.
> * A standard tier Front Door profile **can** be upgraded to premium tier after migration. However, a premium tier Front Door profile **can't** be downgraded to standard tier after migration.

> [!IMPORTANT]
> You won't be able to make changes to the Azure CDN from Microsoft (classic) configuration once the preparation phase has been initiated.

#### Enable managed identity

During this step, you can configure managed identity for Azure Front Door to access your certificate in an Azure Key Vault, if you haven't for your Azure CDN from Microsoft (classic) profile. The managed identity is the same in Azure Front Door since they use the same resource provider. Managed identity is required if you're using BYOC (Bring Your Own Certificate). If you're using Azure Front Door managed certificate, you don't need to grant Key Vault access.

#### Grant managed identity to Key Vault

This step adds managed identity access to all Azure Key Vaults used in the Azure CDN from Microsoft (classic) profile. 

#### Migrate
    
Once migration begins, the Azure CDN from Microsoft (classic) profile gets upgraded to Azure Front Door. After migration, you won't be able to view the Azure CDN from Microsoft (classic) profile in the Azure portal.

If you decided you no longer want to move forward with the migration process, you can select **Abort migration**. Aborting the migration deletes the new Azure Front Door profile that was created. The Azure CDN from Microsoft (classic) profile remains active and you can continue to use it. Any WAF policy copies need to be manually deleted.

Service charges for Azure Front Door Standard or Premium tier start once migration is completed.

## Breaking changes when migrating to Standard or Premium tier

### Dev-ops

After you migrate your Azure Front Door profile, you'll need to change your Dev-ops script to use the new API, updated Azure PowerShell module, CLI commands and APIs.

### Endpoint with hash value

Azure Front Door Standard and Premium endpoints are generated to include a hash value to prevent your domain from being taken over. The format of the endpoint name is `<endpointname>-<hashvalue>.z01.azurefd.net`. The Front Door (classic) endpoint name will continue to work after migration but we recommend replacing it with the newly created endpoint name from your new Standard or Premium profile. For more information, see [Endpoint domain names](../frontdoor/endpoint.md#endpoint-domain-names). If you're using Azure CDN endpoint in your application code, it's recommended to update using a custom domain name.

### Logs, metrics, core analytics

Diagnostic logs and metrics aren't migrated. Azure Front Door Standard and Premium log fields are different from Azure CDN from Microsoft (classic). Standard and Premium tier has heath probe logging and we recommend that you enable diagnostic logging after you migrate. 

Core Analytics aren't supported with Azure Front Door Standard or Premium tier. Instead, built-in reports are provided and starts displaying data once the migration is completed. For more information, see [Azure Front Door reports](../frontdoor/standard-premium/how-to-reports.md).

## Resource states

The following table explains the various stages of the migration process and if changes can be made to the profile.

| Migration state | CDN from Microsoft (classic) resource state | Can I make changes? | Front Door Standard/Premium | Can I make changes? |
|--|--|--|--|--|
| Before migration | Active | Yes | N/A | N/A |
| Validating compatibility | Active | Yes | N/A | N/A |
| Prepare for migration | Migrating | No | | No |
| Committing migration | | | CommittingMigration | No |
| Committed migration | | | Active | Yes |
| Aborting migration | AbortingMigration | No | | |
| Aborted migration | Active | Yes | | | 

## Resource mapping after migration

When you migrate your Azure CDN from Microsoft (classic) to Azure Front Door Standard or Premium, you notice some configurations changed, or relocated to provide a better experience to help manage your Azure Front Door profile. In this section, you learn how Azure CDN resources are mapped inAzure Front Door. The Azure Front Door resource ID doesn’t change after migration.

| Resources | CDN or AFD | Resource mapping after migration |
| --- | --- | --- |
| Endpoint | Both | There's one to one mapping for Azure CDN from Microsoft (classic) and Azure Front Door Standard/Premium endpoint. Azure CDN from Microsoft (classic) endpoints are required in a started state or they have to be removed. |
| Route and route status | AFD | There isn't a route concept in Azure CDN from Microsoft (classic). After the migration, a default route gets created in Azure Front Door Standard and Premium with all the CDN resources. The route is in an **Enabled** state and with names in the form of `endpointName` with hyphens removed. For example, an endpoint named `contoso-1.azureedge.net` has a route name of *contoso1*. |
| Enforce certificate name check | AFD | Enforce certificate name check is disabled in Microsoft CDN but is enabled by default in Azure Front Door Standard/Premium. After the migration, it will continue to be disabled to avoid causing breaking change. It's recommended to enable the check after migration in Azure Front Door. |
| Origin and origin group | Both | 1. For CDN resource with a single origin and without origin group, a default origin group is created for the origin with the name *defaultOriginGroup_EndpointName*. <br> 2. For multi-origin CDN, if the origin is associated to multiple origin groups, these origins will be created in all the origin groups after migration. <br> 3. For everything else, the origin and origin group names remain the same. <br> 4. If the CDN profile has origins that aren't associated to any working CDN endpoint, a default origin group is created for them but not associated to any routes. |
| Origin response timeout | AFD | The current default response timeout is 30 seconds in Azure CDN from Microsoft (classic). After migration, this value will remain the same but can be modified. |
| Forwarding protocol (matching protocol only) | Both | If both HTTP and HTTPS are selected, Azure Front Door matches the incoming request. |
| Rule set name | AFD | There isn't a rule set concept in Microsoft CDN. After the migration, all rules will be grouped into a single rule set with name in the form of *endpointprefixMigratedRule*. For example, the endpoint `contoso.azureedge.net`, the rule set name is *contosoMigratedRuleSet* |
| Caching | Both | Caching is always set to enabled and mapped to the cache and compression settings in Azure CDN from Microsoft (classic). <br><br>For **BypassCachingforQueryString**, a rule set will be created with the name **bypassCachingforQueryStringMigrated** after migration. If the classic endpoint has other rules, it would be grouped in the same rule set as the *bypassCachingforQueryStringMigrated* rule. <br><br>IF "Query String" GreaterThan 0<br>THEN "Route Configuration Overrid" -> "Override origin group" No -> "Caching" Disabled |
| Session affinity | Both | Disabled by default in Azure CDN unless configured and will be disabled after migration. This setting can be enabled in Azure Front Door. |
| Global rules engine rule | CDN | There are global rule engine rules in Azure CDN from Microsoft (classic). After the migration, they're created as a rule set without any conditions and is associated to the route that was created for the classic endpoint. |
| Geo filter | CDN | After the migration, WAF policies with a mapping SKU of your choice and custom WAF rules will be created to map the geo filter rules and associated to the corresponding route. |
| Associated WAF policy | | Web Application Firewall is in preview for Azure CDN from Microsoft (classic). For CDN resources with the preview WAF policies, these policies will need to be recreated after the migration. |
| Custom domains | | This section uses `www.contoso.com` as an example to show what happens to a domain that is going through the migration. The custom domain `www.contoso.com` points to `contoso.azureedge.net` in the Azure CDN from Microsoft (classic) as a CNAME record. <br><br>When `www.contoso.com` gets moved to the new Azure Front Door profile: <br>- The association for the custom domain shows the new Front Door endpoint as `contoso-<hashvalue>.z01.azurefd.net`. Note the `z01` can be any value with an alphabetic letter and two numbers. The CNAME of the custom domain automatically gets pointed to the new endpoint name with the hash value in the backend. At this time, you can change the CNAME record with your DNS provider to the new endpoint name with the hash value. <br>- The classic endpoint `contoso.azureedge.net` shows up as a custom domain in the migrated Azure Front Door profile under the **Migrated domain** tab of the *Domains* page. This domain is associated to the default migrated route. This default route can only be removed once the domain is disassociated from it. The domain properties can't be updated, except for when associating and removing the association from a route. The domain can only be deleted after you've change the CNAME to the new endpoint name. <br>- The certificate state and the DNS state for `www.contoso.com` is the same as the Azure CDN from Microsoft (classic) profile. <br><br>No changes are made the managed certificate auto rotation settings. |

## Next steps

* Learn how to [migrate from Azure CDN from Microsoft (classic) to Azure Front Door](migrate-tier.md) using the Azure portal.

