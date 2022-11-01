---
title: About Azure Front Door (classic) to Standard/Premium tier migration
description: This article explains the migration process and changes expected when using the migration tool from Azure Front Door (classic) to Standard/Premium tier.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 10/11/2022
ms.author: duau
---

# About Azure Front Door (classic) to Standard/Premium tier migration

Azure Front Door Standard and Premium tiers were released in March 2022 as the next generation content delivery network service. The newer tiers combine the capabilities of Azure Front Door (classic), Microsoft CDN (classic), and Web Application Firewall (WAF). With features such as Private Link integration, enhanced rules engine and diagnostics you have the ability to secure and accelerate your web applications to bring a better experience to your customers.

Azure recommends migrating to the newer tiers to benefit from the new features and improvements over the Classic tier. To help with the migration process, Azure Front Door provides a zero-downtime migration tool to migrate your workload from Azure Front Door (class) to either Standard or Premium tier.

In this article you'll learn about the migration process, understand the breaking changes involved, and what to do before, during and after the migration.

## Migration process overview

Azure Front Door zero-down time migration happens in three stages. The first stage is validation, followed by preparation for migration, and then migrate/abort. The time it takes for a migration to complete depends on the complexity of the Azure Front Door profile. You can expect the migration to take a few minutes for a simple Azure Front Door profile and longer for a profile that has many frontend domains, backend pools, routing rules and rule engine rules.

### Five steps of migration

**Validate compatibility** - The migration tool will validate if the Azure Front Door (classic) profile is eligible for migration. You'll be prompted with messages on what needs to be fixed before you can move onto the preparation phase. For more information, see [Pre-requisites]() or [preparations for migration]().

**Prepare for migration** - Azure Front Door will create a new Standard or Premium profile based on your Classic profile configuration in a disabled state. The new Front Door profile created will depend on the Web Application Firewall (WAF) policy you've associated to the profile.

* **Premium tier** - If you have *managed WAF* policies associated to the Azure Front Door (classic) profile. A premium tier profile **can't** be downgraded to a standard tier after migration.
* **Standard tier** - If you have *custom WAF* policies associated to the Azure Front Door (classic) profile. A standard tier profile **can** be upgraded to premium tier after migration.

    During the preparation stage, Azure Front Door will create copies of WAF policies specific to the Front Door tier with default names. You can change the name for the WAF policies at this time. You can also select an existing WAF policy that matches the tier you're migrating to.

    At this time, a read-only view of the newly created profile is provided for you to verify configurations.

    > [!NOTE]
    > No changes can be to the Front Door (classic) configuration once this step has been initiated.

**Enable managed identities** - During this step you can configure managed identities for Azure Front Door to access your certificate in a Key Vault.

**Grant managed identities to Key Vault for Front Door (classic) profile** - This step adds managed identity access to all the Key Vaults used in the Front Door (classic) profile. 

**Migrate/Abort migration**
    
* **Migrate** - Once you select this option, the Azure Front Door (classic) profile gets disabled and the Azure Front Door Standard or Premium profile will be activated. Traffic will start going through the new profile once the migration completes.
* **Abort migration** - If you decided you no longer want to move forward with the migration process, selecting this option will delete the new Front Door profile that was created.  

> [!NOTE]
> * Traffic to your Azure Front Door (classic) will continue to be serve until migration has been completed. 
> * Each Azure Front Door (classic) profile can create one Azure Front Door Standard or Premium profile.
> * If you cancel the migration only the new Front Door profile gets deleted, any WAF policy copies will need to be manually deleted.

Migration steps can be completed using the Azure portal, Azure PowerShell, or Azure CLI. Service charges for Azure Front Door Standard or Premium tier will start once migration is completed.

## Breaking changes between tiers

### Dev-ops

Azure Front Door Standard/Premium uses a different resource provider namespace of *Microsoft.Cdn*, while Azure Front Door (classic) uses *Microsoft.Network*. After you've migrated your Azure Front Door profile, you need to change your Dev-ops script to use the new namespace, different Azure PowerShell module and CLI commands and API.

### Endpoint with hash value

Azure Front Door Standard and Premium endpoints are generated to include a hash value to prevent your domain from being taken over. The format of the endpoint name is `<endpointname>-<hashvalue>.z01.azurefd.net`. The Classic Front Door endpoint name will continue to work after migration but we recommend replacing it with the newly created endpoint name from the Standard or Premium profile. For more information, see [Endpoint domain names](endpoint.md#endpoint-domain-names).

### Logs and Metrics

Diagnostic logs and metrics won't be migrated. Azure Front Door Standard/Premium log fields are different from Front Door (classic). The newer tier also has heath probe logs and is recommended you enable diagnostic logging after the migration complete. Standard and Premium tier also supports built-in reports that will start displaying data once the migration is done.

## Prerequisites

* HTTPS is required for all custom domains. All Azure Front Door Standard and Premium tiers enforce HTTPS on every domain. If you don't your own certificate, you can use Azure Front Door managed certificate that is free and managed for you.
* If you use BYOC for Azure Front Door (classic), you need to grant Key Vault access to your Azure Front Door Standard or Premium profile by completing the following steps:
    * Register the service principal for **Microsoft.AzureFrontDoor-Cdn** as an app in your Azure Active Directory using Azure PowerShell.
    * Grant **Microsoft.AzureFrontDoor-Cdn** access to your Key Vault.
* Session affinity is enabled from within the origin group in an Azure Front Door Standard and Premium profile. In Azure Front Door (classic), session affinity is controlled at the domain level. As part of the migration, session affinity gets enabled or disabled based on the Classic profile's configuration. If you have two domains in a Classic profile that shares the same origin group, session affinity has to be consistent across both domains in order for migration can pass validation.

> [!IMPORTANT]
> * If your Azure Front Door (classic) profile can qualify to migrate to Standard tier but the number of resources exceeds the Standard tier quota limit, it will be migrated to Premium tier instead.
> * If you use Azure PowerShell, Azure CLI, API, or Terraform to do the migration, then you need to create WAF policies separately.

### Web Application Firewall (WAF)

The default Azure Front Door tier created during migration is determined by the type of rules contain in the WAF policy. In this section we'll, cover scenarios for different rule type for a WAF policy.

* Classic WAF policy contains only custom rules.
    * The new Azure Front Door profile defaults to Standard tier and can be upgraded to Premium during migration. If you use the portal for migration, Azure will create custom WAF rules for Standard. If you upgrade to Premium during migration, custom WAF rules will be created by the migration tool, but managed WAF rules will need to be created manually after migration.
* Classic WAF policy has only managed WAF rules, or both managed and custom WAF rules.
    * The new Azure Front Door profile defaults to Premium tier and isn't eligible for downgrade during migration. Remove the WAF policy association or delete the manage WAF rules from the Classic WAF policy.

    > [!NOTE]
    > To avoid creating duplicate WAF policies during migration, the Azure portal provides the option to either create copies or reuse an existing Azure Front Door Standard or Premium WAF policy.
    
* If you migrate your Azure Front Door profile using Azure PowerShell or Azure CLI, you need to create the WAF policies separately before migration.

## Naming convention for migration

During the migration, a default profile name is used in the format of `<endpointprefix>-migrated`. For example, a Classic endpoint named `myEndpoint.azurefd.net`, will have the default name of `myEndpoint-migrated`. 
WAF policy name will use the format of `<classicWAFpolicyname>-<standard or premium>`. For example, a Classic WAF policy named `contosoWAF1`, will have the default name of `contosoWAF1-premium`. You can rename the Front Door profile and the WAF policy during migration. Renaming of rule engine and routes isn't supported, instead default names will be assigned.

URL redirect and URL rewrite are supported through rules engine in Azure Front Door Standard and Premium, while Azure Front Door (classic) supports them through routing rules. During migration, these two rules get created as rules engine rules in a Standard and Premium profile. The names of these rules are `urlRewriteMigrated` and `urlRedirectMigrated`.

## Resource states

The following table explains the various stages of the migration process and if changes can be made to the profile.

| Migration state | Front Door (classic) resource state | Can make changes? | Front Door Standard/Premium | Can make changes? |
|--|--|--|--|--|
|Before migration| Active | Yes | N/A | N/A |
| Step 1: Validating compatibility | Active | Yes | N/A | N/A |
| Step 2: Preparing for migration | Migrating | No | Creating | No |
| Step 5: Committing migration | Migrating | No | CommittingMigration | No |
| Step 5: Committed migration | Migrated | No | Active | Yes |
| Step 5: Aborting migration | AbortingMigration | No | Deleting | No |
| Step 5: Aborted migration | Active | Yes | Deleted | N/A | 

## Next steps

* Understand the [mapping between Front Door tiers](tier-mapping.md) settings.
* Learn how to [migrate from Classic to Standard/Premium tier](migrate-tier.md) using the Azure portal.