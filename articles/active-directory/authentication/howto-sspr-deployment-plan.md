---
title: Self-service password reset deployment plan - Azure Active Directory
description: Tips for successful rollout of Azure AD self-service password reset

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 06/06/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahenry

ms.collection: M365-identity-device-management
---
# Deploy Azure AD self-service password reset

Self-service password reset (SSPR) is an Azure Active Directory feature that enables employees to immediately reset their passwords without needing to contact a help desk or other support mechanism. Employees must register for or be registered for the SSPR service by their administrator. During registration, the employee chooses one or more alternative authentication methods enabled by administrators.

## How SSPR benefits your organization

SSPR enables employees to quickly get unblocked and continue working no matter where they are or the time of day. By doing this themselves, they reduce non-productive time and support costs are eliminated for most password issues—the most common help-desk task.

You can help users get registered quickly by deploying SSPR alongside another “popular app” in your organization. This will generate a large volume of sign ins and will drive up registration (if you have registration enforced).  
Before deploying SSPR, you may want to determine how many password reset related help desk calls happen per week/month and the average cost of each call. You can use this data post deployment to show the value SSPR is bringing to your organization.  

## How SSPR works

When a user attempts to reset a password, they first verify their previously registered authentication method or methods to prove their identity. Then they provide a new password. For cloud-only users, the new password is stored in Azure Active Directory. For more information see How SSPR works.
For hybrid users, the password is written back to the on-premises Active Directory via the Azure AD Connect service. To understand this scenario in depth, review our documentation on how to configure password writeback.  

## Environments with multiple identity management systems

If there are multiple identity management systems within an environment such as on-premise Identity managers like Oracle AM, SiteMinder, or other systems, then passwords written to the master Active Directory may need to be synchronized to the other systems using a sync engine such as PCNS plug-in with MIM (Microsoft Identity Manager). To find information on this more complex scenario, see Deploy the MIM Password Change Notification Service on a domain controller. 
Before you get started, check out these videos to learn more about deployment and rollout:  

## Deploying self-service password reset

### How to roll out self-service password reset

#### Licensing Considerations

While SSPR functionality comes with editions of Azure active Directory, it is often deployed in conjunction with features that are available only in specific editions. See the Azure Active Directory licensing information.

### Enable Combined SSPR and MFA Registration

Microsoft recommends that you enable a combined registration for SSPR and multi-factor authentication. When you enable this combined registration, users need only select their registration information once to enable both features. Read more about Enabling combined security information registration.  You do not need to configure MFA when enabling combined registration; it improves the user experience when and if you later enable it.

When enabling combined registration, select a group that includes users for which you want to run a pilot of the SSPR process. Users register for combined SSPR and MFA at https://myprofile.microsoft.com.

### Plan configuration of the SSPR Service

Administrators configure the Azure AD SSPR Service with several settings. Following are recommendations for the specific configurations an administrator can make as part of an SSPR deployment. Explanations for each follow

| Area | Setting | Value |
| --- | --- | --- |
| SSPR Properties | Enforce SSPR | Group for pilot / All for production |
| Authentication methods | Authentication methods required to register | Minimum 3, always 1 more than required for reset |
|   | Authentication methods required to reset | One or two |
| Registration | Require users to register when signing in | Yes |
|   | Number of days before users are asked to re-confirm their authentication information | 90 – 180 days |
| Notifications | Notify users on password resets | Yes |
|   | Notify all admins when other admins reset their password | Yes |
| Customization | Help desk link | Customize |
|   | Help desk email or URL | Customize |
| On-premises | Write back passwords to on-premises AD | Yes (hybrid environments) |
|   | Allow users to unlock account without resetting password | Yes |

### SSPR properties recommendations

When enabling Self-service password reset, choose a security group to be used during the pilot.

When you plan to launch the service more broadly, we recommend using the All option to enforce SSPR for everyone in the organization. If you cannot set to all, select the appropriately Azure AD Security group or AD group synced to Azure AD.  

#### Authentication methods recommendations

Set Authentication methods required to register to three, or at least one more than the number required to reset. Setting multiple gives users flexibility when they need to reset.

Set Authentication methods required to reset to a level appropriate to your organization. One requires the least friction, while two may increase your security posture.

See What are authentication methods for detailed information on which authentication methods are available for SSPR, pre-defined security questions, and how to create customized security questions.

#### Registration settings recommendations

Set Require users to register when signing in to yes. This means that the users will be forced to register when signing in, ensuring that all users are protected.

Set Number of days before users are asked to re-confirm their authentication information to between 90 and 180 days, unless your organization has a business need to reset I a shorter time frame.

#### Notifications settings recommendations

Configure both the Notify users on password resets and the Notify all admins when other admins reset their password to Yes. Selecting Yes on both increases security by ensuring that users are aware when their password has been reset, and that all admins are aware when an admin changes a password. If users or admins receive such a notification and they have not initiated the change, they can immediately report a potential security breach.

#### Customization recommendations

It’s very important to customize the help desk link and the help desk email or URL to ensure users who experience problems can quickly get help.  

#### On-premises integration recommendations

If you have a hybrid environment, ensure that the Write back passwords to on-premises AD is set to Yes. Also set the Allow users to unlock account without resetting password to Yes, as it gives them more flexibility.

#### Changing/Resetting passwords of administrators

Administrator accounts are special accounts with elevated permissions. To secure them, the following applies to changing passwords of administrators: 
On-premises enterprise administrators or domain administrators cannot reset their password through SSPR. They can only do this in their on-premises environment. Thus, we recommend not syncing on-prem AD admin accounts to Azure AD.

An administrator cannot reset the password of other administrators or a global administrator.

An administrator cannot use secret Questions & Answers as a method to reset password. They must use phone/SMS only.

#### Important considerations for lock screen capabilities

To use SSPR on a Windows 10 computer the computer must be Azure Active Directory joined or hybrid Azure Active Directory joined (device must not be domain joined). See our documentation on Azure AD password reset from the login screen to learn how to enable this feature. This feature requires the Windows 10 Fall Creators Update (1709) or a newer Windows 10 version. The ‘Reset Password’ button can be enabled on the Windows 10 devices through Intune device configuration or a registry key (to be used for testing only). Note that password reset is not supported from a remote desktop.

## Plan deployment and support for SSPR

### Engage the right stakeholders

When technology projects fail, thy typically do so due to mismatched expectations on impact, outcomes, and responsibilities. To avoid these pitfalls, ensure that you are engaging the right stakeholders, and that stakeholder roles in the project are well understood by documenting the stakeholders and their project input and accountabilities.

### Plan communications

Communication is critical to the success of any new service. You should proactively communicate with your users how to use the service and what they can do to get help if something doesn’t work as expected. Review the Azure AD SSPR Planning Communication documentation for ideas on how to plan your end-user communication strategy. ADD LINK TO DOWNLOAD MATERIALS

### Plan testing

To ensure that your deployment works as expected, you should plan out the set of test cases you will use to validate the implementation. Following are some useful test scenarios for which you can document your organizations expected results based on your policies.

| Business case | Expected result |
| --- | --- |
| SSPR portal is accessible from within the corporate network | Determined by your organization |
| SSPR portal is accessible from outside the corporate network | Determined by your organization |
| Reset user password from browser when user is not enabled for password reset | User will not be able to access the password reset flow |
| Reset user password from browser when user has not registered for password reset | User will not be able to access the password reset flow |
| User signs in when password reset registration is enforced | User will be prompted to register security information |
| User signs in when password reset registration has been completed | User will not be prompted to register security information |
| SSPR portal is accessible when the user does not have a license | Is accessible |
| Reset user password from Windows 10 AADJ or H+AADJ device lock screen after user has registered | User can reset password |
| SSPR registration and usage data is available to administrators in near real time | Is available via audit logs |

### Plan support

While SSPR does not typically create user issues, it is important to have support staff prepared to deal with issues that may arise. 
While an administrator can change or reset the password for end users through the users & groups blade in Azure AD portal, it is generally better to help resolve the issue via a support process.

In the operational guide section of this document, create a list of support cases and their likely causes, and create a guide for resolution. 

### Plan reporting

#### Auditing

Audit logs for registration and password reset are available for 30 days. Therefore, if security auditing within a corporation requires longer retention, the logs need to be exported and consumed into a SIEM tool such as Splunk or ArcSight.

In the table below, document the backup schedule, the system, and the responsible parties. You may not need separate auditing and reporting backups, but you should have a separate backup from which you can recover from an issue.

|   | Frequency of download | Target system | Responsible party |
| --- | --- | --- | --- |
| Auditing backup |   |   |   |
| Reporting backup |   |   |   |
| Disaster recovery backup |   |   |   |

## Implement SSPR

Now that you have planned your solution, you are ready to implement it.

### Solution components

Implementation occurs in three stages:

- Configuring users and licenses
- Configuring Azure AD Connect Server for password writeback
- Configuring the Azure AD SSPR service for registration and self-service

### Configuring Users and Licenses

#### Change Communications

Begin implementation of the communications plan that you developed in the planning phase.

#### Ensure groups are created and populated

Reference the Planning password authentication methods section and ensure the group(s) for the pilot or production implementation are available, and all appropriate users are added to the groups.

#### Apply Licenses

The groups you are going to implement must have the Azure AD premium license assigned to them. You can assign them directly to the group, or you can use existing license policies (such as PowerShell or Group Based Licensing feature.) 

#### Assigning licenses to groups (link to Doc)

The groups that you have selected may already have licenses assigned.  

To check the assignment of licenses, perform the following steps:

1. Access the Azure portal with an administrator account.
1. Select All Services, and in the Filter box, type Azure Active Directory, and then select Azure Active Directory.
1. Under Manage, select Groups, type the name of the group, and then select it.
1. In the group properties, select Licenses, and then ensure that the group has one of the following licenses assigned:
   - Azure AD Premium P1
   - Azure AD Premium P2
   - Enterprise Mobility + Security E3
   - Enterprise Mobility + Security E5
   - Microsoft 365 E3
   - Microsoft 365 E5

If one of those is assigned, you can move forward. If not, you will need to assign the license to the group(s).

To assign licenses

1. Access the Azure portal with an administrator account. 
1. Select All Services, and in the Filter box, type Azure Active Directory, and then select Azure Active Directory. 
1. Under Manage, select Licenses, and then All Products 
   - All products available within your tenant are displayed. 
1. Select one of the following licenses and then select Assign. 
   - Azure AD Premium P1
   - Azure AD Premium P2
   - Enterprise Mobility + Security E3
   - Enterprise Mobility + Security E5
   - Microsoft 365 (Plan E3)
   - Microsoft 365 (Plan E5)
1. On the Assign License tab, select Users and Groups.
1. In the search box, type the name of the first group to be assigned the license, select the group, and then click the Select button at the bottom of the screen.
1. Repeat this process for each group

#### Configure the Azure AD Connect Server (link to Doc)

To configure password writeback:

1. To configure and enable password writeback, sign in to your Azure AD Connect server and start the Azure AD Connect configuration wizard.
1. On the Welcome page, select Configure.
1. On the Additional tasks page, select Customize synchronization options, and then select Next.
1. On the Connect to Azure AD page, enter a global administrator credential, and then select Next.
1. On the Connect directories and Domain/OU filtering pages, select Next.
1. On the Optional features page, select the box next to Password writeback and select Next.
1. On the Ready to configure page, select Configure and wait for the process to finish.
1. When you see the configuration finish, select Exit.

The password-write back feature is now on and SSPR will now work from the portal or from the Windows lock screen.

#### Enable SSPR in Windows

Windows 10 devices: Users can use Windows 10 Azure AD joined devices to perform SSPR. No further SSPR configuration is required. Follow this article to ensure Windows 10 devices are Azure AD joined.

#### Configure the SSPR Service

##### Enable Groups for SSPR

1. Access the Azure portal with an administrator account.
1. Select All Services, and in the Filter box, type Azure Active Directory, and then select Azure Active Directory.
1. On the Active Directory blade, select Password reset.
1. In the properties pane, select Selected. If you want all users enabled, Select All.
1. In the Default password reset policy blade, type the name of the first group, select it, and then click Select at the bottom of the screen, and select Save at the top of the screen.
1. Repeat this process for each group.

##### Configure the Authentication methods

Reference your planning from the Planning Password Authentication Methods section of this document.

1. Select Registration, under Require user to register when signing in, select Yes, and then set the number of days before expiration, and then select Save. 
1. Select Notification, and configure per your plan, and then select Save. 
1. Select Customization, and configure per your plan, and then select Save. 
1. Select On-premises integration, and configure per your plan, and then select Save. 

## Manage SSPR

Required Roles

| Business role/persona | Azure AD Role (if required) |
| Level 1 Helpdesk | Password administrator |
| Level 2 Helpdesk | User administrator |
| SSPR Administrator | Global administrator |

### Support Case Scenarios

To enable your support team success, you can create an FAQ based on questions you receive from your users. The following table contains common support scenarios.

| Scenarios | Description |
| --- | --- |
| User does not have any registered authentication methods available | A user is trying to reset their password but does not have any of the authentication methods that they registered available (i.e. they left their cell phone at home and can’t access email) |
| User is not receiving a text or call on their office or mobile phone | A user is trying to verify their identity via text or call but is not receiving a text/call. |
| User cannot access the password reset portal | A user wants to reset their password but is not enabled for password reset and therefore cannot access the page to update passwords. |
| User cannot set a new password | A user completes verification during the password reset flow but cannot set a new password. |
| User does not see a Reset Password link on a Windows 10 device | A user is trying to reset password from the Windows 10 lock screen, but the device is either not joined to Azure AD, or the Intune device policy is not enabled |

You may want to create a cheat sheet of support steps specific to your organization. In that cheat sheet, you should include information on:

- which groups are enabled for SSPR.
- which authentication methods are configured.
- the access policies related to on or of the corporate network.
- troubleshooting steps for common scenarios.

You can also refer to our online documentation on troubleshooting self-service password reset to understand general troubleshooting steps for the most common SSPR scenarios.

### Expected SLA

You can review Azure AD’s latest SLA information on the SLA for Azure AD page.

#### Auditing

After deployment, many organizations want to know how or if self-service password reset (SSPR) is really being used. The reporting feature that Azure Active Directory (Azure AD) provides helps you answer questions by using prebuilt reports.

## Next steps

Consider implementing Azure AD password protection

Consider implementing Azure AD Smart Lockout
