---
title: Manage users in Azure Data Manager for Energy
description: This article describes how to manage users in Azure Data Manager for Energy.
author: shikhagarg1
ms.author: shikhagarg
ms.service: energy-data-services
ms.topic: how-to
ms.date: 08/19/2022
ms.custom: template-how-to
---

# Manage users in Azure Data Manager for Energy

In this article, you learn how to manage users and their memberships in OSDU groups in Azure Data Manager for Energy. [Entitlements APIs](https://community.opengroup.org/osdu/platform/security-and-compliance/entitlements/-/blob/release/0.15/docs/tutorial/Entitlements-Service.md#entitlement-service-api) are used to add or remove users to OSDU groups and to check the entitlements when the user tries to access the OSDU services or data. For more information about OSDU group concepts, see [Entitlements](concepts-entitlements.md).

## Prerequisites

- Create an Azure Data Manager for Energy instance. See [How to create Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
- Get various parameters of your instance, such as `client-id` and `client-secret`. See [How to generate auth token](how-to-generate-auth-token.md).
- Generate the service principal access token that's needed to call the Entitlement APIs. See [How to generate auth token](how-to-generate-auth-token.md).
- Keep all the parameter values handy. They're needed to run different user management requests via the Entitlements API.

## Fetch object-id

The Azure object ID (OID) is the Microsoft Entra user OID.

1. Find the OID of the users first. If you're managing an application's access, you must find and use the application ID (or client ID) instead of the OID.
1. Input the OID of the users (or the application or client ID if managing access for an application) as parameters in the calls to the Entitlements API of your Azure Data Manager for Energy instance. You can not use user's email ID in the parameter and must use object ID.

   :::image type="content" source="media/how-to-manage-users/azure-active-directory-object-id.png" alt-text="Screenshot that shows finding the object ID from Microsoft Entra ID.":::

   :::image type="content" source="media/how-to-manage-users/profile-object-id.png" alt-text="Screenshot that shows finding the OID from the profile.":::

## First-time addition of users in a new data partition

1. To add the first admin to a new data partition of an Azure Data Manager for Energy instance, use the access token of the OID that was used to provision the instance.
1. Get the `client-id` access token by using [Generate client-id access token](how-to-generate-auth-token.md#generate-the-client-id-auth-token).

   If you try to directly use your own access token for adding entitlements, it results in a 401 error. The `client-id` access token must be used to add the first set of users in the system. Those users (with admin access) can then manage more users with their own access token.
1. Use the `client-id` access token to do the following steps by using the commands outlined in the following sections:
   1. Add the user to the `users@<data-partition-id>.<domain>` OSDU group with the OWNER role.
   2. Add the user to the `users.datalake.ops@<data-partition-id>.<domain>` OSDU group  with the OWNER role to give access of all the service groups.
1. The user becomes the admin of the data partition. The admin can then add or remove more users to the required entitlement groups:
   1. Get the admin's auth token by using [Generate user access token](how-to-generate-auth-token.md#generate-the-user-auth-token) with the same `client-id` and `client-secret` values.
   1. Get the OSDU group, such as `service.legal.editor@<data-partition-id>.<domain>`, to which you want to add more users by using the admin's access token.
   1. Add more users to that OSDU group by using the admin's access token.
1. `users.data.root` is the default and permanent OWNER of all the data records when the records get created automatically in the system. Hence, if the user, who created the record and is the OWNER of the record, leaves the organization, the members of `users.data.root` always have the access of all the data records. For more details, check out [Data Root Group](concepts-entitlements.md#peculiarity-of-usersdataroot-group).
1. As you add more members to a given OSDU group, there is a limit of 5000 membership for a given identity as defined by the OSDU community. 
  
To know more about the OSDU bootstrap groups, check out [here](https://community.opengroup.org/osdu/platform/security-and-compliance/entitlements/-/blob/master/docs/bootstrap/bootstrap-groups-structure.md).

## Get the list of all the groups you have access to in a data partition

Run the following curl command in Azure Cloud Shell to get all the groups that are available for you or that you have access to in the specific data partition of the Azure Data Manager for Energy instance.

```bash
    curl --location --request GET "https://<adme-url>/api/entitlements/v2/groups/" \
    --header 'data-partition-id: <data-partition>' \
    --header 'Authorization: Bearer <access_token>'
```

## Add members to an OSDU group in a data partition

1. Run the following curl command in Azure Cloud Shell to add the users to the users group by using the entitlement service.
1. The value to be sent for the parameter `email` is the OID of the user and not the user's email address.

    ```bash
        curl --location --request POST 'https://<adme-url>/api/entitlements/v2/groups/<group-name>@<data-partition-id>.<domain>/members' \
        --header 'data-partition-id: <data-partition-id>' \
        --header 'Authorization: Bearer <access_token>' \
        --header 'Content-Type: application/json' \
        --data-raw '{
                        "email": "<Object_ID_1>",
                        "role": "MEMBER"
                    },
                   {
                        "email": "<Object_ID_2>",
                        "role": "MEMBER"
                    }
                   '
    ```

    **Sample request for users OSDU group**
    
    Consider an Azure Data Manager for Energy instance named `medstest` with a data partition named `dp1`.
    
    ```bash
        curl --location --request POST 'https://medstest.energy.azure.com/api/entitlements/v2/groups/users@medstest-dp1.dataservices.energy/members' \
        --header 'data-partition-id: medstest-dp1' \
        --header 'Authorization: Bearer abcdefgh123456.............' \
        --header 'Content-Type: application/json' \
        --data-raw '{
                        "email": "90e0d063-2f8e-4244-860a-XXXXXXXXXX",
                        "role": "MEMBER"
                    }'
    ```
    
    **Sample response**
    
    ```JSON
        {
            "email": "90e0d063-2f8e-4244-860a-XXXXXXXXXX",
            "role": "MEMBER"
        }
    ```
    
    **Sample request for legal service editor OSDU group**
    
    ```bash
        curl --location --request POST 'https://medstest.energy.azure.com/api/entitlements/v2/groups/service.legal.editor@medstest-dp1.dataservices.energy/members' \
        --header 'data-partition-id: medstest-dp1' \
        --header 'Authorization: Bearer abcdefgh123456.............' \
        --header 'Content-Type: application/json' \
        --data-raw '{
                        "email": "90e0d063-2f8e-4244-860a-XXXXXXXXXX",
                        "role": "MEMBER"
                    }'
    ```

   > [!IMPORTANT]
   > The app ID is the default OWNER of all the groups.

   :::image type="content" source="media/how-to-manage-users/appid.png" alt-text="Screenshot that shows the app ID in Microsoft Entra ID.":::

## Get OSDU groups for a given user in a data partition

1. Run the following curl command in Azure Cloud Shell to get all the groups associated with the user.

    ```bash
        curl --location --request GET 'https://<adme-url>/api/entitlements/v2/members/<obejct-id>/groups?type=none' \
        --header 'data-partition-id: <data-partition-id>' \
        --header 'Authorization: Bearer <access_token>'
    ```
    
    **Sample request**
    
    Consider an Azure Data Manager for Energy instance named `medstest` with a data partition named `dp1`.
    
    ```bash
        curl --location --request GET 'https://medstest.energy.azure.com/api/entitlements/v2/members/90e0d063-2f8e-4244-860a-XXXXXXXXXX/groups?type=none' \
        --header 'data-partition-id: medstest-dp1' \
        --header 'Authorization: Bearer abcdefgh123456.............'
    ```

    **Sample response**
    
    ```JSON
        {
        "desId": "90e0d063-2f8e-4244-860a-XXXXXXXXXX",
        "memberEmail": "90e0d063-2f8e-4244-860a-XXXXXXXXXX",
        "groups": [
            {
            "name": "users",
            "description": "Datalake users",
            "email": "users@medstest-dp1.dataservices.energy"
            },
            {
            "name": "service.search.user",
            "description": "Datalake Search users",
            "email": "service.search.user@medstest-dp1.dataservices.energy"
            }
        ]
        }
    ```

## Remove a member from a group in a data partition
1. Run the following curl command in Azure Cloud Shell to remove a specific member from a group.
1. If the API tries to remove a member from `users@` group but the member is already part of other groups, then the API request will fail. To remove member from `users@` group and thus from the data partition, you can use Delete command. 
    
    ```bash
        curl --location --request DELETE 'https://<adme-url>/api/entitlements/v2/groups/<group-id>/members/<object-id>' \
        --header 'data-partition-id: <data-partition-id>' \
        --header 'Authorization: Bearer <access_token>'
    ```
    
## Delete a specific user from all the groups in a data partition

1. Run the following curl command in Azure Cloud Shell to delete a specific user from a specific data partition.
1. *Do not* delete the OWNER of a group unless you have another OWNER who can manage users in that group. Though [users.data.root](concepts-entitlements.md#peculiarity-of-usersdataroot-group) is the default and permanent owner of all the data records. 
    
    ```bash
        curl --location --request DELETE 'https://<adme-url>/api/entitlements/v2/members/<object-id>' \
        --header 'data-partition-id: <data-partition-id>' \
        --header 'Authorization: Bearer <access_token>'
    ```
    
    **Sample request**
    
    Consider an Azure Data Manager for Energy instance named `medstest` with a data partition named `dp1`.
    
    ```bash
        curl --location --request DELETE 'https://medstest.energy.azure.com/api/entitlements/v2/members/90e0d063-2f8e-4244-860a-XXXXXXXXXX' \
        --header 'data-partition-id: medstest-dp1' \
        --header 'Authorization: Bearer abcdefgh123456.............'
    ```
    
    **Sample response**
    
    No output for a successful response.
    
## Next steps

After you add users to the groups, you can:

- [Manage legal tags](how-to-manage-legal-tags.md)
- [Manage ACLs](how-to-manage-acls.md)

You can also ingest data into your Azure Data Manager for Energy instance:

- [Tutorial on CSV parser ingestion](tutorial-csv-ingestion.md)
- [Tutorial on manifest ingestion](tutorial-manifest-ingestion.md)
