---
title: Understand Azure IoT Hub AMQP support | Microsoft Docs
description: Developer guide - support for devices connecting to IoT Hub device-facing and service-facing endpoints using the AMQP protocol. Includes information about built-in AMQP support in the Azure IoT device SDKs.
author: rezasherafat
manager: 
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/30/2019
ms.author: rezas
---

# Communicate with your IoT hub using the AMQP protocol

IoT Hub supports [AMQP version 1.0](http://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-complete-v1.0-os.pdf) to deliver a variety of functionalities through device-facing and service-facing endpoints. This document describes the use of AMQP clients to connect to IoT Hub in order to use IoT Hub functionality.

## Service client

### Connection and authenticating to IoT Hub (service client)
To connect to IoT Hub using AMQP, a client can use the [Claims Based Security (CBS)](https://www.oasis-open.org/committees/download.php/60412/amqp-cbs-v1.0-wd03.doc) or [Simple Authentication and Security Layer (SASL) authentication](https://en.wikipedia.org/wiki/Simple_Authentication_and_Security_Layer).

The following information is required for the service client:

| Information | Value | 
|-------------|--------------|
| IoT Hub Hostname | `<iot-hub-name>.azure-devices.net` |
| Key name | `service` |
| Access key | Primary or secondary key associated with the service |
| Shared Access Signature | Short-lived SAS in the following format: `SharedAccessSignature sig={signature-string}&se={expiry}&skn={policyName}&sr={URL-encoded-resourceURI}` (the code to generate this signature can be found [here](./iot-hub-devguide-security.md#security-token-structure)).


The code snippet below uses [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python) to connect to IoT hub via a sender link.

```python
import uamqp
import urllib
import time

# Use generate_sas_token implementation available here: https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security#security-token-structure
from helper import generate_sas_token

iot_hub_name = '<iot-hub-name>'
hostname = '{iot_hub_name}.azure-devices.net'.format(iot_hub_name=iot_hub_name)
policy_name = 'service'
access_key = '<primary-or-secondary-key>'
operation = '<operation-link-name>' # e.g., '/messages/devicebound'

username = '{policy_name}@sas.root.{iot_hub_name}'.format(iot_hub_name=iot_hub_name, policy_name=policy_name)
sas_token = generate_sas_token(hostname, access_key, policy_name)
uri = 'amqps://{}:{}@{}{}'.format(urllib.quote_plus(username), urllib.quote_plus(sas_token), hostname, operation)

# Create a send or receive client
send_client = uamqp.SendClient(uri, debug=True)
receive_client = uamqp.ReceiveClient(uri, debug=True)
```

### Invoking cloud-to-device messages (service client)
The cloud-to-device message exchange between service and IoT Hub as well as between device and IoT Hub is described [here](iot-hub-devguide-messages-c2d.md). The service client uses two links described below to send messages and receive feedback for previously sent messages from devices.

| Created by | Link type | Link path | Description |
|------------|-----------|-----------|-------------|
| Service | Sender link | `/messages/devicebound` | C2D messages destined to devices are sent to this link by the service. Messages sent over this link have their `To` property set to the target device's receiver link path: i.e., `/devices/<deviceID>/messages/devicebound`. |
| Service | Receiver link | `/messages/serviceBound/feedback` | Completion, rejection, and abandonment feedback messages coming from devices received on this link by service. For more information about feedback messages, see [here](./iot-hub-devguide-messages-c2d.md#message-feedback). |

The code snippet below demonstrates how to create a C2D message and send it to a device using [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python).

```python
import uuid
# Create a message and set message property 'To' to the devicebound link on device
msg_id = str(uuid.uuid4())
msg_content = b"Message content goes here!"
device_id = '<device-id>'
to = '/devices/{device_id}/messages/devicebound'.format(device_id=device_id)
ack = 'full' # Alternative values are 'positive', 'negative', and 'none'
app_props = { 'iothub-ack': ack }
msg_props = uamqp.message.MessageProperties(message_id=msg_id, to=to)
msg = uamqp.Message(msg_content, properties=msg_props, application_properties=app_props)

# Send the message using the send client created and connected IoT Hub earlier
send_client.queue_message(msg)
results = send_client.send_all_messages()

# Close the client if not needed
send_client.close()
```

To receive feedback, service client creates a receiver link. The code snippet below demonstrates how to do this using [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python).

```python
import json

operation = '/messages/serviceBound/feedback'

# ...
# Recreate the URI using the feedback path above and authenticate
uri = 'amqps://{}:{}@{}{}'.format(urllib.quote_plus(username), urllib.quote_plus(sas_token), hostname, operation)

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

As shown above, a C2D feedback message has content type of `application/vnd.microsoft.iothub.feedback.json` and properties in its JSON body can be used to infer the delivery status of the original message:
* Key `statusCode` in feedback body has either of these values: `['Success', 'Expired', 'DeliveryCountExceeded', 'Rejected', 'Purged']`.
* Key `deviceId` in feedback body has the ID of target device.
* Key `originalMessageId` in feedback body has the ID of the original C2D message sent by the service. This can be used to correlate feedback to C2D messages.

### Receive telemetry messages (service client)
By default, IoT Hub stores ingested device telemetry messages in a built-in Event hub. Your service client can use the AMQP protocol to receive the stored events.

For this purpose, the service client first needs to connect to the IoT Hub endpoint and receive a redirection address to the built-in Event Hubs. Service client then uses the provided address to connect to the built-in Event hub.

In each step, the client needs to present the following pieces of information:
* Valid service credentials (service SAS token).
* A well-formatted path to the consumer group partition it intends to retrieve messages from. For a given consumer group and partition ID, the path has the following format: `/messages/events/ConsumerGroups/<consumer_group>/Partitions/<partition_id>` (the default consumer group is `$Default`).
* An optional filtering predicate to designate a starting point in the partition (this can be in the form of a sequence number, offset or enqueued timestamp).

The code snippet below uses [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python) to demonstrate the above steps.

```python
import json
import uamqp
import urllib
import time

# Use generate_sas_token implementation available here: https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security#security-token-structure
from helper import generate_sas_token

iot_hub_name = '<iot-hub-name>'
hostname = '{iot_hub_name}.azure-devices.net'.format(iot_hub_name=iot_hub_name)
policy_name = 'service'
access_key = '<primary-or-secondary-key>'
operation = '/messages/events/ConsumerGroups/{consumer_group}/Partitions/{p_id}'.format(consumer_group='$Default', p_id=0)

username = '{policy_name}@sas.root.{iot_hub_name}'.format(policy_name=policy_name, iot_hub_name=iot_hub_name)
sas_token = generate_sas_token(hostname, access_key, policy_name)
uri = 'amqps://{}:{}@{}{}'.format(urllib.quote_plus(username), urllib.quote_plus(sas_token), hostname, operation)

# Optional filtering predicates can be specified using endpiont_filter
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

receive_client = uamqp.ReceiveClient(set_endpoint_filter(uri, endpoint_filter), debug=True)
try:
  batch = receive_client.receive_message_batch(max_batch_size=5)
except uamqp.errors.LinkRedirect as redirect:
  # Once a redirect error is received, close the original client and recreate a new one to the re-directed address
  receive_client.close()

  sas_auth = uamqp.authentication.SASTokenAuth.from_shared_access_key(redirect.address, policy_name, access_key)
  receive_client = uamqp.ReceiveClient(set_endpoint_filter(redirect.address, endpoint_filter), auth=sas_auth, debug=True)

# Start receiving messages in batches
batch = receive_client.receive_message_batch(max_batch_size=5)
for msg in batch:
  print('*** received a message ***')
  print(''.join(msg.get_data()))
  print('\t: ' + str(msg.annotations['x-opt-sequence-number']))
  print('\t: ' + str(msg.annotations['x-opt-offset']))
  print('\t: ' + str(msg.annotations['x-opt-enqueued-time']))
```

For a given device ID, IoT Hub uses a hash of the device ID to determine which partition to store its messages in. The code snippet above demonstrates receiving events from a single such partition. Note, however, that a typical application often needs to retrieve events stored in all event hub partitions.


## Device client

### Connection and authenticating to IoT Hub (device client)
To connect to IoT Hub using AMQP, a device can use the [Claims Based Security (CBS)](https://www.oasis-open.org/committees/download.php/60412/amqp-cbs-v1.0-wd03.doc) or [Simple Authentication and Security Layer (SASL) authentication](https://en.wikipedia.org/wiki/Simple_Authentication_and_Security_Layer).

The following information is required for the device client:

| Information | Value | 
|-------------|--------------|
| IoT Hub Hostname | `<iot-hub-name>.azure-devices.net` |
| Access key | Primary or secondary key associated with the device |
| Shared Access Signature | Short-lived SAS in the following format: `SharedAccessSignature sig={signature-string}&se={expiry}&sr={URL-encoded-resourceURI}` (the code to generate this signature can be found [here](./iot-hub-devguide-security.md#security-token-structure)).


The code snippet below uses [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python) to connect to IoT hub via a sender link.

```python
import uamqp
import urllib
import uuid

# Use generate_sas_token implementation available here: https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security#security-token-structure
from helper import generate_sas_token

iot_hub_name = '<iot-hub-name>'
hostname = '{iot_hub_name}.azure-devices.net'.format(iot_hub_name=iot_hub_name)
device_id = '<device-id>'
access_key = '<primary-or-secondary-key>'
username = '{device_id}@sas.{iot_hub_name}'.format(device_id=device_id, iot_hub_name=iot_hub_name)
sas_token = generate_sas_token('{hostname}/devices/{device_id}'.format(hostname=hostname, device_id=device_id), access_key, None)

operation = '<operation-link-name>' # e.g., '/devices/{device_id}/messages/devicebound'
uri = 'amqps://{}:{}@{}{}'.format(urllib.quote_plus(username), urllib.quote_plus(sas_token), hostname, operation)

receive_client = uamqp.ReceiveClient(uri, debug=True)
send_client = uamqp.SendClient(uri, debug=True)
```

The following link paths are supported as device operations:

| Created by | Link type | Link path | Description |
|------------|-----------|-----------|-------------|
| Devices | Receiver link | `/devices/<deviceID>/messages/devicebound` | C2D messages destined to devices are received on this link by each destination device. |
| Devices | Sender link | `/devices/<deviceID>messages/events` | D2C messages sent from a device are sent over this link. |
| Devices | Sender link | `/messages/serviceBound/feedback` | C2D message feedback sent to service over this link by devices. |


### Receive C2D commands (device client)
C2D commands sent to devices arrive on `/devices/<deviceID>/messages/devicebound` link. Devices can receive these messages in batches, and use the message data payload, message properties, annotations, or application properties in the message as needed.

The code snippet below uses [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python) to receive C2D messages by a device.

```python
# ... 
# Create a receive client for the C2D receive link on the device
operation = '/devices/{device_id}/messages/devicebound'.format(device_id=device_id)
uri = 'amqps://{}:{}@{}{}'.format(urllib.quote_plus(username), urllib.quote_plus(sas_token), hostname, operation)

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
    print('\tcorrelation_id:         ' + str(msg.properties.correlation_id))
    print('\tcontent_type:           ' + str(msg.properties.content_type))
    print('\treply_to_group_id:      ' + str(msg.properties.reply_to_group_id))
    print('\tsubject:                ' + str(msg.properties.subject))
    print('\tuser_id:                ' + str(msg.properties.user_id))
    print('\tgroup_sequence:         ' + str(msg.properties.group_sequence))
    print('\tcontent_encoding:       ' + str(msg.properties.content_encoding))
    print('\treply_to:               ' + str(msg.properties.reply_to))
    print('\tabsolute_expiry_time:   ' + str(msg.properties.absolute_expiry_time))
    print('\tgroup_id:               ' + str(msg.properties.group_id))

    # Message sequence number in the built-in Event hub
    print('\tx-opt-sequence-number:  ' + str(msg.annotations['x-opt-sequence-number']))
```

### Send telemetry messages (device client)
Telemetry messages also be sent over AMQP from devices. The device can optionally provide a dictionary of application properties, or various message properties such as message ID.

The code snippet below uses [uAMQP library in Python](https://github.com/Azure/azure-uamqp-python) to send D2C messages from a device.


```python
# ... 
# Create a send client for the D2C send link on the device
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
* The AMQP connections may be disrupted due to network glitch, or expiry of the authentication token (generated in the code). The service client must handle these circumstances and re-establish the connection and links if needed. For the case of authentication token expiry, the client can also proactively renew the token prior to its expiry to avoid a connection drop.
* In some cases, your client must be able to correctly handle link redirections. Refer to your AMQP client documentation on how to handle this operation.

## Next steps

To learn more about the AMQP protocol, see the [AMQP v1.0 specification](http://www.amqp.org/sites/amqp.org/files/amqp.pdf).

To learn more about IoT Hub messaging, see:

* [Cloud-to-device messages](./iot-hub-devguide-messages-c2d.md)
* [Support additional protocols](iot-hub-protocol-gateway.md)
* [Support for MQTT protocol](./iot-hub-mqtt-support.md)
