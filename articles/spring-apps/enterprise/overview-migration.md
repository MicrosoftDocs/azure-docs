---
title: Azure Spring Apps to Azure Containe Apps Migration Guide
description: The complete overview guide of Azure Spring Apps to Azure Containe Apps migration.
author: Sean Li
ms.service: azure-spring-apps
ms.topic: overview
ms.date: 09/05/2024
ms.author: seal
ms.custom: devx-track-java, devx-track-extended-java
#Customer intent: As an Azure Cloud user, I want to deploy, run, and monitor Spring applications.
---

# Azure Spring Apps to Azure Containe Apps Migration Guide
To consolidate cloud-native benefits and streamline our offerings, Azure Spring Apps, including consumption and dedicated, basic, standard and enterprise plans, is going to be retired. On September 17<sup>th</sup>, 2024, consumption and dedicated plan (preview) will enter its 6-month sunset period and will retire in March 2025. 

We recommend Azure Container Apps as the hero destination for your migration. Azure Container Apps is a fully managed serverless container platform for polyglot apps and offers enhanced Java features that were previously available in Azure Spring Apps. 

We've introduced a 1-click migration feature to ease the transition from Azure Spring Apps consumption & dedicated plan to Azure Container Apps. Just click the migrate button in the Azure portal and confirm the action. 

This feature will be available mid-October 2024, and we recommend starting the migration then to simplify the process.

![A screenshot of a computer

Description automatically generated](articles/spring-apps/enterprise/media/overview-migration-guide/snapshot1.png)

![A screenshot of a computer

Description automatically generated](articles/spring-apps/enterprise/media/overview-migration-guide/snapshot2.png)

Once the migration is finished, the app will appear as a standard app inside Azure Container Apps app, with the Java development stack turned on. With this option enabled, you get access to Java specific [metrics](https://learn.microsoft.com/en-us/azure/container-apps/java-metrics?tabs=create&pivots=azure-portal) and [logs](https://learn.microsoft.com/en-us/azure/container-apps/java-dynamic-log-level) to monitor and troubleshoot your apps. 

We put together an extensive FAQ to address any questions you might have about the migration.

1. What happens if I do not take any actions by March 30, 2025?
   We will automatically migrate your apps to Azure Container Apps.
1. May I continue to use Azure Container Apps consumption & dedicated plan?
   You may continue to run existing apps until March 30, 2025. New apps and services instances can no longer be created after September 17, 2024.
1. The migration process failed. How can I get help?

   You can create a support request from the Azure portal and select:

   1\.	For Issue type, select “Technical”.

   2\.	For Subscription, select your subscription.

   3\.	For Service, select “Azure Spring Apps”.

   4\.	For Resource, select your Azure Spring Apps resource.

   5\.	For Summary, type a description of your issue.

   6\.	For Problem type, select “My issue is not listed”.

1. Do I need to manually create Spring Cloud Config and Spring Cloud Eureka in Azure Container Apps?

   Yes, Spring Cloud Config and Spring Cloud Eureka need to be recreated in Azure Container Apps. Both Spring Cloud Config and Spring Cloud Eureka are also managed components in Azure Container Apps. There are some experiential differences. Refer to these two documents to learn more. 

   <https://learn.microsoft.com/en-us/azure/container-apps/java-eureka-server>

   <https://learn.microsoft.com/en-us/azure/container-apps/java-config-server>

   If you need additional assistance creating and migrating Spring Cloud Config and Spring Cloud Eureka to Azure Container Apps, please create a ticket and we are here to help.

1. Will there be downtime during the migration process?

   No, there will be no downtime unless you are using Spring Cloud Config and Spring Cloud Eureka, which need to be manually recreated in Azure Container Apps.

1. What will happen to apps that have in-flight transactions during the migration?
   All in-flight transactions will continue to be executed without any interruptions, unless you are using Spring Cloud Config and Spring Cloud Eureka, which need to be manually recreated in Azure Container Apps.
1. Will my app change IP address/FQDN after the migration?
   No, it will remain the same.
1. I’m using persistent storage, how do I recreate them in Azure Container Apps?
   No, persistent storage will be auto migrated.
1. What are pricing implications with moving to Azure Container Apps?

   Azure Container Apps has the same pricing structure as Azure Spring Apps for both consumption and dedicated plans. Charges for active and idle CPU/memory use, along with VM SKUs in dedicated workloads, are identical in Azure Spring Apps and Azure Container Apps. The monthly free grant also applies directly to Azure Container Apps.

   The only exception to the rule is number of requests for managed Java components are billed in Azure Container Apps consumption plan. 

   Lastly with Azure Container Apps you can apply Azure savings plan for compute and save up to 15% with 1 year commitment and 17% with 3 year commitment. Let’s take one example to illustrate these differences.

<table>   <tr><th valign="top"><b>Resource used for user apps</b> </th><th valign="top"><b>Azure Spring Apps consumption plan</b></th><th valign="top"><b>Azure Container Apps consumption plan</b></th></tr>
   <tr><td valign="top">CPU active usage</td><td colspan="2" rowspan="4" valign="top">No change </td></tr>
   <tr><td valign="top">GB memory active usage</td></tr>
   <tr><td valign="top">CPU idle usage</td></tr>
   <tr><td valign="top">GB memory idle usage</td></tr>
</table>
 

<table>   <tr><th valign="top"><b>Resource used for managed Java components</b></th><th valign="top"><b>Azure Spring Apps consumption plan</b></th><th colspan="2" valign="top"><b>Azure Container Apps consumption plan</b></th></tr>
   <tr><td valign="top">Eureka active CPU</td><td colspan="3" rowspan="4" valign="top">No change</td></tr>
   <tr><td valign="top">Eureka idle CPU</td></tr>
   <tr><td valign="top">Config server active CPU</td></tr>
   <tr><td valign="top">Config server idle CPU</td></tr>
   <tr><td valign="top">1M Requests made to Eureka</td><td colspan="2" valign="top">No extra costs</td><td valign="top">*$0.4 </td></tr>
   <tr><td valign="top">1M Requests made to Config server</td><td colspan="2" valign="top">No extra costs</td><td valign="top">*$0.4 </td></tr>
</table>

   \*estimated price based on central U.S.

<table>   <tr><th valign="top"><b>Resource used for user apps</b> </th><th valign="top"><b>Azure Spring Apps</b> </th><th valign="top"><b>Azure Container Apps dedicated workload profile with 1-year Saving plan</b></th></tr>
   <tr><td valign="top">Resources used in consumption plan</td><td rowspan="2" valign="top">Advertised price</td><td rowspan="2" valign="top">15% off advertised price</td></tr>
   <tr><td valign="top">Resources used in dedicated workload profile</td></tr>
</table>

1. I’m using my own VNet, how do I continue to use my own VNet in Azure Container Apps?
   VNet is already managed by Azure Container Apps  environment today. There will be no changes to the VNet experiences. If you are using your own VNet today, the same VNet will continue to be used.
1. Will my app be migrated to the consumption plan or the consumption and dedicated plan with workload profiles in Azure Container Apps?

   There is a direct mapping between the service plans in Azure Spring Apps and Azure Container Apps. If your app is currently running in the consumption plan, it will be moved to the consumption only plan in Azure Container Apps. If your app is currently running in a consumption and dedicated workload profile, it will be transitioned to the corresponding workload profile in Azure Container Apps.

1. What about my deployment pipelines/workflow? Will they keep working? 

   Your deployment pipeline will need to be pointed to Azure Container Apps.

1. I am managing my applications through AZ CLI, will my current automation scripts continue to work? 

   No, AZ CLI scripts will need to be changed. Please refer to az container app command group to make these changes. <https://learn.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest&preserve-view=true> 

1. Are there plans to retire any other Azure Spring Apps SKU’s?  
   Yes, we are also retiring other Azure Spring Apps plans. Click this link to learn more. <https://aka.ms/asaretirement>



