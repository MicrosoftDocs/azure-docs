---
title: Use Apache Superset with HDInsight on AKS Trino
description: Deploying Superset and connecting to HDInsight on AKS Trino
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 08/29/2023
---

# Deploy Apache Superset

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Visualization is essential to effectively explore, present, and share data. [Apache Superset](https://superset.apache.org/) allows you to run queries, visualize, and build dashboards over your data in a flexible Web UI. 

This article describes how to deploy an Apache Superset UI instance in Azure and connect it to HDInsight on AKS Trino cluster to query data and create dashboards.

Summary of the steps covered in this article:
1. [Prerequisites](#prerequisites).
2. [Create Kubernetes cluster for Apache Superset](#create-kubernetes-cluster-for-apache-superset).
3. [Deploy Apache Superset](#deploy-apache-superset).


## Prerequisites

*If using Windows, use [Ubuntu on WSL2](https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-11-with-gui-support#1-overview) to run these instructions in a bash shell Linux environment within Windows. Otherwise, you need to modify commands to work in Windows.*

### Create a HDInsight on AKS Trino cluster and assign a Managed Identity

1. If you haven't already, create an [HDInsight on AKS Trino cluster](trino-create-cluster.md).

2. For Apache Superset to call Trino, it needs to have a managed identity (MSI). Create or pick an existing [user assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).

3. Modify your Trino cluster configuration to allow the managed identity created in step 2 to run queries. [Learn how to manage access](../hdinsight-on-aks-manage-authorization-profile.md).

    
### Install local tools

1. Setup Azure CLI.
  
   a. Install [Azure CLI](/cli/azure/install-azure-cli-linux?pivots=apt).

   b. Log in to the Azure CLI: `az login`.

   c. Install Azure CLI preview extension.
   
      ```ssh
      # Install the aks-preview extension
      az extension add --name aks-preview

      # Update the extension to make sure you've the latest version installed
      az extension update --name aks-preview
      ```

4. Install [Kubernetes](https://kubernetes.io/docs/tasks/tools/).

5. Install [Helm](https://helm.sh/docs/intro/install/).


## Create kubernetes cluster for Apache Superset

This step creates the Azure Kubernetes Service (AKS) cluster where you can install Apache Superset. You need to bind the managed identity you've associated to the cluster to allow the Superset to authenticate with Trino cluster with that identity.

1. Create the following variables in bash for your Superset installation.

   ```ssh
   # ----- Parameters ------

   # The subscription ID where you want to install Superset
   SUBSCRIPTION=
   # Superset cluster name (visible only to you)
   CLUSTER_NAME=trinosuperset 
   # Resource group containing the Azure Kubernetes service
   RESOURCE_GROUP_NAME=trinosuperset 
   # The region to deploy Superset (ideally same region as Trino): to list regions: az account list-locations REGION=westus3 
   # The resource path of your managed identity. To get this resource path:
   #   1. Go to the Azure Portal and find your user assigned managed identity
   #   2. Select JSON View on the top right
   #   3. Copy the Resource ID value.
   MANAGED_IDENTITY_RESOURCE=
   ```


2. Select the subscription where you're going to install Superset.

    ```ssh
    az account set --subscription $SUBSCRIPTION
    ```

3. Enable pod identity feature on your current subscription.
   
    ```ssh
    az feature register --name EnablePodIdentityPreview --namespace Microsoft.ContainerService
    az provider register -n Microsoft.ContainerService
    ```

4. Create an AKS cluster to deploy Superset.

   ```ssh
   # Create resource group
   az group create --location $REGION --name $RESOURCE_GROUP_NAME

   # Create AKS cluster
   az \
   aks create \
   -g $RESOURCE_GROUP_NAME \
   -n $CLUSTER_NAME \
   --node-vm-size Standard_DS2_v2 \
   --node-count 3 \
   --enable-managed-identity \
   --assign-identity $MANAGED_IDENTITY_RESOURCE \
   --assign-kubelet-identity $MANAGED_IDENTITY_RESOURCE

   # Set the context of your new Kubernetes cluster
   az aks get-credentials --resource-group $RESOURCE_GROUP_NAME --name $CLUSTER_NAME
   ```

## Deploy Apache Superset

1. To allow Superset to talk to Trino cluster securely, the easiest way is to set up Superset to use the Azure Managed Identity. This step means that your cluster uses the identity you've assigned it without manual deployment or cycling of secrets.

    You need to create a values.yaml file for the Superset Helm deployment. Refer [sample code](https://github.com/Azure-Samples/hdinsight-aks/blob/main/src/trino/deploy-superset.yml).

    **Optional**: use Microsoft Azure Postgres instead of using the Postgres deployed inside the Kubernetes cluster. 
    
    Create an "Azure Database for PostgreSQL" instance to allow easier maintainence, allow for backups, and provide better reliability.
    
    ```yaml
    postgresql:
      enabled: false
    
    supersetNode:
      connections:
        db_host: '{{SERVER_NAME}}.postgres.database.azure.com'
        db_port: '5432'
        db_user: '{{POSTGRES_USER}}'
        db_pass: '{{POSTGRES_PASSWORD}}'
        db_name: 'postgres' # default db name for Azure Postgres
    ```

2. Add other sections of the values.yaml if necessary. [Superset documentation](https://superset.apache.org/docs/installation/running-on-kubernetes/) recommends changing default password.

3. Deploy Superset using Helm.

   ```ssh
   # Verify you have the context of the right Kubernetes cluster
   kubectl cluster-info
   # Add the Superset repository
   helm repo add superset https://apache.github.io/superset
   # Deploy
   helm repo update
   helm upgrade --install --values values.yaml superset superset/superset
    ```
4. Connect to Superset and create connection.

   > [!NOTE]
   > You should create separate connections for each Trino catalog you want to use.

   1. Connect to Superset using port forwarding.

       `kubectl port-forward service/superset 8088:8088 --namespace default`

   2. Open a web browser and go to http://localhost:8088/. If you didn't change the administrator password, login using username: admin, password: admin.

   3. Select "connect database" from the plus '+' menu on the right hand side.
     
      :::image type="content" source="./media/trino-superset/connect-database.png" alt-text="Screenshot showing connect database.":::

   5. Select **Trino**.

   6. Enter the SQL Alchemy URI of your HDInsight on AKS Trino cluster.

       You need to modify three parts of this connection string:

       |Property|Example|Description|
       |-|-|-|
       |user|trino@|The name before the @ symbol is the username used for connection to Trino.|
       |hostname|mytrinocluster.00000000000000000000000000<br>.eastus.hdinsightaks.net|The hostname of your Trino cluster. <br> You can get this information from "Overview" page of your cluster in the Azure portal.|
       |catalog|/tpch|After the slash, is the default catalog name. <br> You need to change this catalog to the catalog that has the data you want to visualize.|

       trino://<mark>$USER</mark>@<mark>$TRINO_CLUSTER_HOST_NAME</mark>.hdinsightaks.net:443/<mark>$DEFAULT_CATALOG</mark>
    
       Example: `trino://trino@mytrinocluster.00000000000000000000000000.westus3.hdinsightaks.net:443/tpch`

       :::image type="content" source="./media/trino-superset/sql-alchemy-uri.png" alt-text="Screenshot showing connection string.":::

   8. Select the "Advanced" tab and enter the following configuration in "Additional Security." Replace the client_id value with the GUID Client ID for your managed identity (this value can be found in your managed identity resource overview page in the Azure portal).

       ```yaml
        {
          "auth_method": "azure_msi",
          "auth_params":
          {
            "scope": "https://clusteraccess.hdinsightaks.net/.default",
            "client_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          }
        }
       ```

      :::image type="content" source="./media/trino-superset/advanced-credentials.png" alt-text="Screenshot showing adding MSI.":::

   10. Select "Connect."

Now, you're ready to create datasets and charts.

### Troubleshooting

* Verify your Trino cluster has been configured to allow the Superset cluster's user assigned managed identity to connect. You can verify this value by looking at the resource JSON of your Trino cluster (authorizationProfile/userIds). Make sure that you're using the identity's object ID, not the client ID.
  
* Make sure there are no mistakes in the connection configuration.
  1. Make sure the "secure extra" is filled out,
  2. Your URL is correct.
  3. Use the `tpch` catalog to test with to verify your connection is working before using your own catalog.

## Next Steps

To expose Superset to the internet, allow user login using Azure Active Directory you need to accomplish the following general steps. These steps require an intermediate or greater experience with Kubernetes.

* [Configure Azure Active Directory OAuth2 login for Superset](./configure-azure-active-directory-login-for-superset.md)
