---
title: How to manage users #Required; page title is displayed in search results. Include the brand.
description: This article describes how to manage users in Microsoft Energy Data Services #Required; article description that is displayed in search results. 
author: Lakshmisha-KS #Required; your GitHub user alias, with correct capitalization.
ms.author: lakshmishaks #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 08/19/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# How to manage users?
This article describes how to manage users in Microsoft Energy Data Services. It uses the [entitlements API](https://community.opengroup.org/osdu/platform/security-and-compliance/entitlements/-/tree/master/) and acts as a group-based authorization system for data partitions within Microsoft Energy Data Service instance. 

## 1. Prerequisites

Create a Microsoft Energy Data Services instance using guide at [How to create Microsoft Energy Data Services instance](quickstart-create-project-oak-forest-instance.md).

Keep the following values handy. These values will be used to: 

* Generate the access token, which you'll need to make valid calls to the Entitlements API of your Microsoft Energy Data Services instance
* Pass as parameters for different user management requests to the Entitlements API. 

#### 1. Find `tenant-id`
Navigate to the Azure Active Directory account for your organization. One way to do so is by searching for "Azure Active Directory" in the Azure portal's search bar. Once there, locate `tenant-id` under the basic information section in the *Overview* tab. Copy the `tenant-id` and paste in an editor to be used later.  

:::image type="content" source="media/how-to-manage-users/azure-active-directory.png" alt-text="Screenshot of search for Azure Active Directory.":::

:::image type="content" source="media/how-to-manage-users/tenant-id.png" alt-text="Screenshot of finding the tenant-id.":::

#### 2. Find `client-id`
Often called `app-id`, it's the same value that you used to register your application during the provisioning of your Microsoft Energy Data Services instance. *link to the Microsoft Energy Data Services provisioning page here*. You'll find the `client-id` in the *Essentials* pane of Microsoft Energy Data Services *Overview* page. Copy the `client-id` and paste in an editor to be used later. 

:::image type="content" source="media/how-to-manage-users/client-id-or-app-id.png" alt-text="Screenshot of finding the client-id for your registered App.":::

#### 3. Find `client-secret`
Sometimes called an application password, a `client-secret` is a string value your app can use in place of a certificate to identity itself. Navigate to *App Registrations*. One way to do so is searching for "App Registrations" in the Azure portal's search bar. Once there, open 'Certificates & secrets' under the *Manage* section. If you haven't yet created a `client-secret` for the `client-id` that you used to create your Microsoft Energy Data Services instance, you can add one now by clicking on *New Client Secret*. Record the secret's `value` for use in your client application code. 

> [!NOTE]
> Don't forget to record the secret's value for use in your client application code. This secret value is never displayed again after you leave this page.

:::image type="content" source="media/how-to-manage-users/client-secret.png" alt-text="Screenshot of finding the client secret.":::

#### 4. Find the `url`for your Microsoft Energy Data Services instance
Navigate to your Microsoft Energy Data Services *Overview* page on Azure portal. Copy the URI from the essentials pane. 

:::image type="content" source="media/how-to-manage-users/endpoint-url.png" alt-text="Screenshot of finding the url from Microsoft Energy Data Services instance.":::

#### 5. Find the `data-partition-id` for your group
You have two ways to get the list of data-partitions in your Microsoft Energy Data Services instance. 
- By navigating *Data Partitions* menu-item under the Advanced section of your Microsoft Energy Data Services UI.
- By clicking on the *#* against the *data partitions* field in the essentials pane of your Microsoft Energy Data Services *Overview* page. 

:::image type="content" source="media/how-to-manage-users/data-partition-id.png" alt-text="Screenshot of finding the data-partition-id from the Microsoft Energy Data Services instance.":::

## 2. Generate access token

Run the following curl command after replacing the placeholder values with the corresponding values found as pre-requisites.
 
**Request format**

```bash
curl --location --request POST 'https://login.microsoftonline.com/{{tenant-id}}/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'scope={{client-id}}.default' \
--data-urlencode 'client_id={{client-id}}' \
--data-urlencode 'client_secret={{client-secret}}' \
--data-urlencode 'resource={{client-id}}'
```

**Sample response**

```JSON
    {
        "token_type": "Bearer",
        "expires_in": 86399,
        "ext_expires_in": 86399,
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1yNS1BVWliZ..."
    }
```
Copy the `access token` value from the response. You'll need it to pass as one of the headers in all calls to the Entitlements API of your Microsoft Energy Data Services instance. 

## 3. User management activities
Get all groups that are either built in groups or have been made for your Oak instance or data partitions. Find the following two fields first. 

You'll need `object-id` (OID) for your users as parameters in the calls to the Entitlements API of your Microsoft Energy Data Services Instance. `object-id`(OID) is the Azure Active Directory User Object ID.

:::image type="content" source="media/how-to-manage-users/aad-object-id.png" alt-text="Screenshot of finding the object-id from Azure Active Directory.":::

:::image type="content" source="media/how-to-manage-users/profile-object-id.png" alt-text="Screenshot of finding the object-id from the profile.":::

### 1. Get the list of all available groups 

Get all groups that are either built in groups or have been made for your Oak instance or data partitions.

```bash
    curl --location --request GET "<url>/api/entitlements/v2/groups/" \
    --header 'data-partition-id: <data-partition>' \
    --header 'Authorization: Bearer {{TOKEN}}'
```

### 2. Add user(s) to a users group

Add user to the "Users" group using Entitlement service.

```bash
    curl --location --request POST 'https://<URI>/api/entitlements/v2/groups/users@<data-partition-id>.contoso.com/members' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
                    "email": "<Object_ID>",
                    "role": "MEMBER"
                }'
```
> [!NOTE]
> The value to be sent for the param "email" is the Object ID of the user and not the user's email

**Sample request**

```bash
    curl --location --request POST 'https://bseloak.energy.azure.com/api/entitlements/v2/groups/users@bseloak-bseldp1.contoso.com/members' \
    --header 'data-partition-id: bseloak-bseldp1' \
    --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCIsImtpZCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCJ9...' \
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

### 3. Add user(s) to an entitlements group

```bash
    curl --location --request POST 'https://<URI>/api/entitlements/v2/groups/users.datalake.editors@<data-partition-id>.contoso.com/members' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
                "email": "<Object_ID>",
                "role": "MEMBER"
    }'
```
> [!NOTE]
> The value to be sent for the param "email" is the Object ID of the user and not the user's email

**Sample request**

```bash
    curl --location --request POST 'https://bseloak.energy.azure.com/api/entitlements/v2/groups/users.datalake.editors@bseloak-bseldp1.contoso.com/members' \
    --header 'data-partition-id: bseloak-bseldp1' \
    --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCIsImtpZCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCJ9...' \
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

### 4. Get entitlements groups for a given user

```bash
    curl --location --request GET 'https://<URI>/api/entitlements/v2/members/<OBJECT_ID>/groups?type=none' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>'
```

**Sample request**

```bash
    curl --location --request GET 'https://bseloak.energy.azure.com/api/entitlements/v2/members/90e0d063-2f8e-4244-860a-XXXXXXXXXX/groups?type=none' \
    --header 'data-partition-id: bseloak-bseldp1' \
    --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCIsImtpZCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCJ...'
```
**Sample response**

```JSON
    {
    "desId": "90e0d063-2f8e-4244-860a-XXXXXXXXXX",
    "memberEmail": "90e0d063-2f8e-4244-860a-XXXXXXXXXX",
    "groups": [
        {
        "name": "data.default.viewers",
        "description": "Default data viewers",
        "email": "data.default.viewers@bseloak-bseldp1.contoso.com"
        },
        {
        "name": "data.default.owners",
        "description": "Default data owners",
        "email": "data.default.owners@bseloak-bseldp1.contoso.com"
        },
        {
        "name": "service.search.user",
        "description": "Datalake Search users",
        "email": "service.search.user@bseloak-bseldp1.contoso.com"
        }
    ]
    }
```

### 5. Delete entitlement groups of a given user

> [!NOTE]
> As stated above, **DO NOT** delete the OWNER of a group unless you have another OWNER that can manage users in that group.

```bash
    curl --location --request DELETE 'https://<URI>/api/entitlements/v2/members/<OBJECT_ID>' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>'
```

**Sample request**

```bash
    curl --location --request DELETE 'https://bseloak.energy.azure.com/api/entitlements/v2/members/90e0d063-2f8e-4244-860a-XXXXXXXXXX' \
    --header 'data-partition-id: bseloak-bseldp1' \
    --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCIsImtpZCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCJ9...'
```

**Sample response**
No output for a successful response



## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [How to manage legal tags](how-to-manage-legal-tags.md)