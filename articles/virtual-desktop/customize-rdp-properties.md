---
title: Set custom RDP properties on a host pool in Azure Virtual Desktop
description: Learn how to set custom RDP properties on a host pool that add to the default properties and values or override the default values.
author: dknappettmsft
ms.topic: how-to
ms.date: 08/21/2024
ms.author: daknappe
ms.custom: devx-track-azurepowershell, docs_inherited
---

# Set custom Remote Desktop Protocol properties on a host pool in Azure Virtual Desktop

When users sign in to Windows App or the Remote Desktop app, desktops and applications that they have access to are shown. For each desktop and application, there is a corresponding `.rdp` file that contains all the connection properties to use when connecting to a remote session. These properties are set per host pool and are known as RDP properties.

Each host pool has a set of default RDP properties and values. You can add other properties to the default set or override the default values by setting custom RDP properties. This article shows you how to set custom RDP properties on a host pool by using the Azure portal, Azure PowerShell, and Azure CLI. 

## Default host pool RDP properties

Host pools have the following RDP properties and values by default:

| RDP Property | Details |
|--|--|
| `audiomode:i:0` | Determines whether the local or remote machine plays audio. |
| `redirectclipboard:i:1` | Determines whether clipboard redirection is enabled. |
| `redirectcomports:i:1` | Determines whether COM (serial) ports on the local computer will be redirected and available in the remote session. |
| `enablecredsspsupport:i:1` | Determines whether the client will use the Credential Security Support Provider (CredSSP) for authentication if it's available. |
| `drivestoredirect:s:*` | Determines which disk drives on the local computer will be redirected and available in the remote session. |
| `redirectprinters:i:1` | Determines whether printers configured on the local computer will be redirected and available in the remote session. |
| `devicestoredirect:s:*` | Determines which devices on the local computer will be redirected and available in the remote session. |
| `use multimon:i:1` | Determines whether the remote session will use one or multiple displays from the local computer. Only applicable for desktop application groups. It's ignored for RemoteApp application groups. |
| `redirectsmartcards:i:1` | Determines whether smart card devices on the local computer will be redirected and available in the remote session. |
| `usbdevicestoredirect:s:*` | Determines which supported RemoteFX USB devices on the client computer will be redirected and available in the remote session when you connect to a remote session that supports RemoteFX USB redirection. |
| `videoplaybackmode:i:1` | Determines if the connection will use RDP-efficient multimedia streaming for video playback. |
| `redirectwebauthn:i:1` | Determines whether WebAuthn requests on the remote computer will be redirected to the local computer allowing the use of local authenticators (such as Windows Hello for Business and security key). |

For a full list of supported properties and values, see [Supported RDP properties with Azure Virtual Desktop](rdp-properties.md) 

> [!TIP]
> To learn more about redirecting peripherals and resources, see [Peripheral and resource redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md). You might need to configure more than just an RDP property.

## Prerequisites

Before you can set custom RDP properties on a host pool, you need: 

- An existing host pool.

- An Azure account assigned the [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor) role.

- If you want to use Azure CLI or Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension or the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

## Configure RDP properties

Select the relevant tab for your scenario.

### [Azure portal](#tab/portal)

To configure RDP properties using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry.

4. Select **Host pools**, then select the name of the host pool you want to update.

6. Select **RDP Properties**, then select the **Advanced** tab.

7. Add or make your changes to the RDP properties in a semicolon-separated format, like the default values already shown.

8. When you're done, select **Save** to save your changes. Users need to refresh their resources to receive the changes.

### [Azure PowerShell](#tab/powershell)

To configure RDP properties using Azure PowerShell, use the following examples. Be sure to change the `<placeholder>` values for your own. For a full list of supported properties and values, see [Supported RDP properties with Azure Virtual Desktop](rdp-properties.md) 

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

    ```powershell
    Get-AzWvdHostPool -ResourceGroupName $resourceGroup -Name $hostPool | FL Name, CustomRdpProperty
    ```

   The output should be similar to the following example:

   ```output
    Name              : contoso-hp01
    CustomRdpProperty : use multimon:i:1;redirectclipboard:i:0;redirectprinters:i:0;
   ```

### [Azure CLI](#tab/cli)

To configure RDP properties using Azure CLI, use the following examples. Be sure to change the `<placeholder>` values for your own. For a full list of supported properties and values, see [Supported RDP properties with Azure Virtual Desktop](rdp-properties.md) 

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Use one of the following examples based on your requirements:

   - To add custom RDP properties to a host pool and keep any existing custom properties already set, run the following commands. RDP properties need to be written in a semi-colon-separated format. This example adds disabling clipboard and printer redirection:

      ```azurecli
      currentCustomProperties=$(az desktopvirtualization hostpool show \
          --name <HostPoolName> \
          --resource-group <ResourceGroupName> \
          --query [customRdpProperty] \
          --output tsv)

TODO: FINISH THIS


      $hostPool = "<HostPoolName>"
      $resourceGroup = "<ResourceGroupName>"
      $addCustomProperties = "redirectclipboard:i:0;redirectprinters:i:0"

      $currentCustomProperties = (Get-AzWvdHostPool -Name $hostPool -ResourceGroupName $resourceGroup).CustomRdpProperty
      $customProperties = $currentCustomProperties + $addCustomProperties

      Update-AzWvdHostPool -Name $hostPool -ResourceGroupName $resourceGroup -CustomRdpProperty $customProperties


      ```
   
   - To replace all existing custom properties with a new set of custom RDP properties, run the following command. This example only sets disabling clipboard and printer redirection:

      ```azurecli
      az desktopvirtualization hostpool update \
          --name <HostPoolName> \
          --resource-group <ResourceGroupName> \
          --custom-rdp-property "redirectclipboard:i:0;redirectprinters:i:0"
      ```

   - To remove all custom RDP properties from a host pool, run the following command. This example passes an empty string to the `--custom-rdp-property` parameter:

      ```azurecli
      az desktopvirtualization hostpool update \
          --name <HostPoolName> \
          --resource-group <ResourceGroupName> \
          --custom-rdp-property ""
      ```


3. Check the custom RDP properties set on a host pool by running the following command:

   ```azurecli
   az desktopvirtualization hostpool show \
       --name <HostPoolName> \
       --resource-group <ResourceGroupName> \
       --query [customRdpProperty] \
       --output tsv
    ```

   The output should be similar to the following example:

   ```output
    Name              : contoso-hp01
    CustomRdpProperty : use multimon:i:1;redirectclipboard:i:0;redirectprinters:i:0;
   ```






















To edit custom RDP properties manually in Azure CLI:

### Add or edit multiple custom RDP properties

To add or edit multiple custom RDP properties in Azure CLI: 

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Run the following cmdlets by providing the custom RDP property:

    
    ```azurecli
    az desktopvirtualization hostpool update \
        --resource-group $resourceGroupName \
        --name $hostPoolName \
        --custom-rdp-property $rdpProperty
    ```

3. You can check to make sure the RDP property was added by running the following cmdlet:

    ```azurecli
    az desktopvirtualization hostpool show \
        --resource-group $resourceGroupName \
        --name $hostPoolName 
    ```
    
>[!IMPORTANT]
>- A null CustomRdpProperty field will apply all default RDP properties to your host pool. An empty CustomRdpProperty field won't apply any default RDP properties to your host pool.
    
### Remove all RDP properties

To remove all custom RDP properties: 

1. You can remove all custom RDP properties for a host pool by running the following Azure CLI cmdlet:

    ```azurecli
    az desktopvirtualization hostpool update \
        --resource-group $resourceGroupName \
        --name $hostPoolName \
        --custom-rdp-property ""
    ```

2. To make sure you've successfully removed the setting, enter this cmdlet:

    ```azurecli
    az desktopvirtualization hostpool show \
        --resource-group $resourceGroupName \
        --name $hostPoolName 
    ```


---


## Related content

- [Supported RDP properties with Azure Virtual Desktop](rdp-properties.md)
