---
title: Upgrade to App Service Environment v3
description: Take the first steps toward upgrading to App Service Environment v3.
ms.author: jordanselig
author: seligj95
ms.topic: overview
ms.date: 10/30/2023
---

# Upgrade to App Service Environment v3

> [!IMPORTANT]
> If you're currently using App Service Environment v1 or v2, you must migrate your workloads to [App Service Environment v3](overview.md). [App Service Environment v1 and v2 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). Failure to migrate by that date will result in loss of the environments, running applications, and all application data.
>

This page is your one-stop shop for guidance and resources to help you upgrade successfully with minimal downtime. Follow the guidance to plan and complete your upgrade as soon as possible. This page will be updated with the latest information as it becomes available.

## Upgrade steps

|Step|Action|Resources|
|----|------|---------|
|**1**|**Pre-flight check**|Determine if your environment meets the prerequisites to automate your upgrade using the migration feature.<br><br>- [Automated upgrade using the migration feature](migrate.md)<br><br>If not, you can upgrade manually.<br><br>- [Manual migration](migration-alternatives.md)|
|**2**|**Migrate**|Based on results of your review, either upgrade using the migration feature or follow the manual steps.<br><br>- [Use the automated migration feature](how-to-migrate.md)<br>- [Migrate manually](migration-alternatives.md)|
|**3**|**Testing and troubleshooting**|Upgrading using the automated migration feature requires a 3-6 hour service window. Support teams are monitoring upgrades to ensure success. If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).|
|**4**|**Optimize your App Service plans**|Once your upgrade is complete, you can optimize the App Service plans for additional benefits.<br><br>Review the autoselected Isolated v2 SKU sizes and scale up or scale down your App Service plans as needed.<br><br>- [Scale down your App Service plans](../manage-scale-up.md)<br>- [App Service Environment post-migration scaling guidance](migrate.md#pricing)<br><br>Explore reserved instance pricing, savings plans, and check out the pricing estimates if needed.<br><br>- [App Service pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/)<br>- [How reservation discounts apply to Isolated v2 instances](../../cost-management-billing/reservations/reservation-discount-app-service.md#how-reservation-discounts-apply-to-isolated-v2-instances)<br>- [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator)|
|**5**|**Learn more**|Join the [free live webinar](https://developer.microsoft.com/en-us/reactor/events/20417) with FastTrack Architects.<br><br>Need more help? [Submit a request](https://cxp.azure.com/nominationportal/nominationform/fasttrack) to contact FastTrack.<br><br>[Frequently asked questions](migrate.md#frequently-asked-questions)<br><br>[Community support](https://aka.ms/asev1v2retirement)|

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

## Next steps

> [!div class="nextstepaction"]
> [Learn about App Service Environment v3](overview.md)
