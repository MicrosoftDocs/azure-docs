---
title: Configure the modem chain - Azure Orbital
description: Learn more about how to configure modems.
author: hrshelar
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 08/30/2022
ms.author: hrshelar
#Customer intent: As a satellite operator or user, I want to understand how to use software modems to establish RF connections with my satellite.
---

# Configure the modem chain for your channels

The Azure Orbital Ground Station service implements modem and virtual RF functionality in a variety of options for you to choose from. The two options are managed modem or virtual RF delivery and these are specified on a per channel basis. See Ground Station Contact Profile to learn more on channels and links.

## Managed modems vs virtual RF delivery

We recommend taking advantage of Orbital Ground Station's managed modem functionality if possible. The modem is managed by the service and is inserted between your endpoint and the incoming or outgoing virtual RF stream for each pass. You can focus on mission operations while letting Orbital take care of maintaining the modem. Here you have the option to specify the modem setup or leverage one of the in-built named modem configurations for the most commonly used public satellites such as Aqua. This is described in more detail below.

If you wish to have tighter control on the modem setup or bring your own then you should choose to use virtual RF delivery. Here Orbital Ground Station will connect to your endpoint in the contact profile and you will receive virtual RF for downlink and be expected to provide virtual RF for uplink.

## Configuring the channel

There are 4 parameters related to modem configurations. The table below shows you how to configure these parameters.

| Parameter                 | Options                                                                     |
|---------------------------|-----------------------------------------------------------------------------|
| modulationConfiguration   | 1. Null/empty for virtual RF<br />2. Modem config for software modem <br /> 3. Named modem string |
| demodulationConfiguration | 1. Null/empty for virtual RF<br />2. Modem config for software modem <br /> 3. Named modem string |
| encodingConfiguration     | Null (not used)                                                             |
| decodingConfiguration     | Null (not used)                                                             |

> [!NOTE]
> Endpoint specified for the channel will apply to whichever option is selected. Please review [how to prepare network](prepare-network.md) for more details on setting up endpoints.  

### For full-duplex cases

Use the same modem config file in uplink and downlink channels for full-duplex communications in the same band.

### How to input the modem config

The modem config can be entered when creating a contact profile object or can be added and modified in an existing contact profile object. 

#### Entering the modem config using the API
If you are using the API then then the modem config should be a JSON escaped raw save file from the software modem. 

#### Entering the modem config using the portal
If you are using the portal select 'Raw XML' and than *paste the modem config as-is* into the field shown below when entering channel details at time of contact profile creation. 

:::image type="content" source="media/azure-ground-station-modem-config-portal-entry.png" alt-text="Screenshot of entering a modem configuration into the contact profile object." lightbox="media/azure-ground-station-modem-config-portal-entry.png":::

### Named modem configuration

We currently support the following named modem configurations. 

| Public Satellite Service | Named modem string | Note |
|--|--|--|
| Aqua Direct Broadcast | aqua_direct_broadcast | This is NASA's 15 mbps direct broadcast service |
| Aqua Direct Playback | aqua_direct_playback | This is NASA's 150 mbps direct broadcast service |

> [!NOTE]
> We recommend using the Aqua Direct Broadcast modem configuration when testing with Aqua. 

#### Specifying a named modem configuration using the API

If you are using the API then enter the named modem string into the demodulationConfiguration parameter.

```javascript
{
    "location": "westus2",
    "tags": null,
    "id": "/subscriptions/c098d0b9-106a-472d-83d7-eb2421cfcfc2/resourcegroups/Demo/providers/Microsoft.Orbital/contactProfiles/Aqua-directbroadcast",
    "name": "Aqua-directbroadcast",
    "type": "Microsoft.Orbital/contactProfiles",
    "properties": {
        "minimumViableContactDuration": "PT1M",
        "minimumElevationDegrees": 5,
        "autoTrackingConfiguration": "disabled",
        "eventHubUri": "/subscriptions/c098d0b9-106a-472d-83d7-eb2421cfcfc2/resourceGroups/Demo/providers/Microsoft.EventHub/namespaces/demo-orbital-eventhub/eventhubs/antenna-metrics-stream",
        "links": [
            {
                "polarization": "RHCP",
                "direction": "Downlink",
                "gainOverTemperature": 0,
                "eirpdBW": 0,
                "channels": [
                    {
                        "centerFrequencyMHz": 8160,
                        "bandwidthMHz": 15,
                        "endPoint": {
                            "ipAddress": "10.6.0.4",
                            "endPointName": "my-endpoint",
                            "port": "50001",
                            "protocol": "TCP"
                        },
                        "modulationConfiguration": null,
                        "demodulationConfiguration": "aqua_direct_broadcast",
                        "encodingConfiguration": null,
                        "decodingConfiguration": null
                    }
                ]
            }
        ]
    }
}
```

#### Specifying a named modem configuration using the portal

If you are using the portal select 'Preset Named Modem Configuration' and chose a configuration.

:::image type="content" source="media/azure-ground-station-named-modem-example.png" alt-text="Screenshot of entering a modem configuration into the contact profile object." lightbox="media/azure-ground-station-named-modem-example.png":::

### Using virtual RF

Leave the modulationConfiguration or demodulationConfiguration parameters blank to use the virtual RF delivery feature. Azure Orbital Ground Station leverages the [Digital Intermediate Frequency Interoperability](https://dificonsortium.org/) or DIFI format for transport of virtual RF. 

>[!Note]
>Azure Orbital Ground Station will provide an RF stream in accordance with the channel bandwidth setting to the endpoint for downlink.
>
>Azure Orbital Ground Station expects an RF stream in accordance with the channel bandwidth setting from the endpoint for uplink.

## Next steps

- [Register Spacecraft](register-spacecraft.md)
- [Prepare the network](prepare-network.md)
- [Schedule a contact](schedule-contact.md)