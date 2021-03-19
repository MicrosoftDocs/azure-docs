---
title: Set up SMTP in SnapCenter
description: Send email to SnapCenter administrators.
ms.topic: include
ms.date: 02/22/2021
---

If an SMTP server is available, then SnapCenter can send an email to SnapCenter administrators. Enter the following if desired:

1. Email Preference: Enter preference on frequency on receiving email
2. From: Enter email address that SnapCenter will use to send email
3. To: Enter email that SnapCenter will send the email to
4. Subject: Enter subject that SnapCenter will use when sending the email
5. Select Attach job report

Select Next.

:::image type="content" source="../workloads/oracle/media/netapp-snapcenter-integration-oracle-baremetal/new-resource-group-smtp-settings.jpg" alt-text="Screenshot showing the SMTP settings.":::

Verify settings and select Finish.

:::image type="content" source="../workloads/oracle/media/netapp-snapcenter-integration-oracle-baremetal/new-resource-group-verify-details.jpg" alt-text="Screenshot showing the details for the new resource group.":::

Once a resource group has been created, the resource group can be identified by selecting on the resources tab on the left-hand side menu bar, selecting on the dropdown menu in the main window next to View and selecting Resource Group. If this is your first Resource group, then only the newly created resource group for datafiles and controlfiles will be present. The below example shows resource groups for both type of backups.

:::image type="content" source="../workloads/oracle/media/netapp-snapcenter-integration-oracle-baremetal/baremetal-oracle-resource-group-list.jpg" alt-text="Screenshot of the list of resource groups.":::