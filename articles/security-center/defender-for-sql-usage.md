---
title: How to use Azure Defender for SQL
description: Learn how to use Azure Security Center's optional Azure Defender for SQL plan
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin

ms.assetid: ba46c460-6ba7-48b2-a6a7-ec802dd4eec2
ms.service: security-center
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/22/2020
ms.author: memildin
---

# Azure Defender for SQL servers on machines 

This Azure Defender plan detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

You'll see alerts when there are suspicious database activities, potential vulnerabilities, or SQL injection attacks, and anomalous database access and query patterns.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|Preview|
|Pricing:|**Azure Defender for SQL servers on machines** is billed as shown on [the pricing page](security-center-pricing.md)|
|Protected SQL versions:|Azure SQL Server (all versions covered by Microsoft support)|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![Yes](./media/icons/yes-icon.png) US Gov<br>![No](./media/icons/no-icon.png) China Gov, Other Gov|
|||

## Set up Azure Defender for SQL servers on machines

To enable this plan:

* Provision the Log Analytics agent on your SQL server's host. This provides the connection to Azure.

* Enable the optional plan in Security Center's pricing and settings page.

Both of these are described below.

### Step 1. Provision the Log Analytics agent on your SQL server's host:

- **SQL Server on Azure VM** - If your SQL machine is hosted on an Azure VM, you can [auto provision the Log Analytics agent](security-center-enable-data-collection.md#workspace-configuration). Alternatively, you can follow the manual procedure for [Onboard your Azure Stack VMs](quickstart-onboard-machines.md#onboard-your-azure-stack-vms).
- **SQL Server on Azure Arc** - If your SQL Server is hosted on an [Azure Arc](https://docs.microsoft.com/azure/azure-arc/) machine, you can deploy the Log Analytics agent using the Security Center recommendation “Log Analytics agent should be installed on your Windows-based Azure Arc machines (Preview)”. Alternatively, you can follow the manual procedure in the [Azure Arc documentation](https://docs.microsoft.com/azure/azure-arc/servers/manage-vm-extensions#enable-extensions-from-the-portal).

- **SQL Server on-prem** - If your SQL Server is hosted on an on-premises Windows machine without Azure Arc, you have two options for connecting it to Azure:
    
    - **Deploy Azure Arc** - You can connect any Windows machine to Security Center. However, Azure Arc provides deeper integration across *all* of your Azure environment. If you set up Azure Arc, you'll see the **SQL Server – Azure Arc** page in the portal and your security alerts will appear on a dedicated **Security** tab on that page. So the first and recommended option is to [set up Azure Arc on the host](https://docs.microsoft.com/azure/azure-arc/servers/onboard-portal#install-and-validate-the-agent-on-windows) and follow the instructions for **SQL Server on Azure Arc**, above.
        
    - **Connect the Windows machine without Azure Arc** - If you choose to connect a SQL Server running on a Windows machine without using Azure Arc, follow the instructions in [Connect Windows machines to Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/agent-windows).


### Step 2. Enable the optional plan in Security Center's pricing and settings page:

1. From Security Center's menu, open the **Pricing & settings** page.

    - If you're using **Azure Security Center's default workspace** (named “defaultworkspace-[your subscription id]-[region]”), select the relevant **subscription**.

    - If you're using **a non-default workspace**, select the relevant **workspace** (enter the workspace's name in the filter if necessary):

        ![Finding your non-default workspace by title](./media/security-center-advanced-iaas-data/pricing-and-settings-workspaces.png)

1. Set the option for **Azure Defender for SQL servers on machines (Preview)** plan to **on**. 

    ![Security Center pricing page with optional plans](media/security-center-advanced-iaas-data/sql-servers-on-vms-in-pricing-small.png)

    The plan will be enabled on all SQL servers connected to the selected workspace. The protection will be fully active after the first restart of the SQL Server instance.

    >[!TIP] 
    > To create a new workspace, follow the instructions in [Create a Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace).


1. Optionally, configure email notification for security alerts. 
    You can set a list of recipients to receive an email notification when Security Center alerts are generated. The email contains a direct link to the alert in Azure Security Center with all the relevant details. For more information, see [Set up email notifications for security alerts](security-center-provide-security-contact-details.md).



## Explore vulnerability assessment reports

The vulnerability assessment service scans your databases once a week. The scans run on the same day of the week on which you enabled the service.

The vulnerability assessment dashboard provides an overview of your assessment results across all your databases, along with a summary of healthy and unhealthy databases, and an overall summary of failing checks according to risk distribution.

You can view the vulnerability assessment results directly from Security Center.

1. From Security Center's sidebar, open the **Recommendations** page and select the recommendation **Vulnerabilities on your SQL servers on machines should be remediated (Preview)**. For more information, see [Security Center Recommendations](security-center-recommendations.md). 

    :::image type="content" source="./media/security-center-advanced-iaas-data/data-and-storage-sqldb-vulns-on-vm.png" alt-text="Vulnerability Assessment findings on your SQL servers on machines should be remediated (Preview)":::

    The detailed view for this recommendation appears.

    :::image type="content" source="./media/security-center-advanced-iaas-data/all-servers-view.png" alt-text="Detailed view for the recommendation":::

1. For more details, drill down:

    * For an overview of scanned resources (databases) and the list of security checks that were tested, select the server of interest.

    * For an overview of the vulnerabilities grouped by a specific SQL database, select the database of interest.

    In each view, the security checks are sorted by **Severity**. Click a specific security check to see a details pane with a **Description**, how to **Remediate** it, and other related information such as **Impact** or **Benchmark**.

## Azure Defender for SQL alerts
Alerts are generated by unusual and potentially harmful attempts to access or exploit SQL machines. These events can trigger alerts shown in the [Alerts for SQL Database and Azure Synapse Analytics (formerly SQL Data Warehouse) section of the alerts reference page](alerts-reference.md#alerts-sql-db-and-warehouse).

## Explore and investigate security alerts

Azure Defender alerts are available in Security Center's alerts page, the resource's security tab, the [Azure Defender dashboard](azure-defender-dashboard.md), or through the direct link in the alert emails.

1. To view alerts, select **Security alerts** from Security Center's menu and select an alert.

1. Alerts are designed to be self-contained, with detailed remediation steps and investigation information in each one. You can investigate further by using other Azure Security Center and Azure Sentinel capabilities for a broader view:

    * Enable SQL Server's auditing feature for further investigations. If you're an Azure Sentinel user, you can upload the SQL auditing logs from the Windows Security Log events to Sentinel and enjoy a rich investigation experience. [Learn more about SQL Server Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/create-a-server-audit-and-server-audit-specification?view=sql-server-ver15).
    * To improve your security posture, use Security Center's recommendations for the host machine indicated in each alert. This will reduce the risks of future attacks. 

    [Learn more about managing and responding to alerts](security-center-managing-and-responding-alerts.md).


## Next steps

For related material, see the following article:

- [Security alerts for SQL Database and Azure Synapse Analytics (formerly SQL Data Warehouse)](alerts-reference.md#alerts-sql-db-and-warehouse)
- [Set up email notifications for security alerts](security-center-provide-security-contact-details.md)
- [Learn more about Azure Sentinel](https://docs.microsoft.com/azure/sentinel/)
- [Azure Security Center's data security package](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security)