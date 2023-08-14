---
title: Road to the cloud - Move identity and access management from Active Directory to an Azure AD migration workstream
description: Learn to plan your migration workstream of IAM from Active Directory to Azure AD.
documentationCenter: ''
author: janicericketts
manager: martinco
ms.service: active-directory
ms.topic: how-to
ms.subservice: fundamentals
ms.date: 07/27/2023
ms.author: jricketts
ms.custom: references_regions
---
# Transition to the cloud

After you align your organization toward halting growth of the Active Directory footprint, you can focus on moving the existing on-premises workloads to Azure Active Directory (Azure AD). This article describes the various migration workstreams. You can execute the workstreams in this article based on your priorities and resources.

A typical migration workstream has the following stages:

* **Discover**: Find out what you currently have in your environment.

* **Pilot**: Deploy new cloud capabilities to a small subset of users, applications, or devices, depending on the workstream.

* **Scale out**: Expand the pilot to complete the transition of a capability to the cloud.

* **Cut over (when applicable)**: Stop using the old on-premises workload.

## Users and groups

### Enable password self-service

We recommend a [passwordless environment](../authentication/concept-authentication-passwordless.md). Until then, you can migrate password self-service workflows from on-premises systems to Azure AD to simplify your environment. Azure AD [self-service password reset (SSPR)](../authentication/concept-sspr-howitworks.md) gives users the ability to change or reset their password, with no administrator or help desk involvement.

To enable self-service capabilities, choose the appropriate [authentication methods](../authentication/concept-authentication-methods.md) for your organization. After the authentication methods are updated, you can enable user self-service password capability for your Azure AD authentication environment. For deployment guidance, see [Deployment considerations for Azure Active Directory self-service password reset](../authentication/howto-sspr-deployment.md).

Additional considerations include:

* Deploy [Azure AD Password Protection](../authentication/howto-password-ban-bad-on-premises-operations.md) in a subset of domain controllers with **Audit** mode to gather information about the impact of modern policies. 
* Gradually enable [combined registration for SSPR and Azure AD Multi-Factor Authentication](../authentication/concept-registration-mfa-sspr-combined.md). For example, roll out by region, subsidiary, or department for all users. 
* Go through a cycle of password change for all users to flush out weak passwords. After the cycle is complete, implement the policy expiration time.
* Switch the Password Protection configuration in the domain controllers that have the mode set to **Enforced**. For more information, see [Enable on-premises Azure AD Password Protection](../authentication/howto-password-ban-bad-on-premises-operations.md).

>[!NOTE]
>* We recommend user communications and evangelizing for a smooth deployment. See [Sample SSPR rollout materials](https://www.microsoft.com/download/details.aspx?id=56768).
>* If you use Azure AD Identity Protection, enable [password reset as a control in Conditional Access policies](../identity-protection/howto-identity-protection-configure-risk-policies.md) for users marked as risky.

### Move management of groups

To transform groups and distribution lists:

* For security groups, use your existing business logic that assigns users to security groups. Migrate the logic and capability to Azure AD and dynamic groups.

* For self-managed group capabilities provided by Microsoft Identity Manager, replace the capability with self-service group management.

* You can [convert distribution lists to Microsoft 365 groups](/microsoft-365/admin/manage/upgrade-distribution-lists) in Outlook. This approach is a great way to give your organization's distribution lists all the features and functionality of Microsoft 365 groups. 

* Upgrade your [distribution lists to Microsoft 365 groups in Outlook](https://support.microsoft.com/office/7fb3d880-593b-4909-aafa-950dd50ce188) and [decommission your on-premises Exchange server](/exchange/decommission-on-premises-exchange).

### Move provisioning of users and groups to applications

You can simplify your environment by removing application provisioning flows from on-premises identity management (IDM) systems such as Microsoft Identity Manager. Based on your application discovery, categorize your application based on the following characteristics:

* Applications in your environment that have a provisioning integration with the [Azure AD application gallery](https://www.microsoft.com/security/business/identity-access-management/integrated-apps-azure-ad).

* Applications that aren't in the gallery but support the SCIM 2.0 protocol. These applications are natively compatible with the Azure AD cloud provisioning service.

* On-premises applications that have an ECMA connector available. These applications can be integrated with [Azure AD on-premises application provisioning](../app-provisioning/on-premises-application-provisioning-architecture.md).

For more information, check [Plan an automatic user-provisioning deployment for Azure Active Directory](../app-provisioning/plan-auto-user-provisioning.md).

### Move to cloud HR provisioning

You can reduce your on-premises footprint by moving the HR provisioning workflows from on-premises IDM systems, such as Microsoft Identity Manager, to Azure AD. Two account types are available for Azure AD cloud HR provisioning:

* For new employees who are exclusively using applications that use Azure AD, you can choose to provision *cloud-only accounts*. This provisioning helps you contain the footprint of Active Directory.

* For new employees who need access to applications that have dependency on Active Directory, you can provision *hybrid accounts*.

Azure AD cloud HR provisioning can also manage Active Directory accounts for existing employees. For more information, see [Plan cloud HR application to Azure Active Directory user provisioning](../app-provisioning/plan-cloud-hr-provision.md) and [Plan the deployment project](../app-provisioning/plan-auto-user-provisioning.md).

### Move lifecycle workflows

Evaluate your existing joiner/mover/leaver workflows and processes for applicability and relevance to your Azure AD cloud environment. You can then simplify these workflows and [create new ones](../governance/create-lifecycle-workflow.md) using [lifecycle workflows](../governance/what-are-lifecycle-workflows.md).

### Move external identity management

If your organization provisions accounts in Active Directory or other on-premises directories for external identities such as vendors, contractors, or consultants, you can simplify your environment by managing those third-party user objects natively in the cloud. Here are some possibilities:

* For new external users, use [Azure AD External Identities](../external-identities/external-identities-overview.md), which stops the Active Directory footprint of users.

* For existing Active Directory accounts that you provision for external identities, you can remove the overhead of managing local credentials (for example, passwords) by configuring them for business-to-business (B2B) collaboration. Follow the steps in [Invite internal users to B2B collaboration](../external-identities/invite-internal-users.md).

* Use [Azure AD entitlement management](../governance/entitlement-management-overview.md) to grant access to applications and resources. Most companies have dedicated systems and workflows for this purpose that you can now move out of on-premises tools.

* Use [access reviews](../governance/access-reviews-external-users.md) to remove access rights and/or external identities that are no longer needed.

## Devices

### Move non-Windows workstations

You can integrate non-Windows workstations with Azure AD to enhance the user experience and to benefit from cloud-based security features such as Conditional Access.

* For macOS:

    * Register macOS to Azure AD and [enroll/manage them by using a mobile device management solution](/mem/intune/enrollment/macos-enroll).

    * Deploy the [Microsoft Enterprise SSO (single sign-on) plug-in for Apple devices](../develop/apple-sso-plugin.md).

    * Plan to deploy [Platform SSO for macOS 13](https://techcommunity.microsoft.com/t5/microsoft-endpoint-manager-blog/microsoft-simplifies-endpoint-manager-enrollment-for-apple/ba-p/3570319).

* For Linux, you can [sign in to a Linux virtual machine (VM) by using Azure Active Directory credentials](../../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).

### Replace other Windows versions for workstations

If you have the following operating systems on workstations, consider upgrading to the latest versions to benefit from cloud-native management (Azure AD join and unified endpoint management):

* Windows 7 or 8.x

* Windows Server

### VDI solution

This project has two primary initiatives:

* **New deployments**: Deploy a cloud-managed virtual desktop infrastructure (VDI) solution, such as Windows 365 or Azure Virtual Desktop, that doesn't require on-premises Active Directory.

* **Existing deployments**: If your existing VDI deployment is dependent on Active Directory, use business objectives and goals to determine whether you maintain the solution or migrate it to Azure AD.

For more information, see:

* [Deploy Azure AD-joined VMs in Azure Virtual Desktop](../../virtual-desktop/deploy-azure-ad-joined-vm.md)

* [Windows 365 planning guide](/windows-365/enterprise/planning-guide)

## Applications

To help maintain a secure environment, Azure AD supports modern authentication protocols. To transition application authentication from Active Directory to Azure AD, you must:

* Determine which applications can migrate to Azure AD with no modification.

* Determine which applications have an upgrade path that enables you to migrate with an upgrade.

* Determine which applications require replacement or significant code changes to migrate.

The outcome of your application discovery initiative is to create a prioritized list for migrating your application portfolio. The list contains applications that:

* Require an upgrade or update to the software, and an upgrade path is available.

* Require an upgrade or update to the software, but an upgrade path isn't available.

By using the list, you can further evaluate the applications that don't have an existing upgrade path. Determine whether business value warrants updating the software or if it should be retired. If the software should be retired, decide whether you need a replacement.

Based on the results, you might redesign aspects of your transformation from Active Directory to Azure AD. There are approaches that you can use to extend on-premises Active Directory to Azure infrastructure as a service (IaaS) (lift and shift) for applications with unsupported authentication protocols. We recommend that you set a policy that requires an exception to use this approach.

### Application discovery

After you've segmented your app portfolio, you can prioritize migration based on business value and business priority. You can use tools to create or refresh your app inventory.

There are three main ways to categorize your apps:

* **Modern authentication apps**: These applications use modern authentication protocols (such as OIDC, OAuth2, SAML, or WS-Federation) or that use a federation service such as Active Directory Federation Services (AD FS).

* **Web access management (WAM) tools**: These applications use headers, cookies, and similar techniques for SSO. These apps typically require a WAM identity provider, such as Symantec SiteMinder.

* **Legacy apps**: These applications use legacy protocols such as Kerberos, LDAP, Radius, Remote Desktop, and NTLM (not recommended).

Azure AD can be used with each type of application to provide levels of functionality that results in different migration strategies, complexity, and trade-offs. Some organizations have an application inventory that can be used as a discovery baseline. (It's common that this inventory isn't complete or updated.) 

To discover modern authentication apps:

* If you're using AD FS, use the [AD FS application activity report](../manage-apps/migrate-adfs-application-activity.md).

* If you're using a different identity provider, use the logs and configuration.

The following tools can help you discover applications that use LDAP:

* [Event1644Reader](/troubleshoot/windows-server/identity/event1644reader-analyze-ldap-query-performance): Sample tool for collecting data on LDAP queries made to domain controllers by using field engineering logs.

* [Microsoft 365 Defender for Identity](/defender-for-identity/monitored-activities): Security solution that uses a sign-in operations monitoring capability. (Note that it captures binds by using LDAP, not Secure LDAP.)

* [PSLDAPQueryLogging](https://github.com/RamblingCookieMonster/PSLDAPQueryLogging): GitHub tool for reporting on LDAP queries.

### Migrate AD FS or other federation services

When you plan your migration to Azure AD, consider migrating the apps that use modern authentication protocols (such as SAML and OpenID Connect) first. You can reconfigure these apps to authenticate with Azure AD either via a built-in connector from the Azure App Gallery or via registration in Azure AD. 

After you move SaaS applications that were federated to Azure AD, there are a few steps to decommission the on-premises federation system:

* [Move application authentication to Azure Active Directory](../manage-apps/migrate-adfs-apps-to-azure.md)

* [Migrate from Azure AD Multi-Factor Authentication Server to Azure AD Multi-Factor Authentication](../authentication/how-to-migrate-mfa-server-to-azure-mfa.md)

* [Migrate from federation to cloud authentication](../hybrid/migrate-from-federation-to-cloud-authentication.md)

* [Move remote access to internal applications](#move-remote-access-to-internal-applications), if you're using Azure AD Application Proxy

>[!IMPORTANT]
>If you're using other features, verify that those services are relocated before you decommission Active Directory Federation Services. 

### Move WAM authentication apps

This project focuses on migrating SSO capability from WAM systems to Azure AD. To learn more, see [Migrate applications from Symantec SiteMinder to Azure AD](https://azure.microsoft.com/resources/migrating-applications-from-symantec-siteminder-to-azure-active-directory/).

### Define an application server management strategy

In terms of infrastructure management, on-premises environments often use a combination of Group Policy objects (GPOs) and Microsoft Configuration Manager features to segment management duties. For example, duties can be segmented into security policy management, update management, configuration management, and monitoring.

Active Directory is for on-premises IT environments, and Azure AD is for cloud-based IT environments. One-to-one parity of features isn't present here, so you can manage application servers in several ways. 

For example, Azure Arc helps bring many of the features that exist in Active Directory together into a single view when you use Azure AD for identity and access management (IAM). You can also use Azure Active Directory Domain Services (Azure AD DS) to domain-join servers in Azure AD, especially when you want those servers to use GPOs for specific business or technical reasons.

Use the following table to determine what Azure-based tools you can use to replace the on-premises environment:

| Management area | On-premises (Active Directory) feature | Equivalent Azure AD feature |
| - | - | -|
| Security policy management| GPO, Microsoft Configuration Manager| [Microsoft 365 Defender for Cloud](https://azure.microsoft.com/services/security-center/) |
| Update management| Microsoft Configuration Manager, Windows Server Update Services| [Azure Automation Update Management](../../automation/update-management/overview.md) |
| Configuration management| GPO, Microsoft Configuration Manager| [Azure Automation State Configuration](../../automation/automation-dsc-overview.md) |
| Monitoring| System Center Operations Manager| [Azure Monitor Log Analytics](../../azure-monitor/logs/log-analytics-overview.md) |

Here's more information that you can use for application server management:

* [Azure Arc](https://azure.microsoft.com/services/azure-arc/) enables Azure features for non-Azure VMs. For example, you can use it to get Azure features for Windows Server when it's used on-premises or on Amazon Web Services, or [authenticate to Linux machines with SSH](/azure/azure-arc/servers/ssh-arc-overview?tabs=azure-cli).

* [Manage and secure your Azure VM environment](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/).

* If you must wait to migrate or perform a partial migration, you can use GPOs with [Azure AD DS](https://azure.microsoft.com/services/active-directory-ds/).

If you require management of application servers with Microsoft Configuration Manager, you can't achieve this requirement by using Azure AD DS. Microsoft Configuration Manager isn't supported to run in an Azure AD DS environment. Instead, you need to extend your on-premises Active Directory instance to a domain controller running on an Azure VM. Or, you need to deploy a new Active Directory instance to an Azure IaaS virtual network.

### Define the migration strategy for legacy applications

Legacy applications have dependencies like these to Active Directory:

* User authentication and authorization: Kerberos, NTLM, LDAP bind, ACLs.

* Access to directory data: LDAP queries, schema extensions, read/write of directory objects.

* Server management: As determined by the [server management strategy](#define-an-application-server-management-strategy).

To reduce or eliminate those dependencies, you have three main approaches.

#### Approach 1

In the most preferred approach, you undertake projects to migrate from legacy applications to SaaS alternatives that use modern authentication. Have the SaaS alternatives authenticate to Azure AD directly:

1. Deploy Azure AD DS into an Azure virtual network and [extend the schema](/azure/active-directory-domain-services/concepts-custom-attributes) to incorporate additional attributes needed by the applications.

2. Lift and shift legacy apps to VMs on the Azure virtual network that are domain-joined to Azure AD DS.

3. Publish legacy apps to the cloud by using Azure AD Application Proxy or a [secure hybrid access](../manage-apps/secure-hybrid-access.md) partner.

4. As legacy apps retire through attrition, eventually decommission Azure AD DS running in the Azure virtual network.

>[!NOTE]
>* Use Azure AD DS if the dependencies are aligned with [common deployment scenarios for Azure AD DS](../../active-directory-domain-services/scenarios.md). 
>* To validate if Azure AD DS is a good fit, you might use tools like [Service Map in Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.ServiceMapOMS?tab=Overview) and [automatic dependency mapping with Service Map and Live Maps](https://techcommunity.microsoft.com/t5/system-center-blog/automatic-dependency-mapping-with-service-map-and-live-maps/ba-p/351867).
>* Validate that your SQL Server instantiations can be [migrated to a different domain](https://social.technet.microsoft.com/wiki/contents/articles/24960.migrating-sql-server-to-new-domain.aspx). If your SQL service is running in virtual machines, [use this guidance](/azure/azure-sql/migration-guides/virtual-machines/sql-server-to-sql-on-azure-vm-individual-databases-guide).

#### Approach 2

If the first approach isn't possible and an application has a strong dependency on Active Directory, you can extend on-premises Active Directory to Azure IaaS.

You can replatform to support modern serverless hosting--for example, use platform as a service (PaaS). Or, you can update the code to support modern authentication. You can also enable the app to integrate with Azure AD directly. [Learn about Microsoft Authentication Library in the Microsoft identity platform](../develop/msal-overview.md).

1. Connect an Azure virtual network to the on-premises network via virtual private network (VPN) or Azure ExpressRoute.

2. Deploy new domain controllers for the on-premises Active Directory instance as virtual machines into the Azure virtual network. 

3. Lift and shift legacy apps to VMs on the Azure virtual network that are domain joined.

4. Publish legacy apps to the cloud by using Azure AD Application Proxy or a [secure hybrid access](../manage-apps/secure-hybrid-access.md) partner.

5. Eventually, decommission the on-premises Active Directory infrastructure and run Active Directory in the Azure virtual network entirely.

6. As legacy apps retire through attrition, eventually decommission the Active Directory instance running in the Azure virtual network.

#### Approach 3

If the first migration isn't possible and an application has a strong dependency on Active Directory, you can deploy a new Active Directory instance to Azure IaaS. Leave the applications as legacy applications for the foreseeable future, or sunset them when the opportunity arises. 

This approach enables you to decouple the app from the existing Active Directory instance to reduce surface area. We recommend that you consider it only as a last resort.

1. Deploy a new Active Directory instance as virtual machines in an Azure virtual network.

2. Lift and shift legacy apps to VMs on the Azure virtual network that are domain-joined to the new Active Directory instance.

3. Publish legacy apps to the cloud by using Azure AD Application Proxy or a [secure hybrid access](../manage-apps/secure-hybrid-access.md) partner.

4. As legacy apps retire through attrition, eventually decommission the Active Directory instance running in the Azure virtual network.

#### Comparison of strategies

| Strategy | Azure AD DS | Extend Active Directory to IaaS | Independent Active Directory instance in IaaS |
| - | - | - | - |
| Decoupling from on-premises Active Directory| Yes| No| Yes |
| Allowing schema extensions| No| Yes| Yes |
| Full administrative control| No| Yes| Yes |
| Potential reconfiguration of apps required (for example, ACLs or authorization)| Yes| No| Yes |

### Move VPN authentication

This project focuses on moving your VPN authentication to Azure AD. It's important to know that different configurations are available for VPN gateway connections. You need to determine which configuration best fits your needs. For more information on designing a solution, see [VPN gateway design](../../vpn-gateway/design.md). 

Here are key points about usage of Azure AD for VPN authentication:

* Check if your VPN providers support modern authentication. For example:

  * [Tutorial: Azure Active Directory SSO integration with Cisco AnyConnect](../saas-apps/cisco-anyconnect.md)

  * [Tutorial: Azure Active Directory SSO integration with Palo Alto Networks GlobalProtect](../saas-apps/palo-alto-networks-globalprotect-tutorial.md) 

* For Windows 10 devices, consider integrating [Azure AD support into the built-in VPN client](/windows-server/remote/remote-access/vpn/ad-ca-vpn-connectivity-windows10).

* After you evaluate this scenario, you can implement a solution to remove your dependency with on-premises to authenticate to VPN.

### Move remote access to internal applications

To simplify your environment, you can use [Azure AD Application Proxy](../app-proxy/application-proxy.md) or [secure hybrid access](../manage-apps/secure-hybrid-access.md) partners to provide remote access. This allows you to remove the dependency on on-premises reverse proxy solutions.

It's important to mention that enabling remote access to an application by using the preceding technologies is an interim step. You need to do more work to completely decouple the application from Active Directory. 

Azure AD DS allows you to migrate application servers to the cloud IaaS and decouple from Active Directory, while using Azure AD Application Proxy to enable remote access. To learn more about this scenario, check [Deploy Azure AD Application Proxy for Azure Active Directory Domain Services](../../active-directory-domain-services/deploy-azure-app-proxy.md).

## Next steps

* [Introduction](road-to-the-cloud-introduction.md)
* [Cloud transformation posture](road-to-the-cloud-posture.md)
* [Establish an Azure AD footprint](road-to-the-cloud-establish.md)
* [Implement a cloud-first approach](road-to-the-cloud-implement.md)
