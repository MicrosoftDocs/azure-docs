<properties
	pageTitle="Setting up on-premises conditional access using Azure Active Directory Device Registration | Microsoft Azure"
	description="A topic that explains how users can register their personal Windows 10 computers to their corporate network."
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/19/2015"
	ms.author="femila"/>

# Setting up on-premises conditional access using Azure Active Directory Device Registration

Personally owned devices of your users can be marked known to your organization by requiring the users to work place join their devices to the Azure Active Directory Device Registration service. Below is a step-by-step guide to enable conditional access to on-premises applications using Active Directory Federation Service (AD FS) in Windows Server 2012 R2.

> [AZURE.NOTE]
> Office 365 license or Azure AD Premium license is required when using devices registered in Azure Active Directory Device Registration service conditional access policies. This includes policies enforced by Active Directory Federation Services (AD FS) to on-premises resources.

For more information on the conditional access scenarios for on-premises, see [Join to Workplace from Any Device for SSO and Seamless Second Factor Authentication Across Company Applications](https://technet.microsoft.com/library/dn280945.aspx).
These capabilities are available to customers that purchase an Azure Active Directory Premium license.

Supported Devices
-------------------------------------------------------------------------
* Windows 7 domain joined devices.
* Windows 8.1 personal and domain joined devices.
* iOS 6 and later.
* Android 4.0 or later, Samsung GS3 or above phones, Samsung Note2 or above tablets.

Scenario Prerequisites
------------------------------------------------------------------------
* Windows Server Active Directory (Windows Server 2008 or above)
* Updated schema in Windows Server 2012 R2
* Subscription to Azure Active Directory Premium
* Windows Server 2012 R2 Federation Services, configured for SSO to Azure AD
* Windows Server 2012 R2 Web Application Proxy
* Directory Synchronization Tool (DirSync) with device object write-back. [Download the latest build of dirsync.exe.](http://go.microsoft.com/fwlink/?LinkID=278924)

Known Issues in this release
-------------------------------------------------------------------------------
* Device based conditional access policies require device object write-back to Active Directory from Azure Active Directory. It can take up to 3 hours for device objects to be written-back to Active Directory.
* iOS7 devices will always prompt the user to select a certificate during client certificate authentication. 
* iOS8 beta devices are not working at this time.


## Deploy Azure Active Directory Device Registration Service
Use this guide to deploy and configure Azure Active Directory Device Registration Service for your organization.

This guide assumes that you have configured Windows Server Active Directory and have subscribed to Microsoft Azure Active Directory. See prerequisites above.

To deploy Azure Active Directory Device Registration Service with your Azure Active Directory tenant, complete the tasks in the following checklist, in order. When a reference link takes you to a conceptual topic, return to this checklist after you review the conceptual topic so that you can proceed with the remaining tasks in this checklist. Some tasks will include a scenario validation step that can help you confirm the step was completed successfully.

**Checklist: Enable Azure Active Directory Device Registration**

Follow the checklist below to enable and configure the Azure Active Directory Device Registration Service.

| Task                                                                                                                                                                                                                                                                                                                                                                                             | Reference                                                       |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| Enable Device Registration in your Azure Active Directory tenant to allow devices to join the workplace. By default, multi-factor authentication is not enabled for the service. However, multi-factor authentication is recommended when registering a device. Before enabling multi-factor authentication in ADRS, ensure that AD FS is configured for a multi-factor authentication provider. | [Enable Azure Active Directory Device Registration](active-directory-conditional-access-device-registration-overview.md)               |
| Devices will discover your Azure Active Directory Device Registration Service by looking for well-known DNS records. You must configure your company DNS so that devices can discover your Azure Active Directory Device Registration Service.                                                                                                                                                   | [Configure Azure Active Directory Device Registration discovery.](active-directory-conditional-access-device-registration-overview.md) |

**Checklist: Deploy and configure Windows Server 2012 R2 Active Directory Federation Services and set up a federation relationship with Azure Active Directory**
With the next set of tasks, you integrate Windows Server 2012 R2 Federation services with Azure Active Directory. This allows you to use devices registered in Azure Active Directory Device Registration Service for conditional access policies in AD FS.


| Task                                                                                                                                                                                                                                   | Reference                                                                                         |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Deploy Active Directory Domain Services domain with the Windows Server 2012 R2 schema extensions. (You do not need to upgrade any of your domain controllers to Windows Server 2012 R2. The schema upgrade is the only requirement).   | Upgrade your Active Directory Domain Services Schema.                                             |
| Deploy Windows Server 2012 R2 Federation Services along with the Web Application Proxy.                                                                                                                                                | Deploy Windows Server 2012 R2 Federation Services along with the Web Application Proxy.           |
| Your Active Directory Domain Services forest must be configured with the objects and containers needed to support device objects. You will also enable Device Authentication in AD FS.                                                 | Prepare your Active Directory forest to support devices.                                          |
| Set up a federation relationship with your organization and Azure Active Directory.,This step will walk you through configuring your Azure Active Directory tenant with your Windows Server 2012 R2 Federation Services.               | Configure a federation relationship with Azure Active Directory and Configure Directory Sync Tool |
| Configure Directory Sync (DirSync) to allow device object write-back. Devices created in Azure Active Directory will be written down to your Active Directory.                                                                         | Configure DirSync to allow device object write-back                                               |
| It is strongly recommended that you configure a multi-factor authentication provider with Windows Server 2012 R2 Federation Services.,This will allow your users to securely register their devices using multi-factor authentication. | Configure federation services to provide multi-factor authentication.                             |


### Upgrade your Active Directory Domain Services Schema
> [AZURE.NOTE]
> Upgrading your Active Directory schema cannot be reversed. It is recommended that you perform this in a test environment.

1. Log in to your domain controller with an account that has both Enterprise Admin and Schema Admin rights.
2. Copy the [media]\support\adprep directory and sub-directories to one of your Active Directory domain controllers. 
3. Where [media] is the path to the Windows Server 2012 R2 installation media.
4. From a command prompt, navigate to the adprep directory and execute: adprep.exe /forestprep. Follow the onscreen instructions to complete the schema upgrade.

### Deploy Windows Server 2012 R2 Federation Services along with the Web Application Proxy
Follow the two guides below to deploy Windows Server 2012 R2 Federation Services with the Web Application Proxy and then return to this guide.
Follow the instructions for deploying a Windows Server 2012 R2 Federation Server Farm.

> [AZURE.NOTE]
> When deploying AD FS, you must skip the optional step named: Optional step: Configure a federation server with Device Registration Service (DRS). This step is not needed when using Azure Active Directory Device Registration.
Follow the instructions for deploying a Windows Server 2012 R2 Federation Server Proxy.

Install the latest update for Windows Server 2012 R2 on all of your Windows Server 2012 R2 Federation and Proxy servers. This can be done before or after configuring your federation farm. The update can be found here: Windows Server 2012 R2 Update.


### Prepare your Active Directory forest to support devices

> [AZURE.NOTE]
>This is a one-time operation that you must run to prepare your Active Directory forest to support devices. You must be logged on with enterprise administrator permissions and your Active Directory forest must have the Windows Server 2012 R2 schema to complete this procedure.

1. On your federation server, open a Windows PowerShell command window and type:
*Initialize-ADDeviceRegistration*

2. When prompted for ServiceAccountName, enter the name of the service account you selected as the service account for AD FS. If it is a gMSA account, enter the account in the domain\accountname$ format. For a domain account, use the format domain\accountname.


### Enable device authentication in AD FS

1. On your federation server, open the AD FS management console and navigate to **AD FS** > **Authentication Policies**.
2. Select E**dit Global Primary Authentication…** from the **Actions** pane.
3. Check **Enable device authentication** and then select**OK**.
4. By default, AD FS will periodically remove unused devices from Active Directory. You must disable this task when using Azure Active Directory Device Registration so that devices can be managed in Azure.


### Disable unused device cleanup
1. On your federation server, open a Windows PowerShell command window and type:
`*Set-AdfsDeviceRegistration -MaximumInactiveDays 0*`


###Configure a federation relationship with Azure Active Directory and Configure Directory Sync Tool
The following section will help you set up a federation trust between Azure Active Directory and AD FS. Some steps may take you away from this page. Follow the instructions below and then return to this guide.

Integrate Azure Active Directory with local Active Directory and configure single sign-on
------------------------------------------------------------------------------------------------------

1. Log on to the Azure Portal as **Administrator**.
2. On the left pane, select **Active Directory**.
3. On the **Directory** tab, select your directory.
4. Select the **Directory Integration** tab.
5. Under the integration with local active directory section, locate the Directory Sync option and select Activated.
6. Follow the steps 1 through 4 to integrate Azure Active Directory with your local directory. .
  1. **Add domains**
  2. **Configure single-sign on and prepare for directory sync**. If you have already deployed AD FS you can follow these sub-sections to configure and validate a trust between AD FS and Azure AD. 
      *  [Install Windows PowerShell for single sign-on with AD FS](https://msdn.microsoft.com/library/azure/jj151814.aspx).
      *  [Set up a trust between AD FS and Azure AD](https://msdn.microsoft.com/library/azure/jj205461.aspx).
      *  [Verify and manage single sign-on with AD FS](https://msdn.microsoft.com/library/azure/jj151809.aspx).
  	  *  [Additional AD FS References](https://msdn.microsoft.com/library/azure/dn151321.aspx)

  3. Install and run the directory sync tool. If you have already installed DirSync, you must upgrade to the latest version. The minimum version required is 6862.0000.
  4. Verify and manage directory sync 
  5. Configure some additional claim rules on the relying party trust object for Azure Active Directory. This relying party trust object is typically named Microsoft Office 365 Identity Platform.

###Configure the Azure Active Directory relying party trust claim rules

1. Open the AD FS management console and navigate to AD FS > Trust Relationships > **Relying Party Trusts**. Right-click on the **Microsoft Office 365 Identity Platform relying party trust object** and select **Edit Claim Rules…
2. On the **Issuance Transform Rules** tab, select Add Rule.**
3. Select **Send Claims Using a Custom Rule** from the **Claim** rule template drop down box. Select **Next**.
4. Type Auth Method Claim Rule in the **Claim rule name**: text box.
5. Type the following claim rule in the Claim rule: text box:

    ` c:[Type == "http://schemas.microsoft.com/claims/authnmethodsreferences"]`
       `=> issue(claim = c);`

6. Click **OK** twice to complete the dialog box.
7. Configure some additional authentication class references on the relying party trust object for Azure Active Directory. This relying party trust object is typically named Microsoft Office 365 Identity Platform.


###Configure the Azure Active Directory relying party trust authentication class reference

On your federation server, open a Windows PowerShell command window and type:

*Set-AdfsRelyingPartyTrust -TargetName <RPObjectName> -AllowedAuthenticationClassReferences wiaormultiauthn*


Where <RPObjectName> is the relying party object name for your Azure Active Directory relying party trust object. This object is typically named Microsoft Office 365 Identity Platform.

### Configure DirSync to allow device object write-back
You must configure Directory Sync (DirSync) to allow device object write-back. Devices created in Azure Active Directory will be written down to your Active Directory. Devices created in Azure Active Directory may take up to 3 hours before they are written back to Active Directory.
>[Azure.Note]
>You must be logged on with enterprise administrator permissions to complete the following procedure. Download the latest build of dirsync.exe here.

> Office 365 license or Azure AD Premium license is required to allow device write-back to Active Directory.

> If you have just completed the DirSync installation wizard, sign-out and then sign-in before continuing. This will ensure you have an updated access token.

>It can take up to 3 hours for device objects to be written-back to Active Directory Domain Services.

1. On your directory sync server, open a Windows PowerShell command window and issue the following commands:

    `Import-Module DirSync`
    
    `$AADCreds = Get-Credential`
    
    `$ADCreds = Get-Credential`

2. When prompted for credentials, type your cloud service administrator account credentials and your Active Directory administrator credentials.

*Enable-MSOnlineObjectManagement –ObjectTypes Device –TargetCredential $AADCreds -Credential $ADCreds*

### Configure federation services to provide multi-factor authentication
Devices that are registered with your organization can be used as a seamless second factor of authentication. Therefore, it is recommended that you require strong authentication when registering a device. You can follow the guide below to configure AD FS with Azure Multi-Factor Authentication and then return to this guide.
Follow the instructions for deploying Azure Multi-Factor Authentication.

## Join devices to your workplace using Azure Active Directory Device Registration

### Join an iOS device using Azure Active Directory Device Registration

Azure Active Directory Device Registration uses the Over-the-Air Profile enrollment process for iOS devices. This process begins with the user connecting to the profile enrollment URL using the Safari web browser. The URL format is as follows:

    https://enterpriseregistration.windows.net/enrollmentserver/otaprofile/"yourdomainname"

Where <yourdomainname> is the domain name that you have configured with Azure Active Directory. For example, if your domain name is contoso.com, the URL would be:

    https://enterpriseregistration.windows.net/enrollmentserver/otaprofile/contoso.com

There are many different ways to communicate this URL to your users. One recommended way is to publish this URL in a custom application access denied message in AD FS. This is covered in the upcoming section: Create an application access policy and custom access denied message.

###Join a Windows 8.1 device using Azure Active Directory Device Registration

1. On your Windows 8.1 device, navigate to **PC Settings** > **Network** > **Workplace**.
2. Enter your user name in UPN format. For example, dan@contoso.com..
3. Select **Join**.
4. When prompted, sign-in with your credentials. The device is now joined.

### Join an Android device using Azure Active Directory Device Registration

The Azure Authenticator for Android topic has instructions on how to install Azure authenticator app on your Android device and add a work account. When a work account is created successfully on an Android device, that device is workplace joined to the organization.

### Verify registered devices are written-back to Active Directory
You can view and verify that your device objects have been written back to your Active Directory using LDP.exe or ADSI Edit. Both are available with the Active Directory Administrator tools.

By default, device objects that are written-back from Azure Active Directory will be placed in the same domain as your AD FS farm.

`CN=RegisteredDevices,defaultNamingContext`

###Create an application access policy and custom access denied message
Consider the following scenario: You create an application Relying Party Trust in AD FS and configure an Issuance Authorization Rule that allows only registered devices. Now only devices that are registered are allowed to access the application. To make it easy for your users to gain access to the application, you configure a custom access denied message that includes instructions on how to join their device. Now your users have a seamless way to register their devices in order to access an application.

The following steps will show you how to implement this scenario.
>[AZURE.NOTE]
This section assumes that you have already configured a Relying Party Trust for your application in AD FS.

1. Open the AD FS MMC tool and navigate to AD FS > Trust Relationships > Relying Party Trusts.
2. Locate the application for which this new access rule will apply. Right-click the application and select Edit Claim Rules…
3. Select the **Issuance Authorization Rules** tab and then select **Add Rule…**
4. From the **Claim rule** template drop down list, select **Permit or Deny Users Based on an Incoming Claim**. Select **Next**.
5. In the Claim Rule name: field type: **Permit access from registered devices**
6. From the Incoming claim type: drop down list, select **Is Registered User**.
7. In the Incoming claim value: field, type: **true**
9. Select **Finish** and then select **Apply**.
10. Remove any rules that are more permissive than the rule you just created. For example, remove the default 
8. Select the **Permit access to users with this incoming claim** radio button.Permit Access to all Users rule.

Your application is now configured to allow access only when the user is coming from a device that they registered and joined to the workplace. For more advanced access polices, see Manage Risk with Multi-Factor Access Control.

Next, you will configure a custom error message for your application. The error message will let users know that they must join their device to the workplace before they are allowed access to the application. You can create a custom application access denied message using custom HTML and Windows PowerShell.

On your federation server, open a Windows PowerShell command window and type the following command. Replace portions of the command with items that are specific to your system:

`Set-AdfsRelyingPartyWebContent -Name "relying party trust name" -ErrorPageAuthorizationErrorMessage `
You must register your device before you can access this application.

**If you are using an iOS device, select this link to join your device**: 

    a href='https://enterpriseregistration.windows.net/enrollmentserver/otaprofile/yourdomain.com

Join this iOS device to your workplace.


**If you are using a Windows 8.1 device**, you can join your device by going to **PC Settings **> **Network** > **Workplace**.


Where "**relying party trust name**" is the name of your applications Relying Party Trust object in AD FS. 
 Where yourdomain.com is the domain name that you have configured with Azure Active Directory. For example, contoso.com. 
Be sure to remove any line breaks (if any) from the html content that you pass to the S**et-AdfsRelyingPartyWebContent** Cmdlet.



