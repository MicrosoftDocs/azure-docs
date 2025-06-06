---
title: Migrate Compute from Amazon Web Services to Azure
description: Learn how to migrate AWS compute services to Azure, including maintaining feature parity and exploring scenarios like VMs, web apps, and serverless functions.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 03/25/2025
ms.topic: conceptual
ms.collection:
 - migration
 - aws-to-azure
---

# Migrate compute from Amazon Web Services to Azure

This article describes scenarios that you can use to migrate Amazon Web Services (AWS) compute services to Azure. These cloud services provide the processing power, memory, and storage necessary to run computational tasks. The migration process involves transitioning these services from AWS to Azure, with a focus on maintaining feature parity.

The scenarios cover common compute types, such as virtual machines (VMs), web applications, and serverless services. For example, a typical migration scenario might involve moving a serverless application from AWS Lambda to Azure Functions.

## Component comparison

To begin the process, compare the AWS compute services that a workload uses with their closest Azure counterparts. This evaluation helps identify the most suitable Azure services for your migration needs. For more information, see [Compare compute services on Azure and AWS](/azure/architecture/aws-professional/compute).

> [!NOTE]
> This comparison isn't an exact representation of the functionality that these services provide in your workload.

## Migration scenarios

Use the following scenarios as examples for your migration process:

| Scenario | Key services | Description |
|----------|--------------|-------------|
| [Migrate AWS event-driven workloads to Azure](/azure/aks/eks-edw-overview) | Amazon Elastic Kubernetes Service (EKS) to Azure Kubernetes Service (AKS) | This scenario involves migrating an EKS event-driven workload that includes Kubernetes Event-Driven Autoscaling (KEDA) and Karpenter to AKS. |
| [Migrate EKS web application workloads to AKS](/azure/aks/eks-web-overview) | Amazon EKS to AKS | This scenario involves migrating an EKS web application to AKS. |
| [Migrate Amazon EC2 instances to Azure](/azure/migrate/tutorial-migrate-aws-virtual-machines) | Amazon EC2 instances to Azure VMs | This scenario involves migrating AWS EC2 instances to Azure VMs. |
| [Migrate AWS Lambda to Azure Functions](/azure/azure-functions/migration/lambda-functions-migration-overview) | AWS Lambda to Azure Functions | This scenario involves migrating serverless applications from AWS Lambda to Azure Functions. |

Consider the following articles when you migrate compute services. The platform-agnostic, generic scenarios in these articles can help you deploy services on Azure.

- [Migrate machines as physical servers to Azure](/azure/migrate/tutorial-migrate-physical-virtual-machines)
- [Assess Hyper-V VMs for migration to Azure](/azure/migrate/tutorial-assess-hyper-v)
- [Migrate VMware services to Azure](/azure/migrate/vmware/migrate-support-matrix-vmware)

## Related workload components

Compute services make up only part of your workload. Explore other components that you might migrate:

- [Databases](migrate-databases-from-aws.md)
- [Storage](migrate-storage-from-aws.md)
- [Networking](migrate-networking-from-aws.md)
- [Security](migrate-security-from-aws.md)