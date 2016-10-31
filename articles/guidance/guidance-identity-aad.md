<properties
   pageTitle="Implementing Azure Active Directory | Microsoft Azure"
   description="How to implement a secure hybrid network architecture using Azure Active Directory."
   services="guidance,virtual-network,active-directory"
   documentationCenter="na"
   authors="telmosampaio"
   manager="christb"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/27/2016"
   ms.author="telmos"/>

# Implementing Azure Active Directory

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for integrating on-premises Active Directory (AD) domains and forests with Azure Active Directory to provide cloud-based identity authentication.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

You can use directory and identity services such as those provided by [AD Domain Services][active-directory-domain-services] (AD DS) to authenticate identities. These identities can be associated with users, computers, applications, or other resources that are included in a security boundary. Directory and identity services are typically hosted on-premises, but if your application is hosted partly on premises and partly in the cloud there may be latency sending authentication requests from the cloud back to on-premises. Implementing directory and identity services in the cloud can reduce this latency.

Azure provides two solutions for implementing directory and identity services in the cloud:

1. [Azure Active Directory (AAD)][azure-active-directory] is a cloud based multi-tenant directory and identity service. AAD provides an easy way to create an AD domain in the cloud and connect it to an on-premises AD domain. [Azure AD Connect][azure-ad-connect] integrates your on-premises directories with AAD. 

Note that AAD doesn't require an existing on-premises forest, you can create an independent AAD forest. In this case, AAD acts as the primary source of all identity information rather than containing data replicated from an on-premises directory.

>[AZURE.NOTE] Only AAD Premium editions support write-back of users' passwords, enabling your on-premises users to perform self-service password resets in the cloud. This is the only information that AAD synchronizes back to the on-premises directory. For more information about the different editions of AAD and their features, see [Azure Active Directory Editions][aad-editions].

2. [AD DS can be deployed on an IaaS VM][ad-azure-guidelines], and the VM will function as a domain controller. You can then connect your existing on-premises AD infrastructure (including AD DS and AD FS) to this VM. This architecture is more common for scenarios in which the on-premises network and Azure virtual network are connected by a VPN and/or ExpressRoute connection. 

The reference architecture discussed in this document includes an on-premises network synchronizing with AAD in the cloud. For more information about deploying AD DS on an IaaS VM in Azure, see [Extending Active Directory to Azure][guidance-adds].

Typical use cases for this reference architecture include:

- Implementing on-premises web applications in the cloud to provide access to authenticated remote users.

- Implementing self-service capabilities for end-users, such as resetting their passwords, and delegating group management. Note that this requires AAD Premium edition.

- Architectures in which the on-premises network and the application's Azure virtual network are not connected using a VPN tunnel or ExpressRoute circuit.

> [AZURE.NOTE] AAD currently supports user authentication only. Some applications and services, such as SQL Server, may require computer authentication and AAD cannot be used.

 For more information about Azure Active Directory works, watch [Microsoft Active Directory Explained][aad-explained].

## Architecture diagram

The following diagram demonstrates the reference architecture discussed in this document. This document focuses on the interaction between the AAD tenant and the Azure Vnet. For more information on the web, business, and data tiers,  see [Running VMs for an N-tier architecture on Azure][implementing-a-multi-tier-architecture-on-Azure]:

> [AZURE.NOTE] For simplicity, this diagram only shows the connections directly related to AAD, and does not depict web browser request redirects or other protocol related traffic that may occur as part of the authentication and identity federation process. For example, a user (on-premises or remote) typically accesses a web app through a browser, and the web app may transparently redirect the web browser to authenticate the request through AAD. Once authenticated, the request can be passed back to the web app together with the appropriate identity information.

> A Visio document that includes this architecture diagram is available for download at the [Microsoft download center][visio-download]. This diagram is on the "Identity - AAD" page.

[![0]][0]

- **Azure Active Directory tenant**. This is an instance of AAD created by your organization. It acts as a simple directory service for cloud applications by storing objects copied from the on-premises AD and provides identity services.

- **Web tier subnet**. This subnet holds VMs that implement a custom cloud-based application developed by your organization. AAD can act as an identity broker for this application.

- **On-premises AD DS server**. This is an on-premise directory and identity service such as AD DS. The AD DS directory can be synchronized with AAD to enable AAD to authenticate on-premise users.

- **Azure AD Connect sync server**. This is an on-premises computer that runs the Azure AD Connect sync service. You install this service by using the Azure AD Connect software. The Azure AD Connect sync service synchronizes information held in the on-premises AD to AAD in the cloud. For example, you can provision or deprovision groups and users on-premises and these changes are propagated to AAD. 

    >[AZURE.NOTE] For security reasons, user's passwords are stored as a hash. If a user requires a password reset, this must be performed on-premises and the new hash must be sent to AAD. AAD Premium editions include features that can automate this task to enable users to reset their own passwords.

## Recommendations

This section summarizes the following recommendations for implementing AAD:

- AD Connect
- Security
- Topology
- User authentication
- Application proxy
- Object synchronization
- Monitoring

### Azure AD Connect sync service recommendations

Synchronization ensures that identity information for users stored in the cloud is consistent with that held on premises. The purpose of the Azure AD Connect sync service is to maintain this consistency. The following points summarize recommendations for implementing the Azure AD Connect sync service:

- Before implementing Azure AD Connect sync, you should determine the synchronization requirements of your organization. For example, what to synchronize, from which domains, and how frequently. The article [Determine directory synchronization requirements][aad-sync-requirements] describes the points to consider.

- You can run the Azure AD Connect sync service using a VM or a computer hosted on-premises. Depending on the volatility of the information in your AD directory, the load on the Azure AD Connect sync service is unlikely to be high once the initial synchronization with AAD has been performed. Running the Azure AD Connect sync service on a VM enables you to more easily scale the server. It's good practice to monitor the activity on the VM as described in the [Monitoring considerations](#monitoring-considerations) section to determine whether scaling is necessary.

- If you have multiple on-premises domains in a forest, the recommended implementation is to store and synchronize information for the entire forest to a single AAD tenant. Filter information for identities that occur in more than one domain so that each identity appears only once in AAD rather than being duplicated. Identity duplication can lead to inconsistencies when data is synchronized. This implementation requires multiple Azure AD Connect sync servers, and for more information see the Multiple AAD scenario in the [Topology considerations](#topology-considerations) section. 

- Use filtering to limit the data stored in AAD to only that which is necessary. For example, your organization might not want to store information about inactive or non-personal accounts in AAD. Filtering can be group-based, domain-based, OU-based, or attribute-based, and you can combine filters to generate more complex rules. For example, you could synchronize objects held in a domain that have a specific value in a selected attribute. For detailed information, see [Azure AD Connect sync: Configure Filtering][aad-filtering].

- To implement high availability for the AD Connect sync service, run a secondary staging server. For more information, see the [Topology considerations](#topology-considerations) section.

### Security recommendations

The following items summarize the primary security recommendations for implementing AAD, depending on the requirements of your organization:

- Managing users' passwords.

    As discussed earlier, if you are using a premium edition of AAD you can enable password write-back from AAD to your on-premises directory. This feature enables users to reset their own passwords from within the Azure portal, but should only be enabled after reviewing your organization's password security policy. For example, you can restrict which users can change their passwords, and you can tailor the password management experience. For more information, see [Customizing Password Management to fit your organization's needs][aad-password-management].

- Maintaining protection for on-premises applications that can be accessed externally.

    Use the Azure AD Application Proxy to provide controlled access to on-premises web applications for external users through AAD. Only users that have valid credentials in your Azure directory have permission to use the application. For more information, see the article [Enable Application Proxy in the Azure portal][aad-application-proxy].

- Actively monitoring AAD for signs of suspicious activity.

    Consider using AAD Premium P2 edition, which includes AAD Identity Protection. Identity Protection uses adaptive machine learning algorithms and heuristics to detect anomalies and risk events that may indicate that an identity has been compromised. For example, it can detect potentially anomalous activity such as irregular sign-in activities, sign-ins from unknown sources or from IP addresses with suspicious activity, or sign-ins from devices that may be infected. Using this data, Identity Protection generates reports and alerts that enables you to investigate these risk events and take appropriate remediation or mitigation action. For more information, see [Azure Active Directory Identity Protection][aad-identity-protection].

    You can use the reporting feature of AAD in the Azure portal to monitor security-related activities occurring within your system. For more information about using these reports, see [Azure Active Directory Reporting Guide][aad-reporting-guide].

### Topology recommendations

If you are integrating an on-premises directory with AAD, configure Azure AD Connect to implement a topology that most closely matches the requirements of your organization. Topologies that Azure AD Connect supports include the following:

- **Single forest, single AAD directory**. In this topology, you use Azure AD Connect to synchronize objects and identity information in one or more domains into a single on-premises forest with a single AAD tenant. This is the default topology implemented by the express installation of Azure AD Connect.

    > [AZURE.NOTE] Don't create multiple Azure AD Connect sync servers to connect different domains in the same on-premises forest to the same AAD tenant unless you are running an Azure AD Connect sync server in staging mode. See the Staging Server topology further on in the list for more information.

- **Multiple forests, single AAD directory**. Use this topology if you have more than one on-premises forest. You can consolidate identity information so that each unique user is represented once in the AAD directory, even if the same user exists in more than one forest. All forests use the same Azure AD Connect sync server. The Azure AD Connect sync server does not have to be part of any domain, but it must be reachable from all forests.

    > [AZURE.NOTE] In this topology, don't use separate Azure AD Connect sync servers to connect each on-premises forest to a single AAD tenant. This can result in duplicated identity information in AAD if users are present in more than one forest.

- **Multiple forests, separate topologies**. This implementation enables you to merge identity information from separate forests into a single AAD tenant. This implementation is useful if you are combining forests from different organizations and the identity information for each user is held in only one forest.

    > [AZURE.NOTE] If the GALs in each forest are synchronized, a user in one forest may be present in another as a contact. This can occur if your organization has implemented GALSync with Forefront Identity manager 2010 or Microsoft Identity Manager 2016. In this scenario, you can specify that users should be identified by their *Mail* attribute. You can also match identities using the *ObjectSID* and *msExchMasterAccountSID* attributes. This is useful if you have one or more resource forests with disabled accounts.

- **Staging server**. In this configuration, you run a second instance of the Azure AD Connect sync server in parallel with the first. This structure supports scenarios such as:

    - High availability.

    - Testing and deploying a new configuration of the Azure AD Connect sync server.

    - Introducing a new server and decommissioning an old configuration. 

    In these scenarios, the second instance runs in *staging mode*. The server records imported objects and synchronization data in its database, but does not pass the data to AAD. Only when you disable staging mode does the server start writing data to AAD, and also starts performing password write-backs into the on-premises directories where appropriate. For more information, see [Azure AD Connect sync: Operational tasks and considerations][aad-connect-sync-operational-tasks].

- **Multiple AAD directories**. It is recommended that you create a single AAD directory for an organization, but there may be situations where you need to partition information across separate AAD directories. In this case, avoid synchronization and password write-back issues by ensuring that each object from the on-premises forest appears in only one AAD directory. To implement this scenario, configure separate Azure AD Connect sync servers for each AAD directory, and use filtering so each Azure AD Connect sync server operates on a mutually exclusive set of objects. 

For more information about all of these topologies, see [Topologies for Azure AD Connect][aad-topologies].

### User authentication recommendations

By default, the Azure AD Connect sync server configures password synchronization between the on-premises domain and AAD, and the AAD service assumes that users authenticate by providing the same password that they use on-premises. For many organizations, this is appropriate, but you should consider your organization's existing policies and infrastructure. For example:

- The security policy of your organization might prohibit synchronizing password hashes to the cloud.

- You might require that users experience seamless SSO when accessing cloud resources from domain joined machines on the corporate network.

- Your organization might already have ADFS or a third party federation provider deployed. You can configure AAD to use this infrastructure to implement authentication and SSO rather than by using password information held in the cloud.

For more information, see [Azure AD Connect User Sign on options][aad-user-sign-in].

### Azure AD application proxy recommendations

Use Azure AD to provide access to on-premises applications.

- Expose your on-premises web applications using application proxy connectors managed by the Azure AD application proxy component. The application proxy connector opens an outbound network connection to the Azure AD application proxy and remote users requests are routed back from AAD through this connection to the web apps. This removes the need to open inbound ports in the on-premises firewall and reduces the attack surface exposed by your organization.

For more information, see [Publish applications using Azure AD Application proxy][aad-application-proxy].

### Object synchronization recommendations

Azure AD Connect's default configuration synchronizes objects from your local AD directory based on the rules specified in the article [Azure AD Connect sync: Understanding the default configuration][aad-connect-sync-default-rules]. Objects that satisfy these rules are synchronized while all other objects are ignored. Some example rules:

- User objects must have a unique *sourceAnchor* attribute and the *accountEnabled* attribute must be populated.

- User Objects must have a *sAMAccountName* attribute and cannot start with the text *AAD_* or *MSOL_*.

Azure AD Connect applies several rules to User, Contact, Group, ForeignSecurityPrincipal, and Computer objects. Use the Synchronization Rules Editor installed with Azure AD Connect if you need to modify the default set of rules. For more information, see [Azure AD Connect sync: Understanding the default configuration][aad-connect-sync-default-rules]).

You can also define your own filters to limit the objects to be synchronized by domain or OU. Alternatively, you can implement more complex custom filtering such as that described in [Azure AD Connect sync: Configure Filtering][aad-filtering].

### Monitoring recommendations

Health monitoring is performed by the following agents installed on-premises:

- Azure AD Connect installs an agent that captures information about synchronization operations. Use the Azure Active Directory Connect Health blade in the Azure portal to monitor the health and performance of Azure AD Connect. For more information, see [Using Azure AD Connect Health for sync][aad-health].

- To monitor the health of the AD DS domains and directories from Azure, install the Azure AD Connect Health for AD DS agent on a machine within the on-premises domain. Use the Azure Active Directory Connect Health blade in the Azure portal to monitor AD DS. For more information, see [Using Azure AD Connect Health with AD DS][aad-health-adds]

- Install the Azure AD Connect Health for AD FS agent to monitor the health of AD FS running on on-premises, and use the Azure Active Directory Connect Health blade in the Azure portal to monitor AD DS. For more information, see [Using Azure AD Connect Health with AD FS][aad-health-adfs]

For more information on installing the AD Connect Health agents and their requirements, see [Azure AD Connect Health Agent Installation][aad-agent-installation].

## Scalability considerations

Scalability is addressed by the AAD service and the configuration of the Azure AD Connect sync server. For the AAD service, you do not have to configure any options to implement scalability. The AAD service supports scalability based on replicas, implementing both a single primary replica that handles write operations and multiple read-only secondary replicas. AAD transparently redirects attempted writes made against secondary replicas to the primary replica and provides eventual consistency. All changes made to the primary replica are propagated to the secondary replicas. This architecture scales well because most operations against AAD are reads rather than writes. For more information, see [Azure AD: Under the hood of our geo-redundant, highly available, distributed cloud directory][aad-scalability].

For the Azure AD Connect sync server, you should determine how many objects you are likely to synchronize from your local directory. If you have less than 100,000 objects, you can use the default SQL Server Express LocalDB software provided with Azure AD Connect. If you have a larger number of objects, you should install a production version of SQL Server and perform a custom installation of the Azure AD Connect specifying that it should use an existing instance of SQL Server.

## Availability considerations

The AAD service is designed to provide high availability and there are no user-configurable availability options. It is geo-distributed and runs in multiple data centers spread around the world with automated failover. If a data center becomes unavailable, AAD ensures that your directory data is available for instance access in at least two more regionally dispersed data centers.

    >[AZURE.NOTE] The SLA for AAD Basic and Premium services guarantees at least 99.9% availability. There is no SLA for the Free tier of AAD. For more information, see [SLA for Azure Active Directory][sla-aad].

Consider provisioning a second instance of Azure AD Connect sync server in staging mode to increase availability, as discussed in the [topology considerations](#topology-considerations) section. 

If you are not using the SQL Server Express LocalDB instance that comes with Azure AD Connect, consider using SQL clustering to achieve high availability. Solutions such as mirroring and Always On are not supported by Azure AD Connect.

For additional considerations about achieving high availability of the Azure AD Connect sync server and also how to recover after a failure, see [Azure AD Connect sync: Operational tasks and considerations - Disaster Recovery][aad-sync-disaster-recovery].

## Manageability considerations

There are two aspects to managing AAD:

1. Administering AAD in the cloud.

2. Maintaining the Azure AD Connect sync servers.

AAD provides the following options for managing domains and directories in the cloud:

- [Azure Active Directory PowerShell Module][aad-powershell]. Use this module if you need to script common Azure AD administrative tasks such as user management, domain management and for configuring single sign-on.

- Azure AD management blade in the Azure portal. This blade provides an interactive management view of the directory, and enables you to control and configure most aspects of AAD. Azure AD Connect installs the following tools to maintain Azure AD Connect sync services from your on-premises machines:

    - The Microsoft Azure Active Directory Connect console. This tool enables you to modify the configuration of the Azure AD Sync server, customize how synchronization occurs, enable or disable staging mode, and switch the user sign-in mode. Note that you can enable AD FS sign-in using your on-premises infrastructure.

    - The Synchronization Service Manager. Use the *Operations* tab in this tool to manage the synchronization process and detect whether any parts of the process have failed. You can trigger synchronizations manually using this tool. The *Connectors* tab enables you to control the connections for the domains that the synchronization engine is attached to.

-  The Synchronization Rules Editor. Use this tool to customize the way objects are transformed when they are copied between an on-premises directory and AAD in the cloud. This tool enables you to specify additional attributes and objects for synchronization, then executes filters to determine which objects should or should not be synchronized. For more information, see the Synchronization Rule Editor section in the document [Azure AD Connect sync: Understanding the default configuration][aad-connect-sync-default-rules].

- [Azure AD Connect sync: Best practices for changing the default configuration][aad-sync-best-practices] contains additional information and tips for managing Azure AD Connect.

## Security considerations

Trigger [Azure Multi-Factor Authentication (MFA)][azure-multifactor-authentication] if a user attempts to connect from a non-trusted location such as across the Internet instead of a trusted network.

Use the device platform type of the user (iOS, Android, Windows Mobile, Windows) to determine access policy to applications and features.

Record the enabled/disabled state of users' devices, and incorporate this information into the access policy checks. For example, if a user's phone is lost or stolen it should be recorded as disabled to prevent it from being used to gain access.

Control the level of access to a user based on group membership. Use [AAD dynamic membership rules][aad-dynamic-membership-rules] to simplify group administration. For a brief overview of how this works, see [Introduction to Dynamic Memberships for Groups][aad-dynamic-memberships].

Use conditional access risk policies with AAD Identity Protection to provide advanced protection based on unusual sign-in activities or other events.

For more information, see [Azure Active Directory conditional access][aad-conditional-access].

## Solution deployment

A deployment for a reference architecture that implements these recommendations and considerations is available on Github. The reference architecture can be deployed with either with Windows or Linux VMs by following the directions below: 

1. Right click the button below and select either "Open link in new tab" or "Open link in new window":  
[![Deploy to Azure](./media/blueprints/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-identity-aad%2Fazuredeploy.json)

2. Once the link has opened in the Azure portal, you must enter values for some of the settings: 
    - The **Resource group** name is already defined in the parameter file, so select **Create New** and enter `ra-aad-onpremise-rg` in the text box.
    - Select the region from the **Location** drop down box.
    - Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
    - Select the **Os Type** from the drop down box, **windows** or **linux**.
    - Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
    - Click on the **Purchase** button.

3. Wait for the deployment to complete.

4. The parameter files include a hard-coded administrator user names and passwords, and it is strongly recommended that you immediately change both on all the VMs. Click on each VM in the Azure Portal then click on **Reset password** in the **Support + troubleshooting** blade. Select **Reset password** in the **Mode** dropdown box, then select a new **User name** and **Password**. Click the **Update** button to persist the new user name and password.

<!-- Once you have changed the administrator user names and passwords, follow the instructions in the readme.md file to test the reference architecture. --> 

## Next steps

- Learn the best practices for [extending your on-premises ADDS domain to Azure][adds-extend-domain]

- Learn the best practices for [creating an ADDS resource forest][adds-resource-forest] in Azure

<!-- links -->

[aad-agent-installation]: ../active-directory/active-directory-aadconnect-health-agent-install.md
[aad-application-proxy]: ../active-directory/active-directory-application-proxy-enable.md
[aad-conditional-access]: ../active-directory//active-directory-conditional-access.md
[aad-connect-sync-default-rules]: ../active-directory/active-directory-aadconnectsync-understanding-default-configuration.md
[aad-connect-sync-operational-tasks]: ../active-directory/active-directory-aadconnectsync-operations.md#staging-mode
[aad-dynamic-memberships]: https://youtu.be/Tdiz2JqCl9Q
[aad-dynamic-membership-rules]: ../active-directory/active-directory-accessmanagement-groups-with-advanced-rules.md
[aad-editions]: ../active-directory/active-directory-editions.md
[aad-filtering]: ../active-directory/active-directory-aadconnectsync-configure-filtering.md
[aad-health]: ../active-directory/active-directory-aadconnect-health-sync.md
[aad-health-adds]: ../active-directory/active-directory-aadconnect-health-adds.md
[aad-health-adfs]: ../active-directory/active-directory-aadconnect-health-adfs.md
[aad-identity-protection]: ../active-directory/active-directory-identityprotection.md
[aad-password-management]: ../active-directory/active-directory-passwords-customize.md
[aad-password-management]: ../active-directory/active-directory-passwords-getting-started.md#enable-users-to-reset-their-azure-ad-passwords
[aad-powershell]: https://msdn.microsoft.com/library/azure/mt757189.aspx
[aad-reporting-guide]: ../active-directory/active-directory-reporting-guide.md
[aad-scalability]: https://blogs.technet.microsoft.com/enterprisemobility/2014/09/02/azure-ad-under-the-hood-of-our-geo-redundant-highly-available-distributed-cloud-directory/
[aad-sync-best-practices]: ../active-directory/active-directory-aadconnectsync-best-practices-changing-default-configuration.md
[aad-sync-disaster-recovery]: ../active-directory/active-directory-aadconnectsync-operations.md#disaster-recovery
[aad-sync-requirements]: ../active-directory/active-directory-hybrid-identity-design-considerations-directory-sync-requirements.md
[aad-topologies]: ../active-directory/active-directory-aadconnect-topologies.md
[aad-user-sign-in]: ../active-directory/active-directory-aadconnect-user-signin.md
[adds-extend-domain]: ./guidance-identity-adds-extend-domain.md
[adds-resource-forest]: ./guidance-identity-adds-resource-forest.md
[active-directory-domain-services]: https://technet.microsoft.com/library/dd448614.aspx
[ad-azure-guidelines]: https://msdn.microsoft.com/library/azure/jj156090.aspx
[azure-active-directory]: ../active-directory-domain-services/active-directory-ds-overview.md
[azure-ad-connect]: ../active-directory/active-directory-aadconnect.md
[azure-multifactor-authentication]: ../multi-factor-authentication/multi-factor-authentication.md
[guidance-adds]: ./guidance-iaas-ra-secure-vnet-ad.md
[implementing-a-multi-tier-architecture-on-Azure]: ./guidance-compute-n-tier-vm.md
[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[sla-aad]: https://azure.microsoft.com/support/legal/sla/active-directory/v1_0/
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx

<!--[aad-custom-domain]: ../active-directory/active-directory-add-domain.md-->
<!--[aad-adfs]: ../active-directory/active-directory-aadconnect-get-started-custom.md#configuring-federation-with-ad-fs-->

[0]: ./media/guidance-identity-aad/figure1.png "Cloud identity architecture using Azure Active Directory"
