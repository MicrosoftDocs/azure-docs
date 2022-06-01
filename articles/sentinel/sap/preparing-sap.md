---
title: Deploy SAP Change Requests (CRs) and configure authorization | Microsoft Docs
titleSuffix: Microsoft Sentinel
description: This article shows you how to deploy the SAP Change Requests (CRs) necessary to prepare the environment for the installation of the SAP agent, so that it can properly connect to your SAP systems.
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 04/07/2022
---
# Deploy SAP Change Requests (CRs) and configure authorization

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article shows you how to deploy the SAP Change Requests (CRs) necessary to prepare the environment for the installation of the SAP agent, so that it can properly connect to your SAP systems.

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Deployment milestones

Track your SAP solution deployment journey through this series of articles:

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. **Prepare SAP environment (*You are here*)**

1. [Deploy data connector agent](deploy-data-connector-agent-container.md)

1. [Deploy SAP security content](deploy-sap-security-content.md)

1. Optional deployment steps
   - [Configure auditing](configure-audit.md)
   - [Configure SAP data connector to use SNC](configure-snc.md)


> [!IMPORTANT]
> - This article presents a [**step-by-step guide**](#deploy-change-requests) to deploying the required CRs. It's recommended for SOC engineers or implementers who may not necessarily be SAP experts.
> - Experienced SAP administrators that are familiar with CR deployment process may prefer to get the appropriate CRs directly from the [**SAP environment validation steps**](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#sap-environment-validation-steps) section of the guide and deploy them. Note that the *NPLK900206* CR deploys a sample role, and the administrator may prefer to manually define the role according to the information in the [**Required ABAP authorizations**](#required-abap-authorizations) section below.

> [!NOTE]
> 
> It is *strongly recommended* that the deployment of SAP CRs be carried out by an experienced SAP system administrator.
>
> The steps below may differ according to the version of the SAP system and should be considered for demonstration purposes only.
> 
> Make sure you've copied the details of the **SAP system version**, **System ID (SID)**, **System number**, **Client number**, **IP address**, **administrative username** and **password** before beginning the deployment process.
>
> For the following example, the following details are assumed:
> - **SAP system version:** `SAP ABAP Platform 1909 Developer edition`
> - **SID:** `A4H`
> - **System number:** `00`
> - **Client number:** `001`
> - **IP address:** `192.168.136.4`
> - **Administrator user:** `a4hadm`, however, the SSH connection to the SAP system is established with `root` user credentials. 

The deployment of Microsoft Sentinel's Continuous Threat Monitoring for SAP solution requires the installation of several CRs. More details about the required CRs can be found in the [SAP environment validation steps](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#sap-environment-validation-steps) section of this guide.

To deploy the CRs, follow the steps outlined below:

## Deploy change requests

### Set up the files

1. Sign in to the SAP system using SSH.

1. Transfer the CR files to the SAP system.  
    Alternatively, you can download the files directly onto the SAP system from the SSH prompt. Use the following commands:  
    - Download NLPK900202
        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900202.NPL
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900202.NPL
        ```

    - Download NLPK900201
        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900201.NPL
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900201.NPL
        ```

    - Download NLPK900206
        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900206.NPL
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900206.NPL
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

    > [!CAUTION]
    > If an error occurs at this step, then you need to configure the SAP transport management system before proceeding any further. [**See this article for instructions**](configure-transport.md).

1. In the **Import Queue** window that appears, select **More > Extras > Other Requests > Add**.

    :::image type="content" source="media/preparing-sap/import-queue-add.png" alt-text="Screenshot of adding an import queue.":::

1. In the **Add Transport Requests to Import Queue** pop-up that appears, select the **Transp. Request** field.

1. The **Transport requests** window will appear and display a list of CRs available to be deployed. Select a CR and select the green checkmark button.

1. Back in the **Add Transport Request to Import Queue** window, select **Continue** (the green checkmark) or press the Enter key.

1. In the **Add Transport Request** confirmation dialog, select **Yes**.

1. Repeat the procedure in the preceding 5 steps to add the remaining Change Requests to be deployed.

1. In the **Import Queue** window, select the **Import All Requests** icon:

    :::image type="content" source="media/preparing-sap/import-all-requests.png" alt-text="Screenshot of importing all requests." lightbox="media/preparing-sap/import-all-requests-lightbox.png":::

1. In **Start Import** window, select the **Target Client** field.

1. The **Input Help..** dialog will appear. Select the number of the client you want to deploy the CRs to (`001` in our example), then select the green checkmark to confirm.

1. Back in the **Start Import** window, select the **Options** tab, mark the **Ignore Invalid Component Version** checkbox, and select the green checkmark to confirm.

    :::image type="content" source="media/preparing-sap/start-import.png" alt-text="Screenshot of the start import window.":::

1. In the **Start import** confirmation dialog, select **Yes** to confirm the import.

1. Back in the **Import Queue** window, select **Refresh**, wait until the import operation completes and the import queue shows as empty.

1. To review the import status, in the **Import Queue** window select **More > Go To > Import History**.

    :::image type="content" source="media/preparing-sap/import-history.png" alt-text="Screenshot of import history.":::

1. The *NPLK900202* change request is expected to display a **Warning**. Select the entry to verify that the warnings displayed are of type  "Table \<tablename\> was activated."

    :::image type="content" source="media/preparing-sap/import-status.png" alt-text="Screenshot of import status display." lightbox="media/preparing-sap/import-status-lightbox.png":::

    :::image type="content" source="media/preparing-sap/import-warning.png" alt-text="Screenshot of import warning message display.":::

## Configure Sentinel role

After the *NPLK900206* change request is deployed, a **/MSFTSEN/SENTINEL_CONNECTOR** role is created in SAP. If the role is created manually, it may bear a different name.

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

Microsoft Sentinel's Continuous Threat Monitoring solution for SAP requires a user account to connect to your SAP system. Use the following instructions to create a user account and assign it to the role that you created in the previous step.

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
> To create a role with all the required authorizations, deploy the SAP change request *NPLK900206* on the SAP system. This change request creates the **/MSFTSEN/SENTINEL_CONNECTOR** role that has all the necessary permissions for the data connector to operate.

| Authorization Object | Field | Value |
| -------------------- | ----- | ----- |
| **All RFC logs** | | |
| S_RFC | FUGR | /OSP/SYSTEM_TIMEZONE |
| S_RFC | FUGR | ARFC |
| S_RFC | FUGR | STFC |
| S_RFC | FUGR | RFC1 |
| S_RFC | FUGR | SDIFRUNTIME  |
| S_RFC | FUGR | SMOI |
| S_RFC | FUGR | SYST |
| S_RFC | FUGR/FUNC | SRFC/RFC_SYSTEM_INFO |
| S_RFC | FUGR/FUNC | THFB/TH_SERVER_LIST |
| S_TCODE | TCD | SM51 |
| **ABAP Application Log**  | | |
| S_APPL_LOG | ACTVT | Display |
| S_APPL_LOG | ALG_OBJECT | * |
| S_APPL_LOG | ALG_SUBOBJ | * |
| S_RFC | FUGR | SXBP_EXT |
| S_RFC | FUGR | /MSFTSEN/_APPLOG |
| **ABAP Change Documents Log** | | |
| S_RFC | FUGR | /MSFTSEN/_CHANGE_DOCS |
| **ABAP CR Log** | | |
| S_RFC | FUGR | CTS_API |
| S_RFC | FUGR | /MSFTSEN/_CR |
| S_TRANSPRT | ACTVT | Display |
| S_TRANSPRT | TTYPE | * |
| **ABAP DB Table Data Log** | | |
| S_RFC | FUGR | /MSFTSEN/_TD |
| S_TABU_DIS | ACTVT | Display |
| S_TABU_DIS | DICBERCLS | &NC& |
| S_TABU_DIS | DICBERCLS | + Any object required for logging |
| S_TABU_NAM | ACTVT | Display |
| S_TABU_NAM | TABLE | + Any object required for logging |
| S_TABU_NAM | TABLE | DBTABLOG |
| **ABAP Job Log** | | |
| S_RFC | FUGR | SXBP |
| S_RFC | FUGR | /MSFTSEN/_JOBLOG |
| **ABAP Job Log, ABAP Application Log** | | |
| S_XMI_PRD | INTERFACE | XBP |
| **ABAP Security Audit Log - XAL** | | |
| All RFC | S_RFC | FUGR |
| S_ADMI_FCD | S_ADMI_FCD | AUDD |
| S_RFC | FUGR | SALX |
| S_USER_GRP | ACTVT | Display |
| S_USER_GRP | CLASS | * |
| S_XMI_PRD | INTERFACE | XAL |
| **ABAP Security Audit Log - XAL, ABAP Job Log, ABAP Application Log** | | |
| S_RFC | FUGR | SXMI |
| S_XMI_PRD | EXTCOMPANY | Microsoft |
| S_XMI_PRD | EXTPRODUCT | Microsoft Sentinel |
| **ABAP Security Audit Log - SAL** | | |
| S_RFC | FUGR | RSAU_LOG |
| S_RFC | FUGR | /MSFTSEN/_AUDITLOG |
| **ABAP Spool Log, ABAP Spool Output Log** | | |
| S_RFC | FUGR | /MSFTSEN/_SPOOL |
| **ABAP Workflow Log** | | |
| S_RFC | FUGR | SWRR |
| S_RFC | FUGR | /MSFTSEN/_WF |
| **User Data** | | |
| S_RFC | FUNC | RFC_READ_TABLE |
| | |


## Next steps

You have now fully prepared your SAP environment. The required CRs have been deployed, a role and profile have been provisioned, and a user account has been created and assigned the proper role profile.

Now you are ready to deploy the data connector agent container.

> [!div class="nextstepaction"]
> [Deploy and configure the data connector agent container](deploy-data-connector-agent-container.md)
