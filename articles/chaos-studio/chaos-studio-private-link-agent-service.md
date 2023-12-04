---
title: Set up Private Link for a Chaos Studio agent-based experiment
description: Understand the steps to set up a a chaos experiment using private link for agent-based experiments
services: chaos-studio
author: nikhilkaul-msft
ms.topic: how-to
ms.date: 12/4/23
ms.author: nikhilkaul
ms.service: chaos-studio
ms.custom: ignite-fall-2023
---
# How-to: Configure Private Link for Agent-Based experiments
In this guide, we'll show you the steps needed to configure a Chaos Studio **Agent-based** Experiment to emit telemetry to App Insights. These events show the start and stop of each fault as well as the type of fault executed and the resource the fault was executed against. App Insights is the primary recommended logging solution for **Agent-based** experiments in Chaos Studio.

---

# Setting Up Private Link for Agent Service in Chaos Studio

## Overview

This guide outlines the process for creating private endpoints for Chaos Agents to communicate with the Chaos Studio Agent Service over a private network. This is based on the public preview of the private endpoints feature and will evolve over time.

## Prerequisites

1. Ensure that the `Microsoft.Resources/EUAPParticipation` feature flag is enabled for your subscription.
2. Create a CPAS (Chaos Platform as a Service) resource against which the private endpoint will be created.

## Steps

### Using Azure CLI

1. **Create a Private Access Resource**:
    ```shell
    az rest --verbose --skip-authorization-header \
    --header "Authorization=Bearer $accessToken" \
    --uri-parameters api-version=2023-04-01-preview \
    --method PUT \
    --uri "https://centraluseuap.management.azure.com/subscriptions/<subscriptionID>/resourceGroups/<resourceGroup>/providers/Microsoft.Chaos/privateAccesses/<cpasName>?api-version=2023-10-27-preview" \
    --body '{...}'
    ```

### Using Postman

1. **Enable Feature for Private Endpoints**:
   - Enable `Microsoft.Network/AllowPrivateEndpoints` feature on the subscription.

2. **CSS Engineer Steps**:
   - Create an incident in Azure Chaos Studio/Dri Squall queue with customer subscription details.

3. **Approve Feature Flag**:
   - Follow instructions in ARM AFEC - Public for feature enrollment.

### Create Target Resource

1. **Create VM Target Resource**:
   - Follow instructions in [Targets and capabilities in Azure Chaos Studio Preview](https://learn.microsoft.com/en-us/azure/chaos-studio/chaos-studio-targets-capabilities-preview).

2. **Install VM Extension**:
   - If using Azure CLI, install the Chaos Studio VM Extension.

### Set Up Private Endpoint

1. **Create and Attach Private Endpoint**:
   - Create a Private Endpoint using the private access resource and attach it to the VM virtual network.

2. **Map Target to CPAS Resource**:
   - Invoke the PUT Target API to map the private access resource with the target.

### Final Steps

1. **Update Agent VM Extension Settings**:
   - Update host entry to map the communication endpoint to the private IP generated during the private endpoint creation.

2. **Restart Azure Chaos Agent Service**:
   - For Windows VMs or Linux VMs, restart the Azure Chaos Agent service.

3. **Verification**:
   - After restart, ensure that the Chaos agent can communicate with the Agent Communication data plane service and that agent registration is successful.

## Additional Notes

- If outbound access to Microsoft Certificate Revocation List verification endpoints is blocked, update AgentSettings to disable CRL Verification check.

For detailed steps and examples, refer to the original [User Experience Private Endpoints for Chaos Agents](#) document.

---

Please replace placeholders like `<subscriptionID>`, `<resourceGroup>`, and `<cpasName>` with actual values when executing these instructions.
