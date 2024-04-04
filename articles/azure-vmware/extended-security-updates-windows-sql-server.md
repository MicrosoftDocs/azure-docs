---
title: Extended Security Updates (ESU) for SQL Server and Windows Server
description: Customers get free Extended Security Updates (ESUs) for older Windows Server and SQL Server versions. This article is to raise awareness of ESU support in Azure and AVS and tells them how they can configure it for this software running in Azure VMware Solution virtual machines.
author: MikeWeiner-Microsoft
ms.author: michwe
ms.service: azure-vmware
ms.topic: how-to  
ms.date: 03/18/2024
---

# ESUs for SQL Server and Windows Server in Azure VMware Solution VMs

Extended Security Updates (ESUs) provide a way for customers to continue to run software that has reached its end-of-support lifecycle. ESUs are the mechanism, which allows these older versions of software to continue to be run in a supported manner and still receive security updates and critical patches.

Only in Azure, which includes Azure VMware Solution, are ESUs free of charge for additional years past their end-of-support. For more information on timelines, see [Extended Security updates for SQL Server and Windows Server]. 

The way to configure SQL Server and Windows Server virtual machines for no-cost ESUs in Azure VMware Solution is provided in the following sections. The process is distinct to the Azure VMware Solution private cloud architecture.  

For more information about ESUs for SQL Server and Window Server, see the following articles:

- [What are Extended Security Updates - SQL Server](https://learn.microsoft.com/sql/sql-server/end-of-support/sql-server-extended-security-updates)
- [Extend Security Updates for Windows Server overview](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview)

## Configure SQL Server and Windows Server for ESUs in Azure VMware Solution
In this section, we show how to configure the virtual machines running SQL Server and Windows Server for ESUs at no-cost in Azure VMware Solution.

### SQL Server
For SQL Server environments running in a VM in Azure VMware Solution, you can use Extended Security Updates enabled by Azure Arc to configure ESUs and automate patching. 

First you will need to Arc-enable VMware vShpere for Azure VMware Solution and have the Azure Extension for SQL Server is installed onto the VM. The steps are: 

1.	To Arc-enable the VMware vSphere in Azure VMware Solution use this document [Deploy Arc-enabled VMware vSphere for Azure VMware Solution private cloud](https://learn.microsoft.com/azure/azure-vmware/deploy-arc-for-azure-vmware-solution?tabs=windows).  

2.	You will also need to enable guest management for the individual VMs running SQL Server and make sure the Azure Extension for SQL Server is installed. Steps to validate the extension is installed are provided in the section *View ESU subscription status*

> [!WARNING]
> If you register SQL Server instances in a different manner than documented in this step it will not be integrated into AVS and result in you being billed for ESUs.

Next, once VMware vSphere for Azure VMware Solution is Arc-enabled and Azure Extension for SQL Server is installed the VM you can subscribe to Extended Security Updates by updating the SQL Server Configuration on the Arc-enabled VM. To find the SQL Server Configuration from the Azure portal:

- Go to vCenter Server Inventory and Virtual Machines clicking through one of the Arc-enabled VMs. Here you see the Machine-Azure Arc (AVS) page.
- In the left pane expand operations and you should see the SQL Server Configuration
- You should then follow the steps discussed in the section: [Subscribe to Extended Security Updates enabled by Azure Arc](https://learn.microsoft.com/sql/sql-server/end-of-support/sql-server-extended-security-updates?#subscribe-to-extended-security-updates-enabled-by-azure-arc) which also provides syntax to configure via Azure Powershell or Azure CLI.

#### View ESU subscription status
For machines running SQL Server where **Guest Management** is enabled the Azure Extension for SQL Server should be registered. You can validate the extension is installed through these steps.

-	From the Azure portal 
    - Go to **vCenter Server Inventory** and **Virtual Machines** clicking through one of the Arc-enabled VMs. Here you see the *Machine-Azure Arc (AVS)* page. 
    - Within the **Overview** section of the menu, located in the upper left, there's a **Properties/Extensions** view that lists the WindowsAgent.SqlServer (Microsoft.HybridCompute/machines/extensions) if installed.
    
-	Through Azure Resource Graph (ARG) queries
    - You can use the following query [VM ESU subscription status](https://learn.microsoft.com/sql/sql-server/end-of-support/sql-server-extended-security-updates?#view-esu-subscriptions)  as an example to show you can view eligible SQL Server ESU instances and their ESU subscription status. 
    
### Windows Server 
For Windows Server environments running in VMs in AVS, the process to enable ESUs requires contacting [Microsoft Support] for help in configuration. 

When you contact support, the ticket should be raised under the category of Azure VMware Solution and requires the following information:
-	Customer Name and Tenant ID
-	Number of virtual machines you want to register
-	OS versions 
-	ESU Year(s) coverage (for example, Year 1, Year 2, Year 3, etc.)

> [!WARNING] 
> If you create Extended Security Update licenses for Windows through Azure Arc, this will result in billing charges for the ESUs. 


## Related content
- [How to get Extended Security Updates (ESU) for Windows Server 2008, 2008 R2, 2012, and 2012 R2](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-deploy#extended-security-updates-on-azure)  
- [Extended Security Updates (ESUs) for SQL Server](https://learn.microsoft.com/sql/sql-server/end-of-support/sql-server-extended-security-updates)
- Planning your Windows Server and SQL Server end of support: [Extended Security Updates for SQL Server and Windows Server](https://www.microsoft.com/en-us/windows-server/extended-security-updates)
 

[Microsoft Support]: https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade/assetId/%2Fsubscriptions%2F5a79c43b-b03d-4610-bc59-627d8a6744d1%2FresourceGroups%2FABM_CSS_Lab_Enviroment%2Fproviders%2FMicrosoft.AVS%2FprivateClouds%2FBareMetal_CSS_Lab/callerWorkflowId/a7ecc9f7-8578-4820-abdf-1db09a2bdb47/callerName/Microsoft_Azure_Support%2FAurora.ReactView/subscriptionId/5a79c43b-b03d-4610-bc59-627d8a6744d1/productId/e7b24d57-0431-7d60-a4bf-e28adc11d23e/summary/Issue/topicId/9e078285-e10f-0365-31e3-6b31e5871794/issueType/technical
[Extended Security updates for SQL Server and Windows Server]: https://www.microsoft.com/en-us/windows-server/extended-security-updates

