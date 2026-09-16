---
title: Review Azure Networking With Azure Migrate Assessments
description: Learn how to review Azure networking with Azure Migrate assessments.
ms.author: jsuri
ms.service: azure-migrate
ms.topic: how-to
ms.date: 08/31/2026
author: jyothisuri
ms.reviewer: v-uhabiba
ms.custom: engagement-fy25
# Customer intent: As a cloud migration architect, I want to create a network assessment in Azure Migrate, so that I can map on-premises VMware and NSX-T resources to Azure networking services.
---        
 
# Review Azure networking in Azure assessment (Preview)
 
This article describes how to review the results of an Azure network assessment in Azure Migrate, including recommended Azure network resources, migration readiness, network costs, and emissions estimates.

> [!NOTE]
> This feature currently supports lift-and-shift migration of VMware environments, with or without NSX, to Azure through Azure Migrate.

## Review assessment results
 
After the assessment is generated, review the results to understand the recommended Azure network resources, migration readiness, and estimated costs.
 
To review a network assessment, follow these steps:
 
1. In your Azure Migrate project, select **Assessments** under **Decide and plan**.
 
    :::image type="content" source="./media/network-assessment/create-network-assessment.png" alt-text="Screenshot shows main panel to Create assessment button in the Assessments section." lightbox="./media/network-assessment/create-network-assessment.png":::
 
1. Use the **Workloads/Applications** filter to find the assessment.
1. Select the assessment to review its details.
 
### Review network assessment summary
 
Review the summary of the assessed network resources and available migration paths. The assessment displays network cost and emissions information for the **Lift and shift** strategy.
 
For migration strategies other than Lift and shift, Azure Migrate currently estimates network cost as five percent of the combined compute and storage cost. Detailed network cost estimation isn't currently available.
 
 :::image type="content" source="./media/review-network-assessment/network-cost.png" alt-text="Screenshot shows network cost details of the assessment." lightbox="./media/review-network-assessment/network-cost.png":::
 
### View recommended network resources
 
The assessment overview page provides a summary of the recommended Azure network resources, estimated monthly network costs, and sustainability metrics for the assessed workloads.
 
 - Network cost: Estimated monthly cost of Azure network resources for the **Lift and shift** strategy.
 - Emissions information: Sustainability metrics for the recommended Azure network targets.
 
### Review lift-and-shift network recommendations
 
In the **Lift and shift** tab, review the target count and application cost. The overall target count includes network targets, and the application cost includes network cost.
 
In your Azure Migrate project, select **Assessments** under **Decide and plan**.
 
For assessments that include multiple applications, the total assessment cost counts shared component costs only once. Individual application costs can still include their share of the shared component costs.
 
 :::image type="content" source="./media/review-network-assessment/lift-and-shift.png" alt-text="Screenshot shows lift-and-shift recommendations in the assessment creation flow." lightbox="./media/review-network-assessment/lift-and-shift.png":::
 
### Review application summary
 
On the application summary page, review the following network-related information:
 
In your Azure Migrate project, select **Assessments** under **Decide and plan**.
 
 :::image type="content" source="./media/review-network-assessment/application-summary.png" alt-text="Screenshot shows application summary of the assessment." lightbox="./media/review-network-assessment/application-summary.png":::
 
- **Network**: Displays the Azure network targets recommended for the application.
- **Cost** donut: Shows the network cost as part of the overall application cost breakdown.
- **Emissions information**: Sustainability metrics added at the application level.
 
**Network resources**:
 
Open the **Network** tab or **Network resources** page to review the complete list of recommended Azure network targets. The page displays the following parent network resources:
 
| Azure network target | What to review |
| --- | --- |
| Virtual network and subnets | Summary page with resource count and price information. The design uses one VNet per Tier-1 gateway and one subnet per network segment, or one unified VNet with subnets grouped by workload category, depending on the network design setting. |
| Azure Virtual Network Manager (AVNM) | Gateway firewall rules translated to AVNM security configurations. Rules are attached to the source rule and sorted by priority. |
| Network Security Group (NSG) | Distributed firewall rules translated to NSG security rules. Rules maintain priority ordering from the source NSX-T configuration. |
| Azure Firewall | Includes **Summary** and **Policy** tabs. The **Policy** tab shows application and L7 rules. |
| Load balancer | Includes **Summary** and **Rules** tabs. The **Rules** tab shows routing rules mapped from the on-premises L4 load balancer configuration. |
| Network Watcher | Summary page with resource and price information for network monitoring capabilities. |
 
## Migration issues
 
When you review the network assessment, you might see the following issues:
 
| Issue | Resolution |
| --- | --- |
| Firewall rules dropped | The tool can't translate NSX-T rules that use missing NS group information or unsupported L2 protocols. Review the dropped rules table and plan manual configuration in Azure Firewall after migration. |
| Assessment takes longer than expected to generate | Firewall rule conversion adds processing time. Larger environments with many firewall rules take longer. This behavior is expected. |
| No network targets shown | Verify that NSX-T discovery data is available and that the assessment scope includes workloads with associated network resources. Assessments created before network integration aren't in scope. |
| Network cost not visible in other strategies | Network recommendations currently scope to **Lift and shift** to Azure VM only. |
 
## Next steps
 
- [Create a network assessment](network-assessment.md).
- Review an [Azure Files assessment](review-file-share-assessment.md).
- Learn about [Azure Virtual Network Manager](/azure/virtual-network-manager/overview).
- Learn about [Azure Firewall](/azure/firewall/overview).