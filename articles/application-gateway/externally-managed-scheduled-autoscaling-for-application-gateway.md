---

title: Externally Managed Scheduled Autoscaling for Application Gateway v2
description: This article introduces the Azure Application Standard_v2 and WAF_v2 SKU Scheduled Autoscaling feature.
services: application-gateway
author: mjyot
ms.service: application-gateway
ms.topic: conceptual
ms.date: 20/10/2023
ms.author: mjyot

---

# Scheduled Autoscaling for Application Gateway 

## Overview
Certain customers have predictable diurnal traffic patterns. They have a good estimate of the capacity needed for Application Gateway to serve their traffic. Although they have autoscaling configured, they want the option to pre-schedule the minimum capacity to accommodate their traffic volume. Currently in Application Gateway we do not have the capability to accomplish this natively. While we may have this feature in future, this runbook with Azure Automation is a possible stopgap solution with a fully managed experience. 

The aim is to use  Azure Automation to create a mechanism for scheduling runbooks to adjust the minimum autoscaling capacity .This doesn’t provide native support for scheduled autoscaling in Application Gateway 

### How to setup scheduled autoscaling

The overall solution is extremely simple and it can be done with the following steps: 
1.	Create an Azure Automation account resource in the same tenant as the Application Gateway 
2.	Note the system assigned managed identity of the Azure Automation account 
3.	Create PowerShell runbooks for increasing and decreasing min autoscaling capacity for the Application Gateway resource 
4.	Create the schedules during which the runbooks need to be executed 
5.	Associate the runbooks with their respective schedules 
6.	Associate the system assigned managed identity noted above (2) with the Application Gateway resource 


### How to configure the setup 

Suppose the customer want to increase the min count to 4 during business hours and to decrease the min count to 2 during non-business hours. This way you will not get billed for the extra capacity as the bill is calculated as the maximum of min count and bill based on usage. 

We create two runbooks: 
1.	IncreaseMin - Sets the Min count of the autoscaling configuration to 4 
2.	DecreaseMin - Sets the Min count of the autoscaling configuration to 2 
The Powershell Runbook to adjust capacity is shown below:
  ```
# Get the context of the managed identity 
$context = (Connect-AzAccount -Identity).Context 
# Import the Az module 
Import-Module Az 
# Adjust the min count of your Application Gateway 
$gw = Get-AzApplicationGateway -Name "eastus-devsub-rtAppGw1" -ResourceGroupName "rtapadar-rg" 
$gw = Set-AzApplicationGatewayAutoscaleConfiguration -ApplicationGateway $gw -MinCapacity 4 
$gw = Set-AzApplicationGateway -ApplicationGateway $gw 
```
Then we create the below schedules: 

1.	WeekdayMorning – Run the IncreaseMin runbook from Mon-Fri at 5:59AM PST 
2.	WeekdayEvening – Run the DecreaseMin runbook from Mon-Fri at 9:55PM PST 
Below is the Actual Instance Count of the Application Gateway as a result of the runbook execution from Thursday to Monday. Please note that we didn’t schedule any run for the weekend, which is reflected in the result:

![image](https://github.com/MJyot/azure-docs-pr/assets/117745525/72140a4e-6f98-4625-abe5-ea29246f23b4)

Video tutorial - [ScheduledAutoscaleConfigurationWithAzureAutomation.mp4 ](https://microsoft-my.sharepoint.com/:v:/p/rtapadar/EfrK-f54ilRPuJCGjVKV3hIBt1R1nHzyZ_LGyJJlo34d_A?e=iN1VhU)

> [!NOTE]
> This runbook with Azure Automation provides a solution with fully managed experience.This is an interim solution while we work on native calendar-based scheduling. 

## FAQS

1. Can you give some examples of execution times for increasing min count? 

Below are some examples from our tests: 
|  Current Min Instance Count  |  Target Min Instance Count  | Time In Minutes |
| --- | --- | --- |
| 2 |	4 |	3m |
| 4 |	12 |	3m |
| 12 |	15 | 3m | 
|15 |	30 	| 4m 20s |
|30 |	50 |	4m 6s |
|50 |	100 |	4m 38s | 
| 2 |	50 |	5m23s |
| 2 |	100 |	5m15s | 

2. How long does execution times for decreasing min count take? 

By design, when the min count is decreased, the operation only saves the min config. It then falls back on Autoscale delegate to ScaleIn one at a time honoring the the ScaleInCoolOffPeriod (30 minutes). The implication here is that we can scale down 2 instances in one hour. The customer gets additional capacity that they didn’t ask for. Also, the customer doesn’t get billed for the extra capacity as the bill = max(min count, bill based on usage) 

3. What is the SLA for timely job executions? 

Azure Automation has a SLA of 99.9% for a timely start of jobs. 
 
4. What happens if jobs are interrupted during execution?
   
  a.	If the job already sends the request to AppGW before getting interrupted, then the request should go through fine 
  b.	If the job gets interrupted before sending the request to AppGW, then it should be one of the scenarios described in 
  the next section 
 
5. What happens if job executions don’t occur?

   | Unexecuted Job  |	Impact  |
   | --- | --- | 
   |IncreaseMin |	Falls back on native autoscaling ,Next execution of DecreaseMin should be no-op as the count doesn’t need to be adjusted |
   |DecreaseMin |	Additional cost born by the customer for the (unintended) capacity that is provisioned for those hours .Next execution of IncreaseMin should be no-op as the count doesn’t need to be adjusted |
    

## Next steps

Learn more about [Monitoring Azure Automation runbooks with metric alerts](../automation/automation-alert-metric.md) 

Learn more about [Azure Automation](../automation/overview.md)

Reach out to us at [agschedule-autoscale@microsoft.com](agschedule-autoscale@microsoft.com) if you have questions or need help to setup Managed scheduled autoscale for your deployments.


