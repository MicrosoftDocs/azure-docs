---
title: 'Quickstart: Deploy Application Gateway for Containers ALB Controller (preview)'
titlesuffix: Azure Application Load Balancer
description: In this quickstart, you learn how to provision the Application Gateway for Containers ALB Controller in an AKS cluster.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: quickstart
ms.date: 07/12/2023
ms.author: greglin
---

# Quickstart: Deploy Application Gateway for Containers ALB Controller (preview)

[ALB Controller](concepts-how-application-gateway-for-containers-works.md#application-gateway-for-containers-alb-controller) is responsible for translating Gateway API and Ingress API configuration within Kubernetes to load balancing rules within Application Gateway for Containers.  The following guide walks through the steps needed to provision ALB Controller into a new or existing AKS cluster.

## Prerequisites

You need to complete the following tasks prior to deploying Application Gateway for Containers on Azure and installing ALB Controller on your cluster:

> [!IMPORTANT]
> Application Gateway for Containers is currently in PREVIEW.<br>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

1. Prepare your Azure subscription and your `az-cli` client.

	```azurecli-interactive
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

2. Create an AKS cluster for your workload.

	> **Prerequisites**
	> The AKS cluster needs to be in the [regions where Application Gateway for Containers is available](overview.md#supported-regions)
	> AKS cluster should use [Azure CNI](../../aks/configure-azure-cni.md).
        > AKS cluster should have workload identity feature enabled. [Learn how](../../aks/workload-identity-deploy-cluster.md#update-an-existing-aks-cluster) to enable in use an existing AKS cluster section. 

	If using an existing cluster, please ensure you enable Workload Identity support on your AKS cluster.  Workload identities can be enabled via the following:
	
	```azurecli-interactive
 	AKS_NAME='<your cluster name>'
	RESOURCE_GROUP='<your resource group name>'
	az aks update -g $RESOURCE_GROUP -n $AKS_NAME --enable-oidc-issuer --enable-workload-identity --no-wait
	```

	If you don't have an existing cluster, use the following commands to create a new AKS cluster with Azure CNI and workload identity enabled.	
 
	```azurecli-interactive
	AKS_NAME='<your cluster name>'
	RESOURCE_GROUP='<your resource group name>'
	LOCATION='northeurope' # The list of available regions may grow as we roll out to more preview regions
	VM_SIZE='<the size of the vm in AKS>' # The size needs to be available in your location

	az group create --name $RESOURCE_GROUP --location $LOCATION
	az aks create \
		--resource-group $RESOURCE_GROUP \
		--name $AKS_NAME \
		--location $LOCATION \
		--node-vm-size $VM_SIZE \
		--network-plugin azure \
 		--enable-oidc-issuer \
	        --enable-workload-identity \
		--generate-ssh-key
	```

3. Install Helm.

	[Helm](https://github.com/helm/helm) is an open-source packaging tool that is used to install ALB controller. Ensure that you have the latest version of helm installed. Instructions on installation can be found [here](https://github.com/helm/helm#install).

	For linux users, the following command may be run
	```bash
 	curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
	```

## Install ALB Controller

1. Create a user managed identity for ALB controller and federate the identity as Pod Identity to use in the AKS cluster.

    ```azurecli-interactive
	RESOURCE_GROUP='<your resource group name>'
	AKS_NAME='<your aks cluster name>'
	IDENTITY_RESOURCE_NAME='azure-alb-identity'
	
	mcResourceGroup=$(az aks show --resource-group $RESOURCE_GROUP --name $AKS_NAME --query "nodeResourceGroup" -o tsv)
	
	echo "Creating identity $IDENTITY_RESOURCE_NAME in resource group $RESOURCE_GROUP"
	az identity create --resource-group $RESOURCE_GROUP --name $IDENTITY_RESOURCE_NAME
	principalId="$(az identity show -g $RESOURCE_GROUP -n $IDENTITY_RESOURCE_NAME --query principalId -otsv)"

	echo "Waiting 60 seconds to allow for replication of the identity..."
	sleep 60
 
	echo "Apply Reader role to the AKS managed cluster resource group for the newly provisioned identity"
	az role assignment create --assignee-object-id $principalId --resource-group $mcResourceGroup --role "acdd72a7-3385-48ef-bd42-f606fba81ae7" # Reader role
	
	echo "Setup federation with AKS OIDC issuer"
	AKS_OIDC_ISSUER="$(az aks show -n "$AKS_NAME" -g "$RESOURCE_GROUP" --query "oidcIssuerProfile.issuerUrl" -o tsv)"
	az identity federated-credential create --name $IDENTITY_RESOURCE_NAME \
	    --identity-name "azure-alb-identity" \
	    --resource-group $RESOURCE_GROUP \
	    --issuer "$AKS_OIDC_ISSUER" \
	    --subject "system:serviceaccount:azure-alb-system:alb-controller-sa"
    ```

   > [!Note]
   > Assignment of the managed identity immediately after creation may result in an error that the principalId does not exist. Allow about a minute of time to elapse for the identity to replicate in Azure AD prior to delegating the identity.

2. Install ALB Controller using Helm

	ALB Controller can be installed by running the following commands:

	```bash
	az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME
	helm --install alb-controller oci://mcr.microsoft.com/application-lb/charts/alb-controller \
	     --version 0.4.023901 \
	     --set albController.podIdentity.clientID=$(az identity show -g $RESOURCE_GROUP -n azure-alb-identity --query clientId -o tsv)
	```

   	> [!Note]
   	> ALB Controller will automatically be provisioned into a namespace called azure-alb-system. The namespace name may be changed by defining the _--namespace <namespace_name>_ parameter when executing the helm command.  During upgrade, please ensure you specify the --namespace parameter.

### Verify the ALB Controller installation

1. Verify the ALB Controller pods are ready:

    ```bash
    kubectl get pods -n azure-alb-system
    ```
    You should see the following:
   
    | NAME                                     | READY | STATUS  | RESTARTS | AGE  |
    | ---------------------------------------- | ----- | ------- | -------- | ---- |
    | alb-controller-bootstrap-6648c5d5c-hrmpc | 1/1   | Running | 0        | 4d6h |
    | alb-controller-6648c5d5c-au234           | 1/1   | Running | 0        | 4d6h |

2. Verify GatewayClass `azure-application-lb` is installed on your cluster:

    ```bash
    kubectl get gatewayclass azure-alb-external -o yaml
    ```
    You should see that the GatewayClass has a condition that reads **Valid GatewayClass** . This indicates that a default GatewayClass has been set up and that any gateway resources that reference this GatewayClass is managed by ALB Controller automatically.

## Next Steps - Link your ALB controller to Application Gateway for Containers

Now that you have successfully installed an ALB Controller on your cluster you can provision the Application Gateway For Containers resources in Azure.

There are two deployment strategies for management of Application Gateway for Containers:

- **Bring your own (BYO) deployment:** In this deployment strategy, deployment and lifecycle of the Application Gateway for Containers resource, Association and Frontend resource is assumed via Azure portal, CLI, PowerShell, Terraform, etc. and referenced in configuration within Kubernetes.
   - Quickstart guide for bring your own (BYO) strategy can [be found here](quickstart-create-application-gateway-for-containers-byo-deployment.md)
- **Managed by ALB controller:** In this deployment strategy ALB Controller deployed in Kubernetes is responsible for the lifecycle of the Application Gateway for Containers resource and its sub resources. ALB Controller creates an Application Gateway for Containers resource when an ApplicationLoadBalancer custom resource is defined on the cluster and its lifecycle is based on the lifecycle of the custom resource.
  - Quickstart guide for managed by ALB controller strategy can [be found here](quickstart-create-application-gateway-for-containers-managed-by-alb-controller.md)

## Uninstall Application Gateway for Containers and ALB Controller

If you wish to uninstall the ALB Controller, you may complete the following steps.

1. To delete the Application Gateway for Containers, you can delete the Resource Group containing the Application Gateway for Containers resources:

	```azurecli-interactive
	az group delete --resource-group $RESOURCE_GROUP
	```

2. To uninstall ALB Controller and its resources from your cluster run the following commands:

	```bash
	 helm uninstall alb-controller -n azure-alb-system
	 kubectl delete ns azure-alb-system
	 kubectl delete gatewayclass azure-alb-external
	```
