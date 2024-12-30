---
title: Create an ingress controller by using a new Application Gateway deployment
description: This article provides information on how to deploy the Application Gateway Ingress Controller by using a new Application Gateway deployment.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 10/15/2024
ms.author: greglin
---

# Install AGIC by using a new Application Gateway deployment

The instructions in this article assume that you want to install the Application Gateway Ingress Controller (AGIC) in an environment that has no preexisting components.

> [!TIP]
> Consider [Application Gateway for Containers](for-containers/overview.md) for your Kubernetes ingress solution. For more information, see [Quickstart: Deploy Application Gateway for Containers ALB Controller](for-containers/quickstart-deploy-application-gateway-for-containers-alb-controller.md).

## Install required command-line tools

We recommend the use of [Azure Cloud Shell](https://shell.azure.com/) for all the command-line operations in this article. You can open Cloud Shell by selecting the **Launch Cloud Shell** button.

:::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to open Azure Cloud Shell." border="false" link="https://shell.azure.com":::

Alternatively, open Cloud Shell from the Azure portal by selecting its icon.

![Azure PowerShell icon in the portal](./media/application-gateway-ingress-controller-install-new/portal-launch-icon.png)

Your Cloud Shell instance already has all necessary tools. If you choose to use another environment, ensure that the following command-line tools are installed:

- `az`: Azure CLI ([installation instructions](/cli/azure/install-azure-cli))
- `kubectl`: Kubernetes command-line tool ([installation instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl))
- `helm`: Kubernetes package manager ([installation instructions](https://github.com/helm/helm/releases/latest))
- `jq`: Command-line JSON processor ([installation instructions](https://stedolan.github.io/jq/download/))

## Create an identity

Use the following steps to create a Microsoft Entra [service principal object](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object).

1. Create an Active Directory service principal, which includes an [Azure role-based access control (RBAC)](../role-based-access-control/overview.md) role:

    ```azurecli
    az ad sp create-for-rbac --role Contributor --scopes /subscriptions/mySubscriptionID -o json > auth.json
    appId=$(jq -r ".appId" auth.json)
    password=$(jq -r ".password" auth.json)
    ```

    Record the `appId` and `password` values from the JSON output. You'll use them in the next steps.

1. Use the `appId` value from the previous command's output to get the `id` of the new service principal:

    ```azurecli
    objectId=$(az ad sp show --id $appId --query "id" -o tsv)
    ```

    The output of this command is `objectId`. Record this value, because you'll use it in the next step.

1. Create the parameter file that you'll use in the Azure Resource Manager template (ARM template) deployment:

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

    To deploy a Kubernetes RBAC-enabled cluster, set `aksEnableRBAC` to `true`.

## Deploy components

The following procedure adds these components to your subscription:

- [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes)
- [Azure Application Gateway](./overview.md) v2
- [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) with two [subnets](../virtual-network/virtual-networks-overview.md)
- [Public IP address](../virtual-network/ip-services/virtual-network-public-ip-address.md)
- [Managed identity](../active-directory/managed-identities-azure-resources/overview.md), which [Microsoft Entra Pod Identity](https://github.com/Azure/aad-pod-identity/blob/master/README.md) will use.

To deploy the components:

1. Download the ARM template:

    ```bash
    wget https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/deploy/azuredeploy.json -O template.json
    ```

1. Deploy the ARM template by using the Azure CLI, and modify it as needed. The deployment might take up to 5 minutes.

    ```azurecli
    resourceGroupName="MyResourceGroup"
    location="westus2"
    deploymentName="ingress-appgw"

    # create a resource group
    az group create -n $resourceGroupName -l $location

    # modify the template as needed
    az deployment group create \
            -g $resourceGroupName \
            -n $deploymentName \
            --template-file template.json \
            --parameters parameters.json
    ```

1. After the deployment finishes, download the deployment output into a file named `deployment-outputs.json`:

    ```azurecli
    az deployment group show -g $resourceGroupName -n $deploymentName --query "properties.outputs" -o json > deployment-outputs.json
    ```

## Set up AGIC

With the instructions in the previous section, you created and configured a new AKS cluster and an Application Gateway deployment. You're now ready to deploy a sample app and an ingress controller to your new Kubernetes infrastructure.

### Set up Kubernetes credentials

For the following steps, you need to set up the [kubectl](https://kubectl.docs.kubernetes.io/) command, which you'll use to connect to your new Kubernetes cluster. [Cloud Shell](https://shell.azure.com/) has `kubectl` already installed. You'll use `az` (Azure CLI) to obtain credentials for Kubernetes.

Get credentials for your newly deployed AKS instance. For more information about the following commands, see [Use Azure RBAC for Kubernetes authorization with kubectl](/azure/aks/manage-azure-rbac#use-azure-rbac-for-kubernetes-authorization-with-kubectl).

```azurecli
# use the deployment-outputs.json file created after deployment to get the cluster name and resource group name
aksClusterName=$(jq -r ".aksClusterName.value" deployment-outputs.json)
resourceGroupName=$(jq -r ".resourceGroupName.value" deployment-outputs.json)

az aks get-credentials --resource-group $resourceGroupName --name $aksClusterName
```

<a name='install-azure-ad-pod-identity'></a>

### Install Microsoft Entra Pod Identity

[Microsoft Entra Pod Identity](https://github.com/Azure/aad-pod-identity) provides token-based access to [Azure Resource Manager](../azure-resource-manager/management/overview.md).

Microsoft Entra Pod Identity adds the following components to your Kubernetes cluster:

- Kubernetes [custom resource definitions (CRDs)](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/): `AzureIdentity`, `AzureAssignedIdentity`, `AzureIdentityBinding`
- [Managed Identity Controller (MIC)](https://github.com/Azure/aad-pod-identity#managed-identity-controllermic) component
- [Node Managed Identity (NMI)](https://github.com/Azure/aad-pod-identity#node-managed-identitynmi) component

To install Microsoft Entra Pod Identity to your cluster, use one of the following commands:

- Kubernetes RBAC-enabled AKS cluster:

  ```bash
  kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment-rbac.yaml
  ```

- Kubernetes RBAC-disabled AKS cluster:

  ```bash
  kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment.yaml
  ```

### Add the Helm repository

[Helm](/azure/aks/kubernetes-helm) is a package manager for Kubernetes. You use it to install the `application-gateway-kubernetes-ingress` package.

If you use [Cloud Shell](https://shell.azure.com/), you don't need to install Helm. Cloud Shell comes with Helm version 3. Run one of the following commands to add the AGIC Helm repository:

- Kubernetes RBAC-enabled AKS cluster:

  ```bash
  kubectl create serviceaccount --namespace kube-system tiller-sa
  kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller-sa
  helm init --tiller-namespace kube-system --service-account tiller-sa
  ```

- Kubernetes RBAC-disabled AKS cluster:

  ```bash
  helm init
  ```

### Install the ingress controller's Helm chart

1. Use the `deployment-outputs.json` file that you created earlier to create the following variables:

    ```bash
    applicationGatewayName=$(jq -r ".applicationGatewayName.value" deployment-outputs.json)
    resourceGroupName=$(jq -r ".resourceGroupName.value" deployment-outputs.json)
    subscriptionId=$(jq -r ".subscriptionId.value" deployment-outputs.json)
    identityClientId=$(jq -r ".identityClientId.value" deployment-outputs.json)
    identityResourceId=$(jq -r ".identityResourceId.value" deployment-outputs.json)
    ```

1. Download `helm-config.yaml`, which configures AGIC:

    ```bash
    wget https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/sample-helm-config.yaml -O helm-config.yaml
    ```

    Or copy the following YAML file:

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
    # result in Ingress Controller observing all accessible namespaces.
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
    #    secretJSON: <<Generate this value with: "az ad sp create-for-rbac --subscription <subscription-uuid> --role Contributor --sdk-auth | base64 -w0" >>

    ################################################################################
    # Specify if the cluster is Kubernetes RBAC enabled or not
    rbac:
        enabled: false # true/false

    # Specify aks cluster related information. THIS IS BEING DEPRECATED.
    aksClusterConfiguration:
        apiServerAddress: <aks-api-server-address>
    ```

1. Edit the newly downloaded `helm-config.yaml` file and fill out the sections for `appgw` and `armAuth`:

    ```bash
    sed -i "s|<subscriptionId>|${subscriptionId}|g" helm-config.yaml
    sed -i "s|<resourceGroupName>|${resourceGroupName}|g" helm-config.yaml
    sed -i "s|<applicationGatewayName>|${applicationGatewayName}|g" helm-config.yaml
    sed -i "s|<identityResourceId>|${identityResourceId}|g" helm-config.yaml
    sed -i "s|<identityClientId>|${identityClientId}|g" helm-config.yaml
    ```

   > [!NOTE]
   > If you're deploying to a sovereign cloud (for example, Azure Government), you must add the `appgw.environment` configuration parameter and set it to the appropriate value.

   Here are the values:

   - `verbosityLevel`: Sets the verbosity level of the AGIC logging infrastructure. For possible values, see [Logging levels](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/463a87213bbc3106af6fce0f4023477216d2ad78/docs/troubleshooting.md#logging-levels).
   - `appgw.environment`: Sets the cloud environment. Possible values: `AZURECHINACLOUD`, `AZUREGERMANCLOUD`, `AZUREPUBLICCLOUD`, `AZUREUSGOVERNMENTCLOUD`.
   - `appgw.subscriptionId`: The Azure subscription ID in which Application Gateway resides. Example: `aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e`.
   - `appgw.resourceGroup`: Name of the Azure resource group in which you created the Application Gateway deployment. Example: `app-gw-resource-group`.
   - `appgw.name`: Name of the Application Gateway deployment. Example: `applicationgatewayd0f0`.
   - `appgw.shared`: Boolean flag that defaults to `false`. Set it to `true` if you need a [shared Application Gateway deployment](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/072626cb4e37f7b7a1b0c4578c38d1eadc3e8701/docs/setup/install-existing.md#multi-cluster--shared-app-gateway).
   - `kubernetes.watchNamespace`: Specifies the namespace that AGIC should watch. The namespace value can be a single string value or a comma-separated list of namespaces.
   - `armAuth.type`: Could be `aadPodIdentity` or `servicePrincipal`.
   - `armAuth.identityResourceID`: Resource ID of the Azure managed identity.
   - `armAuth.identityClientID`: Client ID of the identity.
   - `armAuth.secretJSON`: Needed only when you choose a service principal as the secret type (that is, when you set `armAuth.type` to `servicePrincipal`).

   > [!NOTE]
   > You created the `identityResourceID` and `identityClientID` values during the earlier steps for [deploying components](ingress-controller-install-new.md#deploy-components). You can obtain them again by using the following command:
   >
   > ```azurecli
   > az identity show -g <resource-group> -n <identity-name>
   > ```
   >
   > In the command, `<resource-group>` is the resource group of your Application Gateway deployment. The `<identity-name>` placeholder is the name of the created identity. You can list all identities for a particular subscription by using `az identity list`.

1. Install the AGIC package:

    ```bash
    helm install agic-controller oci://mcr.microsoft.com/azure-application-gateway/charts/ingress-azure --version 1.7.5 -f helm-config.yaml
    ```

## Install a sample app

Now that you have Application Gateway, AKS, and AGIC installed, you can install a sample app via [Azure Cloud Shell](https://shell.azure.com/):

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
  - image: "mcr.microsoft.com/dotnet/samples:aspnetapp"
    name: aspnetapp-image
    ports:
    - containerPort: 8080
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
    targetPort: 8080

---

apiVersion: networking.k8s.io/v1
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
        pathType: Exact
        backend:
          service:
            name: aspnetapp
            port:
              number: 80
        pathType: Exact
EOF
```

Alternatively, you can:

- Download the preceding YAML file:

  ```bash
  curl https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/aspnetapp.yaml -o aspnetapp.yaml
  ```

- Apply the YAML file:

  ```bash
  kubectl apply -f aspnetapp.yaml
  ```

## Related content

- For more examples on how to expose an AKS service to the internet via HTTP or HTTPS by using Application Gateway, see [this how-to guide](ingress-controller-expose-service-over-http-https.md).
- For information about Application Gateway for Containers, see [this overview article](for-containers/overview.md).
