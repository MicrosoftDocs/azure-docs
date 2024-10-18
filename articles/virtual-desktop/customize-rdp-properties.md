---
title: Set custom RDP properties on a host pool in Azure Virtual Desktop
description: Learn how to set custom RDP properties on a host pool that add to the default properties and values or override the default values.
author: dknappettmsft
ms.topic: how-to
ms.date: 08/22/2024
ms.author: daknappe
ms.custom: devx-track-azurepowershell, docs_inherited
---

# Set custom Remote Desktop Protocol (RDP) properties on a host pool in Azure Virtual Desktop

When users sign in to Windows App or the Remote Desktop app, desktops and applications that they have access to are shown. For each desktop and application, there is a corresponding `.rdp` file that contains all the connection properties to use when connecting to a remote session over the Remote Desktop Protocol (RDP). These RDP properties are set per host pool.

Each host pool has a set of default RDP properties and values. You can add other properties to the default set or override the default values by setting custom RDP properties. This article shows you how to set custom RDP properties on a host pool by using the Azure portal, Azure PowerShell, and Azure CLI. 

## Default host pool RDP properties

Host pools have the following RDP properties and values by default:

| RDP Property | Details |
|--|--|
| `audiomode:i:0` | Determines whether the local or remote machine plays audio. |
| `devicestoredirect:s:*` | Determines which peripherals that use the Media Transfer Protocol (MTP) or Picture Transfer Protocol (PTP), such as a digital camera, are redirected from a local Windows device to a remote session. |
| `drivestoredirect:s:*` | Determines which fixed, removable, and network drives on the local device will be redirected and available in a remote session. |
| `enablecredsspsupport:i:1` | Determines whether the client will use the Credential Security Support Provider (CredSSP) for authentication if it's available. |
| `redirectclipboard:i:1` | Determines whether to redirect the clipboard. |
| `redirectcomports:i:1` | Determines whether serial or COM ports on the local device are redirected to a remote session. |
| `redirectprinters:i:1` | Determines whether printers available on the local device are redirected to a remote session. |
| `redirectsmartcards:i:1` | Determines whether smart card devices on the local device will be redirected and available in a remote session. |
| `redirectwebauthn:i:1` | Determines whether WebAuthn requests from a remote session are redirected to the local device allowing the use of local authenticators (such as Windows Hello for Business and security keys). |
| `usbdevicestoredirect:s:*` | Determines which supported USB devices on the client computer are redirected using opaque low-level redirection to a remote session. |
| `use multimon:i:1` | Determines whether the remote session will use one or multiple displays from the local device. |
| `videoplaybackmode:i:1` | Determines whether the connection will use RDP-efficient multimedia streaming for video playback. |

For a full list of supported properties and values, see [Supported RDP properties with Azure Virtual Desktop](rdp-properties.md) 

> [!TIP]
> To learn more about redirecting peripherals and resources, see [Peripheral and resource redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md). You might need to configure more than just an RDP property.

## Prerequisites

Before you can set custom RDP properties on a host pool, you need: 

- An existing host pool.

- An Azure account assigned the [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor) role or equivalent.

- If you want to use Azure CLI or Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension or the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

## Configure custom RDP properties

Select the relevant tab for your scenario.

### [Azure portal](#tab/portal)

Here's how to configure RDP properties using the Azure portal. For a full list of supported properties and values, see [Supported RDP properties with Azure Virtual Desktop](rdp-properties.md).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the name of the host pool you want to update.

1. Select **RDP Properties**, then select the **Advanced** tab.

   :::image type="content" source="media/customize-rdp-properties/rdp-properties-advanced.png" alt-text="A screenshot showing the advanced tab of RDP properties in the Azure portal." lightbox="media/customize-rdp-properties/rdp-properties-advanced.png":::

1. Add extra RDP properties or make changes to the existing RDP properties in a semicolon-separated format, like the default values already shown.

1. When you're done, select **Save** to save your changes. Users need to refresh their resources to receive the changes.

### [Azure PowerShell](#tab/powershell)

To configure RDP properties using Azure PowerShell, use the following examples. Be sure to change the `<placeholder>` values for your own. For a full list of supported properties and values, see [Supported RDP properties with Azure Virtual Desktop](rdp-properties.md).

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Use one of the following examples based on your requirements:

   - To add custom RDP properties to a host pool and keep any existing custom properties already set, run the following commands. RDP properties need to be written in a semi-colon-separated format. This example adds disabling clipboard and printer redirection:

      ```azurepowershell
      $hostPool = "<HostPoolName>"
      $resourceGroup = "<ResourceGroupName>"
      $addCustomProperties = "redirectclipboard:i:0;redirectprinters:i:0"

      $currentCustomProperties = (Get-AzWvdHostPool -Name $hostPool -ResourceGroupName $resourceGroup).CustomRdpProperty
      $customProperties = $currentCustomProperties + $addCustomProperties

      Update-AzWvdHostPool -Name $hostPool -ResourceGroupName $resourceGroup -CustomRdpProperty $customProperties
      ```
   
   - To replace all existing custom properties with a new set of custom RDP properties, run the following command. This example only sets disabling clipboard and printer redirection:

      ```azurepowershell
      $hostPool = "<HostPoolName>"
      $resourceGroup = "<ResourceGroupName>"
      $customProperties = "redirectclipboard:i:0;redirectprinters:i:0"

      Update-AzWvdHostPool -Name $hostPool -ResourceGroupName $resourceGroup -CustomRdpProperty $customProperties
      ```

   - To remove all custom RDP properties from a host pool, run the following command. This example passes an empty string to the `CustomRdpProperty` parameter:

      ```azurepowershell
      $hostPool = "<HostPoolName>"
      $resourceGroup = "<ResourceGroupName>"
      $customProperties = ""

      Update-AzWvdHostPool -Name $hostPool -ResourceGroupName $resourceGroup -CustomRdpProperty $customProperties
      ```

3. Check the custom RDP properties set on the same host pool by running the following command:

   ```azurepowershell
   Get-AzWvdHostPool -Name $hostPool -ResourceGroupName $resourceGroup | FT Name, CustomRdpProperty
   ```

   The output should be similar to the following example:

   ```output
    Name              : contoso-hp01
    CustomRdpProperty : use multimon:i:1;redirectclipboard:i:0;redirectprinters:i:0;
   ```

4. Users need to refresh their resources to receive the changes.

### [Azure CLI](#tab/cli)

To configure RDP properties using Azure CLI, use the following examples. Be sure to change the `<placeholder>` values for your own. For a full list of supported properties and values, see [Supported RDP properties with Azure Virtual Desktop](rdp-properties.md).

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Use one of the following examples based on your requirements:

   - To add custom RDP properties to a host pool and keep any existing custom properties already set, run the following commands. RDP properties need to be written in a semi-colon-separated format. This example adds disabling clipboard and printer redirection to the existing custom properties:

      ```azurecli
      hostPool="<HostPoolName>"
      resourceGroup="<ResourceGroupName>"
      addCustomProperties="redirectclipboard:i:0;redirectprinters:i:0"

      currentCustomProperties=$(az desktopvirtualization hostpool show \
          --name $hostPool \
          --resource-group $resourceGroup \
          --query [customRdpProperty] \
          --output tsv)

      customProperties="$currentCustomProperties$addCustomProperties"

      az desktopvirtualization hostpool update \
          --name $hostPool \
          --resource-group $resourceGroup \
          --custom-rdp-property "$customProperties"
      ```
   
   - To replace all existing custom properties with a new set of custom RDP properties, run the following command. This example only sets disabling clipboard and printer redirection:

      ```azurecli
      hostPool="<HostPoolName>"
      resourceGroup="<ResourceGroupName>"

      az desktopvirtualization hostpool update \
          --name $hostPool \
          --resource-group $resourceGroup \
          --custom-rdp-property "redirectclipboard:i:0;redirectprinters:i:0"
      ```

   - To remove all custom RDP properties from a host pool, run the following command. This example passes an empty string to the `--custom-rdp-property` parameter:

      ```azurecli
      hostPool="<HostPoolName>"
      resourceGroup="<ResourceGroupName>"

      az desktopvirtualization hostpool update \
          --name $hostPool \
          --resource-group $resourceGroup \
          --custom-rdp-property ""
      ```

3. Check the custom RDP properties set on the same host pool by running the following command:

    ```azurecli
    az desktopvirtualization hostpool show \
        --name $hostPool \
        --resource-group $resourceGroup \
        --query "{name:name, customRdpProperty:customRdpProperty}" \
        --output table
    ```

    The output should be similar to the following example:

    ```output
    Name          CustomRdpProperty
    --------      ------------------------------------------------------------
    contoso-hp01  use multimon:i:0;redirectclipboard:i:0;redirectprinters:i:0;
    ```

4. Users need to refresh their resources to receive the changes.

---

## Related content

- [Supported RDP properties with Azure Virtual Desktop](rdp-properties.md)
- [Peripheral and resource redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md)
