---
title: "Quickstart: Start developing with the Azure IoT Operations SDKs"
description: Setup up a development environment for building and running the samples, as well as creating and testing your own Azure IoT Operations highly available edge applications.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: quickstart-sdk
ms.date: 07/31/2026
ai-usage: ai-assisted
---

# Quickstart: Start developing with the Azure IoT Operations SDKs

Get started developing with the Azure IoT Operations SDKs. Follow these steps to set up your development environment for building and running the samples, as well as creating and testing your own highly available edge applications.

[GitHub repository](https://github.com/Azure/iot-operations-sdks) | [.NET SDK](https://github.com/Azure/iot-operations-sdks/tree/main/dotnet) | [Go SDK](https://github.com/Azure/iot-operations-sdks/tree/main/go) | [Rust SDK](https://github.com/Azure/iot-operations-sdks/tree/main/rust)

## Prerequisites

Before you begin, prepare the following prerequisites:

[!INCLUDE [prereq-azure-subscription](../includes/prereq-azure-subscription.md)]

* A [GitHub](https://github.com) account.

* Azure access permissions. For more information, see [Deployment overview > Required permissions](../deploy-iot-ops/overview-deploy.md#required-permissions).

[!INCLUDE [set-environment-variables](../includes/set-environment-variables.md)]

This article also uses the following environment variables for resource names that you choose: `SCHEMA_REGISTRY` (the name of the schema registry), `SCHEMA_REGISTRY_NAMESPACE` (the name of the schema registry namespace), `STORAGE_ACCOUNT` (the name of the storage account). Set each one to a value that you want before you run the related commands.

## Setting up

Developing with the Azure IoT Operations SDKs requires a Kubernetes cluster with Azure IoT Operations deployed. Further configuration allows you to access the MQTT broker directly from the developer environment.

> [!IMPORTANT]
> The following development environment setup options use [K3s](https://k3s.io/) running in [K3d](https://k3d.io/) for a lightweight Kubernetes cluster. They deploy Azure IoT Operations with [test settings](../deploy-iot-ops/overview-deploy.md#test-settings-deployment). For production deployments, choose [secure settings](../deploy-iot-ops/overview-deploy.md#secure-settings-deployment). <br> To use secure settings, follow the instructions in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md) to create a K3s cluster on Ubuntu and [Deploy Azure IoT Operations to a production cluster](../deploy-iot-ops/howto-deploy-iot-operations.md) to deploy with secure settings. Then proceed to [configure Azure IoT Operations for development](#configure-azure-iot-operations-for-development).

### [Codespaces](#tab/codespaces)

GitHub Codespaces provides the most streamlined experience and can get the development environment up and running in a couple of minutes.

1. Create a **codespace** in GitHub Codespaces from the *Azure IoT Operations SDKs* repository:

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure/iot-operations-sdks?quickstart=1&editor=vscode)

1. After the codespace is created, you have a container with the developer tools and a local K3s cluster running in K3d preinstalled.


### [Ubuntu](#tab/ubuntu)

1. Install [Ubuntu](https://ubuntu.com/download/desktop).

1. Clone the *Azure IoT Operations SDKs* repository:

    ```bash
    git clone https://github.com/Azure/iot-operations-sdks
    ```

1. Go to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Run the `initialize-cluster.sh` script to initialize the cluster and install required dependencies:

    ```bash
    sudo ./tools/deployment/initialize-cluster.sh
    ```

    This script runs the following commands:

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

    This command gives your nonroot user access to the Kubernetes cluster by copying the cluster configuration file from the root account to your user account. This step ensures you have the correct permissions to use Kubernetes tools like kubectl without needing root access.

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

Open a new Bash terminal and complete the following steps:

1. Go to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Run the `install-aio-arc.sh` script to arc-enable your cluster and deploy Azure IoT Operations. Replace the placeholders with your values:
    
    | Parameter | Value |
    | --------- | ----- |
    | `LOCATION` | An Azure region close to you. For the list of currently supported regions, see [Supported regions](../overview-support.md#supported-regions). |
    | `RESOURCE_GROUP` | A name for a new Azure resource group where your cluster will be created. |
    | `CLUSTER_NAME` | A name for your Kubernetes cluster. |
    | `STORAGE_ACCOUNT_NAME` | A name for your storage account. Storage account names must be between 3 and 24 characters in length and only contain numbers and lowercase letters. |
    | `SCHEMA_REGISTRY_NAME` | A name for your schema registry. Schema registry names can only contain numbers, lowercase letters, and hyphens. |
    | `SCHEMA_REGISTRY_NAMESPACE` | A name for your schema registry namespace. The namespace uniquely identifies a schema registry within a tenant. Schema registry namespace names can only contain numbers, lowercase letters, and hyphens. |
    | `DEVICE_REGISTRY_NAMESPACE` | A name for your device registry namespace. Must be unique within your tenant, and between 3 and 24 characters. Can only contain numbers, letters, hyphens, and underscores. |

    ```bash
    ./tools/deployment/install-aio-arc.sh -l <LOCATION> -g <RESOURCE_GROUP> -c <CLUSTER_NAME> -s <STORAGE_ACCOUNT_NAME> -r <SCHEMA_REGISTRY_NAME> -n <SCHEMA_REGISTRY_NAMESPACE> -d <DEVICE_REGISTRY_NAMESPACE>
    ```
    
    This script runs the following commands:
    
    1. Log in to Azure CLI
    1. Create a resource group
    1. Register required Azure providers
    1. Connect Kubernetes cluster to Azure Arc
    1. Enable Azure Arc features
    1. Create Azure Storage account
    1. Create Azure IoT Operations schema registry
    1. Create Azure device registry namespace
    1. Initialize Azure IoT Operations
    1. Create Azure IoT Operations instance

1. After the deployment finishes, use [az iot ops check](/cli/azure/iot/ops#az-iot-ops-check) to evaluate Azure IoT Operations service deployment for health, configuration, and usability. The *check* command can help you find problems in your deployment and configuration.

    ```azurecli
    az iot ops check
    ```

## Configure Azure IoT Operations for development

After you deploy Azure IoT Operations, configure it for development. Set up the MQTT broker and authentication methods. Make sure you set the necessary environment variables for your development environment:

1. Go to the repository root directory:

    ```bash
    cd <REPOSITORY ROOT>
    ```

1. Run the `configure-aio.sh` script to configure Azure IoT Operations for development:

    ```bash
    ./tools/deployment/configure-aio.sh
    ```

    This script runs the following commands:

    1. Sets up certificate services, if missing
    1. Creates root and intermediate CAs for x509 authentication
    1. Creates the trust bundle ConfigMap for the Broker to authentication x509 clients
    1. Configures `BrokerListener` and `BrokerAuthentication` resources for SAT and x509 auth

## Testing the installation

To test the setup, use `mosquitto_pub` to connect to the MQTT broker and validate the x509 certs, SAT, and trust bundle.

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

## Run a sample

This sample demonstrates a simple communication between a client and a server using [Telemetry](https://github.com/Azure/iot-operations-sdks/blob/main/doc/components.md#telemetry-sender) and [remote procedure call (RPC)](https://github.com/Azure/iot-operations-sdks/blob/main/doc/components.md#command-invoker). The server tracks the value of a counter and accepts RPC requests from the client to either read or increment that counter.

The sample uses the v2 protocol compiler with WoT Thing model files, see the [TestThing](https://github.com/Azure/iot-operations-sdks/tree/main/dotnet/samples/Protocol/TestThing) folder.

1. Install the [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0).

1. The samples within [Azure IoT Operations SDKs GitHub repository](https://github.com/Azure/iot-operations-sdks) read configuration from environment variables. The repository root provides an `.env` file that exports the variables used by the samples to connect to the MQTT broker. Edit the `.env` file to set the values for your environment, or use the default values provided in the file.

1. Navigate to the `CounterServer` sample directory:

    ```bash
    cd <REPOSITORY ROOT>/dotnet/samples/Protocol/RPC/CounterServer/
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
    cd <REPOSITORY ROOT>/dotnet/samples/Protocol/RPC/CounterClient/
    ```

1. Build the sample:

    ```bash
    dotnet build
    ```

1. Run the sample:

    ```bash
    source `git rev-parse --show-toplevel`/.env; export AIO_MQTT_CLIENT_ID=counter-client; export COUNTER_SERVER_ID=counter-server; dotnet run
    ```

1. You see the client and server communicating, with the client sending requests to read and increment the counter value, and the server sending telemetry. For details, see [Examine client and server output](#examine-client-and-server-output).

1. The `CounterClient` sample automatically exits when it completes. You can also stop the `CounterServer` sample by pressing `Ctrl+C` in its terminal.

### Examine client and server output

This section shows examples of the output for the client and the server. The client makes calls to read and increment the counter value, and the server responds. The server also outputs telemetry, so the client can track the counter value. In these examples, messages are grouped logically, but in your output the order of messages will vary depending on the timing of the client and server. These examples show output for MQTT messages, but you can suppress this output by setting the `mqttDiag` environment variable to `false` in the `appsettings.json` files for the client and the server.

#### Read counter

The following example shows the output messages for read counter. Requests and responses across the client and server are matched by correlation ID, which, in this example, is `5b282690-8c59-4bf2-9926-9236582ce4b3`.

Client output:

```output
# Subscribe once on startup.
CounterClient Information: 0 : >> [2026-07-29T17:35:53.4663363Z] [11]: TX (51 bytes) >>> Subscribe: [PacketIdentifier=2] [TopicFilters=clients/+/rpc/command-samples/+/readCounter@AtLeastOnce]
CounterClient Information: 0 : >> [2026-07-29T17:35:53.4689212Z] [6]: RX (6 bytes) <<< SubAck: [PacketIdentifier=2] [ReasonCode=GrantedQoS1]
CounterClient Information: 0 : Subscribed to topic filter 'clients/+/rpc/command-samples/+/readCounter' for command invoker 'readCounter'

# Invoke readCounter once on startup and once at end -- only one shown.
info: CounterClient.RpcCommandRunner[0] Calling ReadCounter with 5b282690-8c59-4bf2-9926-9236582ce4b3
CounterClient Information: 0 : >> [2026-07-29T17:35:53.4777793Z] [11]: TX (335 bytes) >>> Publish: [Topic=rpc/command-samples/counter-server/readCounter] [PayloadLength=0] [QoSLevel=AtLeastOnce] [Dup=False] [Retain=False] [PacketIdentifier=3]
CounterClient Information: 0 : >> [2026-07-29T17:35:53.4818287Z] [10]: RX (4 bytes) <<< PubAck: [PacketIdentifier=3] [ReasonCode=Success]
CounterClient Information: 0 : Invoked command 'readCounter' with correlation ID 5b282690-8c59-4bf2-9926-9236582ce4b3 to topic 'rpc/command-samples/counter-server/readCounter'
CounterClient Information: 0 : >> [2026-07-29T17:35:53.5861515Z] [10]: RX (260 bytes) <<< Publish: [Topic=clients/counter-client/rpc/command-samples/counter-server/readCounter] [PayloadLength=21] [QoSLevel=AtLeastOnce] [Dup=False] [Retain=False] [PacketIdentifier=1]
info: CounterClient.RpcCommandRunner[0] called read 0 with id 5b282690-8c59-4bf2-9926-9236582ce4b3
CounterClient Information: 0 : >> [2026-07-29T17:35:53.6572000Z] [10]: TX (4 bytes) >>> PubAck: [PacketIdentifier=1] [ReasonCode=Success]
```

Server output:

```output
# Subscribe to readCounter topic on startup.
CounterServer Information: 0 : >> [2026-07-29T17:35:12.3456281Z] [7]: TX (54 bytes) >>> Subscribe: [PacketIdentifier=1] [TopicFilters=rpc/command-samples/counter-server/readCounter@AtLeastOnce]
CounterServer Information: 0 : >> [2026-07-29T17:35:12.3553742Z] [11]: RX (6 bytes) <<< SubAck: [PacketIdentifier=1] [ReasonCode=GrantedQoS1]
CounterServer Information: 0 : Command executor for 'readCounter' started.

# Multiple (2) invocations occur - only one shown.
CounterServer Information: 0 : >> [2026-07-29T17:35:53.4842146Z] [11]: RX (334 bytes) <<< Publish: [Topic=rpc/command-samples/counter-server/readCounter] [PayloadLength=0] [QoSLevel=AtLeastOnce] [Dup=False] [Retain=False] [PacketIdentifier=1]
<6>17:35:53CounterServer.CounterService[0] --> Executing Counter.ReadCounter with id 5b282690-8c59-4bf2-9926-9236582ce4b3 for counter-client
<6>17:35:53CounterServer.CounterService[0] --> Executed Counter.ReadCounter with id 5b282690-8c59-4bf2-9926-9236582ce4b3 for counter-client
CounterServer Information: 0 : >> [2026-07-29T17:35:53.5815820Z] [7]: TX (261 bytes) >>> Publish: [Topic=clients/counter-client/rpc/command-samples/counter-server/readCounter] [PayloadLength=21] [QoSLevel=AtLeastOnce] [Dup=False] [Retain=False] [PacketIdentifier=4]
CounterServer Information: 0 : >> [2026-07-29T17:35:53.5854665Z] [11]: RX (4 bytes) <<< PubAck: [PacketIdentifier=4] [ReasonCode=Success]
CounterServer Information: 0 : >> [2026-07-29T17:35:53.5881430Z] [12]: TX (4 bytes) >>> PubAck: [PacketIdentifier=1] [ReasonCode=Success]
```

#### Increment counter

The following example shows the output messages for increment counter. Requests and responses are matched across the client and server by correlation ID, which, in this example, is `5a4da7c4-3922-4049-8065-77f344c3478f`.

Client output:

```output
# Invoke increment multiple times -- only one shown.
info: CounterClient.RpcCommandRunner[0] calling counter.incr  with id 5a4da7c4-3922-4049-8065-77f344c3478f
CounterClient Information: 0 : >> [2026-07-29T17:35:53.6375578Z] [11]: TX (49 bytes) >>> Subscribe: [PacketIdentifier=4] [TopicFilters=clients/+/rpc/command-samples/+/increment@AtLeastOnce]
CounterClient Information: 0 : >> [2026-07-29T17:35:53.6399406Z] [10]: RX (6 bytes) <<< SubAck: [PacketIdentifier=4] [ReasonCode=GrantedQoS1]
CounterClient Information: 0 : Subscribed to topic filter 'clients/+/rpc/command-samples/+/increment' for command invoker 'increment'
CounterClient Information: 0 : >> [2026-07-29T17:35:53.6461370Z] [11]: TX (372 bytes) >>> Publish: [Topic=rpc/command-samples/counter-server/increment] [PayloadLength=20] [QoSLevel=AtLeastOnce] [Dup=False] [Retain=False] [PacketIdentifier=21]
CounterClient Information: 0 : >> [2026-07-29T17:35:53.6552803Z] [10]: RX (4 bytes) <<< PubAck: [PacketIdentifier=21] [ReasonCode=Success]
CounterClient Information: 0 : Invoked command 'increment' with correlation ID 5a4da7c4-3922-4049-8065-77f344c3478f to topic 'rpc/command-samples/counter-server/increment'
CounterClient Information: 0 : >> [2026-07-29T17:35:53.6960747Z] [13]: RX (259 bytes) <<< Publish: [Topic=clients/counter-client/rpc/command-samples/counter-server/increment] [PayloadLength=22] [QoSLevel=AtLeastOnce] [Dup=False] [Retain=False] [PacketIdentifier=12]
info: CounterClient.RpcCommandRunner[0] called counter.incr 10 with id 5a4da7c4-3922-4049-8065-77f344c3478f
CounterClient Information: 0 : >> [2026-07-29T17:35:53.7138884Z] [10]: TX (4 bytes) >>> PubAck: [PacketIdentifier=12] [ReasonCode=Success]
```

Server output:

```output
# Subscribe to increment once on startup.
CounterServer Information: 0 : >> [2026-07-29T17:35:12.3548320Z] [7]: TX (52 bytes) >>> Subscribe: [PacketIdentifier=2] [TopicFilters=rpc/command-samples/counter-server/increment@AtLeastOnce]
CounterServer Information: 0 : >> [2026-07-29T17:35:12.3613847Z] [11]: RX (6 bytes) <<< SubAck: [PacketIdentifier=2] [ReasonCode=GrantedQoS1]
CounterServer Information: 0 : Command executor for 'increment' started.

# Multiple invocations are received -- only one shown.
CounterServer Information: 0 : >> [2026-07-29T17:35:53.6502886Z] [13]: RX (371 bytes) <<< Publish: [Topic=rpc/command-samples/counter-server/increment] [PayloadLength=20] [QoSLevel=AtLeastOnce] [Dup=False] [Retain=False] [PacketIdentifier=2]
<6>17:35:53CounterServer.CounterService[0] --> Executing Counter.Increment with id 5a4da7c4-3922-4049-8065-77f344c3478f for counter-client
<6>17:35:53CounterServer.CounterService[0] --> Executed Counter.Increment with id 5a4da7c4-3922-4049-8065-77f344c3478f for counter-client
CounterServer Information: 0 : >> [2026-07-29T17:35:53.6924040Z] [7]: TX (260 bytes) >>> Publish: [Topic=clients/counter-client/rpc/command-samples/counter-server/increment] [PayloadLength=22] [QoSLevel=AtLeastOnce] [Dup=False] [Retain=False] [PacketIdentifier=15]
CounterServer Information: 0 : >> [2026-07-29T17:35:53.6983722Z] [18]: RX (4 bytes) <<< PubAck: [PacketIdentifier=15] [ReasonCode=Success]
CounterServer Information: 0 : >> [2026-07-29T17:35:53.6992783Z] [12]: TX (4 bytes) >>> PubAck: [PacketIdentifier=2] [ReasonCode=Success]
```

#### CounterValue telemetry

The following example shows the output messages for CounterValue telemetry. Server output is shown first because it sends the telemetry.

Server output:

```output
# Telemetry data is published multiple times. 
CounterServer Information: 0 : >> [2026-07-29T17:35:53.6805980Z] [7]: TX (203 bytes) >>> Publish: [Topic=telemetry/telemetry-samples/counterValue] [PayloadLength=18] [QoSLevel=AtLeastOnce] [Dup=False] [Retain=False] [PacketIdentifier=5]
CounterServer Information: 0 : >> [2026-07-29T17:35:53.6843445Z] [11]: RX (4 bytes) <<< PubAck: [PacketIdentifier=5] [ReasonCode=Success]
CounterServer Information: 0 : Telemetry sent successfully to the topic 'telemetry/telemetry-samples/counterValue'
```

Client output:

```output
# Subscribe performed once on startup.
CounterClient Information: 0 : >> [2026-07-29T17:35:53.4283758Z] [11]: TX (48 bytes) >>> Subscribe: [PacketIdentifier=1] [TopicFilters=telemetry/telemetry-samples/counterValue@AtLeastOnce]
CounterClient Information: 0 : >> [2026-07-29T17:35:53.4355484Z] [10]: RX (6 bytes) <<< SubAck: [PacketIdentifier=1] [ReasonCode=GrantedQoS1]
CounterClient Information: 0 : Telemetry receiver subscribed for topic telemetry/telemetry-samples/counterValue.

# Multiple telemetry values received - only one shown.
CounterClient Information: 0 : >> [2026-07-29T17:35:53.6820692Z] [6]: RX (202 bytes) <<< Publish: [Topic=telemetry/telemetry-samples/counterValue] [PayloadLength=18] [QoSLevel=AtLeastOnce] [Dup=False] [Retain=False] [PacketIdentifier=2]
CounterClient Information: 0 : Telemetry received from telemetry/telemetry-samples/counterValue
info: CounterClient.CounterClient[0] Telemetry received from counter-server: CounterValue=4
CounterClient Information: 0 : >> [2026-07-29T17:35:53.7131604Z] [10]: TX (4 bytes) >>> PubAck: [PacketIdentifier=2] [ReasonCode=Success]
```

## Configuration summary

### MQTT broker configuration

 After you install the software, the cluster contains the following MQTT broker definitions:

| Component Type | Name | Description |
|-|-|-|
| `Broker` | default | The MQTT broker |
| `BrokerListener` | default | Provides **cluster access** to the MQTT broker |
| `BrokerListener` | default-external | Provides **off-cluster access** to the MQTT broker |
| `BrokerAuthentication` | default | SAT authentication definition |
| `BrokerAuthentication` | default-x509 | An x509 authentication definition |

### MQTT broker access

You can access the MQTT broker both on-cluster and off-cluster by using the connection information described in the following table. For information on which environment variables to use when configuring your application, see [Connection Settings](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/connection-settings.md).

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

As part of the deployment script, the local environment creates the following files to facilitate connection and authentication to the MQTT broker. You can find these files in the `.session` directory at the repository root.

| File | Description |
|-|-|
| `broker-ca.crt` | The MQTT broker trust bundle required to validate the MQTT broker on ports `8883` and `8884` |
| `token.txt` | A service authentication token (SAT) for authenticating with the MQTT broker on `8884` |
| `client.crt` | An x509 client certificate for authenticating with the MQTT broker on port `8883` |
| `client.key` | An x509 client private key for authenticating with the MQTT broker on port `8883` |


## Troubleshooting

Check the troubleshooting guide for common issues in the [Azure IoT Operations SDKs GitHub repository](https://github.com/Azure/iot-operations-sdks/blob/main/doc/troubleshooting.md).

## Next steps
In this quickstart, you set up the Azure IoT Operations SDKs and ran a sample application. To learn more about developing with the SDKs, check out the following resources:

- [Azure IoT Operations SDKs documentation](https://github.com/Azure/iot-operations-sdks/blob/main/doc)
