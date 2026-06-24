---
title: Application Gateway for Containers - Configure the inference gateway
description: Learn how to expose a self-hosted vLLM model server through Application Gateway for Containers inference gateway by using Gateway API Inference Extension resources.
services: application-gateway
author: jackstromberg
ms.service: azure-appgw-for-containers
ms.topic: how-to
ms.date: 05/06/2026
ms.author: jstrom
# Customer intent: As a platform engineer, I want to configure Application Gateway for Containers inference gateway, so that I can route traffic to self-hosted AI model servers on Kubernetes.
---

# Application Gateway for Containers - Configure the inference gateway

This article shows how to expose a self-hosted vLLM model server through Application Gateway for Containers inference gateway by using the Kubernetes [Gateway API Inference Extension](https://gateway-api-inference-extension.sigs.k8s.io/). The configuration uses Gateway API resources, an `InferencePool`, and the Endpoint Picker extension (EPP) to route inference requests to model server pods.

In this guide, you deploy:

- A GPU-backed vLLM model server that serves an OpenAI-compatible API
- Gateway API Inference Extension resources
- A [Gateway](https://gateway-api.sigs.k8s.io/api-types/gateway/)
- An EPP deployment, service, and `InferencePool`
- An `HTTPRoute` that sends `/v1` traffic to the `InferencePool`

## How the components fit together

Application Gateway for Containers receives requests at the `Gateway` listener and matches them against an `HTTPRoute`. When the route's `backendRef` is an `InferencePool`, ALB Controller programs the data path to consult the Endpoint Picker (EPP) for each request. The EPP watches the pods that match the `InferencePool` selector, reads vLLM metrics (queue depth, KV cache utilization, served models), and tells the data path which specific pod to send the request to.

> [!IMPORTANT]
> The Application Gateway for Containers inference gateway is currently in preview.<br>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you begin, complete the following tasks:

1. Deploy Application Gateway for Containers and ALB Controller. For more information, see [Quickstart: Deploy Application Gateway for Containers ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md).
1. Enable the inference gateway feature on ALB Controller. For new installations or upgrades of ALB Controller, include `--set albController.aiGateway=true` in the Helm command. When you enable this setting, ALB Controller also installs v1.3.1 of the Gateway API Inference Extension CRDs.
1. Prepare an AKS cluster with a GPU node pool that has at least one schedulable GPU and the NVIDIA device plugin installed. For instructions, see [Use GPUs for compute-intensive workloads on AKS](/azure/aks/gpu-cluster).
1. Install the following tools on your workstation or use Azure Cloud Shell where available:
   - Azure CLI
   - `kubectl`
   - `helm`
1. [Create or obtain a Hugging Face access token](https://huggingface.co/docs/hub/security-tokens) that can download the model used by your vLLM deployment.

## Set environment variables

Set the variables used by the commands in this article.

```bash
NAMESPACE='inference'
INFERENCE_POOL_NAME='vllm-qwen2-5-0-5b'
MODEL_NAME='Qwen/Qwen2.5-0.5B-Instruct'
GATEWAY_NAME='ai-gateway'
HF_TOKEN='<your Hugging Face access token>'
```

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

## Verify Gateway API Inference Extension CRDs

Verify that ALB Controller installed the Gateway API Inference Extension CRDs.

```bash
kubectl get crds | grep inference.networking
```

Expected output (CRD names; creation timestamps differ):

```output
inferenceobjectives.inference.networking.x-k8s.io   2026-05-06T22:07:44Z
inferencepools.inference.networking.k8s.io          2026-05-06T22:07:45Z
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

The vLLM pod requires one `nvidia.com/gpu` and tolerates a `sku=gpu:NoSchedule` taint, so it lands on a GPU node. Remove the toleration if your node pool isn't tainted, or apply the taint with `kubectl taint nodes -l agentpool=<gpu-pool> sku=gpu:NoSchedule`. The pod labels (`app: ${INFERENCE_POOL_NAME}`) are what the `InferencePool` selects on later, so don't change them without also updating the chart's `inferencePool.modelServers.matchLabels.app` value.

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

## Deploy the InferencePool and Endpoint Picker

Deploy the EPP and `InferencePool` together by using the [`inferencepool` Helm chart](https://github.com/kubernetes-sigs/gateway-api-inference-extension/tree/main/config/charts/inferencepool) published by the Kubernetes Gateway API Inference Extension project. The chart creates an EPP `Deployment`, a `Service` on port `9002`, the `ServiceAccount`, `Role`, and `RoleBinding` that let the EPP watch pods, and the `InferencePool` resource itself (named after the Helm release).

```bash
IGW_CHART_VERSION='v1.3.1'
EPP_IMAGE_TAG='v1.3.1'
```

Install the chart.

> [!NOTE]
> The chart appends `-epp` to the Helm release name when naming the EPP `Deployment` and `Service` (`${INFERENCE_POOL_NAME}-epp`). Later steps reference that name when checking rollout status, tailing logs, and inspecting endpoint slices.

```bash
helm upgrade --install "${INFERENCE_POOL_NAME}" \
  --namespace "${NAMESPACE}" \
  --set "inferencePool.modelServers.matchLabels.app=${INFERENCE_POOL_NAME}" \
  --set "inferenceExtension.image.tag=${EPP_IMAGE_TAG}" \
  --set "provider.name=none" \
  --version "${IGW_CHART_VERSION}" \
  oci://registry.k8s.io/gateway-api-inference-extension/charts/inferencepool
```

> [!WARNING]
> The `inferencepool` Helm chart maintained by the Kubernetes Gateway API Inference Extension project renders an `InferencePool` resource named after the Helm release. If an `InferencePool` with the same name already exists in the namespace and was created outside Helm, `helm upgrade --install` refuses to adopt it and the command fails with an `invalid ownership metadata` error. If the existing pool is owned by a different Helm release, the install overwrites that `InferencePool`'s spec, including resetting the EPP image, selector, and `endpointPickerRef` to the v1.3.1 chart defaults. Before running the command, either delete the existing pool (`kubectl delete inferencepool <name> -n $NAMESPACE`) or pick a different `INFERENCE_POOL_NAME` for this walkthrough.

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

Look for `Accepted=True` and `ResolvedRefs=True` in the `InferencePool` status.

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
      - lastTransitionTime: "2026-05-07T03:54:14Z"
        message: ""
        observedGeneration: 3
        reason: ResolvedRefs
        status: "True"
        type: ResolvedRefs
      - lastTransitionTime: "2026-05-07T03:54:14Z"
        message: Route is Accepted
        observedGeneration: 3
        reason: Accepted
        status: "True"
        type: Accepted
      - lastTransitionTime: "2026-05-07T03:54:14Z"
        message: Application Gateway for Containers resource has been successfully
          updated.
        observedGeneration: 3
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

## Optional: create an InferenceObjective

Create an `InferenceObjective` when you want clients to signal serving priority to the EPP. The EPP consumes the objective; the `HTTPRoute` doesn't reference it directly. Higher `priority` values are served before lower ones when the EPP must shed load.

> [!WARNING]
> The `InferenceObjective` resource is currently in the `inference.networking.x-k8s.io/v1alpha2` API group, while `InferencePool` has graduated to `v1`; both groups coexist while the `InferenceObjective` API stabilizes. Expect API changes to the resource.

```bash
kubectl apply -n $NAMESPACE -f - <<EOF
apiVersion: inference.networking.x-k8s.io/v1alpha2
kind: InferenceObjective
metadata:
  name: critical-inference
spec:
  poolRef:
    group: inference.networking.k8s.io
    kind: InferencePool
    name: ${INFERENCE_POOL_NAME}
  priority: 10
EOF
```

Send a request that uses the objective.

```bash
curl -i http://${GATEWAY_ADDRESS}/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -H 'x-gateway-inference-objective: critical-inference' \
  -d "{
    \"model\": \"${MODEL_NAME}\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Summarize what an inference gateway does.\"}],
    \"max_tokens\": 80
  }"
```

## Observe endpoint picker behavior

Review EPP logs to confirm that requests flow through endpoint selection.

```bash
kubectl logs deployment/${INFERENCE_POOL_NAME}-epp -n $NAMESPACE --tail=100
```

Review vLLM metrics from the model server pod.

```bash
POD=$(kubectl get pods -n $NAMESPACE -l app=${INFERENCE_POOL_NAME} -o jsonpath='{.items[0].metadata.name}')

kubectl exec -n $NAMESPACE $POD -- curl -s http://localhost:8000/metrics \
  | grep -E "^vllm:(num_requests_waiting|num_requests_running|kv_cache_usage_perc)"
```

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
| `HTTPRoute` status shows `ResolvedRefs=False` with `reason: BackendNotFound` and `message: InferencePool <namespace>/<name> not found` | The `HTTPRoute`'s `backendRef` name doesn't match an existing `InferencePool`, **or** the `InferencePool` exists but has no ready endpoints (for example, the vLLM pod is `Pending` because no GPU node could be scheduled or scaled up). ALB Controller reports a pool with zero ready endpoints as `BackendNotFound`. | Run `kubectl get inferencepool -n $NAMESPACE` to confirm the name matches the route's `backendRef`. Then run `kubectl get pods -n $NAMESPACE -l app=${INFERENCE_POOL_NAME}` and `kubectl describe pod <pod> -n $NAMESPACE`. If the pod is `Pending` with `FailedScheduling` events like `Insufficient nvidia.com/gpu` or `untolerated taint(s)`, scale up the GPU node pool, fix the toleration, or pick a SKU with available GPU capacity. |
| `curl` returns `503` from the Gateway | EPP can't reach the pool (no ready endpoints) or the EPP service name in `endpointPickerRef` doesn't resolve. | Check `kubectl get endpointslices -n $NAMESPACE -l kubernetes.io/service-name=${INFERENCE_POOL_NAME}-epp` and confirm the `InferencePool.spec.endpointPickerRef.name` matches the chart-installed service name. |
| `curl` returns `404` | Path doesn't match the `HTTPRoute`. | Confirm the request path begins with `/v1` and that the route's `parentRefs` references the same Gateway in the same namespace. |
| Requests hang for >60 seconds, then error | vLLM is still loading the model into GPU memory. | Wait for the readiness probe to succeed; tail vLLM logs until you see `Application startup complete`. |

## Clean up resources

Delete the resources you created in this article.

```bash
kubectl delete inferenceobjective critical-inference -n $NAMESPACE --ignore-not-found
kubectl delete httproute ${INFERENCE_POOL_NAME} -n $NAMESPACE --ignore-not-found
helm uninstall ${INFERENCE_POOL_NAME} -n $NAMESPACE 2>/dev/null || true
kubectl delete gateway ${GATEWAY_NAME} -n $NAMESPACE --ignore-not-found
kubectl delete deployment ${INFERENCE_POOL_NAME} -n $NAMESPACE --ignore-not-found
kubectl delete secret hf-token -n $NAMESPACE --ignore-not-found
kubectl delete namespace $NAMESPACE --ignore-not-found
```

## Next steps

- [Application Gateway for Containers - Inference gateway](inference-gateway.md)
- [Gateway API Inference Extension guides](https://gateway-api-inference-extension.sigs.k8s.io/guides/)
- [Troubleshoot Application Gateway for Containers](troubleshooting-guide.md)
