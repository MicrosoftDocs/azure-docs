---
title: Azure HDInsight Encryption in transit
description: Learn about security features to provide encryption in transit for your Azure HDInsight cluster.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/23/2023
---

# IPSec Encryption in transit for Azure HDInsight

This article discusses the implementation of encryption in transit for communication between Azure HDInsight cluster nodes.

## Background

Azure HDInsight offers a variety of security features for securing your enterprise data. These solutions are grouped under the pillars of perimeter security, authentication, authorization, auditing, encryption, and compliance. Encryption can be applied to data both at rest and in transit.

Encryption at rest is covered by server-side encryption on Azure storage accounts, as well as disk encryption on the Azure VMs that are a part of your HDInsight cluster.

Encryption of data in transit on HDInsight is achieved with [Transport Layer Security (TLS)](../transport-layer-security.md) for accessing the cluster gateways and [Internet Protocol Security (IPSec)](https://wikipedia.org/wiki/IPsec) between cluster nodes. IPSec can be optionally enabled between all head nodes, worker nodes, edge nodes, zookeeper nodes as well as gateway and [id broker](./identity-broker.md) nodes.

## Enable encryption in transit

### Azure portal

To create a new cluster with encryption in transit enabled using the Azure portal, do the following steps:

1. Begin the normal cluster creation process. See [Create Linux-based clusters in HDInsight by using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md) for initial cluster creation steps.
1. Complete the **Basics** and **Storage** tabs. Proceed to the **Security + Networking** tab.

    :::image type="content" source="media/encryption-in-transit/create-cluster-security-networking-tab.png" alt-text="Create cluster - security and networking tab.":::

1. On the **Security + Networking** tab, select the **Enable encryption in transit** checkbox.

    :::image type="content" source="media/encryption-in-transit/enable-encryption-in-transit.png" alt-text="Create cluster - enable encryption in transit.":::

### Create a cluster with encryption in transit enabled through the Azure CLI

Encryption in transit is enabled using the `isEncryptionInTransitEnabled` property.

You can [download a sample template and parameter file](https://github.com/Azure-Samples/hdinsight-enterprise-security). Before using the template and the Azure CLI code snippet below, replace the following placeholders with their correct values:

| Placeholder | Description |
|---|---|
| `<SUBSCRIPTION_ID>` | The ID of your Azure subscription |
| `<RESOURCE_GROUP>` | The resource group where you want the new cluster and storage account created. |
| `<STORAGEACCOUNTNAME>` | The existing storage account that should be used with the cluster. The name should be of the form `ACCOUNTNAME.blob.core.windows.net` |
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

az deployment group create --name HDInsightEnterpriseSecDeployment \
    --resource-group <RESOURCEGROUPNAME> \
    --template-file hdinsight-enterprise-security.json \
    --parameters parameters.json
```

## Next steps

* [Overview of enterprise security in Azure HDInsight](hdinsight-security-overview.md)
* [Synchronize Microsoft Entra users to an HDInsight cluster](../disk-encryption.md).
