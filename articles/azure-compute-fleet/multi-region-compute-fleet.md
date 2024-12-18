---
title: Multi-Region Compute Fleet (Preview)
description: Learn about Azure Compute Fleet and how to accelerate your access to Azure's capacity through multi-region deployment.
author: rrajeesh
ms.author: rajeeshr
ms.topic: concept-article
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/13/2024
ms.reviewer: jushiman
---

# Multi-Region Compute Fleet (Preview)

> [!IMPORTANT]
> Multi-Region Compute Fleet is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Multi-Region Compute Fleet is a cloud deployment capability that allows you to dynamically distribute workloads across several regions, ensuring scaling, enhanced fault tolerance, and optimized performance. 

:::image type="content" source="./media/multi-region-compute-fleet/multi-region-fleet-diagram.png" lightbox="./media/multi-region-compute-fleet/multi-region-fleet-diagram.png" alt-text="Screenshot shows Multi Region Compute Fleet flow diagram.":::

This feature eliminates the constraints of regional dependencies, letting your applications thrive wherever the demand takes them.  You can use this capability through a number of ways: running a stateless web service, large batch jobs, a big data cluster, or a continuous integration pipeline. Workloads such as financial risk analysis, log processing, or image rendering can benefit from the ability to run hundreds of thousands of concurrent cores or instances.

## Prerequisites
 
To use Multi-Region Compute Fleet, you must [sign-up for Azure Compute Fleet preview features](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbRyYHv8J_khRKqQeYhVEgwSVUMFU1V0M0WU9ZNlA3UFA1SzdIUVY0TEVYSS4u&origin=lprLink&route=shorturl). After you complete the sign-up form and are approved, you will be contacted with next steps and onboarding details. 

## Benefits

- **Global flexibility:** Effortlessly distribute capacity across regions to improve reliability and reach.
- **Capacity resiliency:** Experience automatic failover across regions to protect against unexpected regional outages.
- **Dynamic availability:** Automatically deploys compute capacity from regions that best meet your demand from a customized SKU list, tailored to your workload requirements. 
- **Simplified deployment:** Allows you to focus on building great products, without worrying about region-specific infrastructure.
- **Cost-effective scaling:** Tap into cost-efficient resources, like Spot instances, and take advantage of regional pricing.
  
## Region availability

Multi-Region Compute Fleet is available in all Azure Public Regions, except those located in China. 

## Next steps

> [!div class="nextstepaction"]
> [Find answers to frequently asked questions.](faq.yml)
