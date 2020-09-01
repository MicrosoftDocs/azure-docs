---
title: Understanding Pricing - Azure Application Gateway
description: This article describes the billing process for Azure Application Gateway and Web Application Firewall for both v1 to v2 SKUs
services: application-gateway
author: azhar2005
ms.service: application-gateway
ms.topic: conceptual
ms.date: 09/01/2020
ms.author: azhussai
---

# Understanding Pricing for Azure Application Gateway and Web Application Firewall

Azure Application Gateway is a layer 7 load-balancing solution, which enables scalable, highly available, and secure web application delivery on Azure.

There are no upfront costs or termination costs associated with Application Gateway.
You will be billed only for the resources pre-provisioned and utilized based on actual consumption calculated on a partial hour basis. Costs associated with Application Gateway are classified into two components: fixed costs and variable costs. Actual costs within each component will vary according to the SKU being utilized.

This article describes the costs associated with each SKU and it is recommended that users utilize this document for planning and managing costs associated with the Azure Application Gateway.


## V1 SKUs

Standard Application Gateway and WAF V1 SKUs are billed as a combination of:

1. Fixed Costs (Tier | Size | Instance Count
Cost based on the time a particular type of Application Gateway/WAF is provisioned and running for processing requests.
The fixed cost component takes in consideration the following factors:
    * Tier - Standard Application Gateway or WAF
    * Size - Small, Medium & Large
    * Instance Count - Number of instances to be deployed

    For N instances, the costs associated will be N * cost of one Instance of a particular Tier(Standard & WAF) & Size(Small, Medium & Large) combination.

2. Variable Costs – Cost based on the amount of data processed by the Application Gateway/WAF. Both the request and response bytes processed by the Application Gateway would be considered for billing.

Total Costs = Fixed Costs + Variable Costs

### Standard Application Gateway

Fixed Costs & Variable Costs will be calculated according to the Application Gateway type.
The following table shows example prices based on a snapshot of East US pricing and are meant for illustration purposes only.

#### Fixed Costs (East US region pricing)

|              Application Gateway Type             |  Costs ($/hr)  |
| ------------------------------------------------- | ---------------|
|                     Small                         |    $0.025      |
|                     Medium                        |    $0.07       |
|                     Large                         |    $0.32       |

Monthly price estimates are based on 730 hours of usage per month.

#### Variable Costs (East US region pricing)

|              Data Processed             |  Small ($/GB)  |  Medium ($/GB) |  Large ($/GB) |
| --------------------------------------- | -------------- | -------------- | ------------- |
| First 10 TB/month                       |     $0.008     |      Free      |     Free      |
| Next 30 TB (10–40 TB)/month             |     $0.008     |     $0.007     |     Free      |
| Over 40 TB/month                        |     $0.008     |     $0.007     |     $0.0035   |

For more pricing information according to your region, see the [pricing page](https://azure.microsoft.com/pricing/details/application-gateway/).

### WAF V1 

Fixed Costs & Variable Costs will be calculated according to the provisioned Application Gateway type.

The following table shows example prices based on a snapshot of East US pricing and are for illustration purposes only.

#### Fixed Costs (East US region pricing)

|              Application Gateway Type             |  Costs ($/hr)  |
| ------------------------------------------------- | ---------------|
|                     Small                         |       NA       |
|                     Medium                        |     $0.126     |
|                     Large                         |     $0.448     |

Monthly price estimates are based on 730 hours of usage per month.

#### Variable Costs (East US region pricing)

|              Data Processed             |  Small ($/GB)  |  Medium ($/GB) |  Large ($/GB) |
| --------------------------------------- | -------------- | -------------- | ------------- |
| First 10 TB/month                       |     $0.008     |      Free      |     Free      |
| Next 30 TB (10–40 TB)/month             |     $0.008     |     $0.007     |     Free      |
| Over 40 TB/month                        |     $0.008     |     $0.007     |     $0.0035   |

For more pricing information according to your region, see the [pricing page](https://azure.microsoft.com/pricing/details/application-gateway/).

> [!NOTE]
> Outbound data transfers - data going out of Azure data centers from application gateways will be charged at standard [data transfer rates](https://azure.microsoft.com/en-us/pricing/details/bandwidth/).

### Example 1 (a) – Standard Application Gateway with 1 instance count

Let’s assume you’ve provisioned a standard Application Gateway of medium type with One instance count and it processes 500 GB in a month. 
Your Application Gateway costs using the pricing mentioned above would be calculated as follows:

Fixed Price = $0.07 * 730 (Hours) =  $51.1
Monthly price estimates are based on 730 hours of usage per month.

Variable Costs = Free (Medium tier has no costs for the first 10 TB processed per month)
Total Costs = $51.1 + 0 = $51.1 

> [!NOTE]
> To support high availability scenarios, it is required to setup a minimum of 2 instances for V1 SKUs.

### Example 1 (b) – Standard Application Gateway with > 1 instance count

Let’s assume you’ve provisioned a standard Application Gateway of medium type with five instance count and it processes 500 GB in a month. 
Your Application Gateway costs using the pricing mentioned above would be calculated as follows:

Fixed Price = 5 (Instance count) * $0.07 * 730 (Hours) =  $255.5
Monthly price estimates are based on 730 hours of usage per month.

Variable Costs = Free (Medium tier has no costs for the first 10 TB processed per month)
Total Costs = $255.5 + 0 = $255.5 

### Example 2 – WAF Application Gateway

Let’s assume you’ve provisioned a small type standard Application Gateway and a large type WAF Application Gateway for the first 15 days of the month. The small application gateway processes 15 TB in the duration that it is active and the large WAF application gateway processes 100 TB in the duration that it is active. 
Your Application Gateway costs using the pricing mentioned above would be calculated as follows: 

###### Small Instance standard Application Gateway

24 Hours * 15 Days = 360 Hours

Fixed Price = $0.025 * 360 (Hours) =  $9

Variable Costs = 10 * 1000 *  $0.008/GB + 5 * 1000 * $0.008/GB  = $120


Total Costs = $9 + $120 = $129

###### Large Instance WAF Application Gateway
24 Hours * 15 Days = 360 Hours

Fixed Price = $0.448  * 360 (Hours) =  $161.28

Variable Costs = 60 * 1000 * $0.0035/GB  = $210 (Large tier has no costs for the first 40 TB processed per month)

Total Costs = $161.28 + $210 = $371.28

## V2 SKUs  

Application Gateway V2 and WAF V2 instances support autoscaling and guarantee high availability as a default.

### Key Terms

##### Capacity Unit 
Capacity Unit is the measure of processing capacity for an Application Gateway instance across multiple parameters. 

A Capacity Unit is defined with the following limits across different parameters:
* 2500 Persistent connections
* 2.22-Mbps throughput
* 1 Compute Unit

The parameter with the highest utilization among the three above will be internally used for calculating capacity units, which is in turn billed.

##### Compute Unit
Compute Unit is the measure of processor capacity consumed. Factors affecting compute unit consumption are TLS connections/sec, URL Rewrite computations, and WAF rule processing. The number of requests a compute unit can handle depends on various criteria like TLS certificate key size, key exchange algorithm, header rewrites, and in case of WAF - incoming request size.

Compute unit guidance:
* Standard_v2 - Each compute unit is capable of approximately 50 connections per second with RSA 2048-bit key TLS certificate.

* WAF_v2 - Each compute unit can support approximately 10 concurrent requests per second for 70-30% mix of traffic with 70% requests less than 2 KB GET/POST and remaining higher. WAF performance is not affected by response size currently.

##### Instance Count 
 Pre-provisioning of resources for Application Gateway V2 SKUs is defined in terms of Instance counts. Each Instance count guarantees a minimum of 10 capacity units in terms of processing capability. The same instance could potentially support more than 10 capacity units for different traffic patterns depending upon the Capacity Unit parameters.

Manually defined scale and limits set for autoscaling (minimum or maximum) are set in terms of Instance Count. The manually set scale for instance count and the minimum instance count in autoscale config will reserve 10 capacity units/Instance. These reserved CUs will be billed as long as the Application Gateway is active regardless of the actual resource consumption. If actual consumption crosses the 10 capacity units/Instance threshold, additional capacity units will be billed under the variable component.

V2 SKUs are billed based on the consumption and constitute of two parts:

1. Fixed Costs - Cost based on the time the Application Gateway V2 /WAF V2 is provisioned and available for processing requests. This ensures high availability - even if 0 instances are reserved by specifying 0 in minimum scale units as part of autoscaling. 
    
    The fixed cost also includes the cost associated with the public IP attached to the Application Gateway.

    The number of instances running at any point of time is not considered as a factor for fixed costs for V2 SKUs. The fixed costs of running a Standard_V2 (or WAF_V2) would be same per hour regardless of the number of instances running within the same Azure region.

2. Capacity Unit Costs – Cost based on the number of capacity units either reserved or created with autoscaling as required for processing the incoming requests.  Consumption based costs are computed hourly or partial hourly.

Total Costs = Fixed Costs + Capacity Unit Costs

The following table shows example prices based on a snapshot of East US pricing and are for illustration purposes only.

#### Fixed Costs

|              V2 SKU             |  Costs ($/hr)  |
| ------------------------------- | ---------------|
|            Standard_V2          |     $0.246     |
|              WAF_V2             |     $0.443     |

Monthly price estimates are based on 730 hours of usage per month.

#### Variable Costs

|        Capacity Unit         |  Standard_V2 ($/hr)  |  WAF_V2 ($/hr) |
| ---------------------------- | -------------------- | -------------- |
|             1 CU             |        $0.008        |     $0.0144    |

For more pricing information according to your region, see the [pricing page](https://azure.microsoft.com/pricing/details/application-gateway/).

> [!NOTE]
> Outbound data transfers - data going out of Azure data centers from application gateways will be charged at standard [data transfer rates](https://azure.microsoft.com/en-us/pricing/details/bandwidth/).

### Example 1 (a) – Manual Scaling 
Let’s assume you’ve provisioned a Standard_V2 Application Gateway with manual scaling set to 8 scale units for the entire month. During this time, it receives an average of 88.8-Mbps data transfer.

Your Application Gateway costs using the pricing mentioned above would be calculated as follows:

1 CU can handle 2.22-Mbps throughput.

CUs required to handle 88.8 Mbps = 88.8 / 2.22 = 40 CUs 

Pre-provisioned CUs = 8 (Instance count) * 10 = 80 

Since 80 (reserved capacity) > 40 (required capacity), no additional CUs are required. 

Fixed Price = $0.246  * 730 (Hours) =  $179.58

Variable Costs = $0.008 * 8 (Instance Units) * 10(capacity units) * 730 (Hours) = $467.2

Total Costs = $179.58 + $467.2 = $646.78

![Diagram of Manual-scale 1.](./media/pricing/manual-scale-1.png)

### Example 1 (b) – Manual Scaling With traffic going beyond set capacity

Let’s assume you’ve provisioned a Standard_V2 Application Gateway with manual scaling set to 3 scale units for the entire month. During this time, it receives an average of 88.8-Mbps data transfer.

Your Application Gateway costs using the pricing mentioned above would be calculated as follows:

1 CU can handle 2.22 Mbps throughput.

CUs required to handle 88.8 Mbps = 88.8 / 2.22 = 40 

Pre-provisioned CUs = 3 (Instance count) * 10 = 30 

Since 40 (required capacity) > 30 (reserved capacity), additional CUs are required.
The number of additional CUs utilized would depend on the free capacity available with each instance.

If processing capacity equivalent to 5 additional CUs was available for use within the 3 reserved instances.

Fixed Price = $0.246  * 730 (Hours) =  $179.58

Variable Costs = $0.008 * ( 3(Instance Units) * 10(capacity units) + 5 (additional capacity units) ) * 730 (Hours) = $204.4

Total Costs = $179.58 + $204.4 = $383.98

![Diagram of Manual-scale 2.](./media/pricing/manual-scale-2.png)

> [!NOTE]
> In case of Manual Scaling, any additional requests exceeding the maximum processing capacity of the reserved instances will be dropped. In situations of high load, reserved instances may be able to provide more than 10 Capacity units of processing capacity depending upon the configuration and type of incoming requests.

### Example 2 – WAF_V2 instance with Autoscaling

Let’s assume you’ve provisioned a WAF_V2 with autoscaling enabled and set the minimum scale unit config to 6 Units for the entire month. The request load has caused the WAF instance to scale up and utilize 65 Capacity units(scale up of 5 capacity units, while 60 units were reserved) for the entire month.
Your Application Gateway costs using the pricing mentioned above would be calculated as follows:

Monthly price estimates are based on 730 hours of usage per month.

Fixed Price = $0.443   * 730 (Hours) =  $323.39

Variable Costs = $0.0144  * 65(capacity units) * 730 (Hours) = $683.28

Total Costs = $323.39 + $683.28 = $1006.67

![Diagram of Auto-scale 2.](./media/pricing/auto-scale-1.png)

> [!NOTE]
> Actual Traffic observed for your Application Gateway is unlikely to have such a constant pattern of traffic and the observed load on your Application Gateway would fluctuate according to actual usage.

### Example 3 (a) – WAF_V2 instance with Autoscaling and 0 Min scale config

Let’s assume you’ve provisioned a WAF_V2 with autoscaling enabled and set the minimum scale unit config to 0 Units for the entire month. The request load on the WAF is minimum but consistently present per hour for the entire month. The load is below the capacity of a single capacity unit.
Your Application Gateway costs using the pricing mentioned above would be calculated as follows:

Monthly price estimates are based on 730 hours of usage per month.

Fixed Price = $0.443   * 730 (Hours) =  $323.39

Variable Costs = $0.0144  * 1(capacity units) * 730 (Hours) = $10.512

Total Costs = $323.39 + $10.512 = $333.902

### Example 3 (b) – WAF_V2 instance with Autoscaling with 0 Min scale config 

Let’s assume you’ve provisioned a WAF_V2 with autoscaling enabled and set the minimum scale unit config to 0 Units for the entire month. However, there is 0 traffic directed to the WAF instance for the entire month.
Your Application Gateway costs using the pricing mentioned above would be calculated as follows:

Fixed Price = $0.443   * 730 (Hours) =  $323.39

Variable Costs = $0.0144  * 0(capacity units) * 730 (Hours) = $0

Total Costs = $323.39 + $0 = $323.39

### Example 3 (C) – WAF_V2 instance with manual scale set to 1 instance

Let’s assume you’ve provisioned a WAF_V2 and set it to manual scaling with the minimum acceptable value of 1 Instance Unit for the entire month. However, there is 0 traffic directed to the WAF instance for the entire month.
Your Application Gateway costs using the pricing mentioned above would be calculated as follows:

Monthly price estimates are based on 730 hours of usage per month.

Fixed Price = $0.443   * 730 (Hours) =  $323.39

Variable Costs = $0.0144  * 1(Instance count) * 10(capacity units) * 730 (Hours) = 
$105.12 (1 Instance unit is reserved)

Total Costs = $323.39 + $105.12 = $428.51

### Example 4 – WAF_V2 with Autoscaling, capacity unit calculations

Let’s assume you’ve provisioned a WAF_V2 with autoscaling enabled and set the minimum Instance Count config to 0 for the entire month. During this time, it receives 25 new TLS connections/sec with an average of 8.88-Mbps data transfer.
Your Application Gateway costs using the pricing mentioned above would be calculated as follows:

Monthly price estimates are based on 730 hours of usage per month.

Fixed Price = $0.443 * 730 (Hours) =  $323.39

Variable Costs = $0.0144  * 730 (Hours) * {Max (25/50, 8.88/2.22)} = $23.36 (4 Capacity units required to handle 8.88 Mbps)

Total Costs = $323.39 + $23.36 = $346.75

### Example 5 (a) – Standard_V2 with Autoscaling, time-based calculations

Let’s assume you’ve provisioned a standard_V2 with autoscaling enabled and set the minimum scale unit config to 0 Units. This application gateway instance is active for 2 hours.
During the first hour, it receives traffic that can be handled by 10 Capacity Units and during the second hour it receives traffic that required 20 Capacity Units to handle the load.
Your Application Gateway costs using the pricing mentioned above would be calculated as follows:

Fixed Price = $0.246  * 2 (Hours) =  $0.492

Variable Costs = $0.008  * 10(capacity units) * 1 (Hours)  + $0.008  * 20(capacity 
units) * 1 (Hours)  = $0.24

Total Costs = $0.492 + $0.24 = $0.732