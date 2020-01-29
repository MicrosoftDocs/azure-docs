---
title: Hyperledger Fabric consortium on Azure Kubernetes Service (AKS)
description: How to deploy and configure Hyperledger Fabric consortium network on Azure Kubernetes Service
ms.date: 01/08/2020
ms.topic: article
ms.reviewer: v-umha
---


# Hyperledger Fabric consortium on Azure Kubernetes Service (AKS)

You can use the Hyperledger Fabric (HLF) on Azure Kubernetes Service (AKS) template to deploy and configure a Hyperledger Fabric consortium network on Azure.

After reading this article, you will:

- Obtain working knowledge of Hyperledger Fabric and the various components that form the building blocks of Hyperledger Fabric blockchain network.
- Learn how to deploy and configure a Hyperledger Fabric consortium on Azure Kubernetes Service for your production scenarios.

## Hyperledger Fabric Consortium architecture

To build Hyperledger Fabric network on Azure, you need to deploy Ordering Service and organization with peer nodes. The different fundamental components that are created as part of the template deployment are:

- **Orderer nodes**: A node that is responsible for transaction ordering in the ledger. Along with other nodes, the ordered nodes form the ordering service of the Hyperledger Fabric network.

- **Peer nodes**: A node that primarily host ledgers and smart contracts, these fundamental elements of the network.

- **Fabric CA**: Fabric CA is the Certificate Authority (CA) for Hyperledger Fabric. The Fabric CA allows you to initialize and start server process that hosts the certificate authority. It allows you to manage identities and certificates. Each AKS cluster deployed as part of the template will have a Fabric CA pod by default.

- **CouchDB or LevelDB**: World state database for the peer nodes can be stored either in LevelDB or CouchDB. LevelDB is the default state database embedded in the peer node and stores chaincode data as simple key-value pairs and supports key, key range, and composite key queries only. CouchDB is an optional alternate state database that supports rich queries when chaincode data values are modeled as JSON.

The template on deployment spins up various Azure resources in your subscription. The different Azure resources deployed are:

- **AKS cluster**: Azure Kubernetes cluster that is configured as per the input parameters provided by the customer. The AKS cluster has various pods configured for running the Hyperledger Fabric network components. The different pods created are:

  - **Fabric tools**: The fabric tool is responsible for configuring the Hyperledger Fabric components.
  - **Orderer/peer pods**: The nodes of the HLF network.
  - **Proxy**: A NGNIX proxy pod through which the client applications can interface with the AKS cluster.
  - **Fabric CA**: The pod that runs the Fabric CA.
- **PostgreSQL**: An instance of PostgreSQL is deployed to maintain the Fabric CA identities.

- **Azure Key vault**: A key vault instance is deployed to save the Fabric CA credentials and the root certificates provided by customer, which is used in case of template deployment retry, this is to handle the mechanics of the template.
- **Azure Managed disk**: Azure Managed disk is for persistent store for ledger and peer node world state database.
- **Public IP**: A public IP endpoint of the AKS cluster deployed for interfacing with the cluster.

## Hyperledger Fabric Blockchain network setup

To begin, you need an Azure subscription that can support deploying several virtual machines and standard storage accounts. If you do not have an Azure subscription, you can [create a free Azure account](https://azure.microsoft.com/free/).

Setup Hyperledger Fabric Blockchain network using the following steps:

- [Deploy the orderer/peer organization](#deploy-the-ordererpeer-organization)
- [Build the consortium](#build-the-consortium)
- [Run native HLF operations](#run-native-hlf-operations)

## Deploy the orderer/peer organization

To get started with the HLF network components deployment, navigate to the [Azure portal](https://portal.azure.com). Select **Create a resource > Blockchain** > search for **Hyperledger Fabric on Azure Kubernetes Service**.

1. Select **create** to start the template deployment. The **Create Hyperledger Fabric on Azure Kubernetes Service** displays.

    ![Hyperledger Fabric on Azure Kubernetes Service Template](./media/hyperledger-fabric-consortium-azure-kubernetes-service/hyperledger-fabric-aks.png)

2. Enter the project details in **Basics** page.

    ![Hyperledger Fabric on Azure Kubernetes Service Template](./media/hyperledger-fabric-consortium-azure-kubernetes-service/create-for-hyperledger-fabric-basics.png)

3. Enter the following details:
    - **Subscription**: Choose the subscription name where you want to deploy the HLF network components.
    - **Resource group**: Either create a new resource group or choose an existing empty resource group, the resource group will hold all resources deployed as part of the template.
    - **Region**: Choose the Azure region where you want to deploy the Azure Kubernetes cluster for the HLF components. The template is available in all regions where AKS is available Ensure to choose a region where your subscription is not hitting the Virtual Machine (VM) quota limit.
    - **Resource prefix**: Prefix for naming of resources that are deployed. Resource prefix must be less than six characters in length and the combination of characters must include both numbers and letters.
4. Select **Fabric Settings** tab to define the HLF network components that will be deployed.

    ![Hyperledger Fabric on Azure Kubernetes Service Template](./media/hyperledger-fabric-consortium-azure-kubernetes-service/create-for-hyperledger-fabric-settings.png)

5. Enter the following details:
    - **Organization name**: The name of the Fabric organization, which is required for various data plane operations.
    - **Fabric network component**: Choose either Ordering Service or Peer nodes based on Blockchain network component you want to setup.
    - **Number of nodes** - The following are the two types of nodes:
        - Ordering service - select the number of nodes to provided fault tolerance to the network. Only 3,5 and 7 are the supported orderer node count.
        - Peer nodes - you can choose 1-10 nodes based on your requirement.
    - **Peer node world state database**: Choose between LevelDB and CoucbDB. This field is displayed when the user chooses peer node in Fabric network component drop-down.
    - **Fabric username**: Enter the username that is used for the Fabric CA authentication.
    - **Fabric CA password**: Enter the password for Fabric CA authentication.
    - **Confirm password**: Confirm the Fabric CA password.
    - **Certificates**: If you want to use your own root certificates to initialize the Fabric CA then choose Upload root certificate for Fabric CA option, else by default Fabric CA creates self-signed certificates.
    - **Root Certificate**: Upload root certificate (public key) with which Fabric CA needs to be initialized. Certificates of .pem format are supported, the certificates should be valid in UTC time zone.
    - **Root Certificate private key**: Upload the private key of the root certificate. If you have a .pem certificate, which has both public and private key combined, upload it here as well.


6. Select **AKS cluster Settings** tab to define the Azure Kubernetes cluster configuration that is the underlying infrastructure on which the Fabric network components will be setup.

    ![Hyperledger Fabric on Azure Kubernetes Service Template](./media/hyperledger-fabric-consortium-azure-kubernetes-service/create-for-hyperledger-fabric-aks-cluster-settings-1.png)

7. Enter the following details:
    - **Kubernetes cluster name**: The name of the AKS cluster that is created. This field is prepopulated based on the resource prefix provided, you can change if necessary.
    - **Kubernetes version**: The version of the Kubernetes that will be deployed on the cluster. Based on the region selected in the **Basics** tab, the supported versions available may change.
    - **DNS prefix**: Domain Name System (DNS) name prefix for AKS cluster. You'll use DNS to connect to the Kubernetes API when managing containers after creating the cluster.
    - **Node size**: The size of the Kubernetes node, you can choose from the list of VM Stock keeping unit (SKUs) available on Azure. For optimal performance, we recommend Standard DS3 v2.
    - **Node count**: The count of the number of Kubernetes nodes to be deployed in the cluster. We recommend keeping this node count at least equal or more than the number of HLF nodes specified in the Fabric settings.
    - **Service principal client ID**: Enter the client ID of an existing service principal or create a new, which is required for the AKS authentication. See, steps to [create service principal](https://docs.microsoft.com/powershell/azure/create-azure-service-principal-azureps?view=azps-3.2.0#create-a-service-principal).
    - **Service principal client secret**: Enter the client secret of the service principal provided in the service principal client ID.
    - **Confirm client secret**: Confirm the client secret provided in the service principal client secret.
    - **Enable container monitoring**: Choose to enable AKS monitoring, which enables the AKS logs to push to the Log Analytics workspace specified.
    - **Log Analytics workspace**: Log analytics workspace will be populated with the default workspace that is created if monitoring is enabled.

8. After providing all the above details, select **Review and create** tab. The review and create triggers the validation for the values you provided.
9. Once the validation passes, you can select **create**.
The deployment usually takes 10-12 minutes, might vary depending on the size and number of AKS nodes specified.
10. After the successful deployment, you're notified through Azure notifications on top-right corner.
11. Select **Go to resource group** to check all the resources created as part of the template deployment. All the resource names will start with the prefix provided in the **Basics** setting.

## Build the consortium

To build the blockchain consortium post deploying the ordering service and peer nodes, you need to carry out the below steps in sequence. **Build Your Network** script (byn.sh), which helps you with setting up the consortium, creating channel, and installing chaincode.

> [!NOTE]
> Build Your Network (byn) script provided is strictly to be used for demo/devtest scenarios. For production grade setup we recommend using the native HLF APIs.

All the commands to run the byn script can be executed through Azure Bash Command Line Interface (CLI). You can login into Azure shell web version through ![Hyperledger Fabric on Azure Kubernetes Service Template](./media/hyperledger-fabric-consortium-azure-kubernetes-service/arrow.png) option at the top-right corner of the Azure portal. On the command prompt, type bash and enter to switch to bash CLI.

See [Azure shell](https://docs.microsoft.com/azure/cloud-shell/overview) for more information.

![Hyperledger Fabric on Azure Kubernetes Service Template](./media/hyperledger-fabric-consortium-azure-kubernetes-service/hyperledger-powershell.png)


Download byn.sh and fabric-admin.yaml file.

```bash-interactive
curl https://raw.githubusercontent.com/Azure/Hyperledger-Fabric-on-Azure-Kubernetes-Service/master/consortiumScripts/byn.sh -o byn.sh; chmod 777 byn.sh
curl https://raw.githubusercontent.com/Azure/Hyperledger-Fabric-on-Azure-Kubernetes-Service/master/consortiumScripts/fabric-admin.yaml -o fabric-admin.yaml
```
**Set below environment variables on Azure CLI Bash shell**:

Set channel information and orderer organization information

```bash
SWITCH_TO_AKS_CLUSTER() { az aks get-credentials --resource-group $1 --name $2 --subscription $3; }
ORDERER_AKS_SUBSCRIPTION=<ordererAKSClusterSubscriptionID>
ORDERER_AKS_RESOURCE_GROUP=<ordererAKSClusterResourceGroup>
ORDERER_AKS_NAME=<ordererAKSClusterName>
ORDERER_DNS_ZONE=
ORDERER_DNS_ZONE=$(az aks show --resource-group $ORDERER_AKS_RESOURCE_GROUP --name $ORDERER_AKS_NAME --subscription $ORDERER_AKS_SUBSCRIPTION -o json | jq .addonProfiles.httpApplicationRouting.config.HTTPApplicationRoutingZoneName | tr -d '"')
ORDERER_END_POINT="orderer1.$ORDERER_DNS_ZONE:443"
CHANNEL_NAME=<channelName>
```
Set peer organization information

```bash
PEER_AKS_RESOURCE_GROUP=<peerAKSClusterResourceGroup>
PEER_AKS_NAME=<peerAKSClusterName>
PEER_AKS_SUBSCRIPTION=<peerAKSClusterSubscriptionID>
#Peer organization name is case-sensitive. Specify exactly the same name, which was provided while creating the Peer AKS Cluster.
PEER_ORG_NAME=<peerOrganizationName>
```

Create one Azure File share to share various public certificates among peer and orderer organizations.

```bash
STORAGE_SUBSCRIPTION=<subscriptionId>
STORAGE_RESOURCE_GROUP=<azureFileShareResourceGroup>
STORAGE_ACCOUNT=<azureStorageAccountName>
STORAGE_LOCATION=<azureStorageAccountLocation>
STORAGE_FILE_SHARE=<azureFileShareName>

az account set --subscription $STORAGE_SUBSCRIPTION
az group create -l $STORAGE_LOCATION -n $STORAGE_RESOURCE_GROUP
az storage account create -n $STORAGE_ACCOUNT -g  $STORAGE_RESOURCE_GROUP -l $STORAGE_LOCATION --sku Standard_LRS
STORAGE_KEY=$(az storage account keys list --resource-group $STORAGE_RESOURCE_GROUP  --account-name $STORAGE_ACCOUNT --query "[0].value" | tr -d '"')
az storage share create  --account-name $STORAGE_ACCOUNT  --account-key $STORAGE_KEY  --name $STORAGE_FILE_SHARE
SAS_TOKEN=$(az storage account generate-sas --account-key $STORAGE_KEY --account-name $STORAGE_ACCOUNT --expiry `date -u -d "1 day" '+%Y-%m-%dT%H:%MZ'` --https-only --permissions lruwd --resource-types sco --services f | tr -d '"')
AZURE_FILE_CONNECTION_STRING="https://$STORAGE_ACCOUNT.file.core.windows.net/$STORAGE_FILE_SHARE?$SAS_TOKEN"
```
**Channel Management Commands**

Go to orderer organization AKS cluster and issue command to create a new channel

```bash
SWITCH_TO_AKS_CLUSTER $ORDERER_AKS_RESOURCE_GROUP $ORDERER_AKS_NAME $ORDERER_AKS_SUBSCRIPTION
./byn.sh createChannel "$CHANNEL_NAME"
```

**Consortium Management Commands**

Execute below commands in the given order to add a peer organization in a channel and consortium.

1. Go to Peer Organization AKS Cluster and upload its Member Service Provide (MSP) on an Azure File Storage.

    ```bash
    SWITCH_TO_AKS_CLUSTER $PEER_AKS_RESOURCE_GROUP $PEER_AKS_NAME $PEER_AKS_SUBSCRIPTION
    ./byn.sh uploadOrgMSP "$AZURE_FILE_CONNECTION_STRING"
    ```

2. Go to orderer Organization AKS cluster and add the peer organization in channel and consortium.

    ```bash
    SWITCH_TO_AKS_CLUSTER $ORDERER_AKS_RESOURCE_GROUP $ORDERER_AKS_NAME $ORDERER_AKS_SUBSCRIPTION
    #add peer in consortium
    ./byn.sh addPeerInConsortium "$PEER_ORG_NAME" "$AZURE_FILE_CONNECTION_STRING"
    #add peer in channel
    ./byn.sh addPeerInChannel "$PEER_ORG_NAME" "$CHANNEL_NAME" "$AZURE_FILE_CONNECTION_STRING"
    ```

3. Go back to peer organization and issue command to join peer nodes in the channel.

    ```bash
    SWITCH_TO_AKS_CLUSTER $PEER_AKS_RESOURCE_GROUP $PEER_AKS_NAME $PEER_AKS_SUBSCRIPTION
    ./byn.sh joinNodesInChannel "$CHANNEL_NAME" "$ORDERER_END_POINT" "$AZURE_FILE_CONNECTION_STRING"
    ```

Similarly, to add more peer organizations in the channel, update peer AKS environment variables as per the required peer organization and execute the steps 1 to 3.

**Chaincode management commands**

Execute the below command to perform chaincode related operation. These commands perform all operations on a demo chaincode. This demo chaincode has two variables "a" and "b". On instantiation of the chaincode, "a" is initialized with 1000 and "b" is initialized with 2000. On each invocation of the chaincode, 10 units are transferred from "a" to "b". Query operation on chaincode shows the world state of "a" variable.

Execute the following commands executed on the peer organization AKS cluster.

```bash
# switch to peer organization AKS cluster. Skip this command if already connected to the required Peer AKS Cluster
SWITCH_TO_AKS_CLUSTER $PEER_AKS_RESOURCE_GROUP $PEER_AKS_NAME $PEER_AKS_SUBSCRIPTION
```
**Chaincode operation commands**

```bash
PEER_NODE_NAME="peer<peer#>"
./byn.sh installDemoChaincode "$PEER_NODE_NAME"
./byn.sh instantiateDemoChaincode "$PEER_NODE_NAME" "$CHANNEL_NAME" "$ORDERER_END_POINT" "$AZURE_FILE_CONNECTION_STRING"
./byn.sh invokeDemoChaincode "$PEER_NODE_NAME" "$CHANNEL_NAME" "$ORDERER_END_POINT" "$AZURE_FILE_CONNECTION_STRING"
./byn.sh queryDemoChaincode "$PEER_NODE_NAME" "$CHANNEL_NAME"
```

## Run native HLF operations

To help customers get started with executing Hyperledger native commands on HLF network on AKS. The sample application is provided that uses fabric NodeJS SDK to perform the HLF operations. The commands are provided to Create new user identity and install your own chaincode.

### Before you begin

Follow the below commands for the initial setup of the application:

- Download application files
- Generate connection profile and admin profile
- Import admin user identity

After completing the initial setup, you can use the SDK to achieve the below operations:

- User identity generation
- Chaincode operations

The above-mentioned commands can be executed from Azure Cloud Shell.

### Download application files

The first setup for running application is to download all the application files in a folder.

**Create app folder and enter into the folder**:

```bash
mkdir app
cd app
```
Execute below command to download all the required files and packages:

```bash-interactive
curl https://raw.githubusercontent.com/Azure/Hyperledger-Fabric-on-Azure-Kubernetes-Service/master/application/setup.sh | bash
```
This command takes time to load all the packages. After successful execution of command, you can see a `node_modules` folder in the current directory. All the required packages are loaded in the `node_modules` folder.

### Generate connection profile and admin profile

Create `profile` directory inside the `app` folder

```bash
cd app
mkdir ./profile
```
Set these environment variables on Azure cloud shell

```bash
# Organization name whose connection profile is to be generated
ORGNAME=<orgname>
# Organization AKS cluster resource group
AKS_RESOURCE_GROUP=<resourceGroup>
```

Execute below command to generate connection profile and admin profile of the organization

```bash
./getConnector.sh $AKS_RESOURCE_GROUP | sed -e "s/{action}/gateway/g"| xargs curl > ./profile/$ORGNAME-ccp.json
./getConnector.sh $AKS_RESOURCE_GROUP | sed -e "s/{action}/admin/g"| xargs curl > ./profile/$ORGNAME-admin.json
```

It will create connection profile and admin `profile` of the organization in the profile folder with name `<orgname>-ccp.json` and `<orgname>-admin.json` respectively.

Similarly, generate connection profile and admin profile for each orderer and peer organization.


### Import admin user identity

The last step is to import organization's admin user identity in the wallet.

```bash
npm run importAdmin -- -o <orgName>

```
The above command executes importAdmin.js to import the admin user identity into the wallet. The script reads admin identity from the admin profile `<orgname>-admin.json` and imports it in wallet for executing HLF operations.

The scripts use file system wallet to store the identities. It creates a wallet as per the path specified in ".wallet" field in the connection profile. By default, ".wallet" field is initialized with `<orgname>`, which means a folder named `<orgname>` is created in the current directory to store the identities. If you want to create wallet at some other path, modify ".wallet" field in the connection profile before running enroll admin user and any other HLF operations.

Similarly, import admin user identity for each organization.

Refer command help for more details on the arguments passed in the command.

```bash
npm run importAdmin -- -h

```

### User identity generation

Execute below commands in the given order to generate new user identities for the HLF organization.

> [!NOTE]
> Before starting with user identity generation steps, ensure that the initial setup of the application is done.

Set below environment variables on azure cloud shell

```bash
# Organization name for which user identity is to be generated
ORGNAME=<orgname>
# Name of new user identity. Identity will be registered with the Fabric-CA using this name.
USER_IDENTITY=<username>

```

Register and enroll new user

To register and enroll new user, execute the below command that executes registerUser.js. It saves the generated user identity in the wallet.

```bash
npm run registerUser -- -o $ORGNAME -u $USER_IDENTITY

```

> [!NOTE]
> Admin user identity is used to issue register command for the new user. Hence, it is mandatory to have the admin user identity in the wallet before executing this command. Otherwise, this command will fail.

Refer command help for more details on the arguments passed in the command

```bash
npm run registerUser -- -h

```

### Chaincode operations


> [!NOTE]
> Before starting with any chaincode operation, ensure that the initial setup of the application is done.

Set below chaincode specific environment variables on Azure Cloud shell:

```bash
# peer organization name where chaincode is to be installed
ORGNAME=<orgName>
USER_IDENTITY="admin.$ORGNAME"
CC_NAME=<chaincodeName>
CC_VERSION=<chaincodeVersion>
# Language in which chaincode is written. Supported languages are 'node', 'golang' and 'java'
# Default value is 'golang'
CC_LANG=<chaincodeLanguage>
# CC_PATH contains the path where your chaincode is place. In case of go chaincode, this path is relative to 'GOPATH'.
# For example, if your chaincode is present at path '/opt/gopath/src/chaincode/chaincode.go'.
# Then, set GOPATH to '/opt/gopath' and CC_PATH to 'chaincode'
CC_PATH=<chaincodePath>
# 'GOPATH' environment variable. This needs to be set in case of go chaincode only.
export GOPATH=<goPath>
# Channel on which chaincode is to be instantiated/invoked/queried
CHANNEL=<channelName>

````

The below chaincode operations can be carried out:

- Install chaincode
- Instantiate chaincode
- Invoke chaincode
- Query chaincode

### Install chaincode

Execute below command to install chaincode on the peer organization.

```bash
npm run installCC -- -o $ORGNAME -u $USER_IDENTITY -n $CC_NAME -p $CC_PATH -l $CC_LANG -v $CC_VERSION

```
It will install chaincode on all the peer nodes of the organization set in `ORGNAME` environment variable. If there are two or more peer organizations in your channel and you want to install chaincode on all of them, execute the commands separately for each peer organization.

Follow the steps:

- Set `ORGNAME` to `<peerOrg1Name>` and issue `installCC` command.
- Set `ORGNAME` to `<peerOrg2Name>` and issue `installCC` command.

  Execute it for each peer organization.

Refer the command help for more details on the arguments passed in the command.

```bash
npm run installCC -- -h

```

### Instantiate chaincode

Execute below command to instantiate chaincode on the peer.

```bash
npm run instantiateCC -- -o $ORGNAME -u $USER_IDENTITY -n $CC_NAME -p $CC_PATH -v $CC_VERSION -l $CC_LANG -c $CHANNEL -f <instantiateFunc> -a <instantiateFuncArgs>

```
Pass instantiation function name and comma separated list of arguments in `<instantiateFunc>` and `<instantiateFuncArgs>` respectively. For example, in [fabrcar chaincode](https://github.com/hyperledger/fabric-samples/blob/release/chaincode/fabcar/fabcar.go), to instantiate the chaincode set `<instantiateFunc>` to `"Init"` and `<instantiateFuncArgs>` to empty string `""`.

> [!NOTE]
> Execute the command for once from any one peer organization in the channel.
> Once the transaction is successfully submitted to the orderer, the orderer distributes this transaction to all the peer organizations in the channel. Hence, the chaincode is instantiated on all the peer nodes on all the peer organizations in the channel.

Refer command help for more details on the arguments passed in the command

```bash
npm run instantiateCC -- -h

```

### Invoke chaincode

Execute the below command to invoke the chaincode function:

```bash
npm run invokeCC -- -o $ORGNAME -u $USER_IDENTITY -n $CC_NAME -c $CHANNEL -f <invokeFunc> -a <invokeFuncArgs>

```
Pass invoke function name and comma separated list of arguments in `<invokeFunction>` and `<invokeFuncArgs>` respectively. Continuing with the fabcar chaincode example, to invoke initLedger function set `<invokeFunction>` to `"initLedger"` and `<invokeFuncArgs>` to `""`.

> [!NOTE]
> Execute the command for once from any one peer organization in the channel.
> Once the transaction is successfully submitted to the orderer, the orderer distributes this transaction to all the peer organizations in the channel. Hence, the world state is updated on all peer nodes of all the peer organizations in the channel.

Refer command help for more details on the arguments passed in the command

```bash
npm run invokeCC -- -h

```

### Query chaincode

Execute below command to query chaincode:

```bash
npm run queryCC -- -o $ORGNAME -u $USER_IDENTITY -n $CC_NAME -c $CHANNEL -f <queryFunction> -a <queryFuncArgs>

```

Pass query function name and comma separated list of arguments in `<queryFunction>` and `<queryFuncArgs>` respectively. Again, taking `fabcar` chaincode as reference, to query all the cars in the world state set `<queryFunction>` to `"queryAllCars"` and `<queryArgs>' to `""`.

Refer command help for more details on the arguments passed in the command

```bash
npm run queryCC -- -h

```
