---
title: Deploy Hyperledger Fabric consortium on Azure Kubernetes Service
description: How to deploy and configure a Hyperledger Fabric consortium network on Azure Kubernetes Service
ms.date: 03/01/2021
ms.topic: how-to
ms.reviewer: ravastra
ms.custom: contperf-fy21q3, devx-track-azurecli
---

# Deploy Hyperledger Fabric consortium on Azure Kubernetes Service

You can use the Hyperledger Fabric on Azure Kubernetes Service (AKS) template to deploy and configure a Hyperledger Fabric consortium network on Azure.

After reading this article, you will:

- Have a working knowledge of Hyperledger Fabric and the components that form the building blocks of a Hyperledger Fabric blockchain network.
- Know how to deploy and configure a Hyperledger Fabric consortium network on Azure Kubernetes Service for your production scenarios.

>[!IMPORTANT] 
>
>The template supports Azure Kubernetes Service version 1.18.x and below only. Due to the recent [update in Kubernetes](https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker/) for underneath runtime environment from docker to "containerd", the chaincode containers will not be functional, customers will have to move to running external chaincode as a service which is possible on HLF 2.2x only. Until AKS v1.18.x is supported by Azure, one will be able to deploy this template through following the steps [here](https://github.com/Azure/Hyperledger-Fabric-on-Azure-Kubernetes-Service).


[!INCLUDE [Preview note](./includes/preview.md)]

## Choose an Azure Blockchain solution

Before you choose to use a solution template, compare your scenario with the common use cases of available Azure Blockchain options:

Option | Service model | Common use case
-------|---------------|-----------------
Solution templates | IaaS | Solution templates are Azure Resource Manager templates that you can use to provision a fully configured blockchain network topology. The templates deploy and configure Microsoft Azure compute, networking, and storage services for a blockchain network type. Solution templates are provided without a service-level agreement. Use the [Microsoft Q&A page](/answers/topics/azure-blockchain-workbench.html) for support.
[Azure Blockchain Service](../service/overview.md) | PaaS | Azure Blockchain Service Preview simplifies the formation, management, and governance of consortium blockchain networks. Use Azure Blockchain Service for solutions that require PaaS, consortium management, or contract and transaction privacy.
[Azure Blockchain Workbench](../workbench/overview.md) | IaaS and PaaS | Azure Blockchain Workbench Preview is a collection of Azure services and capabilities that help you create and deploy blockchain applications to share business processes and data with other organizations. Use Azure Blockchain Workbench for prototyping a blockchain solution or a proof of concept for a blockchain application. Azure Blockchain Workbench is provided without a service-level agreement. Use the [Microsoft Q&A page](/answers/topics/azure-blockchain-workbench.html) for support.

## Deploy the orderer and peer organization

To begin, you need an Azure subscription that can support deploying several virtual machines and standard storage accounts. If you don't have an Azure subscription, you can [create a free Azure account](https://azure.microsoft.com/free/).

To get started with the deployment of Hyperledger Fabric network components, go to the [Azure portal](https://portal.azure.com).

1. Select **Create a resource** > **Blockchain**, and then search for **Hyperledger Fabric on Azure Kubernetes Service (preview)**.

2. Enter the project details on the **Basics** tab.

    ![Screenshot that shows the Basics tab.](./media/hyperledger-fabric-consortium-azure-kubernetes-service/create-for-hyperledger-fabric-basics.png)

3. Enter the following details:
    - **Subscription**: Choose the subscription name where you want to deploy the Hyperledger Fabric network components.
    - **Resource group**: Either create a new resource group or choose an existing empty resource group. The resource group will hold all resources deployed as part of the template.
    - **Region**: Choose the Azure region where you want to deploy the Azure Kubernetes Service cluster for the Hyperledger Fabric components. The template is available in all regions where AKS is available. Choose a region where your subscription is not hitting the virtual machine (VM) quota limit.
    - **Resource prefix**: Enter a prefix for naming of resources that are deployed. It must be fewer than six characters, and the combination of characters must include both numbers and letters.
4. Select the **Fabric settings** tab to define the Hyperledger Fabric network components that will be deployed.

    ![Screenshot that shows the Fabric settings tab.](./media/hyperledger-fabric-consortium-azure-kubernetes-service/create-for-hyperledger-fabric-settings.png)

5. Enter the following details:
    - **Organization name**: Enter the name of the Hyperledger Fabric organization, which is required for various data plane operations. The organization name needs to be unique per deployment.
    - **Fabric network component**: Choose either **Ordering service** or **Peer nodes**, based on the blockchain network component that you want to set up.
    - **Number of nodes**: The following are the two types of nodes:
        - **Ordering service**: Nodes responsible for transaction ordering in the ledger. Select the number of nodes to provide fault tolerance to the network. The supported order node count is 3, 5, and 7.
        - **Peer nodes**: Nodes that host ledgers and smart contracts. You can choose 1 to 10 nodes based on your requirement.
    - **Peer node world state database**: World state databases for the peer nodes. LevelDB is the default state database embedded in the peer node. It stores chaincode data as simple key/value pairs and supports key, key range, and composite key queries only. CouchDB is an optional alternate state database that supports rich queries when chaincode data values are modeled as JSON. This field is displayed when you choose **Peer nodes** in the **Fabric network component** drop-down list.
    - **Fabric CA username**: The Fabric certificate authority allows you to initialize and start a server process that hosts the certificate authority. It allows you to manage identities and certificates. Each AKS cluster deployed as part of the template will have a Fabric CA pod by default. Enter the username that's used for Fabric CA authentication.
    - **Fabric CA password**: Enter the password for Fabric CA authentication.
    - **Confirm password**: Confirm the Fabric CA password.
    - **Certificates**: If you want to use your own root certificates to initialize the Fabric CA, then choose the **Upload root certificate for Fabric CA** option. Otherwise, the Fabric CA creates self-signed certificates by default.
    - **Root Certificate**: Upload the root certificate (public key) with which Fabric CA needs to be initialized. Certificates of .pem format are supported. The certificates should be valid and in a UTC time zone.
    - **Root Certificate private key**: Upload the private key of the root certificate. If you have a .pem certificate, which has a combined public and private key, upload it here as well.


6. Select the **AKS cluster Settings** tab to define the Azure Kubernetes Service cluster configuration. The AKS cluster has various pods configured for running the Hyperledger Fabric network components. The deployed Azure resources are:

    - **Fabric tools**: Tools that are responsible for configuring the Hyperledger Fabric components.
    - **Orderer/peer pods**: The nodes of the Hyperledger Fabric network.
    - **Proxy**: An NGNIX proxy pod through which the client applications can communicate with the AKS cluster.
    - **Fabric CA**: The pod that runs the Fabric CA.
    - **PostgreSQL**: Database instance that maintains the Fabric CA identities.
    - **Key vault**: Instance of the Azure Key Vault service that's deployed to save the Fabric CA credentials and the root certificates provided by the customer. The vault is used in case of template deployment retry, to handle the mechanics of the template.
    - **Managed disk**: Instance of the Azure Managed Disks service that provides a persistent store for the ledger and for the peer node's world state database.
    - **Public IP**: Endpoint of the AKS cluster deployed for communicating with the cluster.

    Enter the following details:

    ![Screenshot that shows the A K S cluster settings tab.](./media/hyperledger-fabric-consortium-azure-kubernetes-service/create-for-hyperledger-fabric-aks-cluster-settings-1.png)

    - **Kubernetes cluster name**: Change the name of the AKS cluster, if necessary. This field is prepopulated based on the resource prefix that's provided.
    - **Kubernetes version**: Choose the version of Kubernetes that will be deployed on the cluster. Based on the region that you selected on the **Basics** tab, the available supported versions might change.
    - **DNS prefix**: Enter a Domain Name System (DNS) name prefix for the AKS cluster. You'll use DNS to connect to the Kubernetes API when managing containers after you create the cluster.
    - **Node size**: For the size of the Kubernetes node, you can choose from the list of VM stock-keeping units (SKUs) available on Azure. For optimal performance, we recommend Standard DS3 v2.
    - **Node count**: Enter the number of Kubernetes nodes to be deployed in the cluster. We recommend keeping this node count equal to or more than the number of Hyperledger Fabric nodes specified on the **Fabric settings** tab.
    - **Service principal client ID**: Enter the client ID of an existing service principal or create a new one. A service principal is required for AKS authentication. See the [steps to create a service principal](/powershell/azure/create-azure-service-principal-azureps#create-a-service-principal).
    - **Service principal client secret**: Enter the client secret of the service principal provided in the client ID for the service principal.
    - **Confirm client secret**: Confirm the client secret for the service principal.
    - **Enable container monitoring**: Choose to enable AKS monitoring, which enables the AKS logs to push to the specified Log Analytics workspace.
    - **Log Analytics workspace**: The Log Analytics workspace will be populated with the default workspace that's created if monitoring is enabled.

8. Select the **Review and create** tab. This step triggers the validation for the values that you provided.
9. After validation passes, select **Create**.

    The deployment usually takes 10 to 12 minutes. The time might vary depending on the size and number of AKS nodes specified.
10. After successful deployment, you're notified through Azure notifications on the upper-right corner.
11. Select **Go to resource group** to check all the resources created as part of the template deployment. All the resource names will start with the prefix provided on the **Basics** tab.

## Build the consortium

To build the blockchain consortium after deploying the ordering service and peer nodes, carry out the following steps in sequence. The Azure Hyperledger Fabric script (azhlf) helps you with setting up the consortium, creating the channel, and performing chaincode operations.

> [!NOTE]
> The Azure Hyperledger Fabric (azhlf) script has been updated to provide more functionality. If you want to refer to the old script, see the [readme on GitHub](https://github.com/Azure/Hyperledger-Fabric-on-Azure-Kubernetes-Service/blob/master/consortiumScripts/README.md). This script is compatible with Hyperledger Fabric on Azure Kubernetes Service template version 2.0.0 and later. To check the version of the deployment, follow the steps in [Troubleshoot](#troubleshoot).

> [!NOTE]
> The script is provided to help with demonstration, development, and test scenarios only. The channel and consortium that this script creates has basic Hyperledger Fabric policies to simplify demo, dev, and test scenarios. For production setup, we recommend updating channel/consortium Hyperledger Fabric policies in line with your organization's compliance needs by using the native Hyperledger Fabric APIs.


All the commands to run the Azure Hyperledger Fabric script can be executed through Azure Bash command-line interface (CLI). You can sign in to Azure Cloud Shell through¯the ![Hyperledger Fabric on Azure Kubernetes Service Template](./media/hyperledger-fabric-consortium-azure-kubernetes-service/arrow.png) option at the upper-right corner of the Azure portal. On the command prompt, type `bash` and select the Enter key to switch to the Bash CLI, or select **Bash** from the Cloud Shell toolbar.

See [Azure Cloud Shell](../../cloud-shell/overview.md) for more information.

![Screenshot that shows commands in Azure Cloud Shell.](./media/hyperledger-fabric-consortium-azure-kubernetes-service/hyperledger-powershell.png)


The following image shows the step-by-step process to build a consortium between an orderer organization and a peer organization. The following sections show detailed commands to complete these steps.

![Diagram of the process to build a consortium.](./media/hyperledger-fabric-consortium-azure-kubernetes-service/process-to-build-consortium-flow-chart.png)

After you finish the initial setup, use the client application to achieve the following operations:

- Channel management
- Consortium management
- Chaincode management

### Download client application files

The first setup is to download the client application files. Run the following commands to download all the required files and packages:

```bash-interactive
curl https://raw.githubusercontent.com/Azure/Hyperledger-Fabric-on-Azure-Kubernetes-Service/master/azhlfToolSetup.sh | bash
cd azhlfTool
npm install
npm run setup
```

These commands will clone Azure Hyperledger Fabric client application code from the public GitHub repo, followed by loading all the dependent npm packages. After successful execution of command, you can see a node_modules folder in the current directory. All the required packages are loaded in the node_modules folder.

### Set up environment variables

All environment variables follow the Azure resource naming convention.

#### Set environment variables for the orderer organization's client

```azurecli
ORDERER_ORG_SUBSCRIPTION=<ordererOrgSubscription>
ORDERER_ORG_RESOURCE_GROUP=<ordererOrgResourceGroup>
ORDERER_ORG_NAME=<ordererOrgName>
ORDERER_ADMIN_IDENTITY="admin.$ORDERER_ORG_NAME"
CHANNEL_NAME=<channelName>
```

#### Set environment variables for the peer organization's client

```azurecli
PEER_ORG_SUBSCRIPTION=<peerOrgSubscritpion>
PEER_ORG_RESOURCE_GROUP=<peerOrgResourceGroup>
PEER_ORG_NAME=<peerOrgName>
PEER_ADMIN_IDENTITY="admin.$PEER_ORG_NAME"
CHANNEL_NAME=<channelName>
```

Based on the number of peer organizations in your consortium, you might be required to repeat the peer commands and set the environment variable accordingly.

#### Set environment variables for an Azure storage account

```azurecli
STORAGE_SUBSCRIPTION=<subscriptionId>
STORAGE_RESOURCE_GROUP=<azureFileShareResourceGroup>
STORAGE_ACCOUNT=<azureStorageAccountName>
STORAGE_LOCATION=<azureStorageAccountLocation>
STORAGE_FILE_SHARE=<azureFileShareName>
```

Use the following commands to create an Azure storage account. If you already have Azure storage account, skip this step.

```azurecli
az account set --subscription $STORAGE_SUBSCRIPTION
az group create -l $STORAGE_LOCATION -n $STORAGE_RESOURCE_GROUP
az storage account create -n $STORAGE_ACCOUNT -g  $STORAGE_RESOURCE_GROUP -l $STORAGE_LOCATION --sku Standard_LRS
```

Use the following commands to create a file share in the Azure storage account. If you already have a file share, skip this step.

```azurecli
STORAGE_KEY=$(az storage account keys list --resource-group $STORAGE_RESOURCE_GROUP  --account-name $STORAGE_ACCOUNT --query "[0].value" | tr -d '"')
az storage share create  --account-name $STORAGE_ACCOUNT  --account-key $STORAGE_KEY  --name $STORAGE_FILE_SHARE
```

Use the following commands to generate a connection string for an Azure file share.

```azurecli
STORAGE_KEY=$(az storage account keys list --resource-group $STORAGE_RESOURCE_GROUP  --account-name $STORAGE_ACCOUNT --query "[0].value" | tr -d '"')
SAS_TOKEN=$(az storage account generate-sas --account-key $STORAGE_KEY --account-name $STORAGE_ACCOUNT --expiry `date -u -d "1 day" '+%Y-%m-%dT%H:%MZ'` --https-only --permissions lruwd --resource-types sco --services f | tr -d '"')
AZURE_FILE_CONNECTION_STRING=https://$STORAGE_ACCOUNT.file.core.windows.net/$STORAGE_FILE_SHARE?$SAS_TOKEN

```

### Import an organization connection profile, admin user identity, and MSP

Use the following commands to fetch the organization's connection profile, admin user identity, and Managed Service Provider (MSP) from the Azure Kubernetes Service cluster and store these identities in the client application's local store. An example of a local store is the *azhlfTool/stores* directory.

For the orderer organization:

```azurecli
./azhlf adminProfile import fromAzure -o $ORDERER_ORG_NAME -g $ORDERER_ORG_RESOURCE_GROUP -s $ORDERER_ORG_SUBSCRIPTION
./azhlf connectionProfile import fromAzure -g $ORDERER_ORG_RESOURCE_GROUP -s $ORDERER_ORG_SUBSCRIPTION -o $ORDERER_ORG_NAME
./azhlf msp import fromAzure -g $ORDERER_ORG_RESOURCE_GROUP -s $ORDERER_ORG_SUBSCRIPTION -o $ORDERER_ORG_NAME
```

For the peer organization:

```azurecli
./azhlf adminProfile import fromAzure -g $PEER_ORG_RESOURCE_GROUP -s $PEER_ORG_SUBSCRIPTION -o $PEER_ORG_NAME
./azhlf connectionProfile import fromAzure -g $PEER_ORG_RESOURCE_GROUP -s $PEER_ORG_SUBSCRIPTION -o $PEER_ORG_NAME
./azhlf msp import fromAzure -g $PEER_ORG_RESOURCE_GROUP -s $PEER_ORG_SUBSCRIPTION -o $PEER_ORG_NAME
```

### Create a channel

From the orderer organization's client, use the following command to create a channel that contains only the orderer organization.

```azurecli
./azhlf channel create -c $CHANNEL_NAME -u $ORDERER_ADMIN_IDENTITY -o $ORDERER_ORG_NAME
```

### Add a peer organization for consortium management

>[!NOTE]
> Before you start with any consortium operation, ensure that you've finished the initial setup of the client application.

Run the following commands in the given order to add a peer organization in a channel and consortium:

1.    From the peer organization's client, upload the peer organization's MSP on Azure Storage.

      ```azurecli
      ./azhlf msp export toAzureStorage -f  $AZURE_FILE_CONNECTION_STRING -o $PEER_ORG_NAME
      ```
2.    From the orderer organization's client, download the peer organization's MSP from Azure Storage. Then issue the command to add the peer organization in the channel and consortium.

      ```azurecli
      ./azhlf msp import fromAzureStorage -o $PEER_ORG_NAME -f $AZURE_FILE_CONNECTION_STRING
      ./azhlf channel join -c  $CHANNEL_NAME -o $ORDERER_ORG_NAME  -u $ORDERER_ADMIN_IDENTITY -p $PEER_ORG_NAME
      ./azhlf consortium join -o $ORDERER_ORG_NAME  -u $ORDERER_ADMIN_IDENTITY -p $PEER_ORG_NAME
      ```

3.    From the orderer organization's client, upload the orderer's connection profile on Azure Storage so that the peer organization can connect to the orderer nodes by using this connection profile.

      ```azurecli
      ./azhlf connectionProfile  export toAzureStorage -o $ORDERER_ORG_NAME -f $AZURE_FILE_CONNECTION_STRING
      ```

4.    From the peer organization's client, download the orderer's connection profile from Azure Storage. Then run the command to add peer nodes in the channel.

      ```azurecli
      ./azhlf connectionProfile  import fromAzureStorage -o $ORDERER_ORG_NAME -f $AZURE_FILE_CONNECTION_STRING
      ./azhlf channel joinPeerNodes -o $PEER_ORG_NAME  -u $PEER_ADMIN_IDENTITY -c $CHANNEL_NAME --ordererOrg $ORDERER_ORG_NAME
      ```

Similarly, to add more peer organizations in the channel, update peer environment variables according to the required peer organization and redo steps 1 to 4.

### Set anchor peers

From the peer organization's client, run the command to set anchor peers for the peer organization in the specified channel.

>[!NOTE]
> Before you run this command, ensure that the peer organization is added in the channel by using consortium management commands.

```azurecli
./azhlf channel setAnchorPeers -c $CHANNEL_NAME -p <anchorPeersList> -o $PEER_ORG_NAME -u $PEER_ADMIN_IDENTITY --ordererOrg $ORDERER_ORG_NAME
```

`<anchorPeersList>` is a space-separated list of peer nodes to be set as an anchor peer. For example:

  - Set `<anchorPeersList>` as `"peer1"` if you want to set only the peer1 node as an anchor peer.
  - Set `<anchorPeersList>` as `"peer1" "peer3"` if you want to set both peer1 and peer3 nodes as anchor peers.

## Chaincode management commands

>[!NOTE]
> Before you start with any chaincode operation, ensure that you've done the initial setup of the client application.

### Set the chaincode-specific environment variables

```azurecli
# Peer organization name where the chaincode operation will be performed
ORGNAME=<PeerOrgName>
USER_IDENTITY="admin.$ORGNAME"
# If you are using chaincode_example02 then set CC_NAME="chaincode_example02"
CC_NAME=<chaincodeName>
# If you are using chaincode_example02 then set CC_VERSION="1" for validation
CC_VERSION=<chaincodeVersion>
# Language in which chaincode is written. Supported languages are 'node', 'golang', and 'java'
# Default value is 'golang'
CC_LANG=<chaincodeLanguage>
# CC_PATH contains the path where your chaincode is placed. This is the absolute path to the chaincode project root directory.
# If you are using chaincode_example02 to validate then CC_PATH="/home/<username>/azhlfTool/samples/chaincode/src/chaincode_example02/go"
CC_PATH=<chaincodePath>
# Channel on which chaincode will be instantiated/invoked/queried
CHANNEL_NAME=<channelName>
```

### Install chaincode

Run the following command to install chaincode on the peer organization.

```azurecli
./azhlf chaincode install -o $ORGNAME -u $USER_IDENTITY -n $CC_NAME -p $CC_PATH -l $CC_LANG -v $CC_VERSION

```
The command will install chaincode on all the peer nodes of the peer organization set in the `ORGNAME` environment variable. If two or more peer organizations are in your channel and you want to install chaincode on all of them, run this command separately for each peer organization.

Follow these steps:

1.    Set `ORGNAME` and `USER_IDENTITY` according to `peerOrg1` and run the `./azhlf chaincode install` command.
2.    Set `ORGNAME` and `USER_IDENTITY` according to `peerOrg2` and run the `./azhlf chaincode install` command.

### Instantiate chaincode

From the peer client application, run the following command to instantiate chaincode on the channel.

```azurecli
./azhlf chaincode instantiate -o $ORGNAME -u $USER_IDENTITY -n $CC_NAME -v $CC_VERSION -c $CHANNEL_NAME -f <instantiateFunc> --args <instantiateFuncArgs>
```

Pass the instantiation function name and space-separated list of arguments in `<instantiateFunc>` and `<instantiateFuncArgs>` respectively. For example, to instantiate chaincode_example02.go chaincode, set `<instantiateFunc>` to `init` and `<instantiateFuncArgs>` to `"a" "2000" "b" "1000"`.

You can also pass the collection's configuration JSON file by using the `--collections-config` flag. Or, set the transient arguments by using the `-t` flag while instantiating chaincode used for private transactions.

For example:

```azurecli
./azhlf chaincode instantiate -c $CHANNEL_NAME -n $CC_NAME -v $CC_VERSION -o $ORGNAME -u $USER_IDENTITY --collections-config <collectionsConfigJSONFilePath>
./azhlf chaincode instantiate -c $CHANNEL_NAME -n $CC_NAME -v $CC_VERSION -o $ORGNAME -u $USER_IDENTITY --collections-config <collectionsConfigJSONFilePath> -t <transientArgs>
```

The `<collectionConfigJSONFilePath>` part is the path to the JSON file that contains the collections defined for the instantiation of private data chaincode. You can find a sample collection's configuration JSON file relative to the *azhlfTool* directory at the following path: `./samples/chaincode/src/private_marbles/collections_config.json`.
Pass `<transientArgs>` as valid JSON in string format. Escape any special characters. For example:
`'{\\\"asset\":{\\\"name\\\":\\\"asset1\\\",\\\"price\\\":99}}'`

> [!NOTE]
> Run the command once from any one peer organization in the channel. After the transaction is successfully submitted to the orderer, the orderer distributes this transaction to all the peer organizations in the channel. Chaincode is then instantiated on all the peer nodes on all the peer organizations in the channel.

### Invoke chaincode

From the peer organization's client, run the following command to invoke the chaincode function:

```azurecli
./azhlf chaincode invoke -o $ORGNAME -u $USER_IDENTITY -n $CC_NAME -c $CHANNEL_NAME -f <invokeFunc> -a <invokeFuncArgs>
```

Pass the invoke function name and space-separated list of arguments in `<invokeFunction>` and `<invokeFuncArgs>` respectively. Continuing with the chaincode_example02.go chaincode example, to perform an invoke operation, set `<invokeFunction>` to `invoke` and `<invokeFuncArgs>` to `"a" "b" "10"`.

>[!NOTE]
> Run the command once from any one peer organization in the channel. After the transaction is successfully submitted to the orderer, the orderer distributes this transaction to all the peer organizations in the channel. The world state is then updated on all peer nodes of all the peer organizations in the channel.


### Query chaincode

Run the following command to query chaincode:

```azurecli
./azhlf chaincode query -o $ORGNAME -p <endorsingPeers> -u $USER_IDENTITY -n $CC_NAME -c $CHANNEL_NAME -f <queryFunction> -a <queryFuncArgs>
```
Endorsing peers are peers where chaincode is installed and is called for execution of transactions. You must set `<endorsingPeers>` to contain peer node names from the current peer organization. List the endorsing peers for a given chaincode and channel combination separated by spaces. For example: `-p "peer1" "peer3"`.

If you're using *azhlfTool* to install chaincode, pass any peer node names as a value to the endorsing peer argument. Chaincode is installed on every peer node for that organization.

Pass the query function name and space-separated list of arguments in `<queryFunction>` and `<queryFuncArgs>` respectively. Again taking chaincode_example02.go chaincode as a reference, to query the value of "a" in the world state, set `<queryFunction>` to `query` and `<queryArgs>` to "a".

## Troubleshoot

### Find deployed version

Run the following commands to find the version of your template deployment. Set environment variables according to the resource group where the template has been deployed.

```azurecli
SWITCH_TO_AKS_CLUSTER $AKS_CLUSTER_RESOURCE_GROUP $AKS_CLUSTER_NAME $AKS_CLUSTER_SUBSCRIPTION
kubectl describe pod fabric-tools -n tools | grep "Image:" | cut -d ":" -f 3
```

### Patch previous version

If you are facing issues with running chaincode on any deployments of template version below v3.0.0, then follow the below steps to patch your peer nodes with a fix.

Download the peer deployment script.

```bash
curl https://raw.githubusercontent.com/Azure/Hyperledger-Fabric-on-Azure-Kubernetes-Service/master/scripts/patchPeerDeployment.sh -o patchPeerDeployment.sh; chmod 777 patchPeerDeployment.sh
```

Run the script using the following command replacing the parameters for your peer.

```bash
source patchPeerDeployment.sh <peerOrgSubscription> <peerOrgResourceGroup> <peerOrgAKSClusterName>
```

Wait for all your peer nodes to get patched. You can always check the status of your peer nodes, in different instance of the shell using the following command.

```bash
kubectl get pods -n hlf
```

## Support and feedback

To stay up to date on blockchain service offerings and information from the Azure Blockchain engineering team, visit the [Azure Blockchain blog](https://azure.microsoft.com/blog/topics/blockchain/).

To provide product feedback or to request new features, post or vote for an idea via the [Azure feedback forum for blockchain](https://aka.ms/blockchainuservoice).

### Community support

Engage with Microsoft engineers and Azure Blockchain community experts:

- [Microsoft Q&A page](/answers/topics/azure-blockchain-workbench.html)

  Engineering support for blockchain templates is limited to deployment issues.
- [Microsoft tech community](https://techcommunity.microsoft.com/t5/Blockchain/bd-p/AzureBlockchain)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-blockchain-workbench)
