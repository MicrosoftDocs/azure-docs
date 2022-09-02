---
title: IT Service Management Connector in Azure Monitor
description: This article provides information about how to connect your ITSM products or services with the IT Service Management Connector (ITSMC) in Azure Monitor to centrally monitor and manage the ITSM work items.
ms.topic: conceptual
ms.date: 2/23/2022
ms.reviewer: nolavime

---
# Connect ITSM products/services with IT Service Management Connector
This article provides information about how to configure the connection between your ITSM product or service and the IT Service Management Connector (ITSMC) in Log Analytics to centrally manage your work items. For more information about ITSMC,  see [Overview](./itsmc-overview.md).

To set up your ITSM environment:
1. Connect to your ITSM.

    - For ServiceNow ITSM, see [the ServiceNow connection instructions](./itsmc-connections-servicenow.md).
    - For SCSM, see [the System Center Service Manager connection instructions](/azure/azure-monitor/alerts/itsmc-connections).

    >[!NOTE]
    > As of March 1, 2022, System Center ITSM integrations with Azure alerts is no longer enabled for new customers. New System Center ITSM Connections are not supported.
    > Existing ITSM connections are supported.
2. (Optional) Set up the IP Ranges. In order to list the ITSM IP addresses in order to allow ITSM connections from partners ITSM tools, we recommend the to list the whole public IP range of Azure region where their LogAnalytics workspace belongs. [details here](https://www.microsoft.com/en-us/download/details.aspx?id=56519)
For regions EUS/WEU/EUS2/WUS2/US South Central the customer can list ActionGroup network tag only.

## Next steps

* [Troubleshooting problems in ITSM Connector](./itsmc-resync-servicenow.md)
