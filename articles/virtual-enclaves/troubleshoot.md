---
title: Troubleshoot Azure Virtual Enclaves
description: Troubleshoot steps for Azure Virtual Enclaves.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 04/08/2025
---

# Troubleshoot Azure Virtual Enclaves

The following are examples of errors that might be encountered and their solution.

## General troubleshooting
The general troubleshooting steps that aren't specific to an Azure Virtual Enclaves resource.

### Portal Links don't work in the Air Gapped Azure environments
AVE portal links (for example "Learn More") don't work in the Azure Air Gapped environments during Preview.

Solution: Those documentation links work on the low side so you can navigate to the same URL from a computer with access to github.io.

## Community Troubleshooting
The community troubleshooting steps that are specific to the Azure Virtual Enclaves community resource.

### API error when creating first community (Preview)

Scenario: Create a community for the first time in a new subscription, the following error message blocks the deployment

`"The resource type could not be found in the namespace 'Microsoft.Mission' for api version '2024-01-01-preview'."`

Solution: The `Microsoft.Mission` preview flag must be registered and approved. Ensure you followed the [preview flag registering instructions](./onboard.md) and reach out to your AVE proof of concept (POC) to ensure approval.

## Workloads

### User has permissions to write but not permissions to do something else
If the permission that was denied is one of the permissions included in the actions protected by [maintenance mode](./maintenance-mode.md) like `Microsoft.Network/virtualNetwork/subnets/join/action` this is a good indicator that maintenance mode should be enabled and then you can try again.
