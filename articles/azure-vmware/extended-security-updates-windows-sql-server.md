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

This article describes how to enable Extended Security Updates (ESUs) and continue to run software that has reached its end-of-support lifecycle in Azure VMware Solution. ESUs allow older versions of software to run in a supported manner by continuing to receive security updates and critical patches. In Azure, which includes Azure VMware Solution, ESUs are free of charge for extra years after their end of support. For more information on timelines, see [Extended Security Updates for SQL Server and Windows Server](https://www.microsoft.com/windows-server/extended-security-updates).

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
1. Follow the steps in the section [Configure SQL Server enabled by Azure Arc - Modify SQL Server configuration](/sql/sql-server/azure-arc/manage-configuration?tabs=azure#modify-sql-server-configuration). This section also provides syntax to configure by using Azure PowerShell or the Azure CLI.

#### View ESU subscription status

For machines that run SQL Server where guest management is enabled, the Azure Extension for SQL Server must be registered. You can confirm that the extension is installed by using the Azure portal or Azure Resource Graph queries.

- Use the Azure portal:

    1. In the Azure VMware Solution portal, go to **vCenter Server Inventory** and **Virtual Machines** by clicking through one of the Azure Arc-enabled VMs. The **Machine-Azure Arc (AVS)** page appears.
    1. As part of the **Overview** section on the left pane, the **Properties/Extensions** view lists the `WindowsAgent.SqlServer` (*Microsoft.HybridCompute/machines/extensions*), if installed. Alternatively, you can expand **Settings** on the left pane and select **Extensions**. The `WindowsAgent.SqlServer` name and type appear, if installed. 
    
    If you don't see the extension installed you can manually install by choosing **Extensions**, the Add button, and Azure Extension for SQL Server.  

- Use Azure Resource Graph queries:

  - You can use the query [List Arc-enabled SQL Server instances subscribed to ESU](/sql/sql-server/azure-arc/manage-configuration?tabs=azure&branch=main#list-arc-enabled-sql-server-instances-subscribed-to-esu) as an example to show how you can view eligible SQL Server ESU instances and their ESU subscription status.
    
### Windows Server

To enable ESUs for Windows Server environments that run in VMs in Azure VMware Solution, follow these steps

1. Contact [Microsoft Support](https://portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade) in the Azure portal for configuration assistance. 

2. On the **Problem description** page, select the following categories:

   - Select **Issue type** as **Technical**.
   - Select your subscription name.
   - Select **Service type** as **Azure VMware Solution** service.
   - Provide a brief summary of the request, such as "ESU request"
   - Select **Problem type** as **Security**.
   - Select **Problem subtype** as **Extended Security Update for Windows**.
   - Select **Next**.

3. Skip the **Recommended solution** page after it loads by selecting **Return to support request**. Select **Next**.

4. Add the following **Additional details** to the support request:
   - Your name and tenant ID
   - Number of VMs you want to register
   - OS versions
   - ESU year of coverage (for example, Year 1, Year 2, or Year 3). See [ESU Availability and End Dates](/lifecycle/faq/extended-security-updates?msclkid=65927660d02011ecb3792e8849989799#esu-availability-and-end-dates) for ESU End Date and Year. The support ticket provides you with ESU keys for one year. You'll need to create a new support request for other years. It's recommended to create a new request before your current ESU End Date Year date approaches.

> [!WARNING]
> If you create ESU licenses for Windows through Azure Arc, you're charged for the ESUs.

## Related content

- [What are Extended Security Updates - SQL Server](/sql/sql-server/end-of-support/sql-server-extended-security-updates)
- [Extend Security Updates for Windows Server overview](/windows-server/get-started/extended-security-updates-overview)
- [Plan your Windows Server and SQL Server end of support](https://www.microsoft.com/windows-server/extended-security-updates)
