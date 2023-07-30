---
title: How to use the MFA Server Migration Utility to migrate to Azure AD MFA
description: Step-by-step guidance to migrate MFA server settings to Azure AD using the MFA Server Migration Utility.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 06/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: jpettere

ms.collection: M365-identity-device-management
---
# MFA Server migration 

This topic covers how to migrate MFA settings for Azure Active Directory (Azure AD) users from on-premises Azure MFA Server to Azure AD Multi-Factor Authentication. 

## Solution overview

The MFA Server Migration Utility helps synchronize multifactor authentication data stored in the on-premises Azure MFA Server directly to Azure AD MFA. 
After the authentication data is migrated to Azure AD, users can perform cloud-based MFA seamlessly without having to register again or confirm authentication methods. 
Admins can use the MFA Server Migration Utility to target single users or groups of users for testing and controlled rollout without having to make any tenant-wide changes.

## Video: How to use the MFA Server Migration Utility

Take a look at our video for an overview of the MFA Server Migration Utility and how it works.

>[!VIDEO https://www.microsoft.com/videoplayer/embed/RW11N1N]

## Limitations and requirements

- The MFA Server Migration Utility requires a new build of the MFA Server solution to be installed on your Primary MFA Server. The build makes updates to the MFA Server data file, and includes the new MFA Server Migration Utility. You don’t have to update the WebSDK or User portal. Installing the update _doesn't_ start the migration automatically.
- The MFA Server Migration Utility copies the data from the database file onto the user objects in Azure AD. During migration, users can be targeted for Azure AD MFA for testing purposes using [Staged Rollout](../hybrid/how-to-connect-staged-rollout.md). Staged migration lets you test without making any changes to your domain federation settings. Once migrations are complete, you must finalize your migration by making changes to your domain federation settings.
- AD FS running Windows Server 2016 or higher is required to provide MFA authentication on any AD FS relying parties, not including Azure AD and Office 365. 
- Review your AD FS access control policies and make sure none requires MFA to be performed on-premises as part of the authentication process.
- Staged rollout can target a maximum of 500,000 users (10 groups containing a maximum of 50,000 users each).

## Migration guide

|Phase|Steps|
|:---------|:--------|
|Preparations |[Identify Azure AD MFA Server dependencies](#identify-azure-ad-mfa-server-dependencies) |
||[Backup Azure AD MFA Server datafile](#backup-azure-ad-mfa-server-datafile) |
||[Install MFA Server update](#install-mfa-server-update) |
||[Configure MFA Server Migration Utility](#configure-the-mfa-server-migration-utility) |
|Migrations |[Migrate user data](#migrate-user-data)|
||[Validate and test](#validate-and-test)|
||[Staged Rollout](#enable-staged-rollout-using-azure-portal) |
||[Educate users](#educate-users)|
||[Complete user migration](#complete-user-migration)|
|Finalize |[Migrate MFA Server dependencies](#migrate-mfa-server-dependencies)|
||[Update domain federation settings](#update-domain-federation-settings)|
||[Disable MFA Server User portal](#optional-disable-mfa-server-user-portal)|
||[Decommission MFA server](#decommission-mfa-server)|

An MFA Server migration generally includes the steps in the following process:

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/migration-phases.png" alt-text="Diagram of MFA Server migration phases.":::

A few important points:

**Phase 1** should be repeated as you add test users. 
  - The migration tool uses Azure AD groups for determining the users for which authentication data should be synced between MFA Server and Azure AD MFA. After user data has been synced, that user is then ready to use Azure AD MFA. 
  - Staged Rollout allows you to reroute users to Azure AD MFA, also using Azure AD groups. 
    While you certainly could use the same groups for both tools, we recommend against it as users could potentially be redirected to Azure AD MFA before the tool has synched their data. We recommend setting up Azure AD groups for syncing authentication data by the MFA Server Migration Utility, and another set of groups for Staged Rollout to direct targeted users to Azure AD MFA rather than on-premises.

**Phase 2** should be repeated as you migrate your user base. By the end of Phase 2, your entire user base should be using Azure AD MFA for all workloads federated against Azure AD.

During the previous phases, you can remove users from the Staged Rollout folders to take them out of scope of Azure AD MFA and route them back to your on-premises Azure MFA server for all MFA requests originating from Azure AD.

**Phase 3** requires moving all clients that authenticate to the on-premises MFA Server (VPNs, password managers, and so on) to Azure AD federation via SAML/OAUTH. If modern authentication standards aren’t supported, you're required to stand up NPS server(s) with the Azure AD MFA extension installed. Once dependencies are migrated, users should no longer use the User portal on the MFA Server, but rather should manage their authentication methods in Azure AD ([aka.ms/mfasetup](https://aka.ms/mfasetup)). Once users begin managing their authentication data in Azure AD, those methods won't be synced back to MFA Server. If you roll back to the on-premises MFA Server after users have made changes to their Authentication Methods in Azure AD, those changes will be lost. After user migrations are complete, change the [federatedIdpMfaBehavior](/graph/api/resources/internaldomainfederation?view=graph-rest-1.0#federatedidpmfabehavior-values&preserve-view=true) domain federation setting. The change tells Azure AD to no longer perform MFA on-premises and to perform _all_ MFA requests with Azure AD MFA, regardless of group membership. 

The following sections explain the migration steps in more detail.

### Identify Azure AD MFA Server dependencies

We've worked hard to ensure that moving onto our cloud-based Azure AD MFA solution will maintain and even improve your security posture. There are three broad categories that should be used to group dependencies:

- [MFA methods](#mfa-methods)
- [User portal](#user-portal)
- [Authentication services](#authentication-services)

To help your migration, we've matched widely used MFA Server features with the functional equivalent in Azure AD MFA for each category. 

#### MFA methods

Open MFA Server, click **Company Settings**:

:::image type="content" border="false" source="./media/how-to-mfa-server-migration-utility/company-settings.png" alt-text="Screenshot of Company Settings.":::


|MFA Server|Azure AD MFA|
|:---------|:--------|
|**General Tab**||
|**User Defaults section**||
|Phone call (Standard)|No action needed|
|Text message (OTP)<sup>*</sup>|No action needed|
|Mobile app (Standard)|No action needed|
|Phone Call (PIN)<sup>*</sup>|Enable Voice OTP |
|Text message (OTP + PIN)<sup>**</sup>|No action needed|
|Mobile app (PIN)<sup>*</sup>|Enable [number matching](how-to-mfa-number-match.md) |
|Phone call/text message/mobile app/OATH token language|Language settings will be automatically applied to a user based on the locale settings in their browser|
|**Default PIN rules section**|Not applicable; see updated methods in the preceding screenshot|
|**Username Resolution tab**|Not applicable; username resolution isn't required for Azure AD MFA|
|**Text Message tab**|Not applicable; Azure AD MFA uses a default message for text messages|
|OATH Token tab|Not applicable; Azure AD MFA uses a default message for OATH tokens|
|Reports|[Azure AD Authentication Methods Activity reports](howto-authentication-methods-activity.md)|

<sup>*</sup>When a PIN is used to provide proof-of-presence functionality, the functional equivalent is provided above. PINs that aren’t cryptographically tied to a device don't sufficiently protect against scenarios where a device has been compromised. To protect against these scenarios, including [SIM swap attacks](https://wikipedia.org/wiki/SIM_swap_scam), move users to more secure methods according to Microsoft authentication methods [best practices](concept-authentication-methods.md).

<sup>**</sup>The default SMS MFA experience in Azure AD MFA sends users a code, which they're required to enter in the login window as part of authentication. The requirement to roundtrip the SMS code provides proof-of-presence functionality.

#### User portal 

Open MFA Server, click **User Portal**:

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/user-portal.png" alt-text="Screenshot of User portal.":::

|MFA Server|Azure AD MFA|
|:--------:|:-------:|
|**Settings Tab**||
|User portal URL|[aka.ms/mfasetup](https://aka.ms/mfasetup)|
|Allow user enrollment|See [Combined security information registration](concept-registration-mfa-sspr-combined.md)|
|- Prompt for backup phone|See [MFA Service settings](howto-mfa-mfasettings.md#mfa-service-settings)|
|- Prompt for third-party OATH token|See [MFA Service settings](howto-mfa-mfasettings.md#mfa-service-settings)|
|Allow users to initiate a One-Time Bypass|See [Azure AD TAP functionality](howto-authentication-temporary-access-pass.md)|
|Allow users to select method|See [MFA Service settings](howto-mfa-mfasettings.md#mfa-service-settings)|
|- Phone call|See [Phone call documentation](howto-mfa-mfasettings.md#phone-call-settings)|
|- Text message|See [MFA Service settings](howto-mfa-mfasettings.md#mfa-service-settings)|
|- Mobile app|See [MFA Service settings](howto-mfa-mfasettings.md#mfa-service-settings)|
|- OATH token|See [OATH token documentation](howto-mfa-mfasettings.md#oath-tokens)|
|Allow users to select language|Language settings will be automatically applied to a user based on the locale settings in their browser|
|Allow users to activate mobile app|See [MFA Service settings](howto-mfa-mfasettings.md#mfa-service-settings)|
|- Device limit|Azure AD limits users to five cumulative devices (mobile app instances + hardware OATH token + software OATH token) per user|
|Use security questions for fallback|Azure AD allows users to choose a fallback method at authentication time should the chosen authentication method fail|
|- Questions to answer|Security Questions in Azure AD can only be used for SSPR. See more details for [Azure AD Custom Security Questions](concept-authentication-security-questions.md#custom-security-questions)|
|Allow users to associate third-party OATH token|See [OATH token documentation](howto-mfa-mfasettings.md#oath-tokens)|
|Use OATH token for fallback|See [OATH token documentation](howto-mfa-mfasettings.md#oath-tokens)|
|Session Timeout||
|**Security Questions tab**	|Security questions in MFA Server were used to gain access to the User portal. Azure AD MFA only supports security questions for self-service password reset. See [security questions documentation](concept-authentication-security-questions.md).|
|**Passed Sessions tab**|All authentication method registration flows are managed by Azure AD and don’t require configuration|
|**Trusted IPs**|[Azure AD trusted IPs](howto-mfa-mfasettings.md#trusted-ips)|

Any MFA methods available in MFA Server must be enabled in Azure AD MFA by using [MFA Service settings](howto-mfa-mfasettings.md#mfa-service-settings). 
Users can't try their newly migrated MFA methods unless they're enabled.

#### Authentication services
Azure MFA Server can provide MFA functionality for third-party solutions that use RADIUS or LDAP by acting as an authentication proxy. To discover RADIUS or LDAP dependencies, click **RADIUS Authentication** and **LDAP Authentication** options in MFA Server. For each of these dependencies, determine if these third parties support modern authentication. If so, consider federation directly with Azure AD. 

For RADIUS deployments that can’t be upgraded, you’ll need to deploy an NPS Server and install the [Azure AD MFA NPS extension](howto-mfa-nps-extension.md). 

For LDAP deployments that can’t be upgraded or moved to RADIUS, [determine if Azure Active Directory Domain Services can be used](../fundamentals/auth-ldap.md). In most cases, LDAP was deployed to support in-line password changes for end users. Once migrated, end users can manage their passwords by using [self-service password reset in Azure AD](tutorial-enable-sspr.md).

If you enabled the [MFA Server Authentication provider in AD FS 2.0](./howto-mfaserver-adfs-windows-server.md#secure-windows-server-ad-fs-with-azure-multi-factor-authentication-server) on any relying party trusts except for the Office 365 relying party trust, you’ll need to upgrade to [AD FS 3.0](/windows-server/identity/ad-fs/deployment/upgrading-to-ad-fs-in-windows-server) or federate those relying parties directly to Azure AD if they support modern authentication methods. Determine the best plan of action for each of the dependencies.

### Backup Azure AD MFA Server datafile
Make a backup of the MFA Server data file located at %programfiles%\Multi-Factor Authentication Server\Data\PhoneFactor.pfdata (default location) on your primary MFA Server. Make sure you have a copy of the installer for your currently installed version in case you need to roll back. If you no longer have a copy, contact Customer Support Services. 

Depending on user activity, the data file can become outdated quickly. Any changes made to MFA Server, or any end-user changes made through the portal after the backup won't be captured. If you roll back, any changes made after this point won't be restored.

### Install MFA Server update
Run the new installer on the Primary MFA Server. Before you upgrade a server, remove it from load balancing or traffic sharing with other MFA Servers. You don't need to uninstall your current MFA Server before running the installer. The installer performs an in-place upgrade using the current installation path (for example, C:\Program Files\Multi-Factor Authentication Server). If you're prompted to install a Microsoft Visual C++ 2015 Redistributable update package, accept the prompt. Both the x86 and x64 versions of the package are installed. It isn't required to install updates for User portal, Web SDK, or AD FS Adapter.

>[!NOTE]
>After you run the installer on your primary server, secondary servers may begin to log **Unhandled SB** entries. This is due to schema changes made on the primary server that will not be recognized by secondary servers. These errors are expected. In environments with 10,000 users or more, the amount of log entries can increase significantly. To mitigate this issue, you can increase the file size of your MFA Server logs, or upgrade your secondary servers. 

### Configure the MFA Server Migration Utility
After installing the MFA Server update, open an elevated PowerShell command prompt: hover over the PowerShell icon, right-click, and click **Run as Administrator**. Run the .\Configure-MultiFactorAuthMigrationUtility.ps1 script found in your MFA Server installation directory (C:\Program Files\Multi-factor Authentication Server by default).

This script will require you to provide credentials for an Application Administrator in your Azure AD tenant. The script will then create a new MFA Server Migration Utility application within Azure AD, which will be used to write user authentication methods to each Azure AD user object.

For government cloud customers who wish to carry out migrations, replace ".com" entries in the script with ".us". This script will then write the HKLM:\SOFTWARE\WOW6432Node\Positive Networks\PhoneFactor\ StsUrl and GraphUrl registry entries and instruct the Migration Utility to use the appropriate GRAPH endpoints.

You'll also need access to the following URLs:

- `https://graph.microsoft.com/*` (or `https://graph.microsoft.us/*` for government cloud customers)
- `https://login.microsoftonline.com/*` (or `https://login.microsoftonline.us/*` for government cloud customers)

The script will instruct you to grant admin consent to the newly created application. Navigate to the URL provided, or within the Azure portal, click **Application Registrations**, find and select the **MFA Server Migration Utility** app, click on **API permissions** and then granting the appropriate permissions.

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/permissions.png" alt-text="Screenshot of permissions.":::

Once complete, navigate to the Multi-factor Authentication Server folder, and open the **MultiFactorAuthMigrationUtilityUI** application. You should see the following screen:

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/utility.png" alt-text="Screenshot of MFA Server Migration Utility.":::

You've successfully installed the Migration Utility.

>[!NOTE]
> To ensure no changes in behavior during migration, if your MFA Server is associated with an MFA Provider with no tenant reference, you'll need to update the default MFA settings (such as custom greetings) for the tenant you're migrating to match the settings in your MFA Provider. We recommend doing this before migrating any users.

### Run a secondary MFA Server (optional)

If your MFA Server implementation has a large number of users or a busy primary MFA Server, you may want to consider deploying a dedicated secondary MFA Server for running the MFA Server Migration Utility and Migration Sync services. After upgrading your primary MFA Server, either upgrade an existing secondary server or deploy a new secondary server. The secondary server you choose should not be handling other MFA traffic. 

The Configure-MultiFactorAuthMigrationUtility.ps1 script should be run on the secondary server to register a certificate with the MFA Server Migration Utility app registration. The certificate is used to authenticate to Microsoft Graph. Running the Migration Utility and Sync services on a secondary MFA Server should improve performance of both manual and automated user migrations.


### Migrate user data
Migrating user data doesn't remove or alter any data in the Multi-Factor Authentication Server database. Likewise, this process won't change where a user performs MFA. This process is a one-way copy of data from the on-premises server to the corresponding user object in Azure AD.

The MFA Server Migration utility targets a single Azure AD group for all migration activities. You can add users directly to this group, or add other groups. You can also add them in stages during the migration.

To begin the migration process, enter the name or GUID of the Azure AD group you want to migrate. Once complete, press Tab or click outside the window to begin searching for the appropriate group. All users in the group are populated. A large group can take several minutes to finish.

To view attribute data for a user, highlight the user, and select **View**:

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/view-user.png" alt-text="Screenshot of how to view use settings.":::

This window displays the attributes for the selected user in both Azure AD and the on-premises MFA Server. You can use this window to view how data was written to a user after migration.

The **Settings** option allows you to change the settings for the migration process:

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/settings.png" alt-text="Screenshot of settings.":::

- Migrate – there are three options for migrating the user's default authentication method:
  - Always migrate
  - Only migrate if not already set in Azure AD
  - Set to the most secure method available if not already set in Azure AD
  
  These options provide flexibility when you migrate the default method. In addition, the Authentication methods policy is checked during migration. If the default method being migrated isn't allowed by policy, it's set to the most secure method available instead.

- User Match – Allows you to specify a different on-premises Active Directory attribute for matching Azure AD UPN instead of the default match to userPrincipalName:
  - The migration utility tries direct matching to UPN before using the on-premises Active Directory attribute.  
  - If no match is found, it calls a Windows API to find the Azure AD UPN and get the SID, which it uses to search the MFA Server user list. 
  - If the Windows API doesn’t find the user or the SID isn’t found in the MFA Server, then it will use the configured Active Directory attribute to find the user in the on-premises Active Directory, and then use the SID to search the MFA Server user list.
- Automatic synchronization – Starts a background service that will continually monitor any authentication method changes to users in the on-premises MFA Server, and write them to Azure AD at the specified time interval defined.
- Synchronization server – Allows the MFA Server Migration Sync service to run on a secondary MFA Server rather than only run on the primary. To configure the Migration Sync service to run on a secondary server, the `Configure-MultiFactorAuthMigrationUtility.ps1` script must be run on the server to register a certificate with the MFA Server Migration Utility app registration. The certificate is used to authenticate to Microsoft Graph. 

The migration process can be automatic or manual.

The manual process steps are:

1. To begin the migration process for a user or selection of multiple users, press and hold the Ctrl key while selecting each of the user(s) you wish to migrate. 
1. After you select the desired users, click **Migrate Users** > **Selected users** > **OK**.
1. To migrate all users in the group, click **Migrate Users** > **All users in AAD group** > **OK**.
1. You can migrate users even if they are unchanged. By default, the utility is set to **Only migrate users that have changed**. Click **Migrate all users** to re-migrate previously migrated users that are unchanged. Migrating unchanged users can be useful during testing if an administrator needs to reset a user’s Azure MFA settings and wants to re-migrate them.

   :::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/migrate-users.png" alt-text="Screenshot of Migrate users dialog.":::

For the automatic process, click **Automatic synchronization** in **Settings**, and then select whether you want all users to be synced, or only members of a given Azure AD group.

The following table lists the sync logic for the various methods.

| Method | Logic |
|--------|-------|
|**Phone** |If there's no extension, update MFA phone.<br>If there's an extension, update Office phone.<br> Exception: If the default method is Text Message, drop extension and update MFA phone.|
|**Backup Phone**|If there's no extension, update Alternate phone.<br>If there's an extension, update Office phone.<br>Exception: If both Phone and Backup Phone have an extension, skip Backup Phone.|
|**Mobile App**|Maximum of five devices will be migrated or only four if the user also has a hardware OATH token.<br>If there are multiple devices with the same name, only migrate the most recent one.<br>Devices will be ordered from newest to oldest.<br>If devices already exist in Azure AD, match on OATH Token Secret Key and update.<br>- If there's no match on OATH Token Secret Key, match on Device Token<br>-- If found, create a Software OATH Token for the MFA Server device to allow OATH Token method to work. Notifications will still work using the existing Azure AD MFA device.<br>-- If not found, create a new device.<br>If adding a new device will exceed the five-device limit, the device will be skipped. |
|**OATH Token**|If devices already exist in Azure AD, match on OATH Token Secret Key and update.<br>- If not found, add a new Hardware OATH Token device.<br>If adding a new device will exceed the five-device limit, the OATH token will be skipped.|

MFA Methods will be updated based on what was migrated and the default method will be set. MFA Server will track the last migration timestamp and only migrate the user again if the user’s MFA settings change or an admin modifies what to migrate in the **Settings** dialog.

During testing, we recommend doing a manual migration first, and test to ensure a given number of users behave as expected. Once testing is successful, turn on automatic synchronization for the Azure AD group you wish to migrate. As you add users to this group, their information will be automatically synchronized to Azure AD. MFA Server Migration Utility targets one Azure AD group, however that group can encompass both users and nested groups of users.

Once complete, a confirmation will inform you of the tasks completed:

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/confirmation.png" alt-text="Screenshot of confirmation.":::

As mentioned in the confirmation message, it can take several minutes for the migrated data to appear on user objects within Azure AD. Users can view their migrated methods by navigating to [aka.ms/mfasetup](https://aka.ms/mfasetup).

### Validate and test

Once you've successfully migrated user data, you can validate the end-user experience using Staged Rollout before making the global tenant change. The following process will allow you to target specific Azure AD group(s) for Staged Rollout for MFA. Staged Rollout tells Azure AD to perform MFA by using Azure AD MFA for users in the targeted groups, rather than sending them on-premises to perform MFA. You can validate and test—we recommend using the Azure portal, but if you prefer, you can also use Microsoft Graph.

#### Enable Staged Rollout using Azure portal

1. Navigate to the following url: [Enable staged rollout features - Microsoft Azure](https://portal.azure.com/?mfaUIEnabled=true%2F#view/Microsoft_AAD_IAM/StagedRolloutEnablementBladeV2).

1. Change **Azure multifactor authentication** to **On**, and then click **Manage groups**.

   :::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/staged-rollout.png" alt-text="Screenshot of Staged Rollout.":::

1. Click **Add groups** and add the group(s) containing users you wish to enable for Azure MFA. Selected groups appear in the displayed list. 

   >[!NOTE]
   >Any groups you target using the Microsoft Graph method below will also appear in this list.

   :::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/managed-groups.png" alt-text="Screenshot of Manage Groups menu.":::

#### Enable Staged Rollout using Microsoft Graph

1. Create the featureRolloutPolicy
   1. Navigate to [aka.ms/ge](https://aka.ms/ge) and login to Graph Explorer using a Hybrid Identity Administrator account in the tenant you wish to setup for Staged Rollout.
   1. Ensure POST is selected targeting the following endpoint: 
      `https://graph.microsoft.com/v1.0/policies/featureRolloutPolicies`
   1. The body of your request should contain the following (change **MFA rollout policy** to a name and description for your organization):
      
      ```msgraph-interactive
      {
           "displayName": "MFA rollout policy",
           "description": "MFA rollout policy",
           "feature": "multiFactorAuthentication",
           "isEnabled": true,
           "isAppliedToOrganization": false
      }
      ```
   
      :::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/body.png" alt-text="Screenshot of request.":::

   1. Perform a GET with the same endpoint and make note of the **ID** value (crossed out in the following image):
   
      :::image type="content" border="true" source="./media/how-to-mfa-server-migration-utility/get.png" alt-text="Screenshot of GET command.":::

1. Target the Azure AD group(s) that contain the users you wish to test
   1. Create a POST request with the following endpoint (replace {ID of policy} with the **ID** value you copied from step 1d): 

      `https://graph.microsoft.com/v1.0/policies/featureRolloutPolicies/{ID of policy}/appliesTo/$ref`

   1. The body of the request should contain the following (replace {ID of group} with the object ID of the group you wish to target for staged rollout):
      
      ```msgraph-interactive
      {
      "@odata.id": "https://graph.microsoft.com/v1.0/directoryObjects/{ID of group}"
      }
      ```

   1. Repeat steps a and b for any other groups you wish to target with staged rollout.
   1. You can view the current policy in place by doing a GET against the following URL:

      `https://graph.microsoft.com/v1.0/policies/featureRolloutPolicies/{policyID}?$expand=appliesTo`

      The preceding process uses the [featureRolloutPolicy resource](/graph/api/resources/featurerolloutpolicy?view=graph-rest-1.0&preserve-view=true). The public documentation hasn't yet been updated with the new multifactorAuthentication feature, but it has detailed information on how to interact with the API.

1. Confirm that the end-user MFA experience. Here are a few things to check:
   1. Do users see their methods in [aka.ms/mfasetup](https://aka.ms/mfasetup)?
   1. Do users receive phone calls/text messages?
   1. Are they able to successfully authenticate using the above methods?
   1. Do users successfully receive Authenticator notifications? Are they able to approve these notifications? Is authentication successful?
   1. Are users able to authenticate successfully using Hardware OATH tokens?

### Educate users
Ensure users know what to expect when they're moved to Azure MFA, including new authentication flows. You may also wish to instruct users to use the Azure AD Combined Registration portal ([aka.ms/mfasetup](https://aka.ms/mfasetup)) to manage their authentication methods rather than the User portal once migrations are complete. Any changes made to authentication methods in Azure AD won't propagate back to your on-premises environment. In a situation where you had to roll back to MFA Server, any changes users have made in Azure AD won’t be available in the MFA Server User portal.

If you use third-party solutions that depend on Azure MFA Server for authentication (see [Authentication services](#authentication-services)), you’ll want users to continue to make changes to their MFA methods in the User portal. These changes will be synced to Azure AD automatically. Once you've migrated these third party solutions, you can move users to the Azure AD combined registration page.

### Complete user migration
Repeat migration steps found in [Migrate user data](#migrate-user-data) and [Validate and test](#validate-and-test) sections until all user data is migrated.

### Migrate MFA Server dependencies
Using the data points you collected in [Authentication services](#authentication-services), begin carrying out the various migrations necessary. Once this is completed, consider having users manage their authentication methods in the combined registration portal, rather than in the User portal on MFA server.

### Update domain federation settings
Once you've completed user migrations, and moved all of your [Authentication services](#authentication-services) off of MFA Server, it’s time to update your domain federation settings. After the update, Azure AD no longer sends MFA request to your on-premises federation server.

To configure Azure AD to ignore MFA requests to your on-premises federation server, install the [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/installation?view=graph-powershell-&preserve-view=true) and set [federatedIdpMfaBehavior](/graph/api/resources/internaldomainfederation?view=graph-rest-1.0#federatedidpmfabehavior-values&preserve-view=true) to `rejectMfaByFederatedIdp`, as shown in the following example.

#### Request
<!-- {
  "blockType": "request",
  "name": "update_internaldomainfederation"
}
-->
``` http
PATCH https://graph.microsoft.com/beta/domains/contoso.com/federationConfiguration/6601d14b-d113-8f64-fda2-9b5ddda18ecc
Content-Type: application/json
{
  "federatedIdpMfaBehavior": "rejectMfaByFederatedIdp"
}
```


#### Response
>**Note:** The response object shown here might be shortened for readability.
<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.internalDomainFederation"
}
-->
``` http
HTTP/1.1 200 OK
Content-Type: application/json
{
  "@odata.type": "#microsoft.graph.internalDomainFederation",
  "id": "6601d14b-d113-8f64-fda2-9b5ddda18ecc",
   "issuerUri": "http://contoso.com/adfs/services/trust",
   "metadataExchangeUri": "https://sts.contoso.com/adfs/services/trust/mex",
   "signingCertificate": "MIIE3jCCAsagAwIBAgIQQcyDaZz3MI",
   "passiveSignInUri": "https://sts.contoso.com/adfs/ls",
   "preferredAuthenticationProtocol": "wsFed",
   "activeSignInUri": "https://sts.contoso.com/adfs/services/trust/2005/usernamemixed",
   "signOutUri": "https://sts.contoso.com/adfs/ls",
   "promptLoginBehavior": "nativeSupport",
   "isSignedAuthenticationRequestRequired": true,
   "nextSigningCertificate": "MIIE3jCCAsagAwIBAgIQQcyDaZz3MI",
   "signingCertificateUpdateStatus": {
        "certificateUpdateResult": "Success",
        "lastRunDateTime": "2021-08-25T07:44:46.2616778Z"
    },
   "federatedIdpMfaBehavior": "rejectMfaByFederatedIdp"
}
```

Users will no longer be redirected to your on-premises federation server for MFA, whether they’re targeted by the Staged Rollout tool or not. Note this can take up to 24 hours to take effect.

>[!NOTE]
>The update of the domain federation setting can take up to 24 hours to take effect. 

### Optional: Disable MFA Server User portal
Once you've completed migrating all user data, end users can begin using the Azure AD combined registration pages to manage MFA Methods. There are a couple ways to prevent users from using the User portal in MFA Server: 

- Redirect your MFA Server User portal URL to [aka.ms/mfasetup](https://aka.ms/mfasetup) 
- Clear the **Allow users to log in** checkbox under the **Settings** tab in the User portal section of MFA Server to prevent users from logging into the portal altogether.

### Decommission MFA Server

When you no longer need the Azure MFA server, follow your normal server deprecation practices. No special action is required in Azure AD to indicate MFA Server retirement.

## Rollback plan

If the upgrade had issues, follow these steps to roll back: 

1. Uninstall MFA Server 8.1.
1. Replace PhoneFactor.pfdata with the backup made before upgrading.

   >[!NOTE]
   >Any changes since the backup was made will be lost, but should be minimal if backup was made right before upgrade and upgrade was unsuccessful.

1. Run the installer for your previous version (for example, 8.0.x.x).
1. Configure Azure AD to accept MFA requests to your on-premises federation server. Use Graph PowerShell to set [federatedIdpMfaBehavior](/graph/api/resources/internaldomainfederation?view=graph-rest-1.0#federatedidpmfabehavior-values&preserve-view=true) to `enforceMfaByFederatedIdp`, as shown in the following example.

   **Request**
   <!-- {
     "blockType": "request",
     "name": "update_internaldomainfederation"
   }
   -->
   ``` http
   PATCH https://graph.microsoft.com/beta/domains/contoso.com/federationConfiguration/6601d14b-d113-8f64-fda2-9b5ddda18ecc
   Content-Type: application/json
   {
     "federatedIdpMfaBehavior": "enforceMfaByFederatedIdp"
   }
   ```
   
   The following response object is shortened for readability.

   **Response**

   <!-- {
     "blockType": "response",
     "truncated": true,
     "@odata.type": "microsoft.graph.internalDomainFederation"
   }
   -->
   ``` http
   HTTP/1.1 200 OK
   Content-Type: application/json
   {
     "@odata.type": "#microsoft.graph.internalDomainFederation",
     "id": "6601d14b-d113-8f64-fda2-9b5ddda18ecc",
      "issuerUri": "http://contoso.com/adfs/services/trust",
      "metadataExchangeUri": "https://sts.contoso.com/adfs/services/trust/mex",
      "signingCertificate": "MIIE3jCCAsagAwIBAgIQQcyDaZz3MI",
      "passiveSignInUri": "https://sts.contoso.com/adfs/ls",
      "preferredAuthenticationProtocol": "wsFed",
      "activeSignInUri": "https://sts.contoso.com/adfs/services/trust/2005/usernamemixed",
      "signOutUri": "https://sts.contoso.com/adfs/ls",
      "promptLoginBehavior": "nativeSupport",
      "isSignedAuthenticationRequestRequired": true,
      "nextSigningCertificate": "MIIE3jCCAsagAwIBAgIQQcyDaZz3MI",
      "signingCertificateUpdateStatus": {
           "certificateUpdateResult": "Success",
           "lastRunDateTime": "2021-08-25T07:44:46.2616778Z"
       },
      "federatedIdpMfaBehavior": "enforceMfaByFederatedIdp"
   }
   ```


Set the **Staged Rollout for Azure MFA** to **Off**. Users will once again be redirected to your on-premises federation server for MFA. 


## Next steps

- [Overview of how to migrate from MFA Server to Azure AD Multi-Factor Authentication](how-to-migrate-mfa-server-to-azure-mfa.md)
- [Migrate to cloud authentication using Staged Rollout](../hybrid/how-to-connect-staged-rollout.md)
