---
title: Create an Application Gateway Ingress Controller in Azure Kubernetes Service using Terraform
description: Learn how to create an Application Gateway Ingress Controller in Azure Kubernetes Service using Terraform
ms.topic: how-to
ms.date: 9/5/2023
ms.custom: devx-track-terraform, devx-track-azurecli
content_well_notification: 
  - AI-contribution
---

# Create an Application Gateway Ingress Controller in Azure Kubernetes Service using Terraform

[Azure Kubernetes Service (AKS)](/azure/aks/) manages your hosted Kubernetes environment. AKS makes it quick and easy to deploy and manage containerized applications without container orchestration expertise. AKS also eliminates the burden of taking applications offline for operational and maintenance tasks. Using AKS, you can do such tasks as provisioning, upgrading, and scaling resources on-demand.

An Application Gateway Ingress Controller (AGIC) provides various features for Kubernetes services. These features include reverse proxy, configurable traffic routing, and TLS termination. Kubernetes Ingress resources are used to configure the Ingress rules for individual Kubernetes services. An Ingress controller allows a single IP address to route traffic to multiple services in a Kubernetes cluster. All this functionality is provided by [Azure Application Gateway](/azure/Application-Gateway/), making it an ideal Ingress controller for Kubernetes on Azure.

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet).
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
> * Create a User Assigned Identity using [azurerm_user_assigned_identity](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/user_assigned_identity).
> * Create a virtual network (VNet) using [azurerm_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network).
> * Create a subnet using [azurerm_subnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet).
> * Create a public IP using [azurerm_public_ip](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/public_ip).
> * Create a Application Gateway using [azurerm_application_gateway](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/application_gateway).
> * Create a Kubernetes cluster using [azurerm_kubernetes_cluster](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster).
> * Install and run a sample web app to test the availability of the Kubernetes cluster you create.

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

- **Install kubectl**: The [kubectl](https://kubernetes.io/docs/tasks/tools/) command-line tool allows you to run commands against Kubernetes clusters.

- **Install Helm**: [Helm](https://helm.sh/docs/intro/install/) is the Kubernetes package manager.

- **Install GNU wget**: The [wget](http://www.gnu.org/software/wget/) command-line tool is used to download assets from the Internet.

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/201-k8s-cluster-with-aks-applicationgateway-ingress). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/201-k8s-cluster-with-aks-applicationgateway-ingress/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code.

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-k8s-cluster-with-aks-applicationgateway-ingress/providers.tf":::

1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-k8s-cluster-with-aks-applicationgateway-ingress/main.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-k8s-cluster-with-aks-applicationgateway-ingress/variables.tf":::

1. Create a file named `outputs.tf` and insert the following code.

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-k8s-cluster-with-aks-applicationgateway-ingress/outputs.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results: Test the Kubernetes cluster

The Kubernetes tools can be used to verify the newly created cluster.

1. Get the Azure resource group name.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the AKS cluster name.

    ```console
    aks_cluster_name=$(terraform output -raw aks_cluster_name)
    ```

1. Run [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials) to get the Kubernetes configuration and access credentials from Azure.

    ```azurecli
    az aks get-credentials \
        --name $aks_cluster_name  \
        --resource-group $resource_group_name \
        --overwrite-existing
    ```

1. Run [kubectl get](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) to verify the health of the cluster.

    ```console
    kubectl get nodes
    ```

    **Key points:**

    - The details of your worker nodes display with a status of **Ready**.

    :::image type="content" source="media/create-k8s-cluster-with-aks-application-gateway-ingress/kubectl-get-nodes.png" alt-text="Screenshot of kubectl showing the health of your Kubernetes cluster.":::

## Install Azure AD Pod Identity

Azure Active Directory Pod Identity provides token-based access to [Azure Resource Manager](/azure/azure-resource-manager/resource-group-overview).

[Azure AD Pod Identity](https://github.com/Azure/aad-pod-identity) adds the following components to your Kubernetes cluster:

  - Kubernetes [CRDs](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/): `AzureIdentity`, `AzureAssignedIdentity`, `AzureIdentityBinding`
  - [Managed Identity Controller (MIC)](https://github.com/Azure/aad-pod-identity#managed-identity-controllermic) component
  - [Node Managed Identity (NMI)](https://github.com/Azure/aad-pod-identity#node-managed-identitynmi) component

To install Azure AD Pod Identity to your cluster, you need to know if RBAC is enabled or disabled. RBAC is disabled by default for this demo. Enabling or disabling RBAC is done in the `variables.tf` file via the `aks_enable_rbac` block's `default` value.

- If RBAC is **enabled**, run the following command:

    ```console
    kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment-rbac.yaml
    ```

- If RBAC is **disabled**, run the following command:

    ```console
    kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment.yaml
    ```

## Use Helm to install the AGIC package

1. Run [helm repo add](https://helm.sh/docs/helm/helm_repo_add/) to add the AGIC Helm repo.

    ```console
    helm repo add application-gateway-kubernetes-ingress https://appgwingress.blob.core.windows.net/ingress-azure-helm-package/
    ```
    
1. Run [helm repo update](https://helm.sh/docs/helm/helm_repo_update/) to update the AGIC Helm repo.

    ```console
    helm repo update
    ```
    
## Install AGIC Helm Chart

1. Download `helm-config.yaml` to configure AGIC.

    ```console
    wget https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/sample-helm-config.yaml -O helm-config.yaml
    ```

1. Open `helm-config.yaml` in a text editor.

1. Enter values for the top level keys.

    - `verbosityLevel`: Specify the *verbosity level* of the AGIC logging infrastructure. For more information about logging levels, see [the Logging Levels section of the Application Gateway Kubernetes Ingress document](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/463a87213bbc3106af6fce0f4023477216d2ad78/docs/troubleshooting.md).

1. Enter values for the `appgw` block.

    - `appgw.subscriptionId`: Specify the Azure subscription ID used to create the App Gateway.
    - `appgw.resourceGroup`: Get the resource group name by running `echo "$(terraform output -raw resource_group_name)"`
    - `appgw.name`: Get the Application Gateway name by running `echo "$(terraform output -raw application_gateway_name)"`
    - `appgw.shared`: This boolean flag defaults to `false`. Set it to `true` if you need a [Shared App Gateway](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/072626cb4e37f7b7a1b0c4578c38d1eadc3e8701/docs/setup/install-existing.md#multi-cluster--shared-app-gateway).

1. Enter values for the `kubernetes` block.

    - `kubernetes.watchNamespace`: Specify the name space, which AGIC should watch. The namespace can be a single string value, or a comma-separated list of namespaces. Leaving this variable commented out, or setting it to a blank or an empty string results in the Ingress controller observing all accessible namespaces.

1. Enter values for the `armAuth` block.

    - If you specify `armAuth.type` as `aadPodIdentity`:
        - `armAuth.identityResourceID`: Get the Identity resource ID by running `echo "$(terraform output -raw identity_resource_id)"`.
        - `armAuth.identityClientId`: Get the Identity client ID by running `echo "$(terraform output -raw identity_client_id)"`.

    - If you specify `armAuth.type` as `servicePrincipal`, see [Using a service principal](/azure/application-gateway/ingress-controller-install-existing#using-a-service-principal).

1. Install the Application Gateway Ingress controller package:

    ```console
    helm install -f helm-config.yaml application-gateway-kubernetes-ingress/ingress-azure --generate-name
    ```

1. Get the Azure resource group name.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the Identity name.

    ```console
    identity_name=$(terraform output -raw identity_name)
    ```

1. To get the key values from your identity, you can run [az identity show](/cli/azure/identity#az-identity-show) .

    ```azurecli
    az identity show -g $resource_group_name -n $identity_name
    ```

## Install a sample app

Once you have the App Gateway, AKS, and AGIC installed, install a sample app.

1. Use the curl command to download the YAML file:

    ```console
    curl https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/aspnetapp.yaml -o aspnetapp.yaml
    ```

2. Apply the YAML file:

    ```console
    kubectl apply -f aspnetapp.yaml
    ```

## Verify the results: Test the sample app

1. Run the following Terraform command to get the app's IP address.

    ```console
    echo "$(terraform output -raw application_ip_address)"
    ```
    
2. Using a browser, go to the IP address indicated in the previous step.

    :::image type="content" source="media/create-k8s-cluster-with-aks-application-gateway-ingress/sample-app.png" alt-text="Screenshot of sample app.":::

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Application Gateway Ingress Controller](https://azure.github.io/application-gateway-kubernetes-ingress/)
