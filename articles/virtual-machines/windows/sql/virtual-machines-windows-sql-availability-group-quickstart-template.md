---
title: Create WSFC, listener, and configure ILB for an Always On availability group on a SQL Server VM with Azure Quickstart Template
description: "Use Azure Quickstart Templates to simplify the process of creating availability groups for SQL Server VMs in Azure by using a template to create the cluster, join SQL VMs to the cluster, create the listener, and configure the ILB."
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: craigg
tags: azure-resource-manager
ms.assetid: aa5bf144-37a3-4781-892d-e0e300913d03
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 01/04/2018
ms.author: mathoma
ms.reviewer: jroth

---
# Create WSFC, listener, and configure ILB for an Always On availability group on a SQL Server VM with Azure Quickstart Template
This article describes how to use the Azure Quickstart Templates to partially automate the deployment of an Always On availability group configuration for SQL Server Virtual Machines in Azure. There are two Azure Quickstart Templates that are used in this process. 

   | Template | Description |
   | --- | --- |
   | [101-sql-vm-ag-setup](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-vm-ag-setup) | Creates the Windows Failover Cluster and joins the SQL Server VMs to it. |
   | [101-sql-vm-aglistener-setup](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-vm-aglistener-setup) | Creates the availability group listener and configures the Internal Load Balancer. |
   | &nbsp; | &nbsp; |

Other parts of the availability group configuration must be done manually, such as creating the availability group, and creating the Internal Load Balancer. This article provides the sequence of automated and manual steps.
 

## Prerequisites 
To automate the setup of an Always On availability group using quickstart templates, you must already have the following prerequisites: 
- An [Azure Subscription](https://azure.microsoft.com/free/).
- A resource group with a [domain controller](https://docs.microsoft.com/azure/architecture/reference-architectures/identity/adds-forest). 
- One or more domain-joined [VMs in Azure running SQL Server 2016 (or greater) Enterprise edition](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision) in the same availability set or availability zone that have been [registered with the SQL VM resource provider](#register-existing-sql-vm-with-new-resource-provider).  

## Register existing SQL VM with new resource provider
Since these availability group Azure Quickstart Templates rely on the SQL VM resource provider (Microsoft.SqlVirtualMachine), existing SQL Server VMs must be registered with the SQL VM resource provider. Skip this step if you created your SQL Server VM after December 2018, as all SQL Server VMs created after this date are automatically registered. This section provides steps to register with the provider using the Azure portal, but you can also use [PowerShell](virtual-machines-windows-sql-ahb.md#powershell). 

  >[!IMPORTANT]
  > If you drop your SQL Server VM resource, you will go back to the hard coded license setting of the image. 

1. Open the Azure portal and navigate to **All Services**. 
1. Navigate to **Subscriptions** and select the subscription of interest.  
1. In the **Subscriptions** blade, navigate to **Resource Provider**. 
1. Type `sql` in the filter to bring up the SQL-related resource providers. 
1. Select either *Register*, *Re-register*, or *Unregister* for the  **Microsoft.SqlVirtualMachine** provider depending on your desired action. 

  ![Modify the provider](media/virtual-machines-windows-sql-ahb/select-resource-provider-sql.png)

## Step 1 - Create the WSFC and join SQL Server VMs to the cluster using quickstart template 
Once your SQL Server VMs have been registered with the SQL VM new resource provider, you can join your SQL Server VMs into *SqlVirtualMachineGroup*. This resource defines the metadata of the Windows Failover Cluster, including the version, edition, Fully Qualified Domain Name, AD accounts to manage the cluster, and the Storage Account as the Cloud Witness. Adding the SQL Server VM to the *SqlVirtualMachineGroup* bootstraps the Windows Failover Cluster Service and joins the SQL Server VMs to the cluster. This step is automated with the **101-sql-vm-ag-setup** quickstart template and can be implemented with the following steps:

1. Navigate to the [**101-sql-vm-ag-setup**](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-vm-ag-setup) quickstart template and select **Deploy to Azure** to launch the quickstart template within the Azure portal.
1. Fill out the required fields to configure the Windows Failover Cluster metadata. The optional fields can be left blank.

    The following table shows the values necessary for the template: 

   | **Field** | Value |
   | --- | --- |
   | **Subscription** |  The subscription where your SQL Server VMs exist. |
   |**Resource group** | The resource group where your SQL Server VMs reside. | 
   |**Failover Cluster Name** | The desired name for your new Windows Failover Cluster. |
   | **Existing Vm List** | The SQL Server VMs you want to participate in the availability group, and as such, be part of this new cluster. Separate these values with a comma and a space (ex: SQLVM1, SQLVM2). |
   | **SQL Server Version** | Select the SQL Server version of your SQL Server VMs from the drop-down. Currently only SQL 2016 and SQL 2017 images are supported. |
   | **Existing Fully Qualified Domain Name** | The existing FQDN for the domain in which your SQL Server VMs reside. |
   | **Existing Domain Account** | An existing domain account that has sysadmin access to the SQL Server. | 
   | **Domain Account Password** | The password for the previously mentioned domain account. | 
   | **Existing Sql Service Account** | The domain user account that is being used to control the SQL Server service. This information can be found using the [**SQL Server Configuration Manager**](https://docs.microsoft.com/sql/relational-databases/sql-server-configuration-manager?view=sql-server-2017). |
   | **Sql Service Password** | The password used by the domain user account that controls the SQL Server service. |
   | &nbsp; | &nbsp; |

1. If you agree to the terms and conditions, select the checkbox next to **I Agree to the terms and conditions stated above** and select **Purchase** to finalize the Quickstart template deployment. 
1. To monitor your deployment, either select the deployment from the **Notifications** bell icon in your top navigation banner or navigate to your **Resource Group** in the Azure portal, select **Deployments** in the **Settings** field, and choose the 'Microsoft.Template' deployment. 

## Step 2 - Manually create the availability group 
Manually create the availability group as you normally would, using either [PowerShell](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/create-an-availability-group-sql-server-powershell?view=sql-server-2017),  [SQL Server Management Studio](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/use-the-availability-group-wizard-sql-server-management-studio?view=sql-server-2017) or [Transact-SQL](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/create-an-availability-group-transact-sql?view=sql-server-2017). 

  >[!IMPORTANT]
  > Do **not** create a listener at this time because this is automated by the **101-sql-vm-aglistener-setup**  quickstart template in Step 4. 

## Step 3 - Manually create the Internal Load Balancer (ILB)
The Always On availability group (AG) listener requires an internal Azure Load Balancer (ILB). The ILB provides a “floating” IP address for the AG listener that allows for faster failover and reconnection. If the SQL Server VMs in an availability group are part of the same availability set, then you can use a Basic Load Balancer; otherwise, you need to use a Standard Load Balancer.  **The ILB should be in the same vNet as the SQL Server VM instances.** The ILB only needs to be created, the rest of the configuration (such as the backend pool, health probe, and load-balancing rules) is handled by the **101-sql-vm-aglistener-setup** quickstart template in Step 4. 

1. In the Azure portal, open the resource group that contains the SQL Server virtual machines. 
2. In the resource group, click **Add**.
3. Search for **load balancer** and then, in the search results, select **Load Balancer**, which is published by **Microsoft**.
4. On the **Load Balancer** blade, click **Create**.
5. In the **Create load balancer** dialog box, configure the load balancer as follows:

   | Setting | Value |
   | --- | --- |
   | **Name** |A text name representing the load balancer. For example, **sqlLB**. |
   | **Type** |**Internal**: Most implementations use an internal load balancer, which allows applications within the same virtual network to connect to the availability group.  </br> **External**: Allows applications to connect to the availability group through a public Internet connection. |
   | **Virtual network** |Select the virtual network that the SQL Server instances are in. |
   | **Subnet** |Select the subnet that the SQL Server instances are in. |
   | **IP address assignment** |**Static** |
   | **Private IP address** |Specify an available IP address from the subnet. Use this IP address when you create a listener on the cluster.|
   | **Subscription** |If you have multiple subscriptions, this field might appear. Select the subscription that you want to associate with this resource. It is normally the same subscription as all the resources for the availability group. |
   | **Resource group** |Select the resource group that the SQL Server instances are in. |
   | **Location** |Select the Azure location that the SQL Server instances are in. |
   | &nbsp; | &nbsp; |

6. Select **Create**. 


  >[!NOTE]
  > The public IP resource for each SQL Server VM should have a standard SKU to be compatible with the Standard Load Balancer. To determine the SKU of your VM's public IP resource, navigate to your **Resource Group**, select your **Public IP Address** resource for the desired SQL Server VM, and locate the value under **SKU** of the **Overview** pane. 

## Step 4 - Create the AG listener and configure the ILB with the quickstart template

Create the availability group listener and configure the Internal Load Balancer (ILB) automatically with the **101-sql-vm-aglistener-setup**  quickstart template as it provisions the Microsoft.SqlVirtualMachine/Sql Virtual Machine Groups/Availability Group Listener resource. The  **101-sql-vm-aglistener-setup** quickstart template, via the SQL VM resource provider, does the following actions:

 - Configures the network settings for the cluster and ILB. 
 - Configures the ILB backend pool, health probe, and load-balancing rules.
 - Creates the AG listener with the given IP address and name.

To configure the ILB and create the AG listener, do the following:
1. Navigate to the [**101-sql-vm-aglistener-setup**](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-vm-aglistener-setup) quickstart template and select **Deploy to Azure** to launch the quickstart template within the Azure portal.
1. Fill out the required fields to configure the ILB, and create the availability group listener. The optional fields can be left blank. 

    The following table shows the values necessary for the template: 

   | **Field** | Value |
   | --- | --- |
   |**Resource group** | The resource group where your SQL Server VMs and availability group exist. | 
   |**Existing Failover Cluster Name** | The name of the cluster that your SQL Server VMs are joined to. |
   | **Existing Sql Availability Group**| The name of the availability group that your SQL Server VMs are a part of. |
   | **Existing Vm List** | The names of the SQL Server VMs that are part of the previously mentioned availability group. The names should be separated by a comma and a space (ex: SQLVM1, SQLVM2). |
   | **Existing Fully Qualified Domain Name** | The existing FQDN for the domain in which your SQL Server VMs reside. |
   | **Listener** | The DNS name you would like to assign to the listener. By default, this template specifies the name 'aglistener' but it can be changed. |
   | **Listener Port** | The port you want the listener to  use. Typically, this port should be the default port of 1433, and as such, this is the port number specified by this template. However, if your default port has been changed, then the listener port should use that value instead. | 
   | **Existing Vnet** | The name of the vNet where your SQL Server VMs, and ILB reside. |
   | **Existing Subnet** | The *name* of the internal subnet of your SQL Server VMs (ex: default). This value can be determined by navigating to your **Resource Group**, selecting your **vNet**, selecting **Subnets** under the **Settings** pane, and copying the value under **Name**. |
   | **Existing Internal Load Balancer** | The name of the ILB that you created in Step 3. |
   | **Probe Port** | The probe port that you want the ILB to use. The template uses 59999 by default but this value can be changed. |
   | &nbsp; | &nbsp; |

1. If you agree to the terms and conditions, select the checkbox next to **I Agree to the terms and conditions stated above** and select **Purchase** to finalize the quickstart template deployment. 
1. To monitor your deployment, either select the deployment from the **Notifications** bell icon in your top navigation banner or navigate to your **Resource Group** in the Azure portal, select **Deployments** in the **Settings** field, and choose the 'Microsoft.Template' deployment. 

  >[!NOTE]
  >If your deployment fails half way through, you will need to manually [remove the newly created listener](#remove-availability-group-listener) using PowerShell before redeploying the **101-sql-vm-aglistener-setup** quickstart template. 

## Remove availability group listener
If you later need to remove the availability group listener configured by the template, you must go through the SQL VM resource provider. Since the listener is registered through the SQL VM resource provider, just deleting it via SQL Server Management Studio is insufficient. It actually should be deleted through the SQL VM resource provider using PowerShell. Doing so removes the AG listener metadata from the SQL VM resource provider, and physically deletes the listener from the availability group. 

The following code snippet deletes the SQL availability group listener from both the SQL resource provider, and from your availability group: 

```PowerShell
# Remove the AG listener
# example: Remove-AzureRmResource -ResourceId '/subscriptions/a1a11a11-1a1a-aa11-aa11-1aa1a11aa11a/resourceGroups/SQLAG-RG/providers/Microsoft.SqlVirtualMachine/SqlVirtualMachineGroups/Cluster/availabilitygrouplisteners/aglistener' -Force
Remove-AzureRmResource -ResourceId '/subscriptions/<SubscriptionID>/resourceGroups/<resource-group-name>/providers/Microsoft.SqlVirtualMachine/SqlVirtualMachineGroups/<cluster-name>/availabilitygrouplisteners/<listener-name>' -Force
```
 
## Known issues and errors
This section discusses some known issues and their possible resolution. 

### Availability group listener for availability group '\<AG-Name>' already exists
The selected availability group used in the AG listener Azure Quickstart Template already contains a listener, either physically within the availability group, or as metadata within the SQL VM resource provider.  Remove the listener using [PowerShell](#remove-availability-group-listener) before redeploying the **101-sql-vm-aglistener-setup** quickstart template. 

### Connection only works from primary replica
This behavior is likely from a failed **101-sql-vm-aglistener-setup** template deployment leaving the ILB configuration in an inconsistent state. Verify that the backend pool lists the availability set, and that rules exist for the health probe and for the load-balancing rules. If anything is missing, then the ILB configuration is an inconsistent state. 

To resolve this behavior, remove the listener using [PowerShell](#remove-availability-group-listener), delete the Internal Load Balancer via the Azure portal, and start again at [Step 3](#step-3---manually-create-the-internal-load-balanced-ilb). 

### BadRequest - Only SQL virtual machine list can be updated
This error may occur when deploying the **101-sql-vm-aglistener-setup** template if the listener was deleted via SQL Server Management Studio (SSMS), but was not deleted from the SQL VM resource provider. Deleting the listener via SSMS does not remove the metadata of the listener from the SQL VM resource provider; the listener must be deleted from the resource provider using [PowerShell](#remove-availability-group-listener). 


## Next steps

For more information, see the following articles: 

* [Overview of SQL Server VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [SQL Server VM FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
* [SQL Server VM pricing guidance](virtual-machines-windows-sql-server-pricing-guidance.md)
* [SQL Server VM release notes](virtual-machines-windows-sql-server-iaas-release-notes.md)
* [Switching licensing models for a SQL Server VM](virtual-machines-windows-sql-ahb.md)



