---
title: Extended Security Updates (ESUs) for SQL Server and Windows Server
description: Customers get free Extended Security Updates (ESUs) for older SQL Server and Windows Server versions. This article is to raise awareness of ESU support in Azure and Azure VMware Solution and shows customer how they can configure it for this software running in virtual machines on the platform.
author: MikeWeiner-Microsoft
ms.author: michwe
ms.service: azure-vmware
ms.topic: how-to  
ms.date: 04/04/2024
---

# ESUs for SQL Server and Windows Server in Azure VMware Solution VMs

This article describes how to enable Extended Security Updates (ESUs) and continue to run software that has reached its end-of-support lifecycle in Azure VMware Solution. ESUs allow older versions of software to run in a supported manner by continuing to receive security updates and critical patches. In Azure, which includes Azure VMware Solution, ESUs are free of charge for additional years after their end-of-support. For more information on timelines, see [Extended Security updates for SQL Server and Windows Server]. 

The following sections describe how to configure SQL Server and Windows Server virtual machines for no-cost ESUs in Azure VMware Solution. The process is distinct to the Azure VMware Solution private cloud architecture.  

## Configure SQL Server and Windows Server for ESUs in Azure VMware Solution
In this section, we show how to configure the virtual machines running SQL Server and Windows Server for ESUs at no-cost in Azure VMware Solution.

### SQL Server
For SQL Server environments running in a VM in Azure VMware Solution, you can use Extended Security Updates enabled by Azure Arc to configure ESUs and automate patching. 

First you'll need to Arc-enable VMware vShpere for Azure VMware Solution and have the Azure Extension for SQL Server installed onto the VM. The steps are: 

1.	To Arc-enable the VMware vSphere in Azure VMware Solution, see [Deploy Arc-enabled VMware vSphere for Azure VMware Solution private cloud](deploy-arc-for-azure-vmware-solution.md?tabs=windows).  

2.	Enable guest management for the individual VMs running SQL Server and make sure the Azure Extension for SQL Server is installed. To validate the extension is installed see the section *View ESU subscription status*

> [!WARNING]
> If you register SQL Server instances in a different manner than documented in the steps provided above the VM will not be registered as part of Azure VMware Solution and will result in you being billed for ESUs. 

After you Arc-enable the VMware vSphere in Azure VMware Solution and enable guest management, you can subscribe to Extended Security Updates by updating the SQL Server Configuration on the Azure Arc-enabled VM. 

To find the SQL Server Configuration from the Azure portal:

1. In the Azure VMware Solution portal, go to **vCenter Server Inventory** and **Virtual Machines** clicking through one of the Arc-enabled VMs. Here you see the Machine-Azure Arc (AVS) page.
2. In the left pane, expand Operations and you should see the SQL Server Configuration
3. You should then follow the steps discussed in the section: [Subscribe to Extended Security Updates enabled by Azure Arc](/sql/sql-server/end-of-support/sql-server-extended-security-updates?#subscribe-to-extended-security-updates-enabled-by-azure-arc), which also provides syntax to configure via Azure PowerShell or Azure CLI.

#### View ESU subscription status
For machines running SQL Server where guest management is enabled the Azure Extension for SQL Server should be registered. You can validate the extension is installed through the Azure portal or through Azure Resource Graph queries. 

-	From the Azure portal 
    1. In the Azure VMware Solution portal, go to **vCenter Server Inventory** and **Virtual Machines** clicking through one of the Arc-enabled VMs. Here you see the *Machine-Azure Arc (AVS)* page. 
    2. As part of the **Overview** section of the left pane, there's a **Properties/Extensions** view that will list the WindowsAgent.SqlServer (Microsoft.HybridCompute/machines/extensions) if installed. Alternatively, you can expand **Settings** from the left pane and choose **Extensions** which should display the WindowsAgent.SqlServer name and type if configured.
    
-	Through Azure Resource Graph queries
    - You can use the following query [VM ESU subscription status](/sql/sql-server/end-of-support/sql-server-extended-security-updates?#view-esu-subscriptions)  as an example to show you can view eligible SQL Server ESU instances and their ESU subscription status. 
    
### Windows Server 
To enable ESUs for Windows Server environments running in VMs in Azure VMware Solution contact [Microsoft Support] for configuration assistance. 

When you contact support, the ticket should be raised under the category of Azure VMware Solution and requires the following information:
-	Customer Name and Tenant ID
-	Number of virtual machines you want to register
-	OS versions 
-	ESU Year(s) coverage (for example, Year 1, Year 2, Year 3, etc.)

> [!WARNING] 
> If you create Extended Security Update licenses for Windows through Azure Arc, this will result in billing charges for the ESUs. 


## Related content
- [What are Extended Security Updates - SQL Server](/sql/sql-server/end-of-support/sql-server-extended-security-updates)
- [Extend Security Updates for Windows Server overview](/windows-server/get-started/extended-security-updates-overview)
- [Plan your Windows Server and SQL Server end of support](https://www.microsoft.com/windows-server/extended-security-updates)
 

[Microsoft Support]: https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade/assetId/%2Fsubscriptions%2F5a79c43b-b03d-4610-bc59-627d8a6744d1%2FresourceGroups%2FABM_CSS_Lab_Enviroment%2Fproviders%2FMicrosoft.AVS%2FprivateClouds%2FBareMetal_CSS_Lab/callerWorkflowId/a7ecc9f7-8578-4820-abdf-1db09a2bdb47/callerName/Microsoft_Azure_Support%2FAurora.ReactView/subscriptionId/5a79c43b-b03d-4610-bc59-627d8a6744d1/productId/e7b24d57-0431-7d60-a4bf-e28adc11d23e/summary/Issue/topicId/9e078285-e10f-0365-31e3-6b31e5871794/issueType/technical
[Extended Security updates for SQL Server and Windows Server]: https://www.microsoft.com/windows-server/extended-security-updates
