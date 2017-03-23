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
# Protect Active Directory and DNS with Azure Site Recovery

One-click disaster recovery of applications using Azure Site Recovery
Disaster recovery is not only about replicating your virtual machines. It is about end to end application recovery that is tested multiple times, error free and stress free when disaster strikes, which is the Azure Site Recovery promise. If you have never seen your application run in Microsoft Azure, chances are that when a real disaster happens, the virtual machines may just boot, but your business may remain down. The importance and complexity involved in recovering applications was described in the previous blog of this series - Disaster recovery for applications, not just virtual machines using Azure Site Recovery. This blog is a deep-dive on how you can use the Azure Site Recovery construct of  recovery plans to failover or migrate applications to Microsoft Azure in the most tested and deterministic way, with a real-world public cloud disaster recovery example
 
Why use Azure Site Recovery “recovery plans”?
Recovery plans help you plan for a systematic recovery process by creating small independent units that you can manage. These units will typically represent an application in your environment. 
•	You may need to apply a public IP address for few of the virtual machines, change the configuration files in the application so that it can work in Microsoft Azure, or reconfigure the external endpoints of your VPN so that your end users connecting to the application can continue to work and deliver business value. You can capture all such dependencies in a recovery plan and automate most of these activities using scripts. 
•	Automating recovery tasks using scripts also reduces the RTO of your recovery. Recovery plans can help build application level units and enrich them so that a complete datacenter can be recovered successfully.
•	You can run test failovers on the application and ensure that it comes up successfully on the recovery site. This ensures that you have not missed any critical dependencies like network configurations or domain controllers required by the application. Each application may also need custom changes post failover. 
Essentially, one way to check that you are prepared for disaster recovery is by ensuring that every application of yours is part of a recovery plan and each of the recovery plans is tested for recovery to Microsoft Azure. With this preparedness, you can confidently migrate or failover your complete datacenter to Microsoft Azure.
 
Let us look at the three key value propositions of a recovery plan:

1.    Model an application to capture dependencies2.    Automate most recovery tasks to reduce RTO
3.  Test failover to be ready for a real disaster

 
Model an application to capture dependencies
A recovery plan is a group of virtual machines generally comprising an application that failover together. Using the recovery plan constructs, you can enhance this group to capture your application specific properties.
 
Let us take the example of a typical three tier application with 
•	one SQL backend
•	one middleware 
•	one web frontend
The recovery plan can be customized to ensure that the virtual machines come up in the right order post a failover. The SQL backend should come up first, the middleware should come up next and the web frontend should come up last. This order makes certain that the application will be working by the time the last virtual machine comes up. For example, when the middleware comes up, it will try to connect to the SQL tier, and the recovery plan has ensured that the SQL tier is already running. Frontend servers coming up last also ensures that end users do not connect to the application URL by mistake until all the components are up are running and the application is ready to accept requests. To build these dependencies, you can customize the recovery plan to add groups. Then select a virtual machine and change its group to move it between groups.
  
 
Once you complete the customization, you can visualize the exact steps of the recovery. Here are the order of steps executed during the failover of a recovery plan: 

•	First there will be a shutdown step that ensures that all the virtual machines on-premises are turned off (except in test failover where the primary site needs to continue to be running).
•	
•	Next it triggers failover of all the virtual machines of the recovery plan in parallel. The failover step prepares the virtual machines’ disks from replicated data. Finally the startup groups execute in their order, starting the virtual machines in each group -Group 1 first, then Group 2, and finally Group 3. If there are more than one virtual machines in any group (e.g. a load-balanced web frontend) all of them are booted up in parallel. 

Sequencing across groups ensures that dependencies between various application tiers are honored and parallelism where appropriate improves the RTO of application recovery. 

Automate most recovery tasks to reduce RTO
Recovering large applications can be a complex task. It is also very difficult to remember the exact customization steps post failover. Sometimes, it is not you, but someone else who is unaware of the application intricacies, who needs to trigger the failover. Remembering too many manual steps in times of chaos is difficult and error prone. A recovery plan gives you a way to automate the required actions you need to take at every step, by using Azure Automation runbooks. With runbooks, you can automate common tasks like
1.	Tasks on the Microsoft Azure virtual machine post failover. These are required typically so that you can connect to the virtual machine or the machine interacts correctly with Microsoft Azure artifacts. E.g.  
1.    Create a public IP on the virtual machine post failover
2.    Assign a NSG to the failed over virtual machine’s NIC
3.    Add a load balancer to an availability set
2.	Tasks inside the virtual machine post failover. These re-configure the application so that it continues to work correctly in the new environment. E.g.
a.	Modify the application to database connection string inside the virtual machine
b.	Change web server configuration/rules 
Learn more about how to author automation runbooks for Azure Site Recovery in this document. For many common tasks, you can use a single runbook and pass parameters to it for each recovery plan so that one runbook can serve all your applications.
To deploy these scripts yourself and try them out, click on the button below.
 
With a complete recovery plan that automates post recovery tasks using automation runbooks, you can achieve one-click application failover and optimize the RTO.  
For any tasks that cannot be automated, recovery plans provide the ability to insert manual actions.
Test failover to be ready for a real disaster
A recovery plan can be used to trigger a real failover or a test failover. You should always attempt a test failover on the application before doing a real failover. Test failover helps you to check whether the application will really come up on the recovery site.  If you have missed something, you can easily trigger cleanup and redo the test failover. Do the test failover multiple times till you know for sure that the application recovers smoothly.
 
Each application is different and you need to build recovery plans that are customized for each. Also, in this dynamic datacenter world, the applications and their dependencies keep changing. Test failover your applications once a quarter to check that the recovery plan is current. 
 
  
 

 
Real-world example - WordPress disaster recovery solution
Watch a quick video of a two-tier WordPress application failover to Microsoft Azure and see the recovery plan with automation scripts, and its test failover in action using Azure Site Recovery.
•	The WordPress deployment consists of one MySQL virtual machine and one frontend virtual machine with Apache web server, listening on port 80. 
•	WordPress deployed on the Apache Server is configured to communicate with MySQL via the IP address 10.150.1.40. 
•	Upon failover, the WordPress configuration will need to be changed to communicate with MySQL on the failover IP address 10.1.6.4. To ensure that MySQL acquires the same IP address every time on failover, we will configure the virtual machine properties to have a preferred IP address set to 10.1.6.4. 
This picture below shows the application topology on the primary and recovery site.
 

Watch this video for the end to end demo of this WordPress application test failover.
With relentless focus on ensuring that you succeed with full application recovery, Azure Site Recovery is the one-stop shop for all your disaster recovery needs. Our mission is to democratize disaster recovery with the power of Microsoft Azure, to enable not just the elite tier-1 applications to have a business continuity plan, but offer a compelling solution that empowers you to set up a working end to end disaster recovery plan for 100% of your organization's IT applications.
You can check out additional product information and start replicating your workloads to Microsoft Azure using Azure Site Recovery today. You can use the powerful replication capabilities of Azure Site Recovery for 31 days at no charge for every new physical server or virtual machine that you replicate, whether it is running on VMware or Hyper-V. To learn more about Azure Site Recovery, check out our How-To Videos. Visit the Azure Site Recovery forum on MSDN for additional information and to engage with other customers, or use the Azure Site Recovery User Voice to let us know what features you want us to enable next.

