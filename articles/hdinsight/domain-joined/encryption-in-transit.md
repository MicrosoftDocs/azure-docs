---
title: Azure HDInsight Encryption in transit
description: Learn about security features to provide encyrption in transit for your Azure HDInsight cluster.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 07/10/2020
---

# Encryption in transit for Azure HDInsight

This article discusses the HDInsight implementation of encryption in transit for all communication between cluster nodes.

## Background

Azure HDInsight now offers enhanced encryption for your data in transit. The encryption scheme uses two independent layers of encryption to protect against the compromise of any single layer of encryption. These encryption layers are:

1. Service-level encryption - TLS
2. Infrastructure-layer encryption - IPSec

The use of two layers of encryption will provide a mitigation against common crypto threats, such as:

1. Compromising a single encryption key
1. Misconfigurations
1. Weaknesses/implementation flaws in encryption protocols

## Enable encryption in transit

### Azure portal

To create a new cluster with encryption in transit enabled using the Azure portal, do the following steps:

1. Begin the normal cluster creation process. See [Some article](my-url.md) for initial cluster creation steps.
1. Complete the **Basics** and **Storage** tabs. Proceed to the **Security + Networking** tab.

:::image type="content" source="media/encryption-in-transit/create-cluster-security-networking-tab.png" alt-text="Create cluster - security and networking tab.":::

1. On the **Security + Networking** tab, click the **Enable encryption in transit** checkbox.

:::image type="content" source="media/encryption-in-transit/enable-encryption-in-transit.png" alt-text="Create cluster - enable encryption in transit.":::

### Create a cluster with encryption in transit enabled through the Azure CLI

Encryption in transit is enabled using the `isEncryptionInTransitEnabled` property.

You can [download a sample template and parameter file](https://github.com/Azure-Samples/hdinsight-enterprise-security). Before using the template and the Azure CLI code snippet below, replace the following placeholders with their correct values:

| Placeholder | Description |
|---|---|
| `<SUBSCRIPTION_ID>` | The ID of your Azure subscription |
| `<RESOURCE_GROUP>` | The resource group where you want the new cluster and storage account created. |
| `<STORAGEACCOUNTNAME>` | The existing storage account which should be used with the cluster. The name should be of the form `ACCOUNTNAME.blob.core.windows.net` |
| `<CLUSTERNAME>` | The name of your HDInsight cluster. |
| `<PASSWORD>` | Your chosen password for signing in to the cluster using SSH and the Ambari dashboard. |
| `<VNET_NAME>` | The virtual network where the cluster will be deployed. |

The code snippet below does the following initial steps:

1. Logs in to your Azure account.
1. Sets the active subscription where the create operations will be done.
1. Creates a new resource group for the new deployment activities.
1. Deploy the template to create a new cluster.

```azurecli
az login
az account set --subscription <SUBSCRIPTION_ID>

# Create resource group
az group create --name <RESOURCEGROUPNAME> --location eastus2

az group deployment create --name HDInsightEnterpriseSecDeployment \
    --resource-group <RESOURCEGROUPNAME> \
    --template-file hdinsight-enterprise-security.json \
    --parameters parameters.json
```

## Next steps

* [Overview of enterprise security in Azure HDInsight](hdinsight-security-overview.md)
* [Synchronize Azure Active Directory users to an HDInsight cluster](../hdinsight-sync-aad-users-to-cluster.md).
