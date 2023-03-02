---
title: Feature support and retirement
description: Defender for IoT will continue to support C, C#, and Edge until March 1, 2022. 
ms.date: 01/01/2023
ms.topic: how-to
---

# Feature support and retirement

This article describes Microsoft Defender for IoT features and support for different capabilities within Defender for IoT.

## Legacy Defender for IoT micro-agent

The Defender-IoT-micro-agent has been replaced by our newer micro-agent experience.

For more information, see [Tutorial: Create a DefenderIotMicroAgent module twin (Preview)](tutorial-create-micro-agent-module-twin.md) and [Tutorial: Install the Defender for IoT micro agent (Preview)](tutorial-standalone-agent-binary-installation.md).

### Timeline

Microsoft Defender for IoT will continue to support the legacy Microsoft Defender for IoT experience under IoT hub until March 31, 2023.

## Defender for IoT C, C#, and Edge Defender-IoT-micro-agent deprecation

The new micro agent will replace the current C, C#, and Edge Defender-IoT-micro-agent.  

The new micro agent development is based on the knowledge, and experience gathered from the legacy security module development, customers, and feedback from partners with four important improvements:

- **Depth security value**: The new agent will run on the host level, which will provide more visibility to the underlying operations of the device, and to allow for better security coverage.

- **Improved device performance and reduced footprint**: Achieved by a small RAM, and ROM memory footprint as well as low CPU consumption.  

- **Plug and play**: The new micro agent has no kernel level dependencies anymore, and all of its software dependencies are provided as part of its package. The micro agent supports common CPU architecture.

- **Easy to deploy**: The micro agent supports different distribution models, through source code, and as a binary package. 

### Timeline 

Defender for IoT will continue to support C, C#, and Edge until March 1, 2022. 

## Micro agent preview support

During the preview the micro agent may experience breaking changes without notice.

## Next steps

Check out [Microsoft Defender for IoT agent frequently asked questions](resources-agent-frequently-asked-questions.md).
