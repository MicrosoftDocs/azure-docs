---
title: "Semperis Directory Services Protector Solution connector for Microsoft Sentinel"
description: "Learn how to install the connector Semperis Directory Services Protector Solution to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 11/17/2022
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Semperis Directory Services Protector Solution connector for Microsoft Sentinel

Semperis Directory Services Protector data connector allows for the export of its Windows event logs (i.e. Indicators of Exposure and Indicators of Compromise) to Microsoft Sentinel in real time.
It provides a data parser to manipulate the Windows event logs more easily. The different workbooks ease your Active Directory security monitoring and provide different ways to visualize the data. The analytic templates allow to automate responses regarding different events, exposures, or attacks.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Event (Semperis-DSP-Security)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Semperis](https://www.semperis.com/contact-us/) |

## Query samples

**Get all Indicators of Exposure (IoEs) failed alerts for the last hour**
   ```kusto
dsp_parser
 
   | where EventID == 9212
 
   | where TimeGenerated >= ago(1h)
 
   | summarize count() by TimeGenerated, tostring(ForestName), tostring(Domains), tostring(SecurityIndicatorName), tostring(SecurityIndicatorDescription), tostring(ResultMessage), tostring(SecurityFrameworkTags), tostring(LikelihoodOfCompromise), tostring(FirstFound), tostring(Remediation), tostring(Score)
   ```

**Get Indicators of Exposure (IoEs) failed alerts for the last 24 hours**
   ```kusto
dsp_parser
 
   | where EventID == 9212
 
   | where TimeGenerated >= ago(24h)
 
   | summarize count() by TimeGenerated, tostring(ForestName), tostring(Domains), tostring(SecurityIndicatorName), tostring(SecurityIndicatorDescription), tostring(ResultMessage), tostring(SecurityFrameworkTags), tostring(LikelihoodOfCompromise), tostring(FirstFound), tostring(Remediation), tostring(Score)
   ```

**Get all Indicators of Exposure (IoEs) failed alerts for the last 7 days**
   ```kusto
dsp_parser
 
   | where EventID == 9212
 
   | where TimeGenerated >= ago(7d)
 
   | summarize count() by TimeGenerated, tostring(ForestName), tostring(Domains), tostring(SecurityIndicatorName), tostring(SecurityIndicatorDescription), tostring(ResultMessage), tostring(SecurityFrameworkTags), tostring(LikelihoodOfCompromise), tostring(FirstFound), tostring(Remediation), tostring(Score)
   ```

**Get all Indicators of Exposure (IoEs) tested and passed for the last hour**
   ```kusto
dsp_parser
 
   | where EventID == 9211
 
   | where TimeGenerated >= ago(1h)
 
   | summarize count() by TimeGenerated, tostring(ForestName), tostring(Domains), tostring(SecurityIndicatorName), tostring(SecurityIndicatorDescription), tostring(ResultMessage), tostring(SecurityFrameworkTags), tostring(LikelihoodOfCompromise), tostring(Score)
   ```

**Get all Indicators of Exposure (IoEs) tested and passed for the last 24 hours**
   ```kusto
dsp_parser
 
   | where EventID == 9211
 
   | where TimeGenerated >= ago(24h)
 
   | summarize count() by TimeGenerated, tostring(ForestName), tostring(Domains), tostring(SecurityIndicatorName), tostring(SecurityIndicatorDescription), tostring(ResultMessage), tostring(SecurityFrameworkTags), tostring(LikelihoodOfCompromise), tostring(Score)
   ```

**Get all Indicators of Exposure (IoEs) tested and passed for the last 7 days**
   ```kusto
dsp_parser
 
   | where EventID == 9211
 
   | where TimeGenerated >= ago(7d)
 
   | summarize count() by TimeGenerated, tostring(ForestName), tostring(Domains), tostring(SecurityIndicatorName), tostring(SecurityIndicatorDescription), tostring(ResultMessage), tostring(SecurityFrameworkTags), tostring(LikelihoodOfCompromise), tostring(Score)
   ```



## Vendor installation instructions


**NOTE:** This data connector depends on a parser based on a Kusto Function to work as expected [**dsp_parser**](https://aka.ms/sentinel-SemperisDSP-parser) which is deployed with the Microsoft Sentinel Solution.

1. Configure Semperis DSP Management Server to send Windows event logs to your Microsoft Sentinel Workspace

On your **Semperis DSP Management Server** install the Microsoft agent for Windows.

2. Install and onboard the Microsoft agent for Windows

You can skip this step if you have already installed the Microsoft agent for Windows


3. Configure the Semperis DSP Windows event logs to be collected by the agent

Configure the agent to collect the logs.

1. Under workspace advanced settings **Configuration**, select **Data** and then **Windows Event Logs**.
2. Select **Go to Agents configuration** and click **Add Windows event log**.
3. Enter **Semperis-DSP-Security/Operational** as the log name to be collected and click **Apply**



> You should now be able to receive logs in the *Windows event log* table, log data can be parsed using the **dsp_parser()** function, used by all query samples, workbooks and analytic templates.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/semperis.directory-services-protector-solution?tab=Overview) in the Azure Marketplace.
