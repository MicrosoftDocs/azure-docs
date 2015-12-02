<properties
	pageTitle="Site Recovery Capacity Planner | Microsoft Azure" 
	description="Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers located on on-premises to Azure or to a secondary on-premises site." 
	services="site-recovery" 
	documentationCenter="" 
	authors="prateek9us" 
	manager="abhiag" 
	editor=""/>

<tags 
	ms.service="site-recovery" 
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery" 
	ms.date="11/27/2015" 
	ms.author="pratshar"/>

# Site Recovery Capacity Planner

This document explains using the Microsoft ASR Capacity Planning tool, which provides guidance on the resources that need to be provisioned for seamless Site Recovery operations. 
Capacity planning tool can be used to analyze the source environment (workloads), bandwidth requirements, resource requirements (VMs, storage) on the target and any additional server resources that are required on the source side (SC VMMs, Configuration Servers, Process Servers etc).  Download [Azure Site Recovery Capacity Planner](http://aka.ms/asr-capacity-planner-excel) tool
 
There are two modes in which the capacity planner can be used:
 
- **Quick planning**: Get the network and server projections based on average number of VMs, disks, storage and change rate. 
- **Detailed planning**: Provide the details of each workload at VM level. Analyze the compatibility at the VM level and also get the projections of the network and servers.
     
This document assumes the user to be familiar with the Azure Site Recovery. Refer to [Azure Site Recovery Overview](site-recovery-overview.md)  

## Getting Started
###Pre-requisites
Depending on the mode of the planner you want to use, the details required to proceed changes. In addition to the infrastructure details such as VMs, Disks per VM, Storage per disk, there are a few more details required. The key one is the daily change rate or churn rate. If the source environment is Hyper-V, use the [Hyper-V capacity planning tool](https://www.microsoft.com/en-in/download/details.aspx?id=39057) to get the churn rate. Read the instruction to use [Hyper-v capacity planning tool](site-recovery-capacity-planning-for-hyper-v-replication.md). For VMWare, use the [VMware Capacity Planning appliance tool](https://labs.vmware.com/flings/vsphere-replication-capacity-planning-appliance)

##Quick Planner
1.	Open the **ASR Capacity Planner.xlsm** file. This requires macros to be run. Therefore **“enable editing”** and **“enable content”** when prompted 
1.	Select **Quick Planner** from the list box. This opens up another worksheet titled **Capacity Planner**

	![Getting Started](./media/site-recovery-capacity-planner/getting-started.png)

1.	In the “Capacity Planner” worksheet, enter the inputs as needed. All the circled fields are mandatory input fields. 
	1.	Select your scenario list box is a list box using which the source environment can be changed between ‘Hyper-V to Azure’ and ‘VMware/Physical to Azure’.
	1. 	Average Daily data change rate needs to be measured. In Hyper-V environments, Hyper-V Capacity planner tool can be used. In case of VMWare, VMWare Capacity Planner tool can be used. It is usually advised to run the tool for at least a week so that any peaks can be captured and averaged out. 
	1. 	Compression – this is the compression offered by ASR in VMWare/Physical to Azure scenario. In Hyper-V to Azure, this can be achieved through third party appliance such as Riverbed. 
	1. In VMWare/Physical to Azure scenario, Number of retention should be input in days. In Hyper-V scenario, this will be input in hours. 
	1. The last two inputs are used to compute the initial Replication (IR). When ASR setup is deployed, the entire initial data set should be uploaded. Number of hours in which initial replication for the batch of virtual machines should complete and Number of virtual machines per initial replication batch - this is desired to be taken as inputs. On the other hand, these numbers can be tweaked to adjust the existing bandwidth. 

	![Inputs](./media/site-recovery-capacity-planner/inputs.png)

1. After entering the details of the source environment, the output displayed will have the guidance which includes
	1.	Network Bandwidth requirements
		1. Bandwidth required for delta replication (in Megabits/sec). This is computed based on the average daily data change rate. 
		1. Bandwidth required for initial replication (In Megabits/sec) is also presented. This is computed based on the initial replication inputs presented (last two rows) in the inputs. 
	1.	Azure requirements
		1. 	This section details on the Storage, IOPS, Storage Accounts and Disks required in Azure. 
	1. 	Other Infra requirements 
		1. Any additional requirements in VMware/Physical to Azure scenario such as Configuration Servers and Process Servers requirements. 
		1. 	Any additional requirements in Hyper-V to Azure scenario such as additional storage required on the source.
			
	![Output](./media/site-recovery-capacity-planner/output.png)
 
##Detailed Planner

1.	Open the **ASR Capacity Planner.xlsm** file. This requires macros to be run. Therefore **“enable editing”** and **“enable content”** when prompted 
1.	Select **Detailed Planner** from the list box. This opens up another worksheet titled **Workload Qualification**

	![Getting Started](./media/site-recovery-capacity-planner/getting-started-2.png)


1.	In the Workload Qualification worksheet, enter the inputs as needed. All the columns marked in red are mandatory fields.  Other columns are optional.
	1.	Process Cores: Provide total number of core of a source server
	1. Memory Allocation in MB:  Provide RAM size of a source server.
	1.	Number of NICs: Provide number of NICS of a source server.
	1. Total Storage (in GBs): Provide total size of your storage of the VM. For example if the source server has 3 disks each with 500 GBs, total storage size is 1500GB.
	1. Number of disks attached: provide total number of disks of a source server.
	1. Disk capacity utilization :Provide average utilization 
	1. Daily Change rate(%): Provide daily data change rate of a source server.
	1. Mapping Azure size: You can either enter Azure VM size that you want to map or use the button Compute IaaS VMs to compute the best possible match. 

	![Workload Qualification](./media/site-recovery-capacity-planner/workload-qualification.png)
 

1. Clicking **Compute IaaS VMs** button validates above inputs and suggests the best possible Azure VM match. If it cannot find the appropriate size of Azure VM for a source server, it gives an error for the server. For example, when Number of disks attached for a source VM is 65, it gives an error as maximum number of disks can be attached to the highest size Azure VM is 64


**Compute IaaS VMs** also computes whether a VM needs Azure standard storage account or Azure premium storage account. It also suggests how many number of standard storage accounts and premium storage accounts required for the workload. Scroll down right to view Azure storage type and the storage account that can be used for a source server
 
**Example** : For 5 VMs with the following values, the tool computed and assigned the best Azure size VM match and suggested whether the VM needs standard storage or premium storage

![Workload Qualification](./media/site-recovery-capacity-planner/workload-qualification-2.png)

In the example two standard storage accounts and one premium storage accounts required for five VMs. VM1, VM2 can go use first standard storage account and VM3 can use 2nd standard storage account. VM4 and VM5 need premium storage account and can be accommodate in a single premium storage account.

![Workload Qualification](./media/site-recovery-capacity-planner/workload-qualification-3.png)


>[AZURE.NOTE] IOPS is calculated at VM level and not at a disk level. If one of the disks of a source VM IOPS is > 500, but total IOPS of the VM is within supported standard Azure VM, and all other values (number of disks, number of NICs, number of CPU cores, Memory size, ) are within a standard VM limit then the tool picks a standard VM instead of premium storage.  User need to manually update the mapping Azure size cell with appropriate DS or GS series VM


1.	First column is a validation column for the VMs, disks and churn. 
1.	Once all the details are in place, hit the **Submit data to the planner tool** button on the top. This will open up the **Capacity Planner** worksheet with the averages auto-populated as shown in the figure below. 
1.	This action will also highlight which workloads are eligible for protection and which are not.


###Capacity Planner

1.	In the **Capacity Planner** worksheet, the first row Infra Inputs source **Workload** suggests that the input information is populated from the **Workload Qualification** worksheet.  
1.	Whenever any changes are required, make the necessary changes in the **Workload Qualification** worksheet and hit the **Submit Data To the planner tool** button. 

	![Capacity Planner](./media/site-recovery-capacity-planner/capacity-planner.png)


