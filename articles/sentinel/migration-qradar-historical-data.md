---
title: "Microsoft Sentinel migration: Export QRadar data to target platform | Microsoft Docs"
description: Learn how to export your historical data from QRadar.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
---

# Export historical data from QRadar

This article describes how to export your historical data from QRadar. After you complete the steps in this article, you can [select a target platform](migration-ingestion-target-platform.md) to host the exported data, and then [select an ingestion tool](migration-ingestion-tool.md) to migrate the data.

:::image type="content" source="media/migration-export-ingest/export-data.png" alt-text="Diagram illustrating steps involved in export and ingestion." lightbox="media/migration-export-ingest/export-data.png" border="false":::

To export your QRadar data, you use the QRadar REST API to run Ariel Query Language (AQL) queries on data stored in an Ariel database. Because the export process is resource intensive, we recommend that you use small time ranges in your queries, and only migrate the data you need. 

## Create AQL query

1. In the QRadar Console, select the **Log Activity** tab. 
1. Create a new AQL search query or select a saved search query to export the data. Ensure that the query includes the `START` and `STOP` functions to set the date and time range. 

    Learn how to use [AQL](https://www.ibm.com/docs/en/qsip/7.5?topic=aql-ariel-query-language) and how to [save search criteria](https://www.ibm.com/docs/en/qsip/7.5?topic=searches-saving-search-criteria) in AQL. 

1. Copy the AQL query for later use.
1. Encode the AQL query to the URL encoded format. Paste the query you copied in step 3 [into the decoder](https://www.url-encode-decode.com/). Copy the encoded format output.

## Execute search query

You can execute the search query using one of these methods. 

- **QRadar Console user ID**. To use this method, ensure that the console user ID being used for data migration is assigned to a [security profile](https://www.ibm.com/docs/en/qradar-on-cloud?topic=management-security-profiles) that can access the data you need for the export.
- **API token**. To use this method, [generate an API token in QRadar](https://www.ibm.com/docs/en/qradar-common?topic=app-creating-authorized-service-token-qradar-operations).

To execute the search query:

1. Log in to the system from which you'll download the historical data. Ensure that this system has access to the QRadar Console and QRadar API on TCP/443 via HTTPS. 
1. To execute the search query that retrieves the historical data, open a command prompt and run one of these commands:
    
    - For the QRadar Console user ID method, run: 

        ```
        curl -s -X POST -u <enter_qradar_console_user_id> -H 'Version: 12.0' -H 'Accept: application/json' 'https://<enter_qradar_console_ip_or_hostname>/api/ariel/searches?query_expression=<enter_encoded_AQL_from_previous_step>'
        ```
    - For the API token method, run:
        
        ```
        curl -s -X POST -H 'SEC: <enter_api_token>' -H 'Version: 12.0' -H 'Accept: application/json' 'https://<enter_qradar_console_ip_or_hostname>/api/ariel/searches?query_expression=<enter_encoded_AQL_from_previous_step> 
        ```
            
        The search job execution time may vary, depending on the AQL time range and amount of queried data. We recommended that you run the query in small time ranges, and to query only the data you need for the export.   

        The output should return a status, such as `COMPLETED`, `EXECUTE`, `WAIT`, a `progress` value, and a `search_id` value. For example:

        :::image type="content" source="media/migration-qradar-historical-data/export-output.png" alt-text="Screenshot of the output of the search query command." border="false":::

1. Copy the value in the `search_id` field. You'll use this ID to check the progress and status of the search query execution, and to download the results after the search execution is complete. 
1. To check the status and the progress of the search, run one of these commands:
    - For the QRadar Console user ID method, run: 

        ```
        curl -s -X POST -u <enter_qradar_console_user_id> -H 'Version: 12.0' -H 'Accept: application/json' 'https:// <enter_qradar_console_ip_or_hostname>/api/ariel/searches/<enter_search_id_from_previous_step>' 
        ```
    
    - For the API token method, run:
                
        ```                
        curl -s -X POST -H 'SEC: <enter_api_token>' -H 'Version: 12.0' -H 'Accept: application/json' 'https:// <enter_qradar_console_ip_or_hostname>/api/ariel/searches/<enter_search_id_from_previous_step>' 
        ```

1. Review the output. If the value in the `status` field is `COMPLETED`, continue to the next step. If the status isn't `COMPLETED`, check the value in the `progress` field, and after 5-10 minutes, run the command you ran in step 4. 
1. Review the output and ensure that the status is `COMPELETED`. 
1. Run one of these commands to download the results or returned data from the JSON file to a folder on the current system:
    - For the QRadar Console user ID method, run:
                
        ```                
        curl -s -X GET -u <enter_qradar_console_user_id> -H 'Version: 12.0' -H 'Accept: application/json' 'https:// <enter_qradar_console_ip_or_hostname>/api/ariel/searches/<enter_search_id_from_previous_step>/results' > <enter_path_to_file>.json 
        ```

    - For the API token method, run: 
            
        ```
        curl -s -X GET -H 'SEC: <enter_api_token>' -H 'Version: 12.0' -H 'Accept: application/json' 'https:// <enter_qradar_console_ip_or_hostname>/api/ariel/searches/<enter_search_id_from_previous_step>/results' > <enter_path_to_file>.json 
        ```

1. To retrieve the data that you need to export, [create the AQL query](#create-aql-query) (steps 1-4) and [execute the query](#execute-search-query) (steps 1-7) again. Adjust the time range and search queries to get the data you need. 

## Next steps

- [Select a target Azure platform to host the exported historical data](migration-ingestion-target-platform.md)
- [Select a data ingestion tool](migration-ingestion-tool.md)
- [Ingest historical data into your target platform](migration-export-ingest.md) 