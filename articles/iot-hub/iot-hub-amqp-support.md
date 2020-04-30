---
title: Understand Azure IoT Hub AMQP support | Microsoft Docs
description: Developer guide - support for devices connecting to IoT Hub device-facing and service-facing endpoints using the AMQP Protocol. Includes information about built-in AMQP support in the Azure IoT device SDKs.
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/30/2019
ms.author: robinsh
ms.custom:  [amqp, mqtt]
---

# Communicate with your IoT hub by using the AMQP Protocol

Azure IoT Hub supports [OASIS Advanced Message Queuing Protocol
(AMQP) version 1.0](https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-complete-v1.0-os.pdf) to deliver a variety of functionalities through device-facing and service-facing endpoints. This document describes the use of AMQP clients to connect to an IoT hub to use IoT Hub functionality.

## Service client

### Connect and authenticate to an IoT hub (service client)

To connect to an IoT hub by using AMQP, a client can use the [claims-based security (CBS)](https://www.oasis-open.org/committees/download.php/60412/amqp-cbs-v1.0-wd03.doc) or [Simple Authentication and Security Layer (SASL) authentication](https://en.wikipedia.org/wiki/Simple_Authentication_and_Security_Layer).

The following information is required for the service client:

| Information | Value |
|-------------|--------------|
| IoT hub hostname | `<iot-hub-name>.azure-devices.net` |
| Key name | `service` |
| Access key | A primary or secondary key that's associated with the service |
| Shared access signature | A short-lived shared access signature in the following format: `SharedAccessSignature sig={signature-string}&se={expiry}&skn={policyName}&sr={URL-encoded-resourceURI}`. To get the code for generating this signature, see [Control access to IoT Hub](./iot-hub-devguide-security.md#security-token-structure).

The following code snippet uses the [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python) to connect to an IoT hub via a sender link.

```python
import uamqp
import urllib
import time

# Use generate_sas_token implementation available here:
# https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security#security-token-structure
from helper import generate_sas_token

iot_hub_name = '<iot-hub-name>'
hostname = '{iot_hub_name}.azure-devices.net'.format(iot_hub_name=iot_hub_name)
policy_name = 'service'
access_key = '<primary-or-secondary-key>'
operation = '<operation-link-name>'  # example: '/messages/devicebound'

username = '{policy_name}@sas.root.{iot_hub_name}'.format(
    iot_hub_name=iot_hub_name, policy_name=policy_name)
sas_token = generate_sas_token(hostname, access_key, policy_name)
uri = 'amqps://{}:{}@{}{}'.format(urllib.quote_plus(username),
                                  urllib.quote_plus(sas_token), hostname, operation)

# Create a send or receive client
send_client = uamqp.SendClient(uri, debug=True)
receive_client = uamqp.ReceiveClient(uri, debug=True)
```

### Invoke cloud-to-device messages (service client)

To learn about the cloud-to-device message exchange between the service and the IoT hub and between the device and the IoT hub, see [Send cloud-to-device messages from your IoT hub](iot-hub-devguide-messages-c2d.md). The service client uses two links to send messages and receive feedback for previously sent messages from devices, as described in the following table:

| Created by | Link type | Link path | Description |
|------------|-----------|-----------|-------------|
| Service | Sender link | `/messages/devicebound` | Cloud-to-device messages that are destined for devices are sent to this link by the service. Messages sent over this link have their `To` property set to the target device's receiver link path, `/devices/<deviceID>/messages/devicebound`. |
| Service | Receiver link | `/messages/serviceBound/feedback` | Completion, rejection, and abandonment feedback messages that come from devices received on this link by service. For more information about feedback messages, see [Send cloud-to-device messages from an IoT hub](./iot-hub-devguide-messages-c2d.md#message-feedback). |

The following code snippet demonstrates how to create a cloud-to-device message and send it to a device by using the [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python).

```python
import uuid
# Create a message and set message property 'To' to the device-bound link on device
msg_id = str(uuid.uuid4())
msg_content = b"Message content goes here!"
device_id = '<device-id>'
to = '/devices/{device_id}/messages/devicebound'.format(device_id=device_id)
ack = 'full'  # Alternative values are 'positive', 'negative', and 'none'
app_props = {'iothub-ack': ack}
msg_props = uamqp.message.MessageProperties(message_id=msg_id, to=to)
msg = uamqp.Message(msg_content, properties=msg_props,
                    application_properties=app_props)

# Send the message by using the send client that you created and connected to the IoT hub earlier
send_client.queue_message(msg)
results = send_client.send_all_messages()

# Close the client if it's not needed
send_client.close()
```

To receive feedback, the service client creates a receiver link. The following code snippet demonstrates how to create a link by using the [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python):

```python
import json

operation = '/messages/serviceBound/feedback'

# ...
# Re-create the URI by using the preceding feedback path and authenticate it
uri = 'amqps://{}:{}@{}{}'.format(urllib.quote_plus(username),
                                  urllib.quote_plus(sas_token), hostname, operation)

receive_client = uamqp.ReceiveClient(uri, debug=True)
batch = receive_client.receive_message_batch(max_batch_size=10)
for msg in batch:
    print('received a message')
    # Check content_type in message property to identify feedback messages coming from device
    if msg.properties.content_type == 'application/vnd.microsoft.iothub.feedback.json':
        msg_body_raw = msg.get_data()
        msg_body_str = ''.join(msg_body_raw)
        msg_body = json.loads(msg_body_str)
        print(json.dumps(msg_body, indent=2))
        print('******************')
        for feedback in msg_body:
            print('feedback received')
            print('\tstatusCode: ' + str(feedback['statusCode']))
            print('\toriginalMessageId: ' + str(feedback['originalMessageId']))
            print('\tdeviceId: ' + str(feedback['deviceId']))
            print
    else:
        print('unknown message:', msg.properties.content_type)
```

As shown in the preceding code, a cloud-to-device feedback message has a content type of *application/vnd.microsoft.iothub.feedback.json*. You can use the properties in the message's JSON body to infer the delivery status of the original message:

* Key `statusCode` in the feedback body has one of the following values: *Success*, *Expired*, *DeliveryCountExceeded*, *Rejected*, or *Purged*.

* Key `deviceId` in the feedback body has the ID of the target device.

* Key `originalMessageId` in the feedback body has the ID of the original cloud-to-device message that was sent by the service. You can use this delivery status to correlate feedback to cloud-to-device messages.

### Receive telemetry messages (service client)

By default, your IoT hub stores ingested device telemetry messages in a built-in event hub. Your service client can use the AMQP Protocol to receive the stored events.

For this purpose, the service client first needs to connect to the IoT hub endpoint and receive a redirection address to the built-in event hubs. The service client then uses the provided address to connect to the built-in event hub.

In each step, the client needs to present the following pieces of information:

* Valid service credentials (service shared access signature token).

* A well-formatted path to the consumer group partition that it intends to retrieve messages from. For a given consumer group and partition ID, the path has the following format: `/messages/events/ConsumerGroups/<consumer_group>/Partitions/<partition_id>` (the default consumer group is `$Default`).

* An optional filtering predicate to designate a starting point in the partition. This predicate can be in the form of a sequence number, offset, or enqueued timestamp.

The following code snippet uses the [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python) to demonstrate the preceding steps:

```python
import json
import uamqp
import urllib
import time

# Use the generate_sas_token implementation that's available here: https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security#security-token-structure
from helper import generate_sas_token

iot_hub_name = '<iot-hub-name>'
hostname = '{iot_hub_name}.azure-devices.net'.format(iot_hub_name=iot_hub_name)
policy_name = 'service'
access_key = '<primary-or-secondary-key>'
operation = '/messages/events/ConsumerGroups/{consumer_group}/Partitions/{p_id}'.format(
    consumer_group='$Default', p_id=0)

username = '{policy_name}@sas.root.{iot_hub_name}'.format(
    policy_name=policy_name, iot_hub_name=iot_hub_name)
sas_token = generate_sas_token(hostname, access_key, policy_name)
uri = 'amqps://{}:{}@{}{}'.format(urllib.quote_plus(username),
                                  urllib.quote_plus(sas_token), hostname, operation)

# Optional filtering predicates can be specified by using endpoint_filter
# Valid predicates include:
# - amqp.annotation.x-opt-sequence-number
# - amqp.annotation.x-opt-offset
# - amqp.annotation.x-opt-enqueued-time
# Set endpoint_filter variable to None if no filter is needed
endpoint_filter = b'amqp.annotation.x-opt-sequence-number > 2995'

# Helper function to set the filtering predicate on the source URI


def set_endpoint_filter(uri, endpoint_filter=''):
    source_uri = uamqp.address.Source(uri)
    source_uri.set_filter(endpoint_filter)
    return source_uri


receive_client = uamqp.ReceiveClient(
    set_endpoint_filter(uri, endpoint_filter), debug=True)
try:
    batch = receive_client.receive_message_batch(max_batch_size=5)
except uamqp.errors.LinkRedirect as redirect:
    # Once a redirect error is received, close the original client and recreate a new one to the re-directed address
    receive_client.close()

    sas_auth = uamqp.authentication.SASTokenAuth.from_shared_access_key(
        redirect.address, policy_name, access_key)
    receive_client = uamqp.ReceiveClient(set_endpoint_filter(
        redirect.address, endpoint_filter), auth=sas_auth, debug=True)

# Start receiving messages in batches
batch = receive_client.receive_message_batch(max_batch_size=5)
for msg in batch:
    print('*** received a message ***')
    print(''.join(msg.get_data()))
    print('\t: ' + str(msg.annotations['x-opt-sequence-number']))
    print('\t: ' + str(msg.annotations['x-opt-offset']))
    print('\t: ' + str(msg.annotations['x-opt-enqueued-time']))
```

For a given device ID, the IoT hub uses a hash of the device ID to determine which partition to store its messages in. The preceding code snippet demonstrates how events are received from a single such partition. However, note that a typical application often needs to retrieve events that are stored in all event hub partitions.

## Device client

### Connect and authenticate to an IoT hub (device client)

To connect to an IoT hub by using AMQP, a device can use [claims based security (CBS)](https://www.oasis-open.org/committees/download.php/60412/amqp-cbs-v1.0-wd03.doc) or [Simple Authentication and Security Layer (SASL)](https://en.wikipedia.org/wiki/Simple_Authentication_and_Security_Layer) authentication.

The following information is required for the device client:

| Information | Value |
|-------------|--------------|
| IoT hub hostname | `<iot-hub-name>.azure-devices.net` |
| Access key | A primary or secondary key that's associated with the device |
| Shared access signature | A short-lived shared access signature in the following format: `SharedAccessSignature sig={signature-string}&se={expiry}&skn={policyName}&sr={URL-encoded-resourceURI}`. To get the code for generating this signature, see [Control access to IoT Hub](./iot-hub-devguide-security.md#security-token-structure).

The following code snippet uses the [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python) to connect to an IoT hub via a sender link.

```python
import uamqp
import urllib
import uuid

# Use generate_sas_token implementation available here:
# https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security#security-token-structure
from helper import generate_sas_token

iot_hub_name = '<iot-hub-name>'
hostname = '{iot_hub_name}.azure-devices.net'.format(iot_hub_name=iot_hub_name)
device_id = '<device-id>'
access_key = '<primary-or-secondary-key>'
username = '{device_id}@sas.{iot_hub_name}'.format(
    device_id=device_id, iot_hub_name=iot_hub_name)
sas_token = generate_sas_token('{hostname}/devices/{device_id}'.format(
    hostname=hostname, device_id=device_id), access_key, None)

# e.g., '/devices/{device_id}/messages/devicebound'
operation = '<operation-link-name>'
uri = 'amqps://{}:{}@{}{}'.format(urllib.quote_plus(username),
                                  urllib.quote_plus(sas_token), hostname, operation)

receive_client = uamqp.ReceiveClient(uri, debug=True)
send_client = uamqp.SendClient(uri, debug=True)
```

The following link paths are supported as device operations:

| Created by | Link type | Link path | Description |
|------------|-----------|-----------|-------------|
| Devices | Receiver link | `/devices/<deviceID>/messages/devicebound` | Cloud-to-device messages that are destined for devices are received on this link by each destination device. |
| Devices | Sender link | `/devices/<deviceID>/messages/events` | Device-to-cloud messages that are sent from a device are sent over this link. |
| Devices | Sender link | `/messages/serviceBound/feedback` | Cloud-to-device message feedback sent to the service over this link by devices. |

### Receive cloud-to-device commands (device client)

Cloud-to-device commands that are sent to devices arrive on a `/devices/<deviceID>/messages/devicebound` link. Devices can receive these messages in batches, and use the message data payload, message properties, annotations, or application properties in the message as needed.

The following code snippet uses the [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python)) to receive cloud-to-device messages by a device.

```python
# ...
# Create a receive client for the cloud-to-device receive link on the device
operation = '/devices/{device_id}/messages/devicebound'.format(
    device_id=device_id)
uri = 'amqps://{}:{}@{}{}'.format(urllib.quote_plus(username),
                                  urllib.quote_plus(sas_token), hostname, operation)

receive_client = uamqp.ReceiveClient(uri, debug=True)
while True:
    batch = receive_client.receive_message_batch(max_batch_size=5)
    for msg in batch:
        print('*** received a message ***')
        print(''.join(msg.get_data()))

        # Property 'to' is set to: '/devices/device1/messages/devicebound',
        print('\tto:                     ' + str(msg.properties.to))

        # Property 'message_id' is set to value provided by the service
        print('\tmessage_id:             ' + str(msg.properties.message_id))

        # Other properties are present if they were provided by the service
        print('\tcreation_time:          ' + str(msg.properties.creation_time))
        print('\tcorrelation_id:         ' +
              str(msg.properties.correlation_id))
        print('\tcontent_type:           ' + str(msg.properties.content_type))
        print('\treply_to_group_id:      ' +
              str(msg.properties.reply_to_group_id))
        print('\tsubject:                ' + str(msg.properties.subject))
        print('\tuser_id:                ' + str(msg.properties.user_id))
        print('\tgroup_sequence:         ' +
              str(msg.properties.group_sequence))
        print('\tcontent_encoding:       ' +
              str(msg.properties.content_encoding))
        print('\treply_to:               ' + str(msg.properties.reply_to))
        print('\tabsolute_expiry_time:   ' +
              str(msg.properties.absolute_expiry_time))
        print('\tgroup_id:               ' + str(msg.properties.group_id))

        # Message sequence number in the built-in event hub
        print('\tx-opt-sequence-number:  ' +
              str(msg.annotations['x-opt-sequence-number']))
```

### Send telemetry messages (device client)

You can also send telemetry messages from a device by using AMQP. The device can optionally provide a dictionary of application properties, or various message properties, such as message ID.

The following code snippet uses the [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python) to send device-to-cloud messages from a device.

```python
# ...
# Create a send client for the device-to-cloud send link on the device
operation = '/devices/{device_id}/messages/events'.format(device_id=device_id)
uri = 'amqps://{}:{}@{}{}'.format(urllib.quote_plus(username), urllib.quote_plus(sas_token), hostname, operation)

send_client = uamqp.SendClient(uri, debug=True)

# Set any of the applicable message properties
msg_props = uamqp.message.MessageProperties()
msg_props.message_id = str(uuid.uuid4())
msg_props.creation_time = None
msg_props.correlation_id = None
msg_props.content_type = None
msg_props.reply_to_group_id = None
msg_props.subject = None
msg_props.user_id = None
msg_props.group_sequence = None
msg_props.to = None
msg_props.content_encoding = None
msg_props.reply_to = None
msg_props.absolute_expiry_time = None
msg_props.group_id = None

# Application properties in the message (if any)
application_properties = { "app_property_key": "app_property_value" }

# Create message
msg_data = b"Your message payload goes here"
message = uamqp.Message(msg_data, properties=msg_props, application_properties=application_properties)

send_client.queue_message(message)
results = send_client.send_all_messages()

for result in results:
    if result == uamqp.constants.MessageState.SendFailed:
        print result
```

## Additional notes

* The AMQP connections might be disrupted because of a network glitch or the expiration of the authentication token (generated in the code). The service client must handle these circumstances and reestablish the connection and links, if needed. If an authentication token expires, the client can avoid a connection drop by proactively renewing the token prior to its expiration.

* Your client must occasionally be able to handle link redirections correctly. To understand such an operation, see your AMQP client documentation.

## Next steps

To learn more about the AMQP Protocol, see the [AMQP v1.0 specification](https://www.amqp.org/sites/amqp.org/files/amqp.pdf).

To learn more about IoT Hub messaging, see:

* [Cloud-to-device messages](./iot-hub-devguide-messages-c2d.md)
* [Support for additional protocols](iot-hub-protocol-gateway.md)
* [Support for the Message Queuing Telemetry Transport (MQTT) Protocol](./iot-hub-mqtt-support.md)
