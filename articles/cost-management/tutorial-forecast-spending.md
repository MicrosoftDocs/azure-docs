---
title: Forecast spending and optimize costs in Azure Cost Management | Microsoft Docs
description: Forecast spending using historical data and optimize usage and costs.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 09/24/2017
ms.topic: article
ms.service: cost-management
ms.custom: mvc
manager: carmonm
---

# Forecast future spending and optimize usage and costs

Azure Cost Management by Cloudyn helps you forecast future spending using historical and spending data. You use Cloudyn reports to view all cost projection and cost optimization data. The examples in this tutorial walk you through reviewing cost projections and optimizing Amazon Web Services (AWS) usage and costs using the reports. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Forecast future spending
> * Optimize AWS reserved instance costs

## Forecast future spending

Cloudyn includes cost projection reports to help you forecast spending based on your usage over time. Their primary purpose is to help you ensure that your cost trends do not exceed your organization's expectations. The reports you use are Current Month Projected Cost and Annual Projected Cost. Both show projected future spending if your usage remains relatively consistent with your last 30 days of usage.

The Current Month Projected Cost report shows the costs of your services. It uses costs from the beginning of the month and the previous month to show the projected cost. On the reports menu at the top of the portal, click **Cost** > **Projection and Budget** > **Current Month Projected Cost**. The following image shows an example.

![current month projected cost](./media/tutorial-forecast-spending/project-month01.png)

In the example, you can see which services spent the most. Azure costs were lower than AWS costs. If you want to see cost projection details for Azure VMs, in the **Filter** list, select **Azure/VM**.

![Azure VM current month projected cost](./media/tutorial-forecast-spending/project-month02.png)

Follow the same basic preceding steps to look at monthly cost projections for other services you're interested in.

The Annual Projected Cost report shows the extrapolated cost of your services over the next 12 months.

On the reports menu at the top of the portal, click **Cost** > **Projection and Budget** > **Annual Projected Cost**. The following image shows an example.

![annual projected cost report](./media/tutorial-forecast-spending/project-annual01.png)

In the example, you can see which services spent the most. Like the monthly example, Azure costs were lower than AWS costs. If you want to see cost projection details for Azure VMs, in the **Filter** list, select **Azure/VM**.

![annual projected cost of VMs](./media/tutorial-forecast-spending/project-annual02.png)

In the image above, the annual projected cost of Azure VMs is $28,374.

## Optimize AWS reserved instance costs

AWS Reserved instances are an open commitment useful when you have sustained usage for VMs. Reserved instances save you money because they are less expensive than on-demand instances. The commitment is to use resources, typically VMs, for a defined period—usually a year. When you make the commitment to buy, you prepay for the resources with a reservation. However, you might not always fully use what you've committed to in the reservation.

For example, you might assess your environment and determine that you had 20 standard D2 instances running constantly over the last year. You could purchase a reservation for them and potentially save money. In a different example, you might have committed to using ten MA4 instances for the year, but you might have only used five so far. In this example, you have an inefficiency. Using Cloudyn optimization reports, there are two ways to optimize costs for reserved instances:

- Review buying recommendations for what you could buy based on your historical usage
- Move unused reservations

You use the _EC2 RI Buying Recommendations_ and _EC2 Currently Unused Reservations_ reports to improve your reserved instance usage and costs.

### Buy recommended reserved instances

Cloudyn compares on-demand instance usage and compares it to potential reserved instances. Where it finds possible savings, its recommendations are shown in the EC2 Buying Recommendations report.

On the reports menu at the top of the portal, click **Optimizer** > **Pricing Optimization** > **EC2 RI Buying Recommendations**.

The following image shows buying recommendations from the report.

![buying recommendations](./media/tutorial-forecast-spending/aws01.png)

In this example, the Cloudyn\_A account has 32 reserve instance buying recommendations. If you follow all the buying recommendations, you could potential save $137,770 annually. Keep in mind that the purchase recommendations provided by Cloudyn assume that usage for your running workloads would remain consistent.

Click the plus symbol ( **+** ) under **Justifications** to view details explaining why each purchase is recommended. Here's an example for the first recommendation in the list.

![purchase justifications](./media/tutorial-forecast-spending/aws02.png)

The preceding example shows that running the workload on-demand would cost $90,456 annually. However, if you purchase the reservation in advance, the same workload would cost $56,592 and save you $33,864 annually.

Click the plus symbol next to **EC2 RI Purchase Impact** to view your break-even point over a year to see approximately when your purchase investment is realized. About eight months after making the purchase the on-demand accumulated cost starts to exceed the RI accumulated cost in the following example image. You start saving money at that point.

![purchase impact](./media/tutorial-forecast-spending/aws03.png)

You can review **Instances over Time** to verify the accuracy of the suggested buying recommendation. In this example, you can see that six instances were used on average for the workload over the last 30-day period.

![instances over time](./media/tutorial-forecast-spending/aws04.png)

### Move unused reservations

Unused reservations are common in many cloud resource consumer's computing environments. Ensuring that unused reservations are fully used can save you money when you modify the reservations to meet your current needs. For example, you might have a subscription containing standard D3 instances that run on Linux. If you're not going to use the reservation fully, you might change the instance type. Or, you might move the unused resources to a different reservation or to a different account.

AWS sells reserved instances for specific availability zones and regions. If you've purchased reserved instances for a specific availability zone, then you cannot move the reservations between zones. However, you can easily move regional reserved instances between zones using the **EC2 Currently Unused Reservations** report.

On the reports menu at the top of the portal, click **Optimizer** > **Inefficiencies** > **EC2 Currently Unused Reservations**.

The following image shows the report with unused reserved instances.

![unused reservations](./media/tutorial-forecast-spending/unused-ri01.png)

Click the plus symbol under **Details** to view reservation details for a specific reservation.

![unused reservations details](./media/tutorial-forecast-spending/unused-ri01.png)

In the preceding example, there are 77 unused reservations total in various availability zones. The first reservation has 51 unused instances. Looking lower in the list, there are potential reservation instance modifications that you can make using the **m3.2xlarge** instance type in the **us-east-1c** availability zone.

Click **Modify** for the first reservation in the list to open the **Modify RI** page that shows data about the reservation.

![Modify RI](./media/tutorial-forecast-spending/unused-ri03.png)

Reserve instances that you can modify are listed. In example image below, there are 51 unused reservations that you can modify but there is a need for 54 between the two reservations. If you modify your unused reservations to use them all, four instances would continue to run on demand. For this example, split your unused reservations where the first reservation uses 30 instances and the second reservation uses 21 instances.

Click the plus symbol for the first reservation entry and set the **Reservation quantity** to **30**. For the second entry, set the reservation quantity to **21** and then click **Apply**.

![change reservation quantity](./media/tutorial-forecast-spending/unused-ri04.png)

All your unused instances for the reservation are fully utilized and 51 instances are no longer running on-demand. In this example, you save your organization money by significantly reducing on-demand use and using reservations that are already paid for.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Forecast future spending
> * Optimize AWS reserved instance costs


Advance to the Cloudyn documentation to learn more about getting started with Cloudyn and using its features.

> [!div class="nextstepaction"]
> [Cloudyn documentation](https://support.cloudyn.com/hc/)
