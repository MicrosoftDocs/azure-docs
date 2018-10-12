---
title: Set up on-premises conditional access in Azure Active Directory | Microsoft Docs
description: A step-by-step guide to enabling conditional access to on-premises applications by using Active Directory Federation Services (AD FS) in Windows Server 2012 R2.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.component: devices
ms.assetid: 6ae9df8b-31fe-4d72-9181-cf50cfebbf05
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/23/2018
ms.author: markvi
ms.reviewer: jairoc
ms.custom: seohack1
---
# Setting up on-premises conditional access by using Azure Active Directory device registration

When you require users to workplace-join their personal devices to the Azure Active Directory (Azure AD) device registration service, their devices can be marked as known to your organization. Following is a step-by-step guide for enabling conditional access to on-premises applications by using Active Directory Federation Services (AD FS) in Windows Server 2012 R2.

> [!NOTE]
> An Office 365 license or Azure AD Premium license is required when using devices that are registered in Azure Active Directory device registration service conditional access policies. These include policies that are enforced by AD FS in on-premises resources.
> 
> For more information about the conditional access scenarios for on-premises resources, see [Join to workplace from any device for SSO and seamless second-factor authentication across company applications](https://technet.microsoft.com/library/dn280945.aspx).

These capabilities are available to customers who purchase an Azure Active Directory Premium license.

## Supported devices

* Windows 7 domain-joined devices
* Windows 8.1 personal and domain-joined devices
* iOS 6 and later for the Safari browser
* Android 4.0 or later, Samsung GS3 or later phones, Samsung Galaxy Note 2 or later tablets

## Scenario prerequisites

* Subscription to Office 365 or Azure Active Directory Premium
* An Azure Active Directory tenant
* Windows Server Active Directory (Windows Server 2008 or later)
* Updated schema in Windows Server 2012 R2
* License for Azure Active Directory Premium
* Windows Server 2012 R2 Federation Services, configured for SSO to Azure AD
* Windows Server 2012 R2 Web Application Proxy 
* Microsoft Azure Active Directory Connect (Azure AD Connect) [(Download Azure AD Connect)](http://www.microsoft.com/download/details.aspx?id=47594)
* Verified domain

## Known issues in this release

* Device-based conditional access policies require device object writeback to Active Directory from Azure Active Directory. It can take up to three hours for device objects to be written back to Active Directory.
* iOS 7 devices  always prompt the user to select a certificate during client certificate authentication.
* Some versions of iOS 8 before iOS 8.3 do not work.

## Scenario assumptions

This scenario assumes that you have a hybrid environment consisting of an Azure AD tenant and an on-premises Active Directory. These tenants should be connected with Azure AD Connect, with a verified domain, and with AD FS for SSO. Use the following checklist to help you configure your environment according to the requirements.

## Checklist: Prerequisites for conditional access scenario

Connect your Azure AD tenant with your on-premises Active Directory instance.

## Configure Azure Active Directory device registration service

Use this guide to deploy and configure the Azure Active Directory device registration service for your organization.

This guide assumes that you've configured Windows Server Active Directory and have subscribed to Microsoft Azure Active Directory. See the prerequisites described earlier.

To deploy the Azure Active Directory device registration service with your Azure Active Directory tenant, complete the tasks in the following checklist in order. When a reference link takes you to a conceptual topic, return to this checklist afterward, so that you can proceed with the remaining tasks. Some tasks include a scenario validation step that can help you confirm whether the step was completed successfully.

## Part 1: Enable Azure Active Directory device registration

Follow the steps in the checklist to enable and configure the Azure Active Directory device registration service.

| Task | Reference | 
| --- | --- |
| Enable device registration in your Azure Active Directory tenant to allow devices to join the workplace. By default, Azure Multi-Factor Authentication is not enabled for the service. However, we recommend that you use Multi-Factor Authentication when you register a device. Before enabling Multi-Factor Authentication in Active Directory registration service, ensure that AD FS is configured for a Multi-Factor Authentication  provider. |[Enable Azure Active Directory device registration](active-directory-device-registration-get-started.md)| 
|Devices discover your Azure Active Directory device registration service by looking for well-known DNS records. Configure your company DNS so that devices can discover your Azure Active Directory device registration service. |[Configure Azure Active Directory device registration discovery](active-directory-device-registration-get-started.md)| 


## Part 2: Deploy and configure Windows Server 2012 R2 Active Directory Federation Services and set up a federation relationship with Azure AD

| Task | Reference |
| --- | --- |
| Deploy Active Directory Domain Services with the Windows Server 2012 R2 schema extensions. You do not need to upgrade any of your domain controllers to Windows Server 2012 R2. The schema upgrade is the only requirement. |[Upgrade your Active Directory Domain Services schema](#upgrade-your-active-directory-domain-services-schema) |
| Devices discover your Azure Active Directory device registration service by looking for well-known DNS records. Configure your company DNS so that devices can discover your Azure Active Directory device registration service. |[Prepare your Active Directory support devices](#prepare-your-active-directory-to-support-devices) |

## Part 3: Enable device writeback in Azure AD

| Task | Reference |
| --- | --- |
| Complete part two of "Enabling device writeback in Azure AD Connect." After you finish it, return to this guide. |[Enabling device writeback in Azure AD Connect](hybrid/how-to-connect-device-writeback.md) |

## [Optional] Part 4: Enable Multi-Factor Authentication

We strongly recommended that you configure one of the several options for Multi-Factor Authentication. If you want to require Multi-Factor Authentication, see [Choose the Multi-Factor Authentication security solution for you](authentication/concept-mfa-whichversion.md). It includes a description of each solution, and links to help you configure the solution of your choice.

## Part 5: Verification

The deployment is now complete, and you can try out some scenarios. Use the following links to experiment with the service and become familiar with its features.

| Task | Reference |
| --- | --- |
| Join some devices to your workplace by using Azure Active Directory device registration service. You can join iOS, Windows, and Android devices. |[Join devices to your workplace using Azure Active Directory device registration service](#join-devices-to-your-workplace-using-azure-active-directory-device-registration) |
| View and enable or disable registered devices by using the administrator portal. In this task, you view some registered devices by using the administrator portal. |[Azure Active Directory device registration service overview](active-directory-device-registration-get-started.md) |
| Verify that device objects are written back from Azure Active Directory to Windows Server Active Directory. |[Verify registered devices are written back to Active Directory](#verify-registered-devices-are-written-back-to-active-directory) |
| Now that users can register their devices, you can create application access polices in AD FS that allow only registered devices. In this task, you create an application access rule and a custom access-denied message. |[Create an application access policy and custom access-denied message](#create-an-application-access-policy-and-custom-access-denied-message) |

## Integrate Azure Active Directory with on-premises Active Directory

**See:**

- [Integrate your on-premises directories with Azure Active Directory](hybrid/whatis-hybrid-identity.md) - to review conceptual information.

- [Custom installation of Azure AD Connect](hybrid/how-to-connect-install-custom.md) - for installation instructions.


## Upgrade your Active Directory Domain Services schema

> [!NOTE]
> After you upgrade your Active Directory schema, the process cannot be reversed. We recommend that you first perform the upgrade in a test environment.
> 

1. Sign in to your domain controller with an account that has both enterprise administrator and schema administrator rights.
1. Copy the **[media]\support\adprep** directory and subdirectories to one of your Active Directory domain controllers (where **[media]** is the path to the Windows Server 2012 R2 installation media).
1. From a command prompt, go to the **adprep** directory and run **adprep.exe /forestprep**. Follow the onscreen instructions to complete the schema upgrade.

## Prepare your Active Directory to support devices

> [!NOTE]
> This is a one-time operation that you must run to prepare your Active Directory forest to support devices. To complete this procedure, you must be signed in with enterprise administrator permissions and your Active Directory forest must have the Windows Server 2012 R2 schema.
> 


### Prepare your Active Directory forest

1. On your federation server, open a Windows PowerShell command window, and then type **Initialize-ADDeviceRegistration**. 
1. When prompted for **ServiceAccountName**, enter the name of the service account you selected as the service account for AD FS. If it's a gMSA account, enter the account in the **domain\accountname$** format. For a domain account, use the format **domain\accountname**.

### Enable device authentication in AD FS

1. On your federation server, open the AD FS management console and go to **AD FS** > **Authentication Policies**.
1. On the **Actions** pane, select **Edit Global Primary Authentication**.
1. Check **Enable device authentication**, and then select **OK**.
1. By default, AD FS periodically removes unused devices from Active Directory. Disable this task when you're using Azure Active Directory device registration service so that devices can be managed in Azure.

### Disable unused device cleanup

On your federation server, open a Windows PowerShell command window, and then type **Set-AdfsDeviceRegistration -MaximumInactiveDays 0**.

### Prepare Azure AD Connect for device writeback

Complete part 1: Prepare Azure AD Connect.

## Join devices to your workplace by using Azure Active Directory device registration service

### Join an iOS device by using Azure Active Directory device registration

Azure Active Directory device registration uses the Over-the-Air Profile enrollment process for iOS devices. This process begins when the user connects to the profile enrollment URL with Safari. The URL format is as follows:

`https://enterpriseregistration.windows.net/enrollmentserver/otaprofile/<yourdomainname>`

In this case, `yourdomainname` is the domain name that you configured with Azure Active Directory. For example, if your domain name is contoso.com, the URL is as follows:

`https://enterpriseregistration.windows.net/enrollmentserver/otaprofile/contoso.com`

There are many different ways to communicate this URL to your users. For example, one method we recommend is publishing this URL in a custom application access-denied message in AD FS. This information is covered in the upcoming section [Create an application access policy and custom access-denied message](#create-an-application-access-policy-and-custom-access-denied-message).

### Join a Windows 8.1 device by using Azure Active Directory device registration

1. On your Windows 8.1 device, select **PC Settings** > **Network** > **Workplace**.
1. Enter your user name in UPN format; for example, **dan@contoso.com**.
1. Select **Join**.
1. When prompted, sign in with your credentials. The device is now joined.

### Join a Windows 7 device by using Azure Active Directory device registration

To register Windows 7 domain-joined devices, you need to deploy the [device registration software package](https://www.microsoft.com/download/details.aspx?id=53554).

For instructions about how to use the package, see [Windows Installer packages for non-Windows 10 computers](devices/hybrid-azuread-join-control.md#control-windows-down-level-devices).

## Verify that registered devices are written back to Active Directory

You can view and verify that your device objects have been written back to your Active Directory by using LDP.exe or ADSI Edit. Both are available with the Active Directory administrator tools.

By default, device objects that are written back from Azure Active Directory are placed in the same domain as your AD FS farm.

`CN=RegisteredDevices,defaultNamingContext`

## Create an application access policy and custom access-denied message

Consider the following scenario: You create an application Relying Party Trust in AD FS and configure an Issuance Authorization Rule that allows only registered devices. Now only devices that are registered are allowed to access the application. 

To make it easy for your users to gain access to the application, you configure a custom access-denied message that includes instructions for how to join their device. Now your users have a seamless way to register their devices so they can access an application.

The following steps show you how to implement this scenario.

> [!NOTE]
> This section assumes that you have already configured a Relying Party Trust for your application in AD FS.
> 

1. Open the AD FS MMC tool, and then select **AD FS** > **Trust Relationships** > **Relying Party Trusts**.
1. Locate the application to which this new access rule applies. Right-click the application, and then select **Edit Claim Rules**.
1. Select the **Issuance Authorization Rules** tab, and then select **Add Rule**.
1. From the **Claim rule** template drop-down list, select **Permit or Deny Users Based on an Incoming Claim**. Then select **Next**.
1. In the **Claim rule name** field, type **Permit access from registered devices**.
1. From the **Incoming claim type** drop-down list, select **Is Registered User**.
1. In the **Incoming claim value** field, type **true**.
1. Select the **Permit access to users with this incoming claim** radio button.
1. Select **Finish**, and then select **Apply**.
1. Remove any rules that are more permissive than the rule you created. For example, remove the default rule **Permit Access to all Users**.

Your application is now configured to allow access only when the user is coming from a device that they registered and joined to the workplace. For more advanced access polices, see [Manage Risk with Additional Multi-Factor Authentication for Sensitive Applications](https://technet.microsoft.com/library/dn280949.aspx).

Next, you configure a custom error message for your application. The error message lets users know that they must join their device to the workplace before they can access the application. You can create a custom application access-denied message by using custom HTML and PowerShell.

On your federation server, open a PowerShell command window, and then type the following command. Replace portions of the command with items that are specific to your system:

`Set-AdfsRelyingPartyWebContent -Name "relying party trust name" -ErrorPageAuthorizationErrorMessage`

You must register your device before you can access this application.

**If you are using an iOS device, select this link to join your device**:

`https://enterpriseregistration.windows.net/enrollmentserver/otaprofile/yourdomain.com`

Join this iOS device to your workplace.

If you are using a Windows 8.1 device, you can join your device by selecting **PC Settings**> **Network** > **Workplace**.

In the preceding commands, **relying party trust name** is the name of your application's Relying Party Trust object in AD FS.
And **yourdomain.com** is the domain name that you have configured with Azure Active Directory (for example, contoso.com).
Be sure to remove any line breaks (if any) from the HTML content that you pass to the **Set-AdfsRelyingPartyWebContent** cmdlet.

Now when users access your application from a device that's not registered with the Azure Active Directory device registration service, they see an error.
