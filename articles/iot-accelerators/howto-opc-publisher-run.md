---
title: Run OPC Publisher - Azure | Microsoft Docs
description: This article describes how to run and debug OPC Publisher. It also addresses performance and memory considerations.
author: dominicbetts
ms.author: dobett
ms.date: 06/10/2019
ms.topic: overview
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# Run OPC Publisher

This article describes how to run ad debug OPC Publisher. It also addresses performance and memory considerations.

## Command-line options

Application usage is shown using the `--help` command-line option as follows:

```sh/cmd
Current directory is: /appdata
Log file is: <hostname>-publisher.log
Log level is: info

OPC Publisher V2.3.0
Informational version: V2.3.0+Branch.develop_hans_methodlog.Sha.0985e54f01a0b0d7f143b1248936022ea5d749f9

Usage: opcpublisher.exe <applicationname> [<IoT Hubconnectionstring>] [<options>]

OPC Edge Publisher to subscribe to configured OPC UA servers and send telemetry to Azure IoT Hub.
To exit the application, just press CTRL-C while it is running.

applicationname: the OPC UA application name to use, required
                  The application name is also used to register the publisher under this name in the
                  IoT Hub device registry.

IoT Hubconnectionstring: the IoT Hub owner connectionstring, optional

There are a couple of environment variables which can be used to control the application:
_HUB_CS: sets the IoT Hub owner connectionstring
_GW_LOGP: sets the filename of the log file to use
_TPC_SP: sets the path to store certificates of trusted stations
_GW_PNFP: sets the filename of the publishing configuration file

Command line arguments overrule environment variable settings.

Options:
      --pf, --publishfile=VALUE
                              the filename to configure the nodes to publish.
                                Default: '/appdata/publishednodes.json'
      --tc, --telemetryconfigfile=VALUE
                              the filename to configure the ingested telemetry
                                Default: ''
  -s, --site=VALUE           the site OPC Publisher is working in. if specified
                                this domain is appended (delimited by a ':' to
                                the 'ApplicationURI' property when telemetry is
                                sent to IoT Hub.
                                The value must follow the syntactical rules of a
                                DNS hostname.
                                Default: not set
      --ic, --iotcentral     publisher will send OPC UA data in IoTCentral
                                compatible format (DisplayName of a node is used
                                as key, this key is the Field name in IoTCentral)
                                . you need to ensure that all DisplayName's are
                                unique. (Auto enables fetch display name)
                                Default: False
      --sw, --sessionconnectwait=VALUE
                              specify the wait time in seconds publisher is
                                trying to connect to disconnected endpoints and
                                starts monitoring unmonitored items
                                Min: 10
                                Default: 10
      --mq, --monitoreditemqueuecapacity=VALUE
                              specify how many notifications of monitored items
                                can be stored in the internal queue, if the data
                                can not be sent quick enough to IoT Hub
                                Min: 1024
                                Default: 8192
      --di, --diagnosticsinterval=VALUE
                              shows publisher diagnostic info at the specified
                                interval in seconds (need log level info).
                                -1 disables remote diagnostic log and diagnostic
                                output
                                0 disables diagnostic output
                                Default: 0
      --ns, --noshutdown=VALUE
                              same as runforever.
                                Default: False
      --rf, --runforever     publisher can not be stopped by pressing a key on
                                the console, but will run forever.
                                Default: False
      --lf, --logfile=VALUE  the filename of the logfile to use.
                                Default: './<hostname>-publisher.log'
      --lt, --logflushtimespan=VALUE
                              the timespan in seconds when the logfile should be
                                flushed.
                                Default: 00:00:30 sec
      --ll, --loglevel=VALUE the loglevel to use (allowed: fatal, error, warn,
                                info, debug, verbose).
                                Default: info
        --ih, --IoT Hubprotocol=VALUE
                              the protocol to use for communication with IoT Hub (
                                allowed values: Amqp, Http1, Amqp_WebSocket_Only,
                                  Amqp_Tcp_Only, Mqtt, Mqtt_WebSocket_Only, Mqtt_
                                Tcp_Only) or IoT EdgeHub (allowed values: Mqtt_
                                Tcp_Only, Amqp_Tcp_Only).
                                Default for IoT Hub: Mqtt_WebSocket_Only
                                Default for IoT EdgeHub: Amqp_Tcp_Only
      --ms, --IoT Hubmessagesize=VALUE
                              the max size of a message which can be send to
                                IoT Hub. when telemetry of this size is available
                                it will be sent.
                                0 will enforce immediate send when telemetry is
                                available
                                Min: 0
                                Max: 262144
                                Default: 262144
      --si, --IoT Hubsendinterval=VALUE
                              the interval in seconds when telemetry should be
                                send to IoT Hub. If 0, then only the
                                IoT Hubmessagesize parameter controls when
                                telemetry is sent.
                                Default: '10'
      --dc, --deviceconnectionstring=VALUE
                              if publisher is not able to register itself with
                                IoT Hub, you can create a device with name <
                                applicationname> manually and pass in the
                                connectionstring of this device.
                                Default: none
  -c, --connectionstring=VALUE
                              the IoT Hub owner connectionstring.
                                Default: none
      --hb, --heartbeatinterval=VALUE
                              the publisher is using this as default value in
                                seconds for the heartbeat interval setting of
                                nodes without
                                a heartbeat interval setting.
                                Default: 0
      --sf, --skipfirstevent=VALUE
                              the publisher is using this as default value for
                                the skip first event setting of nodes without
                                a skip first event setting.
                                Default: False
      --pn, --portnum=VALUE  the server port of the publisher OPC server
                                endpoint.
                                Default: 62222
      --pa, --path=VALUE     the enpoint URL path part of the publisher OPC
                                server endpoint.
                                Default: '/UA/Publisher'
      --lr, --ldsreginterval=VALUE
                              the LDS(-ME) registration interval in ms. If 0,
                                then the registration is disabled.
                                Default: 0
      --ol, --opcmaxstringlen=VALUE
                              the max length of a string opc can transmit/
                                receive.
                                Default: 131072
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
      --aa, --autoaccept     the publisher trusts all servers it is
                                establishing a connection to.
                                Default: False
      --tm, --trustmyself=VALUE
                              same as trustowncert.
                                Default: False
      --to, --trustowncert   the publisher certificate is put into the trusted
                                certificate store automatically.
                                Default: False
      --fd, --fetchdisplayname=VALUE
                              same as fetchname.
                                Default: False
      --fn, --fetchname      enable to read the display name of a published
                                node from the server. this will increase the
                                runtime.
                                Default: False
      --ss, --suppressedopcstatuscodes=VALUE
                              specifies the OPC UA status codes for which no
                                events should be generated.
                                Default: BadNoCommunication,
                                BadWaitingForInitialData
      --at, --appcertstoretype=VALUE
                              the own application cert store type.
                                (allowed values: Directory, X509Store)
                                Default: 'Directory'
      --ap, --appcertstorepath=VALUE
                              the path where the own application cert should be
                                stored
                                Default (depends on store type):
                                X509Store: 'CurrentUser\UA_MachineDefault'
                                Directory: 'pki/own'
      --tp, --trustedcertstorepath=VALUE
                              the path of the trusted cert store
                                Default: 'pki/trusted'
      --rp, --rejectedcertstorepath=VALUE
                              the path of the rejected cert store
                                Default 'pki/rejected'
      --ip, --issuercertstorepath=VALUE
                              the path of the trusted issuer cert store
                                Default 'pki/issuer'
      --csr                  show data to create a certificate signing request
                                Default 'False'
      --ab, --applicationcertbase64=VALUE
                              update/set this applications certificate with the
                                certificate passed in as bas64 string
      --af, --applicationcertfile=VALUE
                              update/set this applications certificate with the
                                certificate file specified
      --pb, --privatekeybase64=VALUE
                              initial provisioning of the application
                                certificate (with a PEM or PFX fomat) requires a
                                private key passed in as base64 string
      --pk, --privatekeyfile=VALUE
                              initial provisioning of the application
                                certificate (with a PEM or PFX fomat) requires a
                                private key passed in as file
      --cp, --certpassword=VALUE
                              the optional password for the PEM or PFX or the
                                installed application certificate
      --tb, --addtrustedcertbase64=VALUE
                              adds the certificate to the applications trusted
                                cert store passed in as base64 string (multiple
                                strings supported)
      --tf, --addtrustedcertfile=VALUE
                              adds the certificate file(s) to the applications
                                trusted cert store passed in as base64 string (
                                multiple filenames supported)
      --ib, --addissuercertbase64=VALUE
                              adds the specified issuer certificate to the
                                applications trusted issuer cert store passed in
                                as base64 string (multiple strings supported)
      --if, --addissuercertfile=VALUE
                              adds the specified issuer certificate file(s) to
                                the applications trusted issuer cert store (
                                multiple filenames supported)
      --rb, --updatecrlbase64=VALUE
                              update the CRL passed in as base64 string to the
                                corresponding cert store (trusted or trusted
                                issuer)
      --uc, --updatecrlfile=VALUE
                              update the CRL passed in as file to the
                                corresponding cert store (trusted or trusted
                                issuer)
      --rc, --removecert=VALUE
                              remove cert(s) with the given thumbprint(s) (
                                multiple thumbprints supported)
      --dt, --devicecertstoretype=VALUE
                              the IoT Hub device cert store type.
                                (allowed values: Directory, X509Store)
                                Default: X509Store
      --dp, --devicecertstorepath=VALUE
                              the path of the iot device cert store
                                Default Default (depends on store type):
                                X509Store: 'My'
                                Directory: 'CertificateStores/IoT Hub'
  -i, --install              register OPC Publisher with IoT Hub and then exits.
                                Default:  False
  -h, --help                 show this message and exit
      --st, --opcstacktracemask=VALUE
                              ignored, only supported for backward comaptibility.
      --sd, --shopfloordomain=VALUE
                              same as site option, only there for backward
                                compatibility
                                The value must follow the syntactical rules of a
                                DNS hostname.
                                Default: not set
      --vc, --verboseconsole=VALUE
                              ignored, only supported for backward comaptibility.
      --as, --autotrustservercerts=VALUE
                              same as autoaccept, only supported for backward
                                cmpatibility.
                                Default: False
      --tt, --trustedcertstoretype=VALUE
                              ignored, only supported for backward compatibility.
                                the trusted cert store will always reside in a
                                directory.
      --rt, --rejectedcertstoretype=VALUE
                              ignored, only supported for backward compatibility.
                                the rejected cert store will always reside in a
                                directory.
      --it, --issuercertstoretype=VALUE
                              ignored, only supported for backward compatibility.
                                the trusted issuer cert store will always
                                reside in a directory.
```

Typically you specify the IoT Hub owner connection string only on the first run of the application. The connection string is encrypted and stored in the platform certificate store. On later runs, the application reads the connection string from the certificate store. If you specify the connection string on each run, the device that's created for the application in the IoT Hub device registry is removed and recreated.

## Run natively on Windows

Open the **opcpublisher.sln** project with Visual Studio, build the solution, and publish it. You can start the application in the **Target directory** you published to as follows:

```cmd
dotnet opcpublisher.dll <applicationname> [<IoT Hubconnectionstring>] [options]
```

## Use a self-built container

Build your own container and start it as follows:

```sh/cmd
docker run <your-container-name> <applicationname> [<IoT Hubconnectionstring>] [options]
```

## Use a container from Microsoft Container Registry

There's a prebuilt container available in the Microsoft Container Registry. Start it as follows:

```sh/cmd
docker run mcr.microsoft.com/iotedge/opc-publisher <applicationname> [<IoT Hubconnectionstring>] [options]
```

Check [Docker Hub](https://hub.docker.com/_/microsoft-iotedge-opc-publisher) to see the supported operating systems and processor architectures. If your OS and CPU architecture is supported, Docker automatically selects the correct container.

## Run as an Azure IoT Edge module

OPC Publisher is ready to be used as an [Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge) module. When you use OPC Publisher as IoT Edge module, the only supported transport protocols are **Amqp_Tcp_Only** and **Mqtt_Tcp_Only**.

To add OPC Publisher as module to your IoT Edge deployment, go to your IoT Hub settings in the Azure portal and complete the following steps:

1. Go to **IoT Edge** and create or select your IoT Edge device.
1. Select **Set Modules**.
1. Select **Add** under **Deployment Modules** and then **IoT Edge Module**.
1. In the **Name** field, enter **publisher**.
1. In the **Image URI** field, enter `mcr.microsoft.com/iotedge/opc-publisher:<tag>`
1. You can find the available tags on [Docker Hub](https://hub.docker.com/_/microsoft-iotedge-opc-publisher)
1. Paste the following JSON into the **Container Create Options** field:

    ```json
    {
        "Hostname": "publisher",
        "Cmd": [
            "--aa"
        ]
    }
    ```

    This configuration configures IoT Edge to start a container called **publisher** using the OPC Publisher image. The hostname of the container's system is set to **publisher**. OPC Publisher is called with the following command-line argument: `--aa`. With this option, OPC Publisher trusts the certificates of the OPC UA servers it connects to. You can use any OPC Publisher command-line options. The only limitation is the size of the **Container Create Options** supported by IoT Edge.

1. Leave the other settings unchanged and select **Save**.
1. If you want to process the output of the OPC Publisher locally with another IoT Edge module, go back to the **Set Modules** page. Then go to the **Specify Routes** tab, and add a new route that looks like the following JSON:

    ```json
    {
      "routes": {
        "processingModuleToIoT Hub": "FROM /messages/modules/processingModule/outputs/* INTO $upstream",
        "opcPublisherToProcessingModule": "FROM /messages/modules/publisher INTO BrokeredEndpoint(\"/modules/processingModule/inputs/input1\")"
      }
    }
    ```

1. Back in the **Set Modules** page, select **Next**, until you reach the last page of the configuration.
1. Select **Submit** to send your configuration to IoT Edge.
1. When you've started IoT Edge on your edge device and the docker container **publisher** is running, you can check out the log output of OPC Publisher either by
  using `docker logs -f publisher` or by checking the logfile. In the previous example, the log file is above `d:\iiotegde\publisher-publisher.log`. You can also use the [iot-edge-opc-publisher-diagnostics tool](https://github.com/Azure-Samples/iot-edge-opc-publisher-diagnostics).

### Make the configuration files accessible on the host

To make the IoT Edge module configuration files accessible in the host file system, use the following **Container Create Options**. The following example is of a deployment using Linux Containers for Windows:

```json
{
    "Hostname": "publisher",
    "Cmd": [
        "--pf=./pn.json",
        "--aa"
    ],
    "HostConfig": {
        "Binds": [
            "d:/iiotedge:/appdata"
        ]
    }
}
```

With these options, OPC Publisher reads the nodes it should publish from the file `./pn.json` and the container's working directory is set to `/appdata` at startup. With these settings, OPC Publisher reads the file `/appdata/pn.json` from the container to get its configuration. Without the `--pf` option, OPC Publisher tries to read the default configuration file `./publishednodes.json`.

The log file, using the default name `publisher-publisher.log`,  is written to `/appdata` and the `CertificateStores` directory is also created in this directory.

To make all these files available in the host file system, the container configuration requires a bind mount volume. The `d://iiotedge:/appdata` bind maps the directory `/appdata`, which is the current working directory on container startup, to the host directory `d://iiotedge`. Without this option, no file data is persisted when the container next starts.

If you're running Windows containers, then the syntax of the `Binds` parameter is different. At container startup, the working directory is `c:\appdata`. To put the configuration file in the directory `d:\iiotedge`on the host, specify the following mapping in the `HostConfig` section:

```json
"HostConfig": {
    "Binds": [
        "d:/iiotedge:c:/appdata"
    ]
}
```

If you're running Linux containers on Linux, the syntax of the `Binds` parameter is again different. At container startup, the working directory is `/appdata`. To put the configuration file in the directory `/iiotedge` on the host, specify the following mapping in the `HostConfig` section:

```json
"HostConfig": {
    "Binds": [
        "/iiotedge:/appdata"
    ]
}
```

## Considerations when using a container

The following sections list some things to keep in mind when you use a container:

### Access to the OPC Publisher OPC UA server

By default, the OPC Publisher OPC UA server listens on port 62222. To expose this inbound port in a container, use the following command:

```sh/cmd
docker run -p 62222:62222 mcr.microsoft.com/iotedge/opc-publisher <applicationname> [<IoT Hubconnectionstring>] [options]
```

### Enable intercontainer name resolution

To enable name resolution from within the container to other containers, create a user define docker bridge network, and connect the container to this network using the `--network` option. Also assign the container a name using the `--name` option as follows:

```sh/cmd
docker network create -d bridge iot_edge
docker run --network iot_edge --name publisher mcr.microsoft.com/iotedge/opc-publisher <applicationname> [<IoT Hubconnectionstring>] [options]
```

The container is now reachable using the name `publisher` by other containers on the same network.

### Access other systems from within the container

Other containers can be reached using the parameters described in the previous section. If operating system on which Docker is hosted is DNS enabled, then accessing all systems that are known to DNS works.

In networks that use NetBIOS name resolution, enable access to other systems by starting your container with the `--add-host` option. This option effectively adds an entry to the container's host file:

```cmd/sh
docker run --add-host mydevbox:192.168.178.23  mcr.microsoft.com/iotedge/opc-publisher <applicationname> [<IoT Hubconnectionstring>] [options]
```

### Assign a hostname

OPC Publisher uses the hostname of the machine it's running on for certificate and endpoint generation. Docker chooses a random hostname if one isn't set by the `-h` option. The following example shows how to set the internal hostname of the container to `publisher`:

```sh/cmd
docker run -h publisher mcr.microsoft.com/iotedge/opc-publisher <applicationname> [<IoT Hubconnectionstring>] [options]
```

### Use bind mounts (shared filesystem)

Instead of using the container file system, you may choose the host file system to store configuration information and log files. To configure this option, use the `-v` option of `docker run` in the bind mount mode.

## OPC UA X.509 certificates

OPC UA uses X.509 certificates to authenticate the OPC UA client and server when they establish a connection and to encrypt the communication between them. OPC Publisher uses certificate stores maintained by the OPC UA stack to manage all certificates. On startup, OPC Publisher checks if there's a certificate for itself. If there's no certificate in the certificate store, and one's not one passed in on the command-line, OPC Publisher creates a self-signed certificate. For more information, see the **InitApplicationSecurityAsync** method in `OpcApplicationConfigurationSecurity.cs`.

Self-signed certificates don't provide any security, as they're not signed by a trusted CA.

OPC Publisher provides command-line options to:

- Retrieve CSR information of the current application certificate used by OPC Publisher.
- Provision OPC Publisher with a CA signed certificate.
- Provision OPC Publisher with a new key pair and matching CA signed certificate.
- Add certificates to a trusted peer or trusted issuer certificate store.
- Add a CRL.
- Remove a certificate from the trusted peer or trusted issuers certificate store.

All these options let you pass in parameters using files or base64 encoded strings.

The default store type for all certificate stores is the file system, which you can change using command-line options. Because the container doesn't provide persistent storage in its file system, you must choose a different store type. Use the Docker `-v` option to persist the certificate stores in the host file system or on a Docker volume. If you use a Docker volume, you can pass in certificates using base64 encoded strings.

The runtime environment affects how certificates are persisted. Avoid creating new certificate stores each time you run the application:

- Running natively on Windows, you can't use an application certificate store of type `Directory` because access to the private key fails. In this case, use the option `--at X509Store`.
- Running as Linux docker container, you can map the certificate stores to the host file system with the docker run option `-v <hostdirectory>:/appdata`. This option makes the certificate persistent across application runs.
- Running as Linux docker container and you want to use an X509 store for the application certificate, use the docker run option `-v x509certstores:/root/.dotnet/corefx/cryptography/x509stores` and the application option `--at X509Store`

## Performance and memory considerations

This section discusses options for managing memory and performance:

### Command-line parameters to control performance and memory

When you run OPC Publisher, you need to be aware of your performance requirements and the memory resources available on your host.

Memory and performance are interdependent and both depend on the configuration of how many nodes you configure to publish. Ensure that the following parameters meet your requirements:

- IoT Hub sends interval: `--si`
- IoT Hub message size (default `1`): `--ms`
- Monitored items queue capacity: `--mq`

The `--mq` parameter controls the upper bound of the capacity of the internal queue, which buffers all OPC node value change notifications. If OPC Publisher can't send messages to IoT Hub fast enough, this queue buffers the notifications. The parameter sets the number of notifications that can be buffered. If you see the number of items in this queue increasing in your test runs, then to avoid losing messages you should:

- Reduce the IoT Hub send interval
- Increase the IoT Hub message size

The `--si` parameter forces OPC Publisher to send messages to IoT Hub at the specified interval. OPC Publisher sends a message as soon as the message size specified by the `--ms` parameter is reached, or as soon as the interval specified by the `--si` parameter is reached. To disable the message size option, use `--ms 0`. In this case,  OPC Publisher uses the largest possible IoT Hub message size of 256 kB to batch data.

The `--ms` parameter lets you batch messages sent to IoT Hub. The protocol you're using determines whether the overhead of sending a message to IoT Hub is high compared to the actual time of sending the payload. If your scenario allows for latency when data ingested by IoT Hub, configure OPC Publisher to use the largest message size of 256 kB.

Before you use OPC Publisher in production scenarios, test the performance and memory usage under production conditions. You can use the `--di` parameter to specify the interval, in seconds, that OPC Publisher writes diagnostic information.

### Test measurements

The following example diagnostics show measurements with different values for `--si` and `--ms` parameters publishing 500 nodes with an OPC publishing interval of 1 second.  The test used an OPC Publisher debug build on Windows 10 natively for 120 seconds. The IoT Hub protocol was the default MQTT protocol.

#### Default configuration (--si 10 --ms 262144)

```log
==========================================================================
OpcPublisher status @ 26.10.2017 15:33:05 (started @ 26.10.2017 15:31:09)
---------------------------------
OPC sessions: 1
connected OPC sessions: 1
connected OPC subscriptions: 5
OPC monitored items: 500
---------------------------------
monitored items queue bounded capacity: 8192
monitored items queue current items: 0
monitored item notifications enqueued: 54363
monitored item notifications enqueue failure: 0
monitored item notifications dequeued: 54363
---------------------------------
messages sent to IoT Hub: 109
last successful msg sent @: 26.10.2017 15:33:04
bytes sent to IoT Hub: 12709429
avg msg size: 116600
msg send failures: 0
messages too large to sent to IoT Hub: 0
times we missed send interval: 0
---------------------------------
current working set in MB: 90
--si setting: 10
--ms setting: 262144
--ih setting: Mqtt
==========================================================================
```

The default configuration sends data to IoT Hub every 10 seconds, or when 256 kB of data is available for IoT Hub to ingest. This configuration adds a moderate latency of about 10 seconds, but has lowest probability of losing data because of the large message size. The diagnostics output shows there are no lost OPC node updates: `monitored item notifications enqueue failure: 0`.

#### Constant send interval (--si 1 --ms 0)

```log
==========================================================================
OpcPublisher status @ 26.10.2017 15:35:59 (started @ 26.10.2017 15:34:03)
---------------------------------
OPC sessions: 1
connected OPC sessions: 1
connected OPC subscriptions: 5
OPC monitored items: 500
---------------------------------
monitored items queue bounded capacity: 8192
monitored items queue current items: 0
monitored item notifications enqueued: 54243
monitored item notifications enqueue failure: 0
monitored item notifications dequeued: 54243
---------------------------------
messages sent to IoT Hub: 109
last successful msg sent @: 26.10.2017 15:35:59
bytes sent to IoT Hub: 12683836
avg msg size: 116365
msg send failures: 0
messages too large to sent to IoT Hub: 0
times we missed send interval: 0
---------------------------------
current working set in MB: 90
--si setting: 1
--ms setting: 0
--ih setting: Mqtt
==========================================================================
```

When the message size is set to 0 then OPC Publisher internally batches data using the largest supported IoT Hub message size, which is 256 kB. The diagnostic output shows
the average message size is 115,019 bytes. In this configuration OPC Publisher doesn't lose any OPC node value updates, and compared to the default it has lower latency.

### Send each OPC node value update (--si 0 --ms 0)

```log
==========================================================================
OpcPublisher status @ 26.10.2017 15:39:33 (started @ 26.10.2017 15:37:37)
---------------------------------
OPC sessions: 1
connected OPC sessions: 1
connected OPC subscriptions: 5
OPC monitored items: 500
---------------------------------
monitored items queue bounded capacity: 8192
monitored items queue current items: 8184
monitored item notifications enqueued: 54232
monitored item notifications enqueue failure: 44624
monitored item notifications dequeued: 1424
---------------------------------
messages sent to IoT Hub: 1423
last successful msg sent @: 26.10.2017 15:39:33
bytes sent to IoT Hub: 333046
avg msg size: 234
msg send failures: 0
messages too large to sent to IoT Hub: 0
times we missed send interval: 0
---------------------------------
current working set in MB: 96
--si setting: 0
--ms setting: 0
--ih setting: Mqtt
==========================================================================
```

This configuration sends for each OPC node value change a message to IoT Hub. The diagnostics show the average message size is 234 bytes, which is small. The advantage of this configuration is that OPC Publisher doesn't add any latency. The number of
lost OPC node value updates (`monitored item notifications enqueue failure: 44624`) is high, which make this configuration unsuitable for scenarios with high volumes of telemetry to be published.

### Maximum batching (--si 0 --ms 262144)

```log
==========================================================================
OpcPublisher status @ 26.10.2017 15:42:55 (started @ 26.10.2017 15:41:00)
---------------------------------
OPC sessions: 1
connected OPC sessions: 1
connected OPC subscriptions: 5
OPC monitored items: 500
---------------------------------
monitored items queue bounded capacity: 8192
monitored items queue current items: 0
monitored item notifications enqueued: 54137
monitored item notifications enqueue failure: 0
monitored item notifications dequeued: 54137
---------------------------------
messages sent to IoT Hub: 48
last successful msg sent @: 26.10.2017 15:42:55
bytes sent to IoT Hub: 12565544
avg msg size: 261782
msg send failures: 0
messages too large to sent to IoT Hub: 0
times we missed send interval: 0
---------------------------------
current working set in MB: 90
--si setting: 0
--ms setting: 262144
--ih setting: Mqtt
==========================================================================
```

This configuration batches as many OPC node value updates as possible. The maximum IoT Hub message size is 256 kB, which is configured here. There's no send interval requested, which means the amount of data for IoT Hub to ingest determines the latency. This configuration has the least probability of losing any OPC node values and is suitable for publishing a high number of nodes. When you use this configuration, ensure your scenario doesn't have conditions where high latency is introduced if the message size of 256 kB isn't reached.

## Debug the application

To debug the application, open the **opcpublisher.sln** solution file with Visual Studio and use the Visual Studio debugging tools.

If you need to access the OPC UA server in the OPC Publisher, make sure that your firewall allows access to the port the server listens on. The default port is: 62222.

## Control the application remotely

Configuring the nodes to publish can be done using IoT Hub direct methods.

OPC Publisher implements a few additional IoT Hub direct method calls to read:

- General information.
- Diagnostic information on OPC sessions, subscriptions, and monitored items.
- Diagnostic information on IoT Hub messages and events.
- The startup log.
- The last 100 lines of the log.
- Shut down the application.

The following GitHub repositories contain tools to [configure the nodes to publish](https://github.com/Azure-Samples/iot-edge-opc-publisher-nodeconfiguration) and [read the diagnostic information](https://github.com/Azure-Samples/iot-edge-opc-publisher-diagnostics). Both tools are also available as containers in Docker Hub.

## Use a sample OPC UA server

If you don't have a real OPC UA server, you can use the [sample OPC UA PLC](https://github.com/Azure-Samples/iot-edge-opc-plc) to get started. This sample PLC is also available on Docker Hub.

It implements a number of tags, which generate random data and tags with anomalies. You can extend the sample if you need to simulate additional tag values.

## Next steps

Now that you've learned how to run OPC Publisher, the recommended next steps are to learn about [OPC Twin](overview-opc-twin.md) and [OPC Vault](overview-opc-vault.md).
