---
title: Migrate data from on-premises S3-compatible object storage to Azure Blob Storage with Azure Storage Mover
description: Learn how to migrate data from on-premises S3-compatible object storage (such as MinIO, Dell ECS, or NetApp StorageGRID) to Azure Blob Storage by using Azure Storage Mover over hybrid connectivity.
author: rajsinghmsa
ms.author: singra
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 10/06/2026
ms.collection:
  - migration
---

# Migrate data from on-premises S3-compatible object storage to Azure Blob Storage with Azure Storage Mover (preview)

The S3 (Simple Storage Service) source migration feature in Azure Storage Mover securely transfers data from S3-compatible object storage that runs in your own datacenter to Azure Blob Storage. On-premises S3-compatible systems include products such as MinIO, Dell ECS, and others.

Because the source runs on-premises, the migration also depends on hybrid network connectivity between your datacenter and Azure. Storage Mover reaches your S3 endpoint over an ExpressRoute circuit or a site-to-site VPN, using the same private-connection model that Storage Mover uses for other cloud-to-cloud scenarios.

This article guides you through the complete process of configuring Storage Mover to migrate your data from an on-premises S3-compatible source to Azure Blob Storage. The process consists of preparing your S3 endpoint, storing source credentials in Azure Key Vault, configuring source and target endpoints, and creating and running a migration job.

## Prerequisites

Before you begin, ensure that you have:

- An active Azure subscription with permissions to create and manage Azure Storage Mover resources.
- An on-premises S3-compatible object storage system that exposes an Amazon S3 API endpoint over HTTPS.
- Network connectivity between your on-premises datacenter and Azure (ExpressRoute or site-to-site VPN). See [Configure private network connectivity](on-premises-private-network-configuration.md?pivots=on-premises-s3).
- A publicly trusted, CA-signed TLS certificate installed on your S3 endpoint. Self-signed certificates and private/internal-CA certificates aren't supported.
- An Azure Storage account to use as the destination.
- A Storage Mover resource deployed in your Azure subscription.
- An Azure Key Vault to securely store your source access key credentials.
- S3 access keys (Access Key ID and Secret Key) generated on your on-premises appliance. See [Generate S3 access keys on your appliance](#generate-s3-access-keys-on-your-appliance).

## Limits

The S3-compatible on-premises source migration feature in Azure Storage Mover has the following limits:

- Each migration job supports the transfer of 500 million objects.
- Each subscription supports up to 10 concurrent jobs. To run more than 10 jobs, create a support request.
- Only HTTPS access to the S3-compatible source is supported. The protocol and port are HTTPS, TCP 443.
- The Storage Mover data plane trusts only publicly trusted CA-signed certificates for S3-compatible endpoints. Self-signed or private-CA certificates cause the connection to fail.
- The S3-compatible source must support AWS Signature Version 4 (SigV4) style authentication.
- The source endpoint must be a fully qualified domain name (FQDN) reachable over HTTPS. Raw IP-address endpoints aren't supported.
- You must use path-style URLs to access buckets with names that contain characters that aren't DNS-compatible (for example, `_` or `.`). Virtual-hosted-style URLs aren't supported for these buckets, because S3 client initialization can fail on DNS resolution.

## Things to know

Before you begin your migration, review the following considerations specific to on-premises S3-compatible source migrations:

### Authentication method

On-premises S3-compatible access uses HMAC access keys (an Access Key ID and a Secret Key) that your storage appliance issues. These keys enable the appliance to respond to standard S3 API requests by using the AWS Signature Version 4 authentication process. The exact steps to create keys differ by vendor. Consult your vendor's documentation.

### TLS certificate requirement

The Storage Mover data plane connects to your S3 endpoint only over HTTPS (TCP 443), and it validates the endpoint's TLS certificate against publicly trusted certificate authorities.

> [!IMPORTANT]
> Your S3 endpoint must present a publicly trusted, CA-signed certificate whose subject or subject alternative name (SAN) matches the endpoint FQDN. Self-signed certificates, private/internal enterprise-CA certificates, and IP-address-only certificates aren't supported. Many on-premises appliances ship with a self-signed certificate by default, so plan to install a CA-signed certificate before you migrate.

### Network connectivity requirement

Because the source is on-premises, Storage Mover reaches it over hybrid connectivity rather than the public internet. You need an ExpressRoute circuit or a site-to-site VPN between your datacenter and Azure, plus a Storage Mover private connection that targets your S3 endpoint. For setup steps, see [Configure private network connectivity](on-premises-private-network-configuration.md?pivots=on-premises-s3).

### Generate S3 access keys on your appliance

To access your on-premises bucket through the S3-compatible interface, generate an Access Key ID and Secret Key on your storage system. The exact procedure varies by vendor; the general pattern is:

1. Sign in to your storage system's management console or CLI.
1. Locate the identity or account that has read access to the target bucket.
1. Generate an S3-style access key pair (Access Key ID and Secret Key).

   > [!IMPORTANT]
   > Copy the **Secret Key** immediately. Many systems display it only once and can't retrieve it later.

1. Confirm that the identity has, at minimum, read and list permissions on the buckets and objects you plan to migrate.

For exact steps, refer to your vendor's documentation (for example, MinIO, Dell ECS, NetApp StorageGRID, Cloudian, Scality, or Pure Storage FlashBlade).

### Determine your on-premises S3 endpoint URL

Enter your endpoint URL in path-style format. The host must be a publicly resolvable FQDN that matches the endpoint's CA-signed certificate:

- Path-style: `https://<s3-endpoint-fqdn>/<bucket>/`
- Virtual-hosted-style: `https://<bucket>.<s3-endpoint-fqdn>/`

> [!NOTE]
> Use path-style URLs for buckets whose names contain characters (such as `_` or `.`) that aren't DNS-compatible. Virtual-hosted-style addressing also requires a wildcard DNS record and a matching wildcard (or per-bucket) certificate, which many on-premises deployments don't provide.

## Store source credentials in Azure Key Vault

After you generate access keys on your appliance, store them as secrets in Key Vault so the Azure Storage Mover service can securely access them.

1. Using the [Azure portal](https://portal.azure.com), go to the Key Vault that resides within the same subscription as your Storage Mover resource.
1. In the left navigation, expand the **Objects** menu and select **Secrets**. Next, select **Generate/Import**.
1. Create a secret for the **Access Key**:
   - **Name**: Enter a meaningful name (for example, `onprem-s3-access-key`).
   - **Secret value**: Paste the Access Key ID value from the previous section.
   - Select **Create**.
1. Create a second secret for the **Secret Key**:
   - **Name**: Enter a meaningful name (for example, `onprem-s3-secret-key`).
   - **Secret value**: Paste the Secret Key value from the previous section.
   - Select **Create**.
1. Note the full **Secret Identifier** URI for each secret. You need these identifiers when creating the source endpoint.

> [!NOTE]
> To ensure optimal security, disable public access on the Key Vault containing the secrets and add Storage Mover as a trusted service.

For more information, see [Set and retrieve a secret from Key Vault using Azure portal](/azure/key-vault/secrets/quick-create-portal).

## Configure source and target endpoints

After you store your credentials in your Key Vault, create your migration's source and target endpoints.

In the context of the Azure Storage Mover service, an endpoint is a resource that contains the path to either a source or target location and other relevant information. Storage Mover job definitions use endpoints to define the source and target locations for copy operations.

### Configure an on-premises S3-compatible source endpoint

Source endpoints identify locations from which your data is migrated. The following steps describe the process of creating a source endpoint.

1. Go to your Storage Mover instance in the Azure portal.
1. From the **Resource management** group in the left navigation, select **Storage endpoints**. Select the **Source endpoints** tab, and then select **Create endpoint** to open the **Create source endpoint** pane.
1. In the **Create source endpoint** pane:
   - Select **Multicloud migration** as the **Migration type**.
   - Select **S3-compatible object storage** as the **Source type**.
   - **Source URL**: Enter the full HTTPS URL to your bucket in S3-compatible (path-style) format. Use the format `https://<s3-endpoint-fqdn>/<bucket-name>/`, or append `<prefix>/` to migrate only a subset of objects. Use path-style addressing for buckets whose names contain `_` or `.`.
   - **Access Key Vault Secret URI**: Enter the full URI of the secret containing your Access Key Vault.
   - **Secret Key Vault Secret URI**: Enter the full URI of the secret containing your Secret Key Vault.
   - Optionally, provide a **Description** for the endpoint.
1. Verify that your selections are correct and select **Create** to create the endpoint.

   > [!NOTE]
   > When you create the source endpoint, the portal automatically provisions a system-assigned managed identity. This identity needs the **Key Vault Secrets User** Role-Based Access Control (RBAC) role on your Key Vault to retrieve the credentials during migration. The portal tries to assign this role automatically. If the assignment fails because of insufficient permissions, assign it manually or contact your Azure administrator.

### Configure an Azure Blob Storage target endpoint

1. From the **Resource management** group in the left navigation, select **Storage endpoints**. Select the **Target endpoints** tab, and then select **Add endpoint** to open the **Create target endpoint** pane.
1. In the **Create target endpoint** pane:
   - Select your **Subscription** and **Storage account** from the respective drop-down lists.
   - Select **Blob container** from the **Target Type** field.
   - Choose the **Blob container** to which you want to migrate from the drop-down list.
   - Optionally, provide a **Description** for the endpoint.
1. Verify that your selections are correct and select **Create** to create the endpoint.

### Assign RBAC roles

When you create endpoints through the Azure portal, the system automatically assigns the required RBAC roles to the system-assigned managed identities:

| Endpoint        | Role                          | Target resource           |
|-----------------|-------------------------------|---------------------------|
| Source endpoint | Key Vault Secrets User        | Your Key Vault      |
| Target endpoint | Storage Blob Data Contributor | Your Azure Blob container |

If automatic assignment fails (for example, due to insufficient permissions), manually assign these roles or contact your Azure administrator.

## Create a migration project and job definition

After you define source and target endpoints for your migration, create a Storage Mover migration project and job definition.

### Create a project

1. In your Storage Mover instance, go to the **Projects** section under **Plan + run migrations**. In the **Projects** tab, select **Create project**.
1. Enter values for the following fields:
   - **Name**: A meaningful name for the migration project.
   - **Project description**: A useful description for the project.
1. Select **Create** to create the project.

### Create a job definition

Select the project after it appears, and then select **Create a job**. The job creation wizard has four tabs: **Basics**, **Schedule**, **Settings**, and **Review**.

#### Basics tab

1. Enter values for the following fields:

   | Field | Value |
   |---|---|
   | **Migration type** | Select **Multicloud migration** |
   | **Source type** | Select **S3-compatible object storage (Preview)** |
   | **S3 bucket type** | Select **Private (Preview)** |
   | **Name** | A meaningful name for the job |
   | **Description** | (Optional) A description for the job (1,024 characters max) |

   > [!NOTE]
   > The service reaches on-premises S3 endpoints over hybrid connectivity, so select **Private** as the bucket type and associate an approved private connection. See [Configure private network connectivity](on-premises-private-network-configuration.md?pivots=on-premises-s3).

1. In the **Source** section:
   - **Source endpoint**: Select **Add source endpoint** to create a new endpoint, or select an existing on-premises S3-compatible source endpoint.
   - **Source sub-path**: (Optional) Specify a subfolder path to migrate only part of your bucket. If you leave this field empty, the job starts from the root of the bucket.
   - Verify the **Full path** shown is correct.
1. In the **Target** section:
   - **Target Endpoint**: Select **Add target endpoint** to create a new endpoint, or select an existing Azure Blob Storage target endpoint.
   - **Target sub-path**: (Optional) Specify a target subfolder. If you leave this field empty, all content is migrated to the container root.
1. In the **Private connections** section:
   - Select **Add** to associate approved private connections with this job.
   - You can only add connections in **Approved** state.
   - You can associate multiple private connections for load balancing.

   > [!NOTE]
   > You must have at least one approved private connection before you can start a job against an on-premises S3 endpoint. See [Configure private network connectivity](on-premises-private-network-configuration.md?pivots=on-premises-s3) for setup steps.

1. Select **Next** to continue.

#### Schedule tab

Choose when you want the migration to run:

| Option | Description |
|---|---|
| **No schedule** | Start the migration manually |
| **One-time schedule** | Run the migration once at a specific time |
| **Recurring schedule** | Run the migration on a daily, weekly, or monthly schedule |

> [!IMPORTANT]
> Scheduling isn't currently available for the S3-compatible source type. You can only run jobs manually. Select **No schedule** and select **Next** to continue.

#### Settings tab

1. Select the desired **Copy mode** from the drop-down list:

   | Copy mode                     | Behavior |
   |-------------------------------|----------|
   | **Merge content into target** | Files are kept in the target even if they don't exist in the source. Files with matching names and paths are updated to match the source. |
   | **Mirror source to target**   | Makes the target an exact replica of the source. Objects deleted from the source are also deleted from the target. |

1. Review the **Migration outcomes** section to understand how your data is mapped. The service preserves directory structure, timestamps, and other metadata as custom blob metadata (max 4 KiB). Cloud migration protocol: **Blob REST API**.
1. Select **Next** to continue.

#### Review tab

Review the summary of your configuration:

- **Basics**: Job name, migration type
- **Source**: Source type, source URL with bucket name, source subpath
- **Target**: Storage account, Azure blob container, target subpath
- **Schedule**: Migration frequency
- **Settings**: Copy mode

If all settings are correct, select **Create** to deploy the job.

## Run a migration job

### Start a job

1. Go to the **Projects** tab. Your newly created job appears in the list under your project.
1. Select your job definition to view its details in the **Properties** tab.
1. Select the **Start job** button.
1. In the **Start job** pane, confirm the job details and select **Start** to begin the migration.

The job runs in the background. You can monitor its progress in the **Migration overview** tab.

## Monitor migration progress

As you use Storage Mover to migrate your data, monitor the copy operations for potential issues. The **Migration overview** tab displays data about the operations being performed during your migration.

When configured, Azure Storage Mover also provides **Copy logs** and **Job run logs**. Use these logs to trace the migration result of job runs and of individual files.

1. Go to the **Migration Jobs** tab.
1. Select your job to view progress, speed, and estimated completion time.
1. Select **Logs** to check for any errors or warnings.
1. After the migration is complete, verify the data in Azure Blob Storage.

To learn more, see [How to enable Azure Storage Mover copy and job logs](log-monitoring.md).

## Post-migration validation

Post-migration data validation ensures that your data is accurate and that the transfer from your on-premises S3-compatible source to Azure Blob Storage is complete.

1. **Compare source and target**: Verify that all expected objects are transferred by comparing object counts and total data size between the on-premises bucket and the Azure Blob container.
1. **Spot-check data integrity**: Download a representative sample of objects from both source and target and compare checksums.
1. **Enable incremental sync** (if needed): If you need to keep your on-premises bucket and Azure Blob container in sync over time, schedule recurring job runs. (Not currently available for the S3-compatible source type; run jobs manually.)
1. **Decommission source**: Delete the on-premises access keys after migration is fully completed and verified. Remove the corresponding secrets from Key Vault when no longer needed.

## Troubleshooting and support

If you encounter issues during your migration, begin troubleshooting by taking the following steps.

| Issue                | Resolution |
|----------------------|---|
| Migration job failed | Check the Copy and Job logs for detailed error messages. Common causes include invalid credentials, certificate trust failures, or network connectivity issues. |
| TLS or certificate error | Verify that the S3 endpoint presents a publicly trusted, CA-signed certificate whose subject or SAN matches the endpoint FQDN. Self-signed and private-CA certificates aren't supported. |
| Authentication error | Verify that the Access Key and Secret Key stored in Key Vault are correct and aren't deleted. Ensure the source endpoint's managed identity has **Key Vault Secrets User** access on your Key Vault. |
| Permission error on target | Verify that the target endpoint's managed identity has the **Storage Blob Data Contributor** role on the target Blob container. |
| Endpoint unreachable | Confirm that the ExpressRoute circuit or site-to-site VPN is up, that routing reaches the S3 endpoint, and that the Storage Mover private connection is in **Approved** state. |
| Data transfer is slow | Ensure your hybrid link (ExpressRoute or VPN) has sufficient bandwidth. Add more private connections for load balancing, and confirm the appliance isn't rate-limiting S3 API requests. |
| S3 client initialization fails / Source URL rejected | If your bucket name contains `_` or `.`, use path-style URLs instead of virtual-hosted-style. Ensure the source URL uses HTTPS, resolves to a valid FQDN (not an IP address), and doesn't contain query parameters or fragments. |

If you're unable to resolve your issue, [create an Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Related content

- [Configure private network connectivity](on-premises-private-network-configuration.md?pivots=on-premises-s3)
- [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md)
- [Deploying a Storage Mover resource](storage-mover-create.md)
- [How to enable Azure Storage Mover copy and job logs](log-monitoring.md)
- [Manage Azure Storage Mover endpoints](endpoint-manage.md)
