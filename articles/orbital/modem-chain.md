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

You have the flexibility to choose between managed modem or virtual RF functionality using the Azure Orbital Ground Station service. These operational modes are specified on a per-channel basis in the contact profile. See [ground station contact profile](concepts-contact-profile.md) to learn more about channels and links.

### Prerequisites
- Managed modem: a modem configuration file
- Virtual RF: GNU radio or software radio

## Managed modems vs virtual RF delivery

We recommend taking advantage of Azure Orbital Ground Station's managed modem functionality, if possible. The modem is managed by the service and is inserted between your endpoint and the incoming or outgoing virtual RF stream for each pass. You must provide a modem configuration file in XML format to specify the modem setup. Currently, we use [Kratos quantumRX v1.4](https://www.kratosdefense.com/products/space/signals/signal-processing/quantumrx) and [Kratos quantumRadio v4.0](https://www.kratosdefense.com/products/space/satellites/ttc-devices-and-software/quantumradio) modems. Your modems and modem configurations must match these versions. You can also apply one of the in-built named modem configurations for commonly used public satellites such as Aqua. 

Virtual RF delivery can be used if you wish to have tighter control on the modem setup or bring your own modem to the Azure resource group. Azure Orbital Ground Station will connect to your channel endpoint that is specified in the contact profile.

## How to configure your channels

The table below shows you how to configure the modem or virtual RF parameters.

| Parameter                 | Options                                                                     |
|---------------------------|-----------------------------------------------------------------------------|
| modulationConfiguration   | 1. Null/empty for virtual RF<br />2. Modem config for software modem <br /> 3. Named modem string |
| demodulationConfiguration | 1. Null/empty for virtual RF<br />2. Modem config for software modem <br /> 3. Named modem string |
| encodingConfiguration     | Null (not used)                                                             |
| decodingConfiguration     | Null (not used)                                                             |

> [!NOTE]
> The endpoint specified for the channel will apply to whichever option is selected. Please review [how to prepare network](prepare-network.md) for more details on setting up endpoints.  

### Full-duplex cases
Use the same modem configuration file in uplink and downlink channels for full-duplex communications in the same band.

## How to input the modem config
You can enter your existing modem configuration when creating a [contact profile object](contact-profile.md) or add it in later. Modifications to existing modem configurations are also allowed.

### Entering the modem configuration 
#### Using the Azure Orbital Ground Station API
Enter the modem configuration as a JSON escaped string from the desired modem configuration file when using the Azure Orbital Ground Station API.

#### Using the Azure Portal
Select 'Raw XML' and then **paste the modem configuration raw (without JSON escapement)**  into the field shown below when entering channel details using the Azure portal. 

:::image type="content" source="media/azure-ground-station-modem-config-portal-entry.png" alt-text="Screenshot of entering a modem configuration into the contact profile object." lightbox="media/azure-ground-station-modem-config-portal-entry.png":::

## Named modem configuration
We currently support the following named modem configurations:  

| **Public Satellite Service** | **Named modem string** | **Note** |
|--|--|--|
| Aqua Direct Broadcast | aqua_direct_broadcast | This is NASA Aqua 15-Mbps direct broadcast service |
| Aqua Direct Playback | aqua_direct_playback | This is NASA Aqua 150-Mbps direct broadcast service |
| Terra Direct Broadcast | terra_direct_broadcast | This is NASA Terra 13.125-Mbps direct broadcast service |
| SNPP Direct Broadcast | snpp_direct_broadcast | This is NASA SNPP 15-Mbps direct broadcast service |
| JPSS-1 Direct Broadcast | jpss-1_direct_broadcast | This is NASA JPSS-1 15-Mbps direct broadcast service |

> [!NOTE]
> We recommend using the Aqua Direct Broadcast modem configuration when testing with Aqua.  
> 
> Azure Orbital Ground Station does not have control over the downlink schedules for these public satellites. NASA conducts their own operations which may interrupt downlink availabilities.

 | **Spacecraft Title** | **noradID** | **centerFrequencyMhz** | **bandwidthMhz** | **direction** | **polarization** |
 | :---                 | :----:      | :----:                 | :----:           | :----:        | :----:           |
 | Aqua                 | 27424       | 8160                   | 15               | Downlink      | RHCP             |
 | Suomi NPP            | 37849       | 7812                   | 30               | Downlink      | RHCP             | 
 | JPSS-1/NOAA-20       | 43013       | 7812                   | 30               | Downlink      | RHCP             |
 | Terra                | 25994       | 8212.5                 | 45               | Downlink      | RHCP             |  

### Specifying a named modem configuration
#### Using the Azure Orbital Ground Station API
Enter the named modem string into the demodulationConfiguration parameter when using the Azure Orbital Ground Station API.

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

#### Using the Azure Portal

Select 'Preset Named Modem Configuration'and chose a configuration as shown below when entering channel details using the Azure portal.

:::image type="content" source="media/azure-ground-station-named-modem-example.png" alt-text="Screenshot of choosing a named modem configuration in the contact profile object." lightbox="media/azure-ground-station-named-modem-example.png":::

## How to use virtual RF

To use the virtual RF delivery feature, leave the modulationConfiguration or demodulationConfiguration parameters blank in the channel parameters. Azure Orbital Ground Station uses the [Digital Intermediate Frequency Interoperability](https://dificonsortium.org/) or DIFI format for transport of virtual RF. Refer to the [virtual RF tutorial](virtual-rf-tutorial.md) to learn more.

>[!Note]
>Azure Orbital Ground Station will provide an RF stream in accordance with the channel bandwidth setting to the endpoint for downlink.
>
>Azure Orbital Ground Station expects an RF stream in accordance with the channel bandwidth setting from the endpoint for uplink.

## Next steps

- [Register Spacecraft](register-spacecraft.md)
- [Prepare the network](prepare-network.md)
- [Schedule a contact](schedule-contact.md)
