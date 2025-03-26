---
title: Migrate Compute from Amazon Web Services (AWS)
description: Concepts, how-tos, best practices for moving compute from AWS to Azure.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 03/25/2025
ms.topic: conceptual
---

# Migrate compute from Amazon Web Services (AWS)

The articles listed on this page outline scenarios for migrating Amazon Web Services (AWS) compute services to Azure. These cloud resources offer the processing power, memory, and storage necessary for running computational tasks. The migration process involves transitioning these services from AWS to Azure, with a focus on maintaining feature parity.

The scenarios cover common compute types, such as virtual machines (VMs), web applications, and serverless services. For example, a typical migration scenario might involve moving an AWS Lambda to Azure Functions.

## Component comparison

Start the process by comparing AWS compute services used in the workload to their closest Azure counterparts. This helps identify the most suitable Azure services for your migration needs.

* [Compare compute services on Azure and AWS](/azure/architecture/aws-professional/compute)

> [!NOTE]
> This comparison should not be considered an exact representation of the functionality provided by these services in your workload. 

## Migration scenarios

Refer to the following scenarios as examples for framing your migration process:

| Scenario | Key services | Description |
|----------|--------------|-------------|
| [Migrate AWS event-driven workloads to Azure](/azure/aks/eks-edw-overview) | Amazon Elastic Kubernetes Service (AKS) to Azure Kubernetes Service (AKS) | This scenario involves migrating an EKS event-driven workload with KEDA nad Karpenter to AKS. |
| [Migrate EKS web application workloads to AKS](/azure/aks/eks-web-overview) | Amazon Elastic Kubernetes Service (AKS) to Azure Kubernetes Service (AKS) | This scenario involves migrating an EKS web application to AKS. |
| [Migrate Amazon EC2 instances to Azure](/azure/migrate/tutorial-migrate-aws-virtual-machines) | Amazon EC2 instances -> Azure VMs | This scenario involves migrating AWS EC2 instances to Azure VMs. |

The following list provides additional articles for migrating compute services. These scenarios are platform-agnostic but provide generic guidance for landing the service on Azure.

* [Migrate machines as physical servers to Azure](/azure/migrate/tutorial-migrate-physical-virtual-machines)
* [Assess Hyper-V VMs for migration to Azure](/azure/migrate/tutorial-assess-hyper-v)

## Related workload components

Compute services make up only part of your workload. Explore other components that are part of the migration process:

- [Storage](./migrate-storage-from-aws.md)
- [Databases](./migrate-databases-from-aws.md)

Use the table of contents to explore other articles related to your workload's architecture.
