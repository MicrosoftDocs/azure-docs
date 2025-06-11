---
title: Getting Started with Cloud-to-Cloud Migration in Azure Storage Mover (Preview)
description: The Cloud-to-Cloud Migration feature (preview) in Azure Storage mover allows you to securely transfer data from Amazon Simple Storage Service (Amazon S3) to Azure Blob Storage, utilizing Azure Arc for AWS (Amazon Web Services) to simplify authentication and resource management.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 06/11/2025
---

# Getting Started with Cloud-to-Cloud Migration in Azure Storage Mover (Preview)

The Cloud-to-Cloud Migration feature in Azure Storage Mover allows you to securely transfer data from Amazon Simple Storage Service (Amazon S3) to Azure Blob Storage. 

The feature utilizes Azure Arc for AWS (Amazon Web Services) to simplify authentication and resource management. The Azure Arc service provides a centralized source for management and governance. The service uses multicloud connectors to extend Azure's management capabilities to resources outside of the Azure cloud. These capabilities and resources can include on-premises servers, multicloud environments, and edge computing devices. For more details on Azure Arc, visit the [Azure Arc overview](/azure/azure-arc/overview) article.

This article guides you through the complete process of configuring Storage Mover to migrate your data from Amazon S3 to Azure Blob Storage. The process consists of creating a multicloud connector for AWS, configuring endpoints, and creating and running a migration job.

> [!IMPORTANT]
> After your subscription is granted access to this feature, you must use the following link to access the feature within the Azure portal: [https://aka.ms/awstoazuremover](https://aka.ms/awstoazuremover).

## Prerequisites

Before you begin, ensure that you have: 

- An active Azure subscription with [permissions to create and manage Azure Storage mover and Azure Arc resources](/azure/azure-arc/multicloud-connector/connect-to-aws#azure-prerequisites).
- An AWS account with access to the Amazon S3 bucket from which you want to migrate.
- An [Azure Storage account](../storage/common/storage-account-create.md) to use as the destination.
<!--- Azure Arc for AWS configured to enable secure authentication and access to AWS resources via Multicloud connectors.-->
- A [Storage Mover resource](storage-mover-create.md) deployed in your Azure subscription.

## Create a multicloud connector for AWS

The first step in performing a cross-cloud migration to Azure is the creation of an Azure Arc multicloud connector for AWS. The multicloud connector allows you to securely connect AWS services to Azure.

Follow the steps in this section to configure an AWS connector within your Storage Mover resource.

1. Navigate to your Storage Mover resource within the Azure portal. In the **Overview** pane, select the **Multicloud migration** tab as shown in the following image.

    :::image type="content" source="media/cloud-to-cloud-migration/sample-migration-sml.png" alt-text="A screen capture showing the Storage Mover Overview page with the Multicloud Migration tab selected and required fields displayed." lightbox="media/cloud-to-cloud-migration/sample-migration.png":::

1. Within the **Multicloud migration** tab, select **Create multicloud connector** to open the **Add AWS connector** page. 
1. In the **Basics** tab:

    - From the drop-down lists located in the **Project Details** section, select the subscription and resource group in which you're creating your connector resource. Optionally, you can create a new resource group by selecting **Create new**.
    - In the **Connector details** section, provide a value for the **Connector name** field. From the **Azure region** drop-down list, select the region where you want to create and save your connector resource.
    - In the **AWS account** section, select the appropriate AWS account type and provide the AWS account ID from which your connector is reading resources.
    
    Verify all values and select **Next** to continue.

    :::image type="content" source="media/cloud-to-cloud-migration/add-aws-connector-sml.png" alt-text="A screen capture showing the Multicloud Connector creation page with the Basics tab selected and required fields displayed." lightbox="media/cloud-to-cloud-migration/add-aws-connector.png":::

1. Within the **Solutions** tab:
    - Add an **Inventory** solution, making sure that `AWS Services: S3` is selected.
    - Add a **Storage - Data Management** solution.
1. Within the **Authentication template** tab, follow the instructions presented to create the *AWS CloudFormation Stack* from the AWS portal.
1. Finally, select **Review + Create** to create the connector.

    :::image type="content" source="media/cloud-to-cloud-migration/connectors-available-sml.png" alt-text="A screen capture showing the Connectors available pane page with several Multicloud Connectors displayed." lightbox="media/cloud-to-cloud-migration/connectors-available.png":::

## Configure Source and Destination Endpoints

After you configure the Azure Arc service, the next step is to create source and destination endpoints for your migration.

In the context of the Azure Storage Mover service, an *endpoint* is a resource that contains the path to either a source or destination location and other relevant information. Storage Mover *job definitions* use endpoints to define the source and target locations for a particular copy operation.

Follow the steps in this section to configure an AWS S3 source endpoint and an Azure Blob Storage destination endpoint. To learn more about Storage Mover endpoints, refer to the [Manage Azure Storage Mover endpoints](endpoint-manage.md) article.

### Configure an AWS S3 Source Endpoint

1. Navigate to your Storage mover instance in Azure.
1. Under **Storage endpoints**, select **Source endpoints** and then **Add endpoint**.

    :::image type="content" source="media/cloud-to-cloud-migration/storage-endpoints-sml.png" alt-text="A screen capture showing the Endpoints page containing the Create Source Endpoint pane with required fields displayed." lightbox="media/cloud-to-cloud-migration/storage-endpoints.png":::
1. Select **AWS S3** as the source.
1. Choose the Multicloud connector you created in the previous section.

    :::image type="content" source="media/cloud-to-cloud-migration/create-aws-endpoint-sml.png" alt-text="A screen capture showing the Endpoints page containing the Create Source Endpoint with the S3 Connector drop down list displayed." lightbox="media/cloud-to-cloud-migration/create-aws-endpoint.png":::
1. Select the S3 bucket you want to migrate and verify that access is properly configured.
1. Select **Save** to commit your changes.

### Configure an Azure Blob Storage Destination Endpoint

1. Within **Storage endpoints**, select **Destination endpoints** and then **Add endpoint**.
1. Select **Azure Blob Storage** as the destination.
1. Choose the **Storage Account** and **Container**.
1. Select **Save** to commit your changes.

## Create a Migration Job

After you define source and destination endpoints for your migration, the next step is to create a Storage Mover Migration Job Definition.

A Job Definition describes resources and migration options for a specific set of copy operations undertaken by the Storage Mover service. These resources include, for example, the source and destination endpoints, and any migration settings you want to apply.

Follow the steps in this section to create and run a Storage Mover Migration Job. To learn more about other Storage Mover job types, refer to the [Define and start a migration job](job-definition-create.md) article.

1. Navigate to the **Project explorer** tab in your Storage Mover instance.
1. Select **Create job definition**.
1. Provide values for the following fields:
    - **Job name**: A meaningful name for the migration.
    - **Migration type**: Select `Cloud to cloud`.
    
        :::image type="content" source="media/cloud-to-cloud-migration/create-job-sml.png" alt-text="A screen capture showing the Create a Migration Job page with the Basics tab selected and the required fields displayed." lightbox="media/cloud-to-cloud-migration/create-job.png":::
    - **Source endpoint**: Select the AWS S3 bucket configured via Azure Arc.
        > [!NOTE]
        > Amazon S3 buckets might take up to an hour to become visible within newly created Multicloud connectors.

        :::image type="content" source="media/cloud-to-cloud-migration/create-source-sml.png" alt-text="A screen capture showing the Create a Migration Job page with the Source tab selected and the required fields displayed." lightbox="media/cloud-to-cloud-migration/create-source.png":::
    - **Destination endpoint**: Select the Azure Blob Storage container.

        :::image type="content" source="media/cloud-to-cloud-migration/create-target-sml.png" alt-text="A screen capture showing the Create a Migration Job page with the Target tab selected and the required fields displayed." lightbox="media/cloud-to-cloud-migration/create-target.png":::
    - **Copy mode**: Select `Mirror source to target`.
1. Select **Next** and review your settings.
1. After confirming that your settings are correct, select **Start Migration** to begin the copy operation.

## Monitor Migration Progress

As you use Storage Mover to migrate your data to your Azure destination targets, you should monitor the copy operations for potential issues. Data relating to the operations being performed during your migration are displayed within the **Migration overview** tab. This data allows you to track the progress of your migration by providing current status and key information such as progress, speed, and estimated completion time.

When configured, Azure Storage Mover can also provide Copy logs and Job run logs. These logs are especially useful because they allow you to trace the migration result of job runs and of individual files.

Follow the steps in this section to monitor the progress of a Storage Mover Migration Job. To learn more about Storage Mover Copy and Job logs, refer to the [How to enable Azure Storage Mover copy and job logs](log-monitoring.md) article.

1. Navigate to the **Migration Jobs** tab.

    :::image type="content" source="media/cloud-to-cloud-migration/migration-overview-sml.png" alt-text="A screen capture showing the Storage Mover page with the Migration Overview tab selected and all Migration Jobs displayed." lightbox="media/cloud-to-cloud-migration/migration-overview.png":::
1. Select your job to view **progress, speed, and estimated completion time**.
1. Select **Logs** to check for any errors or warnings.
1. After the migration is complete, verify the data in **Azure Blob Storage**.

## Post-Migration Validation 

Post-migration data validation ensures that your data is accurate and that the transfer from AWS S3 to Azure Blob Storage is complete. This validation process verifies data integrity and consistency by comparing migrated data to the same data from the source. You can also choose to conduct user acceptance tests to further confirm functionality. Validation helps identify and resolve discrepancies, ensuring the migrated data is reliable and meets your business requirements.

Follow the steps in this section to complete manual validation and clean up unused AWS resources.

- Compare source and destination storage to ensure all files are transferred.
- Enable incremental sync if you need to keep AWS S3 and Azure Blob in sync over time.
- Delete the AWS S3 bucket after migration is fully completed and verified.

## Troubleshooting & Support 

Troubleshooting your migration might involve a range of steps, from basic diagnostics to more advanced error handling. If you're encountering issues, begin troubleshooting by taking the following steps.

- Migration job failed? Check the logs for error messages.
- Data transfer is slow? Ensure your network bandwidth is sufficient and AWS S3 rate limits aren’t throttling your transfer.
- Permission issues? Verify that Azure Arc and AWS Identity and Access Management (IAM) roles have the correct access.

## Related content

The following articles can help you become more familiar with the Storage Mover service.

- [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md)
- [Deploying a Storage Mover resource](storage-mover-create.md)
- [Deploying a Storage Mover agent](agent-deploy.md)
