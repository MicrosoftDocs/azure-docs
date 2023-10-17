---
title: Best practices to secure with Microsoft Entra ID 
description: Best practices we recommend you follow to secure your isolated environments in Microsoft Entra ID.
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 7/5/2022
ms.author: gasinh
ms.reviewer: ajburnle
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Best practices for all isolation architectures

The following are design considerations for all isolation configurations. Throughout this content, there are many links. We link to content, rather than duplicate it here, so you'll always have access to the most up-to-date information.

For general guidance on how to configure Microsoft Entra tenants (isolated or not), refer to the [Microsoft Entra feature deployment guide](../fundamentals/concept-secure-remote-workers.md).

>[!NOTE]
>For all isolated tenants we suggest you use clear and differentiated branding to help avoid human error of working in the wrong tenant.

## Isolation security principles

When designing isolated environments, it's important to consider the following principles:

* **Use only modern authentication** - Applications deployed in isolated environments must use claims-based modern authentication (for example, SAML, * Auth, OAuth2, and OpenID Connect) to use capabilities such as federation, Microsoft Entra B2B collaboration, delegation, and the consent framework. This way, legacy applications that have dependency on legacy authentication methods such as NT LAN Manager (NTLM) won't carry forward in isolated environments.

* **Enforce strong authentication** - Strong authentication must always be used when accessing the isolated environment services and infrastructure. Whenever possible, [passwordless authentication](../authentication/concept-authentication-passwordless.md) such as [Windows for Business Hello](/windows/security/identity-protection/hello-for-business/hello-overview) or a [FIDO2 security keys](../authentication/howto-authentication-passwordless-security-key.md)) should be used.

* **Deploy secure workstations** - [Secure workstations](/security/compass/privileged-access-devices) provide the mechanism to ensure that the platform and the identity that platform represents is properly attested and secured against exploitation. Two other approaches to consider are:

  * Use Windows 365 Cloud PCs (Cloud PC) with the Microsoft Graph API.

  * Use [Conditional Access](../conditional-access/concept-condition-filters-for-devices.md) and filter for devices as a condition.  

* **Eliminate legacy trust mechanisms** - Isolated directories and services shouldn't establish trust relationships with other environments through legacy mechanisms such as Active Directory trusts. All trusts between environments should be established with modern constructs such as federation and claims-based identity.

* **Isolate services** - Minimize the surface attack area by protecting underlying identities and service infrastructure from exposure. Enable access only through modern authentication for services and secure remote access (also protected by modern authentication) for the infrastructure.

* **Directory-level role assignments** - Avoid or reduce numbers of directory-level role assignments (User Administrator on directory scope instead of AU-scoping) or service-specific directory roles with control plane actions (Knowledge Admin with permissions to manage security group memberships).

In addition to the guidance in the [Microsoft Entra general operations guide](./ops-guide-ops.md), we also recommend the following considerations for isolated environments.

## Human identity provisioning

### Privileged Accounts

Provision accounts in the isolated environment for administrative personnel and IT teams who operate the environment. This enables you to add stronger security policies such as device-based access control for [secure workstations](/security/compass/privileged-access-deployment). As discussed in previous sections, nonproduction environments can potentially utilize Microsoft Entra B2B collaboration to onboard privileged accounts to the non-production tenants using the same posture and security controls designed for privileged access in their production environment.

Cloud-only accounts are the simplest way to provision human identities in a Microsoft Entra tenant and it's a good fit for green field environments. However, if there's an existing on-premises infrastructure that corresponds to the isolated environment (for example, pre-production or management Active Directory forest), you could consider synchronizing identities from there. This holds especially true if the on-premises infrastructure described herein is used for IaaS solutions that require server access to manage the solution data plane. For more information on this scenario, see [Protecting Microsoft 365 from on-premises attacks](./protect-m365-from-on-premises-attacks.md). Synchronizing from isolated on-premises environments might also be needed if there are specific regulatory compliance requirements such as smart-card only authentication.

>[!NOTE]
>There are no technical controls to do identity proofing for Microsoft Entra B2B accounts. External identities provisioned with Microsoft Entra B2B are bootstrapped with a single factor. The mitigation is for the organization to have a process to proof the required identities prior to a B2B invitation being issued, and regular access reviews of external identities to manage the lifecycle. Consider enabling a Conditional Access policy to control the MFA registration.

### Outsourcing high risk roles

To mitigate inside threats, it's possible to outsource access to the global administrator, and privileged role administrator roles to be managed service provider using Azure B2B collaboration or delegating access through a CSP partner or lighthouse. This access can be controlled by in-house staff via approval flows in Azure Privileged Identity Management (PIM). This approach can greatly reduce inside threats. This is an approach that you can use to meet compliance demands for customers that have concerns.

## Nonhuman identity provisioning

### Emergency access accounts

Provision [emergency access accounts](../roles/security-emergency-access.md) for "break glass" scenarios where normal administrative accounts can't be used in the event you're accidentally locked out of your Microsoft Entra organization. For on-premises environments using federation systems such as Active Directory Federation Services (AD FS) for authentication, maintain alternate cloud-only credentials for your global administrators to ensure service delivery during an on-premises infrastructure outage.

### Azure managed identities

Use [Azure managed identities](../managed-identities-azure-resources/overview.md) for Azure resources that require a service identity. Check the [list of services that support managed identities](../managed-identities-azure-resources/managed-identities-status.md) when designing your Azure solutions.

If managed identities aren't supported or not possible, consider [provisioning service principal objects](../develop/app-objects-and-service-principals.md).

### Hybrid service accounts

Some hybrid solutions might require access to both on-premises and cloud resources. An example of a use case would be an Identity Governance solution that uses a service account on premises for access to AD DS and requires access to Microsoft Entra ID.

On-premises service accounts typically don't have the ability to sign in interactively, which means that in cloud scenarios they can't fulfill strong credential requirements such as multifactor authentication. In this scenario, don't use a service account that has been synced from on-premises, but instead use a managed identity \ service principal. For service principal (SP), use a certificate as a credential, or [protect the SP with Conditional Access](../conditional-access/workload-identity.md).

If there are technical constraints that don't make this possible and the same account must be used for both on-premises and cloud, then implement compensating controls such as Conditional Access to lock down the hybrid account to come from a specific network location.

## Resource assignment

An enterprise solution may be composed of multiple Azure resources and its access should be managed and governed as a logical unit of assignment - a resource group. In that scenario, Microsoft Entra security groups can be created and associated with the proper permissions and role assignment across all solution resources, so that adding or removing users from those groups results in allowing or denying access to the entire solution.

We recommend you use security groups to grant access to Microsoft services that rely on licensing to provide access (for example, Dynamics 365, Power BI).

Microsoft Entra cloud native groups can be natively governed from the cloud when combined with [Microsoft Entra access reviews](../governance/access-reviews-overview.md) and [Microsoft Entra entitlement management](../governance/access-reviews-overview.md). Organizations who already have on-premises group governance tools can continue to use those tools and rely on identity synchronization with Microsoft Entra Connect to reflect group membership changes.

Microsoft Entra ID also supports direct user assignment to third-party SaaS services (for example, Salesforce, Service Now) for single sign-on and identity provisioning. Direct assignments to resources can be natively governed from the cloud when combined with [Microsoft Entra access reviews](../governance/access-reviews-overview.md) and [Microsoft Entra entitlement management](./ops-guide-ops.md). Direct assignment might be a good fit for end-user facing assignment.

Some scenarios might require granting access to on-premises resources through on-premises Active Directory security groups. For those cases, consider the synchronization cycle to Microsoft Entra ID when designing processes SLA.

## Authentication management

This section describes the checks to perform and actions to take for credential management and access policies based on your organization's security posture.

### Credential management

#### Strong credentials

All human identities (local accounts and external identities provisioned through B2B collaboration) in the isolated environment must be provisioned with strong authentication credentials such as multifactor authentication or a FIDO key. Environments with an underlying on-premises infrastructure with strong authentication such as smart card authentication can continue using smart card authentication in the cloud.

#### Passwordless credentials

A [passwordless solution](../authentication/concept-authentication-passwordless.md) is the best solution for ensuring the most convenient and secure method of authentication. Passwordless credentials such as [FIDO security keys](../authentication/howto-authentication-passwordless-security-key.md) and [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-overview) are recommended for human identities with privileged roles.

#### Password protection

If the environment is synchronized from an on-premises Active Directory forest, you should deploy [Microsoft Entra password protection](../authentication/concept-password-ban-bad-on-premises.md) to eliminate weak passwords in your organization. [Microsoft Entra smart lockout](../authentication/howto-password-smart-lockout.md) should also be used in hybrid or cloud-only environments to lock out bad actors who are trying to guess your users' passwords or use brute-force methods to get in.

#### Self-service password management

Users needing to change or reset their passwords is one of the biggest sources of volume and cost of help desk calls. In addition to cost, changing the password as a tool to mitigate a user risk is a fundamental step in improving the security posture of your organization. At a minimum, deploy [Self-Service Password Management](../authentication/howto-sspr-deployment.md) for human and test accounts with passwords to deflect help desk calls.

#### External identities passwords

By using Microsoft Entra B2B collaboration, an [invitation and redemption process](../external-identities/what-is-b2b.md) lets external users such as partners, developers, and subcontractors use their own credentials to access your company's resources. This mitigates the need to introduce more passwords into the isolated tenants.

>[!Note]
>Some applications, infrastructure, or workflows might require a local credential. Evaluate this on a case-by-case basis.

#### Service principals credentials

For scenarios where service principals are needed, use certificate credentials for service principals or [Conditional Access for workload identities](../conditional-access/workload-identity.md). If necessary, use client secrets as an exception to organizational policy.

In both cases, Azure Key Vault can be used with Azure managed identities, so that the runtime environment (for example, an Azure function) can retrieve the credential from the key vault.

Check this example to [create service principals with self-signed certificate](../develop/howto-authenticate-service-principal-powershell.md) for authentication of service principals with certificate credentials.

### Access policies

In the following sections are recommendations for Azure solutions. For general guidance on Conditional Access policies for individual environments, check the [Conditional Access Best practices](../conditional-access/overview.md), [Microsoft Entra Operations Guide](./ops-guide-auth.md), and [Conditional Access for Zero Trust](/azure/architecture/guide/security/conditional-access-zero-trust):

* Define [Conditional Access policies](../conditional-access/workload-identity.md) for the [Microsoft Azure Management](../authentication/howto-password-smart-lockout.md) cloud app to enforce identity security posture when accessing Azure Resource Manager. This should include controls on MFA and device-based controls to enable access only through secure workstations (more on this in the Privileged Roles section under Identity Governance). Additionally, use [Conditional Access to filter for devices](../conditional-access/concept-condition-filters-for-devices.md).

* All applications onboarded to isolated environments must have explicit Conditional Access policies applied as part of the onboarding process.

* Define Conditional Access policies for [security information registration](../conditional-access/howto-conditional-access-policy-registration.md) that reflects a secure root of trust process on-premises (for example, for workstations in physical locations, identifiable by IP addresses, that employees must visit in person for verification).

* Consider managing Conditional Access policies at scale with automation using [MS Graph Conditional Access API](../conditional-access/howto-conditional-access-apis.md)). For example, you can use the API to configure, manage, and monitor Conditional Access policies consistently across tenants.

* Consider using Conditional Access to restrict workload identities. Create a policy to limit or better control access based on location or other relevant circumstances.

### Authentication Challenges

* External identities provisioned with Microsoft Entra B2B might need to reprovision multifactor authentication credentials in the resource tenant. This might be necessary if a cross-tenant access policy hasn't been set up with the resource tenant. This means that onboarding to the system is bootstrapped with a single factor. With this approach, the risk mitigation is for the organization to have a process to proof the user and credential risk profile prior to a B2B invitation being issued. Additionally, define Conditional Access to the registration process as described previously.

* Use [External identities cross-tenant access settings](../external-identities/cross-tenant-access-overview.md) to manage how they collaborate with other Microsoft Entra organizations and other Microsoft Azure clouds through B2B collaboration and [B2B direct connect](../external-identities/cross-tenant-access-settings-b2b-direct-connect.md).

* For specific device configuration and control, you can use device filters in Conditional Access policies to [target or exclude specific devices](../conditional-access/concept-condition-filters-for-devices.md). This enables you to restrict access to Azure management tools from a designated secure admin workstation (SAW). Other approaches you can take include using [Azure Virtual desktop](../../virtual-desktop/terminology.md), [Azure Bastion](../../bastion/bastion-overview.md), or [Cloud PC](/graph/cloudpc-concept-overview).

* Billing management applications such as Azure EA portal or MCA billing accounts aren't represented as cloud applications for Conditional Access targeting. As a compensating control, define separate administration accounts and target Conditional Access policies to those accounts using an "All Apps" condition.

## Identity Governance

### Privileged roles

Below are some identity governance principles to consider across all the tenant configurations for isolation.

* **No standing access** - No human identities should have standing access to perform privileged operations in isolated environments. Azure Role-based access control (RBAC) integrates with [Microsoft Entra Privileged Identity Management](../privileged-identity-management/pim-configure.md) (PIM). PIM provides just-in-time activation determined by security gates such as multifactor authentication, approval workflow, and limited duration.

* **Number of admins** - Organizations should define minimum and maximum number of humans holding a privileged role to mitigate business continuity risks. With too few privileged roles, there may not be enough time-zone coverage. Mitigate security risks by having as few administrators as possible, following the least-privilege principle.

* **Limit privileged access** - Create cloud-only and role-assignable groups for high privilege or sensitive privileges. This offers protection of the assigned users and the group object.

* **Least privileged access** - Identities should only be granted the permissions needed to perform the privileged operations per their role in the organization.

  * Azure RBAC [custom roles](../../role-based-access-control/custom-roles.md) allow designing least privileged roles based on organizational needs. We recommend that custom roles definitions are authored or reviewed by specialized security teams and mitigate risks of unintended excessive privileges. Authoring of custom roles can be audited through [Azure Policy](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/Subscription_AuditCustomRBACRoles_Audit.json).

  * To mitigate accidental use of roles that aren't meant for wider use in the organization, use Azure Policy to define explicitly which role definitions can be used to assign access. Learn more from this [GitHub Sample](https://github.com/Azure/azure-policy/tree/master/samples/Authorization/allowed-role-definitions).

* **Privileged access from secure workstations** - All privileged access should occur from secure, locked down devices. Separating these sensitive tasks and accounts from daily use workstations and devices protect privileged accounts from phishing attacks, application and OS vulnerabilities, various impersonation attacks, and credential theft attacks such as keystroke logging, [Pass-the-Hash](https://aka.ms/AzureADSecuredAzure/27a), and Pass-The-Ticket.

Some approaches you can use for [using secure devices as part of your privileged access story](/security/compass/privileged-access-devices) include using Conditional Access policies to [target or exclude specific devices](../conditional-access/concept-condition-filters-for-devices.md), using [Azure Virtual desktop](../../virtual-desktop/terminology.md), [Azure Bastion](../../bastion/bastion-overview.md), or [Cloud PC](/graph/cloudpc-concept-overview), or creating Azure-managed workstations or privileged access workstations.

* **Privileged role process guardrails** - Organizations must define processes and technical guardrails to ensure that privileged operations can be executed whenever needed while complying with regulatory requirements. Examples of guardrails criteria include:

  * Qualification of humans with privileged roles (for example, full-time employee/vendor, clearance level, citizenship)

  * Explicit incompatibility of roles (also known as separation of duties). Examples include teams with Microsoft Entra directory roles shouldn't be responsible for managing Azure Resource Manager privileged roles, etc.

  * Whether direct user or groups assignments are preferred for which roles.

### Resource access  

* **Attestation** - Identities that hold privileged roles should be reviewed periodically to keep membership current and justified. [Microsoft Entra access reviews](../governance/access-reviews-overview.md) integrate with Azure RBAC roles, group memberships and Microsoft Entra B2B external identities.

* **Lifecycle** - Privileged operations might require access to multiple resources such as line of business applications, SaaS Applications, and Azure resource groups and subscriptions. [Microsoft Entra Entitlement Management](../governance/entitlement-management-overview.md) allows defining access packages that represent a set resource that is assigned to users as a unit, establish a validity period, approval workflows, etc.

### Governance challenges

* The Azure Enterprise (Azure EA) Agreement portal doesn't integrate with Azure RBAC or Conditional Access. The mitigation for this is to use dedicated administration accounts that can be targeted with policies and additional monitoring.

* The Azure EA Enterprise portal doesn't provide an audit log. To mitigate this, consider an automated governed process to provision subscriptions with the considerations described above and use dedicated EA accounts and audit the authentication logs.

* [Microsoft Customer Agreement](../../cost-management-billing/understand/mca-overview.md) (MCA) roles don't integrate natively with PIM. To mitigate this, use dedicated MCA accounts and monitor usage of these accounts.

* Monitoring IAM assignments outside Microsoft Entra PIM isn't automated through Azure Policies. The mitigation is to not grant Subscription Owner or User Access Administrator roles to engineering teams. Instead create groups assigned to least privileged roles such as Contributor and delegate the management of those groups to engineering teams.

* Privileged roles in Azure AD B2C tenants aren't integrated with Microsoft Entra PIM. The mitigation is to create dedicated accounts in the organization's Microsoft Entra tenant, onboard them in the Azure AD B2C tenant and apply Conditional Access policies to these dedicated administration accounts.

* Azure AD B2C tenant privileged roles aren't integrated with Microsoft Entra access reviews. The mitigation is to create dedicated accounts in the organization's Microsoft Entra tenant, add these accounts to a group and perform regular access reviews on this group.

* There are no technical controls to subordinate the creation of tenants to an organization. However, the activity is recorded in the Audit log. The onboarding to the billing plane is a compensating control at the gate. This needs to be complemented with monitoring and alerts instead.

* There's no out-of-the box product to implement the subscription provisioning workflow recommended above. Organizations need to implement their own workflow.

## Tenant and subscription lifecycle management

### Tenant lifecycle

* We recommend implementing a process to request a new corporate Microsoft Entra tenant. The process should account for:

  * Business justification to create it. Creating a new Microsoft Entra tenant will increase complexity significantly, so it's key to ascertain if a new tenant is necessary.

  * The Azure cloud in which it should be created (for example, Commercial, Government, etc.).

  * Whether this is production or not production

  * Directory data residency requirements

  * Global Administrators who will manage it

  * Training and understanding of common security requirements.

* Upon approval, the Microsoft Entra tenant will be created, configured with necessary baseline controls, and onboarded in the billing plane, monitoring, etc.

* Regular review of the Microsoft Entra tenants in the billing plane needs to be implemented to detect and discover tenant creation outside the governed process. Refer to the *Inventory and Visibility* section of this document for further details.

* Azure AD B2C tenant creation can be controlled using Azure Policy. The policy executes when an Azure subscription is associated to the B2C tenant (a pre-requisite for billing). Customers can limit the creation of Azure AD B2C tenants to specific management groups.

### Subscription lifecycle

Below are some considerations when designing a governed subscription lifecycle process:

* Define a taxonomy of applications and solutions that require Azure resources. All teams requesting subscriptions should supply their "product identifier" when requesting subscriptions. This information taxonomy will determine:

  * Microsoft Entra tenant to provision the subscription

  * Azure EA account to use for subscription creation

  * Naming convention

  * Management group assignment

  * Other aspects such as tagging, cross-charging, product-view usage, etc.

* Don't allow ad-hoc subscription creation through the portals or by other means. Instead consider managing [subscriptions programmatically using Azure Resource Manager](../../cost-management-billing/manage/programmatically-create-subscription.md) and pulling consumption and billing reports [programmatically](/rest/api/consumption/). This can help limit subscription provisioning to authorized users and enforce your policy and taxonomy goals. Guidance on following [AZOps principals](https://github.com/azure/azops/wiki/introduction) can be used to help create a practical solution.

* When a subscription is provisioned, create Microsoft Entra cloud groups to hold standard Azure Resource Manager Roles needed by application teams such as Contributor, Reader and approved custom roles. This enables you to manage Azure RBAC role assignments with governed privileged access at scale.

  1. Configure the groups to become eligible for Azure RBAC roles using Microsoft Entra PIM with the corresponding controls such as activation policy, access reviews, approvers, etc.

  1. Then [delegate the management of the groups](../enterprise-users/groups-self-service-management.md) to solution owners.

  1. As a guardrail, don't assign product owners to User Access Administrator or Owner roles to avoid inadvertent direct assignment of roles outside Microsoft Entra PIM, or potentially changing the subscription to a different tenant altogether.

  1. For customers who choose to enable cross-tenant subscription management in non-production tenants through Azure Lighthouse, make sure that the same access policies from the production privileged account (for example, privileged access only from [secured workstations](/security/compass/privileged-access-deployment)) are enforced when authenticating to manage subscriptions.

* If your organization has pre-approved reference architectures, the subscription provisioning can be integrated with resource deployment tools such as [Azure Blueprints](../../governance/blueprints/overview.md) or [Terraform](https://www.terraform.io).

* Given the tenant affinity to Azure Subscriptions, subscription provisioning should be aware of multiple identities for the same human actor (employee, partner, vendor, etc.) across multiple tenants and assign access accordingly.

### Azure AD B2C tenants

* In an Azure AD B2C tenant, the built-in roles don't support PIM. To increase security, we recommend using Microsoft Entra B2B collaboration to onboard the engineering teams managing Customer Identity Access Management (CIAM) from your Azure tenant, and assign them to Azure AD B2C privileged roles.

* Following the emergency access guidelines for Microsoft Entra ID above, consider creating equivalent [emergency access accounts](../roles/security-emergency-access.md) in addition to the external administrators described above.

* We recommend the logical ownership of the underlying Microsoft Entra subscription of the B2C tenant aligns with the CIAM engineering teams, in the same way that the rest of Azure subscriptions are used for the B2C solutions.

## Operations

The following are additional operational considerations for Microsoft Entra ID, specific to multiple isolated environments. Check the [Azure Cloud Adoption Framework](/azure/cloud-adoption-framework/manage/), the [Microsoft cloud security benchmark](/security/benchmark/azure/) and [Microsoft Entra Operations guide](./ops-guide-ops.md) for detailed guidance to operate individual environments.

### Cross-environment roles and responsibilities

**Enterprise-wide SecOps architecture** - Members of operations and security teams from all environments in the organization should jointly define the following:

* Principles to define when environments need to be created, consolidated, or deprecated.

* Principles to define management group hierarchy on each environment.

* Billing plane (EA portal / MCA) security posture, operational posture, and delegation approach.

* Tenant creation process.

* Enterprise application taxonomy.

* Azure subscription provisioning process.

* Isolation and administration autonomy boundaries and risk assessment across teams and environments.

* Common baseline configuration and security controls (technical and compensating) and operational baselines to be used in all environments.

* Common standard operational procedures and tooling that spans multiple environments (for example, monitoring, provisioning).

* Agreed upon delegation of roles across multiple environments.

* Segregation of duty across environments.

* Common supply chain management for privileged workstations.

* Naming conventions.

* Cross-environment correlation mechanisms.

**Tenant creation** - A specific team should own creating the tenant following standardized procedures defined by enterprise-wide SecOps architecture. This includes:

* Underlying license provisioning (for example, Microsoft 365).

* Onboarding to corporate billing plan (for example, Azure EA or MCA).

* Creation of Azure management group hierarchy.

* Configuration of management policies for various perimeters including identity, data protection, Azure, etc.

* Deployment of security stack per agreed upon cybersecurity architecture, including diagnostic settings, SIEM onboarding, CASB onboarding, PIM onboarding, etc.

* Configuration of Microsoft Entra roles based on agreed upon delegation.

* Configuration and distribution of initial privileged workstations.

* Provisioning emergency access accounts.

* Configuration of identity provisioning stack.

**Cross-environment tooling architecture** - Some tools such as identity provisioning and source control pipelines might need to work across multiple environments. These tools should be considered critical to the infrastructure and must be architected, designed, implemented, and managed as such. As a result, architects from all environments should be involved whenever cross-environment tools need to be defined.

### Inventory and visibility

**Azure subscription discovery** - For each discovered tenant, a Microsoft Entra Global Administrator can [elevate access](../../role-based-access-control/elevate-access-global-admin.md) to gain visibility of all subscriptions in the environment. This elevation will assign the global administrator the User Access Administrator built-in role at the root management group.

>[!NOTE]
>This action is highly privileged and might give the admin access to subscriptions that hold extremely sensitive information if that data has not been properly isolated.

**Enabling read access to discover resources** - Management groups enable RBAC assignment at scale across multiple subscriptions. Customers can grant a Reader role to a centralized IT team by configuring a role assignment in the root management group, which will propagate to all subscriptions in the environment.

**Resource discovery** - After gaining resource Read access in the environment, [Azure Resource Graph](../../governance/resource-graph/overview.md) can be used to query resources in the environment.

### Logging and monitoring

**Central security log management** - Ingest logs from each environment in a [centralized way](/security/benchmark/azure/security-control-logging-monitoring), following consistent best practices across environments (for example, diagnostics settings, log retention, SIEM ingestion, etc.). [Azure Monitor](../../azure-monitor/overview.md) can be used to ingest logs from different sources such as endpoint devices, network, operating systems' security logs, etc.

Detailed information on using automated or manual processes and tools to monitor logs as part of your security operations is available at [Microsoft Entra security operation guide](https://github.com/azure/azops/wiki/introduction).

Some environments might have regulatory requirements that limit which data (if any) can leave a given environment. If centralized monitoring across environments isn't possible, teams should have operational procedures to correlate activities of identities across environments for auditing and forensics purposes such as cross-environment lateral movement attempts. It's recommended that the object unique identifiers human identities belonging to the same person is discoverable, potentially as part of the identity provisioning systems.

The log strategy must include the following Microsoft Entra logs for each tenant used in the organization:

* Sign-in activity

* Audit logs

* Risk events

Microsoft Entra ID provides [Azure Monitor integration](../reports-monitoring/concept-activity-logs-azure-monitor.md) for the sign-in activity log and audit logs. Risk events can be ingested through [Microsoft Graph API](/graph/tutorial-riskdetection-api).

The following diagram shows the different data sources that need to be incorporated as part of the monitoring strategy:

Azure AD B2C tenants can be [integrated with Azure Monitor](../../active-directory-b2c/azure-monitor.md). We recommend monitoring of Azure AD B2C using the same criteria discussed above for Microsoft Entra ID.

Subscriptions that have enabled cross-tenant management with Azure Lighthouse can enable cross-tenant monitoring if the logs are collected by Azure Monitor. The corresponding Log Analytics workspaces can reside in the resource tenant and can be analyzed centrally in the managing tenant using Azure Monitor workbooks. To learn more, check [Monitor delegated resources at scale - Azure Lighthouse](../../lighthouse/how-to/monitor-at-scale.md).

### Hybrid infrastructure OS security logs

All hybrid identity infrastructure OS logs should be archived and carefully monitored as a Tier 0 system, given the surface area implications. This includes:

* AD FS servers and Web Application Proxy

* Microsoft Entra Connect

* Application Proxy Agents

* Password write-back agents

* Password Protection Gateway machines

* NPS that has the Microsoft Entra multifactor authentication RADIUS extension

[Microsoft Entra Connect Health](../hybrid/connect/whatis-azure-ad-connect.md) must be deployed to monitor identity synchronization and federation (when applicable) for all environments.

**Log storage retention** - All environments should have a cohesive log storage retention strategy, design, and implementation to facilitate a consistent toolset (for example, SIEM systems such as Azure Sentinel), common queries, investigation, and forensics playbooks. Azure Policy can be used to set up diagnostic settings.

**Monitoring and log reviewing** - The operational tasks around identity monitoring should be consistent and have owners in each environment. As described above, strive to consolidate these responsibilities across environments to the extent allowed by regulatory compliance and isolation requirements.

The following scenarios must be explicitly monitored and investigated:

* **Suspicious activity** - All [Microsoft Entra risk events](../identity-protection/overview-identity-protection.md) should be monitored for suspicious activity. All tenants should define the network [named locations](../conditional-access/location-condition.md) to avoid noisy detections on location-based signals. [Microsoft Entra ID Protection](../identity-protection/overview-identity-protection.md) is natively integrated with Azure Security Center. It's recommended that any risk detection investigation includes all the environments the identity is provisioned (for example, if a human identity has an active risk detection in the corporate tenant, the team operating the customer facing tenant should also investigate the activity of the corresponding account in that environment).

* **User entity behavioral analytics (UEBA) alerts** - UEBA should be used to get insightful information based on anomaly detection. [Microsoft Microsoft 365 Defender for Cloud Apps](https://www.microsoft.com/security/business/siem-and-xdr/microsoft-defender-cloud-apps) provides [UEBA in the cloud](/defender-cloud-apps/tutorial-ueba). Customers can integrate [on-premises UEBA from Microsoft Microsoft 365 Defender for Identity](/defender-cloud-apps/mdi-integration). MCAS reads signals from Microsoft Entra ID Protection.

* **Emergency access accounts activity** - Any access using [emergency access accounts](./security-operations-privileged-accounts.md) should be monitored and [alerts](../roles/security-emergency-access.md) created for investigations. This monitoring must include:

  * Sign-ins

  * Credential management

  * Any updates on group memberships

  * Application Assignments

* **Billing management accounts** - Given the sensitivity of accounts with billing management roles in Azure EA or MCA, and their significant privilege, it's recommended to monitor and alert:

  * Sign in attempts by accounts with billing roles.

  * Any attempt to authenticate to applications other than the EA Portal.

  * Any attempt to authenticate to applications other than Azure Resource Management if using dedicated accounts for MCA billing tasks.

  * Assignment to Azure resources using dedicated accounts for MCA billing tasks.

* **Privileged role activity** - Configure and review security [alerts generated by Microsoft Entra PIM](../privileged-identity-management/pim-how-to-configure-security-alerts.md). If locking down direct RBAC assignments isn't fully enforceable with technical controls (for example, Owner role has to be granted to product teams to do their job), then monitor direct assignment of privileged roles outside PIM by generating alerts whenever a user is assigned directly to access the subscription with Azure RBAC.

* **Classic role assignments** - Organizations should use the modern Azure RBAC role infrastructure instead of the classic roles. As a result, the following events should be monitored:

  * Assignment to classic roles at the subscription level

* **Tenant-wide configurations** - Any tenant-wide configuration service should generate alerts in the system.

  * Updating Custom Domains

  * Updating branding

  * Microsoft Entra B2B allow/block list

  * Microsoft Entra B2B allowed identity providers (SAML IDPs through direct federation or Social Logins)

  * Conditional Access Policies changes

* **Application and service principal objects**

  * New Applications / Service principals that might require Conditional Access policies

  * Application Consent activity

* **Management group activity** - The following Identity Aspects of management groups should be monitored:

  * RBAC role assignments at the MG

  * Azure Policies applied at the MG

  * Subscriptions moved between MGs

  * Any changes to security policies to the Root MG

* **Custom roles**

  * Updates of the custom role definitions

  * New custom roles created

* **Custom governance rules** - If your organizations established any separation of duties rules (for example, a holder of a Global Administrator tenant GA can't be owner/contributor of subscriptions), create alerts or configure periodic reviews to detect violations.

**Other monitoring considerations** - Azure subscriptions that contain resources used for Log Management should be considered as critical infrastructure (Tier 0) and locked down to the Security Operations team of the corresponding environment. Consider using tools such as Azure Policy to enforce additional controls to these subscriptions.

### Operational tools

**Cross-environment** tooling design considerations:

* Whenever possible, operational tools that will be used across multiple tenants should be designed to run as a Microsoft Entra multi-tenant application to avoid redeployment of multiple instances on each tenant and avoid operational inefficiencies. The implementation should include authorization logic in to ensure that isolation between users and data is preserved.

* Add alerts and detections to monitor any cross-environment automation (for example, identity provisioning) and threshold limits for fail-safes. For example, you may want an alert if deprovisioning of user accounts reaches a specific level, as it may indicate a bug or operational error that could have broad impact.

* Any automation that orchestrates cross-environment tasks should be operated as highly privileged system. This system should be homed to the highest security environment and pull from outside sources if data from other environments is required. Data validation and thresholds need to be applied to maintain system integrity. A common cross-environment task is identity lifecycle management to remove identities from all environments for a terminated employee.

**IT service management tools** - Organizations using IT Service Management (ITSM) systems such as ServiceNow should configure [Microsoft Entra PIM role activation settings](../privileged-identity-management/pim-how-to-change-default-settings.md) to request a ticket number as part of the activation purposes.

Similarly, Azure Monitor can be integrated with ITSM systems through the [IT Service Management Connector](../../azure-monitor/alerts/itsmc-overview.md).

**Operational practices** -  Minimize operational activities that require direct access to the environment to human identities. Instead model them as Azure Pipelines that execute common operations (for example, add capacity to a PaaS solution, run diagnostics, etc.) and model direct access to the Azure Resource Manager interfaces to "break glass" scenarios.

### Operations challenges

* Activity of Service Principal Monitoring is limited for some scenarios

* Microsoft Entra PIM alerts don't have an API. The mitigation is to have a regular review of those PIM alerts.

* Azure EA Portal doesn't provide monitoring capabilities. The mitigation is to have dedicated administration accounts and monitor the account activity.

* MCA doesn't provide audit logs for billing tasks. The mitigation is to have dedicated administration accounts and monitor the account activity.

* Some services in Azure needed to operate the environment need to be redeployed and reconfigured across environments as they can't be multi-tenant or multi-cloud.

* There's no full API coverage across Microsoft Online Services to fully achieve infrastructure as code. The mitigation is to use APIs as much as possible and use portals for the remainder. This [Open-Source initiative](https://microsoft365dsc.com/) to help you with determining an approach that might work for your environment.

* There's no programmatic capability to discover resource tenants that have delegated subscription access to identities in a managing tenant. For example, if an email address enabled a security group in the contoso.com tenant to manage subscriptions in the fabrikam.com tenant, administrators in the contoso.com don't have an API to discover that this delegation took place.

* Specific account activity monitoring (for example, break-glass account, billing management account) isn't provided out of the box. The mitigation is for customers to create their own alert rules.

* Tenant-wide configuration monitoring isn't provided out of the box. The mitigation is for customers to create their own alert rules.

## Next steps

* [Introduction to delegated administration and isolated environments](secure-introduction.md)

* [Microsoft Entra fundamentals](./secure-fundamentals.md)

* [Azure resource management fundamentals](secure-resource-management.md)

* [Resource isolation in a single tenant](secure-single-tenant.md)

* [Resource isolation with multiple tenants](secure-multiple-tenants.md)
