---
title: Get started with cloud-to-cloud migration in Azure Storage Mover (Preview)
description: The Cloud-to-Cloud Migration feature (preview) in Azure Storage mover allows you to securely transfer data from Amazon Simple Storage Service (Amazon S3) to Azure Blob Storage, utilizing Azure Arc for AWS (Amazon Web Services) to simplify authentication and resource management.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: quickstart
ms.date: 07/01/2025
---

# Get started with cloud-to-cloud migration in Azure Storage Mover (Preview)

The Cloud-to-Cloud Migration feature in Azure Storage Mover allows you to securely transfer data from Amazon Simple Storage Service (Amazon S3) to Azure Blob Storage. 

The feature utilizes Azure Arc for AWS (Amazon Web Services) to simplify authentication and resource management. The Azure Arc service provides a centralized source for management and governance. The service uses multicloud connectors to extend Azure's management capabilities to resources outside of the Azure cloud. These capabilities and resources can include on-premises servers, multicloud environments, and edge computing devices. For more details on Azure Arc, visit the [Azure Arc overview](/azure/azure-arc/overview) article.

This article guides you through the complete process of configuring Storage Mover to migrate your data from Amazon S3 to Azure Blob Storage. The process consists of creating a multicloud connector for AWS, configuring endpoints, and creating and running a migration job.

## Prerequisites

Before you begin, ensure that you have: 

- An active Azure subscription with [permissions to create and manage Azure Storage mover and Azure Arc resources](/azure/azure-arc/multicloud-connector/connect-to-aws#azure-prerequisites).
- An AWS account with access to the Amazon S3 bucket from which you want to migrate.
- An [Azure Storage account](../storage/common/storage-account-create.md) to use as the destination.
- A [Storage Mover resource](storage-mover-create.md) deployed in your Azure subscription.

## Preview limitations

The Cloud-to-Cloud Migration feature in Azure Storage Mover is currently in preview. The following limitations apply:

- Each migration job supports the transfer of 10 million objects.
- A maximum of 10 concurrent jobs is supported per subscription.
- Azure Storage Mover doesn't support automatic rehydration of archived objects. Data stored in AWS Glacier or Deep Archive must be restored before migration. Migration jobs should only be initiated after the data is fully restored.
- Private Networking is currently not supported. However, Azure Storage Mover's Cloud-to-Cloud feature securely transfers data by limiting S3 access to trusted Azure IP ranges. This approach ensures secure, controlled connectivity over the public internet.

## Create a multicloud connector for AWS

The first step in performing a cross-cloud migration to Azure is the creation of an Azure Arc multicloud connector for AWS. The multicloud connector allows you to securely connect AWS services to Azure.

Follow the steps in this section to configure an AWS connector within your Storage Mover resource.

1. Navigate to your Storage Mover resource within the Azure portal. In the **Overview** pane, select the **Multicloud migration** tab as shown in the following image.

    :::image type="content" source="media/cloud-to-cloud-migration/sample-migration-sml.png" alt-text="A screen capture showing the Storage Mover Overview page with the Multicloud Migration tab selected and required fields displayed." lightbox="media/cloud-to-cloud-migration/sample-migration.png":::

1. Within the **Multicloud migration** tab, select **Create multicloud connector** to open the **Add AWS connector** page.

1. In the **Basics** tab:

    - From their respective drop-down lists located in the **Project Details** section, select the **Subscription** and **Resource group** in which you're creating your connector resource. Optionally, you can create a new resource group by selecting **Create new**.
    
        > [!TIP]
        > You can filter subscriptions and resource groups by entering a value in the **Filter items...** fields within the respectective drop-down list. Only resources with names containing the specified value are displayed in your Inventory.
      
    - In the **Connector details** section, provide a value for the **Connector name** field. From the **Azure region** drop-down list, select the region where you want to create and save your connector resource.
    - In the **AWS account** section, select the appropriate AWS account type and provide the AWS account ID from which your connector is reading resources.
    
    Verify that all values are correct and select **Next** to continue to the **Solutions** tab as shown in the following image.

    :::image type="content" source="media/cloud-to-cloud-migration/add-aws-connector-sml.png" alt-text="A screen capture showing the Multicloud Connector creation page with the Basics tab selected and required fields displayed." lightbox="media/cloud-to-cloud-migration/add-aws-connector.png":::

1. Within the **Solutions** tab, add an **Inventory** and **Storage - Data Management** solution to your connector. The Inventory solution allows you to discover and manage AWS resources, while the Storage - Data Management solution enables data transfer operations for Storage Mover.

    > [!IMPORTANT]
    > An **Inventory** solution must be created before you can add a **Storage - Data Management** solution.

    :::image type="content" source="media/cloud-to-cloud-migration/add-connector-solution-sml.png" alt-text="A screen capture showing the Multicloud Connector creation page with the Inventory tab selected and required Inventory objects displayed." lightbox="media/cloud-to-cloud-migration/add-connector-solution.png":::

    First, add an **Inventory** solution. 

    - By default, the **Add all supported AWS services** checkbox is selected. This option allows the connector to discover all AWS services in your account. However, Storage Mover multicloud migrations support only Amazon S3 buckets as a data source. Therefore, you can choose to exclude all other AWS services except the **S3** service.
    - Select the **Permissions** option you want this connector to have to your AWS account.
    - Select the **Periodic sync** option to allow the connector to scan your AWS account on a regular interval. Set the cadence by selecting the desired sync interval from the **Recur every** drop-down list. Your AWS account is scanned once if you choose to disable periodic sync.
    - By default, the **Include all supported AWS regions** checkbox is selected within the **Resource filters** section. This option allows the connector to discover resources in all AWS regions. If you want to limit the scan to specific regions, uncheck this checkbox and select the desired regions from the **AWS Regions** drop-down list.
    - Verify that all values are correct and select **Save** to finish adding the Inventory solution to your connector as shown in the following image.

        :::image type="content" source="media/cloud-to-cloud-migration/add-connector-solution-inventory-sml.png" alt-text="A screen capture showing the Multicloud Connector creation page with the Inventory Settings pane exposed. The required Inventory fields are displayed." lightbox="media/cloud-to-cloud-migration/add-connector-solution-inventory.png":::

    Next, add a **Storage - Data Management** solution by selecting the **Add** link in the **Actions** column of the **Storage - Data Management** solution.

    Ensure that both solutions are added by validating the presence of **Edit** links within the **Actions** column of the **Solutions** list. Select **Next** to continue to the **Authentication template** tab as shown in the following image.

    :::image type="content" source="media/cloud-to-cloud-migration/add-connector-solutions-sml.png" alt-text="A screen capture showing the presence of the Edit links in the Actions column of the Solutions list." lightbox="media/cloud-to-cloud-migration/add-connector-solutions.png":::
    
1. Within the **Authentication template** tab, follow the on-screen instructions to create the *AWS CloudFormation Stack* using the AWS portal.

    :::image type="content" source="media/cloud-to-cloud-migration/add-connector-authentication-sml.png" alt-text="A screen capture showing the Authentication Template tab. The AWS CloudFormation template and instructions for creating the stack are displayed." lightbox="media/cloud-to-cloud-migration/add-connector-authentication.png":::

    Select **Next** to continue to the **Tags** tab.

1. Within the **Tags** tab, you can create and apply tags to help you identify resources based on settings that are relevant to your organization. For example, you can add an **Environment** tag with a value of **Production** or **Development**. For more information about tags, see the [Azure Resource Manager documentation](../azure-resource-manager/management/tag-resources.md).

    :::image type="content" source="media/cloud-to-cloud-migration/add-connector-tags-sml.png" alt-text="A screen capture showing the Multicloud Connector creation page with the Tags tab selected. A sample key-value pair is shown." lightbox="media/cloud-to-cloud-migration/add-connector-tags.png":::

    Select **Next** to continue to the **Review + Create** tab.

1. The **Review + Create** tab displays a summary of the configuration settings you provided in the previous steps. Review these settings to ensure they're correct. If you need to make changes, select the **Previous** button to return to the appropriate tab. If all settings are correct, select **Create** to create your multicloud connector.

    :::image type="content" source="media/cloud-to-cloud-migration/add-connector-review-sml.png" alt-text="A screen capture showing the Add Multicloud Connector Overview page with the Review and Create tab selected. A summary of values is displayed for review." lightbox="media/cloud-to-cloud-migration/add-connector-review.png":::

    After the connector is created, you're redirected to the new connector's **Overview** page as shown in the following image. 

    :::image type="content" source="media/cloud-to-cloud-migration/add-connector-deployed-sml.png" alt-text="A screen capture showing the newly created Multicloud Connector's Overview page with the deployment details displayed." lightbox="media/cloud-to-cloud-migration/add-connector-deployed.png":::

    Your new connector also appears in the **Connectors available** pane. To access the list of available connectors, navigate to your Storage Mover resource. In the **Overview** pane, select the **Multicloud migration** tab, and in the **Connect to data source** section, select **View existing multicloud connectors** as shown in the following image. From the **Multicloud connectors** pane, you can select your newly created connector to open it.

    :::image type="content" source="media/cloud-to-cloud-migration/connectors-available-sml.gif" alt-text="A screen capture showing the Connectors available pane page with several Multicloud Connectors displayed." lightbox="media/cloud-to-cloud-migration/connectors-available.gif":::

## Configure Source and Target Endpoints

After you configure the multicloud connector, the next step is to create source and target endpoints for your migration.

In the context of the Azure Storage Mover service, an *endpoint* is a resource that contains the path to either a source or target location and other relevant information. Storage Mover *job definitions* use endpoints to define the source and target locations for copy operations.

Follow the steps in this section to configure an AWS S3 source endpoint and an Azure Blob Storage target endpoint. To learn more about Storage Mover endpoints, refer to the [Manage Azure Storage Mover endpoints](endpoint-manage.md) article.

### Configure an AWS S3 Source Endpoint

1. Navigate to your Storage mover instance in Azure.
1. From the **Resource management** group within the left navigation, select **Storage endpoints**. Select the **Source endpoints** tab, and then **Add endpoint** to open the **Create source endpoint** pane.
1. In the **Create source endpoint** pane:

    - Select **AWS S3** as the **Source type**.
    - Choose the multicloud connector you created in the previous section from the **Multicloud connector** drop-down list.
    - Select the S3 bucket you want to migrate from the **Select S3 bucket** drop-down list.
    - Optionally, provide a description for the endpoint in the **Description** field.
    - Verify that your selections are correct and select **Create** to create the endpoint as shown in the following image

        :::image type="content" source="media/cloud-to-cloud-migration/endpoint-source-create-sml.png" alt-text="A screen capture showing the Endpoints page containing the Create Source Endpoint pane with required fields displayed." lightbox="media/cloud-to-cloud-migration/endpoint-source-create.png":::

### Configure an Azure Blob Storage Target Endpoint

1. From the **Resource management** group within the left navigation, select **Storage endpoints**. Select the **Target endpoints** tab, and then **Add endpoint** to open the **Create target endpoint** pane.
1. In the **Create target endpoint** pane:
 
    - Select your subscription and storage account from the respective **Subscription** and **Storage account** drop-down lists.
    - Select *Blob container* button from the **Target type** field.
    - Choose the **Blob container** to which you want to migrate from the **Blob container** drop-down list.
    - Optionally, provide a description for the endpoint in the **Description** field.
    - Verify that your selections are correct and select **Create** to create the endpoint as shown in the following image.

        :::image type="content" source="media/cloud-to-cloud-migration/endpoint-target-create-sml.png" alt-text="A screen capture showing the Endpoints page containing the Create Target Endpoint pane with required fields displayed." lightbox="media/cloud-to-cloud-migration/endpoint-target-create.png":::

## Create a migration project and job definition

After you define source and target endpoints for your migration, the next steps are to create a Storage Mover migration project and job definition.

A *migration project* allows you to organize large migrations into smaller, more manageable units that make sense for your use case. A *job definition* describes resources and migration options for a specific set of copy operations undertaken by the Storage Mover service. These resources include, for example, the source and target endpoints, and any migration settings you want to apply.

Follow the steps in this section to create a migration project and run a migration job.

1. Navigate to the **Project explorer** tab in your Storage Mover instance and select **Create project**.
1. Provide values for the following fields:
    - **Project name**: A meaningful name for the migration project.
    - **Project description**: A useful description for the project.
    - Select **Create** to create the project. It might take a moment for the newly created project to appear in the project explorer.

    :::image type="content" source="media/cloud-to-cloud-migration/project-create-sml.png" alt-text="A screen capture showing the Project Explorer page with the Create a Project pane's fields visible." lightbox="media/cloud-to-cloud-migration/project-create.png":::

1.  Select the project after it appears, and then select **Create job definition** to open the **Create a Migration Job** page's **Basics** tab. Provide values for the following fields:
    - **Job name**: A meaningful name for the migration job.
    - **Migration type**: Select `Cloud to cloud`.
    
    :::image type="content" source="media/cloud-to-cloud-migration/create-job-sml.png" alt-text="A screen capture showing the Create a Migration Job page with the Basics tab selected and the required fields displayed." lightbox="media/cloud-to-cloud-migration/create-job.png":::

1. Within the **Source** tab, select the **Existing endpoint** option for the **Endpoint** field. 

    :::image type="content" source="media/cloud-to-cloud-migration/create-source-sml.png" alt-text="A screen capture showing the Create a Migration Job page with the Source tab selected and the required fields displayed." lightbox="media/cloud-to-cloud-migration/create-source.png":::

    Next, select the **Select an existing endpoint as a source** link to open the **Select an existing endpoint** pane. Choose the AWS S3 source endpoint created in the previous section and select **Select** to save your changes.

    > [!NOTE]
    > Amazon S3 buckets might take up to an hour to become visible within newly created multicloud connectors.

    :::image type="content" source="media/cloud-to-cloud-migration/select-source-sml.png" alt-text="A screen capture showing the Select an Existing Source Endpoint pane." lightbox="media/cloud-to-cloud-migration/select-source.png":::

1. Within the **Target** tab, select the **Select an existing endpoint reference** option for the **Target endpoint** field. Next, select the **Select an existing endpoint as a target** link to open the **Select an existing endpoint** pane. 

    :::image type="content" source="media/cloud-to-cloud-migration/create-target-sml.png" alt-text="A screen capture showing the Create a Migration Job page with the Target tab selected and the required fields displayed." lightbox="media/cloud-to-cloud-migration/create-target.png"::: 

    Next, select the **Select an existing endpoint as a target** link to open the **Select an existing target endpoint** pane. Choose the Azure Blob Storage target endpoint created in the previous section and select **Select** to save your changes. Verify that the correct target endpoint is displayed in the **Existing target endpoint** field and then select **Next** to continue to the **Settings** tab.

    :::image type="content" source="media/cloud-to-cloud-migration/select-target-sml.png" alt-text="A screen capture showing the Create a Migration Job page with the Select anExisting Target Endpoint pane displayed." lightbox="media/cloud-to-cloud-migration/select-target.png":::

1. Within the **Settings** tab, select **Mirror source to target** from the **Copy mode** drop-down list. Verify that the **Migration outcomes** results are appropriate for your use case, then select **Next** and review your settings.

    :::image type="content" source="media/cloud-to-cloud-migration/project-settings-sml.png" alt-text="A screen capture showing the Create a Migration Job page with the Settings tab selected and migration outcomes displayed." lightbox="media/cloud-to-cloud-migration/project-settings.png":::

1. After confirming that your settings are correct within the **Review** tab, select **Create** to deploy the migration job. You're redirected to the **Project explorer** after the job's deployment begins. After completion, the job appears within the associated migration project.

    :::image type="content" source="media/cloud-to-cloud-migration/job-review-sml.png" alt-text="A screen capture showing the Create a Migration Job page with the Review tab selected and all settings displayed." lightbox="media/cloud-to-cloud-migration/job-review.png":::

## Run a migration job

1. Navigate to the **Migration Jobs** tab. The **Migration Jobs** tab displays all migration jobs created within your Storage Mover resource, including the one you recently created. It might take a moment for the newly created migration job to appear in the list of migration jobs. Refresh the page if necessary. 

    :::image type="content" source="media/cloud-to-cloud-migration/migration-jobs-sml.png" alt-text="A screen capture showing the Migration Jobs page with the Migration Jobs tab selected and all Migration Jobs displayed." lightbox="media/cloud-to-cloud-migration/migration-jobs.png":::

1. Select your newly created job definition to view its details in the **Properties** tab. Select the **Start job** button to expose the **Start job** pane for the migration job. 

    :::image type="content" source="media/cloud-to-cloud-migration/migration-job-sml.png" alt-text="A screen capture showing the Migration Job details page with the Properties tab and the Start Job button highlighted." lightbox="media/cloud-to-cloud-migration/migration-job.png":::

    The multicloud connector attempts to assign roles to the storage account and blob container. After the roles are assigned, select **Start** to begin the migration job. The job runs in the background, and you can monitor its progress in the **Migration overview** tab.

    :::image type="content" source="media/cloud-to-cloud-migration/migration-job-start-sml.png" alt-text="A screen capture showing the Migration Job page's Start Job pane." lightbox="media/cloud-to-cloud-migration/migration-job-start.png":::

## Monitor migration progress

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
