---
author: diberry
ms.author: diberry
ms.service: azure-device-registry
ms.topic: include
ms.date: 11/07/2025
ms.service: azure-iot-operations
---

The following tables list the limits that apply to the Azure Device Registry resources. Use Azure Device Registry with Azure IoT Hub and Azure IoT Operations.

### General

| Resource type | Limit type | Limit |
|---------------|------------|-------|
| Azure Device Registry namespaces | Count per Azure subscription | 100 |
| IoT Hub instances | Count per namespace | 10 |

### Assets and devices

| Resource type | Limit type | Limit |
|---------------|------------|-------|
| Devices | Count per Azure subscription | 1,000,000<sup>1</sup> |
| Devices / discovered devices | Count per Kubernetes cluster | 1,000 |
| Devices / discovered devices (read) | Operations per minute per Azure subscription | 5,000 |
| Devices / discovered devices (create/update) | Operations per minute per Azure subscription | 500 |
| Assets | Count per Azure subscription | 100,000 |
| Assets  / discovered assets | Count per Azure Device Registry namespace | 10,000 |
| Assets / discovered assets | Count per Kubernetes cluster | 1,000 |
| Assets / discovered assets (read) | Operations per minute per Azure subscription | 5,000 |
| Assets / discovered assets (create/update) | Operations per minute per Azure subscription | 500 |
| Assets: datasets, event groups, and management groups | Count per asset | 100 |
| Assets: data points, events, and management actions | Count per asset | 1,000 |
| Assets (classic) | Count per Azure subscription | 10,000 |

<sup>1</sup> If you require a higher limit, open a support ticket to submit a request for consideration.

### Certificate management

The following table lists the resource count limits for certificate management in Azure Device Registry.

| Resource type | Limit type | Limit |
|---------------|------------|-------|
| Certificate authority | Count per subscription | 8 |
| Root certificate authorities | Count per Azure Device Registry namespace | 1 |
| Intermediate certificate authorities | Count per Azure Device Registry namespace | 3 |
| Certificate policies | Count per intermediate certificate authority | 1 |

The following table lists the certificate validity limits.

| Resource type | Limit type | Limit |
|---------------|------------|-------|
| Root certificate authority | Maximum validity (years) | 10 |
| Intermediate certificate authority | Maximum validity (years) | 1 |
| Leaf certificate | Minimum validity (days) | 1 |
| Leaf certificate | Maximum validity (days) | 90 |

The following table lists the certificate issuance and revocation limits.

| Resource type | Limit type | Limit |
|---------------|------------|-------|
| Leaf certificate | Maximum issued per minute by a single namespace | 1,000 |
| Leaf certificate | Maximum issued per minute by a single intermediate certificate authority | 1,000 |
| Leaf certificate | Maximum unique certificates issued to a single device within 24 hours | 20 |
| Leaf certificate | Maximum leaf certificate revocations per minute | 1,000 |

### Schema registries

| Resource type | Limit type | Limit |
|---------------|------------|-------|
| Schema registries | Count per Azure subscription | 100 |
| Schemas | Read operations per minute per Azure subscription | 600 |
| Schema versions | Read operations per minute per Azure subscription | 600 |
| Schema registries | Read operations per minute per Azure subscription | 600 |
