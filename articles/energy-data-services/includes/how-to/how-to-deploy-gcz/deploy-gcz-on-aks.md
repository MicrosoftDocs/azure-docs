---
title: Deploy Geospatial Consumption Zone on top of Azure Data Manager for Energy using Azure portal
description: Learn how to deploy Geospatial Consumption Zone on top of your Azure Data Manager for Energy instance using the Azure portal.
ms.service: energy-data-services
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.author: eihaugho
author: EirikHaughom
ms.date: 05/30/2024
---

## Deploy Geospatial Consumption Zone (GCZ) on Azure Kubernetes Service (AKS)

Learn how to deploy Geospatial Consumption Zone (GCZ) on Azure Kubernetes Service (AKS).

> [!IMPORTANT]
> The current deployment of GCZ using AKS is limited to a default configuration of included schemas, please see [OSDU GitLab](https://community.opengroup.org/osdu/platform/consumption/geospatial/-/blob/master/devops/azure/transformer/application.yml) for information regarding the supported schemas. To add or change schemas (i.e. newer versions) a custom container image will need to be created.

## Prerequisites

- Azure Subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free).
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
    # Define the variables for Azure Data Manager for Energy
    AZURE_DNS_NAME="<instanceName>.energy.azure.com"  # Example: demo.energy.azure.com
    DATA_PARTITION_ID="<dataPartitionId>" # Data partition ID. Example: opendes
    AZURE_TENANT_ID="<tenantId>" # Entra ID tenant ID. Example: 557963fb-ede7-4a88-9e3e-19ace7f1e36b 
    AZURE_CLIENT_ID="<clientId>" # App Registration client ID. Example: b149dc73-ed8c-4ad3-bbaf-882a208f87eb
    AZURE_CLIENT_SECRET="<clientSecret>" # App Registration client secret.
    CALLBACK_URL="http://localhost:5050" #ie: http://localhost:8080

    # Define the variables for AKS
    AKS_NAME="<aksName>" # Name of the AKS cluster. Example: gcz-aks-cluster.
    RESOURCE_GROUP="<resourceGroupName>" # Name of the resource group. Example: gcz-rg.
    NAMESPACE="ignite" # Name of the AKS namespace you want to deploy to. We recommend to leave it default.
    GCZ_IGNITE_SERVICE="ignite-service" # Name of the ignite service. We recommend to leave it default.
    GCZ_IGNITE_NAMESPACE=$NAMESPACE
    CHART=osdu-gcz-service
    VERSION=0.1.0
    ```

    ### [Windows PowerShell](#tab/windows-powershell)

    ```powershell
    # Define the variables for Azure Data Manager for Energy
    $ADME_DNS_NAME="<instanceName>.energy.azure.com"  # Example: demo.energy.azure.com
    $DATA_PARTITION_ID="<dataPartitionId>" # Data partition ID. Example: opendes
    $AZURE_TENANT_ID="<tenantId>" # Entra ID tenant ID. Example: 557963fb-ede7-4a88-9e3e-19ace7f1e36b
    $AZURE_CLIENT_ID="<clientId>" # App Registration client ID. Example: b149dc73-ed8c-4ad3-bbaf-882a208f87eb
    $AZURE_CLIENT_SECRET="<clientSecret>" # App Registration client secret.
    $CALLBACK_URL="http://localhost:5050" #ie: http://localhost:8080

    # Define the variables for AKS
    $AKS_NAME = "<aksName>" # Name of the AKS cluster. Example: gcz-aks-cluster.
    $RESOURCE_GROUP = "<resourceGroupName>" # Name of the resource group. Example: gcz-rg.
    $NAMESPACE="ignite" # Name of the AKS namespace you want to deploy to. We recommend to leave it default.
    $GCZ_IGNITE_SERVICE="ignite-service" # Name of the ignite service. We recommend to leave it default.
    $GCZ_IGNITE_NAMESPACE=$NAMESPACE
    $CHART="osdu-gcz-service"
    $VERSION="0.1.0"
    ```

1. Create the HELM chart:
    ### [Unix Shell](#tab/unix-shell)

    ```bash
    cat > osdu_gcz_custom_values.yaml << EOF
    # This file contains the essential configs for the gcz on azure helm chart

    ################################################################################
    # Specify the values for each service.
    #
    global:
    ignite:
        namespace: $NAMESPACE
        name: ignite
        image:
        name: community.opengroup.org:5555/osdu/platform/consumption/geospatial/gridgain-community
        tag: 8.8.34
        configuration:
        gcz_ignite_namespace: "$GCZ_IGNITE_NAMESPACE"
        gcz_ignite_service: "$GCZ_IGNITE_SERVICE"
    provider:
        namespace: $NAMESPACE
        image:
        repository: community.opengroup.org:5555
        name: osdu/platform/consumption/geospatial/geospatial-provider-master
        tag: latest
        service:
        type: LoadBalancer
        annotations:
            service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    transformer:
        namespace: $NAMESPACE
        image:
        repository: community.opengroup.org:5555
        name: osdu/platform/consumption/geospatial/geospatial-transformer-master
        tag: latest
        service:
        type: LoadBalancer
        annotations:
            service.beta.kubernetes.io/azure-load-balancer-internal: "true"
        configuration:
        datapartitionid: $DATA_PARTITION_ID
        clientId: $AZURE_CLIENT_ID
        tenantId: $AZURE_TENANT_ID
        callbackURL: $CALLBACK_URL
        searchQueryURL: "https://$AZURE_DNS_NAME/api/search/v2/query"
        searchCursorURL: "https://$AZURE_DNS_NAME/api/search/v2/query_with_cursor"
        schemaURL: "https://$AZURE_DNS_NAME/api/schema-service/v1/schema"
        entitlementsURL: "https://$AZURE_DNS_NAME/api/entitlements/v2"
        fileRetrievalURL: "https://$AZURE_DNS_NAME/api/dataset/v1/retrievalInstructions"
        crsconvertorURL: "https://$AZURE_DNS_NAME/api/crs/converter/v3/convertTrajectory"
        storageURL: "https://$AZURE_DNS_NAME/api/storage/v2/records"
        clientSecret: $(echo "$AZURE_CLIENT_SECRET" | base64)
        gcz_ignite_namespace: "$GCZ_IGNITE_NAMESPACE"
        gcz_ignite_service: "$GCZ_IGNITE_SERVICE"   
    EOF
    ```
    ### [Windows PowerShell](#tab/windows-powershell)

    ```powershell
    @"
    # This file contains the essential configs for the gcz on azure helm chart

    ################################################################################
    # Specify the values for each service.
    #
    global:
    ignite:
        namespace: $NAMESPACE
        name: ignite
        image:
        name: community.opengroup.org:5555/osdu/platform/consumption/geospatial/gridgain-community
        tag: 8.8.34
        configuration:
        gcz_ignite_namespace: "$GCZ_IGNITE_NAMESPACE"
        gcz_ignite_service: "$GCZ_IGNITE_SERVICE"
    provider:
        namespace: $NAMESPACE
        image:
        repository: community.opengroup.org:5555
        name: osdu/platform/consumption/geospatial/geospatial-provider-master
        tag: latest
        service:
        type: LoadBalancer
        annotations:
            service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    transformer:
        namespace: $NAMESPACE
        image:
        repository: community.opengroup.org:5555
        name: osdu/platform/consumption/geospatial/geospatial-transformer-master
        tag: latest
        service:
        type: LoadBalancer
        annotations:
            service.beta.kubernetes.io/azure-load-balancer-internal: "true"
        configuration:
        datapartitionid: $DATA_PARTITION_ID
        clientId: $AZURE_CLIENT_ID
        tenantId: $AZURE_TENANT_ID
        callbackURL: $CALLBACK_URL
        searchQueryURL: "https://$AZURE_DNS_NAME/api/search/v2/query"
        searchCursorURL: "https://$AZURE_DNS_NAME/api/search/v2/query_with_cursor"
        schemaURL: "https://$AZURE_DNS_NAME/api/schema-service/v1/schema"
        entitlementsURL: "https://$AZURE_DNS_NAME/api/entitlements/v2"
        fileRetrievalURL: "https://$AZURE_DNS_NAME/api/dataset/v1/retrievalInstructions"
        crsconvertorURL: "https://$AZURE_DNS_NAME/api/crs/converter/v3/convertTrajectory"
        storageURL: "https://$AZURE_DNS_NAME/api/storage/v2/records"
        clientSecret: $(echo "$AZURE_CLIENT_SECRET" | base64)
        gcz_ignite_namespace: "$GCZ_IGNITE_NAMESPACE"
        gcz_ignite_service: "$GCZ_IGNITE_SERVICE"
    "@ | Out-File -FilePath osdu_gcz_custom_values.yaml
    ```

1. Change service type to `LoadBalancer` for the `provider` and `transformer` services configuration files.

    ### [Unix Shell](#tab/unix-shell)

    ```bash
    cat > ../provider/templates/service.yaml << EOF
    apiVersion: v1
    kind: Service
    metadata:
        name: gcz-provider
        namespace: {{ $.Values.global.provider.namespace }}
        annotations:
            {{- range $key, $value := $.Values.global.provider.service.annotations }}
            {{ $key }}: {{ $value | quote }}
            {{- end }}
    spec:
        selector:
            app: provider
        ports:
        - port: 80
            protocol: TCP
            targetPort: 8083
        type: {{ $.Values.global.provider.service.type }}
    EOF

    cat > ../transformer/templates/service.yaml << EOF
    apiVersion: v1
    kind: Service
    metadata:
        name: gcz-transformer
        namespace: {{ $.Values.global.transformer.namespace }}
        annotations:
            {{- range $key, $value := $.Values.global.transformer.service.annotations }}
            {{ $key }}: {{ $value | quote }}
            {{- end }}
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

    ### [Windows PowerShell](#tab/windows-powershell)

    ```powershell
    @"
    apiVersion: v1
    kind: Service
    metadata:
        name: gcz-provider
        namespace: {{ $.Values.global.provider.namespace }}
        annotations:
            {{- range $key, $value := $.Values.global.provider.service.annotations }}
            {{ $key }}: {{ $value | quote }}
            {{- end }}
    spec:
        selector:
            app: provider
        ports:
        - port: 80
            protocol: TCP
            targetPort: 8083
        type: {{ $.Values.global.provider.service.type }}
    "@ | Out-File -FilePath ../provider/templates/service.yaml

    @"
    apiVersion: v1
    kind: Service
    metadata:
        name: gcz-transformer
        namespace: {{ $.Values.global.transformer.namespace }}
        annotations:
            {{- range $key, $value := $.Values.global.transformer.service.annotations }}
            {{ $key }}: {{ $value | quote }}
            {{- end }}
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
1. Authenticate to the Azure Kubernetes Service (AKS) cluster:

    ```bash
    az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME --admin
    ```

1. Deploy HELM dependencies:

    ```bash
    helm dependency build
    ```

1. Deploy the GCZ HELM chart:

    ```bash
    helm install $CHART ../$CHART --values osdu_gcz_custom_values.yaml
    ```

1. Verify the deployment:

    ```bash
    kubectl get pods -n $NAMESPACE
    ```

    Now you should see the pods for the `ignite`, `provider`, and `transformer` services.

1. Next get note the External IPs for the `provider` and `transformer` services.

    ```bash
    kubectl get service -n $NAMESPACE
    ```

    These IPs are used to connect to the GCZ API endpoints.
