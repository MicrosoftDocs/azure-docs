---
title: Upload usage data to Azure
description: Upload usage Azure Arc-enabled data services data to Azure
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 05/27/2022
ms.topic: how-to
---

# Upload usage data to Azure in **indirect** mode

Periodically, you can export out usage information. The export and upload of this information creates and updates the data controller, SQL managed instance, and PostgreSQL resources in Azure.

> [!NOTE] 
> Usage information is automatically uploaded for Azure Arc data controller deployed in **direct** connectivity mode. The instructions in this article only apply to uploading usage information for Azure Arc data controller deployed in **indirect** connectivity mode..


Wait at least 24 hours after creating the Azure Arc data controller before uploading usage data.

## Create service principal and assign roles

Before you proceed, make sure you have created the required service principal and assigned it to an appropriate role. For details, see:
* [Create service principal](upload-metrics-and-logs-to-azure-monitor.md#create-service-principal).
* [Assign roles to the service principal](upload-metrics-and-logs-to-azure-monitor.md#assign-roles-to-the-service-principal)

[!INCLUDE [azure-arc-angle-bracket-example](../../../includes/azure-arc-angle-bracket-example.md)]

## Upload usage data

Usage information such as inventory and resource usage can be uploaded to Azure in the following two-step way:

1. Export the usage data using `az arcdata dc export` command, as follows:

> [!NOTE]
> Exporting usage/billing information, metrics, and logs using the command `az arcdata dc export` requires bypassing SSL verification for now.  You will be prompted to bypass SSL verification or you can set the `AZDATA_VERIFY_SSL=no` environment variable to avoid prompting.  There is no way to configure an SSL certificate for the data controller export API currently.

   ```azurecli
   az arcdata dc export --type usage --path usage.json --k8s-namespace <namespace> --use-k8s
   ```
 
   This command creates a `usage.json` file with all the Azure Arc-enabled data resources such as SQL managed instances and PostgreSQL instances etc. that are created on the data controller.


For now, the file is not encrypted so that you can see the contents. Feel free to open in a text editor and see what the contents look like.

You will notice that there are two sets of data: `resources` and `data`. The `resources` are the data controller, PostgreSQL, and SQL Managed Instances. The `resources` records in the data capture the pertinent events in the history of a resource - when it was created, when it was updated, and when it was deleted. The `data` records capture how many cores were available to be used by a given instance for every hour.

Example of a `resource` entry:

```console
    {
        "customObjectName": "<resource type>-2020-29-5-23-13-17-164711",
        "uid": "4bc3dc6b-9148-4c7a-b7dc-01afc1ef5373",
        "instanceName": "sqlInstance001",
        "instanceNamespace": "arc",
        "instanceType": "<resource>",
        "location": "eastus",
        "resourceGroupName": "production-resources",
        "subscriptionId": "482c901a-129a-4f5d-86e3-cc6b294590b2",
        "isDeleted": false,
        "externalEndpoint": "32.191.39.83:1433",
        "vCores": "2",
        "createTimestamp": "05/29/2020 23:13:17",
        "updateTimestamp": "05/29/2020 23:13:17"
    }
```

Example of a `data` entry:

```console
        {
          "requestType": "usageUpload",
          "clusterId": "4b0917dd-e003-480e-ae74-1a8bb5e36b5d",
          "name": "DataControllerTestName",
          "subscriptionId": "482c901a-129a-4f5d-86e3-cc6b294590b2",
          "resourceGroup": "production-resources",
          "location": "eastus",
          "uploadRequest": {
            "exportType": "usages",
            "dataTimestamp": "2020-06-17T22:32:24Z",
            "data": "[{\"name\":\"sqlInstance001\",
                       \"namespace\":\"arc\",
                       \"type\":\"<resource type>\",
                       \"eventSequence\":1, 
                       \"eventId\":\"50DF90E8-FC2C-4BBF-B245-CB20DC97FF24\",
                       \"startTime\":\"2020-06-17T19:11:47.7533333\",
                       \"endTime\":\"2020-06-17T19:59:00\",
                       \"quantity\":1,
                       \"id\":\"4BC3DC6B-9148-4C7A-B7DC-01AFC1EF5373\"}]",
           "signature":"MIIE7gYJKoZIhvcNAQ...2xXqkK"
          }
        }
```



2. Upload the usage data using the `upload` command.

   ```azurecli
   az arcdata dc upload --path usage.json
   ```

## Upload frequency

In the **indirect** mode, usage information needs to be uploaded to Azure at least once in every 30 days. It is highly recommended to upload more frequently, such as daily. If usage information is not uploaded past 32 days, you will see some degradation in the service such as being unable to provision any new resources. 

There will be two types of notifications for delayed usage uploads - warning phase and degraded phase. In the warning phase there will be a message such as `Billing data for the Azure Arc data controller has not been uploaded in {0} hours.  Please upload billing data as soon as possible.`. 

In the degraded phase, the message will look like `Billing data for the Azure Arc data controller has not been uploaded in {0} hours.  Some functionality will not be available until the billing data is uploaded.`.

> [!NOTE]
> You will see the warning message if usage has not been uploaded for more than 48 hours. 

The Azure portal Overview page for Data Controller and the Custom Resource status of the Data controller in your kubernetes cluster will  both indicate the last upload date and the status message(s).



## Automating uploads (optional)

If you want to upload metrics and logs on a scheduled basis, you can create a script and run it on a timer every few minutes. Below is an example of automating the uploads using a Linux shell script.

In your favorite text/code editor, add the following script to the file and save as a script executable file such as `.sh` (Linux/Mac) or `.cmd`, `.bat`, or `.ps1`.

```azurecli
az arcdata dc export --type usage --path usage.json --force --k8s-namespace <namespace> --use-k8s
az arcdata dc upload --path usage.json
```

Make the script file executable

```console
chmod +x myuploadscript.sh
```

Run the script every day for usage:

```console
watch -n 1200 ./myuploadscript.sh
```

You could also use a job scheduler like cron or Windows Task Scheduler or an orchestrator like Ansible, Puppet, or Chef.

## Related content

[Upload metrics, and logs to Azure Monitor](upload-metrics.md)

[Upload logs to Azure Monitor](upload-logs.md)

[Upload billing data to Azure and view it in the Azure portal](view-billing-data-in-azure.md)

[View Azure Arc data controller resource in Azure portal](view-data-controller-in-azure-portal.md)
