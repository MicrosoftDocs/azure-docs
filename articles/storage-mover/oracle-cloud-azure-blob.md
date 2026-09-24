---
title: Migrate data from Oracle Cloud Infrastructure to Azure Blob Storage with Azure Storage Mover
description:  Learn how to migrate S3-compatible Oracle Cloud Infrastructure (OCI) Object Storage data to Azure Blob Storage by using Azure Storage Mover.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 08/17/2026
ms.collection:
  - migration
---

# Migrate data from Oracle Cloud Infrastructure (OCI) Object Storage to Azure Blob Storage with Azure Storage Mover

The S3 (Simple Storage Service) source migration feature in Azure Storage Mover securely transfers data from S3-compatible Oracle Cloud Infrastructure (OCI) Object Storage object stores to Azure Blob Storage.

Unlike AWS S3 (Amazon Simple Storage Services) migrations that use Azure Arc multicloud connectors, S3-compatible source migrations use a simplified approach. When you store the source endpoint URL and HMAC (Hash-based Message Authentication Code) credentials securely in Azure Key Vault, you don't need a multicloud connector or automated source discovery.

This article guides you through the complete process of configuring Storage Mover to migrate your data from an OCI Object Storage S3-compatible source to Azure Blob Storage. The process consists of storing source credentials in Azure Key Vault, configuring source and target endpoints, and creating and running a migration job.

## Prerequisites

Before you begin, ensure that you have:

- An active Azure subscription with permissions to create and manage Azure Storage Mover resources.
- An Oracle Cloud Infrastructure (OCI) tenancy with access to the Object Storage bucket from which you want to migrate.
- An Azure Storage account to use as the destination.
- A Storage Mover resource deployed in your Azure subscription.
- An Azure Key Vault to securely store your source Customer Secret Key credentials.
- Customer Secret Keys (Access Key ID and Secret Key) generated for your OCI user. See [Generate Customer Secret Keys for OCI](#generate-customer-secret-keys-for-oci).
- A private connection setup on Azure, if your source data is accessible only through a private network.

## Limits

The S3-compatible OCI source migration feature in Azure Storage Mover has the following limits:

- Each migration job supports the transfer of 500 million objects.
- A maximum of 10 concurrent jobs is supported per subscription. If you need to run more than 10, create a support request.
- Only HTTPS access to the S3-compatible source is supported.
- The S3-compatible source must support AWS Signature Version 4 (SigV4) style authentication.
- Buckets whose names contain characters that aren't DNS-compatible (for example, `_` or `.`) must be accessed by using path-style URLs. Virtual-hosted-style URLs aren't supported for these buckets, because S3 client initialization can fail on DNS resolution.

## Things to know

Before you begin your migration, review the following considerations specific to OCI Object Storage S3-compatible source migrations:

### Authentication method

OCI Object Storage S3-compatible access uses Customer Secret Keys (an Access Key ID and a Secret Key) associated with an OCI user. These keys enable OCI Object Storage to respond to standard S3 API requests by using the AWS Signature Version 4 authentication process.

### Generate Customer Secret Keys for OCI

To access your OCI bucket using the S3-compatible interface, you need to generate Customer Secret Keys in the OCI Console.

1. Sign in to the [OCI Console](https://cloud.oracle.com/).
1. Open the **Profile** menu and select your user, or go to **Identity & Security** > **Users** and select the user.
1. Under **Resources**, select **Customer Secret Keys**, then select **Generate Secret Key**.
1. Enter a name and select **Generate Secret Key**.

   > [!IMPORTANT]
   > Copy the **Secret Key** immediately. It's shown only once and can't be retrieved later. The matching **Access Key** is listed under **Customer Secret Keys**.

1. Note your Object Storage **namespace** and **home region**. You need them to build the S3-compatible endpoint URL.

### Determine your OCI S3-compatible endpoint URL

OCI Object Storage exposes an Amazon S3 Compatibility API. You can address buckets by using either path-style or virtual-hosted-style URLs:

- Path-style: `https://<namespace>.compat.objectstorage.<region>.oraclecloud.com/<bucket>/`
- Virtual-hosted-style: `https://<bucket_name>.vhcompat.objectstorage.<region>.oci.customer-oci.com/<object_name>`

> [!NOTE]
> Because OCI bucket names can contain characters (such as `_` and `.`) that are valid in OCI but aren't DNS-compatible, virtual-hosted-style URLs can fail S3 client initialization. Use path-style URLs for such buckets.

## Store source credentials in Azure Key Vault

After generating Customer Secret Keys for your OCI user, store them as secrets in Azure Key Vault for secure access by the Storage Mover service.

1. Using the [Azure portal](https://portal.azure.com), navigate to the Azure Key Vault that resides within the same subscription as your Storage Mover resource.
1. Within the left navigation, expand the **Objects** menu and select **Secrets**. Next, select **Generate/Import**.
1. Create a secret for the **Access Key**:
   - **Name**: Provide a meaningful name (for example, `oci-access-key`).
   - **Secret value**: Paste the Customer Secret Key Access Key ID value from the previous section.
   - Select **Create**.
1. Create a second secret for the **Secret Key**:
   - **Name**: Provide a meaningful name (for example, `oci-secret-key`).
   - **Secret value**: Paste the Customer Secret Key value from the previous section.
   - Select **Create**.
1. Note the full **Secret Identifier** URI for each secret. You need these identifiers when creating the source endpoint.

> [!NOTE]
> To ensure optimal security, we recommend disabling public access on the Key Vault containing the secrets and adding Storage Mover as a trusted service.

For more information, see [Set and retrieve a secret from Key Vault using Azure portal](/azure/key-vault/secrets/quick-create-portal).

## Configure source and target endpoints

After you store your credentials within your Azure Key Vault, the next step is to create your migration's source and target endpoints.

In the context of the Azure Storage Mover service, an endpoint is a resource that contains the path to either a source or target location and other relevant information. Storage Mover job definitions use endpoints to define the source and target locations for copy operations.

### Configure an OCI S3-compatible source endpoint

Source endpoints identify locations from which your data is migrated. The following steps describe the process of creating a source endpoint.

1. Navigate to your Storage Mover instance in the Azure portal.
1. From the **Resource management** group within the left navigation, select **Storage endpoints**. Select the **Source endpoints** tab, and then select **Create endpoint** to open the **Create source endpoint** pane.
1. In the **Create source endpoint** pane:
   - Select **Multicloud migration** as the **Migration type**.
   - Select **OCI Object Storage - S3** as the **Source type**.
   - **Source URL**: Enter the full HTTPS URL to your OCI bucket in S3-compatible (path-style) format. Use the format `https://<namespace>.compat.objectstorage.<region>.oraclecloud.com/<bucket-name>/`, or append `<prefix>/` to migrate only a subset of objects. Use path-style addressing for buckets whose names contain `_` or `.`.
   - **Access Key Vault Secret URI**: Enter the full URI of the secret containing your Access Key.
   - **Secret Key Vault Secret URI**: Enter the full URI of the secret containing your Secret Key.
   - Optionally, provide a **Description** for the endpoint.
1. Verify that your selections are correct and select **Create** to create the endpoint.

   > [!NOTE]
   > When the source endpoint is created, a system-assigned managed identity is automatically provisioned. This identity requires the **Key Vault Secrets User** Role-Based Access Control (RBAC) role on your Azure Key Vault to retrieve the credentials during migration. The portal attempts to assign this role automatically. If the assignment fails due to insufficient permissions, assign it manually or contact your Azure administrator.

### Configure an Azure Blob Storage target endpoint

1. From the **Resource management** group within the left navigation, select **Storage endpoints**. Select the **Target endpoints** tab, and then select **Add endpoint** to open the **Create target endpoint** pane.
1. In the **Create target endpoint** pane:
   - Select your **Subscription** and **Storage account** from the respective drop-down lists.
   - Select **Blob container** from the **Target Type** field.
   - Choose the **Blob container** to which you want to migrate from the drop-down list.
   - Optionally, provide a **Description** for the endpoint.
1. Verify that your selections are correct and select **Create** to create the endpoint.

### Assign RBAC roles

When you create endpoints through the Azure portal, the required RBAC roles are automatically assigned to the system-assigned managed identities:

| Endpoint        | Role                          | Target resource           |
|-----------------|-------------------------------|---------------------------|
| Source endpoint | Key Vault Secrets User        | Your Azure Key Vault      |
| Target endpoint | Storage Blob Data Contributor | Your Azure Blob container |

If automatic assignment fails (for example, due to insufficient permissions), you must manually assign these roles or contact your Azure administrator.

## Create a migration project and job definition

After you define source and target endpoints for your migration, the next steps are to create a Storage Mover migration project and job definition.

### Create a project

1. Navigate to the **Projects** section under **Plan + run migrations** in your Storage Mover instance and select **Create project** in the **Projects** tab.
1. Provide values for the following fields:
   - **Name**: A meaningful name for the migration project.
   - **Project description**: A useful description for the project.
1. Select **Create** to create the project.

### Create a job definition

Select the project after it appears, then select **Create a job**. The job creation wizard has four tabs: **Basics**, **Schedule**, **Settings**, and **Review**.

#### Basics tab

1. Provide values for the following fields:

   | Field | Value |
   |---|---|
   | **Migration type** | Select **Multicloud migration** |
   | **Source type** | Select **OCI Object Storage - S3 (Preview)** |
   | **S3 bucket type** | Select **Public** or **Private (Preview)** |
   | **Name** | A meaningful name for the job |
   | **Description** | (Optional) A description for the job (1,024 characters max) |

1. In the **Source** section:
   - **Source endpoint**: Select **Add source endpoint** to create a new endpoint, or select an existing OCI S3-compatible source endpoint.
   - **Source sub-path**: (Optional) Specify a subfolder path to migrate only part of your bucket. If left empty, the job starts from the root of the bucket.
   - Verify the **Full path** shown is correct.
1. In the **Target** section:
   - **Target Endpoint**: Select **Add target endpoint** to create a new endpoint, or select an existing Azure Blob Storage target endpoint.
   - **Target sub-path**: (Optional) Specify a target subfolder. If left empty, all content is migrated to the container root.
1. If you selected **Private** for the S3 bucket type, a **Private connections** section appears:
   - Select **Add** to associate approved private connections with this job.
   - Only connections in **Approved** state can be added.
   - You can associate multiple private connections for load balancing.

   > [!NOTE]
   > Private buckets require private connections. You must have at least one approved private connection before you can start a job with the Private bucket type. See [Private network connectivity for OCI](cloud-to-cloud-private-network-configuration.md) for setup steps.

1. Select **Next** to continue.

#### Schedule tab

Choose when you want the migration to run:

| Option | Description |
|---|---|
| **No schedule** | Start the migration manually |
| **One-time schedule** | Run the migration once at a specific time |
| **Recurring schedule** | Run the migration on a daily, weekly, or monthly schedule |

> [!IMPORTANT]
> Scheduling isn't currently available for the OCI Object Storage - S3 source type. Jobs can only be run manually. Select **No schedule** and select **Next** to continue.

#### Settings tab

1. Select the desired **Copy mode** from the drop-down list:

   | Copy mode                     | Behavior |
   |-------------------------------|----------|
   | **Merge content into target** | Files are kept in the target even if they don't exist in the source. Files with matching names and paths are updated to match the source. |
   | **Mirror source to target**   | Makes the target an exact replica of the source. Objects deleted from the source are also deleted from the target. |

1. Review the **Migration outcomes** section to understand how your data is mapped. Directory structure, timestamps, and other metadata are preserved as custom blob metadata (max 4 KiB). Cloud migration protocol: **Blob REST API**.
1. Select **Next** to continue.

#### Review tab

Review the summary of your configuration:

- **Basics**: Job name, migration type
- **Source**: Source type, source URL with bucket name, cloud name (OCI), source subpath
- **Target**: Storage account, Azure blob container, target subpath
- **Schedule**: Migration frequency
- **Settings**: Copy mode

If all settings are correct, select **Create** to deploy the job.

## Run a migration job

### Start a job

1. Navigate to the **Projects** tab. Your newly created job appears in the list under your project.
1. Select your job definition to view its details in the **Properties** tab.
1. Select the **Start job** button.
1. In the **Start job** pane, confirm the job details and select **Start** to begin the migration.

The job runs in the background. You can monitor its progress in the **Migration overview** tab.

## Monitor migration progress

As you use Storage Mover to migrate your data, you should monitor the copy operations for potential issues. Data relating to the operations being performed during your migration is displayed within the **Migration overview** tab.

When configured, Azure Storage Mover also provides **Copy logs** and **Job run logs**. These logs allow you to trace the migration result of job runs and of individual files.

1. Navigate to the **Migration Jobs** tab.
1. Select your job to view progress, speed, and estimated completion time.
1. Select **Logs** to check for any errors or warnings.
1. After the migration is complete, verify the data in Azure Blob Storage.

To learn more, see [How to enable Azure Storage Mover copy and job logs](log-monitoring.md).

## Post-migration validation

Post-migration data validation ensures that your data is accurate and that the transfer from OCI to Azure Blob Storage is complete.

1. **Compare source and target**: Verify that all expected objects are transferred by comparing object counts and total data size between the OCI bucket and the Azure Blob container.
1. **Spot-check data integrity**: Download a representative sample of objects from both source and target and compare checksums.
1. **Enable incremental sync** (if needed): If you need to keep your OCI bucket and Azure Blob container in sync over time, schedule recurring job runs.
1. **Decommission source**: Delete the OCI bucket and Customer Secret Keys after migration is fully completed and verified. Remove the corresponding secrets from Azure Key Vault when no longer needed.

## Troubleshooting and support

If you encounter issues during your migration, begin troubleshooting by taking the following steps.

| Issue                | Resolution |
|----------------------|---|
| Migration job failed | Check the Copy and Job logs for detailed error messages. Common causes include invalid credentials or network connectivity issues. |
| Authentication error | Verify that the Access Key and Secret Key (OCI Customer Secret Keys) stored in Azure Key Vault are correct and haven't been deleted. Ensure the source endpoint's managed identity has **Key Vault Secrets User** access on your Key Vault. |
| Permission error on target | Verify that the target endpoint's managed identity has the **Storage Blob Data Contributor** role on the target Blob container. |
| Data transfer is slow | Ensure your network bandwidth is sufficient. OCI Object Storage might implement rate limits to S3-compatible API requests. Consider reducing the number of concurrent jobs if throttling occurs. |
| S3 client initialization fails / Source URL rejected | If your bucket name contains `_` or `.`, use path-style URLs instead of virtual-hosted-style. Ensure the source URL uses HTTPS, doesn't contain query parameters, fragments, or IP addresses, and points to a valid fully qualified domain name. |

If you're unable to resolve your issue, [create an Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Related content

- [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md)
- [Deploying a Storage Mover resource](storage-mover-create.md)
- [How to enable Azure Storage Mover copy and job logs](log-monitoring.md)
- [Manage Azure Storage Mover endpoints](endpoint-manage.md)
