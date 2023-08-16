---
title: Receive real-time telemetry - Azure Orbital
description: Learn how to receive real-time telemetry during contacts.
author: hrshelar
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 07/12/2022
ms.author: mikailasmith
---

# Receive real-time telemetry

An Azure Orbital Ground station emits telemetry events that can be used to analyze the ground station operation during a contact. You can configure your contact profile to send telemetry events to Azure Event Hubs. The steps in this article describe how to create and sent events to Event Hubs.

## Configure Event Hubs

1. In your subscription, go to Resource Provider settings and register Microsoft.Orbital as a provider
2. Create an Azure Event Hubs in your subscription.

> [!Note]
> Choose Public access for connectivity access to the Eventhubs. Private access or service endpoints is not supported.

3. From the left menu, select Access Control (IAM). Under Grant Access to this Resource, select Add Role Assignment
4. Select Azure Event Hubs Data Sender.
5. Assign access to 'User, group, or service principal'
6. Click '+ Select members'
7. Search for 'Azure Orbital Resource Provider' and press Select
8. Press Review + Assign. This action will grant Azure Orbital the rights to send telemetry into your event hub.
9. To confirm the newly added role assignment, go back to the Access Control (IAM) page and select View access to this resource.
Congrats! Orbital can now communicate with your hub.

## Enable telemetry for a contact profile in the Azure portal

Ensure the contact profile is configured as follows:

1. Choose a namespace using the Event Hubs Namespace dropdown.
1. Choose an instance using the Event Hubs Instance dropdown that appears after namespace selection.

## Schedule a contact

Schedule a contact using the Contact Profile that you previously configured for Telemetry.

Once the contact begins, you should begin seeing data in your Event Hubs soon after.

## Verifying telemetry data

You can verify both the presence and content of incoming telemetry data multiple ways.

### Portal: Event Hubs Capture

To verify that events are being received in your Event Hubs, you can check the graphs present on the Event Hubs namespace Overview page. This view shows data across all Event Hubs instances within a namespace. You can navigate to the Overview page of a specific instance to see the graphs for that instance.

### Verify content of telemetry data

You can enable Event Hubs Capture feature that will automatically deliver the telemetry data to an Azure Blob storage account of your choosing.
Follow the [instructions to enable Capture](../event-hubs/event-hubs-capture-enable-through-portal.md). Once enabled, you can check your container and view/download the data.

## Event Hubs consumer

Code: Event Hubs Consumer. 
Event Hubs documentation provides guidance on how to write simple consumer apps to receive events from your Event Hubs:
- [Python](../event-hubs/event-hubs-python-get-started-send.md)
- [.NET](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)
- [Java](../event-hubs/event-hubs-java-get-started-send.md)
- [JavaScript](../event-hubs/event-hubs-node-get-started-send.md)

## Understanding telemetry points

The ground station provides telemetry using Avro as a schema. The schema is below:

```json
{
  "namespace": "EventSchema",
  "name": "TelemetryEventSchema",
  "type": "record",
  "fields": [
    {
      "name": "version",
      "type": [ "null", "string" ]
    },
    {
      "name": "contactId",
      "type": [ "null", "string" ]
    },
    {
      "name": "contactPlatformIdentifier",
      "type": [ "null", "string" ]
    },
    {
      "name": "gpsTime",
      "type": [ "null", "double" ]
    },
    {
      "name": "utcTime",
      "type": "string"
    },
    {
      "name": "azimuthDecimalDegrees",
      "type": [ "null", "double" ]
    },
    {
      "name": "elevationDecimalDegrees",
      "type": [ "null", "double" ]
    },
    {
      "name": "contactTleLine1",
      "type": "string"
    },
    {
      "name": "contactTleLine2",
      "type": "string"
    },
    {
      "name": "antennaType",
      "type": {
        "name": "antennaTypeEnum",
        "type": "enum",
        "symbols": [
          "Microsoft",
          "KSAT"
        ]
      }
    },
    {
      "name": "links",
      "type": [
        "null",
        {
          "type": "array",
          "items": {
            "name": "antennaLink",
            "type": "record",
            "fields": [
              {
                "name": "direction",
                "type": {
                  "name": "directionEnum",
                  "type": "enum",
                  "symbols": [
                    "Uplink",
                    "Downlink"
                  ]
                }
              },
              {
                "name": "polarization",
                "type": {
                  "name": "polarizationEnum",
                  "type": "enum",
                  "symbols": [
                    "RHCP",
                    "LHCP",
                    "linearVertical",
                    "linearHorizontal"
                  ]
                }
              },
              {
                "name": "uplinkEnabled",
                "type": [ "null", "boolean" ]
              },
              {
                "name": "channels",
                "type": [
                  "null",
                  {
                    "type": "array",
                    "items": {
                      "name": "antennaLinkChannel",
                      "type": "record",
                      "fields": [
                        {
                          "name": "endpointName",
                          "type": "string"
                        },
                        {
                          "name": "inputEbN0InDb",
                          "type": [ "null", "double" ]
                        },
                        {
                          "name": "inputEsN0InDb",
                          "type": [ "null", "double" ]
                        },
                        {
                          "name": "inputRfPowerDbm",
                          "type": [ "null", "double" ]
                        },
                        {
                          "name": "modemLockStatus",
                          "type": [
                            "null",
                            {
                              "name": "modemLockStatusEnum",
                              "type": "enum",
                              "symbols": [
                                "Unlocked",
                                "Locked"
                              ]
                            }
                          ]
                        },
                        {
                          "name": "commandsSent",
                          "type": [ "null", "double" ]
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    }
  ]
}
```
| **Telemetry Point** | **Source Device / Point** | **Possible Values** | **Definition** |
| :------------------ | :------------------------ | :------------------ | :------------- |
| version | Manually set internally | | Release version of the telemetry |
| contactID	| Contact resource |	|	Identification number of the contact |
| contactPlatformIdentifier |	Contact resource	| | |	
| gpsTime |	Coversion of utcTime | | Time in GPS time that the customer telemetry message was generated. |
| utcTime	| Current time | | Time in UTC time that the customer telemetry message was generated. |
| azimuthDecimalDegrees |	ACU: AntennaAzimuth |	|	Antenna's azimuth in decimal degrees. |
| elevationDecimalDegrees	| ACU: AntennaElevation	| |	Antenna's elevation in decimal degrees. |
| contactTleLine1	| ACU: Satellite[0].Model.Value	| • String: TLE <br> • "Empty TLE Line 1" if metric is null | First line of the TLE used for the contact. |
| contactTLeLine2	| ACU: Satellite[0].Model.Value	| • String: TLE <br> • "Empty TLE Line 2" if metric is null | Second line of the TLE used for the contact. |
| antennaType	| Respective 1P/3P telemetry builders set this value | MICROSOFT, KSAT, VIASAT | Antenna network used for the contact. |
| direction |	Contact profile link | Uplink, Downlink | Direction of the link used for the contact. |
| polarization | Contact profile link | RHCP, LHCP, DualRhcpLhcp, LinearVertical, LinearHorizontal | Polarization of the link used for the contact. |
| uplinkEnabled	| ACU: SBandCurrent or UHFTotalCurrent | • NULL (Invalid CenterFrequencyMhz or Downlink direction) <br> • False (Bands other than S and UHF or Amp Current < Threshold) <br> • True (S/UHF-band, Uplink, Amp Current > Threshold) | Idicates whether uplink was enabled for the contact. |
| endpointName | Contact profile link channel	| |	Name of the endpoint used for the contact. |
| inputEbN0InDb |	Modem: measuredEbN0	| • NULL (Modem model other than QRadio or QRx) <br> • Double: Input EbN0 | Input energy per bit to noise power spectral density in dB. |
| inputEsN0InDb	| Not used in 1P telemetry | NULL (Not used in 1P telemetry) | Input energy per symbol to noise power spectral density in dB. |
| inputRfPowerDbm |	Digitizer: inputRfPower	| • NULL (Uplink) <br> • 0 (Digitizer driver other than SNNB or SNWB) <br> • Double: Input Rf Power | Input RF power in dBm. |
| modemLockStatus	| Modem: carrierLockState	| • NULL (Modem model other than QRadio or QRx; couldn’t parse lock status Enum) <br> • Empty string (if metric reading was null) <br> • String: Lock status | Confirmation that the modem was locked. |
| commandsSent | Modem: commandsSent | • 0 (if not Uplink and QRadio) <br> • Double: # of commands sent | Confirmation that commands were sent during the contact. |

## Changelog
2023-06-05 - Updatd schema to show metrics under channels instead of links.

## Next steps

- [Event Hubs using Python Getting Started](../event-hubs/event-hubs-python-get-started-send.md)
- [Azure Event Hubs client library for Python code samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/eventhub/azure-eventhub/samples/async_samples)
