---
title: Microsoft OPC Publisher command-line arguments
description: This article provides an overview of the OPC Publisher Command-line Arguments.
author: hansgschossmann
ms.author: johanng
ms.service: industrial-iot
ms.topic: reference
ms.date: 3/22/2021
---

# OPC Publisher command-line arguments

This article describes the command-line arguments that you can use to set global settings for Open Platform Communications (OPC) Publisher.

## Command-line arguments for version 2.5 and earlier

* **Usage**: opcpublisher.exe \<applicationname> [\<iothubconnectionstring>] [\<options>]

* **applicationname**: (Required) The OPC Unified Architecture (OPC UA) application name to use.

    You also use the application name to register the publisher in the IoT hub device registry.

* **iothubconnectionstring**: (Optional) The IoT hub owner connection string.

    You ordinarily specify the connection string only when you start the application for the first time. The connection string is encrypted and stored in the platforms certificate store.

    On subsequent calls, the connection string is read from the platforms certificate store and reused. If you specify the connection string on each start, the device, which is created for the application in the IoT hub device registry, is removed and re-created each time.

To control the application, you can use any of several of environment variables:

* `_HUB_CS`: Sets the IoT hub owner connection string
* `_GW_LOGP`: Sets the file name of the log file to use
* `_TPC_SP`: Sets the path to store certificates of trusted stations
* `_GW_PNFP`: Sets the file name of the publishing configuration file

> [!NOTE]
> Command-line arguments overrule environment variable settings.

| Argument | Description |
| --- | --- |
| `--pf, --publishfile=VALUE` | The file name to use to configure the nodes to publish.<br>Default: `/appdata/publishednodes.json` |
| `--tc, --telemetryconfigfile=VALUE` | The file name to use to configure the ingested telemetry.<br>Default: '' |
| `-s, --site=VALUE` | The site that OPC Publisher is working in. If it's specified, this domain is appended (delimited by a `:` to the `ApplicationURI` property when telemetry is sent to the IoT hub. The value must follow the syntactical rules of a DNS hostname.<br>Default: \<not set> |
| `--ic, --iotcentral` | OPC Publisher sends OPC UA data in an Azure IoT Central-compatible format (`DisplayName` of a node is used as a key, which is the field name in Azure IoT Central). Ensure that all `DisplayName` values are unique (automatically enables the fetch display name).<br>Default: `false` |
| `--sw, --sessionconnectwait=VALUE` | Specifies the wait time, in seconds, that the publisher is trying to connect to disconnected endpoints and starts monitoring unmonitored items.<br>Minimum: 10<br>Default: `10` |
| `--mq, --monitoreditemqueuecapacity=VALUE` | Specifies how many notifications of monitored items can be stored in the internal queue if the data can't be sent quickly enough to the IoT hub.<br>Minimum: `1024`<br>Default: `8192` |
| `--di, --diagnosticsinterval=VALUE` | Shows OPC Publisher diagnostics information at the specified interval, in seconds (need log level information). `-1` disables the remote diagnostics log and diagnostics output. `0` disables the diagnostics output.<br>Default: `0` |
| `--ns, --noshutdown=VALUE` | Same as `runforever`.<br>Default: `false` |
| `--rf, --runforever` | You can't stop OPC Publisher by pressing a key on the console. It runs forever.<br>Default: `false` |
| `--lf, --logfile=VALUE` | The file name of the log file to use.<br>Default: `<hostname>-publisher.log` |
| `--lt, --logflushtimespan=VALUE` | The timespan, in seconds, when the log file should be flushed.<br>Default: `00:00:30` |
| `--ll, --loglevel=VALUE` | The log level to use. Allowed: `fatal`, `error`, `warn`, `info`, `debug`, `verbose`.<br>Default: `info` |
| `--ih, --iothubprotocol=VALUE` | The protocol to use for communication with the IoT hub (allowed values: `Amqp`, `Http1`, `Amqp_WebSocket_Only`, `Amqp_Tcp_Only`, `Mqtt`, `Mqtt_WebSocket_Only`, `Mqtt_ Tcp_Only`) or the Azure IoT Edge hub (allowed values: `Mqtt_Tcp_Only`, `Amqp_Tcp_Only`).<br>Default for the IoT hub: `Mqtt_WebSocket_Only`<br>Default for the IoT Edge hub: `Amqp_Tcp_Only` |
| `--ms, --iothubmessagesize=VALUE` | The maximum size of a message that can be sent to the IoT hub. When telemetry of this size is available, it is sent. `0` enforces immediate send when telemetry is available.<br>Minimum: `0`<br>Maximum: `262144`<br>Default: `262144` |
| `--si, --iothubsendinterval=VALUE` | The interval, in seconds, when telemetry should be sent to the IoT hub. If the interval is `0`, only the `iothubmessagesize` parameter controls when telemetry is sent.<br>Default: `10` |
| `--dc, --deviceconnectionstring=VALUE` | If OPC Publisher can't register itself with the IoT hub, you can create a device with the name `\<applicationname>` manually and pass in the connection string of this device.<br>Default: none |
| `-c, --connectionstring=VALUE` | The IoT hub owner connection string.<br>Default: none |
| `--hb, --heartbeatinterval=VALUE` | OPC Publisher uses this as a default value, in seconds, for the heartbeat interval setting of nodes without a heartbeat interval setting.<br>Default: `0` |
| `--sf, --skipfirstevent=VALUE` | OPC Publisher uses this as default value for the `skipfirstevent` setting of nodes without a `skipfirstevent` setting.<br>Default: `false` |
| `--pn, --portnum=VALUE` | The server port of the publisher OPC server endpoint.<br>Default: `62222` |
| `--pa, --path=VALUE` | The endpoint URL path part of the publisher OPC server endpoint.<br>Default: `/UA/Publisher` |
| `--lr, --ldsreginterval=VALUE` | The LDS(-ME) registration interval, in milliseconds (ms). If `0`, the registration is disabled.<br>Default: `0` |
| `--ol, --opcmaxstringlen=VALUE` | The maximum string length that OPC can transmit or receive.<br>Default: `131072` |
| `--ot, --operationtimeout=VALUE` | The operation time-out of the publisher OPC UA client, in milliseconds.<br>Default: `120000` |
| `--oi, --opcsamplinginterval=VALUE` | OPC Publisher uses this as default value, in milliseconds, to request the servers to sample the nodes with this interval. This value might be revised by the OPC UA servers to a supported sampling interval. Check the OPC UA specification for details about how this is handled by the OPC UA stack.<br>A negative value sets the sampling interval to the publishing interval of the subscription this node is on.<br>`0` configures the OPC UA server to sample in the highest possible resolution and should be used with care.<br>Default: `1000` |
| `--op, --opcpublishinginterval=VALUE` | OPC Publisher uses this as default value, in milliseconds, for the publishing interval setting of the subscriptions established to the OPC UA servers. Check the OPC UA specification for details about how this is handled by the OPC UA stack.<br>A value less than or equal to `0` lets the server revise the publishing interval.<br>Default: `0` |
| `--ct, --createsessiontimeout=VALUE` | Specifies the time-out, in seconds, that's used when you create a session to an endpoint. On unsuccessful connection, it attempts a backoff up to five times the specified time-out value.<br>Minimum: `1`<br>Default: `10` |
| `--ki, --keepaliveinterval=VALUE` | Specifies the interval, in seconds, that the publisher sends keep-alive messages to the OPC servers on the endpoints that it's connected to.<br>Minimum: `2`<br>Default: `2` |
| `--kt, --keepalivethreshold=VALUE` | Specifies the number of keep-alive packets that a server can miss before the session is disconnected.<br>Minimum: `1`<br>Default: `5` |
| `--aa, --autoaccept` | OPC Publisher trusts all servers that it establishes a connection to.<br>Default: `false` |
| `--tm, --trustmyself=VALUE` | Same as `trustowncert`.<br>Default: `false` |
| `--to, --trustowncert` | The OPC Publisher certificate is put into the trusted certificate store automatically.<br>Default: `false` |
| `--fd, --fetchdisplayname=VALUE` | Same as `fetchname`.<br>Default: `false` |
| `--fn, --fetchname` | Enable reading the display name of a published node from the server. This setting increases the run time.<br>Default: `false` |
| `--ss, --suppressedopcstatuscodes=VALUE` | Specifies the OPC UA status codes for which no events should be generated.<br>Default: `BadNoCommunication`, `BadWaitingForInitialData` |
| `--at, --appcertstoretype=VALUE` | The owned application certificate store type.<br>Allowed values: `Directory`, `X509Store`<br>Default: `Directory` |
| `--ap, --appcertstorepath=VALUE` | The path where the owned application certificate should be stored.<br>Default (depends on store type):<br>X509Store: `CurrentUser\UA_MachineDefault`<br>Directory: `pki/own` |
| `--tp, --trustedcertstorepath=VALUE` | The path of the trusted certificate store.<br>Default: `pki/trusted` |
| `--rp, --rejectedcertstorepath=VALUE` | The path of the rejected certificate store.<br>Default: `pki/rejected` |
| `--ip, --issuercertstorepath=VALUE` | The path of the trusted issuer certificate store.<br>Default: `pki/issuer` |
| `--csr` | Shows data to create a certificate signing request.<br>Default: `false` |
| `--ab, --applicationcertbase64=VALUE` | Updates or sets this application's certificate with the certificate that's passed in as a Base64 string. |
| `--af, --applicationcertfile=VALUE` | Updates or sets this application's certificate with the specified certificate file. |
| `--pb, --privatekeybase64=VALUE` | Initially provisions the application certificate (in PEM or PFX format). Requires a private key, which is passed in as a Base64 string. |
| `--pk, --privatekeyfile=VALUE` |  Initially provisions the application certificate (in PEM or PFX format). Requires a private key, which is passed in as file. |
| `--cp, --certpassword=VALUE` | The optional password for the PEM or PFX of the installed application certificate. |
| `--tb, --addtrustedcertbase64=VALUE` | Adds the certificate to the application's trusted certificate store, passed in as a Base64 string (multiple comma-separated strings supported). |
| `--tf, --addtrustedcertfile=VALUE` | Adds the certificate file to the application's trusted certificate store, passed in as a Base64 string (multiple comma-separated file names supported). |
| `--ib, --addissuercertbase64=VALUE` | Adds the specified issuer certificate to the application's trusted issuer certificate store, passed in as a Base64 string (multiple comma-separated strings supported). |
| `--if, --addissuercertfile=VALUE` | Adds the specified issuer certificate file to the application's trusted issuer certificate store (multiple comma-separated file names supported). |
| `--rb, --updatecrlbase64=VALUE` | Updates the certificate revocation list (CRL), passed in as a Base64 string to the corresponding certificate store (trusted or trusted issuer). |
| `--uc, --updatecrlfile=VALUE` | Updates the CRL, passed in as file to the corresponding certificate store (trusted or trusted issuer). |
| `--rc, --removecert=VALUE` | Removes certificates with the specified thumbprints (multiple comma-separated thumbprints supported). |
| `--dt, --devicecertstoretype=VALUE` | The IoT hub device certificate store type.<br>Allowed values: `Directory`, `X509Store`<br>Default: `X509Store` |
| `--dp, --devicecertstorepath=VALUE` | The path of the IoT device certificate store<br>Default (depends on store type): `X509Store`<br>`My` Directory: `CertificateStores/IoTHub` |
| `-i, --install` | Registers OPC Publisher with the IoT hub and then exits.<br>Default: `false` |
| `-h, --help` | Shows this message and exits. |
| `--st, --opcstacktracemask=VALUE` | Ignored. |
| `--sd, --shopfloordomain=VALUE` | Same as the site option. The value must follow the syntactical rules of a DNS hostname.<br>Default: \<not set> |
| `--vc, --verboseconsole=VALUE` | Ignored. |
| `--as, --autotrustservercerts=VALUE` | Same as `--aa, --autoaccept`.<br>Default: `false` |
| `--tt, --trustedcertstoretype=VALUE` | Ignored. The trusted certificate store always resides in a directory. |
| `--rt, --rejectedcertstoretype=VALUE` | Ignored. The rejected certificate store always resides in a directory. |
| `--it, --issuercertstoretype=VALUE` | Ignored. The trusted issuer certificate store always resides in a directory. |

## Command-line arguments for version 2.6 and later

| Argument | Description |
| --- | --- |
| `--pf, --publishfile=VALUE` | The file name to configure the nodes to publish. If this option is specified, it puts OPC Publisher into *standalone* mode. |
| `--lf, --logfile=VALUE` | The file name of the log file to use. |
| `--ll. --loglevel=VALUE` | The log level to use. Allowed: `fatal`, `error`, `warn`, `info`, `debug`, `verbose`. |
| `--me, --messageencoding=VALUE` | The messaging encoding for outgoing messages. Allowed values: `Json`, `Uadp`. |
| `--mm, --messagingmode=VALUE` | The messaging mode for outgoing messages. Allowed values: `PubSub`, `Samples`. |
| `--fm, --fullfeaturedmessage=VALUE` | The full-featured mode for messages (all fields filled in).<br>Default is `true`. For legacy compatibility, use `false`. |
| `--aa, --autoaccept` | OPC Publisher trusts all servers that it establishes a connection to. |
| `--bs, --batchsize=VALUE` | The number of OPC UA data-change messages to be cached for batching. |
| `--si, --iothubsendinterval=VALUE` | The trigger batching interval, in seconds. |
| `--ms, --iothubmessagesize=VALUE` | The maximum size of the IoT D2C message. |
| `--om, --maxoutgressmessages=VALUE` | The maximum size of the IoT D2C message egress buffer. |
| `--di, --diagnosticsinterval=VALUE` | Shows OPC Publisher diagnostics information at the specified interval, in seconds (need log level information). `-1` disables the remote diagnostics log and diagnostics output. |
| `--lt, --logflugtimespan=VALUE` | The timespan, in seconds, when the log file should be flushed. |
| `--ih, --iothubprotocol=VALUE` | The protocol to use for communication with the hub. Allowed values: `AmqpOverTcp`, `AmqpOverWebsocket`, `MqttOverTcp`, `MqttOverWebsocket`, `Amqp`, `Mqtt`, `Tcp`, `Websocket`, `Any`. |
| `--hb, --heartbeatinterval=VALUE` | OPC Publisher uses this as default value, in seconds, for the heartbeat interval setting of nodes without a heartbeat interval setting. |
| `--ot, --operationtimeout=VALUE` | The operation time-out of the publisher OPC UA client, in milliseconds (ms). |
| `--ol, --opcmaxstringlen=VALUE` | The maximum length of a string that OPC Publisher can transmit or receive. |
| `--oi, --opcsamplinginterval=VALUE` | The default value, in milliseconds, to request the servers to sample values. |
| `--op, --opcpublishinginterval=VALUE` | The default value, in milliseconds, for the publishing interval setting of the subscriptions against the OPC UA server. |
| `--ct, --createsessiontimeout=VALUE` | The interval, in seconds, that OPC Publisher sends keep-alive messages to the OPC servers on the endpoints that it's connected to. |
| `--kt, --keepalivethresholt=VALUE` | Specifies the number of keep-alive packets that a server can miss before a session is disconnected. |
| `--tm, --trustmyself` | Automatically puts the OPC Publisher certificate into the trusted store. |
| `--at, --appcertstoretype=VALUE` | The owned application certificate store type. Allowed: `Directory`, `X509Store`. |

## Command-line arguments for version 2.8.2 and later

The following OPC Publisher configuration can be applied by command-line interface (CLI) options or as environment variable settings.

The `Alternative` field, when it's present, refers to the applicable CLI argument in *standalone mode only*. When both the environment variable and the CLI argument are provided, the latest argument overrules the environment variable.

| Argument | Description |
| --- | --- |
| `PublishedNodesFile=VALUE` | The file that's used to store the configuration of the nodes to be published along with the information to connect to the OPC UA server sources. When this file is specified, or the default file is accessible by the module, OPC Publisher starts in *standalone* mode.<br>Alternative: `--pf, --publishfile`<br>Mode: Standalone only<br>Type: `string` - file name, optionally prefixed with the path<br>Default: `publishednodes.json` |
| `site=VALUE` | The site that OPC Publisher is assigned to.<br>Alternative: `--s, --site`<br>Mode: Standalone, orchestrated<br>Type: `string`<br>Default: \<not set> |
| `LogFile name==VALUE` | The file name of the log file to use<br>Alternative: `--lf, --logfile`<br>Mode: Standalone only<br>Type: `string` - file name, optionally prefixed with the path<br>Default: \<not set> |
| `LogFileFlushTimeSpan=VALUE` | The timespan, in seconds, when the log file should be flushed in the storage account.<br>Alternative: `--lt, --logflushtimespan`<br>Mode: Standalone only<br>Environment variable<br>Type: `timespan string` {[d.]hh:mm:ss[.fffffff]}<br>Alternative argument type: `integer`, in seconds<br>Default: `{00:00:30}` |
| `loglevel=Value` |  The level for logs to be persisted in the log file.<br>Alternative: `--ll` `--loglevel`<br>Mode: Standalone only<br>Type: `string enum` - `fatal`, `error`, `warning`, `information`, `debug`, `verbose`<br>Default: `info` |
| `EdgeHubConnectionString=VALUE` | An IoT Edge Device or IoT Edge module connection string to use. When it's deployed as a module in IoT Edge, the environment variable is already set as part of the container deployment.<br>Alternative: `--dc, --deviceconnectionstring` \| `--ec, --edgehubconnectionstring`<br>Mode: Standalone, orchestrated<br>Type: connection string<br>Default: \<not set> \<set by iotedge run time> |
| `Transport=VALUE` | The protocol to use for outgoing messages sent to the IoT Edge hub or the IoT hub.<br>Alternative: `--ih, --iothubprotocol`<br>Mode: Standalone, orchestrated<br>Type: `string enum` - `Any`, `Amqp`, `Mqtt`, `AmqpOverTcp`, `AmqpOverWebsocket`, `MqttOverTcp`, `MqttOverWebsocket`, `Tcp`, `Websocket`<br>Default: `MqttOverTcp` |
| `BypassCertVerification=VALUE` | Enables/disables the bypassing of certificate verification for outgoing messages sent to EdgeHub.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: Boolean<br>Default: `false` |
| `EnableMetrics=VALUE` | Enables/disables metrics propagation (towards cloud).<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: Boolean<br>Default: `true` |
| `DefaultPublishingInterval=VALUE` | The default value for the OPC UA publishing interval of OPC UA subscriptions created to an OPC UA server. This value is used when no explicit setting is configured.<br>Alternative: `--op, --opcpublishinginterval`<br>Mode: Standalone only<br> Environment variable<br>Type: `timespan string` {[d.]hh:mm:ss[.fffffff]}<br>Alternative argument type: `integer`, in milliseconds<br>Default: `{00:00:01}` (1000) |
| `DefaultSamplingInterval=VALUE` | The default value for the OPC UA sampling interval of nodes to publish. This value is used when no explicit setting is configured.<br>Alternative: `--oi, --opcsamplinginterval`<br>Mode: Standalone only<br>Environment variable<br>Type: `timespan string` {[d.]hh:mm:ss[.fffffff]}<br>Alternative argument type: `integer`, in milliseconds<br>Default: `{00:00:01}` (1000) |
| `DefaultQueueSize=VALUE` | The default value for the monitored item's queue size, to be used when it isn't explicitly specified in the *pn.json* file.<br>Alternative: `--mq, --monitoreditemqueuecapacity`<br>Mode: Standalone only<br>Type: `integer`<br>Default: `1` |
| `DefaultHeartbeatInterval=VALUE` | The default value for the heartbeat interval setting of published nodes that have no explicit setting for heartbeat interval.<br>Alternative: `--hb, --heartbeatinterval`<br>Mode: Standalone<br>Environment variable<br>Type: `timespan string` {[d.]hh:mm:ss[.fffffff]}<br>Alternative argument type: `integer`, in seconds<br>Default: `{00:00:00}`, which means that heartbeat is disabled |
| `MessageEncoding=VALUE` | The messaging encoding for outgoing telemetry.<br>Alternative: `--me, --messageencoding`<br>Mode: Standalone only<br>Type: `string enum` - `Json`, `Uadp`<br>Default: `Json` |
| `MessagingMode=VALUE` | The messaging mode for outgoing telemetry.<br>Alternative: `--mm, --messagingmode`<br>Mode: Standalone only<br>Type: `string enum` - `PubSub`, `Samples`<br>Default: `Samples` |
| `FetchOpcNodeDisplayName=VALUE` | Fetches the display name for the nodes to be published from the OPC UA server when it isn't explicitly set in the configuration.<br>**Note**: This argument has a high impact on OPC Publisher startup performance.<br>Alternative: `--fd, --fetchdisplayname`<br>Mode: Standalone only<br>Type: Boolean<br>Default: `false` |
| `FullFeaturedMessage=VALUE` | The full-featured mode for messages (all fields filled in the telemetry).<br>Default is `false` for legacy compatibility.<br>Alternative: `--fm, --fullfeaturedmessage`<br>Mode: Standalone only<br>Type: Boolean<br>Default: `false` |
| `BatchSize=VALUE` | The number of incoming OPC UA data change messages to be cached for batching. When `BatchSize` is `1` or `TriggerInterval` is set to `0`, batching is disabled.<br>Alternative: `--bs, --batchsize`<br>Mode: Standalone, orchestrated<br>Type: `integer`<br>Default: `50` |
| `BatchTriggerInterval=VALUE` | The batching trigger interval. When `BatchSize` is `1` or `TriggerInterval` is set to `0`, batching is disabled.<br>Alternative: `--si, --iothubsendinterva`l<br>Mode: Standalone, orchestrated<br>Environment variable<br>Type: `timespan string` {[d.]hh:mm:ss[.fffffff]}<br> Alternative argument type: `integer`, in seconds<br>Default: `{00:00:10}` |
| `IoTHubMaxMessageSize=VALUE` | The maximum  size of the IoT D2C telemetry message.<br>Alternative: `--ms, --iothubmessagesize`<br>Mode: Standalone, orchestrated<br>Type: `integer`<br>Default: `0` |
| `DiagnosticsInterval=VALUE` | Shows OPC Publisher diagnostics information at the specified interval, in seconds (need log level information). `-1` disables the remote diagnostics log and diagnostics output.<br>Alternative: `--di, --diagnosticsinterval`<br>Mode: Standalone only<br>Environment variable<br>Type: `timespan string` {[d.]hh:mm:ss[.fffffff]}<br>Alternative argument type: `integer`, in seconds<br>Default: `{00:00:60}` |
| `LegacyCompatibility=VALUE` | Forces OPC Publisher to operate in 2.5 legacy mode by using `application/opcua+uajson` for `ContentType` on the IoT hub.<br>Telemetry message.<br>Alternative: `--lc, --legacycompatibility`<br>Mode: Standalone only<br>Type: Boolean<br>Default: `false` |
| `PublishedNodesSchemaFile=VALUE` | The validation schema file name for the published nodes file.<br>Alternative: `--pfs, --publishfileschema`<br>Mode: Standalone only<br>Type: `string`<br>Default: \<not set> |
| `MaxNodesPerDataSet=VALUE` | The maximum number of nodes within a dataset or subscription. When more nodes than this value are configured for `DataSetWriter`, they're added in a separate dataset or subscription.<br>Alternative: N/A<br>Mode: Standalone only<br>Type: `integer`<br>Default: `1000` |
| `ApplicationName=VALUE` | The OPC UA Client Application Configuration application name, as per the OPC UA definition. It's used for authentication during the initial communication handshake and as part of owned certificate validation.<br>Alternative: `--an, --appname`<br>Mode: Standalone, orchestrated<br>Type: `string`<br>Default: `Microsoft.Azure.IIoT` |
| `ApplicationUri=VALUE` | The OPC UA Client Application Configuration application URI, as per the OPC UA definition.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `string`<br>Default: `$"urn:localhost:{ApplicationName}:microsoft:"` |
| `ProductUri=VALUE` | The OPC UA Client Application Configuration product URI, as per OPC UA definition.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `string`<br>Default: `https://www.github.com/Azure/Industrial-IoT` |
| `DefaultSessionTimeout=VALUE` | The OPC UA Client Application Configuration session time-out, in seconds, as per OPC UA definition.<br>Alternative: `--ct, --createsessiontimeout`<br>Mode: Standalone, orchestrated<br>Type: `integer`<br>Default: `0`, which means \<not set> |
| `MinSubscriptionLifetime=VALUE` | The OPC UA Client Application Configuration minimum subscription lifetime, in seconds, as per OPC UA definition.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `integer`<br>Default: `0`, \<not set> |
| `KeepAliveInterval=VALUE` | The OPC UA Client Application Configuration keep-alive interval, in seconds, as per OPC UA definition.<br>Alternative: `--ki, --keepaliveinterval`<br>Mode: Standalone, orchestrated<br>Type: `integer`, in milliseconds<br>Default: `10,000` (10 sec) |
| `MaxKeepAliveCount=VALUE` | The OPC UA Client Application Configuration maximum number of keep-alive events, as per OPC UA definition.<br>Alternative: `--kt, --keepalivethreshold`<br>Mode: Standalone, orchestrated<br>Type: `integer`<br>Default: `50` |
| `PkiRootPath=VALUE` | The OPC UA Client Security Configuration PKI (public key infrastructure) certificate store root path.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `string`<br>Default: `pki` |
| `ApplicationCertificateStorePath=VALUE` | The OPC UA Client Security Configuration application's owned certificate store path.<br>Alternative: `--ap, --appcertstorepath`<br>Mode: Standalone, orchestrated<br>Type: `string`<br>Default: `$"{PkiRootPath}/own"` |
| `ApplicationCertificateStoreType=VALUE` | The OPC UA Client Security Configuration application's owned certificate store type.<br>Alternative: `--at, --appcertstoretype`<br>Mode: Standalone, orchestrated<br>Type: `string enum` - `Directory`, `X509Store`<br>Default: `Directory` |
| `ApplicationCertificateSubjectName=VALUE` | The OPC UA Client Security Configuration subject name in the application's owned certificate.<br>Alternative: `--sn, --appcertsubjectname`<br>Mode: Standalone, orchestrated<br>Type: `string`<br>Default: `"CN=Microsoft.Azure.IIoT, C=DE, S=Bav, O=Microsoft, DC=localhost"` |
| `TrustedIssuerCertificatesPath=VALUE` | The OPC UA Client Security Configuration trusted certificate issuer store path.<br>Alternative: `--ip, --issuercertstorepath`<br>Mode: Standalone, orchestrated<br>Type: `string`<br>Default: `$"{PkiRootPath}/issuers"` |
| `TrustedIssuerCertificatesType=VALUE` | The OPC UA Client Security Configuration trusted issuer certificates store type.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `string enum` - `Directory`, `X509Store`<br>Default: `Directory` |
| `TrustedPeerCertificatesPath=VALUE` | The OPC UA Client Security Configuration trusted peer certificates store path.<br>Alternative: `--tp, --trustedcertstorepath`<br>Mode: Standalone, orchestrated<br>Type: `string`<br>Default: `$"{PkiRootPath}/trusted"` |
| `TrustedPeerCertificatesType=VALUE` | The OPC UA Client Security Configuration trusted peer certificates store type.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `string enum` - `Directory`, `X509Store`<br>Default: `Directory` |
| `RejectedCertificateStorePath=VALUE` | The OPC UA Client Security Configuration rejected certificates store path.<br>Alternative: `--rp, --rejectedcertstorepath`<br>Mode: Standalone, orchestrated<br>Type: `string`<br>Default: `$"{PkiRootPath}/rejected"` |
| `RejectedCertificateStoreType=VALUE` | The OPC UA Client Security Configuration rejected certificates store type.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `string enum` - `Directory`, `X509Store`<br>Default: `Directory` |
| `AutoAcceptUntrustedCertificates=VALUE` | The OPC UA Client Security Configuration auto accept untrusted peer certificates.<br>Alternative: `--aa, --autoaccept`<br>Mode: Standalone, orchestrated<br>Type: Boolean<br>Default: `false` |
| `RejectSha1SignedCertificates=VALUE` | The OPC UA Client Security Configuration reject deprecated Sha1 signed certificates.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: Boolean<br>Default: `false` |
| `MinimumCertificateKeySize=VALUE` | The OPC UA Client Security Configuration minimum accepted certificates key size.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `integer`<br>Default: `1024` |
| `AddAppCertToTrustedStore=VALUE` | The OPC UA Client Security Configuration automatically copy the owned certificate's public key to the trusted certificate store.<br>Alternative: `--tm, --trustmyself`<br>Mode: Standalone, orchestrated<br>Type: Boolean<br>Default: `true` |
| `SecurityTokenLifetime=VALUE` | The OPC UA Stack Transport Secure Channel security token lifetime. <br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `integer`, in milliseconds<br>Default: `3,600,000` (1 hour) |
| `ChannelLifetime=VALUE` | The OPC UA Stack Transport Secure Channel channel lifetime, in milliseconds.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `integer`, in milliseconds<br>Default: `300,000` (5 minutes) |
| `MaxBufferSize=VALUE` | The OPC UA Stack Transport Secure Channel maximum buffer size.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `integer`, in kilobytes<br>Default: `65,535` (64 KB -1) |
| `MaxMessageSize=VALUE` | The OPC UA Stack Transport Secure Channel maximum message size.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `integer`<br>Default: `4,194,304` (4 MB) |
| `MaxArrayLength=VALUE` | The OPC UA Stack Transport Secure Channel maximum array length. <br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `integer`<br>Default: `65,535` (64 KB - 1) |
| `MaxByteStringLength=VALUE` | The OPC UA Stack Transport Secure Channel maximum byte string length.<br>Alternative: N/A<br>Mode: Standalone, orchestrated<br>Type: `integer`<br>Default: `1,048,576` (1 MB) |
| `OperationTimeout=VALUE` | The OPC UA Stack Transport Secure Channel service call operation timeout.<br>Alternative: `--ot, --operationtimeout`<br>Mode: Standalone, orchestrated<br>Type: `integer`, in milliseconds<br>Default: `120,000` (2 min) |
| `MaxStringLength=VALUE` | The OPC UA Stack Transport Secure Channel maximum length of a string that can be sent/received over the OPC UA secure channel.<br>Alternative: `--ol, --opcmaxstringlen`<br>Mode: Standalone, orchestrated<br>Type: `integer`<br>Default: `130,816` (128 KB - 256) |
| `RuntimeStateReporting=VALUE` | Enables reporting of OPC Publisher restarts.<br>Alternative: `--rs, --runtimestatereporting`<br>Mode: Standalone<br>Type: Boolean<br>Default: `false` |
| `EnableRoutingInfo=VALUE` | Adds the routing information to telemetry messages. The name of the property is `$$RoutingInfo`, and the value is `DataSetWriterGroup` for that particular message. When `DataSetWriterGroup` isn't configured, the `$$RoutingInfo` property isn't added to the message even if this argument is set.<br>Alternative: `--ri, --enableroutinginfo`<br>Mode: Standalone<br>Type: Boolean<br>Default: `false` |

## Next steps

For additional resources, go to the following GitHub repositories:

> [!div class="nextstepaction"]
> [OPC Publisher GitHub repository](https://github.com/Azure/Industrial-IoT)

> [!div class="nextstepaction"]
> [Industrial IoT platform GitHub repository](https://github.com/Azure/iot-edge-opc-publisher)
