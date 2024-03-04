---
title: Extended Security Updates (ESU) for Windows Server and SQL Server
description: Customers get free Extended Security Updates (ESUs) for older Windows Server and SQL Server versions. This article is to raise awareness of this and tells them how they can configure it for this software running in Azure VMware Solution (AVS) virtual machines.
author: MikeWeiner-Microsoft
ms.author: michwe
ms.service: Azure VMware Solution
ms.topic: how-to  
ms.date: 02/28/2024
---

# Extended Security Updates (ESU) for Windows Server and SQL Server in Azure VMware Solution virtual machines

Extended Security Updates (ESUs) provide a way for customers to continue to run software that has reached its end-of-support lifecycle. ESUs are the mechanism, which allows these older versions of software to continue to be run in a supported manner and still receive security updates and critical patches. 

Only in Azure, which includes Azure VMware Solution (AVS), are ESUs free of charge for additional years past their end-of-support. For more information on timelines, see [Extended Security updates for SQL Server and Windows Server]. 

For ESU considerations specific to Windows Server and SQL Server reference:

- [What are Extended Security Updates - SQL Server] 
- [Extend Security Updates for Windows Server Overview]

The way to configure Windows Server and SQL Server virtual machines for no-cost ESUs in Azure VMware Solution is provided in the following sections. The process is distinct to the Azure VMware Solution private cloud architecture.  

## Configure Windows Server and SQL Server for ESUs in Azure VMware Solution
The rest of this document goes through how to configure the virtual machines running Windows Server and SQL Server for ESUs at no-cost in Azure VMware Solution.

### Windows Server 
For Windows Server environments running in VMs in AVS, the process to enable ESUs requires contacting [Microsoft Support] for help in configuration. 

When you contact support, the ticket should be raised under the category of Azure VMware Solution and will require the following information:
-	Customer Name and Tenant ID
-	Number of servers you want to register
-	OS versions 
-	ESU Year(s) coverage (for example, Year 1, Year 2, Year 3, etc.)

> [!WARNING]: 
>If you create Extended Security Update licenses for Windows through Azure Arc, this will result in billing charges for the ESUs. 

### SQL Server
For SQL Server environments running in a VM in AVS you can use Extended Security Updates enabled by Azure Arc to configure ESUs and automate patching. The configuration steps are 
1.	Follow the steps outlined in [Deploy Arc-enabled VMware vSphere for Azure VMware Solution private cloud](deploy-arc-for-azure-vmware-solution.md) to enable the AVS environment.  

2.	You should then follow the steps discussed here: [Subscribe to Extended Security Updates enabled by Azure Arc](https://learn.microsoft.com/en-us/sql/sql-server/end-of-support/sql-server-extended-security-updates?view=sql-server-ver16&tabs=portal#subscribe-to-extended-security-updates-enabled-by-azure-arc) to subscribe to Extended Security Updates through the SQL Server Configuration experience. 

> [!WARNING]: 
> If you register SQL Server instances in a different manner than documented in this step it will not be integrated into AVS and result in you being billed for ESUs.

#### View ESU subscription status
For machines running SQL Server where **Guest Management** is enabled the Azure Extension for SQL Server should be registered. You can validate the extension is installed through these steps.

-	From the Azure portal 
    - Go to **vCenter Server Inventory** and **Virtual Machines** clicking through one of the Arc-enabled VMs. Here you see the *Machine-Azure Arc (AVS)* page. Within the **Overview** section of the menu, located in the upper left, there's a **Properties/Extensions** view that lists the WindowsAgent.SqlServer (Microsoft.HybridCompute/machines/extensions) if installed.
    
-	Through Azure Resource Graph (ARG) queries
    - You can use the following query [VM ESU subscription status](https://learn.microsoft.com/en-us/sql/sql-server/end-of-support/sql-server-extended-security-updates?view=sql-server-ver16&tabs=portal#view-esu-subscriptions)  as an example to show you can view eligible ESU instances and their ESU subscription status. 


## Related content
- [How to get Extended Security Updates (ESU) for Windows Server 2008, 2008 R2, 2012, and 2012 R2](https://learn.microsoft.com/en-us/windows-server/get-started/extended-security-updates-deploy#extended-security-updates-on-azure)  
- [Extended Security Updates (ESUs) for SQL Server](https://learn.microsoft.com/en-us/sql/sql-server/end-of-support/sql-server-extended-security-updates?view=sql-server-ver16&tabs=portal)
- Planning your Windows Server and SQL Server end of support: [Extended Security Updates for SQL Server and Windows Server][Extended Security updates for SQL Server and Windows Server]
 

[Microsoft Support]: https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade/assetId/%2Fsubscriptions%2F5a79c43b-b03d-4610-bc59-627d8a6744d1%2FresourceGroups%2FABM_CSS_Lab_Enviroment%2Fproviders%2FMicrosoft.AVS%2FprivateClouds%2FBareMetal_CSS_Lab/callerWorkflowId/a7ecc9f7-8578-4820-abdf-1db09a2bdb47/callerName/Microsoft_Azure_Support%2FAurora.ReactView/subscriptionId/5a79c43b-b03d-4610-bc59-627d8a6744d1/productId/e7b24d57-0431-7d60-a4bf-e28adc11d23e/summary/Issue/topicId/9e078285-e10f-0365-31e3-6b31e5871794/issueType/technical
[Extended Security updates for SQL Server and Windows Server]: https://www.microsoft.com/en-us/windows-server/extended-security-updates
[What are Extended Security Updates - SQL Server]: /sql/sql-server/end-of-support/sql-server-extended-security-updates?view=sql-server-ver16&tabs=portal
[Extend Security Updates for Windows Server Overview]: /windows-server/get-started/extended-security-updates-overview

