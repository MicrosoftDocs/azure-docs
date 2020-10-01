---
title: 'Create an Intune profile for Azure VPN clients'
titleSuffix: Azure VPN Gateway
description: Learn how to create an Intune custom profile to deploy Azure VPN client profiles
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 09/15/2020
ms.author: cherylmc

---
# Create an Intune profile to deploy VPN client profiles

You can deploy profiles for Azure VPN clients (Windows 10) by using Microsoft Intune. This article helps you create an Intune profile using custom settings.

> [!NOTE]
> This method will only work for deploying profiles that use Azure Active Directory or a common certificate for client authentication. If unique client certificates are used, each user will have to select the correct certificate manually within the Azure VPN Client.
>

## Prerequisites

* Devices are already enrolled with Intune MDM.
* The Azure VPN Client for Windows 10 is already deployed on the client machine.
* Only Windows version 19H2 or higher is supported.

## <a name="xml"></a>Modify XML

In the following steps, we use a sample XML for a custom OMA-URI profile for Intune with the following settings:

* Auto-connect ON
* Trusted Network detection enabled.

For other supported options, see the [VPNv2 CSP](https://docs.microsoft.com/windows/client-management/mdm/vpnv2-csp) article.

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
1. Write down the value in the ```<name>  </name>``` tags. This is the name of the profile. You will need this name when you create the profile in Intune. Close the file and remember the location where it is saved.

## Create Intune profile

In this section, you create a Microsoft Intune profile with custom settings.

1. Sign in to Intune and navigate to **Devices -> Configuration profiles**. Select **+ Create profile**.

   :::image type="content" source="./media/create-profile-intune/configuration-profile.png" alt-text="Configuration profiles":::
1. For **Platform**, select **Windows 10 and later**. For **Profile**, select **Custom**. Then, select **Create**.
1. Give the profile a name and description, then select **Next**.
1. On the **Configuration settings** tab, select **Add**.

    * **Name:** Enter a name for the configuration.
    * **Description:** Optional description.
    * **OMA-URI:** ```./User/Vendor/MSFT/VPNv2/<name of your connection>/ProfileXML``` (this information can be found in the azurevpnconfig.xml file in the <name> </name> tag).
    * **Data type:** String (XML file).

   Select the folder icon and pick the file you saved in step 6 in the [XML](#xml) steps. Select **Add**.

   :::image type="content" source="./media/create-profile-intune/configuration-settings.png" alt-text="Configuration settings" lightbox="./media/create-profile-intune/configuration-settings.png":::
1. Select **Next**.
1. Under **Assignments**, select the group to which you want to push the configuration. Then, select **Next**.
1. Applicability rules are optional. Define any rules if needed, and then select **Next**.
1. On the **Review + create** page, select **Create**.

    :::image type="content" source="./media/create-profile-intune/create-profile.png" alt-text="Create profile":::
1. Your custom profile is now created. For the Microsoft Intune steps to deploy this profile, see [Assign user and device profiles](https://docs.microsoft.com/mem/intune/configuration/device-profile-assign).
 
## Next steps

For more information about point-to-site, see [About point-to-site](point-to-site-about.md).
