---
title: Secure access to Azure OpenAI from Azure Kubernetes Service (AKS)
description: Learn how to secure access to Azure OpenAI from Azure Kubernetes Service (AKS).
ms.service: azure-kubernetes-service
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 09/18/2023
ms.author: schaffererin
author: schaffererin
---

# Secure access to Azure OpenAI from Azure Kubernetes Service (AKS)

In this article, you learn how to secure access to Azure OpenAI from Azure Kubernetes Service (AKS) using Azure Active Directory (Azure AD) Workload Identity. You learn how to:

* Enable workload identities on an AKS cluster.
* Create an Azure user-assigned managed identity.
* Create an Azure AD federated credential.
* Enable workload identity on a Kubernetes Pod.

> [!NOTE]
> We recommend using Azure AD Workload Identity and managed identities on AKS for Azure OpenAI access because it enables a secure, passwordless authentication process for accessing Azure resources.

## Before you begin

* You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* This article builds on [Deploy an application that uses OpenAI on AKS](./open-ai-quickstart.md). You should complete that article before you begin this one.
* You need a custom domain name enabled on your Azure OpenAI account to use for Azure AD authorization. For more information, see [Custom subdomain names for Azure AI services](../ai-services/cognitive-services-custom-subdomains.md).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Enable Azure AD Workload Identity on an AKS cluster

The Azure AD Workload Identity and OIDC Issuer Endpoint features aren't enabled on AKS by default. You must enable them on your AKS cluster before you can use them.

1. Set the resource group name and AKS cluster resource group name variables.

    ```azurecli-interactive
    # Set the resource group variable
    RG_NAME=myResourceGroup

    # Set the AKS cluster resource group variable
    AKS_NAME=$(az resource list --resource-group $RG_NAME --resource-type Microsoft.ContainerService/managedClusters --query "[0].name" -o tsv)
    ```

2. Enable the Azure AD Workload Identity and OIDC Issuer Endpoint features on your existing AKS cluster using the [`az aks update`][az-aks-update] command.

    ```azurecli-interactive
    az aks update \
        --resource-group $RG_NAME \
        --name $AKS_NAME \
        --enable-workload-identity \
        --enable-oidc-issuer
    ```

3. Get the AKS OIDC Issuer Endpoint URL using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    AKS_OIDC_ISSUER=$(az aks show --resource-group $RG_NAME --name $AKS_NAME --query "oidcIssuerProfile.issuerUrl" -o tsv)
    ```

## Create an Azure user-assigned managed identity

1. Create an Azure user-assigned managed identity using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    # Set the managed identity name variable
    MANAGED_IDENTITY_NAME=myIdentity

    # Create the managed identity
    az identity create \
        --resource-group $RG_NAME \
        --name $MANAGED_IDENTITY_NAME
    ```

2. Get the managed identity client ID and object ID using the [`az identity show`][az-identity-show] command.

    ```azurecli-interactive
    # Get the managed identity client ID
    MANAGED_IDENTITY_CLIENT_ID=$(az identity show --resource-group $RG_NAME --name $MANAGED_IDENTITY_NAME --query clientId -o tsv)

    # Get the managed identity object ID
    MANAGED_IDENTITY_OBJECT_ID=$(az identity show --resource-group $RG_NAME --name $MANAGED_IDENTITY_NAME --query principalId -o tsv)
    ```

3. Get the Azure OpenAI resource ID using the [`az resource list`][az-resource-list] command.

    ```azurecli-interactive
    AOAI_RESOURCE_ID=$(az resource list --resource-group $RG_NAME --resource-type Microsoft.CognitiveServices/accounts --query "[0].id" -o tsv)
    ```

4. Grant the managed identity access to the Azure OpenAI resource using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create \
        --role "Cognitive Services OpenAI User" \
        --assignee-object-id $MANAGED_IDENTITY_OBJECT_ID \
        --assignee-principal-type ServicePrincipal \
        --scope $AOAI_RESOURCE_ID
    ```

## Create an Azure AD federated credential

1. Set the federated credential, namespace, and service account variables.

    ```azurecli-interactive
    # Set the federated credential name variable
    FEDERATED_CREDENTIAL_NAME=myFederatedCredential

    # Set the namespace variable
    SERVICE_ACCOUNT_NAMESPACE=default

    # Set the service account variable
    SERVICE_ACCOUNT_NAME=ai-service-account
    ```

2. Create the federated credential using the [`az identity federated-credential create`][az-identity-federated-credential-create] command.

    ```azurecli-interactive
    az identity federated-credential create \
        --name ${FEDERATED_CREDENTIAL_NAME} \
        --resource-group ${RG_NAME} \
        --identity-name ${MANAGED_IDENTITY_NAME} \
        --issuer ${AKS_OIDC_ISSUER} \
        --subject system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}
    ```

## Use Azure AD Workload Identity on AKS

To use Azure AD Workload Identity on AKS, you need to make a few changes to the `ai-service` deployment manifest.

### Create a ServiceAccount

1. Get the kubeconfig for your cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials \
        --resource-group $RG_NAME \
        --name $AKS_NAME
    ```

2. Create a Kubernetes ServiceAccount using the [`kubectl apply`][kubectl-apply] command.

    ```azurecli-interactive
    kubectl apply -f - <<EOF
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        azure.workload.identity/client-id: ${MANAGED_IDENTITY_CLIENT_ID}
      name: ${SERVICE_ACCOUNT_NAME}
      namespace: ${SERVICE_ACCOUNT_NAMESPACE}
    EOF
    ```

### Enable Azure AD Workload Identity on the Pod

1. Set the Azure OpenAI resource name, endpoint, and deployment name variables.

    ```azurecli-interactive
    # Get the Azure OpenAI resource name
    AOAI_NAME=$(az resource list \
      --resource-group $RG_NAME \
      --resource-type Microsoft.CognitiveServices/accounts \
      --query "[0].name" -o tsv)

    # Get the Azure OpenAI endpoint
    AOAI_ENDPOINT=$(az cognitiveservices account show \
      --resource-group $RG_NAME \
      --name $AOAI_NAME \
      --query properties.endpoint -o tsv)

    # Get the Azure OpenAI deployment name
    AOAI_DEPLOYMENT_NAME=$(az cognitiveservices account deployment list  \
      --resource-group $RG_NAME \
      --name $AOAI_NAME \
      --query "[0].name" -o tsv)
    ```

2. Redeploy the `ai-service` with the ServiceAccount and the `azure.workload.identity/use` annotation set to `true` using the [`kubectl apply`][kubectl-apply] command.

    ```azurecli-interactive
    kubectl apply -f - <<EOF
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: ai-service
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: ai-service
      template:
        metadata:
          labels:
            app: ai-service
            azure.workload.identity/use: "true"
        spec:
          serviceAccountName: $SERVICE_ACCOUNT_NAME
          nodeSelector:
            "kubernetes.io/os": linux
          containers:
          - name: ai-service
            image: ghcr.io/azure-samples/aks-store-demo/ai-service:latest
            ports:
            - containerPort: 5001
            env:
            - name: USE_AZURE_OPENAI
              value: "True"
            - name: USE_AZURE_AD
              value: "True"
            - name: AZURE_OPENAI_DEPLOYMENT_NAME
              value: "${AOAI_DEPLOYMENT_NAME}"
            - name: AZURE_OPENAI_ENDPOINT
              value: "${AOAI_ENDPOINT}"
            resources:
              requests:
                cpu: 20m
                memory: 50Mi
              limits:
                cpu: 30m
                memory: 65Mi
    EOF
    ```

### Test the application

1. Verify the new pod is running using the [`kubectl get pods`][kubectl-get-pods] command.

    ```azurecli-interactive
    kubectl get pods --selector app=ai-service -w
    ```

2. Get the pod logs using the [`kubectl logs`][kubectl-logs] command. It may take a few minutes for the pod to initialize.

    ```azurecli-interactive
    kubectl logs --selector app=ai-service -f
    ```

    The following example output shows the app has initialized and is ready to accept requests. The first line suggests the code is missing configuration variables. However, the Azure Identity SDK handles this process and sets the `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` variables.

    ```output
    Incomplete environment configuration. These variables are set: AZURE_CLIENT_ID, AZURE_TENANT_ID
    INFO:     Started server process [1]
    INFO:     Waiting for application startup.
    INFO:     Application startup complete.
    INFO:     Uvicorn running on http://0.0.0.0:5001 (Press CTRL+C to quit)
    ```

3. Get the pod environment variables using the [`kubectl describe pod`][kubectl-describe-pod] command. The output demonstrates that the Azure OpenAI API key no longer exists in the Pod's environment variables.

    ```azurecli-interactive
    kubectl describe pod --selector app=ai-service
    ```

4. Open a new terminal and get the IP of the store admin service using the following `echo` command.

    ```azurecli-interactive
    echo "http://$(kubectl get svc/store-admin -o jsonpath='{.status.loadBalancer.ingress[0].ip}')"
    ```

5. Open a web browser and navigate to the IP address from the previous step.
6. Select **Products**. You should be able to add a new product and get a description for it using Azure OpenAI.

## Next steps

In this article, you learned how to secure access to Azure OpenAI from Azure Kubernetes Service (AKS) using Azure Active Directory (Azure AD) Workload Identity.

For more information on Azure AD Workload Identity, see [Azure AD Workload Identity](./workload-identity-overview.md).

<!-- Links internal -->
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-identity-create]: /cli/azure/identity#az_identity_create
[az-identity-show]: /cli/azure/identity#az_identity_show
[az-resource-list]: /cli/azure/resource#az_resource_list
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az_identity_federated_credential_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials

<!-- Links external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get-pods]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-logs]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs
[kubectl-describe-pod]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
