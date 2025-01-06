To prepare for availability zone failure, you should over-provision capacity of service. Over-provisioning allows the solution to tolerate 30% capacity loss and still continue to function without degraded performance. 

Follow these steps to find out how many instances you should provision:

1. Determine the number of instances your peak workload requires. In this example, we use two scenarios. One is with 3 instances and one is with 4.
2. Retrieve the over-provision instance count by multiplying the peak workload instance count by a factor of [(zones/(zones-1)]:

| Peak workload instance count | Factor of  [(zones/(zones-1)]|Formula| Instances to provision (Rounded) |
|-------|---------|---------|--------|
|3|3/2 or 1.5|(3 x 1.5 = 4.5)|5 instances|
|4|3/2 or 1.5|(4 x 1.5 = 4.5)|6 instances|
