---
title: Customize RDP properties - Azure
description: How to customize RDP Properties for Azure Virtual Desktop.
author: dknappettmsft
ms.topic: how-to
ms.date: 07/26/2022
ms.author: daknappe
ms.custom: devx-track-azurepowershell, docs_inherited
---
# Customize Remote Desktop Protocol (RDP) properties for a host pool

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/customize-rdp-properties-2019.md).

You can customize a host pool's Remote Desktop Protocol (RDP) properties, such as multi-monitor experience and audio redirection, to deliver an optimal experience for your users based on their needs. If you'd like to change the default RDP file properties, you can customize RDP properties in Azure Virtual Desktop by either using the Azure portal or by using the `-CustomRdpProperty` parameter in the `Update-AzWvdHostPool` cmdlet.

See [Supported RDP properties with Azure Virtual Desktop](rdp-properties.md) for a full list of supported properties and their default values.

## Default host pool RDP properties

RDP files have the following properties by default:

|Name  |RDP Property |Details  |
|---------|---------|---------|
|Audio output location | `audiomode:i:0`| Determines whether the local or remote machine plays audio.  |
| Clipboard redirection  | `redirectclipboard:i:1`   | Determines whether clipboard redirection is enabled.         |
| COM ports redirection   |  `redirectcomports:i:1`  | Determines whether COM (serial) ports on the local computer will be redirected and available in the remote session.  |
| Credential Security Support Provider  | `enablecredsspsupport:i:1`  |Determines whether the client will use the Credential Security Support Provider (CredSSP) for authentication if it's available. |
| Drive/storage redirection |`drivestoredirect:s:*`   |Determines which disk drives on the local computer will be redirected and available in the remote session.    |
|Printer redirection  |  `redirectprinters:i:1`        | Determines whether printers configured on the local computer will be redirected and available in the remote session.         |
| Media Transfer Protocol (MTP) and Picture Transfer Protocol (PTP)   |`devicestoredirect:s:*`  | Determines which devices on the local computer will be redirected and available in the remote session.   |
|Multiple displays	   | `use multimon:i:1`   | Determines whether the remote session will use one or multiple displays from the local computer.        |
| Smart card redirection	 |  `redirectsmartcards:i:1` | Determines whether smart card devices on the local computer will be redirected and available in the remote session.    |
|USB device redirection   |  `usbdevicestoredirect:s:*`  | Determines which supported RemoteFX USB devices on the client computer will be redirected and available in the remote session when you connect to a remote session that supports RemoteFX USB redirection.    |
|Video playback  |  `videoplaybackmode:i:1`  | Determines if the connection will use RDP-efficient multimedia streaming for video playback.   |
|WebAuthn redirection   | `redirectwebauthn:i:1` | Determines whether WebAuthn requests on the remote computer will be redirected to the local computer allowing the use of local authenticators (such as Windows Hello for Business and security key). |


>[!IMPORTANT]
>- Multi-monitor mode is only enabled for Desktop application groups and will be ignored for RemoteApp application groups.
>
>- All default RDP file properties are exposed in the Azure Portal.
>
>- A null CustomRdpProperty field will apply all default RDP properties to your host pool. An empty CustomRdpProperty field won't apply any default RDP properties to your host pool.
>
>- If you also configure device redirection settings using Group Policy objects (GPOs), the settings in the GPOs will override the RDP properties you specify on the host pool.

## Prerequisites

To customize a host pool's RDP properties, you need: 

- An Azure account assigned the [Desktop Virtualization Power On Off Contributor](rbac.md#desktop-virtualization-power-on-off-contributor) role.

- If you want to use Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).


## Configure RDP properties

### [Azure portal](#tab/portal)

To configure RDP properties in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Enter **Azure Virtual Desktop** into the search bar.

3. Under Services, select **Azure Virtual Desktop**.

4. At the Azure Virtual Desktop page, select **host pools** in the menu on the left side of the screen.

5. Select **the name of the host pool** you want to update.

6. Select **RDP Properties** in the menu on the left side of the screen.

7. Set the property you want.
   - Alternatively, you can open the **Advanced** tab and add your RDP properties in a semicolon-separated format like the PowerShell examples in the following sections.

8. When you're done, select **Save** to save your changes.



### [Azure PowerShell](#tab/powershell)

To edit custom RDP properties manually in PowerShell, use the following cmdlets. 

### Add or edit multiple custom RDP properties

To add or edit multiple custom RDP properties in PowerShell: 

2. Run the following PowerShell cmdlets by providing the custom RDP properties as a semicolon-separated string:

    ```powershell
    $properties="<property1>;<property2>;<property3>"
    Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -CustomRdpProperty $properties
    ```
    
    >[!NOTE]
    >The Azure Virtual Desktop service doesn't accept escape characters, such as semicolons or colons, as valid custom RDP property names.

3. You can check to make sure the RDP property was added by running the following cmdlet:

    ```powershell
    Get-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> | format-list Name, CustomRdpProperty
    
    Name              : <hostpoolname>
    CustomRdpProperty : <customRDPpropertystring>
    ```

Based on our earlier cmdlet example, if you set up multiple RDP properties on the 0301HP host pool, your cmdlet would look like this:

```powershell
Get-AzWvdHostPool -ResourceGroupName 0301rg -Name 0301hp | format-list Name, CustomRdpProperty

Name              : 0301HP
CustomRdpProperty : audiocapturemode:i:1;audiomode:i:0;
```


### Remove all RDP properties

To remove all custom RDP properties: 

1. You can remove all custom RDP properties for a host pool by running the following PowerShell cmdlet:

    ```powershell
    Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -CustomRdpProperty ""
    ```

2. To make sure you've successfully removed the setting, enter this cmdlet:

    ```powershell
    Get-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> | format-list Name, CustomRdpProperty
    
    Name              : <hostpoolname>
    CustomRdpProperty : <CustomRDPpropertystring>
    ```


### [Azure CLI](#tab/cli)

To edit custom RDP properties manually in Azure CLI:

### Add or edit multiple custom RDP properties

To add or edit multiple custom RDP properties in PowerShell: 

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
    
    
### Remove all RDP properties

To remove all custom RDP properties: 

1. You can remove all custom RDP properties for a host pool by running the following PowerShell cmdlet:

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


## Next steps

Now that you've customized the RDP properties for a given host pool, you can sign in to an Azure Virtual Desktop client to test them as part of a user session. These next how-to guides will tell you how to connect to a session using the client of your choice:

- [Connect with the Windows Desktop client](./users/connect-windows.md)
- [Connect with the web client](./users/connect-web.md)
- [Connect with the Android client](./users/connect-android-chrome-os.md)
- [Connect with the macOS client](./users/connect-macos.md)
- [Connect with the iOS client](./users/connect-ios-ipados.md)
