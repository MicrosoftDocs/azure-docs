---
title: How to respond to Azure Defender for DNS alerts
description: Learn about the steps necessary for responding to alerts from Azure Defender for DNS
author: memildin
ms.author: memildin
ms.date: 12/07/2020
ms.topic: how-to
ms.service: security-center
manager: rkarlin

---

# Respond to Azure Defender for DNS alerts

When you receive an alert from Azure Defender for DNS, we recommend you investigate and respond to the alert as described below. Azure Defender for DNS protects all connected resources, so even if you're familiar with the application or user that triggered the alert, it's important to verify the situation surrounding every alert.  


## Step 1. Contact

1. Contact the resource owner to determine whether the behavior was expected or intentional.
1. If the activity is expected, dismiss the alert.
1. If the activity is unexpected, treat the resource as potentially compromised and mitigate as described in the next step.

## Step 2. Immediate mitigation 

1. Isolate the resource from the network to prevent lateral movement.
1. Run a full antimalware scan on the resource, following any resulting remediation advice.
1. Review installed and running software on the resource, removing any unknown or unwanted packages.
1. Revert the machine to a known good state, reinstalling the operating system if required, and restore software from a verified malware-free source.
1. Resolve any Azure Security Center recommendations for the machine, remediating highlighted security issues to prevent future breaches.


## Next steps

This page explained the process of responding to an alert from Azure Defender for DNS. For related information see the following pages:

- [Introduction to Azure Defender for DNS](defender-for-dns-introduction.md)
- [Suppress alerts from Azure Defender](alerts-suppression-rules.md)
- [Continuously export Security Center data](continuous-export.md)