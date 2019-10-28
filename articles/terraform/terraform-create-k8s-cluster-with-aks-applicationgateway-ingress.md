---
title: Tutorial - Create an Application Gateway ingress controller in Azure Kubernetes Service
description: Tutorial illustrating how to create a Kubernetes Cluster with Azure Kubernetes Service with Application Gateway as ingress controller
ms.service: terraform
author: tomarchermsft
ms.author: tarcher
ms.topic: tutorial
ms.date: 10/26/2019
---

# Tutorial: Create an Application Gateway ingress controller in Azure Kubernetes Service

[Azure Kubernetes Service (AKS)](/azure/aks/) manages your hosted Kubernetes environment. AKS makes it quick and easy to deploy and manage containerized applications without container orchestration expertise. AKS also eliminates the burden of taking applications offline for operational and maintenance tasks. Using AKS, these tasks - including provisioning, upgrading and scaling resources - can be accomplished on-demand.

An ingress controller provides various features for Kubernetes services. These features include reverse proxy, configurable traffic routing, and TLS termination. Kubernetes ingress resources are used to configure the ingress rules for individual Kubernetes services. Using an ingress controller and ingress rules, a single IP address can route traffic to multiple services in a Kubernetes cluster. All this functionality is provided by Azure [Application Gateway](/azure/Application-Gateway/), making it an ideal Ingress controller for Kubernetes on Azure. 

In this tutorial, you learn how to do the following tasks:

> [!div class="checklist"]
> * Create a [Kubernetes](https://www.redhat.com/en/topics/containers/what-is-kubernetes) cluster using AKS with Application Gateway as Ingress Controller.
> * Use HCL (HashiCorp Language) to define a Kubernetes cluster.
> * Use Terraform to create Application Gateway resource.
> * Use Terraform and AKS to create a Kubernetes cluster.
> * Use the kubectl tool to test the availability of a Kubernetes cluster.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

- **Configure Terraform**: Follow the directions in the article, [Terraform and configure access to Azure](/azure/virtual-machines/linux/terraform-install-configure)

- **Azure service principal**: Follow the directions in the section of the **Create the service principal** section in the article, [Create an Azure service principal with Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest). Take note of the values for the appId, displayName, and password.

- **Obtain the Service Principal Object ID**: Run the following command in Cloud Shell: `az ad sp list --display-name <displayName>`

## Create the directory structure

The first step is to create the directory that holds your Terraform configuration files for the exercise.

1. Browse to the [Azure portal](https://portal.azure.com).

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview).

1. Change directories to the `clouddrive` directory.

    ```bash
    cd clouddrive
    ```

1. Create a directory named `terraform-aks-k8s`.

    ```bash
    mkdir terraform-aks-appgw-ingress
    ```

1. Change directories to the new directory:

    ```bash
    cd terraform-aks-appgw-ingress
    ```

## Declare the Azure provider

Create the Terraform configuration file that declares the Azure provider.

1. In Cloud Shell, create a file named `main.tf`.

    ```bash
    code main.tf
    ```

1. Paste the following code into the editor:

    ```hcl
    provider "azurerm" {
        version = "~>1.18"
    }

    terraform {
        backend "azurerm" {}
    }
    ```

1. Save the file (**&lt;Ctrl>S**) and exit the editor (**&lt;Ctrl>Q**).

## Define input variables

Create the Terraform configuration file that lists all the variables required for this deployment.

1. In Cloud Shell, create a file named `variables.tf`.

    ```bash
    code variables.tf
    ```

1. Paste the following code into the editor:
    
    ```hcl
    variable "resource_group_name" {
      description = "Name of the resource group already created."
    }

    variable "location" {
      description = "Location of the cluster."
    }

    variable "aks_service_principal_app_id" {
      description = "Application ID/Client ID  of the service principal. Used by AKS to manage AKS related resources on Azure like vms, subnets."
    }

    variable "aks_service_principal_client_secret" {
      description = "Secret of the service principal. Used by AKS to manage Azure."
    }

    variable "aks_service_principal_object_id" {
      description = "Object ID of the service principal."
    }

    variable "virtual_network_name" {
      description = "Virtual network name"
      default     = "aksVirtualNetwork"
    }

    variable "virtual_network_address_prefix" {
      description = "Containers DNS server IP address."
      default     = "15.0.0.0/8"
    }

    variable "aks_subnet_name" {
      description = "AKS Subnet Name."
      default     = "kubesubnet"
    }

    variable "aks_subnet_address_prefix" {
      description = "Containers DNS server IP address."
      default     = "15.0.0.0/16"
    }

    variable "app_gateway_subnet_address_prefix" {
      description = "Containers DNS server IP address."
      default     = "15.1.0.0/16"
    }

    variable "app_gateway_name" {
      description = "Name of the Application Gateway."
      default = "ApplicationGateway1"
    }

    variable "app_gateway_sku" {
      description = "Name of the Application Gateway SKU."
      default = "Standard_v2"
    }

    variable "app_gateway_tier" {
      description = "Tier of the Application Gateway SKU."
      default = "Standard_v2"
    }

    variable "aks_name" {
      description = "Name of the AKS cluster."
      default     = "aks-cluster1"
    }
    variable "aks_dns_prefix" {
      description = "Optional DNS prefix to use with hosted Kubernetes API server FQDN."
      default     = "aks"
    }

    variable "aks_agent_os_disk_size" {
      description = "Disk size (in GB) to provision for each of the agent pool nodes. This value ranges from 0 to 1023. Specifying 0 applies the default disk size for that agentVMSize."
      default     = 40
    }

    variable "aks_agent_count" {
      description = "The number of agent nodes for the cluster."
      default     = 3
    }

    variable "aks_agent_vm_size" {
      description = "The size of the Virtual Machine."
      default     = "Standard_D3_v2"
    }

    variable "kubernetes_version" {
      description = "The version of Kubernetes."
      default     = "1.11.5"
    }

    variable "aks_service_cidr" {
      description = "A CIDR notation IP range from which to assign service cluster IPs."
      default     = "10.0.0.0/16"
    }

    variable "aks_dns_service_ip" {
      description = "Containers DNS server IP address."
      default     = "10.0.0.10"
    }

    variable "aks_docker_bridge_cidr" {
      description = "A CIDR notation IP for Docker bridge."
      default     = "172.17.0.1/16"
    }

    variable "aks_enable_rbac" {
      description = "Enable RBAC on the AKS cluster. Defaults to false."
      default     = "false"
    }

    variable "vm_user_name" {
      description = "User name for the VM"
      default     = "vmuser1"
    }

    variable "public_ssh_key_path" {
      description = "Public key path for SSH."
      default     = "~/.ssh/id_rsa.pub"
    }

    variable "tags" {
      type = "map"

      default = {
        source = "terraform"
      }
    }
    ```

1. Save the file (**&lt;Ctrl>S**) and exit the editor (**&lt;Ctrl>Q**).

## Define the resources 
Create Terraform configuration file that creates all the resources. 

1. In Cloud Shell, create a file named `resources.tf`.

    ```bash
    code resources.tf
    ```

1. Paste the following code block to create a locals block for computed variables to reuse:

    ```hcl
    # # Locals block for hardcoded names. 
    locals {
        backend_address_pool_name      = "${azurerm_virtual_network.test.name}-beap"
        frontend_port_name             = "${azurerm_virtual_network.test.name}-feport"
        frontend_ip_configuration_name = "${azurerm_virtual_network.test.name}-feip"
        http_setting_name              = "${azurerm_virtual_network.test.name}-be-htst"
        listener_name                  = "${azurerm_virtual_network.test.name}-httplstn"
        request_routing_rule_name      = "${azurerm_virtual_network.test.name}-rqrt"
        app_gateway_subnet_name = "appgwsubnet"
    }
    ```

1. Paste the following code block to create a data source for Resource group, new User identity:

    ```hcl
    data "azurerm_resource_group" "rg" {
      name = var.resource_group_name
    }

    # User Assigned Idntities 
    resource "azurerm_user_assigned_identity" "testIdentity" {
      resource_group_name = data.azurerm_resource_group.rg.name
      location            = data.azurerm_resource_group.rg.location

      name = "identity1"

      tags = var.tags
    }
    ```

1. Paste the following code block to create base networking resources:

    ```hcl
    resource "azurerm_virtual_network" "test" {
      name                = var.virtual_network_name
      location            = data.azurerm_resource_group.rg.location
      resource_group_name = data.azurerm_resource_group.rg.name
      address_space       = [var.virtual_network_address_prefix]

      subnet {
        name           = var.aks_subnet_name
        address_prefix = var.aks_subnet_address_prefix
      }

      subnet {
        name           = "appgwsubnet"
        address_prefix = var.app_gateway_subnet_address_prefix
      }

      tags = var.tags
    }

    data "azurerm_subnet" "kubesubnet" {
      name                 = var.aks_subnet_name
      virtual_network_name = azurerm_virtual_network.test.name
      resource_group_name  = data.azurerm_resource_group.rg.name
    }

    data "azurerm_subnet" "appgwsubnet" {
      name                 = "appgwsubnet"
      virtual_network_name = azurerm_virtual_network.test.name
      resource_group_name  = data.azurerm_resource_group.rg.name
    }

    # Public Ip 
    resource "azurerm_public_ip" "test" {
      name                         = "publicIp1"
      location                     = data.azurerm_resource_group.rg.location
      resource_group_name          = data.azurerm_resource_group.rg.name
      public_ip_address_allocation = "static"
      sku                          = "Standard"

      tags = var.tags
    }
    ```

1. Paste the following code block to create Application Gateway resource:

    ```hcl
    resource "azurerm_application_gateway" "network" {
      name                = var.app_gateway_name
      resource_group_name = data.azurerm_resource_group.rg.name
      location            = data.azurerm_resource_group.rg.location

      sku {
        name     = var.app_gateway_sku
        tier     = "Standard_v2"
        capacity = 2
      }

      gateway_ip_configuration {
        name      = "appGatewayIpConfig"
        subnet_id = data.azurerm_subnet.appgwsubnet.id
      }

      frontend_port {
        name = local.frontend_port_name
        port = 80
      }

      frontend_port {
        name = "httpsPort"
        port = 443
      }

      frontend_ip_configuration {
        name                 = local.frontend_ip_configuration_name
        public_ip_address_id = azurerm_public_ip.test.id
      }

      backend_address_pool {
        name = local.backend_address_pool_name
      }

      backend_http_settings {
        name                  = local.http_setting_name
        cookie_based_affinity = "Disabled"
        port                  = 80
        protocol              = "Http"
        request_timeout       = 1
      }

      http_listener {
        name                           = local.listener_name
        frontend_ip_configuration_name = local.frontend_ip_configuration_name
        frontend_port_name             = local.frontend_port_name
        protocol                       = "Http"
      }

      request_routing_rule {
        name                       = local.request_routing_rule_name
        rule_type                  = "Basic"
        http_listener_name         = local.listener_name
        backend_address_pool_name  = local.backend_address_pool_name
        backend_http_settings_name = local.http_setting_name
      }

      tags = var.tags

      depends_on = ["azurerm_virtual_network.test", "azurerm_public_ip.test"]
    }
    ```

1. Paste the following code block to create role assignments:

    ```hcl
    resource "azurerm_role_assignment" "ra1" {
      scope                = data.azurerm_subnet.kubesubnet.id
      role_definition_name = "Network Contributor"
      principal_id         = var.aks_service_principal_object_id 

      depends_on = ["azurerm_virtual_network.test"]
    }

    resource "azurerm_role_assignment" "ra2" {
      scope                = azurerm_user_assigned_identity.testIdentity.id
      role_definition_name = "Managed Identity Operator"
      principal_id         = var.aks_service_principal_object_id
      depends_on           = ["azurerm_user_assigned_identity.testIdentity"]
    }

    resource "azurerm_role_assignment" "ra3" {
      scope                = azurerm_application_gateway.network.id
      role_definition_name = "Contributor"
      principal_id         = azurerm_user_assigned_identity.testIdentity.principal_id
      depends_on           = ["azurerm_user_assigned_identity.testIdentity", "azurerm_application_gateway.network"]
    }

    resource "azurerm_role_assignment" "ra4" {
      scope                = data.azurerm_resource_group.rg.id
      role_definition_name = "Reader"
      principal_id         = azurerm_user_assigned_identity.testIdentity.principal_id
      depends_on           = ["azurerm_user_assigned_identity.testIdentity", "azurerm_application_gateway.network"]
    }
    ```

1. Paste the following code block to create the Kubernetes cluster:

    ```hcl
    resource "azurerm_kubernetes_cluster" "k8s" {
      name       = var.aks_name
      location   = data.azurerm_resource_group.rg.location
      dns_prefix = var.aks_dns_prefix

      resource_group_name = data.azurerm_resource_group.rg.name

      linux_profile {
        admin_username = var.vm_user_name

        ssh_key {
          key_data = file(var.public_ssh_key_path)
        }
      }

      addon_profile {
        http_application_routing {
          enabled = false
        }
      }

      agent_pool_profile {
        name            = "agentpool"
        count           = var.aks_agent_count
        vm_size         = var.aks_agent_vm_size
        os_type         = "Linux"
        os_disk_size_gb = var.aks_agent_os_disk_size
        vnet_subnet_id  = data.azurerm_subnet.kubesubnet.id
      }

      service_principal {
        client_id     = var.aks_service_principal_app_id
        client_secret = var.aks_service_principal_client_secret
      }

      network_profile {
        network_plugin     = "azure"
        dns_service_ip     = var.aks_dns_service_ip
        docker_bridge_cidr = var.aks_docker_bridge_cidr
        service_cidr       = var.aks_service_cidr
      }

      depends_on = ["azurerm_virtual_network.test", "azurerm_application_gateway.network"]
      tags       = var.tags
    }

    ```

1. Save the file and exit the editor.

The code presented in this section sets the name of the cluster, location, and the resource_group_name. The `dns_prefix` value - that forms part of the fully qualified domain name (FQDN) used to access the cluster - is set.

The `linux_profile` record allows you to configure the settings that enable signing into the worker nodes using SSH.

With AKS, you pay only for the worker nodes. The `agent_pool_profile` record configures the details for these worker nodes. The `agent_pool_profile record` includes the number of worker nodes to create and the type of worker nodes. If you need to scale up or scale down the cluster in the future, you modify the `count` value in this record.

## Create a Terraform output file

[Terraform outputs](https://www.terraform.io/docs/configuration/outputs.html) allow you to define values that are highlighted to the user when Terraform applies a plan, and can be queried using the `terraform output` command. In this section, you create an output file that allows access to the cluster with [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/).

1. In Cloud Shell, create a file named `output.tf`.

    ```bash
    code output.tf
    ```

1. Paste the following code into the editor:

    ```hcl
    output "client_key" {
        value = azurerm_kubernetes_cluster.k8s.kube_config.0.client_key
    }

    output "client_certificate" {
        value = azurerm_kubernetes_cluster.k8s.kube_config.0.client_certificate
    }

    output "cluster_ca_certificate" {
        value = azurerm_kubernetes_cluster.k8s.kube_config.0.cluster_ca_certificate
    }

    output "cluster_username" {
        value = azurerm_kubernetes_cluster.k8s.kube_config.0.username
    }

    output "cluster_password" {
        value = azurerm_kubernetes_cluster.k8s.kube_config.0.password
    }

    output "kube_config" {
        value = azurerm_kubernetes_cluster.k8s.kube_config_raw
    }

    output "host" {
        value = azurerm_kubernetes_cluster.k8s.kube_config.0.host
    }

    output "identity_resource_id" {
        value = azurerm_user_assigned_identity.testIdentity.id
    }

    output "identity_client_id" {
        value = azurerm_user_assigned_identity.testIdentity.client_id
    }
    ```

1. Save the file (**&lt;Ctrl>S**) and exit the editor (**&lt;Ctrl>Q**).

## Configure Azure storage to store Terraform state

Terraform tracks state locally via the `terraform.tfstate` file. This pattern works well in a single-person environment. However, in a more practical multi-person environment, you need to track state on the server using [Azure storage](/azure/storage/). In this section, you learn to retrieve the necessary storage account information and create a storage container. The Terraform state information is then stored in that container.

1. In the Azure portal, select **All services** in the left menu.

1. Select **Storage accounts**.

1. On the **Storage accounts** tab, select the name of the storage account into which Terraform is to store state. For example, you can use the storage account created when you opened Cloud Shell the first time.  The storage account name created by Cloud Shell typically starts with `cs` followed by a random string of numbers and letters. 

    Take note of the storage account you select, as you need it later.

1. On the storage account tab, select **Access keys**.

    ![Storage account menu](./media/terraform-k8s-cluster-appgw-with-tf-aks/storage-account.png)

1. Make note of the **key1** **key** value. (Selecting the icon to the right of the key copies the value to the clipboard.)

    ![Storage account access keys](./media/terraform-k8s-cluster-appgw-with-tf-aks/storage-account-access-key.png)

1. In Cloud Shell, create a container in your Azure storage account (replace the &lt;YourAzureStorageAccountName> and &lt;YourAzureStorageAccountAccessKey> placeholders with appropriate values for your Azure storage account).

    ```azurecli
    az storage container create -n tfstate --account-name <YourAzureStorageAccountName> --account-key <YourAzureStorageAccountKey>
    ```

## Create the Kubernetes cluster
In this section, you see how to use the `terraform init` command to create the resources defined the configuration files you created in the previous sections.

1. In Cloud Shell, initialize Terraform (replace the &lt;YourAzureStorageAccountName> and &lt;YourAzureStorageAccountAccessKey> placeholders with  appropriate values for your Azure storage account).

    ```bash
    terraform init -backend-config="storage_account_name=<YourAzureStorageAccountName>" -backend-config="container_name=tfstate" -backend-config="access_key=<YourStorageAccountAccessKey>" -backend-config="key=codelab.microsoft.tfstate" 
    ```
  
    The `terraform init` command displays the success of initializing the backend and provider plug-in:

    ![Example of "terraform init" results](./media/terraform-k8s-cluster-appgw-with-tf-aks/terraform-init-complete.png)

1. In Cloud Shell, create a file named `main.tf`:

    ```bash
    code terraform.tfvars
    ```

1. Paste the following variables created earlier into the editor:

    ```hcl
    resource_group_name = <Name of the Resource Group already created>

    location = <Location of the Resource Group>
      
    aks_service_principal_app_id = <Service Principal AppId>
      
    aks_service_principal_client_secret = <Service Principal Client Secret>
      
    aks_service_principal_object_id = <Service Principal Object Id>
        
    ```

1. Save the file (**&lt;Ctrl>S**) and exit the editor (**&lt;Ctrl>Q**).

1. Run the `terraform plan` command to create the Terraform plan that defines the infrastructure elements. 

    ```bash
    terraform plan -out out.plan
    ```

    The `terraform plan` command displays the resources that are created when you run the `terraform apply` command:

    ![Example of "terraform plan" results](./media/terraform-k8s-cluster-appgw-with-tf-aks/terraform-plan-complete.png)

1. Run the `terraform apply` command to apply the plan to create the Kubernetes cluster. The process to create a Kubernetes cluster can take several minutes, resulting in the Cloud Shell session timing out. If the Cloud Shell session times out, you can follow the steps in the section "Recover from a Cloud Shell timeout" to enable you to complete the tutorial.

    ```bash
    terraform apply out.plan
    ```

    The `terraform apply` command displays the results of creating the resources defined in your configuration files:

    ![Example of "terraform apply" results](./media/terraform-k8s-cluster-appgw-with-tf-aks/terraform-apply-complete.png)

1. In the Azure portal, select **Resource Groups** in the left menu to see the resources created for your new Kubernetes cluster in the selected resource group.

    ![Cloud Shell prompt](./media/terraform-k8s-cluster-appgw-with-tf-aks/k8s-resources-created.png)

## Recover from a Cloud Shell timeout

If the Cloud Shell session times out, you can use the following steps to recover:

1. Start a Cloud Shell session.

1. Change to the directory containing your Terraform configuration files.

    ```bash
    cd /clouddrive/terraform-aks-k8s
    ```

1. Run the following command:

    ```bash
    export KUBECONFIG=./azurek8s
    ```
  
## Test the Kubernetes cluster
The Kubernetes tools can be used to verify the newly created cluster.

1. Get the Kubernetes configuration from the Terraform state and store it in a file that kubectl can read.

    ```bash
    echo "$(terraform output kube_config)" > ./azurek8s
    ```

1. Set an environment variable so that kubectl picks up the correct config.

    ```bash
    export KUBECONFIG=./azurek8s
    ```

1. Verify the health of the cluster.

    ```bash
    kubectl get nodes
    ```

    You should see the details of your worker nodes, and they should all have a status **Ready**, as shown in the following image:

    ![The kubectl tool allows you to verify the health of your Kubernetes cluster](./media/terraform-k8s-cluster-appgw-with-tf-aks/kubectl-get-nodes.png)

## Install Azure AD Pod Identity

Azure Active Directory Pod Identity provides token-based access to [Azure Resource Manager](/azure/azure-resource-manager/resource-group-overview).

[Azure AD Pod Identity](https://github.com/Azure/aad-pod-identity) adds the following components to your Kubernetes cluster:

  - Kubernetes [CRDs](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/): `AzureIdentity`, `AzureAssignedIdentity`, `AzureIdentityBinding`
  - [Managed Identity Controller (MIC)](https://github.com/Azure/aad-pod-identity#managed-identity-controllermic) component
  - [Node Managed Identity (NMI)](https://github.com/Azure/aad-pod-identity#node-managed-identitynmi) component

If RBAC is **enabled**, run the following command to install Azure AD Pod Identity to your cluster:

    ```bash
    kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment-rbac.yaml
    ```

If RBAC is **disabled**, run the following command to install Azure AD Pod Identity to your cluster:

    ```bash
    kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment.yaml
    ```

## Install Helm

The code in this section uses [Helm](/azure/aks/kubernetes-helm) - Kubernetes package manager - to install the `application-gateway-kubernetes-ingress` package:

1. If RBAC is **enabled**, run the following set of commands to install and configure Helm:

    ```bash
    kubectl create serviceaccount --namespace kube-system tiller-sa
    kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller-sa
    helm init --tiller-namespace kube-system --service-account tiller-sa
    ```

1. If RBAC is **disabled**, run the following command to install and configure Helm:

    ```bash
    helm init
    ```

1. Add the AGIC Helm repository:

    ```bash
    helm repo add application-gateway-kubernetes-ingress https://appgwingress.blob.core.windows.net/ingress-azure-helm-package/
    helm repo update
    ```

## Install Ingress Controller Helm Chart

1. Download `helm-config.yaml` to configure AGIC:

    ```bash
    wget https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/sample-helm-config.yaml -O helm-config.yaml
    ```

1. Edit the `helm-config.yaml` and enter appropriate values for `appgw` and `armAuth` sections.

    ```bash
    nano helm-config.yaml
    ```

    The values are described as follows:

    - `verbosityLevel`: Sets the verbosity level of the AGIC logging infrastructure. See [Logging Levels](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/463a87213bbc3106af6fce0f4023477216d2ad78/docs/troubleshooting.md#logging-levels) for possible values.
    - `appgw.subscriptionId`: The Azure Subscription ID for the App Gateway. Example: `a123b234-a3b4-557d-b2df-a0bc12de1234`
    - `appgw.resourceGroup`: Name of the Azure Resource Group in which App Gateway was created. 
    - `appgw.name`: Name of the Application Gateway. Example: `applicationgateway1`.
    - `appgw.shared`: This boolean flag should be defaulted to `false`. Set to `true` should you need a [Shared App Gateway](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/072626cb4e37f7b7a1b0c4578c38d1eadc3e8701/docs/setup/install-existing.md#multi-cluster--shared-app-gateway).
    - `kubernetes.watchNamespace`: Specify the name space, which AGIC should watch. The namespace can be a single string value, or a comma-separated list of namespaces.
    - `armAuth.type`: A value of either `aadPodIdentity` or `servicePrincipal`.
    - `armAuth.identityResourceID`: Resource ID of the managed identity.
    - `armAuth.identityClientId`: The Client ID of the Identity.
    - `armAuth.secretJSON`: Only needed when Service Principal Secret type is chosen (when `armAuth.type` has been set to `servicePrincipal`).

    Key notes:
    - The `identityResourceID`  value is created in the terraform script and can be found by running: `echo "$(terraform output identity_client_id)"`.
    - The `identityClientID` value is created in the terraform script and can be found by running: `echo "$(terraform output identity_resource_id)"`.
    - The `<resource-group>` value is the resource group of your App Gateway.
    - The `<identity-name>` value is the name of the created identity.
    - All identities for a given subscription can be listed using: `az identity list`.

1. Install the Application Gateway ingress controller package:

    ```bash
    helm install -f helm-config.yaml application-gateway-kubernetes-ingress/ingress-azure
    ```

### Install a sample app

Once you have the App Gateway, AKS, and AGIC installed, you can install a sample app via [Azure Cloud Shell](https://shell.azure.com/):

1. Use the curl command to download the YAML file:

    ```bash
    curl https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/aspnetapp.yaml -o aspnetapp.yaml
    ```

2. Apply the YAML file:

    ```bash
    kubectl apply -f apsnetapp.yaml
    ```

## Next steps

> [!div class="nextstepaction"] 
> [Application Gateway Ingress Controller](https://azure.github.io/application-gateway-kubernetes-ingress/)