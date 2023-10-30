---

title: Externally Managed Scheduled Autoscaling for Application Gateway v2
description: This article introduces the Azure Application Standard_v2 and WAF_v2 SKU Scheduled Autoscaling feature.
services: application-gateway
author: mjyot
ms.service: application-gateway
ms.topic: How To
ms.date: 20/10/2023
ms.author: mjyot

---
# Scheduled Autoscaling for Application Gateway 

## Overview
For those experiencing predictable daily traffic patterns and who have a reliable estimate of the required capacity for Application Gateway, the option to pre-schedule the minimum capacity to better align with traffic demands might be of interest. 

While autoscaling is commonly utilized, it’s important to note that Application Gateway does not currently support pre-scheduled capacity adjustments natively.

The goal is to utilize Azure Automation, a fully managed service, to establish a mechanism for scheduling runbooks, enabling adjustments to the minimum autoscaling capacity of Application Gateway to better meet traffic requirements.

### How to setup scheduled autoscaling 

The solution is straightforward and can be implemented through the following actions:
1.	Create an Azure Automation account resource in the same tenant as the Application Gateway 
2.	Note the system assigned managed identity of the Azure Automation account 
3.	Create PowerShell runbooks for increasing and decreasing min autoscaling capacity for the Application Gateway resource 
4.	Create the schedules during which the runbooks need to be executed 
5.	Associate the runbooks with their respective schedules 
6.	Associate the system assigned managed identity noted above (2) with the Application Gateway resource 

### How to configure the setup 
Suppose the requirement is to increase the min count to 4 during business hours and to decrease the min count to 2 during non-business hours. We create two runbooks: 
1.	IncreaseMin - Sets the Min count of the autoscaling configuration to 4 
2.	DecreaseMin - Sets the Min count of the autoscaling configuration to 2 
The Powershell Runbook to adjust capacity is shown below:
  ```
# Get the context of the managed identity 
$context = (Connect-AzAccount -Identity).Context 
# Import the Az module 
Import-Module Az 
# Adjust the min count of your Application Gateway 
$gw = Get-AzApplicationGateway -Name “<AppGwName>” -ResourceGroupName “<ResourceGroupName>”
$gw = Set-AzApplicationGatewayAutoscaleConfiguration -ApplicationGateway $gw -MinCapacity <NumberOfRequiredInstances>
$gw = Set-AzApplicationGateway -ApplicationGateway $gw 
```
Then we create the below schedules: 
1.	WeekdayMorning – Run the IncreaseMin runbook from Mon-Fri at 5:00AM PST 
2.	WeekdayEvening – Run the DecreaseMin runbook from Mon-Fri at 9:00PM PST 

Video tutorial - [ScheduledAutoscaleConfigurationWithAzureAutomation.mp4 ](https://microsoft-my.sharepoint.com/:v:/p/rtapadar/EfrK-f54ilRPuJCGjVKV3hIBt1R1nHzyZ_LGyJJlo34d_A?e=iN1VhU)

## FAQS
1. What is the SLA for timely job executions?  
Azure Automation has a SLA of 99.9% for a timely start of jobs.  
2. What happens if jobs are interrupted during execution?
   
    a.	If the job already sends the request to AppGW before getting interrupted, then the request will go through.  

    b.	If the job gets interrupted before sending the request to AppGW, then it will be one of the scenarios described in  next section.  

3. What happens if job executions don’t occur? 

   | Unexecuted Job  |	Impact  | 
   | --- | --- |  
   |IncreaseMin |	Falls back on native autoscaling ,Next execution of DecreaseMin should be no-op as the count doesn’t need to be adjusted | 
   |DecreaseMin |	Additional cost born by the customer for the (unintended) capacity that is provisioned for those hours . Next execution of IncreaseMin should be no-op as the count doesn’t need to be adjusted | 
  
## Next steps 
Learn more about [Monitoring Azure Automation runbooks with metric alerts](../automation/automation-alert-metric.md)

Learn more about [Azure Automation](../automation/overview.md) 

Reach out to us at [agschedule-autoscale@microsoft.com](agschedule-autoscale@microsoft.com) if you have questions or need help to setup Managed scheduled autoscale for your deployments. 


