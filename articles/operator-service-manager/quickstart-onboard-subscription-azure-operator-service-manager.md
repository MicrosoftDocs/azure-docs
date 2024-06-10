---
title: Onboard a subscription to Azure Operator Service Manager
description: Use this Quickstart to enable Azure Operator Service Manager on your subscription.
author: pjw711
ms.author: peterwhiting
ms.service: azure-operator-service-manager
ms.custom: devx-track-azurecli
ms.topic: quickstart
ms.date: 03/19/2023
---

# Quickstart: Onboard a subscription to Azure Operator Service Manager (AOSM)

In this Quickstart, you onboard a subscription to Azure Operator Service Manager (AOSM).

## Prerequisites

Contact your Microsoft account team to register your Azure subscription for access to Azure Operator Service Manager (AOSM) or express your interest through the [partner registration form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR7lMzG3q6a5Hta4AIflS-llUMlNRVVZFS00xOUNRM01DNkhENURXU1o2TS4u).

## Register and verify required resource providers

Before you begin using the Azure Operator Service Manager, execute the following commands to register the required resource provider. This registration process can take up to 5 minutes.

```azurecli
# Register Resource Provider
az provider register --namespace Microsoft.HybridNetwork
az provider register --namespace Microsoft.ContainerRegistry
```

Verify the registration status of the resource providers. Execute the following commands.

```azurecli
# Query the Resource Provider
az provider show -n Microsoft.HybridNetwork --query "{RegistrationState: registrationState, ProviderName: namespace}"
az provider show -n Microsoft.ContainerRegistry --query "{RegistrationState: registrationState, ProviderName: namespace}"
```

> [!NOTE]
> It may take a few minutes for the resource provider registration to complete. Once the registration is successful, you can proceed with using the Azure Operator Service Manager (AOSM).
