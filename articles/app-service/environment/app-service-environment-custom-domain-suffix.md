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

If you do not have an App Service Environment, see [How to Create an App Service Environment v3](./creation.md).

> [!NOTE]
> This article covers the features, benefits, and use cases of App Service Environment v3, which is used with App Service Isolated v2 plans.
> 

The custom domain suffix defines a root domain that can be used by the App Service Environment. In the public variation of Azure App Service, the default root domain for all web apps is *azurewebsites.NET*. For ILB App Service Environments, the default root domain is *appserviceenvironment.NET*. However, since an ILB App Service Environment is internal to a customer's virtual network, customers have the option to use a root domain in addition to the default one that makes sense for use within a company's internal virtual network. For example, a hypothetical Contoso Corporation might use a default root domain of *internal-contoso.com* for apps that are intended to only be resolvable and accessible within Contoso's virtual network. An app in this virtual network could be reached by accessing *<appname>.internal-contoso.com*.

The custom domain name works for app requests but doesn't for the scm site. The scm site is only available at *<appname>.scm.<asename>.appserviceenvironment.NET*.

The custom domain suffix is for the App Service Environment. This is different from a custom domain binding on an App Service. See [Map an existing custom DNS name to Azure App Service](../app-service-web-tutorial-custom-domain.md) for more information on that feature.

## Prerequisites

- Custom domain suffix is only a feature for the internal VIP variation of App Service Environment v3.
- If you don't have a custom domain, you can [purchase an App Service domain](../manage-custom-dns-buy-domain.md).
- Valid SSL/TLS certificate stored in an Azure Key Vault. For more information on using certificates with App Service, see [Add a TLS/SSL certificate in Azure App Service](../configure-ssl-certificate).

### Managed identity

A [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) is used to authenticate against the Azure Key Vault where the SSL/TLS certificate is stored. If you don't currently have a managed identity associated with your App Service Environment, you'll need to configure one. 

You can use either a system assigned or user assigned managed identity. Ensure the managed identity has sufficient permissions for both the App Service Environment as well as the Azure Key Vault. To create a user assigned managed identity, see [manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). If you'd like to use a system assigned managed identity and don't already have one assigned, the Custom domain suffix portal experience will guide you through that process. 

<!-- what are the minimum permissions -->

Also ensure the managed identity has the appropriate access policy set for the Azure Key Vault. At a minimum, the managed identity will need all "Get" permissions on the key vault.

:::image type="content" source="./media/custom-domain-suffix/key-vault-access-policy.png" alt-text="Sample key vault access policy for managed identity.":::

### Certificate

The certificate for custom domain suffix must be stored in an Azure Key Vault. App Service Environment will use the managed identity you selected to get the certificate. The Key Vault must be publicly accessible.

:::image type="content" source="./media/custom-domain-suffix/key-vault-networking.png" alt-text="Sample networking blade for key vault to allow custom domain suffix feature.":::

Your certificate must be a wildcard certificate for the selected custom domain name. For example, *contoso.com* would need a certificate covering **.contoso.com*.

::: zone pivot="experience-azp"

## Use the Azure portal to configure custom domain suffix

1. From the [Azure portal](https://portal.azure.com), navigate to the **Custom domain suffix** page for your App Service Environment.
1. Enter your custom domain name.
1. Select the managed identity you've defined for your App Service Environment. You can use either a system assigned or user defined managed identity. You will be able to configure your managed identity if you have not done so already directly from the custom domain suffix page using the "Add identity" option in the managed identity selection box.
:::image type="content" source="./media/custom-domain-suffix/managed-identity-selection.png" alt-text="Configuration pane to select and update the managed identity for the App Service Environment.":::
1. Select the certificate for the custom domain suffix.
1. Select "Save" at the top of the page.

:::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-portal-experience.png" alt-text="Overview of the custom domain suffix portal experience.":::

::: zone-end

::: zone pivot="experience-arm"

## Use Azure Resource Manager to configure custom domain suffix

<!-- INPUT -->

Alternatively, you can update the App Service Environment by using [Azure Resource Explorer](https://resources.azure.com).

```json
"resources": [
{
    "apiVersion": "2022-03-01",
    "type": "Microsoft.Web/hostingEnvironments",
    "name": ...,
    "location": ...,
    "properties": {
        "customDnsSuffixConfiguration": {
            "dnsSuffix": "antares-test.net",
            "certificateUrl": "https://kv-jordan-acmebot-mwol.vault.azure.net/secrets/wildcard-antares-test-net",
            "keyVaultReferenceIdentity": "/subscriptions/7e574780-0f87-42e8-af8c-5e8cb7d3540a/resourcegroups/jordan-asev3-cdns/providers/microsoft.managedidentity/userassignedidentities/jordan-ase-cdns-managed-identity"
        },
        "identity": {
            "type": "UserAssigned",
            "userAssignedIdentities": {
                "/subscriptions/7e574780-0f87-42e8-af8c-5e8cb7d3540a/resourcegroups/jordan-asev3-cdns/providers/Microsoft.ManagedIdentity/userAssignedIdentities/jordan-ase-cdns-managed-identity": {
                    "principalId": "a80055fe-785e-4c1e-b525-6e1b1bb1f4ad",
                    "clientId": "4182d459-876a-456e-8627-f48b0ce75b46"
                }
            }
        },
        "internalLoadBalancingMode": "Web, Publishing",
        etc...
    }
}
```

::: zone-end

## Access your Apps

After configuring the custom domain suffix for your App Service Environment, you can go to the **Custom domains** page for one of your App Service apps in your App Service Environment and confirm the addition of the assigned custom domain for the app. Apps on the ILB App Service Environment can be accessed over HTTPS and the connections will be secured using the default certificate you selected. The certificate will be used when apps on the App Service Environment are addressed using a combination of the application name plus the custom domain suffix. For example, *https://mycustomapp.internal-contoso.com* would use the TLS/SSL certificate for **.internal-contoso.com*.

However, just like apps running on the public multi-tenant service, you can also configure custom host names for individual apps, and then configure unique SNI TLS/SSL certificate bindings for individual apps.

:::image type="content" source="./media/custom-domain-suffix/app-custom-domain-sample.png" alt-text="Sample custom domain for an app created by App Service Environment custom domain suffix feature.":::

## Troubleshooting

<!-- INPUT -->

:::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-error.png" alt-text="Sample custom domain suffix error message.":::

## Next steps

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Tutorial: Map an existing custom DNS name to Azure App Service](../app-service-web-tutorial-custom-domain.md)