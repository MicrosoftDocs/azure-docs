
#

## Prerequisites

* An Azure subscription.
* An Azure Machine Learning workspace with a private endpoint connection to a virtual network. The following workspace dependency services must also have a private endpoint connection to the virtual network:

    * Azure Storage Account

        > [!TIP]
        > For the storage account there are three separate private endpoints; one each for blob, file, and dfs.

    * Azure Key Vault
    * Azure Container Registry

    A quick and easy way to build this configuration is to use a [Microsoft Bicep or Hashicorp Terraform template](tutorial-create-secure-workspace-template.md).

    > [!IMPORTANT]
    > The steps in this article assume that you can connect to the Azure Machine Learning studio of your workspace, but does not provide details on how to connect. Depending on your VNet configuration, you might be connecting through a jump box (VM), Azure VPN Gateway, or Azure ExpressRoute.

* An Azure Synapse workspace in a virtual network. For more information, see [Azure Synapse Analytics Managed Virtual Network](/azure/synapse-analytics/security/synapse-workspace-managed-vnet).

    > [!NOTE]
    > The steps in this article assume that the Azure Synapse workspace is in a different resource group and virtual network than the Azure Machine Learning workspace.


## Configure Azure Synapse

1. From the [Azure Portal](https://portal.azure.com), select your Synapse workspace and then select __Open Synapse Studio__.
1. From Synapse Studio, select __Manage__, __Linked services__, and then select __+ New__.
1. From the new linked service dialog, search for __Azure Machine Learning__ and select the tile, then select __Continue__.
1. Enter a __Name__ for the linked service, and then select the __Azure Subscription__ that contains the Azure Machine Learning workspace.
1. Select the __Azure Machine Learning workspace name__, and note the __Managed identity name__ and __ID__. The managed identity values will be needed later.
1. Select __Create new__ to create a new service endpoint. This creates a new private endpoint under your Azure Machine Learning workspace. Verify that the endpoint information is correct, and then select __Create__.

    > [!TIP]
    > By default the __Resource ID__ field will contain the ID of the Azure Machine Learning workspace selected in the previous step.

1. Select __Create__ on the __New linked service__ dialog to create the linked service.
1. From the top of Synapse Studio, select __Publish all__ to publish the new linked service. When the publish dialog appears, select __Publish__.
1. From the left of the page, select __Manage__ and __Managed private endpoints__. Note that the endpoint will be listed as __Provisioning__ until it has been created. Once created, the __Approval__ column will list a status of __Pending__.

    > [!NOTE]
    > In the following screenshot, notice that a managed private endpoint has been created for the Azure Data Lake Storage Gen 2 associated with this Synapse workspace. For information on how to create an Azure Data Lake Storage Gen 2 and enable a private endpoint for it, see [Provision and secure a linked service with Managed VNet](/azure/synapse-analytics/data-integration/linked-service).

### Create a Spark pool

To verify that the integration between Azure Synapse and Azure Machine Learning is working, you will use an Apache Spark pool. For information on creating one, see [Create a Spark pool](/azure/synapse-analytics/quickstart-create-apache-spark-pool-portal).

## Configure Azure Machine Learning

1. From the [Azure Portal](https://portal.azure.com), select your __Azure Machine Learning workspace__, and then select __Networking__.
1. Select __Private endpoints__, and then select the endpoint you created in the previous steps. It should have a status of __pending__. Select __Approve__ to approve the endpoint connection.
1. From the left of the page, select __Access control (IAM)__.
1. Select __+ Add__, and then select __Role assignment__.
1. Select __Contributor__, and then select __Next__.
1. Select __User, group, or service principal__, and then __+ Select members__.
1. Enter the name of the identity created earlier, select it, and then use the __Select__ button.
1. Select __Review + assign__, verify the information, and then select __Review + assign__.

    > [!TIP]
    > It may take several minutes for the Azure Machine Learning workspace to update the credentials cache. Until it has been updated, you may receive errors when trying to access the Azure Machine Learning workspace from Synapse.

1. From the left of the page, select __Overview__ and then select __Launch studio__.
1. From the Azure Machine Learning studio, select __Linked Services__ and then select __Add Integration__.
1. Provide a friendly name for the linked workspace, select the Azure subscription that contains the Azure Synapse workspace, and then select the Synapse workspace.
1. Select __Next__, and then select the Spark pool. Enter a name for the compute resource, and then select __Next__.
1. Select __Create__.

## Verify connectivity

### From Azure Synapse to Azure Machine Learning

1. From Azure Synapse Studio, select __Develop__, and then __+ Notebook__.
1. In the __Attach to__ field, select the Apache Spark pool for your Azure Synapse workspace, and enter the following code in the first cell:

    ```python
    from notebookutils.mssparkutils import azureML

    # getWorkspace() takes the linked service name,
    # not the Azure Machine Learning workspace name.
    ws = azureML.getWorkspace("AzureMLService1")

    print(ws.name)
    ```

    This code snippet connects to the linked workspace, and then prints the workspace info. Note that in the printed output, the value displayed is the name of the Azure Machine Learning workspace, not the linked service name that was used in the `getWorkspace()` call.

### From Azure Machine Learning to Azure Synapse