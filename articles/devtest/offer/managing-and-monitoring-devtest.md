---
title: Managing and Monitoring your Azure Dev/Test Subscriptions
description: A guide to managing your Azure Dev/Test subscriptions with the flexibility of Azure's cloud environment. This guide also covers Azure Monitor to help maximize availability and performance for applications and services.
author: j-martens
ms.author: jmartens
ms.prod: visual.studio.windows
ms.topic: how-to 
ms.date: 10/01/2021
ms.custom: devtestoffer
---

## Managing Azure DevTest Subscriptions

From an organizational standpoint, managing your Azure Dev/Test Subscriptions is extremely important. Managing cost, monitoring the stages of production, the resources you deploy and the processes you configure is a top priority in subscription management.  

Azure’s cloud environment gives you more flexibility in managing cost and workloads from an op expense perspective unlike on-premises management where you are managing from a capability expense perspective.
Services within the subscription and resource group levels are zero cost – only the resources themselves have cost to them.  

![A diagram of Azure Organizations and Governance](media/managing-and-monitoring/orgsandgovernance.png "Azure organizations and governance.")

When managing from an operational expense perspective, you only pay for what you use. There are several tools with Azure dev/test subscriptions that help you manage cost during deployment.  

## Monitoring through a different lens

[Azure Monitor](../../azure-monitor/overview.md) helps you maximize the availability and performance of your applications and services. Deliver comprehensive solutions for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. It helps you understand how your applications are performing and proactively identifies issues affecting them and the resources they depend on.  

Within Azure, you can use monitoring to accelerate time to market and ensure telemetry in your production services. You can aggregate and analyze metrics, logs, and traces. Through monitoring, you can also fire alerts and send notifications or call automated solutions.  

Azure Monitor allows you to leverage dev/test benefits to optimize your apps’ time to market and deliver those applications.  

Monitoring allows you to maximize your dev/test benefits with net new applications and existing applications.  

- Pre-Production with Net New Green Field Applications – with new apps, you create and enable custom metrics with log analytics or smart alerts in pre-production that you will use in production. Using monitoring early refines your telemetry in your production services  
- Post-Production with Existing Applications – when deploying new features or adding new functionality with an API to existing apps, you can deploy this feature in pre-production and tweak your monitoring to ensure correct telemetry early. Using tracking in the new feature's pre-production gives you clear visibility and allows you to blend this monitoring with your overall monitoring system after production. Integrates recent telemetry with existing telemetry to ensure monitoring is utilized  

Monitoring the different stages of non-production deployment mirrors the monitoring during production. It allows you to manage your costs and analyze your spending before production as well as in post-production.  

## Cost Management

[Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md) allows you to improve the technical performance of your business workloads significantly. It can also reduce your costs and the overhead required to manage organizational assets.  

In regard to monitoring, you can use cost-analysis tools in pre-production before you deploy your services to run an analysis of your current pre-production compute to forecast production costs and potentially save money.  

## Performance Management

In addition to monitoring and cost management in pre-production environments, you also want to performance test your pre-production compute against expected workloads.  

In pre-production, you may set up scaling to be able to expand based on load. When you test your application in a dev/test environment under load, you can get better figures from a cost-analysis and monitoring perspective to know whether you need to start from a higher or lower scale.  

Load and duress analysis provide additional data in pre-production so you can continue to optimize your time to market and the delivery of your application.  

As you perform load and duress testing with your application or service of choice, the method behind scaling up or out depends on your workloads. You can learn more about scaling your apps in Azure:  

- [Scale up an app in Azure App Service](../../app-service/manage-scale-up.md)  
- [Get started with Autoscale in Azure](../../azure-monitor/platform/autoscale-get-started?toc=/azure/app-service/toc.json)  

Enable monitoring for your application with [Application Insights](../../azure-monitor/app/app-insights-overview.md) to collect detailed information including page views, application requests, and exceptions.  

## Azure Automation

[Azure automation](../../automation/automation-intro.md) delivers a cloud-based automation and configuration service that supports consistent management across your Azure and non-Azure environments. This tool gives you complete control during deployment, operations, and decommission of workloads and resources. Azure Automation is always on and works with existing resources. It provides a way to create resources or subscriptions on demand so you only pay for what you use when you need it.  

Example: If you're following a dev/test production deployment, some of the resources and stages need to be up and running all the time while others only need to be updated and run a few times a year.  

Azure Automation becomes important in this scenario. When going into a new round of app development and you submit your first pull request (PR), you can kick off an automation job. This will deploy infrastructure as code through an Azure Resource Manager (ARM) template to create all your resources in your Azure dev/test subscription during pre-production.  

## Azure Resource Manager

[Azure Resource Manager (ARM) templates](../../azure-resource-manager/templates/) implement infrastructure as code for your Azure solutions. The template defines the infrastructure and configuration for your project. You can automate your deployments.  

You can deploy your configurations as many times as you want to update the pre-production environment and track your costs. Using Azure Automation you can run and delete your ARM templates as needed.  

Going back to the example above, when you have a service or resource that only needs to be updated twice a year, you can use Devops tools to deploy your ARM template using an automation job, turn if off, and then redeploy it when needed.  