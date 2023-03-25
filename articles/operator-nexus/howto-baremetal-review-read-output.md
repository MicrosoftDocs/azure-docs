---
title: How to view the output of an `az networkcloud run-read-command` in the Operator Nexus Cluster Manager Storage account
description: Step by step guide on locating the output of a `az networkcloud run-read-command` in the Cluster Manager Storage account.
author: eak13
ms.author: ekarandjeff
ms.service: azure
ms.topic: how-to
ms.date: 03/23/2023
ms.custom: template-how-to
---

# How to view the output of an `az networkcloud run-read-command` in the Cluster Manager Storage account

This guide walks you through accessing the output file that is created in the Cluster Manager Storage account when an `az networkcloud baremetalmachine run-read-command` is executed on a server. The name of the file is identified in the `az rest` status output.

1. Open the Cluster Manager Managed Resource Group for the Cluster where the server is housed and then select the **Storage account**.

1. In the Storage account details, select **Storage browser** from the navigation menu on the left side.

1. In the Storage browser details, select on **Blob containers**.

1. Select the baremetal-run-command-output blob container.

1. Select the output file from the run-read command. The file name can be identified from the `az rest --method get` command. Additionally, the **Last modified** timestamp aligns with when the command was executed.

1. You can manage & download the output file from the **Overview** pop-out.

For information on running the `run-read-command`, see:

- [Troubleshoot BMM issues using the run-read command](howto-baremetal-run-read.md)
