---
title: Multi-Region Compute Fleet
description: Learn about Azure Compute Fleet and how to accelerate your access to Azure's capacity.
author: rajeeshr
ms.author: rajeeshr
ms.topic: overview
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/7/2024
ms.reviewer: jushiman
---

# What is Multi-region Compute Fleet? (Preview)

> [!IMPORTANT]
> Multi Region Compute Fleet is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Multi region Compute Fleet is a new cloud deployment capability that allows you to dynamically distribute workloads across several regions. Compute Fleet launches a combination of virtual machines (VMs) at the lowest price and highest capacity bringing unmatched flexibility and reliability on accessing compute capacity for your cloud workloads. This new feature eliminates the constraints of regional dependencies, letting your applications thrive wherever the demand takes them. 

Multi-region Compute Fleet enables your workloads to run seamlessly across multiple regions, ensuring scaling, enhanced fault tolerance, and optimized performance. Whether you're driving global-scale applications or balancing unpredictable demand, Compute fleet delivers a new level of freedom and resilience to automatically deploy and manage 1000s of VMs (across a mix of SKUs, Zones, Regions and pricing model) with a single API call. 

There will be a number of ways customer can use this capability,  whether by running a stateless web service, large batch jobs, a big data cluster and or continuous integration pipeline. Workloads such as financial risk analysis, log processing or image rendering can benefit from the ability to run hundred thousand of concurrent cores/instances.

:::image type="content" source="./media/multi-region-compute-fleet.png" lightbox="./media/multi-region-compute-fleet.png" alt-text="Screenshot that shows Multi region compute fleet flow diagram.":::

You can now simply specify your required target capacity by specifying up to 3 regions of choice for Azure to meet your capacity demands mixing both Standard and Spot VMs. Compute Fleet will deploy the request capacity across the regions that best meets your demand from a customized SKU list tailored to your workload requirements.

# Benefits of using Multi region Compute Fleet
Global Flexibility: Effortlessly distribute capacity across regions to improve reliability and reach.

Capacity resiliency: Experience automatic failover across regions to protect against unexpected regional outages.

Dynamic availability: Automatically deploys compute capacity from regions that best meets your demand from a customized SKU list tailored to your workload requirements

Simplified Deployment: Focus on building great products, without worrying about region-specific infrastructure.

Cost-Effective Scaling: Tap into cost-efficient resources like Spot instances and take advantage of regional pricing

# Region Availability
Multi-region Compute Fleet is now available in all Azure Public Regions.

# Learn more and get started
 
Sign up here: [Compute Fleet - Preview features Sign up](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbRyYHv8J_khRKqQeYhVEgwSVUMFU1V0M0WU9ZNlA3UFA1SzdIUVY0TEVYSS4u&origin=lprLink&route=shorturl)

After we receive your completed sign-up form, we will contact you with the next steps and onboarding details.

## Next steps
> [!div class="nextstepaction"]
