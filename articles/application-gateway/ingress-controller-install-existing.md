---
title: Create an ingress controller with an existing Application Gateway 
description: This article provides information on how to deploy an Application Gateway Ingress Controller with an existing Application Gateway. 
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 11/4/2019
ms.author: greglin
---

# Install an Application Gateway Ingress Controller (AGIC) using an existing Application Gateway

The Application Gateway Ingress Controller (AGIC) is a pod within your Kubernetes cluster.
AGIC monitors the Kubernetes [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
resources, and creates and applies Application Gateway config based on the status of the Kubernetes cluster.

## Outline:
- [Prerequisites](#prerequisites)
- [Azure Resource Manager Authentication (ARM)](#azure-resource-manager-authentication)
    - Option 1: [Set up aad-pod-identity](#set-up-aad-pod-identity) and create Azure Identity on ARMs
    - Option 2: [Using a Service Principal](#using-a-service-principal)
- [Install Ingress Controller using Helm](#install-ingress-controller-as-a-helm-chart)
- [Multi-cluster / Shared Application Gateway](#multi-cluster--shared-application-gateway): Install AGIC in an environment, where Application Gateway is
shared between one or more AKS clusters and/or other Azure components.

## Prerequisites
This document assumes you already have the following tools and infrastructure installed:
- [AKS](https://azure.microsoft.com/services/kubernetes-service/) with [Azure Container Networking Interface (CNI)](../aks/configure-azure-cni.md)
- [Application Gateway v2](./tutorial-autoscale-ps.md) in the same virtual network as AKS
- [AAD Pod Identity](https://github.com/Azure/aad-pod-identity) installed on your AKS cluster
- [Cloud Shell](https://shell.azure.com/) is the Azure shell environment, which has `az` CLI, `kubectl`, and `helm` installed. These tools are required for the commands below.

Please __backup your Application Gateway's configuration__ before installing AGIC:
  1. using [Azure portal](https://portal.azure.com/) navigate to your `Application Gateway` instance
  2. from `Export template` click `Download`

The zip file you downloaded will have JSON templates, bash, and PowerShell scripts you could use to restore App
Gateway should that become necessary

## Install Helm
[Helm](../aks/kubernetes-helm.md) is a package manager for
Kubernetes. We will leverage it to install the `application-gateway-kubernetes-ingress` package.
Use [Cloud Shell](https://shell.azure.com/) to install Helm:

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

1. Add the AGIC Helm repository:
    ```bash
    helm repo add application-gateway-kubernetes-ingress https://appgwingress.blob.core.windows.net/ingress-azure-helm-package/
    helm repo update
    ```

## Azure Resource Manager Authentication

AGIC communicates with the Kubernetes API server and the Azure Resource Manager. It requires an identity to access
these APIs.

## Set up AAD Pod Identity

[AAD Pod Identity](https://github.com/Azure/aad-pod-identity) is a controller, similar to AGIC, which also runs on your
AKS. It binds Azure Active Directory identities to your Kubernetes pods. Identity is required for an application in a
Kubernetes pod to be able to communicate with other Azure components. In the particular case here, we need authorization
for the AGIC pod to make HTTP requests to [ARM](../azure-resource-manager/management/overview.md).

Follow the [AAD Pod Identity installation instructions](https://github.com/Azure/aad-pod-identity#deploy-the-azure-aad-identity-infra) to add this component to your AKS.

Next we need to create an Azure identity and give it permissions ARM.
Use [Cloud Shell](https://shell.azure.com/) to run all of the following commands and create an identity:

1. Create an Azure identity **in the same resource group as the AKS nodes**. Picking the correct resource group is
important. The resource group required in the command below is *not* the one referenced on the AKS portal pane. This is
the resource group of the `aks-agentpool` virtual machines. Typically that resource group starts with `MC_` and contains
 the name of your AKS. For instance: `MC_resourceGroup_aksABCD_westus`

    ```azurecli
    az identity create -g <agent-pool-resource-group> -n <identity-name>
    ```

1. For the role assignment commands below we need to obtain `principalId` for the newly created identity:

    ```azurecli
    az identity show -g <resourcegroup> -n <identity-name>
    ```

1. Give the identity `Contributor` access to your Application Gateway. For this you need the ID of the Application Gateway, which will
look something like this: `/subscriptions/A/resourceGroups/B/providers/Microsoft.Network/applicationGateways/C`

    Get the list of Application Gateway IDs in your subscription with: `az network application-gateway list --query '[].id'`

    ```azurecli
    az role assignment create \
        --role Contributor \
        --assignee <principalId> \
        --scope <App-Gateway-ID>
    ```

1. Give the identity `Reader` access to the Application Gateway resource group. The resource group ID would look like:
`/subscriptions/A/resourceGroups/B`. You can get all resource groups with: `az group list --query '[].id'`

    ```azurecli
    az role assignment create \
        --role Reader \
        --assignee <principalId> \
        --scope <App-Gateway-Resource-Group-ID>
    ```

## Using a Service Principal
It is also possible to provide AGIC access to ARM via a Kubernetes secret.

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

1. Download helm-config.yaml, which will configure AGIC:
    ```bash
    wget https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/sample-helm-config.yaml -O helm-config.yaml
    ```
    Or copy the YAML file below: 
    
    ```yaml
    # This file contains the essential configs for the ingress controller helm chart

    # Verbosity level of the App Gateway Ingress Controller
    verbosityLevel: 3
    
    ################################################################################
    # Specify which application gateway the ingress controller will manage
    #
    appgw:
        subscriptionId: <subscriptionId>
        resourceGroup: <resourceGroupName>
        name: <applicationGatewayName>
    
        # Setting appgw.shared to "true" will create an AzureIngressProhibitedTarget CRD.
        # This prohibits AGIC from applying config for any host/path.
        # Use "kubectl get AzureIngressProhibitedTargets" to view and change this.
        shared: false
    
    ################################################################################
    # Specify which kubernetes namespace the ingress controller will watch
    # Default value is "default"
    # Leaving this variable out or setting it to blank or empty string would
    # result in Ingress Controller observing all acessible namespaces.
    #
    # kubernetes:
    #   watchNamespace: <namespace>
    
    ################################################################################
    # Specify the authentication with Azure Resource Manager
    #
    # Two authentication methods are available:
    # - Option 1: AAD-Pod-Identity (https://github.com/Azure/aad-pod-identity)
    armAuth:
        type: aadPodIdentity
        identityResourceID: <identityResourceId>
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
    > The `<identity-resource-id>` and `<identity-client-id>` are the properties of the Azure AD Identity you setup in the previous section. You can retrieve this information by running the following command: `az identity show -g <resourcegroup> -n <identity-name>`, where `<resourcegroup>` is the resource group in which the top level AKS cluster object, Application Gateway and Managed Identify are deployed.

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



## Multi-cluster / Shared Application Gateway
By default AGIC assumes full ownership of the Application Gateway it is linked to. AGIC version 0.8.0 and later can
share a single Application Gateway with other Azure components. For instance, we could use the same Application Gateway for an app
hosted on Virtual Machine Scale Set as well as an AKS cluster.

Please __backup your Application Gateway's configuration__ before enabling this setting:
  1. using [Azure portal](https://portal.azure.com/) navigate to your `Application Gateway` instance
  2. from `Export template` click `Download`

The zip file you downloaded will have JSON templates, bash, and PowerShell scripts you could use to restore Application Gateway

### Example Scenario
Let's look at an imaginary Application Gateway, which manages traffic for two web sites:
  - `dev.contoso.com` - hosted on a new AKS, using Application Gateway and AGIC
  - `prod.contoso.com` - hosted on an [Azure Virtual Machine Scale Set](https://azure.microsoft.com/services/virtual-machine-scale-sets/)

With default settings, AGIC assumes 100% ownership of the Application Gateway it is pointed to. AGIC overwrites all of App
Gateway's configuration. If we were to manually create a listener for `prod.contoso.com` (on Application Gateway), without
defining it in the Kubernetes Ingress, AGIC will delete the `prod.contoso.com` config within seconds.

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
To limit AGIC (version 0.8.0 and later) to a subset of the Application Gateway configuration modify the `helm-config.yaml` template.
Under the `appgw:` section, add `shared` key and set it to to `true`.

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

As a result your AKS will have a new instance of `AzureIngressProhibitedTarget` called `prohibit-all-targets`:
```bash
kubectl get AzureIngressProhibitedTargets prohibit-all-targets -o yaml
```

The object `prohibit-all-targets`, as the name implies, prohibits AGIC from changing config for *any* host and path.
Helm install with `appgw.shared=true` will deploy AGIC, but won't make any changes to Application Gateway.


### Broaden permissions
Since Helm with `appgw.shared=true` and the default `prohibit-all-targets` blocks AGIC from applying any config.

Broaden AGIC permissions with:
1. Create a new `AzureIngressProhibitedTarget` with your specific setup:
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
Let's assume that we already have a working AKS, Application Gateway, and configured AGIC in our cluster. We have an Ingress for
`prod.contoso.com` and are successfully serving traffic for it from AKS. We want to add `staging.contoso.com` to our
existing Application Gateway, but need to host it on a [VM](https://azure.microsoft.com/services/virtual-machines/). We
are going to reuse the existing Application Gateway and manually configure a listener and backend pools for
`staging.contoso.com`. But manually tweaking Application Gateway config (via
[portal](https://portal.azure.com), [ARM APIs](/rest/api/resources/) or
[Terraform](https://www.terraform.io/)) would conflict with AGIC's assumptions of full ownership. Shortly after we apply
changes, AGIC will overwrite or delete them.

We can prohibit AGIC from making changes to a subset of configuration.

1. Create an `AzureIngressProhibitedTarget` object:
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

3. Modify Application Gateway config via portal - add listeners, routing rules, backends etc. The new object we created
(`manually-configured-staging-environment`) will prohibit AGIC from overwriting Application Gateway configuration related to
`staging.contoso.com`.
