---
title: Downlink data from NASA's Aqua satellite by using Azure Orbital Ground Station
description: Learn how to schedule a contact with NASA's Aqua public satellite by using the Azure Orbital Ground Station service.
author: apoorvanori
ms.service: orbital
ms.topic: tutorial
ms.custom: ga
ms.date: 07/12/2022
ms.author: apoorvanori
# Customer intent: As a satellite operator, I want to ingest data from NASA's Aqua public satellite into Azure.
---

# Tutorial: Downlink data from NASA's Aqua public satellite

You can communicate with satellites directly from Azure by using the Azure Orbital Ground Station service. After you downlink data, you can process and analyze it in Azure. In this guide, you'll learn how to:

> [!div class="checklist"]
> * Create and authorize a spacecraft for the Aqua public satellite.
> * Prepare a virtual machine (VM) to receive downlinked Aqua data.
> * Configure a contact profile for an Aqua downlink mission.
> * Schedule a contact with Aqua by using Azure Orbital and save the downlinked data.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Contributor permissions at the subscription level.

## Sign in to Azure

Sign in to the [Azure portal - Azure Orbital Preview](https://aka.ms/orbital/portal).

> [!NOTE]
> For all the procedures in this tutorial, follow the steps exactly as shown, or you won't be able to find the resources. Use the preceding link to sign in directly to the Azure Orbital Preview page.

## Create a spacecraft resource for Aqua

1. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. On the **Spacecraft** page, select **Create**.
3. Get an up-to-date Two-Line Element (TLE) for Aqua by checking [CelesTrak](https://celestrak.com/NORAD/elements/active.txt).
   
   > [!NOTE]
   > Be sure to update this TLE value before you schedule a contact. A TLE that's more than two weeks old might result in an unsuccessful downlink.

4. In **Create spacecraft resource**, on the **Basics** tab, enter or select this information:

   | **Field** | **Value** |
   | --- | --- |
   | **Subscription** | Select your subscription. |
   | **Resource Group** | Select your resource group. |
   | **Name** | Enter **AQUA**. |
   | **Region** | Select **West US 2**. |
   | **NORAD ID** | Enter **27424**. |
   | **TLE title line** | Enter **AQUA**. |
   | **TLE line 1** | Enter TLE line 1 from CelesTrak. |
   | **TLE line 2** | Enter TLE line 2 from CelesTrak. |

5. Select the **Links** tab, or select the **Next: Links** button at the bottom of the page. Then, enter or select this information:

   | **Field** | **Value** |
   | --- | --- |
   | **Direction** | Select **Downlink**. |
   | **Center Frequency** | Enter **8160**. |
   | **Bandwidth** | Enter **15**. |
   | **Polarization** | Select **RHCP**. |

7. Select the **Review + create** tab, or select the **Next: Review + create** button.
8. Select **Create**.

## Request authorization of the new Aqua spacecraft resource

1. Go to the overview page for the newly created spacecraft resource.
2. On the left pane, in the **Support + troubleshooting** section, select **New support request**.
   
   > [!NOTE]
   > A [Basic support plan](https://azure.microsoft.com/support/plans/) or higher is required for a spacecraft authorization request.

3. On the **New support request** page, on the **Basics** tab, enter or select this information:

   | **Field** | **Value** |
   | --- | --- |
   | **Summary** | Enter **Request authorization for AQUA**. |
   | **Issue type** |	Select **Technical**. |
   | **Subscription** |	Select the subscription in which you created the spacecraft resource. |
   | **Service** |	Select **My services**. |
   | **Service type** |	Search for and select **Azure Orbital**. |
   | **Problem type** |	Select **Spacecraft Management and Setup**. |
   | **Problem subtype** |	Select **Spacecraft Registration**. |

4. Select the **Details** tab at the top of the page. In the **Problem details** section, enter this information:

   | **Field** | **Value** |
   | --- | --- |
   | **When did the problem start?** |	Select the current date and time. |
   | **Description** |	List Aqua's center frequency (**8160**) and the desired ground stations. |
   | **File upload** |	Upload any pertinent licensing material, if applicable. |

6. Complete the **Advanced diagnostic information** and **Support method** sections of the **Details** tab.
7. Select the **Review + create** tab, or select the **Next: Review + create** button.
8. Select **Create**.

   > [!NOTE]
   > You can confirm that your spacecraft resource for Aqua is authorized by checking that the **Authorization status** shows **Allowed** on the spacecraft's overview page.

## Prepare your virtual machine and network to receive Aqua data

1. [Create a virtual network](../virtual-network/quick-create-portal.md) to host your data endpoint VM.
2. [Create a virtual machine](../virtual-network/quick-create-portal.md#create-virtual-machines) within the virtual network that you created. Ensure that this VM has the following specifications:
   - The operating system is Linux (Ubuntu 20.04 or later).
   - The size is at least 32 GiB of RAM.
   - The VM has internet access for downloading tools by having one standard public IP address.

   > [!TIP]
   > The public IP address here is only for internet connectivity, not contact data. For more information, see [Default outbound access in Azure](../virtual-network/ip-services/default-outbound-access.md).

3. Enter the following commands to create a temporary file system (*tmpfs*) on the virtual machine. This virtual machine is where the data will be written to avoid slow writes to disk.

   ```console
   sudo mkdir /media/aqua
   sudo mount -t tmpfs -o size=28G tmpfs /media/aqua
   ```
4. Enter the following command to ensure that the Socat tool is installed on the machine:

   ```console
   sudo apt install socat
   ```
5. [Prepare the network for Azure Orbital Ground Station integration](prepare-network.md) to configure your network.

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
