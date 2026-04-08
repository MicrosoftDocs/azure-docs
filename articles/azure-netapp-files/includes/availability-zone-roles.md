---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 01/26/2026
ms.author: anfdocs
ms.custom: include file

# manage-availability-zone-volume-placement.md
# elastic-capacity-pool-task.md
# elastic-volume-server-message-block.md
# elastic-volume.md
---

## Configure custom RBAC roles

If you're using a custom RBAC role or the [built-in Contributor role](../../role-based-access-control/built-in-roles.md#contributor) and managing availability zones _in the Azure portal_, you might not be able to access network features and Availability Zone options in the Azure portal. To ensure you have the appropriate access, add the `Microsoft.NetApp/locations/*` permission. The wildcard encompasses the following permissions: 

* `Microsoft.NetApp/locations/{location}/checkNameAvailability`
* `Microsoft.NetApp/locations/{location}/checkFilePathAvailability`
* `Microsoft.NetApp/locations/{location}/checkQuotaAvailability`
* `Microsoft.NetApp/locations/{location}/quotaLimits`
* `Microsoft.NetApp/locations/{location}/quotaLimits/{quotaLimitName}`
* `Microsoft.NetApp/locations/{location}/regionInfo`
* `Microsoft.NetApp/locations/{location}/elasticRegionInfo`
* `Microsoft.NetApp/locations/{location}/queryNetworkSiblingSet`
* `Microsoft.NetApp/locations/{location}/updateNetworkSiblingSet`

### Modify the RBAC role

1. In your Azure NetApp Files subscription, select **Access control (IAM)**.
1. Select **Roles** then choose the custom role you want to modify. Select the three dots (`...`) then **Edit**. 
1. To update the custom role, select **JSON**. Modify the JSON file to include the locations wild card permission (`Microsoft.NetApp/locations/*`). For example: 

    ```json
    {
        "properties": {
            "roleName": "",
            "description": "",
            "assignableScopes": ["/subscription/<subscriptionID>"
            ],
            "permissions": [
                {
                "actions": [
                    "Microsoft.NetApp/locations/*",
                    "Microsoft.NetApp/netAppAccounts/read",
                    "Microsoft.NetApp/netAppAccounts/renewCredentials/action",
                    "Microsoft.NetApp/netAppAccounts/capacityPools/read"
                    ],
                "notActions": [],
                "dataActions": [],
                "notDataActions": []
            }]
        }
    }
    ```

1. Select **Review + update**.
1. Sign out of your Azure account, and then log back in to confirm that the permissions are in effect and the options are visible.
