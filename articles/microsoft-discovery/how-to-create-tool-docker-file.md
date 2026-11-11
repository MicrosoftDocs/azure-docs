---
title: Create a Dockerfile for a Microsoft Discovery tool
description: Learn how to containerize a tool for Microsoft Discovery by creating a Dockerfile, organizing the project structure, building and testing the container image locally.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 11/10/2026

#CustomerIntent: As a tool publisher, I want to containerize my tool using Docker so that it can be deployed reliably and consistently on the Microsoft Discovery platform.
---

# Create a Dockerfile for a Microsoft Discovery tool

Containerizing your tool with Docker ensures it runs consistently across different hardware, compute pools, and environments within Microsoft Discovery. This article walks through organizing your tool's project, writing a Dockerfile, and validating the container image locally.

> [!NOTE]
> This article assumes you understand tool's requirements and have written any action scripts. See [Plan tool requirements](how-to-plan-tool-requirements.md) and [Write action scripts](how-to-write-tool-action-scripts.md).

## Prerequisites

Before creating a Dockerfile, ensure the following are installed and configured on your local machine:

- **Docker Desktop** (version 20.10.0 or later), or Docker Engine. Download from [Docker Official Website](https://www.docker.com/products/docker-desktop/). Verify the Docker daemon is running: `docker info`.
- **Azure CLI** (version 2.0.80 or later), configured with an active login: `az login`. Required when pushing to Azure Container Registry in a later step.
- A text editor or IDE with Dockerfile support. [VS Code](https://code.visualstudio.com/) with the Docker extension is recommended.

## Step 1: Organize your project directory

Organize your tool's files before writing the Dockerfile. A consistent structure makes the Dockerfile easier to write and maintain.

**Recommended structure:**

```text
<tool-name>/
    ├── Dockerfile                          # Container definition (created in this article)
    ├── README.md                           # Documentation
    ├── tool.yaml                           # Tool definition (created in a later step)
    ├── requirements.txt                    # Tested Python dependency versions
    ├── app/                                # Core implementation scripts
        ├── entrypoint.py                   # Main entrypoint for all actions
        ├── io_utils.py                     # I/O utilities and logging helpers
        └── <action_module>.py              # One module per action
```

## Step 2: Create the Dockerfile

Create a file named `Dockerfile` (no extension) in the root of your tool directory.

The structure of your Dockerfile depends on your tool's language runtime and dependencies. 

For a Python tool, start with the following structure. Add the tested dependency versions to `requirements.txt`, including RDKit if you use the [RDKit environment test](#step-5-test-the-container-image-locally), and put your action scripts in `app/`.

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY app/ /app/
```

Add any system libraries your dependencies require before installing the Python packages. The runtime and libraries in the image must match those advertised by your tool definition.

> [!IMPORTANT]
> Keep the image's startup configuration compatible with the full `command` in your tool definition. This example leaves `ENTRYPOINT` unset and uses an explicit `python3 /app/entrypoint.py` command. If you use an image with an `ENTRYPOINT`, test that configuration with your tool definition before using it in Discovery.

## Step 3: Adapt for GPU or MPI tools

If your tool requires GPU acceleration or MPI-based distributed computing, the base image and system dependencies change accordingly.

**GPU tools (CUDA):**

```dockerfile
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

# Install CUDA-compatible Python environment
RUN apt-get update && apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*
```

**MPI tools (tightly coupled parallel workloads):**

```dockerfile
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
      openmpi-bin \
      libopenmpi-dev \
      python3 python3-pip \
 && rm -rf /var/lib/apt/lists/*
```

## Step 4: Build the container image locally

Navigate to your tool directory and build the image:

```bash
TOOL_NAME="molecular-groups"
cd "./$TOOL_NAME"

docker build -t "$TOOL_NAME:latest" .
```

Build time varies depending on the number and size of dependencies. Subsequent builds are faster because Docker caches layers that aren't changed.

## Step 5: Test the container image locally

Before publishing, verify the container image runs correctly with test inputs.

**Verify the environment:**

```bash
docker run --rm "$TOOL_NAME:latest" python -c "import rdkit; print('RDKit OK')"
```

If your tool doesn't depend on RDKit, replace this import with a library that your tool actually uses.

**Run an action with mounted test data:**

```bash
docker run --rm \
  -v "$(pwd)/input:/input" \
  -v "$(pwd)/output:/output" \
  "$TOOL_NAME:latest" \
  python3 /app/entrypoint.py \
    --action identify_functional_groups \
    --input /input \
    --output /output
```

**Inspect the output:**

```bash
ls ./output/
cat ./output/results.json
```

Confirm that:
- The container exits with code `0`
- The expected output files are present in `/output/`

## Next steps

Once your container image builds and passes local tests, proceed to publish it to Azure Container Registry:

- [Build and publish a tool container to Azure Container Registry](how-to-publish-tool-to-acr.md)

## Related content

- [Plan tool requirements for Microsoft Discovery](how-to-plan-tool-requirements.md)
- [Write action scripts for a Discovery tool](how-to-write-tool-action-scripts.md)
- [Create a tool definition](how-to-create-tool-definition.md)
