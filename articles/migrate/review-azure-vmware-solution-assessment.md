---
title: Tutorial to review the assessments created for migration to Azure VMware Solution
description: Learn how to review VMware assessments for migration to AVS in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 11/07/2024
ms.custom: engagement-fy24
---

# Review an Azure VMware Solution (AVS) assessment

An Azure VMware Solution (AVS) assessment describes:

- **Azure VMware Solution (AVS) readiness**: Whether the on-premises VMs are suitable for migration to Azure VMware Solution (AVS).
- **Number of Azure VMware Solution nodes**: Estimated number of Azure VMware Solution nodes required to run the servers.
- **Utilization across AVS nodes**: Projected CPU, memory, and storage utilization across all nodes.
    - Utilization includes up front factoring in the following cluster management overheads such as the vCenter Server, NSX Manager (large), NSX Edge, if HCX is deployed also the HCX Manager and IX appliance consuming ~ 44vCPU (11 CPU), 75 GB of RAM and 722 GB of storage before compression and deduplication.
    - Limiting factor determines the number of hosts/nodes required to accommodate the resources.
- **Monthly cost estimation**: The estimated monthly costs for all Azure VMware Solution (AVS) nodes running the on-premises VMs.

You can select  **Sizing assumptions** to understand the assumptions that went in node sizing and resource utilization calculations. You can also edit the assessment properties, or recalculate the assessment.

## View an assessment

1. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the number next to **Azure VMware Solution**.

1. In **Assessments**, select an assessment to open it. As an example (estimations and costs, for example, only): 

    :::image type="content" source="./media/tutorial-assess-vmware-azure-vmware-solution/avs-assessment-summary-inline.png" alt-text="Screenshot of AVS Assessment summary." lightbox="./media/tutorial-assess-vmware-azure-vmware-solution/avs-assessment-summary-expanded.png":::

1. Review the assessment summary. You can select  **Sizing assumptions** to understand the assumptions that went in node sizing and resource utilization calculations. You can also edit the assessment properties, or recalculate the assessment.

### Review Azure VMware Solution (AVS) readiness

1. In **Azure readiness**, verify whether servers are ready for migration to AVS.

2. Review the server status:
    - **Ready for AVS**: The server can be migrated as-is to Azure (AVS) without any changes. It will start in AVS with full AVS support.
    - **Ready with conditions**: There might be some compatibility issues, for example, internet protocol or deprecated OS in VMware, and need to be remediated before migrating to Azure VMware Solution. To fix any readiness problems, follow the remediation guidance the assessment suggests.
    - **Not ready for AVS**: The VM will not start in AVS. For example, if the on-premises VMware VM has an external device attached such as a cd-rom the VMware vMotion operation will fail (if using VMware vMotion).
    - **Readiness unknown**: Azure Migrate couldn't determine the readiness of the server because of insufficient metadata collected from the on-premises environment.

3. Review the Suggested tool:
    - **VMware HCX Advanced or Enterprise**: For VMware vSphere VMs, VMware Hybrid Cloud Extension (HCX) solution is the suggested migration tool to migrate your on-premises workload to your Azure VMware Solution (AVS) private cloud. [Learn More](../azure-vmware/configure-vmware-hcx.md).
    - **Unknown**: For servers imported via a CSV or RVTools file, the default migration tool is unknown. Though for VMware vSphere VMs, it's suggested to use the VMware Hybrid Cloud Extension (HCX) solution. 

4. Select an **AVS readiness** status. You can view VM readiness details, and drill down to see VM details, including compute, storage, and network settings.

### Review cost details

This view shows the estimated cost of running servers in Azure VMware Solution.

1. Review the monthly total costs. Costs are aggregated for all servers in the assessed group. 

    - Cost estimates are based on the number of AVS nodes required considering the resource requirements of all the  servers in total.
    - As the pricing for Azure VMware Solution is per node, the total cost doesn't have compute cost and storage cost distribution.
    - The cost estimation is for running the on-premises servers in AVS. AVS assessment doesn't consider PaaS or SaaS costs.
    
2. You can review monthly storage cost estimates. This view shows aggregated storage costs for the assessed group, split over different types of storage disks.

3. You can drill down to see details for specific servers.


### Review confidence rating

When you run performance-based assessments, a confidence rating is assigned to the assessment.

- A rating from 1-star (lowest) to 5-star (highest) is awarded.
- The confidence rating helps you estimate the reliability of the size recommendations provided by the assessment.
- The confidence rating is based on the availability of data points needed to compute the assessment.
- For performance-based sizing, AVS assessments need the utilization data for CPU and server memory. The following performance data is collected but not used in sizing recommendations for AVS assessments:
  - The disk IOPS and throughput data for every disk attached to the server.
  - The network I/O to handle performance-based sizing for each network adapter attached to a server.

Confidence ratings for an assessment are as follows.

**Data point availability** | **Confidence rating**
--- | ---
0%-20% | 1 Star
21%-40% | 2 Star
41%-60% | 3 Star
61%-80% | 4 Star
81%-100% | 5 Star

[Learn more](concepts-azure-vmware-solution-assessment-calculation.md) about performance data.

## Next steps

- Learn how to use [dependency mapping](how-to-create-group-machine-dependencies.md) to create high confidence groups.
- [Learn more](concepts-azure-vmware-solution-assessment-calculation.md) about how Azure VMware Solution assessments are calculated.