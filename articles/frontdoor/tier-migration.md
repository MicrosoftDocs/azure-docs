---
title: About Azure Front Door (classic) to Standard/Premium tier migration
description: This article explains the migration process and changes expected when using the migration tool to Azure Front Door Standard/Premium tier.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 05/26/2023
ms.author: duau
---

# About Azure Front Door (classic) to Standard/Premium tier migration

Azure Front Door Standard and Premium tier were released in March 2022 as the next generation content delivery network service. The newer tiers combine the capabilities of Azure Front Door (classic), Microsoft CDN (classic), and Web Application Firewall (WAF). With features such as Private Link integration, enhanced rules engine and advanced diagnostics you have the ability to secure and accelerate your web applications to bring a better experience to your customers.

We recommend migrating your classic profile to one of the newer tier to benefit from the new features and improvements. To ease the move to the new tiers, Azure Front Door provides a zero-downtime migration to move your workload from Azure Front Door (classic) to either Standard or Premium.

In this article you'll learn about the migration process, understand the breaking changes involved, and what to do before, during and after the migration.

## Migration process overview

Migrating to Standard or Premium tier for Azure Front Door happens in either three or five phases depending on if you're using your certificate. The time it takes to migrate depends on the complexity of your Azure Front Door (classic) profile. You can expect the migration to take a few minutes for a simple Azure Front Door profile and longer for a profile that has multiple frontend domains, backend pools, routing rules and rule engine rules.

### Phases of migration

#### Validate compatibility

The migration tool checks to see if your Azure Front Door (classic) profile is compatible for migration. If validation fails, you're provided with suggestions on how to resolve any issues before you can validate again.

* Azure Front Door Standard and Premium require all custom domains to use HTTPS. If you don't have your own certificate, you can use an Azure Front Door managed certificate. The certificate is free of charge and gets managed for you.

* Session affinity gets enabled in the origin group settings for an Azure Front Door Standard or Premium profile. In Azure Front Door (classic), session affinity is set at the domain level. As part of the migration, session affinity is based on the Front Door (classic) profile settings. If you have two domains in your Front Door (classic) profile that shares the same backend pool, session affinity has to be consistent across both domains in order for migration validation to pass.

* If you're using BYOC (Bring Your Own Certificate) for Azure Front Door (classic), you need to [grant Key Vault access](standard-premium/how-to-configure-https-custom-domain.md#register-azure-front-door) to Azure Front Door Standard or Premium. This step is required for Azure Front Door Standard or Premium to access your certificate in Key Vault. If you're using Azure Front Door managed certificate, you don't need to grant Key Vault access.

#### Prepare for migration

Azure Front Door creates a new Standard or Premium profile based on your Front Door (classic) profile's configuration. The new Front Door profile tier depends on the Web Application Firewall (WAF) policy settings you associate with the profile.

* **Premium** - If your WAF policy has **managed WAF rules** associated to the Azure Front Door (classic) profile.

* **Standard** - If your WAF policy only has **custom WAF rules** associated to the Azure Front Door (classic) profile.

> [!NOTE]
> A standard tier Front Door profile **can** be upgraded to premium tier after migration. However, a premium tier Front Door profile **can't** be downgraded to standard tier after migration.

During the preparation phase, Azure Front Door creates a copy of each WAF policy associated to the Front Door (classic) profile. The WAF policy tier is specific to the tier you're migrating to. A default name is provided for each WAF policy and you can change the name during this phase. You also can select an existing WAF policy that matches the tier you're migrating to instead of making a copy. Once the preparation phase is completed, a read-only view of the new Front Door profile is provided for you to verify configurations.

> [!IMPORTANT]
> You won't be able to make changes to the Front Door (classic) configuration once the preparation phase has been initiated.

#### Enable managed identity

During this step, you configure managed identity for Azure Front Door to access your certificate in an Azure Key Vault. Managed identity is required if you're using BYOC (Bring Your Own Certificate) for Azure Front Door (classic). If you're using Azure Front Door managed certificate, you don't need to grant Key Vault access.

#### Grant managed identity to Key Vault

This step adds managed identity access to all Azure Key Vaults used in the Front Door (classic) profile. 

#### Migrate
    
Once migration begins, the Azure Front Door (classic) profile gets disabled and the Azure Front Door Standard, or Premium profile gets activated. Traffic starts flowing through the new profile once the migration completes.

If you decided you no longer want to move forward with the migration process, you can select **Abort migration**. Aborting the migration deletes the new Front Door profile that was created. The Azure Front Door (classic) profile remains active and you can continue to use it. Any WAF policy copies need to be manually deleted.

Service charges for Azure Front Door Standard or Premium tier start once migration is completed.

## Breaking changes when migrating to Standard or Premium tier

> [!IMPORTANT]
> * If your Azure Front Door (classic) profile can qualify to migrate to Standard tier but the number of resources exceeds the Standard tier quota limit, it will be migrated to Premium tier instead.
> * If you use Azure PowerShell, Azure CLI, API, or Terraform to do the migration, then you need to create WAF policies separately.

### Dev-ops

Azure Front Door Standard and Premium use a different resource provider namespace of *Microsoft.Cdn*, while Azure Front Door (classic) uses *Microsoft.Network*. After you migrate your Azure Front Door profile, you'll need to change your Dev-ops script to use the new namespace, updated Azure PowerShell module, CLI commands and APIs.

### Endpoint with hash value

Azure Front Door Standard and Premium endpoints are generated to include a hash value to prevent your domain from being taken over. The format of the endpoint name is `<endpointname>-<hashvalue>.z01.azurefd.net`. The Front Door (classic) endpoint name will continue to work after migration but we recommend replacing it with the newly created endpoint name from your new Standard or Premium profile. For more information, see [Endpoint domain names](endpoint.md#endpoint-domain-names).

### Logs and metrics

Diagnostic logs and metrics aren't migrated. Azure Front Door Standard and Premium log fields are different from Azure Front Door (classic). Standard and Premium tier has heath probe logging and we recommend that you enable diagnostic logging after you migrate. Standard and Premium tier also supports built-in reports that start displaying data once the migration is completed. For more information, see [Azure Front Door reports](standard-premium/how-to-reports.md).

### Web Application Firewall (WAF)

The default Azure Front Door tier selected for migration gets determined by the type of rules contain in the WAF policy. In this section, we cover scenarios for different rule types for a WAF policy.

**Classic WAF policy with only custom rules** - the new Azure Front Door profile defaults to Standard tier and can be upgraded to Premium during the migration. If you use the portal for migration, Azure creates custom WAF rules for Standard. If you upgrade to Premium during migration, custom WAF rules are created as part of the migration process. You'll need to add managed WAF rules manually after migration if you want to use managed rules.

**Classic WAF policy with only managed WAF rules, or both managed and custom WAF rules** - the new Azure Front Door profile defaults to Premium tier and can't be downgraded during the migration. If you want to use Standard tier, then you need to remove the WAF policy association or delete the managed WAF rules from the Front Door (classic) WAF policy.

> [!NOTE]
> To avoid creating duplicate WAF policies during migration, the migration capability provides the option to either create copies or use an existing Azure Front Door Standard or Premium WAF policy.

### Azure Policy for Azure Front Door WAF

[Azure Policy for WAF](../web-application-firewall/shared/waf-azure-policy.md) is not available for Azure Front Door Standard and Premium. Azure Policy lets you set and check WAF standards for your organization at a large scale. This feature will be available in the near future.

## Naming convention used for migration

During the migration, a default profile name is used in the format of `<endpointprefix>-migrated`. For example, an Azure Front Door (classic) endpoint named `myEndpoint.azurefd.net`, has the default name of `myEndpoint-migrated`. 
A WAF policy name has `-standard` or `-premium` appended to the classic WAF policy name. For example, a Front Door (classic) WAF policy named `contosoWAF1`, has the default name of `contosoWAF1-premium`. You can rename both the Front Door profile and WAF policy during migration process. Renaming of rules engine configuration and routes aren't supported and instead default names are assigned.

URL redirect and URL rewrite are supported through rules engine in Azure Front Door Standard and Premium, while Azure Front Door (classic) supports them through routing rules. During migration, these two rules get created as rule set rules in a Standard and Premium profile. The namings of these rules are `urlRewriteMigrated` and `urlRedirectMigrated`.

## Resource states

The following table explains the various stages of the migration process and if changes can be made to the profile.

| Migration state | Front Door (classic) resource state | Can make changes? | Front Door Standard/Premium | Can make changes? |
|--|--|--|--|--|
| Before migration | Active | Yes | N/A | N/A |
| Validating compatibility | Active | Yes | N/A | N/A |
| Prepare for migration | Migrating | No | Creating | No |
| Committing migration | Migrating | No | CommittingMigration | No |
| Committed migration | Migrated | No | Active | Yes |
| Aborting migration | AbortingMigration | No | Deleting | No |
| Aborted migration | Active | Yes | Deleted | N/A | 

## Next steps

* Understand the [settings mapping between Azure Front Door tiers](tier-mapping.md).
* Learn how to [migrate from Azure Front Door (classic) to Standard or Premium tier](migrate-tier.md) using the Azure portal.
* Learn how to [migrate from Azure Front Door (classic) to Standard or Premium tier](migrate-tier-powershell.md) using Azure PowerShell.
