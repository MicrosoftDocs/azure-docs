---

title: 'Quickstart: Create Application Gateway for Containers - Referenced deployment'
titlesuffix: Azure Application Load Balancer
description: In this quickstart, you learn how to provision Application Gateway for Containers in a referenced configuration.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: quickstart
ms.date: 7/7/2023
ms.author: greglin
---

# Quickstart: Create an Application Gateway for Containers - Referenced deployment

This document provides instructions on how to deploy the 3 types of resources (Application Gateway for Containers, Association, and Frontend) needed for Application Gateway for Containers to work with your AKS workload, and how to install ALB Controller on your AKS cluster to control the behavior of the Application Gateway for Containers.

The guide assumes you are following a "Referenced" deployment strategy, which assumes lifecycle of the Azure resources are managed indepenently from the resources defined within Kubernetes and referenced at time of Gateway or Ingress configuration.

In this deployment strategy, deployment and lifecycle of the Application Gateway for Containers resource, Association and Frontend resource is assumed via Azure Portal, CLI, PowerShell, Terraform, etc. and referenced in configuration within Kubernetes.
- In Gateway API: Every time you wish to create a new Gateway object in Kuberenetes, a Frontend resource should be provisioned in Azure prior and referenced by the Gateway object. Deletion of the Frontend resource is responsible by the Azure administrator and will not be deleted when the Gateway object in Kubernetes is deleted.

## Prerequisites

You need to complete the following tasks prior to deploying Application Gateway for Containers on Azure and installing ALB Controller on your cluster:

1. Prepare your Azure subscription and your `az-cli` client.

	```bash
	# Login to your Azure subscription.
	SUBSCRIPTION_ID='<your subscription id>'
	az login
	az account set --subscription $SUBSCRIPTION_ID

	# Register required resource providers on Azure.
	az provider register --namespace Microsoft.ContainerService
	az provider register --namespace Microsoft.Network
	az provider register --namespace Microsoft.NetworkFunction
	az provider register --namespace Microsoft.ServiceNetworking

	# Install Azure CLI extensions.
        az extension add --name alb
	```

1. **(Optional)** Create an AKS cluster for your workload.

	If you have an existing AKS cluster for running your workload in one of the regions where Application Gateway for Containers is available for preview, you may skip ahead to the next step.

	> **Note**
	>
	> The AKS cluster needs to be in the following regions where Application Gateway for Containers is available for Private Preview.
	>
	> - North Central US
	> - North Europe
	>
	> AKS cluster should use [Azure CNI](../aks/configure-azure-cni.md).
        > AKS cluster should have workload identity feature enabled. [Learn how](../aks/workload-identity-deploy-cluster.md#update-an-existing-aks-cluster) to enable in use an existing AKS cluster section. 

	```bash
	AKS_NAME='<your cluster name>'
	RESOURCE_GROUP='<the resource group of your AKS cluster>'
	LOCATION='northeurope' # The list of available regions may grow as we roll out to more preview regions
	VM_SIZE='<the size of the vm in AKS>' # The size needs to be available in your location

	az group create --name $RESOURCE_GROUP --location $LOCATION
	az aks create \
		--resource-group $RESOURCE_GROUP \
		--name $AKS_NAME \
		--location $LOCATION \
		--node-vm-size $VM_SIZE \
		--network-plugin azure \
		--generate-ssh-key
	```

2. Delegate a Subnet in the AKS Virtual Network to the Application Gateway for Containers Service.

	Once you have an AKS cluster, identify the virtual network to which the agent pool is connected using the following commands:

	```bash
	AKS_NAME='<your cluster name>'
	RESOURCE_GROUP='<your resource group>'

	mcResourceGroup=$(az aks show --name $AKS_NAME --resource-group $RESOURCE_GROUP --query "nodeResourceGroup" -o tsv)
	clusterSubnetId=$(az vmss list --resource-group $mcResourceGroup --query '[0].virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].subnet.id' -o tsv)
	read -d '' vnetName vnetResourceGroup vnetId <<< $(az network vnet show --ids $clusterSubnetId --query '[name, resourceGroup, id]' -o tsv)
	echo $vnetId
	```

	Once the Virtual Network has been identified, create a new subnet with at least 120 available addresses and delegate it to the Application Gateway for Containers service with the following command (note, the minimum size a subnet should be for an Association should be /24):

	```bash
	subnetAddressPrefix='<an address space under the vnet that has at least 120 available addresses (/24 or smaller cidr prefix for the subnet)>'
	albSubnetName='alb-subnet' # subnet name can be any non-reserved subnet name (i.e. GatewaySubnet, AzureFirewallSubnet, AzureBastionSubnet would all be invalid)
	az network vnet subnet create \
		--resource-group $vnetResourceGroup \
		--vnet-name $vnetName \
		--name $albSubnetName \
		--delegations 'Microsoft.ServiceNetworking/trafficControllers' \
		--address-prefixes $subnetAddressPrefix
	```

3. Enable Workload Identity on your AKS cluster.

    ```bash
    az aks update -g $RESOURCE_GROUP -n $AKS_NAME --enable-oidc-issuer --enable-workload-identity --no-wait
    ```

4. Install Helm.

	[Helm](https://github.com/helm/helm) is an open-source packaging tool that is used to install ALB controller. Ensure that you have the latest version of helm installed. Instructions on installation can be found [here](https://github.com/helm/helm#install).

## Deploy Application Gateway for Containers

1. The following commands deploy Application Gateway for Containers (along with the Association and Frontend resources) using an [ARM template](./templates/traffic-controller.template.json).

	```bash
	ALB_NAME='test-alb'
	FRONTEND_NAME='frontend'

	albSubnetId=$(az network vnet subnet show --resource-group $vnetResourceGroup --vnet-name $vnetName --name $albSubnetName --query id -o tsv)
	az deployment group create \
		--resource-group $RESOURCE_GROUP \
		--name 'sample-agfc-deployment' \
		--template-uri 'https://trafficcontrollerdocs.blob.core.windows.net/templates/traffic-controller.template.json' \
		--parameters "trafficControllerName=$ALB_NAME" \
		--parameters "frontendName=$FRONTEND_NAME" \
		--parameters "subnetId=$albSubnetId" \
		--parameters "mcResourceGroup=$mcResourceGroup"
	```

2. Once the deployment is successful, you may verify the creation of the Application Gateway for Containers resources with the following commands:

	```bash
	# Verify the Application Gateway for Containers
	az resource show --ids $(az resource list --resource-type 'Microsoft.ServiceNetworking/trafficControllers' --resource-group $RESOURCE_GROUP --query '[].id' -o tsv)

	# Verify the Application Gateway for Containers Association
	az resource show --ids $(az resource list --resource-type 'Microsoft.ServiceNetworking/trafficControllers/associations' --resource-group $RESOURCE_GROUP --query '[].id' -o tsv)

	# Verify the Application Gateway for Containers Frontend
	az resource show --ids $(az resource list --resource-type 'Microsoft.ServiceNetworking/trafficControllers/frontends' --resource-group $RESOURCE_GROUP --query '[].id' -o tsv)
	```

## Install ALB Controller

1. Prerequisites - Federate user assigned identity as Pod Identity to use in AKS cluster.

    ```bash
	AKS_OIDC_ISSUER="$(az aks show -n "$AKS_NAME" -g "$RESOURCE_GROUP" --query "oidcIssuerProfile.issuerUrl" -o tsv)"
    az identity federated-credential create --name "azure-alb-identity" \
	    --identity-name "azure-alb-identity" \
		--resource-group $RESOURCE_GROUP \
		--issuer "$AKS_OIDC_ISSUER" \
		--subject "system:serviceaccount:azure-alb-system:alb-controller-sa"
    ```

1. Install ALB Controller

	LB Controller can be installed by running the following commands:

	```bash
	az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME
	helm upgrade \
		--install alb-controller oci://mcr.microsoft.com/application-lb/charts/alb-controller \
		--create-namespace --namespace azure-alb-system \
		--version '0.2.023621' \
		--set albController.podIdentity.clientID=$(az identity show -g $RESOURCE_GROUP -n azure-alb-identity --query clientId -o tsv)
	```

### Verify the ALB Controller installation

1. Verify the ALB Controller pods are ready:

    ```bash
    kubectl get pods -n azure-alb-system
    ```
    You should see the following:
    | NAME                                     | READY | STATUS  | RESTARTS | AGE
    | alb-controller-bootstrap-6648c5d5c-hrmpc | 1/1   | Running | 0        | 4d6h
    | alb-controller-6648c5d5c-au234           | 1/1   | Running | 0        | 4d6h

2. Verify GatewayClass `azure-application-lb` is installed on your cluster:

    ```bash
    kubectl get gatewayclass azure-alb-external -o yaml
    ```
    You should see that the GatewayClass has a condition that reads **Valid GatewayClass** . This indicates that a default GatewayClass has been set up and that any gateway objects that reference this GatewayClass is managed by ALB Controller automatically.

## Link your ALB Controller to Application Gateway for Containers

Now that you have successfully installed a ALB Controller on your cluster you can link it to an existing Application Gateway For Containers resource by defining a gateway object. You can specify the Application Gateway For Containers resource you wish for the gateway to connect to by adding the Frontend resource ID in the spec.Address section of the gateway object.

## Test it out!

Congratulations, you have installed ALB Controller on your cluster!

## Uninstall Application Gateway for Containers and ALB Controller

1. To delete the Application Gateway for Containers, you may simply delete the Resource Group containing the Application Gateway for Containers resources:

	```bash
	az group delete --resource-group $RESOURCE_GROUP
	```

2. To uninstall ALB Controller and its resources from your cluster run the following commands:

	```bash
	 helm uninstall alb-controller -n azure-alb-system
	 kubectl delete ns azure-alb-system
	 kubectl delete gatewayclass azure-alb-external
	```
