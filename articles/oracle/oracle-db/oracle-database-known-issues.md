---
title: Known issues in Oracle Database@Azure
description: Learn about known issues in Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: troubleshooting
ms.date: 08/29/2024
ms.author: jacobjaygbay
---

# Known issues in Oracle Database@Azure

Learn about known issues in Oracle Database@Azure and how to resolve them.

## Oracle Exadata virtual machine cluster provisioning

### Virtual machine cluster provisioning fails because the number of available IPs doesn't match

The wrong number of available IPs in the subnet is reported, causing virtual machine cluster provisioning to fail.

#### Message

```output
Error returned by CreateCloudVmCluster operation in Database service.(400, InvalidParameter, false) Cidr block of the subnet must have at least 11 ip addresses available.
```

#### Resolution

Verify the correct number of available IP addresses in the subnet by using the Oracle Cloud Infrastructure (OCI) console. For more information, see [List private IP addresses](https://docs.oracle.com/iaas/Content/Network/Tasks/private-ip-address-list.htm).

If the subnet doesn't have enough IP addresses, reconfigure the subnet according to the [prerequisites](oracle-database-plan-ip.md).

### Virtual machine cluster provisioning fails because of an authorization error

Provisioning an Oracle Exadata virtual machine cluster fails and shows the following message.

#### Message

```output
Authorization Failed
The client <client_name> with object id <object_id> does not have authorization to perform action 'Oracle.Database/location/operationStatuses/read' over scope <scope_details> or scope is invalid. If access was recently granted, please refresh your credentials.
```

The failure occurs because the user performing the action doesn't have permissions for the Microsoft.BareMetal/BareMetalConnections resource.

#### Resolution

1. Ensure that no policy is assigned to the user or to the subscription that prevents the user from performing the action. If the user has specific permissions directly assigned to them, add the following resources to the authorized list of resources:

   - Microsoft.BareMetal/BareMetalConnections
   - Microsoft.Network/privateDnsZones

1. Delete the failed virtual machine cluster.
1. After the virtual machine cluster is fully terminated in both Azure and OCI, wait 30 minutes. This wait period ensures that all dependent resources are also deleted.
1. Provision a new virtual machine cluster.

## Buy offer

### Creating an OracleSubscription resource fails because of 'deny' policy action during offer purchase

When you subscribe to Oracle Database@Azure, you must create a managed resource group in the background to contain the `OracleSubscription` object for billing purposes. The managed resource group must be in the EastUS region. It must have a specific name, and it must initially be created without tags.

Any policy that blocks the creation of the managed resource group triggers the error. For example, a policy that has any of the following rules might cause the purchase to fail:

- A rule that denies the creation of resources in the EastUS Azure region
- A rule that denies the creation of a resource without tags
- A rule that enforces specific naming patterns

#### Message

```output
The resource write operation failed to complete successfully, because it reached terminal provisioning state 'Failed'
```

#### Resolution

1. Identify the blocking policy by examining the activity log in the Azure portal. In the log, you might see a **'deny' Policy action** operation with a **failed** status:

    :::image type="content" source="media/deny-known-issue-purchase-failure.png" alt-text="Screenshot that shows the Azure activity log with a 'deny' policy action that caused a failure for the OracleSubscriptions_Update operation.":::

    The following figure shows the details of the **'deny' Policy action** in the Azure portal:

    :::image type="content" source="media/example-known-issue-purchase-failure.png" alt-text="Screenshot that shows a JSON file with example policies, including a policy that limits the allowed locations for resource groups.":::

1. Create a time-bound policy exemption for the blocking policies before you try to buy the offer, and then create the OracleSubscription resource again.

   For more information, see [Azure Policy exemption structure](/azure/governance/policy/concepts/exemption-structure).

   > [!TIP]
   > A policy exemption can take up to 30 minutes to take effect. Ensure that the time window for the exemption is large enough to finish the buy process for the offer. We recommend a window of time of at least two hours for the policy exemption.

   On the **Policy Assignments** pane in the Azure portal, select **Create exemption**.

   :::image type="content" source="media/exemption-known-issue-purchase-failure.png" alt-text="Screenshot that shows the Create exemption button in the Azure portal.":::

1. On the **Create exemption** pane in the Azure portal, create a policy exemption. For **Expiration date**, limit the time window for the policy exemption.

    :::image type="content" source="media/workflow-known-issue-purchase-failure.png" alt-text="Screenshot that shows the Azure portal Create exemption pane.":::
