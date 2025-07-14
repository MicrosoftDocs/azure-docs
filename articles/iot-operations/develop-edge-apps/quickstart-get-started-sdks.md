---
title: "Quickstart: Start developing with the Azure IoT Operations SDKs (preview)"
description: Setup up a development environment for building and running the samples, as well as creating and testing your own Azure IoT Operations highly available edge applications.
author: asergaz
ms.author: sergaz
ms.topic: quickstart-sdk
ms.date: 05/08/2025
---

# Quickstart: Start developing with the Azure IoT Operations SDKs (preview)

Get started developing with the Azure IoT Operations SDKs. Follow these steps to set up your development environment for building and running the samples, as well as creating and testing your own highly available edge applications.

[GitHub repository](https://github.com/Azure/iot-operations-sdks) | [.NET SDK](https://github.com/Azure/iot-operations-sdks/tree/main/dotnet) | [Go SDK](https://github.com/Azure/iot-operations-sdks/tree/main/go) | [Rust SDK](https://github.com/Azure/iot-operations-sdks/tree/main/rust)

## Prerequisites

Before you begin, prepare the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A [GitHub](https://github.com) account.

* Azure access permissions. For more information, see [Deployment details > Required permissions](../deploy-iot-ops/overview-deploy.md#required-permissions).

## Setting up

Developing with the Azure IoT Operations SDKs requires a Kubernetes cluster with Azure IoT Operations deployed. Additional configuration will allow the MQTT broker to be accessed directly from the developer environment.

<!-- TODO: Point to the new article Production Cluster when published -->
> [!IMPORTANT]
> The following development environment setup options, use [K3s](https://k3s.io/) running in [K3d](https://k3d.io/) for a lightweight Kubernetes cluster, and deploys Azure IoT Operations with [test settings](../deploy-iot-ops/overview-deploy.md#test-settings-deployment). If you want to use [secure settings](../deploy-iot-ops/overview-deploy.md#secure-settings-deployment), we recommend you follow the instructions in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md) to create a K3s cluster on Ubuntu and [Deploy Azure IoT Operations to a production cluster](../deploy-iot-ops/howto-deploy-iot-operations.md) to deploy with secure settings. Then proceed to [configure Azure IoT Operations for deployment](#configure-azure-iot-operations-for-deployment).

### [Codespaces](#tab/codespaces)

> [!CAUTION]
> We are currently experiencing container corruption with Azure IoT Operations deployed in a codespace, so we don't recommend this path until we have resolved the issue with the GitHub team.

GitHub Codespaces provides the most streamlined experience and can get the development environment up and running in a couple of minutes.

1. Create a **codespace** in GitHub Codespaces from the *Azure IoT Operations SDKs* repository:

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure/iot-operations-sdks?quickstart=1&editor=vscode)

1. Once the codespace is created, you will have a container with the developer tools and a local k3s cluster running in k3d pre-installed.


### [Ubuntu](#tab/ubuntu)

1. Install [Ubuntu](https://ubuntu.com/download/desktop)

1. Install [Docker Engine](https://docs.docker.com/engine/install/ubuntu/)

1. Clone the *Azure IoT Operations SDKs* repository:

    ```bash
    git clone https://github.com/Azure/iot-operations-sdks
    ```

1. Navigate to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Initialize the cluster and install required dependencies using the `initialize-cluster.sh` script:

    ```bash
    sudo ./tools/deployment/initialize-cluster.sh
    ```

    This script does the following:

    1. Installs prerequisites including:
        1. Install k3d
        1. Install Step CLI
        1. Helm
        1. AZ CLI
        1. Step
    1. **DELETE** the existing default k3d cluster
    1. Deploy a new k3d cluster
    1. Set up port forwarding for ports `1883`, `8883`, and `8884` to enable TLS
    1. Create a local registry

### [Visual Studio Code Dev Containers](#tab/vscode-dev-containers)

> [!WARNING]
> The latest WSL release **doesn't support Azure IoT Operations**. You will need to install [WSL v2.3.14](https://github.com/microsoft/WSL/releases/tag/2.3.14) as outlined in the steps below.

1. Install [WSL v2.3.14](https://github.com/microsoft/WSL/releases/tag/2.3.14) (contains kernel v6.6)

1. Install [Docker Desktop for Windows](https://docs.docker.com/desktop/features/wsl/) with WSL 2 backend, and confirm it's running the **v6.6 kernel**:

    ```bash
    wsl -d docker-desktop -e uname -a
    ```

    output:

    ```output
    Linux docker-desktop 6.6.36.3-microsoft-standard-WSL2 ...
    ```

1. Install [VS Code](https://code.visualstudio.com/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

1. Launch VS Code, and clone the repository in a container:

    `F1 > Dev Containers: Clone Repository in Container Volume...`

1. When prompted, enter the *Azure IoT Operations SDKs* URL and select the `main` branch:

    ```bash
    https://github.com/azure/iot-operations-sdks
    ```

> [!TIP]
> To reconnect to the container in VSCode, choose `F1 > Dev Containers: Attach to Running Container...` and then select the container name created previously.

### [Windows Subsystem for Linux (WSL)](#tab/wsl)

> [!WARNING]
> The latest WSL release **doesn't support Azure IoT Operations**. You will need to install [WSL v2.3.14](https://github.com/microsoft/WSL/releases/tag/2.3.14) as outlined in the steps below.

1. Install [WSL v2.3.14](https://github.com/microsoft/WSL/releases/tag/2.3.14) (contains kernel v6.6)

1. Install [Docker Desktop for Windows](https://docs.docker.com/desktop/features/wsl/) with WSL 2 backend, and confirm it's running the **v6.6 kernel**:

    ```bash
    wsl -d docker-desktop -e uname -a
    ```

    output:

    ```output
    Linux docker-desktop 6.6.36.3-microsoft-standard-WSL2 ...
    ```

1. Clone the *Azure IoT Operations SDKs* repository:

    ```bash
    git clone https://github.com/Azure/iot-operations-sdks
    ```

1. Navigate to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Initialize the cluster and install required dependencies using the `initialize-cluster.sh` script:

    ```bash
    sudo ./tools/deployment/initialize-cluster.sh
    ```

    This script does the following:

    1. Installs prerequisites including:
        1. Install k3d
        1. Install Step CLI
        1. Helm
        1. AZ CLI
        1. Step
    1. **DELETE** the existing default k3d cluster
    1. Deploy a new k3d cluster
    1. Set up port forwarding for ports `1883`, `8883`, and `8884` to enable TLS
    1. Create a local registry

---

## Deploy Azure IoT Operations

You will arc-enable the development cluster created in the previous step and deploy Azure IoT Operations with [test settings](../deploy-iot-ops/overview-deploy.md#test-settings-deployment).

Open a new bash terminal and do the following steps:

1. Run the following command to set the required environment variables:
    
    | Parameter | Value |
    | --------- | ----- |
    | <LOCATION> | An Azure region close to you. For the list of currently supported regions, see [Supported regions](../overview-iot-operations.md#supported-regions). |
    | <CLUSTER_NAME> | A name for your Kubernetes cluster. |
    | <RESOURCE_GROUP> | A name for a new Azure resource group where your cluster will be created. |
    | <STORAGE_ACCOUNT_NAME> | A name for your storage account. Storage account names must be between 3 and 24 characters in length and only contain numbers and lowercase letters. |
   | <SCHEMA_REGISTRY_NAME> | A name for your schema registry. Schema registry names can only contain numbers, lowercase letters, and hyphens. |
   | <SCHEMA_REGISTRY_NAMESPACE> | A name for your schema registry namespace. The namespace uniquely identifies a schema registry within a tenant. Schema registry namespace names can only contain numbers, lowercase letters, and hyphens. |

    ```bash
    export LOCATION=<LOCATION>
    export RESOURCE_GROUP=<RESOURCE_GROUP>
    export CLUSTER_NAME=<CLUSTER_NAME>
    export STORAGE_ACCOUNT=<STORAGE_ACCOUNT_NAME>
    export SCHEMA_REGISTRY=<SCHEMA_REGISTRY_NAME>
    export SCHEMA_REGISTRY_NAMESPACE=<SCHEMA_REGISTRY_NAMESPACE>
    ```

    > [!NOTE]
    > Replace the placeholders with your values. You will create the resource group, storage account and schema registry in the next steps.


1. Sign in to Azure CLI:

   ```azurecli
   az login
   ```

   > [!TIP]
   > If you're using the GitHub codespace environment in a browser rather than VS Code desktop, running `az login` returns a localhost error. To fix the error, either:
   >
   > * Open the codespace in VS Code desktop, and then return to the browser terminal and rerun `az login`.
   > * Or, after you get the localhost error on the browser, copy the URL from the browser and run `curl "<URL>"` in a new terminal tab. You should see a JSON response with the message "You have logged into Microsoft Azure!."

1. After you sign in, Azure CLI displays all of your subscriptions and indicates your default subscription with an asterisk `*`. To continue with your default subscription, select `Enter`. Otherwise, type the number of the Azure subscription that you want to use.

1. Create an Azure resource group. Only one Azure IoT Operations instance is supported per resource group. To create a new resource group, use the [az group create](/cli/azure/group#az-group-create) command.

   ```azurecli
   az group create --location $LOCATION --resource-group $RESOURCE_GROUP
   ```

1. Navigate to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Run the `install-aio-arc.sh` script to arc-enable your cluster and deploy Azure IoT Operations:

    ```bash
    ./tools/deployment/install-aio-arc.sh
    ```
    
    This script does the following:
    
    1. Log in to Azure CLI
    1. Validate Required Environment Variables
    1. Register Required Azure Providers
    1. Connect Kubernetes Cluster to Azure Arc
    1. Enable Azure Arc Features
    1. Create Azure Storage Account
    1. Create Azure IoT Operations Schema Registry
    1. Initialize Azure IoT Operations
    1. Create Azure IoT Operations Instance

<!-- TODO: Confirm that this works well on a K3s cluster running AIO with Secure Settings -->
## Configure Azure IoT Operations for development

After Azure IoT Operations is deployed, you need to configure it for development. This includes setting up the MQTT broker and authentication methods, as well as ensuring that the necessary environment variables are set for your development environment:

1. After the deployment is complete, use [az iot ops check](/cli/azure/iot/ops#az-iot-ops-check) to evaluate Azure IoT Operations service deployment for health, configuration, and usability. The *check* command can help you find problems in your deployment and configuration.

    ```azurecli
    az iot ops check
    ```

1. Navigate to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Run the `configure-aio.sh` script to configure Azure IoT Operations for development:

    ```bash
    ./tools/deployment/configure-aio.sh
    ```

    This script does the following:

    1. Setup certificate services, if missing
    1. Create root and intermediate CAs for x509 authentication
    1. Create the trust bundle ConfigMap for the Broker to authentication x509 clients
    1. Configure a `BrokerListener` and `BrokerAuthentication` resources for SAT and x509 auth

## Shell configuration

The samples within [Azure IoT Operations SDKs github repository](https://github.com/Azure/iot-operations-sdks) read configuration from environment variables. We have provided an `.env` file in the repository root that exports the variables used by the samples to connect to the MQTT Broker. Edit the `.env` file to set the values for your environment, or use the default values provided in the file.

To load the environment variables into your shell, run the following command in your terminal:

```bash
source <REPOSITORY ROOT>/.env
```

<!-- TODO: Check why this only works with VSCode Dev Containers when I do: kubectl port-forward -n azure-iot-operations service/aio-broker-external 8883:8883 -->
## Testing the installation

To test the setup is working correctly, use `mosquitto_pub` to connect to the MQTT broker to validate the x509 certs, SAT and trust bundle.

1. Export the `.session` directory:

    ```bash
    export SESSION=$(git rev-parse --show-toplevel)/.session
    ```

1. Test no TLS, no auth:

    ```bash
    mosquitto_pub -L mqtt://localhost:1883/hello -m world --debug
    ```

1. Test TLS with x509 auth:

    ```bash
    mosquitto_pub -L mqtts://localhost:8883/hello -m world --cafile $SESSION/broker-ca.crt --cert $SESSION/client.crt --key $SESSION/client.key --debug
    ```

1. Test TLS with SAT auth:

    ```bash
    mosquitto_pub -L mqtts://localhost:8884/hello -m world --cafile $SESSION/broker-ca.crt -D CONNECT authentication-method K8S-SAT -D CONNECT authentication-data $(cat $SESSION/token.txt) --debug
    ```

## Configuration summary

### MQTT broker configuration

 With the installation complete, the cluster will contain the following MQTT broker definitions:

| Component Type | Name | Description |
|-|-|-|
| `Broker` | default | The MQTT broker |
| `BrokerListener` | default | Provides **cluster access** to the MQTT Broker |
| `BrokerListener` | default-external | Provides **off-cluster access** to the MQTT Broker |
| `BrokerAuthentication` | default | SAT authentication definition |
| `BrokerAuthentication` | default-x509 | An x509 authentication definition |

### MQTT broker access

The MQTT broker can be accessed both on-cluster and off-cluster using the connection information below. Refer to [Connection Settings](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/connection-settings.md) for information on which environment variables to use when configuration your application.

> [!NOTE]
>
> The hostname when accessing the MQTT broker off-cluster may differ from `localhost` depending on your setup.

| Hostname | Authentication | TLS | On cluster port | Off cluster port |
|-|-|-|-|-|
| `aio-broker` | SAT | :white_check_mark: | `18883` | - |
| `localhost` | None | :x: | `1883` | `1883` |
| `localhost` | x509 | :white_check_mark: | `8883` | `8883` |
| `localhost` | SAT | :white_check_mark: | `8884` | `8884` |

### Development artifacts

As part of the deployment script, the following files are created in the local environment, to facilitate connection and authentication to the MQTT broker. These files are located in the `.session` directory, found at the repository root.

| File | Description |
|-|-|
| `broker-ca.crt` | The MQTT broker trust bundle required to validate the MQTT broker on ports `8883` and `8884` |
| `token.txt` | A Service authentication token (SAT) for authenticating with the MQTT broker on `8884` |
| `client.crt` | A x509 client certificate for authenticating with the MQTT broker on port `8883` |
| `client.key` | A x509 client private key for authenticating with the MQTT broker on port `8883` |


<!-- 10. ## Troubleshooting -------------------------------------------------------------
Optional:  If you're aware that people commonly run into trouble, help them resolve those
issues in this section.

- Describe common errors and exceptions. Help unpack them if necessary. Include guidance
  for graceful handling and recovery.
- Provide information to help developers avoid throttling or other service-enforced
  errors. For example, provide guidance and examples for using retry or connection
  policies if the library supports it.
- If the client library or a related library supports it, include tips for logging or
  enabling instrumentation to help debug code.

-->

## Troubleshooting
TODO: Add troubleshooting section.

<!-- 11. ## Next steps ------------------------------------------------------------------
Required: Provide a link to the next step for a developer, for instance, a tutorial. 

- Summarize the tasks the developer completed in this Quickstart.
- Provide a button for a suggested next step.
 
Use the `[!div class="nextstepaction"]` extension.

> [!div class="nextstepaction"]
> [Link text](link)


-->
## Next steps
TODO: Add summary and button.

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.

-->