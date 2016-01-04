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

Windows 10 offers three models for organizations to enable users to access work resources in a secure and convenient way.

1. **Azure AD Join**, new in Windows 10, a self-service work provisioning experience targeted for workers who primarily access resources in the cloud such as Office 365.
1. **Domain Join**, better in Windows 10 when connected to Azure AD, for organizations with large investments in on-premises apps and resources.
1. **A new simplified BYOD experience** that allows users to add a work account to Windows to easily access work resources on personal devices.

The following table presents a snapshot of capabilities users and IT get, contrasting the different ways a device can be provisioned and used in an enterprise with Windows 10:

|                                                                                                                                                                 | Domain Join     | Azure AD Join | Personal Device |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|---------------|-----------------|
| Windows device sign-in using work accounts                                                                                                                      | Yes             | Yes           | No              |
| User SSO to Office365 and Azure AD apps,[1] Single Sign-On or the ability to access company resources without entering credentials again after signing-in once. | Yes             | Yes           | Yes             |
| User SSO to Kerberos/NTLM apps                                                                                                                                  | Yes             | Limited       | Via VPN         |
| Strong auth and convenient sign-in for work account with Microsoft Passport and Windows Hello                                                                   | Yes             | Yes           | Yes             |
| Access to enterprise Windows Store using work account (no Microsoft Account)                                                                                    | Yes             | Yes           | Yes             |
| Enterprise compliant roaming of user settings across devices using work account                                                                                 | Yes             | Yes           | Yes             |
| Restrict access to organizational apps from devices compliant with,organizational device policies                                                               | Yes             | Yes           | Yes             |
| User self-service provisioning of devices for work from anywhere                                                                                                | No              | Yes           | Yes             |
| Ability to manage devices                                                                                                                                       | Yes via GP/SCCM | Yes           | Yes             |

##Work-owned devices: Azure AD Join and Domain Join

Windows 10 offers two models for work-owned devices for accessing work resources: 

- Azure AD Join
- Domain Join.

 Both are valid options depending on the organization needs and requirements. In some cases, organizations might benefit from enabling both methods of deployment.

## When to use Azure Active Directory Join

Azure AD Join is a new self-service work provisioning experience in Windows 10.  It is targeted for the workers who primarily access work resources in the cloud such as Office 365. It is a lightweight way to configure PCs, tablets and phones for the enterprise. Devices are managed via MDM using consistent controls across Windows platforms.

**Use Azure AD Join for any of these reasons**:

1.	You want to enable self-service provisioning of devices for workers on-the-go.
2.	You provide users with work-owned mobile devices like tablets and phones.
3.	You want to manage a set of users in Azure AD instead of AD, such as seasonal workers, contractors, or students.
4.	You want to provide joining capabilities to workers in remote branch offices with limited on-premises infrastructure.
5.	You do not have on-premises AD.

Some organizations will use Azure AD Join as the primary way to deploy work-owned devices, especially as they migrate most or all of their resources to the cloud. Hybrid organizations with both AD and Azure AD can also choose to deploy one method or another depending on the user or department. School districts and universities may manage staff in AD and manage students in Azure AD, or some companies might want remote offices or the sales department on Azure AD. Both Azure AD Join and Domain Join methods can be used within a hybrid organization. Azure AD Join can be a great complement for deploying devices in a work environment. 

**If most access to enterprise resources is via the cloud, an organization may enjoy additional benefits**:

- You may be able to remove dependencies on on-premises identity infrastructure.
- You can simplify your devices deployment model by getting away from imaging solutions by allowing self-service configuration.
- You can use MDM to manage all your devices across different platforms.

For more information about Azure AD Join please see [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md).

## When to use Domain Join (or keep using it)

Domain join is the traditional way organizations have connected devices for work for the last 15 years and more. It has enabled users to sign-in to their devices using their AD work accounts and allowed IT to centrally and fully manage these devices. Organizations typically rely on imaging methods to provision devices and generally use System Center Configuration Manager (SCCM) or Group Policy to manage them.

**You would use domain join in your enterprise for any of these reasons**:

- You have Win32 apps deployed to these devices that use NTLM/Kerberos.
- You require GP or SCCM/DCM to manage devices.
- You want to continue to use imaging solutions to configure devices for your employees.

**Domain Join in Windows 10 will also gives you the following benefits after being connected to Azure AD**:

- Strong device-bound authentication and convenient sign-in for work account with Microsoft Passport and Windows Hello.
- Access to enterprise Windows Store using work accounts (no Microsoft account required).
- Enterprise compliant roaming of user settings across devices using work account (no Microsoft account required).
- Ability to restrict access to organizational apps from devices compliant with organizational device policies.
- For more information about Azure AD Join please see [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md).

##Enabling personally-owned devices for work with work accounts

To support BYOD in the enterprise, Windows 10 gives the user the ability to “add a work or school account” to their PC, tablet or phone. Adding a work account registers the device with Azure AD and optionally enrolls the device into the MDM the organization has configured for devices. The directory will show these devices as ‘Registered’ vs. ‘Azure AD joined’. IT can apply different policies based on this information, providing a lighter touch on a personally-owned device than on a work-owned device if desired.

Users can add a work account to their personal device very conveniently: when accessing a work application for the first time, or manually via the Settings application. This work account will provide SSO to organizational resources.

For more information about Azure AD Join, see [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md).

## Enabling Domain join or Azure AD join 

All methods described above (Domain Join, Azure AD Join and Add work account) have entry points in the Windows 10 user experience, however, all require IT to enable the functionality in the infrastructure for the experience to work.

##Azure AD join

To deploy Azure AD Join for any set of users you need the following:
---------------------------------------------------------------------------
- Have an Azure AD subscription.
- More capabilities will require an Azure AD Premium subscription such as MDM auto-enrollment.
- Have an Azure AD Premium subscription.
- Have an MDM (Intune subscription or MDM for Office365 or any of the 3rd party MDM vendors who integrate with Azure AD – see the FAQ section for details)
- If you are hybrid, it is highly recommended to do the following:
- Deploy Azure AD Connect to extend on-premises directory to Azure AD.

##Domain join

Domain Join continues to work as it always has, however to get the Azure AD benefits you will need the following:

- Have an Azure AD subscription.
- Deploy Azure AD Connect to extend on-premises directory to Azure AD.
- Set policy to connect domain joined devices to Azure AD.
- For more information about Domain Join in Windows 10 please see <link-to-DJ-in-Win10-deployment-guide>.
- For conditional access you can create policy that allows access to ‘domain joined’ devices. To enable rules for requiring compliant devices you need the following:
- System Center Configuration Manager version 1509 for Technical Preview (please see TechNet documentation and blog post).

##BYOD and Add Work Account

To enable BYOD with work accounts you need the following:

- Have an Azure AD subscription.
- More capabilities will require an Azure AD Premium subscription such as MDM auto-enrollment.
- Have an Azure AD Premium subscription.
- Have an MDM (Intune subscription or MDM for Office365 or any of the 3rd party MDM vendors who integrate with Azure AD – see the FAQ section for details)

##Microsoft Passport

To enable Microsoft Passport in addition you will need the following:

- PKI Infrastructure for certificate-based authentication support using Microsoft Passport.
- Intune subscription for certificate-based authentication support using Microsoft Passport for Azure AD Join and Work Accounts.
- System Center Configuration Manager version 1509 for Technical Preview (please see TechNet documentation and blog post) for certificate-based authentication support using Microsoft Passport for Domain Join.
- Set policy to enable Microsoft Passport in the organization.

As an alternative to having a PKI infrastructure you can enable key-based Microsoft Passport by doing the following:

- Deploy Windows Server 2016 ‘Production Preview 1’ DCs (no need of Domain or Forest Functional Level; a couple of DCs for redundancy serving each AD site will suffice).
- Set policy to enable Microsoft Passport in the organization.
- For more information about Microsoft Passport and Windows Hello in Windows 10 please see <link-to-MS-Passport-and-Windows-Hello-document>.

## Frequently asked questions

###What 3rd party MDM vendor products integrate with Azure AD?

The following vendor products integrate with Azure AD for unified enrollment and conditional access in Windows 10:

- AirWatch by VMware
- Citrix Xenmobile
- Lightspeed Mobile Manager
- SOTI On-premises MDM

###What about Workplace Join in Windows 10?
Workplace Join in Windows 8.1 was used to enable BYOD. In Windows 10, BYOD is enabled via Add a work account as explained earlier in this document. For organizations that don’t integrate their MDM with Azure AD, users can enroll the device into management manually via **Settings** > **Accounts** > **Work access**.

###Can the user connect their Microsoft account (MSA) to their Domain account in Windows 10?
Not in Windows 10. In Windows 8.1, users of domain joined devices could “connect” their MSA (e.g. Hotmail, Live, Outlook, XBox, etc.) to their domain account to enable certain experiences like SSO to Live services, use of Windows Store and roaming of user settings across devices. In Windows 10, the MSA Connect functionality has been retired. The user can add one or more MSAs as additional accounts to enable SSO to consumer services such as the Windows Store. This is done in **Settings** > **Accounts** > **Your account**.

Users upgrading from Windows 8.1 domain joined devices who had their MSA connected will automatically have their connected MSA added to the list of additional accounts they use.


## Additional Information
* [Windows 10 for the enterprise: Ways to use devices for work](active-directory-azureadjoin-windows10-devices-overview.md)
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-user-upgrade.md)
* [Learn about usage scenarios for Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
* [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)