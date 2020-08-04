---
title: Network isolation & privacy 
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network with Azure Machine Learning to secure experimentation/training as well as  inference/scoring jobs.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.author: aashishb
author: aashishb
ms.date: 07/07/2020
ms.topic: conceptual
ms.custom: how-to, contperfq4, tracking-python

---

# Network isolation during training and inference with private endpoints and virtual networks
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you'll learn how to secure your machine learning lifecycles by isolating Azure Machine Learning training and inference jobs within an Azure Virtual Network (vnet). A __virtual network__ acts as a security boundary, isolating your Azure resources from the public internet. You can also join an Azure virtual network to your on-premises network. By joining networks, you can securely train your models and access your deployed models for inference.

Azure Machine Learning workspace can be accessed from a virtual network using a __private endpoint__. The private endpoint is a set of private IP addresses within your virtual network, and access to your workspace is limited to the virtual network. The private endpoint helps reduce the risk of data exfiltration. To learn more about private endpoints, see the [Azure Private Link](/azure/private-link/private-link-overview) article.

> [!NOTE]
> You may encounter problems accessing a workspace through a private endpoint when using Mozilla Firefox. The problem may be related to the DNS over HTTPS setting in the browser. We recommend using Microsoft Edge or Google Chrome to work around this problem.

Azure Machine Learning relies on other Azure services for data storage and computational resources (used to train and deploy models). These resources can also be created within a virtual network. For example, you can use Azure Machine Learning compute to train a model and then deploy the model to Azure Kubernetes Service (AKS). 

## Prerequisites

+ An Azure Machine Learning [workspace](how-to-manage-workspace.md).

+ General working knowledge of both the [Azure Virtual Network service](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) and [IP networking](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm).

+ A pre-existing virtual network and subnet to use with your compute resources.

## Secure your workspace

Your Azure Machine Learning workspace can have either a __public endpoint__ or a __private endpoint__. A public endpoint is a set of IP addresses that are accessible on the public internet, while a private endpoint is a set of private IP addresses within a virtual network. 

To limit access to your workspace to only occur over the private IP addresses, use a private endpoint.

Since communication to the workspace is only allowed from the virtual network, any development environments that use the workspace must be members of the virtual network. For example, a virtual machine in the virtual network.

> [!IMPORTANT]
> The private endpoint does not effect Azure control plane (management operations) such as deleting the workspace or managing compute resources. For example, creating, updating, or deleting a compute target. These operations are performed over the public Internet as normal.

> [!TIP]
> Some combinations of resources with a private endpoint require an Enterprise edition workspace. Use the following table to understand what scenarios require Enterprise edition:
>
> | Scenario | Enterprise</br>edition | Basic</br>edition |
> | ----- |:-----:|:-----:| 
> | No virtual network or private endpoint | ✔ | ✔ |
> | Workspace without private endpoint. Other resources (except Azure Container Registry) in a virtual network | ✔ | ✔ |
> | Workspace without private endpoint. Other resources with private endpoint | ✔ | |
> | Workspace with private endpoint. Other resources (except Azure Container Registry) in a virtual network | ✔ | ✔ |
> | Workspace and any other resource with private endpoint | ✔ | |
> | Workspace with private endpoint. Other resources without private endpoint or virtual network | ✔ | ✔ |
> | Azure Container Registry in a virtual network | ✔ | |
> | Customer Managed Keys for workspace | ✔ | |
> 

> [!WARNING]
> 
> Azure Machine Learning compute instances preview is not supported in a workspace where private endpoint is enabled.
>
> Azure Machine Learning does not support using an Azure Kubernetes Service that has private endpoint enabled. Instead, you can use Azure Kubernetes Service in a virtual network. For more information, see [Secure Azure ML experimentation and inference jobs within an Azure Virtual Network](how-to-enable-virtual-network.md).

To learn more about private endpoints in Azure, see the [Azure Private Link](/azure/private-link/private-link-overview) article.

### Create a workspace that uses a private endpoint

You can create a new workspace with a private endpoint by using the Azure Machine Learning SDK, CLI, an Azure Resource Manager template, or the Azure portal.

__Requirements__

* The virtual network that you use with the private endpoint must have network policies disabled. For more information, see [Disable network policies for a private endpoint](/azure/private-link/disable-private-endpoint-network-policy).

__Limitations__

* If multiple workspaces are created using private endpoints, and they use the same private DNS zone, only the first workspace is added to the __virtual network links__ of the private DNS zone.

    To work around this limitation, manually add the virtual network link for the additional workspaces. For more information, see [What is a virtual network link](/azure/dns/private-dns-virtual-network-links).

__Configuration__

For information on how to create a workspace using a virtual network and private endpoint, along with other configuration options, see the following articles:

* [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](how-to-create-workspace-template.md).
* [Create workspaces in the portal](how-to-manage-workspace.md).
* [Create workspaces with Azure CLI](how-to-manage-workspace-cli.md).
* To use the Python SDK, see the [PrivateEndPointConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.private_endpoint.privateendpointconfig?view=azure-ml-py) and [Workspace.create()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py#create-name--auth-none--subscription-id-none--resource-group-none--location-none--create-resource-group-true--sku--basic---friendly-name-none--storage-account-none--key-vault-none--app-insights-none--container-registry-none--cmk-keyvault-none--resource-cmk-uri-none--hbi-workspace-false--default-cpu-compute-target-none--default-gpu-compute-target-none--private-endpoint-config-none--private-endpoint-auto-approval-true--exist-ok-false--show-output-true-) reference documentation.

<a id="amlcompute"></a>

## Machine Learning studio

__Requirements__

* To access data in a storage account, the storage account must be in the same virtual network as the workspace.

__Limitations__

* If your data is stored in a virtual network, you must use a workspace [managed identity](../active-directory/managed-identities-azure-resources/overview.md) to grant the studio access to your data.

    > [!IMPORTANT]
    > While most of studio works with data stored in a virtual network, integrated notebooks __do not__. Integrated notebooks do not support using storage that is in a virtual network. Instead, you can use Jupyter Notebooks from a compute instance. For more information, see the [Access data in a Compute Instance notebook](#access-data-in-a-compute-instance-notebook) section.

    If you fail to grant studio access, you will receive this error, `Error: Unable to profile this dataset. This might be because your data is stored behind a virtual network or your data does not support profile.`, and disable the following operations:

    * Preview data in the studio.
    * Visualize data in the designer.
    * Submit an AutoML experiment.
    * Start a labeling project.

* The studio supports reading data from the following datastore types in a virtual network:

    * Azure Blob
    * Azure Data Lake Storage Gen1
    * Azure Data Lake Storage Gen2
    * Azure SQL Database

__Configuration__

* __Configure datastores to use a managed identity__ to access your data. These steps add the workspace managed identity as a __Reader__ to the storage service using Azure resource-based access control (RBAC). __Reader__ access lets the workspace retrieve firewall settings, and ensure that data doesn't leave the virtual network.

    1. In the studio, select __Datastores__.

    1. To create a new datastore, select __+ New datastore__. To update an existing one, select the datastore and select __Update credentials__.

    1. In the datastore settings, select __Yes__ for  __Allow Azure Machine Learning service to access the storage using workspace managed identity__.

    > [!NOTE]
    > These changes may take up to 10 minutes to take effect.

* For __Azure Blob storage__, the workspace managed identity must also be added as a [Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) so that it can read data from blob storage.

* The designer uses the storage account attached to your workspace to store output by default. However, you can specify it to store output to any datastore that you have access to. If your environment uses virtual networks, you can use these controls to ensure your data remains secure and accessible. To set a new default storage for a pipeline:

    1. In a pipeline draft, select the **Settings gear icon** near the title of your pipeline.
    1. Select **Select default datastore**.
    1. Specify a new datastore.

    You can also override the default datastore on a per-module basis. This gives you control over the storage location for each individual module.

    1. Select the module whose output you want to specify.
    1. Expand the **Output settings** section.
    1. Select **Override default output settings**.
    1. Select **Set output settings**.
    1. Specify a new datastore.

* If using __Azure Data Lake Storage Gen2__, you can use both RBAC and POSIX-style access control lists (ACLs) to control data access inside of a virtual network.

    To use RBAC, add the workspace managed identity to the [Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) role. For more information, see [Role-based access control](../storage/blobs/data-lake-storage-access-control.md#role-based-access-control).

    To use ACLs, the workspace managed identity can be assigned access just like any other security principle. For more information, see [Access control lists on files and directories](../storage/blobs/data-lake-storage-access-control.md#access-control-lists-on-files-and-directories).

* __Azure Data Lake Storage Gen1__ only supports POSIX-style access control lists. You can assign the workspace managed identity access to resources just like any other security principle. For more information, see [Access control in Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-access-control.md).

* To access data stored in an __Azure SQL Database__ using managed identity, you must create a SQL contained user that maps to the managed identity. For more information on creating a user from an external provider, see [Create contained users mapped to Azure AD identities](../azure-sql/database/authentication-aad-configure.md#create-contained-users-mapped-to-azure-ad-identities).

    After you create a SQL contained user, grant permissions to it by using the [GRANT T-SQL command](https://docs.microsoft.com/sql/t-sql/statements/grant-object-permissions-transact-sql).

* If you are __accessing the studio from a resource inside of a virtual network__ (for example, a compute instance or virtual machine), you must allow outbound traffic from the virtual network to the studio. 

    For example, if you are using network security groups (NSG) to restrict outbound traffic, add a rule to a __service tag__ destination of __AzureFrontDoor.Frontend__.

## Azure Storage account

> [!IMPORTANT]
> You can place the both the _default storage account_ for Azure Machine Learning, and _non-default storage accounts_ in a virtual network.

__Requirements__

* The storage account must be in the same virtual network and subnet as the compute instances or clusters used for training or inference.

__Configuration__

To secure the Azure Storage account used by your workspace, either enable a __private endpoint__ or a __service endpoint__ for the storage account on your virtual network.

* To configure the storage account to use a __private endpoint__, see the [Use private endpoints](/azure/storage/common/storage-private-endpoints.md) article.

* To configure the storage account to use a __service endpoint__, use the following steps:

    1. To add the storage account to the virtual network used by your workspace, use the information in the __Grant access from a virtual network__ section of the [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security#grant-access-from-a-virtual-network) article.
    1. To allow access from Microsoft services on the virtual network (such as Azure Machine Learning), use the information in the __Exceptions__ section of the [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security#exceptions) article.
    1. When working with the Azure Machine Learning SDK, your development environment must be able to connect to the Azure Storage Account. When the storage account is inside a virtual network, the firewall must allow access from the development environment's IP address. To add the IP address of the development environment, use the information in the __Grant access from an internet IP range__ section of the [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security#grant-access-from-an-internet-ip-range) article.

## Use datastores and datasets

> [!NOTE]
> This section covers datastore and dataset usage for the SDK experience. For more information on the studio experience, see the section [Machine Learning studio](#machine-learning-studio).

__Limitations__

By default, Azure Machine Learning performs data validity and credential checks when you attempt to access data using the SDK. If your data is behind a virtual network, Azure Machine Learning can't access the data and fails its checks. To work around this problem, skip validation when creating datastores and datasets.

* When using a __datastore__:

    Azure Data Lake Store Gen1 and Azure Data Lake Store Gen2 skip validation by default, so no further action is necessary. However, for the following services you can use similar syntax to skip datastore validation:

    - Azure Blob storage
    - Azure fileshare
    - PostgreSQL
    - Azure SQL Database

    The following code sample creates a new Azure Blob datastore and sets `skip_validation=True`.

    ```python
    blob_datastore = Datastore.register_azure_blob_container(workspace=ws,  
                                                            datastore_name=blob_datastore_name,  
                                                            container_name=container_name,  
                                                            account_name=account_name, 
                                                            account_key=account_key, 
                                                            skip_validation=True ) // Set skip_validation to true
    ```

* When using a __dataset__:

    The syntax to skip dataset validation is similar for the following dataset types:
    - Delimited file
    - JSON 
    - Parquet
    - SQL
    - File

    The following code creates a new JSON dataset and sets `validate=False`.

    ```python
    json_ds = Dataset.Tabular.from_json_lines_files(path=datastore_paths, 
                                                   validate=False) 
    ```


## <a name="compute-instance"></a>Compute clusters & instances 

__Requirements__

* The virtual network must be in the same subscription and region as the Azure Machine Learning workspace.
* The subnet that's specified for the compute instance or cluster must have enough unassigned IP addresses to accommodate the number of VMs that are targeted. If the subnet doesn't have enough unassigned IP addresses, a compute cluster will be partially allocated.
* Check to see whether your security policies or locks on the virtual network's subscription or resource group restrict permissions to manage the virtual network. If you plan to secure the virtual network by restricting traffic, leave some ports open for the compute service. For more information, see the [Required ports](#mlcports) section.
* If you're going to put multiple compute instances or clusters in one virtual network, you might need to request a quota increase for one or more of your resources.
* If the Azure Storage Account(s) for the workspace are also secured in a virtual network, they must be in the same virtual network as the Azure Machine Learning compute instance or cluster. 
* For compute instance Jupyter functionality to work, ensure that web socket communication is not disabled.

__Limitations__

* The Machine Learning compute instance or cluster automatically allocates additional networking resources __in the resource group that contains the virtual network__. For each compute instance or cluster, the service allocates the following resources:

    * One network security group
    * One public IP address
    * One load balancer
    
    In the case of clusters these resources are deleted (and recreated) every time the cluster scales down to 0 nodes, however for an instance the resources are held onto until the instance is deleted (stopping does not remove the resources). 
    These resources are limited by the subscription's [resource quotas](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits).

__Configuration__

* To create a Machine Learning Compute cluster, use the following steps:

    1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/), and then select your subscription and workspace.
    1. Select __Compute__ on the left.
    1. Select __Training clusters__ from the center, and then select __+__.
    1. In the __New Training Cluster__ dialog, expand the __Advanced settings__ section.
    1. To configure this compute resource to use a virtual network, perform the following actions in the __Configure virtual network__ section:

        1. In the __Resource group__ drop-down list, select the resource group that contains the virtual network.
        1. In the __Virtual network__ drop-down list, select the virtual network that contains the subnet.
        1. In the __Subnet__ drop-down list, select the subnet to use.

    ![The virtual network settings for Machine Learning Compute](./media/how-to-enable-virtual-network/amlcompute-virtual-network-screen.png)

    You can also create a Machine Learning Compute cluster by using the Azure Machine Learning SDK. The following code creates a new Machine Learning Compute cluster in the `default` subnet of a virtual network named `mynetwork`:

    ```python
    from azureml.core.compute import ComputeTarget, AmlCompute
    from azureml.core.compute_target import ComputeTargetException

    # The Azure virtual network name, subnet, and resource group
    vnet_name = 'mynetwork'
    subnet_name = 'default'
    vnet_resourcegroup_name = 'mygroup'

    # Choose a name for your CPU cluster
    cpu_cluster_name = "cpucluster"

    # Verify that cluster does not exist already
    try:
        cpu_cluster = ComputeTarget(workspace=ws, name=cpu_cluster_name)
        print("Found existing cpucluster")
    except ComputeTargetException:
        print("Creating new cpucluster")

        # Specify the configuration for the new cluster
        compute_config = AmlCompute.provisioning_configuration(vm_size="STANDARD_D2_V2",
                                                            min_nodes=0,
                                                            max_nodes=4,
                                                            vnet_resourcegroup_name=vnet_resourcegroup_name,
                                                            vnet_name=vnet_name,
                                                            subnet_name=subnet_name)

        # Create the cluster with the specified name and configuration
        cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)

        # Wait for the cluster to be completed, show the output log
        cpu_cluster.wait_for_completion(show_output=True)
    ```

    When the creation process finishes, you train your model by using the cluster in an experiment. For more information, see [Select and use a compute target for training](how-to-set-up-training-targets.md).

    [!INCLUDE [low-pri-note](../../includes/machine-learning-low-pri-vm.md)]

* If you're using notebooks on an Azure Compute instance, you must ensure that your notebook is running on a compute resource behind the same virtual network and subnet as your data. 

    You must configure your Compute Instance to be in the same virtual network during creation under **Advanced settings** > **Configure virtual network**. You cannot add an existing Compute Instance to a virtual network.

* If you plan on securing the virtual network by restricting network traffic to/from the public internet, you must allow inbound communications from the Azure Batch service.

    The Batch service adds network security groups (NSGs) at the level of network interfaces (NICs) that are attached to VMs. These NSGs automatically configure inbound and outbound rules to allow the following traffic:

    - Inbound TCP traffic on ports 29876 and 29877 from a __Service Tag__ of __BatchNodeManagement__.

    - (Optional) Inbound TCP traffic on port 22 to permit remote access. Use this port only if you want to connect by using SSH on the public IP.

    - Outbound traffic on any port to the virtual network.

    - Outbound traffic on any port to the internet.

    - For compute instance inbound TCP traffic on port 44224 from a __Service Tag__ of __AzureMachineLearning__.

    > [!IMPORTANT]
    > Exercise caution if you modify or add inbound or outbound rules in Batch-configured NSGs. If an NSG blocks communication to the compute nodes, the compute service sets the state of the compute nodes to unusable.
    >
    > You don't need to specify NSGs at the subnet level, because the Azure Batch service configures its own NSGs. However, if the subnet that contains the Azure Machine Learning compute has associated NSGs or a firewall, you must also allow the traffic listed earlier.

* If you don't want to use the default outbound rules and you do want to limit the outbound access of your virtual network, use the following steps:

    1. Deny outbound internet connection by using the NSG rules.
    1. For a __compute instance__ or a __compute cluster__, limit outbound traffic to the following items:
        - Azure Storage, by using __Service Tag__ of __Storage__.
        - Azure Container Registry, by using __Service Tag__ of __AzureContainerRegistry__.
        - Azure Machine Learning, by using __Service Tag__ of __AzureMachineLearning__
        - Azure Resource Manager, by using __Service Tag__ of __AzureResourceManager__
        - Azure Active Directory, by using __Service Tag__ of __AzureActiveDirectory__

    > [!NOTE]
    > If you plan on using default Docker images provided by Microsoft, and enabling user managed dependencies, you must also use the following __Service Tags__:
    >
    > * __MicrosoftContainerRegistry__
    > * __AzureFrontDoor.FirstParty__
    >
    > This configuration is needed when you have code similar to the following snippets as part of your training scripts:
    >
    > __RunConfig training__
    > ```python
    > # create a new runconfig object
    > run_config = RunConfiguration()
    > 
    > # configure Docker 
    > run_config.environment.docker.enabled = True
    > # For GPU, use DEFAULT_GPU_IMAGE
    > run_config.environment.docker.base_image = DEFAULT_CPU_IMAGE 
    > run_config.environment.python.user_managed_dependencies = True
    > ```
    >
    > __Estimator training__
    > ```python
    > est = Estimator(source_directory='.',
    >                 script_params=script_params,
    >                 compute_target='local',
    >                 entry_script='dummy_train.py',
    >                 user_managed=True)
    > run = exp.submit(est)
    > ```

* If you're using [forced tunneling](/azure/vpn-gateway/vpn-gateway-forced-tunneling-rm) with Azure Machine Learning compute, you must allow communication with the public internet from the subnet that contains the compute resource. This communication is used for task scheduling and accessing Azure Storage.

    There are two ways that you can accomplish this:

    * Use a [Virtual Network NAT](../virtual-network/nat-overview.md). A NAT gateway provides outbound internet connectivity for one or more subnets in your virtual network. For information, see [Designing virtual networks with NAT gateway resources](../virtual-network/nat-gateway-resource.md).

    * Add [user-defined routes (UDRs)](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview) to the subnet that contains the compute resource. Establish a UDR for each IP address that's used by the Azure Batch service in the region where your resources exist. These UDRs enable the Batch service to communicate with compute nodes for task scheduling. Also add the IP address for the Azure Machine Learning service where the resources exist, as this is required for access to Compute Instances. To get a list of IP addresses of the Batch service and Azure Machine Learning service, use one of the following methods:

        * Download the [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) and search the file for `BatchNodeManagement.<region>` and `AzureMachineLearning.<region>`, where `<region>` is your Azure region.

        * Use the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) to download the information. The following example downloads the IP address information and filters out the information for the East US 2 region:

            ```azurecli-interactive
            az network list-service-tags -l "East US 2" --query "values[?starts_with(id, 'Batch')] | [?properties.region=='eastus2']"
            az network list-service-tags -l "East US 2" --query "values[?starts_with(id, 'AzureMachineLearning')] | [?properties.region=='eastus2']"
            ```
        
        When you add the UDRs, define the route for each related Batch IP address prefix and set __Next hop type__ to __Internet__. 

        In addition to any UDRs that you define, outbound traffic to Azure Storage must be allowed through your on-premises network appliance. Specifically, the URLs for this traffic are in the following forms: `<account>.table.core.windows.net`, `<account>.queue.core.windows.net`, and `<account>.blob.core.windows.net`. 

        For more information, see [Create an Azure Batch pool in a virtual network](../batch/batch-virtual-network.md#user-defined-routes-for-forced-tunneling).

<a id="aksvnet"></a>

## Azure Kubernetes Service

__Requirements__

* The AKS instance and the Azure virtual network must be in the same region. If you secure the Azure Storage account(s) used by the workspace in a virtual network, they must be in the same virtual network as the AKS instance.

__Limitations__

* If you want to use an Azure Kubernetes Service that has Private Link enabled, you must attach it to your workspace. You cannot create an Azure Kubernetes Service cluster with Private Link from Azure Machine Learning (SDK, portal, CLI, etc.).

__Configuration__

* Follow the prerequisites in the [Configure advanced networking in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/configure-azure-cni#prerequisites) article and plan the IP addressing for your cluster.

* To create an Azure Kubernetes Service from studio, use the following steps:

    1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/), and then select your subscription and workspace.
    1. Select __Compute__ on the left.
    1. Select __Inference clusters__ from the center, and then select __+__.
    1. In the __New Inference Cluster__ dialog, select __Advanced__ under __Network configuration__.
    1. To configure this compute resource to use a virtual network, perform the following actions:

        1. In the __Resource group__ drop-down list, select the resource group that contains the virtual network.
        1. In the __Virtual network__ drop-down list, select the virtual network that contains the subnet.
        1. In the __Subnet__ drop-down list, select the subnet.
        1. In the __Kubernetes Service address range__ box, enter the Kubernetes service address range. This address range uses a Classless Inter-Domain Routing (CIDR) notation IP range to define the IP addresses that are available for the cluster. It must not overlap with any subnet IP ranges (for example, 10.0.0.0/16).
        1. In the __Kubernetes DNS service IP address__ box, enter the Kubernetes DNS service IP address. This IP address is assigned to the Kubernetes DNS service. It must be within the Kubernetes service address range (for example, 10.0.0.10).
        1. In the __Docker bridge address__ box, enter the Docker bridge address. This IP address is assigned to Docker Bridge. It must not be in any subnet IP ranges, or the Kubernetes service address range (for example, 172.17.0.1/16).

    1. Make sure that the NSG group that controls the virtual network has an inbound security rule enabled for the scoring endpoint so that it can be called from outside the virtual network.

        > [!IMPORTANT]
        > Keep the default outbound rules for the NSG. For more information, see the default security rules in [Security groups](https://docs.microsoft.com/azure/virtual-network/security-overview#default-security-rules).

* The following Python code demonstrates how to create a new Azure Kubernetes Service cluster using the SDK:

    ```python
    from azureml.core.compute import ComputeTarget, AksCompute

    # Create the compute configuration and set virtual network information
    config = AksCompute.provisioning_configuration(location="eastus2")
    config.vnet_resourcegroup_name = "mygroup"
    config.vnet_name = "mynetwork"
    config.subnet_name = "default"
    config.service_cidr = "10.0.0.0/16"
    config.dns_service_ip = "10.0.0.10"
    config.docker_bridge_cidr = "172.17.0.1/16"

    # Create the compute target
    aks_target = ComputeTarget.create(workspace=ws,
                                    name="myaks",
                                    provisioning_configuration=config)
    ```

* To attach an existing Azure Kubernetes cluster that is already the virtual network, attach it to the workspace as described in [How to deploy to AKS](how-to-deploy-and-where.md).

* By default, a public IP address is assigned to Azure Kubernetes Service deployments. When using Azure Kubernetes Service inside a virtual network, you can use a private IP address instead. Private IP addresses are only accessible from inside the virtual network or joined networks. A private IP address is enabled by configuring AKS to use an _internal load balancer_. To use a private IP, use the following steps:

     1. If you create or attach an AKS cluster by providing a virtual network you previously created, you must grant the service principal (SP) or managed identity for your AKS cluster the _Network Contributor_ role to the resource group that contains the virtual network. This must be done before you try to change the internal load balancer to private IP. To add the identity as network contributor, use the following steps:

        1. To find the service principal or managed identity ID for AKS, use the following Azure CLI commands. Replace `<aks-cluster-name>` with the name of the cluster. Replace `<resource-group-name>` with the name of the resource group that _contains the AKS cluster_:

            ```azurecli-interactive
            az aks show -n <aks-cluster-name> --resource-group <resource-group-name> --query servicePrincipalProfile.clientId
            ``` 

            If this command returns a value of `msi`, use the following command to identify the principal ID for the managed identity:

            ```azurecli-interactive
            az aks show -n <aks-cluster-name> --resource-group <resource-group-name> --query identity.principalId
            ```

        1. To find the ID of the resource group that contains your virtual network, use the following command. Replace `<resource-group-name>` with the name of the resource group that _contains the virtual network_:

            ```azurecli-interactive
            az group show -n <resource-group-name> --query id
            ```

        1. To add the service principal or managed identity as a network contributor, use the following command. Replace `<SP-or-managed-identity>` with the ID returned for the service principal or managed identity. Replace `<resource-group-id>` with the ID returned for the resource group that contains the virtual network:

            ```azurecli-interactive
            az role assignment create --assignee <SP-or-managed-identity> --role 'Network Contributor' --scope <resource-group-id>
            ```
    
    1. Enable private IP:

        * The following code snippet demonstrates how to __create a new AKS cluster__, and then update it to use a private IP/internal load balancer:

            ```python
            import azureml.core
            from azureml.core.compute.aks import AksUpdateConfiguration
            from azureml.core.compute import AksCompute, ComputeTarget

            # Verify that cluster does not exist already
            try:
                aks_target = AksCompute(workspace=ws, name=aks_cluster_name)
                print("Found existing aks cluster")

            except:
                print("Creating new aks cluster")

                # Subnet to use for AKS
                subnet_name = "default"
                # Create AKS configuration
                prov_config = AksCompute.provisioning_configuration(location = "eastus2")
                # Set info for existing virtual network to create the cluster in
                prov_config.vnet_resourcegroup_name = "myvnetresourcegroup"
                prov_config.vnet_name = "myvnetname"
                prov_config.service_cidr = "10.0.0.0/16"
                prov_config.dns_service_ip = "10.0.0.10"
                prov_config.subnet_name = subnet_name
                prov_config.docker_bridge_cidr = "172.17.0.1/16"

                # Create compute target
                aks_target = ComputeTarget.create(workspace = ws, name = "myaks", provisioning_configuration = prov_config)
                # Wait for the operation to complete
                aks_target.wait_for_completion(show_output = True)
                
                # Update AKS configuration to use an internal load balancer
                update_config = AksUpdateConfiguration(None, "InternalLoadBalancer", subnet_name)
                aks_target.update(update_config)
                # Wait for the operation to complete
                aks_target.wait_for_completion(show_output = True)
            ```

        * When __attaching an existing cluster__ to your workspace, you must wait until after the attach operation to configure the load balancer. For information on attaching a cluster, see [Attach an existing AKS cluster](how-to-deploy-azure-kubernetes-service.md#attach-an-existing-aks-cluster).

            After attaching the existing cluster, you can then update the cluster to use a private IP.

            ```python
            import azureml.core
            from azureml.core.compute.aks import AksUpdateConfiguration
            from azureml.core.compute import AksCompute

            # ws = workspace object. Creation not shown in this snippet
            aks_target = AksCompute(ws,"myaks")

            # Change to the name of the subnet that contains AKS
            subnet_name = "default"
            # Update AKS configuration to use an internal load balancer
            update_config = AksUpdateConfiguration(None, "InternalLoadBalancer", subnet_name)
            aks_target.update(update_config)
            # Wait for the operation to complete
            aks_target.wait_for_completion(show_output = True)
            ```

## Use Azure Container Instances (ACI)

__Requirements__

* Azure Container Instances are dynamically created when deploying a model. To enable Azure Machine Learning to create ACI inside the virtual network, you must enable __subnet delegation__ for the subnet used by the deployment.

__Limitations__

* The virtual network must be in the same resource group as your Azure Machine Learning workspace.

* The Azure Container Registry (ACR) for your workspace cannot also be in the virtual network.

__Configuration__

To use ACI in a virtual network to your workspace, use the following steps:

1. To enable subnet delegation on your virtual network, use the information in the [Add or remove a subnet delegation](../virtual-network/manage-subnet-delegation.md) article. You can enable delegation when creating a virtual network, or add it to an existing network.

    > [!IMPORTANT]
    > When enabling delegation, use `Microsoft.ContainerInstance/containerGroups` as the __Delegate subnet to service__ value.

2. Deploy the model using [AciWebservice.deploy_configuration()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aci.aciwebservice?view=azure-ml-py#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none--primary-key-none--secondary-key-none--collect-model-data-none--cmk-vault-base-url-none--cmk-key-name-none--cmk-key-version-none--vnet-name-none--subnet-name-none-), use the `vnet_name` and `subnet_name` parameters. Set these parameters to the virtual network name and subnet where you enabled delegation.

## Azure Firewall

For information on using Azure Machine Learning with Azure Firewall, see [Use Azure Machine Learning workspace behind Azure Firewall](how-to-access-azureml-behind-firewall.md).

## Azure Container Registry

__Requirements__

* Your Azure Machine Learning workspace must be Enterprise edition. For information on upgrading, see [Upgrade to Enterprise edition](how-to-manage-workspace.md#upgrade).
* Your Azure Machine Learning workspace region should be [private link enabled region](https://docs.microsoft.com/azure/private-link/private-link-overview#availability). 
* Your Azure Container Registry must be Premium version. For more information on upgrading, see [Changing SKUs](/azure/container-registry/container-registry-skus#changing-skus).
* Your Azure Container Registry must be in the same virtual network and subnet as the storage account and compute targets used for training or inference.
* Your Azure Machine Learning workspace must contain an [Azure Machine Learning compute cluster](how-to-set-up-training-targets.md#amlcompute).

__Limitations__

* When ACR is behind a virtual network, Azure Machine Learning cannot use it to directly build Docker images. Instead, the compute cluster is used to build the images.

__Configuration__

1. To find the name of the Azure Container Registry for your workspace, use one of the following methods:

    __Azure portal__

    From the overview section of your workspace, the __Registry__ value links to the Azure Container Registry.

    :::image type="content" source="./media/how-to-enable-virtual-network/azure-machine-learning-container-registry.png" alt-text="Azure Container Registry for the workspace" border="true":::

    __Azure CLI__

    If you have [installed the Machine Learning extension for Azure CLI](reference-azure-machine-learning-cli.md), you can use the `az ml workspace show` command to show the workspace information.

    ```azurecli-interactive
    az ml workspace show -w yourworkspacename -g resourcegroupname --query 'containerRegistry'
    ```

    This command returns a value similar to `"/subscriptions/{GUID}/resourceGroups/{resourcegroupname}/providers/Microsoft.ContainerRegistry/registries/{ACRname}"`. The last part of the string is the name of the Azure Container Registry for the workspace.

1. To limit access to your virtual network, use the steps in [Configure network access for registry](../container-registry/container-registry-vnet.md#configure-network-access-for-registry). When adding the virtual network, select the virtual network and subnet for your Azure Machine Learning resources.

1. Use the Azure Machine Learning Python SDK to configure a compute cluster to build docker images. The following code snippet demonstrates how to do this:

    ```python
    from azureml.core import Workspace
    # Load workspace from an existing config file
    ws = Workspace.from_config()
    # Update the workspace to use an existing compute cluster
    ws.update(image_build_compute = 'mycomputecluster')
    ```

    > [!IMPORTANT]
    > Your storage account, compute cluster, and Azure Container Registry must all be in the same subnet of the virtual network.
    
    For more information, see the [update()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py#update-friendly-name-none--description-none--tags-none--image-build-compute-none--enable-data-actions-none-) method reference.

1. You must apply the following Azure Resource Manager template. This template enables your workspace to communicate with ACR.

    > [!WARNING]
    > This template enables a private endpoint for your workspace and changes it to an enterprise workspace. You cannot undo these changes.

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "keyVaultArmId": {
        "type": "string"
        },
        "workspaceName": {
        "type": "string"
        },
        "containerRegistryArmId": {
        "type": "string"
        },
        "applicationInsightsArmId": {
        "type": "string"
        },
        "storageAccountArmId": {
        "type": "string"
        },
        "location": {
        "type": "string"
        }
    },
    "resources": [
        {
        "type": "Microsoft.MachineLearningServices/workspaces",
        "apiVersion": "2019-11-01",
        "name": "[parameters('workspaceName')]",
        "location": "[parameters('location')]",
        "identity": {
            "type": "SystemAssigned"
        },
        "sku": {
            "tier": "enterprise",
            "name": "enterprise"
        },
        "properties": {
            "sharedPrivateLinkResources":
    [{"Name":"Acr","Properties":{"PrivateLinkResourceId":"[concat(parameters('containerRegistryArmId'), '/privateLinkResources/registry')]","GroupId":"registry","RequestMessage":"Approve","Status":"Pending"}}],
            "keyVault": "[parameters('keyVaultArmId')]",
            "containerRegistry": "[parameters('containerRegistryArmId')]",
            "applicationInsights": "[parameters('applicationInsightsArmId')]",
            "storageAccount": "[parameters('storageAccountArmId')]"
        }
        }
    ]
    }
    ```

## Key vault instance 

__Requirements__

__Limitations__

__Configuration__ 

To use Azure Machine Learning experimentation capabilities with Azure Key Vault behind a virtual network, use the [Configure Azure Key Vault firewalls and virtual networks](https://docs.microsoft.com/en-us/azure/key-vault/general/network-security) article.

> [!IMPORTANT]
> When following the steps in the article, use the same virtual network as used by your experimentation compute resources. You must also __qllow trusted Microsoft services to bypass this firewall__.

## Azure Databricks

__Requirements__

* The virtual network must be in the same subscription and region as the Azure Machine Learning workspace.
* If the Azure Storage Account(s) for the workspace are also secured in a virtual network, they must be in the same virtual network as the Azure Databricks cluster.
* In addition to the __databricks-private__ and __databricks-public__ subnets used by Azure Databricks, the __default__ subnet created for the virtual network is also required.

__Limitations__

__Configuration__

For specific information on using Azure Databricks with a virtual network, see [Deploy Azure Databricks in your Azure Virtual Network](https://docs.azuredatabricks.net/administration-guide/cloud-configurations/azure/vnet-inject.html).

<a id="vmorhdi"></a>

## Virtual machine or HDInsight cluster

__Requirements__

* Azure Machine Learning supports only virtual machines that are running Ubuntu.
* The SSH port must be enabled on the virtual machine or HDInsight cluster.

__Limitations__

__Configuration__

1. Create a VM or HDInsight cluster by using the Azure portal or the Azure CLI, and put the cluster in an Azure virtual network. For more information, see the following articles:

    * [Create and manage Azure virtual networks for Linux VMs](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-virtual-network)

    * [Extend HDInsight using an Azure virtual network](https://docs.microsoft.com/azure/hdinsight/hdinsight-extend-hadoop-virtual-network)

1. An NSG is automatically created for Linux-based Azure Virtual Machines. This NSG allows access to port 22 from any source. If you want to restrict access to the SSH port, you must allow access from Azure Machine Learning. To preserve access for Azure ML, you must allow access from a __source service__ with a __source service tag__ of __AzureMachineLearning__. For example, the following Azure CLI commands modify the SSH rule to only allow access from Azure Machine Learning.

    ```azurecli
    # Get default SSH rule
    nsgrule=$(az network nsg rule list --resource-group myResourceGroup --nsg-name myNetworkSecurityGroup --query [0].name -o tsv)
    # Update network security group rule to limit SSH to source service.
    az network nsg rule update --resource-group myResourceGroup --nsg-name myNetworkSecurityGroupBackEnd \
    --name $nsgrule --protocol tcp --direction inbound --priority 100 \
    --source-address-prefix AzureMachineLearning --source-port-range '*' --destination-address-prefix '*' \
    --destination-port-range 22 --access allow
    ```

    For more information, see the [Create network security groups](/azure/virtual-machines/linux/tutorial-virtual-network#create-network-security-groups) section of the Azure Virtual Networks for Linux virtual machines article.
    
    Keep the default outbound rules for the network security group. For more information, see the default security rules in [Security groups](https://docs.microsoft.com/azure/virtual-network/security-overview#default-security-rules).
    
    If you don't want to use the default outbound rules and you do want to limit the outbound access of your virtual network, see the [Limit outbound connectivity from the virtual network](#limiting-outbound-from-vnet) section.

1. Attach the VM or HDInsight cluster to your Azure Machine Learning workspace. For more information, see [Set up compute targets for model training](how-to-set-up-training-targets.md).


## Next steps

* [Set up training environments](how-to-set-up-training-targets.md)
* [Set up private endpoints](how-to-configure-private-link.md)
* [Where to deploy models](how-to-deploy-and-where.md)
* [Use TLS to secure a web service through Azure Machine Learning](how-to-secure-web-service.md)
