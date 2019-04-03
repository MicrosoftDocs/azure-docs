---
title: How to use Notification Hubs with Python
description: Learn how to use Azure Notification Hubs from a Python back-end.
services: notification-hubs
documentationcenter: ''
author: jwargo
manager: patniko
editor: spelluru

ms.assetid: 5640dd4a-a91e-4aa0-a833-93615bde49b4
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: python
ms.devlang: php
ms.topic: article
ms.author: jowargo
ms.date: 01/04/2019
---

# How to use Notification Hubs from Python

[!INCLUDE [notification-hubs-backend-how-to-selector](../../includes/notification-hubs-backend-how-to-selector.md)]

You can access all Notification Hubs features from a Java/PHP/Python/Ruby back-end using the Notification Hub REST interface as described in the MSDN article [Notification Hubs REST APIs](https://msdn.microsoft.com/library/dn223264.aspx).

> [!NOTE]
> This is a sample reference implementation for implementing the notification sends in Python and is not the officially supported Notifications Hub Python SDK. The sample was created using Python 3.4.

This article shows you how to:

- Build a REST client for Notification Hubs features in Python.
- Send notifications using the Python interface to the Notification Hub REST APIs.
- Get a dump of the HTTP REST request/response for debugging/educational purpose.

You can follow the [Get started tutorial](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md) for your mobile platform of choice, implementing the back-end portion in Python.

> [!NOTE]
> The scope of the sample is only limited to send notifications and it doesn't do any registration management.

## Client interface

The main client interface can provide the same methods that are available in the [.NET Notification Hubs SDK](https://msdn.microsoft.com/library/jj933431.aspx). This interface allows you to directly translate all the tutorials and samples currently available on this site, and contributed by the community on the internet.

You can find all the code available in the [Python REST wrapper sample].

For example, to create a client:

```python
isDebug = True
hub = NotificationHub("myConnectionString", "myNotificationHubName", isDebug)
```

To send a Windows toast notification:

```python
wns_payload = """<toast><visual><binding template=\"ToastText01\"><text id=\"1\">Hello world!</text></binding></visual></toast>"""
hub.send_windows_notification(wns_payload)
```

## Implementation

If you did not already, follow the [Get started tutorial] up to the last section where you have to implement the back-end.

All the details to implement a full REST wrapper can be found on [MSDN](https://msdn.microsoft.com/library/dn530746.aspx). This section describes the Python implementation of the main steps required to access Notification Hubs REST endpoints and send notifications

1. Parse the connection string
2. Generate the authorization token
3. Send a notification using HTTP REST API

### Parse the connection string

Here is the main class implementing the client, whose constructor parses the connection string:

```python
class NotificationHub:
    API_VERSION = "?api-version=2013-10"
    DEBUG_SEND = "&test"

    def __init__(self, connection_string=None, hub_name=None, debug=0):
        self.HubName = hub_name
        self.Debug = debug

        # Parse connection string
        parts = connection_string.split(';')
        if len(parts) != 3:
            raise Exception("Invalid ConnectionString.")

        for part in parts:
            if part.startswith('Endpoint'):
                self.Endpoint = 'https' + part[11:]
            if part.startswith('SharedAccessKeyName'):
                self.SasKeyName = part[20:]
            if part.startswith('SharedAccessKey'):
                self.SasKeyValue = part[16:]
```

### Create security token

The details of the security token creation are available [here](https://msdn.microsoft.com/library/dn495627.aspx).
Add following methods to the `NotificationHub` class to create the token based on the URI of the current request and the credentials extracted from the connection string.

```python
@staticmethod
def get_expiry():
    # By default returns an expiration of 5 minutes (=300 seconds) from now
    return int(round(time.time() + 300))

@staticmethod
def encode_base64(data):
    return base64.b64encode(data)

def sign_string(self, to_sign):
    key = self.SasKeyValue.encode('utf-8')
    to_sign = to_sign.encode('utf-8')
    signed_hmac_sha256 = hmac.HMAC(key, to_sign, hashlib.sha256)
    digest = signed_hmac_sha256.digest()
    encoded_digest = self.encode_base64(digest)
    return encoded_digest

def generate_sas_token(self):
    target_uri = self.Endpoint + self.HubName
    my_uri = urllib.parse.quote(target_uri, '').lower()
    expiry = str(self.get_expiry())
    to_sign = my_uri + '\n' + expiry
    signature = urllib.parse.quote(self.sign_string(to_sign))
    auth_format = 'SharedAccessSignature sig={0}&se={1}&skn={2}&sr={3}'
    sas_token = auth_format.format(signature, expiry, self.SasKeyName, my_uri)
    return sas_token
```

### Send a notification using HTTP REST API

First, let use define a class representing a notification.

```python
class Notification:
    def __init__(self, notification_format=None, payload=None, debug=0):
        valid_formats = ['template', 'apple', 'fcm', 'windows', 'windowsphone', "adm", "baidu"]
        if not any(x in notification_format for x in valid_formats):
            raise Exception(
                "Invalid Notification format. " +
                "Must be one of the following - 'template', 'apple', 'fcm', 'windows', 'windowsphone', 'adm', 'baidu'")

        self.format = notification_format
        self.payload = payload

        # array with keynames for headers
        # Note: Some headers are mandatory: Windows: X-WNS-Type, WindowsPhone: X-NotificationType
        # Note: For Apple you can set Expiry with header: ServiceBusNotification-ApnsExpiry
        # in W3C DTF, YYYY-MM-DDThh:mmTZD (for example, 1997-07-16T19:20+01:00).
        self.headers = None
```

This class is a container for a native notification body or a set of properties of a template notification, a set of headers, which contains format (native platform or template) and platform-specific properties (like Apple expiration property and WNS headers).

Refer to the [Notification Hubs REST APIs documentation](https://msdn.microsoft.com/library/dn495827.aspx) and the specific notification platforms' formats for all the options available.

Now with this class, write the send notification methods inside of the `NotificationHub` class.

```python
def make_http_request(self, url, payload, headers):
    parsed_url = urllib.parse.urlparse(url)
    connection = http.client.HTTPSConnection(parsed_url.hostname, parsed_url.port)

    if self.Debug > 0:
        connection.set_debuglevel(self.Debug)
        # adding this querystring parameter gets detailed information about the PNS send notification outcome
        url += self.DEBUG_SEND
        print("--- REQUEST ---")
        print("URI: " + url)
        print("Headers: " + json.dumps(headers, sort_keys=True, indent=4, separators=(' ', ': ')))
        print("--- END REQUEST ---\n")

    connection.request('POST', url, payload, headers)
    response = connection.getresponse()

    if self.Debug > 0:
        # print out detailed response information for debugging purpose
        print("\n\n--- RESPONSE ---")
        print(str(response.status) + " " + response.reason)
        print(response.msg)
        print(response.read())
        print("--- END RESPONSE ---")

    elif response.status != 201:
        # Successful outcome of send message is HTTP 201 - Created
        raise Exception(
            "Error sending notification. Received HTTP code " + str(response.status) + " " + response.reason)

    connection.close()

def send_notification(self, notification, tag_or_tag_expression=None):
    url = self.Endpoint + self.HubName + '/messages' + self.API_VERSION

    json_platforms = ['template', 'apple', 'fcm', 'adm', 'baidu']

    if any(x in notification.format for x in json_platforms):
        content_type = "application/json"
        payload_to_send = json.dumps(notification.payload)
    else:
        content_type = "application/xml"
        payload_to_send = notification.payload

    headers = {
        'Content-type': content_type,
        'Authorization': self.generate_sas_token(),
        'ServiceBusNotification-Format': notification.format
    }

    if isinstance(tag_or_tag_expression, set):
        tag_list = ' || '.join(tag_or_tag_expression)
    else:
        tag_list = tag_or_tag_expression

    # add the tags/tag expressions to the headers collection
    if tag_list != "":
        headers.update({'ServiceBusNotification-Tags': tag_list})

    # add any custom headers to the headers collection that the user may have added
    if notification.headers is not None:
        headers.update(notification.headers)

    self.make_http_request(url, payload_to_send, headers)

def send_apple_notification(self, payload, tags=""):
    nh = Notification("apple", payload)
    self.send_notification(nh, tags)

def send_fcm_notification(self, payload, tags=""):
    nh = Notification("fcm", payload)
    self.send_notification(nh, tags)

def send_adm_notification(self, payload, tags=""):
    nh = Notification("adm", payload)
    self.send_notification(nh, tags)

def send_baidu_notification(self, payload, tags=""):
    nh = Notification("baidu", payload)
    self.send_notification(nh, tags)

def send_mpns_notification(self, payload, tags=""):
    nh = Notification("windowsphone", payload)

    if "<wp:Toast>" in payload:
        nh.headers = {'X-WindowsPhone-Target': 'toast', 'X-NotificationClass': '2'}
    elif "<wp:Tile>" in payload:
        nh.headers = {'X-WindowsPhone-Target': 'tile', 'X-NotificationClass': '1'}

    self.send_notification(nh, tags)

def send_windows_notification(self, payload, tags=""):
    nh = Notification("windows", payload)

    if "<toast>" in payload:
        nh.headers = {'X-WNS-Type': 'wns/toast'}
    elif "<tile>" in payload:
        nh.headers = {'X-WNS-Type': 'wns/tile'}
    elif "<badge>" in payload:
        nh.headers = {'X-WNS-Type': 'wns/badge'}

    self.send_notification(nh, tags)

def send_template_notification(self, properties, tags=""):
    nh = Notification("template", properties)
    self.send_notification(nh, tags)
```

These methods send an HTTP POST request to the /messages endpoint of your notification hub, with the correct body and headers to send the notification.

### Using debug property to enable detailed logging

Enabling debug property while initializing the Notification Hub writes out detailed logging information about the HTTP request and response dump as well as detailed Notification message send outcome.
The [Notification Hubs TestSend property](https://docs.microsoft.com/previous-versions/azure/reference/dn495827(v=azure.100)) returns detailed information about the notification send outcome.
To use it - initialize using the following code:

```python
hub = NotificationHub("myConnectionString", "myNotificationHubName", isDebug)
```

The Notification Hub Send request HTTP URL gets appended with a "test" query string as a result.

## <a name="complete-tutorial"></a>Complete the tutorial

Now you can complete the Get Started tutorial by sending the notification from a Python back-end.

Initialize your Notification Hubs client (substitute the connection string and hub name as instructed in the [Get started tutorial]):

```python
hub = NotificationHub("myConnectionString", "myNotificationHubName")
```

Then add the send code depending on your target mobile platform. This sample also adds higher-level methods to enable sending notifications based on the platform, for example, send_windows_notification for windows; send_apple_notification (for apple) etc.

### Windows Store and Windows Phone 8.1 (non-Silverlight)

```python
wns_payload = """<toast><visual><binding template=\"ToastText01\"><text id=\"1\">Test</text></binding></visual></toast>"""
hub.send_windows_notification(wns_payload)
```

### Windows Phone 8.0 and 8.1 Silverlight

```python
hub.send_mpns_notification(toast)
```

### iOS

```python
alert_payload = {
    'data':
        {
            'msg': 'Hello!'
        }
}
hub.send_apple_notification(alert_payload)
```

### Android

```python
fcm_payload = {
    'data':
        {
            'msg': 'Hello!'
        }
}
hub.send_fcm_notification(fcm_payload)
```

### Kindle Fire

```python
adm_payload = {
    'data':
        {
            'msg': 'Hello!'
        }
}
hub.send_adm_notification(adm_payload)
```

### Baidu

```python
baidu_payload = {
    'data':
        {
            'msg': 'Hello!'
        }
}
hub.send_baidu_notification(baidu_payload)
```

Running your Python code should produce a notification appearing on your target device.

## Examples

### Enabling the `debug` property

When you enable the debug flag while initializing the NotificationHub, you see detailed HTTP request and response dump as well as NotificationOutcome like the following where you can understand what HTTP headers are passed in the request and what HTTP response was received from the Notification Hub:

![][1]

You see detailed Notification Hub result for example.

- when the message is successfully sent to the Push Notification Service.
    ```xml
    <Outcome>The Notification was successfully sent to the Push Notification System</Outcome>
    ```
- If there were no targets found for any push notification, then you are likely going to see the following output as the response (which indicates that there were no registrations found to deliver the notification probably because the registrations had some mismatched tags)
    ```xml
    '<NotificationOutcome xmlns="http://schemas.microsoft.com/netservices/2010/10/servicebus/connect" xmlns:i="https://www.w3.org/2001/XMLSchema-instance"><Success>0</Success><Failure>0</Failure><Results i:nil="true"/></NotificationOutcome>'
    ```

### Broadcast toast notification to Windows

Notice the headers that get sent out when you are sending a broadcast toast notification to Windows client.

```python
hub.send_windows_notification(wns_payload)
```

![][2]

### Send notification specifying a tag (or tag expression)

Notice the Tags HTTP header, which gets added to the HTTP request (in the example below, the notification is sent only to registrations with 'sports' payload)

```python
hub.send_windows_notification(wns_payload, "sports")
```

![][3]

### Send notification specifying multiple tags

Notice how the Tags HTTP header changes when multiple tags are sent.

```python
tags = {'sports', 'politics'}
hub.send_windows_notification(wns_payload, tags)
```

![][4]

### Templated notification

Notice that the Format HTTP header changes and the payload body is sent as part of the HTTP request body:

**Client side - registered template:**

```python
var template = @"<toast><visual><binding template=""ToastText01""><text id=""1"">$(greeting_en)</text></binding></visual></toast>";
```

**Server side - sending the payload:**

```python
template_payload = {'greeting_en': 'Hello', 'greeting_fr': 'Salut'}
hub.send_template_notification(template_payload)
```

![][5]

## Next Steps

This article showed how to create a Python REST client for Notification Hubs. From here you can:

- Download the full [Python REST wrapper sample], which contains all the code in this article.
- Continue learning about Notification Hubs tagging feature in the [Breaking News tutorial]
- Continue learning about Notification Hubs Templates feature in the [Localizing News tutorial]

<!-- URLs -->
[Python REST wrapper sample]: https://github.com/Azure/azure-notificationhubs-samples/tree/master/notificationhubs-rest-python
[Get started tutorial]: https://azure.microsoft.com/documentation/articles/notification-hubs-windows-store-dotnet-get-started/
[Breaking News tutorial]: https://azure.microsoft.com/documentation/articles/notification-hubs-windows-store-dotnet-send-breaking-news/
[Localizing News tutorial]: https://azure.microsoft.com/documentation/articles/notification-hubs-windows-store-dotnet-send-localized-breaking-news/

<!-- Images. -->
[1]: ./media/notification-hubs-python-backend-how-to/DetailedLoggingInfo.png
[2]: ./media/notification-hubs-python-backend-how-to/BroadcastScenario.png
[3]: ./media/notification-hubs-python-backend-how-to/SendWithOneTag.png
[4]: ./media/notification-hubs-python-backend-how-to/SendWithMultipleTags.png
[5]: ./media/notification-hubs-python-backend-how-to/TemplatedNotification.png
