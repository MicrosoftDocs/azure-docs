---
title: Built-in & custom alerts list
description: Learn about security alerts and recommended remediation using Defender for IoT Hub's features and service.
ms.topic: conceptual
ms.date: 01/01/2023
---

# Defender for IoT Hub security alerts

Defender for IoT continuously analyzes your IoT solution using advanced analytics and threat intelligence to alert you to malicious activity.
In addition, you can create custom alerts based on your knowledge of expected device behavior.
An alert acts as an indicator of potential compromise, and should be investigated and remediated.

In this article, you will find a list of built-in alerts, which can be triggered on your IoT Hub.
In addition to built-in alerts, Defender for IoT allows you to define custom alerts based on expected IoT Hub and/or device behavior.
For more information, see [customizable alerts](concept-customizable-security-alerts.md).

## Built-in alerts for IoT Hub

### Medium severity

| Name | Severity | Data Source | Description | Suggested remediation | AlertType |
|--|--|--|--|--|--|
| New certificate added to an IoT Hub | Medium | IoT Hub | A certificate was added to an IoT Hub. If this action was made by an unauthorized party, it may indicate malicious activity. | 1. Make sure the certificate was added by an authorized party. <br> 2. If it was not added by an authorized party, remove the certificate and escalate the alert to the organizational security team. | IoT_CertificateSuccessfullyAddedToHub |
| Certificate deleted from an IoT Hub | Medium | IoT Hub | A certificate was deleted from an IoT Hub. If this action was made by an unauthorized party, it may indicate a malicious activity. | 1. Make sure the certificate was removed by an authorized party. <br> 2. If the certificate was not removed by an authorized party, add the certificate back, and escalate the alert to the organizational security team. | IoT_CertificateSuccessfullyDeletedFromHub |
| Unsuccessful attempt detected to add a certificate to an IoT Hub | Medium | IoT Hub | There was an unsuccessful attempt to add a certificate to an IoT Hub. If this action was made by an unauthorized party, it may indicate malicious activity. | Make sure permissions to change certificates are only granted to authorized parties. | Hub_CertificateFailedToBeAddedToHub |
| Unsuccessful attempt detected to delete a certificate from an IoT Hub | Medium | IoT Hub | There was an unsuccessful attempt to delete a certificate from an IoT Hub. If this action was made by an unauthorized party, it may indicate malicious activity. | Make sure permissions to change certificates are only granted to an authorized party. | IoT.Hub_CertificateFailedToBeDeletedFromHub |
| x.509 device certificate thumbprint mismatch | Medium | IoT Hub | x.509 device certificate thumbprint did not match configuration. | Review alerts on the devices. No further action required. | IoT_Cert_Print_Mismatch |
| x.509 certificate expired | Medium | IoT Hub | X.509 device certificate has expired. | This could be a legitimate device with an expired certificate or an attempt to impersonate a legitimate device. If the legitimate device is currently communicating correctly this is likely an impersonation attempt. | IoT_Cert_Expired |

### Low severity

| Name | Severity | Data Source | Description | Suggested remediation | AlertType |
|--|--|--|--|--|--|
| Attempt to add or edit a diagnostic setting of an IoT Hub detected | Low | IoT Hub | Attempt to add or edit the diagnostic settings of an IoT Hub has been detected. Diagnostic settings enable you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. If this action was not made by an authorized party, it may indicate malicious activity. | 1. Make sure the certificate was removed by an authorized party. <br> 2. If the certificate was not removed by an authorized party, add the certificate back and escalate the alert to your information security team. | IoT_DiagnosticSettingAddedOrEditedOnHub |
| Attempt to delete a diagnostic setting from an IoT Hub detected | Low | IoT Hub | Attempt to add or edit the diagnostic settings of an IoT Hub has been detected. Diagnostic settings enable you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. If this action was not made by an authorized party, it may indicate malicious activity. | Make sure permissions to change diagnostics settings are granted only to an authorized party. | IoT_DiagnosticSettingDeletedFromHub |
| Expired SAS Token | Low | IoT Hub | Expired SAS token used by a device | May be a legitimate device with an expired token, or an attempt to impersonate a legitimate device. If the legitimate device is currently communicating correctly, this is likely an impersonation attempt. | IoT_Expired_SAS_Token |
| Invalid SAS token signature | Low | IoT Hub | A SAS token used by a device has an invalid signature. The signature does not match either the primary or secondary key. | Review the alerts on the devices. No further action required. | IoT_Invalid_SAS_Token |

## Next steps

- Defender for IoT service [Overview](overview.md)
