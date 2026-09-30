---

title: Azure operational security checklist
description: Review an Azure operational security checklist to help your enterprise assess identity, access, monitoring, storage, and policy considerations.
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 07/20/2026
ms.author: mbaldwin
ai-usage: ai-assisted

---

# Azure operational security checklist
Deploying a cloud application on Azure is fast, easy, and cost-effective. Before deploying an application, use a checklist to evaluate your application against a list of essential and recommended security actions.

## Introduction

Azure provides a suite of infrastructure services that you can use to deploy your applications. Azure operational security refers to the services, controls, and features available to users for protecting their data, applications, and other assets in Microsoft Azure.

To get the maximum benefit from the cloud platform, use Azure services and follow the checklist. Organizations that invest time and resources assessing the operational readiness of their applications before launch have a higher rate of satisfaction than those that don't. When you perform this work, checklists can help ensure that applications are evaluated consistently and holistically.

## Checklist

This checklist helps enterprises think through various operational security considerations as they deploy sophisticated enterprise applications on Azure. You can also use it to help build a secure cloud migration and operation strategy for your organization.

|Checklist Category| Description|
| ------------ | -------- |
| [<br>Security roles and access controls](/azure/defender-for-cloud/defender-for-cloud-planning-and-operations-guide)|<ul><li>Use [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md) to assign permissions to users, groups, and applications at a specific scope.</li></ul> |
| [<br>Data protection and storage](../../storage/blobs/security-recommendations.md)|<ul><li>Use management plane security to secure your storage account by using [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md).</li><li>Use data plane security to secure access to your data by using [Shared Access Signatures (SAS)](../../storage/common/storage-sas-overview.md) and stored access policies.</li><li>Use transport-level encryption by using HTTPS and the encryption provided by [Server Message Block (SMB) 3.0](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) for [Azure file shares](../../storage/files/storage-dotnet-how-to-use-files.md).</li><li>Use [Client-side encryption](../../storage/blobs/client-side-encryption.md) to secure data that you send to storage accounts when you require sole control of encryption keys.</li><li>Use [Storage Service Encryption (SSE)](../../storage/common/storage-service-encryption.md) to automatically encrypt data in Azure Storage, and [Azure Disk Encryption for Linux VMs](/azure/virtual-machines/linux/disk-encryption-overview) and [Azure Disk Encryption for Windows VMs](/azure/virtual-machines/windows/disk-encryption-overview) to encrypt virtual machine disk files for the OS and data disks.</li><li>Use Azure [Storage Analytics](/rest/api/storageservices/storage-analytics) to monitor authorization type. As with Blob Storage, you can see whether users used a shared access signature or the storage account keys.</li><li>Use [Cross-Origin Resource Sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services) to access storage resources from different domains.</li></ul> |
|[<br>Security policies and recommendations](/azure/defender-for-cloud/defender-for-cloud-planning-and-operations-guide#security-policies-and-recommendations)|<ul><li>Use [Microsoft Defender for Cloud](/azure/defender-for-cloud/integration-defender-for-endpoint) to deploy endpoint solutions.</li><li>Add a [web application firewall (WAF)](../../web-application-firewall/overview.md) to secure web applications.</li><li>Use [Azure Firewall](../../firewall/overview.md) to increase your security protections.</li><li>Apply security contact details for your Azure subscription. The [Microsoft Security Response Center (MSRC)](https://www.microsoft.com/msrc) contacts you if it discovers that an unlawful or unauthorized party accessed your customer data.</li></ul> |
| [<br>Identity and access management](identity-management-best-practices.md)|<ul><li>[Synchronize your on-premises directory with your cloud directory by using Microsoft Entra ID](/entra/identity/hybrid/whatis-hybrid-identity).</li><li>Use [single sign-on](/entra/identity/enterprise-apps/what-is-single-sign-on) to enable users to access their SaaS applications based on their organizational account in Microsoft Entra ID.</li><li>Use the [password reset registration activity](/entra/identity/authentication/howto-sspr-reporting) report to monitor the users who are registering.</li><li>Enable [multifactor authentication (MFA)](/entra/identity/authentication/concept-mfa-howitworks) for users.</li><li>Use secure identity capabilities for apps, such as [Microsoft Security Development Lifecycle (SDL)](https://www.microsoft.com/securityengineering/sdl/).</li><li>Actively monitor for suspicious activities by using Microsoft Entra ID P1 or P2 anomaly reports and [Microsoft Entra ID Protection capability](/entra/id-protection/overview-identity-protection).</li></ul> |
|[<br>Ongoing security monitoring](/azure/defender-for-cloud/defender-for-cloud-introduction)|<ul><li>Use the Malware Assessment Solution in [Azure Monitor logs](/azure/azure-monitor/logs/log-query-overview) to report on the status of antimalware protection in your infrastructure.</li><li>Use [Update Management](../../update-manager/overview.md) to determine the overall exposure to potential security problems, and whether or how critical these updates are for your environment.</li><li>The [Microsoft Entra admin center](/entra/fundamentals/entra-admin-center) provides visibility into the integrity and security of your organization's directory.</li></ul> |
| [<br>Microsoft Defender for Cloud detection capabilities](/azure/defender-for-cloud/alerts-overview)|<ul><li>Use [Cloud Security Posture Management (CSPM)](/azure/defender-for-cloud/concept-cloud-security-posture-management) for hardening guidance that helps you efficiently and effectively improve your security.</li><li>Use [alerts](/azure/defender-for-cloud/alerts-overview) to be notified when threats are identified in your cloud, hybrid, or on-premises environment.</li><li>Use [security policies, initiatives, and recommendations](/azure/defender-for-cloud/security-policy-concept) to improve your security posture.</li></ul> |

## Conclusion
Many organizations have successfully deployed and operated their cloud applications on Azure. These checklists highlight essential actions that help increase the likelihood of successful deployments and frustration-free operations. Review these operational and strategic considerations for your existing and new application deployments on Azure.

## Next steps
To learn more about security in Azure, see the following articles:

* [Shared responsibility in the cloud](shared-responsibility.md)
* [End-to-end security in Azure](end-to-end.md)
* [Ransomware protection in Azure](ransomware-protection.md)
