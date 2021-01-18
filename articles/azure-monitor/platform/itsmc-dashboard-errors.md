---
title: Common errors
description: This document contain information about common errors that exists in the dashboard 
ms.subservice: alerts
ms.topic: conceptual
author: nolavime
ms.author: nolavime
ms.date: 01/18/2021

---

# Errors in the Connector Status

In the connector status list you can find errors that can help you to fix your ITSM connector.

## Status Common Errors

in this section you can find the common errors taht you can find in the status list and how you should resolve it:

1. **Error**: "Unexpected response from ServiceNow along with success status code. Response: { "import_set": "{import_set_id}", "staging_table": "x_mioms_microsoft_oms_incident", "result": [ { "transform_map": "OMS Incident", "table": "incident", "status": "error", "error_message": "{Target record not found|Invalid table|Invalid staging table" }"

    **Cause**: Such error is returned from ServiceNow when:
    * A custom script deployed in ServiceNow instance causes incidents to be ignored.
    * "OMS Integrator App" code itself was modified on ServiceNow side, e.g. the onBefore script.

    **Resolution**: Disable all custom scripts or code modifications of the data import path.

2. **Error**: "{"error":{"message":"Operation Failed","detail":"ACL Exception Update Failed due to security constraints"}"

    **Cause**: ServiceNow permissions misconfiguration

    **Resolution**: Check that all the roles have been properly assigned as [specified](itsmc-connections-servicenow.md#install-the-user-app-and-create-the-user-role).

3. **Error**: "An error occurred while sending the request."

    **Cause**: "ServiceNow Instance unavailable"

    **Resolution**: Check your instance in ServiceNow it might be deleted or unavailable.

4. **Error**: "ServiceDeskHttpBadRequestException: StatusCode=429"

    **Cause**: ServiceNow rate limits are too low.

    **Resolution**: Increase or cancel the rate limits in ServiceNow instance as explained [here](https://docs.servicenow.com/bundle/london-application-development/page/integrate/inbound-rest/task/investigate-rate-limit-violations.html).

5. **Error**: "AccessToken and RefreshToken invalid. User needs to authenticate again."

    **Cause**: Refresh token is expired.

    **Resolution**: Sync the ITSM Connector to generate a new refresh token as explained [here](./itsmc-resync-servicenow.md).

6. **Error**: "Could not create/update work item for alert {alertName}. ITSM Connector {connectionIdentifier} does not exist or was deleted."

    **Cause**: ITSM Connector was deleted.

    **Resolution**: The ITSM Connector was deleted but there are still ITSM Actions defined to use it. There are 2 options to solve this issue:
    * Find and disable or delete such actions
    * [Reconfigure the action group](./itsmc-definition.md#create-itsm-work-items-from-azure-alerts) to use an existing ITSM Connector.
    * [Create a new ITSM connector](./itsmc-definition.md#create-an-itsm-connection) and [reconfigure the action group to use it](itsmc-definition.md#create-itsm-work-items-from-azure-alerts).

## UI Common Errors

1. **Error**:"Something went wrong. Could not get connection details."

    **Cause**: Newly created ITSM Connector has yet to finish the initial Sync.

    **Resolution**: When a new ITSM connector is created, ITSM Connector starts syncing information from ITSM system, such as work item templates and work items. Sync the ITSM Connector to generate a new refresh token as explained [here](./itsmc-resync-servicenow.md).
