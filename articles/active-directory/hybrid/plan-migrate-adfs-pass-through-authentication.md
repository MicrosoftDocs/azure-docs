---
title: 'Azure AD Connect: Migrate from federation to pass-through authentication for Azure Active Directory | Microsoft Docs'
description: Information about moving your hybrid identity environment from using federation to using pass-through authentication.
services: active-directory
author: billmath
manager: mtillman
ms.reviewer: martincoetzer
ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 12/13/2018
ms.component: hybrid
ms.author: billmath
---

# Migrate from federation to pass-through authentication for Azure Active Directory

This article describes how to move from using Active Directory Federation Services (AD FS) to using pass-through authentication.

> [!NOTE]
> [Download](https://aka.ms/ADFSTOPTADPDownload) this article.

## Prerequisites for pass-through authentication

The following prerequisites are required before you can migrate from AD FS to using pass-through authentication.

### Update Azure AD Connect

To successfully complete the steps to migrate to pass-through authentication, you must have [Azure Active Directory Connect](https://www.microsoft.com/download/details.aspx?id=47594) (Azure AD Connect) 1.1.819.0, at a minimum. In this version, the way sign-in conversion is performed changes significantly. The overall time to migrate from AD FS to cloud authentication is reduced from potentially hours to minutes.

> [!IMPORTANT]
> You might read in outdated documentation, tools, and blogs that user conversion is required when you convert domains from federated identity to managed identity. *Converting users* is no longer required. Microsoft is working to update documentation and tools to reflect this change.

To update Azure AD Connect to the latest version, complete the steps in [Azure AD Connect: Upgrade to the latest version](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-upgrade-previous-version).

### Plan authentication agent number and placement

Pass-through authentication is accomplished by deploying lightweight agents on the Azure AD Connect server, and on your on-premises computer that's running Windows Server. To reduce latency, install the agents as close as possible to your Active Directory domain controllers.

For most customers, two or three authentication agents are sufficient to provide high availability and the required capacity. A tenant can have a maximum of 12 agents registered. The first agent is always installed on the Azure AD Connect server itself. To learn about agent limitations and agent deployment options, see [Azure AD pass-through authentication: Current limitations](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-pass-through-authentication-current-limitations).

### Plan the migration method

You can choose from two methods to migrate from federated identity management to pass-through authentication and seamless single sign-on (SSO). The method you use depends on how your AD FS was originally configured.

- **Azure AD Connect**. If AD FS was originally configured by using Azure AD Connect, you *must* change to pass-through authentication by using the Azure AD Connect wizard.

   ‎Azure AD Connect runs the **Set-MsolDomainAuthentication** cmdlet for you automatically when you change the user sign-in method. Azure AD Connect automatically unfederates all the verified federated domains in your Azure AD tenant.  
   ‎  
   > [!NOTE]
   > Currently, if you originally used Azure AD Connect to configure AD FS, you can't avoid unfederating all domains in your tenant when you change the user sign-in to pass-through authentication.  
‎
- **Azure AD Connect with PowerShell**. You can use this method only if you didn't originally configure AD FS by using Azure AD Connect. You still need to change the user sign-in method via the Azure AD Connect wizard. The core difference is that the wizard doesn't automatically run the **Set-MsolDomainAuthentication** cmdlet because it has no awareness of your AD FS farm. With this option, you have full control over which domains are converted and in which order.

To understand which method you should use, complete the steps in the following section.

#### Verify current user sign-in settings

To verify your current user sign-in settings:

1. Sign in to the [Azure AD portal](https://aad.portal.azure.com/) by using a Global Administrator account.
2. In the **User sign-in** section, verify the following settings:
   - **Federation** is set to **Enabled**.
   - **Seamless single sign-on** is set to **Disabled**.
   - **Pass-through authentication** is set to **Disabled**. 

![Screenshot of the settings in the Azure AD Connect User sign-in section](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image1.png)

#### Verify how federation was configured

1. On your Azure AD Connect server, open Azure AD Connect. Then, select **Configure**.
2. On the **Additional tasks** page, select **View current configuration**, and then select **Next**.<br />
 
   ![Screenshot of the View current configuration option on the Additional tasks page](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image2.png)<br />
3. On the **Review your solution** page, scroll to **Active Directory Federation Services (AD FS)**.<br />

   ‎If the AD FS configuration appears in this section, you can safely assume that AD FS was originally configured by using Azure AD Connect. You can convert your domains from federated identity to managed identity by using the Azure AD Connect **Change user sign-in** option. For more information about the process, see the section **Option 1: Configure pass-through authentication by using Azure AD Connect**.  
‎
4. If AD FS isn't listed in the current settings, you must manually convert the domains from federated identity to managed identity by using PowerShell. For more information about this process, see the section **Option 2 - Switch from Federation to PTA using Azure AD Connect and PowerShell**.

### Document current federation settings

To find your current federation settings, run the **Get-MsolDomainFederationSettings** cmdlet:

``` PowerShell
Get-MsolDomainFederationSettings -DomainName YourDomain.extention | fl *
```

Example:

``` PowerShell
Get-MsolDomainFederationSettings -DomainName Contoso.com | fl *
```

Validate any settings that might have been customized for your federation design and deployment documentation. Specifically, look for customizations in **PreferredAuthenticationProtocol**, **SupportsMfa**, and **PromptLoginBehavior**.

For more information, see these articles:

* [AD FS prompt=login parameter support](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/ad-fs-prompt-login)  
‎* [Set-MsolDomainAuthentication](https://docs.microsoft.com/powershell/module/msonline/set-msoldomainauthentication?view=azureadps-1.0)

> [!NOTE]
> If **SupportsMfa** is set to **True**, you're using an on-premises multi-factor authentication solution to add a second-factor challenge to the user authentication flow. The setup no longer works for Azure AD authentication scenarios. Instead, you must use the Azure Multi-Factor Authentication cloud-based service to perform the same function. Carefully evaluate your MFA requirements before you continue. Make sure that you understand how to use Multi-Factor Authentication, licensing implications, and the end-user registration process before you convert your domains.

#### Backup federation settings

Although no changes are made to other relying parties in your AD FS farm during the process, we recommend that you have a current valid backup of your AD FS farm that you can restore from. You can create a current valid backup by using the free Microsoft [AD FS Rapid Restore Tool](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/ad-fs-rapid-restore-tool). You can use the tool to back up and restore AD FS, either to an existing farm, or use it to create a farm.

If you choose not to use the AD FS Rapid Restore Tool, at a minimum, you should export the Microsoft Office 365 Identity Platform relying party trust and any associated custom claim rules you added. You can export the relying party trust and associated claim rules that you added by using the following PowerShell example:

``` PowerShell
(Get-AdfsRelyingPartyTrust -Name "Microsoft Office 365 Identity Platform") | Export-CliXML "C:\temp\O365-RelyingPartyTrust.xml"
```

## Deployment considerations and AD FS usage

This section describes deployment considerations and details about using AD FS.

### Validate your current AD FS usage

Before you convert from federated identity to managed identity, look closely at how you use AD FS today for Azure AD, Office 365, and other applications (relying party trusts). Specifically, consider the scenarios that are described in the following table:

| If | Then |
|-|-|
| You plan to retain AD FS for other applications (other than Azure AD and Office 365) | You will use both AD FS and Azure AD. You need to consider the end-user experience. Users might need to authenticate twice in some scenarios: once to Azure AD (where they will get SSO access to other applications, like Office 365). Users will need to authenticate again for any applications that are still bound to AD FS as a relying party trust. |
| AD FS is heavily customized and reliant on specific customization settings in the onload.js file. The onload.js file can't be duplicated in Azure AD (for example, you have changed the sign-in experience so that users enter only a **SamAccountName** format for their username instead of a UPN, or your organization has heavily branded the sign-in experience)| Before you continue, you must verify that Azure AD can satisfy your current customization requirements. For more information and for guidance, see the AD FS Branding and AD FS Customization sections.|
| You block legacy authentication clients by using AD FS.| Consider replacing the controls currently on AD FS that block legacy authentication clients by using a combination of [conditional access controls for legacy authentication](https://docs.microsoft.com/azure/active-directory/conditional-access/conditions) and [Exchange Online Client Access Rules](http://aka.ms/EXOCAR). |
| You require users to perform multi-factor authentication against an on-premises multi-factor authentication server solution when authenticating to AD FS.| You won't be able to inject a multi-factor authentication challenge via the on-premises multi-factor authentication solution into the authentication flow for a managed domain. However, you can use the Azure Multi-Factor Authentication service for multi-factor authentication after the domain is converted. If users aren't using Azure Multi-Factor Authentication today, a onetime user registration step is required. You'll need to prepare for and communicate the planned registration to your users. |
| You use access control policies (AuthZ rules) today in AD FS to control access to Office 365.| Consider replacing these with the equivalent Azure AD [conditional access policies](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-azure-portal) and [Exchange Online Client Access Rules](http://aka.ms/EXOCAR).|

### Considerations for common AD FS customizations

This section describes considerations for common AD FS customizations.

#### InsideCorporateNetwork claim

AD FS issues the **InsideCorporateNetwork** claim if the user who is authenticating is inside the corporate network. This claim can then be passed on to Azure AD. The claim is used to bypass multi-factor authentication based on the user's network location. See [Trusted IPs for federated users](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-get-started-adfs-cloud) for information about how to determine whether this functionality currently is enabled in AD FS.

The **InsideCorporateNetwork** claim isn't available after your domains are converted to pass-through authentication. You can use [named locations in Azure AD](https://docs.microsoft.com/azure/active-directory/active-directory-named-locations) to replace this functionality.

After you configure named locations, you must update all conditional access policies that were configured to either include or exclude the network locations **All trusted locations** or **MFA Trusted IPs** to reflect the new named locations.

For more information about the Location condition in conditional access, see [Active Directory conditional access locations](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-locations).

#### Hybrid Azure AD-joined devices

When you join a device to Azure AD, you can create conditional access rules that enforce that devices meet your access standards for security and compliance. Also, users can sign in to a device by using an organizational work or school account instead of a personal account. When you use hybrid Azure AD-joined devices, you can join your AD domain-joined devices to Azure AD. Your federated environment might have been set up to use this feature.

To ensure that hybrid join continues to work for any new devices that are joined to the domain after your domains are converted to pass-through authentication, you must use Azure AD Connect to sync Active Directory computer accounts for Windows 10 clients to Azure AD. For Windows 8 and Windows 7 computer accounts, hybrid join uses seamless SSO to register the computer in Azure AD. You don't have to sync Windows 8 and Windows 7 computer accounts like you do for Windows 10 devices. However, you must deploy an updated workplacejoin.exe file (via an .msi file) to these down-level clients so they can register themselves by using seamless SSO. [Download the .msi file](https://www.microsoft.com/download/details.aspx?id=53554).

For more information about this requirement, see [How to configure hybrid Azure Active Directory-joined devices](https://docs.microsoft.com/azure/active-directory/device-management-hybrid-azuread-joined-devices-setup).

#### Branding

If your organization [customized your AD FS sign-in pages](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/ad-fs-user-sign-in-customization) to display information that's more pertinent to the organization, consider making similar [customizations to the Azure AD sign-in page](https://docs.microsoft.com/azure/active-directory/customize-branding).

Although similar customizations are available, some visual changes should be expected. You might want to include expected changes in your communications to your users.

> [!NOTE]
> Company branding is available only if you purchase the Premium or Basic license for Azure AD or if you have an Office 365 license.

## Plan for smart lockout

Azure AD smart lockout protects against brute-force password attacks. It prevents an on-premises Active Directory account from being locked out when pass-through authentication is being used and an account lockout group policy is set in Active Directory. 

For more information, see [Smart lockout feature and how to edit its configuration](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-pass-through-authentication-smart-lockout).

## Plan deployment and support

### Plan the maintenance window

Although the domain conversion process is relatively quick, Azure AD might still send some authentication requests to your AD FS servers for up to 4 hours after the domain conversion is finished. During this 4-hour window, and depending on various service side caches, Azure AD might not accept these authentications. Users might receive an error: they can still successfully authenticate against AD FS, but Azure AD no longer accepts a user’s issued token because that federation trust is now removed.

> [!NOTE]
> This will impact only users who access the services via a web browser during this post-conversion window before the service side cache is cleared. Legacy clients (Exchange ActiveSync, Outlook 2010/2013) aren't expected to be affected because Exchange Online keeps a cache of their credentials for a period of time. The cache is used to reauthenticate the user silently and the user doesn't need to return to AD FS. Credentials stored on the device for these clients are used to reauthenticate themselves silently after this cached is cleared. Users aren't expected to receive any password prompts as a result of the domain conversion process. 

Modern authentication clients (Office 2013/2016, iOS, and Android Apps) use a valid refresh token to obtain new access tokens for continued access to resources instead of returning to AD FS. These clients are immune to any password prompts as a result of the domain conversion process. The clients will continue to function without additional configuration.

> [!IMPORTANT]
> Don’t shut down your AD FS environment or remove the Office 365 relying party trust until you have verified that all users can successfully authenticate by using cloud authentication.

### Plan for rollback

If a major issue is found and can't be resolved quickly, you might decide to roll back the solution to federation. It’s important to plan what to do if your deployment doesn’t go as planned. If the conversion of the domain or users fails during the deployment, or if you need to roll back to federation, you must understand how to mitigate any outage and reduce the effect on your users.

#### To roll back

To plan for rollback, consult your federation design and deployment documentation for your particular deployment details. The process should involve:

* Convert managed domains to federated domains by using the **Convert-MSOLDomainToFederated** cmdlet.
* If necessary, configure additional claims rules.

### Plan change communications

An important part of planning deployment and support is ensuring that your users are proactively informed about the changes. They should know in advance what they might experience and what they must do. 

After both pass-through authentication and seamless SSO are deployed, the user sign-in experience changes for accessing Office 365 and other associated resources that are authenticated through Azure AD. Users who are external to the network see only the Azure AD sign-in page. They aren't redirected to the forms-based page that's presented by external-facing web application proxy servers.

Include the following elements in your communication strategy:

* Notify users about upcoming and released functionality by using:
  * Email and other internal communication channels.
  * Visuals, such as posters.
  * Executive, live, or other communications.
* Determine who will customize the communications, who will send the communications, and when.

## Implement your solution

With your solution planned, you can now implement it. Implementation includes the following components:

1. Prepare for seamless SSO.
2. Change sign-in method pass-through authentication and enable seamless SSO.

## Step 1: Prepare for seamless SSO

To your devices to use seamless SSO, add an Azure AD URL to users' intranet zone settings by using a group policy in Active Directory.

By default, web browsers automatically calculate the correct zone, either internet or intranet, from a URL. For example, **http:\/\/contoso/** maps to the intranet zone and **http:\/\/intranet.contoso.com** maps to the internet zone (because the URL contains a period). Browsers don't send Kerberos tickets to a cloud endpoint like the Azure AD URL unless you explicitly add the URL to the browser's intranet zone.

Complete the steps to [roll out](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-sso-quick-start) the required changes to your devices.

> [!IMPORTANT]
> Making this change doesn't modify the way your users sign in to Azure AD. However, it’s important that you apply this configuration to all your devices before you continue with the step 3. Also, note that users who sign in on devices that haven't received this configuration simply are required to enter a username and password to sign in to Azure AD.

## Step 2: Change sign-in method to pass-through authentication and enable seamless SSO

### Option A: Configure pass-through authentication by using Azure AD Connect

Use this method if your AD FS environment was initially configured by using Azure AD Connect. You can't use this method if your AD FS environment wasn't originally configured by using Azure AD Connect.

> [!IMPORTANT]
> When you complete the following steps, all your domains are converted from federated identity to managed identity. For more information, review the section [Plan the migration method](#plan-the-migration-method).

First, change the sign-on method:

1. On the Azure AD Connect server, open the wizard.
2. Select **Change user sign-in**, and then select **Next**. 
3. On the **Connect to Azure AD** page, enter the username and password of a Global Administrator account.
4. On the **User sign-in** page, change the radio button from **Federation with AD FS** to **Pass-through authentication**, select **Enable single sign-on**, and then select **Next**.
5. On the **Enable single sign-on** page, enter the credentials of a Domain Administrator account, and then select **Next**.  

   > [!NOTE]
   > Domain Administrator account credentials are required to enable seamless SSO. The process completes the following actions, which require these elevated permissions. The Domain Administrator account credentials aren't stored in Azure AD Connect or in Azure AD. The Domain Administrator account credentials are used only to enable the feature. The credentials are discarded when the process successfully finishes.
   >
   > 1. A computer account named AZUREADSSOACC (which represents Azure AD) is created in your on-premises Active Directory instance.
   > 2. The computer account's Kerberos decryption key is shared securely with Azure AD.
   > 3. Two Kerberos service principal names (SPNs) are created to represent two URLs that are used during Azure AD sign-in.
   > 4. The Domain Administrator account credentials aren't stored in Azure AD Connect or Azure AD. The credentials are used only to enable the feature. The credentials are when the process successfully finishes.

6. On the **Ready to configure** page, make sure that the **Start the synchronization process when configuration completes** check box is selected. Then, select **Configure**.<br />

   ![Screenshot of the Ready to configure page](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image8.png)<br />
7. In the Azure AD portal, select **Azure Active Directory**, and then select **Azure AD Connect**.
8. Verify these settings:
  - **Federation** is set to **Disabled**.
  - **Seamless single sign-on** is set to **Enabled**.
  - **Pass-through authentication** is set to **Enabled**.<br />
   ![Screenshot that shows the settings in the User sign-in section](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image9.png)<br />

Next. deploy additional authentication methods:

1. In the Azure portal, go to **Azure Active Directory** > **Azure AD Connect**, and then select **Pass-through authentication**.
2. On the **Pass-through authentication** page, select the **Download** button.
3. On the **Download agent** page, select **Accept terms and download**.

  Additional authentication agents begin to download. Install the secondary authentication agent on a domain-joined server. 

  > [!NOTE]
  > The first agent is always installed on the Azure AD Connect server itself as part of the configuration changes made in the **User sign-in** section of the Azure AD Connect tool. Install any additional authentication agents on a separate server. We recommend that you have two or three additional authentication agents available. 

4. Run the authentication agent installation. During installation, you must enter the credentials of a Global Administrator account.

  ![Screenshot that shows the Install button on the Microsoft Azure AD Connect Authentication Agent Package page](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image11.png)

  ![Screenshot that shows the sign-in page](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image12.png)

5. When the authentication agent is installed, you can go back to the pass-through authentication agent health page to check the status of the additional agents.

Skip to [Testing and next steps](#testing-and-next-steps).

> [!IMPORTANT]
> Skip the section **Option B: Switch from federation to pass-through authentication by using Azure AD Connect and PowerShell**. The steps in that section don't apply.  

### Option B: Switch from federation to pass-through authentication by using Azure AD Connect and PowerShell

Use this option when your federation wasn't initially configured by using Azure AD Connect. First, enable pass-through authentication:

1. On the Azure AD Connect Server, open the wizard.
2. Select **Change user sign-in**, and then select **Next**.
3. On the **Connect to Azure AD** page, enter the username and password of a Global Administrator account.
4. On the **User sign-in** page, select the **Pass-through authentication** button. Select **Enable single sign-on**, and then select **Next**.
5. On the **Enable single sign-on** page, enter the credentials of a Domain Administrator account, and then select **Next**.

   > [!NOTE]
   > Domain Administrator account credentials are required to enable seamless SSO. The process completes the following actions, which require these elevated permissions. The Domain Administrator account credentials aren't stored in Azure AD Connect or Azure AD. They're used only to enable the feature and then discarded after successful completion.
   >
   > 1. A computer account named AZUREADSSOACC (which represents Azure AD) is created in your on-premises Active Directory instance.
   > 2. The computer account's Kerberos decryption key is shared securely with Azure AD.
   > 3. Two Kerberos service principal names (SPNs) are created to represent two URLs that are used during Azure AD sign-in.

6. On the **Ready to configure** page, make sure that the **Start the synchronization process when configuration completes** check box is selected. Then, select **Configure**.<br />

   ‎![Screenshot that shows the Ready to configure page and the Configure button](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image18.png)<br />
   The following steps occur when you select **Configure**:
   1. The first pass-through authentication agent is installed.
   2. The pass-through feature is enabled.
   3. Seamless SSO is enabled.

7. Verify the following settings:
   - **Federation** is set to **Enabled**.
   - **Seamless single sign-on** is set to **Enabled**.
   - **Pass-through authentication** is set to **Enabled**.
   
   ![Screenshot that shows the settings in the User sign-in section](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image19.png)
8. Select **Pass-through authentication** and verify that the status is **Active**.<br />
   
   If the authentication agent isn't active, complete some [troubleshooting steps](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-troubleshoot-pass-through-authentication) before you continue with the domain conversation process in the next step. You risk causing an authentication outage if you convert your domains before you validate that your pass-through authentication agents are successfully installed, and that their status **Active** in the Azure portal.  
9. Next, deploy additional authentication agents. In the Azure portal, go to **Azure Active Directory** > **Azure AD Connect**, and then select **Pass-through Authentication**.
10. On the **Pass-through authentication** page, select the **Download** button. 
11. On the **Download agent** page, select **Accept terms and download**.
   
   The authentication agent starts to download. Install the secondary authentication agent on a domain-joined server.

   > [!NOTE]
   > The first agent is always installed on the Azure AD Connect server itself as part of the configuration changes made in the **User sign-in** section of the Azure AD Connect tool. Install any additional authentication agents on a separate server. We recommend that you have two or three additional authentication agents available.
  
11. Run the authentication agent installation. During the installation, you must enter the credentials of a **Global Administrator** account.<br />

   ![Screenshot that shows the Install button on the Microsoft Azure AD Connect Authentication Agent Package page](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image23.png)<br />
   ![Screenshot that shows the sign-in page](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image24.png)<br />
12. When the authentication agent is installed, you can go back to the pass-through authentication agent health page to check the status of the additional agents.

At this point, federated authentication is still active and operational for your domains. To continue with the deployment, you must convert each domain from federated identity to managed identity so that pass-through authentication starts serving authentication requests for the domain.

You don't have to convert all domains at the same time. You might choose to start with a test domain on your production tenant, or start with your domain that has the lowest number of users.

Complete the conversion by using the Azure AD PowerShell module:

1. In PowerShell, sign in to Azure AD by using a Global Administrator account.
2. To convert the first domain, run the following command:
 
   ``` PowerShell
   Set-MsolDomainAuthentication -Authentication Managed -DomainName <domain name>
   ```
 
3. Open the **Azure AD portal**, select **Azure Active Directory**, and then select **Azure AD Connect**.  
4. After you convert all your federated domains, verify these settings:
   - **Federation** is set to **Disabled**.
   - **Seamless single sign-on** is set to **Enabled**.
   - **Pass-through authentication** is set to **Enabled**.<br />

   ![Screenshot that shows the settings in the User sign-in section](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image26.png)<br />

## Testing and next steps

Complete the following tasks to verify pass-through authentication and complete the conversion process.

### Test pass-through authentication 

When your tenant used federated identity, users were redirected from the Azure AD sign-in page to your AD FS environment. Now that the tenant is configured to use pass-through authentication instead of federation authentication, users aren't redirected to AD FS. Instead, users sign in directly on the Azure AD sign-in page.

1. Open Internet Explorer in InPrivate mode so that seamless SSO doesn't sign you in automatically.
2. Go to the Office 365 sign-in page ([http://portal.office.com](http://portal.office.com/)).
3. Enter a user UPN, and then select **Next**. Make sure you enter the UPN of a hybrid user that was synced from your on-premises Active Directory instance, and who previously used federated authentication. A page on which you enter the username and password appears:

   ![Screenshot that shows the sign-in page in which you enter a username](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image27.png)

   ![Screenshot that shows the sign-in page in which you enter a password](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image28.png)

4. After you enter the password and select **Sign in**, you're redirected to the Office 365 portal.

   ![Screenshot that shows the Office 365 portal](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image29.png)

### Test seamless SSO

1. Sign in to a domain-joined machine that is connected to the corporate network. 
2. In Internet Explorer or Chrome, go to one of the following URLs (replace "contoso" with your domain):   
      ‎  
   - `https://myapps.microsoft.com/contoso.com`
   - `https://myapps.microsoft.com/contoso.onmicrosoft.com`

   The user is briefly redirected to the Azure AD sign-in page that shows the message "Trying to sign you in." The user isn't prompted for a username or password.<br />

   ![Screenshot that shows the Azure AD sign-in page and message](media/plan-migrate-adfs-pass-through-authentication/migrating-adfs-to-pta_image30.png)<br />
3. The user is redirected and is successfully signed in to the access panel:

   > [!NOTE]
   > Seamless SSO works on Office 365 services that support domain hint (for example, myapps.microsoft.com/contoso.com). Currently, the Office 365 portal (portal.office.com) doesn’t support domain hint. Users are required to type their UPN. After a UPN is entered, seamless SSO retrieves the Kerberos ticket on behalf of the user. The user is signed in without entering a password.
   
   > [!TIP]
   > Consider deploying [Azure AD hybrid join on Windows 10](https://docs.microsoft.com/azure/active-directory/device-management-introduction) for an improved SSO experience.

### Remove the relying party trust

After you validate that all users and clients are successfully authenticating via Azure AD, it's safe to remove the Office 365 relying party trust.

If you don't use AD FS for other purposes (for other relying party trusts), it's safe to decommission AD FS at this point.

### Rollback

If you discover a major issue and can't resolve it quickly, you might choose to roll back the solution back to federation.

Consult your federation design and deployment documentation for your specific deployment details. The process should involve these tasks:

* Convert managed domains to federated authentication by using the **Convert-MSOLDomainToFederated** cmdlet.
* If necessary, configure additional claims rules.

### Sync userPrincipalName updates

Historically, updates to the **UserPrincipalName** attribute, which uses the sync service from the on-premises environment, are blocked unless both of these conditions are true:

* The user is in a managed (non-federated) identity domain.
* The user hasn't been assigned a license.

To learn how to verify or turn on this feature, see [Sync userPrincipalName updates](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsyncservice-features).

## Roll over the seamless SSO Kerberos decryption key

It's important to frequently roll over the Kerberos decryption key of the AZUREADSSOACC computer account (which represents Azure AD). The AZUREADSSOACC computer account is created in your on-premises Active Directory forest. We highly recommend that you roll over the Kerberos decryption key at least every 30 days to align with the way that Active Directory domain members submit password changes. There's no associated device attached to the AZUREADSSOACC computer account object, so you must perform the rollover manually.

Follow these steps on the on-premises server where you are running Azure AD Connect to initiate the roll-over of the Kerberos decryption key.

For more information, see [How do I roll over the Kerberos decryption key of the AZUREADSSOACC computer account?](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-sso-faq)

## Monitoring and logging

The servers that run the authentication agents should be monitored to maintain the solution availability. In addition to general server performance counters, the authentication agents expose performance objects that can be used to understand authentication statistics and errors.

Authentication agents log operations to Windows event logs under Application and Service Logs\Microsoft\AzureAdConnect\AuthenticationAgent\Admin.

Troubleshooting logs can be enabled, if necessary.

For more information, see [Troubleshoot Azure Active Directory pass-through authentication](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-troubleshoot-Pass-through-authentication).

## Next steps

- Learn about [Azure AD Connect design concepts](plan-connect-design-concepts.md).
- Choose the [right authentication](https://docs.microsoft.com/azure/security/azure-ad-choose-authn).
- Learn about [supported topologies](plan-connect-design-concepts.md).
