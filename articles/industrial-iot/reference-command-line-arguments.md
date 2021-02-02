---
title: Microsoft OPC Publisher Command-line Arguments
description: This article provides an overview of the OPC Publisher Command-line Arguments
author: jehona-m
ms.author: jemorina
ms.service: industrial-iot
ms.topic: reference
ms.date: 12/08/2020
---

# Command-line Arguments

In the following, there are several command-line arguments described that can be used to set global settings for OPC Publisher.

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
> Command-line arguments overrule environment variable settings.
    
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
                                       comma-seperated strings supported)
      --tf, --addtrustedcertfile=VALUE
                                       adds the certificate file(s) to the applications
                                       trusted cert store passed in as base64 string (
                                       multiple comma-seperated filenames supported)
      --ib, --addissuercertbase64=VALUE
                                       adds the specified issuer certificate to the
                                       applications trusted issuer cert store passed in
                                       as base64 string (multiple comma-seperated strings supported)
      --if, --addissuercertfile=VALUE
                                       adds the specified issuer certificate file(s) to
                                       the applications trusted issuer cert store (
                                       multiple comma-seperated filenames supported)
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
                                       multiple comma-seperated thumbprints supported)
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
## Next steps
Further resources can be found in the GitHub repositories:

> [!div class="nextstepaction"]
> [OPC Publisher GitHub repository](https://github.com/Azure/Industrial-IoT)

> [!div class="nextstepaction"]
> [IIoT Platform GitHub repository](https://github.com/Azure/iot-edge-opc-publisher)