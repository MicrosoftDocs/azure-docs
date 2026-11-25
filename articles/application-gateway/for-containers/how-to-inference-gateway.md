---
title: Application Gateway for Containers - Configure the inference gateway
description: Learn how to expose a self-hosted vLLM model server through Application Gateway for Containers inference gateway by using an InferencePool and the llm-d router as the endpoint picker.
services: application-gateway
author: jackstromberg
ms.service: azure-application-gateway-containers
ms.topic: how-to
ms.date: 11/03/2026
ms.author: jstrom
# Customer intent: As a platform engineer, I want to configure Application Gateway for Containers inference gateway, so that I can route traffic to self-hosted AI model servers on Kubernetes.
---

# Application Gateway for Containers - Configure the inference gateway

This article shows how to expose a self-hosted vLLM model server through Application Gateway for Containers inference gateway by using the Kubernetes [Gateway API Inference Extension](https://gateway-api-inference-extension.sigs.k8s.io/). The configuration uses Gateway API resources, an `InferencePool`, and the [llm-d router](https://github.com/llm-d/llm-d-router) as the endpoint picker (EPP) that routes each inference request to a model server pod.

In this guide, you deploy:

- A GPU-backed vLLM model server that serves an OpenAI-compatible API
- A [Gateway](https://gateway-api.sigs.k8s.io/reference/api-types/gateway/)
- The llm-d router CRDs
- An `InferencePool` and an llm-d router EPP deployment
- An `HTTPRoute` that sends `/v1` traffic to the `InferencePool`
- Optionally, an `InferenceModelRewrite` and `InferenceObjective` resources

## How the components fit together

Application Gateway for Containers receives requests at the `Gateway` listener and matches them against an `HTTPRoute`. When the route's `backendRef` is an `InferencePool`, ALB Controller programs the data path to consult the pool's endpoint picker for each request. The EPP watches the pods that match the `InferencePool` selector, reads vLLM metrics such as queue depth and KV cache utilization, and tells the data path which pod to send the request to.

Starting with v1.6, the Gateway API Inference Extension defines the `InferencePool` API and the endpoint picker protocol, while the full-featured endpoint picker and the `InferenceObjective` and `InferenceModelRewrite` APIs are maintained by the llm-d project. This guide uses the llm-d router to provide provide load-aware, cache-aware, and priority-aware scheduling. For more information, see [Application Gateway for Containers - Inference gateway](inference-gateway.md#endpoint-picker-implementations).

| Resource | API group and version | Installed by |
| --- | --- | --- |
| `InferencePool` | `inference.networking.k8s.io/v1` | ALB Controller (CRD) and the llm-d router Helm chart (resource) |
| `InferenceModelRewrite` | `llm-d.ai/v1alpha2` | llm-d router CRDs |
| `InferenceObjective` | `llm-d.ai/v1` | llm-d router CRDs |

> [!IMPORTANT]
> The Application Gateway for Containers inference gateway is currently in preview.<br>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you begin, complete the following tasks:

1. Deploy Application Gateway for Containers and ALB Controller. For more information, see [Quickstart: Deploy Application Gateway for Containers ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md).
1. Enable the inference gateway feature on ALB Controller. For new installations or upgrades of ALB Controller, include `--set albController.aiGateway=true` in the Helm command. When you enable this setting, ALB Controller also installs the Gateway API Inference Extension CRDs. ALB Controller 1.13.0 and later installs v1.6.2 of the CRDs.

   > [!NOTE]
   > Inference gateway isn't currently supported through the Application Gateway for Containers' AKS add-on. You must deploy the Application Gateway for Containers' ALB Controller by Helm chart to configure this feature.

1. Prepare an AKS cluster with a GPU node pool that has at least one schedulable GPU and the NVIDIA device plugin installed. For instructions, see [Use GPUs for compute-intensive workloads on AKS](/azure/aks/gpu-cluster). The endpoint picker runs on regular CPU nodes and doesn't need a GPU.
1. Install the following tools on your workstation or use Azure Cloud Shell where available:
   - Azure CLI
   - `kubectl`
   - `helm` version 3.8 or later, for OCI chart support
1. [Create or obtain a Hugging Face access token](https://huggingface.co/docs/hub/security-tokens) that can download the model used by your vLLM deployment.

## Set environment variables

Set the variables used by the commands in this article.

```bash
NAMESPACE='inference'
INFERENCE_POOL_NAME='vllm-qwen2-5-0-5b'
MODEL_NAME='Qwen/Qwen2.5-0.5B-Instruct'
GATEWAY_NAME='ai-gateway'
HF_TOKEN='<your Hugging Face access token>'
LLMD_ROUTER_VERSION='v1.0.0'
```

`LLMD_ROUTER_VERSION` sets the llm-d router release used for the CRDs, the Helm chart, and the EPP image. llm-d router v1.0.0 is built against Gateway API Inference Extension v1.6.2.

# [ALB managed deployment](#tab/alb-managed)

If you're using the ALB managed deployment strategy, set the namespace and name of your `ApplicationLoadBalancer` resource.

```bash
ALB_NAMESPACE='alb-test-infra'
ALB_NAME='alb-test'
```

# [Bring your own (BYO) deployment](#tab/byo)

If you're using the bring your own deployment strategy, also set the Application Gateway for Containers resource ID and frontend name.

```bash
RESOURCE_GROUP='<resource group name of the Application Gateway for Containers resource>'
RESOURCE_NAME='<Application Gateway for Containers resource name>'
FRONTEND_NAME='<frontend name>'

RESOURCE_ID=$(az network alb show \
  --resource-group $RESOURCE_GROUP \
  --name $RESOURCE_NAME \
  --query id \
  --output tsv)
```

---

## Create a namespace

Create a namespace for the model server, Gateway, HTTPRoute, InferencePool, and EPP resources.

```bash
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
```

## Verify the Gateway API Inference Extension CRD

Verify that ALB Controller installed the `InferencePool` CRD and that it serves the `v1` API.

```bash
kubectl get crd inferencepools.inference.networking.k8s.io \
  -o jsonpath='{.metadata.annotations.inference\.networking\.k8s\.io/bundle-version}{"  served: "}{range .spec.versions[?(@.served==true)]}{.name}{" "}{end}{"\n"}'
```

Expected output:

```output
v1.6.2  served: v1
```

> [!NOTE]
> If you upgraded from an earlier ALB Controller version, the cluster might still have the `inferenceobjectives.inference.networking.x-k8s.io` CRD. Gateway API Inference Extension v1.6 removed that API, and the llm-d router doesn't use it. This guide uses the `InferenceObjective` API from the llm-d router (`llm-d.ai/v1`) instead.

## Install the llm-d router CRDs

Install the `InferenceObjective` and `InferenceModelRewrite` CRDs from the llm-d router release. The EPP checks for these CRDs when it starts, so install them before you deploy the EPP, even if you don't plan to create these resources.

```bash
for crd in inferenceobjectives inferencemodelrewrites; do
  kubectl apply --server-side \
    -f "https://raw.githubusercontent.com/llm-d/llm-d-router/${LLMD_ROUTER_VERSION}/config/crd/bases/llm-d.ai_${crd}.yaml"
done

kubectl wait --for=condition=Established \
  crd/inferenceobjectives.llm-d.ai crd/inferencemodelrewrites.llm-d.ai \
  --timeout=60s
```

Expected output:

```output
customresourcedefinition.apiextensions.k8s.io/inferenceobjectives.llm-d.ai serverside-applied
customresourcedefinition.apiextensions.k8s.io/inferencemodelrewrites.llm-d.ai serverside-applied
customresourcedefinition.apiextensions.k8s.io/inferenceobjectives.llm-d.ai condition met
customresourcedefinition.apiextensions.k8s.io/inferencemodelrewrites.llm-d.ai condition met
```

## Deploy a vLLM model server

Create a Kubernetes secret for the Hugging Face access token.

```bash
kubectl create secret generic hf-token \
  --namespace $NAMESPACE \
  --from-literal=token=$HF_TOKEN \
  --dry-run=client -o yaml | kubectl apply -f -
```

Deploy a vLLM model server. The example uses `Qwen/Qwen2.5-0.5B-Instruct`, but the Application Gateway for Containers and Gateway API Inference Extension configuration is model-agnostic. You can substitute any vLLM-compatible model that fits on your GPU SKU.

The vLLM pod requires one `nvidia.com/gpu` and tolerates a `sku=gpu:NoSchedule` taint, so it lands on a GPU node. Remove the toleration if your node pool isn't tainted, or apply the taint with `kubectl taint nodes -l agentpool=<gpu-pool> sku=gpu:NoSchedule`. The pod labels (`app: ${INFERENCE_POOL_NAME}`) are what the `InferencePool` selects on later, so don't change them without also updating the chart's `router.modelServers.matchLabels.app` value.

```bash
kubectl apply -n $NAMESPACE -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${INFERENCE_POOL_NAME}
  labels:
    app: ${INFERENCE_POOL_NAME}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${INFERENCE_POOL_NAME}
  template:
    metadata:
      labels:
        app: ${INFERENCE_POOL_NAME}
        inference.networking.k8s.io/engine-type: vllm
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        imagePullPolicy: Always
        command: ["python3", "-m", "vllm.entrypoints.openai.api_server"]
        args:
        - "--model"
        - "${MODEL_NAME}"
        - "--port"
        - "8000"
        - "--max-model-len"
        - "2048"
        - "--gpu-memory-utilization"
        - "0.8"
        - "--enable-prefix-caching"
        env:
        - name: HUGGING_FACE_HUB_TOKEN
          valueFrom:
            secretKeyRef:
              name: hf-token
              key: token
        ports:
        - containerPort: 8000
          name: http
          protocol: TCP
        readinessProbe:
          httpGet:
            path: /health
            port: http
          periodSeconds: 5
          failureThreshold: 12
        startupProbe:
          httpGet:
            path: /health
            port: http
          periodSeconds: 10
          failureThreshold: 60
        resources:
          limits:
            nvidia.com/gpu: "1"
          requests:
            nvidia.com/gpu: "1"
        volumeMounts:
        - mountPath: /dev/shm
          name: shm
      tolerations:
      - key: "sku"
        operator: "Equal"
        value: "gpu"
        effect: "NoSchedule"
      - key: "nvidia.com/gpu"
        operator: "Exists"
        effect: "NoSchedule"
      volumes:
      - name: shm
        emptyDir:
          medium: Memory
EOF
```

Wait for the model server to become ready. Model download and startup can take several minutes.

```bash
kubectl rollout status deployment/${INFERENCE_POOL_NAME} -n $NAMESPACE --timeout=900s
```

Expected output:

```output
deployment "vllm-qwen2-5-0-5b" successfully rolled out
```

## Create the Gateway

Create an Application Gateway for Containers Gateway. Select the tab for your deployment strategy.

# [ALB managed deployment](#tab/alb-managed)

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: ${GATEWAY_NAME}
  namespace: ${NAMESPACE}
  annotations:
    alb.networking.azure.io/alb-namespace: ${ALB_NAMESPACE}
    alb.networking.azure.io/alb-name: ${ALB_NAME}
spec:
  gatewayClassName: azure-alb-external
  listeners:
  - name: http
    protocol: HTTP
    port: 80
    allowedRoutes:
      namespaces:
        from: Same
EOF
```

# [Bring your own (BYO) deployment](#tab/byo)

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: ${GATEWAY_NAME}
  namespace: ${NAMESPACE}
  annotations:
    alb.networking.azure.io/alb-id: ${RESOURCE_ID}
spec:
  gatewayClassName: azure-alb-external
  listeners:
  - name: http
    protocol: HTTP
    port: 80
    allowedRoutes:
      namespaces:
        from: Same
  addresses:
  - type: alb.networking.azure.io/alb-frontend
    value: ${FRONTEND_NAME}
EOF
```

---

Wait for the gateway to be programmed.

```bash
kubectl wait \
  --for=condition=Programmed \
  gateway/${GATEWAY_NAME} \
  -n $NAMESPACE \
  --timeout=300s
```

You see the following message when it's ready:

`gateway.gateway.networking.k8s.io/ai-gateway condition met`

## Deploy the InferencePool and the llm-d router

Deploy the EPP and `InferencePool` together by using the `llm-d-router-gateway` Helm chart published by the llm-d project at `oci://ghcr.io/llm-d/charts/llm-d-router-gateway`. The chart creates an EPP `Deployment` and `Service` (gRPC on port `9002`), the `ServiceAccount`, `Role`, and `RoleBinding` that let the EPP watch pods and llm-d resources, and the `InferencePool` resource itself, named after the Helm release.

Create a values file for the chart.

```bash
cat > llm-d-router-values.yaml <<EOF
router:
  modelServers:
    type: vllm
    protocol: http
    targetPorts:
    - number: 8000
    matchLabels:
      app: ${INFERENCE_POOL_NAME}
  inferencePool:
    create: true
    failureMode: FailClose
  epp:
    replicas: 1
    image:
      tag: ${LLMD_ROUTER_VERSION}
    # The chart's default requests are sized for production traffic.
    # Lower them for a test cluster, or remove this block to keep the defaults.
    resources:
      requests:
        cpu: 500m
        memory: 512Mi
      limits:
        memory: 2Gi
provider:
  name: none
httpRoute:
  create: false
EOF
```

The values file sets these options:

- `router.modelServers` tells the `InferencePool` which pods to select, which port they serve on, and that they run vLLM, so the EPP reads the vLLM metric names.
- `router.inferencePool.failureMode` sets what Application Gateway for Containers does when the EPP is unavailable. `FailClose` rejects requests. `FailOpen` keeps routing to the pool with standard load balancing, without the EPP's scheduling.
- `provider.name: none` and `httpRoute.create: false` keep the chart from creating gateway-specific resources. You create the `HTTPRoute` in a later step.

Install the chart.

> [!NOTE]
> The chart appends `-epp` to the Helm release name when naming the EPP `Deployment` and `Service` (`${INFERENCE_POOL_NAME}-epp`). Later steps reference that name when checking rollout status, tailing logs, and inspecting endpoint slices.

```bash
helm upgrade --install "${INFERENCE_POOL_NAME}" \
  oci://ghcr.io/llm-d/charts/llm-d-router-gateway \
  --version "${LLMD_ROUTER_VERSION}" \
  --namespace "${NAMESPACE}" \
  -f llm-d-router-values.yaml
```

> [!WARNING]
> The chart renders an `InferencePool` resource named after the Helm release. If an `InferencePool` with the same name already exists in the namespace and was created outside Helm, `helm upgrade --install` refuses to adopt it and the command fails with an `invalid ownership metadata` error. If the existing pool is owned by a different Helm release, such as one installed with the earlier Gateway API Inference Extension `inferencepool` chart, uninstall that release first. Otherwise, either delete the existing pool (`kubectl delete inferencepool <name> -n $NAMESPACE`) or pick a different `INFERENCE_POOL_NAME` for this walkthrough.

Wait for the EPP deployment to become available.

```bash
kubectl rollout status deployment/${INFERENCE_POOL_NAME}-epp -n $NAMESPACE --timeout=180s
```

You see the following message when it's ready:

`deployment "vllm-qwen2-5-0-5b-epp" successfully rolled out`

## Verify the InferencePool

The Helm chart created an `InferencePool` resource named `${INFERENCE_POOL_NAME}` that selects pods labeled `app=${INFERENCE_POOL_NAME}` and references the chart-installed EPP service. Confirm it exists.

```bash
kubectl get inferencepool ${INFERENCE_POOL_NAME} -n $NAMESPACE -o yaml
```

In the `spec`, confirm that `endpointPickerRef.name` is `${INFERENCE_POOL_NAME}-epp` and `endpointPickerRef.failureMode` matches the value you set. In the `status`, look for `Accepted=True` and `ResolvedRefs=True`.

## Create the HTTPRoute

Create an `HTTPRoute` that uses the `InferencePool` as a Gateway API backend.

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: ${INFERENCE_POOL_NAME}
  namespace: ${NAMESPACE}
spec:
  parentRefs:
  - name: ${GATEWAY_NAME}
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /v1
    backendRefs:
    - group: inference.networking.k8s.io
      kind: InferencePool
      name: ${INFERENCE_POOL_NAME}
EOF
```

To route by model name instead of by path alone, add a header match on `X-Gateway-Model-Name`. Application Gateway for Containers' managed body-based routing sets that header from the `model` field of the request body, so you don't deploy a separate body-based routing component.

```yaml
  - matches:
    - path:
        type: PathPrefix
        value: /v1
      headers:
      - type: Exact
        name: X-Gateway-Model-Name
        value: Qwen/Qwen2.5-0.5B-Instruct
```

## Verify the route status

Confirm that the HTTPRoute is accepted and references are resolved.

```bash
kubectl get httproute ${INFERENCE_POOL_NAME} -n $NAMESPACE -o yaml
```

Look for conditions similar to the following output.

```yaml
  status:
    parents:
    - conditions:
      - lastTransitionTime: "2026-11-02T03:54:14Z"
        message: ""
        observedGeneration: 1
        reason: ResolvedRefs
        status: "True"
        type: ResolvedRefs
      - lastTransitionTime: "2026-11-02T03:54:14Z"
        message: Route is Accepted
        observedGeneration: 1
        reason: Accepted
        status: "True"
        type: Accepted
      - lastTransitionTime: "2026-11-02T03:54:14Z"
        message: Application Gateway for Containers resource has been successfully
          updated.
        observedGeneration: 1
        reason: Programmed
        status: "True"
        type: Programmed
      controllerName: alb.networking.azure.io/alb-controller
      parentRef:
        group: gateway.networking.k8s.io
        kind: Gateway
        name: ai-gateway
```

## Send inference traffic

Get the Gateway address.

```bash
GATEWAY_ADDRESS=$(kubectl get gateway/${GATEWAY_NAME} \
  -n $NAMESPACE \
  -o jsonpath='{.status.addresses[0].value}')
```

Send a chat completion request through Application Gateway for Containers.

```bash
curl -i http://${GATEWAY_ADDRESS}/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d "{
    \"model\": \"${MODEL_NAME}\",
    \"messages\": [{\"role\": \"user\", \"content\": \"What is 2+2? Answer in one word.\"}],
    \"max_tokens\": 10
  }"
```

Expected response (IDs, timestamps, and token counts will differ):

```output
HTTP/1.1 200 OK
content-type: application/json

{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "model": "Qwen/Qwen2.5-0.5B-Instruct",
  "choices": [{
    "index": 0,
    "message": {"role": "assistant", "content": "Four."},
    "finish_reason": "stop"
  }],
  "usage": {"prompt_tokens": 18, "completion_tokens": 2, "total_tokens": 20}
}
```

You can also test text completions.

```bash
curl -i http://${GATEWAY_ADDRESS}/v1/completions \
  -H 'Content-Type: application/json' \
  -d "{
    \"model\": \"${MODEL_NAME}\",
    \"prompt\": \"San Francisco is\",
    \"max_tokens\": 50
  }"
```

## Optional: create an InferenceModelRewrite

Create an `InferenceModelRewrite` when you want clients to request a stable model name while the EPP decides which model the pool actually serves. The EPP rewrites the `model` field before it sends the request to the model server, and returns the client's requested name in the response. Use this pattern to roll out a new model version or LoRA adapter on the same pool without changing clients.

The following example lets clients request `chat-default`, which the EPP maps to `${MODEL_NAME}`.

```bash
kubectl apply -n $NAMESPACE -f - <<EOF
apiVersion: llm-d.ai/v1alpha2
kind: InferenceModelRewrite
metadata:
  name: chat-default
spec:
  poolRef:
    group: inference.networking.k8s.io
    kind: InferencePool
    name: ${INFERENCE_POOL_NAME}
  rules:
  - matches:
    - model:
        type: Exact
        value: chat-default
    targets:
    - modelRewrite: ${MODEL_NAME}
EOF
```

Send a request for `chat-default`.

```bash
curl -s http://${GATEWAY_ADDRESS}/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "chat-default",
    "messages": [{"role": "user", "content": "What is 2+2? Answer in one word."}],
    "max_tokens": 10
  }'
```

The response comes from the vLLM server, and its `model` field is `chat-default`.

> [!NOTE]
> Application Gateway for Containers matches the `HTTPRoute` before the EPP rewrites the model name, so `X-Gateway-Model-Name` carries the name that the client requested. If your route matches on `X-Gateway-Model-Name`, add a match for each client-facing name, such as `chat-default`, that sends requests to this `InferencePool`. A route that matches on path alone, like the one in this article, needs no change.

To split traffic across models that the pool serves, such as two LoRA adapters, list more than one target with weights. For example, the following targets send 90 percent of `chat-default` requests to `adapter-v1` and 10 percent to `adapter-v2`:

```yaml
    targets:
    - modelRewrite: adapter-v1
      weight: 90
    - modelRewrite: adapter-v2
      weight: 10
```

> [!NOTE]
> If the pool uses `FailOpen` and the EPP is unavailable, requests bypass the EPP and reach the model server with the original model name, such as `chat-default`, which the model server doesn't recognize. Use `FailClose` for pools that rely on model rewrites.

## Optional: prioritize traffic with InferenceObjective

Create `InferenceObjective` resources when different classes of traffic share a pool and you want latency-critical requests served first when the pool is saturated. Clients select an objective with the `x-llm-d-inference-objective` request header. The `HTTPRoute` doesn't reference objectives.

Priority takes effect only when flow control is enabled in the llm-d router. With flow control, the EPP holds requests in priority bands while the pool is saturated, dispatches higher-priority requests first, and sheds lower-priority requests when their band is full or their time-to-live expires. Flow control is a feature gate and is off by default.

### Enable flow control

Create a second values file that replaces the EPP's scheduling configuration with one that enables flow control.

```bash
cat > llm-d-router-flow-control.yaml <<'EOF'
router:
  epp:
    pluginsConfigFile: flow-control.yaml
    pluginsCustomConfig:
      flow-control.yaml: |
        apiVersion: llm-d.ai/v1
        kind: EndpointPickerConfig
        featureGates:
        - flowControl
        plugins:
        - type: prefix-cache-scorer
        - type: queue-scorer
        - type: kv-cache-utilization-scorer
        - type: active-request-scorer
        # Treats a pod as saturated when it has maxConcurrency requests in flight.
        # Set it to the number of concurrent requests you want each replica to run.
        - type: concurrency-detector
          parameters:
            concurrencyMode: requests
            maxConcurrency: 32
        schedulingProfiles:
        - name: default
          plugins:
          - pluginRef: prefix-cache-scorer
            weight: 3
          - pluginRef: active-request-scorer
            weight: 1
          - pluginRef: queue-scorer
            weight: 1
          - pluginRef: kv-cache-utilization-scorer
            weight: 1
        flowControl:
          saturationDetector:
            pluginRef: concurrency-detector
          defaultRequestTTL: 60s
          priorityBands:
          - priority: 10       # critical-inference
            maxRequests: 200
          - priority: 0        # requests without an objective
            maxRequests: 200
          - priority: -10      # batch-inference
            maxRequests: 50
EOF
```

Upgrade the release with both values files.

```bash
helm upgrade "${INFERENCE_POOL_NAME}" \
  oci://ghcr.io/llm-d/charts/llm-d-router-gateway \
  --version "${LLMD_ROUTER_VERSION}" \
  --namespace "${NAMESPACE}" \
  -f llm-d-router-values.yaml \
  -f llm-d-router-flow-control.yaml

kubectl rollout status deployment/${INFERENCE_POOL_NAME}-epp -n $NAMESPACE --timeout=180s
```

### Create the objectives

Create a high-priority objective for interactive traffic and a low-priority objective for batch traffic.

```bash
kubectl apply -n $NAMESPACE -f - <<EOF
apiVersion: llm-d.ai/v1
kind: InferenceObjective
metadata:
  name: critical-inference
spec:
  priority: 10
  poolRefs:
  - name: ${INFERENCE_POOL_NAME}
---
apiVersion: llm-d.ai/v1
kind: InferenceObjective
metadata:
  name: batch-inference
spec:
  priority: -10
  poolRefs:
  - name: ${INFERENCE_POOL_NAME}
EOF
```

Send a request that uses the high-priority objective.

```bash
curl -i http://${GATEWAY_ADDRESS}/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -H 'x-llm-d-inference-objective: critical-inference' \
  -d "{
    \"model\": \"${MODEL_NAME}\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Summarize what an inference gateway does.\"}],
    \"max_tokens\": 80
  }"
```

Priority has a visible effect only when the pool is saturated. To observe it, send a sustained burst of requests with `x-llm-d-inference-objective: batch-inference` that exceeds `maxConcurrency` across your replicas, then send requests with `critical-inference` and compare their latency with the batch requests.

## Observe endpoint picker behavior

Review EPP logs to confirm that requests flow through endpoint selection.

```bash
kubectl logs deployment/${INFERENCE_POOL_NAME}-epp -n $NAMESPACE --tail=100
```

To see per-request scheduling decisions, raise the EPP log verbosity by adding `flags: {v: 2}` under `router.epp` in your values file, and then upgrade the release.

Review vLLM metrics from the model server pod.

```bash
POD=$(kubectl get pods -n $NAMESPACE -l app=${INFERENCE_POOL_NAME} -o jsonpath='{.items[0].metadata.name}')

kubectl exec -n $NAMESPACE $POD -- curl -s http://localhost:8000/metrics \
  | grep -E "^vllm:(num_requests_waiting|num_requests_running|kv_cache_usage_perc)"
```

The EPP also exposes Prometheus metrics for its scheduling, flow control, and model rewrite decisions. By default, the metrics endpoint requires a bearer token. Use the chart's `router.monitoring` values to configure scraping. For details, see the [llm-d router documentation](https://github.com/llm-d/llm-d-router).

## Troubleshoot

If traffic doesn't reach the model server, use the following checks:

- Confirm ALB Controller is running with the AI gateway feature enabled.
- Confirm the `Gateway` status includes `Accepted=True` and `Programmed=True`.
- Confirm the `HTTPRoute` status includes `Accepted=True`, `ResolvedRefs=True`, and `Programmed=True`.
- Confirm the `InferencePool` status includes `Accepted=True` and `ResolvedRefs=True`.
- Confirm the `InferencePool` selector matches the labels on the vLLM pods.
- Confirm the EPP service and deployment are running in the same namespace as the `InferencePool`.
- Confirm the model server pods are ready and expose port `8000`.
- Review EPP logs for endpoint selection errors or model lookup failures.

### Common failures

| Symptom | Likely cause | Fix |
|---|---|---|
| vLLM pod stuck in `Pending` | No allocatable GPU, taints don't match the pod's tolerations, or the `nvidia.com/gpu` resource isn't advertised by the device plugin. | Use `kubectl describe pod` to see the scheduler message. Verify the GPU node pool exists, the NVIDIA device plugin DaemonSet is `Ready`, and the toleration matches your taint. |
| vLLM pod in `CrashLoopBackOff` with `401 Unauthorized` in logs | Hugging Face token is invalid, expired, or doesn't have access to the model. | Recreate the `hf-token` Secret with a token that has read access to the model repo, then run `kubectl rollout restart deployment/${INFERENCE_POOL_NAME}`. |
| EPP pod stuck in `Pending` | The EPP's CPU or memory requests don't fit on any node. The chart's default requests are sized for production. | Lower `router.epp.resources.requests` in your values file and upgrade the release, or add capacity to a CPU node pool. |
| EPP pod in `CrashLoopBackOff`, with logs that mention `InferenceObjective` or `InferenceModelRewrite` | The llm-d router CRDs aren't installed, or they come from a different llm-d router version than the EPP image. | Install the CRDs from the same `LLMD_ROUTER_VERSION` as the chart, then restart the EPP deployment. |
| `helm upgrade --install` fails with `invalid ownership metadata` | An `InferencePool` with the release name already exists and isn't owned by this release. | Uninstall the release that owns it, delete the pool, or choose a different `INFERENCE_POOL_NAME`. |
| `HTTPRoute` status shows `ResolvedRefs=False` with `reason: BackendNotFound` and `message: InferencePool <namespace>/<name> not found` | The `HTTPRoute`'s `backendRef` name doesn't match an existing `InferencePool`, **or** the `InferencePool` exists but has no ready endpoints (for example, the vLLM pod is `Pending` because no GPU node could be scheduled or scaled up). ALB Controller reports a pool with zero ready endpoints as `BackendNotFound`. | Run `kubectl get inferencepool -n $NAMESPACE` to confirm the name matches the route's `backendRef`. Then run `kubectl get pods -n $NAMESPACE -l app=${INFERENCE_POOL_NAME}` and `kubectl describe pod <pod> -n $NAMESPACE`. If the pod is `Pending` with `FailedScheduling` events like `Insufficient nvidia.com/gpu` or `untolerated taint(s)`, scale up the GPU node pool, fix the toleration, or pick a SKU with available GPU capacity. |
| `curl` returns `503` from the Gateway | The pool has no ready endpoints, or the pool uses `FailClose` and the EPP isn't reachable (for example, the EPP pod isn't ready, or the service name in `endpointPickerRef` doesn't resolve). | Check `kubectl get endpointslices -n $NAMESPACE -l kubernetes.io/service-name=${INFERENCE_POOL_NAME}-epp` and confirm the `InferencePool.spec.endpointPickerRef.name` matches the chart-installed service name. |
| `curl` returns `404` | Path doesn't match the `HTTPRoute`, or the route matches on `X-Gateway-Model-Name` and the request's `model` value doesn't match. | Confirm the request path begins with `/v1`, the `model` value matches the route's header match exactly, and the route's `parentRefs` references the same Gateway in the same namespace. |
| Requests with `x-llm-d-inference-objective` aren't prioritized | Flow control isn't enabled, the objective's `poolRefs` doesn't name this pool, or the pool isn't saturated. | Confirm the EPP configuration includes the `flowControl` feature gate, check the objective with `kubectl get inferenceobjective -n $NAMESPACE -o yaml`, and test under enough load to exceed `maxConcurrency`. |
| Requests hang for >60 seconds, then error | vLLM is still loading the model into GPU memory. | Wait for the readiness probe to succeed; tail vLLM logs until you see `Application startup complete`. |

## Clean up resources

Delete the resources you created in this article.

```bash
kubectl delete inferenceobjective critical-inference batch-inference -n $NAMESPACE --ignore-not-found
kubectl delete inferencemodelrewrite chat-default -n $NAMESPACE --ignore-not-found
kubectl delete httproute ${INFERENCE_POOL_NAME} -n $NAMESPACE --ignore-not-found
helm uninstall ${INFERENCE_POOL_NAME} -n $NAMESPACE 2>/dev/null || true
kubectl delete gateway ${GATEWAY_NAME} -n $NAMESPACE --ignore-not-found
kubectl delete deployment ${INFERENCE_POOL_NAME} -n $NAMESPACE --ignore-not-found
kubectl delete secret hf-token -n $NAMESPACE --ignore-not-found
kubectl delete namespace $NAMESPACE --ignore-not-found
rm -f llm-d-router-values.yaml llm-d-router-flow-control.yaml
```

If no other workloads on the cluster use them, you can also remove the llm-d router CRDs. Deleting a CRD deletes every resource of that type in the cluster.

```bash
kubectl delete crd inferenceobjectives.llm-d.ai inferencemodelrewrites.llm-d.ai --ignore-not-found
```

## Next steps

- [Application Gateway for Containers - Inference gateway](inference-gateway.md)
- [Gateway API Inference Extension guides](https://gateway-api-inference-extension.sigs.k8s.io/guides/implementers/)
- [Troubleshoot Application Gateway for Containers](troubleshooting-guide.md)
- [llm-d router](https://github.com/llm-d/llm-d-router)
