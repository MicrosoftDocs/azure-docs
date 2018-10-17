---
title: Continuous monitoring with Azure Monitor | Microsoft Docs
description:  Describes specific steps for using Azure Monitor to enable Continuous Monitoring throughout your workflows.
author: bwren
manager: carmonm
editor: ''
services: azure-monitor
documentationcenter: azure-monitor

ms.service: azure-monitor
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/12/2018
ms.author: bwren

---

# Continuous monitoring with Azure Monitor

Continuous Monitoring refers to the process and technology required to incorporate monitoring across each phase of your DevOps and IT operations lifecycles. It helps to continuously ensure the health, performance, and reliability of your application and infrastructure as it moves from development to production. Continuous Monitoring builds on the concepts of Continuous Integration and Continuous Deployment (CI/CD) which help you develop and deliver software faster and more reliably to provide continuous value to your users.

[Azure Monitor](overview.md) is the unified monitoring solution in Azure that provides full-stack observability across applications and infrastructure in the cloud and on-premises. It works seamlessly with [Visual Studio and Visual Studio Code](https://visualstudio.microsoft.com/) during development and test and integrates with [Azure DevOps](/azure/devops/user-guide/index) for release management and work item management during deployment and operations. It even integrates across the ITSM and SIEM tools of your choice to help track issues and incidents within your existing IT processes.

This article describes specific steps for using Azure Monitor to enable Continuous Monitoring throughout your workflows. It includes links to other documentation that describe how to implement different features.


## Enable monitoring for all your applications
In order to gain observability across your entire environment, you need to enable monitoring on all your web applications and services. 

- If you have access to the code for your application, then enable full monitoring with [Application Insights](../application-insights/app-insights-overview.md) by installing the [Azure Monitor Application Insights SDK](../application-insights/app-insights-platforms.md) for [.NET](../application-insights/quick-monitor-portal.md), [Java](../application-insights/app-insights-java-quick-start.md), [Node.js](../application-insights/app-insights-nodejs-quick-start.md), or any other programming languages. This allows you to specify custom events, metrics, or page views that are relevant to your application and your business.

- If you don’t have access to your application's code, there are other features of Azure Monitor to enable monitoring. Once you have monitoring enabled across all your applications, you can easily visualize end-to-end transactions and connections across all the components.

    - [Azure DevOps Projects](../devops-project/overview.md) present a simplified experience where you bring your existing code and Git repository, or choose from one of the sample applications to create a Continuous Integration (CI) and Continuous Delivery (CD) pipeline to Azure.
    - Add [continuous monitoring to DevOps release pipeline](../application-insights/app-insights-vsts-continuous-monitoring.md) to gate or rollback your deployment based on monitoring data.
    - [Status Monitor](../application-insights/app-insights-monitor-performance-live-website-now.md)  allows you to instrument a live .NET app on Windows with Azure Application Insights, without having to modify or redeploy your code.
    - [Azure Diagnostics extension](../monitoring-and-diagnostics/azure-diagnostics.md) is an agent within Azure that enables the collection of diagnostic data on a deployed application.


## Enable monitoring for your entire infrastructure
Having monitoring enabled across your entire infrastructure will help you achieve full observability and make it easier to discover a potential root cause when something fails. Azure Monitor helps you track the health and performance of your entire hybrid infrastructure including VMs, Containers, Storage, Network, and other Azure services.

- You automatically get [platform metrics, activity logs and diagnostics logs](../monitoring/monitoring-data-sources.md) from most of your Azure resources.
- Enable deeper monitoring for VMs with [Azure Monitor for VMs](../monitoring/monitoring-vminsights-overview.md).
-  Enable deeper monitoring for AKS clusters with [Azure Monitor for containers](../monitoring/monitoring-container-insights-overview.md).


[Infrastructure as code](/devops/learn/what-is-infrastructure-as-code) is the management of infrastructure in a descriptive model, using the same versioning as DevOps team uses for source code. It adds reliability and scalability to your environment and allows you to leverage similar processes that you use for managing your applications.

-  Use [Resource Manager templates](../log-analytics/log-analytics-template-workspace-configuration.md) to enable monitoring and configure alerts over a large set of resources.
- Use [Azure Policy](../governance/policy/overview.md) to enforce different rules and effects over your resources, so those resources stay compliant with your corporate standards and service level agreements. 


##	Group resources in Azure Resource Groups
A typical application on Azure today includes multiple resources including VMs, App Services, or microservices hosted on Cloud Services, AKS clusters, or Service Fabric. These applications frequently utilize dependencies like Event Hubs, Storage, SQL, and Service Bus.

- To get full visibility across all your resources that make up your application, you should combine them in a single Azure Resource Group. [Azure Monitor for Resource Groups](../monitoring-and-diagnostics/resource-group-insights.md) provides a simple way to keep track of the health and performance of your entire full-stack application and enables drilling down into respective components for any investigations or debugging.

## Ensure quality through Continuous Deployment

- [Azure Pipelines](/azure/devops/pipelines) is a great way to set up Continuous Deployment and you can automate the entire process from code commit to production if your CI/CD tests are successful. 
- Integrating monitoring as part of your pre- or post-deployment [Quality Gates](/devops/pipelines/release/approvals/gates) can ensure that the you are also keeping the key health/performance metrics (KPIs) on track as your apps go from dev to production, and any differences in the infrastructure environment or scale is not negatively impacting your KPIs.
- It's good practice to [maintain separate monitoring instances](../application-insights/app-insights-separate-resources.md) between your different deployment environments such as Dev, Test, Canary, and Prod. This ensures that collected data is relevant across the associated applications and infrastructure. If you need to correlate data across environments, you can use [multi-resource charts in Metrics Explorer](../monitoring-and-diagnostics/monitoring-metric-charts.md) or create [cross-resource queries in Log Analytics](../log-analytics/log-analytics-cross-workspace-search.md).


## Create actionable alerts with actions
A critical aspect of monitoring is proactively notifying administrators of any current and predicted issues. 

- Create [alerts in Azure Monitor](../monitoring-and-diagnostics/monitoring-overview-alerts.md) based on logs and metrics to identify predictable failure states. You should have a goal of making all alerts actionable meaning that they represent actual critical conditions so that you reduce the chance of false positives. Use [dynamic thresholds](../monitoring-and-diagnostics/monitoring-alerts-dynamic-thresholds.md) to automatically calculate baselines rather than defining your own static thresholds. 
- Define actions for alerts to use the most effective means of notifying your administrators. Available [actions for notification](../monitoring-and-diagnostics/monitoring-action-groups.md#create-an-action-group-by-using-the-azure-portal) are SMS, e-mails, push notifications, or voice calls.
- Use more advanced actions to [connect to your ITSM tool](../log-analytics/log-analytics-itsmc-overview.md) or other alert management systems through [webhooks](../monitoring-and-diagnostics/monitoring-activity-log-alerts-webhook.md).
- Remediate situations identified in alerts as well with [Azure Automation runbooks](../automation/automation-webhooks.md) or [Logic Apps](/connectors/custom-connectors/create-webhook-trigger) that can be launched from an alert using webhooks. 
- Use [autoscaling](../monitoring-and-diagnostics/monitor-tutorial-autoscale-performance-schedule.md) to dynamically increase and decrease your compute resources based on collected metrics.

## Prepare role-based dashboards and workbooks
In order to support continuous monitoring, it is imperative that your development and operations have access to the same telemetry and tools. This allows you to view patterns across your entire environment and minimize your Mean Time To Detect (MTTD) and Mean Time To Restore (MTTR).

- Prepare [custom dashboards](../application-insights/app-insights-tutorial-dashboards.md) based on common metrics and logs for the different roles in your organization. Dashboards can combine data from all Azure resources.
- [Workbooks](../application-insights/app-insights-usage-workbooks.md) can help with knowledge sharing between development and operations. These could be prepared as dynamic reports with metric charts and log queries, or even as troubleshooting guides prepared by developers helping customer support or operations to handle basic problems.

## Continuously optimize with Build-Measure-Learn
 Monitoring is one of the fundamental aspects of the popular Build-Measure-Learn philosophy, which recommends continuously tracking your KPIs and user behavior metrics and striving to optimize them through planning iterations. Azure Monitor helps you collect all the metrics and logs relevant to your business and add a new data point in the next deployment if something is missing.

- Use tools in Application Insights to [track end-user behavior and engagement](../application-insights/app-insights-tutorial-users.md).
- Use [Impact Analysis](../application-insights/app-insights-usage-impact.md) to help you prioritize which areas to focus on to drive to important KPIs.


## Next steps
