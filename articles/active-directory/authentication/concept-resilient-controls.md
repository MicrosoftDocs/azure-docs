---
title: Create a resilient access control management strategy
description: This document provides guidance on strategies an organization should adopt to provide resilience to reduce the risk of lockout during unforeseen disruptions
services: active-directory
author: martincoetzer
manager: travisgr
tags: azuread
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.workload: identity
ms.date: 01/29/2023
ms.author: martinco
ms.collection: M365-identity-device-management
---
# Create a resilient access control management strategy with Azure Active Directory

>[!NOTE]
> The information contained in this document represents the current view of Microsoft Corporation on the issues discussed as of the date of publication. Because Microsoft must respond to changing market conditions, it should not be interpreted to be a commitment on the part of Microsoft, and Microsoft cannot guarantee the accuracy of any information presented after the date of publication.

Organizations that rely on a single access control, such as multi-factor authentication (MFA) or a single network location, to secure their IT systems are susceptible to access failures to their apps and resources if that single access control becomes unavailable or misconfigured. For example, a natural disaster can result in the unavailability of large segments of telecommunications infrastructure or corporate networks. Such a disruption could prevent end users and administrators from being able to sign in.

This document provides guidance on strategies an organization should adopt to provide resilience to reduce the risk of lockout during unforeseen disruptions with the following scenarios:

 - Organizations can increase their resiliency to reduce the risk of lockout **before a disruption** by implementing mitigation strategies or contingency plans.
 - Organizations can continue to access apps and resources they choose **during a disruption** by having mitigation strategies and contingency plans in place.
 - Organizations should make sure they preserve information, such as logs,  **after a disruption** and before they roll back any contingencies they implemented.
 - Organizations that haven’t implemented prevention strategies or alternative plans may be able to implement **emergency options** to deal with the disruption.

## Key guidance

There are four key takeaways in this document:

* Avoid administrator lockout by using emergency access accounts.
* Implement MFA using Conditional Access rather than per-user MFA.
* Mitigate user lockout by using multiple Conditional Access controls.
* Mitigate user lockout by provisioning multiple authentication methods or equivalents for each user.

## Before a disruption

Mitigating an actual disruption must be an organization’s primary focus in dealing with access control issues that may arise. Mitigating includes planning for an actual event plus implementing strategies to make sure access controls and operations are unaffected during disruptions.

### Why do you need resilient access control?

 Identity is the control plane of users accessing apps and resources. Your identity system controls which users and under which conditions, such as access controls or authentication requirements, users get access to the applications. When one or more authentication or access control requirements aren’t available for users to authenticate due to unforeseen circumstances, organizations can experience one or both of the following issues:

* **Administrator lockout:** Administrators can’t manage the tenant or services.
* **User lockout:** Users can’t access apps or resources.

### Administrator lockout contingency

To unlock admin access to your tenant, you should create emergency access accounts. These emergency access accounts, also known as *break glass* accounts, allow access to manage Azure AD configuration when normal privileged account access procedures aren’t available. At least two emergency access accounts should be created following the [emergency access account recommendations]( ../users-groups-roles/directory-emergency-access.md).

### Mitigating user lockout

 To mitigate the risk of user lockout, use Conditional Access policies with multiple controls to give users a choice of how they will access apps and resources. By giving a user the choice between, for example, signing in with MFA **or** signing in from a managed device **or** signing in from the corporate network, if one of the access controls is unavailable the user has other options to continue to work.

#### Microsoft recommendations

Incorporate the following access controls in your existing Conditional Access policies for organization:

- Provision multiple authentication methods for each user that rely on different communication channels, for example the Microsoft Authenticator app (internet-based), OATH token (generated on-device), and SMS (telephonic). The following PowerShell script will help you identify in advance, which additional methods your users should register: [Script for Azure AD MFA authentication method analysis](/samples/azure-samples/azure-mfa-authentication-method-analysis/azure-mfa-authentication-method-analysis/).
- Deploy Windows Hello for Business on Windows 10 devices to satisfy MFA requirements directly from device sign-in.
- Use trusted devices via [Azure AD Hybrid Join](../devices/overview.md) or [Microsoft Intune](/intune/planning-guide). Trusted devices will improve user experience because the trusted device itself can satisfy the strong authentication requirements of policy without an MFA challenge to the user. MFA will then be required when enrolling a new device and when accessing apps or resources from untrusted devices.
- Use Azure AD identity protection risk-based policies that prevent access when the user or sign-in is at risk in place of fixed MFA policies.
- If you are protecting VPN access using Azure AD MFA NPS extension, consider federating your VPN solution as a [SAML app](../manage-apps/view-applications-portal.md) and determine the app category as recommended below. 

>[!NOTE]
> Risk-based policies require [Azure AD Premium P2](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing) licenses.

The following example describes policies you must create to provide a resilient access control for user to access their apps and resources. In this example, you will require a security group **AppUsers** with the target users you want to give access to, a group named **CoreAdmins** with the core administrators, and a group named **EmergencyAccess** with the emergency access accounts.
This example policy set will grant selected users in **AppUsers**, access to selected apps if they are connecting from a trusted device OR provide strong authentication, for example MFA. It excludes emergency accounts and core administrators.

**Conditional Access mitigation policies set:**

* Policy 1: Block access to people outside target groups
  * Users and Groups: Include all users. Exclude AppUsers, CoreAdmins, and EmergencyAccess
  * Cloud Apps: Include all apps
  * Conditions: (None)
  * Grant Control: Block
* Policy 2: Grant access to AppUsers requiring MFA OR trusted device.
  * Users and Groups: Include AppUsers. Exclude CoreAdmins, and EmergencyAccess
  * Cloud Apps: Include all apps
  * Conditions: (None)
  * Grant Control: Grant access, require multi-factor authentication, require device to be compliant. For multiple controls: Require one of the selected controls.

### Contingencies for user lockout

Alternatively, your organization can also create contingency policies. To create contingency policies, you must define tradeoff criteria between business continuity, operational cost, financial cost, and security risks. For example, you may activate a contingency policy only to a subset of users, for a subset of apps, for a subset of clients, or from a subset of locations. Contingency policies will give administrators and end users access to apps and resources, during a disruption when no mitigation method was implemented. Microsoft recommends enabling contingency policies in [report-only mode](../conditional-access/howto-conditional-access-insights-reporting.md) when not in use so that administrators can monitor the potential impact of the policies should they need to be turned on.

 Understanding your exposure during a disruption helps reduce your risk and is a critical part of your planning process. To create your contingency plan, first determine the following business requirements of your organization:

1. Determine your mission critical apps ahead of time: What are the apps that you must give access to, even with a lower risk/security posture? Build a list of these apps and make sure your other stakeholders (business, security, legal, leadership) all agree that if all access control goes away, these apps still must continue to run. You are likely going to end up with categories of:
   * **Category 1 mission critical apps** that cannot be unavailable for more than a few minutes, for example Apps that directly affect the revenue of the organization.
   * **Category 2 important apps** that the business needs to be accessible within a few hours.
   * **Category 3 low-priority apps** that can withstand a disruption of a few days.
2. For apps in category 1 and 2, Microsoft recommends you pre-plan what type of level of access you want to allow:
   * Do you want to allow full access or restricted session, like limiting downloads?
   * Do you want to allow access to part of the app but not the whole app?
   * Do you want to allow information worker access and block administrator access until the access control is restored?
3. For those apps, Microsoft also recommends you plan which avenues of access you will deliberately open and which ones you will close:
   * Do you want to allow browser only access and block rich clients that can save offline data?
   * Do you want to allow access only for users inside the corporate network and keep outside users blocked?
   * Do you want to allow access from certain countries or regions only during the disruption?
   * Do you want policies to the contingency policies, especially for mission critical apps, to fail or succeed if an alternative access control is not available?

#### Microsoft recommendations

A contingency Conditional Access policy is a **backup policy** that omits Azure AD MFA, third-party MFA, risk-based or device-based controls. In order to minimize unexpected disruption when a contingency policy is enabled, the policy should remain in report-only mode when not in use. Administrators can monitor the potential impact of their contingency policies using the Conditional Access Insights workbook. When your organization decides to activate your contingency plan, administrators can enable the policy and disable the regular control-based policies.

>[!IMPORTANT]
> Disabling policies that enforce security on your users, even temporarily, will reduce your security posture while the contingency plan is in place.

* Configure a set of fallback policies if a disruption in one credential type or one access control mechanism impacts access to your apps. Configure a policy in report-only state that requires Domain Join as a control, as a backup for an active policy that requires a third-party MFA provider.
* Reduce the risk of bad actors guessing passwords, when MFA is not required, by following the practices in the [password guidance](https://aka.ms/passwordguidance) white paper.
* Deploy [Azure AD Self-Service Password Reset (SSPR)](./tutorial-enable-sspr.md) and [Azure AD Password Protection](./howto-password-ban-bad-on-premises-deploy.md) to make sure users don’t use common password and terms you choose to ban.
* Use policies that restrict the access within the apps if a certain authentication level is not attained instead of simply falling back to full access. For example:
  * Configure a backup policy that sends the restricted session claim to Exchange and SharePoint.
  * If your organization uses Microsoft Defender for Cloud Apps, consider falling back to a policy that engages Defender for Cloud Apps and then allow read-only access but not uploads.
* Name your policies to make sure it is easy to find them during a disruption. Include the following elements in the policy name:
  * A *label number* for the policy.
  * Text to show, this policy is for emergencies only. For example: **ENABLE IN EMERGENCY**
  * The *disruption* it applies to. For example: **During MFA Disruption**
  * A *sequence number* to show the order you must activate the policies.
  * The *apps* it applies to.
  * The *controls* it will apply.
  * The *conditions* it requires.
  
This naming standard for the contingency policies will be as follows: 

```
EMnnn - ENABLE IN EMERGENCY: [Disruption][i/n] - [Apps] - [Controls] [Conditions]
```

The following example: **Example A - Contingency Conditional Access policy to restore Access to mission-critical Collaboration Apps**, is a typical corporate contingency. In this scenario, the organization typically requires MFA for all Exchange Online and SharePoint Online access, and the disruption in this case is the MFA provider for the customer has an outage (whether Azure AD MFA, on-premises MFA provider, or third-party MFA). This policy mitigates this outage by allowing specific targeted users access to these apps from trusted Windows devices only when they are accessing the app from their trusted corporate network. It will also exclude emergency accounts and core administrators from these restrictions. The targeted users will then gain access to Exchange Online and SharePoint Online, while other users will still not have access to the apps due to the outage. This example will require a named network location **CorpNetwork** and a security group **ContingencyAccess** with the target users, a group named **CoreAdmins** with the core administrators, and a group named **EmergencyAccess** with the emergency access accounts. The contingency requires four policies to provide the desired access. 

**Example A - Contingency Conditional Access policies to restore Access to mission-critical Collaboration Apps:**

* Policy 1: Require Domain Joined devices for Exchange and SharePoint
  * Name: EM001 - ENABLE IN EMERGENCY: MFA Disruption[1/4] - Exchange SharePoint - Require Hybrid Azure AD Join
  * Users and Groups: Include ContingencyAccess. Exclude CoreAdmins, and EmergencyAccess
  * Cloud Apps: Exchange Online and SharePoint Online
  * Conditions: Any
  * Grant Control: Require Domain Joined
  * State: Report-only
* Policy 2: Block platforms other than Windows
  * Name: EM002 - ENABLE IN EMERGENCY: MFA Disruption[2/4] - Exchange SharePoint - Block access except Windows
  * Users and Groups: Include all users. Exclude CoreAdmins, and EmergencyAccess
  * Cloud Apps: Exchange Online and SharePoint Online
  * Conditions: Device Platform Include All Platforms, exclude Windows
  * Grant Control: Block
  * State: Report-only
* Policy 3: Block networks other than CorpNetwork
  * Name: EM003 - ENABLE IN EMERGENCY: MFA Disruption[3/4] - Exchange SharePoint - Block access except Corporate Network
  * Users and Groups: Include all users. Exclude CoreAdmins, and EmergencyAccess
  * Cloud Apps: Exchange Online and SharePoint Online
  * Conditions: Locations Include any location, exclude CorpNetwork
  * Grant Control: Block
  * State: Report-only
* Policy 4: Block EAS Explicitly
  * Name: EM004 - ENABLE IN EMERGENCY: MFA Disruption[4/4] - Exchange - Block EAS for all users
  * Users and Groups: Include all users
  * Cloud Apps: Include Exchange Online
  * Conditions: Client apps: Exchange Active Sync
  * Grant Control: Block
  * State: Report-only

Order of activation:

1. Exclude ContingencyAccess, CoreAdmins, and EmergencyAccess from the existing MFA policy. Verify a user in ContingencyAccess can access SharePoint Online and Exchange Online.
2. Enable Policy 1: Verify users on Domain Joined devices who are not in the exclude groups are able to access Exchange Online and SharePoint Online. Verify users in the Exclude group can access SharePoint Online and Exchange from any device.
3. Enable Policy 2: Verify users who are not in the exclude group cannot get to SharePoint Online and Exchange Online from their mobile devices. Verify users in the Exclude group can access SharePoint and Exchange from any device (Windows/iOS/Android).
4. Enable Policy 3: Verify users who are not in the exclude groups cannot access SharePoint and Exchange off the corporate network, even with a domain joined machine. Verify users in the Exclude group can access SharePoint and Exchange from any network.
5. Enable Policy 4: Verify all users cannot get Exchange Online from the native mail applications on mobile devices.
6. Disable the existing MFA policy for SharePoint Online and Exchange Online.

In this next example, **Example B - Contingency Conditional Access policies to allow mobile access to Salesforce**, a business app’s access is restored. In this scenario, the customer typically requires their sales employees access to Salesforce (configured for single-sign on with Azure AD) from mobile devices to only be allowed from compliant devices. The disruption in this case is that there is an issue with evaluating device compliance and the outage is happening at a sensitive time where the sales team needs access to Salesforce to close deals. These contingency policies will grant critical users access to Salesforce from a mobile device so that they can continue to close deals and not disrupt the business. In this example, **SalesforceContingency** contains all the Sales employees who need to retain access and **SalesAdmins** contains necessary admins of Salesforce.

**Example B - Contingency Conditional Access policies:**

* Policy 1: Block everyone not in the SalesContingency team
  * Name: EM001 - ENABLE IN EMERGENCY: Device Compliance Disruption[1/2] - Salesforce - Block All users except SalesforceContingency
  * Users and Groups: Include all users. Exclude SalesAdmins and SalesforceContingency
  * Cloud Apps: Salesforce.
  * Conditions: None
  * Grant Control: Block
  * State: Report-only
* Policy 2: Block the Sales team from any platform other than mobile (to reduce surface area of attack)
  * Name: EM002 - ENABLE IN EMERGENCY: Device Compliance Disruption[2/2] - Salesforce - Block All platforms except iOS and Android
  * Users and Groups: Include SalesforceContingency. Exclude SalesAdmins
  * Cloud Apps: Salesforce
  * Conditions: Device Platform Include All Platforms, exclude iOS and Android
  * Grant Control: Block
  * State: Report-only

Order of activation:

1. Exclude SalesAdmins and SalesforceContingency from the existing device compliance policy for Salesforce. Verify a user in the SalesforceContingency group can access Salesforce.
2. Enable Policy 1: Verify users outside of SalesContingency cannot access Salesforce. Verify users in the SalesAdmins and SalesforceContingency can access Salesforce.
3. Enable Policy 2: Verify users in the SalesContingency group cannot access Salesforce from their Windows/Mac laptops but can still access from their mobile devices. Verify SalesAdmin can still access Salesforce from any device.
4. Disable the existing device compliance policy for Salesforce.

### Contingencies for user lockout from on-prem resources (NPS extension)

If you are protecting VPN access using Azure AD MFA NPS extension, consider federating your VPN solution as a [SAML app](../manage-apps/view-applications-portal.md) and determine the app category as recommended below. 

If you have deployed Azure AD MFA NPS extension to protect on-prem resources, such as VPN and Remote Desktop Gateway, with MFA - you should consider in advance if you are ready to disable MFA in a case of emergency.

In this case, you can disable the NPS extension, as a result, the NPS server will only verify primary authentication and will not enforce MFA on the users.

Disable NPS extension: 
-	Export the HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\AuthSrv\Parameters registry key as a backup. 
-	Delete the registry values for “AuthorizationDLLs” and “ExtensionDLLs”, not the Parameters key. 
-	Restart the Network Policy Service (IAS) service for the changes to take effect 
-	Determine if primary authentication for VPN is successful.

Once the service has recovered and you are ready to enforce MFA on your users again, enable the NPS extension: 
-	Import the registry key from backup HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\AuthSrv\Parameters 
-	Restart the Network Policy Service (IAS) service for the changes to take effect 
-	Determine if primary authentication as well as secondary authentication for VPN is successful.
-	Review NPS server and the VPN log to determine which users have signed in during the emergency window.

### Deploy password hash sync even if you are federated or use pass-through authentication

User lockout can also occur if the following conditions are true:

- Your organization uses a hybrid identity solution with pass-through authentication or federation.
- Your on-premises identity systems (such as Active Directory, AD FS, or a dependent component) are unavailable. 
 
To be more resilient, your organization should [enable password hash sync](../hybrid/choose-ad-authn.md), because it enables you to [switch to using password hash sync](../hybrid/plan-connect-user-signin.md) if your on-premises identity systems are down.

#### Microsoft recommendations
 Enable password hash sync using the Azure AD Connect wizard, regardless whether your organization uses federation or pass-through authentication.

>[!IMPORTANT]
> It is not required to convert users from federated to managed authentication to use password hash sync.

## During a disruption

If you opted for implementing a mitigation plan, you will be able to automatically survive a single access control disruption. However, if you opted to create a contingency plan, you will be able to activate your contingency policies during the access control disruption:

1. Enable your contingency policies that grant targeted users, access to specific apps, from specific networks.
2. Disable your regular control-based policies.

### Microsoft recommendations

Depending on which mitigations or contingencies are used during a disruption, your organization could be granting access with just passwords. No safeguard is a considerable security risk that must be weighed carefully. Organizations must:

1. As part of your change control strategy, document every change and the previous state to be able to roll back any contingencies you implemented as soon as the access controls are fully operational.
2. Assume that malicious actors will attempt to harvest passwords through password spray or phishing attacks while you disabled MFA. Also, bad actors might already have passwords that previously did not grant access to any resource that can be attempted during this window. For critical users such as executives, you can partially mitigate this risk by resetting their passwords before disabling MFA for them.
3. Archive all sign-in activity to identify who access what during the time MFA was disabled.
4. [Triage all risk detections reported](../reports-monitoring/concept-sign-ins.md) during this window.

## After a disruption

Undo the changes you made as part of the activated contingency plan once the service is restored that caused the disruption. 

1. Enable the regular policies
2. Disable your contingency policies back to report-only mode. 
3. Roll back any other changes you made and documented during the disruption.
4. If you used an emergency access account, remember to regenerate credentials and physically secure the new credentials details as part of your emergency access account procedures.
5. Continue to [Triage all risk detections reported](../reports-monitoring/concept-sign-ins.md) after the disruption for suspicious activity.
6. Revoke all refresh tokens that were issued [using PowerShell](/powershell/module/azuread/revoke-azureaduserallrefreshtoken) to target a set of users. Revoking all refresh tokens is important for privileged accounts used during the disruption and doing it will force them to reauthenticate and meet the control of the restored policies.

## Emergency options

 In case of an emergency and your organization did not previously implement a mitigation or contingency plan, then follow the recommendations in the [Contingencies for user lockout](#contingencies-for-user-lockout) section if they already use Conditional Access policies to enforce MFA.
 If your organization is using per-user MFA legacy policies, then you can consider the following alternative:

- If you have the corporate network outbound IP address, you can add them as trusted IPs to enable authentication only to the corporate network.
- If you don’t have the inventory of outbound IP addresses, or you required to enable access inside and outside the corporate network, you can add the entire IPv4 address space as trusted IPs by specifying 0.0.0.0/1 and 128.0.0.0/1.

>[!IMPORTANT]
 > If you broaden the trusted IP addresses to unblock access, risk detections associated with IP addresses (for example, impossible travel or unfamiliar locations) will not be generated.

>[!NOTE]
 > Configuring [trusted IPs](./howto-mfa-mfasettings.md) for Azure AD MFA is only available with [Azure AD Premium licenses](./concept-mfa-licensing.md).

## Learn more

* [Azure AD Authentication Documentation](./howto-mfaserver-iis.md)
* [Manage emergency-access administrative accounts in Azure AD](../roles/security-emergency-access.md)
* [Configure named locations in Azure Active Directory](../conditional-access/location-condition.md)
  * [Set-MsolDomainFederationSettings](/powershell/module/msonline/set-msoldomainfederationsettings)
* [How to configure hybrid Azure Active Directory joined devices](../devices/hybrid-join-plan.md)
* [Windows Hello for Business Deployment Guide](/windows/security/identity-protection/hello-for-business/hello-deployment-guide)
  * [Password Guidance - Microsoft Research](https://research.microsoft.com/pubs/265143/microsoft_password_guidance.pdf)
* [What are conditions in Azure Active Directory Conditional Access?](../conditional-access/concept-conditional-access-conditions.md)
* [What are access controls in Azure Active Directory Conditional Access?](../conditional-access/controls.md)
* [What is Conditional Access report-only mode?](../conditional-access/concept-conditional-access-report-only.md)
