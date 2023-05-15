---
title: Retrieve load balancer and virtual machine IP information by using Azure Instance Metadata Service
titleSuffix: Azure Load Balancer
description: Get started learning about using Azure Instance Metadata Service to retrieve load balancer information.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: conceptual
ms.date: 05/04/2023
ms.author: mbender
ms.custom: template-concept, engagement-fy23
---

# Retrieve load balancer information by using Azure Instance Metadata Service

IMDS (Azure Instance Metadata Service) provides information about currently running virtual machine instances. The service is a REST API that's available at a well-known, nonroutable IP address (169.254.169.254). 

When you place virtual machine or virtual machine set instances behind an Azure Standard Load Balancer, you can use IMDS to retrieve metadata related to the load balancer and the instances.

The metadata includes the following information for the virtual machines or virtual machine scale sets:

* The instance level Public or Private IP of the specific Virtual Machine instance
* Inbound rule configurations of the load balancer of each private IP of the network interface.
* Outbound rule configurations of the load balancer of each private IP of the network interface.

## Access the load balancer metadata using IMDS

For more information on how to access the load balancer metadata, see [Use Azure Instance Metadata Service to access load balancer information](howto-load-balancer-imds.md).

## Troubleshoot common error codes

For more information on common error codes and their mitigation methods, see [Troubleshoot common error codes when using IMDS](troubleshoot-load-balancer-imds.md). 

## Support

If you're unable to retrieve a metadata response after multiple attempts, create a support issue in the Azure portal.

## Next steps
Learn more about [Azure Instance Metadata Service](../virtual-machines/windows/instance-metadata-service.md)

[Deploy a standard load balancer](quickstart-load-balancer-standard-public-portal.md)

