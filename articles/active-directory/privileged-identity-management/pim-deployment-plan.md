---
title: Azure AD Privileged Identity Management (PIM) deployment plan | Microsoft Docs
description: Describes the roles you cannot manage in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: pim
ms.date: 02/01/2019
ms.author: rolyon
ms.custom: 
---

# Azure AD Privileged Identity Management (PIM) deployment plan

This step-by-step guide walks through the implementation of Privileged Identity Management in a five-step process.

> [!NOTE]
> Throughout this document, you will see items marked as
> - **Microsoft Recommends**
>
> These are general recommendations, and you should only implement if they apply to your specific enterprise needs.

## Learn about PIM

Azure AD Privileged Identity Management (PIM) is the best way for you to manage privileged administrative roles across Azure AD, Azure resources, and other Microsoft Online Services. In a world where privileged identities are assigned and forgotten, PIM provides easy solutions like just-in-time (JIT) access, request approval workflows, and fully integrated access reviews so you can identify, uncover, and prevent malicious activities of privileged roles in real time. Successful deployment of PIM to manage privileged roles throughout your organization will greatly reduce risk while surfacing valuable insights on activities of your privileged roles.

### Business Value of PIM

**Manage risk** Secure your organization by enforcing the principle of least privilege access (LPA) and just-in-time access. By minimizing the number of permanent assignments of users to privileged roles and enforcing approvals and MFA for elevation, you can greatly reduce security risks related to privileged access in your organization. This will also allow you to view a history of access to privileged role(s) and track down security issues as they happen.

**Address compliance and governance** Deploying PIM creates an environment for on-going identity governance. JIT elevation of privileged identities provides an easy way for PIM to keep track of privileged access activities going on in your organization. You will also be able to view and receive notification for all assignments of permanent and eligible roles inside your organization. Through access review, you can regularly audit and remove unnecessary privileged identities making sure your organization is compliant with the most rigorous identity, access, and security standards.

**Reduce costs** Reduce costs by eliminating inefficiencies, human error, and security issues by deploying PIM correctly.  The net result is a reduction of Cybercrimes associated with privileged identities, which are costly and difficult to recover from. PIM will also help your organization reduce cost associated with auditing access information when it comes to complying with regulations and standards.

### Licensing Requirements

Your administrators will need Azure AD Premium Plan 2 License to use PIM. Azure AD Premium Plan 2 is included in the following subscriptions:

Enterprise Mobility and Security (EMS) subscriptions:
- EMS E5 includes Azure AD Premium Plan 2.
Microsoft 365 (M365) subscriptions:
- M365 M5 Azure AD Premium Plan 2.

### Key PIM Terminology

**Eligibility:** In PIM, you can assign or convert a user to be ‘eligible’ for a privileged role and they will need to activate to temporarily use the role. This is different to role assignments in Azure Active Directory where the roles are permanently assigned to the user

**Activate:** When a user eligible for an admin role activates, they will need to satisfy your configured PIM policies (MFA, obtain approval etc.). Once activated, they can use the role for a preconfigured period-of-time before they need to activate again 

**Just-in-time (JIT) access:** The idea that privileged identities and access rights are given to the users only when they need to use it 

**Principle of least privilege access (LPA):** The idea that users should be delegated privileged roles that are specific to what they want to achieve, and nothing more to minimize your global admin count by delegating specific admin roles for specific scenarios

### High-level overview of oow PIM works

1. Following the steps in this deployment guide, set up PIM for your privileged roles and secure these roles by making users eligible for the role. 
1. When an eligible user needs to use their privileged role, they would activate their role in PIM 
1. Depending on the PIM policy configured for the role, user will need to complete certain steps (succeed multifactor authentication, get approval, write a reason etc.)
1. Once user successfully activates their role, they will get the role for a pre-configured time period
1. Admins will be able to view a history of all PIM activities in the audit log. They can also further secure their tenants and meet compliance using PIM features like access review and alerts.

### Roles that can be managed by PIM

**Azure AD Roles** – These are all the directory roles inside Azure Active Directory (global administrator, exchange administrator and security administrator etc.). You can read more about the roles and their functionality in our documentation. For help with determining which roles to assign your administrators, check out our guide for assigning least privileged roles.

**Azure Resource Roles** – These are roles that are linked to an Azure resource, resource group, subscription, or management group. PIM provides just-in-time access to both built-in roles like owner, user access administrator and contributor as well as custom defined roles. You can read more about Azure Resource roles here.

## Plan your deployment

This section focuses on what you need to do before deploying PIM in your organization. It is essential to follow the instructions and understand the concepts in this section as they will guide you in coming up with the best plan tailored for your organization’s privileged identities.

### Identify your stakeholders

The following section serves to identify all the stakeholders that are involved in the project and need to sign off, review, or stay informed. It includes separate tables for deploying PIM for Azure AD roles and PIM for Azure resource roles. Add stakeholders to the table below as appropriate for your organization.

- SO = Sign-off on this project
- R = Review this project and provide input
- I = Informed of this project

Stakeholders: PIM For Azure AD Roles

| Name | Role | Action |
| --- | --- | --- |
| Enter name and email | **Identity Architect or Azure Global Administrator**<br/>A representative from the identity management team in charge of defining how this change is aligned with the core identity management infrastructure in the customer’s organization. | SO/R/I |
| Enter name and email | **Service owner / line manager**<br/>These are the IT owners of a service or a group of services. They will be key in making decisions and helping with rolling out PIM for their team | SO/R/I |
| Enter name and email | **Security Owner**<br/>A representative from the security team that can sign off that the plan will meet the security requirements of your organization. | SO/R |
| Enter name and email | **IT Support Manager / Helpdesk**<br/>A representative from the IT support organization who can provide input on the supportability of this change from a helpdesk perspective. | R/I |
| Enter name and email for pilot users | **Privileged Role Users**<br/>The group of users for which privileged identity management would be implemented. They will need to know how to activate their roles once PIM is implemented  | I |

Stakeholders: PIM For Azure Resource Roles

| Name | Role | Action |
| --- | --- | --- |
| Enter name and email | **Subscription/Resource Owner**<br/>These are the IT owners of each subscription or resource that you want to deploy PIM for | SO/R/I |
| Enter name and email | **Security Owner**<br/>A representative from the security team that can sign off that the plan will meet the security requirements of your organization. | SO/R |
| Enter name and email | **IT Support Manager / Helpdesk**<br/>A representative from the IT support organization who can provide input on the supportability of this change from a helpdesk perspective. | R/I |
| Enter name and email for pilot users | **RBAC Role Users**<br/>The group of users for which privileged identity management would be implemented. They will need to know how to activate their roles once PIM is implemented  | I |

### Enable PIM

As part of the planning process you will want to first consent to and sign up for PIM by following our start using PIM guide. This will give you access to some of PIM’s features that are specifically designed to help with your deployment.

If your objective is to deploy PIM for Azure resource, you will also want to follow our discover Azure resources to manage in PIM guide. Only owners of each resource, resource group, and subscription will be able to discover them inside PIM. If you are a global administrator trying to deploy PIM for your Azure resources, you can enable subscription management to give yourself access to all Azure resources in the directory for discovery. However, we advise you to obtain buy-in from each of your subscription owners before managing their resources with PIM. 

### Enforce principle of least privilege

It is important to make sure that you have enforced the principle of least privilege in your organization for both your Azure AD and your Azure resource roles.

Azure AD Roles

For Azure AD Roles, it is common for organizations to assign the global administrator roles to a significant number of admins when most admins only need one or two specific admin roles. Privileged role assignments also tend to be left unmanaged.

Common pitfalls in role delegation:

1. The admin in charge of Exchange is given the global administrator role even though they only need the exchange admin role to perform their day to day job
1. Global administrator role is assigned to an Office admin because the admin needs both Security and SharePoint admin roles and it is easier to just delegate one role
1. Admin was assigned a security admin role to perform a task long ago but was never removed

Step 1 - Understand the granularity of the roles offered by reading and understanding the available roles in Azure AD. You and your team should also reference administrator roles by identity task in Azure Active Directory which explains the least privileged role for specific tasks.

Step 2 - You will want to see who has which roles in your organization. You can use PIM’s wizard by following the first five steps of the documentation. You should get to a page like the one below.

Step 3 - For all global administrators in your organization, you will need to find out why they need the role. Based on reading the documentation above, if the person’s job can be performed by one or more granular admin roles, you should remove them from the global administrator role and make assignments accordingly inside Azure Active Directory (As a reference: Microsoft currently only have about 10 admins with the global administrator role. Learn more at how Microsoft uses PIM).

Step 4 - For all other Azure AD roles, you should go through the list of assignments, identify admins who no longer need the role and remove them from their assignments.

To automate steps 3 and 4, you can utilize the access review function inside PIM. Following the steps in start an access review for Azure AD roles in PIM, you can set up an access review for every Azure AD role that has one or more members.

You should set the reviewer to “Members (self)”. This will send out an email to all members in the role getting them to confirm whether they need the access or not. You will also need to turn on “Require reason on approval” in the advanced settings so that users can state why they need the role. Based on this information, you will be able to remove users from unnecessary roles and delegate more granular admin roles in the case of global administrators.

Note: Access Review relies on emails to notify people to review their access to the roles. If you have privileged accounts that don’t have emails linked, be sure to populate the secondary email field on those accounts. Learn more about proxyAddresses attribute in Azure AD.

Azure Resource Roles

For Azure subscriptions and resources, you can set up a similar Access Review process to review the roles in each subscription or resource. The goal of this process is to minimize owner and user access administrator assignments attached to each subscription or resource as well as to remove unnecessary assignments. However, organizations often delegate such tasks to the owner of each subscription or resource because they have a better understanding of the specific roles (especially custom defined roles).

If you are an IT administrator with the global administrator role trying to deploy PIM for Azure resources in your organization, you can enable subscription management to get access to each subscription. You can then find each subscription owner and work with them to remove unnecessary assignments and minimize owner role assignment.

Users with the owner role for an Azure subscription can also utilize access review for Azure Resource to audit and remove unnecessary role assignments similar to the process described above for Azure AD roles.

### Decide which role assignments should be protected by PIM

After cleaning up privileged role assignments in your organization, you will need to decide which roles to protect with PIM.

If a role is protected by PIM, eligible users assigned to it must elevate to use the privileges granted by the role. The elevation process may also include obtaining approval, succeeding multi-factor authentication, and/or providing a reason why they are activating. PIM can also track elevations through notifications and the PIM and Azure AD audit event logs.

Choosing which roles to protect with PIM can be difficult and would be different for each organization. We will provide our best practice advice for Azure AD and Azure resource roles below.

Azure AD Roles

It is important to prioritize protecting Azure AD roles that have the most number of permissions. Based on usage patterns among all PIM customers, the top 10 Azure AD roles managed by PIM are:

1. Global administrator
1. Security administrator
1. User account administrator
1. Exchange administrator
1. SharePoint administrator
1. Intune Service administrator
1. Security reader
1. Service administrator
1. Billing administrator
1. Skype for Business administrator

✓ Microsoft recommends you manage all your global administrators and security administrators through PIM as a first step as they are the ones that can do the most harm when compromised.

It is also important to consider what data and permission are most sensitive for your organization. As an example, some organizations may want to protect their PowerBI Administrator role or their Teams administrator role through PIM as they have the ability to access data and/or change core workflows.

If there are any roles with guest users assigned, they are particularly vulnerable to attack

✓ Microsoft recommends you manage all roles with guest users through PIM to reduce risk associated with compromised guest user accounts.

Reader roles like the directory reader, message center reader and security reader are sometimes believed to be less important compared to other roles as they don’t have write permission. However, we have seen some of customers also protect these roles as attackers who have gained access to these accounts may be able to read sensitive data, such as Personal Identifiable Information (PII). You should take this into consideration when deciding whether reader roles in your organization need to be managed through PIM.

Azure resource roles

When deciding which role assignments should be managed through PIM for Azure resource, you will need to first identify the subscriptions/resources that are most vital for your organization. Examples of such subscription/resource would be:

- Resource(s) that hosts the most sensitive data 
- Resource(s) that core, customer facing applications depend on

If you are a global administrator having trouble deciding which resource/subscription are most important, you should reach out to subscription owners in your organization to gather a list of resources managed by each subscription. You should then work with the subscription owners to group the resources based on severity level in the case they are compromised (e.g. low, medium, high). You should prioritize managing resources with PIM based on this severity level.

✓ Microsoft recommends you to work with subscription/resource owner of critical services to set up PIM workflow for all roles inside sensitive subscription/resource.

Note: PIM for Azure resource supports timebound service accounts. You should treat service accounts exactly the same as how you would treat a regular user account.

For resources/subscriptions that are not as critical, you won’t need to set up PIM for all roles. However, you should still protect the owner and user access administrator roles with PIM

✓ Microsoft recommends you manage owner roles and user access administrator roles of all resources/subscriptions through PIM.

### Decide which role assignments should be permanent or eligible

Once you have decided the list of roles to be managed by PIM, you will need to decide which users should get the eligible role versus the permanently active role. Permanently active roles are the normal roles assigned through Azure Active Directory and Azure Resource while eligible roles can only be assigned in PIM.

✓ Microsoft recommends you have 0 permanently active assignments for both Azure AD roles and Azure Resource roles other than the recommended 2 break-glass emergency access accounts which should have the permanent global administrator role.

Even though we recommend 0 standing administrator, it is sometimes difficult for organizations to achieve this right away. Here are things to consider when making this decision:

Frequency of elevation – If the user only needs the privileged assignment once, they shouldn’t have the permanent assignment. On the other hand, if the user needs the role for their day to day job and using PIM would greatly reduce their productivity, they can be considered for the permanent role.

Cases specific to your organization – If the person being given the eligible role is from a very distant team or a high-ranking executive to the point that communicating and enforcing the elevation process is difficult, they can be considered for the permanent role

✓ Microsoft recommends you to set up recurring access reviews for users with permanent role assignments (should you have any). Learn more about recurring access review in the final section of this deployment plan

### Draft your PIM configurations

Before you implement your PIM solution, it is good practice to draft up your PIM configurations for every privileged role your organization uses. Below are some examples of PIM settings for particular roles (note: they are only for reference and might be different for your organization). Each of the setting columns will be explained in detail with Microsoft’s recommendations after :

PIM configuration table for Azure AD roles

:x:

| Roles | Require MFA | Notification | Incident Ticket | Require Approval | Approver | Activation Duration | Permanent Admin |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Global Administrator | ✔ |  |  |  | Other global administrators | 1 Hour | Emergency access accounts |
| Exchange administrator | :heavy_check_mark: |  | :x: |  | None | 2 Hour | None |
| Help desk administrator |  |  |  |  | None | 8 Hour | None |

PIM configuration table for Azure Resource roles

| Roles | Require MFA | Notification | Require Approval | Approver | Activation Duration | Active Admin | Active Expiration | Eligible Expiration |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Owner of critical subscriptions |  |  |  | Other owners of the subscription | 1 Hour | None | n/a | 3 month |
| User access administrator of less critical subscriptions |  |  |  | None | 1 Hour | None | n/a | 3 month |
| Virtual Machine Contributer |  |  |  | None | 3 Hour | None | n/a | 6 month |

Role: Name of the role you are defining the policy for

Require MFA: Whether the eligible user needs to perform MFA before activating the role

✓ Microsoft recommends you enforce MFA for all admin roles, especially if the roles have guest users.

Notification: If set to true, global admin, privileged role admin and security admin in the organization will receive an email notification when an eligible user activates the role

Note: Some organizations don’t have an email address tied to their admin accounts, to get these email notifications, you should go set an alternative email address so admins will receive these emails.

Incident Ticket: Whether the eligible user needs to record an incident ticket number when activating their role. This is to help an organization identify each activation with an internal incident number in order to mitigate unwanted activations

✓ Microsoft recommends take advantage of incident ticket numbers to tie PIM with your internal system. This is particularly useful for approvers who need context for the activation.

Require Approval: Whether the eligible user needs to get approval in order to activate the role

✓ Microsoft recommends you to set up approval for roles with the most permission. Based on usage patterns of all PIM customers, global administrator, user administrator, exchange administrator, security administrator and password administrator are the most common roles with approval setup.

Approver: If approval is required to activate the eligible role, list out the people who should approve the request. By default, PIM sets the approver to be all users who are a privileged role admin whether they are permanent or eligible.

Note: If a user is both eligible for an Azure AD role and an approver of the role, they will not be able to approve themselves

✓ Microsoft recommends that you choose approvers to be those who are most knowledgeable about the specific role and its frequent users rather than a global administrator

Activation duration: The length of time a user will be activated in the role before it will expire

Permanent admin: List of users who will be a permanent admin for the role (never have to activate).

✓ Microsoft recommends you have 0 standing admin for all roles except for global admins. Read more about it in the who should be made eligible and who should be permanently active section of this plan

Active admin: In Azure Resource, active admin is the list of users who will never have to activate in order to use the role. This is not referred to as permanent admin like in Azure AD roles because you can set an expiration time for when the user will lose this role

Active expiration: An active role assignment for roles in Azure Resource would expire after this configured time period. You can choose from 15 days, 1 month, 3 month, 6 month, 1 year or permanently active

Eligible expiration: An eligible role assignment for roles in Azure Resource would expire after this configured time period. You can choose from 15 days, 1 month, 3 month, 6 month, 1 year or permanently eligible

## Implement your solution

The foundation of proper planning is the basis upon which you can deploy an application successfully with Azure Active Directory.  It provides intelligent security and integration that simplifies onboarding while reducing the time for successful deployments.  This combination ensures that your application is integrated with ease while mitigating down time for your end users.

### Identify test users

Use this section to help with your implementation. Based on the policies that you selected in the design section, identify the users that you want to test for each role.

Identify a set of users and or groups of users to validate the implementation

✓ Microsoft recommends you make service owners of each Azure AD role to be the test users so they can become familiar with the process and become an internal advocator for the roll out

In this table, identify the test users that will verify that the policies for each role is working.

| Role Name | Test Users |
| --- | --- |
| &lt;Insert role name&gt; | &lt;Insert users to test the policy&gt; |
| &lt;Insert role name&gt; | &lt;Insert users to test the policy&gt; |

### Test implementation

Now that you have identified the test users, use these step to configure PIM for your test users. If your organization want to incorporate PIM workflow into your own internal application instead of using PIM’s user interface inside the Azure portal, all the operations in PIM are purely supported through our graph API.

Configure PIM for Azure AD Roles

Step 1 – Follow the documentation to configure PIM settings for a role based on what you planned

Step 2 – Navigate to Azure AD Roles and click Roles, select the role you just set up

Step 3 – For the group of test users, if they are already a permanent admin, you can make them eligible by searching for them and converting them from permanent to eligible by clicking the three dots on their row. If they don’t have the role assignments yet, you can make a new eligible assignment

Step 4 – Repeat steps 1-3 for all the roles you want to test

Step 5 – Once you have set up the test users, you should link them to the tutorial to activate their Azure AD role

Configure PIM for Azure Resource Roles

Step 1 – Follow the documentation to configure PIM settings for a role inside a subscription or resource that you want to test

Step 2 – Navigate to Azure Resources section for that subscription and click Roles, select the role you just set up

Step 3 – For the group of test users, if they are already an active admin, you can make them eligible by searching for them and update their role assignment. If they don’t have the role yet, you can assign a new role.

Step 4 – Repeat steps 1-3 for all the roles you want to test

Step 5 – Once you have set up the test users, you should link them to the tutorial to activate their Azure Resource role.

You should use this stage to verify whether all the configuration you set up for the roles are working correctly. Use the tables below to document your tests. You should also use this stage to optimize the communication with affected users.

| Roles | Expected Behavior During Activation | Actual Results |
| --- | --- | --- |
| e.g. Global Admin | e.g. (1) Require MFA (2) Require Approval (3) Approver receives notification and can approve (4) Role expires after preset time |  |
| e.g. Owner of subscription “X” | e.g. (1) Require MFA (2) eligible assignment expires after configured time period |  |

### Communicate PIM to affected stakeholders

Deploying PIM will introduce additional steps for users of privileged roles. Although PIM greatly reduces security issues associated with privileged identities, the change needs to be effectively communicated before tenant wide deployment. Depending on the number of impacted administrators, organizations often elect to create an internal document, a video or an email about the change. Frequently included in these communications include:

- What is PIM / what is the benefit for the organization
- Who will be affected
- When will PIM be rolled out
- What additional steps will be required for users to get their role. You should link them to our documentation to activate Azure AD role and/or Azure Resource role.
- Contact information or help desk link for any issues associated with PIM

If your organization has an internal IT support team

✓ Microsoft recommends you to set up time with your helpdesk/support team to walk them through the PIM workflow. Provide them with the appropriate documentations as well as your contact information

### Moving to production

Once your testing is complete and successful, move PIM to production by repeating all the steps in the testing phases for all the users of each role you defined in your PIM configuration. For PIM for Azure AD roles, organizations often test and roll out PIM for global administrators before testing and rolling out PIM for other roles. Meanwhile for Azure resource, organizations would normally test and roll out PIM one Azure subscription at a time.

### In the case a rollback is needed

If PIM failed to work as desired in the production environment, the following rollback steps below can assist you in reverting back to the known good state before setting up PIM:

For Azure AD Roles

1) Go to portal.azure.com
2) Navigate to Azure AD Privileged Identity Management
3) Click on Azure AD Roles on the left bar and choose Roles 
4) For each role that you have set up for, click the role and Make Permanent all users with eligible assignment by clicking the three dots on each users’ row

For Azure Resource Roles

1) Go to portal.azure.com
2) Navigate to Azure AD Privileged Identity Management
3) Click on Azure Resources on the left bar and choose the subscription or resource you want to roll back on. 
4) Choose Roles from the left bar and for each role that you have setup for, click the role and Make Permanent all users with eligible assignment by clicking the three dots on each users’ row

## Next steps after having PIM in production

Successfully deploying PIM is a big step forward in terms of securing your organization’s privileged identities. With the deployment of PIM comes additional PIM features that you should use for security and compliance. Learn about each of them below.

### Use PIM alerts to safeguard your privileged access

You should utilize PIM’s built in alerting functionality to better safeguard your tenant. You can read more about the types of alerts in our documentation. These alerts include: administrators aren’t using privileged roles, roles are being assigned outside of PIM, roles are being activated too frequently and more. In order to fully protect your organization, you should regularly go through your list of alerts and fix the issues. You can view and fix your alerts the following way:

1) Go to portal.azure.com
2) Navigate to Azure AD Privileged Identity Management
3) Click on Azure AD Roles on the left bar and choose Alerts

✓ Microsoft recommends you deal with all alerts marked with high severity immediately. For medium and low severity alerts, you should stay informed and make changes if you believe there is a security threat

If any of the specific alerts aren’t useful or does not apply to your organization, you can always dismiss the alert on the alerts page. You can always revert this dismissal later in the Azure AD settings page.

### Set up recurring access reviews to regularly audit your organization’s privileged identities

Access review is the best way for you to ask users assigned with privileged roles or specific reviewers whether each user need the privileged identity or not. This is great if you want to reduce attack surface and stay compliant. You can learn more about starting an access review in our access review documentation for Azure AD roles and Azure Resource roles. For some organizations, performing periodic access review is required to stay compliant with laws and regulations while for others, access review is the best way to enforce the principal of least privilege throughout your organization.

✓ Microsoft recommends you set up quarterly access reviews for all your Azure AD and Azure Resource roles.

In most cases, the reviewer for Azure AD roles is the users themselves while the reviewer for Azure Resource would be the owner of the subscription which the role is in. However, it is often the case where companies would have privileged accounts that are not linked with any particular person’s email address. In those cases, no one would end up reading and reviewing the access.

✓ Microsoft recommends you add a secondary email address for all accounts with privileged role assignments that are not linked to a regularly checked email address

### Get the most out of your audit log to improve security and compliance

The Audit log is the place where you can stay up to date and be compliant with regulations. PIM currently stores a 30 day history of all your organization’s history inside its audit log including:

- Activation/deactivation of eligible roles
- Role assignment activities inside and outside of PIM
- Changes in role settings
- Request/approve/deny activities for role activation with approval setup
- Update to alerts

You can access these audit logs if you are a global administrator or a privileged role administrator. Learn more about audit history for Azure AD roles and audit history for Azure Resource roles.

✓ Microsoft recommends you to have at least one admin read through all audit events on a weekly basis and export your audit events on a monthly basis.

If you want to automatically store your audit events for a longer period of time, PIM’s audit log is automatically synced into the Azure AD audit logs.

✓ Microsoft recommends you to setup Azure log monitoring to archive audit events in an Azure storage account for the need of security and compliance.
