---
title: Tutorial to review web apps for migration
description: Learn how to review assessment for web apps in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: how-to
ms.date: 05/08/2025
ms.service: azure-migrate
ms.custom: engagement-fy24
monikerRange: migrate
---
# Create a web app assessment for modernization 

This article describes how to review the insights from a web app assessment for modernization to [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) or Azure App Service using Azure Migrate. Creating an assessment for your web apps provides the recommended targets for them and key insights such as app-readiness, target right-sizing, and cost to host, and run these apps month over month.

In this article, you'll learn how to: 

- Get the recommended modernization path across the preferred targets based on app-readiness and cost. 
- Get the modernization paths to each Azure target for all selected web apps. 
- Review the migration warnings or issues and remediate them accordingly. 
- Get the estimated monthly cost of running the web apps on Azure for each modernization path. 
- Change assessment settings and recalculate. 
- Export the assessment report to Excel. 

## Prerequisites 

- Deploy and configure the Azure Migrate appliance in your [VMware](tutorial-discover-vmware.md), [Hyper-V](tutorial-discover-hyper-v.md), or [physical](tutorial-discover-physical.md) environments. 
- Check the [appliance requirements](migrate-appliance.md#appliance---vmware) and [URL access](migrate-appliance.md#url-access) to be provided. 
- [Discover web apps running on your environment](how-to-discover-sql-existing-project.md) 
- [Create a web app assessment](create-web-app-assessment.md).

## View assessment insights 

To view an assessment, follow these steps:

1. On the Azure Migrate project **Overview** page, under **Decide and Plan**, select **Assessments**. 
1. Search for the assessment using the **Workloads** filter and select it.
1. On the assessment **Overview** page, you see summarized insights on assessed workloads, recommended migration path, and target-specific migration path (that is, if you wanted to migrate all assessed apps to that target).
   1. **Assessed workloads**: Surfaces the collection of workloads assessed. Click view details to shows the distribution across web server and web app types. 
   1. **Recommended path**: It provides the most optimal path for migrating web apps across Azure targets, based on your preferred targets, cloud readiness and cost. It captures the readiness distribution, migration strategy (Replatform vs Rehost) and monthly cost estimate for running the web apps across the targets.
   1. **Target-specific migration path**: This section provides the path for migrating all web apps to a specific target. It allows you to see the readiness warnings or issues for migrating the apps to that target and captures the monthly cost estimate.
1. The web apps can take one of the following readiness states: 

   | **Status**| **Definition**|
   |----------|--------|
   | Ready  | The web app is ready to be migrated.   |
   | Ready with conditions  | The web app needs minor changes to be ready for migration.  |
   | Not ready  | The web app needs major/breaking changes to be ready for migration.  |
   | Unknown  | The web app discovery data was either incomplete or corrupt to calculate readiness. |

1. Select the **Recommended path** tab or **View details** in the recommended path report to get deeper insights. This screen displays the distribution of the web apps across the Azure targets. It also provides other details such as the number of target instances (App Service instance, AKS clusters), migration strategy and readiness distribution. Select a line item to drill down further.
**App Service Container**: The target drill down shows granular details for the web apps recommended to this target. 
    1. Top level insights include the cost distribution by App Service Plan SKUs and top migration issues or warnings. 
    1. The report also shows how the web apps are packed into App Service plans. Selecting the plan brings up the plan details, rightsized based on the assessed web apps.
    1. Selecting the readiness status shows the migration issues or warnings, their root causes and recommended remediation steps.
**Azure Kubernetes Service**: The target drill down shows granular details for the web apps recommended to this target.
    1. Top level insights include the cost distribution by Node SKUs and top migration issues or warnings. 
    1. The report also shows how the web apps are packed into AKS node pools, the system pool and the number of nodes per pool.  
    1. Selecting the cluster brings up the cluster details, right sized based on the assessed web apps. 
1. Select a web app from the target drill downs opens the web app drill down. On the **Summary** tab, you can see discovered metadata such as protocols, connection strings, application directories and tags assigned to this workload.
1. On the **Readiness** tab, you can see the readiness for this web app for each Azure target, the migration issues or warnings and the recommended Azure target.
1. Navigate back to the **Overview** page. Select the **Export** option to download an excel containing the assessment details.

## Next steps 

- Modernize your web apps to [App Service](tutorial-modernize-asp-net-appservice-code.md) or [AKS](tutorial-modernize-asp-net-aks.md). 
- [Optimize](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile?context=%2Fazure%2Faks%2Fcontext%2Faks-context) Windows Dockerfiles. 
- Review and implement [best practices](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile?context=%2Fazure%2Faks%2Fcontext%2Faks-context) to build and manage apps on AKS.