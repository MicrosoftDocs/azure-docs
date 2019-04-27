---
title: Creating secure admin workstations - Azure Active Directory
description: Learn how to secure workstations to reduce the risk of breach due to misconfiguration or compromise

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: conceptual
ms.date: 04/26/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jairoc

# Customer intent: As an administrator, I want to provide staff with secured workstations to reduce the risk of breach due to misconfiguration or compromise.

ms.collection: M365-identity-device-management
---
# Overview

The risk of your cloud service being compromised is an ever-growing concern. The attacks major organizations have experienced in recent years have frequently started by exploiting the weakest link and identifying methods to gain access to privileged resources. As documented in the [Verizon Threat report](https://enterprise.verizon.com/resources/reports/dbir/), privileged misuse is among the top 5 mechanisms used to breach organizations, and the 2nd most commonly detected tactic in incidents reported in 2018. Most attackers start with simple reconnaissance, often specific to an industry, and use the information collected to identify the best means to exfiltrate data.  This process is illustrated as [attack graphs, and attack trees(https://en.wikipedia.org/wiki/Attack_tree)], a frequently used tactic to find unprotected and poorly protected entry points and use them to find the assets they are looking for. Attackers will infiltrate devices that may seem low risk or undervalued for reconnaissance and use them to locate an opportunity for lateral movement to find high valued data and successfully exfiltrate information once they gain privileged user roles.  

![Typical compromise pattern](./media/secure-admin-workstations/typical-timeline.png)

This document provides a solution to help protect your most sensitive computing devices by isolating management and services to help protect against lateral movement or attack-graph-based attacks from less valuable productivity devices, providing this solution using first-class Azure, and Office service. The design helps reduce the ability to successfully execute a breach by breaking the chain prior and prevent infiltration of the device used to manage or access sensitive cloud resources.

Through this guidance the discussion of local Administrative rights will be reviewed as the control and security vs usability and user customizability is a pivotal risk that must be evaluated when deploying a secured workstation. The recommendation of the guidance will lean to an isolated and locked down client workstation that includes the removal of privileged local users such as Administrator rights on Windows operating system.

Deployment of the Secure workstation will also take advantage of the latest cloud-based technology built in Azure and Office to ensure the management of the service can be done effectively, reducing the risks of managing a complex solution. These technologies are implemented to provide administrators a defendable platform that can resists attack and protect your cloud services.

The core implementation will take advantage of software available Azure and Office with core functions of [Intune MDM technology](https://docs.microsoft.com/Intune/mam-faq) to provide an isolation model, Microsoft autopilot to help automate the supply chain management, Azure Active directory for identity management, and embedded Windows 10RS5 + technology to provide device attestations, and health management.

including:

* Intune for device management, including application and URL whitelisting
* Autopilot for device set up and deployment and refresh
* Azure AD for user isolation, user management, and conditional access 
* Windows 10 (current version) for device health attestation and user experience
* Microsoft Defender ATP for endpoint protection, detection, and response with cloud management 
* Azure AD PIM for managing authorization, including Just In Time (JIT) privileged access to resources

# Concepts

## Roles that should use a Secure Workstation

One of the most important aspects of protecting accounts is the protection of devices on which that account is used. An attacker who compromises a PC or device can do several things including impersonate all cached accounts, and use credentials, and tokens used on that device while they are logged on. This risk applies to all accounts on a compromised host, but is particularly important for privileged accounts whose illicit use would have a high potential impact such as administrators of on-premises and cloud systems, developer workstations for critical systems, social media accounts administrator with high exposure, and highly sensitive workstations like SWIFT payment terminals, workstations handling unpatented trade secrets, and similar.

Microsoft recommends implementing elevated security controls for the privileged workstations where these accounts are used to reduce risk (including [Office 365 Roadmap](https://aka.ms/o365secroadmap) and [Securing Privileged Access roadmap](https://aka.ms/sparoadmap)).

## Why dedicated workstations

While you can lower risk by adding security controls to workstations that have access to web browsing and email, providing the strongest assurances for sensitive accounts requires removing the large number of attack vectors that email and web browsing allow. This requires a dedicated workstation separate from standard productivity workstations where browsing and email communication is normally performed.  Removing web browsing and email can have a negative impact workstation productivity, but this is typically acceptable for scenarios where the job tasks don’t explicitly require it and risk of a security incident is extremely high.  

> [!NOTE]
> Web browsing here refers to general access to arbitrary websites, which is a high risk distinctly different from using a web browser to access a small number of well-known administrative websites for services like Azure, Office 365, Amazon, ServiceNow and the like.

Containment strategies provide increased security assurances by increasing the number and type of controls an adversary has to overcome in order to access sensitive assets. Microsoft has developed a model to provide containment of administrative privileges to assets (joined to an on premises active directory) using a tiered privilege model.

Throughout the guidance the following scenarios will be addressed to achieve a secured solution. These scenarios and user profiles reflect common users that can take advantage of the secure workstation, usability and risk balance. The guidance will provide configuration of settings based on the Intune security, NCSC, and [SECCON Framework](https://docs.microsoft.com/windows/security/threat-protection/windows-security-configuration-framework/windows-security-configuration-framework). These Hardening guides are used to illustrate a method in hardening Windows 10 and reducing the risks associated with device or user compromise using policy and technology to help manage security features and risks. The guidance will provide the steps required to achive the 5th level of hardening as a secured workstation.

![SECCON Levels](./media/secure-admin-workstations/SECCON-levels.png)

* Standard Workstation – A managed standard workstation provides a good starting point for most home, and simple business use. In this default managed Intune deployment, no profile, or policy is applied. The devices is registered, and monitored as an [Intune MDM device](https://docs.microsoft.com/Intune/windows-enroll), [Users are AD enrolled](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-get-started-premium), and managed. But no hardening has is performed.
* Enhanced Workstations– Is an entry level solution for basics of securing a Windows 10 workstation. All controls from the standard workstation are built on and the [Intune Security baselines](https://docs.microsoft.com/Intune/security-baselines) provided as an OOB experience that reduces the risk of the device being compromised.  The Enhanced workstation provide a secure means to ensure that users that require to work with customer data, and must actively do email and web browsing are performed is effectively on the front line and faces high exposure to many common cyberattacks. This workstation profile requires both uninterrupted productivity as well as strong security for common phishing and web based attack vectors, as detailed with the [highly secure Windows 10 device](http://aka.ms/HighSecWin10).
   * The [Intune Security baseline](https://docs.microsoft.com/Intune/security-baselines) is applied to the host in the default profile.
* VIP Workstation – Organizational VIP’s reflect the next high-risk user in an organization. VIP’s can reflect executives, as well as high profile users that may occasionally have contact with sensitive data such as payroll, or approval of services, and processes. The user profile demands a higher controlled environment while still being able to perform their productivity activity, such as mail, browsing and expect the experience to be simple to use. The users will expect features such as cookies, favorites, and other shortcuts available to operate. However these users do not require the ability to modify their device, and will not install drivers, develop code, or write scripts. 
   * We apply the enhanced workstation baseline as a starting point.
   * Technology such as Application control, Application Guard, Credential guard, device guard, and exploit guard are enabled through ATP, and Defender in Windows 10 (RS5). Additionally, the device will be granted the ability to install applications. And applications will be provided using the Intune installer. No URL restrictions are applied.
   * Removal of the local administrator –
      * Who has administrative rights to these privileged workstations?
      * This is a key risk point that requires careful consideration as the granting administrative rights on these privileged workstations grants access (via attack tools) to those accounts. For this reason, we strongly recommend minimizing administrative rights as much as possible (zero ideally) to minimize risk to the organization.
      * https://docs.microsoft.com/Windows-server/identity/securing-privileged-access/securing-privileged-access-reference-material 
      * https://docs.microsoft.com/Windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models
      * Workstation Administration/Support - Most support and maintenance tasks should be performed using the cloud management tools configured in this guidance.
      * Daily User Administrative Access – To reduce risk of the device and its security controls from being compromised, the default recommendation is for the users of the workstation to operate with standard user privileges rather than local administrator privileges. This isn’t always possible in all use cases.
   * The [Intune Security baseline](https://docs.microsoft.com/Intune/security-baselines) is applied to the host in the default profile.
* DevOps Workstations –– Developers and testers are an attractive target to attackers as these roles can alter systems of interest to the attackers. This is especially important for applications with internet access and business critical systems with sensitive data, that process financial transactions, and critical business functions where downtime can be very expensive. high value assets (sometimes referred to as “toxic” data because of the damage to the business if released). This could include SWIFT payment terminals or operations technology SCADA/ICS that blends chemicals for food, drugs, construction materials, or medical supplies.
   * Technology such as Application control, Application Guard, Credential guard, device guard, and exploit guard are enabled through ATP, and Defender in Windows 10 (RS5). Additionally, applications are managed and installed by Intune, URL’s restricted with blacklist, and whitelists, and the device has no local administrator. The Host is supply chain controlled with Windows autopilot.
   * The [NSCS UK’s National Cyber Security Centre (NCSC) baseline provided by Per Larsen](https://github.com/PerLarsen1975/IntunePowerShellAutomation/blob/master/DeviceConfiguration_NCSC - Windows10 (1803) SecurityBaseline.ps1) is applied to the hosts locking down critical  services, and policies on the host.
* Secured Workstation – An attacker who can compromise an administrative account can typically cause significant business damage by data theft, data alteration, or service disruption. In this hardened state the workstation will enable all the security controls and policies described in the content.  
   * Technology such as Application control, Application Guard, Crediential guard, device guard, and exploit guard are enabled through ATP, and Defender in Windows 10 (RS5). Additionally, the device has no local apps that are managed and installed by Intune, URL’s are authorized (default deny all is enabled)
   * The workstation has no local administrator. The Host is supply chain controlled with Windows Autopilot (using a Windows 10S mode device, which is converted to Windows 10 enterprise is recommended and guidance provided.)
   * A custom baseline using the Intune security baseline as a start, with the NCSC baseline with added controls taken from the [SECCON security level 3](https://docs.microsoft.com/windows/security/threat-protection/windows-security-configuration-framework/windows-security-configuration-framework) are applied to harden the host and it’s local policies.

![Secured workstation](./media/outline/secure-workstation.png)

# Deploying a secure workstation

![Deployment of a secure workstation](./media/secure-admin-workstations/deploying-secure-workstations.png)

## License Requirements

The concepts covered in this guide will assume Microsoft 365 Enterprise E5 or an equivalent SKU. Some of the recommendations in this guide can be implemented with lower SKUs. Additional information can be found on [Microsoft 365 Enterprise licensing](https://www.microsoft.com/licensing/product-licensing/microsoft-365-enterprise).

## Setting up Azure Active Directory

Configuring the Azure Active Directory tenant which will manage your users, groups, and devices for your administrator’s workstation requires that you enable identity services and features with an [administrator account](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles).

When you create the secured workstation administrator account, you are exposing the account to your current workstation. It is strongly recommended you do this initial configuration and all global configuration from a known safe device. You can consider the guidance to [prevent malware infections](https://docs.microsoft.com/windows/security/threat-protection/intelligence/prevent-malware-infection) to reduce the risk of exposing first the first time experience from attack.

Organizations should require multi-factor authentication, at least for their administrators. See [Deploy cloud-based MFA](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted) for implementation guidance.

## Setting up Intune Users and Groups for Secure Administrator

Your Intune subscription will be associated with your Default directory, and the Azure Active directory administrator will be provisioned as the primary member.

Select Microsoft Intune, User All users – user. [Create your Secure Workstation user](https://docs.microsoft.com/Intune/quickstart-create-user), who will be your device Administrator. In this documentation the user will be named ‘Secure Workstation Administrator’, user name ‘securews’

* The user will require to be added to the directory role of ‘Limited administrator’ to be able to create users, groups and add secured workstation devices, and policies to the domain.

[Create a group](https://docs.microsoft.com/Intune/quickstart-create-group) Microsoft Intune, Groups – All Groups. Select group type ‘Security’.

* Group name ‘securedws’
* Select membership type, as ‘assigned’. However the dynamic users can be configured if the correct policies are applied to the group.
* Add your secure workstation administrator user to the group.
* You can all add all the users that will be managing secure workstations to the newly create group.

Set up Windows 10 enrollment which will allow for your new workstation to be joined to the new group securedws group for selected devices. Follow the steps outlined on the [Intune Quickstart: Set up automatic enrollment for Windows 10 devices](https://docs.microsoft.com/Intune/quickstart-setup-auto-enrollment).

Configure your Devices setting in Active Directory to allow your administrative security group to join devices to your domain. This can be set Azure Active Directory - Devices - Device Settings

Configure your autopilot [enroll device](https://docs.microsoft.com/Intune/tutorial-use-autopilot-enroll-devices) for your secure workstations. The following elements should be addressed.

Configure your MDM Active Directory – Configure

Select some, and select the securedws group. 

Configure the Windows Enrollment settings to block devices to be used until the profiles and apps are installed.

## Create an Autopilot deployment profile

After creating a device group, you must create a deployment profile so that you can configure the Autopilot devices.

### Selecting your MDM authority

For a secure workstation we will select that Intune MDM is the authority. Learn more about [choosing your MDM Authority](https://go.microsoft.com/fwlink/?linkid=844064).

## Windows Hello for Business

Configuring Windows hello for business will provide your secured devices two factor authentication. The Device enrollment - Windows enrollment - Windows Hello for Business – properties.  Configuration requires that  Hello for business is ‘enabled’ and default settings should require pin length of 6, with a pin expiration to be every 3 months. ‘remember pin history’ should be set to yes. And enhanced anti-spoofing should be set to yes. ‘Allow phone sign-in’ (set to yes) will provide your users a self-service management of device pin’s. 

1. In Intune in the Azure portal, choose Device enrollment > Windows enrollment > Deployment Profiles > Create Profile.
1. For Name, enter Secureworkstations. For Description, enter deployment of secure workstations.
1. Set Convert all targeted devices to Autopilot to Yes. This setting makes sure that all devices in the list get registered with the Autopilot deployment service.  Allow 48 hours for the registration to be processed.
1. For Deployment mode, choose Self-Deployed. Devices with this profile are associated with the user enrolling the device. User credentials are required to enroll the device.
1. In the Join to Azure AD as box, choose Azure AD joined.
1. Choose Out-of-box experience (OOBE), configure the following options and leave others set to the default, and then choose Save:
   * End-user license agreement (EULA): Hide
   * Privacy settings: Show
   * User account type: Standard
1. Choose Create to create the profile. The Autopilot deployment profile is now available to assign to devices.
1. Choose Device enrollment > Windows enrollment > Deployment Profiles > Assignments
   * Selected Group > securedws

Additional reading for configuring Windows autopilot

* https://docs.microsoft.com/en-us/Windows/deployment/Windows-autopilot/Windows-autopilot
* https://docs.microsoft.com/en-us/Windows/deployment/Windows-autopilot/administer 

## Enable a secure device baseline

For the use of this guidance Windows version 1809 of Windows 10 will be required for the use of ATP, Intune client, and Windows Threat protection. To find your Windows version follow the guidance outlined in the article [Enroll your first Windows 10 device](https://docs.microsoft.com/Intune/quickstart-enroll-windows-device).

Additionally the [Intune secure baseline](https://docs.microsoft.com/Intune/security-baseline-settings-Windows) will be enabled to lock the device down and provide a secured workstation.

This includes managing the following categories:

Above Lock	Device Installation	Remote Desktop Services
App Runtime	Device Lock	Remote Management
Application Management	Event Log Service	Remote Procedure Call
Auto Play	Experience	Search
Bitlocker	Exploit Guard	Smart Screen
Browser	File Explorer	System
Connectivity	Internet Explorer	Wi-Fi
Credentials Delegation	Local Policies Security Options	Windows Connection Manager
Credentials UI	MS Security Guide	Windows Defender
Data Protection	MSS Legacy	Windows Ink Workspace
Device Guard	Power	Windows PowerShell

### Create a baseline profile (using Security baselines)

Provide the baseline starting point giving it a name, here we use SecuredWS1, which we will use as a starting point for device enforcement.

For the initial setup we will implement the baseline, and apply additional constraints in policies.

Assign the securedws security group, and commit the changes with save+deploy

## Enabling Windows Defender Advanced Threat Protection (ATP), and jailbreak prevention

## Auditing and Logging of devices

In the deployed solution we will rely on the configured ATP audit policies, and notifications that we enable with ATP enforcement. This design will not explore additional auditing, and monitoring outside of [ATP monitoring, and auditing capabilities](https://docs.microsoft.com/azure-advanced-threat-protection/atp-advanced-audit-policy).

This feature is called "compliance policies". Compliance policies define the rules and settings that users and devices must meet to be compliant. We will require the following configurations:

* Use a password to access organizational data on mobile devices
* The device isn't jail-broken or rooted
* A minimum operating system version on the device
* The device to be at, or under a threat level

We will be requiring devices to be compliant, with no ability to be used if core compliant services are altered.

In Microsoft Intune Device compliance - Compliance policy settings we will enable the ability to validate compliant devices, and enable the Enhanced jailbreak detection with a validation no longer than 10 days.

### ATP protection

Windows Defender Advanced Threat Protection (ATP) and Microsoft Intune work together to help prevent security breaches, and help limit the impact of breaches. The capabilities will provide real time detection. ATP will also provide our deployment extensive audit and logging of the end point devices.

1. Select All services, filter on Intune, and select Microsoft Intune.
1. Select Device compliance > Windows Defender ATP > Open the Windows Defender Security Center.

Configuring Windows Defender ATP

1. Setup a connection to Intune via the Windows Defender Security Center:
   * [Connect Windows Defender ATP to Microsoft Intune in the Windows Defender Security Center](https://securitycenter.windows.com/preferences2/integration)
1. After a connection is established, click "Refresh" at the top of this section to hide this guide and continue to enable the settings below.
1. In the Windows Defender Security Center:
   * Select Settings > Advanced features.
   * For Microsoft Intune connection, choose On:
   * Select Save preferences.
1. Go back to Intune, Device compliance > Windows Defender ATP. Set Connect Windows devices version 10.0.15063 and above to Windows Defender ATP to On.
1. Select Save.

Windows Defender Advanced Threat Protection (ATP) - https://docs.microsoft.com/Windows/security/threat-protection/
Enable Windows Defender ATP - https://docs.microsoft.com/Windows/security/threat-protection/Windows-defender-atp/Windows-defender-advanced-threat-protection

## Completing hardening of the workstation profile

To successfully harden the secured workstation we will configure the installation by implementing the PowerShell SDK, and device configuration from JSON scripts to import configurations based on the SECCON 3 controls.

Additionally, the following configuration will be required to be enabled for the SECCON controls. Will be done using Intune PowerShell sdk https://github.com/Microsoft/Intune-PowerShell-SDK and Intune scripts import scripts created by Dave Falkus. These will require that you configure your Intune consent, and [compliance manager](https://docs.microsoft.com/office365/securitycompliance/permissions-in-the-security-and-compliance-center) to allow for users to export and import configurations using PowerShell.

The modules can be loaded using following command.

``` PowerShell
Install-Module -Name Microsoft.Graph.Intune
```

We will also require the scripts consent to operate `Connect-MSGraph -AdminConsent`

In our solution we will implement categories to appropriate Intune profiles.

The configuration can be done by exporting the current baseline, and applying changes to the export file as outlined in the SECCON documentation based on the profiles hardening that is required. Each hardening level will restrict and harden the workstation.

Running the Intune data export script `DeviceConfiguration_Export.ps1` from the [DeviceConfiguration GiuHub repository](https://github.com/microsoftgraph/powershell-intune-samples/tree/master/DeviceConfiguration) will provide the current export of all the of Intune existing profiles.

The exported JSON files can be updated for the SECCON 3 and the following categories be addressed in including:

* Security template policies
* Windows Defender Policies
* Computer Policies
* Windows Antivirus Policies
* User Policies
* IE Computer policies
* LAPS
* Computer Policies
* Services (restriction)

After the policy files are configured to the appropriate SECCON level the configuration file can be imported to Intune using `DeviceConfiguration_Import_FromJSON.ps1` from the [DeviceConfiguration GiuHub repository](https://github.com/microsoftgraph/powershell-intune-samples/tree/master/DeviceConfiguration).

We have selected not to implement the Advanced Audit policies, as advanced threat protection (ATP) will provide the required auditing and reporting.

## Removal of local admin rights

One of the last steps in moving devices to a secure mode is to remove the local administrator rights, and enforce a user only mode on the devices. The update requires to make the following changes https://docs.microsoft.com/azure/active-directory/devices/assign-local-admin

## Restrictive inbound, and outbound rules in Firewall configuration service provider (CSP)

Additional management of both inbound, and outbound rules can be updated to reflect your permitted and blocked endpoints. As we continue to harden the secure workstation, we move the restriction to a deny all inbound and outbound as default, and add permitted sites for the outbound to reflect common and trusted web sites. The configuration of the CSP can be found at https://docs.microsoft.com/Windows/client-management/mdm/firewall-csp.

Default restricted recommendation are:

* Deny All inbound
* *Deny All outbound

Permitted site list added to outbound.

* https://www.spamhaus.org/whitelist/ (WAS A BETA AND HAS BEEN TAKEN DOWN)

## Limiting and removing local applications

Removing all application, including the removal of productivity applications will require the process to move the secure workstation to a truly hardened state. In our example we will add Chrome as the default browser, restrict ability to modify the browser including plug ins. We will also use an example of using PowerShell to provide extensibility in managing the lock down of the host. The script will set up a default background on the host. This capability is also available in profiles, and is only used to illustrate the capability.

## Setting up custom security settings using PowerShell

In the solution there will be a need to set up custom controls, and setting on a Secure workstation. In our example we will change the background of the workstation to be able to easily identify the device as a secure and ready for use. The following configuration will set up a background that will allow anyone logging in to the host to identify it as a secured workstation. – This action is also available in Device configuration – Profiles Device Restrictions – Properties - Device restrictions – Personalization – Configure background.
To deploy the background we will use a PowerShell script and Intune configurations.
For the sample we will use a [free simple background image](https://i.imgur.com/OAJ28zO.png).
Microsoft scripting center provides the script [SetDesktopBackground.ps1](https://gallery.technet.microsoft.com/scriptcenter/Set-Desktop-Image-using-5430c9fb/) that will be used to allow Windows to load the background on start.

1. Download the script to a local device
1. Update the customerXXXX, and the download location of the background you are looking to use in the script to reflect a the background file, and folder that you would like the deployment to use. In our example we replace customerXXXX to backgrounds.  
1. In the Azure portal under  - Microsoft Intune - Device configuration - PowerShell scripts
1. Upload the updated PowerShell script by clicking “Add”.
1. Provide a name for the script and click “browse” select the script.
1. Select configure, and set Run this script using the logged on credentials, to yes
1. Select create
1. Select assignment
1. Add the security group securedws
1. D
1. 
1. 
1. 
1. Wait for the changes to be applied to the users desktop.
1. You can also monitor the progress under the device configuration in Microsoft Intune.

## Deploy Chrome and whitelist/blacklist access

In several situations Chrome browser is required in the secured workstations. The following instruction provide details to enable Chrome in the securedwe security group.

Deploying Chrome https://www.ntweekly.com/2018/12/21/deploy-google-chrome-with-microsoft-Intune-to-Windows-10-machines/

Configuring and lock Chrome down https://support.google.com/chrome/a/answer/9102677?hl=en

## Enroll your first device

Add devices (Laptop) to Intune – You will have to have a Windows version 1809 built laptop , and require to log in locally to create the initial CSV hash of the device - serial-number, Windows-product-id, hardware-hash, optional-order-id required.  file for the devices that will participate in the program. These devices once enrolled will provide the starting point for your secured access program.

* Serial-number will be found on the device chassis
* Windows product hardware id can be found Windows – Setting - About in the device specifications.
* Running [Get-WindowsAutoPilotInfo](https://aka.ms/Autopilotshell) will provide the CSV hash file for device enrollment, and serial number. Running the `Get-Windowsautopilotinfo – outputfile device1.csv`

NOTE – the script will require elevated rights and run as unsigned. You can use the following to allow the script to run correctly. `Set-ExecutionPolicy -ExecutionPolicy Remotesigned`

Go to Azure portal - All services - Intune - Device Enrollment – Windows Enrollment -Windows autopilot devices select Import the .csv file you have created.

* Add the enrolled device (Laptop) to your security group securedws.

From the Windows device (laptop) In devices settings – Reset this PC select Get started and follow the prompts.

## Validate your secured device

At this point we can review the enrolled device and check it’s configuration which will be the selected default security baseline.

The device should have enabled basic user protections that will enable a secured platform. The enhancement of the device includes

## Configuring Conditional Access to your Cloud Services

Azure Active Directory can be configured to restrict management of your cloud service to ONLY allow secure workstations access this conditional access will ensure that your secured workstations are the only devices managing your cloud services. This will assure that users and devices are validated, and compliant before contact with any management processes.

Deploying conditional access is outlined in the conditional-access guidance. We will configure the service to only allow for the devices we have provisioned to make any management to users and devices in our ‘secure-ws’ security group.

Enable your conditional access in Microsoft Intune - Conditional Access Policies – New Policy 

We will add the ‘secure device required policy’. And configure the following settings. 

Set cloud apps to – All cloud Apps.

Set User and groups – select securews

We implement the device state to validate that only compliant devices can be used to manage cloud service.. 

Additionally, you can add location based conditional access. Setting the location in Intune will provide the trusted locations for the conditional access.

Location

## Additional Configuration to consider for system hardening

## Autodeployment of new devices

When purchasing new devices, it is recommended that devices be factory set to [Windows 10S mode](https://docs.microsoft.com/Windows/deployment/Windows-10-pro-in-s-mode), which limits the exposure and vulnerabilities during supply chain management. Once a device is received from your supplier the device will be moved from S mode to Full using Intune autopilot capabilities. The following guidance provides details on applying the transformation process.

## Additional tasks once the Secure workstation is configured

Assigning device and users will require the mapping of the [selected profiles](https://docs.microsoft.com/intune/device-profile-assign) to your security group ‘securedsg’ and all new users that will be given permission to the service will be required to be added to the security group as well.

Monitoring the profiles to can be done using the monitoring [Microsoft Intune profiles](https://docs.microsoft.com/intune/device-profile-monitor).

Configuring the company portal for custom apps

In a secured mode installing applications will be restricted to the Intune company portal. However, installing the portal requires access to Microsoft Store. In the case of our secured solution we will make the portal available to all devices using an offline mode of the company portal.

Installing an Intune managed copy of the [Company Portal](https://docs.microsoft.com/en-us/Intune/store-apps-company-portal-app) will permit the ability to push down additional tools on demand to users of the secured workstations.

Finally, some organizations may be required to install win32 apps or apps that require other preparations to deploy. For these the [Microsoft win32 content prep tool](https://github.com/Microsoft/Microsoft-Win32-Content-Prep-Tool) will provide a ready to use .intunewin format file for installation.
