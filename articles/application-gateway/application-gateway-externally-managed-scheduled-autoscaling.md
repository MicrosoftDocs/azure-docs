---

title: Externally managed scheduled autoscaling for Application Gateway v2
description: This article introduces the Azure Application Standard_v2 and WAF_v2 SKU scheduled autoscaling feature.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 10/30/2023
ms.author: greglin

---
# Schedule autoscaling for Application Gateway v2

## Overview

For those experiencing predictable daily traffic patterns and who have a reliable estimate of the required capacity for Application Gateway, the option to preschedule the minimum capacity to better align with traffic demands might be of interest. 

While autoscaling is commonly utilized, it’s important to note that Application Gateway doesn't currently support prescheduled capacity adjustments natively.

The goal is to use Azure Automation to create a schedule for running runbooks that adjust the minimum autoscaling capacity of Application Gateway to meet traffic demands.

## Set up scheduled autoscaling 

To implement scheduled autoscaling:
1.	Create an Azure Automation account resource in the same tenant as the Application Gateway. 
2.	Note the system assigned managed identity of the Azure Automation account.
3.	Create PowerShell runbooks for increasing and decreasing min autoscaling capacity for the Application Gateway resource.
4.	Create the schedules during which the runbooks need to be implemented.
5.	Associate the runbooks with their respective schedules.
6.	Associate the system assigned managed identity noted in step 2 with the Application Gateway resource.

## Configure automation

Suppose the requirement is to increase the min count to 4 during business hours and to decrease the min count to 2 during non business hours. 

Two runbooks are created: 
- IncreaseMin - Sets the min count of the autoscaling configuration to 4 
- DecreaseMin - Sets the min count of the autoscaling configuration to 2 

Use the following PowerShell runbook to adjust capacity:

  ```Azure PowerShell
# Get the context of the managed identity 
$context = (Connect-AzAccount -Identity).Context 
# Import the Az module 
Import-Module Az 
# Adjust the min count of your Application Gateway 
$gw = Get-AzApplicationGateway -Name “<AppGwName>” -ResourceGroupName “<ResourceGroupName>”
$gw = Set-AzApplicationGatewayAutoscaleConfiguration -ApplicationGateway $gw -MinCapacity <NumberOfRequiredInstances>
$gw = Set-AzApplicationGateway -ApplicationGateway $gw 
```

Next, create the following two schedules:

- WeekdayMorning – Run the IncreaseMin runbook from Mon-Fri at 5:00AM PST 
- WeekdayEvening – Run the DecreaseMin runbook from Mon-Fri at 9:00PM PST 

## FAQs

- What is the SLA for timely job executions?  

  Azure Automation has a SLA of 99.9% for a timely start of jobs.  

- What happens if jobs are interrupted during execution?
   
    - If the job already sends the request to AppGW before getting interrupted, then the request goes through.  
    - If the job gets interrupted before sending the request to Application Gateway, then it will be one of the scenarios described in next section.  

- What happens if job tasks don’t occur? 

   | Absent job |	Impact  | 
   | --- | --- |  
   |IncreaseMin |	Falls back on native autoscaling. Next run of DecreaseMin should be no-op as the count doesn’t need to be adjusted. | 
   |DecreaseMin |	Additional cost to the customer for the (unintended) capacity that is provisioned for those hours. Next run of IncreaseMin should be no-op because the count doesn’t need to be adjusted. | 
  
> [!NOTE]
> Send email to agschedule-autoscale@microsoft.com if you have questions or need help to set up managed and scheduled autoscale for your deployments. 

## Next steps

* Learn more about [Scaling Application Gateway v2 and WAF v2](application-gateway-autoscaling-zone-redundant.md)
* Learn more about [Monitoring Azure Automation runbooks with metric alerts](../automation/automation-alert-metric.md)
* Learn more about [Azure Automation](../automation/overview.md) 
