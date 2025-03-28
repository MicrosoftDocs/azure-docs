---
title: Troubleshooting
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

## Overview

The following are examples of errors that may be encountered and their solution.

## General

### Portal Links don't work in the Air Gapped Azure environments
AVE portal links (e.g. "Learn More") won't work in the Azure Air Gapped environments during Private Preview.

Solution: Those documentation links will work on the low side so you can navigate to the same URL from a commputer with access to github.io.

## Community Troubleshooting

### API error when creating first Community

Scenario: When creating a community for the first time in a new subscription, the following error message blocks the deployment

`"The resource type could not be found in the namespace 'Microsoft.Mission' for api version '2024-01-01-preview'."`

Solution: The Microsoft.Mission preview flag must be registered and approved. Ensure you followed the [preview flag registering instructions](/docs/How%20To%20Guides/Onboard%20to%20AVE) and reach out to your AVE POC to ensure it is approved.
