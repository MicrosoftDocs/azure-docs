---
title: Configure Custom Domain Suffix for App Service Environment
description: Configure a custom domain suffix for App Service Environment in the Azure portal or use an Azure Resource Manager template (ARM template).
author: seligj95
ms.topic: how-to
ms.date: 03/31/2026
ms.author: jordanselig
ms.service: azure-app-service
ms.custom:
  - devx-track-arm-template
  - sfi-image-nochange
#customer intent: As an App Service developer, I want to configure a custom domain suffix for my Azure App Service Environment, so I can use my preferred domain address with my apps.
---

# Custom domain suffix for App Service Environments

An App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps securely at high scale. The DNS settings for your App Service Environment's default domain suffix don't restrict your apps to only being accessible by those names. The _custom domain suffix_ feature available in an internal load balancer (ILB) App Service Environment allows you to use your own domain suffix to access the apps in your App Service Environment.

The custom domain suffix defines a root domain used by the App Service Environment. In the public version of Azure App Service, the default root domain for all web apps is `azurewebsites.net`. For ILB App Service Environments, the default root domain is `appserviceenvironment.net`. Because an ILB App Service Environment is internal to an organization's virtual network, users can use both the default and a root domain that corresponds to the organization's internal virtual network. For example, an organization named Zava might use a default root domain of `internal.zava.com` for apps that are intended to only be resolvable and accessible within the Zava virtual network. An app in this virtual network might be reached by accessing the `APP-NAME.internal.zava.com` URL.

This article describes how to configure a custom domain suffix for an App Service Environment in the Azure portal. JSON snippets are also provided for using an Azure Resource Manager template (ARM template).

## Prerequisites

- An ILB variation of App Service Environment v3. If you don't have an App Service Environment, see [Create an App Service Environment v3](./creation.md).

- A valid SSL/TLS certificate that satisfies the following criteria:

   - The certificate must be stored in Azure Key Vault.

   - The certificate must be less than 20 kb.

   - The certificate must use the Personal Information Exchange (_.pfx_) format. For more information on using certificates with App Service, see [Add and manage TLS/SSL certificates in Azure App Service](../configure-ssl-certificate.md). Certificates in the Privacy Enhanced Mail (_.pem_) format aren't currently supported. 

- For TLS-based connections, the connection to the custom domain suffix endpoint must use Server Name Indication (SNI).

### Important considerations

Review the following important considerations for working with a custom domain suffix:

- If the certificate used for the custom domain suffix contains a Subject Alternate Name (SAN) entry for `*.scm.CUSTOM-DOMAIN`, the scm site is also reachable from the `APP-NAME.scm.CUSTOM-DOMAIN` URL. You can only access scm over a custom domain by using basic authentication. Single sign-on is only possible with the default root domain. 

- Unlike earlier App Service versions, the FTPS endpoints for your App Service apps on your App Service Environment v3 can be reached only using the default domain suffix.

- The custom domain suffix is for the App Service Environment. This feature is different from a _custom domain binding_ on an Azure App Service app. For more information on custom domain bindings, see [Set up an existing custom domain in Azure App Service](../app-service-web-tutorial-custom-domain.md).

## Configure managed identities

[Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview) are used to authenticate against the Azure key vault where the SSL/TLS certificate is stored. If you don't currently have a managed identity associated with your App Service Environment, you need to configure one.

You can use either a system-assigned or user-assigned managed identity. To create a user-assigned managed identity, see [Manage user-assigned managed identities in the Azure portal](/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal). If you'd like to use a system-assigned managed identity and don't already have one assigned to your App Service Environment, the Custom domain suffix portal experience guides you through the creation process.

> [!TIP]
> You can create a managed identity at the same time you [create the custom domain suffix](#add-identity).

#### Use system-assigned managed identity

To use a system-assigned managed identity for your App Service Environment:

1. In the [Azure portal](https://portal.azure.com), go to your App Service Environment resource.

1. On the left menu, select **Settings** > **Identity**.

1. On the **System assigned** tab, set the **Status** to **On**:

   :::image type="content" source="./media/custom-domain-suffix/ase-system-assigned-managed-identity.png" border="false" alt-text="Screenshot that shows a system-assigned managed identity for an App Service Environment in the Azure portal.":::

#### Add user-assigned managed identity

To add a user-assigned managed identity to your App Service Environment:

1. On the **User assigned** tab, select **+ Add**.

1. In the **Add user assigned managed identity** pane, select your **Subscription**.

1. Search for and select the user-assigned managed identity to use, and then select **Add**:

   :::image type="content" source="./media/custom-domain-suffix/ase-user-assigned-managed-identity.png" alt-text="Screenshot that shows how to add a user-assigned managed identity for an App Service Environment in the Azure portal.":::

## Ensure access to Azure Key Vault

After you assign a managed identity to your App Service Environment, ensure the identity has sufficient permissions for your Azure key vault. You can use a vault access policy or Azure role-based access control. 

### Use a vault access policy

If you use a vault access policy, the managed identity needs at a minimum the "Get" secrets permission for the key vault.

Check the assignment for the resource:

1. In the [Azure portal](https://portal.azure.com), go to your Azure key vault resource.

1. On the left menu, select **Access policies**.

1. On the right pane, locate your assigned managed identity in the list of results:

   :::image type="content" source="./media/custom-domain-suffix/key-vault-access-policy.png" alt-text="Screenshot that shows a managed identity assigned the 'Get' Secret Permissions access policy on an Azure key vault.":::

### Use Azure role-based access control

If you choose to use Azure role-based access control to manage access to your key vault, you need to give your managed identity at a minimum the "Key Vault Secrets User" role.

Check the assignment for the resource:

1. In the [Azure portal](https://portal.azure.com), go to your Azure key vault resource.

1. On the left menu, select **Access control (IAM)**.

1. On the **Role assignments** tab, set the **Role** filter for the search to **Key Vault Secrets User**.

1. Locate your assigned managed identity in the list of results:

   :::image type="content" source="./media/custom-domain-suffix/key-vault-rbac.png" alt-text="Screenshot that shows a managed identity assigned the 'Key Vault Secrets User' role on an Azure key vault.":::

## Check the managed identity certificate

The App Service Environment obtains the certificate for the custom domain suffix from the assigned managed identity.

- The certificate must satisfy the criteria described in the [Prerequisites](#prerequisites).

- The certificate must be a wildcard certificate for the selected custom domain name. For example, the domain `internal.contoso.com` requires a certificate that allows all possible connections, `*.internal.contoso.com`.

- If the certificate contains a SAN entry for `*.scm.CUSTOM-DOMAIN`, the scm site is also reachable from the `APP-NAME.scm.CUSTOM-DOMAIN` URL. You can only access scm over a custom domain by using basic authentication. Single sign-on is only possible with the default root domain.

If you rotate your certificate in Azure Key Vault, the App Service Environment picks up the change within 24 hours.

## Configure network access to Azure Key Vault

The key vault can be accessed publicly or through a [private endpoint](/azure/private-link/private-endpoint-overview) accessible from the subnet where the App Service Environment is deployed.

To configure a private endpoint, see [Integrate Key Vault with Azure Private Link](/azure/key-vault/general/private-link-service).

If you use public access, you can secure your key vault to only accept traffic from the outbound IP address of the App Service Environment. The App Service Environment uses the platform outbound IP address as the source address when accessing the key vault.

Locate the platform outbound IP address:

1. In the [Azure portal](https://portal.azure.com), go to your App Service Environment resource.

1. On the left menu, select **Settings** > **IP Addresses**.

1. On the right pane, under the **Outbound** section, check the **Platform outbound addresses** value:

   :::image type="content" source="./media/custom-domain-suffix/platform-outbound-ip.png" alt-text="Screenshot that shows how to locate the platform outbound addresses for the App Service Environment in the Azure portal.":::

## Configure the custom domain suffix

Use the following procedure to create and configure the custom domain suffix for your App Service Environment in the Azure portal. If you prefer, you can [use an ARM template](#use-an-arm-template-to-configure-the-suffix).

1. In the [Azure portal](https://portal.azure.com), go to your App Service Environment.

1. On the left menu, select **Settings** > **Custom domain suffix**.

1. Select **Add custom domain suffix**.

   :::image type="content" source="./media/custom-domain-suffix/add-custom-domain-suffix.png" alt-text="Screenshot that shows how to add a custom domain suffix for the App Service Environment in the Azure portal.":::

1. Enter your **Custom domain name**, such as `zava.com`.

1. Select the **Managed identity** for your App Service Environment:

   <a name="add-identity"></a>

   Choose an existing system-assigned or user-assigned managed identity, or configure a new managed identity by selecting **Add identity**:

   :::image type="content" source="./media/custom-domain-suffix/managed-identity-selection.png" alt-text="Screenshot that shows how to add a managed identity for App Service Environment when you configure the custom domain suffix.":::

1. Identify the **Certificate** for the custom domain suffix by selecting **Select certificate**:

   :::image type="content" source="./media/custom-domain-suffix/certificate-selection.png" alt-text="Screenshot that shows how to select the certificate to use for the custom domain suffix in the Azure portal.":::

   In the **Select certificate** pane, choose your subscription, the key vault, and the certificate. To apply your changes, choose **Select**.

   > [!NOTE]
   > If you use a private endpoint to access the key vault, you can't use the portal interface to select the certificate. Because the network access is restricted to the private endpoint, you must manually enter the certificate URL.

1. In the main menubar, select **Save**:

   :::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-portal-experience.png" alt-text="Screenshot that shows how to save your custom domain suffix changes in the Azure portal.":::

   It can take a few minutes for the system to propagate your custom domain suffix changes.

   Check the configuration status by selecting **Refresh**. The banner at the top of the page updates with the latest progress.
   
   After the update completes, the banner indicates the custom domain suffix is configured:

   :::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-success.png" alt-text="Screenshot of the Azure portal page banner showing a successful change to the custom domain suffix.":::

## Use an ARM template to configure the suffix

As an alternate approach to the Azure portal, you can configure a custom domain suffix for your App Service Environment by using an ARM template. In the template file, specify properties for your custom DNS suffix configuration, the ILB mode, and your managed identity.

To use an ARM template, prepare your configuration:

- Confirm the configuration satisfies the [prerequisites](#prerequisites) defined in this article.

- Confirm your [managed identity and certificate](#configure-managed-identities) are accessible. 

- Verify you have the appropriate permissions for the Azure key vault.

### Use a user-assigned managed identity

The following snippet shows an abbreviated ARM template with configurations for the user-assigned managed identity settings. In the template JSON (_.json_) file, set the following properties:

| Property | Value |
|---|---|
| `identity` > `type` | `UserAssigned` |
| `identity` > `userAssignedIdentities` | Your user-assigned ID. |
| `customDnsSuffixConfiguration` > `dnsSuffix` | Your DNS suffix. |
| `customDnsSuffixConfiguration` > `certificateUrl` | The URL for your certificate. |
| `customDnsSuffixConfiguration` > `keyVaultReferenceIdentity` | The ID for your Azure key vault. |
| `internalLoadBalancingMode` | The mode for your ILB App Service Environment: `Web`, `Publishing`, or both. |

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
            "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/asev3-cdns-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ase-cdns-managed-identity"
        }
    },
    "properties": {
        "customDnsSuffixConfiguration": {
            "dnsSuffix": "antares-test.net",
            "certificateUrl": "https://kv-sample-key-vault.vault.azure.net/secrets/wildcard-antares-test-net",
            "keyVaultReferenceIdentity": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/asev3-cdns-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ase-cdns-managed-identity"
        },
        "internalLoadBalancingMode": "Web, Publishing",
        etc...
    }
}
```

### Use a system-assigned managed identity

The following snippet shows an abbreviated ARM template with configurations for the system-assigned managed identity settings. In the template JSON (_.json_) file, set the following properties:

| Property | Value |
|---|---|
| `identity` > `type` | `SystemAssigned` |
| `customDnsSuffixConfiguration` > `dnsSuffix` | Your DNS suffix. |
| `customDnsSuffixConfiguration` > `certificateUrl` | The URL for your certificate. |
| `customDnsSuffixConfiguration` > `keyVaultReferenceIdentity` | `systemassigned` |
| `internalLoadBalancingMode` | The mode for your ILB App Service Environment: `Web`, `Publishing`, or both. |

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

## DNS configuration

To access your apps in your App Service Environment using your custom domain suffix, you need to either configure your own DNS server or configure DNS in an Azure Private DNS zone for your custom domain.

### Use your own DNS server

If you want to use your own DNS server, add the following records:

1. Create a zone for your custom domain.

1. Create an `A` record in that zone that points `*` (the asterisk wildcard) to the inbound IP address used by your App Service Environment.

1. Create an `A` record in the same zone that points `@` (the at symbol) to the inbound IP address used by your App Service Environment.

1. (Optional) Create a zone for the `scm` subdomain with a `*` (the asterisk wildcard) `A` record that points to the inbound IP address used by your App Service Environment

### Configure Private DNS zones

To configure Azure Private DNS zones, follow these steps:

1. Create a Private DNS zone named for your custom domain, such as `internal-zava.com`.

1. Create an `A` record in the zone that points `*` (the asterisk wildcard) to the inbound IP address used by your App Service Environment.

1. Create an `A` record in the zone that points `@` (the at symbol) to the inbound IP address used by your App Service Environment:

   In the [Azure portal](https://portal.azure.com), you can view the Private DNS zone records by selecting **DNS Management** > **Recordsets**:

   :::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-record-sets.png" alt-text="Screenshot that shows the Private DNS zone recordsets in the Azure portal.":::

1. Link your Private DNS zone to the virtual network for your App Service Environment:

   In the [Azure portal](https://portal.azure.com), you can check the virtual network link by selecting **DNS Management** > **Virtual Network Links**:

   :::image type="content" source="./media/custom-domain-suffix/private-dns-zone-vnet-link.png" alt-text="Screenshot that shows the virtual network link between the Private DNS zone and the App Service Environment in the Azure portal.":::

1. (Optional) Create an `A` record in the zone that points `*.scm` (at scm) to the inbound IP address used by your App Service Environment.

For more information about configuring DNS for your domain, see [Use an App Service Environment](./using.md#configure-dns).

> [!NOTE]
> When you configure DNS for your custom domain suffix, it's a best practice to also [configure DNS for the default domain suffix](./using.md#configure-dns). This action helps to ensure all App Service features function as expected.

## Check domain access for your apps

After you configure the custom domain suffix and DNS for your App Service Environment, you can check your web apps and confirm the addition of the assigned custom domain. 

1. In the [Azure portal](https://portal.azure.com), go to an app in your App Service Environment.

1. On the left menu, select **Settings** > **Custom domains**.

:::image type="content" source="./media/custom-domain-suffix/app-custom-domain-sample.png" alt-text="Screenshot that shows the custom domain suffix available for an App Service Environment app in the Azure portal.":::

Apps on the ILB App Service Environment are securely accessible over HTTPS by going to either the custom domain you configured or the default domain `appserviceenvironment.net`, as shown in the image. The ability to access your apps by using the default App Service Environment domain and your custom domain is a unique feature for App Service Environment v3.

Similar to apps running on the public multitenant service, you can also configure custom host names for individual apps, and then configure unique SNI [TLS/SSL certificate bindings for individual apps](./overview-certificates.md#tls-settings).

## Troubleshooting

The App Service platform periodically checks if your App Service Environment can access your Azure key vault and if your certificate is valid. If your permissions or network settings for your managed identity, key vault, or App Service Environment aren't set appropriately or they're recently changed, you can't configure the suffix. In the Azure portal, the banner displays an error similar to the following example:

:::image type="content" source="./media/custom-domain-suffix/custom-domain-suffix-error.png" alt-text="Screenshot of a configuration error for a custom domain suffix in the Azure portal.":::

Review the [prerequisites](#prerequisites) to ensure you configured the needed permissions. You also see a similar error message if the App Service platform detects that your certificate is degraded or expired.

## Related content

- [Host an app in an App Service Environment](using.md)
- [App Service Environment networking](networking.md)
- [Set up an existing custom domain in Azure App Service](../app-service-web-tutorial-custom-domain.md)
