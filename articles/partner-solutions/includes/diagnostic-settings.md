---
author: agrimayadav
ms.topic: include
ms.date: 12/16/2024
ms.author: agrimayadav
---
## Diagnostic settings not created as expected after moving a resource

If you need to delete a resource, rename, or move a resource, or migrate it across resource groups or subscriptions, first delete its diagnostic settings. Otherwise, if you recreate this resource, the diagnostic settings for the deleted resource could be included with the new resource, depending on the resource configuration for each resource. If the diagnostics settings are included with the new resource, this resumes the collection of resource logs as defined in the diagnostic setting and sends the applicable metric and log data to the previously configured destination. Also, it's a good practice to delete the diagnostic settings for a resource you're going to delete and don't plan on using again to keep your environment clean. [Learn more](/azure/azure-monitor/essentials/diagnostic-settings)

## Manual updates to diagnostic settings created via tag rules

Diagnostic settings are created based on tag rules. Currently, modifying log categories through the diagnostic settings page is not permitted. While you may be able to uncheck log categories and save them, they will revert to default settings (as per tag rules).

If destination details are modified, a new diagnostic setting with the original configuration is recreated. This is subject to the limitation of a maximum of five diagnostic settings per resource. [Learn More](/azure/azure-monitor/essentials/diagnostic-settings)
