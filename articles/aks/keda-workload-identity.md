---
title: Securely scale your applications using the Kubernetes Event-driven Autoscaling (KEDA) add-on and workload identity
description: Learn how to securely scale your applications using the KEDA add-on and workload identity on Azure Kubernetes Service (AKS).
ms.service: azure-kubernetes-service
author: qpetraroia
ms.author: qpetraroia
ms.topic: how-to
ms.date: 07/08/2024
ms.custom: template-how-to
---

# Securely scale your applications using the KEDA add-on and workload identity on Azure Kubernetes Service (AKS)

This article shows you how to securely scale your applications with the Kubernetes Event-driven Autoscaling (KEDA) add-on and workload identity on Azure Kubernetes Service (AKS).

[!INCLUDE [Current version callout](./includes/keda/current-version-callout.md)]

## Before you begin

- You need an Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- You need the [Azure CLI installed](/cli/azure/install-azure-cli).
- Ensure you have firewall rules configured to allow access to the Kubernetes API server. For more information, see [Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters][aks-firewall-requirements].

[!INCLUDE [KEDA workload ID callout](./includes/keda/keda-workload-identity-callout.md)]

## Create a resource group

* Create a resource group using the [`az group create`][az-group-create] command. Make sure you replace the placeholder values with your own values.

    ```azurecli-interactive
    LOCATION=<azure-region>
    RG_NAME=<resource-group-name>

    az group create --name $RG_NAME --location $LOCATION
    ```

## Create an AKS cluster

1. Create an AKS cluster with the KEDA add-on, workload identity, and OIDC issuer enabled using the [`az aks create`][az-aks-create] command with the `--enable-workload-identity`, `--enable-keda`, and `--enable-oidc-issuer` flags. Make sure you replace the placeholder value with your own value.

    ```azurecli-interactive
    AKS_NAME=<cluster-name>

    az aks create \
        --name $AKS_NAME \
        --resource-group $RG_NAME \
        --enable-workload-identity \
        --enable-oidc-issuer \
        --enable-keda \
        --generate-ssh-keys 
    ```

1. Validate the deployment was successful and make sure the cluster has KEDA, workload identity, and OIDC issuer enabled using the [`az aks show`][az-aks-show] command with the `--query` flag set to `"[workloadAutoScalerProfile, securityProfile, oidcIssuerProfile]"`.

    ```azurecli-interactive
    az aks show \
        --name $AKS_NAME \
        --resource-group $RG_NAME \
        --query "[workloadAutoScalerProfile, securityProfile, oidcIssuerProfile]"
    ```

1. Connect to the cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials \
        --name $AKS_NAME \
        --resource-group $RG_NAME \
        --overwrite-existing
    ```

## Deploy Azure Service Bus

    ```azurecli-interactive
    SB_NAME=sb-keda-demo-$RANDOM

    SB_HOSTNAME=$(az servicebus namespace create \
        -n $SB_NAME \
        -g $RG_NAME \
        --disable-local-auth \
        --query serviceBusEndpoint \
        -o tsv | sed -e 's/https:\/\///' -e 's/:443\///')
    
    az servicebus queue create \
        --name myqueue \
        --namespace $SB_NAME \
        --resource-group $RG_NAME
    ```

## Use Azure Identity to send messages

Create a managed identity

    ```azurecli-interactive
    MI_NAME="${SB_NAME}-identity"

    MI_CLIENT_ID=$(az identity create \
        --name $MI_NAME \
        --resource-group $RG_NAME \
        --query "clientId" \
        -o tsv)
    ```

Create two federated credentials for the managed identity. One for the namespace and service account that the workloads will be using and another for the namespace and service account that the keda-operator will be using (note: AKS will create a ServiceAccount when installing the KEDA addon)

    ```azurecli-interactive
    AKS_OIDC_ISSUER=$(az aks show \
        --name $AKS_NAME \
        --resource-group $RG_NAME \
        --query oidcIssuerProfile.issuerUrl \
        -o tsv)

# federated credential for workload
    az identity federated-credential create \
        --name fid-workload \
        --identity-name $MI_NAME \
        --resource-group $RG_NAME \
        --issuer $AKS_OIDC_ISSUER \
        --subject system:serviceaccount:default:$MI_NAME \
        --audience api://AzureADTokenExchange
  
# federated credential for keda-operator
    az identity federated-credential create \
        --name fid-keda-op \
        --identity-name $MI_NAME \
        --resource-group $RG_NAME \
        --issuer $AKS_OIDC_ISSUER \
        --subject system:serviceaccount:kube-system:keda-operator \
        --audience api://AzureADTokenExchange
    ```

Assign the managed identity and yourself the Azure Service Bus Data Owner role

    ```azurecli-interactive
    ROLE_ID=$(az role definition list -n "Azure Service Bus Data Owner" \
        --query "[].id" -o tsv)

    MI_OBJECT_ID=$(az identity show \
        --name $MI_NAME \
        --resource-group $RG_NAME \
        --query "principalId" \
        -o tsv)

    SB_ID=$(az servicebus namespace show \
        -n $SB_NAME \
        -g $RG_NAME \
        --query "id" \
        -o tsv)

    az role assignment create \
        --role $ROLE_ID \
        --assignee-object-id $MI_OBJECT_ID \
        --assignee-principal-type ServicePrincipal \
        --scope $SB_ID
  
    az role assignment create \
        --role $ROLE_ID \
        --assignee-object-id $(az ad signed-in-user show --query id -o tsv) \
        --assignee-principal-type User \
        --scope $SB_ID
    ```


### Deploy a message sender to AKS

Clone the sample app

    ```azurecli-interactive
    git clone git@github.com:pauldotyu/go-azure-service-bus-sender.git
    cd go-azure-service-bus-sender
    ```

Publish the receiver to ttl.sh

    ```azurecli-interactive
    export KO_DOCKER_REPO=ttl.sh
    export IMG=$(ko build . --tags=4h)
    ```

Deploy a sender

    ```azurecli-interactive
    kubectl apply -f - <<EOF
    apiVersion: v1
    kind: ServiceAccount
    metadata:
    name: $MI_NAME
    annotations:
        azure.workload.identity/client-id: $MI_CLIENT_ID
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
    labels:
        app: mysender
    name: mysender
    spec:
    replicas: 1
    selector:
        matchLabels:
        app: mysender
    template:
        metadata:
        labels:
            app: mysender
            azure.workload.identity/use: "true"
        spec:
        serviceAccount: $MI_NAME
        containers:
        - name: go-azure-service-bus-sender
            image: $IMG
            resources: {}
            env:
            - name: AZURE_SERVICEBUS_HOSTNAME
            value: $SB_HOSTNAME
            - name: AZURE_SERVICEBUS_QUEUE_NAME
            value: myqueue
            - name: BATCH_SIZE
            value: "1"
    EOF
    ```

Ensure the environment variables for workload identity was injected into the sender pod

    ```azurecli-interactive
    POD_ID=$(kubectl get po -lapp=mysender -o jsonpath='{.items[0].metadata.name}')
    kubectl describe pod $POD_ID
    ```

Follow the logs

    ```azurecli-interactive
    kubectl logs $POD_ID -f
    ```

## Scale the workload using KEDA

Get the KEDA version

```azurecli-interactive
kubectl get deploy -n kube-system keda-operator -ojsonpath='{.metadata.labels.app\.kubernetes\.io/version}'
```

Ensure the keda operators have the proper env vars

```azurecli-interactive
kubectl get po -n kube-system -l app.kubernetes.io/name=keda-operator
```

Check on one of the keda-operator pods and see if the azure identity values have been injected into the pod

```azurecli-interactive
POD_ID=$(kubectl get po -n kube-system -l app.kubernetes.io/name=keda-operator -ojsonpath='{.items[0].metadata.name}')
kubectl describe po $POD_ID -n kube-system
```

If the following values are missing, restart the deployment

```azurecli-interactive
AZURE_CLIENT_ID:
AZURE_TENANT_ID:             4f2c4f7e-805b-4624-ac65-ae0275a28c03
AZURE_FEDERATED_TOKEN_FILE: /var/run/secrets/azure/tokens/azure-identity-token
AZURE_AUTHORITY_HOST: https://login.microsoftonline.com/
```

Restart the deployment then you will see them injected into the pods

```azurecli-interactive
kubectl rollout restart deploy keda-operator -n kube-system
```

Deploy a scaler of your choosing (LINK TO SCALER)

Create a trigger authentication

```azurecli-interactive
kubectl apply -f - <<EOF
apiVersion: keda.sh/v1alpha1
kind: TriggerAuthentication
metadata:
  name: azure-servicebus-auth
  namespace: default # must be same namespace as the ScaledObjec
spec:
   podIdentity:
       provider:  azure-workload  # Optional. Default: none
       identityId: $MI_CLIENT_ID
EOF
```

Create a scaledobject to scale 

```azurecli-interactive
kubectl apply -f - <<EOF
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: myreceiver-scaledobject
  namespace: default
spec:
  scaleTargetRef:
    name: myreceiver
  triggers:
  - type: azure-servicebus
    metadata:
      queueName: myqueue
      namespace: $SB_NAME
    authenticationRef:
        name: azure-servicebus-auth
EOF
```

Run this command to check the status of the scaled object

```azurecli-interactive
kubectl describe scaledobject myreceiver-scaledobject
```

## Next steps

This article showed you how to ise KEDA and Workload Identity to scale workloads on AKS.

With the KEDA add-on installed on your cluster, you can [deploy a sample application][keda-sample] to start scaling apps.

For information on KEDA troubleshooting, see [Troubleshoot the Kubernetes Event-driven Autoscaling (KEDA) add-on][keda-troubleshoot].

To learn more, view the [upstream KEDA docs][keda].

<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-aks-create]: /cli/azure/aks#az-aks-create
[keda-troubleshoot]: /troubleshoot/azure/azure-kubernetes/troubleshoot-kubernetes-event-driven-autoscaling-add-on?context=/azure/aks/context/aks-context
[aks-firewall-requirements]: outbound-rules-control-egress.md#azure-global-required-network-rules
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-group-create]: /cli/azure/group#az-group-create
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl
[keda-sample]: https://github.com/kedacore/sample-dotnet-worker-servicebus-queue
[keda]: https://keda.sh/docs/2.12/

