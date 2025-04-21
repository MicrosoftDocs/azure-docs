---
title: Migrate to Azure Container Apps
description: Describes migrating to Azure Container Apps.
author: KarlErickson
ms.author: karler
ms.reviewer: dingmeng-xue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 03/17/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate to Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

Azure Spring Apps and Azure Container Apps are both managed platforms on Azure designed to simplify running applications without managing complex infrastructure. Both services enable developers to focus on their applications rather than worrying about underlying systems setup and maintenance. They integrate natively with the Azure ecosystem, making it easy to connect with services like Azure Monitor, Key Vault, and Azure DevOps for monitoring, security, and deployment.

Due to the retirement of Azure Spring Apps, we recommend Azure Container Apps as the primary service for your migration of workloads running on Azure Spring Apps. Azure Container Apps provides a modern, flexible, and scalable foundation for containerized applications, ensuring your workloads are future-ready and seamlessly integrated with the Azure ecosystem.

This article provides a detailed guide to assist you in migrating your workloads from Azure Spring Apps to Azure Container Apps, minimizing disruption and helping you maximize the benefits of the new platform.

## Concept mapping

Following concept mapping table highlights the parallels between Azure Spring Apps and Azure Container Apps. It helps you understand how familiar concepts in Azure Spring Apps translate to equivalent features in Azure Container Apps.

:::image type="content" source="media/migrate-to-azure-container-apps-overview/concept-mapping.png" alt-text="Diagram of the concept mapping between Azure Spring Apps and Azure Container Apps.":::

| Azure Spring Apps service                                                                                            | Azure Container Apps service                                                                                                                                                                   |
|----------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A *Service instance* hosts and secures a boundary for apps and other resources, and supports custom virtual network. | An *Environment* establishes a secure boundary for container applications and supports custom virtual networks.                                                                                |
| An *App* is one business app that serves as a child resource within a service instance.                              | A *Container App* is one business app, defined as an independent Azure resource connecting to a managed environment.                                                                           |
| A *Deployment* is the version of an App. An app can have one production deployment and one staging deployment.       | A *Revision* is an immutable snapshot of each version of a container app. A container app can have one or multiple revisions.                                                                  |
| An *Application instance* is the minimum runtime unit managed by the service.                                        | *Containers (Replica)* is a set of containers and the minimum runtime unit. You can configure multiple containers together, including sidecar and init containers, to serve one container app. |

## Azure role-based access control settings

Azure Spring Apps and Azure Container Apps both support Azure role-based access control (RBAC) settings. However, their experiences differ because of their distinct resource hierarchies.

In Azure Spring Apps, the resource hierarchy is centered around the service instance. Role assignments apply to the instance and automatically propagate to child resources, such as apps and deployments. This design provides centralized management. However, if a user needs access to a specific app or deployment rather than the service instance, you must grant specific permissions for those resources.

From an API perspective, Azure Container Apps designs the resource types for environments and container apps as separate, independent entities at the same hierarchical level. You can assign roles at the level of the managed environment or individual container apps. This structure enables precise control over specific applications. For example, you can grant access to different container apps for different teams or individuals. This flexibility makes it easier to manage resources independently in a shared environment. It also aligns well with the familiar experience of managing other Azure resources.

## Migration approach

The migration approach from Azure Spring Apps to Azure Container Apps involves the following key steps:

:::image type="content" source="media/migrate-to-azure-container-apps-overview/migration-steps.png" alt-text="Diagram of the migration steps described in this article.":::

1. Assess and plan: Evaluate your current workloads on Azure Spring Apps, including dependencies, configurations, and network settings.

1. Containerize applications: Although Azure Container Apps supports deploying from JAR or source code, we recommend that you containerize applications into Docker containers, which have better portability and efficiency. You can containerize applications by creating Dockerfiles and building container images using tools like Azure Container Registry or Docker Hub. You can also build container images by buildpacks locally. To learn how to containerize your application and build a container image similar to the one running in Azure Spring Apps, see [Overview of Containerization](./containerization-overview.md).

1. Set up the Azure Container Apps environment: Provision a managed environment in Azure Container Apps, including configuring virtual networks, subnets, and any necessary security settings to match your previous network configurations in Azure Spring Apps. For more information, see [Provision Azure Container Apps](./migrate-to-azure-container-apps-provision.md) or [Migrating custom Virtual Network](./migrate-to-azure-container-apps-network.md).

1. Create and configure Java components in Azure Container Apps: Enable and configure Eureka Server, Config Server, Gateway, and Managed Admin. These components are essential for microservices orchestration and management in Spring applications. Ensure that they're configured properly for a seamless transition.

   If you use the Enterprise plan, consult the following articles:

   - [Tanzu Service Registry](./migrate-to-azure-container-apps-components-eureka.md)
   - [Application Configuration Service for Tanzu](./migrate-to-azure-container-apps-components-config-server.md) or [Config Server](./migrate-to-azure-container-apps-components-config-server.md)
   - [Spring Cloud Gateway for Tanzu](./migrate-to-azure-container-apps-components-gateway.md)
   - [Application Live View](./migrate-to-azure-container-apps-components-live-view.md)
   - [API Portal for Tanzu](./migrate-to-azure-container-apps-components-api-portal.md)

   If you use the Standard plan, consult the following articles:

   - [Eureka Server](./migrate-to-azure-container-apps-components-eureka.md)
   - [Config Server](./migrate-to-azure-container-apps-components-config-server.md)

1. Deploy containers: Deploy the containerized applications to the Azure Container Apps environment. Set up application revisions, scaling policies, and networking configurations according to your requirements. For more information, see [Overview of Application Migration](./migrate-to-azure-container-apps-application-overview.md).

1. Monitor: During migration, continuously monitor application performance using Azure Monitor and adjust configurations as needed for optimization, such as adjusting scaling settings or resource allocations. For more information, see [Log and Metrics in Azure Container Apps](./migrate-to-azure-container-apps-monitoring.md).

1. Test and validate: Run thorough tests to ensure the containerized applications function as expected in the new environment. Verify network connectivity, scaling, and integration with other services.

1. Client and automation tools: To streamline daily development and operational tasks, take advantage of client tools and automation solutions. These tools include the Azure CLI, Azure DevOps, GitHub Actions, and extensions in client tools or IDEs. These tools can help automate deployments, monitor performance, and manage resources efficiently, reducing manual effort and enhancing operational agility. To learn about popular tools, see [Clients or automation tools for Azure Container Apps](./migrate-to-azure-container-apps-automation.md).

## Migration assistant tool

To speed up your migration and help you evaluate features on Azure Container Apps, we provide a new command in the Azure CLI. This command retrieves the configurations of existing Azure Spring Apps resources based on the resource ID of the service instance. It then translates these configurations into Bicep files for Azure Container App resources. This method enables you to quickly set up an Azure Container Apps managed environment and app resources while applying basic settings similar to those settings in your existing Azure Spring Apps resources. For more information, see [az spring export](/cli/azure/spring#az-spring-export).

To create Azure Container Apps resources that match the configurations of your existing Azure Spring Apps resources, use the following steps:

1. Install Azure CLI version 2.45.0 or higher and the latest version of the Azure Spring Apps extension by using the `az extension add --name spring` command.

1. Generate Bicep files to create the corresponding Azure Container Apps resources by using the following command:

    ```azurecli
    az spring export \
        --resource-group <resource-group-name> \
        --target aca \
        --subscription <subscription-id> \
        --service <service-name> \
        --output-folder <output-folder-name> 
    ```

1. The previous command generates a **README.md** file with detailed instructions. Follow those instructions to update the required parameters in the Bicep files.

   > [!NOTE]
   > Azure Container Apps requires containerized image URLs. If you don't yet have a containerized image URL for your application, you can leave the quickstart image URL in the parameters unchanged, and deploy your own application later. For more information on obtaining container images, see [Overview of containerization](./containerization-overview.md)

1. If a resource group doesn't exist, create it by using the following command:

    ```azurecli
    az group create \
        --name <resource-group-name> \
        --subscription <subscription-id> \
        --location <location> 
    ```

1. Deploy Azure Container Apps resources to the resource group by using the following command:

    > [!NOTE]
    > You might need to run the command multiple times and adjust the configuration based on the response message.

    ```azurecli
    az deployment group create \
      --resource-group <resource-group-name> \
      --template-file main.bicep \
      --parameters param.bicepparam \
      --subscription <subscription-id>
    ```

1. Follow the instructions in the **README.md** file to update resources for advanced features. These features include uploading certificates, enabling a custom domain, adding role assignments to the system-assigned managed identity, and more.

1. If you need the Terraform configuration of those resources, export them using the export workflow of the Azure Terraform Resource Provider. For more information, see [Overview of the Azure Terraform Resource Provider](/azure/developer/terraform/azure-terraform-resource-provider/resource-provider-overview).

## Tutorial

We provide a tutorial to demonstrate the end-to-end experience of running the ACME Fitness Store application on Azure Container Apps. For more information, see [acme-fitness-store/azure-container-apps](https://github.com/Azure-Samples/acme-fitness-store/tree/Azure/azure-container-apps). This tutorial offers hands-on guidance, helping you quickly gain practical insights and confidence in deploying and managing containerized applications on the platform.
