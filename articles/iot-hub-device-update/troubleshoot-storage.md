---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title:       # Add a title for the browser tab
description: # Add a meaningful description for search results
author:      andrewbrownmsft # GitHub alias
ms.author:    # Microsoft alias
ms.service:  # Add the ms.service or ms.prod value
# ms.prod:   # To use ms.prod, uncomment it and delete ms.service
ms.topic:    # Add the ms.topic value
ms.date:     12/11/2024
---

# Troubleshoot storage-related errors when importing updates

When importing an update to Device Update for IoT Hub, you may see this error:

*“The permissions on this storage container prevent access to your files. Add the Storage Blob Data Contributor role to your user account. Learn more.”*

To resolve the error, follow these steps:

1. In the Azure portal, search for the “Storage accounts” service in the search bar at the top of the page.

1. Select the “Storage accounts” service.

1. In the Storage accounts view, locate the Storage account that you’re using with Device Update for IoT Hub. Select that account.

1. In the selected Storage account, select the “Containers” option under the “Data storage” header.

1. Locate the container that you’re using with Device Update for IoT Hub. Select that container.

1. In the Container view, select “Access Control (IAM) from the left-hand navigation menu.

1. Select “Add” -> “Add role assignment” from the top menu.

1. In the Role tab, search for the “Storage Blob Data Contributor” role and select it, then click Next.

1. In the Members tab, keep the default selection of “User, group or service principal”, and select the “Select members” link. In the right-hand flyout menu, search for your user account, select it, and choose the “Select” button. Then select Next.

1. In the Conditions tab, make no changes and select “Next”.

1. In the Review + assign tab, select “Review + assign”.

1. Allow a few minutes for the change to propagate, and then try the Device Update for IoT Hub import experience again from the beginning.

