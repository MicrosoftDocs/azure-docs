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

Support for Azure virtual machines availability sets has been a highly-anticipated capability by a lot of Azure Site Recovery customers. Today, I am excited to announce that Azure Site Recovery now supports creating failed over virtual machines in an availability set. This in turn allows that you can configure an internal or external load balancer to distribute traffic between multiple virtual machines of the same tier of an application. With the Azure Site Recovery promise of cloud disaster recovery of applications, this first-class integration with availability sets and load balancers makes it simpler for you to run your failed over applications on Microsoft Azure with the same guarantees that you had while running them on the primary site.

In an earlier blog of this series focused on cloud disaster recovery of applications, you learnt about the importance and complexity involved in recovering applications - Disaster recovery for applications, not just virtual machines using Azure Site Recovery. The next blog was a deep-dive on recovery plans describing how you can do a one-click disaster recovery of applications using Azure Site Recovery. In this blog, we look at how to failover a load balanced multi-tier application using Azure Site Recovery.

To demonstrate real-world usage of availability sets and load balancers in a recovery plan, a three-tier SharePoint farm with a SQL Always On backend is being used. Note that different tiers are using different replication technologies – Active Directory Replication for the AD tier, SQL Always On Availability Group for the database tier, and Azure Site Recovery replication for the app and web tiers. A single recovery plan will be used to orchestrate failover of this entire SharePoint farm.



Disaster Recovery of three tier SharePoint Farm



Here are the steps to set up availability sets and load balancers for this SharePoint farm when it needs to run on Microsoft Azure: 

Under the Recovery Services vault, go to Compute and Network settings of each of the application tier virtual machines, and configure an availability set for them. 
Configure another availability set for each of web tier virtual machines. 
Add the two application tier virtual machines and the two web tier web tier virtual machines in Group 1 and Group 2 of a recovery plan respectively. 
If you have not already done so, click on this button below to import the most popular Azure Site Recovery automation runbooks into your Azure Automation account. 
Add script ASR-SQL-FailoverAG as a pre-step to Group 1.   DeployToAzure 
Add script ASR-AddMultipleLoadBalancers as a post-step to both Group 1 and Group 2. 
Create an Azure Automation variable using the instructions outlined in the scripts. For this example, these are the exact commands used. 


$InputObject = @{"TestSQLVMRG" = "SQLRG" ;
                "TestSQLVMName" = "SharePointSQLServer-test" ;
                "ProdSQLVMRG" = "SQLRG" ;
                "ProdSQLVMName" = "SharePointSQLServer";
                "Paths" = @{
                    "1"="SQLSERVER:\SQL\SharePointSQL\DEFAULT\AvailabilityGroups\Config_AG";   
                    "2"="SQLSERVER:\SQL\SharePointSQL\DEFAULT\AvailabilityGroups\Content_AG"};   
                "406d039a-eeae-11e6-b0b8-0050568f7993"=@{                               
                    "LBName"="ApptierInternalLB";
                    "ResourceGroupName"="ContosoRG"};               
                "c21c5050-fcd5-11e6-a53d-0050568f7993"=@{
                    "LBName"="ApptierInternalLB";   
                    "ResourceGroupName"="ContosoRG"};
                "45a4c1fb-fcd3-11e6-a53d-0050568f7993"=@{
                    "LBName"="WebTierExternalLB";
                    "ResourceGroupName"="ContosoRG"};
                "7cfa6ff6-eeab-11e6-b0b8-0050568f7993"=@{
                    "LBName"="WebTierExternalLB";
                    "ResourceGroupName"="ContosoRG"}}

$RPDetails = New-Object -TypeName PSObject -Property $InputObject  | ConvertTo-Json New-AzureRmAutomationVariable -Name "SharePointRecoveryPlan" -ResourceGroupName "AutomationRG" -AutomationAccountName "ASRAutomation" -Value $RPDetails -Encrypted $false  You have now completed customizing your recovery plan and it is ready to be failed over.

RecoveryPlan



Once the failover (or test failover) is complete and the SharePoint farm runs in Microsoft Azure, it looks like this:

SharePoint Farm on Azure



Watch this demo video to see all this in action - how using in-built constructs that Azure Site Recovery provides we can failover a three-tier application using a single-click recovery plan. The recovery plan automates the following tasks:

Failing over SQL Always On Availability Group to the virtual machine running in Microsoft Azure 
Failing over the web and app tier virtual machines that were part of the SharePoint farm 
Attaching an internal load balancer on the application tier virtual machines of the SharePoint farm that are in an availability set 
Attaching an external load balancer on the web tier virtual machines of the SharePoint farm that are in an availability set 
 

With relentless focus on ensuring that you succeed with full application recovery, Azure Site Recovery is the one-stop shop for all your disaster recovery needs. Our mission is to democratize disaster recovery with the power of Microsoft Azure, to enable not just the elite tier-1 applications to have a business continuity plan, but offer a compelling solution that empowers you to set up a working end to end disaster recovery plan for 100% of your organization's IT applications.

You can check out additional product information and start replicating your workloads to Microsoft Azure using Azure Site Recovery today. You can use the powerful replication capabilities of Azure Site Recovery for 31 days at no charge for every new physical server or virtual machine that you replicate, whether it is running on VMware or Hyper-V. To learn more about Azure Site Recovery, check out our How-To Videos. Visit the Azure Site Recovery forum on MSDN for additional information and to engage with other customers, or use the Azure Site Recovery User Voice to let us know what features you want us to enable next.
