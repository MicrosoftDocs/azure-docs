---
title: Microsoft OPC Publisher Telemetry Format
description: This article provides an overview of the configuration settings file
author: hansgschossmann
ms.author: johanng
ms.service: industrial-iot
ms.topic: reference
ms.date: 3/22/2021
---
# OPC Publisher Telemetry Format

OPC Publisher version 2.6 and above support standardized OPC UA PubSub JSON format as specified in [part 14 of the OPC UA specification](https://opcfoundation.org/developer-tools/specifications-unified-architecture/part-14-pubsub/):
```
{
  "MessageId": "18",
  "MessageType": "ua-data",
  "PublisherId": "uat46f9f8f82fd5c1b42a7de31b5dc2c11ef418a62f",
  "DataSetClassId": "78c4e91c-82cb-444e-a8e0-6bbacc9a946d",
  "Messages": [
    {
      "DataSetWriterId": "uat46f9f8f82fd5c1b42a7de31b5dc2c11ef418a62f",
      "SequenceNumber": 18,
      "MetaDataVersion": {
        "MajorVersion": 1,
        "MinorVersion": 1
    },
    "Timestamp": "2020-03-24T23:30:56.9597112Z",
    "Status": null,
    "Payload": {
      "http://test.org/UA/Data/#i=10845": {
        "Value": 99,
          "SourceTimestamp": "2020-03-24T23:30:55.9891469Z",
          "ServerTimestamp": "2020-03-24T23:30:55.9891469Z"
        },
        "http://test.org/UA/Data/#i=10846": {
          "Value": 251,
          "SourceTimestamp": "2020-03-24T23:30:55.9891469Z",
          "ServerTimestamp": "2020-03-24T23:30:55.9891469Z"
        }
      }
    }
  ]
}
```

In addition, all versions of the OPC Publisher support a non-standardized and simple JSON telemetry format, which is compatible with [Azure Time Series Insights](https://azure.microsoft.com/services/time-series-insights/) and looks like this:
```
[
   {
      "EndpointUrl": "opc.tcp://192.168.178.3:49320/",
      "NodeId": "ns=2;s=Pump\\234754a-c63-b9601",
      "MonitoredItem": {
         "ApplicationUri": "urn:myfirstOPCServer"
      },
      "Value": {
         "Value": 973,
         "SourceTimestamp": "2020-11-30T07:21:31.2604024Z",
         "StatusCode": 0,
         "Status": "Good"
      }
  },
  {
      "EndpointUrl": "opc.tcp://192.168.178.4:49320/",
      "NodeId": "ns=2;s=Boiler\\234754a-c63-b9601",
      "MonitoredItem": {
         "ApplicationUri": "urn:mySecondOPCServer"
      },
      "Value": {
         "Value": 974,
         "SourceTimestamp": "2020-11-30T07:21:32.2625062Z",
         "StatusCode": 0,
         "Status": "Good"
      }
   }
]
```

## OPC Publisher Telemetry Configuration File Format

> [!NOTE]
> The telemetry configuration format has been deprecated. It's only available in version 2.5 or below.


```
    // The configuration settings file consists of two objects:
    // 1) The 'Defaults' object, which defines defaults for the telemetry configuration
    // 2) An array 'EndpointSpecific' of endpoint-specific configuration
    // Both objects are optional and if they are not specified, then OPC Publisher uses
    // its internal default configuration:
    //  {
    //      "NodeId": "i=2058",
    //      "ApplicationUri": "urn:myopcserver",
    //      "DisplayName": "CurrentTime",
    //      "Value": {
    //          "Value": "10.11.2017 14:03:17",
    //          "SourceTimestamp": "2017-11-10T14:03:17Z"
    //      }
    //  }

    // The 'Defaults' object in the sample below, are similar to what publisher is
    // using as its internal default telemetry configuration.
    {
        "Defaults": {
            // The first two properties ('EndpointUrl' and 'NodeId' are configuring data
            // taken from the OpcPublisher node configuration.
            "EndpointUrl": {

                // The following three properties can be used to configure the 'EndpointUrl'
                // property in the JSON message send by publisher to IoTHub.

                // Publish controls if the property should be part of the JSON message at all.
                "Publish": false,

                // Pattern is a regular expression, which is applied to the actual value of the
                // property (here 'EndpointUrl').
                // If this key is ommited (which is the default), then no regex matching is done
                // at all, which improves performance.
                // If the key is used you need to define groups in the regular expression.
                // Publisher applies the regular expression and then concatenates all groups
                // found and use the resulting string as the value in the JSON message to
                //sent to IoTHub.
                // This example mimics the default behaviour and defines a group,
                // which matches the conplete value:
                "Pattern": "(.*)",
                // Here some more exaples for 'Pattern' values and the generated result:
                // "Pattern": "i=(.*)"
                // defined for Defaults.NodeId.Pattern, will generate for the above sample
                // a 'NodeId' value of '2058'to be sent by publisher
                // "Pattern": "(i)=(.*)"
                // defined for Defaults.NodeId.Pattern, will generate for the above sample
                // a 'NodeId' value of 'i2058' to be sent by publisher

                // Name allows you to use a shorter string as property name in the JSON message
                // sent by publisher. By default the property name is unchanged and will be
                // here 'EndpointUrl'.
                // The 'Name' property can only be set in the 'Defaults' object to ensure
                // all messages from publisher sent to IoTHub have a similar layout.
                "Name": "EndpointUrl"

            },
            "NodeId": {
                "Publish": true,

                // If you set Defaults.NodeId.Name to "ni", then the "NodeId" key/value pair
                // (from the above example) will change to:
                //      "ni": "i=2058",
                "Name": "NodeId"
            },

            // The MonitoredItem object is configuring the data taken from the MonitoredItem
            // OPC UA object for published nodes.
            "MonitoredItem": {

                // If you set the Defaults.MonitoredItem.Flat to 'false', then a
                // 'MonitoredItem' object will appear, which contains 'ApplicationUri'
                // and 'DisplayNode' proerties:
                //      "NodeId": "i=2058",
                //      "MonitoredItem": {
                //          "ApplicationUri": "urn:myopcserver",
                //          "DisplayName": "CurrentTime",
                //      }
                // The 'Flat' property can only be used in the 'MonitoredItem' and
                // 'Value' objects of the 'Defaults' object and will be used
                // for all JSON messages sent by publisher.
                "Flat": true,

                "ApplicationUri": {
                    "Publish": true,
                    "Name": "ApplicationUri"
                },
                "DisplayName": {
                    "Publish": true,
                    "Name": "DisplayName"
                }
            },
            // The Value object is configuring the properties taken from the event object
            // the OPC UA stack provided in the value change notification event.
            "Value": {
                // If you set the Defaults.Value.Flat to 'true', then the 'Value'
                // object will disappear completely and the 'Value' and 'SourceTimestamp'
                // members won't be nested:
                //      "DisplayName": "CurrentTime",
                //      "Value": "10.11.2017 14:03:17",
                //      "SourceTimestamp": "2017-11-10T14:03:17Z"
                // The 'Flat' property can only be used for the 'MonitoredItem' and 'Value'
                // objects of the 'Defaults' object and will be used for all
                // messages sent by publisher.
                "Flat": false,

                "Value": {
                    "Publish": true,
                    "Name": "Value"
                },
                "SourceTimestamp": {
                    "Publish": true,
                    "Name": "SourceTimestamp"
                },
                // 'StatusCode' is the 32 bit OPC UA status code
                "StatusCode": {
                    "Publish": false,
                    "Name": "StatusCode"
                    // 'Pattern' is ignored for the 'StatusCode' value
                },
                // 'Status' is the symbolic name of 'StatusCode'
                "Status": {
                    "Publish": false,
                    "Name": "Status"
                }
            }
        },

        // The next object allows to configure 'Publish' and 'Pattern' for specific
        // endpoint URLs. Those will overwrite the ones specified in the 'Defaults' object
        // or the defaults used by publisher.
        // It is not allowed to specify 'Name' and 'Flat' properties in this object.
        "EndpointSpecific": [
            // The following shows how an endpoint-specific configuration can look like:
            {
                // 'ForEndpointUrl' allows to configure for which OPC UA server this
                // object applies and is a required property for all objects in the
                // 'EndpointSpecific' array.
                // The value of 'ForEndpointUrl' must be an 'EndpointUrl' configured in
                // the publishednodes.json confguration file.
                "ForEndpointUrl": "opc.tcp://<your_opcua_server>:<your_opcua_server_port>/<your_opcua_server_path>",
                "EndpointUrl": {
                    // We overwrite the default behaviour and publish the
                    // endpoint URL in this case.
                    "Publish": true,
                    // We are only interested in the URL part following the 'opc.tcp://' prefix
                    // and define a group matching this.
                    "Pattern": "opc.tcp://(.*)"
                },
                "NodeId": {
                    // We are not interested in the configured 'NodeId' value, 
                    // so we do not publish it.
                    "Publish": false
                    // No 'Pattern' key is specified here, so the 'NodeId' value will be
                    // taken as specified in the publishednodes configuration file.
                },
                "MonitoredItem": {
                    "ApplicationUri": {
                        // We already publish the endpoint URL, so we do not want
                        // the ApplicationUri of the MonitoredItem to be published.
                        "Publish": false
                    },
                    "DisplayName": {
                        "Publish": true
                    }
                },
                "Value": {
                    "Value": {
                        // The value of the node is important for us, everything else we
                        // are not interested in to keep the data ingest as small as possible.
                        "Publish": true
                    },
                    "SourceTimestamp": {
                        "Publish": false
                    },
                    "StatusCode": {
                        "Publish": false
                    },
                    "Status": {
                        "Publish": false
                    }
                }
            }
        ]
    }
```

## Next steps
Further resources can be found in the GitHub repositories:

> [!div class="nextstepaction"]
> [OPC Publisher GitHub repository](https://github.com/Azure/Industrial-IoT)

> [!div class="nextstepaction"]
> [IIoT Platform GitHub repository](https://github.com/Azure/iot-edge-opc-publisher)