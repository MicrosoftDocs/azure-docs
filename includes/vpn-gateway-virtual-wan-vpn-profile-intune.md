---
 ms.topic: include
 author: cherylmc
 ms.service: vpn-gateway
 ms.date: 02/28/2023
 ms.author: cherylmc

# This include is used for both Virtual WAN and VPN Gateway articles. Any changes you make must apply address both services.
---

You can deploy profiles for Azure VPN clients (Windows 10 or later) by using Microsoft Intune. This article helps you create an Intune profile using custom settings.

> [!NOTE]
>* This article applies to deploying profiles that use Azure Active Directory for authentication only.


## Prerequisites

* Devices are already enrolled with Intune MDM.
* The Azure VPN Client for Windows 10 or later is already deployed on the client machine.
* Only Windows version 19H2 or higher is supported.

## <a name="xml"></a>Modify XML

In the following steps, we use a sample XML for a custom OMA-URI profile for Intune with the following settings:

* [Always On VPN](../articles/vpn-gateway/vpn-gateway-howto-always-on-user-tunnel.md) is configured.
* Trusted Network detection enabled.

For other supported options, see the [VPNv2 CSP](/windows/client-management/mdm/vpnv2-csp) article.

1. Download the VPN profile from the Azure portal and extract the *azurevpnconfig.xml* file from the package.
1. Copy and paste the text below into a new text editor file.

   ```xml-interactive
    <VPNProfile>
      <!--<EdpModeId>corp.contoso.com</EdpModeId>-->
      <RememberCredentials>true</RememberCredentials>
      <AlwaysOn>true</AlwaysOn>
      <TrustedNetworkDetection>contoso.com,test.corp.contoso.com</TrustedNetworkDetection>
      <DeviceTunnel>false</DeviceTunnel>
      <RegisterDNS>false</RegisterDNS>
      <PluginProfile>
        <ServerUrlList>azuregateway-7cee0077-d553-4323-87df-069c331f58cb-053dd0f6af02.vpn.azure.com</ServerUrlList> 
        <CustomConfiguration>

        </CustomConfiguration>
        <PluginPackageFamilyName>Microsoft.AzureVpn_8wekyb3d8bbwe</PluginPackageFamilyName>
      </PluginProfile>
    </VPNProfile>
   ```
1. Modify the entry between ```<ServerUrlList>``` and ```</ServerUrlList>``` with the entry from your downloaded profile (azurevpnconfig.xml). Change the "TrustedNetworkDetection" FQDN to fit your environment.
1. Open the Azure downloaded profile (azurevpnconfig.xml) and copy the entire contents to the clipboard by highlighting the text and pressing (ctrl) + C. 
1. Paste the copied text from the previous step into the file you created in step 2 between the ```<CustomConfiguration>  </CustomConfiguration>``` tags. Save the file with an xml extension.
1. Write down the value in the ```<name>  </name>``` tags. This is the name of the profile. You can also modify this value to something more meaningful, as it will be visible to the end users. You will need this name when you create the profile in Intune. Close the file and remember the location where it is saved.

## Create Intune profile

In this section, you create a Microsoft Intune profile with custom settings.

1. Sign in to Intune and navigate to **Devices -> Configuration profiles**. Select **+ Create profile**.
1. For **Platform**, select **Windows 10 and later**. For **Profile Type**, select **Templates** and **Custom**. Then, select **Create**.
1. Give the profile a name and description, then select **Next**.
1. On the **Configuration settings** tab, select **Add**.

    * **Name:** Enter a name for the configuration.
    * **Description:** Optional description.
    * **OMA-URI:** ```./User/Vendor/MSFT/VPNv2/<name of your connection>/ProfileXML``` (this information can be found in the azurevpnconfig.xml file in the \<name\> \</name\> tag). You can also use a different value for the name of your connection if desired.
    * **Data type:** String (XML file).

   Select the folder icon and pick the file you saved in step 6 in the [XML](#xml) steps. Select **Add**.

   :::image type="content" source="./media/vpn-gateway-virtual-wan-vpn-profile-intune/configuration-settings.png" alt-text="Configuration settings" lightbox="./media/vpn-gateway-virtual-wan-vpn-profile-intune/configuration-settings.png":::
1. Select **Next**.
1. Under **Assignments**, select the group to which you want to push the configuration. Then, select **Next**.
1. Applicability rules are optional. Define any rules if needed, and then select **Next**.
1. On the **Review + create** page, select **Create**.

    :::image type="content" source="./media/vpn-gateway-virtual-wan-vpn-profile-intune/create-profile.png" alt-text="Create profile":::
1. Your custom profile is now created. For the Microsoft Intune steps to deploy this profile, see [Assign user and device profiles](/mem/intune/configuration/device-profile-assign).
