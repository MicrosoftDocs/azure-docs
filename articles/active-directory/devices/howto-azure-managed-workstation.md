---
title: Deploy Azure managed workstations - Azure Active Directory
description: Learn how to deploy secure Azure-managed workstations to reduce the risk of breach due to misconfiguration or compromise

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: conceptual
ms.date: 05/28/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: frasim

# Customer intent: As an administrator, I want to provide staff with secured workstations to reduce the risk of breach due to misconfiguration or compromise.

ms.collection: M365-identity-device-management
---
# Deploy a secure workstation

Now that you understand [Why securing workstation access is important?](concept-azure-managed-workstation.md) it is time to begin the process of deployment using the available tools. This guidance will use the defined profiles to create a workstation that is more secure from the start.

![Deployment of a secure workstation](./media/howto-azure-managed-workstation/deploying-secure-workstations.png)

Prior to deploying the solution, the profile that you will be using must be selected. It's important to note that you can apply any of the selected profiles and move to another by assigning the profile in Intune based on your requirement. Multiple profiles can be used simultaneously in a deployment, and assigned using tag's or group assignments.

| Profile | Low | Enhanced | High | Specialized | Secured | Isolated |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| User in Azure AD | Yes | Yes | Yes | Yes | Yes | Yes |
| Intune managed | Yes | Yes | Yes | Yes | Yes | Yes |
| Device Azure AD registered | Yes |  |  |  |  | |   |
| Device Azure AD joined |   | Yes | Yes | Yes | Yes | Yes |
| Intune security baseline applied |   | Yes <br> (Enhanced) | Yes <br> (HighSecurity) | Yes <br> (NCSC) | Yes <br> (Secured) |  NA |
| Hardware meets secure Windows 10 Standards |   | Yes | Yes | Yes | Yes | Yes |
| Microsoft Defender ATP enabled |   | Yes  | Yes | Yes | Yes | Yes |
| Removal of admin rights |   |   | Yes  | Yes | Yes | Yes |
| Deployment using Microsoft Autopilot |   |   | Yes  | Yes | Yes | Yes |
| Apps installed only by Intune |   |   |   | Yes | Yes |Yes |
| URLs restricted to approved list only |   |   |   | Yes | Yes |Yes |
| Internet (Inbound/outbound blocked) |   |   |   |  |  |Yes |

## License requirements

The concepts covered in this guide will assume Microsoft 365 Enterprise E5 or an equivalent SKU. Some of the recommendations in this guide can be implemented with lower SKUs. Additional information can be found on [Microsoft 365 Enterprise licensing](https://www.microsoft.com/licensing/product-licensing/microsoft-365-enterprise).

You may want to configure [group-based licensing](https://docs.microsoft.com/azure/active-directory/users-groups-roles/licensing-groups-assign) for your users to automate provisioning of licenses.

## Azure Active Directory configuration

Configuring your Azure Active Directory (Azure AD) directory, which will manage your users, groups, and devices for your administrator workstations requires that you enable identity services and features with an [administrator account](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles).

When you create the secured workstation administrator account, you are exposing the account to your current workstation. It is recommended you do this initial configuration and all global configuration from a known safe device. You can consider the guidance to [prevent malware infections](https://docs.microsoft.com/windows/security/threat-protection/intelligence/prevent-malware-infection) to reduce the risk of exposing first the first-time experience from attack.

Organizations should require multi-factor authentication, at least for their administrators. See [Deploy cloud-based MFA](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted) for implementation guidance.

### Azure AD users and groups

From the Azure portal, browse to **Azure Active Directory** > **Users** > **New user**. [Create your Secure Workstation user](https://docs.microsoft.com/Intune/quickstart-create-user), who will be your device administrator.

* **Name** - Secure Workstation Administrator
* **User name** - secure-ws-admin@identityitpro.com
* **Directory role** - **Limited administrator** and select the following administrative role
   * **Intune Administrator**
* **Create**

We will create two groups one for users of the workstations and one for the workstations themselves. From the Azure portal, browse to **Azure Active Directory** > **Groups** > **New group**

First group for workstation users. You may want to configure [group-based licensing](https://docs.microsoft.com/azure/active-directory/users-groups-roles/licensing-groups-assign) for the users in this group to automate provisioning of licenses to users.

* **Group type** - Security
* **Group name** - Secure Workstation Users
* **Membership type** - Assigned
* Add your secure workstation administrator user to the group
   * secure-ws-admin@identityitpro.com
* You can add any other users that will be managing secure workstations to the group
* **Create**

Second group for workstation devices.

* **Group type** - Security
* **Group name** - Secure Workstations
* **Membership type** - Assigned
* **Create**

### Azure AD device configuration

#### Specify who can join devices to Azure AD

Configure your Devices setting in Active Directory to allow your administrative security group to join devices to your domain. To configure this setting from the Azure portal, browse to **Azure Active Directory** > **Devices** > **Device settings**. Choose **Selected** under **Users may join devices to Azure AD** and select the "Secure Workstation Users" group.

#### Removal of local admin rights

As part of the rollout workstations users of the VIP, DevOps, and Secure level workstations will have no administrator rights on their machines. To configure this setting from the Azure portal, browse to **Azure Active Directory** > **Devices** > **Device settings**. Select **None** under **Additional local administrators on Azure AD joined devices**.

#### Require multi-factor authentication to join devices

To further strengthen the process of joining devices to Azure AD, browse to **Azure Active Directory** > **Devices** > **Device settings** choose **Yes** under **Require Multi-Factor Auth to join devices** then choose **Save**.

#### Configure MDM

From the Azure portal, browse to **Azure Active Directory** > **Mobility (MDM and MAM)** > **Microsoft Intune**. Change the setting **MDM user scope** to **All** and choose **Save** as we will allow any device to be managed by Intune in this scenario. More information can be found in the article [Intune Quickstart: Set up automatic enrollment for Windows 10 devices](https://docs.microsoft.com/Intune/quickstart-setup-auto-enrollment). We will create Intune configuration and compliance policies in a future step.

#### Azure AD conditional access

Azure AD conditional access can help keep these privileged administrative tasks on compliant devices. Users we have defined as members of the **Secure Workstation Users** group will be required to perform multi-factor authentication when signing in to cloud applications. We will follow the best practice guidance and exclude our emergency access accounts from the policy. Additional information can be found in the article [Manage emergency access accounts in Azure AD](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-emergency-access)

To configure conditional access from the Azure portal, browse to **Azure Active Directory** > **Conditional Access** > **New policy**.

* **Name** - Secure device required policy
* Assignments
   * **Users and groups**
      * Include - **Users and groups** - Select the **Secure Workstation Users** group created earlier
      * Exclude - **Users and groups** - Select your organization's emergency access accounts
   * **Cloud apps**
      * Include - **All cloud apps**
* Access controls
   * **Grant** - Select **Grant access** radio button
      * **Require multi-factor authentication**
      * **Require device to be marked as compliant**
      * For multiple controls - **Require all the selected controls**
* Enable policy - **On**

Organizations can optionally create policies to block countries where users would not access company resources. More information about IP location-based conditional access policies can be found in the article [What is the location condition in Azure Active Directory conditional access?](https://docs.microsoft.com/azure/active-directory/conditional-access/location-condition)

## Intune configuration

### Configure enrollment status

As outlined in the supply chain management, ensuring the secure workstation is a trusted clean device it's recommended that when purchasing new devices,  that devices be factory set to [Windows 10 Pro in S mode](https://docs.microsoft.com/Windows/deployment/Windows-10-pro-in-s-mode), which limits the exposure and vulnerabilities during supply chain management. Once a device is received from your supplier, the device will be removed from S mode using Autopilot. The following guidance provides details on applying the transformation process.

We want to ensure that devices are fully configured before use. Intune provides a means to **Block device use until all apps and profiles are installed**. 

1. From the **Azure portal** navigate to:
1. **Microsoft Intune** > **Device enrollment** > **Windows enrollment** > **Enrollment Status Page (Preview)** > **Default** > **Settings**.
1. Set **Show app profile installation progress** to **Yes**.
1. Set **Block device use until all apps and profiles are installed** to **Yes**.

### Create an Autopilot deployment profile

After creating a device group, you must create a deployment profile so that you can configure the Autopilot devices.

1. In Intune in the Azure portal, choose **Device enrollment** > **Windows enrollment** > **Deployment Profiles** > **Create Profile**.
1. For Name, enter **Secure workstation deployment profile**. For Description, enter **Deployment of secure workstations**.
1. Set Convert all targeted devices to Autopilot to Yes. This setting makes sure that all devices in the list get registered with the Autopilot deployment service.  Allow 48 hours for the registration to be processed.
1. For Deployment mode, choose **Self-Deploying (Preview)**. Devices with this profile are associated with the user enrolling the device. User credentials are required to enroll the device.
1. In the Join to Azure AD as box, **Azure AD joined** should be chosen and greyed out.
1. Select Out-of-box experience (OOBE), configure the following option and leave others set to the default, and then select **Ok**:
   1. User account type: **Standard**
1. Select **Create** to create the profile. The Autopilot deployment profile is now available to assign to devices.
1. Choose **Assignments** > **Assign to** > **Selected Groups**
   1. **Select groups to include** - Secure Workstation Users

### Configure Windows Update

One of the most important things an organization can do is keep Windows 10 up-to-date. In order to maintain Windows 10 in a secure state, we will deploy an update ring to manage the pace at which updates are applied to workstations. This configuration can be found in the **Azure portal** > **Microsoft Intune** > **Software updates** > **Windows 10 Update Rings**.

We will **Create** a new update ring with the following settings changed from the defaults.

* Name - **Azure managed workstation updates**
* Servicing channel - **Windows Insider - Fast**
* Quality update deferral (days) - **3**
* Feature update deferral period (days) - **3**
* Automatic update behavior - **Auto install and reboot without end-user control**
* Block user from pausing Windows updates - **Block**
* Require user's approval to restart outside of work hours - **Required**
* Allow user to restart (engaged restart) - **Required**
   * Transition users to engaged restart after an auto-restart (days) - **3**
   * Snooze engaged restart reminder (days) - **3**
   * Set deadline for pending restarts (days) - **3**

Click **Create** then on the **Assignments** tab add the **Secure Workstations** group as an included group.

Additional information about Windows Update policies can be found in [Policy CSP - Update](https://docs.microsoft.com/windows/client-management/mdm/policy-csp-update)

### Windows Defender ATP Intune integration

Windows Defender ATP and Microsoft Intune work together to help prevent security breaches, and help limit the impact of breaches. The capabilities will provide real-time detection. ATP will also provide our deployment extensive audit and logging of the end-point devices.

To configure Windows Defender ATP Intune integration in the Azure portal, browse to **Microsoft Intune** > **Device compliance** > **Windows Defender ATP**.

1. In step 1 under **Configuring Windows Defender ATP**, click **Connect Windows Defender ATP to Microsoft Intune in the Windows Defender Security Center​**.
1. In the Windows Defender Security Center:
   1. Select **Settings** > **Advanced features**
   1. For **Microsoft Intune connection**, choose **On**
   1. Select **Save preferences**
1. After a connection is established, return to Intune and click **Refresh** at the top.
1. Set **Connect Windows devices version 10.0.15063 and above to Windows Defender ATP** to **On**.
1. **Save**

Additional information can be found in the article [Windows Defender Advanced Threat Protection](https://docs.microsoft.com/Windows/security/threat-protection/windows-defender-atp/windows-defender-advanced-threat-protection).

### Completing hardening of the workstation profile

To successfully complete the hardening of the solution, download and execute the script based on the desired **profile level** from the following chart.

| Profile | Download location | Filename |
| --- | --- | --- |
| Low Security | N/A |  N/A |
| Enhanced Security | https://aka.ms/securedworkstationgit | Enhanced-Workstation-Windows10-(1809).ps1 |
| High Security  | https://aka.ms/securedworkstationgit | HighSecurityWorkstation-Windows10-(1809).ps1 |
| Specialized | https://github.com/pelarsen/IntunePowerShellAutomation | DeviceConfiguration_NCSC - Windows10 (1803) SecurityBaseline.ps1 |
| Specialized Compliance* | https://aka.ms/securedworkstationgit | DeviceCompliance_NCSC-Windows10(1803).ps1 |
| Secured | https://aka.ms/securedworkstationgit | Secure-Workstation-Windows10-(1809)-SecurityBaseline.ps1 |

Specialized Compliance* is a script that enforces the Specialized configuration provided in the NCSC Windows10 SecurityBaseline.

Once the selected script successfully executes, updates to the profiles and policies can be made in Microsoft Intune. The scripts for Enhanced and Secure profiles create policies and profiles for you but you must assign the policy to your **Secure Workstations** group.

* Intune device configuration profiles created by the scripts can be found in the **Azure portal** > **Microsoft Intune** > **Device configuration** > **Profiles**.
* Intune device compliance policies created by the scripts can be found in the **Azure portal** > **Microsoft Intune** > **Device Compliance** > **Policies**.

To review the changes you can also export the profiles, and applying changes to the export file as outlined in the SECCON documentation based on and additional hardening that is required.

Running the Intune data export script `DeviceConfiguration_Export.ps1` from the [DeviceConfiguration GiuHub repository](https://github.com/microsoftgraph/powershell-intune-samples/tree/master/DeviceConfiguration) will provide the current export of all of the existing Intune profiles.

## Additional configurations and hardening to consider

The guidance provided has enabled a secured workstation, additional controls should also be considered, such as alternate browsers access, outbound HTTP allowed and blocked websites, and the ability to run custom PowerShell script.

### Restrictive inbound, and outbound rules in firewall configuration service provider (CSP)

Additional management of both inbound, and outbound rules can be updated to reflect your permitted and blocked endpoints. As we continue to harden the secure workstation, we move the restriction to a deny all inbound and outbound as default, and add permitted sites for the outbound to reflect common and trusted web sites. The additional configuration information for the Firewall configuration service provider can be found in the article [Firewall CSP](https://docs.microsoft.com/Windows/client-management/mdm/firewall-csp).

Default restricted recommendations are:

* Deny All inbound
* Deny All outbound

The Spamhaus Project maintains a good list that organizations can use as a starting point for blocking sites known as [The Domain Block List (DBL)](https://www.spamhaus.org/dbl/).

### Managing local applications

Removing local applications, including the removal of productivity applications will move the secure workstation to a truly hardened state. In our example, we will add Chrome as the default browser and restrict the ability to modify the browser including plug-ins using Intune.

#### Deploy applications using Intune

In some situations, applications like the Google Chrome browser are required on the secured workstation. The following example provides instructions to install Chrome to devices in the security group **Secure Workstations** created earlier.

1. Download the offline installer [Chrome bundle for Windows 64‑bit](https://cloud.google.com/chrome-enterprise/browser/download/)
1. Extract the files and make note of the location of the `GoogleChromeStandaloneEnterprise64.msi` to install using Intune
1. In the **Azure portal** browse to **Microsoft Intune** > **Client apps** > **Apps** > **Add**
1. Under **App type**, choose **Line-of-business**
1. Under **App package file**, select the `GoogleChromeStandaloneEnterprise64.msi` from the extracted location and click **OK**
1. Under **App information**, provide a description and publisher and choose **OK**
1. Click **Add**
1. On the **Assignments** select **Available for enrolled devices** under **Assignment type**
1. Under **Included Groups**, add the **Secure Workstations** group created earlier
1. Click **OK** then **Save**

Additional guidance on configuring Chrome settings can be found in their support article [Manage Chrome Browser with Microsoft Intune](https://support.google.com/chrome/a/answer/9102677).

#### Configuring the company portal for custom apps

In a secured mode, installing applications will be restricted to the Intune company portal. However, installing the portal requires access to Microsoft Store. In our secured solution, we will make the portal available to all devices using an offline mode of the company portal.

Installing an Intune managed copy of the [Company Portal](https://docs.microsoft.com/Intune/store-apps-company-portal-app) will permit the ability to push down additional tools on demand to users of the secured workstations.

Some organizations may be required to install Windows 32-bit apps or apps that require other preparations to deploy. For these applications, the [Microsoft win32 content prep tool](https://github.com/Microsoft/Microsoft-Win32-Content-Prep-Tool) will provide a ready to use `.intunewin` format file for installation.

### Setting up custom settings using PowerShell

We will also use an example of using PowerShell to provide extensibility in managing the host. The script will set up a default background on the host. This capability is also available in profiles, and is only used to illustrate the capability.

In the solution there may be a need to set up some custom controls, and settings on secure workstations. In our example, we will change the background of the workstation using Powershell to be able to easily identify the device as a secure workstation ready for use. While our example will use PowerShell to complete this task, it can also be completed in the Azure portal.

Our example will use the following [free generic background image](https://i.imgur.com/OAJ28zO.png) and the [SetDesktopBackground.ps1](https://gallery.technet.microsoft.com/scriptcenter/Set-Desktop-Image-using-5430c9fb/) from the Microsoft Scripting Center to allow Windows to load the background on start.

1. Download the script to a local device
1. Update the customerXXXX, and the download location of the background you are looking to use in the script to reflect the background file, and folder that you would like the deployment to use. In our example, we replace customerXXXX to backgrounds.  
1. Browse to the **Azure portal** > **Microsoft Intune** > **Device configuration** > **PowerShell scripts** > **Add**
1. Provide a **Name** for the script and specify the **Script location** where you downloaded it to
1. Select **Configure**
   1. Set **Run this script using the logged on credentials**, to **Yes**
   1. Click **OK**
1. Click **Create**
1. Select **Assignments** > **Select groups**
   1. Add the security group **Secure Workstations** created earlier and click **Save**

### Using the preview: MDM Security Baseline for October 2018

Microsoft Intune has introduced security baseline management feature providing administrators a simple way to enforce a common baseline security posture. The baseline provides a similar means to achieve a locked down Enhanced profile workstation.

For the secure workstation, implementation this baseline is not used as it will conflict with the secure configuration deployment.

|   |   |   |
| :---: | :---: | :---: |
| Above Lock | Device Installation | Remote Desktop Services |
| App Runtime | Device Lock | Remote Management |
| Application Management | Event Log Service | Remote Procedure Call |
| Auto Play | Experience | Search |
| BitLocker | Exploit Guard | Smart Screen |
| Browser | File Explorer | System requirement|
| Connectivity | Internet Explorer | Wi-Fi |
| Credentials Delegation | Local Policies Security Options | Windows Connection Manager |
| Credentials UI | MS Security Guide | Windows Defender|
| Data Protection | MSS Legacy | Windows Ink Workspace |
| Device Guard | Power | Windows PowerShell |

More information about this preview feature can be found in the article [Windows security baseline settings for Intune](https://docs.microsoft.com/Intune/security-baseline-settings-windows).

## Enroll and validate your first device

1. To enroll your device, you need the following information:
   * **Serial number** - found on the device chassis
   * **Windows Product ID** - found under **System** > **About** from the Windows Settings menu.
   * Running [Get-WindowsAutoPilotInfo](https://aka.ms/Autopilotshell) will provide a CSV hash file for device enrollment with all of the required information. 
      * Run `Get-WindowsAutoPilotInfo – outputfile device1.csv` to output the information as a CSV file that can be imported in to Intune.

   > [!NOTE]
   > The script will require elevated rights and run as remote signed. You can use the following command to allow the script to run correctly. `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned`

   *  You can gather this information by signing in to a Windows 10 version 1809 or higher device to gather the information, or your hardware reseller can provide this information when ordering new devices.
1. Gather the required information and return to the **Azure portal**. Navigate to **Microsoft Intune** > **Device enrollment** > **Windows enrollment** > **Devices - Manage Windows Autopilot devices**, select **Import**, and choose the CSV file you created or were provided.
1. Add the now enrolled device to the security group **Secure Workstations** created earlier.
1. From the Windows 10 device you wish to configure, browse to **Windows Settings** > **Update & Security** > **Recovery**. Choose **Get started** under **Reset this PC** and follow the prompts to reset and reconfigure the device using the profile and compliance policies configured.

After the device has been configured, complete a review and check the configuration. Confirm the first device is configured correctly before continuing your deployment.

## Assignment and monitoring

Assigning device and users will require the mapping of the [selected profiles](https://docs.microsoft.com/intune/device-profile-assign) to your security group and all new users that will be given permission to the service will be required to be added to the security group as well.

Monitoring the profiles to can be done using the monitoring [Microsoft Intune profiles](https://docs.microsoft.com/intune/device-profile-monitor).

## Next steps

[Microsoft Intune](https://docs.microsoft.com/intune/index) documentation

[Azure AD](https://docs.microsoft.com/azure/active-directory/index) documentation