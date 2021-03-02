---
title: Azure security baseline for Azure Active Directory
description: The Azure Active Directory security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: active-directory
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Active Directory

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../../security/benchmarks/overview.md) to Azure Active Directory. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Active Directory. **Controls** not applicable to Azure Active Directory have been excluded.

To see how Azure Active Directory completely maps to the Azure Security Benchmark, see the [full Azure Active Directory security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](/azure/security/benchmarks/security-controls-v2-network-security).*

### NS-1: Implement security for internal traffic

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37714).

**Guidance**: Azure Active Directory does not support deploying directly into a virtual network, because of this you can not leverage certain networking features with the offering's resources such as network security groups, route tables, or other network dependent appliances such as an Azure Firewall.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### NS-2: Connect private networks together

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37715).

**Guidance**: Not applicable; Azure Active Directory is not designed to deploy into or be secured to a private network, this control is intended to describe network connectivity and does not apply.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### NS-3: Establish private network access to Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37716).

**Guidance**: Azure Active Directory does not allow for its management endpoints to be secured to a private network with the Private Link service. 

Use Azure Virtual Network service endpoints to provide secure access to Azure Active Directory via an optimized route over the Azure backbone network without crossing the internet. 

Private access is an additional defense in depth measure in addition to authentication and traffic security offered by Azure services. 

- [Understand Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### NS-4: Protect applications and services from external network attacks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37717).

**Guidance**: Azure Active Directory does not support deploying directly into a virtual network, because of this you can not leverage traditional networking features to prevent denial of service (DDoS) attacks with native Azure network features like DDoS Protection Standard. 

Azure Active Directory is not intended to run web applications, and does not require you to configure any additional settings or deploy any extra network services to protect it from external network attacks targeting web applications.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37718).

**Guidance**: Azure Active Directory does not support deploying into a virtual network and cannot be configured with an IDS or IPS solution for detecting or preventing threats on the network.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### NS-6: Simplify network security rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37719).

**Guidance**: Use Azure Virtual Network Service Tags to define network access controls on network security groups or Azure Firewall configured for your Azure Active Directory resources. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name, like AzureActiveDirectory in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. 

- [Understand and using Service Tags](../../virtual-network/service-tags-overview.md)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### NS-7: Secure Domain Name Service (DNS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37720).

**Guidance**: Not applicable; Azure Active Directory does not expose its underlying DNS configurations; these settings are maintained by Microsoft.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](/azure/security/benchmarks/security-controls-v2-identity-management).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37700).

**Guidance**: Azure AD recommends using least privilege role to manage the
directory. For more information see the article, Azure
AD role descriptions and permissions /
azure/active-directory/roles/permissions-reference

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IM-2: Manage application identities securely and automatically

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37701).

**Guidance**: Azure AD recommends creating a service principal with
restricted permissions at the resource level to configure service principals
with certificate credentials and fall back to client secrets. 

- [Azure service principal](/powershell/azure/create-azure-service-principal-azureps) 

- [Create a service principal with certificates](/azure/active-directory/develop/howto-authenticate-service-principal-powershell)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IM-3: Use Azure AD single sign-on (SSO) for application access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37702).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IM-4: Use strong authentication controls for all Azure Active Directory based access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37703).

**Guidance**: Azure AD allows both cloud-only and hybrid accounts. Add or delete users /
azure/active-directory/fundamentals/add-users-azure-active-directory

- [Azure AD default password policy](/azure/active-directory/authentication/concept-sspr-policy#password-policies-that-only-apply-to-cloud-user-accounts) 

Eliminate bad passwords using Azure Active Directory
- [Password Protection](/azure/active-directory/authentication/concept-password-ban-bad)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IM-5: Monitor and alert on account anomalies

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37704).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IM-6: Restrict Azure resource access based on conditions

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37705).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IM-7: Eliminate unintended credential exposure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37706).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IM-8: Secure user access to legacy applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37742).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](/azure/security/benchmarks/security-controls-v2-privileged-access).*

### PA-1: Protect and limit highly privileged users

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37707).

**Guidance**: The most critical built-in roles are Azure AD are Global
Administrator and the Privileged Role Administrator, as users assigned to these
two roles can delegate administrator roles:

 Global
     Administrator: Users with this role have access to all administrative
     features in Azure AD, as well as services that use Azure AD identities.

 Privileged
     Role Administrator: Users with this role can manage role assignments in
     Azure AD, as well as within Azure AD Privileged Identity Management (PIM).
     In addition, this role allows management of all aspects of PIM and
     administrative units.

Note: You may have other critical roles that need to be
governed if you use custom roles with certain privileged permissions assigned.
And you may also want to apply similar controls to the administrator account of
critical business assets.

Azure AD has
highly privileged accounts: the users
and service principals that are directly or indirectly assigned to, or eligible
for, the Global Administrator or Privileged Role Administrator roles, and other
highly privileged roles in Azure AD and Azure.

Limit the number of highly privileged accounts and protect
these accounts at an elevated level because users with this privilege can
directly or indirectly read and modify every resource in your Azure
environment.

You can enable just-in-time (JIT) privileged access to Azure
resources and Azure AD using Azure AD Privileged Identity Management (PIM). JIT
grants temporary permissions to perform privileged tasks only when users need
it. PIM can also generate security alerts when there is suspicious or unsafe
activity in your Azure AD organization.
- Administrator role permissions in Azure
- [AD](/azure/active-directory/users-groups-roles/directory-assign-admin-roles) 

- Use Azure Privileged Identity Management
- [security alerts](/azure/active-directory/privileged-identity-management/pim-how-to-configure-security-alerts) 

- Securing privileged access for hybrid and cloud
- [deployments in Azure AD](/azure/active-directory/users-groups-roles/directory-admin-roles-secure)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PA-2: Restrict administrative access to business-critical systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37708).

**Guidance**: Azure AD offers
the following controls to restrict administrative access to business critical
systems:
- Privileged Identity Management approval of role
- [activation requests](/azure/active-directory/privileged-identity-management/azure-ad-pim-approval-workflow?tabs=new) 

- Multi-factor authentication and Conditional
- [Access](/azure/active-directory/conditional-access/howto-conditional-access-policy-admin-mfa)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PA-3: Review and reconcile user access regularly

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37709).

**Guidance**: Review user account access assignments regularly to ensure
the accounts and their access are valid, especially focused on the highly
privileged roles including Global Administrator and Privileged Role
Administrator. You can use Azure AD access reviews to review group memberships,
access to enterprise applications, and role assignments, both for Azure AD
roles and Azure roles. Azure AD reporting can provide logs to help discover
stale accounts. You can also use Azure AD Privileged Identity Management to
create access review report workflow to facilitate the review process.

In addition, Azure Privileged Identity Management can also
be configured to alert when an excessive number of administrator accounts are
created, and to identify administrator accounts that are stale or improperly
configured.
- Create an access review of Azure AD roles in
- [Privileged Identity Management (PIM)](/azure/active-directory/privileged-identity-management/pim-how-to-start-security-review)

- Create an access review of Azure resource roles
- [in Privileged Identity Management (PIM)](/azure/active-directory/privileged-identity-management/pim-resource-roles-start-access-review) 

- How to use Azure AD identity and access
- [reviews](/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PA-4: Set up emergency access in Azure AD

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37710).

**Guidance**: To prevent being accidentally locked out of your Azure AD
organization, set up an emergency access account for access when normal
administrative accounts cannot be used. Emergency access accounts are usually
highly privileged, and they should not be assigned to specific individuals.
Emergency access accounts are limited to emergency or "break glass"'
scenarios where normal administrative accounts can't be used.

You should ensure that the credentials (such as password,
certificate, or smart card) for emergency access accounts are kept secure and
known only to individuals who are authorized to use them only in an emergency.
- [- Manage emergency access accounts in Azure AD](/azure/active-directory/users-groups-roles/directory-emergency-access)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PA-5: Automate entitlement management 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37711).

**Guidance**: Use Azure AD entitlement management features to automate
access request workflows, including access assignments, reviews, and
expiration. Dual or multi-stage approval is also supported.
- [- What is Azure AD entitlement management](/azure/active-directory/governance/entitlement-management-overview)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PA-6: Use privileged access workstations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37712).

**Guidance**: Secured, isolated workstations are critically important for
the security of sensitive roles like administrators, developers, and critical
service operators. Use highly secured user workstations and/or Azure Bastion
for administrative tasks. Use Azure Active Directory, Microsoft Defender
Advanced Threat Protection (ATP), and/or Microsoft Intune to deploy a secure
and managed user workstation for administrative tasks. The secured workstations
can be centrally managed to enforce secured configuration including strong
authentication, software and hardware baselines, restricted logical and network
access.
- [- Securing devices as part of privileged access](/security/compass/privileged-access-devices)

- [- Privileged access implementation](/security/compass/privileged-access-deployment)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PA-7: Follow just enough administration (least privilege principle) 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37713).

**Guidance**: Customers can configure their Azure AD deployment for least
privilege, by assigning users to the roles with the minimum permissions needed
for users to complete their administrative tasks.
- [- Administrator role permissions in Azure AD](/azure/active-directory/roles/permissions-reference)

- [- Assign administrative roles in Azure AD](/azure/active-directory/roles/manage-roles-portal)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PA-8: Choose approval process for Microsoft support  

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37769).

**Guidance**: Azure AD doesn't support customer lockbox. Microsoft may
work with customers through non-lockbox methods for approval to access customer
data.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](/azure/security/benchmarks/security-controls-v2-data-protection).*

### DP-1: Discovery, classify and label sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37721).

**Guidance**: Not applicable; Azure AD manages
sensitive data but doesn't have capability to discovery, classify, and labeling
sensitive data.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### DP-2: Protect sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37722).

**Guidance**: Isolation: 
A directory is the data boundary by which the Azure AD services
store and process data for a customer. 
Customers should determine where they want most of their Azure AD Customer
Data to reside by setting the Country property in their directory.  A customer should use the Ref1
instructions to determine how their selected country maps to the physical
location of their directory.  
Additionally, as the customer uses various Azure AD tools,
features, and applications that interact with their directory, they would use Ref2
instructions to determine how their selected country maps to the physical
location of any Customer Data stored and/or processed by these Azure AD tools,
features, and applications.

Segmentation:  The Ref3 documentation
provides all the product features to enable segmentation.  The global administrators role has full
control of all directory data, and the rules that govern access and processing
instructions. A directory may be segmented into administrative units, and
provisioned with users and groups to be managed by administrators of those
units, Global administrators may delegate responsibility to other principles in
their organization by assigning them to pre-defined roles or custom roles they
can create.

Access: 
The Ref3 documentation describes the permission model.    Permissions can be applied at a user,
group, role, application, or device.  The
assignment may be permanent or temporal per Privileged Identity Management
configuration.

 

Encryption: 
Azure AD encrypts
all data at rest or in transit.  The
offering does not allow customers to encrypt directory data with their own
encryption key. 

 

Ref1
- [Where your data is located](https://www.microsoft.com/trust-center/privacy/data-location)

 

Ref2

Azure Active Directory – Where is your
- [data located?](https://msit.powerbi.com/view?r=eyJrIjoiYzEyZTc5OTgtNTdlZS00ZTVkLWExN2ItOTM0OWU4NjljOGVjIiwidCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsImMiOjV9)

Ref3
- [Azure AD roles documentation](/azure/active-directory/roles/)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### DP-3: Monitor for unauthorized transfer of sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37723).

**Guidance**: Not applicable; Azure
AD transmits sensitive data but does not support
monitoring for unauthorized transfer of sensitive data.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### DP-4: Encrypt sensitive information in transit

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37724).

**Guidance**: To complement access controls,
data in transit should be protected against ‘out of band’ attacks (e.g. traffic
capture) using encryption to ensure that attackers cannot easily read or modify
the data.

Azure AD supports data encryption in
transit with TLS v1.2 or greater.

While this is optional for traffic on private networks,
this is critical for traffic on external and public networks. For HTTP traffic,
ensure that any clients connecting to your Azure resources can negotiate TLS
v1.2 or greater. For remote management, use SSH (for Linux) or RDP/TLS (for
Windows) instead of an unencrypted protocol. Obsoleted SSL, TLS, and SSH
versions and protocols, and weak ciphers should be disabled.

By default, Azure provides encryption for data in
transit between Azure data centers.

- [Understand encryption in transit with Azure](/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit) 

- [Information on TLS Security](/security/engineering/solving-tls1-problem) 
Double
- [encryption for Azure data in transit](/azure/security/fundamentals/double-encryption#data-in-transit)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### DP-5: Encrypt sensitive data at rest

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37725).

**Guidance**: To complement access controls, Azure AD encrypts
data at rest to protect against ‘out of band’ attacks (such as accessing
underlying storage) using encryption. This helps ensure that attackers cannot
easily read or modify the data.

- [Understand encryption at rest in Azure](/azure/security/fundamentals/encryption-atrest#encryption-at-rest-in-microsoft-cloud-services) 
Data
- [at rest double encryption in Azure](/azure/security/fundamentals/double-encryption#data-at-rest)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](/azure/security/benchmarks/security-controls-v2-asset-management).*

### AM-1: Ensure security team has visibility into risks for assets

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37743).

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions so they can monitor for security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. That said, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Note: Additional permissions might be required to get visibility into workloads and services. 

- [Overview of Security Reader Role](/azure/role-based-access-control/built-in-roles#security-reader)

- [Overview of Azure Management Groups](/azure/governance/management-groups/overview)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-2: Ensure security team has access to asset inventory and metadata

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37744).

**Guidance**: Not applicable; Azure AD does not host assets outside of those controlled by identity management processes.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### AM-3: Use only approved Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37745).

**Guidance**: Not applicable; Azure AD does not host Azure resources, thus does not have capabilities to restrict or limit deployment to only approved Azure services.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### AM-4: Ensure security of asset lifecycle management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37746).

**Guidance**: Not applicable; Azure AD does not host assets outside of those controlled by identity management processes.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### AM-5: Limit users' ability to interact with Azure Resource Manager

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37747).

**Guidance**: Use Azure AD Conditional Access to limit users' ability to interact with Azure AD via the Azure Portal by configuring "Block access" for the "Microsoft Azure Management" App. 

- [How to configure Conditional Access to block access to Azure Resources Manager](/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### AM-6: Use only approved applications in compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37748).

**Guidance**: Not applicable; Azure AD does not deploy any customer facing compute resources or does not allow customers to install applications on the service.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](/azure/security/benchmarks/security-controls-v2-logging-threat-protection).*

### LT-1: Enable threat detection for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37726).

**Guidance**: Use the Azure AD Identity Protection built-in threat detection capability for your Azure AD resources. For more information see the article What is Azure Active Directory Identity Protection? /azure/active-directory/identity-protection/overview-identity-protection.

Azure AD produces activity logs that are often used for threat detection and threat hunting. Azure AD sign-in logs provide a record of authentication and authorization activity for users, services, and apps. Azure AD audit logs track changes made to an Azure AD tenant, including changes that improve or diminish security posture. To export Identity Protection and Azure AD Audit Logs to Azure Sentinel follow the guidance in the following articles, Connect Azure AD Identity Protection data to Azure Sentinel /azure/sentinel/connect-azure-ad-identity-protection and Connect Azure Active Directory data to Azure Sentinel  /azure/sentinel/connect-azure-active-directory.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### LT-2: Enable threat detection for Azure identity and access management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37727).

**Guidance**: Azure AD provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel or other SIEM/monitoring tools for more sophisticated monitoring and analytics use cases: 

Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities. 

Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies. 

Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account. 

Risky users - A risky user is an indicator for a user account that might have been compromised. 

Identity Protection risk detections are enabled by default and require no onboarding process. The granularity or risk data is determined by license SKU. 

- [Audit activity reports in the Azure Active Directory](/azure/active-directory/reports-monitoring/concept-audit-logs)  

- [Enable Azure Identity Protection](/azure/active-directory/identity-protection/overview-identity-protection)  

- [Threat protection in Azure Security Center](/azure/security-center/threat-protection)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### LT-3: Enable logging for Azure network activities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37728).

**Guidance**: Not applicable. Azure AD is a managed offering that is not intended to deploy into virtual networks. Because of this you are unable to enable network security group flow logging, route traffic through a firewall or perform packet captures. 

Not applicable. Azure AD is a managed offering that is not intended to deploy into virtual networks. Azure AD is not intended to deploy into virtual networks and cannot be used with Azure network security groups.  

Not applicable. Azure AD is a managed offering that does not expose network traffic to or from its resources. 

Not applicable. Azure AD is a managed offering that does not expose network traffic to or from its resources.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### LT-4: Enable logging for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37729).

**Guidance**: Yes, Azure AD produces activity logs. Unlike some Azure services, Azure AD does not have a clear distinction between activity and resource logs. Activity logs are automatically available in the Azure AD section of the Azure Portal, and can be exported to Azure Monitor, Azure Event Hubs, Azure Storage, SIEMs, and other locations.  

Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities. 

Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies. 

- [Activity and security reports in Azure Active Directory](/azure/active-directory/reports-monitoring/overview-reports)

Azure AD provides security-related logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel or other SIEM/monitoring tools for more sophisticated monitoring and analytics use cases: 

Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account. 

Risky users - A risky user is an indicator for a user account that might have been compromised. 

Identity Protection risk detections are enabled by default and require no onboarding process. The granularity or risk data is determined by license SKU.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### LT-5: Centralize security log management and analysis

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37730).

**Guidance**: Many customers want to centralize their security logs for easier threat hunting and security posture analysis. In general, we recommend the following guidelines.  

Centralize logging storage and analysis to enable correlation. For each log source within Azure AD, ensure you have assigned a data owner, access guidance, storage location, what tools are used to process and access the data, and data retention requirements. 

Ensure you are integrating Azure activity logs into your central logging. Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage. 

In addition, enable and onboard data to Azure Sentinel or a third-party SIEM. 

Many organizations choose to use Azure Sentinel for “hot” data that is used frequently and Azure Storage for “cold” data that is used less frequently. 

- [How to collect platform logs and metrics with Azure Monitor](/azure/azure-monitor/platform/diagnostic-settings)  

- [How to onboard Azure Sentinel](/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### LT-6: Configure log storage retention

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37731).

**Guidance**: Ensure that any storage accounts or Log Analytics workspaces used for storing Azure AD sign-in logs, audit logs, and risk data logs has the log retention period set according to your organization's compliance regulations. 

In Azure Monitor, you can set your Log Analytics workspace retention period according to your organization's compliance regulations. Use Azure Storage, Data Lake or Log Analytics workspace accounts for long-term and archival storage. 

- [How to configure Log Analytics Workspace Retention Period](/azure/azure-monitor/platform/manage-cost-storage)  

- [Storing resource logs in an Azure Storage Account](/azure/azure-monitor/platform/resource-logs-collect-storage)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### LT-7: Use approved time synchronization sources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37732).

**Guidance**: Azure AD does not support configuring your own time synchronization sources. The Azure AD service relies on Microsoft time synchronization sources, and is not exposed to customers for configuration.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](/azure/security/benchmarks/security-controls-v2-incident-response).*

### IR-1: Preparation – update incident response process for Azure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37733).

**Guidance**: Ensure your organization has processes to respond to security incidents, has updated these processes for Azure, and is regularly exercising them to ensure readiness.

- [Implement security across the enterprise environment](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Incident response reference guide](/microsoft-365/downloads/IR-Reference-Guide.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-2: Preparation – setup incident notification

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37734).

**Guidance**: Set up security incident contact information in Azure Security Center. This contact information is used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs. 

- [How to set the Azure Security Center security contact](/azure/security-center/security-center-provide-security-contact-details)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IR-3: Detection and analysis – create incidents based on high quality alerts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37735).

**Guidance**: Ensure you have a process to create high-quality alerts and measure the quality of alerts. This allows you to learn lessons from past incidents and prioritize alerts for analysts, so they don’t waste time on false positives. 

High-quality alerts can be built based on experience from past incidents, validated community sources, and tools designed to generate and clean up alerts by fusing and correlating diverse signal sources. 

Azure Security Center provides high-quality alerts across many Azure assets. You can use the ASC data connector to stream the alerts to Azure Sentinel. Azure Sentinel lets you create advanced alert rules to generate incidents automatically for an investigation. 

Export your Azure Security Center alerts and recommendations using the export feature to help identify risks to Azure resources. Export alerts and recommendations either manually or in an ongoing, continuous fashion.

- [How to configure export](/azure/security-center/continuous-export)

- [How to stream alerts into Azure Sentinel](/azure/sentinel/connect-azure-security-center)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-4: Detection and analysis – investigate an incident

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37736).

**Guidance**: Ensure analysts can query and use diverse data sources as they investigate potential incidents, to build a full view of what happened. Diverse logs should be collected to track the activities of a potential attacker across the kill chain to avoid blind spots.  You should also ensure insights and learnings are captured for other analysts and for future historical reference.  

The data sources for investigation include the centralized logging sources that are already being collected from the in-scope services and running systems, but can also include:

- Network data – use network security groups' flow logs, Azure Network Watcher, and Azure Monitor to capture network flow logs and other analytics information. 

- Snapshots of running systems: 

    - Use Azure virtual machine's snapshot capability to create a snapshot of the running system's disk. 

    - Use the operating system's native memory dump capability to create a snapshot of the running system's memory.

    - Use the snapshot feature of the Azure services or your software's own capability to create snapshots of the running systems.

Azure Sentinel provides extensive data analytics across virtually any log source and a case management portal to manage the full lifecycle of incidents. Intelligence information during an investigation can be associated with an incident for tracking and reporting purposes. 

- [Snapshot a Windows machine's disk](/azure/virtual-machines/windows/snapshot-copy-managed-disk)

- [Snapshot a Linux machine's disk](/azure/virtual-machines/linux/snapshot-copy-managed-disk)

- [Microsoft Azure Support diagnostic information and memory dump collection](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) 

- [Investigate incidents with Azure Sentinel](/azure/sentinel/tutorial-investigate-cases)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-5: Detection and analysis – prioritize incidents

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37737).

**Guidance**: Provide context to analysts on which incidents to focus on first based on alert severity and asset sensitivity. 

Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark resources using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](/azure/security-center/security-center-alerts-overview)

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-6: Containment, eradication and recovery – automate the incident handling

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37738).

**Guidance**: Automate manual repetitive tasks to speed up response time and reduce the burden on analysts. Manual tasks take longer to execute, slowing each incident and reducing how many incidents an analyst can handle. Manual tasks also increase analyst fatigue, which increases the risk of human error that causes delays, and degrades the ability of analysts to focus effectively on complex tasks. 
Use workflow automation features in Azure Security Center and Azure Sentinel to automatically trigger actions or run a playbook to respond to incoming security alerts. The playbook takes actions, such as sending notifications, disabling accounts, and isolating problematic networks. 

- [Configure workflow automation in Security Center](/azure/security-center/workflow-automation)

- [Set up automated threat responses in Azure Security Center](/azure/security-center/tutorial-security-incident#triage-security-alerts)

- [Set up automated threat responses in Azure Sentinel](/azure/sentinel/tutorial-respond-threats-playbook)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](/azure/security/benchmarks/security-controls-v2-vulnerability-management).*

### PV-1: Establish secure configurations for Azure services 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37753).

**Guidance**: Microsoft identity and access management solutions help IT
protect access to applications and resources across on-premises and in the
cloud. It is important that organizations follow security best practices to
ensure their Identity and access management implementation is secure and more
resilient to attacks. 

Based on your Identity and access management implementation
strategy your organization should follow the Microsoft best practice guidance
to secure your identity infrastructure. 

Azure
- [Identity Management and access control security best practices](/azure/security/fundamentals/identity-management-best-practices)

Five
- [steps to securing your identity infrastructure](/azure/security/fundamentals/steps-secure-identity)

 

Organizations that collaborate with external partners should
additionally assess and implement appropriate governance, security, and compliance
configurations to reduce security risk and protect sensitive resources. 

Securing
- [external collaboration in Azure Active Directory and Microsoft 365](/azure/active-directory/fundamentals/secure-external-access-resources)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-2: Sustain secure configurations for Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37754).

**Guidance**: Achieving great Identity and access management security
posture is no small achievement. Maintaining your organizations security
posture can often be just as difficult. Microsoft Secure Score provides organizations
a measurement of their security posture and recommendations that can help
protect organizations from threats. It is recommended that organizations
routinely review their Secure Score for suggested improvement actions to
improve their identity security posture. 

What
- [is the identity secure score in Azure Active Directory?](/azure/active-directory/fundamentals/identity-secure-score)

Microsoft
- [Secure Score](/microsoft-365/security/mtp/microsoft-secure-score?view=o365-worldwide)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-3: Establish secure configurations for compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37755).

**Guidance**: Not
applicable; Azure AD doesn't have any secure configurations
for compute resource.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-4: Sustain secure configurations for compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37756).

**Guidance**: Not
applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-5: Securely store custom operating system and container images

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37757).

**Guidance**: Not
applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-6: Perform software vulnerability assessments

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37758).

**Guidance**: Not
applicable; Azure AD doesn't support any vulnerability
assessments.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-7: Rapidly and automatically remediate software vulnerabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37759).

**Guidance**: Not
applicable; Azure AD doesn't provide
capability to support software remediation automatically.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-8: Conduct regular attack simulation

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37760).

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.
Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](/azure/security/fundamentals/pen-testing)

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Endpoint Security

*For more information, see the [Azure Security Benchmark: Endpoint Security](/azure/security/benchmarks/security-controls-v2-endpoint-security).*

### ES-1: Use Endpoint Detection and Response (EDR)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37739).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### ES-2: Use centrally managed modern anti-malware software

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37740).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### ES-3: Ensure anti-malware software and signatures are updated

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37741).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Backup and Recovery

*For more information, see the [Azure Security Benchmark: Backup and Recovery](/azure/security/benchmarks/security-controls-v2-backup-recovery).*

### BR-1: Ensure regular automated backups

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37749).

**Guidance**: Not
applicable; Azure AD doesn't support any data
backup or have no needs for data backup.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### BR-2: Encrypt backup data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37750).

**Guidance**: Not
applicable; Azure AD doesn't support any data
backup encryption.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### BR-3: Validate all backups including customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37751).

**Guidance**: Not
applicable; Azure AD doesn't support any data
backup.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### BR-4: Mitigate risk of lost keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37752).

**Guidance**: Not
applicable; Azure AD doesn't manage any keys.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](/azure/security/benchmarks/security-controls-v2-governance-strategy).*

### GS-1: Define asset management and data protection strategy 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37761).

**Guidance**: Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Data classification standard in accordance with the business risks

-	Security organization visibility into risks and asset inventory 

-	Security organization approval of Azure services for use 

-	Security of assets through their lifecycle

-	Required access control strategy in accordance with organizational data classification

-	Use of Azure native and third party data protection capabilities

-	Data encryption requirements for in-transit and at-rest use cases

-	Appropriate cryptographic standards

For more information, see the following references:
- [Azure Security Architecture Recommendation - Storage, data, and encryption](/azure/architecture/framework/security/storage-data-encryption?toc=/security/compass/toc.json&amp;bc=/security/compass/breadcrumb/toc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](/azure/security/fundamentals/encryption-overview)

- [Cloud Adoption Framework - Azure data security and encryption best practices](/azure/security/fundamentals/data-encryption-best-practices?toc=/azure/cloud-adoption-framework/toc.json&amp;bc=/azure/cloud-adoption-framework/_bread/toc.json)

- [Azure Security Benchmark - Asset management](/azure/security/benchmarks/security-benchmark-v2-asset-management)

- [Azure Security Benchmark - Data Protection](/azure/security/benchmarks/security-benchmark-v2-data-protection)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-2: Define enterprise segmentation strategy 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37768).

**Guidance**: Establish an enterprise-wide strategy to segmenting access to assets using a combination of identity, network, application, subscription, management group, and other controls.

Carefully balance the need for security separation with the need to enable daily operation of the systems that need to communicate with each other and access data.

Ensure that the segmentation strategy is implemented consistently across control types including network security, identity and access models, and application permission/access models, and human process controls.

- [Guidance on segmentation strategy in Azure (video)](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Guidance on segmentation strategy in Azure (document)](/security/compass/governance#enterprise-segmentation-strategy)

- [Align network segmentation with enterprise segmentation strategy](/security/compass/network-security-containment#align-network-segmentation-with-enterprise-segmentation-strategy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-3: Define security posture management strategy

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37762).

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](/azure/security/benchmarks/security-benchmark-v2-posture-vulnerability-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-4: Align organization roles, responsibilities, and accountabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37763).

**Guidance**: Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](/azure/cloud-adoption-framework/security/security-top-10#1-people-educate-teams-about-the-cloud-security-journey)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](/azure/cloud-adoption-framework/security/security-top-10#2-people-educate-teams-on-cloud-security-technology)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-5: Define network security strategy

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37764).

**Guidance**: Establish an Azure network security approach as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Centralized network management and security responsibility

-	Virtual network segmentation model aligned with the enterprise segmentation strategy

-	Remediation strategy in different threat and attack scenarios

-	Internet edge and ingress and egress strategy

-	Hybrid cloud and on-premises interconnectivity strategy

-	Up-to-date network security artifacts (e.g. network diagrams, reference network architecture)

For more information, see the following references:
- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure Security Benchmark - Network Security](/azure/security/benchmarks/security-benchmark-v2-network-security)

- [Azure network security overview](/azure/security/fundamentals/network-overview)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-6: Define identity and privileged access strategy

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37765).

**Guidance**: Establish an Azure identity and privileged access approaches as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	A centralized identity and authentication system and its interconnectivity with other internal and external identity systems

-	Strong authentication methods in different use cases and conditions

-	Protection of highly privileged users

-	Anomaly user activities monitoring and handling  

-	User identity and access review and reconciliation process

For more information, see the following references:

- [Azure Security Benchmark - Identity management](/azure/security/benchmarks/security-benchmark-v2-identity-management)

- [Azure Security Benchmark - Privileged access](/azure/security/benchmarks/security-benchmark-v2-privileged-access)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure identity management security overview](/azure/security/fundamentals/identity-management-overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/37766).

**Guidance**: Establish a logging and threat response strategy to rapidly detect and remediate threats while meeting compliance requirements. Prioritize providing analysts with high-quality alerts and seamless experiences so that they can focus on threats rather than integration and manual steps. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	The security operations (SecOps) organization’s role and responsibilities 

-	A well-defined incident response process aligning with NIST or another industry framework 

-	Log capture and retention to support threat detection, incident response, and compliance needs

-	Centralized visibility of and correlation information about threats, using SIEM, native Azure capabilities, and other sources 

-	Communication and notification plan with your customers, suppliers, and public parties of interest

-	Use of Azure native and third-party platforms for incident handling, such as logging and threat detection, forensics, and attack remediation and eradication

-	Processes for handling incidents and post-incident activities, such as lessons learned and evidence retention

For more information, see the following references:

- [Azure Security Benchmark - Logging and threat detection](/azure/security/benchmarks/security-benchmark-v2-logging-threat-detection)

- [Azure Security Benchmark - Incident response](/azure/security/benchmarks/security-benchmark-v2-incident-response)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

- [Azure enterprise scale, management, and monitoring](/azure/cloud-adoption-framework/ready/enterprise-scale/management-and-monitoring)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
