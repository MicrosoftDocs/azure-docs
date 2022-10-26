---
title: Deploy ML model on Azure SQL Edge using ONNX
description: In part three of this three-part Azure SQL Edge tutorial for predicting iron ore impurities, you'll run the ONNX machine learning models on SQL Edge.
author: kendalvandyke
ms.author: kendalv
ms.reviewer: randolphwest
ms.date: 05/19/2020
ms.service: sql-edge
ms.topic: tutorial
services: sql-edge
---

# Deploy ML model on Azure SQL Edge using ONNX 

In part three of this three-part tutorial for predicting iron ore impurities in Azure SQL Edge, you'll:

1. Use Azure Data Studio to connect to SQL Database in the Azure SQL Edge instance.
2. Predict iron ore impurities with ONNX in Azure SQL Edge.

## Key Components

1. The solution uses a default 500 milliseconds between each message sent to the Edge Hub. This can be changed in the **Program.cs** file 
   ```json
   TimeSpan messageDelay = configuration.GetValue("MessageDelay", TimeSpan.FromMilliseconds(500));
   ```
2. The solution generated a message, with the following attributes. Add or remove the attributes as per requirements. 
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

2. In the **Welcome** tab, start a new connection with the following details:

   |_Field_|_Value_|
   |-------|-------|
   |Connection type| Microsoft SQL Server|
   |Server|Public IP address mentioned in the VM that was created for this demo|
   |Username|sa|
   |Password|The strong password that was used while creating the Azure SQL Edge instance|
   |Database|Default|
   |Server group|Default|
   |Name (optional)|Provide an optional name|

3. Click **Connect**

4. In the **File** section, open **/DeploymentScripts/MiningProcess_ONNX.jpynb** from the folder where you have cloned the project files on your machine.

5. Set the kernel to Python 3.


## Next steps

For more information on using ONNX models in Azure SQL Edge, see [Machine learning and AI with ONNX in SQL Edge](onnx-overview.md).