---
title: Test locally by using the Azure Service Bus emulator
description: This article describes how to develop and test locally by using the Azure Service Bus emulator.
ms.topic: how-to
ms.author: Saglodha
ms.date: 10/27/2025
---

# Test locally by using the Azure Service Bus emulator

This article summarizes the steps to develop and test locally by using the Azure Service Bus emulator. 

The emulator runs as a Docker container on your local machine, providing a local Service Bus environment for development and testing. You can set up the emulator by using either an automated script (for quick setup) or by manually configuring Docker containers (for more control).

Azure Service Bus emulator is available via the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/en-us/artifact/mar/azure-messaging/servicebus-emulator/about). 

> [!NOTE]
> The Service bus emulator is available under the [Microsoft Software License Terms](https://github.com/Azure/azure-service-bus-emulator-installer/blob/main/EMULATOR_EULA.txt).
> 
> Service Bus emulator isn't compatible with the community owned [open source Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer)

## Prerequisites

- Minimum hardware requirements:
  - 2 GB of RAM
  - 5 GB of disk space
- [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/#:~:text=Install%20Docker%20Desktop%20on%20Windows%201%20Download%20the,on%20your%20choice%20of%20backend.%20...%20More%20items) needs to be installed and running in the background.
    > [!NOTE]
    > Even the automated script approach uses Docker containers behind the scenes to run the Service Bus emulator.
- Windows Subsystem for Linux (WSL) configuration (only for Windows):
  - [Install WSL](/windows/wsl/install)
  - [Configure Docker to use WSL](https://docs.docker.com/desktop/wsl/#:~:text=Turn%20on%20Docker%20Desktop%20WSL%202%201%20Download,engine%20..%20...%206%20Select%20Apply%20%26%20Restart)


## Run the emulator

To run the Service Bus emulator, you can use an automated script or manually configure Docker containers. Both approaches result in the same containerized emulator running locally:

- **Automated script**: Uses prebuilt scripts to automatically set up and run the emulator containers with default configuration
- **Docker container**: Provides full control by letting you manually configure the emulator through Docker Compose files

Choose the approach that best fits your needs:

### [Automated script](#tab/automated-script)

Before you run the automated script, you need to clone the [Azure/azure-service-bus-emulator-installer](https://github.com/Azure/azure-service-bus-emulator-installer) repository locally.

### Windows

Use the following steps to run the Service Bus emulator locally on Windows:

1. **Open PowerShell** and navigate to the directory where you cloned the [common](https://github.com/Azure/azure-service-bus-emulator-installer/tree/main/ServiceBus-Emulator/Scripts/Common) scripts folder by using `cd`:
   ```powershell
   cd <path to your common scripts folder> # Update this path
      
2. Issue wsl command to open WSL at this directory.
   ```powershell
   wsl

3. **Run the setup script** *./LaunchEmulator.sh*.Running the script brings up two containers: the Service Bus emulator and SQL Server Linux (a dependency for the emulator).
   ```bash
   ./Launchemulator.sh 

### Linux and macOS

To run the Service Bus emulator locally on Linux or macOS:

- Run the setup script [LaunchEmulator.sh](https://github.com/Azure/azure-service-bus-emulator-installer/tree/main/ServiceBus-Emulator/Scripts/). Running the script brings up two containers: the Service Bus emulator and SQL Server Linux (a dependency for the emulator).

### [Docker (Linux container)](#tab/docker-linux-container)

When you use Docker, the service bus emulator is fetched from the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/en-us/artifact/mar/azure-messaging/servicebus-emulator/about). Use the following steps to manually set up and run the Service Bus emulator by using Docker Compose:

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
                  "MaxDeliveryCount": 3,
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
                      "MaxDeliveryCount": 3,
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
                      "MaxDeliveryCount": 3,
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
                              "prop1": "value1"
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
                      "MaxDeliveryCount": 3,
                      "ForwardDeadLetteredMessagesTo": "",
                      "ForwardTo": "",
                      "RequiresSession": false
                    }
                  },
                  {
                    "Name": "subscription.4",
                    "Properties": {
                      "DeadLetteringOnMessageExpiration": false,
                      "DefaultMessageTimeToLive": "PT1H",
                      "LockDuration": "PT1M",
                      "MaxDeliveryCount": 3,
                      "ForwardDeadLetteredMessagesTo": "",
                      "ForwardTo": "",
                      "RequiresSession": false
                    },
                    "Rules": [
                      {
                        "Name": "sql-filter-1",
                        "Properties": {
                          "FilterType": "Sql",
                          "SqlFilter": {
                            "SqlExpression": "sys.MessageId = '123456' AND userProp1 = 'value1'"
                          },
                          "Action" : {
                            "SqlExpression": "SET sys.To = 'Entity'"
                          }
                        }
                      }
                    ]
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

2.To spin up containers for Azure Service Bus emulator, save the following .yaml file as _docker-compose.yaml_

  > [!NOTE]
  > Azure Service Bus emulator uses the port 5672 by default. If you customized the configuration to use a different port, update the `ports` setting in the YAML file.

  ```
  name: microsoft-azure-servicebus-emulator
  services:
    emulator:
      container_name: "servicebus-emulator"
      image: mcr.microsoft.com/azure-messaging/servicebus-emulator:latest
      pull_policy: always
      volumes:
        - "${CONFIG_PATH}:/ServiceBus_Emulator/ConfigFiles/Config.json"
      ports:
        - "5672:5672"
        - "5300:${EMULATOR_HTTP_PORT:-5300}"
      environment:
        SQL_SERVER: mssql
        MSSQL_SA_PASSWORD: "${MSSQL_SA_PASSWORD}"  # Password should be same as what is set for SQL Server Linux 
        ACCEPT_EULA: ${ACCEPT_EULA}
        EMULATOR_HTTP_PORT: ${EMULATOR_HTTP_PORT:-5300}
        SQL_WAIT_INTERVAL: ${SQL_WAIT_INTERVAL} # Optional: Time in seconds to wait for SQL to be ready (default is 15 seconds)
      depends_on:
        - mssql
      networks:
        sb-emulator:
          aliases:
            - "sb-emulator"
    mssql:
          container_name: "mssql"
          image: "mcr.microsoft.com/mssql/server:2022-latest"
          networks:
            sb-emulator:
              aliases:
                - "mssql"
          environment:
            ACCEPT_EULA: ${ACCEPT_EULA}
            MSSQL_SA_PASSWORD: "${MSSQL_SA_PASSWORD}" # To be filled by user as per policy : https://learn.microsoft.com/en-us/sql/relational-databases/security/strong-passwords?view=sql-server-linux-ver16 
  
  networks:
    sb-emulator:
  ```

3. Create a `.env` file to declare the environment variables for Service Bus emulator and ensure all of the following environment variables are set.

    ```
    # Environment file for user-defined variables in docker-compose.yml
    
    # 1. CONFIG_PATH: Path to Config.json file
    # Ex: CONFIG_PATH="C:\\Config\\Config.json"
    CONFIG_PATH="<Replace with path to Config.json file>"
    
    # 2. ACCEPT_EULA: Pass 'Y' to accept license terms for SQL Server Linux and Service Bus emulator.
    # Service Bus emulator EULA : https://github.com/Azure/azure-service-bus-emulator-installer/blob/main/EMULATOR_EULA.txt
    # SQL Server Linux EULA : https://go.microsoft.com/fwlink/?LinkId=746388
    ACCEPT_EULA="N"
    
    # 3. MSSQL_SA_PASSWORD to be filled by user as per policy
    MSSQL_SA_PASSWORD=""

    # 4. Port on which emulator will expose Management & Health-check APIs
    EMULATOR_HTTP_PORT=5300
    ```
    
    > [!IMPORTANT]
    > 
    > - When you pass the value "Y" to the environment variable `ACCEPT_EULA`, you're acknowledging and accepting the terms and conditions of the End User License Agreement (EULA) for both [Azure Service Bus emulator](https://github.com/Azure/azure-service-bus-emulator-installer/blob/main/EMULATOR_EULA.txt) and [SQL Server Linux](/sql/linux/sql-server-linux-docker-container-deployment).
    >
    >  - Make sure to place the `.env` file in same directory as the `docker-compose.yaml` file.
    >
    >   - Set the MSSQL_SA_PASSWORD environment variable to a strong password of at least eight characters that meets the [password requirements](/sql/relational-databases/security/password-policy).
    >   -  When you specify file paths in Windows, use double backslashes (`\\`) instead of single backslashes (`\`) to avoid issues with escape characters.


4. To run the emulator, execute following command:

    ```
    docker compose -f <PathToDockerComposeFile> up -d
    ```

After the steps are successful, you can find the containers running in Docker.

:::image type="content" source="./media/test-locally-with-service-bus-emulator/test-locally-with-service-bus-emulator.png" alt-text="Screenshot that shows the Service Bus emulator running in a container.":::

---

## Verify emulator is running

Regardless of which setup method you chose, the result is the same: the Service Bus emulator running in Docker containers on your local machine. The emulator consists of two containers:

- **Service Bus emulator container**: The main emulator service that provides Service Bus functionality
- **SQL Server Linux container**: A dependency that provides the backend storage for the emulator

You can verify the containers are running by checking Docker Desktop or using the command `docker ps` in a terminal.

## Interact with the emulator

You can create and manage Service Bus entities—such as queues and topics—using the Service Bus [Administration Client](service-bus-management-libraries.md). By default, emulator uses [config.json](https://github.com/Azure/azure-service-bus-emulator-installer/blob/main/ServiceBus-Emulator/Config/Config.json) configuration file. You can also configure entities by making declarative changes to configuration file. To know more, visit [create and manage entities within Service Bus emulator](overview-emulator.md#create-and-manage-entities-within-service-bus-emulator) 

### Choosing the right connection string

The Service Bus emulator uses a static connection string, but the host value varies depending on how your application is deployed relative to the emulator. Use the appropriate connection string for your setup:

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

> [!IMPORTANT]
> By default, management operations using the Service Bus Administration Client require appending the **port number** to the emulator connection string. For example, when both the emulator and the application are running on the same machine, use the following connection string for administration operations:
>  ```
> "Endpoint=sb://localhost:5300;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;";
>  ```
> For management operations, the emulator uses port 5300 by default. You can configure the emulator to use a different port if required. Refer to know [more](https://github.com/Azure/azure-service-bus-emulator-installer?tab=readme-ov-file#interacting-with-the-emulator).
> 
> For the Service Bus Emulator, creating and managing entities via the Service Bus Administration client is natively supported only in .NET.
>
> 
You can use the latest client SDKs to interact with the Service Bus emulator across various programming languages. To get started, refer to the [Service Bus emulator samples on GitHub](https://github.com/Azure/azure-service-bus-emulator-installer/tree/main/Sample-Code-Snippets/NET/ServiceBus.Emulator.Console.Sample).

## Related content

[Overview of the Azure Service Bus emulator](overview-emulator.md)

