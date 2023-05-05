---
# Required metadata
		# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
		# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

		title:       # Add a title for the browser tab
description: Describes virtual machine scaling profile, and how to create virtual machine scale set with and without one
author:      fitzgeraldsteele # GitHub alias
ms.author:   fisteele
ms.service:  # Add the ms.service or ms.prod value
# ms.prod:   # To use ms.prod, uncomment it and delete ms.service
ms.topic:    # Add the ms.topic value
ms.date:     05/05/2023
ms.reviewer: jushiman
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

Create a scale set without a scaling profile

Virtual machine scale sets in Flexible Orchestration Mode can optionally be created without a virtual machine scaling profile. This configuration is similar to creating and deploying an Availability Set in that you add to the set by manually creating virtual machine instances and adding them to the set. Scale sets without a scaling profile is useful in cases where you need complete control over all VM properties, need to follow your own VM naming conventions, you want to add different types of VMs to the same scale set, or need to control the placement of virtual machines into a specific availability zone or fault domain.

| Feature | Virtual machine scale sets (no scaling profile) | Availablity Sets |
| -------- | -------- | -------- |
| Maximum capacity   | Cell 2   ||
|Supports Availability Zones|||
|Maximum Aligned Fault Domains Count |||
|Add new VM to set |||
|Add Vm to specific fault domain |||
|Maximum Update Domain count |||
