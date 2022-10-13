---
title: Use the migration feature to migrate your App Service Environment to App Service Environment v3
description: Learn how to migrate your App Service Environment to App Service Environment v3 using the migration feature
author: seligj95
ms.topic: tutorial
ms.date: 9/15/2022
ms.author: jordanselig
zone_pivot_groups: app-service-cli-portal
---
# Use the migration feature to migrate App Service Environment v1 and v2 to App Service Environment v3

An App Service Environment v1 and v2 can be automatically migrated to an [App Service Environment v3](overview.md) using the migration feature. To learn more about the migration process and to see if your App Service Environment supports migration at this time, see the [Migration to App Service Environment v3 Overview](migrate.md).

> [!IMPORTANT]
> It is recommended to use this feature for dev environments first before migrating any production environments to ensure there are no unexpected issues. Please provide any feedback related to this article or the feature using the buttons at the bottom of the page.
>

## Prerequisites

Ensure you understand how migrating to an App Service Environment v3 will affect your applications. Review the [migration process](migrate.md#overview-of-the-migration-process-using-the-migration-feature) to understand the process timeline and where and when you'll need to get involved. Also review the [FAQs](migrate.md#frequently-asked-questions), which may answer some questions you currently have.

::: zone pivot="experience-azcli"

The recommended experience for the migration feature is using the [Azure portal](how-to-migrate.md?pivots=experience-azp). If you decide to use the Azure CLI to carry out the migration, you should follow the steps described here in order and as written since you'll be making Azure REST API calls. The recommended way for making these API calls is by using the [Azure CLI](/cli/azure/). For information about other methods, see [Getting Started with Azure REST](/rest/api/azure/).

For this guide, [install the Azure CLI](/cli/azure/install-azure-cli) or use the [Azure Cloud Shell](https://shell.azure.com/).

## 1. Get your App Service Environment ID

Run these commands to get your App Service Environment ID and store it as an environment variable. Replace the placeholders for name and resource groups with your values for the App Service Environment you want to migrate. "ASE_RG" and "VNET_RG" will be the same if your virtual network and App Service Environment are in the same resource group.

```azurecli
ASE_NAME=<Your-App-Service-Environment-name>
ASE_RG=<Your-ASE-Resource-Group>
VNET_RG=<Your-VNet-Resource-Group>
ASE_ID=$(az appservice ase show --name $ASE_NAME --resource-group $ASE_RG --query id --output tsv)
```

## 2. Validate migration is supported

The following command will check whether your App Service Environment is supported for migration. If you receive an error or if your App Service Environment is in an unhealthy or suspended state, you can't migrate at this time. See the [troubleshooting](migrate.md#troubleshooting) section for descriptions of the potential error messages you may get. If your environment [won't be supported for migration](migrate.md#supported-scenarios) or you want to migrate to App Service Environment v3 without using the migration feature, see the [manual migration options](migration-alternatives.md).

```azurecli
az rest --method post --uri "${ASE_ID}/migrate?api-version=2021-02-01&phase=validation"
```

If there are no errors, your migration is supported, and you can continue to the next step.

## 3. Generate IP addresses for your new App Service Environment v3

Run the following command to create the new IPs. This step will take about 15 minutes to complete. Don't scale or make changes to your existing App Service Environment during this time.

```azurecli
az rest --method post --uri "${ASE_ID}/migrate?api-version=2021-02-01&phase=premigration"
```

Run the following command to check the status of this step.

```azurecli
az rest --method get --uri "${ASE_ID}?api-version=2021-02-01" --query properties.status
```

If it's in progress, you'll get a status of "Migrating". Once you get a status of "Ready", run the following command to view your new IPs. If you don't see the new IPs immediately, wait a few minutes and try again.

```azurecli
az rest --method get --uri "${ASE_ID}/configurations/networking?api-version=2021-02-01"
```

## 4. Update dependent resources with new IPs

Using the new IPs, update any of your resources or networking components to ensure your new environment functions as intended once migration is complete. It's your responsibility to make any necessary updates. Don't migrate until you've completed this step.

## 5. Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Previous versions didn't require this delegation. You'll need to confirm your subnet is delegated properly and update the delegation if needed before migrating. You can update the delegation either by running the following command or by navigating to the subnet in the [Azure portal](https://portal.azure.com).

```azurecli
az network vnet subnet update --resource-group $VNET_RG -name <subnet-name> --vnet-name <vnet-name> --delegations Microsoft.Web/hostingEnvironments
```

## 6. Prepare your configurations

You can make your new App Service Environment v3 zone redundant if your existing environment is in a [region that supports zone redundancy](./overview.md#regions). This can be done by setting the `zoneRedundant` property to "true". Zone redundancy is an optional configuration. This configuration can only be set during the creation of your new App Service Environment v3 and can't be removed at a later time. For more information, see [Choose your App Service Environment v3 configurations](./migrate.md#choose-your-app-service-environment-v3-configurations). If you don't want to configure zone redundancy, don't include the `zoneRedundant` parameter.

If your existing App Service Environment uses a custom domain suffix, you'll need to [configure one for your new App Service Environment v3 during the migration process](./migrate.md#choose-your-app-service-environment-v3-configurations). Migration will fail if you don't configure a custom domain suffix and are using one currently. Migration will also fail if you attempt to add a custom domain suffix during migration to an environment that doesn't have one configured currently. For more information on App Service Environment v3 custom domain suffix including requirements, step-by-step instructions, and best practices, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md).

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

## 7. Migrate to App Service Environment v3

Only start this step once you've completed all pre-migration actions listed previously and understand the [implications of migration](migrate.md#migrate-to-app-service-environment-v3) including what will happen during this time. This step takes up to three hours for v2 to v3 migrations and up to six hours for v1 to v3 migrations depending on environment size. During that time, there will be about one hour of application downtime. Scaling, deployments, and modifications to your existing App Service Environment will be blocked during this step. 

Only include the "body" parameter in the command if you're enabling zone redundancy and/or are configuring a custom domain suffix. If neither of those configurations apply to your migration, you can remove the parameter from the command.

```azurecli
az rest --method post --uri "${ASE_ID}/migrate?api-version=2021-02-01&phase=fullmigration" --body @parameters.json
```

Run the following command to check the status of your migration. The status will show as "Migrating" while in progress.

```azurecli
az rest --method get --uri "${ASE_ID}?api-version=2021-02-01" --query properties.status
```

Once you get a status of "Ready", migration is done, and you have an App Service Environment v3. Your apps will now be running in your new environment.

Get the details of your new environment by running the following command or by navigating to the [Azure portal](https://portal.azure.com).

```azurecli
az appservice ase show --name $ASE_NAME --resource-group $ASE_RG
```

::: zone-end

::: zone pivot="experience-azp"

## 1. Validate migration is supported

From the [Azure portal](https://portal.azure.com), navigate to the **Migration** page for the App Service Environment you'll be migrating. You can do this by clicking on the banner at the top of the **Overview** page for your App Service Environment or by clicking the **Migration** item on the left-hand side.

:::image type="content" source="./media/migration/portal-overview.png" alt-text="Migration access points.":::

On the migration page, the platform will validate if migration is supported for your App Service Environment. If your environment isn't supported for migration, a banner will appear at the top of the page and include an error message with a reason. See the [troubleshooting](migrate.md#troubleshooting) section for descriptions of the error messages you may see if you aren't eligible for migration. If your App Service Environment isn't supported for migration at this time or your environment is in an unhealthy or suspended state, you won't be able to use the migration feature. If your environment [won't be supported for migration with the migration feature](migrate.md#supported-scenarios) or you want to migrate to App Service Environment v3 without using the migration feature, see the [manual migration options](migration-alternatives.md).

:::image type="content" source="./media/migration/migration-not-supported.png" alt-text="Migration not supported sample.":::

If migration is supported for your App Service Environment, you'll be able to proceed to the next step in the process. The migration page will guide you through the series of steps to complete the migration.

:::image type="content" source="./media/migration/migration-ux-pre.png" alt-text="Migration page sample.":::

## 2. Generate IP addresses for your new App Service Environment v3

Under **Get new IP addresses**, confirm you understand the implications and start the process. This step will take about 15 minutes to complete. You won't be able to scale or make changes to your existing App Service Environment during this time.

## 3. Update dependent resources with new IPs

When the previous step finishes, you'll be shown the IP addresses for your new App Service Environment v3. Using the new IPs, update any resources and networking components to ensure your new environment functions as intended once migration is complete. It's your responsibility to make any necessary updates. Don't move on to the next step until you confirm that you have made these updates.

:::image type="content" source="./media/migration/ip-sample.png" alt-text="Sample IPs generated during pre-migration.":::

## 4. Delegate your App Service Environment subnet

App Service Environment v3 requires the subnet it's in to have a single delegation of `Microsoft.Web/hostingEnvironments`. Previous versions didn't require this delegation. You'll need to confirm your subnet is delegated properly and/or update the delegation if needed before migrating. A link to your subnet is given so that you can confirm and update as needed.

:::image type="content" source="./media/migration/subnet-delegation-ux.png" alt-text="Subnet delegation using the portal.":::

## 5. Choose your configurations

You can make your new App Service Environment v3 zone redundant if your existing environment is in a [region that supports zone redundancy](./overview.md#regions). Zone redundancy is an optional configuration. This configuration can only be set during the creation of your new App Service Environment v3 and can't be removed at a later time. For more information, see [Choose your App Service Environment v3 configurations](./migrate.md#choose-your-app-service-environment-v3-configurations). Select **Enabled** if you'd like to configure zone redundancy.

:::image type="content" source="./media/migration/zone-redundancy-supported.png" alt-text="Screenshot that shows how to enable zone redundancy for App Service Environment in a supported region.":::

If your environment is in a region that doesn't support zone redundancy, the checkbox will be disabled. If you need a zone redundant App Service Environment v3, use one of the manual migration options and create your new App Service Environment v3 in one of the regions that supports zone redundancy.

If your existing App Service Environment uses a [custom domain suffix](./migrate.md#choose-your-app-service-environment-v3-configurations), you'll be required to configure one for your new App Service Environment v3. You'll be shown the custom domain suffix configuration options if this situation applies to you. You won't be able to migrate until you provide the required information. If you'd like to use a custom domain suffix but don't currently have one configured, you can configure one once migration is complete. For more information on App Service Environment v3 custom domain suffix including requirements, step-by-step instructions, and best practices, see [Configure custom domain suffix for App Service Environment](./how-to-custom-domain-suffix.md).

:::image type="content" source="./media/migration/input-custom-domain-suffix.png" alt-text="Screenshot that shows how to add a custom domain suffix configuration.":::

After you add your custom domain suffix details, the "Migrate" button will be enabled.

:::image type="content" source="./media/migration/custom-domain-suffix.png" alt-text="Screenshot that shows the configuration details have been added and environment is ready for migration.":::

## 6. Migrate to App Service Environment v3

Once you've completed all of the above steps, you can start migration. Make sure you understand the [implications of migration](migrate.md#migrate-to-app-service-environment-v3) including what will happen during this time. This step takes up to three hours for v2 to v3 migrations and up to six hours for v1 to v3 migrations depending on environment size. Scaling and modifications to your existing App Service Environment will be blocked during this step.

When migration is complete, you'll have an App Service Environment v3, and all of your apps will be running in your new environment. You can confirm the environment's version by checking the **Configuration** page for your App Service Environment.

If your migration included a custom domain suffix, for App Service Environment v3, the custom domain will no longer be shown in the **Essentials** section of the **Overview** page of the portal as it is for App Service Environment v1/v2. Instead, for App Service Environment v3, go to the **Custom domain suffix** page where you can confirm your custom domain suffix is configured correctly. You can also remove the configuration if you no longer need it or configure one if you didn't have one previously. 

:::image type="content" source="./media/migration/custom-domain-suffix-app-service-environment-v3.png" alt-text="Screenshot that shows how to access custom domain suffix configuration for App Service Environment v3.":::

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Custom domain suffix](./how-to-custom-domain-suffix.md)