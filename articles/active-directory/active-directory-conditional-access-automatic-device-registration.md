<properties
	pageTitle="Automatic device registration with Azure Active Directory for Windows Domain-Joined Devices| Microsoft Azure"
	description="IT admins can choose to have their domain-joined Windows devices to register automatically and silently with Azure Active Directory (Azure AD) ."
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="swadhwa"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/23/2016"
	ms.author="femila"/>

# Automatic device registration with Azure Active Directory for Windows domain-joined devices

As an IT Administrator, you can choose to automatically and silently register your domain-joined Windows devices with Azure Active Directory (Azure AD). This can be useful if you have configured device based conditional access polices to Office365 applications or applications managed on-premises by AD FS. You can learn more about the device registration scenarios by reading the [Azure Active Directory Device Registration Overview](active-directory-conditional-access-device-registration-overview.md).

Automatic Device Registration with Azure Active Directory is available for Windows 7 and Windows 8.1 machines that have been joined to an Active Directory domain. These are typically corporate owned machines that have been provided to information workers.

To begin registering your domain joined Windows devices with Azure AD, follow the prerequisites below. Once you complete the prerequisites, configure automatic device registration for your domain joined Windows devices.

## Prerequisites for Automatic device registration of domain joined Windows devices with Azure Active Directory

Deploy AD FS and connect to Azure Active Directory using Azure Active Directory Connect
----------------------------------------------------------------------------------------------
1. Use Azure Active Directory Connect to deploy Active Directory Federation Services (AD FS) with Windows Server 2012 R2 and set up a federation relationship with Azure Active Directory.
2. Configure an additional Azure Active Directory relying party trust claim rule.
3. Open the AD FS management console and navigate to **AD FS**>**Trust Relationships>Relying Party Trusts**. Right-click on the Microsoft Office 365 Identity Platform relying party trust object and select **Edit Claim Rules…**
4. On the **Issuance Transform Rules** tab, select **Add Rule**.
5. Select **Send Claims Using a Custom Rule** from the **Claim rule** template drop down box. Select **Next**.
6. Type *Auth Method Claim Rule* in the **Claim rule name:** text box.
7. Type the following claim rule in the **Claim rule:** text box:

        c:[Type == "http://schemas.microsoft.com/claims/authnmethodsreferences"]
        => issue(claim = c);

8. Click **OK** twice to complete the dialog box.

Configure an additional Azure Active Directory relying party trust Authentication Class Reference
-----------------------------------------------------------------------------------------------------
On your federation server, open a Windows PowerShell command window and type:


  `Set-AdfsRelyingPartyTrust -TargetName <RPObjectName> -AllowedAuthenticationClassReferences wiaormultiauthn`

Where <RPObjectName> is the relying party object name for your Azure Active Directory relying party trust object. This object is typically named Microsoft Office 365 Identity Platform.

AD FS Global Authentication Policy
-----------------------------------------------------------------------------
Configure the AD FS Global Primary Authentication Policy to allow Windows Integrated Authentication for the Intranet (this is the default).


Internet Explorer Configuration
------------------------------------------------------------------------------
Configure the following settings on Internet Explorer on your Windows devices for the Local intranet security zone:

- Don’t prompt for client certificate selection when only one certificate exists:  **Enable**
- Allow scripting:  **Enable**
- Automatic logon only in Intranet zone:  **Checked**

These are the default settings for the Internet Explorer Local intranet security zone. You can view or manage these settings in Internet Explorer by navigating to **Internet Options** > **Security** > Local intranet > Custom level. You can also configure these settings using Active Directory Group Policy.

Network Connectivity
-------------------------------------------------------------
Domain joined Windows devices must have connectivity to AD FS and an Active Directory Domain Controller to automatically register with Azure AD. This typically means the machine must be connected to the corporate network. This can include a wired connection, a Wi-Fi connection, DirectAccess, or VPN.

## Configure Azure Active Directory Device Registration discovery
Windows 7 and Windows 8.1 devices will discover the Device Registration Server by combining the user account name with a well-known Device Registration server name. You must create a DNS CNAME record that points to the A record associated with your Azure Active Directory Device Registration Service. The CNAME record must use the well-known prefix **enterpriseregistration** followed by the UPN suffix used by the user accounts at your organization. If your organization uses multiple UPN suffixes, multiple CNAME records must be created in DNS.

For example, if you use two UPN suffixes at your organization named @contoso.com and @region.contoso.com, you will create the following DNS records.

| Entry                                     | Type  | Address                            |
|-------------------------------------------|-------|------------------------------------|
| enterpriseregistration.contoso.com        | CNAME | enterpriseregistration.windows.net |
| enterpriseregistration.region.contoso.com | CNAME | enterpriseregistration.windows.net |

##Configure Automatic Device Registration for Windows 7 and Windows 8.1 domain joined devices

Configure Automatic Device Registration for your Windows 7 and Windows 8.1 domain joined devices using the links below. Be sure that you have completed the prerequisites above before you continue.

* [Configure Automatic Device Registration for Windows 8.1 domain joined devices](active-directory-conditional-access-automatic-device-registration-windows-8-1.md)

* [Configure Automatic Device Registration for Windows 7 domain joined devices](active-directory-conditional-access-automatic-device-registration-windows7.md)

* [Automatic device registration with Azure Active Directory for Windows 10 Domain-Joined Devices](active-directory-azureadjoin-devices-group-policy.md)

Additional Notes
--------------------------------------------------------------------

Device registration with Azure AD provides the broadest set of device capabilities. With Azure AD Device Registration, you can register both personal (BYOD) mobile devices and company owned, domain joined devices. The devices can be used with both hosted services such as Office365 and services managed on-premises with AD FS.

Companies that use both mobile and traditional devices or that use Office365, Azure AD, or other Microsoft services should register devices in Azure AD using the Azure AD Device Registration service.If your company does not use mobile devices and does not use any Microsoft services such as Office365, Azure AD, or Microsoft Intune and instead hosts only on-premises applications, you can choose to register devices in Active Directory using AD FS.

You can learn more about deploying device registration with AD FS [here](https://technet.microsoft.com/library/dn486831.aspx).

## Additional topics

- [Azure Active Directory Device Registration overview](active-directory-conditional-access-device-registration-overview.md)
- [Configure automatic device registration for Windows 7 domain joined devices](active-directory-conditional-access-automatic-device-registration-windows7.md)
- [Configure automatic device registration for Windows 8.1 domain joined devices](active-directory-conditional-access-automatic-device-registration-windows-8-1.md)
- [Automatic device registration with Azure Active Directory for Windows 10 domain-joined devices](active-directory-azureadjoin-devices-group-policy.md)
