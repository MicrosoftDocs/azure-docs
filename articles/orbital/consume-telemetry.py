# Event Hubs using Python Getting Started: https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-python-get-started-send
# Azure Event Hubs client library for Python code samples: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/eventhub/azure-eventhub/samples/async_samples

import asyncio
from azure.eventhub.aio import EventHubConsumerClient
from azure.eventhub.extensions.checkpointstoreblobaio import BlobCheckpointStore

# Connection string to the Storage Account containing the blob container
AZURE_STORAGE_CONN_STR = ""

# Name of the blob container used to managing checkpoints
# https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-features#checkpointing
BLOB_CONTAINER_NAME = ""

# The connection string associated with a SAS Policy defined at the namespace level of the Event Hub
# The associated SAS policy must have a Listen claim, at minimum.
EVENT_HUB_NAMESPACE_CONN_STRING = ""

# A view of the entire Event Hub. This is used to enable multiple consuming applications to each have a separate view of the event stream.
# https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-features#consumer-groups
CONSUMER_GROUP = "$Default"

# The name of the event hub instance within the namespace
EVENT_HUB_NAME = ""

# A helper method to convert event metadata from a dictionary of bytes to a dictionary of strings.
async def process_metadata(eventProperties):
    metadata = {}

    # Event properties attached to every event to assist in filtering and processing of messages
    contact_id = "ContactId" # GUID of contact
    end_of_telemetry = "EndOfTelemetry" # Bool value indicating whether this is the final telemetry event for this contact

    # Convert event meteadata key values from string to bytes 
    contactId_key = contact_id.encode('utf-8')
    endOfTelemetry_key = end_of_telemetry.encode('utf-8')

    metadata[contact_id] = eventProperties[contactId_key].decode('utf-8')
    metadata[end_of_telemetry] = eventProperties[endOfTelemetry_key]

    return metadata

async def on_event(partition_context, event):
    telemetryEvent = event.body_as_json()
    eventMetadata = event.properties

    print("Event metadata: {} \n".format(eventMetadata))
    print("Event body: {} \n".format(telemetryEvent))
    print("-------\n")

    eventMetadata = await process_metadata(event.properties)
    print("Final event for contact {}: {} \n".format(eventMetadata["ContactId"], eventMetadata["EndOfTelemetry"]))

    print("At {} UTC, contact {} reported {} azimuth degrees and {} elevation degrees \n"
        .format(telemetryEvent["utcTime"], telemetryEvent["contactPlatformIdentifier"], telemetryEvent["azimuthDecimalDegrees"], telemetryEvent["elevationDecimalDegrees"]))

    if eventMetadata["EndOfTelemetry"]:
        print("Telemetry for contact {} has concluded.".format(eventMetadata["ContactId"]))

    # Update the checkpoint so that the program doesn't read the events
    # that it has already read when you run it next time.
    await partition_context.update_checkpoint(event)

async def main():
    # Create an Azure blob checkpoint store to store the checkpoints.
    checkpoint_store = BlobCheckpointStore.from_connection_string(AZURE_STORAGE_CONN_STR, BLOB_CONTAINER_NAME)

    # Create a consumer client for the event hub.
    client = EventHubConsumerClient.from_connection_string(EVENT_HUB_NAMESPACE_CONN_STRING, consumer_group=CONSUMER_GROUP, eventhub_name=EVENT_HUB_NAME, checkpoint_store=checkpoint_store)
    async with client:
        # Call the receive method. Read from the beginning of the partition (starting_position: "-1")
        await client.receive(on_event=on_event,  starting_position="-1")

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    # Run the main method.
    loop.run_until_complete(main())