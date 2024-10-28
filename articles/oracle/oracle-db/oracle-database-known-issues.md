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

In this article, you find known issues for Oracle Database@Azure.

## Exadata Virtual Machine Cluster Provisioning 

### VM cluster provisioning fails because number of available IPs reported by OCI and  don't match 

**Details**: reports the wrong number of available IPs in the subnet, causing VM cluster provisioning to fail.

**Error message**:
```
Error returned by CreateCloudVmCluster operation in Database service.(400, InvalidParameter, false) Cidr block of the subnet must have at least 11 ip addresses available.
```

**Diagnosis**: Verify the correct number of available IP addresses in the subnet using the OCI Console. For instructions, see [Listing Private IP Addresses](https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/private-ip-address-list.htm).

**Workaround**: If the subnet doesn't have enough IP addresses, reconfigure the subnet according to the [prerequisites](oracle-database-plan-ip.md).

### VM cluster provisioning fails with authorization error 

**Details**: Provisioning of an Exadata VM cluster fails with the following error.

**Error message**:
```
Authorization Failed
The client *&lt;client\_name&gt;* with object id *&lt;object\_id&gt;* does not have authorization to perform action 'Oracle.Database/location/operationStatuses/read' over scope <scope_details> or scope is invalid. If access was recently granted, please refresh your credentials.
```

The failure occurs because the user performing the action doesn't have  permissions for the `Microsoft.BareMetal/BareMetalConnections` resource.

**Workaround**:

1.  Ensure that no  policy assigned to the user or the subscription is preventing the user from performing the action. If the user has specific permissions assigned to them directly, add the following resources to the authorized list:

    1.  Microsoft.BareMetal/BareMetalConnections
    2.  Microsoft.Network/privateDnsZones
2.  Delete the failed VM cluster from the  UI
3.  After the VM Cluster is fully terminated in both  and, wait 30 minutes. This wait period ensures that all dependent resources are also deleted.
4.  Provision a new VM cluster.

## Buy offer 

### Create 'OracleSubscription' resource fails with 'deny' Policy Action during offer purchase 

**Details:** When subscribing to Oracle Database@Azure,  must create a Managed Resource Group (MRG) in the background to contain the `OracleSubscription` object for billing purposes. This MRG must be in the  `EastUS` region with a specific name, and without tags initially.

Any  policy that blocks the creation of the MRG triggers the error. For example, a policy with any of the following rules could cause the buy to fail:

-   A rule that denies the creation of resources in the `EastUS` region
-   A rule that denies the creation of a resource without tags
-   A rule that enforces specific naming patterns

**Error message:**

```
The resource write operation failed to complete successfully, because it reached terminal provisioning state 'Failed'
```

**Workaround:**

1.  Identify the blocking policy by examining the **Activity log**. In the log, you might see **'deny' Policy action** operation with the "failed" status:

    :::image type="content" source="media/deny-known-issue-purchase-failure.png" alt-text="The image shows the Azure activity log with a 'deny' Policy action that has caused a failure for the OracleSubscriptions_Update operation.":::

    The following image shows the details of the **'deny' Policy action** in the Azure portal:

    :::image type="content" source="media/example-known-issue-purchase-failure.png" alt-text="The image shows a JSON file with example policies, including a policy limiting the allowed locations for resource groups.":::


2.  Create a time-bound policy exemption for the blocking policies before trying to buy the offer and create the **OracleSubscription** resource again. For more information, see [Azure Policy exemption structure](/azure/governance/policy/concepts/exemption-structure) in the Azure documentation.

     >[!TIP] 
     >A policy exemption can take up to 30 minutes to take effect. Ensure that the time window for the exemption is large enough to finish the buy process for the offer. We recommend at least two hours for the policy exemption.

    Select **Create exemption** on the Policy Assignments page in the Azure portal:

    :::image type="content" source="media/exemption-known-issue-purchase-failure.png" alt-text="The image shows the Create exemption button in the Azure portal policy.":::

3.  On the **Create exemption** page in the Azure portal, create a policy exemption. Use the **Expiration date** field to limit the time window for the policy exemption.

    :::image type="content" source="media/workflow-known-issue-purchase-failure.png" alt-text="The image shows the Azure portal Create exemption workflow.":::



