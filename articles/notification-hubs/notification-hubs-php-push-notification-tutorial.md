---
title: How to use Azure Notification Hubs with PHP
description: Learn how to use Azure Notification Hubs from a PHP back-end.
services: notification-hubs
documentationcenter: ''
author: sethmanheim
manager: femila
editor: jwargo

ms.assetid: 0156f994-96d0-4878-b07b-49b7be4fd856
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: php
ms.devlang: php
ms.topic: article
ms.date: 01/04/2019
ms.author: sethm
ms.reviewer: jowargo
ms.lastreviewed: 01/04/2019
---

# How to use Notification Hubs from PHP

[!INCLUDE [notification-hubs-backend-how-to-selector](../../includes/notification-hubs-backend-how-to-selector.md)]

You can access all Notification Hubs features from a Java/PHP/Ruby backend using the Notification Hub REST interface as described in the MSDN topic [Notification Hubs REST APIs](https://msdn.microsoft.com/library/dn223264.aspx).

In this topic we show how to:

* Build a REST client for Notification Hubs features in PHP;
* Follow the [Get started tutorial](notification-hubs-ios-apple-push-notification-apns-get-started.md) for your mobile platform of choice, implementing the backend portion in PHP.

## Client interface

The main client interface can provide the same methods that are available in the [.NET Notification Hubs SDK](https://msdn.microsoft.com/library/jj933431.aspx), which allows you to directly translate all the tutorials and samples currently available on this site, and contributed by the community on the internet.

You can find all the code available in the [PHP REST wrapper sample].

For example, to create a client:

    ```php
    $hub = new NotificationHub("connection string", "hubname");
    ```

To send an iOS native notification:

    ```php
    $notification = new Notification("apple", '{"aps":{"alert": "Hello!"}}');
    $hub->sendNotification($notification, null);
    ```

## Implementation

If you did not already, follow the [Get started tutorial] up to the last section where you have to implement the backend.
Also, if you want you can use the code from the [PHP REST wrapper sample] and go directly to the [Complete the tutorial](#complete-tutorial) section.

All the details to implement a full REST wrapper can be found on [MSDN](https://msdn.microsoft.com/library/dn530746.aspx). In this section, we describe the PHP implementation of the main steps required to access Notification Hubs REST endpoints:

1. Parse the connection string
2. Generate the authorization token
3. Perform the HTTP call

### Parse the connection string

Here is the main class implementing the client, whose constructor that parses the connection string:

    ```php
    class NotificationHub {
        const API_VERSION = "?api-version=2013-10";

        private $endpoint;
        private $hubPath;
        private $sasKeyName;
        private $sasKeyValue;

        function __construct($connectionString, $hubPath) {
            $this->hubPath = $hubPath;

            $this->parseConnectionString($connectionString);
        }

        private function parseConnectionString($connectionString) {
            $parts = explode(";", $connectionString);
            if (sizeof($parts) != 3) {
                throw new Exception("Error parsing connection string: " . $connectionString);
            }

            foreach ($parts as $part) {
                if (strpos($part, "Endpoint") === 0) {
                    $this->endpoint = "https" . substr($part, 11);
                } else if (strpos($part, "SharedAccessKeyName") === 0) {
                    $this->sasKeyName = substr($part, 20);
                } else if (strpos($part, "SharedAccessKey") === 0) {
                    $this->sasKeyValue = substr($part, 16);
                }
            }
        }
    }
    ```

### Create a security token

Refer to the Azure documentation for information about how to [Create a SAS Security Token](https://docs.microsoft.com/previous-versions/azure/reference/dn495627(v=azure.100)#create-sas-security-token).

Add the `generateSasToken` method to the `NotificationHub` class to create the token based on the URI of the current request and the credentials extracted from the connection string.

    ```php
    private function generateSasToken($uri) {
        $targetUri = strtolower(rawurlencode(strtolower($uri)));

        $expires = time();
        $expiresInMins = 60;
        $expires = $expires + $expiresInMins * 60;
        $toSign = $targetUri . "\n" . $expires;

        $signature = rawurlencode(base64_encode(hash_hmac('sha256', $toSign, $this->sasKeyValue, TRUE)));

        $token = "SharedAccessSignature sr=" . $targetUri . "&sig="
                    . $signature . "&se=" . $expires . "&skn=" . $this->sasKeyName;

        return $token;
    }
    ```

### Send a notification

First, let us define a class representing a notification.

    ```php
    class Notification {
        public $format;
        public $payload;

        # array with keynames for headers
        # Note: Some headers are mandatory: Windows: X-WNS-Type, WindowsPhone: X-NotificationType
        # Note: For Apple you can set Expiry with header: ServiceBusNotification-ApnsExpiry in W3C DTF, YYYY-MM-DDThh:mmTZD (for example, 1997-07-16T19:20+01:00).
        public $headers;

        function __construct($format, $payload) {
            if (!in_array($format, ["template", "apple", "windows", "fcm", "windowsphone"])) {
                throw new Exception('Invalid format: ' . $format);
            }

            $this->format = $format;
            $this->payload = $payload;
        }
    }
    ```

This class is a container for a native notification body, or a set of properties on case of a template notification, and a set of headers, which contains format (native platform or template) and platform-specific properties (like Apple expiration property and WNS headers).

Refer to the [Notification Hubs REST APIs documentation](https://msdn.microsoft.com/library/dn495827.aspx) and the specific notification platforms' formats for all the options available.

Armed with this class, we can now write the send notification methods inside of the `NotificationHub` class:

    ```php
    public function sendNotification($notification, $tagsOrTagExpression="") {
        if (is_array($tagsOrTagExpression)) {
            $tagExpression = implode(" || ", $tagsOrTagExpression);
        } else {
            $tagExpression = $tagsOrTagExpression;
        }

        # build uri
        $uri = $this->endpoint . $this->hubPath . "/messages" . NotificationHub::API_VERSION;
        $ch = curl_init($uri);

        if (in_array($notification->format, ["template", "apple", "fcm"])) {
            $contentType = "application/json";
        } else {
            $contentType = "application/xml";
        }

        $token = $this->generateSasToken($uri);

        $headers = [
            'Authorization: '.$token,
            'Content-Type: '.$contentType,
            'ServiceBusNotification-Format: '.$notification->format
        ];

        if ("" !== $tagExpression) {
            $headers[] = 'ServiceBusNotification-Tags: '.$tagExpression;
        }

        # add headers for other platforms
        if (is_array($notification->headers)) {
            $headers = array_merge($headers, $notification->headers);
        }

        curl_setopt_array($ch, array(
            CURLOPT_POST => TRUE,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_SSL_VERIFYPEER => FALSE,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => $notification->payload
        ));

        // Send the request
        $response = curl_exec($ch);

        // Check for errors
        if($response === FALSE){
            throw new Exception(curl_error($ch));
        }

        $info = curl_getinfo($ch);

        if ($info['http_code'] <> 201) {
            throw new Exception('Error sending notification: '. $info['http_code'] . ' msg: ' . $response);
        }
    } 
    ```

The above methods send an HTTP POST request to the `/messages` endpoint of your notification hub, with the correct body and headers to send the notification.

## <a name="complete-tutorial"></a>Complete the tutorial

Now you can complete the Get Started tutorial by sending the notification from a PHP backend.

Initialize your Notification Hubs client (substitute the connection string and hub name as instructed in the [Get started tutorial]):

    ```php
    $hub = new NotificationHub("connection string", "hubname");
    ```

Then add the send code depending on your target mobile platform.

### Windows Store and Windows Phone 8.1 (non-Silverlight)

    ```php
    $toast = '<toast><visual><binding template="ToastText01"><text id="1">Hello from PHP!</text></binding></visual></toast>';
    $notification = new Notification("windows", $toast);
    $notification->headers[] = 'X-WNS-Type: wns/toast';
    $hub->sendNotification($notification, null);
    ```

### iOS

    ```php
    $alert = '{"aps":{"alert":"Hello from PHP!"}}';
    $notification = new Notification("apple", $alert);
    $hub->sendNotification($notification, null);
    ```

### Android

    ```php
    $message = '{"data":{"msg":"Hello from PHP!"}}';
    $notification = new Notification("fcm", $message);
    $hub->sendNotification($notification, null);
    ```

### Windows Phone 8.0 and 8.1 Silverlight

    ```php
    $toast = '<?xml version="1.0" encoding="utf-8"?>' .
                '<wp:Notification xmlns:wp="WPNotification">' .
                   '<wp:Toast>' .
                        '<wp:Text1>Hello from PHP!</wp:Text1>' .
                   '</wp:Toast> ' .
                '</wp:Notification>';
    $notification = new Notification("windowsphone", $toast);
    $notification->headers[] = 'X-WindowsPhone-Target : toast';
    $notification->headers[] = 'X-NotificationClass : 2';
    $hub->sendNotification($notification, null);
    ```

### Kindle Fire

    ```php
    $message = '{"data":{"msg":"Hello from PHP!"}}';
    $notification = new Notification("adm", $message);
    $hub->sendNotification($notification, null);
    ```

Running your PHP code should produce now a notification appearing on your target device.

## Next Steps

In this topic, we showed how to create a simple Java REST client for Notification Hubs. From here you can:

* Download the full [PHP REST wrapper sample], which contains all the code above.
* Continue learning about Notification Hubs tagging feature in the [Breaking News tutorial]
* Learn about pushing notifications to individual users in [Notify Users tutorial]

For more information, see also the [PHP Developer Center](https://azure.microsoft.com/develop/php/).

[PHP REST wrapper sample]: https://github.com/Azure/azure-notificationhubs-samples/tree/master/notificationhubs-rest-php
[Get started tutorial]: https://azure.microsoft.com/documentation/articles/notification-hubs-ios-get-started/
