---
title: What's new in the Azure Virtual Desktop Agent? - Azure
description: New features and product updates for the Azure Virtual Desktop Agent.
author: Heidilohr
ms.topic: release-notes
ms.date: 08/08/2023
ms.author: helohr
manager: femila
ms.custom: references_regions
---
# What's new in the Azure Virtual Desktop Agent?

The Azure Virtual Desktop Agent updates regularly. This article is where you'll find out about:

- The latest updates
- New features
- Improvements to existing features
- Bug fixes

Make sure to check back here often to keep up with new updates.

## Latest agent versions

New versions of the Azure Virtual Desktop Agent are installed automatically. When new versions are released, they're rolled out progressively to session hosts. This process is called *flighting* and it enables Microsoft to monitor the rollout in [validation environments](create-validation-host-pool.md) first.

A rollout may take several weeks before the agent is available in all environments. Some agent versions may not reach non-validation environments, so you may see multiple versions of the agent deployed across your environments.

## Version 1.0.7255.800 

This update was released at the end of July 2023 and includes the following changes: 

- Fixed an issue that would disable the Traversal Using Relay NAT (TURN) health check when a user disabled the Unified Datagram Protocol (UDP). 
- Security improvements and bug fixes. 

## Version 1.0.7033.1401 

This update was released at the end of July 2023 and includes the following changes: 

- Security improvements and bug fixes. 

## Version 1.0.6713.1603

This update was released at the end of July 2023 and includes the following changes:

- Security improvements and bug fixes.

## Version 1.0.7033.900

This update was released at the beginning of July 2023 and includes the following changes:

- General improvements and bug fixes.

## Version 1.0.6713.1300/1.0.6713.1600

This update was released at the beginning of June 2023 and includes the following changes:

- General improvements and bug fixes.

## Version 1.0.6713.400

This update was released at the end of May 2023 and includes the following changes:

- Fixed an issue that made the Remote Desktop Agent incorrectly report Hybrid Azure Active Directory (AD) Join virtual machines (VMs) as domain-joined.
- General improvements and bug fixes.

## Version 1.0.6425.1200

This update was released at the beginning of May 2023 and includes the following changes:

- General improvements and bug fixes.

## Version 1.0.6425.300

This update was released at the beginning of April 2023 and includes the following changes:

- General improvements and bug fixes.

## Version 1.0.6298.2100

This update was released at the end of March 2023 and includes the following changes:

- Health check reliability improved.
- Reliability issues in agent upgrade fixed.
- VM will be marked unhealthy when health check detects a required URL isn't unblocked.

## Version 1.0.6129.9100

This update was released in March 2023 and includes the following changes:

- General improvements and bug fixes.

## Version 1.0.6028.2200

This update was released in February 2023 and includes the following changes:

- Domain Trust health check is now enabled. When virtual machines fail the Domain Trust health check, they're now given the *Unavailable* status.
- General improvements and bug fixes.

## Version 1.0.5739.9000/1.0.5739.9800

>[!NOTE]
>You may see version 1.0.5739.9000 or 1.0.5739.9800 installed on session hosts depending on whether the host pool is configured to be a [validation environment](create-validation-host-pool.md). Version 1.0.5739.9000 was released to validation environments and version 1.0.5739.9800 was released to all other environments.
>
>Normally, all environments receive the same version. However, for this release, we had to adjust certain parameters unrelated to the Agent to allow this version to roll out to non-validation environments, which is why the non-validation version number is higher than the validation version number. Besides those changes, both versions are the same.

This update was released in January 2023 and includes the following changes:

- Added the RDGateway URL to URL Access Check.
- Introduced RD Agent provisioning state for new installations.
- Fixed error reporting in MSIX App Attach for apps with expired signatures.

## Version 1.0.5555.1010

This update was released in December 2022. There are no changes to the agent in this version.

## Version 1.0.5555.1008

This update was released in November 2022 and includes the following changes:

- Increased sensitivity of AppAttachRegister monitor for improved results.
- Fixed an error that slowed down Geneva Agent installation.
- Version updates for Include Stack.
- General improvements and bug fixes.

## Version 1.0.5388.1701

This update was released in August 2022 and includes the following changes:

- Fixed a bug that prevented the Agent MSI from downloading on the first try.
- Modified app attach on-demand registration.
- Enhanced the AgentUpdateTelemetry parameter to help with StackFlighting data.
- Removed unnecessary WebRTC health check.
- Fixed an issue with the RDAgentMetadata parameter.

## Version 1.0.5100.1100

This update was released in August 2022 and includes the following changes:

- Agent first-party extensions architecture completed.
- Fixed Teams error related to Azure Virtual Desktop telemetry.
- RDAgentBootloader - revision update to 1.0.4.0.
- SessionHostHealthCheckReport is now centralized in a NuGet package to be shared with first-party Teams.
- Fixes to AppAttach.

## Version 1.0.4739.1000

This update was released in July 2022 and includes the following changes:

- Report session load to Log Analytics for admins to get information on when MaxSessionLimit is reached.
- Adding AADTenant ID claim to the registration token.
- Report closing errors to diagnostics explicitly.

## Version 1.0.4574.1600

This update was released in June 2022 and includes the following changes:

- Fixed broker URL cache to address Agent Telemetry calls.
- Fixed some network-related issues. 
- Created two new mechanisms to trigger health checks.
- Additional general bug fixes and agent upgrades.

## Version 1.0.4230.1600

This update was released in March 2022 and includes the following changes:

- Fixes an issue with the agent health check result being empty for the first agent heart beat.
- Added Azure VM ID to the WVDAgentHealthStatus Log Analytics table.
- Updated the agent's update logic to install the Geneva Monitoring agent sooner.

## Version 1.0.4119.1500

This update was released in February 2022 and includes the following changes:

- Fixes an issue with arithmetic overflow casting exceptions.
- Updated the agent to now start the Azure Instance Metadata Service (IMDS) when the agent starts.
- Fixes an issue that caused Sandero name pipe service start ups to be slow when the VM has no registration information.
- General bug fixes and agent improvements.

## Version 1.0.4009.1500

This update was released in January 2022 and includes the following changes:

- Added logging to better capture agent update telemetry.
- Updated the agent's Azure Instance Metadata Service health check to be Azure Stack HCI-friendly.

## Version 1.0.3855.1400

This update was released December 2021 and has the following changes:

- Fixes an issue that caused an unhandled exception.
- This version now supports Azure Stack HCI by retrieving VM metadata from the Azure Arc service.
- This version now allows built-in stacks to be automatically updated if its version number is beneath a certain threshold.
- The UrlsAccessibleCheck health check now only gets the URL until the path delimiter to prevent 404 errors.

## Version 1.0.3719.1700

This update was released November 2021 and has the following changes:

- Updated agent error messages.
- Fixes an issue with the agent restarting every time the side-by-side stack was updated.
- General agent improvements.

## Version 1.0.3583.2600

This update was released October 2021 and it fixes an issue where upgrading from Windows 10 to Windows 11 disabled the side-by-side stack.

## Version 1.0.3373.2605

This update was released September 2021 and it fixes an issue with package deregistration getting stuck when using MSIX App Attach.

## Version 1.0.3373.2600

This update was released September 2021 and has the following changes:

- General agent improvements.
- Fixes issues with restarting the agent on Windows 7 VMs.
- Fixes an issue with fields in the WVDAgentHealthStatus table not showing up correctly.

## Version 1.0.3130.2900

This update was released July 2021 and has the following changes:

- General improvements and bug fixes.
- Fixes an issue with getting the host pool path for Intune registration.
- Added logging to better diagnose agent issues.
- Fixes an issue with orchestration timeouts.

## Version 1.0.3050.2500

This update was released July 2021 and has the following changes:

- Updated internal monitors for agent health.
- Updated retry logic for stack health.

## Version 1.0.2990.1500

This update was released April 2021 and has the following changes:

- Updated agent error messages.
- Added an exception that prevents you from installing non-Windows 7 agents on Windows 7 VMs.
- Has updated heartbeat service logic.

## Version 1.0.2944.1400

This update was released April 2021 and has the following changes:

- Placed links to the Azure Virtual Desktop Agent troubleshooting guide in the event viewer logs for agent errors.
- Added an additional exception for better error handling.
- Added the WVDAgentUrlTool.exe that allows customers to check which required URLs they can access.

## Version 1.0.2866.1500

This update was released March 2021 and it fixes an issue with the stack health check.

## Version 1.0.2800.2802

This update was released March 2021 and it has general improvements and bug fixes.

## Version 1.0.2800.2800

This update was released March 2021 and it fixes a reverse connection issue.

## Version 1.0.2800.2700

This update was released February 2021 and it fixes an access denied orchestration issue.
