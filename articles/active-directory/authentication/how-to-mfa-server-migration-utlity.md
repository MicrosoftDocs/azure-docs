---
title: Use the MFA Server Migration Utility to migrate to Azure AD MFA - Azure Active Directory
description: Step-by-step guidance to move from Azure MFA Server on-premises to Azure AD MFA and Azure AD user authentication

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 04/07/2022

ms.author: justinha
author: BarbaraSelden
manager: martinco
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# MFA Server Migration

## Solution overview

The MFA Server Migration Utility facilitates synchronizing multi-factor authentication data stored in the on-premises Azure MFA Server directly to Azure MFA. 
After the authentication data is migrated to Azure AD, users can leverage cloud-based MFA seamlessly without requiring any re-registration or confirmation of methods. 
Using the Staged Migration for MFA tool, admins can target single users or groups of users for testing and controlled rollout without having to make any tenant-wide changes.

## Limitations and requirements

- This is a private preview feature being shared with you under the terms of your NDA with Microsoft. Do not share documentation, preview builds, screenshots, or other artifacts generated for the purposes of this preview externally.
- This requires a new private preview build of the MFA Server solution to be installed on your Primary MFA Server. The build makes updates to the MFA Server data file, and includes the new MFA Server Migration Utility. You should not update the WebSDK or User Portal, even if prompted. Note that installing the update does not start the migration automatically.
- The MFA Server Migration Utility copies the data from the database file onto the user objects in Azure AD. While carrying out the migration, users can be targeted for Azure MFA for testing purposes using the staged migration tool. This allows for testing without making any changes to your domain federation settings. Once migrations are complete, you must finalize your migration by making changes to your domain federation settings.
- AD FS running Windows Server 2016 or higher is required to provide MFA authentication on any AD FS relying parties, not including Azure AD and Office 365. 
- If you’re running MFA Server on an IIS Server, please reach out to mfamigration@microsoft.com before deploying the Private Preview. You may have to move certain applications to an Application Proxy.
- Staged rollout can target a maximum of 500,000 users (10 groups containing a maximum of 50,000 users each)

## Migration guide

|Phase | Steps |
|:------|:-------|
|Preparations |Identify Azure MFA Server dependencies |
||Backup Azure MFA Server datafile |
||Install MFA Server update |
||Configure MFA Migration Utility |
|Migrations |Validate and test |
||Educate users|
||Migrate user data|
||Complete user migration|
|Finalize |Migrate MFA Server dependencies|
||Disable MFA Server User portal|
||Update domain federation settings|
||Decommission Azure MFA server|

An MFA Server migration generally includes the steps in the following process:
:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/migration-phases.png" alt-text="MFA Server migration phases.":::

A few important points:

- **Phase 1** should be repeated as you add more and more test users. 
  - The migration tool uses Azure AD groups for determining the users for which authentication data should be synced between MFA Server and Azure MFA. After user data has been synced, that user is then ready to use Azure MFA. 
  - Staged Rollout allows you to re-route users to Azure MFA, also using Azure AD groups. 
    While you certainly could use the same groups for both tools, we recommend against it as users could potentially be redirected to Azure MFA before the tool has synched their data. We recommend setting up Azure AD groups that will be targeted by the Migration Utility for syncing authentication data, and another set of groups that will be used by Staged Rollout for directing targeted users to Azure MFA rather than on-prem.
- **Phase 2** should be repeated as you migrate your user base. By the end of Phase 2, your entire user base should be using Azure MFA for all workloads federated against Azure AD.
    During the above phases, you can simply remove users from the Staged Rollout folders to take them out of scope of Azure MFA and route them back to your on-premises Azure MFA server for all MFA requests originating from Azure AD.
- **Phase 3** requires moving all clients that authenticate to the on-prem MFA Server (VPNs, password managers, etc.) to Azure AD federation via SAML/OAUTH. If modern authentication standards aren’t supported, you are required to stand up NPS server(s) with the Azure MFA extension installed. Once dependencies are migrated, users should no longer use the MFA Portal on the MFA Server, but rather should manager their authentication methods in Azure AD (aka.ms/mfasetup). Once users begin managing their authentication data in Azure AD, those methods will not be synced back to MFA Server. If you roll-back to the on-premises MFA Server after users have made changes to their Authentication Methods in Azure AD, those changes will be lost. Next, removing the ‘supportsMfa’ flag on your domain federation settings instructs Azure AD that MFA is no longer performed on-prem and that ALL MFA requests (regardless of group membership) should be performed by Azure MFA. 

Continue reading for detailed migration steps.

### Identify Azure MFA Server dependencies

We have worked very hard to ensure that moving onto our cloud-based Azure MFA solution will maintain and even improve your security posture. There are three broad categories that should be used to group dependencies:
1)	MFA methods
2)	Registration portal
3)	Authentication services
To aid you in your migration, a list of widely used MFA Server features is matched with the functional equivalent in Azure MFA for each dependency group listed above. 

#### MFA methods

Open MFA Server, click **Company Settings**:

:::image type="content" border="false" source="./media/how-to-mfa-server-migration-utlity/company-settings.png" alt-text="Screenshot of Company Settings.":::


|MFA Server|Azure MFA|
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
|**Username Resolution tab**|Not applicable; username resolution is not required for Azure MFA|
|**Text Message tab**|Not applicable; Azure MFA uses a default message for text messages|
|OATH Token tab|Not applicable; Azure MFA uses a default message for OATH tokens|
|Reports|[Azure AD Authentication Methods Activity reports](howto-authentication-methods-activity.md)|

<sup>*</sup>When a PIN is used to provide proof-of-presence functionality, the functional equivalent is provided above. PINs that aren’t cryptographically tied to a device don't sufficiently protect against scenarios where a device has been compromised. To protect against these scenarios, including [SIM swap attacks](https://wikipedia.org/wiki/SIM_swap_scam), move users to more secure methods according to Microsoft authentication methods [best practices](concept-authentication-methods.md).

<sup>**</sup>The default SMS MFA experience in Azure MFA sends users a code which they are required to enter in the login window as part of the authentication experience. The requirement to roundtrip the SMS code provides proof-of-presence functionality.

#### Registration portal 

Open MFA Server, click **User Portal**:

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/user-portal.png" alt-text="Screenshot of User portal.":::

|MFA Server|Azure MFA|
|:--------:|:-------:|
|**Settings Tab**||
|User Portal URL|aka.ms/mfasetup|
|Allow user enrollment|See Combined security information registration documentation|
|- Prompt for backup phone|See MFA Service settings|
|- Prompt for third-party OATH token|See MFA Service settings|
|Allow users to initiate a One-Time Bypass|See Azure AD TAP functionality|
|Allow users to select method|See MFA Service settings|
|- Phone call|See Phone call documentation|
|- Text message|See MFA Service settings|
|- Mobile app|See MFA Service settings|
|- OATH token|See OATH token documentation|
|Allow users to select language|Language settings will be automatically applied to a user based on the locale settings in their browser|
|Allow users to activate mobile app|See MFA Service settings|
|- Device limit|Azure AD limits users to 5 cumulative devices (mobile app instances + hardware OATH token + software OATH token) per user|
|Use security questions for fallback|Azure AD allows users to choose a fallback method at authentication time should the chosen authentication method fail|
|- Questions to answer|Security Questions in Azure AD can only be used for SSPR. See more details for Azure AD Custom Security Questions|
|Allow users to associate third-party OATH token|See OATH token documentation|
|Use OATH token for fallback|See OATH token documentation|
|Session Timeout||
|**Security Questions tab**	|Note that security questions in MFA Server were used to gain access to the MFA User Portal. Azure MFA only supports security questions for self-service password reset. See security questions documentation|
|**Passed Sessions tab**|All authentication method registration flows are managed by Azure AD and don’t require configuration|
|**Trusted Ips**|Azure AD trusted IP|

Any MFA methods available in Azure MFA Server must be enabled in Azure MFA via MFA Service settings. 
Failing to do so will prevent users from leveraging their newly migrated MFA methods.

Authentication services
Azure MFA Server is able to provide MFA functionality for 3rd party solutions leveraging RADIUS or LDAP by acting as an authentication proxy. You can determine if you have any RADIUS or LDAP dependencies by clicking on the “RADIUS Authentication” and “LDAP Authentication” options in MFA Server. Make note of each of these dependencies and determine if these 3rd parties support modern authentication. If so, consider federating them directly to Azure AD. 
For RADIUS deployments that can’t be upgraded, you’ll need to deploy an NPS Server and install the Azure AD MFA NPS extension. 
For LDAP deployments that can’t be upgraded or moved to RADIUS, determine if Azure AD Directory Services can be used. In most cases, LDAP was deployed to support in-line password changes for end-users. Once migrated, end-users can manage their passwords via Self-Service Password Reset in Azure AD.
If you have enabled the MFA Server Authentication provider in AD FS 2.0 on any relying party trusts outside of the Office 365 relying party trust, you’ll need to upgrade to AD FS 3.0 (Windows Server 2016/2019) or federate those relying parties directly to Azure AD if they support modern authentication methods.
	Determine the best plan of action for each of the above dependencies and make note of each.

### Backup Azure MFA Server datafile
Make a backup of the MFA Server data file located at %programfiles%\Multi-Factor Authentication Server\Data\PhoneFactor.pfdata (assuming the default install location) on your primary MFA Server.

Depending on user activity, this data file can become outdated quickly. Any changes made to MFA Server, or any end-user changes made via the Portal after the backup will not be captured. This means that should you rollback, any changes made after this point will not be restored.

### Install MFA Server update
Run the new installer on the Primary MFA Server. When upgrading a server it should be removed from any load balancing or traffic sharing with other MFA Servers. You do not need to uninstall your current MFA Server before running the installer. The installer performs an in-place upgrade. The installation path is picked up from the registry from the previous installation, so it installs in the same location (for example, C:\Program Files\Multi-Factor Authentication Server). If you're prompted to install a Microsoft Visual C++ 2015 Redistributable update package, accept the prompt. Both the x86 and x64 versions of the package are installed. **DO NOT INSTALL ANY OTHER UPDATES FOR THE USER PORTAL, WEB SDK, OR AD FS ADAPTER.**

### Configure Migration Utility
After installing the MFA Server Update, open an elevated PowerShell command prompt (hover over the PowerShell icon, right click, and select ‘Run as Administrator’). Run the .\Configure-MultiFactorAuthMigrationUtility.ps1 script found in your MFA Server installation directory (C:\Program Files\Multi-factor Authentication Server by default).

This script will require you to provide credentials for an application administrator in your Azure AD tenant. The script will then create a new MFA Server Migration Utility application within Azure AD which will be used to write user authentication methods to each user object within Azure AD.

You will also need access to the following URLs:

- `https://graph.microsoft.com/*`
- `https://login.microsoftonline.com/.onmicrosoft.com/*`

The script will instruct you to grant admin consent to the newly created application. Navigate to the URL provided, or within the Azure AD portal, click **Application Registrations**, find and select the **MFA Server Migration Utility** app, click on **API permissions** and then granting the appropriate permissions.

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/permissions.png" alt-text="Screenshot of permissions.":::

Once complete, navigate to the Multi-factor Authentication Server folder, and open the **MultiFactorAuthMigrationUtilityUI** application. You should see the following screen:

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/utility.png" alt-text="Screenshot of MFA Server Migration Utility.":::

You have successfully installed the Migration Utility.

### Migrate user data
Migrating user data does not remove any data from or alter any data in the Multi-Factor authentication server database. Likewise, this process will not change where a user performs MFA. This process is a one-way copy of data from the on-premises server, to the corresponding user object in Azure AD.

The MFA Server Migration utility targets a single Azure AD group for all migration activities. You can add users directly to this group, or nest other groups within the main group. You can also add users or groups of users in stages as you carry out your various migration and validation activities.

To begin the migration process, enter the name or GUID of the Azure AD group containing the users or group(s) of users you want to migrate. Once complete, hit the Tab key or click outside of the box and the utility will begin searching for the appropriate group. The window will populate all users within the group. Depending on group size, this could take several minutes.

To view user attribute data for a user, highlight the user, and select **View**:

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/view-user.png" alt-text="Screenshot of how to view use settings.":::

This window displays the attributes for the selected user in both Azure AD (AAD) and the on-premises MFA Server (MFA Server). You can use this window to view how data was written to a user after they’ve been migrated.

The settings option allows you to change the settings for the migration process:

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/settings.png" alt-text="Screenshot of settings.":::

-	Migrate – This setting allows you to specify which method(s) should be migrated for the selection of users
-	User Match – Allows you to specify a different attribute for matching users instead of the default UPN-matching
-	Automatic synchronization – Starts a background service that will continually monitor any authentication method changes to users in the on-premises Multi-factor authentication server, and write them to Azure AD at the specified time interval defined
The migration process can be an automatic process, or a manual process.
Manual:
1)	To begin the migration process for a user or selection of multiple users, hold the ‘Ctrl’ key while selecting each of the user(s) you wish to migrate. 
2)	Once the desired users have been highlighted, select ‘Migrate Users’>’Selected users’>OK to begin the process.
3)	If you wish to perform the migration for all users in the group, simply select ‘Migrate Users’>’All users in AAD group’>OK.
Automatic:
1)	Select “Automatic synchronization” in the settings menu, and then select whether you want all users to be synced, or only members of a given Azure AD Group
Sync logic is as follows for the various methods:
Phone	•	If no extension, will update MFA phone
•	If has extension, will update Office phone
o	Exception: If default method is Text Message, will drop extension and update MFA phone
Backup Phone	•	If no extension, will update Alternate phone
•	If has extension, will update Office phone
o	Exception: If both Phone and Backup Phone have an extension, will skip Backup Phone
Mobile App	•	Maximum of 5 devices will be migrated or only 4 if user also has hardware OATH token
•	If there are multiple devices with the same name, will only migrate the most recent one
•	Devices will be ordered from newest to oldest
•	If devices already exist in AAD, will match on OATH Token Secret Key and update
o	If no match on OATH Token Secret Key, will match on Device Token
	If found, will create a Software OATH Token for the MFA Server device to allow OATH Token method to work.  Notifications will still work using the existing Azure MFA device.
	If not found, will create a new device
•	If adding a new device will exceed the 5-device limit, the device will be skipped
OATH Token	•	If devices already exist in AAD, will match on OATH Token Secret Key and update
o	If not found, will add a new Hardware OATH Token device
•	If adding a new device will exceed the 5-device limit, the OATH token will be skipped
MFA Methods will be updated based on what was migrated and the default method will be set. MFA Server will keep track of the last migration timestamp and will only migrate the user again if the user’s MFA settings change.

During testing, we recommend doing a manual migration first, testing to ensure a given number of users behave as expected. Once testing is successful, turn on automatic synchronization for the Azure AD group(s) you wish to use as migration groups. As you add users to this group, their information will be automatically synchronized to Azure AD. Note that the Migration Utility targets one Azure AD group, however that group can encompass both users and nested groups of users.
Once complete, a confirmation window will appear, informing you of the tasks completed:

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/confirmation.png" alt-text="Screenshot of confirmation.":::

As called out the confirmation message shown, it can take several minutes for the migrated data to appear on user objects within Azure AD. Users can view their migrated methods by navigating to aka.ms/mfasetup.

### Validate and test
Once you have successfully migrated user data, you can validate the end-user experience using Staged Rollout before making the global tenant change. The below process will allow you to target specific Azure AD group(s) for staged rollout for MFA. This tells Azure AD to perform MFA via Azure MFA for users in the targeted groups, rather than sending them on-premises to perform MFA.

1. Create the featureRolloutPolicy
   1. Navigate to aka.ms/ge and login to Graph Explorer using a Hybrid Identity admin account in the tenant you wish to setup for Staged Rollout.
   1. Ensure POST is selected targeting the following endpoint: https://graph.microsoft.com/v1.0/policies/featureRolloutPolicies
   1. The body of your request should contain the following (the highlighted portions can be changed to fit any naming and description needs your organization may need):
   
      :::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/body.png" alt-text="Screenshot of request.":::

   1. Perform a GET with the same endpoint and make note of the “id” value (crossed-out image below)
   
      :::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/get.png" alt-text="Screenshot of GET command.":::

1. Target the Azure AD group(s) that contain the users you wish to test
   1. Create a POST request with the following endpoint (note that the highlighted portion below should be replaced with the ID value you copied from step 1d): 

      `https://graph.microsoft.com/v1.0/policies/featureRolloutPolicies/{ID of policy}/appliesTo/$ref`

   1. The body of the request should contain the following (note that the highlighted portion should be the object ID of the group you wish to target for Staged Rollout):
      
      ```msgraph-interactive
      {
      "@odata.id": "https://graph.microsoft.com/v1.0/directoryObjects/{id of group}"
      }
      ```

    1. Repeat steps a and b for any other groups you wish to target with staged rollout.
    1. You can view the current policy in place by doing a get against the following URL:

       `https://graph.microsoft.com/v1.0/policies/featureRolloutPolicies/{policyID}?$expand=appliesTo`

       Note that the above process uses the featureRolloutPolicy resource. The public documentation has not yet been updated with the new multifactorAuthentication feature, but detailed information on how to interact with the API can be found on the Microsoft docs site.

1. Confirm that the end-user MFA experience is as expected. Here are a few things to check:
   1. Do users see their methods in aka.ms/mfasetup
   1. Do users receive phone calls/text messages
   1. Are they able to successfully authenticate using the above methods?
   1. Do users successfully receive Authenticator notifications? Are they able to approve these notifications? Is authentication successful?
   1. Are users able to authenticate successfully using Hardware OATH tokens?

### Educate users
Ensure users know what to expect when they are moved to Azure MFA, including new authentication flows. You may also wish to instruct users to use the Azure AD Combined Registration portal (aka.ms/mfasetup) to manage their authentication methods rather than the Azure MFA Server registration portal once migrations are complete. Note that any changes made to authentication methods in Azure AD will not propagate back to your on-premises environment. In a situation where you have to rollback to MFA Server, any changes users have made in Azure AD won’t be available in the MFA Server User portal.

Also note that if you have 3rd party solutions that are dependent on Azure MFA Server for authentication (see Authentication Services section above), you’ll want users to continue to make changes to their MFA methods in the Azure MFA Server portal. These changes will be synced to Azure AD automatically. Once you have migrated these 3rd party solutions, you can move users to the Azure AD combined registration page.

### Complete user migration
Repeat migration steps found in Migrate user data and Validate and Test sections above until all user data is migrated.

### Migrate MFA Server dependencies
Using the data points you collected above in the Authentication Services section, begin carrying out the various migrations necessary. Once this is completed, consider having users manage their authentication methods in the combined registration portal, rather than in the User Portal on MFA server.

### Update domain federation settings
Once you have completed user migrations, and moved all of your Authentication Services off of MFA Server, it’s time to update your domain federation settings so that Azure AD no longer sends MFA request to your on-prem federation server.

(You’ll need the MSOnline cmdlets in PowerShell to perform the following functions).

In an elevated PowerShell session, type the following:

Connect-MSOLService

You’ll be prompted to enter the credentials of an admin with GA Privileges in tenant containing the federated domain you wish to make changes to. Once completed, type the following:

Set-MsolDomainFederationSettings -DomainName <federated domain you wish to make changes to> -supportsMfa $false

All users, whether they’re targeted by the Staged Rollout tool or not will no longer be redirected to your on-premises federation server for MFA. Note this can take up to 24 hours to take effect.

### Optional: Disable MFA Server registration portal
Once you have completed migrating all user data, end users can begin using the Azure AD combined registration pages to manage MFA Methods, rather than the User Portal in Azure MFA Server. You may wish to re-direct your MFA Server Registration Portal URL to aka.ms/mfasetup and/or perhaps prevent users from logging into the MFA Server registration portal altogether. You can do this by unchecking “Allow users to log in” under the ‘Settings’ tab in the User Portal section of MFA Server.

### Decommission Azure MFA Server
Once you have determined you no longer need the Azure MFA server, you may follow your normal deprecation practices for server deprecation. No special action is required in Azure AD to indicate MFA Server retirement.

## Rollback (if needed)

To rollback, type the following in an elevated PowerShell session:

```powershell
Connect-MSOLService
```

You’ll be prompted to enter the credentials of an admin with GA Privileges in tenant containing the federated domain you wish to make changes to. Once completed, type the following:

```powershell
Set-MsolDomainFederationSettings -DomainName <federated domain you wish to make changes to> -supportsMfa $true
```

All users, whether they’re targeted by the Staged Rollout tool or not will no longer be redirected to your on-premises federation server for MFA. Note this can take up to 24 hours to take effect.

## How to get help
