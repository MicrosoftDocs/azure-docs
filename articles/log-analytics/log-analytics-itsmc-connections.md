---
title: ITSM connections in OMS IT Service Management Connector | Microsoft Docs
description: Connect your ITSM products/services with IT Service Management Connector in OMS to centrally monitor and manage the ITSM work items.
documentationcenter: ''
author: JYOTHIRMAISURI
manager: riyazp
editor: ''
ms.assetid: 8231b7ce-d67f-4237-afbf-465e2e397105
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/27/2017
ms.author: v-jysur
---
# Connect ITSM products/services with IT Service Management connector (Preview)
This article provides information about how to connect your ITSM product/service to IT Service Management Connector in OMS and centrally manage your work items. More information about IT Service Management connector, see [Overview](log-analytics-itsmc-overview.md).

The following products/services are supported:

- [System Center Service Manager](#connect-system-center-service-manager-to-it-service-management-connector-in-oms)
- [ServiceNow](#connect-servicenow-to-it-service-management-connector-in-oms)
- [Provance](#connect-provance-to-it-service-management-connector-in-oms)
- [Cherwell](#connect-cherwell-to-it-service-management-connector-in-oms)

## Connect System Center Service Manager to IT Service Management connector in OMS

The following sections provide details about how to connect your System Center Service Manager product to the IT Service Manager connector in OMS.

### Prerequisites

Ensure you have the following prerequisites met:

- IT Service Management connector installed.
More information:  [Configuration](log-analytics-itsmc-overview.md#configuration).
- The Service Manager Web application (Web app) is deployed and configured. Information on Web app is [here](#create-and-deploy-service-manager-web-app-service).
- Hybrid connection created and configured. More information: [Configure the hybrid Connection](#configure-the-hybrid-connector-role).
- Supported versions of Service Manager:  2012 R2 or 2016.
- User role:  [Advanced operator](https://technet.microsoft.com/library/ff461054.aspx).

### Connection procedure

Use the following procedure to connect your System Center Service Manager instance to the IT Service Management connector:

1. Go to **OMS** >**Settings** > **Connected Sources**.
2. Select **ITSM Connector,** click **Add New Connection**.

    ![Service manager ](./media/log-analytics-itsmc/itsmc-service-manager-connection.png)
3. Provide the information as described in the following table, and click **Save** to create the connection:

> [!NOTE]
> All these parameters are mandatory.

| **Field** | **Description** |
| --- | --- |
| **Name**   | Type a name for the System Center Service Manager instance that you want to connect with the IT Service Management connector.  You use this name later when you configure work items in this instance/ view detailed log analytics. |
| **Select Connection type**   | Select **System Center Service Manager**. |
| **Server URL**   | Type the URL of the Service Manager Web app. More information about Service Manager Web app is [here](#create-and-deploy-service-manager-web-app-service).
| **Client ID**   | Type the client ID that you generated (using the automatic script) for authenticating the Web app. More information about the automated script is [here.](log-analytics-itsmc-service-manager-script.md)|
| **Client Secret**   | Type the client secret, generated for this ID.   |
| **Data Sync Scope**   | Select the Service Manager work items that you want to sync through the IT Service Management connector.  These work items are imported into Log Analytics. **Options:**  Incidents, Change Requests.|
| **Sync Data** | Type the number of past days that you want the data from. **Maximum limit**: 120 days. |
| **Create new configuration item in ITSM solution** | Select this option if you want to create the configuration items in the ITSM product. When selected, OMS creates the affected CIs as configuration items (in case of non-existing CIs) in the supported ITSM system. **Default**: disabled. |

When successfully connected, and synced:

- Selected work items from Service Manager are imported into OMS **Log Analytics.** You can view the summary of these work items on the IT Service Management connector tile.

- From OMS, you can create incidents from OMS alerts or from log search, in this Service Manager instance.

More information: [Create ITSM work items for OMS alerts](log-analytics-itsmc-overview.md#create-itsm-work-items-for-oms-alerts) and [Create ITSM work items from OMS logs](log-analytics-itsmc-overview.md#create-itsm-work-items-from-oms-logs).

### Create and deploy Service Manager web app service

To connect the on-premises Service Manager with the IT Service Management connector on OMS, Microsoft has created a Service Manager Web app on the GitHub.

To set up the ITSM Web app for your Service Manager, do the following:

- **Deploy the Web app** – Deploy the Web app, set the properties, and authenticate with Azure AD. You can deploy the web app by using the [automated script](log-analytics-itsmc-service-manager-script.md) that Microsoft has provided you.
- **Configure the hybrid connection** - [Configure this connection](#configure-the-hybrid-connection), manually.

#### Deploy the web app
Use the automated [script](log-analytics-itsmc-service-manager-script.md) to deploy the Web app, set the properties, and authenticate with Azure AD.

Run the script by providing the following required details:

- Azure subscription details
- Resource group name
- Location
- Service Manager server details (server name, domain, user name, and password)
- URL for deployment
- Site name for your Web app
- Biz talk service name.

The script creates the Web app using the name that you specified (along with few additional strings to make it unique). It generates the **Web app URL**, **client ID** and **client secret**.

Save the values, you use them when you create a connection with IT Service Management connector.

**Check the Web app installation**

1. Go to **Azure portal** > **Resources**.
2. Select the Web app, click **Settings** > **Application Settings**.
3. Confirm the information about the Service Manager instance that you provided at the time of deploying the app through the script.

### Configure the hybrid connection

Use the following procedure to connect the hybrid connector role that connects the Service Manager instance with the IT Service Management connector in OMS.

1. Find the Service Manager Web app, under **Azure Resources**.
2. Click **Settings** > **Networking**.
3. Under **Hybrid Connections**, click **Configure your hybrid connection endpoints**.

    ![Hybrid connection networking](./media/log-analytics-itsmc/itsmc-hybrid-connection-networking-and-end-points.png)
4. In the **Hybrid Connections** blade, click **Add hybrid connection**.

    ![Hybrid connection add](./media/log-analytics-itsmc/itsmc-new-hybrid-connection-add.png)

5. In the **Add Hybrid Connections** blade, click **Create new hybrid Connection**.

    ![New Hybrid connection](./media/log-analytics-itsmc/itsmc-create-new-hybrid-connection.png)

6. Type the following values:

    - **EndPoint Name**: Specify a name for the new Hybrid connection.
    -  **EndPoint Host**: FQDN of the Service Manager management server.
    - **EndPoint Port**: Type 5724
    - **Servicebus namespace**: Use an existing servicebus namespace or create a new one.
    - **Location**: select the location.
    -  **Name**: Specify a name to the servicebus if you are creating it.

    ![Hybrid connection values](./media/log-analytics-itsmc/itsmc-new-hybrid-connection-values.png)
6. Click **OK** to close the **Create hybrid connection** blade and start creating the hybrid connection.

    Once the Hybrid connection is created, it is displayed under the blade.

7. After the hybrid connection is created, select the connection and click **Add selected hybrid connection**.

    ![New hybrid connection](./media/log-analytics-itsmc/itsmc-new-hybrid-connection-added.png)

#### Configure the listener setup

Use the following procedure to configure the listener setup for the hybrid connection.

1. In the **Hybrid Connections** blade, click **Download the Connection Manager** and install it on the machine where System Center Service Manager instance is running.

    Once the installation is complete, **Hybrid Connection Manager UI** option is available under **Start** menu.

2. Click **Hybrid Connection Manager UI** , you will be prompted for your Azure credentials.

3. Login with your Azure credentials and select your subscription where the Hybrid connection was created.

4. Click **Save**.

Your hybrid connection is successfully connected.

![successful hybrid connection](./media/log-analytics-itsmc/itsmc-hybrid-connection-listener-set-up-successful.png)
> [!NOTE]

> After the hybrid connection is created, verify and test the connection by visiting the deployed Service Manager Web app. Ensure the connection is successful before you try to connect to the IT Service Management connector in OMS.

The following image shows the details of a successful connection:

![Hybrid connection test](./media/log-analytics-itsmc/itsmc-hybrid-connection-test.png)

## Connect ServiceNow to IT Service Management connector in OMS

The following sections provide details about how to connect your ServiceNow product to the IT Service Manager connector in OMS.

### Prerequisites

Ensure you have the following prerequisites met:

- IT Service Management connector installed. More information: [Configuration.](log-analytics-itsmc-overview.md#configuration)
- Client ID and client secret for ServiceNow product are generated and available.  For information on how to generate client ID and secret, see [OAuth Setup](http://wiki.servicenow.com/index.php?title=OAuth_Setup).
- ServiceNow supported versions – Fuji, Geneva, Helsinki.
- User App for Microsoft OMS integration (ServiceNow app) installed and the integration user role is configured. [Learn more](https://store.servicenow.com/sn_appstore_store.do#!/store/application/ab0265b2dbd53200d36cdc50cf961980/1.0.0 ).
- User role: Integration user role. Information on how to create the integration user role is [here](#create-integration-user-role-in-servicenow-app).


### **Connection procedure**

Use the following procedure to create a ServiceNow connection:

1. Go to **OMS** > **Settings** > **Connected Sources**.
2. Select **ITSM Connector,** click **Add New Connection**.

    ![ServiceNow  connection](./media/log-analytics-itsmc/itsmc-servicenow-connection.png)

3. Provide the information as described in the following table, and click **Save** to create the connection:

> [!NOTE]
> All these parameters are mandatory.

| **Field** | **Description** |
| --- | --- |
| **Name**   | Type a name for the ServiceNow instance that you want to connect with the IT Service Management connector.  You use this name later in OMS when you configure work items in this ITSM/ view detailed log analytics. |
| **Select Connection type**   | Select **ServiceNow**. |
| **Username**   | Type the integration user name that you created in the ServiceNow app to support the connection to the IT Service Management connector. More information: [Create ServiceNow app user role](#create-integration-user-role-in-servicenow-app).|
| **Password**   | Type the password associated with this user name. **Note**: User name and password are used for generating authentication tokens only, and are not stored anywhere within the OMS service.  |
| **Server URL**   | Type the URL of the ServiceNow instance that you want to connect to IT Service Management connector. |
| **Client ID**   | Type the client ID that you want to use for OAuth2 Authentication, which you generated earlier.  More information on generating client ID and secret:   [OAuth Setup](http://wiki.servicenow.com/index.php?title=OAuth_Setup). |
| **Client Secret**   | Type the client secret, generated for this ID.   |
| **Data Sync Scope**   | Select the ServiceNow work items that you want to sync to OMS, through the IT Service Management connector.  The selected values are imported into log analytics.   **Options:**  Incidents and Change Requests.|
| **Sync Data** | Type the number of past days that you want the data from. **Maximum limit**: 120 days. |
| **Create new configuration item in ITSM solution** | Select this option if you want to create the configuration items in the ITSM product. When selected, OMS creates the affected CIs as configuration items (in case of non-existing CIs) in the supported ITSM system. **Default**: disabled. |


When successfully connected, and synced:

- Selected work items from ServiceNow connection are imported into OMS Log Analytics.  You can view the summary of these work items on the IT Service Management connector tile.
- You can create incidents, alerts, and events from OMS Alerts or log search in this ServiceNow instance.  


More information: [Create ITSM work items for OMS alerts](log-analytics-itsmc-overview.md#create-itsm-work-items-for-oms-alerts) and [Create ITSM work items from OMS logs](log-analytics-itsmc-overview.md#create-itsm-work-items-from-oms-logs).

### Create integration user role in ServiceNow app

User the following procedure:

1.	Visit the [ServiceNow store](https://store.servicenow.com/sn_appstore_store.do#!/store/application/ab0265b2dbd53200d36cdc50cf961980/1.0.0) and install the **User App for ServiceNow and Microsoft OMS Integration** into your ServiceNow Instance.
2.	After installation, visit the left navigation bar of the ServiceNow instance, search, and select Microsoft OMS integrator.  
3.	Click **Installation Checklist**.

    The status is displayed as  **Not complete** if the user role is yet to be created.

4.	In the text boxes, next to **Create integration user**, enter the user name for the user that can connect to the IT Service Management connector in OMS.
5.	Enter the password for this user, and click **OK**.  

>[!NOTE]

> You use these credentials to make the ServiceNow connection in OMS.

The newly created user is displayed with the default roles assigned.

Default roles:
- personalize_choices
- import_transformer
- 	x_mioms_microsoft.user
- 	itil
- 	template_editor
- 	view_changer

Once the user is successfully created, the status of **Check Installation Checklist** moves to Completed, listing the details of the user role created for the app.

> [!NOTE]

> To allow a user to create **alerts** and **events** in ServiceNow from OMS:

> - Ensure you have the Event Management module Installed on your ServiceNow instance.

> - Add the following roles to the integration user:
>      - evt_mgmt_integration
>      - evt_mgmt_operator  


## Connect Provance to IT Service Management connector in OMS

The following sections provide details about how to connect your Provance product to the IT Service Manager connector in OMS.

### Prerequisites

Ensure you have the following prerequisites met:

- IT Service Management connector installed. More information: [Configuration](log-analytics-itsmc-overview.md#configuration).
- Provance App should be registered with Azure AD - and client ID is made available. For detailed information, see [how to configure active directory authentication](../app-service-mobile/app-service-mobile-how-to-configure-active-directory-authentication.md).
- User role:  Administrator.

### Connection Procedure

Use the following procedure to create a Provance connection:

1. Go to **OMS** > **Settings** > **Connected Sources**.
2. Select **ITSM Connector,** click **Add New Connection**.  

    ![Provance connection](./media/log-analytics-itsmc/itsmc-provance-connection.png)
3. Provide the information as described in the following table, and click **Save** to create the connection.

> [!NOTE]
> All these parameters are mandatory.

| **Field** | **Description** |
| --- | --- |
| **Name**   | Type a name for the Provance instance that you want to connect with the IT Service Management connector.  You use this name later in OMS when you configure work items in this ITSM/ view detailed log analytics. |
| **Select Connection type**   | Select **Provance**. |
| **Username**   | Type the user name that can connect to the IT Service Management connector.    |
| **Password**   | Type the password associated with this user name. **Note:** User name and password are used for generating authentication tokens only, and are not stored anywhere within the OMS service._|
| **Server URL**   | Type the URL of your Provance instance that you want to connect to IT Service Management connector. |
| **Client ID**   | Type the client ID for authenticating this connection, which you generated in your Provance instance.  More information on client ID, see [how to configure active directory authentication](../app-service-mobile/app-service-mobile-how-to-configure-active-directory-authentication.md). |
| **Data Sync Scope**   | Select the Provance work items that you want to sync to OMS, through the IT Service Management connector.  These work items are imported into log analytics.   **Options:**   Incidents, Change Requests.|
| **Sync Data** | Type the number of past days that you want the data from. **Maximum limit**: 120 days. |
| **Create new configuration item in ITSM solution** | Select this option if you want to create the configuration items in the ITSM product. When selected, OMS creates the affected CIs as configuration items (in case of non-existing CIs) in the supported ITSM system. **Default**: disabled.|

When successfully connected, and synced:

- Selected work items from Provance connection are imported into OMS **Log Analytics.**  You can view the summary of these work items on the IT Service Management connector tile.
- You can create incidents and events from OMS Alerts or Log Search in this Provance instance.

More information: [Create ITSM work items for OMS alerts](log-analytics-itsmc-overview.md#create-itsm-work-items-for-oms-alerts) and [Create ITSM work items from OMS logs](log-analytics-itsmc-overview.md#create-itsm-work-items-from-oms-logs).

## Connect Cherwell to IT Service Management connector in OMS

The following sections provide details about how to connect your Cherwell product to the IT Service Manager connector in OMS.

### Prerequisites

Ensure you have the following prerequisites met:

- IT Service Management connector installed. More information: [Configuration](log-analytics-itsmc-overview.md#configuration).
- Client ID generated. More information: [Generate client ID for Cherwell](#generate-client-id-for-cherwell).
- User role:  Administrator.

### Connection Procedure

Use the following procedure to create a Cherwell connection:

1. Go to **OMS** >  **Settings** > **Connected Sources**.
2. Select **ITSM Connector** click **Add New Connection**.  

    ![Cherwell user id](./media/log-analytics-itsmc/itsmc-cherwell-connection.png)

3. Provide the information as described in the following table, and click  **Save** to create the connection.

> [!NOTE]
> All these parameters are mandatory.

| **Field** | **Description** |
| --- | --- |
| **Name**   | Type a name for the Cherwell instance that you want to connect to the IT Service Management connector.  You use this name later in OMS when you configure work items in this ITSM/ view detailed log analytics. |
| **Select Connection type**   | Select **Cherwell.** |
| **Username**   | Type the Cherwell user name that can connect to the IT Service Management connector. |
| **Password**   | Type the password associated with this user name. **Note:** User name and password are used for generating authentication tokens only, and are not stored anywhere within the OMS service.|
| **Server URL**   | Type the URL of your Cherwell instance that you want to connect to IT Service Management connector. |
| **Client ID**   | Type the client ID for authenticating this connection, which you generated in your Cherwell instance.   |
| **Data Sync Scope**   | Select the Cherwell work items that you want to sync through the IT Service Management connector.  These work items are imported into log analytics.   **Options:**  Incidents, Change Requests. |
| **Sync Data** | Type the number of past days that you want the data from. **Maximum limit**: 120 days. |
| **Create new configuration item in ITSM solution** | Select this option if you want to create the configuration items in the ITSM product. When selected, OMS creates the affected CIs as configuration items (in case of non-existing CIs) in the supported ITSM system. **Default**: disabled. |

When successfully connected, and synced:

- Selected work items from this Cherwell connection are imported into OMS Log Analytics. You can view the summary of these work items  on the IT Service Management connector tile.
- You can create incidents and events in this Cherwell instance from OMS. More information: Create ITSM work items for OMS alerts and Create ITSM work items from OMS logs.

More information: [Create ITSM work items for OMS alerts](log-analytics-itsmc-overview.md#create-itsm-work-items-for-oms-alerts) and [Create ITSM work items from OMS logs](log-analytics-itsmc-overview.md#create-itsm-work-items-from-oms-logs).

### Generate client ID for Cherwell

To generate the client ID/key for Cherwell, use the following procedure:

1. Log in to your Cherwell instance as admin.
2. Click **Security** > **Edit REST API client settings**.
3. Select **Create new client** > **client secret**.

    ![Cherwell user id](./media/log-analytics-itsmc/itsmc-cherwell-client-id.png)


## Next steps
 - [Create ITSM work items for OMS alerts](log-analytics-itsmc-overview.md#create-itsm-work-items-for-oms-alerts)

 - [Create ITSM work items from OMS logs](log-analytics-itsmc-overview.md#create-itsm-work-items-from-oms-logs)

- [View log analytics for your connection](log-analytics-itsmc-overview.md#using-the-solution)
