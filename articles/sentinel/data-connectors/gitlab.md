---
title: "GitLab connector for Microsoft Sentinel"
description: "Learn how to install the connector GitLab to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# GitLab connector for Microsoft Sentinel

The [GitLab](https://about.gitlab.com/solutions/devops-platform/) connector allows you to easily connect your GitLab (GitLab Enterprise Edition - Standalone) logs with Microsoft Sentinel. This gives you more security insight into your organization's DevOps pipelines.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (GitlabAccess)<br/> Syslog (GitlabAudit)<br/> Syslog (GitlabApp)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**GitLab Application Logs**
   ```kusto
GitLabApp 
   | sort by TimeGenerated
   ```

**GitLab Audit Logs**
   ```kusto
GitLabAudit 
   | sort by TimeGenerated
   ```

**GitLab Access Logs**
   ```kusto
GitLabAccess 
   | sort by TimeGenerated
   ```



## Vendor installation instructions

Configuration

>This data connector depends on three parsers based on a Kusto Function to work as expected [**GitLab Access Logs**](https://aka.ms/sentinel-GitLabAccess-parser), [**GitLab Audit Logs**](https://aka.ms/sentinel-GitLabAudit-parser) and [**GitLab Application Logs**](https://aka.ms/sentinel-GitLabApp-parser) which are deployed with the Microsoft Sentinel Solution.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.

1.  Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
2.  Select **Apply below configuration to my machines** and select the facilities and severities.
3.  Click **Save**.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-gitlab?tab=Overview) in the Azure Marketplace.
