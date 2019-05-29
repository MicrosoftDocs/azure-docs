---
title: Diagnosing graphics performance issues in remote desktop - Azure
description: This article describes how to use RemoteFX graphics counters in remote desktop protocol sessions to diagnose performance issues with graphics.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: troubleshoot
ms.date: 05/23/2019
ms.author: v-chjenk
---

# Diagnosing graphics performance issues in remote desktop

When the system does not perform as expected, it's essential to identify the source of the problem. This article helps you diagnose graphics-related performance bottlenecks during Remote Desktop Protocol (RDP) sessions. RemoteFX Graphics in Performance Monitor contains performance counters, such as frame encoding time and skipped frames, that you can use to detect bottlenecks.

## Find your remote session name

Start by identifying your Windows Virtual Desktop remote session name.

1. Open the command prompt from your remote session.
2. Run the **quinsta** command.
    - If your session is hosted in a multisession virtual machine (VM), your instance of each counter will be suffixed by the same number that suffixes your session name, such as “rdp-tcp 37”. 
    - If your session is hosted in a VM that supports virtual Graphics Processing Units (vGPU), your counters are stored on the server instead of in your VM. The counter instances include the VM name instead of the number in the session name, such as Win8 Enterprise VM.

>[!Note]
> While counters have RemoteFX in their names, they include remote desktop graphics in vGPU scenarios as well.

## Access performance counters

Once you've determined your remote session name, use the following instructions to collect the RemoteFX Graphics performance counters for your remote session.

1. Click **Start**, point to **Administrative Tools**, and then click **Performance Monitor**.
2. In the **Performance Monitor** dialog box, expand **Monitoring Tools**, select **Performance Monitor**, and then click **Add**.
3. In the **Add Counters** dialog box, from the **Available Counters** list, expand performance counter object for RemoteFX Graphics and select the counters to be monitored.
4. In the **Instances of Selected object** list, select the specific instances to be monitored for the selected counters and then click **Add**. To select all available counter instances, select **All instances**.
5. After adding the counters, click **OK**.

The selected performance counters appear on the Performance Monitor screen.

>[!Note]
>Each active session on a host has its own instance of each performance counter.

## Diagnosis

Graphics-related performance issues generally fall into four categories:

- Low frame rate
- Random stalls
- High input latency
- Poor frame quality

Start by addressing low frame rate, random stalls, and high input latency. The next section describes performance counters that measure the items.

### Performance counters

The process of identifying and fixing bottlenecks should be done in a serial manner.

First check the Output Frames/Second counter. It measures the number of frames made available to the client. If this value is less than the Input Frames/Second counter, frames are being skipped. To identify  the bottleneck, use the Frames Skipped/Second counters.

There are three types of Frames Skipped/Second counters:

- Frames Skipped/Second (Insufficient Network Resources)
- Frames Skipped/Second (Insufficient Client Resources)
- Frames Skipped/Second (Insufficient Server Resources)

A high value for any of the Frames Skipped/Second counters implies that the problem is related to the counter tracks. For example, if the client is unable to decode and present frames at the same rate that the server provides them, **Frames Skipped/Second (Insufficient Client Resources)** will be high.

If the Output Frames/Second counter matches the Input Frames/Second counter, yet you still have unusual lag or stalling, the issue may be the Average Encoding Time. Encode is a synchronous process that occurs on the server in the vGPU single-session scenario and on the VM in the multi-session scenario. Average Encoding Time should be under 33 ms. If Average Encoding Time is under 33 ms but you still notice performance issues, there could be a problem with an app or the operating system you're using.

For more information on diagnosing app-related issues, see [User Input Delay performance counters](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/rds-rdsh-performance-counters).

Because RDP supports an Average Encoding Time of 33 ms, it supports an input frame rate up to 30 frames/second. Note that this is the maximum supported frame rate—in many cases. The frame rate experienced by users will be lower, depending on the how often a frame is provided to RDP by the source. For example, certain use cases, like watching video, may demand a full input frame rate of 30 frames/second, but infrequently editing a word document will result in a much lower value for Input Frames/Second with no degradation in the user experience quality.

Finally, use the Frame Quality counter for frame quality issues. It expresses the quality of the output frame as a percentage of the quality of the source frame. The quality loss may be due to RemoteFX, or it may be inherent to the graphics source. If RemoteFX caused the quality loss, the issue may be a lack of network or server resources to send higher-fidelity content.

## Mitigation

For issues in which server resources are the bottleneck, one or more of the following instructions may help improve performance:

- Reduce the number of sessions per host.
- Increase the memory and compute resources on the server.
- Drop the resolution of the connection.

For issues in which network resources are the bottleneck, one or more of the following instructions may help improve network availability per session:

- Reduce the number of sessions per host.
- Drop the resolution of the connection.
- Use a higher-bandwidth network.

For issues in which client resources are the bottleneck, either or both of the following instructions may help improve performance:

- Install an 8ip client.
- Increase memory and compute resources on the client machine.

> [!Note]
> We currently don’t support the Source Frames/Second counter. The Source Frames/Second counter is always set to 0.

## Next steps

For an overview on troubleshooting Windows Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](https://docs.microsoft.com/azure/virtual-desktop/troubleshoot-set-up-overview).
To troubleshoot issues while configuring a virtual machine (VM) in Windows Virtual Desktop, see [Session host virtual machine configuration](https://docs.microsoft.com/azure/virtual-desktop/troubleshoot-vm-configuration).
To troubleshoot issues with Windows Virtual Desktop client connections, see [Remote Desktop client connections](https://docs.microsoft.com/azure/virtual-desktop/troubleshoot-client-connection).
To troubleshoot issues when using PowerShell with Windows Virtual Desktop, see [Windows Virtual Desktop PowerShell](https://docs.microsoft.com/azure/virtual-desktop/troubleshoot-powershell).
To learn more about the Preview service, see [Windows Desktop Preview environment](https://docs.microsoft.com/azure/virtual-desktop/environment-setup).
To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-tutorial-troubleshoot).
