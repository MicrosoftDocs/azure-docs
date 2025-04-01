---
title: Autoscale AKS pods with Azure Application Gateway metrics
description: This article provides instructions on how to scale your AKS backend pods by using Application Gateway metrics and the Azure Kubernetes Metrics Adapter.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 9/17/2024
ms.author: greglin
---

# Autoscale your AKS pods by using Application Gateway metrics

As incoming traffic increases, it becomes crucial to scale up your applications based on the demand.

This article explains how you can use the `AvgRequestCountPerHealthyHost` metric in Azure Application Gateway to scale up Azure Kubernetes Service (AKS) pods for an application. The `AvgRequestCountPerHealthyHost` metric measures average requests sent to a specific combination of a backend pool and a backend HTTP setting.

Use the following two components:

- [Azure Kubernetes Metrics Adapter](https://github.com/Azure/azure-k8s-metrics-adapter): You use this component to expose Application Gateway metrics through the metric server. It's an open-source project under Azure, similar to the Application Gateway Ingress Controller.
- [Horizontal Pod Autoscaler](/azure/aks/concepts-scale#horizontal-pod-autoscaler): You use this component to apply Application Gateway metrics and target a deployment for scaling.

> [!NOTE]
> The Azure Kubernetes Metrics Adapter is no longer maintained. Kubernetes Event-driven Autoscaling (KEDA) is an alternative.

> [!TIP]
> Consider [Application Gateway for Containers](for-containers/overview.md) for your Kubernetes ingress solution. For more information, see [Scaling and availability for Application Gateway for Containers](for-containers/scaling-zone-resiliency.md).

## Set up the Azure Kubernetes Metrics Adapter

1. Create a Microsoft Entra service principal and assign it `Monitoring Reader` access over the Application Gateway deployment's resource group:

    ```azurecli
    applicationGatewayGroupName="<application-gateway-group-id>"
    applicationGatewayGroupId=$(az group show -g $applicationGatewayGroupName -o tsv --query "id")
    az ad sp create-for-rbac -n "azure-k8s-metric-adapter-sp" --role "Monitoring Reader" --scopes applicationGatewayGroupId
    ```

1. Deploy the Azure Kubernetes Metrics Adapter by using the Microsoft Entra service principal that you created previously:

    ```bash
    kubectl create namespace custom-metrics
    # use values from service principal created previously to create secret
    kubectl create secret generic azure-k8s-metrics-adapter -n custom-metrics \
        --from-literal=azure-tenant-id=<tenantid> \
        --from-literal=azure-client-id=<clientid> \
        --from-literal=azure-client-secret=<secret>
    kubectl apply -f kubectl apply -f https://raw.githubusercontent.com/Azure/azure-k8s-metrics-adapter/master/deploy/adapter.yaml -n custom-metrics
    ```

1. Create an `ExternalMetric` resource with the name `appgw-request-count-metric`. This resource instructs the metric adapter to expose the `AvgRequestCountPerHealthyHost` metric for the `myApplicationGateway` resource in the `myResourceGroup` resource group. You can use the `filter` field to target a specific backend pool and backend HTTP setting in the Application Gateway deployment.

    ```yaml
    apiVersion: azure.com/v1alpha2
    kind: ExternalMetric
    metadata:
    name: appgw-request-count-metric
    spec:
        type: azuremonitor
        azure:
            resourceGroup: myResourceGroup # replace with your Application Gateway deployment's resource group name
            resourceName: myApplicationGateway # replace with your Application Gateway deployment's name
            resourceProviderNamespace: Microsoft.Network
            resourceType: applicationGateways
        metric:
            metricName: AvgRequestCountPerHealthyHost
            aggregation: Average
            filter: BackendSettingsPool eq '<backend-pool-name>~<backend-http-setting-name>' # optional
    ```

You can now make a request to the metric server to see if the new metric is being exposed:

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

## Use the new metric to scale up the deployment

After you expose `appgw-request-count-metric` through the metric server, you're ready to use the [Horizontal Pod Autoscaler](/azure/aks/concepts-scale#horizontal-pod-autoscaler) to scale up your target deployment.

The following example targets a sample deployment named `aspnet`. You scale up pods when `appgw-request-count-metric` is `200` per pod, up to a maximum of `10` pods.

Replace your target deployment name and apply the following autoscale configuration:

```yaml
apiVersion: autoscaling/v2
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

Test your setup by using a load test tool like ApacheBench:

```bash
ab -n10000 http://<applicaiton-gateway-ip-address>/
```

## Related content

- [Troubleshoot Application Gateway Ingress Controller issues](ingress-controller-troubleshoot.md)
- [Application Gateway for Containers](for-containers/overview.md)
