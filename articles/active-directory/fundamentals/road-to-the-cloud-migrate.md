---
title: Road to the cloud - Moving identity and access management from AD to Azure AD migration workstream
description: Learn to plan your migration workstream of IAM from AD to Azure AD.
documentationCenter: ''
author: janicericketts
manager: martinco
ms.service: active-directory
ms.topic: how-to
ms.subservice: fundamentals
ms.date: 06/03/2022
ms.author: jricketts
ms.custom: references_regions
---

# Transition to the cloud

After aligning the organization towards halting growth of the AD footprint, you can focus on moving the existing on-premises workloads to Azure AD. This section describes the various migration workstreams. You can execute the workstreams in this section based on your priorities and resources.

A typical migration workstream has the following stages:

* **Discover**: find out what you currently have in your environment

* **Pilot**: deploy new cloud capabilities to a small subset (of users, applications, or devices, depending on the workstream)

* **Scale Out**: expand the pilot out to complete the transition of a capability to the cloud

* **Cut-over (when applicable)**: stop using the old on-premises workload

## Users and Groups

### Enable password self-service

We recommend a [passwordless environment](../authentication/concept-authentication-passwordless.md). Until then, you can migrate password self-service workflows from on-premises systems to Azure AD to simplify your environment. Azure AD [self-service password reset (SSPR)](../authentication/concept-sspr-howitworks.md) gives users the ability to change or reset their password, with no administrator or help desk involvement.

To enable self-service capabilities, choose the appropriate [authentication methods](../authentication/concept-authentication-methods.md) for your organization. Once the authentication methods are updated, you can enable user self-service password capability for your Azure AD authentication environment. For deployment guidance, see [Deployment considerations for Azure Active Directory self-service password reset](../authentication/howto-sspr-deployment.md)

**Additional considerations include**:

* Deploy [Password Protection](../authentication/howto-password-ban-bad-on-premises-operations.md) in a subset of DCs with *Audit Mode* to gather information about impact of modern policies. For more guidance, see [Enable on-premises Azure Active Directory Password Protection](../authentication/howto-password-ban-bad-on-premises-operations.md).
* Gradually register and enable [Combined registration for SSPR and Azure AD Multi-Factor Authentication](../authentication/concept-registration-mfa-sspr-combined.md). This enables both MFA and SSPR. For example, roll out by region, subsidiary, department, etc. for all users. 
* Go through a cycle of password change for all users to flush out weak passwords.
* Once the cycle is complete, implement the policy expiration time.

* Switch the "Password Protection" configuration in the DCs that have "Audit Mode" set to "Enforced mode" ([Enable on-premises Azure AD Password Protection](../authentication/howto-password-ban-bad-on-premises-operations.md))
>[!NOTE]
>* End user communications and evangelizing are recommended for a smooth deployment. See [Sample SSPR rollout materials](https://www.microsoft.com/download/details.aspx?id=56768) to assist with required end-user communications and evangelizing.
>* For customers with Azure AD Identity Protection, enable [password reset as a control in Conditional Access policies](../identity-protection/howto-identity-protection-configure-risk-policies.md) for risky users (users marked as risky through Identity Protection).

### Move groups management

To transform groups and distribution lists:

* For security groups, use your existing business logic that assigns users to security groups, migrate the logic and capability to Azure AD and dynamic groups.

* For self-managed group capabilities provided by Microsoft Identity Manager (MIM), replace the capability with self-service group management.

* [Conversion of legacy distribution lists to Microsoft 365 groups](/microsoft-365/admin/manage/upgrade-distribution-lists) - You can upgrade distribution lists to Microsoft 365 groups in Outlook. This is a great way to give your organization's distribution lists all the features and functionality of Microsoft 365 groups. 

* Upgrade your [distribution lists to Microsoft 365 groups in Outlook](https://support.microsoft.com/office/7fb3d880-593b-4909-aafa-950dd50ce188) and [decommission your on-premises Exchange server](/exchange/decommission-on-premises-exchange).

### Move provisioning of users and groups to applications

This workstream will help you to simplify your environment by removing application provisioning flows from on-premises IDM systems such as Microsoft Identity Manager. Based on your application discovery, categorize your application based on the following:

* Applications in your environment that have a provisioning integration with the [Azure AD Application Gallery](https://www.microsoft.com/security/business/identity-access-management/integrated-apps-azure-ad)

* Applications that aren't in the gallery but support the SCIM 2.0 protocol are natively compatible with Azure AD cloud provisioning service.

* On-Premises applications that have an ECMA connector available, can be integrated with [Azure AD on-premises application provisioning](../app-provisioning/on-premises-application-provisioning-architecture.md)

For more information check: [Plan an automatic user provisioning deployment for Azure Active Directory](../app-provisioning/plan-auto-user-provisioning.md)

### Move to Cloud HR provisioning

This workstream will reduce your on-premises footprint by moving the HR provisioning workflows from on-premises identity management (IDM) systems such as Microsoft Identity Manager (MIM) to Azure AD. Azure AD cloud HR provisioning can provision hybrid accounts or cloud-only accounts.

* For new employees who are exclusively using applications that use Azure AD, you can choose to provision cloud-only accounts, which in turn helps you to contain the footprint of AD.

* For new employees who need access to applications that have dependency on AD, you can provision hybrid accounts

Azure AD Cloud HR provisioning can also manage AD accounts for existing employees. For more information, see: [Plan cloud HR application to Azure Active Directory user provisioning](../app-provisioning/plan-cloud-hr-provision.md) and, specifically, [Plan the deployment project](../app-provisioning/plan-auto-user-provisioning.md).

### Move external identity management

If your organization provisions accounts in AD or other on-premises directories for external identities such as vendors, contractors, consultants, etc. You can simplify your environment by managing those third parties (3P) user objects natively in the cloud.

* For new external users, use [Azure AD External Identities](../external-identities/external-identities-overview.md), which will stop the AD footprint of users.

* For existing AD accounts that you provision for external identities, you can remove the overhead of managing local credentials (for example, passwords) by configuring them for B2B collaboration using the steps here: [Invite internal users to B2B collaboration](../external-identities/invite-internal-users.md).

* Use [Azure AD Entitlement Management](../governance/entitlement-management-overview.md) to grant access to applications and resources. Most companies have dedicated systems and workflows for this purpose that you can now move out on-premises tools.

* Use [Access Reviews](../governance/access-reviews-external-users.md) to remove access rights and/or external identities that are no longer needed.

## Devices

### Move Non-Windows OS workstations

Non-Windows workstations can be integrated with Azure AD to enhance user experience and benefit from cloud-based security features such as conditional access.

* macOS

    * Register macOS to Azure AD and [enroll/manage them with MDM solution](/mem/intune/enrollment/macos-enroll)

    * Deploy [Microsoft Enterprise SSO plug-in for Apple devices](../develop/apple-sso-plugin.md)

    * Plan to deploy [Platform SSO for macOS 13](https://techcommunity.microsoft.com/t5/microsoft-endpoint-manager-blog/microsoft-simplifies-endpoint-manager-enrollment-for-apple/ba-p/3570319)

* Linux

    * [Sign in to a Linux VM with Azure Active Directory credentials](../../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md) is available on Linux on Azure VM

### Replace Other Windows versions as Workstation use

If you have below versions of Windows, consider replacing to latest Windows client version to benefit from cloud native management (Azure AD join and UEM):

* Windows 7 or 8.x

* Windows Server OS as workstation use

### Virtual desktop infrastructure (VDI) solution

This project has two primary initiatives. The first is to plan and implement a VDI environment for new deployments that isn't AD-dependent. The second is to plan a transition path for existing deployments that have AD-dependency.

* **New deployments** - Deploy a cloud managed VDI solution such as Windows 365 and or Azure Virtual Desktop (AVD) that doesn't require on-premises AD.

* **Existing deployments** - If your existing VDI deployment is dependent on AD, use business objectives and goals to determine whether you maintain the solution or migrate it to Azure AD.

For more information, see:

* [Deploy Azure AD joined VMs in Azure Virtual Desktop - Azure](../../virtual-desktop/deploy-azure-ad-joined-vm.md)

* [Windows 365 planning guide](/windows-365/enterprise/planning-guide)

## Applications

To help maintain a secure environment, Azure AD supports modern authentication protocols. To transition application authentication from AD to Azure AD, you must:

* Determine which applications can migrate to Azure AD with no modification

* Determine which applications have an upgrade path that enables you to migrate with an upgrade

* Determine which applications require replacement or significant code changes to migrate

The outcome of your application discovery initiative is to create a prioritized list used to migrate your application portfolio. The list also contains applications that:

* Require an upgrade or update to the software - there's an upgrade path available

* Require an upgrade or update to the software - there isn't an upgrade path available

Using the list, you can further evaluate the applications that don't have an existing upgrade path.

* Determine whether business value warrants updating the software or if it should be retired.

* If retired, is a replacement needed or is the application no longer needed?

Based on the results, you might redesign various aspects of your transformation from AD to Azure AD. While there are approaches you can use to extend on-premises AD to Azure IaaS (lift-and-shift) for applications with non-supported authentication protocols, we recommend you set a policy that requires a policy exception to use this approach.

### Application discovery

Once you've segmented your app portfolio, then you can prioritize migration based on business value and business priority. The following are types of applications you might use to categorize your portfolio, and some tools you can use to discover certain apps in your environment.

When you think about application types, there are three main ways to categorize your apps:

* **Modern Authentication Apps**: These are applications that use modern authentication protocols such as OIDC, OAuth2, SAML, WS-Federation, using a Federation Service such as AD FS.

* **Web Access Management (WAM) tools**: These applications use headers, cookies, and similar techniques for SSO. These apps typically require a WAM Identity Provider such as Symantec Site Minder.

* **Legacy Apps**: These applications use legacy protocols such as Kerberos, LDAP, Radius, Remote Desktop, NTLM (not recommended) etc.

Azure AD can be used with each type of application providing different levels of functionality that will result in different migration strategies, complexity, and trade-offs. Some organizations have an application inventory, that can be used as a discovery baseline (It's common that this inventory isn't complete or updated). Below are some tools that can be used to create or refresh your inventory:

To discover modern authentication apps:

* If you're using AD FS, use the [AD FS application activity report](../manage-apps/migrate-adfs-application-activity.md)

* If you're using a different identity provider, you can use the logs and configuration.

The following tools can help you to discover applications that use LDAP.

* [Event1644Reader](/troubleshoot/windows-server/identity/event1644reader-analyze-ldap-query-performance) : Sample tool for collecting data on LDAP Queries made to Domain Controllers using Field Engineering Logs.

* [Microsoft Microsoft 365 Defender for Identity](/defender-for-identity/monitored-activities): Utilize the sign in Operations monitoring capability (note captures binds using LDAP, but not Secure LDAP.

* [PSLDAPQueryLogging](https://github.com/RamblingCookieMonster/PSLDAPQueryLogging) : GitHub tool for reporting on LDAP queries.

### Migrate AD FS / federation services

When you plan your migration to Azure AD, consider migrating the apps that use modern authentication protocols (such as SAML and Open ID Connect) first. These apps can be reconfigured to authenticate with Azure AD either via a built-in connector from the Azure App Gallery, or by registering the application in Azure AD. Once you have moved SaaS applications that were federated to Azure AD, there are a few steps to decommission the on-premises federation system. Verify you've completed the following:

* [Move application authentication to Azure Active Directory](../manage-apps/migrate-adfs-apps-to-azure.md)

Once you have moved SaaS applications that were federated to Azure AD, there are a few steps to decommission the on-premises federation system. Verify you have completed migration of:

* [Migrate from Azure AD Multi-Factor Authentication Server to Azure multi-factor authentication](../authentication/how-to-migrate-mfa-server-to-azure-mfa.md)

* [Migrate from federation to cloud authentication](../hybrid/migrate-from-federation-to-cloud-authentication.md)

* If you're using Web Application Proxy, [Move Remote Access to internal applications](#move-remote-access-to-internal-applications)

>[!IMPORTANT]
>If you are using other features, such as remote access, verify those services are relocated prior to decommissioning AD federated services. 
### Move WAM Authentication apps

This project focuses on migrating SSO capability from Web Access Management systems (such as Symantec SiteMinder) to Azure AD. To learn more, see [Migrating applications from Symantec SiteMinder to Azure AD](https://azure.microsoft.com/resources/migrating-applications-from-symantec-siteminder-to-azure-active-directory/)

### Define Application Server Management strategy

In terms of infrastructure management, on-premises (using AD) environments often use a combination of group policy objects (GPOs) and Microsoft Endpoint Configuration Manager (MECM) features to segment management duties. For example, security policy management, update management, config management, and monitoring.

Since AD was designed and built for on-premises IT environments and Azure AD was built for cloud-based IT environments, one-to-one parity of features isn't present here. Therefore, application servers can be managed in several different ways. For example, Azure Arc helps bring many of these features that exist in AD together into a single view when Azure AD is used for IAM. Azure AD DS can also be used to domain join servers in Azure AD, especially those where it's desirable to use GPOs for specific business or technical reasons.

Use the following table to determine what Azure-based tools you use to replace the on-premises or AD-based environment:

| Management area | On-premises (AD) feature | Equivalent Azure AD feature |
| - | - | -|
| Security policy management| GPO, MECM| [Microsoft Microsoft 365 Defender for Cloud](https://azure.microsoft.com/services/security-center/) |
| Update management| MECM, WSUS| [Azure Automation Update Management](../../automation/update-management/overview.md) |
| Configuration management| GPO, MECM| [Azure Automation State Configuration](../../automation/automation-dsc-overview.md) |
| Monitoring| System Center Operations Manager| [Azure Monitor Log Analytics](../../azure-monitor/logs/log-analytics-overview.md) |

More tools and notes:

* [Azure Arc](https://azure.microsoft.com/services/azure-arc/) enables above Azure features to non-Azure VMs. For example, Windows Server when used on-premises or on AWS.

* [Manage and secure your Azure VM environment](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/).

* If you must wait to migrate or perform a partial migration, GPO can be used with [Azure AD Domain Services (Azure AD DS)](https://azure.microsoft.com/services/active-directory-ds/)

If you require management of application servers with Microsoft Endpoint Configuration Manager (MECM), you can't achieve this using Azure AD DS. MECM isn't supported to run in an Azure AD DS environment. Instead, you'll need to extend your on-premises AD to a Domain Controller (DC) running on an Azure VM or deploy a new Active Directory (AD) to an Azure IaaS vNet.

### Define Legacy Application migration strategy

Legacy applications have different areas of dependencies to AD:

* User Authentication and Authorization: Kerberos, NTLM, LDAP Bind, ACLs

* Access to Directory Data: LDAP queries, schema extensions, read/write of directory objects

* Server Management: As determined by the [server management strategy](#define-application-server-management-strategy)

To reduce or eliminate the dependencies above, there are three main approaches, listed below in order of preference:

* **Approach 1** Replace with SaaS alternatives that use modern authentication. In this approach, undertake projects to migrate from legacy applications to SaaS alternatives that use modern authentication. Have the SaaS alternatives authenticate to Azure AD directly.

* **Approach 2** Replatform (for example, adopt serverless/PaaS) to support modern hosting without servers and/or update the code to support modern authentication. In this approach, undertake projects to update authentication code for applications that will be modernized or replatform on serverless/PaaS to eliminate the need for underlying server management. Enable the app to use modern authentication and integrate to Azure AD directly. [Learn about MSAL - Microsoft identity platform](../develop/msal-overview.md).

* **Approach 3** Leave the applications as legacy applications for the foreseeable future or sunset the applications and opportunity arises. We recommend that this is considered as a last resort.

Based on the app dependencies, you have three migration options:

#### Implement approach #1

1. Deploy Azure AD Domain Services into an Azure virtual network

2. Lift and shift legacy apps to VMs on the Azure virtual network that are domain-joined to Azure AD Domain Services

3. Publish legacy apps to the cloud using Azure AD App Proxy or a [Secure Hybrid Access](../manage-apps/secure-hybrid-access.md) partner

4. As legacy apps retire through attrition, eventually decommission Azure AD Domain Services running in the Azure virtual network

>[!NOTE]
>* Utilize Azure AD Domain Services if the dependencies are aligned with [Common deployment scenarios for Azure AD Domain Services](../../active-directory-domain-services/scenarios.md). 
>* To validate if Azure AD DS is a good fit, you might use tools like Service Map [Microsoft Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.ServiceMapOMS?tab=Overview) and [Automatic Dependency Mapping with Service Map and Live Maps](https://techcommunity.microsoft.com/t5/system-center-blog/automatic-dependency-mapping-with-service-map-and-live-maps/ba-p/351867).
>* Validate your SQL server instantiations can be [migrated to a different domain](https://social.technet.microsoft.com/wiki/contents/articles/24960.migrating-sql-server-to-new-domain.aspx). If your SQL service is running in virtual machines, [use this guidance](/azure/azure-sql/migration-guides/virtual-machines/sql-server-to-sql-on-azure-vm-individual-databases-guide).

#### Implement approach #2

Extend on-premises AD to Azure IaaS. If #1 isn't possible and an application has a strong dependency on AD

1. Connect an Azure virtual network to the on-premises network via VPN or ExpressRoute

2. Deploy new Domain Controllers for the on-premises AD as virtual machines into the Azure virtual network 

3. Lift and shift legacy apps to VMs on the Azure virtual network that are domain-joined

4. Publish legacy apps to the cloud using Azure AD App Proxy or a [Secure Hybrid Access](../manage-apps/secure-hybrid-access.md) partner

5. Eventually, decommission the on-premises AD infrastructure and run the Active Directory in the Azure virtual network entirely

6. As legacy apps retire through attrition, eventually decommission the Active Directory running in the Azure virtual network

#### Implement approach #3

Deploy a new AD to Azure IaaS. If migration option #1 isn't possible and an application has a strong dependency on AD. This approach enables you to decouple the app from the existing AD to reduce surface area.

1. Deploy a new Active Directory as virtual machines into an Azure virtual network

2. Lift and shift legacy apps to VMs on the Azure virtual network that are domain-joined to the new Active Directory

3. Publish legacy apps to the cloud using Azure AD App Proxy or a [Secure Hybrid Access](../manage-apps/secure-hybrid-access.md) partner

4. As legacy apps retire through attrition, eventually decommission the Active Directory running in the Azure virtual network

#### Comparison of strategies

| Strategy | A-Azure AD Domain Services | B-Extend AD to IaaS | C-Independent AD in IaaS |
| - | - | - | - |
| De-coupled from on-premises AD| Yes| No| Yes |
| Allows Schema Extensions| No| Yes| Yes |
| Full administrative control| No| Yes| Yes |
| Potential reconfiguration of apps required (ACLs, authorization etc.)| Yes| No| Yes |

### Move Virtual private network (VPN) authentication

This project focuses on moving your VPN authentication to Azure AD. It's important to know that there are different configurations available for VPN gateway connections. You need to determine which configuration best fits your needs. For more information on designing a solution, see [VPN Gateway design](../../vpn-gateway/design.md). Some key points about usage of Azure AD for VPN authentication:

* Check if your VPN providers support modern authentication. For example:

* [Tutorial: Azure Active Directory single sign-on (SSO) integration with Cisco AnyConnect](../saas-apps/cisco-anyconnect.md)

* [Tutorial: Azure Active Directory single sign-on (SSO) integration with Palo Alto Networks](../saas-apps/palo-alto-networks-globalprotect-tutorial.md) [GlobalProtect](../saas-apps/palo-alto-networks-globalprotect-tutorial.md) 

* For windows 10 devices, consider integrating [Azure AD support to the built-in VPN client](/windows-server/remote/remote-access/vpn/ad-ca-vpn-connectivity-windows10)

* After evaluating this scenario, you can implement a solution to remove your dependency with on-premises to authenticate to VPN

### Move Remote Access to internal applications

To simplify your environment, you can use [Azure AD Application Proxy](../app-proxy/application-proxy.md) or [Secure hybrid access partners](../manage-apps/secure-hybrid-access.md) to provide remote access. This will allow you to remove the dependency on on-premises reverse proxy solutions.

It's important to call out that enabling remote access to an application using the aforementioned technologies is an interim step and more work is needed to completely decouple the application from AD. 

Azure AD Domain Services allows you to migrate application servers to the cloud IaaS and decouple from AD, while using Azure AD App Proxy to enable remote access. To learn more about this scenario, check [Deploy Azure AD Application Proxy for Azure AD Domain Services](../../active-directory-domain-services/deploy-azure-app-proxy.md)

## Next steps

[Introduction](road-to-the-cloud-introduction.md)

[Cloud transformation posture](road-to-the-cloud-posture.md)

[Establish an Azure AD footprint](road-to-the-cloud-establish.md)

[Implement a cloud-first approach](road-to-the-cloud-implement.md)