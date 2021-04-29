---
title: Connect Cherwell with IT Service Management Connector
description: This article provides information about how to Cherwell with the IT Service Management Connector (ITSMC) in Azure Monitor to centrally monitor and manage the ITSM work items.
ms.topic: conceptual
author: nolavime
ms.author: v-jysur
ms.date: 12/21/2020

---

# Connect Cherwell with IT Service Management Connector

This article provides information about how to configure the connection between your Cherwell instance and the IT Service Management Connector (ITSMC) in Log Analytics to centrally manage your work items.

> [!NOTE]
> As of 1-Oct-2020 Cherwell ITSM integration with Azure Alert will no longer be enabled for new customers. New ITSM Connections will not be supported.
> Existing ITSM connections will be supported.

The following sections provide details about how to connect your Cherwell product to ITSMC in Azure.

## Prerequisites

Ensure the following prerequisites are met:

- ITSMC installed. More information: [Adding the IT Service Management Connector Solution](./itsmc-definition.md#add-it-service-management-connector).
- Client ID generated. More information: [Generate client ID for Cherwell](#generate-client-id-for-cherwell).
- User role:  Administrator.

## Connection procedure

Use the following procedure to create a Cherwell connection:

1. In Azure portal, go to **All Resources** and look for **ServiceDesk(YourWorkspaceName)**

2. Under **WORKSPACE DATA SOURCES** click **ITSM Connections**.
	![New connection](/azure/azure-monitor/alerts/media/itsmc-connections-scsm/add-new-itsm-connection.png)

3. At the top of the right pane, click **Add**.

4. Provide the information as described in the following table, and click **OK** to create the connection.

> [!NOTE]
> All these parameters are mandatory.

| **Field** | **Description** |
| --- | --- |
| **Connection Name**   | Type a name for the Cherwell instance that you want to connect to ITSMC.  You use this name later when you configure work items in this ITSM/ view detailed log analytics. |
| **Partner type**   | Select **Cherwell.** |
| **Username**   | Type the Cherwell user name that can connect to ITSMC. |
| **Password**   | Type the password associated with this user name. **Note:** User name and password are used for generating authentication tokens only, and are not stored anywhere within the ITSMC service.|
| **Server URL**   | Type the URL of your Cherwell instance that you want to connect to ITSMC. |
| **Client ID**   | Type the client ID for authenticating this connection, which you generated in your Cherwell instance.   |
| **Data Sync Scope**   | Select the Cherwell work items that you want to sync through ITSMC.  These work items are imported into log analytics.   **Options:**  Incidents, Change Requests. |
| **Sync Data** | Type the number of past days that you want the data from. **Maximum limit**: 120 days. |
| **Create new configuration item in ITSM solution** | Select this option if you want to create the configuration items in the ITSM product. When selected, ITSMC creates the affected CIs as configuration items (in case of non-existing CIs) in the supported ITSM system. **Default**: disabled. |

![Cherwell connection](media/itsmc-connections-cherwell/itsm-connections-cherwell-latest.png)

**When successfully connected, and synced**:

- Selected work items from this Cherwell instance are imported into Azure **Log Analytics.** You can view the summary of these work items on the IT Service Management Connector tile.

- You can create incidents from Log Analytics alerts or from log records, or from Azure alerts in this Cherwell instance.

Learn more: [Create ITSM work items from Azure alerts](./itsmc-definition.md#create-itsm-work-items-from-azure-alerts).

### Generate client ID for Cherwell

To generate the client ID/key for Cherwell, use the following procedure:

1. Log in to your Cherwell instance as admin.
2. Click **Security** > **Edit REST API client settings**.
3. Select **Create new client** > **client secret**.

    ![Cherwell user id](media/itsmc-connections-cherwell/itsmc-cherwell-client-id.png)

## Next steps

* [ITSM Connector Overview](itsmc-overview.md)
* [Create ITSM work items from Azure alerts](./itsmc-definition.md#create-itsm-work-items-from-azure-alerts)
* [Troubleshooting problems in ITSM Connector](./itsmc-resync-servicenow.md)
