---
title: Troubleshoot Azure Arc-enabled data services
description: Introduction to troubleshooting resources
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 05/27/2022
ms.topic: how-to
---

# Troubleshooting resources

This article identifies troubleshooting resources for Azure Arc-enabled data services.


## Logs Upload related errors

If you deployed Azure Arc data controller in the `direct` connectivity mode using `kubectl`, and have not created a secret for the Log Analytics workspace credentials, you may see the following error messages in the Data Controller CR (Custom Resource):

```
status": {
    "azure": {
        "uploadStatus": {
            "logs": {
                "lastUploadTime": "YYYY-MM-HHTMM:SS:MS.SSSSSSZ",
                    "message": "spec.settings.azure.autoUploadLogs is true, but failed to get log-workspace-secret secret."
                    },

```

To resolve the above error, create a secret with the Log Analytics Workspace credentials containing the `WorkspaceID` and the `SharedAccessKey` as follows:

```
apiVersion: v1
data:
  primaryKey: <base64 encoding of Azure Log Analytics workspace primary key>
  workspaceId: <base64 encoding of Azure Log Analytics workspace Id>
kind: Secret
metadata:
  name: log-workspace-secret
  namespace: <your datacontroller namespace>
type: Opaque

```

## Metrics upload related errors in direct connected mode

If you configured automatic upload of metrics, in the direct connected mode and the permissions needed for the MSI have not been properly granted (as described in [Upload metrics](upload-metrics.md)), you might see an error in your logs as follows:

```output
'Metric upload response: {"error":{"code":"AuthorizationFailed","message":"Check Access Denied Authorization for AD object XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX over scope /subscriptions/XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX/resourcegroups/my-resource-group/providers/microsoft.azurearcdata/sqlmanagedinstances/arc-dc, User Tenant Id: XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX. Microsoft.Insights/Metrics/write was not allowed, Microsoft.Insights/Telemetry/write was notallowed. Warning: Principal will be blocklisted if the service principal is not granted proper access while it hits the GIG endpoint continuously."}}
```

To resolve above error, retrieve the MSI for the Azure Arc data controller extension, and grant the required roles as described in [Upload metrics](upload-metrics.md).


## Usage upload related errors in direct connected mode

If you deployed your Azure Arc data controller in the direct connected mode the permissions needed to upload your usage information are automatically granted for the Azure Arc data controller extension MSI. If the automatic upload process runs into permissions related issues you might see an error in your logs as follows:

```
identified that your data controller stopped uploading usage data to Azure. The error was:

{"lastUploadTime":"2022-05-05T20:10:47.6746860Z","message":"Data controller upload response: {\"error\":{\"code\":\"AuthorizationFailed\",\"message\":\"The client 'XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX' with object id 'XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX' does not have authorization to perform action 'microsoft.azurearcdata/datacontrollers/write' over scope '/subscriptions/XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX/resourcegroups/my-resource-group/providers/microsoft.azurearcdata/datacontrollers/arc-dc' or the scope is invalid. If access was recently granted, please refresh your credentials.\"}}"}
```

To resolve the permissions issue, retrieve the MSI and grant the required roles as described in [Upload metrics](upload-metrics.md)).


## Resources by type

[Scenario: Troubleshooting PostgreSQL Hyperscale server groups](troubleshoot-postgresql-hyperscale-server-group.md)

[View logs and metrics using Kibana and Grafana](monitor-grafana-kibana.md)

## Next steps

[Scenario: View inventory of your instances in the Azure portal](view-arc-data-services-inventory-in-azure-portal.md)
