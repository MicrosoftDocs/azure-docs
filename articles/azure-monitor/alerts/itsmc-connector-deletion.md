---
title: Delete unused ITSM connectors
description: This article provides an explanation of how to delete ITSM connectors and the action groups that are associated with it.
ms.topic: conceptual
author: nolavime
ms.author: v-jysur
ms.date: 12/29/2020
ms.custom: references_regions

---

# Delete unused ITSM connectors

The process of deleting unused IT service management (ITSM) connectors has two phases. You delete all the actions that are associated with an ITSM connector, and then you delete the connector itself. You delete the actions first because actions without a connector might cause errors in your subscription.

## Delete associated actions

1. In the Azure portal, select **Monitor**.
  
    ![Screenshot of the Monitor selection.](media/itsmc-connector-deletion/itsmc-monitor-selection.png)

2. Select **Alerts**.
   
    ![Screenshot of the Alerts selection.](media/itsmc-connector-deletion/itsmc-alert-selection.png)

3. Select **Manage Actions**.
   
    ![Screenshot of the Manage Actions selection.](media/itsmc-connector-deletion/itsmc-actions-selection.png)

4. Select an action group that's associated with the ITSM connector that you want to delete. This article uses the example of a Cherwell connector.
   
    ![Screenshot of actions that are associated with the Cherwell connector.](media/itsmc-connector-deletion/itsmc-actions-screen.png)

5. Review the information, and then select **Delete action group**.

    ![Screenshot of action group information and the button for deleting the group.](media/itsmc-connector-deletion/itsmc-action-deletion.png)

## Delete the connector

1. On the search bar, search for **servicedesk**. Then select **ServiceDesk** in the list of resources.

    ![Screenshot of search for and selecting ServiceDesk.](media/itsmc-connector-deletion/itsmc-connector-selection.png)

2. Select **ITSM Connections**, and then select the Cherwell connector.

    ![Screenshot of the Cherwell I T S M connector.](media/itsmc-connector-deletion/itsmc-cherwell-connector.png)

3. Select **Delete**.

    ![Screenshot of the delete button for the I T S M connector.](media/itsmc-connector-deletion/itsmc-connector-deletion.png)

## Next steps

* [Troubleshooting problems in an ITSM connector](./itsmc-resync-servicenow.md)
