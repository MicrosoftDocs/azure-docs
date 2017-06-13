---
title: Deploying recommended policies for Azure AD Secure email | Microsoft Docs
description: Describes deploying Microsoft recommendations about how to apply email policies and configurations.
author: jeffgilb
ms.service: guidance
ms.topic: article
ms.date: 05/24/2017
ms.author: pnp

pnp.series.title: Best Practices

---

# Deploy recommended policies

This section discusses how to deploy the recommended policies in a newly provisioned environment. Setting up these policies in a separate lab environment allows you to understand and evaluate the recommended policies before staging the rollout to your pre-production and production environments. Your newly provisioned environment may be cloud-only or Hybrid.  

To successfully deploy the recommended polices, you need to take actions in the Azure portal to meet the prerequisites stated earlier. Specifically, you need to:
* Configure named networks, to ensure Azure Identity Protection can properly generate a risk score
* Require all users to register for multi-factor authentication (MFA)
* Configure password sync and self-service password reset to enable users to be able to reset passwords themselves

You can target both Azure AD and Intune policies towards specific groups of users. We suggest rolling out the policies defined earlier in a staged way. This way you can validate the performance of the policies and your support teams relative to the policy incrementally.

## Baseline CA policy

To create a new conditional access policy, log in to the Microsoft Azure portal with your administrator credentials. Then navigate to **Azure Active Directory > Security > Conditional access**. 

You can add a new policy (+Add) as shown in the following screen shot:

![Baseline CA policy](./media/secure-email/baseline-ca-policy.png)

The following tables describe the appropriate settings necessary to express the policies required for each level of protection.

### Medium and above risk requires MFA

The following table describes the conditional access policy settings to implement for this policy.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**Assignments**|Users and groups|Include|Select users and groups – Select specific security group containing targeted users|Start with security group including pilot users.|
|||Exclude|Exception security group; service accounts (app identities)|Membership modified on an as needed temporary basis|
||Cloud apps|Include|Select apps -  Select Office 365 Exchange Online||
||Conditions|Configured|Yes|Configure specific to your environment and needs|
||Sign-in risk|Risk level|High, medium|Check both|
|**Access controls**|Grant|Grant access|True|Selected|
|||Require MFA|True|Check|
|||Require compliant devices|False||
|||Require domain joined devices|False||
|||Require all the selected controls|True|Selected|
|**Enable policy**|||On|Deploys conditional access policy|

### Require a compliant or domain joined device

To create a new Intune Conditional Access Policy for Exchange Online, log in to the [Microsoft Management portal (http://manage.microsoft.com)](http://manage.microsoft.com/) with your administrator credentials and then navigate to **Policy > Conditional Access > Exchange Online Policy**.

![Exchange online policy](./media/secure-email/exchange-online-policy.png)

You must set a Conditional Access policy specifically for Exchange Online in the Intune Management portal to require a compliant or domain joined device.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**Application access**|Outlook and other apps that user modern authentication|All platforms|True|Selected|
|||Windows must meet the following requirement|Device must be domain joined or compliant|Selected (List)|
|||Selected platform|False||
||Outlook Web Access (OWA)|Block non-compliant devices on same platform as Outlook|True|Check|
||Exchange ActiveSync apps that use basic authentication|Block non-compliant devices on platforms supported by Microsoft Intune|True|Check|
|||Block all other devices on platforms not supported by Microsoft Intune|True|Check|
|**Policy deployment**|Target groups|Select the Active Directory groups to target with this policy|||
|||All users|False||
|||Selected security groups|True|Selected|
|||Modify|Select specific security group containing targeted users||
||Exempt groups|Select the Active Directory groups to exempt from this policy (overrides members of the Targeted Groups list)|||
|||No exempt users|True|Selected|
|||Selected security groups|False|||

### Mobile application management conditional access for Exchange online

You must set a Conditional Access policy specifically for Exchange Online in the Intune Management portal to manage mobile apps.

To manage mobile apps, log in to the Microsoft Azure portal with your administrator credentials, and then navigate to **Intune App Protection > Settings > Conditional Access > Exchange Online**.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**App access**|Allowed apps|Enable app access|Allow apps that support Intune app policies|Selected (list) – This results in a list of apps/platform combinations supported by Intune app policies|
|**User access**|Allowed apps|Restricted user groups|Add users groups – Select specific security group containing targeted users|Start with security group including pilot users|
|||Exempt user groups|Exception security groups|||

#### Apply to

Once your pilot project has been completed, these policies should be applied to all users in your organization.

## Sensitive CA policy

### Low and above risk requires MFA
The following table describes the conditional access policy settings to implement for low- and above-risk policies.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**Assignments**|Users and groups|Include|Select users and groups – Select specific security group containing targeted users|Start with security group including pilot users|
|||Exclude|Exception security group; service accounts (app identities)|Membership modified on an as needed temporary basis|
||Cloud apps|Include|Select apps -  Select Office 365 Exchange Online||
||Conditions|Configured|Yes|Configure specific to your environment and needs|
||Sign-in risk|Configured|Yes|Configure specific to your environment and needs|
|||Risk level|Low, medium, high|Check all three|
|**Access controls**|Grant|Grant access|True|Selected|
|||Require MFA|True|Check|
|||Require compliant devices|False||
|||Require domain joined device|False||
|||Require all the selected controls|True|Selected|
|**Enable policy**|||On|Deploys conditional access policy|

### Require a compliant or domain joined device
(See baseline instructions)

### Mobile application management conditional access for Exchange online

(See baseline instructions)

#### Apply to

Once the pilot project has been completed, these policies should be applied to users in your organization who require access to email considered sensitive.

## Highly regulated CA policy
### MFA required

The following table describes the conditional access policy settings to implement for the highly regulated policy.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**Assignments**|Users and groups|Include|Select users and groups – Select specific security group containing targeted users|Start with security group including pilot users|
|||Exclude|Exception security group; service accounts (app identities)|Membership modified on an as needed temporary basis|
||Cloud apps|Include|Select apps -  Select Office 365 Exchange Online||
|**Access controls**|Grant|Grant access|True|Selected|
|||Require MFA|True|Check|
|||Require complaint devices|False|Check|
|||Require domain joined device|False||
|||Require all the selected controls|True|Selected|
|**Enable policy**|||On|Deploys conditional access policy|

### Require a compliant or domain joined device
(See baseline instructions)
### Mobile application management conditional access for Exchange online
(See baseline instructions)
#### Apply to
Once the pilot project has been completed, these policies should be applied to users in your organization who require access to email considered highly regulated.

## User risk policy
### High risk users must change password
To ensure that all high-risk users compromised accounts are forced to perform a password change when signing-in, you must apply the following policy. 

Log in to the [Microsoft Azure portal (http://portal.azure.com)](http://portal.azure.com/) with your administrator credentials, and then navigate to **Azure AD Identity Protection > User Risk Policy**.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**Assignments**|Users|Include|All users|Selected|
|||Exclude|None||
||Conditions|User risk|High|Selected|
|**Controls**|Access|Allow access|True|Selected|
||Access|Require password change|True|Check|
|**Review**|N/A|N/A|N/A|N/A|
|**Enforce policy**|||On|Starts enforcing policy|

## Additional configurations
In addition to the above policies, you must configure the following Mobile Application and Device Management settings discussed in this section. 

### Intune mobile application management 

To ensure email is protected by the policy recommendations stated earlier for each security and data protection tier, you must create Intune app protection policies from within the Azure portal.

To create a new app protection policy, log in to the Microsoft Azure portal with your administer credentials, and then navigate to **Intune App Protection > Settings > App policy**.

Add a new policy (+Add) as shown in the following screen shot:

![Intune mobile application management](./media/secure-email/intune-mobile-app-mgmt.png)

>[!NOTE]
>There are slight differences in the app protection policy options between iOS and Android. The below policy is specifically for Android.
>

The following tables describe, in details, the appropriate settings necessary to express the policies required for each level of protection.
|
The following table describes the recommended Intune app protection policy settings.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**General**|Email|Name|Secure email policy for Android|Enter a policy name|
|||Description||Enter text that describes the policy|
|||Platform|Android|There are slight differences in the app protection policy options between iOS and Android; this policy is specifically for Android|
|**Apps**|Applications|Apps|Outlook|Selected (list)|
|**Settings**|Data relocation|Prevent Android backup|Yes|On iOS this will specifically call out iTunes and iCloud|
||||Allow app to transfer data to other apps|Policy managed apps||
|||Allow app to receive data to other apps|Policy managed apps||
|||Prevent "Save As"|Yes||
|||Restrict cut, copy, and paste with other apps|Policy managed apps||
|||Restrict web content to display in the managed browser|No||
|||Encrypt app data|Yes|On iOS select option: When device is locked|
|||Disable contacts sync|No||
||Access|Require PIN for access|Yes||
|||Number of attempts before PIN reset|3||
|||Allow simple PIN|No||
|||PIN length|6||
|||Allow fingerprint instead of PIN|Yes||
|||Require Corporate credentials for access|No||
|||Block managed apps from running on jailbroken or rooted devices|Yes||
|||Recheck the access requirement after (minutes)|30||
|||Offline grace period|720||
|||Offline interval (days) before app data is wiped|90||
|||Block screen capture and Android assistant|No|On iOS this is not an available option|

When complete, remember to click "Create". Repeat the above steps and replace the selected platform (dropdown) with iOS. This creates two app policies, so once you create the policy, then assign groups to the policy and deploy it.

### Intune mobile device management
You create the following Configuration and Compliance policies by logging into the [Microsoft Management portal (http://manage.microsoft.com)](https://manage.microsoft.com/) with your administrator credentials.

#### iOS email profile
In the [Intune management portal (https://manage.microsoft.com)](https://manage.microsoft.com/) create the following Configuration policies at **Policy > Configuration Policies > Add > iOS > Email Profile (iOS 8 and later)**.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**Email profile**|Exchange Active Sync|Host (#)|Outlook.office365.com||
|||Account Name (#)|SecureEmailAccount|Admini choice|
|||Username|User principal name|Selected – Drop down|
|||Email address|Primary SMTP address|Selected – Drop down|
|||Authentication method|Username and password|Selected – Drop down|
|||Use S/MIME|False||
||Synchronization settings|Number of days of email to synchronize|Two weeks|Selected – Drop down|
|||Use SSL|True|Check|
|||Allow messages to be moved to other email accounts|False||
|||Allow email to be sent from third party applications|True||
|||Synchronize recently used email addresses|True|Check|

#### iOS app sharing profile
In the [Intune management portal (https://manage.microsoft.com)](https://manage.microsoft.com/) create the following Configuration policies at  **Policy > Configuration Policies > Add > iOS > General Configuration (iOS 8.0 and later)**.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**Security**|All|All|Not configured||
|**Cloud**|All|All|Not configured||
|**Applications**|Browser|All|Not configured||
||Apps|Allow installing apps|Not configured||
|||Require a password to access application store|Not configured||
|||All in-app purchases|Not configured||
|||Allow managed documents in other managed apps (iOS 8.0 and later)|No|Selected – Drop down|
|||Allow unmanaged documents in other managed apps|Not configured||
|||Allow video conferencing|Not configured||
|||Allow the user to trust new enterprise app authors|Not configured||
||Games|All|Not configured||
||Media content|All|Not configured|||

#### Android email profile
In the [Intune management portal (https://manage.microsoft.com)](https://manage.microsoft.com/) create the following Configuration policies at **Policy > Configuration Policies > Add > iOS > Email Profile (Samsung KNOX Standard 4.0 and later)**.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**Email profile**|Exchange Active Sync|Host (#)| Outlook.office365.com|
|||Account Name (#)|SecureEmailAccount|Admini choice|
|||Username|User principal name|Selected – Drop down|
|||Email address|Primary SMTP address|Selected – Drop down|
|||Authentication method|Username and password|Selected – Drop down|
|||Use S/MIME|False||
||Synchronization settings|Number of days of email to synchronize|Two weeks|Selected – Drop down|
|||Sync schedule|Not configured|Selected – Drop down|
|||Use SSL|True|Check|
|||Content type to synchronize|||
|||Email|True|Check (locked)|
|||Contacts|True|Check|
|||Calenadr|True|Check|
|||Tasks|True|Check|
|||Notes|True|Check|

#### Android for work email profile
In the [Intune management portal (https://manage.microsoft.com)](https://manage.microsoft.com/) create the following Configuration policies at **Policy > Configuration Policies > Add > iOS > Email Profile (Android for Work - Gmail)**.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**Email profile**|Exchange Active Sync|Host(#)| Outlook.office365.com|
|||Account Name(#)|SecureEmailAccount|Admini choice|
|||Username|User principal name|Selected – Drop down|
|||Email address|Primary SMTP address|Selected – Drop down|
|||Authentication method|Username and password|Selected – Drop down|
||Synchronization settings|Number of days of email to synchronize|Two weeks|Selected – Drop down|
|||Use SSL|True|Check|

#### Android for work app sharing profile
In the [Intune management portal (https://manage.microsoft.com)](https://manage.microsoft.com/) create the following Configuration policies at  **Policy > Configuration Policies > Add > iOS > General Configuration (Android for Work)**.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**Security**|Password|Minimum password length|Not configured||
|||Number of repeated sign-in failures before the work profile is removed|Not configured||
|||Minutes of inactivity before device locks|Not configured||
|||Password expiration (days)|Not configured||
|||Remember password history|Not configured||
|||Require a password to unlock mobile device|Not configured||
|||Allow fingerprint unlock (Android 6.0+)|Not configured||
|||Allow Smart Lock and other trust agents (Android 6.0+)|Not configured||
||Work profile settings|Allow data sharing between work and personal profiles|Apps in work profile can handle sharing request from personal profile|Selected – Drop down|
|||Hide work profile notifications when the device is locked (Android 6.0+)|Not configured||
|||Set default app permission policy (Android 6.0+)|Not configured|||

#### Device compliance policy
In the [Intune management portal (https://manage.microsoft.com)](https://manage.microsoft.com/) create the following Configuration policies at  **Policy > Compliance Policy > Add**.

|Categories|Type|Properties|Values|Notes|
|:---------|:---|:---------|:-----|:----|
|**System security**|Password|Require a password to unlock mobile devices (...)|Yes|Selected – Drop down|
|||Allow simple passwords (...)|No|Selected – Drop down|
|||Minimum password length (...)|6|Selected – List|
||Advanced password settings|All|Not configured||
||Encryption|Require encryption on mobile device (...)|Yes|Selected – Drop down|
||Email profiles|Email account must be managed by Intune (iOS 8.0+)|Yes| Selected  – Drop down|
|||Select (#)||Must select Email Configuration Policy for iOS: iOS Email Policy (see configuration policies above)|
|**Device health**|Windows decide health attestation|Require devices to be reported as healthy (Windows 10 Desktop and Mobile and later)|Yes||
||Device security settings|All|Not configured||
||Device threat protection|All|Not configured||
||Jailbreak|Device must not be jailbroken or rooted (iOS 8.0+, Android 4.0+)|Yes||
|**Device properties**|Operating system version|All|Not configured|||

For all the above policies to be considered deployed, they must be targeted at user groups. You can do this by creating the policy (on Save) or later by selecting Manage Deployment in the Policy section (same level as Add).

## Remediating events that have results in medium or high risk access
If a user reports that they are now expected to perform MFA when this was previously not required, support can review their status from a risk perspective.  

Users within the organization with a Global Administrator or Security Administrator role can use Azure AD Identity Protection to review the risky events that contributed to the calculated risk score. If they identify some events that were flagged as suspicious, but are confirmed to be valid (such as a login from an unfamiliar location when an employee is on vacation), the administrator can resolve the event so it no longer contributes to the risk score.

## Next steps
[EMS and Office 365 service descriptions](secure-email-ems-office365-service-descriptions.md)
