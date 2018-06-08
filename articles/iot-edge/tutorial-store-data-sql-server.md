---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Store data with Azure IoT Edge SQL module | Microsoft Docs 
description: Learn how to store data locally on your IoT Edge device with a SQL Server module
services: iot-edge
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 06/08/2018
ms.topic: tutorial
ms.service: iot-edge
ms.custom: mvc

---

# Store data at the edge with SQL Server databases

Use Azure IoT Edge devices to store the data that is generated at the edge. Devices with intermittent internet connections can maintain their own databases and report changes back to the cloud only when connected. Devices that have been programmed to send only critical data to the cloud can save the rest of the data for regular bulk uploads. Once in the cloud, the structured data can be shared with other Azure services, for instance to build a machine learning model. 

This article provides instructions for deploying a SQL Server database to an IoT Edge device. Azure Functions, running on the IoT Edge device, structures the incoming data then sends it to the database. The steps in this article can also be applied to other databases that work in containers, like MySQL or PostgreSQL.

In this tutorial, you learn how to: 

> [!div class="checklist"]
> * Use Visual Studio Code to create an Azure Function
> * Deploy a SQL database to your IoT Edge device
> * Use Visual Studio Code to build modules and deploy them to your IoT Edge device
> * View generated data

## Prerequisites

* The Azure IoT Edge device that you created in the quickstart or previous tutorial.
* [Visual Studio Code](https://code.visualstudio.com/). 
* [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp). 
* [.NET Core 2.0 SDK](https://www.microsoft.com/net/core#windowscmd). 
* [Docker CE](https://docs.docker.com/install/) on your development machine. 

## Create a container registry
In this tutorial, you use the Azure IoT Edge extension for VS Code to build a module and create a **container image** from the files. Then you push this image to a **registry** that stores and manages your images. Finally, you deploy your image from your registry to run on your IoT Edge device.  

You can use any Docker-compatible registry for this tutorial. Two popular Docker registry services available in the cloud are [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/) and [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags). This tutorial uses Azure Container Registry. 

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** > **Containers** > **Azure Container Registry**.
2. Give your registry a name, choose a subscription, choose a resource group, and set the SKU to **Basic**. 
3. Select **Create**.
4. Once your container registry is created, navigate to it and select **Access keys**. 
5. Toggle **Admin user** to **Enable**.
6. Copy the values for **Login server**, **Username**, and **Password**. You'll use these values later in the tutorial. 

## Create a function project

To send data into a database, you need a module that can structure the data properly and then stores it in a table. 

The following steps show you how to create an IoT Edge function using Visual Studio Code and the Azure IoT Edge extension.

1. Open Visual Studio Code.
2. Open the VS Code integrated terminal by selecting **View** > **Integrated Terminal**.
3. Install (or update) the **AzureIoTEdgeFunction** template in .NET by running the following command in the integrated terminal: 

   ```cmd/sh
   dotnet new -i Microsoft.Azure.IoT.Edge.Function
   ```

4. Open the VS Code command palette by selecting **View** > **Command palette**.
3. In the command palette, type and run the command **Azure IoT Edge: New IoT Edge solution**. In the command palette, provide the following information to create your solution: 
   1. Select the folder where you want to create the solution. 
   2. Provide a name for your solution or accept the default **EdgeSolution**.
   3. Choose **Azure Functions - C#** as the module template. 
   4. Name your module **sqlFunction**. 
   5. Specify the Azure Container Registry that you created in the previous section as the image repository for your first module. Replace **localhost:5000** with the login server value that you copied. The final string looks like **\<registry name\>.azurecr.io/csharpfunction**.

4. The VS Code window loads your IoT Edge solution workspace. There is a **modules** folder, a **.vscode** folder, and a deployment manifest template file. Open **modules** > **sqlFunction** > **EdgeHubTrigger-Csharp** > **run.csx**.

5. Replace the contents of the file with the following code:

   ```csharp
   #r "Microsoft.Azure.Devices.Client"
   #r "Newtonsoft.Json"
   #r "System.Data.SqlClient"

   using System.IO;
   using Microsoft.Azure.Devices.Client;
   using Newtonsoft.Json;
   using Sql = System.Data.SqlClient;
   using System.Threading.Tasks;

   // Filter messages based on the temperature value in the body of the message and the temperature threshold value.
   public static async Task Run(Message messageReceived, IAsyncCollector<Message> output, TraceWriter log)
   {
       const int temperatureThreshold = 25;
       byte[] messageBytes = messageReceived.GetBytes();
       var messageString = System.Text.Encoding.UTF8.GetString(messageBytes);

       if (!string.IsNullOrEmpty(messageString))
       {
           // Get the body of the message and deserialize it
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
               log.Info($"{rows} rows were updated");
               }
           }

           if (messageBody != null && messageBody.machine.temperature > temperatureThreshold)
           {
               // Send the message to the output as the temperature value is greater than the threshold
               var filteredMessage = new Message(messageBytes);
               // Copy the properties of the original message into the new Message object
               foreach (KeyValuePair<string, string> prop in messageReceived.Properties)
               {
                   filteredMessage.Properties.Add(prop.Key, prop.Value);
               }
               // Add a new property to the message to indicate it is an alert
               filteredMessage.Properties.Add("MessageType", "Alert");
               // Send the message        
               await output.AddAsync(filteredMessage);
               log.Info("Received and transferred a message with temperature above the threshold");
           }
       }
   }

   //Define the expected schema for the body of incoming messages
   class MessageBody
   {
       public Machine machine {get;set;}
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
   ```

6. In line 24, replace the string **\<sql connection string\>** with the following string. The **Data Source** property references the SQL Server container name, which is **SQL** in this tutorial. 

   ```C#
   Data Source=tcp:sql,1433;Initial Catalog=MeasurementsDB;User Id=SA;Password=Strong!Passw0rd;TrustServerCertificate=False;Connection Timeout=30;
   ```

7. Save the **run.csx** file. 

## Add a SQL Server container

A [Deployment manifest](module-composition.md) declares which modules the IoT Edge runtime will install on your IoT Edge device. You added the code to make a customized Function module in the previous section, but the SQL Server module is already built. You just need to tell the IoT Edge runtime to include it, then configure it on your device. 

1. In the Visual Studio Code explorer, open the **deployment.template.json** file. 
2. Find the **moduleContent.$edgeAgent.properties.desired.modules** section. There should be two modules listed: **tempSensor** which generates simulated data, and your **sqlFunction** module.
3. Add the following code to declare a third module:

   ```
   "sql": {
       "version": "1.0",
       "type": "docker",
       "status": "running",
       "restartPolicy": "always",
       "settings": {
           "image": "",
           "createOptions": ""
       }
   }
   ```

4. Depending on the operating system of your IoT Edge device, update the **sql.settings** parameters with the following code:

   * Windows:

      ```json
      "image": "microsoft/mssql-server-windows-developer",
      "createOptions": "{\"Env\": [\"ACCEPT_EULA=Y\",\"MSSQL_SA_PASSWORD=Strong!Passw0rd\"],\"HostConfig\": {\"Mounts\": [{\"Target\": \"C:\\\\mssql\",\"Source\": \"sqlVolume\",\"Type\": \"volume\"}],\"PortBindings\": {\"1433/tcp\": [{\"HostPort\": \"1401\"}]}}}"
      ```

   * Linux:

      ```json
      "image": "microsoft/mssql-server-linux:2017-latest",
      "createOptions": "{\"Env\": [\"ACCEPT_EULA=Y\",\"MSSQL_SA_PASSWORD=Strong!Passw0rd\"],\"HostConfig\": {\"Mounts\": [{\"Target\": \"/var/opt/mssql\",\"Source\": \"sqlVolume\",\"Type\": \"volume\"}],\"PortBindings\": {\"1433/tcp\": [{\"HostPort\": \"1401\"}]}}}"
      ```

   >[!Tip]
   >Any time that you create a SQL Server container in a production environment, you should [change the default system administrator password](https://docs.microsoft.com/sql/linux/quickstart-install-connect-docker#change-the-sa-password).

5. Save the **deployment.template.json** file. 

## Build your IoT Edge solution

In the previous sections you created a solution with one module, and then added another to the deployment manifest template. Now, you need to build the solution, create container images for the modules, and push the images to your container registry. 

1. In the **deployment.template.json** file give the IoT Edge runtime your registry credentials so that it can access your module images. Find the **moduleContent.$edgeAgent.properties.desired.runtime.settings** section. 
2. Insert the following JSON code after the **loggingOptions**:

   ```JSON
   "registryCredentials": {
       "myRegistry": {
           "username": "",
           "password": "",
           "address": ""
       }
   }
   ```

3. Insert your registry credentials into the **username**, **password**, and **address** fields. Use the values that you copied when you created your Azure Container Registry at the beginning of the tutorial.
4. Save the **deployment.template.json** file.
5. Sign in your container registry in Visual Studio Code so that you can push your images to your registry. Use the same credentials that you just added to the deployment manifest. Enter the following command in the integrated terminal: 

   ```cmd/sh
   docker login -u <username> -p <password> <address>
   ```
6. In the VS Code explorer, right-click the **deployment.template.json** file and select **Build IoT Edge solution**. 

## Deploy the solution to a device

You can set modules on a device through the IoT Hub, but you can also access your IoT Hub and devices through Visual Studio Code. In this section, you set up access to your IoT Hub then use VS Code to deploy your solution to your IoT Edge device. 

1. In the VS Code command palette, select **Azure IoT Hub: Select IoT Hub**.
2. Follow the prompts to sign in to your Azure account. 
3. In the command palette, select your Azure subscription then select your IoT Hub. 
4. In the VS Code explorer, expand the **Azure IoT Hub Devices** section. 
5. Right-click on the device that you want to target with your deployment and select **Create deployment for IoT Edge device**. 
6. In the file explorer, navigate to the **config** folder inside your solution and choose **deployment.json**. Click **Select Edge deployment manifest**. 

