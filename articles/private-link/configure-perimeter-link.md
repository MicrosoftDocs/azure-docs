---
title: Configure a perimeter link between network security perimeters
titleSuffix: Azure Private Link
description: Learn how to configure a perimeter link (cross-perimeter connection) between two network security perimeters to enable secure connectivity.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: how-to
ms.date: 07/08/2026
# Customer intent: As a network administrator, I want to configure a perimeter link between two network security perimeters, so that resources in different perimeters can communicate securely without additional access rules.
---

# Configure a perimeter link between network security perimeters (Preview)

> [!IMPORTANT]
> Perimeter Links and Cross-perimeter connectivity are currently in preview and are available across all network security perimeter supported Azure public and Azure Government cloud regions.
> During this preview, the following PaaS services support cross-perimeter connectivity:
>  - Azure SQL Database
>  - Azure Storage
>  - Azure Cosmos DB
>  - Azure Key Vault (AKV)
>  - Azure Monitoring
>  - Azure Service Bus
> You can access the feature through the Azure portal, CLI, PowerShell, and API.

In this article, you learn how to configure a perimeter link between two network security perimeters, also known as a cross-perimeter connection. A perimeter link creates a secure connection that lets resources in different network security perimeters communicate without extra access rules. To learn how perimeter links work, their benefits, and their limitations, see [What are network security perimeter links?](perimeter-links-overview.md)

## Prerequisites

Before onboarding, ensure you meet the following requirements.

# [Azure portal](#tab/portal)

[!INCLUDE [prerequisites-perimeter-link](../networking/includes/network-security-perimeter/prerequisites-perimeter-link.md)]

# [Azure CLI](#tab/cli)

[!INCLUDE [prerequisites-perimeter-link](../networking/includes/network-security-perimeter/prerequisites-perimeter-link.md)]
- The [latest Azure CLI](/cli/azure/install-azure-cli), or you can use Azure Cloud Shell in the portal.
  - This article **requires version 2.38.0 or later** of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.
- After upgrading to the latest version of Azure CLI, import the network security perimeter commands by running `az extension add --name nsp`.
- Verify the installation by running `az extension show --name nsp` to ensure the network security perimeter extension is installed correctly.

# [Azure PowerShell](#tab/powershell)

[!INCLUDE [prerequisites-perimeter-link](../networking/includes/network-security-perimeter/prerequisites-perimeter-link.md)]
- Install the Az.Tools.Installer module:
  
    ```azurepowershell
    # Install the Az.Tools.Installer module    
    Install-Module -Name Az.Tools.Installer -Repository PSGallery
    ```

- Install the preview build of the `Az.Network` module:

    ```azurepowershell-interactive
    # Install the preview build of the Az.Network module 
    Install-Module -Name Az.Network -AllowPrerelease -Force -RequiredVersion 7.13.0-preview
    ```
    
- You can choose to use Azure PowerShell locally or use [Azure Cloud Shell](/azure/cloud-shell/overview).
- To get help with the PowerShell cmdlets, use the `Get-Help` command:
    ```azurepowershell-interactive
    # Get help for a specific command
    Get-Help -Name <powershell-command> - full

    # Example
    Get-Help -Name New-AzNetworkSecurityPerimeter -full
    ```
---

## Sign in to your Azure account and select your subscription

# [Azure portal](#tab/portal)

Sign in to the [Azure portal](https://portal.azure.com) by using your Azure account.

# [Azure CLI](#tab/cli)

[!INCLUDE [cli-prerequisites-network-security-perimeter](../networking/includes/network-security-perimeter/cli-prerequisites-network-security-perimeter.md)]

# [Azure PowerShell](#tab/powershell)

[!INCLUDE [powershell-prerequisites-network-security-perimeter](../networking/includes/network-security-perimeter/powershell-prerequisites-network-security-perimeter.md)]

---

## Register preview feature for perimeter link

Register the Perimeter Link preview feature by using the Azure portal, Azure CLI, or Azure PowerShell. Select the tab for your preferred method to register the preview feature.

# [Azure portal](#tab/portal)

Register the preview feature in the Azure portal:

1. Sign in to the Azure portal, and search for **Preview features**. Select **Preview features** from the search results.
1. On the **Preview features** page, search for **Allow Network Security Perimeter Link** in the list of features, and then select **Register**.
1. After the feature is registered, you might need to refresh the page or sign out and sign back in to see the updated status.

# [Azure CLI](#tab/cli)

Register the `AllowNspLink` preview feature on the `Microsoft.Network` provider, check its registration status, and refresh the provider registration:

```azurecli
# Register the AllowNspLink preview feature on the Microsoft.Network provider
az feature register \
  --namespace Microsoft.Network \
  --name AllowNspLink

# Check the feature's registration state (wait until it shows "Registered")
az feature show \
  --name AllowNspLink \
  --namespace Microsoft.Network \
  --query properties.state \
  -o tsv

# Refresh the provider registration to apply the newly registered feature
az provider register --namespace Microsoft.Network
```

# [Azure PowerShell](#tab/powershell)

Register the `AllowNspLink` preview feature on the `Microsoft.Network` provider, then check its registration status and refresh the provider registration:

```azurepowershell
# Register the AllowNspLink preview feature on the Microsoft.Network provider
Register-AzProviderFeature `
    -FeatureName AllowNspLink `
    -ProviderNamespace Microsoft.Network

# Verify the feature's registration state (wait until it shows "Registered")
Get-AzProviderFeature `
    -ProviderNamespace Microsoft.Network `
    -FeatureName AllowNspLink

# Refresh the provider registration to apply the newly registered feature
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```

---

## Create the perimeter link

Create a perimeter link between two network security perimeters by using the Azure portal, Azure CLI, or Azure PowerShell. Select the tab for your preferred method.

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box of the Azure portal, enter **network security perimeters**. Select **network security perimeters** from the search results.
1. Open the **Network security perimeter** that you want to link with another Network security perimeter.
1. Select **Perimeter Link** > **Links** from the left-hand menu, and then select **+ Create**.
    :::image type="content" source="media/configure-perimeter-link/create-perimeter-link.png" alt-text="Screenshot of create selectors for creating a perimeter link in the links menu.":::

1. In **Create a perimeter link**, enter the following information:

    | **Setting** | **Value** |
    | --- | --- |
    | Name | Enter a unique name for the perimeter link. |
    | Local Profiles | Select one or more local network security perimeter profiles. |
    | Remote Perimeter | Select **Select network security perimeter**.</br> On the **Select network security perimeter** window, select the remote network security perimeter that you want to link with the local network security perimeter, and then select **Select**. |
    | Remote Profiles | Select one or more remote network security perimeter profiles. |

1. Review the configuration, and select **Create** to create the perimeter link.

    :::image type="content" source="media/configure-perimeter-link/review-create-perimeter-link.png" alt-text="Screenshot of configured perimeter link prior to create selection.":::

# [Azure CLI](#tab/cli)

Create a perimeter link by using the [az network perimeter link create](/cli/azure/network/perimeter/link#az-network-perimeter-link-create) command. Use this command to link a local network security perimeter with a remote network security perimeter.


The following example creates a perimeter link (`<perimeter-link-name>`) on the local network security perimeter (`<local-perimeter-name>`), and links it to the remote network security perimeter (`<remote-perimeter-name>`) by using the remote NSP's resource ID. The link scopes `<local-profile-name>` as the local profile and `<remote-profile-name>` as the remote profile:

```azurecli
# Get the resource ID of the remote network security perimeter and store it in a variable
remotePerimeterId=$(az network perimeter show \
    --name <remote-perimeter-name> \
    --resource-group <remote-resource-group-name> \
    --query id \
    --output tsv)

# View the stored resource ID
echo "$remotePerimeterId"

# Create a perimeter link from the local perimeter to the remote perimeter
az network perimeter link create \
    --name <perimeter-link-name> \
    --perimeter-name <local-perimeter-name> \
    --resource-group <local-resource-group-name> \
    --auto-remote-nsp-id "$remotePerimeterId" \
    --local-inbound-profile "['<local-profile-name>']" \
    --remote-inbound-profile "['<remote-profile-name>']"
```

Replace `<remote-perimeter-name>` and `<remote-resource-group-name>` with the name and resource group of the remote network security perimeter that you want to link with.

# [Azure PowerShell](#tab/powershell)

Create a perimeter link by using the [New-AzNetworkSecurityPerimeterLink](/powershell/module/az.network/new-aznetworksecurityperimeterlink) cmdlet. Use this cmdlet to link a local network security perimeter with a remote network security perimeter.

The following example creates a perimeter link (`<perimeter-link-name>`) on the local network security perimeter (`<local-perimeter-name>`), and links it to the remote network security perimeter (`<remote-perimeter-name>`) by using the remote NSP's resource ID. The link scopes `<local-profile-name>` as the local profile and `<remote-profile-name>` as the remote profile:

```azurepowershell
# Get the resource ID of the remote network security perimeter and store it in a variable
$remotePerimeterId = (Get-AzNetworkSecurityPerimeter `
    -Name <remote-perimeter-name> `
    -ResourceGroupName <remote-resource-group-name>).Id

# View the stored resource ID
Write-Output $remotePerimeterId

# Create a perimeter link from the local perimeter to the remote perimeter
New-AzNetworkSecurityPerimeterLink `
    -Name <perimeter-link-name> `
    -ResourceGroupName <local-resource-group-name> `
    -SecurityPerimeterName <local-perimeter-name> `
    -AutoApprovedRemotePerimeterResourceId $remotePerimeterId `
    -LocalInboundProfile @('<local-profile-name>') `
    -RemoteInboundProfile @('<remote-profile-name>')
```

Replace `<remote-perimeter-name>` and `<remote-resource-group-name>` with the name and resource group of the remote network security perimeter that you want to link with.

---

When you establish a perimeter link:

- Resources associated with the linked NSP profiles can communicate seamlessly.
- The selected profiles automatically get extra inbound and outbound allow rules.
- The source type for the generated rules is **Network security perimeter**.
- You don't need to create extra manual NSP access rules.

## Verify automatically created rules

After you create the link, inspect the profile rules.

# [Azure portal](#tab/portal)

1. In the Azure portal, open the local network security perimeter.
1. In the left-hand menu, select **Settings** > **Profiles**, and then select the local profile that you linked with the remote Network security perimeter.
1. On the **Profile** page, select **Settings** from the left-hand menu, and then select **Inbound access rules** or **Outbound access rules**.
1. For the **Inbound access rules**, you see a new inbound rule that references the allowed NSP configured in perimeter link in the **Rule name** along with the **Source type** as **Network security perimeter** and **Allowed sources** that include the linked network security perimeter.

    :::image type="content" source="media/configure-perimeter-link/inbound-access-rule.png" alt-text="Screenshot of the auto-created inbound access rule for perimeter linking.":::

1. For the **Outbound access rules**, you see a new outbound rule that references the remote NSP configured in perimeter link in the **Rule name** along with the **Destination type** as **Network security perimeter** and **Allowed destinations** that include the linked network security perimeter.

    :::image type="content" source="media/configure-perimeter-link/outbound-access-rule.png" alt-text="Screenshot of the auto-created outbound access rule for perimeter linking.":::

# [Azure CLI](#tab/cli)

List the access rules for the linked profile by using the [az network perimeter profile access-rule list](/cli/azure/network/perimeter/profile/access-rule#az-network-perimeter-profile-access-rule-list) command. The output includes the inbound and outbound rules that were created automatically for the perimeter link.

```azurecli
# List the access rules for the linked profile
az network perimeter profile access-rule list \
    --perimeter-name <local-perimeter-name> \
    --profile-name <local-profile-name> \
    --resource-group <local-resource-group-name>
```

In the output, look for the automatically created rules:

- The inbound rule has a `direction` of `Inbound` and a source that references the linked network security perimeter.
- The outbound rule has a `direction` of `Outbound` and a destination that references the remote network security perimeter.

You don't need to create these rules manually. They're generated when you establish the perimeter link.

# [Azure PowerShell](#tab/powershell)

List the access rules for the linked profile by using the [Get-AzNetworkSecurityPerimeterAccessRule](/powershell/module/az.network/get-aznetworksecurityperimeteraccessrule) cmdlet. The output includes the inbound and outbound rules that the perimeter link automatically creates.

```azurepowershell
# List the access rules for the linked profile
Get-AzNetworkSecurityPerimeterAccessRule `
    -SecurityPerimeterName <local-perimeter-name> `
    -ProfileName <local-profile-name> `
    -ResourceGroupName <local-resource-group-name>
```

In the output, look for the automatically created rules:

- The inbound rule has a `Direction` of `Inbound` and a source that references the linked network security perimeter.
- The outbound rule has a `Direction` of `Outbound` and a destination that references the remote network security perimeter.

You don't need to create these rules manually. They're generated when you establish the perimeter link.

---

## Validate connectivity

Validate end-to-end communication between resources in the linked perimeters. For example, if you linked the local profile in the local perimeter with the remote profile in the remote perimeter, validate communication between the following resources:

- Key Vault in the local profile and Storage Account in the remote profile.
- Storage Account in the local profile and SQL Database in the remote profile.
- SQL Database in the remote profile and Key Vault in the local profile.

All communication should succeed without creating extra NSP access rules.

## Monitoring and diagnostics

After you create a perimeter link, monitor the cross-perimeter connectivity by using Network security perimeter logs. The following log categories are available for monitoring:

- **Source NSP logs** - Select `OutboundAttempt` and `CrossPerimeterOutboundAllowed` to log all outbound connection attempts from the source NSP to the destination NSP, and log all allowed outbound connections from the source NSP to the destination NSP.
- **Destination NSP logs** - Select `CrossPerimeterInboundAllowed` to log all allowed inbound connections from the source NSP to the destination NSP.

:::image type="content" source="media/configure-perimeter-link/select-monitor-options.png" alt-text="Screenshot of network security perimeter diagnostic log categories.":::

## Troubleshooting cross-perimeter connectivity

If you encounter issues with cross-perimeter connectivity, use the following table to help identify and resolve common problems.

| **Issue** | **Validation** |
|---------|-----------|
| Link creation fails | Verify required permissions on the remote NSP subscription. |
| No communication observed | Ensure MSI authentication is being used. |
| Logs not visible | Verify Diagnostic Settings configuration. |
| NSP resources not listed | Verify feature registration has completed. |
| Access denied | Check automatic Network security perimeter-generated inbound and outbound rules. |

## Remove perimeter links

Before you remove a perimeter link, make sure you understand the implications of link removal on cross-perimeter connectivity. For details, see [Behavior when you remove a perimeter link](perimeter-links-overview.md#behavior-when-you-remove-a-perimeter-link).

To remove a perimeter link between two Network security perimeters, first identify the existing link, and then initiate link removal from either participating Network security perimeter.

### Identify the existing cross-perimeter link

Before you remove a perimeter link, identify the existing link between the two network security perimeters. To do this, a network security perimeter administrator identifies the perimeter link configured between two network security perimeters. The link might be scoped to one or more NSP profiles and represents an active trust relationship between the two perimeters.

### Initiate link removal from either NSP

Once you identify the existing link, an administrator of either participating network security perimeter can initiate link removal. The following steps describe how to remove a perimeter link.

# [Azure portal](#tab/portal)

1. In the Azure portal, open the remote network security perimeter that you linked with another network security perimeter.
1. From the left-hand menu, select **Perimeter Link** > **Links** to view the existing perimeter links.
1. Select the link you want to remove, and then select **Remove**.
1. From the left-hand menu, select **Perimeter Link** > **Link References** to view the existing link references for the perimeter link.
1. Select the link reference you want to remove, and then select **Remove**.

    :::image type="content" source="media/configure-perimeter-link/remove-perimeter-link.png" alt-text="Screenshot of the network security perimeter links page with the remove action selected.":::

1. In the **Delete links** dialog box, enter the name of the link to confirm deletion, and then select **Delete** and **Delete** again to confirm.

# [Azure CLI](#tab/cli)

1. List the existing perimeter links to identify the one you want to remove by using the [az network perimeter link list](/cli/azure/network/perimeter/link#az-network-perimeter-link-list) command.

    ```azurecli
    # List the perimeter links on the network security perimeter
    az network perimeter link list \
        --perimeter-name <local-perimeter-name> \
        --resource-group <local-resource-group-name> \
        --output table
    ```

1. Remove the perimeter link by using the [az network perimeter link delete](/cli/azure/network/perimeter/link#az-network-perimeter-link-delete) command.

    ```azurecli
    # Remove the perimeter link
    az network perimeter link delete \
        --name <perimeter-link-name> \
        --perimeter-name <local-perimeter-name> \
        --resource-group <local-resource-group-name>
    ```

    To skip the confirmation prompt, add the `--yes` parameter.

1. List the existing perimeter link references to find the name of the one you want to remove by using the [az network perimeter link-reference list](/cli/azure/network/perimeter/link-reference#az-network-perimeter-link-reference-list) command.

    ```azurecli
    # List the perimeter link references on the remote network security perimeter
    az network perimeter link-reference list \
        --perimeter-name <remote-perimeter-name> \
        --resource-group <remote-resource-group-name> \
        --output table
    ```

1. Remove the perimeter link reference by using the [az network perimeter link-reference delete](/cli/azure/network/perimeter/link-reference#az-network-perimeter-link-reference-delete) command.

    ```azurecli
    # Remove the perimeter link reference
    az network perimeter link-reference delete \
        --perimeter-name <remote-perimeter-name> \
        --resource-group <remote-resource-group-name> \
        --name <perimeter-link-reference-name>
    ```

# [Azure PowerShell](#tab/powershell)

1. Use the [Get-AzNetworkSecurityPerimeterLink](/powershell/module/az.network/get-aznetworksecurityperimeterlink) cmdlet to list the existing perimeter links and find the one you want to remove.

    ```azurepowershell
    # List the perimeter links on the network security perimeter
    Get-AzNetworkSecurityPerimeterLink `
        -SecurityPerimeterName <local-perimeter-name> `
        -ResourceGroupName <local-resource-group-name>
    ```

1. Use the [Remove-AzNetworkSecurityPerimeterLink](/powershell/module/az.network/remove-aznetworksecurityperimeterlink) cmdlet to remove the perimeter link.

    ```azurepowershell
    # Remove the perimeter link
    Remove-AzNetworkSecurityPerimeterLink `
        -Name <perimeter-link-name> `
        -SecurityPerimeterName <local-perimeter-name> `
        -ResourceGroupName <local-resource-group-name>
    ```

1. List the existing perimeter link references to find the one you want to remove by using the [Get-AzNetworkSecurityPerimeterLinkReference](/powershell/module/az.network/get-aznetworksecurityperimeterlinkreference) cmdlet.
    ```azurepowershell
    # List the perimeter link references on the network security perimeter
    Get-AzNetworkSecurityPerimeterLinkReference `
        -SecurityPerimeterName <remote-perimeter-name> `
        -ResourceGroupName <remote-resource-group-name>
    ```
1. Remove the perimeter link reference by using the [Remove-AzNetworkSecurityPerimeterLinkReference](/powershell/module/az.network/remove-aznetworksecurityperimeterlinkreference) cmdlet.

    ```azurepowershell
    # Remove the perimeter link reference
    Remove-AzNetworkSecurityPerimeterLinkReference `
        -SecurityPerimeterName <remote-perimeter-name> `
        -ResourceGroupName <remote-resource-group-name> `
        -Name <perimeter-link-reference-name>
    ```

---

> [!NOTE]
> Link removal **doesn't require consent or approval** from the remote NSP administrator, even if the original link was created through a mutual approval flow.

## Next steps

> [!div class="nextstepaction"]
> [What are network security perimeter links?](perimeter-links-overview.md)
