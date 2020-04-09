---
title: How to manually fix ServiceNow sync problems 
description: Resetting the connection to ServiceNow 
ms.subservice: logs
ms.topic: conceptual
author: nolavime
ms.author: v-jysur
ms.date: 05/24/2018

---

# How to manually fix ServiceNow sync problems

Azure Monitor can connect to third party IT service management (ITSM) providers. ServiceNow is one of those providers. 
For security reasons, you may need to refresh the authentication token used for your connection with ServiceNow.
Use the following sync process to reactivate the connection and refresh the token: 


1. Search for the solution in the top search banner and select the solutions

    ![New connection](media/itsmc-resync-servicenow/solution-search-8bit.png)

1. In solution screen, choose "Select All" in the subscription filter and then filter by "ServiceDesk"

    ![New connection](media/itsmc-resync-servicenow/solutions-list-8bit.png)

1. Select the solution of your ITSM connection
1. Select ITSM connection in the left banner

    ![New connection](media/itsmc-resync-servicenow/itsm-connector-8bit.png)

1. Select each connector from the list 
    1. Click the Connector name in order configure it
    1. If you notice that the connectors are not in use anymore please delete them

    1. Update the fields – according to the definitions here https://docs.microsoft.com/en-us/azure/azure-monitor/platform/itsmc-connections (according to your partner type)

    1. Click on sync

       ![New connection](media/itsmc-resync-servicenow/resync-8bit2.png)

    1. Click on save

        ![New connection](media/itsmc-resync-servicenow/save-8bit.png)

f.    Please review the notifications in order to see if this was finished with success 

 
