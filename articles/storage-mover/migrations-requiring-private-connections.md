---
title: Migrate data using private connections in Azure Storage Mover
description: Learn how to securely migrate AWS S3 data to Azure Storage over private networks using Azure Private Link Service and Private Endpoints in Azure Storage Mover.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 03/04/2026
--- 

# Migrate data using private connections in Azure Storage Mover

Azure Storage Mover supports secure, large-scale data migration across cloud environments, including scenarios that require strict network isolation. Storage Mover can be configured to use private networking constructs to keep data traffic within trusted boundaries. By using Azure Private Link and Private Endpoints, data transfers stay within trusted boundaries between your AWS VPC and Azure virtual network.

This article explains how private connections enable secure migrations between AWS S3 and Azure Storage, and when this approach is appropriate.

## Overview

A private connection allows enterprise customers to securely migrate data between Amazon Web Services (AWS) S3 and Azure Storage over private networks, keeping transfers off the public internet. By using Azure Private Link Service (PLS) and Private Endpoints (PE), this solution extends the Virtual Private Cloud (VPC) network into Azure, supports strict security compliance, and helps protect sensitive information.

## Prerequisites

Before you begin, ensure that you have the following resources and configurations in place.

### Prerequisites for setting up Storage Mover

- An understanding of the [Azure Storage Mover resource hierarchy](/azure/storage-mover/resource-hierarchy).
- A [Storage Mover resource](/azure/storage-mover/storage-mover-create) deployed in your Azure subscription.
- Completed the preparation steps from [Get started with cloud-to-cloud migration in Azure Storage Mover](/azure/storage-mover/cloud-to-cloud-migration).
- An active Azure subscription with [permissions to create and manage Azure Storage Mover and Azure Arc resources](/azure/azure-arc/multicloud-connector/add-public-cloud).

### Prerequisites for creating a private connection

- A [Private Link Service Direct Connect](https://docs.azure.cn/en-us/private-link/create-private-link-service-portal?tabs=dynamic-ip) configured and ready to use.
- Familiarity with [Azure Private Link networking documentation](/azure/private-link/).

## Known limits

The Virtual Private Cloud feature in Azure Storage Mover has the following limits:

- A Private Link Service Direct Connect (an IP-based Private Link Service) can't be created directly within Storage Mover. You must establish the Private Link Service before initiating the creation of a private connection.
- Review your AWS S3 environment to determine whether it resides behind a Virtual Private Cloud, as this process doesn't validate the public or private status of your S3 bucket.
- When configuring your PLS, ensure it accurately maps to the Virtual Private Cloud associated with your S3 resource, since this experience doesn't offer validation at that level.
- There's a default limit of 10 private connections per subscription per region.

## Step 1: Create a private connection

To configure a private connection, use the Storage Endpoints section of your Storage Mover resource.

1. Navigate to your Storage Mover instance in the Azure portal.
2. Under **Storage endpoints**, select **Private Connection** > **Create Private Connection**.

   :::image type="content" source="./media/private-connections/storage-endpoints.png" alt-text="Screenshot of navigation to private connections in Storage Mover." lightbox="./media/private-connections/storage-endpoints.png":::

3. Enter a name for this private connection. This name matches the name of the Private Endpoint that you later approve to connect to the Private Link Service.
4. Select the appropriate **Private Link Service Direct Connect** that directs you to the correct AWS S3 bucket you want to migrate to Azure.

   :::image type="content" source="./media/private-connections/create-private-connection.png" alt-text="Screenshot displaying how to create a private connection." lightbox="./media/private-connections/create-private-connection.png":::

5. Select **Create** and commit your changes. Creating the private connection takes 20–30 seconds. You might need to refresh manually to view it in the grid.

   :::image type="content" source="./media/private-connections/confirm-create-pc.png" alt-text="Screenshot of notification confirming the private connection was created." lightbox="./media/private-connections/confirm-create-pc.png":::

   :::image type="content" source="./media/private-connections/private-connections-browse.png" alt-text="Screenshot of the private connection page." lightbox="./media/private-connections/private-connections-browse.png":::

6. Repeat steps 1–5 to set up additional private connections.

> [!TIP]
> Create multiple private connections to avoid bandwidth limits and ensure efficient, successful data migration.

:::image type="content" source="./media/private-connections/private-connection-added.png" alt-text="Screenshot of multiple listed private connections." lightbox="./media/private-connections/private-connection-added.png":::

## Step 2: Approve a private connection

After you create a private connection, you must approve it before it can be used in a migration job.

1. Select the checkbox for your newly created private connection. This step authorizes the connection between the Private Link Service you specified during setup and the corresponding private endpoint that was automatically generated for you.
2. Select **Approve**.

> [!IMPORTANT]
> Only a private connection in an **Approved** state can be used for a migration job. Connections in pending, rejected, or disconnected states don't appear as options when you create a job.

:::image type="content" source="./media/private-connections/approve-private-connection.png" alt-text="Screenshot of a private connection approving the private endpoint." lightbox="./media/private-connections/approve-private-connection.png":::

:::image type="content" source="./media/private-connections/pc-approval-pending.png" alt-text="Screenshot of the pending approval of the private endpoint to the private connection." lightbox="./media/private-connections/pc-approval-pending.png":::

:::image type="content" source="./media/private-connections/pc-approved-private-endpoint.png" alt-text="Screenshot of the confirmed approval of the private endpoint to the private connection." lightbox="./media/private-connections/pc-approved-private-endpoint.png":::

:::image type="content" source="./media/private-connections/all-pc-approved.png" alt-text="Screenshot of all listed private connections with approved status." lightbox="./media/private-connections/all-pc-approved.png":::

## Step 3: Create a project

1. Navigate to the **Projects** page in your Storage Mover resource.
2. Provide a name for your project.
3. Select **Create**.

:::image type="content" source="./media/private-connections/mover-projects.png" alt-text="Screenshot of the projects page in Storage Mover." lightbox="./media/private-connections/mover-projects.png":::

:::image type="content" source="./media/private-connections/create-project.png" alt-text="Screenshot of creating a new project." lightbox="./media/private-connections/create-project.png":::

:::image type="content" source="./media/private-connections/project-created.png" alt-text="Screenshot of a new project successfully created." lightbox="./media/private-connections/project-created.png":::

## Step 4: Create a migration job

After your project is ready, create a migration job to define the source, target, and private connections for your data transfer.

1. Navigate to the **Projects** page and select your project.
2. Select **Create Job**.

   :::image type="content" source="./media/private-connections/project-browse.png" alt-text="Screenshot of an available project opened to create a job." lightbox="./media/private-connections/project-browse.png":::

3. On the **Basics** tab, select your desired migration type.

   :::image type="content" source="./media/private-connections/create-job-basics.png" alt-text="Screenshot of the Create Job experience with the Basics tab open." lightbox="./media/private-connections/create-job-basics.png":::

4. On the **Source** tab, select an existing or newly created source type. Ensure that your selected source is protected by a Virtual Private Cloud.
5. Select a **Private** type. Some sources don't require you to select **Private**, but they do require you to add one or more private connections for the selected source.

   :::image type="content" source="./media/private-connections/create-job-source.png" alt-text="Screenshot of the Create Job experience with the Source tab open." lightbox="./media/private-connections/create-job-source.png":::

6. Select your existing private connections. Select multiple private connections to avoid bandwidth limits and ensure efficient data migration.

   :::image type="content" source="./media/private-connections/select-private-connection.png" alt-text="Screenshot of the Create Job experience with the ability to select a private connection." lightbox="./media/private-connections/select-private-connection.png":::

   :::image type="content" source="./media/private-connections/pc-selection-confirmed.png" alt-text="Screenshot of the Create Job experience with the selection of private connections confirmed." lightbox="./media/private-connections/pc-selection-confirmed.png":::

   :::image type="content" source="./media/private-connections/pc-listed.png" alt-text="Screenshot of the Create Job experience with the selected private connections listed in the Source tab." lightbox="./media/private-connections/pc-listed.png":::

7. Select **Next**.
8. On the **Target** tab, select the target resource where you want your data migrated in Azure.

   :::image type="content" source="./media/private-connections/create-job-target.png" alt-text="Screenshot of the Create Job experience with the Target tab open." lightbox="./media/private-connections/create-job-target.png":::

9. On the **Settings** tab, select the appropriate settings for your migration.

   :::image type="content" source="./media/private-connections/create-job-settings.png" alt-text="Screenshot of the Create Job experience with the Settings tab open." lightbox="./media/private-connections/create-job-settings.png":::

   :::image type="content" source="./media/private-connections/job-setting-selected.png" alt-text="Screenshot of the Create Job experience with the settings configurations selected." lightbox="./media/private-connections/job-setting-selected.png":::

10. Review your configuration on the **Review** tab, then select **Create**.

    :::image type="content" source="./media/private-connections/create-job-review.png" alt-text="Screenshot of the Create Job experience with the Review tab open." lightbox="./media/private-connections/create-job-review.png":::

    :::image type="content" source="./media/private-connections/job-deploying.png" alt-text="Screenshot displaying the created job pending deployment." lightbox="./media/private-connections/job-deploying.png":::

## Step 5: Edit a migration job

You can modify private connections on an existing job at any time before or after a run.

1. Navigate to the job you created in your project.

   :::image type="content" source="./media/private-connections/job-created.png" alt-text="Screenshot of a job successfully created." lightbox="./media/private-connections/job-created.png":::

   :::image type="content" source="./media/private-connections/job-overview.png" alt-text="Screenshot of the overview page of the created job." lightbox="./media/private-connections/job-overview.png":::

2. Select the **Edit** icon.

:::image type="content" source="./media/private-connections/edit-private-connections.png" alt-text="Screenshot of the edit private connections tab for a job." lightbox="./media/private-connections/edit-private-connections.png":::

3. Under **Private connections**, add or delete private connections by selecting the respective buttons.

:::image type="content" source="./media/private-connections/removed-private-connection.png" alt-text="Screenshot of the removal of a private connection from a job." lightbox="./media/private-connections/removed-private-connection.png":::

4. Select **Save**.
5. Run your job as usual once you confirm that all configurations are correct.

> [!TIP]
> To locate errors related to private connections, go to the job page and select the **Monitoring** tab after the job completes.







