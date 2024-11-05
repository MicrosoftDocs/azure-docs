---
title: Configure location redirection over the Remote Desktop Protocol
description: Learn how to redirect location information from a local device to a remote session over the Remote Desktop Protocol. It applies to Azure Virtual Desktop, Windows 365, and Microsoft Dev Box.
ms.topic: how-to
zone_pivot_groups: rdp-products-features
author: dknappettmsft
ms.author: daknappe
ms.date: 07/09/2024
---

# Configure location redirection over the Remote Desktop Protocol

[!INCLUDE [include-rdp-shared-article](includes/include-rdp-shared-article.md)]

You can configure the redirection behavior of location information from a local device to a remote session over the Remote Desktop Protocol (RDP). A user's location can be important for some applications, such as mapping and regional services in browsers. Without redirecting location information, the location of a remote session is near the datacenter the user connects to for the remote session.

::: zone pivot="azure-virtual-desktop"
For Azure Virtual Desktop, location redirection must be configured at the following points. If any of these components aren't configured correctly, location redirection won't work as expected. You can use Microsoft Intune or Group Policy to configure your session hosts and the local device.

- Session host
- Host pool RDP property
- Local device

::: zone-end

::: zone pivot="windows-365"
For Windows 365, location services must be configured on the Cloud PC and the local device. If either of these components aren't configured correctly, location redirection won't work as expected. You can use Microsoft Intune or Group Policy to configure your Cloud PC and the local device. Windows 365 allows location redirection.
::: zone-end

::: zone pivot="dev-box"
For Microsoft Dev Box, location services must be configured on the dev box and the local device. If either of these components aren't configured correctly, location redirection won't work as expected. You can use Microsoft Intune or Group Policy to configure your dev box and the local device. Microsoft Dev Box allows location redirection.
::: zone-end

> [!IMPORTANT]
> Redirected longitude and latitude information is accurate to 1 meter. Horizontal accuracy is currently set at 10 kilometers, so applications that use the horizontal accuracy value might report that a precise location can't be determined.

This article provides information about the supported redirection methods and how to configure the redirection behavior for location information. To learn more about how redirection works, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

## Prerequisites

Before you can configure location redirection, you need:

::: zone pivot="azure-virtual-desktop"
- An existing host pool with session hosts running Windows 11 Enterprise or Windows 11 Enterprise multi-session version 22H2 or later.

- A Microsoft Entra ID account that is assigned the [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor) built-in role-based access control (RBAC) roles on the host pool as a minimum. 
::: zone-end

::: zone pivot="windows-365"
- An existing Cloud PC running Windows 11 Enterprise version 22H2 or later.
::: zone-end

::: zone pivot="dev-box"
- An existing dev box running Windows 11 Enterprise, version 22H2 or later.
::: zone-end

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

- You need to connect to a remote session from a supported app and platform. To view redirection support in Windows App and the Remote Desktop app, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

::: zone pivot="azure-virtual-desktop"
## Session host configuration

To configure a session host for location redirection, you need to enable and configure location services. You can do this using Microsoft Intune or Group Policy.

> [!IMPORTANT]
> If you use a multi-session edition of Windows, when you enable location services on a session host, it's enabled for all users. You can specify which apps can access location information on a per-user basis based on your requirements.

::: zone-end

::: zone pivot="windows-365"
## Cloud PC configuration

To configure a Cloud PC for location redirection, you need to enable and configure location services. You can do this using Microsoft Intune or Group Policy.
::: zone-end

::: zone pivot="dev-box"
## Dev box configuration

To configure a dev box for location redirection, you need to enable and configure location services. You can do this using Microsoft Intune or Group Policy.
::: zone-end

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To enable location services using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, select **System**. Check the box for **Allow Location**, then close the settings picker.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-intune-system.png" alt-text="A screenshot showing the device and resource redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-intune-system.png":::

1. Expand the **System** category, then from the drop-down menu select **Force Location On. All Location Privacy settings are toggled on and grayed out. Users cannot change the settings and all consent permissions will be automatically suppressed**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

1. You need to enable the location setting **Allow location override** for the location to be updated in the remote session, which you can do by configuring a registry value and is set per user. Users can still change this setting in Windows location settings.

   You can do this by creating a PowerShell script and using it as a [custom script remediation in Intune](/mem/intune/fundamentals/remediations). When you create the custom script remediation, you must set **Run this script using the logged-on credentials** to **Yes**.

   ```powershell
   try
   {
       New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\CPSS\Store\UserLocationOverridePrivacySetting" -Name Value -PropertyType DWORD -Value 1 -Force
       exit 0
   }
   catch{
       $errMsg = $_.Exception.Message
       Write-Error $errMsg
       exit 1
   }
   ```

1. Once you have made the changes, location services in the Windows Settings app should look similar to the following image:

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-location-intune.png" alt-text="A screenshot showing the location settings in the Windows Settings app." lightbox="media/redirection-remote-desktop-protocol/redirection-location-intune.png":::

# [Group Policy](#tab/group-policy)

To enable location services without Intune, you can use Group Policy to configure registry values. You can also configure location redirection using Group Policy. Configuring location services this way doesn't prevent users from changing its settings.

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Configure Group Policy Preferences to set the following registry values. To learn how to use Group Policy Preferences, see [Configure a Registry Item](/previous-versions/windows/it-pro/windows-server-2008-r2-and-2008/cc753092(v=ws.10)). You can specify which apps and services can use location services, based on your requirements.

   1. Enable **Location services** (this value needs to be set per device):

      - **Key**: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\location`
      - **Type**: `REG_SZ` (String value)
      - **Value name**: `Value`
      - **Value data**: `Allow`

   1. Enable **Allow location override** (this value needs to be set per user):

      - **Key**: `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\CPSS\Store\UserLocationOverridePrivacySetting`
      - **Type**: `REG_DWORD` (DWORD value)
      - **Value name**: `Value`
      - **Value data**: `1`

   1. Enable **Let apps access your location** (this value needs to be set per user):

      - **Key**: `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\location`
      - **Type**: `REG_SZ` (String value)
      - **Value name**: `Value`
      - **Value data**: `Allow`

   1. Enable **Let desktop apps access your location**, such as Microsoft Edge (this value needs to be set per user):

      - **Key**: `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\location\NonPackaged`
      - **Type**: `REG_SZ` (String value)
      - **Value name**: `Value`
      - **Value data**: `Allow`

   1. Enable individual Microsoft Store, MSIX, or Appx apps (this value needs to be set per user). Replace `<Package Family Name>` with the package family name of the app, for example `Microsoft.BingWeather_8wekyb3d8bbwe`. You can get a list of apps and their package family name using the [Get-AppxPackage](/powershell/module/appx/get-appxpackage) PowerShell cmdlet.

      - **Key**: `HKEY_CURRENT_USER\oftware\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\location\<Package Family Name>`
      - **Type**: `REG_SZ` (String value)
      - **Value name**: `Value`
      - **Value data**: `Allow`

1. Make sure that location redirection isn't blocked. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png" alt-text="A screenshot showing the device and resource redirection options in the Group Policy editor." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png":::

1. Double-click the policy setting **Do not allow location redirection** to open it. To allow location redirection, select **Disabled** or **Not configured**, then select **OK**.

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

---

::: zone pivot="azure-virtual-desktop"
### Host pool configuration

The Azure Virtual Desktop host pool setting *Location service redirection* controls whether to redirect location information from the local device to the remote session. The corresponding RDP property is `redirectlocation:i:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure location redirection using host pool RDP properties:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **Location service redirection**, select the drop-down list, then select **Enable location sharing from the local device and redirection to apps in the remote session**.

1. Select **Save**.

::: zone-end

## Local device configuration

You need to use a supported app and platform connect to a remote session and enable location services on a local device. How you achieve this depends on your requirements, the platform you're using, and whether the device is managed or unmanaged.

To view redirection support in Windows App and the Remote Desktop app, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

On Windows, you can enable location services in the Windows Settings app. For more information, see [Windows location service and privacy](https://support.microsoft.com/windows/windows-location-service-and-privacy-3a8eee0a-5b0b-dc07-eede-2a5ca1c49088). The steps in this article to enable location services in a remote session using Intune and Group Policy can also be applied to local Windows devices.

To enable location services on other platforms, refer to the relevent manufacturer's documentation.

## Test location redirection

::: zone pivot="azure-virtual-desktop"
Once you configure your session hosts, host pool RDP property, and local devices, you can test location redirection.
::: zone-end

::: zone pivot="windows-365"
Once you configure your Cloud PCs and local devices, you can test location redirection.
::: zone-end

::: zone pivot="dev-box"
Once you configure your dev boxes and local devices, you can test location redirection.
::: zone-end

To test location redirection:

1. Connect to a remote session using Window App or the Remote Desktop app on a platform that supports location redirection. For more information, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

1. Check the user's location information is available in the remote session. Here are some ways to check:

   1. Open a web browser and go to a website that uses location information, such as [Bing Maps](https://www.bing.com/maps). In Bing Maps, select the icon for the button **Locate me**. The website should show the user's location as the location of the local device.

   1. Open a PowerShell prompt in the remote session and run the following commands to get the latitude and longitude values. You can also run these commands on a local Windows device to check they are consistent.

      ```powershell
      Add-Type -AssemblyName System.Device
      $GeoCoordinateWatcher = New-Object System.Device.Location.GeoCoordinateWatcher
      $GeoCoordinateWatcher.Start()

      Start-Sleep -Milliseconds 500

      If ($GeoCoordinateWatcher.Permission -eq "Granted") {
          While ($GeoCoordinateWatcher.Status -ne "Ready") {
              Start-Sleep -Milliseconds 500
          }
          $GeoCoordinateWatcher.Position.Location | FL Latitude, Longitude
      } else {
          Write-Output "Desktop apps aren't allowed to access your location. Please enable access."
      }
      ```
      
      The output is similar to the following output:

      ```output
      Latitude           : 47.64354
      Longitude          : -122.13082
      ```

## Related content

[!INCLUDE [include-rdp-redirection-related-content](includes/include-rdp-redirection-related-content.md)]
