---
title: include file
description: include file
services: azure-policy
author: craigshoemaker
 
ms.service: azure-policy
ms.topic: include
ms.date: 05/18/2018
ms.author: cshoe
ms.custom: include file
---

## Deleting personal information

[!INCLUDE [gdpr-intro-sentence.md](gdpr-intro-sentence.md)]

Personal information is relevant to the import/export service (via the portal and API) during import and export operations. Data used during these processes include:

- Contact name
- Phone number
- Email
- Street address
- City
- Zip/postal code
- State
- Country/Region/Province
- Drive ID
- Carrier account number
- Shipping tracking number

When an import/export job is created, users provide contact information and a shipping address. Personal information is stored in up to two different locations: in the job and optionally in the portal settings. Personal information is only stored in portal settings if you check the checkbox labeled, **Save carrier and return address as default** during the *Return shipping info* section of the export process.

Personal contact information may be deleted in the following ways:

- Data saved with the job is deleted with the job. Users can delete jobs manually and completed jobs are automatically deleted after 90 days. You can manually delete the jobs via the REST API or the Azure portal. To delete the job in the Azure portal, go to your import/export job, and click *Delete* from the command bar. For details on how to delete an import/export job via REST API, refer to [Delete an import/export job](/previous-versions/azure/storage/common/storage-import-export-cancelling-and-deleting-jobs).

- Contact information saved in the portal settings may be removed by deleting the portal settings. You can delete portal settings by following these steps:
  - Sign in to the [Azure portal](https://portal.azure.com).
  - Click on the *Settings* icon ![Azure Settings Icon](media/storage-import-export-delete-personal-info/azure-settings-icon.png)
  - Click *Export all settings* (to save your current settings to a `.json` file).
  - Click *Delete all settings and private dashboards* to delete all settings including saved contact information.

For more information, review the Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trust-center)