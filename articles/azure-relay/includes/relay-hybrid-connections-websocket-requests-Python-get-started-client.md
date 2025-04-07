---
author: clemensv
ms.service: azure-relay
ms.topic: include
ms.date: 05/16/2024
ms.author: samurp
---

### Write some code to send messages

1. Ensure your dependency `config.json` and `relaylib.py` are available in your path 
2. Here's what your `sender.py` file should look like:

    ```python
    import asyncio
    import json
    import logging
    import relaylib
    import websockets

    async def run_application(message, config):
        service_namespace = config["namespace"]
        entity_path = config["path"]
        sas_key_name = config["keyrule"]
        sas_key = config["key"]
        service_namespace += ".servicebus.windows.net"

        # Configure logging
        logging.basicConfig(level=logging.DEBUG)  # Enable debug logging

        token = relaylib.createSasToken(service_namespace, entity_path, sas_key_name, sas_key)
        logging.debug("Token: %s", token)
        wss_uri = relaylib.createSendUrl(service_namespace, entity_path, token)
        logging.debug("WssURI: %s", wss_uri)

        try:
            async with websockets.connect(wss_uri) as websocket:
                logging.info("Sending message to Azure Relay WebSocket...")
                await websocket.send(json.dumps({"message": message}))
                logging.info("Message sent: %s", message)
        except Exception as e:
            logging.error("An error occurred: %s", str(e))

    if __name__ == "__main__":
        # Load configuration from JSON file
        with open("config.json") as config_file:
            config = json.load(config_file)

        asyncio.run(run_application("This is a message to Azure Relay Hybrid Connections!", config))
    ```

> [!NOTE]
> The sample code in this article uses a connection string to authenticate to an Azure Relay namespace to keep the tutorial simple. We recommend that you use Microsoft Entra ID authentication in production environments, rather than using connection strings or shared access signatures, which can be more easily compromised. For detailed information and sample code for using the Microsoft Entra ID authentication, see [Authenticate and authorize an application with Microsoft Entra ID to access Azure Relay entities](../authenticate-application.md) and [Authenticate a managed identity with Microsoft Entra ID to access Azure Relay resources](../authenticate-managed-identity.md).
