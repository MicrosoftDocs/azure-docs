---

title: Azure operational security checklist| Microsoft Docs
description: Review this checklist to help your enterprise think through Azure operational security considerations.
services: security
documentationcenter: na
author: terrylanfear
manager: rkarlin


ms.assetid:
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/23/2023
ms.author: terrylan

---

# Azure operational security checklist
Deploying a cloud application on Azure is fast, easy, and cost-effective. Before deploying an application, it's useful to have a checklist. A checklist can assist you in evaluating your application against a list of essential and recommended security actions.

## Introduction

Azure provides a suite of infrastructure services that you can use to deploy your applications. Azure Operational Security refers to the services, controls, and features available to users for protecting their data, applications, and other assets in Microsoft Azure.

To get the maximum benefit out of the cloud platform, we recommend that you use Azure services and follow the checklist. Organizations that invest time and resources assessing the operational readiness of their applications before launch have a higher rate of satisfaction than those that don't. When performing this work, checklists can be an invaluable mechanism to ensure that applications are evaluated consistently and holistically.

## Checklist

This checklist is intended to help enterprises think through various operational security considerations as they deploy sophisticated enterprise applications on Azure. It can also be used to help you build a secure cloud migration and operation strategy for your organization.

|Checklist Category| Description|
| ------------ | -------- |
| [<br>Security Roles & Access Controls](../../defender-for-cloud/defender-for-cloud-planning-and-operations-guide.md)|<ul><li>Use [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md) to provide user-specific that used to assign permissions to users, groups, and applications at a certain scope.</li></ul> |
| [<br>Data Protection & Storage](../../storage/blobs/security-recommendations.md)|<ul><li>Use Management Plane Security to secure your Storage Account using [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md).</li><li>Data Plane Security to Securing Access to your Data using [Shared Access Signatures (SAS)](../../storage/common/storage-sas-overview.md) and Stored Access Policies.</li><li>Use Transport-Level Encryption – Using HTTPS and the encryption used by [SMB (Server message block protocols) 3.0](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) for [Azure File Shares](../../storage/files/storage-dotnet-how-to-use-files.md).</li><li>Use [Client-side encryption](../../storage/common/storage-client-side-encryption.md) to secure data that you send to storage accounts when you require sole control of encryption keys. </li><li>Use [Storage Service Encryption (SSE)](../../storage/common/storage-service-encryption.md)  to automatically encrypt data in Azure Storage, and [Azure Disk Encryption for Linux VMs](../../virtual-machines/linux/disk-encryption-overview.md) and [Azure Disk Encryption for Windows VMs](../../virtual-machines/linux/disk-encryption-overview.md) to encrypt virtual machine disk files for the OS and data disks.</li><li>Use Azure [Storage Analytics](/rest/api/storageservices/storage-analytics) to monitor authorization type; like with Blob Storage, you can see if users have used a Shared Access Signature or the storage account keys.</li><li>Use [Cross-Origin Resource Sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services) to access storage resources from different domains.</li></ul> |
|[<br>Security Policies & Recommendations](../../defender-for-cloud/defender-for-cloud-planning-and-operations-guide.md#security-policies-and-recommendations)|<ul><li>Use [Microsoft Defender for Cloud](../../defender-for-cloud/integration-defender-for-endpoint.md) to deploy endpoint solutions.</li><li>Add a [web application firewall (WAF)](../../web-application-firewall/ag/ag-overview.md) to secure web applications.</li><li>Use [Azure Firewall](../../firewall/overview.md) to increase your security protections. </li><li>Apply security contact details for your Azure subscription. The [Microsoft Security Response Center](https://technet.microsoft.com/security/dn528958.aspx) (MSRC) contacts you if it discovers that your customer data has been accessed by an unlawful or unauthorized party.</li></ul> |
| [<br>Identity & Access Management](identity-management-best-practices.md)|<ul><li>[Synchronize your on-premises directory with your cloud directory using Azure AD](../../active-directory/hybrid/whatis-hybrid-identity.md).</li><li>Use [single sign-on](../../active-directory/manage-apps/what-is-single-sign-on.md) to enable users to access their SaaS applications based on their organizational account in Azure AD.</li><li>Use the [Password Reset Registration Activity](../../active-directory/authentication/howto-sspr-reporting.md) report to monitor the users that are registering.</li><li>Enable [multi-factor authentication (MFA)](../../active-directory/authentication/concept-mfa-howitworks.md) for users.</li><li>Developers to use secure identity capabilities for apps like [Microsoft Security Development Lifecycle (SDL)](https://www.microsoft.com/download/details.aspx?id=12379).</li><li>Actively monitor for suspicious activities by using Azure AD Premium anomaly reports and [Azure AD identity protection capability](../../active-directory/identity-protection/overview-identity-protection.md).</li></ul> |
|[<br>Ongoing Security Monitoring](../../defender-for-cloud/defender-for-cloud-introduction.md)|<ul><li>Use Malware Assessment Solution [Azure Monitor logs](../../azure-monitor/logs/log-query-overview.md) to report on the status of antimalware protection in your infrastructure.</li><li>Use [Update Management](../../automation/update-management/overview.md) to determine the overall exposure to potential security problems, and whether or how critical these updates are for your environment.</li><li>The [Microsoft Entra admin center](https://entra.microsoft.com) provides visibility into the integrity and security of your organization's directory. |
| [<br>Microsoft Defender for Cloud detection capabilities](../../security-center/security-center-alerts-overview.md#detect-threats)|<ul><li>Use [Cloud Security Posture Management](../../defender-for-cloud/concept-cloud-security-posture-management.md) (CSPM) for hardening guidance that helps you efficiently and effectively improve your security.</li><li>Use [alerts](../../defender-for-cloud/alerts-overview.md) to be notified when threats are identified in your cloud, hybrid, or on-premises environment. </li><li>Use [security policies, initiatives, and recommendations](../../defender-for-cloud/security-policy-concept.md) to improve your security posture.</li></ul> |

## Conclusion
Many organizations have successfully deployed and operated their cloud applications on Azure. The checklists provided highlight several checklists that are essential and help you to increase the likelihood of successful deployments and frustration-free operations. We highly recommend these operational and strategic considerations for your existing and new application deployments on Azure.

## Next steps
To learn more about security in Azure, see the following articles:

* [Shared responsibility in the cloud](shared-responsibility.md).
* [End-to-end security in Azure](end-to-end.md).
* [Ransomware protection in Azure](ransomware-protection.md)
