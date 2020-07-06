---
 title: include file
 description: include file
 services: virtual-machines
 author: ayshakeen
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/18/2019
 ms.author: azcspmt;ayshak;cynthn
 ms.custom: include file
---

Azure Compute offers virtual machine sizes that are Isolated to a specific hardware type and dedicated to a single customer.  These virtual machine sizes are best suited for workloads that require a high degree of isolation from other customers for workloads involving elements like compliance and regulatory requirements.  Customers can also choose to further subdivide the resources of these Isolated virtual machines by using [Azure support for nested virtual machines](https://azure.microsoft.com/blog/nested-virtualization-in-azure/).

Utilizing an isolated size guarantees that your virtual machine will be the only one running on that specific server instance.  The current Isolated virtual machine offerings include:
* Standard_E64is_v3
* Standard_E64i_v3
* Standard_M128ms
* Standard_GS5
* Standard_G5
* Standard_DS15_v2 <sup>*</sup>
* Standard_D15_v2 <sup>*</sup>
* Standard_F72s_v2

<sup>*</sup>Isolation guarantee will retire by May 15, 2020

## Retiring D15_v2/DS15_v2 isolation on May 15, 2020
**Update on February 10, 2020: The "isolation" retirement timeline has been extended to May 15, 2020"**

Azure Dedicated Host is now GA, which allows you to run your organization’s Linux and Windows virtual machines on single-tenant physical servers. We plan to fully replace isolated Azure VMs with Azure Dedicated Host. After **May 15, 2020** the D15_v2/DS15_v2 Azure VMs will no longer be hardware isolated.

## How does this affect me?
After May 15, 2020, we will no longer provide an isolation guarantee for your D15_v2/DS15_v2 Azure virtual machines. 

## What actions should I take?
If hardware isolation is not required for you, there is no action you need to take. 

If isolation is required to you, before May 15, 2020, you would need to either:

•	[Migrate](https://azure.microsoft.com/blog/introducing-azure-dedicated-host) your workload to Azure Dedicated Host.

•	[Request access](https://aka.ms/D15iRequestAccess) to a D15i_v2 and DS15i_v2 Azure VM, to get the same price performance. This option is only available for pay-as-you-go and one-year reserved instance scenarios.    

•	[Migrate](https://azure.microsoft.com/blog/resize-virtual-machines/) your workload to another Azure isolated virtual machine. 

For details see below:

## Timeline
| Date | Action | 
| --- | --- |
| November 18, 2019	| Availability of D/DS15i_v2 (PAYG, 1-year RI) |
| May 14, 2020	| Last day to buy D/DS15i_v2 1-year RI | 
| May 15, 2020	 | D/DS15_v2 isolation guarantee removed | 
| May 15, 2021	| Retire D/DS15i_v2 (all customers except who bought 3-year RI of D/DS15_v2 before November 18, 2019)| 
| November 17, 2022	 | Retire D/DS15i_v2 when 3-year RIs done (for customers who bought 3-year RI of D/DS15_v2 before November 18, 2019) | 

## FAQ
### Q: Is the size D/DS15_v2 going to get retired?
**A**: No, only "isolation" feature is going to get retired. If you do not need isolation, you do not need to take any action.

### Q: Is the size D/DS15i_v2 going to get retired?
**A**: Yes, the size is only available until May 15,2021. For customers who have bought 3-year RIs on D/DS15_v2 before November 18, 2019 will have access to D/DS15i_v2 until November 17, 2022.

### Q: Why am I not seeing the new D/DS15i_v2 sizes in the portal?
**A**: If you are a current D/DS15_v2 customer and want to use the new D/DS15i_v2 sizes, fill this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR0FTPNXHdWpJlO27GE-bHitUMkZUWEFPNjFPNVgyMkhZS05FSzlPTzRIOS4u)

### Q: Why I am not seeing any quota for the new D/DS15i_v2 sizes?
**A**: If you are a current D/DS15_v2 customer and want to use the new D/DS15i_v2 sizes, fill this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR0FTPNXHdWpJlO27GE-bHitUNU1XUkhZWkNXQUFMNEJWUk9VWkRRVUJPMy4u)

### Q: When are the other isolated sizes going to retire?
**A**: We will provide reminders 12 months in advance of the official decommissioning of the sizes.

### Q: Is there a downtime when my vm lands on a non-isolated hardware?
**A**: If you do not need isolation, you do not need to take any action and you would not see any downtime.

### Q: Are there any cost changes for moving to a non-isolated virtual machine?
**A**: No 

### Q: I already purchased 1- or 3-year Reserved Instance for D15_v2 or Ds15_v2. How will the discount be applied to my VM usage?
**A**: 
RIs purchased before November 18, 2019 will automatically extend coverage to the new isolated VM series. 

| RI |	Instance Size Flexibility |	Benefit eligibility |	
| --- | --- | --- |
|	D15_v2 	|	Off 	|	D15_v2 and D15i_v2 |	
|	D15_v2 	|	On 	|	D15_v2 series and D15i_v2 will all receive the RI benefit. |	
|	D14_v2 	|	On 	|	D15_v2 series and D15i_v2 will all receive the RI benefit. |	
 
Likewise for Dsv2 series.
 
### Q: I want to purchase additional Reserved Instances for Dv2. Which one should I choose?
**A**: All RIs purchased after Nov 18, 2019, have the following behavior. 

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
**A**: This action is not necessary since the benefit will apply to both isolated and non-isolated sizes. But Azure will support changing existing D15_v2/DS15_v2 Reserved Instances to D15i_v2/DS15i_v2. For all other Dv2/Dsv2 Reserved Instances, use the existing Reserved Instance or buy new Reserved Instances for the isolated sizes.

### Q: I'm an Azure Service Fabric Customer relying on the Silver or Gold Durability Tiers. Does this change impact me?
**A**: No. The guarantees provided by Service Fabric's [Durability Tiers](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster) will continue to function even after this change. If you require physical hardware isolation for other reasons, you may still need to take one of the actions described above. 
