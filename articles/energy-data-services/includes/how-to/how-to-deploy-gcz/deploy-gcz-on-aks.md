---
title: Deploy Geospatial Consumption Zone on top of Azure Data Manager for Energy using Azure portal
description: Learn how to deploy Geospatial Consumption Zone on top of your Azure Data Manager for Energy instance using the Azure portal.
ms.service: azure-data-manager-energy
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.author: eihaugho
author: EirikHaughom
ms.date: 05/30/2024
---

## Deploy Geospatial Consumption Zone (GCZ) on Azure Kubernetes Service (AKS)

Learn how to deploy Geospatial Consumption Zone (GCZ) on Azure Kubernetes Service (AKS).

## Prerequisites

- Azure Subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Azure Kubernetes Cluster (AKS) with virtual network integration. See [Create an Azure Kubernetes Service (AKS) cluster](/azure/aks/tutorial-kubernetes-deploy-cluster) and [Azure Container Networking Interface (CNI) networking](/azure/aks/azure-cni-overview) for further instructions.
- [Azure Cloud Shell](/azure/cloud-shell/overview) or [Azure CLI](/cli/azure/install-azure-cli), kubectl, and Git CLI.

## Deploy Geospatial Consumption Zone (GCZ) HELM Chart

1. Clone the GCZ repository to your local environment:

   ```bash
   git clone https://community.opengroup.org/osdu/platform/consumption/geospatial.git
   ```

1. Change directory to the `geospatial` folder:

   ```bash
   cd geospatial/devops/azure/charts/geospatial
   ```

1. Define variables for the deployment:

   ### [Unix Shell](#tab/unix-shell)

   ```bash
   # OSDU / Azure Identity Configuration
   export AZURE_DNS_NAME="<YOUR_OSDU_INSTANCE_FQDN>"  # Example: osdu-ship.msft-osdu-test.org
   export AZURE_TENANT_ID="<TENANT_ID_of_target_OSDU_deployment>"   # Entra ID tenant ID. Example: aaaabbbb-0000-cccc-1111-dddd2222eeee
   export AZURE_CLIENT_ID="<CLIENT_ID_of_target_OSDU_deployment>"  # App Registration client ID. Example: 00001111-aaaa-2222-bbbb-3333cccc4444
   export AZURE_CLIENT_SECRET="<CLIENT_SECRET_of_target_OSDU_deployment>"  # App Registration client secret. Example: Aa1Bb~2Cc3.-Dd4Ee5Ff6Gg7Hh8Ii9_Jj0Kk1Ll2
   export CLIENT_SECRET_B64=$(echo -n "$AZURE_CLIENT_SECRET" | base64 -w0)
   export AZURE_APP_ID="<CLIENT_ID_of_the_app-id_for_authentication>"
   export AZURE_KEY_VAULT_URL="<YOUR_AZURE_KEYVAULT_URL>"

   # OAuth Redirect URL
   export CALLBACK_URL="<CALLBACK_URL_configured_in_Entra_ID_App>"  # Example: http://localhost:8080
   export PRIVATE_NETWORK="true"

   # Container Registry + GCZ Images
   export AZURE_ACR="msosdu.azurecr.io"
   export GCZ_PROVIDER_IMAGE_NAME="geospatial-provider"
   export GCZ_PROVIDER_IMAGE_TAG="0.28.2"
   export GCZ_TRANSFORMER_IMAGE_NAME="geospatial-transformer"
   export GCZ_TRANSFORMER_IMAGE_TAG="0.28.2"

   # Istio Configuration (Enable ONLY if Istio exists on AKS)
   export ISTIO_ENABLED="false"
   export ISTIO_GCZ_DNS_HOST="<YOUR_GCZ_ISTIO_HOSTNAME>"   # Example: gcz.contoso.com
   export ISTIO_GATEWAY_NAME="<YOUR_ISTIO_GATEWAY_NAME>"   # Example: istio-system/ingressgateway

   # Data Partition for GCZ
   export DATA_PARTITION_ID="<YOUR_DATA_PARTITION_ID>"  # Example: opendes
   export SCOPE="<SCOPE_of_AppRegistration>"            # Example: 00001111-aaaa-2222-bbbb-3333cccc4444/.default

   # AKS Deployment Configuration
   export RESOURCE_GROUP="<YOUR_AKS_RESOURCE_GROUP>"
   export AKS_NAME="<YOUR_AKS_CLUSTER_NAME>"
   export NAMESPACE="ignite"  # Recommended default namespace
   export GCZ_IGNITE_SERVICE="osdu-gcz-service-gridgain-headless"  # Default Ignite Service name
   export GCZ_IGNITE_NAMESPACE="$NAMESPACE"

   # Helm Release Settings
   export CHART="osdu-gcz-service"
   export CHART_VERSION="1.28.0"
   export VERSION="0.28.2"  
   ```

   ### [Windows PowerShell](#tab/windows-powershell)

   ```powershell
   # GCZ Deployment Environment Variables

   # OSDU / Azure Identity Configuration
   $AZURE_DNS_NAME="<YOUR_OSDU_INSTANCE_FQDN>"  # Example: osdu-ship.msft-osdu-test.org
   $AZURE_TENANT_ID="<TENANT_ID_of_target_OSDU_deployment>"  # Entra ID tenant ID. Example: aaaabbbb-0000-cccc-1111-dddd2222eeee
   $AZURE_CLIENT_ID="<CLIENT_ID_of_target_OSDU_deployment>"  # App Registration client ID. Example: 00001111-aaaa-2222-bbbb-3333cccc4444
   $AZURE_CLIENT_SECRET="<CLIENT_SECRET_of_target_OSDU_deployment>"  # App Registration client secret. Example: Aa1Bb~2Cc3.-
   $CLIENT_SECRET_B64=$(echo -n "$CLIENT_SECRET" | base64 -w0)
   $AZURE_APP_ID="<CLIENT_ID_of_the_app-id_for_authentication>"
   $AZURE_KEY_VAULT_URL="<YOUR_AZURE_KEYVAULT_URL>"

   # OAuth Redirect URL
   $CALLBACK_URL="<CALLBACK_URL_configured_in_Entra_ID_App>" # Example: http://localhost:8080
   $PRIVATE_NETWORK="true"

   # Container Registry + GCZ Image Configuration
   $AZURE_ACR="msosdu.azurecr.io"
   $GCZ_PROVIDER_IMAGE_NAME="geospatial-provider"
   $GCZ_PROVIDER_IMAGE_TAG="0.28.2"
   $GCZ_TRANSFORMER_IMAGE_NAME="geospatial-transformer"
   $GCZ_TRANSFORMER_IMAGE_TAG="0.28.2"
   PROVIDER_IMAGE_REPO=myregistry.azurecr.io/provider
   PROVIDER_IMAGE_NAME=gcz-provider
   PROVIDER_IMAGE_TAG=v1.0.0
   IGNITE_IMAGE_REPO=myregistry.azurecr.io/gridgain
   IGNITE_IMAGE_NAME=ignite
   IGNITE_IMAGE_TAG=8.9.11
   TRANSFORMER_IMAGE_REPO=myregistry.azurecr.io/transformer
   TRANSFORMER_IMAGE_NAME=gcz-transformer
   TRANSFORMER_IMAGE_TAG=v1.0.0

   # Istio Configuration (Enable ONLY if Istio exists on AKS)
   $ISTIO_ENABLED="false"
   $ISTIO_GCZ_DNS_HOST="<YOUR_GCZ_ISTIO_HOSTNAME>"   # Example: gcz.contoso.com
   $ISTIO_GATEWAY_NAME="<YOUR_ISTIO_GATEWAY_NAME>"   # Example: istio-system/ingressgateway

   # Data Partition
   $DATA_PARTITION_ID="<YOUR_DATA_PARTITION_ID>"  # Example: opendes
   $SCOPE="<SCOPE_of_AppRegistration>"

   # AKS Deployment Details
   $RESOURCE_GROUP="<YOUR_AKS_RESOURCE_GROUP>"
   $AKS_NAME="<YOUR_AKS_CLUSTER_NAME>"
   $NAMESPACE="ignite"
   $GCZ_IGNITE_SERVICE="osdu-gcz-service-gridgain-headless"
   $GCZ_IGNITE_NAMESPACE=$NAMESPACE

   # Helm Release Details
   $CHART="osdu-gcz-service"
   $CHART_VERSION="1.28.0"
   $VERSION="0.28.2"
   ```
1. Create the HELM chart:
 
   ### [Unix Shell](#tab/unix-shell-1)
 
   ```bash
   $ cat > osdu_gcz_custom_values.yaml << EOF
   # This file contains the essential configs for Azure GCZ helm chart deployment
   ################################################################################
   # Specify the values for each service.
   #
   global:
     provider:
       entitlementsGroupsURL: "https://${AZURE_DNS_NAME}/api/entitlements/v2/groups"
       image:
         repository: "$AZURE_ACR"
         name: "$GCZ_PROVIDER_IMAGE_NAME"
         tag: "$GCZ_PROVIDER_IMAGE_TAG"
       gcz_ignite_service: $GCZ_IGNITE_SERVICE
       service:
         port: 8083
         targetPort: 8083
       configuration:   # <-- moved here under provider
         privateNetwork: "$PRIVATE_NETWORK"
         dataPartitionId: $DATA_PARTITION_ID
         clientId: $AZURE_CLIENT_ID
         tenantId: $AZURE_TENANT_ID
         callbackURL: $CALLBACK_URL
         keyvaultURL: $AZURE_KEY_VAULT_URL
         searchQueryURL: "https://${AZURE_DNS_NAME}/api/search/v2/query"
         searchCursorURL: "https://${AZURE_DNS_NAME}/api/search/v2/query_with_cursor"
         schemaURL: "https://${AZURE_DNS_NAME}/api/schema-service/v1/schema"
         entitlementsURL: "https://${AZURE_DNS_NAME}/api/entitlements/v2"
         fileRetrievalURL: "https://${AZURE_DNS_NAME}/api/dataset/v1/retrievalInstructions"
         crsconvertorURL: "https://${AZURE_DNS_NAME}/api/crs/converter/v3/convertTrajectory"
         storageURL: "https://${AZURE_DNS_NAME}/api/storage/v2/records"
         partitionURL: http://partition.osdu-azure/api/partition/v1
         gcz_persistence_enabled: true
         azureAppResourceId: $AZURE_APP_ID
         gcz_ignite_service: $GCZ_IGNITE_SERVICE
      transformer:
       image:
         repository: "$AZURE_ACR"
         name: "$GCZ_TRANSFORMER_IMAGE_NAME"
         tag: "$GCZ_TRANSFORMER_IMAGE_TAG"
       serviceAccount: "osdu-gcz-service-gridgain"
       service:
         port: 8080
         targetPort: 8080
       configuration:
         secretName: gcz-client-secret
         configuration:
         dataPartitionId: $DATA_PARTITION_ID
         clientId: $AZURE_CLIENT_ID
         tenantId: $AZURE_TENANT_ID
         callbackURL: $CALLBACK_URL
         keyvaultURL: $AZURE_KEY_VAULT_URL
         searchQueryURL: "https://${AZURE_DNS_NAME}/api/search/v2/query"
         searchCursorURL: "https://${AZURE_DNS_NAME}/api/search/v2/query_with_cursor"
         schemaURL: "https://${AZURE_DNS_NAME}/api/schema-service/v1/schema"
         entitlementsURL: "https://${AZURE_DNS_NAME}/api/entitlements/v2"
         fileRetrievalURL: "https://${AZURE_DNS_NAME}/api/dataset/v1/retrievalInstructions"
         crsconvertorURL: "https://${AZURE_DNS_NAME}/api/crs/converter/v3/convertTrajectory"
         storageURL: "https://${AZURE_DNS_NAME}/api/storage/v2/records"
         partitionURL: http://partition.osdu-azure/api/partition/v1
         clientSecret: $(echo -n "${AZURE_CLIENT_SECRET}" | base64)
         gcz_persistence_enabled: true
         azureAppResourceId: $AZURE_APP_ID
         gcz_ignite_service: $GCZ_IGNITE_SERVICE
     istio:
       enabled: $ISTIO_ENABLED
       gateways:
         - istio-system/$ISTIO_GATEWAY_NAME
       cors: {}
       dns_host: ${ISTIO_GCZ_DNS_HOST}
   EOF
   ```

   ### [Windows PowerShell](#tab/windows-powershell-1)
 
   ```powershell
   @"
   # GCZ Configuration - Azure Deployment
   global:
    provider:
     entitlementsGroupsURL: "https://${AZURE_DNS_NAME}/api/entitlements/v2/groups"
     image:
       repository: "${AZURE_ACR}"
       name: "${GCZ_PROVIDER_IMAGE_NAME}"
       tag: "${GCZ_PROVIDER_IMAGE_TAG}"
     gcz_ignite_service: "${GCZ_IGNITE_SERVICE}"
     service:
       port: 8083
       targetPort: 8083
     configuration:
       privateNetwork: "${PRIVATE_NETWORK}"
       dataPartitionId: "${DATA_PARTITION_ID}"
       clientId: "${AZURE_CLIENT_ID}"
       tenantId: "${AZURE_TENANT_ID}"
       callbackURL: "${CALLBACK_URL}"
       keyvaultURL: "${AZURE_KEY_VAULT_URL}"
       searchQueryURL: "https://${AZURE_DNS_NAME}/api/search/v2/query"
       searchCursorURL: "https://${AZURE_DNS_NAME}/api/search/v2/query_with_cursor"
       schemaURL: "https://${AZURE_DNS_NAME}/api/schema-service/v1/schema"
       entitlementsURL: "https://${AZURE_DNS_NAME}/api/entitlements/v2"
       fileRetrievalURL: "https://${AZURE_DNS_NAME}/api/dataset/v1/retrievalInstructions"
       crsconvertorURL: "https://${AZURE_DNS_NAME}/api/crs/converter/v3/convertTrajectory"
       storageURL: "https://${AZURE_DNS_NAME}/api/storage/v2/records"
       partitionURL: "http://partition.osdu-azure/api/partition/v1"
       gcz_persistence_enabled: true
       azureAppResourceId: "${AZURE_APP_ID}"
       gcz_ignite_service: "${GCZ_IGNITE_SERVICE}"
   transformer:
     image:
       repository: "${AZURE_ACR}"
       name: "${GCZ_TRANSFORMER_IMAGE_NAME}"
       tag: "${GCZ_TRANSFORMER_IMAGE_TAG}"
     serviceAccount: "osdu-gcz-service-gridgain"
     service:
       port: 8080
       targetPort: 8080
     configuration:
       secretName: "gcz-client-secret"
       dataPartitionId: "${DATA_PARTITION_ID}"
       clientId: "${AZURE_CLIENT_ID}"
       tenantId: "${AZURE_TENANT_ID}"
       callbackURL: "${CALLBACK_URL}"
       keyvaultURL: "${AZURE_KEY_VAULT_URL}"
       searchQueryURL: "https://${AZURE_DNS_NAME}/api/search/v2/query"
       searchCursorURL: "https://${AZURE_DNS_NAME}/api/search/v2/query_with_cursor"
       schemaURL: "https://${AZURE_DNS_NAME}/api/schema-service/v1/schema"
       entitlementsURL: "https://${AZURE_DNS_NAME}/api/entitlements/v2"
       fileRetrievalURL: "https://${AZURE_DNS_NAME}/api/dataset/v1/retrievalInstructions"
       crsconvertorURL: "https://${AZURE_DNS_NAME}/api/crs/converter/v3/convertTrajectory"
       storageURL: "https://${AZURE_DNS_NAME}/api/storage/v2/records"
       partitionURL: "http://partition.osdu-azure/api/partition/v1"
       clientSecret: "${CLIENT_SECRET_B64}"
       gcz_persistence_enabled: true
       azureAppResourceId: "${AZURE_APP_ID}"
       gcz_ignite_service: "${GCZ_IGNITE_SERVICE}"
   istio:
     enabled: "${ISTIO_ENABLED}"
     gateways:
       - "istio-system/${ISTIO_GATEWAY_NAME}"
     cors: {}
     dns_host: "${ISTIO_GCZ_DNS_HOST}"
   "@ | Out-File -FilePath osdu_gcz_custom_values.yaml
   ```

1. Change service type to `LoadBalancer` for the `provider` services configuration files.

   ### [Unix Shell](#tab/unix-shell-2)

   ```bash
   $ cat > ../transformer/templates/service.yaml << EOF
   apiVersion: v1
   kind: Service
   metadata:
    name: gcz-provider
    namespace: {{ $.Values.global.provider.namespace }}
    annotations:
      service.beta.kubernetes.io/azure-load-balancer-internal: "{{ $.Values.global.provider.configuration.privateNetwork }}"
   spec:
    selector:
     app: provider
    ports:
     - port: 80
       protocol: TCP
       targetPort: 8083
    type: {{ $.Values.global.provider.service.type }}
   EOF
   ```

   ### [Windows PowerShell](#tab/windows-powershell-2)

   ```powershell
   @"
    apiVersion: v1
    kind: Service
    metadata:
    name: gcz-provider
    namespace: {{ $.Values.global.provider.namespace }}
    annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "{{ $.Values.global.provider.configuration.privateNetwork }}"
    spec:
    selector:
        app: provider
    ports:
    - port: 80
      protocol: TCP
      targetPort: 8083
    type: {{ $.Values.global.provider.service.type }}
   "@ | Out-File -FilePath ../provider/templates/service.yaml
   ```
   
1. Change service type to `LoadBalancer` for the `transformer` services configuration files.

   ### [Unix Shell](#tab/unix-shell-3)
   
   ```bash
   $ cat > ../transformer/templates/service.yaml << EOF
   apiVersion: v1
   kind: Service
   metadata:
    name: gcz-transformer
    namespace: {{ $.Values.global.transformer.namespace }}
    annotations:
      service.beta.kubernetes.io/azure-load-balancer-internal: "{{ $.Values.global.transformer.configuration.privateNetwork }}"
   spec:
    selector:
     app: transformer
    ports:
     - port: 80
       protocol: TCP
       targetPort: 8080
    type: {{ $.Values.global.transformer.service.type }}
   EOF
   ```

   ### [Windows PowerShell](#tab/windows-powershell-3)

   ```powershell       
   @"
   apiVersion: v1
   kind: Service
   metadata:
    name: gcz-transformer
    namespace: {{ $.Values.global.transformer.namespace }}
    annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "{{ $.Values.global.transformer.configuration.privateNetwork }}"
    spec:
    selector:
        app: transformer
    ports:
    - port: 80
      protocol: TCP
      targetPort: 8080
    type: {{ $.Values.global.transformer.service.type }}
   "@ | Out-File -FilePath ../transformer/templates/service.yaml
   ```
   
1. Review the transformer configuration file `application.yml` to ensure the correct schemas are included.

   ```bash
   nano ../transformer/application.yml
   ```

1. Review the provider configuration file `koop-config.json`.

   ```bash
   nano ../provider/koop-config.json
   ```

1. Authenticate to the Azure Kubernetes Service (AKS) cluster:

   ```bash
   az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME --admin
   ```

1. Create AKS Namespace:

   ```bash
   kubectl create namespace $NAMESPACE
   ```

1. Deploy HELM dependencies:

   ```bash
   helm dependency build
   ```

1. Create the secret in AKS:

   ```bash
   kubectl create secret generic client-secret -n ignite \
   --from-literal=clientSecret="$CLIENT_SECRET"
   ```

1. Deploy the GCZ HELM chart:

   ```bash
   helm upgrade -i "$CHART" . -n ignite \
   -f osdu_gcz_custom_values.yaml \
   --set-string global.transformer.configuration.clientSecret="$CLIENT_SECRET_B64"
   ```

1. Verify the deployment:

   ```bash
   kubectl get pods -n $NAMESPACE
   ```

   Now you should see the pods for the `ignite`, `provider`, `gridgain`, and `transformer` services.

1. Next get note the External IPs for the `provider` and `transformer` services.

   ```bash
   kubectl get service -n $NAMESPACE
   ```
   
1. Test the gcz-provider endpoint by port forwarding

   ```bash
   kubectl port-forward -n $NAMESPACE service/gcz-provider 8083:8083
   curl "http://localhost:8083/ignite-provider/FeatureServer/layers/info"   
   ```
   
1. If you encounter issues with the gcz-provider endpoint, try restarting the deployment

   ```bash
   kubectl rollout restart deployment gcz-provider -n $NAMESPACE
   ```
   
1. Test the gcz-transformer endpoint by port forwarding

   ```bash
   kubectl port-forward -n $NAMESPACE service/gcz-transformer 8080:8080
   curl "http://localhost:8080/gcz/transformer/admin/v3/api-docs"
   ```
   
1. If you encounter issues with the gcz-transformer endpoint, try restarting the deployment

   ```bash
   kubectl rollout restart deployment gcz-transformer -n $NAMESPACE
   ```
   These IPs are used to connect to the GCZ API endpoints.

   

> [!IMPORTANT]
> If you wish to update the configuration files (e.g., `application.yml` or `koop-config.json`), you must update the AKS configuration (configmap) and then delete the existing pods for the `provider` and `transformer` services. The pods will be recreated with the new configuration. If you change the configuration using the GCZ APIs, the changes **will not** persist after a pod restart.
