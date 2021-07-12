---
title: Schemas for Azure Sentinel watchlist templates | Microsoft Docs
description: Learn about the schemas used in each built-in watchlist template in Azure Sentinel.
author: batamig
ms.author: bagold
ms.service: azure-sentinel
ms.topic: reference
ms.custom: mvc
ms.date: 07/12/2021
ms.subservice: azure-sentinel

---

# Azure Sentinel built-in watchlist template schemas (public preview)

This article details the schemas used in each built-in watchlist template provided by Azure Sentinel. For more information, see [Create a new watchlist using a template (Public preview)](watchlists.md#create-a-new-watchlist-using-a-template-public-preview).

> [!IMPORTANT]
> The Azure Sentinel watchlist templates are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## High Value Assets

| Filed Name | Format                 | Example                                    | Mandatory/Optional |
| ---------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Asset Type | [Device, Azure resource, AWS resource, URL,  SPO, File share, Other] | Azure resource                             | Mandatory          |
| Asset Id   | According to type      | /subscriptions/d1d8779d-38d7-4f06-91db-9cbc8de0176f/resourceGroups/SOC-Purview/providers/Microsoft.Storage/storageAccounts/purviewadls | Mandatory          |
| Asset Name | String                 | Microsoft.Storage/storageAccounts/purviewadls                                            | Optional           |
| Asset FQDN | FQDN                   | Finance-SRv.local.microsoft.com            | Mandatory          |
| IP Address | IP                     | 1.1.1.1                                    | Optional           |
| Tags       | List                   | ["SAW user","Amba Wolfs team"]             | Optional           |


## VIP Users
| Filed Name          | Format | Example                                             | Mandatory/Optional        |
| ------------------- | ------ | --------------------------------------------------- | ------------------------- |
| User Identifier     | UID    | 52322ec8-6ebf-11eb-9439-0242ac130002                | At least one is Mandatory |
| User AAD Object Id  | SID    | 03fa4b4e-dc26-426f-87b7-98e0c9e2955e                |                           |
| User On-Prem Sid    | SID    | S-1-12-1-4141952679-1282074057-627758481-2916039507 |                           |
| User Principal Name | UPN    | JeffL@seccxp.ninja                                  | Mandatory                 |
| Tags                | List   | ["SAW user","Amba Wolfs team"]                      | Optional                  |

## Network Mapping

| Filed Name | Format       | Example                      | Mandatory/Optional |
| ---------- | ------------ | ---------------------------- | ------------------ |
| IP Subnet  | Subnet range | 198.51.100.0/24 - 198….../22 | Mandatory          |
| Range Name | String       | DMZ                          | Optional           |
| Tags       | List         | ["Example","Example"]        | Optional           |

## Terminated Employees 

| Filed Name          | Format                 | Example                              | Mandatory/Optional        |
| ------------------- | ---------------------- | ------------------------------------ | ------------------------- |
| User Identifier     | UID                    | 52322ec8-6ebf-11eb-9439-0242ac130002 | At least one is Mandatory |
| User AAD Object Id  | SID                    | 03fa4b4e-dc26-426f-87b7-98e0c9e2955e |                           |
| User On-Prem Sid    | SID                    | S-1-12-1-4141952679-1282074057-123   |                           |
| User Principal Name | UPN                    | JeffL@seccxp.ninja                   | Mandatory                 |
| UserState           | [Notified, Terminated] | Terminated                           | Mandatory                 |
| Notification date   | Timestamp - day        | 01.12.20                             | Optional                  |
| Termination date   | Timestamp - day        | 01.01.21                             | Mandatory                 |
| Tags                | List                   | ["SAW user","Amba Wolfs team"]       | Optional                  |


## Identity Correlation

| File Name                        | Format  | Example                                             | Mandatory/Optional        |
| -------------------------------- | ------- | --------------------------------------------------- | ------------------------- |
| User Identifier                  | UID     | 52322ec8-6ebf-11eb-9439-0242ac130002                | At least one is Mandatory |
| User AAD Object Id               | SID     | 03fa4b4e-dc26-426f-87b7-98e0c9e2955e                |                           |
| User On-Prem Sid                 | SID     | S-1-12-1-4141952679-1282074057-627758481-2916039507 |                           |
| User Principal Name              | UPN     | JeffL@seccxp.ninja                                  |                           |
| Mandatory                        |         |                                                     |                           |
| Employee Id                      | String  | 8234123                                             | Optional                  |
| Email                            | Email   | JeffL@seccxp.ninja                                  |                           |
| Optional                         |         |                                                     |                           |
| Associated Privileged Account ID | UID/SID | S-1-12-1-4141952679-1282074057-627758481-2916039507 | Optional                  |
| Associated Privileged Account    | UPN     | Admin@seccxp.ninja                                  |                           |
| Optional                         |         |                                                     |                           |
| Tags                             | List    | ["SAW user","Amba Wolfs team"]                      | Optional                  |

## Service Accounts

| File Name                 | Format | Exapmle                                             | Mandatory/Optional        |
| ------------------------- | ------ | --------------------------------------------------- | ------------------------- |
| Service Identifier        | UID    | 1111-112123-12312312-123123123                      | At least one is Mandatory |
| Service AAD Object Id     | SID    | 11123-123123-123123-123123                          |                           |
| Service On-Prem Sid       | SID    | S-1-12-1-3123123-123213123-12312312-2916039507      |                           |
| Service Principal Name    | UPN    | myserviceprin@contoso.com                           | Mandatory                 |
| Owner User Identifier     | UID    | 52322ec8-6ebf-11eb-9439-0242ac130002                | At least one is Mandatory |
| Owner User AAD Object Id  | SID    | 03fa4b4e-dc26-426f-87b7-98e0c9e2955e                |                           |
| Owner User On-Prem Sid    | SID    | S-1-12-1-4141952679-1282074057-627758481-2916039507 |                           |
| Owner User Principal Name | UPN    | JeffL@seccxp.ninja                                  | Mandatory                 |
| Tags                      | List   | ["Example","Example"]                               | Optional                  |

## Next steps

For more information, see:

- [Tutorial: Deploy the Azure Sentinel solution for SAP](sap-deploy-solution.md)
- [Azure Sentinel SAP solution logs reference](sap-solution-log-reference.md)
- [Deploy the Azure Sentinel SAP data connector on-premises](sap-solution-deploy-alternate.md)
- [Azure Sentinel SAP solution detailed SAP requirements](sap-solution-detailed-requirements.md)
