---
title: Azure Orbital Ground Station - downlink data from public satellites 
description: Learn how to schedule a contact with public satellites by using the Azure Orbital Ground Station service.
author: apoorvanori
ms.service: orbital
ms.topic: tutorial
ms.custom: ga
ms.date: 07/12/2022
ms.author: apoorvanori
# Customer intent: As a satellite operator, I want to ingest data from NASA's public satellites into Azure.
---

# Tutorial: Downlink data from public satellites

You can communicate with satellites directly from Azure by using the Azure Orbital Ground Station service. After you downlink data, you can process and analyze it in Azure. 

In this turotial, you'll learn how to:

> [!div class="checklist"]
> * Create and authorize a spacecraft for select public satellites.
> * Prepare a virtual machine (VM) to receive downlinked data.
> * Configure a contact profile for a downlink mission.
> * Schedule a contact with a supported public satellite using Azure Orbital Ground Station and save the downlinked data.

Azure Orbital Ground Station supports several public satellites including [Aqua](https://aqua.nasa.gov/content/about-aqua), [Suomi NPP](https://eospso.nasa.gov/missions/suomi-national-polar-orbiting-partnership), [JPSS-1/NOAA-20](https://eospso.nasa.gov/missions/joint-polar-satellite-system-1), and [Terra](https://terra.nasa.gov/about).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Contributor permissions at the subscription level.
- [Basic Support Plan](https://azure.microsoft.com/support/plans/) or higher to submit a spacecraft authorization request.

## Sign in to Azure

Sign in to the [Azure portal - Orbital](https://aka.ms/orbital/portal).

## Create a spacecraft resource

1. In the Azure portal search box, enter **Spacecrafts**. Select **Spacecrafts** in the search results.
2. On the **Spacecrafts** page, select **Create**.
3. Choose which public satellite to contact: Aqua, Suomi NPP, JPSS-1/NOAA-20, or Terra. The table below outlines the NORAD ID, center frequency, bandwidth, and link direction and polarization for each satellite. Refer to this information in the following steps.

 | **Spacecraft Title** | **NORAD ID** | **centerFrequencyMhz** | **bandwidthMhz** | **direction** | **polarization** |
 | :---                 | :----:      | :----:                 | :----:           | :----:        | :----:           |
 | Aqua                 | 27424       | 8160                   | 15               | Downlink      | RHCP             |
 | Suomi NPP            | 37849       | 7812                   | 30               | Downlink      | RHCP             | 
 | JPSS-1/NOAA-20       | 43013       | 7812                   | 30               | Downlink      | RHCP             |
 | Terra                | 25994       | 8212.5                 | 45               | Downlink      | RHCP             |  
 
5. Search for your desired public satellite in [CelesTrak](https://celestrak.com/NORAD/elements/active.txt) and identify its current Two-Line Element (TLE).
   
   > [!NOTE]
   > Be sure to update this TLE to the most current value before you schedule a contact. A TLE that's more than two weeks old might result in an unsuccessful downlink.
   >
   > [Read more about TLE values](spacecraft-object.md#ephemeris).

4. In **Create spacecraft resource**, on the **Basics** tab, enter or select this information:

   | **Field** | **Value** |
   | --- | --- |
   | **Subscription** | Select your subscription. |
   | **Resource Group** | Select your resource group. |
   | **Name** | Enter the **name** of the public spacecraft. |
   | **Region** | Select **West US 2**. |
   | **NORAD ID** | Enter the **NORAD ID** from the table above. |
   | **TLE title line** | Enter **AQUA**, **SUOMI NPP**, **NOAA 20**, or **TERRA**. |
   | **TLE line 1** | Enter TLE line 1 from CelesTrak. |
   | **TLE line 2** | Enter TLE line 2 from CelesTrak. |

5. Select the **Links** tab, or select the **Next: Links** button at the bottom of the page. Then, select **Add new link** and enter or select the following information:

   | **Field** | **Value** |
   | --- | --- |
   | **Name** | Enter **Downlink**. |
   | **Direction** | Select **Downlink**. |
   | **Center Frequency** | Enter the **center frequency** from the table above. |
   | **Bandwidth** | Enter the **bandwidth** from the table above. |
   | **Polarization** | Select **RHCP**. |

7. Select the **Review + create** tab, or select the **Next: Review + create** button.
8. Select **Create**.

## Request authorization of the new public spacecraft resource

1. Navigate to the overview page for the newly created spacecraft resource within your resource group.
2. On the left pane, navigate to **Support + Troubleshooting** then select **Diagnose and solve problems**. Under Spacecraft Management and Setup, select **Troubleshoot**, then select **Create a support request**.
   
   > [!NOTE]
   > A [Basic support plan](https://azure.microsoft.com/support/plans/) or higher is required for a spacecraft authorization request.

3. On the **New support request** page, under the **Problem description** tab, enter or select this information:

   | **Field** | **Value** |
   | --- | --- |
   | **Issue type** |	Select **Technical**. |
   | **Subscription** |	Select the subscription in which you created the spacecraft resource. |
   | **Service** |	Select **My services**. |
   | **Service type** |	Search for and select **Azure Orbital**. |
   | **Resource** | Select the spacecraft resource you created. |
   | **Summary** | Enter **Request authorization for [insert name of public satellite]**. |
   | **Problem type** |	Select **Spacecraft Management and Setup**. |
   | **Problem subtype** |	Select **Spacecraft Registration**. |

5. Select **Next**. If a Solutions page pops up, click **Return to support request**. Select **Next** to move to the **Additional details** tab.
6. Under the **Additional details** tab, enter the following information:

   | **Field** | **Value** |
   | --- | --- |
   | **When did the problem start?** |	Select the current date and time. |
   | **Select Ground Stations** | Select the desired ground stations. |
   | **Supplemental Terms** | Select **Yes** to accept and acknowledge the Azure Orbital [supplemental terms](https://azure.microsoft.com/products/orbital/#overview). |
   | **Description** |	Enter the satellite's **center frequency** from the table above. |
   | **File upload** |	No additional files are required. |

8. Complete the **Advanced diagnostic information** and **Support method** sections of the **Additional details** tab according to your preferences.
9. Select **Next** to move to the **Review + create** tab.
10. Select **Create**.

Your spacecraft authorization request is reviewed by the Azure Orbital Ground Station team. Requests for supported public satellites should not take long to approve.

   > [!NOTE]
   > You can confirm that your spacecraft resource is authorized by checking that the **Authorization status** shows **Allowed** on the spacecraft's overview page.

## Prepare your virtual machine and network to receive public satellite data

1. [Create a virtual network](../virtual-network/quick-create-portal.md) to host your data endpoint virtual machine (VM) using the same subscription and resource group where your spacecraft resource is located.
2. [Create a virtual machine](../virtual-network/quick-create-portal.md#create-virtual-machines) within the virtual network that you created using the same subscription and resource group where your spacecraft resource is located. Ensure that this VM has the following specifications:
   - Under the Basics tab:
      - **Image**: the operating system is Linux (**Ubuntu 20.04** or later).
      - **Size** the VM has at least **32 GiB** of RAM.
   - Under the Networking tab:
      - **Public IP**: the VM has internet access for downloading tools by having one standard public IP address.

   > [!TIP]
   > The public IP address here is only for internet connectivity, not contact data. For more information, see [Default outbound access in Azure](../virtual-network/ip-services/default-outbound-access.md).

3. Navigate to the newly created VM. Follow the instructions linked in Step 2 to connect to the VM. At the bash prompt for your VM, enter the following commands to create a temporary file system (*tmpfs*) on the VM. This VM is where the data will be written to avoid slow writes to disk.

   ```console
   sudo mkdir /media/aqua
   sudo mount -t tmpfs -o size=28G tmpfs /media/aqua
   ```
4. Enter the following command to ensure that the Socat tool is installed on the machine:

   ```console
   sudo apt install socat
   ```
5. [Prepare the network for Azure Orbital Ground Station integration](prepare-network.md) to configure your network.

When preparing the endpoints, enter the following command in your VM to set the MTU level:

   ```console
   sudo ifconfig eth0 3650
   ```

## Configure a contact profile for an Aqua downlink mission

1. In the Azure portal's search box, enter **Contact profile**. Select **Contact profile** in the search results. 
2. On the **Contact profile** page, select **Create**.
3. In **Create contact profile resource**, on the **Basics** tab, enter or select this information:

   | **Field** | **Value** |
   | --- | --- |
   | **Subscription** | Select your subscription. |
   | **Resource group** | Select your resource group. |
   | **Name** | Enter **AQUA_Downlink**. |
   | **Region** | Select **West US 2**. |
   | **Minimum viable contact duration** | Enter **PT1M**. |
   | **Minimum elevation** | Enter **5.0**. |
   | **Auto track configuration** | Select **X-band**. |
   | **Event Hubs Namespace** | Select an Azure Event Hubs namespace to which you'll send telemetry data for your contacts. You must select a subscription before you can select an Event Hubs namespace. |
   | **Event Hubs Instance** | Select an Event Hubs instance that belongs to the previously selected namespace. This field appears only if you select an Event Hubs namespace first. |

4. Select the **Links** tab, or select the **Next: Links** button at the bottom of the page. Then, select **Add new Link**.
6. On the **Add Link** pane, enter or select this information:

   | **Field** | **Value** |
   | --- | --- |
   | **Direction** | Enter **Downlink**. |
   | **Gain/Temperature in db/K** | Enter **0**. |
   | **Center Frequency** | Enter **8160.0**. |
   | **Bandwidth MHz** | Enter **15.0**. |
   | **Polarization** | Enter **RHCP**. |
   | **Endpoint name** | Enter the name of the virtual machine that you created earlier. |
   | **IP Address** | Enter the private IP address of the virtual machine that you created earlier. |
   | **Port** | Enter **56001**. |
   | **Protocol** | Enter **TCP**. |
   | **Demodulation Configuration** | Select the **Preset Named Modem Configuration** option, and then select **Aqua Direct Broadcast**.|
   | **Decoding Configuration** | Leave this field blank. |

7. Select the **Submit** button.
8. Select the **Review + create** tab, or select the **Next: Review + create** button.
9. Select **Create**.

## Schedule a contact with Aqua and save the downlinked data

   > [!NOTE]
   > Check [public satellite schedules](https://directreadout.sci.gsfc.nasa.gov/?id=dspContent&cid=14) to understand if there may be public broadcast outages. Azure Orbital Ground Station does not control the public satellites and cannot guarantee availability of data during the pass.

1. In the Azure portal's search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. On the **Spacecraft** page, select **AQUA**.
3. Select **Schedule contact** on the top bar of the spacecraft's overview.
4. On the **Schedule contact** page, specify this information:

   | **Field** | **Value** |
   | --- | --- |
   | **Contact profile** | Select **AQUA_Downlink**. |
   | **Ground station** | Select **Quincy**. |
   | **Start time** | Identify a start time for the contact availability window. |
   | **End time** | Identify an end time for the contact availability window. |

5. Select **Search** to view available contact times.
6. Select one or more contact windows, and then select **Schedule**.
7. View the scheduled contact by selecting the **AQUA** spacecraft and going to **Contacts**.
8. Shortly before you start running the contact, start listening on port 56001 and output the data received in the file: 

   ```console
   socat -u tcp-listen:56001,fork create:/media/aqua/out.bin
   ```
9. After you run your contact, copy the output file from *tmpfs* into your home directory, to avoid overwriting the file when you run another contact:

   ```console
   mkdir ~/aquadata
   cp /media/aqua/out.bin ~/aquadata/raw-$(date +"%FT%H%M%z").bin
   ```

> [!NOTE]
> For a 10-minute contact with Aqua while it's transmitting with 15 MHz of bandwidth, you should expect to receive around 450 MB of data.
   
## Next steps

- [Collect and process an Aqua satellite payload](satellite-imagery-with-orbital-ground-station.md)
