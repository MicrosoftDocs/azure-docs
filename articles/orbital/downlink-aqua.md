---
title: Azure Orbital Ground Station - Downlink data from public satellites 
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

In this tutorial, you'll learn how to:

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
2. On the **Spacecrafts** page, click **Create**.
3. Choose which public satellite to contact: Aqua, Suomi NPP, JPSS-1/NOAA-20, or Terra. The table below outlines the NORAD ID, center frequency, bandwidth, and link direction and polarization for each satellite. Refer to this information in the following steps and throughout the tutorial.

 | **Spacecraft**  | **NORAD ID** | **Center Frequency (MHz)** | **Bandwidth (MHz)** | **Direction** | **Polarization** |
 | :---            | :----:       | :----:                     | :----:              | :----:        | :----:           |
 | Aqua            | 27424        | 8160                       | 15                  | Downlink      | RHCP             |
 | Suomi NPP       | 37849        | 7812                       | 30                  | Downlink      | RHCP             | 
 | JPSS-1/NOAA-20  | 43013        | 7812                       | 30                  | Downlink      | RHCP             |
 | Terra           | 25994        | 8212.5                     | 45                  | Downlink      | RHCP             |  
 
4. Search for your desired public satellite in [CelesTrak](https://celestrak.com/NORAD/elements/active.txt) and identify its current Two-Line Element (TLE).
   
   > [!NOTE]
   > Be sure to update this TLE to the most current value before you schedule a contact. A TLE that's more than two weeks old might result in an unsuccessful downlink.
   >
   > [Read more about TLE values](spacecraft-object.md#ephemeris).

5. In **Create spacecraft resource**, on the **Basics** tab, enter or select the following information:

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

6. Click **Next**. In the **Links** pane, select **Add new Link**.
7. In the **Add Link** page, enter or select the following information:

   | **Field** | **Value** |
   | --- | --- |
   | **Name** | Enter **Downlink**. |
   | **Direction** | Select **Downlink**. |
   | **Center Frequency** | Enter the **center frequency** in MHz from the table above. |
   | **Bandwidth** | Enter the **bandwidth** in MHz from the table above. |
   | **Polarization** | Select **RHCP**. |

8. Click **Review + create**. After the validation is complete, click **Create**.

## Request authorization of the new public spacecraft resource

1. Navigate to the overview page for the newly created spacecraft resource within your resource group.
2. On the left pane, navigate to **Support + troubleshooting** then click **Diagnose and solve problems**. Under Spacecraft Management and Setup, click **Troubleshoot**, then click **Create a support request**.
   
   > [!NOTE]
   > A [Basic support plan](https://azure.microsoft.com/support/plans/) or higher is required for a spacecraft authorization request.

3. On the **New support request** page, under the **Problem description** tab, enter or select the following information:

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

4. click **Next**. If a Solutions page pops up, click **Return to support request**. click **Next** to move to the **Additional details** tab.
5. Under the **Additional details** tab, enter the following information:

   | **Field** | **Value** |
   | --- | --- |
   | **When did the problem start?** |	Select the **current date and time**. |
   | **Select Ground Stations** | Select the desired **ground stations**. |
   | **Supplemental Terms** | Select **Yes** to accept and acknowledge the Azure Orbital [supplemental terms](https://azure.microsoft.com/products/orbital/#overview). |
   | **Description** |	Enter the satellite's **center frequency** from the table above. |
   | **File upload** |	No additional files are required. |

6. Complete the **Advanced diagnostic information** and **Support method** sections of the **Additional details** tab according to your preferences.
7. Click **Review + create**. After the validation is complete, click **Create**.

After submission, the Azure Orbital Ground Station team reviews your satellite authorization request. Requests for supported public satellites shouldn't take long to approve.

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

   > [!NOTE]
   > This command references Aqua. Edit the command to reflect the public spacecraft you're using.

   ```console
   sudo mkdir /media/aqua
   sudo mount -t tmpfs -o size=28G tmpfs /media/aqua
   ```
4. Enter the following command in your VM to ensure that the Socat tool is installed on the machine:

   ```console
   sudo apt install socat
   ```
5. Follow instructions to [delegate a subnet](prepare-network.md#create-and-prepare-subnet-for-vnet-injection) to Azure Orbital Ground Station.
   
6. Follow instructions to [prepare your VM endpoint](prepare-network.md#prepare-endpoints). Enter the following command in your VM to set the MTU level to 3650:

   ```console
   sudo ifconfig eth0 3650
   ```

## Configure Event Hubs for antenna telemetry

To receive antenna telemetry during contacts with your selected public satellite, follow instructions to [create and configure an Azure event hub](receive-real-time-telemetry.md#configure-event-hubs) in your subscription.

## Configure a contact profile to downlink from a public satellite

1. In the Azure portal's search box, enter **Contact Profiles**. Select **Contact Profiles** in the search results. 
2. On the **Contact Profiles** page, click **Create**.
3. In **Create Contact Profile resource**, on the **Basics** tab, enter or select the following information:

   | **Field** | **Value** |
   | --- | --- |
   | **Subscription** | Select your **subscription**. |
   | **Resource group** | Select your **resource group**. |
   | **Name** | Enter **[Satellite_Name]_Downlink**, e.g., Aqua_Downlink. |
   | **Region** | Select **West US 2**. |
   | **Minimum viable contact duration** | Enter **PT1M**. |
   | **Minimum elevation** | Enter **5.0**. |
   | **Auto track configuration** | Select **X-band**. |
   | **Send telemetry to Event Hub?** | Select **Yes**. |
   | **Event Hubs Namespace** | Select an Azure Event Hubs **namespace** to which you'll send telemetry data for your contacts. You must select a subscription before you can select an Event Hubs namespace. |
   | **Event Hubs Instance** | Select an Event Hubs **instance** that belongs to the previously selected namespace. _This field appears only if you select an Event Hubs namespace first_. |
   | **Virtual Network** | Select the **virtual network** that you created earlier. |
   | **Subnet** | Select the delegated subnet that you created earlier. _This field appears only if you select a virtual network first_. |

4. Click **Next**. In the **Links** page, click **Add new Link**.
5. On the **Add Link** page, enter or select the following information:

   | **Field** | **Value** |
   | --- | --- |
   | **Name** | Enter a name for the link, e.g. Aqua_Downlink |
   | **Direction** | Select **Downlink**. |
   | **Gain/Temperature** | Enter **0**. |
   | **EIRP in dBW** | Only applicable to uplink. Leave blank. |
   | **Polarization** | Select **RHCP**. |

6. Click **Add Channel**. In the **Add Channel** pane, add or select the following information:

   | **Field** | **Value** |
   | --- | --- |
   | **Name** | Enter a name for the channel, e.g Aqua_Downlink_Channel. |
   | **Center Frequency (MHz)** | Enter the **center frequency** in MHz. Refer to the table above for the value for your selected spacecraft. |
   | **Bandwidth (MHz)** | Enter the **bandwidth** in MHz. Refer to the table above for the value for your selected spacecraft. |
   | **Endpoint name** | Enter the **name of the virtual machine** that you created earlier. |
   | **IP Address** | Enter the **private IP address** of the virtual machine that you created earlier. |
   | **Port** | Enter **56001**. |
   | **Protocol** | Enter **TCP**. |
   | **Demodulation Configuration Type** | Select **Preset Named Modem Configuration**. |
   | **Demodulation Configuration** | Select the **demodulation configuration** for your selected public satellite. Refer to [configure the modem chain](modem-chain.md#named-modem-configuration) for details. |
   | **Decoding Configuration** | Leave this field blank. |

7. Click **Submit** to add the channel. Click **Submit** again to add the link. 
8. Click **Review + create**. After the validation is complete, click **Create**.

## Schedule a contact with Aqua and save the downlinked data

   > [!NOTE]
   > Check [public satellite schedules](https://directreadout.sci.gsfc.nasa.gov/?id=dspContent&cid=14) to understand if there may be public broadcast outages. Azure Orbital Ground Station does not control the public satellites and cannot guarantee availability of data during the pass.

1. In the Azure portal's search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. On the **Spacecraft** page, select your public spacecraft resource.
3. Click **Schedule contact** on the top bar of the spacecraft's overview.
4. On the **Schedule contact** page, specify the following information:

   | **Field** | **Value** |
   | --- | --- |
   | **Contact profile** | Select the **contact profile** you previously created. |
   | **Ground station** | Select **Microsoft_Quincy**. |
   | **Start time** | Identify a start time for the contact availability window. |
   | **End time** | Identify an end time for the contact availability window. |

5. Click **Search** to view available contact times.
6. Select one or more contact windows, and then click **Schedule**.
7. View the scheduled contact by selecting the spacecraft resource, navigating to Configurations on the left panel, and clicking **Contacts**.
8. Shortly before you start running the contact, start listening on port 56001 and output the data received in the file: 

   > [!NOTE]
   > This command references Aqua. Edit the command to reflect the public spacecraft you're using.

   ```console
   socat -u tcp-listen:56001,fork create:/media/aqua/out.bin
   ```
9. After you run your contact, copy the output file from *tmpfs* into your home directory, to avoid overwriting the file when you run another contact:

   > [!NOTE]
   > This command references Aqua. Edit the command to reflect the public spacecraft you're using.

   ```console
   mkdir ~/aquadata
   cp /media/aqua/out.bin ~/aquadata/raw-$(date +"%FT%H%M%z").bin
   ```

> [!NOTE]
> For a 10-minute contact with Aqua while it's transmitting with 15 MHz of bandwidth, you should expect to receive around 450 MB of data.
   
## Next steps

- [Collect and process an Aqua satellite payload](satellite-imagery-with-orbital-ground-station.md)
