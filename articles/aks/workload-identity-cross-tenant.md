---
title: Configure cross-tenant workload identity on Azure Kubernetes Service (AKS)
description: Learn how to configure cross-tenant workload identity on Azure Kubernetes Service (AKS).
author: schaffererin
ms.topic: article
ms.subservice: aks-security
ms.date: 06/11/2024
ms.author: schaffererin
---

# Configure cross-tenant workload identity on Azure Kubernetes Service (AKS)

In this article, you learn how to configure cross-tenant workload identity on Azure Kubernetes Service (AKS). Cross-tenant workload identity allows you to access resources in another tenant from your AKS cluster.

For more information on workload identity, see the [Workload identity overview][workload-identity-overview].

## Prerequisites

* ***Two Azure subscriptions***, each in a separate tenant. In this article, we refer to these as *Tenant A* and *Tenant B*.
* Azure CLI installed on your local machine. If you don't have the Azure CLI installed, see [Install the Azure CLI][install-azure-cli].
* X
* Y
* Z

## Configure resources in Tenant A

In *Tenant A*, you create an AKS cluster with workload identity and OIDC issuer enabled. You use this cluster to deploy an application that attempts to access resources in *Tenant B*.

1. Log in to your *Tenant A* subscription using the [`az account set`][az-account-set] command.

    ```azurecli-interactive
    # Set environment variable
    TENANT_A_SUBSCRIPTION_ID=<subscription-id>

    # Log in to your Tenant A subscription
    az account set --subscription $TENANT_A_SUBSCRIPTION_ID
    ```

2. Create a resource group in *Tenant A* to host the AKS cluster using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    # Set environment variables
    RESOURCE_GROUP=<resource-group-name>
    LOCATION=<location>

    # Create a resource group
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

3. Create an AKS cluster in *Tenant A* with workload identity and OIDC issuer enabled using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    # Set environment variables
    CLUSTER_NAME=<cluster-name>

    # Create an AKS cluster
    az aks create --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --enable-oidc-issuer --enable-workload-identity --generate-ssh-keys
    ```

4. Get the OIDC issuer URL from the cluster in *Tenant A* using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    OIDC_ISSUER_URL=$(az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --query "oidcIssuerProfile.issuerUrl" --output tsv)
    ```

## Configure resources in Tenant B

In *Tenant B*, you create a managed identity, assign it permissions to read subscription information, and establish the trust between the managed identity and the AKS cluster in *Tenant A*.

1. Log in to your *Tenant B* subscription using the [`az account set`][az-account-set] command.

    ```azurecli-interactive
    # Set environment variable
    TENANT_B_SUBSCRIPTION_ID=<subscription-id>

    # Log in to your Tenant B subscription
    az account set --subscription $TENANT_B_SUBSCRIPTION_ID
    ```

2. Create a resource group in *Tenant B* to host the managed identity using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    # Set environment variables
    RESOURCE_GROUP=<resource-group-name>
    LOCATION=<location>

    # Create a resource group
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

3. Create a user-assigned managed identity in *Tenant B* using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    # Set environment variable
    IDENTITY_NAME=<identity-name>

    # Create a user-assigned managed identity
    az identity create --resource-group $RESOURCE_GROUP --name $IDENTITY_NAME
    ```

4. Get the client ID of the managed identity in *Tenant B* using the [`az identity show`][az-identity-show] command.

    ```azurecli-interactive
    CLIENT_ID=$(az identity show --resource-group $RESOURCE_GROUP --name $IDENTITY_NAME --query clientId --output tsv)
    ```

5. Get the principal ID of the managed identity in *Tenant B* using the [`az identity show`][az-identity-show] command.

    ```azurecli-interactive
    PRINCIPAL_ID=$(az identity show --resource-group $RESOURCE_GROUP --name $IDENTITY_NAME --query principalId --output tsv)
    ```

6. Assign the managed identity in *Tenant B* permissions to read subscription information using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create --role "Reader" --assignee $PRINCIPAL_ID --scope /subscriptions/$TENANT_A_SUBSCRIPTION_ID
    ```

## Establish trust between AKS cluster and managed identity

In this section, you create the federated identity credential needed to establish trust between the AKS cluster in *Tenant A* and the managed identity in *Tenant B*. You use the OIDC issuer URL from the AKS cluster in *Tenant A* and the name of the managed identity in *Tenant B*.

* Create a federated identity credential using the [`az aks federated-identity add`][az-aks-federated-identity-add] command.

    ```azurecli-interactive
    az identity federated-credential create --name $FEDERATED_CREDENTIAL_NAME --identity-name $IDENTITY_NAME --resource-group $RESOURCE_GROUP --issuer $OIDC_ISSUER_URL --subject system:serviceaccount:default:wi-demo-account
    ```

`--subject system:serviceaccount:default:wi-demo-account` is the name of the Kubernetes service account that you will create later in *Tenant A*. When your application pod makes authentication requests, this value is sent to Azure AD as the `subject` in the authorization request. Azure AD determines eligibility based on whether this value matches what you set when you created the federated identity credential, so it's important to ensure the value matches.

## Create application to read subscription information

XYZ

## Test application

Before you deploy the application to your AKS cluster, you test the application locally to make sure it works. Since your application will read subscription quota information using [Azure Quota API](/rest/api/reserved-vm-instances/quotaapi), you also need to make sure the `Microsoft.Quota` resource provider is registered in your subscription.

1. Log in to either *Tenant A* or *Tenant B* using the [`az account set`][az-account-set] command.

    ```azurecli-interactive
    az account set --subscription $TENANT_A_SUBSCRIPTION_ID
    ```

2. Check if the `Microsoft.Quota` resource provider is registered in your subscription using the [`az provider show`][az-provider-show] command.

    ```azurecli-interactive
    az provider show --namespace Microsoft.Quota
    ```

    If the `registrationState` is `Registered`, the resource provider is registered. If it's not registered, you can register it using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.Quota
    ```

3. Once the registration state is `Registered`, you can test the application locally using the following commands:

    ```azurecli-interactive
    XYZ
    ```

## Deploy application to AKS cluster

Now that you confirmed the application works locally, you can push it to a container registry so that it can be pulled from within your AKS cluster.

1. XYZ

    ```azurecli-interactive
    XYZ
    ```

2. Get the cluster credentials for the AKS cluster in *Tenant A* using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME
    ```

3. Create a new Kubernetes service account in the `default` namespace with the client ID of your managed identity using the `kubectl apply` command. Make sure to replace the `<YOUR_USER_ASSIGNED_MANAGED_IDENTITY>` placeholder with the client ID of your managed identity in *Tenant B*.

    ```azurecli-interactive
    kubectl apply -f - <<EOF
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        azure.workload.identity/client-id: <YOUR_USER_ASSIGNED_MANAGED_IDENTITY_CLIENT_ID>
      name: wi-demo-account
      namespace: default
    EOF
    ```

4. Create a new pod in the `default` namespace with the image name, the *Tenant B* tenant ID, and the *Tenant B* subscription ID using the `kubectl apply` command. Make sure to replace the placeholders with your own values.

    ```azurecli-interactive
    kubectl apply -f - <<EOF
    apiVersion: v1
    kind: Pod
    metadata:
      name: wi-demo-app
      namespace: default
      labels:
        azure.workload.identity/use: "true"
    spec:
      serviceAccountName: wi-demo-account
      containers:
      - name: wi-demo-app
        image: <YOUR_IMAGE_NAME>
        env:
        - name: AZURE_TENANT_ID
          value: <TENANT_B_ID>
        - name: AZURE_SUBSCRIPTION_ID
          value: <TENANT_B_SUBSCRIPTION_ID>
        - name: AZURE_REGION
          value: eastus
        - name: AZURE_RESOURCE_NAME
          value: cores
        resources: {}
      dnsPolicy: ClusterFirst
      restartPolicy: Always
    EOF
    ```

5. Verify that the pod is running using the `kubectl get pods` command.

    ```azurecli-interactive
    kubectl get pods
    ```

6. Check the logs of the pod to see if the application was able to read subscription information using the `kubectl logs` command.

    ```azurecli-interactive
    kubectl logs wi-demo-app
    ```

    Your output should look similar to the following example output:

    ```output
    2023/08/24 17:48:03 clientResponse: {"id":"/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Compute/locations/eastus/providers/Microsoft.Quota/quotas/cores","name":"cores","properties":{"isQuotaApplicable":true,"limit":{"limitObjectType":"LimitValue","limitType":"Independent","value":20},"name":{"localizedValue":"Total Regional vCPUs","value":"cores"},"properties":{},"unit":"Count"},"type":"Microsoft.Quota/Quotas"}
    2023/08/24 17:48:04 usagesClientResponse: {"id":"/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Compute/locations/eastus/providers/Microsoft.Quota/usages/cores","name":"cores","properties":{"isQuotaApplicable":true,"name":{"localizedValue":"Total Regional vCPUs","value":"cores"},"properties":{},"unit":"Count","usages":{}},"type":"Microsoft.Quota/Usages"}
    ```

## Next steps

In this article, you learned how to configure cross-tenant workload identity on Azure Kubernetes Service (AKS). To learn more about workload identity, see the following articles:

* [Workload identity overview][workload-identity-overview]
* [Configure workload identity on Azure Kubernetes Service (AKS)][configure-workload-identity]

<!-- LINKS -->
[workload-identity-overview]: ./workload-identity-overview.md
[configure-workload-identity]: ./workload-identity-deploy-cluster.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-account-set]: /cli/azure/account#az_account_set
[az-group-create]: /cli/azure/group#az_group_create
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-identity-create]: /cli/azure/identity#az_identity_create
[az-identity-show]: /cli/azure/identity#az_identity_show
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[az-aks-federated-identity-add]: /cli/azure/aks/federated-identity#az_aks_federated_identity_add
[az-provider-show]: /cli/azure/provider#az_provider_show
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
