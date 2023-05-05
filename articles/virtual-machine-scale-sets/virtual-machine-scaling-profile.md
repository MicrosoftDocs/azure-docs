---
# Required metadata
		# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
		# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

		title:       # Add a title for the browser tab
description: # Add a meaningful description for search results
author:      fitzgeraldsteele # GitHub alias
ms.author:    # Microsoft alias
ms.service:  # Add the ms.service or ms.prod value
# ms.prod:   # To use ms.prod, uncomment it and delete ms.service
ms.topic:    # Add the ms.topic value
ms.date:     05/05/2023
---

# Virtual machine scaling profile

Virtual machine scale sets allow you to define a scaling profile or template which specifies the properties of virtual machine instances. Examples of properties set in the virtual machine scaling profile include:

- VM Image

- Admin credentials

- Network interface settings

- Load balancer backend pool

- OS and Data disk settings

When you increase the capacity or instance count of the scale set, the scale set will add new virtual machines to the set based on the configuration defined in the profile. Scale sets with a scaling profile are also eligible for orchestrations such as reimaging, rolling upgrades, instance repair, automatic OS updates.

NOTE: Virtual machine scaling profile settings are required for scale sets in Uniform Orchestration Mode, and optional for scale sets in Flexible Orchestration Mode.

By default, scale sets are created with a virtual machine scaling profile. See quickstart and tutorials for examples.


