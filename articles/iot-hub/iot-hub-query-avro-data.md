---
title: Query Avro data using Azure Data Lake Analytics | Microsoft Docs
description: Use message body properties to route device telemetry to blob storage and query the Avro format data written to blob storage.
services: iot-hub
documentationcenter: 
author: ksaye
manager: obloch
ms.service: iot-hub 
ms.topic: article
ms.date: 05/29/2018
ms.author: Kevin.Saye

---

# Query Avro data using Azure Data Lake Analytics

This article is about how to query Avro data for efficiently routing messages from Azure IoT Hub to Azure services. Following the blog post announcement—[Azure IoT Hub message routing: now with routing on message body], IoT Hub supports routing on either properties or the message body. See also [Routing on message bodies][Routing on message bodies]. 

The challenge has been that when Azure IoT Hub routes messages to blob storage, IoT Hub writes the content in Avro format, which has both message body and message properties. Note that IoT Hub only supports writing data to blob storage in the Avro data format, and this format is not used for any other endpoints. See [When using Azure Storage containers][When using Azure storage containers]. While the Avro format is great for data/message preservation, it's challenging for querying the data. In comparison, JSON or CSV format is much easier for querying data.

To solve this, you can use many of the big data patterns for both transforming and scaling data to address non-relational big data needs and formats. One of the patterns, a “pay per query” pattern, is Azure Data Lake Analytics (ADLA). It is the focus of this article. Though you could easily execute the query in Hadoop or other solutions, ADLA is often better suited for this “pay per query” approach. There is an “extractor” for Avro in U-SQL. See [U-SQL Avro Example].

## Query and export Avro data to a CSV file
The section walks you through querying Avro data and exporting it to a CSV file in Azure Blob Storage, though you could easily place the data in other repositories or data stores.

1. Set up Azure IoT Hub to route data to an Azure Blob Storage endpoint using a property in the message body to select messages.

    ![Screen capture for step 1a][img-query-avro-data-1a]

    ![Screen capture for step 1b][img-query-avro-data-1b]

2. Ensure your device has the encoding, the content type, and the needed data in either the properties or the message body as referenced in the product documentation. When viewed in Device Explorer (see below), you can verify that these attributes are set correctly.

    ![Screen capture for step 2][img-query-avro-data-2]

3. Set up an Azure Data Lake Store (ADLS) and an Azure Data Lake Analytics instance. While Azure IoT Hub does not route to an Azure Data Lake Store, ADLA requires one.

    ![Screen capture for step 3][img-query-avro-data-3]

4. In ADLA, configure the Azure Blob Storage as an additional store, the same Blob Storage that Azure IoT Hub routes data to.

    ![Screen capture for step 4][img-query-avro-data-4]
 
5. As discussed in [U-SQL Avro Example], there are 4 DLLs that are needed.  Upload these files to a location in your ADLS.

    ![Screen capture for step 5][img-query-avro-data-5] 

6. In Visual Studio, create a U-SQL Project
 
    ![Screen capture for step 6][img-query-avro-data-6]

7. Copy the content of the following script and paste it into the newly created file. Modify the 3 highlighted sections: your ADLA account, the associated DLLs' paths, and the correct path for your Storage Account.
    
    ![Screen capture for step 7a][img-query-avro-data-7a]

    The actual U-SQL script for simple output to CSV:
    
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

    Running the script shown below, ADLA took 5 minutes when limited to 10 Analytic Units and processed 177 files, summarizing the output to a CSV file.
    
    ![Screen capture for step 7b][img-query-avro-data-7b]

    Viewing the output, you can see the Avro content has converted to a CSV file. Continue to step 8 if you want to parse the JSON.
    
    ![Screen capture for step 7c][img-query-avro-data-7c]

    
8. Most IoT messages are in JSON format.  Adding the following lines, you can parse the message into JSON, so you can add the WHERE clauses and only output the needed data.

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

9. Viewing the output, you now see columns for each item in the select command. 
    
    ![Screen capture for step 8][img-query-avro-data-8]

## Next steps
In this tutorial, you learned how to query Avro data for efficiently routing messages from Azure IoT Hub to Azure services.

To see examples of complete end-to-end solutions that use IoT Hub, see [Azure IoT Remote Monitoring solution accelerator][lnk-iot-sa-land].

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

[U-SQL Avro Example]:https://github.com/Azure/usql/tree/master/Examples/AvroExamples

[lnk-iot-sa-land]: ../iot-accelerators/index.md
[IoT Hub developer guide]: iot-hub-devguide.md
[lnk-devguide-messaging]: iot-hub-devguide-messaging.md
