---
title: "API Protection connector for Microsoft Sentinel"
description: "Learn how to install the connector API Protection to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# API Protection connector for Microsoft Sentinel

Connects the 42Crunch API protection to Azure Log Analytics via the REST API interface

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | apifirewall_log_1_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [42Crunch API Protection](https://42crunch.com/) |

## Query samples

**API requests that were rate-limited**
   ```kusto
apifirewall_log_1_CL

   | where TimeGenerated >= ago(30d)

   | where Status_d == 429
   ```

**API requests generating a server error**
   ```kusto
apifirewall_log_1_CL

   | where TimeGenerated >= ago(30d)

   | where Status_d >= 500 and Status_d <= 599
   ```

**API requests failing JWT validation**
   ```kusto
apifirewall_log_1_CL

   | where TimeGenerated >= ago(30d)

   | where Error_Message_s contains "missing [\"x-access-token\"]"
   ```



## Vendor installation instructions

Step 1 : Read the detailed documentation

The installation process is documented in great detail in the GitHub repository [Microsoft Sentinel integration](https://github.com/42Crunch/azure-sentinel-integration). The user should consult this repository further to understand installation and debug of the integration.

Step 2: Retrieve the workspace access credentials

The first installation step is to retrieve both your **Workspace ID** and **Primary Key** from the Sentinel platform.
Copy the values shown below and save them for configuration of the API log forwarder integration.



Step 3: Install the 42Crunch protection and log forwarder

The next step is to install the 42Crunch protection and log forwarder to protect your API. Both components are availabe as containers from the [42Crunch repository](https://hub.docker.com/u/42crunch). The exact installation will depend on your environment, consult the [42Crunch protection documentation](https://docs.42crunch.com/latest/content/concepts/api_firewall_deployment_architecture.htm) for full details. Two common installation scenarios are described below:


Installation via Docker Compose

The solution can be installed using a [Docker compose file](https://github.com/42Crunch/azure-sentinel-integration/blob/main/sample-deployment/docker-compose.yml).

Installation via Helm charts

The solution can be installed using a [Helm chart](https://github.com/42Crunch/azure-sentinel-integration/tree/main/helm/sentinel).

Step 4: Test the data ingestion

In order to test the data ingestion the user should deploy the sample *httpbin* application alongside the 42Crunch protection and log forwarder [described in detail here](https://github.com/42Crunch/azure-sentinel-integration/tree/main/sample-deployment).

4.1 Install the sample

The sample application can be installed locally using a [Docker compose file](https://github.com/42Crunch/azure-sentinel-integration/blob/main/sample-deployment/docker-compose.yml) which will install the httpbin API server, the 42Crunch API protection and the Sentinel log forwarder. Set the environment variables as required using the values copied from step 2.

4.2 Run the sample

Verfify the API protection is connected to the 42Crunch platform, and then exercise the API locally on the *localhost* at port 8080 using Postman, curl, or similar. You should see a mixture of passing and failing API calls. 

4.3 Verify the data ingestion on Log Analytics

After approximately 20 minutes access the Log Analytics workspace on your Sentinel installation, and locate the *Custom Logs* section verify that a *apifirewall_log_1_CL* table exists. Use the sample queries to examine the data.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/42crunch1580391915541.42crunch_sentinel_solution?tab=Overview) in the Azure Marketplace.
