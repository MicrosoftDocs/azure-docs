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

# Receive real-time antenna telemetry

Azure Orbital Ground station emits antenna telemetry events that can be used to analyze ground station operation during a contact. You can configure your contact profile to send telemetry events to [Azure Event Hubs](../event-hubs/event-hubs-about.md).. 

In this guide, you'll learn how to:

> [!div class="checklist"]
> * Configure Azure Event Hubs for Azure Orbital Ground Station
> * Enable telemetry in your contact profile.
> * Verify content of telemetry data
> * Understand telemetry points

## Configure Event Hubs

1. In your subscription, go to **resource providers** in settings. Search for **Microsoft.Orbital** and register it as a provider.
2. [Create an Azure Event Hubs namespace](../../articles/event-hubs/event-hubs-create.md#create-an-event-hubs-namespace) and an [event hub](../../articles/event-hubs/event-hubs-create.md#create-an-event-hub) in your subscription.

> [!Note]
> Choose Public access for connectivity access to the Eventhubs. Private access or service endpoints is not supported.

3. From the left menu, select **Access control (IAM)**. Under 'Grant access to this resource,' select **Add role assignment**.

> [!Note]
> To assign Azure roles, you must have:
> `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](../../articles/role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../../articles/role-based-access-control/built-in-roles.md#owner)

4. Under the **Role** tab, search for and select **Azure Event Hubs Data Sender**. Click **Next**.
5. Under the **Members** tab, assign access to **User, group, or service principal**.
6. Click **+ Select members**.
7. Search for **Azure Orbital Resource Provider** and click **Select**.
8. Click **Review + assign**. This action grants Azure Orbital Ground Station the rights to send telemetry into your event hub.
9. To confirm the newly added role assignment, go back to the Access Control (IAM) page and select **View access to this resource**. Azure Orbital Resource Provider should be under **Azure Event Hubs Data Sender**.

## Enable Event Hubs telemetry for a contact profile

Configure a [contact profile](contact-profile.md) as follows:

1. Choose a namespace using the Event Hubs Namespace dropdown.
1. Choose an instance using the Event Hubs Instance dropdown that appears after namespace selection.

You can update the settings of an existing contact profile by 

## Verify antenna telemetry data from a contact

[Schedule contacts](schedule-contact.md) using the contact profile that you previously configured for Event Hubs telemetry. Once a contact begins, you should begin seeing data in your Event Hubs soon after.

You can verify both the presence and content of incoming telemetry data multiple ways.

### Event Hubs namespace dashboard

To verify that events are being received in your Event Hubs, you can check the graphs present on the overview page of your Event Hubs namespace within your resource group. This view shows data across all Event Hubs instances within a namespace. You can navigate to the overview page of a specific Event Hub instance in your resource group to see the graphs for that instance.

### Deliver antenna telemetry data to a storage account

You can enable the Event Hubs Capture feature to automatically deliver the telemetry data to an Azure Blob storage account of your choosing.
Follow the [instructions to enable Capture](../../articles/event-hubs/event-hubs-capture-enable-through-portal.md#enable-capture-when-you-create-an-event-hub) and [capture data to Azure storage](../../articles/event-hubs/event-hubs-capture-enable-through-portal.md#capture-data-to-azure-storage). Once enabled, you can check your container and view/download the data.

## Understand telemetry points

### Current telemetry schema version: 4.0
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
      "name": "groundStationName",
      "type": [ "null", "string" ]
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
      "name": "antennaId",
      "type": [ "null", "string" ]
    },
    {
      "name": "spacecraftName",
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
                "name": "name",
                "type": [ "null", "string" ]
              },
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
                          "name": "name",
                          "type": [ "null", "string" ]
                        },
                        {
                          "name": "modemName",
                          "type": [ "null", "string" ]
                        },
                        {
                          "name": "digitizerName",
                          "type": [ "null", "string" ]
                        },
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
                          "name": "outputRfPowerDbm",
                          "type": [ "null", "double" ]
                        },
                        {
                          "name": "packetRate",
                          "type": [ "null", "double" ]
                        },
                        {
                          "name": "gapCount",
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
The following table provides the source device/point, possible values, and definition of each telemetry point.

| **Telemetry Point** | **Source Device/Point** | **Possible Values** | **Definition** |
| :------------------ | :---------------------- | :------------------ | :------------- |
| version | Manually set internally | | Release version of the telemetry |
| contactID	| Contact resource |	|	Identification number of the contact |
| contactPlatformIdentifier |	Contact resource	| | |	
| groundStationName | Contact resource | | Name of groundstation |
| antennaType	| Respective Microsoft / partner telemetry builders set this value | MICROSOFT, KSAT, VIASAT | Antenna network used for the contact. |
| antennaId | Contact resource | | Human-readable name of antenna ID |
| spacecraftName | Parsed from Contact Platform Identifier | | Name of spacecraft |
| gpsTime |	Coversion of utcTime | | Time in GPS time that the customer telemetry message was generated. |
| utcTime	| Current time | | Time in UTC time that the customer telemetry message was generated. |
| azimuthDecimalDegrees |	ACU: AntennaAzimuth |	|	Antenna's azimuth in decimal degrees. |
| elevationDecimalDegrees	| ACU: AntennaElevation	| |	Antenna's elevation in decimal degrees. |
| contactTleLine1	| ACU: Satellite[0].Model.Value	| String of TLE Line 1 | First line of the TLE used for the contact. |
| contactTLeLine2	| ACU: Satellite[0].Model.Value	| String of TLE Line 2 | Second line of the TLE used for the contact. |
| name [Link-level] | Contact profile link | | Name of the link |
| direction |	Contact profile link | Uplink, Downlink | Direction of the link used for the contact. |
| polarization | Contact profile link | RHCP, LHCP, DualRhcpLhcp, LinearVertical, LinearHorizontal | Polarization of the link used for the contact. |
| uplinkEnabled	| ACU: SBandCurrent or UHFTotalCurrent | • NULL (Invalid CenterFrequencyMhz or Downlink direction) <br> • False (Bands other than S and UHF or Amp Current < Threshold) <br> • True (S/UHF-band, Uplink, Amp Current > Threshold) | Indicates whether uplink was enabled for the contact. |
| name [Channel-level] | Contact profile link channel | | Name of the channel |
| modemName | Modem | | Name of modem device |
| digitizerName | Digitizer | | Name of digitizer device |
| endpointName | Contact profile link channel	| |	Name of the endpoint used for the contact. |
| inputEbN0InDb |	Modem: measuredEbN0	| • NULL (Modem model other than QRadio or QRx) <br> • Double: Input EbN0 | Input energy per bit to noise power spectral density in dB. |
| inputEsN0InDb	| Not used in Microsoft antenna telemetry | NULL (Not used in Microsoft antenna telemetry) | Input energy per symbol to noise power spectral density in dB. |
| inputRfPowerDbm |	Digitizer: inputRfPower	| • NULL (Uplink or Digitizer driver other than SNNB or SNWB) <br> • Double: Input Rf Power | Input RF power in dBm. |
| outputRfPowerDbm | Digitizer: outputRfPower | • NULL (Downlink or Digitizer driver other than SNNB or SNWB) <br> • Double: Output Rf Power | Ouput RF power in dBm. |
| outputPacketRate | Digitizer: rfOutputStream[0].measuredPacketRate | • NULL (Downlink or Digitizer driver other than SNNB or SNWB) <br> • Double: Output Packet Rate | Measured packet rate for Uplink |
| gapCount | Digitizer: rfOutputStream[0].gapCount | • NULL (Downlink or Digitizer driver other than SNNB or SNWB) <br> • Double: Gap count | Packet gap count for Uplink |
| modemLockStatus	| Modem: carrierLockState	| • NULL (Modem model other than QRadio or QRx; couldn’t parse lock status Enum) <br> • Empty string (if metric reading was null) <br> • String: Lock status | Confirmation that the modem was locked. |
| commandsSent | Modem: commandsSent | • NULL (if not Uplink and QRadio) <br> • Double: # of commands sent | Confirmation that commands were sent during the contact. |

## Event consumers

You can write simple consumer apps to receive events from your Event Hubs using [event consumers](../../articles/event-hubs/event-hubs-features.md#event-consumers). Refer to the following documentation to learn how to send and receive events Event Hubs in various languages: 
- [Python](../event-hubs/event-hubs-python-get-started-send.md)
- [.NET](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)
- [Java](../event-hubs/event-hubs-java-get-started-send.md)
- [JavaScript](../event-hubs/event-hubs-node-get-started-send.md)

## Changelog
2023-10-03 - Introduce version 4.0. Updated schema to include uplink packet metrics and names of infrastructure in use (ground station, antenna, spacecraft, modem, digitizer, link, channel) <br>
2023-06-05 - Updated schema to show metrics under channels instead of links.

## Next steps

- [Event Hubs using Python Getting Started](../event-hubs/event-hubs-python-get-started-send.md)
- [Azure Event Hubs client library for Python code samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/eventhub/azure-eventhub/samples/async_samples)
