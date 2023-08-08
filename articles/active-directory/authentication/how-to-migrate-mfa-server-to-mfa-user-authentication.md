---
title: Migrate to Azure AD MFA and Azure AD user authentication
description: Guidance to move from MFA Server on-premises to Azure AD MFA and Azure AD user authentication
services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 05/23/2023
ms.author: gasinh
author: gargi-sinha
manager: martinco
ms.reviewer: michmcla
ms.collection: M365-identity-device-management
---
# Migrate to Azure AD MFA and Azure AD user authentication

Multi-factor authentication (MFA) helps secure your infrastructure and assets from bad actors. Microsoft Multi-Factor Authentication Server (MFA Server) is no longer offered for new deployments. Customers who are using MFA Server should move to Azure AD Multi-Factor Authentication (Azure AD MFA). 

There are several options for migrating from MFA Server to Azure Active Directory (Azure AD):

* Good: Moving only your [MFA service to Azure AD](how-to-migrate-mfa-server-to-azure-mfa.md). 
* Better: Moving your MFA service and user authentication to Azure AD, covered in this article.
* Best: Moving all of your applications, your MFA service, and user authentication to Azure AD. See the move applications to Azure AD section of this article if you plan to move applications, covered in this article. 

To select the appropriate MFA migration option for your organization, see the considerations in [Migrate from MFA Server to Azure Active Directory MFA](how-to-migrate-mfa-server-to-azure-mfa.md). 

The following diagram shows the process for migrating to Azure AD MFA and cloud authentication while keeping some of your applications on AD FS. 
This process enables the iterative migration of users from MFA Server to Azure AD MFA based on group membership.

Each step is explained in the subsequent sections of this article.

>[!NOTE]
>If you're planning on moving any applications to Azure Active Directory as a part of this migration, you should do so prior to your MFA migration. If you move all of your apps, you can skip sections of the MFA migration process. See the section on moving applications at the end of this article.

## Process to migrate to Azure AD and user authentication

![Process to migrate to Azure AD and user authentication.](media/how-to-migrate-mfa-server-to-mfa-user-authentication/mfa-cloud-authentication-flow.png)

## Prepare groups and Conditional Access

Groups are used in three capacities for MFA migration.

* **To iteratively move users to Azure AD MFA with Staged Rollout.**

  Use a group created in Azure AD, also known as a cloud-only group. You can use Azure AD security groups or Microsoft 365 Groups for both moving users to MFA and for Conditional Access policies. 

  >[!IMPORTANT]
  >Nested and dynamic groups aren't supported for Staged Rollout. Don't use these types of groups.

* **Conditional Access policies**. 
  You can use either Azure AD or on-premises groups for Conditional Access.

* **To invoke Azure AD MFA for AD FS applications with claims rules.**
  This step applies only if you use applications with AD FS.
  
  You must use an on-premises Active Directory security group. Once Azure AD MFA is an additional authentication method, you can designate groups of users to use that method on each relying party trust. For example, you can call Azure AD MFA for users you already migrated, and MFA Server for users who aren't migrated yet. This strategy is helpful both in testing and during migration. 

>[!NOTE] 
>We don't recommend that you reuse groups that are used for security. Only use the security group to secure a group of high-value apps with a Conditional Access policy.

### Configure Conditional Access policies

If you're already using Conditional Access to determine when users are prompted for MFA, you won't need any changes to your policies. 
As users are migrated to cloud authentication, they'll start using Azure AD MFA as defined by your Conditional Access policies. 
They won't be redirected to AD FS and MFA Server anymore.

If your federated domains have the **federatedIdpMfaBehavior** set to `enforceMfaByFederatedIdp` or **SupportsMfa** flag set to `$True` (the **federatedIdpMfaBehavior** overrides **SupportsMfa** when both are set), you're likely enforcing MFA on AD FS by using claims rules. 
In this case, you'll need to analyze your claims rules on the Azure AD relying party trust and create Conditional Access policies that support the same security goals.

If necessary, configure Conditional Access policies before you enable Staged Rollout. 
For more information, see the following resources:

* [Plan a Conditional Access deployment](../conditional-access/plan-conditional-access.md)
* [Common Conditional Access policies](../conditional-access/concept-conditional-access-policy-common.md)

## Prepare AD FS 

If you don't have any applications in AD FS that require MFA, you can skip this section and go to the section [Prepare Staged Rollout](#prepare-staged-rollout).

### Upgrade AD FS server farm to 2019, FBL 4

In AD FS 2019, Microsoft released new functionality to help specify additional authentication methods for a relying party, such as an application. 
You can specify an additional authentication method by using group membership to determine the authentication provider. 
By specifying an additional authentication method, you can transition to Azure AD MFA while keeping other authentication intact during the transition. 

For more information, see [Upgrading to AD FS in Windows Server 2016 using a WID database](/windows-server/identity/ad-fs/deployment/upgrading-to-ad-fs-in-windows-server). 
The article covers both upgrading your farm to AD FS 2019 and upgrading your FBL to 4.

### Configure claims rules to invoke Azure AD MFA

Now that Azure AD MFA is an additional authentication method, you can assign groups of users to use Azure AD MFA by configuring claims rules, also known as *relying party trusts*. By using groups, you can control which authentication provider is called either globally or by application. For example, you can call Azure AD MFA for users who registered for combined security information or had their phone numbers migrated, while calling MFA Server for users whose phone numbers haven't migrated. 

>[!NOTE]
>Claims rules require on-premises security group. 

#### Back up rules 

Before configuring new claims rules, back up your rules. 
You'll need to restore claims rules as a part of your clean-up steps. 

Depending on your configuration, you may also need to copy the existing rule and append the new rules being created for the migration.

To view global rules, run:  

```powershell
Get-AdfsAdditionalAuthenticationRule
```

To view relying party trusts, run the following command and replace RPTrustName with the name of the relying party trust claims rule: 

```powershell
(Get-AdfsRelyingPartyTrust -Name "RPTrustName").AdditionalAuthenticationRules
```

#### Access control policies

>[!NOTE]
>Access control policies can't be configured so that a specific authentication provider is invoked based on group membership. 

To transition from your access control policies to additional authentication rules, run this command for each of your Relying Party Trusts using the MFA Server authentication provider:

```powershell
Set-AdfsRelyingPartyTrust -**TargetName AppA -AccessControlPolicyName $Null**
```

This command will move the logic from your current Access Control Policy into Additional Authentication Rules.

#### Set up the group, and find the SID

You'll need to have a specific group in which you place users for whom you want to invoke Azure AD MFA. You'll need to find the security identifier (SID) for that group.
To find the group SID, run the following command and replace `GroupName` with your group name:

```powershell
Get-ADGroup GroupName
```

![Microsoft Graph PowerShell command to get the group SID.](media/how-to-migrate-mfa-server-to-mfa-user-authentication/find-the-sid.png)

#### Setting the claims rules to call Azure AD MFA

The following Microsoft Graph PowerShell cmdlets invoke Azure AD MFA for users in the group when they aren't on the corporate network. 
Replace `"YourGroupSid"` with the SID found by running the preceding cmdlet.

Make sure you review the [How to Choose Additional Auth Providers in 2019](/windows-server/identity/ad-fs/overview/whats-new-active-directory-federation-services-windows-server#how-to-choose-additional-auth-providers-in-2019). 

>[!IMPORTANT] 
>Back up your claims rules before proceeding.

##### Set global claims rule 

Run the following command and replace RPTrustName with the name of the relying party trust claims rule: 

```powershell
(Get-AdfsRelyingPartyTrust -Name "RPTrustName").AdditionalAuthenticationRules
```

The command  returns your current additional authentication rules for your relying party trust.  
You need to append the following rules to your current claim rules:

```console
c:[Type == "https://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value == 
"YourGroupSID"] => issue(Type = "https://schemas.microsoft.com/claims/authnmethodsproviders", 
Value = "AzureMfaAuthentication");
not exists([Type == "https://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
Value=="YourGroupSid"]) => issue(Type = 
"https://schemas.microsoft.com/claims/authnmethodsproviders", Value = 
"AzureMfaServerAuthentication");'
```

The following example assumes your current claim rules are configured to prompt for MFA when users connect from outside your network. 
This example includes the additional rules that you need to append.

```PowerShell
Set-AdfsAdditionalAuthenticationRule -AdditionalAuthenticationRules 'c:[type == 
"https://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", value == "false"] => issue(type = 
"https://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod", value = 
"https://schemas.microsoft.com/claims/multipleauthn" );
 c:[Type == "https://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value == 
"YourGroupSID"] => issue(Type = "https://schemas.microsoft.com/claims/authnmethodsproviders", 
Value = "AzureMfaAuthentication");
not exists([Type == "https://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
Value=="YourGroupSid"]) => issue(Type = 
"https://schemas.microsoft.com/claims/authnmethodsproviders", Value = 
"AzureMfaServerAuthentication");'
```

##### Set per-application claims rule

This example modifies claim rules on a specific relying party trust (application). It includes the additional rules you need to append.

```PowerShell
Set-AdfsRelyingPartyTrust -TargetName AppA -AdditionalAuthenticationRules 'c:[type == 
"https://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", value == "false"] => issue(type = 
"https://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod", value = 
"https://schemas.microsoft.com/claims/multipleauthn" );
c:[Type == "https://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value == 
"YourGroupSID"] => issue(Type = "https://schemas.microsoft.com/claims/authnmethodsproviders", 
Value = "AzureMfaAuthentication");
not exists([Type == "https://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
Value=="YourGroupSid"]) => issue(Type = 
"https://schemas.microsoft.com/claims/authnmethodsproviders", Value = 
"AzureMfaServerAuthentication");'
```

### Configure Azure AD MFA as an authentication provider in AD FS

In order to configure Azure AD MFA for AD FS, you must configure each AD FS server. If multiple AD FS servers are in your farm, you can configure them remotely using Microsoft Graph PowerShell.

For step-by-step directions on this process, see [Configure the AD FS servers](/windows-server/identity/ad-fs/operations/configure-ad-fs-and-azure-mfa#configure-the-ad-fs-servers).

After you configure the servers, you can add Azure AD MFA as an additional authentication method. 

![Screenshot of how to add Azure AD MFA as an additional authentication method.](media/how-to-migrate-mfa-server-to-mfa-user-authentication/edit-authentication-methods.png)


## Prepare Staged Rollout 

Now you're ready to enable [Staged Rollout](../hybrid/how-to-connect-staged-rollout.md). Staged Rollout helps you to iteratively move your users to either PHS or PTA while also migrating their on-premises MFA settings.

* Be sure to review the [supported scenarios](../hybrid/how-to-connect-staged-rollout.md#supported-scenarios). 
* First, you'll need to do either the [prework for PHS](../hybrid/how-to-connect-staged-rollout.md#pre-work-for-password-hash-sync) or the [prework for PTA](../hybrid/how-to-connect-staged-rollout.md#pre-work-for-pass-through-authentication). We  recommend PHS. 
* Next, you'll do the [prework for seamless SSO](../hybrid/how-to-connect-staged-rollout.md#pre-work-for-seamless-sso). 
* [Enable the Staged Rollout of cloud authentication](../hybrid/how-to-connect-staged-rollout.md#enable-a-staged-rollout-of-a-specific-feature-on-your-tenant) for your selected authentication method. 
* Add the group(s) you created for Staged Rollout. Remember that you'll add users to groups iteratively, and that they can't be dynamic groups or nested groups. 

## Register users for Azure AD MFA

This section covers how users can register for combined security (MFA and self-service-password reset) and how to migrate their MFA settings. Microsoft Authenticator can be used as in passwordless mode. It can also be used as a second factor for MFA with either registration method.

### Register for combined security registration (recommended)

We recommend having your users register for combined security information, which is a single place to register their authentication methods and devices for both MFA and SSPR. 

Microsoft provides communication templates that you can provide to your users to guide them through the combined registration process. 
These include templates for email, posters, table tents, and various other assets. Users register their information at `https://aka.ms/mysecurityinfo`, which takes them to the combined security registration screen. 

We recommend that you [secure the security registration process with Conditional Access](../conditional-access/howto-conditional-access-policy-registration.md) that requires the registration to occur from a trusted device or location. For information on tracking registration statuses, see [Authentication method activity for Azure Active Directory](howto-authentication-methods-activity.md).
> [!NOTE]
> Users who MUST register their combined security information from a non-trusted location or device can be issued a Temporary Access Pass or alternatively, temporarily excluded from the policy.

### Migrate MFA settings from MFA Server

You can use the [MFA Server Migration utility](how-to-mfa-server-migration-utility.md) to synchronize registered MFA settings for users from MFA Server to Azure AD. 
You can synchronize phone numbers, hardware tokens, and device registrations such as Microsoft Authenticator app settings. 

### Add users to the appropriate groups 

* If you created new Conditional Access policies, add the appropriate users to those groups. 
* If you created on-premises security groups for claims rules, add the appropriate users to those groups. 
* Only after you add users to the appropriate Conditional Access rules, add users to the group that you created for Staged Rollout. Once done, they'll begin to use the Azure authentication method that you selected (PHS or PTA) and Azure AD MFA when they're required to perform MFA.

> [!IMPORTANT] 
> Nested and dynamic groups aren't supported for Staged Rollout. Do not use these types of groups. 

We don't recommend that you reuse groups that are used for security. If you're using a security group to secure a group of high-value apps with a Conditional Access policy, only use the group for that purpose.

## Monitoring

Many [Azure Monitor workbooks](../reports-monitoring/howto-use-azure-monitor-workbooks.md) and **Usage & Insights** reports are available to monitor your deployment. 
These reports can be found in Azure AD in the navigation pane under **Monitoring**. 

### Monitoring Staged Rollout

In the [workbooks](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Workbooks) section, select **Public Templates**. Under **Hybrid Auth** section select the **Groups, Users and Sign-ins in Staged Rollout** workbook.

This workbook can be used to monitor the following activities: 
* Users and groups added to Staged Rollout.
* Users and groups removed from Staged Rollout.
* Sign-in failures for users in Staged Rollout, and the reasons for failures.

### Monitoring Azure AD MFA registration
Azure AD MFA registration can be monitored using the [Authentication methods usage & insights report](https://portal.azure.com/#blade/Microsoft_AAD_IAM/AuthenticationMethodsMenuBlade/AuthMethodsActivity/menuId/AuthMethodsActivity). This report can be found in Azure AD. Select **Monitoring**, then select **Usage & insights**. 

![Screenshot of how to find the Usage and Insights report.](media/how-to-migrate-mfa-server-to-mfa-user-authentication/usage-report.png)

In Usage & insights, select **Authentication methods**. 

Detailed Azure AD MFA registration information can be found on the Registration tab. You can drill down to view a list of registered users by selecting the **Users registered for Azure multi-factor authentication** hyperlink.

![Screenshot of the Registration tab.](media/how-to-migrate-mfa-server-to-mfa-user-authentication/registration-tab.png)

### Monitoring app sign-in health

Monitor applications you moved to Azure AD with the App sign-in health workbook or the application activity usage report.

* **App sign-in health workbook**. See [Monitoring application sign-in health for resilience](../fundamentals/monitor-sign-in-health-for-resilience.md) for detailed guidance on using this workbook.
* **Azure AD application activity usage report**. This [report](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsageAndInsightsMenuBlade/Azure%20AD%20application%20activity) can be used to view the successful and failed sign-ins for individual applications as well as the ability to drill down and view sign-in activity for a specific application. 

## Clean up tasks

After you move all users to Azure AD cloud authentication and Azure AD MFA, you're ready to decommission your MFA Server. 
We recommend reviewing MFA Server logs to ensure no users or applications are using it before you remove the server.

### Convert your domains to managed authentication

You should now [convert your federated domains in Azure AD to managed](../hybrid/migrate-from-federation-to-cloud-authentication.md#convert-domains-from-federated-to-managed) and remove the Staged Rollout configuration. 
This conversion ensures new users use cloud authentication without being added to the migration groups.

### Revert claims rules on AD FS and remove MFA Server authentication provider

Follow the steps under [Configure claims rules to invoke Azure AD MFA](#configure-claims-rules-to-invoke-azure-ad-mfa) to revert the claims rules and remove any AzureMFAServerAuthentication claims rules. 

For example, remove the following section from the rule(s): 

```console
c:[Type == "https://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value ==
"**YourGroupSID**"] => issue(Type = "https://schemas.microsoft.com/claims/authnmethodsproviders",
Value = "AzureMfaAuthentication");
not exists([Type == "https://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid",
Value=="YourGroupSid"]) => issue(Type =
"https://schemas.microsoft.com/claims/authnmethodsproviders", Value =
"AzureMfaServerAuthentication");'
```

### Disable MFA Server as an authentication provider in AD FS

This change ensures only Azure AD MFA is used as an authentication provider.

1. Open the **AD FS management console**.
1. Under **Services**, right-click on **Authentication Methods**, and select **Edit Multi-factor Authentication Methods**. 
1. Clear the **Azure Multi-Factor Authentication Server**  checkbox. 

### Decommission the MFA Server

Follow your enterprise server decommissioning process to remove the MFA Servers in your environment.

Possible considerations when decommissions the MFA Server include: 

* We recommend reviewing MFA Server logs to ensure no users or applications are using it before you remove the server.
* Uninstall Multi-Factor Authentication Server from the Control Panel on the server.
* Optionally clean up logs and data directories that are left behind after backing them up first. 
* Uninstall the Multi-Factor Authentication Web Server SDK, if applicable including any files left over inetpub\wwwroot\MultiFactorAuthWebServiceSdk and/or MultiFactorAuth directories.
* For pre-8.0.x versions of MFA Server, it may also be necessary to remove the Multi-Factor Auth Phone App Web Service.

## Move application authentication to Azure Active Directory

If you migrate all your application authentication with your MFA and user authentication, you'll be able to remove significant portions of your on-premises infrastructure, reducing costs and risks. 
If you move all application authentication, you can skip the [Prepare AD FS](#prepare-ad-fs) stage and simplify your MFA migration.

The process for moving all application authentication is shown in the following diagram.

![Process to migrate applications to to Azure AD MFA.](media/how-to-migrate-mfa-server-to-mfa-user-authentication/mfa-app-migration-flow.png)

If you can't move all your applications before the migration, move as many as possible before you start.
For more information about migrating applications to Azure, see [Resources for migrating applications to Azure Active Directory](../manage-apps/migration-resources.md).

## Next steps

- [Migrate from Microsoft MFA Server to Azure AD MFA (Overview)](how-to-migrate-mfa-server-to-azure-mfa.md)
- [Migrate applications from Windows Active Directory to Azure AD](../manage-apps/migrate-application-authentication-to-azure-active-directory.md)
- [Plan your cloud authentication strategy](../fundamentals/deployment-plans.md)
