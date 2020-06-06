---
title: Creating an ingress controller with a new Application Gateway 
description: This article provides information on how to deploy an Application Gateway Ingress Controller with a new Application Gateway. 
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 11/4/2019
ms.author: caya
---

# How to Install an Application Gateway Ingress Controller (AGIC) Using a New Application Gateway

The instructions below assume Application Gateway Ingress Controller (AGIC) will be
installed in an environment with no pre-existing components.

## Required Command Line Tools

We recommend the use of [Azure Cloud Shell](https://shell.azure.com/) for all command-line operations below. Launch your shell from shell.azure.com or by clicking the link:

[![Embed launch](https://shell.azure.com/images/launchcloudshell.png "Launch Azure Cloud Shell")](https://shell.azure.com)

Alternatively, launch Cloud Shell from Azure portal using the following icon:

![Portal launch](./media/application-gateway-ingress-controller-install-new/portal-launch-icon.png)

Your [Azure Cloud Shell](https://shell.azure.com/) already has all necessary tools. Should you
choose to use another environment, please ensure the following command-line tools are installed:

* `az` - Azure CLI: [installation instructions](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
* `kubectl` - Kubernetes command-line tool: [installation instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl)
* `helm` - Kubernetes package manager: [installation instructions](https://github.com/helm/helm/releases/latest)
* `jq` - command-line JSON processor: [installation instructions](https://stedolan.github.io/jq/download/)


## Create an Identity

Follow the steps below to create an Azure Active Directory (AAD) [service principal object](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object). Please record the `appId`, `password`, and `objectId` values - these will be used in the following steps.

1. Create AD service principal ([Read more about RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)):
    ```azurecli
    az ad sp create-for-rbac --skip-assignment -o json > auth.json
    appId=$(jq -r ".appId" auth.json)
    password=$(jq -r ".password" auth.json)
    ```
    The `appId` and `password` values from the JSON output will be used in the following steps


1. Use the `appId` from the previous command's output to get the `objectId` of the new service principal:
    ```azurecli
    objectId=$(az ad sp show --id $appId --query "objectId" -o tsv)
    ```
    The output of this command is `objectId`, which will be used in the Azure Resource Manager template below

1. Create the parameter file that will be used in the Azure Resource Manager template deployment later.
    ```bash
    cat <<EOF > parameters.json
    {
      "aksServicePrincipalAppId": { "value": "$appId" },
      "aksServicePrincipalClientSecret": { "value": "$password" },
      "aksServicePrincipalObjectId": { "value": "$objectId" },
      "aksEnableRBAC": { "value": false }
    }
    EOF
    ```
    To deploy an **RBAC** enabled cluster, set the `aksEnableRBAC` field to `true`

## Deploy Components
This step will add the following components to your subscription:

- [Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/intro-kubernetes)
- [Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview) v2
- [Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) with 2 [subnets](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview)
- [Public IP Address](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address)
- [Managed Identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview), which will be used by [AAD Pod Identity](https://github.com/Azure/aad-pod-identity/blob/master/README.md)

1. Download the Azure Resource Manager template and modify the template as needed.
    ```bash
    wget https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/deploy/azuredeploy.json -O template.json
    ```

1. Deploy the Azure Resource Manager template using `az cli`. This may take up to 5 minutes.
    ```azurecli
    resourceGroupName="MyResourceGroup"
    location="westus2"
    deploymentName="ingress-appgw"

    # create a resource group
    az group create -n $resourceGroupName -l $location

    # modify the template as needed
    az group deployment create \
            -g $resourceGroupName \
            -n $deploymentName \
            --template-file template.json \
            --parameters parameters.json
    ```

1. Once the deployment finished, download the deployment output into a file named `deployment-outputs.json`.
    ```azurecli
    az group deployment show -g $resourceGroupName -n $deploymentName --query "properties.outputs" -o json > deployment-outputs.json
    ```

## Set up Application Gateway Ingress Controller

With the instructions in the previous section, we created and configured a new AKS cluster and
an Application Gateway. We are now ready to deploy a sample app and an ingress controller to our new
Kubernetes infrastructure.

### Setup Kubernetes Credentials
For the following steps, we need setup [kubectl](https://kubectl.docs.kubernetes.io/) command,
which we will use to connect to our new Kubernetes cluster. [Cloud Shell](https://shell.azure.com/) has `kubectl` already installed. We will use `az` CLI to obtain credentials for Kubernetes.

Get credentials for your newly deployed AKS ([read more](https://docs.microsoft.com/azure/aks/kubernetes-walkthrough#connect-to-the-cluster)):
```azurecli
# use the deployment-outputs.json created after deployment to get the cluster name and resource group name
aksClusterName=$(jq -r ".aksClusterName.value" deployment-outputs.json)
resourceGroupName=$(jq -r ".resourceGroupName.value" deployment-outputs.json)

az aks get-credentials --resource-group $resourceGroupName --name $aksClusterName
```

### Install AAD Pod Identity
  Azure Active Directory Pod Identity provides token-based access to
  [Azure Resource Manager (ARM)](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).

  [AAD Pod Identity](https://github.com/Azure/aad-pod-identity) will add the following components to your Kubernetes cluster:
   * Kubernetes [CRDs](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/): `AzureIdentity`, `AzureAssignedIdentity`, `AzureIdentityBinding`
   * [Managed Identity Controller (MIC)](https://github.com/Azure/aad-pod-identity#managed-identity-controllermic) component
   * [Node Managed Identity (NMI)](https://github.com/Azure/aad-pod-identity#node-managed-identitynmi) component


To install AAD Pod Identity to your cluster:

   - *RBAC enabled* AKS cluster

     ```bash
     kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment-rbac.yaml
     ```

   - *RBAC disabled* AKS cluster

     ```bash
     kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment.yaml
     ```

### Install Helm
[Helm](https://docs.microsoft.com/azure/aks/kubernetes-helm) is a package manager for
Kubernetes. We will leverage it to install the `application-gateway-kubernetes-ingress` package:

1. Install [Helm](https://docs.microsoft.com/azure/aks/kubernetes-helm) and run the following to add `application-gateway-kubernetes-ingress` helm package:

    - *RBAC enabled* AKS cluster

        ```bash
        kubectl create serviceaccount --namespace kube-system tiller-sa
        kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller-sa
        helm init --tiller-namespace kube-system --service-account tiller-sa
        ```

    - *RBAC disabled* AKS cluster

        ```bash
        helm init
        ```

1. Add the AGIC Helm repository:
    ```bash
    helm repo add application-gateway-kubernetes-ingress https://appgwingress.blob.core.windows.net/ingress-azure-helm-package/
    helm repo update
    ```

### Install Ingress Controller Helm Chart

1. Use the `deployment-outputs.json` file created above and create the following variables.
    ```bash
    applicationGatewayName=$(jq -r ".applicationGatewayName.value" deployment-outputs.json)
    resourceGroupName=$(jq -r ".resourceGroupName.value" deployment-outputs.json)
    subscriptionId=$(jq -r ".subscriptionId.value" deployment-outputs.json)
    identityClientId=$(jq -r ".identityClientId.value" deployment-outputs.json)
    identityResourceId=$(jq -r ".identityResourceId.value" deployment-outputs.json)
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
    #    secretJSON: <<Generate this value with: "az ad sp create-for-rbac --subscription <subscription-uuid> --sdk-auth | base64 -w0" >>
    
    ################################################################################
    # Specify if the cluster is RBAC enabled or not
    rbac:
        enabled: false # true/false
    
    # Specify aks cluster related information. THIS IS BEING DEPRECATED.
    aksClusterConfiguration:
        apiServerAddress: <aks-api-server-address>
    ```

1. Edit the newly downloaded helm-config.yaml and fill out the sections `appgw` and `armAuth`.
    ```bash
    sed -i "s|<subscriptionId>|${subscriptionId}|g" helm-config.yaml
    sed -i "s|<resourceGroupName>|${resourceGroupName}|g" helm-config.yaml
    sed -i "s|<applicationGatewayName>|${applicationGatewayName}|g" helm-config.yaml
    sed -i "s|<identityResourceId>|${identityResourceId}|g" helm-config.yaml
    sed -i "s|<identityClientId>|${identityClientId}|g" helm-config.yaml

    # You can further modify the helm config to enable/disable features
    nano helm-config.yaml
    ```

   Values:
     - `verbosityLevel`: Sets the verbosity level of the AGIC logging infrastructure. See [Logging Levels](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/463a87213bbc3106af6fce0f4023477216d2ad78/docs/troubleshooting.md#logging-levels) for possible values.
     - `appgw.subscriptionId`: The Azure Subscription ID in which Application Gateway resides. Example: `a123b234-a3b4-557d-b2df-a0bc12de1234`
     - `appgw.resourceGroup`: Name of the Azure Resource Group in which Application Gateway was created. Example: `app-gw-resource-group`
     - `appgw.name`: Name of the Application Gateway. Example: `applicationgatewayd0f0`
     - `appgw.shared`: This boolean flag should be defaulted to `false`. Set to `true` should you need a [Shared Application Gateway](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/072626cb4e37f7b7a1b0c4578c38d1eadc3e8701/docs/setup/install-existing.md#multi-cluster--shared-app-gateway).
     - `kubernetes.watchNamespace`: Specify the name space, which AGIC should watch. This could be a single string value, or a comma-separated list of namespaces.
    - `armAuth.type`: could be `aadPodIdentity` or `servicePrincipal`
    - `armAuth.identityResourceID`: Resource ID of the Azure Managed Identity
    - `armAuth.identityClientId`: The Client ID of the Identity. See below for more information on Identity
    - `armAuth.secretJSON`: Only needed when Service Principal Secret type is chosen (when `armAuth.type` has been set to `servicePrincipal`) 


   > [!NOTE]
   > The `identityResourceID` and `identityClientID` are values that were created
   during the [Deploy Components](ingress-controller-install-new.md#deploy-components)
   steps, and could be obtained again using the following command:
   > ```azurecli
   > az identity show -g <resource-group> -n <identity-name>
   > ```
   > `<resource-group>` in the command above is the resource group of your Application Gateway. `<identity-name>` is the name of the created identity. All identities for a given subscription can be listed using: `az identity list`


1. Install the Application Gateway ingress controller package:

    ```bash
    helm install -f helm-config.yaml application-gateway-kubernetes-ingress/ingress-azure
    ```

## Install a Sample App
Now that we have Application Gateway, AKS, and AGIC installed we can install a sample app
via [Azure Cloud Shell](https://shell.azure.com/):

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: aspnetapp
  labels:
    app: aspnetapp
spec:
  containers:
  - image: "mcr.microsoft.com/dotnet/core/samples:aspnetapp"
    name: aspnetapp-image
    ports:
    - containerPort: 80
      protocol: TCP

---

apiVersion: v1
kind: Service
metadata:
  name: aspnetapp
spec:
  selector:
    app: aspnetapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80

---

apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: aspnetapp
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
spec:
  rules:
  - http:
      paths:
      - path: /
        backend:
          serviceName: aspnetapp
          servicePort: 80
EOF
```

Alternatively you can:

* Download the YAML file above:

```bash
curl https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/aspnetapp.yaml -o aspnetapp.yaml
```

* Apply the YAML file:

```bash
kubectl apply -f aspnetapp.yaml
```


## Other Examples
This [how-to guide](ingress-controller-expose-service-over-http-https.md) contains more examples on how to expose an AKS
service via HTTP or HTTPS, to the Internet with Application Gateway.
