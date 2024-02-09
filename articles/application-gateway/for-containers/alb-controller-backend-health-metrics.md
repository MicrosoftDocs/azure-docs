---
title: ALB Controller - Backend Health and Metrics
description: Identify and troubleshoot issues using ALB Controller's backend health & metrics endpoints for Application Gateway for Containers.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.topic: article
ms.date: 07/24/2023
ms.author: greglin
---

# ALB Controller - Backend Health and Metrics

Understanding backend health of your Kubernetes services and pods is crucial in identifying issues and assistance in troubleshooting.  To help facilitate visibility into backend health, ALB Controller exposes backend health and metrics endpoints in all ALB Controller deployments.

ALB Controller's backend health exposes three different experiences:
1. Summarized backend health by Application Gateway for Containers resource
2. Summarized backend health by Kubernetes service
3. Detailed backend health for a specified Kubernetes service

ALB Controller's metric endpoint exposes both metrics and summary of backend health.  This endpoint enables exposure to Prometheus.

Access to these endpoints can be reached via the following URLs:
- Backend Health - http://\<alb-controller-pod-ip\>:8000/backendHealth
   - Output is JSON format
- Metrics - http://\<alb-controller-pod-ip\>:8001/metrics
   - Output is text format

Any clients or pods that have connectivity to this pod and port may access these endpoints. To restrict access, we recommend using [Kubernetes network policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) to restrict access to certain clients.

## Backend Health

### Discovering backend health

Run the following kubectl command to identify your ALB Controller pod and its corresponding IP address.

```bash
kubectl get pods -n azure-alb-system -o wide
```

Example output:

| NAME                                       | READY | STATUS  | RESTARTS |  AGE | IP         | NODE                             | NOMINATED NODE | READINESS GATES |
| ------------------------------------------ | ----- | ------- | -------- | ---- | ---------- | -------------------------------- | -------------- | --------------- |
| alb-controller-74df7896b-gfzfc             | 1/1   | Running | 0        |  60m | 10.1.0.247 | aks-userpool-21921599-vmss000000 | \<none\>         | \<none\>          |
| alb-controller-bootstrap-5f7f8f5d4f-gbstq  | 1/1   | Running | 0        |  60m | 10.1.1.183 | aks-userpool-21921599-vmss000001 | \<none\>         | \<none\>          |

Once you have the IP address of your alb-controller pod, you may validate the backend health service is running by browsing to http://\<pod-ip\>:8000.

For example, the following command may be run:
```bash
curl http://10.1.0.247:8000
```

Example response:
```
Available paths:
Path: /backendHealth
Description: Prints the backend health of the ALB.
Query Parameters:
        detailed: if true, prints the detailed view of the backend health
        alb-id: Resource ID of the Application Gateway for Containers to filter backend health for.
        service-name: Service to filter backend health for. Expected format: \<namespace\>/\<service\>/\<service-port-number\>

Path: /
Description: Prints the help
```

### Summarized backend health by Application Gateway for Containers

This experience summarizes of all Kubernetes services with references to Application Gateway for Containers and their corresponding health status.

This experience may be accessed by specifying the Application Gateway for Containers resource ID in the query of the request to the alb-controller pod.

The following command can be used to probe backend health for the specified Application Gateway for Containers resource.
```bash
curl http://\<alb-controller-pod-ip-address\>:8000/backendHealth?alb-id=/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/yyyyyyyy/providers/Microsoft.ServiceNetworking/trafficControllers/zzzzzzzzzz
```

Example output:
```json
{
  "services": [
    {
      "serviceName": "default/service-hello-world/80",
      "serviceHealth": [
        {
          "albId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/yyyyyyyy/providers/Microsoft.ServiceNetworking/trafficControllers/zzzzzzzzzz",
          "totalEndpoints": 1,
          "totalHealthyEndpoints": 1,
          "totalUnhealthyEndpoints": 0
        }
      ]
    },
    {
      "serviceName": "default/service-contoso/443",
      "serviceHealth": [
        {
          "albId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/yyyyyyyy/providers/Microsoft.ServiceNetworking/trafficControllers/zzzzzzzzzz",
          "totalEndpoints": 1,
          "totalHealthyEndpoints": 1,
          "totalUnhealthyEndpoints": 0
        }
      ]
    }
  ]
}
```

### Summarized backend health by Kubernetes service

This experience searches for the health summary status of a given service.

This experience may be accessed by specifying the name of the namespace, service, and port number of the service in the following format of the query string to the alb-controller pod: _\<namespace\>/\<service\>/\<service-port-number\>_

The following command can be used to probe backend health for the specified Kubernetes service.
```bash
curl http://\<alb-controller-pod-ip-address\>:8000/backendHealth?service-name=default/service-hello-world/80
```

Example output:
```json
{
  "services": [
    {
      "serviceName": "default/service-hello-world/80",
      "serviceHealth": [
        {
          "albId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/yyyyyyyy/providers/Microsoft.ServiceNetworking/trafficControllers/zzzzzzzzzz",
          "totalEndpoints": 1,
          "totalHealthyEndpoints": 1,
          "totalUnhealthyEndpoints": 0
        }
      ]
    }
  ]
}
```

### Detailed backend health for a specified Kubernetes service

This experience shows all endpoints that make up the service, including their corresponding health status and IP address.  Endpoint status is reported as either _HEALTHY_ or _UNHEALTHY_.

This experience may be accessed by specifying detailed=true in the query string to the alb-controller pod.

For example, we can verify individual endpoint health by executing the following command:
```bash
curl http://\<alb-controller-pod-ip-address\>:8000/backendHealth?service-name=default/service-hello-world/80\&detailed=true
```

Example output:
```json
{
  "services": [
    {
      "serviceName": "default/service-hello-world/80",
      "serviceHealth": [
        {
          "albId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/yyyyyyyy/providers/Microsoft.ServiceNetworking/trafficControllers/zzzzzzzzzz",
          "totalEndpoints": 1,
          "totalHealthyEndpoints": 1,
          "totalUnhealthyEndpoints": 0,
          "endpoints": [
            {
              "address": "10.1.1.22",
              "health": {
                "status": "HEALTHY"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## Metrics

ALB Controller currently surfaces metrics following [text based format](https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format) to be exposed to Prometheus.

The following Application Gateway for Containers specific metrics are currently available today:

| Metric Name | Description                                                                           | 
| ----------- | ------------------------------------------------------------------------------------- |
| alb_connection_status | Connection status to an Application Gateway for Containers resource |
| alb_reconnection_count | Number of reconnection attempts to an Application Gateway for Containers resources |
| total_config_updates | Number of service routing config operations |
| total_endpoint_updates | Number of backend pool config operations |
| total_deployments | Number of Application Gateway for Containers resource deployments |
| total_endpoints | Number of endpoints in a service |
| total_healthy_endpoints | Number of healthy endpoints in a service |
| total_unhealthy_endpoints | Number of unhealthy endpoints in a service |
