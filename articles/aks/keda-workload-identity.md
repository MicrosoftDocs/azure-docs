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

## Create an Azure Service Bus

1. Create an Azure Service Bus namespace using the [`az servicebus namespace create`][az-servicebus-namespace-create] command. Make sure to replace the placeholder value with your own value.

    ```azurecli-interactive
    SB_NAME=<service-bus-name>
    SB_HOSTNAME="${SB_NAME}.servicebus.windows.net"

    az servicebus namespace create \
        --name $SB_NAME \
        --resource-group $RG_NAME \
        --disable-local-auth
    ```

1. Create an Azure Service Bus queue using the [`az servicebus queue create`][az-servicebus-queue-create] command. Make sure to replace the placeholder value with your own value.

    ```azurecli-interactive
    SB_QUEUE_NAME=<service-bus-queue-name>

    az servicebus queue create \
        --name $SB_QUEUE_NAME \
        --namespace $SB_NAME \
        --resource-group $RG_NAME
    ```

## Create a managed identity

1. Create a managed identity using the [`az identity create`][az-identity-create] command. Make sure to replace the placeholder value with your own value.

    ```azurecli-interactive
    MI_NAME=<managed-identity-name>

    MI_CLIENT_ID=$(az identity create \
        --name $MI_NAME \
        --resource-group $RG_NAME \
        --query "clientId" \
        --output tsv)
    ```

1. Get the OIDC issuer URL using the [`az aks show`][az-aks-show] command with the `--query` flag set to `oidcIssuerProfile.issuerUrl`.

    ```azurecli-interactive
    AKS_OIDC_ISSUER=$(az aks show \
        --name $AKS_NAME \
        --resource-group $RG_NAME \
        --query oidcIssuerProfile.issuerUrl \
        --output tsv)
    ```

1. Create a federated credential between the managed identity and the namespace and service account used by the workload using the [`az identity federated-credential create`][az-identity-federated-credential-create] command. Make sure to replace the placeholder value with your own value.

    ```azurecli-interactive
    FED_WORKLOAD=<federated-credential-workload-name>

    az identity federated-credential create \
        --name $FED_WORKLOAD \
        --identity-name $MI_NAME \
        --resource-group $RG_NAME \
        --issuer $AKS_OIDC_ISSUER \
        --subject system:serviceaccount:default:$MI_NAME \
        --audience api://AzureADTokenExchange
    ```

1. Create a second federated credential between the managed identity and the namespace and service account used by the keda-operator using the [`az identity federated-credential create`][az-identity-federated-credential-create] command. Make sure to replace the placeholder value with your own value.
  
    ```azurecli-interactive
    FED_KEDA=<federated-credential-keda-name>

    az identity federated-credential create \
        --name $FED_KEDA \
        --identity-name $MI_NAME \
        --resource-group $RG_NAME \
        --issuer $AKS_OIDC_ISSUER \
        --subject system:serviceaccount:kube-system:keda-operator \
        --audience api://AzureADTokenExchange
    ```

## Create role assignments

1. Get the object ID for the managed identity using the [`az identity show`][az-identity-show] command with the `--query` flag set to `"principalId"`.

    ```azurecli-interactive
    MI_OBJECT_ID=$(az identity show \
        --name $MI_NAME \
        --resource-group $RG_NAME \
        --query "principalId" \
        --output tsv)
    ```

1. Get the Service Bus namespace resource ID using the [`az servicebus namespace show`][az-servicebus-namespace-show] command with the `--query` flag set to `"id"`.

    ```azurecli-interactive
    SB_ID=$(az servicebus namespace show \
        --name $SB_NAME \
        --resource-group $RG_NAME \
        --query "id" \
        --output tsv)
    ```

1. Assign the Azure Service Bus Data Owner role to the managed identity using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create \
        --role "Azure Service Bus Data Owner" \
        --assignee-object-id $MI_OBJECT_ID \
        --assignee-principal-type ServicePrincipal \
        --scope $SB_ID
    ```

## Enable Workload Identity on KEDA operator

1. After creating the federated credential for the `keda-operator` ServiceAccount, you will need to manually restart the `keda-operator` pods to ensure Workload Identity environment variables are injected into the pod.

    ```azurecli-interactive
    kubectl rollout restart deploy keda-operator -n kube-system
    ``` 

1. Confirm the keda-operator pods restart
    ```azurecli-interactive
    kubectl get pod -n kube-system -lapp=keda-operator -w
    ````

1. Once you've confirmed the keda-operator pods have finished rolling hit `Ctrl+c` to break the previous watch command then confirm the Workload Identity environment variables have been injected.
    
    ```azurecli-interactive
    KEDA_POD_ID=$(kubectl get po -n kube-system -l app.kubernetes.io/name=keda-operator -ojsonpath='{.items[0].metadata.name}')
    kubectl describe po $KEDA_POD_ID -n kube-system
    ```

1. You should see output similar to the following under **Environment**.

    ```text
    ---
    AZURE_CLIENT_ID:
    AZURE_TENANT_ID:               xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx
    AZURE_FEDERATED_TOKEN_FILE:    /var/run/secrets/azure/tokens/azure-identity-token
    AZURE_AUTHORITY_HOST:          https://login.microsoftonline.com/
    ---
    ```

1. Deploy a KEDA TriggerAuthentication resource that includes the User-Assigned Managed Identity's Client ID.

    ```azurecli-interactive
    kubectl apply -f - <<EOF
    apiVersion: keda.sh/v1alpha1
    kind: TriggerAuthentication
    metadata:
      name: azure-servicebus-auth
      namespace: default  # this must be same namespace as the ScaledObject/ScaledJob that will use it
    spec:
      podIdentity:
        provider:  azure-workload
        identityId: $MI_CLIENT_ID
    EOF
    ```

    > [!note]
    > With the TriggerAuthentication in place, KEDA will be able to authenticate via workload identity. The `keda-operator` Pods use the `identityId` to authenticate against Azure resources when evaluating scaling triggers.

## Publish messages to Azure Service Bus

At this point everything is configured for scaling with KEDA and Microsoft Entra Workload Identity. We will test this by deploying producer and consumer workloads.

1. Create a new ServiceAccount for the workloads.

    ```azurecli-interactive
    kubectl apply -f - <<EOF
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        azure.workload.identity/client-id: $MI_CLIENT_ID
      name: $MI_NAME
    EOF
    ```

1. Deploy a Job to publish 100 messages.

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
          serviceAccountName: $MI_NAME
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
              value: $SB_QUEUE_NAME
            - name: AZURE_SERVICEBUS_HOSTNAME
              value: $SB_HOSTNAME
          restartPolicy: Never
    EOF
    ````

## Consume messages from Azure Service Bus

Now that we have published messages to the Azure Service Bus queue, we will deploy a ScaledJob to consume the messages. This ScaledJob will use the KEDA TriggerAuthentication resource to authenticate against the Azure Service Bus queue using the workload identity and scale out every 10 messages.

1. Deploy a ScaledJob resource to consume the messages. The scale trigger will be configured to scale out every 10 messages. The KEDA scaler will create 10 jobs to consume the 100 messages.

    ```azurecli-interactive
    kubectl apply -f - <<EOF
    apiVersion: keda.sh/v1alpha1
    kind: ScaledJob
    metadata:
      name: myconsumer-scaledjob
    spec:
      jobTargetRef:
        template:
          metadata:
            labels:
              azure.workload.identity/use: "true"
          spec:
            serviceAccountName: $MI_NAME
            containers:
            - image: ghcr.io/azure-samples/aks-app-samples/servicebusdemo:latest
              name: myconsumer
              env:
              - name: OPERATION_MODE
                value: "consumer"
              - name: MESSAGE_COUNT
                value: "10"
              - name: AZURE_SERVICEBUS_QUEUE_NAME
                value: $SB_QUEUE_NAME
              - name: AZURE_SERVICEBUS_HOSTNAME
                value: $SB_HOSTNAME
            restartPolicy: Never
      triggers:
      - type: azure-servicebus
        metadata:
          queueName: $SB_QUEUE_NAME
          namespace: $SB_NAME
          messageCount: "10"
        authenticationRef:
          name: azure-servicebus-auth
    EOF
    ```

    > [!note]
    > ScaledJob creates a Kubernetes Job resource whenever a scaling event occurs and thus a Job template needs to be passed in when creating the resource. As new Jobs are created, Pods will be deployed with workload identity bits to consume messages.

1. Verify the KEDA scaler worked as intended.

    ```azurecli-interactive
    kubectl describe scaledjob myconsumer-scaledjob
    ```

1. You should see events similar to the following.

    ```text
    Events:
    Type     Reason              Age   From           Message
    ----     ------              ----  ----           -------
    Normal   KEDAScalersStarted  10m   scale-handler  Started scalers watch
    Normal   ScaledJobReady      10m   keda-operator  ScaledJob is ready for scaling
    Warning  KEDAScalerFailed    10m   scale-handler  context canceled
    Normal   KEDAJobsCreated     10m   scale-handler  Created 10 jobs
    ```

## Clean up resources

After you verify that the deployment is successful, you can clean up the resources to avoid incurring Azure costs.

1. Delete the Azure resource group and all resources in it using the [`az group delete`][az-group-delete] command.

    ```azurecli-interactive
    az group delete --name $RG_NAME --yes --no-wait
    ```

## Next steps

This article showed you how to securely scale your applications using the KEDA add-on and workload identity in AKS.

For information on KEDA troubleshooting, see [Troubleshoot the Kubernetes Event-driven Autoscaling (KEDA) add-on][keda-troubleshoot].

To learn more about KEDA, see the [upstream KEDA docs][keda].

<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[keda-troubleshoot]: /troubleshoot/azure/azure-kubernetes/troubleshoot-kubernetes-event-driven-autoscaling-add-on?context=/azure/aks/context/aks-context
[aks-firewall-requirements]: outbound-rules-control-egress.md#azure-global-required-network-rules
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-servicebus-namespace-create]: /cli/azure/servicebus/namespace#az-servicebus-namespace-create
[az-servicebus-queue-create]: /cli/azure/servicebus/queue#az-servicebus-queue-create
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az-identity-federated-credential-create
[az-role-definition-list]: /cli/azure/role/definition#az-role-definition-list
[az-identity-show]: /cli/azure/identity#az-identity-show
[az-servicebus-namespace-show]: /cli/azure/servicebus/namespace#az-servicebus-namespace-show
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl
[keda-sample]: https://github.com/kedacore/sample-dotnet-worker-servicebus-queue
[keda]: https://keda.sh/docs/2.12/
[kubectl-apply]: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply/
[kubectl-describe]: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_describe/
[kubectl-logs]: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/
[kubectl-get]: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/
[kubectl-rollout-restart]: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_restart/

