---
title: Azure Orbital Ground Station - Contact profile resource
description: Learn more about the contact profile resource, including how to create, modify, and delete the profile.
author: hrshelar
ms.service: orbital
ms.topic: conceptual
ms.custom: ga
ms.date: 07/13/2022
ms.author: hrshelar
#Customer intent: As a satellite operator or user, I want to understand how to use the contact profile so that I can take passes using Azure Orbital Ground Station.
---

# Ground station contact profile resource

The contact profile resource stores pass requirements such as links and endpoint details. Use this resource along with the spacecraft resource during contact scheduling to view and schedule available passes.

You can create many contact profiles to represent different types of passes depending on your mission operations. For example, you can create a contact profile for a command and control pass or a contact profile for a downlink-only pass. These resources are mutable and don't undergo an authorization process like spacecraft resources do. One contact profile can be used with many spacecraft resources.

## Understand links and channels

A whole band, unique in direction and polarity, is called a link. Channels, which are children under links, specify the center frequency, bandwidth, and endpoints. Typically there's only one channel per link, but some applications require multiple channels per link. 

You can specify EIRP and G/T requirements for each link. EIRP applies to uplinks and G/T applies to downlinks. You can provide a name for each link and channel to keep track of these properties. Each channel has a modem associated with it. Follow the steps in [how to set up a software modem](modem-chain.md) to understand the options.

## Contact profile parameters

| **Parameter** | **Description** |
| --- | --- |
| **Pass parameters** | |
| Minimum viable contact duration | The minimum duration of a contact in ISO 8601 format. Acts as a prerequisite to show available time slots to communicate with your spacecraft. If an available time window is less than this time, it won't be in the list of available options. Avoid changing on a pass-by-pass basis and instead create multiple contact profiles if you require flexibility. |
| Minimum elevation | The minimum elevation of a contact, after acquisition of signal (AOS), in decimal degrees. Acts as a prerequisite to show available time slots to communicate with your spacecraft. Using a higher value might reduce the duration of the contact. Avoid changing on a pass-by-pass basis and instead create multiple contact profiles if you require flexibility. |
| Auto track configuration | The frequency band to be used for autotracking during the contact (X band, S band, or Disabled). |
| Event Hubs Namespace and Instance | The Event Hubs namespace/instance to send telemetry data of your contacts. |
| **Network Configuration** | |
| Virtual Network | The virtual network used for a contact. This VNET must be in the same region as the contact profile. |
| Subnet | The subnet used for a contact. This subnet must be within the above VNET, be delegated to the Microsoft.Orbital service, and have a minimum address prefix of size /24. |
| Third-party configuration | Mission configuration and provider name associated with a partner ground network. |
| **Links** | |
| Direction | Direction of the link (uplink or downlink). |
| Gain/Temperature | Required gain to noise temperature in dB/K. |
| EIRP in dBW | Required effective isotropic radiated power in dBW. |
| Polarization | Link polarization (RHCP, LHCP, Dual, or Linear Vertical). |
| **Channels** | |
| Center Frequency | The channel center frequency in MHz. |
| Bandwidth | The channel bandwidth in MHz. |
| Endpoint | The name, IP address, port, and protocol of the data delivery endpoint. |
| Demodulation Configuration | Copy of the modem configuration file such as Kratos QRadio or Kratos QuantumRx. Only valid for downlink directions. If provided, the modem connects to the customer endpoint and sends demodulated data instead of a VITA.49 stream. |
| Modulation Configuration | Copy of the modem configuration file such as Kratos QRadio. Only valid for uplink directions. If provided, the modem connects to the customer endpoint and accepts commands from the customer instead of a VITA.49 stream. |

## Example of dual-polarization downlink contact profile

Refer to the example below to understand how to specify an RHCP channel and an LHCP channel if your mission requires dual-polarization on downlink. To find this information about your contact profile, navigate to the contact profile resource overview in Azure portal and click 'JSON view.'

```json
{
  "location": "eastus2",
  "tags": null,
  "id": "/subscriptions/c1be1141-a7c9-4aac-9608-3c2e2f1152c3/resourceGroups/contoso-Rgp/providers/Microsoft.Orbital/contactProfiles/CONTOSO-CP",
  "name": "CONTOSO-CP",
  "type": "Microsoft.Orbital/contactProfiles",
  "properties": {
    "provisioningState": "Succeeded",
    "minimumViableContactDuration": "PT1M",
    "minimumElevationDegrees": 5,
    "autoTrackingConfiguration": "disabled",
    "eventHubUri": "/subscriptions/c1be1141-a7c9-4aac-9608-3c2e2f1152c3/resourceGroups/contoso-Rgp/providers/Microsoft.EventHub/namespaces/contosoHub/eventhubs/contosoHub",
    "networkConfiguration": {
      "subnetId": "/subscriptions/c1be1141-a7c9-4aac-9608-3c2e2f1152c3/resourceGroups/contoso-Rgp/providers/Microsoft.Network/virtualNetworks/contoso-vnet/subnets/orbital-delegated-subnet"
    },
    "links": [
      {
        "name": "contoso-downlink-rhcp",
        "polarization": "RHCP",
        "direction": "downlink",
        "gainOverTemperature": 25,
        "eirpdBW": 0,
        "channels": [
          {
            "name": "contoso-downlink-channel-rhcp",
            "centerFrequencyMHz": 8160,
            "bandwidthMHz": 15,
            "endPoint": {
              "ipAddress": "10.1.0.5",
              "endPointName": "ContosoTest_Downlink_RHCP",
              "port": "51103",
              "protocol": "UDP"
            },
            "modulationConfiguration": null,
            "demodulationConfiguration": null,
            "encodingConfiguration": null,
            "decodingConfiguration": null
          }
        ]
      }
      {
        "name": "contoso-downlink-lhcp",
        "polarization": "LHCP",
        "direction": "downlink",
        "gainOverTemperature": 25,
        "eirpdBW": 0,
        "channels": [
          {
            "name": "contoso-downlink-channel-lhcp",
            "centerFrequencyMHz": 8160,
            "bandwidthMHz": 15,
            "endPoint": {
              "ipAddress": "10.1.0.5",
              "endPointName": "ContosoTest_Downlink_LHCP",
              "port": "51104",
              "protocol": "UDP"
            },
            "modulationConfiguration": null,
            "demodulationConfiguration": null,
            "encodingConfiguration": null,
            "decodingConfiguration": null
          }
        ]
      }
    ]
  }
}
```
## Create a contact profile 

Follow these instructions to create a contact profile [via the Azure portal](contact-profile.md) or [use the Azure Orbital Ground Station API](/rest/api/orbital//azureorbitalgroundstation/contact-profiles/create-or-update/).

## Modify or delete a contact profile

To modify or delete a contact profile via the [Azure portal](https://aka.ms/orbital/portal), navigate to the contact profile resource. 
- To modify minimum viable contact duration, minimum elevation, auto tracking, or events hubs telemetry, click 'Overview' on the left panel then click 'Edit properties.'
- To edit links and channels, click 'Links' under 'Configurations' on the left panel then click 'Edit link' on the desired link.
- To edit third-party configurations, click 'Third-Party Configurations' under 'Configurations' on the left panel then click 'Edit' on the desired configuration.
- To delete a contact profile, click 'Overview' on the left panel then click 'Delete.'

You can also use the Azure Orbital Ground Station API to [modify](/rest/api/orbital/azureorbitalgroundstation/contact-profiles/create-or-update) or [delete](/rest/api/orbital/azureorbitalgroundstation/contact-profiles/delete) a contact profile.

## Configure a contact profile for applicable partner ground stations

After onboarding with a partner ground station network, you receive a name that identifies your configuration file. When [creating your contact profile](contact-profile.md), add this configuration name to your link in the 'Third-Party Configuration" parameter. This links your contact profile to the partner network.

## Next steps

- [Schedule a contact](schedule-contact.md)
- [Configure the RF chain](modem-chain.md)
- [Update the Spacecraft TLE](update-tle.md)
