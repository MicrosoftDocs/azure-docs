---
title: Moving to Azure AD MFA and Azure AD user authentication - Azure Active Directory
description: Step-by-step guidance to move from Azure MFA Server on-premises to Azure AD MFA and Azure AD user authentication

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 06/15/2021

ms.author: BarbaraSelden
author: justinha
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Moving to Azure AD MFA and Azure AD user authentication

Multi-factor authentication (MFA) helps secure your infrastructure and assets from bad actors. 
Microsoft’s Multi-Factor Authentication Server (MFA Server) is no longer offered for new deployments. 
Customers who are using MFA Server should move to Azure AD Multi-Factor Authentication (Azure AD MFA). 

There are several options for migrating your multi-factor authentication (MFA) from MFA Server to Azure Active Directory (Azure AD). 
These include:

* Good: Moving only your [MFA service to Azure AD](how-to-migrate-mfa-server-to-azure-mfa.md). 
* Better: Moving your MFA service and user authentication to Azure AD, covered in this article.
* Best: Moving all of your applications, your MFA service, and user authentication to Azure AD. See the move applications to Azure AD section of this article if you plan to move applications, covered in this article. 

To select the appropriate MFA migration option for your organization, see the considerations in [Migrate from MFA Server to Azure Active Directory MFA](how-to-migrate-mfa-server-to-azure-mfa.md). 

The following diagram shows the process for migrating to Azure AD MFA and cloud authentication while keeping some of your applications on AD FS. 
This process enables the iterative migration of users from MFA Server to Azure MFA based on group membership.

Each step is explained in the subsequent sections of this article.

>[!NOTE]
>If you are planning on moving any applications to Azure Active Directory as a part of this migration, you should do so prior to your MFA migration. If you move all of your apps, you can skip sections of the MFA migration process. See the section on moving applications at the end of this article.

## Process

![Process to migrate to Azure AD and user authentication.](media/how-to-migrate-mfa-server-to-azure-mfa-user-authentication/mfa-cloud-authentication-flow.png)

## Prepare groups and Conditional Access

Groups are used in three capacities for MFA migration.
* **To iteratively move users to Azure AD MFA with staged rollout.**
Use a group created in Azure AD, also known as a cloud-only group. You can use Azure AD security groups or Microsoft 365 Groups for both moving users to MFA and for Conditional Access policies.  For more information see creating an Azure AD security group, and  this overview of Microsoft 365 Groups for administrators.
  >[!IMPORTANT]
  >Nested and dynamic groups are not supported in the staged rollout process. Do not use these types of groups for your staged rollout effort.
* **Conditional Access policies**. 
You can use either Azure AD or on-premises groups for conditional access.
* **To invoke Azure AD MFA for AD FS applications with claims rules.**
This applies only if you have applications on AD FS.
This must be an on-premises Active Directory security group. Once Azure AD MFA is an additional authentication method, you can designate groups of users to use that method on each relying party trust. For example, you can call Azure AD MFA for users you have already migrated, and MFA Server for those not yet migrated. This is helpful both in testing, and during migration. 

>[!NOTE] 
>We do not recommend that you reuse groups that are used for security. When using a security group to secure a group of high-value apps via a Conditional Access policy, that should be the only use of that group.

### Configure Conditional Access policies

If you are already using Conditional Access to determine when users are prompted for MFA, you won’t need any changes to your policies. 
As users are migrated to cloud authentication, they will start using Azure AD MFA as defined by your existing Conditional Access policies. 
They won’t be redirected to AD FS and MFA Server anymore.

If your federated domain(s) have SupportsMFA set to false, you are likely enforcing MFA on AD FS using claims rules. 
In this case, you will need to analyze your claims rules on the Azure AD relying party trust and create Conditional Access policies that support the same security goals.

If you need to configure Conditional Access policies, you need to do so before enabling staged rollout. 
For more information, see the following resources:
* [Plan a Conditional Access deployment](../conditional-access/plan-conditional-access.md)
* [Common Conditional Access policies](../conditional-access/concept-conditional-access-policy-common.md)

## Prepare AD FS 

If you do not have any applications in AD FS that require MFA, you can skip this section and go to the section Prepare staged rollout.

### Upgrade AD FS server farm to 2019, FBL 4

In AD FS 2019, Microsoft released new functionality that provides the ability to specify additional authentication methods for a relying party, such as an application. 
This is done by using group membership to determine the authentication provider. 
By specifying an additional authentication method, you can transition to Azure AD MFA while keeping other authentication intact during the transition. 

For more information, see [Upgrading to AD FS in Windows Server 2016 using a WID database](https://docs.microsoft.com/windows-server/identity/ad-fs/deployment/upgrading-to-ad-fs-in-windows-server). 
The article covers both upgrading your farm to AD FS 2019 and upgrading your FBL to 4.

### Configure claims rules to invoke Azure AD MFA

Now that you have Azure AD MFA as an additional authentication method, you can assign groups of users to use Azure AD MFA. You do this by configuring claims rules, also known as *relying party trusts*. By using groups, you can control which authentication provider is called either globally or by application. For example, you can call Azure AD MFA for users who have registered for combined security information or had their phone numbers migrated, while calling MFA Server for those who have not. 

>[!NOTE]
>Claims rules require on-premises security group. 

#### Back up existing rules 

Before configuring new claims rules, back up your existing rules. 
You will need to restore these as a part of your clean up steps. 

Depending on your configuration, you may also need to copy the existing rule and append the new rules being created for the migration.

To view existing global rules, run:  
```powershell
Get-AdfsAdditionalAuthenticationRule
```

To view existing relying party trusts, run the following command and replace RPTrustName with the name of the relying party trust claims rule: 

```powershell
(Get-AdfsRelyingPartyTrust -Name “RPTrustName”).AdditionalAuthenticationRules
```

#### Access Control Policies

>[!NOTE]
>Access control policies can’t be configured so that a specific authentication provider is invoked based on group membership. 

To transition from your access control policies to additional authentication rules, run this command for each of your Relying Party Trusts using the MFA Server authentication provider:

```powershell
Set-AdfsRelyingPartyTrust -**TargetName AppA -AccessControlPolicyName $Null**
```

This command will move the logic from your current Access Control Policy into Additional Authentication Rules.

#### Set up the group, and find the SID

You will need to have a specific group in which you place users for whom you want to invoke Azure AD MFA. You will need to find the security identifier (SID) for that group.
To find the group SID use the following command, with your group name
`Get-ADGroup “GroupName”`

![PowerShell command to get the group SID.](media/how-to-migrate-mfa-server-to-azure-mfa-user-authentication/find-the-sid.png)

#### Setting the Claims Rules to Call Azure MFA

The following PowerShell cmdlets invoke Azure AD MFA for those in the group when they aren’t on the corporate network. 
You must replace "YourGroupSid" with the SID found by running the preceding cmdlet.

Make sure you review the [How to Choose Additional Auth Providers in 2019](https://docs.microsoft.com/windows-server/identity/ad-fs/overview/whats-new-active-directory-federation-services-windows-server#how-to-choose-additional-auth-providers-in-2019). 

>[!IMPORTANT] 
>Backup your existing claims rules before proceeding.

##### Set global claims rule 

Run the following command and replace RPTrustName with the name of the relying party trust claims rule: 

```powershell
(Get-AdfsRelyingPartyTrust -Name “RPTrustName”).AdditionalAuthenticationRules
```

The command  returns your current additional authentication rules for your relying party trust.  
You need to append the following rules to your current claim rules:

```console
c:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value == 
“YourGroupSID"] => issue(Type = "http://schemas.microsoft.com/claims/authnmethodsproviders", 
Value = "AzureMfaAuthentication");
not exists([Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
Value==“YourGroupSid"]) => issue(Type = 
"http://schemas.microsoft.com/claims/authnmethodsproviders", Value = 
"AzureMfaServerAuthentication");’
```

The following example assumes your current claim rules are configured to prompt for MFA when users connect from outside your network. 
This example includes the additional rules that you need to append.

```PowerShell
Set-AdfsAdditionalAuthenticationRule -AdditionalAuthenticationRules 'c:[type == 
"http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", value == "false"] => issue(type = 
"http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod", value = 
"http://schemas.microsoft.com/claims/multipleauthn" );
 c:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value == 
“YourGroupSID"] => issue(Type = "http://schemas.microsoft.com/claims/authnmethodsproviders", 
Value = "AzureMfaAuthentication");
not exists([Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
Value==“YourGroupSid"]) => issue(Type = 
"http://schemas.microsoft.com/claims/authnmethodsproviders", Value = 
"AzureMfaServerAuthentication");’
```

##### Set per-application claims rule

This example modifies claim rules on a specific relying party trust (application). It includes the additional rules you need to append.

```PowerShell
Set-AdfsRelyingPartyTrust -TargetName AppA -AdditionalAuthenticationRules 'c:[type == 
"http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork", value == "false"] => issue(type = 
"http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod", value = 
"http://schemas.microsoft.com/claims/multipleauthn" );
c:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value == 
“YourGroupSID"] => issue(Type = "http://schemas.microsoft.com/claims/authnmethodsproviders", 
Value = "AzureMfaAuthentication");
not exists([Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
Value==“YourGroupSid"]) => issue(Type = 
"http://schemas.microsoft.com/claims/authnmethodsproviders", Value = 
"AzureMfaServerAuthentication");’
```

### Configure Azure AD MFA as an authentication provider in AD FS

In order to configure Azure AD MFA for AD FS, you must configure each AD FS server. 
If you have multiple AD FS servers in your farm, you can configure them remotely using Azure AD PowerShell.

For step-by-step directions on this process, see [Configure the AD FS servers](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/configure-ad-fs-and-azure-mfa#configure-the-ad-fs-servers).

Once you have configured the servers, you can add Azure AD MFA as an additional authentication method. 

![Screenshot of how to add Azure AD MFA as an additional authentication method.](media/how-to-migrate-mfa-server-to-azure-mfa-user-authentication/edit-authentication-methods.png)


## Prepare staged rollout 

Now you are ready to enable the staged rollout feature. Staged rollout helps you to iteratively move your users to either PHS or PTA. 

* Be sure to review the supported scenarios. 
* First you will need to do either the prework for PHS or the prework for PTA. We  recommend PHS. 
* Next you will do the prework for seamless SSO. 
* Enable the staged rollout of cloud authentication for your selected authentication method. 
* Add the group(s) you created for staged rollout. Remember that you will add users to groups iteratively, and that they cannot be dynamic groups or nested groups. 

