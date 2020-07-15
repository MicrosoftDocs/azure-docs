---
title: Tutorial - Store data with SQL module using Azure IoT Edge
description: This tutorial shows how to store data locally on your IoT Edge device with a SQL Server module
services: iot-edge
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 03/28/2019
ms.topic: tutorial
ms.service: iot-edge
ms.custom: mvc
#Customer intent: As an IoT developer, I want to use SQL Service to execute logic on edge devices to filter data and communications that is sent to the cloud.
---

# Tutorial: Store data at the edge with SQL Server databases

Deploy a SQL Server module to store data on a Linux device running Azure IoT Edge.

Use Azure IoT Edge and SQL Server to store and query data at the edge. Azure IoT Edge has basic storage capabilities to cache messages if a device goes offline, and then forward them when the connection is reestablished. However, you may want more advanced storage capabilities, like being able to query data locally. Your IoT Edge devices can use local databases to perform more complex computing without having to maintain a connection to IoT Hub.

This article provides instructions for deploying a SQL Server database to an IoT Edge device. Azure Functions, running on the IoT Edge device, structures the incoming data then sends it to the database. The steps in this article can also be applied to other databases that work in containers, like MySQL or PostgreSQL.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Use Visual Studio Code to create an Azure Function
> * Deploy a SQL database to your IoT Edge device
> * Use Visual Studio Code to build modules and deploy them to your IoT Edge device
> * View generated data

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

Before beginning this tutorial, you should have gone through the previous tutorial to set up your development environment for Linux container development: [Develop IoT Edge modules for Linux devices](tutorial-develop-for-linux.md). By completing that tutorial, you should have the following prerequisites in place:

* A free or standard-tier [IoT Hub](../iot-hub/iot-hub-create-through-portal.md) in Azure.
* An AMD64 [Linux device running Azure IoT Edge](quickstart-linux.md).
  * ARM devices, like Raspberry Pis, cannot run SQL Server. If you want to use SQL on an ARM device, you can sign up to try [Azure SQL Edge](https://azure.microsoft.com/services/sql-edge/) in preview.
* A container registry, like [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/).
* [Visual Studio Code](https://code.visualstudio.com/) configured with the [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).
* [Docker CE](https://docs.docker.com/install/) configured to run Linux containers.

This tutorial uses an Azure Functions module to send data to the SQL Server. To develop an IoT Edge module with Azure Functions, install the following additional prerequisites on your development machine:

* [C# for Visual Studio Code (powered by OmniSharp) extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp).
* [.NET Core 2.1 SDK](https://www.microsoft.com/net/download).

## Create a function project

To send data into a database, you need a module that can structure the data properly and then stores it in a table.

### Create a new project

The following steps show you how to create an IoT Edge function using Visual Studio Code and the Azure IoT Tools.

1. Open Visual Studio Code.

2. Open the VS Code command palette by selecting **View** > **Command palette**.

3. In the command palette, type and run the command **Azure IoT Edge: New IoT Edge solution**. In the command palette, provide the following information to create your solution:

   | Field | Value |
   | ----- | ----- |
   | Select folder | Choose the location on your development machine for VS Code to create the solution files. |
   | Provide a solution name | Enter a descriptive name for your solution, like **SqlSolution**, or accept the default. |
   | Select module template | Choose **Azure Functions - C#**. |
   | Provide a module name | Name your module **sqlFunction**. |
   | Provide Docker image repository for the module | An image repository includes the name of your container registry and the name of your container image. Your container image is prepopulated from the last step. Replace **localhost:5000** with the login server value from your Azure container registry. You can retrieve the login server from the Overview page of your container registry in the Azure portal. <br><br>The final string looks like \<registry name\>.azurecr.io/sqlfunction. |

   The VS Code window loads your IoT Edge solution workspace.

### Add your registry credentials

The environment file stores the credentials for your container registry and shares them with the IoT Edge runtime. The runtime needs these credentials to pull your private images onto the IoT Edge device.

1. In the VS Code explorer, open the .env file.
2. Update the fields with the **username** and **password** values that you copied from your Azure container registry.
3. Save this file.

### Select your target architecture

Currently, Visual Studio Code can develop C modules for Linux AMD64 and Linux ARM32v7 devices. You need to select which architecture you're targeting with each solution, because the container is built and run differently for each architecture type. The default is Linux AMD64.

1. Open the command palette and search for **Azure IoT Edge: Set Default Target Platform for Edge Solution**, or select the shortcut icon in the side bar at the bottom of the window.

2. In the command palette, select the target architecture from the list of options. For this tutorial, we're using an Ubuntu virtual machine as the IoT Edge device, so will keep the default **amd64**.

### Update the module with custom code

1. In the VS Code explorer, open **modules** > **sqlFunction** > **sqlFunction.cs**.

2. Replace the entire contents of the file with the following code:

   ```csharp
   using System;
   using System.Collections.Generic;
   using System.IO;
   using System.Text;
   using System.Threading.Tasks;
   using Microsoft.Azure.Devices.Client;
   using Microsoft.Azure.WebJobs;
   using Microsoft.Azure.WebJobs.Extensions.EdgeHub;
   using Microsoft.Azure.WebJobs.Host;
   using Microsoft.Extensions.Logging;
   using Newtonsoft.Json;
   using Sql = System.Data.SqlClient;

   namespace Functions.Samples
   {
       public static class sqlFunction
       {
           [FunctionName("sqlFunction")]
           public static async Task FilterMessageAndSendMessage(
               [EdgeHubTrigger("input1")] Message messageReceived,
               [EdgeHub(OutputName = "output1")] IAsyncCollector<Message> output,
               ILogger logger)
           {
               const int temperatureThreshold = 20;
               byte[] messageBytes = messageReceived.GetBytes();
               var messageString = System.Text.Encoding.UTF8.GetString(messageBytes);

               if (!string.IsNullOrEmpty(messageString))
               {
                   logger.LogInformation("Info: Received one non-empty message");
                   // Get the body of the message and deserialize it.
                   var messageBody = JsonConvert.DeserializeObject<MessageBody>(messageString);

                   //Store the data in SQL db
                   const string str = "<sql connection string>";
                   using (Sql.SqlConnection conn = new Sql.SqlConnection(str))
                   {
                       conn.Open();
                       var insertMachineTemperature = "INSERT INTO MeasurementsDB.dbo.TemperatureMeasurements VALUES (CONVERT(DATETIME2,'" + messageBody.timeCreated + "', 127), 'machine', " + messageBody.machine.temperature + ");";
                       var insertAmbientTemperature = "INSERT INTO MeasurementsDB.dbo.TemperatureMeasurements VALUES (CONVERT(DATETIME2,'" + messageBody.timeCreated + "', 127), 'ambient', " + messageBody.ambient.temperature + ");";
                       using (Sql.SqlCommand cmd = new Sql.SqlCommand(insertMachineTemperature + "\n" + insertAmbientTemperature, conn))
                       {
                           //Execute the command and log the # rows affected.
                           var rows = await cmd.ExecuteNonQueryAsync();
                           logger.LogInformation($"{rows} rows were updated");
                       }
                   }

                   if (messageBody != null && messageBody.machine.temperature > temperatureThreshold)
                   {
                       // Send the message to the output as the temperature value is greater than the threashold.
                       using (var filteredMessage = new Message(messageBytes))
                       {
                            // Copy the properties of the original message into the new Message object.
                            foreach (KeyValuePair<string, string> prop in messageReceived.Properties)
                            {filteredMessage.Properties.Add(prop.Key, prop.Value);}
                            // Add a new property to the message to indicate it is an alert.
                            filteredMessage.Properties.Add("MessageType", "Alert");
                            // Send the message.
                            await output.AddAsync(filteredMessage);
                            logger.LogInformation("Info: Received and transferred a message with temperature above the threshold");
                       }
                   }
               }
           }
       }
       //Define the expected schema for the body of incoming messages.
       class MessageBody
       {
           public Machine machine {get; set;}
           public Ambient ambient {get; set;}
           public string timeCreated {get; set;}
       }
       class Machine
       {
           public double temperature {get; set;}
           public double pressure {get; set;}
       }
       class Ambient
       {
           public double temperature {get; set;}
           public int humidity {get; set;}
       }
   }
   ```

3. In line 35, replace the string **\<sql connection string\>** with the following string. The **Data Source** property references the SQL Server container, which doesn't exist yet. You will create it with the name **SQL** in the next section.

   ```csharp
   Data Source=tcp:sql,1433;Initial Catalog=MeasurementsDB;User Id=SA;Password=Strong!Passw0rd;TrustServerCertificate=False;Connection Timeout=30;
   ```

4. Save the **sqlFunction.cs** file.

5. Open the **sqlFunction.csproj** file.

6. Find the group of package references, and add a new one to include SqlClient.

   ```csproj
   <PackageReference Include="System.Data.SqlClient" Version="4.5.1"/>
   ```

7. Save the **sqlFunction.csproj** file.

## Add the SQL Server container

A [Deployment manifest](module-composition.md) declares which modules the IoT Edge runtime will install on your IoT Edge device. You provided the code to make a customized Function module in the previous section, but the SQL Server module is already built and available in the Azure Marketplace. You just need to tell the IoT Edge runtime to include it, then configure it on your device.

1. In Visual Studio Code, open the command palette by selecting **View** > **Command palette**.

2. In the command palette, type and run the command **Azure IoT Edge: Add IoT Edge module**. In the command palette, provide the following information to add a new module:

   | Field | Value |
   | ----- | ----- |
   | Select deployment template file | The command palette highlights the deployment.template.json file in your current solution folder. Select that file.  |
   | Select module template | Select **Module from Azure Marketplace**. |

3. In the Azure IoT Edge module marketplace, search for and select **SQL Server Module**.

4. Change the module name to **sql**, all lowercase. This name matches the container name declared in the connection string in the sqlFunction.cs file.

5. Select **Import** to add the module to your solution.

6. In your solution folder, open the **deployment.template.json** file.

7. Find the **modules** section. You should see three modules. The module *SimulatedTemperatureSensor* is included by default in new solutions, and provides test data to use with your other modules. The module *sqlFunction* is the module that you initially created and updated with new code. Finally, the module *sql* was imported from the Azure Marketplace.

   >[!Tip]
   >The SQL Server module comes with a default password set in the environment variables of the deployment manifest. Any time that you create a SQL Server container in a production environment, you should [change the default system administrator password](https://docs.microsoft.com/sql/linux/quickstart-install-connect-docker).

8. Close the **deployment.template.json** file.

## Build your IoT Edge solution

In the previous sections, you created a solution with one module, and then added another to the deployment manifest template. The SQL Server module is hosted publicly by Microsoft, but you need to containerize the code in the Functions module. In this section, you build the solution, create container images for the sqlFunction module, and push the image to your container registry.

1. In Visual Studio Code, open the integrated terminal by selecting **View** > **Terminal**.  

1. Sign in to your container registry in Visual Studio Code so that you can push your images to your registry. Use the same Azure Container Registry (ACR) credentials that you added to the .env file. Enter the following command in the integrated terminal:

    ```csh/sh
    docker login -u <ACR username> -p <ACR password> <ACR login server>
    ```

    You might see a security warning recommending the use of the --password-stdin parameter. While its use is outside the scope of this article, we recommend following this best practice. For more information, see the [docker login](https://docs.docker.com/engine/reference/commandline/login/#provide-a-password-using-stdin) command reference.

1. In the VS Code explorer, right-click the **deployment.template.json** file and select **Build and Push IoT Edge solution**.

When you tell Visual Studio Code to build your solution, it first takes the information in the deployment template and generates a deployment.json file in a new folder named **config**. Then, it runs two commands in the integrated terminal: `docker build` and `docker push`. The build command builds your code and containerizes the module. Then, the push command pushes the code to the container registry that you specified when you initialized the solution.

You can verify that the sqlFunction module was successfully pushed to your container registry. In the Azure portal, navigate to your container registry. Select **repositories** and search for **sqlFunction**. The other two modules, SimulatedTemperatureSensor and sql, won't be pushed to your container registry because their repositories are already in the Microsoft registries.

## Deploy the solution to a device

You can set modules on a device through the IoT Hub, but you can also access your IoT Hub and devices through Visual Studio Code. In this section, you set up access to your IoT Hub then use VS Code to deploy your solution to your IoT Edge device.

1. In the VS Code explorer, expand the **Azure IoT Hub Devices** section.

2. Right-click on the device that you want to target with your deployment and select **Create deployment for single device**.

3. In the file explorer, navigate to the **config** folder inside your solution and choose **deployment.amd64**. Click **Select Edge deployment manifest**.

   Do not use the deployment.template.json file as a deployment manifest.

If the deployment is successful, a confirmation message is printed in the VS Code output.

Refresh the status of your device in the Azure IoT Hub Devices section of VS Code. The new modules are listed and will start to report as running over the next few minutes as the containers are installed and started. You can also check to see that all the modules are up and running on your device. On your IoT Edge device, run the following command to see the status of the modules.

   ```cmd/sh
   iotedge list
   ```

## Create the SQL database

When you apply the deployment manifest to your device, you get three modules running. The SimulatedTemperatureSensor module generates simulated environment data. The sqlFunction module takes the data and formats it for a database. This section guides you through setting up the SQL database to store the temperature data.

Run the following commands on your IoT Edge device. These commands connect to the **sql** module running on your device and create a database and table to hold the temperature data being sent to it.

1. In a command-line tool on your IoT Edge device, connect to your database.

      ```bash
      sudo docker exec -it sql bash
      ```

2. Open the SQL command tool.

      ```bash
      /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Strong!Passw0rd'
      ```

3. Create your database:

      ```sql
      CREATE DATABASE MeasurementsDB
      ON
      (NAME = MeasurementsDB, FILENAME = '/var/opt/mssql/measurementsdb.mdf')
      GO
      ```

4. Define your table.

   ```sql
   CREATE TABLE MeasurementsDB.dbo.TemperatureMeasurements (measurementTime DATETIME2, location NVARCHAR(50), temperature FLOAT)
   GO
   ```

You can customize your SQL Server docker file to automatically set up your SQL Server to be deployed on multiple IoT Edge devices. For more information, see the [Microsoft SQL Server container demo project](https://github.com/twright-msft/mssql-node-docker-demo-app).

## View the local data

Once your table is created, the sqlFunction module starts storing data in a local SQL Server 2017 database on your IoT Edge device.

From inside the SQL command tool, run the following command to view your formatted table data:

   ```sql
   SELECT * FROM MeasurementsDB.dbo.TemperatureMeasurements
   GO
   ```

   ![View contents of local database](./media/tutorial-store-data-sql-server/view-data.png)

## Clean up resources

If you plan to continue to the next recommended article, you can keep the resources and configurations that you created and reuse them. You can also keep using the same IoT Edge device as a test device.

Otherwise, you can delete the local configurations and the Azure resources that you created in this article to avoid charges.

[!INCLUDE [iot-edge-clean-up-cloud-resources](../../includes/iot-edge-clean-up-cloud-resources.md)]

## Next steps

In this tutorial, you created an Azure Functions module that contains code to filter raw data generated by your IoT Edge device. When you're ready to build your own modules, you can learn more about how to [Develop Azure Functions with Azure IoT Edge for Visual Studio Code](how-to-develop-csharp-function.md).

If you want to try another storage method at the edge, read about how to use Azure Blob Storage on IoT Edge.

> [!div class="nextstepaction"]
> [Store data at the edge with Azure Blob Storage on IoT Edge](how-to-store-data-blob.md)
