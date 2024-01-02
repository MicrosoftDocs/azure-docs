---
title: Autoscale AKS pods with Azure Application Gateway metrics
description: This article provides instructions on how to scale your AKS backend pods using Application Gateway metrics and Azure Kubernetes Metric Adapter
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 10/26/2023
ms.author: greglin
---

# Autoscale your AKS pods using Application Gateway Metrics (Beta)

As incoming traffic increases, it becomes crucial to scale up your applications based on the demand.

In the following tutorial, we explain how you can use Application Gateway's `AvgRequestCountPerHealthyHost` metric to scale up your application. `AvgRequestCountPerHealthyHost` measures average requests sent to a specific backend pool and backend HTTP setting combination.

Use following two components:

* [`Azure Kubernetes Metric Adapter`](https://github.com/Azure/azure-k8s-metrics-adapter) - We use the metric adapter to expose Application Gateway metrics through the metric server. The Azure Kubernetes Metric Adapter is an open source project under Azure, similar to the Application Gateway Ingress Controller. 
* [`Horizontal Pod Autoscaler`](../aks/concepts-scale.md#horizontal-pod-autoscaler) - We use HPA to use Application Gateway metrics and target a deployment for scaling.

> [!NOTE]
> The Azure Kubernetes Metrics Adapter is no longer maintained. Kubernetes Event-driven Autoscaling (KEDA) is an alternative.<br>
> Also see [Application Gateway for Containers](for-containers/overview.md).

## Setting up Azure Kubernetes Metric Adapter

1. First, create a Microsoft Entra service principal and assign it `Monitoring Reader` access over Application Gateway's resource group. 

    ```azurecli
        applicationGatewayGroupName="<application-gateway-group-id>"
        applicationGatewayGroupId=$(az group show -g $applicationGatewayGroupName -o tsv --query "id")
        az ad sp create-for-rbac -n "azure-k8s-metric-adapter-sp" --role "Monitoring Reader" --scopes applicationGatewayGroupId
    ```

1. Now, deploy the [`Azure Kubernetes Metric Adapter`](https://github.com/Azure/azure-k8s-metrics-adapter) using the Microsoft Entra service principal created previously.

    ```bash
    kubectl create namespace custom-metrics
    # use values from service principal created previously to create secret
    kubectl create secret generic azure-k8s-metrics-adapter -n custom-metrics \
        --from-literal=azure-tenant-id=<tenantid> \
        --from-literal=azure-client-id=<clientid> \
        --from-literal=azure-client-secret=<secret>
    kubectl apply -f kubectl apply -f https://raw.githubusercontent.com/Azure/azure-k8s-metrics-adapter/master/deploy/adapter.yaml -n custom-metrics
    ```

1. Create an `ExternalMetric` resource with name `appgw-request-count-metric`. This resource instructs the metric adapter to expose `AvgRequestCountPerHealthyHost` metric for `myApplicationGateway` resource in `myResourceGroup` resource group. You can use the `filter` field to target a specific backend pool and backend HTTP setting in the Application Gateway.

    ```yaml
    apiVersion: azure.com/v1alpha2
    kind: ExternalMetric
    metadata:
    name: appgw-request-count-metric
    spec:
        type: azuremonitor
        azure:
            resourceGroup: myResourceGroup # replace with your application gateway's resource group name
            resourceName: myApplicationGateway # replace with your application gateway's name
            resourceProviderNamespace: Microsoft.Network
            resourceType: applicationGateways
        metric:
            metricName: AvgRequestCountPerHealthyHost
            aggregation: Average
            filter: BackendSettingsPool eq '<backend-pool-name>~<backend-http-setting-name>' # optional
    ```

You can now make a request to the metric server to see if our new metric is getting exposed:
```bash
kubectl get --raw "/apis/external.metrics.k8s.io/v1beta1/namespaces/default/appgw-request-count-metric"
# Sample Output
# {
#   "kind": "ExternalMetricValueList",
#   "apiVersion": "external.metrics.k8s.io/v1beta1",
#   "metadata":
#     {
#       "selfLink": "/apis/external.metrics.k8s.io/v1beta1/namespaces/default/appgw-request-count-metric",
#     },
#   "items":
#     [
#       {
#         "metricName": "appgw-request-count-metric",
#         "metricLabels": null,
#         "timestamp": "2019-11-05T00:18:51Z",
#         "value": "30",
#       },
#     ],
# }
```

## Using the new metric to scale up the deployment

Once we're able to expose `appgw-request-count-metric` through the metric server, we're ready to use [`Horizontal Pod Autoscaler`](../aks/concepts-scale.md#horizontal-pod-autoscaler) to scale up our target deployment.

In following example, we target a sample deployment `aspnet`. We scale up Pods when `appgw-request-count-metric` > 200 per Pod up to a max of `10` Pods.

Replace your target deployment name and apply the following auto scale configuration:
```yaml
apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: deployment-scaler
spec:
  scaleTargetRef:
    apiVersion: networking.k8s.io/v1
    kind: Deployment
    name: aspnet # replace with your deployment's name
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: External
    external:
      metricName: appgw-request-count-metric
      targetAverageValue: 200
```

Test your setup by using a load test tool like apache bench:
```bash
ab -n10000 http://<applicaiton-gateway-ip-address>/
```

## Next steps
- [**Troubleshoot Ingress Controller issues**](ingress-controller-troubleshoot.md): Troubleshoot any issues with the Ingress Controller.
