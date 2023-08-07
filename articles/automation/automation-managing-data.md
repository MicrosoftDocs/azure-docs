---
title: Azure Automation data security
description: This article helps you learn how Azure Automation protects your privacy and secures your data.
services: automation
ms.subservice: shared-capabilities
ms.date: 08/01/2023
ms.topic: conceptual 
ms.custom:
---

# Management of Azure Automation data

This article contains several topics explaining how data is protected and secured in an Azure Automation environment.

## TLS 1.2 or higher for Azure Automation

To ensure the security of data in transit to Azure Automation, we strongly encourage you to configure the use of Transport Layer Security (TLS) 1.2 or higher. The following are a list of methods or clients that communicate over HTTPS to the Automation service:

* Webhook calls

* Hybrid Runbook Workers, which include machines managed by Update Management and Change Tracking and Inventory.

* DSC nodes

Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable and while they still currently work to allow backwards compatibility, they are **not recommended**. We do not recommend explicitly setting your agent to only use TLS 1.2 unless its necessary, as it can break platform level security features that allow you to automatically detect and take advantage of newer more secure protocols as they become available, such as TLS 1.3.

For information about TLS 1.2 support with the Log Analytics agent for Windows and Linux, which is a dependency for the Hybrid Runbook Worker role, see [Log Analytics agent overview - TLS 1.2](..//azure-monitor/agents/log-analytics-agent.md#tls-12-protocol).

### Upgrade TLS protocol for Hybrid Workers and Webhook calls

From **30 October 2023**, all agent-based and extension-based User Hybrid Runbook Workers using Transport Layer Security (TLS) 1.0 and 1.1 protocols would no longer be able to connect to Azure Automation and all jobs running or scheduled on these machines would fail. 

Ensure that the Webhook calls that trigger runbooks navigate on TLS 1.2 or higher. Ensure to make registry changes so that Agent and Extension based workers negotiate only on TLS 1.2 and higher protocols. Learn how to [disable TLS 1.0/1.1 protocols on Windows Hybrid Worker and enable TLS 1.2 or above](https://learn.microsoft.com/system-center/scom/plan-security-tls12-config?view=sc-om-2022#configure-windows-operating-system-to-only-use-tls-12-protocol) on Windows machine. 

For Linux Hybrid Workers, run the following Python script to upgrade to the latest TLS protocol.

```python
import os

# Path to the OpenSSL configuration file as per Linux distro
openssl_conf_path = "/etc/ssl/openssl.cnf"

# Open the configuration file for reading
with open(openssl_conf_path, "r") as f:
    openssl_conf = f.read()

# Check if a default TLS version is already defined
if "DEFAULT@SECLEVEL" in openssl_conf:
    # Update the default TLS version to TLS 1.2
    openssl_conf = openssl_conf.replace("CipherString = DEFAULT@SECLEVEL", "CipherString = DEFAULT@SECLEVEL:TLSv1.2")

    # Open the configuration file for writing and write the updated version
    with open(openssl_conf_path, "w") as f:
        f.write(openssl_conf)

    # Restart any services that use OpenSSL to ensure that the new settings are applied
    os.system("systemctl restart apache2")
    print("Default TLS version has been updated to TLS 1.2.")
else:
    # Add the default TLS version to the configuration file
    openssl_conf += """
    Options = PrioritizeChaCha,EnableMiddleboxCompat
    CipherString = DEFAULT@SECLEVEL:TLSv1.2
    MinProtocol = TLSv1.2
    """

    # Open the configuration file for writing and write the updated version
    with open(openssl_conf_path, "w") as f:
        f.write(openssl_conf)

    # Restart any services that use OpenSSL to ensure that the new settings are applied
    os.system("systemctl restart apache2")
    print("Default TLS version has been added as TLS 1.2.")
```

### Platform-specific guidance

|Platform/Language | Support | More Information |
| --- | --- | --- |
|Linux | Linux distributions tend to rely on [OpenSSL](https://www.openssl.org) for TLS 1.2 support.  | Check the [OpenSSL Changelog](https://www.openssl.org/news/changelog.html) to confirm your version of OpenSSL is supported.|
| Windows 8.0 - 10 | Supported, and enabled by default. | To confirm that you are still using the [default settings](/windows-server/security/tls/tls-registry-settings).  |
| Windows Server 2012 - 2016 | Supported, and enabled by default. | To confirm that you are still using the [default settings](/windows-server/security/tls/tls-registry-settings) |
| Windows 7 SP1 and Windows Server 2008 R2 SP1 | Supported, but not enabled by default. | See the [Transport Layer Security (TLS) registry settings](/windows-server/security/tls/tls-registry-settings) page for details on how to enable.  |

## Data retention

When you delete a resource in Azure Automation, it's retained for many days for auditing purposes before permanent removal. You can't see or use the resource during this time. This policy also applies to resources that belong to a deleted Automation account. The retention policy applies to all users and currently can't be customized. However, if you need to keep data for a longer period, you can [forward Azure Automation job data to Azure Monitor logs](automation-manage-send-joblogs-log-analytics.md).

The following table summarizes the retention policy for different resources.

| Data | Policy |
|:--- |:--- |
| Accounts |An account is permanently removed 30 days after a user deletes it. |
| Assets |An asset is permanently removed 30 days after a user deletes it, or 30 days after a user deletes an account that holds the asset. Assets include variables, schedules, credentials, certificates, Python 2 packages, and connections. |
| DSC Nodes |A DSC node is permanently removed 30 days after being unregistered from an Automation account using Azure portal or the [Unregister-AzAutomationDscNode](/powershell/module/az.automation/unregister-azautomationdscnode) cmdlet in Windows PowerShell. A node is also permanently removed 30 days after a user deletes the account that holds the node. |
| Jobs |A job is deleted and permanently removed 30 days after modification, for example, after the job completes, is stopped, or is suspended. |
| Modules |A module is permanently removed 30 days after a user deletes it, or 30 days after a user deletes the account that holds the module. |
| Node Configurations/MOF Files |An old node configuration is permanently removed 30 days after a new node configuration is generated. |
| Node Reports |A node report is permanently removed 90 days after a new report is generated for that node. |
| Runbooks |A runbook is permanently removed 30 days after a user deletes the resource, or 30 days after a user deletes the account that holds the resource<sup>1</sup>. |

<sup>1</sup>The runbook can be recovered within the 30-day window by filing an Azure support incident with Microsoft Azure Support. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Submit a support request**.

## Data backup

When you delete an Automation account in Azure, all objects in the account are deleted. The objects include runbooks, modules, configurations, settings, jobs, and assets. You can [recover](delete-account.md#restore-a-deleted-automation-account) a deleted Automation account within 30 days. You can also use the following information to back up the contents of your Automation account before deleting it:

### Runbooks

You can export your runbooks to script files using either the Azure portal or the [Get-AzureAutomationRunbookDefinition](/powershell/module/servicemanagement/azure/get-azureautomationrunbookdefinition) cmdlet in Windows PowerShell. You can import these script files into another Automation account, as discussed in [Manage runbooks in Azure Automation](manage-runbooks.md).

### Integration modules

You can't export integration modules from Azure Automation, they have to be made available outside of the Automation account.

### Assets

You can't export Azure Automation assets: certificates, connections, credentials, schedules, and variables. Instead, you can use the Azure portal and Azure cmdlets to note the details of these assets. Then use these details to create any assets that are used by runbooks that you import into another Automation account.

You can't retrieve the values for encrypted variables or the password fields of credentials using cmdlets. If you don't know these values, you can retrieve them in a runbook. For retrieving variable values, see [Variable assets in Azure Automation](shared-resources/variables.md). To find out more about retrieving credential values, see [Credential assets in Azure Automation](shared-resources/credentials.md).

### DSC configurations

You can export your DSC configurations to script files using either the Azure portal or the [Export-AzAutomationDscConfiguration](/powershell/module/az.automation/export-azautomationdscconfiguration) cmdlet in Windows PowerShell. You can import and use these configurations in another Automation account.

## Data residency

You specify a region during the creation of an Azure Automation account. Service data such as assets, configuration, logs are stored in that region and may transit or be processed in other regions within the same geography. These global endpoints are necessary to provide end-users with a high-performance, low-latency experience regardless of location. Only for the Brazil South (Sao Paulo State) region of Brazil geography, Southeast Asia region (Singapore) and East Asia region (Hongkong) of the Asia Pacific geography, we store Azure Automation data in the same region to accommodate data-residency requirements for these regions.


## Next steps

* To learn about security guidelines, see [Security best practices in Azure Automation](automation-security-guidelines.md).
* To learn more about secure assets in Azure Automation, see [Encryption of secure assets in Azure Automation](automation-secure-asset-encryption.md).
* To find out more about geo-replication, see [Creating and using active geo-replication](/azure/azure-sql/database/active-geo-replication-overview).
