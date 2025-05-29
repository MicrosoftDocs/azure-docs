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

* **Microsoft.Authorization/roleAssignments/write** permissions at the resource group level.

## Setting up

Developing with the Azure IoT Operations SDKs requires a Kubernetes cluster with Azure IoT Operations deployed. Additional configuration will allow MQTT broker to be accessed directly from the developer environment. The following development environment setup options use [k3d](https://k3d.io/#what-is-k3d) to simplify Kubernetes cluster creation. Codespaces provides the most streamlined experience and can get the development environment up and running in a couple of minutes.

### [Codespaces](#tab/codespaces)

> [!CAUTION]
> We are currently experiencing container corruption with Azure IoT Operations deployed in a codespace, so we don't recommend this path until we have resolved the issue with the GitHub team.

1. Create a **codespace** from the *Azure IoT Operations SDKs* repository by clicking the following button:

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure/iot-operations-sdks?quickstart=1&editor=vscode)

1. Once the codespace is created, you will have a container with the developer tools and a local k3s cluster pre-installed.

### [Ubuntu](#tab/ubuntu)

1. Install [Ubuntu](https://ubuntu.com/download/desktop)

1. Install [Docker Engine](https://docs.docker.com/engine/install/ubuntu/)

1. Clone the *Azure IoT Operations SDKs* repository:

    ```bash
    git clone https://github.com/Azure/iot-operations-sdks
    ```

1. Change to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Initialize the cluster and install required dependencies using the `initialize-cluster.sh` script:

    ```bash
    sudo ./tools/deployment/initialize-cluster.sh
    ```

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

1. Change to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Initialize the cluster and install required dependencies using the `initialize-cluster.sh` script:

    ```bash
    sudo ./tools/deployment/initialize-cluster.sh
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

1. Change to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Initialize the cluster and install required dependencies using the `initialize-cluster.sh` script:

    ```bash
    sudo ./tools/deployment/initialize-cluster.sh
    ```

---

## Deploy Azure IoT Operations

Azure IoT Operations will be deployed on the development cluster that you created in the previous step, and then the configuration will be altered with the `configure-aio.sh` script to provide additional off-cluster access methods to streamline development:

### [Codespaces](#tab/codespaces)

1. Follow the instructions in [Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md#connect-cluster-to-azure-arc) to connect your cluster to Azure Arc, create a storage account and schema registry, and deploy Azure IoT Operations.

> [!NOTE]
> The Codespaces environment already has the cluster created, so you can skip the **Create cluster** step in the quickstart.

### [Ubuntu](#tab/ubuntu)

[!INCLUDE [deploy-aio-sdks-linux](../includes/deploy-aio-sdks-linux.md)]

### [Visual Studio Code Dev Containers](#tab/vscode-dev-containers)

[!INCLUDE [deploy-aio-sdks-linux](../includes/deploy-aio-sdks-linux.md)]

### [Windows Subsystem for Linux (WSL)](#tab/wsl)

[!INCLUDE [deploy-aio-sdks-linux](../includes/deploy-aio-sdks-linux.md)]

---

1. Check that Azure IoT Operations is successfully installed and **resolve any errors before continuing**:

    ```azurecli
    az iot ops check
    ```

    Expected output:

    ```output
    ╭─────── Check Summary ───────╮
    │ 13 check(s) succeeded.      │
    │ 0 check(s) raised warnings. │
    │ 0 check(s) raised errors.   │
    │ 4 check(s) were skipped.    │
    ╰─────────────────────────────╯
    ```

1. Change to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Run the `configure-aio.sh` script to configure Azure IoT Operations for development:

    ```bash
    ./tools/deployment/configure-aio.sh
    ```

## Shell configuration

The samples within [Azure IoT Operations SDKs github repository](https://github.com/Azure/iot-operations-sdks) read configuration from environment variables. We have provided an `.env` file in the repository root that exports the variables used by the samples to connect to the MQTT Broker. Edit the `.env` file to set the values for your environment, or use the default values provided in the file.

To load the environment variables into your shell, run the following command in your terminal:

```bash
source <REPOSITORY ROOT>/.env
```

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