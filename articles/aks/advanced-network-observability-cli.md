---
title: "Set up Advanced Network Observability for Azure Kubernetes Service (AKS) - Azure managed Prometheus and Grafana"
description: Get started with Advanced Network Observability for your AKS cluster using Azure managed Prometheus and Grafana.
author: Khushbu-Parekh
ms.author: kparekh
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: how-to
ms.date: 05/10/2024
ms.custom: template-how-to-pattern, devx-track-azurecli
---

# Set up Advanced Network Observability for Azure Kubernetes Service (AKS) - Azure managed Prometheus and Grafana (Preview)

This article shows you how to set up Advanced Network Observability for Azure Kubernetes Service (AKS) using Managed Prometheus and Grafana to visualize the scraped metrics.

You can use Advanced Network Observability to collect data about the network traffic of your AKS clusters. It enables a centralized platform for monitoring application and network health. Currently, metrics are stored in Prometheus and Grafana can be used to visualize them. Advanced Network Observability also offers the ability to enable Hubble. These capabilities are supported for both Cilium and non-Cilium clusters. 

Advanced Network Observability is one of the features of Advanced Container Networking Services. For more information about Advanced Container Networking Services for Azure Kubernetes Service (AKS), see [What is Advanced Container Networking Services for Azure Kubernetes Service (AKS)?](advanced-container-networking-services-overview.md).

> [!IMPORTANT]
> Advanced Network Observability is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

* An Azure account with an active subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
[!INCLUDE [azure-CLI-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

* The minimum version of Azure CLI required for the steps in this article is 2.56.0. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).


### Install the `aks-preview` Azure CLI extension

Install or update the Azure CLI preview extension using the [`az extension add`](/cli/azure/extension#az_extension_add) or [`az extension update`](/cli/azure/extension#az_extension_update) command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register the `AdvancedNetworkingPreview` feature flag

Register the `az feature register --namespace "Microsoft.ContainerService" --name "AdvancedNetworkingPreview"
` feature flag using the [`az feature register`](/cli/azure/feature#az_feature_register) command.

```azurecli-interactive 
az feature register --namespace "Microsoft.ContainerService" --name "AdvancedNetworkingPreview"
```
Verify successful registration using the [`az feature show`](/cli/azure/feature#az_feature_show) command. It takes a few minutes for the registration to complete.
    
```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "AdvancedNetworkingPreview"
```

Once the feature shows `Registered`, refresh the registration of the `Microsoft.ContainerService` resource provider using the [`az provider register`](/cli/azure/provider#az_provider_register) command.

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group using the [`az group create`](/cli/azure/group#az_group_create) command.

```azurecli-interactive
# Set environment variables for the resource group name and location. Make sure to replace the placeholders with your own values.
export RESOURCE_GROUP="<resource-group-name>"
export LOCATION="<azure-region>"

# Create a resource group
az group create --name $RESOURCE_GROUP --location $LOCATION
```

## Create an AKS cluster with Advanced Network Observability

### [**Non-Cilium**](#tab/non-cilium)
Create an AKS cluster with Advanced Network Observability with a non-Cilium data plane using the [`az aks create`](/cli/azure/aks#az_aks_create) command and the `--enable-advanced-networking-observability` flag.
    
```azurecli-interactive
# Set an environment variable for the AKS cluster name. Make sure to replace the placeholder with your own value.
export CLUSTER_NAME="<aks-cluster-name>"

# Create an AKS cluster
az aks create \
    --name $CLUSTER_NAME \
    --resource-group $RESOURCE_GROUP \
    --generate-ssh-keys \
    --network-plugin azure \
    --network-plugin-mode overlay \
    --pod-cidr 192.168.0.0/16 \
    --enable-advanced-network-observability
```
    
### [**Cilium**](#tab/cilium)

Create an AKS cluster with Advanced Network Observability with a Cilium data plane using the [`az aks create`](/cli/azure/aks#az_aks_create) command and the `--enable-advanced-networking-observability` flag.

> [!NOTE]
> Clusters with the Cilium data plane support Advanced Network Observability starting with Kubernetes version 1.29.


```azurecli-interactive
# Set an environment variable for the AKS cluster name. Make sure to replace the placeholder with your own value.
export CLUSTER_NAME="<aks-cluster-name>"

# Create an AKS cluster
az aks create \
    --name $CLUSTER_NAME \
    --resource-group $RESOURCE_GROUP \
    --generate-ssh-keys \
    --location eastus \
    --max-pods 250 \
    --network-plugin azure \
    --network-plugin-mode overlay \
    --network-dataplane cilium \
    --node-count 2 \
    --pod-cidr 192.168.0.0/16 \
    --kubernetes-version 1.29 \
    --enable-advanced-network-observability
```

---

## Enable Advanced Network Observability on an existing cluster

Enable Advanced Network Observability on an existing cluster using the [`az aks update`](/cli/azure/aks#az_aks_update) command.

> [!NOTE]
> Clusters with the Cilium data plane support Advanced Network Observability starting with Kubernetes version 1.29.

```azurecli-interactive
az aks update \
    --resource-group $RESOURCE_GROUP \
    --name $CLUSTER_NAME \
    --enable-advanced-network-observability
```
    
## Get cluster credentials 

Get your cluster credentials using the [`az aks get-credentials`](/cli/azure/aks#az_aks_get_credentials) command.

```azurecli-interactive
az aks get-credentials --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP
```

## Azure managed Prometheus and Grafana

Use the following example to install and enable Prometheus and Grafana for your AKS cluster.

### Create Azure Monitor resource

```azurecli-interactive
#Set an environment variable for the Grafana name. Make sure to replace the placeholder with your own value.
export AZURE_MONITOR_NAME="<azure-monitor-name>"

# Create Azure monitor resource
az resource create \
    --resource-group $RESOURCE_GROUP \
    --namespace microsoft.monitor \
    --resource-type accounts \
    --name $AZURE_MONITOR_NAME \
    --location eastus \
    --properties '{}'
```

### Create Grafana instance

Use [az grafana create](/cli/azure/grafana#az-grafana-create) to create a Grafana instance. The name of the Grafana instance must be unique.

```azurecli-interactive
# Set an environment variable for the Grafana name. Make sure to replace the placeholder with your own value.
export GRAFANA_NAME="<grafana-name>"

# Create Grafana instance
az grafana create \
    --name $GRAFANA_NAME \
    --resource-group $RESOURCE_GROUP 
```

### Place the Grafana and Azure Monitor resource IDs in variables

Use [az grafana show](/cli/azure/grafana#az-grafana-show) to place the Grafana resource ID in a variable. Use [az resource show](/cli/azure/resource#az-resource-show) to place the Azure Monitor resource ID in a variable. Replace **myGrafana** with the name of your Grafana instance.

```azurecli-interactive
grafanaId=$(az grafana show \
                --name $GRAFANA_NAME \
                --resource-group $RESOURCE_GROUP \
                --query id \
                --output tsv)
azuremonitorId=$(az resource show \
                    --resource-group $RESOURCE_GROUP \
                    --name $AZURE_MONITOR_NAME \
                    --resource-type "Microsoft.Monitor/accounts" \
                    --query id \
                    --output tsv)
```

### Link Azure Monitor and Grafana to the AKS cluster

Use [az aks update](/cli/azure/aks#az-aks-update) to link the Azure Monitor and Grafana resources to your AKS cluster.

```azurecli-interactive
az aks update \
    --name $CLUSTER_NAME \
    --resource-group $RESOURCE_GROUP \
    --enable-azure-monitor-metrics \
    --azure-monitor-workspace-resource-id $azuremonitorId \
    --grafana-resource-id $grafanaId
```

## Visualization using Grafana

> [!NOTE]
> The `hubble_flows_processed_total` metric isn't scraped by default due to high metric cardinality in large scale clusters. 
> Because of this, the *Pods Flows* dashboards have panels with missing data. To change this, you can modify the ama metrics settings to include `hubble_flows_processed_total` in the metric keep list. To learn how to do this, see the [Minimal Ingestion Doumentation](../../articles/azure-monitor/containers/prometheus-metrics-scrape-configuration-minimal.md).
> 

1. Make sure the Azure Monitor pods are running using the `kubectl get pods` command.

    ```azurecli-interactive
    kubectl get pods -o wide -n kube-system | grep ama-
    ```
    
    Your output should look similar to the following example output:
    
    ```output
    ama-metrics-5bc6c6d948-zkgc9          2/2     Running   0 (21h ago)   26h
    ama-metrics-ksm-556d86b5dc-2ndkv      1/1     Running   0 (26h ago)   26h
    ama-metrics-node-lbwcj                2/2     Running   0 (21h ago)   26h
    ama-metrics-node-rzkzn                2/2     Running   0 (21h ago)   26h
    ama-metrics-win-node-gqnkw            2/2     Running   0 (26h ago)   26h
    ama-metrics-win-node-tkrm8            2/2     Running   0 (26h ago)   26h
    ```

1. We have created sample dashboards. They can be found under the **Dashboards > Azure Managed Prometheus** folder. They have names like **"Kubernetes / Networking / `<name>`"**. The suite of dashboards includes:
      * **Clusters:** shows Node-level metrics for your clusters.
      * **DNS (Cluster):** shows DNS metrics on a cluster or selection of Nodes.
      * **DNS (Workload):** shows DNS metrics for the specified workload (e.g. Pods of a DaemonSet or Deployment such as CoreDNS).
      * **Drops (Workload):** shows drops to/from the specified workload (e.g. Pods of a Deployment or DaemonSet).
      * **Pod Flows (Namespace):** shows L4/L7 packet flows to/from the specified namespace (i.e. Pods in the
      Namespace).
      * **Pod Flows (Workload):** shows L4/L7 packet flows to/from the specified workload (e.g. Pods of a Deployment or DaemonSet).

> [!NOTE] 
> * Cilium data plane does not currently support DNS metrics/dashboards.

## Install Hubble CLI

Install the Hubble CLI to access the data it collects using the following commands:

```azurecli-interactive
# Set environment variables
export HUBBLE_VERSION=0.11  
export HUBBLE_ARCH=amd64

#Install Hubble CLI
if [ "$(uname -m)" = "aarch64" ]; then HUBBLE_ARCH=arm64; fi
curl -L --fail --remote-name-all https://github.com/cilium/hubble/releases/download/$HUBBLE_VERSION/hubble-linux-${HUBBLE_ARCH}.tar.gz{,.sha256sum}
sha256sum --check hubble-linux-${HUBBLE_ARCH}.tar.gz.sha256sum
sudo tar xzvfC hubble-linux-${HUBBLE_ARCH}.tar.gz /usr/local/bin
rm hubble-linux-${HUBBLE_ARCH}.tar.gz{,.sha256sum}
```

## Visualize the Hubble Flows

1. Make sure the Hubble pods are running using the `kubectl get pods` command.

    ```azurecli-interactive
    kubectl get pods -o wide -n kube-system -l k8s-app=hubble-relay
    ```
    
    Your output should look similar to the following example output:
    
    ```output
    hubble-relay-7ddd887cdb-h6khj     1/1  Running     0       23h 
    ```
    
1. Port forward Hubble Relay using the `kubectl port-forward` command.
    
    ```azurecli-interactive
    kubectl port-forward -n kube-system svc/hubble-relay --address 127.0.0.1 4245:443
    ```
    
1. Mutual TLS (mTLS) ensures the security of the Hubble Relay server. To enable the Hubble client to retrieve flows, you need to get the appropriate certificates and configure the client with them. Apply the certificates using the following commands:

    ```azurecli-interactive
    #!/usr/bin/env bash
    
    set -euo pipefail
    set -x
    
    # Directory where certificates will be stored
    CERT_DIR="$(pwd)/.certs"
    mkdir -p "$CERT_DIR"
    
    declare -A CERT_FILES=(
      ["tls.crt"]="tls-client-cert-file"
      ["tls.key"]="tls-client-key-file"
      ["ca.crt"]="tls-ca-cert-files"
    )
    
    for FILE in "${!CERT_FILES[@]}"; do
      KEY="${CERT_FILES[$FILE]}"
      JSONPATH="{.data['${FILE//./\\.}']}"
    
      # Retrieve the secret and decode it
      kubectl get secret hubble-relay-client-certs -n kube-system \
        -o jsonpath="${JSONPATH}" | \
        base64 -d > "$CERT_DIR/$FILE"
    
      # Set the appropriate hubble CLI config
      hubble config set "$KEY" "$CERT_DIR/$FILE"
    done
        
    hubble config set tls true
    hubble config set tls-server-name instance.hubble-relay.cilium.io
    ```

1. Verify the secrets were generated using the following `kubectl get secrets` command:
    ```azurecli-interactive
    kubectl get secrets -n kube-system | grep hubble-
    ```

    Your output should look similar to the following example output:

    ```output
    kube-system     hubble-relay-client-certs     kubernetes.io/tls     3     9d
    
    kube-system     hubble-relay-server-certs     kubernetes.io/tls     3     9d
    
    kube-system     hubble-server-certs           kubernetes.io/tls     3     9d    
    ```

1. Make sure the Hubble Relay pod is running using the `hubble relay service` command.

    ```azurecli-interactive
    hubble relay service 
    ```

## Visualize using Hubble UI

1. To use Hubble UI, save the following into hubble-ui.yaml
    ```yml
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: hubble-ui
      namespace: kube-system
    ---
    kind: ClusterRole
    apiVersion: rbac.authorization.k8s.io/v1
    metadata:
      name: hubble-ui
      labels:
        app.kubernetes.io/part-of: retina
    rules:
      - apiGroups:
          - networking.k8s.io
        resources:
          - networkpolicies
        verbs:
          - get
          - list
          - watch
      - apiGroups:
          - ""
        resources:
          - componentstatuses
          - endpoints
          - namespaces
          - nodes
          - pods
          - services
        verbs:
          - get
          - list
          - watch
      - apiGroups:
          - apiextensions.k8s.io
        resources:
          - customresourcedefinitions
        verbs:
          - get
          - list
          - watch
      - apiGroups:
          - cilium.io
        resources:
          - "*"
        verbs:
          - get
          - list
          - watch
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
      name: hubble-ui
      labels:
        app.kubernetes.io/part-of: retina
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: hubble-ui
    subjects:
      - kind: ServiceAccount
        name: hubble-ui
        namespace: kube-system
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: hubble-ui-nginx
      namespace: kube-system
    data:
      nginx.conf: |
        server {
            listen       8081;
            server_name  localhost;
            root /app;
            index index.html;
            client_max_body_size 1G;
            location / {
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                # CORS
                add_header Access-Control-Allow-Methods "GET, POST, PUT, HEAD, DELETE, OPTIONS";
                add_header Access-Control-Allow-Origin *;
                add_header Access-Control-Max-Age 1728000;
                add_header Access-Control-Expose-Headers content-length,grpc-status,grpc-message;
                add_header Access-Control-Allow-Headers range,keep-alive,user-agent,cache-control,content-type,content-transfer-encoding,x-accept-content-transfer-encoding,x-accept-response-streaming,x-user-agent,x-grpc-web,grpc-timeout;
                if ($request_method = OPTIONS) {
                    return 204;
                }
                # /CORS
                location /api {
                    proxy_http_version 1.1;
                    proxy_pass_request_headers on;
                    proxy_hide_header Access-Control-Allow-Origin;
                    proxy_pass http://127.0.0.1:8090;
                }
                location / {
                    try_files $uri $uri/ /index.html /index.html;
                }
                # Liveness probe
                location /healthz {
                    access_log off;
                    add_header Content-Type text/plain;
                    return 200 'ok';
                }
            }
        }
    ---
    kind: Deployment
    apiVersion: apps/v1
    metadata:
      name: hubble-ui
      namespace: kube-system
      labels:
        k8s-app: hubble-ui
        app.kubernetes.io/name: hubble-ui
        app.kubernetes.io/part-of: retina
    spec:
      replicas: 1
      selector:
        matchLabels:
          k8s-app: hubble-ui
      template:
        metadata:
          labels:
            k8s-app: hubble-ui
            app.kubernetes.io/name: hubble-ui
            app.kubernetes.io/part-of: retina
        spec:
          serviceAccount: hibble-ui
          serviceAccountName: hubble-ui
          automountServiceAccountToken: true
          containers:
          - name: frontend
            image: mcr.microsoft.com/oss/cilium/hubble-ui:v0.12.2   
            imagePullPolicy: Always
            ports:
            - name: http
              containerPort: 8081
            livenessProbe:
              httpGet:
                path: /healthz
                port: 8081
            readinessProbe:
              httpGet:
                path: /
                port: 8081
            resources: {}
            volumeMounts:
            - name: hubble-ui-nginx-conf
              mountPath: /etc/nginx/conf.d/default.conf
              subPath: nginx.conf
            - name: tmp-dir
              mountPath: /tmp
            terminationMessagePolicy: FallbackToLogsOnError
            securityContext: {}
          - name: backend
            image: mcr.microsoft.com/oss/cilium/hubble-ui-backend:v0.12.2
            imagePullPolicy: Always
            env:
            - name: EVENTS_SERVER_PORT
              value: "8090"
            - name: FLOWS_API_ADDR
              value: "hubble-relay:443"
            - name: TLS_TO_RELAY_ENABLED
              value: "true"
            - name: TLS_RELAY_SERVER_NAME
              value: ui.hubble-relay.cilium.io
            - name: TLS_RELAY_CA_CERT_FILES
              value: /var/lib/hubble-ui/certs/hubble-relay-ca.crt
            - name: TLS_RELAY_CLIENT_CERT_FILE
              value: /var/lib/hubble-ui/certs/client.crt
            - name: TLS_RELAY_CLIENT_KEY_FILE
              value: /var/lib/hubble-ui/certs/client.key
            livenessProbe:
              httpGet:
                path: /healthz
                port: 8090
            readinessProbe:
              httpGet:
                path: /healthz
                port: 8090
            ports:
            - name: grpc
              containerPort: 8090
            resources: {}
            volumeMounts:
            - name: hubble-ui-client-certs
              mountPath: /var/lib/hubble-ui/certs
              readOnly: true
            terminationMessagePolicy: FallbackToLogsOnError
            securityContext: {}
          nodeSelector:
            kubernetes.io/os: linux 
          volumes:
          - configMap:
              defaultMode: 420
              name: hubble-ui-nginx
            name: hubble-ui-nginx-conf
          - emptyDir: {}
            name: tmp-dir
          - name: hubble-ui-client-certs
            projected:
              defaultMode: 0400
              sources:
              - secret:
                  name: hubble-relay-client-certs
                  items:
                    - key: tls.crt
                      path: client.crt
                    - key: tls.key
                      path: client.key
                    - key: ca.crt
                      path: hubble-relay-ca.crt
    ---
    kind: Service
    apiVersion: v1
    metadata:
      name: hubble-ui
      namespace: kube-system
      labels:
        k8s-app: hubble-ui
        app.kubernetes.io/name: hubble-ui
        app.kubernetes.io/part-of: retina
    spec:
      type: ClusterIP
      selector:
        k8s-app: hubble-ui
      ports:
        - name: http
          port: 80
          targetPort: 8081
    ```

1. Apply the hubble-ui.yaml manifest to your cluster, using the following command 
    ```azurecli-interactive
    kubectl apply -f hubble-ui.yaml
    ```

1. Set up port forwarding for Hubble UI using the `kubectl port-forward` command.

    ```azurecli-interactive
    kubectl port-forward svc/hubble-ui 12000:80
    ```

1. Access Hubble UI by entering `http://localhost:12000/` into your web browser.

---

## Clean up resources

If you don't plan on using this application, delete the other resources you created in this article using the [`az group delete`](/cli/azure/#az_group_delete) command.

```azurecli-interactive
  az group delete --name $RESOURCE_GROUP
```

## Next steps

In this how-to article, you learned how to install and enable Advanced Network Observability for your AKS cluster.

* For more information about Advanced Container Networking Services for Azure Kubernetes Service (AKS), see [What is Advanced Container Networking Services for Azure Kubernetes Service (AKS)?](advanced-container-networking-services-overview.md).

* To create an Advanced Network Observability - BYO Prometheus and Grafana, see [Setup Advanced Network Observability for Azure Kubernetes Service (AKS) - BYO Prometheus and Grafana](advanced-network-observability-bring-your-own-cli.md).

