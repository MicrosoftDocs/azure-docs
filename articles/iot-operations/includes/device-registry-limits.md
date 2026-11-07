---
author: cwatson-cat
ms.author: cwatson
ms.service: azure-device-registry
ms.topic: include
ms.date: 11/07/2025
ms.service: azure-iot-operations
---

The following table lists the limits that apply to the Azure Device Registry resources. Azure Device Registry is used with Azure IoT Hub (preview) and Azure IoT Operations.

| Resource type | Limit type | Limit |
|---------------|------------|-------|
| Azure Device Registry namespaces | Count per Azure subscription | 100 |
| Devices | Count per Azure subscription | 100,000 |
| Devices / discovered devices | Count per Kubernetes cluster | 1,000 |
| Devices / discovered devices | Count per Azure Device Registry namespace | 10,000 |
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
| Schema registries | Count per Azure subscription | 100 |
| Schemas | Read operations per minute per Azure subscription | 600 |
| Schema versions | Read operations per minute per Azure subscription | 600 |
| Schema registries | Read operations per minute per Azure subscription | 600 |
| Policies (preview) | Count per Azure Device Registry namespace | 1 |
| Credentials (preview) | Count per Azure Device Registry namespace | 1 |
| Credentials (preview) | Count per Entra ID tenant | 2 |
| Certificate authority (preview) | Count per subscription | 50 |
| Root certificate authorities (preview) | Count per Azure Device Registry namespace | 1 |
| Root certificate authority (preview) | Maximum validity (years) | 10 |
| Intermediate certificate authorities (preview) | Count per Azure Device Registry namespace | 3 |
| Certificate policies (preview) | Count per intermediate certificate authority | 1 |
| Intermediate certificate authority (preview) | Maximum validity (years) | 1 |
| Leaf certificate (preview) | Minimum validity (days) | 1 |
| Leaf certificate (preview) | Maximum validity (days) | 90 |
| Certificates (preview) | Maximum issued per second (RPS) by a single namespace | 50 |
| Certificates (preview) | Maximum issued per second (RPS) by a single certificate authority | 30 |
| Certificates (preview) | Maximum unique certificates issued to a single device within 24 hours | 20 |
| Certificates (preview) | Maximum leaf certificate revocations per minute | 500 |
