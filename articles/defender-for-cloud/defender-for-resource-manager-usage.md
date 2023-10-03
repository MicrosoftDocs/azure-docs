---
title: How to respond to Microsoft Defender for Resource Manager alerts
description: Learn about the steps necessary for responding to alerts from Microsoft Defender for Resource Manager
ms.date: 11/09/2021
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
---

# Respond to Microsoft Defender for Resource Manager alerts

When you receive an alert from Microsoft Defender for Resource Manager, we recommend you investigate and respond to the alert as described below. Defender for Resource Manager protects all connected resources, so even if you're familiar with the application or user that triggered the alert, it's important to verify the situation surrounding every alert.  

## Step 1: Contact

1. Contact the resource owner to determine whether the behavior was expected or intentional.
1. If the activity is expected, dismiss the alert.
1. If the activity is unexpected, treat the related user accounts, subscriptions, and virtual machines as compromised and mitigate as described in the following step.

## Step 2: Investigate alerts from Microsoft Defender for Resource Manager

Security alerts from Defender for Resource Manager are based on threats detected by monitoring Azure Resource Manager operations. Defender for Cloud uses internal log sources of Azure Resource Manager as well as Azure Activity log, a platform log in Azure that provides insight into subscription-level events.

Defender for Resource Manager provides visibility into activity that comes from third party service providers that have delegated access as part of the resource manager alerts. For example, `Azure Resource Manager operation from suspicious proxy IP address - delegated access`.

`Delegated access` refers to access with [Azure Lighthouse](/azure/lighthouse/overview) or with [Delegated administration privileges](/partner-center/dap-faq). 

Alerts that show `Delegated access` also include a customized description and remediation steps.

Learn more about [Azure Activity log](../azure-monitor/essentials/activity-log.md).

To investigate security alerts from Defender for Resource Manager:

1. Open Azure Activity log.

    :::image type="content" source="media/defender-for-resource-manager-introduction/opening-azure-activity-log.png" alt-text="How to open Azure Activity log.":::

1. Filter the events to:
    - The subscription mentioned in the alert
    - The timeframe of the detected activity
    - The related user account (if relevant)

1. Look for suspicious activities.

> [!TIP]
> For a better, richer investigation experience, stream your Azure activity logs to Microsoft Sentinel as described in [Connect data from Azure Activity log](../sentinel/data-connectors/azure-activity.md).

## Step 3: Immediate mitigation 

1. Remediate compromised user accounts:
    - If they’re unfamiliar, delete them as they may have been created by a threat actor
    - If they’re familiar, change their authentication credentials
    - Use Azure Activity Logs to review all activities performed by the user and identify any that are suspicious

1. Remediate compromised subscriptions:
    - Remove any unfamiliar Runbooks from the compromised automation account
    - Review IAM permissions for the subscription and remove permissions for any unfamiliar user account
    - Review all Azure resources in the subscription and delete any that are unfamiliar
    - Review and investigate any security alerts for the subscription in Microsoft Defender for Cloud
    - Use Azure Activity Logs to review all activities performed in the subscription and identify any that are suspicious

1. Remediate the compromised virtual machines
    - Change the passwords for all users
    - Run a full antimalware scan on the machine
    - Reimage the machines from a malware-free source

## Next steps

This page explained the process of responding to an alert from Defender for Resource Manager. For related information, see the following pages:

- [Overview of Microsoft Defender for Resource Manager](defender-for-resource-manager-introduction.md)
- [Suppress security alerts](alerts-suppression-rules.md)
- [Continuously export Defender for Cloud data](continuous-export.md)

