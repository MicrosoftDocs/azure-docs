---
title: Configure SAP HANA provider for Azure Monitor for SAP solutions 
description: Learn how to configure the SAP HANA provider for Azure Monitor for SAP solutions through the Azure portal.
author: MightySuz
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 10/27/2022
ms.author: sujaj
#Customer intent: As a developer, I want to create an SAP HANA provider so that I can use the resource with Azure Monitor for SAP solutions.
---


# Configure SAP HANA provider for Azure Monitor for SAP solutions 

In this how-to guide, you'll learn to configure an SAP HANA provider for Azure Monitor for SAP solutions through the Azure portal. 

## Prerequisite to enable secure communication

To [enable TLS 1.2 higher](enable-tls-azure-monitor-sap-solutions.md) for SAP HANA provider, follow steps mentioned in this [SAP document](https://www.sap.com/documents/2018/11/b865eb91-287d-0010-87a3-c30de2ffd8ff.html)

## Prerequisites

- An Azure subscription. 
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](quickstart-portal.md) or the [quickstart for PowerShell](quickstart-powershell.md).


## Configure Azure Monitor for SAP solutions

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Monitors for SAP solutions** in the search bar.
1. On the Azure Monitor for SAP solutions service page, select **Create**.
1. On the Azure Monitor for SAP solutions creation page, enter your basic resource information on the **Basics** tab.
1. On the **Providers** tab:
    1. Select **Add provider**.
    1. On the creation pane, for **Type**, select **SAP HANA**.
       ![Diagram of the Azure Monitor for SAP solutions resource creation page in the Azure portal, showing all required form fields.](./media/provider-hana/azure-monitor-providers-hana-setup.png)
    1. Optionally, select **Enable secure communication**, choose the certificate type from the drop-down menu.
    1. For **IP address**, enter the IP address or hostname of the server that runs the SAP HANA instance that you want to monitor. If you're using a hostname, make sure there is connectivity within the virtual network.
    1. For **Database tenant**, enter the HANA database that you want to connect to. It's recommended to use **SYSTEMDB**, because tenant databases don't have all monitoring views. For legacy single-container HANA 1.0 instances, leave this field blank.
    1. For **Instance number**, enter the instance number of the database (0-99). The SQL port is automatically determined based on the instance number.
    1. For **Database username**, enter the dedicated SAP HANA database user. This user needs the **MONITORING** or **BACKUP CATALOG READ** role assignment. For non-production SAP HANA instances, use **SYSTEM** instead.
    1. For **Database password**, enter the password for the database username.  You can either enter the password directly or use a secret inside Azure Key Vault.
1. Save your changes to the Azure Monitor for SAP solutions resource.

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Monitor for SAP solutions provider types](providers.md)
