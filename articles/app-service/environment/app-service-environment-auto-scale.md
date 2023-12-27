---
title: Autoscaling v1
description: Autoscaling and App Service Environment v1. This doc is provided only for customers who use the legacy v1 ASE.
author: madsd

ms.assetid: c23af2d8-d370-4b1f-9b3e-8782321ddccb
ms.topic: article
ms.date: 03/29/2022
ms.author: madsd
ms.custom: seodec18

---
# Autoscaling and App Service Environment v1

> [!IMPORTANT]
> This article is about App Service Environment v1. [App Service Environment v1 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-version-1-and-version-2-will-be-retired-on-31-august-2024-2/). There's a new version of App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version, start with the [Introduction to the App Service Environment](overview.md). If you're currently using App Service Environment v1, please follow the steps in [this article](upgrade-to-asev3.md) to migrate to the new version.

As of 15 January 2024, you can no longer create new App Service Environment v1 resources using any of the available methods including ARM/Bicep templates, Azure Portal, Azure CLI, or REST API. You must [migrate to App Service Environment v3](upgrade-to-asev3.md) before 31 August 2024 to prevent resource deletion and data loss.
>

Azure App Service environments support *autoscaling*. You can autoscale individual worker pools based on metrics or schedule.

![Autoscale options for a worker pool.][intro]

Autoscaling optimizes your resource utilization by automatically growing and shrinking an App Service environment to fit your budget and or load profile.

## Configure worker pool autoscale
You can access the autoscale functionality from the **Settings** tab of the worker pool.

![Settings tab of the worker pool.][settings-scale]

From there, the interface should be fairly familiar since it is the same experience that you see when you scale an App Service plan. 

![Manual scale settings.][scale-manual]

You can also configure an autoscale profile.

![Autoscale settings.][scale-profile]

Autoscale profiles are useful to set limits on your scale. This way, you can have a consistent performance experience by setting a lower bound scale value (1) and a predictable spend cap by setting an upper bound (2).

![Scale settings in profile.][scale-profile2]

After you define a profile, you can add autoscale rules to scale up or down the number of instances in the worker pool within the bounds defined by the profile. Autoscale rules are based on metrics.

![Scale rule.][scale-rule]

 Any worker pool or front-end metrics can be used to define autoscale rules. These metrics are the same metrics you can monitor in the resource blade graphs or set alerts for.

## Autoscale example
Autoscale of an App Service environment can best be illustrated by walking through a scenario.

This article explains all the necessary considerations when you set up autoscale. The article walks you through the interactions that come into play when you factor in autoscaling App Service environments that are hosted in App Service Environment.

### Scenario introduction
Frank is a sysadmin for an enterprise who has migrated a portion of the workloads that they manage to an App Service environment.

The App Service environment is configured to manual scale as follows:

* **Front ends:** 3
* **Worker pool 1**: 10
* **Worker pool 2**: 5
* **Worker pool 3**: 5

Worker pool 1 is used for production workloads, while worker pool 2 and worker pool 3 are used for quality assurance (QA) and development workloads.

The App Service plans for QA and dev are configured to manual scale. The production App Service plan is set to autoscale to deal with variations in load and traffic.

Frank is very familiar with the application. They know that the peak hours for load are between 9:00 AM and 6:00 PM because this is a line-of-business (LOB) application that employees use while they are in the office. Usage drops after that when users are done for that day. Outside peak hours, there is still some load because users can access the app remotely by using their mobile devices or home PCs. The production App Service plan is already configured to autoscale based on CPU usage with the following rules:

![Specific settings for LOB app.][asp-scale]

| **Autoscale profile – Weekdays – App Service plan** | **Autoscale profile – Weekends – App Service plan** |
| --- | --- |
| **Name:** Weekday profile |**Name:** Weekend profile |
| **Scale by:** Schedule and performance rules |**Scale by:** Schedule and performance rules |
| **Profile:** Weekdays |**Profile:** Weekend |
| **Type:** Recurrence |**Type:** Recurrence |
| **Target range:** 5 to 20 instances |**Target range:** 3 to 10 instances |
| **Days:** Monday, Tuesday, Wednesday, Thursday, Friday |**Days:** Saturday, Sunday |
| **Start time:** 9:00 AM |**Start time:** 9:00 AM |
| **Time zone:** UTC-08 |**Time zone:** UTC-08 |
|  | |
| **Autoscale rule (Scale Up)** |**Autoscale rule (Scale Up)** |
| **Resource:** Production (App Service Environment) |**Resource:** Production (App Service Environment) |
| **Metric:** CPU % |**Metric:** CPU % |
| **Operation:** Greater than 60% |**Operation:** Greater than 80% |
| **Duration:** 5 Minutes |**Duration:** 10 Minutes |
| **Time aggregation:** Average |**Time aggregation:** Average |
| **Action:** Increase count by 2 |**Action:** Increase count by 1 |
| **Cool down (minutes):** 15 |**Cool down (minutes):** 20 |
|  | |
| **Autoscale rule (Scale Down)** |**Autoscale rule (Scale Down)** |
| **Resource:** Production (App Service Environment) |**Resource:** Production (App Service Environment) |
| **Metric:** CPU % |**Metric:** CPU % |
| **Operation:** Less than 30% |**Operation:** Less than 20% |
| **Duration:** 10 minutes |**Duration:** 15 minutes |
| **Time aggregation:** Average |**Time aggregation:** Average |
| **Action:** Decrease count by 1 |**Action:** Decrease count by 1 |
| **Cool down (minutes):** 20 |**Cool down (minutes):** 10 |

### App Service plan inflation rate
App Service plans that are configured to autoscale do so at a maximum rate per hour. This rate
can be calculated based on the values provided on the autoscale rule.

Understanding and calculating the *App Service plan inflation rate* is important for App Service environment autoscale because scale changes to a worker pool are not instantaneous.

The App Service plan inflation rate is calculated as follows:

![App Service plan inflation rate calculation.][ASP-Inflation]

Based on the Autoscale – Scale Up rule for the Weekday profile of the production App Service plan:

![App Service plan inflation rate for weekdays based on Autoscale – Scale Up rule.][Equation1]

In the case of the Autoscale – Scale Up rule for the Weekend profile of the production
App Service plan, the formula would resolve to:

![App Service plan inflation rate for weekends based on Autoscale – Scale Up rule.][Equation2]

This value can also be calculated for scale-down operations.

Based on the Autoscale – Scale Down rule for the Weekday profile of the production
App Service plan, this would look as follows:

![App Service plan inflation rate for weekdays based on Autoscale – Scale Down rule.][Equation3]

In the case of the Autoscale – Scale Down rule for the Weekend profile of the production
App Service plan, the formula would resolve to:  

![App Service plan inflation rate for weekends based on Autoscale – Scale Down rule.][Equation4]

The production App Service plan can grow at a maximum rate of eight instances/hour 
during the week and four instances/hour during the weekend. It can release instances 
at a maximum rate of four instances/hour during the week and six instances/hour during weekends.

If multiple App Service plans are being hosted in a worker pool, you have to calculate the *total inflation rate* as the sum of the inflation rate for all the App Service plans that are being hosting in that worker pool.

![Total inflation rate calculation for multiple App Service plans hosted in a worker pool.][ASP-Total-Inflation]

### Use the App Service plan inflation rate to define worker pool autoscale rules
Worker pools that host App Service plans that are configured to autoscale need to
be allocated a buffer of capacity. The buffer allows for the autoscale operations to grow and shrink the
App Service plan as needed. The minimum buffer would be the calculated Total App Service Plan Inflation Rate.

Because App Service environment scale operations take some time to apply, any change should account
for further demand changes that could happen while a scale operation is in progress. To accommodate this latency, we
recommend that you use the calculated Total App Service Plan Inflation Rate as the minimum number of
instances that are added for each autoscale operation.

With this information, Frank can define the following autoscale profile and rules:

![Autoscale profile rules for LOB example.][Worker-Pool-Scale]

| **Autoscale profile – Weekdays** | **Autoscale profile – Weekends** |
| --- | --- |
| **Name:** Weekday profile |**Name:** Weekend profile |
| **Scale by:** Schedule and performance rules |**Scale by:** Schedule and performance rules |
| **Profile:** Weekdays |**Profile:** Weekend |
| **Type:** Recurrence |**Type:** Recurrence |
| **Target range:** 13 to 25 instances |**Target range:** 6 to 15 instances |
| **Days:** Monday, Tuesday, Wednesday, Thursday, Friday |**Days:** Saturday, Sunday |
| **Start time:** 7:00 AM |**Start time:** 9:00 AM |
| **Time zone:** UTC-08 |**Time zone:** UTC-08 |
|  | |
| **Autoscale rule (Scale Up)** |**Autoscale rule (Scale Up)** |
| **Resource:** Worker pool 1 |**Resource:** Worker pool 1 |
| **Metric:** WorkersAvailable |**Metric:** WorkersAvailable |
| **Operation:** Less than 8 |**Operation:** Less than 3 |
| **Duration:** 20 minutes |**Duration:** 30 minutes |
| **Time aggregation:** Average |**Time aggregation:** Average |
| **Action:** Increase count by 8 |**Action:** Increase count by 3 |
| **Cool down (minutes):** 180 |**Cool down (minutes):** 180 |
|  | |
| **Autoscale rule (Scale Down)** |**Autoscale rule (Scale Down)** |
| **Resource:** Worker pool 1 |**Resource:** Worker pool 1 |
| **Metric:** WorkersAvailable |**Metric:** WorkersAvailable |
| **Operation:** Greater than 8 |**Operation:** Greater than 3 |
| **Duration:** 20 minutes |**Duration:** 15 minutes |
| **Time aggregation:** Average |**Time aggregation:** Average |
| **Action:** Decrease count by 2 |**Action:** Decrease count by 3 |
| **Cool down (minutes):** 120 |**Cool down (minutes):** 120 |

The Target range defined in the profile is calculated by the minimum instances defined in the
profile for the App Service plan + buffer.

The Maximum range would be the sum of all the maximum ranges for all App Service plans hosted in
the worker pool.

The Increase count for the scale up rules should be set to at least 1X the
App Service Plan Inflation Rate for scale up.

Decrease count can be adjusted to something between 1/2X or 1X the App Service Plan Inflation
Rate for scale down.

### Autoscale for front-end pool
Rules for front-end autoscale are simpler than for worker pools. Primarily, you should  
make sure that duration of the measurement and the cooldown timers consider that scale
operations on an App Service plan are not instantaneous.

For this scenario, Frank knows that the error rate increases after front ends 
reach 80% CPU utilization and sets the autoscale rule to increase instances as follows:

![Autoscale settings for front-end pool.][Front-End-Scale]

| **Autoscale profile – Front ends** |
| --- |
| **Name:** Autoscale – Front ends |
| **Scale by:** Schedule and performance rules |
| **Profile:** Everyday |
| **Type:** Recurrence |
| **Target range:** 3 to 10 instances |
| **Days:** Everyday |
| **Start time:** 9:00 AM |
| **Time zone:** UTC-08 |
|  |
| **Autoscale rule (Scale Up)** |
| **Resource:** Front-end pool |
| **Metric:** CPU % |
| **Operation:** Greater than 60% |
| **Duration:** 20 minutes |
| **Time aggregation:** Average |
| **Action:** Increase count by 3 |
| **Cool down (minutes):** 120 |
|  |
| **Autoscale rule (Scale Down)** |
| **Resource:** Worker pool 1 |
| **Metric:** CPU % |
| **Operation:** Less than 30% |
| **Duration:** 20 Minutes |
| **Time aggregation:** Average |
| **Action:** Decrease count by 3 |
| **Cool down (minutes):** 120 |

<!-- IMAGES -->
[intro]: ./media/app-service-environment-auto-scale/introduction.png
[settings-scale]: ./media/app-service-environment-auto-scale/settings-scale.png
[scale-manual]: ./media/app-service-environment-auto-scale/scale-manual.png
[scale-profile]: ./media/app-service-environment-auto-scale/scale-profile.png
[scale-profile2]: ./media/app-service-environment-auto-scale/scale-profile-2.png
[scale-rule]: ./media/app-service-environment-auto-scale/scale-rule.png
[asp-scale]: ./media/app-service-environment-auto-scale/asp-scale.png
[ASP-Inflation]: ./media/app-service-environment-auto-scale/asp-inflation-rate.png
[Equation1]: ./media/app-service-environment-auto-scale/equation1.png
[Equation2]: ./media/app-service-environment-auto-scale/equation2.png
[Equation3]: ./media/app-service-environment-auto-scale/equation3.png
[Equation4]: ./media/app-service-environment-auto-scale/equation4.png
[ASP-Total-Inflation]: ./media/app-service-environment-auto-scale/asp-total-inflation-rate.png
[Worker-Pool-Scale]: ./media/app-service-environment-auto-scale/wp-scale.png
[Front-End-Scale]: ./media/app-service-environment-auto-scale/fe-scale.png
