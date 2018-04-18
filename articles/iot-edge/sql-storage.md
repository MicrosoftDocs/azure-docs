---
title: Azure IoT Edge SQL module | Microsoft Docs 
description: Store data at the edge with Microsoft SQL modules, with Azure Functions to format the data. 
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban, ebertrams
ms.date: 02/21/2018
ms.topic: article
ms.service: iot-edge
---

# Store data at the edge with SQL Server databases

Use Azure IoT Edge devices to store the data that is generated at the edge. Devices with intermittent internet connections can maintain their own databases and report changes back to the cloud only when connected. Devices that have been programmed to send only critical data to the cloud can save the rest of the data for regular bulk uploads. Once in the cloud, the structured data can be shared with other Azure services, for instance to build a machine learning model. 

This article provides instructions for deploying a SQL Server database to an IoT Edge device. Azure Functions, running on the IoT Edge device, structures the incoming data then sends it to the database. The steps in this article can also be applied to other databases that work in containers, like MySQL or PostgreSQL. 

## Prerequisites 

Before you start the instructions in this article, you should complete the following tutorials:
* Deploy Azure IoT Edge on a simulated device in [Windows](tutorial-simulate-device-windows.md) or [Linux](tutorial-simulate-device-linux.md)
* [Deploy Azure Function as an IoT Edge module](tutorial-deploy-function.md)

The following articles aren't required to successfully complete this tutorial, but may provide helpful context:
* [Run the SQL Server 2017 container image with Docker](https://docs.microsoft.com/sql/linux/quickstart-install-connect-docker)
* [Use Visual Studio Code to develop and deploy Azure Functions to Azure IoT Edge](how-to-vscode-develop-azure-function.md)

After you complete the required tutorials, you should have all the required prerequisites ready on your machine: 
* An active Azure IoT hub.
* An IoT Edge device with at least 2-GB RAM and a 2-GB disk drive.
* [Visual Studio Code](https://code.visualstudio.com/). 
* [Azure IoT Edge extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge). 
* [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp). 
* [Docker](https://docs.docker.com/engine/installation/)
* [.NET Core 2.0 SDK](https://www.microsoft.com/net/core#windowscmd). 
* [Python 2.7](https://www.python.org/downloads/)
* [IoT Edge control script](https://pypi.python.org/pypi/azure-iot-edge-runtime-ctl)
* AzureIoTEdgeFunction template (`dotnet new -i Microsoft.Azure.IoT.Edge.Function`)
* An active IoT hub with at least an IoT Edge device.

Both Windows and Linux containers on x64 processor architectures work for this tutorial. SQL Server does not support ARM processors.

## Deploy a SQL Server container

In this section, you add an MS-SQL database to your simulated IoT Edge device. Use the SQL Server 2017 docker container image, available on [Windows](https://hub.docker.com/r/microsoft/mssql-server-windows-developer/) and [Linux](https://hub.docker.com/r/microsoft/mssql-server-linux/). 

### Deploy SQL Server 2017

By default, the code in this section creates a container with the free Developer edition of SQL Server 2017. If you want to run production editions instead, see [Run production container images](https://docs.microsoft.com/sql/linux/sql-server-linux-configure-docker#production) for detailed information. 

In step 3, you add create options to the SQL Server container, which are important for establishing environment variables and persistant storage. The configured [environment variables](https://docs.microsoft.com/sql/linux/sql-server-linux-configure-environment-variables) accept the End-User License Agreement, and define a password. The [persistant storage](https://docs.microsoft.com/sql/linux/sql-server-linux-configure-docker#persist) is configured using [mounts](https://docs.docker.com/storage/volumes/). Mounts create the SQL Server 2017 container with a *sqlvolume* volume container attached so that your data persists even if the container is deleted. 

1. Open the `deployment.json` file in Visual Studio Code. 
2. Replace the **modules** section of the file with the following code: 

   ```json
   "modules": {
          "filterFunction": {
            "version": "1.0",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "localhost:5000/filterfunction:latest",
              "createOptions": "{}"
            }
          },
          "tempSensor": {
            "version": "1.0",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "microsoft/azureiotedge-simulated-temperature-sensor:1.0-preview",
              "createOptions": "{}"
            }
          },
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
        }
   ```

3. Depending on the operating system that you're running, update the settings for the SQL module with the following code: 

   * Windows:

      ```json
      "image": "microsoft/mssql-server-windows-developer",
      "createOptions": "{\r\n\t"Env": [\r\n\t\t"ACCEPT_EULA=Y",\r\n\t\t"sa_password=Strong!Passw0rd"\r\n\t],\r\n\t"HostConfig": {\r\n\t\t"Mounts": [{\r\n\t\t\t"Target": "C:\\\\mssql",\r\n\t\t\t"Source": "sqlVolume",\r\n\t\t\t"Type": "volume"\r\n\t\t}],\r\n\t\t"PortBindings": {\r\n\t\t\t"1433/tcp": [{\r\n\t\t\t\t"HostPort": "1401"\r\n\t\t\t}]\r\n\t\t}\r\n\t}\r\n}"
      ```

   * Linux:

      ```json
      "image": "microsoft/mssql-server-linux:2017-latest",
      "createOptions": "{\r\n\t"Env": [\r\n\t\t"ACCEPT_EULA=Y",\r\n\t\t"MSSQL_SA_PASSWORD=Strong!Passw0rd"\r\n\t],\r\n\t"HostConfig": {\r\n\t\t"Mounts": [{\r\n\t\t\t"Target": "/var/opt/mssql",\r\n\t\t\t"Source": "sqlVolume",\r\n\t\t\t"Type": "volume"\r\n\t\t}],\r\n\t\t"PortBindings": {\r\n\t\t\t"1433/tcp": [{\r\n\t\t\t\t"HostPort": "1401"\r\n\t\t\t}]\r\n\t\t}\r\n\t}\r\n}"
      ```

4. Save the file. 
5. In the VS Code Command Palette, select **Edge: Create deployment for Edge device**. 
6. Select your IoT Edge device ID.
7. Select the `deployment.json` file that you updated. In the output window, you can see corresponding outputs for your deployment. 
8. To start your Edge runtime, select **Edge: Start Edge** in the Command Palette.

>[!TIP]
>Any time that you create a SQL Server container in a production environment, you should [change the default system administrator password](https://docs.microsoft.com/sql/linux/quickstart-install-connect-docker#change-the-sa-password).

## Create the SQL database

This section guides you through setting up the SQL database to store the temperature data received from the sensors connected to the IoT Edge device. If you're using a simulated device, this data comes from the *tempSensor* container. 

In a command-line tool, connect to your database: 

* Windows
   ```cmd
   Docker exec -it sql cmd
   ```

* Linux    
   ```bash
   Docker exec -it sql 'bash'
   ```

Open the SQL command tool: 

* Windows
   ```cmd
   sqlcmd -S localhost -U SA -P 'Strong!Passw0rd'
   ```

* Linux
   ```bash
   /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Strong!Passw0rd'
   ```

Create your database: 

* Windows
   ```sql
   CREATE DATABASE MeasurementsDB
   ON
   (NAME = MeasurementsDB, FILENAME = 'C:\mssql\measurementsdb.mdf')
   GO
   ```

* Linux
   ```sql
   CREATE DATABASE MeasurementsDB
   ON
   (NAME = MeasurementsDB, FILENAME = '/var/opt/mssql/measurementsdb.mdf')
   GO
   ```

Define your table: 

   ```sql
   CREATE TABLE MeasurementsDB.dbo.TemperatureMeasurements (measurementTime DATETIME2, location NVARCHAR(50), temperature FLOAT)
   GO
   ```

You can customize your SQL Server docker file to automatically set up your SQL Server to be deployed on multiple IoT Edge devices. For more information, see the [Microsoft SQL Server container demo project](https://github.com/twright-msft/mssql-node-docker-demo-app).

## Understand the SQL connection

In other tutorials, we use routes to allow containers to communicate while remaining isolated from each other. When you work with a SQL Server database, though, a closer relationship is necessary. 

IoT Edge automatically builds a bridge (Linux) or NAT (Windows) network when it starts. The network is called **azure-iot-edge**. If you ever need to debug this connection, you can look up its properties in the command line:

* Windows

   ```cmd
   docker network inspect azure-iot-edge
   ```

* Linux

   ```bash
   sudo docker network inspect azure-iot-edge
   ```

IoT Edge can also resolve the DNS of a container name through docker, so you don't need to refer to your SQL Server database by its IP address. 

As an example, here is the connection string that we use in the next section: 

   ```csharp
   Data Source=tcp:sql,1433;Initial Catalog=MeasurementsDB;User Id=SA;Password=Strong!Passw0rd;TrustServerCertificate=False;Connection Timeout=30;
   ```

You can see that the connection string references the container by its name, **sql**. If you changed the module name to be something else, update this connection string as well. Otherwise, continue on to the next section. 

## Update your Azure Function
To send the data to your database, update the FilterFunction Azure Function that you made in the previous tutorial. Change this file so that it structures the data received by your sensors then stores it in a SQL table. 

1. In Visual Studio Code, open your FilterFunction folder. 
2. Replace the run.csx file with the following code that includes the SQL connection string from the previous section: 

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
           const string str = "Data Source=tcp:sql,1433;Initial Catalog=MeasurementsDB;User Id=SA;Password=Strong!Passw0rd;TrustServerCertificate=False;Connection Timeout=30;";
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

## Update your container image

To apply the changes that you've made, update your container image, publish it, and restart IoT Edge.

1. In Visual Studio Code, expand the **Docker** folder. 
2. Based on the platform you're using, expand either the **windows-nano** or **linux-x64** folder. 
3. Right-click the **Dockerfile** file and select **Build IoT Edge module Docker image**.
4. Navigate to the **FilterFunction** project folder and click **Select folder as EXE_DIR**.
5. In the pop-up text box at the top of the VS Code window, enter the image name. For example, `<your container registry address>/filterfunction:latest`. If you are deploying to a local registry, the name should be `<localhost:5000/filterfunction:latest>`.
6. In the VS Code command palette, select **Edge: Push IoT Edge module Docker image**. 
7. In the pop-up text box, enter the same image name. 
8. In the VS Code command palette, select **Edge: Restart Edge**.

## View the local data

Once your containers restart, the data received from the temperature sensors is stored in a local SQL Server 2017 database on your IoT Edge device. 

In a command-line tool, connect to your database: 

* Windows
   ```cmd
   Docker exec -it sql cmd
   ```

* Linux    
   ```bash
   Docker exec -it sql 'bash'
   ```

Open the SQL command tool: 

* Windows
   ```cmd
   sqlcmd -S localhost -U SA -P 'Strong!Passw0rd'
   ```

* Linux
   ```bash
   /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Strong!Passw0rd'
   ```

View your data: 

   ```sql
   Select * FROM MeasurementsDB.dbo.TemperatureMeasurements
   GO
   ```

## Next steps

* Learn how to [configure SQL Server 2017 container images on Docker](https://docs.microsoft.com/sql/linux/sql-server-linux-configure-docker).

* Visit the [mssql-docker GitHub repository](https://github.com/Microsoft/mssql-docker) for resources, feedback, and known issues.
