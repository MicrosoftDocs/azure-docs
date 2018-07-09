---
title: Deploy to Azure Kubernetes Service (AKS) using Jenkins and blue/green deployment strategy
description: Learn how to deploy to Azure Kubernetes Service (AKS) using Jenkins and blue/green deployment strategy
services: app-service\web
documentationcenter: ''
author: tomarcher
manager: jpconnock
editor: ''
ms.assetid: 
ms.service: multiple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 07/09/2018
ms.author: tarcher
ms.custom: Jenkins
---

# Deploy to Azure Kubernetes Service (AKS) using Jenkins and blue/green deployment strategy

This document shows you how to deploy the todo app java project to AKS using Jenkins and blue/green deployment strategy. 

## Fork the todo-app-java-on-azure repo

1. Use git to download a copy of the application to your development environment.

    ```bash
    git clone https://github.com/microsoft/todo-app-java-on-azure.git
    ```

2. Change directories so that you are working from the cloned directory. 

## Create Azure services

You can create the Azure Services using [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). For AKS, make sure Azure CLI is version 2.0.25 or later.

AKS is still in preview at the time when these instructions are created. For information on enabling the preview for your Azure subscription. refer to [this](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough#enabling-aks-preview-for-your-azure-subscription) for more details.

### Create AKS

1. Log in to your Azure CLI, and set your subscription ID 
    
    ```bash
    az login
    az account set -s <your-subscription-id>
    ```

1. Create a resource group. While AKS is in preview, only some location options are available. 

    ```bash
    az group create -n <your-resource-group-name> -l <your-location>
    ```

1. Create AKS

    ```bash
    az aks create -g <your-resource-group-name> -n <your-kubernetes-cluster-name> --node-count 2
    ```

1. Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) and [jq](https://stedolan.github.io/jq/download/), a lightweight command-line JSON processor.

### Setting up AKS

Setting up a blue/green deployment in AKS requires the following setup: 

#### Run the setup script
1. Edit [setup script](/../deploy/aks/setup/setup.sh) and update `<your-resource-group-name>`, `<your-kubernetes-cluster-name>`,
   `<your-location>` and `<your-dns-name-suffix>` respectively:

    ``` bash   
    resource_group=<your-resource-group-name>
    location=<your-location>
    aks_name=<your-kubernetes-cluster-name>
    dns_name_suffix=<your-dns-name-suffix>
    ```

2. Run the script. 

#### Set up manually 
1. Download the Kubernetes configuration to your profile folder.

    ```bash
    az aks get-credentials -g <your-resource-group-name> -n <your-kubernetes-cluster-name> --admin
    ```

2. Change directory to /deploy/aks/setup. Run the following kubectl commands to set up the services for
    the public end point and the two test end points:

    ```
    kubectl apply -f  service-green.yml
    kubectl apply -f  test-endpoint-blue.yml
    kubectl apply -f  test-endpoint-green.yml
    ```

3. Update the public and test end points DNS names. When AKS is created, an [additional resource group](https://github.com/Azure/AKS/issues/3)
    is created. Look for resource group: `MC_<your-resource-group-name>_<your-kubernetes-cluster-name>_<your-location>`.

    Locate the public ip's in the resource group

    ![Public IP](images/publicip.png)

    For each of the services, find the external IP address by running:
    
    ```
    kubectl get service todoapp-service
    ```
    
    Update the DNS name for the corresponding IP address:

    ```
    az network public-ip update --dns-name aks-todoapp --ids /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MC_<resourcegroup>_<aks>_<location>/providers/Microsoft.Network/publicIPAddresses/kubernetes-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    ```

    Repeat for `todoapp-test-blue` and `todoapp-test-green`:
    ```
    az network public-ip update --dns-name todoapp-blue --ids /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MC_<resourcegroup>_<aks>_<location>/providers/Microsoft.Network/publicIPAddresses/kubernetes-BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB

    az network public-ip update --dns-name todoapp-green --ids /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MC_<resourcegroup>_<aks>_<location>/providers/Microsoft.Network/publicIPAddresses/kubernetes-CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
    ```
    Note that the dns name needs to be unique in your subscription. `<your-dns-name-suffix>` can be used to ensure the uniqueness.


### Create Azure Container Registry

1. Run below command to create an Azure Container Registry.
    After creation, use `login server` as Docker registry URL in the next section.

    ```bash
    az acr create -n <your-registry-name> -g <your-resource-group-name>
    ```

1. Run below command to show your Azure Container Registry credentials.
    You will use Docker registry username and password in the next section.

    ```bash
    az acr credential show -n <your-registry-name>
    ```

## Prepare Jenkins server
1. Deploy a Jenkins Master on Azure [https://aka.ms/jenkins-on-azure]

1. Connect to the server with SSH and install the build tools on the server where you will run your build:
   
   ```
   sudo apt-get install git maven 
   ```
   
   Install Docker by following the steps [here](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce).
   Make sure the user `jenkins` has permission to run the `docker` commands.

1. Install additional tools needed for this example:

   * [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) 
   * [jq](https://stedolan.github.io/jq/download/)

   ```
   sudo apt-get install jq
   ```
   
1. Install the plugins in Jenkins. Click 'Manage Jenkins' -> 'Manage Plugins' -> 'Available', 
    then search and install the following plugins: Azure Container Service Plugin.

1. Add dd a Credential in type "Microsoft Azure Service Principal" with your service principal.

1. Add a Credential in type "Username with password" with your account of docker registry.

## Edit the Jenkinsfile

1. In your own repo, navigate to /deploy/aks/ and open `Jenkinsfile`

2. Update:

    ```groovy
    def servicePrincipalId = '<your-service-principal>'
    def resourceGroup = '<your-resource-group-name>'
    def aks = '<your-kubernetes-cluster-name>'

    def cosmosResourceGroup = '<your-cosmodb-resource-group>'
    def cosmosDbName = '<your-cosmodb-name>'
    def dbName = '<your-dbname>'

    def dockerRegistry = '<your-acr-name>.azurecr.io'
    ```
    
    And update ACR credential ID:
    
    ```
    def dockerCredentialId = '<your-acr-credential-id>'
    ```

## Create job
1. Add a new job in type "Pipeline".

1. Choose "Pipeline script from SCM" in "Pipeline" -> "Definition".

1. Fill in the SCM repo url `your forked repo` and script path `deploy/aks/Jenkinsfile`


## Run it
1. Verify you can run your project successfully in your local environment. ([Run project on local machine](../../README.md))

1. Run jenkins job. If you run this for the first time, Jenkins will deploy the todo app to the Blue environment which is the default inactive environment. 

1. To verify, open the urls:
    - Public end point: `http://aks-todoapp<your-dns-name-suffix>.<your-location>.cloudapp.azure.com`
    - Blue end point - `http://aks-todoapp-blue<your-dns-name-suffix>.<your-location>.cloudapp.azure.com`
    - Green end point - `http://aks-todoapp-green<your-dns-name-suffix>.<your-location>.cloudapp.azure.com`

The public and the Blue test end points have the same update while the Green end point shows the default tomcat image. 

If you run the build more than once, it will cycle through Blue and Green deployments. In other words, if the current environment is Blue, the job will deploy/test the Green environment and then update the application public endpoint to route traffic to the Green environment if all is good with testing.

## Additional information

For more on zero-downtime deployment, check out this [quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/301-jenkins-aks-zero-downtime-deployment). 

## Clean up

Delete the Azure resources you just created by running below command:

```bash
az group delete -y --no-wait -n <your-resource-group-name>
```

## Next steps
