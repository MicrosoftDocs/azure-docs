---
title: Quickstart - Configure a hybrid cluster with Azure Managed Instance for Apache Cassandra Client Configurator
description: This quickstart shows how to configure a hybrid cluster with Azure Managed Instance for Apache Cassandra Client Configurator.
author: IriaOsara
ms.author: iriaosara
ms.service: managed-instance-apache-cassandra
ms.topic: quickstart
ms.date: 10/11/2023
ms.devlang: azurecli
ms.custom: ignite-2023, devx-track-azurecli
---
# Quickstart: Configure a hybrid cluster with Azure Managed Instance for Apache Cassandra using Client Configurator

The Azure  Client configurator is a tool designed to assist you in configuring a hybrid cluster and simplifying the migration process to Azure Managed Instance for Apache Cassandra. If you currently have on-premises datacenters or are operating in a self-hosted environment, you can use Azure Managed Instance for Apache Cassandra to seamlessly incorporate other datacenters into your cluster while effectively maintaining them.

> [!IMPORTANT]
> Client Configurator tool is in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

* This article requires the Azure CLI version 2.30.0 or higher. If you are using Azure Cloud Shell, the latest version is already installed.

* [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) with connectivity to your self-hosted or on-premises environment. For more information on connecting on premises environments to Azure, see the [Connect an on-premises network to Azure](/azure/architecture/reference-architectures/hybrid-networking/) article.

* Python installation is required. You can check if  python is installed by running `python --version` in your terminal.

* Ensure that both the Azure Managed Instance and on-premises Cassandra cluster are located on the same virtual network. If not, it is necessary to establish network peering or other means of connectivity (for example, express route).

* The cluster name for both the Managed cluster and local cluster must be the same.
        * In the cassandra.yaml file ensure the storage port is set to 7001 and  the cluster name is same as the managed cluster:

 ```bash
cluster_name: managed_cluster-name
storage_port: 7001
 ```

```sql
UPDATE system.local SET cluster_name = 'managed_cluster-name' where key='local';
```

## Installation

* Download and navigate into the [client configurator folder](https://aka.ms/configurator-tool).
* Set up a virtual environment to run the python script:

```bash
python3 -m venv env
source env/bin/activate
python3 -m pip install -r requirements.txt
```

* Sign into Azure CLI `az login`
* Run the python script within the client folder with information from the existing (on-premises) cluster:

```python
python3 client_configurator.py --subscription-id <subcriptionId> --cluster-resource-group <clusterResourceGroup> --cluster-name <clusterName> --initial-password <initialPassword> --vnet-resource-group <vnetResourceGroup> --vnet-name <vnetName> --subnet-name <subnetName> --location <location> --seed-nodes <seed1 seed2 seed3> --mi-dc-name <managedInstanceDataCenterName> --dc-name <onPremDataCenterName> --sku <sku>
```

> [!NOTE]
> - subscription-id: Azure subscription id.
> - cluster-resource-group: Resource group which your cluster resides.
> - cluster-name: Azure Managed Instance cluster name.
> - initial-password: Password for your Azure Managed Instance for Apache Cassandra cluster.
> - vnet-resource-group: The resource group attached to the virtual network.
> - vnet-name: Name of the virtual network attached to your cluster.
> - subnet-name: The name of the IP addressed allocated to the Cassandra cluster.
> - location: Where your cluster is deployed.
> - seed-nodes: The seed nodes of the existing datacenters in your on-premises or self-hosted Cassandra cluster.
> - mi-dc-name: The data center name of your Azure Managed Instance cluster.
> - dc-name: The data center name of the on-prem cluster.
> - sku: The virtual machine SKU size.

* The Python script produces a tar archive named `install_certs.tar.gz`.
        * Unpack this folder into `/etc/cassandra/` on each node.

    ```bash
    sudo tar -xzvf install_certs.tar.gz -C /etc/cassandra
    ```

* Inside the `/etc/cassandra/` folder, run `sudo ./install_certs.sh`.
        *Ensure that the script is executable by running `sudo chmod +x install_certs.sh`.
        *The script installs and point Cassandra towards the new certs needed to connect to the Azure Managed Instance cluster.
        *It then prompts user to restart Cassandra.
        :::image type="content" source="./media/configure-hybrid-cluster/script-result.png" alt-text="Screenshot of the result of running the script.":::

* Once Cassandra has finished restarting on all nodes, check `nodetool status`. Both datacenters should appear in the list, with their nodes in the UN (Up/Normal) state.

* From your Azure Managed Instance for Apache Cassandra, you can then select `AllKeyspaces` to change the replication settings in your Keyspace schema and start the migration process to Cassandra Managed Instance cluster.

   :::image type="content" source="./media/create-cluster-portal/cluster-version.png" alt-text="Screenshot of selecting all key spaces." lightbox="./media/create-cluster-portal/cluster-version.png" border="true":::

> [!WARNING]
> This will change all your keyspaces definition to include 
> `WITH REPLICATION = {  'class' : 'NetworkTopologyStrategy',  'on-prem-datacenter-1' : 3, 'mi-datacenter-1': 3 }`.
> If this is not the topology you want, you will need to adjust it and run `nodetool rebuild` manually on the Cassandra Managed Instance cluster.
> Learn more about [Auto-Replication](https://aka.ms/auto-replication)

* Update and monitor data replication progress by selecting the `Data Center` pane

   :::image type="content" source="./media/configure-hybrid-cluster/replication-progress.png" alt-text="Screenshot showing replication progress." lightbox="./media/configure-hybrid-cluster/replication-progress.png" border="true":::

## Next steps

In this quickstart, you learned how to create a hybrid cluster using Azure Managed Instance for Apache Cassandra Client Configurator. You can now start working with the cluster.

> [!div class="nextstepaction"]
> [Learn how to migrate to Azure Managed Instance for Apache Cassandra by using Apache Spark and a dual-write proxy](dual-write-proxy-migration.md)
