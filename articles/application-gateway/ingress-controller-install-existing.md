---
title: Create an ingress controller by using an existing Application Gateway deployment
description: This article provides information on how to deploy the Application Gateway Ingress Controller by using an existing Application Gateway deployment.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.custom: devx-track-arm-template, devx-track-azurecli
ms.topic: how-to
ms.date: 9/17/2024
ms.author: greglin
---

# Install AGIC by using an existing Application Gateway deployment

The Application Gateway Ingress Controller (AGIC) is a pod within your Azure Kubernetes Service (AKS) cluster. AGIC monitors the Kubernetes [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) resources. It creates and applies an Azure Application Gateway configuration based on the status of the Kubernetes cluster.

> [!TIP]
> Consider [Application Gateway for Containers](for-containers/overview.md) for your Kubernetes ingress solution. For more information, see [Quickstart: Deploy Application Gateway for Containers ALB Controller](for-containers/quickstart-deploy-application-gateway-for-containers-alb-controller.md).

## Prerequisites

This article assumes that you already installed the following tools and infrastructure:

- [An AKS cluster](/azure/aks/intro-kubernetes) with [Azure Container Networking Interface (CNI)](/azure/aks/configure-azure-cni).
- [Application Gateway v2](./tutorial-autoscale-ps.md) in the same virtual network as the AKS cluster.
- [Microsoft Entra Workload ID](/azure/aks/workload-identity-overview) configured for your AKS cluster.
- [Azure Cloud Shell](https://shell.azure.com/) as the Azure shell environment, which has `az` (Azure CLI), `kubectl`, and `helm` installed. These tools are required for commands that support configuring this deployment.

## Add the Helm repository

[Helm](/azure/aks/kubernetes-helm) is a package manager for Kubernetes. You use it to install the `application-gateway-kubernetes-ingress` package.

If you use Cloud Shell, you don't need to install Helm. Cloud Shell comes with Helm version 3. Run the following commands to add the AGIC Helm repository for an AKS cluster that's enabled with Kubernetes role-based access control (RBAC):

```bash
kubectl create serviceaccount --namespace kube-system tiller-sa
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller-sa
helm init --tiller-namespace kube-system --service-account tiller-sa
```

## Back up the Application Gateway deployment

Before you install AGIC, back up your Application Gateway deployment's configuration:

1. In the [Azure portal](https://portal.azure.com/), go to your Application Gateway deployment.
2. In the **Automation** section, select **Export template** and then select **Download**.

The downloaded .zip file contains JSON templates, Bash scripts, and PowerShell scripts that you can use to restore Application Gateway, if a restoration becomes necessary.

## Set up an identity for Resource Manager authentication

AGIC communicates with the Kubernetes API server and [Azure Resource Manager](../azure-resource-manager/management/overview.md). It requires an identity to access these APIs. You can use either Microsoft Entra Workload ID or a service principal.

<a name='set-up-azure-ad-workload-identity'></a>

### Set up Microsoft Entra Workload ID

[Microsoft Entra Workload ID](/azure/aks/workload-identity-overview) is an identity that you assign to a software workload. This identity enables your AKS pod to authenticate with other Azure resources.

For this configuration, you need authorization for the AGIC pod to make HTTP requests to Azure Resource Manager.

1. Use the Azure CLI [az account set](/cli/azure/account#az-account-set) command to set a specific subscription to be the current active subscription:

    ```azurecli-interactive
    az account set --subscription "subscriptionID"
    ```

   Then use the [az identity create](/cli/azure/identity#az-identity-create) command to create a managed identity. You must create the identity in the [node resource group](/azure/aks/concepts-clusters-workloads#node-resource-group). The node resource group is assigned a name by default, such as `MC_myResourceGroup_myAKSCluster_eastus`.

    ```azurecli-interactive
    az identity create --name "userAssignedIdentityName" --resource-group "resourceGroupName" --location "location" --subscription "subscriptionID"
    ```

1. For the role assignment, run the following command to identify the `principalId` value for the newly created identity:

    ```powershell-interactive
    $resourceGroup="resource-group-name"
    $identityName="identity-name"
    az identity list -g $resourceGroup --query "[?name == '$identityName'].principalId | [0]" -o tsv
    ```

1. Grant the identity **Contributor** access to your Application Gateway deployment. You need the ID of the Application Gateway deployment, which looks like `/subscriptions/A/resourceGroups/B/providers/Microsoft.Network/applicationGateways/C`.

   First, get the list of Application Gateway IDs in your subscription by running the following command:

    ```azurecli
    az network application-gateway list --query '[].id'
    ```

   To assign the identity **Contributor** access, run the following command:

    ```powershell-interactive
    $resourceGroup="resource-group-name"
    $identityName="identity-Name"
    # Get the Application Gateway ID
    $AppGatewayID=$(az network application-gateway list --query '[].id' -o tsv)
    $role="contributor"
    # Get the principal ID for the user-assigned identity
    $principalId=$(az identity list -g $resourceGroup --query "[?name == '$identityName'].principalId | [0]" -o tsv)
    az role assignment create --assignee $principalId --role $role --scope $AppGatewayID
    ```

1. Grant the identity **Reader** access to the Application Gateway resource group. The resource group ID looks like
`/subscriptions/A/resourceGroups/B`. You can get all resource groups by running `az group list --query '[].id'`.

    ```powershell-interactive
    $resourceGroup="resource-group-name"
    $identityName="identity-Name"
    # Get the Application Gateway resource group
    $AppGatewayResourceGroup=$(az network application-gateway list --query '[].resourceGroup' -o tsv)
    # Get the Application Gateway resource group ID
    $AppGatewayResourceGroupID=$(az group show --name $AppGatewayResourceGroup --query id -o tsv)
    $role="Reader"
    # Get the principal ID for the user-assigned identity
    $principalId=$(az identity list -g $resourceGroup --query "[?name == '$identityName'].principalId | [0]" -o tsv)
    # Assign the Reader role to the user-assigned identity at the resource group scope
    az role assignment create --role $role --assignee $principalId  --scope $AppGatewayResourceGroupID
    ```

> [!NOTE]
> Please ensure the identity used by AGIC has the proper permissions. A list of permissions needed by the identity can be found here: [Configure Infrastructure - Permissions](configuration-infrastructure.md#permissions). If a custom role is not defined with the required permissions, you may use the _Network Contributor_ role.

### Set up a service principal

It's also possible to provide AGIC access to Azure Resource Manager by using a Kubernetes secret:

1. Create an Active Directory service principal and encode it with Base64. The Base64 encoding is required for the JSON blob to be saved to Kubernetes.

    ```azurecli
    az ad sp create-for-rbac --role Contributor --sdk-auth | base64 -w0
    ```

2. Add the Base64-encoded JSON blob to the `helm-config.yaml` file. The `helm-config.yaml` file configures AGIC.

    ```yaml
    armAuth:
        type: servicePrincipal
        secretJSON: <Base64-Encoded-Credentials>
    ```

## Deploy the AGIC add-on

### Create a deployment manifest for the ingress controller

```yaml
---
# file: pet-supplies-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: pet-supplies-ingress
spec:
  ingressClassName: azure-application-gateway
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: store-front
            port:
              number: 80
      - path: /order-service
        pathType: Prefix
        backend:
          service:
            name: order-service
            port:
              number: 3000
      - path: /product-service
        pathType: Prefix
        backend:
          service:
            name: product-service
            port:
              number: 3002

```

### Deploy the ingress controller

```powershell-interactive
$namespace="namespace"
$file="pet-supplies-ingress.yaml"
kubectl apply -f $file -n $namespace
```

## Install the ingress controller as a Helm chart

Use [Cloud Shell](https://shell.azure.com/) to install the AGIC Helm package:

1. Perform a Helm update:

    ```bash
    helm repo update
    ```

1. Download `helm-config.yaml`:

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

1. Edit `helm-config.yaml` and fill in the values for `appgw` and `armAuth`.

    > [!NOTE]
    > `<identity-client-id>` is a property of the Microsoft Entra Workload ID value that you set up in the previous section. You can retrieve this information by running the following command: `az identity show -g <resourcegroup> -n <identity-name>`. In that command, `<resourcegroup>` is the resource group that hosts the infrastructure resources related to the AKS cluster, Application Gateway, and the managed identity.

1. Install the Helm chart with the `helm-config.yaml` configuration from the previous step:

    ```bash
    helm install agic-controller oci://mcr.microsoft.com/azure-application-gateway/charts/ingress-azure --version 1.7.5 -f helm-config.yaml
    ```

    Alternatively, you can combine `helm-config.yaml` and the Helm command in one step:

    ```bash
    helm install oci://mcr.microsoft.com/azure-application-gateway/charts/ingress-azure \
         --name agic-controller \
         --version 1.7.5 \
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

1. Check the log of the newly created pod to verify that it started properly.

To understand how you can expose an AKS service to the internet over HTTP or HTTPS by using an Azure Application Gateway deployment, see [this how-to guide](ingress-controller-expose-service-over-http-https.md).

## Set up a shared Application Gateway deployment

By default, AGIC assumes full ownership of the Application Gateway deployment that it's linked to. AGIC version 0.8.0 and later can share a single Application Gateway deployment with other Azure components. For example, you could use the same Application Gateway deployment for an app
that's hosted on an [Azure virtual machine scale set](https://azure.microsoft.com/services/virtual-machine-scale-sets/) and an AKS cluster.

### Example scenario

Let's look at an imaginary Application Gateway deployment that manages traffic for two websites:

- `dev.contoso.com`: Hosted on a new AKS cluster by using Application Gateway and AGIC.
- `prod.contoso.com`: Hosted on a virtual machine scale set.

With default settings, AGIC assumes 100% ownership of the Application Gateway deployment that it's pointed to. AGIC overwrites all of the App Gateway configuration. If you manually create a listener for `prod.contoso.com` on Application Gateway without defining it in the Kubernetes ingress, AGIC deletes the `prod.contoso.com` configuration within seconds.

To install AGIC and also serve `prod.contoso.com` from the machines that use the virtual machine scale set, you must constrain AGIC to configuring
`dev.contoso.com` only. You facilitate this constraint by instantiating the following [custom resource definition (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/):

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

The preceding command creates an `AzureIngressProhibitedTarget` object. This object makes AGIC (version 0.8.0 and later) aware of the existence of
the Application Gateway configuration for `prod.contoso.com`. This object also explicitly instructs AGIC to avoid changing any configuration
related to that host name.

### Enable a shared Application Gateway deployment by using a new AGIC installation

To limit AGIC (version 0.8.0 and later) to a subset of the Application Gateway configuration, modify the `helm-config.yaml` template.
In the `appgw:` section, add a `shared` key and set it to `true`:

```yaml
appgw:
    subscriptionId: <subscriptionId>    # existing field
    resourceGroup: <resourceGroupName>  # existing field
    name: <applicationGatewayName>      # existing field
    shared: true                        # Add this field to enable shared Application Gateway
```

Apply the Helm changes:

1. Ensure that the `AzureIngressProhibitedTarget` CRD is installed:

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/7b55ad194e7582c47589eb9e78615042e00babf3/crds/AzureIngressProhibitedTarget-v1-CRD-v1.yaml
    ```

2. Update Helm:

    ```bash
    helm upgrade \
        --recreate-pods \
        -f helm-config.yaml \
        agic-controller
        oci://mcr.microsoft.com/azure-application-gateway/charts/ingress-azure
    ```

As a result, your AKS cluster has a new instance of `AzureIngressProhibitedTarget` called `prohibit-all-targets`:

  ```bash
  kubectl get AzureIngressProhibitedTargets prohibit-all-targets -o yaml
  ```

The `prohibit-all-targets` object prohibits AGIC from changing the configuration for *any* host and path. Helm installed with `appgw.shared=true` deploys AGIC, but it doesn't make any changes to Application Gateway.

### Broaden permissions

Because Helm with `appgw.shared=true` and the default `prohibit-all-targets` blocks AGIC from applying a configuration, you must broaden AGIC permissions:

1. Create a new YAML file named `AzureIngressProhibitedTarget` with the following snippet that contains your specific setup:

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

2. Now that you've created your own custom prohibition, you can delete the default one, which is too broad:

    ```bash
    kubectl delete AzureIngressProhibitedTarget prohibit-all-targets
    ```

### Enable a shared Application Gateway deployment for an existing AGIC installation

Assume that you already have a working AKS cluster and an Application Gateway deployment, and you configured AGIC in your cluster. You have an Ingress for `prod.contoso.com` and are successfully serving traffic for it from the cluster.

You want to add `staging.contoso.com` to your existing Application Gateway deployment, but you need to host it on a [virtual machine](https://azure.microsoft.com/services/virtual-machines/). You're going to reuse the existing Application Gateway deployment and manually configure a listener and backend pools for `staging.contoso.com`. But manually tweaking the Application Gateway configuration (by using the [Azure portal](https://portal.azure.com), [Resource Manager APIs](/rest/api/resources/), or [Terraform](https://www.terraform.io/)) would conflict with AGIC's assumptions of full ownership. Shortly after you apply changes, AGIC overwrites or deletes them.

You can prohibit AGIC from making changes to a subset of the configuration:

1. Create a new YAML file named `AzureIngressProhibitedTarget` by using the following snippet:

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

3. Modify the Application Gateway configuration from the Azure portal. For example, add listeners, routing rules, and backends. The new object that you created (`manually-configured-staging-environment`) prohibits AGIC from overwriting the Application Gateway configuration related to
`staging.contoso.com`.

## Related content

- [Application Gateway for Containers](for-containers/overview.md)
