---
title: Isolation for Linux VMs in Azure | Microsoft Docs
description: Learn about VM isolation works in Azure.
services: virtual-machines-linux
documentationcenter: ''
author: ayshakeen
manager: gwallace
editor: ''

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 09/18/2019
ms.author: ayshak
---

# Virtual machine isolation in Azure

[!INCLUDE [virtual-machines-common-isolation](../../../includes/virtual-machines-common-isolation.md)]

[!INCLUDE [virtual-machines-common-isolation](../../../includes/virtual-machines-common-isolation-migration.md)]

## Retiring D15_v2/DS15_v2 isolation on February 15, 2020
We recently announced the Preview of Azure Dedicated Host, which allows you to run your organization’s Linux and Windows virtual machines on single-tenant physical servers. We plan to fully replace isolated Azure VMs with Azure Dedicated Host. After <b>February 15, 2020</b>, the D15_v2/DS15_v2 Azure VMs may no longer be hardware isolated.

## How does this affect me?
After February 15, 2020, we will no longer provide an isolation guarantee for your D15_v2/DS15_v2 Azure virtual machines. 

## What actions should I take?
If hardware isolation is not important to you, there is no action you need to take. 

If isolation is important to you, before February 15, 2020, you would need to either:
•	Migrate your workload to Azure Dedicated Host Preview
•	Migrate to a D15i_v2 and DS15i_v2 Azure VM, to get the same price performance. This option is only available for pay-as-you-go and one-year reserved instance scenarios. 
•	Migrate your workload to another Azure isolated virtual machine. 

For details see below:

## Timeline
| Date | Action | 
| --- | --- |
| Nov 15, 2019	| Availability of D/DS15i_v2 (PAYG, 1-year RI) |
| Feb 14, 2020	| Last day to buy D/DS15i_v2 1-year RI | 
| Feb 15, 2020	 | D/DS15_v2 isolation guarantee removed | 
| May 15, 2021	| Retire D/DS15i_v2 (all customers except who bought 3-year RI of D/DS15_v2 before November 15, 2019)| 
| Nov 14, 2022	 | Retire D/DS15i_v2 when 3-year RIs done (for customers who bought 3-year RI of D/DS15_v2 before November 15, 2019) | 

## FAQs
### Reserved Instances - Bill
### Q: I already purchased 1- or 3-year Reserved Instance for D15_v2 or Ds15_v2. How will the discount be applied to my VM usage?
**A**: All RIs purchased before November 15, 2019 will automatically extend coverage to the new isolated VM series. 

| RI |	Instance Size Flexibility |	Benefit eligibility |	
| --- | --- | --- |
|	D15_v2 	|	Off 	|	D15_v2 and D15i_v2 |	
|	D15_v2 	|	On 	|	D15_v2 series and D15i_v2 will all receive the RI benefit. |	
|	D14_v2 	|	On 	|	D15_v2 series and D15i_v2 will all receive the RI benefit. |	
 
Likewise for Dsv2 series.
 
### Q: I want to purchase additional Reserved Instances for Dv2. Which one should I choose?
**A**: All RIs purchased after the announcement date will have the following behavior. 

| RI |	Instance Size Flexibility |	Benefit eligibility |	
| --- | --- | --- |
| D15_v2 | 	Off | 	D15_v2 only  
| D15_v2 | 	On | 	D15_v2 series will receive the RI benefit. The new D15i_v2 will not be eligible for RI benefit from this RI type. | 
| D15i_v2 | 	Off | D15i_v2 only |  
| D15i_v2 | 	On 	| D15i_v2 only | 
 
Instance Size Flexibility cannot be used to apply to any other sizes such as D2_v2, D4_v2, or D15_v2. 
Likewise, for Dsv2 series.  
 
### Q: Can I buy a new 3-year RI for D15i_v2 and DS15i_v2?
**A**: Unfortunately no, only 1-year RI is available for new purchase.
 
### Q: Can I move my existing D15_v2/DS15_v2 Reserve Instance to an isolated size Reserved Instance?
**A**: This is not necessary since the benefit will apply to both isolated and non-isolated sizes. But Azure will support changing existing D15_v2/DS15_v2 Reserved Instances to D15i_v2/DS15i_v2. For all other Dv2/Dsv2 Reserved Instances, use the existing Reserved Instance or buy new Reserved Instances for the isolated sizes.
 
### Miscellaneous
### Q: When are the other isolated sizes going to retire?
**A**: We will provide reminders 12 months in advance of the official decommissioning of the sizes.

### Q: Is there a downtime when my vm lands on a non-isolated hardware?
**A**: If you do not need isolation you do not need to take any action and you would not see any downtime.

### Q: Are there any cost changes for moving to a non-isolated virtual machine?
**A**: No 

### Q: Why am I not seeing the new D/DS15i_v2 sizes in the portal?
**A**: If you are a current D/DS15_v2 customer and want to use the new D/DS15i_v2 sizes, please fill this form.: https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR0FTPNXHdWpJlO27GE-bHitUMkZUWEFPNjFPNVgyMkhZS05FSzlPTzRIOS4u

### Q: Why I am not seeing any quota for the new D/DS15i_v2 sizes?
**A**: Each customer is assigned the default quota according to their customer segment. If you are looking for more please fill this form: https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR0FTPNXHdWpJlO27GE-bHitUNU1XUkhZWkNXQUFMNEJWUk9VWkRRVUJPMy4u
