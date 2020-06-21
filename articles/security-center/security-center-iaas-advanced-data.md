---
title: Advanced Data Security for IaaS in Azure Security Center | Microsoft Docs
description: Learn how to enable advanced data security for SQL machines in Azure Security Center.
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
ms.date: 06/11/2020
ms.author: memildin
---

# Advanced data security for SQL machines (Preview)
Advanced data security for SQL machines is a unified package for advanced SQL security capabilities. This preview feature includes functionality for identifying and mitigating potential database vulnerabilities and detecting anomalous activities that could indicate threats to your database. 

This offering is an extension of Azure Security Center's [advanced data security package](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security), already available for Azure SQL Databases, Synapse, and SQL Managed Instances.


## Overview

Advanced data security provides a set of advanced SQL security capabilities, consisting of Vulnerability assessment and Advanced Threat Protection.

* **Vulnerability assessment** is an easy to configure service that can discover, track, and help you remediate potential database vulnerabilities. Assessment scans provide an overview of your SQL machines' security state, and details of any security findings. 

* [Advanced Threat Protection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview) detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit your SQL server. It continuously monitors your database for suspicious activities and provides action-oriented security alerts on anomalous database access patterns. These alerts provide the suspicious activity details and recommended actions to investigate and mitigate the threat.



## Set up advanced data security for SQL machines 

Setting up Azure Security Center's advanced data security for SQL machines involves two steps:

* Provision the Log Analytics agent on your SQL server's host. This provides the connection to Azure. 

* Enable the optional bundle in Security Center's pricing and settings page

Both of these are described below.

1. Provision the Log Analytics agent on your SQL server's host:

    - **SQL Server on Azure VM** - If your SQL machine is hosted on an Azure VM, the procedure is the same as [adding any Azure VM](quick-onboard-azure-stack.md#add-the-virtual-machine-extension-to-your-existing-azure-stack-virtual-machines). It can even be auto provisioned.

    - **SQL Server on Azure Arc** - If your SQL Server is hosted on an [Azure Arc](https://docs.microsoft.com/azure/azure-arc/) machine, connect it with the Log Analytics agent as described in the [Azure Arc documentation](https://docs.microsoft.com/azure/azure-arc/servers/onboard-portal#install-and-validate-the-agent-on-windows).

    - **SQL Server on-prem** - If your SQL Server is hosted on an on-premises Windows machine without Azure Arc, you have two options for connecting it to Azure:
    
        - **Deploy Azure Arc** - You can connect any Windows machine to Security Center. However, to benefit from the security tab in the **SQL Server – Azure Arc** page, set up Azure Arc on the host and follow the instructions for an Azure Arc hosted SQL machine, above.
        In addition to the alerts appearing in the security tab, Azure Arc provides deeper integration across *all* of your Azure environment.
        
        - **Connect the Windows machine without Azure Arc** - If you choose to connect a SQL Server running on a Windows machine without using Azure Arc, follow the instructions in [Connect Windows machines to Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/agent-windows).


1. Enable the optional bundle in Security Center's pricing and settings page:

    1. From Security Center's sidebar, open the **Pricing & settings** page.

        - If you're using **Azure Security Center's default workspace** (named “defaultworkspace-[your subscription id]-[region]”), select the relevant **subscription**.

        - If you're using **a non-default workspace**, select the relevant **workspace** (enter the workspace's name in the filter if necessary):

            ![title](./media/security-center-advanced-iaas-data/pricing-and-settings-workspaces.png)


    1. Toggle the option for **SQL servers on machines (Preview)** to enabled. 

        [![Security Center pricing page with optional bundles](media/security-center-advanced-iaas-data/sql-servers-on-vms-in-pricing-small.png)](media/security-center-advanced-iaas-data/sql-servers-on-vms-in-pricing-large.png#lightbox)

    Advanced Data Security for SQL servers on machines will be enabled on all SQL servers connected to the selected workspace or subscription.

    >[!NOTE]
    > The protection will be fully active after the first restart of the SQL Server. 

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

    * Enable SQL Server's auditing feature for further investigations. If you're an Azure Sentinel user, you can upload the SQL auditing logs from the Windows Security Log events to Sentinel and enjoy a rich investigation experience.
    * To improve your security posture, use Security Center's recommendations for the host machine indicated in each alert. This will reduce the risks of future attacks. 


## Next steps

For related material, see the following article:

- [How to remediate recommendations](security-center-remediate-recommendations.md)