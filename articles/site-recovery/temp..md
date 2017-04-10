---
title: Protect Active Directory and DNS with Azure Site Recovery | Microsoft Docs
description: This article describes how to implement a disaster recovery solution for Active Directory using Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: prateek9us
manager: gauravd
editor: ''

ms.assetid: af1d9b26-1956-46ef-bd05-c545980b72dc
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 3/17/2017
ms.author: pratshar

---
# Failing over a multi-tier load balanced application using Azure Site Recovery

Support for availability set has been a highly anticipated capability by a lot of Azure Site Recovery customers. I am excited to announce that Azure Site Recovery now supports creating failed over virtual machines an availability set. This in turn allows that you can configure an internal or an external load balancer to distribute traffic between multiple virtual machines of the same tier of an application.
 
In an earlier blog of this series you learnt the importance and complexity involved in recovering applications  - Disaster recovery for applications, not just virtual machines using Azure Site Recovery. The next blog described how can you do a one click disaster recovery using Azure Site Recovery. In this blog we will look at how to failover a multi tier load balanced application using Azure Site Recovery. We will use a three tier SharePoint farm as example to demonstrate this. 
 
The setup
To demonstrate this we will take example of three tier SharePoint farm that is using a SQL Always On as backend. This is how the SharePoint farm looks like.
 
 
 
Let us now look at how can we achieve this.
 
1.	Under the Recovery Services vault, go to Compute and Network settings of each of the application tier virtual machines and configure an availability set for them. 
2.	Configure another availability set for each of web tier virtual machines. 
3.	Add the two application tier virtual machines and the two web tier web tier virtual machines in Group-1 and Group-2 of a Recovery Plan respectively. Let us call the recovery plan ‘SharePointRecoveryPlan’. 
4.	If you have not already done so, import the most popular Site Recovery Automation Runbooks into your Azure Automation account. Click on this button to do so. 
5.	Add script ASR-SQL-FailoverAG as a ‘pre action’ to Group-1.      
6.	Add script ASR-AddMultipleLoadBalancers as a ‘post action’ to Group-1 and Group-2 
7.	Create an Azure Automation variable using the instructions available in the scripts. In my case these are the exact commands that I used. 
$InputObject = @{"TestSQLVMName" = "SQLRG" ; "TestSQLVMRG" = "SharePointSQLServer-test" ; "ProdSQLVMName" = "SQLRG" ; "ProdSQLVMRG" = "SharePointSQLServer"; "Paths" = @{"1"="SQLSERVER:\SQL\SharePointSQL\DEFAULT\AvailabilityGroups\Config_AG";"2"="SQLSERVER:\SQL\SharePointSQL\DEFAULT\AvailabilityGroups\Content_AG"};"7f55b81f-50ef-40db-ac72-947fbe720aff"=@{"ResourceGroupName"="ApptierInternalLB";"LBName"="SharePointRG"};"9bf23f9e-9f02-412c-9ba0-6e1f73cc8180"=@{"ResourceGroupName"="ApptierInternalLB";"LBName"="SharePointRG"};"d9729581-74c1-458c-9b6f-7e124eea2626"=@{"ResourceGroupName"="WebTierExternalLB";"LBName"="SharePointRG"};"e6ce0311-17e5-4f16-a83e-99fa72c5846f"=@{"ResourceGroupName"="WebTierExternalLB";"LBName"="SharePointRG"}}

$RPDetails = New-Object -TypeName PSObject -Property $InputObject  | ConvertTo-Json

New-AzureRmAutomationVariable -Name "SharePointRecoveryPlan" -ResourceGroupName "AutomationRG" -AutomationAccountName "ASRAutomation" -Value $RPDetails -Encrypted $false  
 
You have now completed customizing your recovery plan and it is ready to be failed over.
 
 
Once the failover is complete and the SharePoint farm starts to run in Azure and it looks like as follows.
 
 
In this blog we demonstrated that using the out of box constructs that Azure Site Recovery provides we can failover a three tier application by a just a single click. The recovery plan automated the following tasks:
1.	Failed over SQL Always On Availability Group to the virtual machine running in Azure
2.	Failed over the virtual machines that were part of the SharePoint farm
3.	Attached an internal load balancer on the application tier virtual machines of the SharePoint farm
4.	Attached an external load balancer on the application tier virtual machines of the SharePoint farm
You can check out additional product information and start replicating your workloads to Microsoft Azure using Azure Site Recovery today. You can use the powerful replication capabilities of Azure Site Recovery for 31 days at no charge for every new physical server or virtual machine that you replicate, whether it is running on VMware or Hyper-V. To learn more about Azure Site Recovery, check out our How-To Videos. Visit the Azure Site Recovery forum on MSDN for additional information and to engage with other customers, or use the Azure Site Recovery User Voice to let us know what features you want us to enable next.

