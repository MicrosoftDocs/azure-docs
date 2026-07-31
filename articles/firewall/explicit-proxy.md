---
title: Azure Firewall explicit proxy
description: Learn about Azure Firewall's explicit proxy setting.
author: rastogideva
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 07/29/2026
ms.author: duau
# Customer intent: As a network administrator, I want to configure an explicit proxy on Azure Firewall, so that I can manage outbound traffic efficiently without using a user-defined route.
---

# Azure Firewall explicit proxy

Azure Firewall operates in transparent proxy mode by default. In this mode, a user-defined route (UDR) routes traffic to the firewall. The firewall intercepts the traffic inline and forwards it to the destination.

When you enable explicit proxy for outbound traffic, you can configure the sending application, such as a web browser, to use Azure Firewall as the proxy. This configuration directs traffic from the application to the firewall's private IP address, so traffic egresses directly from the firewall without relying on a UDR.

Explicit proxy mode supports HTTP and HTTPS traffic. You define proxy settings in the browser or application to point to the firewall's private IP address. You can configure this setting manually or use a proxy auto-configuration (PAC) file. The firewall can host the PAC file to handle proxy requests after you upload it to the firewall.

## Prerequisites

- An Azure Firewall with an associated firewall policy. You configure explicit proxy in the firewall policy, not on the firewall resource. For more information, see [Azure Firewall policy rule sets](policy-rule-sets.md).

- To host a PAC file, you also need:

  - An Azure Storage account with a blob container to store the PAC file.
  - A user-assigned managed identity that has the **Storage Blob Data Contributor** and **Storage Blob Data Reader** roles on that storage account.

## Configuration

- Enable explicit proxy in the Azure Firewall policy.

   :::image type="content" source="media/explicit-proxy/enable-explicit-proxy.png" alt-text="Screenshot showing the Enable explicit proxy setting.":::
   > [!NOTE]
   > You can use a single port **HTTP Port** for both HTTP and HTTPS traffic.

- Create an **application** rule in the firewall policy to allow the traffic through the firewall.

- Select **Enable proxy auto-configuration** to use a proxy auto-configuration (PAC) file.

- Generate a PAC File URL by following these steps:
    - Create an Azure Storage container by following the steps in [Manage blob containers](/azure/storage/blobs/blob-containers-portal).
    > [!NOTE]
    > Use a subscription to which you have the required permissions to add roles.
    - Upload the PAC file to the storage container.
     :::image type="content" source="media/explicit-proxy/pac-file-upload.png" alt-text="Screenshot showing PAC file upload.":::
    - Choose the uploaded file and copy the file URL. Example URL: `https://eproxypstestresources.blob.core.windows.net/explicitproxycontainer/proxy.pac`
     :::image type="content" source="media/explicit-proxy/copy-url.png" alt-text="Screenshot showing copied PAC file URL.":::

- Create a Managed Identity and assign the required roles.
    - Go to the Managed Identity resource and create a Managed Identity. For more information, see [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).
    - Go to the storage account resource that you created and navigate to **Access Control (IAM)**. Select **Add** to add the role assignment.
    - Go to **Add role assignment**, search for **Storage Blob Data Contributor** and **Storage Blob Data Reader**, and select them.
    :::image type="content" source="media/explicit-proxy/role-assignment.png" alt-text="Screenshot showing how to add role assignment.":::
    - Go to **Members** and select the Managed Identity. Review the changes and select **Assign** in **Review+Assign**.
    :::image type="content" source="media/explicit-proxy/review-assign-role.png" alt-text="Screenshot showing review and assign role.":::
    - Verify that your changes are reflected in **Role Assignments** by searching the managed identity.
    :::image type="content" source="media/explicit-proxy/verify-assignment.png" alt-text="Screenshot showing verified role assignments.":::
    > [!NOTE]
    > Make sure that the Managed Identity that you create has the prefix "PacFileMSI-".

- After you have the PAC file URL and Managed Identity, you can enable the PAC file in the Explicit proxy configuration by providing the PAC file URL and selecting the Managed Identity that you created.

    # [Portal](#tab/portal)

    :::image type="content" source="media/explicit-proxy/update-managed-identity.png" alt-text="Screenshot showing how to update managed identity.":::

    # [PowerShell](#tab/powershell)

    For a secure way of using explicit proxy, provide the PAC file URL and a user-assigned managed identity that has the required access to download the PAC file from your customer blob storage.

    Create a firewall policy with explicit proxy settings:

    ```azurepowershell-interactive
    $exProxy = New-AzFirewallPolicyExplicitProxy `
        -EnableExplicitProxy `
        -HttpPort 100 `
        -EnablePacFile `
        -PacFilePort 130 `
        -PacFile "https://sampleurlfortesting.blob.core.windows.net/nothing"
    ```

    Update a firewall policy with explicit proxy settings and the user-assigned managed identity:

    ```azurepowershell-interactive
    $identityId = "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/testrg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/PacFileMSI-eproxyidentity"

    New-AzFirewallPolicy `
        -Name "fp1" `
        -ResourceGroupName "TestRg" `
        -ExplicitProxy $exProxy `
        -UserAssignedIdentityId $identityId
    ```

    # [CLI](#tab/cli)

    Create a firewall policy with explicit proxy settings:

    ```azurecli-interactive
    az network firewall policy create \
        --resource-group "testrg" \
        --name "testfwpolicy" \
        --sku Premium \
        --explicit-proxy enable-explicit-proxy=true http-port=9001 enable-pac-file=true pac-file-port=122 pac-file="https://eproxypstestresources.blob.core.windows.net/explicitproxycontainer/proxy.pac" \
        --identity "Identity_ID"
    ```

    Update a firewall policy with explicit proxy settings:

    ```azurecli-interactive
    az network firewall policy update \
        --resource-group "testrg" \
        --name "testfwpolicy" \
        --explicit-proxy enable-explicit-proxy=true http-port=9001 enable-pac-file=true pac-file-port=124 pac-file="https://eproxypstestresources.blob.core.windows.net/explicitproxycontainer/proxy.pac" \
        --identity "Identity_ID"
    ```

    ---

## Governance and compliance

To ensure consistent configuration of explicit proxy settings across your Azure Firewall deployments, use Azure Policy definitions. The following policies are available to govern explicit proxy configurations:

- **Enforce Explicit Proxy Configuration for Firewall Policies**: Ensures that all Azure Firewall policies have explicit proxy configuration enabled.
- **Enable PAC file configuration while using Explicit Proxy**: Audits that when explicit proxy is enabled, the PAC (Proxy Auto-Configuration) file is also properly configured.

For more information about these policies and how to implement them, see [Use Azure Policy to help secure your Azure Firewall deployments](firewall-azure-policy.md).

## Next steps

- To learn how to use explicit proxy to reach Azure services from Azure Arc-enabled resources, see [Access Azure services over Azure Firewall explicit proxy](/azure/azure-arc/azure-firewall-explicit-proxy).
- To learn how to create the application rules that allow proxied traffic, see [Azure Firewall policy rule sets](policy-rule-sets.md).
- To learn how to govern explicit proxy settings, see [Use Azure Policy to help secure your Azure Firewall deployments](firewall-azure-policy.md).
- To learn how to deploy an Azure Firewall, see [Deploy and configure Azure Firewall by using Azure PowerShell](deploy-ps.md).
- To learn more about explicit proxy, see [Demystifying Explicit proxy: Enhancing Security with Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/demystifying-explicit-proxy-enhancing-security-with-azure/ba-p/3873445).
