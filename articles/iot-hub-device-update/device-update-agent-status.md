---
title: Device Update for Azure IoT Hub agent status API | Microsoft Docs
description: Device-side API for querying the Device Update agent’s current state.
author: isabellaecr
ms.author: isabellaecr
ms.date: 4/27/2026
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Device Update for Azure IoT Hub agent status API (GetAduServiceStatus)

The Device Update agent status API enables **other processes on the device** to query the Device Update (ADU) agent’s current high-level state—such as **Idle**, **Downloading**, **Installing**, or **Rebooting**—without requiring a round-trip to Azure IoT Hub. 

This capability is designed for **device-local orchestration**, where an application, supervisor, or power manager running on the device needs a reliable signal about what the ADU agent is doing right now. 

> [!IMPORTANT]
> This is a **device-local** API for on-device apps. It does not report status to IoT Hub or provide granular progress updates in IoT Hub.

> [!NOTE]
> **Available in Device Update agent version 1.3.0 and later.**

## When to use the agent status API

Use this API when other device software must coordinate with the ADU agent lifecycle to avoid disrupting updates or to sequence operations safely. Common scenarios include:

- **Power management (battery-powered / low-power devices)**  
  Before entering sleep/low-power mode, a device can **check the agent’s current state** (for example, `Downloading` or `Installing`) and **delay sleep until the agent is idle**, reducing the risk of pausing an update or dropping a download mid-transfer.

- **Orchestration and supervision**  
  A device orchestrator can wait until the agent is idle before triggering its own firmware update, factory reset, or configuration change.

- **Local monitoring and diagnostics**  
  A local dashboard or logging daemon can poll the agent state and forward it to a device-local UI or a separate fleet management system.

## How it works (high level)

Starting in Device Update agent **1.3.0**, the agent status API is exposed to other on-device processes through a small client SDK:

- **Your app links to a static library.**  
  The SDK is shipped as a **static library** (`libaducsdk.a`) that your application links against. Your app also includes the SDK header (for example, `aducsdk.h`) to access the API and status types.

- **Your app calls a simple function to get the current state.**  
  For example, your app calls `GetAduServiceStatus()` and receives a value that represents the agent’s current high-level state (like `Idle`, `Downloading`, or `Installing`).

- **The library talks to the running Device Update agent locally.**  
  At runtime, the library communicates with the Device Update agent **on the same device** using a local communication channel. This is why the call is fast and does not require a network request or a cloud round-trip.

Because this is a **device-local call**, it can return the agent’s current state even if the device is temporarily offline. 

## Agent view states

The API returns an enum-like value that represents the agent’s current activity from the perspective of an external consumer (a separate process on the device). Examples of view states include:

- **Idle** – The agent is not actively processing an update workflow.
- **Downloading** – The agent is downloading update content.
- **Installing** – The agent is installing or applying update content.
- **Rebooting** – The device is rebooting as part of an update workflow.
- **Paused** – The agent is in a quiet/hold period. See [Quiet period and the `Paused` state](#quiet-period-and-the-paused-state).

For the authoritative list of states and their definitions, refer to [Service Status API — GetAduServiceStatus](https://github.com/Azure/iot-hub-device-update/blob/develop/docs/agent-reference/GetAduServiceStatus.md)


### Guidance for safe interpretation

As a general rule, treat non-idle states (for example, **Downloading**, **Installing**, **Rebooting**) as “do not interrupt” signals for operations that could disrupt the update workflow. If your system supports scheduling or power policies, delay disruptive actions until the agent reports a safe state for your scenario.

## Quiet period and the `Paused` state

Some devices need a stronger signal than “not downloading/installing” to safely perform power-saving or disruptive operations.

After completing an update workflow, the agent can enter a configurable **quiet period**, during which it temporarily ignores certain incoming messages and performs post-update housekeeping. During this window, the status API returns **Paused**.

This lets on-device software distinguish between:

- **Paused**: The agent is in a post-update quiet period; client processes can treat the device as quiescent for certain operations (for example, entering low-power mode).
- **Idle**: The agent has resumed normal operation and may process new work.


## Relationship to Device Update diagnostics and troubleshooting

The agent status API is **device-local** and is intended for applications running on the device (for example, power management or an on-device supervisor). It **does not** replace Device Update’s service-side diagnostics in the Azure portal.

For fleet troubleshooting and support workflows, use Device Update diagnostics (deployment error codes, Agent Check, and remote log collection). See [Understand Device Update for Azure IoT Hub diagnostic features](https://learn.microsoft.com/azure/iot-hub-device-update/device-update-diagnostics)

## Implementation steps
For the SDK package contents, build and install instructions, code samples, IPC details, and Yocto integration guidance, see [Service Status API — GetAduServiceStatus](https://github.com/Azure/iot-hub-device-update/blob/develop/docs/agent-reference/GetAduServiceStatus.md)

## Related content

- [Understand Device Update for Azure IoT Hub diagnostic features](https://learn.microsoft.com/en-us/azure/iot-hub-device-update/device-update-diagnostics)
