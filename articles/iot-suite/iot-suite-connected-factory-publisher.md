---
title: Use the Azure IoT Suite connected factory OPC publisher | Microsoft Docs
description: How to build and deploy the connected factory OPC publisher reference implementation.
services: ''
suite: iot-suite
documentationcenter: na
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/16/2017
ms.author: dobett

---

# OPC Publisher for Azure IoT Edge

This article describes how to use the OPC Publisher reference implementation. The reference implementation demonstrates how to use Azure IoT Edge to:

- Connect to existing OPC UA servers.
- Publish JSON encoded telemetry data from these servers in OPC UA *Pub/Sub* format, using a JSON payload, to Azure IoT Hub. You can use any of the transport protocols that Azure IoT Edge supports.

This reference application includes:

- An OPC UA *client* for connecting to existing OPC UA servers on your network.
- An OPC UA *server* listening on port 62222 that you can use to manage what is published.

The application is implemented using .NET Core and can run on the platforms supported by .NET Core.

The publisher implements retry logic when it establishes connections to endpoints. The publisher expects endpoints to respond within a specified number of keep alive requests. This retry logic enables the publisher to detect conditions such as a power outage for an OPC UA server.

For each distinct publishing interval to an OPC UA server, it creates a separate subscription over which all nodes with this publishing interval are updated.

To reduce network load, the publisher supports batching of data sent to IoT Hub. A batch is sent to IoT Hub only when the configured package size is reached.

This application uses the OPC Foundations's OPC UA reference stack and therefore licensing restrictions apply. Visit http://opcfoundation.github.io/UA-.NETStandardLibrary/ for OPC UA documentation and licensing terms.

You can find the OPC Publisher source code in the [OPC Publisher for Azure IoT Edge](https://github.com/Azure/iot-edge-opc-publisher) GitHub repository.

## Prerequisites

To build the application, you need the [.NET Core SDK 1.1.](https://docs.microsoft.com/dotnet/core/sdk) for your operating system.

## Build the application

### As native Windows application

Open the `OpcPublisher.sln` project with Visual Studio 2017 and build the solution by hitting F7.

### As Docker container

To build the application as a Windows Docker container, use the `Dockerfile.Windows` configuration file.

To build the application as a Linux Docker container, use the `Dockerfile` configuration file.

From the root of the repository on your development machine, type the following command in a console window:

`docker build -f <docker-configfile-to-use> -t <your-container-name> .`

The `-f` option for `docker build` is optional and the default is to use the `Dockerfile` configuration file.

Docker also enables you to build directly from a git repository. You can build a Linux Docker container with the following command:

`docker build -t <your-container-name> .https://github.com/Azure/iot-edge-opc-publisher`

## Configure the OPC UA nodes to publish

To configure which OPC UA nodes should have their values published to Azure IoT Hub, create a JSON formatted configuration file. The default name for this configuration file is `publishednodes.json`. The application updates and saves this configuration file when it uses the OPC UA server methods **PublishNode** or **UnpublishNode**.

The syntax of the configuration file is as follows:

```json
[
    {
        // example for an EnpointUrl is: opc.tcp://win10iot:51210/UA/SampleServer
        "EndpointUrl": "opc.tcp://<your_opcua_server>:<your_opcua_server_port>/<your_opcua_server_path>",
        "OpcNodes": [
            // Publisher will request the server at EndpointUrl to sample the node with the OPC sampling interval specified on command line (or the default value: OPC publishing interval)
            // and the subscription will publish the node value with the OPC publishing interval specified on command line (or the default value: server revised publishing interval).
            {
                // The identifier specifies the NamespaceUri and the node identifier in XML notation as specified in Part 6 of the OPC UA specification in the XML Mapping section.
                "ExpandedNodeId": "nsu=http://opcfoundation.org/UA/;i=2258"
            },
            // Publisher will request the server at EndpointUrl to sample the node with the OPC sampling interval specified on command line (or the default value: OPC publishing interval)
            // and the subscription will publish the node value with an OPC publishing interval of 4 seconds.
            // Publisher will use for each dinstinct publishing interval (of nodes on the same EndpointUrl) a separate subscription. All nodes without a publishing interval setting,
            // will be on the same subscription and the OPC UA stack will publish with the lowest sampling interval of a node.
            {
                "ExpandedNodeId": "nsu=http://opcfoundation.org/UA/;i=2258",
                "OpcPublishingInterval": 4000
            },
            // Publisher will request the server at EndpointUrl to sample the node with the given sampling interval of 1 second
            // and the subscription will publish the node value with the OPC publishing interval specified on command line (or the default value: server revised interval).
            // If the OPC publishing interval is set to a lower value, Publisher will adjust the OPC publishing interval of the subscription to the OPC sampling interval value.
            {
                "ExpandedNodeId": "nsu=http://opcfoundation.org/UA/;i=2258",
                // the OPC sampling interval to use for this node.
                "OpcSamplingInterval": 1000
            }
        ]
    },

    // the format below is only supported for backward compatibility. you need to ensure that the
    // OPC UA server on the configured EndpointUrl has the namespaceindex you expect with your configuration.
    // please use the ExpandedNodeId syntax instead.
    {
        "EndpointUrl": "opc.tcp://<your_opcua_server>:<your_opcua_server_port>/<your_opcua_server_path>",
        "NodeId": {
            "Identifier": "ns=0;i=2258"
        }
    }
    // please consult the OPC UA specification for details on how OPC monitored node sampling interval and OPC subscription publishing interval settings are handled by the OPC UA stack.
    // the publishing interval of the data to Azure IoT Hub is controlled by the command line settings (or the default: publish data to IoT Hub at least each 1 second).
]
```

## Run the application

### Command-line options

To see the complete usage of the application, use the `--help` command-line option. The following example shows the structure of a command:

```cmd/sh
OpcPublisher.exe <applicationname> [<IoT Hubconnectionstring>] [<options>]
```

`applicationname` is the OPC UA application name to use. This parameter is required. The application name is also used to register the publisher in the IoT Hub device registry.

`IoT Hubconnectionstring` is the IoT Hub owner connection string. This parameter is optional.

The following options are supported:

```cmd/sh
--pf, --publishfile=VALUE
  the filename to configure the nodes to publish.
    Default: './publishednodes.json'
--sd, --shopfloordomain=VALUE
  the domain of the shopfloor. if specified this
    domain is appended (delimited by a ':' to the '
    ApplicationURI' property when telemetry is
    sent to IoT Hub.
    The value must follow the syntactical rules of a
    DNS hostname.
    Default: not set
--sw, --sessionconnectwait=VALUE
  specify the wait time in seconds publisher is
    trying to connect to disconnected endpoints and
    starts monitoring unmonitored items
    Min: 10
    Default: 10
--vc, --verboseconsole=VALUE
  the output of publisher is shown on the console.
    Default: False
--ih, --IoT Hubprotocol=VALUE
  the protocol to use for communication with Azure
    IoT Hub (allowed values: Amqp, Http1, Amqp_
    WebSocket_Only, Amqp_Tcp_Only, Mqtt, Mqtt_
    WebSocket_Only, Mqtt_Tcp_Only).
    Default: Mqtt
--ms, --IoT Hubmessagesize=VALUE
  the max size of a message which can be send to
    IoT Hub. when telemetry of this size is available
    it will be sent.
    0 will enforce immediate send when telemetry is
    available
    Min: 0
    Max: 256 * 1024
    Default: 4096
--si, --IoT Hubsendinterval=VALUE
  the interval in seconds when telemetry should be
    send to IoT Hub. If 0, then only the
    IoT Hubmessagesize parameter controls when
    telemetry is sent.
    Default: '1'
--lf, --logfile=VALUE
  the filename of the logfile to use.
    Default: './Logs/<applicationname>.log.txt'
--pn, --portnum=VALUE
  the server port of the publisher OPC server
    endpoint.
    Default: 62222
--pa, --path=VALUE
  the endpoint URL path part of the publisher OPC
    server endpoint.
    Default: '/UA/Publisher'
--lr, --ldsreginterval=VALUE
  the LDS(-ME) registration interval in ms. If 0,
    then the registration is disabled.
    Default: 0
--ot, --operationtimeout=VALUE
  the operation timeout of the publisher OPC UA
    client in ms.
    Default: 120000
--oi, --opcsamplinginterval=VALUE
  the publisher is using this as default value in
    milliseconds to request the servers to sample
    the nodes with this interval
    this value might be revised by the OPC UA
    servers to a supported sampling interval.
    please check the OPC UA specification for
    details how this is handled by the OPC UA stack.
    a negative value will set the sampling interval
    to the publishing interval of the subscription
    this node is on.
    0 will configure the OPC UA server to sample in
    the highest possible resolution and should be
    taken with care.
    Default: 1000
--op, --opcpublishinginterval=VALUE
  the publisher is using this as default value in
    milliseconds for the publishing interval setting
    of the subscriptions established to the OPC UA
    servers.
    please check the OPC UA specification for
    details how this is handled by the OPC UA stack.
    a value less than or equal zero will let the
    server revise the publishing interval.
    Default: 0
--ct, --createsessiontimeout=VALUE
  specify the timeout in seconds used when creating
    a session to an endpoint. On unsuccessful
    connection attemps a backoff up to 5 times the
    specified timeout value is used.
    Min: 1
    Default: 10
--ki, --keepaliveinterval=VALUE
  specify the interval in seconds the publisher is
    sending keep alive messages to the OPC servers
    on the endpoints it is connected to.
    Min: 2
    Default: 2
--kt, --keepalivethreshold=VALUE
  specify the number of keep alive packets a server
    can miss, before the session is disconneced
    Min: 1
    Default: 5
--st, --opcstacktracemask=VALUE
  the trace mask for the OPC stack. See github OPC .
    NET stack for definitions.
    To enable IoT Hub telemetry tracing set it to 711.
    Default: 285  (645)
--as, --autotrustservercerts=VALUE
  the publisher trusts all servers it is
    establishing a connection to.
    Default: False
--tm, --trustmyself=VALUE
  the publisher certificate is put into the trusted
    certificate store automatically.
    Default: True
--fd, --fetchdisplayname=VALUE
  enable to read the display name of a published
    node from the server. this will increase the
    runtime.
    Default: False
--at, --appcertstoretype=VALUE
  the own application cert store type.
    (allowed values: Directory, X509Store)
    Default: 'X509Store'
--ap, --appcertstorepath=VALUE
  the path where the own application cert should be
    stored
    Default (depends on store type):
    X509Store: 'CurrentUser\UA_MachineDefault'
    Directory: 'CertificateStores/own'
--tt, --trustedcertstoretype=VALUE
  the trusted cert store type.
    (allowed values: Directory, X509Store)
    Default: Directory
--tp, --trustedcertstorepath=VALUE
  the path of the trusted cert store
    Default (depends on store type):
    X509Store: 'CurrentUser\UA_MachineDefault'
    Directory: 'CertificateStores/trusted'
--rt, --rejectedcertstoretype=VALUE
  the rejected cert store type.
    (allowed values: Directory, X509Store)
    Default: Directory
--rp, --rejectedcertstorepath=VALUE
  the path of the rejected cert store
    Default (depends on store type):
    X509Store: 'CurrentUser\UA_MachineDefault'
    Directory: 'CertificateStores/rejected'
--it, --issuercertstoretype=VALUE
  the trusted issuer cert store type.
    (allowed values: Directory, X509Store)
    Default: Directory
--ip, --issuercertstorepath=VALUE
  the path of the trusted issuer cert store
    Default (depends on store type):
    X509Store: 'CurrentUser\UA_MachineDefault'
    Directory: 'CertificateStores/issuers'
--dt, --devicecertstoretype=VALUE
  the IoT Hub device cert store type.
    (allowed values: Directory, X509Store)
    Default: X509Store
--dp, --devicecertstorepath=VALUE
  the path of the iot device cert store
    Default Default (depends on store type):
    X509Store: 'My'
    Directory: 'CertificateStores/IoT Hub'
-h, --help
  show this message and exit
```

You can use the following environment variables to control the application:
- `_HUB_CS`: sets the IoT Hub owner connection string
- `_GW_LOGP`: sets the filename of the log file to use
- `_TPC_SP`: sets the path to store certificates of trusted stations
- `_GW_PNFP`: sets the filename of the publishing configuration file

Command-line arguments overrule environment variable settings.

Typically, you specify the IoT Hub owner connection string only on the first start of the application. The connection string is encrypted and stored in the platform's certificate store.

On subsequent calls, the connection string is read from platform's certificate store and reused. If you specify the connection string on each start, the device in the IoT Hub device registry is removed and recreated each time.

### Native on Windows

To run the application natively on Windows, open the `OpcPublisher.sln` project with Visual Studio 2017, build the solution, and publish it. You can start the application in the **Target directory** you have published to with:

```cmd
dotnet OpcPublisher.dll <applicationname> [<IoT Hubconnectionstring>] [options]
```

### Use a self-built container

To run the application in a self-built container, build and then start your own container:

```cmd/sh
docker run <your-container-name> <applicationname> [<IoT Hubconnectionstring>] [options]
```

### Use a container from hub.docker.com

There is a prebuilt container available on DockerHub. To start it, run the following command:

```cmd/sh
docker run microsoft/iot-edge-opc-publisher <applicationname> [<IoT Hubconnectionstring>] [options]
```

### Important when using a container

#### Access to the Publisher OPC UA server

The Publisher OPC UA server by default listens on port 62222. To expose this inbound port in a container, you need to use the `docker run` option `-p`:

```cmd/sh
docker run -p 62222:62222 microsoft/iot-edge-opc-publisher <applicationname> [<IoT Hubconnectionstring>] [options]
```

#### Enable intercontainer name resolution

To enable name resolution from within the container to other containers, you must:

- Create a user-defined docker bridge network.
- Connect the container to the network using the `--network`option.
- Assign the container a name using the `--name` option.

The following example shows these configuration options:

```cmd/sh
docker network create -d bridge iot_edge
docker run --network iot_edge --name publisher microsoft/iot-edge-opc-publisher <applicationname> [<IoT Hubconnectionstring>] [options]
```

The container can now be reached by other containers over the network using the name `publisher`.

#### Assign a hostname

Publisher uses the hostname of the machine it is running on for certificate and endpoint generation. Docker chooses a random hostname unless you set one with the `-h` option. Here an example to set the internal hostname of the container to `publisher`:

```cmd/sh
docker run -h publisher microsoft/iot-edge-opc-publisher <applicationname> [<IoT Hubconnectionstring>] [options]
```

#### Using bind mounts (shared filesystem)

In some scenarios, you want to read configuration information from, or write log files to, locations on the host instead of using the container file system. To configure this behavior, use the `-v` option of `docker run` in the bind mount mode. For example:

```cmd/sh
-v //D/docker:/build/out/Logs
-v //D/docker:/build/out/CertificateStores
-v //D/docker:/shared
-v //D/docker:/root/.dotnet/corefx/cryptography/x509stores
```

#### Store for X509 certificates

Storing X509 certificates does not work with bind mounts, because the permissions of the path to the store need to be `rw` for the owner. Instead you need to use the `-v` option of `docker run` in the volume mode.

## Debug the application

### Native on Windows

Open the `OpcPublisher.sln` project with Visual Studio 2017 and start debugging the app by hitting F5.

### In a docker container

Visual Studio 2017 supports debugging applications in a Docker container by using `docker-compose`. However, this method does not allow you to pass command-line parameters.

An alternative debugging option that VS2017 supports is to debug over `ssh`. You can use the docker build configuration file `Dockerfile.ssh` in the root of the repository to create an SSH enabled container:

```cmd/sh
docker build -f .\Dockerfile.ssh -t publisherssh .
```

You can now start the container to debug the publisher:

```cmd/sh
docker run -it publisherssh
```

In the container, you must start the **ssh** daemon manually:

```cmd/sh
service ssh start
```

At this point, you can create an **ssh** session as user `root` with password `Passw0rd`.

To prepare to debug the application in the container, complete the following additional steps:

1. On the host-side, create a `launch.json` file:

    ```json
    {
      "version": "0.2.0",
      "adapter": "<path>\\plink.exe",
      "adapterArgs": "root@localhost -pw Passw0rd -batch -T ~/vsdbg/vsdbg --interpreter=vscode",
      "languageMappings": {
        "C#": {
          "languageId": "3F5162F8-07C6-11D3-9053-00C04FA302A1",
          "extensions": [ "*" ]
        }
      },
      "exceptionCategoryMappings": {
        "CLR": "449EC4CC-30D2-4032-9256-EE18EB41B62B",
        "MDA": "6ECE07A9-0EDE-45C4-8296-818D8FC401D4"
      },
      "configurations": [
        {
          "name": ".NET Core Launch",
          "type": "coreclr",
          "cwd": "~/publisher",
          "program": "Opc.Ua.Publisher.dll",
          "args": "<put-the-publisher-command-line-options-here>",

          "request": "launch"
        }
      ]
    }
    ```

1. Build your project and publish it to a directory of your choice.

1. Use a tool such as `WinSCP` to copy the published files into the directory `/root/publisher` in the container. If you choose to use a different directory, update the `cdw` property in the `launch.json` file.

Now you can start debugging using the following command in Visual Studio's Command Window:

```cmd
DebugAdapterHost.Launch /LaunchJson:"<path-to-the-launch.json-file-you-saved>"
```

## Next steps

A suggested next step is to learn how to [Deploy a gateway on Windows or Linux for the connected factory preconfigured solution](iot-suite-connected-factory-gateway-deployment.md).