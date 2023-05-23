---
title: Quality checks
description: Provides an overview of Azure Large Instances for Epic quality checks.
ms.topic: conceptual
ms.date: 04/01/2023
---

# Quality checks performed   
Microsoft operations team performs a series of extensive quality checks to ensure that customers request to run Epic systems on Azure ALI is fulfilled accurately, and infrastructure is healthy before handover. However, customers are advised to perform their own checks to ensure services are provided as requested. Below are few suggested checks:  

## Basic connectivity.  

 

## Latency check.  

 

## Server health check from operating system.  

 

## OS level sanity checks / configuration checks.  

 

  

 

Here are a few areas where quality checks are usually performed by Microsoft teams before the infrastructure handover to the customer.  

 

* Network   

 

* IP blade information.  

 

* Access control list on firewall.               

 

 

* Compute  

 

* number of processors and cores for servers.     

 

* Accuracy of memory size for the assigned server.             

 

* Latest firmware version on the blades.  

 

                

 

## Storage   

 

* size of boot LUN and FC LUNs are as per Epic on Azure Large instances standard configuration.        

 

* SAN configuration.            

 

* required VLANs creation.           



## Next steps

Learn how to identify and interact with ALI instances through the Azure portal.

> [!div class="nextstepaction"]
> [Manage ALI instances through the Azure portal](../../connect-baremetal-infrastructure.md)