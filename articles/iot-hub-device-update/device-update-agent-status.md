---
title: Device Update agent status API for on-device coordination | Microsoft Docs
description: Device-side API for querying the Device Update agent’s current state.
author: isabellaecr
ms.author: isabellac
ms.date: 4/27/2026
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Device Update agent status API for on-device coordination
The Device Update agent status API enables other processes on the device to query the Device Update (ADU) agent’s current high-level state—such as Idle, Downloading, Installing, or Rebooting—without requiring a round-trip to Azure IoT Hub. 

This API is available starting in Device Update agent reference implementation version 1.3.0. It is designed for device-local coordination, where applications such as supervisors, power managers, or orchestration services running on the device need to understand what the update process is doing in real time.

By exposing the agent’s current state locally, the API helps device software avoid interrupting updates, coordinate operations safely, and reduce disruptions during update workflows.

> [!IMPORTANT]
> This is a device-local API for on-device apps. It does not report status to IoT Hub or provide granular progress updates in IoT Hub.

## When to use the agent status API

Use this API when device software must coordinate with the Device Update agent workflow to avoid disrupting updates or to sequence operations safely. Common scenarios include:

- **Power management (battery-powered / low-power devices)**  
  Before entering sleep or low-power mode, a device can check the agent’s current state (for example, `Downloading` or `Installing`) and delay sleep until the agent is idle. This helps prevent interrupted downloads, incomplete installs, or unnecessary retries.

- **Orchestration and supervision**  
  A device orchestrator or supervisor can wait until the agent is idle before triggering its own firmware update, factory reset, or configuration change. This reduces the risk of conflicting operations that could disrupt the device or update workflow.

- **Local monitoring and diagnostics**  
  A local dashboard, logging service, or edge monitoring component can poll the agent state and surface it to a device-local UI or external system, improving visibility into what the device is doing during update workflows.

## How it works (high level)

Starting in Device Update agent reference implementation version 1.3.0, the agent status API is made available to other on-device processes through a small client SDK:

- **Your app links to a static library.**  
  The SDK is shipped as a static library (`libaducsdk.a`) that your application links against. Your app also includes the SDK header (for example, `aducsdk.h`) to access the API and status types.

- **Your app calls a simple function to get the current state.**  
  For example, your app calls `GetAduServiceStatus()` and receives a value that represents the agent’s current high-level state (like `Idle`, `Downloading`, or `Installing`).

- **The library communicates with the running Device Update agent locally.**  
  At runtime, the library communicates with the Device Update agent on the same device using a local communication channel. This is why the call is fast and does not require a network request or a cloud round-trip.

Because this is a device-local call, it can return the agent’s current state even if the device is temporarily offline. 

## Agent view states

The API returns an enum-like value that represents the agent’s current activity from the perspective of an external consumer (a separate process on the device). Examples of view states include:

- **Idle:** The agent is not actively processing an update workflow.
- **Downloading:** The agent is downloading update content.
- **Installing:** The agent is installing or applying update content.
- **Rebooting:** The device is rebooting as part of an update workflow.
- **Paused:** The agent is in a quiet/hold period. See [Quiet period and the `Paused` state](#quiet-period-and-the-paused-state).

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

For fleet troubleshooting and support workflows, use Device Update diagnostics (deployment error codes, Agent Check, and remote log collection). See [Understand Device Update for Azure IoT Hub diagnostic features](/azure/iot-hub-device-update/device-update-diagnostics)

## Implementation steps
For the SDK package contents, build and install instructions, code samples, IPC details, and Yocto integration guidance, see [Service Status API — GetAduServiceStatus](https://github.com/Azure/iot-hub-device-update/blob/develop/docs/agent-reference/GetAduServiceStatus.md)

## Related content

- [Understand Device Update for Azure IoT Hub diagnostic features](/azure/iot-hub-device-update/device-update-diagnostics)
