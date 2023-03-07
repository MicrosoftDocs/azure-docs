---
title: Respond to Microsoft Defender for DNS alerts - Microsoft Defender for Cloud
description: Learn best practices for responding to alerts that indicate security risks in DNS services.
ms.date: 6/21/2022
ms.topic: how-to
ms.author: benmansheim
author: bmansheim
---

# Respond to Microsoft Defender for DNS alerts

When you receive an alert from Microsoft Defender for DNS, we recommend you investigate and respond to the alert as described below. Microsoft Defender for DNS protects all connected resources, so even if you're familiar with the application or user that triggered the alert, it's important to verify the situation surrounding every alert.  

## Step 1. Contact

1. Contact the resource owner to determine whether the behavior was expected or intentional.
1. If the activity is expected, dismiss the alert.
1. If the activity is unexpected, treat the resource as potentially compromised and mitigate as described in the next step.

## Step 2. Immediate mitigation 

1. Isolate the resource from the network to prevent lateral movement.
1. Run a full antimalware scan on the resource, following any resulting remediation advice.
1. Review installed and running software on the resource, removing any unknown or unwanted packages.
1. Revert the machine to a known good state, reinstalling the operating system if required, and restore software from a verified malware-free source.
1. Resolve any Microsoft Defender for Cloud recommendations for the machine, remediating highlighted security issues to prevent future breaches.

## Next steps

Now that you know how to respond to DNS alerts, find out more about how to manage alerts. 

> [!div class="nextstepaction"]
> [Manage security alerts](managing-and-responding-alerts.md)

For related material, see the following articles: 

- To [export Defender for Cloud alerts](export-to-siem.md) to your centralized security information and event management (SIEM) system, such as Microsoft Sentinel, any third-party SIEM, or any other external tool.
- To [send alerts to in real-time](continuous-export.md) to Log Analytics or Event Hubs to create automated processes to analyze and respond to security alerts.