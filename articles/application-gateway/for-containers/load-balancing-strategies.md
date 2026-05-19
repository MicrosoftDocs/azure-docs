---
title: Load balancing strategies in Application Gateway for Containers
description: Learn about different load balancing strategies to help build resilient and performant workloads.
services: application-gateway
author: JackStromberg
ms.service: azure-appgw-for-containers
ms.topic: concept-article
ms.date: 4/22/2026
ms.author: jstrom
# Customer intent: "As a cloud administrator, I need to use different load balancing algorithms to efficiently scale and optimize traffic placement to backend services."
---

# Load balancing strategies in Application Gateway for Containers

In today's dynamic and high-demand environments, efficient load balancing is crucial for maintaining the performance and reliability of applications. Application Gateway for Containers offers multiple load balancing algorithms to cater to different scenarios and requirements. Understanding and choosing the right load balancing algorithm can significantly impact the overall user experience, resource utilization, and system resilience.

### Why care about changing the load balancing algorithm

Different load balancing algorithms provide unique benefits and are suited to various use cases. By having multiple options to choose from, you can:

- **Optimize Performance:** Different algorithms can help distribute traffic more effectively based on the current load, server capacity, and other metrics. This ensures that applications run smoothly and efficiently, even under varying loads.
- **Enhance Reliability:** Algorithms like Circuit Breaker and Slow Start can improve the resilience of the system by preventing overloads and managing server recovery. This helps maintain service availability and reduces the risk of downtime.
- **Improve Resource Utilization:** Weighted Round Robin and Load Aware Routing can ensure that more powerful servers handle a larger share of the traffic, optimizing resource utilization, and reducing costs.
- **Adapt to Changing Conditions:** In dynamic environments, the load on backend servers can vary significantly. Load Aware Routing and Priority-based algorithms allow the system to adapt to these changes in real-time, ensuring optimal performance and reliability.
- **Tailor to Specific Needs:** Different applications and services can have unique requirements. By offering multiple load balancing options, Application Gateway for Containers allows customers to tailor the load balancing strategy to their specific needs, whether it's prioritizing speed, reliability, or resource efficiency.

By using these load balancing options, customers can ensure that their applications are robust, responsive, and capable of handling varying loads and conditions effectively.

---

## Strategy compatibility

The following table summarizes the compatibility between load balancing strategies and other features:

| Strategy | Slow Start | Session Affinity | ORCA Load Reports |
| -------- | ---------- | ---------------- | ------------------ |
| Round Robin / Weighted Round Robin | Yes | No | No |
| Least Request | Yes | No | No |
| Ring Hash | No | Yes | No |
| Load Aware | No | No | Yes (required) |

By using these load balancing options, Application Gateway for Containers can efficiently manage traffic distribution, improve performance, and enhance the reliability of your applications.

Below are the descriptions and scenarios for each load balancing option:

## Round Robin

**Description:**
Round Robin is a simple load balancing method where each incoming request is distributed sequentially across the available backend servers. Once the last server in the list is reached, the process starts over from the first server.

**Scenario:**
Round Robin is suitable for scenarios where backend servers have similar capabilities and workloads. It ensures an even distribution of traffic without considering the current load or performance of each server.

**Configuration:**

This is the default option used by Application Gateway for Containers to distribute traffic to pods. No specific configuration is needed to enable this load balancing algorithm.

## Weighted Round Robin

**Description:**
Weighted Round Robin assigns a weight to each backend server based on its capacity or performance. Servers with higher weights receive more requests compared to those with lower weights. The requests are distributed in a round-robin fashion, but the frequency of requests to each server is proportional to its weight.

**Scenario:**
Weighted Round Robin is ideal for environments where backend servers have different capacities or performance levels. It ensures that more powerful servers handle a larger share of the traffic, optimizing resource utilization.

**Configuration:**

A weight can be applied between services within the HTTPRoute resource in Gateway API. Details on how a weight is defined can be found [here](https://gateway-api.sigs.k8s.io/reference/spec/#httpbackendref)

In this example, approximately 75 of a 100 requests would be preferred to backend-v1, while the remaining 25 would go to backend-v2.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: traffic-split-example
  namespace: test-infra
spec:
  parentRefs:
  - name: gateway-01
  rules:
  - backendRefs:
    - name: backend-v1
      port: 8080
      weight: 75
    - name: backend-v2
      port: 8080
      weight: 25
```

## Slow Start

**Description:**
Slow Start gradually increases the amount of traffic sent to a new or recently recovered backend server. This allows the server to warm up and handle the load more effectively before being fully utilized.

**Scenario:**
Slow Start is useful when adding new servers to the pool or when recovering servers from failure. It helps prevent sudden spikes in load that could overwhelm the server and ensures a smooth transition to full capacity.

**Configuration:**

There are three parameters, in addition to two load balancing strategies that can be paired with slow start.

| Parameter Name | Measurement | Default value | Description |
| -------------- | ----------- | ------------- | ----------- |
| window | duration | 0 seconds | Represents the duration of slow start window. |
| aggression | decimal | 1.0 | Controls the speed of traffic increase over the slow start window. The input value must be greater than 0. |
| startWeightPercent| percent | 10% | Configures the minimum percentage of origin weight that avoids too small new weight, which can cause endpoints in slow start mode receive no traffic in slow start window. |

Load balancing strategies

- Round Robin
- Least Request

```yaml
version: alb.networking.azure.io/v1
kind: BackendLoadBalancingPolicy
metadata:
  name: slow-start-example
  namespace: test-namespace
spec:
  targetRefs:
  - group: ""
    kind: Service
    name: threshold-test
    ports:
    - port: 443
  loadBalancing:
    strategy: "round-robin" # "round-robin", "least-request"
    slowStart: # slow start allowed for only loadBalancing strategy "round-robin" and "least-request"
      window: 0s
      aggression: "1.0"
      startWeightPercent: 10
```

## Least Request

**Description:**
Least Request is a load balancing method that distributes incoming requests to the backend server with the fewest number of active requests. When a new request arrives, the load balancer selects two random available backends (known as "power of two choices") and routes the request to the one with the fewest in-flight requests. This approach provides a good balance between load distribution and selection efficiency.

**Scenario:**
Least Request is well-suited for environments where requests have varying processing times and backend servers can handle long-running operations. By routing traffic to the server with the fewest active requests, it helps prevent individual servers from becoming overwhelmed, improving overall response times and resource utilization.

Least Request can also be paired with [Slow Start](#slow-start) to gradually ramp up traffic to new or recovering backends before they begin receiving their full share of requests.

**Configuration:**

Least Request is configured using the `BackendLoadBalancingPolicy` resource with the `least-request` strategy.

```yaml
version: alb.networking.azure.io/v1
kind: BackendLoadBalancingPolicy
metadata:
  name: least-request-example
  namespace: test-namespace
spec:
  targetRefs:
  - group: ""
    kind: Service
    name: backend-service
    ports:
    - port: 443
  loadBalancing:
    strategy: "least-request"
```

In this example, traffic is distributed to pods backing the `backend-service` service on port 443 using the Least Request strategy. The load balancer selects the backend with the fewest active requests at the time each new request is received.

## Ring Hash

**Description:**
Ring Hash is a consistent hashing load balancing method that maps both backend servers and request attributes (such as a header value or client IP) onto a hash ring. Each incoming request is hashed and routed to the nearest backend server on the ring. This ensures that requests with the same hash key are consistently routed to the same backend, providing session affinity without requiring explicit session state.

**Scenario:**
Ring Hash is ideal for use cases that benefit from consistent routing, such as caching layers, stateful applications, or scenarios where session affinity is required. Because the hash ring minimizes redistribution when backends are added or removed, it provides stability during scaling events.

**Configuration:**

Ring Hash is configured using the `BackendLoadBalancingPolicy` resource with the `ring-hash` strategy.

> [!NOTE]
> Session affinity requires the Ring Hash load balancing strategy. If session affinity is configured with any other strategy or when slow start is enabled, session affinity is rejected.

```yaml
version: alb.networking.azure.io/v1
kind: BackendLoadBalancingPolicy
metadata:
  name: ring-hash-example
  namespace: test-namespace
spec:
  targetRefs:
  - group: ""
    kind: Service
    name: backend-service
    ports:
    - port: 443
  loadBalancing:
    strategy: "ring-hash"
```

In this example, traffic is distributed to pods backing the `backend-service` service on port 443 using the Ring Hash strategy. Requests that produce the same hash key are consistently routed to the same backend, enabling predictable routing behavior.

## Load Aware Routing

**Description:**
Load Aware Routing distributes traffic based on the current load and availability of backend servers. Backend services report their load to Application Gateway for Containers using the [Open Request Cost Aggregation (ORCA)](https://github.com/grpc/proposal/blob/master/A51-custom-backend-metrics.md) standard by including an `endpoint-load-metrics` response header in either text or JSON format. The load balancer uses these reported metrics to make informed routing decisions and direct requests to the server with the most available capacity.

The ORCA standard supports various built-in metrics such as `cpu_utilization`, `mem_utilization`, `application_utilization`, `rps_fractional`, and `eps`. In addition, any application-specific metric can be reported using the `named_metrics` field. This allows backend services to define custom utilization signals tailored to their workload, such as GPU utilization, queue depth, or any other indicator of capacity.

_rps_fractional_ (_rpsFractional_ in JSON format), along with any utilization metric, is required in the endpoint load metric header for the ORCA load report to be valid and then used to compute an endpoint weight.

The following are examples of ORCA load metrics emitted by a backend service as a response header in text and JSON format:

# [Text format](#tab/orca-text-format)

```
endpoint-load-metrics: cpu_utilization=0.3, mem_utilization=0.8, rps_fractional=10.0, eps=1
```

# [JSON format](#tab/orca-json-format)

```
endpoint-load-metrics: JSON {"cpuUtilization": 0.3, "memUtilization": 0.8, "rpsFractional": 10.0, "eps": 1}
```

---

Custom metrics can also be included using the `named_metrics` prefix. For example, a backend running GPU inference workloads could report GPU utilization alongside standard metrics:

# [Text format](#tab/orca-text-format)

```
endpoint-load-metrics: application_utilization=0.6, rps_fractional=5.0, named_metrics.gpu_utilization=0.85
```

# [JSON format](#tab/orca-json-format)

```
endpoint-load-metrics: JSON {"applicationUtilization": 0.6, "rpsFractional": 5.0, "namedMetrics": {"gpu_utilization": 0.85}}
```

---

> [!IMPORTANT]
> ORCA load report headers are consumed by Application Gateway for Containers and are **not** forwarded to the downstream client in the response.

**Scenario:**
Load Aware Routing is beneficial in dynamic environments where the load on backend servers can vary significantly. It ensures that requests are directed to servers with the most available capacity, improving overall performance and reliability.

**Configuration:**

Load Aware Routing is configured using the `BackendLoadBalancingPolicy` resource with the `load-aware` strategy. The load balancer continuously monitors backend server utilization and routes new requests to the server with the least load, ensuring efficient distribution across all available capacity.

There are four optional parameters that can be configured to tune load aware routing behavior. When left unspecified, each parameter defaults to its initial value.

| Parameter Name | Measurement | Default value | Description |
| -------------- | ----------- | ------------- | ----------- |
| blackoutPeriod | duration | 10 seconds | An endpoint must report load metrics continuously for at least this long before the endpoint metrics will be used to influence load balancing decisions. This applies both immediately after a connection is established and after `metricExpirationPeriod` has elapsed. |
| metricExpirationPeriod | duration | 3 minutes | If an endpoint doesn't report load metrics for this duration, metrics stop being used to influence load balancing decisions. |
| errorUtilizationPenalty | decimal | 1.0 | The multiplier used to adjust endpoint weights with the error rate calculated based on the reported `rps_fractional` and `eps` load metrics. Must not be a negative value. |
| namedMetrics | list | (none) | A list of custom metric names reported by endpoints to be used for reporting utilization and influencing load balancing decisions. Utilization is computed by taking the max of the values of the metrics specified in this list. |

> [!NOTE]
> Load Aware Routing requires backend services to emit ORCA load report headers in downstream responses. Backend services that don't include the `endpoint-load-metrics` header are treated with equal weight and traffic is distributed using standard round robin behavior until load metrics are received.

```yaml
version: alb.networking.azure.io/v1
kind: BackendLoadBalancingPolicy
metadata:
  name: load-aware-example
  namespace: test-namespace
spec:
  targetRefs:
  - group: ""
    kind: Service
    name: backend-service
    ports:
    - port: 443
  loadBalancing:
    strategy: "load-aware"
    loadAware:
      blackoutPeriod: 10s
      metricExpirationPeriod: 3m
      errorUtilizationPenalty: "1.0"
      namedMetrics:
        - gpu_utilization
```

In this example, traffic is distributed to pods backing the `backend-service` service on port 443 using Load Aware Routing. The load balancer routes requests to the backend server with the lowest current utilization. Endpoints must report load metrics for at least 10 seconds (`blackoutPeriod`) before their metrics influence routing decisions, and metrics expire after 3 minutes of inactivity (`metricExpirationPeriod`). The `namedMetrics` field specifies that the custom `gpu_utilization` metric reported by backends via the `named_metrics` prefix in the ORCA header should also be considered when computing endpoint weights.

## Additional resources

- [How-to traffic splitting](how-to-traffic-splitting-gateway-api.md)
- [Application Gateway for Containers API specification for Kubernetes](api-specification-kubernetes.md)
