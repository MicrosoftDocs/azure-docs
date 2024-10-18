---
title: Known issues for Oracle Database@Azure
description: Learn about known issues for Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: troubleshooting
ms.date: 08/29/2024
ms.author: jacobjaygbay
---

# Known issues for Oracle Database@Azure

Learn about known issues in Oracle Database@Azure.

## Exadata virtual machine cluster provisioning

### VM cluster provisioning fails because the number of available IPs reported by OCI and don't match

**Details**: reports the wrong number of available IPs in the subnet, causing VM cluster provisioning to fail.

**Error message**:

```output
Error returned by CreateCloudVmCluster operation in Database service.(400, InvalidParameter, false) Cidr block of the subnet must have at least 11 ip addresses available.
```

**Diagnosis**: Verify the correct number of available IP addresses in the subnet using the OCI Console. For instructions, see [List private IP addresses](https://docs.oracle.com/iaas/Content/Network/Tasks/private-ip-address-list.htm).

**Workaround**: If the subnet doesn't have enough IP addresses, reconfigure the subnet according to the [prerequisites](oracle-database-plan-ip.md).

### VM cluster provisioning fails with authorization error

**Details**: Provisioning of an Exadata VM cluster fails with the following error.

**Error message**:

```output
Authorization Failed
The client *&lt;client\_name&gt;* with object id *&lt;object\_id&gt;* does not have authorization to perform action 'Oracle.Database/location/operationStatuses/read' over scope <scope_details> or scope is invalid. If access was recently granted, please refresh your credentials.
```

The failure occurs because the user performing the action doesn't have permissions for the `Microsoft.BareMetal/BareMetalConnections` resource.

**Workaround**:

1. Ensure that no  policy assigned to the user or the subscription is preventing the user from performing the action. If the user has specific permissions assigned to them directly, add the following resources to the authorized list:

    1. Microsoft.BareMetal/BareMetalConnections
    1. Microsoft.Network/privateDnsZones
1. Delete the failed VM cluster from the UI.
1. After the VM cluster is fully terminated in both  and, wait 30 minutes. This wait period ensures that all dependent resources are also deleted.
1. Provision a new VM cluster.

## Buy offer

### Create OracleSubscription resource fails with 'deny' Policy Action during offer purchase

**Details**: When you subscribe to Oracle Database@Azure, you must create a managed resource group (MRG) in the background to contain the `OracleSubscription` object for billing purposes. This MRG must be in the  `EastUS` region with a specific name, and without tags initially.

Any policy that blocks the creation of the MRG triggers the error. For example, a policy that has any of the following rules might cause the purchase to fail:

- A rule that denies the creation of resources in the EastUS Azure region.
- A rule that denies the creation of a resource without tags.
- A rule that enforces specific naming patterns.

#### Error message

```output
The resource write operation failed to complete successfully, because it reached terminal provisioning state 'Failed'
```

### Workaround

1. Identify the blocking policy by examining the **Activity log**. In the log, you might see **'deny' Policy action** operation with the "failed" status:

    :::image type="content" source="media/deny-known-issue-purchase-failure.png" alt-text="The image shows the Azure activity log with a 'deny' Policy action that has caused a failure for the OracleSubscriptions_Update operation.":::

    The following image shows the details of the **'deny' Policy action** in the Azure portal:

    :::image type="content" source="media/example-known-issue-purchase-failure.png" alt-text="The image shows a JSON file with example policies, including a policy limiting the allowed locations for resource groups.":::

1. Create a time-bound policy exemption for the blocking policies before trying to buy the offer and create the **OracleSubscription** resource again. For more information, see [Azure Policy exemption structure](/azure/governance/policy/concepts/exemption-structure) in the Azure documentation.

     > [!TIP]
     > A policy exemption can take up to 30 minutes to take effect. Ensure that the time window for the exemption is large enough to finish the buy process for the offer. We recommend at least two hours for the policy exemption.

    Select **Create exemption** on the Policy Assignments page in the Azure portal:

    :::image type="content" source="media/exemption-known-issue-purchase-failure.png" alt-text="The image shows the Create exemption button in the Azure portal policy.":::

1. On the **Create exemption** pane in the Azure portal, create a policy exemption. Use the **Expiration date** field to limit the time window for the policy exemption.

    :::image type="content" source="media/workflow-known-issue-purchase-failure.png" alt-text="The image shows the Azure portal Create exemption workflow.":::
