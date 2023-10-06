---
title: 'Quickstart: Deploy Application Gateway for Containers ALB Controller (preview)'
titlesuffix: Azure Application Load Balancer
description: In this quickstart, you learn how to provision the Application Gateway for Containers ALB Controller in an AKS cluster.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.custom: devx-track-azurecli
ms.topic: quickstart
ms.date: 09/25/2023
ms.author: greglin
---

# Quickstart: Deploy Application Gateway for Containers ALB Controller (preview)

The [ALB Controller](application-gateway-for-containers-components.md#application-gateway-for-containers-alb-controller) is responsible for translating Gateway API and Ingress API configuration within Kubernetes to load balancing rules within Application Gateway for Containers.  The following guide walks through the steps needed to provision an ALB Controller into a new or existing AKS cluster.

## Prerequisites

You need to complete the following tasks prior to deploying Application Gateway for Containers on Azure and installing ALB Controller on your cluster:

> [!IMPORTANT]
> Application Gateway for Containers is currently in PREVIEW.<br>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

1. Prepare your Azure subscription and your `az-cli` client.

    ```azurecli-interactive
    # Sign in to your Azure subscription.
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

2. Set an AKS cluster for your workload.

    > [!NOTE]
    > The AKS cluster needs to be in a [region where Application Gateway for Containers is available](overview.md#supported-regions)
    > AKS cluster should use [Azure CNI](../../aks/configure-azure-cni.md).
    > AKS cluster should have the workload identity feature enabled. [Learn how](../../aks/workload-identity-deploy-cluster.md#update-an-existing-aks-cluster) to enable workload identity on an existing AKS cluster. 

    If using an existing cluster, ensure you enable Workload Identity support on your AKS cluster.  Workload identities can be enabled via the following:
    
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

3. Install Helm

    [Helm](https://github.com/helm/helm) is an open-source packaging tool that is used to install ALB controller. 

    > [!NOTE]
    > Helm is already available in Azure Cloud Shell.  If you are using Azure Cloud Shell, no additional Helm installation is necessary.

    You can also use the following steps to install Helm on a local device running Windows or Linux. Ensure that you have the latest version of helm installed. 

    # [Windows](#tab/install-helm-windows)
    See the [instructions for installation](https://github.com/helm/helm#install) for various options of installation.  Similarly, if your version of Windows has [Windows Package Manager winget](/windows/package-manager/winget/) installed, you may execute the following command:

    ```powershell
    winget install helm.helm
    ```

    # [Linux](#tab/install-helm-linux)
    The following command can be used to install Helm. Commands that use Helm with Azure CLI in this article can also be run using Bash.
    ```bash
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
    ```


## Install the ALB Controller

1. Create a user managed identity for ALB controller and federate the identity as Workload Identity to use in the AKS cluster.

    ```azurecli-interactive
    RESOURCE_GROUP='<your resource group name>'
    AKS_NAME='<your aks cluster name>'
    IDENTITY_RESOURCE_NAME='azure-alb-identity'

    mcResourceGroup=$(az aks show --resource-group $RESOURCE_GROUP --name $AKS_NAME --query "nodeResourceGroup" -o tsv)
    mcResourceGroupId=$(az group show --name $mcResourceGroup --query id -otsv)

    echo "Creating identity $IDENTITY_RESOURCE_NAME in resource group $RESOURCE_GROUP"
    az identity create --resource-group $RESOURCE_GROUP --name $IDENTITY_RESOURCE_NAME
    principalId="$(az identity show -g $RESOURCE_GROUP -n $IDENTITY_RESOURCE_NAME --query principalId -otsv)"

    echo "Waiting 60 seconds to allow for replication of the identity..."
    sleep 60
 
    echo "Apply Reader role to the AKS managed cluster resource group for the newly provisioned identity"
    az role assignment create --assignee-object-id $principalId --assignee-principal-type ServicePrincipal --scope $mcResourceGroupId --role "acdd72a7-3385-48ef-bd42-f606fba81ae7" # Reader role

    echo "Set up federation with AKS OIDC issuer"
    AKS_OIDC_ISSUER="$(az aks show -n "$AKS_NAME" -g "$RESOURCE_GROUP" --query "oidcIssuerProfile.issuerUrl" -o tsv)"
    az identity federated-credential create --name "azure-alb-identity" \
        --identity-name "$IDENTITY_RESOURCE_NAME" \
        --resource-group $RESOURCE_GROUP \
        --issuer "$AKS_OIDC_ISSUER" \
        --subject "system:serviceaccount:azure-alb-system:alb-controller-sa"
    ```
    ALB Controller requires a federated credential with the name of _azure-alb-identity_.  Any other federated credential name is unsupported.

   > [!Note]
   > Assignment of the managed identity immediately after creation may result in an error that the principalId does not exist. Allow about a minute of time to elapse for the identity to replicate in Azure AD prior to delegating the identity.

2. Install ALB Controller using Helm

    ### For new deployments
    
    To install ALB Controller, use the `helm install` command.

    When the `helm install` command is run, it will deploy the helm chart to the  _default_ namespace.  When alb-controller is deployed, it will deploy to the _azure-alb-system_ namespace.  Both of these namespaces may be overridden independently as desired.  To override the namespace the helm chart is deployed to, you may specify the --namespace (or -n) parameter.  To override the _azure-alb-system_ namespace used by alb-controller, you may set the albController.namespace property during installation (`--set albController.namespace`).  If neither the `--namespace` or `--set albController.namespace` parameters are defined, the _default_ namespace will be used for the helm chart and the _azure-alb-system_ namespace will be used for the ALB controller components. Lastly, if the namespace for the helm chart resource is not yet defined, ensure the `--create-namespace` parameter is also specified along with the `--namespace` or `-n` parameters.
    
    ALB Controller can be installed by running the following commands:

    ```azurecli-interactive
    az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME
    helm install alb-controller oci://mcr.microsoft.com/application-lb/charts/alb-controller \
         --namespace <helm-resource-namespace> \
         --version 0.5.024542 \
         --set albController.namespace=<alb-controller-namespace> \
         --set albController.podIdentity.clientID=$(az identity show -g $RESOURCE_GROUP -n azure-alb-identity --query clientId -o tsv)
    ```


    ### For existing deployments
    ALB can be upgraded by running the following commands:
    
    > [!Note]
    > During upgrade, please ensure you specify the `--namespace` or `--set albController.namespace` parameters if the namespaces were overridden in the previously installed installation.  To determine the previous namespaces used, you may run the `helm list` command for the helm namespace and `kubectl get pod -A -l app=alb-controller` for the ALB controller.

    ```azurecli-interactive
    az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME
    helm upgrade alb-controller oci://mcr.microsoft.com/application-lb/charts/alb-controller \
        --namespace <helm-resource-namespace> \
        --version 0.5.024542 \
        --set albController.namespace=<alb-controller-namespace> \
        --set albController.podIdentity.clientID=$(az identity show -g $RESOURCE_GROUP -n azure-alb-identity --query clientId -o tsv)
    ```

### Verify the ALB Controller installation

1. Verify the ALB Controller pods are ready:

    ```azurecli-interactive
    kubectl get pods -n azure-alb-system
    ```
    You should see the following:
   
    | NAME                                     | READY | STATUS  | RESTARTS | AGE  |
    | ---------------------------------------- | ----- | ------- | -------- | ---- |
    | alb-controller-bootstrap-6648c5d5c-hrmpc | 1/1   | Running | 0        | 4d6h |
    | alb-controller-6648c5d5c-sdd9t           | 1/1   | Running | 0        | 4d6h |
    | alb-controller-6648c5d5c-au234           | 1/1   | Running | 0        | 4d6h |

2. Verify GatewayClass `azure-application-lb` is installed on your cluster:

    ```azurecli-interactive
    kubectl get gatewayclass azure-alb-external -o yaml
    ```

    You should see that the GatewayClass has a condition that reads **Valid GatewayClass** . This indicates that a default GatewayClass has been set up and that any gateway resources that reference this GatewayClass is managed by ALB Controller automatically.
    ```output
    apiVersion: gateway.networking.k8s.io/v1beta1
    kind: GatewayClass
    metadata:
      creationTimestamp: "2023-07-31T13:07:00Z"
      generation: 1
      name: azure-alb-external
      resourceVersion: "64270"
      uid: 6c1443af-63e6-4b79-952f-6c3af1f1c41e
    spec:
      controllerName: alb.networking.azure.io/alb-controller
    status:
      conditions:
        - lastTransitionTime: "2023-07-31T13:07:23Z"
        message: Valid GatewayClass
        observedGeneration: 1
        reason: Accepted
        status: "True"
        type: Accepted
    ```

## Next Steps 

Now that you have successfully installed an ALB Controller on your cluster, you can provision the Application Gateway For Containers resources in Azure. 

The next step is to link your ALB controller to Application Gateway for Containers. How you create this link depends on your deployment strategy.

There are two deployment strategies for management of Application Gateway for Containers:
- **Bring your own (BYO) deployment:** In this deployment strategy, deployment and lifecycle of the Application Gateway for Containers resource, Association and Frontend resource is assumed via Azure portal, CLI, PowerShell, Terraform, etc. and referenced in configuration within Kubernetes.
   - To use a BYO deployment, see [Create Application Gateway for Containers - bring your own deployment](quickstart-create-application-gateway-for-containers-byo-deployment.md)
- **Managed by ALB controller:** In this deployment strategy, ALB Controller deployed in Kubernetes is responsible for the lifecycle of the Application Gateway for Containers resource and its sub resources. ALB Controller creates an Application Gateway for Containers resource when an **ApplicationLoadBalancer** custom resource is defined on the cluster. The service lifecycle is based on the lifecycle of the custom resource.
  - To use an ALB managed deployment, see [Create Application Gateway for Containers managed by ALB Controller](quickstart-create-application-gateway-for-containers-managed-by-alb-controller.md)

## Uninstall Application Gateway for Containers and ALB Controller

If you wish to uninstall the ALB Controller, complete the following steps.

1. Delete the Application Gateway for Containers, you can delete the Resource Group containing the Application Gateway for Containers resources:

```azurecli-interactive
az group delete --resource-group $RESOURCE_GROUP
```

2. Uninstall ALB Controller and its resources from your cluster run the following commands:

```azurecli-interactive
helm uninstall alb-controller
kubectl delete ns azure-alb-system
kubectl delete gatewayclass azure-alb-external
```
> [!Note]
> If a different namespace was used for alb-controller installation, ensure you specify the -n parameter on the helm uninstall command to define the proper namespace to be used. For example: `helm uninstall alb-controller -n unique-namespace`
