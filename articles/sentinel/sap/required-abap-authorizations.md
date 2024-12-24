---
title: Required ABAP authorizations for the Microsoft Sentinel solution for SAP applications
description: Understand the ABAP authorizations required if you want to manually define roles based on the SAP logs you want to ingest to Microsoft Sentinel and the activities you want to run.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 09/16/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As an SAP BASIS team member, I want to manually configure SAP authorizations based on the specific log files that I want to ingest to Microsoft Sentinel.

---

# Required ABAP authorizations

This article lists the ABAP authorizations required to ensure that the SAP user account used by Microsoft Sentinel's SAP data connector can correctly retrieve logs from the SAP systems and [run attack disruption response actions](/defender-xdr/automatic-attack-disruption).

The required authorizations are listed here by their purpose. You only need the authorizations that are listed for the kinds of logs you want to bring into Microsoft Sentinel and the attack disruption response actions you want to apply.

> [!TIP]
> To create a role with all the required authorizations, load the role authorizations from the [**/MSFTSEN/SENTINEL_RESPONDER**](https://aka.ms/SAP_Sentinel_Responder_Role) file.
>
> Alternately, to enable only log retrieval, without attack disruption response actions, deploy the SAP *NPLK900271* CR on the SAP system to create the **/MSFTSEN/SENTINEL_CONNECTOR** role, or load the role authorizations from the [**/MSFTSEN/SENTINEL_CONNECTOR**](https://aka.ms/SAP_Sentinel_Connector_Role) file.

If needed, you can [remove the user role and any optional CR installed on your ABAP system](stop-collection.md#remove-the-user-role-and-any-optional-cr-installed-on-your-abap-system).

## ABAP application log

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

## ABAP change documents log

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | CDHDR |
| S_TABU_NAM | TABLE | CDPOS |

## ABAP CR log

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_RFC | RFC_NAME | CTS_API_READ_CHANGE_REQUEST |
| S_TABU_NAM | TABLE | E070 |
| S_TRANSPRT | TTYPE | * |
| S_TRANSPRT | ACTVT | Display |

## ABAP DB table data log

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | DBTABLOG |
| S_TABU_NAM | TABLE | SACF_ALERT |
| S_TABU_NAM | TABLE | SOUD |
| S_TABU_NAM | TABLE | USR41 |
| S_TABU_NAM | TABLE | TMSQAFILTER |

## ABAP job log

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

## ABAP security audit log

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

## ABAP spool logs

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | TSP01 |
| S_ADMI_FCD | S_ADMI_FCD | SPOS (Use of Transaction SP01 (all systems)) |

## ABAP workflow log

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | SWWLOGHIST |
| S_TABU_NAM | TABLE | SWWWIHEAD |

## All logs

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

## Attack disruption response actions

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

## Configuration history

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | PAHI |

## Optional logs, if the Microsoft Sentinel solution CR is implemented

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_RFC | RFC_NAME | /MSFTSEN/* |

## SNC data

| Authorization object | Field | Value |
| -------------------- | ----- | ----- |
| S_TABU_NAM | TABLE | SNCSYSACL |
| S_TABU_NAM | TABLE | USRACL |

## User data

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


## Related content

For more information, see [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md).