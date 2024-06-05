---
author: clemensv
ms.service: service-bus-relay
ms.topic: include
ms.date: 05/16/2024
ms.author: samurp
---

### Create a Python Script

If you disabled the "Requires Client Authorization" option when creating the Relay,
you can send requests to the Hybrid Connections URL with any browser. For accessing
protected endpoints, you need to create and pass a SAS Token, which is shown here.

Here's a simple Python script that demonstrates sending requests to 
a Hybrid Connections URL with SAS Tokens utilizing WebSockets. 

### Dependencies

1. Install the following Python libraries using pip before running the server application

	`asyncio`, `json`, `logging`, `websockets`

	These libraries can be installed using the following command:

	```bash
	pip install <package name>
	```
2. Generate a `config.json` file to store your connection details

    ```json
	{
    "namespace": "HYBRID_CONNECTION_NAMESPACE",
    "path": "HYBRID_CONNECTION_ENTITY_NAME",
    "keyrule": "SHARED_ACCESS_KEY_NAME",
    "key": "SHARED_ACCESS_PRIMARY_KEY"
	}
	```
	Replace the placeholders in brackets with the values you obtained when you created the hybrid connection.

	- `namespace` - The Relay namespace. Be sure to use the fully qualified namespace name; for example, `{namespace}.servicebus.windows.net`.
	- `path` - The name of the hybrid connection.
	- `keyrule` - Name of your Shared Access Policies key, which is `RootManageSharedAccessKey` by default.
	- `key` -   The primary key of the namespace you saved earlier.

3. Generate a helper function file for helper functions

	The following file is used as `relaylib.py` and have helper functions for WebSocket URL generation and SAS tokens

    [!INCLUDE [relay-python-helper-functions](relay-python-helper-functions.md)]

### Write some code to send messages

1. Ensure your dependency `config.json` and `relaylib.py` are available in your path 


2. Here's what your `listener.py` file should look like:

    ```python
	import asyncio
	import json
	import logging
	import relaylib
	import websockets

	async def run_application(config):
	    serviceNamespace = config["namespace"]
	    entityPath = config["path"]
	    sasKeyName = config["keyrule"]
	    sasKey = config["key"]
	    serviceNamespace += ".servicebus.windows.net"
	    # Configure logging
	    logging.basicConfig(level=logging.INFO)  # Enable DEBUG/INFO logging as appropriate

	    try:
	        logging.debug("Generating SAS Token for: %s", serviceNamespace)
		token = relaylib.createSasToken(serviceNamespace, entityPath, sasKeyName, sasKey)
		logging.debug("Generating WebSocket URI")
		wssUri = relaylib.createListenUrl(serviceNamespace, entityPath, token)
		async with websockets.connect(wssUri) as websocket:
		    logging.info("Listening for messages on Azure Relay WebSocket...")
		    while True:
			message = await websocket.recv()
			logging.info("Received message: %s", message)
		    except KeyboardInterrupt:
			logging.info("Exiting listener.")

	if __name__ == "__main__":
	    # Load configuration from JSON file
	    with open("config.json") as config_file:
            config = json.load(config_file)

	    asyncio.run(run_application(config))
    ```
