
---
title: Create an Azure Compute Gallery for sharing resources
description: Learn how to create an Azure Compute Gallery.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 06/22/2022
ms.author: saraic
ms.reviewer: cynthn
ms.custom: template-how-to, devx-track-azurecli 
ms.devlang: azurecli

---

# Quickstart: Deploy a Scalable & Secure Azure Kubernetes Service cluster using the Azure CLI
Welcome to this tutorial where we will take you step by step in creating an Azure Kubernetes Web Application with a custom domain that is secured via https. This tutorial assumes you are logged into Azure CLI already and have selected a subscription to use with the CLI. It also assumes that you have Helm installed (Instructions can be found here https://helm.sh/docs/intro/install/). If you have not done this already. Press b and hit ctl c to exit the program.

To Login to Az CLI and select a subscription 
'az login' followed by 'az account list --output table' and 'az account set --subscription "name of subscription to use"'

To Install Az CLI
If you need to install Azure CLI run the following command - curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash


Assuming the pre requisites are met press enter to proceed

## Define Command Line Variables 
Most of these variables should be set to a smart default. However, if you want to change them
press b and run the command export VARIABLE_NAME="new variable value"

```
echo $RESOURCE_GROUP_NAME
echo $RESOURCE_LOCATION
echo $AKS_CLUSTER_NAME
echo $PUBLIC_IP_NAME
echo $VNET_NAME
echo $SUBNET_NAME
echo $APPLICATION_GATEWAY_NAME
```

For the following variables, unless you manually added them in the env.json, you will be asked to provide an input

The custom domain must be unique and fit the pattern: ^[a-z][a-z0-9-]{1,61}[a-z0-9]$
For example mycooldomain - this domain is already taken btw :) 

Note - Do not add any capitalization or .com
```
if [[ ! $CUSTOM_DOMAIN_NAME =~ ^[a-z][a-z0-9-]{1,61}[a-z0-9] ]]; then echo "Invalid Domain, re enter your domain by pressing b and running 'export CUSTOM_DOMAIN_NAME="customdomainname"' then press r to re-run the previous command and validate the custom domain"; else echo "Custom Domain Set!"; fi; 
```

For the email address any enter a valid email. I.e sarajane@gmail.com
```
echo $SSL_EMAIL_ADDRESS
```

## Create A Resource Group
An Azure resource group is a logical group in which Azure resources are deployed and managed. When you create a resource group, you are prompted to specify a location. This location is:
  - The storage location of your resource group metadata.
  - Where your resources will run in Azure if you don't specify another region during resource creation.

Validate Resource Group does not already exist. If it does, select a new resource group name by running the following:

```
if [ "$(az group exists --name $RESOURCE_GROUP_NAME)" = 'true' ]; then export RAND=$RANDOM; export RESOURCE_GROUP_NAME="$RESOURCE_GROUP_NAME$RAND"; echo "Your new Resource Group Name is $RESOURCE_GROUP_NAME"; fi
```

Create a resource group using the az group create command:
```
az group create --name $RESOURCE_GROUP_NAME --location $RESOURCE_LOCATION
```
Results:

```expected_similarity=0.5
{
  "id": "/subscriptions/bb318642-28fd-482d-8d07-79182df07999/resourceGroups/testResourceGroup24763",
  "location": "eastus",
  "managedBy": null,
  "name": "testResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

## Create AKS Cluster 
Create an AKS cluster using the az aks create command with the --enable-addons monitoring parameter to enable Container insights. The following example creates a cluster named myAKSCluster with one node:

This will take a few minutes
```
az aks create --resource-group $RESOURCE_GROUP_NAME --name $AKS_CLUSTER_NAME --node-count 1 --enable-addons monitoring --generate-ssh-keys
```

## Connect to the cluster
To manage a Kubernetes cluster, use the Kubernetes command-line client, kubectl. kubectl is already installed if you use Azure Cloud Shell.

1. Install az aks CLI locally using the az aks install-cli command

```
if ! [ -x "$(command -v kubectl)" ]; then az aks install-cli; fi
```

2. Configure kubectl to connect to your Kubernetes cluster using the az aks get-credentials command. The following command:
    - Downloads credentials and configures the Kubernetes CLI to use them.
    - Uses ~/.kube/config, the default location for the Kubernetes configuration file. Specify a different location for your Kubernetes configuration file using --file argument. 

> [!WARNING]
> This will overwrite any existing credentials with the same entry

```
az aks get-credentials --resource-group $RESOURCE_GROUP_NAME --name $AKS_CLUSTER_NAME --overwrite-existing
```

3. Verify the connection to your cluster using the kubectl get command. This command returns a list of the cluster nodes.

```
kubectl get nodes
```

## Deploy the Application 
A Kubernetes manifest file defines a cluster's desired state, such as which container images to run.

In this quickstart, you will use a manifest to create all objects needed to run the Azure Vote application. This manifest includes two Kubernetes deployments:

- The sample Azure Vote Python applications.
- A Redis instance.

Two Kubernetes Services are also created:

- An internal service for the Redis instance.
- An external service to access the Azure Vote application from the internet.

A test voting app YML file is already prepared. To deploy this app run the following command 
```
kubectl apply -f azure-vote-start.yml
```

## Test The Application
When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

Check progress using the kubectl get service command.

```
kubectl get service
```

Store the public IP Address as an environment variable for later use.
>[!Note]
> This commmand loops for 2 minutes and queries the output of kubectl get service for the IP Address. Sometimes it can take a few seconds to propogate correctly 
```
runtime="2 minute"; endtime=$(date -ud "$runtime" +%s); while [[ $(date -u +%s) -le $endtime ]]; do export IP_ADDRESS=$(kubectl get service azure-vote-front --output jsonpath='{.status.loadBalancer.ingress[0].ip}'); if ! [ -z $IP_ADDRESS ]; then break; else sleep 10; fi; done
```

Validate IP Address by running the following:
```
echo $IP_ADDRESS
```

# Add Application Gateway Ingress Controller
The Application Gateway Ingress Controller (AGIC) is a Kubernetes application, which makes it possible for Azure Kubernetes Service (AKS) customers to leverage Azure's native Application Gateway L7 load-balancer to expose cloud software to the Internet. AGIC monitors the Kubernetes cluster it is hosted on and continuously updates an Application Gateway, so that selected services are exposed to the Internet

AGIC helps eliminate the need to have another load balancer/public IP in front of the AKS cluster and avoids multiple hops in your datapath before requests reach the AKS cluster. Application Gateway talks to pods using their private IP directly and does not require NodePort or KubeProxy services. This also brings better performance to your deployments.

## Deploy a new Application Gateway 
1. Create a Public IP for Application Gateway by running the following:
```
az network public-ip create --name $PUBLIC_IP_NAME --resource-group $RESOURCE_GROUP_NAME --allocation-method Static --sku Standard
```

2. Create a Virtual Network(Vnet) for Application Gateway by running the following:
```
az network vnet create --name $VNET_NAME --resource-group $RESOURCE_GROUP_NAME --address-prefix 11.0.0.0/8 --subnet-name $SUBNET_NAME --subnet-prefix 11.1.0.0/16 
```

3. Create Application Gateway by running the following:

> [!NOTE] 
> This will take around 5 minutes 
```
az network application-gateway create --name $APPLICATION_GATEWAY_NAME --location $RESOURCE_LOCATION --resource-group $RESOURCE_GROUP_NAME --sku Standard_v2 --public-ip-address $PUBLIC_IP_NAME --vnet-name $VNET_NAME --subnet $SUBNET_NAME
```

## Enable the AGIC add-on in existing AKS cluster 

1. Store Application Gateway ID by running the following:
```
APPLICATION_GATEWAY_ID=$(az network application-gateway show --name $APPLICATION_GATEWAY_NAME --resource-group $RESOURCE_GROUP_NAME --output tsv --query "id") 
```

2. Enable Application Gateway Ingress Addon by running the following:

> [!NOTE]
> This will take a few minutes
```
az aks enable-addons --name $AKS_CLUSTER_NAME --resource-group $RESOURCE_GROUP_NAME --addon ingress-appgw --appgw-id $APPLICATION_GATEWAY_ID
```

3. Store the node resource as an environment variable group by running the following:
```
NODE_RESOURCE_GROUP=$(az aks show --name myAKSCluster --resource-group $RESOURCE_GROUP_NAME --output tsv --query "nodeResourceGroup")
```
4. Store the Vnet name as an environment variable by running the following:
```
AKS_VNET_NAME=$(az network vnet list --resource-group $NODE_RESOURCE_GROUP --output tsv --query "[0].name")
```

5. Store the Vnet ID as an environment variable by running the following:
```
AKS_VNET_ID=$(az network vnet show --name $AKS_VNET_NAME --resource-group $NODE_RESOURCE_GROUP --output tsv --query "id")
```
## Peer the two virtual networks together 
Since we deployed the AKS cluster in its own virtual network and the Application Gateway in another virtual network, you'll need to peer the two virtual networks together in order for traffic to flow from the Application Gateway to the pods in the cluster. Peering the two virtual networks requires running the Azure CLI command two separate times, to ensure that the connection is bi-directional. The first command will create a peering connection from the Application Gateway virtual network to the AKS virtual network; the second command will create a peering connection in the other direction.

1. Create the peering from Application Gateway to AKS by runnig the following:
```
az network vnet peering create --name $APPGW_TO_AKS_PEERING_NAME --resource-group $RESOURCE_GROUP_NAME --vnet-name $VNET_NAME --remote-vnet $AKS_VNET_ID --allow-vnet-access 
```

2. Store Id of Application Gateway Vnet As enviornment variable by running the following:
```
APPLICATION_GATEWAY_VNET_ID=$(az network vnet show --name $VNET_NAME --resource-group $RESOURCE_GROUP_NAME --output tsv --query "id")
```
3. Create Vnet Peering from AKS to Application Gateway
```
az network vnet peering create --name $AKS_TO_APPGW_PEERING_NAME --resource-group $NODE_RESOURCE_GROUP --vnet-name $AKS_VNET_NAME --remote-vnet $APPLICATION_GATEWAY_VNET_ID --allow-vnet-access
```
4. Store New IP address as environment variable by running the following command:
```
runtime="2 minute"; endtime=$(date -ud "$runtime" +%s); while [[ $(date -u +%s) -le $endtime ]]; do export IP_ADDRESS=$(az network public-ip show --resource-group $RESOURCE_GROUP_NAME --name $PUBLIC_IP_NAME --query ipAddress --output tsv); if ! [ -z $IP_ADDRESS ]; then break; else sleep 10; fi; done
```

## Apply updated application YAML complete with AGIC
In order to use the Application Gateway Ingress Controller we deployed we need to re-deploy an update Voting App YML file. The following command will update the application:

The full updated YML file can be viewed at `azure-vote-agic-yml`
```
kubectl apply -f azure-vote-agic.yml
```

## Check that the application is reachable
Now that the Application Gateway is set up to serve traffic to the AKS cluster, let's verify that your application is reachable. 

Check that the sample application you created is up and running by either visiting the IP address of the Application Gateway that get from running the following command or check with curl. It may take Application Gateway a minute to get the update, so if the Application Gateway is still in an "Updating" state on Portal, then let it finish before trying to reach the IP address. Run the following to check the status:
```
kubectl get ingress
```

## Add custom subdomain to AGIC
Now Application Gateway Ingress has been added to the application gateway the next step is to add a custom domain. This will allow the endpoint to be reached by a human readable URL as well as allow for SSL Termination at the endpoint.

1. Store Unique ID of the Public IP Address as an environment variable by running the following:
```
export PUBLIC_IP_ID=$(az network public-ip list --query "[?ipAddress!=null]|[?contains(ipAddress, '$IP_ADDRESS')].[id]" --output tsv)
```

2. Update public IP to respond to custom domain requests by running the following:
```
az network public-ip update --ids $PUBLIC_IP_ID --dns-name $CUSTOM_DOMAIN_NAME
```

3. Validate the resource is reachable via the custom domain.
```
az network public-ip show --ids $PUBLIC_IP_ID --query "[dnsSettings.fqdn]" --output tsv
```

4. Store the custom domain as en enviornment variable. This will be used later when setting up https termination.
```
export FQDN=$(az network public-ip show --ids $PUBLIC_IP_ID --query "[dnsSettings.fqdn]" --output tsv)
```

# Add HTTPS termination to custom domain 
At this point in the tutorial you have an AKS web app with Application Gateway as the Ingress controller and a custom domain you can use to access your application. The next step is to add an SSL certificate to the domain so that users can reach your application securely via https.  

## Set Up Cert Manager
In order to add HTTPS we are going to use Cert Manager. Cert Manager is an open source tool used to obtain and manage SSL certificate for Kubernetes deployments. Cert Manager will obtain certificates from a variety of Issuers, both popular public Issuers as well as private Issuers, and ensure the certificates are valid and up-to-date, and will attempt to renew certificates at a configured time before expiry.

1. In order to install cert-manager, we must first create a namespace to run it in. This tutorial will install cert-manager into the cert-manager namespace. It is possible to run cert-manager in a different namespace, although you will need to make modifications to the deployment manifests.
```
kubectl create namespace cert-manager
```

2. We can now install cert-manager. All resources are included in a single YAML manifest file. This can be installed by running the following:
```
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.7.0/cert-manager.crds.yaml
```


3. Add the certmanager.k8s.io/disable-validation: "true" label to the cert-manager namespace by running the following. This will allow the system resources that cert-manager requires to bootstrap TLS to be created in its own namespace.
```
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true
```

## Obtain certificate via Helm Charts
Helm is a Kubernetes deployment tool for automating creation, packaging, configuration, and deployment of applications and services to Kubernetes clusters.

Cert-manager provides Helm charts as a first-class method of installation on Kubernetes.

1. Add the Jetstack Helm repository
This repository is the only supported source of cert-manager charts. There are some other mirrors and copies across the internet, but those are entirely unofficial and could present a security risk.
```
helm repo add jetstack https://charts.jetstack.io
```

2. Update local Helm Chart repository cache 
```
helm repo update
```

3. Install Cert-Manager addon via helm by running the following:
```
helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v1.7.0
```

4. Apply Certificate Issuer YAML File

    ClusterIssuers are Kubernetes resources that represent certificate authorities (CAs) that are able to generate signed certificates by honoring certificate signing requests. All cert-manager certificates require a referenced issuer that is in a ready condition to attempt to honor the request.

    The issuer we are using can be found in the `cluster-issuer-prod.yaml file`
```
envsubst < cluster-issuer-prod.yaml | kubectl apply -f -
```

5. Upate Voting App Application to use Cert-Manager to obtain an SSL Certificate. 

    The full YAML file can be found in `azure-vote-agic-ssl-yml`
```
envsubst < azure-vote-agic-ssl.yml | kubectl apply -f -
```
## Validate application is working

Wait for SSL certificate to issue. The following command will query the status of the SSL certificate for 3 minutes.
 In rare occasions it may take up to 15 minutes for Lets Encrypt to issue a successful challenge and the ready state to be 'True'
```
runtime="10 minute"; endtime=$(date -ud "$runtime" +%s); while [[ $(date -u +%s) -le $endtime ]]; do STATUS=$(kubectl get certificate --output jsonpath={..status.conditions[0].status}); echo $STATUS; if [ "$STATUS" = 'True' ]; then break; else sleep 10; fi; done
```

Validate SSL certificate is True by running the follow command:
```
kubectl get certificate --output jsonpath={..status.conditions[0].status}
```

Results:

```expected_similarity=0.8
True
```

## Browse your AKS Deployment Secured via HTTPS!
Run the following command to get the HTTPS endpoint for your application:

>[!Note]
> It often takes 2-3 minutes for the SSL certificate to propogate and the site to be reachable via https 
```
echo https://$FQDN
```
Paste this into the browser to validate your deployment.