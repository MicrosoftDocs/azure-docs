---
title: Query Avro data by using Azure Data Lake Analytics | Microsoft Docs
description: Use message body properties to route device telemetry to Blob storage and query the Avro format data that's written to Blob storage.
author: ash2017
ms.service: iot-hub 
services: iot-hub 
ms.topic: conceptual
ms.date: 05/29/2018
ms.author: asrastog
---

# Query Avro data by using Azure Data Lake Analytics

This article discusses how to query Avro data to efficiently route messages from Azure IoT Hub to Azure services. As we announced in the blog post [Azure IoT Hub message routing: now with routing on message body], IoT Hub supports routing on either properties or the message body. For more information, see [Routing on message bodies][Routing on message bodies]. 

The challenge has been that when Azure IoT Hub routes messages to Azure Blob storage, IoT Hub writes the content in Avro format, which has both a message body property and a message property. IoT Hub supports writing data to Blob storage only in the Avro data format, and this format is not used for any other endpoints. For more information, see [When using Azure Storage containers][When using Azure storage containers]. Although the Avro format is great for data and message preservation, it's a challenge to use it to query data. In comparison, JSON or CSV format is much easier for querying data.

To address non-relational big-data needs and formats and overcome this challenge, you can use many of the big-data patterns for both transforming and scaling data. One of the patterns, “pay per query,” is Azure Data Lake Analytics, which is the focus of this article. Although you can easily execute the query in Hadoop or other solutions, Data Lake Analytics is often better suited for this “pay per query” approach. 

There is an “extractor” for Avro in U-SQL. For more information, see [U-SQL Avro example].

## Query and export Avro data to a CSV file
In this section, you query Avro data and export it to a CSV file in Azure Blob storage, although you could easily place the data in other repositories or data stores.

1. Set up Azure IoT Hub to route data to an Azure Blob storage endpoint by using a property in the message body to select messages.

    ![The "Custom endpoints" section][img-query-avro-data-1a]

    ![The Routes command][img-query-avro-data-1b]

2. Ensure that your device has the encoding, content type, and needed data in either the properties or the message body, as referenced in the product documentation. When you view these attributes in Device Explorer, as shown here, you can verify that they are set correctly.

    ![The Event Hub Data pane][img-query-avro-data-2]

3. Set up an Azure Data Lake Store instance and a Data Lake Analytics instance. Azure IoT Hub does not route to a Data Lake Store instance, but a Data Lake Analytics instance requires one.

    ![Data Lake Store and Data Lake Analytics instances][img-query-avro-data-3]

4. In Data Lake Analytics, configure Azure Blob storage as an additional store, the same Blob storage that Azure IoT Hub routes data to.

    ![The "Data sources" pane][img-query-avro-data-4]
 
5. As discussed in [U-SQL Avro example], you need four DLL files. Upload these files to a location in your Data Lake Store instance.

    ![Four uploaded DLL files][img-query-avro-data-5] 

6. In Visual Studio, create a U-SQL project.
 
    ![Create a U-SQL project][img-query-avro-data-6]

7. Paste the content of the following script into the newly created file. Modify the three highlighted sections: your Data Lake Analytics account, the associated DLL file paths, and the correct path for your storage account.
    
    ![The three sections to be modified][img-query-avro-data-7a]

    The actual U-SQL script for simple output to a CSV file:
    
    ```sql
        DROP ASSEMBLY IF EXISTS [Avro];
        CREATE ASSEMBLY [Avro] FROM @"/Assemblies/Avro/Avro.dll";
        DROP ASSEMBLY IF EXISTS [Microsoft.Analytics.Samples.Formats];
        CREATE ASSEMBLY [Microsoft.Analytics.Samples.Formats] FROM @"/Assemblies/Avro/Microsoft.Analytics.Samples.Formats.dll";
        DROP ASSEMBLY IF EXISTS [Newtonsoft.Json];
        CREATE ASSEMBLY [Newtonsoft.Json] FROM @"/Assemblies/Avro/Newtonsoft.Json.dll";
        DROP ASSEMBLY IF EXISTS [log4net];
        CREATE ASSEMBLY [log4net] FROM @"/Assemblies/Avro/log4net.dll";

        REFERENCE ASSEMBLY [Newtonsoft.Json];
        REFERENCE ASSEMBLY [log4net];
        REFERENCE ASSEMBLY [Avro];
        REFERENCE ASSEMBLY [Microsoft.Analytics.Samples.Formats];

        // Blob container storage account filenames, with any path
        DECLARE @input_file string = @"wasb://hottubrawdata@kevinsayazstorage/kevinsayIoT/{*}/{*}/{*}/{*}/{*}/{*}";
        DECLARE @output_file string = @"/output/output.csv";

        @rs =
        EXTRACT
        EnqueuedTimeUtc string,
        Body byte[]
        FROM @input_file

        USING new Microsoft.Analytics.Samples.Formats.ApacheAvro.AvroExtractor(@"
        {
        ""type"":""record"",
        ""name"":""Message"",
        ""namespace"":""Microsoft.Azure.Devices"",
        ""fields"":[{
        ""name"":""EnqueuedTimeUtc"",
        ""type"":""string""
        },
        {
        ""name"":""Properties"",
        ""type"":{
        ""type"":""map"",
        ""values"":""string""
        }
        },
        {
        ""name"":""SystemProperties"",
        ""type"":{
        ""type"":""map"",
        ""values"":""string""
        }
        },
        {
        ""name"":""Body"",
        ""type"":[""null"",""bytes""]
        }
        ]
        }");

        @cnt =
        SELECT EnqueuedTimeUtc AS time, Encoding.UTF8.GetString(Body) AS jsonmessage
        FROM @rs;

        OUTPUT @cnt TO @output_file USING Outputters.Text(); 
    ```    

    It took Data Lake Analytics five minutes to run the following script, which was limited to 10 analytic units and processed 177 files. The result is shown in the CSV-file output that's displayed in the following image:
    
    ![Results of the output to CSV file][img-query-avro-data-7b]

    ![Output converted to CSV file][img-query-avro-data-7c]

    To parse the JSON, continue to step 8.
    
8. Most IoT messages are in JSON file format. By adding the following lines, you can parse the message into a JSON file, which lets you add the WHERE clauses and output only the needed data.

    ```sql
       @jsonify = SELECT Microsoft.Analytics.Samples.Formats.Json.JsonFunctions.JsonTuple(Encoding.UTF8.GetString(Body)) AS message FROM @rs;
    
        /*
        @cnt =
            SELECT EnqueuedTimeUtc AS time, Encoding.UTF8.GetString(Body) AS jsonmessage
            FROM @rs;
        
        OUTPUT @cnt TO @output_file USING Outputters.Text();
        */
        
        @cnt =
        	SELECT message["message"] AS iotmessage,
        		   message["event"] AS msgevent,
        		   message["object"] AS msgobject,
        		   message["status"] AS msgstatus,
        		   message["host"] AS msghost
        	FROM @jsonify;
        	
        OUTPUT @cnt TO @output_file USING Outputters.Text();
    ```

    The output displays a column for each item in the `SELECT` command. 
    
    ![Output showing a column for each item][img-query-avro-data-8]

## Next steps
In this tutorial, you learned how to query Avro data to efficiently route messages from Azure IoT Hub to Azure services.

For examples of complete end-to-end solutions that use IoT Hub, see [Azure IoT Remote Monitoring solution accelerator][lnk-iot-sa-land].

To learn more about developing solutions with IoT Hub, see the [IoT Hub developer guide].

To learn more about message routing in IoT Hub, see [Send and receive messages with IoT Hub][lnk-devguide-messaging].

<!-- Images -->
[img-query-avro-data-1a]: ./media/iot-hub-query-avro-data/query-avro-data-1a.png
[img-query-avro-data-1b]: ./media/iot-hub-query-avro-data/query-avro-data-1b.png
[img-query-avro-data-2]: ./media/iot-hub-query-avro-data/query-avro-data-2.png
[img-query-avro-data-3]: ./media/iot-hub-query-avro-data/query-avro-data-3.png
[img-query-avro-data-4]: ./media/iot-hub-query-avro-data/query-avro-data-4.png
[img-query-avro-data-5]: ./media/iot-hub-query-avro-data/query-avro-data-5.png
[img-query-avro-data-6]: ./media/iot-hub-query-avro-data/query-avro-data-6.png
[img-query-avro-data-7a]: ./media/iot-hub-query-avro-data/query-avro-data-7a.png
[img-query-avro-data-7b]: ./media/iot-hub-query-avro-data/query-avro-data-7b.png
[img-query-avro-data-7c]: ./media/iot-hub-query-avro-data/query-avro-data-7c.png
[img-query-avro-data-8]: ./media/iot-hub-query-avro-data/query-avro-data-8.png

<!-- Links -->
[Azure IoT Hub message routing: now with routing on message body]: https://azure.microsoft.com/blog/iot-hub-message-routing-now-with-routing-on-message-body/

[Routing on message bodies]: iot-hub-devguide-query-language.md#routing-on-message-bodies
[When using Azure storage containers]:iot-hub-devguide-endpoints.md#when-using-azure-storage-containers

[U-SQL Avro example]:https://github.com/Azure/usql/tree/master/Examples/AvroExamples

[lnk-iot-sa-land]: ../iot-accelerators/index.yml
[IoT Hub developer guide]: iot-hub-devguide.md
[lnk-devguide-messaging]: iot-hub-devguide-messaging.md
