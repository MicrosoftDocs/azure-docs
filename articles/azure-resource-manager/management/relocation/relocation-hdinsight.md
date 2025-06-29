---
title: Relocate Azure HDInsight clusters to another region
description: Learn how to relocate Azure HDInsight clusters to another region
ms.date: 05/08/2025
ms.topic: how-to
ms.custom: subject-relocation, devx-track-azurepowershell
---

# Relocate Azure HDInsight to Another Region

This article provides step-by-step guidance on relocating an Azure HDInsight cluster to a new region.

## Prerequisites

Before starting the relocation process, ensure the following prerequisites are met:

- **Identify dependent resources**: Gather all Azure HDInsight-dependent resources. Depending on your deployment, the following resources may need to be deployed and configured in the target region before relocation:

  - Compute (virtual machines)
  - Azure SQL Database (metastore)
  - [Storage Account or Data Lake Gen 2](./relocation-storage-account.md)
  - [Azure Key Vault](./relocation-key-vault.md)
  - Public IP address
  - Private Endpoint
  - [Azure Virtual Network](./relocation-virtual-network.md)
  - Azure Active Directory, Azure Active Directory Domain, Managed Identity Services, Enterprise Security Package
  - Azure DNS
  - Quota availability in the target region ([request quota increase](../../../hdinsight/quota-increase-request.md)).

- **Verify regional support**: Confirm that HDInsight and its dependent resources are supported in the target region.
- **Prepare the target landing zone**: Ensure the target landing zone is ready and matches the assessed architecture.
- **Document network settings**: Record network configurations, including firewalls and isolation settings.
- **Identify metastore databases**: List all metastore databases configured in the source cluster.
- **Review installed applications**: Document installed HDInsight applications and action scripts performed.
- **Check availability zone support**: Verify that the target region supports availability zones. For more information, see [Region availability](../../../hdinsight/hdinsight-use-availability-zones.md#prerequisites-and-region-availability).

## Downtime Considerations

Understand potential downtimes involved in the relocation process. For more information, see [Cloud Adoption Framework for Azure: Select a relocation method](/azure/cloud-adoption-framework/relocate/select#select-a-relocation-method).

## Prepare for Relocation

### Export a Template

Export an Azure Resource Manager (ARM) JSON template or a Bicep file for your HDInsight cluster. These templates define and automate the deployment of HDInsight clusters and their associated resources. Use one of the following methods to export the template:

- [Export Bicep file using the Azure portal](../../bicep/export-bicep-portal.md)
- [Export ARM template using the Azure portal](../../templates/export-template-portal.md)
- [Export ARM template using Azure CLI](../../templates/export-template-cli.md)
- [Export ARM template using Azure PowerShell](../../templates/export-template-powershell.md)

### Modify the Template

Update the exported Bicep file or ARM template to reflect the new region. Ensure all resource details, such as storage accounts, managed identities, user accounts (for example, `sshuser`), network configurations, and metastore databases, are updated accordingly.

### Relocate the Source Storage Account

Relocate the source storage account to the target region. For detailed steps, see [Relocate storage account to another region](./relocation-storage-account.md).

### Relocate Associated Jobs

Relocate jobs associated with the HDInsight cluster to the target region. Follow the appropriate guidance based on your HDInsight implementation:

- **Oozie pipeline/workflow**: Use the Hue import/export method. See [Migrate pipelines using Hue UI](https://gethue.com/exporting-and-importing-oozie-workflows/).
- **HBase workload**: Use backup and replication. See [Backup and replication method](../../../hdinsight/hbase/apache-hbase-backup-replication.md).
- **Kafka workload**: Use Mirror Maker. See [Mirror Maker](../../../hdinsight/kafka/apache-kafka-mirroring.md).

### Sync Data

Perform delta data synchronization from the source storage to the target storage using Azure Data Factory (ADF) or another defined data migration plan.

## Redeploy the Cluster

Deploy the updated Bicep file or ARM template to create the HDInsight cluster in the target region. For more information, see:

- [Deploy Bicep files from VS Code](../../bicep/deploy-vscode.md)
- [Deploy Bicep files by using Azure CLI](../../bicep/deploy-cli.md)
- [Deploy Bicep files by using Azure PowerShell](../../bicep/deploy-powershell.md)
- [Deploy Bicep files by using Azure Cloud Shell](../../bicep/deploy-cloud-shell.md)
- [Deploy ARM template files by using Azure CLI](../../templates/deploy-cli.md)
- [Deploy ARM template files by using Azure PowerShell](../../templates/deploy-powershell.md)
- [Deploy ARM template files by using Azure Cloud Shell](../../templates/deploy-cloud-shell.md)

## Validate the Relocation

After relocation, validate the HDInsight cluster and its dependent resources. Perform smoke and integration tests to ensure all configurations are correct and data is accessible.

## Clean Up

(Optional) Discard or clean up resources in the source region if they're no longer needed.

## Next Steps

For more information on moving resources and disaster recovery in Azure, see:

- [Move resources to a new resource group or subscription](../move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../../../site-recovery/azure-to-azure-tutorial-migrate.md)
