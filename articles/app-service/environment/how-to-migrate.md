---
title: Use the migration feature to migrate your App Service Environment to App Service Environment v3
description: Learn how to migrate your App Service Environment to App Service Environment v3 using the migration feature
author: seligj95
ms.topic: tutorial
ms.custom: devx-track-azurecli
ms.date: 8/07/2023
ms.author: jordanselig
zone_pivot_groups: app-service-cli-portal
---
# Use the migration feature to migrate App Service Environment v1 and v2 to App Service Environment v3

An App Service Environment v1 and v2 can be automatically migrated to an [App Service Environment v3](overview.md) using the migration feature. To learn more about the migration process and to see if your App Service Environment supports migration at this time, see the [Migration to App Service Environment v3 Overview](migrate.md).

> [!IMPORTANT]
> It is recommended to use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

## Prerequisites

Ensure you understand how migrating to an App Service Environment v3 affects your applications. Review the [migration process](migrate.md#overview-of-the-migration-process-using-the-migration-feature) to understand the process timeline and where and when you need to get involved. Also review the [FAQs](migrate.md#frequently-asked-questions), which may answer some questions you currently have.

Ensure there are no locks on your virtual network, resource group, resource, or subscription. Locks block platform operations during migration.

::: zone pivot="experience-azcli"

The recommended experience for the migration feature is using the [Azure portal](how-to-migrate.md?pivots=experience-azp). If you decide to use the Azure CLI to carry out the migration, you should follow the steps described here in order and as written since you're making Azure REST API calls. The recommended way for making these API calls is by using the [Azure CLI](/cli/azure/). For information about other methods, see [Getting Started with Azure REST](/rest/api/azure/).

For this guide, [install the Azure CLI](/cli/azure/install-azure-cli) or use the [Azure Cloud Shell](https://shell.azure.com/).

## 1. Get your App Service Environment ID

Run these commands to get your App Service Environment ID and store it as an environment variable. Replace the placeholders for name and resource groups with your values for the App Service Environment you want to migrate. "ASE_RG" and "VNET_RG" are the same if your virtual network and App Service Environment are in the same resource group.

```azurecli
ASE_NAME=<Your-App-Service-Environment-name>
ASE_RG=<Your-ASE-Resource-Group>
VNET_RG=<Your-VNet-Resource-Group>
ASE_ID=$(az appservice ase show --name $ASE_NAME --resource-group $ASE_RG --query id --output tsv)
```

## 2. Validate migration is supported

The following command checks whether your App Service Environment is supported for migration. If you receive an error or if your App Service Environment is in an unhealthy or suspended state, you can't migrate at this time. See the [troubleshooting](migrate.md#troubleshooting) section for descriptions of the potential error messages you may get. If your environment [isn't supported for migration](migrate.md#supported-scenarios) or you want to migrate to App Service Environment v3 without using the migration feature, see the [manual migration options](migration-alternatives.md).

```azurecli
az rest --method post --uri "${ASE_ID}/migrate?api-version=2021-02-01&phase=validation"
```

If there are no errors, your migration is supported, and you can continue to the next step.

## 3. Generate IP addresses for your new App Service Environment v3

Run the following command to create the new IPs. This step takes about 15 minutes to complete. Don't scale or make changes to your existing App Service Environment during this time.

```azurecli
az rest --method post --uri "${ASE_ID}/migrate?api-version=2021-02-01&phase=premigration"
```

Run the following command to check the status of this step.

```azurecli
az rest --method get --uri "${ASE_ID}?api-version=2021-02-01" --query properties.status
```

If it's in progress, you get a status of "Migrating". Once you get a status of "Ready", run the following command to view your new IPs. If you don't see the new IPs immediately, wait a few minutes and try again.

```azurecli
az rest --method get --uri "${ASE_ID}/configurations/networking?api-version=2021-02-01"
```

## 4. Update dependent resources with new IPs

Using the new IPs, update any of your resources or networking components to ensure your new environment functions as intended once migration is complete. It's your responsibility to make any necessary updates. This step is also a good time to review the [inbound and outbound network](networking.md#ports-and-network-restrictions) dependency changes when moving to App Service Environment v3 including the port change for the Azure Load Balancer, which now uses port 80. Don't migrate until you've completed this step.

## 5. Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Previous versions didn't require this delegation. You need to confirm your subnet is delegated properly and update the delegation if needed before migrating. You can update the delegation either by running the following command or by navigating to the subnet in the [Azure portal](https://portal.azure.com).

```azurecli
az network vnet subnet update --resource-group $VNET_RG --name <subnet-name> --vnet-name <vnet-name> --delegations Microsoft.Web/hostingEnvironments
```

## 6. Confirm there are no locks on the virtual network

Virtual network locks block platform operations during migration. If your virtual network has locks, you need to remove them before migrating. The locks can be readded if needed once migration is complete. Locks can exist at three different scopes: subscription, resource group, and resource. When you apply a lock at a parent scope, all resources within that scope inherit the same lock. If you have locks applied at the subscription, resource group, or resource scope, they need to be removed before the migration. For more information on locks and lock inheritance, see [Lock your resources to protect your infrastructure](../../azure-resource-manager/management/lock-resources.md).

Use the following command to check if your virtual network has any locks.

```azurecli
az lock list --resource-group $VNET_RG --resource <vnet-name> --resource-type Microsoft.Network/virtualNetworks
```

Delete any existing locks using the following command.

```azurecli
az lock delete --resource-group $VNET_RG --name <lock-name> --resource <vnet-name> --resource-type Microsoft.Network/virtualNetworks
```

For related commands to check if your subscription or resource group has locks, see [Azure CLI reference for locks](../../azure-resource-manager/management/lock-resources.md#azure-cli).

## 7. Prepare your configurations

You can make your new App Service Environment v3 zone redundant if your existing environment is in a [region that supports zone redundancy](./overview.md#regions). Zone redundancy can be configured by setting the `zoneRedundant` property to "true". Zone redundancy is an optional configuration. This configuration can only be set during the creation of your new App Service Environment v3 and can't be removed at a later time. For more information, see [Choose your App Service Environment v3 configurations](./migrate.md#choose-your-app-service-environment-v3-configurations). If you don't want to configure zone redundancy, don't include the `zoneRedundant` parameter.

If your existing App Service Environment uses a custom domain suffix, you need to [configure one for your new App Service Environment v3 during the migration process](./migrate.md#choose-your-app-service-environment-v3-configurations). Migration fails if you don't configure a custom domain suffix and are using one currently. Migration also fails if you attempt to add a custom domain suffix during migration to an environment that doesn't have one configured currently. For more information on App Service Environment v3 custom domain suffix including requirements, step-by-step instructions, and best practices, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md).

> [!NOTE]
> If you're configuring a custom domain suffix, when adding the network permissions on your Azure Key Vault, be sure that your key vault allows access from your App Service Environment's new outbound IP addresses that were generated during the IP address generation in step 3.
>

If your migration doesn't include a custom domain suffix and you aren't enabling zone redundancy, you can move on to migration.

In order to set these configurations, create a file called "parameters.json" with the following details based on your scenario. Don't include the custom domain suffix properties if this feature doesn't apply to your migration. Be sure to pay attention to the value of the `zoneRedundant` property as this configuration is irreversible after migration. Ensure the value of the `kind` property is set based on your existing App Service Environment version. Accepted values for the `kind` property are "ASEV1" and  "ASEV2".

If you're migrating without a custom domain suffix and are enabling zone redundancy:

```json
{
    "type": "Microsoft.Web/hostingEnvironments",
    "name": "sample-ase-migration",
    "kind": "ASEV2",
    "location": "westcentralus",
    "properties": {
        "zoneRedundant": true
    }
}
```

If you're using a user assigned managed identity for your custom domain suffix configuration and **are enabling zone redundancy**:

```json
{
    "type": "Microsoft.Web/hostingEnvironments",
    "name": "sample-ase-migration",
    "kind": "ASEV2",
    "location": "westcentralus",
    "properties": {
        "zoneRedundant": true,
        "customDnsSuffixConfiguration": {
            "dnsSuffix": "internal-contoso.com",
            "certificateUrl": "https://contoso.vault.azure.net/secrets/myCertificate",
            "keyVaultReferenceIdentity": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/asev3-migration/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ase-managed-identity"
        }
    }
}
```

If you're using a system assigned managed identity for your custom domain suffix configuration and **aren't enabling zone redundancy**:

```json
{
    "type": "Microsoft.Web/hostingEnvironments",
    "name": "sample-ase-migration",
    "kind": "ASEV2",
    "location": "westcentralus",
    "properties": {
        "customDnsSuffixConfiguration": {
            "dnsSuffix": "internal-contoso.com",
            "certificateUrl": "https://contoso.vault.azure.net/secrets/myCertificate",
            "keyVaultReferenceIdentity": "SystemAssigned"
        }
    }
}
```

## 8. Migrate to App Service Environment v3

Only start this step once you've completed all premigration actions listed previously and understand the [implications of migration](migrate.md#migrate-to-app-service-environment-v3) including what happens during this time. This step takes three to six hours for v2 to v3 migrations and up to six hours for v1 to v3 migrations depending on environment size. During that time, there's about one hour of application downtime. Scaling, deployments, and modifications to your existing App Service Environment are blocked during this step.

Only include the "body" parameter in the command if you're enabling zone redundancy and/or are configuring a custom domain suffix. If neither of those configurations apply to your migration, you can remove the parameter from the command.

```azurecli
az rest --method post --uri "${ASE_ID}/migrate?api-version=2021-02-01&phase=fullmigration" --body @parameters.json
```

Run the following command to check the status of your migration. The status shows as "Migrating" while in progress.

```azurecli
az rest --method get --uri "${ASE_ID}?api-version=2021-02-01" --query properties.status
```

Once you get a status of "Ready", migration is done, and you have an App Service Environment v3. Your apps are now running in your new environment.

Get the details of your new environment by running the following command or by navigating to the [Azure portal](https://portal.azure.com).

```azurecli
az appservice ase show --name $ASE_NAME --resource-group $ASE_RG
```

::: zone-end

::: zone pivot="experience-azp"

## 1. Validate migration is supported

From the [Azure portal](https://portal.azure.com), navigate to the **Migration** page for the App Service Environment you're migrating. You can get to the migration page by clicking on the banner at the top of the **Overview** page for your App Service Environment or by clicking the **Migration** item on the left-hand side.

:::image type="content" source="./media/migration/portal-overview.png" alt-text="Migration access points.":::

On the migration page, the platform validates if migration is supported for your App Service Environment. Select "Validate" and then confirm that you want to proceed with the validation. The validation process takes a few seconds to complete.

:::image type="content" source="./media/migration/migration-validation.png" alt-text="Screenshot that shows how to validate migration eligibility.":::

If your environment isn't supported for migration, a banner appears at the top of the page and includes an error message with a reason. See the [troubleshooting](migrate.md#troubleshooting) section for descriptions of the error messages you may see if you aren't eligible for migration. If your App Service Environment isn't supported for migration at this time or your environment is in an unhealthy or suspended state, you can't use the migration feature. If your environment [isn't supported for migration with the migration feature](migrate.md#supported-scenarios) or you want to migrate to App Service Environment v3 without using the migration feature, see the [manual migration options](migration-alternatives.md).

:::image type="content" source="./media/migration/migration-not-supported.png" alt-text="Screenshot that shows what the portal looks like when migration isn't supported.":::

If migration is supported for your App Service Environment, you'll be able to proceed to the next step in the process. The migration page guides you through the series of steps to complete the migration.

:::image type="content" source="./media/migration/migration-ux-pre.png" alt-text="Screenshot that shows a sample migration page.":::

## 2. Generate IP addresses for your new App Service Environment v3

Under **Get new IP addresses**, confirm you understand the implications and start the process. This step takes about 15 minutes to complete. You can't scale or make changes to your existing App Service Environment during this time.

## 3. Update dependent resources with new IPs

When the previous step finishes, you're shown the IP addresses for your new App Service Environment v3. Using the new IPs, update any resources and networking components to ensure your new environment functions as intended once migration is complete. It's your responsibility to make any necessary updates. This step is also a good time to review the [inbound and outbound network](networking.md#ports-and-network-restrictions) dependency changes when moving to App Service Environment v3 including the port change for the Azure Load Balancer, which now uses port 80. Don't move on to the next step until you confirm that you have made these updates.

:::image type="content" source="./media/migration/ip-sample.png" alt-text="Screenshot that shows sample IPs generated during premigration.":::

## 4. Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Previous versions didn't require this delegation. You need to confirm your subnet is delegated properly and/or update the delegation if needed before migrating. A link to your subnet is given so that you can confirm and update as needed.

:::image type="content" source="./media/migration/subnet-delegation-ux.png" alt-text="Screenshot that shows subnet delegation using the portal.":::

## 5. Acknowledge instance size changes

Your App Service plans are converted from Isolated to the corresponding Isolated v2 SKU. For example, I2 is converted to I2v2. Your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You have the opportunity to scale your environment as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).

:::image type="content" source="./media/migration/ack-instance-size.png" alt-text="Screenshot that shows acknowledging the instance size changes when migratingZ.":::

## 6. Confirm there are no locks on the virtual network

Virtual network locks block platform operations during migration. If your virtual network has locks, you need to remove them before migrating. The locks can be readded if needed once migration is complete. Locks can exist at three different scopes: subscription, resource group, and resource. When you apply a lock at a parent scope, all resources within that scope inherit the same lock. If you have locks applied at the subscription, resource group, or resource scope, they need to be removed before the migration. For more information on locks and lock inheritance, see [Lock your resources to protect your infrastructure](../../azure-resource-manager/management/lock-resources.md).

For details on how to check if your subscription or resource group has locks, see [Configure locks](../../azure-resource-manager/management/lock-resources.md#configure-locks).

:::image type="content" source="./media/migration/vnet-locks.png" alt-text="Screenshot that shows where to find and remove virtual network locks.":::

## 7. Choose your configurations

You can make your new App Service Environment v3 zone redundant if your existing environment is in a [region that supports zone redundancy](./overview.md#regions). Zone redundancy is an optional configuration. This configuration can only be set during the creation of your new App Service Environment v3 and can't be removed at a later time. For more information, see [Choose your App Service Environment v3 configurations](./migrate.md#choose-your-app-service-environment-v3-configurations). Select **Enabled** if you'd like to configure zone redundancy.

:::image type="content" source="./media/migration/zone-redundancy-supported.png" alt-text="Screenshot that shows how to enable zone redundancy for App Service Environment in a supported region.":::

If your environment is in a region that doesn't support zone redundancy, the checkbox is disabled. If you need a zone redundant App Service Environment v3, use one of the manual migration options and create your new App Service Environment v3 in one of the regions that supports zone redundancy.

If your existing App Service Environment uses a [custom domain suffix](./migrate.md#choose-your-app-service-environment-v3-configurations), you're required to configure one for your new App Service Environment v3. You're shown the custom domain suffix configuration options if this situation applies to you. You can't migrate until you provide the required information. If you'd like to use a custom domain suffix but don't currently have one configured, you can configure one once migration is complete. For more information on App Service Environment v3 custom domain suffix including requirements, step-by-step instructions, and best practices, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md).

> [!NOTE]
> If you're configuring a custom domain suffix, when adding the network permissions on your Azure Key Vault, be sure that your key vault allows access from your App Service Environment's new outbound IP addresses that were generated during the IP address generation in step 2.
>

:::image type="content" source="./media/migration/input-custom-domain-suffix.png" alt-text="Screenshot that shows how to add a custom domain suffix configuration.":::

After you add your custom domain suffix details, the "Migrate" button will be enabled.

:::image type="content" source="./media/migration/custom-domain-suffix.png" alt-text="Screenshot that shows the configuration details have been added and environment is ready for migration.":::

## 8. Migrate to App Service Environment v3

Once you've completed all of the above steps, you can start migration. Make sure you understand the [implications of migration](migrate.md#migrate-to-app-service-environment-v3) including what happens during this time. This step takes three to six hours for v2 to v3 migrations and up to six hours for v1 to v3 migrations depending on environment size. Scaling and modifications to your existing App Service Environment are blocked during this step.

When migration is complete, you have an App Service Environment v3, and all of your apps are running in your new environment. You can confirm the environment's version by checking the **Configuration** page for your App Service Environment.

If your migration included a custom domain suffix, the domain was shown in the **Essentials** section of the **Overview** page of the portal for App Service Environment v1/v2, but it's no longer shown there in App Service Environment v3. Instead, for App Service Environment v3, go to the **Custom domain suffix** page where you can confirm your custom domain suffix is configured correctly. You can also remove the configuration if you no longer need it or configure one if you didn't have one previously.

:::image type="content" source="./media/migration/custom-domain-suffix-app-service-environment-v3.png" alt-text="Screenshot that shows how to access custom domain suffix configuration for App Service Environment v3.":::

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Custom domain suffix](./how-to-custom-domain-suffix.md)
