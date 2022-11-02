---
title: How to manually fix ServiceNow sync problems 
description: Reset the connection to ServiceNow so alerts in Microsoft Azure can again call ServiceNow  
ms.topic: conceptual
author: nolavime
ms.author: nolavime
ms.date: 03/30/2022
ms.reviewer: nolavime

---
# How to manually fix sync problems

Azure Monitor can connect to third-party IT Service Management (ITSM) providers. ServiceNow is one of those providers.

For security reasons, you may need to refresh the authentication token used for your connection with ServiceNow.
Use the following synchronization process to reactivate the connection and refresh the token:

1. In the top search banner, search for and select **Solutions**.

    ![Screenshot that shows the top search banner and where to select the relevant solutions.](media/itsmc-resync-servicenow/solution-search-8-bit.png)

1. In solution screen, choose "Select All" in the subscription filter and then filter by "ServiceDesk"

    ![Screenshot that shows where to choose Select All and where to filter by ServiceDesk.](media/itsmc-resync-servicenow/solutions-list-8-bit.png)

1. Select the solution of your ITSM connection.
1. Select ITSM connection in the left banner.

    ![Screenshot that shows where to select ITSM Connections.](media/itsmc-resync-servicenow/itsm-connector-8-bit.png)

1. Select each connector from the list. 
    1. Click the Connector name in order to configure it
    1. Delete any connectors no longer in use

    1. Update the fields according to [these definitions](./itsmc-connections.md) based on your partner type

    1. Click on sync

       ![Screenshot that highlights the Sync button.](media/itsmc-resync-servicenow/resync-8-bit-2.png)

    1. Click on save

        ![New connection](media/itsmc-resync-servicenow/save-8-bit.png)

f.    Review the notifications to see if the process started.
