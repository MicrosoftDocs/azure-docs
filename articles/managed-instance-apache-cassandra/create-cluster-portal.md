---
title: Quickstart - Create Azure Managed Instance for Apache Cassandra cluster from the Azure portal
description: This quickstart shows how to create an Azure Managed Instance for Apache Cassandra cluster using the Azure portal.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom:
  - mode-ui
  - ignite-2023
---
# Quickstart: Create an Azure Managed Instance for Apache Cassandra cluster from the Azure portal

Azure Managed Instance for Apache Cassandra is a fully managed service for pure open-source Apache Cassandra clusters. The service also allows configurations to be overridden, depending on the specific needs of each workload, allowing maximum flexibility and control where needed

This quickstart demonstrates how to use the Azure portal to create an Azure Managed Instance for Apache Cassandra cluster.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a managed instance cluster

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. From the search bar, search for **Managed Instance for Apache Cassandra** and select the result.

   :::image type="content" source="./media/create-cluster-portal/search-portal.png" alt-text="Screenshot of search for Azure SQL Managed Instance for Apache Cassandra." lightbox="./media/create-cluster-portal/search-portal.png" border="true":::

1. Select **Create Managed Instance for Apache Cassandra cluster** button.

   :::image type="content" source="./media/create-cluster-portal/create-cluster.png" alt-text="Create the cluster." lightbox="./media/create-cluster-portal/create-cluster.png" border="true":::

1. From the **Create Managed Instance for Apache Cassandra** pane, enter the following details:

   * **Subscription** - From the drop-down, select your Azure subscription.
   * **Resource Group**- Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group](../azure-resource-manager/management/overview.md) overview article.
   * **Cluster name** - Enter a name for your cluster.
   * **Location** - Location where your cluster will be deployed to.
   * **Cassandra version** - Version of Apache Cassandra that will be deployed.
   * **Extention** - Extensions that will be added, including [Cassandra Lucene Index](search-lucene-index.md).
   * **Initial Cassandra admin password** - Password that is used to create the cluster.
   * **Confirm Cassandra admin password** - Reenter your password.
   * **Virtual Network** - Select an Exiting Virtual Network and Subnet, or create a new one. 
   * **Assign roles** - Virtual Networks require special permissions in order to allow managed Cassandra clusters to be deployed. Keep this box checked if you are creating a new Virtual Network, or using an existing Virtual Network without permissions applied. If using a Virtual network where you have already deployed Azure SQL Managed Instance Cassandra clusters, uncheck this option.

   :::image type="content" source="./media/create-cluster-portal/create-cluster-page.png" alt-text="Fill out the create cluster form." lightbox="./media/create-cluster-portal/create-cluster-page.png" border="true":::

   > [!TIP]
   > If you use [VPN](use-vpn.md) then you don't need to open any other connection.

   > [!NOTE]
   > The Deployment of a Azure Managed Instance for Apache Cassandra requires internet access. Deployment fails in environments where internet access is restricted. Make sure you aren't blocking access within your VNet to the following vital Azure services that are necessary for Managed Cassandra to work properly. See [Required outbound network rules](network-rules.md) for more detailed information.
   > - Azure Storage
   > - Azure KeyVault
   > - Azure Virtual Machine Scale Sets
   > - Azure Monitoring
   > - Microsoft Entra ID
   > - Azure Security

   * **Auto Replicate** - Choose the form of auto-replication to be utilized. [Learn more](#turnkey-replication)
    * **Schedule Event Strategy** - The strategy to be used by the cluster for scheduled events.
    
    > [!TIP]
    > - StopANY means stop any node when there is a scheduled even for the node. 
    > - StopByRack means only stop node in a given rack for a given Scheduled Event, e.g. if two or more events are scheduled for nodes in different racks at the same time, only nodes in one rack will be stopped whereas the other nodes in other racks are delayed.

1. Next select the **Data center** tab.

1. Enter the following details:

   * **Data center name** - Type a data center name in the text field.
   * **Availability zone** - Check this box if you want availability zones to be enabled.
   * **SKU Size** - Choose from the available Virtual Machine SKU sizes.
   
   :::image type="content" source="./media/create-cluster-portal/l-sku-sizes.png" alt-text="Screenshot of select a SKU Size." lightbox="./media/create-cluster-portal/l-sku-sizes.png" border="true":::


    > [!NOTE]
    > We have introduced write-through caching (Public Preview) through the utilization of L-series VM SKUs. This implementation aims to minimize tail latencies and enhance read performance, particularly for read intensive workloads. These specific SKUs are equipped with locally attached disks, ensuring hugely increased IOPS for read operations and reduced tail latency.

    > [!IMPORTANT]
    > Write-through caching, is in public preview.
    > This feature is provided without a service level agreement, and it's not recommended for production workloads.
    > For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

   * **No. of disks** - Choose the number of p30 disks to be attached to each Cassandra node.
   * **No. of nodes** - Choose the number of Cassandra nodes that will be deployed to this datacenter.

   :::image type="content" source="./media/create-cluster-portal/create-datacenter-page.png" alt-text="Review summary to create the datacenter." lightbox="./media/create-cluster-portal/create-datacenter-page.png" border="true":::

   > [!WARNING]
   > Availability zones are not supported in all regions. Deployments will fail if you select a region where Availability zones are not supported. See [here](../availability-zones/az-overview.md#azure-regions-with-availability-zones) for supported regions. The successful deployment of availability zones is also subject to the availability of compute resources in all of the zones in the given region. Deployments may fail if the SKU you have selected, or capacity, is not available across all zones. 

1. Next, select **Review + create** > **Create**

   > [!NOTE]
   > It can take up to 15 minutes for the cluster to be created.

   :::image type="content" source="./media/create-cluster-portal/review-create.png" alt-text="Review summary to create the cluster." lightbox="./media/create-cluster-portal/review-create.png" border="true":::

1. After the deployment has finished, check your resource group to see the newly created managed instance cluster:

   :::image type="content" source="./media/create-cluster-portal/managed-instance.png" alt-text="Overview page after the cluster is created." lightbox="./media/create-cluster-portal/managed-instance.png" border="true":::

1. To browse through the cluster nodes, navigate to the cluster resource and open the **Data Center** pane to view them:

   :::image type="content" source="./media/create-cluster-portal/datacenter.png" alt-text="Screenshot of datacenter nodes." lightbox="./media/create-cluster-portal/datacenter.png" border="true":::

## Scale a datacenter

Now that you have deployed a cluster with a single data center, you can either scale horizontally or vertically by highlighting the data center, and selecting the `Scale` button:

:::image type="content" source="./media/create-cluster-portal/datacenter-scale-1.png" alt-text="Screenshot of scaling datacenter nodes." lightbox="./media/create-cluster-portal/datacenter-scale-1.png" border="true":::

### Horizontal scale

To scale out on nodes, move the slider to the desired number, or just edit the value. When finished, hit `Scale`. 

:::image type="content" source="./media/create-cluster-portal/datacenter-scale-2.png" alt-text="Screenshot of selecting number of datacenter nodes." lightbox="./media/create-cluster-portal/datacenter-scale-2.png" border="true":::


### Vertical scale

To scale up to a more powerful SKU size for your nodes, select from the `Sku Size` dropdown. When finished, hit `Scale`. 

:::image type="content" source="./media/create-cluster-portal/datacenter-scale-3.png" alt-text="Screenshot of selecting Sku Size." lightbox="./media/create-cluster-portal/datacenter-scale-3.png" border="true":::

> [!NOTE]
> The length of time it takes for a scaling operation depends on various factors, it may take several minutes. When Azure notifies you that the scale operation has completed, this does not mean that all your nodes have joined the Cassandra ring. Nodes will be fully commissioned when they all display a status of "healthy", and the datacenter status reads "succeeded".

## Add a datacenter

1. To add another datacenter, click the add button in the **Data Center** pane:

   :::image type="content" source="./media/create-cluster-portal/add-datacenter.png" alt-text="Screenshot of adding a datacenter." lightbox="./media/create-cluster-portal/add-datacenter.png" border="true":::

   > [!WARNING]
   > If you are adding a datacenter in a different region, you will need to select a different virtual network. You will also need to ensure that this virtual network has connectivity to the primary region's virtual network created above (and any other virtual networks that are hosting datacenters within the managed instance cluster). Take a look at [this article](../virtual-network/tutorial-connect-virtual-networks-portal.md#peer-virtual-networks) to learn how to peer virtual networks using Azure portal. You also need to make sure you have applied the appropriate role to your virtual network before attempting to deploy a managed instance cluster, using the below CLI command.
   >
   > ```azurecli-interactive  
   >     az role assignment create \
   >     --assignee a232010e-820c-4083-83bb-3ace5fc29d0b \
   >     --role 4d97b98b-1d4f-4787-a291-c67834d212e7 \
   >     --scope /subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>
   > ```

1. Fill in the appropriate fields:

   * **Datacenter name** - From the drop-down, select your Azure subscription.
   * **Availability zone** - Check this box if you want availability zones to be enabled in this datacenter.
   * **Location** - Location where your datacenter will be deployed to.
   * **SKU Size** - Choose from the available Virtual Machine SKU sizes.
   * **No. of disks** - Choose the number of p30 disks to be attached to each Cassandra node.
   * **No. of nodes** - Choose the number of Cassandra nodes that will be deployed to this datacenter.
   * **Virtual Network** - Select an Exiting Virtual Network and Subnet.  

   :::image type="content" source="./media/create-cluster-portal/add-datacenter-2.png" alt-text="Add Datacenter." lightbox="./media/create-cluster-portal/add-datacenter-2.png" border="true":::

   > [!WARNING]
   > Notice that we do not allow creation of a new virtual network when adding a datacenter. You need to choose an existing virtual network, and as mentioned above, you need to ensure there is connectivity between the target subnets where datacenters will be deployed. You also need to apply the appropriate role to the VNet to allow deployment (see above).

1. When the datacenter is deployed, you should be able to view all datacenter information in the **Data Center** pane:

   :::image type="content" source="./media/create-cluster-portal/multi-datacenter.png" alt-text="View the cluster resources." lightbox="./media/create-cluster-portal/multi-datacenter.png" border="true":::
   
1. To ensure replication between data centers, connect to [cqlsh](#connecting-from-cqlsh) and use the following CQL query to update the replication strategy in each keyspace to include all datacenters across the cluster (system tables will be updated automatically):

   ```bash
   ALTER KEYSPACE "ks" WITH REPLICATION = {'class': 'NetworkTopologyStrategy', 'dc': 3, 'dc2': 3};
   ```

1. If you are adding a data center to a cluster where there is already data, you need to run `rebuild` to replicate the historical data. In Azure CLI, run the below command to execute `nodetool rebuild` on each node of the new data center, replacing `<new dc ip address>` with the IP address of the node, and `<olddc>` with the name of your existing data center:

   ```azurecli-interactive
    az managed-cassandra cluster invoke-command \
      --resource-group $resourceGroupName \
      --cluster-name $clusterName \
      --host <new dc ip address> \
      --command-name nodetool --arguments rebuild="" "<olddc>"=""
   ```
   
   > [!WARNING]
   > You should **not** allow application clients to write to the new data center until you have applied keyspace replication changes. Otherwise, rebuild won't work, and you will need to create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) so our team can run `repair` on your behalf. 

## Update Cassandra configuration

The service allows update to Cassandra YAML configuration on a datacenter via the portal or by [using CLI commands](manage-resources-cli.md#update-yaml). To update settings in the portal:

1. Find `Cassandra Configuration` under settings. Highlight the data center whose configuration you want to change, and click update:

   :::image type="content" source="./media/create-cluster-portal/update-config-1.png" alt-text="Screenshot of the select data center to update config." lightbox="./media/create-cluster-portal/update-config-1.png" border="true":::

1. In the window that opens, enter the field names in YAML format, as shown below. Then click update.

   :::image type="content" source="./media/create-cluster-portal/update-config-2.png" alt-text="Screenshot of updating the data center Cassandra config." lightbox="./media/create-cluster-portal/update-config-2.png" border="true":::

1. When update is complete, the overridden values will show in the `Cassandra Configuration` pane:

   :::image type="content" source="./media/create-cluster-portal/update-config-3.png" alt-text="Screenshot of the updated Cassandra config." lightbox="./media/create-cluster-portal/update-config-3.png" border="true":::

   > [!NOTE]
   > Only overridden Cassandra configuration values are shown in the portal.

   > [!IMPORTANT]
   > Ensure the Cassandra yaml settings you provide are appropriate for the version of Cassandra you have deployed. See [here](https://github.com/apache/cassandra/blob/cassandra-3.11/conf/cassandra.yaml) for Cassandra v3.11 settings and [here](https://github.com/apache/cassandra/blob/cassandra-4.0/conf/cassandra.yaml) for v4.0. The following YAML settings are **not** allowed to be updated:
   >
   > - cluster_name
   > - seed_provider
   > - initial_token
   > - autobootstrap
   > - client_encryption_options
   > - server_encryption_options
   > - transparent_data_encryption_options
   > - audit_logging_options
   > - authenticator
   > - authorizer
   > - role_manager
   > - storage_port
   > - ssl_storage_port
   > - native_transport_port
   > - native_transport_port_ssl
   > - listen_address
   > - listen_interface
   > - broadcast_address
   > - hints_directory
   > - data_file_directories
   > - commitlog_directory
   > - cdc_raw_directory
   > - saved_caches_directory
   > - endpoint_snitch
   > - partitioner
   > - rpc_address
   > - rpc_interface 

## Update Cassandra version

> [!IMPORTANT]
> Cassandra 4.1, 5.0 and Turnkey Version Updates, are in public preview.
> These features are provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You have the option to conduct in-place major version upgrades directly from the portal or through Az CLI, Terraform, or ARM templates.

1. Find the `Update` panel from the Overview tab

   :::image type="content" source="./media/create-cluster-portal/cluster-version-1.png" alt-text="Screenshot of updating the Cassandra version." lightbox="./media/create-cluster-portal/cluster-version-1.png" border="true":::

1. Select the Cassandra version from the dropdown.

    > [!WARNING]
    > Do not skip versions. We recommend to update only from one version to another example 3.11 to 4.0, 4.0 to 4.1.

   :::image type="content" source="./media/create-cluster-portal/cluster-version.png" alt-text="Screenshot of selecting Cassandra version. " lightbox="./media/create-cluster-portal/cluster-version.png" border="true":::

1. Select on update to save.


### Turnkey replication

Cassandra 5.0 introduces a streamlined approach for deploying multi-region clusters, offering enhanced convenience and efficiency. Using turnkey replication functionality, setting up and managing multi-region clusters has become more accessible, allowing for smoother integration and operation across distributed environments. This update significantly reduces the complexities traditionally associated with deploying and maintaining multi-region configurations, allowing users to use Cassandra's capabilities with greater ease and effectiveness.

:::image type="content" source="./media/create-cluster-portal/auto-replicate.png" alt-text="Select referred option from the drop-down." lightbox="./media/create-cluster-portal/auto-replicate.png" border="true":::

> [!TIP]
> - None: Auto replicate is set to none.
> - SystemKeyspaces: Auto-replicate all system keyspaces (system_auth, system_traces, system_auth)
> - AllKeyspaces: Auto-replicate all keyspaces and monitor if new keyspaces are created and then apply auto-replicate settings automatically.

#### Auto-replication scenarios

* When adding a new data center, the auto-replicate feature in Cassandra will seamlessly execute `nodetool rebuild` to ensure the successful replication of data across the added data center.
* Removing a data center triggers an automatic removal of the specific data center from the keyspaces.

For external data centers, such as those hosted on-premises, they can be included in the keyspaces through the utilization of the external data center property. This enables Cassandra to incorporate these external data centers as sources for the rebuilding process.


> [!WARNING]
> Setting auto-replicate to AllKeyspaces will change your keyspaces replication to include 
> `WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'on-prem-datacenter-1' : 3, 'mi-datacenter-1': 3 }`
> If this is not the topology you want, you will need to use SystemKeyspaces, adjust them yourself, and run `nodetool rebuild` manually on the Azure Managed Instance for Apache Cassandra cluster.

## De-allocate cluster

1. For non-production environments, you can pause/de-allocate resources in the cluster in order to avoid being charged for them (you will continue to be charged for storage). First change cluster type to `NonProduction`, then `deallocate`.

> [!WARNING] 
> Do not execute any schema or write operations during de-allocation - this can lead to data loss and in rare cases schema corruption requiring manual intervention from the support team.

   :::image type="content" source="./media/create-cluster-portal/pause-cluster.png" alt-text="Screenshot of pausing a cluster." lightbox="./media/create-cluster-portal/pause-cluster.png" border="true":::

## Troubleshooting

If you encounter an error when applying permissions to your Virtual Network using Azure CLI, such as *Cannot find user or service principal in graph database for 'e5007d2c-4b13-4a74-9b6a-605d99f03501'*, you can apply the same permission manually from the Azure portal. Learn how to do this [here](add-service-principal.md).

> [!NOTE] 
> The Azure Cosmos DB role assignment is used for deployment purposes only. Azure Managed Instanced for Apache Cassandra has no backend dependencies on Azure Cosmos DB.  

## Connecting to your cluster

Azure Managed Instance for Apache Cassandra does not create nodes with public IP addresses, so to connect to your newly created Cassandra cluster, you will need to create another resource inside the VNet. This could be an application, or a Virtual Machine with Apache's open-source query tool [CQLSH](https://cassandra.apache.org/doc/latest/cassandra/tools/cqlsh.html) installed. You can use a [template](https://azure.microsoft.com/resources/templates/vm-simple-linux/) to deploy an Ubuntu Virtual Machine. 


### Connecting from CQLSH

After the virtual machine is deployed, use SSH to connect to the machine, and install CQLSH using the below commands:

```bash
# Install default-jre and default-jdk
sudo apt update
sudo apt install openjdk-8-jdk openjdk-8-jre

# Install the Cassandra libraries in order to get CQLSH:
echo "deb http://archive.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
curl https://downloads.apache.org/cassandra/KEYS | sudo apt-key add -
sudo apt-get update
sudo apt-get install cassandra

# Export the SSL variables:
export SSL_VERSION=TLSv1_2
export SSL_VALIDATE=false

# Connect to CQLSH (replace <IP> with the private IP addresses of a node in your Datacenter):
host=("<IP>")
initial_admin_password="Password provided when creating the cluster"
cqlsh $host 9042 -u cassandra -p $initial_admin_password --ssl
```
### Connecting from an application

As with CQLSH, connecting from an application using one of the supported [Apache Cassandra client drivers](https://cassandra.apache.org/doc/latest/cassandra/getting_started/drivers.html) requires SSL encryption to be enabled, and certification verification to be disabled. See samples for connecting to Azure Managed Instance for Apache Cassandra using [Java](https://github.com/Azure-Samples/azure-cassandra-mi-java-v4-getting-started), [.NET](https://github.com/Azure-Samples/azure-cassandra-mi-dotnet-core-getting-started), [Node.js](https://github.com/Azure-Samples/azure-cassandra-mi-nodejs-getting-started) and [Python](https://github.com/Azure-Samples/azure-cassandra-mi-python-v4-getting-started).

Disabling certificate verification is recommended because certificate verification will not work unless you map I.P addresses of your cluster nodes to the appropriate domain. If you have an internal policy which mandates that you do SSL certificate verification for any application, you can facilitate this by adding entries like `10.0.1.5 host1.managedcassandra.cosmos.azure.com` in your hosts file for each node. If taking this approach, you would also need to add new entries whenever scaling up nodes. 

For Java, we also highly recommend enabling [speculative execution policy](https://docs.datastax.com/en/developer/java-driver/4.10/manual/core/speculative_execution/) where applications are sensitive to tail latency. You can find a demo illustrating how this works and how to enable the policy [here](https://github.com/Azure-Samples/azure-cassandra-mi-java-v4-speculative-execution).

> [!NOTE]
> In the vast majority of cases it should **not be necessary** to configure or install certificates (rootCA, node or client, truststores, etc) to connect to Azure Managed Instance for Apache Cassandra. SSL encryption can be enabled by using the default truststore and password of the runtime being used by the client (see [Java](https://github.com/Azure-Samples/azure-cassandra-mi-java-v4-getting-started), [.NET](https://github.com/Azure-Samples/azure-cassandra-mi-dotnet-core-getting-started), [Node.js](https://github.com/Azure-Samples/azure-cassandra-mi-nodejs-getting-started) and [Python](https://github.com/Azure-Samples/azure-cassandra-mi-python-v4-getting-started) samples), because Azure Managed Instance for Apache Cassandra certificates will be trusted by that environment. In rare cases, if the certificate is not trusted, you may need to add it to the truststore.  

### Configuring client certificates (optional)

Configuring client certificates is **optional**. A client application can connect to Azure Managed Instance for Apache Cassandra as long as the above steps have been taken. However, if preferred, you can also additionally create and configure client certificates for authentication. In general, there are two ways of creating certificates:

- Self signed certs. This means a private and public (no CA) certificate for each node - in this case we need all public certificates.
- Certs signed by a CA. This can be a self-signed CA or even a public one. In this case we need the root CA certificate (refer to [instructions on preparing SSL certificates](https://docs.datastax.com/en/cassandra-oss/3.x/cassandra/configuration/secureSSLCertWithCA.html) for production), and all intermediaries (if applicable).

If you want to implement client-to-node certificate authentication or mutual Transport Layer Security (mTLS), you need to provide the certificates via Azure CLI. The below command will upload and apply your client certificates to the truststore for your Cassandra Managed Instance cluster (i.e. you do not need to edit `cassandra.yaml` settings). Once applied, your  cluster will require Cassandra to verify the certificates when a client connects (see `require_client_auth: true` in Cassandra [client_encryption_options](https://cassandra.apache.org/doc/latest/cassandra/configuration/cass_yaml_file.html#client_encryption_options)).

   ```azurecli-interactive
   resourceGroupName='<Resource_Group_Name>'
   clusterName='<Cluster Name>'

   az managed-cassandra cluster update \
     --resource-group $resourceGroupName \
     --cluster-name $clusterName \
     --client-certificates /usr/csuser/clouddrive/rootCert.pem /usr/csuser/clouddrive/intermediateCert.pem
   ```

## Clean up resources

If you're not going to continue to use this managed instance cluster, delete it with the following steps:

1. From the left-hand menu of Azure portal, select **Resource groups**.
1. From the list, select the resource group you created for this quickstart.
1. On the resource group **Overview** pane, select **Delete resource group**.
1. In the next window, enter the name of the resource group to delete, and then select **Delete**.

## Next steps

In this quickstart, you learned how to create an Azure Managed Instance for Apache Cassandra cluster using Azure portal. You can now start working with the cluster:

> [!div class="nextstepaction"]
> [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)
