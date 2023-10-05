---
title: Create an ingress controller with an existing Application Gateway 
description: This article provides information on how to deploy an Application Gateway Ingress Controller with an existing Application Gateway. 
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.custom: devx-track-arm-template, devx-track-linux, devx-track-azurecli
ms.topic: how-to
ms.date: 07/28/2023
ms.author: greglin
---

# Install an Application Gateway Ingress Controller (AGIC) using an existing Application Gateway

The Application Gateway Ingress Controller (AGIC) is a pod within your Azure Kubernetes Service (AKS) cluster.
AGIC monitors the Kubernetes [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
resources, and creates and applies Application Gateway config based on the status of the Kubernetes cluster.

> [!TIP]
> Also see [What is Application Gateway for Containers?](for-containers/overview.md) currently in public preview.

## Outline

- [Prerequisites](#prerequisites)
- [Azure Resource Manager Authentication (ARM)](#azure-resource-manager-authentication)
    - Option 1: [Set up Azure AD workload identity](#set-up-azure-ad-workload-identity) and create Azure Identity on ARMs
    - Option 2: [Set up a Service Principal](#using-a-service-principal)
- [Install Ingress Controller using Helm](#install-ingress-controller-as-a-helm-chart)
- [Shared Application Gateway](#shared-application-gateway): Install AGIC in an environment, where Application Gateway is
shared between one AKS cluster and/or other Azure components.

## Prerequisites

This document assumes you already have the following tools and infrastructure installed:

- [An AKS cluster](../aks/intro-kubernetes.md) with [Azure Container Networking Interface (CNI)](../aks/configure-azure-cni.md)
- [Application Gateway v2](./tutorial-autoscale-ps.md) in the same virtual network as the AKS cluster
- [Azure AD workload identity](../aks/workload-identity-overview.md) configured for your AKS cluster
- [Cloud Shell](https://shell.azure.com/) is the Azure shell environment, which has `az` CLI, `kubectl`, and `helm` installed. These tools are required for commands used to support configuring this deployment.

**Backup your Application Gateway's configuration** before installing AGIC:

  1. From the [Azure portal](https://portal.azure.com/), navigate to your Application Gateway instance.
  2. Under the **Automation** section, select **Export template** and then select **Download**.

The zip file you downloaded contains JSON templates, bash, and PowerShell scripts you could use to restore App
Gateway should that become necessary

## Install Helm

[Helm](../aks/kubernetes-helm.md) is a package manager for Kubernetes, used to install the `application-gateway-kubernetes-ingress` package.

> [!NOTE]
> If you use [Cloud Shell](https://shell.azure.com/), you don't need to install Helm.  Azure Cloud Shell comes with Helm version 3. Skip the first step and just add the AGIC Helm repository.

1. Install [Helm](../aks/kubernetes-helm.md) and run the following to add `application-gateway-kubernetes-ingress` helm package:

    - *Kubernetes RBAC enabled* AKS cluster

    ```bash
    kubectl create serviceaccount --namespace kube-system tiller-sa
    kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller-sa
    helm init --tiller-namespace kube-system --service-account tiller-sa
    ```

    - *Kubernetes RBAC disabled* AKS cluster

    ```bash
    helm init
    ```

2. Add the AGIC Helm repository:
    ```bash
    helm repo add application-gateway-kubernetes-ingress https://appgwingress.blob.core.windows.net/ingress-azure-helm-package/
    helm repo update
    ```

## Azure Resource Manager Authentication

AGIC communicates with the Kubernetes API server and the Azure Resource Manager. It requires an identity to access
these APIs.

## Set up Azure AD workload identity

[Azure AD workload identity](../aks/workload-identity-overview.md) is an identity you assign to a software workload, to authenticate and access other services and resources. This identity enables your AKS pod to use this identity and authenticate with other Azure resources. For this configuration, we need authorization
for the AGIC pod to make HTTP requests to [ARM](../azure-resource-manager/management/overview.md).

1. Use the Azure CLI [az account set](/cli/azure/account#az-account-set) command to set a specific subscription to be the current active subscription. Then use the [az identity create](/cli/azure/identity#az-identity-create) command to create a managed identity. The identity needs to be created in the [node resource group](../aks/concepts-clusters-workloads.md#node-resource-group). The node resource group is assigned a name by default, such as *MC_myResourceGroup_myAKSCluster_eastus*.

    ```azurecli-interactive
    az account set --subscription "subscriptionID"
    ```

    ```azurecli-interactive
    az identity create --name "userAssignedIdentityName" --resource-group "resourceGroupName" --location "location" --subscription "subscriptionID"
    ```

1. For the role assignment, run the following command to identify the `principalId` for the newly created identity:

    ```azurecli
    az identity show -g <resourcegroup> -n <identity-name>
    ```

1. Grant the identity **Contributor** access to your Application Gateway. You need the ID of the Application Gateway, which
looks like: `/subscriptions/A/resourceGroups/B/providers/Microsoft.Network/applicationGateways/C`. First, get the list of Application Gateway IDs in your subscription by running the following command:

    ```azurecli
    az network application-gateway list --query '[].id'
    ```

   To assign the identity **Contributor** access, run the following command:

    ```azurecli
    az role assignment create \
        --role Contributor \
        --assignee <principalId> \
        --scope <App-Gateway-ID>
    ```

1. Grant the identity **Reader** access to the Application Gateway resource group. The resource group ID looks like:
`/subscriptions/A/resourceGroups/B`. You can get all resource groups with: `az group list --query '[].id'`

    ```azurecli
    az role assignment create \
        --role Reader \
        --assignee <principalId> \
        --scope <App-Gateway-Resource-Group-ID>
    ```

>[!NOTE]
> If the virtual network Application Gateway is deployed into doesn't reside in the same resource group as the AKS nodes, please ensure the identity used by AGIC has the **Microsoft.Network/virtualNetworks/subnets/join/action** permission delegated to the subnet Application Gateway is deployed into. If a custom role is not defined with this permission, you may use the built-in **Network Contributor** role, which contains the **Microsoft.Network/virtualNetworks/subnets/join/action** permission.

## Using a Service Principal

It's also possible to provide AGIC access to ARM using a Kubernetes secret.

1. Create an Active Directory Service Principal and encode with base64. The base64 encoding is required for the JSON
blob to be saved to Kubernetes.

    ```azurecli
    az ad sp create-for-rbac --role Contributor --sdk-auth | base64 -w0
    ```

2. Add the base64 encoded JSON blob to the `helm-config.yaml` file. More information on `helm-config.yaml` is in the
next section.

    ```yaml
    armAuth:
        type: servicePrincipal
        secretJSON: <Base64-Encoded-Credentials>
    ```

## Install Ingress Controller as a Helm Chart

In the first few steps, we install Helm's Tiller on your Kubernetes cluster. Use [Cloud Shell](https://shell.azure.com/) to install the AGIC Helm package:

1. Add the `application-gateway-kubernetes-ingress` helm repo and perform a helm update

    ```bash
    helm repo add application-gateway-kubernetes-ingress https://appgwingress.blob.core.windows.net/ingress-azure-helm-package/
    helm repo update
    ```

1. Download helm-config.yaml, which configures AGIC:

    ```bash
    wget https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/sample-helm-config.yaml -O helm-config.yaml
    ```

    Or copy the following YAML file:

    ```yaml
    # This file contains the essential configs for the ingress controller helm chart

    # Verbosity level of the App Gateway Ingress Controller
    verbosityLevel: 3
    
    ################################################################################
    # Specify which application gateway the ingress controller must manage
    #
    appgw:
        subscriptionId: <subscriptionId>
        resourceGroup: <resourceGroupName>
        name: <applicationGatewayName>
    
        # Setting appgw.shared to "true" creates an AzureIngressProhibitedTarget CRD.
        # This prohibits AGIC from applying config for any host/path.
        # Use "kubectl get AzureIngressProhibitedTargets" to view and change this.
        shared: false
    
    ################################################################################
    # Specify which kubernetes namespace the ingress controller must watch
    # Default value is "default"
    # Leaving this variable out or setting it to blank or empty string would
    # result in Ingress Controller observing all accessible namespaces.
    #
    # kubernetes:
    #   watchNamespace: <namespace>
    
    ################################################################################
    # Specify the authentication with Azure Resource Manager
    #
    # Two authentication methods are available:
    # - Option 1: Azure-AD-workload-identity 
    armAuth:
        type: workloadIdentity
        identityClientID:  <identityClientId>
    
    ## Alternatively you can use Service Principal credentials
    # armAuth:
    #    type: servicePrincipal
    #    secretJSON: <<Generate this value with: "az ad sp create-for-rbac --role Contributor --sdk-auth | base64 -w0" >>
    
    ################################################################################
    # Specify if the cluster is Kubernetes RBAC enabled or not
    rbac:
        enabled: false # true/false
    
    # Specify aks cluster related information. THIS IS BEING DEPRECATED.
    aksClusterConfiguration:
        apiServerAddress: <aks-api-server-address>
    ```

1. Edit helm-config.yaml and fill in the values for `appgw` and `armAuth`.
  
    > [!NOTE]
    > The `<identity-client-id>` is a property of the Azure AD workload identity you setup in the previous section. You can retrieve this information by running the following command: `az identity show -g <resourcegroup> -n <identity-name>`, where `<resourcegroup>` is the resource group hosting the infrastructure resources related to the AKS cluster, Application Gateway and managed identity.

1. Install Helm chart `application-gateway-kubernetes-ingress` with the `helm-config.yaml` configuration from the previous step

    ```bash
    helm install -f <helm-config.yaml> application-gateway-kubernetes-ingress/ingress-azure
    ```

    Alternatively you can combine the `helm-config.yaml` and the Helm command in one step:

    ```bash
    helm install ./helm/ingress-azure \
         --name ingress-azure \
         --namespace default \
         --debug \
         --set appgw.name=applicationgatewayABCD \
         --set appgw.resourceGroup=your-resource-group \
         --set appgw.subscriptionId=subscription-uuid \
         --set appgw.shared=false \
         --set armAuth.type=servicePrincipal \
         --set armAuth.secretJSON=$(az ad sp create-for-rbac --role Contributor --sdk-auth | base64 -w0) \
         --set rbac.enabled=true \
         --set verbosityLevel=3 \
         --set kubernetes.watchNamespace=default \
         --set aksClusterConfiguration.apiServerAddress=aks-abcdefg.hcp.westus2.azmk8s.io
    ```

1. Check the log of the newly created pod to verify if it started properly

Refer to [this how-to guide](ingress-controller-expose-service-over-http-https.md) to understand how you can expose an AKS service over HTTP or HTTPS, to the internet, using an Azure Application Gateway.

## Shared Application Gateway

By default AGIC assumes full ownership of the Application Gateway it's linked to. AGIC version 0.8.0 and later can
share a single Application Gateway with other Azure components. For instance, we could use the same Application Gateway for an app
hosted on Virtual Machine Scale Set and an AKS cluster.

**Backup your Application Gateway's configuration** before enabling this setting:

  1. From the [Azure portal](https://portal.azure.com/), navigate to your `Application Gateway` instance
  2. Under the **Automation** section, select **Export template** and then select **Download**.

The zip file you downloaded contains JSON templates, bash, and PowerShell scripts you could use to restore Application Gateway

### Example Scenario

Let's look at an imaginary Application Gateway, which manages traffic for two web sites:

  - `dev.contoso.com` - hosted on a new AKS cluster, using Application Gateway and AGIC
  - `prod.contoso.com` - hosted on an [Azure Virtual Machine Scale Set](https://azure.microsoft.com/services/virtual-machine-scale-sets/)

With default settings, AGIC assumes 100% ownership of the Application Gateway it's pointed to. AGIC overwrites all of App
Gateway's configuration. If you manually create a listener for `prod.contoso.com` (on Application Gateway) without
defining it in the Kubernetes Ingress, AGIC deletes the `prod.contoso.com` config within seconds.

To install AGIC and also serve `prod.contoso.com` from our Virtual Machine Scale Set machines, we must constrain AGIC to configuring
`dev.contoso.com` only. This is facilitated by instantiating the following
[CRD](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/):

```bash
cat <<EOF | kubectl apply -f -
apiVersion: "appgw.ingress.k8s.io/v1"
kind: AzureIngressProhibitedTarget
metadata:
  name: prod-contoso-com
spec:
  hostname: prod.contoso.com
EOF
```

The command above creates an `AzureIngressProhibitedTarget` object. This makes AGIC (version 0.8.0 and later) aware of the existence of
Application Gateway config for `prod.contoso.com` and explicitly instructs it to avoid changing any configuration
related to that hostname.

### Enable with new AGIC installation

To limit AGIC (version 0.8.0 and later) to a subset of the Application Gateway configuration, modify the `helm-config.yaml` template.
Under the `appgw:` section, add `shared` key and set it to `true`.

```yaml
appgw:
    subscriptionId: <subscriptionId>    # existing field
    resourceGroup: <resourceGroupName>  # existing field
    name: <applicationGatewayName>      # existing field
    shared: true                        # <<<<< Add this field to enable shared Application Gateway >>>>>
```

Apply the Helm changes:

  1. Ensure the `AzureIngressProhibitedTarget` CRD is installed with:

      ```bash
      kubectl apply -f https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/7b55ad194e7582c47589eb9e78615042e00babf3/crds/AzureIngressProhibitedTarget-v1-CRD-v1.yaml
      ```

  2. Update Helm:

      ```bash
      helm upgrade \
          --recreate-pods \
          -f helm-config.yaml \
          ingress-azure application-gateway-kubernetes-ingress/ingress-azure
      ```

As a result, your AKS cluster has a new instance of `AzureIngressProhibitedTarget` called `prohibit-all-targets`:

  ```bash
  kubectl get AzureIngressProhibitedTargets prohibit-all-targets -o yaml
  ```

The object `prohibit-all-targets`, as the name implies, prohibits AGIC from changing config for *any* host and path.
Helm install with `appgw.shared=true` deploys AGIC, but doesn't make any changes to Application Gateway.

### Broaden permissions

Since Helm with `appgw.shared=true` and the default `prohibit-all-targets` blocks AGIC from applying a config, broaden AGIC permissions:

1. Create a new YAML file named `AzureIngressProhibitedTarget` with the following snippet containing your specific setup:

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: "appgw.ingress.k8s.io/v1"
    kind: AzureIngressProhibitedTarget
    metadata:
      name: your-custom-prohibitions
    spec:
      hostname: your.own-hostname.com
    EOF
    ```

2. Only after you have created your own custom prohibition, you can delete the default one, which is too broad:

    ```bash
    kubectl delete AzureIngressProhibitedTarget prohibit-all-targets
    ```

### Enable for an existing AGIC installation

Let's assume that we already have a working AKS cluster, Application Gateway, and configured AGIC in our cluster. We have an Ingress for
`prod.contoso.com` and are successfully serving traffic for it from the cluster. We want to add `staging.contoso.com` to our
existing Application Gateway, but need to host it on a [VM](https://azure.microsoft.com/services/virtual-machines/). We
are going to reuse the existing Application Gateway and manually configure a listener and backend pools for
`staging.contoso.com`. But manually tweaking Application Gateway config (using
[portal](https://portal.azure.com), [ARM APIs](/rest/api/resources/) or
[Terraform](https://www.terraform.io/)) would conflict with AGIC's assumptions of full ownership. Shortly after we apply
changes, AGIC overwrites or deletes them.

We can prohibit AGIC from making changes to a subset of configuration.

1. Create a new YAML file named `AzureIngressProhibitedTarget` with the following snippet:

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: "appgw.ingress.k8s.io/v1"
    kind: AzureIngressProhibitedTarget
    metadata:
      name: manually-configured-staging-environment
    spec:
      hostname: staging.contoso.com
    EOF
    ```

2. View the newly created object:
    ```bash
    kubectl get AzureIngressProhibitedTargets
    ```

3. Modify Application Gateway config from the Azure portal - add listeners, routing rules, backends etc. The new object we created
(`manually-configured-staging-environment`) prohibits AGIC from overwriting Application Gateway configuration related to
`staging.contoso.com`.
