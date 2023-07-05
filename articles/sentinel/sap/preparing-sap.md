---
title: Deploy SAP Change Requests (CRs) and configure authorization
titleSuffix: Microsoft Sentinel
description: This article shows you how to deploy the SAP Change Requests (CRs) necessary to prepare the environment for the installation of the SAP agent, so that it can properly connect to your SAP systems.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 03/10/2023
---
# Deploy SAP Change Requests and configure authorization

This article shows you how to deploy SAP Change Requests (CRs), which prepare the environment for the installation of the SAP agent, so that it can properly connect to your SAP systems.

> [!IMPORTANT]
> - This article presents a [**step-by-step guide**](#deploy-crs) to deploying the relevant CRs. It's recommended for SOC engineers or implementers who may not necessarily be SAP experts.
> - Experienced SAP administrators that are familiar with the CR deployment process may prefer to get the appropriate CRs directly from the [**SAP environment validation steps**](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#sap-environment-validation-steps) section of the guide and deploy them. Note that the *NPLK900271* CR deploys a sample role, and the administrator may prefer to manually define the role according to the information in the [**Required ABAP authorizations**](#required-abap-authorizations) section below.

## Required and optional CRs

This article discusses the installation of the following CRs:

|CR |Required/optional |Description |
|---------|---------|---------|
|NPLK900271 |Required |This CR creates and configures a role. Alternatively, you can load the authorizations directly from a file. [Review how to create and configure a role](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#create-and-configure-a-role-required).  |
|NPLK900201 or NPLK900202 |Optional |[Retrieves additional information from SAP](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#retrieve-additional-information-from-sap-optional). You select one of these CRs according to your SAP version. |

## Prerequisites

1. Make sure you've copied the details of the **SAP system version**, **System ID (SID)**, **System number**, **Client number**, **IP address**, **administrative username** and **password** before beginning the deployment process. For the following example, the following details are assumed:

    - **SAP system version:** `SAP ABAP Platform 1909 Developer edition`
    - **SID:** `A4H`
    - **System number:** `00`
    - **Client number:** `001`
    - **IP address:** `192.168.136.4`
    - **Administrator user:** `a4hadm`, however, the SSH connection to the SAP system is established with `root` user credentials. 
1. Review the [SAP environment validation steps](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#sap-environment-validation-steps) to determine which CRs to install.
1. If you installed the NPLK900202 [optional CR](#required-and-optional-crs) used to retrieve additional information, make sure you've installed the [relevant SAP note](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#deploy-sap-note-optional).

## Deployment milestones

Track your SAP solution deployment journey through this series of articles:

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Work with the solution across multiple workspaces](cross-workspace.md) (PREVIEW)

1. **Prepare SAP environment (*You are here*)**

1. [Configure auditing](configure-audit.md)

1. [Deploy the solution content from the content hub](deploy-sap-security-content.md)

1. [Deploy data connector agent](deploy-data-connector-agent-container.md)

1. [Configure Microsoft Sentinel solution for SAP® applications](deployment-solution-configuration.md)

1. Optional deployment steps   
   - [Configure data connector to use SNC](configure-snc.md)
   - [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)
   - [Configure audit log monitoring rules](configure-audit-log-rules.md)
   - [Deploy SAP connector manually](sap-solution-deploy-alternate.md)
   - [Select SAP ingestion profiles](select-ingestion-profiles.md)

To deploy the CRs, follow the steps outlined below. The steps below may differ according to the version of the SAP system and should be considered for demonstration purposes only.

## Deploy CRs

> [!NOTE]
> 
> It is *strongly recommended* that the deployment of SAP CRs be carried out by an experienced SAP system administrator.

### Set up the files

1. Sign in to the SAP system using SSH.

1. Transfer the CR files to the SAP system. Learn more about [the CRs in this step](#required-and-optional-crs). 

    Alternatively, you can download the files directly onto the SAP system from the SSH prompt. Use the following commands:

    - Download NPLK900271 (required)
        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900271.NPL
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900271.NPL
        ```

        Alternatively, you can [load these authorizations directly from a file](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#create-and-configure-a-role-required).
  
    - Download NPLK900202 (optional)
        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900202.NPL
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900202.NPL
        ```

    - Download NPLK900201 (optional)
        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900201.NPL
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900201.NPL
        ```    

    Note that each CR consists of two files, one beginning with K and one with R.

1. Change the ownership of the files to user *`<sid>`adm* and group *sapsys*. (Substitute your SAP system ID for `<sid>`.)

    ```bash
    chown <sid>adm:sapsys *.NPL
    ```

    In our example:
    ```bash
    chown a4hadm:sapsys *.NPL
    ```

1. Copy the cofiles (those beginning with *K*) to the `/usr/sap/trans/cofiles` folder. Preserve the permissions while copying, using the `cp` command with the `-p` switch.

    ```bash
    cp -p K*.NPL /usr/sap/trans/cofiles/
    ```

1. Copy the data files (those beginning with R) to the `/usr/sap/trans/data` folder.  Preserve the permissions while copying, using the `cp` command with the `-p` switch.

    ```bash
    cp -p R*.NPL /usr/sap/trans/data/
    ```

### Import the CRs

1. Launch the **SAP Logon** application and sign in to the SAP GUI console.

1. Run the **STMS_IMPORT** transaction:

    In the **SAP Easy Access** screen, type `STMS_IMPORT` in the field in the upper left corner of the screen and press the **Enter** key.

    :::image type="content" source="media/preparing-sap/stms-import.png" alt-text="Screenshot of running the S T M S import transaction.":::    

1. In the **Import Queue** window that appears, select **More > Extras > Other Requests > Add**.

    :::image type="content" source="media/preparing-sap/import-queue-add.png" alt-text="Screenshot of adding an import queue.":::

1. In the **Add Transport Requests to Import Queue** pop-up that appears, select the **Transp. Request** field.

1. The **Transport requests** window will appear and display a list of CRs available to be deployed. Select a CR and select the green checkmark button.

1. Back in the **Add Transport Request to Import Queue** window, select **Continue** (the green checkmark) or press the Enter key.

1. In the **Add Transport Request** confirmation dialog, select **Yes**.

1. If you plan to deploy more CRs, repeat the procedure in the preceding 5 steps for the remaining CRs.

1. In the **Import Queue** window, select the relevant Transport Request once, and then select **F9** or **Select/Deselect Request** icon.

1. If you have remaining Transport Requests to add to the deployment, repeat step 9.

1. Select the Import Requests icon:

    :::image type="content" source="media/preparing-sap/import-requests.png" alt-text="Screenshot of importing all requests." lightbox="media/preparing-sap/import-requests-lightbox.png":::

1. In **Start Import** window, select the **Target Client** field.

1. The **Input Help..** dialog will appear. Select the number of the client you want to deploy the CRs to (`001` in our example), then select the green checkmark to confirm.

1. Back in the **Start Import** window, select the **Options** tab, mark the **Ignore Invalid Component Version** checkbox, and select the green checkmark to confirm.

    :::image type="content" source="media/preparing-sap/start-import.png" alt-text="Screenshot of the start import window.":::

1. In the **Start import** confirmation dialog, select **Yes** to confirm the import.

1. Back in the **Import Queue** window, select **Refresh**, wait until the import operation completes and the import queue shows as empty.

1. To review the import status, in the **Import Queue** window select **More > Go To > Import History**.

    :::image type="content" source="media/preparing-sap/import-history.png" alt-text="Screenshot of import history.":::

1. If you deployed the *NPLK900202* CR, it is expected to display a **Warning**. Select the entry to verify that the warnings displayed are of type  "Table \<tablename\> was activated."
    
    The CRs and versions in the screenshots below may change according to your installed CR version. 

    :::image type="content" source="media/preparing-sap/import-status.png" alt-text="Screenshot of import status display." lightbox="media/preparing-sap/import-status-lightbox.png":::

    :::image type="content" source="media/preparing-sap/import-warning.png" alt-text="Screenshot of import warning message display.":::

## Configure Sentinel role

After the *NPLK900271* CR is deployed, a **/MSFTSEN/SENTINEL_CONNECTOR** role is created in SAP. If the role is created manually, it may bear a different name.

In the examples shown here, we will use the role name **/MSFTSEN/SENTINEL_CONNECTOR**.

The next step is to generate an active role profile for Microsoft Sentinel to use.

1. Run the **PFCG** transaction:

    In the **SAP Easy Access** screen, type `PFCG` in the field in the upper left corner of the screen and press the **Enter** key.

1. In the **Role Maintenance** window, type the role name `/MSFTSEN/SENTINEL_CONNECTOR` in the **Role** field and select the **Change** button (the pencil).

    :::image type="content" source="media/preparing-sap/change-role-change.png" alt-text="Screenshot of choosing a role to change.":::

1. In the **Change Roles** window that appears, select the **Authorizations** tab.

1. In the **Authorizations** tab, select **Change Authorization Data**.

    :::image type="content" source="media/preparing-sap/change-role-change-auth-data.png" alt-text="Screenshot of changing authorization data.":::

1. In the **Information** popup, read the message and select the green checkmark to confirm.

1. In the **Change Role: Authorizations** window, select **Generate**.

    :::image type="content" source="media/preparing-sap/change-role-authorizations.png" alt-text="Screenshot of generating authorizations." lightbox="media/preparing-sap/change-role-authorizations-lightbox.png":::

    See that the **Status** field has changed from **Unchanged** to **generated**.

1. Select **Back** (to the left of the SAP logo at the top of the screen).

1. Back in the **Change Roles** window, verify that the **Authorizations** tab displays a green box, then select **Save**.

    :::image type="content" source="media/preparing-sap/change-role-save.png" alt-text="Screenshot of saving changed role.":::

### Create a user

The Microsoft Sentinel solution for SAP® applications requires a user account to connect to your SAP system. Use the following instructions to create a user account and assign it to the role that you created in the previous step.

In the examples shown here, we will use the role name **/MSFTSEN/SENTINEL_CONNECTOR**.

1. Run the **SU01** transaction:

    In the **SAP Easy Access** screen, type `SU01` in the field in the upper left corner of the screen and press the **Enter** key.

1. In the **User Maintenance: Initial Screen** screen, type in the name of the new user in the **User** field and select **Create Technical User** from the button bar.

1. In the **Maintain Users** screen, select **System** from the **User Type** drop-down list. Create and enter a complex password in the **New Password** and **Repeat Password** fields, then select the **Roles** tab.

1. In the **Roles** tab, in the **Role Assignments** section, enter the full name of the role - `/MSFTSEN/SENTINEL_CONNECTOR` in our example - and press **Enter**.

    After pressing **Enter**, verify that the right-hand side of the **Role Assignments** section populates with data, such as **Change Start Date**.

1. Select the **Profiles** tab, verify that a profile for the role appears under **Assigned Authorization Profiles**, and select **Save**.

### Required ABAP authorizations

The following table lists the ABAP authorizations required to ensure that SAP logs can be correctly retrieved by the account used by Microsoft Sentinel's SAP data connector.

The required authorizations are listed here by log type. Only the authorizations listed for the types of logs you plan to ingest into Microsoft Sentinel are required.

> [!TIP]
> To create a role with all the required authorizations, deploy the SAP *NPLK900271* CR on the SAP system, or load the role authorizations from the [MSFTSEN_SENTINEL_CONNECTOR_ROLE_V0.0.27.SAP](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Sample%20Authorizations%20Role%20File) file. This CR creates the **/MSFTSEN/SENTINEL_CONNECTOR** role that has all the necessary permissions for the data connector to operate.
> Alternatively, you can create a role that has minimal permissions by deploying the *NPLK900268* CR, or loading the role authorizations from the [MSFTSEN_SENTINEL_AGENT_BASIC_ROLE_V0.0.1.SAP](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Sample%20Authorizations%20Role%20File) file. This CR or authorizations file creates the **/MSFTSEN/SENTINEL_AGENT_BASIC** role. This role has the minimal required permissions for the data connector to operate. Note that if you choose to deploy this role, you might need to update it frequently.

| Authorization Object | Field | Value |
| -------------------- | ----- | ----- |
| **All logs** | | |
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
| **Optional - Only if Sentinel solution CR implemented** | | |
| S_RFC | RFC_NAME | /MSFTSEN/* |
| **ABAP Application Log** | | |
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
| **ABAP Change Documents Log** | | |
| S_TABU_NAM | TABLE | CDHDR |
| S_TABU_NAM | TABLE | CDPOS |
| **ABAP CR Log** | | |
| S_RFC | RFC_NAME | CTS_API_READ_CHANGE_REQUEST |
| S_TABU_NAM | TABLE | E070 |
| S_TRANSPRT | TTYPE | * |
| S_TRANSPRT | ACTVT | Display |
| **ABAP DB Table Data Log** | | |
| S_TABU_NAM | TABLE | DBTABLOG |
| S_TABU_NAM | TABLE | SACF_ALERT |
| S_TABU_NAM | TABLE | SOUD |
| S_TABU_NAM | TABLE | USR41 |
| S_TABU_NAM | TABLE | TMSQAFILTER |
| **ABAP Job Log** | | |
| S_RFC | RFC_NAME | BAPI_XBP_JOB_JOBLOG_READ |
| S_RFC | RFC_NAME | BAPI_XMI_LOGOFF |
| S_RFC | RFC_NAME | BAPI_XMI_LOGON |
| S_RFC | RFC_NAME | BAPI_XMI_SET_AUDITLEVEL |
| S_TABU_NAM | TABLE | TBTCO |
| S_XMI_PROD | EXTCOMPANY | Microsoft |
| S_XMI_PROD | EXTPRODUCT | Azure Sentinel |
| S_XMI_PROD | INTERFACE | XBP |
| **ABAP Spool Logs** | | |
| S_TABU_NAM | TABLE | TSP01 |
| S_ADMI_FCD | S_ADMI_FCD | SPOS (Use of Transaction SP01 (all systems)) |
| **ABAP Workflow Log** | | |
| S_TABU_NAM | TABLE | SWWLOGHIST |
| S_TABU_NAM | TABLE | SWWWIHEAD |
| **ABAP Security Audit Log** | | |
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
| **User Data** | | |
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
| **Configuration History** | | |
| S_TABU_NAM | TABLE | PAHI |
| **SNC Data** | | |
| S_TABU_NAM | TABLE | SNCSYSACL |
| S_TABU_NAM | TABLE | USRACL |

If needed, you can [remove the user role and the optional CR installed on your ABAP system](deployment-solution-configuration.md#remove-the-user-role-and-the-optional-cr-installed-on-your-abap-system).

## Verify that the PAHI table (history of system, database, and SAP parameters) is updated at regular intervals

The SAP PAHI table includes data on the history of the SAP system, the database, and SAP parameters. In some cases, the Microsoft Sentinel solution for SAP® applications can't monitor the SAP PAHI table at regular intervals, due to missing or faulty configuration (see the [SAP note](https://launchpad.support.sap.com/#/notes/12103) with more details on this issue). It's important to update the PAHI table and to monitor it frequently, so that the Microsoft Sentinel solution for SAP® applications can alert on suspicious actions that might happen at any time throughout the day. 

Learn more about how the Microsoft Sentinel solution for SAP® applications monitors [suspicious configuration changes to security parameters](sap-solution-security-content.md#monitoring-the-configuration-of-static-sap-security-parameters-preview).

> [!NOTE]
> For optimal results, in your machine's *systemconfig.ini* file, under the `[ABAP Table Selector]` section, enable both the `PAHI_FULL` and the `PAHI_INCREMENTAL` parameters. 

**To verify that the PAHI table is updated at regular intervals**:

1. Check whether the `SAP_COLLECTOR_FOR_PERFMONITOR` job, based on the RSCOLL00 program, is scheduled and running hourly, by the DDIC user in the 000 client.
1. Check whether the `RSHOSTPH`, `RSSTATPH` and `RSDB_PAR` report names are maintained in the TCOLL table. 
    - `RSHOSTPH` report: Reads the operating system kernel parameters and stores this data in the PAHI table. 
    - `RSSTATPH` report: Reads the SAP profile parameters and stores this data in the PAHI table. 
    - `RSDB_PAR` report: Reads the database parameters and stores them in the PAHI table.

If the job exists and is configured correctly, no further steps are needed.

**If the job doesn’t exist**: 

1. Log in to your SAP system in the 000 client.
1. Execute the SM36 transaction. 
1. Under **Job Name**, type *SAP_COLLECTOR_FOR_PERFMONITOR*.

    :::image type="content" source="media/preparing-sap/pahi-table-job-name.png" alt-text="Screenshot of adding the job used to monitor the SAP PAHI table.":::

1. Select **Step** and fill in this information:
    - Under **User**, type *DDIC*. 
    - Under *ABAP Program Name*, type *RSCOLL00*.
1. Save the configuration. 

    :::image type="content" source="media/preparing-sap/pahi-table-define-user.png" alt-text="Screenshot of defining a user for the job used to monitor the SAP PAHI table.":::

1. Select <kbd>F3</kbd> to go back to the previous screen.
1. Select **Start Condition** to define the start condition. 
1. Select **Immediate** and select the **Periodic job** checkbox.

    :::image type="content" source="media/preparing-sap/pahi-table-periodic-job.png" alt-text="Screenshot of defining the job used to monitor the SAP PAHI table as periodic.":::    

1. Select **Period values** and select **Hourly**. 
1. Select **Save** inside the dialog, and then select **Save** at the bottom. 

    :::image type="content" source="media/preparing-sap/pahi-table-hourly-job.png" alt-text="Screenshot of defining the job used to monitor the SAP PAHI table as hourly.":::       

1. To release the job, select **Save** at the top. 

    :::image type="content" source="media/preparing-sap/pahi-table-release-job.png" alt-text="Screenshot of releasing the job used to monitor the SAP PAHI table as hourly.":::

## Next steps

You have now fully prepared your SAP environment. The required CRs have been deployed, a role and profile have been provisioned, and a user account has been created and assigned the proper role profile.

Now you are ready to enable and configure SAP auditing for Microsoft Sentinel.

> [!div class="nextstepaction"]
> [Enable and configure SAP auditing for Microsoft Sentinel](configure-audit.md)
