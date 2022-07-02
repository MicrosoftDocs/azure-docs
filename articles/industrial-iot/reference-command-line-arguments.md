---
title: Microsoft OPC Publisher Command-line Arguments
description: This article provides an overview of the OPC Publisher Command-line Arguments
author: jehona-m
ms.author: jemorina
ms.service: industrial-iot
ms.topic: reference
ms.date: 3/22/2021
---

# Command-line Arguments

In the following, there are several Command-line Arguments described that can be used to set global settings for OPC Publisher.

## OPC Publisher Command-line Arguments for Version 2.5 and below

* Usage: opcpublisher.exe \<applicationname> [\<iothubconnectionstring>] [\<options>]
    
* applicationname: the OPC UA application name to use, required
                         The application name is also used to register the publisher under this name in the
                         IoT Hub device registry.
    
* iothubconnectionstring: the IoT Hub owner connectionstring, optional. Typically you specify the IoTHub owner connectionstring only on the first start of the application. The connection string is encrypted and stored in the platforms certificate store.
On subsequent calls, it's read from there and reused. If you specify the connectionstring on each start, the device, which is created for the application in the IoT Hub device registry is removed and recreated each time.
    
There are a couple of environment variables, which can be used to control the application:
```
        _HUB_CS: sets the IoTHub owner connectionstring
        _GW_LOGP: sets the filename of the log file to use
        _TPC_SP: sets the path to store certificates of trusted stations
        _GW_PNFP: sets the filename of the publishing configuration file
```

> [!NOTE] 
> Command-line Arguments overrule environment variable settings.
    
```
      --pf, --publishfile=VALUE
                                       the filename to configure the nodes to publish.
                                       Default: '/appdata/publishednodes.json'
      --tc, --telemetryconfigfile=VALUE
                                       the filename to configure the ingested telemetry
                                       Default: ''
      -s, --site=VALUE
                                       the site OPC Publisher is working in. if specified this domain is appended (delimited by a ':' to the 'ApplicationURI' property when telemetry is sent to IoTHub.
                                       The value must follow the syntactical rules of a
                                       DNS hostname.
                                       Default: not set
      --ic, --iotcentral
                                       OPC Publisher sends OPC UA data in IoTCentral
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
                                       can not be sent quick enough to IoTHub
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
      --rf, --runforever
                                       OPC Publisher can not be stopped by pressing a key on
                                       the console, but runs forever.
                                       Default: False
      --lf, --logfile=VALUE
                                       the filename of the logfile to use.
                                       Default: './<hostname>-publisher.log'
      --lt, --logflushtimespan=VALUE
                                       the timespan in seconds when the logfile should be
                                       flushed.
                                       Default: 00:00:30 sec
      --ll, --loglevel=VALUE
                                       the loglevel to use (allowed: fatal, error, warn,
                                       info, debug, verbose).
                                       Default: info
      --ih, --iothubprotocol=VALUE
                                       the protocol to use for communication with IoTHub (allowed values: Amqp, Http1, Amqp_WebSocket_Only,
                                       Amqp_Tcp_Only, Mqtt, Mqtt_WebSocket_Only, Mqtt_
                                       Tcp_Only) or IoT EdgeHub (allowed values: Mqtt_
                                       Tcp_Only, Amqp_Tcp_Only).
                                       Default for IoTHub: Mqtt_WebSocket_Only
                                       Default for IoT EdgeHub: Amqp_Tcp_Only
      --ms, --iothubmessagesize=VALUE
                                       the max size of a message which can be sent to
                                       IoTHub. When telemetry of this size is available
                                       it is sent.
                                       0 enforces immediate send when telemetry is
                                       available
                                       Min: 0
                                       Max: 262144
                                       Default: 262144
      --si, --iothubsendinterval=VALUE
                                       the interval in seconds when telemetry should be
                                       sent to IoTHub. If 0, then only the
                                       iothubmessagesize parameter controls when
                                       telemetry is sent.
                                       Default: '10'
      --dc, --deviceconnectionstring=VALUE
                                       if publisher is not able to register itself with
                                       IoTHub, you can create a device with name <
                                       applicationname> manually and pass in the
                                       connectionstring of this device.
                                       Default: none
      -c, --connectionstring=VALUE
                                       the IoTHub owner connectionstring.
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
      --pn, --portnum=VALUE
                                       the server port of the publisher OPC server
                                       endpoint.
                                       Default: 62222
      --pa, --path=VALUE
                                       the enpoint URL path part of the publisher OPC
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
                                       a negative value sets the sampling interval
                                       to the publishing interval of the subscription
                                       this node is on.
                                       0 configures the OPC UA server to sample in
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
                                       a value less than or equal zero lets the
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
      --aa, --autoaccept
                                       the OPC Publisher trusts all servers it is
                                       establishing a connection to.
                                       Default: False
      --tm, --trustmyself=VALUE
                                       same as trustowncert.
                                       Default: False
      --to, --trustowncert
                                       the OPC Publisher certificate is put into the trusted
                                       certificate store automatically.
                                       Default: False
      --fd, --fetchdisplayname=VALUE
                                       same as fetchname.
                                       Default: False
      --fn, --fetchname
                                       enable to read the display name of a published
                                       node from the server. this increases the
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
      --csr
                                       show data to create a certificate signing request
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
                                       comma-separated strings supported)
      --tf, --addtrustedcertfile=VALUE
                                       adds the certificate file(s) to the applications
                                       trusted cert store passed in as base64 string (
                                       multiple comma-separated filenames supported)
      --ib, --addissuercertbase64=VALUE
                                       adds the specified issuer certificate to the
                                       applications trusted issuer cert store passed in
                                       as base64 string (multiple comma-separated strings supported)
      --if, --addissuercertfile=VALUE
                                       adds the specified issuer certificate file(s) to
                                       the applications trusted issuer cert store (
                                       multiple comma-separated filenames supported)
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
                                       multiple comma-separated thumbprints supported)
      --dt, --devicecertstoretype=VALUE
                                       the iothub device cert store type.
                                       (allowed values: Directory, X509Store)
                                       Default: X509Store
      --dp, --devicecertstorepath=VALUE
                                       the path of the iot device cert store
                                       Default Default (depends on store type):
                                       X509Store: 'My'
                                       Directory: 'CertificateStores/IoTHub'
      -i, --install
                                       register OPC Publisher with IoTHub and then exits.
                                       Default:  False
      -h, --help
                                       show this message and exit
      --st, --opcstacktracemask=VALUE
                                       ignored.
      --sd, --shopfloordomain=VALUE
                                       same as site option
                                       The value must follow the syntactical rules of a
                                       DNS hostname.
                                       Default: not set
      --vc, --verboseconsole=VALUE
                                       ignored.
      --as, --autotrustservercerts=VALUE
                                       same as autoaccept
                                       Default: False
      --tt, --trustedcertstoretype=VALUE
                                       ignored.
                                       the trusted cert store always resides in a
                                       directory.
      --rt, --rejectedcertstoretype=VALUE
                                       ignored.
                                       the rejected cert store always resides in a
                                       directory.
      --it, --issuercertstoretype=VALUE
                                       ignored.
                                       the trusted issuer cert store always
                                       resides in a directory.
```


## OPC Publisher Command-line Arguments for Version 2.6 and above
```
      --pf, --publishfile=VALUE
                                       the filename to configure the nodes  to publish.
                                       If this Option is specified it puts OPC Publisher into stadalone  mode.
      --lf, --logfile=VALUE
                                       the filename of the logfile to use.
      --ll. --loglevel=VALUE
                                       the log level to use (allowed: fatal, error,
                                       warn, info, debug, verbose).
      --me, --messageencoding=VALUE
                                       the messaging encoding for outgoing  messages
                                       allowed values: Json, Uadp
      --mm, --messagingmode=VALUE
                                       the messaging mode for outgoing  messages
                                       allowed values: PubSub, Samples
      --fm, --fullfeaturedmessage=VALUE
                                       the full featured mode for messages (all fields filled in).
                                       Default is 'true', for legacy compatibility use 'false'
      --aa, --autoaccept
                                       the publisher trusted all servers it is establishing a connection to
      --bs, --batchsize=VALUE
                                       the number of OPC UA data-change messages to be cached for batching.
      --si, --iothubsendinterval=VALUE
                                       the trigger batching interval in seconds.
      --ms, --iothubmessagesize=VALUE
                                       the maximum size of the (IoT D2C) message.
      --om, --maxoutgressmessages=VALUE
                                       the maximum  size of the (IoT D2C) message egress buffer.
      --di, --diagnosticsinterval=VALUE
                                       shows publisher diagnostic info at the specified interval in seconds
                                       (need log level info). -1 disables remote diagnostic log and diagnostic output
      --lt, --logflugtimespan=VALUE
                                       the timespan in seconds when the logfile should be flushed.
      --ih, --iothubprotocol=VALUE
                                       protocol to use for communication with the hub.
                                       allowed values: AmqpOverTcp, AmqpOverWebsocket, MqttOverTcp,
                                       MqttOverWebsocket, Amqp, Mqtt, Tcp, Websocket, Any
      --hb, --heartbeatinterval=VALUE
                                       the publisher is using this as default value in seconds for the
                                       heartbeat interval setting of nodes without  a heartbeat interval setting.
      --ot, --operationtimeout=VALUE
                                       the operation timeout of the publisher OPC  UA client in ms.
      --ol, --opcmaxstringlen=VALUE
                                       the max length of a string opc can transmit/receive.
      --oi, --opcsamplinginterval=VALUE
                                       default value in milliseconds to request the servers to sample values
      --op, --opcpublishinginterval=VALUE
                                       default value in milliseconds for the publishing interval setting
                                       of the subscriptions against the OPC UA  server.
      --ct, --createsessiontimeout=VALUE
                                       the interval in seconds the publisher is sending keep alive
                                       messages to the OPC servers on the endpoints it is  connected to.
      --kt, --keepalivethresholt=VALUE
                                       specify the number of keep alive  packets a server can miss,
                                       before the session is disconnected.
      --tm, --trustmyself
                                       the publisher certificate is put into the  trusted store automatically.
      --at, --appcertstoretype=VALUE
                                       the own application cert store type  (allowed: Directory, X509Store).
```

## OPC Publisher Command-line Arguments for Version 2.8.2 and above

The following OPC Publisher configuration can be applied by Command Line Interface (CLI) options or as environment variable settings.
The `Alternative` field, where present, refers to the CLI argument applicable in **standalone mode only**. When both environment variable and CLI argument are provided, the latest will overrule the env variable.
```
        PublishedNodesFile=VALUE
                                      The file used to store the configuration of the nodes to be published
                                      along with the information to connect to the OPC UA server sources
                                      When this file is specified, or the default file is accessible by
                                      the module, OPC Publisher will start in standalone mode
                                      Alternative: --pf, --publishfile
                                      Mode: Standalone only
                                      Type: string - file name, optionally prefixed with the path
                                      Default: publishednodes.json

         site=VALUE
                                      The site OPC Publisher is assigned to
                                      Alternative: --s, --site
                                      Mode: Standalone and Orchestrated
                                      Type: string 
                                      Default: <not set>

        LogFileName==VALUE
                                      The filename of the logfile to use
                                      Alternative: --lf, --logfile
                                      Mode: Standalone only
                                      Type: string - file name, optionally prefixed with the path
                                      Default: <not set>

        LogFileFlushTimeSpan=VALUE
                                      The time span in seconds when the logfile should be flushed in the storage
                                      Alternative: --lt, --logflushtimespan
                                      Mode: Standalone only
                                      Environment variable type: time span string {[d.]hh:mm:ss[.fffffff]}
                                      Alternative argument type: integer in seconds
                                      Default: {00:00:30}

        loglevel=Value
                                      The level for logs to pe persisted in the logfile
                                      Alternative: --ll --loglevel
                                      Mode: Standalone only
                                      Type: string enum - Fatal, Error, Warning, Information, Debug, Verbose
                                      Default: info

        EdgeHubConnectionString=VALUE
                                      An IoT Edge Device or IoT Edge module connection string to use,
                                      when deployed as module in IoT Edge, the environment variable
                                      is already set as part of the container deployment
                                      Alternative: --dc, --deviceconnectionstring
                                                   --ec, --edgehubconnectionstring
                                      Mode: Standalone and Orchestrated
                                      Type: connection string
                                      Default: <not set> <set by iotedge runtime>

        Transport=VALUE
                                      Protocol to use for upstream communication to edgeHub or IoTHub
                                      Alternative: --ih, --iothubprotocol
                                      Mode: Standalone and Orchestrated
                                      Type: string enum: Any, Amqp, Mqtt, AmqpOverTcp, AmqpOverWebsocket,
                                        MqttOverTcp, MqttOverWebsocket, Tcp, Websocket.
                                      Default: MqttOverTcp

        BypassCertVerification=VALUE
                                      Enables/disables bypass of certificate verification for upstream communication to edgeHub
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: boolean
                                      Default: false
    
        EnableMetrics=VALUE
                                      Enables/disables upstream metrics propagation
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: boolean
                                      Default: true

        DefaultPublishingInterval=VALUE
                                      Default value for the OPC UA publishing interval of OPC UA subscriptions
                                      created to an OPC UA server. This value is used when no explicit setting
                                      is configured.
                                      Alternative: --op, --opcpublishinginterval
                                      Mode: Standalone only
                                      Environment variable type: time span string {[d.]hh:mm:ss[.fffffff]}
                                      Alternative argument type: integer in milliseconds
                                      Default: {00:00:01} (1000)

        DefaultSamplingInterval=VALUE
                                      Default value for the OPC UA sampling interval of nodes to publish.
                                      This value is used when no explicit setting is configured.
                                      Alternative: --oi, --opcsamplinginterval
                                      Mode: Standalone only
                                      Environment variable type: time span string {[d.]hh:mm:ss[.fffffff]}
                                      Alternative argument type: integer in milliseconds
                                      Default: {00:00:01} (1000)

        DefaultQueueSize=VALUE
                                      Default setting value for the monitored item's queue size to be used when
                                      not explicitly specified in pn.json file
                                      Alternative: --mq, --monitoreditemqueuecapacity
                                      Mode: Standalone only
                                      Type: integer
                                      Default: 1

        DefaultHeartbeatInterval=VALUE
                                      Default value for the heartbeat interval setting of published nodes
                                      having no explicit setting for heartbeat interval.
                                      Alternative: --hb, --heartbeatinterval
                                      Mode: Standalone
                                      Environment variable type: time span string {[d.]hh:mm:ss[.fffffff]}
                                      Alternative argument type: integer in seconds
                                      Default: {00:00:00} meaning heartbeat is disabled

        MessageEncoding=VALUE
                                      The messaging encoding for outgoing telemetry.
                                      Alternative: --me, --messageencoding
                                      Mode: Standalone only
                                      Type: string enum - Json, Uadp
                                      Default: Json

        MessagingMode=VALUE
                                      The messaging mode for outgoing telemetry.
                                      Alternative: --mm, --messagingmode
                                      Mode: Standalone only
                                      Type: string enum - PubSub, Samples
                                      Default: Samples

        FetchOpcNodeDisplayName=VALUE
                                      Fetches the DisplayName for the nodes to be published from
                                      the OPC UA Server when not explicitly set in the configuration.
                                      Note: This has high impact on OPC Publisher startup performance.
                                      Alternative: --fd, --fetchdisplayname
                                      Mode: Standalone only
                                      Type: boolean
                                      Default: false

        FullFeaturedMessage=VALUE
                                      The full featured mode for messages (all fields filled in the telemetry).
                                      Default is 'false' for legacy compatibility.
                                      Alternative: --fm, --fullfeaturedmessage
                                      Mode: Standalone only
                                      Type:boolean
                                      Default: false

        BatchSize=VALUE
                                      The number of incoming OPC UA data change messages to be cached for batching.
                                      When BatchSize is 1 or TriggerInterval is set to 0 batching is disabled.
                                      Alternative: --bs, --batchsize
                                      Mode: Standalone and Orchestrated
                                      Type: integer
                                      Default: 50

        BatchTriggerInterval=VALUE
                                      The batching trigger interval.
                                      When BatchSize is 1 or TriggerInterval is set to 0 batching is disabled.
                                      Alternative: --si, --iothubsendinterval
                                      Mode: Standalone and Orchestrated
                                      Environment variable type: time span string {[d.]hh:mm:ss[.fffffff]}
                                      Alternative argument type: integer in seconds
                                      Default: {00:00:10}

        IoTHubMaxMessageSize=VALUE
                                      The maximum size of the (IoT D2C) telemetry message.
                                      Alternative: --ms, --iothubmessagesize
                                      Mode: Standalone and Orchestrated
                                      Type: integer
                                      Default: 0

        DiagnosticsInterval=VALUE
                                      Shows publisher diagnostic info at the specified interval in seconds
                                      (need log level info). -1 disables remote diagnostic log and
                                      diagnostic output
                                      Alternative: --di, --diagnosticsinterval
                                      Mode: Standalone only
                                      Environment variable type: time span string {[d.]hh:mm:ss[.fffffff]}
                                      Alternative argument type: integer in seconds
                                      Default: {00:00:60}

        LegacyCompatibility=VALUE
                                      Forces the Publisher to operate in 2.5 legacy mode, using
                                      `"application/opcua+uajson"` for `ContentType` on the IoT Hub
                                      Telemetry message.
                                      Alternative: --lc, --legacycompatibility
                                      Mode: Standalone only
                                      Type: boolean
                                      Default: false

        PublishedNodesSchemaFile=VALUE
                                      The validation schema filename for published nodes file.
                                      Alternative: --pfs, --publishfileschema
                                      Mode: Standalone only
                                      Type: string
                                      Default: <not set>

        MaxNodesPerDataSet=VALUE
                                      Maximum number of nodes within a DataSet/Subscription.
                                      When more nodes than this value are configured for a
                                      DataSetWriter, they will be added in a separate DataSet/Subscription.
                                      Alternative: N/A
                                      Mode: Standalone only
                                      Type: integer
                                      Default: 1000

        ApplicationName=VALUE
                                      OPC UA Client Application Config - Application name as per
                                      OPC UA definition. This is used for authentication during communication
                                      init handshake and as part of own certificate validation.
                                      Alternative: --an, --appname
                                      Mode: Standalone and Orchestrated
                                      Type: string
                                      Default: "Microsoft.Azure.IIoT"

        ApplicationUri=VALUE
                                      OPC UA Client Application Config - Application URI as per
                                      OPC UA definition.
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: string
                                      Default: $"urn:localhost:{ApplicationName}:microsoft:"

        ProductUri=VALUE
                                      OPC UA Client Application Config - Product URI as per
                                      OPC UA definition.
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: string
                                      Default: "https://www.github.com/Azure/Industrial-IoT"

        DefaultSessionTimeout=VALUE
                                      OPC UA Client Application Config - Session timeout in seconds
                                      as per OPC UA definition.
                                      Alternative: --ct --createsessiontimeout
                                      Mode: Standalone and Orchestrated
                                      Type: integer
                                      Default: 0, meaning <not set>

        MinSubscriptionLifetime=VALUE
                                      OPC UA Client Application Config - Minimum subscription lifetime in seconds
                                      as per OPC UA definition.
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: integer
                                      Default: 0, <not set>

        KeepAliveInterval=VALUE
                                      OPC UA Client Application Config - Keep alive interval in seconds
                                      as per OPC UA definition.
                                      Alternative: --ki, --keepaliveinterval
                                      Mode: Standalone and Orchestrated
                                      Type: integer milliseconds
                                      Default: 10,000 (10s)

        MaxKeepAliveCount=VALUE
                                      OPC UA Client Application Config - Maximum count of keep alive events
                                      as per OPC UA definition.
                                      Alternative: --kt, --keepalivethreshold
                                      Mode: Standalone and Orchestrated
                                      Type: integer
                                      Default: 50

        PkiRootPath=VALUE
                                      OPC UA Client Security Config - PKI certificate store root path
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: string
                                      Default: "pki"

        ApplicationCertificateStorePath=VALUE
                                      OPC UA Client Security Config - application's
                                      own certificate store path
                                      Alternative: --ap, --appcertstorepath
                                      Mode: Standalone and Orchestrated
                                      Type: string
                                      Default: $"{PkiRootPath}/own"

        ApplicationCertificateStoreType=VALUE
                                      OPC UA Client Security Config - application's
                                      own certificate store type
                                      Alternative: --at, --appcertstoretype
                                      Mode: Standalone and Orchestrated
                                      Type: enum string : Directory, X509Store
                                      Default: Directory

        ApplicationCertificateSubjectName=VALUE
                                      OPC UA Client Security Config - the subject name
                                      in the application's own certificate
                                      Alternative: --sn, --appcertsubjectname
                                      Mode: Standalone and Orchestrated
                                      Type: string
                                      Default: "CN=Microsoft.Azure.IIoT, C=DE, S=Bav, O=Microsoft, DC=localhost"

        TrustedIssuerCertificatesPath=VALUE
                                      OPC UA Client Security Config - trusted certificate issuer
                                      store path
                                      Alternative: --ip, --issuercertstorepath
                                      Mode: Standalone and Orchestrated
                                      Type: string
                                      Default: $"{PkiRootPath}/issuers"

        TrustedIssuerCertificatesType=VALUE
                                      OPC UA Client Security Config - trusted issuer certificates
                                      store type
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: enum string : Directory, X509Store
                                      Default: Directory

        TrustedPeerCertificatesPath=VALUE
                                      OPC UA Client Security Config - trusted peer certificates
                                      store path
                                      Alternative: --tp, --trustedcertstorepath
                                      Mode: Standalone and Orchestrated
                                      Type: string
                                      Default: $"{PkiRootPath}/trusted"

        TrustedPeerCertificatesType=VALUE
                                      OPC UA Client Security Config - trusted peer certificates
                                      store type
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: enum string : Directory, X509Store
                                      Default: Directory

        RejectedCertificateStorePath=VALUE
                                      OPC UA Client Security Config - rejected certificates
                                      store path
                                      Alternative: --rp, --rejectedcertstorepath
                                      Mode: Standalone and Orchestrated
                                      Type: string
                                      Default: $"{PkiRootPath}/rejected"

        RejectedCertificateStoreType=VALUE
                                      OPC UA Client Security Config - rejected certificates
                                      store type
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: enum string : Directory, X509Store
                                      Default: Directory

        AutoAcceptUntrustedCertificates=VALUE
                                      OPC UA Client Security Config - auto accept untrusted
                                      peer certificates
                                      Alternative: --aa, --autoaccept
                                      Mode: Standalone and Orchestrated
                                      Type: boolean
                                      Default: false

        RejectSha1SignedCertificates=VALUE
                                      OPC UA Client Security Config - reject deprecated Sha1
                                      signed certificates
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: boolean
                                      Default: false

        MinimumCertificateKeySize=VALUE
                                      OPC UA Client Security Config - minimum accepted
                                      certificates key size
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: integer
                                      Default: 1024

        AddAppCertToTrustedStore=VALUE
                                      OPC UA Client Security Config - automatically copy own
                                      certificate's public key to the trusted certificate store
                                      Alternative: --tm, --trustmyself
                                      Mode: Standalone and Orchestrated
                                      Type: boolean
                                      Default: true

        SecurityTokenLifetime=VALUE
                                      OPC UA Stack Transport Secure Channel - Security token lifetime in milliseconds
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: integer (milliseconds)
                                      Default: 3,600,000 (1h)

        ChannelLifetime=VALUE
                                      OPC UA Stack Transport Secure Channel - Channel lifetime in milliseconds
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: integer (milliseconds)
                                      Default: 300,000 (5 min)

        MaxBufferSize=VALUE
                                      OPC UA Stack Transport Secure Channel - Max buffer size
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: integer
                                      Default: 65,535 (64KB -1)

        MaxMessageSize=VALUE
                                      OPC UA Stack Transport Secure Channel - Max message size
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: integer
                                      Default: 4,194,304 (4 MB)

        MaxArrayLength=VALUE
                                      OPC UA Stack Transport Secure Channel - Max array length
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: integer
                                      Default: 65,535 (64KB - 1)

        MaxByteStringLength=VALUE
                                      OPC UA Stack Transport Secure Channel - Max byte string length
                                      Alternative: N/A
                                      Mode: Standalone and Orchestrated
                                      Type: integer
                                      Default: 1,048,576 (1MB);

        OperationTimeout=VALUE
                                      OPC UA Stack Transport Secure Channel - OPC UA Service call
                                      operation timeout
                                      Alternative: --ot, --operationtimeout
                                      Mode: Standalone and Orchestrated
                                      Type: integer (milliseconds)
                                      Default: 120,000 (2 min)

        MaxStringLength=VALUE
                                      OPC UA Stack Transport Secure Channel - Maximum length of a string
                                      that can be send/received over the OPC UA Secure channel
                                      Alternative: --ol, --opcmaxstringlen
                                      Mode: Standalone and Orchestrated
                                      Type: integer
                                      Default: 130,816 (128KB - 256)

        RuntimeStateReporting=VALUE
                                      Enables reporting of OPC Publisher restarts.
                                      Alternative: --rs, --runtimestatereporting
                                      Mode: Standalone
                                      Type: boolean
                                      Default: false

        EnableRoutingInfo=VALUE
                                      Adds the routing info to telemetry messages. The name of the property is 
                                      `$$RoutingInfo` and the value is the `DataSetWriterGroup` for that particular message.
                                      When the `DataSetWriterGroup` is not configured, the `$$RoutingInfo` property will
                                      not be added to the message even if this argument is set. 
                                      Alternative: --ri, --enableroutinginfo
                                      Mode: Standalone
                                      Type: boolean
                                      Default: false
```

## Next steps
Further resources can be found in the GitHub repositories:

> [!div class="nextstepaction"]
> [OPC Publisher GitHub repository](https://github.com/Azure/Industrial-IoT)

> [!div class="nextstepaction"]
> [IIoT Platform GitHub repository](https://github.com/Azure/iot-edge-opc-publisher)
