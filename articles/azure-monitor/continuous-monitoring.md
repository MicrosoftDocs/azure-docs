---
title: Continuous monitoring with Azure Monitor | Microsoft Docs
description:  
author: bwren
manager: carmonm
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.service: azure-monitor
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/12/2018
ms.author: bwren

---

# Continuous monitoring with Azure Monitor

[Azure Monitor](overview.md) is the unified monitoring solution in Azure that provides full-stack observability across applications and infrastructure in the cloud and on-premises. Depending on the what you are wearing at the moment, you can start with end-to-end visibility across the health of your resources, drill down to most probable root cause of a problem (even to actual lines of code), fix the issue in your app or infrastructure and re-deploy in a matter of minutes. If you have a robust monitoring pipeline setup, you should be able to find and fix issues way before it starts impacting your customers.

Many of you already know how CI/CD (Continuous Integration & Continuous Deployment) as a DevOps concept can help you deliver software faster and more reliably to provide continuous value to your users. 

Continuous Monitoring (CM) is a new follow-up concept where you can incorporate monitoring across each phase of your DevOps & IT Ops cycle and ensure the health, performance & reliability of your apps and infrastructure continuously as it flows through from Dev to Prod to Customers.


Azure Monitor can enable Continuous Monitoring throughout your workflows. It works seamlessly with Visual Studio & Visual Studio Code during development & test and integrates with Azure DevOps for release management and work item management during deployment & operations. It even integrates across the ITSM and SIEM tools of your choice to help track issues and incidents within your existing IT processes.

## Enable monitoring for all your applications
In order to gain observability across your entire environment, you need to enable monitoring on all your web applications and services. 

- If you have access to the code for your application, then enable full monitoring with [Application Insights](../application-insights/app-insights-overview.md) by installing the [Azure Monitor Application Insights SDK](../application-insights/app-insights-platforms.md) for .NET, Java, Node.js, or any other programming languages. This allows you to specify custom events, metrics, or page views that are relevant to your application and your business.

- If you don’t have access to your application's code, there are other features of Azure Monitor to enable monitoring: Release templates in Azure Pipelines,  , Extensions in Azure VMs or Azure App Services, etc. Once you have monitoring enabled across all your apps you can easily visualize end-to-end transactions and connections across all the components. Once you have monitoring enabled across all your apps you can easily visualize end-to-end transactions and connections across all the components.

    - [Azure DevOps Projects](../devops-project/overview.md) presents a simplified experience where you bring your existing code and Git repository, or choose from one of the sample applications to create a Continuous Integration (CI) and Continuous Delivery (CD) pipeline to Azure.
    - [Status Monitor](../application-insights/app-insights-monitor-performance-live-website-now.md)  allows you to instrument a live .NET app on Windows with Azure Application Insights, without having to modify or redeploy your code. 
    - Release templates in Azure Pipelines
    - [Azure Diagnostics extension](../monitoring-and-diagnostics/azure-diagnostics.md) is an agent within Azure that enables the collection of diagnostic data on a deployed application.


## Enable monitoring for your entire infrastructure
Your application 

Azure Monitor can help you track the health and performance of your entire hybrid infrastructure, be it VMs, Containers, Storage, Network or any other Azure services. You automatically get platform metrics, activity logs and diagnostics logs from most of your Azure resources and can enable deeper monitoring for Virtual Machines or AKS clusters with a simple button click on the Azure portal or installing an agent on your servers.
For scalability and ‘Infrastructure as Code’, it is recommended to take advantage of DevOps Projects, Azure Policy, PowerShell or ARM templates for enabling monitoring and configuring alerts over a large set of resources. Having monitoring enabled across your entire infrastructure will help you achieve full observability and make it easier to discover a potential root lcause when something fails.


[Infrastructure as code](/devops/learn/what-is-infrastructure-as-code)


##	Group related resources in Azure Resource Groups for better management
A typical application on Azure today includes multiple resources including VMs, App Services, or microservices hosted on Cloud Services, AKS clusters,or Service Fabric. These applications frequently utilize dependencies like Event Hubs, Storage, SQL, and Service Bus.

- To get full visibility across all your resources that make up your application, you should combine them in a single Azure Resource Group. [Azure Monitor for Resource Groups](../monitoring-and-diagnostics/resource-group-insights.md) provides a simple way to keep track of the health and performance of your entire full-stack application and enables drilling down into respective components for any investigations or debugging.

## Ensure quality through Continuous Deployment

- [Azure Pipelines](/azure/devops/pipelines) is a great way to setup Continuous Deployment and you can automate the entire process from code commit to production if your CI/CD tests are successful. 
- Integrating monitoring as part of your pre- or post-deployment [Quality Gates](../devops/pipelines/release/approvals/gates.md) can ensure that the you are also keeping the key health/performance metrics (KPIs) on track as your apps go from dev to production, and any differences in the infrastructure environment or scale is not negatively impacting your KPIs.
- It's good practice to [maintain separate monitoring instances](../application-insights/app-insights-separate-resources.md) between your different deployment environments such as Dev, Test, Canary, and Prod. This ensures that collected data is relevant across the associated applications and infrastructure. If you need to correlate data across environments you can use [multi-resource charts in Metrics Explorer](../monitoring-and-diagnostics/monitoring-metric-charts.md) or create [cross-resource queries in Log Analytics](../log-analytics/log-analytics-cross-workspace-search.md).





## Setup actionable alerts with notifications and/or remediations
A critical aspect of monitoring is proactively notifying administrators of any current and predicted issues. 

- Create [alerts in Azure Monitor](../monitoring-and-diagnostics/monitoring-overview-alerts.md) based on logs and metrics to identify predictable failure states. You should have a goal of making all alerts actionable meaning that they represent actual critical conditions so that you reduce the chance of false positives. Use [dynamic thresholds](../monitoring-and-diagnostics/monitoring-alerts-dynamic-thresholds.md) to automatically calculate baselines rather than defining your own static thresholds. 
- Define actions for alerts to use the most effective means of notifying your administrators. Available [actions for notification](../monitoring-and-diagnostics/monitoring-action-groups.md#create-an-action-group-by-using-the-azure-portal) are SMS, e-mails, push notifications, or voice calls.
- Use more advanced actions to [connect to your ITSM tool](../log-analytics/log-analytics-itsmc-overview.md) or other alert management systems through [webhooks](../monitoring-and-diagnostics/monitoring-activity-log-alerts-webhook.md).
- Remediate situations identified in alerts as well with [Azure Automation runbooks](../automation/automation-webhooks.md) or [Logic Apps](../connectors/custom-connectors/create-webhook-trigger.md) that can be launched from an alert using webhooks. 
- Use [autoscaling](../monitor-tutorial-autoscale-performance-schedule.md) to dynamically increase and decrease your compute resources based on collected metrics.





## Next steps
