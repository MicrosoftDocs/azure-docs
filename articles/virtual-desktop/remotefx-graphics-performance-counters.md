---
title: Diagnosing graphics performance issues in remote desktop - Azure
description: This article describes how to use RemoteFX graphics counters in remote desktop protocol sessions to diagnose performance issues with graphics in Windows Virtual Desktop.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 05/23/2019
ms.author: v-chjenk
---

# Diagnose graphics performance issues in Remote Desktop

When the system doesn't perform as expected, it's important to identify the source of the problem. This article helps you identify and fix graphics-related performance bottlenecks during Remote Desktop Protocol (RDP) sessions.

## Find your remote session name

You'll need your remote session name to identify the graphics performance counters. Follow the instructions in this section to identify your Windows Virtual Desktop Preview remote session name.

1. Open the Windows command prompt from your remote session.
2. Run the **qwinsta** command.
    - If your session is hosted in a multi-session virtual machine (VM): The suffix for each counter name is the same suffix in your session name, such as “rdp-tcp 37."
    - If your session is hosted in a VM that supports virtual Graphics Processing Units (vGPU): The counters are stored on the server instead of in your VM. The counter instances include the VM name instead of the number in the session name, such as "Win8 Enterprise VM."

>[!NOTE]
> While counters have RemoteFX in their names, they include remote desktop graphics in vGPU scenarios as well.

## Access performance counters

Performance counters in RemoteFX Graphics help you detect bottlenecks by helping you track things like frame encoding time and skipped frames.

After you've determined your remote session name, follow these instructions to collect the RemoteFX Graphics performance counters for your remote session.

1. Select **Start** > **Administrative Tools** > **Performance Monitor**.
2. In the **Performance Monitor** dialog box, expand **Monitoring Tools**, select **Performance Monitor**, and then select **Add**.
3. In the **Add Counters** dialog box, from the **Available Counters** list, expand performance counter object for RemoteFX Graphics.
4. Select the counters to be monitored.
5. In the **Instances of Selected object** list, select the specific instances to be monitored for the selected counters and then select **Add**. To select all available counter instances, select **All instances**.
6. After adding the counters, select **OK**.

The selected performance counters will appear on the Performance Monitor screen.

>[!NOTE]
>Each active session on a host has its own instance of each performance counter.

## Diagnosis

Graphics-related performance issues generally fall into four categories:

- Low frame rate
- Random stalls
- High input latency
- Poor frame quality

Start by addressing low frame rate, random stalls, and high input latency. The next section will tell you which performance counters measure each category.

### Performance counters

This section helps you identify bottlenecks.

First check the Output Frames/Second counter. It measures the number of frames made available to the client. If this value is less than the Input Frames/Second counter, frames are being skipped. To identify the bottleneck, use the Frames Skipped/Second counters.

There are three types of Frames Skipped/Second counters:

- Frames Skipped/Second (Insufficient Network Resources)
- Frames Skipped/Second (Insufficient Client Resources)
- Frames Skipped/Second (Insufficient Server Resources)

A high value for any of the Frames Skipped/Second counters implies that the problem is related to the resource the counter tracks. For example, if the client doesn't decode and present frames at the same rate the server provides the frames, the Frames Skipped/Second (Insufficient Client Resources) counter will be high.

If the Output Frames/Second counter matches the Input Frames/Second counter, yet you still have unusual lag or stalling, the issue may be the Average Encoding Time. Encoding is a synchronous process that occurs on the server in the single-session (vGPU) scenario and on the VM in the multi-session scenario. Average Encoding Time should be under 33 ms. If Average Encoding Time is under 33 ms but you still have performance issues, there may be an issue with the app or operating system you are using.

For more information about diagnosing app-related issues, see [User Input Delay performance counters](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/rds-rdsh-performance-counters).

Because RDP supports an Average Encoding Time of 33 ms, it supports an input frame rate up to 30 frames/second. Note that 33 ms is the maximum supported frame rate. In many cases, the frame rate experienced by the user will be lower, depending on how often a frame is provided to RDP by the source. For example, tasks like watching a video require a full input frame rate of 30 frames/second, but less resource-heavy tasks like infrequently editing a word document don't require such a high rate of input frames per second for a good user experience.

Use the Frame Quality counter to diagnose frame quality issues. This counter expresses the quality of the output frame as a percentage of the quality of the source frame. The quality loss may be due to RemoteFX, or it may be inherent to the graphics source. If RemoteFX caused the quality loss, the issue may be a lack of network or server resources to send higher-fidelity content.

## Mitigation

If server resources are causing the bottleneck, try one of the following things to improve performance:

- Reduce the number of sessions per host.
- Increase the memory and compute resources on the server.
- Drop the resolution of the connection.

If network resources are causing the bottleneck, try one of the following things to improve network availability per session:

- Reduce the number of sessions per host.
- Drop the resolution of the connection.
- Use a higher-bandwidth network.

If client resources are causing the bottleneck, do one or both of the following things to improve performance:

- Install the most recent Remote Desktop client.
- Increase memory and compute resources on the client machine.

> [!NOTE]
> We currently don’t support the Source Frames/Second counter. For now, the Source Frames/Second counter will always be set to 0.

## Next steps

- To create a GPU optimized Azure virtual machine, see [Configure graphics processing unit (GPU) acceleration for Windows Virtual Desktop Preview environment](https://docs.microsoft.com/azure/virtual-desktop/configure-vm-gpu).
- For an overview of troubleshooting and escalation tracks, see [Troubleshooting overview, feedback, and support](https://docs.microsoft.com/azure/virtual-desktop/troubleshoot-set-up-overview).
- To learn more about the Preview service, see [Windows Desktop Preview environment](https://docs.microsoft.com/azure/virtual-desktop/environment-setup).
