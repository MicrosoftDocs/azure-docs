# Preview - Greenfield Deployment (Windows Cluster)

The instructions below assume Application Gateway Ingress Controller (AGIC) will be
installed in an environment with no pre-existing components.

### Required Command Line Tools

We recommend the use of [Azure Cloud Shell](https://shell.azure.com/) for all command line operations below. Launch your shell from shell.azure.com or by clicking the link:

[![Embed launch](https://shell.azure.com/images/launchcloudshell.png "Launch Azure Cloud Shell")](https://shell.azure.com)

Alternatively, launch Cloud Shell from Azure portal using the following icon:

![Portal launch](../portal-launch-icon.png)

Your [Azure Cloud Shell](https://shell.azure.com/) already has all necessary tools. Should you
choose to use another environment, please ensure the following command line tools are installed:

1. `az` - Azure CLI: [installation instructions](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
1. `kubectl` - Kubernetes command-line tool: [installation instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl)
1. `helm` - Kubernetes package manager: [installation instructions](https://github.com/helm/helm/releases/latest)
1. `jq` - command-line JSON processor: [installation instructions](https://stedolan.github.io/jq/download/)

### Enable you Subscription to support preview features for Kubernetes

Here are the steps to instal aks-preview CLI and register Windows preview feature.

> [!IMPORTANT]
> AKS preview features are self-service opt-in. Previews are provided "as-is" and "as available" and are excluded from the service level agreements and limited warranty. AKS Previews are partially covered by customer support on best effort basis. As such, these features are not meant for production use. For additional infromation, please see the following support articles:
>
> * [AKS Support Policies][aks-support-policies]
> * [Azure Support FAQ][aks-faq]

#### Install aks-preview CLI extension

To use Windows Server containers, you need the *aks-preview* CLI extension version 0.4.12 or higher. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, then check for any available updates using the [az extension update][az-extension-update] command::

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

#### Register Windows preview feature

To create an AKS cluster that can use multiple node pools and run Windows Server containers, first enable the *WindowsPreview* feature flags on your subscription. The *WindowsPreview* feature also uses multi-node pool clusters and virtual machine scale set to manage the deployment and configuration of the Kubernetes nodes. Register the  *WindowsPreview* feature flag using the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --name WindowsPreview --namespace Microsoft.ContainerService
```

> [!NOTE]
> Any AKS cluster you create after you've successfully registered the *WindowsPreview* feature flag use this preview cluster experience. To continue to create regular, fully-supported clusters, don't enable preview features on production subscriptions. Use a separate test or development Azure subscription for testing preview features.

It takes a few minutes for the registration to complete. Check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/WindowsPreview')].{Name:name,State:properties.state}"
```

When the registration state is `Registered`, press Ctrl-C to stop monitoring the state.  Then refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

#### Limitations

The following limitations apply when you create and manage AKS clusters that support multiple node pools:

* You can't delete the first node pool.

While this feature is in preview, the following additional limitations apply:

* The AKS cluster can have a maximum of eight node pools.
* The AKS cluster can have a maximum of 400 nodes across those eight node pools.
* The Windows Server node pool name has a limit of 6 characters.

### Create an Identity

Follow the steps below to create an Azure Active Directory (AAD) [service principal object](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object). Please record the `appId`, `password`, and `objectId` values - these will be used in the following steps.

1. Create AD service principal ([Read more about RBAC](https://docs.microsoft.com/en-us/azure/role-based-access-control/overview)). Paste the following lines in your [Azure Cloud Shell](https://shell.azure.com/):
    ```bash
    az ad sp create-for-rbac --skip-assignment -o json > auth.json
    appId=$(jq -r ".appId" auth.json)
    password=$(jq -r ".password" auth.json)
    ```
        These commands will create `appId` and `password` bash variables, which will be used in the steps below. You can view the value of these with `echo $appId` and `echo $password`.


1. Execute the next command in [Cloud Shell](https://shell.azure.com/) to create the `objectId` bash variable, which is the new Service Princpial:
    ```bash
    objectId=$(az ad sp show --id $appId --query "objectId" -o tsv)
    ```
    The `objectId` bash variable will be used in the ARM template below. View the value with `echo $objectId`.

1. Paste the entire command below (it is a single command on multiple lines) in [Cloud Shell](https://shell.azure.com/) to create the parameters.json file. It will be used in the ARM template deployment.
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
    To deploy an **RBAC** enabled cluster, set the `aksEnabledRBAC` field to `true`. View the contents of the newly created file with `cat parameters.json`. It will contain the values of the `appId`, `password`, and `objectId` bash variables from the previous steps.

### Deploy Components
The next few steps will add the following list of components to your Azure subscription:

- [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes)
- [Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/overview) v2
- [Virtual Network](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview) with 2 [subnets](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)
- [Public IP Address](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-public-ip-address)
- [Managed Identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview), which will be used by [AAD Pod Identity](https://github.com/Azure/aad-pod-identity/blob/master/README.md)

1. Download the ARM template into template.json file. Paste the following in your [shell](https://shell.azure.com/):
    ```bash
    wget https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/deploy/azuredeploywindowscluster.json -O template.json
    ```

1. Deploy the ARM template via [Azure Cloud Shell](https://shell.azure.com/) and the `az` tool. Modify the name of the resource group and region/location, then paste each of the following lines into your [shell](https://shell.azure.com/):
    ```bash
    resourceGroupName="MyResourceGroup"

    location="westus2"

    deploymentName="ingress-appgw"

    az group create -n $resourceGroupName -l $location

    az group deployment create -g $resourceGroupName -n $deploymentName --template-file template.json --parameters parameters.json
    ```
    Note: The last command may take a few minutes to complete.

1. Once the deployment finished, download the deployment output into a file named `deployment-outputs.json`.
    ```bash
    az group deployment show -g $resourceGroupName -n $deploymentName --query "properties.outputs" -o json > deployment-outputs.json
    ```
    View the content of the newly created file with: `cat deployment-outputs.json`. The file will have the following shape (example):
    ```json
    {
      "aksApiServerAddress": {
        "type": "String",
        "value": "aks-abcd41e9.hcp.westus2.azmk8s.io"
      },
      "aksClusterName": {
        "type": "String",
        "value": "aksabcd"
      },
      "applicationGatewayName": {
        "type": "String",
        "value": "applicationgatewayabcd"
      },
      "identityClientId": {
        "type": "String",
        "value": "7b1a3378-8abe-ab58-cca9-a8ef624db293"
      },
      "identityResourceId": {
        "type": "String",
        "value": "/subscriptions/a6466a81-bf0d-147e-2acb-a0ba50f6456e/resourceGroups/MyResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/appgwContrIdentityabcd"
      },
      "resourceGroupName": {
        "type": "String",
        "value": "MyResourceGroup"
      },
      "subscriptionId": {
        "type": "String",
        "value": "a6466a81-bf0d-147e-2acb-a0ba50f6456e"
      }
    }
    ```

## Set up Application Gateway Ingress Controller

With the instructions in the previous section we created and configured a new AKS cluster and
an App Gateway. We are now ready to deploy a sample app and an ingress controller to our new
Kubernetes infrastructure.

### Setup Kubernetes Credentials
For the following steps we need setup [kubectl](https://kubectl.docs.kubernetes.io/) command,
which we will use to connect to our new Kubernetes cluster. [Cloud Shell](https://shell.azure.com/) has `kubectl` already installed. We will use `az` CLI to obtain credentials for Kubernetes.

Get credentials for your newly deployed AKS ([read more](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough#connect-to-the-cluster)):
```bash
# use the deployment-outputs.json created after deployment to get the cluster name and resource group name
aksClusterName=$(jq -r ".aksClusterName.value" deployment-outputs.json)
resourceGroupName=$(jq -r ".resourceGroupName.value" deployment-outputs.json)

az aks get-credentials --resource-group $resourceGroupName --name $aksClusterName
```

### Install AAD Pod Identity
  Azure Active Directory Pod Identity provides token-based access to
  [Azure Resource Manager (ARM)](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview).

  [AAD Pod Identity](https://github.com/Azure/aad-pod-identity) will add the following components to your Kubernetes cluster:
   1. Kubernetes [CRDs](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/): `AzureIdentity`, `AzureAssignedIdentity`, `AzureIdentityBinding`
   1. [Managed Identity Controller (MIC)](https://github.com/Azure/aad-pod-identity#managed-identity-controllermic) component
   1. [Node Managed Identity (NMI)](https://github.com/Azure/aad-pod-identity#node-managed-identitynmi) component


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
[Helm](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm) is a package manager for
Kubernetes. We will leverage it to install the `application-gateway-kubernetes-ingress` package:

1. Install [Helm](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm) and run the following to add `application-gateway-kubernetes-ingress` helm package:

    - *RBAC enabled* AKS cluster

    ```bash
    kubectl create serviceaccount --namespace kube-system tiller-sa
    kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller-sa
    helm init --tiller-namespace kube-system --service-account tiller-sa --generate-name
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
2. Download [helm-config.yaml](../examples/sample-helm-config.yaml), which will configure AGIC:
    ```bash
    wget https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/sample-helm-config.yaml -O helm-config.yaml
    ```

3. Edit the newly downloaded [helm-config.yaml](../examples/sample-helm-config.yaml) and fill out the sections `appgw` and `armAuth`.
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
- `appgw.subscriptionId`: The Azure Subscription ID in which App Gateway resides. Example: `a123b234-a3b4-557d-b2df-a0bc12de1234`
- `appgw.resourceGroup`: Name of the Azure Resource Group in which App Gateway was created. Example: `app-gw-resource-group`
- `appgw.name`: Name of the Application Gateway. Example: `applicationgatewayd0f0`
- `appgw.shared`: This boolean flag should be defaulted to `false`. Set to `true` should you need a [Shared App Gateway](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/072626cb4e37f7b7a1b0c4578c38d1eadc3e8701/docs/setup/install-existing.md#multi-cluster--shared-app-gateway).
- `kubernetes.watchNamespace`: Specify the name space, which AGIC should watch. This could be a single string value, or a comma-separated list of namespaces.
- `armAuth.type`: could be `aadPodIdentity` or `servicePrincipal`
- `armAuth.identityResourceID`: Resource ID of the Azure Managed Identity
- `armAuth.identityClientId`: The Client ID of the Identity. See below for more information on Identity
- `armAuth.secretJSON`: Only needed when Service Principal Secret type is chosen (when `armAuth.type` has been set to `servicePrincipal`)
- `rbac.enabled`: Make sure to set this to true if you have a AKS cluster that is RBAC enabled.

   Note on Identity: The `identityResourceID` and `identityClientID` are values that were created
   during the [Create an Identity](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/072626cb4e37f7b7a1b0c4578c38d1eadc3e8701/docs/setup/install-new.md#create-an-identity)
   steps, and could be obtained again using the following command:
   ```bash
   az identity show -g <resource-group> -n <identity-name>
   ```
- `<resource-group>` in the command above is the resource group of your App Gateway. 
- `<identity-name>` is the name of the created identity. All identities for a given subscription can be listed using: `az identity list`


4. Install the Application Gateway ingress controller package:

    ```bash
    helm install -f helm-config.yaml application-gateway-kubernetes-ingress/ingress-azure --generate-name --set nodeSelector."beta\.kubernetes\.io/os"=linux
    ```

### Install a Sample App
Now that we have App Gateway, AKS, and AGIC installed we can install a sample app
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
  nodeSelector:
    "beta.kubernetes.io/os": windows
  containers:
  - image: "mcr.microsoft.com/dotnet/framework/samples:aspnetapp"
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

1. Download the YAML file above:
```bash
curl https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/aspnetappwin.yaml -o aspnetapp.yaml
```

2. Apply the YAML file:
```bash
kubectl apply -f aspnetapp.yaml
```


## Other Examples
The **[tutorials](../tutorial.md)** document contains more examples on how to expose an AKS
service via HTTP or HTTPS, to the Internet with App Gateway.
