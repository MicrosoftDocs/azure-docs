---
title: Understand platform differences for the event-driven workflow (EDW) workload
description: Learn about the key differences between the AWS and Azure platforms related to the EDW scaling workload.
ms.topic: how-to
ms.date: 06/20/2024
author: JnHs
ms.author: jenhayes
---

# Understand platform differences for the event-driven workflow (EDW) workload

Before you replicate the EDW workload in Azure, ensure you have a solid understanding of the operational differences between the AWS and Azure platforms.

This article walks through some of the key concepts for this workload and provides links to resources for more information.

## Identity and access management

The AWS EDW workload uses an AWS Identity and Access Management (IAM) role that is assumed by the EKS service. This role is assigned to EKS pods to permit access to AWS resources, such as queues or databases, without the need to store credentials.

Azure implements [role-based access control (RBAC)][azure-rbac] differently than AWS. In Azure, role assignments are **associated with a security principal** (user, group, managed identity, or service principal), and that security principal is associated with a resource.

## Authentication between services

The AWS EDW workload uses service communication to connect with a queue and a database. AWS EKS uses `AssumeRole`, a feature of IAM, to acquire temporary security credentials to access AWS users, applications, or services. This implementation allows services to assume an IAM role that grants specific access, providing secure and limited permissions between services.

For Amazon Simple Queue Service (SQS) and Amazon DynamoDB database access using service communication, the AWS workflow uses `AssumeRole` with EKS, which is an implementation of Kubernetes [service account token volume projection][service-account-volume-projection]. In the EKS EDW workload, a configuration allows a Kubernetes service account to assume an AWS Identity and Access Management (IAM) role. Pods that are configured to use the service account can then access any AWS service that the role has permissions to access. In the EDW workload, two IAM policies are defined to grant permissions to access Amazon DynamoDB and Amazon SQS.

With AKS, you can use [Microsoft Entra Managed Identity][entra-managed-id] with [Microsoft Entra Workload ID][entra-workload-id].

A [user-assigned managed identity][uami] is created and granted access to an Azure Storage Table by assigning it the **Storage Table Data Contributor** role. The managed identity is also granted access to an Azure Storage Queue by assigning it the **Storage Queue Data Contributor** role. These role assignments are scoped to specific resources, allowing the managed identity to read messages in a specific Azure Storage Queue and write them to a specific Azure Storage Table. The managed identity is then mapped to a Kubernetes workload identity that will be associated with the identity of the pods where the app containers are deployed. For more information, see [Use Microsoft Entra Workload ID with AKS][use-entra-aks].

On the client side, the Python Azure SDKs support a transparent means of leveraging the context of a workload identity, which eliminates the need for the developer to perform explicit authentication. Code running in a namespace/pod on AKS with an established workload identity can authenticate to external services using the mapped managed identity.

## Resources

The following resources can help you learn more about the differences between AWS and Azure for the technologies used in the EDW workload:

| **Topic**  | **AWS to Azure resource**                         |
|------------|---------------------------------------------------|
| Services | [AWS to Azure services comparison][aws-azure-services]  |
| Identity   | [Mapping AWS IAM concepts to similar ones in Azure][aws-azure-identity] |
| Accounts | [Azure AWS accounts and subscriptions][aws-azure-accounts]   |
| Resource management | [Resource containers][aws-azure-resources]  |
| Messaging | [Amazon SQS to Azure Queue Storage][aws-azure-messaging]  |
| Kubernetes | [AKS for Amazon EKS professionals][aws-azure-kubernetes]   |

## Next steps

> [!div class="nextstepaction"]
> [Rearchitect the workload for AKS][eks-edw-rearchitect]

## Contributors

*This article is maintained by Microsoft. It was originally written by the following contributors*:

- Ken Kilty | Principal TPM
- Russell de Pina | Principal TPM
- Jenny Hayes | Senior Content Developer
- Carol Smith | Senior Content Developer
- Erin Schaffer | Content Developer 2

<!-- LINKS -->
[azure-rbac]: ../role-based-access-control/overview.md
[entra-workload-id]: /azure/architecture/aws-professional/eks-to-aks/workload-identity#microsoft-entra-workload-id-for-kubernetes
[service-account-volume-projection]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection
[entra-managed-id]: /entra/identity/managed-identities-azure-resources/overview
[uami]: /azure/templates/microsoft.managedidentity/userassignedidentities?pivots=deployment-language-bicep
[use-entra-aks]: ./workload-identity-overview.md#how-it-works
[aws-azure-services]: /azure/architecture/aws-professional/services
[aws-azure-identity]: https://techcommunity.microsoft.com/t5/fasttrack-for-azure/mapping-aws-iam-concepts-to-similar-ones-in-azure/ba-p/3612216
[aws-azure-accounts]: /azure/architecture/aws-professional/accounts
[aws-azure-resources]: /azure/architecture/aws-professional/resources
[aws-azure-messaging]: /azure/architecture/aws-professional/messaging#simple-queue-service
[aws-azure-kubernetes]: /azure/architecture/aws-professional/eks-to-aks/
[eks-edw-rearchitect]: ./eks-edw-rearchitect.md
