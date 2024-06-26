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

In this article, you learn how to configure cross-tenant workload identity on Azure Kubernetes Service (AKS). Cross-tenant workload identity allows you to access resources in another tenant from your AKS cluster. In this example, you will create an Azure Service Bus in one tenant and send messages to it from a workload running in an AKS cluster in another tenant.

For more information on workload identity, see the [Workload identity overview][workload-identity-overview].

## Prerequisites

* ***Two Azure subscriptions***, each in a separate tenant. In this article, we refer to these as *Tenant A* and *Tenant B*.
* Azure CLI installed on your local machine. If you don't have the Azure CLI installed, see [Install the Azure CLI][install-azure-cli].
* Bash shell environment. This article uses Bash shell syntax.

In order to complete the steps in this article, you need to have the following information:

* *Tenant A* tenant ID
* *Tenant A* subscription ID
* *Tenant B* tenant ID
* *Tenant B* subscription ID

## Configure resources in Tenant A

In *Tenant A*, you create an AKS cluster with workload identity and OIDC issuer enabled. You use this cluster to deploy an application that attempts to access resources in *Tenant B*.

1. Log into your *Tenant A* subscription using the [`az login`][az-login-interactively] command and pass in the tenant ID of *Tenant A*.

    ```azurecli-interactive
    TENANT_A_ID=<tenant-id>
    az login --tenant $TENANT_A_ID
    ```

1. Ensure you are working with the correct subscription in *Tenant A* by using the [`az account set`][az-account-set] command.

    ```azurecli-interactive
    # Set environment variable
    TENANT_A_SUBSCRIPTION_ID=<subscription-id>

    # Log in to your Tenant A subscription
    az account set --subscription $TENANT_A_SUBSCRIPTION_ID
    ```

1. Create a resource group in *Tenant A* to host the AKS cluster using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    # Set environment variables
    RESOURCE_GROUP=<resource-group-name>
    LOCATION=<location>

    # Create a resource group
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

1. Create an AKS cluster in *Tenant A* with workload identity and OIDC issuer enabled using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    # Set environment variables
    CLUSTER_NAME=<cluster-name>

    # Create an AKS cluster
    az aks create \
      --resource-group $RESOURCE_GROUP \
      --name $CLUSTER_NAME \
      --enable-oidc-issuer \
      --enable-workload-identity \
      --generate-ssh-keys
    ```

1. Get the OIDC issuer URL from the cluster in *Tenant A* using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    OIDC_ISSUER_URL=$(az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --query "oidcIssuerProfile.issuerUrl" --output tsv)
    ```

## Configure resources in Tenant B

In *Tenant B*, you create an Azure Service Bus, a managed identity and assign it permissions to read and write messages to the service bus, and establish the trust between the managed identity and the AKS cluster in *Tenant A*.

1. Log out of your *Tenant A* subscription using the [`az logout`][az-logout] command.

    ```azurecli-interactive
    az logout
    ```

1. Log into your *Tenant B* subscription using the [`az login`][az-login-interactively] command and pass in the tenant ID of *Tenant B*.

    ```azurecli-interactive
    TENANT_B_ID=<tenant-id>
    az login --tenant $TENANT_B_ID
    ```

1. Ensure you are working with the correct subscription in *Tenant A* by using the [`az account set`][az-account-set] command.

    ```azurecli-interactive
    # Set environment variable
    TENANT_B_SUBSCRIPTION_ID=<subscription-id>

    # Log in to your Tenant B subscription
    az account set --subscription $TENANT_B_SUBSCRIPTION_ID
    ```

1. Create a resource group in *Tenant B* to host the managed identity using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    # Set environment variables
    RESOURCE_GROUP=<resource-group-name>
    LOCATION=<location>

    # Create a resource group
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```
1. Create a service bus and queue in *Tenant B* using the [`az servicebus namespace create`][az-servicebus-namespace-create] and [`az servicebus queue create`][az-servicebus-queue-create] commands.

    ```azurecli-interactive
    # Set a unique name for the servicebus
    SERVICEBUS_NAME=sb-crosstenantdemo-$RANDOM

    # Create a new service bus namespace and and return the service bus hostname
    SERVICEBUS_HOSTNAME=$(az servicebus namespace create \
    --name $SERVICEBUS_NAME \
    --resource-group $RESOURCE_GROUP \
    --disable-local-auth \
    --query serviceBusEndpoint \
    --output tsv | sed -e 's/https:\/\///' -e 's/:443\///')

    # Create a new queue in the service bus namespace
    az servicebus queue create \
    --name myqueue \
    --namespace $SERVICEBUS_NAME \
    --resource-group $RESOURCE_GROUP
    ```

1. Create a user-assigned managed identity in *Tenant B* using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    # Set user-assigned managed identity name
    IDENTITY_NAME=${SERVICEBUS_NAME}-identity

    # Create a user-assigned managed identity
    az identity create --resource-group $RESOURCE_GROUP --name $IDENTITY_NAME
    ```
1. Get the principal ID of the managed identity in *Tenant B* using the [`az identity show`][az-identity-show] command.

    ```azurecli-interactive
    # Get the user-assigned managed identity principalId
    PRINCIPAL_ID=$(az identity show \
      --resource-group $RESOURCE_GROUP \
      --name $IDENTITY_NAME \
      --query principalId \
      --output tsv)
    ```

1. Get the client ID of the managed identity in *Tenant B* using the [`az identity show`][az-identity-show] command.

    ```azurecli-interactive
    CLIENT_ID=$(az identity show \
      --resource-group $RESOURCE_GROUP \
      --name $IDENTITY_NAME \
      --query clientId \
      --output tsv)
    ```

1. Get the resource ID of the service bus namespace in *Tenant B* using the [`az servicebus namespace show`][az-servicebus-namespace-show] command.

    ```azurecli-interactive
    SERVICEBUS_ID=$(az servicebus namespace show \
      --name $SERVICEBUS_NAME \
      --resource-group $RESOURCE_GROUP \
      --query id \
      --output tsv)
    ```

6. Assign the managed identity in *Tenant B* permissions to read and write service bus messages using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create \
      --role "Azure Service Bus Data Owner" \
      --assignee-object-id $PRINCIPAL_ID \
      --assignee-principal-type ServicePrincipal \
      --scope $SERVICEBUS_ID
    ```

## Establish trust between AKS cluster and managed identity

In this section, you create the federated identity credential needed to establish trust between the AKS cluster in *Tenant A* and the managed identity in *Tenant B*. You use the OIDC issuer URL from the AKS cluster in *Tenant A* and the name of the managed identity in *Tenant B*.

* Create a federated identity credential using the [`az aks federated-identity add`][az-aks-federated-identity-add] command.

    ```azurecli-interactive
    az identity federated-credential create \
      --name $IDENTITY_NAME-$RANDOM \
      --identity-name $IDENTITY_NAME \
      --resource-group $RESOURCE_GROUP \
      --issuer $OIDC_ISSUER_URL \
      --subject system:serviceaccount:default:myserviceaccount
    ```

`--subject system:serviceaccount:default:myserviceaccount` is the name of the Kubernetes service account that you will create later in *Tenant A*. When your application pod makes authentication requests, this value is sent to Microsoft Entra ID as the `subject` in the authorization request. Microsoft Entra ID determines eligibility based on whether this value matches what you set when you created the federated identity credential, so it's important to ensure the value matches.

## Deploy application to send messages to Azure Service Bus queue

In this section, you deploy an application to your AKS cluster in *Tenant A* that sends messages to the Azure Service Bus queue in *Tenant B*.

1. Log out of your *Tenant B* subscription using the [`az logout`][az-logout] command.

    ```azurecli-interactive
    az logout
    ```

1. Log into your *Tenant A* subscription using the [`az login`][az-login-interactively] command and pass in the tenant ID of *Tenant A*.

    ```azurecli-interactive
    az login --tenant $TENANT_A_ID
    ```

1. Ensure you are working with the correct subscription in *Tenant A* by using the [`az account set`][az-account-set] command.

    ```azurecli-interactive
    az account set --subscription $TENANT_A_SUBSCRIPTION_ID
    ```

1. Get the cluster credentials for the AKS cluster in *Tenant A* using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME
    ```

1. Create a new Kubernetes ServiceAccount in the `default` namespace and pass in the client ID of your managed identity in *Tenant B* to the `kubectl apply` command. The client ID is used to authenticate the pod to the Azure Service Bus.

    ```azurecli-interactive
    kubectl apply -f - <<EOF
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        azure.workload.identity/client-id: $CLIENT_ID
      name: myserviceaccount
    EOF
    ```

4. Create a new Kubernetes Job in the `default` namespace to send 100 messages to your Azure Service Bus queue. The Pod template is configured to use workload identity and the service account you created in the previous step. Also note that the `AZURE_TENANT_ID` environment variable is set to the tenant ID of *Tenant B*. This is required as workload identity defaults to the tenant of the AKS cluster, so you need to explicitly set the tenant ID of *Tenant B*.

    ```azurecli-interactive
    kubectl apply -f - <<EOF
    apiVersion: batch/v1
    kind: Job
    metadata:
      name: myproducer
    spec:
      template:
        metadata:
          labels:
            azure.workload.identity/use: "true"
        spec:
          serviceAccountName: myserviceaccount
          containers:
          - image: ghcr.io/azure-samples/aks-app-samples/servicebusdemo:latest
            name: myproducer
            resources: {}
            env:
            - name: OPERATION_MODE
              value: "producer"
            - name: MESSAGE_COUNT
              value: "100"
            - name: AZURE_SERVICEBUS_QUEUE_NAME
              value: myqueue
            - name: AZURE_SERVICEBUS_HOSTNAME
              value: $SERVICEBUS_HOSTNAME
            - name: AZURE_TENANT_ID
              value: $TENANT_B_ID
          restartPolicy: Never
    EOF
    ```

5. Verify that the pod is configured correctly to interact with the Azure Service Bus queue in *Tenant B* by checking the status of the pod using the `kubectl describe pod` command.

    ```azurecli-interactive
    # Get the dynamically generated pod name
    POD_NAME=$(kubectl get po --selector job-name=myproducer -o jsonpath='{.items[0].metadata.name}')
    
    # Get the tenant ID environment variable
    kubectl describe pod $POD_NAME | grep AZURE_TENANT_ID
    ```

6. Check the logs of the pod to see if the application was able to send messages across tenants using the `kubectl logs` command.

    ```azurecli-interactive
    kubectl logs $POD_NAME
    ```

    Your output should look similar to the following example output:

    ```output
    ...
    Adding message to batch: Hello World!
    Adding message to batch: Hello World!
    Adding message to batch: Hello World!
    Sent 100 messages
    ```

## Next steps

In this article, you learned how to configure cross-tenant workload identity on Azure Kubernetes Service (AKS). To learn more about workload identity, see the following articles:

* [Workload identity overview][workload-identity-overview]
* [Configure workload identity on Azure Kubernetes Service (AKS)][configure-workload-identity]

<!-- LINKS -->
[workload-identity-overview]: ./workload-identity-overview.md
[configure-workload-identity]: ./workload-identity-deploy-cluster.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-login-interactively]: cli/azure/authenticate-azure-cli-interactively#interactive-login
[az-logout]: cli/azure/authenticate-azure-cli-interactively#logout
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
[az-servicebus-namespace-create]: cli/azure/servicebus/namespace?view=azure-cli-latest#az-servicebus-namespace-create
[az-servicebus-namespace-show]: cli/azure/servicebus/namespace?view=azure-cli-latest#az-servicebus-namespace-show
[az-servicebus-queue-create]: cli/azure/servicebus/queue?view=azure-cli-latest#az-servicebus-queue-create
