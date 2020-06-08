---
title: Azure Security Benchmark blueprint sample controls
description: Control mapping of the Azure Security Benchmark blueprint sample to Azure Policy.
ms.date: 04/16/2020
ms.topic: sample
---
# Control mapping of the Azure Security Benchmark blueprint sample

The following article details how the Azure Blueprints Azure Security Benchmark
blueprint sample maps to the Azure Security Benchmark controls. For more
information about the controls, see [Azure Security Benchmark](../../../../security/benchmarks/overview.md).

The following mappings are to the **Azure Security Benchmark** controls. Use the navigation on the
right to jump directly to a specific control mapping. The mapped controls are implemented with an
[Azure Policy](../../../policy/overview.md) initiative. To review the complete initiative, open
**Policy** in the Azure portal and select the **Definitions** page. Then, find and select the
**\[Preview\]: Audit Azure Security Benchmark recommendations and deploy specific supporting VM
Extensions** built-in policy initiative.

> [!IMPORTANT]
> Each control below is associated with one or more [Azure Policy](../../../policy/overview.md)
> definitions. These policies may help you [assess compliance](../../../policy/how-to/get-compliance-data.md)
> with the control; however, there often is not a 1:1 or complete match between a control and one or
> more policies. As such, **Compliant** in Azure Policy refers only to the policies themselves; this
> doesn't ensure you're fully compliant with all requirements of a control. In addition, the
> compliance standard may include controls that aren't addressed by any Azure Policy definitions at
> this time. Therefore, compliance in Azure Policy is only a partial view of your overall compliance
> status. The associations between controls and Azure Policy definitions for this compliance
> blueprint sample may change over time. To view the change history, see the
> [GitHub Commit History](https://github.com/MicrosoftDocs/azure-docs/commits/master/articles/governance/blueprints/samples/azure-security-benchmark/control-mapping.md).

## 1.1 Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

- Subnets should be associated with a Network Security Group
- Adaptive Network Hardening recommendations should be applied on internet facing virtual machines
- Virtual machines should be connected to an approved virtual network
- Internet-facing virtual machines should be protected with Network Security Groups
- Service Bus should use a virtual network service endpoint
- App Service should use a virtual network service endpoint
- SQL Server should use a virtual network service endpoint
- Event Hub should use a virtual network service endpoint
- Cosmos DB should use a virtual network service endpoint
- Key Vault should use a virtual network service endpoint
- Audit unrestricted network access to storage accounts
- Storage Accounts should use a virtual network service endpoint
- Container Registry should use a virtual network service endpoint
- Virtual networks should use specified virtual network gateway
- Authorized IP ranges should be defined on Kubernetes Services
- \[Preview\]: IP Forwarding on your virtual machine should be disabled
- Internet-facing virtual machines should be protected with Network Security Groups
- Just-In-Time network access control should be applied on virtual machines
- Management ports should be closed on your virtual machines

## 1.2 Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

- Network Watcher should be enabled

## 1.3 Protect critical web applications

- Ensure WEB app has 'Client Certificates (Incoming client certificates)' set to 'On'
- CORS should not allow every resource to access your Web Applications
- CORS should not allow every resource to access your Function Apps
- CORS should not allow every resource to access your API App
- Remote debugging should be turned off for Web Applications
- Remote debugging should be turned off for Function Apps
- Remote debugging should be turned off for API Apps

## 1.4 Deny communications with known malicious IP addresses

- DDoS Protection Standard should be enabled
- Just-In-Time network access control should be applied on virtual machines
- Adaptive Network Hardening recommendations should be applied on internet facing virtual machines

## 1.5 Record network packets and flow logs

- Network Watcher should be enabled

## 1.11 Use automated tools to monitor network resource configurations and detect changes

- Deploy prerequisites to audit Windows VMs configurations in 'Security Options - Network Access'
- Show audit results from Windows VMs configurations in 'Security Options - Microsoft Network Client'
- Deploy prerequisites to audit Windows VMs configurations in 'Security Options - Network Security'
- Show audit results from Windows VMs configurations in 'Security Options - Network Security'
- Deploy prerequisites to audit Windows VMs configurations in 'Security Options - Microsoft Network Server'
- Show audit results from Windows VMs configurations in 'Security Options - Microsoft Network Server'
- Deploy prerequisites to audit Windows VMs configurations in 'Administrative Templates - Network'
- Show audit results from Windows VMs configurations in 'Administrative Templates - Network'

## 2.2 Configure central security log management

- The Log Analytics agent should be installed on virtual machines
- The Log Analytics agent should be installed on Virtual Machine Scale Sets
- Deploy prerequisites to audit Windows VMs on which the Log Analytics agent is not connected as expected
- Show audit results from Windows VMs on which the Log Analytics agent is not connected as expected
- Azure Monitor log profile should collect logs for categories 'write,' 'delete,' and 'action'
- Azure Monitor should collect activity logs from all regions
- Automatic provisioning of the Log Analytics monitoring agent should be enabled on your subscription

## 2.3 Enable audit logging for Azure resources

- Diagnostic logs in Azure Data Lake Store should be enabled
- Diagnostic logs in Logic Apps should be enabled
- Diagnostic logs in IoT Hub should be enabled
- Diagnostic logs in Batch accounts should be enabled
- Diagnostic logs in Virtual Machine Scale Sets should be enabled
- Diagnostic logs in Event Hub should be enabled
- Diagnostic logs in Search services should be enabled
- Diagnostic logs in App Services should be enabled
- Diagnostic logs in Data Lake Analytics should be enabled
- Diagnostic logs in Key Vault should be enabled
- Diagnostic logs in Service Bus should be enabled
- Diagnostic logs in Azure Stream Analytics should be enabled
- Auditing on SQL server should be enabled
- Audit diagnostic setting

## 2.4 Collect security logs from operating systems

- Automatic provisioning of the Log Analytics monitoring agent should be enabled on your subscription
- The Log Analytics agent should be installed on virtual machines
- The Log Analytics agent should be installed on Virtual Machine Scale Sets
- Deploy prerequisites to audit Windows VMs on which the Log Analytics agent is not connected as expected
- Show audit results from Windows VMs on which the Log Analytics agent is not connected as expected

## 2.7 Enable alerts for anomalous activity

- Security Center standard pricing tier should be selected
- Advanced data security should be enabled on your SQL servers
- Advanced data security should be enabled on your SQL managed instances
- Advanced Threat Protection types should be set to 'All' in SQL server Advanced Data Security settings
- Advanced Threat Protection types should be set to 'All' in SQL managed instance Advanced Data Security settings

## 2.8 Centralize anti-malware logging

- Microsoft Antimalware for Azure should be configured to automatically update protection signatures
- Monitor missing Endpoint Protection in Azure Security Center
- Endpoint protection solution should be installed on virtual machine scale sets

## 3.1 Maintain an inventory of administrative accounts

- A maximum of 3 owners should be designated for your subscription
- There should be more than one owner assigned to your subscription
- External accounts with owner permissions should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription

## 3.3 Use dedicated administrative accounts

- Deploy prerequisites to audit Windows VMs in which the Administrators group does not contain only the specified members
- Show audit results from Windows VMs in which the Administrators group does not contain only the specified members
- Deploy prerequisites to audit Windows VMs in which the Administrators group does not contain all of the specified members
- Show audit results from Windows VMs in which the Administrators group does not contain all of the specified members
- Deploy prerequisites to audit Windows VMs in which the Administrators group contains any of the specified members
- Show audit results from Windows VMs in which the Administrators group contains any of the specified members
- A maximum of 3 owners should be designated for your subscription
- There should be more than one owner assigned to your subscription

## 3.5 Use multi-factor authentication for all Azure Active Directory based access

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled accounts with write permissions on your subscription
- MFA should be enabled on accounts with read permissions on your subscription

## 3.7 Log and alert on suspicious activity from administrative accounts

- Security Center standard pricing tier should be selected

## 3.9 Use Azure Active Directory

- An Azure Active Directory administrator should be provisioned for SQL servers
- Service Fabric clusters should only use Azure Active Directory for client authentication
- Ensure that Register with Azure Active Directory is enabled on API app
- Ensure that Register with Azure Active Directory is enabled on WEB App
- Ensure that Register with Azure Active Directory is enabled on Function App

## 3.10 Regularly review and reconcile user access

- Deprecated accounts should be removed from your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with read permissions should be removed from your subscription
- External accounts with write permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription

## 4.1 Maintain an inventory of sensitive Information

- Sensitive data in your SQL databases should be classified

## 4.4 Encrypt all sensitive information in transit

- Secure transfer to storage accounts should be enabled
- Latest TLS version should be used in your API App
- Latest TLS version should be used in your Web App
- Latest TLS version should be used in your Function App
- Function App should only be accessible over HTTPS
- Web Application should only be accessible over HTTPS
- API App should only be accessible over HTTPS
- Enforce SSL connection should be enabled for MySQL database servers
- Enforce SSL connection should be enabled for PostgreSQL database servers
- Only secure connections to your Redis Cache should be enabled

## 4.5 Use an active discovery tool to identify sensitive data

- Sensitive data in your SQL databases should be classified
- Advanced data security should be enabled on your SQL servers
- Advanced data security should be enabled on your SQL managed instances

## 4.6 Use Azure RBAC to control access to resources

- Role-Based Access Control (RBAC) should be used on Kubernetes Services
- Audit usage of custom RBAC rules

## 4.8 Encrypt sensitive information at rest

- Transparent Data Encryption on SQL databases should be enabled
- Disk encryption should be applied on virtual machines
- Unattached disks should be encrypted
- SQL server TDE protector should be encrypted with your own key
- SQL managed instance TDE protector should be encrypted with your own key
- Automation account variables should be encrypted
- Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign

## 4.9 Log and alert on changes to critical Azure resources

- Azure Monitor should collect activity logs from all regions

## 5.1 Run automated vulnerability scanning tools

- Vulnerability assessment should be enabled on your SQL servers
- Vulnerability assessment should be enabled on your SQL managed instances
- \[Preview\] Vulnerability Assessment should be enabled on Virtual Machines
- Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports

## 5.2 Deploy automated operating system patch management solution

- System updates should be installed on your machines
- System updates on virtual machine scale sets should be installed
- Ensure that '.NET Framework' version is the latest, if used as a part of the Function App
- Ensure that '.NET Framework' version is the latest, if used as a part of the Web app
- Ensure that '.NET Framework' version is the latest, if used as a part of the API app

## 5.3 Deploy automated third-party software patch management solution

- Ensure that 'PHP version' is the latest, if used as a part of the Api app
- Ensure that 'PHP version' is the latest, if used as a part of the WEB app
- Ensure that 'PHP version' is the latest, if used as a part of the Function app
- Ensure that 'Java version' is the latest, if used as a part of the Web app
- Ensure that 'Java version' is the latest, if used as a part of the Function app
- Ensure that 'Java version' is the latest, if used as a part of the Api app
- Ensure that 'Python version' is the latest, if used as a part of the Web app
- Ensure that 'Python version' is the latest, if used as a part of the Function app
- Ensure that 'Python version' is the latest, if used as a part of the Api app
- Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version

## 5.5 Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

- Vulnerabilities should be remediated by a Vulnerability Assessment solution
- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerabilities on your SQL databases should be remediated

## 6.8 Use only approved applications

- Security Center standard pricing tier should be selected
- Adaptive Application Controls should be enabled on virtual machines

## 6.9 Use only approved Azure services

- Virtual machines should be migrated to new Azure Resource Manager resources
- Storage accounts should be migrated to new Azure Resource Manager resources

## 6.10 Implement approved application list

- Security Center standard pricing tier should be selected
- Adaptive Application Controls should be enabled on virtual machines

## 7.3 Maintain secure Azure resource configurations

- \[Preview\]: Pod Security Policies should be defined on Kubernetes Services

## 7.4 Maintain secure operating system configurations

- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated

## 7.9 Implement automated configuration monitoring for Azure services

- \[Preview\]: Pod Security Policies should be defined on Kubernetes Services

## 7.10 Implement automated configuration monitoring for operating systems

- Vulnerabilities in security configuration on your machines should be remediated
- Vulnerabilities in container security configurations should be remediated
- Vulnerabilities in security configuration on your virtual machine scale sets should be remediated

## 7.11 Manage Azure secrets securely

- Key Vault objects should be recoverable

## 7.12 Manage identities securely and automatically

- Managed identity should be used in your Function App
- Managed identity should be used in your Web App
- Managed identity should be used in your API App

## 8.1 Use centrally managed anti-malware software

- Monitor missing Endpoint Protection in Azure Security Center
- Endpoint protection solution should be installed on virtual machine scale sets

## 8.2 Pre-scan files to be uploaded to non-compute Azure resources

- Security Center standard pricing tier should be selected

## 8.3 Ensure anti-malware software and signatures are updated

- Microsoft Antimalware for Azure should be configured to automatically update protection signatures

## 9.1 Ensure regular automated back ups

- Long-term geo-redundant backup should be enabled for Azure SQL Databases
- Geo-redundant backup should be enabled for Azure Database for MySQL
- Geo-redundant backup should be enabled for Azure Database for PostgreSQL
- Geo-redundant backup should be enabled for Azure Database for MariaDB
- Azure Backup should be enabled for Virtual Machines

## 9.2 Perform complete system backups and backup any customer managed keys

- Long-term geo-redundant backup should be enabled for Azure SQL Databases
- Geo-redundant backup should be enabled for Azure Database for MySQL
- Geo-redundant backup should be enabled for Azure Database for PostgreSQL
- Geo-redundant backup should be enabled for Azure Database for MariaDB
- Azure Backup should be enabled for Virtual Machines

## 9.4 Ensure protection of backups and customer managed keys

- Key Vault objects should be recoverable

## 10.2 Create an incident scoring and prioritization procedure

- Security Center standard pricing tier should be selected

## 10.4 Provide security incident contact details and configure alert notifications for security incidents

- A security contact email address should be provided for your subscription
- A security contact phone number should be provided for your subscription
- Advanced data security settings for SQL server should contain an email address to receive security alerts
- Advanced data security settings for SQL managed instance should contain an email address to receive security alerts
- Email notifications to admins and subscription owners should be enabled in SQL server advanced data security settings
- Email notifications to admins and subscription owners should be enabled in SQL managed instance advanced data security settings

## Next steps

Now that you've reviewed the control mapping of the Azure Security Benchmark blueprint, visit Azure
Policy in the Azure portal to assign the initiative:

> [!div class="nextstepaction"]
> [Azure Policy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).