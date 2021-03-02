---
title: Quickstart - Create Azure Managed Instance for Apache Cassandra cluster from the Azure portal
description: This quickstart shows how to create an Azure Managed Instance for Apache Cassandra cluster using the Azure portal.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: quickstart
ms.date: 03/02/2021
ms.custom: references_regions

---
# Quickstart: Create an Azure Managed Instance for Apache Cassandra cluster from the Azure portal (Preview)
 
Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters, accelerating hybrid scenarios and reducing ongoing maintenance.

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This quickstart demonstrates how to use the Azure portal to create an Azure Managed Instance for Apache Cassandra cluster.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## <a id="create-account"></a>Create a managed instance cluster

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. From the search bar, search for **Managed Instance for Apache Cassandra** and select the result.

   :::image type="content" source="./media/create-cluster-portal/search-portal.png" alt-text="Search for Managed Instance for Apache Cassandra." lightbox="./media/create-cluster-portal/search-portal.png" border="true":::

1. Select **Create Managed Instance for Apache Cassandra cluster** button.

   :::image type="content" source="./media/create-cluster-portal/create-cluster.png" alt-text="Create the cluster." lightbox="./media/create-cluster-portal/create-cluster.png" border="true":::

1. From the **Create Managed Instance for Apache Cassandra** pane, enter the following details:

   * **Subscription** - From the drop-down, select your Azure subscription.
   * **Resource Group**- Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group](../azure-resource-manager/management/overview.md) overview article.
   * **Cluster name** - Enter a name for your cluster.
   * **Location** - Location where your cluster will be deployed to.
   * **SKU** - The type of SKU for your cluster.
   * **No. of nodes**-  Number of nodes in a cluster. These nodes act as replicas for your data.
   * **Initial Cassandra admin password** - Password that is used to create the cluster.
   * **Confirm Cassandra admin password** - Reenter your password.

    > [!NOTE]
    > During the public preview, you can create the managed instance cluster in the *East US, West US, East US 2, West US 2, Central US, South Central US, North Europe, West Europe, South East Asia, and Australia East* regions.

   :::image type="content" source="./media/create-cluster-portal/create-cluster-page.png" alt-text="Fill out the create cluster form." lightbox="./media/create-cluster-portal/create-cluster-page.png" border="true":::

1. Next select the **Networking** tab.

1. On the **Networking** pane, choose the **Virtual Network** name and **Subnet**. You can select an existing Virtual Network or create a new one.

   :::image type="content" source="./media/create-cluster-portal/networking.png" alt-text="Configure networking details." lightbox="./media/create-cluster-portal/networking.png" border="true":::

1. If you created a new VNet in the last step, skip to step 9. If you selected an existing VNet, before creating your cluster, you need to apply some special permissions to the Virtual Network and the subnet. To do so, you have to get the resource ID for your existing Virtual Network. Run the following command in [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli):

   ```azurecli-interactive
   # get the resource ID of the Virtual Network
   az network vnet show -n <VNet_name> -g <Resource_Group_Name> --query "id" --output tsv

1. Now apply the special permissions by using the `az role assignment create` command. Replace `<Resource ID>` with the output of previous command:

   ```azurecli-interactive
   az role assignment create --assignee e5007d2c-4b13-4a74-9b6a-605d99f03501 --role 4d97b98b-1d4f-4787-a291-c67834d212e7 --scope <Resource ID>
   ```

   > [!NOTE]
   > The `assignee` and `role` values in the previous command are fixed service principle and role identifiers respectively.

1. Now that you are finished with networking, click **Review + create** > **Create**

    > [!NOTE]
    > It can take up to 15 minutes for the cluster to be created.

   :::image type="content" source="./media/create-cluster-portal/review-create.png" alt-text="Review summary to create the cluster." lightbox="./media/create-cluster-portal/review-create.png" border="true":::


1. After the deployment has finished, check your resource group to see the newly created managed instance cluster:

   :::image type="content" source="./media/create-cluster-portal/managed-instance.png" alt-text="Overview page after the cluster is created." lightbox="./media/create-cluster-portal/managed-instance.png" border="true":::

1. To browse through the cluster nodes, navigate to the Virtual Network pane you have used to create the cluster and open the **Overview** pane to view them:

   :::image type="content" source="./media/create-cluster-portal/resources.png" alt-text="View the cluster resources." lightbox="./media/create-cluster-portal/resources.png" border="true":::



## Connecting to your cluster

Azure Managed Instance for Apache Cassandra does not create nodes with public IP addresses, so to connect to your newly created Cassandra cluster, you will need to create another resource inside the VNet. This could be an application, or a Virtual Machine with Apache's open-source query tool [CQLSH](https://cassandra.apache.org/doc/latest/tools/cqlsh.html) installed. You can use a [template](https://azure.microsoft.com/resources/templates/101-vm-simple-linux/) to deploy an Ubuntu Virtual Machine. When deployed, use SSH to connect to the machine, and install CQLSH using the below commands:

```bash
# Install default-jre and default-jdk
sudo apt update
sudo apt install openjdk-8-jdk openjdk-8-jre

# Install the Cassandra libraries in order to get CQLSH:
echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
curl https://downloads.apache.org/cassandra/KEYS | sudo apt-key add -
sudo apt-get update
sudo apt-get install cassandra

# Export the SSL variables:
export SSL_VERSION=TLSv1_2
export SSL_VALIDATE=false

# Connect to CQLSH (replace <IP> with the private IP addresses of the nodes in your Datacenter):
host=("<IP>" "<IP>" "<IP>")
cqlsh $host 9042 -u cassandra -p cassandra --ssl
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
