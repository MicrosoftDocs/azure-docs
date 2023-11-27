---
title: Schemas for Microsoft Sentinel watchlist templates | Microsoft Docs
description: Learn about the schemas used in each built-in watchlist template in Microsoft Sentinel.
author: cwatson-cat
ms.author: cwatson
ms.topic: reference
ms.custom: mvc, ignite-fall-2021
ms.date: 11/09/2021
---

# Microsoft Sentinel built-in watchlist template schemas (preview)

This article details the schemas used in each built-in watchlist template provided by Microsoft Sentinel. For more information, see [Create watchlists in Microsoft Sentinel](watchlists-create.md).

The Microsoft Sentinel watchlist templates are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## High Value Assets

The High Value Assets watchlist lists devices, resources, and other assets that have critical value in the organization, and includes the following fields:

| Field name | Format                              | Example                                                                                                                                | Mandatory/Optional |
| ---------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **Asset Type** | String                              | `Device`, `Azure resource`, `AWS resource`, `URL`, `SPO`, `File share`, `Other`                                                                      | Mandatory          |
| **Asset Id**   | String, depending on asset type | `/subscriptions/d1d8779d-38d7-4f06-91db-9cbc8de0176f/resourceGroups/SOC-Purview/providers/Microsoft.Storage/storageAccounts/purviewadls` | Mandatory          |
| **Asset Name** | String                              | `Microsoft.Storage/storageAccounts/purviewadls`                                                                                          | Optional           |
| **Asset FQDN** | FQDN                                | `Finance-SRv.local.microsoft.com`                                                                                                        | Mandatory          |
| **IP Address** | IP                                  | `1.1.1.1`                                                                                                                                | Optional           |
| **Tags**       | List                                | `["SAW user","Blue Ocean team"] `                                                                                                        | Optional           |


## VIP Users

The VIP Users watchlist lists user accounts of employees that have high impact value in the organization, and includes the following values:

| Field name          | Format | Example                                             | Mandatory/Optional |
| ------------------- | ------ | --------------------------------------------------- | ------------------ |
| **User Identifier**     | UID    | `52322ec8-6ebf-11eb-9439-0242ac130002`                | Optional           |
| **User AAD Object Id**  | SID    | `03fa4b4e-dc26-426f-87b7-98e0c9e2955e`                | Optional           |
| **User On-Prem Sid**    | SID    | `S-1-12-1-4141952679-1282074057-627758481-2916039507` | Optional           |
| **User Principal Name** | UPN    | `JeffL@seccxp.ninja`                                  | Mandatory          |
| **Tags**                | List   | `["SAW user","Blue Ocean team"]`                      | Optional           |


## Network Addresses

The Network Addresses watchlist lists IP subnets and their respective organizational contexts, and includes the following fields:

| Field name | Format       | Example                      | Mandatory/Optional |
| ---------- | ------------ | ---------------------------- | ------------------ |
| **IP Subnet**  | Subnet range | `198.51.100.0/24` | Mandatory          |
| **Range Name** | String       | `DMZ`                          | Optional           |
| **Tags**       | List         | `["Example","Example"]`        | Optional           |


## Terminated Employees

The Terminated Employees watchlist lists user accounts of employees that have been, or are about to be, terminated, and includes the following fields:

| Field name          | Format                                                                          | Example                              | Mandatory/Optional |
| ------------------- | ------------------------------------------------------------------------------- | ------------------------------------ | ------------------ |
| **User Identifier**     | UID                                                                             | `52322ec8-6ebf-11eb-9439-0242ac130002` | Optional           |
| **User AAD Object Id**  | SID                                                                             | `03fa4b4e-dc26-426f-87b7-98e0c9e2955e` | Optional           |
| **User On-Prem Sid**    | SID                                                                             | `S-1-12-1-4141952679-1282074057-123`   | Optional           |
| **User Principal Name** | UPN                                                                             | `JeffL@seccxp.ninja`                  | Mandatory          |
| **UserState**           | String <br><br>We recommend using either `Notified` or `Terminated` | `Terminated`                           | Mandatory          |
| **Notification date**  | Timestamp - day <br><br>We recommend using the UTC format                        | `2020-12-1`                             | Optional           |
| **Termination date**    | Timestamp - day <br><br>We recommend using the UTC format                       | `2021-01-01`                            | Mandatory          |
| **Tags**                | List                                                                            | `["SAW user","Amba Wolfs team"]`       | Optional           |



## Identity Correlation

The Identity Correlation watchlist lists related user accounts that belong to the same person, and includes the following fields:

| Field name                       | Format  | Example                                             | Mandatory/Optional |
| -------------------------------- | ------- | --------------------------------------------------- | ------------------ |
| **User Identifier**                  | UID     | `52322ec8-6ebf-11eb-9439-0242ac130002`                | Optional           |
| **User AAD Object Id**               | SID     | `03fa4b4e-dc26-426f-87b7-98e0c9e2955e`                | Optional           |
| **User On-Prem Sid**                 | SID     | `S-1-12-1-4141952679-1282074057-627758481-2916039507` | Optional           |
| **User Principal Name**              | UPN     | `JeffL@seccxp.ninja`                                  | Mandatory          |
| **Employee Id**                      | String  | `8234123`                                             | Optional           |
| **Email**                            | Email   | `JeffL@seccxp.ninja`                                  | Optional           |
| **Associated Privileged Account ID** | UID/SID | `S-1-12-1-4141952679-1282074057-627758481-2916039507` | Optional           |
| **Associated Privileged Account**    | UPN     | `Admin@seccxp.ninja`                                  | Optional           |
| **Tags**                             | List    | `["SAW user","Amba Wolfs team"]`                      | Optional           |


## Service Accounts

The Service Accounts watchlist lists service accounts and their owners, and includes the following fields:

| Field name                | Format | Example                                             | Mandatory/Optional |
| ------------------------- | ------ | --------------------------------------------------- | ------------------ |
| **Service Identifier**        | UID    | `1111-112123-12312312-123123123`                      | Optional           |
| **Service AAD Object Id**     | SID    | `11123-123123-123123-123123`                          | Optional           |
| **Service On-Prem Sid**       | SID    | `S-1-12-1-3123123-123213123-12312312-2916039507`      | Optional           |
| **Service Principal Name**    | UPN    | `myserviceprin@contoso.com`                           | Mandatory          |
| **Owner User Identifier**     | UID    | `52322ec8-6ebf-11eb-9439-0242ac130002`                | Optional           |
| **Owner User AAD Object Id**  | SID    | `03fa4b4e-dc26-426f-87b7-98e0c9e2955e`                | Optional           |
| **Owner User On-Prem Sid**    | SID    | `S-1-12-1-4141952679-1282074057-627758481-2916039507` | Optional           |
| **Owner User Principal Name** | UPN    | `JeffL@seccxp.ninja`                                  | Mandatory          |
| **Tags**                      | List   | `["Automation Account","GitHub Account"]`             | Optional           |


## Next steps

For more information, see,
- [Use watchlists in Microsoft Sentinel](watchlists.md)
- [Create watchlists](watchlists-create.md)
