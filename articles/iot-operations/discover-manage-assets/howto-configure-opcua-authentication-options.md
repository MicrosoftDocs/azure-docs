---
title: Configure OPC UA user authentication options
description: How to configure connector for OPC UA user authentication options for it to use when it connects to an OPC UA server.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-opcua-connector
ms.topic: how-to
ms.custom: ignite-2023
ms.date: 09/16/2024

# CustomerIntent: As a user in IT, operations, or development, I want to configure my OPC UA industrial edge environment with custom OPC UA user authentication options to keep it secure and work with my solution.
---

# Configure OPC UA user authentication options for the connector for OPC UA

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to configure OPC UA user authentication options. These options provide more control over how the connector for OPC UA authenticates with OPC UA servers in your environment.

To learn more, see [OPC UA applications - user authentication](https://reference.opcfoundation.org/Core/Part2/v105/docs/5.2.3).

## Prerequisites

A deployed instance of Azure IoT Operations Preview. To deploy Azure IoT Operations for demonstration and exploration purposes, see [Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md).

## Features supported

| Feature  | Supported |
| -------- |:---------:|
| OPC UA user authentication with username and password.     |   ✅     |
| OPC UA user authentication with an X.509 user certificate. |   ❌     |

## Configure username and password authentication

First, configure the secrets for the username and password in Azure Operator Experience. 

Step 1: Navigate to the Asset EndPoint Profile from the left side menu 

![image](https://github.com/user-attachments/assets/0ef75d0f-f4c1-46bf-95e0-e6076a0b28df)

Step 2: Select Create asset endpoint 
![image](https://github.com/user-attachments/assets/59e0d03c-4db0-4e8d-9740-54843c9b4a40)


Step 3: Under User authentication mode select username and password 

Step 4: Insert the usernama and password reference from AKV and click on Create

Step 5: In case you don't have the reference, click on Select. You will see a list of available AKV references and you can select one.
![image](https://github.com/user-attachments/assets/468dc6aa-db55-48ee-880b-5746f04cff28)


Alternatively, you can create a new reference 
![image](https://github.com/user-attachments/assets/fb4534ad-d5d4-4424-92de-0e499b8cd764)

Step 6: Click Apply 

