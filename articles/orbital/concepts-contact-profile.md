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

# Ground station contact profile

The contact profile resource stores pass requirements such as links and endpoint details. Use this resource along with the spacecraft resource during contact scheduling to view and schedule available passes.

You can create many contact profiles to represent different types of passes depending on your mission operations. For example, you can create a contact profile for a command and control pass or a contact profile for a downlink-only pass. 

These resources are mutable and do not undergo an authorization process like the spacecraft resources do. One contact profile can be used with many spacecraft resources. 

See [how to configure a contact profile](contact-profile.md) for a full list of parameters.

## Prerequisites 

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Subnet that is created in the relevant VNET and resource group. See [prepare network for Azure Orbital Ground Station integration](prepare-network.md).

## Creating a contact profile 

Follow these steps to [create a contact profile](contact-profile.md).

## Adjusting pass parameters

Specify a minimum pass time to ensure passes are a certain duration. Specify a minimum elevation to ensure passes are above a certain elevation.

The minimum pass time and minimum elevation parameters are used by Azure Orbital Ground Station during the contact scheduling. Avoid changing these on a pass-by-pass basis and instead create multiple contact profiles if you require flexibility.

## Understanding links and channels

A whole band, unique in direction and polarity, is called a link. Channels, which are children under links, specify the center frequency, bandwidth, and endpoints. Typically there is only one channel per link, but some applications require multiple channels per link. 

You can specify EIRP and G/T requirements for each link. EIRP applies to uplinks and G/T applies to downlinks. You can provide a name for each link and channel to keep track of these properties. Each channel has a modem associated with it. Follow the steps in [how to setup software modem](modem-chain.md) to understand the options.

Refer to the example below to understand how to specify an RHCP channel and an LHCP channel if your mission requires dual-polarization on downlink.  

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

## Modifying or deleting a contact profile

You can modify or delete the contact profile via the [Azure portal](https://aka.ms/orbital/portal) or [Azure Orbital Ground Station API](/rest/api/orbital/).

## Configuring a contact profile for applicable partner ground stations

After onboarding with a partner ground station network, you receive a name that identifies your configuration file. When [creating your contact profile](contact-profile.md#create-a-contact-profile-resource), add this configuration name to your link in the 'Third-Party Configuration" parameter. This links your contact profile to the partner network.

## Next steps

- [Schedule a contact](schedule-contact.md)
- [Configure the RF chain](modem-chain.md)
- [Update the Spacecraft TLE](update-tle.md)
