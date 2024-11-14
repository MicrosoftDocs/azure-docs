---
title: Test locally by using the Azure Service Bus emulator
description: This article describes how to develop and test locally by using the Service Bus emulator.
ms.topic: how-to
ms.author: Saglodha
ms.date: 05/05/2024
---

# Test locally by using the Azure Service Bus emulator

This article summarizes the steps to develop and test locally by using the Azure Service Bus emulator.

## Prerequisites

- [Docker desktop](https://docs.docker.com/desktop/install/windows-install/#:~:text=Install%20Docker%20Desktop%20on%20Windows%201%20Download%20the,on%20your%20choice%20of%20backend.%20...%20More%20items)
- Minimum hardware requirements:
  - 2 GB of RAM
  - 5 GB of disk space
- Windows Subsystem for Linux (WSL) configuration (only for Windows):
  - [Install WSL](/windows/wsl/install)
  - [Configure Docker to use WSL](https://docs.docker.com/desktop/wsl/#:~:text=Turn%20on%20Docker%20Desktop%20WSL%202%201%20Download,engine%20..%20...%206%20Select%20Apply%20%26%20Restart)

> [!NOTE]
> Before you continue with the steps in this article, make sure Docker Desktop is operational in the background.

## Run the emulator

To run the Service Bus emulator, you can use an automated script or a Linux container:

### [Automated script](#tab/automated-script)

Before you run an automated script, clone the emulator's [GitHub installer repository](https://github.com/Azure/azure-service-bus-emulator-installer) locally.

### Windows

Use the following steps to run the Service Bus emulator locally on Windows:

1. Allow the execution of unsigned scripts by running this command in the PowerShell window:

   `$>Start-Process powershell -Verb RunAs -ArgumentList 'Set-ExecutionPolicy Bypass –Scope CurrentUser'`

1. Run the setup script _LaunchEmulator.ps1_. Running the script brings up two containers: the Service Bus emulator and Sql Edge (a dependency for the emulator).

### Linux and macOS

To run the Service Bus emulator locally on Linux or macOS:

- Run the setup script _LaunchEmulator.sh_. Running the script brings up two containers: the Service Bus emulator and Sql Edge (a dependency for the emulator).

### [Docker (Linux container)](#tab/docker-linux-container)

1. To start the emulator, supply a configuration for the entities that you want to use. Save the following JSON file locally as _config.json_:

   ```JSON
   {
   "UserConfig": {
    "Namespaces": [
      {
        "Name": "sbemulatorns",
        "Queues": [
          {
            "Name": "queue.1",
            "Properties": {
              "DeadLetteringOnMessageExpiration": false,
              "DefaultMessageTimeToLive": "PT1H",
              "DuplicateDetectionHistoryTimeWindow": "PT20S",
              "ForwardDeadLetteredMessagesTo": "",
              "ForwardTo": "",
              "LockDuration": "PT1M",
              "MaxDeliveryCount": 10,
              "RequiresDuplicateDetection": false,
              "RequiresSession": false
            }
          }
        ],

        "Topics": [
          {
            "Name": "topic.1",
            "Properties": {
              "DefaultMessageTimeToLive": "PT1H",
              "DuplicateDetectionHistoryTimeWindow": "PT20S",
              "RequiresDuplicateDetection": false
            },
            "Subscriptions": [
              {
                "Name": "subscription.1",
                "Properties": {
                  "DeadLetteringOnMessageExpiration": false,
                  "DefaultMessageTimeToLive": "PT1H",
                  "LockDuration": "PT1M",
                  "MaxDeliveryCount": 10,
                  "ForwardDeadLetteredMessagesTo": "",
                  "ForwardTo": "",
                  "RequiresSession": false
                },
                "Rules": [
                  {
                    "Name": "app-prop-filter-1",
                    "Properties": {
                      "FilterType": "Correlation",
                      "CorrelationFilter": {
                        "ContentType": "application/text",
                        "CorrelationId": "id1",
                        "Label": "subject1",
                        "MessageId": "msgid1",
                        "ReplyTo": "someQueue",
                        "ReplyToSessionId": "sessionId",
                        "SessionId": "session1",
                        "To": "xyz"
                      }
                    }
                  }
                ]
              },
              {
                "Name": "subscription.2",
                "Properties": {
                  "DeadLetteringOnMessageExpiration": false,
                  "DefaultMessageTimeToLive": "PT1H",
                  "LockDuration": "PT1M",
                  "MaxDeliveryCount": 10,
                  "ForwardDeadLetteredMessagesTo": "",
                  "ForwardTo": "",
                  "RequiresSession": false
                },
                "Rules": [
                  {
                    "Name": "user-prop-filter-1",
                    "Properties": {
                      "FilterType": "Correlation",
                      "CorrelationFilter": {
                        "Properties": {
                          "prop3": "value3"
                        }
                      }
                    }
                  }
                ]
              },
              {
                "Name": "subscription.3",
                "Properties": {
                  "DeadLetteringOnMessageExpiration": false,
                  "DefaultMessageTimeToLive": "PT1H",
                  "LockDuration": "PT1M",
                  "MaxDeliveryCount": 10,
                  "ForwardDeadLetteredMessagesTo": "",
                  "ForwardTo": "",
                  "RequiresSession": false
                }
              }
            ]
          }
        ]
      }
    ],
    "Logging": {
      "Type": "File"
    }
   }
   }

   ```

2. Save the following .yaml file as _docker-compose.yaml_ to spin up containers for the Service Bus emulator:

```
name: microsoft-azure-messaging-servicebus-emulator
services:
  emulator:
    image: mcr.microsoft.com/azure-messaging/servicebus-emulator:latest
    volumes:
      - "./Config.json:/ServiceBus_Emulator/ConfigFiles/Config.json"
    ports:
      - "55672:55672"
    environment:
      # SQL_SERVER: sqledge 
      SQL_SERVER: sqledge:1533  #Mounting SQL Edge on a custom port as Dev might have SQLExpress Windows Service Running
      MSSQL_SA_PASSWORD: ""  # Password should be same as what is set for SQL Edge  
      ACCEPT_EULA: "Y"
    depends_on:
      - sqledge
    networks:
      sb-emulator:
        aliases:
          - "sb-emulator"
  sqledge:
        container_name: "sqledge"
        image: "mcr.microsoft.com/azure-sql-edge:latest"
        ports:
          # - "1433:1433"
          - "1533:1433"  #Mounting SQL Edge on a custom port as Dev might have SQLExpress Windows Service Running
        networks:
          sb-emulator:
            aliases:
              - "sqledge"
        environment:
          ACCEPT_EULA: "Y"
          MSSQL_SA_PASSWORD: "" # To be filled by user as per policy : https://learn.microsoft.com/en-us/sql/relational-databases/security/strong-passwords?view=sql-server-linux-ver16 

networks:
  sb-emulator:
```
 
3. Create an .env file to declare the environment variables for the Service Bus emulator:

```

# Centralized environment variables store for docker-compose

# 1. CONFIG_PATH: Path to config.json file

CONFIG_PATH="<Replace with path to config.json file>"

# 2. ACCEPT_EULA: Pass 'Y' to accept license terms.

ACCEPT_EULA="N"

```
> [!IMPORTANT]
> By passing the value "Y" to the environment variable "ACCEPT_EULA", you are acknowledging and accepting the terms and conditions of the End User License Agreement (EULA) for both Service bus emulator and SQL edge. For more details, refer 
> Set the MSSQL_SA_PASSWORD environment variable to a strong password of at least eight characters that meets the [password requirements](https://learn.microsoft.com/en-us/sql/relational-databases/security/password-policy?view=sql-server-ver16).

Be sure to place the .env file in the same directory as the *docker-compose.yaml* file.

> [!TIP]
> When you're specifying file paths in Windows, use double backslashes (`\\`) instead of single backslashes (`\`) to avoid confusion with escape characters.

1. Run the following command to run the emulator:

```

    docker compose -f <PathToDockerComposeFile> up -d

```

---

After the steps are successful, you can find the containers running in Docker.

:::image type="content" source="./media/test-locally-with-event-hub-emulator/test-locally-with-event-hub-emulator.png" alt-text="Screenshot that shows the Service Bus emulator running in a container.":::

## Interact with the emulator

You can use the following connection string to connect to the Service Bus emulator:

```

"Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"

```

With the latest client SDK releases, you can interact with the emulator in various programming languages. For details, see
[Client SDKs](./sdks.md).

To get started, refer to the [Service Bus emulator samples on GitHub](https://github.com/Azure/azure-event-hubs-emulator-installer/tree/main/Sample-Code-Snippets/dotnet/EventHubs-Emulator-Demo/EventHubs-Emulator-Demo).

## Related content

[Overview of the Azure Service Bus emulator](overview-emulator.md)

