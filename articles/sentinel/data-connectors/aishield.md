---
title: "AIShield connector for Microsoft Sentinel"
description: "Learn how to install the connector AIShield to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# AIShield connector for Microsoft Sentinel

[AIShield](https://www.boschaishield.com/) connector allows users to connect with AIShield custom defense mechanism logs with Microsoft Sentinel, allowing the creation of dynamic Dashboards, Workbooks, Notebooks and tailored Alerts to improve investigation and thwart attacks on AI systems. It gives users more insight into their organization's AI assets security posturing and improves their AI systems security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AIShield_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [AIShield](https://azuremarketplace.microsoft.com/marketplace/apps/rbei.bgsw_aishield_product/) |

## Query samples

**Get all incidents order by time**
   ```kusto
AIShield
            
   | order by TimeGenerated desc 
   ```

**Get high risk incidents**
   ```kusto
AIShield
            
   |  where Severity =~ 'High'
   ```



## Prerequisites

To integrate with AIShield make sure you have: 

- **Note**: Users should have utilized AIShield SaaS offering to conduct vulnerability analysis and deployed custom defense mechanisms generated along with their AI asset. [**Click here**](https://azuremarketplace.microsoft.com/marketplace/apps/rbei.bgsw_aishield_product) to know more or get in touch.


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**AIShield**](https://aka.ms/sentinel-boschaishield-parser) which is deployed with the Microsoft Sentinel Solution.



>**IMPORTANT:** Before deploying the AIShield Connector, have the Workspace ID and Workspace Primary Key (can be copied from the following).





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/rbei.bgsw_aishield_sentinel?tab=Overview) in the Azure Marketplace.
