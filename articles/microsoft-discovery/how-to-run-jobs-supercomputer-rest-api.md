---
title: Submit and monitor Microsoft Discovery jobs by using REST APIs
description: Learn how to submit, monitor, and cancel compute jobs on the Microsoft Discovery Supercomputer platform using the data-plane REST APIs.
ms.topic: how-to
ms.service: azure
ms.date: 11/10/2026
ms.author: alzam
author: anzaman
---

# Submit and monitor Microsoft Discovery jobs by using REST APIs

This article explains how to use the Discovery Supercomputer data-plane REST APIs to submit compute jobs (tool runs), poll their status, retrieve logs, and cancel operations. These APIs let you integrate Discovery workloads into custom pipelines, CI/CD systems, or programmatic workflows.

## Prerequisites

Before you begin, ensure you have:

- A Discovery workspace with a configured **project**, **supercomputer**, **nodepool**, **tool**, and **storage container**.
- [Azure CLI](/cli/azure/install-azure-cli) installed and authenticated (`az login`).
- An HTTP client such as `curl`, Python `httpx`, or any REST client.
- Discovery data-plane permissions on the project, such as **Microsoft Discovery Project Contributor (Preview)**, and the permissions needed for the referenced shared resources. Subscription Contributor alone doesn't establish data-plane access. See [Project access boundaries](concept-projects-investigations.md#project-access-boundary).
- For the Bash examples, `jq`. For the Python examples, the `httpx` package, and `tenacity` for the retry example.

## Authentication

All Discovery data-plane APIs require a Bearer token scoped to `https://discovery.azure.com/access_as_user`. Obtain a token using Azure CLI:

```bash
az account get-access-token --scope "https://discovery.azure.com/access_as_user" --output json
```

Extract the `accessToken` field from the response and include it in all API requests:

```
Authorization: Bearer <access_token>
```

> [!NOTE]
> Token lifetimes vary. Check the expiration returned by Azure CLI and refresh the token before it expires. The single-token examples are intended for short runs; long-running automation should use a credential provider that refreshes tokens.

## API version

Include the API version as a query parameter on every request. This article uses API version `2026-06-01`:

```
?api-version=2026-06-01
```

This version uses the `storageUri` field with `discovery://storageassets/…` URIs for data mounts, and a flat `infraOverrides` schema with top-level `cpu`, `ram`, `gpu`, `replicaCount`, and `imageUri` fields.

## Base URL

Use the `properties.workspaceApiUri` returned by the workspace ARM resource. Don't construct the endpoint from the workspace name and region. To retrieve it, you need read access to the workspace resource, or an administrator can provide the value.

```bash
WORKSPACE_URL=$(az resource show \
  --ids "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Discovery/workspaces/<workspace-name>" \
  --api-version 2026-06-01 \
  --query properties.workspaceApiUri --output tsv) || exit 1
WORKSPACE_URL="${WORKSPACE_URL%/}"
case "$WORKSPACE_URL" in
  https://*) ;;
  *) echo "The workspace resource didn't return an HTTPS workspaceApiUri." >&2; exit 1 ;;
esac
```

All tool-run endpoints are namespaced under a project:

```
{workspace_url}/tools/projects/{project_name}
```

## Submit a job (start a tool run)

To submit a job, send a `POST` request to the `:run` endpoint with a JSON payload describing the command, nodepool, resource requirements, and data mounts.

> [!IMPORTANT]
> A job can run for a maximum of 42 days. The 42-day limit starts when the job is scheduled from the queue.

### Endpoint

```http
POST {workspace_url}/tools/projects/{project_name}:run?api-version=2026-06-01
```

### Request body

```json
{
  "toolId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/tools/{tool}",
  "command": "python train.py --epochs 100 --gpus 4",
  "nodePoolIds": [
    "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/supercomputers/{sc}/nodePools/{pool}"
  ],
  "infraOverrides": {
    "cpu": "96",
    "ram": "192Gi",
    "gpu": "4",
    "imageUri": "myregistry.azurecr.io/myimage:latest"
  },
  "inputData": [],
  "outputData": [
    {
      "mountPath": "/blob_user",
      "storageUri": "discovery://storageassets/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/storageContainers/{container}/storageAssets/{outputAsset}"
    },
    {
      "mountPath": "/blob_shared",
      "storageUri": "discovery://storageassets/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/storageContainers/{container}/storageAssets/shared"
    }
  ]
}
```

### Request body fields

| Field | Type | Required | Description |
|---|---|---|---|
| `toolId` | string | Yes | Full Azure resource ID of the tool definition to run. |
| `command` | string | No | Arguments passed to the container's entrypoint. Omit to use its configured defaults. Shell features require an explicit shell. |
| `nodePoolIds` | string[] | Yes | Array of nodepool resource IDs to schedule on. |
| `infraOverrides` | object | No | Resource overrides (CPU, GPU, RAM, image). See [Infrastructure overrides](#infrastructure-overrides). |
| `inputData` | DataMount[] | No | Input data mounts (read-only within the job). |
| `outputData` | DataMount[] | No | Output data mounts (read-write). Results are persisted here. |
| `inlineFiles` | InlineFile[] | No | Gzip-compressed, then Base64-encoded files injected at absolute container paths. Each object has `mountPath` and `encodedFile`. |

> [!IMPORTANT]
> `command` supplies container arguments; it doesn't override `ENTRYPOINT` and isn't automatically interpreted by Bash. Use arguments compatible with your image's entrypoint. For globbing, redirection, or pipes, configure an entrypoint or command that deliberately invokes an available shell.

### Infrastructure overrides

```json
{
  "cpu": "96",
  "ram": "192Gi",
  "gpu": "4",
  "replicaCount": 1,
  "imageUri": "myregistry.azurecr.io/myimage:v2"
}
```

All fields are optional. Omit `infraOverrides` to use the requirements in the tool definition.

### DataMount object

| Field | Type | Description |
|---|---|---|
| `mountPath` | string | Path where data is mounted inside the container (e.g., `/blob_user`). |
| `storageUri` | string | Storage asset URI: `discovery://storageassets{storageAssetId}`, optionally followed by `/paths/{relativePath}`. `storageAssetId` is the full ARM ID of an existing asset, beginning with `/subscriptions/`. |

For example, `discovery://storageassets/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/storageContainers/{container}/storageAssets/{assetName}` references an asset. `{assetName}` is the resource name, not a blob path. Append `/paths/{relativePath}` to reference data beneath that asset.

These URIs differ from the `discovery://resources/…` URIs returned by agent resource tools. See [Conversation resource handling](how-to-data-handling-with-tools-agents.md#understand-how-resources-work-in-a-conversation).

### Example: Submit with curl

```bash
# Get access token
TOKEN=$(az account get-access-token \
  --scope "https://discovery.azure.com/access_as_user" \
  --query accessToken -o tsv)

# Submit job
curl -X POST \
  "${WORKSPACE_URL}/tools/projects/myproject:run?api-version=2026-06-01" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "toolId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/tools/{tool}",
    "command": "python train.py --epochs 50",
    "nodePoolIds": ["/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/supercomputers/{sc}/nodePools/{pool}"],
    "outputData": [
      {
        "mountPath": "/blob_user",
        "storageUri": "discovery://storageassets/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/storageContainers/{container}/storageAssets/{outputAsset}"
      }
    ]
  }'
```

### Response

A successful submission returns a `ToolExecutionResponse` with the top-level operation `status` set to `NotStarted`:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "NotStarted",
  "result": {
    "createdAt": "2026-05-01T14:30:00Z",
    "runtimeDetails": "",
    "debugInfo": "",
    "outputData": [],
    "status": "TaskAccepted",
    "toolReport": {
      "logs": "",
      "percentageComplete": 0
    }
  }
}
```

Save the `id` field — this is your **operation ID** used for all subsequent monitoring and cancellation calls.

## Monitor job status

### Get status of a specific operation

```http
GET {workspace_url}/tools/projects/{project_name}/operations/{operation_id}?api-version=2026-06-01
```

#### Example

```bash
curl -s \
  "${WORKSPACE_URL}/tools/projects/myproject/operations/a1b2c3d4-e5f6-7890-abcd-ef1234567890?api-version=2026-06-01" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

#### Response

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "Running",
  "result": {
    "createdAt": "2026-05-01T14:30:00Z",
    "runtimeDetails": "Running on node gpu-pool-node-01",
    "debugInfo": "",
    "outputData": [],
    "status": "TaskRunning",
    "toolReport": {
      "logs": "Epoch 1/50: loss=2.34\nEpoch 2/50: loss=1.89\n",
      "percentageComplete": 4
    }
  }
}
```

### Operation states

The top-level `status` field is the long-running operation state. It has the following values:

| State | Description |
|---|---|
| `NotStarted` | Job is accepted but not yet running. |
| `Running` | Job is running on the supercomputer. |
| `Succeeded` | Job completed successfully. |
| `Failed` | Job terminated with an error. |
| `Canceled` | Job was canceled by the user. |

### Poll until completion

Implement a polling loop that checks the operation status at regular intervals. The terminal states in this API version are `Succeeded`, `Failed`, and `Canceled`. A terminal response isn't necessarily a successful result; inspect its status and error details.

```python
import time
import httpx

def poll_until_complete(
    workspace_url: str,
    project_name: str,
    operation_id: str,
    token: str,
    api_version: str = "2026-06-01",
    poll_interval: int = 5,
    timeout: int = 3600,
) -> dict:
    """Poll an operation until it reaches a terminal state."""
    if poll_interval <= 0 or timeout <= 0:
        raise ValueError("poll_interval and timeout must be positive")
    url = f"{workspace_url}/tools/projects/{project_name}/operations/{operation_id}"
    params = {"api-version": api_version}
    headers = {"Authorization": f"Bearer {token}"}
    
    active_states = {"NotStarted", "Running"}
    terminal_states = {"Succeeded", "Failed", "Canceled"}
    start_time = time.monotonic()
    
    while True:
        if time.monotonic() - start_time >= timeout:
            raise TimeoutError(f"Operation {operation_id} did not complete within {timeout}s")
        
        response = httpx.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        status = data["status"]
        
        # Print new logs
        run_result = data.get("result")
        report = run_result.get("toolReport") if run_result is not None else None
        logs = report.get("logs") if report is not None else None
        if logs:
            print(logs)
        
        if status in terminal_states:
            return data
        if status not in active_states:
            raise ValueError(f"Unexpected operation state: {status}")
        
        time.sleep(poll_interval)
```

> [!TIP]
> Use exponential backoff or jitter on the poll interval to reduce load on the API when running many concurrent jobs.

## List operations

Retrieve a list of operations for a project. For API version `2026-06-01`, use the pagination parameters in this section and filter the returned operations in your client.

### Endpoint

```http
GET {workspace_url}/tools/projects/{project_name}/operations?api-version=2026-06-01
```

### Query parameters

| Parameter | Type | Description |
|---|---|---|
| `api-version` | string | Required. API version. |
| `skip` | integer | Optional. Number of results to skip. |
| `top` | integer | Optional. Number of results to request. |
| `maxpagesize` | integer | Optional. Bound the number of results in one response. |

### Response

```json
{
  "value": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "status": "Succeeded",
      "nodepoolId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/supercomputers/{sc}/nodePools/{pool}",
      "createdAt": "2026-05-01T14:30:00Z",
      "completedAt": "2026-05-01T15:45:00Z",
      "createdBy": "user@example.com",
      "runtimeDetails": "Completed in 75 minutes"
    }
  ]
}
```

### Pagination

If the response includes a `nextLink` field, fetch the next page by sending a GET request to that URL with your authorization header. Stop when no next-page link is returned.

### Example: List running jobs

```bash
curl -s \
  "${WORKSPACE_URL}/tools/projects/myproject/operations?api-version=2026-06-01" \
  -H "Authorization: Bearer $TOKEN" | jq '.value[] | select(.status == "Running") | {id, status, createdBy, createdAt}'
```

## Cancel an operation

To cancel a running or pending job, post to the `:cancel` endpoint.

### Endpoint

```http
POST {workspace_url}/tools/projects/{project_name}/operations/{operation_id}:cancel?api-version=2026-06-01
```

### Example

```bash
curl -X POST \
  "${WORKSPACE_URL}/tools/projects/myproject/operations/a1b2c3d4-e5f6-7890-abcd-ef1234567890:cancel?api-version=2026-06-01" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

For API version `2026-06-01`, a successful cancellation request returns HTTP `202 Accepted`. Poll the operation status to confirm its final state.

## Get compute usage

Query the current compute usage for your project.

### Endpoint

```http
GET {workspace_url}/tools/projects/{project_name}/computeUsage?api-version=2026-06-01
```

### Example

```bash
curl -s \
  "${WORKSPACE_URL}/tools/projects/myproject/computeUsage?api-version=2026-06-01" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

## Submit batch jobs

To submit multiple independent jobs programmatically, call the `:run` endpoint multiple times with different commands. You can parallelize submissions using concurrent HTTP requests.

### Example: Batch submission with Python

```python
import httpx
from concurrent.futures import ThreadPoolExecutor, as_completed

def submit_job(workspace_url, project_name, token, api_version, payload):
    """Submit a single job and return the operation ID."""
    url = f"{workspace_url}/tools/projects/{project_name}:run"
    params = {"api-version": api_version}
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    response = httpx.post(url, headers=headers, params=params, json=payload)
    response.raise_for_status()
    return response.json()["id"]

# Submit 10 jobs in parallel
commands = [f"python experiment.py --seed {i}" for i in range(10)]
base_payload = {
    "toolId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/tools/{tool}",
    "nodePoolIds": ["/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/supercomputers/{sc}/nodePools/{pool}"],
    "outputData": [
        {"mountPath": "/blob_user", "storageUri": "discovery://storageassets/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/storageContainers/{container}/storageAssets/{outputAsset}"}
    ],
}

operation_ids = []
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = {}
    for cmd in commands:
        payload = {**base_payload, "command": cmd}
        future = executor.submit(
            submit_job, workspace_url, project_name, token, api_version, payload
        )
        futures[future] = cmd

    for future in as_completed(futures):
        op_id = future.result()
        operation_ids.append(op_id)
        print(f"Submitted: {futures[future]} -> {op_id}")
```

## Retrieve job logs

The operation status response includes job logs in `result.toolReport.logs`. Set the `logCount` query parameter to request between `0` and `2500` log lines. The response is a snapshot, not a streaming cursor. Poll for changed snapshots as shown in the following example. For retained run history, see [Supercomputer application logs](how-to-query-supercomputer-logs.md#discoverytoollogs_cl-query-examples).

```python
import time
import httpx

def stream_logs(workspace_url, project_name, operation_id, token, api_version,
                poll_interval=5, timeout=3600):
    """Print changed log snapshots from an operation."""
    if poll_interval <= 0 or timeout <= 0:
        raise ValueError("poll_interval and timeout must be positive")
    url = f"{workspace_url}/tools/projects/{project_name}/operations/{operation_id}"
    params = {"api-version": api_version, "logCount": 100}
    headers = {"Authorization": f"Bearer {token}"}
    
    previous_logs = None
    active_states = {"NotStarted", "Running"}
    terminal_states = {"Succeeded", "Failed", "Canceled"}
    start_time = time.monotonic()
    
    while True:
        if time.monotonic() - start_time >= timeout:
            raise TimeoutError(f"Operation {operation_id} did not complete within {timeout}s")
        response = httpx.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        run_result = data.get("result")
        report = run_result.get("toolReport") if run_result is not None else None
        logs = report.get("logs") if report is not None else None
        if logs and logs != previous_logs:
            print(logs)
            previous_logs = logs
        
        if data["status"] in terminal_states:
            break
        if data["status"] not in active_states:
            raise ValueError(f"Unexpected operation state: {data['status']}")
        
        time.sleep(poll_interval)
    
    return data["status"]
```

## Error handling

### HTTP error codes

| Code | Meaning | Action |
|---|---|---|
| 401 | Unauthorized | Refresh your access token. |
| 403 | Forbidden | Verify your RBAC permissions on the workspace. |
| 404 | Not Found | Check the project name, operation ID, or workspace URL. |
| 429 | Too Many Requests | Implement backoff and retry. |
| 5xx | Server Error | Retry with exponential backoff. |

### Retry strategy

The Discovery data-plane may experience transient failures. Implement retries with exponential backoff:

```python
from tenacity import retry, retry_if_exception, stop_after_attempt, wait_exponential
import httpx

@retry(
    retry=retry_if_exception(
        lambda exc: isinstance(exc, httpx.HTTPStatusError)
        and exc.response.status_code in (429, 500, 502, 503, 504)
    ),
    stop=stop_after_attempt(5),
    wait=wait_exponential(min=1, max=10),
    reraise=True,
)
def get_status_with_retry(url, headers, params):
    response = httpx.get(url, headers=headers, params=params)
    if response.status_code in (429, 500, 502, 503, 504):
        raise httpx.HTTPStatusError(
            "Transient error", request=response.request, response=response
        )
    response.raise_for_status()
    return response.json()
```

## Mounting scratch storage

For workloads that use Azure NetApp Files for a scratch working directory, reference an asset in an ANF-backed Discovery storage container:

```json
{
  "outputData": [
    {
      "mountPath": "/scratch",
      "storageUri": "discovery://storageassets/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/storageContainers/{anf-container}/storageAssets/scratch/paths/{unique-id}"
    }
  ]
}
```

The ANF volume must be reachable from the supercomputer. Generate a unique path suffix, such as a UUID, per job to avoid collisions. A scratch mount doesn't make the backing volume ephemeral; plan cleanup for the persisted data.

## Complete workflow example

The following Python workflow skeleton authenticates, submits a job, polls until completion, and retrieves results. Replace the sample endpoint, project, tool, node pool, and storage asset IDs before running it. Configure token refresh and a polling deadline for production automation.

```python
"""Complete example: submit a job and wait for results."""
import json
import subprocess
import time

import httpx

# Configuration
WORKSPACE_URL = "<workspaceApiUri>".rstrip("/")
PROJECT_NAME = "myproject"
API_VERSION = "2026-06-01"
SCOPE = "https://discovery.azure.com/access_as_user"


def get_token() -> str:
    """Get access token from Azure CLI."""
    result = subprocess.run(
        ["az", "account", "get-access-token", "--scope", SCOPE, "--output", "json"],
        capture_output=True, text=True, check=True,
    )
    return json.loads(result.stdout)["accessToken"]


def submit_job(token: str, command: str) -> str:
    """Submit a tool run and return the operation ID."""
    url = f"{WORKSPACE_URL}/tools/projects/{PROJECT_NAME}:run"
    payload = {
        "toolId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/tools/{tool}",
        "command": command,
        "nodePoolIds": ["/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/supercomputers/{sc}/nodePools/{pool}"],
        "infraOverrides": {"gpu": "4", "ram": "64Gi"},
        "outputData": [
            {
                "mountPath": "/blob_user",
                "storageUri": "discovery://storageassets/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/storageContainers/{container}/storageAssets/{outputAsset}",
            }
        ],
    }
    response = httpx.post(
        url,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        params={"api-version": API_VERSION},
        json=payload,
    )
    response.raise_for_status()
    op_id = response.json()["id"]
    print(f"✓ Job submitted: {op_id}")
    return op_id


def wait_for_completion(token: str, operation_id: str,
                        poll_interval: int = 5, timeout: int = 3600) -> dict:
    """Poll until the job completes."""
    if poll_interval <= 0 or timeout <= 0:
        raise ValueError("poll_interval and timeout must be positive")
    url = f"{WORKSPACE_URL}/tools/projects/{PROJECT_NAME}/operations/{operation_id}"
    headers = {"Authorization": f"Bearer {token}"}
    params = {"api-version": API_VERSION}
    active_states = {"NotStarted", "Running"}
    terminal_states = {"Succeeded", "Failed", "Canceled"}
    start_time = time.monotonic()

    while True:
        if time.monotonic() - start_time >= timeout:
            raise TimeoutError(f"Operation {operation_id} did not complete within {timeout}s")
        resp = httpx.get(url, headers=headers, params=params)
        resp.raise_for_status()
        data = resp.json()

        if data["status"] in terminal_states:
            print(f"\n✓ Job finished: {data['status']}")
            return data
        if data["status"] not in active_states:
            raise ValueError(f"Unexpected operation state: {data['status']}")

        # Print progress
        run_result = data.get("result")
        report = run_result.get("toolReport") if run_result is not None else None
        pct = report.get("percentageComplete") if report is not None else None
        progress = f" ({pct:.0f}%)" if pct is not None else ""
        print(f"\rStatus: {data['status']}{progress}", end="", flush=True)
        time.sleep(poll_interval)


if __name__ == "__main__":
    token = get_token()
    op_id = submit_job(token, "python train.py --epochs 50 --output /blob_user/results")
    result = wait_for_completion(token, op_id)

    if result["status"] == "Succeeded":
        print("Job completed successfully!")
        logs = result.get("result", {}).get("toolReport", {}).get("logs", "")
        print(f"Logs:\n{logs}")
    else:
        raise RuntimeError(f"Job ended with {result['status']}: {result.get('error')}")
```

## Related content

- [Discovery quickstart guide](quickstart-infrastructure.md)
- [Azure CLI authentication](/cli/azure/authenticate-azure-cli)
