---
title: Configure SAP authorizations and deploy optional SAP change requests (CRS)
titleSuffix: Microsoft Sentinel
description: Learn how to configure SAP authorizations and deploy optional SAP change requests to prepare your SAP environment for the SAP agent installation and connection to your SAP systems.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 05/28/2024
#customerIntent: As an SAP admin, I want to know how to configure SAP authorizations and deploy and SAP change requests (CRs) to prepare the environment for the installation of the SAP agent, so that it can properly connect to my SAP systems.
---

# Configure SAP authorizations and deploy optional SAP change requests

This article describes how to prepare your environment for the installation of the SAP agent so that it can properly connect to your SAP systems. Preparation includes configuring required SAP authorizations and, optionally, deploying extra SAP change requests (CRs). This step is the second step in deploying the Microsoft Sentinel solution for SAP applications, and is typically handled by your SAP team.

:::image type="content" source="media/deployment-steps/prepare-sap-environment.png" alt-text="Diagram of the deployment flow for the Microsoft Sentinel solution for SAP applications, with the preparing SAP step highlighted.":::

[!INCLUDE [unified-soc-preview-without-alert](../includes/unified-soc-preview-without-alert.md)]

## Prerequisites

Before you start, make sure to review the [prerequisites for deploying the Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md). 

## Configure the Microsoft Sentinel role

To allow the SAP data connector to connect to your SAP system, you must create a SAP system role. We recommend creating the role by loading the role authorizations from the [**/MSFTSEN/SENTINEL_RESPONDER**](https://aka.ms/SAP_Sentinel_Responder_Role) file, as described in the next step, [Configure SAP authorizations and deploy optional SAP change requests](preparing-sap.md).

The **/MSFTSEN/SENTINEL_RESPONDER** role includes both log retrieval and [attack disruption response actions](https://aka.ms/attack-disrupt-defender). To enable only log retrieval, without attack disruption response actions, either deploy the SAP *NPLK900271* CR on the SAP system, or load the role authorizations from the [**MSFTSEN_SENTINEL_CONNECTOR**](https://aka.ms/SAP_Sentinel_Connector_Role) file. The **/MSFTSEN/SENTINEL_CONNECTOR** role that has all the basic permissions for the data connector to operate.

| SAP BASIS versions | Sample CR |
| --- | --- |
| Any version  | *NPLK900271*: [K900271.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900271.NPL), [R900271.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900271.NPL) | 

> [!TIP]
> Experienced SAP administrators might choose to create the role manually and assign it the appropriate permissions. In such cases, create a role manually with the relevant authorizations required for the logs you want to ingest. For more information, see [Required ABAP authorizations](#required-abap-authorizations). The examples in this procedure use the **/MSFTSEN/SENTINEL_RESPONDER** name.
>

**To configure the role**:

1. <!--is this correct?-->In your SAP system, upload role authorizations from the [**/MSFTSEN/SENTINEL_RESPONDER**](https://aka.ms/SAP_Sentinel_Responder_Role) file in GitHub. 

    This creates the **/MSFTSEN/SENTINEL_RESPONDER** role, which includes all the authorizations required to retrieve logs from the SAP systems and run [attack disruption response actions](https://aka.ms/attack-disrupt-defender).

1. Generate an active role profile for Microsoft Sentinel to use by running the **PFCG** transaction. In the **SAP Easy Access** screen, enter `PFCG` in the field in the upper left corner of the screen and then press **ENTER**.

1. In the **Role Maintenance** window, enter the `/MSFTSEN/SENTINEL_RESPONDER` role name in the **Role** field and select the **Change** button.

1. In the **Change Roles** window that appears, select **Authorizations** > **Change Authorization Data**.

1. In the **Information** popup, read the message and select the green checkmark to confirm.

1. In the **Change Role: Authorizations** window, select **Generate**, and then note that the **Status** field has changed from **Unchanged** to **generated**.

1. Select **Back** to return to the **Change Roles** window, and note there that the **Authorizations** tab displays a green box.

1. Select **Save** to save your changes.

### Create a user

The Microsoft Sentinel solution for SAP applications requires a user account to connect to your SAP system. Use the following instructions to create a user account and assign it to the role that you created in the previous step.

In the examples shown here, we use the role name **/MSFTSEN/SENTINEL_RESPONDER**.

1. Run the **SU01** transaction:

    In the **SAP Easy Access** screen, enter `SU01` in the field in the upper left corner of the screen and press **ENTER**.

1. In the **User Maintenance: Initial Screen** screen, enter the name of the new user in the **User** field and select **Create Technical User** from the button bar.

1. In the **Maintain Users** screen, select **System** from the **User Type** drop-down list. Create and enter a complex password in the **New Password** and **Repeat Password** fields, then select the **Roles** tab.

1. In the **Roles** tab, in the **Role Assignments** section, enter the full name of the role - `/MSFTSEN/SENTINEL_RESPONDER` in our example - and press **Enter**.

    After pressing **Enter**, verify that the right-hand side of the **Role Assignments** section populates with data, such as **Change Start Date**.

1. Select the **Profiles** tab, verify that a profile for the role appears under **Assigned Authorization Profiles**, and select **Save**.

### Required ABAP authorizations

This section lists the ABAP authorizations required to ensure that the SAP user account used by Microsoft Sentinel's SAP data connector can correctly retrieve logs from the SAP systems and run [attack disruption response actions](https://aka.ms/attack-disrupt-defender).

The required authorizations are listed here by their purpose. You only need the authorizations that are listed for the kinds of logs you want to bring into Microsoft Sentinel and the attack disruption response actions you want to apply.

> [!TIP]
> To create a role with all the required authorizations, load the role authorizations from the [**/MSFTSEN/SENTINEL_RESPONDER**](https://aka.ms/SAP_Sentinel_Responder_Role) file.
>
> Alternately, to enable only log retrieval, without attack disruption response actions, deploy the SAP *NPLK900271* CR on the SAP system to create the **/MSFTSEN/SENTINEL_CONNECTOR** role, or load the role authorizations from the [**/MSFTSEN/SENTINEL_CONNECTOR**](https://aka.ms/SAP_Sentinel_Connector_Role) file.

If needed, you can [remove the user role and the optional CR installed on your ABAP system](deployment-solution-configuration.md#remove-the-user-role-and-the-optional-cr-installed-on-your-abap-system).

:::row:::
    :::column:::
        [ABAP application log](#abap-application-log)
        [ABAP change documents log](#abap-change-documents-log)
        [ABAP CR log](#abap-cr-log)
        [ABAP DB table data log](#abap-db-table-data-log)
        [ABAP job log](#abap-job-log)
        [ABAP security audit log](#abap-security-audit-log)
        [ABAP spool logs](#abap-spool-logs)
        [ABAP workflow log](#abap-workflow-log)
        [All logs](#all-logs)
    :::column-end:::
    :::column:::
        [Attack disruption response actions](#attack-disruption-response-actions)
        [Configuration history](#configuration-history)
        [Optional logs, if the Microsoft Sentinel solution CR is implemented](#optional-logs-if-the-microsoft-sentinel-solution-cr-is-implemented)
        [SNC data](#snc-data)
        [User data](#user-data)
    :::column-end:::
:::row-end:::

#### ABAP application log

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_RFC | RFC_NAME | BAPI_XBP_APPL_LOG_CONTENT_GET |
| S_RFC | RFC_NAME | BAPI_XMI_LOGOFF |
| S_RFC | RFC_NAME | BAPI_XMI_LOGON |
| S_RFC | RFC_NAME | BAPI_XMI_SET_AUDITLEVEL |
| S_TABU_NAM | TABLE | BALHDR |
| S_XMI_PROD | EXTCOMPANY | Microsoft |
| S_XMI_PROD | EXTPRODUCT | Azure Sentinel |
| S_XMI_PROD | INTERFACE | XBP |
| S_APPL_LOG | ALG_OBJECT | * |
| S_APPL_LOG | ALG_SUBOBJ | * |
| S_APPL_LOG | ACTVT | Display |


#### ABAP change documents log

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | CDHDR |
| S_TABU_NAM | TABLE | CDPOS |

#### ABAP CR log

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_RFC | RFC_NAME | CTS_API_READ_CHANGE_REQUEST |
| S_TABU_NAM | TABLE | E070 |
| S_TRANSPRT | TTYPE | * |
| S_TRANSPRT | ACTVT | Display |

#### ABAP DB table data log

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | DBTABLOG |
| S_TABU_NAM | TABLE | SACF_ALERT |
| S_TABU_NAM | TABLE | SOUD |
| S_TABU_NAM | TABLE | USR41 |
| S_TABU_NAM | TABLE | TMSQAFILTER |

#### ABAP job log

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_RFC | RFC_NAME | BAPI_XBP_JOB_JOBLOG_READ |
| S_RFC | RFC_NAME | BAPI_XMI_LOGOFF |
| S_RFC | RFC_NAME | BAPI_XMI_LOGON |
| S_RFC | RFC_NAME | BAPI_XMI_SET_AUDITLEVEL |
| S_TABU_NAM | TABLE | TBTCO |
| S_XMI_PROD | EXTCOMPANY | Microsoft |
| S_XMI_PROD | EXTPRODUCT | Azure Sentinel |
| S_XMI_PROD | INTERFACE | XBP |


#### ABAP security audit log

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_RFC | RFC_NAME | BAPI_USER_GET_DETAIL |
| S_RFC | RFC_NAME | BAPI_XMI_LOGOFF |
| S_RFC | RFC_NAME | BAPI_XMI_LOGON |
| S_RFC | RFC_NAME | BAPI_XMI_SET_AUDITLEVEL |
| S_RFC | RFC_NAME | BAPI_SYSTEM_MTE_GETMLHIS |
| S_RFC | RFC_NAME | BAPI_SYSTEM_MTE_GETTREE |
| S_RFC | RFC_NAME | BAPI_SYSTEM_MTE_GETTIDBYNAME |
| S_RFC | RFC_NAME | BAPI_SYSTEM_MS_GETLIST |
| S_RFC | RFC_NAME | BAPI_SYSTEM_MON_GETLIST |
| S_RFC | RFC_NAME | BAPI_SYSTEM_MON_GETTREE |
| S_RFC | RFC_NAME | BAPI_SYSTEM_MTE_GETPERFCURVAL |
| S_RFC | RFC_NAME | BAPI_SYSTEM_MT_GETALERTDATA |
| S_RFC | RFC_NAME | BAPI_SYSTEM_ALERT_ACKNOWLEDGE |
| S_ADMI_FCD | S_ADMI_FCD | AUDD (Basis audit display auth.) |
| S_SAL | SAL_ACTVT | SHOW_LOG (Evaluate the file-based log) |
| S_USER_GRP | CLASS | SUPER |
| S_USER_GRP | ACTVT | Display |
| S_USER_GRP | CLASS | SUPER |
| S_USER_GRP | ACTVT | Lock |
| S_XMI_PROD | EXTCOMPANY | Microsoft |
| S_XMI_PROD | EXTPRODUCT | Azure Sentinel |
| S_XMI_PROD | INTERFACE | XAL |


#### ABAP spool logs

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | TSP01 |
| S_ADMI_FCD | S_ADMI_FCD | SPOS (Use of Transaction SP01 (all systems)) |


#### ABAP workflow log

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | SWWLOGHIST |
| S_TABU_NAM | TABLE | SWWWIHEAD |

#### All logs

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_RFC | RFC_TYPE | Function Module |
| S_RFC | RFC_NAME | /OSP/SYSTEM_TIMEZONE |
| S_RFC | RFC_NAME | DDIF_FIELDINFO_GET |
| S_RFC | RFC_NAME | RFCPING |
| S_RFC | RFC_NAME | RFC_GET_FUNCTION_INTERFACE |
| S_RFC | RFC_NAME | RFC_READ_TABLE |
| S_RFC | RFC_NAME | RFC_SYSTEM_INFO |
| S_RFC | RFC_NAME | SUSR_USER_AUTH_FOR_OBJ_GET |
| S_RFC | RFC_NAME | TH_SERVER_LIST |
| S_RFC | ACTVT | Execute |
| S_TCODE | TCD | SM51 |
| S_TABU_NAM | ACTVT | Display |
| S_TABU_NAM | TABLE | T000 |

#### Attack disruption response actions

<a name=attack-disrupt></a>

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
|S_RFC	|RFC_TYPE	|Function Module |
|S_RFC	|RFC_NAME	|BAPI_USER_LOCK |
|S_RFC	|RFC_NAME	|BAPI_USER_UNLOCK |
|S_RFC	|RFC_NAME	|TH_DELETE_USER <br>In contrast to its name, this function doesn't delete users, but ends the active user session. |
|S_USER_GRP	|CLASS	|* <br>We recommend replacing S_USER_GRP CLASS with the relevant classes in your organization that represent dialog users. |
|S_USER_GRP	|ACTVT	|03 |
|S_USER_GRP	|ACTVT	|05 |

#### Configuration history

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | PAHI |

#### Optional logs, if the Microsoft Sentinel solution CR is implemented

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_RFC | RFC_NAME | /MSFTSEN/* |


#### SNC data

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | SNCSYSACL |
| S_TABU_NAM | TABLE | USRACL |

#### User data

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | ADCP |
| S_TABU_NAM | TABLE | ADR6 |
| S_TABU_NAM | TABLE | AGR_1251 |
| S_TABU_NAM | TABLE | AGR_AGRS |
| S_TABU_NAM | TABLE | AGR_DEFINE |
| S_TABU_NAM | TABLE | AGR_FLAGS |
| S_TABU_NAM | TABLE | AGR_PROF |
| S_TABU_NAM | TABLE | AGR_TCODES |
| S_TABU_NAM | TABLE | AGR_USERS |
| S_TABU_NAM | TABLE | DEVACCESS |
| S_TABU_NAM | TABLE | USER_ADDR |
| S_TABU_NAM | TABLE | USGRP_USER |
| S_TABU_NAM | TABLE | USR01 |
| S_TABU_NAM | TABLE | USR02 |
| S_TABU_NAM | TABLE | USR05 |
| S_TABU_NAM | TABLE | USR21 |
| S_TABU_NAM | TABLE | USRSTAMP |
| S_TABU_NAM | TABLE | UST04 |

## Deploy optional CRs

This section presents a step-by-step guide to deploying extra, optional CRs. It's intended for SOC engineers or implementers who might not necessarily be SAP experts.

Experienced SAP administrators that are familiar with the CR deployment process might prefer to get the appropriate CRs directly from the [SAP environment validation steps](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#sap-environment-validation-steps) section of the guide and deploy them.

We strongly recommend that deploying SAP CRs is done by an experienced SAP system administrator.

The following table describes the optional CRs available to deploy:

|CR |Description |
|---------|---------|
|**NPLK900271**  |Creates and configures a sample role with the basic authorizations required to allow the SAP data connector to connect to your SAP system. Alternatively, you can load authorizations directly from a file or manually define the role according to the logs you want to ingest. <br><br>For more information, see [Required ABAP authorizations](#required-abap-authorizations) and [Create and configure a role (required)](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#create-and-configure-a-role-required). |
|**NPLK900201** or **NPLK900202**  |[Retrieves additional information from SAP](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#retrieve-additional-information-from-sap-optional). Select one of these CRs according to your SAP version. |

### Prerequisites for deploying CRs

1. Make sure you've copied the details of the **SAP system version**, **System ID (SID)**, **System number**, **Client number**, **IP address**, **administrative username**, and **password** before beginning the deployment process. For the following example, the following details are assumed:

    - **SAP system version:** `SAP ABAP Platform 1909 Developer edition`
    - **SID:** `A4H`
    - **System number:** `00`
    - **Client number:** `001`
    - **IP address:** `192.168.136.4`
    - **Administrator user:** `a4hadm`, however, the SSH connection to the SAP system is established with `root` user credentials.

1. Make sure you know which [CR you want to deploy](#deploy-optional-crs).

1. If you're deploying the NPLK900202 CR to retrieve additional information, make sure you've installed the [relevant SAP note](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#deploy-sap-note-optional).

### Set up the files

1. Sign in to the SAP system using SSH.

1. Transfer the CR files to the SAP system or download the files directly onto the SAP system from the SSH prompt. Use the following commands:

    - **To download NPLK900271**

        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900271.NPL
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900271.NPL
        ```

        Alternatively, [load these authorizations directly from a file](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#create-and-configure-a-role-required).
  
    - **To download NPLK900202**

        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900202.NPL
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900202.NPL
        ```

    - **To download NPLK900201**

        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900201.NPL
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900201.NPL
        ```    

    Each CR consists of two files, one beginning with K and one with R.

1. Change the ownership of the files to the *`<sid> `adm* user and the *sapsys* group. In the following sample code, substitute your SAP system ID for `<sid>`.

    ```bash
    chown <sid>adm:sapsys *.NPL
    ```

    For example:

    ```bash
    chown a4hadm:sapsys *.NPL
    ```

1. Copy the cofiles, which begin with *K* to the `/usr/sap/trans/cofiles` folder. Preserve the permissions while copying, using the `cp` command with the `-p` switch.

    ```bash
    cp -p K*.NPL /usr/sap/trans/cofiles/
    ```

1. Copy the data files, which begin with R, to the `/usr/sap/trans/data` folder. Preserve the permissions while copying, using the `cp` command with the `-p` switch.

    ```bash
    cp -p R*.NPL /usr/sap/trans/data/
    ```

### Import the CRs

<!--i don't see this in SAP docs, but im not sure we should go into such detail. is there something we can refer to? even if it's behind a paywall.-->

The screenshots shown in this procedure are examples, and your SAP system may look different.

1. Launch the **SAP Logon** application and sign in to the SAP GUI console.

    :::image type="content" source="media/preparing-sap/stms-import.png" alt-text="Screenshot of running the STMS import transaction.":::    

1. Run the **STMS_IMPORT** transaction. To do this, in the **SAP Easy Access** screen, search for `STMS_IMPORT` and then press **ENTER**.

1. In the **Import Queue** window that appears, select **More > Extras > Other Requests > Add**.

    :::image type="content" source="media/preparing-sap/import-queue-add.png" alt-text="Screenshot of adding an import queue.":::

1. In the **Add Transport Requests to Import Queue** pop-up that appears, select the **Transp. Request** field.

1. The **Transport requests** window appears, listing the CRs available for deployment. Select a CR to import and then select the green checkmark button.

1. Back in the **Add Transport Request to Import Queue** window, select **Continue** or press **ENTER**.

1. In the **Add Transport Request** confirmation dialog, select **Yes**.

1. If you plan to deploy more CRs, repeat the previous steps in this procedure for the remaining CRs.

1. When you're done deploying all your CRs, in the **Import Queue** window, select the relevant Transport Request, and then select **F9** or **Select/Deselect Request** icon.

    If you have remaining Transport Requests to add to the deployment, repeat this step as needed.

1. Select the :::image type="icon" source="media/preparing-sap/import-requests-button.png" border="false"::: **Import Requests** button, and then in the **Start Import** window, select the **Target Client** field.

1. The **Input Help..** dialog appears. Select the number of the client you want to deploy the CRs to (`001` in our example), then select the green checkmark to confirm.

1. Back in the **Start Import** window, select the **Options** tab, mark the **Ignore Invalid Component Version** checkbox, and then select the green checkmark to confirm.

    :::image type="content" source="media/preparing-sap/start-import.png" alt-text="Screenshot of the start import window.":::

1. In the **Start import** confirmation dialog, select **Yes** to confirm the import.

1. Back in the **Import Queue** window, select **Refresh**, wait until the import operation completes and the import queue shows as empty.

1. To review the import status, in the **Import Queue** window select **More > Go To > Import History**.

    :::image type="content" source="media/preparing-sap/import-history.png" alt-text="Screenshot of import history.":::

1. If you deployed the *NPLK900202* CR, it's expected to display a **Warning**. Select the entry with the warning to verify that the warnings displayed are of type  `"Table \<tablename\>` was activated."

    For example:

    :::image type="content" source="media/preparing-sap/import-status.png" alt-text="Screenshot of import status display." lightbox="media/preparing-sap/import-status-lightbox.png":::

    :::image type="content" source="media/preparing-sap/import-warning.png" alt-text="Screenshot of import warning message display.":::

## Verify that the PAHI table is updated at regular intervals

The SAP PAHI table includes data on the history of the SAP system, the database, and SAP parameters. In some cases, the Microsoft Sentinel solution for SAP applications can't monitor the SAP PAHI table at regular intervals, due to missing or faulty configuration. It's important to update the PAHI table and to monitor it frequently, so that the Microsoft Sentinel solution for SAP applications can alert on suspicious actions that might happen at any time throughout the day. For more information, see:

- [SAP note 12103](https://launchpad.support.sap.com/#/notes/12103)
- [Monitoring the configuration of static SAP security parameters (Preview)](sap-solution-security-content.md#monitoring-the-configuration-of-static-sap-security-parameters-preview)

> [!TIP]
> For optimal results, in your machine's *systemconfig.json* file, under the `[ABAP Table Selector]` section, enable both the `PAHI_FULL` and the `PAHI_INCREMENTAL` parameters. For more information, see [Systemconfig.json file reference](reference-systemconfig-json.md#abap-table-selector-section).

### Verify that the PAHI table is updated at regular intervals

1. Check whether the `SAP_COLLECTOR_FOR_PERFMONITOR` job, based on the RSCOLL00 program, is scheduled and running hourly, by the DDIC user in the 000 client.

1. Check whether the `RSHOSTPH`, `RSSTATPH` and `RSDB_PAR` report names are maintained in the TCOLL table:

    - `RSHOSTPH` report: Reads the operating system kernel parameters and stores this data in the PAHI table. 
    - `RSSTATPH` report: Reads the SAP profile parameters and stores this data in the PAHI table. 
    - `RSDB_PAR` report: Reads the database parameters and stores them in the PAHI table.

If the job exists and is configured correctly, no further steps are needed.

### Configure the SAP_COLLECTOR_FOR_PERFMONITOR job if it doesn't already exist

The screenshots shown in this procedure are examples, and your SAP system may look different.

1. Sign in to your SAP system in the 000 client and run the `SM36` transaction.

1. In the **Job Name** field, enter *SAP_COLLECTOR_FOR_PERFMONITOR*.

    :::image type="content" source="media/preparing-sap/pahi-table-job-name.png" alt-text="Screenshot of adding the job used to monitor the SAP PAHI table.":::

1. Select **Step** and enter the following details:

    - **User**: Enter *DDIC*.
    - **ABAP Program Name**: Enter *RSCOLL00*.

1. Save the configuration as shown in the following image:

    :::image type="content" source="media/preparing-sap/pahi-table-define-user.png" alt-text="Screenshot of defining a user for the job used to monitor the SAP PAHI table.":::

1. Press **F3** to return to the previous screen, and then select **Start Condition** to define the start condition.

1. Select **Immediate** and then select the **Periodic job** checkbox.

    :::image type="content" source="media/preparing-sap/pahi-table-periodic-job.png" alt-text="Screenshot of defining the job used to monitor the SAP PAHI table as periodic.":::

1. Select **Period values** and then select **Hourly**.

1. Select **Save** inside the dialog, and then select **Save** at the bottom.

    :::image type="content" source="media/preparing-sap/pahi-table-hourly-job.png" alt-text="Screenshot of defining the job used to monitor the SAP PAHI table as hourly.":::

1. To release the job, select **Save** at the top.

    :::image type="content" source="media/preparing-sap/pahi-table-release-job.png" alt-text="Screenshot of releasing the job used to monitor the SAP PAHI table as hourly.":::

## Next steps

Your SAP environment is now fully prepared to deploy a data connector agent. A role and profile are provisioned, a user account is created and assigned the relevant role profile, and CRs are deployed as needed for your environment.

Now, you're ready to deploy and configure SAP data connector agent.

> [!div class="nextstepaction"]
> [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
