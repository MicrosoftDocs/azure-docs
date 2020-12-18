---
title: Azure security baseline for Azure Stack Edge
description: The Azure Stack Edge security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: databox-online
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Stack Edge

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../security/benchmarks/overview.md) to Microsoft Azure Stack Edge. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Stack Edge. **Controls** not applicable to Azure Stack Edge have been excluded.

To see how Azure Stack Edge completely maps to the Azure Security Benchmark, see the [full Azure Stack Edge security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](/azure/security/benchmarks/security-controls-v2-network-security).*

### NS-1: Implement security for internal traffic

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40444).

**Guidance**: Customers deploy a Microsoft-provided, physical, Azure Stack Edge device into their private network for internal access and have options to secure it further. 
For example, the Azure Stack Edge device is accessible over the customer's internal network and requires a customer-configured IP. Additionally, an access password is chosen by the customer to access the user interface of the device. 

Internal traffic is further secured by:

- Transport Layer Security (TLS) version 1.2 is required for Azure portal and SDK management of the Azure Stack Edge device.

- Any client access to the device is through the local web UI using standard TLS 1.2 as the default secure protocol.

- Only an authorized Azure Stack Edge Pro device is allowed to join the Azure Stack Edge service that the customer's create in their Azure subscription.

Additional information is available at the referenced links.
 
- [Configure TLS 1.2 on Windows clients accessing Azure Stack Edge Pro GPU device](azure-stack-edge-j-series-configure-tls-settings.md)

- [Quickstart - Get started with Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-quickstart.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### NS-2: Connect private networks together

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40445).

**Guidance**: Customers can choose a point-to-site virtual private network (VPN) to connect an Azure Stack Edge device from their on-premise private network to the Azure network. VPN provides a second layer of encryption for the data-in-motion over transport layer security from the customer's device to Azure. 

Customers can configure a virtual private network on their Azure Stack Edge device via the Azure portal or via the Azure PowerShell.

- [Configure Azure VPN via Azure PowerShell script for Azure Stack Edge Pro R and Azure Stack Edge Mini R](azure-stack-edge-mini-r-configure-vpn-powershell.md)

- [Configure TLS 1.2 on Windows clients accessing Azure Stack Edge Pro GPU device](azure-stack-edge-j-series-configure-tls-settings.md)

- [Tutorial: Configure certificates for your Azure Stack Edge Pro R](azure-stack-edge-pro-r-deploy-configure-certificates-vpn-encryption.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-3: Establish private network access to Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40446).

**Guidance**: Customers can choose a point-to-site virtual private network (VPN) to connect an Azure Stack Edge device from their on-premise private network to the Azure network. VPN provides a second layer of encryption for the data-in-motion over transport layer security from the customer's device to Azure. 

- [Configure Azure VPN via Azure PowerShell script for Azure Stack Edge Pro R and Azure Stack Edge Mini R](azure-stack-edge-mini-r-configure-vpn-powershell.md)

- [Configure TLS 1.2 on Windows clients accessing Azure Stack Edge Pro GPU device](azure-stack-edge-j-series-configure-tls-settings.md)

- [Tutorial: Configure certificates for your Azure Stack Edge Pro R](azure-stack-edge-pro-r-deploy-configure-certificates-vpn-encryption.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### NS-4: Protect applications and services from external network attacks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40447).

**Guidance**: The Azure Stack Edge device incorporates standard Windows Server network protection features, which are not configurable by customers.

Customers can choose to secure their private network connected with Azure Stack Edge device from external attacks using a network virtual appliance, such as a firewall with advanced distributed denial of service (DDoS) protections.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40448).

**Guidance**: The endpoints used by Azure Stack Edge device are all managed by Microsoft. Customers are responsible for any additional controls they wish to deploy to their on-premise systems.

The Azure Stack Edge device uses its own intrusion detection features to protect the service. 

- [Understand Azure Stack Edge security](azure-stack-edge-security.md)

- [Port information for Azure Stack Edge](azure-stack-edge-gpu-system-requirements.md)

- [Get hardware and software intrusion detection logs](azure-stack-edge-gpu-troubleshoot.md#gather-advanced-security-logs)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### NS-6: Simplify network security rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40449).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this
recommendation is intended for offerings that have the capability to define
groupings of allowed IP ranges for efficient management in Network Access
Control Lists. Azure Stack Edge does not currently support service tags.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-7: Secure Domain Name Service (DNS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40450).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not
applicable; Azure Stack Edge does not offer domain name service capabilities. The Azure Stack Edge device uses the existing domain name service environment setup on your on-premises network.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](/azure/security/benchmarks/security-controls-v2-identity-management).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40430).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Azure Active Directory (Azure AD) authentication is required for all management operations performed on Azure Stack Edge devices via the Azure portal. Azure Stack Hub requires Azure AD or Active Directory Federation Services (ADFS), backed by Azure AD, as an identity provider.

Standardize on Azure AD to govern your organization’s identity and access management in:

- Microsoft cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machines (Linux and Windows), Azure Key Vault, platform as a service (PaaS), and software as a service (SaaS) applications

- Your organization's resources, such as applications on Azure or your corporate network resources

Note that Azure AD is used only when accessing the device through the Azure portal. Any local management operations to the Azure Stack Edge device will not leverage Azure AD. 

- [Tenancy in Azure AD](../active-directory/develop/single-and-multi-tenant-apps.md)

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

- [Define Azure AD tenants](https://azure.microsoft.com/resources/securing-azure-environments-with-azure-active-directory)

- [Use external identity providers for an application](/azure/active-directory/b2b/identity-providers)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### IM-2: Manage application identities securely and automatically

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40431).

**Guidance**: All Azure Stack Edge devices automatically have a system-assigned managed identity in Azure Active Directory (Azure AD). Currently, the managed identity is used for the cloud management of virtual machines hosted on Azure Stack Edge.

Azure Stack Edge devices boot up into a locked state for local access. For the local device administrator account, you will need to connect to your device through the local web user interface or PowerShell interface and set a strong password. Store and manage your device administrator credential in a secure location such as an Azure Key Vault and rotate the admin password according to your organizational standards.

- [Protect Azure Stack Edge device via password](azure-stack-edge-security.md#protect-the-device-via-password)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### IM-3: Use Azure AD single sign-on (SSO) for application access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40432).

**Guidance**: Single sign-on is not supported for Azure Stack Edge endpoint devices. However, you can choose to enable standard Azure Active Directory (Azure AD) based single sign-on to secure access to your Azure cloud resources.

- [Understand application SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-4: Use strong authentication controls for all Azure Active Directory based access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40433).

**Guidance**: Multifactor authentication  is a strong authentication control, but an opt-in feature for the Azure Stack Edge service users. It can be leveraged for supported scenarios such as edge-management of Azure Stack Edge devices at the Azure portal. Note that the local access to the Azure Stack Edge devices does not support multifactor authentication.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-5: Monitor and alert on account anomalies

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40434).

**Guidance**: Enable Azure Monitor to gather device or container logs for your Azure Stack Edge service. Monitor containers, such as the ones running multiple compute applications at the Kubernetes cluster on your device.

Additionally, a support package, which includes audit logs can be gathered at the local web user interface of the Azure Stack Edge device. Note that the support package is not available at the Azure portal.
 
- [Enable Azure Monitor on your Azure Stack Edge Pro device](azure-stack-edge-gpu-enable-azure-monitor.md) 

- [Gather a support package](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-6: Restrict Azure resource access based on conditions

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40435).

**Guidance**: Azure Active Directory (Azure AD) conditional access is an opt-in feature for authentication to Azure Stack Edge service. Azure Stack Edge service is a resource in the Azure portal that lets you manage an Azure Stack Edge Pro device across different geographical locations. 

- [What is conditional access](../active-directory/conditional-access/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IM-7: Eliminate unintended credential exposure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40436).

**Guidance**: Follow the best practices to protect credentials, such as:

- Activation key used to activate the device with the Azure Stack Edge resource in Azure.
- Sign in credentials to access the Azure Stack Edge device.
- Key files that can facilitate a recovery of Azure Stack Edge device.
- Channel encryption key

Rotate and then sync your storage account keys regularly to help protect your storage account from unauthorized users.

- [Azure Stack Edge Pro security and data protection](azure-stack-edge-security.md)

- [Sync storage keys](azure-stack-edge-manage-shares.md#sync-storage-keys)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-8: Secure user access to legacy applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40472).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Stack Edge service does not have a need to access any legacy applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](/azure/security/benchmarks/security-controls-v2-privileged-access).*

### PA-1: Protect and limit highly privileged users

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40437).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not Applicable; Azure Stack Edge device does not have an administrative account. Additionally, highly privileged users are not required for Azure Stack Edge management operations .

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-2: Restrict administrative access to business-critical systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40438).

**Guidance**: Azure Stack Edge solution has several components with strong access-controls to restrict access to business critical devices. Your organization will need an Enterprise Agreement (EA) or Cloud Solution Provider (CSP) or a Microsoft Azure Sponsorship subscription to configure and manage the device: 

Azure Stack Edge service is protected by the Azure security features as a management service hosted in Azure. You can get the encryption key for your resource in Device properties for any software development kit management operations, but can view the encryption key only if you have the appropriate permissions for the Resource Graph API.

The Azure Stack Edge Pro device is an on-premises device that helps transform your data by processing it locally and then sending it to Azure. Your device:

- needs an activation key to access the Azure Stack Edge service.
- is protected at all times by a device password.
- has secure boot enabled.

- is a locked-down device. The device Baseboard Management Controller (BMC) and BIOS are password-protected. The BIOS is protected by limited user-access.
- runs Windows Defender Device Guard. Device Guard lets you run only trusted applications that you define in your code-integrity policies.

Follow the best practices to protect all credentials and secrets used to access Azure Stack Edge. 

- [Password best practices](azure-stack-edge-security.md#protect-the-device-via-password)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-3: Review and reconcile user access regularly

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40439).

**Guidance**: Azure
Stack Edge has a user named 'EdgeUser' that can configure the device. It also
has Azure Resource Manager user 'EdgeArmUser' for the local Azure Resource
Manager features on the device. 

Best practices should be followed to protect
the:

- Credentials used to
access the on-premises device

- SMB share credentials.

- Access to client
systems that have been configured to use NFS shares.

- Local storage account
keys used to access the local storage accounts when using the Blob REST API.

Additional information is available at the referenced link.

- [Information on security for your Azure Stack Edge devices](azure-stack-edge-security.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-4: Set up emergency access in Azure AD

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40440).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not
applicable; Azure Stack Edge does not require any emergency accounts for its operations.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-5: Automate entitlement management 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40441).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not
applicable; Azure Stack Edge does not support any account or
role-management automation.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-6: Use privileged access workstations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40442).

**Guidance**: Secured and isolated workstations are critically important for the security of sensitive roles like administrators, developers, and critical service operators. Use highly secured user workstations with or without Azure Bastion for administrative tasks. Use Azure Active Directory (Azure AD), Microsoft Defender Advanced Threat Protection (ATP), and Microsoft Intune to deploy a secure and managed user workstation for administrative tasks. 

The secured workstations can be centrally managed to enforce secured configuration including strong authentication, software and hardware baselines, restricted logical and network access.

- [Understand privileged access workstations](/azure/active-directory/devices/concept-azure-managed-workstation) 

- [Deploy a privileged access workstation](/azure/active-directory/devices/howto-azure-managed-workstation)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PA-7: Follow just enough administration (least privilege principle) 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40443).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Azure
Stack Edge users possess Just Enough Administration (JEA) access needed to perform their
tasks. There is no need for full windows administrator access. 

You
can remotely connect to the PowerShell interface of  the Azure Stack Edge device. Remote management is also configured to use Just Enough Administration to
limit what the users can do. You can then provide the device password to sign
in to the device. 

- [Connect remotely to your Azure Stack Edge device](azure-stack-edge-gpu-connect-powershell-interface.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### PA-8: Choose approval process for Microsoft support  

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40499).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable. Azure Stack Edge is not integrated with Customer Lockbox. You can still gather and download a support package for your Azure Stack Edge device with the local user interface (UI). 

- [Gather a support package for Azure Stack Edge](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](/azure/security/benchmarks/security-controls-v2-data-protection).*

### DP-1: Discovery, classify and label sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40451).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not Applicable; Azure
Stack Edge does not offer capabilities to discover, classify, and label sensitive data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-2: Protect sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40452).

**Guidance**: Azure
Stack Edge treats all interacted data as sensitive with only authorized users having access to this data. You should follow best practices to protect the credentials used to
access Azure Stack Edge service.

- [Azure Stack Edge Pro security and data protection](azure-stack-edge-security.md#protect-the-device-via-password)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### DP-3: Monitor for unauthorized transfer of sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40453).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure
Stack Edge does not monitor for unauthorized transfer of sensitive data. You could choose to set up Azure Storage Advanced Threat Protection (ATP) to alert you on any unauthorized transfers of sensitive information from your Azure Storage account.

- [Enable Azure Storage ATP](https://docs.microsoft.com/azure/storage/common/storage-advanced-threat-protection?tabs=azure-security-center)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-4: Encrypt sensitive information in transit

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40454).

**Guidance**: Azure
Stack Edge uses secure channels for data in flight. These are:

- Standard TLS 1.2 is used for data that travels between the device and Azure cloud. There is no fallback to TLS 1.1 and earlier. Agent communication will be blocked if TLS 1.2 isn't supported. TLS 1.2 is also required for Azure portal and  software development kit (SDK) management.

- When clients access your device through the local web user interface of a browser, standard TLS 1.2 is used as the default secure protocol

The best practice is to configure your browser to use TLS 1.2. Use SMB 3.0 with encryption to protect data when you copy it from your data servers.

- [Best practices to protect data in flight](azure-stack-edge-security.md#protect-data-in-flight)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### DP-5: Encrypt sensitive data at rest

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40455).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: All
the data at rest on the Azure Stack Edge device is encrypted using AES 256-bit encryption. Access to data-at-rest, such as file shares, is restricted to:

- SMB clients that access share data need user credentials associated with the share. These credentials are defined when the share is created.

- The IP addresses of NFS clients that access a share need to be added when the share is created.

- BitLocker XTS-AES 256-bit encryption is used to protect local data.

Review additional information available at the referenced link.

- [Protect data at rest for Azure Stack Edge devices](azure-stack-edge-pro-r-security.md#protect-data-at-rest)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](/azure/security/benchmarks/security-controls-v2-asset-management).*

### AM-1: Ensure security team has visibility into risks for assets

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40473).

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions so they can monitor for security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. That said, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Note that additional permissions might be required to get visibility into workloads and services. 

- [Overview of Security Reader Role](../role-based-access-control/built-in-roles.md#security-reader)

- [Overview of Azure Management Groups](../governance/management-groups/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-2: Ensure security team has access to asset inventory and metadata

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40474).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Stack Edge devices allows you to create local VMs on these devices using your own custom images but there is no corresponding inventory and metadata tracking.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### AM-3: Use only approved Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40475).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Stack Edge does not have a specialized asset management process. Users can follow the standard Azure Security Benchmark practice to manage the approved Azure services.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### AM-4: Ensure security of asset lifecycle management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40476).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: All
Azure Stack Edge security settings are pre-configured and cannot be modified. These security settings are
maintained through updates.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### AM-5: Limit users' ability to interact with Azure Resource Manager

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40477).

**Guidance**: Only authorized users, for example, the 'EdgeArmUser' can access the Azure Stack Edge device APIs via the local Azure Resource Manager. User account passwords can only be managed at the Azure portal. 

- [Set Azure Resource Manager password](azure-stack-edge-j-series-set-azure-resource-manager-password.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-6: Use only approved applications in compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40478).

**Guidance**: You can bring in your own applications to run on any locally created virtual machines. Use PowerShell scripts to create local compute virtual machines on your Stack Edge device. We strongly recommend that you bring in only trusted applications to run on the local virtual machines. 

- [How to control PowerShell script execution in Windows environment](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7.1&amp;viewFallbackFrom=powershell-6&amp;preserve-view=true)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](/azure/security/benchmarks/security-controls-v2-logging-threat-protection).*

### LT-1: Enable threat detection for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40456).

**Guidance**: Azure Stack Edge does not offer threat detection capabilities. However, customers can collect audit logs in a support package for offline threat detection and analysis. 

- [Collect support package for Azure Stack Edge device](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### LT-2: Enable threat detection for Azure identity and access management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40457).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not Applicable; Azure Stack Edge does not support authentication or authorization via Azure Active Directory (Azure AD) for control or data plane-level actions.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-3: Enable logging for Azure network activities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40458).

**Guidance**: Azure Stack Edge has network audit logs enabled as part of the downloadable support package. These logs can be parsed to implement a semi-real time monitoring for your Azure Stack Edge devices.

- [Azure Stack Edge gather a support package](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-4: Enable logging for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40459).

**Guidance**: Real-time monitoring with logs is currently not supported for Azure Stack Edge. A capability to gather a support package exists that allows you to analyze the various logs included in it, such as firewall, software, hardware intrusion and system event logs for your Azure Stack Edge Pro device. Note that the software intrusion or the default firewall logs are collected for inbound and outbound traffic.

- [Gather a support package for Azure Stack Edge](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### LT-5: Centralize security log management and analysis

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40460).

**Guidance**: Real-time monitoring with logs is currently not supported for Azure Stack Edge. However, you can gather a support package that allows you to analyze the various logs included in it.  The support package is compressed and is downloaded to the path of your choice. Unzip the package and the view the system log files contained in it. You can also send these logs into a security information event management tool or another central storage location for analysis.

- [Gather a support package for Azure Stack Edge](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-6: Configure log storage retention

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40461).

**Guidance**: Log storage retention period cannot be changed at the Azure Stack Edge device. Older logs are purged as needed. You can gather support packages from the device at periodic intervals for any requirements to retain the logs for a longer period of time. 

- [Gather a support package for Azure Stack Edge](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-7: Use approved time synchronization sources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40462).

**Guidance**: Azure Stack Edge uses time.windows.com, a network time provider server by Microsoft.  Azure Stack Edge also allows customer to configure the network time protocol server of their choosing.

- [Configure Azure Stack Edge device time settings](azure-stack-edge-gpu-deploy-set-up-device-update-time.md#configure-time)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](/azure/security/benchmarks/security-controls-v2-incident-response).*

### IR-1: Preparation – update incident response process for Azure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40463).

**Guidance**: Ensure your organizational incident response plan includes processes: 

- to respond to security incidents

- which have been updated for Azure cloud
 
- are regularly exercised to ensure readiness

It is recommended to implement security using standardized incident response processes across the enterprise environment.

- [Implement security across the enterprise environment](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Incident response reference guide](/microsoft-365/downloads/IR-Reference-Guide.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-2: Preparation – setup incident notification

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40464).

**Guidance**: Set up security incident contact information in Azure Security Center. This contact information is used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs. 

- [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IR-3: Detection and analysis – create incidents based on high-quality alerts 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40465).

**Guidance**: Ensure you have a process to create high-quality alerts and to measure their quality. This allows you to learn lessons from past incidents and prioritize alerts for analysts, to prevent wasted time processing false positive alerts. Build high-quality alerts based on your experiences from past incidents, validated community sources and tools designed to generate and clean up alerts with logging and correlation for diverse alert sources. 

Azure Security Center provides high-quality alerts across many Azure assets. You can use the Security Center data connector to stream the alerts to Azure Sentinel. Create advanced alert rules with Azure Sentinel to generate automatic incidents for an investigation. 

Export your Security Center alerts and recommendations into Azure Sentinel with the export feature to help identify risks to Azure resources. It is recommended to create a process to export alerts and recommendations in an automated fashion for continuous security.

- [How to configure export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-4: Detection and analysis – investigate an incident

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40466).

**Guidance**: Ensure analysts can query and use diverse data sources to build a full view of the activity that occurred while investigating potential incidents. Diverse log types should be collected to track the activities of a potential attacker across the kill chain to avoid blind spots.  Also ensure insights and learnings are captured for historical reference.  

The data sources for investigation include the centralized logging sources that are already being collected from the in-scope services and running systems, but can also include:

- Network data – use network security groups' flow logs, Azure Network Watcher, and Azure Monitor to capture network flow logs and other analytics information. 

- Snapshots of running systems: 

    - Use Azure virtual machine's snapshot capability to create a snapshot of the running system's disk. 

    - Choose the operating system's native memory dump capability to create a snapshot of the running system's memory.

    - Use the snapshot feature of the Azure services or a third-party software capability to create snapshots of the running systems.

Azure Sentinel provides extensive data analytics across virtually any log source and a case management portal to manage the full lifecycle of incidents. Intelligence information during an investigation can be associated with an incident for tracking and reporting purposes. 

- [Snapshot a Windows machine's disk](../virtual-machines/windows/snapshot-copy-managed-disk.md)

- [Snapshot a Linux machine's disk](../virtual-machines/linux/snapshot-copy-managed-disk.md)

- [Microsoft Azure Support diagnostic information and memory dump collection](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) 

- [Investigate incidents with Azure Sentinel](../sentinel/tutorial-investigate-cases.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-5: Detection and analysis – prioritize incidents

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40467).

**Guidance**: Provide context to analysts on which incidents to focus on first based on alert severity and asset sensitivity. Use the assigned a severity to each alert from Azure Security Center to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark resources using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-6: Containment, eradication and recovery – automate the incident handling

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40468).

**Guidance**: Automate manual repetitive tasks to speed up response time and reduce the burden on analysts. Manual tasks take longer to execute, slowing each incident and reducing how many incidents an analyst can handle. Manual tasks also increase analyst fatigue, which increases the risk of human error that causes delays, and degrades the ability of analysts to focus effectively on complex tasks. 
Use workflow automation features in Azure Security Center and Azure Sentinel to automatically trigger actions or run a playbook to respond to incoming security alerts. The playbook takes actions, such as sending notifications, disabling accounts, and isolating problematic networks. 

- [Configure workflow automation in Security Center](../security-center/workflow-automation.md)

- [Set up automated threat responses in Azure Security Center](../security-center/tutorial-security-incident.md#triage-security-alerts)

- [Set up automated threat responses in Azure Sentinel](../sentinel/tutorial-respond-threats-playbook.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](/azure/security/benchmarks/security-controls-v2-vulnerability-management).*

### PV-1: Establish secure configurations for Azure services 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40483).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Microsoft sets secure configuration for the Azure
Stack Edge device and maintains those settings
through the lifetime of the device.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### PV-2: Sustain secure configurations for Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40484).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: The user-defined security configurations are limited in the Azure Edge Stack device. Most device security settings are not configurable and stay up-to-date with installation of the latest updates. 
- [Apply updates on your Azure Stack Edge device](azure-stack-edge-gpu-install-update.md)

- [Protect data in Edge local shares](azure-stack-edge-gpu-prepare-device-failure.md#protect-data-in-edge-local-shares)

- [Protect files and folders in virtual machines](azure-stack-edge-gpu-prepare-device-failure.md#protect-files-and-folders-on-vms)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### PV-3: Establish secure configurations for compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40485).

**Guidance**: Azure Stack Edge does offer support to create secure configurations for the local virtual machines which are created by the customers. It is strongly recommended to use Microsoft provided guidelines to establish security baselines while creating local virtual machines,

- [Download the security baselines included in the Security compliance toolkit](/windows/security/threat-protection/windows-security-baselines)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PV-4: Sustain secure configurations for compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40486).

**Guidance**: Azure Stack Edge does not offer any support to sustain secure configurations for the local virtual machines which have been created by the customers. It is strongly recommended that customers use the Security compliance toolkits (SCT) to help sustain secure configurations for their compute resources.

Host operating system and virtual machines managed by Azure Stack Edge maintain their security configurations. 

- [Windows security baselines](/windows/security/threat-protection/windows-security-baselines#using-security-baselines-in-your-organization)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### PV-5: Securely store custom operating system and container images

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40487).

**Guidance**: Host operating systems and virtual machines managed by Azure Stack Edge are stored securely. 

Customers can bring their own virtual machine and containers images and are responsible for their secure management.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PV-6: Perform software vulnerability assessments

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40488).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Software vulnerability assessments are performed against all Azure Stack Edge releases including software development lifecycle reviews conducted for them. Any issues found are remediated based on their severity and priority.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### PV-7: Rapidly and automatically remediate software vulnerabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40489).

**Guidance**: Azure Stack Edge provides regular patch updates and alerts customers when such updates are available to remediate vulnerabilities. It is the customer's responsibility to keep their devices and virtual machines (created by them) up-to-date with the latest patches.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PV-8: Conduct regular attack simulation

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40490).

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.
Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../security/fundamentals/pen-testing.md)

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Endpoint Security

*For more information, see the [Azure Security Benchmark: Endpoint Security](/azure/security/benchmarks/security-controls-v2-endpoint-security).*

### ES-1: Use Endpoint Detection and Response (EDR)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40469).

**Guidance**: Azure Stack Edge does not support endpoint detection and response (EDR) directly. However, you can collect a support package and retrieve audit logs. These logs can then be analyzed to check for anomalous activities. 

- [Collect support package for Azure Stack Edge device](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### ES-2: Use centrally managed modern anti-malware software

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40470).

**Guidance**: Azure Stack Edge uses Windows Defender Application Control (WDAC) with a strict code integrity (CI) Policy that only allows predetermined applications and scripts to be run. Windows Defender Real Time Protection (RTP) anti-malware is also enabled. Customer may choose to run anti-malware in the compute VMs they create to run locally on Azure Stack Edge device.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### ES-3: Ensure anti-malware software and signatures are updated

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40471).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Azure Stack Edge keeps the code integrity (CI) Policy updated as well as updates Windows Defender signature files.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

## Backup and Recovery

*For more information, see the [Azure Security Benchmark: Backup and Recovery](/azure/security/benchmarks/security-controls-v2-backup-recovery).*

### BR-1: Ensure regular automated backups

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40479).

**Guidance**: Periodic backups of your Azure Stack Edge device are recommended and can be performed with Azure Backup and other third-party data protection solutions to protect the data contained in the virtual machines deployed on the device. 

Third-party data protection solutions such as Cohesity, Commvault and Veritas can also provide a backup solution for the data in the local SMB or NFS shares, . 

Additional information is available at the referenced links.

- [Prepare for a device failure](azure-stack-edge-gpu-prepare-device-failure.md)

- [Protect files and folders on VMs](azure-stack-edge-gpu-prepare-device-failure.md#protect-files-and-folders-on-vms)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### BR-2: Encrypt backup data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40480).

**Guidance**: Ensure that your backups are protected against
attacks. This should include encryption of the backups to protect against loss
of confidentiality.  For more information, refer to your backup solution of choice for
details.

- [Protect data in Edge local shares](azure-stack-edge-gpu-prepare-device-failure.md#protect-data-in-edge-local-shares)

- [Protect files and folders in virtual machines](azure-stack-edge-gpu-prepare-device-failure.md#protect-files-and-folders-on-vms)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### BR-3: Validate all backups including customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40481).

**Guidance**: Periodically perform data restoration of your
backups. 

- [Recovery procedures for Azure Stack Edge](azure-stack-edge-gpu-recover-device-failure.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### BR-4: Mitigate risk of lost keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40482).

**Guidance**: Ensure all Azure Stack Edge backups including any customer-managed keys are protected in accordance with organizational best practices. Your Azure Stack Edge device is associated with an Azure Storage account, used as a destination repository for your data in Azure. 

Access to the Azure Storage account is controlled by Azure subscriptions and the two 512-bit storage access keys associated with that storage account. One of the access keys is used for authentication purposes when the Azure Stack Edge device accesses the storage account. The other key is held in reserved for periodic key rotation. Ensure  security best practices are used for key rotation.

- [Protect Azure Stack Edge device data in the Azure Storage accounts](azure-stack-edge-pro-r-security.md#protect-data-in-storage-accounts)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](/azure/security/benchmarks/security-controls-v2-governance-strategy).*

### GS-1: Define asset management and data protection strategy 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40491).

**Guidance**: Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Data classification standard in accordance with the business risks

-	Security organization visibility into risks and asset inventory 

-	Security organization approval of Azure services for use 

-	Security of assets through their lifecycle

-	Required access control strategy in accordance with organizational data classification

-	Use of Azure native and third-party data protection capabilities

-	Data encryption requirements for in-transit and at-rest use cases

-	Appropriate cryptographic standards

For more information, see the following references:
- [Azure Security Architecture Recommendation - Storage, data, and encryption](https://docs.microsoft.com/azure/architecture/framework/security/storage-data-encryption?toc=/security/compass/toc.json&amp;bc=/security/compass/breadcrumb/toc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../security/fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](https://docs.microsoft.com/azure/security/fundamentals/data-encryption-best-practices?toc=/azure/cloud-adoption-framework/toc.json&amp;bc=/azure/cloud-adoption-framework/_bread/toc.json)

- [Azure Security Benchmark - Asset management](/azure/security/benchmarks/security-benchmark-v2-asset-management)

- [Azure Security Benchmark - Data Protection](/azure/security/benchmarks/security-benchmark-v2-data-protection)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-2: Define enterprise segmentation strategy 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40498).

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
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40492).

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](/azure/security/benchmarks/security-benchmark-v2-posture-vulnerability-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-4: Align organization roles, responsibilities, and accountabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40493).

**Guidance**: Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](/azure/cloud-adoption-framework/security/security-top-10#1-people-educate-teams-about-the-cloud-security-journey)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](/azure/cloud-adoption-framework/security/security-top-10#2-people-educate-teams-on-cloud-security-technology)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-5: Define network security strategy

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40494).

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

- [Azure network security overview](../security/fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-6: Define identity and privileged access strategy

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40495).

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

- [Azure identity management security overview](../security/fundamentals/identity-management-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40496).

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

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
