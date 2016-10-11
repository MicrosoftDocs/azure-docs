<properties
	pageTitle="Azure Government Services | Microsoft Azure"
	description="Provides and overview of the available services in Azure Government"
	services="Azure-Government"
	cloud="gov"
	documentationCenter=""
	authors="zakramer"
	manager="liki"
	editor="" />

<tags
	ms.service="multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="azure-government"
	ms.date="10/04/2016"
	ms.author="ryansoc" />


#  Security

##  Principles for Securing Customer Data in Azure Government

Azure Government provides a range of features and services that you can use to build cloud solutions to meet your regulated/controlled data needs. A compliant customer solution is nothing more than the effective implementation of out-of-the-box Azure Government capabilities, coupled with a solid data security practice.
When you host a solution in Azure Government, Microsoft handles many of these requirements at the cloud infrastructure level.

The following diagram shows the Azure defense-in-depth model. For example, Microsoft provides basic cloud infrastructure DDOS, along with customer capabilities such as security appliances for customer-specific application DDOS needs.

![alt text](./media/azure-government-Defenseindepth.png)

This page outlines the foundational principles for securing your Services and applications, providing guidance and best practices on how to apply these principles; in other words, how customers should make smart use of Azure Government to meet the obligations and responsibilities that are required for a solution that handles ITAR information.

The overarching principles for securing customer data are:
- Protecting data using encryption
- Managing secrets
- Isolation to restrict data access

##  Protecting Customer Data Using Encryption

Mitigating risk and meeting regulatory obligations are driving the increasing focus and importance of data encryption. Use an effective encryption implementation to enhance current network and application security measures—and decrease the overall risk of your cloud environment.

### <a name="Overview"></a>Encryption at rest
The encryption of data at rest applies to the protection of customer content held in disk storage. There are several ways this might happen:

### <a name="Overview"></a>Storage Service Encryption

Azure Storage Service Encryption is enabled at the storage account level, resulting in block blobs and page blobs being automatically encrypted when written to Azure Storage. When you read the data from Azure Storage, it will be decrypted by the storage service before being returned. Use this to secure your data without having to modify or add code to any applications.

### <a name="Overview"></a>Azure Disk Encryption
Use Azure Disk Encryption to encrypt the OS disks and data disks used by an Azure Virtual Machine. Integration with Azure Key Vault gives you control and helps you manage disk encryption keys.

### <a name="Overview"></a>Client-Side Encryption
Client-Side Encryption is built into the Java and the .NET storage client libraries, which can utilize Azure Key Vault APIs, making this straightforward to implement. Use Azure Key Vault to obtain access to the secrets in Azure Key Vault for specific individuals using Azure Active Directory.

### <a name="Overview"></a>Encryption in transit

The basic encryption available for connectivity to Azure Government supports Transport Level Security (TLS) 1.2 protocol, and X.509 certificates. Federal Information Processing Standard (FIPS) 140-2 Level 1 cryptographic algorithms are also used for infrastructure network connections between Azure Government datacenters.  Windows Server 2012 R2, and Windows 8-plus VMs, and Azure File Shares can use SMB 3.0 for encryption between the VM and the file share. Use Client-Side Encryption to encrypt the data before it is transferred into storage in a client application, and to decrypt the data after it is transferred out of storage.

### <a name="Overview"></a>Best practices for Encryption

- IaaS VMs: Use Azure Disk Encryption. Turn on Storage Service Encryption to encrypt the VHD files that are used to back up those disks in Azure Storage, but this only encrypts newly written data. This means that, if you create a VM and then enable Storage Service Encryption on the storage account that holds the VHD file, only the changes will be encrypted, not the original VHD file.
- Client-Side Encryption: This is the most secure method for encrypting your data, because it encrypts it before transit, and encrypts the data at rest. However, it does require that you add code to your applications using storage, which you might not want to do. In those cases, you can use HTTPs for your data in transit, and Storage Service Encryption to encrypt the data at rest. Client-Side Encryption also involves more load on the client—you have to account for this in your scalability plans, especially if you are encrypting and transferring a lot of data.

For more information on the encryption options in Azure see the [Storage Security Guide](/storage-security-guide).

##  Protecting Customer Data by Managing Secrets

Secure key management is essential for protecting data in the cloud. Customers should strive to simplify key management and maintain control of keys used by cloud applications and services to encrypt data.

### <a name="Overview"></a>Best Practices for Managing Secrets

- Use Key Vault to minimize the risks of secrets being exposed through hard-coded configuration files, scripts, or in source code. Azure Key Vault encrypts keys (such as the encryption keys for Azure Disk Encryption) and secrets (such as passwords), by storing them in FIPS 140-2 Level 2 validated hardware security modules (HSMs). For added assurance, you can import or generate keys in these HSMs.
- Application code and templates should only contain URI references to the secrets (which means the actual secrets are not in code, configuration or source code repositories). This prevents key phishing attacks on internal or external repos, such as harvest-bots in GitHub.
- Utilize strong RBAC controls within Key Vault. If a trusted operator leaves the company or transfers to a new group within the company, they should be prevented from being able to access the secrets.

For additional information please see [Key Vault for Azure Government](/azure-government/azure-government-tech-keyvault)

##  Isolation to Restrict Data Access

Isolation is all about using boundaries, segmentation, and containers to limit data access to only authorized users, services, and applications. For example, the separation between tenants is an essential security mechanism for multitenant cloud platforms such as Microsoft Azure. Logical isolation helps prevent one tenant from interfering with the operations of any other tenant.

### <a name="Overview"></a>Environment Isolation
The Azure Government environment is a physical instance that is separate from the rest of Microsoft's network. This is achieved through a series of physical and logical controls that include the following:
- Securing of physical barriers using biometric devices and cameras.
- Use of specific credentials and multifactor authentication by Microsoft personnel requiring logical access to the production environment.
- All service infrastructure for Azure Government is located within the United States.

#### <a name="Overview"></a>Per-Customer Isolation
Azure implements network access control and segregation through VLAN isolation, ACLs, load balancers and IP filters

Customers can further isolate their resources across subscriptions, resource groups, virtual networks, and subnets.

## Identity
For any organization contemplating a move to Azure Government, one area that will drive more design decisions and generate more architectural discussions than any other will be the issue of managing identity in the cloud. You look at some of the options for identity management between on-premise and cloud-based environments and review one approach that a Department of Defense organization used to simplify their Active Directory deployment while maintaining effective security of user identities.

The options for managing identity in Azure Government are as follows:
- Azure Active Directory (Azure AD), either with or without on-premises Active Directory
- Directory synchronization between on-premises Active Directory and Azure AD, either with or without password synchronization using Azure AD Connect
- Hybrid integration between on-premises Active Directory and Azure AD providing single sign-on (SSO) with Active Directory Federation Services
- Extension of on-premises Active Directory into Azure Government

### Azure Active Directory
Azure AD is Microsoft’s Identity and Access Management as a Service (IDaaS) offering for organizations of all sizes. Organizations without on-premises Active Directory can use it as their main identity and access management resource; those with Active Directory or other directories already deployed can connect their current infrastructure and synchronize identity attributes into the cloud. Alternatively, they can maintain two different sets of credentials and have users authenticate to Azure Government using different user names and passwords (or multi-factor authentication) to that for the on-premises Active Directory. Azure Government supports new MFA options, as well as smartcards. Authentication can also be verified through a phone call, a text message or a mobile app verification code.

The advantage of using Azure Active Directory on its own is that the organization then does not require any on-premises domain controllers, as all identity management, password reset and user administration is carried out in the cloud. However, while this approach might provide a workable solution for a small, green-field organization without any investment in an on-premises directory service, it is unlikely that Azure AD on its own will be a suitable design for larger or established clients.

It is possible to use Azure AD alongside on-premises Active Directory, with no synchronization between the two. This approach certainly provides some reassurance for those who might have concerns in relation to identity-based attacks on the cloud leading to data loss on-premises. However, that reassurance is not guaranteed, as it is difficult to prevent users from manually assigning the same password to both their on-premises and cloud-based accounts. In addition, users now have to remember two sets of credentials; one for their on-premise applications and data, the other for those in Azure Government.

### Azure AD Connect and Directory Synchronization
Azure AD Connect is the replacement for Azure Active Directory Sync (DirSync) and Azure AD Sync. This component enables flow of identity information from Active Directory to Azure AD, thus populating Azure AD with user, group, and contact information. In addition, it supports limited write-back capabilities in support of hybrid deployments of Exchange Online with Exchange Server.

Azure AD Connect supports the following range of synchronization options:
- Single forest to single Azure AD
- Multiple forests to single Azure AD directory
- Staging server
- GALsync with on-premises sync server

Note that each object only once in an Azure AD directory the following arrangements are NOT supported:
- Single forest with multiple sync servers to single Azure AD
- Multiple forests, multiple sync servers to one Azure AD directory
- Each object replicated multiple times in an Azure AD directory
- GALsync using writeback

For more information, see Topologies for Azure AD Connect, at https://azure.microsoft.com/en-gb/documentation/articles/active-directory-aadconnect-topologies/.

[Azure.Note]: When connecting to Azure AD using Azure AD Connect, you need to configure a registry setting to select the Azure Government Cloud endpoint.

For more information, see Microsoft Azure Government Cloud, at https://azure.microsoft.com/en-us/documentation/articles/active-directory-aadconnect-instances/#microsoft-azure-government-cloud.

### Azure AD Connect with Password Synchronization
A further option with Azure AD Connect is password synchronization. Password synchronization enables users to authenticate to cloud-based resources using the same credentials as they use to log on to the domain. However, this is not the same as SSO and does not offer such depth of functionality.

Password synchronization stores a hash of the user’s on-premises password in Azure AD and compares that stored value with the hash of the password generated when the user logs on to a resource in Azure Government. If the two hashes match, then the supplied password must be correct and the user is permitted to access the cloud resource.

The result is that the user can use his or her domain credentials to access resources in the cloud. However, it is important to understand the technical differences between this mechanism and those for true SSO in the following section. For example, Azure AD Connect does not support advanced authentication options such as MFA or provide a true hybrid architecture for use with SaaS

[Azure-Note] If your organization needs to comply with Federal Information Processing Standards (FIPS), then you cannot use password sync, as this feature requires use of MD5 hash algorithms, even though the MD5 hash is further protected by rehashing using SHA256 prior to transmission to the cloud.

For more information, see Implementing password synchronization with Azure AD Connect sync, at https://azure.microsoft.com/en-gb/documentation/services/active-directory/.

### Single Sign-On with Active Directory Federation Services
ADFS enables true SSO between on-premises Active Directory and Azure AD and offers more options for authentication, such as Multi-Factor Authentication (MFA) through smart cards or managed mobile devices. The difference with ADFS is that rather than a hash of the password being used to check the validity of the user’s password, when the user attempts to access a cloud-based resource, the entire authentication request is forwarded to one or more servers running ADFS.

The ADFS servers then interrogate the on-premises Active Directory, and if the credentials are correct, create a security token. This token contains a number of claims about the user, such as Name, email address and so on, which is then presented to the cloud-based resource to confirm that the user has been authenticated. The user can now access the resource in Azure Government.

SSO with ADFS does offer significant advantages in terms of security (easy account termination) and in support for advanced scenarios, such as MFA. Disadvantages include the requirement to run an ADFS infrastructure, which requires additional hardware and configuration. Also, failure of the federation server will prevent users from authenticating to cloud resources.

### Extension of On-premises Active Directory into Azure Government
The final identity integration option with Azure Government is possibly the simplest of all, but one that requires organizations to take a significant leap in terms of where they define their security boundaries. In effect, this change is to consider Azure Government part of the organization’s internal network, rather than external to it. In consequence, IP address ranges, subnets, domain name registration, security and firewalls are all configured so that the Azure Government segment simply appears as another network segment on the organization’s intranet.

The only difference with such a configuration is an increase in the round-trip time to any resources hosted on those subnets, resulting in slightly greater latency. With Azure ExpressRoute connectivity, bandwidth to Azure Government can consist of one or more pairs of 10Gb connection points, giving in effect, greater bandwidth to the Azure resources than experienced from 1Gb internal switches.

The huge advantage from an identity management perspective, this architecture enables you to extend your Active Directory forest into Azure Government without further configuration. By deploying Windows Server virtual machine images and installing Active Directory Domain Services, either into an existing domain within the forest or into a separate domain. This domain controller can also provide other services linked to domain operations, such as Active Directory-integrated DNS. They can also provide some of the Flexible Single Master Operations (FSMO) roles within the domain and also host a copy of the Global Catalog; however, it is unlikely that cloud-based DCs would be Schema Masters or Domain Naming Masters.

As a real-world example of this integration, a Department of Defense (DoD) organization recently integrated Azure Government into its network, connecting to the cloud through a Cloud Access Point (CAP) provided by the Defense Infrastructure Services Agency (DISA). The DoD department connected to the CAP by using an IPSec-secured Virtual Private Network (VPN). From there, access to Azure Government was through two pairs of 10GBs connections, although at present, each link is throttled to 350Mbs. For more information about the DoD Azure ExpressRoute implementation, see Department of Defense - Getting Started with Private Connectivity, at link here.

This approach gives a good balance between functionality and security, while providing the highest level of integration between the on-premise Active Directory and the cloud environment. However, getting to this end state does require acceptance of a significantly different attitude to the cloud, where Azure Government is seen as an entity within the organizational network, and not something “out there”.

## Screening
Azure Government ensures that personnel who have access to customer content are all US citizens. All Microsoft personnel who have access to customer content that is hosted in Azure Government undergo the background checks and screenings set out in the following table:

Azure Gov screenings and background checks | Description|
---|---|
US citizenship |Verification of US citizenship.
Microsoft cloud background check (every two years)|Social Security number search, criminal history check, Office of Foreign Assets Control list (OFAC), Bureau of Industry and Security list (BIS), Office of Defense Trade Controls Debarred Persons list.
National Agency Check with Law and Credit (NACLC) (every five years) | Adds fingerprint background check against FBI databases. For additional information, go to the <a href="https://www.opm.gov/investigations/background-investigations/federal-investigations-notices/1997/fin97-02/"> Office Personnel Management Site </a>.

For Azure operations personnel, the following access principles apply:
- Duties are clearly defined, with separate responsibilities for requesting, approving and deploying changes.
- Access is through defined interfaces that have specific functionality.
- Access is just-in-time (JIT), and is granted only on a per-incident basis or for a specific maintenance event, and always for a limited duration.
- Access is rule-based, with defined roles that are only assigned the permissions required for troubleshooting.
- Support actions are observed by a second party.

Screening standards include the validation of US citizenship of all Microsoft support and operational staff before access is granted to Azure Government-hosted systems. Support personnel who need to transfer data use the secure capabilities within Azure Government. Secure data transfer requires a separate set of authentication credentials to gain access. For example, to access system metadata, operations personnel use specific web-based internal management tools, read-only APIs, and JIT elevation.

## Next Steps

For more information on isolation in Microsoft Azure see the [Isolation section of the Azure Security Guide](/azure-security-getting-started/#isolation).

For supplemental information and updates please subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
