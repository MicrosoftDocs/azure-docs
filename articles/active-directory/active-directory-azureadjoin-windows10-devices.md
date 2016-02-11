<properties
	pageTitle="Using Windows 10 devices in your workplace | Microsoft Azure"
	description="Provides a snapshot of capabilities users and IT get, contrasting the different ways a device can be provisioned and used in an enterprise with Windows 10."
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="stevenpo"
	editor=""
	tags="azure-classic-portal"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/19/2015"
	ms.author="femila"/>

# Using Windows 10 devices in your workplace

Windows 10 offers three models for organizations that enable users to access work resources in a secure and convenient way.

- **Azure AD Join**, new in Windows 10, which is a self-service work provisioning experience targeted for workers who access resources such as Office 365 primarily in the cloud.
- **Domain join**, better in Windows 10 when connected to Azure AD, for organizations that have investments in on-premises apps and resources.
- **A new simplified BYOD experience** that allows users to add a work account or school to Windows to easily access resources on personal devices.

The following table presents a snapshot of capabilities that users and IT professionals get, contrasting the different ways a device can be provisioned and used in an enterprise with Windows 10:

|                                                                                                                                                                 | Domain join     | Azure AD Join | Personal device |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|---------------|-----------------|
| Windows device sign-in using work or school accounts                                                                                                                      | Yes             | Yes           | No              |
| User single-sign-on (SSO) to Office365 and Azure AD apps. SSO is the ability to access company resources without entering credentials again after signing-in once. | Yes             | Yes           | Yes             |
| User SSO to Kerberos/NTLM apps                                                                                                                                  | Yes             | Limited       | Via VPN         |
| Strong authorization and convenient sign-in for a work or school accounts with Microsoft Passport and Windows Hello                                                                   | Yes             | Yes           | Yes             |
| Access to enterprise Windows Store using a work or school account (not a Microsoft Account)                                                                                    | Yes             | Yes           | Yes             |
| Enterprise-compliant roaming of user settings across devices by using a work or school account                                                                                 | Yes             | Yes           | Yes             |
| Access to organizational apps restricted to devices that are compliant with organizational device policies                                                               | Yes             | Yes           | Yes             |
| User self-service provisioning of devices so  the can work from anywhere                                                                                                | No              | Yes           | Yes             |
| Ability to manage devices                                                                                                                                       | Yes via GP/SCCM | Yes           | Yes             |

## Work-owned devices: Azure AD Join and domain join

Windows 10 offers two Ways for work-owned devices to access work resources:

- Azure AD Join
- Domain join

 Both are valid options depending on an organization's needs and requirements. In some cases, organizations might benefit from enabling both methods of deployment.

## When to use Azure Active Directory Join

Azure Active Directory Join (Azure AD Join) is a new self-service work provisioning experience in Windows 10.  It is targeted at workers who access work resources such as Office 365  primarily in the cloud. It is a lightweight way to configure computers, tablets, and phones for the enterprise. Devices are managed via mobile device management, using consistent controls across Windows platforms.

**Use Azure AD Join for any of these reasons**:

1.	You want to enable the self-service provisioning of devices for workers on the go.
2.	You provide users with work-owned mobile devices like tablets and phones.
3.	You want to manage a set of users in Azure AD instead of in Active Directory, such as seasonal workers, contractors, or students.
4.	You want to provide joining capabilities to workers in remote branch offices with limited on-premises infrastructure.
5.	You do not have an on-premises Active Directory.

Some organizations will use Azure AD Join as the primary way to deploy work-owned devices, especially as they migrate most or all of their resources to the cloud. Hybrid organizations with both Active Directory and Azure AD can also choose to deploy one method or another depending on the user or department. School districts and universities might manage staff in Active Directory and students in Azure AD. Some companies might want to manage remote offices or the sales department in Azure AD. Both Azure AD Join and domain join methods can be used within a hybrid organization. Azure AD Join can be a great complement to domain join for deploying devices in a work environment.

**If the most usual access to enterprise resources is via the cloud, an organization might enjoy additional benefits if**:

- You can to remove dependencies on on-premises identity infrastructure.
- You can simplify your devices deployment model, getting away from imaging solutions by allowing self-service configuration.
- You can use mobile device management to manage all your devices across different platforms.

For more information about Azure AD Join, see [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md).

## When to use domain join (or keep using it)

Domain join is the traditional way that organizations have connected work devices for more than 15 years. It has enabled users to sign in to their devices using their Active Directory work or school accounts. Domain join has also allowed IT to centrally and fully manage these devices. Organizations typically rely on imaging methods to provision devices and generally use System Center Configuration Manager (SCCM) or Group Policy (GP) to manage them.

**You use domain join in your enterprise for any of these reasons**:

- You have Win32 apps deployed to these devices that use NTLM/Kerberos.
- You require GP or SCCM/DCM to manage devices.
- You want to continue to use imaging solutions to configure devices for your employees.

**Domain join in Windows 10  also gives you the following benefits after being connected to Azure AD**:

- Strong device-bound authentication and convenient sign-in for work or school accounts with Microsoft Passport and Windows Hello.
- Access to the enterprise Windows Store using work or school accounts (no Microsoft account required).
- Enterprise-compliant roaming of user settings across devices that use work or school accounts (no Microsoft account required).
- The ability to restrict access to organizational apps to devices that are compliant with organizational device policies.
- For more information about Azure AD Join, see [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md).

## Enabling joining of personally-owned devices for work or school

To support BYOD in the enterprise, Windows 10 gives the user the ability to add a work or school account to their computer, tablet, or phone. Adding a work or school account registers the device with Azure AD and optionally enrolls the device in the mobile device management system that the organization has configured for devices. The directory will show these devices as ‘Registered’ vs. ‘Azure AD joined’. IT can apply different policies based on this information, providing a lighter touch on a personally-owned device than on a work-owned device if desired.

Users can add a work or school account to their personal device very conveniently. They can do this when accessing a work application for the first time, or they can do it manually via the Settings application. This account will provide SSO to organizational resources.

For more information about Azure AD Join, see [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md).

##  Enabling domain join or Azure AD Join

All methods described earlier (domain join, Azure AD Join, and Add work or school account) have entry points in the Windows 10 user experience. However, all require an IT administrator to enable the functionality in the infrastructure for the experience to work.

## Azure AD Join

### To deploy Azure AD Join for any set of users you need the following:

- An Azure AD subscription.
- An Azure AD Premium subscription, such as mobile device management auto-enrollment, if you require more capabilities.
- Mobile device management (Intune subscription, mobile device management for Office 365, or any of the partner mobile device managment vendors that integrate with Azure AD--see the FAQ section for details).
- If your facilities are hybrid, we highly recommended that you deploy Azure AD Connect to extend the on-premises directory to Azure AD.

### Domain join

Domain join continues to work as it always has. However, to get the Azure AD benefits you will need the following:

- An Azure AD subscription.
- Deploy Azure AD Connect to extend the on-premises directory to Azure AD.
- A policy that allows conditional access to domain-joined devices to Azure AD.
- A policy that allows access to ‘domain joined’ devices if you want to be able to restrict access for some devices.
- System Center Configuration Manager version 1509 for Technical review, to enable rules for requiring compliant devices. (See the TechNet documentation and blog post).

For more information about domain join in Windows 10, see <link-to-DJ-in-Win10-deployment-guide>.

##BYOD and Add work account

To enable "bring your own device" (BYOD) with work or school accounts, you need the following:

- Have an Azure AD subscription.
- Have an Azure AD Premium subscription, such as MDM auto-enrollment, if you require more cababilities.
- Have an MDM (Intune subscription, or MDM for Office 365, or any of the partner MDM tools that integrate with Azure AD--see the FAQ section for details)

##Microsoft Passport

To enable Microsoft Passport, you will need the following:

- A public key infrastructure for certificate-based authentication support using Microsoft Passport.
- An Intune subscription for certificate-based authentication support using Microsoft Passport for Azure AD Join and work or school accounts.
- System Center Configuration Manager version 1509 for Technical Preview (please see TechNet documentation and blog post) for certificate-based authentication support using Microsoft Passport for domain join.
- Set policy to enable Microsoft Passport in the organization.

As an alternative to having PKI, you can enable key-based Microsoft Passport by doing the following:

- Deploy Windows Server 2016 ‘Production Preview 1’ DCs (no need of Domain or Forest Functional Level; a couple of DCs for redundancy serving each AD site will suffice).
- Set policy to enable Microsoft Passport in the organization.
- For more information about Microsoft Passport and Windows Hello in Windows 10, see <link-to-MS-Passport-and-Windows-Hello-document>.

## Frequently asked questions

###Which partner MDM vendor products integrate with Azure AD?

The following vendor products integrate with Azure AD for unified enrollment and conditional access in Windows 10:

- AirWatch by VMware
- Citrix Xenmobile
- Lightspeed Mobile Manager
- SOTI on-premises MDM

###What about Workplace Join in Windows 10?
Workplace Join in Windows 8.1 was used to enable BYOD. In Windows 10, BYOD is enabled via Add a work or school account as explained earlier in this document. For organizations that don’t integrate their MDM with Azure AD, users can enroll the device into management manually via **Settings** > **Accounts** > **Work access**.

###Can the user connect their Microsoft account to their domain account in Windows 10?
Not in Windows 10. In Windows 8.1, users of domain-joined devices could “connect” their Microsoft account (for example, Hotmail, Live, Outlook, Xbox, etc.) to their domain account to enable certain experiences like SSO to Live services, use of Windows Store and roaming of user settings across devices. In Windows 10, the Microsoft account Connect functionality has been retired. The user can add one or more Microsoft accounts as additional accounts to enable SSO to consumer services such as the Windows Store. This is done in **Settings** > **Accounts** > **Your account**.

Users upgrading from Windows 8.1 domain-joined devices who had their Microsoft account connected will automatically have their connected Microsoft account added to the list of additional accounts they use.


## Additional information
* [Windows 10 for the enterprise: Ways to use devices for work](active-directory-azureadjoin-windows10-devices-overview.md)
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-user-upgrade.md)
* [Learn about usage scenarios for Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
* [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)
