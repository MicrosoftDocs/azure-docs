---
title: Manage users and roles with the Azure IoT Central REST API
description: How to use the IoT Central REST API to manage users and roles in an application and control access to resources
author: dominicbetts
ms.author: dobett
ms.date: 10/22/2024
ms.topic: how-to
ms.service: azure-iot-central
services: iot-central

---

# How to use the IoT Central REST API to manage users and roles

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to manage users and roles in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

> [!NOTE]
> Operations on users and roles are recorded in the IoT Central [audit log](howto-use-audit-logs.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

To learn how to manage users and roles by using the IoT Central UI, see [Manage users and roles in your IoT Central application.](../core/howto-manage-users-roles.md)

## Manage roles

The REST API lets you list the roles defined in your IoT Central application. Use the following request to retrieve a list of role IDs from your application:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/roles?api-version=2022-07-31
```

The response to this request looks like the following example that includes the three built-in roles and a custom role:

```json
{
  "value": [
    {
      "id": "ca310b8d-2f4a-44e0-a36e-957c202cd8d4",
      "displayName": "Administrator"
    },
    {
      "id": "ae2c9854-393b-4f97-8c42-479d70ce626e",
      "displayName": "Operator"
    },
    {
      "id": "344138e9-8de4-4497-8c54-5237e96d6aaf",
      "displayName": "Builder"
    },
    {
      "id": "16f8533f-6b82-478f-8ba8-7e676b541b1b",
      "displayName": "Example custom role"
    }
  ]
}
```

>[!NOTE]
>This command only shows roles that are associated with an application and not a custom organization level role.

## Manage users

The REST API lets you:

- List the users in an application
- Retrieve the details of an individual user
- Create a user
- Modify a user
- Delete a user

### List users

Use the following request to retrieve a list of users from your application:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/users?api-version=2022-07-31
```

The response to this request looks like the following example. The role values identify the role ID the user is associated with:

```json
{
  "value": [
    {
      "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
      "type": "email",
      "roles": [
        {
          "role": "ca310b8d-2f4a-44e0-a36e-957c202cd8d4"
        }
      ],
      "email": "user1@contoso.com"
    },
    {
      "id": "bbbbbbbb-1111-2222-3333-cccccccccccc",
      "type": "email",
      "roles": [
        {
          "role": "ae2c9854-393b-4f97-8c42-479d70ce626e"
        }
      ],
      "email": "user2@contoso.com"
    },
    {
      "id": "cccccccc-2222-3333-4444-dddddddddddd",
      "type": "email",
      "roles": [
        {
          "role": "344138e9-8de4-4497-8c54-5237e96d6aaf"
        }
      ],
      "email": "user3@contoso.com"
    },
    {
      "id": "dddddddd-3333-4444-5555-eeeeeeeeeeee",
      "type": "email",
      "roles": [
        {
          "role": "16f8533f-6b82-478f-8ba8-7e676b541b1b"
        }
      ],
      "email": "user4@contoso.com"
    }
  ]
}
```

### Get a user

Use the following request to retrieve details of an individual user from your application:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/users/aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb?api-version=2022-07-31
```

The response to this request looks like the following example. The role value identifies the role ID the user is associated with:

```json
{
  "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
  "type": "email",
  "roles": [
    {
      "role": "ca310b8d-2f4a-44e0-a36e-957c202cd8d4"
    }
  ],
  "email": "user2@contoso.com"
}
```

### Create a user

Use the following request to create a user in your application. The ID and email must be unique in the application:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/users/user-001?api-version=2022-07-31
```

In the following request body, the `role` value is for the operator role you retrieved previously:

```json
{
  "id": "user-001",
  "type": "email",
  "roles": [
    {
      "role": "ae2c9854-393b-4f97-8c42-479d70ce626e"
    }
  ],
  "email": "user5@contoso.com"
}
```

The response to this request looks like the following example. The role value identifies which role the user is associated with:

```json
{
  "id": "user-001",
  "type": "email",
  "roles": [
    {
      "role": "ae2c9854-393b-4f97-8c42-479d70ce626e"
    }
  ],
  "email": "user5@contoso.com"
}
```

You can also add a service principal user that's useful if you need to use service principal authentication for REST API calls. To learn more, see [Add or update a service principal user](/rest/api/iotcentral/2022-07-31dataplane/users/create#add-or-update-a-service-principal-user).

### Change the role of a user

Use the following request to change the role assigned to user. This example uses the ID of the builder role you retrieved previously:

```http
PATCH https://{your app subdomain}.azureiotcentral.com/api/users/user-001?api-version=2022-07-31
```

Request body. The value is for the builder role you retrieved previously:

```json
{
  "roles": [
    {
      "role": "344138e9-8de4-4497-8c54-5237e96d6aaf"
    }
  ]
}
```

The response to this request looks like the following example:

```json
{
  "id": "user-001",
  "type": "email",
  "roles": [
    {
      "role": "344138e9-8de4-4497-8c54-5237e96d6aaf"
    }
  ],
  "email": "user5@contoso.com"
}
```

### Delete a user

Use the following request to delete a user:

```http
DELETE https://{your app subdomain}.azureiotcentral.com/api/users/user-001?api-version=2022-07-31
```

## Next steps

Now that you've learned how to manage users and roles with the REST API, a suggested next step is to [How to use the IoT Central REST API to manage organizations.](howto-manage-organizations-with-rest-api.md)
