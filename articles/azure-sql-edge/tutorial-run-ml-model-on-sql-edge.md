---
title: Deploy ML model on Azure SQL Edge using ONNX
description: In part three of this three-part Azure SQL Edge tutorial for predicting iron ore impurities, you'll run the ONNX machine learning models on SQL Edge.
author: kendalvandyke
ms.author: kendalv
ms.reviewer: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: tutorial
---
# Deploy ML model on Azure SQL Edge using ONNX

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

In part three of this three-part tutorial for predicting iron ore impurities in Azure SQL Edge, you'll:

1. Use Azure Data Studio to connect to SQL Database in the Azure SQL Edge instance.
1. Predict iron ore impurities with ONNX in Azure SQL Edge.

## Key components

1. The solution uses a default 500 milliseconds between each message sent to the Edge Hub. This can be changed in the **Program.cs** file

   ```csharp
   TimeSpan messageDelay = configuration.GetValue("MessageDelay", TimeSpan.FromMilliseconds(500));
   ```

1. The solution generated a message, with the following attributes. Add or remove the attributes as per requirements.

   ```json
   {
       timestamp
       cur_Iron_Feed
       cur_Silica_Feed
       cur_Starch_Flow
       cur_Amina_Flow
       cur_Ore_Pulp_pH
       cur_Flotation_Column_01_Air_Flow
       cur_Flotation_Column_02_Air_Flow
       cur_Flotation_Column_03_Air_Flow
       cur_Flotation_Column_04_Air_Flow
       cur_Flotation_Column_01_Level
       cur_Flotation_Column_02_Level
       cur_Flotation_Column_03_Level
       cur_Flotation_Column_04_Level
       cur_Iron_Concentrate
   }
   ```

## Connect to the SQL Database in the Azure SQL Edge instance to train, deploy, and test the ML model

1. Open Azure Data Studio.

1. In the **Welcome** tab, start a new connection with the following details:

   | Field | Value |
   | --- | --- |
   | Connection type | Microsoft SQL Server |
   | Server | Public IP address mentioned in the VM that was created for this demo |
   | Username | sa |
   | Password | The strong password that was used while creating the Azure SQL Edge instance |
   | Database | Default |
   | Server group | Default |
   | Name (optional) | Provide an optional name |

1. Select **Connect**.

1. In the **File** section, open `/DeploymentScripts/MiningProcess_ONNX.jpynb` from the folder in which you cloned the project files on your machine.

1. Set the kernel to Python 3.

## Next steps

- For more information on using ONNX models in Azure SQL Edge, see [Machine learning and AI with ONNX in SQL Edge](onnx-overview.md).
