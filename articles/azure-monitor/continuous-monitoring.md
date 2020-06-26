---
title: Continuous monitoring with Azure Monitor | Microsoft Docs
description: Describes specific steps for using Azure Monitor to enable Continuous monitoring throughout your workflows.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/12/2018

---

# Continuous monitoring with Azure Monitor

Continuous monitoring refers to the process and technology required to incorporate monitoring across each phase of your DevOps and IT operations lifecycles. It helps to continuously ensure the health, performance, and reliability of your application and infrastructure as it moves from development to production. Continuous monitoring builds on the concepts of Continuous Integration and Continuous Deployment (CI/CD) which help you develop and deliver software faster and more reliably to provide continuous value to your users.

[Azure Monitor](overview.md) is the unified monitoring solution in Azure that provides full-stack observability across applications and infrastructure in the cloud and on-premises. It works seamlessly with [Visual Studio and Visual Studio Code](https://visualstudio.microsoft.com/) during development and test and integrates with [Azure DevOps](/azure/devops/user-guide/index) for release management and work item management during deployment and operations. It even integrates across the ITSM and SIEM tools of your choice to help track issues and incidents within your existing IT processes.

This article describes specific steps for using Azure Monitor to enable continuous monitoring throughout your workflows. It includes links to other documentation that provides details on implementing different features.


## Enable monitoring for all your applications
In order to gain observability across your entire environment, you need to enable monitoring on all your web applications and services. This will allow you to easily visualize end-to-end transactions and connections across all the components.

- [Azure DevOps Projects](../devops-project/overview.md) give you a simplified experience with your existing code and Git repository, or choose from one of the sample applications to create a Continuous Integration (CI) and Continuous Delivery (CD) pipeline to Azure.
- [Continuous monitoring in your DevOps release pipeline](../azure-monitor/app/continuous-monitoring.md) allows you to gate or rollback your deployment based on monitoring data.
- [Status Monitor](../azure-monitor/app/monitor-performance-live-website-now.md)  allows you to instrument a live .NET app on Windows with Azure Application Insights, without having to modify or redeploy your code.
- If you have access to the code for your application, then enable full monitoring with [Application Insights](../azure-monitor/app/app-insights-overview.md) by installing the Azure Monitor Application Insights SDK for [.NET](../azure-monitor/learn/quick-monitor-portal.md), [Java](../azure-monitor/app/java-get-started.md), [Node.js](../azure-monitor/learn/nodejs-quick-start.md), or [any other programming languages](../azure-monitor/app/platforms.md). This allows you to specify custom events, metrics, or page views that are relevant to your application and your business.



## Enable monitoring for your entire infrastructure
Applications are only as reliable as their underlying infrastructure. Having monitoring enabled across your entire infrastructure will help you achieve full observability and make it easier to discover a potential root cause when something fails. Azure Monitor helps you track the health and performance of your entire hybrid infrastructure including resources such as VMs, containers, storage, and network.

- You automatically get [platform metrics, activity logs and diagnostics logs](platform/data-sources.md) from most of your Azure resources with no configuration.
- Enable deeper monitoring for VMs with [Azure Monitor for VMs](insights/vminsights-overview.md).
-  Enable deeper monitoring for AKS clusters with [Azure Monitor for containers](insights/container-insights-overview.md).
- Add [monitoring solutions](insights/solutions-inventory.md) for different applications and services in your environment.


[Infrastructure as code](/azure/devops/learn/what-is-infrastructure-as-code) is the management of infrastructure in a descriptive model, using the same versioning as DevOps teams use for source code. It adds reliability and scalability to your environment and allows you to leverage similar processes that used to manage your applications.

-  Use [Resource Manager templates](platform/template-workspace-configuration.md) to enable monitoring and configure alerts over a large set of resources.
- Use [Azure Policy](../governance/policy/overview.md) to enforce different rules over your resources. This ensures that those resources stay compliant with your corporate standards and service level agreements. 


##	Combine resources in Azure Resource Groups
A typical application on Azure today includes multiple resources such as VMs and App Services or microservices hosted on Cloud Services, AKS clusters, or Service Fabric. These applications frequently utilize dependencies like Event Hubs, Storage, SQL, and Service Bus.

- Combine resources in Azure Resource Groups to get full visibility across all your resources that make up your different applications. [Azure Monitor for Resource Groups](../azure-monitor/insights/resource-group-insights.md) provides a simple way to keep track of the health and performance of your entire full-stack application and enables drilling down into respective components for any investigations or debugging.

## Ensure quality through Continuous Deployment
Continuous Integration / Continuous Deployment allows you to automatically integrate and deploy code changes to your application based on the results of automated testing. It streamlines the deployment process and ensures the quality of any changes before they move into production.


- Use [Azure Pipelines](/azure/devops/pipelines) to implement Continuous Deployment and automate your entire process from code commit to production based on your CI/CD tests.
- Use [Quality Gates](/azure/devops/pipelines/release/approvals/gates) to integrate monitoring into your pre-deployment or post-deployment. This ensures that you are meeting the key health/performance metrics (KPIs) as your applications move from dev to production and any differences in the infrastructure environment or scale is not negatively impacting your KPIs.
- [Maintain separate monitoring instances](../azure-monitor/app/separate-resources.md) between your different deployment environments such as Dev, Test, Canary, and Prod. This ensures that collected data is relevant across the associated applications and infrastructure. If you need to correlate data across environments, you can use [multi-resource charts in Metrics Explorer](../azure-monitor/platform/metrics-charts.md) or create [cross-resource queries in Azure Monitor](log-query/cross-workspace-query.md).


## Create actionable alerts with actions
A critical aspect of monitoring is proactively notifying administrators of any current and predicted issues. 

- Create [alerts in Azure Monitor](../azure-monitor/platform/alerts-overview.md) based on logs and metrics to identify predictable failure states. You should have a goal of making all alerts actionable meaning that they represent actual critical conditions and seek to reduce false positives. Use [Dynamic Thresholds](platform/alerts-dynamic-thresholds.md) to automatically calculate baselines on metric data rather than defining your own static thresholds. 
- Define actions for alerts to use the most effective means of notifying your administrators. Available [actions for notification](platform/action-groups.md#create-an-action-group-by-using-the-azure-portal) are SMS, e-mails, push notifications, or voice calls.
- Use more advanced actions to [connect to your ITSM tool](platform/itsmc-overview.md) or other alert management systems through [webhooks](platform/activity-log-alerts-webhook.md).
- Remediate situations identified in alerts as well with [Azure Automation runbooks](../automation/automation-webhooks.md) or [Logic Apps](/connectors/custom-connectors/create-webhook-trigger) that can be launched from an alert using webhooks. 
- Use [autoscaling](../azure-monitor/learn/tutorial-autoscale-performance-schedule.md) to dynamically increase and decrease your compute resources based on collected metrics.

## Prepare dashboards and workbooks
Ensuring that your development and operations have access to the same telemetry and tools allows them to view patterns across your entire environment and minimize your Mean Time To Detect (MTTD) and Mean Time To Restore (MTTR).

- Prepare [custom dashboards](../azure-monitor/learn/tutorial-app-dashboards.md) based on common metrics and logs for the different roles in your organization. Dashboards can combine data from all Azure resources.
- Prepare [Workbooks](../azure-monitor/platform/workbooks-overview.md) to ensure knowledge sharing between development and operations. These could be prepared as dynamic reports with metric charts and log queries, or even as troubleshooting guides prepared by developers helping customer support or operations to handle basic problems.

## Continuously optimize
 Monitoring is one of the fundamental aspects of the popular Build-Measure-Learn philosophy, which recommends continuously tracking your KPIs and user behavior metrics and then striving to optimize them through planning iterations. Azure Monitor helps you collect metrics and logs relevant to your business and to add new data points in the next deployment as required.

- Use tools in Application Insights to [track end-user behavior and engagement](../azure-monitor/learn/tutorial-users.md).
- Use [Impact Analysis](../azure-monitor/app/usage-impact.md) to help you prioritize which areas to focus on to drive to important KPIs.


## Next steps

- Learn about the difference components of [Azure Monitor](overview.md).
- [Add continuous monitoring](../azure-monitor/app/continuous-monitoring.md) to your release pipeline.
