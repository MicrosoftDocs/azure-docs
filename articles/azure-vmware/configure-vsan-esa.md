---
# Required metadata
# For more information, see https://learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata
# For valid values of ms.service, ms.prod, and ms.topic, see https://learn.microsoft.com/en-us/help/platform/metadata-taxonomies

title:       # Add a title for the browser tab
description: # Add a meaningful description for search results
author:      jkpravinkumar # GitHub alias
ms.author:   pjeyakumar # Microsoft alias
ms.service:  # Add the ms.service or ms.prod value
# ms.prod:   # To use ms.prod, uncomment it and delete ms.service
ms.topic:    # Add the ms.topic value
ms.date:     05/12/2025
---

# Configure VMware vSAN (ESA)

VMware [vSAN](https://techdocs.broadcom.com/us/en/vmware-cis/vsan/vsan/8-0/release-notes/vmware-vsan-803-release-notes.html) ESA (Express Storage Architecture) has enhanced capabilities that are configured by default with each Azure VMware Solution deployment, and each cluster utilizes its own high-performance vSAN ESA datastore. Below are the Azure VMware Solution SKUs that support vSAN ESA as the default architecture type, with the following configurations per cluster:

__Supported host types__

vSAN ESA (Express Storage Architecture) is supported in the below Azure VMware Solution host types:

- AV48

|Field|Value|
| -------- | -------- |
|**TRIM/UNMAP**|Enabled by default (Cannot be disabled in vSAN ESA based clusters)|
|**Space Efficiency**|Compression (Storage policy managed compression) Deduplication is not supported in vSAN ESA|

