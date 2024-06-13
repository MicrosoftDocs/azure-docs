---
title: Extended Security Updates for SQL Server and Windows Server
description: Learn how to configure VMs that run older versions of SQL Server and Windows Server for free Extended Security Updates (ESUs) in Azure VMware Solution.
author: MikeWeiner-Microsoft
ms.author: michwe
ms.service: azure-vmware
ms.topic: how-to  
ms.date: 04/04/2024
---

# ESUs for SQL Server and Windows Server in Azure VMware Solution VMs

This article describes how to enable Extended Security Updates (ESUs) and continue to run software that has reached its end-of-support lifecycle in Azure VMware Solution. ESUs allow older versions of software to run in a supported manner by continuing to receive security updates and critical patches. In Azure, which includes Azure VMware Solution, ESUs are free of charge for extra years after their end of support. For more information on timelines, see [Extended Security Updates for SQL Server and Windows Server].

The following sections describe how to configure SQL Server and Windows Server virtual machines (VMs) for no-cost ESUs in Azure VMware Solution. The process is distinct to the Azure VMware Solution private cloud architecture.

## Configure SQL Server and Windows Server for ESUs in Azure VMware Solution

In this section, you learn how to configure the VMs that run SQL Server and Windows Server for ESUs at no cost in Azure VMware Solution.

### SQL Server

For SQL Server environments that run in a VM in Azure VMware Solution, you can use ESUs enabled by Azure Arc to configure ESUs and automate patching.

First, you need to Azure Arc-enable VMware vSphere for Azure VMware Solution. The Azure Extension for SQL Server must be installed on the VM.

1. Azure Arc-enable the VMware vSphere in Azure VMware Solution. Follow the steps in [Deploy Azure Arc-enabled VMware vSphere for Azure VMware Solution private cloud](deploy-arc-for-azure-vmware-solution.md?tabs=windows).

1. Enable guest management for the individual VMs that run SQL Server. Make sure the Azure Extension for SQL Server is installed. To confirm that the extension is installed, see the section [View ESU subscription status](#view-esu-subscription-status).

> [!WARNING]
> If you register SQL Server instances in a different manner from the preceding steps, the VM won't be registered as part of Azure VMware Solution. As a result, you will be billed for ESUs.

After you Azure Arc-enable the VMware vSphere in Azure VMware Solution and enable guest management, you can subscribe to ESUs by updating the SQL Server configuration on the Azure Arc-enabled VM.

To find the SQL Server configuration from the Azure portal:

1. In the Azure VMware Solution portal, go to **vCenter Server Inventory** and **Virtual Machines** by clicking through one of the Azure Arc-enabled VMs. The **Machine-Azure Arc (AVS)** page appears.
1. On the left pane, under **Operations**, select **SQL Server Configuration**.
1. Follow the steps in the section [Subscribe to Extended Security Updates enabled by Azure Arc](/sql/sql-server/end-of-support/sql-server-extended-security-updates?#subscribe-to-extended-security-updates-enabled-by-azure-arc). This section also provides syntax to configure by using Azure PowerShell or the Azure CLI.

#### View ESU subscription status

For machines that run SQL Server where guest management is enabled, the Azure Extension for SQL Server must be registered. You can confirm that the extension is installed by using the Azure portal or Azure Resource Graph queries.

- Use the Azure portal:

    1. In the Azure VMware Solution portal, go to **vCenter Server Inventory** and **Virtual Machines** by clicking through one of the Azure Arc-enabled VMs. The **Machine-Azure Arc (AVS)** page appears.
    1. As part of the **Overview** section on the left pane, the **Properties/Extensions** view lists the `WindowsAgent.SqlServer` (*Microsoft.HybridCompute/machines/extensions*), if installed. Alternatively, you can expand **Settings** on the left pane and select **Extensions**. The `WindowsAgent.SqlServer` name and type appear, if configured.

- Use Azure Resource Graph queries:

   - You can use the query [VM ESU subscription status](/sql/sql-server/end-of-support/sql-server-extended-security-updates?#view-esu-subscriptions) as an example to show that you can view eligible SQL Server ESU instances and their ESU subscription status.

### Windows Server

To enable ESUs for Windows Server environments that run in VMs in Azure VMware Solution, contact [Microsoft Support] for configuration assistance.

When you contact Support, raise the ticket under the Azure VMware Solution category. Your ticket requires the following information:

- Customer name and tenant ID
- Number of VMs you want to register
- OS versions
- ESU years of coverage (for example, Year 1, Year 2, or Year 3)

> [!WARNING]
> If you create ESU licenses for Windows through Azure Arc, you're charged for the ESUs.

## Related content

- [What are Extended Security Updates - SQL Server](/sql/sql-server/end-of-support/sql-server-extended-security-updates)
- [Extend Security Updates for Windows Server overview](/windows-server/get-started/extended-security-updates-overview)
- [Plan your Windows Server and SQL Server end of support](https://www.microsoft.com/windows-server/extended-security-updates)

[Microsoft Support]: https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade/assetId/%2Fsubscriptions%2F5a79c43b-b03d-4610-bc59-627d8a6744d1%2FresourceGroups%2FABM_CSS_Lab_Enviroment%2Fproviders%2FMicrosoft.AVS%2FprivateClouds%2FBareMetal_CSS_Lab/callerWorkflowId/a7ecc9f7-8578-4820-abdf-1db09a2bdb47/callerName/Microsoft_Azure_Support%2FAurora.ReactView/subscriptionId/5a79c43b-b03d-4610-bc59-627d8a6744d1/productId/e7b24d57-0431-7d60-a4bf-e28adc11d23e/summary/Issue/topicId/9e078285-e10f-0365-31e3-6b31e5871794/issueType/technical
[Extended Security updates for SQL Server and Windows Server]: https://www.microsoft.com/windows-server/extended-security-updates
