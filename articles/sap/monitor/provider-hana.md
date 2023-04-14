---
title: Configure SAP HANA provider for Azure Monitor for SAP solutions (preview)
description: Learn how to configure the SAP HANA provider for Azure Monitor for SAP solutions through the Azure portal.
author: MightySuz
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 10/27/2022
ms.author: sujaj
#Customer intent: As a developer, I want to create an SAP HANA provider so that I can use the resource with Azure Monitor for SAP solutions.
---


# Configure SAP HANA provider for Azure Monitor for SAP solutions (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

In this how-to guide, you'll learn to configure an SAP HANA provider for Azure Monitor for SAP solutions through the Azure portal. There are instructions to set up the [current version](#configure-azure-monitor-for-sap-solutions) and the [classic version](#configure-azure-monitor-for-sap-solutions-classic) of Azure Monitor for SAP solutions.

The following metrics are collected by the SAP HANA provider 
- Load History
- Backup statistics
- HANA System Replication statistics
- Disk utilization
- Delta merge statistics
- I/O Savepoint statistics
- Alerts
- Configuration parameters recommedations
- Long idling cursors
- Blocked transactions
- System availability

## Prerequisites

- An Azure subscription. 
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](quickstart-portal.md) or the [quickstart for PowerShell](quickstart-powershell.md).

## Create SAP HANA provider for Azure Monitor for SAP solutions

To create an SAP HANA Provider for Azure Monitor for SAP solutions, you must,
1. Create an SAP HANA user
1. Configure use_default_route parameter
1. Add an SAP HANA provider in Azure Monitor for SAP solutions

### Create an SAP HANA user

You can skip this step if a user exists for this purpose.

Create a new database user with MONITORING role. 

```sql
create user <ams_user_name> password <password_for_user>;
grant monitoring to <ams_user_name>;
```

If the user has just been created and the 'force_first_password_change' policy is enabled, ensure that the password is changed by logging on to the database via SAP HANA Cockpit or SAP HANA Studio.

### Configure use_default_route parameter

The configuration parameter global.ini > public_hostname_resolution > use_default_route should be set to 'ip'. 
The following query should list IP addresses
```sql
select * from sys.m_host_information where key = 'net_publicname' 
```

### Add an SAP HANA provider in Azure Monitor for SAP solutions

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Monitors for SAP solutions** in the search bar.
1. On the Azure Monitor for SAP solutions service page, select **Create**.
1. On the Azure Monitor for SAP solutions creation page, enter your basic resource information on the **Basics** tab.
1. On the **Providers** tab:
    1. Select **Add provider**.
    1. On the creation pane, for **Type**, select **SAP HANA**.
       ![Screenshot of the Azure Monitor for SAP solutions SAP HANA provider creation page in the Azure portal, showing all required form fields.](./media/provider-hana/azure-monitor-providers-hana-setup.png)
    1. Optionally, select **Enable secure communication**, choose the certificate type from the drop-down menu.
    1. For **IP address**, enter the IP address or hostname of the server that runs the SAP HANA instance that you want to monitor. If you're using a hostname, make sure there is connectivity within the virtual network.
    1. For **Database tenant**, enter the HANA database that you want to connect to. It's recommended to use **SYSTEMDB**, because tenant databases don't have all monitoring views. For legacy single-container HANA 1.0 instances, leave this field blank.
    1. For **Instance number**, enter the instance number of the database (0-99). The SQL port is automatically determined based on the instance number.
    1. For **SAP SID**, enter the SID of the SAP System.
    1. For **Database username**, enter the dedicated SAP HANA database user. This user needs the **MONITORING**.   
    1. For **Database password**, enter the password for the database username.  You can either enter the password directly or use a secret inside Azure Key Vault.
1. Save your changes to the Azure Monitor for SAP solutions resource.

## Prerequisite to enable secure communication

To [enable TLS 1.2 higher](enable-tls-azure-monitor-sap-solutions.md) for SAP HANA provider, follow steps mentioned in this [SAP document](https://www.sap.com/documents/2018/11/b865eb91-287d-0010-87a3-c30de2ffd8ff.html)

## Configure Azure Monitor for SAP solutions (classic)

To configure the SAP HANA provider for Azure Monitor for SAP solutions (classic):

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select the **Azure Monitors for SAP Solutions (classic)** service in the search bar.
1. On the Azure Monitor for SAP solutions (classic) service page, select **Create**.
1. On the creation page's **Basics** tab, enter the basic information for your Azure Monitor for SAP solutions instance.
1. On the **Providers** tab, add the providers that you want to configure. You can add multiple providers during creation. You can also add more providers after you deploy the Azure Monitor for SAP solutions resource. For each provider:
    1. Select **Add provider**.
    1. For **Type**, select **SAP HANA**. Make sure that you configure an SAP HANA provider for the main node.
    1. For **IP address**, enter the private IP address for the HANA server.
    1. For **Database tenant**, enter the name of the tenant that you want to use. You can choose any tenant. However, it's recommended to use **SYSTEMDB**, because this tenant has more monitoring areas.
    1. For **SQL port**, enter the port number for your HANA database. The format begins with 3, includes the instance number, and ends in 13. For example, 30013 is the SQL port for the instance 001.
    1. For **Database username**, enter the username that you want to use. Make sure the database user has **monitoring** and **catalog read** role assignments.
    1. Select **Add provider** to finish adding the provider.
1. Select **Review + create** to review and validate your configuration.
1. Select **Create** to finish creating the Azure Monitor for SAP solutions resource.

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Monitor for SAP solutions provider types](providers.md)
