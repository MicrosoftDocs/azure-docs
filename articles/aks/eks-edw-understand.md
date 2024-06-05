---
title: Understand platform differences for the event-driven workflow (EDW) workload
description: Become familiar with key differences in how the AWS and Azure platforms operate that are relevant to the EDW scaling workload.
ms.topic: how-to
ms.date: 05/22/2024
author: JnHs
ms.author: jenhayes
---

# Understand platform differences for the event-driven workflow (EDW) workload

Before you replicate the EDW workload in Azure, ensure you have a good grasp of the distinctive operational nuances between the AWS and Azure platforms, especially those areas that are relevant to how the workload operates.

This article walks through some of the key concepts that are especially useful to understand, and provides links to resources for further learning.

## Identity and access management

The AWS EDW workload uses AWS resource policies that assign AWS Identity and Access Management (IAM) roles to code running in Kubernetes pods on EKS. These roles allow those pods to access external resources such as queues or databases.

Azure implements [role-based access control (RBAC)](/azure/role-based-access-control/overview) differently that AWS. Both AWS and Azure allow you to control permissions on resources at a given level of scope, but they achieve this in different ways. In Azure, role assignments are associated with a security principal (user, group, managed identity, or service principal) and that security principal is associated with a resource.

## Authentication between services

The AWS EDW workload uses service-to-service authentication to connect with a queue and a database. AWS EKS utilizes `AssumeRole`, a feature of IAM, to delegate permissions to AWS services and resources. This allows services to assume an IAM role that grants specific access rights, ensuring secure and limited interactions between services.

In Azure, [Azure Kubernetes Service (AKS) uses Microsoft Entra Workload ID](/azure/architecture/aws-professional/eks-to-aks/workload-identity#microsoft-entra-workload-id-for-kubernetes) for applications running on AKS to authenticate to Azure services using the identity of the workload.

For both Amazon Simple Queue Service (SQS) and DynamoDB database access using service-to-service authentication, the AWS workflow uses `AssumeRole` in conjunction with EKS, which is an implementation of Kubernetes [service account token token volume projection](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection). In AWS, when an entity assumes an IAM role, the entity temporarily gains some extra permissions. This way, the entity can perform actions and access resources granted by the assumed role, without changing their own permissions permanently. After the assumed role's session token expires, the entity loses the extra permissions. An IAM policy is deployed that permits code running in an EKS pod to authenticate to the DynamoDB as described in the policy definition.

In Azure, there is no direct equivalent to AWS IAM `AssumeRole`. When using AKS, a similar effect can be achieved through [Entra Managed Identity](/entra/identity/managed-identities-azure-resources/overview) in conjunction with [Microsoft Entra Workload ID with AKS)](/azure/aks/workload-identity-overview). Essentially, a security principal [user-assigned managed identity](/azure/templates/microsoft.managedidentity/userassignedidentities?pivots=deployment-language-bicep) resource is created with a display name such as `PodAppWriter`. This `PodAppWriter` identity is granted permission to write to a table in Azure Cosmos DB via an Azure built-in role such as [Cosmos DB Built-in Data Contributor](/azure/cosmos-db/how-to-setup-rbac#built-in-role-definitions). The `PodAppWriter` identity is then mapped to a Kubernetes federated identity credential. For a full explanation of how this works in AKS, see [Use Microsoft Entra Workload ID with AKS](/azure/aks/workload-identity-overview?tabs=dotnet#how-it-works).

On the client side, the Python Azure SDKs support a transparent means of leveraging the context of a workload identity, which eliminates the need for the developer to perform explicit authentication. Code running in a namespace/pod on AKS that has a workload identity established will be able to authenticate to external services such as Cosmos DB using the mapped managed identity principal. For more information, see [WorkloadIdentityCredential Class](/python/api/azure-identity/azure.identity.workloadidentitycredential).

## For further learning

The following resources can help you learn more about the differences between AWS and Azure for the technologies that are used in the EDW workload:

| **Topic**  | **AWS to Azure resource**                         |
|------------|---------------------------------------------------|
| Services | [AWS to Azure Services Comparison](/azure/architecture/aws-professional/services)   |
| Identity   | [Mapping AWS IAM concepts to similar ones in Azure](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/mapping-aws-iam-concepts-to-similar-ones-in-azure/ba-p/3612216) |
| Accounts | [Azure AWS Accounts and Subscriptions](/azure/architecture/aws-professional/accounts)   |
| Resource management | [Resource Containers](/azure/architecture/aws-professional/resources)   |
| Messaging | [AWS SQS to Azure Queue Storage](/azure/architecture/aws-professional/messaging#simple-queue-service)   |
| NoSQL | [AWS DynamoDB to CosmosDB](/azure/cosmos-db/nosql/dynamo-to-cosmos)   |
| Kubernetes | [AKS for Amazon EKS professionals](/azure/architecture/aws-professional/eks-to-aks/)    |

## Next step

- Learn how to [rearchitect the event-driven workflow (EDW) scaling workload for Azure](eks-edw-rearchitect.md).
