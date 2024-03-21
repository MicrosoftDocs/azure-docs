---
title: What's new in the Azure Virtual Desktop Agent? - Azure
description: New features and product updates for the Azure Virtual Desktop Agent.
author: Heidilohr
ms.topic: release-notes
ms.date: 03/18/2024
ms.author: helohr
ms.custom: references_regions
---
# What's new in the Azure Virtual Desktop Agent?

The Azure Virtual Desktop Agent updates regularly. This article is where you'll find out about:

- The latest updates
- New features
- Improvements to existing features
- Bug fixes

Make sure to check back here often to keep up with new updates.

## Latest available versions

New versions of the Azure Virtual Desktop Agent are installed automatically. When new versions are released, they're rolled out progressively to session hosts. This process is called *flighting* and it enables Microsoft to monitor the rollout in [validation environments](create-validation-host-pool.md) first.

A rollout may take several weeks before the agent is available in all environments. Some agent versions may not reach non-validation environments, so you may see multiple versions of the agent deployed across your environments.

| Release | Latest version |
|--|--|
| Production | 1.0.8297.800 |
| Validation | 1.0.8431.1500  |

> [!TIP]
> The Azure Virtual Desktop Agent is automatically installed when adding session hosts in most scenarios. If you need to install the agent manually, you can download it at [Register session hosts to a host pool](add-session-hosts-host-pool.md#register-session-hosts-to-a-host-pool), together with the steps to install it.

## Version 1.0.8431.1500 (validation)

*Published: March 2024*

In this update, we've made the following changes: 

- General improvements and bug fixes.

## Version 1.0.8297.800

*Published: February 2024*

In this update, we've made the following changes: 

- General improvements and bug fixes. 

## Version 1.0.8297.400

*Published: January 2024*

In this update, we've made the following changes:

- General improvements and bug fixes. 

## Version 1.0.7909.2600  

*Published: December 2023*

In this update, we've made the following changes: 

- Windows 7 session hosts no longer receive side-by-side stack updates.

- General improvements and bug fixes. 

## Version 1.0.7909.1200

*Published: November 2023*

In this release, we've made the following change:

- General improvements and bug fixes. 

## Version 1.0.7755.1800

*Published: November 2023*

In this release, we've made the following change:

- General improvements and bug fixes. 

## Version 1.0.7755.1100

*Published: September 2023*

In this release, we've made the following change:

- Security improvements and bug fixes. 

## Version 1.0.7539.8300

*Published: September 2023*

In this release, we've made the following change:

- Security improvements and bug fixes. 

## Version 1.0.7539.5800

*Published: September 2023*

In this release, we've made the following change:

- Security improvements and bug fixes.

## Version 1.0.7255.1400

*Published: August 2023*

In this release, we've made the following change:

- Security improvements and bug fixes.

## Version 1.0.7255.800

*Published: July 2023*

In this release, we've made the following changes:

- Fixed an issue that would disable the Traversal Using Relay NAT (TURN) health check when a user disabled the Unified Datagram Protocol (UDP). 
- Security improvements and bug fixes. 

## Version 1.0.7033.1401

*Published: July 2023*

In this release, we've made the following change:

- Security improvements and bug fixes. 

## Version 1.0.6713.1603

*Published: July 2023*

In this release, we've made the following change:

- Security improvements and bug fixes.

## Version 1.0.7033.900

*Published: July 2023*

In this release, we've made the following change:

- General improvements and bug fixes.

## Version 1.0.6713.1300/1.0.6713.1600

*Published: June 2023*

In this release, we've made the following change:

- General improvements and bug fixes.

## Version 1.0.6713.400

*Published: May 2023*

In this release, we've made the following changes:

- Fixed an issue that made the Remote Desktop Agent incorrectly report Hybrid Azure Active Directory (AD) Join virtual machines (VMs) as domain-joined.
- General improvements and bug fixes.

## Version 1.0.6425.1200

*Published: May 2023*

In this release, we've made the following change:

- General improvements and bug fixes.

## Version 1.0.6425.300

*Published: April 2023*

In this release, we've made the following change:

- General improvements and bug fixes.

## Version 1.0.6298.2100

*Published: March 2023*

In this release, we've made the following changes:

- Health check reliability improved.
- Reliability issues in agent upgrade fixed.
- VM will be marked unhealthy when health check detects a required URL isn't unblocked.

## Version 1.0.6129.9100

*Published: March 2023*

In this release, we've made the following change:

- General improvements and bug fixes.

## Version 1.0.6028.2200

*Published: February 2023*

In this release, we've made the following changes:

- Domain Trust health check is now enabled. When virtual machines fail the Domain Trust health check, they're now given the *Unavailable* status.
- General improvements and bug fixes.

## Version 1.0.5739.9000/1.0.5739.9800

*Published: January 2023*

>[!NOTE]
>You may see version 1.0.5739.9000 or 1.0.5739.9800 installed on session hosts depending on whether the host pool is configured to be a [validation environment](create-validation-host-pool.md). Version 1.0.5739.9000 was released to validation environments and version 1.0.5739.9800 was released to all other environments.
>
>Normally, all environments receive the same version. However, for this release, we had to adjust certain parameters unrelated to the Agent to allow this version to roll out to non-validation environments, which is why the non-validation version number is higher than the validation version number. Besides those changes, both versions are the same.

In this release, we've made the following changes:

- Added the RDGateway URL to URL Access Check.
- Introduced RD Agent provisioning state for new installations.
- Fixed error reporting in MSIX App Attach for apps with expired signatures.

## Version 1.0.5555.1010

*Published: December 2022*

This release didn't include any major changes to the agent.

## Version 1.0.5555.1008

*Published: November 2022*

In this release, we've made the following changes:

- Increased sensitivity of AppAttachRegister monitor for improved results.
- Fixed an error that slowed down Geneva Agent installation.
- Version updates for Include Stack.
- General improvements and bug fixes.

## Version 1.0.5388.1701

*Published: August 2022*

In this release, we've made the following changes:

- Fixed a bug that prevented the Agent MSI from downloading on the first try.
- Modified app attach on-demand registration.
- Enhanced the AgentUpdateTelemetry parameter to help with StackFlighting data.
- Removed unnecessary WebRTC health check.
- Fixed an issue with the RDAgentMetadata parameter.

## Version 1.0.5100.1100

*Published: August 2022*

In this release, we've made the following changes:

- Agent first-party extensions architecture completed.
- Fixed Teams error related to Azure Virtual Desktop telemetry.
- RDAgentBootloader - revision update to 1.0.4.0.
- SessionHostHealthCheckReport is now centralized in a NuGet package to be shared with first-party Teams.
- Fixes to AppAttach.

## Version 1.0.4739.1000

*Published: July 2022*

In this release, we've made the following changes:

- Report session load to Log Analytics for admins to get information on when MaxSessionLimit is reached.
- Adding AADTenant ID claim to the registration token.
- Report closing errors to diagnostics explicitly.

## Version 1.0.4574.1600

*Published: June 2022*

In this release, we've made the following changes:

- Fixed broker URL cache to address Agent Telemetry calls.
- Fixed some network-related issues. 
- Created two new mechanisms to trigger health checks.
- Additional general bug fixes and agent upgrades.

## Version 1.0.4230.1600

*Published: March 2022*

In this release, we've made the following changes:

- Fixes an issue with the agent health check result being empty for the first agent heart beat.
- Added Azure VM ID to the WVDAgentHealthStatus Log Analytics table.
- Updated the agent's update logic to install the Geneva Monitoring agent sooner.

## Version 1.0.4119.1500

*Published: February 2022*

In this release, we've made the following changes:

- Fixes an issue with arithmetic overflow casting exceptions.
- Updated the agent to now start the Azure Instance Metadata Service (IMDS) when the agent starts.
- Fixes an issue that caused Sandero name pipe service start ups to be slow when the VM has no registration information.
- General bug fixes and agent improvements.

## Version 1.0.4009.1500

*Published: January 2022*

In this release, we've made the following changes:

- Added logging to better capture agent update telemetry.
- Updated the agent's Azure Instance Metadata Service health check to be Azure Stack HCI-friendly.

## Version 1.0.3855.1400

*Published: December 2021*

In this release, we've made the following changes:

- Fixes an issue that caused an unhandled exception.
- This version now supports Azure Stack HCI by retrieving VM metadata from the Azure Arc service.
- This version now allows built-in stacks to be automatically updated if its version number is beneath a certain threshold.
- The UrlsAccessibleCheck health check now only gets the URL until the path delimiter to prevent 404 errors.

## Version 1.0.3719.1700

*Published: November 2021*

In this release, we've made the following changes:

- Updated agent error messages.
- Fixes an issue with the agent restarting every time the side-by-side stack was updated.
- General agent improvements.

## Version 1.0.3583.2600

*Published: October 2021*

In this release, we've made the following change:

- Fixed an issue where upgrading from Windows 10 to Windows 11 disabled the side-by-side stack.

## Version 1.0.3373.2605

*Published: September 2021*

In this release, we've made the following change:

- Fixed an issue with package deregistration getting stuck when using MSIX App Attach.

## Version 1.0.3373.2600

*Published: September 2021*

In this release, we've made the following changes:

- General agent improvements.
- Fixes issues with restarting the agent on Windows 7 VMs.
- Fixes an issue with fields in the WVDAgentHealthStatus table not showing up correctly.

## Version 1.0.3130.2900

*Published: July 2021*

In this release, we've made the following changes:

- General improvements and bug fixes.
- Fixes an issue with getting the host pool path for Intune registration.
- Added logging to better diagnose agent issues.
- Fixes an issue with orchestration timeouts.

## Version 1.0.3050.2500

*Published: July 2021*

In this release, we've made the following changes:

- Updated internal monitors for agent health.
- Updated retry logic for stack health.

## Version 1.0.2990.1500

*Published: April 2021*

In this release, we've made the following changes:

- Updated agent error messages.
- Added an exception that prevents you from installing non-Windows 7 agents on Windows 7 VMs.
- Has updated heartbeat service logic.

## Version 1.0.2944.1400

*Published: April 2021*

In this release, we've made the following changes:

- Placed links to the Azure Virtual Desktop Agent troubleshooting guide in the event viewer logs for agent errors.
- Added an additional exception for better error handling.
- Added the WVDAgentUrlTool.exe that allows customers to check which required URLs they can access.

## Version 1.0.2866.1500

*Published: March 2021*

In this release, we've made the following change:

- Fixed an issue with the stack health check.

## Version 1.0.2800.2802

*Published: March 2021*

In this release, we've made the following change:

- General improvements and bug fixes.

## Version 1.0.2800.2800

*Published: March 2021*

In this release, we've made the following change:

- Fixed a reverse connection issue.

## Version 1.0.2800.2700

*Published: February 2021*

In this release, we've made the following change:

- Fixed an access denied orchestration issue.
