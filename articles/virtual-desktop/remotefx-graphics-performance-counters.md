---
title: Diagnose graphics performance issues Remote Desktop - Azure
description: This article describes how to use RemoteFX graphics counters in remote desktop protocol sessions to diagnose performance issues with graphics in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 05/23/2019
ms.author: helohr
manager: lizross
---

# Diagnose graphics performance issues in Remote Desktop

To diagnose experience quality issues with your remote sessions, counters have been provided under the RemoteFX Graphics section of Performance Monitor. This article helps you pinpoint and fix graphics-related performance bottlenecks during Remote Desktop Protocol (RDP) sessions using these counters.

## Find your remote session name

You'll need your remote session name to identify the graphics performance counters. Follow the instructions in this section to identify your instance of each counter.

1. Open the Windows command prompt from your remote session.
2. Run the **qwinsta** command and find your session name.
    - If your session is hosted in a multi-session virtual machine (VM): Your instance of each counter is suffixed by the same number that suffixes your session name, such as "rdp-tcp 37."
    - If your session is hosted in a VM that supports virtual Graphics Processing Units (vGPU): Your instance of each counter is stored on the server instead of in your VM. Your counter instances include the VM name instead of the number in the session name, such as "Win8 Enterprise VM."

>[!NOTE]
> While counters have RemoteFX in their names, they include remote desktop graphics in vGPU scenarios as well.

## Access performance counters

After you've determined your remote session name, follow these instructions to collect the RemoteFX Graphics performance counters for your remote session.

1. Select **Start** > **Administrative Tools** > **Performance Monitor**.
2. In the **Performance Monitor** dialog box, expand **Monitoring Tools**, select **Performance Monitor**, and then select **Add**.
3. In the **Add Counters** dialog box, from the **Available Counters** list, expand the section for RemoteFX Graphics.
4. Select the counters to be monitored.
5. In the **Instances of selected object** list, select the specific instances to be monitored for the selected counters and then select **Add**. To select all available counter instances, select **All instances**.
6. After adding the counters, select **OK**.

The selected performance counters will appear on the Performance Monitor screen.

>[!NOTE]
>Each active session on a host has its own instance of each performance counter.

## Diagnose issues

Graphics-related performance issues generally fall into four categories:

- Low frame rate
- Random stalls
- High input latency
- Poor frame quality

### Addressing low frame rate, random stalls, and high input latency

First check the Output Frames/Second counter. It measures the number of frames made available to the client. If this value is less than the Input Frames/Second counter, frames are being skipped. To identify the bottleneck, use the Frames Skipped/Second counters.

There are three types of Frames Skipped/Second counters:

- Frames Skipped/Second (Insufficient Server Resources)
- Frames Skipped/Second (Insufficient Network Resources)
- Frames Skipped/Second (Insufficient Client Resources)

A high value for any of the Frames Skipped/Second counters implies that the problem is related to the resource the counter tracks. For example, if the client doesn't decode and present frames at the same rate the server provides the frames, the Frames Skipped/Second (Insufficient Client Resources) counter will be high.

If the Output Frames/Second counter matches the Input Frames/Second counter, yet you still notice unusual lag or stalling, Average Encoding Time may be the culprit. Encoding is a synchronous process that occurs on the server in the single-session (vGPU) scenario and on the VM in the multi-session scenario. Average Encoding Time should be under 33 ms. If Average Encoding Time is under 33 ms but you still have performance issues, there may be an issue with the app or operating system you are using.

For more information about diagnosing app-related issues, see [User Input Delay performance counters](/windows-server/remote/remote-desktop-services/rds-rdsh-performance-counters/).

Because RDP supports an Average Encoding Time of 33 ms, it supports an input frame rate up to 30 frames/second. Note that 33 ms is the maximum supported frame rate. In many cases, the frame rate experienced by the user will be lower, depending on how often a frame is provided to RDP by the source. For example, tasks like watching a video require a full input frame rate of 30 frames/second, but less computationally intensive tasks like infrequently editing a document result in a much lower value for Input Frames/Second with no degradation in the user's experience quality.

### Addressing poor frame quality

Use the Frame Quality counter to diagnose frame quality issues. This counter expresses the quality of the output frame as a percentage of the quality of the source frame. The quality loss may be due to RemoteFX, or it may be inherent to the graphics source. If RemoteFX caused the quality loss, the issue may be a lack of network or server resources to send higher-fidelity content.

## Mitigation

If server resources are causing the bottleneck, try one of the following approaches to improve performance:

- Reduce the number of sessions per host.
- Increase the memory and compute resources on the server.
- Drop the resolution of the connection.

If network resources are causing the bottleneck, try one of the following approaches to improve network availability per session:

- Reduce the number of sessions per host.
- Use a higher-bandwidth network.
- Drop the resolution of the connection.

If client resources are causing the bottleneck, try one of the following approaches to improve performance:

- Install the most recent Remote Desktop client.
- Increase memory and compute resources on the client machine.

> [!NOTE]
> We currently don't support the Source Frames/Second counter. For now, the Source Frames/Second counter will always display 0.

## Next steps

- To create a GPU optimized Azure virtual machine, see [Configure graphics processing unit (GPU) acceleration for Windows Virtual Desktop environment](configure-vm-gpu.md).
- For an overview of troubleshooting and escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To learn more about the service, see [Windows Desktop environment](environment-setup.md).
