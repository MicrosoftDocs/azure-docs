---
title: Managed apps with notifications
description: Configure managed applications with webhook endpoints to receive notifications about creates, updates, deletes, and errors on the managed application instances.
ms.topic: conceptual
ms.author: ilahat
author: ilahat
ms.date: 11/01/2019
---
# Azure managed applications with notifications

Azure managed application notifications allow publishers to automate actions based on lifecycle events of the managed application instances. Publishers can specify custom notification webhook endpoints to receive event notifications about new and existing managed application instances. Publishers can set up custom workflows at the time of application provisioning, updates, and deletion.

## Getting started
To start receiving managed applications, spin up a public HTTPS endpoint and specify it when you publish the service catalog application definition or Azure Marketplace offer.

Here are the recommended steps to get started quickly:
1. Spin up a public HTTPS endpoint that logs the incoming POST requests and returns `200 OK`.
2. Add the endpoint to the service catalog application definition or Azure Marketplace offer as explained later in this article.
3. Create a managed application instance that references the application definition or Azure Marketplace offer.
4. Validate that the notifications are being received.
5. Enable authorization as explained in the **Endpoint authentication** section of this article.
6. Follow the instructions in the **Notification schema** section of this article to parse the notification requests and implement your business logic based on the notification.

## Add service catalog application definition notifications
#### Azure portal
To get started, see [Publish a service catalog application through Azure portal](./publish-portal.md).

![Service catalog application definition notifications in the Azure portal](./media/publish-notifications/service-catalog-notifications.png)

#### REST API

> [!NOTE]
> Currently, you can supply only one endpoint in the `notificationEndpoints` in the application definition properties.

``` JSON
    {
      "properties": {
        "isEnabled": true,
        "lockLevel": "ReadOnly",
        "displayName": "Sample Application Definition",
        "description": "Notification-enabled application definition.",
        "notificationPolicy": {
            "notificationEndpoints": [
                {
                    "uri": "https://isv.azurewebsites.net:1214?sig=unique_token"
                }
            ]
        },
        "authorizations": [
          {
            "principalId": "d6b7fbd3-4d99-43fe-8a7a-f13aef11dc18",
            "roleDefinitionId": "8e3af657-a8ff-443c-a75c-2fe8c4bcb635"
          },
        ...

```
## Add Azure Marketplace managed application notifications
For more information, see [Create an Azure application offer](../../marketplace/cloud-partner-portal/azure-applications/cpp-create-offer.md).

![Azure Marketplace managed application notifications in the Azure portal](./media/publish-notifications/marketplace-notifications.png)
## Event triggers
The following table describes all the possible combinations of EventType and ProvisioningState and their triggers:

EventType | ProvisioningState | Trigger for notification
---|---|---
PUT | Accepted | Managed resource group has been created and projected successfully after application PUT (before the deployment inside the managed resource group is kicked off).
PUT | Succeeded | Full provisioning of the managed application succeeded after a PUT.
PUT | Failed | Failure of PUT of application instance provisioning at any point.
PATCH | Succeeded | After a successful PATCH on the managed application instance to update tags, JIT access policy, or managed identity.
DELETE | Deleting | As soon as the user initiates a DELETE of a managed app instance.
DELETE | Deleted | After the full and successful deletion of the managed application.
DELETE | Failed | After any error during the deprovisioning process that blocks the deletion.
## Notification schema
When you spin up your webhook endpoint to handle notifications, you'll need to parse the payload to get important properties to then act upon the notification. Service catalog and Azure Marketplace managed application notifications provide many of the same properties. Two small differences are outlined in the table that follows the samples.

#### Service catalog application notification schema
Here's a sample service catalog notification after the successful provisioning of a managed application instance:
``` HTTP
POST https://{your_endpoint_URI}/resource?{optional_parameter}={optional_parameter_value} HTTP/1.1

{
    "eventType": "PUT",
    "applicationId": "subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.Solutions/applications/<applicationName>",
    "eventTime": "2019-08-14T19:20:08.1707163Z",
    "provisioningState": "Succeeded",
    "applicationDefinitionId": "subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.Solutions/applicationDefinitions/<appDefName>"    
}

```

If the provisioning fails, a notification with the error details will be sent to the specified endpoint.

``` HTTP
POST https://{your_endpoint_URI}/resource?{optional_parameter}={optional_parameter_value} HTTP/1.1

{
    "eventType": "PUT",
    "applicationId": "subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.Solutions/applications/<applicationName>",
    "eventTime": "2019-08-14T19:20:08.1707163Z",
    "provisioningState": "Failed",
    "applicationDefinitionId": "subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.Solutions/applicationDefinitions/<appDefName>",
    "error": {
        "code": "ErrorCode",
        "message": "error message",
        "details": [
            {
                "code": "DetailedErrorCode",
                "message": "error message"
            }
        ]
    }
}

```

#### Azure Marketplace application notification schema

Here's a sample service catalog notification after the successful provisioning of a managed application instance:
``` HTTP
POST https://{your_endpoint_URI}/resource?{optional_parameter}={optional_parameter_value} HTTP/1.1

{
    "eventType": "PUT",
    "applicationId": "subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.Solutions/applications/<applicationName>",
    "eventTime": "2019-08-14T19:20:08.1707163Z",
    "provisioningState": "Succeeded",
    "billingDetails": {
        "resourceUsageId":"<resourceUsageId>"
    },
    "plan": {
        "publisher": "publisherId",
        "product": "offer",
        "name": "skuName",
        "version": "1.0.1"
    }
}

```

If the provisioning fails, a notification with the error details will be sent to the specified endpoint.

``` HTTP
POST https://{your_endpoint_URI}/resource?{optional_parameter}={optional_parameter_value} HTTP/1.1

{
    "eventType": "PUT",
    "applicationId": "subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.Solutions/applications/<applicationName>",
    "eventTime": "2019-08-14T19:20:08.1707163Z",
    "provisioningState": "Failed",
    "billingDetails": {
        "resourceUsageId":"<resourceUsageId>"
    },
    "plan": {
        "publisher": "publisherId",
        "product": "offer",
        "name": "skuName",
        "version": "1.0.1"
    },
    "error": {
        "code": "ErrorCode",
        "message": "error message",
        "details": [
            {
                "code": "DetailedErrorCode",
                "message": "error message"
            }
        ]
    }
}

```

Parameter | Description
---|---
eventType | The type of event that triggered the notification. (For example, PUT, PATCH, DELETE.)
applicationId | The fully qualified resource identifier of the managed application for which the notification was triggered.
eventTime | The timestamp of the event that triggered the notification. (Date and time in UTC ISO 8601 format.)
provisioningState | The provisioning state of the managed application instance. (For example, Succeeded, Failed, Deleting, Deleted.)
error | *Specified only when the provisioningState is Failed*. Contains the error code, message, and details of the issue that caused the failure.
applicationDefinitionId | *Specified only for service catalog managed applications*. Represents the fully qualified resource identifier of the application definition for which the managed application instance was provisioned.
plan | *Specified only for Azure Marketplace managed applications*. Represents the publisher, offer, SKU, and version of the managed application instance.
billingDetails | *Specified only for Azure Marketplace managed applications.* The billing details of the managed application instance. Contains the resourceUsageId that you can use to query Azure Marketplace for usage details.

## Endpoint authentication
To secure the webhook endpoint and ensure the authenticity of the notification:
1. Provide a query parameter on top of the webhook URI, like this: https\://your-endpoint.com?sig=Guid. With each notification, check that the query parameter `sig` has the expected value `Guid`.
2. Issue a GET on the managed application instance by using applicationId. Validate that the provisioningState matches the provisioningState of the notification to ensure consistency.

## Notification retries

The Managed Application Notification service expects a `200 OK` response from the webhook endpoint to the notification. The notification service will retry if the webhook endpoint returns an HTTP error code greater than or equal to 500, if it returns an error code of 429, or if the endpoint is temporarily unreachable. If the webhook endpoint doesn't become available within 10 hours, the notification message will be dropped and the retries will stop.
