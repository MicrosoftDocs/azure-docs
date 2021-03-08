---
title: Built-in & custom alerts list
description: Learn about security alerts and recommended remediation using Defender for IoT Hub's features and service.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: shhazam-ms
manager: rkarlin
editor: ''

ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/16/2021
ms.author: shhazam
---

# Defender for IoT Hub security alerts

Defender for IoT continuously analyzes your IoT solution using advanced analytics and threat intelligence to alert you to malicious activity.
In addition, you can create custom alerts based on your knowledge of expected device behavior.
An alert acts as an indicator of potential compromise, and should be investigated and remediated.

In this article, you will find a list of built-in alerts, which can be triggered on your IoT Hub.
In addition to built-in alerts, Defender for IoT allows you to define custom alerts based on expected IoT Hub and/or device behavior.
For more information, see [customizable alerts](concept-customizable-security-alerts.md).

## Built-in alerts for IoT Hub

| Severity | Name | Description | Suggested remediation |
|--|--|--|--|
| **Medium** severity |  |  |  |
| New certificate added to an IoT Hub | Medium | A certificate named \'%{DescCertificateName}\' was added to IoT Hub \'%{DescIoTHubName}\'. If this action was made by an unauthorized party, it may indicate malicious activity. | 1. Make sure the certificate was added by an authorized party. <br> 2. If it was not added by an authorized party, remove the certificate and escalate the alert to the organizational security team. |
| Certificate deleted from an IoT Hub | Medium | A certificate named \'%{DescCertificateName}\' was deleted from IoT Hub \'%{DescIoTHubName}\'. If this action was made by an unauthorized party, it may indicate a malicious activity. | 1. Make sure the certificate was removed by an authorized party. <br> 2. If the certificate was not removed by an authorized party, add the certificate back, and escalate the alert to the organizational security team. |
| Unsuccessful attempt detected to add a certificate to an IoT Hub | Medium | There was an unsuccessful attempt to add certificate \'%{DescCertificateName}\' to IoT Hub \'%{DescIoTHubName}\'. If this action was made by an unauthorized party, it may indicate malicious activity. | Make sure permissions to change certificates are only granted to authorized parties. |
| Unsuccessful attempt detected to delete a certificate from an IoT Hub | Medium | There was an unsuccessful attempt to delete certificate \'%{DescCertificateName}\' from IoT Hub \'%{DescIoTHubName}\'. If this action was made by an unauthorized party, it may indicate malicious activity. | Make sure permissions to change certificates are only granted to an authorized party. |
| x.509 device certificate thumbprint mismatch | Medium | x.509 device certificate thumbprint did not match configuration. | Review alerts on the devices. No further action required. |
| x.509 certificate expired | Medium | X.509 device certificate has expired. | This could be a legitimate device with an expired certificate or an attempt to impersonate a legitimate  device. If the legitimate device is currently communicating correctly this is likely an impersonation attempt. |
| **Low** severity |  |  |  |
| Attempt to add or edit a diagnostic setting of an IoT Hub detected | Low | Attempt to add or edit the diagnostic settings of an IoT Hub has been detected. Diagnostic settings enable you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. If this action was not made by an authorized party, it may indicate malicious activity. | 1. Make sure the certificate was removed by an authorized party.<br> 2. If the certificate was not removed by an authorized party, add the certificate back and escalate the alert to your information security team. |
| Attempt to delete a diagnostic setting from an IoT Hub detected | Low | There was %{DescAttemptStatusMessage}\' attempt to add or edit diagnostic setting \'%{DescDiagnosticSettingName}\' of IoT Hub \'%{DescIoTHubName}\'. Diagnostic setting enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. If this action was not made by an authorized party, it may indicate a malicious activity. | Make sure permissions to change diagnostics settings are granted only to an authorized party. |
| Expired SAS Token | Low | Expired SAS token used by a device | May be a legitimate device with an expired token, or an attempt to impersonate a legitimate  device. If the legitimate device is currently communicating correctly, this is likely an impersonation attempt. |
| Invalid SAS token signature | Low | A SAS token used by a device has an invalid signature. The signature does not match either the primary or secondary key. | Review the alerts on the devices. No further action required. |

## Next steps

- Defender for IoT service [Overview](overview.md)
- Learn how to [Access your security data](how-to-security-data-access.md)
- Learn more about [Investigating a device](how-to-investigate-device.md)
