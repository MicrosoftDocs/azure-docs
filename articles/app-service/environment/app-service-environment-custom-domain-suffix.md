---
title: Configure custom domain suffix for App Service Environment
description: Configure a custom domain suffix for the Azure App Service Environment.
author: seligj95
ms.topic: tutorial
ms.date: 06/16/2022
ms.author: jordanselig
zone_pivot_groups: app-service-environment-portal-arm
---

# Custom domain suffix for App Service Environments

## Overview

An App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps securely at high scale. The DNS settings for your App Service Environment's default domain suffix don't restrict your apps to only being accessible by those names. Custom domain suffix is an internal load balancer (ILB) App Service Environment feature that allows you to use your own domain suffix to access the apps in your App Service Environment.

If you don't have an App Service Environment, see [How to Create an App Service Environment v3](./creation.md).

> [!NOTE]
> This article covers the features, benefits, and use cases of App Service Environment v3, which is used with App Service Isolated v2 plans.
> 

The custom domain suffix defines a root domain that can be used by the App Service Environment. In the public variation of Azure App Service, the default root domain for all web apps is *azurewebsites.net*. For ILB App Service Environments, the default root domain is *appserviceenvironment.net*. However, since an ILB App Service Environment is internal to a customer's virtual network, customers can use a root domain in addition to the default one that makes sense for use within a company's internal virtual network. For example, a hypothetical Contoso Corporation might use a default root domain of *internal-contoso.com* for apps that are intended to only be resolvable and accessible within Contoso's virtual network. An app in this virtual network could be reached by accessing *<appname>.internal-contoso.com*.

The custom domain name works for app requests but doesn't for the scm site. The scm site is only available at *<appname>.scm.<asename>.appserviceenvironment.net*.

The custom domain suffix is for the App Service Environment. This feature is different from a custom domain binding on an App Service. For more information on custom domain bindings, see [Map an existing custom DNS name to Azure App Service](../app-service-web-tutorial-custom-domain.md).

## Prerequisites

- Custom domain suffix is only a feature for the ILB variation of App Service Environment v3.
- If you don't have a custom domain, you can [purchase an App Service domain](../manage-custom-dns-buy-domain.md).
- Valid SSL/TLS certificate must be stored in an Azure Key Vault. For more information on using certificates with App Service, see [Add a TLS/SSL certificate in Azure App Service](../configure-ssl-certificate).

### Managed identity

A [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) is used to authenticate against the Azure Key Vault where the SSL/TLS certificate is stored. If you don't currently have a managed identity associated with your App Service Environment, you'll need to configure one. 

You can use either a system assigned or user assigned managed identity. Ensure the managed identity has sufficient permissions for both the App Service Environment and the Azure Key Vault. To create a user assigned managed identity, see [manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). If you'd like to use a system assigned managed identity and don't already have one assigned, the Custom domain suffix portal experience will guide you through the creation process. 

<!-- what are the minimum permissions -->

Ensure the managed identity also has the appropriate access policy set for the Azure Key Vault. At a minimum, the managed identity will need all "Get" permissions on the key vault.

:::image type="content" source="./media/custom-domain-suffix/key-vault-access-policy.png" alt-text="Sample key vault access policy for managed identity.":::

### Certificate

The certificate for custom domain suffix must be stored in an Azure Key Vault. App Service Environment will use the managed identity you selected to get the certificate. The Key Vault must be publicly accessible.

:::image type="content" source="./media/custom-domain-suffix/key-vault-networking.png" alt-text="Sample networking page for key vault to allow custom domain suffix feature.":::

Your certificate must be a wildcard certificate for the selected custom domain name. For example, *contoso.com* would need a certificate covering **.contoso.com*.

::: zone pivot="experience-azp"

## Use the Azure portal to configure custom domain suffix

1. From the [Azure portal](https://portal.azure.com), navigate to the **Custom domain suffix** page for your App Service Environment.
1. Enter your custom domain name.
1. Select the managed identity you've defined for your App Service Environment. You can use either a system assigned or user assigned managed identity. You'll be able to configure your managed identity if you haven't done so already directly from the custom domain suffix page using the "Add identity" option in the managed identity selection box.
:::image type="content" source="./media/custom-domain-suffix/managed-identity-selection.png" alt-text="Configuration pane to select and update the managed identity for the App Service Environment.":::
1. Select the certificate for the custom domain suffix.
1. Select "Save" at the top of the page.

:::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-portal-experience.png" alt-text="Overview of the custom domain suffix portal experience.":::

::: zone-end

::: zone pivot="experience-arm"

## Use Azure Resource Manager to configure custom domain suffix

To configure a custom domain suffix for your App Service Environment using an Azure Resource Manager template, you'll need to include the below properties. Ensure that you've met the [prerequisites](#prerequisites) and that your managed identity and certificate are accessible and have the appropriate permissions for both the Azure Key Vault and the App Service Environment.

You'll need to configure the managed identity and ensure it exists before assigning it in your template. For more information on managed identities, see the [managed identity overview](../../active-directory/managed-identities-azure-resources/overview.md).

### Use a user assigned managed identity

```json
"resources": [
{
    "apiVersion": "2022-03-01",
    "type": "Microsoft.Web/hostingEnvironments",
    "name": ...,
    "location": ...,
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/asev3-cdns-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ase-cdns-managed-identity": {
                "principalId": "00000000-0000-0000-0000-000000000000",
                "clientId": "00000000-0000-0000-0000-000000000000"
            }
        }
    },
    "properties": {
        "customDnsSuffixConfiguration": {
            "dnsSuffix": "antares-test.net",
            "certificateUrl": "https://kv-sample-key-vault.vault.azure.net/secrets/wildcard-antares-test-net",
            "keyVaultReferenceIdentity": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/asev3-cdns-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ase-cdns-managed-identity"
        },
        "internalLoadBalancingMode": "Web, Publishing",
        etc...
    }
}
```

### Use a system assigned managed identity

```json
"resources": [
{
    "apiVersion": "2022-03-01",
    "type": "Microsoft.Web/hostingEnvironments",
    "name": ...,
    "location": ...,
    "identity": {
        "type": "SystemAssigned",
        "tenantId": "00000000-0000-0000-0000-000000000000",
        "principalId": "00000000-0000-0000-0000-000000000000"
    }
    "properties": {
        "customDnsSuffixConfiguration": {
            "dnsSuffix": "antares-test.net",
            "certificateUrl": "https://kv-sample-key-vault.vault.azure.net/secrets/wildcard-antares-test-net",
            "keyVaultReferenceIdentity": "systemassigned"
        },
        "internalLoadBalancingMode": "Web, Publishing",
        etc...
    }
}
```

## Use Azure Resource Explorer to configure custom domain suffix

Alternatively, you can update your existing ILB App Service Environment using [Azure Resource Explorer](https://resources.azure.com).

1. In Resource Explorer, go to the node for the App Service Environment (**subscriptions** > **{your Subscription}** > **resourceGroups** > **{your Resource Group}** > **providers** > **Microsoft.Web** > **hostingEnvironments**). Then select the specific App Service Environment that you want to update.
2. Select **Read/Write** in the upper toolbar to allow interactive editing in Resource Explorer.  
3. Select the **Edit** button to make the Resource Manager template editable.
4. Scroll to the bottom of the right pane. The **customDnsSuffixConfiguration** attribute is at the bottom.
5. Enter your values for **dnsSuffix**, **certificateUrl**, and **keyVaultReferenceIdentity**.
1. Navigate to the **identity** attribute and enter the details associated with the managed identity you're using.
1. Select the **PUT** button that's located at the top to commit the change to the App Service Environment.
1. The **provisioningState** under **customDnsSuffixConfiguration** will provide a status on the configuration update. 

::: zone-end

## Access your Apps

After configuring the custom domain suffix for your App Service Environment, you can go to the **Custom domains** page for one of your App Service apps in your App Service Environment and confirm the addition of the assigned custom domain for the app. 

:::image type="content" source="./media/custom-domain-suffix/app-custom-domain-sample.png" alt-text="Sample custom domain for an app created by App Service Environment custom domain suffix feature.":::

Apps on the ILB App Service Environment can be accessed over HTTPS and the connections will be secured using the default certificate you selected. The certificate will be used when apps on the App Service Environment are addressed using a combination of the application name plus the custom domain suffix. For example, *https://mycustomapp.internal-contoso.com* would use the TLS/SSL certificate for **.internal-contoso.com*.

However, just like apps running on the public multi-tenant service, you can also configure custom host names for individual apps, and then configure unique SNI TLS/SSL certificate bindings for individual apps.

## Troubleshooting

If your permissions or network settings for your managed identity, key vault, or App Service Environment aren't set appropriately, you won't be able to configure a custom domain suffix and you'll receive an error similar to the example below. Review the [prerequisites](#prerequisites) to ensure you've set the needed permissions.

:::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-error.png" alt-text="Sample custom domain suffix error message.":::

## Next steps

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Tutorial: Map an existing custom DNS name to Azure App Service](../app-service-web-tutorial-custom-domain.md)