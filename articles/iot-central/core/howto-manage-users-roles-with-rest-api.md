---
title: Use the REST API to manage users and roles in Azure IoT Central
description: How to use the IoT Central REST API to manage users and roles in an application
author: dominicbetts
ms.author: dobett
ms.date: 03/24/2020
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to manage users and roles

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to manage users and roles in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](https://docs.microsoft.com/rest/api/iotcentral/).

## Manage roles

The REST API lets you list the roles defined in your IoT Central application. Use the following REST API to retrieve a list of role IDs from your application:

```http
GET https://{your app id}.azureiotcentral.com/api/v1/roles
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

## Manage users

The REST API lets you:

- List the users in an application
- Retrieve the details of an individual user
- Create a user
- Modify a user
- Delete a user

### List users

Use the following REST API to retrieve a list of users from your application:

```http
GET https://{your app id}.azureiotcentral.com/api/v1/users
```

The response to this request looks like the following example. The role values identify the role ID the user is associated with:

```json
{
  "value": [
    {
      "id": "91907508-04fe-4349-91b5-b872f3055a95",
      "type": "email",
      "roles": [
        {
          "role": "ca310b8d-2f4a-44e0-a36e-957c202cd8d4"
        }
      ],
      "email": "user1@contoso.com"
    },
    {
      "id": "dc1c916b-a652-49ea-b128-7c465a54c759",
      "type": "email",
      "roles": [
        {
          "role": "ae2c9854-393b-4f97-8c42-479d70ce626e"
        }
      ],
      "email": "user2@contoso.com"
    },
    {
      "id": "3ab9375e-d2d9-42da-b419-6ae86a938321",
      "type": "email",
      "roles": [
        {
          "role": "344138e9-8de4-4497-8c54-5237e96d6aaf"
        }
      ],
      "email": "user3@contoso.com"
    },
    {
      "id": "fc5a250b-83fb-433d-892c-e0a144f68c2b",
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

Use the following REST API to retrieve details of an individual user from your application:

```http
GET https://{your app id}.azureiotcentral.com/api/v1/users/dc1c916b-a652-49ea-b128-7c465a54c759
```

The response to this request looks like the following example. The role value identifies the role ID the user is associated with:

```json
{
  "id": "dc1c916b-a652-49ea-b128-7c465a54c759",
  "type": "email",
  "roles": [
    {
      "role": "ae2c9854-393b-4f97-8c42-479d70ce626e"
    }
  ],
  "email": "user2@contoso.com"
}
```

### Create a user

Use the following REST API to create a user in your application. The ID and email must be unique in the application:

```http
PUT https://{your app id}.azureiotcentral.com/api/v1/users/user-001
```

Request body. The `role` value is for the operator role you retrieved previously:

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

The response to this request looks like the following example. The role value identifies the role ID the user is associated with:

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

### Change the role of a user

Use the following REST API to change the role assigned to user. This example users the ID of the builder role you retrieved previously:

```http
PATCH https://{your app id}.azureiotcentral.com/api/v1/users/user-001
```

Request body. The value is for the operator role you retrieved previously:

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

Use the following REST API to delete a user:

```http
DELETE https://{your app id}.azureiotcentral.com/api/v1/users/user-001
```

## Next steps

Now that you've learned how to manage users and roles with the REST API, a suggested next step is to [Manage IoT Central applications with the REST API](/learn/modules/manage-iot-central-apps-with-rest-api/).
