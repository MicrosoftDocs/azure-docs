---
title: How to respond to Azure Defender for Resource Manager alerts
description: Learn about the steps necessary for responding to alerts from Azure Defender for Resource Manager
author: memildin
ms.author: memildin
ms.date: 12/07/2020
ms.topic: how-to
ms.service: security-center
manager: rkarlin

---

# Respond to Azure Defender for Resource Manager alerts

When you receive an alert from Azure Defender for Resource Manager, we recommend you investigate and respond to the alert as described below. Azure Defender for Resource Manager protects all connected resources, so even if you're familiar with the application or user that triggered the alert, it's important to verify the situation surrounding every alert.  


## Step 1. Contact

1. Contact the resource owner to determine whether the behavior was expected or intentional.
1. If the activity is expected, dismiss the alert.
1. If the activity is unexpected, treat the related user accounts, subscriptions, and virtual machines as compromised and mitigate as described in the following step.

## Step 2. Immediate mitigation 

1. Remediate compromised user accounts:
    - If they’re unfamiliar, delete them as they may have been created by a threat actor
    - If they’re familiar, change their authentication credentials
    - Use Azure Activity Logs to review all activities performed by the user and identify any that are suspicious

1. Remediate compromised subscriptions:
    - Remove any unfamiliar Runbooks from the compromised automation account
    - Review IAM permissions for the subscription and remove permissions for any unfamiliar user account
    - Review all Azure resources in the subscription and delete any that are unfamiliar
    - Review and investigate any security alerts for the subscription in Azure Security Center
    - Use Azure Activity Logs to review all activities performed in the subscription and identify any that are suspicious

1. Remediate the compromised virtual machines
    - Change the passwords for all users
    - Run a full antimalware scan on the machine
    - Reimage the machines from a malware-free source


## Next steps

This page explained the process of responding to an alert from Azure Defender for Resource Manager. For related information see the following pages:

- [Introduction to Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md)
- [Suppress alerts from Azure Defender](alerts-suppression-rules.md)
- [Continuously export Security Center data](continuous-export.md)