<properties
	pageTitle="Using Windows 10 devices in your workplace | Microsoft Azure"
	description="Provides a snapshot of capabilities for users and IT, contrasting the different ways a device can be provisioned and used in an enterprise with Windows 10."
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="swadhwa"
	editor=""
	tags="azure-classic-portal"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/23/2016"
	ms.author="femila"/>

# Using Windows 10 devices in your workplace

Applies to: Windows 10 PCs

Windows 10 offers three models for organizations that enable users to access work resources in a secure and convenient way.

- **Azure Active Directory Join** (Azure AD Join), for workers who access resources such as Office 365 primarily in the cloud. Azure AD Join is self-service work provisioning experience that's new in Windows 10.
- **Domain join**, for organizations that have investments in on-premises apps and resources. Domain join offers an improved experience in Windows 10 when connected to Azure AD.
- **A new simplified BYOD experience**, for users who want to add a work account or school to Windows and easily access resources on personal devices.

The following table presents a snapshot of capabilities for users and IT administrators, contrasting the different ways a device can be provisioned and used in an enterprise with Windows 10:

|                                                                                                                                                                 | Domain join     | Azure AD Join | Personal device |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|---------------|-----------------|
| Windows device sign-in for work or school accounts.                                                                                                                      | Yes             | Yes           | No              |
| User single-sign-on (SSO) to Office 365 and Azure AD apps. SSO is the ability to sign in just once to access organizational resources. | Yes             | Yes           | Yes             |
| User SSO to Kerberos/NTLM apps.                                                                                                                                  | Yes             | Limited       | Yes, via VPN         |
| Strong authorization and convenient sign-in for work or school accounts with Microsoft Passport and Windows Hello.                                                                   | Yes             | Yes           | Yes             |
| Access to enterprise Windows Store with a work or school account (not a Microsoft account).                                                                                    | Yes             | Yes           | Yes             |
| Enterprise-compliant roaming of user settings across devices with work or school accounts.                                                                                 | Yes             | Yes           | Yes             |
| The ability to restrict access to organizational apps to devices that are compliant with organizational device policies.                                                      | Yes             | Yes           | Yes             |
| User self-service provisioning of devices for "work from anywhere."                                                                                                | No              | Yes           | Yes             |
| Ability to manage devices.                                                                                                                                       | Yes, via GP/SCCM | Yes           | Yes             |

## Use work-owned devices with Azure AD Join and domain join in Windows 10

Windows 10 offers two ways for work-owned devices to access work resources:

- Azure AD Join
- Domain join

 Both can be valid options depending on an organization's needs and requirements. In some cases, organizations might benefit from enabling both methods of deployment.

## When to use Azure Active Directory Join

Azure AD Join is a new self-service work provisioning experience in Windows 10.  It is targeted at workers who access work resources such as Office 365 primarily in the cloud. It is a lightweight way to configure computers, tablets, and phones for the enterprise. Devices are managed via mobile device management, by using consistent controls across Windows platforms.

**Use Azure AD Join for any of these reasons**:

- You want to enable the self-service provisioning of devices for workers on the go.
- You provide users with work-owned mobile devices like tablets and phones.
- You want to manage a set of users in Azure AD instead of in Active Directory, such as seasonal workers, contractors, or students.
- You want to provide joining capabilities to workers in remote branch offices with limited on-premises infrastructure.
- You do not have an on-premises Active Directory.

Some organizations will use Azure AD Join as the primary way to deploy work-owned devices, especially as they migrate most or all of their resources to the cloud. Hybrid organizations with both Active Directory and Azure AD can also choose to deploy one method or another depending on the user or department.

School districts and universities, for example, might manage staff in Active Directory and students in Azure AD. Some companies might want to manage remote offices or sales departments in Azure AD. Both Azure AD Join and domain join methods can be used within a hybrid organization. Azure AD Join can be a great complement to domain join for deploying devices in a work environment.

**If the most usual access to enterprise resources is via the cloud, your organization might enjoy additional benefits if**:

- You can remove dependencies on on-premises identity infrastructure.
- You can simplify your devices deployment model, getting away from imaging solutions by allowing self-service configuration.
- You can use mobile device management to manage all your devices across different platforms.

For more information about Azure AD Join, see [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md).

## When to use domain join (or keep using it)

For the last 15 years, many organizations have used domain join to connect work devices. It enables users to sign in to their devices with their Active Directory work or school accounts. Domain join also allows IT to centrally and fully manage these devices. Organizations typically rely on imaging methods to provision devices, and often use System Center Configuration Manager (SCCM) or Group Policy (GP) to manage them.

**Your enterprise should use domain join (or keep using it) for any of these reasons**:

- You have Win32 apps deployed to these devices that use NTLM/Kerberos.
- You require GP or SCCM/DCM to manage devices.
- You want to continue to use imaging solutions to configure devices for your employees.

**Domain join in Windows 10 also gives you the following benefits when connected to Azure AD**:

- Strong device-bound authentication and convenient sign-in for work or school accounts with Microsoft Passport and Windows Hello.
- Access to the enterprise Windows Store for devices that use work or school accounts (no Microsoft account required).
- Enterprise-compliant roaming of user settings across devices that use work or school accounts (no Microsoft account required).
- The ability to restrict access to organizational apps to devices that are compliant with organizational device policies.

For more information about Azure AD Join, see [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md).

## Enable joining of personally-owned devices for work or school

To support BYOD in the enterprise, Windows 10 gives the user the ability to add a work or school account to their computer, tablet, or phone. After the user adds a work or school account, the device is registered with Azure AD and optionally enrolled in the mobile device management system that the organization has configured. The directory will show these devices as ‘Registered’ vs. ‘Azure AD joined’. IT administraors can apply different policies based on this information, providing a lighter touch on  personally-owned devices than on work-owned devices if desired.

Users can add a work or school account to their personal device very conveniently. They can do this when accessing a work application for the first time, or they can do it manually via the Settings menu. This account will provide SSO to organizational resources.

For more information about Azure AD Join, see [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md).

## Enable domain join or Azure AD Join

All methods described earlier (domain join, Azure AD Join, and Add work or school account) have entry points in the Windows 10 user experience. However, all require an IT administrator to enable the functionality in the infrastructure before the experience will work.

## Requirements for deploying Azure AD Join

To deploy Azure AD Join for any set of users you need the following:

- An Azure AD subscription.
- An Azure AD Premium subscription, such as mobile device management auto-enrollment, if you require more capabilities.
- Mobile device management--for example, a Microsoft Intune subscription, mobile device management for Office 365, or any of the partner mobile device management vendors that integrate with Azure AD. (See the [FAQ section](#frequently-asked-questions) near the end of this article for more information).

If your facilities are hybrid, we highly recommended that you deploy Azure AD Connect to extend the on-premises directory to Azure AD.

## Requirements for using domain join with Azure AD

Domain join continues to work as it always has. However, to get the Azure AD benefits you will need the following:

- An Azure AD subscription.
- A deployment of Azure AD Connect to extend the on-premises directory to Azure AD.
- A policy that allows domain-joined devices to have conditional access to Azure AD.
- A policy that allows access to "domain-joined" devices if you want to be able to restrict access for some devices.
- System Center Configuration Manager version 1509 for Technical Preview, to enable rules for requiring compliant devices. (See the TechNet documentation and blog post).

For more information about domain join in Windows 10, see <link-to-DJ-in-Win10-deployment-guide>.

## Requirements for using BYOD and "Add a work or school account"

To enable "bring your own device" (BYOD) with work or school accounts, you need the following:

- An Azure AD subscription.
- An Azure AD Premium subscription, such as mobile device management auto-enrollment, if you require more capabilities.

## Requirements for using Microsoft Passport

To enable Microsoft Passport, you will need the following:

- A public key infrastructure (PKI) for certificate-based authentication support that uses Microsoft Passport.
- An Intune subscription for certificate-based authentication support that uses Microsoft Passport for Azure AD Join and work or school accounts.
- System Center Configuration Manager version 1509 for Technical Preview (see the TechNet documentation and blog post) for certificate-based authentication support that uses Microsoft Passport for domain join.
- A policy for enabling Microsoft Passport in the organization.

As an alternative to using a PKI, you can enable key-based Microsoft Passport by doing the following:

- Deploy Windows Server 2016 "Production Preview 1" DCs (no need for domain or forest functional levels; several DCs for redundancy serving each Active Directory site will suffice).
- Set policy to enable Microsoft Passport in the organization.

For more information about Microsoft Passport and Windows Hello in Windows 10, see <link-to-MS-Passport-and-Windows-Hello-document>.

## Frequently asked questions
### Which partner mobile device management products integrate with Azure AD?

The following vendor products integrate with Azure AD for unified enrollment and conditional access in Windows 10:

- AirWatch by VMware
- Citrix Xenmobile
- Lightspeed Mobile Manager
- SOTI on-premises mobile device management

### What about Workplace Join in Windows 10?
Workplace Join was used in Windows 8.1 to enable BYOD. In Windows 10, BYOD is enabled via "Add a work or school account" as explained earlier in this document. For organizations that don’t integrate their mobile device management with Azure AD, users can enroll the device into management manually via **Settings** > **Accounts** > **Work access**.


### Can users connect their Microsoft account to their domain account in Windows 10?
Not in Windows 10. In Windows 8.1, users of domain-joined devices could “connect” their Microsoft account (for example, Hotmail, Live, Outlook, Xbox, etc.) to their domain account to enable certain experiences like SSO to Live services, use of the Windows Store, and roaming of user settings across devices. In Windows 10, the Microsoft account "connect" functionality has been retired. The user can add one or more Microsoft accounts as additional accounts to enable SSO to consumer services such as the Windows Store. This is done in **Settings** > **Accounts** > **Your account**.

Users who are upgrading from Windows 8.1 domain-joined devices, and who had their Microsoft account connected, will automatically have their connected Microsoft account added to the list of additional accounts they use.


## Additional information
* [Windows 10 for the enterprise: Ways to use devices for work](active-directory-azureadjoin-windows10-devices-overview.md)
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-user-upgrade.md)
* [Learn about usage scenarios for Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
* [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)
