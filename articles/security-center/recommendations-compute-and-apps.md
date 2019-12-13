---
title: Azure Security Center recommendations for machines & apps
description: Azure Security Center's security recommendations that help you protect your virtual machines, computers, web apps, and App Service environments.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 47fa1f76-683d-4230-b4ed-d123fef9a3e8
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/28/2019
ms.author: memildin

---

# Compute and app recommendations - reference guide

This article provides the full list of the recommendations you might see in Azure Security Center regarding the following resource types:

* VMs and computers
* VM Scale Sets
* Cloud Services
* App services
* Containers
* Compute resources

For an explanation of how to find these and how to resolve them, see [here](security-center-virtual-machine-protection.md).

## Compute and app recommendations <a name="compute-and-app-recs"></a>
|Resource type|Secure score|Recommendation|Description|
|----|----|----|----|
|App service|20|Web Application should only be accessible over HTTPS|Limit access of Web Applications over HTTPS only.|
|App service|20|Function App should only be accessible over HTTPS|Limit access of Function Apps over HTTPS only.|
|App service|5|Diagnostics logs in App Services should be enabled|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|App service|10|Remote debugging should be turned off for Web Application|Turn off debugging for Web Applications if you no longer need to use it. Remote debugging requires inbound ports to be opened on a Function App.|
|App service|10|Remote debugging should be turned off for Function Application|Turn off debugging for Function App if you no longer need to use it. Remote debugging requires inbound ports to be opened on a Function App.|
|App service|10|Do not allow all ('*') resources to access your application| Do not allow set of WEBSITE_LOAD_CERTIFICATES parameter to "". Setting the parameter to ‘’ means that all certificates are loaded to your web applications personal certificate store. This can lead to abuse of the principle of least privilege as it is unlikely that the site needs access to all certificates at runtime.|
|App service|20|CORS should not allow every resource to access your Web applications|Allow only required domains to interact with your web application. Cross origin resource sharing (CORS) should not allow all domains to access your web application.|
|App service|20|CORS should not allow every resource to access your Function App| Allow only required domains to interact with your function application. Cross origin resource sharing (CORS) should not allow all domains to access your function application.|
|Compute resources (batch)|1|Metric alert rules should be configured on Batch accounts|Configure metric alert rules on Batch account and enable the metrics Pool Delete Complete Events and Pool Delete Start Events|
|Compute resources (service fabric)|10|Service Fabric clusters should only use Azure Active Directory for client authentication|Perform Client authentication only via Azure Active Directory in Service Fabric.|
|Compute resources (automation account)|5|Automation account variables should be encrypted|Enable encryption of Automation account variable assets when storing sensitive data.|
|Compute resources (search)|5|Audit enabling of diagnostic logs for Search services|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (service bus)|5|Diagnostics logs in Service Bus should be enabled|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (stream analytics)|5|Diagnostics logs in Azure Stream Analytics should be enabled|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (batch)|5|Enable diagnostic logs in Batch accounts|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (event hub)|5|Diagnostics logs in Event Hub should be enabled|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (logic apps)|5|Enable diagnostics logs in Logic Apps|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (service fabric)|15|Set the ClusterProtectionLevel property to EncryptAndSign in Service Fabric|Service Fabric provides three levels of protection (None, Sign and EncryptAndSign) for node-to-node communication using a primary cluster certificate. Set the protection level to ensure that all node-to-node messages are encrypted and digitally signed. |
|Compute resources (service bus)|1|Remove all authorization rules except RootManageSharedAccessKey from Service Bus namespace |Service Bus clients should not use a namespace level access policy that provides access to all queues and topics in a namespace. To align with the least privilege security model, you should create access policies at the entity level for queues and topics to provide access to only the specific entity.|
|Compute resources (event hub)|1|All authorization rules except RootManageSharedAccessKey should be removed from Event Hub namespace|Event Hub clients should not use a namespace level access policy that provides access to all queues and topics in a namespace. To align with the least privilege security model, you should create access policies at the entity level for queues and topics to provide access to only the specific entity.|
|Compute resources (event hub)|5|Authorization rules on the Event Hub entity should be defined|Audit authorization rules on the Event Hub entity to grant least-privileged access.|
|Machine|50|Install monitoring agent on your machines|Install the Monitoring agent to enable data collection, updates scanning, baseline scanning, and endpoint protection on each machine.|
|Machine|50|Enable automatic provisioning and data collection for your subscriptions |Enable automatic provisioning and data collection for machines in your subscriptions to enable data collection, updates scanning, baseline scanning, and endpoint protection on each machine added to your subscriptions.|
|Machine|40|Resolve monitoring agent health issues on your machines|For full Security Center protection, resolve monitoring agent issues on your machines by following the instructions in the Troubleshooting guide| 
|Machine|40|Resolve endpoint protection health issues on your machines|For full Security Center protection, resolve monitoring agent issues on your machines by following the instructions in the Troubleshooting guide.|
|Machine|40|Troubleshoot missing scan data on your machines|Troubleshoot missing scan data on virtual machines and computers. Missing scan data on your machines results in missing security assessments such as update scanning, baseline scanning, and missing endpoint protection solution scanning.|
|Machine|40|System updates should be installed on your machines|Install missing system security and critical updates to secure your Windows and Linux virtual machines and computers
|Machine|15|Add a web application firewall| Deploy a web application firewall (WAF) solution to secure your web applications. |
|Machine|40|Update OS version for your cloud service roles|Update the operating system (OS) version for your cloud service roles to the most recent version available for your OS family.|
|Machine|35|Vulnerabilities in security configuration on your machines should be remediated|Remediate vulnerabilities in security configuration on your machines to protect them from attacks.|
|Machine|35|Remediate vulnerabilities in security configuration on your containers|Remediate vulnerabilities in security configuration on machines with Docker installed to protect them from attacks.|
|Machine|25|Enable Adaptive Application Controls|Enable application control to control which applications can run on your VMs located in Azure. This will help harden your VMs against malware. Security Center uses machine learning to analyze the applications running on each VM and helps you apply allow rules using this intelligence. This capability simplifies the process of configuring and maintaining application allow rules.|
|Machine|20|Install endpoint protection solution on your machines|Install an endpoint protection solution on your virtual machines, to protect them from threats and vulnerabilities.|
|Machine|20|Restart your machines to apply system updates|Restart your machines to apply the system updates and secure the machine from vulnerabilities.|
|Machine|15|Disk encryption should be applied on virtual machines|Encrypt your virtual machine disks using Azure Disk Encryption both for Windows and Linux virtual machines. Azure Disk Encryption (ADE) leverages the industry standard BitLocker feature of Windows and the DM-Crypt feature of Linux to provide OS and data disk encryption to help protect and safeguard your data and help meet your organizational security and compliance commitments in customer Azure key vault. When your compliance and security requirement requires you to encrypt the data end to end using your encryption keys, including encryption of the ephemeral (locally attached temporary) disk, use Azure disk encryption. Alternatively, by default, Managed Disks are encrypted at rest by default using Azure Storage Service Encryption where the encryption keys are Microsoft managed keys in Azure. If this meets your compliance and security requirements, you can leverage the default Managed disk encryption to meet your requirements.|
|Machine|30|Install a vulnerability assessment solution on your virtual machines|Install a vulnerability assessment solution on your virtual machines|
|Machine|30|Vulnerabilities should be remediated by a Vulnerability Assessment solution|Virtual machines for which a vulnerability assessment 3rd party solution is deployed are being continuously assessed against application and OS vulnerabilities. Whenever such vulnerabilities are found, these are available for more information as part of the recommendation.|
|Machine|30|Install a vulnerability assessment solution on your virtual machines|Install a vulnerability assessment solution on your virtual machines|
|Machine|1|Virtual machines should be migrated to new AzureRM resources|Use Azure Resource Manager for your virtual machines to provide security enhancements such as: stronger access control (RBAC), better auditing, Resource Manager-based deployment and governance, access to managed identities, access to key vault for secrets, Azure AD-based authentication and support for tags and resource groups for easier security management. |
|Machine|30|Vulnerabilities should be remediated by a Vulnerability Assessment solution|Virtual machines for which a vulnerability assessment 3rd party solution is deployed are being continuously assessed against application and OS vulnerabilities. Whenever such vulnerabilities are found, these are available for more information as part of the recommendation.|
|Virtual machine scale set |4|Diagnostics logs in Virtual Machine Scale Sets should be enabled|Enable logs and retain them for up to a year. This enables you to recreate activity trails for investigation purposes. This is useful when a security incident occurs, or your network is compromised.|
|Virtual machine scale set|35|Vulnerabilities in security configuration on your virtual machine scale sets should be remediated|Remediate vulnerabilities in security configuration on your virtual machine scale sets to protect them from attacks. |
|Virtual machine scale set|5|Remediate endpoint protection health failures on virtual machine scale sets|Remediate endpoint protection health failures on your virtual machine scale sets to protect them from threats and vulnerabilities. |
|Virtual machine scale set|10|Endpoint protection should be installed on virtual machines|Install an endpoint protection solution on your virtual machine scale sets, to protect them from threats and vulnerabilities. |
|Virtual machine scale set|40|System updates on virtual machine scale sets should be installed|Install missing system security and critical updates to secure your Windows and Linux virtual machine scale sets. |
|


## Next steps
To learn more about recommendations that apply to other Azure resource types, see the following:

* [Monitor identity and access in Azure Security Center](security-center-identity-access.md)
* [Protecting your network in Azure Security Center](security-center-network-recommendations.md)
* [Protecting your Azure SQL service in Azure Security Center](security-center-sql-service-recommendations.md)
