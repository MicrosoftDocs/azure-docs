---
title: "Quickstart: Start developing with the Azure IoT Operations SDKs (preview)"
description: Setup up a development environment for building and running the samples, as well as creating and testing your own Azure IoT Operations highly available edge applications.
author: dominicbetts
ms.author: dobett
ms.topic: quickstart-sdk
ms.date: 05/08/2025
---

# Quickstart: Start developing with the Azure IoT Operations SDKs (preview)

Get started developing with the Azure IoT Operations SDKs. Follow these steps to set up your development environment for building and running the samples, as well as creating and testing your own highly available edge applications.

[GitHub repository](https://github.com/Azure/iot-operations-sdks) | [.NET SDK](https://github.com/Azure/iot-operations-sdks/tree/main/dotnet) | [Go SDK](https://github.com/Azure/iot-operations-sdks/tree/main/go) | [Rust SDK](https://github.com/Azure/iot-operations-sdks/tree/main/rust)

## Prerequisites

Before you begin, prepare the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

* A [GitHub](https://github.com) account.

* Azure access permissions. For more information, see [Deployment details > Required permissions](../deploy-iot-ops/overview-deploy.md#required-permissions).

## Setting up

Developing with the Azure IoT Operations SDKs requires a Kubernetes cluster with Azure IoT Operations deployed. Further configuration allows the MQTT broker to be accessed directly from the developer environment.

> [!IMPORTANT]
> The following development environment setup options, use [K3s](https://k3s.io/) running in [K3d](https://k3d.io/) for a lightweight Kubernetes cluster, and deploys Azure IoT Operations with [test settings](../deploy-iot-ops/overview-deploy.md#test-settings-deployment). For production deployments, choose [secure settings](../deploy-iot-ops/overview-deploy.md#secure-settings-deployment). <br> If you want to use secure settings, we recommend you follow the instructions in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md) to create a K3s cluster on Ubuntu and [Deploy Azure IoT Operations to a production cluster](../deploy-iot-ops/howto-deploy-iot-operations.md) to deploy with secure settings. Then proceed to [configure Azure IoT Operations for deployment](#configure-azure-iot-operations-for-development).

### [Codespaces](#tab/codespaces)

GitHub Codespaces provides the most streamlined experience and can get the development environment up and running in a couple of minutes.

1. Create a **codespace** in GitHub Codespaces from the *Azure IoT Operations SDKs* repository:

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure/iot-operations-sdks?quickstart=1&editor=vscode)

1. Once the codespace is created, you have a container with the developer tools and a local K3s cluster running in K3d preinstalled.


### [Ubuntu](#tab/ubuntu)

1. Install [Ubuntu](https://ubuntu.com/download/desktop)

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

    1. Install prerequisites including:
        1. `Docker` if not already installed
        1. `Mosquitto` MQTT client for testing
        1. `k3d` to run lightweight Kubernetes clusters
        1. `Helm` for Kubernetes package management
        1. `Step CLI` for certificate management
        1. `Azure CLI` for managing Azure resources
        1. `kubectl` (Kubernetes CLI) for interacting with Kubernetes clusters
        1. `k9s` for managing Kubernetes clusters
    1. **DELETE** any existing k3d cluster
    1. Deploy a new k3d cluster
    1. Set up port forwarding for ports `1883`, `8883`, and `8884` to enable TLS
    1. Create a local container registry
    
1. For the next step you need nonroot access to the cluster, run the following command:

    ```bash
    mkdir ~/.kube; sudo install -o $USER -g $USER -m 600 /root/.kube/config ~/.kube/config
    ```

    This command gives your nonroot user access to the Kubernetes cluster by copying the cluster configuration file from the root account to your user account, ensuring you have the correct permissions to use Kubernetes tools like kubectl without needing root access.

1. Run the following command to increase the [user watch/instance limits](https://www.suse.com/support/kb/doc/?id=000020048).

   ```bash
   echo fs.inotify.max_user_instances=8192 | sudo tee -a /etc/sysctl.conf
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

   sudo sysctl -p
   ```

1. For better performance, increase the file descriptor limit:

   ```bash
   echo fs.file-max = 100000 | sudo tee -a /etc/sysctl.conf

   sudo sysctl -p
   ```

---

## Deploy Azure IoT Operations

You'll arc-enable the development cluster created in the previous step and deploy Azure IoT Operations with [test settings](../deploy-iot-ops/overview-deploy.md#test-settings-deployment).

Open a new bash terminal and do the following steps:

1. Navigate to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Run the `install-aio-arc.sh` script to arc-enable your cluster and deploy Azure IoT Operations, replacing the placeholders with your values:
    
    | Parameter | Value |
    | --------- | ----- |
    | LOCATION | An Azure region close to you. For the list of currently supported regions, see [Supported regions](../overview-support.md#supported-regions). |
    | RESOURCE_GROUP | A name for a new Azure resource group where your cluster will be created. |
    | CLUSTER_NAME | A name for your Kubernetes cluster. |
    | STORAGE_ACCOUNT_NAME | A name for your storage account. Storage account names must be between 3 and 24 characters in length and only contain numbers and lowercase letters. |
    | SCHEMA_REGISTRY_NAME | A name for your schema registry. Schema registry names can only contain numbers, lowercase letters, and hyphens. |
    | SCHEMA_REGISTRY_NAMESPACE | A name for your schema registry namespace. The namespace uniquely identifies a schema registry within a tenant. Schema registry namespace names can only contain numbers, lowercase letters, and hyphens. |

    ```bash
    ./tools/deployment/install-aio-arc.sh -l <LOCATION> -g <RESOURCE_GROUP> -c <CLUSTER_NAME> -s <STORAGE_ACCOUNT_NAME> -r <SCHEMA_REGISTRY_NAME> -n <SCHEMA_REGISTRY_NAMESPACE>
    ```
    
    This script does the following:
    
    1. Log in to Azure CLI
    1. Create a resource group
    1. Register Required Azure Providers
    1. Connect Kubernetes Cluster to Azure Arc
    1. Enable Azure Arc Features
    1. Create Azure Storage Account
    1. Create Azure IoT Operations Schema Registry
    1. Initialize Azure IoT Operations
    1. Create Azure IoT Operations Instance

1. After the deployment is complete, use [az iot ops check](/cli/azure/iot/ops#az-iot-ops-check) to evaluate Azure IoT Operations service deployment for health, configuration, and usability. The *check* command can help you find problems in your deployment and configuration.

    ```azurecli
    az iot ops check
    ```

## Configure Azure IoT Operations for development

After Azure IoT Operations is deployed, you need to configure it for development. This includes setting up the MQTT broker and authentication methods, and ensuring that the necessary environment variables are set for your development environment:

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

## Testing the installation

To test the setup is working correctly, use `mosquitto_pub` to connect to the MQTT broker to validate the x509 certs, SAT, and trust bundle.

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

## Run a Sample

This sample demonstrates a simple communication between a client and a server using [Telemetry](https://github.com/Azure/iot-operations-sdks/blob/main/doc/components.md#telemetry-sender) and [remote procedure call (RPC)](https://github.com/Azure/iot-operations-sdks/blob/main/doc/components.md#command-invoker). The server tracks the value of a counter and accepts RPC requests from the client to either read or increment that counter.

1. Install the [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)

1. The samples within [Azure IoT Operations SDKs GitHub repository](https://github.com/Azure/iot-operations-sdks) read configuration from environment variables. We provide an `.env` file in the repository root that exports the variables used by the samples to connect to the MQTT Broker. Edit the `.env` file to set the values for your environment, or use the default values provided in the file.

1. Navigate to the `CounterServer` sample directory:

    ```bash
    cd <REPOSITORY ROOT>/dotnet/samples/Protocol/Counter/CounterServer/
    ```

1. Build the sample:

    ```bash
    dotnet build
    ```

1. Run the sample:

    ```bash
    source `git rev-parse --show-toplevel`/.env; export AIO_MQTT_CLIENT_ID=counter-server; dotnet run
    ```

1. Open a new shell and navigate to the `CounterClient` sample directory:

    ```bash
    cd <REPOSITORY ROOT>/dotnet/samples/Protocol/Counter/CounterClient/
    ```

1. Build the sample:

    ```bash
    dotnet build
    ```

1. Run the sample:

    ```bash
    source `git rev-parse --show-toplevel`/.env; export AIO_MQTT_CLIENT_ID=counter-client; export COUNTER_SERVER_ID=counter-server; dotnet run
    ```

1. You should see the client and server communicating, with the client sending requests to read and increment the counter value. This is an example of the output messages that you can see:
    
    **CounterClient output:**
    ```output
    CounterClient Information: 0 : Invoked command 'readCounter' with correlation ID 12345 to topic 'rpc/command-samples/counter-server/readCounter'
    CounterClient Information: 0 : Invoked command 'increment' with correlation ID 123456 to topic 'rpc/command-samples/counter-server/increment'
    info: CounterClient.RpcCommandRunner[0] called counter.incr 1 with id 12346
    info: CounterClient.CounterClient[0] Telemetry received from counter-server: CounterValue=1
    info: CounterClient.RpcCommandRunner[0] counter 32 with id 12345
    info: CounterClient.RpcCommandRunner[0] Current telemetry count: 32
    ```
    
    **CounterServer output:**
    ```output
    CounterServer Information: 0 : Command executor for 'reset' started.
    CounterServer Information: 0 : Command executor for 'increment' started.
    CounterServer Information: 0 : Command executor for 'readCounter' started.
    CounterServer.CounterService[0] --> Executing Counter.ReadCounter with id 12345 for counter-client
    CounterServer.CounterService[0] --> Executed Counter.ReadCounter with id 12345 for counter-client
    CounterServer.CounterService[0] --> Executing Counter.Increment with id 12346 for counter-client
    CounterServer.CounterService[0] --> Executed Counter.Increment with id 12346 for counter-client
    CounterServer Information: 0 : Telemetry sent successfully to the topic 'telemetry/telemetry-samples/counterValue'
    ```

1. The `CounterClient` sample automatically exits when it's completed. You can also stop the `CounterServer` sample by pressing `Ctrl+C` in its terminal.


## Configuration summary

### MQTT broker configuration

 With the installation complete, the cluster contains the following MQTT broker definitions:

| Component Type | Name | Description |
|-|-|-|
| `Broker` | default | The MQTT broker |
| `BrokerListener` | default | Provides **cluster access** to the MQTT Broker |
| `BrokerListener` | default-external | Provides **off-cluster access** to the MQTT Broker |
| `BrokerAuthentication` | default | SAT authentication definition |
| `BrokerAuthentication` | default-x509 | An x509 authentication definition |

### MQTT broker access

The MQTT broker can be accessed both on-cluster and off-cluster using the connection information as described in the following table. Refer to [Connection Settings](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/connection-settings.md) for information on which environment variables to use when configuration your application.

> [!NOTE]
>
> The hostname when accessing the MQTT broker off-cluster might differ from `localhost` depending on your setup.

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


## Troubleshooting

Check the troubleshooting guide for common issues in the Azure IoT Operations SDKs GitHub repository: [Troubleshooting](https://github.com/Azure/iot-operations-sdks/blob/main/doc/troubleshooting.md).

## Next steps
In this Quickstart, you set up the Azure IoT Operations SDKs and ran a sample application. To learn more about developing with the SDKs, check out the following resources:

- [Azure IoT Operations SDKs documentation](https://github.com/Azure/iot-operations-sdks/blob/main/doc)