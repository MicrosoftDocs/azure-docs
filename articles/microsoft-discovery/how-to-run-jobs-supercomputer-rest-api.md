---
title: Submit and monitor jobs on Discovery Supercomputer using REST APIs
description: Learn how to submit, monitor, and cancel compute jobs on the Microsoft Discovery Supercomputer platform using the data-plane REST APIs.
ms.topic: how-to
ms.service: azure
ms.date: 05/01/2026
ms.author: alzam
author: anzaman
---

# Submit and monitor jobs on Discovery Supercomputer using REST APIs

This article explains how to use the Discovery Supercomputer data-plane REST APIs to submit compute jobs (tool runs), poll their status, retrieve logs, and cancel operations. These APIs let you integrate Discovery workloads into custom pipelines, CI/CD systems, or programmatic workflows.

## Prerequisites

Before you begin, ensure you have:

- A Discovery workspace with a configured **project**, **supercomputer**, **nodepool**, **tool**, and **storage container**.
- [Azure CLI](/cli/azure/install-azure-cli) installed and authenticated (`az login`).
- An HTTP client such as `curl`, Python `httpx`, or any REST client.
- Contributor access to the Azure subscription hosting the Discovery workspace.

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
> Tokens expire after approximately one hour. Refresh the token before making subsequent calls if your workflow runs longer.

## API version

Include the API version as a query parameter on every request. This article uses API version `2026-02-01-preview`:

```
?api-version=2026-02-01-preview
```

This version uses the `storageUri` field with `discovery://storageassets/…` URIs for data mounts, and a flat `infraOverrides` schema with top-level `cpu`, `ram`, `gpu`, `replicaCount`, and `imageUri` fields.

## Base URL

The workspace URL is your Discovery workspace's data-plane endpoint:

```
https://<workspace-name>.<region>.discovery.azure.com
```

All tool-run endpoints are namespaced under a project:

```
{workspace_url}/tools/projects/{project_name}
```

## Submit a job (start a tool run)

To submit a job, send a `POST` request to the `:run` endpoint with a JSON payload describing the command, nodepool, resource requirements, and data mounts.

### Endpoint

```http
POST {workspace_url}/tools/projects/{project_name}:run?api-version=2026-02-01-preview
```

### Request body

```json
{
  "toolId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/workspaces/{ws}/projects/{project}/tools/{tool}",
  "command": "python train.py --epochs 100 --gpus 4",
  "nodePoolIds": [
    "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/workspaces/{ws}/supercomputers/{sc}/nodepools/{pool}"
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
      "storageUri": "discovery://storageassets/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/workspaces/{ws}/storagecontainers/{container}/storageassets/{username}"
    },
    {
      "mountPath": "/blob_shared",
      "storageUri": "discovery://storageassets/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/workspaces/{ws}/storagecontainers/{container}/storageassets/shared"
    }
  ]
}
```

### Request body fields

| Field | Type | Required | Description |
|---|---|---|---|
| `toolId` | string | Yes | Full Azure resource ID of the tool definition to run. |
| `command` | string | Yes | Bash command to execute inside the container. |
| `nodePoolIds` | string[] | Yes | Array of nodepool resource IDs to schedule on. |
| `infraOverrides` | object | No | Resource overrides (CPU, GPU, RAM, image). See [Infrastructure overrides](#infrastructure-overrides). |
| `inputData` | DataMount[] | No | Input data mounts (read-only within the job). |
| `outputData` | DataMount[] | No | Output data mounts (read-write). Results are persisted here. |
| `inlineFiles` | InlineFile[] | No | Base64-encoded files injected into the container at specified paths. |

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

All fields are optional. Omit the entire `infraOverrides` object if you want to use the nodepool defaults.

### DataMount object

| Field | Type | Description |
|---|---|---|
| `mountPath` | string | Path where data is mounted inside the container (e.g., `/blob_user`). |
| `storageUri` | string | Storage asset URI. Format: `discovery://storageassets{storagecontainer_id}/storageassets/{path}` |

### Example: Submit with curl

```bash
# Get access token
TOKEN=$(az account get-access-token \
  --scope "https://discovery.azure.com/access_as_user" \
  --query accessToken -o tsv)

# Submit job
curl -X POST \
  "https://myworkspace.eastus.discovery.azure.com/tools/projects/myproject:run?api-version=2026-02-01-preview" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "toolId": "/subscriptions/.../tools/mytool",
    "command": "python train.py --epochs 50",
    "nodePoolIds": ["/subscriptions/.../nodepools/gpu-pool"],
    "outputData": [
      {
        "mountPath": "/blob_user",
        "storageUri": "discovery://storageassets/.../storageassets/myuser"
      }
    ]
  }'
```

### Response

A successful submission returns a `ToolExecutionResponse` with status `Pending` or `NotStarted`:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "Pending",
  "result": {
    "createdAt": "2026-05-01T14:30:00Z",
    "completedAt": null,
    "runtimeDetails": "",
    "debugInfo": "",
    "outputData": [],
    "status": "Pending",
    "toolReport": {
      "logs": "",
      "percentageComplete": 0,
      "statusInformation": null
    }
  },
  "error": null
}
```

Save the `id` field — this is your **operation ID** used for all subsequent monitoring and cancellation calls.

## Monitor job status

### Get status of a specific operation

```http
GET {workspace_url}/tools/projects/{project_name}/operations/{operation_id}?api-version=2026-02-01-preview
```

#### Example

```bash
curl -s \
  "https://myworkspace.eastus.discovery.azure.com/tools/projects/myproject/operations/a1b2c3d4-e5f6-7890-abcd-ef1234567890?api-version=2026-02-01-preview" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

#### Response

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "Active",
  "result": {
    "createdAt": "2026-05-01T14:30:00Z",
    "completedAt": null,
    "runtimeDetails": "Running on node gpu-pool-node-01",
    "debugInfo": "",
    "outputData": [],
    "status": "Active",
    "toolReport": {
      "logs": "Epoch 1/50: loss=2.34\nEpoch 2/50: loss=1.89\n",
      "percentageComplete": 4.0,
      "statusInformation": null
    }
  },
  "error": null
}
```

### Operation states

| State | Description |
|---|---|
| `NotStarted` | Job is queued but not yet scheduled. |
| `Pending` | Job is accepted and waiting for resources. |
| `Active` | Job is running on the cluster. |
| `Running` | Job is executing (equivalent to Active). |
| `Succeeded` | Job completed successfully. |
| `Failed` | Job terminated with an error. |
| `Canceled` | Job was canceled by the user. |

### Poll until completion

Implement a polling loop that checks the operation status at regular intervals. An operation is considered complete when its status is not in `{NotStarted, Pending, Active, Running}`.

```python
import time
import httpx

def poll_until_complete(
    workspace_url: str,
    project_name: str,
    operation_id: str,
    token: str,
    api_version: str = "2026-02-01-preview",
    poll_interval: int = 5,
    timeout: int = 3600,
) -> dict:
    """Poll an operation until it reaches a terminal state."""
    url = f"{workspace_url}/tools/projects/{project_name}/operations/{operation_id}"
    params = {"api-version": api_version}
    headers = {"Authorization": f"Bearer {token}"}
    
    active_states = {"NotStarted", "Pending", "Active", "Running"}
    start_time = time.time()
    
    while True:
        if time.time() - start_time > timeout:
            raise TimeoutError(f"Operation {operation_id} did not complete within {timeout}s")
        
        response = httpx.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        status = data["status"]
        
        # Print new logs
        logs = data.get("result", {}).get("toolReport", {}).get("logs", "")
        if logs:
            print(logs)
        
        if status not in active_states:
            return data
        
        time.sleep(poll_interval)
```

> [!TIP]
> Use exponential backoff or jitter on the poll interval to reduce load on the API when running many concurrent jobs.

## List operations

Retrieve a list of operations for a project, optionally filtered by status.

### Endpoint

```http
GET {workspace_url}/tools/projects/{project_name}/operations?api-version=2026-02-01-preview&reverse=true
```

### Query parameters

| Parameter | Type | Description |
|---|---|---|
| `api-version` | string | Required. API version. |
| `reverse` | string | Optional. Set to `"true"` to return newest operations first. |
| `status` | string | Optional. Filter by operation status (e.g., `Running`, `Succeeded`). |

### Response

```json
{
  "values": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "status": "Succeeded",
      "nodepoolId": "/subscriptions/.../nodepools/gpu-pool",
      "createdAt": "2026-05-01T14:30:00Z",
      "completedAt": "2026-05-01T15:45:00Z",
      "createdBy": "user@example.com",
      "runtimeDetails": "Completed in 75 minutes"
    }
  ],
  "nextLink": null
}
```

### Pagination

If the response includes a `nextLink` field, fetch the next page by sending a GET request to that URL (with your authorization header). Continue until `nextLink` is `null`.

### Example: List running jobs

```bash
curl -s \
  "https://myworkspace.eastus.discovery.azure.com/tools/projects/myproject/operations?api-version=2026-02-01-preview&status=Active&reverse=true" \
  -H "Authorization: Bearer $TOKEN" | jq '.values[] | {id, status, createdBy, createdAt}'
```

## Cancel an operation

To cancel a running or pending job, post to the `:cancel` endpoint.

### Endpoint

```http
POST {workspace_url}/tools/projects/{project_name}/operations/{operation_id}:cancel?api-version=2026-02-01-preview
```

### Example

```bash
curl -X POST \
  "https://myworkspace.eastus.discovery.azure.com/tools/projects/myproject/operations/a1b2c3d4-e5f6-7890-abcd-ef1234567890:cancel?api-version=2026-02-01-preview" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

The response is an empty body with HTTP 200 on success.

## Get compute usage

Query the current compute usage for your project.

### Endpoint

```http
GET {workspace_url}/tools/projects/{project_name}/computeUsage?api-version=2026-02-01-preview
```

### Example

```bash
curl -s \
  "https://myworkspace.eastus.discovery.azure.com/tools/projects/myproject/computeUsage?api-version=2026-02-01-preview" \
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
    "toolId": "/subscriptions/.../tools/mytool",
    "nodePoolIds": ["/subscriptions/.../nodepools/gpu-pool"],
    "outputData": [
        {"mountPath": "/blob_user", "storageUri": "discovery://storageassets/.../storageassets/myuser"}
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

Job logs are included in the `toolReport.logs` field of the operation status response. Poll the status endpoint to stream logs incrementally:

```python
import time
import httpx

def stream_logs(workspace_url, project_name, operation_id, token, api_version):
    """Stream logs from a running operation."""
    url = f"{workspace_url}/tools/projects/{project_name}/operations/{operation_id}"
    params = {"api-version": api_version}
    headers = {"Authorization": f"Bearer {token}"}
    
    seen_length = 0
    active_states = {"NotStarted", "Pending", "Active", "Running"}
    
    while True:
        response = httpx.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        logs = data.get("result", {}).get("toolReport", {}).get("logs", "")
        if len(logs) > seen_length:
            print(logs[seen_length:], end="")
            seen_length = len(logs)
        
        if data["status"] not in active_states:
            break
        
        time.sleep(5)
    
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
from tenacity import retry, stop_after_attempt, wait_exponential
import httpx

@retry(stop=stop_after_attempt(5), wait=wait_exponential(min=1, max=10))
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

For workloads that need high-performance ephemeral storage (Azure NetApp Files), include a scratch data mount in your submission:

```json
{
  "outputData": [
    {
      "mountPath": "/scratch",
      "storageUri": "discovery://storageassets/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/workspaces/{ws}/storagecontainers/{anf-container}/storageassets/scratch/paths/{unique-id}"
    }
  ]
}
```

The scratch mount uses Azure NetApp Files (ANF) on the same VNet as the supercomputer. Generate a unique path suffix (e.g., UUID) per job to avoid collisions between concurrent runs.

## Complete workflow example

The following Python script demonstrates the full workflow: authenticate, submit a job, poll until completion, and retrieve results.

```python
"""Complete example: submit a job and wait for results."""
import json
import subprocess
import time

import httpx

# Configuration
WORKSPACE_URL = "https://myworkspace.eastus.discovery.azure.com"
PROJECT_NAME = "myproject"
API_VERSION = "2026-02-01-preview"
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
        "toolId": "/subscriptions/.../tools/mytool",
        "command": command,
        "nodePoolIds": ["/subscriptions/.../nodepools/gpu-pool"],
        "infraOverrides": {"gpu": "4", "ram": "64Gi"},
        "outputData": [
            {
                "mountPath": "/blob_user",
                "storageUri": "discovery://storageassets/.../storageassets/myuser",
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


def wait_for_completion(token: str, operation_id: str) -> dict:
    """Poll until the job completes."""
    url = f"{WORKSPACE_URL}/tools/projects/{PROJECT_NAME}/operations/{operation_id}"
    headers = {"Authorization": f"Bearer {token}"}
    params = {"api-version": API_VERSION}
    active_states = {"NotStarted", "Pending", "Active", "Running"}

    while True:
        resp = httpx.get(url, headers=headers, params=params)
        resp.raise_for_status()
        data = resp.json()

        if data["status"] not in active_states:
            print(f"\n✓ Job finished: {data['status']}")
            return data

        # Print progress
        pct = data.get("result", {}).get("toolReport", {}).get("percentageComplete", 0)
        print(f"\r⏳ Status: {data['status']} ({pct:.0f}%)", end="", flush=True)
        time.sleep(5)


if __name__ == "__main__":
    token = get_token()
    op_id = submit_job(token, "python train.py --epochs 50 --output /blob_user/results")
    result = wait_for_completion(token, op_id)

    if result["status"] == "Succeeded":
        print("Job completed successfully!")
        logs = result.get("result", {}).get("toolReport", {}).get("logs", "")
        print(f"Logs:\n{logs}")
    else:
        print(f"Job failed: {result.get('error')}")
```

## Related content

- [Discovery quickstart guide](quickstart-infrastructure-portal.md)
- [Azure CLI authentication](/cli/azure/authenticate-azure-cli)
