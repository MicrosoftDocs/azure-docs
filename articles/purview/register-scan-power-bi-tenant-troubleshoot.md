---
title: Troubleshoot Power BI tenant scans
description: This guide describes how to troubleshoot Power BI tenant scans in Microsoft Purview.
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 09/22/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Troubleshoot Power BI tenant scans in Microsoft Purview

This article explores common troubleshooting methods for scanning Power BI tenants in [Microsoft Purview](overview.md).

## Supported scenarios for Power BI scans

### Same-tenant

|**Scenarios**  |**Microsoft Purview public access allowed/denied** |**Power BI public access allowed /denied** | **Runtime option** | **Authentication option**  | **Deployment checklist** | 
|---------|---------|---------|---------|---------|---------|
|Public access with Azure IR     |Allowed     |Allowed        |Azure Runtime      | Microsoft Purview Managed Identity   | [Review deployment checklist](register-scan-power-bi-tenant.md#deployment-checklist) |
|Public access with self-hosted IR     |Allowed     |Allowed        |Self-hosted runtime        |Delegated authentication / Service principal  | [Review deployment checklist](register-scan-power-bi-tenant.md#deployment-checklist) |
|Private access     |Allowed     |Denied         |Self-hosted runtime        |Delegated authentication / Service principal  | [Review deployment checklist](register-scan-power-bi-tenant.md#deployment-checklist) |
|Private access     |Denied      |Allowed        |Self-hosted runtime        |Delegated authentication / Service principal  | [Review deployment checklist](register-scan-power-bi-tenant.md#deployment-checklist) |
|Private access     |Denied      |Denied         |Self-hosted runtime        |Delegated authentication / Service principal  | [Review deployment checklist](register-scan-power-bi-tenant.md#deployment-checklist) |

### Cross-tenant

|**Scenarios**  |**Microsoft Purview public access allowed/denied** |**Power BI public access allowed /denied** | **Runtime option** | **Authentication option**  | **Deployment checklist** | 
|---------|---------|---------|---------|---------|---------|
|Public access with Azure IR     |Allowed     |Allowed        |Azure runtime      |Delegated Authentication    | [Deployment checklist](register-scan-power-bi-tenant-cross-tenant.md#deployment-checklist) |
|Public access with Self-hosted IR     |Allowed     |Allowed        |Self-hosted runtime        |Delegated authentication / Service principal  | [Deployment checklist](register-scan-power-bi-tenant-cross-tenant.md#deployment-checklist) |

## Troubleshooting tips

If delegated auth is used:
- Check your key vault. Make sure there are no typos in the password.
- Assign proper [Power BI license](/power-bi/admin/service-admin-licensing-organization#subscription-license-types) to Power BI administrator user.
- Validate if user is assigned to Power BI Administrator role.
- If user is recently created, make sure password is reset successfully and user can successfully initiate the session.

## My schema is not showing up after scanning

It can take some time for schema to finish the scanning and ingestion process, depending on the size of your Power BI Tenant. Currently if you have a large PowerBI tenant, this process could take a few hours.

## Error code: Test connection failed - AASDST50079

- **Message**: `Failed to get access token with given credential to access Power BI tenant. Authentication type PowerBIDelegated Message: AASDST50079 Due to a configuration change made by your administrator or because you moved to a new location, you must enroll in multi-factor authentication.`

- **Cause**: Authentication is interrupted, due multi-factor authentication requirement for the Power BI admin user.

- **Recommendation**: Disable multi-factor authentication requirement and exclude user from conditional access policies. Login with the user to Power BI dashboard to validate if user can successfully login to the application.

## Error code: Test connection failed - AASTS70002

- **Message**: `Failed to access token with given credential to access Power BI tenant. Authentication type: PowerBiDelegated Message AASTS70002: The request body must contain the following parameter: 'client_assertion' or 'client_secret'.`

- **Cause**:  If Delegated Authentication is used, the problem could be a misconfiguration on the app registration. 

- **Recommendation**: Review Power BI deployment checklist based on your scenario.

## Error code: Test connection failed - Detailed metadata

- **Message**: `Failed to enable the PowerBI administrator API to fetch basic metadata and lineage.`

- **Cause**: **Allow service principals to use read-only Power BI admin APIs** is disabled.
  
- **Recommendation**: Under Power BI Admin portal, enable **Allow service principals to use read-only Power BI admin APIs**.

## Issue: Test Connection succeeded. No assets discovered.

- **Message**: N/A

- **Cause**: This problem can occur in same-tenant or cross-tenant scenarios, due problem with networking or authentication issues.

- **Recommendation**:  
  - If Delegated Authentication is used, validate Power BI Admin user sign in logs in Azure Active Directory logs to make sure user sign in is successful. Login with the user to Power BI dashboard to validate if user can successfully login to the application.
  
  - Review your network configurations. Private endpoint is required for **both** Power BI tenant and Purview account, if one of these services (Power BI tenant or Microsoft Purview) is configured to block public access. 

## Next steps

Follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
