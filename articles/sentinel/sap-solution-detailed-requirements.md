---
title: Azure Sentinel SAP solution detailed SAP requirements | Microsoft Docs
description: Learn about the detailed SAP system requirements for the Azure Sentinel SAP solution.
author: batamig
ms.author: bagold
ms.service: azure-sentinel
ms.topic: reference
ms.custom: mvc
ms.date: 06/09/2021
ms.subservice: azure-sentinel

---

# Azure Sentinel SAP solution detailed SAP requirements (public preview)

The [default procedure for deploying the Azure Sentinel SAP solution](sap-deploy-solution.md) includes the required SAP change requests and SAP notes, and provides a built-in role with all required permissions.

This article lists the required SAP change requests, notes, and permissions in detail.

Use this article as a reference if you're an admin, or if you're [deploying the SAP solution manually](sap-solution-deploy-alternate.md). This article is intended for advanced SAP users.


> [!IMPORTANT]
> The Azure Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Recommended virtual machine sizing

The following table describes the recommended sizing for your virtual machine, depending on your intended usage:

|Usage  |Recommended sizing  |
|---------|---------|
|**Minimum specification**, such as for a lab environment     |   A *Standard_B2s* VM      |
|**Standard connector** (default)     |   A *DS2_v2* VM, with: <br>- 2 cores<br>- 8 GB memory      |
|**Multiple connectors**     |A *Standard_B4ms* VM, with: <br>- 4 cores<br>- 16 GB memory         |
|     |         |

## Required SAP log change requests

The following SAP log change requests are required for the SAP solution, depending on your SAP Basis version:

- **SAP Basis versions 7.50 and higher**,  install NPLK900144
- **For lower versions**,  install NPLK900146
- **To create an SAP role with the required authorizations**, for any supported SAP Basis version, install NPLK900140. For more information, see [Configure your SAP system](sap-deploy-solution.md#configure-your-sap-system) and [Required ABAP authorizations](#required-abap-authorizations).

> [!NOTE]
> The required SAP log change requests expose custom RFC FMs that are required for the connector, and do not change any standard or custom objects.
>

## Required SAP notes

If you have an SAP Basis version of 7.50 or lower, install the following SAP notes:

|SAP BASIS versions  |Required note |
|---------|---------|
|- 750 SP01 to SP12<br>- 751 SP01 to SP06<br>- 752 SP01 to SP03     |  2641084: Standardized read access for the Security Audit log data       |
|- 700 to 702<br>- 710 to 711, 730, 731, 740, and 750     | 2173545: CD: CHANGEDOCUMENT_READ_ALL        |
|- 700 to 702<br>- 710 to 711, 730, 731, and 740<br>- 750 to 752     | 2502336: CD (Change Document): RSSCD100 - read only from archive, not from database        |
|     |         |

Access the SAP notes from the [SAP support Launchpad site](https://support.sap.com/en/index.html).

## Required ABAP authorizations

The following table lists the ABAP authorizations required for the backend SAP user to connect Azure Sentinel to the SAP logs. For more information, see [Configure your SAP system](sap-deploy-solution.md#configure-your-sap-system).

Required authorizations are listed by log type. You only need the authorizations listed for the types of logs you plan to ingest into Azure Sentinel.

> [!TIP]
> To create the role with all required authorizations, deploy the SAP change request [NPLK900114](#required-sap-log-change-requests) on your SAP system. This change request creates the **/MSFTSEN/SENTINEL_CONNECTOR** role, and assigns the role to the ABAP user connecting to Azure Sentinel.
>

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
| S_XMI_PRD | EXTPRODUCT | Azure Sentinel |
| **ABAP Security Audit Log - SAL** | | |
| S_RFC | FUGR | RSAU_LOG |
| S_RFC | FUGR | /MSFTSEN/_AUDITLOG |
| **ABAP Spool Log, ABAP Spool Output Log** | | |
| S_RFC | FUGR | /MSFTSEN/_SPOOL |
| **ABAP Workflow Log** | | |
| S_RFC | FUGR | SWRR |
| S_RFC | FUGR | /MSFTSEN/_WF |
| | |

## Next steps

For more information, see:

- [Deploy the Azure Sentinel solution for SAP](sap-deploy-solution.md)
- [Expert configuration options, on-premises deployment and SAPControl log sources](sap-solution-deploy-alternate.md)
- [Azure Sentinel SAP solution logs reference](sap-solution-log-reference.md)
- [Azure Sentinel SAP solution: available security content](sap-solution-security-content.md)
- [Troubleshooting your Azure Sentinel SAP solution deployment](sap-deploy-troubleshoot.md)
