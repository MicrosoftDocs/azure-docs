---
title: Azure Security Center's advanced data security for SQL machines (Preview)
description: Learn how to enable advanced data security for SQL machines in Azure Security Center
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin

ms.assetid: ba46c460-6ba7-48b2-a6a7-ec802dd4eec2
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/28/2020
ms.author: memildin
---

# Advanced data security for SQL machines (Preview)

Azure Security Center's advanced data security for SQL machines protects SQL Servers hosted in Azure, on other cloud environments, and even on-premises machines. This extends the protections for your Azure-native SQL Servers to fully support hybrid environments.

This preview feature includes functionality for identifying and mitigating potential database vulnerabilities and detecting anomalous activities that could indicate threats to your database: 

* **Vulnerability assessment** - The scanning service to discover, track, and help you remediate potential database vulnerabilities. Assessment scans provide an overview of your SQL machines' security state, and details of any security findings.

* [Advanced Threat Protection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview) - The detection service that continuously monitors your SQL servers for threats such as SQL injection, brute-force attacks, and privilege abuse. This service provides action-oriented security alerts in Azure Security Center with details of the suspicious activity, guidance on how to mitigate to the threats, and options for continuing your investigations with Azure Sentinel.

>[!TIP]
> Advanced data security for SQL machines is an extension of Azure Security Center's [advanced data security package](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security), already available for Azure SQL Databases, Synapse, and SQL Managed Instances.


## Set up advanced data security for SQL machines 

Setting up Azure Security Center's advanced data security for SQL machines involves two steps:

* Provision the Log Analytics agent on your SQL server's host. This provides the connection to Azure.

* Enable the optional bundle in Security Center's pricing and settings page.

Both of these are described below.

### Step 1. Provision the Log Analytics agent on your SQL server's host:

- **SQL Server on Azure VM** - If your SQL machine is hosted on an Azure VM, you can [auto provision the  Log Analytics agent](security-center-enable-data-collection.md#workspace-configuration). Alternatively, you can follow the manual procedure for [adding an Azure VM](quick-onboard-azure-stack.md#add-the-virtual-machine-extension-to-your-existing-azure-stack-virtual-machines).

- **SQL Server on Azure Arc** - If your SQL Server is hosted on an [Azure Arc](https://docs.microsoft.com/azure/azure-arc/) machine, you can deploy the Log Analytics agent using the Security Center recommendation “Log Analytics agent should be installed on your Windows-based Azure Arc machines (Preview)”. Alternatively, you can follow the manual procedure in the [Azure Arc documentation](https://docs.microsoft.com/azure/azure-arc/servers/manage-vm-extensions#enable-extensions-from-the-portal).

- **SQL Server on-prem** - If your SQL Server is hosted on an on-premises Windows machine without Azure Arc, you have two options for connecting it to Azure:
    
    - **Deploy Azure Arc** - You can connect any Windows machine to Security Center. However, Azure Arc provides deeper integration across *all* of your Azure environment. If you set up Azure Arc, you'll see the **SQL Server – Azure Arc** page in the portal and your security alerts will appear on a dedicated **Security** tab on that page. So the first and recommended option is to [set up Azure Arc on the host](https://docs.microsoft.com/azure/azure-arc/servers/onboard-portal#install-and-validate-the-agent-on-windows) and follow the instructions for **SQL Server on Azure Arc**, above.
        
    - **Connect the Windows machine without Azure Arc** - If you choose to connect a SQL Server running on a Windows machine without using Azure Arc, follow the instructions in [Connect Windows machines to Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/agent-windows).


### Step 2. Enable the optional bundle in Security Center's pricing and settings page:

1. From Security Center's sidebar, open the **Pricing & settings** page.

    - If you're using **Azure Security Center's default workspace** (named “defaultworkspace-[your subscription id]-[region]”), select the relevant **subscription**.

    - If you're using **a non-default workspace**, select the relevant **workspace** (enter the workspace's name in the filter if necessary):

        ![title](./media/security-center-advanced-iaas-data/pricing-and-settings-workspaces.png)


1. Toggle the option for **SQL servers on machines (Preview)** to enabled. 

    [![Security Center pricing page with optional bundles](media/security-center-advanced-iaas-data/sql-servers-on-vms-in-pricing-small.png)](media/security-center-advanced-iaas-data/sql-servers-on-vms-in-pricing-large.png#lightbox)

    Advanced Data Security for SQL servers on machines will be enabled on all SQL servers connected to the selected workspace. The protection will be fully active after the first restart of the SQL Server. 

    >[!TIP] 
    > To create a new workspace, follow the instructions in [Create a Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace).


1. Optionally, configure email notification for security alerts. 
    You can set a list of recipients to receive an email notification when Security Center alerts are generated. The email contains a direct link to the alert in Azure Security Center with all the relevant details. For more information, see [Set up email notifications for security alerts](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details).



## Explore vulnerability assessment reports

The vulnerability assessment service scans your databases once a week. The scans run on the same day of the week on which you enabled the service.

The vulnerability assessment dashboard provides an overview of your assessment results across all your databases, along with a summary of healthy and unhealthy databases, and an overall summary of failing checks according to risk distribution.

You can view the vulnerability assessment results directly from Security Center.

1. From Security Center's sidebar, open the **Recommendations** page and select the recommendation **Vulnerabilities on your SQL database servers on machines should be remediated (Preview)**. For more information, see [Security Center Recommendations](security-center-recommendations.md). 


    [![**Vulnerabilities on your SQL databases on machines should be remediated (Preview)** recommendation](media/security-center-advanced-iaas-data/data-and-storage-sqldb-vulns-on-vm.png)](media/security-center-advanced-iaas-data/data-and-storage-sqldb-vulns-on-vm.png#lightbox)

    The detailed view for this recommendation appears.

    [![Detailed view for the **Vulnerabilities on your SQL databases on machines should be remediated (Preview)** recommendation](media/security-center-advanced-iaas-data/all-servers-view.png)](media/security-center-advanced-iaas-data/all-servers-view.png#lightbox)

1. For more details, drill down:

    * For an overview of scanned resources (databases) and the list of security checks that were tested, select the server of interest.

    * For an overview of the vulnerabilities grouped by a specific SQL database, select the database of interest.

    In each view, the security checks are sorted by **Severity**. Click a specific security check to see a details pane with a **Description**, how to **Remediate** it, and other related information such as **Impact** or **Benchmark**.

## Advanced threat protection for SQL servers on machines alerts
Alerts are generated by unusual and potentially harmful attempts to access or exploit SQL machines. These events can trigger alerts shown in the [Alerts for SQL Database and SQL Data Warehouse section of the alerts reference page](alerts-reference.md#alerts-sql-db-and-warehouse).



## Explore and investigate security alerts

Security alerts are available in Security Center's alerts page, the resource's security tab, or through the direct link in the alert emails.

1. To view alerts, select **Security alerts** from Security Center's sidebar and select an alert.

1. Alerts are designed to be self-contained, with detailed remediation steps and investigation information in each one. You can investigate further by using other Azure Security Center and Azure Sentinel capabilities for a broader view:

    * Enable SQL Server's auditing feature for further investigations. If you're an Azure Sentinel user, you can upload the SQL auditing logs from the Windows Security Log events to Sentinel and enjoy a rich investigation experience. [Learn more about SQL Server Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/create-a-server-audit-and-server-audit-specification?view=sql-server-ver15).
    * To improve your security posture, use Security Center's recommendations for the host machine indicated in each alert. This will reduce the risks of future attacks. 

    [Learn more about managing and responding to alerts](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts).


## Next steps

For related material, see the following article:

- [Security alerts for SQL Database and SQL Data Warehouse](alerts-reference.md#alerts-sql-db-and-warehouse)
- [Set up email notifications for security alerts](security-center-provide-security-contact-details.md)
- [Learn more about Azure Sentinel](https://docs.microsoft.com/azure/sentinel/)
- [Azure Security Center's advanced data security package](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security)