---
title: Upgrade to App Service Environment v3
description: Take the first steps toward upgrading to App Service Environment v3.
ms.author: jordanselig
author: seligj95
ms.topic: overview
ms.date: 6/12/2024
---

# Upgrade to App Service Environment v3

> [!IMPORTANT]
> If you're currently using App Service Environment v1 or v2, you must migrate your workloads to [App Service Environment v3](overview.md). [App Service Environment v1 and v2 are retired as of 31 August 2024](https://aka.ms/postEOL/ASE). There's a new version of App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version, start with the [Introduction to the App Service Environment](overview.md). If you're currently using App Service Environment v1, please follow the steps in [this article](upgrade-to-asev3.md) to migrate to the new version.
>
> As of 31 August 2024, [Service Level Agreement (SLA) and Service Credits](https://aka.ms/postEOL/ASE/SLA) no longer apply for App Service Environment v1 and v2 workloads that continue to be in production since they are retired products. Decommissioning of the App Service Environment v1 and v2 hardware has begun, and this may affect the availability and performance of your apps and data.
>
> You must complete migration to App Service Environment v3 immediately or your apps and resources may be deleted. We will attempt to auto-migrate any remaining App Service Environment v1 and v2 on a best-effort basis using the [in-place migration feature](migrate.md), but Microsoft makes no claim or guarantees about application availability after auto-migration. You may need to perform manual configuration to complete the migration and to optimize your App Service plan SKU choice to meet your needs. If auto-migration isn't feasible, your resources and associated app data will be deleted. We strongly urge you to act now to avoid either of these extreme scenarios.
>

This page is your one-stop shop for guidance and resources to help you upgrade successfully with minimal downtime. Follow the guidance to plan and complete your upgrade as soon as possible. This page is updated with the latest information as it becomes available.

## Upgrade steps

|Step|Action|Resources|
|----|------|---------|
|**1**|**Pre-flight check**|Determine if your environment meets the prerequisites to automate your upgrade using one of the automated migration features. Decide whether an in-place or side-by-side migration is right for your use case.<br>- [Migration path decision tree](#migration-path-decision-tree)<br>- [Automated upgrade using the in-place migration feature](migrate.md)<br>- [Automated upgrade using the side-by-side migration feature](side-by-side-migrate.md)<br><br>If not, you can upgrade manually.<br>- [Manual migration](migration-alternatives.md)|
|**2**|**Migrate**|Based on results of your review, either upgrade using one of the automated migration features or follow the manual steps.|
|**3**|**Testing and troubleshooting**|Upgrading using one of the automated migration features requires a 3-6 hour service window. If you use the side-by-side migration feature, you have the opportunity to [test and validate your App Service Environment v3](./side-by-side-migrate.md#redirect-customer-traffic-validate-your-app-service-environment-v3-and-complete-migration) before completing the upgrade. Support teams are monitoring upgrades to ensure success. If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).|
|**4**|**Optimize your App Service plans**|Once your upgrade is complete, you can optimize the App Service plans for additional benefits.<br><br>Review the autoselected Isolated v2 SKU sizes and scale up or scale down your App Service plans as needed.<br>- [Scale down your App Service plans](../manage-scale-up.md)<br>- [App Service Environment post-migration scaling guidance](migrate.md#pricing)<br><br>Explore reserved instance pricing, savings plans, and check out the pricing estimates if needed.<br>- [App Service pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/)<br>- [How reservation discounts apply to Isolated v2 instances](../../cost-management-billing/reservations/reservation-discount-app-service.md#how-reservation-discounts-apply-to-isolated-v2-instances)<br>- [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator)|
|**5**|**Learn more**|Overview of the upgrade process with App Service Environment Product Managers:<br>- [Azure App Service Community Standup: App Service Environment Migration](https://www.youtube.com/live/rjeVKFZHeb4)<br><br>On-demand Learn Live sessions with Azure FastTrack Architects:<br>- [Use the in-place automated migration feature](https://www.youtube.com/watch?v=lI9TK_v-dkg)<br>- [Use the side-by-side automated migration feature](https://www.youtube.com/watch?v=VccH5C0rdto)<br><br>Need more help? [Submit a request](https://cxp.azure.com/nominationportal/nominationform/fasttrack) to contact FastTrack.<br><br>[Frequently asked questions](migrate.md#frequently-asked-questions)<br><br>[Community support](https://aka.ms/asev1v2retirement)|

## Additional information

### What are the benefits of upgrading?

App Service Environment v3 is the latest version of App Service Environment. It's easier to use, runs on more powerful infrastructure that can go up to 64 cores and 256-GB RAM with faster scaling speeds for both Windows and Linux, and has simpler network topology. For more information about these and other benefits, see the following resources.

- [Three reasons why you should prioritize migrating to App Service Environment v3 for your business](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/three-reasons-why-you-should-prioritize-migrating-to-app-service/ba-p/3596628)
- [Estimate your cost savings by migrating to App Service Environment v3](https://azure.github.io/AppService/2023/03/02/App-service-environment-v3-pricing.html)
- [Using App Service Environment v3 in Compliance-Oriented Industries](https://azure.microsoft.com/resources/using-app-service-environment-v3-in-compliance-oriented-industries/)

### What changes when upgrading to App Service Environment v3?

- [App Service Environment v3 overview](overview.md)
- [App Service Environment version comparison](version-comparison.md)
- [Feature differences](overview.md#feature-differences)

### What tooling is available to help with the upgrade to App Service Environment v3?

There are two automated migration features available to help you upgrade to App Service Environment v3.

- **In-place migration feature** migrates your App Service Environment to App Service Environment v3 in-place and is the recommended migration option. In-place means that your App Service Environment v3 replaces your existing App Service Environment in the same subnet. There's application downtime during the migration because a subnet can only have a single App Service Environment at a given time. For more information about this feature, see [Automated upgrade using the in-place migration feature](migrate.md).
- **Side-by-side migration feature** creates a new App Service Environment v3 in a different subnet that you choose and recreates all of your App Service plans and apps in that new environment. Your existing environment is up and running during the entire migration. Once the new App Service Environment v3 is ready, you can redirect traffic to the new environment and complete the migration. There's no application downtime during the migration. For more information about this feature, see [Automated upgrade using the side-by-side migration feature](side-by-side-migrate.md).
    > [!NOTE]
    > Side-by-side migration comes with additional challenges compared to in-place migration. For customers who need to decide between the two options, the recommendation is to use in-place migration since there are fewer steps and less complexity. If you decide to use side-by-side migration, review the [common sources of issues when migrating using the side-by-side migration feature](side-by-side-migrate.md#common-sources-of-issues-when-migrating-using-the-side-by-side-migration-feature) section to avoid common pitfalls.
    >
- **Manual migration options** are available if you can't use the automated migration features. For more information about these options, see [Migration alternatives](migration-alternatives.md).

### Why do some customers see performance differences after migrating?

App Service Environment v3 uses newer virtual machines that are based on virtual CPUs (vCPU), not physical cores. One vCPU typically doesn't equate to one physical core in terms of raw CPU performance. As a result, CPU-bound workloads might see a performance difference if attempting to match old-school physical core counts to current vCPU counts.

When migrating to App Service Environment v3, we map App Service plan tiers as follows:

|App Service Environment v2 SKU|App Service Environment v3 SKU|
|------------------------------|------------------------------|
|I1                            |I1v2                          |
|I2                            |I2v2                          |
|I3                            |I3v2                          |

### Migration path decision tree

Use the following decision tree to determine which migration path is right for you. The recommendation for all customers is to use the in-place migration feature if your App Service Environment meets the criteria for an automated migration. In-place migration is the simplest and fastest way to upgrade to App Service Environment v3.

:::image type="content" source="./media/migration/migration-path-decision-tree.png" alt-text="Screenshot of the decision tree for helping decide which App Service Environment upgrade option to use." lightbox="./media/migration/migration-path-decision-tree-expanded.png":::

### Post-retirement date activities

After 31 August 2024, decommissioning of the App Service Environment v1 and v2 hardware will begin, and this may affect the availability and performance of your apps and data. Additionally, since these products will be retired, after the official retirement on 31 August 2024, Service Level Agreement (SLA) and Service Credits will no longer apply for App Service Environment v1 and v2 workloads that continue to be in production.  

You must complete migration to App Service Environment v3 as soon as possible or your apps and resources may be deleted. We will attempt to auto-migrate any remaining App Service Environment v1 and v2 on a best-effort basis using the [in-place migration feature](migrate.md), but Microsoft makes no claim or guarantees about application availability after auto-migration. You may need to perform manual configuration to complete the migration and to optimize your App Service plan SKU choice to meet your needs. If auto-migration is not feasible, your resources and associated app data will be deleted. We strongly urge you to act now to avoid either of these extreme scenarios.

### Cost saving opportunities after upgrading to App Service Environment v3

The App Service plan SKUs available for App Service Environment v3 run on the Isolated v2 (Iv2) tier. The number of cores and amount of RAM are effectively doubled per corresponding tier compared the Isolated tier. When you migrate, your App Service plans are converted to the corresponding tier. For example, your I2 instances are converted to I2v2. While I2 has two cores and 7-GB RAM, I2v2 has four cores and 16-GB RAM. If you expect your capacity requirements to stay the same, you're over-provisioned and paying for compute and memory you're not using. For this scenario, you can scale down your I2v2 instance to I1v2 and end up with a similar number of cores and RAM that you had previously.

> [!NOTE]
> All scenarios are calculated using costs based on Linux $USD pricing in East US. The payment option is set to monthly.  Estimates are based on the prices applicable on the day the estimate was created. Actual total estimates may vary. For the most up-to-date estimates, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).
>

To demonstrate the cost saving opportunity for this scenario, use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate the monthly savings as a result of scaling down your App Service plans. For this example, your App Service Environment v2 has 1 I2 instance. You require two cores and 7-GB RAM. You're using pay-as-you-go pricing. On App Service Environment v2, your monthly payment is the following.

[Stamp fee + 1(I2) = $991.34 + $416.10 = $1,407.44](https://azure.com/e/014bf22b3e88439dba350866a472a41a)

When you migrate this App Service Environment using the migration feature, your new App Service Environment v3 has 1 I2v2 instance, which means you have four cores and 16-GB RAM. If you don't change anything, your monthly payment is the following.

[1(I2v2) = $563.56](https://azure.com/e/17946ea2c4db483d882526ba515a6771)

Your monthly cost is reduced, but you don't need that much compute and capacity. You scale down your instance to I1v2 and your monthly cost is reduced even further.

[1(I1v2) = $281.78](https://azure.com/e/9d481c3af3cd407d975017c2b8158bbd)

#### Break even point

In most cases, migrating to App Service Environment v3 allows for cost saving opportunities. However, cost savings might not always be possible, especially if you're required to maintain a large number of small instances.

To demonstrate this scenario, you have an App Service Environment v2 with a single I1 instance. Your monthly cost is:

[Stamp fee + 1(I1) = $991.34 + $208.05 = **$1,199.39**](https://azure.com/e/ac89a70062a240e1b990304052d49fad)

If you migrate this environment to App Service Environment v3, your monthly cost is:

[1(I1v2) = **$281.78**](https://azure.com/e/9d481c3af3cd407d975017c2b8158bbd)

This change is a significant cost reduction, but you're over-provisioned since you have double the cores and RAM, which you might not need. This excess isn't an issue for this scenario since the new environment is cheaper. However, when you increase your I1 instances in a single App Service Environment, you see how migrating to App Service Environment v3 can increase your monthly cost.

For this scenario, your App Service Environment v2 has 14 I1 instances. Your monthly cost is:

[Stamp fee + 14(I1) = $991.34 + $2,912.70 = **$3,904.04**](https://azure.com/e/bd1dce4b5c8f4d6d807ed3c4ae78fcae)

When you migrate this environment to App Service Environment v3, your monthly cost is:

[14(I1v2) = **$3,944.92**](https://azure.com/e/e0f1ebacf937479ba073a9c32cb2452f)

Your App Service Environment v3 is now more expensive than your App Service Environment v2. As you start add more I1 instances, and therefore need more I1v2 instances when you migrate, the difference in price becomes more significant. If this scenario is a requirement for your environment, you might need to plan for an increase in your monthly cost. The following graph visually depicts the point where App Service Environment v3 becomes more expensive than App Service Environment v2 for this specific scenario.

> [!NOTE]
> This calculation was done with Linux $USD prices in East US. Break even points will vary due to price variances in the different regions. For an estimate that reflects your situation, see [the Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).
>

:::image type="content" source="./media/migration/pricing-break-even-point.png" alt-text="Graph that shows the point where App Service Environment v3 becomes more expensive than v2 for the scenario where you only have small instances.":::

For more scenarios on cost changes and savings opportunities with App Service Environment v3, see [Estimate your cost savings by migrating to App Service Environment v3](https://azure.github.io/AppService/2023/03/02/App-service-environment-v3-pricing.html).

## We want your feedback

Got 2 minutes? We'd love to hear about your upgrade experience in this quick, anonymous poll. You'll help us learn and improve.

> [!div class="nextstepaction"]
> [Feedback link](https://forms.office.com/r/fJUuxtBGGC)

## Next steps

> [!div class="nextstepaction"]
> [Learn about App Service Environment v3](overview.md)

> [!div class="nextstepaction"]
> [Migration to App Service Environment v3 using the in-place migration feature](migrate.md)

> [!div class="nextstepaction"]
> [Migration to App Service Environment v3 using the side-by-side migration feature](side-by-side-migrate.md)

> [!div class="nextstepaction"]
> [Manually migrate to App Service Environment v3](migration-alternatives.md)
