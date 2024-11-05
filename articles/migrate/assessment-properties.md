---
title: Assessment properties
description: Describes the components of an assessment in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 11/05/2024
---

# General assessment properties 

This article will help you understand the assessment properties on the General tab that you encounter while creating an assessment. The general assessment properties apply to all the workloads in case of an application or cross workload assessment. These properties also apply in case of a workload assessment.  

Setting Category 

Setting 

Details 

Target  

settings 

Target location 

The Azure region to which you want to migrate. Azure target configuration and cost recommendations are based on the location that you specify. 

Target  

settings 

Default Environment 

The environment for the target deployments to apply pricing applicable to Production or Dev/Test. 

Right-Sizing  

Sizing criteria 

This attribute is used for right-sizing the target recommendations.  
Use as-is on-premises sizing if you do not want to right-size the targets and identify the targets according to your configuration for on-premises workloads. Use performance-based sizing to calculate compute recommendation based on CPU and memory utilization data and storage recommendation based on the input/output operations per second (IOPS) and throughput of the on-premises disks. 

 

Performance history 

Used with performance-based sizing. Performance history specifies the duration used when performance data is evaluated. 

 

Percentile utilization 

Used with performance-based sizing. Percentile utilization specifies the percentile value of the performance sample used for rightsizing. Learn more about sampling mechanism. 

 

Comfort factor 

This is the buffer applied during assessment. It's a multiplying factor used with performance metrics of CPU, RAM, disk, and network data for VMs. It accounts for issues like seasonal usage, short performance history, and likely increases in future usage. The comfort factor is applied irrespective of type of assessment (As-is on premises or performance based). In the case of performance-based assessment, it is multiplied with utilization value of the resources, whereas in case of As-is on premises assessment it is multiplied by allocated resources.  
The default values change  
 
For example, a 10-core VM with 20% utilization normally results in a two-core VM. With a comfort factor of 2.0, the result is a four-core VM instead. 

Pricing settings 

Default savings option  

Specify the savings option that you want the assessment to consider to help optimize your Azure compute cost. 
 
Azure reservations (1 year or 3 year reserved) are a good option for the most consistently running resources. 
 
Azure Savings Plan (1 year or 3 year savings plan) provide additional flexibility and automated cost optimization.  
When you select 'None', the Azure compute cost is based on the Pay as you go rate considering 730 hours as VM uptime, unless specified otherwise in VM uptime attribute.  
 
 

 

Program/ Offer 

The Azure offer in which you're enrolled. The assessment estimates the cost for that offer. Select one of Pay-as-you Go, Enterprise Agreement support or Pay-as-you Go Dev/Test.   

You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than 'None', the 'Discount (%)' and 'VM uptime' properties are not applicable. The monthly cost estimates are calculated by multiplying 744 hours in the VM uptime field with the hourly price of the recommended SKU. 
 
If you have an Enterprise Agreement with Microsoft, please select Enterprise Agreement support and specify the subscription id you would like to be used to fetch negotiated prices. Please refer cost estimation for more details.   

 

Currency 

The billing currency for your account. 

 

Discount (%) 

Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%. 

 

VM uptime 

The duration in days per month and hours per day for Azure VMs that won't run continuously. Cost estimates are based on that duration. 
The default values are 31 days per month and 24 hours per day. 

 

Azure Hybrid Benefit 

Specify whether you already have a Windows Server and/or SQL Server license or Enterprise Linux subscription (RHEL and SLES). Azure Hybrid Benefit is a licensing benefit that helps you to significantly reduce the costs of running your workloads in the cloud. It works by letting you use your on-premises Software Assurance-enabled Windows Server and SQL Server licenses on Azure. For example, if you have a SQL Server license and they're covered with active Software Assurance of SQL Server Subscriptions, you can apply for the Azure Hybrid Benefit when you bring licenses to Azure. 

Security 

Security 

Specifies whether you want to assess readiness and cost for security tooling on Azure. If the setting has the default value Yes, with Microsoft Defender for Cloud, it will assess security readiness and costs for your Azure VM with Microsoft Defender for Cloud. 

 