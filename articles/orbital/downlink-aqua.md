---
title: Schedule a contact with NASA's AQUA public satellite using Azure Orbital Ground Station service
description: How to schedule a contact with NASA's AQUA public satellite using Azure Orbital Ground Station service
author: wamota
ms.service: orbital
ms.topic: tutorial
ms.custom: ga
ms.date: 07/12/2022
ms.author: wamota
# Customer intent: As a satellite operator, I want to ingest data from NASA's AQUA public satellite into Azure.
---

# Tutorial: Downlink data from NASA's AQUA public satellite

You can communicate with satellites directly from Azure using Azure Orbital's Ground Station (AOGS) service. Once downlinked, this data can be processed and analyzed in Azure. In this guide you'll learn how to:

> [!div class="checklist"]
> * Create & authorize a spacecraft for AQUA
> * Prepare a virtual machine (VM) to receive the downlinked AQUA data
> * Configure a contact profile for an AQUA downlink mission
> * Schedule a contact with AQUA using Azure Orbital and save the downlinked data


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal - Orbital Preview](https://aka.ms/orbital/portal).

> [!NOTE]
> These steps must be followed as is or you won't be able to find the resources. Please use the specific link above to sign in directly to the Azure Orbital Preview page.

## Create & authorize a spacecraft for AQUA

1. In the Azure portal search box, enter **Spacecraft*. Select **Spacecraft** in the search results.
2. In the **Spacecraft** page, select Create.
3. Learn an up-to-date Two-Line Element (TLE) for AQUA by checking celestrak at https://celestrak.com/NORAD/elements/active.txt
   > [!NOTE]
   > You will want to periodically update this TLE value to ensure that it is up-to-date prior to scheduling a contact. A TLE that is more than one or two weeks old may result in an unsuccessful downlink.
4. In **Create spacecraft resource**, enter or select this information in the Basics tab:

   | **Field** | **Value** |
   | --- | --- |
   | Subscription | Select your subscription |
   | Resource Group | Select your resource group |
   | Name | **AQUA** |
   | Region | Select **West US 2** |
   | NORAD ID | **27424** |
   | TLE title line | **AQUA** |
   | TLE line 1 | Enter TLE line 1 from Celestrak |
   | TLE line 2 | Enter TLE line 2 from Celestrak |

5. Select the **Links** tab, or select the **Next: Links** button at the bottom of the page.
6. In the **Links** page, enter or select this information:

   | **Field** | **Value** |
   | --- | --- |
   | Direction | Select **Downlink** |
   | Center Frequency | Enter **8160** |
   | Bandwidth | Enter **15** |
   | Polarization | Select **RHCP** |

7. Select the **Review + create** tab, or select the **Review + create** button.
8. Select **Create**

9. Access the [Azure Orbital Spacecraft Authorization Form](https://forms.office.com/r/QbUef0Cmjr)
10. Provide the following information:

   - Spacecraft name: **AQUA**
   - Region where spacecraft resource was created: **West US 2**
   - Company name and email
   - Azure Subscription ID

11. Submit the form
12. Await a 'Spacecraft resource authorized' email from Azure Orbital
   > [!NOTE]
   > You can confirm that your spacecraft resource for AQUA is authorized by checking that the **Authorization status** shows **Allowed** in the spacecraft's overiew page.


## Prepare your virtual machine (VM) and network to receive AQUA data

1. [Create a virtual network](../virtual-network/quick-create-portal.md) to host your data endpoint virtual machine (VM)
2. [Create a virtual machine (VM)](../virtual-network/quick-create-portal.md#create-virtual-machines) within the virtual network above. Ensure that this VM has the following specifications:
- Operation System: Linux (Ubuntu 18.04 or higher)
- Size: at least 32 GiB of RAM
- Ensure that the VM has at least one standard public IP
3. Create a tmpfs on the virtual machine. This virtual machine is where the data will be written to in order to avoid slow writes to disk:
```console
sudo mkdir /media/aqua
sudo mount -t tmpfs -o size=28G tmpfs /media/aqua
```
4. Ensure that SOCAT is installed on the machine:
```console
sudo apt install socat
```
5. [Prepare the network for Azure Orbital Ground Station integration](prepare-network.md) to configure your network.

## Configure a contact profile for an AQUA downlink mission
1. In the Azure portal search box, enter **Contact profile**. Select **Contact profile** in the search results. 
2. In the **Contact profile** page, select **Create**.
3. In **Create contact profile resource**, enter or select this information in the **Basics** tab:

   | **Field** | **Value** |
   | --- | --- |
   | Subscription | Select your subscription |
   | Resource group | Select your resource group |
   | Name | Enter **AQUA_Downlink** |
   | Region | Select **West US 2** |
   | Minimum viable contact duration | **PT1M** |
   | Minimum elevation | **5.0** |
   | Auto track configuration | **Disabled** |
   | Event Hubs Namespace | Select an Event Hubs Namespace to which you'll send telemetry data of your contacts. Select a Subscription before you can select an Event Hubs Namespace. |
   | Event Hubs Instance | Select an Event Hubs Instance that belongs to the previously selected Namespace. *This field will only appear if an Event Hubs Namespace is selected first*. |


4. Select the **Links** tab, or select the **Next: Links** button at the bottom of the page.
5. In the **Links** page, select **Add new Link**
6. In the **Add Link** page, enter, or select this information:

   | **Field** | **Value** |
   | --- | --- |
   | Direction | **Downlink** |
   | Gain/Temperature in db/K | **0** |
   | Center Frequency | **8160.0** |
   | Bandwidth MHz | **15.0** |
   | Polarization | **RHCP** |
   | Endpoint name | Enter the name of the virtual machine (VM) you created above |
   | IP Address | Enter the Private IP address of the virtual machine you created above (VM) |
   | Port | **56001** |
   | Protocol | **TCP** |
   | Demodulation Configuration | Select the 'Preset Named Modem Configuration' option and choose **Aqua Direct Broadcast**|
   | Decoding Configuration | Leave this field **blank** |


7. Select the **Submit** button
8. Select the **Review + create** tab or select the **Review + create** button
9. Select the **Create** button

## Schedule a contact with AQUA using Azure Orbital and save the downlinked data

1. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. In the **Spacecraft** page, select **AQUA**.
3. Select **Schedule contact** on the top bar of the spacecraft’s overview.
4. In the **Schedule contact** page, specify this information from the top of the page:

   | **Field** | **Value** |
   | --- | --- |
   | Contact profile | Select **AQUA_Downlink** |
   | Ground station | Select **Quincy** |
   | Start time | Identify a start time for the contact availability window |
   | End time | Identify an end time for the contact availability window |

5. Select **Search** to view available contact times.
6. Select one or more contact windows and select **Schedule**.
7. View the scheduled contact by selecting the **AQUA** spacecraft and navigating to **Contacts**.
8. Shortly before the contact begins executing, start listening on port 56001, and output the data received into the file: 
```console
socat -u tcp-listen:56001,fork create:/media/aqua/out.bin
```
9. Once your contact has executed, copy the output file from the tmpfs into your home directory to avoid being overwritten when another contact is executed.
```console
mkdir ~/aquadata
cp /media/aqua/out.bin ~/aquadata/raw-$(date +"%FT%H%M%z").bin
```

 > [!NOTE]
 > For a 10 minute long contact with AQUA while it is transmitting with 15MHz of bandwidth, you should expect to receive somewhere in the order of 450MB of data.
   
## Next steps

- [Collect and process Aqua satellite payload](satellite-imagery-with-orbital-ground-station.md)
