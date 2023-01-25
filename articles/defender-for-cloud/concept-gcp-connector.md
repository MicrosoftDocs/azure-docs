---
title: GCP connector 
description: Learn how 
titleSuffix: Microsoft Defender for Cloud
ms.topic: conceptual
ms.date: 01/25/2023
---

# Microsoft Defender for Cloud GCP connector

The Microsoft Defender for Cloud GCP (Google Cloud Platform) connector is a feature that allows an organizations to extend its cloud security posture management to their Google Cloud environments.

The GCP connector allows organizations to use Microsoft Defender for Cloud to monitor and assess the security state of their Google Cloud resources. The connector allows organizations to use Microsoft Defender for Cloud to apply security policies and receive security recommendations for their Google Cloud resources.

The GCP connector allows for continuous monitoring of Google Cloud resources for security risks, vulnerabilities, and misconfigurations. It also provides automated remediation capabilities to address identified risks and compliance issues. Additionally, it allows organizations to use the Microsoft Defender for Cloud's integrated threat protection capabilities to protect their Google Cloud resources from threats.

## GCP authorization design

The authentication process between Microsoft Defender for Cloud and GCP, is a federated authentication process.  

When you onboard to Defender for Cloud, the GCloud template is used to create the following resources as part of the authentication process: 

- Workload identity pool and providers

- Service accounts and policy bindings

The authentication process works as follows:

:::image type="content" source="media/concept-gcp-connector/authentication-process.png" alt-text="A diagram of the Defender for Cloud GCP cpnnector authentication process.":::

(1) - Microsoft Defender for Cloud's CSPM service acquires an AAD token. The token is signed by AAD using the RS256 algorithm and is valid for 1 hour.

(2) - The AAD token is exchanged with Google's STS token.

(3) - Google STS validates the token with the workload identity provider. The AAD token is sent to Google's STS, which validates the token with the workload identity provider. Audience validation then occurs and the token is signed. A Google STS token is then returned to Defender for Cloud's CSPM service.

(4) - Defender for Cloud's CSPM service uses the Google STS token to impersonate the service account. Defender for Cloud's CSPM receives service account credentials which will then be used to scan the project.

## Onboard a single Google project

