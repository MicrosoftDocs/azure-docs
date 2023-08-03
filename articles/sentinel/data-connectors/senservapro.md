---
title: "SenservaPro (Preview) connector for Microsoft Sentinel"
description: "Learn how to install the connector SenservaPro (Preview) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# SenservaPro (Preview) connector for Microsoft Sentinel

The SenservaPro data connector provides a viewing experience for your SenservaPro scanning logs. View dashboards of your data, use queries to hunt & explore, and create custom alerts.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | SenservaPro_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Senserva](https://www.senserva.com/support/) |

## Query samples

**All SenservaPro data**
   ```kusto
SenservaPro_CL
   ```

**All SenservaPro data received in the last 24 hours**
   ```kusto
SenservaPro_CL
            
   | where TimeGenerated > ago(1d)
   ```

**All SenservaPro data with 'High' Severity, ordered by the most recent received**
   ```kusto
SenservaPro_CL
            
   | where Severity == 3
            
   | order by TimeGenerated desc
   ```

**All 'ApplicationNotUsingClientCredentials' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'ApplicationNotUsingClientCredentials'
   ```

**All 'AzureSecureScoreAdminMFAV2' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'AzureSecureScoreAdminMFAV2'
   ```

**All 'AzureSecureScoreBlockLegacyAuthentication' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'AzureSecureScoreBlockLegacyAuthentication'
   ```

**All 'AzureSecureScoreIntegratedApps' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'AzureSecureScoreIntegratedApps'
   ```

**All 'AzureSecureScoreMFARegistrationV2' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'AzureSecureScoreMFARegistrationV2'
   ```

**All 'AzureSecureScoreOneAdmin' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'AzureSecureScoreOneAdmin'
   ```

**All 'AzureSecureScorePWAgePolicyNew' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'AzureSecureScorePWAgePolicyNew'
   ```

**All 'AzureSecureScoreRoleOverlap' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'AzureSecureScoreRoleOverlap'
   ```

**All 'AzureSecureScoreSelfServicePasswordReset' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'AzureSecureScoreSelfServicePasswordReset'
   ```

**All 'AzureSecureScoreSigninRiskPolicy' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'AzureSecureScoreSignInRiskPolicy'
   ```

**All 'AzureSecureScoreUserRiskPolicy' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'AzureSecureScoreUserRiskPolicy'
   ```

**All 'Disabled' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'UserDisabled'
   ```

**All 'NonAdminGuest' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'UserNonAdminGuest'
   ```

**All 'ServicePrincipalNotUsingClientCredentials' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'ServicePrincipalNotUsingClientCredentials'
   ```

**All 'StaleLastPasswordChange' controls received in the last 14 days**
   ```kusto
let timeframe = 14d;
            SenservaPro_CL
            
   | where TimeGenerated >= ago(timeframe)
            
   | where ControlName_s == 'UserStaleLastPasswordChange'
   ```



## Vendor installation instructions

1. Setup the data connection

Visit [Senserva Setup](https://www.senserva.com/portal/) for information on setting up the Senserva data connection, support, or any other questions. The Senserva installation will configure a Log Analytics Workspace for output. Deploy Microsoft Sentinel onto the configured Log Analytics Workspace to finish the data connection setup by following [this onboarding guide.](/azure/sentinel/quickstart-onboard)




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/senservallc.senservapro4sentinel?tab=Overview) in the Azure Marketplace.
