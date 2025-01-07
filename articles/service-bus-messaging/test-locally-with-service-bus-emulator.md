---
title: Test locally by using the Azure Service Bus emulator
description: This article describes how to develop and test locally by using the Service Bus emulator.
ms.topic: how-to
ms.author: Saglodha
ms.date: 11/18/2024
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

2.To spin up containers for Service Bus emulator, save the following .yaml file as _docker-compose.yaml_

```
name: microsoft-azure-servicebus-emulator
services:
  emulator:
    container_name: "servicebus-emulator"
    image: mcr.microsoft.com/azure-messaging/servicebus-emulator:latest
    volumes:
      - "${CONFIG_PATH}:/ServiceBus_Emulator/ConfigFiles/Config.json"
    ports:
      - "5672:5672"
    environment:
      SQL_SERVER: sqledge  
      MSSQL_SA_PASSWORD: ${MSSQL_SA_PASSWORD}
      ACCEPT_EULA: ${ACCEPT_EULA}
    depends_on:
      - sqledge
    networks:
      sb-emulator:
        aliases:
          - "sb-emulator"
  sqledge:
        container_name: "sqledge"
        image: "mcr.microsoft.com/azure-sql-edge:latest"
        networks:
          sb-emulator:
            aliases:
              - "sqledge"
        environment:
          ACCEPT_EULA: ${ACCEPT_EULA}
          MSSQL_SA_PASSWORD: ${MSSQL_SA_PASSWORD}
networks:
  sb-emulator:
```

3. Create .env file to declare the environment variables for Service Bus emulator and ensure all of the following environment variables are set.

```
# Environment file for user defined variables in docker-compose.yml

# 1. CONFIG_PATH: Path to Config.json file
# Ex: CONFIG_PATH="C:\\Config\\Config.json"
CONFIG_PATH="<Replace with path to Config.json file>"

# 2. ACCEPT_EULA: Pass 'Y' to accept license terms for Azure SQL Edge and Azure Service Bus emulator.
# Service Bus emulator EULA : https://github.com/Azure/azure-service-bus-emulator-installer/blob/main/EMULATOR_EULA.txt
# SQL Edge EULA : https://go.microsoft.com/fwlink/?linkid=2139274
ACCEPT_EULA="N"

# 3. MSSQL_SA_PASSWORD to be filled by user as per policy : https://learn.microsoft.com/sql/relational-databases/security/strong-passwords?view=sql-server-linux-ver16 
MSSQL_SA_PASSWORD=""
```

> [!IMPORTANT]
> 
> - By passing the value "Y" to the environment variable "ACCEPT_EULA", you are acknowledging and accepting the terms and conditions of the End User License Agreement (EULA) for both [Azure Service Bus emulator](https://github.com/Azure/azure-service-bus-emulator-installer/blob/main/EMULATOR_EULA.txt) and [Azure SQL Edge](https://go.microsoft.com/fwlink/?linkid=2139274).
> 
>  - Ensure to place .env file in same directory to docker-compose.yaml file.
>
>   - Set the MSSQL_SA_PASSWORD environment variable to a strong password of at least eight characters that meets the [password requirements](/sql/relational-databases/security/password-policy).
>   -  When specifying file paths in Windows, use double backslashes (`\\`) instead of single backslashes (`\`) to avoid issues with escape characters.


4. To run the emulator, execute following command:

```

    docker compose -f <PathToDockerComposeFile> up -d

```

---

After the steps are successful, you can find the containers running in Docker.

:::image type="content" source="./media/test-locally-with-service-bus-emulator/test-locally-with-service-bus-emulator.png" alt-text="Screenshot that shows the Service Bus emulator running in a container.":::

## Interact with the emulator

By default, emulator uses [config.json](https://github.com/Azure/azure-service-bus-emulator-installer/blob/main/ServiceBus-Emulator/Config/Config.json) configuration file. You can configure entities by making changes to configuration file. To know more, visit [make configuration changes](overview-emulator.md#quota-configuration-changes)

You can use the following connection string to connect to the Service Bus emulator:

 - When the emulator container and interacting application are running natively on local machine, use following connection string:
```
"Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
```
  - Applications (Containerized/Non-containerized) on the different machine and same local network can interact with Emulator using the IPv4 address of the machine. Use following connection string:
```
"Endpoint=sb://192.168.y.z;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
```
  - Application containers on the same bridge network can interact with Emulator using its alias or IP. Following connection string assumes the name of Emulator container is "servicebus-emulator":
```
"Endpoint=sb://servicebus-emulator;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
```
  - Application containers on the different bridge network can interact with Emulator using the "host.docker.internal" as host. Use following connection string:
```
"Endpoint=sb://host.docker.internal;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"
```

You can use the latest client SDKs to interact with the Service Bus emulator across various programming languages. To get started, refer to the [Service Bus emulator samples on GitHub](https://github.com/Azure/azure-service-bus-emulator-installer/tree/main/Sample-Code-Snippets/NET/ServiceBus.Emulator.Console.Sample).

## Related content

[Overview of the Azure Service Bus emulator](overview-emulator.md)

