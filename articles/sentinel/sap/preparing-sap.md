---
title: Configure your SAP system for the Microsoft Sentinel solution
titleSuffix: Microsoft Sentinel
description: Learn about extra preparations required in your SAP system to install the SAP data connector agent and connect Microsoft Sentinel to your SAP system.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 05/28/2024
#customerIntent: As an SAP admin, I want to know how to configure SAP authorizations and deploy and SAP change requests (CRs) to prepare the environment for the installation of the SAP agent, so that it can properly connect to my SAP systems.
---

# Configure your SAP system for the Microsoft Sentinel solution

This article describes how to prepare your environment for the installation of the SAP agent so that it can properly connect to your SAP systems. Preparation includes configuring required SAP authorizations and, optionally, deploying extra SAP change requests (CRs).

This article is part of the second step in deploying the Microsoft Sentinel solution for SAP applications.

:::image type="content" source="media/deployment-steps/prepare-sap-environment.png" alt-text="Diagram of the deployment flow for the Microsoft Sentinel solution for SAP applications, with the preparing SAP step highlighted." border="false":::

The procedures in this article are typically performed by your **SAP BASIS** team.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Prerequisites

- Before you start, make sure to review the [prerequisites for deploying the Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

## Configure the Microsoft Sentinel role

To allow the SAP data connector to connect to your SAP system, you must create an SAP system role specifically for this purpose. We recommend creating the role by loading the role authorizations from the [**/MSFTSEN/SENTINEL_RESPONDER**](https://aka.ms/SAP_Sentinel_Responder_Role) file.

The **/MSFTSEN/SENTINEL_RESPONDER** role includes both log retrieval and [attack disruption response actions](https://aka.ms/attack-disrupt-defender). To enable only log retrieval, without attack disruption response actions, either deploy the SAP *NPLK900271* change request (CR) on the SAP system, or load the role authorizations from the [**MSFTSEN_SENTINEL_CONNECTOR**](https://aka.ms/SAP_Sentinel_Connector_Role) file. The **/MSFTSEN/SENTINEL_CONNECTOR** role that has all the basic permissions for the data connector to operate.

| SAP BASIS versions | Sample CR |
| --- | --- |
| Any version  | *NPLK900271*: [K900271.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900271.NPL), [R900271.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900271.NPL) |

> [!TIP]
> Experienced SAP administrators might choose to create the role manually and assign it the appropriate permissions. In such cases, create a role manually with the relevant authorizations required for the logs you want to ingest. For more information, see [Required ABAP authorizations](#required-abap-authorizations). The examples in this procedure use the **/MSFTSEN/SENTINEL_RESPONDER** name.
>

When configuring the role, we recommend that you:

- Generate an active role profile for Microsoft Sentinel by running the **PFCG** transaction.
- Use `/MSFTSEN/SENTINEL_RESPONDER` as the role name.

For more information, see the [SAP documentation](https://help.sap.com/doc/saphelp_nw73ehp1/7.31.19/en-US/48/e8eb38f94cb138e10000000a114084/frameset.htm).

### Create a user

The Microsoft Sentinel solution for SAP applications requires a user account to connect to your SAP system. Use the following instructions to create a user account and assign it to the role that you created in the previous step.

When creating your user:

- Make sure to create a system user.
- Assign the **/MSFTSEN/SENTINEL_RESPONDER** role to the user.

For more information, see the [SAP documentation](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/2c158dc83732454cb8830b3010e2c322/6c25624a03114f48a4c7a60105752cd4.html). <!--we need a better link-->

### Required ABAP authorizations

This section lists the ABAP authorizations required to ensure that the SAP user account used by Microsoft Sentinel's SAP data connector can correctly retrieve logs from the SAP systems and run [attack disruption response actions](https://aka.ms/attack-disrupt-defender).

The required authorizations are listed here by their purpose. You only need the authorizations that are listed for the kinds of logs you want to bring into Microsoft Sentinel and the attack disruption response actions you want to apply.

> [!TIP]
> To create a role with all the required authorizations, load the role authorizations from the [**/MSFTSEN/SENTINEL_RESPONDER**](https://aka.ms/SAP_Sentinel_Responder_Role) file.
>
> Alternately, to enable only log retrieval, without attack disruption response actions, deploy the SAP *NPLK900271* CR on the SAP system to create the **/MSFTSEN/SENTINEL_CONNECTOR** role, or load the role authorizations from the [**/MSFTSEN/SENTINEL_CONNECTOR**](https://aka.ms/SAP_Sentinel_Connector_Role) file.

If needed, you can [Remove the user role and any optional CR installed on your ABAP system](#remove-the-user-role-and-any-optional-cr-installed-on-your-abap-system).

:::row:::
    :::column:::
        - [ABAP application log](#abap-application-log)
        - [ABAP change documents log](#abap-change-documents-log)
        - [ABAP CR log](#abap-cr-log)
        - [ABAP DB table data log](#abap-db-table-data-log)
        - [ABAP job log](#abap-job-log)
        - [ABAP security audit log](#abap-security-audit-log)
        - [ABAP spool logs](#abap-spool-logs)
        - [ABAP workflow log](#abap-workflow-log)
        - [All logs](#all-logs)
    :::column-end:::
    :::column:::
        - [Attack disruption response actions](#attack-disruption-response-actions)
        - [Configuration history](#configuration-history)
        - [Optional logs, if the Microsoft Sentinel solution CR is implemented](#optional-logs-if-the-microsoft-sentinel-solution-cr-is-implemented)
        - [SNC data](#snc-data)
        - [User data](#user-data)
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
|S_RFC |RFC_TYPE |Function Module |
|S_RFC |RFC_NAME |BAPI_USER_LOCK |
|S_RFC |RFC_NAME |BAPI_USER_UNLOCK |
|S_RFC |RFC_NAME |TH_DELETE_USER <br>In contrast to its name, this function doesn't delete users, but ends the active user session. |
|S_USER_GRP |CLASS |* <br>We recommend replacing S_USER_GRP CLASS with the relevant classes in your organization that represent dialog users. |
|S_USER_GRP |ACTVT |03 |
|S_USER_GRP |ACTVT |05 |

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

## Configure SAP auditing

Some installations of SAP systems might not have audit logging enabled by default. For best results in evaluating the performance and efficacy of the Microsoft Sentinel solution for SAP applications, enable auditing of your SAP system and configure the audit parameters. If you want to ingest SAP HANA DB logs, make sure to also enable auditing for SAP HANA DB.

For more information, see the [SAP documentation](https://community.sap.com/t5/application-development-blog-posts/analysis-and-recommended-settings-of-the-security-audit-log-sm19-rsau/ba-p/13297094).
<!--this is where we'd redirect to from sap auditing-->

## Deploy optional CRs

This section lists extra, optional SAP change requests (CRs) available for you to deploy. Deploy the CRs on your SAP system as needed just as you'd deploy other CRs. We strongly recommend that deploying SAP CRs is done by an experienced SAP system administrator.

The following table describes the optional CRs available to deploy:

|CR |Description |
|---------|---------|
|**NPLK900271**  |Creates and configures a sample role with the basic authorizations required to allow the SAP data connector to connect to your SAP system. Alternatively, you can load authorizations directly from a file or manually define the role according to the logs you want to ingest. <br><br>For more information, see [Required ABAP authorizations](#required-abap-authorizations). |
|**NPLK900201** or **NPLK900202**  |[Requirements for retrieving additional information from SAP (optional)](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#requirements-for-retrieving-additional-information-from-sap-optional). Select one of these CRs according to your SAP version. |

For more information, see the [SAP Community](https://community.sap.com/t5/application-development-blog-posts/analysis-and-recommended-settings-of-the-security-audit-log-sm19-rsau/ba-p/13297094) and the [SAP documentation](https://help.sap.com/doc/saphelp_nw73ehp1/7.31.19/en-US/e1/5d9acae75c11d2b451006094b9ea64/frameset.htm). <!--we want a better link here-->

## Verify that the PAHI table is updated at regular intervals

The SAP PAHI table includes data on the history of the SAP system, the database, and SAP parameters. In some cases, the Microsoft Sentinel solution for SAP applications can't monitor the SAP PAHI table at regular intervals, due to missing or faulty configuration. It's important to update the PAHI table and to monitor it frequently, so that the Microsoft Sentinel solution for SAP applications can alert on suspicious actions that might happen at any time throughout the day. For more information, see:

- [SAP note 12103](https://launchpad.support.sap.com/#/notes/12103)
- [Monitoring the configuration of static SAP security parameters (Preview)](sap-solution-security-content.md#monitoring-the-configuration-of-static-sap-security-parameters-preview)

> [!TIP]
> For optimal results, in your machine's *systemconfig.json* file, under the `[ABAP Table Selector]` section, enable both the `PAHI_FULL` and the `PAHI_INCREMENTAL` parameters. For more information, see [Systemconfig.json file reference](reference-systemconfig-json.md#abap-table-selector).

If the PAHI table is updated regularly, the `SAP_COLLECTOR_FOR_PERFMONITOR` job is scheduled and runs hourly. If the `SAP_COLLECTOR_FOR_PERFMONITOR` job doesn't exist, make sure to configure it as needed. For more information, see the SAP documentation: [Database Collector in Background Processing](https://help.sap.com/doc/saphelp_nw75/7.5.5/en-US/c4/3a735b505211d189550000e829fbbd/frameset.htm) and [Configuring the Data Collector](https://help.sap.com/docs/SAP_NETWEAVER_AS_ABAP_752/3364beced9d145a5ad185c89a1e04658/c43a818c505211d189550000e829fbbd.html)

## Configure your system to use SNC for secure connections

By default, the SAP data connector agent connects to an SAP server using a remote function call (RFC) connection and a username and password for authentication.

However, you might need to make the connection on an encrypted channel or use client certificates for authentication. In these cases, use Smart Network Communications (SNC) from SAP to secure your data connections, as described in this section.

In a production environment, we strongly recommend that your consult with SAP administrators to create a deployment plan for configuring SNC. For more information, see the [SAP documentation](https://help.sap.com/docs/SAP_NETWEAVER_731/a42446bded624585958a36a71903a4a7/c3d2281db19ec347a2365fba6ab3b22b.html?q=SNC). <!--not sure this is the right link for us - it's Java only?-->

When configuring SNC:

- If the client certificate was issued by an enterprise certification authority, transfer the issuing CA and root CA certificates to the system where you plan to create the data connector agent.
- Make sure to also enter the relevant values and use the relevant procedures when [configuring the SAP data connector agent container](deploy-data-connector-agent-container.md).

## Remove the user role and any optional CR installed on your ABAP system

If you're turning off the SAP data connector agent and stopping log ingestion from your SAP system, we recommend that you also remove the user role and optional CRs installed on your ABAP system.

To do so, import the deletion CR *NPLK900259* into your ABAP system. For more information, see the [SAP documentation](https://help.sap.com/doc/saphelp_nw73ehp1/7.31.19/en-US/e1/5d9acae75c11d2b451006094b9ea64/frameset.htm). <!--we want a better link-->

## Next step

> [!div class="nextstepaction"]
> [Connect your SAP system by deploying your data connector agent container](deploy-data-connector-agent-container.md)

