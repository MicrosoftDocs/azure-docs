---
 title: include file
 description: include file
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 1/7/2025
 ms.author: anaharris
 ms.custom: include file
---

To prepare for availability zone failure, consider *over-provisioning* the capacity of your service. Over-provisioning allows the solution to tolerate some degree of capacity loss and still continue to function without degraded performance. 

To find out how many instances to over-provision, it's important to know that the platform spreads instances across multiple zones. You need to account for at least the failure of one zone.

Follow these steps to find out the total number of instances you should provision:

1. Determine the number of instances your peak workload requires. In this example, we use two scenarios. One is with 3 instances and one is with 4.
2. Retrieve the over-provision instance count by multiplying the peak workload instance count by a factor of [(zones/(zones-1)]:

>[!NOTE]
>The following table assumes that you're using three availability zones. If you use a different number of availability zones, adjust the formula accordingly.

| Peak workload instance count | Factor of  [(zones/(zones-1)]|Formula| Instances to provision (Rounded) |
|-------|---------|---------|--------|
|3|3/2 or 1.5|(3 x 1.5 = 4.5)|5 instances|
|4|3/2 or 1.5|(4 x 1.5 = 4.5)|6 instances|
