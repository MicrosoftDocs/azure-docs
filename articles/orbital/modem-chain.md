---
title: Configure the RF chain - Azure Orbital
description: Learn more about how to configure modems.
author: hrshelar
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 08/30/2022
ms.author: hrshelar
#Customer intent: As a satellite operator or user, I want to understand how to use software modems to establish RF connections with my satellite.
---

# How to configure the RF chain

You have the flexibility to choose between managed modem or virtual RF functionality using the Azure Orbital Ground Station service. These operational modes are specified on a per channel basis in the contact profile. See [ground station contact profile](concepts-contact-profile.md) to learn more about channels and links.

## Managed modems vs virtual RF delivery

We recommend taking advantage of Orbital Ground Station's managed modem functionality if possible. The modem is managed by the service and is inserted between your endpoint and the incoming or outgoing virtual RF stream for each pass. You can specify the modem setup using a modem configuration file or apply one of the in-built named modem configurations for commonly used public satellites such as Aqua. 

Use virtual RF delivery if you wish to have tighter control on the modem setup or bring your own modem to the resource group. Orbital Ground Station will connect to your channel endpoint specified in the contact profile.

## How to configure your channels

The table below shows you how to configure the modem or virtual RF parameters.

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
You can enter the modem config when creating a contact profile object or add it in later. Modifications to existing modem configs are also allowed.

#### Entering the modem config using the API
Enter the modem config as a JSON escaped string from the desired modem config file when using the API.

#### Entering the modem config using the portal
Select 'Raw XML' and then **paste the modem config raw (without JSON escapement)**  into the field shown below when entering channel details using the portal. 

:::image type="content" source="media/azure-ground-station-modem-config-portal-entry.png" alt-text="Screenshot of entering a modem configuration into the contact profile object." lightbox="media/azure-ground-station-modem-config-portal-entry.png":::

### Named modem configuration
We currently support the following named modem configurations. 

| **Public Satellite Service** | **Named modem string** | **Note** |
|--|--|--|
| Aqua Direct Broadcast | aqua_direct_broadcast | This is NASA AQUA's 15-Mbps direct broadcast service |
| Aqua Direct Playback | aqua_direct_playback | This is NASA's AQUA's 150-Mbps direct broadcast service |
| Terra Direct Broadcast | terra_direct_broadcast | This is NASA Terra's 13.125-Mbps direct broadcast service |
| SNPP Direct Broadcast | snpp_direct_broadcast | This is NASA SNPP 15-Mbps direct broadcast service |
| JPSS-1 Direct Broadcast | jpss-1_direct_broadcast | This is NASA JPSS-1 15-Mbps direct broadcast service |

> [!NOTE]
> We recommend using the Aqua Direct Broadcast modem configuration when testing with Aqua.  
> 
> Orbital does not have control over the downlink schedules for these public satellites. NASA conducts their own operations which may interrupt the downlink availabilities.

 | **Spacecraft Title**    | **Aqua**  |**Suomi NPP**|**JPSS-1/NOAA-20**| **Terra** |
 | :---                    |  :----:   |    :----:   |     :----:       | :----:    |
 | `noradId:`              | 27424     | 37849       | 43013            | 25994     |
 | `centerFrequencyMhz:`   | 8160,     | 7812,       | 7812,            | 8212.5,   |
 | `bandwidthMhz:`         | 15        | 30          | 30               | 45        |
 | `direction:`            | Downlink, | Downlink,   | Downlink,        | Downlink, |
 | `polarization:`         | RHCP      | RHCP        | RHCP             | RHCP      |

#### Specifying a named modem configuration using the API
Enter the named modem string into the demodulationConfiguration parameter when using the API.

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

Select 'Preset Named Modem Configuration'and chose a configuration as shown below when entering channel details using the portal.

:::image type="content" source="media/azure-ground-station-named-modem-example.png" alt-text="Screenshot of choosing a named modem configuration in the contact profile object." lightbox="media/azure-ground-station-named-modem-example.png":::

### How to use virtual RF

Leave the modulationConfiguration or demodulationConfiguration parameters blank in the channel parameters to use the virtual RF delivery feature. Azure Orbital Ground Station uses the [Digital Intermediate Frequency Interoperability](https://dificonsortium.org/) or DIFI format for transport of virtual RF. 

>[!Note]
>Azure Orbital Ground Station will provide an RF stream in accordance with the channel bandwidth setting to the endpoint for downlink.
>
>Azure Orbital Ground Station expects an RF stream in accordance with the channel bandwidth setting from the endpoint for uplink.

## Next steps

- [Register Spacecraft](register-spacecraft.md)
- [Prepare the network](prepare-network.md)
- [Schedule a contact](schedule-contact.md)
