---
title: Retrieving support files from calling SDK applications
description: Understand how to access Log Files for the creation of effective support tools
author:      ahammer
ms.author:   adamhammer
ms.service:  azure-communication-services
ms.topic:    conceptual
ms.date:     07/17/2023
---

# Overview of Log File Access
[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

Modern sandboxed applications can sometimes face challenges that hinder user experience. Key among these challenges is the difficulty for an end-user to access the applications internal files such as log files. The Log File Access API offers a solution, helping facilitate access to support files, and eventual export from the device into the support process.

### For Third-party Application Developers:
Log file access eliminates the process of manually finding logs or requiring a development environment to extract them. Instead, it paves the way for a direct method to hand off crucial information. This not only speeds up the troubleshooting process but also enhances the overall user experience, as issues can be diagnosed and rectified more efficiently.

### From Microsoft's Perspective:
For Microsoft, the primary aim is to ensure that any issues arising from our platforms are addressed swiftly and effectively. Seamless log handoffs between your support team and ours enable our engineering teams to get a clear picture of the challenge at hand, diagnose it accurately, and set about resolving it. 

## Integrating Log Collection in Third-Party Applications

**Developer Considerations:**  
As a developer, it's crucial to understand how and when to capture logs. When issues arise, timely delivery of log files aids in faster diagnostics and resolutions. 

1. **Timeliness**: Always prioritize the immediate retrieval of logs. The closer to the time of the incident, the more relevant and insightful the data will be.
2. **User Interaction**: Determine the most intuitive way for your users to report problems. A seamless user experience can encourage more accurate and timely reporting.
3. **Support Integration**: Consider how your support teams access these logs. Integration should be straightforward, ensuring efficient troubleshooting.
4. **Collaboration with Azure**: Ensure easy accessibility for Azure's teams, perhaps through a direct link or a streamlined request mechanism.

By addressing these elements, you can craft a system that not only serves the immediate needs of your users but also sets the stage for effective collaboration with Microsoft's support infrastructure.

## Implementing Log Collection in Your Application

When you are incorporating log collection strategies into your application, the responsibility to ensure the privacy and security of these logs lies with the developers. However, we're here to provide some suggestions to enhance your implementation process.

### "Report an Issue" Dialog

A simple yet effective method is the "Report an Issue" feature. Think of it as a direct line between the user and support. After a user encounters an issue, a prompt can ask users if they wish to report the problem. If they agree, logs can be automatically attached and sent to the relevant support channels.

### Feedback After the Call

Right after a call might be an opportune time to gather feedback. Using an end-of-call survey can be beneficial. Here, users can provide feedback on the call quality and, if needed, attach logs of any issues faced. This feedback ensures timely and relevant data collection.

### Shake-to-Report Feature

Taking inspiration from Microsoft Teams, consider integrating a shake-to-report feature. The user can shake their device and initiate the process to report an issue. It's a user-friendly method, but remember to inform users about this feature to ensure its effective use.

### Proactive Auto-Detection

For a more advanced approach, consider having the system automatically detect potential call issues. Upon detection, users can be prompted to share logs. It's a proactive measure, ensuring issues are caught early, but it's crucial to strike a balance to avoid unnecessary prompts.

## Choosing the Best Strategy

User consent is paramount. Always inform and ensure users are aware of what they're sharing and why. Each application and its user base are unique. Reflect on past interactions, and consider the resources at hand. These considerations guide you to select the best strategy for your application, ensuring a smooth user experience and efficient troubleshooting.

## Further Reading

- [End of Call Survey Conceptual Document](../voice-video-calling/end-of-call-survey-concept.md)
- [Troubleshooting Info](../troubleshooting-info.md)
- [Log Sharing Tutorial](../../tutorials/log-file-retrieval-tutorial.md)