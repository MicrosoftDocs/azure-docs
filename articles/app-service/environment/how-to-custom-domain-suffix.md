---
title: Configure custom domain suffix for App Service Environment
description: Configure a custom domain suffix for the Azure App Service Environment.
author: seligj95
ms.topic: tutorial
ms.custom: devx-track-arm-template
ms.date: 05/03/2023
ms.author: jordanselig
zone_pivot_groups: app-service-environment-portal-arm
---

# Custom domain suffix for App Service Environments

An App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps securely at high scale. The DNS settings for your App Service Environment's default domain suffix don't restrict your apps to only being accessible by those names. Custom domain suffix is an internal load balancer (ILB) App Service Environment feature that allows you to use your own domain suffix to access the apps in your App Service Environment.

If you don't have an App Service Environment, see [How to Create an App Service Environment v3](./creation.md).

> [!NOTE]
> This article covers the features, benefits, and use cases of App Service Environment v3, which is used with App Service Isolated v2 plans.
> 

The custom domain suffix defines a root domain that can be used by the App Service Environment. In the public variation of Azure App Service, the default root domain for all web apps is *azurewebsites.net*. For ILB App Service Environments, the default root domain is *appserviceenvironment.net*. However, since an ILB App Service Environment is internal to a customer's virtual network, customers can use a root domain in addition to the default one that makes sense for use within a company's internal virtual network. For example, a hypothetical Contoso Corporation might use a default root domain of *internal-contoso.com* for apps that are intended to only be resolvable and accessible within Contoso's virtual network. An app in this virtual network could be reached by accessing *APP-NAME.internal-contoso.com*.

The custom domain suffix is for the App Service Environment. This feature is different from a custom domain binding on an App Service. For more information on custom domain bindings, see [Map an existing custom DNS name to Azure App Service](../app-service-web-tutorial-custom-domain.md).

If the certificate used for the custom domain suffix contains a Subject Alternate Name (SAN) entry for **.scm.CUSTOM-DOMAIN*, the scm site will then also be reachable from *APP-NAME.scm.CUSTOM-DOMAIN*. You can only access scm over custom domain using basic authentication. Single sign-on is only possible with the default root domain. 

Unlike earlier versions, the FTPS endpoints for your App Services on your App Service Environment v3 can only be reached using the default domain suffix.

## Prerequisites

- ILB variation of App Service Environment v3.
- Valid SSL/TLS certificate must be stored in an Azure Key Vault in .PFX format. For more information on using certificates with App Service, see [Add a TLS/SSL certificate in Azure App Service](../configure-ssl-certificate.md).

### Managed identity

A [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) is used to authenticate against the Azure Key Vault where the SSL/TLS certificate is stored. If you don't currently have a managed identity associated with your App Service Environment, you'll need to configure one. 

You can use either a system assigned or user assigned managed identity. To create a user assigned managed identity, see [manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). If you'd like to use a system assigned managed identity and don't already have one assigned to your App Service Environment, the Custom domain suffix portal experience will guide you through the creation process. Alternatively, you can go to the **Identity** page for your App Service Environment and configure and assign your managed identities there.

To enable a system assigned managed identity, set the Status to On.

:::image type="content" source="./media/custom-domain-suffix/ase-system-assigned-managed-identity.png" alt-text="Screenshot of a sample system assigned managed identity for App Service Environment.":::

To assign a user assigned managed identity, select "Add", and find the managed identity you want to use.

:::image type="content" source="./media/custom-domain-suffix/ase-user-assigned-managed-identity.png" alt-text="Screenshot of a sample user assigned managed identity for App Service Environment.":::

Once you assign the managed identity to your App Service Environment, ensure the managed identity has sufficient permissions for the Azure Key Vault. You can either use a vault access policy or Azure role-based access control. 

If you use a vault access policy, the managed identity will need at a minimum the "Get" secrets permission for the key vault.

:::image type="content" source="./media/custom-domain-suffix/key-vault-access-policy.png" alt-text="Screenshot of a sample key vault access policy for managed identity.":::

If you choose to use Azure role-based access control to manage access to your key vault, you'll need to give your managed identity at a minimum the "Key Vault Secrets User" role.

:::image type="content" source="./media/custom-domain-suffix/key-vault-rbac.png" alt-text="Screenshot of a sample key vault role based access control for managed identity.":::

### Certificate

The certificate for custom domain suffix must be stored in an Azure Key Vault. The certificate must be uploaded in .PFX format. Certificates in .PEM format are not supported at this time. App Service Environment will use the managed identity you selected to get the certificate. The key vault must be publicly accessible, however you can lock down the key vault by restricting access to your App Service Environment's outbound IPs. You can find your App Service Environment's outbound IPs under "Default outbound addresses" on the **IP addresses** page for your App Service Environment. You'll need to add both IPs to your key vault's firewall rules. For more information on key vault network security and firewall rules, see [Configure Azure Key Vault firewalls and virtual networks](../../key-vault/general/network-security.md#key-vault-firewall-enabled-ipv4-addresses-and-ranges---static-ips). The key vault also must not have any [private endpoint connections](../../private-link/private-endpoint-overview.md).

:::image type="content" source="./media/custom-domain-suffix/key-vault-networking.png" alt-text="Screenshot of a sample networking page for key vault to allow custom domain suffix feature.":::

Your certificate must be a wildcard certificate for the selected custom domain name. For example, *internal-contoso.com* would need a certificate covering **.internal-contoso.com*. If the certificate used by the custom domain suffix contains a Subject Alternate Name (SAN) entry for scm, for example **.scm.internal-contoso.com*, the scm site will also available using the custom domain suffix.

If you rotate your certificate in Azure Key Vault, the App Service Environment will pick up the change within 24 hours.

::: zone pivot="experience-azp"

## Use the Azure portal to configure custom domain suffix

1. From the [Azure portal](https://portal.azure.com), navigate to the **Custom domain suffix** page for your App Service Environment.
1. Enter your custom domain name.
1. Select the managed identity you've defined for your App Service Environment. You can use either a system assigned or user assigned managed identity. You'll be able to configure your managed identity if you haven't done so already directly from the custom domain suffix page using the "Add identity" option in the managed identity selection box.
:::image type="content" source="./media/custom-domain-suffix/managed-identity-selection.png" alt-text="Screenshot of a configuration pane to select and update the managed identity for the App Service Environment.":::
1. Select the certificate for the custom domain suffix.
1. Select "Save" at the top of the page. To see the latest configuration updates, you may need to refresh your browser page.
:::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-portal-experience.png" alt-text="Screenshot of an overview of the custom domain suffix portal experience.":::
1. It will take a few minutes for the custom domain suffix configuration to be set. Select "Refresh" at the top of the page to check the status. The banner will update with the latest progress. Once complete, the banner will state that the custom domain suffix is configured.
:::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-success.png" alt-text="Screenshot of a sample custom domain suffix success page.":::

::: zone-end

::: zone pivot="experience-arm"

## Use Azure Resource Manager to configure custom domain suffix

To configure a custom domain suffix for your App Service Environment using an Azure Resource Manager template, you'll need to include the below properties. Ensure that you've met the [prerequisites](#prerequisites) and that your managed identity and certificate are accessible and have the appropriate permissions for the Azure Key Vault.

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
            "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/asev3-cdns-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ase-cdns-managed-identity"
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
        "type": "SystemAssigned"
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
1. Select **Read/Write** in the upper toolbar to allow interactive editing in Resource Explorer.  
1. Select the **Edit** button to make the Resource Manager template editable.
1. Scroll to the bottom of the right pane. The **customDnsSuffixConfiguration** attribute is at the bottom.
1. Enter your values for **dnsSuffix**, **certificateUrl**, and **keyVaultReferenceIdentity**.
1. Navigate to the **identity** attribute and enter the details associated with the managed identity you're using.
1. Select the **PUT** button that's located at the top to commit the change to the App Service Environment.
1. The **provisioningState** under **customDnsSuffixConfiguration** will provide a status on the configuration update. 

::: zone-end

## DNS configuration

To access your apps in your App Service Environment using your custom domain suffix, you'll need to either configure your own DNS server or configure DNS in an Azure private DNS zone for your custom domain.

If you want to use your own DNS server, add the following records:

1. Create a zone for your custom domain.
1. Create an A record in that zone that points * to the inbound IP address used by your App Service Environment.
1. Create an A record in that zone that points @ to the inbound IP address used by your App Service Environment.
1. Optionally create a zone for scm sub-domain with a * A record that points to the inbound IP address used by your App Service Environment

To configure DNS in Azure DNS private zones:

1. Create an Azure DNS private zone named for your custom domain. In the example below, the custom domain is *internal-contoso.com*.
1. Create an A record in that zone that points * to the inbound IP address used by your App Service Environment.
1. Create an A record in that zone that points @ to the inbound IP address used by your App Service Environment.
:::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-dns-configuration.png" alt-text="Screenshot of a sample DNS configuration for your custom domain suffix.":::
1. Link your Azure DNS private zone to your App Service Environment's virtual network.
:::image type="content" source="./media/custom-domain-suffix/private-dns-zone-vnet-link.png" alt-text="Screenshot of a sample virtual network link for private DNS zone.":::
1. Optionally create an A record in that zone that points *.scm to the inbound IP address used by your App Service Environment.

For more information on configuring DNS for your domain, see [Use an App Service Environment](./using.md#dns-configuration).

## Access your apps

After configuring the custom domain suffix and DNS for your App Service Environment, you can go to the **Custom domains** page for one of your App Service apps in your App Service Environment and confirm the addition of the assigned custom domain for the app. 

:::image type="content" source="./media/custom-domain-suffix/app-custom-domain-sample.png" alt-text="Screenshot of a sample custom domain for an app created by App Service Environment custom domain suffix feature.":::

Apps on the ILB App Service Environment can be accessed securely over HTTPS by going to either the custom domain you configured or the default domain *appserviceenvironment.net* like in the previous image. The ability to access your apps using the default App Service Environment domain and your custom domain is a unique feature that is only supported on App Service Environment v3.

However, just like apps running on the public multi-tenant service, you can also configure custom host names for individual apps, and then configure unique SNI [TLS/SSL certificate bindings for individual apps](./overview-certificates.md#tls-settings).

## Troubleshooting

If your permissions or network settings for your managed identity, key vault, or App Service Environment aren't set appropriately, you won't be able to configure a custom domain suffix, and you'll receive an error similar to the example below. Review the [prerequisites](#prerequisites) to ensure you've set the needed permissions. You'll also see a similar error message if the App Service platform detects that your certificate is degraded or expired.

:::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-error.png" alt-text="Screenshot of a sample custom domain suffix error message.":::

## Next steps

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Tutorial: Map an existing custom DNS name to Azure App Service](../app-service-web-tutorial-custom-domain.md)
