---
title: Troubleshooting
description: Troubleshooting steps for Azure Virtual Enclaves.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Troubleshooting

The following are examples of errors that may be encountered and their solution.

## General troubleshooting
These are troubleshotting steps that are not specific to an Azure Virtual Enclaves resource.

### Portal Links don't work in the Air Gapped Azure environments
AVE portal links (e.g. "Learn More") won't work in the Azure Air Gapped environments during Private Preview.

Solution: Those documentation links will work on the low side so you can navigate to the same URL from a commputer with access to github.io.

## Community Troubleshooting
These are troubleshotting steps that are specific to the Azure Virtual Enclaves Community resource.

### API error when creating first Community (Private Preview)

Scenario: When creating a community for the first time in a new subscription, the following error message blocks the deployment

`"The resource type could not be found in the namespace 'Microsoft.Mission' for api version '2024-01-01-preview'."`

Solution: The Microsoft.Mission preview flag must be registered and approved. Ensure you followed the [preview flag registering instructions](./onboard-to-ave.md) and reach out to your AVE POC to ensure it's approved.
