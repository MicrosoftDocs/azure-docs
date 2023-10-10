---
title: How to manage users in Microsoft Azure Data Manager for Energy
description: This article describes how to manage users in Azure Data Manager for Energy
author: Lakshmisha-KS
ms.author: lakshmishaks
ms.service: energy-data-services
ms.topic: how-to
ms.date: 08/19/2022
ms.custom: template-how-to
---

# How to manage users
In this article, you'll know how to manage users in Azure Data Manager for Energy. It uses the [entitlements API](https://community.opengroup.org/osdu/platform/security-and-compliance/entitlements/-/tree/master/) and acts as a group-based authorization system for data partitions within Azure Data Manager for Energy instance. For more information about Azure Data Manager for Energy entitlements, see [entitlement services](concepts-entitlements.md).


## Prerequisites

Create an Azure Data Manager for Energy instance using the tutorial at [How to create Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).

You will need to pass parameters for generating the access token, which you'll need to make valid calls to the Entitlements API of your Azure Data Manager for Energy instance. You will also need these parameters for different user management requests to the Entitlements API. Hence Keep the following values handy for these actions.

#### Find `tenant-id`
Navigate to the Microsoft Entra account for your organization. One way to do so is by searching for "Microsoft Entra ID" in the Azure portal's search bar. Once there, locate `tenant-id` under the basic information section in the *Overview* tab. Copy the `tenant-id` and paste in an editor to be used later.  

:::image type="content" source="media/how-to-manage-users/azure-active-directory.png" alt-text="Screenshot of search for Microsoft Entra ID.":::

:::image type="content" source="media/how-to-manage-users/tenant-id.png" alt-text="Screenshot of finding the tenant-id.":::

#### Find `client-id`
Often called `app-id`, it's the same value that you used to register your application during the provisioning of your [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md). You'll find the `client-id` in the *Essentials* pane of Azure Data Manager for Energy *Overview* page. Copy the `client-id` and paste in an editor to be used later. 

> [!IMPORTANT]
> The 'client-id' that is passed as values in the entitlement API calls needs to be the same which was used for provisioning of your Azure Data Manager for Energy instance.

:::image type="content" source="media/how-to-manage-users/client-id-or-app-id.png" alt-text="Screenshot of finding the client-id for your registered App.":::

#### Find `client-secret`
Sometimes called an application password, a `client-secret` is a string value your app can use in place of a certificate to identity itself. Navigate to *App Registrations*. Once there, open 'Certificates & secrets' under the *Manage* section. Create a `client-secret` for the `client-id` that you used to create your Azure Data Manager for Energy instance, you can add one now by clicking on *New Client Secret*. Record the secret's `value` for use in your client application code. 

> [!CAUTION]
> Don't forget to record the secret's value for use in your client application code. This secret value is never displayed again after you leave this page at the time of creation of 'client secret'.

:::image type="content" source="media/how-to-manage-users/client-secret.png" alt-text="Screenshot of finding the client secret.":::

#### Find the `url`for your Azure Data Manager for Energy instance
Navigate to your Azure Data Manager for Energy *Overview* page on Azure portal. Copy the URI from the essentials pane. 

:::image type="content" source="media/how-to-manage-users/endpoint-url.png" alt-text="Screenshot of finding the url from Azure Data Manager for Energy instance.":::

#### Find the `data-partition-id` for your group
You have two ways to get the list of data-partitions in your Azure Data Manager for Energy instance. 
- One option is to navigate *Data Partitions* menu item under the Advanced section of your Azure Data Manager for Energy UI.

:::image type="content" source="media/how-to-manage-users/data-partition-id.png" alt-text="Screenshot of finding the data-partition-id from the Azure Data Manager for Energy instance.":::

- Another option is by clicking on the *view* below the *data partitions* field in the essentials pane of your Azure Data Manager for Energy *Overview* page. 

:::image type="content" source="media/how-to-manage-users/data-partition-id-second-option.png" alt-text="Screenshot of finding the data-partition-id from the Azure Data Manager for Energy instance overview page.":::

:::image type="content" source="media/how-to-manage-users/data-partition-id-second-option-step-2.png" alt-text="Screenshot of finding the data-partition-id from the Azure Data Manager for Energy instance overview page with the data partitions.":::
## Generate access token

You need to generate access token to use entitlements API. Run the below curl command in Azure Cloud Bash after replacing the placeholder values with the corresponding values found earlier in the pre-requisites step.
 
**Request format**

```bash
curl --location --request POST 'https://login.microsoftonline.com/<tenant-id>/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'scope=<client-id>.default' \
--data-urlencode 'client_id=<client-id>' \
--data-urlencode 'client_secret=<client-secret>' \
--data-urlencode 'resource=<client-id>'
```

**Sample response**

```JSON
    {
        "token_type": "Bearer",
        "expires_in": 86399,
        "ext_expires_in": 86399,
        "access_token": "abcdefgh123456............."
    }
```
Copy the `access_token` value from the response. You'll need it to pass as one of the headers in all calls to the Entitlements API of your Azure Data Manager for Energy instance. 

## User management activities

You can manage users' access to your Azure Data Manager for Energy instance or data partitions. As a prerequisite for this step, you need to find the 'object-id' (OID) of the user(s) first. If you are managing an application's access to your instance or data partition, then you must find and use the application ID (or client ID) instead of the OID.

You'll need to input the `object-id` (OID) of the users (or the application or client ID if managing access for an application) as parameters in the calls to the Entitlements API of your Azure Data Manager for Energy Instance. `object-id` (OID) is the Microsoft Entra user Object ID.

:::image type="content" source="media/how-to-manage-users/azure-active-directory-object-id.png" alt-text="Screenshot of finding the object-id from Microsoft Entra ID.":::

:::image type="content" source="media/how-to-manage-users/profile-object-id.png" alt-text="Screenshot of finding the object-id from the profile.":::

### Get the list of all available groups 

Run the below curl command in Azure Cloud Bash to get all the groups that are available for your Azure Data Manager for Energy instance and its data partitions.

```bash
    curl --location --request GET "https://<URI>/api/entitlements/v2/groups/" \
    --header 'data-partition-id: <data-partition>' \
    --header 'Authorization: Bearer <access_token>'
```

### Add user(s) to a users group

Run the below curl command in Azure Cloud Bash to add user(s) to the "Users" group using Entitlement service.

```bash
    curl --location --request POST 'https://<URI>/api/entitlements/v2/groups/users@<data-partition-id>.dataservices.energy/members' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
                    "email": "<Object_ID>",
                    "role": "MEMBER"
                }'
```

The value to be sent for the param **"email"** is the **Object_ID (OID)** of the user and not the user's email

**Sample request**

Consider an Azure Data Manager for Energy instance named "medstest" with a data partition named "dp1"

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

**Sample Response**

```JSON
    {
        "email": "90e0d063-2f8e-4244-860a-XXXXXXXXXX",
        "role": "MEMBER"
    }
```

### Add user(s) to an entitlements group

Run the below curl command in Azure Cloud Bash to add user(s) to an entitlement group using Entitlement service.

```bash
    curl --location --request POST 'https://<URI>/api/entitlements/v2/groups/service.search.user@<data-partition-id>.dataservices.energy/members' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
                "email": "<Object_ID>",
                "role": "MEMBER"
    }'
```
The value to be sent for the param **"email"** is the **Object_ID (OID)** of the user and not the user's email

**Sample request**

Consider an Azure Data Manager for Energy instance named "medstest" with a data partition named "dp1"

```bash
    curl --location --request POST 'https://medstest.energy.azure.com/api/entitlements/v2/groups/service.search.user@medstest-dp1.dataservices.energy/members' \
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

### Get entitlements groups for a given user

Run the below curl command in Azure Cloud Bash to get all the groups associated with the user.

```bash
    curl --location --request GET 'https://<URI>/api/entitlements/v2/members/<OBJECT_ID>/groups?type=none' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>'
```

**Sample request**

Consider an Azure Data Manager for Energy instance named "medstest" with a data partition named "dp1"

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

### Delete entitlement groups of a given user

Run the below curl command in Azure Cloud Bash to delete a given user to your Azure Data Manager for Energy instance data partition.

As stated above, **DO NOT** delete the OWNER of a group unless you have another OWNER that can manage users in that group.

```bash
    curl --location --request DELETE 'https://<URI>/api/entitlements/v2/members/<OBJECT_ID>' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>'
```

**Sample request**

Consider an Azure Data Manager for Energy instance named "medstest" with a data partition named "dp1"

```bash
    curl --location --request DELETE 'https://medstest.energy.azure.com/api/entitlements/v2/members/90e0d063-2f8e-4244-860a-XXXXXXXXXX' \
    --header 'data-partition-id: medstest-dp1' \
    --header 'Authorization: Bearer abcdefgh123456.............'
```

**Sample response**
No output for a successful response



## Next steps
<!-- Add a context sentence for the following links -->
Create a legal tag for your Azure Data Manager for Energy instance's data partition.
> [!div class="nextstepaction"]
> [How to manage legal tags](how-to-manage-legal-tags.md)

Begin your journey by ingesting data into your Azure Data Manager for Energy instance.
> [!div class="nextstepaction"]
> [Tutorial on CSV parser ingestion](tutorial-csv-ingestion.md)
> [!div class="nextstepaction"]
> [Tutorial on manifest ingestion](tutorial-manifest-ingestion.md)
